import { NextRequest, NextResponse } from 'next/server'
import { getAllArticlesAsync, saveArticlesAsync } from '@/lib/store'
import { getPhoneImage, getLocalPhoneImages } from '@/lib/phone-images'

export const dynamic = 'force-dynamic'

function isGoodImage(url: string): boolean {
  if (!url) return false
  if (url.startsWith('/phone-images/')) return true
  if (url.includes('images.unsplash.com') && !url.includes('/api/img?')) {
    return (url.match(/[?&]w=/g) || []).length <= 1 &&
           (url.match(/[?&]q=/g) || []).length <= 1
  }
  return false
}

export async function POST(request: NextRequest) {
  const cookie = request.cookies.get('__tb_admin')?.value
  if (!cookie) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const { searchParams } = new URL(request.url)
  const forceAll = searchParams.get('force') === 'true'

  const articles = await getAllArticlesAsync()
  let fixed = 0

  // Track per-brand counters so each article gets a DIFFERENT image
  const brandCounters: Record<string, number> = {}

  const updated = []

  for (const article of articles) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const art = { ...article } as any
    let changed = false

    const brand = (art.brand || 'Mobile').toLowerCase()

    // Initialize counter for this brand
    if (brandCounters[brand] === undefined) brandCounters[brand] = 0

    if (forceAll || !isGoodImage(art.featuredImage)) {
      const localImages = getLocalPhoneImages(art.brand || 'Mobile')
      const totalLocal = localImages.length

      let imageIndex: number
      if (totalLocal > 0) {
        // Cycle through all local images — each article gets different one
        imageIndex = brandCounters[brand] % totalLocal
      } else {
        // For Unsplash: use counter directly (getPhoneImage handles the pool)
        imageIndex = brandCounters[brand]
      }

      art.featuredImage = await getPhoneImage(art.brand || 'Mobile', imageIndex)
      brandCounters[brand]++
      changed = true
    }

    if (Array.isArray(art.images)) {
      for (let j = 0; j < art.images.length; j++) {
        if (forceAll || !isGoodImage(art.images[j])) {
          // inline images: use brand counter + offset so they differ from featured too
          const imgIndex = (brandCounters[brand] + j) % 20
          art.images[j] = await getPhoneImage(art.brand || 'Mobile', imgIndex)
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