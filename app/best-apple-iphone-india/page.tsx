// app/best-apple-iphone-india/page.tsx
import { Metadata } from 'next'
import Link from 'next/link'
import { getPillarArticles, formatPillarDate, currentMonthYear } from '@/lib/pillar-utils'

export const revalidate = 3600

export async function generateMetadata(): Promise<Metadata> {
  const { month, year } = currentMonthYear()
  const title = `Best iPhones in India — ${month} ${year}`
  return {
    title: `${title} | The Tech Bharat`,
    description: `Best iPhones to buy in India 2026 — iPhone 16 Pro, iPhone 16, iPhone 15 ranked with India pricing, value analysis and honest verdict.`,
    alternates: { canonical: 'https://thetechbharat.com/best-apple-iphone-india' },
    openGraph: { title, url: 'https://thetechbharat.com/best-apple-iphone-india', type: 'article' },
  }
}

export default async function BestAppleIphonePage() {
  const { month, year } = currentMonthYear()
  const img1 = "https://images.unsplash.com/photo-1510557880182-3d4d3cad945a?auto=format&fit=crop&w=1200&q=80"
  const img2 = "https://images.unsplash.com/photo-1591815793793-e37bc6e55783?auto=format&fit=crop&w=1200&q=80"
  const img3 = "https://images.unsplash.com/photo-1621111580174-1d8f8e24b474?auto=format&fit=crop&w=1200&q=80"
  const img4 = "https://images.unsplash.com/photo-1523966211575-eb4a01e7dd51?auto=format&fit=crop&w=1200&q=80"
  const img5 = "https://images.unsplash.com/photo-1580910051074-3eb694886505?auto=format&fit=crop&w=1200&q=80"

  const articles = await getPillarArticles(['Apple', 'iPhone', 'iOS', 'iPhone review', 'iPhone India price'], [], 12, "Apple")
  const reviews  = articles.filter(a => a.type === 'review' || a.type === 'compare')
  const news     = articles.filter(a => a.type === 'mobile-news')

  return (
    <div className="bg-paper min-h-screen">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://thetechbharat.com' },
          { '@type': 'ListItem', position: 2, name: 'Best iPhones in India —', item: 'https://thetechbharat.com/best-apple-iphone-india' },
        ],
      }) }} />

      <div className="max-w-4xl mx-auto px-4 py-10">

        {/* Breadcrumb */}
        <nav className="font-sans text-xs text-muted mb-6 flex items-center gap-2 flex-wrap">
          <Link href="/" className="hover:text-[#d4220a]">Home</Link>
          <span>/</span>
          <Link href="/mobile-news" className="hover:text-[#d4220a]">Mobile News</Link>
          <span>/</span>
          <span className="text-ink">Best iPhones in India —</span>
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
            Best iPhones in India — {month} {year}
          </h1>
          <p className="font-sans text-base font-semibold text-[#1a3a5c] border-l-4 border-[#1a3a5c] pl-4 mb-2">
            Complete iPhone buying guide for Indian buyers — pricing, resale value, service reality and which model actually makes sense.
          </p>
        </div>

        {/* Hero image */}
        <div className="mb-8 overflow-hidden">
          <img src={img1} alt="Best iPhones in India —" className="w-full h-64 object-cover" loading="eager" />
        </div>


        <p className="font-body text-lg text-[#2a2a2a] leading-relaxed mb-6">Buying an iPhone in India in {month} {year} is a decision that requires more thought than in any other market. Import duties, GST, and Apple\'s India pricing premium mean you pay 20-30% more than buyers in the USA for the same phone. And yet, iPhone sales in India keep growing — because for many buyers, the combination of resale value, ecosystem, and long-term software support makes the premium genuinely justifiable.</p>
        <p className="font-body text-base text-[#2a2a2a] leading-relaxed mb-6">This guide is written specifically for Indian buyers in {month} {year}: which iPhone to buy, where to buy it, how much you should actually pay, and which models to avoid. No marketing language — just practical guidance based on what makes financial and practical sense for life in India.</p>
 {/* ✅ ADDED: BUYER INTENT BLOCK */}
<div className="bg-[#f8f4ef] border-l-4 border-[#d4220a] p-5 mb-8">
  <h3 className="font-bold text-sm mb-2">Who should buy an iPhone in India?</h3>
  <p className="text-sm text-[#2a2a2a]">
    iPhones make the most sense for users who plan to use their phone for 3–5 years, value long-term software updates, and want strong resale value. If you use a MacBook, AirPods, or iPad, the ecosystem advantage becomes even more meaningful.
  </p>

  <h3 className="font-bold text-sm mt-4 mb-2">Who should NOT buy an iPhone?</h3>
  <p className="text-sm text-[#2a2a2a]">
    If you frequently transfer files, need customization, or want the best specs for price, Android phones offer better flexibility and value in most price segments.
  </p>

  <h3 className="font-bold text-sm mt-4 mb-2">Final Verdict</h3>
  <p className="text-sm text-[#2a2a2a]">
    In {month} {year}, iPhones are expensive in India, but when you consider resale value, software support, and ecosystem benefits, they can be a smarter long-term investment than most Android phones.
  </p>
