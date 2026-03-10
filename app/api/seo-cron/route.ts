// app/api/seo-cron/route.ts
// Full SEO Automation Cron - runs every hour via UptimeRobot
// Full refresh (trends + all pages + all articles) runs every 20 hours
import { NextRequest, NextResponse } from 'next/server'
import { Redis } from '@upstash/redis'
import { setPageSeo, setSiteTraffic, PAGE_KEYS, type PageKey, type PageSeoData, type SiteTrafficData } from '@/lib/seo-store'

const kv       = new Redis({ url: process.env.KV_REST_API_URL!, token: process.env.KV_REST_API_TOKEN! })
const SITE_URL = process.env.SITE_URL || 'https://thetechbharat.com'
const TWENTY_H = 20 * 60 * 60 * 1000

async function getGoogleToken(scopes: string[]): Promise<string | null> {
  const raw = process.env.GOOGLE_SERVICE_KEY
  if (!raw) return null
  let key: Record<string, string>
  try { key = JSON.parse(raw) } catch { return null }
  try {
    const b64      = (o: object) => Buffer.from(JSON.stringify(o)).toString('base64url')
    const now      = Math.floor(Date.now() / 1000)
    const unsigned = `${b64({ alg: 'RS256', typ: 'JWT' })}.${b64({ iss: key.client_email, scope: scopes.join(' '), aud: 'https://oauth2.googleapis.com/token', iat: now, exp: now + 3600 })}`
    const der      = Buffer.from(key.private_key.replace(/-----BEGIN PRIVATE KEY-----|-----END PRIVATE KEY-----|\n/g, ''), 'base64')
    const ck       = await crypto.subtle.importKey('pkcs8', der, { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' }, false, ['sign'])
    const sig      = await crypto.subtle.sign('RSASSA-PKCS1-v1_5', ck, Buffer.from(unsigned))
    const jwt      = `${unsigned}.${Buffer.from(sig).toString('base64url')}`
    const res      = await fetch('https://oauth2.googleapis.com/token', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: new URLSearchParams({ grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer', assertion: jwt }) })
    return (await res.json()).access_token || null
  } catch { return null }
}

async function fetchTrends(): Promise<{ title: string; traffic: string }[]> {
  try {
    const res   = await fetch('https://trends.google.com/trends/trendingsearches/daily/rss?geo=IN', { headers: { 'User-Agent': 'Mozilla/5.0' } })
    const xml   = await res.text()
    const items: { title: string; traffic: string }[] = []
    const re    = /<item>([\s\S]*?)<\/item>/g
    let m: RegExpExecArray | null
    while ((m = re.exec(xml)) !== null) {
      const block   = m[1]
      const title   = block.match(/<title><!\[CDATA\[(.*?)\]\]>/)?.[1] || block.match(/<title>(.*?)<\/title>/)?.[1] || ''
      const traffic = block.match(/<ht:approx_traffic>(.*?)<\/ht:approx_traffic>/)?.[1] || ''
      if (title) items.push({ title, traffic })
    }
    await kv.set('seo:trends:india', JSON.stringify({ trends: items.slice(0, 20), ts: Date.now() }))
    return items.slice(0, 20)
  } catch { return [] }
}

const PAGE_CTX: Record<PageKey, string> = {
  'home':        "India's leading mobile technology news website covering smartphones, reviews, comparisons",
  'mobile-news': 'Latest mobile phone news and smartphone launches in India',
  'reviews':     'In-depth smartphone reviews and hands-on tests by Indian tech journalists',
  'compare':     'Side-by-side phone comparisons to help Indian buyers choose the best smartphone',
  'web-stories': 'Visual tech news stories about smartphones and mobile technology in India',
  'about':       'About The Tech Bharat - India trusted mobile tech news source',
  'author':      'Vijay Yadav - Senior Mobile Editor with 11 years experience reviewing smartphones',
}

async function genPageMeta(page: PageKey, trends: { title: string }[]): Promise<PageSeoData | null> {
  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) return null
  try {
    const res  = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'x-api-key': apiKey, 'anthropic-version': '2023-06-01', 'content-type': 'application/json' },
      body: JSON.stringify({ model: 'claude-haiku-4-5-20251001', max_tokens: 350, messages: [{ role: 'user', content: `SEO expert for Indian tech site "The Tech Bharat". Page: ${page}. Context: ${PAGE_CTX[page]}. Trending in India: ${trends.slice(0,6).map(t=>t.title).join(', ')}. Return ONLY JSON: {"title":"max 60 chars","description":"150-160 chars India-focused","keywords":["kw1","kw2","kw3","kw4","kw5","kw6"],"focusKeyword":"main kw","trendKeywords":["t1","t2","t3"]}` }] })
    })
    const data = await res.json()
    const meta = JSON.parse((data.content?.[0]?.text || '').replace(/```json|```/g, '').trim())
    return { title: meta.title, description: meta.description, keywords: meta.keywords || [], focusKeyword: meta.focusKeyword || '', trendKeywords: meta.trendKeywords || [], lastUpdated: Date.now() }
  } catch { return null }
}

async function genArticleMeta(slug: string, title: string, content: string, trends: { title: string }[]): Promise<boolean> {
  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) return false
  try {
    const snippet = content.replace(/<[^>]+>/g, '').slice(0, 500)
    const res     = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'x-api-key': apiKey, 'anthropic-version': '2023-06-01', 'content-type': 'application/json' },
      body: JSON.stringify({ model: 'claude-haiku-4-5-20251001', max_tokens: 250, messages: [{ role: 'user', content: `SEO for Indian tech article. Title: "${title}". Content: ${snippet}. Trends: ${trends.slice(0,4).map(t=>t.title).join(', ')}. Return ONLY JSON: {"seoTitle":"max 60 chars","metaDescription":"150-160 chars India context","focusKeyword":"best kw","secondaryKeywords":["kw1","kw2","kw3"]}` }] })
    })
    const data = await res.json()
    const meta = JSON.parse((data.content?.[0]?.text || '').replace(/```json|```/g, '').trim())
    const art  = await kv.get(`article:${slug}`) as Record<string, unknown> | null
    if (art) await kv.set(`article:${slug}`, JSON.stringify({ ...art, seoTitle: meta.seoTitle, seoDescription: meta.metaDescription, focusKeyword: meta.focusKeyword, secondaryKeywords: meta.secondaryKeywords || [], seoUpdatedAt: Date.now() }))
    return true
  } catch { return false }
}

