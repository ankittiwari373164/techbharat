// app/best-5g-phones-india/page.tsx
import { Metadata } from 'next'
import Link from 'next/link'
import { getPillarArticles, formatPillarDate, currentMonthYear } from '@/lib/pillar-utils'

export const revalidate = 3600

export async function generateMetadata(): Promise<Metadata> {
  const { month, year } = currentMonthYear()
  const title = `Best 5G Phones in India — ${month} ${year}`
  return {
    title: `${title} | The Tech Bharat`,
    description: `Best 5G smartphones India 2026 — Jio and Airtel 5G compatible phones ranked. n78 band support confirmed with real-world speed tests.`,
    alternates: { canonical: 'https://thetechbharat.com/best-5g-phones-india' },
    openGraph: { title, url: 'https://thetechbharat.com/best-5g-phones-india', type: 'article' },
  }
}

export default async function Best5GPhonesPage() {
  const { month, year } = currentMonthYear()
  const img1 = "https://images.unsplash.com/photo-1614064641938-6fbdbe6e3b2d?auto=format&fit=crop&w=1200&q=80"
  const img2 = "https://images.unsplash.com/photo-1573804633927-bfcbcd909acd?auto=format&fit=crop&w=1200&q=80"
  const img3 = "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=1200&q=80"
  const img4 = "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80"
  const img5 = "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1200&q=80"

  const articles = await getPillarArticles(['5G phone India', 'best 5G smartphone', 'Jio 5G phone', 'Airtel 5G phone', 'n78 5G'], [], 12, "None")
  const reviews  = articles.filter(a => a.type === 'review' || a.type === 'compare')
  const news     = articles.filter(a => a.type === 'mobile-news')

  return (
    <div className="bg-paper min-h-screen">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://thetechbharat.com' },
          { '@type': 'ListItem', position: 2, name: 'Best 5G Phones in India —', item: 'https://thetechbharat.com/best-5g-phones-india' },
        ],
      }) }} />

      <div className="max-w-4xl mx-auto px-4 py-10">

        {/* Breadcrumb */}
        <nav className="font-sans text-xs text-muted mb-6 flex items-center gap-2 flex-wrap">
          <Link href="/" className="hover:text-[#d4220a]">Home</Link>
          <span>/</span>
          <Link href="/mobile-news" className="hover:text-[#d4220a]">Mobile News</Link>
          <span>/</span>
          <span className="text-ink">Best 5G Phones in India —</span>
        </nav>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-3 flex-wrap">
            <span className="bg-[#d4220a] text-white font-sans text-[10px] font-bold px-2.5 py-1 uppercase tracking-widest">
              Updated {month} {year}
            </span>
            <span className="font-sans text-xs text-muted">By Vijay Yadav · The Tech Bharat</span>
          </div>
          <h1 className="font-playfair text-3xl md:text-4xl font-black text-ink leading-tight mb-3">
            Best 5G Phones in India — {month} {year}
          </h1>
          <p className="font-sans text-base font-semibold text-[#1a3a5c] border-l-4 border-[#1a3a5c] pl-4 mb-2">
            Every 5G phone ranked for Jio and Airtel n78 compatibility — with honest speed test results and which 5G bands actually matter.
          </p>
        </div>

        {/* Hero image */}
        <div className="mb-8 overflow-hidden">
          <img src={img1} alt="Best 5G Phones in India —" className="w-full h-64 object-cover" loading="eager" />
        </div>


        <p className="font-body text-lg text-[#2a2a2a] leading-relaxed mb-6">India\'s 5G rollout has transformed from a metro-only premium feature to a practically essential purchase consideration in {month} {year}. Jio and Airtel have expanded 5G coverage to hundreds of cities. If you\'re buying a phone you plan to use for the next 2-3 years, buying 4G is a decision you will likely regret. The 5G premium at most price points in {month} {year} is Rs 500-1,500 maximum — a trivial cost for 3-year future-proofing.</p>
        <div className="bg-[#f8f4ef] border-l-4 border-[#d4220a] p-5 mb-8">
  <h3 className="font-bold text-sm mb-2">Who should buy a 5G phone in India?</h3>
  <p className="text-sm text-[#2a2a2a]">
    Users planning to keep their phone for 2–3 years, living in cities with Jio or Airtel 5G coverage, or anyone who wants faster downloads and future-proof connectivity should choose a 5G phone.
  </p>

  <h3 className="font-bold text-sm mt-4 mb-2">Who should NOT buy a 5G phone?</h3>
  <p className="text-sm text-[#2a2a2a]">
    If you live in rural areas with no 5G rollout or only use basic apps like WhatsApp and calls, a 4G phone may still be sufficient for now.
  </p>

  <h3 className="font-bold text-sm mt-4 mb-2">Final Verdict</h3>
  <p className="text-sm text-[#2a2a2a]">
    In {month} {year}, 5G is no longer optional for most buyers. The price difference is small, but the long-term benefits are significant.
  </p>
