// lib/phone-images.ts
import fs from 'fs'
import path from 'path'

const PHONE_IMAGES_DIR = path.join(process.cwd(), 'public', 'phone-images')
const UNSPLASH_ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY || ''
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

// Curated unique photo IDs per brand — guaranteed different images
const BRAND_PHOTO_IDS: Record<string, string[]> = {
  iphone:   ['1591337676887-a217a6970a8a','1510557880182-3d4d3cba35a5','1567581935013-3ae9b3af0b3f','1621330396098-05db95930b71','1585060544812-6b45742d762f'],
  apple:    ['1591337676887-a217a6970a8a','1510557880182-3d4d3cba35a5','1567581935013-3ae9b3af0b3f','1621330396098-05db95930b71','1585060544812-6b45742d762f'],
  samsung:  ['1610945415295-d9bbf067e59c','1546054454-aa26e2b734c7','1551650975-d399e0e37d00','1598965675045-45c5e72c7d05','1583573636255-455c5aba3e63'],
  oneplus:  ['1565849904461-04a58ad377e0','1574944985070-8f3ebc6b79d2','1511707171634-5f897ff02aa9','1601784551446-20c9e07cdbdb','1592899677977-9c10002761d5'],
  xiaomi:   ['1574944985070-8f3ebc6b79d2','1511707171634-5f897ff02aa9','1565849904461-04a58ad377e0','1592899677977-9c10002761d5','1598327105666-5b89351aff97'],
  redmi:    ['1574944985070-8f3ebc6b79d2','1511707171634-5f897ff02aa9','1565849904461-04a58ad377e0','1592899677977-9c10002761d5','1598327105666-5b89351aff97'],
  poco:     ['1598327105666-5b89351aff97','1601784551446-20c9e07cdbdb','1574944985070-8f3ebc6b79d2','1511707171634-5f897ff02aa9','1592899677977-9c10002761d5'],
  realme:   ['1511707171634-5f897ff02aa9','1574944985070-8f3ebc6b79d2','1565849904461-04a58ad377e0','1598327105666-5b89351aff97','1601784551446-20c9e07cdbdb'],
  oppo:     ['1601784551446-20c9e07cdbdb','1511707171634-5f897ff02aa9','1574944985070-8f3ebc6b79d2','1565849904461-04a58ad377e0','1592899677977-9c10002761d5'],
  vivo:     ['1592899677977-9c10002761d5','1574944985070-8f3ebc6b79d2','1511707171634-5f897ff02aa9','1601784551446-20c9e07cdbdb','1565849904461-04a58ad377e0'],
  motorola: ['1601784551446-20c9e07cdbdb','1574944985070-8f3ebc6b79d2','1511707171634-5f897ff02aa9','1592899677977-9c10002761d5','1598327105666-5b89351aff97'],
  nothing:  ['1598327105666-5b89351aff97','1601784551446-20c9e07cdbdb','1592899677977-9c10002761d5','1574944985070-8f3ebc6b79d2','1511707171634-5f897ff02aa9'],
  iqoo:     ['1565849904461-04a58ad377e0','1574944985070-8f3ebc6b79d2','1511707171634-5f897ff02aa9','1601784551446-20c9e07cdbdb','1592899677977-9c10002761d5'],
  google:   ['1598965675045-45c5e72c7d05','1583573636255-455c5aba3e63','1551650975-d399e0e37d00','1574944985070-8f3ebc6b79d2','1511707171634-5f897ff02aa9'],
  pixel:    ['1598965675045-45c5e72c7d05','1583573636255-455c5aba3e63','1551650975-d399e0e37d00','1574944985070-8f3ebc6b79d2','1511707171634-5f897ff02aa9'],
  infinix:  ['1574944985070-8f3ebc6b79d2','1511707171634-5f897ff02aa9','1565849904461-04a58ad377e0','1592899677977-9c10002761d5','1598327105666-5b89351aff97'],
}

const GENERIC_PHOTO_IDS = [
  '1511707171634-5f897ff02aa9',
  '1574944985070-8f3ebc6b79d2',
  '1565849904461-04a58ad377e0',
  '1592899677977-9c10002761d5',
  '1598327105666-5b89351aff97',
  '1601784551446-20c9e07cdbdb',
  '1546054454-aa26e2b734c7',
  '1610945415295-d9bbf067e59c',
]

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

function getUnsplashUrl(photoId: string): string {
  return `https://images.unsplash.com/photo-${photoId}?w=1200&q=80&fm=jpg&fit=crop`
}

export async function getPhoneImage(phoneName: string, index = 0): Promise<string> {
  // 1. LOCAL IMAGES FIRST
  const localImages = getLocalPhoneImages(phoneName)
  if (localImages.length > 0) {
    return localImages[index % localImages.length]
  }

  // 2. Unsplash API — fetch fresh varied results
  if (UNSPLASH_ACCESS_KEY) {
    try {
      const page = Math.floor(index / 10) + 1
      const perPage = 10
      const query = encodeURIComponent(`${phoneName} smartphone`)
      const res = await fetch(
        `https://api.unsplash.com/search/photos?query=${query}&per_page=${perPage}&page=${page}&orientation=landscape`,
        { headers: { Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}` } }
      )
      if (res.ok) {
        const { results = [] } = await res.json()
        if (results.length > 0) {
          const pick = results[index % results.length]
          // Direct CDN URL — no proxy needed
          return pick.urls.full || pick.urls.regular
        }
      }
    } catch { /* fall through */ }
  }

  // 3. Curated brand-specific photo IDs — each index gives a different image
  const n = phoneName.toLowerCase()
  for (const [key, ids] of Object.entries(BRAND_PHOTO_IDS)) {
    if (n.includes(key)) {
      return getUnsplashUrl(ids[index % ids.length])
    }
  }

  // 4. Generic fallback pool
  return getUnsplashUrl(GENERIC_PHOTO_IDS[index % GENERIC_PHOTO_IDS.length])
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