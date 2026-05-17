// lib/internal-linking.ts
// =====================================================================
//  INTERNAL LINKING ENGINE v2 — ADSENSE / SEO REMEDIATION
// ---------------------------------------------------------------------
//  v1 problems:
//    • Only matched the first 2 words of an article title (often
//      generic words like "iPhone 17" matched everywhere).
//    • Skipped guides / pillar pages entirely.
//    • Max 4 links — too few for a 1,500-word article.
//    • No scoring; first-match-wins gave noisy choices.
//    • No anchor variety; same word becomes a link to the same URL
//      every time it appears.
//
//  v2 design:
//    • Builds an INDEX of all articles + all pillar pages, each with
//      a list of "anchor phrases" weighted by how distinctive they are.
//    • Scores each potential anchor against the current article so the
//      MOST RELEVANT link wins, not the first-found.
//    • Distinguishes article→article, article→pillar, and pillar→article
//      links so we can build a proper hub-and-spoke topology.
//    • Caps links per article AND per anchor (no anchor used twice).
//    • Skips headings (<h1>–<h6>), code blocks, and existing <a> spans.
//    • Returns metadata so the calling page can render a small "Read also"
//      strip from the same scored candidate list.
// =====================================================================

import { PILLAR_REGISTRY, getPillarsForArticle, type PillarMeta } from './pillar-registry'

export interface LinkableArticle {
  slug:     string
  title:    string
  brand?:   string
  type?:    string
  tags?:    string[]
  summary?: string
}

interface AnchorCandidate {
  phrase:   string          // the literal anchor phrase to look for
  href:     string          // /slug or /pillar-path
  title:    string          // for "Read also" UI
  kind:     'article' | 'pillar'
  weight:   number          // base distinctiveness (longer/rarer → higher)
}

interface LinkingResult {
  html:          string
  linksAdded:    number
  readAlso:      Array<{ slug: string; title: string; kind: 'article' | 'pillar'; href: string }>
}

// ── Stop words removed from anchor candidates ──────────────────────
const STOP_WORDS = new Set([
  'the','a','an','and','or','but','of','to','in','on','for','with','at','by',
  'is','are','was','were','be','been','being','this','that','these','those',
  'it','its','as','from','than','then','will','can','could','should','would',
  'has','have','had','do','does','did','no','not','if','so','up','out','off',
  '2024','2025','2026','2027','vs','via',
])

// ── Words considered "distinctive" for India tech content ─────────
const DISTINCTIVE_BOOSTS = new Map<string, number>([
  ['flipkart', 1.5], ['amazon', 1.3], ['croma', 1.5], ['jio', 1.5],
  ['airtel', 1.5], ['emi', 1.4], ['gst', 1.4], ['india', 1.2],
  ['snapdragon', 1.4], ['mediatek', 1.4], ['dimensity', 1.4],
  ['amoled', 1.3], ['ltpo', 1.4], ['ipx', 1.3],
])

function tokenize(s: string): string[] {
  return (s || '')
    .toLowerCase()
    .replace(/[^a-z0-9₹\s]/g, ' ')
    .split(/\s+/)
    .filter(w => w.length > 2 && !STOP_WORDS.has(w))
}

/**
 * Extract anchor candidates from an article's title.
 * Prefers multi-word phrases (2–4 words) that include a brand or
 * product name. Falls back to single distinctive words.
 */
function buildArticleAnchors(a: LinkableArticle): string[] {
  const out: string[] = []
  const title = a.title || ''
  if (!title) return out

  // Strip leading category prefixes
  const clean = title
    .replace(/^[\u2014\-\s]+/, '')
    .replace(/[?!.:]+\s*$/, '')
    .trim()

  // Take the first 2–4 meaningful words
  const words = clean.split(/\s+/)
  for (let n = Math.min(4, words.length); n >= 2; n--) {
    const phrase = words.slice(0, n).join(' ').trim()
    const tokens = tokenize(phrase)
    if (tokens.length >= 2) out.push(phrase)
  }

  // Also brand + first key noun ("Samsung Galaxy", "OnePlus Nord")
  if (a.brand && a.brand !== 'Mobile') {
    const idx = clean.toLowerCase().indexOf(a.brand.toLowerCase())
    if (idx === 0) {
      const slice = clean.split(/\s+/).slice(0, 3).join(' ')
      if (!out.includes(slice)) out.push(slice)
    }
  }

  return Array.from(new Set(out))
}