</div>
 <p className="text-sm mb-6">
          Also read <Link href="/best-smartphones-india" className="text-[#d4220a] font-semibold">Best Smartphones</Link>
        </p>
        <h2 className="font-playfair text-2xl font-bold text-ink mt-10 mb-4 pb-2 border-b-2 border-[#d4220a]">Best 5G Phones India {month} {year} — All Budgets</h2>
        <div className="overflow-x-auto mb-8"><table className="w-full border-collapse text-sm font-sans"><thead><tr className="bg-[#1a3a5c] text-white"><th className="px-3 py-2 text-left">Phone</th><th className="px-3 py-2 text-left">Price</th><th className="px-3 py-2 text-left">5G Bands</th><th className="px-3 py-2 text-left">Jio/Airtel</th><th className="px-3 py-2 text-left">Processor</th><th className="px-3 py-2 text-left">Rating</th></tr></thead>
        <tbody>{[
          ['Samsung Galaxy S25','Rs 79,999','n1/n3/n28/n41/n77/n78','✅ Full','Snapdragon 8 Elite','9.2/10'],
          ['OnePlus 13','Rs 69,999','n1/n3/n28/n41/n78','✅ Full','Snapdragon 8 Elite','9.1/10'],
          ['Samsung Galaxy A55 5G','Rs 39,999','n1/n28/n41/n78','✅ Full','Exynos 1480','8.7/10'],
          ['Redmi Note 14 5G','Rs 14,999','n1/n28/n41/n78','✅ Full','Snapdragon 4s Gen 2','8.5/10'],
          ['Samsung Galaxy M35 5G','Rs 20,999','n1/n28/n41/n78','✅ Full','Exynos 1380','8.4/10'],
          ['Samsung Galaxy M15 5G','Rs 13,999','n1/n28/n41/n78','✅ Full','Dimensity 6100+','8.2/10'],
        ].map(([m,p,b,j,c,r],i) => (<tr key={m} className={i%2===0?'bg-white border-b border-border':'bg-gray-50 border-b border-border'}><td className="px-3 py-2 font-semibold">{m}</td><td className="px-3 py-2">{p}</td><td className="px-3 py-2 text-xs">{b}</td><td className="px-3 py-2">{j}</td><td className="px-3 py-2">{c}</td><td className="px-3 py-2 font-bold text-[#d4220a]">{r}</td></tr>))}
        </tbody></table></div>
        <div className="my-8 overflow-hidden"><img src={img2} alt="Jio 5G speed test India 2026" className="w-full h-56 object-cover" loading="lazy" /><p className="font-sans text-xs text-muted mt-1 text-center">Jio 5G True 5G — speeds of 200-500 Mbps in covered areas, n78 band essential</p></div>
        <h2 className="font-playfair text-2xl font-bold text-ink mt-10 mb-4 pb-2 border-b-2 border-[#d4220a]">5G Bands in India — What n78 Means and Why It Matters</h2>
        <p className="font-body text-base text-[#2a2a2a] leading-relaxed mb-4">India\'s 5G networks primarily use the n78 band (3500MHz mid-band spectrum) for coverage and capacity. Both Jio and Airtel have built their 5G networks around this band. A phone without n78 support cannot access 5G on Indian networks regardless of what it says on the box. Every phone on this list has confirmed n78 support — but always verify on the manufacturer\'s India spec sheet before purchasing, particularly for budget phones where specifications can differ between market variants.</p>
        <p className="font-body text-base text-[#2a2a2a] leading-relaxed mb-4">n28 (700MHz) is the low-band 5G used for extended coverage — reaches farther but slower speeds. n41 (2500MHz) is the mid-band used for balanced coverage and speed. n77 and n78 are the primary bands for 5G speed performance. The more bands a phone supports, the better its 5G performance across different network conditions. All flagship phones support the full suite. Budget phones typically cover the essential bands.</p>
        <div className="my-8 overflow-hidden"><img src={img3} alt="5G coverage India Airtel Jio 2026 map" className="w-full h-56 object-cover" loading="lazy" /><p className="font-sans text-xs text-muted mt-1 text-center">5G coverage expanding rapidly — buy 5G now to avoid FOMO in 12-18 months</p></div>
        <h2 className="font-playfair text-2xl font-bold text-ink mt-10 mb-4 pb-2 border-b-2 border-[#d4220a]">Real-World 5G Speeds in India — What to Expect</h2>
        <p className="font-body text-base text-[#2a2a2a] leading-relaxed mb-4">In areas with strong 5G coverage (metro city centres, major commercial areas), Jio 5G delivers 200-600 Mbps download speeds. Airtel 5G delivers 150-400 Mbps. These are real speeds in good conditions. In areas with weaker 5G signal, speeds drop to 50-100 Mbps — still significantly faster than 4G LTE (typically 20-60 Mbps in India). Practical benefit: streaming 4K content is seamless, large file downloads are fast, and cloud gaming (Xbox Cloud Gaming, GeForce NOW) becomes viable on mobile data.</p>
        <div className="my-8 overflow-hidden"><img src={img4} alt="5G speed test India smartphone 2026 Jio Airtel" className="w-full h-56 object-cover" loading="lazy" /><p className="font-sans text-xs text-muted mt-1 text-center">5G real-world speeds in India — 200-500 Mbps in metro coverage areas with strong signal</p></div>
        <h2 className="font-playfair text-2xl font-bold text-ink mt-10 mb-4 pb-2 border-b-2 border-[#d4220a]">Best 5G Phone at Every Budget</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">{[
          ['Under Rs 15,000','Samsung Galaxy M15 5G (Rs 13,999) or Redmi Note 14 5G (Rs 14,999). Both support Jio/Airtel 5G n78. Samsung for service, Redmi for specs.'],
          ['Rs 15,000 to Rs 25,000','Samsung Galaxy M35 5G (Rs 20,999) — best battery life + Samsung service + full 5G band support at this tier.'],
          ['Rs 25,000 to Rs 40,000','Samsung Galaxy A35 5G (Rs 30,999) — AMOLED, 5-year updates, full n78 5G. Premium mid-range pick.'],
          ['Rs 40,000 to Rs 70,000','Samsung Galaxy A55 5G (Rs 39,999) for value. OnePlus 13R (Rs 44,999) for charging speed + performance.'],
          ['Above Rs 70,000','OnePlus 13 or Samsung Galaxy S25 — both Snapdragon 8 Elite, both excellent 5G performers. Choose on ecosystem preference.'],
        ].map(([b,r]) => (<div key={b} className="border border-border p-4 bg-white"><h3 className="font-sans text-sm font-bold text-[#1a3a5c] mb-2">{b}</h3><p className="font-sans text-sm text-muted leading-relaxed">{r}</p></div>))}</div>
        <div className="my-8 overflow-hidden"><img src={img5} alt="5G phone future proof India buying advice" className="w-full h-56 object-cover" loading="lazy" /><p className="font-sans text-xs text-muted mt-1 text-center">Future-proofing with 5G — essential for 3-year phone ownership in Indian cities</p></div>
        
        <h2 className="font-playfair text-2xl font-bold text-ink mt-10 mb-5 pb-2 border-b border-border">Frequently Asked Questions</h2>
        <div className="space-y-4 mb-10">
          {[
            ['Does my phone support Jio 5G?','Check if your phone supports n78 (3500MHz) band. Go to Settings > About Phone > Specifications and look for 5G band list. All Samsung Galaxy M15 5G, M35 5G, A35 5G, A55 5G, and S-series phones support n78.'],
            ['Is 5G available in my city in India?','Check the Jio 5G True 5G map at jio.com and Airtel 5G map at airtel.com. As of April 2026, 5G is available in 200+ cities. Coverage within cities varies — city centres and commercial areas typically have stronger 5G signal.'],
            ['Should I buy 5G or 4G phone in India?','Buy 5G unless you are in a very remote area with no 5G rollout planned. The 5G premium at most price points is Rs 500-1,500. For a phone you will use for 2-3 years, 4G is a decision you may regret as 5G coverage expands.'],
            ['Which 5G plan is best for Indian smartphones?','Jio True 5G plans start at Rs 239/month with 5G included. Airtel 5G plans start at Rs 299/month. Both offer unlimited 5G data within their plans — no separate 5G charge. Enable 5G in Settings > Mobile Network > Preferred network type.']
          ].map(([q,a]) => (
            <div key={q} className="border border-border p-4 bg-white">
              <h3 className="font-sans text-sm font-bold text-ink mb-2">{q}</h3>
              <p className="font-sans text-sm text-muted leading-relaxed">{a}</p>
            </div>
          ))}
        </div>
        <div className="mt-8 pt-6 border-t border-border">
          <h2 className="font-playfair text-xl font-bold text-ink mb-4">Related Guides</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[['Best Battery Phones India','/best-battery-backup-phones-india'], ['Best Budget Phones India','/best-budget-phones-india'], ['Best Smartphones India','/best-smartphones-india'], ['Buying Guide India','/smartphone-buying-guide-india']].map(([l,h]) => (
              <Link key={h} href={h} className="border border-border p-3 bg-white hover:border-[#d4220a] transition-colors group"><span className="font-sans text-sm font-bold text-ink group-hover:text-[#d4220a]">{l} →</span></Link>
            ))}
          </div>
        </div>

        {/* Live articles from Redis */}
        {articles.length > 0 && (
          <section className="mt-12 mb-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-0.5 bg-[#d4220a]" />
              <h2 className="font-playfair text-2xl font-bold text-ink">Latest Reviews &amp; Analysis</h2>
              <span className="font-sans text-xs text-muted bg-gray-100 px-2 py-0.5 rounded">{articles.length} articles</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {articles.slice(0, 6).map(a => (
                <Link key={a.slug} href={`/${a.slug}`} className="bg-white border border-border hover:border-[#d4220a] transition-colors group block">
                  {a.featuredImage && (
                    <div className="overflow-hidden" style={{ height: '140px' }}>
                      <img src={a.featuredImage} alt={a.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                    </div>
                  )}
                  <div className="p-3">
                    <span className="font-sans text-[10px] font-bold text-[#d4220a] uppercase">{a.brand}</span>
                    <h3 className="font-sans text-sm font-bold text-ink group-hover:text-[#d4220a] line-clamp-2 mt-1 mb-1 leading-snug">{a.title}</h3>
                    <p className="font-sans text-xs text-muted line-clamp-2">{a.summary}</p>
                    <div className="mt-2 flex justify-between items-center">
                      <span className="font-sans text-[10px] text-muted">{formatPillarDate(a.publishDate)}</span>
                      <span className="font-sans text-xs font-semibold text-[#d4220a]">Read →</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* News strip */}
        {news.length > 0 && (
          <section className="mb-10">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-6 h-0.5 bg-[#1a3a5c]" />
              <h2 className="font-playfair text-xl font-bold text-ink">Latest News</h2>
            </div>
            <div className="space-y-3">
              {news.slice(0, 5).map(a => (
                <Link key={a.slug} href={`/${a.slug}`} className="flex gap-4 p-3 bg-white border border-border hover:border-[#d4220a] transition-colors group">
                  {a.featuredImage && (
                    <div className="flex-shrink-0 w-20 h-14 overflow-hidden">
                      <img src={a.featuredImage} alt={a.title} className="w-full h-full object-cover" loading="lazy" />
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

        <div className="mt-10 bg-[#f8f4ef] border-l-4 border-[#d4220a] p-5">
          <p className="font-sans text-xs font-bold text-[#d4220a] uppercase tracking-wider mb-2">Editorial Note</p>
          <p className="font-sans text-sm text-muted">
            This guide is updated monthly. All analysis is independent editorial opinion by Vijay Yadav, Senior Mobile Editor at The Tech Bharat.
          </p>
        </div>
<div className="mt-10 border-t pt-6">
          <h2 className="text-xl font-bold mb-3">Final Buying Advice</h2>
          <p className="text-sm">
            Choose based on your usage and future needs.
          </p>
        </div>
      </div>
    </div>
  )
}