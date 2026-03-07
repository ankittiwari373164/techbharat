export const dynamic = 'force-dynamic'

const SITE_URL = process.env.SITE_URL || 'https://thetechbharat.com'

interface SitemapEntry {
  url: string
  priority: string
  changefreq: string
  lastmod: string
  image?: string
  title?: string
}

export async function GET() {
  const staticPages: SitemapEntry[] = [
    { url: '/',                   priority: '1.0', changefreq: 'hourly',  lastmod: '' },
    { url: '/mobile-news',        priority: '0.9', changefreq: 'hourly',  lastmod: '' },
    { url: '/reviews',            priority: '0.9', changefreq: 'daily',   lastmod: '' },
    { url: '/compare',            priority: '0.9', changefreq: 'daily',   lastmod: '' },
    { url: '/web-stories',        priority: '0.8', changefreq: 'daily',   lastmod: '' },
    { url: '/about',              priority: '0.6', changefreq: 'monthly', lastmod: '' },
    { url: '/contact',            priority: '0.6', changefreq: 'monthly', lastmod: '' },
    { url: '/privacy-policy',     priority: '0.4', changefreq: 'yearly',  lastmod: '' },
    { url: '/disclaimer',         priority: '0.4', changefreq: 'yearly',  lastmod: '' },
    { url: '/terms',              priority: '0.4', changefreq: 'yearly',  lastmod: '' },
    { url: '/editorial-policy',   priority: '0.5', changefreq: 'yearly',  lastmod: '' },
    { url: '/corrections-policy', priority: '0.5', changefreq: 'yearly',  lastmod: '' },
    { url: '/author',             priority: '0.6', changefreq: 'monthly', lastmod: '' },
  ]

  let articleEntries: SitemapEntry[] = []
  let storyEntries: SitemapEntry[] = []

  try {
    const { getAllArticlesAsync } = await import('@/lib/store')
    const articles = await getAllArticlesAsync()
    articleEntries = articles.map(a => ({
      url:        `/article/${a.slug}`,
      lastmod:    ((a as any).updatedDate || a.publishDate).split('T')[0],
      priority:   '0.8',
      changefreq: 'weekly',
      image:      (a as any).featuredImage || (a as any).imageUrl || '',
      title:      a.title,
    }))
  } catch { /* no articles yet */ }

  try {
    const { getPublishedStoriesAsync } = await import('@/lib/stories-store')
    const stories = await getPublishedStoriesAsync()
    storyEntries = stories.map(s => ({
      url:        `/web-stories/${s.slug}`,
      lastmod:    s.publishDate.split('T')[0],
      priority:   '0.9',
      changefreq: 'weekly',
      image:      s.coverImage || '',
      title:      s.title,
    }))
  } catch { /* no stories yet */ }

  const allEntries: SitemapEntry[] = [...staticPages, ...articleEntries, ...storyEntries]

  const urlTags = allEntries.map(entry => {
    const imgTag = entry.image
      ? `    <image:image>\n      <image:loc>${entry.image}</image:loc>\n      ${entry.title ? `<image:title>${entry.title.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')}</image:title>` : ''}\n    </image:image>`
      : ''
    return `  <url>
    <loc>${SITE_URL}${entry.url}</loc>
    ${entry.lastmod ? `<lastmod>${entry.lastmod}</lastmod>` : ''}
    <changefreq>${entry.changefreq}</changefreq>
    <priority>${entry.priority}</priority>
    ${imgTag}
  </url>`
  }).join('\n')

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${urlTags}
</urlset>`

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'no-store',
    },
  })
}