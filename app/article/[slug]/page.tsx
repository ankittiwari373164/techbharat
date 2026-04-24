// app/article/[slug]/page.tsx
// ── SERVER COMPONENT — full HTML in initial response for crawlers/SEO ──
import { getAllArticlesAsync } from '@/lib/store'
import type { Metadata } from 'next'
import ArticleClient from './ArticleClient'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://thetechbharat.com'

interface PageProps {
  params: { slug: string }
}

export async function generateStaticParams() {
  try {
    const articles = await getAllArticlesAsync() as { slug: string; contentQuality?: number }[]
    return articles
      .filter(a => {
        const quality = a.contentQuality ?? 5
        return quality >= 6 && !(a as any).isLowValue
      })
      .map(a => ({ slug: a.slug }))
  } catch { return [] }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  try {
    const articles = await getAllArticlesAsync() as any[]
    const article = articles.find(a => a.slug === params.slug)

    if (!article || article.isLowValue || (article.contentQuality ?? 5) < 6) {
      return {
        robots: { index: false, follow: false },
        title: 'Article Not Found | The Tech Bharat'
      }
    }

    const rawTitle = (article.seoTitle || article.title).replace(/\s*\|\s*The Tech Bharat\s*$/i, '').trim()
    const title = rawTitle.length > 70 ? rawTitle.slice(0, 70) : rawTitle
    const description = article.seoDescription || article.summary?.slice(0, 155) || ''
    const canonical = `${SITE_URL}/${params.slug}`

    return {
      title,
      description,
      keywords: [...(article.tags || []), article.brand || '', article.category || ''].filter(Boolean),
      robots: { index: true, follow: true },
      alternates: { canonical }
    }
  } catch {
    return { title: 'The Tech Bharat' }
  }
}

export default async function ArticlePage({ params }: PageProps) {
  const { slug } = params
  let article: any = null
  let similar: unknown[] = []

  try {
    const articles = await getAllArticlesAsync() as any[]
    article = articles.find((a: any) => a.slug === slug) || null

    if (article?.isLowValue || (article?.contentQuality ?? 5) < 6) {
      article = null
    }

    if (article) {
      const qualityArticles = articles.filter((a: any) => (a.contentQuality ?? 5) >= 6 && !a.isLowValue)
      similar = qualityArticles.filter((a: any) => a.slug !== slug).slice(0, 4)
    }
  } catch {}

  if (!article) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h1 className="font-playfair text-3xl font-bold mb-4">Article Not Found</h1>
        <a href="/" className="font-sans text-[#d4220a] hover:underline">← Back to Home</a>
      </div>
    )
  }

  // ✅ FIX: SAFE CONTENT HANDLING (MAIN FIX)
  const safeContent = typeof article.content === 'string' ? article.content : ''

  const plainText = safeContent
    .replace(/<[^>]*>/g, '')
    .replace(/\s+/g, ' ')
    .trim()

  const actualWordCount = plainText ? (plainText.match(/\b\w+\b/g) || []).length : 0

  // ✅ FIX: PREVENT CRASH
  if (!plainText || actualWordCount < 400) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h1 className="font-playfair text-3xl font-bold mb-4">Article Not Available</h1>
        <a href="/" className="font-sans text-[#d4220a] hover:underline">← Back to Home</a>
      </div>
    )
  }

  return (
    <ArticleClient article={article} similar={similar} slug={slug} />
  )
}

export const revalidate = 3600