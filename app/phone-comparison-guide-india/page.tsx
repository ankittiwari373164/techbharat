// app/phone-comparison-guide-india/page.tsx
import { Metadata } from 'next'
import Link from 'next/link'
import { getPillarArticles, formatPillarDate, currentMonthYear } from '@/lib/pillar-utils'

export const revalidate = 3600

export async function generateMetadata(): Promise<Metadata> {
  const { month, year } = currentMonthYear()
  const title = `Phone Comparison Guide India — ${month} ${year}`
  return {
    title: `${title} | The Tech Bharat`,
    description: `Phone comparison guide India 2026 — how to compare smartphones across brands. Samsung vs OnePlus, Android vs iPhone, budget vs flagship explained.`,
    alternates: { canonical: 'https://thetechbharat.com/phone-comparison-guide-india' },
    openGraph: { title, url: 'https://thetechbharat.com/phone-comparison-guide-india', type: 'article' },
  }
}

export default async function PhoneComparisonGuidePage() {
  const { month, year } = currentMonthYear()
  const img1 = "https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?auto=format&fit=crop&w=1200&q=80"
  const img2 = "https://images.unsplash.com/photo-1585060544812-6b45742d762f?auto=format&fit=crop&w=1200&q=80"
  const img3 = "https://images.unsplash.com/photo-1606041011872-596597976b25?auto=format&fit=crop&w=1200&q=80"
  const img4 = "https://images.unsplash.com/photo-1510557880182-3d4d3cad945a?auto=format&fit=crop&w=1200&q=80"
  const img5 = "https://images.unsplash.com/photo-1565849904461-04a58ad377e0?auto=format&fit=crop&w=1200&q=80"

  const articles = await getPillarArticles(['phone comparison India', 'compare smartphones India', 'Samsung vs OnePlus', 'Android vs iPhone India'], [], 12, "None")
  const reviews  = articles.filter(a => a.type === 'review' || a.type === 'compare')
  const news     = articles.filter(a => a.type === 'mobile-news')

  return (
    <div className="bg-paper min-h-screen">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://thetechbharat.com' },
          { '@type': 'ListItem', position: 2, name: 'Phone Comparison Guide India —', item: 'https://thetechbharat.com/phone-comparison-guide-india' },
        ],
      }) }} />

      <div className="max-w-4xl mx-auto px-4 py-10">

        {/* Breadcrumb */}
        <nav className="font-sans text-xs text-muted mb-6 flex items-center gap-2 flex-wrap">
          <Link href="/" className="hover:text-[#d4220a]">Home</Link>
          <span>/</span>
          <Link href="/mobile-news" className="hover:text-[#d4220a]">Mobile News</Link>
          <span>/</span>
          <span className="text-ink">Phone Comparison Guide India —</span>
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
            Phone Comparison Guide India — {month} {year}
          </h1>
          <p className="font-sans text-base font-semibold text-[#1a3a5c] border-l-4 border-[#1a3a5c] pl-4 mb-2">
            How to compare phones in India — side-by-side analysis of India\'s most popular phone matchups across all price tiers.
          </p>
        </div>

        {/* Hero image */}
        <div className="mb-8 overflow-hidden">
          <img src={img1} alt="Phone Comparison Guide India —" className="w-full h-64 object-cover" loading="eager" />
        </div>

        <p className="font-body text-lg text-[#2a2a2a] leading-relaxed mb-6">Choosing between two phones is one of the hardest consumer decisions — particularly in India where brands spend millions making their specs sound comparable while hiding the meaningful differences. This guide walks through the most common phone comparison dilemmas that Indian buyers face in {month} {year}, with clear verdicts that cut through the marketing.</p>
        {/* ✅ ADDED: BUYER INTENT BLOCK */}
<div className="bg-[#f8f4ef] border-l-4 border-[#d4220a] p-5 mb-8">
  <h3 className="font-bold text-sm mb-2">Who should use a phone comparison guide?</h3>
  <p className="text-sm text-[#2a2a2a]">
    This guide is ideal for buyers confused between two or more phones in the same price range, especially when specifications look similar but real-world performance differs.
  </p>

  <h3 className="font-bold text-sm mt-4 mb-2">Who does NOT need comparison?</h3>
  <p className="text-sm text-[#2a2a2a]">
    If you already know your priority — like camera, gaming, or battery — a dedicated buying guide may help you more than detailed comparisons.
  </p>

  <h3 className="font-bold text-sm mt-4 mb-2">Final Verdict</h3>
  <p className="text-sm text-[#2a2a2a]">
    In {month} {year}, comparing phones is less about specs and more about real-world priorities like service network, update support, and long-term usability in India.
  </p>
</div>
        <h2 className="font-playfair text-2xl font-bold text-ink mt-10 mb-4 pb-2 border-b-2 border-[#d4220a]">Samsung Galaxy A55 5G vs OnePlus 13R — The Rs 40,000 Battle</h2>
        {/* ✅ ADDED: INTERNAL LINK BOOST */}
