// app/api/admin/fix-images/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getAllArticlesAsync, saveArticlesAsync } from '@/lib/store'

export const dynamic = 'force-dynamic'

const SITE_URL = process.env.SITE_URL || 'https://thetechbharat.com'

function isBadImage(url: string): boolean {
  if (!url) return true
  if (url.includes('picsum.photos')) return true
  if (url.includes('via.placeholder')) return true
  if (url.includes('placeholder.com')) return true
  return false
}

function proxyUrl(url: string): string {
  if (!url) return url
  if (url.includes('/api/img?url=')) return url
  // Fix old broken proxy param ?u= → ?url=
  if (url.includes('/api/img?u=')) return url.replace('/api/img?u=', '/api/img?url=')
  if (url.includes('unsplash.com')) return `${SITE_URL}/api/img?url=${encodeURIComponent(url)}`
  return url
}

// Simple keywords only — source.unsplash.com doesn't accept spaces/sentences
const BRAND_UNSPLASH: Record<string, string> = {
  samsung:   'samsung,smartphone',
  vivo:      'vivo,smartphone',
  apple:     'iphone,apple',
  iphone:    'iphone,apple',
  pixel:     'google,pixel,smartphone',
  google:    'google,pixel,smartphone',
  oneplus:   'oneplus,smartphone',
  xiaomi:    'xiaomi,smartphone',
  redmi:     'xiaomi,smartphone',
  realme:    'realme,smartphone',
  poco:      'poco,smartphone',
  oppo:      'oppo,smartphone',
  iqoo:      'iqoo,smartphone',
  motorola:  'motorola,smartphone',
  moto:      'motorola,smartphone',
  nothing:   'nothing,phone,smartphone',
}

function getFallbackImage(brand: string, index: number): string {
  const n = brand.toLowerCase()
  const fallbacks = ['smartphone', 'android', 'mobile', 'gadget', 'technology']
  for (const [key, kw] of Object.entries(BRAND_UNSPLASH)) {
    if (n.includes(key)) return `https://source.unsplash.com/1600x900/?${kw}`
  }
  return `https://source.unsplash.com/1600x900/?${fallbacks[index % fallbacks.length]},smartphone`
}

export async function POST(request: NextRequest) {
  const cookie = request.cookies.get('__tb_admin')?.value
  if (!cookie) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const articles = await getAllArticlesAsync()
  let fixed = 0

  const updated = articles.map(a => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const art = { ...a } as any
    let changed = false

    // Fix featured image
    if (isBadImage(art.featuredImage)) {
      art.featuredImage = getFallbackImage(art.brand || 'Mobile', 0)
      changed = true
    } else if (art.featuredImage?.includes('unsplash.com') || art.featuredImage?.includes('/api/img?u=')) {
      art.featuredImage = proxyUrl(art.featuredImage)
      changed = true
    }

    // Fix inline images array
    if (Array.isArray(art.images)) {
      art.images = art.images.map((img: string, i: number) => {
        if (isBadImage(img)) { changed = true; return getFallbackImage(art.brand || 'Mobile', i) }
        if (img?.includes('unsplash.com') || img?.includes('/api/img?u=')) { changed = true; return proxyUrl(img) }
        return img
      })
    }

    if (changed) fixed++
    return art
  })

  await saveArticlesAsync(updated)
  return NextResponse.json({ success: true, fixed, total: articles.length })
}