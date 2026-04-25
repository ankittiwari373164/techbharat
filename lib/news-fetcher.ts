// lib/news-fetcher.ts (FIXED)
// ═══════════════════════════════════════════════════════════════
// IMPROVEMENTS:
//   1. Variable article length (600-2000 words, NOT forced 1600-1800)
//   2. Diverse structural patterns (no templates)
//   3. Real author voice (opinions, frustrations, genuine excitement)
//   4. Removes all rumor/leak content (AdSense compliance)
//   5. India-specific grounding with real context
//   6. Internal linking limited to 2-3 per article (natural flow)
//   7. Human-first rewriting (conversational, imperfect)
// ═══════════════════════════════════════════════════════════════

import { Article, generateSlug } from './store'
import { getArticleImages, getUniqueUnsplashImage } from './phone-images'

const NEWSAPI_KEY       = process.env.NEWSAPI_KEY       || ''
const GNEWS_API_KEY     = process.env.GNEWS_API_KEY     || ''
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY || ''
const GROQ_API_KEY      = process.env.GROQ_API_KEY      || ''

export interface RawNewsItem {
  title:        string
  brand:        string
  type:         'mobile-news' | 'review' | 'compare'
  summary:      string
  bullets:      string[]
  fullContent:  string
  tags:         string[]
  quickBullets: string[]
}

interface RawArticle {
  title:       string
  description: string
  content:     string
  url:         string
  publishedAt: string
}

const delay = (ms: number) => new Promise(r => setTimeout(r, ms))

const MOBILE_BRANDS = [
  'Samsung','Apple','iPhone','Xiaomi','OnePlus','Realme','Vivo','OPPO',
  'iQOO','Poco','Motorola','Nothing','Google Pixel','Sony Xperia',
  'Redmi','Honor','Infinix','Tecno','Lava',
]

function detectBrand(title: string): string {
  const t = title.toLowerCase()
  for (const b of MOBILE_BRANDS) {
    if (t.includes(b.toLowerCase())) return b
  }
  return 'Mobile'
}

function detectType(title: string): 'mobile-news' | 'review' | 'compare' {
  const t = title.toLowerCase()
  if (t.includes('review') || t.includes('verdict') || t.includes('rating') || t.includes('hands-on')) return 'review'
  if (t.includes(' vs ') || t.includes('compare') || t.includes('comparison') || t.includes('versus')) return 'compare'
  return 'mobile-news'
}

// STRICT: Only fetch confirmed, launched, or officially announced products
// DELETE: Rumors, leaks, speculation, unconfirmed specs
const BANNED_PATTERNS = [
  // Rumor/leak content — NO
  /\b(leaked?|leaks?|leak suggests?|tipped|tipster|rumou?r|rumou?red|reportedly|unconfirmed)\b/i,
  // Concept/render — NO
  /\b(concept|render|fan.made|unofficial)\b/i,
  // Pure speculation — NO
  /\b(patent filed|patent reveals|expected to|could launch|might launch|may launch|prediction|forecast|alleged)\b/i,
  // Clickbait — NO
  /\b(shocking|mind.?blowing|you won.t believe|game.?changer|revolutionary|disrupts?)\b/i,
  // Off-topic — NO
  /\b(cricket|football|bollywood|politics|stock market|crypto|nft|bitcoin|murder|accident|assault|weather|celebrity)\b/i,
  // Thin spec dumps — NO
  /\b(full specs leaked|specs? sheet|spec list)\b/i,
  // AI-generated looking content — NO
  /\b(in today.s world|in today.s fast|in the digital age|in the ever-evolving|it goes without saying|needless to say)\b/i,
]

const REQUIRED_KEYWORDS = [
  'smartphone','phone','mobile','iphone','android','5g','camera','battery',
  'flagship','oneplus','samsung','xiaomi','pixel','realme','poco','oppo',
  'vivo','iqoo','nothing','motorola','launch','announced','available',
]

