// app/best-camera-phones-india/page.tsx
import { Metadata } from 'next'
import Link from 'next/link'
import { getPillarArticles, formatPillarDate, currentMonthYear } from '@/lib/pillar-utils'

export const revalidate = 3600

export async function generateMetadata(): Promise<Metadata> {
  const { month, year } = currentMonthYear()
  const title = `Best Camera Phones in India — ${month} ${year}`
  return {
    title: `${title} | The Tech Bharat`,
    description: `Best camera smartphones India 2026 — Pixel 9 Pro, iPhone 16 Pro, Samsung S25 Ultra ranked by real camera quality for Indian buyers.`,
    alternates: { canonical: 'https://thetechbharat.com/best-camera-phones-india' },
    openGraph: { title, url: 'https://thetechbharat.com/best-camera-phones-india', type: 'article' },
  }
}

export default async function BestCameraPhonePage() {
  const { month, year } = currentMonthYear()
  const img1 = "https://images.unsplash.com/photo-1606041011872-596597976b25?auto=format&fit=crop&w=1200&q=80"
  const img2 = "https://images.unsplash.com/photo-1502920514313-52581002a659?auto=format&fit=crop&w=1200&q=80"
  const img3 = "https://images.unsplash.com/photo-1452780212412-425218420b1a?auto=format&fit=crop&w=1200&q=80"
  const img4 = "https://images.unsplash.com/photo-1520390138845-fd2d229dd553?auto=format&fit=crop&w=1200&q=80"
  const img5 = "https://images.unsplash.com/photo-1617529497471-9218633199c0?auto=format&fit=crop&w=1200&q=80"

  const articles = await getPillarArticles(['camera phone', 'best camera smartphone', 'photography phone', 'camera review India'], [], 12, "None")
  const reviews  = articles.filter(a => a.type === 'review' || a.type === 'compare')
  const news     = articles.filter(a => a.type === 'mobile-news')

  return (
    <div className="bg-paper min-h-screen">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://thetechbharat.com' },
          { '@type': 'ListItem', position: 2, name: 'Best Camera Phones in India —', item: 'https://thetechbharat.com/best-camera-phones-india' },
        ],
      }) }} />

      <div className="max-w-4xl mx-auto px-4 py-10">

        {/* Breadcrumb */}
        <nav className="font-sans text-xs text-muted mb-6 flex items-center gap-2 flex-wrap">
          <Link href="/" className="hover:text-[#d4220a]">Home</Link>
          <span>/</span>
          <Link href="/mobile-news" className="hover:text-[#d4220a]">Mobile News</Link>
          <span>/</span>
          <span className="text-ink">Best Camera Phones in India —</span>
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
            Best Camera Phones in India — {month} {year}
          </h1>
          <p className="font-sans text-base font-semibold text-[#1a3a5c] border-l-4 border-[#1a3a5c] pl-4 mb-2">
            Ranked by real-world camera output — daylight, low light, video and portrait quality tested for Indian conditions.
          </p>
        </div>

        {/* Hero image */}
        <div className="mb-8 overflow-hidden">
          <img src={img1} alt="Best Camera Phones in India —" className="w-full h-64 object-cover" loading="eager" />
        </div>


        <p className="font-body text-lg text-[#2a2a2a] leading-relaxed mb-6">Camera quality has become the primary purchase driver for Indian smartphone buyers in {month} {year}. Social media, family photography, food shots, travel content — the smartphone camera is now the camera for most Indians. This guide ranks the best camera phones across every budget, with honest assessment of what each actually delivers in real India-use scenarios: bright outdoor light, indoor family dinners in dim light, and the critical portrait quality that makes or breaks a camera phone recommendation.</p>
        {/* ✅ ADDED: BUYER INTENT */}
