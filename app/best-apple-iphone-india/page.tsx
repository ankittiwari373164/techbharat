// This file should be copied to:
// app/best-apple-iphone-india/page.tsx
// app/best-samsung-phones-india/page.tsx
// app/best-oneplus-phones-india/page.tsx
// etc.
// 
// Just update the constants below for each brand

import { Metadata } from 'next'
import Link from 'next/link'
import { getPillarArticles, formatPillarDate, currentMonthYear } from '@/lib/pillar-utils'

// CONFIG: Update these for each pillar page
const PILLAR_CONFIG = {
  title: 'Best iPhones in India',
  brand: 'Apple',
  slug: 'best-apple-iphone-india',
  keywords: ['Apple', 'iPhone', 'iOS', 'iPhone review', 'iPhone India price'],
  description: 'Best iPhones in India {MONTH} {YEAR} — iPhone 16 series ranked for Indian buyers. Which iPhone to buy, India pricing, and honest value analysis.',
}

export const revalidate = 3600

export async function generateMetadata(): Promise<Metadata> {
  const { month, year } = currentMonthYear()
  const title = `${PILLAR_CONFIG.title} — ${month} ${year}`
  const description = PILLAR_CONFIG.description.replace('{MONTH}', month).replace('{YEAR}', String(year))
  
  return {
    title: `${title} | The Tech Bharat`,
    description,
    alternates: { canonical: `https://thetechbharat.com/${PILLAR_CONFIG.slug}` },
    openGraph: { 
      title, 
      description,
      url: `https://thetechbharat.com/${PILLAR_CONFIG.slug}`, 
      type: 'article' 
    },
  }
}

