// app/article/[slug]/page.tsx
import { getAllArticlesAsync } from '@/lib/store'
import type { Metadata } from 'next'
import ArticleClient from './ArticleClient'

export const dynamic = 'force-dynamic' // ✅ FIX: prevent static JSON 404 (AdSense critical)

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://thetechbharat.com'

interface PageProps {
  params: { slug: string }
}

// ❌ REMOVED generateStaticParams (causing 404 JSON + 500)
// export async function generateStaticParams() { ... }

export const metadata = {
  robots: { index: false, follow: false }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  try {
    const articles = await getAllArticlesAsync() as any[]
    const article = articles.find(a => a.slug === params.slug)

    if (!article) {
      return {
        title: 'Article Not Found | The Tech Bharat',
        robots: { index: false, follow: false } // ✅ AdSense safe
      }
    }
    

    const title = (article.seoTitle || article.title || '').replace(/\s*\|\s*The Tech Bharat\s*$/i, '').trim()
    const description = article.seoDescription || article.summary || ''
    const canonical = `${SITE_URL}/${article.slug}`

    return {
      title,
      description,
      alternates: {
    canonical: canonical,
  },
      robots: { index: true, follow: true },

      openGraph: {
        title,
        description,
        url: canonical,
        type: 'article',
        images: article.featuredImage
          ? [{ url: article.featuredImage }]
          : [],
      },

      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: article.featuredImage ? [article.featuredImage] : [],
      },
    }
  } catch {
    return { title: 'The Tech Bharat' }
  }
}

export default async function ArticlePage({ params }: PageProps) {
  const { slug } = params

  let article: any = null
  let similar: any[] = []

  try {
    const articles = await getAllArticlesAsync() as any[]

    article = articles.find(a => a.slug === slug) || null

    if (article) {
      const seen = new Set([slug])

      similar = articles
        .filter(a => {
          if (!a.slug || seen.has(a.slug)) return false
          if (!a.title) return false

          // keep your original logic untouched
          if (article.brand && article.brand !== 'Mobile') {
            return (a.brand || '').toLowerCase() === article.brand.toLowerCase()
          }

          return a.type === article.type
        })
        .slice(0, 4)
    }

  } catch {
    // never crash
  }

  // ✅ CRITICAL FIX: NEVER return empty 500 page
  if (!article) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h1 className="font-playfair text-3xl font-bold mb-4">Article Not Found</h1>
        <a href="/" className="font-sans text-[#d4220a] hover:underline">
          ← Back to Home
        </a>
      </div>
    )
  }

  return (
    <ArticleClient
      article={article}
      similar={similar}
      slug={slug}
    />
  )
}

// ✅ ISR still allowed but not static JSON dependent
export const revalidate = 3600