// lib/pillar-utils.ts
export interface PillarArticle {
  slug: string; title: string; summary: string; brand: string
  type: string; publishDate: string; featuredImage?: string
  readTime?: number; tags?: string[]
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

// Fetch articles filtered by keywords AND optionally by brand
export async function getPillarArticles(
  keywords: string[],
  excludeSlugs?: string[],
  limit = 15,
  brandFilter?: string   // e.g. 'Samsung' — only return articles of this brand
): Promise<PillarArticle[]> {
  try {
    const { getAllArticlesAsync } = await import('@/lib/store')
    const all = await getAllArticlesAsync() as any[]
    const kws = keywords.map(k => k.toLowerCase())

    return all
      .filter(a => a.slug && a.title)
      .filter(a => {
        // Filter out low-value content
        const t = (a.title || '').toLowerCase()
        return !['leaked','leak suggests','rumoured','prediction','concept render',
                 'cricket','bollywood','bitcoin'].some(b => t.includes(b))
      })
      .filter(a => {
        // Brand filter if specified
        if (!brandFilter) return true
        return (a.brand || '').toLowerCase() === brandFilter.toLowerCase()
      })
      .map(a => {
        const text = [a.title||'', a.summary||'', ...(a.tags||[]), a.brand||''].join(' ').toLowerCase()
        const score = kws.reduce((acc, kw) => {
          return acc +
            ((a.title||'').toLowerCase().includes(kw) ? 3 : 0) +
            ((a.tags||[]).some((t:string) => t.toLowerCase().includes(kw)) ? 2 : 0) +
            (text.includes(kw) ? 1 : 0)
        }, 0)
        return { ...a, _score: score }
      })
      .filter(a => a._score > 0)
      .filter(a => !excludeSlugs?.includes(a.slug))
      .sort((a, b) => b._score !== a._score
        ? b._score - a._score
        : new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime())
      .slice(0, limit)
      .map(a => ({
        slug: a.slug, title: a.title, summary: a.summary||'',
        brand: a.brand||'Mobile', type: a.type||'mobile-news',
        publishDate: a.publishDate,
        featuredImage: (a.featuredImage && !a.featuredImage.startsWith('/phone-images/')) ? a.featuredImage : '',
        readTime: a.readTime||5, tags: a.tags||[],
      }))
  } catch { return [] }
}