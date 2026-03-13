import { NextRequest, NextResponse } from 'next/server'
import { getAllArticlesAsync, saveArticlesAsync } from '@/lib/store'

export const dynamic = 'force-dynamic'

const SITE_URL = process.env.SITE_URL || 'https://thetechbharat.com'
const UNSPLASH_KEY = process.env.UNSPLASH_ACCESS_KEY || ''

function isBadImage(url: string): boolean {
  if (!url) return true
  if (url.includes('picsum')) return true
  if (url.includes('source.unsplash.com')) return true  // deprecated
  if (url.includes('via.placeholder')) return true
  return false
}

function proxyUrl(url: string): string {
  if (!url) return url
  if (url.includes('/api/img?url=')) return url
  if (url.includes('/api/img?u=')) return url.replace('/api/img?u=', '/api/img?url=')
  if (url.includes('unsplash.com')) return `${SITE_URL}/api/img?url=${encodeURIComponent(url)}`
  return url
}

function getBrandKeyword(brand: string): string {
  const n = (brand || '').toLowerCase()
  if (n.includes('apple') || n.includes('iphone')) return 'iPhone Apple'
  if (n.includes('pixel') || n.includes('google')) return 'Google Pixel smartphone'
  if (n.includes('samsung')) return 'Samsung Galaxy smartphone'
  if (n.includes('oneplus')) return 'OnePlus smartphone'
  if (n.includes('xiaomi') || n.includes('redmi')) return 'Xiaomi smartphone'
  if (n.includes('realme')) return 'Realme smartphone'
  if (n.includes('poco')) return 'Poco smartphone'
  if (n.includes('oppo')) return 'OPPO smartphone'
  if (n.includes('iqoo')) return 'iQOO smartphone'
  if (n.includes('motorola') || n.includes('moto')) return 'Motorola smartphone'
  if (n.includes('nothing')) return 'Nothing Phone'
  if (n.includes('vivo')) return 'Vivo smartphone'
  return 'smartphone Android'
}

async function fetchUnsplashImage(brand: string, index: number): Promise<string> {
  if (!UNSPLASH_KEY) return ''
  try {
    const query = encodeURIComponent(getBrandKeyword(brand))
    const res = await fetch(
      `https://api.unsplash.com/search/photos?query=${query}&per_page=15&orientation=landscape`,
      { headers: { Authorization: `Client-ID ${UNSPLASH_KEY}` } }
    )
    if (res.ok) {
      const { results = [] } = await res.json()
      if (results.length > 0) {
        const pick = results[index % results.length]
        const rawUrl = `${pick.urls.regular}&w=1600&q=85&fit=crop&crop=center`
        return `${SITE_URL}/api/img?url=${encodeURIComponent(rawUrl)}`
      }
    }
  } catch { /* fall through */ }
  return ''
}

export async function POST(request: NextRequest) {
  const cookie = request.cookies.get('__tb_admin')?.value
  if (!cookie) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const articles = await getAllArticlesAsync()
  let fixed = 0

  // Process articles one by one (await Unsplash calls)
  const updated = []
  for (const a of articles) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const art = { ...a } as any
    let changed = false

    // Fix featured image
    if (isBadImage(art.featuredImage)) {
      const fresh = await fetchUnsplashImage(art.brand || 'Mobile', 0)
      if (fresh) { art.featuredImage = fresh; changed = true }
    } else if (art.featuredImage?.includes('unsplash.com')) {
      art.featuredImage = proxyUrl(art.featuredImage)
      changed = true
    }

    // Fix images array
    if (Array.isArray(art.images)) {
      for (let i = 0; i < art.images.length; i++) {
        const img = art.images[i]
        if (isBadImage(img)) {
          const fresh = await fetchUnsplashImage(art.brand || 'Mobile', i)
          if (fresh) { art.images[i] = fresh; changed = true }
        } else if (img?.includes('unsplash.com')) {
          art.images[i] = proxyUrl(img)
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