import { NextRequest, NextResponse } from 'next/server'

const COOKIE_NAME = '__tb_admin'

function isValidToken(token: string): boolean {
  try {
    const decoded = decodeURIComponent(token)
    if (!decoded.startsWith('TBOK:')) return false
    const exp = parseInt(decoded.slice(5), 10)
    return !isNaN(exp) && Date.now() < exp
  } catch { return false }
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('x-pathname', pathname)

  // Always public
  const isPublic =
    pathname.startsWith('/admin/login') ||
    pathname === '/api/admin/login'     ||
    pathname === '/api/admin/logout'    ||
    pathname === '/api/admin/debug'

  if (isPublic) {
    return NextResponse.next({ request: { headers: requestHeaders } })
  }

  if (pathname.startsWith('/admin')) {
    const token = request.cookies.get(COOKIE_NAME)?.value
    if (!token || !isValidToken(token)) {
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }
  }

  if (pathname.startsWith('/api/admin/')) {
    const token = request.cookies.get(COOKIE_NAME)?.value
    if (!token || !isValidToken(token)) {
      return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
    }
  }

  if (pathname.startsWith('/api/scheduler') || pathname.startsWith('/api/seo-cron')) {
    const secret = process.env.CRON_SECRET
    if (secret) {
      const qSecret = request.nextUrl.searchParams.get('secret')
      const hSecret = request.headers.get('authorization')?.replace('Bearer ', '')
      if (qSecret !== secret && hSecret !== secret) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
      }
    }
  }

  return NextResponse.next({ request: { headers: requestHeaders } })
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|phone-images|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}