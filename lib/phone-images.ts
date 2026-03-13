// lib/phone-images.ts
import fs from 'fs'
import path from 'path'

const PHONE_IMAGES_DIR = path.join(process.cwd(), 'public', 'phone-images')
const UNSPLASH_ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY || ''
const EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp']

// Maps brand keywords → exact folder names in public/phone-images/
// Folder names: iphone, google_pixel, IQOO, motorola, nothing_, Oneplus, oppo, poco, Realme, Xiaomi
const BRAND_FOLDERS: Record<string, string> = {
  'apple':         'iphone',
  'iphone':        'iphone',
  'google pixel':  'google_pixel',
  'google':        'google_pixel',
  'pixel':         'google_pixel',
  'iqoo':          'IQOO',
  'motorola':      'motorola',
  'moto':          'motorola',
  'nothing':       'nothing_',
  'oneplus':       'Oneplus',
  'one plus':      'Oneplus',
  'oppo':          'oppo',
  'poco':          'poco',
  'realme':        'Realme',
  'xiaomi':        'Xiaomi',
  'redmi':         'Xiaomi',
}

export function normalizePhoneName(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9\s]/g, '').replace(/\s+/g, '-').trim()
}

// Resolve brand name → local folder name
function resolveBrandFolder(phoneName: string): string | null {
  const cleaned = phoneName
    .toLowerCase()
    .replace(/\s*(smartphone|phone|mobile|device)s?\s*/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim()

  // Exact match
  if (BRAND_FOLDERS[cleaned]) return BRAND_FOLDERS[cleaned]

  // Partial match — longest key first so "google pixel" beats "google"
  const keys = Object.keys(BRAND_FOLDERS).sort((a, b) => b.length - a.length)
  for (const key of keys) {
    if (cleaned.includes(key)) return BRAND_FOLDERS[key]
  }
  return null
}

export function getLocalPhoneImages(phoneName: string): string[] {
  try {
    // First try brand folder mapping
    const brandFolder = resolveBrandFolder(phoneName)
    if (brandFolder) {
      const dir = path.join(PHONE_IMAGES_DIR, brandFolder)
      if (fs.existsSync(dir)) {
        const files = fs.readdirSync(dir)
          .filter(f => EXTENSIONS.some(ext => f.toLowerCase().endsWith(ext)))
          .sort((a, b) => (parseInt(a.split('.')[0]) || 0) - (parseInt(b.split('.')[0]) || 0))
          .map(f => `/phone-images/${brandFolder}/${f}`)
        if (files.length > 0) return files
      }
    }

    // Fallback: try normalized slug (for future model-specific folders)
    const slug = normalizePhoneName(phoneName)
    const slugDir = path.join(PHONE_IMAGES_DIR, slug)
    if (fs.existsSync(slugDir)) {
      return fs.readdirSync(slugDir)
        .filter(f => EXTENSIONS.some(ext => f.toLowerCase().endsWith(ext)))
        .sort((a, b) => (parseInt(a.split('.')[0]) || 0) - (parseInt(b.split('.')[0]) || 0))
        .map(f => `/phone-images/${slug}/${f}`)
    }
    return []
  } catch { return [] }
}

export async function getPhoneImage(phoneName: string, index = 0, articleId?: string): Promise<string> {
  // 1. Local images
  const localImages = getLocalPhoneImages(phoneName)
  if (localImages.length > 0) return localImages[index % localImages.length]

  // 2. Unsplash API
  if (UNSPLASH_ACCESS_KEY) {
    try {
      const query = encodeURIComponent(`${phoneName} smartphone`)
      const res = await fetch(
        `https://api.unsplash.com/search/photos?query=${query}&per_page=15&orientation=landscape`,
        { headers: { Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}` }, next: { revalidate: 3600 } }
      )
      if (res.ok) {
        const { results = [] } = await res.json()
        if (results.length > 0) {
          const rawUrl = `${results[index % results.length].urls.regular}&w=1600&q=85&fit=crop&crop=center`
          const siteUrl = process.env.SITE_URL || 'https://thetechbharat.com'
          return `${siteUrl}/api/img?url=${encodeURIComponent(rawUrl)}`
        }
      }
    } catch { /* fall through */ }
  }

  // 3. Unsplash source — no API key, no Picsum ever
  const q = ['smartphone', 'android-phone', 'mobile-phone', 'tech-gadget', 'iphone']
  return `https://source.unsplash.com/1600x900/?${q[index % q.length]}`
}

export async function getArticleImages(phoneName: string, count = 5): Promise<string[]> {
  const images: string[] = []
  for (let i = 0; i < count; i++) images.push(await getPhoneImage(phoneName, i))
  return images
}

export function listPhonesWithImages(): { name: string; slug: string; count: number }[] {
  try {
    if (!fs.existsSync(PHONE_IMAGES_DIR)) return []
    return fs.readdirSync(PHONE_IMAGES_DIR, { withFileTypes: true })
      .filter(d => d.isDirectory())
      .map(d => {
        const count = fs.readdirSync(path.join(PHONE_IMAGES_DIR, d.name))
          .filter(f => EXTENSIONS.some(ext => f.toLowerCase().endsWith(ext))).length
        return { name: d.name.replace(/-/g, ' '), slug: d.name, count }
      })
  } catch { return [] }
}

export function getAvailableLocalBrands(): { brand: string; folder: string; count: number }[] {
  return listPhonesWithImages().map(b => ({ brand: b.name, folder: b.slug, count: b.count }))
}