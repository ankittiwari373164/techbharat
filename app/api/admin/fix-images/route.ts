import { NextRequest, NextResponse } from 'next/server'
import { getAllArticlesAsync, saveArticlesAsync } from '@/lib/store'
import { getPhoneImage } from '@/lib/phone-images'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  const cookie = request.cookies.get('__tb_admin')?.value
  if (!cookie) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const { searchParams } = new URL(request.url)
  const forceAll = searchParams.get('force') === 'true'

  const articles = await getAllArticlesAsync()
  let fixed = 0
  const updated = []

  for (let i = 0; i < articles.length; i++) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const art = { ...articles[i] } as any
    let changed = false

    const isLocalImage = (url: string) => url?.startsWith('/phone-images/')
    const isCleanProxy = (url: string) => {
      if (!url?.includes('/api/img?url=')) return false
      // Check no duplicate params in the inner URL
      try {
        const inner = decodeURIComponent(url.split('?url=')[1] || '')
        return (inner.match(/[?&]w=/g) || []).length <= 1 &&
               (inner.match(/[?&]q=/g) || []).length <= 1
      } catch { return false }
    }
    const isGood = (url: string) => isLocalImage(url) || isCleanProxy(url)

    // Force mode: replace ALL. Normal mode: replace bad only
    if (forceAll || !isGood(art.featuredImage)) {
      art.featuredImage = await getPhoneImage(art.brand || 'Mobile', i % 5)
      changed = true
    }

    if (Array.isArray(art.images)) {
      for (let j = 0; j < art.images.length; j++) {
        if (forceAll || !isGood(art.images[j])) {
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