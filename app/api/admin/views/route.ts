import { NextResponse } from 'next/server'
import { Redis } from '@upstash/redis'

export const dynamic = 'force-dynamic'

function getKv() {
  return new Redis({
    url:   process.env.KV_REST_API_URL!,
    token: process.env.KV_REST_API_TOKEN!,
  })
}

export async function GET() {
  try {
    const kv   = getKv()
    const keys = await kv.keys('views:*')

    // Only total view keys (not daily breakdown)
    const totalKeys = keys.filter((k: string) => !k.startsWith('views:daily:'))

    if (totalKeys.length === 0) return NextResponse.json({ views: {} })

    const values = await Promise.all(totalKeys.map((k: string) => kv.get(k)))

    const views: Record<string, number> = {}
    totalKeys.forEach((k: string, i: number) => {
      const slug = k.replace('views:', '')
      views[slug] = Number(values[i]) || 0
    })

    return NextResponse.json({ views })
  } catch (e) {
    return NextResponse.json({ views: {}, error: String(e) })
  }
}