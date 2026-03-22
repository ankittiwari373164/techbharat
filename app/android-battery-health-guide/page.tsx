// app/android-battery-health-guide/page.tsx
import { Metadata } from 'next'
import Link from 'next/link'
import { getPillarArticles, formatPillarDate } from '@/lib/pillar-utils'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Android Battery Health Guide India 2026 — Charging Tips | The Tech Bharat',
  description: 'How to maintain Android battery health in India — charging habits, heat damage, fast charging myths, and what actually works.',
  alternates: { canonical: 'https://thetechbharat.com/android-battery-health-guide' },
  openGraph: { title: 'Android Battery Health Guide India 2026', url: 'https://thetechbharat.com/android-battery-health-guide', type: 'article' },
}

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    { '@type': 'Question', name: 'Is it bad to charge your phone overnight?', acceptedAnswer: { '@type': 'Answer', text: 'Modern smartphones have overcharge protection and stop at 100%. Overnight charging is safe but keeping a phone at 100% long-term causes slight degradation. Use optimised charging settings available on Samsung, OnePlus, and Pixel phones.' } },
    { '@type': 'Question', name: 'Does fast charging damage battery?', acceptedAnswer: { '@type': 'Answer', text: 'Fast charging generates heat which causes degradation. Use the manufacturer-recommended charger and avoid charging in hot environments like a car in Indian summer. Modern fast charging systems manage temperature carefully.' } },
    { '@type': 'Question', name: 'Why does battery drain faster in Indian summer?', acceptedAnswer: { '@type': 'Answer', text: 'Lithium batteries become less efficient at high temperatures. In 40-45°C Indian summer heat, battery chemistry is under stress causing faster drain and long-term capacity loss. Keep phones out of direct sunlight.' } },
  ],
}

