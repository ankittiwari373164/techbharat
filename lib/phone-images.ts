// lib/phone-images.ts
// Resolves phone images from the local phone-images directory
// Structure: public/phone-images/{brand-model}/1.jpg, 2.jpg, 3.jpg ...
// Falls back to Unsplash API if no local images found

import fs from 'fs'
import path from 'path'

const PHONE_IMAGES_DIR = path.join(process.cwd(), 'public', 'phone-images')
const UNSPLASH_ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY || ''

// Supported image extensions
const EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp']

/**
 * Normalize a phone name to a directory-safe slug
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
 * Get all local images for a phone model.
 * Looks in public/phone-images/{phoneName}/
 * Images should be named: 1.jpg, 2.jpg, 3.jpg etc.
 */
export function getLocalPhoneImages(phoneName: string): string[] {
  try {
    const slug = normalizePhoneName(phoneName)
    const dir = path.join(PHONE_IMAGES_DIR, slug)
    if (!fs.existsSync(dir)) return []

    const files = fs.readdirSync(dir)
    const images = files
      .filter(f => EXTENSIONS.some(ext => f.toLowerCase().endsWith(ext)))
      .sort((a, b) => {
        const numA = parseInt(a.split('.')[0]) || 0
        const numB = parseInt(b.split('.')[0]) || 0
        return numA - numB
      })
      .map(f => `/phone-images/${slug}/${f}`)

    return images
  } catch {
    return []
  }
}

/**
 * Get a specific image for a phone by index (0-based)
 * Returns local image if available, otherwise Unsplash, never Picsum
 */
export async function getPhoneImage(
  phoneName: string,
  index = 0,
  articleId?: string
): Promise<string> {
  // 1. Try local images first
  const localImages = getLocalPhoneImages(phoneName)
  if (localImages.length > 0) {
    return localImages[index % localImages.length]
  }

  // 2. Try Unsplash API
  if (UNSPLASH_ACCESS_KEY) {
    try {
      const query = encodeURIComponent(`${phoneName} smartphone`)
      const res = await fetch(
        `https://api.unsplash.com/search/photos?query=${query}&per_page=15&orientation=landscape`,
        {
          headers: { Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}` },
          next: { revalidate: 3600 },
        }
      )
      if (res.ok) {
        const data = await res.json()
        const results = data.results || []
        if (results.length > 0) {
          const pick = results[index % results.length]
          const rawUrl = `${pick.urls.regular}&w=1600&q=85&fit=crop&crop=center`
          const siteUrl = process.env.SITE_URL || 'https://thetechbharat.com'
          // FIXED: ?url= not ?u=
          return `${siteUrl}/api/img?url=${encodeURIComponent(rawUrl)}`
        }
      }
    } catch {
      // fall through to source.unsplash.com
    }
  }

  // 3. Unsplash source URL — no API key needed, always tech-relevant, never Picsum
  const techQueries = ['smartphone', 'android-phone', 'mobile-phone', 'tech-gadget', 'iphone']
  return `https://source.unsplash.com/1600x900/?${techQueries[index % techQueries.length]}`
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

export function getAvailableLocalBrands(): { brand: string; folder: string; count: number }[] {
  return listPhonesWithImages().map(b => ({ brand: b.name, folder: b.slug, count: b.count }))
}