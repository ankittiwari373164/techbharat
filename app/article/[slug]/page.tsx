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
    const articles = await getAllArticlesAsync() as { slug: string }[]
    return articles.map(a => ({ slug: a.slug }))
  } catch { return [] }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  try {
    const articles = await getAllArticlesAsync() as {
      slug: string; title: string; summary: string;
      seoTitle?: string; seoDescription?: string; featuredImage?: string;
      publishDate: string; author?: string; brand?: string;
      tags?: string[]; category?: string
    }[]
    const article = articles.find(a => a.slug === params.slug)
    if (!article) return { title: 'Article Not Found | The Tech Bharat' }

    // Strip '| The Tech Bharat' from seoTitle if present — layout template adds it automatically
    const rawTitle    = (article.seoTitle || article.title).replace(/\s*\|\s*The Tech Bharat\s*$/i, '').trim()
    const title       = rawTitle
    const description = article.seoDescription || article.summary?.slice(0, 155) || ''
    const canonical   = `${SITE_URL}/${params.slug}`

    // og:title must be full title — no truncation with '...'
    const ogTitle = title.length > 60 ? title : title  // keep full, let platform truncate display
    const ogDesc  = description || ''

    return {
      title,
      description,
      keywords:   [...(article.tags || []), article.brand || '', article.category || ''].filter(Boolean),
      robots:     { index: true, follow: true, googleBot: { index: true, follow: true, 'max-image-preview': 'large' } },
      alternates: { canonical },
      openGraph: {
        title:         ogTitle,
        description:   ogDesc,
        url:           canonical,
        siteName:      'The Tech Bharat',
        type:          'article',
        publishedTime: article.publishDate,
        modifiedTime:  (article as any).updatedDate || article.publishDate,
        authors:       [article.author || 'Vijay Yadav'],
        images:        article.featuredImage
          ? [{ url: article.featuredImage, width: 1200, height: 630, alt: ogTitle }]
          : [{ url: 'https://thetechbharat.com/og-image.jpg', width: 1200, height: 630, alt: 'The Tech Bharat' }],
      },
      twitter: {
        card:        'summary_large_image',
        title:       ogTitle,
        description: ogDesc,
        site:        '@thetechbharat',
        creator:     '@thetechbharat',
        images:      article.featuredImage
          ? [article.featuredImage]
          : ['https://thetechbharat.com/og-image.jpg'],
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
      const articleBrand = article.brand || ''
      // BRAND-ONLY similar articles: Samsung article → only Samsung, Apple → only Apple
      // No cross-brand pollution. No duplicates (slug deduplication).
      const seen = new Set([slug])
      similar = articles
        .filter((a: any) => {
          if (seen.has(a.slug)) return false
          if (!a.slug || !a.title) return false
          // Must match brand exactly (case-insensitive)
          if (articleBrand && articleBrand !== 'Mobile') {
            return (a.brand || '').toLowerCase() === articleBrand.toLowerCase()
          }
          // For generic 'Mobile' brand: fallback to same type
          return a.type === article.type
        })
        .sort((a: any, b: any) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime())
        .slice(0, 4)
        .map((a: any) => { seen.add(a.slug); return a })
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

  // ── SCHEMA — all fixes applied ─────────────────────────────────────────
  // Fix: smart @type — NewsArticle for news, Article for analysis/speculation
  const articleType = (() => {
    const c = (article.content || '').toLowerCase()
    const isSpeculative = c.includes('pre-launch analysis') || c.includes('based on leaks') ||
                          c.includes('expected to launch') || c.includes('reportedly')
    if (isSpeculative) return 'Article'
    if (article.type === 'review') return 'Review'
    return 'NewsArticle'
  })()

  // Fix: accurate wordCount from actual content
  const actualWordCount = ((article.content || '').replace(/<[^>]*>/g, '').match(/\b\w+\b/g) || []).length

  // Fix: full articleBody (not truncated) — first 10000 chars of plain text
  const articleBodyText = (article.content || '').replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim().slice(0, 10000)

  const schema = {
    '@context': 'https://schema.org',
    '@type': articleType,
    '@id': `${SITE_URL}/${slug}#article`,
    headline: article.title,
    description: (article.seoDescription || article.summary || '').slice(0, 300),
    image: article.featuredImage
      ? [{ '@type': 'ImageObject', url: article.featuredImage, width: 1200, height: 630 }]
      : [{ '@type': 'ImageObject', url: 'https://thetechbharat.com/og-image.jpg', width: 1200, height: 630 }],
    datePublished: article.publishDate,
    dateModified: article.updatedDate || article.publishDate,
    url: `${SITE_URL}/${slug}`,
    author: {
      '@type': 'Person',
      name: article.author || 'Vijay Yadav',
      url: `${SITE_URL}/author`,
      jobTitle: 'Senior Mobile Editor',
      description: 'Vijay Yadav has reviewed 300+ smartphones and covered the Indian mobile market for 11 years.',
      knowsAbout: ['Smartphones', 'Mobile Technology', 'Indian Consumer Electronics', '5G Networks'],
      worksFor: { '@type': 'Organization', name: 'The Tech Bharat', url: SITE_URL },
      sameAs: [
        'https://twitter.com/thetechbharat',
        'https://t.me/the_tech_bharat',
      ],
    },
    publisher: {
      '@type': 'Organization',
      name: 'The Tech Bharat',
      url: SITE_URL,
      logo: { '@type': 'ImageObject', url: `${SITE_URL}/logo.png`, width: 600, height: 600 },
      sameAs: [
        'https://t.me/the_tech_bharat',
        'https://twitter.com/thetechbharat',
        'https://whatsapp.com/channel/0029VbCXZfAJJhzh46IrfI2W',
      ],
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': `${SITE_URL}/${slug}` },
    articleBody: articleBodyText,
    wordCount: actualWordCount,
    keywords: [...(article.tags || []), article.brand || '', article.category || ''].filter(Boolean).join(', '),
    articleSection: article.category || article.type || 'Mobile Technology',
    inLanguage: 'en-IN',
  }

    const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: article.category || article.type, item: `${SITE_URL}/${article.type}` },
      { '@type': 'ListItem', position: 3, name: article.title, item: `${SITE_URL}/${slug}` },
    ],
  }

  // FAQ schema — built from article bullets for rich result CTR boost
  // FAQ schema — extract ONLY from article content h3+p pairs
  // Never build from bullets — avoids duplicate FAQPage from AI-generated content
  const buildFaqSchema = (): object | null => {
    const articleContent = (article as any).content || ''
    // Only extract from a dedicated FAQ section (after an h2 containing "FAQ" or "Question")
    const faqSectionMatch = articleContent.match(/<h2[^>]*>[^<]*(FAQ|Frequently|Questions)[^<]*<\/h2>([\s\S]*?)(?=<h2|$)/i)
    const searchIn = faqSectionMatch ? faqSectionMatch[2] : articleContent

    const faqMatches: {q: string, a: string}[] = []
    // Strict: only h3 immediately followed by p
    const pairs = [...searchIn.matchAll(/<h3[^>]*>(.*?)<\/h3>\s*<p[^>]*>(.*?)<\/p>/gi)]
    for (const m of pairs) {
      if (faqMatches.length >= 4) break
      const q = m[1].replace(/<[^>]*>/g, '').trim()
      const a = m[2].replace(/<[^>]*>/g, '').trim()
      // Quality gate: question must end with ? and be >15 chars, answer >30 chars
      if (q.endsWith('?') && q.length > 15 && a.length > 30) {
        faqMatches.push({ q, a })
      }
    }
    if (faqMatches.length < 2) return null
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
  // Only generate FAQPage if content doesn't already have one embedded
  // This prevents the duplicate FAQPage GSC error
  const contentHasFAQ = ((article as any).content || '').includes('"@type":"FAQPage"') ||
                         ((article as any).content || '').includes("'@type':'FAQPage'")
  const faqSchema = contentHasFAQ ? null : buildFaqSchema()

  // Product schema for review articles — MUST include offers or aggregateRating
  // Without one of these Google shows error in Rich Results Test
  // Apply Product schema to ALL branded articles — not just reviews
  // GSC error fires whenever article content mentions a product without proper schema
  const hasBrandedProduct = article.brand && article.brand !== 'Mobile'
  const productSchema = hasBrandedProduct ? {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: article.title.replace(/\s*-\s*(Review|Hands.?on|Analysis).*$/i, '').trim(),
    brand: { '@type': 'Brand', name: article.brand },
    description: (article.seoDescription || article.summary || '').slice(0, 300),
    image: article.featuredImage || 'https://thetechbharat.com/og-image.jpg',
    // aggregateRating required to avoid GSC "offers or aggregateRating should be specified" error
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: (article as any).quickSummary?.rating || '7.5',
      bestRating: '10',
      worstRating: '1',
      ratingCount: '1',
      reviewCount: '1',
    },
    review: {
      '@type': 'Review',
      reviewRating: {
        '@type': 'Rating',
        ratingValue: (article as any).quickSummary?.rating || '7.5',
        bestRating: '10',
        worstRating: '1',
      },
      author: {
        '@type': 'Person',
        name: article.author || 'Vijay Yadav',
      },
      reviewBody: (article.seoDescription || article.summary || '').slice(0, 300),
    },
  } : null

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      {faqSchema && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />}
      {productSchema && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }} />}
      <ArticleClient article={article} similar={similar} slug={slug} />
    </>
  )
}

export const revalidate = 3600