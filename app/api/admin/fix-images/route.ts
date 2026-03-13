import { NextRequest, NextResponse } from 'next/server'
import { getAllArticlesAsync, saveArticlesAsync } from '@/lib/store'
export const dynamic = 'force-dynamic'
const SITE_URL = process.env.SITE_URL || 'https://thetechbharat.com'
function proxyUrl(url: string): string {
  if (!url) return url
  if (url.includes('/api/img?') || !url.includes('unsplash.com')) return url
  return `${SITE_URL}/api/img?u=${encodeURIComponent(url)}`
}
export async function POST(request: NextRequest) {
  const cookie = request.cookies.get('__tb_admin')?.value
  if (!cookie) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
  const articles = await getAllArticlesAsync()
  let fixed = 0
  const updated = articles.map(a => {
    const art = { ...a } as any
    let changed = false
    if (art.featuredImage?.includes('unsplash.com')) {
      art.featuredImage = proxyUrl(art.featuredImage)
      changed = true
    }
    if (Array.isArray(art.images)) {
      art.images = art.images.map((img: string) => {
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
