import { getAllArticles } from '@/lib/store'

const SITE_URL = process.env.SITE_URL || 'https://techbharat.com'

export async function GET() {
  const articles = getAllArticles()

  const staticPages = [
    { url: '/', priority: '1.0', changefreq: 'hourly' },
    { url: '/mobile-news', priority: '0.9', changefreq: 'hourly' },
    { url: '/reviews', priority: '0.9', changefreq: 'daily' },
    { url: '/compare', priority: '0.9', changefreq: 'daily' },
    { url: '/web-stories', priority: '0.8', changefreq: 'daily' },
    { url: '/about', priority: '0.6', changefreq: 'monthly' },
    { url: '/contact', priority: '0.6', changefreq: 'monthly' },
    { url: '/privacy-policy', priority: '0.4', changefreq: 'yearly' },
    { url: '/disclaimer', priority: '0.4', changefreq: 'yearly' },
    { url: '/terms', priority: '0.4', changefreq: 'yearly' },
    { url: '/editorial-policy', priority: '0.5', changefreq: 'yearly' },
    { url: '/corrections-policy', priority: '0.5', changefreq: 'yearly' },
    { url: '/author', priority: '0.6', changefreq: 'monthly' },
  ]

  const articleEntries = articles.map(article => ({
    url: `/article/${article.slug}`,
    lastmod: (article.updatedDate || article.publishDate).split('T')[0],
    priority: '0.8',
    changefreq: 'weekly',
  }))

  const allEntries = [...staticPages, ...articleEntries]

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
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
