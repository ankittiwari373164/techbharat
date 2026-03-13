// app/api/seo-cron/route.ts
// ─────────────────────────────────────────────────────────────────────────────
// SEO Automation Cron — runs every hour via UptimeRobot
// ✓ Google Indexing API (submit new articles to Google index)
// ✓ Google Trends India (fetch trending topics for keyword updates)  
// ✓ AI keyword generation (Anthropic/Haiku)
// ✗ Google Search Console removed — use self-hosted analytics instead
//
// Full refresh (trends + all pages + all articles) every 20 hours
// ─────────────────────────────────────────────────────────────────────────────
import { NextRequest, NextResponse } from 'next/server'
import { Redis } from '@upstash/redis'
import { setPageSeo, PAGE_KEYS, type PageKey, type PageSeoData } from '@/lib/seo-store'

export const dynamic = 'force-dynamic'

const kv       = new Redis({ url: process.env.KV_REST_API_URL!, token: process.env.KV_REST_API_TOKEN! })
const SITE_URL = process.env.SITE_URL || 'https://thetechbharat.com'
const TWENTY_H  = 20 * 60 * 60 * 1000
const TWENTY_FOUR_H = 24 * 60 * 60 * 1000

// ── UptimeRobot health check ──────────────────────────────────────────────
export async function HEAD() {
  return new Response(null, { status: 200 })
}

// ── Google JWT for Indexing API only ─────────────────────────────────────
async function getIndexingToken(): Promise<string | null> {
  const raw = process.env.GOOGLE_SERVICE_KEY
  if (!raw) return null
  let key: Record<string, string>
  try { key = JSON.parse(raw) } catch { return null }
  try {
    const b64      = (o: object) => Buffer.from(JSON.stringify(o)).toString('base64url')
    const now      = Math.floor(Date.now() / 1000)
    const unsigned = `${b64({ alg: 'RS256', typ: 'JWT' })}.${b64({
      iss:   key.client_email,
      scope: 'https://www.googleapis.com/auth/indexing',
      aud:   'https://oauth2.googleapis.com/token',
      iat:   now,
      exp:   now + 3600,
    })}`
    const der = Buffer.from(
      key.private_key.replace(/-----BEGIN PRIVATE KEY-----|-----END PRIVATE KEY-----|\n/g, ''),
      'base64'
    )
    const ck  = await crypto.subtle.importKey('pkcs8', der, { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' }, false, ['sign'])
    const sig = await crypto.subtle.sign('RSASSA-PKCS1-v1_5', ck, Buffer.from(unsigned))
    const jwt = `${unsigned}.${Buffer.from(sig).toString('base64url')}`
    const res = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer', assertion: jwt }),
    })
    return (await res.json()).access_token || null
  } catch { return null }
}

// ── Fetch India trending topics from Google Trends RSS ───────────────────
async function fetchTrends(): Promise<{ title: string; traffic: string }[]> {
  try {
    const res  = await fetch(
      'https://trends.google.com/trends/trendingsearches/daily/rss?geo=IN',
      { headers: { 'User-Agent': 'Mozilla/5.0' } }
    )
    const xml  = await res.text()
    const items: { title: string; traffic: string }[] = []
    const re   = /<item>([\s\S]*?)<\/item>/g
    let m: RegExpExecArray | null
    while ((m = re.exec(xml)) !== null) {
      const block   = m[1]
      const title   = block.match(/<title><!\[CDATA\[(.*?)\]\]>/)?.[1] || block.match(/<title>(.*?)<\/title>/)?.[1] || ''
      const traffic = block.match(/<ht:approx_traffic>(.*?)<\/ht:approx_traffic>/)?.[1] || ''
      if (title) items.push({ title, traffic })
    }
    const result = items.slice(0, 20)
    await kv.set('seo:trends:india', JSON.stringify({ trends: result, ts: Date.now() }))
    return result
  } catch { return [] }
}

