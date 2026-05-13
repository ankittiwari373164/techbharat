// app/api/fix-verdict/route.ts
// =====================================================================
//  CONVERTED FROM FILLER-GENERATOR → FILLER-REMOVER
// ---------------------------------------------------------------------
//  Previously this endpoint shuffled boilerplate phrases like
//    "delivers a stable experience but doesn't lead its segment"
//  into article.verdict on every call. Those phrases were classic
//  scaled-content filler that triggered Google's "Low value content"
//  classifier and contributed to the AdSense disapproval.
//
//  New behaviour: scan all articles, detect templated/filler verdicts
//  using the same signature list ArticleClient uses, and DELETE them.
//  Articles without a real human-written verdict will simply not
//  render a verdict box.
//
//  Safe to call repeatedly. Idempotent.
// =====================================================================
import { NextResponse } from 'next/server'
import { getAllArticlesAsync, saveArticlesAsync } from '@/lib/store'

// Mirrors the list in ArticleClient.tsx. Keep these in sync.
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
  // Phrases from the older /api/fix-verdict pool
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

function isFillerText(s: any): boolean {
  if (!s || typeof s !== 'string') return true
  if (s.trim().length < 40) return true
  return FILLER_VERDICT_SIGNATURES.some(rx => rx.test(s))
}

function isFillerVerdict(v: any): boolean {
  if (!v || typeof v !== 'object') return false
  return isFillerText(v.buy) || isFillerText(v.notBuy) || isFillerText(v.final)
}

export async function GET() {
  const articles = await getAllArticlesAsync()
  let removed = 0
  let kept = 0

  const cleaned = articles.map(a => {
    if (!a.verdict) return a
    if (isFillerVerdict(a.verdict)) {
      removed++
      const { verdict, ...rest } = a as any
      return rest
    }
    kept++
    return a
  })

  await saveArticlesAsync(cleaned)

  return NextResponse.json({
    success: true,
    total: articles.length,
    fillerRemoved: removed,
    humanWrittenKept: kept,
    message:
      'Filler/auto-generated verdicts have been removed. ' +
      'Verdict boxes will no longer render on articles without a real, human-written verdict.',
  })
}

// Same handler for POST so it can be triggered from forms / cron.
export const POST = GET
