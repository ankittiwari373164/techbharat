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
        // Sort numerically: 1.jpg, 2.jpg, 10.jpg
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
        return `${siteUrl}/api/img?u=${encodeURIComponent(rawUrl)}`
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