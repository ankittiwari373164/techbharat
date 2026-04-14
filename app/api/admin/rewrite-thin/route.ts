// app/api/admin/rewrite-thin/route.ts
// ─────────────────────────────────────────────────────────────────────────────
// Rewrites thin, duplicate, or low-quality articles with genuine content
// POST /api/admin/rewrite-thin            — rewrite ALL thin articles
// POST /api/admin/rewrite-thin?slug=xxx   — rewrite ONE specific article
// POST /api/admin/rewrite-thin?all=1      — force rewrite ALL articles
// POST /api/admin/rewrite-thin?all=1&type=review — force rewrite all reviews
// ─────────────────────────────────────────────────────────────────────────────

import { NextRequest, NextResponse } from 'next/server'
import { getAllArticlesAsync, saveArticlesAsync } from '@/lib/store'

export const dynamic    = 'force-dynamic'
export const maxDuration = 300

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY || ''
const SITE_URL          = process.env.NEXT_PUBLIC_SITE_URL || 'https://thetechbharat.com'

// Articles under this word count are rewritten automatically
const MIN_WORD_COUNT = 900

// Brand-specific content enhancement instructions
const BRAND_FIXES: Record<string, string> = {
  'samsung': 'Include: Galaxy S/A/M series tier breakdown for India, OneUI vs stock Android, service centre advantage (3000+ centres), software update commitment (7yr S-series, 5yr A-series, 4yr M-series), India-specific 5G bands (n78), actual ₹ prices from Flipkart/Amazon India.',
  'apple':   'Include: India pricing reality vs USA, import duty impact, Made-in-India iPhone models (15, 16, 16e), AppleCare+ India cost, resale value data, actual ₹ prices, service centre count in India, Certified Refurbished option on apple.com/in.',
  'oneplus': 'Include: SUPERVOOC charging speeds (100W Nord 4, 80W 13R), OxygenOS vs stock Android, service network expansion data, actual ₹ prices, Nord series value vs flagship, India launch pricing history.',
  'xiaomi':  'Include: MIUI/HyperOS India version, actual ₹ prices from mi.com India and Flipkart, service centre reality (concentrated in metros), update support policy (2yr), 5G band support confirmation.',
  'realme':  'Include: realme UI India features, actual ₹ prices, charging speed comparison, update policy (2yr), gaming performance on Dimensity chips, India market positioning vs Redmi.',
  'vivo':    'Include: India pricing ₹, Funtouch OS features, camera strengths (front camera focus), service network, 5G band support, target demographic (selfie-focused buyers).',
  'nothing': 'Include: Nothing OS transparency, glyph interface real utility, India pricing vs global, Nothing service in India (limited), update policy, niche appeal vs Samsung/OnePlus mainstream.',
  'google':  'Include: Tensor G4 vs Snapdragon real-world performance, Pixel camera computational photography (Night Sight, Magic Eraser), Google service in India (very limited), india.google/pixel pricing, comparison with OnePlus at similar price.',
}

// Detect product status for honest framing
function detectProductStatus(article: any): 'launched' | 'announced' | 'rumour' {
  const content = (article.content || '').toLowerCase()
  const title   = (article.title   || '').toLowerCase()
  const hasSourceNote = content.includes('source-note') || content.includes('pre-launch') || content.includes('based on leaks')
  if (content.includes('available now') || content.includes('on sale') || content.includes('buy now') ||
      content.includes('flipkart') || content.includes('amazon india')) return 'launched'
  if (content.includes('leaked') || content.includes('reportedly') || content.includes('geekbench spotted') ||
      title.includes('leak') || title.includes('rumour')) return 'rumour'
  if (content.includes('announced') || content.includes('launched globally') || content.includes('set to launch') ||
      content.includes('expected') || content.includes('pre-launch')) return 'announced'
  return 'launched' // default assumption
}

function isArticleThin(article: any): boolean {
  const wc = (article.content || '').replace(/<[^>]*>/g, '').split(/\s+/).filter(Boolean).length
  return wc < MIN_WORD_COUNT
}

function hasDuplicateLanguage(article: any): boolean {
  const content = (article.content || '').replace(/<[^>]*>/g, '').toLowerCase()
  const badPhrases = [
    'seamless experience', 'cutting-edge technology', 'revolutionary design',
    'robust performance', 'game-changer', 'next-level', 'state-of-the-art',
    'boasts impressive', 'packs a punch', 'impressive feat', 'noteworthy',
    'it is worth noting', 'it should be noted', 'in conclusion', 'furthermore',
    'in summary', 'to summarize', 'overall, this phone', 'overall, the device',
  ]
  const count = badPhrases.filter(p => content.includes(p)).length
  return count >= 3  // 3+ banned phrases = duplicate AI-speak
}

function hasFakeHandsOn(article: any): boolean {
  const content = (article.content || '').toLowerCase()
  const status  = detectProductStatus(article)
  if (status === 'launched') return false  // Real hands-on is fine
  const fakeHandsOn = [
    'after two weeks with', 'in my hands-on', 'as my daily driver',
    "i've been using", 'after spending time with', 'in my testing',
    'during my review period', 'after a month with', 'my review unit',
  ]
  return fakeHandsOn.some(phrase => content.includes(phrase))
}

