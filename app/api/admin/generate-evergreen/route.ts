// app/api/admin/generate-evergreen/route.ts
//
// POST /api/admin/generate-evergreen?topic=best-phones-20k  → single topic (manual button)
// POST /api/admin/generate-evergreen?auto=1                 → auto: picks best topic for today's trends (cron)
// GET  /api/admin/generate-evergreen                        → list all topics + published status

import { NextRequest, NextResponse } from 'next/server'
import { saveArticlesAsync, getAllArticlesAsync, generateSlug } from '@/lib/store'
import { getUniqueUnsplashImage } from '@/lib/phone-images'

export const dynamic = 'force-dynamic'
export const maxDuration = 300

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY || ''
const CRON_SECRET       = process.env.CRON_SECRET       || ''

// ── 10 evergreen topics ──────────────────────────────────────────
export const EVERGREEN_TOPICS = [
  {
    id: 'best-phones-20k',
    title: 'Best Phones Under ₹20,000 in India (2026) — Ranked by Real Performance',
    brand: 'Mobile', type: 'compare' as const,
    keywords: ['budget phone','best phone under 20000','xiaomi','realme','poco'],
    prompt: `Write a comprehensive, SEO-optimised 2000-word evergreen article titled "Best Phones Under ₹20,000 in India (2026)".
This is a BUYING GUIDE. Structure:
1. Quick answer (top 3 picks, one-line reason each)
2. Full comparison table (8 phones: model, price, chip, battery, camera, 5G yes/no)
3. Each phone: 150-word section with honest pros/cons, who it's for, India note
4. "Which one should YOU buy?" — 4 buyer personas (student, professional, gaming, camera)
5. "What to avoid under ₹20K" — 3 phones with clear reasons
6. FAQ: 5 questions people actually search
Phones: Redmi Note 14, Realme P3, Poco M7 Pro, Samsung Galaxy A25, Motorola G85, Nothing Phone 2a, iQOO Z9x, OnePlus Nord CE 4 Lite
Target keyword: "best phones under 20000 in India 2026"`,
  },
  {
    id: 'best-phones-30k',
    title: 'Best Phones Under ₹30,000 in India (2026) — Mid-Range That Actually Delivers',
    brand: 'Mobile', type: 'compare' as const,
    keywords: ['mid range phone','best phone under 30000','oneplus','samsung'],
    prompt: `Write a 2000-word evergreen buying guide: "Best Phones Under ₹30,000 in India (2026)".
Structure: Quick top 3 · comparison table (8 phones) · each phone 150-word honest assessment · best for gaming section · best camera section · buyer personas · FAQ.
Phones: OnePlus Nord 4, Samsung Galaxy A55, Poco F6, Realme GT 6T, iQOO Neo 9, Google Pixel 8a, Motorola Edge 50, Nothing Phone 2.
Target keyword: "best phones under 30000 in India 2026"`,
  },
  {
    id: 'battery-saving-guide-android',
    title: 'Android Battery Saving Guide 2026 — Make Your Phone Last 2 Days',
    brand: 'Mobile', type: 'mobile-news' as const,
    keywords: ['battery life','android tips','battery saving','phone battery'],
    prompt: `Write a practical 2000-word guide: "Android Battery Saving Guide 2026".
Structure: Settings to change TODAY (8 specific settings with exact menu paths on Android 14/15) · App-level battery management · Charging habits · India-specific tips (4G/5G switching, heat) · Battery health check (code *#*#4636#*#*) · When to replace · FAQ (6 questions).
Target keyword: "android battery saving tips india 2026"`,
  },
  {
    id: '5g-india-guide',
    title: '5G in India 2026 — Which Bands Work, Which Phones Support Them',
    brand: 'Mobile', type: 'mobile-news' as const,
    keywords: ['5g india','5g bands','jio 5g','airtel 5g','5g phone'],
    prompt: `Write a 2000-word guide: "5G in India 2026 — Complete Guide".
Structure: State of 5G in India honest · 5G bands explained (n78,n77,n28,mmWave) table · Jio vs Airtel vs Vi coverage · How to check your phone's band support · Best 5G phones under ₹20K/₹30K/₹50K · Real speed expectations · Is 5G worth upgrading in 2026 · FAQ.
Target keyword: "5g india which phones support 2026"`,
  },
  {
    id: 'best-camera-phones-india',
    title: 'Best Camera Phones in India 2026 — Ranked by Real Photo Quality',
    brand: 'Mobile', type: 'compare' as const,
    keywords: ['best camera phone','camera phone india','phone photography'],
    prompt: `Write a 2000-word camera buying guide: "Best Camera Phones in India 2026".
Structure: Why megapixels mean nothing · Quick picks (budget/mid/premium) · Comparison table (8 phones) · Each phone 150 words · For Instagram/Reels section · Low-light comparison · Portrait mode reality check · FAQ.
Phones: Samsung S25, iPhone 16, Pixel 9, OnePlus 13, Vivo X200, Xiaomi 15, Realme GT 7 Pro, Nothing Phone 3.
Target keyword: "best camera phone india 2026"`,
  },
  {
    id: 'how-to-choose-smartphone-india',
    title: 'How to Choose a Smartphone in India 2026 — The No-Nonsense Buying Guide',
    brand: 'Mobile', type: 'mobile-news' as const,
    keywords: ['how to buy phone','smartphone buying guide','which phone to buy india'],
    prompt: `Write a 2000-word beginner guide: "How to Choose a Smartphone in India 2026".
Structure: Set your real budget · Specs that ACTUALLY matter (processor, RAM, storage) · Specs that are mostly marketing (megapixels, ultra-slim) · Brand reliability in India 2026 (after-sales, updates, resale) · Where to buy Flipkart vs Amazon vs offline · Vijay's recommendations per budget · FAQ.
Target keyword: "how to choose smartphone india 2026"`,
  },
  {
    id: 'xiaomi-vs-samsung-india',
    title: 'Xiaomi vs Samsung in India 2026 — Which Brand Is Actually Worth Your Money?',
    brand: 'Xiaomi', type: 'compare' as const,
    keywords: ['xiaomi vs samsung','redmi vs samsung','best brand india'],
    prompt: `Write a 2000-word brand comparison: "Xiaomi vs Samsung in India 2026".
Structure: Value under ₹20K (3 head-to-heads) · Mid-range ₹20-40K · Premium ₹40K+ · After-sales service (centre count, repair cost) · Software comparison HyperOS vs One UI · Resale value data · Camera by price bracket · Vijay's verdict · FAQ.
Target keyword: "xiaomi vs samsung india 2026"`,
  },
  {
    id: 'best-gaming-phones-india',
    title: 'Best Gaming Phones Under ₹30,000 in India 2026 — Real FPS, Real Heat Tests',
    brand: 'Mobile', type: 'compare' as const,
    keywords: ['gaming phone india','best gaming phone','bgmi phone','poco gaming'],
    prompt: `Write a 2000-word gaming guide: "Best Gaming Phones Under ₹30,000 India 2026".
Structure: What makes a phone good for gaming · Comparison table (7 phones: AnTuTu, RAM, cooling, battery) · Each phone 150 words · BGMI/Free Fire/COD performance section · Cooling solutions · Best under ₹15K/₹20K/₹30K · FAQ.
Phones: Poco F6, iQOO Z9 Turbo, Realme GT 6T, OnePlus Nord 4, RedMagic 9S, Samsung M55, Motorola Edge 50 Neo.
Target keyword: "best gaming phone under 30000 india 2026"`,
  },
  {
    id: 'oneplus-vs-nothing-comparison',
    title: 'OnePlus vs Nothing Phone in India 2026 — The Honest Comparison',
    brand: 'OnePlus', type: 'compare' as const,
    keywords: ['oneplus vs nothing','nothing phone','oneplus nord','which phone'],
    prompt: `Write a 2000-word brand comparison: "OnePlus vs Nothing Phone India 2026".
Structure: Design philosophy real trade-offs · Price comparison table (₹20K/₹30K/₹40K tiers) · OxygenOS vs Nothing OS honest · Camera battle by tier · Build quality India context · After-sales service centres · Software update track record · Vijay's verdict per budget · FAQ.
Target keyword: "oneplus vs nothing phone india 2026"`,
  },
  {
    id: 'refurbished-phones-india-guide',
    title: 'Buying Refurbished Phones in India 2026 — Safe or Risky? Complete Guide',
    brand: 'Mobile', type: 'mobile-news' as const,
    keywords: ['refurbished phone india','second hand phone','cashify','amazon renewed'],
    prompt: `Write a 2000-word guide: "Buying Refurbished Phones in India 2026".
Structure: Refurbished vs Used vs Renewed (difference) · Trusted platforms India (Amazon Renewed, Flipkart 2GUD, Cashify, Yaantra) · Grades A/B/C explained · Red flags checklist · 10-step verify on arrival · Best brands to buy refurbished · Worth it under ₹10K/₹15K/₹20K · Vijay's personal experience · FAQ.
Target keyword: "buy refurbished phone india 2026 safe"`,
  },
]

