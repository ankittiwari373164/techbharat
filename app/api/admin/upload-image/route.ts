// app/api/admin/upload-image/route.ts
// Accepts image upload from admin panel → stores in Cloudflare R2 or as base64 in Redis
// Falls back to storing as Vercel Blob if R2 not configured

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

    // Strategy 1: Try Vercel Blob (if configured)
    if (process.env.BLOB_READ_WRITE_TOKEN) {
      try {
        const { put } = await import('@vercel/blob')
        const blob = await put(`images/${filename}`, buffer, {
          access: 'public',
          contentType: file.type,
        })
        
        // Also update article's featuredImage in Redis
        if (articleId) await updateArticleImage(articleId, blob.url)
        
        return NextResponse.json({ url: blob.url, success: true })
      } catch (e) {
        console.error('Vercel Blob upload failed:', e)
        // Fall through to Redis strategy
      }
    }

    // Strategy 2: Store as base64 in Redis with a served route
    // Key: tb:uploaded:{filename} → base64 image data
    // Served at: /api/admin/uploaded-image/{filename}
    try {
      const { Redis } = await import('@upstash/redis')
      const redis = Redis.fromEnv()
      
      // Store image data as base64 in Redis (max ~6MB after base64 encoding)
      const base64 = buffer.toString('base64')
      const key = `tb:uploaded:${filename}`
      
      // Store with 1 year TTL
      await redis.set(key, JSON.stringify({
        data: base64,
        type: file.type,
        size: file.size,
        uploadedAt: new Date().toISOString(),
        articleId: articleId || '',
      }), { ex: 60 * 60 * 24 * 365 })

      const url = `${process.env.SITE_URL || 'https://thetechbharat.com'}/api/admin/uploaded-image/${filename}`
      
      // Update article's featuredImage in Redis
      if (articleId) await updateArticleImage(articleId, url)

      return NextResponse.json({ url, success: true })
    } catch (e) {
      console.error('Redis upload failed:', e)
      return NextResponse.json({ error: 'Upload failed — storage unavailable' }, { status: 500 })
    }

  } catch (err) {
    console.error('Upload error:', err)
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
    console.error('Failed to update article image in Redis:', e)
  }
}