// app/best-smartphones-india/page.tsx
import { Metadata } from 'next'
import Link from 'next/link'
import { getPillarArticles, formatPillarDate, currentMonthYear } from '@/lib/pillar-utils'
import PillarNav from '@/components/PillarNav'

export const revalidate = 3600

export async function generateMetadata(): Promise<Metadata> {
  const { month, year } = currentMonthYear()
  const title = `Best Smartphones in India — ${month} ${year}`
  return {
    title: `${title} | The Tech Bharat`,
    description: `Best smartphones in India MONTH YEAR — honest picks at every budget from Rs 10K to Rs 1L+. Updated with latest launches.`.replace('MONTH', month).replace('YEAR', String(year)),
    alternates: { canonical: 'https://thetechbharat.com/best-smartphones-india' },
    openGraph: { title, url: 'https://thetechbharat.com/best-smartphones-india', type: 'article' },
  }
}

export default async function BestSmartphonesIndiaPage() {
  const { month, year } = currentMonthYear()
  const articles = await getPillarArticles(['best', 'review', 'india', 'price', 'worth buying', 'recommended', 'top pick', 'value for money'], [], 15)
  const reviews  = articles.filter(a => a.type === 'review' || a.type === 'compare')
  const news     = articles.filter(a => a.type === 'mobile-news')

  const faq = [
    { q: 'Which is the best phone in India in MONTH YEAR?', a: 'In MONTH YEAR: under Rs 15K — Redmi Note 14 5G; Rs 15K-30K — Nothing Phone (3a); Rs 30K-55K — Google Pixel 9a; Rs 55K+ — Samsung Galaxy S25 series. Always verify current pricing on Flipkart or Amazon before buying.' },
    { q: 'Is 5G worth buying in India in YEAR?', a: 'Yes, for any phone above Rs 12000 in YEAR. 5G is now standard at this price. Critical check: verify n78 band support for Jio and Airtel 5G in your city before purchasing.' }
  ]

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      { '@type': 'Question', name: faq[0].q, acceptedAnswer: { '@type': 'Answer', text: faq[0].a } },
      { '@type': 'Question', name: faq[1].q, acceptedAnswer: { '@type': 'Answer', text: faq[1].a } },
    ],
  }

  return (
    <>
      <PillarNav />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <div className="bg-paper min-h-screen">
        <div className="max-w-4xl mx-auto px-4 py-10">

          <nav className="font-sans text-xs text-muted mb-6 flex items-center gap-2">
            <Link href="/" className="hover:text-[#d4220a]">Home</Link>
            <span>/</span>
            <span className="text-ink">Best Smartphones in India</span>
          </nav>

          <div className="mb-8">
            <div className="flex items-center gap-2 mb-3">
              <span className="bg-[#d4220a] text-white font-sans text-[10px] font-bold px-2.5 py-1 uppercase tracking-widest">
                Updated {month} {year}
              </span>
              <span className="font-sans text-xs text-muted">Vijay Yadav · The Tech Bharat</span>
            </div>
            <h1 className="font-playfair text-3xl md:text-4xl font-black text-ink leading-tight mb-4">
              Best Smartphones in India — {month} {year}
            </h1>
            <p className="font-body text-lg text-muted leading-relaxed">
              Every month India sees new launches and price drops. This guide reflects actual India availability and current Flipkart and Amazon pricing for MONTH YEAR.
            </p>
          </div>

          <section className="mb-8">
            <h2 className="font-playfair text-xl font-bold text-ink mb-4 pb-2 border-b border-border">
              How to Choose the Right Budget in India
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="bg-white border border-border p-4">
                <p className="font-sans text-xs font-bold text-ink mb-1">Under Rs 15000</p>
                <p className="font-sans text-xs text-muted leading-relaxed">Prioritise battery (5000mAh+), 5G with n78 band, and 90Hz AMOLED. Camera quality is similar across brands at this price.</p>
              </div>
              <div className="bg-white border border-border p-4">
                <p className="font-sans text-xs font-bold text-ink mb-1">Rs 15K to Rs 30K</p>
                <p className="font-sans text-xs text-muted leading-relaxed">Chipset efficiency and software update commitment separate good from great. Look for 3+ years OS updates minimum.</p>
              </div>
              <div className="bg-white border border-border p-4">
                <p className="font-sans text-xs font-bold text-ink mb-1">Rs 30K to Rs 60K</p>
                <p className="font-sans text-xs text-muted leading-relaxed">Camera system quality and build materials start differentiating significantly. Service network matters at this investment level.</p>
              </div>
              <div className="bg-white border border-border p-4">
                <p className="font-sans text-xs font-bold text-ink mb-1">Rs 60K and above</p>
                <p className="font-sans text-xs text-muted leading-relaxed">Ecosystem fit (iOS vs Android) is more important than specs. 5 to 7 years software support justifies the premium.</p>
              </div>
            </div>
          </section>

          {reviews.length > 0 && (
            <section className="mb-10">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-6 h-0.5 bg-[#d4220a]" />
                <h2 className="font-playfair text-2xl font-bold text-ink">Reviews & Analysis</h2>
                <span className="font-sans text-xs text-muted bg-gray-100 px-2 py-0.5 rounded">{reviews.length}</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {reviews.map(a => (
                  <Link key={a.slug} href={`/${a.slug}`} className="bg-white border border-border hover:border-[#d4220a] transition-colors group block">
                    {a.featuredImage && !a.featuredImage.startsWith('/phone-images/') && (
                      <div className="relative overflow-hidden" style={{ paddingBottom:'56.25%' }}>
                        <img src={a.featuredImage} alt={a.title} width={400} height={225} loading="lazy"
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                          style={{ position:'absolute',inset:0,width:'100%',height:'100%' }}
                          onError={e=>{(e.target as HTMLImageElement).src='https://thetechbharat.com/og-image.jpg'}} />
                        <span className="absolute top-2 left-2 bg-[#d4220a] text-white font-sans text-[9px] font-bold px-2 py-0.5 uppercase z-10">
                          {a.type==='review'?'Review':'Compare'}
                        </span>
                      </div>
                    )}
                    <div className="p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-sans text-[10px] font-bold text-[#d4220a] uppercase">{a.brand}</span>
                        <span className="font-sans text-[10px] text-muted ml-auto">{formatPillarDate(a.publishDate)}</span>
                      </div>
                      <h3 className="font-sans text-sm font-bold text-ink group-hover:text-[#d4220a] line-clamp-2 mb-1">{a.title}</h3>
                      <p className="font-sans text-xs text-muted line-clamp-2">{a.summary}</p>
                      <div className="mt-2 flex justify-between">
                        <span className="font-sans text-[10px] text-muted">{a.readTime} min read</span>
                        <span className="font-sans text-xs font-semibold text-[#d4220a]">Read →</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {news.length > 0 && (
            <section className="mb-10">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-6 h-0.5 bg-[#1a3a5c]" />
                <h2 className="font-playfair text-2xl font-bold text-ink">Latest News</h2>
                <span className="font-sans text-xs text-muted bg-gray-100 px-2 py-0.5 rounded">{news.length}</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {news.map(a => (
                  <Link key={a.slug} href={`/${a.slug}`} className="bg-white border border-border hover:border-[#d4220a] transition-colors group block">
                    {a.featuredImage && !a.featuredImage.startsWith('/phone-images/') && (
                      <div className="relative overflow-hidden" style={{ paddingBottom:'56.25%' }}>
                        <img src={a.featuredImage} alt={a.title} width={400} height={225} loading="lazy"
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                          style={{ position:'absolute',inset:0,width:'100%',height:'100%' }}
                          onError={e=>{(e.target as HTMLImageElement).src='https://thetechbharat.com/og-image.jpg'}} />
                        <span className="absolute top-2 left-2 bg-[#1a3a5c] text-white font-sans text-[9px] font-bold px-2 py-0.5 uppercase z-10">News</span>
                      </div>
                    )}
                    <div className="p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-sans text-[10px] font-bold text-[#1a3a5c] uppercase">{a.brand}</span>
                        <span className="font-sans text-[10px] text-muted ml-auto">{formatPillarDate(a.publishDate)}</span>
                      </div>
                      <h3 className="font-sans text-sm font-bold text-ink group-hover:text-[#d4220a] line-clamp-2 mb-1">{a.title}</h3>
                      <p className="font-sans text-xs text-muted line-clamp-2">{a.summary}</p>
                      <div className="mt-2 flex justify-between">
                        <span className="font-sans text-[10px] text-muted">{a.readTime} min read</span>
                        <span className="font-sans text-xs font-semibold text-[#d4220a]">Read →</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {articles.length === 0 && (
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
              <div className="border border-border p-4 bg-white">
                <h3 className="font-sans text-sm font-bold text-ink mb-2">{faq[0].q}</h3>
                <p className="font-sans text-sm text-muted leading-relaxed">{faq[0].a}</p>
              </div>
              <div className="border border-border p-4 bg-white">
                <h3 className="font-sans text-sm font-bold text-ink mb-2">{faq[1].q}</h3>
                <p className="font-sans text-sm text-muted leading-relaxed">{faq[1].a}</p>
              </div>
            </div>
          </section>

          <section className="mt-8 pt-6 border-t border-border">
            <h2 className="font-playfair text-xl font-bold text-ink mb-4">Related Guides</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Link href="/best-camera-phones-india" className="border border-border p-3 bg-white hover:border-[#d4220a] transition-colors group">
                <span className="font-sans text-sm font-bold text-ink group-hover:text-[#d4220a]">Best Camera Phones India →</span>
              </Link>
              <Link href="/best-budget-phones-india" className="border border-border p-3 bg-white hover:border-[#d4220a] transition-colors group">
                <span className="font-sans text-sm font-bold text-ink group-hover:text-[#d4220a]">Best Budget Phones India →</span>
              </Link>
              <Link href="/best-gaming-phones-india" className="border border-border p-3 bg-white hover:border-[#d4220a] transition-colors group">
                <span className="font-sans text-sm font-bold text-ink group-hover:text-[#d4220a]">Best Gaming Phones India →</span>
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