// lib/pillar-utils.ts
// =====================================================================
//  PILLAR PAGE UTILITIES — upgraded for hub-and-spoke architecture
// ---------------------------------------------------------------------
//  • Uses lib/pillar-registry as the source of truth for pillar metadata.
//  • Uses lib/internal-linking#rankArticlesForPillar for scoring.
//  • Filters out noindexed articles so they don't appear on hubs.
//  • Filters out heavily speculative articles from pillar listings
//    (they're still indexed individually if good enough, but a
//    "best phones" hub shouldn't surface unreleased products).
//  • Returns hand-tagged article quality so pillar pages can prefer
//    longer / better-reviewed pieces.
// =====================================================================

import { getAllArticlesAsync } from '@/lib/store'
import { rankArticlesForPillar } from '@/lib/internal-linking'
import { getPillarByPath, type PillarMeta } from '@/lib/pillar-registry'

export interface PillarArticle {
  slug:           string
  title:          string
  summary:        string
  brand:          string
  type:           string
  publishDate:    string
  featuredImage?: string
  readTime?:      number
  tags?:          string[]
  wordCount?:     number
}

export function currentMonthYear(): { month: string; year: number } {
  const now = new Date()
  const months = ['January','February','March','April','May','June',
                  'July','August','September','October','November','December']
  return { month: months[now.getMonth()], year: now.getFullYear() }
}

export function formatPillarDate(dateStr: string): string {
  try {
    const d = new Date(dateStr)
    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
    return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`
  } catch { return '' }
}

const SPECULATION_MARKERS = [
  'expected to launch', 'expected india price', 'rumour', 'rumor',
  'leaked', 'tipped to launch', 'reportedly', 'allegedly',
  'could launch', 'might launch', 'unconfirmed',
]

function countSpeculation(text: string): number {
  const t = text.toLowerCase()
  let n = 0
  for (const m of SPECULATION_MARKERS) if (t.includes(m)) n++
  return n
}

function approxWordCount(html: string): number {
  if (!html) return 0
  const t = html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
  return t ? t.split(' ').length : 0
}

/**
 * Get articles ranked for a pillar page.
 *
 * @param keywords     keyword list used for scoring (legacy signature)
 * @param excludeSlugs hide these from results
 * @param limit        max number of articles
 * @param brandFilter  if set, only this brand's articles
 */
export async function getPillarArticles(
  keywords: string[],
  excludeSlugs?: string[],
  limit = 15,
  brandFilter?: string,
): Promise<PillarArticle[]> {
  try {
    const all = await getAllArticlesAsync() as any[]
    if (!Array.isArray(all)) return []

    // ── Quality gate: remove noindexed / very thin / heavily speculative ──
    const eligible = all.filter(a => {
      if (!a.slug || !a.title) return false
      if (a.noindex === true) return false
      const wc = approxWordCount(a.content || '')
      if (wc < 600) return false
      // For pillar hubs we exclude heavily speculative articles even if
      // they're individually indexed — a buyer guide shouldn't surface
      // unreleased products as recommendations.
      const haystack = `${a.title} ${a.summary || ''} ${a.content || ''}`
      if (countSpeculation(haystack) >= 3) return false
      return true
    })

    // ── Brand pre-filter (if provided) ──
    const brandFiltered = (brandFilter && brandFilter !== 'None')
      ? eligible.filter(a => (a.brand || '').toLowerCase() === brandFilter.toLowerCase())
      : eligible

    // ── Rank ──
    const ranked = rankArticlesForPillar(brandFiltered, { keywords, brand: brandFilter }, limit + 5)

    // ── Final shape + exclude list ──
    return ranked
      .filter(a => !excludeSlugs?.includes(a.slug))
      .slice(0, limit)
      .map((a: any) => ({
        slug:          a.slug,
        title:         a.title,
        summary:       a.summary || '',
        brand:         a.brand || 'Mobile',
        type:          a.type || 'mobile-news',
        publishDate:   a.publishDate,
        featuredImage: (a.featuredImage && !a.featuredImage.startsWith('/phone-images/') && !a.featuredImage.includes('picsum'))
                       ? a.featuredImage : '',
        readTime:      a.readTime || 5,
        tags:          a.tags || [],
        wordCount:     approxWordCount(a.content || ''),
      }))
  } catch (err) {
    console.error('[pillar-utils] getPillarArticles error:', err)
    return []
  }
}

/**
 * Pillar-aware version: pass the pillar PATH (e.g. /best-camera-phones-india)
 * and let the function look up keywords/brands from the registry.
 */
export async function getPillarArticlesByPath(
  pillarPath: string,
  limit = 12,
): Promise<{ pillar: PillarMeta | undefined; articles: PillarArticle[] }> {
  const pillar = getPillarByPath(pillarPath)
  if (!pillar) return { pillar: undefined, articles: [] }
  const articles = await getPillarArticles(pillar.keywords, [], limit, pillar.brand)
  return { pillar, articles }
}

/**
 * Build an ItemList JSON-LD schema for a pillar page.
 * Helps Google understand the page is a curated list, which boosts
 * rich-result eligibility.
 */
export function buildPillarItemListSchema(
  pillarPath: string,
  pillarTitle: string,
  articles: PillarArticle[],
  siteUrl = 'https://thetechbharat.com',
): object {
  return {
    '@context': 'https://schema.org',
    '@type':    'ItemList',
    name:       pillarTitle,
    url:        `${siteUrl}${pillarPath}`,
    numberOfItems: articles.length,
    itemListElement: articles.map((a, i) => ({
      '@type':   'ListItem',
      position:  i + 1,
      url:       `${siteUrl}/${a.slug}`,
      name:      a.title,
    })),
  }
}