function scoreAnchor(phrase: string): number {
  const toks = tokenize(phrase)
  if (!toks.length) return 0
  let base = Math.min(toks.length, 4) * 1.0           // 2-w=2, 3-w=3, 4-w=4
  for (const t of toks) {
    const boost = DISTINCTIVE_BOOSTS.get(t)
    if (boost) base *= boost
  }
  // Penalise very generic anchors
  if (toks.length === 1 && toks[0].length < 6) base *= 0.5
  return base
}

/**
 * Build the full anchor candidate list for the current article,
 * including both other articles AND the pillar pages relevant
 * to this article's brand / type.
 */
function buildCandidateIndex(
  current:  LinkableArticle,
  articles: LinkableArticle[],
): AnchorCandidate[] {
  const out: AnchorCandidate[] = []

  // ── Article candidates ──────────────────────────────────────
  for (const a of articles) {
    if (!a.slug || !a.title) continue
    if (a.slug === current.slug) continue
    const phrases = buildArticleAnchors(a)
    for (const phrase of phrases) {
      out.push({
        phrase,
        href:   `/${a.slug}`,
        title:  a.title,
        kind:   'article',
        weight: scoreAnchor(phrase),
      })
    }
  }

  // ── Pillar candidates ───────────────────────────────────────
  // Each pillar has trigger phrases that, when matched in the body,
  // will be linked. Pillars are weighted higher than article links
  // because they're hub pages.
  const relevantPillars = getPillarsForArticle(current)
  for (const p of relevantPillars) {
    for (const trigger of p.triggers) {
      out.push({
        phrase: trigger,
        href:   p.path,
        title:  p.title,
        kind:   'pillar',
        weight: scoreAnchor(trigger) * 1.4, // pillar boost
      })
    }
  }

  // Sort descending by weight so most distinctive anchors win
  return out.sort((a, b) => b.weight - a.weight)
}

// ── Section detection: skip <a>, <h1-6>, <code>, <pre>, attribute strings ──
const SKIP_TAG_RE = /^<(a\b|h[1-6]\b|code\b|pre\b|script\b|style\b)/i

/**
 * Main entry: insert internal links + return read-also list.
 */
export function addInternalLinks(
  html:        string,
  currentSlug: string,
  articles:    LinkableArticle[],
  opts:        { maxLinks?: number; brand?: string; type?: string } = {},
): string {
  const result = addInternalLinksRich(html, currentSlug, articles, opts)
  return result.html
}

