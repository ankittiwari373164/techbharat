// app/smartphone-buying-guide-india/page.tsx
import { Metadata } from 'next'
import Link from 'next/link'
import { getPillarArticles, formatPillarDate, currentMonthYear } from '@/lib/pillar-utils'

export const revalidate = 3600

export async function generateMetadata(): Promise<Metadata> {
  const { month, year } = currentMonthYear()
  const title = `Smartphone Buying Guide India — ${month} ${year}`
  return {
    title: `${title} | The Tech Bharat`,
    description: `Complete smartphone buying guide for India MONTH YEAR. What specs matter, what to ignore, honest India-specific advice.`.replace('MONTH', month).replace('YEAR', String(year)),
    alternates: { canonical: 'https://thetechbharat.com/smartphone-buying-guide-india' },
    openGraph: { title, url: 'https://thetechbharat.com/smartphone-buying-guide-india', type: 'article' },
  }
}

export default async function SmartphoneBuyingGuidePage() {
  const { month, year } = currentMonthYear()
  const articles = await getPillarArticles(['buying guide', 'how to choose', 'worth it', 'should you buy', 'india price', 'best value'], [], 15)
  const reviews  = articles.filter(a => a.type === 'review' || a.type === 'compare')
  const news     = articles.filter(a => a.type === 'mobile-news')

  const faq = [
    { q: 'How much RAM do I need in YEAR?', a: '8GB is the sweet spot for YEAR. 6GB handles basic use. 12GB+ only for heavy multitasking. More important than RAM: software — stock Android with 8GB outperforms a bloated skin with 16GB.' },
    { q: 'When is the best time to buy a phone in India?', a: 'Big Billion Days and Great Indian Festival give 10-20% off mid-range phones. For flagships: launch pricing is usually the best since prices rarely drop for 6+ months. For budget phones: buy when needed as prices fluctuate minimally.' }
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
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <div className="bg-paper min-h-screen">
        <div className="max-w-4xl mx-auto px-4 py-10">

          <nav className="font-sans text-xs text-muted mb-6 flex items-center gap-2">
            <Link href="/" className="hover:text-[#d4220a]">Home</Link>
            <span>/</span>
            <span className="text-ink">Smartphone Buying Guide India</span>
          </nav>

          <div className="mb-8">
            <div className="flex items-center gap-2 mb-3">
              <span className="bg-[#d4220a] text-white font-sans text-[10px] font-bold px-2.5 py-1 uppercase tracking-widest">
                Updated {month} {year}
              </span>
              <span className="font-sans text-xs text-muted">Vijay Yadav · The Tech Bharat</span>
            </div>
            <h1 className="font-playfair text-3xl md:text-4xl font-black text-ink leading-tight mb-4">
              Smartphone Buying Guide India — {month} {year}
            </h1>
            <p className="font-body text-lg text-muted leading-relaxed">
              Every month new phones launch with bigger numbers and bolder claims. This MONTH YEAR guide cuts through marketing with honest India-specific advice on what actually matters for Indian buyers.
            </p>
          </div>

          <section className="mb-8">
            <h2 className="font-playfair text-xl font-bold text-ink mb-4 pb-2 border-b border-border">
              Specs That Matter vs Specs That Are Marketing
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="bg-white border border-border p-4">
                <p className="font-sans text-xs font-bold text-ink mb-1">RAM: 8GB is enough in YEAR</p>
                <p className="font-sans text-xs text-muted leading-relaxed">8GB RAM on well-optimised Android handles everything. 12GB+ only matters for heavy multitasking. Software efficiency matters more than raw numbers.</p>
              </div>
              <div className="bg-white border border-border p-4">
                <p className="font-sans text-xs font-bold text-ink mb-1">Megapixels: mostly marketing</p>
                <p className="font-sans text-xs text-muted leading-relaxed">50MP with good sensor beats 108MP with small sensor. Look for sensor size and OIS, not megapixel count.</p>
              </div>
              <div className="bg-white border border-border p-4">
                <p className="font-sans text-xs font-bold text-ink mb-1">5G bands: verify n78</p>
                <p className="font-sans text-xs text-muted leading-relaxed">Not all 5G phones support Indian bands. Verify n78 (3500MHz) for Jio and Airtel 5G compatibility before buying.</p>
              </div>
              <div className="bg-white border border-border p-4">
                <p className="font-sans text-xs font-bold text-ink mb-1">Software updates: the real spec</p>
                <p className="font-sans text-xs text-muted leading-relaxed">3 years minimum. Samsung and Pixel offer 5-7 years. This directly affects resale value and long-term security.</p>
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
              <Link href="/best-smartphones-india" className="border border-border p-3 bg-white hover:border-[#d4220a] transition-colors group">
                <span className="font-sans text-sm font-bold text-ink group-hover:text-[#d4220a]">Best Smartphones India →</span>
              </Link>
              <Link href="/best-5g-phones-india" className="border border-border p-3 bg-white hover:border-[#d4220a] transition-colors group">
                <span className="font-sans text-sm font-bold text-ink group-hover:text-[#d4220a]">Best 5G Phones India →</span>
              </Link>
              <Link href="/best-camera-phones-india" className="border border-border p-3 bg-white hover:border-[#d4220a] transition-colors group">
                <span className="font-sans text-sm font-bold text-ink group-hover:text-[#d4220a]">Best Camera Phones India →</span>
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