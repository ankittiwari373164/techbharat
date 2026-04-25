// app/best-phones-for-students-india/page.tsx
import { Metadata } from 'next'
import Link from 'next/link'
import { getPillarArticles, formatPillarDate, currentMonthYear } from '@/lib/pillar-utils'

export const revalidate = 3600

export async function generateMetadata(): Promise<Metadata> {
  const { month, year } = currentMonthYear()
  const title = `Best Phones for Students in India — ${month} ${year}`
  return {
    title: `${title} | The Tech Bharat`,
    description: `Best smartphones for students India 2026 — budget picks for college students with good camera, battery, performance and value.`,
    alternates: { canonical: 'https://thetechbharat.com/best-phones-for-students-india' },
    openGraph: { title, url: 'https://thetechbharat.com/best-phones-for-students-india', type: 'article' },
  }
}

export default async function BestStudentPhonesPage() {
  const { month, year } = currentMonthYear()
  const img1 = "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=1200&q=80"
  const img2 = "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=1200&q=80"
  const img3 = "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=1200&q=80"
  const img4 = "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=1200&q=80"
  const img5 = "https://images.unsplash.com/photo-1522202176988-66273c5b04b5?auto=format&fit=crop&w=1200&q=80"

  const articles = await getPillarArticles(['student phone India', 'best phone for college', 'budget phone student', 'phone under 20000 student'], [], 12, "None")
  const reviews  = articles.filter(a => a.type === 'review' || a.type === 'compare')
  const news     = articles.filter(a => a.type === 'mobile-news')

  return (
    <div className="bg-paper min-h-screen">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://thetechbharat.com' },
          { '@type': 'ListItem', position: 2, name: 'Best Phones for Students in India —', item: 'https://thetechbharat.com/best-phones-for-students-india' },
        ],
      }) }} />

      <div className="max-w-4xl mx-auto px-4 py-10">

        {/* Breadcrumb */}
        <nav className="font-sans text-xs text-muted mb-6 flex items-center gap-2 flex-wrap">
          <Link href="/" className="hover:text-[#d4220a]">Home</Link>
          <span>/</span>
          <Link href="/mobile-news" className="hover:text-[#d4220a]">Mobile News</Link>
          <span>/</span>
          <span className="text-ink">Best Phones for Students in India —</span>
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
            Best Phones for Students in India — {month} {year}
          </h1>
          <p className="font-sans text-base font-semibold text-[#1a3a5c] border-l-4 border-[#1a3a5c] pl-4 mb-2">
            Best phones for college students on a budget — balancing studies, social media, gaming and all-day battery for Indian campuses.
          </p>
        </div>

        {/* Hero image */}
        <div className="mb-8 overflow-hidden">
          <img src={img1} alt="Best Phones for Students in India —" className="w-full h-64 object-cover" loading="eager" />
        </div>

        <p className="font-body text-lg text-[#2a2a2a] leading-relaxed mb-6">Choosing a smartphone as a student in India in {month} {year} involves tradeoffs that general phone guides ignore. You need a phone that handles WhatsApp groups for class notes, Zoom/Teams for online lectures, enough storage for assignment documents and photos, a camera that takes decent Instagram-worthy photos, and battery that survives a full day on campus without hunting for chargers. And you need all of this ideally under Rs 20,000.</p>
        {/* ✅ ADDED: BUYER INTENT BLOCK */}
<div className="bg-[#f8f4ef] border-l-4 border-[#d4220a] p-5 mb-8">
  <h3 className="font-bold text-sm mb-2">Who should buy a student-focused phone?</h3>
  <p className="text-sm text-[#2a2a2a]">
    Students who need a reliable phone for studies, social media, light gaming, and full-day battery without frequent charging should choose a balanced budget smartphone.
  </p>

  <h3 className="font-bold text-sm mt-4 mb-2">Who should NOT buy a student budget phone?</h3>
  <p className="text-sm text-[#2a2a2a]">
    If you need high-end gaming, premium cameras, or long-term flagship performance, spending more on a mid-range or flagship phone will provide better value.
  </p>

  <h3 className="font-bold text-sm mt-4 mb-2">Final Verdict</h3>
  <p className="text-sm text-[#2a2a2a]">
    In {month} {year}, student phones in India offer excellent value — but choosing based on battery, storage, and update support matters more than chasing specs.
  </p>
