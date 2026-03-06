import { NextResponse } from 'next/server'
import { getAllArticlesAsync } from '@/lib/store'

export async function GET() {
  const articles = await getAllArticlesAsync()
  const stats = {
    total:      articles.length,
    mobileNews: articles.filter(a => a.type === 'mobile-news').length,
    reviews:    articles.filter(a => a.type === 'review').length,
    compare:    articles.filter(a => a.type === 'compare').length,
    brands:     articles.reduce((acc: Record<string,number>, a) => { acc[a.brand]=(acc[a.brand]||0)+1; return acc }, {}),
  }
  return NextResponse.json({ articles, stats })
}