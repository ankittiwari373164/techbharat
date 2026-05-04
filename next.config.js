/** @type {import('next').NextConfig} */
// =====================================================================
//  next.config.js  —  PATCHED FOR ADSENSE & GOOGLE INDEXING
// ---------------------------------------------------------------------
//  KEY FIXES (vs previous version):
//   1. REMOVED blanket  X-Robots-Tag: noindex  on  /api/:path*
//      (it was killing image discoverability for /api/image/*  and
//       /api/admin/uploaded-image/* — both of which serve real article
//       images that AdSense and Google Images need to crawl).
//   2. ONLY private/admin/cron API routes are noindexed now.
//   3. Public image-serving APIs explicitly get  index, follow.
//   4. Added cache-control on  /ads.txt  so AdSense always sees it.
//   5. Added  /sitemap.xml ,  /robots.txt  cache headers.
// =====================================================================

const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'picsum.photos' },
      { protocol: 'https', hostname: 'source.unsplash.com' },
      { protocol: 'https', hostname: 'thetechbharat.com' },
      { protocol: 'https', hostname: 'www.thetechbharat.com' },
    ],
  },

  async redirects() {
    return [
      // Fix: /index.html → / (301)
      { source: '/index.html', destination: '/', permanent: true },

      // Fix: old Blogger feed URLs → home
      { source: '/feeds/:path*', destination: '/', permanent: true },

      // Fix: www → non-www (canonical host)
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'www.thetechbharat.com' }],
        destination: 'https://thetechbharat.com/:path*',
        permanent: true,
      },

      // Fix: /article/[slug] → /[slug]   (canonical URL is the clean one)
      {
        source: '/article/:slug',
        destination: '/:slug',
        permanent: true,
      },

      // Fix: /default soft 404
      { source: '/default', destination: '/', permanent: true },
    ]
  },

  async headers() {
    return [
      // -----------------------------------------------------------
      //  Global default for ALL pages — allow indexing, big images
      // -----------------------------------------------------------
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Robots-Tag', value: 'index, follow, max-image-preview:large' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        ],
      },

      // -----------------------------------------------------------
      //  ads.txt  —  let AdSense crawl this aggressively
      // -----------------------------------------------------------
      {
        source: '/ads.txt',
        headers: [
          { key: 'Content-Type', value: 'text/plain; charset=utf-8' },
          { key: 'Cache-Control', value: 'public, max-age=3600, must-revalidate' },
          { key: 'X-Robots-Tag', value: 'noindex' }, // file is for adsense, not for search
        ],
      },

      // -----------------------------------------------------------
      //  PUBLIC image-serving APIs  →  MUST be indexable
      //  (these are the actual article hero images Google Images
      //   and AdSense rely on to understand page topic / quality)
      // -----------------------------------------------------------
      {
        source: '/api/image/:path*',
        headers: [
          { key: 'X-Robots-Tag', value: 'index, follow, max-image-preview:large' },
          { key: 'Cache-Control', value: 'public, max-age=86400, immutable' },
        ],
      },
      {
        source: '/api/admin/uploaded-image/:path*',
        headers: [
          { key: 'X-Robots-Tag', value: 'index, follow, max-image-preview:large' },
          { key: 'Cache-Control', value: 'public, max-age=86400, immutable' },
        ],
      },

      // -----------------------------------------------------------
      //  PRIVATE / admin / cron / internal APIs  →  noindex
      //  (specific paths only — never blanket /api/*)
      // -----------------------------------------------------------
      {
        source: '/api/admin/:path*',
        headers: [
          { key: 'X-Robots-Tag', value: 'noindex, nofollow' },
          { key: 'Cache-Control', value: 'no-store' },
        ],
      },
      {
        source: '/api/scheduler',
        headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }],
      },
      {
        source: '/api/seo-cron',
        headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }],
      },
      {
        source: '/api/analytics',
        headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }],
      },
      {
        source: '/api/auto-index',
        headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }],
      },
      {
        source: '/api/index-url',
        headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }],
      },
      {
        source: '/api/fetch-news',
        headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }],
      },
      {
        source: '/api/fix-verdict',
        headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }],
      },
      {
        source: '/api/img',
        headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }],
      },
      {
        source: '/api/img/:path*',
        headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }],
      },
      {
        source: '/api/ping-sitemap',
        headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }],
      },

      // -----------------------------------------------------------
      //  /admin   →   noindex (UI for admins, never for Google)
      // -----------------------------------------------------------
      {
        source: '/admin/:path*',
        headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }],
      },

      // -----------------------------------------------------------
      //  sitemap.xml + robots.txt  caches
      // -----------------------------------------------------------
      {
        source: '/sitemap.xml',
        headers: [
          { key: 'Content-Type', value: 'application/xml; charset=utf-8' },
          { key: 'Cache-Control', value: 'public, max-age=1800, stale-while-revalidate=3600' },
        ],
      },
      {
        source: '/sitemap-index.xml',
        headers: [
          { key: 'Content-Type', value: 'application/xml; charset=utf-8' },
          { key: 'Cache-Control', value: 'public, max-age=1800, stale-while-revalidate=3600' },
        ],
      },
      {
        source: '/web-stories-sitemap.xml',
        headers: [
          { key: 'Content-Type', value: 'application/xml; charset=utf-8' },
          { key: 'Cache-Control', value: 'public, max-age=1800, stale-while-revalidate=3600' },
        ],
      },
      {
        source: '/robots.txt',
        headers: [
          { key: 'Content-Type', value: 'text/plain; charset=utf-8' },
          { key: 'Cache-Control', value: 'public, max-age=3600' },
        ],
      },
    ]
  },

  env: {
    ANTHROPIC_API_KEY:    process.env.ANTHROPIC_API_KEY,
    UNSPLASH_ACCESS_KEY:  process.env.UNSPLASH_ACCESS_KEY,
    SITE_NAME:            'The Tech Bharat',
    SITE_URL:             process.env.SITE_URL || 'https://thetechbharat.com',
    ADMIN_PASSWORD:       process.env.ADMIN_PASSWORD  || 'techbharat2024',
    SESSION_SECRET:       process.env.SESSION_SECRET  || 'tb-session-secret-change-this',
    CRON_SECRET:          process.env.CRON_SECRET     || '',
  },
}

module.exports = nextConfig
