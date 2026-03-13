// app/api/admin/generate-evergreen/route.ts
//
// POST ?topic=best-phones-20k   → single topic (manual button)
// POST ?auto=1                  → auto: picks best topic for today's trends (cron)
// GET                           → list all topics + published status

import { NextRequest, NextResponse } from 'next/server'
import { saveArticlesAsync, getAllArticlesAsync, generateSlug } from '@/lib/store'
import { getUniqueUnsplashImage } from '@/lib/phone-images'

export const dynamic = 'force-dynamic'
export const maxDuration = 300

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY || ''
const CRON_SECRET       = process.env.CRON_SECRET       || ''

// ── Inline topic type + data (avoids Next.js named-export conflict) ──
interface EvergreenTopic {
  id:       string
  title:    string
  type:     string
  brand:    string
  keywords: string[]
  prompt:   string
}

// Import from lib — keep this import; if the module is missing, copy
// lib/evergreen-topics.ts from the previous step into your repo.
let EVERGREEN_TOPICS: EvergreenTopic[] = []
try {
  // Dynamic require so Next.js doesn't treat it as a route export
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  EVERGREEN_TOPICS = require('@/lib/evergreen-topics').EVERGREEN_TOPICS
} catch {
  EVERGREEN_TOPICS = []
}

const SYSTEM_PROMPT = `You are Vijay Yadav, founder of The Tech Bharat. 11 years covering Indian smartphones. Direct, opinionated, India-focused.
Rules: British English · prices in ₹ · personal opinions mandatory ("I think", "In my experience") · India-specific context always (Flipkart/Amazon, 5G bands, heat, EMI, service centres) · varied sentence length · NO banned phrases: "seamless", "robust", "cutting-edge", "revolutionary", "furthermore", "moreover", "in conclusion", "it is worth noting", "in today's world" · HTML only: <p><h2><h3><table><tr><th><td><strong><ul><li> · end with honest verdict`

// ── Score topic against trending keywords ────────────────────────
function scoreTopic(topic: EvergreenTopic, trends: string[]): number {
  const trendLower = trends.map((t: string) => t.toLowerCase())
  let score = 0
  for (const kw of topic.keywords) {
    for (const trend of trendLower) {
      if (trend.includes(kw) || kw.includes(trend)) score += 2
      else if (trend.split(' ').some((w: string) => kw.includes(w) && w.length > 3)) score += 1
    }
  }
  return score
}

// ── Fetch Google Trends India ────────────────────────────────────
async function fetchTrendingTopics(): Promise<string[]> {
  try {
    const res = await fetch(
      'https://trends.google.com/trends/trendingsearches/daily/rss?geo=IN',
      { next: { revalidate: 0 } }
    )
    if (!res.ok) return []
    const xml    = await res.text()
    const titles: string[] = []
    const re = /<title><!\[CDATA\[([^\]]+)\]\]>/g
    let m: RegExpExecArray | null
    while ((m = re.exec(xml)) !== null) titles.push(m[1])
    return titles.slice(0, 20)
  } catch { return [] }
}

// ── Generate article content via Anthropic ───────────────────────
async function generateEvergreenContent(topic: EvergreenTopic): Promise<string> {
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
  const data  = await res.json()
  const text  = data.content
    .filter((b: { type: string }) => b.type === 'text')
    .map((b: { text: string }) => b.text)
    .join('')
  const clean = text.replace(/^```json\s*/m, '').replace(/```\s*$/m, '').trim()
  const match = clean.match(/\{[\s\S]*\}/)
  if (!match) throw new Error('No JSON in response')
  return match[0]
}

