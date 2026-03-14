'use client'

import { useEffect, useState, useRef } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import Head from 'next/head'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://thetechbharat.com'

interface Article {
  slug: string
  title: string
  summary: string
  content: string
  brand: string
  type: string
  author: string
  publishDate: string
  featuredImage?: string
  tags?: string[]
  views?: number
  seoTitle?: string
  metaDescription?: string
  sourceUrl?: string
}

interface Review {
  name: string
  rating: number
  comment: string
  date: string
}

// Auto internal link keywords
const LINK_RULES: { pattern: RegExp; href: string }[] = [
  { pattern: /\b(Samsung)\b/gi,   href: '/mobile-news?brand=Samsung' },
  { pattern: /\b(Apple|iPhone)\b/gi, href: '/mobile-news?brand=Apple' },
  { pattern: /\b(Xiaomi|Redmi|MIUI)\b/gi, href: '/mobile-news?brand=Xiaomi' },
  { pattern: /\b(OnePlus)\b/gi,   href: '/mobile-news?brand=OnePlus' },
  { pattern: /\b(Realme)\b/gi,    href: '/mobile-news?brand=Realme' },
  { pattern: /\b(OPPO)\b/gi,      href: '/mobile-news?brand=OPPO' },
  { pattern: /\b(Vivo)\b/gi,      href: '/mobile-news?brand=Vivo' },
  { pattern: /\b(iQOO)\b/gi,      href: '/mobile-news?brand=iQOO' },
  { pattern: /\b(Poco)\b/gi,      href: '/mobile-news?brand=Poco' },
  { pattern: /\b(Motorola)\b/gi,  href: '/mobile-news?brand=Motorola' },
  { pattern: /\b(Nothing Phone)\b/gi, href: '/mobile-news?brand=Nothing' },
  { pattern: /\b(Google Pixel)\b/gi,  href: '/mobile-news?brand=Google' },
  { pattern: /\b(compare[sd]?|versus|vs\.)\b/gi, href: '/compare' },
  { pattern: /\b(hands-on|first look|unboxing)\b/gi, href: '/reviews' },
  { pattern: /\b(smartphone review|phone review)\b/gi, href: '/reviews' },
  { pattern: /\b(5G phone|5G band|5G network)\b/gi, href: '/mobile-news' },
  { pattern: /\b(budget phone|flagship phone|mid-range)\b/gi, href: '/mobile-news' },
]

function addInternalLinks(html: string): string {
  const usedHrefs = new Set<string>()
  let result = html

  for (const rule of LINK_RULES) {
    if (usedHrefs.has(rule.href)) continue
    const tempMarker = `__LINK_${Math.random().toString(36).slice(2)}__`
    let replaced = false
    result = result.replace(rule.pattern, (match, offset, str) => {
      // Don't replace inside existing tags
      const before = str.slice(0, offset)
      const openTags = (before.match(/<[^/][^>]*>/g) || []).length
      const closeTags = (before.match(/<\/[^>]+>/g) || []).length
      if (openTags > closeTags) return match
      if (replaced) return match
      replaced = true
      usedHrefs.add(rule.href)
      return `<a href="${rule.href}" class="article-internal-link">${match}</a>`
    })
  }
  return result
}

function StarRating({ rating }: { rating: number }) {
  return (
    <span>
      {[1,2,3,4,5].map(i => (
        <span key={i} style={{ color: i <= rating ? '#f59e0b' : '#d1d5db' }}>★</span>
      ))}
    </span>
  )
}

