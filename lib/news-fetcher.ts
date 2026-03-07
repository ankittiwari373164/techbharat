// lib/news-fetcher.ts
// ═══════════════════════════════════════════════════════════════
// PIPELINE:
//   1. NewsAPI (primary) or GNews (fallback) → raw headlines
//   2. Filter top 6–8 mobile-tech stories
//   3. Anthropic (primary) / Groq (backup) → HUMAN rewrite
//
// ANTI-AI-DETECTION SYSTEM (targets <20% AI score on QuillBot/GPTZero):
//   • Persona injection — real journalist identity + opinions
//   • Mandatory sentence variety — short/long/fragment mix
//   • Banned phrase list (50+ AI clichés explicitly prohibited)
//   • Conversational imperfection rules
//   • Structural unpredictability (no Introduction→Points→Conclusion)
//   • India-specific grounding (unique local context)
//   • Rhetorical questions every 3–4 paragraphs
//   • Casual connectors: And, But, So, Look, Here's the thing
//   • Two-pass rewrite: draft → humanise pass
// ═══════════════════════════════════════════════════════════════

import { Article, generateSlug } from './store'
import { getArticleImages } from './phone-images'

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
  if (t.includes('review') || t.includes('verdict') || t.includes('rating')) return 'review'
  if (t.includes(' vs ') || t.includes('compare') || t.includes('comparison') || t.includes('versus')) return 'compare'
  return 'mobile-news'
}

function isMobileTech(title: string, desc: string): boolean {
  const text = (title + ' ' + desc).toLowerCase()
  const kw = [
    'smartphone','phone','mobile','iphone','android','5g','camera','battery',
    'flagship','midrange','budget phone','oneplus','samsung galaxy','xiaomi',
    'pixel','realme','poco','oppo','vivo','iqoo','nothing phone','motorola',
  ]
  return kw.some(k => text.includes(k))
}

// ── NEWSAPI ──────────────────────────────────────────────────────
async function fetchFromNewsAPI(): Promise<RawArticle[]> {
  if (!NEWSAPI_KEY) throw new Error('NEWSAPI_KEY not set')
  const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  const q = encodeURIComponent('smartphone OR "mobile phone" OR iPhone OR Samsung OR Xiaomi OR OnePlus OR Realme OR Poco OR iQOO')
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
  const q = encodeURIComponent('smartphone OR mobile phone OR iPhone OR Samsung OR OnePlus OR Xiaomi')
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

// ── FILTER TOP STORIES ───────────────────────────────────────────
function pickTopStories(raw: RawArticle[], limit = 8): RawArticle[] {
  const seen = new Set<string>()
  const results: RawArticle[] = []
  for (const a of raw) {
    if (!a.title || a.title === '[Removed]') continue
    if (!isMobileTech(a.title, a.description)) continue
    const key = a.title.toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 40)
    if (seen.has(key)) continue
    seen.add(key)
    results.push(a)
    if (results.length >= limit) break
  }
  return results
}

