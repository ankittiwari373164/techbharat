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

"Review" (as standalone article label — use "First Look", "Hands-On", "Specs Breakdown", "Real-World Test" instead) | "In conclusion" | "To conclude" | "In summary" | "To summarize"
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
- Generic calls to action at the end
- "This smartphone comes with powerful performance"
- "It is expected to launch soon in India"  
- "Users can enjoy a seamless experience"
- "The device packs impressive specifications"
- Any sentence that could apply to ANY phone with just the name swapped
- Spec lists without opinion or India context attached

MANDATORY HUMAN FEEL (every article needs all of these):
1. One "Vijay's Take:" or "My honest assessment:" paragraph with a clear opinion
2. One India market comparison: "At this price, it competes with [competitor] which [specific difference]"
3. One real-usage scenario: "If you commute on Delhi Metro daily and..." or "For a college student in India..."
4. Battery/heat/5G India-specific note (even for non-phone articles, find the India angle)
5. One sentence of mild skepticism OR genuine excitement — not both, pick what fits`

function getSystemPrompt(_authorIndex: number): string {
  return HUMAN_SYSTEM_PROMPT.replace(
    'You are Arjun Mehta. The current year is 2026. You have been covering the Indian smartphone market for 11 years, first at a print magazine in Mumbai, now at TechBharat in Delhi. You are direct, occasionally sarcastic, genuinely excited by good hardware, and frustrated by marketing fluff.',
    `You are Vijay Yadav. The current year is ${new Date().getFullYear()}. You are the founder and Senior Mobile Editor of The Tech Bharat, based in New Delhi. You have been covering the Indian smartphone market for 11 years, starting at a print magazine in Mumbai. You have reviewed over 300 devices. You are direct, occasionally sarcastic, genuinely excited by good hardware, and frustrated by marketing fluff.`
  )
}
function buildUserPrompt(raw: RawArticle, brand: string, type: string): string {
  const isReview  = type === 'review'
  const isCompare = type === 'compare'
  const isNews    = !isReview && !isCompare

  const today = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })

  return `Write a 1500-word article for The Tech Bharat about this topic.

TODAY'S DATE: ${today} — All dates, timelines, and references must be consistent with this date. Never mention years before ${new Date().getFullYear()}.

CONTENT RATIO RULE — THIS IS THE MOST IMPORTANT INSTRUCTION:
60% of this article must be ANALYSIS, OPINION, and INSIGHT — not reporting.
40% can be factual news/specs reporting.
This means: for every spec or fact you mention, follow it with your opinion on what it means,
who it helps, whether it's actually good for Indian buyers, and how it compares to rivals.
A journalist's job is not to repeat a press release. It's to tell readers what it MEANS.

VIJAY'S VOICE — MANDATORY ELEMENTS (every article must have all 5):
1. "Vijay's Take:" H2 section — 3–4 sentences of personal, opinionated verdict with no hedging
2. "What Indian Buyers Should Know:" section — 3 bullet points specific to India (not generic)
3. One sentence of genuine skepticism about the brand's claims or product
4. One direct competitor comparison: "At ₹X, this competes with [rival] which [specific point]"
5. One real-usage scenario starting with "If you're a [type of Indian user] who [use case]..."

INTERNAL LINKS MANDATE: Every article must include exactly 2 internal links to other sections of thetechbharat.com using this format:
<a href="/mobile-news?brand=BRAND">More BRAND news on The Tech Bharat</a>
<a href="/compare">Compare phones on The Tech Bharat</a>
OR link to /reviews, /mobile-news, /web-stories as relevant. Place them naturally inside paragraphs — not in a list at the bottom.

