// lib/store-fixed.ts
export type ArticleType = 'mobile-news' | 'review' | 'compare'

export interface Review {
  name: string
  location?: string
  rating: number
  text: string
  date: string
  avatar?: string
}

export interface Article {
  id: string
  slug: string
  title: string
  type: ArticleType
  category: string
  brand: string
  publishDate: string
  updatedDate?: string
  author: string
  readTime: number
  featuredImage: string
  images: string[]
  summary: string
  bullets: string[]
  content: string
  tags: string[]
  relatedSlugs: string[]
  reviews: Review[]
  quickSummary: { brand: string; date: string; bullets: string[] }
  seoTitle: string
  seoDescription: string
  isFeatured: boolean
  wordCount?: number
  isEvergreen?: boolean
}

const KV_KEY = 'tb:articles'
const IS_VERCEL =
  process.env.NODE_ENV === 'production' &&
  !!process.env.KV_REST_API_URL

async function getRedis() {
  try {
    const { Redis } = await import('@upstash/redis')
    return new Redis({
      url: process.env.KV_REST_API_URL!,
      token: process.env.KV_REST_API_TOKEN!,
    })
  } catch (err) {
    console.error('[TB] Redis init error:', err)
    return null
  }
}

async function kvGet(): Promise<Article[]> {
  try {
    const redis = await getRedis()
    if (!redis) return []
    const data = await redis.get<Article[]>(KV_KEY)
    return Array.isArray(data) ? data : []
  } catch (err) {
    console.error('[TB] KV get error:', err)
    return []
  }
}

async function kvSet(articles: Article[]): Promise<void> {
  try {
    const redis = await getRedis()
    if (!redis) return
    if (Array.isArray(articles)) {
      await redis.set(KV_KEY, articles)
    }
  } catch (err) {
    console.error('[TB] KV set error:', err)
  }
}

function fileGet(): Article[] {
  try {
    const fs = require('fs')
    const path = require('path')
    const FILE = path.join(process.cwd(), 'data', 'articles.json')

    const dir = path.join(process.cwd(), 'data')
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true })
    }
    if (!fs.existsSync(FILE)) {
      fs.writeFileSync(FILE, '[]')
      return []
    }

    const data = JSON.parse(fs.readFileSync(FILE, 'utf-8'))
    return Array.isArray(data) ? data : []
  } catch (err) {
    console.error('[TB] File get error:', err)
    return []
  }
}

function fileSet(articles: Article[]): void {
  try {
    const fs = require('fs')
    const path = require('path')
    const FILE = path.join(process.cwd(), 'data', 'articles.json')
    const dir = path.join(process.cwd(), 'data')

    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true })
    }

    if (Array.isArray(articles)) {
      fs.writeFileSync(FILE, JSON.stringify(articles, null, 2))
    }
  } catch (err) {
    console.error('[TB] File set error:', err)
  }
}

// ── ASYNC FUNCTIONS (for server components) ──
export async function getAllArticlesAsync(): Promise<Article[]> {
  try {
    // Always prefer file for rendering stability
    const articles = fileGet()
    return Array.isArray(articles) ? articles : []
  } catch (err) {
    console.error('[TB] getAllArticlesAsync error:', err)
    return []
  }
}

export async function saveArticlesAsync(articles: Article[]): Promise<void> {
  try {
    if (!Array.isArray(articles)) return
    if (IS_VERCEL) {
      await kvSet(articles)
    } else {
      fileSet(articles)
    }
  } catch (err) {
    console.error('[TB] saveArticlesAsync error:', err)
  }
}

export async function addArticleAsync(article: Article): Promise<void> {
  try {
    if (!article?.slug) return
    const all = await getAllArticlesAsync()
    if (all.find(a => a?.slug === article.slug)) return
    const updated = [article, ...all].slice(0, 200)
    await saveArticlesAsync(updated)
  } catch (err) {
    console.error('[TB] addArticleAsync error:', err)
  }
}

export async function getArticleBySlugAsync(slug: string): Promise<Article | null> {
  try {
    if (!slug) return null
    const all = await getAllArticlesAsync()
    return all.find(a => a?.slug === slug) || null
  } catch (err) {
    console.error('[TB] getArticleBySlugAsync error:', err)
    return null
  }
}

export async function getFeaturedArticleAsync(): Promise<Article | null> {
  try {
    const all = await getAllArticlesAsync()
    return all.find(a => a?.isFeatured) || all[0] || null
  } catch (err) {
    console.error('[TB] getFeaturedArticleAsync error:', err)
    return null
  }
}

export async function getSimilarArticlesAsync(
  article: Article,
  limit = 3
): Promise<Article[]> {
  try {
    if (!article?.id) return []
    const all = await getAllArticlesAsync()
    return all
      .filter(a => a?.id !== article.id && (a?.brand === article.brand || a?.type === article.type))
      .slice(0, limit)
  } catch (err) {
    console.error('[TB] getSimilarArticlesAsync error:', err)
    return []
  }
}

export async function getArticlesByTypeAsync(type: ArticleType): Promise<Article[]> {
  try {
    const all = await getAllArticlesAsync()
    return all.filter(a => a?.type === type)
  } catch (err) {
    console.error('[TB] getArticlesByTypeAsync error:', err)
    return []
  }
}

// ── SYNC FUNCTIONS (for client/static generation) ──
export function getAllArticles(): Article[] {
  try {
    return IS_VERCEL ? [] : fileGet()
  } catch (err) {
    console.error('[TB] getAllArticles error:', err)
    return []
  }
}

export function saveArticles(articles: Article[]): void {
  try {
    if (!IS_VERCEL) fileSet(articles)
  } catch (err) {
    console.error('[TB] saveArticles error:', err)
  }
}

export function addArticle(article: Article): void {
  try {
    if (!article?.slug) return
    if (IS_VERCEL) {
      addArticleAsync(article).catch(console.error)
    } else {
      const all = fileGet()
      if (all.find(a => a?.slug === article.slug)) return
      fileSet([article, ...all].slice(0, 200))
    }
  } catch (err) {
    console.error('[TB] addArticle error:', err)
  }
}

export function getArticleBySlug(slug: string): Article | null {
  try {
    if (!slug) return null
    const all = fileGet()
    return all.find(a => a?.slug === slug) || null
  } catch (err) {
    console.error('[TB] getArticleBySlug error:', err)
    return null
  }
}

export function getFeaturedArticle(): Article | null {
  try {
    const all = fileGet()
    return all.find(a => a?.isFeatured) || all[0] || null
  } catch (err) {
    console.error('[TB] getFeaturedArticle error:', err)
    return null
  }
}

export function getSimilarArticles(article: Article, limit = 3): Article[] {
  try {
    if (!article?.id) return []
    const all = fileGet()
    return all
      .filter(a => a?.id !== article.id && (a?.brand === article.brand || a?.type === article.type))
      .slice(0, limit)
  } catch (err) {
    console.error('[TB] getSimilarArticles error:', err)
    return []
  }
}

export function getArticlesByType(type: ArticleType): Article[] {
  try {
    const all = fileGet()
    return all.filter(a => a?.type === type)
  } catch (err) {
    console.error('[TB] getArticlesByType error:', err)
    return []
  }
}

export function generateSlug(title: string): string {
  try {
    if (!title || typeof title !== 'string') return 'article'
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()
      .slice(0, 80)
  } catch (err) {
    console.error('[TB] generateSlug error:', err)
    return 'article'
  }
}