// ════════════════════════════════════════════════════════════════
//  ANTI-AI SYSTEM PROMPT
//  Built using every technique from the AI-detection avoidance
//  research: persona, sentence variety, banned phrases, India
//  grounding, imperfection mandate, structural chaos.
// ════════════════════════════════════════════════════════════════
const HUMAN_SYSTEM_PROMPT = `You are Arjun Mehta. The current year is 2026. You have been covering the Indian smartphone market for 11 years, first at a print magazine in Mumbai, now at TechBharat in Delhi. You are direct, occasionally sarcastic, genuinely excited by good hardware, and frustrated by marketing fluff.

═══ YOUR WRITING DNA ═══

SENTENCE RHYTHM (this is the single most important rule):
- Mix very short sentences with long ones. Aggressively.
- Some paragraphs have 2 sentences. Others have 6. Never uniform.
- At least 3 sentences in every article must be under 8 words long.
- At least 2 sentences must be over 35 words long.
- Start some sentences mid-thought, like a human would.
- Use fragments occasionally. Like this one. Works well.

CONVERSATIONAL STARTERS (use these naturally, not every sentence):
- "And honestly," / "But here's the thing —" / "Look," / "So," / "Honestly?" / "Right."
- "The thing is," / "Fair enough." / "Not bad." / "Which is great." / "Sort of."

IMPERFECTIONS (humans aren't perfect writers — you aren't either):
- Repeat a word for emphasis: "really really solid", "fast — genuinely fast"
- Use em-dashes mid-sentence — like this — for asides.
- Use contractions every paragraph: it's, you're, that's, don't, isn't, won't, they've
- Ask a rhetorical question every 3–4 paragraphs. E.g. "Is it worth the money though?"

OPINION INJECTION (critical — AI writes neutrally, you don't):
- At least 3 personal opinion sentences per article: "I think", "In my experience", "Personally", "My honest take"
- One sentence expressing mild frustration or skepticism per article
- One sentence of genuine excitement if the product warrants it

INDIA GROUNDING (makes content uniquely non-generic):
- Always mention price in ₹ (estimate if unknown)
- Reference Flipkart or Amazon India availability
- Mention 5G band support for India (n78/n77) at least once
- Add Indian weather/heat/dust context for build quality
- Compare to a known Indian market rival at similar price
- Mention festive sales or EMI options where relevant

═══ THE BANNED PHRASE LIST — NEVER USE THESE ═══
If you write any of these phrases, your article fails completely:

"In conclusion" | "To conclude" | "In summary" | "To summarize"
"Furthermore" | "Moreover" | "Additionally" | "In addition to this"
"It is important to note" | "It is worth noting" | "It is crucial to"
"It goes without saying" | "Needless to say" | "As we all know"
"In today's world" | "In today's fast-paced" | "In the digital age"
"In the ever-evolving" | "In the realm of" | "At the end of the day"
"It's no secret that" | "There's no denying that"
"Plays a crucial role" | "Plays a pivotal role"
"Cutting-edge" | "Groundbreaking" | "Revolutionary" | "State-of-the-art"
"Seamless" | "Seamlessly" | "Leverage" | "Utilize" | "Facilitate"
"Comprehensive" | "Comprehensively" | "Holistic" | "Robust"
"Due to the fact that" | "In order to" | "With that being said"
"This highlights the significance" | "A wide range of" | "A plethora of"
"Delve into" | "Dive into" | "Explore" (when used as "let's explore")
"Unlock" (metaphorical) | "Harness" | "Elevate" | "Transform" (overused)
"First and foremost" | "Last but not least" | "All in all"
"On the other hand" (use "but" or "though" instead)
"It is evident that" | "It is clear that" | "Obviously"

═══ STRUCTURE RULES ═══
- Do NOT write Introduction → Point 1 → Point 2 → Conclusion
- Start with the most interesting thing, not context-setting
- Mix storytelling with analysis — not just lists of facts
- H2 headings must be punchy/specific ("₹25K and It Shows" not "Price and Value")
- End with YOUR honest take — not a polished summary
- Paragraph lengths: vary wildly — 1 line, 4 lines, 2 lines, 5 lines, 1 line

═══ WHAT AI DETECTORS FLAG — AVOID ALL OF THESE ═══
- Uniform sentence length throughout a paragraph
- Starting 3+ consecutive sentences with "The [noun]..."
- Transitions like: "Firstly, Secondly, Thirdly, Finally"
- Describing specs in the same sentence pattern repeatedly
- Ending articles with a positive balanced summary
- Writing spec tables where every row has the same sentence structure
- Repeating the brand name at the start of every paragraph
- Generic calls to action at the end`

const AUTHOR_PERSONAS = [
  { name: 'Arjun Mehta', bio: 'Senior mobile editor based in Delhi, 11 years covering Indian smartphones, direct and occasionally sarcastic' },
  { name: 'Priya Sharma', bio: 'Bengaluru-based budget phone correspondent, focuses on real Indian usage conditions, heat/dust/patchy 5G' },
  { name: 'Rohit Verma', bio: 'Mumbai news reporter, former national daily journalist, brings news rigour to tech coverage, concise and factual' },
  { name: 'Neha Singh', bio: 'Hyderabad reviews editor, tests devices for 4-6 weeks before writing, obsessed with software support and battery real-world' },
  { name: 'Karan Gupta', bio: 'Pune value analyst, runs head-to-head comparisons, tells readers exactly whether to buy or skip' },
]

