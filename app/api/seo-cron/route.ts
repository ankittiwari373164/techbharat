// app/api/seo-cron/route.ts
// Auto-index new articles to Google + refresh GSC cache
// Called by Vercel cron every hour
import { NextRequest, NextResponse } from 'next/server'
import { kv } from '@/lib/kv'

const SITE_URL = process.env.SITE_URL || 'https://thetechbharat.com'

async function getGoogleAccessToken(scopes: string[]): Promise<string | null> {
  const raw = process.env.GOOGLE_SERVICE_KEY
  if (!raw) return null
  let key: Record<string, string>
  try { key = JSON.parse(raw) } catch { return null }

  try {
    const header  = { alg: 'RS256', typ: 'JWT' }
    const now     = Math.floor(Date.now() / 1000)
    const payload = {
      iss: key.client_email, scope: scopes.join(' '),
      aud: 'https://oauth2.googleapis.com/token', iat: now, exp: now + 3600,
    }
    const b64     = (obj: object) => Buffer.from(JSON.stringify(obj)).toString('base64url')
    const unsigned = `${b64(header)}.${b64(payload)}`

    const pemBody  = key.private_key.replace(/-----BEGIN PRIVATE KEY-----|-----END PRIVATE KEY-----|\n/g, '')
    const binaryDer = Buffer.from(pemBody, 'base64')
    const cryptoKey = await crypto.subtle.importKey(
      'pkcs8', binaryDer,
      { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
      false, ['sign']
    )
    const sig = await crypto.subtle.sign('RSASSA-PKCS1-v1_5', cryptoKey, Buffer.from(unsigned))
    const jwt = `${unsigned}.${Buffer.from(sig).toString('base64url')}`

    const res  = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer', assertion: jwt }),
    })
    return (await res.json()).access_token || null
  } catch { return null }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const qSecret = searchParams.get('secret')
  const hSecret = req.headers.get('authorization')?.replace('Bearer ', '') || req.headers.get('x-cron-secret')
  const validSecret = process.env.CRON_SECRET
  if (validSecret && qSecret !== validSecret && hSecret !== validSecret) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const log: string[] = []
  const token = await getGoogleAccessToken(['https://www.googleapis.com/auth/indexing'])

  if (!token) {
    log.push('⚠️ No GOOGLE_SERVICE_KEY — skipping Google Indexing')
  } else {
    // Find articles published in last 2 hours that haven't been indexed yet
    const keys = await kv.keys('article:*')
    const twoHoursAgo = Date.now() - 2 * 60 * 60 * 1000
    let submitted = 0

    for (const key of keys) {
      const art = await kv.get(key) as Record<string, unknown> | null
      if (!art) continue

      const publishedAt = art.publishedAt as number || 0
      const indexed     = art.googleIndexed as boolean || false

      if (publishedAt > twoHoursAgo && !indexed) {
        const slug = key.replace('article:', '')
        const url  = `${SITE_URL}/article/${slug}`

        try {
          const res = await fetch('https://indexing.googleapis.com/v3/urlNotifications:publish', {
            method: 'POST',
            headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({ url, type: 'URL_UPDATED' }),
          })
          const result = await res.json()

          if (!result.error) {
            // Mark as indexed
            await kv.set(key, JSON.stringify({ ...art, googleIndexed: true, indexedAt: Date.now() }))
            log.push(`✅ Indexed: ${url}`)
            submitted++
          } else {
            log.push(`⚠️ Failed ${url}: ${result.error.message}`)
          }
        } catch (e) {
          log.push(`❌ Error ${url}: ${String(e)}`)
        }

        await new Promise(r => setTimeout(r, 150))
      }
    }

    if (submitted === 0) log.push('No new articles to index')
    else log.push(`📤 Submitted ${submitted} new articles to Google`)
  }

  // Also auto-generate missing SEO meta (max 5 per run to save costs)
  const anthropicKey = process.env.ANTHROPIC_API_KEY
  if (anthropicKey) {
    const keys   = await kv.keys('article:*')
    let metaDone = 0

    for (const key of keys) {
      if (metaDone >= 5) break
      const art = await kv.get(key) as Record<string, unknown> | null
      if (!art || art.seoTitle || !art.title) continue

      try {
        const snippet = ((art.content as string) || '').replace(/<[^>]+>/g, '').slice(0, 600)
        const res = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: {
            'x-api-key': anthropicKey,
            'anthropic-version': '2023-06-01',
            'content-type': 'application/json',
          },
          body: JSON.stringify({
            model: 'claude-haiku-4-5-20251001',
            max_tokens: 250,
            messages: [{
              role: 'user',
              content: `SEO expert for Indian tech news. Generate for: "${art.title as string}"\nContent: ${snippet}\n\nReturn JSON only:\n{"seoTitle":"max 60 chars","metaDescription":"150-160 chars with India context","focusKeyword":"main keyword"}`,
            }],
          }),
        })
        const data = await res.json()
        const text = data.content?.[0]?.text || ''
        const meta = JSON.parse(text.replace(/```json|```/g, '').trim())

        await kv.set(key, JSON.stringify({
          ...art,
          seoTitle:       meta.seoTitle,
          seoDescription: meta.metaDescription,
          focusKeyword:   meta.focusKeyword,
        }))
        log.push(`🏷️ Meta generated: ${art.title as string}`)
        metaDone++
      } catch { /* skip */ }

      await new Promise(r => setTimeout(r, 300))
    }
  }

  // Save cron log
  await kv.set('seo:cron_log', JSON.stringify({ log, ts: Date.now() }))

  return NextResponse.json({ ok: true, log })
}