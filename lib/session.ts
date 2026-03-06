// lib/session.ts
// Session management — auth enforcement is in middleware.ts
// This module handles: password check, token creation, cookie building

import { createHmac, timingSafeEqual } from 'crypto'

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'techbharat2024'
const SESSION_SECRET = process.env.SESSION_SECRET || 'tb-session-secret-change-this'
const COOKIE_NAME    = '__tb_admin'
const MAX_AGE_SECS   = 8 * 60 * 60  // 8 hours

function sign(payload: string): string {
  const sig = createHmac('sha256', SESSION_SECRET).update(payload).digest('hex')
  return `${payload}.${sig}`
}

function verify(token: string): string | null {
  try {
    const lastDot  = token.lastIndexOf('.')
    if (lastDot === -1) return null
    const payload  = token.slice(0, lastDot)
    const sig      = token.slice(lastDot + 1)
    const expected = createHmac('sha256', SESSION_SECRET).update(payload).digest('hex')
    if (timingSafeEqual(Buffer.from(sig, 'hex'), Buffer.from(expected, 'hex'))) return payload
  } catch { /* length mismatch or bad hex */ }
  return null
}

/** Check admin password (timing-safe) */
export function checkPassword(password: string): boolean {
  try {
    const a = Buffer.from(password)
    const b = Buffer.from(ADMIN_PASSWORD)
    if (a.length !== b.length) {
      // Still do a comparison to prevent timing attacks revealing length
      timingSafeEqual(Buffer.from(ADMIN_PASSWORD), Buffer.from(ADMIN_PASSWORD))
      return false
    }
    return timingSafeEqual(a, b)
  } catch {
    return false
  }
}

/** Check if a request is authenticated (for API route use) */
export function isAuthenticatedFromCookie(cookieValue: string | undefined): boolean {
  if (!cookieValue) return false
  const payload = verify(cookieValue)
  if (!payload) return false
  try {
    const { exp } = JSON.parse(payload)
    return Date.now() < exp
  } catch {
    return false
  }
}

/** Create a signed session token */
export function createSessionToken(): string {
  const payload = JSON.stringify({
    role: 'admin',
    iat:  Date.now(),
    exp:  Date.now() + MAX_AGE_SECS * 1000,
  })
  return sign(payload)
}

/** Set-Cookie header value for login */
export function buildCookie(token: string): string {
  const secure = process.env.NODE_ENV === 'production' ? '; Secure' : ''
  return `${COOKIE_NAME}=${token}; HttpOnly; SameSite=Strict; Path=/; Max-Age=${MAX_AGE_SECS}${secure}`
}

/** Set-Cookie header value for logout */
export function clearCookie(): string {
  return `${COOKIE_NAME}=; HttpOnly; SameSite=Strict; Path=/; Max-Age=0`
}