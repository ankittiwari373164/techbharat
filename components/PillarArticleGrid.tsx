// components/PillarArticleGrid.tsx
// Reusable grid of articles shown on pillar pages

import Link from 'next/link'
import { PillarArticle, formatPillarDate } from '@/lib/pillar-utils'

interface Props {
  articles: PillarArticle[]
  title?: string
  emptyMessage?: string
}

export default function PillarArticleGrid({ articles, title = 'Related Articles', emptyMessage }: Props) {
  if (articles.length === 0) {
    return emptyMessage ? (
      <p className="font-sans text-sm text-muted italic">{emptyMessage}</p>
    ) : null
  }

  return (
    <section className="mt-10 pt-6 border-t-2 border-border">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-6 h-0.5 bg-[#d4220a]" />
        <h2 className="font-playfair text-xl font-bold text-ink">{title}</h2>
        <span className="font-sans text-xs text-muted">({articles.length} articles)</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {articles.map(article => (
          <Link
            key={article.slug}
            href={`/${article.slug}`}
            className="bg-white border border-border hover:border-[#d4220a] transition-colors group block"
          >
            {/* Image */}
            {article.featuredImage && (
              <div className="relative overflow-hidden" style={{ paddingBottom: '56.25%' }}>
                <img
                  src={article.featuredImage}
                  alt={article.title}
                  width={400}
                  height={225}
                  loading="lazy"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
                />
                <span className="absolute top-2 left-2 bg-[#d4220a] text-white font-sans text-[9px] font-bold px-2 py-0.5 uppercase tracking-wider z-10">
                  {article.type === 'review' ? 'Review' : article.type === 'compare' ? 'Compare' : 'News'}
                </span>
              </div>
            )}

            {/* Content */}
            <div className="p-3">
              <div className="flex items-center gap-2 mb-1.5">
                <span className="font-sans text-[10px] font-bold text-[#d4220a] uppercase tracking-wide">
                  {article.brand}
                </span>
                <span className="font-sans text-[10px] text-muted ml-auto">
                  {formatPillarDate(article.publishDate)}
                </span>
              </div>
              <h3 className="font-sans text-sm font-bold text-ink leading-snug group-hover:text-[#d4220a] transition-colors line-clamp-2 mb-1.5">
                {article.title}
              </h3>
              <p className="font-sans text-xs text-muted line-clamp-2">
                {article.summary}
              </p>
              <div className="mt-2 flex items-center justify-between">
                <span className="font-sans text-[10px] text-muted">{article.readTime} min read</span>
                <span className="font-sans text-xs font-semibold text-[#d4220a]">Read →</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}