import { getAllArticlesAsync } from '@/lib/store'
import ArticleCard from '@/components/ArticleCard'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Phone Comparisons – Compare Smartphones India',
  description: 'Side-by-side smartphone comparisons to help Indian buyers choose the best phone for their budget.',
}

export const revalidate = 60

export default async function ComparePage() {
  const allA = await getAllArticlesAsync(); const articles = allA.filter(a => a.type === 'compare')

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="border-b-2 border-[#2a6b3c] mb-8 pb-4">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-8 h-8 bg-[#2a6b3c] flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
            </svg>
          </div>
          <h1 className="font-playfair text-3xl font-bold text-ink">Comparisons</h1>
        </div>
        <p className="font-sans text-sm text-muted">
          Detailed phone vs phone comparisons to help you make the best buying decision
        </p>
      </div>

      {articles.length === 0 ? (
        <div className="text-center py-20">
          <p className="font-playfair text-2xl font-bold mb-3">No Comparisons Yet</p>
          <a href="/api/fetch-news" className="inline-block bg-[#d4220a] text-white font-sans font-bold px-6 py-3 text-sm">
            Fetch Latest Comparisons →
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