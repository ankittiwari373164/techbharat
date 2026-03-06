import { NextRequest, NextResponse } from 'next/server'
import { fetchSingleArticle, buildArticles } from '@/lib/news-fetcher'
import { getAllArticlesAsync, addArticleAsync } from '@/lib/store'
import { getNextDueSlot, isDuplicate, nowIST, getTodaySchedule } from '@/lib/scheduler'

export const maxDuration = 300

const IS_VERCEL = !!process.env.KV_REST_API_URL

async function getPublishedTodayCount(): Promise<number> {
  const today = nowIST().toLocaleDateString('en-IN')
  if (IS_VERCEL) {
    try {
      const { Redis } = await import('@upstash/redis'); const kv = new Redis({ url: process.env.KV_REST_API_URL!, token: process.env.KV_REST_API_TOKEN! })
      return (await kv.get<number>(`tb:counter:${today}`)) || 0
    } catch { return 0 }
  } else {
    try {
      const fs   = require('fs')
      const path = require('path')
      const FILE = path.join(process.cwd(), 'data', 'daily-counter.json')
      if (!fs.existsSync(FILE)) return 0
      const data = JSON.parse(fs.readFileSync(FILE, 'utf-8'))
      return data.date === today ? data.count : 0
    } catch { return 0 }
  }
}

async function incrementCounter(): Promise<void> {
  const today = nowIST().toLocaleDateString('en-IN')
  if (IS_VERCEL) {
    try {
      const { Redis } = await import('@upstash/redis'); const kv = new Redis({ url: process.env.KV_REST_API_URL!, token: process.env.KV_REST_API_TOKEN! })
      const key = `tb:counter:${today}`
      await kv.incr(key)
      await kv.expire(key, 86400 * 2)
    } catch { /**/ }
  } else {
    try {
      const fs   = require('fs')
      const path = require('path')
      const FILE = path.join(process.cwd(), 'data', 'daily-counter.json')
      const dir  = path.join(process.cwd(), 'data')
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
      let data = { date: today, count: 0 }
      if (fs.existsSync(FILE)) {
        const existing = JSON.parse(fs.readFileSync(FILE, 'utf-8'))
        data = existing.date === today ? { ...existing, count: existing.count + 1 } : { date: today, count: 1 }
      }
      fs.writeFileSync(FILE, JSON.stringify(data))
    } catch { /**/ }
  }
}

let isRunning = false

export async function GET(request: NextRequest) {
  const secret = process.env.CRON_SECRET
  if (secret && request.headers.get('authorization') !== `Bearer ${secret}`) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }
  if (isRunning) return NextResponse.json({ skipped: true, reason: 'Already running' })

  const publishedToday = await getPublishedTodayCount()
  if (publishedToday >= 5) return NextResponse.json({ skipped: true, reason: 'All 5 done today', count: publishedToday })

  const slot = getNextDueSlot(publishedToday)
  if (!slot) {
    const schedule = getTodaySchedule()
    return NextResponse.json({ skipped: true, reason: 'No slot due yet', nextSlot: schedule[publishedToday]?.label || 'Unknown' })
  }

  isRunning = true
  try {
    const existing = await getAllArticlesAsync()
    const rawItem  = await fetchSingleArticle(slot.type, existing)
    if (!rawItem) { isRunning = false; return NextResponse.json({ success: false, reason: 'No article found' }) }
    const [article] = await buildArticles([rawItem])
    if (isDuplicate(article.title, article.brand, existing)) { isRunning = false; return NextResponse.json({ success: false, reason: 'Duplicate' }) }
    await addArticleAsync(article)
    await incrementCounter()
    isRunning = false
    return NextResponse.json({ success: true, slot: slot.index + 1, type: article.type, title: article.title, slug: article.slug })
  } catch (err: unknown) {
    isRunning = false
    return NextResponse.json({ success: false, error: (err as Error).message }, { status: 500 })
  }
}