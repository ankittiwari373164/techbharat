import { getAllArticles } from '@/lib/store'
import ArticleCard from '@/components/ArticleCard'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Phone Reviews – Honest Smartphone Reviews India',
  description: 'In-depth smartphone reviews with real-world testing, camera comparisons, battery life analysis for Indian buyers.',
}

export const revalidate = 300

export default function ReviewsPage() {
  const articles = getAllArticles().filter(a => a.type === 'review')

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="border-b-2 border-[#d4220a] mb-8 pb-4">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-8 h-8 bg-[#d4220a] flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
          </div>
          <h1 className="font-playfair text-3xl font-bold text-ink">Phone Reviews</h1>
        </div>
        <p className="font-sans text-sm text-muted">
          Honest, in-depth phone reviews with real-world analysis, India pricing, and buyer verdicts
        </p>
      </div>

      {articles.length === 0 ? (
        <div className="text-center py-20">
          <p className="font-playfair text-2xl font-bold mb-3">No Reviews Yet</p>
          <a href="/api/fetch-news" className="inline-block bg-[#d4220a] text-white font-sans font-bold px-6 py-3 text-sm">
            Fetch Latest Reviews →
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
