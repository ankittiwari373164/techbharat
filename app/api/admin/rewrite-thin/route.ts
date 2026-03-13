// app/api/admin/rewrite-thin/route.ts
// Rewrites thin/weak articles with deep, valuable content
// POST /api/admin/rewrite-thin            — rewrites ALL thin articles
// POST /api/admin/rewrite-thin?slug=xxx   — rewrites ONE article by slug

import { NextRequest, NextResponse } from 'next/server'
import { getAllArticlesAsync, saveArticlesAsync } from '@/lib/store'

export const dynamic = 'force-dynamic'
export const maxDuration = 300

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY || ''

// Thin article detection — word count threshold
const MIN_WORD_COUNT = 800

// Map of known thin articles → specific improvement instructions
const THIN_ARTICLE_FIXES: Record<string, string> = {
  'canon': `Rewrite with: (1) Canon's full camera market strategy in India — APS-C vs full-frame positioning, (2) Gen Z photography trend data — Instagram Reels, film aesthetic demand, (3) Price analysis — Canon G7X III vs Sony ZV-1 vs iPhone 16 Pro at same price, (4) India availability and pricing in ₹, (5) Vijay's honest opinion on whether this is smart business or pure marketing play`,

  'cc-pocket': `Rewrite with: (1) Real coding app comparison — CC Pocket vs GitHub Codespaces vs Replit on mobile, (2) Technical limitations — ARM chip constraints, keyboard shortcuts, multi-file projects, (3) Performance benchmarks on actual Android phones, (4) Developer interviews or community feedback, (5) India developer market context — freelancers, students, who actually needs this`,

  'gopro': `Rewrite with: (1) 12K video explained — what it actually means for file size, storage, editing requirements, (2) Full DJI Osmo Action 5 Pro vs Insta360 X4 vs GoPro Hero 13 comparison table, (3) India pricing from Amazon India with current rates, (4) Real-world use cases — travel vloggers, sports, underwater, (5) Honest verdict on whether 12K matters in 2026 when most platforms cap at 4K`,

  'kashmir': `Rewrite with: (1) India telecom shutdown data — how many shutdowns per year, which states, duration, (2) TRAI regulations on network shutdown — legal framework, (3) Airtel, Jio, Vi official response history, (4) Economic impact data — internet shutdowns cost India X billion, (5) Comparison to other countries' telecom policies, (6) What this means for 5G rollout in affected regions`,

  'macbook-neo': `Rewrite with: (1) Actual ChromeOS vs Android performance benchmarks — Geekbench scores, (2) ChromeOS app ecosystem reality in 2026 — what works, what doesn't, (3) Google's Chromebook market share data, (4) MacBook Air M4 vs Chromebook Plus specs table, (5) India pricing comparison — ₹ costs, student market, (6) Honest verdict: is $599 actually competitive for Indian buyers`,

  'tcl': `Rewrite with: (1) OLED vs MicroLED vs Super Pixel technology — technical explanation in plain English, (2) TCL's current display technology roadmap, (3) How this compares to Samsung QD-OLED and LG WOLED, (4) Real-world impact on phone displays — brightness, burn-in, efficiency, (5) Timeline — when will this actually reach consumer phones, (6) India market impact`,
}

function isArticleThin(article: any): boolean {
  const wordCount = (article.content || '').replace(/<[^>]*>/g, '').split(/\s+/).filter(Boolean).length
  return wordCount < MIN_WORD_COUNT
}

function matchesThinFix(article: any): string | null {
  const title = (article.title || '').toLowerCase()
  const slug = (article.slug || '').toLowerCase()
  const text = title + ' ' + slug

  for (const [keyword, fix] of Object.entries(THIN_ARTICLE_FIXES)) {
    if (text.includes(keyword)) return fix
  }
  return null
}

