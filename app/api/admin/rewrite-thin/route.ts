// app/api/admin/rewrite-thin/route.ts
// ─────────────────────────────────────────────────────────────────────────────
// Rewrites articles one at a time — designed for Vercel Hobby (10s limit)
//
// GET  /api/admin/rewrite-thin              → returns list of slugs to rewrite
// GET  /api/admin/rewrite-thin?all=1        → returns ALL slugs (force mode)
// POST /api/admin/rewrite-thin?slug=xxx     → rewrites EXACTLY ONE article
//
// Client-side loop (PowerShell) calls POST once per slug.
// Each call rewrites 1 article and completes in ~8-12 seconds.
// ─────────────────────────────────────────────────────────────────────────────

import { NextRequest, NextResponse } from 'next/server'
import { getAllArticlesAsync, saveArticlesAsync } from '@/lib/store'

export const dynamic     = 'force-dynamic'
export const maxDuration = 60  // Pro plan = 60s, Hobby = 10s (Claude ~8-12s per article)

const ANTHROPIC_API_KEY = 'https://api.anthropic.com/v1/messages'
const CLAUDE_API        = 'https://api.anthropic.com/v1/messages'
const SITE_URL          = 'https://thetechbharat.com'
const TARGET_WORDS      = 1600
const MIN_WORDS         = 900

// ── BRAND CONTEXT ─────────────────────────────────────────────────────────────
const BRAND_CTX: Record<string, string> = {
  samsung:  'Galaxy S/A/M/F tier breakdown India, One UI vs stock Android, 3000+ service centres nationwide, update commitment: 7yr S-series / 5yr A-series / 4yr M-series, n78 5G for Jio+Airtel, ₹ prices Flipkart/samsung.com, Made in India models',
  apple:    'India pricing 15-20% premium post-PLI, Made-in-India models (15/16/16e), AppleCare+ India rates, 50% resale value after 2yr, Certified Refurbished apple.com/in, 100+ authorised service points, 7-year iOS updates',
  oneplus:  'SUPERVOOC: 100W on 13/Nord 4, 80W on 13R, OxygenOS 15 India, 200+ service centres, updates: 4yr OnePlus 13 / 3yr Nord 4 / 2yr Nord CE, n78 5G confirmed, ₹ prices India',
  xiaomi:   'HyperOS India, ₹ prices mi.com India+Flipkart, service concentrated metros (weakness), 2yr update policy, n78 5G support, Redmi vs Poco vs Xiaomi India explained',
  realme:   'realme UI 5.0 India, ₹ prices, GT vs Narzo vs C-series India, 2yr updates, charging 67W-150W, Dimensity gaming BGMI tested',
  vivo:     'Funtouch OS India, ₹ prices, 50MP front camera standard, service network, n78 5G, X-series vs V-series vs Y-series',
  nothing:  'Nothing OS 3.0 glyph utility, India pricing vs global, limited service major metros only, 3yr OS updates, niche vs mainstream comparison',
  google:   'Tensor G4 real vs Snapdragon (thermal+gaming), Pixel AI India availability, very limited service (25 cities), india.google/pixel ₹ prices, 7yr Android updates',
  motorola: 'Edge/G/S series India, ₹ prices, near-stock Android, 3yr updates, ThinkShield security, patchy tier-3 service',
  oppo:     'ColorOS India, ₹ prices, VOOC/SUPERVOOC charging, Find N3 foldable India pricing, Reno vs Find series',
  iqoo:     'Monster Gaming Mode BGMI frame rates, ₹ prices India, iQOO vs OnePlus gaming, 120W charging, Neo vs Pro India',
  poco:     'X vs M vs F series India, ₹ prices, Snapdragon vs Dimensity gaming, budget gaming champion, Flipkart exclusive launches',
}

function detectStatus(a: any): 'launched' | 'announced' | 'rumour' {
  const c = ((a.content || '') + ' ' + (a.title || '')).toLowerCase()
  if (/leaked|reportedly|tipster|geekbench spotted/.test(c)) return 'rumour'
  if (/set to launch|india launch expected|pre-launch|coming to india/.test(c)) return 'announced'
  if (/flipkart|amazon india|mi\.com|available now|on sale|buy now/.test(c)) return 'launched'
  return 'launched'
}

function wordCount(a: any): number {
  return ((a.content || '').replace(/<[^>]*>/g, '').match(/\b\w+\b/g) || []).length
}

function needsRewrite(a: any): boolean {
  if (wordCount(a) < MIN_WORDS) return true
  if (!a.lastRewritten) return true
  const c = (a.content || '').toLowerCase()
  const banned = ['seamless experience','cutting-edge','revolutionary','robust performance',
    'game-changer','state-of-the-art','packs a punch','noteworthy',
    'in conclusion,','furthermore,','moreover,','it is worth noting']
  if (banned.filter(p => c.includes(p)).length >= 2) return true
  const fakeHandsOn = ['after two weeks with','in my hands-on','as my daily driver',
    "i've been using",'after spending time with','during my review period']
  if (detectStatus(a) !== 'launched' && fakeHandsOn.some(p => c.includes(p))) return true
  return false
}

