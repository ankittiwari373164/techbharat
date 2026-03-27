// app/api/admin/uploaded-image/[filename]/route.ts
import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(
  _req: NextRequest,
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
      return new NextResponse('Redis not configured', { status: 500 })
    }

    const { Redis } = await import('@upstash/redis')
    const redis = new Redis({ url: redisUrl, token: redisToken })

    const key = `tb:uploaded:${safe}`
    const stored = await redis.get<unknown>(key)

    if (!stored) {
      return new NextResponse('Image not found', { status: 404 })
    }

    // Upstash may return object or string depending on how it was stored
    const parsed: { data: string; type: string } =
      typeof stored === 'string' ? JSON.parse(stored) : (stored as any)

    if (!parsed?.data) {
      return new NextResponse('Image data missing', { status: 404 })
    }

    const buffer = Buffer.from(parsed.data, 'base64')

    if (buffer.length === 0) {
      return new NextResponse('Image corrupt', { status: 500 })
    }

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': parsed.type || 'image/jpeg',
        'Cache-Control': 'public, max-age=31536000',
        'Access-Control-Allow-Origin': '*',
        'X-Robots-Tag': 'noindex',
      },
    })
  } catch (e) {
    console.error('[uploaded-image] error:', e)
    return new NextResponse('Server error', { status: 500 })
  }
}