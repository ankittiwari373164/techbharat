// lib/phone-images.ts
// Resolves phone images from the local phone-images directory
// Structure: public/phone-images/{Brand}/1.png, 2.png, 3.png ...
//   Folders are named by brand: Apple/, Samsung/, OnePlus/, iQOO/ etc.
//   news-fetcher calls getArticleImages("Samsung smartphone", 5)
//   → this strips " smartphone" and maps to the correct folder.
// Falls back to Unsplash API (proxied) if no local images found

import fs from 'fs'
import path from 'path'

const PHONE_IMAGES_DIR = path.join(process.cwd(), 'public', 'phone-images')
const UNSPLASH_ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY || ''

// Supported image extensions
const EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp']

// Maps brand keywords (as passed by news-fetcher) → actual folder names
// news-fetcher passes: "Samsung smartphone", "Apple smartphone", "iQOO smartphone" etc.
const BRAND_FOLDER_MAP: Record<string, string> = {
  'samsung':      'Samsung',
  'apple':        'Apple',
  'iphone':       'Apple',
  'xiaomi':       'Xiaomi',
  'redmi':        'Xiaomi',
  'poco':         'Poco',
  'oneplus':      'OnePlus',
  'one plus':     'OnePlus',
  'realme':       'Realme',
  'vivo':         'Vivo',
  'oppo':         'OPPO',
  'iqoo':         'iQOO',
  'motorola':     'Motorola',
  'moto':         'Motorola',
  'nothing':      'Nothing',
  'google pixel': 'Google',
  'google':       'Google',
  'pixel':        'Google',
}

/**
 * Resolve a phone name / brand string to the correct local folder name.
 * Handles inputs like "Samsung smartphone", "Apple", "iQOO smartphone".
 * Returns the exact folder name (case-sensitive) or null if no match.
 */
export function resolveBrandFolder(phoneName: string): string | null {
  // Strip common suffixes added by news-fetcher
  const cleaned = phoneName
    .toLowerCase()
    .replace(/\s*(smartphone|phone|mobile|device)s?\s*/gi, '')
    .trim()

  // Direct lookup
  if (BRAND_FOLDER_MAP[cleaned]) return BRAND_FOLDER_MAP[cleaned]

  // Partial match — check if any key is contained in the name
  for (const [key, folder] of Object.entries(BRAND_FOLDER_MAP)) {
    if (cleaned.includes(key)) return folder
  }
  return null
}

/**
 * Normalize a phone name to a directory-safe slug.
 * Used for specific phone model subfolders if they exist.
 * e.g. "Samsung Galaxy S25 Ultra" → "samsung-galaxy-s25-ultra"
 */
export function normalizePhoneName(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, '-')
    .trim()
}

/**
 * Get all local images for a phone/brand.
 * Resolution order:
 *   1. public/phone-images/{brand-model-slug}/  (specific model folder)
 *   2. public/phone-images/{Brand}/             (brand folder — e.g. Apple/, Samsung/)
 * Images named: 1.png, 2.png, 3.png etc.
 */
export function getLocalPhoneImages(phoneName: string): string[] {
  try {
    // Try specific model slug first (e.g. "samsung-galaxy-s25")
    const slug = normalizePhoneName(phoneName)
    const modelDir = path.join(PHONE_IMAGES_DIR, slug)
    if (fs.existsSync(modelDir)) {
      const files = fs.readdirSync(modelDir)
        .filter(f => EXTENSIONS.some(ext => f.toLowerCase().endsWith(ext)))
        .sort((a, b) => (parseInt(a) || 0) - (parseInt(b) || 0))
        .map(f => `/phone-images/${slug}/${f}`)
      if (files.length > 0) return files
    }

    // Fall back to brand folder (Apple/, Samsung/, OnePlus/ etc.)
    const brandFolder = resolveBrandFolder(phoneName)
    if (!brandFolder) return []
    const dir = path.join(PHONE_IMAGES_DIR, brandFolder)
    if (!fs.existsSync(dir)) return []

    const files = fs.readdirSync(dir)
    const images = files
      .filter(f => EXTENSIONS.some(ext => f.toLowerCase().endsWith(ext)))
      .sort((a, b) => {
        // Sort numerically: 1.jpg, 2.jpg, 10.jpg
        const numA = parseInt(a.split('.')[0]) || 0
        const numB = parseInt(b.split('.')[0]) || 0
        return numA - numB
      })
      .map(f => `/phone-images/${brandFolder}/${f}`)

    return images
  } catch {
    return []
  }
}

/**
 * Get a specific image for a phone by index (0-based)
 * Returns local image if available, otherwise Unsplash
 */
export async function getPhoneImage(
  phoneName: string,
  index = 0,
  articleId?: string
): Promise<string> {
  // Try local images first
  const localImages = getLocalPhoneImages(phoneName)
  if (localImages.length > 0) {
    // Rotate through images, never repeat same one for different articles
    return localImages[index % localImages.length]
  }

  // Try Unsplash API
  if (UNSPLASH_ACCESS_KEY) {
    try {
      const query = encodeURIComponent(`${phoneName} smartphone`)
      const res = await fetch(
        `https://api.unsplash.com/photos/random?query=${query}&orientation=landscape&w=1200`,
        {
          headers: { Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}` },
          next: { revalidate: 3600 },
        }
      )
      if (res.ok) {
        const data = await res.json()
        const rawUrl = `${data.urls.regular}&w=1600&q=85&fit=crop&crop=center`
        const siteUrl = process.env.SITE_URL || 'https://thetechbharat.com'
        return `${siteUrl}/api/img?url=${encodeURIComponent(rawUrl)}`
      }
    } catch {
      // fall through to picsum
    }
  }

  // Fallback: Picsum with deterministic seed from phone name + index
  const seed = phoneName
    .split('')
    .reduce((acc, c) => acc + c.charCodeAt(0), index * 100)
  return `https://picsum.photos/seed/${seed}/1600/900`
}

/**
 * Get multiple images for an article (featured + inline)
 */
export async function getArticleImages(
  phoneName: string,
  count = 5
): Promise<string[]> {
  const images: string[] = []
  for (let i = 0; i < count; i++) {
    images.push(await getPhoneImage(phoneName, i))
  }
  return images
}

/**
 * List all phones that have local images
 */
export function listPhonesWithImages(): { name: string; slug: string; count: number }[] {
  try {
    if (!fs.existsSync(PHONE_IMAGES_DIR)) return []
    const dirs = fs.readdirSync(PHONE_IMAGES_DIR, { withFileTypes: true })
      .filter(d => d.isDirectory())
      .map(d => {
        const imagesDir = path.join(PHONE_IMAGES_DIR, d.name)
        const count = fs.readdirSync(imagesDir)
          .filter(f => EXTENSIONS.some(ext => f.toLowerCase().endsWith(ext))).length
        return { name: d.name.replace(/-/g, ' '), slug: d.name, count }
      })
    return dirs
  } catch {
    return []
  }
}