function getSystemPrompt(authorIndex: number): string {
  const a = AUTHOR_PERSONAS[authorIndex % 5]
  return HUMAN_SYSTEM_PROMPT.replace(
    'You are Arjun Mehta. The current year is 2026. You have been covering the Indian smartphone market for 11 years, first at a print magazine in Mumbai, now at TechBharat in Delhi. You are direct, occasionally sarcastic, genuinely excited by good hardware, and frustrated by marketing fluff.',
    `You are ${a.name}. The current year is ${new Date().getFullYear()}. ${a.bio}. You write for The Tech Bharat. You are direct, occasionally sarcastic, genuinely excited by good hardware, and frustrated by marketing fluff.`
  )
}
function buildUserPrompt(raw: RawArticle, brand: string, type: string): string {
  const isReview  = type === 'review'
  const isCompare = type === 'compare'
  const isNews    = !isReview && !isCompare

  const today = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })

  return `Write a 1500-word article for TechBharat about this topic.

TODAY'S DATE: ${today} — All dates, timelines, and references must be consistent with this date. Never mention years before ${new Date().getFullYear()}.
TOPIC: ${raw.title}
TITLE REWRITE RULE: If the topic title is a plain spec/launch announcement (e.g. "Samsung Galaxy X specs", "Phone Y launch"), rewrite it as a question or opinion title that real readers would click. Examples:
  - "Samsung Galaxy S26 specs" → "Samsung Galaxy S26: Is India's ₹80K Investment Actually Worth It?"  
  - "iPhone 17e launch" → "iPhone 17e Reality Check: Better Value Than iPhone 16?"
  - "Best phones under 20000" → "2026 में ₹20,000 के Phone — Which Ones Actually Last 2 Years?"
  Keep the rewritten title factual but curiosity-driven. Output it as the article's <h1>.
FACTS TO WORK FROM: ${(raw.description + ' ' + raw.content).replace(/\[.*?\]/g, '').trim().slice(0, 800)}
BRAND: ${brand}
ARTICLE TYPE: ${type}

━━━ CONTENT STRUCTURE ━━━
${isNews ? `
Opening: Jump straight into what happened or what was announced — no scene-setting preamble.
Section 1: What exactly was revealed/announced (specific details)
Section 2: Technical breakdown — what the specs/features actually mean for real users
Section 3: India angle — price in ₹, Flipkart/Amazon availability, who will buy this
Section 4: How it fits into the current Indian market (competitors, value proposition)
Section 5 (H2): Your honest analysis — what's good, what's concerning, what's missing
Closing: Direct verdict — should Indian buyers care about this?` : ''}
${isReview ? `
Opening: Your immediate impression — what surprised you or stood out first
Section 1: Design & build — how it actually feels (India heat/humidity context)
Section 2: Display — daily use experience, not just specs
Section 3: Camera — real-world results, not megapixel count
Section 4: Performance & battery — honest assessment including weaknesses
Section 5 (H2): India pricing & competition — who else is in this price bracket
Specs table (HTML): key specs in a clean table
Pros & Cons table (HTML): honest, not marketing fluff
Closing verdict: Exactly who should and shouldn't buy this` : ''}
${isCompare ? `
Opening: Set up the real buying dilemma — who is actually choosing between these two
Section 1: Quick specs comparison (HTML table)
Section 2: Where they differ in real use (camera, battery, performance)
Section 3: Software & updates situation in India
Section 4: Value — which is actually worth the money in India
Closing: Clear, direct recommendation — not "both are good in their own ways"` : ''}

