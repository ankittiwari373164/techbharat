// app/api/index-url/route.ts
// Google Indexing API — instant push for new/updated article URLs
// Called automatically after article publish from fetch-news / scheduler
// Also callable manually from admin: POST /api/index-url { urls: [...] }
//
// Setup required in .env.local:
//   GOOGLE_INDEXING_SA_KEY = JSON.stringify(serviceAccountKeyJson)
//   (Create a service account in GCP with "Indexing API" permission,
//    add it as owner in Google Search Console)
//
// Free quota: 200 URLs/day

import { NextRequest, NextResponse } from 'next/server'

const SITE_URL = process.env.SITE_URL || 'https://thetechbharat.com'

// Google OAuth2 token from service account JSON key
async function getGoogleAccessToken(): Promise<string | null> {
  const saKeyRaw = process.env.GOOGLE_INDEXING_SA_KEY
  if (!saKeyRaw) return null

  try {
    const saKey = JSON.parse(saKeyRaw)
    const now = Math.floor(Date.now() / 1000)
    const payload = {
      iss: saKey.client_email,
      scope: 'https://www.googleapis.com/auth/indexing',
      aud: 'https://oauth2.googleapis.com/token',
      exp: now + 3600,
      iat: now,
    }

    // Build JWT manually (no external lib needed)
    const header = { alg: 'RS256', typ: 'JWT' }
    const encode = (obj: object) =>
      Buffer.from(JSON.stringify(obj)).toString('base64url')
    const signingInput = `${encode(header)}.${encode(payload)}`

    // Sign with RSA private key using Web Crypto
    const privateKeyPem = saKey.private_key as string
    const pemBody = privateKeyPem
      .replace(/-----BEGIN PRIVATE KEY-----/, '')
      .replace(/-----END PRIVATE KEY-----/, '')
      .replace(/\s/g, '')
    const keyBuffer = Buffer.from(pemBody, 'base64')

    const cryptoKey = await crypto.subtle.importKey(
      'pkcs8',
      keyBuffer,
      { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
      false,
      ['sign']
    )
    const signatureBuffer = await crypto.subtle.sign(
      'RSASSA-PKCS1-v1_5',
      cryptoKey,
      Buffer.from(signingInput)
    )
    const signature = Buffer.from(signatureBuffer).toString('base64url')
    const jwt = `${signingInput}.${signature}`

    // Exchange JWT for access token
    const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
        assertion: jwt,
      }),
    })
    const tokenData = await tokenRes.json()
    return tokenData.access_token || null
  } catch (e) {
    console.error('[IndexAPI] Token error:', e)
    return null
  }
}

// Push a single URL to Google Indexing API
async function pushUrl(url: string, token: string, type: 'URL_UPDATED' | 'URL_DELETED' = 'URL_UPDATED') {
  const res = await fetch(
    `https://indexing.googleapis.com/v3/urlNotifications:publish`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ url, type }),
    }
  )
  const data = await res.json()
  return { url, status: res.status, ok: res.ok, data }
}

// Also ping Google sitemap (free, no quota)
async function pingSitemap() {
  try {
    const sitemapUrl = `${SITE_URL}/sitemap.xml`
    await fetch(
      `https://www.google.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`,
      { method: 'GET' }
    )
  } catch { /* non-fatal */ }
}

export async function POST(req: NextRequest) {
  // Protect with CRON_SECRET
  const secret = req.nextUrl.searchParams.get('secret') ||
    req.headers.get('authorization')?.replace('Bearer ', '')
  const cronSecret = process.env.CRON_SECRET
  if (cronSecret && secret !== cronSecret) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json().catch(() => ({}))
  const { slugs, urls: rawUrls } = body as { slugs?: string[]; urls?: string[] }

  // Accept either slugs (we add SITE_URL) or full URLs
  const urls: string[] = []
  if (slugs?.length) {
    slugs.forEach(slug => {
      // Canonical URL = /slug (no /article/ prefix)
      const clean = slug.replace(/^\/article\//, '/').replace(/^\//, '')
      urls.push(`${SITE_URL}/${clean}`)
    })
  }
  if (rawUrls?.length) {
    rawUrls.forEach(u => {
      // Ensure we use canonical URL (no /article/ prefix)
      const canonical = u.replace(`${SITE_URL}/article/`, `${SITE_URL}/`)
      urls.push(canonical)
    })
  }

  if (!urls.length) {
    return NextResponse.json({ error: 'No URLs provided' }, { status: 400 })
  }

  const token = await getGoogleAccessToken()
  if (!token) {
    // Even without SA key, ping sitemap — it's free
    await pingSitemap()
    return NextResponse.json({
      warning: 'No GOOGLE_INDEXING_SA_KEY set — sitemap pinged instead',
      sitemapPinged: true,
    })
  }

  // Push all URLs (max 200/day quota)
  const results = await Promise.allSettled(
    urls.slice(0, 200).map(url => pushUrl(url, token))
  )

  // Also ping sitemap
  await pingSitemap()

  const summary = results.map((r, i) => ({
    url: urls[i],
    ok: r.status === 'fulfilled' ? r.value.ok : false,
    status: r.status === 'fulfilled' ? r.value.status : 'error',
  }))

  const successCount = summary.filter(s => s.ok).length

  return NextResponse.json({
    pushed: successCount,
    total: urls.length,
    sitemapPinged: true,
    results: summary,
  })
}

// GET: Push all recent articles (admin convenience)
export async function GET(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get('secret')
  const cronSecret = process.env.CRON_SECRET
  if (cronSecret && secret !== cronSecret) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Get recent 50 articles
  let slugs: string[] = []
  try {
    const { getAllArticlesAsync } = await import('@/lib/store')
    const articles = await getAllArticlesAsync()
    slugs = articles.slice(0, 50).map((a: any) => a.slug)
  } catch {
    return NextResponse.json({ error: 'Could not fetch articles' }, { status: 500 })
  }

  const urls = slugs.map(slug => `${SITE_URL}/${slug}`)

  const token = await getGoogleAccessToken()
  if (!token) {
    await pingSitemap()
    return NextResponse.json({
      warning: 'No GOOGLE_INDEXING_SA_KEY — sitemap pinged',
      sitemapPinged: true,
      urlsQueued: urls.length,
    })
  }

  const results = await Promise.allSettled(
    urls.slice(0, 200).map(url => pushUrl(url, token))
  )
  await pingSitemap()

  const summary = results.map((r, i) => ({
    url: urls[i],
    ok: r.status === 'fulfilled' ? (r.value as any).ok : false,
  }))

  return NextResponse.json({
    pushed: summary.filter(s => s.ok).length,
    total: urls.length,
    sitemapPinged: true,
  })
}