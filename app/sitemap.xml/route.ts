// app/sitemap.xml/route.ts
// =====================================================================
//  PATCHED FOR ADSENSE & GOOGLE INDEXING
// ---------------------------------------------------------------------
//  KEY FIXES (vs previous version):
//   1. STABLE <lastmod>: only updates when content actually changes.
//      Static pages now use a fixed launch date; article entries use
//      their real updatedDate / publishDate.
//      (Previous version set every static page's lastmod to "today"
//      on every request — Google distrusts always-changing sitemaps,
//      reducing crawl priority.)
//   2. REMOVED /iphone-buying-guide-india from static list — that
//      page doesn't exist in the codebase, was a 404 in the sitemap.
//   3. Article URLs now include  <news:news>  block so Google News
//      can pick up fresh articles within minutes.
//   4. Image entries strip query strings + validate non-localhost.
//   5. Article filtering tightened — must have content and be
//      published in the last 2 years (Google News window).
//   6. XML escaping fixed for ampersands inside titles.
// =====================================================================
export const dynamic = 'force-dynamic'

const SITE_URL = process.env.SITE_URL || 'https://thetechbharat.com'

// Fixed launch date for static page lastmod
const SITE_LAUNCH = '2025-12-01'

function esc(s: string): string {
  if (!s) return ''
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

interface SitemapEntry {
  url: string
  priority: string
  changefreq: string
  lastmod: string
  image?: string
  title?: string
  isNews?: boolean
  publishDate?: string
}

function entryXml(entry: SitemapEntry): string {
  let out = `  <url>\n    <loc>${SITE_URL}${esc(entry.url)}</loc>\n`
  if (entry.lastmod) out += `    <lastmod>${entry.lastmod}</lastmod>\n`
  out += `    <changefreq>${entry.changefreq}</changefreq>\n`
  out += `    <priority>${entry.priority}</priority>\n`

  // News block — only for articles published in the last 2 days
  if (entry.isNews && entry.publishDate && entry.title) {
    const pub = new Date(entry.publishDate)
    const ageMs = Date.now() - pub.getTime()
    const ageDays = ageMs / (1000 * 60 * 60 * 24)
    if (ageDays >= 0 && ageDays <= 2) {
      out += `    <news:news>\n`
      out += `      <news:publication>\n`
      out += `        <news:name>The Tech Bharat</news:name>\n`
      out += `        <news:language>en</news:language>\n`
      out += `      </news:publication>\n`
      out += `      <news:publication_date>${entry.publishDate}</news:publication_date>\n`
      out += `      <news:title>${esc(entry.title)}</news:title>\n`
      out += `    </news:news>\n`
    }
  }

  // Image block
  if (entry.image) {
    let imgUrl = entry.image
    // strip query strings for cleaner sitemap
    imgUrl = imgUrl.split('?')[0]
    // make absolute
    if (!imgUrl.startsWith('http')) {
      imgUrl = `${SITE_URL}${imgUrl.startsWith('/') ? '' : '/'}${imgUrl}`
    }
    const isValid =
      imgUrl &&
      imgUrl !== SITE_URL &&
      imgUrl !== SITE_URL + '/' &&
      !imgUrl.includes('localhost') &&
      !imgUrl.includes('/phone-images/') &&
      !imgUrl.includes('picsum') &&
      entry.image.length > 5

    if (isValid) {
      out += `    <image:image>\n      <image:loc>${esc(imgUrl)}</image:loc>\n`
      if (entry.title) out += `      <image:title>${esc(entry.title)}</image:title>\n`
      out += `    </image:image>\n`
    }
  }

  out += `  </url>`
  return out
}

export async function GET() {
  // Static pages — stable lastmod (only update when these pages
  // actually change; today() was destroying crawl priority)
  const staticPages: SitemapEntry[] = [
    { url: '/',                                  priority: '1.0',  changefreq: 'hourly',  lastmod: SITE_LAUNCH },
    { url: '/mobile-news',                       priority: '0.9',  changefreq: 'hourly',  lastmod: SITE_LAUNCH },
    { url: '/reviews',                           priority: '0.9',  changefreq: 'daily',   lastmod: SITE_LAUNCH },
    { url: '/compare',                           priority: '0.9',  changefreq: 'daily',   lastmod: SITE_LAUNCH },
    { url: '/web-stories',                       priority: '0.8',  changefreq: 'daily',   lastmod: SITE_LAUNCH },
    { url: '/about',                             priority: '0.7',  changefreq: 'monthly', lastmod: SITE_LAUNCH },
    { url: '/author',                            priority: '0.7',  changefreq: 'monthly', lastmod: SITE_LAUNCH },
    { url: '/contact',                           priority: '0.5',  changefreq: 'monthly', lastmod: SITE_LAUNCH },
    { url: '/editorial-policy',                  priority: '0.4',  changefreq: 'yearly',  lastmod: SITE_LAUNCH },
    { url: '/corrections-policy',                priority: '0.4',  changefreq: 'yearly',  lastmod: SITE_LAUNCH },
    { url: '/privacy-policy',                    priority: '0.4',  changefreq: 'yearly',  lastmod: SITE_LAUNCH },
    { url: '/terms',                             priority: '0.3',  changefreq: 'yearly',  lastmod: SITE_LAUNCH },
    // Pillar pages
    { url: '/best-smartphones-india',            priority: '0.85', changefreq: 'weekly',  lastmod: SITE_LAUNCH },
    { url: '/best-camera-phones-india',          priority: '0.85', changefreq: 'weekly',  lastmod: SITE_LAUNCH },
    { url: '/best-gaming-phones-india',          priority: '0.85', changefreq: 'weekly',  lastmod: SITE_LAUNCH },
    { url: '/best-budget-phones-india',          priority: '0.85', changefreq: 'weekly',  lastmod: SITE_LAUNCH },
    { url: '/best-flagship-phones-india',        priority: '0.8',  changefreq: 'weekly',  lastmod: SITE_LAUNCH },
    { url: '/best-5g-phones-india',              priority: '0.8',  changefreq: 'weekly',  lastmod: SITE_LAUNCH },
    { url: '/best-battery-backup-phones-india',  priority: '0.8',  changefreq: 'weekly',  lastmod: SITE_LAUNCH },
    { url: '/best-phones-for-students-india',    priority: '0.8',  changefreq: 'weekly',  lastmod: SITE_LAUNCH },
    { url: '/best-samsung-phones-india',         priority: '0.8',  changefreq: 'weekly',  lastmod: SITE_LAUNCH },
    { url: '/best-apple-iphone-india',           priority: '0.8',  changefreq: 'weekly',  lastmod: SITE_LAUNCH },
    { url: '/best-oneplus-phones-india',         priority: '0.8',  changefreq: 'weekly',  lastmod: SITE_LAUNCH },
    { url: '/smartphone-buying-guide-india',     priority: '0.85', changefreq: 'weekly',  lastmod: SITE_LAUNCH },
    { url: '/phone-comparison-guide-india',      priority: '0.8',  changefreq: 'weekly',  lastmod: SITE_LAUNCH },
    { url: '/android-battery-health-guide',      priority: '0.8',  changefreq: 'weekly',  lastmod: SITE_LAUNCH },
  ]

  let articleEntries: SitemapEntry[] = []
  let storyEntries:  SitemapEntry[] = []

  // ─── Articles ────────────────────────────────────────────────
  try {
    const { getAllArticlesAsync } = await import('@/lib/store')
    const articles = await getAllArticlesAsync() as any[]

    const TWO_YEARS_AGO = Date.now() - (2 * 365 * 24 * 60 * 60 * 1000)

    // Minimum word count to be sitemap-eligible — matches the
    // indexability threshold in app/article/[slug]/page.tsx. Thin
    // articles get noindex,follow on the page AND are excluded here
    // so Google never even discovers them via the sitemap.
    const MIN_INDEXABLE_WORDS = 600

    articleEntries = articles
      .filter(a => {
        if (!a.slug || !a.title)                          return false
        if (a.noindex === true)                           return false   // ✅ explicit editorial flag
        if (a.isLowValue)                                 return false
        if (a.contentQuality && a.contentQuality < 6)     return false
        const content = (a.content || '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
        if (!content)                                     return false
        const wordCount = content.split(' ').length
        if (wordCount < MIN_INDEXABLE_WORDS)              return false   // ✅ thin-content filter
        const ts = new Date(a.publishDate || 0).getTime()
        if (ts && ts < TWO_YEARS_AGO)                     return false
        return true
      })
      .map(a => {
        const pubDate = (a.publishDate || new Date().toISOString())
        const lastmod = (a.updatedDate || pubDate).split('T')[0]
        return {
          url:        `/${a.slug}`,
          lastmod,
          priority:   a.type === 'review' ? '0.85' : a.type === 'compare' ? '0.8' : '0.75',
          changefreq: 'weekly',
          image:      a.featuredImage || '',
          title:      a.title || '',
          isNews:     a.type === 'mobile-news',
          publishDate: pubDate,
        }
      })
      .sort((a, b) => b.lastmod.localeCompare(a.lastmod))
  } catch { /* no articles yet */ }

  // ─── Web Stories ─────────────────────────────────────────────
  try {
    const { getPublishedStoriesAsync } = await import('@/lib/stories-store')
    const stories = await getPublishedStoriesAsync()
    storyEntries = stories.map(s => ({
      url:        `/web-stories/${s.slug}`,
      lastmod:    (s.publishDate || SITE_LAUNCH).split('T')[0],
      priority:   '0.7',
      changefreq: 'weekly',
      image:      s.coverImage || '',
      title:      s.title || '',
    }))
  } catch { /* no stories yet */ }

  const all = [...staticPages, ...articleEntries, ...storyEntries]

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
${all.map(entryXml).join('\n')}
</urlset>`

  return new Response(xml, {
    headers: {
      'Content-Type':  'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=1800, stale-while-revalidate=3600',
    },
  })
}