UNIQUE VALUE MANDATE: This article MUST offer something the reader cannot get from just reading the press release or spec sheet. Add at least ONE of: (a) your honest opinion on whether it's worth buying, (b) a comparison to a rival at similar price, (c) an India-specific insight about availability/value/5G, (d) a prediction or concern about this product's future. Generic spec summaries fail this test.
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
Opening: Lead with your OPINION or most surprising observation — not with "X has announced Y". Hook the reader with your take first.
Section 1 (facts 40%): What was revealed/announced — specific details, specs, pricing
Section 2 (analysis 60%): Your analysis — what these specs actually mean for real Indian users, what's good, what's a red flag
Section 3: India angle — ₹ pricing reality check, Flipkart/Amazon availability, who will actually buy this vs who it's marketed to
Section 4: Market context — how this fits (or disrupts) the Indian market right now
<h2>Vijay's Take</h2>: Your personal, opinionated verdict — 3–4 sentences, no hedging, take a side
<h2>What Indian Buyers Should Know</h2>: 3 bullet points specific to India buyers
IMPORTANT FOR NEWS/LEAKS: If article is based on leaks or analyst reports, add:
<p><strong>Source Note:</strong> This article is based on [analyst reports / leaked specifications / industry sources]. These details are unconfirmed until official launch.</p>` : ''}
${isReview ? `
Opening: Your strongest one-sentence opinion first — the thing that surprised you most
Section 1: Design & build — how it actually feels in the hand (India heat/humidity context), your honest take
Section 2: Display — daily use experience, not just specs — what you personally liked or hated
Section 3: Camera — real-world comparison to rivals at similar price, not megapixel count
Section 4: Performance & battery — your honest weaknesses, no sugarcoating anything
Section 5: India pricing & competition — who wins at this price point and why
<h2>Vijay's Take</h2>: 3–4 sentences. Clear verdict + who should buy + who definitely should not.
Specs table (HTML): key specs
Pros & Cons (HTML table): brutally honest — not generic marketing points` : ''}
${isCompare ? `
Opening: Tell the reader exactly what kind of person is choosing between these two — make them feel seen
Section 1: Quick specs comparison (HTML <table>, 6+ rows: price, display, chip, battery, camera, 5G)
Section 2: Where they genuinely differ — camera processing, software update timeline, heat under load
Section 3: India-specific factors — service centre density in Tier 2/3 cities, Flipkart vs Amazon pricing, EMI
Section 4: Who each phone is actually for — specific buyer type, not vague "it depends"
<h2>Vijay's Take</h2>: Pick ONE winner. Say which you'd buy with your own money and why.
<h2>What Indian Buyers Should Know</h2>: 3 bullet points India-specific` : ''}

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
  "title": "CRITICAL TITLE RULES:\n1. NO clickbait. Titles must be factual and specific.\n2. NO speculative pricing claims stated as fact (use \'expected\', \'rumoured\', \'analyst estimates\')\n3. NO competitor-attack framing like \'Why Google/Apple Can\'t Compete\' — report facts, not attacks\n4. NO pure spec dumps like \'X Review\' or \'Y Launch\' — make it specific and useful\n5. OK to use questions: \'Is X Worth ₹50K?\' · \'X vs Y: Which Should You Buy?\'\n6. For leaks/speculation, title must signal it: \'Galaxy S26: What Leaks Suggest So Far\' not \'Galaxy S26 to Launch with X Feature\'\n7. 55–70 chars\nGOOD examples: \'Motorola Edge 70 Fusion: 7,000mAh Battery at Expected ₹20K\' | \'iPhone 17e First Look: Spec Breakdown and India Price Estimate\'\nBAD examples: \'MacBook Neo at $599: Why Google\'s Android PCs Can\'t Compete\' (attack tone) | \'Motorola Edge 70 India: ₹20K pricing\' (unconfirmed price stated as fact)",
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
  "relatedTopics": ["suggest 3 related article topics from the same brand or price segment that would make good internal links — e.g. \'Samsung Galaxy S25 Review\', \'Best Samsung phones under ₹60K\'"]
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
      author:        'Vijay Yadav',
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
      // Accept any comparison signal OR any news about 2 different phones we can compare
      return t.includes(' vs ') || t.includes('compare') || t.includes('comparison') || t.includes('versus') || t.includes('better') || t.includes('alternative') || t.includes('worth')
    }
    // mobile-news: anything that isn't a review or compare
    return !t.includes('review') && !t.includes(' vs ') && !t.includes('comparison')
  })

  // Deduplicate against existing articles
  const brand = (title: string) => detectBrand(title)
  const fresh = candidates.filter(a => !isDuplicate(a.title, brand(a.title), existingArticles))

  if (fresh.length === 0) {
    // For compare: synthesize a vs article from 2 recent mobile articles
    if (type === 'compare') {
      const pool = rawArticles
        .filter(a => a.title && a.title !== '[Removed]' && isMobileTech(a.title, a.description))
        .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
      
      if (pool.length >= 2) {
        const phoneA = pool[0]
        const phoneB = pool.find(a => detectBrand(a.title) !== detectBrand(phoneA.title)) || pool[1]
        const brandA = detectBrand(phoneA.title)
        const brandB = detectBrand(phoneB.title)
        // Create a synthetic comparison raw article
        const synthetic: RawArticle = {
          title: `${phoneA.title.split(':')[0]} vs ${phoneB.title.split(':')[0]} — Which Should You Buy in India?`,
          description: `Comparing ${phoneA.title} against ${phoneB.title} for Indian buyers. ${phoneA.description} vs ${phoneB.description}`,
          content: `Phone A: ${phoneA.title}. ${phoneA.description} ${phoneA.content?.slice(0,300) || ''}
Phone B: ${phoneB.title}. ${phoneB.description} ${phoneB.content?.slice(0,300) || ''}`,
          publishedAt: new Date().toISOString(),
          url: '',
        }
        const rewritten = await rewriteArticle(synthetic, 0)
        rewritten.type = 'compare'
        return rewritten
      }
    }

    // Fall back to any fresh mobile-tech article
    const fallback = rawArticles
      .filter(a => a.title && a.title !== '[Removed]' && isMobileTech(a.title, a.description))
      .filter(a => !isDuplicate(a.title, brand(a.title), existingArticles))

    if (fallback.length === 0) return null

    fallback.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    return rewriteArticle({ ...fallback[0] }, 0)
  }

  // Sort by recency — pick freshest
  fresh.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())

  // Force the type we want
  const target = fresh[0]
  const rewritten = await rewriteArticle(target, 0)

  // Override type to match schedule intent
  rewritten.type = type

  return rewritten
}