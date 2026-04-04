// app/robots.txt/route.ts
// FIXED: Corrected allow/disallow rules to stop blocking crawlable image proxy URLs
// and properly disallow only what should be blocked

import { NextResponse } from 'next/server'

const SITE_URL = process.env.SITE_URL || 'https://thetechbharat.com'

export async function GET() {
  const robots = `User-agent: *
Allow: /
Allow: /api/image/
Allow: /api/admin/uploaded-image/

Disallow: /admin/
Disallow: /api/admin/
Disallow: /api/scheduler
Disallow: /api/seo-cron
Disallow: /api/fetch-news
Disallow: /api/analytics
Disallow: /api/review/
Disallow: /api/img
Disallow: /api/ticker
Disallow: /api/phone-images
Disallow: /article/
Disallow: /default
Disallow: /feeds/
Disallow: /private/

# Notes:
# /article/ → canonical is /<slug> — disallow old prefix to prevent duplicate indexing
# /api/img  → old Unsplash proxy, superseded by /api/image/ — disallow to save crawl budget
# /api/image/ → ALLOWED so Google can load article images for rich results
# /feeds/ → old Blogger RSS feeds — blocked to prevent duplicate content
# /default → soft 404 page — blocked
# /admin/ → blocked entirely

Sitemap: ${SITE_URL}/sitemap.xml
Sitemap: ${SITE_URL}/web-stories-sitemap.xml
Sitemap: ${SITE_URL}/sitemap-index.xml`

  return new NextResponse(robots, {
    headers: {
      'Content-Type':  'text/plain',
      'Cache-Control': 'public, max-age=86400',
    },
  })
}