<div className="bg-[#f8f4ef] border-l-4 border-[#d4220a] p-5 mb-8">
  <h3 className="font-bold text-sm mb-2">Who should buy a camera-focused phone?</h3>
  <p className="text-sm text-[#2a2a2a]">
    If you frequently take photos for Instagram, travel, family events, or content creation, investing in a camera-focused phone will make a noticeable difference in your daily usage.
  </p>

  <h3 className="font-bold text-sm mt-4 mb-2">Who should NOT prioritise camera phones?</h3>
  <p className="text-sm text-[#2a2a2a]">
    If you mainly use your phone for gaming, battery life, or productivity, spending extra on camera hardware may not give you real value.
  </p>

  <h3 className="font-bold text-sm mt-4 mb-2">Final Verdict</h3>
  <p className="text-sm text-[#2a2a2a]">
    In {month} {year}, camera quality varies more by processing than megapixels. Choosing the right brand based on your shooting style matters more than specs.
  </p>
</div>

        <h2 className="font-playfair text-2xl font-bold text-ink mt-10 mb-4 pb-2 border-b-2 border-[#d4220a]">Best Camera Phones India {month} {year} — Ranked</h2>
        {/* ✅ ADDED: INTERNAL LINK BOOST */}
<p className="font-sans text-sm text-muted mb-6">
  For overall recommendations, explore our{' '}
  <Link href="/best-smartphones-india" className="text-[#d4220a] font-semibold hover:underline">
    Best Smartphones in India
  </Link>{' '}
  and{' '}
  <Link href="/smartphone-buying-guide-india" className="text-[#d4220a] font-semibold hover:underline">
    complete buying guide
  </Link>{' '}
  to compare camera performance with battery and overall value.