async function rewriteArticleContent(article: any, specificFix?: string): Promise<any> {
  const currentWordCount = (article.content || '').replace(/<[^>]*>/g, '').split(/\s+/).filter(Boolean).length

  const prompt = specificFix
    ? `You are Vijay Yadav, founder of The Tech Bharat. Rewrite this article completely to make it genuinely valuable for Indian readers.

CURRENT ARTICLE TITLE: ${article.title}
CURRENT WORD COUNT: ${currentWordCount} words (TOO SHORT — needs 1500+ words minimum)

SPECIFIC IMPROVEMENTS REQUIRED:
${specificFix}

ALSO APPLY THESE RULES:
- British English
- Prices in ₹ where relevant
- Personal opinions: "I think", "In my experience", "Personally"
- India-specific context (Flipkart/Amazon, Indian buyers, Indian market data)
- Mixed sentence lengths — short punchy + long analytical
- NO banned phrases: "seamless", "robust", "cutting-edge", "revolutionary", "furthermore", "moreover", "in conclusion", "it is worth noting"
- HTML only: <p>, <h2>, <h3>, <table>, <strong>, <ul>, <li>
- Minimum 1500 words
- Add comparison table where relevant
- Add FAQ section (4-5 questions)

Return ONLY valid JSON, no markdown:
{
  "title": "improved title (keep factual, add value signal)",
  "summary": "3-sentence improved summary",
  "bullets": ["5 specific improved bullets with numbers/facts"],
  "fullContent": "full rewritten HTML, 1500+ words",
  "tags": ["6 improved SEO tags"]
}`
    : `You are Vijay Yadav, founder of The Tech Bharat. This article is too short and thin. Expand it significantly.

TITLE: ${article.title}
CURRENT CONTENT (${currentWordCount} words):
${(article.content || '').slice(0, 1000)}

Rewrite and expand to 1500+ words with:
1. Deeper technical analysis
2. India pricing and market context
3. Comparison with 2-3 competitors
4. Real-world use cases for Indian buyers
5. Vijay's personal assessment
6. FAQ section (4 questions)

HTML only. Return ONLY valid JSON:
{
  "title": "title",
  "summary": "improved 3-sentence summary",
  "bullets": ["5 specific bullets"],
  "fullContent": "expanded HTML content 1500+ words",
  "tags": ["6 tags"]
}`

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
      messages: [{ role: 'user', content: prompt }],
    }),
  })

  if (!res.ok) throw new Error(`Anthropic ${res.status}`)
  const data = await res.json()
  const text = data.content.filter((b: {type:string}) => b.type === 'text').map((b: {text:string}) => b.text).join('')
  const clean = text.replace(/^```json\s*/m, '').replace(/```\s*$/m, '').trim()
  const match = clean.match(/\{[\s\S]*\}/)
  if (!match) throw new Error('No JSON')
  const parsed = JSON.parse(match[0])

  const wc = (parsed.fullContent || '').replace(/<[^>]*>/g, '').split(/\s+/).length
  const rt = Math.max(5, Math.ceil(wc / 220))

  return {
    ...article,
    title:         parsed.title    || article.title,
    summary:       parsed.summary  || article.summary,
    bullets:       parsed.bullets  || article.bullets,
    content:       parsed.fullContent || article.content,
    tags:          parsed.tags     || article.tags,
    readTime:      rt,
    seoTitle:      (parsed.title || article.title) + ' | The Tech Bharat',
    seoDescription: (parsed.summary || '').slice(0, 155),
    lastRewritten: new Date().toISOString(),
  }
}

export async function POST(request: NextRequest) {
  const cookie = request.cookies.get('__tb_admin')?.value
  if (!cookie) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const { searchParams } = new URL(request.url)
  const targetSlug = searchParams.get('slug')

  const articles = await getAllArticlesAsync()

  // Determine which articles to rewrite
  let toRewrite: any[] = []

  if (targetSlug) {
    // Single article by slug
    const found = articles.find((a: any) => a.slug === targetSlug)
    if (!found) return NextResponse.json({ error: `Article not found: ${targetSlug}` }, { status: 404 })
    toRewrite = [found]
  } else {
    // All thin articles
    toRewrite = articles.filter((a: any) => {
      if (isArticleThin(a)) return true
      if (matchesThinFix(a)) return true // known weak articles even if word count is OK
      return false
    })
  }

  if (toRewrite.length === 0) {
    return NextResponse.json({
      success: true,
      message: 'No thin articles found — all articles meet minimum quality standards',
      rewritten: [],
    })
  }

  const rewritten: string[] = []
  const errors: string[] = []
  const updatedMap = new Map<string, any>()

  for (let i = 0; i < toRewrite.length; i++) {
    const article = toRewrite[i]
    const specificFix = matchesThinFix(article) || undefined

    try {
      console.log(`[Rewrite] ${i+1}/${toRewrite.length}: ${article.slug}`)
      const improved = await rewriteArticleContent(article, specificFix)
      updatedMap.set(article.id, improved)
      rewritten.push(article.slug)

      if (i < toRewrite.length - 1) await new Promise(r => setTimeout(r, 3000))
    } catch (err) {
      errors.push(`${article.slug}: ${(err as Error).message}`)
      console.error(`[Rewrite] Failed ${article.slug}:`, (err as Error).message)
    }
  }

  // Merge rewrites back into full article list
  const finalArticles = articles.map((a: any) =>
    updatedMap.has(a.id) ? updatedMap.get(a.id) : a
  )
  await saveArticlesAsync(finalArticles)

  return NextResponse.json({
    success: true,
    rewritten,
    errors,
    total_rewritten: rewritten.length,
    total_errors: errors.length,
  })
}

// GET — list thin articles without rewriting them
export async function GET(request: NextRequest) {
  const cookie = request.cookies.get('__tb_admin')?.value
  if (!cookie) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const articles = await getAllArticlesAsync()

  const thinArticles = articles
    .filter((a: any) => isArticleThin(a) || matchesThinFix(a))
    .map((a: any) => ({
      slug: a.slug,
      title: a.title,
      wordCount: (a.content || '').replace(/<[^>]*>/g, '').split(/\s+/).filter(Boolean).length,
      hasFix: !!matchesThinFix(a),
      publishDate: a.publishDate,
    }))

  return NextResponse.json({
    thin_articles: thinArticles,
    count: thinArticles.length,
  })
}