</div>
        <h2 className="font-playfair text-2xl font-bold text-ink mt-10 mb-4 pb-2 border-b-2 border-[#d4220a]">Complete iPhone Lineup — India Pricing {month} {year}</h2>
        {/* ✅ ADDED: INTERNAL LINK BOOST */}
<p className="font-sans text-sm text-muted mb-6">
  If you're comparing iPhones with Android options, check our{' '}
  <Link href="/best-smartphones-india" className="text-[#d4220a] font-semibold hover:underline">
    Best Smartphones in India
  </Link>{' '}
  and{' '}
  <Link href="/smartphone-buying-guide-india" className="text-[#d4220a] font-semibold hover:underline">
    complete buying guide
  </Link>{' '}
  for a broader comparison.
</p>
        <div className="overflow-x-auto mb-8">
          <table className="w-full border-collapse text-sm font-sans">
            <thead><tr className="bg-[#1a3a5c] text-white">
              <th className="px-3 py-2 text-left">Model</th>
              <th className="px-3 py-2 text-left">India Price</th>
              <th className="px-3 py-2 text-left">Chip</th>
              <th className="px-3 py-2 text-left">Camera</th>
              <th className="px-3 py-2 text-left">Verdict</th>
            </tr></thead>
            <tbody>
              {[
                ['iPhone 16 Pro Max','Rs 1,59,900','A18 Pro','48MP + 5x periscope','Best iPhone, period'],
                ['iPhone 16 Pro','Rs 1,19,900','A18 Pro','48MP + 5x telephoto','Best for most Pro buyers'],
                ['iPhone 16','Rs 79,900','A18','48MP main','Mid-range Apple pick'],
                ['iPhone 16e','Rs 59,900','A16 Bionic','48MP main','Budget Apple entry'],
                ['iPhone 15 (refurb)','Rs 44,900+','A16 Bionic','48MP main','Best value Apple buy'],
              ].map(([model,price,chip,cam,verdict],i) => (
                <tr key={model} className={i%2===0 ? 'bg-white border-b border-border' : 'bg-gray-50 border-b border-border'}>
                  <td className="px-3 py-2 font-semibold">{model}</td>
                  <td className="px-3 py-2">{price}</td>
                  <td className="px-3 py-2">{chip}</td>
                  <td className="px-3 py-2">{cam}</td>
                  <td className="px-3 py-2 text-[#d4220a] font-medium">{verdict}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Image 2 */}
        <div className="my-8 overflow-hidden">
          <img src={img2} alt="iPhone lineup India 2026" className="w-full h-56 object-cover" loading="lazy" />
          <p className="font-sans text-xs text-muted mt-1 text-center">iPhone 16 series — now assembled in India, reducing import duty impact</p>
        </div>

        <h2 className="font-playfair text-2xl font-bold text-ink mt-10 mb-4 pb-2 border-b-2 border-[#d4220a]">Why iPhones Cost More in India — And Whether That Gap Has Narrowed</h2>
        <p className="font-body text-base text-[#2a2a2a] leading-relaxed mb-4">The honest answer: yes, slightly. iPhones assembled in India (iPhone 15, iPhone 16, iPhone 16e) carry lower import duties than fully imported models because of government PLI (Production Linked Incentive) scheme benefits. The iPhone 16 at Rs 79,900 is approximately 15-18% more expensive than in the USA after currency conversion — down from the 25-30% premium of a few years ago.</p>
        <p className="font-body text-base text-[#2a2a2a] leading-relaxed mb-4">But the resale value equation changes everything. An iPhone 16 bought at Rs 79,900 today will sell for Rs 45,000-50,000 after 2 years. A Samsung Galaxy S25 at the same price will sell for Rs 35,000-40,000. A Redmi or Realme phone at Rs 25,000 will barely fetch Rs 8,000-10,000 after 2 years. Factor in resale value and the real cost of iPhone ownership over 3 years is often competitive with premium Android alternatives.</p>

        <h2 className="font-playfair text-2xl font-bold text-ink mt-10 mb-4 pb-2 border-b-2 border-[#d4220a]">iPhone 16 Pro — The Right Buy for Most Indian Buyers Who Want Pro</h2>
        <p className="font-body text-base text-[#2a2a2a] leading-relaxed mb-4">The iPhone 16 Pro at Rs 1,19,900 is the recommendation for Indian buyers who want the full Apple Pro experience. The A18 Pro chip, 5x optical periscope zoom, ProRes video recording, Camera Control button, and 7-year update commitment are all genuinely compelling. The titanium build means it will look new three years from now if you put it in a case.</p>
        <p className="font-body text-base text-[#2a2a2a] leading-relaxed mb-4">Is it worth Rs 40,000 more than the iPhone 16? For the camera alone — particularly if you shoot video — yes. The ProRes capability and the periscope zoom together represent a meaningful leap. If you primarily use your phone for photos, calls, and apps rather than video creation, the standard iPhone 16 is sufficient.</p>

        {/* Image 3 */}
        <div className="my-8 overflow-hidden">
          <img src={img3} alt="iPhone camera quality India photography 2026" className="w-full h-56 object-cover" loading="lazy" />
          <p className="font-sans text-xs text-muted mt-1 text-center">iPhone 16 Pro camera — still the benchmark for video quality in India</p>
        </div>

        <h2 className="font-playfair text-2xl font-bold text-ink mt-10 mb-4 pb-2 border-b-2 border-[#d4220a]">iPhone 15 Certified Refurbished — The Smartest Buy in India</h2>
        <p className="font-body text-base text-[#2a2a2a] leading-relaxed mb-4">Apple\'s Certified Refurbished programme (available at apple.com/in/shop/refurbished) is one of the best-kept secrets for Indian buyers. Certified refurbished iPhones are tested to the same standards as new, come with a 1-year Apple warranty, and cost 15-25% less. The iPhone 15 in certified refurbished condition at Rs 44,900-49,900 is a genuinely outstanding deal in {month} {year}.</p>
        <p className="font-body text-base text-[#2a2a2a] leading-relaxed mb-4">You get: A16 Bionic chip (same as iPhone 16e), Dynamic Island, USB-C, 48MP camera, and iOS updates guaranteed until at least 2029. For a first-time iPhone buyer or someone upgrading from an older Android, this is the purchase that makes the most financial sense. Avoid non-Apple refurbished sellers on Amazon and Flipkart — the lack of Apple certification is a genuine warranty risk.</p>

        <h2 className="font-playfair text-2xl font-bold text-ink mt-10 mb-4 pb-2 border-b-2 border-[#d4220a]">iOS vs Android — The Real Differences That Matter in India</h2>
        <p className="font-body text-base text-[#2a2a2a] leading-relaxed mb-4">The iOS vs Android debate is often framed as preference. But there are concrete differences that specifically affect Indian users. UPI apps (PhonePe, GPay, Paytm) all work seamlessly on iPhone — the days of UPI issues on iOS are gone. Banking apps generally work well, though some government-sector bank apps have historically had iOS delays for new feature updates.</p>
        <p className="font-body text-base text-[#2a2a2a] leading-relaxed mb-4">File management is genuinely inferior on iPhone. If you regularly transfer files via USB, work with documents from multiple sources, or use your phone as a portable storage device — Android is more flexible. If you primarily work within apps (WhatsApp, Instagram, email, streaming) iPhone\'s file management limitations are invisible in daily use.</p>
        <p className="font-body text-base text-[#2a2a2a] leading-relaxed mb-4">The ecosystem argument has real weight only if you own other Apple devices. iPhone + MacBook + AirPods is a genuinely seamless experience that Android cannot fully replicate. iPhone alone — without other Apple products — delivers most of the iOS experience but loses the ecosystem integration that justifies the premium for many buyers.</p>

        {/* Image 4 */}
        <div className="my-8 overflow-hidden">
          <img src={img4} alt="iPhone Apple ecosystem India MacBook AirPods" className="w-full h-56 object-cover" loading="lazy" />
          <p className="font-sans text-xs text-muted mt-1 text-center">Apple ecosystem integration — meaningful only if you own multiple Apple devices</p>
        </div>

        <h2 className="font-playfair text-2xl font-bold text-ink mt-10 mb-4 pb-2 border-b-2 border-[#d4220a]">Apple Service in India — What You Need to Know Before Buying</h2>
        <p className="font-body text-base text-[#2a2a2a] leading-relaxed mb-4">Apple has over 100 authorised service providers in India as of {month} {year}, concentrated in major metros and state capitals. Outside these areas, Apple service can be a genuine challenge — repairs requiring parts can take 5-10 days even in tier-2 cities. If you live in a smaller city and are considering your first iPhone, factor in this service reality. Samsung\'s 3,000+ centres across India remain a concrete advantage for buyers outside metros.</p>
        <p className="font-body text-base text-[#2a2a2a] leading-relaxed mb-4">AppleCare+ is worth serious consideration for iPhones above Rs 70,000. It covers unlimited accidental damage repairs (screen: Rs 1,900 per incident, other damage: Rs 7,900 per incident) for 2 years. Without it, an iPhone 16 Pro screen replacement costs Rs 22,000-25,000 out of warranty.</p>

        {/* Image 5 */}
        <div className="my-8 overflow-hidden">
          <img src={img5} alt="Apple Store India service centre" className="w-full h-56 object-cover" loading="lazy" />
          <p className="font-sans text-xs text-muted mt-1 text-center">Apple India service — expanding but still concentrated in major cities</p>
        </div>

        <h2 className="font-playfair text-2xl font-bold text-ink mt-10 mb-4 pb-2 border-b-2 border-[#d4220a]">Best Way to Buy iPhone in India — Getting the Best Price</h2>
        <p className="font-body text-base text-[#2a2a2a] leading-relaxed mb-4">The best iPhone deals in India consistently come from HDFC Bank credit card + Flipkart combinations during sale events. No-cost EMI on Flipkart with HDFC often stacks with Rs 5,000-8,000 instant discounts. Apple Financial Services (apple.com/in) offers direct 0% EMI for 6-24 months but rarely has additional discounts. Apple Store app sales (Great Indian Festival, End of Season) sometimes offer Rs 5,000 education pricing for students with valid ID.</p>

        <h2 className="font-playfair text-2xl font-bold text-ink mt-10 mb-5 pb-2 border-b border-border">Frequently Asked Questions</h2>
        <div className="space-y-4 mb-10">
          {[
            ['Which iPhone should I buy in India in ' + '{month} {year}' + '?','For most buyers: iPhone 16 (Rs 79,900) if budget allows, iPhone 15 Certified Refurbished (Rs 44,900) for best value. For Pro users: iPhone 16 Pro. For maximum iPhone: iPhone 16 Pro Max.'],
            ['Is it worth buying iPhone in India vs abroad?','Buying in India is 15-20% more expensive than the USA. The advantage: Indian warranty, Apple India support, and no customs complications. If someone is travelling abroad, buying there saves money but you must check warranty applicability in India.'],
            ['Which iPhone has 5G support for Jio and Airtel?','All iPhone 16 series, iPhone 15 series, and iPhone 14 series sold in India support n78 (3500MHz) 5G — the primary band for both Jio and Airtel. Always ensure you purchase the Indian model (A3290, A3291 model numbers for iPhone 16).'],
            ['How many years will Apple support my iPhone?','Apple guarantees at least 7 years of software updates for iPhone 16 models. iPhone 15 is supported until at least 2029. This industry-leading support cycle is a core part of iPhone\'s value proposition over Android.'],
            ['Should I buy iPhone 16 or wait for iPhone 17?','iPhone 17 is expected in September 2025. If you need a phone now, iPhone 16 is an excellent buy. If you can wait 5-6 months and are near the upgrade cycle, the iPhone 17 will bring camera improvements and rumoured design changes.'],
          ].map(([q,a]) => (
            <div key={q} className="border border-border p-4 bg-white">
              <h3 className="font-sans text-sm font-bold text-ink mb-2">{q}</h3>
              <p className="font-sans text-sm text-muted leading-relaxed">{a}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 pt-6 border-t border-border">
          <h2 className="font-playfair text-xl font-bold text-ink mb-4">Related Buying Guides</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[
              ['Best Flagship Phones India','/best-flagship-phones-india'],
              ['Best Smartphones India','/best-smartphones-india'],
              ['Smartphone Buying Guide India','/smartphone-buying-guide-india'],
              ['Phone Comparison Guide','/phone-comparison-guide-india'],
            ].map(([label,href]) => (
              <Link key={href} href={href} className="border border-border p-3 bg-white hover:border-[#d4220a] transition-colors group">
                <span className="font-sans text-sm font-bold text-ink group-hover:text-[#d4220a]">{label} →</span>
              </Link>
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
{/* ✅ ADDED: FINAL BUYING ADVICE */}
<div className="mt-10 border-t pt-6">
  <h2 className="font-playfair text-xl font-bold text-ink mb-3">Final Buying Advice</h2>
  <p className="font-sans text-sm text-muted leading-relaxed">
    The best iPhone for you depends on how long you plan to use it. If you want maximum longevity, the iPhone 16 or 16 Pro is the safest choice. If value matters most, a certified refurbished iPhone 15 offers the best balance of price and performance in India. Avoid older models without USB-C or long update support — they may seem cheaper today but cost more over time.
  </p>
</div>
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