// app/api/admin/uploaded-image/[filename]/route.ts
// Serves uploaded images stored in Redis as base64

import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(
  _req: NextRequest,
  { params }: { params: { filename: string } }
) {
  const { filename } = params

  if (!filename) return new NextResponse('Not found', { status: 404 })

  try {
    const { Redis } = await import('@upstash/redis')
    const redis = Redis.fromEnv()

    const stored = await redis.get<string>(`tb:uploaded:${filename}`)
    if (!stored) return new NextResponse('Image not found', { status: 404 })

    const { data, type } = JSON.parse(stored)
    const buffer = Buffer.from(data, 'base64')

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': type || 'image/jpeg',
        'Cache-Control': 'public, max-age=31536000, immutable',
        'X-Robots-Tag': 'noindex',
      },
    })
  } catch (e) {
    console.error('Serve uploaded image error:', e)
    return new NextResponse('Error', { status: 500 })
  }
}