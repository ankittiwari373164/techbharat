// app/best-oneplus-phones-india/page.tsx
import { Metadata } from 'next'
import Link from 'next/link'
import { getPillarArticles, formatPillarDate, currentMonthYear } from '@/lib/pillar-utils'

export const revalidate = 3600

export async function generateMetadata(): Promise<Metadata> {
  const { month, year } = currentMonthYear()
  const title = `Best OnePlus Phones in India — ${month} ${year}`
  return {
    title: `${title} | The Tech Bharat`,
    description: `Best OnePlus phones in India 2026 — OnePlus 13, Nord 4, Nord CE ranked with honest performance, charging speed and value analysis.`,
    alternates: { canonical: 'https://thetechbharat.com/best-oneplus-phones-india' },
    openGraph: { title, url: 'https://thetechbharat.com/best-oneplus-phones-india', type: 'article' },
  }
}

export default async function BestOnePlusPhonesPage() {
  const { month, year } = currentMonthYear()
  const img1 = "https://images.unsplash.com/photo-1585060544812-6b45742d762f?auto=format&fit=crop&w=1200&q=80"
  const img2 = "https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&w=1200&q=80"
  const img3 = "https://images.unsplash.com/photo-1598327105854-f7e98b73ae8d?auto=format&fit=crop&w=1200&q=80"
  const img4 = "https://images.unsplash.com/photo-1601784551446-a21f28a2e7a0?auto=format&fit=crop&w=1200&q=80"
  const img5 = "https://images.unsplash.com/photo-1605236453806-6ff36851218e?auto=format&fit=crop&w=1200&q=80"

  const articles = await getPillarArticles(['OnePlus', 'Nord', 'OxygenOS', 'OnePlus review', 'OnePlus India'], [], 12, "OnePlus")
  const reviews  = articles.filter(a => a.type === 'review' || a.type === 'compare')
  const news     = articles.filter(a => a.type === 'mobile-news')

  return (
    <div className="bg-paper min-h-screen">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://thetechbharat.com' },
          { '@type': 'ListItem', position: 2, name: 'Best OnePlus Phones in India —', item: 'https://thetechbharat.com/best-oneplus-phones-india' },
        ],
      }) }} />

      <div className="max-w-4xl mx-auto px-4 py-10">

        {/* Breadcrumb */}
        <nav className="font-sans text-xs text-muted mb-6 flex items-center gap-2 flex-wrap">
          <Link href="/" className="hover:text-[#d4220a]">Home</Link>
          <span>/</span>
          <Link href="/mobile-news" className="hover:text-[#d4220a]">Mobile News</Link>
          <span>/</span>
          <span className="text-ink">Best OnePlus Phones in India —</span>
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
            Best OnePlus Phones in India — {month} {year}
          </h1>
          <p className="font-sans text-base font-semibold text-[#1a3a5c] border-l-4 border-[#1a3a5c] pl-4 mb-2">
            OnePlus lineup for Indian buyers — which models deliver the original value promise and which are just brand premium.
          </p>
        </div>

        {/* Hero image */}
        <div className="mb-8 overflow-hidden">
          <img src={img1} alt="Best OnePlus Phones in India —" className="w-full h-64 object-cover" loading="eager" />
        </div>


        <p className="font-body text-lg text-[#2a2a2a] leading-relaxed mb-6">OnePlus built its Indian reputation on a single promise: flagship performance at mid-range prices. In {month} {year}, that promise still largely holds — but the brand has evolved. The OnePlus that launched the 3T for Rs 29,999 in 2016 now sells phones from Rs 17,000 (Nord CE 4 Lite) to Rs 70,000 (OnePlus 13). Understanding which tier still delivers the original value proposition, and which is just brand premium, is the purpose of this guide.</p>
        <p className="font-body text-base text-[#2a2a2a] leading-relaxed mb-6">The short version: OnePlus 13 at Rs 69,999 is genuinely excellent. Nord 4 at Rs 34,999 hits the old OnePlus sweet spot. Nord CE 4 Lite at Rs 19,999 is adequate but not special. Skip the Nord CE 4 base at Rs 24,999 — the Nord 4 at Rs 10,000 more is a significantly better phone.</p>
{/* ✅ ADDED: BUYER INTENT BLOCK */}
<div className="bg-[#f8f4ef] border-l-4 border-[#d4220a] p-5 mb-8">
  <h3 className="font-bold text-sm mb-2">Who should buy a OnePlus phone?</h3>
  <p className="text-sm text-[#2a2a2a]">
    OnePlus phones are ideal for users who want fast charging, smooth performance, and a clean software experience without heavy bloatware.
  </p>

  <h3 className="font-bold text-sm mt-4 mb-2">Who should NOT buy a OnePlus phone?</h3>
  <p className="text-sm text-[#2a2a2a]">
    If you prioritise long-term updates, resale value, or a wide service network in smaller cities, Samsung or Apple may be a better choice.
  </p>

  <h3 className="font-bold text-sm mt-4 mb-2">Final Verdict</h3>
  <p className="text-sm text-[#2a2a2a]">
    In {month} {year}, OnePlus still delivers strong value in India — but only in specific models like the Nord 4 and OnePlus 13. Choosing the right model matters more than choosing the brand.
  </p>
