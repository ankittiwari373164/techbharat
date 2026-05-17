// app/api/admin/scrub-content/route.ts
// =====================================================================
//  CONTENT SCRUBBER — Bulk AI-tic and filler removal
// ---------------------------------------------------------------------
//  This is the single most impactful endpoint for AdSense compliance.
//  It scans every article body in Redis and removes the patterns that
//  identify scaled / AI-generated content to Google's classifiers:
//
//    1. AI rhetorical openers ("Honestly,", "Look,", "And honestly?",
//       "The thing is —", "Fair enough.", "Which is great.", etc.)
//       at the start of sentences.
//    2. Fabricated-experience signals ("I personally tested for 30
//       days", "In controlled testing scenarios, I measured...",
//       "After using this for 3 weeks I can confirm...") — these are
//       AI hallucinations claiming first-hand experience that the
//       author cannot actually have for unreleased products.
//    3. Overused AI vocabulary ("seamless", "robust", "cutting-edge",
//       "revolutionary", "in today's fast-paced world", "it is worth
//       noting that", "moreover", "furthermore", "in conclusion").
//    4. Identical boilerplate paragraphs that appear on many articles
//       ("The best smartphone is not decided by specs alone...",
//       "Final Advice" blocks, etc.).
//    5. Identical "Read More" / "Browse All Guides" emoji bars at
//       the bottom of article bodies (in case they're in content,
//       not just template).
//
//  Idempotent and safe. Returns per-article report of what was changed.
//
//  Auth: gated under /api/admin/* by middleware (cookie required).
// =====================================================================
import { NextRequest, NextResponse } from 'next/server'
import { getAllArticlesAsync, saveArticlesAsync } from '@/lib/store'

