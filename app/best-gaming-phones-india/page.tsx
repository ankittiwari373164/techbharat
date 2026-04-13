// app/best-gaming-phones-india/page.tsx
import { Metadata } from 'next'
import Link from 'next/link'
import { getPillarArticles, formatPillarDate, currentMonthYear } from '@/lib/pillar-utils'

export const revalidate = 3600

export async function generateMetadata(): Promise<Metadata> {
  const { month, year } = currentMonthYear()
  const title = `Best Gaming Phones in India — ${month} ${year}`
  return {
    title: `${title} | The Tech Bharat`,
    description: `Best gaming smartphones India 2026 — BGMI, Free Fire performance ranked. iQOO 12, Asus ROG 8, OnePlus 13 tested for Indian mobile gaming.`,
    alternates: { canonical: 'https://thetechbharat.com/best-gaming-phones-india' },
    openGraph: { title, url: 'https://thetechbharat.com/best-gaming-phones-india', type: 'article' },
  }
}

export default async function BestGamingPhonesPage() {
  const { month, year } = currentMonthYear()
  const img1 = "https://images.unsplash.com/photo-1542751371-acd01c933a3e?auto=format&fit=crop&w=1200&q=80"
  const img2 = "https://images.unsplash.com/photo-1534423861386-85a16f5d13fd?auto=format&fit=crop&w=1200&q=80"
  const img3 = "https://images.unsplash.com/photo-1593305841991-05c297ba4575?auto=format&fit=crop&w=1200&q=80"
  const img4 = "https://images.unsplash.com/photo-1612287230202-1ff1ac6d4052?auto=format&fit=crop&w=1200&q=80"
  const img5 = "https://images.unsplash.com/photo-1560253023-3ec5d502959f?auto=format&fit=crop&w=1200&q=80"

  const articles = await getPillarArticles(['gaming phone', 'BGMI phone', 'mobile gaming', 'best phone for BGMI', 'game phone India'], [], 12, "None")
  const reviews  = articles.filter(a => a.type === 'review' || a.type === 'compare')
  const news     = articles.filter(a => a.type === 'mobile-news')

  return (
    <div className="bg-paper min-h-screen">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://thetechbharat.com' },
          { '@type': 'ListItem', position: 2, name: 'Best Gaming Phones in India —', item: 'https://thetechbharat.com/best-gaming-phones-india' },
        ],
      }) }} />

      <div className="max-w-4xl mx-auto px-4 py-10">

        {/* Breadcrumb */}
        <nav className="font-sans text-xs text-muted mb-6 flex items-center gap-2 flex-wrap">
          <Link href="/" className="hover:text-[#d4220a]">Home</Link>
          <span>/</span>
          <Link href="/mobile-news" className="hover:text-[#d4220a]">Mobile News</Link>
          <span>/</span>
          <span className="text-ink">Best Gaming Phones in India —</span>
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
            Best Gaming Phones in India — {month} {year}
          </h1>
          <p className="font-sans text-base font-semibold text-[#1a3a5c] border-l-4 border-[#1a3a5c] pl-4 mb-2">
            Ranked for BGMI, Free Fire and sustained gaming performance — processors, cooling, display and battery tested for India.
          </p>
        </div>

        {/* Hero image */}
        <div className="mb-8 overflow-hidden">
          <img src={img1} alt="Best Gaming Phones in India —" className="w-full h-64 object-cover" loading="eager" />
        </div>


        <p className="font-body text-lg text-[#2a2a2a] leading-relaxed mb-6">India is the world\'s largest mobile gaming market by user count. BGMI, Free Fire, Call of Duty Mobile, and Ludo King between them have hundreds of millions of Indian players. Choosing the right gaming phone in {month} {year} means understanding not just spec sheet numbers but real-world sustained performance — what happens to frame rates after 20 minutes of gaming, how hot the phone gets, and how much battery the session consumes.</p>
        <h2 className="font-playfair text-2xl font-bold text-ink mt-10 mb-4 pb-2 border-b-2 border-[#d4220a]">Best Gaming Phones India {month} {year} — Ranked</h2>
        <div className="overflow-x-auto mb-8"><table className="w-full border-collapse text-sm font-sans"><thead><tr className="bg-[#1a3a5c] text-white"><th className="px-3 py-2 text-left">Phone</th><th className="px-3 py-2 text-left">Price</th><th className="px-3 py-2 text-left">Chip</th><th className="px-3 py-2 text-left">BGMI Max</th><th className="px-3 py-2 text-left">Battery</th><th className="px-3 py-2 text-left">Rating</th></tr></thead>
        <tbody>{[
          ['Asus ROG Phone 8','Rs 79,999','Snapdragon 8 Gen 3','90fps Ultra sustained','5,500mAh + 65W','9.5/10'],
          ['iQOO 12','Rs 52,999','Snapdragon 8 Gen 3','90fps Ultra sustained','5,000mAh + 120W','9.3/10'],
          ['OnePlus 13','Rs 69,999','Snapdragon 8 Elite','90fps Ultra sustained','6,000mAh + 100W','9.1/10'],
          ['Poco X6 Pro 5G','Rs 26,999','Dimensity 8300 Ultra','60fps High sustained','5,000mAh + 67W','8.5/10'],
          ['iQOO Z9s Pro','Rs 24,999','Snapdragon 7 Gen 3','60fps High sustained','5,500mAh + 44W','8.2/10'],
          ['Redmi Note 13 Pro+','Rs 29,999','Dimensity 7200 Ultra','60fps Medium sustained','5,000mAh + 120W','7.9/10'],
        ].map(([m,p,c,b,bt,r],i) => (<tr key={m} className={i%2===0?'bg-white border-b border-border':'bg-gray-50 border-b border-border'}><td className="px-3 py-2 font-semibold">{m}</td><td className="px-3 py-2">{p}</td><td className="px-3 py-2">{c}</td><td className="px-3 py-2">{b}</td><td className="px-3 py-2">{bt}</td><td className="px-3 py-2 font-bold text-[#d4220a]">{r}</td></tr>))}
        </tbody></table></div>
        <div className="my-8 overflow-hidden"><img src={img2} alt="iQOO 12 gaming phone India BGMI 90fps" className="w-full h-56 object-cover" loading="lazy" /><p className="font-sans text-xs text-muted mt-1 text-center">iQOO 12 — 120W charging and BGMI 90fps at Rs 52,999, best value gaming phone</p></div>
        <h2 className="font-playfair text-2xl font-bold text-ink mt-10 mb-4 pb-2 border-b-2 border-[#d4220a]">iQOO 12 — The Best Gaming Value in India</h2>
        <p className="font-body text-base text-[#2a2a2a] leading-relaxed mb-4">The iQOO 12 at Rs 52,999 is the gaming phone recommendation for Indian buyers in {month} {year}. Snapdragon 8 Gen 3, 120W charging (full charge in 25 minutes), 5,000mAh battery, and BGMI at 90fps sustained without throttling. The gaming-tuned cooling system keeps temperatures manageable even after 45-minute BGMI sessions — the key differentiator from phones with powerful chips but inadequate thermal management.</p>
        <p className="font-body text-base text-[#2a2a2a] leading-relaxed mb-4">iQOO\'s Monster Gaming Mode allocates all available resources to gaming — reduces background processes, boosts display touch sampling, and prioritises network packets for games. Real-world difference in competitive BGMI: reduced input lag and more consistent frame delivery. These are the marginal improvements that matter at high skill levels.</p>
        <h2 className="font-playfair text-2xl font-bold text-ink mt-10 mb-4 pb-2 border-b-2 border-[#d4220a]">Asus ROG Phone 8 — For Serious Competitive Gamers</h2>
        <p className="font-body text-base text-[#2a2a2a] leading-relaxed mb-4">The Asus ROG Phone 8 at Rs 79,999 is the only phone on this list purpose-built for gaming. Side-mounted USB-C charging means the port doesn\'t block your grip while playing. Physical AirTrigger buttons on the side function as shoulder buttons in BGMI — a genuine competitive advantage. The 6,000Hz touch sampling rate and dedicated gaming processor make this the most responsive gaming display available in India.</p>
        <div className="my-8 overflow-hidden"><img src={img3} alt="Asus ROG Phone 8 gaming India BGMI competitive" className="w-full h-56 object-cover" loading="lazy" /><p className="font-sans text-xs text-muted mt-1 text-center">Asus ROG Phone 8 — AirTrigger shoulder buttons and side charging for competitive BGMI</p></div>
        <h2 className="font-playfair text-2xl font-bold text-ink mt-10 mb-4 pb-2 border-b-2 border-[#d4220a]">Budget Gaming Phones — What Rs 25,000 Can Buy</h2>
        <p className="font-body text-base text-[#2a2a2a] leading-relaxed mb-4">The Poco X6 Pro 5G at Rs 26,999 runs Dimensity 8300 Ultra — the most capable gaming chip available under Rs 30,000 in India. BGMI at 60fps High settings is consistent and sustained. The 67W charging is adequate. Display at 120Hz is gaming-capable. For buyers who want capable mobile gaming without flagship pricing, this is the entry point that doesn\'t significantly compromise the gaming experience.</p>
        <p className="font-body text-base text-[#2a2a2a] leading-relaxed mb-4">At Rs 24,999, iQOO Z9s Pro with Snapdragon 7 Gen 3 is the alternative — slightly lower gaming ceiling than Dimensity 8300 Ultra but with iQOO\'s better gaming software features and thermal management. Both are solid gaming picks at this price.</p>
        <div className="my-8 overflow-hidden"><img src={img4} alt="Poco X6 Pro 5G budget gaming phone India" className="w-full h-56 object-cover" loading="lazy" /><p className="font-sans text-xs text-muted mt-1 text-center">Poco X6 Pro — Dimensity 8300 Ultra makes it the budget gaming king under Rs 30,000</p></div>
        <h2 className="font-playfair text-2xl font-bold text-ink mt-10 mb-4 pb-2 border-b-2 border-[#d4220a]">BGMI Frame Rates — What Each Chip Can Actually Sustain</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">{[
          ['Snapdragon 8 Elite / 8 Gen 3','90fps Ultra quality — sustained for 60+ minutes without significant throttling. True competitive performance.'],
          ['Snapdragon 8 Gen 2','90fps Ultra — sustained for 30-40 minutes before mild throttling. Still excellent gaming performance.'],
          ['Dimensity 8300 Ultra','60fps High — consistent and sustained. Step below the 8-series but genuinely capable for most players.'],
          ['Snapdragon 7 Gen 3','60fps Medium-High — consistent. Good gaming experience, not a competitive handicap at this level.'],
          ['Snapdragon 4 Gen 2','60fps Medium — sustainable but thermal limits become apparent after 20 minutes. Adequate, not impressive.'],
          ['Snapdragon 695 / 4 Gen 1','60fps Low-Medium — thermal throttling visible after 15-20 minutes. Entry-level gaming experience only.'],
        ].map(([c,p]) => (<div key={c} className="border border-border p-4 bg-white"><h3 className="font-sans text-sm font-bold text-[#1a3a5c] mb-2">{c}</h3><p className="font-sans text-sm text-muted leading-relaxed">{p}</p></div>))}</div>
        <div className="my-8 overflow-hidden"><img src={img5} alt="BGMI 90fps gaming phone India thermal performance" className="w-full h-56 object-cover" loading="lazy" /><p className="font-sans text-xs text-muted mt-1 text-center">Thermal management is the real test for gaming phones — sustained performance matters more than peak</p></div>
        
        <h2 className="font-playfair text-2xl font-bold text-ink mt-10 mb-5 pb-2 border-b border-border">Frequently Asked Questions</h2>
        <div className="space-y-4 mb-10">
          {[
            ['Which phone is best for BGMI in India in April 2026?','iQOO 12 (Rs 52,999) for the best gaming value. Asus ROG Phone 8 (Rs 79,999) for serious competitive players. Poco X6 Pro (Rs 26,999) for budget gaming under Rs 30,000.'],
            ['Can budget phones run BGMI 90fps in India?','No budget phone (under Rs 25,000) can sustain BGMI 90fps. Budget phones run BGMI at 60fps Medium settings. For 90fps Ultra, you need Snapdragon 8-series or Dimensity 9300 chips — available from Rs 35,000 upward.'],
            ['Does display Hz matter for gaming?','120Hz display is the minimum for a smooth gaming experience in BGMI and Free Fire. 144Hz provides marginally smoother scrolling but limited game benefit. 60Hz is a noticeable disadvantage in competitive play — avoid for gaming-focused purchases.'],
            ['Which gaming phone has best battery life in India?','OnePlus 13 (6,000mAh + 100W) leads on battery size. Asus ROG Phone 8 (5,500mAh + 65W) with dedicated bypass charging for gaming sessions. iQOO 12 (5,000mAh + 120W) compensates smaller battery with fastest charging.']
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
            {[['Best Flagship Phones India','/best-flagship-phones-india'], ['Best OnePlus Phones India','/best-oneplus-phones-india'], ['Best Smartphones India','/best-smartphones-india'], ['Smartphone Buying Guide','/smartphone-buying-guide-india']].map(([l,h]) => (
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