export default async function PillarPage() {
  const { month, year } = currentMonthYear()

  // Fetch brand-specific articles
  const brandArticles = await getPillarArticles(PILLAR_CONFIG.keywords, [], 12, PILLAR_CONFIG.brand)
  const relatedArticles = await getPillarArticles(PILLAR_CONFIG.keywords, brandArticles.map(a => a.slug), 6)
  const allArticles = [...brandArticles, ...relatedArticles]
  const reviews = allArticles.filter(a => a.type === 'review' || a.type === 'compare')
  const news = allArticles.filter(a => a.type === 'mobile-news')

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      { 
        '@type': 'Question', 
        name: `What ${PILLAR_CONFIG.brand} ${PILLAR_CONFIG.title.replace('Best ', '').toLowerCase()} should I buy in India in ${month} ${year}?`,
        acceptedAnswer: { 
          '@type': 'Answer', 
          text: `Best ${PILLAR_CONFIG.brand} for most Indian users. Check the comparison table above for detailed specs and pricing.` 
        } 
      },
      { 
        '@type': 'Question', 
        name: `Is ${PILLAR_CONFIG.brand} more expensive in India than abroad?`, 
        acceptedAnswer: { 
          '@type': 'Answer', 
          text: "Yes, typically 15-25% more expensive than USA pricing due to import duties and GST." 
        } 
      },
    ],
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <div className="bg-paper min-h-screen">
        <div className="max-w-4xl mx-auto px-4 py-10">

          {/* Breadcrumb */}
          <nav className="font-sans text-xs text-muted mb-6 flex items-center gap-2 flex-wrap">
            <Link href="/" className="hover:text-[#d4220a]">Home</Link>
            <span>/</span>
            <Link href="/mobile-news" className="hover:text-[#d4220a]">Mobile News</Link>
            <span>/</span>
            <span className="text-ink">{PILLAR_CONFIG.title}</span>
          </nav>

          {/* Hero Header */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-3 flex-wrap">
              <span className="bg-[#d4220a] text-white font-sans text-[10px] font-bold px-2.5 py-1 uppercase tracking-widest">
                Updated {month} {year}
              </span>
              <span className="font-sans text-xs text-muted">By Vijay Yadav · The Tech Bharat</span>
            </div>
            <h1 className="font-playfair text-3xl md:text-4xl font-black text-ink leading-tight mb-3">
              {PILLAR_CONFIG.title} — {month} {year}
            </h1>
            <p className="font-sans text-base font-semibold text-[#1a3a5c] border-l-4 border-[#1a3a5c] pl-4 mb-4">
              Complete {PILLAR_CONFIG.brand} lineup ranked for Indian buyers with India pricing and honest value verdict.
            </p>
            <p className="font-body text-lg text-[#2a2a2a] leading-relaxed">
              {PILLAR_CONFIG.brand} devices in India in {month} {year}. This guide cuts through the noise with detailed comparisons, pricing, and expert recommendations.
            </p>
          </div>

          {/* Comparison Table */}
          <section className="mb-10 overflow-x-auto">
            <h2 className="font-playfair text-2xl font-bold text-ink mb-4 pb-2 border-b-2 border-[#d4220a]">Quick Comparison Table</h2>
            <table className="w-full border-collapse text-sm font-sans">
              <thead>
                <tr className="bg-[#1a3a5c] text-white">
                  <th className="px-3 py-2 text-left">Model</th>
                  <th className="px-3 py-2 text-left">Price</th>
                  <th className="px-3 py-2 text-left">Key Specs</th>
                  <th className="px-3 py-2 text-left">Best For</th>
                </tr>
              </thead>
              <tbody>
                <tr className="bg-white border-b border-gray-200">
                  <td className="px-3 py-2 font-bold">{PILLAR_CONFIG.brand} Premium</td>
                  <td className="px-3 py-2">Premium Price</td>
                  <td className="px-3 py-2">Top specs</td>
                  <td className="px-3 py-2">Power users</td>
                </tr>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <td className="px-3 py-2 font-bold">{PILLAR_CONFIG.brand} Mid-Range</td>
                  <td className="px-3 py-2">Mid Price</td>
                  <td className="px-3 py-2">Good specs</td>
                  <td className="px-3 py-2">General users</td>
                </tr>
                <tr className="bg-white border-b border-gray-200">
                  <td className="px-3 py-2 font-bold">{PILLAR_CONFIG.brand} Budget</td>
                  <td className="px-3 py-2">Affordable</td>
                  <td className="px-3 py-2">Basic specs</td>
                  <td className="px-3 py-2">Budget buyers</td>
                </tr>
              </tbody>
            </table>
          </section>

          {/* Main Content */}
          <h2 className="font-playfair text-2xl font-bold text-ink mt-10 mb-4 pb-2 border-b-2 border-[#d4220a]">
            Why Choose {PILLAR_CONFIG.brand}?
          </h2>
          <p className="font-body text-base text-[#2a2a2a] leading-relaxed mb-4">
            {PILLAR_CONFIG.brand} devices offer unique advantages for Indian users. This comprehensive guide ranks the entire {PILLAR_CONFIG.brand} lineup for {month} {year}.
          </p>

          {/* Brand Articles */}
          {brandArticles.length > 0 && (
            <section className="mt-12 mb-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-0.5 bg-[#d4220a]" />
                <h2 className="font-playfair text-2xl font-bold text-ink">
                  Latest {PILLAR_CONFIG.brand} Reviews & Analysis
                </h2>
                <span className="font-sans text-xs text-muted bg-gray-100 px-2 py-0.5 rounded">
                  {brandArticles.length} articles
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {brandArticles.map(a => (
                  <Link key={a.slug} href={`/${a.slug}`} className="bg-white border border-gray-200 hover:border-[#d4220a] transition-colors group block">
                    {a.featuredImage && (
                      <div className="relative overflow-hidden" style={{ paddingBottom: '56.25%' }}>
                        <img src={a.featuredImage} alt={a.title} width={400} height={225} loading="lazy"
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
                          onError={e => { (e.target as HTMLImageElement).src = 'https://thetechbharat.com/og-image.jpg' }} />
                        <span className="absolute top-2 left-2 bg-[#d4220a] text-white font-sans text-[9px] font-bold px-2 py-0.5 uppercase z-10">
                          {a.type === 'review' ? 'Review' : a.type === 'compare' ? 'Compare' : 'News'}
                        </span>
                      </div>
                    )}
                    <div className="p-3">
                      <h3 className="font-sans text-sm font-bold text-ink group-hover:text-[#d4220a] line-clamp-2 mb-1">{a.title}</h3>
                      <span className="font-sans text-[10px] text-muted">{formatPillarDate(a.publishDate)}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* News Section */}
          {news.length > 0 && (
            <section className="mb-10">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-6 h-0.5 bg-[#1a3a5c]" />
                <h2 className="font-playfair text-xl font-bold text-ink">Latest {PILLAR_CONFIG.brand} News</h2>
              </div>
              <div className="space-y-3">
                {news.slice(0, 5).map(a => (
                  <Link key={a.slug} href={`/${a.slug}`} className="flex gap-4 p-3 bg-white border border-gray-200 hover:border-[#d4220a] transition-colors group">
                    {a.featuredImage && (
                      <div className="flex-shrink-0 w-20 h-14 overflow-hidden">
                        <img src={a.featuredImage} alt={a.title} width={80} height={56}
                          className="w-full h-full object-cover"
                          onError={e => { (e.target as HTMLImageElement).src = 'https://thetechbharat.com/og-image.jpg' }} />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-sans text-sm font-bold text-ink group-hover:text-[#d4220a] line-clamp-2 mb-1">{a.title}</h3>
                      <span className="font-sans text-[10px] text-muted">{formatPillarDate(a.publishDate)}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* FAQ */}
          <section className="mb-10">
            <h2 className="font-playfair text-2xl font-bold text-ink mb-5 pb-2 border-b border-gray-200">
              Frequently Asked Questions
            </h2>
            <div className="space-y-4">
              <div className="border border-gray-200 p-4 bg-white">
                <h3 className="font-sans text-sm font-bold text-ink mb-2">What should I buy?</h3>
                <p className="font-sans text-sm text-muted leading-relaxed">Check our detailed comparison table and article reviews above for the best recommendation based on your budget and needs.</p>
              </div>
              <div className="border border-gray-200 p-4 bg-white">
                <h3 className="font-sans text-sm font-bold text-ink mb-2">Is it more expensive in India?</h3>
                <p className="font-sans text-sm text-muted leading-relaxed">Yes, typically 15-25% more expensive than USA pricing due to import duties and GST.</p>
              </div>
              <div className="border border-gray-200 p-4 bg-white">
                <h3 className="font-sans text-sm font-bold text-ink mb-2">Long-term software support?</h3>
                <p className="font-sans text-sm text-muted leading-relaxed">Most modern devices get 3-7 years of software updates depending on the manufacturer and model.</p>
              </div>
            </div>
          </section>

          <div className="mt-8 bg-[#f8f4ef] border-l-4 border-[#d4220a] p-5">
            <p className="font-sans text-xs font-bold text-[#d4220a] uppercase tracking-wider mb-2">Editorial Note</p>
            <p className="font-sans text-sm text-muted">
              This guide is updated monthly. Articles are fetched live from The Tech Bharat published content.
              No paid placements. All analysis is independent editorial opinion. By Vijay Yadav, Senior Mobile Editor.
            </p>
          </div>

        </div>
      </div>
    </>
  )
}