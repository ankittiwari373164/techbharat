import { NextRequest, NextResponse } from 'next/server'
import { getArticleBySlug, getAllArticles, saveArticles } from '@/lib/store'

export async function POST(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const body = await request.json()
    const { name, text, rating, location } = body

    if (!name || !text) {
      return NextResponse.json({ error: 'Name and review text required' }, { status: 400 })
    }

    const article = getArticleBySlug(params.slug)
    if (!article) {
      return NextResponse.json({ error: 'Article not found' }, { status: 404 })
    }

    const review = {
      name: String(name).slice(0, 60),
      location: String(location || '').slice(0, 40),
      rating: Math.max(1, Math.min(5, Number(rating) || 5)),
      text: String(text).slice(0, 500),
      date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
    }

    article.reviews = article.reviews || []
    article.reviews.push(review)

    // Save back to store
    const all = getAllArticles()
    const idx = all.findIndex(a => a.slug === params.slug)
    if (idx >= 0) {
      all[idx] = article
      saveArticles(all)
    }

    return NextResponse.json({ success: true, article })
  } catch (err) {
    return NextResponse.json({ error: 'Failed to submit review' }, { status: 500 })
  }
}
