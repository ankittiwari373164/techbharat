// lib/seo-store.ts
// Central SEO data store — reads/writes dynamic metadata from Redis
// Updated every 20 hours by seo-cron based on Google Trends

import { Redis } from '@upstash/redis'

export interface PageSeoData {
  title:           string
  description:     string
  keywords:        string[]
  focusKeyword:    string
  lastUpdated:     number
  trendKeywords:   string[]   // injected from Google Trends India
}

export interface ArticleSeoData {
  seoTitle:        string
  metaDescription: string
  focusKeyword:    string
  secondaryKeywords: string[]
  lastUpdated:     number
}

export interface SiteTrafficData {
  gscQueries:   GscRow[]
  gscPages:     GscRow[]
  period:       string
  lastFetched:  number
}

export interface GscRow {
  keys:        string[]
  clicks:      number
  impressions: number
  ctr:         number
  position:    number
}

// Page keys stored in Redis
export const PAGE_KEYS = [
  'home', 'mobile-news', 'reviews', 'compare', 'web-stories', 'about', 'author'
] as const
export type PageKey = typeof PAGE_KEYS[number]

function getRedis() {
  return new Redis({
    url:   process.env.KV_REST_API_URL!,
    token: process.env.KV_REST_API_TOKEN!,
  })
}

// ── Page SEO ──────────────────────────────────────────────────────────────────

export async function getPageSeo(page: PageKey): Promise<PageSeoData | null> {
  try {
    const kv  = getRedis()
    const raw = await kv.get(`seo:page:${page}`)
    if (!raw) return null
    return typeof raw === 'string' ? JSON.parse(raw) : raw as PageSeoData
  } catch { return null }
}

export async function setPageSeo(page: PageKey, data: PageSeoData): Promise<void> {
  const kv = getRedis()
  await kv.set(`seo:page:${page}`, JSON.stringify(data))
}

export async function getAllPageSeo(): Promise<Record<string, PageSeoData>> {
  const kv = getRedis()
  const result: Record<string, PageSeoData> = {}
  for (const page of PAGE_KEYS) {
    const raw = await kv.get(`seo:page:${page}`)
    if (raw) result[page] = typeof raw === 'string' ? JSON.parse(raw) : raw as PageSeoData
  }
  return result
}

// ── Article SEO ───────────────────────────────────────────────────────────────

export async function getArticleSeo(slug: string): Promise<ArticleSeoData | null> {
  try {
    const kv  = getRedis()
    const raw = await kv.get(`article:${slug}`) as Record<string, unknown> | null
    if (!raw || !raw.seoTitle) return null
    return {
      seoTitle:          raw.seoTitle as string,
      metaDescription:   raw.seoDescription as string || raw.metaDescription as string || '',
      focusKeyword:      raw.focusKeyword as string || '',
      secondaryKeywords: raw.secondaryKeywords as string[] || [],
      lastUpdated:       raw.seoUpdatedAt as number || 0,
    }
  } catch { return null }
}

// ── Traffic / GSC ─────────────────────────────────────────────────────────────

export async function getSiteTraffic(): Promise<SiteTrafficData | null> {
  try {
    const kv  = getRedis()
    const raw = await kv.get('seo:gsc:data')
    if (!raw) return null
    return typeof raw === 'string' ? JSON.parse(raw) : raw as SiteTrafficData
  } catch { return null }
}

export async function setSiteTraffic(data: SiteTrafficData): Promise<void> {
  const kv = getRedis()
  await kv.set('seo:gsc:data', JSON.stringify(data))
}

// ── Trends ────────────────────────────────────────────────────────────────────

export async function getStoredTrends(): Promise<{ title: string; traffic: string }[]> {
  try {
    const kv  = getRedis()
    const raw = await kv.get('seo:trends:india')
    if (!raw) return []
    const data = typeof raw === 'string' ? JSON.parse(raw) : raw as { trends: { title: string; traffic: string }[]; ts: number }
    return data.trends || []
  } catch { return [] }
}

// ── Cron log ──────────────────────────────────────────────────────────────────

export async function getCronLog(): Promise<{ log: string[]; ts: number } | null> {
  try {
    const kv  = getRedis()
    const raw = await kv.get('seo:cron_log')
    if (!raw) return null
    return typeof raw === 'string' ? JSON.parse(raw) : raw as { log: string[]; ts: number }
  } catch { return null }
}