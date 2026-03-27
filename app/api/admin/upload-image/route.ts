// app/api/admin/upload-image/route.ts
import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const MAX_SIZE = 5 * 1024 * 1024

export async function POST(req: NextRequest) {
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
    const base64 = buffer.toString('base64')

    if (!base64 || base64.length < 10) {
      return NextResponse.json({ error: 'File read failed — empty buffer' }, { status: 400 })
    }

    const ext = file.type === 'image/png' ? 'png' : file.type === 'image/webp' ? 'webp' : 'jpg'
    const timestamp = Date.now()
    const filename = `article-${articleId || timestamp}-${timestamp}.${ext}`
    const key = `tb:uploaded:${filename}`

    // Support both Upstash native names AND Vercel KV names (which are the same service)
    const redisUrl   = process.env.UPSTASH_REDIS_REST_URL   || process.env.KV_REST_API_URL
    const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN

    if (!redisUrl || !redisToken) {
      return NextResponse.json({
        error: 'Redis not configured — set KV_REST_API_URL and KV_REST_API_TOKEN in Vercel env vars'
      }, { status: 500 })
    }

    const { Redis } = await import('@upstash/redis')
    const redis = new Redis({ url: redisUrl, token: redisToken })

    const payload = {
      data: base64,
      type: file.type,
      size: file.size,
      uploadedAt: new Date().toISOString(),
      articleId: articleId || '',
    }

    const setResult = await redis.set(key, payload, { ex: 60 * 60 * 24 * 365 })

    if (setResult !== 'OK') {
      return NextResponse.json({
        error: `Redis write failed — got: ${JSON.stringify(setResult)}`
      }, { status: 500 })
    }

    // Verify it's readable
    const verify = await redis.get<any>(key)
    if (!verify?.data) {
      return NextResponse.json({
        error: 'Redis verify failed — wrote but cannot read back',
        verifyType: typeof verify,
      }, { status: 500 })
    }

    const host = req.headers.get('host') || 'thetechbharat.com'
    const protocol = host.includes('localhost') ? 'http' : 'https'
    const url = `${protocol}://${host}/api/admin/uploaded-image/${filename}`

    if (articleId && !articleId.startsWith('story-')) {
      await updateArticleImage(articleId, url)
    }

    return NextResponse.json({ url, success: true, filename, dataLength: base64.length })

  } catch (err: any) {
    console.error('[upload-image] fatal:', err)
    return NextResponse.json({
      error: err?.message || 'Upload failed',
      detail: err?.stack?.split('\n').slice(0, 3).join(' | ')
    }, { status: 500 })
  }
}

async function updateArticleImage(articleId: string, imageUrl: string) {
  try {
    const { getAllArticlesAsync, saveArticlesAsync } = await import('@/lib/store')
    const articles = await getAllArticlesAsync() as any[]
    const idx = articles.findIndex((a: any) => a.id === articleId)
    if (idx === -1) return
    articles[idx].featuredImage = imageUrl
    articles[idx].images = [imageUrl, ...(articles[idx].images || []).slice(1)]
    await saveArticlesAsync(articles)
  } catch (e: any) {
    console.error('[upload-image] updateArticleImage failed:', e?.message)
  }
}