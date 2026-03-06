import { NextResponse } from 'next/server'
import { getAllArticles } from '@/lib/store'

export async function GET() {
  const articles = getAllArticles()
  const titles = articles.slice(0, 8).map(a => `${a.brand}: ${a.title}`)
  return NextResponse.json({ titles })
}
