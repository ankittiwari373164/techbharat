// app/best-smartphones-india/page.tsx
import { Metadata } from 'next'
import Link from 'next/link'
import { getPillarArticles, formatPillarDate } from '@/lib/pillar-utils'

export const revalidate = 1800

export const metadata: Metadata = {
  title: 'Best Smartphones in India 2026 — Every Budget | The Tech Bharat',
  description: 'Best smartphones in India by budget — ₹10K to ₹1L+. Honest picks for every Indian buyer. Updated continuously. No paid placements.',
  alternates: { canonical: 'https://thetechbharat.com/best-smartphones-india' },
  openGraph: { title: 'Best Smartphones in India 2026', url: 'https://thetechbharat.com/best-smartphones-india', type: 'article' },
}

const BUDGET_FILTERS = [
  { label: 'Under ₹15,000',      keywords: ['under 15000', 'under ₹15', '10000', '12000', '14000', 'budget phone'] },
  { label: '₹15,000 – ₹25,000', keywords: ['under 25000', 'under ₹25', 'mid range', '20000', '22000', '25000'] },
  { label: '₹25,000 – ₹40,000', keywords: ['under 40000', 'under ₹40', '30000', '35000', 'mid premium'] },
  { label: '₹40,000 – ₹70,000', keywords: ['under 70000', 'under ₹70', 'premium', 'flagship value', '50000', '60000'] },
  { label: '₹70,000+',           keywords: ['flagship', 'premium', 'ultra', 'pro max', 'top end', 'best'] },
]

