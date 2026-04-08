// app/best-phones-for-students-india/page.tsx
import { Metadata } from 'next'
import Link from 'next/link'
import { getPillarArticles, formatPillarDate, currentMonthYear } from '@/lib/pillar-utils'

export const revalidate = 3600

export async function generateMetadata(): Promise<Metadata> {
  const { month, year } = currentMonthYear()
  return {
    title: `Best Phones for Students in India — ${month} ${year} Guide | The Tech Bharat`,
    description: `Best smartphones for Indian students ${month} ${year}. Budget picks with good battery, camera, and durability for college life.`,
    alternates: { canonical: 'https://thetechbharat.com/best-phones-for-students-india' },
    openGraph: { title: `Best Phones for Students in India — ${month} ${year} Guide | The Tech Bharat`, url: 'https://thetechbharat.com/best-phones-for-students-india', type: 'article' },
  }
}

export default async function BestPhonesForStudentsPage() {
  const { month, year } = currentMonthYear()
  const articles = await getPillarArticles(['student', 'college', 'budget', 'lightweight', 'battery', 'affordable', 'first phone'], [], 15)
  const reviews  = articles.filter(a => a.type === 'review' || a.type === 'compare')
  const news     = articles.filter(a => a.type === 'mobile-news')

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      { '@type': 'Question', name: `Best phone for college students under ₹15,000 in ` + month + ` ` + year + `?`, acceptedAnswer: { '@type': 'Answer', text: `Samsung Galaxy M15 5G (reliable brand, good service network), Redmi Note 14 (excellent camera for assignments), Nothing Phone (3a) at ₹25K if budget allows. Samsung is the safest for service centre access outside metros.` } },
      { '@type': 'Question', name: `Should students buy iPhones?`, acceptedAnswer: { '@type': 'Answer', text: `Only if the family already uses iOS ecosystem or the student is entering a design/creative field where Mac ecosystem matters. Otherwise: Android at ₹15K–₹25K delivers better value for typical student needs.` } }
    ]
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <div className="bg-paper min-h-screen">
        <div className="max-w-4xl mx-auto px-4 py-10">
          <nav className="font-sans text-xs text-muted mb-6 flex items-center gap-2">
            <Link href="/" className="hover:text-[#d4220a]">Home</Link><span>/</span>
            <span className="text-ink">Best Phones for Students in India — {month} {year} Guide</span>
          </nav>
          <div className="mb-8">
            <span className="bg-[#d4220a] text-white font-sans text-[10px] font-bold px-2.5 py-1 uppercase tracking-widest">Updated {month} {year}</span>
            <h1 className="font-playfair text-3xl md:text-4xl font-black text-ink leading-tight mt-3 mb-4">Best Phones for Students in India — {month} {year} Guide</h1>
            <p className="font-body text-lg text-[#2a2a2a] leading-relaxed">Students need a phone for lectures, notes, WhatsApp, YouTube, and occasional BGMI — all on a budget. These {month} {year} picks balance all those needs honestly.</p>
          </div>

          <section className="mb-8">
            <h2 className="font-playfair text-xl font-bold text-ink mb-4 pb-2 border-b border-border">What Students Actually Need</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="bg-white border border-border p-4">
                <p className="font-sans text-xs font-bold text-ink mb-1">Battery first</p>
                <p className="font-sans text-xs text-muted leading-relaxed">Long college days with streaming, maps, and social media drain batteries. 5000mAh minimum.</p>
              </div>
              <div className="bg-white border border-border p-4">
                <p className="font-sans text-xs font-bold text-ink mb-1">Durable build</p>
                <p className="font-sans text-xs text-muted leading-relaxed">Gorilla Glass + decent back. Students drop phones. IP rating helps for monsoon commutes.</p>
              </div>
              <div className="bg-white border border-border p-4">
                <p className="font-sans text-xs font-bold text-ink mb-1">Camera for documents</p>
                <p className="font-sans text-xs text-muted leading-relaxed">Board photos, assignment scanning, group photos. A decent 50MP handles all this well.</p>
              </div>
              <div className="bg-white border border-border p-4">
                <p className="font-sans text-xs font-bold text-ink mb-1">Software update longevity</p>
                <p className="font-sans text-xs text-muted leading-relaxed">Buy a phone that will receive security updates for your entire college duration (3–4 years).</p>
              </div>
            </div>
          </section>

          {reviews.length > 0 && (
            <section className="mb-10">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-6 h-0.5 bg-[#d4220a]" />
                <h2 className="font-playfair text-2xl font-bold text-ink">Latest Reviews & Analysis</h2>
                <span className="font-sans text-xs text-muted bg-gray-100 px-2 py-0.5 rounded">{reviews.length}</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {reviews.map(article => (
                  <Link key={article.slug} href={`/${article.slug}`}
                    className="bg-white border border-border hover:border-[#d4220a] transition-colors group block">
                    {article.featuredImage && !article.featuredImage.startsWith('/phone-images/') && (
                      <div className="relative overflow-hidden" style={{ paddingBottom: '56.25%' }}>
                        <img src={article.featuredImage} alt={article.title} width={400} height={225} loading="lazy"
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                          style={{ position:'absolute', inset:0, width:'100%', height:'100%' }}
                          onError={e=>{(e.target as HTMLImageElement).src='https://thetechbharat.com/og-image.jpg'}} />
                        <span className="absolute top-2 left-2 bg-[#d4220a] text-white font-sans text-[9px] font-bold px-2 py-0.5 uppercase tracking-wider z-10">{article.type === 'review' ? 'Review' : 'Compare'}</span>
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
            </section>
          )}
          {news.length > 0 && (
            <section className="mb-10">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-6 h-0.5 bg-[#1a3a5c]" />
                <h2 className="font-playfair text-2xl font-bold text-ink">Latest News</h2>
                <span className="font-sans text-xs text-muted bg-gray-100 px-2 py-0.5 rounded">{news.length}</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {news.map(article => (
                  <Link key={article.slug} href={`/${article.slug}`}
                    className="bg-white border border-border hover:border-[#d4220a] transition-colors group block">
                    {article.featuredImage && !article.featuredImage.startsWith('/phone-images/') && (
                      <div className="relative overflow-hidden" style={{ paddingBottom: '56.25%' }}>
                        <img src={article.featuredImage} alt={article.title} width={400} height={225} loading="lazy"
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                          style={{ position:'absolute', inset:0, width:'100%', height:'100%' }}
                          onError={e=>{(e.target as HTMLImageElement).src='https://thetechbharat.com/og-image.jpg'}} />
                        <span className="absolute top-2 left-2 bg-[#1a3a5c] text-white font-sans text-[9px] font-bold px-2 py-0.5 uppercase tracking-wider z-10">News</span>
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
            </section>
          )}
          {articles.length === 0 && (
            <div className="border border-border p-10 text-center bg-white mb-10">
              <p className="font-sans text-sm text-muted">Loading articles. <Link href="/mobile-news" className="text-[#d4220a] hover:underline">Browse all mobile news →</Link></p>
            </div>
          )}
          <section className="mb-10">
            <h2 className="font-playfair text-2xl font-bold text-ink mb-5 pb-2 border-b border-border">Frequently Asked Questions</h2>
            <div className="space-y-4">

              <div className="border border-border p-4 bg-white">
                <h3 className="font-sans text-sm font-bold text-ink mb-2">Best phone for college students under ₹15,000 in {month} {year}?</h3>
                <p className="font-sans text-sm text-muted leading-relaxed">Samsung Galaxy M15 5G (reliable brand, good service network), Redmi Note 14 (excellent camera for assignments), Nothing Phone (3a) at ₹25K if budget allows. Samsung is the safest for service centre access outside metros.</p>
              </div>
              <div className="border border-border p-4 bg-white">
                <h3 className="font-sans text-sm font-bold text-ink mb-2">Should students buy iPhones?</h3>
                <p className="font-sans text-sm text-muted leading-relaxed">Only if the family already uses iOS ecosystem or the student is entering a design/creative field where Mac ecosystem matters. Otherwise: Android at ₹15K–₹25K delivers better value for typical student needs.</p>
              </div>
            </div>
          </section>
          <section className="mt-8 pt-6 border-t border-border">
            <h2 className="font-playfair text-xl font-bold text-ink mb-4">Related Guides</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Link href="/best-budget-phones-india" className="border border-border p-3 bg-white hover:border-[#d4220a] transition-colors group"><span className="font-sans text-sm font-bold text-ink group-hover:text-[#d4220a]">Best Budget Phones India →</span></Link>
              <Link href="/best-battery-backup-phones-india" className="border border-border p-3 bg-white hover:border-[#d4220a] transition-colors group"><span className="font-sans text-sm font-bold text-ink group-hover:text-[#d4220a]">Best Battery Phones India →</span></Link>
            </div>
          </section>
          <div className="mt-8 bg-[#f8f4ef] border-l-4 border-[#d4220a] p-5">
            <p className="font-sans text-xs font-bold text-[#d4220a] uppercase tracking-wider mb-2">Editorial Note</p>
            <p className="font-sans text-sm text-muted">Articles fetched live. Guide updated for {month} {year}. No paid placements. By Vijay Yadav, The Tech Bharat.</p>
          </div>
        </div>
      </div>
    </>
  )
}