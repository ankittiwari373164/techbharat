import { NextRequest, NextResponse } from 'next/server'
import { getAllArticlesAsync, saveArticlesAsync } from '@/lib/store'
import { getPhoneImage } from '@/lib/phone-images'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  const cookie = request.cookies.get('__tb_admin')?.value
  if (!cookie) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const articles = await getAllArticlesAsync()
  let fixed = 0
  const updated = []

  for (let i = 0; i < articles.length; i++) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const art = { ...articles[i] } as any
    const isBad = !art.featuredImage ||
      art.featuredImage.includes('source.unsplash') ||
      art.featuredImage.includes('placeholder')

    if (isBad) {
      // Fetch fresh image using phone-images logic (local → Unsplash API)
      art.featuredImage = await getPhoneImage(art.brand || 'Mobile', i % 5)
      if (Array.isArray(art.images)) {
        art.images = await Promise.all(
          art.images.map((_: string, idx: number) => getPhoneImage(art.brand || 'Mobile', idx))
        )
      }
      fixed++
    }
    updated.push(art)
  }

  await saveArticlesAsync(updated)
  return NextResponse.json({ success: true, fixed, total: articles.length })
}