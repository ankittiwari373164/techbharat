// app/robots.txt/route.ts
import { NextResponse } from 'next/server'

const SITE_URL = process.env.SITE_URL || 'https://thetechbharat.com'

export async function GET() {
  const robots = `User-agent: *
Allow: /
Allow: /api/image/
Allow: /api/article/
Allow: /api/ticker/
Disallow: /admin/
Disallow: /api/admin/
Disallow: /api/scheduler
Disallow: /api/seo-cron
Disallow: /api/fetch
Disallow: /private/

# Allow image proxy — critical for Google to index article images
# Allow article API — used for SSR content rendering
# Block only admin/internal APIs

Sitemap: ${SITE_URL}/sitemap.xml`

  return new NextResponse(robots, {
    headers: {
      'Content-Type':  'text/plain',
      'Cache-Control': 'public, max-age=86400',
    },
  })
}