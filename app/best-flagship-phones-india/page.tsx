// app/best-flagship-phones-india/page.tsx
import { Metadata } from 'next'
import Link from 'next/link'
import { getPillarArticles, formatPillarDate, currentMonthYear } from '@/lib/pillar-utils'

export const revalidate = 3600

export async function generateMetadata(): Promise<Metadata> {
  const { month, year } = currentMonthYear()
  const title = `Best Flagship Phones in India — ${month} ${year}`
  return {
    title: `${title} | The Tech Bharat`,
    description: `Best flagship smartphones India 2026 — Samsung S25 Ultra, iPhone 16 Pro, Google Pixel 9 Pro ranked with honest value analysis for Indian buyers.`,
    alternates: { canonical: 'https://thetechbharat.com/best-flagship-phones-india' },
    openGraph: { title, url: 'https://thetechbharat.com/best-flagship-phones-india', type: 'article' },
  }
}

export default async function BestFlagshipPhonesPage() {
  const { month, year } = currentMonthYear()
  const img1 = "https://images.unsplash.com/photo-1510557880182-3d4d3cad945a?auto=format&fit=crop&w=1200&q=80"
  const img2 = "https://images.unsplash.com/photo-1592899677977-9c10002761d5?auto=format&fit=crop&w=1200&q=80"
  const img3 = "https://images.unsplash.com/photo-1575695342520-b69c671e7b77?auto=format&fit=crop&w=1200&q=80"
  const img4 = "https://images.unsplash.com/photo-1605236453806-6ff36851218e?auto=format&fit=crop&w=1200&q=80"
  const img5 = "https://images.unsplash.com/photo-1583394293408-bde5e3b0f88a?auto=format&fit=crop&w=1200&q=80"

  const articles = await getPillarArticles(['flagship phone India', 'best premium smartphone', 'Samsung S25 Ultra India', 'iPhone 16 Pro India'], [], 12, "None")
  const reviews  = articles.filter(a => a.type === 'review' || a.type === 'compare')
  const news     = articles.filter(a => a.type === 'mobile-news')

  return (
    <div className="bg-paper min-h-screen">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://thetechbharat.com' },
          { '@type': 'ListItem', position: 2, name: 'Best Flagship Phones in India —', item: 'https://thetechbharat.com/best-flagship-phones-india' },
        ],
      }) }} />

      <div className="max-w-4xl mx-auto px-4 py-10">

        {/* Breadcrumb */}
        <nav className="font-sans text-xs text-muted mb-6 flex items-center gap-2 flex-wrap">
          <Link href="/" className="hover:text-[#d4220a]">Home</Link>
          <span>/</span>
          <Link href="/mobile-news" className="hover:text-[#d4220a]">Mobile News</Link>
          <span>/</span>
          <span className="text-ink">Best Flagship Phones in India —</span>
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
            Best Flagship Phones in India — {month} {year}
          </h1>
          <p className="font-sans text-base font-semibold text-[#1a3a5c] border-l-4 border-[#1a3a5c] pl-4 mb-2">
            Premium flagship phones above Rs 60,000 ranked for Indian buyers — which flagship actually justifies the price in 2026.
          </p>
        </div>

        {/* Hero image */}
        <div className="mb-8 overflow-hidden">
          <img src={img1} alt="Best Flagship Phones in India —" className="w-full h-64 object-cover" loading="eager" />
        </div>


        <p className="font-body text-lg text-[#2a2a2a] leading-relaxed mb-6">India\'s premium smartphone market — phones above Rs 60,000 — has grown significantly in {month} {year}. More Indian buyers are choosing to spend more on fewer phones rather than upgrading cheaper devices more frequently. This shift makes the flagship purchase decision more important: at Rs 80,000-1,60,000, you\'re expecting this phone to last 4-5 years and deliver genuinely differentiated performance.</p>
        {/* ✅ ADDED: BUYER INTENT BLOCK */}
<div className="bg-[#f8f4ef] border-l-4 border-[#d4220a] p-5 mb-8">
  <h3 className="font-bold text-sm mb-2">Who should buy a flagship phone?</h3>
  <p className="text-sm text-[#2a2a2a]">
    Flagship phones are ideal for users who plan to keep their device for 4–5 years, want the best camera and performance, and value long-term software updates and premium build quality.
  </p>

  <h3 className="font-bold text-sm mt-4 mb-2">Who should NOT buy a flagship phone?</h3>
  <p className="text-sm text-[#2a2a2a]">
    If you upgrade every 1–2 years or mainly use basic apps, spending over Rs 1 lakh on a flagship may not provide real value compared to mid-range phones.
  </p>

  <h3 className="font-bold text-sm mt-4 mb-2">Final Verdict</h3>
  <p className="text-sm text-[#2a2a2a]">
    In {month} {year}, flagship phones make financial sense only when used long-term. Their real value comes from durability, software support, and resale — not just raw performance.
  </p>
