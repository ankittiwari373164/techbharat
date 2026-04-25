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

    // ✅ FIX: always return array (AdSense safe)
    if (!Array.isArray(data)) return []

    return data
  } catch {
    return [] // ✅ never crash
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

  // ✅ FIX: always safe array
  if (!Array.isArray(data)) return []

  return data
}

export async function saveArticlesAsync(articles: Article[]): Promise<void> {
  IS_VERCEL ? await kvSet(articles) : fileSet(articles)
}



export async function addArticleAsync(article: Article): Promise<void> {
  const all = await getAllArticlesAsync()
  if (all.find(a => a.slug === article.slug)) return
  if (!article.verdict) {
    article.verdict = generateStoredVerdict(article)
  }

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
    if (!article.verdict) {
      article.verdict = generateStoredVerdict(article)
    }
    all.unshift(article); fileSet(all.slice(0, 200))
  }
}

export async function getArticleBySlugAsync(slug: string): Promise<Article | null> {
  const all = await getAllArticlesAsync()

  // ✅ FIX: prevent crash
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

  // ✅ FIX: prevent crash
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

function generateStoredVerdict(article: Article) {
  const seed = article.slug.length + article.title.length

  const pick = (arr: string[], i: number) => arr[(seed + i) % arr.length]

  const brand = article.brand || 'This device'

  // Different sentence pools
  const buyPool = [
    `${brand} is a good fit for users who want a balanced everyday experience.`,
    `This device suits users who are looking for practical performance and usability.`,
    `A solid option for users who don’t want to overspend but still want reliability.`,
    `Best for users who want a simple, dependable smartphone experience.`
  ]

  const notBuyPool = [
    `Not the right choice for users expecting flagship-level performance.`,
    `Power users may find this device limiting in the long run.`,
    `Not ideal if you want top-tier camera or gaming capabilities.`,
    `Skip this if your priority is high-end performance or premium features.`
  ]

  const verdictPool = [
    `${brand} delivers a stable overall experience, but faces strong competition.`,
    `Overall, this is a practical device, but not the most exciting option available.`,
    `It gets the basics right, though it doesn’t stand out in its category.`,
    `A sensible choice for the right user, but not a category leader.`
  ]

  return {
    buy: pick(buyPool, 1),
    notBuy: pick(notBuyPool, 2),
    final: pick(verdictPool, 3),
  }
}