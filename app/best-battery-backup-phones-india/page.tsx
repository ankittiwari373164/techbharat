// app/best-battery-backup-phones-india/page.tsx
import { Metadata } from 'next'
import Link from 'next/link'
import { getPillarArticles, formatPillarDate, currentMonthYear } from '@/lib/pillar-utils'

export const revalidate = 3600

export async function generateMetadata(): Promise<Metadata> {
  const { month, year } = currentMonthYear()
  const title = `Best Battery Backup Phones in India — ${month} ${year}`
  return {
    title: `${title} | The Tech Bharat`,
    description: `Best battery life smartphones India 2026 — longest lasting phones ranked. Real-world battery tests for Indian usage patterns.`,
    alternates: { canonical: 'https://thetechbharat.com/best-battery-backup-phones-india' },
    openGraph: { title, url: 'https://thetechbharat.com/best-battery-backup-phones-india', type: 'article' },
  }
}

export default async function BestBatteryPhonesPage() {
  const { month, year } = currentMonthYear()
  const img1 = "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?auto=format&fit=crop&w=1200&q=80"
  const img2 = "https://images.unsplash.com/photo-1563203369-26f2e4a5ccf7?auto=format&fit=crop&w=1200&q=80"
  const img3 = "https://images.unsplash.com/photo-1545579133-99bb5ad33c6d?auto=format&fit=crop&w=1200&q=80"
  const img4 = "https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&w=1200&q=80"
  const img5 = "https://images.unsplash.com/photo-1574269909862-7e1d70d2fade?auto=format&fit=crop&w=1200&q=80"

  const articles = await getPillarArticles(['battery backup phone', 'long battery phone India', 'best battery smartphone', '6000mAh phone India'], [], 12, "None")
  const reviews  = articles.filter(a => a.type === 'review' || a.type === 'compare')
  const news     = articles.filter(a => a.type === 'mobile-news')

  return (
    <div className="bg-paper min-h-screen">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://thetechbharat.com' },
          { '@type': 'ListItem', position: 2, name: 'Best Battery Backup Phones in India —', item: 'https://thetechbharat.com/best-battery-backup-phones-india' },
        ],
      }) }} />

      <div className="max-w-4xl mx-auto px-4 py-10">

        {/* Breadcrumb */}
        <nav className="font-sans text-xs text-muted mb-6 flex items-center gap-2 flex-wrap">
          <Link href="/" className="hover:text-[#d4220a]">Home</Link>
          <span>/</span>
          <Link href="/mobile-news" className="hover:text-[#d4220a]">Mobile News</Link>
          <span>/</span>
          <span className="text-ink">Best Battery Backup Phones in India —</span>
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
            Best Battery Backup Phones in India — {month} {year}
          </h1>
          <p className="font-sans text-base font-semibold text-[#1a3a5c] border-l-4 border-[#1a3a5c] pl-4 mb-2">
            Longest battery life phones for Indian buyers — commuters, field workers and heavy users who need all-day confidence.
          </p>
        </div>

        {/* Hero image */}
        <div className="mb-8 overflow-hidden">
          <img src={img1} alt="Best Battery Backup Phones in India —" className="w-full h-64 object-cover" loading="eager" />
        </div>


        <p className="font-body text-lg text-[#2a2a2a] leading-relaxed mb-6">Battery life is the most universally complained-about smartphone issue in India — and for good reason. Long commutes, power cuts in smaller cities, 8-hour workdays away from chargers, and hot Indian summers that accelerate battery drain all create real demand for phones that genuinely last. This guide ranks the best battery phones in India in {month} {year} based on real-world Indian usage scenarios, not controlled lab tests.</p>
        {/* ✅ ADDED: BUYER INTENT BLOCK */}
<div className="bg-[#f8f4ef] border-l-4 border-[#d4220a] p-5 mb-8">
  <h3 className="font-bold text-sm mb-2">Who should buy a battery-focused phone?</h3>
  <p className="text-sm text-[#2a2a2a]">
    If you travel long distances, work outdoors, face frequent power cuts, or simply hate charging your phone multiple times a day, a high battery capacity phone (5,000mAh–6,000mAh) is the best choice.
  </p>

  <h3 className="font-bold text-sm mt-4 mb-2">Who should NOT prioritise battery phones?</h3>
  <p className="text-sm text-[#2a2a2a]">
    If you are always near a charger, or care more about camera quality, design, or flagship performance, you may be better off choosing a balanced or premium phone instead.
  </p>

  <h3 className="font-bold text-sm mt-4 mb-2">Final Verdict</h3>
  <p className="text-sm text-[#2a2a2a]">
    In {month} {year}, battery life is still one of the most practical features for Indian users. A slightly bigger battery often delivers more real-world value than extra performance or camera upgrades.
  </p>
