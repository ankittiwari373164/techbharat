// app/phone-comparison-guide-india/page.tsx
import { Metadata } from 'next'
import Link from 'next/link'

// Fallback functions in case imports fail
const defaultFormatDate = (date: string) => 'Recently'
const defaultGetMonth = () => ({ month: 'April', year: 2026 })

// Attempt to import utilities, but don't fail if they're missing
async function safeGetPillarArticles(keywords: string[], exclude: string[], limit: number) {
  try {
    const { getPillarArticles } = await import('@/lib/pillar-utils')
    if (typeof getPillarArticles === 'function') {
      const result = await getPillarArticles(keywords, exclude, limit)
      return Array.isArray(result) ? result : []
    }
  } catch (error) {
    console.error('Failed to fetch pillar articles:', error)
  }
  return []
}

function safeFormatDate(date: any) {
  try {
    const { formatPillarDate } = require('@/lib/pillar-utils')
    if (typeof formatPillarDate === 'function') {
      return formatPillarDate(date)
    }
  } catch (error) {
    console.error('Failed to format date:', error)
  }
  return defaultFormatDate(date)
}

function safeGetCurrentMonth() {
  try {
    const { currentMonthYear } = require('@/lib/pillar-utils')
    if (typeof currentMonthYear === 'function') {
      const result = currentMonthYear()
      if (result && result.month && result.year) {
        return result
      }
    }
  } catch (error) {
    console.error('Failed to get current month:', error)
  }
  return defaultGetMonth()
}

export const revalidate = 3600

export async function generateMetadata(): Promise<Metadata> {
  const { month, year } = safeGetCurrentMonth()
  const title = `Phone Comparison Guide India — ${month} ${year}`

  return {
    title: `${title} | The Tech Bharat`,
    description: `Phone comparison guide India ${month} ${year}. Head-to-head picks at every budget — which phone actually wins for Indian buyers.`,
    alternates: { canonical: 'https://thetechbharat.com/phone-comparison-guide-india' },
    openGraph: { title, url: 'https://thetechbharat.com/phone-comparison-guide-india', type: 'article' },
  }
}

