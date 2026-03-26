// app/api/img/route.ts
import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

const UNSPLASH_KEY = process.env.UNSPLASH_ACCESS_KEY || ''

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const url = searchParams.get('url')

  if (!url) {
    return new NextResponse('Missing url param', { status: 400 })
  }

  let targetUrl: string
  try {
    targetUrl = decodeURIComponent(url)
  } catch {
    return new NextResponse('Invalid url', { status: 400 })
  }

  // Only allow images.unsplash.com and plus.unsplash.com
  if (!targetUrl.includes('unsplash.com')) {
    return new NextResponse('Forbidden', { status: 403 })
  }

  try {
    const headers: Record<string, string> = {
      'Accept': 'image/*',
    }

    // Add Authorization for Unsplash API images
    if (UNSPLASH_KEY && targetUrl.includes('images.unsplash.com')) {
      headers['Authorization'] = `Client-ID ${UNSPLASH_KEY}`
    }

    const res = await fetch(targetUrl, {
      headers,
      // Follow redirects (Unsplash redirects to CDN)
      redirect: 'follow',
    })

    if (!res.ok) {
      return new NextResponse(`Upstream error: ${res.status}`, { status: res.status })
    }

    const contentType = res.headers.get('content-type') || 'image/jpeg'
    const buffer = await res.arrayBuffer()

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=86400, s-maxage=86400',
        'Access-Control-Allow-Origin': '*',
        'X-Robots-Tag': 'noindex',  // Don't index image proxy URLs as pages
      },
    })
  } catch (err) {
    console.error('img proxy error:', err)
    return new NextResponse('Proxy error', { status: 500 })
  }
}