</div>
        <h2 className="font-playfair text-2xl font-bold text-ink mt-10 mb-4 pb-2 border-b-2 border-[#d4220a]">Best Flagship Phones India {month} {year}</h2>
        {/* ✅ ADDED: INTERNAL LINK BOOST */}
<p className="font-sans text-sm text-muted mb-6">
  For broader recommendations across all budgets, check our{' '}
  <Link href="/best-smartphones-india" className="text-[#d4220a] font-semibold hover:underline">
    Best Smartphones in India
  </Link>{' '}
  and{' '}
  <Link href="/smartphone-buying-guide-india" className="text-[#d4220a] font-semibold hover:underline">
    complete buying guide
  </Link>.
</p>
        <div className="overflow-x-auto mb-8"><table className="w-full border-collapse text-sm font-sans"><thead><tr className="bg-[#1a3a5c] text-white"><th className="px-3 py-2 text-left">Phone</th><th className="px-3 py-2 text-left">Price</th><th className="px-3 py-2 text-left">Key Advantage</th><th className="px-3 py-2 text-left">Updates</th><th className="px-3 py-2 text-left">Rating</th></tr></thead>
        <tbody>{[
          ['Samsung Galaxy S25 Ultra','Rs 1,34,999','S Pen + 200MP zoom camera','7 years','9.5/10'],
          ['iPhone 16 Pro Max','Rs 1,59,900','Best video + Apple ecosystem','7 years','9.4/10'],
          ['Google Pixel 9 Pro XL','Rs 1,09,999','Best camera intelligence','7 years','9.3/10'],
          ['Samsung Galaxy S25+','Rs 99,999','Large screen flagship','7 years','9.1/10'],
          ['OnePlus 13','Rs 69,999','100W charging + value','4 years','9.0/10'],
          ['Samsung Galaxy S25','Rs 79,999','Snapdragon 8 Elite mainstream','7 years','8.9/10'],
          ['Google Pixel 9 Pro','Rs 1,09,999','Best portrait + Night Sight','7 years','9.2/10'],
        ].map(([m,p,k,u,r],i) => (<tr key={m} className={i%2===0?'bg-white border-b border-border':'bg-gray-50 border-b border-border'}><td className="px-3 py-2 font-semibold">{m}</td><td className="px-3 py-2">{p}</td><td className="px-3 py-2">{k}</td><td className="px-3 py-2">{u}</td><td className="px-3 py-2 font-bold text-[#d4220a]">{r}</td></tr>))}
        </tbody></table></div>
        <div className="my-8 overflow-hidden"><img src={img2} alt="Samsung Galaxy S25 Ultra flagship India 2026" className="w-full h-56 object-cover" loading="lazy" /><p className="font-sans text-xs text-muted mt-1 text-center">Samsung Galaxy S25 Ultra — 200MP camera, S Pen, 7-year updates at Rs 1,34,999</p></div>
        <h2 className="font-playfair text-2xl font-bold text-ink mt-10 mb-4 pb-2 border-b-2 border-[#d4220a]">The Real Question: Does a Flagship Actually Last 5 Years?</h2>
        <p className="font-body text-base text-[#2a2a2a] leading-relaxed mb-4">The primary justification for flagship pricing in {month} {year} is longevity — not just software updates but actual hardware adequacy. A Samsung Galaxy S25 Ultra purchased today will run comfortably for 5 years because: Snapdragon 8 Elite has significant headroom beyond current demands, 12GB RAM handles multitasking for the foreseeable future, and Samsung\'s 7-year update commitment means security patches until 2032. The equivalent Chinese brand flagship at Rs 50,000 will technically work in 5 years but will feel slow and unsupported.</p>
        <p className="font-body text-base text-[#2a2a2a] leading-relaxed mb-4">iPhone\'s resale value equation is the strongest argument for the premium. An iPhone 16 Pro Max at Rs 1,59,900 today will command Rs 75,000-85,000 in resale value after 2 years — approximately 50% retention. A Samsung Galaxy S25 Ultra retains roughly 40-45% after 2 years. Chinese flagships at Rs 50,000 retain 20-25%. Over a 4-year cycle, iPhone\'s actual total cost can be competitive with mid-range Android if you account for resale value.</p>
        <div className="my-8 overflow-hidden"><img src={img3} alt="iPhone 16 Pro Max vs Google Pixel 9 Pro camera India" className="w-full h-56 object-cover" loading="lazy" /><p className="font-sans text-xs text-muted mt-1 text-center">Pixel 9 Pro vs iPhone 16 Pro — the two best camera phones in India above Rs 1,00,000</p></div>
        <h2 className="font-playfair text-2xl font-bold text-ink mt-10 mb-4 pb-2 border-b-2 border-[#d4220a]">Flagship Recommendations by Use Case</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">{[
          ['Content Creator / Videographer','iPhone 16 Pro Max — ProRes, Log video, Cinematic mode, and the best mobile video processing available. No Android flagship matches its video capabilities.'],
          ['Photography Enthusiast','Google Pixel 9 Pro — computational photography advantage in low light and portraits. Pixel\'s camera algorithm is ahead of every other Android.'],
          ['Business Professional','Samsung Galaxy S25 Ultra — S Pen for notes and signing documents, DeX desktop mode, Samsung Knox security, 7-year support. The productivity flagship.'],
          ['Power User / Gamer','OnePlus 13 — Snapdragon 8 Elite at Rs 69,999 with 100W charging. Best performance-per-rupee flagship in India by significant margin.'],
          ['Apple Ecosystem User','iPhone 16 Pro — seamless with Mac, iPad, AirPods. Handoff, AirDrop, Sidecar. The ecosystem integration justifies the premium for existing Apple users.'],
          ['Value-Conscious Buyer','Samsung Galaxy S25 at Rs 79,999 — Snapdragon 8 Elite, 7-year updates, excellent camera, at a notably lower price than S25+ and Ultra.'],
        ].map(([u,r]) => (<div key={u} className="border border-border p-4 bg-white"><h3 className="font-sans text-sm font-bold text-[#1a3a5c] mb-2">{u}</h3><p className="font-sans text-sm text-muted leading-relaxed">{r}</p></div>))}</div>
        <div className="my-8 overflow-hidden"><img src={img4} alt="OnePlus 13 flagship value India 2026" className="w-full h-56 object-cover" loading="lazy" /><p className="font-sans text-xs text-muted mt-1 text-center">OnePlus 13 — Snapdragon 8 Elite at Rs 69,999, best value flagship in India</p></div>
        <h2 className="font-playfair text-2xl font-bold text-ink mt-10 mb-4 pb-2 border-b-2 border-[#d4220a]">Flagship Features That Are Actually Worth Paying For</h2>
        <p className="font-body text-base text-[#2a2a2a] leading-relaxed mb-4">Titanium or premium metal build: worth it for durability. IP68 water resistance: worth it for peace of mind in Indian monsoons. Long-term software support (5-7 years): absolutely worth it — reduces effective annual cost. Periscope telephoto zoom (5x optical): genuinely useful for travel photography. S Pen: only if you actually annotate, sketch, or take handwritten notes.</p>
        <p className="font-body text-base text-[#2a2a2a] leading-relaxed mb-4">Flagship features that are less worth the premium: 8K video (storage and practical use cases are limited), extreme megapixel counts beyond 50MP (diminishing returns in real-world output), curved display edges (prefer flat for screen protector compatibility), and folding phones (still not durable enough for India\'s dust and heat conditions).</p>
        <div className="my-8 overflow-hidden"><img src={img5} alt="flagship phone India titanium premium build durability" className="w-full h-56 object-cover" loading="lazy" /><p className="font-sans text-xs text-muted mt-1 text-center">Titanium builds and IP68 — flagship durability features that genuinely matter in India</p></div>
        
        <h2 className="font-playfair text-2xl font-bold text-ink mt-10 mb-5 pb-2 border-b border-border">Frequently Asked Questions</h2>
        <div className="space-y-4 mb-10">
          {[
            ['Which is the best flagship phone under Rs 1,00,000 in India?','Samsung Galaxy S25 (Rs 79,999) for Android. Snapdragon 8 Elite, 7-year updates, excellent camera. OnePlus 13 (Rs 69,999) for better value with 100W charging. Google Pixel 9 (Rs 79,999) for best camera processing.'],
            ['Is flagship worth buying in India?','Yes, if you plan to keep the phone 4+ years. Flagships with 7-year update support and premium build quality deliver a lower total cost of ownership than replacing budget phones every 2 years. No, if you need to upgrade frequently — buy mid-range and sell before value drops.'],
            ['Which flagship has best resale value in India?','iPhone retains 50-55% value after 2 years. Samsung S-series retains 40-45%. OnePlus flagships retain 30-35%. Pixel retains 35-40%. For maximum resale value over 2 years: buy iPhone. For maximum update longevity value over 5 years: Samsung S25 series (7-year support).'],
            ['Should I buy Samsung S25 Ultra or iPhone 16 Pro Max?','For video creation: iPhone 16 Pro Max. For still photography zoom: S25 Ultra (200MP + 10x). For productivity and S Pen: S25 Ultra. For ecosystem integration with Mac/iPad/AirPods: iPhone. For price (Rs 25,000 less): S25 Ultra.']
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
            {[['Best Camera Phones India','/best-camera-phones-india'], ['Best iPhones India','/best-apple-iphone-india'], ['Samsung Phones India','/best-samsung-phones-india'], ['Phone Comparison Guide','/phone-comparison-guide-india']].map(([l,h]) => (
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
    The best flagship depends on your priorities. Choose iPhone for video and ecosystem, Samsung Ultra for versatility and productivity, and Pixel for pure photography. Instead of chasing specs, focus on how long you plan to use the device — that’s where flagship value becomes clear.
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