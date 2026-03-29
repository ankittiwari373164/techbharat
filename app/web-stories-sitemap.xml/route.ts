// app/web-stories-sitemap.xml/route.ts
// Dedicated sitemap for Web Stories — required for Google Discover story carousel
export const dynamic = 'force-dynamic'

const SITE_URL = process.env.SITE_URL || 'https://thetechbharat.com'

function esc(s: string) {
  return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;')
}

export async function GET() {
  const today = new Date().toISOString().split('T')[0]
  let stories: any[] = []

  try {
    const { getPublishedStoriesAsync } = await import('@/lib/stories-store')
    stories = await getPublishedStoriesAsync()
  } catch {}

  const entries = stories.map(s => {
    const imgUrl = s.coverImage?.startsWith('http') ? s.coverImage : s.coverImage ? `${SITE_URL}${s.coverImage}` : ''
    return `  <url>
    <loc>${SITE_URL}/web-stories/${esc(s.slug)}</loc>
    <lastmod>${(s.publishDate||today).split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>${imgUrl ? `
    <image:image>
      <image:loc>${esc(imgUrl)}</image:loc>
      <image:title>${esc(s.title||'')}</image:title>
    </image:image>` : ''}
  </url>`
  }).join('\n')

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${entries}
</urlset>`

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600',
    },
  })
}