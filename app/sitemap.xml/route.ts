const SITE_URL = process.env.SITE_URL || 'https://techbharat.com'

export async function GET() {
  const staticPages = [
    { url: '/',                    priority: '1.0', changefreq: 'hourly',  lastmod: '' },
    { url: '/mobile-news',         priority: '0.9', changefreq: 'hourly',  lastmod: '' },
    { url: '/reviews',             priority: '0.9', changefreq: 'daily',   lastmod: '' },
    { url: '/compare',             priority: '0.9', changefreq: 'daily',   lastmod: '' },
    { url: '/web-stories',         priority: '0.8', changefreq: 'daily',   lastmod: '' },
    { url: '/about',               priority: '0.6', changefreq: 'monthly', lastmod: '' },
    { url: '/contact',             priority: '0.6', changefreq: 'monthly', lastmod: '' },
    { url: '/privacy-policy',      priority: '0.4', changefreq: 'yearly',  lastmod: '' },
    { url: '/disclaimer',          priority: '0.4', changefreq: 'yearly',  lastmod: '' },
    { url: '/terms',               priority: '0.4', changefreq: 'yearly',  lastmod: '' },
    { url: '/editorial-policy',    priority: '0.5', changefreq: 'yearly',  lastmod: '' },
    { url: '/corrections-policy',  priority: '0.5', changefreq: 'yearly',  lastmod: '' },
    { url: '/author',              priority: '0.6', changefreq: 'monthly', lastmod: '' },
  ]

  let articleEntries: { url: string; priority: string; changefreq: string; lastmod: string }[] = []
  try {
    const { getAllArticlesAsync } = await import('@/lib/store')
    const articles = await getAllArticlesAsync()
    articleEntries = articles.map(article => ({
      url:        `/article/${article.slug}`,
      lastmod:    (article.updatedDate || article.publishDate).split('T')[0],
      priority:   '0.8',
      changefreq: 'weekly',
    }))
  } catch { /* no articles yet */ }

  const allEntries = [...staticPages, ...articleEntries]

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allEntries.map(entry => `  <url>
    <loc>${SITE_URL}${entry.url}</loc>
    ${entry.lastmod ? `<lastmod>${entry.lastmod}</lastmod>` : ''}
    <changefreq>${entry.changefreq}</changefreq>
    <priority>${entry.priority}</priority>
  </url>`).join('\n')}
</urlset>`

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 's-maxage=3600, stale-while-revalidate',
    },
  })
}