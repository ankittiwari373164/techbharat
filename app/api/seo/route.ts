// app/api/seo/route.ts
// SEO Automation Hub — Google Search Console + Indexing API + Trends + AI Meta
import { NextRequest, NextResponse } from 'next/server'
import { Redis } from '@upstash/redis'
const kv = new Redis({ url: process.env.KV_REST_API_URL!, token: process.env.KV_REST_API_TOKEN! })

const SITE_URL = process.env.SITE_URL || 'https://thetechbharat.com'

// ── helpers ──────────────────────────────────────────────────────────────────

function getGoogleKey() {
  const raw = process.env.GOOGLE_SERVICE_KEY
  if (!raw) return null
  try { return JSON.parse(raw) } catch { return null }
}

async function getGoogleAccessToken(scopes: string[]): Promise<string | null> {
  const key = getGoogleKey()
  if (!key) return null
  try {
    // Build JWT for service account
    const header  = { alg: 'RS256', typ: 'JWT' }
    const now     = Math.floor(Date.now() / 1000)
    const payload = {
      iss: key.client_email,
      scope: scopes.join(' '),
      aud: 'https://oauth2.googleapis.com/token',
      iat: now,
      exp: now + 3600,
    }
    const b64 = (obj: object) =>
      Buffer.from(JSON.stringify(obj)).toString('base64url')
    const unsigned = `${b64(header)}.${b64(payload)}`

    // Sign with RS256 using Web Crypto
    const pemBody = key.private_key
      .replace(/-----BEGIN PRIVATE KEY-----/, '')
      .replace(/-----END PRIVATE KEY-----/, '')
      .replace(/\n/g, '')
    const binaryDer = Buffer.from(pemBody, 'base64')
    const cryptoKey = await crypto.subtle.importKey(
      'pkcs8', binaryDer,
      { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
      false, ['sign']
    )
    const sig = await crypto.subtle.sign(
      'RSASSA-PKCS1-v1_5', cryptoKey,
      Buffer.from(unsigned)
    )
    const jwt = `${unsigned}.${Buffer.from(sig).toString('base64url')}`

    const res = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
        assertion: jwt,
      }),
    })
    const data = await res.json()
    return data.access_token || null
  } catch (e) {
    console.error('Google token error:', e)
    return null
  }
}

// ── Search Console ────────────────────────────────────────────────────────────

async function fetchSearchConsoleData(days = 28) {
  const token = await getGoogleAccessToken(['https://www.googleapis.com/auth/webmasters.readonly'])
  if (!token) return { error: 'No GOOGLE_SERVICE_KEY configured' }

  const endDate   = new Date()
  const startDate = new Date()
  startDate.setDate(startDate.getDate() - days)
  const fmt = (d: Date) => d.toISOString().split('T')[0]

  // Top queries
  const queryRes = await fetch(
    `https://searchconsole.googleapis.com/webmasters/v3/sites/${encodeURIComponent(`sc-domain:${new URL(SITE_URL).hostname}`)}/searchAnalytics/query`,
    {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        startDate: fmt(startDate), endDate: fmt(endDate),
        dimensions: ['query'], rowLimit: 20,
      }),
    }
  )
  const queryData = await queryRes.json()

  // Top pages
  const pageRes = await fetch(
    `https://searchconsole.googleapis.com/webmasters/v3/sites/${encodeURIComponent(`sc-domain:${new URL(SITE_URL).hostname}`)}/searchAnalytics/query`,
    {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        startDate: fmt(startDate), endDate: fmt(endDate),
        dimensions: ['page'], rowLimit: 20,
      }),
    }
  )
  const pageData = await pageRes.json()

  return {
    queries: queryData.rows || [],
    pages:   pageData.rows  || [],
    period:  `${fmt(startDate)} → ${fmt(endDate)}`,
  }
}

// ── Google Indexing API ───────────────────────────────────────────────────────

async function submitUrlToGoogle(url: string, type: 'URL_UPDATED' | 'URL_DELETED' = 'URL_UPDATED') {
  const token = await getGoogleAccessToken(['https://www.googleapis.com/auth/indexing'])
  if (!token) return { error: 'No GOOGLE_SERVICE_KEY configured' }

  const res = await fetch('https://indexing.googleapis.com/v3/urlNotifications:publish', {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ url, type }),
  })
  return await res.json()
}

