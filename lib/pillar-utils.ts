// lib/pillar-utils.ts
// Shared utility for pillar pages — fetches and filters articles from Redis

import { getAllArticlesAsync } from '@/lib/store'

export interface PillarArticle {
  slug: string
  title: string
  summary: string
  brand: string
  type: string
  publishDate: string
  featuredImage?: string
  readTime?: number
  tags?: string[]
}

// Fetch all articles and filter by relevance to a pillar topic
export async function getPillarArticles(
  keywords: string[],        // words to match in title/tags/summary
  excludeSlugs?: string[],   // slugs to exclude (e.g. current page)
  limit = 12
): Promise<PillarArticle[]> {
  try {
    const all = await getAllArticlesAsync() as any[]
    const kws = keywords.map(k => k.toLowerCase())

    const scored = all
      .filter(a => a.slug && a.title)
      .map(a => {
        const text = [
          a.title || '',
          a.summary || '',
          ...(a.tags || []),
          a.brand || '',
          a.type || '',
        ].join(' ').toLowerCase()

        const score = kws.reduce((acc, kw) => {
          // Title match = 3 points, tag match = 2 points, summary match = 1 point
          const titleMatch = (a.title || '').toLowerCase().includes(kw) ? 3 : 0
          const tagMatch   = (a.tags || []).some((t: string) => t.toLowerCase().includes(kw)) ? 2 : 0
          const textMatch  = text.includes(kw) ? 1 : 0
          return acc + titleMatch + tagMatch + textMatch
        }, 0)

        return { ...a, _score: score }
      })
      .filter(a => a._score > 0)
      .filter(a => !excludeSlugs?.includes(a.slug))
      .sort((a, b) => {
        // Sort by score first, then by date
        if (b._score !== a._score) return b._score - a._score
        return new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime()
      })
      .slice(0, limit)

    return scored.map(a => ({
      slug:         a.slug,
      title:        a.title,
      summary:      a.summary || '',
      brand:        a.brand || 'Mobile',
      type:         a.type || 'mobile-news',
      publishDate:  a.publishDate,
      featuredImage: a.featuredImage || a.images?.[0] || '',
      readTime:     a.readTime || 5,
      tags:         a.tags || [],
    }))
  } catch (e) {
    console.error('[getPillarArticles] error:', e)
    return []
  }
}

// Format date for display
export function formatPillarDate(dateStr: string): string {
  try {
    const d = new Date(dateStr)
    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
    return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`
  } catch { return '' }
}

// Pillar page topic keywords config
export const PILLAR_KEYWORDS = {
  'smartphone-buying-guide': ['buying guide', 'how to choose', 'best phone', 'worth buying', 'should you buy', 'india price', 'which phone'],
  'best-smartphones':        ['best', 'top', 'recommended', 'worth it', 'india', 'price', 'value'],
  'best-camera-phones':      ['camera', 'photo', 'photography', 'selfie', 'portrait', 'night mode', 'low light', 'lens', 'megapixel'],
  'battery-health':          ['battery', 'charging', 'fast charge', 'mAh', 'battery life', 'power', 'endurance'],
  'best-gaming-phones':      ['gaming', 'BGMI', 'game', 'fps', 'refresh rate', 'performance', 'snapdragon', 'processor', 'cooling'],
  'phone-comparison':        ['vs', 'compare', 'comparison', 'versus', 'better', 'difference'],
  'iphone-buying-guide':     ['iPhone', 'Apple', 'iOS', 'iphone 16', 'iphone 15', 'apple india'],
  'best-budget-phones':      ['budget', 'affordable', 'under ₹', '10000', '15000', '20000', 'cheap', 'value'],
}