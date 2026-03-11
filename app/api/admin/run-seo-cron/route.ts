// app/api/admin/run-seo-cron/route.ts
// Admin-only proxy — calls /api/seo-cron with the CRON_SECRET injected server-side.
// Authenticated via __tb_admin cookie (checked by middleware).
// The client never sees or sends the secret — it stays on the server.
import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const force   = searchParams.get('force') === '1'
  const secret  = process.env.CRON_SECRET || ''
  const siteUrl = process.env.SITE_URL || 'https://thetechbharat.com'

  try {
    const url = `${siteUrl}/api/seo-cron?secret=${encodeURIComponent(secret)}${force ? '&force=1' : ''}`
    const res  = await fetch(url, { method: 'GET' })
    const data = await res.json()
    return NextResponse.json(data)
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}