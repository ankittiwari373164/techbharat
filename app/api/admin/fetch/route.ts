import { NextRequest, NextResponse } from 'next/server'
import { fetchSingleArticle, buildArticles } from '@/lib/news-fetcher'
import { getAllArticlesAsync, addArticleAsync } from '@/lib/store'
import { isDuplicate } from '@/lib/scheduler'
import fs from 'fs'
import path from 'path'

const COUNTER_FILE = path.join(process.cwd(), 'data', 'daily-counter.json')
const IS_VERCEL    = !!process.env.KV_REST_API_URL

async function incrementCounter() {
  if (IS_VERCEL) {
    try {
      const { Redis } = await import('@upstash/redis'); const kv = new Redis({ url: process.env.KV_REST_API_URL!, token: process.env.KV_REST_API_TOKEN! })
      const today  = new Date().toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata' })
      const key    = `tb:counter:${today}`
      await kv.incr(key)
      await kv.expire(key, 86400 * 2) // expire after 2 days
    } catch { /**/ }
  } else {
    try {
      const dir   = path.join(process.cwd(), 'data')
      const today = new Date().toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata' })
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
      let data = { date: today, count: 0 }
      if (fs.existsSync(COUNTER_FILE)) {
        const existing = JSON.parse(fs.readFileSync(COUNTER_FILE, 'utf-8'))
        data = existing.date === today ? { ...existing, count: existing.count + 1 } : { date: today, count: 1 }
      }
      fs.writeFileSync(COUNTER_FILE, JSON.stringify(data))
    } catch { /**/ }
  }
}

let isFetching = false

export async function POST(request: NextRequest) {
  if (isFetching) return NextResponse.json({ success: false, error: 'Already fetching. Please wait.' }, { status: 429 })

  let body: { type?: string } = {}
  try { body = await request.json() } catch { /**/ }
  const articleType = (body.type || 'mobile-news') as 'mobile-news' | 'review' | 'compare'

  isFetching = true
  const log: string[] = []

  try {
    const existing = await getAllArticlesAsync()
    log.push(`Fetching 1 ${articleType} article...`)
    const rawItem = await fetchSingleArticle(articleType, existing)
    if (!rawItem) { isFetching = false; return NextResponse.json({ success: false, error: 'No trending article found', log }) }
    log.push(`Found: "${rawItem.title.slice(0,55)}..."`)
    log.push('Rewriting with AI...')
    const [article] = await buildArticles([rawItem])
    if (isDuplicate(article.title, article.brand, existing)) { isFetching = false; return NextResponse.json({ success: false, error: 'Duplicate — skipped', log }) }
    await addArticleAsync(article)
    await incrementCounter()
    log.push(`✓ Published!`)
    isFetching = false
    return NextResponse.json({ success: true, added: 1, article: { title: article.title, type: article.type, slug: article.slug }, log })
  } catch (err: unknown) {
    isFetching = false
    const e = err as Error
    log.push(`Error: ${e.message}`)
    return NextResponse.json({ success: false, error: e.message, log }, { status: 500 })
  }
}