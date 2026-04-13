// app/best-smartphones-india/page.tsx
import { Metadata } from 'next'
import Link from 'next/link'
import { getPillarArticles, formatPillarDate, currentMonthYear } from '@/lib/pillar-utils'

export const revalidate = 3600

export async function generateMetadata(): Promise<Metadata> {
  const { month, year } = currentMonthYear()
  const title = `Best Smartphones in India — ${month} ${year}`
  return {
    title: `${title} | The Tech Bharat`,
    description: `Best smartphones in India 2026 — all brands, all budgets. Complete guide from Rs 10,000 budget to Rs 1,50,000 flagship with honest recommendations.`,
    alternates: { canonical: 'https://thetechbharat.com/best-smartphones-india' },
    openGraph: { title, url: 'https://thetechbharat.com/best-smartphones-india', type: 'article' },
  }
}

export default async function BestSmartphonesPage() {
  const { month, year } = currentMonthYear()
  const img1 = "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=1200&q=80"
  const img2 = "https://images.unsplash.com/photo-1592899677977-9c10002761d5?auto=format&fit=crop&w=1200&q=80"
  const img3 = "https://images.unsplash.com/photo-1565849904461-04a58ad377e0?auto=format&fit=crop&w=1200&q=80"
  const img4 = "https://images.unsplash.com/photo-1601784551446-a21f28a2e7a0?auto=format&fit=crop&w=1200&q=80"
  const img5 = "https://images.unsplash.com/photo-1585060544812-6b45742d762f?auto=format&fit=crop&w=1200&q=80"

  const articles = await getPillarArticles(['best smartphone India', 'best phone India', 'top mobile India', 'smartphone guide India 2026'], [], 12, "None")
  const reviews  = articles.filter(a => a.type === 'review' || a.type === 'compare')
  const news     = articles.filter(a => a.type === 'mobile-news')

  return (
    <div className="bg-paper min-h-screen">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://thetechbharat.com' },
          { '@type': 'ListItem', position: 2, name: 'Best Smartphones in India —', item: 'https://thetechbharat.com/best-smartphones-india' },
        ],
      }) }} />

      <div className="max-w-4xl mx-auto px-4 py-10">

        {/* Breadcrumb */}
        <nav className="font-sans text-xs text-muted mb-6 flex items-center gap-2 flex-wrap">
          <Link href="/" className="hover:text-[#d4220a]">Home</Link>
          <span>/</span>
          <Link href="/mobile-news" className="hover:text-[#d4220a]">Mobile News</Link>
          <span>/</span>
          <span className="text-ink">Best Smartphones in India —</span>
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
            Best Smartphones in India — {month} {year}
          </h1>
          <p className="font-sans text-base font-semibold text-[#1a3a5c] border-l-4 border-[#1a3a5c] pl-4 mb-2">
            The complete smartphone guide for India — all brands, all budgets, with honest recommendations for every type of Indian buyer.
          </p>
        </div>

        {/* Hero image */}
        <div className="mb-8 overflow-hidden">
          <img src={img1} alt="Best Smartphones in India —" className="w-full h-64 object-cover" loading="eager" />
        </div>

        <p className="font-body text-lg text-[#2a2a2a] leading-relaxed mb-6">India is the world\'s second largest smartphone market and one of its most competitive. Over 150 smartphone models launch in India every year. Choosing the right phone from this overwhelming selection is the purpose of this guide — a comprehensive, honest ranking of the best smartphones available in India in {month} {year} across every budget tier, without brand bias or paid placement.</p>
        <p className="font-body text-base text-[#2a2a2a] leading-relaxed mb-6">This guide covers six price tiers: under Rs 15,000, Rs 15,000-25,000, Rs 25,000-40,000, Rs 40,000-70,000, Rs 70,000-1,00,000, and above Rs 1,00,000. At each tier, I pick the best overall phone and explain exactly why — and which alternatives deserve consideration for specific use cases.</p>

        <h2 className="font-playfair text-2xl font-bold text-ink mt-10 mb-4 pb-2 border-b-2 border-[#d4220a]">Best Smartphones India {month} {year} — All Budgets</h2>
        <div className="overflow-x-auto mb-8"><table className="w-full border-collapse text-sm font-sans"><thead><tr className="bg-[#1a3a5c] text-white"><th className="px-3 py-2 text-left">Budget</th><th className="px-3 py-2 text-left">Best Pick</th><th className="px-3 py-2 text-left">Price</th><th className="px-3 py-2 text-left">Why</th></tr></thead>
        <tbody>{[
          ['Under Rs 15,000','Redmi Note 14 5G','Rs 14,999','Best display, camera and 5G at budget tier'],
          ['Rs 15,000-25,000','Samsung Galaxy M35 5G','Rs 20,999','4yr updates, 6,000mAh, Samsung service'],
          ['Rs 25,000-40,000','Samsung Galaxy A35 5G','Rs 30,999','5yr updates, AMOLED, OIS camera'],
          ['Rs 40,000-70,000','Samsung Galaxy A55 5G','Rs 39,999','Best value mid-range in India'],
          ['Rs 70,000-1,00,000','Google Pixel 9','Rs 79,999','Best camera, pure Android, 7yr updates'],
          ['Above Rs 1,00,000','Samsung Galaxy S25 Ultra','Rs 1,34,999','S Pen, 200MP, 7yr support — the complete flagship'],
        ].map(([b,m,p,w],i) => (<tr key={b} className={i%2===0?'bg-white border-b border-border':'bg-gray-50 border-b border-border'}><td className="px-3 py-2 font-bold text-[#1a3a5c]">{b}</td><td className="px-3 py-2 font-semibold">{m}</td><td className="px-3 py-2">{p}</td><td className="px-3 py-2">{w}</td></tr>))}
        </tbody></table></div>

        <div className="my-8 overflow-hidden"><img src={img2} alt="best smartphones India 2026 all brands comparison" className="w-full h-56 object-cover" loading="lazy" /><p className="font-sans text-xs text-muted mt-1 text-center">India\'s smartphone market — 150+ models annually across every price tier</p></div>

        <h2 className="font-playfair text-2xl font-bold text-ink mt-10 mb-4 pb-2 border-b-2 border-[#d4220a]">Under Rs 15,000 — Redmi Note 14 5G</h2>
        <p className="font-body text-base text-[#2a2a2a] leading-relaxed mb-4">The Redmi Note 14 5G at Rs 14,999 is the most complete budget smartphone in India in {month} {year}. AMOLED 120Hz display, Snapdragon 4s Gen 2, 5,500mAh battery, and Xiaomi\'s camera processing that consistently over-delivers at this price. The main trade-off: 2-3 years of OS updates. For buyers who upgrade frequently, this is fine. For 3+ year owners, Samsung Galaxy M15 5G (Rs 13,999) with 4-year updates is the smarter long-term choice despite slightly inferior specs.</p>

        <h2 className="font-playfair text-2xl font-bold text-ink mt-10 mb-4 pb-2 border-b-2 border-[#d4220a]">Rs 15,000-25,000 — Samsung Galaxy M35 5G</h2>
        <p className="font-body text-base text-[#2a2a2a] leading-relaxed mb-4">The Galaxy M35 5G at Rs 20,999 is the most sensible smartphone purchase in India for buyers who will use their phone for 3+ years. 4 years of OS updates, 6,000mAh battery delivering 10+ hour screen time, Exynos 1380 chip handling everything comfortably, and Samsung\'s 3,000+ service centre network across India. Nothing Phone (2a) at Rs 23,999 is the creative alternative — better software design and 45W charging, but 2 years fewer updates and limited service coverage outside metros.</p>

        <div className="my-8 overflow-hidden"><img src={img3} alt="mid-range smartphones India 2026 Samsung Xiaomi comparison" className="w-full h-56 object-cover" loading="lazy" /><p className="font-sans text-xs text-muted mt-1 text-center">Rs 20,000-30,000 — the tier where update longevity and service network matter most</p></div>

        <h2 className="font-playfair text-2xl font-bold text-ink mt-10 mb-4 pb-2 border-b-2 border-[#d4220a]">Rs 25,000-40,000 — Samsung Galaxy A35 and A55 5G</h2>
        <p className="font-body text-base text-[#2a2a2a] leading-relaxed mb-4">Samsung owns this tier in India and for good reason. The Galaxy A35 5G at Rs 30,999 offers AMOLED 120Hz display, OIS-capable 50MP camera, and 5 years of OS updates — the longest update promise of any Android phone under Rs 35,000. The A55 5G at Rs 39,999 adds IP67 water resistance and slightly faster Exynos 1480 chip. For most buyers in this tier: A35 is the value pick, A55 is the premium pick. OnePlus 13R at Rs 44,999 is the alternative for buyers who prioritise raw performance and charging speed over update longevity.</p>

        <h2 className="font-playfair text-2xl font-bold text-ink mt-10 mb-4 pb-2 border-b-2 border-[#d4220a]">Rs 70,000-1,00,000 — Google Pixel 9 vs Samsung Galaxy S25</h2>
        <p className="font-body text-base text-[#2a2a2a] leading-relaxed mb-4">The Google Pixel 9 (Rs 79,999) and Samsung Galaxy S25 (Rs 79,999) sit at the same price and represent two fundamentally different philosophies. Pixel 9: clean software, best-in-class camera intelligence, pure Android, 7-year updates. S25: Samsung ecosystem, better gaming performance, superior display technology, 7-year updates, 3,000+ service centres. My recommendation: Pixel 9 if you live in a metro city and prioritise camera quality. Galaxy S25 if you live outside metros or want Samsung\'s ecosystem and services.</p>

        <div className="my-8 overflow-hidden"><img src={img4} alt="Google Pixel 9 vs Samsung Galaxy S25 India comparison" className="w-full h-56 object-cover" loading="lazy" /><p className="font-sans text-xs text-muted mt-1 text-center">Pixel 9 vs Galaxy S25 — same price, fundamentally different strengths for Indian buyers</p></div>

        <h2 className="font-playfair text-2xl font-bold text-ink mt-10 mb-4 pb-2 border-b-2 border-[#d4220a]">Key Buying Factors — What Actually Matters in India</h2>
        <p className="font-body text-base text-[#2a2a2a] leading-relaxed mb-4">Software update longevity matters more in India than in many markets because Indian buyers tend to hold phones longer. The average phone replacement cycle in India is 2.5-3 years — longer than the US or Europe. Buying a phone that stops receiving updates in 2 years means your last 6-12 months of ownership are on an unsupported, potentially insecure OS.</p>
        <p className="font-body text-base text-[#2a2a2a] leading-relaxed mb-4">Service network is the overlooked factor. A phone that\'s technically excellent but has no authorised service centre in your district is a genuine risk — particularly for screens (the most common repair) which require brand-specific replacement parts and calibration. Samsung\'s 3,000+ centres and Xiaomi\'s growing network are the standout leaders here.</p>

        <div className="my-8 overflow-hidden"><img src={img5} alt="smartphone buying factors India 2026 service battery camera" className="w-full h-56 object-cover" loading="lazy" /><p className="font-sans text-xs text-muted mt-1 text-center">Software updates and service network — the two most underrated factors for Indian smartphone buyers</p></div>
        
        <h2 className="font-playfair text-2xl font-bold text-ink mt-10 mb-5 pb-2 border-b border-border">Frequently Asked Questions</h2>
        <div className="space-y-4 mb-10">
          {[
            ['Which is the best smartphone in India in April 2026?','Overall: Samsung Galaxy S25 Ultra for the complete premium experience. Best value: Samsung Galaxy A55 5G (Rs 39,999). Best budget: Redmi Note 14 5G (Rs 14,999). Best camera: Google Pixel 9 Pro (Rs 1,09,999). Best for most people: Samsung Galaxy M35 5G (Rs 20,999).'],
            ['Which brand is best for smartphones in India?','Samsung leads for service network, update longevity, and all-round reliability. Google Pixel leads for camera quality. OnePlus leads for charging speed and performance value. Apple iPhone leads for ecosystem, resale value, and video quality.'],
            ['Is it better to buy a phone online or offline in India?','Online (Flipkart, Amazon official sellers) typically offers better prices and genuine products. Offline (Samsung SmartCafes, Croma, Reliance Digital) offers the ability to see the phone in hand and immediate service. For Samsung, OnePlus, and Xiaomi — online is safe. For iPhones — Apple authorized resellers both online and offline are equally reliable.'],
            ['What is the best phone under Rs 20,000 in India?','Samsung Galaxy M35 5G (Rs 20,999) for 4-year updates and 6,000mAh battery — the long-term choice. Redmi Note 14 5G (Rs 14,999) for best specs at the lowest price. Poco M6 Pro 5G (Rs 15,999) for gaming performance.']
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
            {[['Best Budget Phones India','/best-budget-phones-india'], ['Smartphone Buying Guide','/smartphone-buying-guide-india'], ['Best Camera Phones','/best-camera-phones-india'], ['Best 5G Phones India','/best-5g-phones-india']].map(([l,h]) => (
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