import { getAllArticlesAsync } from '@/lib/store'
import ArticleCard from '@/components/ArticleCard'
import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Phone Reviews – Honest Smartphone Reviews India | The Tech Bharat',
  description: 'In-depth smartphone reviews with real-world testing, camera comparisons, battery life analysis. Written by experienced journalists for Indian buyers.',
  alternates: { canonical: 'https://thetechbharat.com/reviews' },
  openGraph: {
    title: 'Phone Reviews India | The Tech Bharat',
    description: 'Honest smartphone reviews for Indian buyers — battery, camera, 5G, value for money.',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630 }],
  },
}

export const revalidate = 60

export default async function ReviewsPage() {
  const allA = await getAllArticlesAsync()
  const articles = allA.filter(a => a.type === 'review')

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="border-b-2 border-[#d4220a] mb-8 pb-6">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 bg-[#d4220a] flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
          </div>
          <h1 className="font-playfair text-3xl font-black text-ink">Phone Reviews</h1>
        </div>
        <p className="font-body text-sm text-[#3a3a3a] max-w-2xl mb-3">
          Our reviewers test phones for real — checking battery in Delhi heat, camera in low Indian light, and 5G connectivity on actual Indian networks. No spec sheets, just genuine experience.
        </p>
        {/* E-E-A-T signal */}
        <div className="flex items-center gap-2 mt-2">
          <span className="font-sans text-[10px] bg-[#d4220a]/10 text-[#d4220a] px-2 py-1 font-semibold">✓ Real-world tested</span>
          <span className="font-sans text-[10px] bg-[#1a3a5c]/10 text-[#1a3a5c] px-2 py-1 font-semibold">✓ India-specific conditions</span>
          <span className="font-sans text-[10px] bg-green-100 text-green-800 px-2 py-1 font-semibold">✓ No brand sponsorship</span>
        </div>
      </div>

      {articles.length === 0 ? (
        <div className="text-center py-20">
          <p className="font-playfair text-2xl text-ink mb-3">Reviews coming soon</p>
          <p className="font-body text-sm text-muted">Our team tests devices for 2–4 weeks before publishing. Quality over speed.</p>
          <Link href="/mobile-news" className="font-sans text-xs font-semibold text-[#d4220a] mt-4 inline-block">← Read Latest News</Link>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map(article => (
              <ArticleCard key={article.id} article={article} variant="card" />
            ))}
          </div>

          {/* Informational content - Issue 8 fix */}
          <div className="mt-16 border-t border-border pt-10">
            <h2 className="font-playfair text-2xl font-bold text-ink mb-4">How We Review Phones</h2>
            <p className="font-body text-sm text-[#3a3a3a] leading-relaxed max-w-3xl mb-6">
              Every phone reviewed at The Tech Bharat goes through a minimum 2-week testing period. We test in real Indian conditions — not climate-controlled labs. Our reviewers check 5G band support (n78/n77), performance under heat, camera in Indian light conditions, and long-term battery drain. We never accept paid reviews.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Battery tested', detail: 'Real usage, not lab' },
                { label: 'Camera tested', detail: 'Indian daylight + low light' },
                { label: '5G verified', detail: 'n78/n77 band check' },
                { label: 'Heat tested', detail: '35°C+ conditions' },
              ].map(item => (
                <div key={item.label} className="bg-white border border-border p-4 text-center">
                  <p className="font-sans text-xs font-bold text-ink mb-1">{item.label}</p>
                  <p className="font-body text-[11px] text-muted">{item.detail}</p>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}