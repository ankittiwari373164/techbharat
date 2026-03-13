import { NextRequest, NextResponse } from 'next/server'
import { getAllArticlesAsync, saveArticlesAsync } from '@/lib/store'

export const dynamic = 'force-dynamic'

const SITE_URL = process.env.SITE_URL || 'https://thetechbharat.com'

function proxyUrl(url: string): string {
  if (!url) return url
  if (url.includes('/api/img?') || !url.includes('unsplash.com')) return url
  return `${SITE_URL}/api/img?url=${encodeURIComponent(url)}`
}

function isBadImage(url: string): boolean {
  if (!url) return true
  // Catch ALL picsum variants: picsum.photos, fastly.picsum.photos, etc.
  if (url.includes('picsum')) return true
  if (url.includes('via.placeholder')) return true
  if (url.includes('placeholder.com')) return true
  return false
}

function getBrandQuery(brand: string): string {
  const n = (brand || '').toLowerCase()
  if (n.includes('apple') || n.includes('iphone')) return 'iphone,apple'
  if (n.includes('pixel') || n.includes('google')) return 'google,pixel,smartphone'
  if (n.includes('samsung')) return 'samsung,galaxy,smartphone'
  if (n.includes('oneplus')) return 'oneplus,smartphone'
  if (n.includes('xiaomi') || n.includes('redmi')) return 'xiaomi,smartphone'
  if (n.includes('realme')) return 'realme,smartphone'
  if (n.includes('poco')) return 'poco,smartphone'
  if (n.includes('oppo')) return 'oppo,smartphone'
  if (n.includes('iqoo')) return 'iqoo,smartphone'
  if (n.includes('motorola') || n.includes('moto')) return 'motorola,smartphone'
  if (n.includes('nothing')) return 'nothing,phone,smartphone'
  if (n.includes('vivo')) return 'vivo,smartphone'
  if (n.includes('samsung')) return 'samsung,smartphone'
  return 'smartphone,android'
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
      art.featuredImage = `https://source.unsplash.com/1600x900/?${getBrandQuery(art.brand)}`
      changed = true
    } else if (art.featuredImage?.includes('unsplash.com')) {
      art.featuredImage = proxyUrl(art.featuredImage)
      changed = true
    }

    // Fix images array
    if (Array.isArray(art.images)) {
      art.images = art.images.map((img: string) => {
        if (isBadImage(img)) { changed = true; return `https://source.unsplash.com/1600x900/?${getBrandQuery(art.brand)}` }
        if (img?.includes('unsplash.com')) { changed = true; return proxyUrl(img) }
        return img
      })
    }

    if (changed) fixed++
    return art
  })

  await saveArticlesAsync(updated)
  return NextResponse.json({ success: true, fixed, total: articles.length })
}