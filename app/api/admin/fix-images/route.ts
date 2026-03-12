// app/api/admin/fix-images/route.ts
// Scans all articles in Redis and replaces Picsum/bad images
// with local phone images (if available) or proper Unsplash images.
// GET /api/admin/fix-images        → dry run (shows what would change)
// GET /api/admin/fix-images?apply=1 → actually updates Redis

import { NextRequest, NextResponse } from 'next/server'
import { Redis } from '@upstash/redis'
import { getLocalPhoneImages, resolveBrandFolder, getPhoneImage } from '@/lib/phone-images'

export const dynamic = 'force-dynamic'

const kv = new Redis({
  url:   process.env.KV_REST_API_URL!,
  token: process.env.KV_REST_API_TOKEN!,
})

function isBadImage(url: string): boolean {
  if (!url) return true
  if (url.includes('picsum.photos'))    return true
  if (url.includes('placeholder'))      return true
  if (url.includes('via.placeholder')) return true
  // Keep Unsplash proxied images — they're fine
  return false
}

export async function GET(req: NextRequest) {
  const cookie = req.cookies.get('__tb_admin')?.value || ''
  if (!cookie.startsWith('TBOK:')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const apply = req.nextUrl.searchParams.get('apply') === '1'
  const slugList = await kv.lrange('article_index', 0, 199) as string[]

  const results: { slug: string; brand: string; old: string; new: string; hasLocal: boolean }[] = []
  let fixed = 0

  for (const slug of slugList) {
    try {
      const art = await kv.get(`article:${slug}`) as Record<string, unknown> | null
      if (!art) continue

      const brand = (art.brand as string) || 'Mobile'
      const currentImage = (art.featuredImage as string) || ''

      // Check if local images exist for this brand
      const localImages = getLocalPhoneImages(brand)
      const hasLocal = localImages.length > 0

      // Only fix if image is bad (Picsum etc.) OR if we have local images but aren't using them
      const needsFix = isBadImage(currentImage) ||
        (hasLocal && !currentImage.startsWith('/phone-images/'))

      if (!needsFix) continue

      // Get the best image for this brand
      const newImage = hasLocal
        ? localImages[fixed % localImages.length]   // cycle through local images
        : await getPhoneImage(brand, fixed % 5)

      results.push({
        slug,
        brand,
        old: currentImage.slice(0, 60),
        new: newImage,
        hasLocal,
      })

      if (apply) {
        // Update the article in Redis
        const updated = { ...art, featuredImage: newImage }
        // Also update images array first element
        if (Array.isArray(art.images) && art.images.length > 0) {
          (updated.images as string[])[0] = newImage
        }
        await kv.set(`article:${slug}`, JSON.stringify(updated))
        fixed++
      }

      // Small delay to avoid rate limiting Upstash
      if (!hasLocal) await new Promise(r => setTimeout(r, 100))

    } catch (e) {
      console.error(`fix-images: error on ${slug}:`, e)
    }
  }

  return NextResponse.json({
    mode:    apply ? 'APPLIED' : 'DRY RUN (add ?apply=1 to actually fix)',
    total:   slugList.length,
    needFix: results.length,
    fixed:   apply ? fixed : 0,
    results,
  })
}