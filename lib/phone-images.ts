// lib/phone-images.ts
import fs from 'fs'
import path from 'path'

const PHONE_IMAGES_DIR = path.join(process.cwd(), 'public', 'phone-images')
const UNSPLASH_ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY || ''
const SITE_URL = process.env.SITE_URL || 'https://thetechbharat.com'
const EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp']

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

export function getLocalPhoneImages(phoneName: string): string[] {
  try {
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

export async function getPhoneImage(phoneName: string, index = 0): Promise<string> {
  // 1. Local images first
  const localImages = getLocalPhoneImages(phoneName)
  if (localImages.length > 0) return localImages[index % localImages.length]

  // 2. Unsplash API — clean URL, no duplicate params
  if (UNSPLASH_ACCESS_KEY) {
    try {
      const query = encodeURIComponent(`${phoneName} smartphone`)
      const res = await fetch(
        `https://api.unsplash.com/search/photos?query=${query}&per_page=15&orientation=landscape`,
        { headers: { Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}` } }
      )
      if (res.ok) {
        const { results = [] } = await res.json()
        if (results.length > 0) {
          const pick = results[index % results.length]
          // Use the raw URL as-is — do NOT append extra params
          const rawUrl = pick.urls.regular
          return `${SITE_URL}/api/img?url=${encodeURIComponent(rawUrl)}`
        }
      }
    } catch { /* fall through */ }
  }

  // 3. Unsplash random — clean URL
  const queries = ['smartphone', 'android', 'mobile', 'gadget', 'technology']
  const q = queries[index % queries.length]
  const fallbackUrl = `https://api.unsplash.com/photos/random?query=${q}&orientation=landscape`
  if (UNSPLASH_ACCESS_KEY) {
    try {
      const res = await fetch(fallbackUrl, {
        headers: { Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}` }
      })
      if (res.ok) {
        const data = await res.json()
        return `${SITE_URL}/api/img?url=${encodeURIComponent(data.urls.regular)}`
      }
    } catch { /* fall through */ }
  }

  // 4. Last resort — a single clean Unsplash photo URL (no duplicates)
  const photoIds = [
    'photo-1574944985070-8f3ebc6b79d2', // smartphone
    'photo-1511707171634-5f897ff02aa9', // phone
    'photo-1565849904461-04a58ad377e0', // android
    'photo-1592899677977-9c10002761d5', // mobile
    'photo-1598327105666-5b89351aff97', // tech
  ]
  const pid = photoIds[index % photoIds.length]
  return `${SITE_URL}/api/img?url=${encodeURIComponent(`https://images.unsplash.com/${pid}?w=1200&q=80`)}`
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