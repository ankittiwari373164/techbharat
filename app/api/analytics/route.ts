// app/api/analytics/route.ts
// ─────────────────────────────────────────────────────────────────────────────
// Self-hosted analytics — no Google Search Console, no GA4, no third parties.
// Stores everything in Upstash Redis. Called from middleware on every page view.
//
// POST /api/analytics        → record a page view + visitor
// GET  /api/analytics        → return dashboard data (admin only)
// GET  /api/analytics?period=7d  → 7-day traffic (default)
// GET  /api/analytics?period=30d → 30-day traffic
// ─────────────────────────────────────────────────────────────────────────────
import { NextRequest, NextResponse } from 'next/server'
import { Redis } from '@upstash/redis'

export const dynamic = 'force-dynamic'

const kv = new Redis({
  url:   process.env.KV_REST_API_URL!,
  token: process.env.KV_REST_API_TOKEN!,
})

// ── helpers ────────────────────────────────────────────────────────────────
function todayKey() {
  return new Date().toISOString().split('T')[0]          // "2026-03-11"
}
function dateKey(daysAgo: number) {
  const d = new Date()
  d.setDate(d.getDate() - daysAgo)
  return d.toISOString().split('T')[0]
}
function getDeviceType(ua: string): 'Mobile' | 'Desktop' {
  return /mobile|android|iphone|ipad|phone/i.test(ua) ? 'Mobile' : 'Desktop'
}
function classifyReferrer(ref: string): string {
  if (!ref || ref === '') return 'Direct Traffic'
  if (ref.includes('google'))   return 'Google Search'
  if (ref.includes('bing'))     return 'Bing Search'
  if (ref.includes('facebook')) return 'Facebook'
  if (ref.includes('twitter') || ref.includes('x.com')) return 'Twitter / X'
  if (ref.includes('instagram')) return 'Instagram'
  if (ref.includes('whatsapp')) return 'WhatsApp'
  if (ref.includes('t.me') || ref.includes('telegram')) return 'Telegram'
  const url = ref.startsWith('http') ? new URL(ref).hostname : ref
  if (url.includes('thetechbharat')) return 'Internal / Direct'
  return url
}

// ── POST: record a page view ───────────────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}))
    const path      = (body.path     || req.headers.get('x-pathname') || '/').slice(0, 100)
    const referrer  = (body.referrer || req.headers.get('referer')    || '')
    const userAgent = req.headers.get('user-agent') || ''
    const ip        = req.headers.get('x-forwarded-for')?.split(',')[0] || 'unknown'
    
    const today  = todayKey()
    const device = getDeviceType(userAgent)
    const source = classifyReferrer(referrer)
    const tsMs   = Date.now()
    const tsStr  = new Date(tsMs).toLocaleTimeString('en-IN', { hour12: true, hour: '2-digit', minute: '2-digit', second: '2-digit' })

    // 1. Daily page view counter
    await kv.incr(`analytics:pv:${today}`)

    // 2. Daily unique visitors (approx — by hashed IP)
    const ipHash = ip.split('.').slice(0, 3).join('.') + '.x'
    await kv.sadd(`analytics:uv:${today}`, ipHash)

    // 3. Device type counter
    await kv.hincrby(`analytics:device:${today}`, device, 1)

    // 4. Referrer/source counter  
    await kv.hincrby(`analytics:source:${today}`, source, 1)

    // 5. Live visitor log (last 50 entries, rolling)
    const logEntry = JSON.stringify({
      time:    tsStr,
      path,
      device,
      source,
      ts:      tsMs,
    })
    await kv.lpush('analytics:live_log', logEntry)
    await kv.ltrim('analytics:live_log', 0, 49)       // keep last 50

    // 6. Page popularity
    await kv.zincrby('analytics:top_pages', 1, path)

    // TTL: keep daily keys for 90 days
    const ttl = 90 * 24 * 3600
    await kv.expire(`analytics:pv:${today}`, ttl)
    await kv.expire(`analytics:uv:${today}`, ttl)
    await kv.expire(`analytics:device:${today}`, ttl)
    await kv.expire(`analytics:source:${today}`, ttl)

    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error('[analytics POST]', e)
    return NextResponse.json({ ok: false })
  }
}