export default function ArticlePage() {
  const params = useParams()
  // Middleware rewrites /slug → /article/slug internally
  // useParams() reads from the REWRITTEN path so slug is correct
  // Fallback: parse from window.location if params is empty
  const rawSlug = params?.slug as string | undefined
  const [slug, setSlug] = useState<string>(rawSlug || '')

  useEffect(() => {
    if (!rawSlug && typeof window !== 'undefined') {
      // Extract slug from clean URL e.g. /iphone-17e-reality-check
      const parts = window.location.pathname.split('/').filter(Boolean)
      if (parts.length === 1) setSlug(parts[0])
    } else if (rawSlug) {
      setSlug(rawSlug)
    }
  }, [rawSlug])
  const [article, setArticle] = useState<Article | null>(null)
  const [similar, setSimilar] = useState<Article[]>([])
  const [reviews] = useState<Review[]>([
    { name: 'Rahul S.', rating: 4, comment: 'Great analysis, exactly what I needed before buying.', date: '2 days ago' },
    { name: 'Priya K.', rating: 5, comment: 'Very detailed and honest review. Trusted source!', date: '1 week ago' },
  ])
  const [expanded, setExpanded] = useState(false)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const viewCounted = useRef(false)

  useEffect(() => {
    if (!slug) return
    fetch(`/api/article/${slug}`)
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (!data || data.error) { setNotFound(true); setLoading(false); return }
        setArticle(data.article)
        setSimilar(data.similar || [])
        setLoading(false)
      })
      .catch(() => { setNotFound(true); setLoading(false) })
  }, [slug])

  // Count view once
  useEffect(() => {
    if (article && !viewCounted.current) {
      viewCounted.current = true
      fetch(`/api/article/${slug}`, { method: 'POST' }).catch(() => {})
    }
  }, [article, slug])

  if (loading) return (
    <div style={{ maxWidth: 800, margin: '60px auto', padding: '0 20px', textAlign: 'center' }}>
      <div style={{ color: '#6b7280' }}>Loading article...</div>
    </div>
  )

  if (notFound || !article) return (
    <div style={{ maxWidth: 800, margin: '60px auto', padding: '0 20px', textAlign: 'center' }}>
      <h1 style={{ fontSize: 24, marginBottom: 16 }}>Article Not Found</h1>
      <Link href="/" style={{ color: '#dc2626', textDecoration: 'none' }}>← Back to Home</Link>
    </div>
  )

  const canonicalUrl = `${SITE_URL}/${slug}`
  const linkedContent = addInternalLinks(article.content || '')
  const preview = article.content?.replace(/<[^>]+>/g, '').slice(0, 400) + '...'

  const typeLabel = article.type === 'review' ? 'Hands-On' : article.type === 'compare' ? 'Comparison' : 'Mobile News'
  const typeColor = article.type === 'review' ? '#7c3aed' : article.type === 'compare' ? '#0891b2' : '#dc2626'

  return (
    <>
      {/* Per-article canonical — this is the critical fix */}
      <Head>
        <link rel="canonical" href={canonicalUrl} />
        <title>{article.seoTitle || article.title} | The Tech Bharat</title>
        <meta name="description" content={article.metaDescription || article.summary} />
        <meta property="og:title" content={article.title} />
        <meta property="og:description" content={article.summary} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:type" content="article" />
        {article.featuredImage && <meta property="og:image" content={article.featuredImage} />}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="robots" content="index, follow, max-image-preview:large" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'NewsArticle',
              headline: article.title,
              description: article.summary,
              image: article.featuredImage ? [article.featuredImage] : [],
              datePublished: article.publishDate,
              dateModified: article.publishDate,
              author: { '@type': 'Person', name: article.author || 'Vijay Yadav', url: `${SITE_URL}/author` },
              publisher: {
                '@type': 'Organization',
                name: 'The Tech Bharat',
                logo: { '@type': 'ImageObject', url: `${SITE_URL}/logo.png` },
              },
              mainEntityOfPage: { '@type': 'WebPage', '@id': canonicalUrl },
            }),
          }}
        />
      </Head>

      <div style={{ maxWidth: 860, margin: '0 auto', padding: '24px 20px' }}>

        {/* Breadcrumb */}
        <nav style={{ fontSize: 13, color: '#6b7280', marginBottom: 16 }}>
          <Link href="/" style={{ color: '#6b7280', textDecoration: 'none' }}>Home</Link>
          {' › '}
          <Link href="/mobile-news" style={{ color: '#6b7280', textDecoration: 'none' }}>Mobile News</Link>
          {' › '}
          <span style={{ color: '#374151' }}>{article.brand}</span>
        </nav>

        {/* Type badge */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
          <span style={{ background: typeColor, color: '#fff', padding: '3px 10px', borderRadius: 4, fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            {typeLabel}
          </span>
          {article.brand && (
            <Link href={`/mobile-news?brand=${article.brand}`} style={{ background: '#f3f4f6', color: '#374151', padding: '3px 10px', borderRadius: 4, fontSize: 12, fontWeight: 500, textDecoration: 'none' }}>
              {article.brand}
            </Link>
          )}
        </div>

        {/* Title */}
        <h1 style={{ fontSize: 'clamp(22px, 4vw, 32px)', fontWeight: 800, lineHeight: 1.25, color: '#111827', marginBottom: 12 }}>
          {article.title}
        </h1>

        {/* Meta */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px 24px', fontSize: 13, color: '#6b7280', marginBottom: 20, alignItems: 'center' }}>
          <span>
            By{' '}
            <Link href="/author" style={{ color: '#dc2626', fontWeight: 600, textDecoration: 'none' }}>
              {article.author || 'Vijay Yadav'}
            </Link>
            {' '}· 11 yrs experience
          </span>
          <span>
            {article.publishDate
              ? new Date(article.publishDate).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })
              : ''}
          </span>
          <span>5 min read</span>
          {article.views ? <span>👁 {article.views} views</span> : null}
        </div>

        {/* Featured image */}
        {article.featuredImage && (
          <div style={{ marginBottom: 24, borderRadius: 12, overflow: 'hidden' }}>
            <img
              src={article.featuredImage}
              alt={article.title}
              style={{ width: '100%', height: 'auto', maxHeight: 480, objectFit: 'cover', display: 'block' }}
              onError={(e) => {
                const t = e.target as HTMLImageElement
                t.src = 'https://source.unsplash.com/1200x675/?smartphone,technology'
              }}
            />
          </div>
        )}

        {/* Quick Summary */}
        <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderLeft: '4px solid #dc2626', borderRadius: 8, padding: '16px 20px', marginBottom: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8, flexWrap: 'wrap', gap: 8 }}>
            <strong style={{ color: '#dc2626', fontSize: 14, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Quick Summary</strong>
            <span style={{ fontSize: 12, color: '#6b7280' }}>
              {article.brand} · {article.publishDate ? new Date(article.publishDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : ''}
            </span>
          </div>
          <p style={{ fontSize: 15, color: '#374151', margin: 0, lineHeight: 1.6 }}>{article.summary}</p>
        </div>

        {/* Intro + Read More */}
        <div style={{ fontSize: 16, lineHeight: 1.8, color: '#1f2937' }}>
          {!expanded ? (
            <>
              <p style={{ marginBottom: 16 }}>{preview}</p>
              <button
                onClick={() => setExpanded(true)}
                style={{ background: '#dc2626', color: '#fff', border: 'none', padding: '10px 24px', borderRadius: 6, fontSize: 15, fontWeight: 600, cursor: 'pointer', marginBottom: 24 }}
              >
                Read Full Article ▼
              </button>
            </>
          ) : (
            <div
              className="article-body"
              dangerouslySetInnerHTML={{ __html: linkedContent }}
              style={{ marginBottom: 24 }}
            />
          )}
        </div>

        {/* Tags */}
        {article.tags && article.tags.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 32 }}>
            {article.tags.map(tag => (
              <span key={tag} style={{ background: '#f3f4f6', color: '#374151', padding: '4px 12px', borderRadius: 20, fontSize: 13 }}>#{tag}</span>
            ))}
          </div>
        )}

        {/* Explore More links */}
        <div style={{ background: '#fff7ed', border: '1px solid #fed7aa', borderRadius: 8, padding: '16px 20px', marginBottom: 32 }}>
          <strong style={{ fontSize: 14, color: '#c2410c' }}>Explore More</strong>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginTop: 10 }}>
            {article.brand && (
              <Link href={`/mobile-news?brand=${article.brand}`} style={{ color: '#dc2626', fontSize: 14, textDecoration: 'none', fontWeight: 500 }}>
                → More {article.brand} News
              </Link>
            )}
            <Link href="/compare" style={{ color: '#dc2626', fontSize: 14, textDecoration: 'none', fontWeight: 500 }}>
              → Phone Comparisons
            </Link>
            <Link href="/reviews" style={{ color: '#dc2626', fontSize: 14, textDecoration: 'none', fontWeight: 500 }}>
              → Latest Reviews
            </Link>
            <Link href="/mobile-news" style={{ color: '#dc2626', fontSize: 14, textDecoration: 'none', fontWeight: 500 }}>
              → All Mobile News
            </Link>
          </div>
        </div>

        {/* Author Box */}
        <div style={{ background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: 12, padding: '20px 24px', marginBottom: 32, display: 'flex', gap: 16, alignItems: 'flex-start' }}>
          <div style={{ width: 56, height: 56, borderRadius: '50%', background: '#dc2626', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 22, flexShrink: 0 }}>V</div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 16, color: '#111827' }}>Vijay Yadav</div>
            <div style={{ fontSize: 12, color: '#dc2626', marginBottom: 6 }}>Senior Mobile Technology Editor · 11 Years Experience</div>
            <p style={{ fontSize: 14, color: '#6b7280', margin: 0, lineHeight: 1.6 }}>
              Vijay has reviewed 400+ smartphones and covers mobile tech for Indian consumers. Based in New Delhi, he specialises in camera comparisons, battery tests, and budget phone analysis.
            </p>
            <Link href="/author" style={{ fontSize: 13, color: '#dc2626', textDecoration: 'none', fontWeight: 500 }}>View all articles →</Link>
          </div>
        </div>

        {/* User Reviews */}
        <div style={{ marginBottom: 32 }}>
          <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 16, color: '#111827' }}>Reader Reviews</h3>
          {reviews.map((r, i) => (
            <div key={i} style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 8, padding: '16px 20px', marginBottom: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#dc2626', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 13 }}>
                    {r.name[0]}
                  </div>
                  <strong style={{ fontSize: 14 }}>{r.name}</strong>
                </div>
                <StarRating rating={r.rating} />
              </div>
              <p style={{ fontSize: 14, color: '#4b5563', margin: 0 }}>{r.comment}</p>
              <div style={{ fontSize: 12, color: '#9ca3af', marginTop: 4 }}>{r.date}</div>
            </div>
          ))}
        </div>

        {/* Similar Articles */}
        {similar.length > 0 && (
          <div>
            <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 16, color: '#111827', borderBottom: '2px solid #dc2626', paddingBottom: 8 }}>
              Similar Articles
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 16 }}>
              {similar.map(a => (
                <Link key={a.slug} href={`/${a.slug}`} style={{ textDecoration: 'none' }}>
                  <div style={{ border: '1px solid #e5e7eb', borderRadius: 8, overflow: 'hidden', background: '#fff', transition: 'box-shadow 0.2s' }}>
                    {a.featuredImage && (
                      <img
                        src={a.featuredImage}
                        alt={a.title}
                        style={{ width: '100%', height: 140, objectFit: 'cover' }}
                        onError={(e) => { (e.target as HTMLImageElement).src = 'https://source.unsplash.com/400x225/?smartphone' }}
                      />
                    )}
                    <div style={{ padding: 12 }}>
                      <span style={{ fontSize: 11, color: '#dc2626', fontWeight: 600, textTransform: 'uppercase' }}>{a.brand}</span>
                      <h4 style={{ fontSize: 14, fontWeight: 600, color: '#111827', margin: '4px 0 0', lineHeight: 1.4 }}>{a.title}</h4>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      <style>{`
        .article-body { font-size: 16px; line-height: 1.85; color: #1f2937; }
        .article-body h2 { font-size: 22px; font-weight: 700; margin: 28px 0 12px; color: #111827; }
        .article-body h3 { font-size: 18px; font-weight: 600; margin: 22px 0 10px; color: #1f2937; }
        .article-body p { margin-bottom: 16px; }
        .article-body ul, .article-body ol { margin: 0 0 16px 24px; }
        .article-body li { margin-bottom: 6px; }
        .article-body strong { font-weight: 600; color: #111827; }
        .article-body table { width: 100%; border-collapse: collapse; margin: 20px 0; font-size: 14px; }
        .article-body th { background: #dc2626; color: #fff; padding: 10px 14px; text-align: left; }
        .article-body td { border: 1px solid #e5e7eb; padding: 8px 14px; }
        .article-body tr:nth-child(even) td { background: #f9fafb; }
        .article-internal-link { color: #dc2626; font-weight: 500; text-decoration: underline; }
        .article-internal-link:hover { color: #b91c1c; }
      `}</style>
    </>
  )
}