function isConfirmedContent(title: string, desc: string): boolean {
  const text = (title + ' ' + desc).toLowerCase()
  
  // MUST contain at least one mobile tech keyword
  if (!REQUIRED_KEYWORDS.some(k => text.includes(k))) return false
  
  // MUST NOT match banned patterns (rumor, leak, speculation, etc.)
  if (BANNED_PATTERNS.some(p => p.test(title))) return false
  
  // Title quality check
  if (!title || title === '[Removed]' || title.length < 20) return false
  
  // Require substance
  return REQUIRED_KEYWORDS.some(k => title.toLowerCase().includes(k))
}

// ── NEWSAPI ──────────────────────────────────────────────────────
async function fetchFromNewsAPI(): Promise<RawArticle[]> {
  if (!NEWSAPI_KEY) throw new Error('NEWSAPI_KEY not set')
  const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  const q = encodeURIComponent('smartphone launch OR "mobile phone" announced OR iPhone OR Samsung OR Xiaomi OR OnePlus OR announcement')
  const url = `https://newsapi.org/v2/everything?q=${q}&from=${yesterday}&sortBy=popularity&language=en&pageSize=30&apiKey=${NEWSAPI_KEY}`
  const res = await fetch(url, { next: { revalidate: 0 } })
  if (!res.ok) throw new Error(`NewsAPI ${res.status}: ${(await res.text()).slice(0, 200)}`)
  const data = await res.json()
  if (data.status !== 'ok') throw new Error(`NewsAPI error: ${data.message}`)
  return (data.articles || []).map((a: Record<string, string>) => ({
    title: a.title || '', description: a.description || '',
    content: a.content || a.description || '', url: a.url || '',
    publishedAt: a.publishedAt || new Date().toISOString(),
  }))
}

// ── GNEWS ────────────────────────────────────────────────────────
async function fetchFromGNews(): Promise<RawArticle[]> {
  if (!GNEWS_API_KEY) throw new Error('GNEWS_API_KEY not set')
  const q = encodeURIComponent('smartphone launch OR "mobile phone" announced OR iPhone OR Samsung OR OnePlus OR Xiaomi')
  const url = `https://gnews.io/api/v4/search?q=${q}&lang=en&country=in&max=30&sortby=publishedAt&apikey=${GNEWS_API_KEY}`
  const res = await fetch(url, { next: { revalidate: 0 } })
  if (!res.ok) throw new Error(`GNews ${res.status}: ${(await res.text()).slice(0, 200)}`)
  const data = await res.json()
  return (data.articles || []).map((a: Record<string, string>) => ({
    title: a.title || '', description: a.description || '',
    content: a.content || a.description || '', url: a.url || '',
    publishedAt: a.publishedAt || new Date().toISOString(),
  }))
}

// ── FILTER: ONLY CONFIRMED/ANNOUNCED PRODUCTS ────────────────────
function pickTopStories(raw: RawArticle[], limit = 8): RawArticle[] {
  const seen = new Set<string>()
  const results: RawArticle[] = []
  for (const a of raw) {
    if (!a.title || a.title === '[Removed]') continue
    if (!isConfirmedContent(a.title, a.description)) continue
    const key = a.title.toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 40)
    if (seen.has(key)) continue
    seen.add(key)
    results.push(a)
    if (results.length >= limit) break
  }
  return results
}