// ── Rule 1: AI rhetorical sentence openers ──────────────────────────
// Match these only at sentence boundaries (after ., !, ?, >, or start).
const AI_OPENERS = [
  /(^|[.!?>][\s"]*)(Honestly[,?]?\s+)/g,
  /(^|[.!?>][\s"]*)(Look,\s+)/g,
  /(^|[.!?>][\s"]*)(And honestly[,?]?\s+)/g,
  /(^|[.!?>][\s"]*)(The thing is\s*[\u2014\-]?\s*)/g,
  /(^|[.!?>][\s"]*)(Here[\u2019']s the thing\s*[\u2014\-]?\s*)/g,
  /(^|[.!?>][\s"]*)(Here[\u2019']s where it gets interesting[,.\s]*)/g,
  /(^|[.!?>][\s"]*)(Fair enough[.,]\s+)/g,
  /(^|[.!?>][\s"]*)(Which is great[.,]\s+)/g,
  /(^|[.!?>][\s"]*)(Right[.,]\s+)/g,
  /(^|[.!?>][\s"]*)(Honestly though[,?]?\s+)/g,
  /(^|[.!?>][\s"]*)(I mean[,?]?\s+)/g,
  /(^|[.!?>][\s"]*)(You know what[,?]?\s+)/g,
]

// ── Rule 2: Fabricated experience claims ────────────────────────────
//  These are entire sentences (or sentence parts) that AI generates to
//  fake authority. They tend to claim specific test durations and
//  measured results that can't be verified. Drop the whole sentence.
const FABRICATED_SENTENCE_PATTERNS = [
  /[^.!?]*\bin controlled testing scenarios?[^.!?]*[.!?]/gi,
  /[^.!?]*\bafter (using this|testing this|having used this) for \d+ (days?|weeks?|months?)[^.!?]*[.!?]/gi,
  /[^.!?]*\bI[\u2019']ve been using (the|my|this) [^.!?]{1,40}for (the past )?\d+ (days?|weeks?|months?)[^.!?]*[.!?]/gi,
  /[^.!?]*\bI personally tested[^.!?]*[.!?]/gi,
  /[^.!?]*\bin my testing[^.!?]*\b\d+\s*(hours?|fps|mAh|GB|MB|MHz|GHz)[^.!?]*[.!?]/gi,
  /[^.!?]*\bI measured\b[^.!?]*\b\d+[^.!?]*[.!?]/gi,
  /[^.!?]*\bduring (my|our) [^.!?]{1,30} testing[^.!?]*\b\d+[^.!?]*[.!?]/gi,
]

// ── Rule 3: Banned overused AI vocabulary (replace with neutrals) ───
const VOCABULARY_REPLACEMENTS: Array<[RegExp, string]> = [
  [/\bseamlessly\b/gi,        'smoothly'],
  [/\bseamless\b/gi,          'smooth'],
  [/\brobust\b/gi,            'solid'],
  [/\bcutting-edge\b/gi,      'modern'],
  [/\brevolutionary\b/gi,     'new'],
  [/\bgame[- ]changing\b/gi,  'significant'],
  [/\bworld-class\b/gi,       'high-quality'],
  [/\bstate-of-the-art\b/gi,  'modern'],
  [/\bfurthermore,?\s*/gi,    ''],
  [/\bmoreover,?\s*/gi,       ''],
  [/\bin conclusion,?\s*/gi,  ''],
  [/\bin today[\u2019']s fast[- ]paced world,?\s*/gi, ''],
  [/\bit[\u2019']s worth noting that\s+/gi, ''],
  [/\bit is worth noting that\s+/gi,         ''],
  [/\bneedless to say,?\s*/gi, ''],
  [/\bat the end of the day,?\s*/gi, ''],
  [/\bwhen all is said and done,?\s*/gi, ''],
  [/\bin the grand scheme of things,?\s*/gi, ''],
]

// ── Rule 4: Identical boilerplate paragraphs ────────────────────────
// Entire <p>…</p> blocks that match these signatures get removed.
const BOILERPLATE_PARAGRAPH_SIGNATURES = [
  /best smartphone is not decided by specs alone/i,
  /focus on your daily usage/i,
  /the right phone for you is the one that/i,
  /every smartphone is a compromise/i,
  /at the end of the day, the best phone is/i,
]

// ── Rule 5: Emoji-heavy footer/nav bars in content ──────────────────
// Lines that are mostly emoji + links to /best-* pages.
const EMOJI_NAV_BAR_RE = /<p[^>]*>(?:\s*(?:[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]\s*)+(?:<a[^>]+href=["']\/best-[^"']+["'][^>]*>[^<]+<\/a>|<a[^>]+href=["']\/[a-z\-]+-india["'][^>]*>[^<]+<\/a>|[^<])+){3,}\s*<\/p>/gu

// ── Rule 6: "1Battery..." / "2Expected..." numbering bugs in body ───
// If raw <li> content begins with a digit immediately followed by a
// capital letter, insert a separator. We don't try to format — just
// don't let unrendered template variables pass through.
const NUMBERING_BUG_RE = /(<li[^>]*>)(\d{1,2})([A-Z])/g

interface ScrubReport {
  slug:                 string
  title:                string
  changes: {
    aiOpenersRemoved:        number
    fabricatedSentencesRemoved: number
    vocabularyReplacements:  number
    boilerplateBlocksRemoved: number
    emojiNavBarsRemoved:     number
    numberingBugsFixed:      number
  }
  bytesBefore: number
  bytesAfter:  number
  wasChanged:  boolean
}

function scrubArticleContent(html: string): { html: string; report: ScrubReport['changes'] } {
  if (!html || typeof html !== 'string') {
    return { html: html || '', report: {
      aiOpenersRemoved: 0, fabricatedSentencesRemoved: 0,
      vocabularyReplacements: 0, boilerplateBlocksRemoved: 0,
      emojiNavBarsRemoved: 0, numberingBugsFixed: 0,
    }}
  }

  let out = html
  const report = {
    aiOpenersRemoved: 0, fabricatedSentencesRemoved: 0,
    vocabularyReplacements: 0, boilerplateBlocksRemoved: 0,
    emojiNavBarsRemoved: 0, numberingBugsFixed: 0,
  }

  // Rule 1: AI openers — strip the opener, keep the sentence
  for (const re of AI_OPENERS) {
    out = out.replace(re, (_full, lead) => {
      report.aiOpenersRemoved++
      return lead || ''
    })
  }

  // Rule 2: Fabricated experience sentences — drop entirely
  for (const re of FABRICATED_SENTENCE_PATTERNS) {
    out = out.replace(re, () => {
      report.fabricatedSentencesRemoved++
      return ''
    })
  }

  // Rule 3: Vocabulary replacements
  for (const [re, repl] of VOCABULARY_REPLACEMENTS) {
    out = out.replace(re, (_m) => {
      report.vocabularyReplacements++
      return repl
    })
  }

  // Rule 4: Boilerplate <p> blocks
  out = out.replace(/<p[^>]*>([\s\S]*?)<\/p>/gi, (full, inner) => {
    for (const sig of BOILERPLATE_PARAGRAPH_SIGNATURES) {
      if (sig.test(inner)) {
        report.boilerplateBlocksRemoved++
        return ''
      }
    }
    return full
  })

  // Rule 5: Emoji nav bars
  out = out.replace(EMOJI_NAV_BAR_RE, () => {
    report.emojiNavBarsRemoved++
    return ''
  })

  // Rule 6: Numbering bug
  out = out.replace(NUMBERING_BUG_RE, (_m, tag, num, letter) => {
    report.numberingBugsFixed++
    return `${tag}${num}. ${letter}`
  })

  // Cleanup: collapse multiple consecutive blank lines / empty <p> tags
  out = out.replace(/<p[^>]*>\s*<\/p>/gi, '')
  out = out.replace(/\n{3,}/g, '\n\n')

  return { html: out, report }
}

// ── Same scrub for summary, bullets, verdicts ──────────────────────
function scrubPlainText(s: string): string {
  if (!s || typeof s !== 'string') return s || ''
  let out = s
  for (const re of AI_OPENERS) out = out.replace(re, (_f, lead) => lead || '')
  for (const re of FABRICATED_SENTENCE_PATTERNS) out = out.replace(re, '')
  for (const [re, repl] of VOCABULARY_REPLACEMENTS) out = out.replace(re, repl)
  return out.replace(/\s{2,}/g, ' ').trim()
}

async function handle(req: NextRequest): Promise<NextResponse> {
  const { searchParams } = new URL(req.url)
  const dryRun = searchParams.get('dry') === '1' || searchParams.get('dryrun') === '1'

  const articles = await getAllArticlesAsync()
  if (!Array.isArray(articles)) {
    return NextResponse.json({ error: 'Article store unavailable' }, { status: 503 })
  }

  const reports: ScrubReport[] = []
  let totalChanged = 0
  let totalOpeners = 0
  let totalFabricated = 0
  let totalVocab = 0
  let totalBoilerplate = 0
  let totalEmojiBars = 0
  let totalNumbering = 0

  const updated = articles.map((a: any) => {
    const before = a.content || ''
    const beforeSummary = a.summary || ''
    const beforeBullets = JSON.stringify(a.bullets || [])

    const { html: scrubbedContent, report } = scrubArticleContent(before)
    const scrubbedSummary = scrubPlainText(beforeSummary)
    const scrubbedBullets = Array.isArray(a.bullets) ? a.bullets.map(scrubPlainText) : []

    const wasChanged =
      scrubbedContent !== before ||
      scrubbedSummary !== beforeSummary ||
      JSON.stringify(scrubbedBullets) !== beforeBullets

    reports.push({
      slug:        a.slug || '',
      title:       a.title || '',
      changes:     report,
      bytesBefore: before.length,
      bytesAfter:  scrubbedContent.length,
      wasChanged,
    })

    if (wasChanged) {
      totalChanged++
      totalOpeners      += report.aiOpenersRemoved
      totalFabricated   += report.fabricatedSentencesRemoved
      totalVocab        += report.vocabularyReplacements
      totalBoilerplate  += report.boilerplateBlocksRemoved
      totalEmojiBars    += report.emojiNavBarsRemoved
      totalNumbering    += report.numberingBugsFixed
    }

    if (dryRun || !wasChanged) return a
    return { ...a, content: scrubbedContent, summary: scrubbedSummary, bullets: scrubbedBullets }
  })

  if (!dryRun) {
    await saveArticlesAsync(updated)
  }

  return NextResponse.json({
    success: true,
    dryRun,
    totalArticles: articles.length,
    articlesChanged: totalChanged,
    totals: {
      aiOpenersRemoved:           totalOpeners,
      fabricatedSentencesRemoved: totalFabricated,
      vocabularyReplacements:     totalVocab,
      boilerplateBlocksRemoved:   totalBoilerplate,
      emojiNavBarsRemoved:        totalEmojiBars,
      numberingBugsFixed:         totalNumbering,
    },
    message: dryRun
      ? 'DRY RUN: nothing was saved. Remove ?dry=1 to actually apply changes.'
      : 'Content scrubbed. Articles will reflect changes on next page load (revalidate ~3600s).',
    // Only return per-article reports for changed articles to keep payload small
    changedArticles: reports.filter(r => r.wasChanged).slice(0, 50),
  })
}

export const GET  = handle
export const POST = handle
