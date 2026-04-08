// app/api/image/[id]/route.ts
// Clean image proxy — serves Unsplash images through your own domain
// URL shown to user: https://thetechbharat.com/api/image/abc123XYZ
// Unsplash URL is NEVER exposed to the browser

import { NextRequest, NextResponse } from 'next/server'

const UNSPLASH_ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY || ''

// Redis key prefix for storing Unsplash URL by ID
// Key: tb:img:{unsplashId}  →  Value: "https://images.unsplash.com/photo-abc?..."
const IMG_KEY_PREFIX = 'tb:img:'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params

  if (!id) {
    return new NextResponse('Missing image ID', { status: 400 })
  }

  let imageUrl = ''

  // 1. Look up the Unsplash URL stored in Redis for this ID
  try {
    const { Redis } = await import('@upstash/redis')
    const redis = Redis.fromEnv()
    const stored = await redis.get<string>(`${IMG_KEY_PREFIX}${id}`)
    if (stored) imageUrl = stored
  } catch {
    // Redis unavailable
  }

  // 2. If not in Redis, fetch fresh from Unsplash API by ID
  if (!imageUrl) {
    // Try direct Unsplash URL first (photos/{id} endpoint gives us the URL)
    if (UNSPLASH_ACCESS_KEY) {
      try {
        const res = await fetch(`https://api.unsplash.com/photos/${id}`, {
          headers: { Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}` },
          signal: AbortSignal.timeout(5000),
        })
        if (res.ok) {
          const data = await res.json()
          // Try regular first, then full, then small
          imageUrl = data.urls?.regular || data.urls?.full || data.urls?.small || ''
          // Save back to Redis for next time
          if (imageUrl) {
            try {
              const { Redis } = await import('@upstash/redis')
              const redis = Redis.fromEnv()
              await redis.set(`${IMG_KEY_PREFIX}${id}`, imageUrl, { ex: 60 * 60 * 24 * 365 })
            } catch { /* non-fatal */ }
          }
        }
      } catch { /* fall through */ }
    }

    // Also try direct Unsplash CDN URL construction as last resort
    if (!imageUrl) {
      // Unsplash photo IDs map directly to their CDN
      imageUrl = `https://images.unsplash.com/photo-${id}?w=1200&q=80`
    }
  }

  if (!imageUrl) {
    // Fallback to site OG image rather than broken image
    return NextResponse.redirect('https://thetechbharat.com/og-image.jpg', { status: 302 })
  }

  // 3. Fetch the actual image server-side (Unsplash URL never reaches the browser)
  try {
    const imgRes = await fetch(imageUrl, {
      headers: {
        'Accept': 'image/*',
        // Add Authorization for images.unsplash.com domain
        ...(imageUrl.includes('unsplash.com') && UNSPLASH_ACCESS_KEY
          ? { 'Authorization': `Client-ID ${UNSPLASH_ACCESS_KEY}` }
          : {}),
      },
    })

    if (!imgRes.ok) {
      // Unsplash URL may have expired — try fetching fresh from Unsplash API
      if (UNSPLASH_ACCESS_KEY) {
        try {
          const refreshRes = await fetch(`https://api.unsplash.com/photos/${id}`, {
            headers: { Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}` },
          })
          if (refreshRes.ok) {
            const data = await refreshRes.json()
            const freshUrl = data.urls?.regular || ''
            if (freshUrl) {
              // Update Redis with fresh URL
              try {
                const { Redis } = await import('@upstash/redis')
                const redis = Redis.fromEnv()
                await redis.set(`${IMG_KEY_PREFIX}${id}`, freshUrl, { ex: 60 * 60 * 24 * 365 })
              } catch { /* non-fatal */ }
              // Redirect to fresh URL via our own proxy (recursive but correct)
              return NextResponse.redirect(`https://thetechbharat.com/api/image/${id}`, { status: 302 })
            }
          }
        } catch { /* fall through to fallback */ }
      }
      return NextResponse.redirect('https://thetechbharat.com/og-image.jpg', { status: 302 })
    }

    const contentType = imgRes.headers.get('content-type') || 'image/jpeg'
    const buffer = await imgRes.arrayBuffer()

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        // Cache aggressively — image content never changes for a given ID
        'Cache-Control': 'public, max-age=2592000, s-maxage=2592000, immutable',
        'CDN-Cache-Control': 'public, max-age=2592000',
        'Referrer-Policy': 'no-referrer',
        'X-Robots-Tag': 'noindex',  // Prevent /api/image/* from appearing in GSC as pages
      },
    })
  } catch {
    return NextResponse.redirect('https://thetechbharat.com/og-image.jpg', { status: 302 })
  }
}