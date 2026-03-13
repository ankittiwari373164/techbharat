import { NextRequest, NextResponse } from 'next/server'
import { getAllArticlesAsync, saveArticlesAsync } from '@/lib/store'
import { getPhoneImage } from '@/lib/phone-images'

export const dynamic = 'force-dynamic'

function hasDuplicateParams(url: string): boolean {
  try {
    // Detect duplicate w= or q= params in the encoded inner URL
    const inner = decodeURIComponent(url.split('?url=')[1] || '')
    return (inner.match(/[?&]w=/g) || []).length > 1 ||
           (inner.match(/[?&]q=/g) || []).length > 1
  } catch { return false }
}

function isBadImage(url: string): boolean {
  if (!url) return true
  if (url.includes('picsum')) return true
  if (url.includes('source.unsplash.com')) return true
  if (url.includes('via.placeholder')) return true
  if (url.includes('/api/img?u=')) return true
  // Key fix: catch the duplicate params bug
  if (url.includes('/api/img?url=') && hasDuplicateParams(url)) return true
  return false
}

export async function POST(request: NextRequest) {
  const cookie = request.cookies.get('__tb_admin')?.value
  if (!cookie) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const articles = await getAllArticlesAsync()
  let fixed = 0
  const updated = []

  for (let i = 0; i < articles.length; i++) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const art = { ...articles[i] } as any
    let changed = false

    if (isBadImage(art.featuredImage)) {
      art.featuredImage = await getPhoneImage(art.brand || 'Mobile', i % 5)
      changed = true
    }

    if (Array.isArray(art.images)) {
      for (let j = 0; j < art.images.length; j++) {
        if (isBadImage(art.images[j])) {
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