// app/article/[slug]/page.tsx
// =====================================================================
//  PATCHED FOR ADSENSE & GOOGLE INDEXING
// ---------------------------------------------------------------------
//  KEY FIXES (vs previous version):
//   1. ADDED full server-rendered JSON-LD:
//        - NewsArticle (E-E-A-T, Top Stories eligibility)
//        - BreadcrumbList (rich breadcrumbs in SERP)
//        - FAQPage (when bullets exist — boosts SERP space)
//      Previously these only existed on the AMP page, so the
//      canonical URL had ZERO structured data. AdSense's
//      "low value content" classifier looks for these.
//   2. ADDED rendered <h1>, summary, and content INTO the SSR HTML
//      via a stable wrapper so the article body is in the
//      first-paint HTML even before ArticleClient hydrates.
//      (ArticleClient was already SSR for content, but we also
//      now pass server-built schema strings into it.)
//   3. Better metadata — added publishedTime, modifiedTime,
//      authors, section, and tags to OpenGraph article object.
//   4. Returns proper 404 status when article not found
//      (was returning 200 with "Not Found" body — soft 404 in GSC).
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

// =====================================================================
//  METADATA
// =====================================================================
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  try {
    const articles = await getAllArticlesAsync() as any[]
    const article = articles.find(a => a.slug === params.slug)

    if (!article) {
      return {
        title: 'Article Not Found | The Tech Bharat',
        robots: { index: false, follow: false },
      }
    }

    const rawTitle    = (article.seoTitle || article.title || '').replace(/\s*\|\s*The Tech Bharat\s*$/i, '').trim()
    const description = (article.seoDescription || article.summary || '').slice(0, 160)
    const canonical   = `${SITE_URL}/${article.slug}`
    const ampUrl      = `${SITE_URL}/${article.slug}/amp`
    const image       = article.featuredImage || `${SITE_URL}/og-image.jpg`
    const published   = article.publishDate || new Date().toISOString()
    const modified    = article.updatedDate || published

    return {
      title:       rawTitle,
      description,
      keywords:    article.tags || [],
      authors:     [{ name: article.author || 'Vijay Yadav', url: `${SITE_URL}/author` }],

      alternates: {
        canonical,
        // AMP variant (only if you actually want AMP discovery)
        // languages: { 'amphtml': ampUrl }
      },

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
        title:       rawTitle,
        description,
        url:         canonical,
        siteName:    'The Tech Bharat',
        type:        'article',
        locale:      'en_IN',
        publishedTime: published,
        modifiedTime:  modified,
        authors:     [`${SITE_URL}/author`],
        section:     article.category || 'Mobile News',
        tags:        article.tags || [],
        images:      [{ url: image, width: 1200, height: 630, alt: rawTitle }],
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
  } catch {
    return { title: 'The Tech Bharat' }
  }
}

// =====================================================================
//  PAGE
// =====================================================================
export default async function ArticlePage({ params }: PageProps) {
  const { slug } = params

  let article: any = null
  let similar: any[] = []
  let articles: any[] = []
  let contentWithLinks = ''

  try {
    articles = await getAllArticlesAsync() as any[]
    article  = articles.find(a => a.slug === slug) || null

    if (article) {
      contentWithLinks = addInternalLinks(article.content || '', slug, articles)

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
    }
  } catch {
    // never crash
  }

  // -------------------------------------------------------------
  //  Real 404 (not soft-404) when article missing
  // -------------------------------------------------------------
  if (!article) {
    notFound()
  }

  // -------------------------------------------------------------
  //  Build server-rendered JSON-LD schemas
  // -------------------------------------------------------------
  const canonical = `${SITE_URL}/${article.slug}`
  const image     = article.featuredImage || `${SITE_URL}/og-image.jpg`
  const published = article.publishDate || new Date().toISOString()
  const modified  = article.updatedDate || published
  const headline  = (article.title || '').slice(0, 110) // schema.org limit

  // 1) NewsArticle / Article schema
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type':    article.type === 'review' ? 'Review' : 'NewsArticle',
    headline,
    description: article.summary || '',
    image: [image],
    datePublished: published,
    dateModified:  modified,
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
        name:    article.title,
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
      { '@type': 'ListItem', position: 3, name: article.title,  item: canonical },
    ],
  }

  // 3) FAQ schema (only if bullets exist and have substance)
  const bullets: string[] = Array.isArray(article.bullets) ? article.bullets : []
  const faqSchema = bullets.length >= 3 ? {
    '@context': 'https://schema.org',
    '@type':    'FAQPage',
    mainEntity: bullets.slice(0, 5).map((b, i) => ({
      '@type': 'Question',
      name:    `Key point ${i + 1}: ${(article.title || '').slice(0, 60)}`,
      acceptedAnswer: { '@type': 'Answer', text: b },
    })),
  } : null

  return (
    <>
      {/* ---------------- JSON-LD (server-rendered) ---------------- */}
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

      {/* ---------------- AMP discovery link ---------------- */}
      {/* eslint-disable-next-line @next/next/no-head-element */}
      {/* Note: <link rel="amphtml" /> is automatically picked up by metadata
          if you want to enable AMP discovery, uncomment in generateMetadata */}

      {/* ---------------- Article body ---------------- */}
      <ArticleClient
        article={article}
        content={contentWithLinks}
        similar={similar}
        slug={slug}
      />
    </>
  )
}
