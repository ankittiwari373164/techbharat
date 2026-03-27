// middleware.ts
// ─────────────────────────────────────────────────────────────────────────────
// 1. Injects x-pathname header so server components can read current path
// 2. Protects /admin/* and /api/admin/* routes (requires __tb_admin cookie)
// 3. Blocks schedulers from hitting /api/scheduler without ?secret=
// 4. Fires fire-and-forget analytics ping on every public page view (no bots)
// 5. Rewrites clean article URLs: /some-slug → /article/some-slug (internal)
//    Browser URL stays clean — no redirect, no flicker, no 404
// ─────────────────────────────────────────────────────────────────────────────
import { NextRequest, NextResponse } from 'next/server'

// Known top-level pages — these must NOT be treated as article slugs
const TOP_LEVEL_ROUTES = new Set([
  // Core nav pages
  'mobile-news', 'reviews', 'compare', 'web-stories',
  // Static pages
  'about', 'contact', 'privacy-policy', 'disclaimer', 'terms',
  'editorial-policy', 'corrections-policy', 'author',
  // System
  'admin', 'api', '_next', 'sitemap.xml', 'robots.txt',
  // Evergreen pillar pages
  'smartphone-buying-guide-india',
  'best-smartphones-india',
  'best-camera-phones-india',
  'best-battery-backup-phones-india',
  'android-battery-health-guide',
  'best-gaming-phones-india',
  'phone-comparison-guide-india',
  'best-phones-for-students-india',
  'best-phones-for-working-professionals',
  'iphone-buying-guide-india',
  'used-refurbished-phone-buying-guide-india',
  'guides',
])

function isArticleSlug(pathname: string): boolean {
  const parts = pathname.split('/').filter(Boolean)
  if (parts.length !== 1) return false          // must be /slug only, not /a/b
  const segment = parts[0]
  if (TOP_LEVEL_ROUTES.has(segment)) return false
  if (segment.includes('.')) return false        // skip files
  return /^[a-z0-9][a-z0-9-]{2,}$/.test(segment)
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // ── 5. Rewrite clean slug URLs → /article/[slug] internally ─────────────
  if (isArticleSlug(pathname)) {
    const url = req.nextUrl.clone()
    url.pathname = `/article${pathname}`
    return NextResponse.rewrite(url)
  }

  // ── 1. Inject pathname header ────────────────────────────────────────────
  const requestHeaders = new Headers(req.headers)
  requestHeaders.set('x-pathname', pathname)

  // ── 2. Protect scheduler/cron endpoints ─────────────────────────────────
  if (pathname === '/api/scheduler' || pathname === '/api/seo-cron') {
    const secret     = req.nextUrl.searchParams.get('secret')
    const authHeader = req.headers.get('authorization')?.replace('Bearer ', '')
    const cronSecret = process.env.CRON_SECRET
    if (cronSecret && secret !== cronSecret && authHeader !== cronSecret) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
  }

  // ── 3. Protect admin routes ──────────────────────────────────────────────
  const isAdminPage = pathname.startsWith('/admin') && !pathname.startsWith('/admin/login')
  const isAdminApi  = pathname.startsWith('/api/admin')
    && !pathname.startsWith('/api/admin/login')
    && !pathname.startsWith('/api/admin/uploaded-image') // public — serves images to all users

  if (isAdminPage || isAdminApi) {
    const cookie = req.cookies.get('__tb_admin')?.value || ''
    if (!cookie.startsWith('TBOK:')) {
      if (isAdminApi) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      return NextResponse.redirect(new URL('/admin/login', req.url))
    }
  }

  // ── 4. Analytics — fire-and-forget, never blocks the page ───────────────
  const isPublicPage =
    !pathname.startsWith('/api') &&
    !pathname.startsWith('/_next') &&
    !pathname.startsWith('/admin') &&
    !pathname.includes('.')

  if (isPublicPage) {
    const ua        = req.headers.get('user-agent') || ''
    const host      = req.headers.get('host') || ''
    const isBot     = /UptimeRobot|bot|crawl|spider|slurp|Googlebot|Bingbot|YandexBot|pingdom|GTmetrix|PageSpeed|HeadlessChrome|python-requests|axios|node-fetch/i.test(ua)
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
        body: JSON.stringify({
          path:     pathname,
          referrer: req.headers.get('referer') || '',
        }),
      }).catch(() => {})
    }
  }

  return NextResponse.next({ request: { headers: requestHeaders } })
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}