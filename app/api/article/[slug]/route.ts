import { NextRequest, NextResponse } from 'next/server'
import { getArticleBySlugAsync, getSimilarArticlesAsync } from '@/lib/store'
import { Redis } from '@upstash/redis'

export const dynamic = 'force-dynamic'

function getKv() {
  return new Redis({
    url:   process.env.KV_REST_API_URL!,
    token: process.env.KV_REST_API_TOKEN!,
  })
}

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  const article = await getArticleBySlugAsync(params.slug)
  if (!article) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  // Track view — fire and forget, don't block response
  try {
    const kv  = getKv()
    const key = `views:${params.slug}`
    kv.incr(key).catch(() => {})
    // Also track daily for sparkline: views:daily:YYYY-MM-DD:slug
    const today = new Date().toISOString().slice(0, 10)
    kv.incr(`views:daily:${today}:${params.slug}`).catch(() => {})
    // Expire daily keys after 90 days
    kv.expire(`views:daily:${today}:${params.slug}`, 90 * 86400).catch(() => {})
  } catch { /* never block article load */ }

  const similar = await getSimilarArticlesAsync(article, 3)
  return NextResponse.json({ article, similar })
}