// app/best-battery-backup-phones-india/page.tsx
import { Metadata } from 'next'
import Link from 'next/link'
import { getPillarArticles, formatPillarDate, currentMonthYear } from '@/lib/pillar-utils'

export const revalidate = 3600

export async function generateMetadata(): Promise<Metadata> {
  const { month, year } = currentMonthYear()
  return {
    title: `Best Battery Backup Phones in India — ${month} ${year} | The Tech Bharat`,
    description: `Best battery phones in India ${month} ${year}. Long-lasting picks for heavy Indian users — commuters, gamers, and power-cut areas.`,
    alternates: { canonical: 'https://thetechbharat.com/best-battery-backup-phones-india' },
    openGraph: { title: `Best Battery Backup Phones in India — ${month} ${year} | The Tech Bharat`, url: 'https://thetechbharat.com/best-battery-backup-phones-india', type: 'article' },
  }
}

export default async function BestBatteryPhonesPage() {
  const { month, year } = currentMonthYear()
  const articles = await getPillarArticles(['battery', 'charging', 'fast charge', 'mAh', 'battery life', 'endurance'], [], 15)
  const reviews  = articles.filter(a => a.type === 'review' || a.type === 'compare')
  const news     = articles.filter(a => a.type === 'mobile-news')

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      { '@type': 'Question', name: `Which phone has the best battery life in India in ` + year + `?`, acceptedAnswer: { '@type': 'Answer', text: `For ` + month + ` ` + year + `: iQOO Z9x (6000mAh + efficient Snapdragon) and Samsung Galaxy M35 5G consistently deliver 2-day battery life for typical Indian usage patterns.` } },
      { '@type': 'Question', name: `Does fast charging damage battery?`, acceptedAnswer: { '@type': 'Answer', text: `Modern fast charging systems manage temperature carefully. Risk comes from charging in hot environments (car in summer, direct sunlight) — not wattage. Use the original charger.` } }
    ]
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <div className="bg-paper min-h-screen">
        <div className="max-w-4xl mx-auto px-4 py-10">
          <nav className="font-sans text-xs text-muted mb-6 flex items-center gap-2">
            <Link href="/" className="hover:text-[#d4220a]">Home</Link><span>/</span>
            <span className="text-ink">Best Battery Backup Phones in India — {month} {year}</span>
          </nav>
          <div className="mb-8">
            <span className="bg-[#d4220a] text-white font-sans text-[10px] font-bold px-2.5 py-1 uppercase tracking-widest">Updated {month} {year}</span>
            <h1 className="font-playfair text-3xl md:text-4xl font-black text-ink leading-tight mt-3 mb-4">Best Battery Backup Phones in India — {month} {year}</h1>
            <p className="font-body text-lg text-[#2a2a2a] leading-relaxed">India's demanding usage patterns — long commutes, BGMI sessions, unstable power — require genuine all-day battery. These {month} {year} picks prioritise real-world Indian performance.</p>
          </div>

          <section className="mb-8">
            <h2 className="font-playfair text-xl font-bold text-ink mb-4 pb-2 border-b border-border">Battery Facts for Indian Buyers</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="bg-white border border-border p-4">
                <p className="font-sans text-xs font-bold text-ink mb-1">5000mAh minimum</p>
                <p className="font-sans text-xs text-muted leading-relaxed">For heavy Indian usage including streaming and gaming, 5000mAh is the floor.</p>
              </div>
              <div className="bg-white border border-border p-4">
                <p className="font-sans text-xs font-bold text-ink mb-1">Heat degradation</p>
                <p className="font-sans text-xs text-muted leading-relaxed">Indian summer heat accelerates battery degradation. Phones with better cooling preserve battery health longer.</p>
              </div>
              <div className="bg-white border border-border p-4">
                <p className="font-sans text-xs font-bold text-ink mb-1">Fast charging matters</p>
                <p className="font-sans text-xs text-muted leading-relaxed">80W charging is more practical for India's commute pattern than a massive battery with slow 18W charging.</p>
              </div>
              <div className="bg-white border border-border p-4">
                <p className="font-sans text-xs font-bold text-ink mb-1">Check optimised charging</p>
                <p className="font-sans text-xs text-muted leading-relaxed">Enable optimised charging on Samsung, Pixel, or OnePlus to preserve long-term battery health.</p>
              </div>
            </div>
          </section>

          {reviews.length > 0 && (
            <section className="mb-10">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-6 h-0.5 bg-[#d4220a]" />
                <h2 className="font-playfair text-2xl font-bold text-ink">Latest Reviews & Analysis</h2>
                <span className="font-sans text-xs text-muted bg-gray-100 px-2 py-0.5 rounded">{reviews.length}</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {reviews.map(article => (
                  <Link key={article.slug} href={`/${article.slug}`}
                    className="bg-white border border-border hover:border-[#d4220a] transition-colors group block">
                    {article.featuredImage && !article.featuredImage.startsWith('/phone-images/') && (
                      <div className="relative overflow-hidden" style={{ paddingBottom: '56.25%' }}>
                        <img src={article.featuredImage} alt={article.title} width={400} height={225} loading="lazy"
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                          style={{ position:'absolute', inset:0, width:'100%', height:'100%' }}
                          onError={e=>{(e.target as HTMLImageElement).src='https://thetechbharat.com/og-image.jpg'}} />
                        <span className="absolute top-2 left-2 bg-[#d4220a] text-white font-sans text-[9px] font-bold px-2 py-0.5 uppercase tracking-wider z-10">{article.type === 'review' ? 'Review' : 'Compare'}</span>
                      </div>
                    )}
                    <div className="p-3">
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="font-sans text-[10px] font-bold text-[#d4220a] uppercase tracking-wide">{article.brand}</span>
                        <span className="font-sans text-[10px] text-muted ml-auto">{formatPillarDate(article.publishDate)}</span>
                      </div>
                      <h3 className="font-sans text-sm font-bold text-ink leading-snug group-hover:text-[#d4220a] transition-colors line-clamp-2 mb-1">{article.title}</h3>
                      <p className="font-sans text-xs text-muted line-clamp-2">{article.summary}</p>
                      <div className="mt-2 flex justify-between">
                        <span className="font-sans text-[10px] text-muted">{article.readTime} min read</span>
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
                {news.map(article => (
                  <Link key={article.slug} href={`/${article.slug}`}
                    className="bg-white border border-border hover:border-[#d4220a] transition-colors group block">
                    {article.featuredImage && !article.featuredImage.startsWith('/phone-images/') && (
                      <div className="relative overflow-hidden" style={{ paddingBottom: '56.25%' }}>
                        <img src={article.featuredImage} alt={article.title} width={400} height={225} loading="lazy"
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                          style={{ position:'absolute', inset:0, width:'100%', height:'100%' }}
                          onError={e=>{(e.target as HTMLImageElement).src='https://thetechbharat.com/og-image.jpg'}} />
                        <span className="absolute top-2 left-2 bg-[#1a3a5c] text-white font-sans text-[9px] font-bold px-2 py-0.5 uppercase tracking-wider z-10">News</span>
                      </div>
                    )}
                    <div className="p-3">
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="font-sans text-[10px] font-bold text-[#d4220a] uppercase tracking-wide">{article.brand}</span>
                        <span className="font-sans text-[10px] text-muted ml-auto">{formatPillarDate(article.publishDate)}</span>
                      </div>
                      <h3 className="font-sans text-sm font-bold text-ink leading-snug group-hover:text-[#d4220a] transition-colors line-clamp-2 mb-1">{article.title}</h3>
                      <p className="font-sans text-xs text-muted line-clamp-2">{article.summary}</p>
                      <div className="mt-2 flex justify-between">
                        <span className="font-sans text-[10px] text-muted">{article.readTime} min read</span>
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
              <p className="font-sans text-sm text-muted">Loading articles. <Link href="/mobile-news" className="text-[#d4220a] hover:underline">Browse all mobile news →</Link></p>
            </div>
          )}
          <section className="mb-10">
            <h2 className="font-playfair text-2xl font-bold text-ink mb-5 pb-2 border-b border-border">Frequently Asked Questions</h2>
            <div className="space-y-4">

              <div className="border border-border p-4 bg-white">
                <h3 className="font-sans text-sm font-bold text-ink mb-2">Which phone has the best battery life in India in {year}?</h3>
                <p className="font-sans text-sm text-muted leading-relaxed">For {month} {year}: iQOO Z9x (6000mAh + efficient Snapdragon) and Samsung Galaxy M35 5G consistently deliver 2-day battery life for typical Indian usage patterns.</p>
              </div>
              <div className="border border-border p-4 bg-white">
                <h3 className="font-sans text-sm font-bold text-ink mb-2">Does fast charging damage battery?</h3>
                <p className="font-sans text-sm text-muted leading-relaxed">Modern fast charging systems manage temperature carefully. Risk comes from charging in hot environments (car in summer, direct sunlight) — not wattage. Use the original charger.</p>
              </div>
            </div>
          </section>
          <section className="mt-8 pt-6 border-t border-border">
            <h2 className="font-playfair text-xl font-bold text-ink mb-4">Related Guides</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Link href="/android-battery-health-guide" className="border border-border p-3 bg-white hover:border-[#d4220a] transition-colors group"><span className="font-sans text-sm font-bold text-ink group-hover:text-[#d4220a]">Android Battery Health Guide →</span></Link>
              <Link href="/best-budget-phones-india" className="border border-border p-3 bg-white hover:border-[#d4220a] transition-colors group"><span className="font-sans text-sm font-bold text-ink group-hover:text-[#d4220a]">Best Budget Phones India →</span></Link>
            </div>
          </section>
          <div className="mt-8 bg-[#f8f4ef] border-l-4 border-[#d4220a] p-5">
            <p className="font-sans text-xs font-bold text-[#d4220a] uppercase tracking-wider mb-2">Editorial Note</p>
            <p className="font-sans text-sm text-muted">Articles fetched live. Guide updated for {month} {year}. No paid placements. By Vijay Yadav, The Tech Bharat.</p>
          </div>
        </div>
      </div>
    </>
  )
}