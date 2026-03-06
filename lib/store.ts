// lib/store.ts
// ═══════════════════════════════════════════════════════════════
// Dual-mode store:
//   • LOCAL DEV  → reads/writes data/articles.json (file system)
//   • PRODUCTION → reads/writes Vercel KV (Redis)
//
// Vercel KV env vars are auto-injected when you link the KV database.
// No code change needed between environments — it auto-detects.
// ═══════════════════════════════════════════════════════════════

export type ArticleType = 'mobile-news' | 'review' | 'compare'

export interface Review {
  name: string; location: string; rating: number; text: string; date: string; avatar?: string
}

export interface Article {
  id: string; slug: string; title: string; type: ArticleType; category: string
  brand: string; publishDate: string; updatedDate?: string; author: string
  readTime: number; featuredImage: string; images: string[]; summary: string
  bullets: string[]; content: string; tags: string[]; relatedSlugs: string[]
  reviews: Review[]; quickSummary: { brand: string; date: string; bullets: string[] }
  seoTitle: string; seoDescription: string; isFeatured: boolean
}

const KV_KEY    = 'tb:articles'
const IS_VERCEL = !!process.env.KV_REST_API_URL

// ── KV (production) ────────────────────────────────────────────
async function kvGet(): Promise<Article[]> {
  const { kv } = await import('@vercel/kv')
  const data = await kv.get<Article[]>(KV_KEY)
  return data || []
}

async function kvSet(articles: Article[]): Promise<void> {
  const { kv } = await import('@vercel/kv')
  await kv.set(KV_KEY, articles)
}

// ── File (local dev) ────────────────────────────────────────────
function fileGet(): Article[] {
  const fs   = require('fs')
  const path = require('path')
  const FILE = path.join(process.cwd(), 'data', 'articles.json')
  try {
    const dir = path.join(process.cwd(), 'data')
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
    if (!fs.existsSync(FILE)) fs.writeFileSync(FILE, '[]')
    return JSON.parse(fs.readFileSync(FILE, 'utf-8'))
  } catch { return [] }
}

function fileSet(articles: Article[]): void {
  const fs   = require('fs')
  const path = require('path')
  const FILE = path.join(process.cwd(), 'data', 'articles.json')
  const dir  = path.join(process.cwd(), 'data')
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
  fs.writeFileSync(FILE, JSON.stringify(articles, null, 2))
}

// ── Public API ──────────────────────────────────────────────────
export async function getAllArticlesAsync(): Promise<Article[]> {
  return IS_VERCEL ? kvGet() : fileGet()
}

export async function saveArticlesAsync(articles: Article[]): Promise<void> {
  IS_VERCEL ? await kvSet(articles) : fileSet(articles)
}

export async function addArticleAsync(article: Article): Promise<void> {
  const all = await getAllArticlesAsync()
  if (all.find(a => a.slug === article.slug)) return
  all.unshift(article)
  await saveArticlesAsync(all.slice(0, 200))
}

// ── Sync wrappers (for server components that can't await at top level) ──
// These fall back to file-based only — used in page.tsx server components
export function getAllArticles(): Article[] {
  if (IS_VERCEL) {
    // On Vercel, server components should use getAllArticlesAsync()
    // This sync version returns [] as fallback — pages use async versions
    return []
  }
  return fileGet()
}

export function saveArticles(articles: Article[]): void {
  if (!IS_VERCEL) fileSet(articles)
}

export function addArticle(article: Article): void {
  if (IS_VERCEL) {
    // Fire-and-forget for Vercel (API routes should use addArticleAsync)
    addArticleAsync(article).catch(console.error)
  } else {
    const all = fileGet()
    if (all.find(a => a.slug === article.slug)) return
    all.unshift(article)
    fileSet(all.slice(0, 200))
  }
}

export function getArticleBySlug(slug: string): Article | null {
  return fileGet().find(a => a.slug === slug) || null
}

export async function getArticleBySlugAsync(slug: string): Promise<Article | null> {
  const all = await getAllArticlesAsync()
  return all.find(a => a.slug === slug) || null
}

export async function getFeaturedArticleAsync(): Promise<Article | null> {
  const all = await getAllArticlesAsync()
  return all.find(a => a.isFeatured) || all[0] || null
}

export function getFeaturedArticle(): Article | null {
  const all = getAllArticles()
  return all.find(a => a.isFeatured) || all[0] || null
}

export function getSimilarArticles(article: Article, limit = 3): Article[] {
  return fileGet().filter(a => a.id !== article.id && (a.brand === article.brand || a.type === article.type)).slice(0, limit)
}

export async function getSimilarArticlesAsync(article: Article, limit = 3): Promise<Article[]> {
  const all = await getAllArticlesAsync()
  return all.filter(a => a.id !== article.id && (a.brand === article.brand || a.type === article.type)).slice(0, limit)
}

export function getArticlesByType(type: ArticleType): Article[] {
  return fileGet().filter(a => a.type === type)
}

export async function getArticlesByTypeAsync(type: ArticleType): Promise<Article[]> {
  const all = await getAllArticlesAsync()
  return all.filter(a => a.type === type)
}

export function generateSlug(title: string): string {
  return title.toLowerCase().replace(/[^a-z0-9\s-]/g,'').replace(/\s+/g,'-').replace(/-+/g,'-').trim().slice(0,80)
}