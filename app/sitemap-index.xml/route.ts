// app/sitemap-index.xml/route.ts
// =====================================================================
//  PATCHED FOR ADSENSE & GOOGLE INDEXING
// ---------------------------------------------------------------------
//  KEY FIX (vs previous version):
//    Previous file was a CARBON COPY of sitemap.xml (with the same
//    <urlset> body), which meant:
//      - Google saw the same URLs twice with two different sitemap
//        identities, wasting crawl budget.
//      - Search Console flagged it as duplicate sitemap content.
//
//    A sitemap-index is supposed to be a tiny <sitemapindex> document
//    that REFERENCES other sitemaps. Now it does exactly that.
// =====================================================================
export const dynamic = 'force-dynamic'

const SITE_URL = process.env.SITE_URL || 'https://thetechbharat.com'

export async function GET() {
  // Use the request day for sitemap lastmod (sitemaps update when their
  // content changes — for a news site, daily granularity is fine).
  const today = new Date().toISOString().split('T')[0]

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${SITE_URL}/sitemap.xml</loc>
    <lastmod>${today}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${SITE_URL}/web-stories-sitemap.xml</loc>
    <lastmod>${today}</lastmod>
  </sitemap>
</sitemapindex>`

  return new Response(xml, {
    headers: {
      'Content-Type':  'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=1800, stale-while-revalidate=3600',
    },
  })
}
