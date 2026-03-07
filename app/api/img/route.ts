import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'edge'

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get('u')
  if (!url) return new NextResponse('Missing url', { status: 400 })

  // Only allow known image hosts
  const allowed = ['images.unsplash.com', 'picsum.photos', 'source.unsplash.com', 'plus.unsplash.com']
  try {
    const parsed = new URL(url)
    if (!allowed.includes(parsed.hostname)) {
      return new NextResponse('Not allowed', { status: 403 })
    }
  } catch {
    return new NextResponse('Invalid url', { status: 400 })
  }

  const res = await fetch(url, { headers: { 'Accept': 'image/*' } })
  if (!res.ok) return new NextResponse('Fetch failed', { status: 502 })

  const contentType = res.headers.get('content-type') || 'image/jpeg'
  const buffer = await res.arrayBuffer()

  return new NextResponse(buffer, {
    headers: {
      'Content-Type': contentType,
      'Cache-Control': 'public, max-age=86400, s-maxage=604800',
      'CDN-Cache-Control': 'public, max-age=604800',
    },
  })
}