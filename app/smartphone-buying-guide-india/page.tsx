// app/smartphone-buying-guide-india/page.tsx
import { Metadata } from 'next'
import Link from 'next/link'
import { getPillarArticles, formatPillarDate } from '@/lib/pillar-utils'
import PillarArticleGrid from '@/components/PillarArticleGrid'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Smartphone Buying Guide India 2026 | The Tech Bharat',
  description: 'Complete smartphone buying guide for Indian buyers. What specs actually matter, how to choose by budget, and common mistakes to avoid. Updated March 2026.',
  alternates: { canonical: 'https://thetechbharat.com/smartphone-buying-guide-india' },
  openGraph: {
    title: 'Smartphone Buying Guide India 2026',
    description: 'The only smartphone buying guide Indian buyers need — specs that matter, budget breakdowns, brand comparison, and honest advice.',
    url: 'https://thetechbharat.com/smartphone-buying-guide-india',
    siteName: 'The Tech Bharat',
    type: 'article',
  },
}

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    { '@type': 'Question', name: 'How much RAM do I need in a smartphone in India?', acceptedAnswer: { '@type': 'Answer', text: 'For most Indian users in 2026, 8GB RAM is the practical sweet spot. 6GB is sufficient for basic WhatsApp, calls, and light social media use. 12GB+ only matters if you do heavy multitasking or gaming — for everyday use the difference is unnoticeable.' } },
    { '@type': 'Question', name: 'Is 5G worth buying in India right now?', acceptedAnswer: { '@type': 'Answer', text: '5G is worth buying if your phone budget is above ₹12,000 and you live in a metro or tier-1 city. Jio and Airtel 5G coverage has expanded significantly. The key is checking n78 band support — not all 5G phones support all Indian 5G bands.' } },
    { '@type': 'Question', name: 'Which is better — AMOLED or LCD display?', acceptedAnswer: { '@type': 'Answer', text: 'AMOLED is better for outdoor visibility, battery life, and vibrant colors. LCD can be better for long reading sessions due to less flicker. For phones above ₹15,000, AMOLED is now standard and recommended for Indian usage conditions including harsh sunlight.' } },
    { '@type': 'Question', name: 'How many years of software updates should I expect?', acceptedAnswer: { '@type': 'Answer', text: 'For a 3-year phone ownership plan, look for at least 3 years of OS updates. Samsung Galaxy S and A-series offer 4-5 years. Google Pixel offers 7 years. Most Chinese brands offer 2-3 years. This directly affects your phone\'s security and resale value.' } },
  ],
}

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://thetechbharat.com' },
    { '@type': 'ListItem', position: 2, name: 'Buying Guides', item: 'https://thetechbharat.com/guides' },
    { '@type': 'ListItem', position: 3, name: 'Smartphone Buying Guide India', item: 'https://thetechbharat.com/smartphone-buying-guide-india' },
  ],
}

