import { getAllArticles, getFeaturedArticle } from '@/lib/store'
import ArticleCard from '@/components/ArticleCard'
import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: "TechBharat – India's Mobile Technology News",
  description: 'Latest mobile news, phone reviews, comparisons, and smartphone analysis for Indian readers. Stay updated with TechBharat.',
}

export const revalidate = 300 // Revalidate every 5 min

export default function HomePage() {
  const articles = getAllArticles()
  const featured = getFeaturedArticle()
  const latest = articles.slice(0, 6)
  const newsArticles = articles.filter(a => a.type === 'mobile-news').slice(0, 4)
  const reviewArticles = articles.filter(a => a.type === 'review').slice(0, 3)
  const compareArticles = articles.filter(a => a.type === 'compare').slice(0, 3)
  const sidebarArticles = articles.slice(1, 5)

  const hasArticles = articles.length > 0

  return (
    <div>
      {/* Hero Section */}
      {hasArticles && featured ? (
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Hero */}
            <div className="lg:col-span-2">
              <ArticleCard article={featured} variant="hero" />
            </div>
            {/* Sidebar */}
            <div className="flex flex-col gap-4">
              <div className="font-sans text-xs font-bold text-muted uppercase tracking-widest mb-1 border-b border-border pb-2">
                Latest Stories
              </div>
              {sidebarArticles.map(article => (
                <ArticleCard key={article.id} article={article} variant="side" />
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* Empty state - show welcome + fetch prompt */
        <div className="max-w-7xl mx-auto px-4 py-16 text-center">
          <div className="max-w-2xl mx-auto">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-[#d4220a]/10 rounded-full mb-6">
              <svg className="w-10 h-10 text-[#d4220a]" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 01-2.25 2.25M16.5 7.5V18a2.25 2.25 0 002.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 002.25 2.25h13.5M6 7.5h3v3H6v-3z" />
              </svg>
            </div>
            <h1 className="font-playfair text-4xl font-black text-ink mb-4">Welcome to TechBharat</h1>
            <p className="font-sans text-lg text-muted mb-8">
              Your automated mobile news portal is ready. Click the button below to fetch today's top trending mobile tech stories.
            </p>
            <div className="bg-amber-50 border border-amber-200 rounded p-4 mb-6 text-left">
              <p className="font-sans text-sm text-amber-800 font-bold mb-2">Quick Setup (min 2 keys needed):</p>
              <ol className="font-sans text-sm text-amber-700 space-y-1 list-decimal list-inside">
                <li>Add <code className="bg-amber-100 px-1">NEWSAPI_KEY</code> or <code className="bg-amber-100 px-1">GNEWS_API_KEY</code> to <code className="bg-amber-100 px-1">.env.local</code></li>
                <li>Add <code className="bg-amber-100 px-1">ANTHROPIC_API_KEY</code> or <code className="bg-amber-100 px-1">GROQ_API_KEY</code> to <code className="bg-amber-100 px-1">.env.local</code></li>
                <li>Optionally add <code className="bg-amber-100 px-1">UNSPLASH_ACCESS_KEY</code> for better images</li>
                <li>Add phone images to <code className="bg-amber-100 px-1">public/phone-images/brand-name/</code></li>
              </ol>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a href="/api/fetch-news"
                className="inline-block bg-[#d4220a] hover:bg-[#b81d09] text-white font-sans font-bold px-8 py-4 text-base transition-colors">
                Fetch Today's Mobile News →
              </a>
              <a href="/admin"
                className="inline-block bg-[#1a3a5c] hover:bg-[#0f2d4a] text-white font-sans font-bold px-8 py-4 text-base transition-colors">
                ⚙ Open Admin Panel
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Latest News Section */}
      {latest.length > 0 && (
        <section className="bg-white border-t border-border py-10">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-10 h-0.5 bg-[#d4220a]" />
              <h2 className="font-playfair text-2xl font-bold text-ink">Latest Updates</h2>
              <div className="flex-1 h-px bg-border" />
              <Link href="/mobile-news" className="font-sans text-xs font-semibold text-[#d4220a] hover:underline whitespace-nowrap">
                View All →
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 stagger-children">
              {latest.map(article => (
                <ArticleCard key={article.id} article={article} variant="card" />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Mobile News + Reviews split */}
      {(newsArticles.length > 0 || reviewArticles.length > 0) && (
        <section className="max-w-7xl mx-auto px-4 py-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Mobile News Column */}
            {newsArticles.length > 0 && (
              <div className="lg:col-span-2">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-8 h-0.5 bg-[#1a3a5c]" />
                  <h2 className="font-playfair text-xl font-bold">Mobile News</h2>
                  <div className="flex-1 h-px bg-border" />
                  <Link href="/mobile-news" className="font-sans text-xs font-semibold text-[#d4220a]">All News →</Link>
                </div>
                <div className="space-y-0">
                  {newsArticles.map(article => (
                    <ArticleCard key={article.id} article={article} variant="list" />
                  ))}
                </div>
              </div>
            )}

            {/* Reviews Sidebar */}
            {reviewArticles.length > 0 && (
              <div>
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-8 h-0.5 bg-[#d4220a]" />
                  <h2 className="font-playfair text-xl font-bold">Reviews</h2>
                  <div className="flex-1 h-px bg-border" />
                  <Link href="/reviews" className="font-sans text-xs font-semibold text-[#d4220a]">All →</Link>
                </div>
                <div className="space-y-4">
                  {reviewArticles.map(article => (
                    <ArticleCard key={article.id} article={article} variant="side" />
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Compare Section */}
      {compareArticles.length > 0 && (
        <section className="bg-[#1a3a5c]/5 border-t border-border py-10">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-10 h-0.5 bg-[#2a6b3c]" />
              <h2 className="font-playfair text-2xl font-bold text-ink">Comparisons</h2>
              <div className="flex-1 h-px bg-border" />
              <Link href="/compare" className="font-sans text-xs font-semibold text-[#d4220a] hover:underline">
                View All →
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {compareArticles.map(article => (
                <ArticleCard key={article.id} article={article} variant="card" />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Newsletter / Channel CTA */}
      <section className="bg-[#0d0d0d] py-12">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="font-playfair text-3xl font-bold text-white mb-3">Stay Ahead of Every Launch</h2>
          <p className="font-sans text-gray-400 mb-6 text-sm">
            Join 50,000+ Indian tech enthusiasts. Get breaking phone news instantly.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a href="https://t.me/techbharat" target="_blank" rel="noopener noreferrer"
              className="bg-[#2AABEE] text-white font-sans font-semibold px-6 py-3 text-sm hover:opacity-90 transition-opacity">
              Join Telegram Channel
            </a>
            <a href="https://whatsapp.com/channel/techbharat" target="_blank" rel="noopener noreferrer"
              className="bg-[#25D366] text-white font-sans font-semibold px-6 py-3 text-sm hover:opacity-90 transition-opacity">
              Join WhatsApp Channel
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}