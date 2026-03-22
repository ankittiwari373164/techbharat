// app/best-camera-phones-india/page.tsx
import { Metadata } from 'next'
import Link from 'next/link'
import { getPillarArticles, formatPillarDate } from '@/lib/pillar-utils'

export const revalidate = 1800

export const metadata: Metadata = {
  title: 'Best Camera Phones in India 2026 — By Budget | The Tech Bharat',
  description: 'Best camera phones in India 2026 — from ₹15,000 to flagship. Ranked for Indian photography conditions: low light, street, portraits.',
  alternates: { canonical: 'https://thetechbharat.com/best-camera-phones-india' },
  openGraph: {
    title: 'Best Camera Phones in India 2026',
    description: 'Camera phone rankings for Indian buyers — tested for Indian lighting conditions, skin tones, and use cases.',
    url: 'https://thetechbharat.com/best-camera-phones-india',
    type: 'article',
  },
}

export default async function BestCameraPhonesIndiaPage() {
  const articles = await getPillarArticles(
    ['camera', 'photo', 'photography', 'selfie', 'portrait', 'night mode', 'low light', 'lens', 'megapixel', 'image quality', 'camera review'],
    [],
    18
  )

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: [
          { '@type': 'Question', name: 'Which is the best camera phone under ₹25,000 in India?', acceptedAnswer: { '@type': 'Answer', text: 'For Indian buyers, the best camera phone under ₹25,000 prioritises natural skin tone processing, OIS for low-light event photography, and consistent daylight performance. Check our latest articles below for current top picks.' } },
          { '@type': 'Question', name: 'Does megapixels determine camera quality?', acceptedAnswer: { '@type': 'Answer', text: 'No. Sensor size, aperture, OIS, and computational photography software matter far more. A 50MP phone with better sensor and software consistently outperforms a 108MP phone with poor processing.' } },
        ]
      })}} />

      <div className="bg-paper min-h-screen">
        <div className="max-w-4xl mx-auto px-4 py-10">

          {/* Breadcrumb */}
          <nav className="font-sans text-xs text-muted mb-6 flex items-center gap-2">
            <Link href="/" className="hover:text-[#d4220a]">Home</Link><span>/</span>
            <Link href="/guides" className="hover:text-[#d4220a]">Guides</Link><span>/</span>
            <span className="text-ink">Best Camera Phones India</span>
          </nav>

          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-3">
              <span className="bg-[#d4220a] text-white font-sans text-[10px] font-bold px-2.5 py-1 uppercase tracking-widest">Evergreen Guide</span>
              <span className="font-sans text-xs text-muted">Updated continuously</span>
            </div>
            <h1 className="font-playfair text-3xl md:text-4xl font-black text-ink leading-tight mb-4">
              Best Camera Phones in India — Ranked for Indian Conditions
            </h1>
            <p className="font-body text-lg text-[#2a2a2a] leading-relaxed">
              Indian photography has specific challenges: harsh afternoon sunlight, low-light wedding halls, diverse skin tones, and street scenes. Our reviews and analyses below reflect those real conditions — not just lab scores.
            </p>
          </div>

          {/* What matters */}
          <div className="bg-[#1a3a5c]/5 border-l-4 border-[#1a3a5c] p-5 mb-8">
            <h2 className="font-sans text-sm font-bold text-[#1a3a5c] uppercase tracking-wider mb-3">What Indian Buyers Should Evaluate</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {[
                ['Skin tone accuracy', 'Natural Indian skin tones without artificial lightening in portrait mode'],
                ['Low-light performance', 'Weddings, restaurants, indoor events — where India shoots most'],
                ['Outdoor HDR', 'Harsh sunlight is a daily Indian reality — readability and exposure both matter'],
                ['OIS (Optical Image Stabilisation)', 'Essential for hand-held video and event photography'],
                ['Video stabilisation', 'For travel, events, street photography on the move'],
                ['Processing style', 'Natural vs over-sharpened — many phones add artificial "crispness"'],
              ].map(([title, desc]) => (
                <div key={title} className="bg-white border border-border p-3">
                  <p className="font-sans text-xs font-bold text-ink mb-0.5">{title}</p>
                  <p className="font-sans text-xs text-muted">{desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Spec explainer table */}
          <section className="mb-10">
            <h2 className="font-playfair text-xl font-bold text-ink mb-4 pb-2 border-b border-border">Camera Specs Explained</h2>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse font-sans text-sm">
                <thead>
                  <tr className="bg-[#1a3a5c] text-white">
                    <th className="px-3 py-2 text-left">Spec</th>
                    <th className="px-3 py-2 text-left">What It Means</th>
                    <th className="px-3 py-2 text-left">Indian Relevance</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['OIS', 'Physical lens stabilisation compensates for hand shake', 'High — essential for weddings, events, video'],
                    ['Sensor Size (1/1.5")', 'Larger = more light per pixel', 'High — determines indoor & low-light quality'],
                    ['Aperture (f/1.8)', 'Lower number = more light', 'Medium — matters more in low light than outdoors'],
                    ['Megapixels', 'Image resolution', 'Low — 50MP vs 108MP invisible in everyday use'],
                    ['Periscope Telephoto', 'Long-range optical zoom without quality loss', 'Medium — events, concerts, architecture'],
                    ['Computational Photography', 'AI multi-frame processing', 'High — determines skin tones and night shots'],
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

          {/* Dynamic articles section */}
          <section>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-6 h-0.5 bg-[#d4220a]" />
              <h2 className="font-playfair text-2xl font-bold text-ink">Camera Phone Articles & Reviews</h2>
              {articles.length > 0 && (
                <span className="font-sans text-xs text-muted bg-gray-100 px-2 py-0.5 rounded">{articles.length} articles</span>
              )}
            </div>

            {articles.length === 0 ? (
              <div className="border border-border p-8 text-center bg-white">
                <p className="font-sans text-sm text-muted">Camera phone articles coming soon. <Link href="/mobile-news" className="text-[#d4220a] hover:underline">Browse all mobile news →</Link></p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {articles.map(article => (
                  <Link
                    key={article.slug}
                    href={`/${article.slug}`}
                    className="bg-white border border-border hover:border-[#d4220a] transition-colors group block"
                  >
                    {article.featuredImage && (
                      <div className="relative overflow-hidden" style={{ paddingBottom: '56.25%' }}>
                        <img
                          src={article.featuredImage}
                          alt={article.title}
                          width={400} height={225}
                          loading="lazy"
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
                        />
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
                      <h3 className="font-sans text-sm font-bold text-ink leading-snug group-hover:text-[#d4220a] transition-colors line-clamp-2 mb-1.5">
                        {article.title}
                      </h3>
                      <p className="font-sans text-xs text-muted line-clamp-2">{article.summary}</p>
                      <div className="mt-2 flex items-center justify-between">
                        <span className="font-sans text-[10px] text-muted">{article.readTime} min read</span>
                        <span className="font-sans text-xs font-semibold text-[#d4220a]">Read →</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </section>

          {/* Related pillar pages */}
          <section className="mt-10 pt-6 border-t border-border">
            <h2 className="font-playfair text-xl font-bold text-ink mb-4">Related Buying Guides</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {[
                { title: 'Best Smartphones India — All Budgets', href: '/best-smartphones-india' },
                { title: 'Smartphone Buying Guide India', href: '/smartphone-buying-guide-india' },
                { title: 'Best Battery Backup Phones', href: '/best-battery-backup-phones-india' },
                { title: 'Best Gaming Phones India', href: '/best-gaming-phones-india' },
              ].map(({ title, href }) => (
                <Link key={href} href={href} className="border border-border p-3 bg-white hover:border-[#d4220a] transition-colors group">
                  <span className="font-sans text-sm font-bold text-ink group-hover:text-[#d4220a] transition-colors">{title} →</span>
                </Link>
              ))}
            </div>
          </section>

          <div className="mt-8 bg-[#f8f4ef] border-l-4 border-[#d4220a] p-5">
            <p className="font-sans text-xs font-bold text-[#d4220a] uppercase tracking-wider mb-2">Editorial Note</p>
            <p className="font-sans text-sm text-muted">Articles on this page are fetched in real-time from The Tech Bharat's published content. Rankings and recommendations reflect India-specific usage. No paid placements. By Vijay Yadav.</p>
          </div>

        </div>
      </div>
    </>
  )
}