// ════════════════════════════════════════════════════════════════
//  IMPROVED SYSTEM PROMPT: Real Voice, No Templates, Variable Structure
// ════════════════════════════════════════════════════════════════
const HUMAN_SYSTEM_PROMPT = `You are Vijay Yadav. Senior Mobile Editor at The Tech Bharat, based in New Delhi. 11 years covering Indian smartphone market, reviewed 300+ devices. You are direct, occasionally sarcastic, genuinely excited by good hardware, frustrated by marketing fluff.

═══ YOUR VOICE (Non-Negotiable) ═══

1. OPINIONS ARE MANDATORY
   - At least 3 per article: "I think", "In my experience", "My honest take", "Personally"
   - One sentence of frustration OR excitement — pick ONE that fits the story
   - Example: "I'm honestly baffled why Samsung keeps pushing price at this tier" OR "This is the first time in 3 years I'm genuinely excited about a mid-range phone"

2. SENTENCE RHYTHM (Most Important)
   - Mix extremely short with extremely long
   - Never uniform. Ever.
   - Some paragraphs: 2-3 sentences. Others: 6-8.
   - At least 3 sentences under 8 words each
   - At least 2 sentences over 35 words each
   - Fragments work: "Look," "Right." "And honestly?"
   - Em-dashes for asides: "The thing is — this phone feels rushed"

3. CONVERSATIONAL STARTERS (Natural, not forced)
   - "And honestly,"
   - "But here's the thing —"
   - "Look,"
   - "So,"
   - "The thing is,"
   - "Fair enough."
   - "Which is great."

4. IMPERFECTIONS MAKE YOU HUMAN
   - Repeat words for emphasis: "really really solid", "fast — genuinely fast"
   - Use contractions: it's, don't, isn't, you're, they've, won't
   - Rhetorical questions every 3-4 paragraphs: "Is it worth ₹50K though?"
   - Occasional overstatement: "This is the worst camera tuning I've seen in 5 years"

5. INDIA GROUNDING (Non-Negotiable)
   - Price in ₹ always (estimate if needed)
   - Flipkart or Amazon India availability
   - 5G bands for India (n78/n77)
   - Indian heat/dust/humidity context
   - Compare to actual Indian market rival at similar price
   - Service centre accessibility in India
   - EMI or festive sale context

6. NEVER USE THESE PHRASES
   "in conclusion" | "in summary" | "to summarize" | "furthermore" | "moreover" | "in today's world" | "in today's fast-paced" | "cutting-edge" | "groundbreaking" | "revolutionary" | "seamless" | "leverage" | "utilize" | "comprehensively" | "this highlights the significance" | "a plethora of" | "explore" (as verb) | "unlock" (metaphorical) | "transform" (overused) | "first and foremost" | "all in all" | "it is evident that" | "it is clear that" | "in the ever-evolving" | "at the end of the day"

7. STRUCTURE RULES
   - Do NOT write: Introduction → Point 1 → Point 2 → Conclusion
   - Start with the MOST INTERESTING thing
   - No uniform heading structure
   - Mix storytelling with analysis
   - Vary paragraph length wildly
   - End with YOUR honest verdict (not a balanced summary)

8. ARTICLE LENGTH VARIES
   - NOT 1600-1800 words forced
   - Can be 600 words (if that's enough)
   - Can be 2200 words (if there's substance)
   - Length = story, not template
   - Word count flows naturally from content

9. AVOID AI DETECTION PATTERNS
   - Never start 3+ consecutive sentences with "The [noun]"
   - Don't use "Firstly, Secondly, Thirdly"
   - Don't repeat the same sentence structure for specs
   - Don't end with a generic balanced summary
   - Avoid: "This phone comes with powerful performance"
   - Avoid: "Users can enjoy a seamless experience"
   - Avoid: "The device packs impressive specifications"
   - Avoid uniform spec descriptions

10. WHEN ARTICLE IS ABOUT RUMORED/LEAKED PRODUCT
    - CLEARLY signal this upfront
    - Never write as if you've tested it
    - Use: "leaks suggest", "sources claim", "if true"
    - Title must signal: "Expected", "Leaked", "What We Know", "Should You Wait?"
    - Include disclaimer: "These are unconfirmed specs until official announcement"

11. WHEN ARTICLE IS ABOUT LAUNCHED/ANNOUNCED PRODUCT
    - Write with confidence about confirmed facts
    - You may use: "From what official specs tell us", "Based on announced features"
    - For launched phones: analytical first-person OK
    - For pre-launch: NEVER claim personal testing

12. TITLE STRATEGY
    - If topic is bland: "Samsung Galaxy X specs" → "Samsung Galaxy X: Is India's ₹80K Investment Actually Worth It?"
    - Always end with question or opinion
    - Include ₹ or specific comparison
    - Real readers click on these, not specs
    - Examples:
      * "OnePlus 14: Better Value Than iPhone 17?"
      * "Realme X at ₹25K: Budget King or Overhyped?"
      * "Samsung Galaxy S26: Why the Price Increase Frustrates Me"

═══ MANDATORY CONTENT ELEMENTS ═══
1. One "Vijay's Take" or "My Honest Assessment" paragraph
2. One India market comparison (specific competitor at same price)
3. One real-usage scenario (Delhi metro, college student, Bangalore traffic)
4. One India-specific context note (5G bands, heat, service centres, EMI)
5. One sentence of skepticism OR genuine excitement (not both)
6. Natural internal links (2-3 max, contextual, not every paragraph)

═══ FACTUAL ACCURACY MANDATE ═══
- ONLY write about real, confirmed, launched, or officially announced products
- NO invented specs, prices, or availability
- NO testing claims for unreleased products
- NO "expected to launch" written as "will launch"
- If product unreleased: clearly label as speculation
- If product launched: write as confirmed fact`

