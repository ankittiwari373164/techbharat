// app/best-apple-iphone-india/page.tsx
// Static pillar page - copy to other pillar pages and update CONFIG

import { Metadata } from 'next'
import Link from 'next/link'

// CONFIG: Update these for each pillar page brand
const CONFIG = {
  title: 'Best iPhones in India',
  brand: 'Apple',
  slug: 'best-apple-iphone-india',
  color: '#d4220a',
  description: 'Best iPhones in India — Complete iPhone 16 lineup ranked for Indian buyers with pricing and specifications.',
}

export const revalidate = 86400 // Revalidate once per day

export const metadata: Metadata = {
  title: `${CONFIG.title} | The Tech Bharat`,
  description: CONFIG.description,
  alternates: {
    canonical: `https://thetechbharat.com/${CONFIG.slug}`,
  },
  openGraph: {
    title: CONFIG.title,
    description: CONFIG.description,
    url: `https://thetechbharat.com/${CONFIG.slug}`,
    type: 'article',
  },
}

export default function PillarPage() {
  const currentDate = new Date()
  const month = currentDate.toLocaleDateString('en-US', { month: 'long' })
  const year = currentDate.getFullYear()

  return (
    <div className="bg-paper min-h-screen">
      <div className="max-w-4xl mx-auto px-4 py-10">

        {/* Breadcrumb */}
        <nav className="font-sans text-xs text-muted mb-6 flex items-center gap-2 flex-wrap">
          <Link href="/" className="hover:text-[#d4220a]">Home</Link>
          <span>/</span>
          <Link href="/mobile-news" className="hover:text-[#d4220a]">Mobile News</Link>
          <span>/</span>
          <span className="text-ink">{CONFIG.title}</span>
        </nav>

        {/* Hero Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-3 flex-wrap">
            <span className={`bg-[${CONFIG.color}] text-white font-sans text-[10px] font-bold px-2.5 py-1 uppercase tracking-widest`}>
              Updated {month} {year}
            </span>
            <span className="font-sans text-xs text-muted">By Vijay Yadav · The Tech Bharat</span>
          </div>
          <h1 className="font-playfair text-3xl md:text-4xl font-black text-ink leading-tight mb-3">
            {CONFIG.title} — {month} {year}
          </h1>
          <p className="font-sans text-base font-semibold text-[#1a3a5c] border-l-4 border-[#1a3a5c] pl-4 mb-4">
            Complete {CONFIG.brand} lineup ranked for Indian buyers — with specifications, pricing, and honest recommendations.
          </p>
          <p className="font-body text-lg text-[#2a2a2a] leading-relaxed">
            {CONFIG.brand} devices in India. This comprehensive guide ranks the current lineup, compares specifications, and provides expert buying recommendations for {month} {year}.
          </p>
        </div>

        {/* Quick Comparison Table */}
        <section className="mb-10 overflow-x-auto">
          <h2 className="font-playfair text-2xl font-bold text-ink mb-4 pb-2 border-b-2" style={{ borderColor: CONFIG.color }}>
            Quick Comparison
          </h2>
          <table className="w-full border-collapse text-sm font-sans">
            <thead>
              <tr style={{ backgroundColor: CONFIG.color }} className="text-white">
                <th className="px-3 py-2 text-left">Model</th>
                <th className="px-3 py-2 text-left">Price (Est.)</th>
                <th className="px-3 py-2 text-left">Display</th>
                <th className="px-3 py-2 text-left">Camera</th>
                <th className="px-3 py-2 text-left">Best For</th>
              </tr>
            </thead>
            <tbody>
              <tr className="bg-white border-b border-gray-200">
                <td className="px-3 py-2 font-bold">{CONFIG.brand} Premium</td>
                <td className="px-3 py-2">₹1,19,900+</td>
                <td className="px-3 py-2">6.7" OLED</td>
                <td className="px-3 py-2">Advanced</td>
                <td className="px-3 py-2">Power users</td>
              </tr>
              <tr className="bg-gray-50 border-b border-gray-200">
                <td className="px-3 py-2 font-bold">{CONFIG.brand} Mid</td>
                <td className="px-3 py-2">₹79,900</td>
                <td className="px-3 py-2">6.1" OLED</td>
                <td className="px-3 py-2">Good</td>
                <td className="px-3 py-2">General users</td>
              </tr>
              <tr className="bg-white border-b border-gray-200">
                <td className="px-3 py-2 font-bold">{CONFIG.brand} Budget</td>
                <td className="px-3 py-2">₹44,900</td>
                <td className="px-3 py-2">6.1" LCD</td>
                <td className="px-3 py-2">Decent</td>
                <td className="px-3 py-2">Budget buyers</td>
              </tr>
            </tbody>
          </table>
        </section>

        {/* Main Content */}
        <h2 className="font-playfair text-2xl font-bold text-ink mt-10 mb-4 pb-2 border-b-2" style={{ borderColor: CONFIG.color }}>
          Why {CONFIG.brand}?
        </h2>
        <p className="font-body text-base text-[#2a2a2a] leading-relaxed mb-4">
          {CONFIG.brand} devices offer unique advantages for Indian users. Whether you prioritize performance, camera quality, ecosystem integration, or value for money, there's a {CONFIG.brand} device suited for your needs.
        </p>

        <h3 className="font-playfair text-lg font-bold text-ink mt-6 mb-3">For Power Users</h3>
        <p className="font-body text-base text-[#2a2a2a] leading-relaxed mb-4">
          The premium {CONFIG.brand} models offer flagship performance, professional-grade cameras, and advanced features. Perfect for content creators, photographers, and users who demand the best.
        </p>

        <h3 className="font-playfair text-lg font-bold text-ink mt-6 mb-3">For General Users</h3>
        <p className="font-body text-base text-[#2a2a2a] leading-relaxed mb-4">
          Mid-range {CONFIG.brand} devices balance performance and value. Excellent for everyday users who want reliability without breaking the bank.
        </p>

        <h3 className="font-playfair text-lg font-bold text-ink mt-6 mb-3">For Budget-Conscious Buyers</h3>
        <p className="font-body text-base text-[#2a2a2a] leading-relaxed mb-4">
          Budget {CONFIG.brand} phones deliver solid performance for basic to moderate use. Great entry point for first-time users or as a secondary device.
        </p>

        {/* FAQ Section */}
        <section className="mb-10 mt-10">
          <h2 className="font-playfair text-2xl font-bold text-ink mb-5 pb-2 border-b border-gray-200">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            <div className="border border-gray-200 p-4 bg-white">
              <h3 className="font-sans text-sm font-bold text-ink mb-2">Which {CONFIG.brand} model should I buy?</h3>
              <p className="font-sans text-sm text-muted leading-relaxed">
                For most users: mid-range model. For power users: premium. For budget: entry-level. Your choice depends on budget, use case, and requirements.
              </p>
            </div>
            <div className="border border-gray-200 p-4 bg-white">
              <h3 className="font-sans text-sm font-bold text-ink mb-2">Is {CONFIG.brand} more expensive in India?</h3>
              <p className="font-sans text-sm text-muted leading-relaxed">
                Yes, typically 15-25% more expensive than USA pricing due to import duties and GST. However, local assembly and competitive pricing help narrow the gap.
              </p>
            </div>
            <div className="border border-gray-200 p-4 bg-white">
              <h3 className="font-sans text-sm font-bold text-ink mb-2">How long does {CONFIG.brand} provide software support?</h3>
              <p className="font-sans text-sm text-muted leading-relaxed">
                Most modern {CONFIG.brand} devices receive 3-7 years of software updates. Check the specific model for exact support timeline.
              </p>
            </div>
            <div className="border border-gray-200 p-4 bg-white">
              <h3 className="font-sans text-sm font-bold text-ink mb-2">Where to buy {CONFIG.brand} in India?</h3>
              <p className="font-sans text-sm text-muted leading-relaxed">
                Official {CONFIG.brand} store, Amazon.in, Flipkart, and authorized retailers. Always buy from verified sellers for warranty and authenticity.
              </p>
            </div>
          </div>
        </section>

        {/* Internal Links */}
        <section className="mt-8 pt-6 border-t border-gray-200">
          <h2 className="font-playfair text-xl font-bold text-ink mb-4">Explore More</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Link href="/mobile-news" className="border border-gray-200 p-3 bg-white hover:border-[#d4220a] transition-colors group">
              <span className="font-sans text-sm font-bold text-ink group-hover:text-[#d4220a]">📱 Latest Mobile News →</span>
            </Link>
            <Link href="/reviews" className="border border-gray-200 p-3 bg-white hover:border-[#d4220a] transition-colors group">
              <span className="font-sans text-sm font-bold text-ink group-hover:text-[#d4220a]">⭐ Phone Reviews →</span>
            </Link>
            <Link href="/compare" className="border border-gray-200 p-3 bg-white hover:border-[#d4220a] transition-colors group">
              <span className="font-sans text-sm font-bold text-ink group-hover:text-[#d4220a]">⚖️ Compare Phones →</span>
            </Link>
            <Link href="/best-smartphones-india" className="border border-gray-200 p-3 bg-white hover:border-[#d4220a] transition-colors group">
              <span className="font-sans text-sm font-bold text-ink group-hover:text-[#d4220a]">📊 All Best Phones →</span>
            </Link>
          </div>
        </section>

        {/* Editorial Note */}
        <div className="mt-8 bg-[#f8f4ef] border-l-4" style={{ borderColor: CONFIG.color }} >
          <div className="p-5">
            <p className="font-sans text-xs font-bold text-[#d4220a] uppercase tracking-wider mb-2">Editorial Note</p>
            <p className="font-sans text-sm text-muted">
              This guide is updated regularly. All recommendations are independent editorial opinion. No paid placements.
              By Vijay Yadav, Senior Mobile Editor, The Tech Bharat.
            </p>
          </div>
        </div>

      </div>
    </div>
  )
}