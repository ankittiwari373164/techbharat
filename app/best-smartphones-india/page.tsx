// app/best-smartphones-india/page.tsx
import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Best Smartphones in India 2026 — Every Budget | The Tech Bharat',
  description: 'Best smartphones in India by budget — ₹10K to ₹1L+. Honest picks for every Indian buyer updated March 2026. No paid placements.',
  alternates: { canonical: 'https://thetechbharat.com/best-smartphones-india' },
  openGraph: {
    title: 'Best Smartphones in India 2026 — Every Budget',
    description: 'Honest smartphone recommendations for every Indian budget. Updated monthly by The Tech Bharat.',
    url: 'https://thetechbharat.com/best-smartphones-india',
    type: 'article',
  },
}

const picks: { budget: string; phones: { name: string; price: string; why: string; best: string }[] }[] = [
  {
    budget: 'Best Phones Under ₹15,000',
    phones: [
      { name: 'Redmi Note 14', price: '~₹13,999', why: 'AMOLED display, 5G support, 50MP camera for the price', best: 'Best all-rounder' },
      { name: 'Realme Narzo 70', price: '~₹12,999', why: 'Fastest charging in segment, clean display, solid battery', best: 'Best charging speed' },
      { name: 'Samsung Galaxy A15 5G', price: '~₹14,999', why: 'Samsung service network, 5-year security patches, reliable AMOLED', best: 'Best long-term reliability' },
    ],
  },
  {
    budget: 'Best Phones ₹15,000 – ₹25,000',
    phones: [
      { name: 'Nothing Phone (3a)', price: '~₹25,000', why: 'Clean Nothing OS, unique design, solid camera, meaningful 3-year updates', best: 'Best software experience' },
      { name: 'OnePlus Nord CE 4', price: '~₹24,999', why: '100W charging, Snapdragon chipset, OxygenOS still clean at this tier', best: 'Best fast charging' },
      { name: 'Poco X6 Pro', price: '~₹22,999', why: 'Flagship Dimensity chip at mid-range price, excellent display, gaming performance', best: 'Best performance' },
    ],
  },
  {
    budget: 'Best Phones ₹25,000 – ₹40,000',
    phones: [
      { name: 'Nothing Phone (3a) Pro', price: '~₹32,000', why: 'Premium build, clean OS, better cameras, 4-year updates', best: 'Best build quality' },
      { name: 'OnePlus 13R', price: '~₹39,999', why: 'Snapdragon 8 Gen 2, 80W charging, 4 years OS updates, solid cameras', best: 'Best performance value' },
      { name: 'Samsung Galaxy A55 5G', price: '~₹39,999', why: '5-year OS updates, Samsung service network, premium Exynos+OIS camera', best: 'Best long-term support' },
    ],
  },
  {
    budget: 'Best Phones ₹40,000 – ₹70,000',
    phones: [
      { name: 'Nothing Phone 4A Pro', price: '~₹40,000', why: 'Premium metal build, dual 50MP cameras, clean Nothing OS 3.0, wireless charging', best: 'Best design' },
      { name: 'Google Pixel 9a', price: '~₹52,999', why: '7-year updates, best computational photography at price, Tensor G4', best: 'Best camera AI + updates' },
      { name: 'OnePlus 13', price: '~₹64,999', why: 'Snapdragon 8 Elite, Hasselblad cameras, 100W charging, 4 years updates', best: 'Best overall flagship value' },
    ],
  },
  {
    budget: 'Best Phones ₹70,000+',
    phones: [
      { name: 'Samsung Galaxy S26 Ultra', price: '~₹1,34,999', why: 'S Pen, Privacy Display, 7-year updates, 200MP camera, best Android flagship in India', best: 'Best Android flagship' },
      { name: 'iPhone 16 Pro', price: '~₹1,19,900', why: 'A18 Pro chip, ProRes video, 7-year iOS support, best ecosystem integration', best: 'Best for iOS users' },
      { name: 'Google Pixel 9 Pro', price: '~₹1,09,999', why: 'Best computational photography, pure Android, 7-year updates, Google AI features', best: 'Best photography + AI' },
    ],
  },
]

export default function BestSmartphonesIndiaPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        name: 'Best Smartphones in India 2026',
        description: 'Best smartphones in India by budget, updated March 2026',
        url: 'https://thetechbharat.com/best-smartphones-india',
        numberOfItems: picks.reduce((acc, p) => acc + p.phones.length, 0),
      })}} />

      <div className="bg-paper min-h-screen">
        <div className="max-w-4xl mx-auto px-4 py-10">

          <nav className="font-sans text-xs text-muted mb-6 flex items-center gap-2">
            <Link href="/" className="hover:text-[#d4220a]">Home</Link>
            <span>/</span>
            <Link href="/guides" className="hover:text-[#d4220a]">Guides</Link>
            <span>/</span>
            <span className="text-ink">Best Smartphones India</span>
          </nav>

          <div className="mb-8">
            <div className="flex items-center gap-2 mb-3">
              <span className="bg-[#d4220a] text-white font-sans text-[10px] font-bold px-2.5 py-1 uppercase tracking-widest">Updated March 2026</span>
              <span className="font-sans text-xs text-muted">Vijay Yadav · The Tech Bharat</span>
            </div>
            <h1 className="font-playfair text-3xl md:text-4xl font-black text-ink leading-tight mb-4">
              Best Smartphones in India 2026 — Honest Picks at Every Budget
            </h1>
            <p className="font-body text-lg text-[#2a2a2a] leading-relaxed">
              These recommendations are based on actual India market availability, service network reality, software update commitments, and value for Indian buyers — not just spec sheet comparisons. No paid placements. Updated monthly.
            </p>
          </div>

          {/* Jump Links */}
          <div className="bg-white border border-border p-4 mb-8">
            <p className="font-sans text-xs font-bold text-muted uppercase tracking-wider mb-3">Jump to Budget</p>
            <div className="flex flex-wrap gap-2">
              {picks.map((p) => (
                <a key={p.budget} href={`#${p.budget.replace(/\s+/g, '-').toLowerCase()}`}
                  className="font-sans text-xs border border-border px-3 py-1.5 hover:border-[#d4220a] hover:text-[#d4220a] transition-colors">
                  {p.budget}
                </a>
              ))}
            </div>
          </div>

          {/* Picks by Budget */}
          <div className="space-y-12">
            {picks.map((section) => (
              <section key={section.budget} id={section.budget.replace(/\s+/g, '-').toLowerCase()}>
                <h2 className="font-playfair text-2xl font-bold text-ink mb-5 pb-2 border-b-2 border-[#d4220a]">
                  {section.budget}
                </h2>
                <div className="space-y-4">
                  {section.phones.map((phone) => (
                    <div key={phone.name} className="bg-white border border-border p-5 flex flex-col md:flex-row md:items-start gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-sans text-base font-bold text-ink">{phone.name}</h3>
                          <span className="font-sans text-xs bg-[#1a3a5c] text-white px-2 py-0.5">{phone.best}</span>
                        </div>
                        <p className="font-sans text-sm font-semibold text-[#d4220a] mb-2">{phone.price}</p>
                        <p className="font-sans text-sm text-muted">{phone.why}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            ))}
          </div>

          {/* Related Guides */}
          <section className="mt-12 pt-6 border-t border-border">
            <h2 className="font-playfair text-xl font-bold text-ink mb-4">Explore More Guides</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {[
                { title: 'Smartphone Buying Guide India', href: '/smartphone-buying-guide-india', desc: 'What specs actually matter for Indian buyers' },
                { title: 'Best Camera Phones India', href: '/best-camera-phones-india', desc: 'Camera rankings by budget' },
                { title: 'Best Battery Phones India', href: '/best-battery-backup-phones-india', desc: 'All-day battery recommendations' },
                { title: 'Best Gaming Phones India', href: '/best-gaming-phones-india', desc: 'Top picks for BGMI and gaming' },
              ].map(({ title, href, desc }) => (
                <Link key={href} href={href} className="border border-border p-4 bg-white hover:border-[#d4220a] transition-colors group">
                  <h3 className="font-sans text-sm font-bold text-ink group-hover:text-[#d4220a] transition-colors mb-1">{title} →</h3>
                  <p className="font-sans text-xs text-muted">{desc}</p>
                </Link>
              ))}
            </div>
          </section>

          {/* Editorial Note */}
          <div className="mt-8 bg-[#f8f4ef] border-l-4 border-[#d4220a] p-5">
            <p className="font-sans text-xs font-bold text-[#d4220a] uppercase tracking-wider mb-2">How We Select These Phones</p>
            <p className="font-sans text-sm text-muted leading-relaxed">
              These picks are based on India market availability, confirmed retail pricing, software update commitments, service network coverage, and India-specific usage conditions. We do not accept payment for placement. Phones are evaluated on value for Indian buyers specifically — not international benchmarks alone. Last updated March 2026 by Vijay Yadav, Senior Mobile Editor.
            </p>
          </div>

        </div>
      </div>
    </>
  )
}