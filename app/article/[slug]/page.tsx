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

    const title       = article.seoTitle       || article.title + ' | The Tech Bharat'
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
        authors:   [article.author || 'Vijay Yadav'],
        images:    article.featuredImage ? [{ url: article.featuredImage, width: 1200, height: 630 }] : [],
      },
      twitter: { card: 'summary_large_image', title, description },
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

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <ArticleClient article={article} similar={similar} slug={slug} />
    </>
  )
}

export const revalidate = 3600