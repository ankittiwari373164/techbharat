import { NextRequest, NextResponse } from 'next/server'
import { getArticleBySlugAsync, getSimilarArticlesAsync } from '@/lib/store'

export const dynamic = 'force-dynamic'

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  const article = await getArticleBySlugAsync(params.slug)
  if (!article) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }
  const similar = await getSimilarArticlesAsync(article, 3)
  return NextResponse.json({ article, similar })
}