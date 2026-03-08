// lib/scheduler.ts
// ═══════════════════════════════════════════════════════════════════
// SMART SCHEDULER — 5 articles/day, 8AM–8PM IST
//
// HUMAN-LIKE TIMING:
//   • 5 slots spread between 08:00–20:00 IST
//   • Each slot has a ±15–45 min random jitter
//   • Gaps look organic: not every 2h 24m exactly
//   • Today's schedule is seeded from the date (consistent across restarts)
//
// CONTENT MIX per day (rotates to stay natural):
//   Day pattern cycles through:
//     3 mobile-news + 1 review + 1 compare
//     4 mobile-news + 1 review
//     3 mobile-news + 2 mobile-news (all news day)
//   Mix resets every 3 days
//
// DUPLICATE PREVENTION:
//   • Stores title fingerprints (normalised lowercase, punctuation stripped)
//   • Stores topic hashes (brand + key noun)
//   • 7-day rolling window — same topic won't repeat within a week
// ═══════════════════════════════════════════════════════════════════

export type ArticleType = 'mobile-news' | 'review' | 'compare'

// ── IST HELPERS ──────────────────────────────────────────────────
/** Get current time as IST Date object */
export function nowIST(): Date {
  return new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }))
}

/** Parse "HH:MM" into today's IST Date */
export function istTime(hhmm: string): Date {
  const [h, m] = hhmm.split(':').map(Number)
  const d = nowIST()
  d.setHours(h, m, 0, 0)
  return d
}

// ── SEEDED RANDOM (deterministic per day) ────────────────────────
function seededRandom(seed: number): () => number {
  let s = seed
  return () => {
    s = (s * 1664525 + 1013904223) & 0xffffffff
    return (s >>> 0) / 0xffffffff
  }
}

function dateSeed(): number {
  const d = nowIST()
  return d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate()
}

// ── SCHEDULE GENERATOR ────────────────────────────────────────────
export interface ScheduleSlot {
  index:     number        // 0–4
  type:      ArticleType
  publishAt: Date          // exact IST publish time (UTC-stored)
  label:     string        // "08:47 IST" for display
}

/**
 * Generate today's 5-slot schedule.
 * Base times: 08:30, 10:45, 13:15, 16:00, 18:30 IST
 * Jitter: ±0–38 minutes per slot, seeded from today's date
 */
export function getTodaySchedule(): ScheduleSlot[] {
  const rand  = seededRandom(dateSeed())
  const bases = [
    { h: 8,  m: 30 },
    { h: 10, m: 45 },
    { h: 13, m: 15 },
    { h: 16, m: 0  },
    { h: 18, m: 30 },
  ]

  // Content mix: cycles every 3 days
  const day = nowIST().getDate()
  const mixCycle = day % 3
  // Discover-optimal mix: 2 news + 1 compare + 1 review + 1 news (per ChatGPT audit)
  const typeMix: ArticleType[][] = [
    ['mobile-news', 'mobile-news', 'compare',     'review',      'mobile-news'],
    ['mobile-news', 'compare',     'mobile-news', 'review',      'mobile-news'],
    ['mobile-news', 'mobile-news', 'review',      'compare',     'mobile-news'],
  ]
  const types = typeMix[mixCycle]

  return bases.map((base, i) => {
    // Jitter: between -8 and +38 minutes (skewed positive — people publish slightly late)
    const jitter = Math.floor(rand() * 46) - 8

    const d = nowIST()
    d.setHours(base.h, base.m + jitter, Math.floor(rand() * 59), 0)

    // Clamp: never before 08:00 or after 19:55
    const minMs = istTime('08:00').getTime()
    const maxMs = istTime('19:55').getTime()
    const clamped = new Date(Math.min(Math.max(d.getTime(), minMs), maxMs))

    const hh = clamped.getHours().toString().padStart(2, '0')
    const mm = clamped.getMinutes().toString().padStart(2, '0')

    return {
      index:     i,
      type:      types[i],
      publishAt: clamped,
      label:     `${hh}:${mm} IST`,
    }
  })
}

/**
 * Returns the NEXT slot that hasn't published yet today.
 * Returns null if all 5 slots are done for today.
 */
