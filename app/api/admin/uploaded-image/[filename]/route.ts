// app/api/admin/uploaded-image/[filename]/route.ts
// Serves uploaded images stored in Redis as base64
// PUBLIC route — no auth required (images are referenced by unguessable filenames)

import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(
  _req: NextRequest,
  { params }: { params: { filename: string } }
) {
  const { filename } = params

  if (!filename) return new NextResponse('Not found', { status: 404 })

  // Sanitize filename — no path traversal
  const safe = filename.replace(/[^a-zA-Z0-9._-]/g, '')
  if (safe !== filename) return new NextResponse('Invalid filename', { status: 400 })

  try {
    const { Redis } = await import('@upstash/redis')
    const redis = Redis.fromEnv()

    // Try exact key first
    const key = `tb:uploaded:${safe}`
    const stored = await redis.get<unknown>(key)

    if (!stored) {
      console.error(`[uploaded-image] Key not found in Redis: ${key}`)
      return new NextResponse('Image not found', { status: 404 })
    }

    // Upstash auto-parses JSON — handle both object and string
    const parsed: { data: string; type: string } =
      typeof stored === 'string' ? JSON.parse(stored) : (stored as { data: string; type: string })

    if (!parsed?.data) {
      console.error(`[uploaded-image] No data field in stored value for key: ${key}`)
      return new NextResponse('Image data missing', { status: 404 })
    }

    const buffer = Buffer.from(parsed.data, 'base64')

    if (buffer.length === 0) {
      console.error(`[uploaded-image] Buffer is empty after base64 decode for key: ${key}`)
      return new NextResponse('Image corrupt', { status: 500 })
    }

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': parsed.type || 'image/jpeg',
        // Cache for 1 year but allow revalidation — works across all browsers/devices
        'Cache-Control': 'public, max-age=31536000',
        // Allow cross-origin image loading (needed for og:image, etc.)
        'Access-Control-Allow-Origin': '*',
        'X-Robots-Tag': 'noindex',
      },
    })
  } catch (e) {
    console.error('[uploaded-image] Serve error:', e)
    return new NextResponse('Server error', { status: 500 })
  }
}