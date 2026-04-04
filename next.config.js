/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'picsum.photos' },
      { protocol: 'https', hostname: 'source.unsplash.com' },
      { protocol: 'https', hostname: 'thetechbharat.com' },
      { protocol: 'https', hostname: 'thetechbharat.com', pathname: '/api/admin/uploaded-image/**' },
    ],
  },
  async redirects() {
    return [
      // Fix: /index.html → / (301)
      {
        source: '/index.html',
        destination: '/',
        permanent: true,
      },
      // Fix: old Blogger feed URLs — redirect to home
      {
        source: '/feeds/:path*',
        destination: '/',
        permanent: true,
      },
      // Fix: www → non-www (prevents duplicate content)
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'www.thetechbharat.com' }],
        destination: 'https://thetechbharat.com/:path*',
        permanent: true,
      },
      // FIX: /article/[slug] → /[slug] (permanent 301)
      // This is the CANONICAL redirect — keeps GSC happy
      // Middleware rewrites /slug → /article/slug internally (no browser redirect)
      // But if Google ever hits /article/slug directly, we 301 it to /slug
      {
        source: '/article/:slug',
        destination: '/:slug',
        permanent: true,
      },
      // Fix: /default soft 404 page
      {
        source: '/default',
        destination: '/',
        permanent: true,
      },
    ]
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Robots-Tag', value: 'max-image-preview:large' },
        ],
      },
      // Prevent /api/img from being indexed — old proxy route
      {
        source: '/api/img',
        headers: [
          { key: 'X-Robots-Tag', value: 'noindex, nofollow' },
        ],
      },
      // Prevent API routes from being indexed
      {
        source: '/api/:path*',
        headers: [
          { key: 'X-Robots-Tag', value: 'noindex, nofollow' },
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