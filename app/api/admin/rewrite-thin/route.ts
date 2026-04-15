// app/api/admin/rewrite-thin/route.ts
// ─────────────────────────────────────────────────────────────────────────────
// Rewrites ALL articles with 100% unique, high-value, India-specific content
//
// USAGE:
//   POST /api/admin/rewrite-thin              → rewrites articles that need it
//   POST /api/admin/rewrite-thin?all=1        → force rewrites EVERY article
//   POST /api/admin/rewrite-thin?slug=xxx     → rewrites ONE article by slug
//   POST /api/admin/rewrite-thin?all=1&type=review → force all reviews
//   POST /api/admin/rewrite-thin?batch=1&offset=0&limit=20 → batch mode
// ─────────────────────────────────────────────────────────────────────────────

import { NextRequest, NextResponse } from 'next/server'
import { getAllArticlesAsync, saveArticlesAsync } from '@/lib/store'

export const dynamic     = 'force-dynamic'
export const maxDuration = 300

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY || ''
const SITE_URL          = 'https://thetechbharat.com'

// ── QUALITY THRESHOLDS ───────────────────────────────────────────────────────
const MIN_WORD_COUNT     = 1000  // Articles below this are definitely thin
const TARGET_WORD_COUNT  = 1600  // Target for all rewrites

// ── BRAND-SPECIFIC INDIA CONTEXT ─────────────────────────────────────────────
const BRAND_CONTEXT: { [key: string]: string } = {
  samsung:  'Galaxy S/A/M/F tier breakdown for India, One UI vs stock Android, 3000+ service centres nationwide, software updates (7yr S-series, 5yr A-series, 4yr M-series), n78 5G band support, ₹ prices from Flipkart/Samsung.com, Samsung Care+ warranty, Made in India models',
  apple:    'India pricing vs USA (15-20% premium post PLI), Made-in-India models (15/16/16e), AppleCare+ India rates, resale value data (50% after 2yr), Certified Refurbished at apple.com/in, 100+ authorised service points, 7-year iOS update commitment',
  oneplus:  'SUPERVOOC charging (100W OnePlus 13/Nord 4, 80W 13R), OxygenOS 15 India features, 200+ service centres, Nord series positioning vs flagship, ₹ prices India, n78 5G support confirmed, update policy (4yr OnePlus 13, 3yr Nord 4, 2yr Nord CE)',
  xiaomi:   'HyperOS India version, ₹ prices from mi.com India/Flipkart, service concentrated in metros (weakness), 2yr update policy, n78 5G support, Redmi vs Poco vs Xiaomi India lineup explained',
  realme:   'realme UI 5.0 India, ₹ prices, GT vs Narzo vs C-series India positioning, 2yr updates, fast charging (67W-150W), Dimensity gaming performance BGMI tested',
  vivo:     'Funtouch OS India, ₹ prices, front camera leadership (50MP selfie standard), service network, 5G bands, X-series vs V-series vs Y-series India targeting, extended warranty options',
  nothing:  'Nothing OS 3.0 glyph practical utility, India pricing vs global, limited service network (major metros only), 3yr OS updates, transparent design India market reception, niche vs mainstream comparison',
  google:   'Tensor G4 reality vs Snapdragon (thermal, gaming), Pixel AI features India availability (Magic Eraser, Photo Unblur), very limited India service (25 cities only), india.google/pixel pricing, ₹ prices, 7yr Android update commitment',
  motorola: 'Motorola Edge/G/S series India, ₹ prices, near-stock Android advantage, 3yr updates, ThinkShield security, India service improving but patchy tier-3',
  oppo:     'ColorOS India features, ₹ prices, VOOC/SUPERVOOC charging India, service network, Find N3 foldable India pricing, Reno vs Find series India',
  iqoo:     'Monster Gaming Mode benchmarks, BGMI/Free Fire tested frame rates, ₹ prices India, iQOO vs OnePlus gaming comparison, 120W charging speed, Neo vs Pro series India',
  poco:     'Poco X vs M vs F series India positioning, ₹ prices, Snapdragon vs Dimensity gaming, MIUI/HyperOS fork, budget gaming champion, Flipkart exclusive launches',
}