async function batchSubmitArticles() {
  // Get all published article slugs from Redis
  const keys = await kv.keys('article:*')
  const results: { url: string; status: string }[] = []

  // Submit up to 200 per day (Google's limit)
  const slugs = keys.slice(0, 200)
  for (const key of slugs) {
    const slug = key.replace('article:', '')
    const url  = `${SITE_URL}/article/${slug}`
    try {
      const r = await submitUrlToGoogle(url)
      results.push({ url, status: r.error ? `error: ${JSON.stringify(r.error)}` : 'submitted' })
    } catch (e: unknown) {
      results.push({ url, status: `failed: ${e instanceof Error ? e.message : String(e)}` })
    }
    await new Promise(r => setTimeout(r, 100)) // rate limit
  }

  // Store last batch result
  await kv.set('seo:last_index_batch', JSON.stringify({ results, ts: Date.now() }))
  return results
}

// ── Google Trends (via RSS) ───────────────────────────────────────────────────

function parseTrendsXml(xml: string): { title: string; traffic: string; link: string }[] {
  const items: { title: string; traffic: string; link: string }[] = []
  const re = /<item>([\s\S]*?)<\/item>/g
  let m: RegExpExecArray | null
  while ((m = re.exec(xml)) !== null) {
    const b       = m[1]
    const title   = b.match(/<title><!\[CDATA\[(.*?)\]\]>/)?.[1] || b.match(/<title>(.*?)<\/title>/)?.[1] || ''
    const traffic = b.match(/<ht:approx_traffic>(.*?)<\/ht:approx_traffic>/)?.[1] || ''
    const link    = b.match(/<link>(.*?)<\/link>/)?.[1] || ''
    if (title) items.push({ title, traffic, link })
  }
  return items
}

async function fetchTrendingTopics(): Promise<{ title: string; traffic: string; link: string }[]> {
  // Try multiple sources — Google Trends RSS sometimes blocked on Vercel edge
  const sources = [
    'https://trends.google.com/trends/trendingsearches/daily/rss?geo=IN',
    'https://trends.google.com/trends/trendingsearches/daily/rss?geo=IN&hl=en-IN',
    'https://trends.google.com/trends/hottrends/atom/feed?pn=p45', // India hottrends
  ]
  for (const url of sources) {
    try {
      const res = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
          'Accept': 'application/rss+xml, application/xml, text/xml',
        },
        cache: 'no-store',
      })
      if (!res.ok) continue
      const xml   = await res.text()
      const items = parseTrendsXml(xml)
      if (items.length > 0) {
        // Cache in Redis
        await kv.set('seo:trends:india', JSON.stringify({ trends: items.slice(0, 20), ts: Date.now() }))
        return items.slice(0, 20)
      }
    } catch { continue }
  }

  // Fallback: return cached trends from Redis if available
  try {
    const cached = await kv.get('seo:trends:india') as { trends: { title: string; traffic: string; link: string }[]; ts: number } | null
    if (cached?.trends?.length) return cached.trends
  } catch { /* ignore */ }

  // Last resort: return static India tech trends
  return [
    { title: 'Samsung Galaxy S25 price India', traffic: '50K+', link: '' },
    { title: 'iPhone 16e launch India', traffic: '100K+', link: '' },
    { title: 'OnePlus 13 review', traffic: '20K+', link: '' },
    { title: 'best 5G phone under 20000 India', traffic: '200K+', link: '' },
    { title: 'Xiaomi 15 India launch', traffic: '30K+', link: '' },
    { title: 'Realme GT 7 Pro India', traffic: '25K+', link: '' },
    { title: 'Nothing Phone 3 release date', traffic: '40K+', link: '' },
    { title: 'best budget smartphone India 2026', traffic: '150K+', link: '' },
  ]
}

// ── AI Meta Generator ─────────────────────────────────────────────────────────

async function generateSeoMeta(title: string, content: string) {
  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) return { error: 'No ANTHROPIC_API_KEY' }

  const snippet = content.replace(/<[^>]+>/g, '').slice(0, 800)
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 300,
      messages: [{
        role: 'user',
        content: `You are an SEO expert for an Indian tech news site. Generate SEO metadata for this article.
Article Title: ${title}
Content snippet: ${snippet}

Respond ONLY with valid JSON (no markdown):
{
  "seoTitle": "60 chars max, include main keyword naturally",
  "metaDescription": "150-160 chars, compelling, includes India context if relevant, ends with a hook",
  "focusKeyword": "single best keyword phrase",
  "secondaryKeywords": ["kw1", "kw2", "kw3"],
  "readabilityTip": "one short tip to improve this article for SEO"
}`,
      }],
    }),
  })
  const data = await res.json()
  const text = data.content?.[0]?.text || ''
  try {
    return JSON.parse(text.replace(/```json|```/g, '').trim())
  } catch {
    return { error: 'Parse failed', raw: text }
  }
}

