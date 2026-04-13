// app/best-samsung-phones-india/page.tsx
import { Metadata } from 'next'
import Link from 'next/link'
import { getPillarArticles, formatPillarDate, currentMonthYear } from '@/lib/pillar-utils'

export const revalidate = 3600

export async function generateMetadata(): Promise<Metadata> {
  const { month, year } = currentMonthYear()
  const title = `Best Samsung Smartphones in India — ${month} ${year}`
  return {
    title: `${title} | The Tech Bharat`,
    description: `Best Samsung smartphones in India 2026 — Galaxy S25, A55, M35 ranked for Indian buyers. Camera, battery, 5G and value guide.`,
    alternates: { canonical: 'https://thetechbharat.com/best-samsung-phones-india' },
    openGraph: { title, url: 'https://thetechbharat.com/best-samsung-phones-india', type: 'article' },
  }
}

export default async function BestSamsungPhonesPage() {
  const { month, year } = currentMonthYear()
  const img1 = "https://images.unsplash.com/photo-1610945415114-e0dc2f595f95?auto=format&fit=crop&w=1200&q=80"
  const img2 = "https://images.unsplash.com/photo-1592899677977-9c10002761d5?auto=format&fit=crop&w=1200&q=80"
  const img3 = "https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?auto=format&fit=crop&w=1200&q=80"
  const img4 = "https://images.unsplash.com/photo-1565849904461-04a58ad377e0?auto=format&fit=crop&w=1200&q=80"
  const img5 = "https://images.unsplash.com/photo-1551721434-8b94ddff0e6d?auto=format&fit=crop&w=1200&q=80"

  const articles = await getPillarArticles(['Samsung', 'Galaxy', 'Samsung review', 'Samsung price India'], [], 12, "Samsung")
  const reviews  = articles.filter(a => a.type === 'review' || a.type === 'compare')
  const news     = articles.filter(a => a.type === 'mobile-news')

  return (
    <div className="bg-paper min-h-screen">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://thetechbharat.com' },
          { '@type': 'ListItem', position: 2, name: 'Best Samsung Smartphones in India —', item: 'https://thetechbharat.com/best-samsung-phones-india' },
        ],
      }) }} />

      <div className="max-w-4xl mx-auto px-4 py-10">

        {/* Breadcrumb */}
        <nav className="font-sans text-xs text-muted mb-6 flex items-center gap-2 flex-wrap">
          <Link href="/" className="hover:text-[#d4220a]">Home</Link>
          <span>/</span>
          <Link href="/mobile-news" className="hover:text-[#d4220a]">Mobile News</Link>
          <span>/</span>
          <span className="text-ink">Best Samsung Smartphones in India —</span>
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
            Best Samsung Smartphones in India — {month} {year}
          </h1>
          <p className="font-sans text-base font-semibold text-[#1a3a5c] border-l-4 border-[#1a3a5c] pl-4 mb-2">
            Complete Galaxy lineup ranked for Indian buyers — from budget Galaxy M to flagship S25 Ultra, with honest analysis.
          </p>
        </div>

        {/* Hero image */}
        <div className="mb-8 overflow-hidden">
          <img src={img1} alt="Best Samsung Smartphones in India —" className="w-full h-64 object-cover" loading="eager" />
        </div>


        {/* Intro */}
        <p className="font-body text-lg text-[#2a2a2a] leading-relaxed mb-6">Samsung has dominated the Indian smartphone market for over a decade — not just by volume but by trust. Walk into any mobile store in Patna, Indore, or Coimbatore, and the first brand the shopkeeper recommends is Samsung. That trust has been earned through consistency: consistent camera quality, consistent software updates, and a service network that reaches tier-3 cities where Chinese brands have almost no authorised presence.</p>
        <p className="font-body text-base text-[#2a2a2a] leading-relaxed mb-6">But trust alone does not make a phone worth buying in {month} {year}. Samsung\'s lineup spans from Rs 8,000 to Rs 1,35,000 — and the quality difference between these tiers is dramatic. This guide cuts through the noise and tells you exactly which Samsung phone is worth your money at every budget, based on real-world India use rather than spec sheet comparisons.</p>

        {/* Comparison table */}
        <h2 className="font-playfair text-2xl font-bold text-ink mt-10 mb-4 pb-2 border-b-2 border-[#d4220a]">Samsung Galaxy Lineup — Quick Comparison {month} {year}</h2>
        <div className="overflow-x-auto mb-8">
          <table className="w-full border-collapse text-sm font-sans">
            <thead><tr className="bg-[#1a3a5c] text-white">
              <th className="px-3 py-2 text-left">Model</th>
              <th className="px-3 py-2 text-left">Price</th>
              <th className="px-3 py-2 text-left">Processor</th>
              <th className="px-3 py-2 text-left">Battery</th>
              <th className="px-3 py-2 text-left">Best For</th>
              <th className="px-3 py-2 text-left">Rating</th>
            </tr></thead>
            <tbody>
              {[
                ['Galaxy S25 Ultra','Rs 1,34,999','Snapdragon 8 Elite','5,000mAh','Power users / S Pen','9.4/10'],
                ['Galaxy S25+','Rs 99,999','Snapdragon 8 Elite','4,900mAh','Flagship performance','9.1/10'],
                ['Galaxy S25','Rs 79,999','Snapdragon 8 Elite','4,000mAh','Mainstream flagship','8.8/10'],
                ['Galaxy A55 5G','Rs 39,999','Exynos 1480','5,000mAh','Mid-range sweet spot','8.5/10'],
                ['Galaxy A35 5G','Rs 30,999','Exynos 1380','5,000mAh','Budget mid-range','8.2/10'],
                ['Galaxy M35 5G','Rs 20,999','Exynos 1380','6,000mAh','Battery king','8.0/10'],
                ['Galaxy M15 5G','Rs 13,999','Dimensity 6100+','6,000mAh','Budget 5G','7.6/10'],
              ].map(([model,price,chip,bat,best,rating],i) => (
                <tr key={model} className={i%2===0 ? 'bg-white border-b border-border' : 'bg-gray-50 border-b border-border'}>
                  <td className="px-3 py-2 font-semibold">{model}</td>
                  <td className="px-3 py-2">{price}</td>
                  <td className="px-3 py-2">{chip}</td>
                  <td className="px-3 py-2">{bat}</td>
                  <td className="px-3 py-2">{best}</td>
                  <td className="px-3 py-2 font-bold text-[#d4220a]">{rating}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Image 2 */}
        <div className="my-8 overflow-hidden">
          <img src={img2} alt="Samsung Galaxy smartphones lineup India 2026" className="w-full h-56 object-cover" loading="lazy" />
          <p className="font-sans text-xs text-muted mt-1 text-center">Samsung Galaxy S and A series — the two tiers most Indian buyers choose from</p>
        </div>

        <h2 className="font-playfair text-2xl font-bold text-ink mt-10 mb-4 pb-2 border-b-2 border-[#d4220a]">Galaxy S Series — Is the Flagship Price Justified?</h2>
        <p className="font-body text-base text-[#2a2a2a] leading-relaxed mb-4">The Galaxy S25 series is Samsung\'s best work in years. The shift to Snapdragon 8 Elite for the Indian market (Samsung finally stopped using Exynos on flagships sold in India) makes a meaningful real-world difference — sustained gaming performance is dramatically better, thermal throttling is reduced, and the camera processing pipeline is faster.</p>
        <p className="font-body text-base text-[#2a2a2a] leading-relaxed mb-4">The Galaxy S25 Ultra at Rs 1,34,999 is the only Android phone in India with a built-in S Pen. That is not a gimmick — for note-taking, document signing, and precise editing, it is genuinely useful. The 200MP main camera with 50x Space Zoom delivers results no other phone in India can match for telephoto photography. If you are spending above Rs 1 lakh on a phone, this is the only Android that competes seriously with the iPhone 16 Pro Max.</p>
        <p className="font-body text-base text-[#2a2a2a] leading-relaxed mb-4">The standard Galaxy S25 at Rs 79,999 is harder to recommend. At this price, the Pixel 9 offers better computational photography and cleaner software. The S25 wins on ecosystem integration, Samsung Pay, and the comfort of knowing service centres exist in your city — but raw value per rupee is not Samsung\'s strength at this tier.</p>

        <h3 className="font-playfair text-xl font-bold text-ink mt-8 mb-3">Honest Verdict on S25 Series for Indian Buyers</h3>
        <p className="font-body text-base text-[#2a2a2a] leading-relaxed mb-4">Buy the S25 Ultra if you genuinely use the S Pen and want the best Android camera available in India. Buy the S25+ if you want the Elite chip and large screen without paying Ultra prices. Skip the base S25 — the Galaxy A55 5G at Rs 39,999 delivers 80% of the experience at 50% of the price.</p>

        <h2 className="font-playfair text-2xl font-bold text-ink mt-10 mb-4 pb-2 border-b-2 border-[#d4220a]">Galaxy A Series — The Real Samsung Sweet Spot</h2>
        <p className="font-body text-base text-[#2a2a2a] leading-relaxed mb-4">The Galaxy A55 5G is the phone Samsung should be most proud of in their entire 2024-2025 lineup. At Rs 39,999, it delivers an AMOLED display with 120Hz refresh rate, OIS-stabilised 50MP camera, Exynos 1480 chip, IP67 dust and water resistance, and Samsung\'s commitment to 5 years of OS updates and 5 years of security patches. No Chinese brand at this price offers 5-year update support. This is a phone you can confidently buy knowing it will be supported until 2030.</p>
        <p className="font-body text-base text-[#2a2a2a] leading-relaxed mb-4">The Galaxy A35 5G at Rs 30,999 is very similar — same display, same update promise, slightly slower chip and no OIS. For buyers who primarily use their phone for social media, WhatsApp, and light photography, the Rs 9,000 saving makes the A35 the smarter buy. For anyone who shoots photos regularly, the OIS on the A55 is worth the premium — handheld night shots are noticeably better.</p>

        {/* Image 3 */}
        <div className="my-8 overflow-hidden">
          <img src={img3} alt="Samsung Galaxy A series camera quality India" className="w-full h-56 object-cover" loading="lazy" />
          <p className="font-sans text-xs text-muted mt-1 text-center">Galaxy A series — best value proposition in Samsung\'s Indian lineup</p>
        </div>

        <h2 className="font-playfair text-2xl font-bold text-ink mt-10 mb-4 pb-2 border-b-2 border-[#d4220a]">Galaxy M Series — Built for India\'s Usage Patterns</h2>
        <p className="font-body text-base text-[#2a2a2a] leading-relaxed mb-4">The M series exists because Samsung understood something about Indian users that many phone brands miss: battery life is more important than almost any other spec for a large segment of the market. Commuters spending 2-3 hours daily in trains, students who cannot always find a charger, field workers who need an all-day device — for these buyers, the 6,000mAh battery in the Galaxy M35 5G and M15 5G is the primary purchase driver.</p>
        <p className="font-body text-base text-[#2a2a2a] leading-relaxed mb-4">The Galaxy M35 5G at Rs 20,999 is the standout in this tier. It uses the same Exynos 1380 chip found in the more expensive A35 5G, adds a 6,000mAh battery, and delivers Samsung\'s 4-year update promise. The camera is adequate for everyday use but not a strong suit — this phone prioritises endurance and reliability over photography performance.</p>
        <p className="font-body text-base text-[#2a2a2a] leading-relaxed mb-4">The Galaxy M15 5G at Rs 13,999 is Samsung\'s entry into the budget 5G segment. It uses Dimensity 6100+ — a competent chip for everyday tasks — with the same 6,000mAh battery. The display is only 90Hz and the cameras are average, but the combination of Samsung\'s service network and 4-year update support at this price is genuinely unusual in the Indian market.</p>

        <h2 className="font-playfair text-2xl font-bold text-ink mt-10 mb-4 pb-2 border-b-2 border-[#d4220a]">Samsung vs Competitors — The Honest Comparison</h2>
        <p className="font-body text-base text-[#2a2a2a] leading-relaxed mb-4">Against OnePlus: OnePlus wins on raw performance-per-rupee and charging speed (100W vs Samsung\'s 45W at flagship level). Samsung wins on service network, update longevity, and camera consistency. For buyers in metro cities who value speed: OnePlus. For buyers across India who value reliability: Samsung.</p>
        <p className="font-body text-base text-[#2a2a2a] leading-relaxed mb-4">Against Xiaomi: At budget and mid-range prices, Xiaomi consistently offers more hardware per rupee. The Redmi Note 13 Pro+ beats the Galaxy A35 on specs. But Samsung\'s update promise (5 years vs Xiaomi\'s 2-3 years) and service accessibility make Samsung the better long-term investment for buyers keeping phones 3+ years.</p>
        <p className="font-body text-base text-[#2a2a2a] leading-relaxed mb-4">Against Google Pixel: Pixel 9 series wins on camera intelligence and software purity. Samsung wins on ecosystem breadth, India-specific features, and service availability. Outside the four major metros, Google\'s service network is a real concern for warranty support.</p>

        {/* Image 4 */}
        <div className="my-8 overflow-hidden">
          <img src={img4} alt="Smartphone comparison India 2026 Samsung vs competition" className="w-full h-56 object-cover" loading="lazy" />
          <p className="font-sans text-xs text-muted mt-1 text-center">Samsung\'s real advantage: 3,000+ service centres across India\'s cities and towns</p>
        </div>

        <h2 className="font-playfair text-2xl font-bold text-ink mt-10 mb-4 pb-2 border-b-2 border-[#d4220a]">Samsung\'s 5G Coverage in India — What You Need to Know</h2>
        <p className="font-body text-base text-[#2a2a2a] leading-relaxed mb-4">Every Samsung phone released in India in 2024-2025 that carries a 5G label supports the n78 band (3500MHz) — the primary band used by both Jio and Airtel for 5G in India. This includes the M15 5G, M35 5G, A35 5G, A55 5G, and the full S25 range. One important note: always purchase from Samsung India\'s official channels (samsung.com/in, Samsung Experience Stores, Flipkart official Samsung store) to ensure you receive the Indian variant (SM-E or SM-F prefix model numbers) and not a grey-market international model.</p>

        <h2 className="font-playfair text-2xl font-bold text-ink mt-10 mb-4 pb-2 border-b-2 border-[#d4220a]">Samsung Software Updates — The Real Competitive Advantage</h2>
        <p className="font-body text-base text-[#2a2a2a] leading-relaxed mb-4">Samsung\'s update commitment is now genuinely industry-leading among Android manufacturers: Galaxy S series gets 7 years of OS updates and 7 years of security patches. Galaxy A series gets 5 years of both. Galaxy M and F series get 4 years of each. To put this in perspective: a Galaxy A55 5G purchased today will receive software updates until at least April 2030. The equivalent Redmi or Realme phone at the same price will likely stop receiving OS updates by 2026-2027.</p>
        <p className="font-body text-base text-[#2a2a2a] leading-relaxed mb-4">This matters for two reasons. First, security: older Android versions accumulate unpatched vulnerabilities. Second, resale value: a Samsung phone that still runs the latest Android version in 2028 will command a significantly better resale price than a competing brand\'s phone that stopped at Android 15.</p>

        {/* Image 5 */}
        <div className="my-8 overflow-hidden">
          <img src={img5} alt="Samsung One UI software India 2026" className="w-full h-56 object-cover" loading="lazy" />
          <p className="font-sans text-xs text-muted mt-1 text-center">One UI 7 — Samsung\'s most refined Android skin, now with Galaxy AI features</p>
        </div>

        <h2 className="font-playfair text-2xl font-bold text-ink mt-10 mb-4 pb-2 border-b-2 border-[#d4220a]">Buying Guide — Which Samsung Should You Buy?</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {[
            ['Under Rs 15,000','Galaxy M15 5G — 6,000mAh battery, Samsung reliability, n78 5G support, 4 years of updates at an accessible price point.'],
            ['Rs 15,000 to Rs 25,000','Galaxy M35 5G — same Exynos 1380 as the A35, more battery (6,000mAh), strong performer for daily use and commuters.'],
            ['Rs 25,000 to Rs 35,000','Galaxy A35 5G — AMOLED 120Hz display, 5-year updates, solid camera. Best Samsung for buyers who want mid-range quality long-term.'],
            ['Rs 35,000 to Rs 50,000','Galaxy A55 5G — adds OIS, IP67 rating, and slightly faster chip vs A35. Worth Rs 9,000 premium if you shoot photos regularly.'],
            ['Rs 50,000 to Rs 90,000','Galaxy S25 — Snapdragon 8 Elite, premium build, 7-year updates. Best if you want flagship experience without Ultra pricing.'],
            ['Above Rs 1,00,000','Galaxy S25 Ultra — S Pen, 200MP camera, best battery life, titanium build. Only buy if you specifically need S Pen functionality.'],
          ].map(([budget, rec]) => (
            <div key={budget} className="border border-border p-4 bg-white">
              <h3 className="font-sans text-sm font-bold text-[#1a3a5c] mb-2">{budget}</h3>
              <p className="font-sans text-sm text-muted leading-relaxed">{rec}</p>
            </div>
          ))}
        </div>

        <h2 className="font-playfair text-2xl font-bold text-ink mt-10 mb-5 pb-2 border-b border-border">Frequently Asked Questions</h2>
        <div className="space-y-4 mb-10">
          {[
            ['Which Samsung phone has the best camera in India?','The Galaxy S25 Ultra has the best camera system — 200MP main sensor with 50x optical-quality zoom. For mid-range, the Galaxy A55 5G offers the best Samsung camera under Rs 50,000 with OIS and consistent colour science.'],
            ['Is Samsung better than iPhone for Indian buyers?','For most Indian buyers: Samsung offers better value across all price ranges. iPhones retain resale value better but cost significantly more. Samsung wins on service availability outside metros and on mid-range value. iPhone wins on 7-year support (matching Samsung now) and video quality.'],
            ['Which Samsung phone has the longest battery life?','Galaxy M35 5G and M15 5G both carry 6,000mAh batteries — the highest in Samsung\'s current Indian lineup. Galaxy S25 Ultra has a 5,000mAh battery which, combined with efficiency improvements, delivers excellent all-day life at the flagship tier.'],
            ['Does Samsung give GST invoice in India?','Yes — purchasing from samsung.com/in, Samsung Experience Stores, or authorised resellers on Flipkart and Amazon always provides a valid GST invoice. This is important for warranty claims and business purchase tax credit.'],
            ['What is Samsung\'s warranty in India?','Standard 1-year manufacturer warranty across all Samsung phones sold through official channels in India. Samsung Care+ provides extended coverage and accidental damage protection for Rs 999-2,999 per year depending on the model.'],
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
              ['Best Smartphones India — All Brands','/best-smartphones-india'],
              ['Best Budget Phones India','/best-budget-phones-india'],
              ['Smartphone Buying Guide India','/smartphone-buying-guide-india'],
              ['Best Camera Phones India','/best-camera-phones-india'],
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