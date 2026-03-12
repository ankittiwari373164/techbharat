// lib/phone-images.ts
// ─────────────────────────────────────────────────────────────────────────────
// Image resolution order (simple & strict):
//   1. public/phone-images/{Brand}/   → use local image
//   2. Brand folder missing           → Unsplash API (proxied through /api/img)
//   3. Unsplash API fails             → Unsplash source URL (no key needed)
//
// NO Picsum. NO random placeholder images. Ever.
// ─────────────────────────────────────────────────────────────────────────────

import fs   from 'fs'
import path from 'path'

const PHONE_IMAGES_DIR = path.join(process.cwd(), 'public', 'phone-images')
const UNSPLASH_KEY     = process.env.UNSPLASH_ACCESS_KEY || ''
const SITE_URL         = process.env.SITE_URL || 'https://thetechbharat.com'
const EXTENSIONS       = ['.jpg', '.jpeg', '.png', '.webp']

// ── Brand → exact folder name (matches your public/phone-images/ folders) ─
const BRAND_FOLDER_MAP: Record<string, string> = {
  // Folders you HAVE:
  'apple':         'iphone',
  'iphone':        'iphone',
  'google pixel':  'google_pixel',
  'google':        'google_pixel',
  'pixel':         'google_pixel',
  'iqoo':          'IQOO',
  'motorola':      'motorola',
  'moto':          'motorola',
  'nothing':       'nothing_',
  'nothing phone': 'nothing_',
  'oneplus':       'Oneplus',
  'one plus':      'Oneplus',
  'oppo':          'oppo',
  'poco':          'poco',
  'realme':        'Realme',
  'xiaomi':        'Xiaomi',
  'redmi':         'Xiaomi',
  // Samsung, Vivo, Sony etc. → NO folder → will use Unsplash automatically
}

// ── Resolve brand string → folder name ────────────────────────────────────
export function resolveBrandFolder(input: string): string | null {
  const s = input
    .toLowerCase()
    .replace(/\s*(smartphone|phone|mobile|device|india)s?\s*/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim()

  // Exact match
  if (BRAND_FOLDER_MAP[s]) return BRAND_FOLDER_MAP[s]

  // Partial match — longest key first so "google pixel" beats "google"
  const keys = Object.keys(BRAND_FOLDER_MAP).sort((a, b) => b.length - a.length)
  for (const key of keys) {
    if (s.includes(key)) return BRAND_FOLDER_MAP[key]
  }
  return null
}

// ── Get local images for a brand ──────────────────────────────────────────
export function getLocalPhoneImages(phoneName: string): string[] {
  try {
    const folder = resolveBrandFolder(phoneName)
    if (!folder) return []

    const dir = path.join(PHONE_IMAGES_DIR, folder)
    if (!fs.existsSync(dir)) return []

    return fs.readdirSync(dir)
      .filter(f => EXTENSIONS.some(ext => f.toLowerCase().endsWith(ext)))
      .sort((a, b) => (parseInt(a) || 0) - (parseInt(b) || 0))
      .map(f => `/phone-images/${folder}/${f}`)
  } catch {
    return []
  }
}

// ── Build Unsplash query for brands without local folders ─────────────────
function buildQuery(phoneName: string): string {
  const n = phoneName.toLowerCase().replace(/smartphone|phone|mobile/gi, '').trim()
  if (n.includes('samsung'))  return 'Samsung Galaxy smartphone'
  if (n.includes('vivo'))     return 'Vivo smartphone'
  if (n.includes('sony'))     return 'Sony Xperia smartphone'
  if (n.includes('honor'))    return 'Honor smartphone'
  if (n.includes('nokia'))    return 'Nokia smartphone'
  if (n.includes('infinix'))  return 'Infinix smartphone India'
  if (n.includes('tecno'))    return 'Tecno smartphone India'
  return 'smartphone technology'
}

// ── Get one image — LOCAL first, then Unsplash ────────────────────────────
export async function getPhoneImage(phoneName: string, index = 0): Promise<string> {

  // 1. Local folder
  const local = getLocalPhoneImages(phoneName)
  if (local.length > 0) {
    return local[index % local.length]
  }

  // 2. Unsplash API
  const query = buildQuery(phoneName)
  if (UNSPLASH_KEY) {
    try {
      const res = await fetch(
        `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=15&orientation=landscape`,
        { headers: { Authorization: `Client-ID ${UNSPLASH_KEY}` }, next: { revalidate: 3600 } }
      )
      if (res.ok) {
        const { results = [] } = await res.json()
        if (results.length > 0) {
          const url = `${results[index % results.length].urls.regular}&w=1600&q=85&fit=crop&crop=center`
          return `${SITE_URL}/api/img?url=${encodeURIComponent(url)}`
        }
      }
    } catch { /* fall through */ }
  }

  // 3. Unsplash source (no API key needed — always tech-relevant)
  return `https://source.unsplash.com/1600x900/?${encodeURIComponent(query)}`
}

// ── Get multiple images for an article ───────────────────────────────────
export async function getArticleImages(phoneName: string, count = 5): Promise<string[]> {
  const out: string[] = []
  for (let i = 0; i < count; i++) out.push(await getPhoneImage(phoneName, i))
  return out
}

// ── Admin: list all brands + local image status ───────────────────────────
export function getAvailableLocalBrands(): { brand: string; folder: string; count: number }[] {
  try {
    if (!fs.existsSync(PHONE_IMAGES_DIR)) return []
    return fs.readdirSync(PHONE_IMAGES_DIR, { withFileTypes: true })
      .filter(d => d.isDirectory())
      .map(d => {
        const count = fs.readdirSync(path.join(PHONE_IMAGES_DIR, d.name))
          .filter(f => EXTENSIONS.some(ext => f.toLowerCase().endsWith(ext))).length
        return { brand: d.name, folder: d.name, count }
      })
      .filter(b => b.count > 0)
  } catch { return [] }
}

export function normalizePhoneName(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9\s]/g, '').replace(/\s+/g, '-').trim()
}

// ── Legacy export alias (used by app/api/phone-images/route.ts) ──────────
export function listPhonesWithImages(): { name: string; slug: string; count: number }[] {
  return getAvailableLocalBrands().map(b => ({
    name:  b.brand.replace(/-/g, ' '),
    slug:  b.folder,
    count: b.count,
  }))
}