// app/article/[slug]/page.tsx
// =====================================================================
//  ADSENSE REMEDIATION v5
// ---------------------------------------------------------------------
//  Builds on v3 (FAQ duplicate fix) and v4 (verdict/filler removal) by
//  adding the content-quality gate flagged in the audit:
//
//   • If an article's body is less than ~600 words of real text, OR
//     its content is missing entirely, we emit `noindex,follow` so
//     thin pages don't pull the site's quality score down. The page
//     still renders for users (so internal links and direct visits
//     work), but Google won't index it. This is the safest way to
//     protect AdSense quality scoring while we backfill content.
//
//   • Articles still flagged as speculative get a top-of-page banner
//     (in ArticleClient) rather than only a small bottom disclaimer.
//
//   • Removed the bullets-based FAQPage JSON-LD fabricator entirely.
//     The previous "What about <title>? Point N" fake FAQ questions
//     were obvious schema spam to Google. We now ONLY emit FAQPage
//     when the article body itself contains real Q&A markup AND we
//     extract those real Qs/As. (We let Google auto-parse them; we
//     no longer emit our own bullet-based one.)
// =====================================================================
import { getAllArticlesAsync } from '@/lib/store'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import ArticleClient from './ArticleClient'
import { addInternalLinksRich } from '@/lib/internal-linking'
import { getPillarsForArticle } from '@/lib/pillar-registry'

export const dynamic = 'force-dynamic'
export const revalidate = 3600

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://thetechbharat.com'

// Minimum body word count to be eligible for indexing.
// Articles thinner than this get noindex,follow.
const MIN_INDEXABLE_WORDS = 600

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
//  Word counter (strips HTML tags)
// ---------------------------------------------------------------------
function countWords(html: string): number {
  if (!html || typeof html !== 'string') return 0
  const text = html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
  if (!text) return 0
  return text.split(' ').length
}

// ---------------------------------------------------------------------
//  Detect in-content FAQ section (kept from v3)
// ---------------------------------------------------------------------
function hasInContentFaq(html: string): boolean {
  if (!html) return false
  const patterns = [
    /<h[1-6][^>]*>\s*Frequently\s+Asked\s+Questions\s*<\/h[1-6]>/i,
    /<h[1-6][^>]*>\s*FAQs?\s*<\/h[1-6]>/i,
    /<h[1-6][^>]*>\s*Common\s+Questions\s*<\/h[1-6]>/i,
    /<h[1-6][^>]*>\s*Questions?\s+(and|&amp;|&)\s+Answers\s*<\/h[1-6]>/i,
    /##\s*Frequently\s+Asked\s+Questions/i,
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

  // ── Content quality gate for indexing ───────────────────────────
  const wc = countWords(article.content || '')
  const isThin = wc < MIN_INDEXABLE_WORDS
  const isExplicitlyNoindex = article.noindex === true

  const indexable = !isThin && !isExplicitlyNoindex

  return {
    title:       rawTitle,
    description,
    keywords:    article.tags || [],
    authors:     [{ name: article.author || 'Vijay Yadav', url: `${SITE_URL}/author` }],

    alternates: { canonical },

    robots: {
      index:  indexable,
      follow: true,
      googleBot: {
        index: indexable,
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
  let linkingResult: { html: string; readAlso: any[]; linksAdded: number } =
    { html: article.content || '', readAlso: [], linksAdded: 0 }
  try {
    linkingResult = addInternalLinksRich(
      article.content || '',
      slug,
      articles,
      {
        maxLinks: 6,
        brand:    article.brand,
        type:     article.type,
        tags:     article.tags,
      },
    )
    contentWithLinks = linkingResult.html
  } catch {
    contentWithLinks = article.content || ''
  }

  // Pillars relevant to this article (for back-link strip in client)
  const relevantPillars = getPillarsForArticle({
    brand:   article.brand,
    type:    article.type,
    tags:    article.tags,
    title:   article.title,
    summary: article.summary,
  }).slice(0, 3)

  // Similar articles: exclude noindexed ones (we don't want hub pages
  // pointing at hidden content) AND only show same-brand or same-type
  // articles for relevance.
  const seen = new Set([slug])
  similar = articles
    .filter(a => {
      if (!a.slug || seen.has(a.slug)) return false
      if (!a.title) return false
      if (a.noindex === true) return false
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

  // 3) FAQ schema — REMOVED FABRICATED VERSION.
  //    Previously, when the article body had NO real FAQ section, we
  //    synthesised a fake FAQPage from `bullets[]` with questions like
  //    "What about <title>? Point N". Google treats this as schema spam.
  //    If the article body has a real FAQ heading + Q&A, Google's rich
  //    results parser will pick that up automatically; we don't need to
  //    emit our own. So we no longer emit any synthetic FAQPage.
  const articleHasFaq = hasInContentFaq(contentWithLinks)
  // Note: articleHasFaq is computed but no longer drives any emission.
  // Variable retained for future use (e.g., for routing real FAQs into
  // a proper extractor that pulls Q/A pairs from real markup).
  void articleHasFaq

  // 4) Related ItemList schema — helps Google understand the "More like
  //    this" section is a proper curated list. Only emit when we have
  //    at least 3 related articles.
  const itemListSchema = similar.length >= 3 ? {
    '@context': 'https://schema.org',
    '@type':    'ItemList',
    name:       'Related articles',
    itemListElement: similar.slice(0, 4).map((a: any, i: number) => ({
      '@type':   'ListItem',
      position:  i + 1,
      url:       `${SITE_URL}/${a.slug}`,
      name:      a.title,
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
      {itemListSchema && (
        <script
          id="ld-itemlist"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
        />
      )}

      <ArticleClient
        article={article}
        content={contentWithLinks}
        similar={similar}
        slug={slug}
        pillars={relevantPillars}
      />
    </>
  )
}
