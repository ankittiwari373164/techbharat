// app/article/[slug]/page.tsx - FIXED VERSION
import { getAllArticlesAsync } from '@/lib/store'
import type { Metadata } from 'next'
import ArticleClient from './ArticleClient'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://thetechbharat.com'

interface PageProps {
  params: { slug: string }
}

export async function generateStaticParams() {
  try {
    const articles = await getAllArticlesAsync() as any[]
    return (articles || [])
      .filter(a => a?.slug && a?.title)
      .map(a => ({ slug: a.slug }))
      .slice(0, 100) // Limit to prevent excessive static generation
  } catch (err) {
    console.error('[TB] generateStaticParams error:', err)
    return []
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  try {
    if (!params?.slug) {
      return { title: 'Article Not Found | The Tech Bharat', robots: { index: false } }
    }

    const articles = await getAllArticlesAsync() as any[]
    if (!Array.isArray(articles)) {
      return { title: 'The Tech Bharat' }
    }

    const article = articles.find(a => a?.slug === params.slug)

    if (!article || !article.title) {
      return { title: 'Article Not Found | The Tech Bharat', robots: { index: false } }
    }

    const rawTitle = (article.seoTitle || article.title || '')
      .replace(/\s*\|\s*The Tech Bharat\s*$/i, '')
      .trim()
    const title = rawTitle.length > 70 ? rawTitle.slice(0, 70) : rawTitle
    const description = (article.seoDescription || article.summary || '').slice(0, 155)
    const canonical = `${SITE_URL}/${params.slug}`

    const ogImage = (article.featuredImage && !article.featuredImage.includes('og-image'))
      ? article.featuredImage
      : 'https://thetechbharat.com/og-image.jpg'

    return {
      title: title || 'The Tech Bharat',
      description: description || 'Honest smartphone reviews for Indian buyers',
      keywords: [...(article.tags || []), article.brand || ''].filter(Boolean),
      robots: { index: true, follow: true },
      alternates: { canonical },
      openGraph: {
        title: rawTitle || 'The Tech Bharat',
        description,
        url: canonical,
        siteName: 'The Tech Bharat',
        type: 'article',
        publishedTime: article.publishDate || new Date().toISOString(),
        images: [{ url: ogImage, width: 1200, height: 630, alt: rawTitle || 'Article' }],
      },
      twitter: {
        card: 'summary_large_image',
        title: rawTitle,
        description,
        images: [ogImage],
      },
    }
  } catch (err) {
    console.error('[TB] generateMetadata error:', err)
    return { title: 'The Tech Bharat' }
  }
}

export default async function ArticlePage({ params }: PageProps) {
  const { slug } = params

  // Validate slug
  if (!slug || typeof slug !== 'string' || slug.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h1 className="font-playfair text-3xl font-bold mb-4">Article Not Found</h1>
        <p className="font-body text-base text-muted mb-6">The article you're looking for doesn't exist.</p>
        <a href="/" className="font-sans text-sm font-semibold text-[#d4220a] hover:underline">
          ← Back to Home
        </a>
      </div>
    )
  }

  let article: any = null
  let similar: any[] = []

  try {
    const articles = await getAllArticlesAsync()

    if (!Array.isArray(articles)) {
      throw new Error('Invalid articles data structure')
    }

    article = articles.find(a => a?.slug === slug)

    if (!article) {
      return (
        <div className="max-w-4xl mx-auto px-4 py-20 text-center">
          <h1 className="font-playfair text-3xl font-bold mb-4">Article Not Found</h1>
          <p className="font-body text-base text-muted mb-6">We couldn't find the article you're looking for.</p>
          <a href="/" className="font-sans text-sm font-semibold text-[#d4220a] hover:underline">
            ← Back to Home
          </a>
        </div>
      )
    }

    // Get similar articles (same brand or type)
    const articleBrand = (article.brand || 'Mobile').toLowerCase()
    const seen = new Set([slug])

    similar = (articles || [])
      .filter(a => {
        if (!a?.slug || !a?.title || seen.has(a.slug)) return false
        const aBrand = (a.brand || 'Mobile').toLowerCase()
        return aBrand === articleBrand || a.type === article.type
      })
      .sort((a, b) => {
        const dateA = new Date(a.publishDate || 0).getTime()
        const dateB = new Date(b.publishDate || 0).getTime()
        return dateB - dateA
      })
      .slice(0, 4)

  } catch (err) {
    console.error('[TB] Article load error:', err)
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h1 className="font-playfair text-3xl font-bold mb-4">Error Loading Article</h1>
        <p className="font-body text-base text-muted mb-6">Something went wrong. Please try again.</p>
        <a href="/" className="font-sans text-sm font-semibold text-[#d4220a] hover:underline">
          ← Back to Home
        </a>
      </div>
    )
  }

  if (!article) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h1 className="font-playfair text-3xl font-bold mb-4">Article Not Found</h1>
        <a href="/" className="font-sans text-sm font-semibold text-[#d4220a] hover:underline">
          ← Back to Home
        </a>
      </div>
    )
  }

  // Build schema
  const plainText = (() => {
    const content = article.content || ''
    if (typeof content !== 'string') return ''
    return content.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim()
  })()

  const wordCount = plainText ? (plainText.match(/\b\w+\b/g) || []).length : 0

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: article.title,
    description: (article.summary || '').slice(0, 300),
    image: {
      '@type': 'ImageObject',
      url: article.featuredImage || 'https://thetechbharat.com/og-image.jpg',
      width: 1200,
      height: 630,
    },
    datePublished: article.publishDate || new Date().toISOString(),
    dateModified: article.updatedDate || article.publishDate || new Date().toISOString(),
    url: `${SITE_URL}/${slug}`,
    author: {
      '@type': 'Person',
      name: article.author || 'Vijay Yadav',
    },
    publisher: {
      '@type': 'Organization',
      name: 'The Tech Bharat',
      url: SITE_URL,
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${SITE_URL}/${slug}`,
    },
    articleBody: plainText.slice(0, 10000),
    wordCount: Math.max(wordCount, 400),
    inLanguage: 'en-IN',
  }

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: article.category || 'News', item: `${SITE_URL}/news` },
      { '@type': 'ListItem', position: 3, name: article.title, item: `${SITE_URL}/${slug}` },
    ],
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <ArticleClient article={article} similar={similar} slug={slug} />
    </>
  )
}

export const revalidate = 3600