export function getNextDueSlot(publishedTodayCount: number): ScheduleSlot | null {
  const schedule = getTodaySchedule()
  const now = nowIST().getTime()

  // Find slots that are due (time has passed) but not yet published
  const due = schedule
    .filter((_, i) => i >= publishedTodayCount) // not yet published
    .find(slot => slot.publishAt.getTime() <= now)

  return due || null
}

/**
 * Returns ms until the next unpublished slot.
 * Used by the cron to know when to check again.
 */
export function msUntilNextSlot(publishedTodayCount: number): number {
  if (publishedTodayCount >= 5) {
    // All done today — next check at 08:00 tomorrow
    const tomorrow = nowIST()
    tomorrow.setDate(tomorrow.getDate() + 1)
    tomorrow.setHours(8, 0, 0, 0)
    return tomorrow.getTime() - nowIST().getTime()
  }

  const schedule = getTodaySchedule()
  const pending  = schedule.filter((_, i) => i >= publishedTodayCount)
  if (pending.length === 0) return 24 * 60 * 60 * 1000

  const nextTime = pending[0].publishAt.getTime()
  const now      = nowIST().getTime()
  return Math.max(0, nextTime - now)
}

// ── DUPLICATE DETECTION ───────────────────────────────────────────
/** Normalise a title to a fingerprint for dedup */
export function titleFingerprint(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .split(' ')
    .slice(0, 6) // first 6 meaningful words
    .join(' ')
}

/** Extract topic key: brand + first model-like word */
export function topicKey(title: string, brand: string): string {
  const t = title.toLowerCase().replace(/[^a-z0-9\s]/g, ' ')
  const words = t.split(/\s+/).filter(w => w.length > 2 && w !== brand.toLowerCase())
  const modelWord = words.find(w => /\d/.test(w) || w.length > 4) || words[0] || ''
  return `${brand.toLowerCase()}-${modelWord}`
}

/**
 * Check if an article would be a duplicate.
 * Compares against existing articles from the last 7 days.
 */
export function isDuplicate(
  title: string,
  brand: string,
  existingArticles: { title: string; brand: string; publishDate: string }[]
): boolean {
  const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000
  const recent = existingArticles.filter(a => new Date(a.publishDate).getTime() > sevenDaysAgo)

  const newFP    = titleFingerprint(title)
  const newTopic = topicKey(title, brand)

  for (const a of recent) {
    // Exact fingerprint match
    if (titleFingerprint(a.title) === newFP) return true

    // Same brand + topic within 7 days
    if (topicKey(a.title, a.brand) === newTopic) return true

    // 60%+ word overlap (fuzzy duplicate)
    const existWords = new Set(titleFingerprint(a.title).split(' '))
    const newWords   = newFP.split(' ')
    const overlap    = newWords.filter(w => existWords.has(w)).length
    if (overlap / newWords.length > 0.6) return true
  }

  return false
}

// ── SCHEDULE STATUS ───────────────────────────────────────────────
export interface ScheduleStatus {
  todaySlots:       ScheduleSlot[]
  publishedToday:   number
  nextSlot:         ScheduleSlot | null
  nextSlotInMs:     number
  nextSlotLabel:    string
  allDoneToday:     boolean
  istNow:           string
}

export function getScheduleStatus(publishedTodayCount: number): ScheduleStatus {
  const todaySlots   = getTodaySchedule()
  const nextSlot     = getNextDueSlot(publishedTodayCount)
  const nextSlotInMs = msUntilNextSlot(publishedTodayCount)
  const allDoneToday = publishedTodayCount >= 5

  const n   = nowIST()
  const hh  = n.getHours().toString().padStart(2,'0')
  const mm  = n.getMinutes().toString().padStart(2,'0')

  let nextSlotLabel = 'All done for today'
  if (!allDoneToday && publishedTodayCount < todaySlots.length) {
    nextSlotLabel = todaySlots[publishedTodayCount]?.label || 'Soon'
  }

  return {
    todaySlots,
    publishedToday: publishedTodayCount,
    nextSlot,
    nextSlotInMs,
    nextSlotLabel,
    allDoneToday,
    istNow: `${hh}:${mm} IST`,
  }
}