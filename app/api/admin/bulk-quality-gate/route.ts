// app/api/admin/bulk-quality-gate/route.ts
// =====================================================================
//  ADSENSE REMEDIATION — bulk noindex helper
// ---------------------------------------------------------------------
//  Auth-gated (mounted under /api/admin, which middleware.ts already
//  protects with the __tb_admin cookie).
//
//  Three operations via the `?op=` query parameter:
//
//    GET /api/admin/bulk-quality-gate?op=analyze
//       Read-only audit. Returns counts and a per-article report
//       showing wordCount, isThin, hasFillerVerdict, isSpeculative,
//       and whether the article is currently noindexed. Make this
//       your first call to see what's about to change.
//
//    GET /api/admin/bulk-quality-gate?op=noindex-all
//       Sets `noindex: true` on EVERY article. Also strips any
//       auto-generated filler verdict still present. Idempotent.
//       Use this after deploying the patch so the existing thin /
//       AI-generated articles stop being indexed while you rewrite
//       them. Internal links still work; sitemap excludes them;
//       Googlebot will gradually drop them from the index.
//
//    GET /api/admin/bulk-quality-gate?op=noindex-thin
//       Selective version: sets `noindex: true` ONLY on articles
//       that fail at least ONE quality criterion (under 600 words,
//       has filler verdict, or is heavily speculative). Articles
//       that pass all gates are left alone. Use this AFTER you've
//       rewritten some articles and want to selectively re-flag
//       only the ones that are still weak.
//
//    GET /api/admin/bulk-quality-gate?op=restore&slug=THE-SLUG
//       Removes `noindex: true` from a single article (so it
//       becomes search-eligible again). Use this once an article
//       has been rewritten with real first-party content.
//
//    GET /api/admin/bulk-quality-gate?op=restore-all
//       Removes `noindex: true` from EVERY article. Emergency
//       rollback. Note: thin articles will still get noindex from
//       the runtime word-count gate in app/article/[slug]/page.tsx,
//       so this only un-flags the explicit editorial marker.
//
//  All operations are safe to run repeatedly.
// =====================================================================
import { NextRequest, NextResponse } from 'next/server'
import { getAllArticlesAsync, saveArticlesAsync } from '@/lib/store'

// Word-count threshold MUST stay in sync with MIN_INDEXABLE_WORDS
// in app/article/[slug]/page.tsx and app/sitemap.xml/route.ts.
const MIN_INDEXABLE_WORDS = 600

