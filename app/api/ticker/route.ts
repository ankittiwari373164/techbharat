import { NextResponse } from 'next/server'
import { getAllArticlesAsync } from '@/lib/store'

export const dynamic = 'force-dynamic'

export async function GET() {
  const articles = await getAllArticlesAsync()
  const titles = articles.slice(0, 8).map(a => `${a.brand}: ${a.title}`)
  return NextResponse.json({ titles })
}