function getSystemPrompt(): string {
  return HUMAN_SYSTEM_PROMPT
}

function buildUserPrompt(raw: RawArticle, brand: string, type: string): string {
  const isReview  = type === 'review'
  const isCompare = type === 'compare'
  const isNews    = !isReview && !isCompare

  const today = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })

  return `CRITICAL: This article will be reviewed by Google AdSense. Content must be:
1. About a REAL, CONFIRMED, LAUNCHED, or OFFICIALLY ANNOUNCED product (no rumors/leaks)
2. Substantive and valuable (at least 800 words)
3. High quality (not thin/spam content)
4. Factually accurate (no invented specs or false claims)
5. With author opinion and voice (not neutral AI tone)

═══ CONTENT QUALITY MANDATE ═══
This is NOT a marketing puff piece. Be honest:
- What's actually good about this product?
- What's the real competition at this price?
- Who should genuinely buy it and who should skip it?
- What's missing or disappointing?

NEVER accept:
- "After testing..." for unreleased products
- "Expected to feature..." stated as "will feature"
- Pure leak/rumor articles
- Competitor attacks without substance
- Fake review language for unconfirmed products

═══ ARTICLE STRUCTURE (NOT A TEMPLATE — ADAPT) ═══
${isNews ? `
NEWS ARTICLE:
- Opening: What happened and why it matters NOW (not 3 paragraphs of context)
- Technical breakdown: What the announcement actually means
- India angle: Price in ₹, Flipkart/Amazon, 5G bands, who will buy
- Market positioning: How this compares to competitors
- Vijay's take: Your honest opinion on whether this matters
- Closing: Clear verdict for Indian buyers

OPTIONAL: Specs table only if necessary for clarity
NO: Fake disclaimer "Source note" unless product is actually unreleased
` : ''}
${isReview ? `
REVIEW ARTICLE:
- Opening: Honest framing — is this launched in India? What do we know?
- Design & build: Real description (not marketing speak)
- Display & performance: What specs mean for actual use
- Camera: Based on official samples or spec analysis
- Battery & 5G: India-specific context (heat, bands, real-world usage)
- Pricing & competition: Compare to 2-3 rivals on Flipkart/Amazon with ₹
- Specs table: 8+ rows, factual only
- Pros/Cons: Honest, not marketing language
- Verdict: Exactly who should buy, who should wait, who should skip

FRAMING RULE:
- If LAUNCHED in India: Write as confident analysis
- If ANNOUNCED (not launched): Title signals "Coming Soon" or "Expected", text uses "expected to", "announced specs show"
- If RUMORED/LEAKED: Title signals "Leaked" or "What We Know", clearly label as unconfirmed
` : ''}
${isCompare ? `
COMPARISON ARTICLE:
- Opening: The real buying dilemma (2+ paragraphs)
- Specs table: 8+ rows (price, display, chip, RAM, battery, camera, 5G, software)
- Real-world differences: Gaming, camera, daily use (3+ paragraphs)
- India factors: Service, warranty, EMI, exchange offers (2+ paragraphs)
- Buyer personas: Exactly who should pick Phone A vs Phone B (2+ paragraphs)
- Value verdict: Which offers better rupee-per-value (2+ paragraphs)
- Closing: ONE clear recommendation with exact reasoning

