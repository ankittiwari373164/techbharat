// app/best-flagship-phones-india/page.tsx
import { Metadata } from 'next'
import Link from 'next/link'
import { getPillarArticles, formatPillarDate, currentMonthYear } from '@/lib/pillar-utils'

export const revalidate = 3600

export async function generateMetadata(): Promise<Metadata> {
  const { month, year } = currentMonthYear()
  return {
    title: `Best Flagship Phones in India — ${month} ${year} Premium Picks | The Tech Bharat`,
    description: `Best flagship smartphones India ${month} ${year}. Premium Android and iPhone picks above ₹70,000 with India-specific buying advice.`,
    alternates: { canonical: 'https://thetechbharat.com/best-flagship-phones-india' },
    openGraph: { title: `Best Flagship Phones in India — ${month} ${year} Premium Picks | The Tech Bharat`, url: 'https://thetechbharat.com/best-flagship-phones-india', type: 'article' },
  }
}

export default async function BestFlagshipPhonesPage() {
  const { month, year } = currentMonthYear()
  const articles = await getPillarArticles(['flagship', 'premium', 'ultra', 'pro max', 'high end', 'best android', '₹70000'], [], 15)
  const reviews  = articles.filter(a => a.type === 'review' || a.type === 'compare')
  const news     = articles.filter(a => a.type === 'mobile-news')

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      { '@type': 'Question', name: `Which is the best flagship in India in ` + month + ` ` + year + `?`, acceptedAnswer: { '@type': 'Answer', text: `In ` + month + ` ` + year + `: Samsung Galaxy S25 Ultra (best camera versatility + S Pen), iPhone 16 Pro (best ecosystem + video), Google Pixel 9 Pro (best computational photography). Choice depends on ecosystem commitment.` } },
      { '@type': 'Question', name: `Is a flagship phone worth buying in India?`, acceptedAnswer: { '@type': 'Answer', text: `Yes if you keep phones 3+ years and camera or ecosystem matters. No if budget is primary concern — OnePlus 13 at ₹65K delivers 80% of flagship experience at 50% of cost.` } }
    ]
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <div className="bg-paper min-h-screen">
        <div className="max-w-4xl mx-auto px-4 py-10">
          <nav className="font-sans text-xs text-muted mb-6 flex items-center gap-2">
            <Link href="/" className="hover:text-[#d4220a]">Home</Link><span>/</span>
            <span className="text-ink">Best Flagship Phones in India — {month} {year} Premium Picks</span>
          </nav>
          <div className="mb-8">
            <span className="bg-[#d4220a] text-white font-sans text-[10px] font-bold px-2.5 py-1 uppercase tracking-widest">Updated {month} {year}</span>
            <h1 className="font-playfair text-3xl md:text-4xl font-black text-ink leading-tight mt-3 mb-4">Best Flagship Phones in India — {month} {year} Premium Picks</h1>
            <p className="font-body text-lg text-[#2a2a2a] leading-relaxed">Above ₹70,000, you are paying for the best cameras, longest software support, and premium build. This {month} {year} guide covers whether that premium is justified for Indian buyers.</p>
          </div>

          <section className="mb-8">
            <h2 className="font-playfair text-xl font-bold text-ink mb-4 pb-2 border-b border-border">Is a Flagship Worth It in India?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="bg-white border border-border p-4">
                <p className="font-sans text-xs font-bold text-ink mb-1">7-year updates economics</p>
                <p className="font-sans text-xs text-muted leading-relaxed">₹1 lakh phone with 7-year updates = ₹14,000/year. ₹25K phone replaced every 2 years = ₹12,500/year — but with worse daily experience.</p>
              </div>
              <div className="bg-white border border-border p-4">
                <p className="font-sans text-xs font-bold text-ink mb-1">Camera as business tool</p>
                <p className="font-sans text-xs text-muted leading-relaxed">Flagship cameras replace ₹50K+ DSLR for content creators. Genuine business investment.</p>
              </div>
              <div className="bg-white border border-border p-4">
                <p className="font-sans text-xs font-bold text-ink mb-1">Resale value advantage</p>
                <p className="font-sans text-xs text-muted leading-relaxed">iPhone retains 50–60% value after 2 years. Most Chinese flagships retain 25–35%.</p>
              </div>
              <div className="bg-white border border-border p-4">
                <p className="font-sans text-xs font-bold text-ink mb-1">Import duty reality</p>
                <p className="font-sans text-xs text-muted leading-relaxed">Indian flagship prices are 30–40% above US pricing. Factor into total cost comparison.</p>
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
                <h3 className="font-sans text-sm font-bold text-ink mb-2">Which is the best flagship in India in {month} {year}?</h3>
                <p className="font-sans text-sm text-muted leading-relaxed">In {month} {year}: Samsung Galaxy S25 Ultra (best camera versatility + S Pen), iPhone 16 Pro (best ecosystem + video), Google Pixel 9 Pro (best computational photography). Choice depends on ecosystem commitment.</p>
              </div>
              <div className="border border-border p-4 bg-white">
                <h3 className="font-sans text-sm font-bold text-ink mb-2">Is a flagship phone worth buying in India?</h3>
                <p className="font-sans text-sm text-muted leading-relaxed">Yes if you keep phones 3+ years and camera or ecosystem matters. No if budget is primary concern — OnePlus 13 at ₹65K delivers 80% of flagship experience at 50% of cost.</p>
              </div>
            </div>
          </section>
          <section className="mt-8 pt-6 border-t border-border">
            <h2 className="font-playfair text-xl font-bold text-ink mb-4">Related Guides</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Link href="/best-smartphones-india" className="border border-border p-3 bg-white hover:border-[#d4220a] transition-colors group"><span className="font-sans text-sm font-bold text-ink group-hover:text-[#d4220a]">Best Smartphones India →</span></Link>
              <Link href="/best-camera-phones-india" className="border border-border p-3 bg-white hover:border-[#d4220a] transition-colors group"><span className="font-sans text-sm font-bold text-ink group-hover:text-[#d4220a]">Best Camera Phones India →</span></Link>
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