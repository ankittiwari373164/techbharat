// app/best-gaming-phones-india/page.tsx
import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Best Gaming Phones in India 2026 — BGMI, COD Mobile | The Tech Bharat',
  description: 'Best gaming phones in India 2026. Top picks for BGMI, COD Mobile, and Genshin Impact at every budget. Ranked by sustained performance, cooling, and display.',
  alternates: { canonical: 'https://thetechbharat.com/best-gaming-phones-india' },
  openGraph: {
    title: 'Best Gaming Phones in India 2026',
    description: 'Best phones for BGMI, COD Mobile, and mobile gaming in India — ranked by sustained performance, not just benchmarks.',
    url: 'https://thetechbharat.com/best-gaming-phones-india',
    type: 'article',
  },
}

export default function BestGamingPhonesIndiaPage() {
  return (
    <div className="bg-paper min-h-screen">
      <div className="max-w-4xl mx-auto px-4 py-10">

        <nav className="font-sans text-xs text-muted mb-6 flex items-center gap-2">
          <Link href="/" className="hover:text-[#d4220a]">Home</Link><span>/</span>
          <Link href="/guides" className="hover:text-[#d4220a]">Guides</Link><span>/</span>
          <span className="text-ink">Best Gaming Phones India</span>
        </nav>

        <div className="mb-8">
          <div className="flex items-center gap-2 mb-3">
            <span className="bg-[#d4220a] text-white font-sans text-[10px] font-bold px-2.5 py-1 uppercase tracking-widest">Updated March 2026</span>
          </div>
          <h1 className="font-playfair text-3xl md:text-4xl font-black text-ink leading-tight mb-4">
            Best Gaming Phones in India 2026 — BGMI, COD Mobile, and Beyond
          </h1>
          <p className="font-body text-lg text-[#2a2a2a] leading-relaxed">
            Mobile gaming in India is dominated by BGMI, COD Mobile, Free Fire, and increasingly Genshin Impact. These rankings focus on what actually matters for Indian gaming: sustained performance without throttling, display quality at 90-120fps, and thermal management in Indian summer conditions.
          </p>
        </div>

        {/* What matters for gaming */}
        <div className="bg-[#1a3a5c]/5 border-l-4 border-[#1a3a5c] p-5 mb-8">
          <h2 className="font-sans text-sm font-bold text-[#1a3a5c] uppercase tracking-wider mb-3">What Gaming Phones Actually Need</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[
              ['Sustained performance', 'Can the phone maintain 90fps for 30+ minutes without throttling? Peak benchmarks are meaningless for gaming.'],
              ['Thermal management', 'Vapour chamber cooling, graphite layers, or active cooling determines whether performance holds in Indian heat.'],
              ['Display refresh rate', '120Hz minimum for competitive BGMI. 144Hz for dedicated gaming phones. 90Hz acceptable for casual gaming.'],
              ['Touch response', 'Touch sampling rate (120Hz+) and low touch latency matters for BGMI aiming precision.'],
              ['Battery during gaming', 'Gaming drains batteries fast. 5,000mAh+ recommended for 2+ hour sessions.'],
              ['Trigger buttons', 'Dedicated shoulder triggers (physical or capacitive) give competitive advantage in BGMI.'],
            ].map(([title, desc]) => (
              <div key={title} className="bg-white border border-border p-3">
                <p className="font-sans text-xs font-bold text-ink mb-1">{title}</p>
                <p className="font-sans text-xs text-muted">{desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Rankings */}
        {[
          {
            title: 'Best Gaming Phone Under ₹20,000',
            winner: 'Poco X6',
            price: '~₹18,999',
            chip: 'Snapdragon 7s Gen 2',
            display: '6.67" AMOLED, 120Hz',
            why: 'The most sustained gaming performance under ₹20K. Poco\'s gaming mode disables background processes aggressively, maintaining 60fps in BGMI at high settings consistently. The 120Hz AMOLED is genuinely sharp for the price.',
            limitation: 'Throttles more noticeably above 45°C ambient. MIUI requires cleanup. No dedicated shoulder triggers.',
          },
          {
            title: 'Best Gaming Phone ₹20,000 – ₹35,000',
            winner: 'iQOO Neo 10',
            price: '~₹34,999',
            chip: 'Snapdragon 8 Gen 3',
            display: '6.78" AMOLED, 144Hz',
            why: 'iQOO builds phones specifically for gaming — the Neo 10 brings a flagship Snapdragon 8 Gen 3 to ₹35K with dedicated shoulder triggers, 144Hz display, and vapour chamber cooling. BGMI at 90fps is sustained without throttling for 45+ minutes.',
            limitation: 'FunTouchOS is cluttered but gaming mode effectively isolates performance. Camera not competitive at this price.',
          },
          {
            title: 'Best Gaming Phone ₹35,000 – ₹60,000',
            winner: 'OnePlus 13R',
            price: '~₹39,999',
            chip: 'Snapdragon 8 Gen 2',
            display: '6.78" AMOLED, 120Hz',
            why: 'Snapdragon 8 Gen 2 with OnePlus\'s thermal management delivers excellent sustained gaming performance. The 5,500mAh battery handles long sessions. OxygenOS gaming mode is clean and effective. Genuinely well-rounded — not just a gaming phone but a great daily driver that games well.',
            limitation: 'No dedicated gaming triggers. iQOO Neo 10\'s 144Hz has advantage for competitive play.',
          },
          {
            title: 'Best Gaming Phone Above ₹60,000',
            winner: 'ASUS ROG Phone 8',
            price: '~₹79,999',
            chip: 'Snapdragon 8 Gen 3',
            display: '6.78" AMOLED, 165Hz',
            why: 'The dedicated gaming phone for serious Indian mobile gamers. Active cooling fan (AeroActive Cooler accessory), AirTrigger shoulder buttons, 165Hz display, GameCool 8 thermal system, and ASUS\'s Game Genie overlay. No other phone sustains 90fps in demanding titles as consistently in Indian summer conditions.',
            limitation: 'Large and heavy (225g). Camera system is secondary. Niche purchase for serious gamers only.',
          },
        ].map(({ title, winner, price, chip, display, why, limitation }) => (
          <section key={title} className="mb-8">
            <h2 className="font-playfair text-2xl font-bold text-ink mb-4 pb-2 border-b-2 border-[#d4220a]">{title}</h2>
            <div className="bg-white border border-border p-5">
              <div className="flex items-start gap-3 mb-3">
                <span className="bg-[#d4220a] text-white font-sans text-xs font-bold px-2 py-1 flex-shrink-0">TOP PICK</span>
                <div>
                  <h3 className="font-sans text-lg font-bold text-ink">{winner}</h3>
                  <p className="font-sans text-sm font-semibold text-[#d4220a]">{price} · {chip} · {display}</p>
                </div>
              </div>
              <p className="font-sans text-sm text-muted mb-3 leading-relaxed">✓ {why}</p>
              <p className="font-sans text-sm text-red-600 border-t border-border pt-3">⚠ {limitation}</p>
            </div>
          </section>
        ))}

        {/* BGMI Settings Guide */}
        <section className="mb-10">
          <h2 className="font-playfair text-2xl font-bold text-ink mb-4 pb-2 border-b border-border">Which Phones Support 90fps in BGMI?</h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse font-sans text-sm">
              <thead>
                <tr className="bg-[#1a3a5c] text-white">
                  <th className="px-3 py-2 text-left">Chipset</th>
                  <th className="px-3 py-2 text-left">Max BGMI FPS</th>
                  <th className="px-3 py-2 text-left">Sustained (30 min)</th>
                  <th className="px-3 py-2 text-left">India Price Range</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['Snapdragon 8 Gen 3', '90fps', '✅ Yes with cooling', '₹35,000+'],
                  ['Snapdragon 8 Gen 2', '90fps', '✅ Generally yes', '₹25,000+'],
                  ['Dimensity 9300+', '90fps', '✅ Yes', '₹30,000+'],
                  ['Snapdragon 7 Gen 3', '60fps (sometimes 90)', '⚠ Depends on thermal', '₹20,000+'],
                  ['Dimensity 8200', '60fps', '✅ Stable 60fps', '₹15,000+'],
                  ['Snapdragon 6 Gen 1', '60fps', '✅ Stable 60fps', '₹12,000+'],
                ].map(([chip, fps, sustained, price], i) => (
                  <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-3 py-2 border border-border font-medium">{chip}</td>
                    <td className="px-3 py-2 border border-border">{fps}</td>
                    <td className="px-3 py-2 border border-border">{sustained}</td>
                    <td className="px-3 py-2 border border-border">{price}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Related */}
        <section className="mt-8 pt-6 border-t border-border">
          <h2 className="font-playfair text-xl font-bold text-ink mb-4">Related Guides</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[
              { title: 'Best Smartphones India — All Budgets', href: '/best-smartphones-india' },
              { title: 'Smartphone Buying Guide India', href: '/smartphone-buying-guide-india' },
              { title: 'Android Battery Health Guide', href: '/android-battery-health-guide' },
              { title: 'Phone Comparison Hub', href: '/phone-comparison-guide-india' },
            ].map(({ title, href }) => (
              <Link key={href} href={href} className="border border-border p-3 bg-white hover:border-[#d4220a] transition-colors group">
                <span className="font-sans text-sm font-bold text-ink group-hover:text-[#d4220a] transition-colors">{title} →</span>
              </Link>
            ))}
          </div>
        </section>

        <div className="mt-8 bg-[#f8f4ef] border-l-4 border-[#d4220a] p-5">
          <p className="font-sans text-xs font-bold text-[#d4220a] uppercase tracking-wider mb-2">Editorial Note</p>
          <p className="font-sans text-sm text-muted">Rankings based on BGMI and gaming benchmark data from published reviews, sustained performance testing, and India-specific thermal testing in summer conditions. Updated March 2026. By Vijay Yadav, The Tech Bharat.</p>
        </div>

      </div>
    </div>
  )
}