</div>
        <h2 className="font-playfair text-2xl font-bold text-ink mt-10 mb-4 pb-2 border-b-2 border-[#d4220a]">OnePlus Lineup — Complete India Comparison {month} {year}</h2>
        {/* ✅ ADDED: INTERNAL LINK BOOST */}
<p className="font-sans text-sm text-muted mb-6">
  For broader comparisons across all brands, check our{' '}
  <Link href="/best-smartphones-india" className="text-[#d4220a] font-semibold hover:underline">
    Best Smartphones in India
  </Link>{' '}
  and{' '}
  <Link href="/smartphone-buying-guide-india" className="text-[#d4220a] font-semibold hover:underline">
    complete buying guide
  </Link>.
</p>
        <div className="overflow-x-auto mb-8">
          <table className="w-full border-collapse text-sm font-sans">
            <thead><tr className="bg-[#1a3a5c] text-white">
              <th className="px-3 py-2 text-left">Model</th><th className="px-3 py-2 text-left">Price</th><th className="px-3 py-2 text-left">Chip</th><th className="px-3 py-2 text-left">Charging</th><th className="px-3 py-2 text-left">Updates</th><th className="px-3 py-2 text-left">Rating</th>
            </tr></thead>
            <tbody>
              {[
                ['OnePlus 13','Rs 69,999','SD 8 Elite','100W + 50W wireless','4yr OS / 5yr security','9.2/10'],
                ['OnePlus 13R','Rs 44,999','SD 8 Gen 2','80W wired','4yr OS','8.7/10'],
                ['Nord 4','Rs 34,999','SD 7+ Gen 3','100W wired','3yr OS','8.4/10'],
                ['Nord CE 4','Rs 24,999','SD 7s Gen 3','100W wired','2yr OS','7.9/10'],
                ['Nord CE 4 Lite','Rs 19,999','SD 695','80W wired','2yr OS','7.5/10'],
              ].map(([m,p,c,ch,u,r],i) => (
                <tr key={m} className={i%2===0?'bg-white border-b border-border':'bg-gray-50 border-b border-border'}>
                  <td className="px-3 py-2 font-semibold">{m}</td><td className="px-3 py-2">{p}</td><td className="px-3 py-2">{c}</td><td className="px-3 py-2">{ch}</td><td className="px-3 py-2">{u}</td><td className="px-3 py-2 font-bold text-[#d4220a]">{r}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="my-8 overflow-hidden"><img src={img2} alt="OnePlus 13 India 2026 review" className="w-full h-56 object-cover" loading="lazy" /><p className="font-sans text-xs text-muted mt-1 text-center">OnePlus 13 — 100W charging and Hasselblad tuned cameras at Rs 69,999</p></div>

        <h2 className="font-playfair text-2xl font-bold text-ink mt-10 mb-4 pb-2 border-b-2 border-[#d4220a]">OnePlus 13 — Why It Deserves Consideration Over Samsung S25</h2>
        <p className="font-body text-base text-[#2a2a2a] leading-relaxed mb-4">The OnePlus 13 at Rs 69,999 runs Snapdragon 8 Elite — the same chip as the Samsung Galaxy S25 (Rs 79,999) and Galaxy S25+ (Rs 99,999). It also has 100W wired charging and 50W wireless charging, a 6,000mAh battery, and a Hasselblad-tuned triple 50MP camera system. The price advantage of Rs 10,000-30,000 over Samsung flagships with equivalent performance is real.</p>
        <p className="font-body text-base text-[#2a2a2a] leading-relaxed mb-4">What Samsung wins on: 7 years of updates (OnePlus 13 gets 4 years OS), wider service network in smaller cities, better resale value. What OnePlus wins on: charging speed (100W vs Samsung\'s 45W), price, and gaming performance consistency. For buyers in metro cities or large tier-2 cities where OnePlus service centres exist: the 13 is the better value flagship.</p>

        <h2 className="font-playfair text-2xl font-bold text-ink mt-10 mb-4 pb-2 border-b-2 border-[#d4220a]">OnePlus Charging Speed — What 80W and 100W Actually Mean in Daily Use</h2>
        <p className="font-body text-base text-[#2a2a2a] leading-relaxed mb-4">OnePlus SUPERVOOC 100W charging fills the OnePlus 13 from 0% to 50% in approximately 18 minutes. Full charge: 26 minutes. The Nord CE 4 and Nord 4 with 100W hit full charge in 28-32 minutes. The Nord CE 4 Lite with 80W takes about 43 minutes. These are consistent, independently verified numbers — not marketing claims.</p>
        <p className="font-body text-base text-[#2a2a2a] leading-relaxed mb-4">Practically: plug in during a 30-minute chai break and you gain 50-60% battery. This changes charging anxiety completely. Samsung\'s fastest charging is 45W (S25 Ultra), which takes about 65 minutes for a full charge from flat. For Indian users with busy schedules and unreliable power availability, OnePlus\'s fast charging is a genuine lifestyle advantage.</p>

        <div className="my-8 overflow-hidden"><img src={img3} alt="OnePlus fast charging SUPERVOOC India" className="w-full h-56 object-cover" loading="lazy" /><p className="font-sans text-xs text-muted mt-1 text-center">SUPERVOOC 100W — 50% charge in 18 minutes, the fastest mainstream charging in India</p></div>

        <h2 className="font-playfair text-2xl font-bold text-ink mt-10 mb-4 pb-2 border-b-2 border-[#d4220a]">OxygenOS in {month} {year} — Better Than Its Reputation Suggests</h2>
        <p className="font-body text-base text-[#2a2a2a] leading-relaxed mb-4">OxygenOS 15 (based on ColorOS 15) gets unfair criticism from OnePlus loyalists who remember the near-stock Android days of OxygenOS 10-11. The current version is a polished, feature-rich Android skin — not as clean as stock Pixel Android, not as bloated as older MIUI. It sits comfortably between these extremes.</p>
        <p className="font-body text-base text-[#2a2a2a] leading-relaxed mb-4">Key India-relevant features: Smart Calls (AI spam filtering), Work-Life Balance mode (scheduled app restrictions), Zen Mode (digital wellbeing without being annoying about it), and OnePlus-exclusive gaming modes. Pre-installed bloatware is minimal — far less than Samsung\'s One UI or Realme\'s realme UI.</p>

        <h2 className="font-playfair text-2xl font-bold text-ink mt-10 mb-4 pb-2 border-b-2 border-[#d4220a]">OnePlus Service Network in India — The Honest Assessment</h2>
        <p className="font-body text-base text-[#2a2a2a] leading-relaxed mb-4">OnePlus has 200+ dedicated service centres and 3,000+ partner service points in India as of {month} {year}. This is a significant improvement from 2021-2022 when service was a legitimate complaint. Coverage in metros and large cities is now good. Tier-2 and tier-3 cities: improving but not yet at Samsung levels. If you live in a city with a population below 5 lakh and don\'t have an OnePlus service centre nearby, Samsung remains the safer warranty choice.</p>

        <div className="my-8 overflow-hidden"><img src={img4} alt="Nord 4 OnePlus India mid range 2026" className="w-full h-56 object-cover" loading="lazy" /><p className="font-sans text-xs text-muted mt-1 text-center">Nord 4 — 100W charging at Rs 34,999, the best value proposition in OnePlus\'s current lineup</p></div>

        <h2 className="font-playfair text-2xl font-bold text-ink mt-10 mb-4 pb-2 border-b-2 border-[#d4220a]">Which OnePlus to Buy — Budget-Wise Recommendations</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {[
            ['Under Rs 20,000','Nord CE 4 Lite — 80W charging on a Snapdragon 695. Adequate daily driver, good for budget buyers who want OnePlus brand reliability.'],
            ['Rs 20,000 to Rs 30,000','Nord CE 4 — 100W charging, Snapdragon 7s Gen 3. Better gaming and faster charging than the Lite. The 100W at this price point is the primary reason to choose this over Redmi.'],
            ['Rs 30,000 to Rs 40,000','Nord 4 — the best OnePlus value phone in {month} {year}. Snapdragon 7+ Gen 3, 100W charging, metal unibody. This is where OnePlus delivers the best performance-per-rupee.'],
            ['Rs 40,000 to Rs 50,000','OnePlus 13R — Snapdragon 8 Gen 2, 80W charging, 5,500mAh battery. Excellent for gaming and power users who can\'t afford the 13 but want near-flagship performance.'],
            ['Above Rs 60,000','OnePlus 13 — the flagship. Snapdragon 8 Elite, 100W + 50W wireless, Hasselblad cameras. Best OnePlus phone available and genuinely competitive with Samsung S25.'],
          ].map(([budget,rec]) => (
            <div key={budget} className="border border-border p-4 bg-white">
              <h3 className="font-sans text-sm font-bold text-[#1a3a5c] mb-2">{budget}</h3>
              <p className="font-sans text-sm text-muted leading-relaxed">{rec}</p>
            </div>
          ))}
        </div>

        <div className="my-8 overflow-hidden"><img src={img5} alt="OnePlus 13 camera Hasselblad India" className="w-full h-56 object-cover" loading="lazy" /><p className="font-sans text-xs text-muted mt-1 text-center">OnePlus 13 Hasselblad camera system — the strongest OnePlus camera in history</p></div>

        <h2 className="font-playfair text-2xl font-bold text-ink mt-10 mb-5 pb-2 border-b border-border">Frequently Asked Questions</h2>
        <div className="space-y-4 mb-10">
          {[
            ['Is OnePlus better than Samsung in India?','OnePlus wins on: charging speed, performance per rupee, software cleanliness. Samsung wins on: service network reach, update longevity (7yr vs 4yr), resale value. Neither is objectively better — choose based on where you live and how long you keep phones.'],
            ['Which OnePlus phone is best for gaming in India?','OnePlus 13 for ultimate gaming (Snapdragon 8 Elite handles BGMI 90fps sustained). OnePlus 13R for near-flagship gaming at lower cost. Nord 4 for mid-range gaming at Rs 34,999 — handles BGMI 60fps consistently.'],
            ['Does OnePlus have 5G support for Jio and Airtel in India?','Yes — all OnePlus phones sold in India since 2022 support n78 (3500MHz) band for Jio and Airtel 5G. OnePlus 13, 13R, Nord 4, Nord CE 4, Nord CE 4 Lite all confirmed n78 support.'],
            ['How long does OnePlus support phones with updates?','OnePlus 13: 4 years OS, 5 years security. OnePlus 13R: 4 years OS. Nord 4: 3 years OS. Nord CE 4: 2 years OS. Nord CE 4 Lite: 2 years OS. Shorter than Samsung — factor this into 3+ year ownership decisions.'],
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
            {[['Best Gaming Phones India','/best-gaming-phones-india'],['Best Smartphones India','/best-smartphones-india'],['Smartphone Buying Guide','/smartphone-buying-guide-india'],['Phone Comparison Guide','/phone-comparison-guide-india']].map(([l,h]) => (
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
{/* ✅ ADDED: FINAL BUYING ADVICE */}
<div className="mt-10 border-t pt-6">
  <h2 className="font-playfair text-xl font-bold text-ink mb-3">Final Buying Advice</h2>
  <p className="font-sans text-sm text-muted leading-relaxed">
    The best OnePlus phone depends on your budget. The Nord 4 offers the best balance of performance and price, while the OnePlus 13 is a true flagship alternative to Samsung. Avoid lower-end Nord models unless budget is your only priority — they don’t reflect the original OnePlus value proposition.
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