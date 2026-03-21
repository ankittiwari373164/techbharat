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
      alternates: { canonical },
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
  // FAQ schema — extract from article content if it has real FAQ section
  // Otherwise build from bullets with validation
  const buildFaqSchema = () => {
    const content = (article as any).content || ''
    // Try to extract real FAQ Q&A pairs from article HTML
    const faqMatches: {q: string, a: string}[] = []
    const h3Regex = /<h3[^>]*>(.*?)<\/h3>\s*<p[^>]*>(.*?)<\/p>/gi
    let match
    while ((match = h3Regex.exec(content)) !== null && faqMatches.length < 4) {
      const q = match[1].replace(/<[^>]*>/g, '').trim()
      const a = match[2].replace(/<[^>]*>/g, '').trim()
      if (q.length > 10 && a.length > 20) {
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
    // Fallback: use bullets, strip HTML, validate minimum length
    const safeB = Array.isArray((article as any).bullets) ? (article as any).bullets : []
    const validBullets = safeB
      .map((b: string) => b.replace(/<[^>]*>/g, '').trim())
      .filter((b: string) => b.length >= 20)
    if (validBullets.length < 2) return null
    const questions = [
      `What is the key highlight of the ${article.title}?`,
      `What is the India price or availability?`,
      `What are the limitations or concerns?`,
      `Should Indian buyers consider this?`,
    ]
    return {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: validBullets.slice(0, 4).map((b: string, i: number) => ({
        '@type': 'Question',
        name: questions[i] || `Question ${i + 1} about ${article.title}`,
        acceptedAnswer: { '@type': 'Answer', text: b },
      })),
    }
  }
  const faqSchema = buildFaqSchema()

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