// ── Page context for keyword generation ──────────────────────────────────
const PAGE_CTX: Record<PageKey, string> = {
  'home':        "India's leading mobile technology news website",
  'mobile-news': 'Latest mobile phone news and smartphone launches in India',
  'reviews':     'In-depth smartphone reviews by Indian tech journalists',
  'compare':     'Phone comparisons to help Indian buyers choose',
  'web-stories': 'Visual tech news stories about smartphones in India',
  'about':       'About The Tech Bharat - India trusted mobile tech news',
  'author':      'Vijay Yadav - Senior Mobile Editor, 11 years experience',
}

// Fixed titles and descriptions — NEVER auto-changed
const FIXED_PAGE_META: Record<PageKey, { title: string; description: string }> = {
  'home':        { title: "The Tech Bharat – India's Mobile Technology News", description: "The Tech Bharat delivers original mobile technology news, smartphone reviews, comparisons, and in-depth analysis for Indian readers." },
  'mobile-news': { title: "Mobile News – Latest Smartphone News India | The Tech Bharat", description: "Latest mobile phone news, launches, leaks, and updates from Samsung, Apple, Xiaomi, OnePlus and more. India-first coverage." },
  'reviews':     { title: "Smartphone Reviews India – Hands-On Tests | The Tech Bharat", description: "Expert smartphone reviews and hands-on tests from The Tech Bharat. India pricing, real-world battery tests, and camera analysis." },
  'compare':     { title: "Compare Phones India – Side-by-Side Comparison | The Tech Bharat", description: "Compare smartphones side-by-side with India pricing, specifications, camera tests, and battery life. Find the best phone for your budget." },
  'web-stories': { title: "Tech Web Stories – Mobile News India | The Tech Bharat", description: "Quick visual stories about the latest smartphones, tech news and mobile launches in India." },
  'about':       { title: "About The Tech Bharat – India's Trusted Mobile Tech News", description: "The Tech Bharat is India's independent mobile technology news publication." },
  'author':      { title: "Vijay Yadav – Senior Mobile Editor | The Tech Bharat", description: "Vijay Yadav has 11 years of experience reviewing smartphones for Indian buyers." },
}

const FIXED_KEYWORDS: Record<PageKey, string[]> = {
  'home':        ['mobile news India', 'smartphone news India', 'tech news India', 'phone launches India', 'best smartphones India 2026'],
  'mobile-news': ['mobile news India', 'smartphone launch India', 'new phone India', 'phone price India', 'latest Android phone India'],
  'reviews':     ['smartphone review India', 'phone review India', 'best phone under 20000', 'camera test India', 'battery life test'],
  'compare':     ['compare phones India', 'best phone to buy India', 'phone vs phone India', 'which phone to buy', 'smartphone comparison India'],
  'web-stories': ['smartphone news story', 'mobile tech story India', 'phone launch story', 'tech news India'],
  'about':       ['The Tech Bharat', 'Indian tech news site', 'mobile technology India'],
  'author':      ['Vijay Yadav', 'mobile editor India', 'smartphone reviewer India'],
}

// ── AI keyword generation ─────────────────────────────────────────────────
async function genPageKeywords(page: PageKey, trends: { title: string }[]): Promise<PageSeoData | null> {
  const apiKey = process.env.ANTHROPIC_API_KEY
  const trendTitles = trends.slice(0, 8).map(t => t.title)
  let trendKeywords: string[] = []

  if (apiKey) {
    try {
      const res  = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'x-api-key': apiKey, 'anthropic-version': '2023-06-01', 'content-type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-haiku-4-5-20251001',
          max_tokens: 200,
          messages: [{
            role: 'user',
            content: `SEO expert task. Trending India topics: ${trendTitles.join(', ')}. 
Page: ${PAGE_CTX[page]}.
Pick 4-5 trending topics relevant to this mobile tech page. Convert to SEO keyword phrases.
Return ONLY a JSON array of strings. Example: ["samsung galaxy s26 price India","5G phone launch 2026"]`,
          }],
        }),
      })
      const data = await res.json()
      const text = (data.content?.[0]?.text || '').replace(/```json|```/g, '').trim()
      trendKeywords = JSON.parse(text)
    } catch { trendKeywords = trendTitles.slice(0, 3) }
  } else {
    trendKeywords = trendTitles.slice(0, 3)
  }

  return {
    title:         FIXED_PAGE_META[page].title,        // NEVER changes
    description:   FIXED_PAGE_META[page].description,  // NEVER changes
    keywords:      [...FIXED_KEYWORDS[page], ...trendKeywords],
    focusKeyword:  FIXED_KEYWORDS[page][0],
    trendKeywords,
    lastUpdated:   Date.now(),
  }
}