export default async function AndroidBatteryHealthGuidePage() {
  const articles = await getPillarArticles(
    ['battery', 'charging', 'fast charge', 'mAh', 'battery life', 'power', 'endurance', 'battery health', 'charge speed'],
    [],
    12
  )

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <div className="bg-paper min-h-screen">
        <div className="max-w-4xl mx-auto px-4 py-10">

          <nav className="font-sans text-xs text-muted mb-6 flex items-center gap-2">
            <Link href="/" className="hover:text-[#d4220a]">Home</Link><span>/</span>
            <Link href="/guides" className="hover:text-[#d4220a]">Guides</Link><span>/</span>
            <span className="text-ink">Android Battery Health Guide</span>
          </nav>

          <div className="mb-8">
            <div className="flex items-center gap-2 mb-3">
              <span className="bg-[#1a3a5c] text-white font-sans text-[10px] font-bold px-2.5 py-1 uppercase tracking-widest">Evergreen Guide</span>
            </div>
            <h1 className="font-playfair text-3xl md:text-4xl font-black text-ink leading-tight mb-4">
              Android Battery Health Guide — What Actually Works in India
            </h1>
            <p className="font-body text-lg text-[#2a2a2a] leading-relaxed">
              Indian users face unique battery challenges: extreme summer heat, long commutes, power cuts requiring full charges, and fast charging becoming standard. This guide separates battery myths from what actually works — plus our latest battery-related articles below.
            </p>
          </div>

          {/* Key takeaways */}
          <div className="bg-[#1a3a5c]/5 border-l-4 border-[#1a3a5c] p-5 mb-8">
            <h2 className="font-sans text-sm font-bold text-[#1a3a5c] uppercase tracking-wider mb-3">Key Takeaways</h2>
            <ul className="space-y-2">
              {[
                'Heat is the #1 battery killer — Indian summers accelerate degradation more than charging habits',
                'Keep battery between 20-80% for longest lifespan where possible',
                'Fast charging is safe with the manufacturer-recommended charger',
                'Overnight charging on modern phones is safe — overcharge protection is standard',
                'Replace battery when capacity drops below 80% — usually 2-3 years of heavy use',
              ].map((item, i) => (
                <li key={i} className="font-sans text-sm text-ink flex items-start gap-2">
                  <span className="text-[#d4220a] font-bold flex-shrink-0">✓</span>{item}
                </li>
              ))}
            </ul>
          </div>

          {/* Fast charging myths table */}
          <section className="mb-10">
            <h2 className="font-playfair text-xl font-bold text-ink mb-4 pb-2 border-b border-border">Fast Charging: Myths vs Facts</h2>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse font-sans text-sm">
                <thead>
                  <tr className="bg-[#1a3a5c] text-white">
                    <th className="px-3 py-2 text-left">Myth</th>
                    <th className="px-3 py-2 text-left">Reality</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['Fast charging always damages battery', 'Damage happens when charging in hot environments — not from wattage alone'],
                    ['Third-party chargers are fine if they fit', 'Incompatible chargers bypass protection circuits — use certified alternatives'],
                    ['Wireless charging is gentler than wired', 'Wireless generates more heat — worse for battery in warm environments'],
                    ['Fully discharge before charging', 'Outdated NiMH advice. Lithium batteries prefer partial charges'],
                    ['More watts = more damage', 'Thermal management matters more than wattage. Xiaomi\'s 120W manages heat better than some 45W systems'],
                  ].map(([myth, reality], i) => (
                    <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="px-3 py-2 border border-border text-red-600 font-medium">✗ {myth}</td>
                      <td className="px-3 py-2 border border-border text-green-700">✓ {reality}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* FAQ */}
          <section className="mb-10">
            <h2 className="font-playfair text-xl font-bold text-ink mb-5 pb-2 border-b border-border">Frequently Asked Questions</h2>
            <div className="space-y-4">
              {[
                { q: 'Is it bad to charge overnight?', a: 'Modern phones have overcharge protection — overnight charging is safe. Use "optimised charging" in settings (available on Samsung, OnePlus, Pixel) which delays full charge until your wake time, reducing time spent at 100%.' },
                { q: 'Why does my battery drain faster in summer?', a: 'Lithium batteries become less efficient above 35°C. In Indian summer heat (40-45°C ambient), your phone\'s battery is under constant thermal stress. Keep out of direct sunlight, remove thick cases when charging, avoid continuous GPS in extreme heat.' },
                { q: 'How do I check battery health on Android?', a: 'Samsung: Settings → Device Care → Battery → Battery health. OnePlus: Settings → Battery → Battery health. All Android: dial *#*#4636#*#*. Third-party: AccuBattery app estimates health over 2-3 weeks of use.' },
                { q: 'When should I replace my battery?', a: 'Replace when capacity drops below 80% of original — usually after 2-3 years of heavy Indian use. Signs: phone not lasting half a day, unexpected shutdowns above 15%, hot during normal use. Replacement cost: ₹800-2,500 at authorised service centres.' },
              ].map(({ q, a }, i) => (
                <div key={i} className="border border-border p-4 bg-white">
                  <h3 className="font-sans text-sm font-bold text-ink mb-2">{q}</h3>
                  <p className="font-sans text-sm text-muted leading-relaxed">{a}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Dynamic articles */}
          <section className="mb-10">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-6 h-0.5 bg-[#d4220a]" />
              <h2 className="font-playfair text-2xl font-bold text-ink">Battery & Charging Articles</h2>
              {articles.length > 0 && <span className="font-sans text-xs text-muted bg-gray-100 px-2 py-0.5 rounded">{articles.length}</span>}
            </div>
            {articles.length === 0 ? (
              <div className="border border-border p-8 text-center bg-white">
                <p className="font-sans text-sm text-muted">Battery articles coming soon. <Link href="/mobile-news" className="text-[#d4220a] hover:underline">Browse all mobile news →</Link></p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {articles.map(article => (
                  <Link key={article.slug} href={`/${article.slug}`}
                    className="bg-white border border-border hover:border-[#d4220a] transition-colors group block">
                    {article.featuredImage && (
                      <div className="relative overflow-hidden" style={{ paddingBottom: '56.25%' }}>
                        <img src={article.featuredImage} alt={article.title} width={400} height={225} loading="lazy"
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} />
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
                        <span className="font-sans text-xs font-semibold text-[#d4220a]">Read →</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </section>

          <section className="mt-8 pt-6 border-t border-border">
            <h2 className="font-playfair text-xl font-bold text-ink mb-4">Related Guides</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {[
                { title: 'Best Battery Backup Phones India', href: '/best-battery-backup-phones-india' },
                { title: 'Smartphone Buying Guide India', href: '/smartphone-buying-guide-india' },
                { title: 'Best Smartphones India', href: '/best-smartphones-india' },
                { title: 'Best Camera Phones India', href: '/best-camera-phones-india' },
              ].map(({ title, href }) => (
                <Link key={href} href={href} className="border border-border p-3 bg-white hover:border-[#d4220a] transition-colors group">
                  <span className="font-sans text-sm font-bold text-ink group-hover:text-[#d4220a] transition-colors">{title} →</span>
                </Link>
              ))}
            </div>
          </section>

          <div className="mt-8 bg-[#f8f4ef] border-l-4 border-[#d4220a] p-5">
            <p className="font-sans text-xs font-bold text-[#d4220a] uppercase tracking-wider mb-2">Editorial Note</p>
            <p className="font-sans text-sm text-muted">Guide based on lithium-ion battery chemistry and India-specific usage. Articles fetched in real-time from The Tech Bharat's published content. By Vijay Yadav.</p>
          </div>

        </div>
      </div>
    </>
  )
}