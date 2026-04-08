// app/api/auto-index/route.ts  
// Called by Vercel Cron every 6 hours — auto-pushes new articles to Google
// Add to vercel.json: { "crons": [{ "path": "/api/auto-index", "schedule": "0 */6 * * *" }] }

import { NextRequest, NextResponse } from 'next/server'

const SITE_URL  = process.env.SITE_URL  || 'https://thetechbharat.com'
const SA_EMAIL  = process.env.GOOGLE_SA_EMAIL        || ''
const SA_KEY    = process.env.GOOGLE_SA_PRIVATE_KEY  || ''
const ADMIN_KEY = process.env.ADMIN_KEY              || ''

async function makeJWT(): Promise<string> {
  const now   = Math.floor(Date.now() / 1000)
  const claim = {
    iss: SA_EMAIL,
    scope: 'https://www.googleapis.com/auth/indexing',
    aud:   'https://oauth2.googleapis.com/token',
    exp:   now + 3600, iat: now,
  }
  const enc = (obj: object) => btoa(JSON.stringify(obj)).replace(/=/g,'').replace(/\+/g,'-').replace(/\//g,'_')
  const unsigned = `${enc({ alg:'RS256', typ:'JWT' })}.${enc(claim)}`
  const pem = SA_KEY.replace(/\\n/g, '\n')
  const b64 = pem.replace('-----BEGIN PRIVATE KEY-----','').replace('-----END PRIVATE KEY-----','').replace(/\s/g,'')
  const bin = Uint8Array.from(atob(b64), c => c.charCodeAt(0))
  const key = await crypto.subtle.importKey('pkcs8', bin.buffer, { name:'RSASSA-PKCS1-v1_5', hash:'SHA-256' }, false, ['sign'])
  const sig = await crypto.subtle.sign('RSASSA-PKCS1-v1_5', key, new TextEncoder().encode(unsigned))
  const s64 = btoa(String.fromCharCode(...new Uint8Array(sig))).replace(/=/g,'').replace(/\+/g,'-').replace(/\//g,'_')
  return `${unsigned}.${s64}`
}

async function getToken(): Promise<string> {
  const jwt = await makeJWT()
  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type':'application/x-www-form-urlencoded' },
    body: `grant_type=urn%3Aietf%3Aparams%3Aoauth%3Agrant-type%3Ajwt-bearer&assertion=${jwt}`,
  })
  const d = await res.json()
  if (!d.access_token) throw new Error(JSON.stringify(d))
  return d.access_token
}

export async function GET(req: NextRequest) {
  // Vercel cron auth OR admin key
  const cronSecret = req.headers.get('authorization')
  const adminKey   = req.nextUrl.searchParams.get('key')
  const isCron     = cronSecret === `Bearer ${process.env.CRON_SECRET}`
  const isAdmin    = adminKey === ADMIN_KEY

  if (!isCron && !isAdmin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  if (!SA_EMAIL || !SA_KEY) {
    return NextResponse.json({ skipped: true, reason: 'Google SA credentials not configured' })
  }

  // Get articles published in last 24 hours (new content = priority for indexing)
  const cutoff = Date.now() - 24 * 60 * 60 * 1000
  const recentUrls: string[] = []
  
  try {
    const { getAllArticlesAsync } = await import('@/lib/store')
    const articles = await getAllArticlesAsync() as any[]
    articles
      .filter(a => a.slug && new Date(a.publishDate).getTime() > cutoff)
      .forEach(a => recentUrls.push(`${SITE_URL}/${a.slug}`))
  } catch {}

  // If no recent articles, index pillar pages (they update monthly)
  if (recentUrls.length === 0) {
    const PILLARS = [
      '/best-camera-phones-india','/best-smartphones-india','/best-battery-backup-phones-india',
      '/best-gaming-phones-india','/smartphone-buying-guide-india','/best-5g-phones-india',
      '/best-budget-phones-india','/best-flagship-phones-india','/best-phones-for-students-india',
      '/phone-comparison-guide-india',
    ]
    PILLARS.forEach(p => recentUrls.push(`${SITE_URL}${p}`))
  }

  const toIndex = recentUrls.slice(0, 50)
  let pushed = 0, failed = 0

  try {
    const token = await getToken()
    for (const url of toIndex) {
      const res = await fetch('https://indexing.googleapis.com/v3/urlNotifications:publish', {
        method: 'POST',
        headers: { 'Content-Type':'application/json', 'Authorization':`Bearer ${token}` },
        body: JSON.stringify({ url, type: 'URL_UPDATED' }),
      })
      const d = await res.json()
      d.error ? failed++ : pushed++
      await new Promise(r => setTimeout(r, 200))
    }
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 })
  }

  // Ping sitemaps
  try {
    await Promise.all([
      fetch(`https://www.google.com/ping?sitemap=${SITE_URL}/sitemap.xml`),
      fetch(`https://www.google.com/ping?sitemap=${SITE_URL}/web-stories-sitemap.xml`),
    ])
  } catch {}

  return NextResponse.json({ pushed, failed, total: toIndex.length, sitemapPinged: true })
}