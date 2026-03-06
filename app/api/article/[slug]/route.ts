import { NextRequest, NextResponse } from 'next/server'
import { getArticleBySlug, getSimilarArticles } from '@/lib/store'

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  const article = getArticleBySlug(params.slug)
  if (!article) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }
  const similar = getSimilarArticles(article, 3)
  return NextResponse.json({ article, similar })
}