// ── AI meta for individual articles ───────────────────────────────────────
async function genArticleMeta(
  slug: string,
  title: string,
  content: string,
  trends: { title: string }[]
): Promise<boolean> {
  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) return false
  try {
    const snippet = content.replace(/<[^>]+>/g, '').slice(0, 500)
    const res     = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'x-api-key': apiKey, 'anthropic-version': '2023-06-01', 'content-type': 'application/json' },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 250,
        messages: [{
          role: 'user',
          content: `SEO for Indian tech article.
Title: "${title}"
Content snippet: ${snippet}
Trending: ${trends.slice(0, 4).map(t => t.title).join(', ')}
Return ONLY JSON:
{"seoTitle":"max 60 chars","metaDescription":"150-160 chars India context","focusKeyword":"best kw","secondaryKeywords":["kw1","kw2","kw3"]}`,
        }],
      }),
    })
    const data = await res.json()
    const meta = JSON.parse((data.content?.[0]?.text || '').replace(/```json|```/g, '').trim())
    const art  = await kv.get(`article:${slug}`) as Record<string, unknown> | null
    if (art) {
      await kv.set(`article:${slug}`, JSON.stringify({
        ...art,
        seoTitle:           meta.seoTitle,
        seoDescription:     meta.metaDescription,
        focusKeyword:       meta.focusKeyword,
        secondaryKeywords:  meta.secondaryKeywords || [],
        seoUpdatedAt:       Date.now(),
      }))
    }
    return true
  } catch { return false }
}

// ── Submit new articles to Google Indexing API ────────────────────────────
async function indexNewArticles(log: string[]): Promise<void> {
  const token = await getIndexingToken()
  if (!token) { log.push('No GOOGLE_SERVICE_KEY — skipping indexing'); return }

  const keys      = await kv.keys('article:*')
  const twoHrsAgo = Date.now() - 7_200_000
  let n = 0

  for (const key of keys) {
    const art = await kv.get(key) as Record<string, unknown> | null
    if (!art) continue
    const artTime = (art.publishedAt as number) || new Date((art.publishDate as string) || 0).getTime()
    if (artTime <= twoHrsAgo || (art.googleIndexed as boolean)) continue

    const url = `${SITE_URL}/article/${key.replace('article:', '')}`
    try {
      const r      = await fetch('https://indexing.googleapis.com/v3/urlNotifications:publish', {
        method:  'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body:    JSON.stringify({ url, type: 'URL_UPDATED' }),
      })
      const result = await r.json()
      if (!result.error) {
        await kv.set(key, JSON.stringify({ ...art, googleIndexed: true, indexedAt: Date.now() }))
        log.push(`Indexed: ${url}`)
        n++
      }
    } catch { /* skip */ }
    await new Promise(r => setTimeout(r, 150))
  }
  if (n === 0) log.push('No new articles to index')
}