// ── DETECT PRODUCT STATUS ────────────────────────────────────────────────────
function detectProductStatus(article: any): 'launched' | 'announced' | 'rumour' {
  const c = ((article.content || '') + (article.title || '')).toLowerCase()
  if (c.includes('leaked') || c.includes('reportedly') || c.includes('geekbench spotted') ||
      c.includes('tipster') || c.includes('leak suggests')) return 'rumour'
  if (c.includes('announced') || c.includes('launched globally') || c.includes('set to launch') ||
      c.includes('expected to arrive') || c.includes('pre-launch') || c.includes('india launch expected')) return 'announced'
  if (c.includes('available now') || c.includes('on sale') || c.includes('buy now') ||
      c.includes('flipkart') || c.includes('amazon india') || c.includes('mi.com') ||
      c.includes('samsung.com/in')) return 'launched'
  return 'launched'
}

// ── NEED REWRITE CHECK ────────────────────────────────────────────────────────
function needsRewrite(article: any): boolean {
  const wc = ((article.content || '').replace(/<[^>]*>/g, '').match(/\b\w+\b/g) || []).length
  if (wc < MIN_WORD_COUNT) return true

  const c = (article.content || '').toLowerCase()
  // Generic AI phrases that indicate low-uniqueness content
  const genericPhrases = [
    'seamless experience', 'cutting-edge', 'revolutionary', 'robust performance',
    'game-changer', 'state-of-the-art', 'packs a punch', 'noteworthy',
    'in conclusion,', 'to summarize,', 'furthermore,', 'moreover,',
    'it is worth noting', 'it should be noted', 'boasts impressive',
    'impressive feat', 'without further ado', 'in today\'s fast-paced',
  ]
  const genericCount = genericPhrases.filter(p => c.includes(p)).length
  if (genericCount >= 2) return true

  // Fake hands-on for non-launched products
  if (detectProductStatus(article) !== 'launched') {
    const fakeHandsOn = ['after two weeks with', 'in my hands-on', 'as my daily driver',
      "i've been using", 'after spending time with', 'during my review period']
    if (fakeHandsOn.some(p => c.includes(p))) return true
  }

  return false
}

