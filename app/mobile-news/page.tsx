import { getAllArticles } from '@/lib/store'
import ArticleCard from '@/components/ArticleCard'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Mobile News – Latest Smartphone News India',
  description: 'Latest mobile phone news, launches, leaks, and updates from Samsung, Apple, Xiaomi, OnePlus and more Indian smartphone brands.',
}

export const revalidate = 300

export default function MobileNewsPage({
  searchParams,
}: {
  searchParams: { brand?: string }
}) {
  let articles = getAllArticles().filter(a => a.type === 'mobile-news')

  if (searchParams.brand) {
    articles = articles.filter(a =>
      a.brand.toLowerCase() === searchParams.brand!.toLowerCase()
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="border-b-2 border-[#1a3a5c] mb-8 pb-4">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-8 h-8 bg-[#1a3a5c] flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <h1 className="font-playfair text-3xl font-bold text-ink">
            {searchParams.brand ? `${searchParams.brand} News` : 'Mobile News'}
          </h1>
        </div>
        <p className="font-sans text-sm text-muted">
          {searchParams.brand
            ? `Latest news and updates about ${searchParams.brand} smartphones`
            : 'Real-time mobile phone news, launches, leaks, and analysis for Indian readers'}
        </p>
      </div>

      {/* Brand Filter */}
      <div className="flex flex-wrap gap-2 mb-8">
        {['All', 'Samsung', 'Apple', 'Xiaomi', 'OnePlus', 'Realme', 'Vivo', 'OPPO', 'iQOO', 'Poco', 'Nothing'].map(brand => (
          <a
            key={brand}
            href={brand === 'All' ? '/mobile-news' : `/mobile-news?brand=${brand}`}
            className={`font-sans text-xs font-semibold px-3 py-1.5 border transition-colors ${
              (brand === 'All' && !searchParams.brand) || brand === searchParams.brand
                ? 'bg-[#1a3a5c] text-white border-[#1a3a5c]'
                : 'bg-white text-ink border-border hover:border-[#1a3a5c]'
            }`}
          >
            {brand}
          </a>
        ))}
      </div>

      {articles.length === 0 ? (
        <div className="text-center py-20">
          <p className="font-playfair text-2xl font-bold text-ink mb-3">No Articles Yet</p>
          <p className="font-sans text-muted mb-6">Click below to fetch the latest mobile news.</p>
          <a href="/api/fetch-news" className="inline-block bg-[#d4220a] text-white font-sans font-bold px-6 py-3 text-sm">
            Fetch Mobile News →
          </a>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 stagger-children">
          {articles.map(article => (
            <ArticleCard key={article.id} article={article} variant="card" />
          ))}
        </div>
      )}
    </div>
  )
}