const SYSTEM_PROMPT = `You are Vijay Yadav, founder of The Tech Bharat. 11 years covering Indian smartphones. Direct, opinionated, India-focused.
Rules: British English · prices in ₹ · personal opinions mandatory ("I think", "In my experience") · India-specific context always (Flipkart/Amazon, 5G bands, heat, EMI, service centres) · varied sentence length · NO banned phrases: "seamless", "robust", "cutting-edge", "revolutionary", "furthermore", "moreover", "in conclusion", "it is worth noting", "in today's world" · HTML only: <p><h2><h3><table><tr><th><td><strong><ul><li> · end with honest verdict`

// ── Score a topic against trending keywords ──────────────────────
function scoreTopic(topic: typeof EVERGREEN_TOPICS[0], trends: string[]): number {
  const trendLower = trends.map(t => t.toLowerCase())
  let score = 0
  for (const kw of topic.keywords) {
    for (const trend of trendLower) {
      if (trend.includes(kw) || kw.includes(trend)) score += 2
      else if (trend.split(' ').some((w: string) => kw.includes(w) && w.length > 3)) score += 1
    }
  }
  return score
}

// ── Fetch trending topics from Google Trends India ───────────────
async function fetchTrendingTopics(): Promise<string[]> {
  try {
    const res = await fetch(
      'https://trends.google.com/trends/trendingsearches/daily/rss?geo=IN',
      { next: { revalidate: 0 } }
    )
    if (!res.ok) return []
    const xml = await res.text()
    const titles = [...xml.matchAll(/<title><!\[CDATA\[([^\]]+)\]\]>/g)].map(m => m[1])
    return titles.slice(0, 20)
  } catch { return [] }
}

