import { NextResponse } from 'next/server'

const SITE_URL = process.env.SITE_URL || 'https://techbharat.com'

export async function GET() {
  const robots = `User-agent: *
Allow: /

User-agent: Googlebot
Allow: /
Crawl-delay: 1

User-agent: Googlebot-Image
Allow: /

# Disallow admin/API routes from indexing
Disallow: /api/
Disallow: /data/

Sitemap: ${SITE_URL}/sitemap.xml`

  return new NextResponse(robots, {
    headers: { 'Content-Type': 'text/plain' },
  })
}
