// app/robots.txt/route.ts
import { NextResponse } from 'next/server'

const SITE_URL = process.env.SITE_URL || 'https://thetechbharat.com'

export async function GET() {
  const robots = `User-agent: *
Allow: /
Allow: /api/image/
Allow: /api/img
Allow: /api/article/
Allow: /api/ticker/
Allow: /api/admin/uploaded-image/
Disallow: /admin/
Disallow: /api/admin/
Disallow: /api/scheduler
Disallow: /api/seo-cron
Disallow: /api/fetch
Allow: /api/img
Disallow: /private/
Disallow: /article/
Disallow: /default
Disallow: /feeds/

# /api/image/ = Unsplash proxy — allow so Google can load article images
# /api/img    = Old Unsplash proxy — ALLOW so images load, but add noindex header in route
# /article/   = Old article URL format — block (canonical is /<slug>)
# /default    = Soft 404 page — block from indexing
# /feeds/     = Old RSS/Blogger feeds — block

Sitemap: ${SITE_URL}/sitemap.xml`

  return new NextResponse(robots, {
    headers: {
      'Content-Type':  'text/plain',
      'Cache-Control': 'public, max-age=86400',
    },
  })
}