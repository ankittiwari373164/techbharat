'use client'
import Link from 'next/link'
import Image from 'next/image'

interface Article {
  id: string
  slug: string
  title: string
  summary?: string
  brand?: string
  type?: string
  category?: string
  publishDate?: string
  readTime?: number
  featuredImage?: string
  tags?: string[]
  isFeatured?: boolean
}

function formatDate(iso?: string) {
  if (!iso) return ''
  return new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
}

function TypeBadge({ type }: { type?: string }) {
  const map: Record<string, { label: string; cls: string }> = {
    'mobile-news': { label: 'MOBILE NEWS', cls: 'bg-[#1a3a5c] text-white' },
    'review':      { label: 'REVIEW',       cls: 'bg-[#d4220a] text-white' },
    'compare':     { label: 'COMPARE',      cls: 'bg-[#2a6b3c] text-white' },
  }
  const t = map[type || ''] || { label: (type || '').toUpperCase(), cls: 'bg-gray-700 text-white' }
  return (
    <span className={`inline-block text-[10px] font-bold px-2 py-0.5 tracking-wider ${t.cls}`}>
      {t.label}
    </span>
  )
}

interface Props {
  article: Article
  variant?: 'hero' | 'card' | 'side' | 'list'
}

export default function ArticleCard({ article, variant = 'card' }: Props) {
  const href = `/${article.slug}`

  if (variant === 'hero') {
    return (
      <Link href={href} className="block group relative overflow-hidden rounded-sm" style={{ textDecoration: 'none' }}>
        <div className="relative aspect-[16/9] bg-gray-100 overflow-hidden">
          {article.featuredImage ? (
            <Image
              src={article.featuredImage}
              alt={article.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              sizes="(max-width: 768px) 100vw, 66vw"
              priority
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-[#1a3a5c] to-[#0d0d0d] flex items-center justify-center">
              <span className="text-white/20 text-6xl font-black">{article.brand?.charAt(0) || 'T'}</span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-5">
            <div className="flex items-center gap-2 mb-2">
              <TypeBadge type={article.type} />
              {article.brand && <span className="text-[10px] font-bold text-white/70 uppercase tracking-wider">{article.brand}</span>}
            </div>
            <h2 className="font-playfair text-2xl md:text-3xl font-bold text-white leading-tight mb-2 group-hover:text-gray-200">
              {article.title}
            </h2>
            {article.summary && (
              <p className="text-gray-300 text-sm line-clamp-2 hidden md:block">{article.summary}</p>
            )}
            <div className="flex items-center gap-3 mt-3 text-xs text-gray-400">
              <span>{formatDate(article.publishDate)}</span>
              {article.readTime && <span>· {article.readTime} min read</span>}
            </div>
          </div>
        </div>
      </Link>
    )
  }

  if (variant === 'side') {
    return (
      <Link href={href} className="flex gap-3 group" style={{ textDecoration: 'none' }}>
        <div className="relative w-20 h-16 flex-shrink-0 overflow-hidden rounded-sm bg-gray-100">
          {article.featuredImage ? (
            <Image
              src={article.featuredImage}
              alt={article.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="80px"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-[#1a3a5c] to-[#0d0d0d]" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <TypeBadge type={article.type} />
          <h3 className="font-sans text-sm font-semibold text-ink leading-snug mt-1 line-clamp-2 group-hover:text-[#d4220a] transition-colors">
            {article.title}
          </h3>
          <p className="text-xs text-muted mt-1">{formatDate(article.publishDate)}</p>
        </div>
      </Link>
    )
  }

  if (variant === 'list') {
    return (
      <Link href={href} className="flex gap-4 py-4 border-b border-border group last:border-0" style={{ textDecoration: 'none' }}>
        <div className="relative w-24 h-18 flex-shrink-0 overflow-hidden rounded-sm bg-gray-100" style={{ height: '4.5rem' }}>
          {article.featuredImage ? (
            <Image
              src={article.featuredImage}
              alt={article.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="96px"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-[#1a3a5c] to-[#0d0d0d]" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <TypeBadge type={article.type} />
            {article.brand && <span className="text-[10px] text-muted font-medium uppercase">{article.brand}</span>}
          </div>
          <h3 className="font-sans text-sm font-semibold text-ink leading-snug line-clamp-2 group-hover:text-[#d4220a] transition-colors">
            {article.title}
          </h3>
          <p className="text-xs text-muted mt-1">{formatDate(article.publishDate)} {article.readTime ? `· ${article.readTime} min` : ''}</p>
        </div>
      </Link>
    )
  }

  // default: card
  return (
    <Link href={href} className="group flex flex-col overflow-hidden rounded-sm border border-border bg-white hover:shadow-md transition-shadow" style={{ textDecoration: 'none' }}>
      <div className="relative aspect-[16/9] overflow-hidden bg-gray-100">
        {article.featuredImage ? (
          <Image
            src={article.featuredImage}
            alt={article.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-[#1a3a5c] to-[#0d0d0d] flex items-center justify-center">
            <span className="text-white/20 text-4xl font-black">{article.brand?.charAt(0) || 'T'}</span>
          </div>
        )}
      </div>
      <div className="p-4 flex-1 flex flex-col">
        <div className="flex items-center gap-2 mb-2">
          <TypeBadge type={article.type} />
          {article.brand && <span className="text-[10px] text-muted font-medium uppercase">{article.brand}</span>}
        </div>
        <h3 className="font-sans text-sm font-semibold text-ink leading-snug line-clamp-2 group-hover:text-[#d4220a] transition-colors flex-1">
          {article.title}
        </h3>
        <p className="text-xs text-muted mt-2">{formatDate(article.publishDate)} {article.readTime ? `· ${article.readTime} min` : ''}</p>
      </div>
    </Link>
  )
}