</div>
        <h2 className="font-playfair text-2xl font-bold text-ink mt-10 mb-4 pb-2 border-b-2 border-[#d4220a]">Best Student Phones India {month} {year}</h2>
        {/* ✅ ADDED: INTERNAL LINK BOOST */}
<p className="font-sans text-sm text-muted mb-6">
  For broader recommendations across all categories, check our{' '}
  <Link href="/best-smartphones-india" className="text-[#d4220a] font-semibold hover:underline">
    Best Smartphones in India
  </Link>{' '}
  and{' '}
  <Link href="/smartphone-buying-guide-india" className="text-[#d4220a] font-semibold hover:underline">
    complete buying guide
  </Link>.
</p>
        <div className="overflow-x-auto mb-8"><table className="w-full border-collapse text-sm font-sans"><thead><tr className="bg-[#1a3a5c] text-white"><th className="px-3 py-2 text-left">Phone</th><th className="px-3 py-2 text-left">Price</th><th className="px-3 py-2 text-left">Best For</th><th className="px-3 py-2 text-left">Battery</th><th className="px-3 py-2 text-left">Rating</th></tr></thead>
        <tbody>{[
          ['Samsung Galaxy M35 5G','Rs 20,999','Best overall student phone','6,000mAh','9.0/10'],
          ['Redmi Note 14 5G','Rs 14,999','Best camera + display under 15k','5,500mAh','8.8/10'],
          ['Samsung Galaxy M15 5G','Rs 13,999','Best long-term support budget','6,000mAh','8.6/10'],
          ['Poco M6 Pro 5G','Rs 15,999','Best for gaming students','5,000mAh','8.4/10'],
          ['Realme Narzo 70 Pro','Rs 17,999','Fastest charging budget phone','5,000mAh + 45W','8.3/10'],
          ['iQOO Z9 Lite 5G','Rs 11,999','Best under Rs 12,000','5,000mAh','8.2/10'],
        ].map(([m,p,b,bt,r],i) => (<tr key={m} className={i%2===0?'bg-white border-b border-border':'bg-gray-50 border-b border-border'}><td className="px-3 py-2 font-semibold">{m}</td><td className="px-3 py-2">{p}</td><td className="px-3 py-2">{b}</td><td className="px-3 py-2">{bt}</td><td className="px-3 py-2 font-bold text-[#d4220a]">{r}</td></tr>))}
        </tbody></table></div>
        <div className="my-8 overflow-hidden"><img src={img2} alt="student phone India college 2026 Samsung Redmi" className="w-full h-56 object-cover" loading="lazy" /><p className="font-sans text-xs text-muted mt-1 text-center">Student phones in India — AMOLED, 5G and all-day battery under Rs 20,000</p></div>
        <h2 className="font-playfair text-2xl font-bold text-ink mt-10 mb-4 pb-2 border-b-2 border-[#d4220a]">Why Samsung Galaxy M35 5G is the Top Student Recommendation</h2>
        <p className="font-body text-base text-[#2a2a2a] leading-relaxed mb-4">The Samsung Galaxy M35 5G at Rs 20,999 is the best student phone in India in {month} {year} for one primary reason that textbook phone reviews miss: 4 years of software updates. A student buying a phone for a 4-year engineering or medical degree needs a phone that will still function well and receive security patches in final year. The M35 5G guarantees exactly this, backed by Samsung\'s 3,000+ service centres across India including college towns.</p>
        <p className="font-body text-base text-[#2a2a2a] leading-relaxed mb-4">The 6,000mAh battery is genuinely important for student use — long college days with heavy WhatsApp usage, music, notes apps, and the occasional gaming session during free periods. The AMOLED 120Hz display is excellent for reading PDFs and digital textbooks. The Exynos 1380 chip handles everything a student needs without breaking a sweat. It is not the most exciting phone at this price, but it is the most sensible one.</p>
        <div className="my-8 overflow-hidden"><img src={img3} alt="college student using smartphone India 2026" className="w-full h-56 object-cover" loading="lazy" /><p className="font-sans text-xs text-muted mt-1 text-center">Campus life demands all-day battery, good display for PDFs and reliable service network</p></div>
        <h2 className="font-playfair text-2xl font-bold text-ink mt-10 mb-4 pb-2 border-b-2 border-[#d4220a]">Student Phone Priorities — Ranked by Importance</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">{[
          ['1. Battery Life (Most Important)','Survive a full campus day without charging. Minimum 5,000mAh recommended. 6,000mAh for students with very long days or frequent commutes.'],
          ['2. Software Update Support','A phone bought for a 4-year degree needs 4 years of security updates. Samsung M-series (4yr) and A-series (5yr) are the only sub-Rs 25,000 options offering this.'],
          ['3. Storage (128GB Minimum)','Class photos, lecture recordings, assignment PDFs, and apps fill up storage fast. 128GB is the practical minimum. MicroSD support extends this cheaply.'],
          ['4. Camera for Notes + Social','Good daylight camera for notes, whiteboard photos, and social media. OIS not essential at budget tier but helps for low-light hostel room photos.'],
          ['5. Display Quality','AMOLED minimum for reading textbooks and PDFs. 90Hz+ for smooth scrolling. Brightness matters for outdoor campus use in Indian summers.'],
          ['6. 5G Support','Future-proof for 2-3 years. 5G premium at this tier is minimal — always choose 5G over 4G even on a student budget in April 2026.'],
        ].map(([p,r]) => (<div key={p} className="border border-border p-4 bg-white"><h3 className="font-sans text-sm font-bold text-[#1a3a5c] mb-2">{p}</h3><p className="font-sans text-sm text-muted leading-relaxed">{r}</p></div>))}</div>
        <div className="my-8 overflow-hidden"><img src={img4} alt="student budget phone India hostel college campus" className="w-full h-56 object-cover" loading="lazy" /><p className="font-sans text-xs text-muted mt-1 text-center">Storage, battery, and update support — the three pillars of a good student phone</p></div>
        <h2 className="font-playfair text-2xl font-bold text-ink mt-10 mb-4 pb-2 border-b-2 border-[#d4220a]">Protecting Your Student Phone — Screen Guards and Cases</h2>
        <p className="font-body text-base text-[#2a2a2a] leading-relaxed mb-4">College environments are physically demanding for phones. Backpack drops, crowded canteen tables, lab surfaces — phones take more daily abuse during college than almost any other phase of life. Spend Rs 400-600 on a proper military-grade drop-tested case (PolyMax or Ringke Fusion available on Amazon) and Rs 200-300 on a quality tempered glass screen protector. These two investments protect a Rs 15,000-20,000 phone far better than insurance plans.</p>
        <div className="my-8 overflow-hidden"><img src={img5} alt="phone protection case screen guard India student" className="w-full h-56 object-cover" loading="lazy" /><p className="font-sans text-xs text-muted mt-1 text-center">A Rs 500 drop-tested case protects your phone better than any insurance plan</p></div>
        
        <h2 className="font-playfair text-2xl font-bold text-ink mt-10 mb-5 pb-2 border-b border-border">Frequently Asked Questions</h2>
        <div className="space-y-4 mb-10">
          {[
            ['Best phone for students under Rs 15,000 in India?','Redmi Note 14 5G (Rs 14,999) for best display and camera. Samsung Galaxy M15 5G (Rs 13,999) for Samsung service and 4-year updates. iQOO Z9 Lite (Rs 11,999) if budget is strict.'],
            ['Is iPhone worth buying for students in India?','Depends on the student\'s ecosystem and budget. iPhone 15 Certified Refurbished (Rs 44,900) is an excellent student phone with 5+ years of updates. For most students on a budget, the Samsung Galaxy M35 5G delivers comparable everyday utility at 1/3 the price.'],
            ['Which phone is best for online classes and Zoom?','Any phone with at least 4GB RAM and a good display. Samsung Galaxy M35 5G and Redmi Note 14 5G both handle Zoom, Google Meet, and Microsoft Teams without issues. Ensure you have reliable Wi-Fi — phone specs matter less than internet quality for online classes.'],
            ['Should students buy a phone with MicroSD card slot?','Yes — if you will store lecture recordings, PDFs, and photos over 4 years, MicroSD expandability is valuable. Redmi Note 14 5G and Samsung Galaxy M15/M35 5G all include MicroSD slots. Poco M6 Pro 5G does not.']
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
            {[['Best Budget Phones India','/best-budget-phones-india'], ['Best 5G Phones India','/best-5g-phones-india'], ['Best Battery Phones India','/best-battery-backup-phones-india'], ['Smartphone Buying Guide','/smartphone-buying-guide-india']].map(([l,h]) => (
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
    The best student phone depends on your priorities. Choose Samsung for long-term updates and reliability, Redmi for better display and camera, and iQOO or Poco for performance and gaming. Don’t try to get everything — choose based on what you actually use daily.
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