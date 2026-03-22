// app/best-smartphones-india/page.tsx
import { Metadata } from 'next'
import Link from 'next/link'
import { getPillarArticles } from '@/lib/pillar-utils'
import PillarArticleGrid from '@/components/PillarArticleGrid'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Best Smartphones in India 2026 — Every Budget | The Tech Bharat',
  description: 'Best smartphones in India by budget — ₹10K to ₹1L+. Honest picks for every Indian buyer updated March 2026. No paid placements.',
  alternates: { canonical: 'https://thetechbharat.com/best-smartphones-india' },
  openGraph: { title: 'Best Smartphones in India 2026 — Every Budget', url: 'https://thetechbharat.com/best-smartphones-india', type: 'article' },
}

interface Phone {
  name: string; price: string; why: string; best: string; articleSlug: string | null
}

const picks: { budget: string; slug: string; phones: Phone[] }[] = [
  {
    budget: 'Best Phones Under ₹15,000', slug: 'under-15k',
    phones: [
      { name: 'Redmi Note 14',       price: '~₹13,999', why: 'AMOLED display, 5G support, 50MP camera for the price',           best: 'Best all-rounder',         articleSlug: null },
      { name: 'Realme Narzo 70',     price: '~₹12,999', why: 'Fastest charging in segment, clean display, solid battery',       best: 'Best charging speed',      articleSlug: null },
      { name: 'Samsung Galaxy A15 5G', price: '~₹14,999', why: 'Samsung service network, 5-year security patches, reliable AMOLED', best: 'Best long-term reliability', articleSlug: null },
    ],
  },
  {
    budget: 'Best Phones ₹15,000 – ₹25,000', slug: '15k-25k',
    phones: [
      { name: 'Nothing Phone (3a)', price: '~₹25,000', why: 'Clean Nothing OS, unique design, solid camera, 3-year updates',    best: 'Best software experience', articleSlug: '/nothing-phone-3a-review-can-transparent-design-justify-35000-in-india' },
      { name: 'OnePlus Nord CE 4',  price: '~₹24,999', why: '100W charging, Snapdragon chipset, clean OxygenOS at this tier',   best: 'Best fast charging',       articleSlug: null },
      { name: 'Poco X6 Pro',        price: '~₹22,999', why: 'Flagship Dimensity chip at mid-range price, excellent display',    best: 'Best performance',         articleSlug: null },
    ],
  },
  {
    budget: 'Best Phones ₹25,000 – ₹40,000', slug: '25k-40k',
    phones: [
      { name: 'Nothing Phone (3a) Pro',      price: '~₹32,000', why: 'Premium build, clean OS, better cameras, 4-year updates',          best: 'Best build quality',          articleSlug: null },
      { name: 'OnePlus 13R',                  price: '~₹39,999', why: 'Snapdragon 8 Gen 2, 80W charging, 4 years OS updates, solid cameras', best: 'Best performance value',       articleSlug: null },
      { name: 'Samsung Galaxy A55 5G',        price: '~₹39,999', why: '5-year OS updates, Samsung service network, premium camera with OIS', best: 'Best long-term support',       articleSlug: null },
    ],
  },
  {
    budget: 'Best Phones ₹40,000 – ₹70,000', slug: '40k-70k',
    phones: [
      { name: 'Nothing Phone 4A Pro', price: '~₹40,000', why: 'Premium metal build, dual 50MP cameras, clean Nothing OS 3.0, wireless charging', best: 'Best design',              articleSlug: '/nothing-phone-4a-pro-that-40k-flagship-feel-without-the-price-tag' },
      { name: 'Google Pixel 9a',     price: '~₹52,999', why: '7-year updates, best computational photography at price, Tensor G4',               best: 'Best camera AI + updates', articleSlug: '/google-pixel-10a-the-only-45k-phone-worth-your-money-in-india' },
      { name: 'OnePlus 13',          price: '~₹64,999', why: 'Snapdragon 8 Elite, Hasselblad cameras, 100W charging, 4 years updates',           best: 'Best overall flagship value', articleSlug: null },
    ],
  },
  {
    budget: 'Best Phones ₹70,000+', slug: '70k-plus',
    phones: [
      { name: 'Samsung Galaxy S26 Ultra', price: '~₹1,34,999', why: 'S Pen, Privacy Display, 7-year updates, 200MP camera, best Android flagship', best: 'Best Android flagship', articleSlug: '/galaxy-s26-ultra-privacy-display-proves-hardware-still-matters' },
      { name: 'iPhone 16 Pro',            price: '~₹1,19,900', why: 'A18 Pro chip, ProRes video, 7-year iOS support, best ecosystem',              best: 'Best for iOS users',    articleSlug: null },
      { name: 'Google Pixel 9 Pro',       price: '~₹1,09,999', why: 'Best computational photography, pure Android, 7-year updates, Google AI',    best: 'Best photography + AI', articleSlug: null },
    ],
  },
]

