// lib/phone-images.ts
import fs from 'fs'
import path from 'path'

const PHONE_IMAGES_DIR = path.join(process.cwd(), 'public', 'phone-images')
const UNSPLASH_ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY || ''
const EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp']

export function normalizePhoneName(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9\s]/g, '').replace(/\s+/g, '-').trim()
}

export function getLocalPhoneImages(phoneName: string): string[] {
  try {
    const slug = normalizePhoneName(phoneName)
    const dir = path.join(PHONE_IMAGES_DIR, slug)
    if (!fs.existsSync(dir)) return []
    return fs.readdirSync(dir)
      .filter(f => EXTENSIONS.some(ext => f.toLowerCase().endsWith(ext)))
      .sort((a, b) => (parseInt(a.split('.')[0]) || 0) - (parseInt(b.split('.')[0]) || 0))
      .map(f => `/phone-images/${slug}/${f}`)
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

  // 3. Unsplash source — no API key needed
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