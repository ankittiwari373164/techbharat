// middleware.ts
// =====================================================================
//  PATCHED FOR ADSENSE & GOOGLE INDEXING
// ---------------------------------------------------------------------
//  WHAT THIS MIDDLEWARE DOES (in order):
//   1. /article/<slug>  →  301 redirect to /<slug>      (canonical)
//   2. /<slug>          →  internal rewrite to /article/<slug>
//                          so the SSR article page renders, while
//                          the URL stays clean for SEO + sharing.
//   3. Inject  x-pathname  header so server components know the path.
//   4. Protect  /admin/*  and  /api/admin/*  routes.
//   5. Protect /api/scheduler + /api/seo-cron  with CRON_SECRET.
//   6. Fire-and-forget analytics ping for real human page views.
// ---------------------------------------------------------------------
//  KEY FIXES (vs previous version):
//   1. NEVER rewrite URLs that have more than one path segment
//      (e.g. /foo/amp must NOT be rewritten — its real route is
//       /app/[slug]/amp/page.tsx).
//   2. NEVER rewrite paths containing a dot (file extensions).
//   3. NEVER rewrite query-string-only paths.
//   4. Skip analytics for /api/*, /_next/*, /admin/*, /sitemap*,
//      /robots.txt, /ads.txt, and known files.
//   5. Tighter bot detection list including AdsBot-Google.
//   6. Made the early /article/<slug> redirect handle the case where
//      the slug itself is empty (was returning broken URL before).
// =====================================================================
import { NextRequest, NextResponse } from 'next/server'

// ---------------------------------------------------------------------
//  Top-level routes that must NOT be treated as article slugs
// ---------------------------------------------------------------------
const TOP_LEVEL_ROUTES = new Set([
  // Core nav
  'mobile-news', 'reviews', 'compare', 'web-stories',
  // Trust pages
  'about', 'contact', 'privacy-policy', 'disclaimer', 'terms',
  'editorial-policy', 'corrections-policy', 'author',
  // System
  'admin', 'api', '_next', 'sitemap.xml', 'sitemap-index.xml',
  'web-stories-sitemap.xml', 'robots.txt', 'ads.txt', 'favicon.ico',
  'favicon.png', 'logo.png', 'og-image.jpg', 'og-image.png',
  // Brand pillars
  'best-samsung-phones-india',
  'best-apple-iphone-india',
  'best-oneplus-phones-india',
  // Generic pillars
  'best-smartphones-india',
  'best-budget-phones-india',
  'best-camera-phones-india',
  'best-gaming-phones-india',
  'best-battery-backup-phones-india',
  'best-5g-phones-india',
  'best-flagship-phones-india',
  'best-phones-for-students-india',
  'smartphone-buying-guide-india',
  'phone-comparison-guide-india',
  'iphone-buying-guide-india',
  'android-battery-health-guide',
])

function isArticleSlug(pathname: string): boolean {
  const parts = pathname.split('/').filter(Boolean)
  if (parts.length !== 1) return false                        // must be /<slug> only
  const segment = parts[0]
  if (TOP_LEVEL_ROUTES.has(segment)) return false             // known page
  if (segment.includes('.')) return false                     // file extension
  if (segment.startsWith('_')) return false                   // _next, _vercel, etc.
  return /^[a-z0-9][a-z0-9-]{2,}$/.test(segment)              // slug shape
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // ─── 1. /article/<slug>  →  301 redirect to /<slug> ─────────────
  if (pathname.startsWith('/article/')) {
    const slug = pathname.replace('/article/', '').replace(/\/$/, '')
    if (slug && !slug.includes('/')) {
      const newUrl = new URL(`/${slug}`, req.url)
      newUrl.search = req.nextUrl.search
      return NextResponse.redirect(newUrl, 301)
    }
  }

  // ─── 2. /<slug>  →  internal rewrite to /article/<slug> ────────
  if (isArticleSlug(pathname)) {
    const url = req.nextUrl.clone()
    url.pathname = `/article${pathname}`
    return NextResponse.rewrite(url)
  }

  // ─── 3. Inject x-pathname header ───────────────────────────────
  const requestHeaders = new Headers(req.headers)
  requestHeaders.set('x-pathname', pathname)

  // ─── 4. Protect cron endpoints ─────────────────────────────────
  if (pathname === '/api/scheduler' || pathname === '/api/seo-cron') {
    const secret     = req.nextUrl.searchParams.get('secret')
    const authHeader = req.headers.get('authorization')?.replace('Bearer ', '')
    const cronSecret = process.env.CRON_SECRET
    if (cronSecret && secret !== cronSecret && authHeader !== cronSecret) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
  }

  // ─── 5. Protect admin routes ───────────────────────────────────
  const isAdminPage = pathname.startsWith('/admin') && !pathname.startsWith('/admin/login')
  const isAdminApi  = pathname.startsWith('/api/admin') && !pathname.startsWith('/api/admin/login')

  if (isAdminPage || isAdminApi) {
    const cookie = req.cookies.get('__tb_admin')?.value || ''
    if (!cookie.startsWith('TBOK:')) {
      if (isAdminApi) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      return NextResponse.redirect(new URL('/admin/login', req.url))
    }
  }

  // ─── 6. Analytics — fire-and-forget for real human page views ──
  const isPublicPage =
    !pathname.startsWith('/api') &&
    !pathname.startsWith('/_next') &&
    !pathname.startsWith('/admin') &&
    !pathname.startsWith('/sitemap') &&
    pathname !== '/robots.txt' &&
    pathname !== '/ads.txt' &&
    !pathname.includes('.')

  if (isPublicPage) {
    const ua   = req.headers.get('user-agent') || ''
    const host = req.headers.get('host') || ''
    const isBot = /UptimeRobot|bot|crawl|spider|slurp|Googlebot|AdsBot|Bingbot|YandexBot|DuckDuckBot|pingdom|GTmetrix|PageSpeed|HeadlessChrome|python-requests|axios|node-fetch|curl|wget/i.test(ua)
    const isPreview = host.includes('.vercel.app')

    if (!isBot && !isPreview) {
      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://thetechbharat.com'
      fetch(`${siteUrl}/api/analytics`, {
        method:  'POST',
        headers: {
          'Content-Type':    'application/json',
          'user-agent':      ua,
          'x-forwarded-for': req.headers.get('x-forwarded-for') || '',
          'referer':         req.headers.get('referer') || '',
        },
        body: JSON.stringify({ path: pathname, referrer: req.headers.get('referer') || '' }),
      }).catch(() => {})
    }
  }

  return NextResponse.next({ request: { headers: requestHeaders } })
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|logo\\.png|ads\\.txt|robots\\.txt).*)'],
}
