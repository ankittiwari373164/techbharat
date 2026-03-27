// app/api/admin/debug-image/route.ts
// Debug: check what's stored in Redis for a given filename
// Usage: GET /api/admin/debug-image?f=article-xxx-123.jpg

import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  const cookie = req.cookies.get('__tb_admin')?.value || ''
  if (!cookie.startsWith('TBOK:')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const filename = req.nextUrl.searchParams.get('f')

  try {
    const { Redis } = await import('@upstash/redis')
    const redis = Redis.fromEnv()

    if (filename) {
      // Check specific file
      const key = `tb:uploaded:${filename}`
      const stored = await redis.get<unknown>(key)

      if (!stored) {
        return NextResponse.json({ key, exists: false })
      }

      const typeofStored = typeof stored
      let dataPreview = null
      let dataLength = null
      let parsedOk = false

      if (typeofStored === 'object') {
        const obj = stored as any
        dataLength = obj?.data?.length || 0
        dataPreview = obj?.data?.substring(0, 30) || null
        parsedOk = !!obj?.data
      } else if (typeofStored === 'string') {
        try {
          const p = JSON.parse(stored as string)
          dataLength = p?.data?.length || 0
          dataPreview = p?.data?.substring(0, 30) || null
          parsedOk = !!p?.data
        } catch {
          dataPreview = 'NOT VALID JSON'
        }
      }

      return NextResponse.json({
        key,
        exists: true,
        typeofStored,
        parsedOk,
        dataLength,
        dataPreview,
        type: (stored as any)?.type || 'unknown',
      })
    }

    // No filename — list all uploaded image keys
    const { keys } = await redis.scan(0, { match: 'tb:uploaded:*', count: 100 })
    return NextResponse.json({ keys, count: keys.length })

  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}