// ── Main handler ──────────────────────────────────────────────────────────
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const qSecret = searchParams.get('secret')
  const hSecret = req.headers.get('authorization')?.replace('Bearer ', '')
  const valid   = process.env.CRON_SECRET
  if (valid && qSecret !== valid && hSecret !== valid) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const log: string[] = []
  const now           = Date.now()
  const force         = searchParams.get('force') === '1'
  const lastRunRaw    = await kv.get('seo:last_full_refresh')
  const lastRun       = lastRunRaw ? Number(lastRunRaw) : 0
  const needsFull     = force || (now - lastRun > TWENTY_H)

  // ── Always: index new articles ─────────────────────────────────────────
  await indexNewArticles(log)

  // ── Always: generate meta for brand-new articles (no seoTitle yet) ─────
  const allKeys = await kv.keys('article:*')
  let newMeta = 0
  for (const key of allKeys) {
    if (newMeta >= 5) break
    const art = await kv.get(key) as Record<string, unknown> | null
    if (!art || art.seoTitle || !art.title) continue
    if (await genArticleMeta(
      key.replace('article:', ''),
      art.title as string,
      (art.content as string) || '',
      []
    )) {
      log.push(`New meta: ${art.title as string}`)
      newMeta++
    }
    await new Promise(r => setTimeout(r, 300))
  }

  if (!needsFull) {
    log.push(`Skipping full refresh (next in ${Math.round((TWENTY_H - (now - lastRun)) / 3_600_000)}h)`)
    await kv.set('seo:cron_log', JSON.stringify({ log, ts: now }))
    return NextResponse.json({ ok: true, fullRefresh: false, log })
  }

  // ── Full 20-hour refresh ───────────────────────────────────────────────
  log.push('=== FULL REFRESH STARTED ===')

  const trends = await fetchTrends()
  log.push(`Trends fetched: ${trends.slice(0, 3).map(t => t.title).join(', ')}`)

  // Update all static pages
  for (const page of PAGE_KEYS) {
    const meta = await genPageKeywords(page, trends)
    if (meta) { await setPageSeo(page, meta); log.push(`Page updated: ${page}`) }
    await new Promise(r => setTimeout(r, 500))
  }

  // Refresh stale article meta (max 20 per run)
  let artDone = 0
  for (const key of allKeys) {
    if (artDone >= 20) break
    const art    = await kv.get(key) as Record<string, unknown> | null
    if (!art || !art.title) continue
    const seoAge = now - ((art.seoUpdatedAt as number) || 0)
    if (!art.seoTitle || seoAge > TWENTY_H) {
      if (await genArticleMeta(
        key.replace('article:', ''),
        art.title as string,
        (art.content as string) || '',
        trends
      )) {
        log.push(`Article meta: ${art.title as string}`)
        artDone++
      }
      await new Promise(r => setTimeout(r, 300))
    }
  }
  log.push(`Articles refreshed: ${artDone}`)

  await kv.set('seo:last_full_refresh', now.toString())
  log.push('=== FULL REFRESH DONE ===')

  // ── Daily evergreen article auto-publish (once per 24h) ──────────────
  // Picks best unpublished evergreen topic based on today's Google Trends India
  const lastEvergreenRaw = await kv.get('evergreen:last_auto_publish')
  const lastEvergreen    = lastEvergreenRaw ? Number(lastEvergreenRaw) : 0
  const needsEvergreen   = force || (now - lastEvergreen > TWENTY_FOUR_H)

  if (needsEvergreen) {
    log.push('--- Evergreen auto-publish starting ---')
    try {
      const siteUrl = process.env.SITE_URL || 'https://thetechbharat.com'
      const secret  = process.env.CRON_SECRET || ''
      const egRes   = await fetch(
        `${siteUrl}/api/admin/generate-evergreen?auto=1&secret=${encodeURIComponent(secret)}`,
        { method: 'POST' }
      )
      const egData  = await egRes.json()
      if (egData.generated?.length > 0) {
        log.push(`Evergreen published: ${egData.generated[0]}`)
        await kv.set('evergreen:last_auto_publish', now.toString())
      } else if ((egData.message || '').includes('All evergreen')) {
        log.push('All evergreen articles already published')
        await kv.set('evergreen:last_auto_publish', now.toString())
      } else if (egData.errors?.length > 0) {
        log.push(`Evergreen error: ${egData.errors[0]}`)
      } else {
        log.push(`Evergreen skipped: ${egData.skipped?.[0] || 'none pending'}`)
      }
    } catch (err) {
      log.push(`Evergreen failed: ${(err as Error).message}`)
    }
  } else {
    const nextEg = Math.round((TWENTY_FOUR_H - (now - lastEvergreen)) / 3_600_000)
    log.push(`Evergreen: next auto-publish in ${nextEg}h`)
  }

  await kv.set('seo:cron_log', JSON.stringify({ log, ts: now }))

  return NextResponse.json({ ok: true, fullRefresh: true, log })
}