import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'About The Tech Bharat – India\'s Independent Mobile Technology News',
  description: 'The Tech Bharat is an independent technology news publication covering Indian smartphone market. Learn about our editorial team, methodology, and commitment to unbiased reporting.',
  alternates: { canonical: 'https://thetechbharat.com/about' },
}

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="border-b-2 border-[#d4220a] mb-10 pb-4">
        <h1 className="font-playfair text-4xl font-black text-ink mb-2">About The Tech Bharat</h1>
        <p className="font-sans text-sm text-muted">India's Independent Mobile Technology News</p>
      </div>

      <div className="prose-custom space-y-8">
        <section>
          <h2 className="font-playfair text-2xl font-bold text-ink mb-3">Who We Are</h2>
          <p className="font-body text-base text-[#3a3a3a] leading-relaxed">
            The Tech Bharat is an independent technology news publication focused exclusively on the Indian smartphone and mobile technology market. We were founded with one mission: give Indian buyers honest, practical, India-specific information before they spend their hard-earned money.
          </p>
          <p className="font-body text-base text-[#3a3a3a] leading-relaxed mt-3">
            We're based across India — Delhi, Mumbai, Bengaluru, Hyderabad, and Pune — which means our coverage reflects the actual Indian experience, not a sanitised lab environment or a foreign market's priorities.
          </p>
        </section>

        <section>
          <h2 className="font-playfair text-2xl font-bold text-ink mb-3">Our Editorial Standards</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { title: 'No paid reviews', desc: 'We never accept money or gifts in exchange for favourable coverage. Brands can send devices for review — we return them and write honestly.' },
              { title: 'No affiliate bias', desc: 'Where we include purchase links, we disclose them clearly. Our recommendations are never influenced by commissions.' },
              { title: 'India-first testing', desc: 'We test phones in Indian conditions: heat, dust, patchy 5G, Indian apps, and real Indian usage patterns.' },
              { title: 'Named journalists', desc: 'Every article carries a named author with verifiable expertise. We don\'t hide behind "editorial team" credits.' },
            ].map(item => (
              <div key={item.title} className="bg-white border border-border p-4">
                <h3 className="font-sans text-sm font-bold text-[#d4220a] mb-1">✓ {item.title}</h3>
                <p className="font-body text-sm text-[#3a3a3a]">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="font-playfair text-2xl font-bold text-ink mb-3">Our Team</h2>
          <p className="font-body text-base text-[#3a3a3a] leading-relaxed mb-4">
            The Tech Bharat is written by journalists with real backgrounds in technology reporting — not content mills or AI writers. Our team has collectively reviewed over 500 devices and written for national publications before joining TTB.
          </p>
          <Link href="/author" className="font-sans text-sm font-semibold text-[#d4220a] hover:underline">Meet our team →</Link>
        </section>

        <section>
          <h2 className="font-playfair text-2xl font-bold text-ink mb-3">Coverage Focus</h2>
          <p className="font-body text-base text-[#3a3a3a] leading-relaxed">
            We cover smartphones available in India — or expected to launch here. We focus on pricing in ₹, availability on Flipkart and Amazon India, 5G band compatibility for Indian networks (Jio, Airtel, Vi), and after-sales service availability. International-only launches get minimal coverage.
          </p>
        </section>

        <section className="border-t border-border pt-6">
          <h2 className="font-playfair text-xl font-bold text-ink mb-3">Contact & Corrections</h2>
          <p className="font-body text-sm text-[#3a3a3a] mb-3">Found an error? We correct it quickly and transparently.</p>
          <div className="flex gap-4">
            <Link href="/contact" className="font-sans text-xs font-semibold text-[#1a3a5c] border border-[#1a3a5c] px-4 py-2 hover:bg-[#1a3a5c] hover:text-white transition-colors">Contact Us</Link>
            <Link href="/corrections-policy" className="font-sans text-xs font-semibold text-muted border border-border px-4 py-2 hover:border-ink transition-colors">Corrections Policy</Link>
          </div>
        </section>
      </div>
    </div>
  )
}