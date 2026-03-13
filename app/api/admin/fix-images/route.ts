// app/api/admin/fix-images/route.ts
// POST → fixes all articles: replaces Picsum + bad images with Unsplash (proxied correctly)
// Same pattern as the working fix-images route, just extended to also handle Picsum

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
  // Already proxied correctly
  if (url.includes('/api/img?url=')) return url
  // Fix old broken proxy param (?u= → ?url=)
  if (url.includes('/api/img?u=')) {
    return url.replace('/api/img?u=', '/api/img?url=')
  }
  // Raw unsplash URL — wrap in proxy
  if (url.includes('unsplash.com')) {
    return `${SITE_URL}/api/img?url=${encodeURIComponent(url)}`
  }
  return url
}

function getFallbackImage(brand: string, index: number): string {
  const n = brand.toLowerCase()
  let query = 'smartphone technology'
  if (n.includes('samsung'))  query = 'Samsung Galaxy smartphone'
  else if (n.includes('vivo')) query = 'Vivo smartphone'
  else if (n.includes('apple') || n.includes('iphone')) query = 'iPhone Apple smartphone'
  else if (n.includes('pixel') || n.includes('google')) query = 'Google Pixel smartphone'
  else if (n.includes('oneplus')) query = 'OnePlus smartphone'
  else if (n.includes('xiaomi') || n.includes('redmi')) query = 'Xiaomi smartphone'
  else if (n.includes('realme')) query = 'Realme smartphone'
  else if (n.includes('poco')) query = 'Poco smartphone'
  else if (n.includes('oppo')) query = 'OPPO smartphone'
  else if (n.includes('iqoo')) query = 'iQOO gaming smartphone'
  else if (n.includes('motorola') || n.includes('moto')) query = 'Motorola smartphone'
  else if (n.includes('nothing')) query = 'Nothing Phone smartphone'
  const queries = ['smartphone', 'android-phone', 'mobile-phone', 'tech-gadget', 'iphone']
  return `https://source.unsplash.com/1600x900/?${encodeURIComponent(query)},${queries[index % queries.length]}`
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
    } else if (art.featuredImage?.includes('unsplash.com')) {
      art.featuredImage = proxyUrl(art.featuredImage)
      changed = true
    } else if (art.featuredImage?.includes('/api/img?u=')) {
      art.featuredImage = proxyUrl(art.featuredImage)
      changed = true
    }

    // Fix inline images array
    if (Array.isArray(art.images)) {
      art.images = art.images.map((img: string, i: number) => {
        if (isBadImage(img)) {
          changed = true
          return getFallbackImage(art.brand || 'Mobile', i)
        }
        if (img?.includes('unsplash.com') || img?.includes('/api/img?u=')) {
          changed = true
          return proxyUrl(img)
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