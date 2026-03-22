// app/best-gaming-phones-india/page.tsx
import { Metadata } from 'next'
import Link from 'next/link'
import { getPillarArticles, formatPillarDate } from '@/lib/pillar-utils'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Best Gaming Phones in India 2026 — BGMI, COD Mobile | The Tech Bharat',
  description: 'Best gaming phones in India 2026. Top picks for BGMI, COD Mobile at every budget. Ranked by sustained performance, cooling, and display.',
  alternates: { canonical: 'https://thetechbharat.com/best-gaming-phones-india' },
  openGraph: { title: 'Best Gaming Phones in India 2026', url: 'https://thetechbharat.com/best-gaming-phones-india', type: 'article' },
}

export default async function BestGamingPhonesIndiaPage() {
  const articles = await getPillarArticles(
    ['gaming', 'BGMI', 'game', 'fps', 'refresh rate', 'performance', 'snapdragon', 'processor', 'cooling', 'benchmark', 'gaming phone'],
    [],
    12
  )

  return (
    <div className="bg-paper min-h-screen">
      <div className="max-w-4xl mx-auto px-4 py-10">

        <nav className="font-sans text-xs text-muted mb-6 flex items-center gap-2">
          <Link href="/" className="hover:text-[#d4220a]">Home</Link><span>/</span>
          <Link href="/guides" className="hover:text-[#d4220a]">Guides</Link><span>/</span>
          <span className="text-ink">Best Gaming Phones India</span>
        </nav>

        <div className="mb-8">
          <div className="flex items-center gap-2 mb-3">
            <span className="bg-[#d4220a] text-white font-sans text-[10px] font-bold px-2.5 py-1 uppercase tracking-widest">Updated Continuously</span>
          </div>
          <h1 className="font-playfair text-3xl md:text-4xl font-black text-ink leading-tight mb-4">
            Best Gaming Phones in India — BGMI, COD Mobile, and Beyond
          </h1>
          <p className="font-body text-lg text-[#2a2a2a] leading-relaxed">
            Mobile gaming in India is dominated by BGMI, COD Mobile, Free Fire, and Genshin Impact. Our rankings focus on sustained performance — not just benchmarks — thermal management in Indian summer conditions, and display quality at 90-120fps.
          </p>
        </div>

        {/* What gaming needs */}
        <div className="bg-[#1a3a5c]/5 border-l-4 border-[#1a3a5c] p-5 mb-8">
          <h2 className="font-sans text-sm font-bold text-[#1a3a5c] uppercase tracking-wider mb-3">What Gaming Phones Actually Need</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[
              ['Sustained performance', 'Can it maintain 90fps for 30+ minutes without throttling? Peak benchmarks are meaningless.'],
              ['Thermal management', 'Vapour chamber or graphite cooling — determines whether performance holds in Indian heat.'],
              ['Display refresh rate', '120Hz minimum for competitive BGMI. 144Hz for dedicated gaming phones.'],
              ['Touch response', '120Hz+ touch sampling rate matters for BGMI aiming precision.'],
              ['Battery during gaming', 'Gaming drains fast. 5,000mAh+ recommended for 2+ hour sessions.'],
              ['Shoulder triggers', 'Physical or capacitive triggers give competitive advantage in BGMI.'],
            ].map(([title, desc]) => (
              <div key={title} className="bg-white border border-border p-3">
                <p className="font-sans text-xs font-bold text-ink mb-0.5">{title}</p>
                <p className="font-sans text-xs text-muted">{desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* BGMI fps table */}
        <section className="mb-10">
          <h2 className="font-playfair text-xl font-bold text-ink mb-4 pb-2 border-b border-border">Which Chipsets Support 90fps in BGMI?</h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse font-sans text-sm">
              <thead>
                <tr className="bg-[#1a3a5c] text-white">
                  <th className="px-3 py-2 text-left">Chipset</th>
                  <th className="px-3 py-2 text-left">Max BGMI FPS</th>
                  <th className="px-3 py-2 text-left">Sustained 30 min</th>
                  <th className="px-3 py-2 text-left">India Price Range</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['Snapdragon 8 Gen 3', '90fps', '✅ Yes with cooling', '₹35,000+'],
                  ['Snapdragon 8 Gen 2', '90fps', '✅ Generally yes', '₹25,000+'],
                  ['Dimensity 9300+', '90fps', '✅ Yes', '₹30,000+'],
                  ['Snapdragon 7 Gen 3', '60fps (sometimes 90)', '⚠ Depends on thermal', '₹20,000+'],
                  ['Dimensity 8200', '60fps', '✅ Stable 60fps', '₹15,000+'],
                  ['Snapdragon 6 Gen 1', '60fps', '✅ Stable 60fps', '₹12,000+'],
                ].map(([chip, fps, sustained, price], i) => (
                  <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-3 py-2 border border-border font-medium">{chip}</td>
                    <td className="px-3 py-2 border border-border">{fps}</td>
                    <td className="px-3 py-2 border border-border">{sustained}</td>
                    <td className="px-3 py-2 border border-border">{price}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Dynamic articles */}
        <section className="mb-10">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-6 h-0.5 bg-[#d4220a]" />
            <h2 className="font-playfair text-2xl font-bold text-ink">Gaming & Performance Articles</h2>
            {articles.length > 0 && <span className="font-sans text-xs text-muted bg-gray-100 px-2 py-0.5 rounded">{articles.length}</span>}
          </div>
          {articles.length === 0 ? (
            <div className="border border-border p-8 text-center bg-white">
              <p className="font-sans text-sm text-muted">Gaming articles coming soon. <Link href="/mobile-news" className="text-[#d4220a] hover:underline">Browse all mobile news →</Link></p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {articles.map(article => (
                <Link key={article.slug} href={`/${article.slug}`}
                  className="bg-white border border-border hover:border-[#d4220a] transition-colors group block">
                  {article.featuredImage && (
                    <div className="relative overflow-hidden" style={{ paddingBottom: '56.25%' }}>
                      <img src={article.featuredImage} alt={article.title} width={400} height={225} loading="lazy"
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} />
                      <span className="absolute top-2 left-2 bg-[#d4220a] text-white font-sans text-[9px] font-bold px-2 py-0.5 uppercase tracking-wider z-10">
                        {article.type === 'review' ? 'Review' : article.type === 'compare' ? 'Compare' : 'News'}
                      </span>
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
          )}
        </section>

        <section className="mt-8 pt-6 border-t border-border">
          <h2 className="font-playfair text-xl font-bold text-ink mb-4">Related Guides</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[
              { title: 'Best Smartphones India — All Budgets', href: '/best-smartphones-india' },
              { title: 'Smartphone Buying Guide India', href: '/smartphone-buying-guide-india' },
              { title: 'Android Battery Health Guide', href: '/android-battery-health-guide' },
              { title: 'Phone Comparison Hub', href: '/phone-comparison-guide-india' },
            ].map(({ title, href }) => (
              <Link key={href} href={href} className="border border-border p-3 bg-white hover:border-[#d4220a] transition-colors group">
                <span className="font-sans text-sm font-bold text-ink group-hover:text-[#d4220a] transition-colors">{title} →</span>
              </Link>
            ))}
          </div>
        </section>

        <div className="mt-8 bg-[#f8f4ef] border-l-4 border-[#d4220a] p-5">
          <p className="font-sans text-xs font-bold text-[#d4220a] uppercase tracking-wider mb-2">Editorial Note</p>
          <p className="font-sans text-sm text-muted">Articles fetched in real-time from The Tech Bharat's published content. Rankings based on sustained performance testing and India-specific thermal conditions. By Vijay Yadav.</p>
        </div>

      </div>
    </div>
  )
}