</div>
        <h2 className="font-playfair text-2xl font-bold text-ink mt-10 mb-4 pb-2 border-b-2 border-[#d4220a]">Best Battery Phones India {month} {year} — Ranked</h2>
        {/* ✅ ADDED: INTERNAL LINK BOOST */}
<p className="font-sans text-sm text-muted mb-6">
  For overall recommendations, check our{' '}
  <Link href="/best-smartphones-india" className="text-[#d4220a] font-semibold hover:underline">
    Best Smartphones in India
  </Link>{' '}
  and{' '}
  <Link href="/smartphone-buying-guide-india" className="text-[#d4220a] font-semibold hover:underline">
    complete buying guide
  </Link>{' '}
  to compare battery life with performance and camera.
</p>
        <div className="overflow-x-auto mb-8"><table className="w-full border-collapse text-sm font-sans"><thead><tr className="bg-[#1a3a5c] text-white"><th className="px-3 py-2 text-left">Phone</th><th className="px-3 py-2 text-left">Price</th><th className="px-3 py-2 text-left">Battery</th><th className="px-3 py-2 text-left">Charging</th><th className="px-3 py-2 text-left">Screen-on Time</th><th className="px-3 py-2 text-left">Rating</th></tr></thead>
        <tbody>{[
          ['OnePlus 13','Rs 69,999','6,000mAh','100W + 50W wireless','9-10 hrs','9.4/10'],
          ['Samsung Galaxy M35 5G','Rs 20,999','6,000mAh','25W','10-11 hrs','9.0/10'],
          ['Samsung Galaxy M15 5G','Rs 13,999','6,000mAh','25W','10-11 hrs','8.8/10'],
          ['Redmi Note 13 Pro+','Rs 29,999','5,000mAh','120W','8-9 hrs','8.6/10'],
          ['iQOO Z9 Lite 5G','Rs 11,999','5,000mAh','44W','8-9 hrs','8.4/10'],
          ['Nothing Phone (2a)','Rs 23,999','5,000mAh','45W','9-10 hrs','8.5/10'],
        ].map(([m,p,b,c,s,r],i) => (<tr key={m} className={i%2===0?'bg-white border-b border-border':'bg-gray-50 border-b border-border'}><td className="px-3 py-2 font-semibold">{m}</td><td className="px-3 py-2">{p}</td><td className="px-3 py-2 font-bold">{b}</td><td className="px-3 py-2">{c}</td><td className="px-3 py-2">{s}</td><td className="px-3 py-2 font-bold text-[#d4220a]">{r}</td></tr>))}
        </tbody></table></div>
        <div className="my-8 overflow-hidden"><img src={img2} alt="Samsung Galaxy M35 5G battery life India test" className="w-full h-56 object-cover" loading="lazy" /><p className="font-sans text-xs text-muted mt-1 text-center">Samsung Galaxy M35 5G — 6,000mAh battery with Samsung reliability and 4-year updates</p></div>
        <h2 className="font-playfair text-2xl font-bold text-ink mt-10 mb-4 pb-2 border-b-2 border-[#d4220a]">Battery Size vs Charging Speed — The Real Tradeoff</h2>
        <p className="font-body text-base text-[#2a2a2a] leading-relaxed mb-4">6,000mAh battery with 25W charging (Samsung Galaxy M35 5G) versus 5,000mAh battery with 120W charging (Redmi Note 13 Pro+): which serves Indian users better? It depends entirely on your usage pattern. The M35 gives you 10-11 hours of screen time — most users never need to charge during the day. The Note 13 Pro+ can charge from flat to full in 28 minutes — useful if you have access to a charger during the day but a hectic schedule.</p>
        <p className="font-body text-base text-[#2a2a2a] leading-relaxed mb-4">For commuters who can\'t charge at work: big battery (6,000mAh) wins. For office workers who can plug in during lunch: fast charging wins. The OnePlus 13 delivers the best of both — 6,000mAh battery with 100W charging — but at Rs 69,999 it\'s in a different tier.</p>
        <div className="my-8 overflow-hidden"><img src={img3} alt="120W fast charging vs big battery comparison India" className="w-full h-56 object-cover" loading="lazy" /><p className="font-sans text-xs text-muted mt-1 text-center">120W vs 25W charging — speed advantage vs endurance advantage for Indian usage</p></div>
        <h2 className="font-playfair text-2xl font-bold text-ink mt-10 mb-4 pb-2 border-b-2 border-[#d4220a]">Best Battery Phones by Budget</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">{[
          ['Under Rs 15,000','Samsung Galaxy M15 5G — 6,000mAh at Rs 13,999. 25W charging. 10+ hours screen time. Best battery life phone under Rs 15,000.'],
          ['Rs 15,000 to Rs 25,000','Samsung Galaxy M35 5G (Rs 20,999) — same 6,000mAh, better chip. For pure battery endurance at this tier, nothing beats it.'],
          ['Rs 25,000 to Rs 35,000','Nothing Phone (2a) (Rs 23,999) — 5,000mAh with 45W charging and excellent power management. 9-10 hours screen on time in real use.'],
          ['Rs 35,000 to Rs 50,000','Samsung Galaxy A55 5G — 5,000mAh with efficient Exynos 1480. 8-9 hours screen time with more premium camera and display.'],
          ['Above Rs 60,000','OnePlus 13 — 6,000mAh + 100W charging + 50W wireless. The definitive best battery flagship in India. Never anxiety-inducing.'],
        ].map(([b,r]) => (<div key={b} className="border border-border p-4 bg-white"><h3 className="font-sans text-sm font-bold text-[#1a3a5c] mb-2">{b}</h3><p className="font-sans text-sm text-muted leading-relaxed">{r}</p></div>))}</div>
        <h2 className="font-playfair text-2xl font-bold text-ink mt-10 mb-4 pb-2 border-b-2 border-[#d4220a]">Battery Health Over Time — What Indian Summers Do to Your Phone</h2>
        <p className="font-body text-base text-[#2a2a2a] leading-relaxed mb-4">Indian summer temperatures (40-47°C in many states) accelerate battery degradation significantly. A phone charged in a parked car or left in direct sunlight experiences battery stress that can reduce capacity by 15-20% faster than phones used in cooler conditions. This is why buying a phone with the largest battery you can afford makes sense in India — even with degradation, a 6,000mAh battery at 80% health still provides 4,800mAh effective capacity.</p>
        <div className="my-8 overflow-hidden"><img src={img4} alt="battery health Indian summer temperatures smartphone" className="w-full h-56 object-cover" loading="lazy" /><p className="font-sans text-xs text-muted mt-1 text-center">Indian summer heat accelerates battery degradation — bigger batteries age better in absolute terms</p></div>
        <h2 className="font-playfair text-2xl font-bold text-ink mt-10 mb-4 pb-2 border-b-2 border-[#d4220a]">Tips to Extend Battery Life on Any Phone</h2>
        <p className="font-body text-base text-[#2a2a2a] leading-relaxed mb-4">Keep your phone between 20-80% charge whenever possible — full charges and complete discharges both stress lithium batteries. Reduce screen brightness in indoor settings (the display is typically the largest battery drain). Disable always-on display features if your phone has them. Use Battery Saver mode when you know you won\'t have charger access. Enable adaptive refresh rate if your phone supports it — drops from 120Hz to 60Hz in static content and saves meaningful battery.</p>
        <div className="my-8 overflow-hidden"><img src={img5} alt="smartphone battery optimization India charging tips" className="w-full h-56 object-cover" loading="lazy" /><p className="font-sans text-xs text-muted mt-1 text-center">Keeping charge between 20-80% extends lithium battery life significantly over 2-year ownership</p></div>
        
        <h2 className="font-playfair text-2xl font-bold text-ink mt-10 mb-5 pb-2 border-b border-border">Frequently Asked Questions</h2>
        <div className="space-y-4 mb-10">
          {[
            ['Which phone has the best battery life in India?','OnePlus 13 (6,000mAh + 100W charging) for the best combination of capacity and charging speed at flagship level. Samsung Galaxy M35 5G (6,000mAh + 25W) for the best battery life under Rs 25,000 with 10+ hour screen-on time.'],
            ['Is 6000mAh enough for 2 days?','With moderate use (4-5 hours screen-on), a 6,000mAh phone like Samsung Galaxy M35 5G or M15 5G can last 1.5-2 days. Heavy use (gaming, video, constant social media) typically brings it to exactly 1 day.'],
            ['Does fast charging damage the battery?','Modern fast charging (44W and above) includes temperature and current management that protects battery health. SUPERVOOC, DART, VOOC, and Samsung\'s Adaptive Fast Charging all use intelligent algorithms that reduce stress on battery cells compared to older fast charging implementations.'],
            ['Which Samsung phone has the biggest battery?','Samsung Galaxy M35 5G and M15 5G both have 6,000mAh — the largest batteries in Samsung\'s current India lineup. Galaxy S25 Ultra has 5,000mAh at the flagship tier.']
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
            {[['Best Budget Phones India','/best-budget-phones-india'], ['Best 5G Phones India','/best-5g-phones-india'], ['Smartphone Buying Guide','/smartphone-buying-guide-india'], ['Best Smartphones India','/best-smartphones-india']].map(([l,h]) => (
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
    The best battery phone depends on your lifestyle. If you need all-day reliability without charging, choose a 6,000mAh device like the Galaxy M series. If you prefer convenience, fast charging phones like Redmi or OnePlus models reduce downtime significantly. For most users, a balance of battery size and charging speed delivers the best experience.
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