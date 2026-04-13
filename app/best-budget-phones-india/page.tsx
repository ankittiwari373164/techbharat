// app/best-budget-phones-india/page.tsx
import { Metadata } from 'next'
import Link from 'next/link'
import { getPillarArticles, formatPillarDate, currentMonthYear } from '@/lib/pillar-utils'

export const revalidate = 3600

export async function generateMetadata(): Promise<Metadata> {
  const { month, year } = currentMonthYear()
  const title = `Best Budget Phones in India Under Rs 15,000 and Rs 20,000 — ${month} ${year}`
  return {
    title: `${title} | The Tech Bharat`,
    description: `Best budget smartphones India 2026 under Rs 15000 and Rs 20000 — honest comparison with specs table, pros/cons and India-specific buying advice.`,
    alternates: { canonical: 'https://thetechbharat.com/best-budget-phones-india' },
    openGraph: { title, url: 'https://thetechbharat.com/best-budget-phones-india', type: 'article' },
  }
}

export default async function BestBudgetPhonesPage() {
  const { month, year } = currentMonthYear()
  const img1 = "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?auto=format&fit=crop&w=1200&q=80"
  const img2 = "https://images.unsplash.com/photo-1567581935884-3349723552ca?auto=format&fit=crop&w=1200&q=80"
  const img3 = "https://images.unsplash.com/photo-1556656793-08538906a9f8?auto=format&fit=crop&w=1200&q=80"
  const img4 = "https://images.unsplash.com/photo-1509395176047-4a66953fd231?auto=format&fit=crop&w=1200&q=80"
  const img5 = "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=1200&q=80"

  const articles = await getPillarArticles(['budget phone', 'under 15000', 'under 20000', 'affordable', 'value for money', 'cheap 5G'], [], 12, "None")
  const reviews  = articles.filter(a => a.type === 'review' || a.type === 'compare')
  const news     = articles.filter(a => a.type === 'mobile-news')

  return (
    <div className="bg-paper min-h-screen">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://thetechbharat.com' },
          { '@type': 'ListItem', position: 2, name: 'Best Budget Phones in India Under Rs 15,000 and Rs 20,000 —', item: 'https://thetechbharat.com/best-budget-phones-india' },
        ],
      }) }} />

      <div className="max-w-4xl mx-auto px-4 py-10">

        {/* Breadcrumb */}
        <nav className="font-sans text-xs text-muted mb-6 flex items-center gap-2 flex-wrap">
          <Link href="/" className="hover:text-[#d4220a]">Home</Link>
          <span>/</span>
          <Link href="/mobile-news" className="hover:text-[#d4220a]">Mobile News</Link>
          <span>/</span>
          <span className="text-ink">Best Budget Phones in India Under Rs 15,000 and Rs 20,000 —</span>
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
            Best Budget Phones in India Under Rs 15,000 and Rs 20,000 — {month} {year}
          </h1>
          <p className="font-sans text-base font-semibold text-[#1a3a5c] border-l-4 border-[#1a3a5c] pl-4 mb-2">
            India\'s most competitive price range — ranked honestly for 5G, battery, camera and long-term value.
          </p>
        </div>

        {/* Hero image */}
        <div className="mb-8 overflow-hidden">
          <img src={img1} alt="Best Budget Phones in India Under Rs 15,000 and Rs 20,000 —" className="w-full h-64 object-cover" loading="eager" />
        </div>


        <p className="font-body text-lg text-[#2a2a2a] leading-relaxed mb-6">The Rs 10,000 to Rs 20,000 price range is where India\'s smartphone market is most competitive — and most confusing. In {month} {year}, you can get 5G, AMOLED displays, and 50MP cameras at Rs 12,000. But not all at once, and not without compromises that matter. This guide tells you exactly what each budget buys you and what you give up.</p>
        <p className="font-body text-base text-[#2a2a2a] leading-relaxed mb-6">The most important thing to understand about budget phones in India: the spec sheet is a marketing document. Real-world performance — particularly thermal throttling under sustained load, camera quality in low light, and software experience after 18 months of use — is what separates genuinely good budget phones from those that disappoint.</p>

        <h2 className="font-playfair text-2xl font-bold text-ink mt-10 mb-4 pb-2 border-b-2 border-[#d4220a]">Best Budget Phones India {month} {year} — Quick Comparison</h2>
        <div className="overflow-x-auto mb-8">
          <table className="w-full border-collapse text-sm font-sans">
            <thead><tr className="bg-[#1a3a5c] text-white">
              <th className="px-3 py-2 text-left">Phone</th><th className="px-3 py-2 text-left">Price</th><th className="px-3 py-2 text-left">Display</th><th className="px-3 py-2 text-left">Battery</th><th className="px-3 py-2 text-left">Processor</th><th className="px-3 py-2 text-left">Best For</th>
            </tr></thead>
            <tbody>
              {[
                ['Redmi Note 14 5G','Rs 14,999','AMOLED 120Hz','5,500mAh','Snapdragon 4s Gen 2','Camera + display'],
                ['Samsung Galaxy M15 5G','Rs 13,999','AMOLED 90Hz','6,000mAh','Dimensity 6100+','Battery + service'],
                ['Realme Narzo 70 Pro 5G','Rs 17,999','AMOLED 120Hz','5,000mAh + 45W','Dimensity 7050','Charging speed'],
                ['Poco M6 Pro 5G','Rs 15,999','AMOLED 120Hz','5,000mAh','Snapdragon 4 Gen 2','Gaming'],
                ['iQOO Z9 Lite 5G','Rs 11,999','AMOLED 90Hz','5,000mAh','Snapdragon 4 Gen 2','Budget 5G value'],
                ['Samsung Galaxy M35 5G','Rs 20,999','AMOLED 120Hz','6,000mAh','Exynos 1380','Long-term support'],
              ].map(([m,p,d,b,c,bf],i) => (
                <tr key={m} className={i%2===0?'bg-white border-b border-border':'bg-gray-50 border-b border-border'}>
                  <td className="px-3 py-2 font-semibold">{m}</td><td className="px-3 py-2">{p}</td><td className="px-3 py-2">{d}</td><td className="px-3 py-2">{b}</td><td className="px-3 py-2">{c}</td><td className="px-3 py-2 text-[#d4220a] font-medium">{bf}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="my-8 overflow-hidden"><img src={img2} alt="Best budget phones India 2026 comparison" className="w-full h-56 object-cover" loading="lazy" /><p className="font-sans text-xs text-muted mt-1 text-center">Budget phones in India 2026 — AMOLED, 5G, and 50MP cameras under Rs 15,000</p></div>

        <h2 className="font-playfair text-2xl font-bold text-ink mt-10 mb-4 pb-2 border-b-2 border-[#d4220a]">Under Rs 12,000 — The Honest State of Budget 5G</h2>
        <p className="font-body text-base text-[#2a2a2a] leading-relaxed mb-4">The iQOO Z9 Lite 5G at Rs 11,999 is the most compelling sub-Rs 12,000 phone in India right now. The Snapdragon 4 Gen 2 is a genuine improvement over the Snapdragon 4 Gen 1 found in older budget phones — better sustained gaming performance and significantly better power efficiency. The AMOLED display at this price remains rare and genuinely good for outdoor visibility, which matters enormously in Indian summer conditions.</p>
        <p className="font-body text-base text-[#2a2a2a] leading-relaxed mb-4">What you give up under Rs 12,000: camera quality in low light is average across all options, you\'ll get 2 years of OS updates maximum, and sustained performance under gaming load (BGMI 90fps for 30 minutes) is not realistic. Set expectations correctly and the iQOO Z9 Lite delivers excellent value. Expect iPhone-level camera quality and you\'ll be disappointed.</p>

        <h2 className="font-playfair text-2xl font-bold text-ink mt-10 mb-4 pb-2 border-b-2 border-[#d4220a]">Rs 12,000 to Rs 15,000 — Redmi Note 14 5G vs Galaxy M15 5G</h2>
        <p className="font-body text-base text-[#2a2a2a] leading-relaxed mb-4">This is the most contested segment in Indian smartphones. The Redmi Note 14 5G at Rs 14,999 offers a brighter AMOLED display, more capable camera processing, and better immediate performance. The Samsung Galaxy M15 5G at Rs 13,999 offers Samsung\'s 4-year update commitment — something no Xiaomi, Realme, or iQOO phone at this price comes close to matching.</p>
        <p className="font-body text-base text-[#2a2a2a] leading-relaxed mb-4">My take: if you\'re planning to use this phone for 2 years or less, buy the Redmi Note 14 5G. The better display and camera justify the Rs 1,000 premium. If you\'re planning to keep this phone for 3+ years or live in a smaller city where Samsung service centres are accessible, the Galaxy M15 5G\'s update longevity and service network make it the smarter long-term choice.</p>

        <div className="my-8 overflow-hidden"><img src={img3} alt="Redmi Note 14 5G vs Samsung M15 5G India" className="w-full h-56 object-cover" loading="lazy" /><p className="font-sans text-xs text-muted mt-1 text-center">Redmi vs Samsung in the Rs 12,000-15,000 range — different priorities, both valid</p></div>

        <h2 className="font-playfair text-2xl font-bold text-ink mt-10 mb-4 pb-2 border-b-2 border-[#d4220a]">Rs 15,000 to Rs 20,000 — More Choices, Clearer Tradeoffs</h2>
        <p className="font-body text-base text-[#2a2a2a] leading-relaxed mb-4">The Poco M6 Pro 5G at Rs 15,999 stands out for gaming performance. Snapdragon 4 Gen 2 handles BGMI at 60fps consistently, and the display is one of the better budget gaming panels. The trade-off: Poco\'s software experience remains somewhat bloated, and update support is 2 years maximum.</p>
        <p className="font-body text-base text-[#2a2a2a] leading-relaxed mb-4">The Realme Narzo 70 Pro at Rs 17,999 brings 45W charging — a meaningful differentiator when most sub-Rs 20,000 phones charge at 18-25W. Full charge in under an hour is genuinely useful. The Dimensity 7050 chip is capable for everyday use but not a gaming chip.</p>
        <p className="font-body text-base text-[#2a2a2a] leading-relaxed mb-4">The Samsung Galaxy M35 5G at Rs 20,999 is the top of this tier. Exynos 1380 chip (same as Galaxy A35 5G), 6,000mAh battery, 4 years of updates, and Samsung\'s full service network. If you can stretch the budget, this is the clearest value jump in the Rs 15,000-25,000 range.</p>

        <h2 className="font-playfair text-2xl font-bold text-ink mt-10 mb-4 pb-2 border-b-2 border-[#d4220a]">5G on Budget Phones — What Actually Matters</h2>
        <p className="font-body text-base text-[#2a2a2a] leading-relaxed mb-4">Every phone in this segment now claims 5G. But meaningful 5G means n78 (3500MHz) band support — the primary band used by Jio and Airtel. Redmi Note 14 5G, Samsung Galaxy M15 5G, M35 5G, Poco M6 Pro, iQOO Z9 Lite — all confirmed n78 support for Indian 5G networks. This is not a feature to compromise on: buy 4G in {month} {year} and you will want to upgrade in 12-18 months as 5G coverage expands.</p>

        <div className="my-8 overflow-hidden"><img src={img4} alt="5G budget phones India network coverage" className="w-full h-56 object-cover" loading="lazy" /><p className="font-sans text-xs text-muted mt-1 text-center">5G coverage in India expanding rapidly — n78 band support essential in budget phones</p></div>

        <h2 className="font-playfair text-2xl font-bold text-ink mt-10 mb-4 pb-2 border-b-2 border-[#d4220a]">Camera Reality Check for Budget Phones</h2>
        <p className="font-body text-base text-[#2a2a2a] leading-relaxed mb-4">A 50MP camera on a budget phone is marketing. The sensor size, lens quality, and image processing pipeline determine real camera quality — and budget phones cut corners on all three to hit price points. Redmi Note 14 5G has the best camera processing in its tier, producing acceptable daylight shots with good colour. Low-light performance is average across all budget options. Night mode works on all of them but produces artificial-looking results.</p>
        <p className="font-body text-base text-[#2a2a2a] leading-relaxed mb-4">Practical advice: if camera quality matters to you and your budget is truly limited to Rs 15,000, the Redmi Note 14 5G is the best camera phone at this price. If you can stretch to Rs 25,000-30,000, the Redmi Note 13 Pro+ or Samsung Galaxy A35 5G are dramatically better camera phones that represent the real camera quality upgrade threshold.</p>

        <div className="my-8 overflow-hidden"><img src={img5} alt="Budget phone camera India low light photography" className="w-full h-56 object-cover" loading="lazy" /><p className="font-sans text-xs text-muted mt-1 text-center">Camera quality reality at Rs 15,000 — adequate for social media, not for enthusiasts</p></div>
        
        <h2 className="font-playfair text-2xl font-bold text-ink mt-10 mb-5 pb-2 border-b border-border">Frequently Asked Questions</h2>
        <div className="space-y-4 mb-10">
          {[
            ['Best phone under Rs 15,000 in India in April 2026?','Redmi Note 14 5G (Rs 14,999) for best specs and camera. Samsung Galaxy M15 5G (Rs 13,999) if you plan to keep the phone 3+ years or want Samsung\'s service network.'],
            ['Is 5G worth buying under Rs 15,000?','Yes — the 5G premium at this tier is Rs 500-1,000 maximum. n78 5G future-proofs your phone for a 3-year ownership period. All Rs 14,000+ budget phones now include proper n78 5G.'],
            ['Which budget phone is best for gaming in India?','Poco M6 Pro 5G (Rs 15,999) for Snapdragon 4 Gen 2 gaming performance. Handles BGMI at 60fps settings stably. Samsung M35 5G (Rs 20,999) for the step up to consistent 60fps with better thermals.'],
            ['What is the best budget Samsung phone in India?','Samsung Galaxy M15 5G (Rs 13,999) for under Rs 15,000. Galaxy M35 5G (Rs 20,999) for under Rs 25,000. Both offer Samsung\'s 4-year update promise — the key differentiator from Chinese brands at this tier.']
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
            {[['Best 5G Phones India','/best-5g-phones-india'], ['Best Battery Phones India','/best-battery-backup-phones-india'], ['Best Smartphones India','/best-smartphones-india'], ['Buying Guide India','/smartphone-buying-guide-india']].map(([l,h]) => (
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

      </div>
    </div>
  )
}