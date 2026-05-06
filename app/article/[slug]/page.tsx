// app/article/[slug]/page.tsx
// =====================================================================
//  v3 PATCH — fixes the actual duplicate FAQPage cause
// ---------------------------------------------------------------------
//  ROOT CAUSE FOUND:
//   Some articles' `content` HTML contains a literal
//   `<h2>Frequently Asked Questions</h2>` section followed by
//   `<h3>Question text</h3>` headings and answer paragraphs.
//   Google's rich-results parser auto-detects this pattern as a
//   FAQPage entity — EVEN WITHOUT explicit JSON-LD.
//   Meanwhile, our JSON-LD ALSO emits a FAQPage from `bullets[]`.
//   Result: two FAQPage entities for the same URL → "Duplicate field".
//
//  FIX:
//   Detect the in-content FAQ pattern. When present, SKIP our
//   bullets-based FAQPage JSON-LD entirely — let Google parse the
//   real one from the article body. The bullets still display
//   visually inside ArticleClient (Key Highlights box) but no
//   second FAQ schema is emitted.
// =====================================================================
import { getAllArticlesAsync } from '@/lib/store'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import ArticleClient from './ArticleClient'
import { addInternalLinks } from '@/lib/internal-linking'

export const dynamic = 'force-dynamic'
export const revalidate = 3600

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://thetechbharat.com'

interface PageProps {
  params: { slug: string }
}

// ---------------------------------------------------------------------
//  Title cleaner
// ---------------------------------------------------------------------
function cleanTitle(raw: string): string {
  if (!raw) return ''
  return raw
    .replace(/\s*\|\s*The\s*Tech\s*Bharat\s*$/i, '')
    .replace(/\s*\|\s*TechBharat\s*$/i, '')
    .replace(/\s*–\s*The\s*Tech\s*Bharat\s*$/i, '')
    .replace(/\s*-\s*TechBharat\s*$/i, '')
    .trim()
}

// ---------------------------------------------------------------------
//  Detect in-content FAQ section
// ---------------------------------------------------------------------
//  Returns true if the article body has a "Frequently Asked Questions"
//  heading or similar FAQ pattern that Google will auto-parse as a
//  FAQPage entity. When this returns true, we MUST NOT emit our own
//  FAQPage JSON-LD or Google flags the page as duplicate FAQ.
function hasInContentFaq(html: string): boolean {
  if (!html) return false
  // Look for any of these heading patterns that Google's rich-results
  // parser treats as an FAQ section starter:
  const patterns = [
    /<h[1-6][^>]*>\s*Frequently\s+Asked\s+Questions\s*<\/h[1-6]>/i,
    /<h[1-6][^>]*>\s*FAQs?\s*<\/h[1-6]>/i,
    /<h[1-6][^>]*>\s*Common\s+Questions\s*<\/h[1-6]>/i,
    /<h[1-6][^>]*>\s*Questions?\s+(and|&amp;|&)\s+Answers\s*<\/h[1-6]>/i,
    /##\s*Frequently\s+Asked\s+Questions/i,    // markdown form
    /##\s*FAQs?\b/i,
  ]
  return patterns.some(p => p.test(html))
}

// =====================================================================
//  METADATA
// =====================================================================
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  let articles: any[] = []
  let storeFailed = false

  try {
    articles = await getAllArticlesAsync() as any[]
    if (!Array.isArray(articles)) storeFailed = true
  } catch {
    storeFailed = true
  }

  if (storeFailed) {
    return {
      title: 'The Tech Bharat',
      robots: { index: false, follow: true },
    }
  }

  const article = articles.find(a => a.slug === params.slug)

  if (!article) {
    return {
      title: 'Article Not Found | The Tech Bharat',
      robots: { index: false, follow: false },
    }
  }

  const rawTitle    = cleanTitle(article.seoTitle || article.title || '')
  const description = (article.seoDescription || article.summary || '').slice(0, 160)
  const canonical   = `${SITE_URL}/${article.slug}`
  const image       = article.featuredImage || `${SITE_URL}/og-image.jpg`
  const published   = article.publishDate || new Date().toISOString()
  const modified    = article.updatedDate || published

  return {
    title:       rawTitle,
    description,
    keywords:    article.tags || [],
    authors:     [{ name: article.author || 'Vijay Yadav', url: `${SITE_URL}/author` }],

    alternates: { canonical },

    robots: {
      index:  true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-image-preview': 'large',
        'max-snippet': -1,
        'max-video-preview': -1,
      },
    },

    openGraph: {
      title:         rawTitle,
      description,
      url:           canonical,
      siteName:      'The Tech Bharat',
      type:          'article',
      locale:        'en_IN',
      publishedTime: published,
      modifiedTime:  modified,
      authors:       [`${SITE_URL}/author`],
      section:       article.category || 'Mobile News',
      tags:          article.tags || [],
      images:        [{ url: image, width: 1200, height: 630, alt: rawTitle }],
    },

    twitter: {
      card:        'summary_large_image',
      site:        '@thetechbharat',
      creator:     '@thetechbharat',
      title:       rawTitle,
      description,
      images:      [image],
    },

    other: {
      'article:published_time': published,
      'article:modified_time':  modified,
      'article:author':         article.author || 'Vijay Yadav',
      'article:section':        article.category || 'Mobile News',
    },
  }
}

