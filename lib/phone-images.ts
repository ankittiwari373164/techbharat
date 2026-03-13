// lib/phone-images.ts
import fs from 'fs'
import path from 'path'

const PHONE_IMAGES_DIR = path.join(process.cwd(), 'public', 'phone-images')
const EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp']

const UNSPLASH_ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY || ''
const SITE_URL = process.env.SITE_URL || 'https://thetechbharat.com'

// Redis keys
const USED_IDS_KEY  = 'tb:used_unsplash_ids'  // Set of all used Unsplash IDs
const IMG_KEY_PREFIX = 'tb:img:'               // tb:img:{id} → real Unsplash URL

const BRAND_FOLDERS: Record<string, string> = {
  'apple':        'iphone',
  'iphone':       'iphone',
  'google pixel': 'google_pixel',
  'google':       'google_pixel',
  'pixel':        'google_pixel',
  'iqoo':         'IQOO',
  'motorola':     'motorola',
  'moto':         'motorola',
  'nothing':      'nothing_',
  'oneplus':      'Oneplus',
  'one plus':     'Oneplus',
  'oppo':         'oppo',
  'poco':         'poco',
  'realme':       'Realme',
  'xiaomi':       'Xiaomi',
  'redmi':        'Xiaomi',
}

export function normalizePhoneName(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9\s]/g, '').replace(/\s+/g, '-').trim()
}

function resolveBrandFolder(phoneName: string): string | null {
  const cleaned = phoneName
    .toLowerCase()
    .replace(/\s*(smartphone|phone|mobile|device)s?\s*/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim()
  if (BRAND_FOLDERS[cleaned]) return BRAND_FOLDERS[cleaned]
  const keys = Object.keys(BRAND_FOLDERS).sort((a, b) => b.length - a.length)
  for (const key of keys) {
    if (cleaned.includes(key)) return BRAND_FOLDERS[key]
  }
  return null
}

function readImagesFromDir(folder: string): string[] {
  try {
    const dir = path.join(PHONE_IMAGES_DIR, folder)
    if (!fs.existsSync(dir)) return []
    return fs.readdirSync(dir)
      .filter(f => EXTENSIONS.some(ext => f.toLowerCase().endsWith(ext)))
      .sort((a, b) => (parseInt(a.split('.')[0]) || 0) - (parseInt(b.split('.')[0]) || 0))
      .map(f => `/phone-images/${folder}/${f}`)
  } catch { return [] }
}

export function getLocalPhoneImages(phoneName: string): string[] {
  const brandFolder = resolveBrandFolder(phoneName)
  if (brandFolder) {
    const imgs = readImagesFromDir(brandFolder)
    if (imgs.length > 0) return imgs
  }
  const slug = normalizePhoneName(phoneName)
  return readImagesFromDir(slug)
}

export function getAllLocalImages(): string[] {
  try {
    if (!fs.existsSync(PHONE_IMAGES_DIR)) return []
    const all: string[] = []
    for (const d of fs.readdirSync(PHONE_IMAGES_DIR, { withFileTypes: true })) {
      if (d.isDirectory()) all.push(...readImagesFromDir(d.name))
    }
    return all
  } catch { return [] }
}

export function getPhoneImage(phoneName: string, index = 0): string {
  const brandImages = getLocalPhoneImages(phoneName)
  if (brandImages.length > 0) return brandImages[index % brandImages.length]
  const allImages = getAllLocalImages()
  if (allImages.length > 0) return allImages[index % allImages.length]
  return ''
}

export function getArticleImages(phoneName: string, count = 5): string[] {
  const images: string[] = []
  for (let i = 0; i < count; i++) {
    const img = getPhoneImage(phoneName, i)
    if (img) images.push(img)
  }
  return images
}

// ─────────────────────────────────────────────────────────────────
//  UNSPLASH UNIQUE IMAGE FETCHER
//
//  Returns: https://thetechbharat.com/api/image/{unsplashId}
//           ↑ Clean URL — Unsplash domain NEVER shown to user
//
//  Flow:
//  1. Fetch random Unsplash photo for query
//  2. Get its unique ID (e.g. "abc123XYZ")
//  3. Check ID against Redis used-set + session set → skip if duplicate
//  4. Store real URL in Redis as tb:img:{id} (used by /api/image/[id] proxy)
//  5. Add ID to used-set so it's never reused
//  6. Return clean URL: /api/image/{id}
// ─────────────────────────────────────────────────────────────────
export async function getUniqueUnsplashImage(
  query: string,
  sessionUsedIds: Set<string>,
  maxAttempts = 5
): Promise<string> {
  if (!UNSPLASH_ACCESS_KEY) return getPhoneImage(query)

  // Load all previously used IDs from Redis
  let redisUsedIds: Set<string> = new Set()
  let redis: import('@upstash/redis').Redis | null = null
  try {
    const { Redis } = await import('@upstash/redis')
    redis = Redis.fromEnv()
    const stored = await redis.get<string[]>(USED_IDS_KEY)
    if (Array.isArray(stored)) redisUsedIds = new Set(stored)
  } catch {
    // Redis unavailable — continue without persistence
  }

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    try {
      const q = encodeURIComponent(query)
      const res = await fetch(
        `https://api.unsplash.com/photos/random?query=${q}&orientation=landscape`,
        {
          headers: { Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}` },
          next: { revalidate: 0 },
        }
      )
      if (!res.ok) break

      const data = await res.json()
      const id: string     = data.id            // e.g. "abc123XYZ"
      const rawUrl: string = data.urls?.regular || ''

      if (!id || !rawUrl) continue

      // Skip if already used in a past article (Redis) or current batch (session)
      if (redisUsedIds.has(id) || sessionUsedIds.has(id)) {
        console.log(`[TB:images] Duplicate Unsplash ID skipped: ${id} (attempt ${attempt + 1})`)
        continue
      }

      // Mark as used in session immediately
      sessionUsedIds.add(id)
      redisUsedIds.add(id)

      // Persist to Redis:
      // 1. Store the real URL under tb:img:{id} — used by /api/image/[id] to stream the image
      // 2. Update the used-IDs list (keep last 2000)
      if (redis) {
        try {
          await Promise.all([
            redis.set(`${IMG_KEY_PREFIX}${id}`, rawUrl, { ex: 60 * 60 * 24 * 30 }), // 30 day TTL
            redis.set(USED_IDS_KEY, Array.from(redisUsedIds).slice(-2000)),
          ])
        } catch { /* non-fatal */ }
      }

      // Return CLEAN URL — no Unsplash domain visible to the user
      return `${SITE_URL}/api/image/${id}`

    } catch (err) {
      console.warn(`[TB:images] Unsplash attempt ${attempt + 1} failed:`, (err as Error).message)
    }
  }

  // Fallback to local image
  console.log(`[TB:images] Falling back to local image for: ${query}`)
  return getPhoneImage(query)
}

export function listPhonesWithImages(): { name: string; slug: string; count: number }[] {
  try {
    if (!fs.existsSync(PHONE_IMAGES_DIR)) return []
    return fs.readdirSync(PHONE_IMAGES_DIR, { withFileTypes: true })
      .filter(d => d.isDirectory())
      .map(d => {
        const count = readImagesFromDir(d.name).length
        return { name: d.name.replace(/-/g, ' '), slug: d.name, count }
      })
  } catch { return [] }
}

export function getAvailableLocalBrands(): { brand: string; folder: string; count: number }[] {
  return listPhonesWithImages().map(b => ({ brand: b.name, folder: b.slug, count: b.count }))
}