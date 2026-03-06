import { NextResponse } from 'next/server'
import { getScheduleStatus } from '@/lib/scheduler'
import { getAllArticlesAsync } from '@/lib/store'
import { nowIST } from '@/lib/scheduler'

const IS_VERCEL = !!process.env.KV_REST_API_URL

async function getPublishedTodayCount(): Promise<number> {
  const today = nowIST().toLocaleDateString('en-IN')
  if (IS_VERCEL) {
    try { const { Redis } = await import('@upstash/redis'); const kv = new Redis({ url: process.env.KV_REST_API_URL!, token: process.env.KV_REST_API_TOKEN! }); return (await kv.get<number>(`tb:counter:${today}`)) || 0 }
    catch { return 0 }
  } else {
    try {
      const fs = require('fs'), path = require('path')
      const FILE = path.join(process.cwd(), 'data', 'daily-counter.json')
      if (!fs.existsSync(FILE)) return 0
      const data = JSON.parse(fs.readFileSync(FILE, 'utf-8'))
      return data.date === today ? data.count : 0
    } catch { return 0 }
  }
}

export async function GET() {
  const publishedToday = await getPublishedTodayCount()
  const schedule       = getScheduleStatus(publishedToday)
  const articles       = await getAllArticlesAsync()
  const keys = {
    newsapi:   process.env.NEWSAPI_KEY         ? 'ok' : 'missing',
    gnews:     process.env.GNEWS_API_KEY       ? 'ok' : 'missing',
    anthropic: process.env.ANTHROPIC_API_KEY   ? 'ok' : 'missing',
    groq:      process.env.GROQ_API_KEY        ? 'ok' : 'missing',
    unsplash:  process.env.UNSPLASH_ACCESS_KEY ? 'ok' : 'missing',
  }
  return NextResponse.json({ keys, schedule, totalArticles: articles.length })
}