// app/api/scheduler/route.ts
// ═══════════════════════════════════════════════════════════════
// Called by Vercel Cron every 30 minutes.
// Protected by CRON_SECRET — not accessible publicly.
//
// Logic:
//   1. Check if a slot is due (time has passed, slot not yet published)
//   2. If due → fetch + publish ONE article of the correct type
//   3. If not due → do nothing (next check in 30 min)
//   4. Tracks published count per day using file-based counter
// ═══════════════════════════════════════════════════════════════

import { NextRequest, NextResponse } from 'next/server'
import { fetchSingleArticle, buildArticles } from '@/lib/news-fetcher'
import { getAllArticles, addArticle, saveArticles } from '@/lib/store'
import { getNextDueSlot, isDuplicate, nowIST } from '@/lib/scheduler'
import fs from 'fs'
import path from 'path'

export const maxDuration = 300

const COUNTER_FILE = path.join(process.cwd(), 'data', 'daily-counter.json')

// ── Daily counter (file-based so it survives server restarts) ────
interface DailyCounter {
  date:  string   // "DD/MM/YYYY" IST
  count: number
}

function readCounter(): DailyCounter {
  try {
    const dir = path.join(process.cwd(), 'data')
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
    if (!fs.existsSync(COUNTER_FILE)) {
      const init = { date: getTodayIST(), count: 0 }
      fs.writeFileSync(COUNTER_FILE, JSON.stringify(init))
      return init
    }
    return JSON.parse(fs.readFileSync(COUNTER_FILE, 'utf-8')) as DailyCounter
  } catch {
    return { date: getTodayIST(), count: 0 }
  }
}

function writeCounter(c: DailyCounter) {
  try {
    const dir = path.join(process.cwd(), 'data')
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
    fs.writeFileSync(COUNTER_FILE, JSON.stringify(c))
  } catch { /* ignore */ }
}

function getTodayIST(): string {
  return nowIST().toLocaleDateString('en-IN') // "DD/MM/YYYY"
}

function getPublishedTodayCount(): number {
  const c = readCounter()
  if (c.date !== getTodayIST()) {
    // New day — reset
    writeCounter({ date: getTodayIST(), count: 0 })
    return 0
  }
  return c.count
}

function incrementCounter() {
  const today = getTodayIST()
  const c     = readCounter()
  if (c.date !== today) {
    writeCounter({ date: today, count: 1 })
  } else {
    writeCounter({ date: today, count: c.count + 1 })
  }
}

// ── Cron handler ─────────────────────────────────────────────────
let isRunning = false

export async function GET(request: NextRequest) {
  // Verify cron secret
  const secret = process.env.CRON_SECRET
  const authHeader = request.headers.get('authorization')

  if (secret && authHeader !== `Bearer ${secret}`) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  if (isRunning) {
    return NextResponse.json({ skipped: true, reason: 'Already running' })
  }

  const publishedToday = getPublishedTodayCount()

  // Check if we've hit today's limit
  if (publishedToday >= 5) {
    const n = nowIST()
    return NextResponse.json({
      skipped: true,
      reason:  `All 5 articles published today`,
      count:   publishedToday,
      istNow:  `${n.getHours()}:${n.getMinutes().toString().padStart(2,'0')} IST`,
    })
  }

  // Check if a slot is due
  const slot = getNextDueSlot(publishedToday)
  if (!slot) {
    const n = nowIST()
    const schedule = (await import('@/lib/scheduler')).getTodaySchedule()
    const next = schedule[publishedToday]
    return NextResponse.json({
      skipped:    true,
      reason:     'No slot due yet',
      nextSlot:   next?.label || 'Unknown',
      published:  publishedToday,
      istNow:     `${n.getHours()}:${n.getMinutes().toString().padStart(2,'0')} IST`,
    })
  }

  isRunning = true
  const existing = getAllArticles()

  try {
    console.log(`[Cron] Slot ${slot.index + 1}/5 due — type: ${slot.type} — ${slot.label}`)

    const rawItem = await fetchSingleArticle(slot.type, existing)

    if (!rawItem) {
      isRunning = false
      return NextResponse.json({
        success: false,
        reason:  'No suitable trending article found (all duplicates or fetch failed)',
        slot:    slot.label,
      })
    }

    const [article] = await buildArticles([rawItem])

    // Final duplicate guard
    if (isDuplicate(article.title, article.brand, existing)) {
      isRunning = false
      return NextResponse.json({ success: false, reason: 'Duplicate detected after rewrite', title: article.title })
    }

    addArticle(article)
    incrementCounter()
    isRunning = false

    console.log(`[Cron] Published slot ${slot.index + 1}: "${article.title.slice(0, 60)}"`)

    return NextResponse.json({
      success:   true,
      slot:      slot.index + 1,
      slotTime:  slot.label,
      type:      article.type,
      title:     article.title,
      slug:      article.slug,
      published: getPublishedTodayCount(),
    })

  } catch (err: unknown) {
    isRunning = false
    const e = err as Error
    console.error(`[Cron] Error: ${e.message}`)
    return NextResponse.json({ success: false, error: e.message }, { status: 500 })
  }
}