// ── MAIN REWRITE FUNCTION ────────────────────────────────────────────────────
async function rewriteArticleWithClaude(article: any): Promise<any> {
  const wc     = ((article.content || '').replace(/<[^>]*>/g, '').match(/\b\w+\b/g) || []).length
  const brand  = (article.brand || 'Mobile').toLowerCase()
  const status = detectProductStatus(article)
  const type   = article.type || 'mobile-news'

  const brandCtx = BRAND_CONTEXT[brand] || 'Include: India pricing in ₹, Flipkart/Amazon India, service centre availability in metros and tier-2 cities, 5G band support (n78 for Jio/Airtel), software update policy, EMI options'

  const statusNote = {
    launched:  'Product IS AVAILABLE in India. Write with full confidence. Can reference Flipkart/Amazon India prices.',
    announced: 'Product officially announced but NOT YET in India. Use "expected", "set to launch", "announced". NO fake hands-on.',
    rumour:    'Based on leaks only. Use "leaked specs suggest", "reportedly", "if accurate". All claims unconfirmed.',
  }[status]

  const sourceNote = {
    launched:  '<p class="source-note font-sans text-xs text-muted mt-6 border-t border-border pt-4"><strong>Availability:</strong> Available in India on Flipkart and Amazon India. Prices verified at time of writing — confirm current price before purchase.</p>',
    announced: '<p class="source-note font-sans text-xs text-muted mt-6 border-t border-border pt-4"><strong>Pre-Launch Analysis:</strong> Based on official announcements and specifications. India pricing estimated from global price plus import duties. Verify on Flipkart/Amazon India before purchase.</p>',
    rumour:    '<p class="source-note font-sans text-xs text-muted mt-6 border-t border-border pt-4"><strong>Based on Leaks:</strong> Specifications and pricing from leaked sources — unconfirmed by manufacturer. Details may change at official launch.</p>',
  }[status]

  const typeGuide = ({
    review:       `REVIEW ARTICLE: Write as a real phone review. Structure: first impressions → design/build → display → performance/gaming → camera (with specific scenarios) → battery life (screen-on time estimates) → software/updates → value verdict → who should buy/skip → FAQ`,
    compare:      `COMPARISON ARTICLE: Write as a head-to-head comparison. Include a specs table comparing BOTH phones row-by-row. Verdict by use case: daily driver, photographer, gamer, student, professional. Definitive recommendation at end.`,
    'mobile-news': `NEWS ANALYSIS: Start with the actual news. Then analyse: what this means for Indian buyers, how it changes the competitive landscape, India pricing estimate, who this is for, what to buy instead while waiting.`,
  } as { [key: string]: string })[type] || `NEWS ANALYSIS: Write as informed mobile technology analysis for Indian buyers.`

  const prompt = `You are Vijay Yadav, Senior Mobile Editor at The Tech Bharat (thetechbharat.com). You have 11 years covering the Indian smartphone market — Mumbai, Delhi, Bengaluru, but you also know buyers in Patna, Surat, Bhubaneswar. You are direct, occasionally wry, frustrated by marketing fluff, and genuinely excited when hardware is actually good. You are writing for Vijay's real editorial voice — not a generic tech blog.

═══════════════════════════════════════
ARTICLE TO REWRITE
═══════════════════════════════════════
Title: ${article.title}
Brand: ${article.brand || 'Unknown'}
Type: ${type}
Current words: ${wc}

CURRENT CONTENT (first 2000 chars for context):
${(article.content || '').slice(0, 2000)}

═══════════════════════════════════════
STATUS: ${status.toUpperCase()}
${statusNote}

ARTICLE TYPE: ${typeGuide}

BRAND CONTEXT TO INCLUDE:
${brandCtx}

═══════════════════════════════════════
ABSOLUTE REQUIREMENTS — EVERY ONE MUST BE MET
═══════════════════════════════════════

1. WORD COUNT: Minimum ${TARGET_WORD_COUNT} words. Count carefully. Short articles fail AdSense review.

2. BANNED PHRASES — If any appear, the article is rejected:
   seamless, cutting-edge, revolutionary, robust, game-changer, state-of-the-art, boasts, packs a punch, noteworthy, "it is worth noting", "in conclusion", "to summarize", "furthermore", "moreover", "without further ado", "in today's fast-paced world", "in the realm of"

3. AUTHENTIC VOICE — Required elements:
   - At least 4 sentences starting with "I think", "My honest take", "Personally", "In my view", "What frustrates me about this"
   - At least 1 moment of genuine enthusiasm about something specific
   - At least 1 honest criticism or disappointment
   - Reference to Indian use context (heat/monsoon/dust, service centres, EMI, 5G on Jio/Airtel)

4. CONCRETE DATA — Every claim needs a number:
   - Prices in ₹ (not just "affordable")
   - Battery mAh + charging wattage + estimated charge time
   - Specific processor name + generation
   - Camera megapixels + OIS yes/no + specific scenario (night shot, portrait)
   - 5G bands: confirm n78 (3500MHz) for Jio/Airtel
   - Software update years (exact number, not "regular updates")

5. COMPETITORS — Must name at least 2 alternatives at similar price with honest comparison

6. STRUCTURE (each section 2-4 paragraphs minimum):
   • Opening paragraph: Start with the most surprising or interesting specific fact
   • Full specs breakdown: real-world meaning, not spec sheet copy
   • India pricing analysis: actual ₹ cost + EMI + competitor prices
   • Camera: specific scenarios — WhatsApp photos, Instagram reels, night shots, portraits
   • Performance: BGMI at which fps, app switching, heating under load
   • Battery: estimated hours, charge time, daily use survival
   • Software: update years, UI bloat level, India-relevant features
   • Who should buy / Who should skip / What to buy instead
   • FAQ: 4 questions Indian buyers actually ask
   • Source note (exact HTML below)

7. SOURCE NOTE (paste exactly):
${sourceNote}

8. HTML ONLY: Use <p>, <h2>, <h3>, <table>, <tr>, <td>, <th>, <strong>, <ul>, <li>
   NO markdown, NO code blocks, NO backticks in output

═══════════════════════════════════════
OUTPUT FORMAT
═══════════════════════════════════════
Return ONLY valid JSON. No markdown. No wrapper text. No explanation.

{
  "title": "Full title — never truncated. Format: [Product Name] [Key Differentiator]: [Question/Opinion for Indian Buyers]. Example: 'Nothing Phone (4a) Pro at ₹35,000: Mid-Range Champion or Overpriced Gimmick?'",
  "summary": "3 complete sentences. Each contains a specific number or comparison. No truncation with ...",
  "bullets": [
    "Specific bullet with number — e.g. '50MP OIS camera, f/1.88, confirmed n78 5G for Jio'",
    "Specific bullet with comparison — e.g. '₹34,999 price: Rs 5K less than OnePlus Nord 4'",
    "Specific bullet with data — e.g. '4,500mAh battery, 45W charging — 0-50% in ~35 min'",
    "Update commitment bullet — e.g. '3 years OS updates, 4 years security patches confirmed'",
    "Honest assessment bullet — e.g. 'Limited Nothing service network — major metros only'"
  ],
  "fullContent": "MINIMUM ${TARGET_WORD_COUNT} WORDS of HTML. All sections present. Source note at end.",
  "tags": ["Nothing Phone 4a Pro", "Nothing Phone India price", "mid-range phone India 2026", "Nothing Phone review", "₹35000 phone India", "best phone under 35000"]
}`

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method:  'POST',
    headers: {
      'Content-Type':      'application/json',
      'x-api-key':         ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model:      'claude-sonnet-4-20250514',
      max_tokens: 8000,
      messages:   [{ role: 'user', content: prompt }],
    }),
  })

  if (!res.ok) throw new Error(`Claude API ${res.status}: ${await res.text()}`)

  const data = await res.json()
  const raw  = data.content.filter((b: any) => b.type === 'text').map((b: any) => b.text).join('')

  // Robust JSON extraction
  const jsonMatch = raw.match(/\{[\s\S]*\}/)
  if (!jsonMatch) throw new Error('No JSON in response')
  const parsed = JSON.parse(jsonMatch[0])

  if (!parsed.fullContent || parsed.fullContent.length < 800) {
    throw new Error(`Content too short: ${parsed.fullContent?.length || 0} chars`)
  }

  const wc2 = ((parsed.fullContent || '').replace(/<[^>]*>/g, '').match(/\b\w+\b/g) || []).length
  const rt  = Math.max(5, Math.ceil(wc2 / 220))

  const cleanTitle = (parsed.title || article.title)
    .replace(/\s*\|\s*The Tech Bharat\s*$/i, '')
    .trim()

  const cleanSummary = (parsed.summary || '')
    .replace(/<[^>]*>/g, '')
    .trim()

  return {
    ...article,
    title:          cleanTitle,
    summary:        cleanSummary,
    bullets:        Array.isArray(parsed.bullets) ? parsed.bullets.slice(0, 5) : article.bullets,
    content:        parsed.fullContent,
    tags:           Array.isArray(parsed.tags) ? parsed.tags.slice(0, 8) : article.tags,
    readTime:       rt,
    wordCount:      wc2,
    seoTitle:       cleanTitle,                       // Full title — never truncated
    seoDescription: cleanSummary.slice(0, 155),       // First 155 chars of summary
    updatedDate:    new Date().toISOString(),
    lastRewritten:  new Date().toISOString(),
    rewriteVersion: 2,                               // Track rewrite version
  }
}

