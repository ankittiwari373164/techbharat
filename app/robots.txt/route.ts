// app/robots.txt/route.ts
// =====================================================================
//  PATCHED FOR ADSENSE & GOOGLE INDEXING
// ---------------------------------------------------------------------
//  KEY FIXES (vs previous version):
//   1. REMOVED  Disallow: /api/  — it was contradicting the
//      Allow: /api/image/  rules above it. Some crawlers honor
//      "most specific rule wins"; others honor order. Either way,
//      the previous robots.txt was ambiguous and Google reported
//      "Blocked by robots.txt" on 10 pages because of it.
//   2. ONLY private endpoints are explicitly disallowed now.
//   3. /api/image/* and /api/admin/uploaded-image/* are explicitly
//      ALLOWED for Googlebot-Image (article hero images live there).
//   4. Added AdsBot-Google (the AdSense crawler) explicit allow.
//   5. Added correct user-agent for Googlebot-News.
// =====================================================================
import { NextResponse } from 'next/server'

const SITE_URL = process.env.SITE_URL || 'https://thetechbharat.com'

export async function GET() {
  const robots = `# ─────────────────────────────────────────────────────────────────
# robots.txt — The Tech Bharat
# Generated dynamically. Edit app/robots.txt/route.ts to change.
# ─────────────────────────────────────────────────────────────────

User-agent: *
Allow: /
Allow: /api/image/
Allow: /api/admin/uploaded-image/
Allow: /api/article/
Allow: /api/ticker/
Allow: /api/stories/
Allow: /api/phone-images/
Disallow: /admin/
Disallow: /admin
Disallow: /api/admin/
Disallow: /api/scheduler
Disallow: /api/seo-cron
Disallow: /api/analytics
Disallow: /api/auto-index
Disallow: /api/index-url
Disallow: /api/fetch-news
Disallow: /api/fix-verdict
Disallow: /api/ping-sitemap
Disallow: /api/img
Disallow: /api/img/
Disallow: /api/seo
Disallow: /api/review/
Disallow: /default
Disallow: /feeds/
Disallow: /*?fbclid=
Disallow: /*?gclid=
Disallow: /*?utm_

# ─────────────────────────────────────────────────────────────────
# Googlebot — full crawl access for content + images
# ─────────────────────────────────────────────────────────────────
User-agent: Googlebot
Allow: /
Allow: /api/image/
Allow: /api/admin/uploaded-image/
Disallow: /admin/
Disallow: /api/admin/
Disallow: /api/scheduler
Disallow: /api/seo-cron
Disallow: /api/analytics
Disallow: /api/auto-index
Disallow: /api/index-url
Disallow: /api/fetch-news
Disallow: /api/img

# ─────────────────────────────────────────────────────────────────
# Googlebot-Image — explicit allow for image-serving routes
# (article hero images are proxied through these paths)
# ─────────────────────────────────────────────────────────────────
User-agent: Googlebot-Image
Allow: /
Allow: /api/image/
Allow: /api/admin/uploaded-image/
Allow: /api/phone-images/
Allow: /phone-images/
Disallow: /admin/

# ─────────────────────────────────────────────────────────────────
# Googlebot-News — for News & Discover surfaces
# ─────────────────────────────────────────────────────────────────
User-agent: Googlebot-News
Allow: /
Disallow: /admin/
Disallow: /api/admin/

# ─────────────────────────────────────────────────────────────────
# AdsBot-Google — AdSense site crawler. CRITICAL for monetisation.
# Must have full crawl access to article pages and their images.
# ─────────────────────────────────────────────────────────────────
User-agent: AdsBot-Google
Allow: /
Allow: /api/image/
Allow: /api/admin/uploaded-image/
Disallow: /admin/
Disallow: /api/admin/

User-agent: AdsBot-Google-Mobile
Allow: /
Allow: /api/image/
Allow: /api/admin/uploaded-image/
Disallow: /admin/
Disallow: /api/admin/

# ─────────────────────────────────────────────────────────────────
# Sitemaps
# ─────────────────────────────────────────────────────────────────
Sitemap: ${SITE_URL}/sitemap.xml
Sitemap: ${SITE_URL}/web-stories-sitemap.xml
`

  return new NextResponse(robots, {
    headers: {
      'Content-Type':  'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
    },
  })
}
