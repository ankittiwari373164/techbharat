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
      publishDate: string; author?: string; brand?: string
    }[]
    const article = articles.find(a => a.slug === params.slug)
    if (!article) return { title: 'Article Not Found | The Tech Bharat' }

    // Strip '| The Tech Bharat' from seoTitle if present — layout template adds it automatically
    const rawTitle    = (article.seoTitle || article.title).replace(/\s*\|\s*The Tech Bharat\s*$/i, '').trim()
    const title       = rawTitle
    const description = article.seoDescription || article.summary?.slice(0, 155) || ''
    const canonical   = `${SITE_URL}/${params.slug}`

    return {
      title,
      description,
      alternates: {
        canonical,
        types: { 'application/amphtml': `${SITE_URL}/${params.slug}/amp` },
      },
      openGraph: {
        title, description,
        url:           canonical,
        siteName:      'The Tech Bharat',
        type:          'article',
        publishedTime: article.publishDate,
        modifiedTime:  (article as any).updatedDate || article.publishDate,
        authors:       [article.author || 'Vijay Yadav'],
        images: article.featuredImage
          ? [{ url: article.featuredImage, width: 1200, height: 630, alt: title }]
          : [{ url: 'https://thetechbharat.com/og-image.jpg', width: 1200, height: 630, alt: 'The Tech Bharat' }],
      },
      twitter: {
        card:        'summary_large_image',
        title,
        description,
        site:        '@thetechbharat',
        creator:     '@thetechbharat',
        images: article.featuredImage
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
      // BRAND-ONLY similar articles — no cross-brand pollution, no duplicates
      const seen = new Set([slug])
      similar = articles
        .filter((a: any) => {
          if (seen.has(a.slug)) return false
          if (!a.slug || !a.title) return false
          if (articleBrand && articleBrand !== 'Mobile') {
            return (a.brand || '').toLowerCase() === articleBrand.toLowerCase()
          }
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

  // ── ENHANCED: Article Schema with full author + publisher details ──────────
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    '@id': `${SITE_URL}/${slug}#article`,
    headline:    article.title,
    description: article.seoDescription || article.summary,
    image: article.featuredImage
      ? [{ '@type': 'ImageObject', url: article.featuredImage, width: 1200, height: 630 }]
      : [{ '@type': 'ImageObject', url: 'https://thetechbharat.com/og-image.jpg', width: 1200, height: 630 }],
    datePublished: article.publishDate,
    dateModified:  article.updatedDate || article.publishDate,
    author: {
      '@type':  'Person',
      name:     article.author || 'Vijay Yadav',
      url:      `${SITE_URL}/author/${(article.author || 'vijay-yadav').toLowerCase().replace(/\s+/g, '-')}`,
      sameAs: [
        'https://twitter.com/thetechbharat',
        'https://www.linkedin.com/company/the-tech-bharat',
      ],
    },
    publisher: {
      '@type': 'Organization',
      name:    'The Tech Bharat',
      url:     SITE_URL,
      logo: {
        '@type':  'ImageObject',
        url:      `${SITE_URL}/logo.png`,
        width:    600,
        height:   600,
      },
      sameAs: [
        'https://twitter.com/thetechbharat',
        'https://www.facebook.com/thetechbharat',
        'https://t.me/the_tech_bharat',
      ],
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id':   `${SITE_URL}/${slug}`,
    },
    articleBody:    (article.content || '').replace(/<[^>]*>/g, '').substring(0, 5000),
    keywords:       [...(article.tags || []), article.brand || 'Mobile', article.category || ''].filter(Boolean).join(', '),
    articleSection: article.category || article.type,
    wordCount:      ((article.content || '').match(/\b\w+\b/g) || []).length,
    inLanguage:     'en-IN',
  }

  // ── ENHANCED: Breadcrumb with @id ─────────────────────────────────────────
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type':    'BreadcrumbList',
    '@id':      `${SITE_URL}/${slug}#breadcrumb`,
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home',                                   item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: article.category || article.type || 'News', item: `${SITE_URL}/${article.type || 'mobile-news'}` },
      { '@type': 'ListItem', position: 3, name: article.title,                             item: `${SITE_URL}/${slug}` },
    ],
  }

  // ── ENHANCED: FAQ Schema — only from dedicated FAQ section ────────────────
  // Extract h3+p pairs that appear after an h2 containing FAQ/Frequently/Question.
  // Prevents duplicate FAQPage errors in GSC.
  const buildFaqSchema = (): object | null => {
    const articleContent = (article as any).content || ''

    const faqSectionMatch = articleContent.match(
      /<h2[^>]*>[^<]*(FAQ|Frequently|Question)[^<]*<\/h2>([\s\S]*?)(?=<h2|$)/i
    )
    const searchIn = faqSectionMatch ? faqSectionMatch[2] : ''

    if (!searchIn) return null

    const faqMatches: { q: string; a: string }[] = []
    const pairs = [...searchIn.matchAll(/<h3[^>]*>(.*?)<\/h3>\s*<p[^>]*>(.*?)<\/p>/gi)]

    for (const m of pairs) {
      if (faqMatches.length >= 5) break
      const q = m[1].replace(/<[^>]*>/g, '').trim()
      const a = m[2].replace(/<[^>]*>/g, '').trim()
      // Quality gate: question must end with ? and meet min char counts
      if (q.endsWith('?') && q.length > 15 && a.length > 30) {
        faqMatches.push({ q, a })
      }
    }

    if (faqMatches.length < 2) return null

    return {
      '@context': 'https://schema.org',
      '@type':    'FAQPage',
      '@id':      `${SITE_URL}/${slug}#faqpage`,
      mainEntity: faqMatches.slice(0, 5).map(({ q, a }) => ({
        '@type': 'Question',
        name:    q,
        acceptedAnswer: {
          '@type': 'Answer',
          text:    a.substring(0, 500),
        },
      })),
    }
  }

  // Only generate FAQPage if content doesn't already embed one (avoids GSC duplicate error)
  const contentHasFAQ =
    ((article as any).content || '').includes('"@type":"FAQPage"') ||
    ((article as any).content || '').includes("'@type':'FAQPage'")
  const faqSchema = contentHasFAQ ? null : buildFaqSchema()

  // ── NEW: Product Schema — only for brand-specific articles ────────────────
  const productSchema =
    article.brand && article.brand !== 'Mobile'
      ? {
          '@context': 'https://schema.org',
          '@type':    'Product',
          name:       article.title,
          brand: {
            '@type': 'Brand',
            name:    article.brand,
          },
          description: article.summary,
          image:       article.featuredImage || 'https://thetechbharat.com/og-image.jpg',
          publisher: {
            '@type': 'Organization',
            name:    'The Tech Bharat',
          },
        }
      : null

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}
      {productSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
        />
      )}
      <ArticleClient article={article} similar={similar} slug={slug} />
    </>
  )
}

export const revalidate = 3600