export default async function SmartphoneBuyingGuidePage() {
  const guideArticles = await getPillarArticles(['buying guide', 'how to choose', 'best phone', 'worth buying', 'india', 'review'], [], 12)
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <div className="bg-paper min-h-screen">
        <div className="max-w-4xl mx-auto px-4 py-10">

          {/* Breadcrumb */}
          <nav className="font-sans text-xs text-muted mb-6 flex items-center gap-2">
            <Link href="/" className="hover:text-[#d4220a]">Home</Link>
            <span>/</span>
            <Link href="/guides" className="hover:text-[#d4220a]">Guides</Link>
            <span>/</span>
            <span className="text-ink">Smartphone Buying Guide India</span>
          </nav>

          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-3">
              <span className="bg-[#1a3a5c] text-white font-sans text-[10px] font-bold px-2.5 py-1 uppercase tracking-widest">Evergreen Guide</span>
              <span className="font-sans text-xs text-muted">Updated March 2026</span>
            </div>
            <h1 className="font-playfair text-3xl md:text-4xl font-black text-ink leading-tight mb-4">
              The Complete Smartphone Buying Guide for India (2026)
            </h1>
            <p className="font-body text-lg text-[#2a2a2a] leading-relaxed">
              Every Indian smartphone buyer asks the same questions: How much RAM is enough? Is 5G worth it now? Which brand actually gives software updates? This guide cuts through the marketing noise with honest, India-specific answers.
            </p>
            <div className="mt-4 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#1a3a5c] flex items-center justify-center text-white text-xs font-bold">VY</div>
              <div>
                <p className="font-sans text-xs font-semibold text-ink">Vijay Yadav</p>
                <p className="font-sans text-[10px] text-muted">Senior Mobile Editor · The Tech Bharat</p>
              </div>
            </div>
          </div>

          {/* Quick Summary Box */}
          <div className="bg-[#1a3a5c]/5 border-l-4 border-[#1a3a5c] p-5 mb-8">
            <h2 className="font-sans text-sm font-bold text-[#1a3a5c] uppercase tracking-wider mb-3">Quick Answer</h2>
            <ul className="space-y-2">
              {[
                'Budget under ₹15K: Prioritise battery and display over camera megapixels',
                'Budget ₹15K–₹30K: RAM matters less than chipset efficiency and software updates',
                'Budget ₹30K–₹50K: Camera system and update commitment separate good from great',
                'Budget ₹50K+: Ecosystem fit (iOS vs Android) matters more than raw specs',
                'Any budget: Service centre availability is underrated — check it before buying',
              ].map((item, i) => (
                <li key={i} className="font-sans text-sm text-ink flex items-start gap-2">
                  <span className="text-[#d4220a] font-bold flex-shrink-0">✓</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Main Content */}
          <div className="prose-guide space-y-10">

            {/* Section 1 */}
            <section>
              <h2 className="font-playfair text-2xl font-bold text-ink mb-4 pb-2 border-b border-border">1. How to Choose by Budget</h2>
              <p className="font-body text-base text-[#2a2a2a] leading-relaxed mb-4">
                India's smartphone market is one of the most competitive in the world, which means the value per rupee is genuinely excellent — but it also means marketing noise is overwhelming. The first step is matching budget to realistic expectations.
              </p>

              <div className="overflow-x-auto mb-6">
                <table className="w-full border-collapse font-sans text-sm">
                  <thead>
                    <tr className="bg-[#1a3a5c] text-white">
                      <th className="px-3 py-2 text-left">Budget</th>
                      <th className="px-3 py-2 text-left">Best For</th>
                      <th className="px-3 py-2 text-left">What to Prioritise</th>
                      <th className="px-3 py-2 text-left">What to Ignore</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      ['Under ₹10,000', 'Basic calls, WhatsApp, YouTube', 'Battery size, display brightness', 'Camera megapixels, RAM beyond 4GB'],
                      ['₹10K – ₹15K', 'Students, secondary phone', '5G bands, 90Hz display, chipset', 'Ultra-wide cameras at this price'],
                      ['₹15K – ₹25K', 'Daily driver, all-rounder', 'Chipset efficiency, charging speed', 'Number of camera lenses'],
                      ['₹25K – ₹40K', 'Main phone for 3+ years', 'Software updates, camera quality', 'High RAM if software is bloated'],
                      ['₹40K – ₹70K', 'Power users, creators', 'Camera system, build quality', 'Slight spec differences'],
                      ['₹70K+', 'Professionals, ecosystem buyers', 'Ecosystem fit, long-term support', 'Minor benchmark differences'],
                    ].map(([budget, bestFor, prioritise, ignore], i) => (
                      <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        <td className="px-3 py-2 font-semibold border border-border">{budget}</td>
                        <td className="px-3 py-2 border border-border">{bestFor}</td>
                        <td className="px-3 py-2 border border-border text-green-700">{prioritise}</td>
                        <td className="px-3 py-2 border border-border text-red-600">{ignore}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            {/* Section 2 */}
            <section>
              <h2 className="font-playfair text-2xl font-bold text-ink mb-4 pb-2 border-b border-border">2. Specs That Actually Matter (And What Doesn't)</h2>

              <h3 className="font-sans text-lg font-bold text-ink mb-2">RAM: The Most Misunderstood Spec</h3>
              <p className="font-body text-base text-[#2a2a2a] leading-relaxed mb-4">
                8GB RAM is enough for 95% of Indian smartphone users in 2026. The confusion comes from comparing raw numbers without considering software efficiency. A phone with 8GB RAM running stock Android will outperform a 16GB phone running a bloated skin in real-world use. What matters more: how many background apps the software kills aggressively. Test this by opening 10 apps, locking the phone, and returning to earlier apps — if they reload constantly, the software is the issue, not the RAM.
              </p>

              <h3 className="font-sans text-lg font-bold text-ink mb-2">Processor: What the Numbers Mean</h3>
              <p className="font-body text-base text-[#2a2a2a] leading-relaxed mb-4">
                For Indian buyers, three chipset families dominate: Qualcomm Snapdragon (best for gaming performance and battery), MediaTek Dimensity (competitive pricing, improving rapidly), and Samsung Exynos (used in some Galaxy models, historically runs hotter). The fabrication node matters — a 4nm chip uses less power and generates less heat than a 6nm chip at similar performance, which directly affects all-day battery life and comfort during India's summers.
              </p>

              <h3 className="font-sans text-lg font-bold text-ink mb-2">Camera: The Megapixel Myth</h3>
              <p className="font-body text-base text-[#2a2a2a] leading-relaxed mb-4">
                A 50MP camera with a large sensor and good software processing will consistently produce better photos than a 108MP camera with a small sensor and poor software. Indian buyers should evaluate cameras by looking at published sample shots in real Indian lighting conditions — indoor family events, street photography in mixed light, and outdoor portraits in harsh afternoon sun. These are the actual scenarios that matter, not studio sample comparisons.
              </p>

              <h3 className="font-sans text-lg font-bold text-ink mb-2">5G: Is It Worth Paying Extra?</h3>
              <p className="font-body text-base text-[#2a2a2a] leading-relaxed mb-4">
                For any phone above ₹12,000 in 2026, 5G capability is standard and worth having for future-proofing. The critical detail most buyers miss: not all 5G phones support all Indian 5G bands. Jio and Airtel primarily use n78 (3500MHz). Verify that a phone explicitly lists n78 band support before purchasing — this information is in the official spec sheet.
              </p>

              <h3 className="font-sans text-lg font-bold text-ink mb-2">Software Updates: The Overlooked Long-Term Cost</h3>
              <p className="font-body text-base text-[#2a2a2a] leading-relaxed mb-4">
                A phone that stops receiving security updates is a security liability. For buyers planning to keep their phone 3+ years — which is the majority of Indian buyers — software update commitment should be a primary purchase criterion. Current update leaders: Google Pixel (7 years), Samsung Galaxy S/A series (5 years), OnePlus flagship (4 years), most Chinese brands (2-3 years inconsistently).
              </p>
            </section>

            {/* Section 3 */}
            <section>
              <h2 className="font-playfair text-2xl font-bold text-ink mb-4 pb-2 border-b border-border">3. Brand-Wise Honest Assessment for India</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {[
                  { brand: 'Samsung', pro: 'Widest service network in India (3,000+ centres), best update commitment for A-series', con: 'One UI can be heavy, Exynos models run hotter than Snapdragon equivalents' },
                  { brand: 'OnePlus', pro: 'Clean OxygenOS on flagships, fast charging, premium build', con: 'OxygenOS becoming increasingly bloated, update promises sometimes inconsistent on lower models' },
                  { brand: 'Xiaomi / Redmi', pro: 'Exceptional value per rupee, regular updates for major models', con: 'MIUI ads and bloatware need manual removal, aggressive background app killing' },
                  { brand: 'Realme', pro: 'Strong performance-per-rupee, good display choices', con: 'Realme UI bloatware, inconsistent camera quality across range' },
                  { brand: 'iQOO / Vivo', pro: 'Best fast-charging technology in segment, solid gaming performance', con: 'FunTouchOS/OriginOS feels cluttered, service network outside metros limited' },
                  { brand: 'Google Pixel', pro: '7-year updates, best computational photography at price, clean software', con: 'Limited India service centres, higher price than spec sheet suggests' },
                  { brand: 'Nothing', pro: 'Clean Nothing OS, premium build quality, distinctive design', con: 'Shorter update commitment (3 years), limited service network' },
                  { brand: 'Apple / iPhone', pro: '7-year updates, best ecosystem integration, highest resale value', con: 'Premium pricing in India, high import duties make iPhones 30-40% costlier than US' },
                ].map(({ brand, pro, con }) => (
                  <div key={brand} className="border border-border p-4 bg-white">
                    <h3 className="font-sans text-sm font-bold text-ink mb-2">{brand}</h3>
                    <p className="font-sans text-xs text-green-700 mb-1">✓ {pro}</p>
                    <p className="font-sans text-xs text-red-600">✗ {con}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Section 4 */}
            <section>
              <h2 className="font-playfair text-2xl font-bold text-ink mb-4 pb-2 border-b border-border">4. India-Specific Considerations Buyers Miss</h2>

              <h3 className="font-sans text-lg font-bold text-ink mb-2">Service Centre Reality</h3>
              <p className="font-body text-base text-[#2a2a2a] leading-relaxed mb-4">
                Samsung has the most extensive service network in India by far — relevant if you live outside a metro. Apple's authorised service provider network is growing but still concentrated in major cities. Chinese brands often have decent metro coverage but limited tier-2 and tier-3 city presence. For buyers in smaller cities: Samsung or established Indian brands with physical service presence are lower risk.
              </p>

              <h3 className="font-sans text-lg font-bold text-ink mb-2">Heat and Battery in Indian Conditions</h3>
              <p className="font-body text-base text-[#2a2a2a] leading-relaxed mb-4">
                Indian summers regularly hit 40-45°C in northern cities. Smartphones with poor thermal management throttle performance, reduce battery life, and degrade batteries faster in these conditions. Phones with vapour chamber cooling, titanium frames (better heat dissipation), and 4nm or smaller chipsets perform better in Indian summer conditions. Check for thermal throttling mentions in international reviews.
              </p>

              <h3 className="font-sans text-lg font-bold text-ink mb-2">Flipkart vs Amazon vs Brand Store Pricing</h3>
              <p className="font-body text-base text-[#2a2a2a] leading-relaxed mb-4">
                Sale pricing during Big Billion Days, Great Indian Festival, and Republic Day sales can represent 10-20% discounts on phones above ₹20,000. For flagship phones, buying from brand stores directly (Samsung Shop, Apple India, OnePlus.in) ensures authenticity and easier warranty claims. For mid-range, Flipkart exclusive launches (Poco, Realme) and Amazon exclusive launches (OnePlus budget models) are legitimate first-party sales.
              </p>

              <h3 className="font-sans text-lg font-bold text-ink mb-2">IP Rating Reality in India</h3>
              <p className="font-body text-base text-[#2a2a2a] leading-relaxed mb-4">
                IP67 and IP68 ratings are tested in laboratory conditions, not Indian monsoon conditions which include dusty water and variable pressure. The rating provides meaningful protection for incidental splashes and light rain. Deliberately submerging a phone — even IP68-rated — is not covered under warranty. For monsoon season, a good case provides comparable practical protection at significantly lower cost.
              </p>
            </section>

            {/* Section 5 */}
            <section>
              <h2 className="font-playfair text-2xl font-bold text-ink mb-4 pb-2 border-b border-border">5. Common Mistakes Indian Buyers Make</h2>
              <div className="space-y-3">
                {[
                  { mistake: 'Buying the highest RAM variant without checking software', fix: 'Test the lower RAM variant in-store with your actual apps before paying the premium' },
                  { mistake: 'Prioritising camera megapixels over sensor size and software', fix: 'Check sample shots from reviewers in Indian lighting — not manufacturer samples' },
                  { mistake: 'Not checking 5G band compatibility before buying', fix: 'Verify n78 band support in the official spec sheet before purchase' },
                  { mistake: 'Ignoring software update commitment', fix: 'For 3+ year ownership, minimum 3 years of OS updates should be a requirement' },
                  { mistake: 'Buying on spec sheet alone without checking service availability', fix: 'Google "[brand] service centre [your city]" before purchasing' },
                  { mistake: 'Buying new flagship at full price in January-February', fix: 'Flagship launches typically happen with promotions in Q1 — wait for announced price vs sale price' },
                  { mistake: 'Not considering resale value for 2-year upgrade cycles', fix: 'Samsung and Apple hold resale value significantly better than Chinese brands' },
                ].map(({ mistake, fix }, i) => (
                  <div key={i} className="border border-border p-4 bg-white">
                    <p className="font-sans text-sm font-bold text-red-600 mb-1">✗ Mistake: {mistake}</p>
                    <p className="font-sans text-sm text-green-700">✓ Instead: {fix}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Related Guides */}
            <section>
              <h2 className="font-playfair text-2xl font-bold text-ink mb-4 pb-2 border-b border-border">6. Related Buying Guides</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                  { title: 'Best Smartphones in India by Budget', href: '/best-smartphones-india', desc: 'Our top picks at every price point from ₹10K to ₹1L+' },
                  { title: 'Best Camera Phones India', href: '/best-camera-phones-india', desc: 'Camera rankings by budget for Indian photography conditions' },
                  { title: 'Best Battery Backup Phones India', href: '/best-battery-backup-phones-india', desc: 'All-day battery phones for heavy Indian users' },
                  { title: 'Android Battery Health Guide', href: '/android-battery-health-guide', desc: 'How to maintain battery health in Indian conditions' },
                  { title: 'Phone Comparison Hub', href: '/phone-comparison-guide-india', desc: 'Head-to-head comparisons by use case and budget' },
                  { title: 'Best Gaming Phones India', href: '/best-gaming-phones-india', desc: 'Top BGMI and gaming phones at every budget' },
                ].map(({ title, href, desc }) => (
                  <Link key={href} href={href} className="border border-border p-4 bg-white hover:border-[#d4220a] transition-colors group">
                    <h3 className="font-sans text-sm font-bold text-ink group-hover:text-[#d4220a] transition-colors mb-1">{title} →</h3>
                    <p className="font-sans text-xs text-muted">{desc}</p>
                  </Link>
                ))}
              </div>
            </section>

            {/* FAQ */}
            <section>
              <h2 className="font-playfair text-2xl font-bold text-ink mb-6 pb-2 border-b border-border">Frequently Asked Questions</h2>
              <div className="space-y-4">
                {[
                  { q: 'How much RAM do I need in a smartphone in India?', a: 'For most Indian users in 2026, 8GB RAM is the practical sweet spot. 6GB is sufficient for basic WhatsApp, calls, and light social media. 12GB+ only matters for heavy multitasking or intensive gaming. More important than RAM count: how efficiently the software manages memory. Stock Android phones like Pixel perform better with 8GB than bloated-skin phones with 12GB.' },
                  { q: 'Is 5G worth buying in India right now?', a: 'Yes for any phone above ₹12,000 — 5G is now standard at that price point and worth having for future-proofing. The important check: verify n78 band support (3500MHz, used by Jio and Airtel) in the spec sheet. Not all 5G phones support all Indian bands.' },
                  { q: 'Which is better — AMOLED or LCD display?', a: 'AMOLED for most Indian users: better outdoor visibility in harsh sunlight (important for Indian conditions), better battery life with dark themes, more vibrant colors. LCD has better uniformity for reading. For phones above ₹15,000, AMOLED is now standard and preferred.' },
                  { q: 'How many years of software updates should I expect?', a: 'For 3-year ownership: minimum 3 years OS + 4 years security updates. Current leaders — Google Pixel: 7 years; Samsung Galaxy S/A: 5-7 years; OnePlus flagship: 4 years; most Chinese brands: 2-3 years. This affects resale value and security.' },
                  { q: 'Should I buy a phone during sale or at launch price?', a: 'Depends on the price bracket. Budget phones (under ₹15K) see 10-15% sale discounts. Mid-range phones (₹15K-₹40K) typically see ₹2,000-5,000 off during Big Billion Days or Great Indian Festival. Flagships (₹60K+) rarely discount significantly. If a phone launched in the last 3 months, a sale discount is likely within 3-6 months of launch.' },
                ].map(({ q, a }, i) => (
                  <div key={i} className="border border-border p-5 bg-white">
                    <h3 className="font-sans text-sm font-bold text-ink mb-2">{q}</h3>
                    <p className="font-sans text-sm text-muted leading-relaxed">{a}</p>
                  </div>
                ))}
              </div>
            </section>


          {/* Dynamic articles fetched from Redis */}
          <section>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-6 h-0.5 bg-[#d4220a]" />
              <h2 className="font-playfair text-2xl font-bold text-ink">Related Phone Articles & Reviews</h2>
              {guideArticles.length > 0 && <span className="font-sans text-xs text-muted bg-gray-100 px-2 py-0.5 rounded">{guideArticles.length}</span>}
            </div>
            {guideArticles.length === 0 ? (
              <div className="border border-border p-8 text-center bg-white">
                <p className="font-sans text-sm text-muted">Articles loading. <Link href="/mobile-news" className="text-[#d4220a] hover:underline">Browse all mobile news</Link></p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {guideArticles.map(article => (
                  <Link key={article.slug} href={`/${article.slug}`}
                    className="bg-white border border-border hover:border-[#d4220a] transition-colors group block">
                    {article.featuredImage && (
                      <div className="relative overflow-hidden" style={{ paddingBottom: '56.25%' }}>
                        <img src={article.featuredImage} alt={article.title} width={400} height={225} loading="lazy"
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} />
                        <span className="absolute top-2 left-2 bg-[#d4220a] text-white font-sans text-[9px] font-bold px-2 py-0.5 uppercase tracking-wider z-10">
                          {article.type === 'review' ? 'Review' : article.type === 'compare' ? 'Compare' : 'News'}
                        </span>
                      </div>
                    )}
                    <div className="p-3">
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="font-sans text-[10px] font-bold text-[#d4220a] uppercase tracking-wide">{article.brand}</span>
                        <span className="font-sans text-[10px] text-muted ml-auto">{formatPillarDate(article.publishDate)}</span>
                      </div>
                      <h3 className="font-sans text-sm font-bold text-ink leading-snug group-hover:text-[#d4220a] transition-colors line-clamp-2 mb-1">{article.title}</h3>
                      <p className="font-sans text-xs text-muted line-clamp-2">{article.summary}</p>
                      <div className="mt-2 flex justify-between">
                        <span className="font-sans text-[10px] text-muted">{article.readTime} min read</span>
                        <span className="font-sans text-xs font-semibold text-[#d4220a]">Read &#8594;</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </section>

            {/* Editorial Note */}
            <section className="bg-[#f8f4ef] border-l-4 border-[#d4220a] p-5">
              <h2 className="font-sans text-sm font-bold text-[#d4220a] uppercase tracking-wider mb-2">How We Evaluate Phones</h2>
              <p className="font-sans text-sm text-muted leading-relaxed">
                The Tech Bharat covers the Indian smartphone market with a specific focus on what matters for Indian buyers — not just international spec comparisons. Our recommendations consider service network availability, India-specific pricing, 5G band compatibility, performance in Indian climate conditions, and software update track records from the Indian market perspective. This guide is updated regularly as the market changes. Last updated: March 2026.
              </p>
              <p className="font-sans text-xs text-muted mt-2">
                <strong>By Vijay Yadav</strong> — Senior Mobile Editor, 11 years covering Indian smartphone market.
              </p>
            </section>

          </div>
        </div>
      </div>
    </>
  )
}