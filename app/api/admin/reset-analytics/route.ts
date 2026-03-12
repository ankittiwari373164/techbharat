// app/api/admin/reset-analytics/route.ts
// One-time use: clears inflated analytics data from UptimeRobot/bot traffic
// DELETE after use!
import { NextRequest, NextResponse } from 'next/server'
import { Redis } from '@upstash/redis'

export const dynamic = 'force-dynamic'
const kv = new Redis({ url: process.env.KV_REST_API_URL!, token: process.env.KV_REST_API_TOKEN! })

export async function GET(req: NextRequest) {
  const cookie = req.cookies.get('__tb_admin')?.value || ''
  if (!cookie.startsWith('TBOK:')) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const deleted: string[] = []

  // Clear all daily analytics keys (last 60 days)
  for (let i = 0; i < 60; i++) {
    const d = new Date(); d.setDate(d.getDate() - i)
    const key = d.toISOString().split('T')[0]
    for (const prefix of ['analytics:pv:', 'analytics:uv:', 'analytics:device:', 'analytics:source:']) {
      try { await kv.del(`${prefix}${key}`); deleted.push(`${prefix}${key}`) } catch { /* skip */ }
    }
  }

  // Clear top pages and live log (bot-inflated)
  await kv.del('analytics:top_pages').catch(() => {})
  await kv.del('analytics:live_log').catch(() => {})
  deleted.push('analytics:top_pages', 'analytics:live_log')

  return NextResponse.json({ ok: true, deleted: deleted.length, message: 'Analytics reset. Now delete this file!' })
}