// ── API HANDLER ───────────────────────────────────────────────────────────────
export async function POST(request: NextRequest) {
  const cookie = request.cookies.get('__tb_admin')?.value
  if (!cookie?.startsWith('TBOK:')) {
    return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const targetSlug = searchParams.get('slug')
  const forceAll   = searchParams.get('all') === '1'
  const typeFilter = searchParams.get('type') || ''
  const batchMode  = searchParams.get('batch') === '1'
  const offset     = parseInt(searchParams.get('offset') || '0')
  const limit      = parseInt(searchParams.get('limit')  || '20')

  const articles = await getAllArticlesAsync() as any[]

  let toRewrite: any[] = []

  if (targetSlug) {
    // Single article
    const found = articles.find((a: any) => a.slug === targetSlug)
    if (!found) return NextResponse.json({ error: `Not found: ${targetSlug}` }, { status: 404 })
    toRewrite = [found]

  } else if (forceAll) {
    // Force rewrite ALL — respects type filter
    let pool = typeFilter ? articles.filter((a: any) => a.type === typeFilter) : articles
    // Batch mode: process offset/limit slice for pagination
    toRewrite = batchMode ? pool.slice(offset, offset + limit) : pool

  } else {
    // Smart mode: only articles that actually need work
    let pool = typeFilter ? articles.filter((a: any) => a.type === typeFilter) : articles
    toRewrite = pool.filter((a: any) => needsRewrite(a) || !a.lastRewritten)
    if (batchMode) toRewrite = toRewrite.slice(offset, offset + limit)
  }

  if (toRewrite.length === 0) {
    const total = typeFilter ? articles.filter((a: any) => a.type === typeFilter).length : articles.length
    return NextResponse.json({
      success: true,
      message: forceAll
        ? 'No articles in this batch'
        : 'No articles need rewriting — all meet quality standards',
      checked: total,
      total:   articles.length,
    })
  }

  const rewritten: string[] = []
  const errors:    string[] = []
  const updatedMap = new Map<string, any>()

  for (let i = 0; i < toRewrite.length; i++) {
    const article = toRewrite[i]
    try {
      console.log(`[Rewrite] ${i+1}/${toRewrite.length}: ${article.slug} (${(article.content || '').replace(/<[^>]*>/g, '').split(/\s+/).filter(Boolean).length} words)`)
      const improved = await rewriteArticleWithClaude(article)
      const newWc = improved.wordCount || 0
      console.log(`[Rewrite] ✅ ${article.slug}: ${newWc} words`)
      updatedMap.set(article.id, improved)
      rewritten.push(article.slug)
      // Rate limit: 2.5s between articles to avoid API throttling
      if (i < toRewrite.length - 1) await new Promise(r => setTimeout(r, 2500))
    } catch (err) {
      const msg = (err as Error).message
      errors.push(`${article.slug}: ${msg}`)
      console.error(`[Rewrite] ❌ ${article.slug}:`, msg)
    }
  }

  // Save all rewrites back to Redis
  if (updatedMap.size > 0) {
    const finalArticles = articles.map((a: any) =>
      updatedMap.has(a.id) ? updatedMap.get(a.id) : a
    )
    await saveArticlesAsync(finalArticles)
  }

  const nextOffset = offset + limit
  const hasMore    = forceAll && nextOffset < (typeFilter ? articles.filter((a: any) => a.type === typeFilter).length : articles.length)

  return NextResponse.json({
    success:    true,
    rewritten:  rewritten.length,
    errors:     errors.length,
    slugs:      rewritten,
    errorList:  errors,
    total:      articles.length,
    // Batch pagination info
    ...(batchMode && {
      offset,
      limit,
      nextOffset: hasMore ? nextOffset : null,
      nextUrl:    hasMore ? `/api/admin/rewrite-thin?all=1&batch=1&offset=${nextOffset}&limit=${limit}` : null,
      hasMore,
    }),
  })
}