async function rewriteOne(article: any): Promise<any> {
  const brand  = (article.brand || 'Mobile').toLowerCase()
  const status = detectStatus(article)
  const type   = article.type || 'mobile-news'
  const wc     = wordCount(article)
  const ctx    = BRAND_CTX[brand] || 'Include: India ₹ pricing, Flipkart/Amazon India, 5G n78 bands for Jio/Airtel, service centres, update policy, EMI options'

  const statusLine = {
    launched:  'PRODUCT AVAILABLE IN INDIA — write with confidence, reference Flipkart/Amazon India prices',
    announced: 'OFFICIALLY ANNOUNCED, NOT IN INDIA YET — use "expected", "set to launch". No fake hands-on.',
    rumour:    'BASED ON LEAKS ONLY — use "leaked specs suggest", "reportedly". All unconfirmed.',
  }[status]

  const sourceNote = {
    launched:  '<p class="source-note font-sans text-xs text-muted mt-6 border-t border-border pt-4"><strong>Availability:</strong> Available in India on Flipkart and Amazon India. Verify price before purchase.</p>',
    announced: '<p class="source-note font-sans text-xs text-muted mt-6 border-t border-border pt-4"><strong>Pre-Launch Analysis:</strong> Based on official announcements. India pricing estimated. Verify on Flipkart/Amazon before purchase.</p>',
    rumour:    '<p class="source-note font-sans text-xs text-muted mt-6 border-t border-border pt-4"><strong>Based on Leaks:</strong> Specs unconfirmed. Details may change at official launch.</p>',
  }[status]

  const typeGuide = type === 'review'
    ? 'REVIEW: first impressions → design → display → performance/gaming → camera → battery → software → verdict → who should buy/skip → FAQ'
    : type === 'compare'
    ? 'COMPARISON: specs table side-by-side → winner per category → use-case verdict (gamer/photographer/student/professional) → definitive recommendation'
    : 'NEWS ANALYSIS: what happened → what it means for Indian buyers → India pricing estimate → who it\'s for → what to buy instead while waiting'

  const prompt = `You are Vijay Yadav, Senior Mobile Editor at The Tech Bharat. 11 years covering Indian smartphones. Direct, occasionally wry, genuinely excited by good hardware, frustrated by fluff. You write for buyers in Delhi, Mumbai, Bengaluru AND Patna, Surat, Bhubaneswar.

ARTICLE: ${article.title}
BRAND: ${article.brand || 'Unknown'} | TYPE: ${type} | CURRENT: ${wc} words
STATUS: ${statusLine}

EXISTING CONTENT (context only — rewrite completely):
${(article.content || '').slice(0, 1500)}

BRAND CONTEXT TO INCLUDE: ${ctx}
ARTICLE TYPE GUIDE: ${typeGuide}

HARD REQUIREMENTS — ALL MUST PASS:

1. MINIMUM ${TARGET_WORDS} WORDS. Count carefully before finishing.

2. NEVER USE THESE PHRASES (instant rejection):
   seamless, cutting-edge, revolutionary, robust, game-changer, state-of-the-art,
   boasts, packs a punch, noteworthy, "it is worth noting", "in conclusion",
   "to summarize", "furthermore", "moreover", "in today's fast-paced"

3. VOICE — required in every article:
   • 4+ sentences with "I think" / "My honest take" / "Personally" / "In my view"
   • 1 genuine moment of enthusiasm about something specific
   • 1 honest criticism or disappointment with specific reasoning
   • India usage context: heat/monsoon, service centres, EMI, 5G on Jio/Airtel n78

4. EVERY CLAIM NEEDS A NUMBER:
   • Prices in ₹ (not "affordable" or "budget-friendly")
   • Battery: mAh + wattage + charge time minutes
   • Camera: exact MP + OIS yes/no + aperture f/ number
   • Performance: chip name + which games at which fps
   • Updates: exact years, not "regular updates"
   • 5G: confirm n78 (3500MHz) support for Jio/Airtel

5. COMPETITORS: name 2+ phones at similar price with honest comparison

6. MANDATORY SECTIONS (2-4 paragraphs each):
   Opening (most interesting specific fact) → Full Specs (real-world meaning) →
   India Pricing (₹ + EMI + competitors) → Camera (WhatsApp/Instagram/night/portrait) →
   Performance (BGMI fps + heating + app switching) → Battery (hours + charge time) →
   Software (update years + bloat level) → Buy/Skip/Alternatives → FAQ (4 questions) → Source note

7. SOURCE NOTE (include exactly):
${sourceNote}

8. HTML ONLY: <p> <h2> <h3> <table> <tr> <td> <th> <strong> <ul> <li>
   No markdown. No backticks. No code blocks.

Return ONLY this JSON (no wrapper, no explanation):
{
  "title": "Full title never truncated. Format: [Phone]: [Key Point for Indian Buyers]? Example: Nothing Phone (4a) Pro at ₹35,000: Best Mid-Range Value or Just Good Design?",
  "summary": "Exactly 3 sentences with specific numbers. Complete sentences, no truncation.",
  "bullets": ["fact with number","fact with comparison","fact with data","update policy fact","honest limitation fact"],
  "fullContent": "${TARGET_WORDS}+ words HTML. All sections. Source note at end.",
  "tags": ["6 specific SEO tags with model name, price range, India"]
}`

  const apiKey = process.env.ANTHROPIC_API_KEY || ''
  if (!apiKey) throw new Error('ANTHROPIC_API_KEY not set')

  const res = await fetch(CLAUDE_API, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-api-key': apiKey, 'anthropic-version': '2023-06-01' },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 8000,
      messages: [{ role: 'user', content: prompt }],
    }),
  })

  if (!res.ok) throw new Error(`Claude ${res.status}: ${await res.text()}`)

  const data  = await res.json()
  const raw   = data.content.filter((b: any) => b.type === 'text').map((b: any) => b.text).join('')
  const match = raw.match(/\{[\s\S]*\}/)
  if (!match) throw new Error('No JSON in response')

  const parsed = JSON.parse(match[0])
  if (!parsed.fullContent || parsed.fullContent.length < 600) throw new Error(`Too short: ${parsed.fullContent?.length}`)

  const wc2   = ((parsed.fullContent || '').replace(/<[^>]*>/g, '').match(/\b\w+\b/g) || []).length
  const clean = (s: string) => (s || '').replace(/\s*\|\s*The Tech Bharat\s*$/i, '').trim()

  return {
    ...article,
    title:          clean(parsed.title || article.title),
    summary:        (parsed.summary || '').replace(/<[^>]*>/g, '').trim(),
    bullets:        (parsed.bullets || article.bullets || []).slice(0, 5),
    content:        parsed.fullContent,
    tags:           (parsed.tags || article.tags || []).slice(0, 8),
    readTime:       Math.max(5, Math.ceil(wc2 / 220)),
    wordCount:      wc2,
    seoTitle:       clean(parsed.title || article.title),
    seoDescription: (parsed.summary || '').replace(/<[^>]*>/g, '').trim().slice(0, 155),
    updatedDate:    new Date().toISOString(),
    lastRewritten:  new Date().toISOString(),
    rewriteVersion: 2,
  }
}

