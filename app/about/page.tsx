import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'About The Tech Bharat – India\'s Independent Mobile Tech News',
  description: 'The Tech Bharat is India\'s independent mobile technology news site. Founded by Vijay Yadav, a journalist with 11 years covering Indian smartphones. No brand affiliations. No paid reviews.',
  alternates: { canonical: 'https://thetechbharat.com/about' },
}

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="border-b-4 border-[#d4220a] mb-10 pb-4">
        <h1 className="font-playfair text-4xl font-black text-ink mb-2">About The Tech Bharat</h1>
        <p className="font-sans text-sm text-muted">Founded 2025 · New Delhi, India · Independent & Ad-free of brand influence</p>
      </div>

      {/* Mission statement */}
      <div className="bg-[#1a3a5c] text-white p-7 mb-10">
        <p className="font-playfair text-xl font-bold leading-relaxed">
          "Most Indian tech sites tell you what brands want you to hear. We tell you what you actually need to know before spending your money."
        </p>
        <p className="font-sans text-sm text-white/70 mt-3">— Vijay Yadav, Founder & Senior Mobile Editor</p>
      </div>

      <div className="space-y-10">

        {/* Who we are */}
        <section>
          <h2 className="font-playfair text-2xl font-bold text-ink mb-4 border-l-4 border-[#d4220a] pl-3">Who We Are</h2>
          <p className="font-body text-base text-[#3a3a3a] leading-relaxed mb-3">
            The Tech Bharat is an independent technology news publication built specifically for the Indian smartphone buyer. We were started in 2025 by Vijay Yadav — a journalist who spent a decade covering the mobile industry and grew tired of coverage that felt like repackaged press releases.
          </p>
          <p className="font-body text-base text-[#3a3a3a] leading-relaxed mb-3">
            India is one of the world's largest smartphone markets, yet most coverage either originates overseas or is copy-pasted from global tech sites with a "India price: ₹X" line bolted on. We think Indian buyers deserve better — analysis that accounts for Indian 5G bands, Indian heat and dust conditions, Flipkart and Amazon India pricing, service centre availability, and the specific value math that makes sense in India.
          </p>
          <p className="font-body text-base text-[#3a3a3a] leading-relaxed">
            We cover phones across every segment — from ₹8,000 budget devices to ₹1,50,000 flagships — with the same rigour and honesty regardless of the brand.
          </p>
        </section>

        {/* Editorial Principles */}
        <section>
          <h2 className="font-playfair text-2xl font-bold text-ink mb-4 border-l-4 border-[#d4220a] pl-3">Our Editorial Principles</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              {
                icon: '✕',
                title: 'No Paid Reviews',
                desc: 'Brands cannot pay for coverage, positive framing, or higher scores. We accept devices for testing but return them and write honestly.',
              },
              {
                icon: '✕',
                title: 'No Affiliate Bias',
                desc: 'We may include affiliate links but they never influence our verdicts. We recommend what we would recommend to a friend.',
              },
              {
                icon: '✓',
                title: 'India-First Testing',
                desc: 'Every review is conducted in Indian conditions — 40°C heat, dusty roads, Indian apps, Jio/Airtel 5G networks.',
              },
              {
                icon: '✓',
                title: 'Named Journalists',
                desc: 'Every article has a named author with a verifiable background. No "editorial team" bylines hiding AI or anonymous writers.',
              },
              {
                icon: '✓',
                title: 'Transparent Corrections',
                desc: 'When we get something wrong, we correct it openly — with a correction note, date, and what changed.',
              },
              {
                icon: '✓',
                title: 'Source Transparency',
                desc: 'Leak-based or speculative content is always labelled as such with sources cited where possible.',
              },
            ].map(item => (
              <div key={item.title} className={`p-4 border ${item.icon === '✓' ? 'border-green-200 bg-green-50' : 'border-red-100 bg-red-50'}`}>
                <h3 className={`font-sans text-sm font-bold mb-1 ${item.icon === '✓' ? 'text-green-800' : 'text-red-800'}`}>
                  {item.icon === '✓' ? '✅' : '🚫'} {item.title}
                </h3>
                <p className="font-body text-sm text-[#3a3a3a]">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Founder */}
        <section>
          <h2 className="font-playfair text-2xl font-bold text-ink mb-4 border-l-4 border-[#d4220a] pl-3">The Person Behind The Tech Bharat</h2>
          <div className="flex gap-5 items-start bg-white border border-border p-6">
            <div className="flex-shrink-0 w-16 h-16 rounded-full bg-[#d4220a] flex items-center justify-center text-white font-playfair text-xl font-bold">VY</div>
            <div>
              <h3 className="font-playfair text-xl font-bold text-ink mb-0.5">Vijay Yadav</h3>
              <p className="font-sans text-xs font-semibold text-[#d4220a] mb-3">Founder & Senior Mobile Editor · New Delhi</p>
              <p className="font-body text-sm text-[#3a3a3a] leading-relaxed mb-3">
                Vijay started his journalism career at a print technology magazine in Mumbai in 2014. He spent six years there before moving to digital, covering the Indian smartphone market as it exploded from 2G to 5G. He has personally tested over 300 devices — everything from ₹6,000 feature phones to ₹1,50,000 foldables.
              </p>
              <p className="font-body text-sm text-[#3a3a3a] leading-relaxed mb-3">
                He founded The Tech Bharat in 2025 after noticing a gap: no publication was covering smartphones specifically for the ₹15,000–₹40,000 buyer who dominates the Indian market. His test methodology is rooted in actual Indian usage — he test-drives every device on Delhi's crowded metro, in the heat, and with the apps Indians actually use.
              </p>
              <Link href="/author" className="font-sans text-sm font-semibold text-[#d4220a] hover:underline">Full author profile →</Link>
            </div>
          </div>
        </section>

        {/* Coverage philosophy */}
        <section>
          <h2 className="font-playfair text-2xl font-bold text-ink mb-4 border-l-4 border-[#d4220a] pl-3">What We Cover and How</h2>
          <p className="font-body text-base text-[#3a3a3a] leading-relaxed mb-3">
            We publish a mix of breaking news, in-depth first looks, head-to-head comparisons, and long-form buying guides. We do not chase pageviews with sensational headlines or publish half-baked articles to beat competitors by 30 minutes. We would rather be second and right than first and wrong.
          </p>
          <p className="font-body text-base text-[#3a3a3a] leading-relaxed mb-3">
            Speculative articles — leaks, rumours, analyst predictions — are clearly labelled. We cite sources where possible and use phrases like "expected to" or "according to analyst reports" rather than stating unconfirmed information as fact.
          </p>
          <div className="flex gap-4 mt-4 flex-wrap">
            <Link href="/mobile-news" className="font-sans text-xs font-semibold text-white bg-[#1a3a5c] px-4 py-2 hover:bg-[#0f2540]">Mobile News</Link>
            <Link href="/reviews" className="font-sans text-xs font-semibold text-white bg-[#d4220a] px-4 py-2 hover:bg-[#b01d09]">Reviews</Link>
            <Link href="/compare" className="font-sans text-xs font-semibold text-white bg-[#2a6b3c] px-4 py-2 hover:bg-[#1e4f2c]">Comparisons</Link>
          </div>
        </section>

        {/* Contact */}
        <section className="border-t border-border pt-8">
          <h2 className="font-playfair text-xl font-bold text-ink mb-3">Get in Touch</h2>
          <p className="font-body text-sm text-[#3a3a3a] mb-4">For press enquiries, corrections, or reader feedback:</p>
          <div className="flex gap-4 flex-wrap">
            <Link href="/contact" className="font-sans text-xs font-semibold border border-[#1a3a5c] text-[#1a3a5c] px-4 py-2 hover:bg-[#1a3a5c] hover:text-white transition-colors">Contact Us</Link>
            <Link href="/editorial-policy" className="font-sans text-xs font-semibold border border-border text-muted px-4 py-2 hover:border-ink transition-colors">Editorial Policy</Link>
            <Link href="/corrections-policy" className="font-sans text-xs font-semibold border border-border text-muted px-4 py-2 hover:border-ink transition-colors">Corrections Policy</Link>
          </div>
        </section>

      </div>
    </div>
  )
}