async function refreshGsc(): Promise<boolean> {
  const token = await getGoogleToken(['https://www.googleapis.com/auth/webmasters.readonly'])
  if (!token) return false
  const siteUrl   = `sc-domain:${new URL(SITE_URL).hostname}`
  const endDate   = new Date()
  const startDate = new Date(); startDate.setDate(startDate.getDate() - 28)
  const fmt       = (d: Date) => d.toISOString().split('T')[0]
  try {
    const [qRes, pRes] = await Promise.all([
      fetch(`https://searchconsole.googleapis.com/webmasters/v3/sites/${encodeURIComponent(siteUrl)}/searchAnalytics/query`, { method: 'POST', headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }, body: JSON.stringify({ startDate: fmt(startDate), endDate: fmt(endDate), dimensions: ['query'], rowLimit: 25 }) }),
      fetch(`https://searchconsole.googleapis.com/webmasters/v3/sites/${encodeURIComponent(siteUrl)}/searchAnalytics/query`, { method: 'POST', headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }, body: JSON.stringify({ startDate: fmt(startDate), endDate: fmt(endDate), dimensions: ['page'], rowLimit: 25 }) })
    ])
    const [qData, pData] = await Promise.all([qRes.json(), pRes.json()])
    const traffic: SiteTrafficData = { gscQueries: qData.rows || [], gscPages: pData.rows || [], period: `${fmt(startDate)} to ${fmt(endDate)}`, lastFetched: Date.now() }
    await setSiteTraffic(traffic)
    return true
  } catch { return false }
}

