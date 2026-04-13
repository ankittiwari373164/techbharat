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
    description: `Complete smartphone buying guide India 2026 — how to choose the right phone for your budget, usage and location with step-by-step advice.`,
    alternates: { canonical: 'https://thetechbharat.com/smartphone-buying-guide-india' },
    openGraph: { title, url: 'https://thetechbharat.com/smartphone-buying-guide-india', type: 'article' },
  }
}

export default async function SmartphoneBuyingGuidePage() {
  const { month, year } = currentMonthYear()
  const img1 = "https://images.unsplash.com/photo-1556656793-08538906a9f8?auto=format&fit=crop&w=1200&q=80"
  const img2 = "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?auto=format&fit=crop&w=1200&q=80"
  const img3 = "https://images.unsplash.com/photo-1567581935884-3349723552ca?auto=format&fit=crop&w=1200&q=80"
  const img4 = "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80"
  const img5 = "https://images.unsplash.com/photo-1512941937938-54f7f4c5e6b4?auto=format&fit=crop&w=1200&q=80"

  const articles = await getPillarArticles(['smartphone buying guide', 'how to buy phone India', 'phone buying tips', 'which phone to buy India'], [], 12, "None")
  const reviews  = articles.filter(a => a.type === 'review' || a.type === 'compare')
  const news     = articles.filter(a => a.type === 'mobile-news')

  return (
    <div className="bg-paper min-h-screen">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://thetechbharat.com' },
          { '@type': 'ListItem', position: 2, name: 'Smartphone Buying Guide India —', item: 'https://thetechbharat.com/smartphone-buying-guide-india' },
        ],
      }) }} />

      <div className="max-w-4xl mx-auto px-4 py-10">

        {/* Breadcrumb */}
        <nav className="font-sans text-xs text-muted mb-6 flex items-center gap-2 flex-wrap">
          <Link href="/" className="hover:text-[#d4220a]">Home</Link>
          <span>/</span>
          <Link href="/mobile-news" className="hover:text-[#d4220a]">Mobile News</Link>
          <span>/</span>
          <span className="text-ink">Smartphone Buying Guide India —</span>
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
            Smartphone Buying Guide India — {month} {year}
          </h1>
          <p className="font-sans text-base font-semibold text-[#1a3a5c] border-l-4 border-[#1a3a5c] pl-4 mb-2">
            Step-by-step guide to buying the right smartphone in India — avoid mistakes, understand specs, and get the best value for your budget.
          </p>
        </div>

        {/* Hero image */}
        <div className="mb-8 overflow-hidden">
          <img src={img1} alt="Smartphone Buying Guide India —" className="w-full h-64 object-cover" loading="eager" />
        </div>

        <p className="font-body text-lg text-[#2a2a2a] leading-relaxed mb-6">Buying a smartphone in India in {month} {year} is both easier and harder than it has ever been. Easier because quality phones are available at every price point. Harder because the choices are overwhelming and specifications are increasingly used to mislead rather than inform. This guide gives you a practical framework for choosing the right smartphone regardless of your budget — from Rs 10,000 to Rs 1,50,000.</p>

        <h2 className="font-playfair text-2xl font-bold text-ink mt-10 mb-4 pb-2 border-b-2 border-[#d4220a]">Step 1 — Define Your Budget Range (Not Just a Number)</h2>
        <p className="font-body text-base text-[#2a2a2a] leading-relaxed mb-4">The most common mistake Indian buyers make is setting a precise budget (Rs 15,000 exactly) and missing significantly better phones at Rs 16,000-17,000. Define a range: under Rs 15,000, or Rs 15,000-20,000. Within a range, choose the best phone — not the cheapest. A Rs 1,000-2,000 stretch often delivers a dramatically better phone (better display, more updates, faster charging) that you\'ll appreciate for 3 years.</p>
        <p className="font-body text-base text-[#2a2a2a] leading-relaxed mb-4">Key thresholds in India\'s smartphone market in {month} {year}: Below Rs 12,000 (entry 5G, basic AMOLED), Rs 12,000-15,000 (better AMOLED, stronger cameras), Rs 15,000-25,000 (significantly better performance, update longevity), Rs 25,000-40,000 (OIS cameras, IP-rated builds, premium mid-range), Rs 40,000-70,000 (flagship-adjacent performance), above Rs 70,000 (true flagships with 7-year support).</p>

        <div className="my-8 overflow-hidden"><img src={img2} alt="smartphone budget guide India 2026 price tiers" className="w-full h-56 object-cover" loading="lazy" /><p className="font-sans text-xs text-muted mt-1 text-center">India\'s smartphone price tiers — quality jumps meaningfully at key price thresholds</p></div>

        <h2 className="font-playfair text-2xl font-bold text-ink mt-10 mb-4 pb-2 border-b-2 border-[#d4220a]">Step 2 — Decide Your Priority (Be Honest)</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">{[
          ['Camera is Priority','→ Best camera phones: Google Pixel 9 Pro, iPhone 16 Pro, Samsung Galaxy A55/S25. OIS is essential. Avoid 200MP claims on budget phones — sensor size and OIS matter more.'],
          ['Battery is Priority','→ Best battery phones: Samsung Galaxy M35 5G, M15 5G, OnePlus 13. Look for 6,000mAh+ with at least 25W charging. Avoid phones where battery capacity isn\'t disclosed clearly.'],
          ['Gaming is Priority','→ Best gaming phones: iQOO 12, Asus ROG 8, Poco X6 Pro. Snapdragon 8-series for 90fps. 120Hz display essential. Good thermal management matters more than raw chip speed.'],
          ['Longevity is Priority','→ Most important factor for 3+ year owners: software update commitment. Samsung A-series (5yr), Samsung S-series (7yr). No Chinese brand below Rs 30,000 offers more than 2-3 years.'],
          ['Service Network is Priority','→ Living outside metros? Samsung is the clear winner with 3,000+ centres. Xiaomi improving. Avoid OnePlus, Pixel, and Nothing if you\'re in a tier-3 city without dedicated service.'],
          ['Value-per-Rupee is Priority','→ Best value: Redmi Note 14 5G (under 15k), Samsung M35 5G (20-25k), Galaxy A55 5G (35-45k), OnePlus 13 (above 60k). These represent inflection points in the market.'],
        ].map(([p,r]) => (<div key={p} className="border border-border p-4 bg-white"><h3 className="font-sans text-sm font-bold text-[#1a3a5c] mb-2">{p}</h3><p className="font-sans text-sm text-muted leading-relaxed">{r}</p></div>))}</div>

        <h2 className="font-playfair text-2xl font-bold text-ink mt-10 mb-4 pb-2 border-b-2 border-[#d4220a]">Step 3 — Understand the Specifications That Matter</h2>
        <p className="font-body text-base text-[#2a2a2a] leading-relaxed mb-4"><strong>Processor:</strong> The processor determines gaming performance, app loading speed, and how well the phone will perform in 3 years. Snapdragon 8 Elite/Gen 3 (flagship), Snapdragon 7+ Gen 3/Dimensity 8300 Ultra (upper mid-range), Snapdragon 4 Gen 2/Dimensity 7050 (mid-range), Snapdragon 695/4s Gen 2 (budget). The generation matters more than brand — Dimensity 8300 Ultra outperforms Snapdragon 7 Gen 3.</p>
        <p className="font-body text-base text-[#2a2a2a] leading-relaxed mb-4"><strong>Display:</strong> AMOLED is significantly better than LCD for outdoor use in Indian sunlight. 120Hz is the recommended minimum for smooth scrolling. Brightness (measured in nits) matters for outdoor visibility — 800+ nits peak brightness is good, 1,000+ nits is excellent for reading in direct Indian summer sunlight.</p>
        <p className="font-body text-base text-[#2a2a2a] leading-relaxed mb-4"><strong>Camera:</strong> Megapixels are marketing. What matters: sensor size (larger = better low light), aperture (lower f/ number = more light), OIS (optical image stabilisation = sharper photos), and image processing quality. A 50MP camera with OIS beats a 108MP camera without OIS in real-world use.</p>

        <div className="my-8 overflow-hidden"><img src={img3} alt="smartphone specs guide India processor camera display" className="w-full h-56 object-cover" loading="lazy" /><p className="font-sans text-xs text-muted mt-1 text-center">Specifications that matter — processor generation, AMOLED display, OIS camera and battery size</p></div>

        <h2 className="font-playfair text-2xl font-bold text-ink mt-10 mb-4 pb-2 border-b-2 border-[#d4220a]">Step 4 — Consider Your Location</h2>
        <p className="font-body text-base text-[#2a2a2a] leading-relaxed mb-4">Your city determines which brands are truly safe to buy. In metro cities (Mumbai, Delhi, Bengaluru, Chennai, Kolkata, Hyderabad): all major brands have service centres. You can safely buy Samsung, Xiaomi, OnePlus, Realme, iQOO, Google Pixel, Apple, Nothing — service within 10-15 km is realistic. In tier-2 cities: Samsung, Xiaomi, Realme, and Vivo have comprehensive coverage. OnePlus and iQOO are present but may require travel. Pixel and Nothing are risky. In tier-3 cities and rural areas: Samsung is the only truly safe brand. Their 3,000+ network reaches India\'s smaller cities and towns in a way no other brand currently does.</p>

        <h2 className="font-playfair text-2xl font-bold text-ink mt-10 mb-4 pb-2 border-b-2 border-[#d4220a]">Step 5 — Where to Buy Safely in India</h2>
        <p className="font-body text-base text-[#2a2a2a] leading-relaxed mb-4">Online: Flipkart and Amazon (only from brand official stores or authorised sellers, not third-party sellers with low ratings). For Samsung: samsung.com/in direct. For iPhones: apple.com/in direct or authorised resellers. Never buy smartphones from small unknown sellers on Amazon or Flipkart — counterfeit and refurbished phones sold as new are a real problem. Offline: Samsung SmartCafes, Samsung Experience Stores, Croma, Reliance Digital, and brand-authorised retailers are all safe. Avoid grey-market shops with significantly below-MRP pricing.</p>

        <div className="my-8 overflow-hidden"><img src={img4} alt="where to buy smartphone India Flipkart Amazon offline" className="w-full h-56 object-cover" loading="lazy" /><p className="font-sans text-xs text-muted mt-1 text-center">Safest purchase channels — official brand websites, Flipkart and Amazon official stores</p></div>

        <h2 className="font-playfair text-2xl font-bold text-ink mt-10 mb-4 pb-2 border-b-2 border-[#d4220a]">Red Flags — Specifications That Are Often Misleading</h2>
        <p className="font-body text-base text-[#2a2a2a] leading-relaxed mb-4">High megapixel count without OIS (common on budget phones — 50MP without stabilisation is worse than 12MP with OIS). "Up to 120fps gaming" — means the chip can handle it for 5 minutes before throttling, not sustained gaming. "6GB RAM with 6GB virtual RAM" — virtual RAM is slow storage masquerading as RAM, not equivalent to actual RAM. "AI-enhanced camera" — present on every phone above Rs 5,000, means almost nothing. Fast charging claims without specifying adapter — many phones ship with slow chargers while advertising fast charging speeds that require a separate purchase.</p>

        <div className="my-8 overflow-hidden"><img src={img5} alt="smartphone specification red flags India buying guide" className="w-full h-56 object-cover" loading="lazy" /><p className="font-sans text-xs text-muted mt-1 text-center">Common specification myths — what to ignore when comparing smartphones in India</p></div>
        
        <h2 className="font-playfair text-2xl font-bold text-ink mt-10 mb-5 pb-2 border-b border-border">Frequently Asked Questions</h2>
        <div className="space-y-4 mb-10">
          {[
            ['How do I know if a phone has Jio/Airtel 5G support?','Check the official spec sheet for n78 band (3500MHz) support. Go to the brand\'s India website, find your phone model, scroll to connectivity/network specifications. If n78 is listed: full Jio and Airtel 5G support.'],
            ['Which is better — buying online or offline in India?','Online from official brand stores on Flipkart/Amazon typically gives the best price. Offline at Samsung/Apple authorised stores gives you the ability to inspect the phone and immediate service. Price difference is usually Rs 500-2,000. Both are safe when buying from authorised channels.'],
            ['How much RAM do I need on a smartphone in India?','6GB RAM minimum for smooth performance. 8GB RAM is the sweet spot for multitasking with many apps open. 12GB+ is useful for gaming and keeping many browser tabs open. 4GB RAM is insufficient in April 2026 — avoid unless under Rs 8,000 with no alternative.'],
            ['Is it worth paying more for a phone with better camera?','Yes, if photography matters to you. The camera quality difference between Rs 15,000 and Rs 30,000 phones is significant and will be visible in every photo you take over 3 years. The camera quality difference between Rs 30,000 and Rs 50,000 is smaller but still meaningful for low-light and zoom shots.']
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
            {[['Best Smartphones India','/best-smartphones-india'], ['Best Budget Phones India','/best-budget-phones-india'], ['Phone Comparison Guide','/phone-comparison-guide-india'], ['Best 5G Phones India','/best-5g-phones-india']].map(([l,h]) => (
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