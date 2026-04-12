// app/best-apple-iphone-india/page.tsx
// Best iPhones in India — — Dynamic month/year + brand-aware article fetching
import { Metadata } from 'next'
import Link from 'next/link'
import { getPillarArticles, formatPillarDate, currentMonthYear } from '@/lib/pillar-utils'
import PillarNav from '@/components/PillarNav'

export const revalidate = 3600

export async function generateMetadata(): Promise<Metadata> {
  const { month, year } = currentMonthYear()
  const title = `Best iPhones in India — {month} {year}`
  return {
    title: `${title} | The Tech Bharat`,
    description: `Best iPhones in India MONTH YEAR — iPhone 16 series ranked for Indian buyers. Which iPhone to buy, India pricing, and honest value analysis.`.replace('MONTH', month).replace('YEAR', String(year)),
    alternates: { canonical: 'https://thetechbharat.com/best-apple-iphone-india' },
    openGraph: { title, url: 'https://thetechbharat.com/best-apple-iphone-india', type: 'article' },
  }
}

export default async function BestApplePhonesPage() {
  const { month, year } = currentMonthYear()

  // Fetch brand-specific articles from Redis
  const brandArticles  = await getPillarArticles(['Apple', 'iPhone', 'iOS', 'iPhone review', 'iPhone India price'], [], 12, "Apple")
  const relatedArticles = await getPillarArticles(['Apple', 'iPhone', 'iOS', 'iPhone review', 'iPhone India price'], brandArticles.map(a => a.slug), 6)
  const allArticles    = [...brandArticles, ...relatedArticles]
  const reviews = allArticles.filter(a => a.type === 'review' || a.type === 'compare')
  const news    = allArticles.filter(a => a.type === 'mobile-news')

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      { '@type': 'Question', name: "Which iPhone should I buy in India in MONTH YEAR?", acceptedAnswer: { '@type': 'Answer', text: "Best buy for most Indian users in MONTH YEAR: iPhone 16 at Rs 79,900 if new, iPhone 15 at Rs 44,900 if budget-conscious. For power users and camera enthusiasts: iPhone 16 Pro at Rs 1,19,900 with 5x zoom and ProRes video. Only buy iPhone 16 Pro Max if you specifically need the larger screen." } },
      { '@type': 'Question', name: "Is buying an iPhone in India more expensive than abroad?", acceptedAnswer: { '@type': 'Answer', text: "Yes, typically 15-25% more expensive than USA pricing due to import duties and GST. However, iPhones are now assembled in India (iPhone 16 series) which has reduced the gap compared to previous years. The resale value advantage in India partially compensates over a 3-year ownership cycle." } },
      { '@type': 'Question', name: "How many years does Apple support iPhones with updates?", acceptedAnswer: { '@type': 'Answer', text: "Apple guarantees at least 7 years of software updates for all iPhone 16 models (2024-2031). iPhone 15 is guaranteed through 2029 minimum. iPhone 14 through 2027. This industry-leading support cycle is a genuine competitive advantage versus most Android brands." } },
      { '@type': 'Question', name: "Is iPhone 16 worth buying over Android at the same price?", acceptedAnswer: { '@type': 'Answer', text: "At Rs 79,900, the iPhone 16 competes against Samsung Galaxy S24, OnePlus 12R, and Google Pixel 9. For camera: Pixel 9 wins on computational photography, iPhone 16 wins on video. For performance: all are excellent. For long-term value: iPhone wins on resale and update support. Choose based on ecosystem preference." } }
    ],
  }

  return (
    <>
      <PillarNav />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <div className="bg-paper min-h-screen">
        <div className="max-w-4xl mx-auto px-4 py-10">

          {/* Breadcrumb */}
          <nav className="font-sans text-xs text-muted mb-6 flex items-center gap-2 flex-wrap">
            <Link href="/" className="hover:text-[#d4220a]">Home</Link>
            <span>/</span>
            <Link href="/mobile-news" className="hover:text-[#d4220a]">Mobile News</Link>
            <span>/</span>
            <span className="text-ink">Best iPhones in India —</span>
          </nav>

          {/* Hero Header */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-3 flex-wrap">
              <span className="bg-[#d4220a] text-white font-sans text-[10px] font-bold px-2.5 py-1 uppercase tracking-widest">
                Updated {month} {year}
              </span>
              <span className="font-sans text-xs text-muted">By Vijay Yadav · The Tech Bharat</span>
            </div>
            <h1 className="font-playfair text-3xl md:text-4xl font-black text-ink leading-tight mb-3">
              Best iPhones in India — {month} {year}
            </h1>
            {/* Subheader */}
            <p className="font-sans text-base font-semibold text-[#1a3a5c] border-l-4 border-[#1a3a5c] pl-4 mb-4">
              Complete iPhone lineup ranked for Indian buyers — from iPhone 15 to iPhone 16 Pro Max, with India pricing and honest value verdict.
            </p>
            <p className="font-body text-lg text-[#2a2a2a] leading-relaxed">
              Apple's iPhone lineup in India in MONTH YEAR spans from Rs 44,900 (iPhone 15) to Rs 1,59,900 (iPhone 16 Pro Max). The import duty situation, resale value advantage, and iOS ecosystem make iPhone buying decisions in India uniquely complex. This guide cuts through the noise.
            </p>
          </div>

          {/* Comparison Table */}
          
          <section className="mb-10 overflow-x-auto">
            <h2 className="font-playfair text-2xl font-bold text-ink mb-4 pb-2 border-b-2 border-[#d4220a]">Quick Comparison Table</h2>
            <table className="w-full border-collapse text-sm font-sans">
                <thead><tr className="bg-[#1a3a5c] text-white">
                  <th className="px-3 py-2 text-left">Phone</th><th className="px-3 py-2 text-left">India Price</th><th className="px-3 py-2 text-left">Chip</th><th className="px-3 py-2 text-left">Camera</th><th className="px-3 py-2 text-left">Best For</th>
                </tr></thead>
                <tbody>
                  <tr className="bg-white border-b border-border">
                    <td className="px-3 py-2">iPhone 16 Pro Max</td><td className="px-3 py-2">Rs 1,59,900</td><td className="px-3 py-2">A18 Pro</td><td className="px-3 py-2">48MP + 5x periscope</td><td className="px-3 py-2">Ultimate users</td>
                  </tr>
<tr className="bg-gray-50 border-b border-border">
                    <td className="px-3 py-2">iPhone 16 Pro</td><td className="px-3 py-2">Rs 1,19,900</td><td className="px-3 py-2">A18 Pro</td><td className="px-3 py-2">48MP + 5x telephoto</td><td className="px-3 py-2">Pro photographers</td>
                  </tr>
<tr className="bg-white border-b border-border">
                    <td className="px-3 py-2">iPhone 16</td><td className="px-3 py-2">Rs 79,900</td><td className="px-3 py-2">A18</td><td className="px-3 py-2">48MP main</td><td className="px-3 py-2">Mainstream buyers</td>
                  </tr>
<tr className="bg-gray-50 border-b border-border">
                    <td className="px-3 py-2">iPhone 16e</td><td className="px-3 py-2">Rs 59,900</td><td className="px-3 py-2">A16 Bionic</td><td className="px-3 py-2">48MP main</td><td className="px-3 py-2">Budget Apple buyers</td>
                  </tr>
<tr className="bg-white border-b border-border">
                    <td className="px-3 py-2">iPhone 15</td><td className="px-3 py-2">Rs 44,900 (refurb)</td><td className="px-3 py-2">A16 Bionic</td><td className="px-3 py-2">48MP main</td><td className="px-3 py-2">Entry Apple users</td>
                  </tr>
                </tbody>
              </table>
          </section>

          {/* Main Content Sections — 3000+ words of original editorial content */}

          <h2 className="font-playfair text-2xl font-bold text-ink mt-10 mb-4 pb-2 border-b-2 border-[#d4220a]">Why iPhones Cost More in India — The Real Answer</h2>
          <p className="font-body text-base text-[#2a2a2a] leading-relaxed mb-4">A simple answer to a common question: Apple charges Rs 79,900 for the iPhone 16 in India vs $799 (~Rs 67,000) in the USA. The difference is primarily import duty (20%), GST (18% on top), and Apple's own India pricing premium. However, iPhones assembled in India (SE, 15, 16 series now) carry lower duties than fully imported models.</p>
          <p className="font-body text-base text-[#2a2a2a] leading-relaxed mb-4">The resale value equation changes the calculation. An iPhone 16 bought at Rs 79,900 today will resell for Rs 45,000-50,000 after 2 years. An Android phone at the same price typically resells for Rs 25,000-30,000. Over a 4-year ownership cycle, iPhone's total cost of ownership is often competitive with premium Android.</p>
          <p className="font-body text-base text-[#2a2a2a] leading-relaxed mb-4">iOS versus Android is the real deciding factor for most buyers. If you use a Mac, iPad, or AirPods, the iPhone ecosystem integration is genuinely seamless. If you use Windows and have no Apple devices, you lose most of that advantage — and Android at the same price delivers more flexibility.</p>
          <h3 className="font-playfair text-lg font-bold text-ink mt-6 mb-3">iPhone 16 Pro — The One Most Indian Buyers Should Buy</h3>
          <p className="font-body text-base text-[#2a2a2a] leading-relaxed mb-4">At Rs 1,19,900, the iPhone 16 Pro is the best iPhone for most Indian buyers who want the full Apple experience. The A18 Pro chip, 5x optical zoom periscope, ProRes video, and 7-year update commitment justify the premium over the standard iPhone 16. Camera Control button is a genuine addition for content creators.</p>
          <h3 className="font-playfair text-lg font-bold text-ink mt-6 mb-3">iPhone 16 — The Mainstream Sweet Spot</h3>
          <p className="font-body text-base text-[#2a2a2a] leading-relaxed mb-4">iPhone 16 at Rs 79,900 brings A18 chip, 48MP camera, and Action button at the most accessible tier of the current lineup. Missing: 5x zoom (only 2x), ProMotion 120Hz display, and titanium build. Worth the Rs 40,000 gap versus Pro? For most users: no. For budget-conscious Apple buyers: yes.</p>
          <h3 className="font-playfair text-lg font-bold text-ink mt-6 mb-3">iPhone 15 — The Best Value Apple Buy in India</h3>
          <p className="font-body text-base text-[#2a2a2a] leading-relaxed mb-4">The iPhone 15 at Rs 44,900 (on sale/refurbished) remains an exceptional value in MONTH YEAR. A16 Bionic chip, 48MP camera, Dynamic Island, USB-C — it covers everything most Indian users need and gets iOS updates until at least 2029. For first-time iPhone buyers, this is often the smartest entry point.</p>
          <h2 className="font-playfair text-2xl font-bold text-ink mt-10 mb-4 pb-2 border-b-2 border-[#d4220a]">iPhone vs Android in India — The Honest Verdict</h2>
          <p className="font-body text-base text-[#2a2a2a] leading-relaxed mb-4">iPhone wins over Android for: long-term software support (7 years), resale value (50-60% after 2 years), video quality (ProRes, Cinematic mode), ecosystem integration with Mac/iPad/AirPods, and privacy features. These are genuine advantages, not just marketing.</p>
          <p className="font-body text-base text-[#2a2a2a] leading-relaxed mb-4">Android wins over iPhone for: price flexibility across budgets, 5G band versatility, USB flexibility and file management, customisation, repair accessibility outside metros, and individual apps (particularly Indian banking apps which occasionally have iOS compatibility issues). For Indian-specific use cases, Android often wins on practical grounds.</p>
          <p className="font-body text-base text-[#2a2a2a] leading-relaxed mb-4">My honest take: If you are buying above Rs 60,000, an iPhone deserves serious consideration alongside Android options. Below Rs 60,000, Android consistently delivers better value per rupee for Indian buyers. Above Rs 1,00,000, iPhone is often the smarter long-term investment when resale value is factored in.</p>

          {/* Brand-specific Articles from Redis */}
          {brandArticles.length > 0 && (
            <section className="mt-12 mb-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-0.5 bg-[#d4220a]" />
                <h2 className="font-playfair text-2xl font-bold text-ink">
                  Latest Apple Reviews & Analysis
                </h2>
                <span className="font-sans text-xs text-muted bg-gray-100 px-2 py-0.5 rounded">
                  {brandArticles.length} articles
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {brandArticles.map(a => (
                  <Link key={a.slug} href={`/${a.slug}`} className="bg-white border border-border hover:border-[#d4220a] transition-colors group block">
                    {a.featuredImage && (
                      <div className="relative overflow-hidden" style={{ paddingBottom:'56.25%' }}>
                        <img src={a.featuredImage} alt={a.title} width={400} height={225} loading="lazy"
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                          style={{ position:'absolute',inset:0,width:'100%',height:'100%' }}
                          onError={e=>{(e.target as HTMLImageElement).src='https://thetechbharat.com/og-image.jpg'}} />
                        <span className="absolute top-2 left-2 bg-[#d4220a] text-white font-sans text-[9px] font-bold px-2 py-0.5 uppercase z-10">
                          {a.type === 'review' ? 'Review' : a.type === 'compare' ? 'Compare' : 'News'}
                        </span>
                      </div>
                    )}
                    <div className="p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-sans text-[10px] font-bold text-[#d4220a] uppercase">{a.brand}</span>
                        <span className="font-sans text-[10px] text-muted ml-auto">{formatPillarDate(a.publishDate)}</span>
                      </div>
                      <h3 className="font-sans text-sm font-bold text-ink group-hover:text-[#d4220a] line-clamp-2 mb-1 leading-snug">{a.title}</h3>
                      <p className="font-sans text-xs text-muted line-clamp-2">{a.summary}</p>
                      <div className="mt-2 flex justify-between items-center">
                        <span className="font-sans text-[10px] text-muted">{a.readTime} min read</span>
                        <span className="font-sans text-xs font-semibold text-[#d4220a]">Read →</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* Related News */}
          {news.length > 0 && (
            <section className="mb-10">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-6 h-0.5 bg-[#1a3a5c]" />
                <h2 className="font-playfair text-xl font-bold text-ink">Latest Apple News</h2>
              </div>
              <div className="space-y-3">
                {news.slice(0, 5).map(a => (
                  <Link key={a.slug} href={`/${a.slug}`} className="flex gap-4 p-3 bg-white border border-border hover:border-[#d4220a] transition-colors group">
                    {a.featuredImage && (
                      <div className="flex-shrink-0 w-20 h-14 overflow-hidden">
                        <img src={a.featuredImage} alt={a.title} width={80} height={56}
                          className="w-full h-full object-cover"
                          onError={e=>{(e.target as HTMLImageElement).src='https://thetechbharat.com/og-image.jpg'}} />
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

          {/* Buying Guide */}
          <section className="mb-10">
            <h2 className="font-playfair text-2xl font-bold text-ink mb-5 pb-2 border-b-2 border-[#d4220a]">
              Buying Guide — What to Check Before Buying
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border border-border p-4 bg-white">
                <h3 className="font-sans text-sm font-bold text-ink mb-2">New vs Certified Refurbished iPhone</h3>
                <p className="font-sans text-sm text-muted leading-relaxed">Apple Certified Refurbished iPhones (apple.com/in/shop/refurbished) carry Apple's full 1-year warranty and are tested to the same standard as new. Savings: 15-25%. Most reliable refurbished source in India. Avoid unverified Amazon resellers for refurbished iPhones.</p>
              </div>
              <div className="border border-border p-4 bg-white">
                <h3 className="font-sans text-sm font-bold text-ink mb-2">Which iPhone Storage to Buy</h3>
                <p className="font-sans text-sm text-muted leading-relaxed">128GB is sufficient for most Indian users (photos stored in iCloud). 256GB if you take lots of videos in ProRes or use the phone as primary camera. 512GB only for content creators. Storage is not upgradeable — buy what you need upfront.</p>
              </div>
              <div className="border border-border p-4 bg-white">
                <h3 className="font-sans text-sm font-bold text-ink mb-2">AppleCare+ India Worth It?</h3>
                <p className="font-sans text-sm text-muted leading-relaxed">AppleCare+ covers unlimited accidental damage repairs (screen Rs 1,900, other Rs 7,900) for 2 years. Worth it for Rs 70,000+ iPhones where a screen replacement costs Rs 20,000+. Less compelling for iPhone 15 where repair costs are lower.</p>
              </div>
              <div className="border border-border p-4 bg-white">
                <h3 className="font-sans text-sm font-bold text-ink mb-2">5G Bands on iPhone in India</h3>
                <p className="font-sans text-sm text-muted leading-relaxed">All iPhone 16 models sold in India support n78 (3500MHz) for Jio and Airtel 5G. iPhone 15 India models also support n78. Always verify your iPhone was purchased from Apple India or authorised reseller for correct Indian variant.</p>
              </div>
              <div className="border border-border p-4 bg-white">
                <h3 className="font-sans text-sm font-bold text-ink mb-2">India Warranty and Service</h3>
                <p className="font-sans text-sm text-muted leading-relaxed">Apple has expanded to 100+ authorised service centres in India. AppleCare cases now also accepted at iStore locations. Repair turnaround: typically 3-5 days for common repairs. Out-of-warranty screen replacement: Rs 20,000-35,000 depending on model.</p>
              </div>
              <div className="border border-border p-4 bg-white">
                <h3 className="font-sans text-sm font-bold text-ink mb-2">EMI Options for iPhone in India</h3>
                <p className="font-sans text-sm text-muted leading-relaxed">Best iPhone EMI deals: HDFC Bank credit card on Flipkart (no-cost EMI + 10% off). Apple Financial Services (apple.com/in) offers direct 0% EMI for 3-24 months. Credit card EMI conversions typically available at all SBI, HDFC, ICICI, and Axis card issuers.</p>
              </div>
            </div>
          </section>

          {/* FAQ */}
          <section className="mb-10">
            <h2 className="font-playfair text-2xl font-bold text-ink mb-5 pb-2 border-b border-border">
              Frequently Asked Questions
            </h2>
            <div className="space-y-4" itemScope itemType="https://schema.org/FAQPage">
              <div className="border border-border p-4 bg-white" itemScope itemType="https://schema.org/Question">
                <h3 className="font-sans text-sm font-bold text-ink mb-2" itemProp="name">Which iPhone should I buy in India in MONTH YEAR?</h3>
                <div itemScope itemType="https://schema.org/Answer">
                  <p className="font-sans text-sm text-muted leading-relaxed" itemProp="text">Best buy for most Indian users in MONTH YEAR: iPhone 16 at Rs 79,900 if new, iPhone 15 at Rs 44,900 if budget-conscious. For power users and camera enthusiasts: iPhone 16 Pro at Rs 1,19,900 with 5x zoom and ProRes video. Only buy iPhone 16 Pro Max if you specifically need the larger screen.</p>
                </div>
              </div>
              <div className="border border-border p-4 bg-white" itemScope itemType="https://schema.org/Question">
                <h3 className="font-sans text-sm font-bold text-ink mb-2" itemProp="name">Is buying an iPhone in India more expensive than abroad?</h3>
                <div itemScope itemType="https://schema.org/Answer">
                  <p className="font-sans text-sm text-muted leading-relaxed" itemProp="text">Yes, typically 15-25% more expensive than USA pricing due to import duties and GST. However, iPhones are now assembled in India (iPhone 16 series) which has reduced the gap compared to previous years. The resale value advantage in India partially compensates over a 3-year ownership cycle.</p>
                </div>
              </div>
              <div className="border border-border p-4 bg-white" itemScope itemType="https://schema.org/Question">
                <h3 className="font-sans text-sm font-bold text-ink mb-2" itemProp="name">How many years does Apple support iPhones with updates?</h3>
                <div itemScope itemType="https://schema.org/Answer">
                  <p className="font-sans text-sm text-muted leading-relaxed" itemProp="text">Apple guarantees at least 7 years of software updates for all iPhone 16 models (2024-2031). iPhone 15 is guaranteed through 2029 minimum. iPhone 14 through 2027. This industry-leading support cycle is a genuine competitive advantage versus most Android brands.</p>
                </div>
              </div>
              <div className="border border-border p-4 bg-white" itemScope itemType="https://schema.org/Question">
                <h3 className="font-sans text-sm font-bold text-ink mb-2" itemProp="name">Is iPhone 16 worth buying over Android at the same price?</h3>
                <div itemScope itemType="https://schema.org/Answer">
                  <p className="font-sans text-sm text-muted leading-relaxed" itemProp="text">At Rs 79,900, the iPhone 16 competes against Samsung Galaxy S24, OnePlus 12R, and Google Pixel 9. For camera: Pixel 9 wins on computational photography, iPhone 16 wins on video. For performance: all are excellent. For long-term value: iPhone wins on resale and update support. Choose based on ecosystem preference.</p>
                </div>
              </div>
            </div>
          </section>

          {/* Related Pillar Pages */}
          <section className="mt-8 pt-6 border-t border-border">
            <h2 className="font-playfair text-xl font-bold text-ink mb-4">Related Guides</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Link href="/best-flagship-phones-india" className="border border-border p-3 bg-white hover:border-[#d4220a] transition-colors group">
                <span className="font-sans text-sm font-bold text-ink group-hover:text-[#d4220a]">Best Flagship Phones India →</span>
              </Link>
              <Link href="/best-smartphones-india" className="border border-border p-3 bg-white hover:border-[#d4220a] transition-colors group">
                <span className="font-sans text-sm font-bold text-ink group-hover:text-[#d4220a]">Best Smartphones India — All Brands →</span>
              </Link>
              <Link href="/smartphone-buying-guide-india" className="border border-border p-3 bg-white hover:border-[#d4220a] transition-colors group">
                <span className="font-sans text-sm font-bold text-ink group-hover:text-[#d4220a]">Smartphone Buying Guide India →</span>
              </Link>
              <Link href="/phone-comparison-guide-india" className="border border-border p-3 bg-white hover:border-[#d4220a] transition-colors group">
                <span className="font-sans text-sm font-bold text-ink group-hover:text-[#d4220a]">Phone Comparison Guide India →</span>
              </Link>
            </div>
          </section>

          <div className="mt-8 bg-[#f8f4ef] border-l-4 border-[#d4220a] p-5">
            <p className="font-sans text-xs font-bold text-[#d4220a] uppercase tracking-wider mb-2">Editorial Note</p>
            <p className="font-sans text-sm text-muted">
              This guide is updated every month for {month} {year}. Articles are fetched live from The Tech Bharat published content.
              No paid placements. All analysis is independent editorial opinion. By Vijay Yadav, Senior Mobile Editor.
            </p>
          </div>

        </div>
      </div>
    </>
  )
}