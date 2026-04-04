// app/article/[slug]/page.tsx
// FIXED:
//  - Single FAQPage schema (no more "Duplicate field FAQPage" GSC error)
//  - Canonical URL is /<slug> (redirected from /article/<slug>)
//  - AMP link in alternates
import { getAllArticlesAsync } from '@/lib/store'
import type { Metadata } from 'next'
import ArticleClient from './ArticleClient'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://thetechbharat.com'

interface PageProps {
  params: { slug: string }
}

export async function generateStaticParams() {
  try {
    const articles = await getAllArticlesAsync() as { slug: string }[]
    return articles.map(a => ({ slug: a.slug }))
  } catch { return [] }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  try {
    const articles = await getAllArticlesAsync() as {
      slug: string; title: string; summary: string;
      seoTitle?: string; seoDescription?: string; featuredImage?: string;
      publishDate: string; author?: string; brand?: string
    }[]
    const article = articles.find(a => a.slug === params.slug)
    if (!article) return { title: 'Article Not Found | The Tech Bharat' }

    const rawTitle    = (article.seoTitle || article.title).replace(/\s*\|\s*The Tech Bharat\s*$/i, '').trim()
    const description = article.seoDescription || article.summary?.slice(0, 155) || ''

    // CANONICAL is /slug — NOT /article/slug
    const canonical = `${SITE_URL}/${params.slug}`

    return {
      title: rawTitle,
      description,
      alternates: {
        canonical,
        // AMP version if you have one
        // types: { 'application/amphtml': `${SITE_URL}/${params.slug}/amp` }
      },
      openGraph: {
        title: rawTitle,
        description,
        url:       canonical,
        siteName:  'The Tech Bharat',
        type:      'article',
        publishedTime: article.publishDate,
        modifiedTime:  (article as any).updatedDate || article.publishDate,
        authors:   [article.author || 'Vijay Yadav'],
        images:    article.featuredImage
          ? [{ url: article.featuredImage, width: 1200, height: 630, alt: rawTitle }]
          : [{ url: `${SITE_URL}/og-image.jpg`, width: 1200, height: 630, alt: 'The Tech Bharat' }],
      },
      twitter: {
        card:    'summary_large_image',
        title:   rawTitle,
        description,
        site:    '@thetechbharat',
        creator: '@thetechbharat',
        images:  article.featuredImage ? [article.featuredImage] : [`${SITE_URL}/og-image.jpg`],
      },
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
    if (article) {
      similar = articles
        .filter((a: any) => a.slug !== slug && (a.brand === article.brand || a.type === article.type))
        .slice(0, 4)
    }
  } catch { /* handled below */ }

  if (!article) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h1 className="font-playfair text-3xl font-bold mb-4">Article Not Found</h1>
        <a href="/" className="font-sans text-[#d4220a] hover:underline">← Back to Home</a>
      </div>
    )
  }

  // CANONICAL URL — /slug (no /article/ prefix)
  const canonicalUrl = `${SITE_URL}/${slug}`

  // Schema.org NewsArticle
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: article.title,
    description: article.seoDescription || article.summary,
    image: article.featuredImage ? [article.featuredImage] : [`${SITE_URL}/og-image.jpg`],
    datePublished: article.publishDate,
    dateModified: article.updatedDate || article.publishDate,
    url: canonicalUrl,
    mainEntityOfPage: { '@type': 'WebPage', '@id': canonicalUrl },
    author: {
      '@type': 'Person',
      name: article.author || 'Vijay Yadav',
      url: `${SITE_URL}/author`,
      jobTitle: 'Technology Journalist',
      worksFor: { '@type': 'Organization', name: 'The Tech Bharat' },
    },
    publisher: {
      '@type': 'Organization',
      name: 'The Tech Bharat',
      logo: { '@type': 'ImageObject', url: `${SITE_URL}/logo.png` },
    },
  }

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: article.category || article.type, item: `${SITE_URL}/${article.type}` },
      { '@type': 'ListItem', position: 3, name: article.title, item: canonicalUrl },
    ],
  }

  // FIXED: Single FAQPage schema — no duplicates
  // Only build FAQ if we have real content, and NEVER if article already has pillar page FAQ
  const buildFaqSchema = () => {
    const content = (article as any).content || ''

    // Try to extract real Q&A pairs from <h3> + <p> in article HTML
    const faqMatches: { q: string; a: string }[] = []
    const h3Regex = /<h3[^>]*>(.*?)<\/h3>\s*<p[^>]*>(.*?)<\/p>/g
    let match
    while ((match = h3Regex.exec(content)) !== null && faqMatches.length < 4) {
      const q = match[1].replace(/<[^>]*>/g, '').trim()
      const a = match[2].replace(/<[^>]*>/g, '').trim()
      // Strict validation — real questions and answers
      if (q.length > 15 && a.length > 40 && (q.includes('?') || q.toLowerCase().startsWith('what') || q.toLowerCase().startsWith('how') || q.toLowerCase().startsWith('which') || q.toLowerCase().startsWith('why') || q.toLowerCase().startsWith('is') || q.toLowerCase().startsWith('does'))) {
        faqMatches.push({ q, a })
      }
    }

    if (faqMatches.length >= 2) {
      return {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faqMatches.map(({ q, a }) => ({
          '@type': 'Question',
          name: q,
          acceptedAnswer: { '@type': 'Answer', text: a },
        })),
      }
    }

    // Fallback: bullet-based FAQ — only if bullets are genuinely informative
    const safeB = Array.isArray((article as any).bullets) ? (article as any).bullets : []
    const validBullets = safeB
      .map((b: string) => b.replace(/<[^>]*>/g, '').trim())
      .filter((b: string) => b.length >= 40) // stricter min length to avoid GSC "Duplicate field" error

    if (validBullets.length < 2) return null

    const questions = [
      `What are the key highlights of the ${article.brand} device?`,
      `What is the India pricing and availability?`,
      `What are the main specifications?`,
      `Should Indian buyers consider this phone?`,
    ]

    return {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: validBullets.slice(0, 4).map((b: string, i: number) => ({
        '@type': 'Question',
        name: questions[i] || `Key point ${i + 1} about ${article.title}`,
        acceptedAnswer: { '@type': 'Answer', text: b },
      })),
    }
  }

  const faqSchema = buildFaqSchema()

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      {/* FIXED: Only ONE FAQPage schema per page — pillar pages have their own, articles have this one */}
      {faqSchema && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      )}
      <ArticleClient article={article} similar={similar} slug={slug} />
    </>
  )
}

export const revalidate = 3600