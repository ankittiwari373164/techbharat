// app/api/admin/debug-images/route.ts
// TEMPORARY - delete after use
import { NextRequest, NextResponse } from 'next/server'
import { getAllArticlesAsync } from '@/lib/store'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  const cookie = request.cookies.get('__tb_admin')?.value
  if (!cookie) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const articles = await getAllArticlesAsync()
  return NextResponse.json(
    articles.map(a => ({
      slug: (a as any).slug,
      brand: (a as any).brand,
      featuredImage: (a as any).featuredImage,
    }))
  )
}