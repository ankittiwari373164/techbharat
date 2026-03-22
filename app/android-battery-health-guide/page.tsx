// app/android-battery-health-guide/page.tsx
import { Metadata } from 'next'
import Link from 'next/link'
import { getPillarArticles } from '@/lib/pillar-utils'
import PillarArticleGrid from '@/components/PillarArticleGrid'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Android Battery Health Guide India 2026 — Charging Tips | The Tech Bharat',
  description: 'How to maintain Android battery health in India — charging habits, heat damage, fast charging myths, and what actually works. Practical guide for Indian conditions.',
  alternates: { canonical: 'https://thetechbharat.com/android-battery-health-guide' },
  openGraph: {
    title: 'Android Battery Health Guide India 2026',
    description: 'Practical battery health advice for Indian smartphone users — covering heat, fast charging, overnight charging, and more.',
    url: 'https://thetechbharat.com/android-battery-health-guide',
    type: 'article',
  },
}

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    { '@type': 'Question', name: 'Is it bad to charge your phone overnight?', acceptedAnswer: { '@type': 'Answer', text: 'Modern smartphones stop charging at 100% and have overcharge protection. Overnight charging on a modern phone is not dangerous. However, keeping your phone at 100% for extended periods does cause slight long-term battery degradation. For best battery health, charge to 80-85% and avoid letting it drop below 20%. Most phones now have "optimised charging" settings that delay full charge until your wake time.' } },
    { '@type': 'Question', name: 'Does fast charging damage phone battery?', acceptedAnswer: { '@type': 'Answer', text: 'Fast charging generates more heat than slow charging, and heat is the primary cause of battery degradation. However, modern fast charging systems manage heat with sophisticated temperature controls. The practical advice: use the original charger that came with your phone (or the manufacturer-recommended charger), avoid fast charging in a hot environment (inside a car in summer, direct sunlight), and consider using slow charging at night.' } },
    { '@type': 'Question', name: 'Why does my phone battery drain faster in summer?', acceptedAnswer: { '@type': 'Answer', text: 'Lithium batteries lose efficiency in high temperatures. In Indian summers (40-45°C ambient), your phone is already operating near its thermal limit even without fast charging. The battery chemistry becomes less efficient, causing both faster drain and faster long-term degradation. Keep your phone out of direct sunlight, remove thick cases when charging, and avoid using GPS-intensive apps continuously in extreme heat.' } },
    { '@type': 'Question', name: 'How do I check battery health on Android?', acceptedAnswer: { '@type': 'Answer', text: 'Android does not have a built-in battery health percentage like iOS. Options: (1) Samsung phones: Settings → Device Care → Battery → Battery health shows percentage. (2) Most phones: Dial *#*#4636#*#* for battery information including charge count. (3) Third-party apps like AccuBattery (free) provide estimated battery health based on charge cycle data. (4) Some phones like OnePlus have battery health in Settings → Battery.' } },
  ],
}

