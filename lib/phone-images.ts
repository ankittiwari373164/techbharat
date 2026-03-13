// lib/phone-images.ts
import fs from 'fs'
import path from 'path'

const PHONE_IMAGES_DIR = path.join(process.cwd(), 'public', 'phone-images')
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
  // 1. Brand-specific folder
  const brandImages = getLocalPhoneImages(phoneName)
  if (brandImages.length > 0) return brandImages[index % brandImages.length]

  // 2. No brand folder — use any image from any folder
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