// Same filler signatures as ArticleClient.tsx + api/fix-verdict.
const FILLER_VERDICT_SIGNATURES = [
  /delivers a stable( overall)? experience/i,
  /doesn[\u2019']t lead (the|its) segment/i,
  /faces strong competition/i,
  /not the most exciting option/i,
  /doesn[\u2019']t stand out in its category/i,
  /not a category leader/i,
  /best suited for everyday users who want reliability/i,
  /makes sense for users who prefer balanced performance/i,
  /ideal for users upgrading from older devices/i,
  /works well for users who want value without complexity/i,
  /may not satisfy power users/i,
  /not be ideal for heavy gamers/i,
  /expecting flagship-level performance may feel limited/i,
  /not the best choice if you want top-tier features/i,
  /from a practical perspective/i,
  /based on overall performance/i,
  /after analyzing .{1,40} approach here/i,
  /looking at real-world usage/i,
  /this device suits users who are looking for practical performance/i,
  /a solid option for users who don[\u2019']t want to overspend/i,
  /best for users who want a simple, dependable smartphone experience/i,
  /not the right choice for users expecting flagship-level performance/i,
  /power users may find this device limiting/i,
  /not ideal if you want top-tier camera or gaming capabilities/i,
  /skip this if your priority is high-end performance/i,
  /overall, this is a practical device, but not the most exciting/i,
  /it gets the basics right, though it doesn[\u2019']t stand out/i,
  /a sensible choice for the right user, but not a category leader/i,
  /makes sense for buyers who want value without complexity/i,
  /a sensible pick for users who don[\u2019']t need flagship-level specs/i,
  /ideal for users who want consistent day-to-day performance/i,
  /not recommended for users who push devices to the limit/i,
  /avoid if you want the absolute best performance in this category/i,
  /may not satisfy users looking for cutting-edge features/i,
  /a safe choice, though not the most powerful option/i,
  /good overall, but not class-leading in any one area/i,
  /reliable, but not designed for high-end users/i,
  /offers decent value, but alternatives may be stronger/i,
  /a balanced device, but not a standout performer/i,
]

const SPECULATION_MARKERS = [
  'expected to launch', 'expected india price', 'expected price', 'expected pricing',
  'rumour', 'rumor', 'leaked', 'leak suggests', 'tipped to', 'tipster',
  'reportedly', 'allegedly', 'could launch', 'might launch', 'may launch',
  'pre-launch', 'pre launch', 'unconfirmed',
]

// ── Helpers ────────────────────────────────────────────────────────
function countWords(html: string): number {
  if (!html || typeof html !== 'string') return 0
  const text = html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
  if (!text) return 0
  return text.split(' ').length
}

function isFillerString(s: any): boolean {
  if (!s || typeof s !== 'string') return true
  if (s.trim().length < 40) return true
  return FILLER_VERDICT_SIGNATURES.some(rx => rx.test(s))
}

function hasFillerVerdict(v: any): boolean {
  if (!v || typeof v !== 'object') return false
  return isFillerString(v.buy) || isFillerString(v.notBuy) || isFillerString(v.final)
}

function countSpeculation(article: any): number {
  const hay = `${article.title || ''} ${article.summary || ''} ${article.content || ''}`.toLowerCase()
  let hits = 0
  for (const m of SPECULATION_MARKERS) if (hay.includes(m)) hits++
  return hits
}

interface Report {
  slug: string
  title: string
  wordCount: number
  isThin: boolean
  hasFillerVerdict: boolean
  speculationHits: number
  isHeavilySpeculative: boolean
  currentlyNoindexed: boolean
  failsQualityGate: boolean
}

function buildReport(a: any): Report {
  const wc = countWords(a.content || '')
  const isThin = wc < MIN_INDEXABLE_WORDS
  const filler = hasFillerVerdict(a.verdict)
  const specCount = countSpeculation(a)
  const isHeavySpec = specCount >= 3
  const noindexed = a.noindex === true
  const fails = isThin || filler || isHeavySpec
  return {
    slug:                  a.slug || '',
    title:                 a.title || '',
    wordCount:             wc,
    isThin,
    hasFillerVerdict:      filler,
    speculationHits:       specCount,
    isHeavilySpeculative:  isHeavySpec,
    currentlyNoindexed:    noindexed,
    failsQualityGate:      fails,
  }
}

// ── Route handler ──────────────────────────────────────────────────
async function handle(req: NextRequest): Promise<NextResponse> {
  const { searchParams } = new URL(req.url)
  const op   = (searchParams.get('op') || 'analyze').toLowerCase()
  const slug = searchParams.get('slug') || ''

  const articles = await getAllArticlesAsync()
  if (!Array.isArray(articles)) {
    return NextResponse.json({ error: 'Article store unavailable' }, { status: 503 })
  }

  // ─── ANALYZE (read-only) ────────────────────────────────────────
  if (op === 'analyze') {
    const reports = articles.map(buildReport)
    const summary = {
      totalArticles:        reports.length,
      currentlyNoindexed:   reports.filter(r => r.currentlyNoindexed).length,
      thin:                 reports.filter(r => r.isThin).length,
      withFillerVerdict:    reports.filter(r => r.hasFillerVerdict).length,
      heavilySpeculative:   reports.filter(r => r.isHeavilySpeculative).length,
      failingQualityGate:   reports.filter(r => r.failsQualityGate).length,
      wouldNoindexAll:      reports.length,
      wouldNoindexThinOnly: reports.filter(r => r.failsQualityGate).length,
    }
    return NextResponse.json({
      op: 'analyze',
      summary,
      threshold: { minWords: MIN_INDEXABLE_WORDS, minSpeculationMarkers: 3 },
      reports,
    })
  }

  // ─── NOINDEX-ALL ────────────────────────────────────────────────
  if (op === 'noindex-all') {
    let noindexed = 0
    let verdictsStripped = 0
    const updated = articles.map(a => {
      const next: any = { ...a }
      if (next.noindex !== true) {
        next.noindex = true
        noindexed++
      }
      if (hasFillerVerdict(next.verdict)) {
        delete next.verdict
        verdictsStripped++
      }
      return next
    })
    await saveArticlesAsync(updated)
    return NextResponse.json({
      success: true,
      op: 'noindex-all',
      totalArticles: articles.length,
      newlyNoindexed: noindexed,
      fillerVerdictsStripped: verdictsStripped,
      message:
        'All existing articles flagged noindex. Pages still render; Google will drop them from the index over a few weeks. ' +
        'Rewrite articles with real first-party content, then use op=restore&slug=... to re-index individually.',
    })
  }

  // ─── NOINDEX-THIN (selective) ───────────────────────────────────
  if (op === 'noindex-thin') {
    let noindexed = 0
    let verdictsStripped = 0
    let passedGate = 0
    const updated = articles.map(a => {
      const r = buildReport(a)
      const next: any = { ...a }
      if (hasFillerVerdict(next.verdict)) {
        delete next.verdict
        verdictsStripped++
      }
      if (r.failsQualityGate) {
        if (next.noindex !== true) {
          next.noindex = true
          noindexed++
        }
      } else {
        passedGate++
      }
      return next
    })
    await saveArticlesAsync(updated)
    return NextResponse.json({
      success: true,
      op: 'noindex-thin',
      totalArticles: articles.length,
      newlyNoindexed: noindexed,
      passedQualityGate: passedGate,
      fillerVerdictsStripped: verdictsStripped,
      message:
        'Only articles failing the quality gate (thin / filler verdict / heavily speculative) were flagged noindex.',
    })
  }

  // ─── RESTORE (single article) ───────────────────────────────────
  if (op === 'restore') {
    if (!slug) {
      return NextResponse.json({ error: 'op=restore requires &slug=...' }, { status: 400 })
    }
    let found = false
    const updated = articles.map(a => {
      if (a.slug !== slug) return a
      found = true
      const { noindex, ...rest } = a as any
      return rest
    })
    if (!found) {
      return NextResponse.json({ error: `slug not found: ${slug}` }, { status: 404 })
    }
    await saveArticlesAsync(updated)
    return NextResponse.json({
      success: true,
      op: 'restore',
      slug,
      message: 'noindex flag cleared. Article will be re-eligible for indexing on next crawl (subject to the runtime word-count gate).',
    })
  }

  // ─── RESTORE-ALL (emergency rollback) ───────────────────────────
  if (op === 'restore-all') {
    let cleared = 0
    const updated = articles.map(a => {
      if ((a as any).noindex !== true) return a
      cleared++
      const { noindex, ...rest } = a as any
      return rest
    })
    await saveArticlesAsync(updated)
    return NextResponse.json({
      success: true,
      op: 'restore-all',
      totalArticles: articles.length,
      flagsCleared: cleared,
      note:
        'Explicit noindex flags removed. The runtime word-count gate in app/article/[slug]/page.tsx still applies, ' +
        'so articles under 600 words remain noindex via that mechanism.',
    })
  }

  return NextResponse.json({
    error: 'Unknown op',
    validOps: ['analyze', 'noindex-all', 'noindex-thin', 'restore', 'restore-all'],
  }, { status: 400 })
}

export const GET  = handle
export const POST = handle
