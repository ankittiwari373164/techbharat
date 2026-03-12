// app/sitemap.xml/route.ts
// Fixed: proper lastmod on all pages, removed thin policy pages, better cache header
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
    out += `    <image:image>\n      <image:loc>${esc(entry.image)}</image:loc>\n`
    if (entry.title) out += `      <image:title>${esc(entry.title)}</image:title>\n`
    out += `    </image:image>\n`
  }
  out += `  </url>`
  return out
}

export async function GET() {
  const today = new Date().toISOString().split('T')[0]

  // Only include pages with real content — policy pages excluded (thin content, waste crawl budget)
  const staticPages: SitemapEntry[] = [
    { url: '/',              priority: '1.0', changefreq: 'hourly',  lastmod: today },
    { url: '/mobile-news',   priority: '0.9', changefreq: 'hourly',  lastmod: today },
    { url: '/reviews',       priority: '0.9', changefreq: 'daily',   lastmod: today },
    { url: '/compare',       priority: '0.9', changefreq: 'daily',   lastmod: today },
    { url: '/web-stories',   priority: '0.8', changefreq: 'daily',   lastmod: today },
    { url: '/about',         priority: '0.6', changefreq: 'monthly', lastmod: today },
    { url: '/author',        priority: '0.6', changefreq: 'monthly', lastmod: today },
  ]

  let articleEntries: SitemapEntry[] = []
  let storyEntries: SitemapEntry[] = []

  try {
    const { getAllArticlesAsync } = await import('@/lib/store')
    const articles = await getAllArticlesAsync()
    articleEntries = articles.map(a => ({
      url:        `/article/${a.slug}`,
      lastmod:    ((a as { updatedDate?: string }).updatedDate || a.publishDate || today).split('T')[0],
      priority:   a.type === 'review' ? '0.85' : '0.8',
      changefreq: 'weekly',
      image:      (a as { featuredImage?: string }).featuredImage || '',
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
      'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
    },
  })
}