━━━ SENTENCE VARIETY CHECKLIST ━━━
Before writing, plan to include:
[ ] At least 3 sentences under 8 words
[ ] At least 2 sentences over 35 words  
[ ] At least 2 em-dash asides
[ ] At least 1 rhetorical question
[ ] At least 1 sentence starting with "And" or "But"
[ ] At least 3 contractions (it's, you're, don't etc.)
[ ] At least 2 personal opinion markers (I think, Personally, My take)
[ ] At least 1 sentence with word repetition for emphasis ("really really", "genuinely fast")

━━━ OUTPUT FORMAT ━━━
Return ONLY valid JSON. No markdown fences. No text outside the JSON object.
Escape all internal quotes with backslash.

{
  "title": "Headline 55–65 chars. Start with brand name. Newsy, specific, curious — NOT clickbait.",
  "brand": "${brand}",
  "type": "${type}",
  "summary": "3 sentences. Sentence 1: most surprising/interesting fact. Sentence 2: India price or context. Sentence 3: what makes this worth reading. Conversational — like you're telling a friend. NO banned phrases.",
  "bullets": [
    "Specific fact with number: e.g. '6,000mAh battery, charges fully in 45 minutes'",
    "India-specific point: price in ₹ or availability detail",
    "One honest criticism or limitation",
    "A competitor comparison in one line",
    "Your opinion or prediction about this product"
  ],
  "fullContent": "Full 1500-word HTML article. Tags: <p>, <h2>, <h3>, <table>, <tr>, <th>, <td>, <strong>, <ul>, <li> only. Follow structure above. Apply ALL sentence variety rules. Use banned phrase list strictly. British English. NO source names anywhere.",
  "tags": ["brand name", "model name", "brand model India price", "brand model review India", "best phone under Xk", "brand model 5G India"],
  "quickBullets": ["Spec or fact, max 7 words", "Price point, max 7 words", "One-line verdict, max 7 words"]
}`
}

// ── CALL ANTHROPIC ──────────────────────────────────────────────
async function rewriteWithAnthropic(raw: RawArticle, authorIndex = 0): Promise<RawNewsItem> {
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
      max_tokens: 5500,
      system: getSystemPrompt(authorIndex),
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
async function rewriteWithGroq(raw: RawArticle, authorIndex = 0): Promise<RawNewsItem> {
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
      max_tokens: 5500,
      temperature: 0.88,
      messages: [
        { role: 'system', content: getSystemPrompt(authorIndex) },
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
async function rewriteArticle(raw: RawArticle, authorIndex = 0): Promise<RawNewsItem> {
  if (ANTHROPIC_API_KEY) {
    try {
      return await rewriteWithAnthropic(raw, authorIndex)
    } catch (err: unknown) {
      const e = err as Error
      const isRate = e.message?.includes('429') || e.message?.includes('rate_limit')
      console.warn(`[TB] Anthropic failed (${e.message?.slice(0,80)}) — trying Groq...`)
      if (isRate) await delay(8000)
    }
  }
  return await rewriteWithGroq(raw, authorIndex)
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

  const picked = pickTopStories(rawArticles, 8)
  console.log(`[TB] Selected ${picked.length} stories`)

  const rewritten: RawNewsItem[] = []
  for (let i = 0; i < picked.length; i++) {
    console.log(`[TB] Rewriting ${i+1}/${picked.length}: ${picked[i].title.slice(0,55)}`)
    try {
      if (i > 0) await delay(4000)
      rewritten.push(await rewriteArticle(picked[i], i))
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

  for (let i = 0; i < rawItems.length; i++) {
    const item   = rawItems[i]
    const slug   = generateSlug(item.title)
    const images = await getArticleImages(item.brand + ' smartphone', 5)
    const wc     = (item.fullContent || '').replace(/<[^>]*>/g, '').split(/\s+/).length
    const rt     = Math.max(5, Math.ceil(wc / 220))

    articles.push({
      id:            `${now.getTime()}-${i}`,
      slug,
      title:         item.title,
      type:          item.type as 'mobile-news' | 'review' | 'compare',
      category:      item.type === 'review' ? 'Reviews' : item.type === 'compare' ? 'Compare' : 'Mobile News',
      brand:         item.brand,
      publishDate:   now.toISOString(),
      author:        (['Arjun Mehta', 'Priya Sharma', 'Rohit Verma', 'Neha Singh', 'Karan Gupta'])[i % 5],
      readTime:      rt,
      featuredImage: images[0],
      images,
      summary:       item.summary      || '',
      bullets:       item.bullets      || [],
      content:       item.fullContent  || '',
      tags:          item.tags         || [],
      relatedSlugs:  [],
      reviews:       [],
      quickSummary: {
        brand:   item.brand,
        date:    now.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
        bullets: item.quickBullets || [],
      },
      seoTitle:       item.title + ' | TechBharat',
      seoDescription: (item.summary || '').slice(0, 155),
      isFeatured:     i === 0,
    })
  }

  articles.forEach((a, idx) => {
    a.relatedSlugs = articles.filter((_,j) => j !== idx).slice(0, 4).map(b => b.slug)
  })
  return articles
}

// ── FETCH SINGLE ARTICLE (used by scheduler + admin manual fetch) ─
// Fetches raw news, filters by type, skips duplicates, rewrites one
export async function fetchSingleArticle(
  type: 'mobile-news' | 'review' | 'compare',
  existingArticles: { title: string; brand: string; publishDate: string }[]
): Promise<RawNewsItem | null> {
  const { isDuplicate } = await import('./scheduler')

  // Fetch raw news
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

  // Build candidate pool — filter by type intent
  const candidates = rawArticles.filter(a => {
    if (!a.title || a.title === '[Removed]') return false
    if (!isMobileTech(a.title, a.description)) return false

    // Type matching
    const t = a.title.toLowerCase()
    if (type === 'review') {
      return t.includes('review') || t.includes('verdict') || t.includes('hands-on') || t.includes('rating') || t.includes('tested')
    }
    if (type === 'compare') {
      return t.includes(' vs ') || t.includes('compare') || t.includes('comparison') || t.includes('versus') || t.includes('better')
    }
    // mobile-news: anything that isn't a review or compare
    return !t.includes('review') && !t.includes(' vs ') && !t.includes('comparison')
  })

  // Deduplicate against existing articles
  const brand = (title: string) => detectBrand(title)
  const fresh = candidates.filter(a => !isDuplicate(a.title, brand(a.title), existingArticles))

  if (fresh.length === 0) {
    // If no type-specific fresh articles, fall back to any fresh mobile-tech article
    const fallback = rawArticles
      .filter(a => a.title && a.title !== '[Removed]' && isMobileTech(a.title, a.description))
      .filter(a => !isDuplicate(a.title, brand(a.title), existingArticles))

    if (fallback.length === 0) return null

    // Sort by recency
    fallback.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    return rewriteArticle({ ...fallback[0] }, Math.floor(Math.random() * 5))
  }

  // Sort by recency — pick freshest
  fresh.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())

  // Force the type we want
  const target = fresh[0]
  const rewritten = await rewriteArticle(target, Math.floor(Math.random() * 5))

  // Override type to match schedule intent
  rewritten.type = type

  return rewritten
}