// app/api/index-url/route.ts
// Google Indexing API — pushes URLs directly to Google for instant indexing
// Setup: GCP Service Account with "indexing.googleapis.com" permission
// Env vars needed: GOOGLE_SA_EMAIL, GOOGLE_SA_PRIVATE_KEY
//
// Usage:
//   POST /api/index-url  { urls: ["https://thetechbharat.com/slug-1", ...] }
//   GET  /api/index-url  → bulk index all articles from Redis (max 100)

import { NextRequest, NextResponse } from 'next/server'

const SITE_URL = process.env.SITE_URL || 'https://thetechbharat.com'
const SA_EMAIL = process.env.GOOGLE_SA_EMAIL || ''
const SA_KEY   = process.env.GOOGLE_SA_PRIVATE_KEY || ''

// ── JWT generation (no external deps) ────────────────────────────
async function makeJWT(): Promise<string> {
  const now   = Math.floor(Date.now() / 1000)
  const claim = {
    iss: SA_EMAIL,
    scope: 'https://www.googleapis.com/auth/indexing',
    aud: 'https://oauth2.googleapis.com/token',
    exp: now + 3600,
    iat: now,
  }
  const header  = btoa(JSON.stringify({ alg: 'RS256', typ: 'JWT' })).replace(/=/g,'').replace(/\+/g,'-').replace(/\//g,'_')
  const payload = btoa(JSON.stringify(claim)).replace(/=/g,'').replace(/\+/g,'-').replace(/\//g,'_')
  const unsigned = `${header}.${payload}`

  // Import private key
  const pemKey = SA_KEY.replace(/\\n/g, '\n')
  const keyData = pemKey
    .replace('-----BEGIN PRIVATE KEY-----','')
    .replace('-----END PRIVATE KEY-----','')
    .replace(/\s/g,'')
  const binaryKey = Uint8Array.from(atob(keyData), c => c.charCodeAt(0))

  const cryptoKey = await crypto.subtle.importKey(
    'pkcs8', binaryKey.buffer,
    { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
    false, ['sign']
  )
  const sig = await crypto.subtle.sign(
    'RSASSA-PKCS1-v1_5', cryptoKey,
    new TextEncoder().encode(unsigned)
  )
  const sigB64 = btoa(String.fromCharCode(...new Uint8Array(sig)))
    .replace(/=/g,'').replace(/\+/g,'-').replace(/\//g,'_')
  return `${unsigned}.${sigB64}`
}

async function getAccessToken(): Promise<string> {
  const jwt = await makeJWT()
  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `grant_type=urn%3Aietf%3Aparams%3Aoauth%3Agrant-type%3Ajwt-bearer&assertion=${jwt}`,
  })
  const data = await res.json()
  if (!data.access_token) throw new Error(`Token error: ${JSON.stringify(data)}`)
  return data.access_token
}

async function pushUrl(url: string, token: string, type = 'URL_UPDATED'): Promise<string> {
  const res = await fetch('https://indexing.googleapis.com/v3/urlNotifications:publish', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ url, type }),
  })
  const data = await res.json()
  if (data.error) return `ERROR: ${data.error.message}`
  return 'OK'
}

// POST: push specific URLs
export async function POST(req: NextRequest) {
  if (!SA_EMAIL || !SA_KEY) {
    return NextResponse.json({ error: 'GOOGLE_SA_EMAIL or GOOGLE_SA_PRIVATE_KEY not set in env' }, { status: 500 })
  }

  const { urls } = await req.json()
  if (!Array.isArray(urls) || urls.length === 0) {
    return NextResponse.json({ error: 'urls array required' }, { status: 400 })
  }

  try {
    const token   = await getAccessToken()
    const results: Record<string, string> = {}
    // Google Indexing API: max 100 per day on free quota
    for (const url of urls.slice(0, 100)) {
      results[url] = await pushUrl(url, token)
      await new Promise(r => setTimeout(r, 200)) // 200ms between calls
    }
    return NextResponse.json({ pushed: Object.keys(results).length, results })
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 })
  }
}

// GET: bulk index all articles + pillar pages
export async function GET(req: NextRequest) {
  // Simple auth check — only call from scheduler or admin
  const auth = req.headers.get('x-admin-key') || req.nextUrl.searchParams.get('key')
  if (auth !== process.env.ADMIN_KEY) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  if (!SA_EMAIL || !SA_KEY) {
    return NextResponse.json({ error: 'Google SA credentials not set' }, { status: 500 })
  }

  // Collect all URLs to index
  const urls: string[] = []

  // 1. All article pages
  try {
    const { getAllArticlesAsync } = await import('@/lib/store')
    const articles = await getAllArticlesAsync() as any[]
    articles.forEach(a => { if (a.slug) urls.push(`${SITE_URL}/${a.slug}`) })
  } catch {}

  // 2. Pillar pages
  const PILLAR_SLUGS = [
    'best-camera-phones-india', 'best-smartphones-india', 'best-battery-backup-phones-india',
    'best-gaming-phones-india', 'smartphone-buying-guide-india', 'best-5g-phones-india',
    'best-budget-phones-india', 'best-flagship-phones-india', 'best-phones-for-students-india',
    'phone-comparison-guide-india',
  ]
  PILLAR_SLUGS.forEach(s => urls.push(`${SITE_URL}/${s}`))

  // 3. Key static pages
  ['/', '/mobile-news', '/reviews', '/compare', '/web-stories'].forEach(p => urls.push(`${SITE_URL}${p}`))

  // Push in batches (100 per day limit)
  const toIndex = urls.slice(0, 100)
  let pushed = 0, errors = 0

  try {
    const token = await getAccessToken()
    for (const url of toIndex) {
      const result = await pushUrl(url, token)
      if (result === 'OK') pushed++
      else errors++
      await new Promise(r => setTimeout(r, 200))
    }
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 })
  }

  // Also ping sitemap
  try {
    await fetch(`https://www.google.com/ping?sitemap=${SITE_URL}/sitemap.xml`)
    await fetch(`https://www.google.com/ping?sitemap=${SITE_URL}/web-stories-sitemap.xml`)
  } catch {}

  return NextResponse.json({
    total: urls.length, pushed, errors, queued: toIndex.length,
    sitemapPinged: true,
    message: `Pushed ${pushed} URLs to Google Indexing API`,
  })
}