// ── Build full article object ────────────────────────────────────
async function buildEvergreenArticle(
  topic: EvergreenTopic,
  parsed: Record<string, unknown>,
  sessionUsedIds: Set<string>
) {
  // 5 unique Unsplash images via clean proxy URL — no Unsplash domain exposed
  const images: string[] = []
  for (let i = 0; i < 5; i++) {
    const img = await getUniqueUnsplashImage(`${topic.brand} smartphone india`, sessionUsedIds)
    if (img) images.push(img)
  }

  const slug = generateSlug(topic.title)
  const wc   = ((parsed.fullContent as string) || '').replace(/<[^>]*>/g, '').split(/\s+/).length
  const rt   = Math.max(7, Math.ceil(wc / 220))

  return {
    id:            `evergreen-${topic.id}-${Date.now()}`,
    slug,
    title:         (parsed.title as string)        || topic.title,
    type:          topic.type,
    category:      topic.type === 'compare' ? 'Compare' : 'Mobile News',
    brand:         topic.brand,
    publishDate:   new Date().toISOString(),
    author:        'Vijay Yadav',
    readTime:      rt,
    featuredImage: images[0] || '',
    images,
    summary:       (parsed.summary as string)      || '',
    bullets:       (parsed.bullets as string[])    || [],
    content:       (parsed.fullContent as string)  || '',
    tags:          (parsed.tags as string[])        || [],
    relatedSlugs:  [] as string[],
    reviews:       [],
    quickSummary: {
      brand:   topic.brand,
      date:    new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
      bullets: (parsed.quickBullets as string[])   || [],
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
  const existingSlugs    = new Set((existingArticles as { slug: string }[]).map((a: { slug: string }) => a.slug))

  return NextResponse.json({
    topics: EVERGREEN_TOPICS.map((t: EvergreenTopic) => ({
      id:        t.id,
      title:     t.title,
      type:      t.type,
      published: existingSlugs.has(generateSlug(t.title)),
    })),
  })
}

// ── POST — manual single topic OR auto trending pick ─────────────
export async function POST(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const topicId = searchParams.get('topic')
  const isAuto  = searchParams.get('auto') === '1'
  const secret  = searchParams.get('secret')

  // Auth: admin cookie OR cron secret
  const cookie = request.cookies.get('__tb_admin')?.value
  if (!cookie && secret !== CRON_SECRET) {
    return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
  }

  const existingArticles = await getAllArticlesAsync()
  const existingSlugs    = new Set((existingArticles as { slug: string }[]).map((a: { slug: string }) => a.slug))

  const unpublished = EVERGREEN_TOPICS.filter(
    (t: EvergreenTopic) => !existingSlugs.has(generateSlug(t.title))
  )

  if (unpublished.length === 0) {
    return NextResponse.json({ success: true, message: 'All evergreen articles already published', skipped: [] })
  }

  let topicsToGenerate: EvergreenTopic[] = []

  if (isAuto) {
    // Pick unpublished topic that best matches today's India trends
    const trends = await fetchTrendingTopics()
    console.log(`[Evergreen:auto] Trends: ${trends.slice(0, 5).join(', ')}`)

    let bestTopic = unpublished[0]
    let bestScore = -1
    for (const topic of unpublished) {
      const score = scoreTopic(topic, trends)
      if (score > bestScore) { bestScore = score; bestTopic = topic }
    }
    console.log(`[Evergreen:auto] Picked: ${bestTopic.id} (score: ${bestScore})`)
    topicsToGenerate = [bestTopic]

  } else if (topicId) {
    const found = EVERGREEN_TOPICS.find((t: EvergreenTopic) => t.id === topicId)
    if (!found) return NextResponse.json({ error: `Topic "${topicId}" not found` }, { status: 400 })
    topicsToGenerate = [found]

  } else {
    return NextResponse.json({ error: 'Provide ?topic=ID or ?auto=1' }, { status: 400 })
  }

  const generated:   string[]  = []
  const skipped:     string[]  = []
  const errors:      string[]  = []
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const newArticles: any[]     = []
  const sessionUsedIds = new Set<string>()

  for (const topic of topicsToGenerate) {
    const slug = generateSlug(topic.title)
    if (existingSlugs.has(slug)) { skipped.push(topic.id); continue }

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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const allArticles: any[] = [...existingArticles, ...newArticles]
    allArticles.forEach((a: any, idx: number) => {
      if (!a.relatedSlugs?.length) {
        a.relatedSlugs = allArticles
          .filter((_: any, j: number) => j !== idx)
          .slice(0, 4)
          .map((b: any) => b.slug)
      }
    })
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await saveArticlesAsync(allArticles as any)
  }

  return NextResponse.json({
    success:          true,
    generated,
    skipped,
    errors,
    total_new:        newArticles.length,
    remaining_topics: unpublished.length - generated.length,
  })
}