NEVER say "depends on your needs" without specifying WHICH needs determine the choice
` : ''}

═══ INDIA-SPECIFIC MANDATORY ELEMENTS ═══
- Price: Always in ₹ (estimate if needed, mark as "expected")
- Availability: Flipkart, Amazon, or "pre-order status"
- 5G bands: Mention n78 or n77 for India
- Context: Heat/humidity/dust for durability
- Competitor: Direct comparison at same price point
- Service: Mention service centre availability in India

═══ LENGTH GUIDANCE ═══
- NOT forced 1600-1800 words
- Minimum: 800 words (substantial value)
- Natural length: 900-2000 words depending on story
- Quality > Quantity: A tight 1000-word article beats a padded 1800-word one

═══ INTERNAL LINKS (2-3 MAX, NATURAL) ═══
1. Brand pillar: Samsung articles → Best Samsung Phones / Apple → Best iPhones
2. Buying guide: Smartphone Buying Guide India
3. Optional: Related topic or comparison

Always embed links INSIDE paragraphs contextually, not in a separate list.

FACTS FROM SOURCE:
${(raw.description + ' ' + raw.content).replace(/\[.*?\]/g, '').trim().slice(0, 1000)}

BRAND: ${brand}
TYPE: ${type}
DATE: ${today}

═══ OUTPUT FORMAT ═══
Return ONLY valid JSON. No markdown fences. No text outside JSON.

{
  "title": "Specific, factual, curiosity-driven title with ₹ or comparison. Max 70 chars.",
  "brand": "${brand}",
  "type": "${type}",
  "summary": "3 sentences. Conversational, with opinion. No banned phrases.",
  "bullets": [
    "Specific fact with number or ₹",
    "India context (price, availability, 5G)",
    "Honest criticism or limitation",
    "Competitor comparison",
    "Your opinion or prediction"
  ],
  "fullContent": "Variable length article (800-2000 words). NO forced length. Structure varies by type. Include h2 headings (not h1 — page has that). Specs table if helpful. Pros/Cons table if review. Include FAQ schema at end. Use <p>, <h2>, <h3>, <table>, <strong>, <ul>, <li>, <a> tags ONLY. British English. NO source attribution in body.",
  "tags": ["brand model", "price range", "type of phone", "review/compare/news", "relevant keywords"],
  "quickBullets": ["7 words max", "Key fact", "One-line verdict"]
}`
}

// ── CALL ANTHROPIC ──────────────────────────────────────────────
async function rewriteWithAnthropic(raw: RawArticle): Promise<RawNewsItem> {
  const brand = detectBrand(raw.title)
  const type  = detectType(raw.title)

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 8000,
      system: getSystemPrompt(),
      messages: [{ role: 'user', content: buildUserPrompt(raw, brand, type) }],
    }),
  })

  if (!res.ok) throw new Error(`Anthropic ${res.status}: ${(await res.text()).slice(0, 300)}`)
  const data = await res.json()
  const text = data.content
    .filter((b: { type: string }) => b.type === 'text')
    .map((b: { text: string }) => b.text)
    .join('\n')

  const clean = text.replace(/^```json\s*/m, '').replace(/```\s*$/m, '').trim()
  const match = clean.match(/\{[\s\S]*\}/)
  if (!match) throw new Error('Anthropic: no JSON in response')
  return JSON.parse(match[0]) as RawNewsItem
}

// ── CALL GROQ ──────────────────────────────────────────────────
async function rewriteWithGroq(raw: RawArticle): Promise<RawNewsItem> {
  if (!GROQ_API_KEY) throw new Error('GROQ_API_KEY not set')
  const brand = detectBrand(raw.title)
  const type  = detectType(raw.title)

  const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      max_tokens: 8000,
      temperature: 0.88,
      messages: [
        { role: 'system', content: getSystemPrompt() },
        { role: 'user',   content: buildUserPrompt(raw, brand, type) },
      ],
    }),
  })

  if (!res.ok) throw new Error(`Groq ${res.status}: ${(await res.text()).slice(0, 300)}`)
  const data  = await res.json()
  const text  = data.choices?.[0]?.message?.content || ''
  const clean = text.replace(/^```json\s*/m, '').replace(/```\s*$/m, '').trim()
  const match = clean.match(/\{[\s\S]*\}/)
  if (!match) throw new Error('Groq: no JSON in response')
  return JSON.parse(match[0]) as RawNewsItem
}