// ── Cache helpers ─────────────────────────────────────────────────────────────

async function getCached<T>(key: string, ttlSeconds: number, fetcher: () => Promise<T>): Promise<T> {
  const cached = await kv.get(key) as { data: T; ts: number } | null
  if (cached && Date.now() - cached.ts < ttlSeconds * 1000) return cached.data
  const data = await fetcher()
  await kv.set(key, JSON.stringify({ data, ts: Date.now() }))
  return data
}

// ── Route handlers ────────────────────────────────────────────────────────────

export async function GET(req: NextRequest) {
  // Auth check — same as middleware
  const token = req.cookies.get('__tb_admin')?.value
  if (!token || !token.startsWith('TBOK:') || Date.now() > parseInt(token.split(':')[1] || '0')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(req.url)
  const action = searchParams.get('action')

  if (action === 'gsc') {
    const days = parseInt(searchParams.get('days') || '28')
    const data = await getCached(`seo:gsc:${days}`, 1800, () => fetchSearchConsoleData(days))
    return NextResponse.json(data)
  }

  if (action === 'trends') {
    const data = await getCached('seo:trends', 3600, fetchTrendingTopics)
    return NextResponse.json({ trends: data })
  }

  if (action === 'index_status') {
    const raw  = await kv.get('seo:last_index_batch')
    const data = raw ? (typeof raw === 'string' ? JSON.parse(raw) : raw) : null
    return NextResponse.json({ lastBatch: data })
  }

  if (action === 'meta_batch') {
    // Get all articles missing seoTitle
    const keys = await kv.keys('article:*')
    const missing: { slug: string; title: string }[] = []
    for (const key of keys.slice(0, 50)) {
      const art = await kv.get(key) as Record<string, unknown> | null
      if (art && !art.seoTitle) {
        missing.push({ slug: key.replace('article:', ''), title: art.title as string })
      }
    }
    return NextResponse.json({ missing, total: keys.length })
  }

  return NextResponse.json({ error: 'Unknown action' }, { status: 400 })
}

export async function POST(req: NextRequest) {
  // Auth check — same as middleware
  const token = req.cookies.get('__tb_admin')?.value
  if (!token || !token.startsWith('TBOK:') || Date.now() > parseInt(token.split(':')[1] || '0')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let body: Record<string, unknown> = {}
  try { body = await req.json() } catch { /* empty body */ }
  const action = body.action

  if (action === 'generate_meta') {
    const slug    = body.slug    as string | undefined
    const title   = body.title   as string | undefined
    const content = body.content as string | undefined
    if (!slug || !title) return NextResponse.json({ error: 'Missing slug/title' }, { status: 400 })

    const meta = await generateSeoMeta(title, content || '')

    // Save back to Redis article
    if (!meta.error) {
      const art = await kv.get(`article:${slug}`) as Record<string, unknown> | null
      if (art) {
        await kv.set(`article:${slug}`, JSON.stringify({
          ...art,
          seoTitle:       meta.seoTitle,
          seoDescription: meta.metaDescription,
          focusKeyword:   meta.focusKeyword,
        }))
      }
    }
    return NextResponse.json(meta)
  }

  if (action === 'index_url') {
    const url = body.url as string | undefined
    if (!url) return NextResponse.json({ error: 'Missing url' }, { status: 400 })
    const result = await submitUrlToGoogle(url)
    return NextResponse.json(result)
  }

  if (action === 'index_all') {
    const results = await batchSubmitArticles()
    return NextResponse.json({ submitted: results.length, results })
  }

  if (action === 'generate_all_meta') {
    const force = body.force === true
    const keys  = await kv.keys('article:*')
    let done = 0; let skipped = 0
    for (const key of keys.slice(0, 30)) {
      const art = await kv.get(key) as Record<string, unknown> | null
      if (!art || !art.title) { skipped++; continue }
      if (!force && art.seoTitle) { skipped++; continue } // already has meta
      const meta = await generateSeoMeta(art.title as string, (art.content as string) || '')
      if (!meta.error) {
        await kv.set(key, {
          ...art,
          seoTitle:       meta.seoTitle,
          seoDescription: meta.metaDescription,
          focusKeyword:   meta.focusKeyword,
          seoKeywords:    meta.secondaryKeywords || [],
        })
        done++
      }
      await new Promise(r => setTimeout(r, 300))
    }
    return NextResponse.json({ generated: done, skipped, total: keys.length })
  }

  return NextResponse.json({ error: 'Unknown action' }, { status: 400 })
}