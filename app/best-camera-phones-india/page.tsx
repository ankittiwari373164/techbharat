// app/best-camera-phones-india/page.tsx
import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Best Camera Phones in India 2026 — By Budget | The Tech Bharat',
  description: 'Best camera phones in India 2026 — from ₹15,000 to flagship. Ranked for Indian photography conditions: low light, street, portraits. Updated March 2026.',
  alternates: { canonical: 'https://thetechbharat.com/best-camera-phones-india' },
  openGraph: {
    title: 'Best Camera Phones in India 2026',
    description: 'Camera phone rankings for Indian buyers — tested for Indian lighting conditions, skin tones, and use cases.',
    url: 'https://thetechbharat.com/best-camera-phones-india',
    type: 'article',
  },
}

export default function BestCameraPhonesIndiaPage() {
  return (
    <>
      <div className="bg-paper min-h-screen">
        <div className="max-w-4xl mx-auto px-4 py-10">

          <nav className="font-sans text-xs text-muted mb-6 flex items-center gap-2">
            <Link href="/" className="hover:text-[#d4220a]">Home</Link><span>/</span>
            <Link href="/guides" className="hover:text-[#d4220a]">Guides</Link><span>/</span>
            <span className="text-ink">Best Camera Phones India</span>
          </nav>

          <div className="mb-8">
            <div className="flex items-center gap-2 mb-3">
              <span className="bg-[#d4220a] text-white font-sans text-[10px] font-bold px-2.5 py-1 uppercase tracking-widest">Updated March 2026</span>
            </div>
            <h1 className="font-playfair text-3xl md:text-4xl font-black text-ink leading-tight mb-4">
              Best Camera Phones in India 2026 — Ranked for Indian Conditions
            </h1>
            <p className="font-body text-lg text-[#2a2a2a] leading-relaxed">
              Indian photography has specific challenges: harsh afternoon sunlight, low-light indoor events (weddings, family gatherings), skin tone accuracy across diverse complexions, and fast-moving street scenes. These rankings reflect those real conditions — not just lab scores.
            </p>
          </div>

          {/* What matters for Indian photography */}
          <div className="bg-[#1a3a5c]/5 border-l-4 border-[#1a3a5c] p-5 mb-8">
            <h2 className="font-sans text-sm font-bold text-[#1a3a5c] uppercase tracking-wider mb-3">What Indian Buyers Should Evaluate</h2>
            <ul className="space-y-2">
              {[
                'Skin tone accuracy — does portrait mode preserve natural Indian skin tones without artificial lightening?',
                'Low-light performance — weddings, restaurants, indoor events with dim lighting',
                'Outdoor HDR — harsh sunlight creates challenging exposure situations daily in India',
                'Video stabilisation — for travel, events, street photography',
                'Natural processing vs over-sharpened output — many budget phones produce artificially "crispy" images',
              ].map((item, i) => (
                <li key={i} className="font-sans text-sm text-ink flex items-start gap-2">
                  <span className="text-[#d4220a] font-bold flex-shrink-0">→</span>{item}
                </li>
              ))}
            </ul>
          </div>

          {/* Rankings */}
          {[
            {
              title: 'Best Camera Phone Under ₹25,000',
              winner: 'Nothing Phone (3a)',
              price: '~₹25,000',
              camera: '50MP main (OIS) + 50MP ultrawide',
              why: 'Natural colour science without over-processing. Nothing\'s camera tuning avoids the aggressive sharpening common in Chinese phones at this price. Daylight shots look closest to what the eye sees.',
              consideration: 'Low-light is acceptable but not class-leading. Selfie camera straightforward without aggressive beautification.',
              runner: 'Poco X6 Pro — better raw performance, slightly more processed camera output',
            },
            {
              title: 'Best Camera Phone ₹25,000 – ₹40,000',
              winner: 'Samsung Galaxy A55 5G',
              price: '~₹39,999',
              camera: '50MP (OIS) + 12MP ultrawide + 5MP macro',
              why: 'Samsung\'s camera software tuning at the A55\'s price point handles Indian skin tones better than most competitors. The OIS on the main sensor makes a genuine difference for wedding and event photography at this budget.',
              consideration: 'Exynos chipset runs slightly hotter than Snapdragon equivalents. Macro camera largely redundant.',
              runner: 'OnePlus Nord CE 4 — faster charging, but Samsung wins on camera consistency',
            },
            {
              title: 'Best Camera Phone ₹40,000 – ₹60,000',
              winner: 'Google Pixel 9a',
              price: '~₹52,999',
              camera: '48MP main (OIS) + 13MP ultrawide',
              why: 'Google\'s computational photography remains the benchmark at this price. Night Sight low-light performance, skin tone accuracy across Indian complexions, and Magic Eraser for removing photo-bombers make this genuinely useful rather than spec-impressive.',
              consideration: 'No telephoto lens — a limitation for event and travel photography. Limited India service centres.',
              runner: 'Nothing Phone 4A Pro — better build, but Pixel wins on camera AI decisively',
            },
            {
              title: 'Best Camera Phone ₹60,000 – ₹1,00,000',
              winner: 'OnePlus 13',
              price: '~₹69,999',
              camera: '50MP main + 50MP ultrawide + 50MP periscope (3x optical)',
              why: 'Hasselblad colour tuning produces some of the most natural-looking images in this segment. The triple 50MP system is genuinely versatile for Indian photography needs — portrait, landscape, and telephoto all handled by high-resolution sensors.',
              consideration: 'Hasselblad tuning sometimes appears slightly muted for buyers used to Samsung\'s punchy colours.',
              runner: 'Xiaomi 15 Ultra — Leica cameras comparable, but less established India service',
            },
            {
              title: 'Best Camera Phone Above ₹1,00,000',
              winner: 'Google Pixel 9 Pro',
              price: '~₹1,09,999',
              camera: '50MP main + 48MP ultrawide + 48MP 5x telephoto',
              why: 'The best computational photography on any Android phone. For Indian wedding photographers as a secondary camera, content creators, and photography enthusiasts, the Pixel 9 Pro\'s AI processing — Pro mode, astrophotography, Video Boost — makes genuinely difficult shots achievable.',
              consideration: 'Samsung Galaxy S26 Ultra\'s 200MP sensor and 5x periscope telephoto is stronger for pure zoom. iPhone 16 Pro Max is better for video. Pixel wins on AI and stills.',
              runner: 'Samsung Galaxy S26 Ultra — most versatile overall camera system; Pixel wins on pure image quality',
            },
          ].map(({ title, winner, price, camera, why, consideration, runner }) => (
            <section key={title} className="mb-10">
              <h2 className="font-playfair text-2xl font-bold text-ink mb-4 pb-2 border-b-2 border-[#d4220a]">{title}</h2>
              <div className="bg-white border border-border p-5">
                <div className="flex items-start gap-3 mb-4">
                  <span className="bg-[#d4220a] text-white font-sans text-xs font-bold px-2 py-1 flex-shrink-0">WINNER</span>
                  <div>
                    <h3 className="font-sans text-lg font-bold text-ink">{winner}</h3>
                    <p className="font-sans text-sm font-semibold text-[#d4220a]">{price} · {camera}</p>
                  </div>
                </div>
                <p className="font-sans text-sm text-muted mb-3 leading-relaxed"><strong>Why it wins:</strong> {why}</p>
                <p className="font-sans text-sm text-muted mb-3 leading-relaxed"><strong>Consider if:</strong> {consideration}</p>
                <p className="font-sans text-xs text-muted border-t border-border pt-3 mt-3"><strong>Runner-up:</strong> {runner}</p>
              </div>
            </section>
          ))}

          {/* Camera Spec Explainer */}
          <section className="mb-10">
            <h2 className="font-playfair text-2xl font-bold text-ink mb-4 pb-2 border-b border-border">Camera Specs Explained for Indian Buyers</h2>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse font-sans text-sm">
                <thead>
                  <tr className="bg-[#1a3a5c] text-white">
                    <th className="px-3 py-2 text-left">Spec</th>
                    <th className="px-3 py-2 text-left">What It Means</th>
                    <th className="px-3 py-2 text-left">Indian Photography Relevance</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['OIS (Optical Image Stabilisation)', 'Physical lens movement compensates for hand shake', 'High — essential for low-light wedding and event photography'],
                    ['Sensor Size (1/1.5" etc)', 'Larger = more light captured per pixel', 'High — determines low-light and indoor performance'],
                    ['Aperture (f/1.8 etc)', 'Lower number = wider opening = more light', 'Medium — matters more in low light than outdoors'],
                    ['Megapixels', 'Resolution of final image', 'Low — 50MP vs 108MP difference is invisible in normal use'],
                    ['Periscope Telephoto', 'Long-range optical zoom without quality loss', 'Medium — useful for events, concerts, wildlife'],
                    ['Computational Photography', 'AI processing of multiple frames', 'High — determines how well the phone handles Indian skin tones and lighting'],
                  ].map(([spec, meaning, relevance], i) => (
                    <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="px-3 py-2 font-semibold border border-border">{spec}</td>
                      <td className="px-3 py-2 border border-border">{meaning}</td>
                      <td className="px-3 py-2 border border-border">{relevance}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Internal Links */}
          <section className="mt-8 pt-6 border-t border-border">
            <h2 className="font-playfair text-xl font-bold text-ink mb-4">Related Guides</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {[
                { title: 'Best Smartphones India — All Budgets', href: '/best-smartphones-india' },
                { title: 'Smartphone Buying Guide India', href: '/smartphone-buying-guide-india' },
                { title: 'Best Battery Backup Phones', href: '/best-battery-backup-phones-india' },
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
            <p className="font-sans text-sm text-muted">Camera rankings are based on published international review data, official sample images, and India-specific usage context. Rankings reflect March 2026 availability. Prices are approximate India market retail and may vary. No paid placements. By Vijay Yadav, The Tech Bharat.</p>
          </div>

        </div>
      </div>
    </>
  )
}