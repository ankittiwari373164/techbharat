// app/api/index-url/route.ts
// Google Indexing API — instant push to Google
// GET  ?key=YOUR_ADMIN_KEY  → bulk index all articles + pillar pages
// POST { urls: [...] }      → push specific URLs (requires x-admin-key header)

import { NextRequest, NextResponse } from 'next/server'

const SITE_URL   = process.env.SITE_URL || 'https://thetechbharat.com'
const SA_EMAIL   = process.env.GOOGLE_SA_EMAIL || ''
const SA_KEY     = process.env.GOOGLE_SA_PRIVATE_KEY || ''
const ADMIN_KEY  = process.env.ADMIN_KEY || 'qwertyuiopasdfghjklzxcvbnm' // fallback for first use

const PILLAR_SLUGS = [
  'best-camera-phones-india','best-smartphones-india','best-battery-backup-phones-india',
  'best-gaming-phones-india','smartphone-buying-guide-india','best-5g-phones-india',
  'best-budget-phones-india','best-flagship-phones-india','best-phones-for-students-india',
  'phone-comparison-guide-india',
]

async function makeJWT(): Promise<string> {
  const now = Math.floor(Date.now() / 1000)
  const enc = (o: object) => btoa(JSON.stringify(o)).replace(/=/g,'').replace(/\+/g,'-').replace(/\//g,'_')
  const unsigned = `${enc({alg:'RS256',typ:'JWT'})}.${enc({
    iss: SA_EMAIL, scope: 'https://www.googleapis.com/auth/indexing',
    aud: 'https://oauth2.googleapis.com/token', exp: now + 3600, iat: now,
  })}`
  const pem = SA_KEY.replace(/\\n/g,'\n')
  const b64 = pem.replace('-----BEGIN PRIVATE KEY-----','').replace('-----END PRIVATE KEY-----','').replace(/\s/g,'')
  const bin = Uint8Array.from(atob(b64), c => c.charCodeAt(0))
  const key = await crypto.subtle.importKey('pkcs8', bin.buffer,
    { name:'RSASSA-PKCS1-v1_5', hash:'SHA-256' }, false, ['sign'])
  const sig = await crypto.subtle.sign('RSASSA-PKCS1-v1_5', key, new TextEncoder().encode(unsigned))
  const s64 = btoa(String.fromCharCode(...new Uint8Array(sig))).replace(/=/g,'').replace(/\+/g,'-').replace(/\//g,'_')
  return `${unsigned}.${s64}`
}

async function getToken(): Promise<string> {
  const jwt = await makeJWT()
  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `grant_type=urn%3Aietf%3Aparams%3Aoauth%3Agrant-type%3Ajwt-bearer&assertion=${jwt}`,
  })
  const d = await res.json()
  if (!d.access_token) throw new Error(`Token failed: ${JSON.stringify(d)}`)
  return d.access_token
}

async function pushUrl(url: string, token: string): Promise<'ok' | string> {
  const res = await fetch('https://indexing.googleapis.com/v3/urlNotifications:publish', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ url, type: 'URL_UPDATED' }),
  })
  const d = await res.json()
  return d.error ? `ERR: ${d.error.message}` : 'ok'
}

function isAuthed(req: NextRequest): boolean {
  const key = req.nextUrl.searchParams.get('key') || req.headers.get('x-admin-key') || ''
  return key === ADMIN_KEY || key === (process.env.ADMIN_KEY || '')
}

// GET: bulk index everything
export async function GET(req: NextRequest) {
  if (!isAuthed(req)) {
    return NextResponse.json({
      error: 'Unauthorized',
      hint: 'Add ?key=YOUR_ADMIN_KEY — set ADMIN_KEY env var in Vercel, or use default key from route',
    }, { status: 401 })
  }

  // If SA credentials not set, return helpful message instead of error
  if (!SA_EMAIL || !SA_KEY) {
    return NextResponse.json({
      ready: false,
      message: 'Google SA credentials not configured yet.',
      setup: 'Add GOOGLE_SA_EMAIL and GOOGLE_SA_PRIVATE_KEY to Vercel env vars.',
      guide: `${SITE_URL}/GOOGLE_INDEXING_API_SETUP.md`,
      // Still ping sitemaps which always works
      sitemapPinged: await pingAll(),
    })
  }

  // Collect all URLs
  const urls: string[] = []
  try {
    const { getAllArticlesAsync } = await import('@/lib/store')
    const articles = await getAllArticlesAsync() as any[]
    articles.forEach(a => { if (a.slug) urls.push(`${SITE_URL}/${a.slug}`) })
  } catch {}

  PILLAR_SLUGS.forEach(s => urls.push(`${SITE_URL}/${s}`))
  ;['', '/mobile-news', '/reviews', '/compare', '/web-stories'].forEach(p => urls.push(`${SITE_URL}${p}`))

  // Push up to 100 (Google daily limit)
  const toIndex = urls.slice(0, 100)
  let pushed = 0, errors = 0
  const errorList: string[] = []

  try {
    const token = await getToken()
    for (const url of toIndex) {
      const result = await pushUrl(url, token)
      if (result === 'ok') pushed++
      else { errors++; errorList.push(`${url}: ${result}`) }
      await new Promise(r => setTimeout(r, 150))
    }
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message, pushed, errors }, { status: 500 })
  }

  await pingAll()

  return NextResponse.json({
    success: true, total: urls.length, pushed, errors,
    queued: toIndex.length, sitemapPinged: true,
    ...(errorList.length ? { errorSample: errorList.slice(0, 3) } : {}),
  })
}

// POST: push specific URLs
export async function POST(req: NextRequest) {
  if (!isAuthed(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if (!SA_EMAIL || !SA_KEY) return NextResponse.json({ error: 'SA credentials not set' }, { status: 500 })

  const { urls } = await req.json()
  if (!Array.isArray(urls) || !urls.length) return NextResponse.json({ error: 'urls array required' }, { status: 400 })

  let pushed = 0, errors = 0
  try {
    const token = await getToken()
    for (const url of urls.slice(0, 100)) {
      const r = await pushUrl(url, token)
      r === 'ok' ? pushed++ : errors++
      await new Promise(r => setTimeout(r, 150))
    }
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 })
  }

  return NextResponse.json({ pushed, errors, total: urls.length })
}

async function pingAll(): Promise<boolean> {
  try {
    await Promise.all([
      fetch(`https://www.google.com/ping?sitemap=${SITE_URL}/sitemap.xml`),
      fetch(`https://www.google.com/ping?sitemap=${SITE_URL}/web-stories-sitemap.xml`),
    ])
    return true
  } catch { return false }
}