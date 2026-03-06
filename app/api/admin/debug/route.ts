import { NextRequest, NextResponse } from 'next/server'
import { createHmac } from 'crypto'

export async function GET(request: NextRequest) {
  const SESSION_SECRET = process.env.SESSION_SECRET || 'tb-session-secret-change-this'
  const COOKIE_NAME    = '__tb_admin'
  const cookie         = request.cookies.get(COOKIE_NAME)?.value
  const allCookies     = request.headers.get('cookie') || 'NONE'

  let sigOk = false, expired = false, parseErr = ''

  if (cookie) {
    try {
      const lastDot  = cookie.lastIndexOf('.')
      const payload  = cookie.slice(0, lastDot)
      const sig      = cookie.slice(lastDot + 1)
      const expected = createHmac('sha256', SESSION_SECRET).update(payload).digest('hex')
      sigOk          = sig === expected
      const exp      = parseInt(payload.split(':')[1], 10)
      expired        = Date.now() >= exp
    } catch (e) { parseErr = String(e) }
  }

  return NextResponse.json({
    hasCookie: !!cookie,
    cookie:    cookie || null,
    allCookies: allCookies.slice(0, 300),
    sigOk, expired, parseErr,
    secretLen: SESSION_SECRET.length,
    secretPrefix: SESSION_SECRET.slice(0, 8),
    env_password_set: !!process.env.ADMIN_PASSWORD,
    env_secret_set:   !!process.env.SESSION_SECRET,
  })
}