export default async function BestSmartphonesIndiaPage() {
  // Fetch all relevant articles sorted by score
  const allArticles = await getPillarArticles(
    ['best', 'review', 'india', 'price', 'launch', 'worth buying', 'should you buy', 'recommended', 'top pick'],
    [],
    20
  )

  // Split into reviews vs news
  const reviews = allArticles.filter(a => a.type === 'review' || a.type === 'compare')
  const news    = allArticles.filter(a => a.type !== 'review' && a.type !== 'compare')

  return (
    <div className="bg-paper min-h-screen">
      <div className="max-w-4xl mx-auto px-4 py-10">

        <nav className="font-sans text-xs text-muted mb-6 flex items-center gap-2">
          <Link href="/" className="hover:text-[#d4220a]">Home</Link><span>/</span>
          <Link href="/guides" className="hover:text-[#d4220a]">Guides</Link><span>/</span>
          <span className="text-ink">Best Smartphones India</span>
        </nav>

        <div className="mb-8">
          <div className="flex items-center gap-2 mb-3">
            <span className="bg-[#d4220a] text-white font-sans text-[10px] font-bold px-2.5 py-1 uppercase tracking-widest">Updated Continuously</span>
          </div>
          <h1 className="font-playfair text-3xl md:text-4xl font-black text-ink leading-tight mb-4">
            Best Smartphones in India — Honest Picks at Every Budget
          </h1>
          <p className="font-body text-lg text-[#2a2a2a] leading-relaxed">
            Our reviews and analyses cover every price bracket for Indian buyers. No paid placements — these are genuine editorial recommendations based on India-specific usage, service networks, and software update commitments.
          </p>
        </div>

        {/* How we pick */}
        <div className="bg-[#1a3a5c]/5 border-l-4 border-[#1a3a5c] p-5 mb-8">
          <h2 className="font-sans text-sm font-bold text-[#1a3a5c] uppercase tracking-wider mb-3">How We Evaluate for Indian Buyers</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {[
              'India retail pricing — not launch MRP',
              'Authorised service centre availability by city tier',
              'Software update commitment (years of OS + security)',
              'Performance in Indian summer heat conditions',
              '5G band compatibility (n78 for Jio & Airtel)',
              'Resale value after 2 years in Indian market',
            ].map((item, i) => (
              <div key={i} className="font-sans text-sm text-ink flex items-start gap-2">
                <span className="text-[#d4220a] font-bold flex-shrink-0">✓</span>{item}
              </div>
            ))}
          </div>
        </div>

        {/* Reviews section */}
        {reviews.length > 0 && (
          <section className="mb-10">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-6 h-0.5 bg-[#d4220a]" />
              <h2 className="font-playfair text-2xl font-bold text-ink">Phone Reviews & Analysis</h2>
              <span className="font-sans text-xs text-muted bg-gray-100 px-2 py-0.5 rounded">{reviews.length}</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {reviews.map(article => (
                <Link key={article.slug} href={`/${article.slug}`}
                  className="bg-white border border-border hover:border-[#d4220a] transition-colors group block">
                  {article.featuredImage && (
                    <div className="relative overflow-hidden" style={{ paddingBottom: '56.25%' }}>
                      <img src={article.featuredImage} alt={article.title} width={400} height={225} loading="lazy"
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} />
                      <span className="absolute top-2 left-2 bg-[#d4220a] text-white font-sans text-[9px] font-bold px-2 py-0.5 uppercase tracking-wider z-10">
                        {article.type === 'review' ? 'Review' : 'Compare'}
                      </span>
                    </div>
                  )}
                  <div className="p-3">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="font-sans text-[10px] font-bold text-[#d4220a] uppercase tracking-wide">{article.brand}</span>
                      <span className="font-sans text-[10px] text-muted ml-auto">{formatPillarDate(article.publishDate)}</span>
                    </div>
                    <h3 className="font-sans text-sm font-bold text-ink leading-snug group-hover:text-[#d4220a] transition-colors line-clamp-2 mb-1.5">{article.title}</h3>
                    <p className="font-sans text-xs text-muted line-clamp-2">{article.summary}</p>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="font-sans text-[10px] text-muted">{article.readTime} min read</span>
                      <span className="font-sans text-xs font-semibold text-[#d4220a]">Read →</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* News section */}
        {news.length > 0 && (
          <section className="mb-10">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-6 h-0.5 bg-[#1a3a5c]" />
              <h2 className="font-playfair text-2xl font-bold text-ink">Latest Phone News & Launches</h2>
              <span className="font-sans text-xs text-muted bg-gray-100 px-2 py-0.5 rounded">{news.length}</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {news.map(article => (
                <Link key={article.slug} href={`/${article.slug}`}
                  className="bg-white border border-border hover:border-[#d4220a] transition-colors group block">
                  {article.featuredImage && (
                    <div className="relative overflow-hidden" style={{ paddingBottom: '56.25%' }}>
                      <img src={article.featuredImage} alt={article.title} width={400} height={225} loading="lazy"
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} />
                      <span className="absolute top-2 left-2 bg-[#1a3a5c] text-white font-sans text-[9px] font-bold px-2 py-0.5 uppercase tracking-wider z-10">News</span>
                    </div>
                  )}
                  <div className="p-3">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="font-sans text-[10px] font-bold text-[#1a3a5c] uppercase tracking-wide">{article.brand}</span>
                      <span className="font-sans text-[10px] text-muted ml-auto">{formatPillarDate(article.publishDate)}</span>
                    </div>
                    <h3 className="font-sans text-sm font-bold text-ink leading-snug group-hover:text-[#d4220a] transition-colors line-clamp-2 mb-1.5">{article.title}</h3>
                    <p className="font-sans text-xs text-muted line-clamp-2">{article.summary}</p>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="font-sans text-[10px] text-muted">{article.readTime} min read</span>
                      <span className="font-sans text-xs font-semibold text-[#d4220a]">Read →</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {allArticles.length === 0 && (
          <div className="border border-border p-10 text-center bg-white mb-10">
            <p className="font-sans text-sm text-muted">Articles are being added. <Link href="/mobile-news" className="text-[#d4220a] hover:underline">Browse all mobile news →</Link></p>
          </div>
        )}

        {/* Related guides */}
        <section className="mt-8 pt-6 border-t border-border">
          <h2 className="font-playfair text-xl font-bold text-ink mb-4">Explore More Guides</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[
              { title: 'Smartphone Buying Guide India', href: '/smartphone-buying-guide-india' },
              { title: 'Best Camera Phones India', href: '/best-camera-phones-india' },
              { title: 'Best Battery Phones India', href: '/best-battery-backup-phones-india' },
              { title: 'Best Gaming Phones India', href: '/best-gaming-phones-india' },
            ].map(({ title, href }) => (
              <Link key={href} href={href} className="border border-border p-3 bg-white hover:border-[#d4220a] transition-colors group">
                <span className="font-sans text-sm font-bold text-ink group-hover:text-[#d4220a] transition-colors">{title} →</span>
              </Link>
            ))}
          </div>
        </section>

        <div className="mt-8 bg-[#f8f4ef] border-l-4 border-[#d4220a] p-5">
          <p className="font-sans text-xs font-bold text-[#d4220a] uppercase tracking-wider mb-2">Editorial Note</p>
          <p className="font-sans text-sm text-muted">All articles are fetched in real-time from The Tech Bharat's published content. No paid placements. Last updated dynamically. By Vijay Yadav, Senior Mobile Editor.</p>
        </div>

      </div>
    </div>
  )
}