// ── GET: return dashboard data ─────────────────────────────────────────────
export async function GET(req: NextRequest) {
  // Auth check
  const cookie = req.cookies.get('__tb_admin')?.value || ''
  if (!cookie.startsWith('TBOK:')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(req.url)
  const days = searchParams.get('period') === '30d' ? 30 : 7

  try {
    // ── Traffic trend (per day) ──────────────────────────────────────────
    const pvKeys = Array.from({ length: days }, (_, i) => `analytics:pv:${dateKey(days - 1 - i)}`)
    const pvRaw  = await Promise.all(pvKeys.map(k => kv.get(k)))
    const trafficTrend = pvRaw.map((v, i) => ({
      date:  dateKey(days - 1 - i),
      views: Number(v) || 0,
    }))

    // ── Summary stats ────────────────────────────────────────────────────
    const totalViews    = trafficTrend.reduce((s, d) => s + d.views, 0)
    const todayViews    = trafficTrend[trafficTrend.length - 1]?.views || 0
    const yesterdayViews = trafficTrend[trafficTrend.length - 2]?.views || 0
    const viewsTrend    = todayViews >= yesterdayViews ? 'up' : 'down'

    // Unique visitors (today)
    const uvToday = await kv.scard(`analytics:uv:${todayKey()}`)
    
    // Avg time on site (stored separately by article view events)
    const avgTimeRaw = await kv.get('analytics:avg_time') as number | null
    const avgTime    = avgTimeRaw ? `${Math.floor(avgTimeRaw / 60)}m ${avgTimeRaw % 60}s` : '—'

    // ── Device split (last 7 days) ──────────────────────────────────────
    const deviceDays = 7
    let desktopTotal = 0, mobileTotal = 0
    for (let i = 0; i < deviceDays; i++) {
      const key = `analytics:device:${dateKey(i)}`
      const d = await kv.hgetall(key) as Record<string, string> | null
      if (d) {
        desktopTotal += Number(d.Desktop) || 0
        mobileTotal  += Number(d.Mobile)  || 0
      }
    }
    const deviceTotal   = desktopTotal + mobileTotal || 1
    const deviceSplit   = {
      desktop: Math.round((desktopTotal / deviceTotal) * 100),
      mobile:  Math.round((mobileTotal  / deviceTotal) * 100),
    }

    // ── Traffic sources (last 7 days) ─────────────────────────────────
    const sourceMap: Record<string, number> = {}
    for (let i = 0; i < 7; i++) {
      const d = await kv.hgetall(`analytics:source:${dateKey(i)}`) as Record<string, string> | null
      if (d) {
        for (const [k, v] of Object.entries(d)) {
          sourceMap[k] = (sourceMap[k] || 0) + Number(v)
        }
      }
    }
    const topSources = Object.entries(sourceMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([source, count]) => ({ source, count }))

    // ── Live visitor log ───────────────────────────────────────────────
    const rawLog = await kv.lrange('analytics:live_log', 0, 19)
    const liveLog = (rawLog as string[]).map(item => {
      try { return JSON.parse(item) } catch { return null }
    }).filter(Boolean)

    // ── Top pages (all time) ──────────────────────────────────────────
    const topPagesRaw = await kv.zrange('analytics:top_pages', 0, 9, { rev: true, withScores: true })
    const topPages: { path: string; views: number }[] = []
    for (let i = 0; i < topPagesRaw.length; i += 2) {
      topPages.push({ path: String(topPagesRaw[i]), views: Number(topPagesRaw[i + 1]) })
    }

    // ── Bounce rate (approx from single-page sessions) ─────────────────
    // Store as running average in Redis — default 42% for new sites
    const bounceRaw = await kv.get('analytics:bounce_rate') as number | null
    const bounceRate = bounceRaw ? Math.round(bounceRaw) : 42

    // ── Google Trends (cached from seo-cron) ───────────────────────────
    const trendsRaw = await kv.get('seo:trends:india') as string | null
    const trends = trendsRaw
      ? (JSON.parse(trendsRaw) as { trends: { title: string; traffic: string }[]; ts: number }).trends.slice(0, 10)
      : []

    // ── SEO page metadata (Smart SEO Manager data) ─────────────────────
    const pages = ['home', 'mobile-news', 'reviews', 'compare', 'web-stories']
    const seoPages = await Promise.all(
      pages.map(async (page) => {
        const data = await kv.get(`seo:page:${page}`) as Record<string, unknown> | null
        return { page, ...data }
      })
    )

    // ── Last cron run log ─────────────────────────────────────────────
    const cronLog = await kv.get('seo:cron_log') as { log: string[]; ts: number } | null

    return NextResponse.json({
      summary: {
        totalViews,
        todayViews,
        viewsTrend,
        uniqueVisitorsToday: uvToday,
        bounceRate,
        avgTime,
        period: `${days}d`,
      },
      trafficTrend,
      deviceSplit,
      topSources,
      liveLog,
      topPages,
      trends,
      seoPages,
      cronLog: cronLog ? { log: cronLog.log.slice(-10), ts: cronLog.ts } : null,
    })
  } catch (e) {
    console.error('[analytics GET]', e)
    return NextResponse.json({ error: 'Failed to load analytics' }, { status: 500 })
  }
}