// ── Generate article content via Anthropic ───────────────────────
async function generateEvergreenContent(topic: typeof EVERGREEN_TOPICS[0]): Promise<string> {
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 6000,
      system: SYSTEM_PROMPT,
      messages: [{
        role: 'user',
        content: `${topic.prompt}

Return ONLY valid JSON, no markdown fences:
{
  "title": "exact article title",
  "summary": "3-sentence summary, conversational, India-specific",
  "bullets": ["5 key points, specific with numbers"],
  "fullContent": "full HTML article, 2000 words minimum",
  "tags": ["6 SEO tags including primary keyword"],
  "quickBullets": ["3 bullets max 7 words each"]
}`,
      }],
    }),
  })

  if (!res.ok) throw new Error(`Anthropic ${res.status}`)
  const data = await res.json()
  const text = data.content
    .filter((b: { type: string }) => b.type === 'text')
    .map((b: { text: string }) => b.text)
    .join('')
  const clean = text.replace(/^```json\s*/m, '').replace(/```\s*$/m, '').trim()
  const match = clean.match(/\{[\s\S]*\}/)
  if (!match) throw new Error('No JSON in response')
  return match[0]
}

// ── Build article object from parsed content ─────────────────────
async function buildEvergreenArticle(
  topic: typeof EVERGREEN_TOPICS[0],
  parsed: Record<string, unknown>,
  sessionUsedIds: Set<string>
) {
  // Fetch 5 unique Unsplash images via the clean proxy URL system
  const images: string[] = []
  for (let i = 0; i < 5; i++) {
    const img = await getUniqueUnsplashImage(
      `${topic.brand} smartphone india`,
      sessionUsedIds
    )
    if (img) images.push(img)
  }

  const slug = generateSlug(topic.title)
  const wc   = ((parsed.fullContent as string) || '').replace(/<[^>]*>/g, '').split(/\s+/).length
  const rt   = Math.max(7, Math.ceil(wc / 220))

  return {
    id:            `evergreen-${topic.id}-${Date.now()}`,
    slug,
    title:         (parsed.title as string)    || topic.title,
    type:          topic.type,
    category:      topic.type === 'compare' ? 'Compare' : 'Mobile News',
    brand:         topic.brand,
    publishDate:   new Date().toISOString(),
    author:        'Vijay Yadav',
    readTime:      rt,
    featuredImage: images[0] || '',
    images,
    summary:       (parsed.summary as string)  || '',
    bullets:       (parsed.bullets as string[]) || [],
    content:       (parsed.fullContent as string) || '',
    tags:          (parsed.tags as string[])   || [],
    relatedSlugs:  [] as string[],
    reviews:       [],
    quickSummary: {
      brand:   topic.brand,
      date:    new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
      bullets: (parsed.quickBullets as string[]) || [],
    },
    seoTitle:       ((parsed.title as string) || topic.title) + ' | The Tech Bharat',
    seoDescription: ((parsed.summary as string) || '').slice(0, 155),
    isFeatured:     false,
    isEvergreen:    true,
  }
}

