/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'picsum.photos' },
      { protocol: 'https', hostname: 'source.unsplash.com' },
      { protocol: 'https', hostname: 'thetechbharat.com' },
    ],
  },
  async redirects() {
    return [
      // Fix: redirect old Blogger feed URLs showing in GSC as
      // "Duplicate without user-selected canonical" — leftover from Hostinger parked page.
      {
        source: '/feeds/:path*',
        destination: '/',
        permanent: true,
      },
      // Fix: redirect www to non-www to prevent duplicate content issues in GSC
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'www.thetechbharat.com' }],
        destination: 'https://thetechbharat.com/:path*',
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