// app/best-gaming-phones-india/page.tsx
import { Metadata } from 'next'
import Link from 'next/link'
import { getPillarArticles, formatPillarDate, currentMonthYear } from '@/lib/pillar-utils'

export const revalidate = 3600

export async function generateMetadata(): Promise<Metadata> {
  const { month, year } = currentMonthYear()
  return {
    title: `Best Gaming Phones in India — ${month} ${year} Rankings | The Tech Bharat`,
    description: `Best gaming phones India ${month} ${year} ranked by sustained BGMI performance, cooling, and display quality.`,
    alternates: { canonical: 'https://thetechbharat.com/best-gaming-phones-india' },
    openGraph: { title: `Best Gaming Phones in India — ${month} ${year} Rankings | The Tech Bharat`, url: 'https://thetechbharat.com/best-gaming-phones-india', type: 'article' },
  }
}

export default async function BestGamingPhonesPage() {
  const { month, year } = currentMonthYear()
  const articles = await getPillarArticles(['gaming', 'BGMI', 'fps', 'refresh rate', 'performance', 'processor', 'cooling'], [], 15)
  const reviews  = articles.filter(a => a.type === 'review' || a.type === 'compare')
  const news     = articles.filter(a => a.type === 'mobile-news')

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      { '@type': 'Question', name: `Which phone is best for BGMI under ₹25,000?`, acceptedAnswer: { '@type': 'Answer', text: `In ` + month + ` ` + year + `: Poco X6 Pro (Dimensity 8300) offers the best sustained 90fps under ₹25,000. Step up to iQOO Neo 10 at ₹34,999 for dedicated gaming features including shoulder triggers.` } },
      { '@type': 'Question', name: `Why does my phone heat up during BGMI?`, acceptedAnswer: { '@type': 'Answer', text: `Chipset thermal output combined with Indian summer ambient heat causes throttling. Gaming mode in settings, removing case while playing, and phones with vapour chamber cooling (iQOO, ASUS ROG) help significantly.` } }
    ]
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <div className="bg-paper min-h-screen">
        <div className="max-w-4xl mx-auto px-4 py-10">
          <nav className="font-sans text-xs text-muted mb-6 flex items-center gap-2">
            <Link href="/" className="hover:text-[#d4220a]">Home</Link><span>/</span>
            <span className="text-ink">Best Gaming Phones in India — {month} {year} Rankings</span>
          </nav>
          <div className="mb-8">
            <span className="bg-[#d4220a] text-white font-sans text-[10px] font-bold px-2.5 py-1 uppercase tracking-widest">Updated {month} {year}</span>
            <h1 className="font-playfair text-3xl md:text-4xl font-black text-ink leading-tight mt-3 mb-4">Best Gaming Phones in India — {month} {year} Rankings</h1>
            <p className="font-body text-lg text-[#2a2a2a] leading-relaxed">BGMI, COD Mobile, Genshin Impact — India's mobile gaming market is massive. These {month} {year} rankings focus on sustained 90fps in Indian summer conditions, not peak benchmark numbers.</p>
          </div>

          <section className="mb-8">
            <h2 className="font-playfair text-xl font-bold text-ink mb-4 pb-2 border-b border-border">What Gaming Actually Needs</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="bg-white border border-border p-4">
                <p className="font-sans text-xs font-bold text-ink mb-1">Sustained performance</p>
                <p className="font-sans text-xs text-muted leading-relaxed">Holding 90fps for 45 minutes without throttling is the real BGMI test. Peak benchmarks are meaningless.</p>
              </div>
              <div className="bg-white border border-border p-4">
                <p className="font-sans text-xs font-bold text-ink mb-1">Thermal management</p>
                <p className="font-sans text-xs text-muted leading-relaxed">Vapour chamber cooling separates playable from throttled in 40°C Indian summer.</p>
              </div>
              <div className="bg-white border border-border p-4">
                <p className="font-sans text-xs font-bold text-ink mb-1">120Hz display minimum</p>
                <p className="font-sans text-xs text-muted leading-relaxed">120Hz is minimum for competitive BGMI. Touch sampling rate 240Hz+ improves aiming precision.</p>
              </div>
              <div className="bg-white border border-border p-4">
                <p className="font-sans text-xs font-bold text-ink mb-1">Shoulder triggers</p>
                <p className="font-sans text-xs text-muted leading-relaxed">Physical or capacitive shoulder triggers (iQOO, ASUS ROG) give competitive advantage in BGMI.</p>
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
                <h3 className="font-sans text-sm font-bold text-ink mb-2">Which phone is best for BGMI under ₹25,000?</h3>
                <p className="font-sans text-sm text-muted leading-relaxed">In {month} {year}: Poco X6 Pro (Dimensity 8300) offers the best sustained 90fps under ₹25,000. Step up to iQOO Neo 10 at ₹34,999 for dedicated gaming features including shoulder triggers.</p>
              </div>
              <div className="border border-border p-4 bg-white">
                <h3 className="font-sans text-sm font-bold text-ink mb-2">Why does my phone heat up during BGMI?</h3>
                <p className="font-sans text-sm text-muted leading-relaxed">Chipset thermal output combined with Indian summer ambient heat causes throttling. Gaming mode in settings, removing case while playing, and phones with vapour chamber cooling (iQOO, ASUS ROG) help significantly.</p>
              </div>
            </div>
          </section>
          <section className="mt-8 pt-6 border-t border-border">
            <h2 className="font-playfair text-xl font-bold text-ink mb-4">Related Guides</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Link href="/best-smartphones-india" className="border border-border p-3 bg-white hover:border-[#d4220a] transition-colors group"><span className="font-sans text-sm font-bold text-ink group-hover:text-[#d4220a]">Best Smartphones India →</span></Link>
              <Link href="/best-battery-backup-phones-india" className="border border-border p-3 bg-white hover:border-[#d4220a] transition-colors group"><span className="font-sans text-sm font-bold text-ink group-hover:text-[#d4220a]">Best Battery Phones India →</span></Link>
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