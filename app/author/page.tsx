import type { Metadata } from 'next'
import { getAllArticlesAsync } from '@/lib/store'
import ArticleCard from '@/components/ArticleCard'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Vijay Yadav – Founder & Senior Mobile Editor | The Tech Bharat',
  description: 'Vijay Yadav is the founder of The Tech Bharat and a mobile technology journalist with 11 years of experience covering Indian smartphones. 300+ device reviews.',
  alternates: { canonical: 'https://thetechbharat.com/author' },
  openGraph: {
    title: 'Vijay Yadav – Mobile Tech Journalist, India',
    description: '11 years covering Indian smartphones. 300+ device reviews. Founder of The Tech Bharat.',
  }
}

export default async function AuthorPage() {
  const allArticles = await getAllArticlesAsync()
  const recent = allArticles
  .filter((a: any) => {
    const quality = a.contentQuality ?? 5
    return quality >= 6 && !a.isLowValue
  })
  .slice(0, 6)

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">

      {/* Hero Author Card */}
      <div className="bg-white border-2 border-[#d4220a] p-8 mb-10">
        <div className="flex flex-col sm:flex-row gap-6 items-start">
          <div className="flex-shrink-0 w-24 h-24 rounded-full bg-[#d4220a] flex items-center justify-center text-white font-playfair text-3xl font-bold shadow-lg">
            VY
          </div>
          <div className="flex-1">
            <div className="flex flex-wrap items-start justify-between gap-3 mb-1">
              <div>
                <h1 className="font-playfair text-3xl font-black text-ink">Vijay Yadav</h1>
                <p className="font-sans text-sm font-bold text-[#d4220a] mt-0.5">Founder & Senior Mobile Editor</p>
              </div>
              <span className="font-sans text-xs text-muted border border-border px-3 py-1.5">📍 New Delhi, India</span>
            </div>

            {/* Credential bar */}
            <div className="flex flex-wrap gap-2 my-3">
              <span className="font-sans text-xs bg-[#d4220a] text-white px-2 py-1 font-semibold">11 Years Experience</span>
              <span className="font-sans text-xs bg-[#1a3a5c] text-white px-2 py-1 font-semibold">300+ Devices Reviewed</span>
              <span className="font-sans text-xs bg-[#2a6b3c] text-white px-2 py-1 font-semibold">Independent Journalist</span>
              <span className="font-sans text-xs bg-gray-700 text-white px-2 py-1 font-semibold">No Brand Affiliations</span>
            </div>

            <p className="font-body text-sm text-[#3a3a3a] leading-relaxed">
              Vijay Yadav has been covering the Indian smartphone market since 2014. He started at a print technology magazine in Mumbai, then spent years in digital journalism before founding The Tech Bharat in 2025. He has personally tested over 300 devices — from budget phones to ultra-premium foldables — and is known for honest, India-specific analysis that cuts through marketing noise.
            </p>
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
        {[
          { number: '11', label: 'Years in Tech Journalism' },
          { number: '300+', label: 'Smartphones Reviewed' },
          { number: '500+', label: 'Articles Published' },
          { number: '2014', label: 'Started Covering Mobiles' },
        ].map(s => (
          <div key={s.label} className="bg-white border border-border p-4 text-center">
            <p className="font-playfair text-3xl font-black text-[#d4220a]">{s.number}</p>
            <p className="font-sans text-[11px] text-muted mt-1 leading-tight">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Biography */}
      <section className="mb-10">
        <h2 className="font-playfair text-2xl font-bold text-ink mb-4 border-l-4 border-[#d4220a] pl-3">Biography</h2>
        <div className="space-y-4 font-body text-base text-[#3a3a3a] leading-relaxed">
          <p>
            Vijay Yadav began his journalism career in 2014 at a Mumbai-based print technology magazine where he covered the early days of Indian 4G adoption and the Reliance Jio disruption. He was among the first journalists to consistently write about the value proposition of Chinese smartphone brands entering India — back when most publications dismissed them.
          </p>
          <p>
            After six years in print, he moved to digital journalism and spent time covering the Indian mobile market during its most transformative period: the rise of ₹10,000 5G phones, the dominance of Xiaomi and Realme in the mid-range, Samsung's fight to retain premium market share, and Apple's aggressive India pricing strategy.
          </p>
          <p>
            He founded The Tech Bharat in 2025 with a singular mission: honest smartphone coverage built for Indian buyers. He tests every device he writes about in real Delhi conditions — crowded metro rides, 40°C summer heat, the patchy 5G coverage of Indian cities, and with the apps most Indians actually use (not the US-centric app diet of most reviewers).
          </p>
          <p>
            His test criteria are deliberately India-first: Does it support n78/n77 5G bands for Jio and Airtel? Does the battery last through a Delhi summer day of heavy use? Is it available on Flipkart or Amazon India at the stated price? How is Samsung/Xiaomi/Apple's service centre network in tier-2 cities?
          </p>
        </div>
      </section>

      {/* ✅ ADDED: AUTHOR CONTENT AUTHORITY */}
<section className="mb-10">
  <h2 className="font-playfair text-2xl font-bold text-ink mb-4 border-l-4 border-[#d4220a] pl-3">
    Core Guides Written by Vijay
  </h2>
  <p className="font-sans text-sm text-muted mb-4">
    These are the main guides personally written and updated by Vijay Yadav, based on real-world testing in India:
  </p>

  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
    {[
      ['Best Smartphones in India','/best-smartphones-india'],
      ['Smartphone Buying Guide','/smartphone-buying-guide-india'],
      ['Best Camera Phones','/best-camera-phones-india'],
      ['Best 5G Phones India','/best-5g-phones-india'],
    ].map(([title, link]) => (
      <Link key={link} href={link} className="border border-border p-3 bg-white hover:border-[#d4220a] transition-colors">
        <span className="font-sans text-sm font-bold text-ink hover:text-[#d4220a]">
          {title} →
        </span>
      </Link>
    ))}
  </div>
</section>

      {/* Expertise */}
      <section className="mb-10">
        <h2 className="font-playfair text-2xl font-bold text-ink mb-4 border-l-4 border-[#d4220a] pl-3">Areas of Expertise</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {[
            '📱 Flagship Smartphones',
            '💰 Budget & Mid-range Phones',
            '📷 Smartphone Camera Testing',
            '🔋 Battery Life Analysis',
            '🇮🇳 India 5G Ecosystem',
            '⚖️ Phone Comparisons',
            '📊 Indian Market Trends',
            '🔧 After-sales & Service',
            '🎮 Gaming on Smartphones',
          ].map(e => (
            <div key={e} className="font-sans text-sm bg-gray-50 border border-border px-3 py-2">{e}</div>
          ))}
        </div>
      </section>

      {/* Test Methodology */}
      <section className="mb-10 bg-[#f8f4ef] border border-border p-6">
        <h2 className="font-playfair text-xl font-bold text-ink mb-3">How Vijay Tests Phones</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-body text-sm text-[#3a3a3a]">
          <div>
            <p className="font-sans text-xs font-bold text-ink mb-1">🌡️ Heat & Build Test</p>
            <p>Used in 35–42°C Delhi summer conditions for throttling, back heat, and build quality.</p>
          </div>
          <div>
            <p className="font-sans text-xs font-bold text-ink mb-1">📶 5G Band Verification</p>
            <p>Verified on Jio (n78) and Airtel (n77/n78) for real 5G connectivity — not just 5G logo.</p>
          </div>
          <div>
            <p className="font-sans text-xs font-bold text-ink mb-1">📸 Camera in Indian Light</p>
            <p>Tested in harsh midday Indian sunlight, indoor artificial light, and low-light conditions.</p>
          </div>
          <div>
            <p className="font-sans text-xs font-bold text-ink mb-1">🔋 Battery Real-World</p>
            <p>PCMark battery test + actual 1-day heavy usage with Indian apps: WhatsApp, YouTube, Paytm.</p>
          </div>
        </div>
      </section>

      {/* ✅ ADDED: TRUST SIGNAL */}
<section className="mb-10">
  <div className="bg-white border border-border p-5">
    <h2 className="font-playfair text-xl font-bold text-ink mb-3">
      Editorial Independence
    </h2>
    <p className="font-sans text-sm text-muted leading-relaxed">
      All content on The Tech Bharat is written independently. No brand pays for placement or recommendations. Devices are evaluated based on real-world performance, long-term usability, and relevance for Indian users — not marketing claims.
    </p>
  </div>
</section>

{/* ✅ ADDED: FINAL AUTHOR NOTE */}
<section className="mb-10 border-t pt-6">
  <h2 className="font-playfair text-xl font-bold text-ink mb-3">
    Final Note from the Author
  </h2>
  <p className="font-sans text-sm text-muted leading-relaxed">
    My goal with The Tech Bharat is simple — to help Indian users choose the right phone without confusion. Every recommendation on this site is based on actual usage, not specs sheets. If a phone is not worth your money, I will say it clearly.
  </p>
</section>

      {/* Recent Articles */}
      {recent.length > 0 && (
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-6 h-0.5 bg-[#d4220a]" />
            <h2 className="font-playfair text-2xl font-bold">Latest Articles by Vijay</h2>
            <div className="flex-1 h-px bg-border" />
            <Link href="/mobile-news" className="font-sans text-xs font-semibold text-[#d4220a]">View All →</Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {recent.map(article => (
              <ArticleCard key={article.id} article={article} variant="card" />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}