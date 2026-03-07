import { getAllArticlesAsync } from '@/lib/store'
import ArticleCard from '@/components/ArticleCard'
import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Phone Comparisons – Which Smartphone Is Better? | The Tech Bharat',
  description: 'Side-by-side smartphone comparisons for Indian buyers. We compare specs, cameras, battery life, and real-world value to help you decide.',
  alternates: { canonical: 'https://thetechbharat.com/compare' },
}

export const revalidate = 60

export default async function ComparePage() {
  const allA = await getAllArticlesAsync()
  const articles = allA.filter(a => a.type === 'compare')

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="border-b-2 border-[#2a6b3c] mb-8 pb-6">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 bg-[#2a6b3c] flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <h1 className="font-playfair text-3xl font-black text-ink">Phone Comparisons</h1>
        </div>
        <p className="font-body text-sm text-[#3a3a3a] max-w-2xl">
          Stuck between two phones? We compare them properly — not just specs but real-world performance, India pricing, after-sales service, and long-term value. Our verdict helps you spend wisely.
        </p>
      </div>

      {articles.length === 0 ? (
        <div className="text-center py-20">
          <p className="font-playfair text-2xl text-ink mb-3">Comparisons coming soon</p>
          <p className="font-body text-sm text-muted mb-6">Tell us which phones you want us to compare.</p>
          <Link href="/contact" className="font-sans text-xs font-semibold text-[#2a6b3c] mt-2 inline-block border border-[#2a6b3c] px-4 py-2">Suggest a comparison →</Link>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map(article => (
              <ArticleCard key={article.id} article={article} variant="card" />
            ))}
          </div>
          
          {/* Popular comparisons guide - Issue 8: informational content */}
          <div className="mt-16 border-t border-border pt-10">
            <h2 className="font-playfair text-2xl font-bold text-ink mb-4">How to Choose Between Two Phones</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-sans text-sm font-bold text-ink mb-2">Don't just compare specs</h3>
                <p className="font-body text-sm text-[#3a3a3a] leading-relaxed">A higher number on a spec sheet doesn't always mean better real-world performance. A 108MP camera can take worse photos than a 12MP one. Software optimisation, sensor size, and ISP quality matter more.</p>
              </div>
              <div>
                <h3 className="font-sans text-sm font-bold text-ink mb-2">The India-specific factors</h3>
                <p className="font-body text-sm text-[#3a3a3a] leading-relaxed">Check the service centre network in your city. Consider 5G band support (not all 5G phones support Indian bands). Think about resale value — Samsung holds value better than most Chinese brands in India.</p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}