async function indexNew(log: string[]): Promise<void> {
  const token = await getGoogleToken(['https://www.googleapis.com/auth/indexing'])
  if (!token) { log.push('No GOOGLE_SERVICE_KEY - skipping indexing'); return }
  const keys      = await kv.keys('article:*')
  const twoHrsAgo = Date.now() - 7200000
  let n = 0
  for (const key of keys) {
    const art = await kv.get(key) as Record<string, unknown> | null
    if (!art || (art.publishedAt as number || 0) <= twoHrsAgo || (art.googleIndexed as boolean)) continue
    const url = `${SITE_URL}/article/${key.replace('article:', '')}`
    try {
      const r      = await fetch('https://indexing.googleapis.com/v3/urlNotifications:publish', { method: 'POST', headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }, body: JSON.stringify({ url, type: 'URL_UPDATED' }) })
      const result = await r.json()
      if (!result.error) { await kv.set(key, JSON.stringify({ ...art, googleIndexed: true, indexedAt: Date.now() })); log.push(`Indexed: ${url}`); n++ }
    } catch { /* skip */ }
    await new Promise(r => setTimeout(r, 150))
  }
  if (n === 0) log.push('No new articles to index')
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const qSecret = searchParams.get('secret')
  const hSecret = req.headers.get('authorization')?.replace('Bearer ', '')
  const valid   = process.env.CRON_SECRET
  if (valid && qSecret !== valid && hSecret !== valid) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const log: string[] = []
  const now           = Date.now()
  const force         = searchParams.get('force') === '1'
  const lastRunRaw    = await kv.get('seo:last_full_refresh')
  const lastRun       = lastRunRaw ? Number(lastRunRaw) : 0
  const needsFull     = force || (now - lastRun > TWENTY_H)

  // Always: index new articles
  await indexNew(log)

  // Always: generate meta for brand-new articles (no seoTitle yet)
  const allKeys = await kv.keys('article:*')
  let newMeta = 0
  for (const key of allKeys) {
    if (newMeta >= 5) break
    const art = await kv.get(key) as Record<string, unknown> | null
    if (!art || art.seoTitle || !art.title) continue
    if (await genArticleMeta(key.replace('article:', ''), art.title as string, (art.content as string) || '', [])) { log.push(`New meta: ${art.title as string}`); newMeta++ }
    await new Promise(r => setTimeout(r, 300))
  }

  if (!needsFull) {
    log.push(`Skipping full refresh (next in ${Math.round((TWENTY_H - (now - lastRun)) / 3600000)}h)`)
    await kv.set('seo:cron_log', JSON.stringify({ log, ts: now }))
    return NextResponse.json({ ok: true, fullRefresh: false, log })
  }

  // FULL 20-HOUR REFRESH
  log.push('=== FULL REFRESH STARTED ===')

  const trends = await fetchTrends()
  log.push(`Trends: ${trends.slice(0,3).map(t=>t.title).join(', ')}`)

  // All pages
  for (const page of PAGE_KEYS) {
    const meta = await genPageMeta(page, trends)
    if (meta) { await setPageSeo(page, meta); log.push(`Page updated: ${page}`) }
    await new Promise(r => setTimeout(r, 500))
  }

  // All articles (refresh stale ones, max 20)
  let artDone = 0
  for (const key of allKeys) {
    if (artDone >= 20) break
    const art    = await kv.get(key) as Record<string, unknown> | null
    if (!art || !art.title) continue
    const seoAge = now - (art.seoUpdatedAt as number || 0)
    if (!art.seoTitle || seoAge > TWENTY_H) {
      if (await genArticleMeta(key.replace('article:', ''), art.title as string, (art.content as string) || '', trends)) { log.push(`Article meta: ${art.title as string}`); artDone++ }
      await new Promise(r => setTimeout(r, 300))
    }
  }
  log.push(`Articles refreshed: ${artDone}`)

  // GSC
  const gscOk = await refreshGsc()
  log.push(gscOk ? 'GSC data refreshed' : 'GSC skipped (no key)')

  await kv.set('seo:last_full_refresh', now.toString())
  log.push('=== FULL REFRESH DONE ===')
  await kv.set('seo:cron_log', JSON.stringify({ log, ts: now }))
  return NextResponse.json({ ok: true, fullRefresh: true, log })
}