// ── REWRITE WITH FALLBACK ──────────────────────────────────────
async function rewriteArticle(raw: RawArticle): Promise<RawNewsItem> {
  if (ANTHROPIC_API_KEY) {
    try {
      const result = await rewriteWithAnthropic(raw)

      // ✅ ADD: thin content filter (Anthropic)
      const contentA = (result.fullContent || '').replace(/<[^>]*>/g, '')
      const wcA = contentA.split(/\s+/).filter(Boolean).length
      if (wcA < 800) {
        console.warn('[TB] Skipped thin AI article (Anthropic)')
        throw new Error('Thin content')
      }

      return result

    } catch (err: unknown) {
      const e = err as Error
      const isRate = e.message?.includes('429') || e.message?.includes('rate_limit')
      console.warn(`[TB] Anthropic failed (${e.message?.slice(0,80)}) — trying Groq...`)
      if (isRate) await delay(8000)
    }
  }

  const result = await rewriteWithGroq(raw)

  // ✅ ADD: thin content filter (Groq)
  const contentB = (result.fullContent || '').replace(/<[^>]*>/g, '')
  const wcB = contentB.split(/\s+/).filter(Boolean).length
  if (wcB < 800) {
    console.warn('[TB] Skipped thin AI article (Groq)')
    throw new Error('Thin content')
  }

  return result
}

// ── MAIN EXPORT ────────────────────────────────────────────────
export async function fetchAndRewriteNews(): Promise<RawNewsItem[]> {
  let rawArticles: RawArticle[] = []

  if (NEWSAPI_KEY) {
    try {
      console.log('[TB] Fetching from NewsAPI...')
      rawArticles = await fetchFromNewsAPI()
      console.log(`[TB] NewsAPI: ${rawArticles.length} articles`)
    } catch (err) {
      console.warn(`[TB] NewsAPI failed: ${(err as Error).message}`)
    }
  }
  if (rawArticles.length === 0 && GNEWS_API_KEY) {
    try {
      console.log('[TB] Fetching from GNews...')
      rawArticles = await fetchFromGNews()
      console.log(`[TB] GNews: ${rawArticles.length} articles`)
    } catch (err) {
      throw new Error(`Both news sources failed: ${(err as Error).message}`)
    }
  }
  if (rawArticles.length === 0) throw new Error('No news sources available. Set NEWSAPI_KEY or GNEWS_API_KEY in .env.local')

  const picked = pickTopStories(rawArticles, 6) // Reduced from 8 to 6 per day for quality
  console.log(`[TB] Selected ${picked.length} stories`)

  const rewritten: RawNewsItem[] = []
  for (let i = 0; i < picked.length; i++) {
    console.log(`[TB] Rewriting ${i+1}/${picked.length}: ${picked[i].title.slice(0,55)}`)
    try {
      if (i > 0) await delay(4000)
      rewritten.push(await rewriteArticle(picked[i]))
    } catch (err) {
      console.error(`[TB] Skipped ${i+1}: ${(err as Error).message}`)
    }
  }
  console.log(`[TB] Done: ${rewritten.length} articles`)
  return rewritten
}

