// app/api/admin/upload-image/route.ts
// Accepts image upload from admin panel → stores as base64 in Redis
// Served at: /api/admin/uploaded-image/{filename}

import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const MAX_SIZE = 5 * 1024 * 1024 // 5MB

export async function POST(req: NextRequest) {
  // Auth check
  const cookie = req.cookies.get('__tb_admin')?.value || ''
  if (!cookie.startsWith('TBOK:')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const formData = await req.formData()
    const file = formData.get('file') as File | null
    const articleId = formData.get('articleId') as string | null

    if (!file) return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    if (file.size > MAX_SIZE) return NextResponse.json({ error: 'File too large (max 5MB)' }, { status: 400 })

    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: 'Only JPG, PNG, WebP allowed' }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Generate unique filename
    const ext = file.type === 'image/png' ? 'png' : file.type === 'image/webp' ? 'webp' : 'jpg'
    const timestamp = Date.now()
    const filename = `article-${articleId || timestamp}-${timestamp}.${ext}`

    // Store as base64 in Redis
    const { Redis } = await import('@upstash/redis')
    const redis = Redis.fromEnv()

    const base64 = buffer.toString('base64')
    const key = `tb:uploaded:${filename}`

    // Store with 1 year TTL
    const setResult = await redis.set(key, {
      data: base64,
      type: file.type,
      size: file.size,
      uploadedAt: new Date().toISOString(),
      articleId: articleId || '',
    }, { ex: 60 * 60 * 24 * 365 })

    if (!setResult) {
      console.error('[upload-image] Redis set returned null for key:', key)
      return NextResponse.json({ error: 'Storage write failed' }, { status: 500 })
    }

    // Verify it was stored correctly
    const verify = await redis.get<unknown>(key)
    if (!verify) {
      console.error('[upload-image] Redis verify read returned null for key:', key)
      return NextResponse.json({ error: 'Storage verify failed' }, { status: 500 })
    }

    // Build the URL using the request's own host — this ensures correct domain
    // regardless of SITE_URL env variable being set or not
    const host = req.headers.get('host') || 'thetechbharat.com'
    const protocol = host.includes('localhost') ? 'http' : 'https'
    const url = `${protocol}://${host}/api/admin/uploaded-image/${filename}`

    // Update article's featuredImage in Redis
    if (articleId && !articleId.startsWith('story-')) {
      await updateArticleImage(articleId, url)
    }

    return NextResponse.json({ url, success: true })
  } catch (err) {
    console.error('[upload-image] Upload error:', err)
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }
}

// Update the article's featuredImage field in Redis
async function updateArticleImage(articleId: string, imageUrl: string) {
  try {
    const { getAllArticlesAsync, saveArticlesAsync } = await import('@/lib/store')
    const articles = await getAllArticlesAsync() as any[]
    const idx = articles.findIndex((a: any) => a.id === articleId)
    if (idx === -1) return
    articles[idx].featuredImage = imageUrl
    articles[idx].images = [imageUrl, ...(articles[idx].images || []).slice(1)]
    await saveArticlesAsync(articles)
  } catch (e) {
    console.error('[upload-image] Failed to update article image in Redis:', e)
  }
}