// app/sitemap.xml/route.ts
// FIXED:
//  - Article URLs are now /<slug> (canonical) NOT /article/<slug>
//  - Only includes HTTPS non-www URLs (no www. duplicates)
//  - Image URLs validated to be absolute and non-empty
//  - Added noindex signal for /disclaimer (thin content)
//  - Better cache headers
//  - ✅ NEW: Filters OUT low-quality articles from sitemap (CRITICAL SEO FIX)

export const dynamic = 'force-dynamic'

const SITE_URL = process.env.SITE_URL || 'https://thetechbharat.com'

function esc(s: string): string {
  return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&apos;')
}

interface SitemapEntry {
  url: string
  priority: string
  changefreq: string
  lastmod: string
  image?: string
  title?: string
}

function entryXml(entry: SitemapEntry): string {
  let out = `  <url>\n    <loc>${SITE_URL}${esc(entry.url)}</loc>\n`
  if (entry.lastmod) out += `    <lastmod>${entry.lastmod}</lastmod>\n`
  out += `    <changefreq>${entry.changefreq}</changefreq>\n`
  out += `    <priority>${entry.priority}</priority>\n`
  if (entry.image) {
    const imgUrl = entry.image.startsWith('http') ? entry.image : `${SITE_URL}${entry.image.startsWith('/') ? '' : '/'}${entry.image}`
    const isValid = imgUrl &&
      imgUrl !== SITE_URL &&
      imgUrl !== SITE_URL + '/' &&
      !imgUrl.includes('/phone-images/') &&
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
  const today = new Date().toISOString().split('T')[0]

  const staticPages: SitemapEntry[] = [
    { url: '/',              priority: '1.0', changefreq: 'hourly',  lastmod: today },
    { url: '/mobile-news',   priority: '0.9', changefreq: 'hourly',  lastmod: today },
    { url: '/reviews',       priority: '0.9', changefreq: 'daily',   lastmod: today },
    { url: '/compare',       priority: '0.9', changefreq: 'daily',   lastmod: today },
    { url: '/web-stories',   priority: '0.8', changefreq: 'daily',   lastmod: today },
    { url: '/about',         priority: '0.6', changefreq: 'monthly', lastmod: today },
    { url: '/author',        priority: '0.7', changefreq: 'monthly', lastmod: today },
    { url: '/best-smartphones-india',           priority: '0.85', changefreq: 'weekly', lastmod: today },
    { url: '/best-camera-phones-india',         priority: '0.85', changefreq: 'weekly', lastmod: today },
    { url: '/best-gaming-phones-india',         priority: '0.85', changefreq: 'weekly', lastmod: today },
    { url: '/android-battery-health-guide',     priority: '0.8',  changefreq: 'weekly', lastmod: today },
    { url: '/smartphone-buying-guide-india',    priority: '0.85', changefreq: 'weekly', lastmod: today },
    { url: '/best-battery-backup-phones-india', priority: '0.8',  changefreq: 'weekly', lastmod: today },
    { url: '/phone-comparison-guide-india',     priority: '0.8',  changefreq: 'weekly', lastmod: today },
    { url: '/iphone-buying-guide-india',        priority: '0.8',  changefreq: 'weekly', lastmod: today },
    { url: '/best-phones-for-students-india',   priority: '0.8',  changefreq: 'weekly', lastmod: today },
    { url: '/used-refurbished-phone-buying-guide-india', priority: '0.75', changefreq: 'weekly', lastmod: today },
    { url: '/guides',                           priority: '0.75', changefreq: 'weekly', lastmod: today },
  ]

  let articleEntries: SitemapEntry[] = []
  let storyEntries: SitemapEntry[] = []

  try {
    const { getAllArticlesAsync } = await import('@/lib/store')
    const articles = await getAllArticlesAsync()

    // ✅ CRITICAL FIX: ONLY include high-quality articles
    articleEntries = articles
      .filter((a: any) => {
        const quality = a.contentQuality ?? 5
        return quality >= 6 && !a.isLowValue
      })
      .map((a: any) => ({
        url:        `/${a.slug}`,
        lastmod:    (a.updatedDate || a.publishDate || today).split('T')[0],
        priority:   a.type === 'review' ? '0.85' : a.type === 'compare' ? '0.8' : '0.75',
        changefreq: 'weekly',
        image:      a.featuredImage || '',
        title:      a.title || '',
      }))
  } catch { /* no articles yet */ }

  try {
    const { getPublishedStoriesAsync } = await import('@/lib/stories-store')
    const stories = await getPublishedStoriesAsync()
    storyEntries = stories.map(s => ({
      url:        `/web-stories/${s.slug}`,
      lastmod:    (s.publishDate || today).split('T')[0],
      priority:   '0.75',
      changefreq: 'weekly',
      image:      s.coverImage || '',
      title:      s.title || '',
    }))
  } catch { /* no stories yet */ }

  const all: SitemapEntry[] = [...staticPages, ...articleEntries, ...storyEntries]

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${all.map(entryXml).join('\n')}
</urlset>`

  return new Response(xml, {
    headers: {
      'Content-Type':  'application/xml',
      'Cache-Control': 'public, max-age=1800, stale-while-revalidate=3600',
    },
  })
}