// ── BUILD ARTICLE OBJECTS ─────────────────────────────────────
export async function buildArticles(rawItems: RawNewsItem[]): Promise<Article[]> {
  const articles: Article[] = []
  const now = new Date()
  const sessionUsedIds = new Set<string>()

  for (let i = 0; i < rawItems.length; i++) {
    const item = rawItems[i]
    const slug = generateSlug(item.title)
    const rawText = (item.fullContent || '').replace(/<[^>]*>/g, '')
    const wc   = rawText.split(/\s+/).filter(Boolean).length
    const rt   = Math.max(5, Math.ceil(wc / 220))
    
    if (wc < 800) {
      console.warn(`[TB:quality] Thin article (${wc} words): ${item.title}`)
      continue // Skip thin articles
    }

    const images: string[] = []
    const imgQuery = item.type === 'compare'
      ? 'smartphone technology india'
      : `${item.brand} smartphone`
    for (let j = 0; j < 5; j++) {
      const img = await getUniqueUnsplashImage(imgQuery, sessionUsedIds)
      if (img) images.push(img)
    }

    articles.push({
      id:            `${now.getTime()}-${i}`,
      slug,
      title:         item.title,
      type:          item.type as 'mobile-news' | 'review' | 'compare',
      category:      item.type === 'review' ? 'Reviews' : item.type === 'compare' ? 'Compare' : 'Mobile News',
      brand:         (() => {
        const detected = detectBrand(item.title)
        if (detected !== 'Mobile') return detected
        return (item.brand && item.brand !== 'Mobile') ? item.brand : detected
      })(),
      publishDate:   now.toISOString(),
      author:        'Vijay Yadav',
      readTime:      rt,
      featuredImage: images[0] || '',
      images,
      summary:       item.summary      || '',
      bullets:       item.bullets      || [],
      content:       item.fullContent  || '',
      tags:          item.tags         || [],
      relatedSlugs:  [],
      reviews:       [],
      quickSummary: {
        brand:   (() => { const d = detectBrand(item.title); return d !== 'Mobile' ? d : (item.brand || d) })(),
        date:    now.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
        bullets: item.quickBullets || [],
      },
      seoTitle:       (item.title.length > 50 ? item.title.slice(0, 47) + '...' : item.title),
      seoDescription: ((item.summary || '').replace(/<[^>]*>/g, '').slice(0, 152) + (item.summary.length > 152 ? '...' : '')),
      isFeatured:     i === 0,
      updatedDate:    now.toISOString(),
      wordCount:      wc,
      isEvergreen:    false,
    } as any)
  }

  articles.forEach((a, idx) => {
    a.relatedSlugs = articles.filter((_,j) => j !== idx).slice(0, 4).map(b => b.slug)
  })
  return articles
}

// ── FETCH SINGLE ARTICLE ─
export async function fetchSingleArticle(
  type: 'mobile-news' | 'review' | 'compare',
  existingArticles: { title: string; brand: string; publishDate: string }[]
): Promise<RawNewsItem | null> {
  const { isDuplicate } = await import('./scheduler')

  let rawArticles: RawArticle[] = []
  if (NEWSAPI_KEY) {
    try { rawArticles = await fetchFromNewsAPI() } catch { /* silent */ }
  }
  if (rawArticles.length === 0 && GNEWS_API_KEY) {
    try { rawArticles = await fetchFromGNews() } catch (err) {
      throw new Error(`News sources failed: ${(err as Error).message}`)
    }
  }
  if (rawArticles.length === 0) throw new Error('No news sources available')

  const candidates = rawArticles.filter(a => {
    if (!a.title || a.title === '[Removed]') return false
    if (!isConfirmedContent(a.title, a.description)) return false

    const t = a.title.toLowerCase()
    if (type === 'review') {
      return t.includes('review') || t.includes('verdict') || t.includes('hands-on') || t.includes('rating')
    }
    if (type === 'compare') {
      return t.includes(' vs ') || t.includes('compare') || t.includes('comparison') || t.includes('versus')
    }
    return !t.includes('review') && !t.includes(' vs ') && !t.includes('comparison')
  })

  const brand = (title: string) => detectBrand(title)
  const fresh = candidates.filter(a => !isDuplicate(a.title, brand(a.title), existingArticles))

  if (fresh.length === 0) {
    const fallback = rawArticles
      .filter(a => isConfirmedContent(a.title, a.description || ''))
      .filter(a => !isDuplicate(a.title, brand(a.title), existingArticles))

    if (fallback.length === 0) return null
    fallback.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    return rewriteArticle({ ...fallback[0] })
  }

  fresh.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
  const target = fresh[0]
  const rewritten = await rewriteArticle(target)
  rewritten.type = type
  return rewritten
}