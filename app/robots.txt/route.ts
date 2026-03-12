// app/robots.txt/route.ts  (or wherever your robots route lives)
// Fixed: removed Crawl-delay (slows Google down), added /admin/ disallow
import { NextResponse } from 'next/server'

const SITE_URL = process.env.SITE_URL || 'https://thetechbharat.com'

export async function GET() {
  const robots = `User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/

Sitemap: ${SITE_URL}/sitemap.xml`

  return new NextResponse(robots, {
    headers: {
      'Content-Type':  'text/plain',
      'Cache-Control': 'public, max-age=86400',
    },
  })
}