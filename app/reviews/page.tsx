import { getAllArticlesAsync } from '@/lib/store'
import ArticleCard from '@/components/ArticleCard'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Phone Reviews & First Looks – The Tech Bharat',
  description: 'Smartphone reviews, first looks, and pre-launch analysis for Indian buyers. Honest specs breakdown, India pricing, and buying advice from The Tech Bharat.',
}

export const revalidate = 60

export default async function ReviewsPage() {
  const all      = await getAllArticlesAsync() as any[]
  const reviews  = all.filter((a: any) => a.type === 'review')
  const featured = reviews[0]
  const rest     = reviews.slice(1)

  return (
    <div className="bg-paper min-h-screen">
      {/* Page Header */}
      <div className="bg-[#0d0d0d] text-white py-10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-0.5 bg-[#d4220a]" />
            <span className="font-sans text-xs font-bold uppercase tracking-widest text-[#d4220a]">Reviews & Analysis</span>
          </div>
          <h1 className="font-playfair text-3xl md:text-5xl font-black mb-4">
            Phone Reviews & First Looks
          </h1>
          <p className="font-sans text-gray-400 text-base max-w-2xl">
            In-depth analysis, early impressions, and buying guidance for Indian smartphone buyers.
            We cover confirmed launches, official announcements, and pre-launch analysis — always clearly labelled.
          </p>

          {/* Content type legend */}
          <div className="flex flex-wrap gap-3 mt-6">
            <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded">
              <span className="w-2 h-2 bg-green-400 rounded-full" />
              <span className="font-sans text-xs text-gray-300">Confirmed Launch — device available in India</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded">
              <span className="w-2 h-2 bg-amber-400 rounded-full" />
              <span className="font-sans text-xs text-gray-300">Pre-Launch Analysis — based on official announcements</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded">
              <span className="w-2 h-2 bg-blue-400 rounded-full" />
              <span className="font-sans text-xs text-gray-300">Based on Leaks — unconfirmed, clearly labelled</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-10">
        {reviews.length === 0 ? (
          <div className="text-center py-20">
            <p className="font-sans text-muted text-lg">No reviews published yet.</p>
            <Link href="/" className="font-sans text-sm text-[#d4220a] hover:underline mt-3 inline-block">← Back to Home</Link>
          </div>
        ) : (
          <>
            {/* Featured Review */}
            {featured && (
              <div className="mb-10">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-8 h-0.5 bg-[#d4220a]" />
                  <h2 className="font-playfair text-xl font-bold text-ink">Latest Analysis</h2>
                </div>
                <ArticleCard article={featured} variant="hero" />
              </div>
            )}

            {/* Rest of reviews */}
            {rest.length > 0 && (
              <div>
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-8 h-0.5 bg-[#1a3a5c]" />
                  <h2 className="font-playfair text-xl font-bold text-ink">All Reviews & First Looks</h2>
                  <div className="flex-1 h-px bg-border" />
                  <span className="font-sans text-xs text-muted">{rest.length} articles</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {rest.map((article: any) => (
                    <ArticleCard key={article.id} article={article} variant="card" />
                  ))}
                </div>
              </div>
            )}

            {/* Editorial note — honest about content types */}
            <div className="mt-12 bg-[#f8f4ef] border border-border p-6 rounded-xl">
              <h3 className="font-playfair text-lg font-bold text-ink mb-2">About Our Reviews Section</h3>
              <p className="font-sans text-sm text-muted leading-relaxed">
                The Tech Bharat publishes both hands-on device analysis and pre-launch coverage of upcoming smartphones.
                Articles based on leaked specifications or official announcements include a clearly visible source note.
                All pricing listed as &quot;expected&quot; or &quot;estimated&quot; is analyst-based and should be verified
                against official sources before purchase. For confirmed India pricing, check Flipkart or Amazon India directly.
              </p>
              <div className="flex flex-wrap gap-4 mt-4 text-xs font-sans text-muted">
                <Link href="/editorial-policy" className="text-[#d4220a] hover:underline">Editorial Policy →</Link>
                <Link href="/about" className="text-[#d4220a] hover:underline">About The Tech Bharat →</Link>
                <Link href="/compare" className="text-[#d4220a] hover:underline">Compare Phones →</Link>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}