export function addInternalLinksRich(
  html:        string,
  currentSlug: string,
  articles:    LinkableArticle[],
  opts:        { maxLinks?: number; brand?: string; type?: string; tags?: string[] } = {},
): LinkingResult {
  const empty: LinkingResult = { html: html || '', linksAdded: 0, readAlso: [] }
  if (!html || typeof html !== 'string') return empty
  if (!Array.isArray(articles)) return empty

  const MAX_LINKS = Math.max(2, Math.min(opts.maxLinks ?? 6, 10))
  const current: LinkableArticle = {
    slug:  currentSlug,
    title: '',
    brand: opts.brand,
    type:  opts.type,
    tags:  opts.tags,
  }

  let candidates: AnchorCandidate[]
  try {
    candidates = buildCandidateIndex(current, articles)
  } catch (err) {
    console.error('[internal-linking] buildCandidateIndex failed:', err)
    return empty
  }

  if (!candidates.length) return empty

  // Track what's been used so we don't double-link
  const usedHrefs   = new Set<string>()
  const usedAnchors = new Set<string>()
  let linksAdded = 0
  const readAlso: LinkingResult['readAlso'] = []

  // Split HTML into [tag, text, tag, text, ...] so we never inject
  // a link inside an attribute or inside another tag.
  const parts = html.split(/(<[^>]+>)/g)

  // Track nesting depth so we skip text inside <a>, <h*>, <code>, <pre>
  let skipDepth = 0

  for (let i = 0; i < parts.length; i++) {
    const part = parts[i]
    if (!part) continue

    if (part.startsWith('<')) {
      // Tag — adjust skipDepth
      if (SKIP_TAG_RE.test(part)) {
        if (!part.startsWith('</')) skipDepth++
      } else if (skipDepth > 0) {
        // Closing of a skipped tag?
        const m = part.match(/^<\/(a|h[1-6]|code|pre|script|style)\b/i)
        if (m) skipDepth = Math.max(0, skipDepth - 1)
      }
      continue
    }

    if (skipDepth > 0) continue
    if (linksAdded >= MAX_LINKS) break
    if (part.length < 20) continue   // skip tiny text fragments

    let textChunk = part
    for (const cand of candidates) {
      if (linksAdded >= MAX_LINKS) break
      if (usedHrefs.has(cand.href)) continue
      if (usedAnchors.has(cand.phrase.toLowerCase())) continue

      const rx = new RegExp(`\\b${escapeRegex(cand.phrase)}\\b`, 'i')
      const m = rx.exec(textChunk)
      if (!m) continue

      const matched = m[0]
      const before  = textChunk.slice(0, m.index)
      const after   = textChunk.slice(m.index + matched.length)

      const linkClass = cand.kind === 'pillar' ? 'internal-link pillar-link' : 'internal-link'
      const rel       = cand.kind === 'pillar' ? 'internal'                  : 'internal'

      textChunk =
        before +
        `<a href="${cand.href}" class="${linkClass}" rel="${rel}" ` +
        `style="color:#d4220a;font-weight:600;text-decoration:underline">` +
        `${matched}</a>` +
        after

      usedHrefs.add(cand.href)
      usedAnchors.add(cand.phrase.toLowerCase())
      linksAdded++
      readAlso.push({
        slug: cand.href.replace(/^\//, ''),
        title: cand.title,
        kind: cand.kind,
        href: cand.href,
      })
    }
    parts[i] = textChunk
  }

  return { html: parts.join(''), linksAdded, readAlso }
}

function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

// =====================================================================
//  REVERSE INDEX — for pillar pages, find the BEST N articles to feature
// =====================================================================
/**
 * Given a pillar's keyword list, rank all articles by how well they
 * match. Used by pillar pages to render a curated, contextual list
 * instead of dumping everything from Redis.
 */
export function rankArticlesForPillar(
  articles: LinkableArticle[],
  pillar:   { keywords: string[]; brand?: string },
  limit = 12,
): LinkableArticle[] {
  if (!Array.isArray(articles)) return []
  const kws = (pillar.keywords || []).map(k => k.toLowerCase())
  if (!kws.length) return articles.slice(0, limit)

  return articles
    .filter(a => a.slug && a.title)
    .map(a => {
      const hay = [
        a.title || '', a.summary || '',
        ...(a.tags || []),
        a.brand || '',
      ].join(' ').toLowerCase()
      let score = 0
      for (const kw of kws) {
        // Title hit is worth 3, tag hit 2, body hit 1
        if ((a.title || '').toLowerCase().includes(kw)) score += 3
        if ((a.tags || []).some(t => t.toLowerCase().includes(kw))) score += 2
        if (hay.includes(kw)) score += 1
      }
      if (pillar.brand && (a.brand || '').toLowerCase() === pillar.brand.toLowerCase()) {
        score += 2
      }
      return { article: a, score }
    })
    .filter(x => x.score > 0)
    .sort((x, y) => y.score - x.score)
    .slice(0, limit)
    .map(x => x.article)
}

// Re-export pillar registry so callers can find pillars from a single import.
export { PILLAR_REGISTRY, getPillarsForArticle, type PillarMeta }