// =====================================================================
//  PAGE
// =====================================================================
export default async function ArticlePage({ params }: PageProps) {
  const { slug } = params

  let articles: any[] = []
  let storeFailed     = false
  let article: any    = null
  let similar: any[]  = []
  let contentWithLinks = ''

  // ───── Phase 1: load articles ──────────────────────────────
  try {
    articles = await getAllArticlesAsync() as any[]
    if (!Array.isArray(articles)) storeFailed = true
  } catch {
    storeFailed = true
  }

  // ───── Phase 2: handle store outage WITHOUT 404'ing ────────
  if (storeFailed) {
    throw new Error('Article store temporarily unavailable')
  }

  // ───── Phase 3: find the requested article ─────────────────
  article = articles.find(a => a.slug === slug) || null
  if (!article) {
    notFound()
  }

  // ───── Phase 4: build content + similar list ───────────────
  try {
    contentWithLinks = addInternalLinks(article.content || '', slug, articles)
  } catch {
    contentWithLinks = article.content || ''
  }

  const seen = new Set([slug])
  similar = articles
    .filter(a => {
      if (!a.slug || seen.has(a.slug)) return false
      if (!a.title) return false
      if (article.brand && article.brand !== 'Mobile') {
        return (a.brand || '').toLowerCase() === article.brand.toLowerCase()
      }
      return a.type === article.type
    })
    .slice(0, 4)

  // ───── Phase 5: build server-rendered JSON-LD schemas ──────
  const canonical = `${SITE_URL}/${article.slug}`
  const image     = article.featuredImage || `${SITE_URL}/og-image.jpg`
  const published = article.publishDate || new Date().toISOString()
  const modified  = article.updatedDate || published
  const cleanedTitle = cleanTitle(article.title || '')
  const headline  = cleanedTitle.slice(0, 110)

  // 1) NewsArticle / Review schema
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type':    article.type === 'review' ? 'Review' : 'NewsArticle',
    headline,
    description:    article.summary || '',
    image:          [image],
    datePublished:  published,
    dateModified:   modified,
    author: {
      '@type': 'Person',
      name:    article.author || 'Vijay Yadav',
      url:     `${SITE_URL}/author`,
      jobTitle: 'Senior Mobile Technology Editor',
      worksFor: {
        '@type': 'NewsMediaOrganization',
        name:    'The Tech Bharat',
      },
    },
    publisher: {
      '@type': 'NewsMediaOrganization',
      name:    'The Tech Bharat',
      url:     SITE_URL,
      logo: {
        '@type': 'ImageObject',
        url:     `${SITE_URL}/logo.png`,
        width:  600,
        height: 60,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id':   canonical,
    },
    articleSection: article.category || 'Mobile News',
    keywords:       (article.tags || []).join(', '),
    inLanguage:     'en-IN',
    isAccessibleForFree: true,
    ...(article.type === 'review' && article.brand ? {
      itemReviewed: {
        '@type': 'Product',
        name:    cleanedTitle,
        brand:   { '@type': 'Brand', name: article.brand },
      },
      reviewRating: {
        '@type': 'Rating',
        ratingValue: '4',
        bestRating:  '5',
        worstRating: '1',
      },
    } : {}),
  }

  // 2) BreadcrumbList schema
  const sectionLabel  = article.type === 'review'  ? 'Reviews'
                      : article.type === 'compare' ? 'Comparisons'
                      :                              'Mobile News'
  const sectionUrl    = article.type === 'review'  ? `${SITE_URL}/reviews`
                      : article.type === 'compare' ? `${SITE_URL}/compare`
                      :                              `${SITE_URL}/mobile-news`

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type':    'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home',         item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: sectionLabel,   item: sectionUrl },
      { '@type': 'ListItem', position: 3, name: cleanedTitle,   item: canonical },
    ],
  }

  // 3) FAQ schema — ONLY emit when there is NO in-content FAQ section.
  //    If the article body already has "Frequently Asked Questions",
  //    Google auto-parses that as a FAQPage. Emitting our own would
  //    create the duplicate that GSC flagged.
  const articleHasFaq = hasInContentFaq(contentWithLinks)

  const rawBullets: string[] = Array.isArray(article.bullets) ? article.bullets : []
  const cleanBullets = Array.from(new Set(
    rawBullets
      .filter((b): b is string => typeof b === 'string')
      .map(b => b.trim())
      .filter(b => b.length >= 20)
  )).slice(0, 5)

  const shouldEmitFaqSchema = !articleHasFaq && cleanBullets.length >= 3

  const faqSchema = shouldEmitFaqSchema ? {
    '@context': 'https://schema.org',
    '@type':    'FAQPage',
    mainEntity: cleanBullets.map((b, i) => ({
      '@type': 'Question',
      name:    `What about ${cleanedTitle.slice(0, 50)}? Point ${i + 1}`,
      acceptedAnswer: { '@type': 'Answer', text: b },
    })),
  } : null

  return (
    <>
      <script
        id="ld-article"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        id="ld-breadcrumb"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      {faqSchema && (
        <script
          id="ld-faq"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}

      <ArticleClient
        article={article}
        content={contentWithLinks}
        similar={similar}
        slug={slug}
      />
    </>
  )
}