async function rewriteArticle(article: any): Promise<any> {
  const wordCount  = (article.content || '').replace(/<[^>]*>/g, '').split(/\s+/).filter(Boolean).length
  const brand      = (article.brand || '').toLowerCase()
  const brandHints = BRAND_FIXES[brand] || ''
  const status     = detectProductStatus(article)
  const articleType = article.type || 'mobile-news'

  const statusFraming = {
    launched:  'This product IS AVAILABLE IN INDIA. Write with confidence. You may reference pricing from Flipkart/Amazon India.',
    announced: 'This product has been officially announced but NOT yet in India. Use "expected", "announced", "set to launch". NO fake hands-on language.',
    rumour:    'This is based on leaks/rumours. Use "leaked specs suggest", "reportedly", "if accurate". Label ALL claims as unconfirmed.',
  }[status]

  const sourceNote = {
    launched:  '<p class="source-note"><strong>Availability:</strong> Available in India on Flipkart and Amazon India. Verify current price before purchase.</p>',
    announced: '<p class="source-note"><strong>Pre-Launch Analysis:</strong> Based on official announcements. India pricing estimated from global price and import duties. Verify on Flipkart/Amazon before purchase.</p>',
    rumour:    '<p class="source-note"><strong>Based on Leaks:</strong> Specs and pricing unconfirmed by manufacturer. All details may change at official launch. Do not make purchase decisions based on leaked information.</p>',
  }[status]

  const typeInstructions = {
    'review':      'Write as an in-depth phone review. Include: hands-on feel (or honest disclaimer if pre-launch), camera samples described, gaming performance, battery test results, daily use impressions.',
    'compare':     'Write as a head-to-head comparison. Include: specs table comparing BOTH phones side-by-side, which wins on each spec, definitive verdict by use case (budget buyer, photographer, gamer, power user).',
    'mobile-news': 'Write as informed analysis. Include: what this means for Indian buyers, price positioning, how it fits the market, who should pay attention.',
  }[articleType] || 'Write as informed mobile technology analysis for Indian buyers.'

  const prompt = `You are Vijay Yadav, Senior Mobile Editor at The Tech Bharat. You have 11 years covering the Indian smartphone market. You write for Indian buyers — Delhi, Mumbai, Bengaluru, but also Patna, Indore, and Coimbatore. You are direct, occasionally wry, genuinely excited by good hardware, and specifically frustrated by marketing fluff.

ARTICLE TO REWRITE:
Title: ${article.title}
Type: ${articleType}
Brand: ${article.brand || 'Unknown'}
Current word count: ${wordCount} words

CURRENT CONTENT (first 1500 chars):
${(article.content || '').slice(0, 1500)}

PRODUCT STATUS: ${status.toUpperCase()}
${statusFraming}

ARTICLE TYPE INSTRUCTIONS:
${typeInstructions}

BRAND-SPECIFIC REQUIREMENTS:
${brandHints || 'Include India pricing in ₹, 5G band support for Jio/Airtel (n78), service centre availability, update policy.'}

MANDATORY QUALITY REQUIREMENTS:
1. MINIMUM 1600 words — Google AdSense rejects anything under 1000. This will be human-reviewed.
2. BANNED PHRASES — never use: seamless, cutting-edge, revolutionary, robust, game-changer, state-of-the-art, boasts, packs a punch, noteworthy, "it is worth noting", "in conclusion", "furthermore", "in summary"
3. AUTHENTIC VOICE: At least 3 personal opinion sentences. Use: "I think", "My honest take", "Personally", "In my experience with Indian phones", "What bothers me about this is"
4. INDIA CONTEXT in every major section: pricing in ₹, Flipkart/Amazon, EMI options, 5G band compatibility (Jio n78, Airtel n78), service centre access, summer heat/dust durability
5. NUMBERS AND DATA: specific specs, exact prices, benchmark scores if applicable — no vague claims
6. FRAMING HONESTY: follow status rules above — no fake hands-on for pre-launch products
7. COMPARISON: mention at least 2 competitors at similar price, with honest verdict
8. Source note: add exactly this HTML at end:
${sourceNote}

MANDATORY STRUCTURE:
Section 1 (200 words): Opening — start with the most interesting specific thing about this product, not generic intro
Section 2 (250 words): Full specs with real-world meaning (not spec sheet copy-paste — explain what each spec MEANS)  
Section 3 (200 words): India pricing analysis — actual ₹ cost, EMI breakdown, competitor prices
Section 4 (200 words): Camera quality (real results or honest pre-launch estimate based on sensor specs)
Section 5 (200 words): Battery life and charging (real results or honest estimate)
Section 6 (200 words): Who should buy this / who should skip / what to buy instead
Section 7 (150 words): FAQ section with 3-4 questions India buyers actually ask (price, 5G, service, updates)
Section 8: Source note (per status rules)

HTML FORMATTING ONLY: use <p>, <h2>, <h3>, <table>, <strong>, <ul>, <li>. No markdown.

Return ONLY valid JSON with NO markdown wrapper:
{
  "title": "specific title with model name — question or opinion format if appropriate, never truncated",
  "summary": "3 specific sentences about this exact product with real numbers. Never generic. Never truncated with ...",
  "bullets": ["5 bullets with specific numbers — no vague claims", "each bullet under 12 words", "no duplicate information across bullets"],
  "fullContent": "MINIMUM 1600 words of HTML content per structure above",
  "tags": ["6 specific SEO tags: model name, brand, category, India, price range, feature"]
}`

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type':    'application/json',
      'x-api-key':       ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model:      'claude-sonnet-4-20250514',
      max_tokens: 8000,
      messages:   [{ role: 'user', content: prompt }],
    }),
  })

  if (!res.ok) throw new Error(`Anthropic API ${res.status}: ${await res.text()}`)
  const data = await res.json()
  const raw  = data.content.filter((b: {type:string}) => b.type === 'text').map((b: {text:string}) => b.text).join('')
  const clean = raw.replace(/^```json\s*/m, '').replace(/```\s*$/m, '').trim()
  const match = clean.match(/\{[\s\S]*\}/)
  if (!match) throw new Error('No JSON in response')
  const parsed = JSON.parse(match[0])

  if (!parsed.fullContent || parsed.fullContent.length < 500) {
    throw new Error('Response too short — likely API timeout')
  }

  const wc = (parsed.fullContent || '').replace(/<[^>]*>/g, '').split(/\s+/).filter(Boolean).length
  const rt = Math.max(5, Math.ceil(wc / 220))

  // Clean title — never truncate, never add suffix
  const cleanTitle = (parsed.title || article.title)
    .replace(/\s*\|\s*The Tech Bharat\s*$/i, '')
    .trim()

  // Accurate word count for schema
  const actualWordCount = wc

  return {
    ...article,
    title:          cleanTitle,
    summary:        (parsed.summary || '').replace(/<[^>]*>/g, '').trim(),
    bullets:        Array.isArray(parsed.bullets) ? parsed.bullets : article.bullets,
    content:        parsed.fullContent,
    tags:           Array.isArray(parsed.tags)    ? parsed.tags    : article.tags,
    readTime:       rt,
    wordCount:      actualWordCount,
    // Full titles — no truncation
    seoTitle:       cleanTitle,
    seoDescription: (parsed.summary || '').replace(/<[^>]*>/g, '').trim().slice(0, 155),
    updatedDate:    new Date().toISOString(),
    lastRewritten:  new Date().toISOString(),
  }
}