export default async function AndroidBatteryHealthGuidePage() {
  const batteryArticles = await getPillarArticles(['battery', 'charging', 'fast charge', 'mAh', 'battery life'], [], 10)
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
              <span className="font-sans text-xs text-muted">Updated March 2026</span>
            </div>
            <h1 className="font-playfair text-3xl md:text-4xl font-black text-ink leading-tight mb-4">
              Android Battery Health Guide — What Actually Works in India
            </h1>
            <p className="font-body text-lg text-[#2a2a2a] leading-relaxed">
              Indian smartphone users face unique battery challenges: extreme summer heat, long commutes, power cuts requiring full charges, and aggressive fast charging becoming standard. This guide separates battery myths from what actually preserves your phone's battery life.
            </p>
          </div>

          {/* Quick Summary */}
          <div className="bg-[#1a3a5c]/5 border-l-4 border-[#1a3a5c] p-5 mb-8">
            <h2 className="font-sans text-sm font-bold text-[#1a3a5c] uppercase tracking-wider mb-3">Key Takeaways</h2>
            <ul className="space-y-2">
              {[
                'Heat is the #1 battery killer — Indian summers accelerate degradation more than charging habits',
                'Keep battery between 20-80% for longest lifespan (100% and 0% repeatedly = faster degradation)',
                'Fast charging is safe if you use the manufacturer-recommended charger and avoid heat',
                'Overnight charging on modern phones is safe — overcharge protection is standard',
                'Replace battery when capacity drops below 80% — usually 2-3 years of heavy Indian use',
              ].map((item, i) => (
                <li key={i} className="font-sans text-sm text-ink flex items-start gap-2">
                  <span className="text-[#d4220a] font-bold flex-shrink-0">✓</span>{item}
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-10">

            <section>
              <h2 className="font-playfair text-2xl font-bold text-ink mb-4 pb-2 border-b border-border">The Real Enemy: Heat</h2>
              <p className="font-body text-base text-[#2a2a2a] leading-relaxed mb-4">
                Lithium-ion batteries degrade fastest when exposed to sustained high temperatures. In India, this is a more serious issue than in temperate climates. A phone kept in a car dashboard in Delhi summer (interior temperatures can reach 60-70°C) will lose meaningful battery capacity in a single afternoon. The battery chemistry breaks down irreversibly at these temperatures — no software update or charging habit can reverse heat damage.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { title: 'Avoid These', items: ['Charging in direct sunlight', 'Using GPS navigation while charging in summer heat', 'Leaving phone in a locked car', 'Using thick rubber cases during charging', 'Playing games while simultaneously fast-charging'], color: 'red' },
                  { title: 'Do These Instead', items: ['Remove case when fast-charging', 'Charge in shade or indoors', 'Use slow overnight charging if possible', 'Enable optimised charging in settings', 'Let phone cool before plugging in if it\'s hot'], color: 'green' },
                ].map(({ title, items, color }) => (
                  <div key={title} className={`border-l-4 ${color === 'red' ? 'border-red-500 bg-red-50' : 'border-green-500 bg-green-50'} p-4`}>
                    <h3 className={`font-sans text-sm font-bold mb-2 ${color === 'red' ? 'text-red-700' : 'text-green-700'}`}>{title}</h3>
                    <ul className="space-y-1">
                      {items.map((item, i) => (
                        <li key={i} className="font-sans text-xs text-ink">{item}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h2 className="font-playfair text-2xl font-bold text-ink mb-4 pb-2 border-b border-border">The 20-80% Rule — Does It Actually Matter?</h2>
              <p className="font-body text-base text-[#2a2a2a] leading-relaxed mb-4">
                Yes, but less than people think for 1-2 year ownership. Lithium batteries degrade faster when regularly charged to 100% and discharged to 0% — this is chemically documented. However, the practical degradation difference between careful 20-80% charging vs casual 0-100% charging is typically 5-10% battery capacity difference over 2 years — meaningful but not dramatic.
              </p>
              <p className="font-body text-base text-[#2a2a2a] leading-relaxed mb-4">
                For Indian usage where power cuts and long commutes make full charges sometimes necessary, don't stress about occasional 0-100% cycles. The compounding factor is heat — a phone that charges 0-100% in a cool environment degrades less than one charging 20-80% in 45°C heat.
              </p>
              <p className="font-body text-base text-[#2a2a2a] leading-relaxed">
                Most premium Android phones now have built-in optimised charging. Samsung calls it "Protect battery" (caps at 85%). OnePlus has "Optimised charging". Google Pixel has "Adaptive charging". These are worth enabling for daily charging.
              </p>
            </section>

            <section>
              <h2 className="font-playfair text-2xl font-bold text-ink mb-4 pb-2 border-b border-border">Fast Charging Myths vs Facts</h2>
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
                      ['Fast charging always damages battery', 'Modern fast charging systems manage temperature carefully. Damage occurs when charging in hot environments, not from wattage alone.'],
                      ['Third-party chargers are fine if they fit', 'Incompatible chargers can bypass protection circuits. Use manufacturer-certified chargers or reputable brands (Anker, Belkin) with correct specs.'],
                      ['Wireless charging is gentler than wired', 'Wireless charging generates more heat than wired charging, making it worse for battery health if used regularly in warm environments.'],
                      ['You should fully discharge before charging', 'Outdated advice from NiMH battery era. Lithium batteries prefer partial charges and are stressed by full discharge to 0%.'],
                      ['More watts = more damage', 'Not directly. Xiaomi\'s 120W HyperCharge manages battery temperature better than some 45W systems. Thermal management matters more than wattage.'],
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

            <section>
              <h2 className="font-playfair text-2xl font-bold text-ink mb-4 pb-2 border-b border-border">How to Check Battery Health on Android</h2>
              <div className="space-y-3">
                {[
                  { brand: 'Samsung', method: 'Settings → Device Care → Battery → Battery health shows percentage. Anything above 80% is healthy.' },
                  { brand: 'OnePlus', method: 'Settings → Battery → Battery health. Shows current health percentage and charge cycle count.' },
                  { brand: 'Pixel', method: 'Settings → Battery → Battery usage. No direct percentage, but Adaptive Battery shows optimisation status.' },
                  { brand: 'All Android', method: 'Dial *#*#4636#*#* in your dialler app. Opens battery information including charge count (cycle count estimate).' },
                  { brand: 'Third-party', method: 'AccuBattery (free) estimates battery health based on observed charging patterns over time. Takes 2-3 weeks to calibrate.' },
                ].map(({ brand, method }) => (
                  <div key={brand} className="border border-border p-4 bg-white">
                    <span className="font-sans text-xs font-bold text-[#1a3a5c] uppercase tracking-wider">{brand}: </span>
                    <span className="font-sans text-sm text-muted">{method}</span>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h2 className="font-playfair text-2xl font-bold text-ink mb-4 pb-2 border-b border-border">When to Replace Your Battery</h2>
              <p className="font-body text-base text-[#2a2a2a] leading-relaxed mb-4">
                Replace your phone's battery when capacity drops below 80% of original — this is Apple's iOS threshold and a reasonable standard for Android too. Signs of a degraded battery: phone struggling to last half a day where it previously lasted a full day, unexpected shutdowns at 15-20% battery, phone getting hot during normal use without intensive tasks.
              </p>
              <p className="font-body text-base text-[#2a2a2a] leading-relaxed">
                Battery replacement cost in India: ₹800–2,500 at authorised service centres depending on brand and model. Samsung India's battery replacement service is widely available. Third-party replacements are cheaper but use of non-OEM batteries voids warranty and may reduce charging speed. For phones 2+ years old, battery replacement can extend useful life by 1-2 years and is typically worth the cost.
              </p>
            </section>

            {/* FAQ */}
            <section>
              <h2 className="font-playfair text-2xl font-bold text-ink mb-6 pb-2 border-b border-border">Frequently Asked Questions</h2>
              <div className="space-y-4">
                {[
                  { q: 'Is it bad to charge your phone overnight?', a: 'Modern smartphones stop charging at 100% and have overcharge protection. Overnight charging is not dangerous. However, keeping your phone at 100% for extended periods causes slight long-term degradation. For best health, use "optimised charging" in settings — available on Samsung, OnePlus, Pixel, and most modern Android phones.' },
                  { q: 'Does fast charging damage phone battery?', a: 'Fast charging generates heat, and heat causes degradation — but modern systems manage this well. Use the manufacturer-recommended charger, avoid charging in hot environments (in a car in summer), and don\'t fast charge repeatedly while the phone is in a case. The charger that came with your phone is optimised for its battery protection system.' },
                  { q: 'Why does my phone battery drain faster in summer?', a: 'Lithium batteries become less efficient in high temperatures. In 40-45°C Indian summer heat, your phone\'s battery chemistry is under stress. Keep the phone out of direct sunlight, remove thick cases when charging, and avoid GPS-intensive navigation apps continuously in extreme heat.' },
                  { q: 'How do I check battery health on Android?', a: 'Samsung: Settings → Device Care → Battery → Battery health. OnePlus: Settings → Battery → Battery health. All Android: dial *#*#4636#*#* for battery info. Third-party: AccuBattery app estimates health over time.' },
                ].map(({ q, a }, i) => (
                  <div key={i} className="border border-border p-5 bg-white">
                    <h3 className="font-sans text-sm font-bold text-ink mb-2">{q}</h3>
                    <p className="font-sans text-sm text-muted leading-relaxed">{a}</p>
                  </div>
                ))}
              </div>
            </section>

            <PillarArticleGrid
            articles={batteryArticles}
            title="Battery & Charging Articles"
            emptyMessage="No related articles yet — check back after new articles are published."
          />

                    {/* Related */}
            <section className="pt-6 border-t border-border">
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

          </div>

          <div className="mt-8 bg-[#f8f4ef] border-l-4 border-[#d4220a] p-5">
            <p className="font-sans text-xs font-bold text-[#d4220a] uppercase tracking-wider mb-2">Editorial Note</p>
            <p className="font-sans text-sm text-muted">This guide is based on lithium-ion battery chemistry research, manufacturer documentation, and India-specific usage conditions. Updated March 2026. By Vijay Yadav, The Tech Bharat.</p>
          </div>

        </div>
      </div>
    </>
  )
}