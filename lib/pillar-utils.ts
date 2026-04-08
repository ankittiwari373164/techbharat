// lib/pillar-utils.ts — Enhanced with month-aware titles and fresh content fetching

export interface PillarArticle {
  slug: string; title: string; summary: string; brand: string
  type: string; publishDate: string; featuredImage?: string; readTime?: number; tags?: string[]
}

// Returns current month+year for dynamic titles
export function currentMonthYear(): { month: string; year: number; monthNum: number } {
  const now = new Date()
  const months = ['January','February','March','April','May','June',
                  'July','August','September','October','November','December']
  return { month: months[now.getMonth()], year: now.getFullYear(), monthNum: now.getMonth() }
}

export function formatPillarDate(dateStr: string): string {
  try {
    const d = new Date(dateStr)
    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
    return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`
  } catch { return '' }
}

// Score and fetch articles relevant to a pillar topic
export async function getPillarArticles(
  keywords: string[], excludeSlugs?: string[], limit = 15
): Promise<PillarArticle[]> {
  try {
    const { getAllArticlesAsync } = await import('@/lib/store')
    const all = await getAllArticlesAsync() as any[]
    const kws = keywords.map(k => k.toLowerCase())

    const scored = all
      .filter(a => a.slug && a.title)
      // Filter out low-value articles — leaks, predictions, off-topic
      .filter(a => {
        const t = (a.title || '').toLowerCase()
        const badPatterns = ['leaked','leak suggests','rumoured','prediction','concept render',
                             'cricket','bollywood','bitcoin','murder','assault']
        return !badPatterns.some(b => t.includes(b))
      })
      .map(a => {
        const text = [a.title||'', a.summary||'', ...(a.tags||[]), a.brand||''].join(' ').toLowerCase()
        const score = kws.reduce((acc, kw) => {
          const titleHit = (a.title||'').toLowerCase().includes(kw) ? 3 : 0
          const tagHit   = (a.tags||[]).some((t: string) => t.toLowerCase().includes(kw)) ? 2 : 0
          const textHit  = text.includes(kw) ? 1 : 0
          return acc + titleHit + tagHit + textHit
        }, 0)
        return { ...a, _score: score }
      })
      .filter(a => a._score > 0)
      .filter(a => !excludeSlugs?.includes(a.slug))
      .sort((a, b) => b._score !== a._score
        ? b._score - a._score
        : new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime()
      )
      .slice(0, limit)

    return scored.map(a => ({
      slug: a.slug, title: a.title, summary: a.summary||'',
      brand: a.brand||'Mobile', type: a.type||'mobile-news',
      publishDate: a.publishDate, featuredImage: a.featuredImage||a.images?.[0]||'',
      readTime: a.readTime||5, tags: a.tags||[],
    }))
  } catch { return [] }
}

// Reusable article grid renderer — returns JSX-compatible data
export const PILLAR_KEYWORDS = {
  'best-camera-phones':    ['camera','photo','photography','selfie','portrait','night mode','low light','megapixel'],
  'best-smartphones':      ['best','review','india','price','worth buying','recommended','top pick'],
  'best-battery-phones':   ['battery','charging','fast charge','mAh','battery life','endurance'],
  'best-gaming-phones':    ['gaming','BGMI','fps','refresh rate','performance','processor','cooling'],
  'smartphone-buying':     ['buying guide','how to choose','worth it','should you buy','india price'],
  'best-5g-phones':        ['5G','5g phone','5g network','n78','jio 5g','airtel 5g'],
  'best-budget-phones':    ['budget','under 15000','under 20000','affordable','value for money'],
  'best-flagship-phones':  ['flagship','premium','ultra','pro max','₹70000','₹1 lakh'],
  'best-phones-students':  ['student','college','budget','performance','lightweight','battery'],
  'comparison-hub':        ['vs','compare','versus','difference','better','head to head'],
}