export async function POST(request: NextRequest) {
  const cookie = request.cookies.get('__tb_admin')?.value
  if (!cookie?.startsWith('TBOK:')) {
    return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const targetSlug = searchParams.get('slug')
  const forceAll   = searchParams.get('all') === '1'
  const typeFilter = searchParams.get('type') || ''
  const minWords   = parseInt(searchParams.get('minwords') || '0') || MIN_WORD_COUNT

  const articles = await getAllArticlesAsync() as any[]

  let toRewrite: any[] = []

  if (targetSlug) {
    const found = articles.find((a: any) => a.slug === targetSlug)
    if (!found) return NextResponse.json({ error: `Not found: ${targetSlug}` }, { status: 404 })
    toRewrite = [found]
  } else if (forceAll) {
    toRewrite = typeFilter ? articles.filter((a: any) => a.type === typeFilter) : articles
  } else {
    // Auto: thin + duplicate language + fake hands-on + never rewritten
    let pool = typeFilter ? articles.filter((a: any) => a.type === typeFilter) : articles
    toRewrite = pool.filter((a: any) => {
      if (isArticleThin(a))          return true
      if (hasDuplicateLanguage(a))   return true
      if (hasFakeHandsOn(a))         return true
      return false
    })
  }

  if (toRewrite.length === 0) {
    return NextResponse.json({
      success: true,
      message: 'No articles need rewriting — all meet quality standards',
      checked: articles.length,
    })
  }

  const rewritten: string[] = []
  const errors:    string[] = []
  const updatedMap = new Map<string, any>()

  for (let i = 0; i < toRewrite.length; i++) {
    const article = toRewrite[i]
    try {
      console.log(`[Rewrite] ${i+1}/${toRewrite.length}: ${article.slug}`)
      const improved = await rewriteArticle(article)
      updatedMap.set(article.id, improved)
      rewritten.push(article.slug)
      if (i < toRewrite.length - 1) await new Promise(r => setTimeout(r, 2500))
    } catch (err) {
      const msg = (err as Error).message
      errors.push(`${article.slug}: ${msg}`)
      console.error(`[Rewrite] Failed ${article.slug}:`, msg)
    }
  }

  const finalArticles = articles.map((a: any) =>
    updatedMap.has(a.id) ? updatedMap.get(a.id) : a
  )
  await saveArticlesAsync(finalArticles)

  return NextResponse.json({
    success:   true,
    rewritten: rewritten.length,
    errors:    errors.length,
    slugs:     rewritten,
    errorList: errors,
  })
}