export default async function PhoneComparisonGuidePage() {
  const { month, year } = safeGetCurrentMonth()
  
  let reviews: any[] = []
  let news: any[] = []

  try {
    const articles = await safeGetPillarArticles(
      ['vs', 'compare', 'comparison', 'versus', 'difference', 'better', 'which is better', 'head to head'],
      [],
      15
    )

    if (Array.isArray(articles)) {
      reviews = articles.filter(a => a && a.type && (a.type === 'review' || a.type === 'compare'))
      news = articles.filter(a => a && a.type === 'mobile-news')
    }
  } catch (error) {
    console.error('Error in PhoneComparisonGuidePage:', error)
  }

  const faq = [
    {
      q: `Samsung vs Xiaomi — which is better for India in ${year}?`,
      a: 'Samsung wins on software updates (4-5 years vs Xiaomi 2-3), service network (3000+ centres vs metro-heavy Xiaomi), and resale value. Xiaomi wins on raw specs per rupee. Choose Samsung outside metros or for long-term ownership.'
    },
    {
      q: 'iPhone vs Android — which is better for Indian users?',
      a: 'Android suits most Indian users: more price options, better 5G band coverage across devices, flexible for UPI and banking apps, easier local repairs. iPhone wins for existing Apple ecosystem users, video creators, and those wanting maximum resale value.'
    }
  ]

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faq.map(item => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.a
      }
    }))
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <div className="bg-paper min-h-screen">
        <div className="max-w-4xl mx-auto px-4 py-10">

          <nav className="font-sans text-xs text-muted mb-6 flex items-center gap-2">
            <Link href="/" className="hover:text-[#d4220a]">Home</Link>
            <span>/</span>
            <span className="text-ink">Phone Comparison Guide India</span>
          </nav>

          <div className="mb-8">
            <div className="flex items-center gap-2 mb-3">
              <span className="bg-[#d4220a] text-white font-sans text-[10px] font-bold px-2.5 py-1 uppercase tracking-widest">
                Updated {month} {year}
              </span>
              <span className="font-sans text-xs text-muted">Vijay Yadav · The Tech Bharat</span>
            </div>
            <h1 className="font-playfair text-3xl md:text-4xl font-black text-ink leading-tight mb-4">
              Phone Comparison Guide India — {month} {year}
            </h1>
            <p className="font-body text-lg text-muted leading-relaxed">
              Choosing between two phones is harder than choosing from ten. This {month} {year} comparison hub covers the real buying dilemmas Indian buyers face at every price point.
            </p>
          </div>

          <section className="mb-8">
            <h2 className="font-playfair text-xl font-bold text-ink mb-4 pb-2 border-b border-border">
              How to Compare Phones the Right Way for India
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="bg-white border border-border p-4">
                <p className="font-sans text-xs font-bold text-ink mb-1">Compare total cost of ownership</p>
                <p className="font-sans text-xs text-muted leading-relaxed">A Rs 40K phone with 5-year updates costs less than a Rs 25K phone replaced every 2 years. Factor updates into the real price.</p>
              </div>
              <div className="bg-white border border-border p-4">
                <p className="font-sans text-xs font-bold text-ink mb-1">Check service centre proximity</p>
                <p className="font-sans text-xs text-muted leading-relaxed">Verify authorised service in your city before buying. A great phone with no local service is a bad choice outside metros.</p>
              </div>
              <div className="bg-white border border-border p-4">
                <p className="font-sans text-xs font-bold text-ink mb-1">Software experience over specs</p>
                <p className="font-sans text-xs text-muted leading-relaxed">Two phones with identical chips can feel completely different based on software. Try them in a store if possible.</p>
              </div>
              <div className="bg-white border border-border p-4">
                <p className="font-sans text-xs font-bold text-ink mb-1">Resale value after 2 years</p>
                <p className="font-sans text-xs text-muted leading-relaxed">Samsung and Apple hold value significantly better than Chinese brands. Factor this into real 2-year cost of ownership.</p>
              </div>
            </div>
          </section>

          {reviews && reviews.length > 0 && (
            <section className="mb-10">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-6 h-0.5 bg-[#d4220a]" />
                <h2 className="font-playfair text-2xl font-bold text-ink">Reviews & Analysis</h2>
                <span className="font-sans text-xs text-muted bg-gray-100 px-2 py-0.5 rounded">{reviews.length}</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {reviews.map((article: any) => {
                  if (!article || typeof article !== 'object') return null
                  const slug = article.slug
                  if (!slug) return null

                  return (
                    <Link key={slug} href={`/${slug}`} className="bg-white border border-border hover:border-[#d4220a] transition-colors group block">
                      {article.featuredImage && typeof article.featuredImage === 'string' && !article.featuredImage.startsWith('/phone-images/') && (
                        <div className="relative overflow-hidden" style={{ paddingBottom: '56.25%' }}>
                          <img 
                            src={article.featuredImage} 
                            alt={article.title || 'Article'} 
                            width={400} 
                            height={225} 
                            loading="lazy"
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
                            onError={e => { 
                              const img = e.target as HTMLImageElement
                              img.src = 'https://thetechbharat.com/og-image.jpg' 
                            }} 
                          />
                          <span className="absolute top-2 left-2 bg-[#d4220a] text-white font-sans text-[9px] font-bold px-2 py-0.5 uppercase z-10">
                            {article.type === 'review' ? 'Review' : 'Compare'}
                          </span>
                        </div>
                      )}
                      <div className="p-3">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-sans text-[10px] font-bold text-[#d4220a] uppercase">{article.brand || 'News'}</span>
                          <span className="font-sans text-[10px] text-muted ml-auto">
                            {article.publishDate ? safeFormatDate(article.publishDate) : 'Recently'}
                          </span>
                        </div>
                        <h3 className="font-sans text-sm font-bold text-ink group-hover:text-[#d4220a] line-clamp-2 mb-1">
                          {article.title || 'Article'}
                        </h3>
                        <p className="font-sans text-xs text-muted line-clamp-2">{article.summary || ''}</p>
                        <div className="mt-2 flex justify-between">
                          <span className="font-sans text-[10px] text-muted">{article.readTime || 5} min read</span>
                          <span className="font-sans text-xs font-semibold text-[#d4220a]">Read →</span>
                        </div>
                      </div>
                    </Link>
                  )
                })}
              </div>
            </section>
          )}

          {news && news.length > 0 && (
            <section className="mb-10">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-6 h-0.5 bg-[#1a3a5c]" />
                <h2 className="font-playfair text-2xl font-bold text-ink">Latest News</h2>
                <span className="font-sans text-xs text-muted bg-gray-100 px-2 py-0.5 rounded">{news.length}</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {news.map((article: any) => {
                  if (!article || typeof article !== 'object') return null
                  const slug = article.slug
                  if (!slug) return null

                  return (
                    <Link key={slug} href={`/${slug}`} className="bg-white border border-border hover:border-[#d4220a] transition-colors group block">
                      {article.featuredImage && typeof article.featuredImage === 'string' && !article.featuredImage.startsWith('/phone-images/') && (
                        <div className="relative overflow-hidden" style={{ paddingBottom: '56.25%' }}>
                          <img 
                            src={article.featuredImage} 
                            alt={article.title || 'News'} 
                            width={400} 
                            height={225} 
                            loading="lazy"
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
                            onError={e => { 
                              const img = e.target as HTMLImageElement
                              img.src = 'https://thetechbharat.com/og-image.jpg' 
                            }} 
                          />
                          <span className="absolute top-2 left-2 bg-[#1a3a5c] text-white font-sans text-[9px] font-bold px-2 py-0.5 uppercase z-10">
                            News
                          </span>
                        </div>
                      )}
                      <div className="p-3">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-sans text-[10px] font-bold text-[#1a3a5c] uppercase">{article.brand || 'News'}</span>
                          <span className="font-sans text-[10px] text-muted ml-auto">
                            {article.publishDate ? safeFormatDate(article.publishDate) : 'Recently'}
                          </span>
                        </div>
                        <h3 className="font-sans text-sm font-bold text-ink group-hover:text-[#d4220a] line-clamp-2 mb-1">
                          {article.title || 'Article'}
                        </h3>
                        <p className="font-sans text-xs text-muted line-clamp-2">{article.summary || ''}</p>
                        <div className="mt-2 flex justify-between">
                          <span className="font-sans text-[10px] text-muted">{article.readTime || 5} min read</span>
                          <span className="font-sans text-xs font-semibold text-[#d4220a]">Read →</span>
                        </div>
                      </div>
                    </Link>
                  )
                })}
              </div>
            </section>
          )}

          {(!reviews || reviews.length === 0) && (!news || news.length === 0) && (
            <div className="border border-border p-10 text-center bg-white mb-10">
              <p className="font-sans text-sm text-muted">
                Loading articles. <Link href="/mobile-news" className="text-[#d4220a] hover:underline">Browse all mobile news →</Link>
              </p>
            </div>
          )}

          <section className="mb-10">
            <h2 className="font-playfair text-2xl font-bold text-ink mb-5 pb-2 border-b border-border">
              Frequently Asked Questions
            </h2>
            <div className="space-y-4">
              {faq.map((item, index) => (
                <div key={index} className="border border-border p-4 bg-white">
                  <h3 className="font-sans text-sm font-bold text-ink mb-2">{item.q}</h3>
                  <p className="font-sans text-sm text-muted leading-relaxed">{item.a}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="mt-8 pt-6 border-t border-border">
            <h2 className="font-playfair text-xl font-bold text-ink mb-4">Related Guides</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Link href="/best-smartphones-india" className="border border-border p-3 bg-white hover:border-[#d4220a] transition-colors group">
                <span className="font-sans text-sm font-bold text-ink group-hover:text-[#d4220a]">Best Smartphones India →</span>
              </Link>
              <Link href="/smartphone-buying-guide-india" className="border border-border p-3 bg-white hover:border-[#d4220a] transition-colors group">
                <span className="font-sans text-sm font-bold text-ink group-hover:text-[#d4220a]">Smartphone Buying Guide →</span>
              </Link>
            </div>
          </section>

          <div className="mt-8 bg-[#f8f4ef] border-l-4 border-[#d4220a] p-5">
            <p className="font-sans text-xs font-bold text-[#d4220a] uppercase tracking-wider mb-2">Editorial Note</p>
            <p className="font-sans text-sm text-muted">
              Articles fetched live from The Tech Bharat. Guide updated for {month} {year}. No paid placements. By Vijay Yadav.
            </p>
          </div>

        </div>
      </div>
    </>
  )
}