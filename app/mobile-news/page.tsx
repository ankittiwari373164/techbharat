import { getAllArticlesAsync } from '@/lib/store'
import ArticleCard from '@/components/ArticleCard'
import type { Metadata } from 'next'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

const BRANDS = ['Samsung', 'Apple', 'Xiaomi', 'OnePlus', 'Realme', 'OPPO', 'Vivo', 'Nothing', 'Motorola']

async function getDynamicSeo(pageKey: string) {
  try {
    const { getPageSeo } = await import('@/lib/seo-store')
    return await getPageSeo(pageKey as never)
  } catch { return null }
}

export async function generateMetadata({ searchParams }: { searchParams: { brand?: string } }): Promise<Metadata> {
  const brand = searchParams.brand
  let dynKeywords: string[] = ['mobile news India', 'smartphone launch India', 'new phone India', 'phone price India']
  if (!brand) {
    const seo = await getDynamicSeo('mobile-news')
    if (seo?.keywords?.length) dynKeywords = seo.keywords
  }
  return {
    title: brand ? `${brand} News India – Latest ${brand} Smartphones | The Tech Bharat` : 'Mobile News – Latest Smartphone News India | The Tech Bharat',
    description: brand
      ? `Latest ${brand} smartphone news, launches, prices, and updates for India. Expert analysis from The Tech Bharat.`
      : 'Latest mobile phone news, launches, leaks, and updates from Samsung, Apple, Xiaomi, OnePlus and more. India-first coverage.',
    keywords: dynKeywords,
    alternates: { canonical: brand ? `https://thetechbharat.com/mobile-news?brand=${brand}` : 'https://thetechbharat.com/mobile-news' },
    openGraph: {
      title: brand ? `${brand} News India | The Tech Bharat` : 'Mobile News India | The Tech Bharat',
      description: brand ? `All ${brand} smartphone news for India` : 'Latest mobile news for Indian smartphone buyers',
      images: [{ url: '/og-image.jpg', width: 1200, height: 630 }],
    },
  }
}

export default async function MobileNewsPage({ searchParams }: { searchParams: { brand?: string } }) {
  const allArticles = await getAllArticlesAsync()

  // ✅ ONLY CHANGE: filter high-quality articles
  let articles = searchParams.brand
  ? allArticles.filter((a: any) => {
      const quality = a.contentQuality ?? 7
      return (
        a.type === 'mobile-news' &&
        a.brand.toLowerCase() === searchParams.brand!.toLowerCase() &&
        quality >= 6 &&
        !a.isLowValue
      )
    })
  : allArticles.filter((a: any) => {
      const quality = a.contentQuality ?? 7
      return a.type === 'mobile-news' && quality >= 6 && !a.isLowValue
    })

  const brand = searchParams.brand

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Category header - unchanged */}
      <div className="border-b-2 border-[#1a3a5c] mb-8 pb-6">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 bg-[#1a3a5c] flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
          </div>
          <h1 className="font-playfair text-3xl font-black text-ink">
            {brand ? `${brand} News` : 'Mobile News'}
          </h1>
        </div>
        <p className="font-body text-sm text-[#3a3a3a] max-w-2xl">
          {brand
            ? `In-depth coverage of every ${brand} smartphone launch, price change, software update, and market move in India. Updated as news breaks.`
            : 'The latest smartphone news, launches, leaks, and analysis — curated for Indian buyers. We cover pricing in ₹, 5G availability, and what actually matters for the Indian market.'}
        </p>

        <div className="flex flex-wrap gap-2 mt-4">
          <Link href="/mobile-news" className={`font-sans text-xs px-3 py-1.5 border transition-colors ${!brand ? 'bg-[#1a3a5c] text-white border-[#1a3a5c]' : 'border-border text-muted hover:border-[#1a3a5c] hover:text-[#1a3a5c]'}`}>
            All
          </Link>
          {BRANDS.map(b => (
            <Link key={b} href={`/mobile-news?brand=${b}`}
              className={`font-sans text-xs px-3 py-1.5 border transition-colors ${brand === b ? 'bg-[#1a3a5c] text-white border-[#1a3a5c]' : 'border-border text-muted hover:border-[#1a3a5c] hover:text-[#1a3a5c]'}`}>
              {b}
            </Link>
          ))}
        </div>
      </div>

      {articles.length === 0 ? (
        <div className="text-center py-20">
          <p className="font-playfair text-2xl text-ink mb-3">No articles yet</p>
          <p className="font-body text-sm text-muted">Check back soon — we publish fresh smartphone news daily.</p>
          <Link href="/" className="font-sans text-xs font-semibold text-[#d4220a] mt-4 inline-block">← Back to Homepage</Link>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map(article => (
              <ArticleCard key={article.id} article={article} variant="card" />
            ))}
          </div>

          {!brand && (
            <div className="mt-16 border-t border-border pt-10">
              {/* unchanged */}
            </div>
          )}
        </>
      )}
    </div>
  )
}