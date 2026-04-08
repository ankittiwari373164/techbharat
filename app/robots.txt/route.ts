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
Allow: /api/stories/
Disallow: /admin/
Disallow: /api/admin/
Disallow: /api/scheduler
Disallow: /api/seo-cron
Disallow: /api/fetch
Disallow: /api/analytics
Disallow: /article/
Disallow: /default
Disallow: /feeds/

User-agent: Googlebot
Allow: /api/image/
Allow: /api/img

Sitemap: ${SITE_URL}/sitemap.xml
Sitemap: ${SITE_URL}/web-stories-sitemap.xml`

  return new NextResponse(robots, {
    headers: {
      'Content-Type':  'text/plain',
      'Cache-Control': 'public, max-age=3600',
    },
  })
}