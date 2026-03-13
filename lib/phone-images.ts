// lib/phone-images.ts
import fs from 'fs'
import path from 'path'

const PHONE_IMAGES_DIR = path.join(process.cwd(), 'public', 'phone-images')
const EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp']

const UNSPLASH_ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY || ''
const SITE_URL = process.env.SITE_URL || 'https://thetechbharat.com'

// Redis key where all used Unsplash image IDs are stored (a JSON array)
const USED_IDS_KEY = 'tb:used_unsplash_ids'

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

// Get ALL images from ALL brand folders combined
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
//  - Fetches a random Unsplash image for the given query
//  - Checks the image's unique Unsplash ID against:
//      1. Redis (tb:used_unsplash_ids) — IDs used across ALL past articles
//      2. sessionUsedIds Set — IDs used in the current batch (same request)
//  - If the ID already exists → skips it and tries again (up to maxAttempts)
//  - If the ID is new → stores it in Redis + sessionUsedIds, returns proxy URL
//  - Falls back to local images if Unsplash is unavailable or all retries fail
// ─────────────────────────────────────────────────────────────────
export async function getUniqueUnsplashImage(
  query: string,
  sessionUsedIds: Set<string>,
  maxAttempts = 5
): Promise<string> {
  if (!UNSPLASH_ACCESS_KEY) return getPhoneImage(query)

  // Load all previously used IDs from Redis once
  let redisUsedIds: Set<string> = new Set()
  try {
    const { Redis } = await import('@upstash/redis')
    const redis = Redis.fromEnv()
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
      const id: string = data.id        // Unsplash unique image ID e.g. "abc123XYZ"
      const rawUrl: string = data.urls?.regular || ''

      if (!id || !rawUrl) continue

      // Skip if this ID was used before (Redis) or in this batch (session)
      if (redisUsedIds.has(id) || sessionUsedIds.has(id)) {
        console.log(`[TB:images] Skipping duplicate Unsplash ID: ${id} (attempt ${attempt + 1})`)
        continue
      }

      // New unique ID — mark it used in both places
      sessionUsedIds.add(id)
      redisUsedIds.add(id)

      // Persist updated set back to Redis (keep last 2000 IDs max to avoid bloat)
      try {
        const { Redis } = await import('@upstash/redis')
        const redis = Redis.fromEnv()
        const idsArray = Array.from(redisUsedIds).slice(-2000)
        await redis.set(USED_IDS_KEY, idsArray)
      } catch {
        // Non-fatal — image is still returned, just not persisted
      }

      // Return through our proxy so Unsplash auth header is added server-side
      return `${SITE_URL}/api/img?u=${encodeURIComponent(rawUrl)}`

    } catch (err) {
      console.warn(`[TB:images] Unsplash attempt ${attempt + 1} failed:`, (err as Error).message)
    }
  }

  // All attempts exhausted or Unsplash failed — use local image as fallback
  console.log(`[TB:images] Falling back to local image for query: ${query}`)
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