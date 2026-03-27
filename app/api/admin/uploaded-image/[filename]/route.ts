// app/api/admin/uploaded-image/[filename]/route.ts
// PUBLIC route — no auth needed, serves images to everyone
import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(
  req: NextRequest,
  { params }: { params: { filename: string } }
) {
  const { filename } = params
  if (!filename) return new NextResponse('Not found', { status: 404 })

  const safe = filename.replace(/[^a-zA-Z0-9._-]/g, '')
  if (safe !== filename) return new NextResponse('Invalid filename', { status: 400 })

  try {
    const redisUrl   = process.env.UPSTASH_REDIS_REST_URL   || process.env.KV_REST_API_URL
    const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN

    if (!redisUrl || !redisToken) {
      console.error('[uploaded-image] Redis env vars not set')
      return new NextResponse('Storage not configured', { status: 500 })
    }

    const { Redis } = await import('@upstash/redis')
    const redis = new Redis({ url: redisUrl, token: redisToken })

    const key = `tb:uploaded:${safe}`
    const stored = await redis.get<unknown>(key)

    if (!stored) {
      console.error(`[uploaded-image] Key not found: ${key}`)
      return new NextResponse('Image not found', { status: 404 })
    }

    // Upstash auto-parses JSON — handle both object and raw string
    let parsed: { data: string; type: string } | null = null

    if (typeof stored === 'string') {
      try {
        parsed = JSON.parse(stored)
      } catch {
        parsed = { data: stored, type: 'image/jpeg' }
      }
    } else if (typeof stored === 'object' && stored !== null) {
      parsed = stored as any
    }

    if (!parsed?.data) {
      console.error(`[uploaded-image] No data field for key ${key}, type: ${typeof stored}`)
      return new NextResponse('Image data missing', { status: 404 })
    }

    const buffer = Buffer.from(parsed.data, 'base64')

    if (buffer.length === 0) {
      return new NextResponse('Image corrupt — empty buffer', { status: 500 })
    }

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': parsed.type || 'image/jpeg',
        'Cache-Control': 'public, max-age=86400, stale-while-revalidate=604800',
        'Access-Control-Allow-Origin': '*',
        'X-Content-Type-Options': 'nosniff',
      },
    })
  } catch (e: any) {
    console.error('[uploaded-image] fatal error:', e?.message)
    return new NextResponse('Server error', { status: 500 })
  }
}