export default async function BestSmartphonesIndiaPage() {
  // Fetch ALL recent articles — this page covers all topics
  const allArticles = await getPillarArticles(
    ['best', 'review', 'india', 'price', 'launch', 'worth', 'buying', 'recommended'],
    [],
    15
  )

  return (
    <>
      <div className="bg-paper min-h-screen">
        <div className="max-w-4xl mx-auto px-4 py-10">

          <nav className="font-sans text-xs text-muted mb-6 flex items-center gap-2">
            <Link href="/" className="hover:text-[#d4220a]">Home</Link><span>/</span>
            <Link href="/guides" className="hover:text-[#d4220a]">Guides</Link><span>/</span>
            <span className="text-ink">Best Smartphones India</span>
          </nav>

          <div className="mb-8">
            <div className="flex items-center gap-2 mb-3">
              <span className="bg-[#d4220a] text-white font-sans text-[10px] font-bold px-2.5 py-1 uppercase tracking-widest">Updated March 2026</span>
            </div>
            <h1 className="font-playfair text-3xl md:text-4xl font-black text-ink leading-tight mb-4">
              Best Smartphones in India 2026 — Honest Picks at Every Budget
            </h1>
            <p className="font-body text-lg text-[#2a2a2a] leading-relaxed">
              Recommendations based on India market availability, service network, software update commitments, and value for Indian buyers. No paid placements. Updated monthly.
            </p>
          </div>

          {/* Jump Links */}
          <div className="bg-white border border-border p-4 mb-8">
            <p className="font-sans text-xs font-bold text-muted uppercase tracking-wider mb-3">Jump to Budget</p>
            <div className="flex flex-wrap gap-2">
              {picks.map(p => (
                <a key={p.slug} href={`#${p.slug}`} className="font-sans text-xs border border-border px-3 py-1.5 hover:border-[#d4220a] hover:text-[#d4220a] transition-colors">
                  {p.budget}
                </a>
              ))}
            </div>
          </div>

          {/* Picks by Budget */}
          <div className="space-y-12">
            {picks.map(section => (
              <section key={section.slug} id={section.slug}>
                <h2 className="font-playfair text-2xl font-bold text-ink mb-5 pb-2 border-b-2 border-[#d4220a]">{section.budget}</h2>
                <div className="space-y-4">
                  {section.phones.map(phone => (
                    <div key={phone.name} className="bg-white border border-border p-5 hover:border-[#d4220a] transition-colors">
                      <div className="flex items-center gap-2 mb-1">
                        {phone.articleSlug ? (
                          <Link href={phone.articleSlug} className="font-sans text-base font-bold text-ink hover:text-[#d4220a] transition-colors">
                            {phone.name} →
                          </Link>
                        ) : (
                          <h3 className="font-sans text-base font-bold text-ink">{phone.name}</h3>
                        )}
                        <span className="font-sans text-xs bg-[#1a3a5c] text-white px-2 py-0.5">{phone.best}</span>
                      </div>
                      <p className="font-sans text-sm font-semibold text-[#d4220a] mb-2">{phone.price}</p>
                      <p className="font-sans text-sm text-muted">{phone.why}</p>
                      {phone.articleSlug && (
                        <Link href={phone.articleSlug} className="inline-block mt-3 font-sans text-xs font-bold text-[#d4220a] border border-[#d4220a] px-3 py-1 hover:bg-[#d4220a] hover:text-white transition-colors">
                          Read Full Analysis →
                        </Link>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            ))}
          </div>

          {/* Dynamic articles from Redis */}
          <PillarArticleGrid
            articles={allArticles}
            title="Latest Phone Articles & Reviews"
            emptyMessage="No articles found yet."
          />

          {/* Related Guides */}
          <section className="mt-8 pt-6 border-t border-border">
            <h2 className="font-playfair text-xl font-bold text-ink mb-4">Explore More Guides</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {[
                { title: 'Smartphone Buying Guide India', href: '/smartphone-buying-guide-india' },
                { title: 'Best Camera Phones India', href: '/best-camera-phones-india' },
                { title: 'Best Battery Phones India', href: '/best-battery-backup-phones-india' },
                { title: 'Best Gaming Phones India', href: '/best-gaming-phones-india' },
              ].map(({ title, href }) => (
                <Link key={href} href={href} className="border border-border p-3 bg-white hover:border-[#d4220a] transition-colors group">
                  <span className="font-sans text-sm font-bold text-ink group-hover:text-[#d4220a] transition-colors">{title} →</span>
                </Link>
              ))}
            </div>
          </section>

          <div className="mt-8 bg-[#f8f4ef] border-l-4 border-[#d4220a] p-5">
            <p className="font-sans text-xs font-bold text-[#d4220a] uppercase tracking-wider mb-2">How We Select These Phones</p>
            <p className="font-sans text-sm text-muted leading-relaxed">India market availability, confirmed pricing, software update commitments, service network coverage, and India-specific usage. No paid placements. Last updated March 2026 by Vijay Yadav.</p>
          </div>
        </div>
      </div>
    </>
  )
}