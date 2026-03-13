import { NextRequest, NextResponse } from 'next/server'
import { getAllArticlesAsync, saveArticlesAsync } from '@/lib/store'
import { getLocalPhoneImages, getAllLocalImages } from '@/lib/phone-images'

export const dynamic = 'force-dynamic'

function isGoodImage(url: string): boolean {
  return !!url?.startsWith('/phone-images/')
}

// Pick next unused image from a pool, tracking globally used ones
function pickUnused(pool: string[], usedSet: Set<string>): string {
  // First try to find one not used at all
  for (const img of pool) {
    if (!usedSet.has(img)) {
      usedSet.add(img)
      return img
    }
  }
  // All used — find least-used by cycling (reset and start again)
  usedSet.clear()
  const img = pool[0]
  usedSet.add(img)
  return img
}

export async function POST(request: NextRequest) {
  const cookie = request.cookies.get('__tb_admin')?.value
  if (!cookie) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const { searchParams } = new URL(request.url)
  const forceAll = searchParams.get('force') === 'true'

  const articles = await getAllArticlesAsync()

  // Pre-load ALL images once
  const allImages = getAllLocalImages()
  if (allImages.length === 0) {
    return NextResponse.json({ error: 'No local images found in public/phone-images/' }, { status: 500 })
  }

  // Global set to track every image URL already assigned
  const usedImages = new Set<string>()

  // Pre-populate usedImages with already-good images so we don't reassign them
  if (!forceAll) {
    for (const a of articles) {
      const art = a as any
      if (isGoodImage(art.featuredImage)) usedImages.add(art.featuredImage)
      if (Array.isArray(art.images)) {
        art.images.forEach((img: string) => { if (isGoodImage(img)) usedImages.add(img) })
      }
    }
  }

  let fixed = 0
  const updated = articles.map(article => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const art = { ...article } as any
    let changed = false

    // Get brand-specific pool, fall back to all images
    const brandPool = getLocalPhoneImages(art.brand || 'Mobile')
    const pool = brandPool.length > 0 ? brandPool : allImages

    if (forceAll || !isGoodImage(art.featuredImage)) {
      art.featuredImage = pickUnused(pool, usedImages)
      changed = true
    }

    if (Array.isArray(art.images)) {
      art.images = art.images.map((img: string) => {
        if (forceAll || !isGoodImage(img)) {
          changed = true
          return pickUnused(pool, usedImages)
        }
        return img
      })
    }

    if (changed) fixed++
    return art
  })

  await saveArticlesAsync(updated)
  return NextResponse.json({ success: true, fixed, total: articles.length })
}