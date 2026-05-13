// lib/store.ts
// =====================================================================
//  ADSENSE REMEDIATION
// ---------------------------------------------------------------------
//  Key fixes from the audit:
//    1. Removed generateStoredVerdict() — it shuffled boilerplate
//       phrases like "delivers a stable overall experience" and
//       "faces strong competition" and attached one to every newly
//       added article, regardless of whether it was about a phone.
//       This created the "Mobile delivers a stable experience but
//       doesn't lead its segment" filler that ArticleClient now
//       refuses to render anyway. We stop generating it at the
//       source so it stops landing in the DB at all.
//    2. Added optional `noindex` flag on Article for editorial
//       quality gating (set true to noindex a thin article).
//    3. addArticleAsync()/addArticle() no longer mutate the
//       incoming article object with a fabricated verdict.
// =====================================================================
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
  /**
   * Set to true to mark an article as low-quality / not ready for
   * search indexing. The article will still render at its URL (so
   * internal links and direct visits work) but will emit
   * `<meta name="robots" content="noindex,follow">` and be excluded
   * from sitemaps. Use for: very thin articles, draft content,
   * pre-launch articles you haven't fact-checked yet.
   */
  noindex?: boolean
  /**
   * Optional editorial verdict. ONLY set this by hand or via a
   * dedicated editor — NEVER fabricate it from string pools.
   * ArticleClient validates and hides any verdict that matches
   * known filler signatures.
   */
  verdict?: {
    buy: string
    notBuy: string
    final: string
  }
}

const KV_KEY    = 'tb:articles'
const IS_VERCEL = !!process.env.KV_REST_API_URL

async function getRedis() {
  const { Redis } = await import('@upstash/redis')
  return new Redis({
    url:   process.env.KV_REST_API_URL!,
    token: process.env.KV_REST_API_TOKEN!,
  })
}

async function kvGet(): Promise<Article[]> {
  try {
    const redis = await getRedis()
    const data = await redis.get<Article[]>(KV_KEY)
    if (!Array.isArray(data)) return []
    return data
  } catch {
    return []
  }
}

async function kvSet(articles: Article[]): Promise<void> {
  const redis = await getRedis()
  await redis.set(KV_KEY, articles)
}

function fileGet(): Article[] {
  const fs = require('fs'), path = require('path')
  const FILE = path.join(process.cwd(), 'data', 'articles.json')
  try {
    const dir = path.join(process.cwd(), 'data')
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
    if (!fs.existsSync(FILE)) fs.writeFileSync(FILE, '[]')
    return JSON.parse(fs.readFileSync(FILE, 'utf-8'))
  } catch { return [] }
}

function fileSet(articles: Article[]): void {
  const fs = require('fs'), path = require('path')
  const FILE = path.join(process.cwd(), 'data', 'articles.json')
  const dir  = path.join(process.cwd(), 'data')
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
  fs.writeFileSync(FILE, JSON.stringify(articles, null, 2))
}

export async function getAllArticlesAsync(): Promise<Article[]> {
  const data = IS_VERCEL ? await kvGet() : fileGet()
  if (!Array.isArray(data)) return []
  return data
}

export async function saveArticlesAsync(articles: Article[]): Promise<void> {
  IS_VERCEL ? await kvSet(articles) : fileSet(articles)
}

export async function addArticleAsync(article: Article): Promise<void> {
  const all = await getAllArticlesAsync()
  if (all.find(a => a.slug === article.slug)) return
  // NOTE: We intentionally do NOT auto-fill article.verdict here.
  // Auto-generated verdicts triggered AdSense "low value content"
  // because they used templated text pooled by hash. Any missing
  // verdict simply stays undefined; ArticleClient renders nothing.
  all.unshift(article)
  await saveArticlesAsync(all.slice(0, 200))
}

export function getAllArticles(): Article[] {
  return IS_VERCEL ? [] : fileGet()
}

export function saveArticles(articles: Article[]): void {
  if (!IS_VERCEL) fileSet(articles)
}

export function addArticle(article: Article): void {
  if (IS_VERCEL) { addArticleAsync(article).catch(console.error) }
  else {
    const all = fileGet()
    if (all.find(a => a.slug === article.slug)) return
    // No autogen verdict — see addArticleAsync comment above.
    all.unshift(article); fileSet(all.slice(0, 200))
  }
}

export async function getArticleBySlugAsync(slug: string): Promise<Article | null> {
  const all = await getAllArticlesAsync()
  if (!slug) return null
  return all.find(a => a.slug === slug) || null
}

export function getArticleBySlug(slug: string): Article | null {
  return fileGet().find(a => a.slug === slug) || null
}

export async function getFeaturedArticleAsync(): Promise<Article | null> {
  const all = await getAllArticlesAsync()
  return all.find(a => a.isFeatured) || all[0] || null
}

export function getFeaturedArticle(): Article | null {
  const all = getAllArticles()
  return all.find(a => a.isFeatured) || all[0] || null
}

export async function getSimilarArticlesAsync(article: Article, limit = 3): Promise<Article[]> {
  const all = await getAllArticlesAsync()
  if (!article) return []
  return all.filter(a => a.id !== article.id && (a.brand === article.brand || a.type === article.type)).slice(0, limit)
}

export function getSimilarArticles(article: Article, limit = 3): Article[] {
  return fileGet().filter(a => a.id !== article.id && (a.brand === article.brand || a.type === article.type)).slice(0, limit)
}

export async function getArticlesByTypeAsync(type: ArticleType): Promise<Article[]> {
  const all = await getAllArticlesAsync()
  return all.filter(a => a.type === type)
}

export function getArticlesByType(type: ArticleType): Article[] {
  return fileGet().filter(a => a.type === type)
}

export function generateSlug(title: string): string {
  return title.toLowerCase().replace(/[^a-z0-9\s-]/g,'').replace(/\s+/g,'-').replace(/-+/g,'-').trim().slice(0,80)
}