// ── GET — list topics + published status ─────────────────────────
export async function GET(request: NextRequest) {
  const cookie = request.cookies.get('__tb_admin')?.value
  if (!cookie) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const existingArticles = await getAllArticlesAsync()
  const existingSlugs    = new Set((existingArticles as {slug:string}[]).map(a => a.slug))

  return NextResponse.json({
    topics: EVERGREEN_TOPICS.map(t => ({
      id:        t.id,
      title:     t.title,
      type:      t.type,
      published: existingSlugs.has(generateSlug(t.title)),
    })),
  })
}

// ── POST — generate one topic (manual) OR auto-pick trending ─────
export async function POST(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const topicId  = searchParams.get('topic')
  const isAuto   = searchParams.get('auto') === '1'
  const secret   = searchParams.get('secret')

  // Auth: admin cookie OR cron secret
  const cookie = request.cookies.get('__tb_admin')?.value
  if (!cookie && secret !== CRON_SECRET) {
    return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
  }

  const existingArticles = await getAllArticlesAsync()
  const existingSlugs    = new Set((existingArticles as {slug:string}[]).map(a => a.slug))

  // Filter to only unpublished topics
  const unpublished = EVERGREEN_TOPICS.filter(
    t => !existingSlugs.has(generateSlug(t.title))
  )

  if (unpublished.length === 0) {
    return NextResponse.json({ success: true, message: 'All evergreen articles already published', skipped: [] })
  }

  let topicsToGenerate: typeof EVERGREEN_TOPICS = []

  if (isAuto) {
    // Auto mode: pick the unpublished topic that best matches today's trends
    console.log('[Evergreen:auto] Fetching Google Trends India...')
    const trends = await fetchTrendingTopics()
    console.log(`[Evergreen:auto] Trends: ${trends.slice(0, 5).join(', ')}`)

    let bestTopic = unpublished[0]
    let bestScore = -1

    for (const topic of unpublished) {
      const score = scoreTopic(topic, trends)
      console.log(`[Evergreen:auto] Score ${topic.id}: ${score}`)
      if (score > bestScore) { bestScore = score; bestTopic = topic }
    }

    console.log(`[Evergreen:auto] Picked: ${bestTopic.id} (score: ${bestScore})`)
    topicsToGenerate = [bestTopic]

  } else if (topicId) {
    // Manual single topic
    const found = EVERGREEN_TOPICS.find(t => t.id === topicId)
    if (!found) return NextResponse.json({ error: `Topic "${topicId}" not found` }, { status: 400 })
    topicsToGenerate = [found]
  } else {
    return NextResponse.json({ error: 'Provide ?topic=ID or ?auto=1' }, { status: 400 })
  }

  const generated: string[] = []
  const skipped:   string[] = []
  const errors:    string[] = []
  const newArticles: object[] = []

  // Shared session set — no two articles in this request get the same Unsplash image
  const sessionUsedIds = new Set<string>()

  for (const topic of topicsToGenerate) {
    const slug = generateSlug(topic.title)

    if (existingSlugs.has(slug)) {
      skipped.push(topic.id)
      continue
    }

    try {
      console.log(`[Evergreen] Generating: ${topic.id}`)
      const jsonStr = await generateEvergreenContent(topic)
      const parsed  = JSON.parse(jsonStr)
      const article = await buildEvergreenArticle(topic, parsed, sessionUsedIds)

      newArticles.push(article)
      generated.push(topic.id)
      console.log(`[Evergreen] Done: ${topic.id}`)
    } catch (err) {
      const msg = (err as Error).message
      errors.push(`${topic.id}: ${msg}`)
      console.error(`[Evergreen] Failed ${topic.id}: ${msg}`)
    }
  }

  if (newArticles.length > 0) {
    const allArticles = [...existingArticles, ...newArticles] as {slug:string;relatedSlugs:string[]}[]
    allArticles.forEach((a, idx) => {
      if (!a.relatedSlugs?.length) {
        a.relatedSlugs = allArticles.filter((_, j) => j !== idx).slice(0, 4).map(b => b.slug)
      }
    })
    await saveArticlesAsync(allArticles)
  }

  return NextResponse.json({
    success: true,
    generated,
    skipped,
    errors,
    total_new:         newArticles.length,
    remaining_topics:  unpublished.length - generated.length,
    available_topics:  EVERGREEN_TOPICS.map(t => t.id),
  })
}