// ── AUTH HELPER: Check token from cookie or query param ────────────────────────
function validateAuth(request: NextRequest): string | null {
  const url = new URL(request.url)
  const searchParams = url.searchParams
  
  // Try cookie first (browser), then query param (automation)
  const cookieToken = request.cookies.get('__tb_admin')?.value
  const queryToken = searchParams.get('token')
  const token = cookieToken || queryToken
  
  if (token?.startsWith('TBOK:')) {
    return token
  }
  
  return null
}

// ── GET: returns slugs that need rewriting ────────────────────────────────────
export async function GET(request: NextRequest) {
  const token = validateAuth(request)
  if (!token) {
    return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const forceAll   = searchParams.get('all') === '1'
  const typeFilter = searchParams.get('type') || ''

  const articles = await getAllArticlesAsync() as any[]
  let pool = typeFilter ? articles.filter((a: any) => a.type === typeFilter) : articles

  const toRewrite = forceAll ? pool : pool.filter(needsRewrite)

  return NextResponse.json({
    total:     articles.length,
    toRewrite: toRewrite.length,
    slugs:     toRewrite.map((a: any) => ({
      slug:   a.slug,
      words:  wordCount(a),
      brand:  a.brand || 'Mobile',
      type:   a.type || 'mobile-news',
      status: detectStatus(a),
    })),
  })
}

// ── POST: rewrites EXACTLY ONE article ────────────────────────────────────────
export async function POST(request: NextRequest) {
  const token = validateAuth(request)
  if (!token) {
    return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const slug = searchParams.get('slug')
  if (!slug) return NextResponse.json({ error: 'slug parameter required. Use GET to list slugs.' }, { status: 400 })

  const articles = await getAllArticlesAsync() as any[]
  const article  = articles.find((a: any) => a.slug === slug)
  if (!article) return NextResponse.json({ error: `Not found: ${slug}` }, { status: 404 })

  try {
    const before = wordCount(article)
    const improved = await rewriteOne(article)
    const after    = improved.wordCount || 0

    const finalArticles = articles.map((a: any) => a.slug === slug ? improved : a)
    await saveArticlesAsync(finalArticles)

    return NextResponse.json({
      success: true,
      slug,
      before:  before,
      after:   after,
      title:   improved.title,
    })
  } catch (err) {
    return NextResponse.json({ success: false, slug, error: (err as Error).message }, { status: 500 })
  }
}