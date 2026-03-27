// app/api/admin/uploaded-image/[filename]/route.ts
// NO AUTH REQUIRED — this is a public image serving endpoint
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
    // Support both Upstash native names AND Vercel KV names (same service)
    const redisUrl   = process.env.UPSTASH_REDIS_REST_URL   || process.env.KV_REST_API_URL
    const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN

    if (!redisUrl || !redisToken) {
      console.error('[uploaded-image] Redis env vars not set')
      return new NextResponse('Redis not configured', { status: 500 })
    }

    const { Redis } = await import('@upstash/redis')
    // Use explicit constructor — NOT Redis.fromEnv() which requires UPSTASH_ prefix names
    const redis = new Redis({ url: redisUrl, token: redisToken })

    const key = `tb:uploaded:${safe}`
    const stored = await redis.get<unknown>(key)

    if (!stored) {
      console.error(`[uploaded-image] Key not found: ${key}`)
      return new NextResponse('Image not found', { status: 404 })
    }

    // Upstash auto-parses JSON objects; handle both object and string cases
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

  } catch (e: any) {
    console.error('[uploaded-image] error:', e?.message)
    return new NextResponse('Server error', { status: 500 })
  }
}