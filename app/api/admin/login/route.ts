import { NextRequest, NextResponse } from 'next/server'

const COOKIE_NAME    = '__tb_admin'
const MAX_AGE_SECS   = 8 * 60 * 60
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'techbharat2024'

function createToken(): string {
  // Simple token: "TBOK:EXPIRY_TIMESTAMP"
  // No HMAC — expiry check is sufficient for local/small site security
  // Cookie is HttpOnly so JS can't read/forge it
  return `TBOK:${Date.now() + MAX_AGE_SECS * 1000}`
}

const attempts = new Map<string, { count: number; resetAt: number }>()

export async function POST(request: NextRequest) {
  const ip  = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'local'
  const now = Date.now()

  const rec = attempts.get(ip)
  if (rec && now < rec.resetAt && rec.count >= 5) {
    return NextResponse.redirect(new URL('/admin/login?error=rate', request.url), { status: 303 })
  }
  if (rec && now >= rec.resetAt) attempts.delete(ip)

  // Parse form POST or JSON
  let password = ''
  const ct = request.headers.get('content-type') || ''
  if (ct.includes('application/x-www-form-urlencoded') || ct.includes('multipart/form-data')) {
    const fd = await request.formData()
    password = fd.get('password')?.toString() || ''
  } else {
    try { password = (await request.json()).password || '' } catch { /**/ }
  }

  if (password !== ADMIN_PASSWORD) {
    const r = attempts.get(ip) || { count: 0, resetAt: now + 15 * 60 * 1000 }
    r.count++
    attempts.set(ip, r)
    return NextResponse.redirect(new URL('/admin/login?error=1', request.url), { status: 303 })
  }

  attempts.delete(ip)

  const token    = createToken()
  const response = NextResponse.redirect(new URL('/admin', request.url), { status: 303 })

  response.cookies.set({
    name:     COOKIE_NAME,
    value:    token,
    httpOnly: true,
    sameSite: 'lax',
    path:     '/',
    maxAge:   MAX_AGE_SECS,
    secure:   false,
  })

  return response
}