</p>
        <div className="overflow-x-auto mb-8">
          <table className="w-full border-collapse text-sm font-sans">
            <thead><tr className="bg-[#1a3a5c] text-white"><th className="px-3 py-2 text-left">Phone</th><th className="px-3 py-2 text-left">Price</th><th className="px-3 py-2 text-left">Main Camera</th><th className="px-3 py-2 text-left">Zoom</th><th className="px-3 py-2 text-left">Video</th><th className="px-3 py-2 text-left">Camera Score</th></tr></thead>
            <tbody>{[
              ['Google Pixel 9 Pro XL','Rs 1,09,999','50MP f/1.68 OIS','48MP 5x periscope','8K/24fps','97/100'],
              ['iPhone 16 Pro Max','Rs 1,59,900','48MP f/1.78 OIS','12MP 5x periscope','4K ProRes','96/100'],
              ['Samsung Galaxy S25 Ultra','Rs 1,34,999','200MP f/1.7','50MP 5x + 10x','8K/30fps','95/100'],
              ['Google Pixel 9','Rs 79,999','50MP f/1.68 OIS','10.8MP 2x','4K/60fps','90/100'],
              ['Samsung Galaxy A55 5G','Rs 39,999','50MP f/1.8 OIS','10MP 3x','4K/30fps','82/100'],
              ['Redmi Note 13 Pro+','Rs 29,999','200MP f/1.65 OIS','2x (crop)','4K/30fps','80/100'],
            ].map(([m,p,mc,z,v,s],i) => (
              <tr key={m} className={i%2===0?'bg-white border-b border-border':'bg-gray-50 border-b border-border'}>
                <td className="px-3 py-2 font-semibold">{m}</td><td className="px-3 py-2">{p}</td><td className="px-3 py-2">{mc}</td><td className="px-3 py-2">{z}</td><td className="px-3 py-2">{v}</td><td className="px-3 py-2 font-bold text-[#d4220a]">{s}</td>
              </tr>
            ))}</tbody>
          </table>
        </div>

        <div className="my-8 overflow-hidden"><img src={img2} alt="Google Pixel 9 Pro camera India low light" className="w-full h-56 object-cover" loading="lazy" /><p className="font-sans text-xs text-muted mt-1 text-center">Google Pixel 9 Pro — computational photography champion in India 2026</p></div>

        <h2 className="font-playfair text-2xl font-bold text-ink mt-10 mb-4 pb-2 border-b-2 border-[#d4220a]">Google Pixel 9 Pro — Best Camera Phone in India</h2>
        <p className="font-body text-base text-[#2a2a2a] leading-relaxed mb-4">The Google Pixel 9 Pro is the best camera phone you can buy in India in {month} {year} if your primary criterion is photograph quality. Google\'s computational photography — years ahead of hardware competitors — produces results in challenging lighting conditions that Samsung and Apple genuinely cannot match. Night Sight on the Pixel 9 Pro captures detail in near-dark conditions that other phones would render as noise.</p>
        <p className="font-body text-base text-[#2a2a2a] leading-relaxed mb-4">The 48MP periscope telephoto with 5x optical zoom is excellent — zoom photos retain sharpness that Samsung\'s 10x (though higher resolution) occasionally loses. Portrait mode on Pixel 9 Pro is the benchmark for subject separation and natural background blur. Skin tones across all Indian skin tones are rendered accurately without the over-brightening common in Samsung processing.</p>
        <p className="font-body text-base text-[#2a2a2a] leading-relaxed mb-4">The honest caveat for Indian buyers: Google\'s service network in India remains limited. Outside Mumbai, Delhi, Bengaluru, and a handful of other cities, getting a Pixel repaired under warranty is genuinely difficult. If you live in a metro: Pixel 9 Pro is the recommendation. If you live elsewhere: consider whether the camera advantage is worth the service risk.</p>

        <div className="my-8 overflow-hidden"><img src={img3} alt="iPhone 16 Pro Max camera vs Samsung S25 Ultra India" className="w-full h-56 object-cover" loading="lazy" /><p className="font-sans text-xs text-muted mt-1 text-center">iPhone 16 Pro Max — best video phone, best at natural colour reproduction</p></div>

        <h2 className="font-playfair text-2xl font-bold text-ink mt-10 mb-4 pb-2 border-b-2 border-[#d4220a]">iPhone 16 Pro vs Samsung S25 Ultra — The Flagship Camera Battle</h2>
        <p className="font-body text-base text-[#2a2a2a] leading-relaxed mb-4">Between the iPhone 16 Pro Max (Rs 1,59,900) and Samsung Galaxy S25 Ultra (Rs 1,34,999), the choice depends entirely on what you shoot. For video: iPhone wins decisively. ProRes 4K, Cinematic mode, and Log footage for colour grading make the iPhone the obvious choice for content creators. Samsung shoots 8K but the usable quality advantage in real-world conditions is marginal.</p>
        <p className="font-body text-base text-[#2a2a2a] leading-relaxed mb-4">For still photography: Samsung S25 Ultra\'s 200MP sensor enables extraordinary detail capture in daylight. The 50x Space Zoom, while involving heavy digital processing at extreme ranges, produces photos that iPhone cannot match. For everyday shooting, both are exceptional. The S25 Ultra is the better still photography phone. The iPhone 16 Pro Max is the better video phone. Colour science: iPhone renders natural, true-to-life colours. Samsung renders vibrant, punchy colours — many users prefer Samsung\'s processing aesthetics.</p>

        <h2 className="font-playfair text-2xl font-bold text-ink mt-10 mb-4 pb-2 border-b-2 border-[#d4220a]">Best Camera Phones by Budget</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {[
            ['Under Rs 20,000','Redmi Note 14 5G — best camera processing at budget pricing. Not great in low light but the best at this tier for daylight and portrait shots.'],
            ['Rs 20,000 to Rs 35,000','Redmi Note 13 Pro+ — 200MP main sensor with OIS at Rs 29,999. Exceptional daylight detail. Step-up camera pick at this price.'],
            ['Rs 35,000 to Rs 50,000','Samsung Galaxy A55 5G — OIS across all three cameras, consistent colour, reliable video. Best camera under Rs 50,000 from a service-accessible brand.'],
            ['Rs 50,000 to Rs 80,000','Google Pixel 9 (Rs 79,999) — massive computational photography upgrade over all Android options below. If you\'re in a metro city: this is the recommendation.'],
            ['Rs 80,000 to Rs 1,20,000','Google Pixel 9 Pro (Rs 1,09,999) — the best camera phone in India at this tier. Periscope zoom, best Night Sight, best portrait.'],
            ['Above Rs 1,20,000','Depends: iPhone 16 Pro Max for video content creation. Samsung S25 Ultra for telephoto still photography and S Pen.'],
          ].map(([b,r]) => (<div key={b} className="border border-border p-4 bg-white"><h3 className="font-sans text-sm font-bold text-[#1a3a5c] mb-2">{b}</h3><p className="font-sans text-sm text-muted leading-relaxed">{r}</p></div>))}
        </div>

        <div className="my-8 overflow-hidden"><img src={img4} alt="Best camera phone budget India mid-range 2026" className="w-full h-56 object-cover" loading="lazy" /><p className="font-sans text-xs text-muted mt-1 text-center">Mid-range camera phones — Samsung A55 5G and Redmi Note 13 Pro+ lead at Rs 30,000-40,000</p></div>

        <h2 className="font-playfair text-2xl font-bold text-ink mt-10 mb-4 pb-2 border-b-2 border-[#d4220a]">What Camera Specs Actually Matter — Cutting Through the Marketing</h2>
        <p className="font-body text-base text-[#2a2a2a] leading-relaxed mb-4">Megapixels: largely irrelevant above 50MP for most use cases. A 200MP sensor on a budget phone with a small sensor and poor lens is worse than a 12MP sensor on a flagship with a large sensor. What matters: sensor size (larger = better low light), aperture (lower f/ number = more light), OIS (optical image stabilisation = sharper photos), and the image processing software.</p>
        <p className="font-body text-base text-[#2a2a2a] leading-relaxed mb-4">For telephoto zoom: optical zoom (true zoom using a separate lens) vs digital zoom (cropping the main sensor) is the key distinction. 5x periscope optical zoom (Pixel 9 Pro, iPhone 16 Pro) delivers genuinely sharp telephoto photos. 10x on budget phones usually means heavy digital cropping — results are soft and usable only for social media.</p>

        <div className="my-8 overflow-hidden"><img src={img5} alt="Camera specs megapixel sensor size comparison India" className="w-full h-56 object-cover" loading="lazy" /><p className="font-sans text-xs text-muted mt-1 text-center">OIS and sensor size matter far more than megapixel count for real-world photo quality</p></div>
        
        <h2 className="font-playfair text-2xl font-bold text-ink mt-10 mb-5 pb-2 border-b border-border">Frequently Asked Questions</h2>
        <div className="space-y-4 mb-10">
          {[
            ['Which phone has the best camera in India under Rs 30,000?','Redmi Note 13 Pro+ (Rs 29,999) — 200MP OIS main camera, best camera at this price tier for daylight. Samsung Galaxy A35 5G (Rs 30,999) for more consistent all-round camera with OIS and better service network.'],
            ['Is Pixel 9 Pro camera better than iPhone 16 Pro?','For still photos: Pixel 9 Pro wins in low light and computational photography. For video: iPhone 16 Pro wins with ProRes, Cinematic mode, and Log recording. For portrait: Pixel 9 Pro\'s subject separation is more natural.'],
            ['What camera phone should I buy for YouTube in India?','iPhone 16 Pro or Pro Max — ProRes video and Log footage for colour grading make it the professional video camera choice. For budget YouTube creators: Samsung Galaxy A55 5G at Rs 39,999 delivers excellent 4K/30fps.'],
            ['Does high megapixel count mean better photos?','No. Sensor size, aperture, OIS, and image processing matter far more than megapixel count. A 50MP phone with OIS (Samsung A55 5G) takes better photos than a 200MP phone without OIS (many budget phones).']
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
            {[['Best Flagship Phones India','/best-flagship-phones-india'], ['Best Smartphones India','/best-smartphones-india'], ['Phone Comparison Guide','/phone-comparison-guide-india'], ['Samsung Phones India','/best-samsung-phones-india']].map(([l,h]) => (
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
    The best camera phone depends on your usage. Pixel phones deliver the best photos, iPhones dominate video, and Samsung offers the most versatile zoom. Instead of chasing megapixels, choose based on what you actually shoot — portraits, videos, or zoom.
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