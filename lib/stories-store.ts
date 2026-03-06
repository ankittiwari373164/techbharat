// lib/stories-store.ts
// Dual-mode: Vercel KV (production) / JSON file (local dev)

const KV_KEY    = 'tb:stories'
const IS_VERCEL = !!process.env.KV_REST_API_URL

export interface WebStorySlide {
  id: string; headline: string; body: string; imageUrl: string; ctaText?: string; ctaLink?: string
}

export interface WebStory {
  id: string; slug: string; title: string; brand: string; category: string
  coverImage: string; slides: WebStorySlide[]; publishDate: string
  isPublished: boolean; tags: string[]; seoTitle: string; seoDescription: string
}

// ── KV ──────────────────────────────────────────────────────────
async function kvGet(): Promise<WebStory[]> {
  const { kv } = await import('@vercel/kv')
  return (await kv.get<WebStory[]>(KV_KEY)) || []
}
async function kvSet(stories: WebStory[]): Promise<void> {
  const { kv } = await import('@vercel/kv')
  await kv.set(KV_KEY, stories)
}

// ── File ────────────────────────────────────────────────────────
function fileGet(): WebStory[] {
  const fs = require('fs'), path = require('path')
  const FILE = path.join(process.cwd(), 'data', 'stories.json')
  try {
    const dir = path.join(process.cwd(), 'data')
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
    if (!fs.existsSync(FILE)) fs.writeFileSync(FILE, '[]')
    return JSON.parse(fs.readFileSync(FILE, 'utf-8'))
  } catch { return [] }
}
function fileSet(stories: WebStory[]): void {
  const fs = require('fs'), path = require('path')
  const FILE = path.join(process.cwd(), 'data', 'stories.json')
  const dir  = path.join(process.cwd(), 'data')
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
  fs.writeFileSync(FILE, JSON.stringify(stories, null, 2))
}

// ── Public API ──────────────────────────────────────────────────
export async function getAllStoriesAsync(): Promise<WebStory[]> {
  return IS_VERCEL ? kvGet() : fileGet()
}
export async function saveStoriesAsync(stories: WebStory[]): Promise<void> {
  IS_VERCEL ? await kvSet(stories) : fileSet(stories)
}
export async function addStoryAsync(story: WebStory): Promise<void> {
  const all = await getAllStoriesAsync()
  if (all.find(s => s.slug === story.slug)) return
  all.unshift(story)
  await saveStoriesAsync(all)
}

// Sync versions for server components (file-only / fallback)
export function getAllStories(): WebStory[] { return IS_VERCEL ? [] : fileGet() }
export function getPublishedStories(): WebStory[] { return getAllStories().filter(s => s.isPublished) }
export function getStoryBySlug(slug: string): WebStory | null { return getAllStories().find(s => s.slug === slug) || null }
export function saveStories(stories: WebStory[]): void { if (!IS_VERCEL) fileSet(stories) }
export function addStory(story: WebStory): void {
  if (IS_VERCEL) { addStoryAsync(story).catch(console.error) }
  else {
    const all = fileGet()
    if (all.find(s => s.slug === story.slug)) return
    all.unshift(story); fileSet(all)
  }
}

// Async versions for API routes
export async function getPublishedStoriesAsync(): Promise<WebStory[]> {
  const all = await getAllStoriesAsync()
  return all.filter(s => s.isPublished)
}
export async function getStoryBySlugAsync(slug: string): Promise<WebStory | null> {
  const all = await getAllStoriesAsync()
  return all.find(s => s.slug === slug) || null
}

export function generateStorySlug(title: string): string {
  return title.toLowerCase().replace(/[^a-z0-9\s-]/g,'').replace(/\s+/g,'-').replace(/-+/g,'-').trim().slice(0,80)
    + '-story-' + Date.now().toString().slice(-6)
}