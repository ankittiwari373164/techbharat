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
      alternates: { canonical, types: { 'application/amphtml': `${SITE_URL}/${params.slug}/amp` } },
      openGraph: {
        title, description,
        url:       canonical,
        siteName:  'The Tech Bharat',
        type:      'article',
        publishedTime: article.publishDate,
        modifiedTime:  (article as any).updatedDate || article.publishDate,
        authors:   [article.author || 'Vijay Yadav'],
        images:    article.featuredImage
          ? [{ url: article.featuredImage, width: 1200, height: 630, alt: title }]
          : [{ url: 'https://thetechbharat.com/og-image.jpg', width: 1200, height: 630, alt: 'The Tech Bharat' }],
      },
      twitter: {
        card:        'summary_large_image',
        title,
        description,
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

  // Schema.org JSON-LD — in raw HTML for crawlers
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: article.title,
    description: article.seoDescription || article.summary,
    image: article.featuredImage ? [article.featuredImage] : [],
    datePublished: article.publishDate,
    dateModified: article.updatedDate || article.publishDate,
    url: `${SITE_URL}/${slug}`,
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
    mainEntityOfPage: { '@type': 'WebPage', '@id': `${SITE_URL}/${slug}` },
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

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      {faqSchema && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />}
      <ArticleClient article={article} similar={similar} slug={slug} />
    </>
  )
}

export const revalidate = 3600