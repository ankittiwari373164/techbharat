import { NextRequest, NextResponse } from 'next/server'
import { getAllArticlesAsync, saveArticlesAsync } from '@/lib/store'
import { getPhoneImage } from '@/lib/phone-images'

export const dynamic = 'force-dynamic'

// Known good image URL patterns — if an image matches ANY of these, keep it
function isGoodImage(url: string): boolean {
  if (!url) return false
  // Local phone images — always good
  if (url.startsWith('/phone-images/')) return true
  // Properly proxied Unsplash via our own server — good
  if (url.includes('/api/img?url=')) return true
  return false
}

export async function POST(request: NextRequest) {
  const cookie = request.cookies.get('__tb_admin')?.value
  if (!cookie) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const articles = await getAllArticlesAsync()
  let fixed = 0
  const updated = []

  for (let i = 0; i < articles.length; i++) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const art = { ...articles[i] } as any
    let changed = false

    // Replace featuredImage unless it's already a known-good URL
    if (!isGoodImage(art.featuredImage)) {
      art.featuredImage = await getPhoneImage(art.brand || 'Mobile', i % 5)
      changed = true
    }

    // Replace all images in array unless already good
    if (Array.isArray(art.images)) {
      for (let j = 0; j < art.images.length; j++) {
        if (!isGoodImage(art.images[j])) {
          art.images[j] = await getPhoneImage(art.brand || 'Mobile', j)
          changed = true
        }
      }
    }

    if (changed) fixed++
    updated.push(art)
  }

  await saveArticlesAsync(updated)
  return NextResponse.json({ success: true, fixed, total: articles.length })
}