<p className="font-sans text-sm text-muted mb-6">
  For complete recommendations instead of comparisons, check our{' '}
  <Link href="/best-smartphones-india" className="text-[#d4220a] font-semibold hover:underline">
    Best Smartphones in India
  </Link>{' '}
  and{' '}
  <Link href="/smartphone-buying-guide-india" className="text-[#d4220a] font-semibold hover:underline">
    smartphone buying guide
  </Link>.
</p>
        <div className="overflow-x-auto mb-6"><table className="w-full border-collapse text-sm font-sans"><thead><tr className="bg-[#1a3a5c] text-white"><th className="px-3 py-2 text-left">Feature</th><th className="px-3 py-2 text-left">Samsung Galaxy A55 5G</th><th className="px-3 py-2 text-left">OnePlus 13R</th></tr></thead>
        <tbody>{[
          ['Price','Rs 39,999','Rs 44,999'],
          ['Processor','Exynos 1480','Snapdragon 8 Gen 2'],
          ['Display','6.6" AMOLED 120Hz','6.78" AMOLED 120Hz'],
          ['Main Camera','50MP OIS f/1.8','50MP OIS f/1.8'],
          ['Battery','5,000mAh 25W','5,500mAh 80W'],
          ['OS Updates','5 years','4 years'],
          ['Water Resistance','IP67','IP65'],
          ['Service Network','3,000+ centres','200+ centres'],
          ['Winner','Update support + service','Performance + charging'],
        ].map(([f,s,o],i) => (<tr key={f} className={i%2===0?'bg-white border-b border-border':'bg-gray-50 border-b border-border'}><td className="px-3 py-2 font-semibold">{f}</td><td className="px-3 py-2">{s}</td><td className="px-3 py-2">{o}</td></tr>))}
        </tbody></table></div>
        <p className="font-body text-base text-[#2a2a2a] leading-relaxed mb-6"><strong>Verdict:</strong> Buy Samsung A55 5G if you live outside metros or plan to keep the phone 5 years. Buy OnePlus 13R if you live in a city with OnePlus service and want faster charging and gaming performance.</p>

        <div className="my-8 overflow-hidden"><img src={img2} alt="Samsung Galaxy A55 5G vs OnePlus 13R comparison India" className="w-full h-56 object-cover" loading="lazy" /><p className="font-sans text-xs text-muted mt-1 text-center">A55 5G vs 13R — different priorities, both excellent at their respective strengths</p></div>

        <h2 className="font-playfair text-2xl font-bold text-ink mt-10 mb-4 pb-2 border-b-2 border-[#d4220a]">iPhone 16 vs Google Pixel 9 — The Rs 80,000 Premium Dilemma</h2>
        <div className="overflow-x-auto mb-6"><table className="w-full border-collapse text-sm font-sans"><thead><tr className="bg-[#1a3a5c] text-white"><th className="px-3 py-2 text-left">Feature</th><th className="px-3 py-2 text-left">Apple iPhone 16</th><th className="px-3 py-2 text-left">Google Pixel 9</th></tr></thead>
        <tbody>{[
          ['Price','Rs 79,900','Rs 79,999'],
          ['Chip','A18','Google Tensor G4'],
          ['Main Camera','48MP f/1.6 OIS','50MP f/1.68 OIS'],
          ['Zoom','2x (crop)','2x (crop)'],
          ['Video','4K/60fps + ProRes','4K/60fps + Video Boost'],
          ['Battery','3,561mAh 25W','4,558mAh 21W'],
          ['OS Updates','7 years iOS','7 years Android'],
          ['India Service','100+ authorised','Limited metros only'],
        ].map(([f,s,o],i) => (<tr key={f} className={i%2===0?'bg-white border-b border-border':'bg-gray-50 border-b border-border'}><td className="px-3 py-2 font-semibold">{f}</td><td className="px-3 py-2">{s}</td><td className="px-3 py-2">{o}</td></tr>))}
        </tbody></table></div>
        <p className="font-body text-base text-[#2a2a2a] leading-relaxed mb-6"><strong>Verdict:</strong> Google Pixel 9 wins on camera intelligence and battery size. iPhone 16 wins on video quality and ecosystem. Buy Pixel 9 if you\'re in a metro and want the best Android camera experience. Buy iPhone 16 if you\'re in Apple ecosystem or value video quality and resale value.</p>

        <div className="my-8 overflow-hidden"><img src={img3} alt="iPhone 16 vs Google Pixel 9 camera comparison India" className="w-full h-56 object-cover" loading="lazy" /><p className="font-sans text-xs text-muted mt-1 text-center">iPhone 16 vs Pixel 9 — same price, different strengths: video vs computational photography</p></div>

        <h2 className="font-playfair text-2xl font-bold text-ink mt-10 mb-4 pb-2 border-b-2 border-[#d4220a]">Android vs iPhone — The Comprehensive India Comparison</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">{[
          ['Why Choose Android','More price flexibility across all budgets. Better file management and USB versatility. More hardware customisation options. Better integration with Indian apps historically (some banking apps). Better for users who switch between Windows PCs.'],
          ['Why Choose iPhone','Best resale value in India (50%+ after 2 years). Best video quality across all price tiers. Seamless ecosystem with Mac, iPad, AirPods. iOS privacy features are industry-leading. 7-year update support matching Samsung now.'],
          ['Android Wins For','Buyers on any budget (options from Rs 8,000). Power users who want file freedom. Indian banking app users (most now work on iOS too). Gamers who want dedicated gaming phones.'],
          ['iPhone Wins For','Buyers who own MacBook or iPad. Content creators prioritising video quality. Those who upgrade frequently and value resale. Business users wanting the most secure mobile platform.'],
        ].map(([t,r]) => (<div key={t} className="border border-border p-4 bg-white"><h3 className="font-sans text-sm font-bold text-[#1a3a5c] mb-2">{t}</h3><p className="font-sans text-sm text-muted leading-relaxed">{r}</p></div>))}</div>

        <div className="my-8 overflow-hidden"><img src={img4} alt="Android vs iPhone India comparison 2026" className="w-full h-56 object-cover" loading="lazy" /><p className="font-sans text-xs text-muted mt-1 text-center">Android vs iOS — the choice is about ecosystem fit, not just specifications</p></div>

        <h2 className="font-playfair text-2xl font-bold text-ink mt-10 mb-4 pb-2 border-b-2 border-[#d4220a]">Redmi vs Samsung — Budget to Mid-Range</h2>
        <p className="font-body text-base text-[#2a2a2a] leading-relaxed mb-4">Redmi (Xiaomi sub-brand) consistently delivers more hardware per rupee than Samsung in the Rs 10,000-20,000 range. The Redmi Note 14 5G at Rs 14,999 beats the Samsung Galaxy M15 5G (Rs 13,999) on display brightness, camera processing, and performance. Samsung wins on: software update longevity (4 years vs 2 years), service network in smaller cities, and the intangible trust factor that makes Samsung the default recommendation in rural India.</p>
        <p className="font-body text-base text-[#2a2a2a] leading-relaxed mb-4">The Redmi vs Samsung question simplifies to: how long are you keeping the phone, and where do you live? City buyer, 2-year upgrade cycle: Redmi. Town buyer, 3+ year ownership: Samsung. This is the most useful framework for most Indian buyers comparing these two brands at budget price points.</p>

        <div className="my-8 overflow-hidden"><img src={img5} alt="Redmi vs Samsung budget phones India comparison" className="w-full h-56 object-cover" loading="lazy" /><p className="font-sans text-xs text-muted mt-1 text-center">Redmi vs Samsung — specs vs longevity, a fundamental tradeoff for Indian budget buyers</p></div>
        
        <h2 className="font-playfair text-2xl font-bold text-ink mt-10 mb-5 pb-2 border-b border-border">Frequently Asked Questions</h2>
        <div className="space-y-4 mb-10">
          {[
            ['Should I buy Samsung or OnePlus in India?','Samsung for: long-term support (5-7yr updates), service in smaller cities, camera consistency. OnePlus for: charging speed (80-100W), gaming performance, value at flagship tier. Location matters most — if OnePlus service is accessible, their Rs 44,999-69,999 phones offer excellent value.'],
            ['Is Android or iPhone better for Indian users?','For most Indian buyers: Android (more budget flexibility, better hardware variety). For buyers who already own Mac/iPad: iPhone (ecosystem integration). For video creators: iPhone (ProRes video). For long-term owners: either Samsung or iPhone now both offer 7-year support.'],
            ['How do I compare phones effectively?','Focus on: processor generation, display type (AMOLED vs LCD), battery capacity, years of software support, and available service centres in your city. Ignore: megapixel count claims, virtual RAM, and AI feature marketing. Check YouTube reviews and specific camera comparison videos for the phones you\'re considering.'],
            ['Is a refurbished phone worth buying in India?','Apple Certified Refurbished iPhones (apple.com/in) are safe — Apple warranty, tested to new standards. Other brand refurbished phones are risky unless from Samsung certified channels. Avoid non-certified refurbished phones on Amazon/Flipkart — fraud risk is high.']
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
            {[['Best Smartphones India','/best-smartphones-india'], ['Buying Guide India','/smartphone-buying-guide-india'], ['Best Budget Phones','/best-budget-phones-india'], ['Best Flagship Phones','/best-flagship-phones-india']].map(([l,h]) => (
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
    The best phone is not always the one with better specs — it is the one that fits your usage. Choose based on how long you will keep the phone, where you live, and what you actually use daily. In India, service availability and update support often matter more than raw performance.
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