'use client'
import { useState } from 'react'
import Link from 'next/link'
import type { Article } from '@/lib/store'
import ArticleCard from '@/components/ArticleCard'
import PillarNav from '@/components/PillarNav'
import { JSDOM } from 'jsdom'


function hashString(str: string) {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i)
    hash |= 0
  }
  return Math.abs(hash)
}

function generateUniqueVerdict(article: Article) {
  const seed = hashString(article.slug + article.title + article.brand)

  const pick = (arr: string[], offset = 0) =>
    arr[(seed + offset) % arr.length]

  const brand = article.brand || 'This device'

  const intros = [
    `After analyzing ${brand}'s approach here,`,
    `Looking at real-world usage,`,
    `From a practical perspective,`,
    `Based on overall performance,`
  ]

  const buyers = [
    'this is best suited for everyday users who want reliability.',
    'this makes sense for users who prefer balanced performance.',
    'this is ideal for users upgrading from older devices.',
    'this works well for users who want value without complexity.'
  ]

  const avoid = [
    'However, it may not satisfy power users.',
    'This might not be ideal for heavy gamers or advanced users.',
    'Users expecting flagship-level performance may feel limited.',
    'It’s not the best choice if you want top-tier features.'
  ]

  const endings = [
    'it delivers a stable experience but doesn’t lead the segment.',
    'it’s a practical choice, though not the most exciting one.',
    'it performs well overall, but faces strong competition.',
    'it offers good value, but with some compromises.'
  ]

  return {
    buy: `${pick(intros)} ${pick(buyers, 1)}`,
    notBuy: pick(avoid, 2),
    verdict: `${pick(intros, 3)} ${pick(endings, 4)}`
  }
}

// ── IMPROVED INTERNAL LINKER (2-3 LINKS MAX, NATURAL FLOW) ────────
function getInternalLinkMap(articleBrand?: string): [RegExp, string, string][] {
  // Brand-specific pillar links (highest priority)
  const brandPillarLinks: [RegExp, string, string][] = []
  const brand = (articleBrand || '').toLowerCase()

  if (brand === 'samsung') {
    brandPillarLinks.push([/\b(Samsung Galaxy|Galaxy S|Galaxy A|Galaxy M)\b/g, '/best-samsung-phones-india', 'Best Samsung Phones India 2026'])
  } else if (brand === 'apple' || brand === 'iphone') {
    brandPillarLinks.push([/\b(iPhone|Apple)\b/g, '/best-apple-iphone-india', 'Best iPhones in India 2026'])
  } else if (brand === 'oneplus') {
    brandPillarLinks.push([/\bOnePlus\b/g, '/best-oneplus-phones-india', 'Best OnePlus Phones India 2026'])
  } else if (brand === 'google' || brand === 'pixel') {
    brandPillarLinks.push([/\b(Pixel|Google Pixel)\b/g, '/best-google-phones-india', 'Best Google Phones India 2026'])
  }

  return [
    ...brandPillarLinks,
    // Buying guide — general (single instance only)
   
    // Price-specific guides
    [/\b(best phone under ₹30000|₹30k|₹30,000)\b/i, '/best-budget-phones-india', 'Best Budget Phones India 2026'],
    [/\b(best flagship|premium smartphone|flagship phone)\b/i, '/best-flagship-phones-india', 'Best Flagship Phones India 2026'],
    [/\b(best 5G phone|5G smartphones?)\b/i, '/best-5g-phones-india', 'Best 5G Phones India 2026'],
    [/\b(best camera phone|camera performance)\b/i, '/best-camera-phones-india', 'Best Camera Phones India 2026'],
    [/\b(gaming phone|BGMI|game performance)\b/i, '/best-gaming-phones-india', 'Best Gaming Phones India 2026'],
    // Content section links
    [/\b(phone reviews?|hands-on|first look)\b/i, '/reviews', 'Phone Reviews India'],
    [
  /\b(best smartphone|top phones|smartphone list)\b/i,
  '/best-smartphones-india',
  'Best Smartphones India 2026'
],
[
  /\b(which phone to buy|phone buying advice)\b/i,
  '/smartphone-buying-guide-india',
  'Smartphone Buying Guide India'
],
[
  /\b(phone comparison|vs|versus)\b/i,
  '/phone-comparison-guide-india',
  'Phone Comparison Guide India'
],
  ]
}

function addInternalLinks(
  html: string,
  currentSlug: string,
  resolvedBrand: string,
  allArticles: any[]
): string {
  try {
    const dom = new JSDOM(html)
    const doc = dom.window.document

    const walker = doc.createTreeWalker(
      doc.body,
      dom.window.NodeFilter.SHOW_TEXT
    )

    let linkCount = 0
    const MAX_LINKS = 5

    let node: Node | null

    while ((node = walker.nextNode())) {
      if (linkCount >= MAX_LINKS) break

      const parent = node.parentElement
      if (!parent) continue

      // ❌ skip unwanted tags
      if (
        parent.closest('a, script, style, h1, h2, h3')
      ) continue

      const text = node.textContent || ''
      if (text.length < 40) continue

      for (const article of allArticles) {
        if (!article.slug || article.slug === currentSlug) continue

        const words: string[] = (article.title || '')
          .toLowerCase()
          .replace(/[^a-z0-9\s]/g, '')
          .split(' ')
          .filter((w: string) => w.length > 5)

        const keyword = words[0]
        if (!keyword) continue

        const regex = new RegExp(`\\b${keyword}\\b`, 'i')

        if (regex.test(text)) {
          const replaced = text.replace(
            regex,
            `<a href="/${article.slug}" class="internal-link">${keyword}</a>`
          )

          const span = doc.createElement('span')
          span.innerHTML = replaced

          parent.replaceChild(span, node)

          linkCount++
          break
        }
      }
    }

    return doc.body.innerHTML

  } catch (err) {
    console.error('Internal link error:', err)
    return html
  }
}



interface ArticleClientProps {
  article: Article
  similar: unknown[]
  slug: string
  allArticles: Article[]
}

// Brand detection map
const BRAND_DETECT_MAP: [RegExp, string][] = [
  [/\bSamsung\b/i, 'Samsung'], [/\b(Apple|iPhone)\b/i, 'Apple'],
  [/\b(Xiaomi|Redmi)\b/i, 'Xiaomi'], [/\bOnePlus\b/i, 'OnePlus'],
  [/\bRealme\b/i, 'Realme'], [/\bVivo\b/i, 'Vivo'],
  [/\bOPPO\b/i, 'OPPO'], [/\biQOO\b/i, 'iQOO'],
  [/\bPoco\b/i, 'Poco'], [/\b(Motorola|Moto)\b/i, 'Motorola'],
  [/\bNothing\b/i, 'Nothing'], [/\b(Google Pixel|Pixel)\b/i, 'Google Pixel'],
  [/\bHonor\b/i, 'Honor'],
]

export default function ArticleClient({ article, similar, slug, allArticles }: ArticleClientProps) {
  const [reviewName, setReviewName] = useState('')
  const [reviewText, setReviewText] = useState('')
  const [reviewRating, setReviewRating] = useState(5)
  const [reviewLocation, setReviewLocation] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [liveArticle, setLiveArticle] = useState<Article>(article)
  const hv = generateUniqueVerdict(liveArticle)
  const similarArticles = similar as Article[]

  // Brand resolution: detect from title if generic 'Mobile'
  const resolvedBrand: string = (() => {
    if (liveArticle.brand && liveArticle.brand !== 'Mobile') return liveArticle.brand
    for (const [rx, name] of BRAND_DETECT_MAP) {
      if (rx.test(liveArticle.title)) return name
    }
    return liveArticle.brand || 'Mobile'
  })()

  // Defensive: filter out local fallbacks, only use real proxy URLs
  const safeImages = (Array.isArray(liveArticle.images) ? liveArticle.images : [])
    .filter((img: string) => img && !img.startsWith('/phone-images/') && !img.includes('picsum'))

  const featuredImg = (() => {
    const fi = liveArticle.featuredImage || ''
    if (fi && !fi.startsWith('/phone-images/') && !fi.includes('picsum')) return fi
    if (safeImages[0]) return safeImages[0]
    return 'https://thetechbharat.com/og-image.jpg'
  })()
  
  const safeBullets   = Array.isArray(liveArticle.bullets)               ? liveArticle.bullets               : []
  const safeTags      = Array.isArray(liveArticle.tags)                  ? liveArticle.tags                  : []
  const safeReviews   = Array.isArray(liveArticle.reviews)               ? liveArticle.reviews               : []
  const safeQSBullets = Array.isArray(liveArticle.quickSummary?.bullets) ? liveArticle.quickSummary!.bullets : []
  const safeQSBrand   = liveArticle.quickSummary?.brand || liveArticle.brand || ''

  
  const safeQSDate = liveArticle.quickSummary?.date || ''

  // Date formatting without locale issues
  const pubDate = liveArticle.publishDate
    ? (() => {
        const d = new Date(liveArticle.publishDate)
        const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
        return `${d.getUTCDate()} ${months[d.getUTCMonth()]} ${d.getUTCFullYear()}`
      })()
    : ''

  const TYPE_COLORS: Record<string, string> = {
    'mobile-news': 'bg-[#1a3a5c]',
    'review': 'bg-[#d4220a]',
    'compare': 'bg-[#2a6b3c]',
  }

  const handleReviewSubmit = async () => {
    if (!reviewName || !reviewText) return
    const res = await fetch(`/api/review/${slug}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: reviewName, text: reviewText, rating: reviewRating, location: reviewLocation }),
    })
    if (res.ok) {
      setSubmitted(true)
      const updated = await res.json()
      if (updated.article) setLiveArticle(updated.article)
    }
  }

  return (
    <div className="bg-paper min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Article */}
          <article className="lg:col-span-2">
            {/* Breadcrumb */}
            <nav className="font-sans text-xs text-muted mb-4 flex items-center gap-2">
              <Link href="/" className="hover:text-[#d4220a]">Home</Link>
              <span>/</span>
              <Link href={`/${liveArticle.type}`} className="hover:text-[#d4220a] capitalize">
                {liveArticle.type === 'review' ? 'Hands-On' : liveArticle.category}
              </Link>
              <span>/</span>
              <span className="text-ink line-clamp-1">{liveArticle.title}</span>
            </nav>

            {/* Category + Brand */}
            <div className="flex items-center gap-2 mb-3">
              <span className={`${TYPE_COLORS[liveArticle.type]} text-white font-sans text-[10px] font-bold px-2.5 py-1 uppercase tracking-widest`}>
                {liveArticle.category}
              </span>
              <span className="font-sans text-xs font-bold text-[#d4220a] uppercase">{resolvedBrand}</span>
            </div>

            {/* Title */}
            <h1 className="font-playfair text-2xl md:text-4xl font-black text-ink leading-tight mb-4">
              {liveArticle.title}
            </h1>

            {/* Meta */}
            <div className="flex flex-wrap items-center gap-3 border-b border-border pb-4 mb-5">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[#1a3a5c] flex items-center justify-center text-white text-xs font-bold font-sans">
                  {(liveArticle.author || 'TB').split(' ').map((n: string) => n[0]).join('').slice(0,2).toUpperCase()}
                </div>
                <div>
                  <p className="font-sans text-xs font-semibold text-ink">{liveArticle.author || 'The Tech Bharat'}</p>
                  <p className="font-sans text-[10px] text-muted">The Tech Bharat</p>
                </div>
              </div>
              <span className="font-sans text-[10px] text-muted">·</span>
              <span className="font-sans text-xs text-muted" suppressHydrationWarning>{pubDate}</span>
              <span className="font-sans text-[10px] text-muted">·</span>
              <span className="font-sans text-xs text-muted">{liveArticle.readTime} min read</span>
              {/* Share */}
              <div className="ml-auto flex items-center gap-2">
                <a
                  href={`https://wa.me/?text=${encodeURIComponent(liveArticle.title + ' ' + ('https://thetechbharat.com') + '/' + liveArticle.slug)}`}
                  target="_blank" rel="noopener noreferrer"
                  className="font-sans text-xs bg-[#25D366] text-white px-2.5 py-1 hover:opacity-80"
                >Share</a>
                <a
                  href={`https://t.me/share/url?url=${encodeURIComponent(('https://thetechbharat.com') + '/' + liveArticle.slug)}&text=${encodeURIComponent(liveArticle.title)}`}
                  target="_blank" rel="noopener noreferrer"
                  className="font-sans text-xs bg-[#2AABEE] text-white px-2.5 py-1 hover:opacity-80"
                >Telegram</a>
              </div>
            </div>

            {/* Featured Image */}
            <div className="relative mb-5 overflow-hidden" style={{ paddingBottom: '56.25%' }}>
              <img
                src={featuredImg}
                alt={liveArticle.title}
                width={1200}
                height={675}
                style={{position:'absolute',inset:0,width:'100%',height:'100%',objectFit:'cover'}}
                loading="eager"
                fetchPriority="high"
                onError={(e)=>{const t=e.target as HTMLImageElement; if(t.src!=='https://thetechbharat.com/og-image.jpg')t.src='https://thetechbharat.com/og-image.jpg'}}
              />
            </div>

            {/* Quick Summary Box */}
            <div className="bg-[#1a3a5c]/5 border-l-4 border-[#1a3a5c] p-4 mb-5">
              <div className="flex items-center gap-3 mb-2">
                <span className="font-sans text-xs font-bold text-[#1a3a5c] uppercase tracking-wider">Quick Summary</span>
                <span className="font-sans text-xs text-muted font-semibold">{safeQSBrand}</span>
                <span className="font-sans text-xs text-muted ml-auto">{safeQSDate}</span>
              </div>
              <ul className="space-y-1.5">
                {safeQSBullets.map((b, i) => (
                  <li key={i} className="font-sans text-sm text-ink flex items-start gap-2">
                    <span className="text-[#d4220a] mt-0.5 flex-shrink-0 font-bold">✓</span>
                    {b}
                  </li>
                ))}
              </ul>
            </div>

            {/* Introduction */}
<p className="font-body text-lg text-[#2a2a2a] leading-relaxed mb-5">
  {liveArticle.summary}
</p>

{/* ✅ NEW: VALUE SECTION (ONLY ADDITION) */}
{liveArticle.verdict && (
  <div className="bg-[#f8f4ef] border-l-4 border-[#d4220a] p-5 mb-6">
    <h3 className="font-bold text-sm mb-2">Who should buy this?</h3>
    <p className="text-sm text-[#2a2a2a]">{liveArticle.verdict.buy}</p>

    <h3 className="font-bold text-sm mt-4 mb-2">Who should NOT buy this?</h3>
    <p className="text-sm text-[#2a2a2a]">{liveArticle.verdict.notBuy}</p>

    <h3 className="font-bold text-sm mt-4 mb-2">Final Verdict</h3>
    <p className="text-sm text-[#2a2a2a]">{liveArticle.verdict.final}</p>
  </div>
)}

            {/* Key Bullet Points */}
            {safeBullets.length > 0 && (
              <div className="bg-white border border-border p-5 mb-5">
                <h3 className="font-sans text-sm font-bold text-ink uppercase tracking-wider mb-3">Key Highlights</h3>
                <ul className="space-y-2">
                  {safeBullets.map((b, i) => (
                    <li key={i} className="font-sans text-sm text-ink flex items-start gap-2.5">
                      <span className="w-5 h-5 bg-[#d4220a] text-white text-[10px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5 rounded-full">
                        {i + 1}
                      </span>
                      {b}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Full article content */}
            <div className="article-body-full">
              {/* Inline images */}
              {safeImages[1] && (
                <div className="relative my-6 overflow-hidden" style={{ paddingBottom: '50%' }}>
                  <img src={safeImages[1]} alt={`${liveArticle.title} — detailed view`} width={800} height={450} style={{position:"absolute",inset:0,width:"100%",height:"100%",objectFit:"cover"}} loading="lazy" onError={(e)=>{(e.target as HTMLImageElement).src="https://thetechbharat.com/og-image.jpg"}} />
                </div>
              )}

              {/* Full Content with limited internal links */}
              <div
                className="article-content"
                suppressHydrationWarning
                dangerouslySetInnerHTML={{ __html: addInternalLinks(
                  (typeof liveArticle.content === 'string' ? liveArticle.content : '')
                    .replace(/<script[^>]*type=["']application\/ld\+json["'][^>]*>[\s\S]*?<\/script>/gi, '')
                    .replace(/<h1(\s[^>]*)?>/gi, '<h2$1>')
                    .replace(/<\/h1>/gi, '</h2>'),
                  slug,
                  resolvedBrand,
                  allArticles,
                ) }}
              />

              {/* Mid-article image */}
              {safeImages[2] && (
                <div className="relative my-6 overflow-hidden" style={{ paddingBottom: '50%' }}>
                  <img src={safeImages[2]} alt={`${liveArticle.title} — additional image`} width={800} height={450} style={{position:"absolute",inset:0,width:"100%",height:"100%",objectFit:"cover"}} loading="lazy" onError={(e)=>{(e.target as HTMLImageElement).src="https://thetechbharat.com/og-image.jpg"}} />
                </div>
              )}

{/* ✅ ADDED: READ MORE SEO BOOST */}
<div className="mt-10 border-t pt-6">
  <h3 className="font-playfair text-lg font-bold mb-3">Read More</h3>

  <ul className="space-y-2 text-sm">
    <li><a href="/best-smartphones-india" className="text-[#d4220a] hover:underline">Best Smartphones in India</a></li>
    <li><a href="/smartphone-buying-guide-india" className="text-[#d4220a] hover:underline">Smartphone Buying Guide</a></li>
    <li><a href="/phone-comparison-guide-india" className="text-[#d4220a] hover:underline">Phone Comparison Guide</a></li>
  </ul>
</div>

              {/* Tags */}
              {safeTags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-6 pt-4 border-t border-border">
                  {safeTags.map(tag => (
                    <span key={tag} className="font-sans text-xs bg-gray-100 text-muted px-3 py-1 border border-border">
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Pillar Navigation */}
            <div className="mt-8">
              <p className="font-sans text-xs font-bold text-[#d4220a] uppercase tracking-wider mb-3">Browse All Guides</p>
              <PillarNav variant="compact" />
            </div>

            {/* Internal Navigation */}
            <div className="mt-4 p-4 bg-[#f8f4ef] border-l-4 border-[#d4220a]">
              <p className="font-sans text-xs font-bold text-[#d4220a] uppercase tracking-wider mb-3">Explore More</p>
              <div className="flex flex-wrap gap-2">
                <a href="/mobile-news" className="font-sans text-xs text-ink border border-border bg-white px-3 py-1.5 hover:border-[#d4220a] hover:text-[#d4220a] transition-colors">📱 Mobile News</a>
                <a href="/reviews" className="font-sans text-xs text-ink border border-border bg-white px-3 py-1.5 hover:border-[#d4220a] hover:text-[#d4220a] transition-colors">⭐ Reviews</a>
                <a href="/compare" className="font-sans text-xs text-ink border border-border bg-white px-3 py-1.5 hover:border-[#d4220a] hover:text-[#d4220a] transition-colors">⚖️ Compare</a>
                {resolvedBrand && resolvedBrand !== 'Mobile' && <a href={`/mobile-news?brand=${resolvedBrand}`} className="font-sans text-xs text-ink border border-border bg-white px-3 py-1.5 hover:border-[#d4220a] hover:text-[#d4220a] transition-colors">🔍 More {resolvedBrand} News</a>}
              </div>
            </div>

{/* ✅ FINAL AUTHORITY BLOCK */}
<div className="mt-10 border-t pt-6">
  <h2 className="font-playfair text-xl font-bold mb-3">Final Advice</h2>
  <p className="font-sans text-sm text-muted leading-relaxed">
    The best smartphone is not decided by specs alone. Focus on your daily usage, long-term needs, and service availability in your area. A smart choice today ensures better value for years.
  </p>
</div>

            {/* Similar Articles */}
            {similarArticles.length > 0 && (
              <section className="mt-10 pt-6 border-t-2 border-border">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-6 h-0.5 bg-[#d4220a]" />
                  <h2 className="font-playfair text-xl font-bold">You May Also Like</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {similarArticles.map(a => (
                    <ArticleCard key={a.id} article={a} variant="card" />
                  ))}
                </div>
              </section>
            )}

            {/* Reviews Section */}
            <section className="mt-10 pt-6 border-t-2 border-border">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-6 h-0.5 bg-[#1a3a5c]" />
                <h2 className="font-playfair text-xl font-bold">Reader Reviews</h2>
                <span className="font-sans text-xs text-muted ml-2">({safeReviews.length} reviews)</span>
              </div>

              {/* Existing Reviews */}
              {safeReviews.length > 0 ? (
                <div className="space-y-4 mb-8">
                  {safeReviews.map((review: any, i) => (
                    <div key={i} className="bg-white border border-border p-4">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#1a3a5c] text-white font-bold font-sans text-sm flex items-center justify-center flex-shrink-0">
                          {(review.name || '?').charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-1">
                            <span className="font-sans text-sm font-bold text-ink">{review.name}</span>
                            {review.location && (
                              <span className="font-sans text-xs text-muted">{review.location}</span>
                            )}
                            <span className="ml-auto font-sans text-xs text-muted">{review.date}</span>
                          </div>
                          <div className="flex gap-0.5 mb-2">
                            {Array.from({ length: 5 }).map((_, si) => (
                              <svg key={si} className={`w-3.5 h-3.5 ${si < review.rating ? 'text-amber-400' : 'text-gray-200'}`} fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            ))}
                          </div>
                          <p className="font-body text-sm text-[#2a2a2a] leading-relaxed">{review.text}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="font-sans text-sm text-muted mb-6 italic">Be the first to share your experience.</p>
              )}

              {/* Submit Review Form */}
              {!submitted ? (
                <div className="bg-white border border-border p-5">
                  <h3 className="font-sans text-sm font-bold text-ink mb-4">Share Your Experience</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                    <input
                      type="text"
                      placeholder="Your Name *"
                      value={reviewName}
                      onChange={e => setReviewName(e.target.value)}
                      className="font-sans text-sm border border-border px-3 py-2.5 outline-none focus:border-[#1a3a5c] w-full"
                    />
                    <input
                      type="text"
                      placeholder="City (optional)"
                      value={reviewLocation}
                      onChange={e => setReviewLocation(e.target.value)}
                      className="font-sans text-sm border border-border px-3 py-2.5 outline-none focus:border-[#1a3a5c] w-full"
                    />
                  </div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="font-sans text-xs text-muted">Rating:</span>
                    {[1, 2, 3, 4, 5].map(star => (
                      <button key={star} onClick={() => setReviewRating(star)}>
                        <svg className={`w-5 h-5 ${star <= reviewRating ? 'text-amber-400' : 'text-gray-200'}`} fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      </button>
                    ))}
                  </div>
                  <textarea
                    placeholder="Share your thoughts... *"
                    value={reviewText}
                    onChange={e => setReviewText(e.target.value)}
                    rows={3}
                    className="font-sans text-sm border border-border px-3 py-2.5 outline-none focus:border-[#1a3a5c] w-full resize-none mb-3"
                  />
                  <button
                    onClick={handleReviewSubmit}
                    className="bg-[#1a3a5c] hover:bg-[#0f2d4a] text-white font-sans font-semibold px-6 py-2.5 text-sm transition-colors"
                  >
                    Submit Review
                  </button>
                </div>
              ) : (
                <div className="bg-green-50 border border-green-200 p-4 text-center">
                  <p className="font-sans text-sm text-green-700 font-medium">✓ Thank you! Your review has been submitted.</p>
                </div>
              )}
            </section>
          </article>

          {/* Sidebar */}
          <aside className="lg:col-span-1 space-y-6">
            {/* Author Bio */}
            <div className="bg-white border border-border p-5">
              <h3 className="font-sans text-xs font-bold uppercase tracking-widest text-muted mb-3">About the Author</h3>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-full bg-[#d4220a] text-white font-bold font-playfair text-lg flex items-center justify-center">
                  VY
                </div>
                <div>
                  <p className="font-sans text-sm font-bold text-ink">Vijay Yadav</p>
                  <p className="font-sans text-xs text-muted">Senior Mobile Editor · 11 yrs</p>
                </div>
              </div>
              <p className="font-sans text-xs text-muted leading-relaxed">
                Vijay has reviewed 300+ devices and covered the Indian smartphone market for 11 years. Founder of The Tech Bharat, based in New Delhi.
              </p>
              <Link href="/author" className="font-sans text-xs font-semibold text-[#d4220a] mt-2 inline-block hover:underline">
                View Profile →
              </Link>
            </div>

            {/* Similar Articles Sidebar */}
            {similarArticles.slice(0, 4).length > 0 && (
              <div className="bg-white border border-border p-5">
                <h3 className="font-sans text-xs font-bold uppercase tracking-widest text-muted mb-4">Similar Articles</h3>
                <div className="space-y-4">
                  {similarArticles.slice(0, 4).map(a => (
                    <ArticleCard key={a.id} article={a} variant="side" />
                  ))}
                </div>
              </div>
            )}

            {/* CTA */}
            <div className="bg-[#1a3a5c] p-5 text-white">
              <p className="font-playfair text-lg font-bold mb-2">Never Miss a Launch</p>
              <p className="font-sans text-xs opacity-80 mb-3">Get phone news on your channel.</p>
              <div className="space-y-2">
                <a href="https://t.me/the_tech_bharat" target="_blank" rel="noopener noreferrer"
                  className="block bg-[#2AABEE] text-white font-sans text-xs font-semibold text-center py-2 hover:opacity-90">
                  Join Telegram →
                </a>
                <a href="https://whatsapp.com/channel/0029VbCXZfAJJhzh46IrfI2W" target="_blank" rel="noopener noreferrer"
                  className="block bg-[#25D366] text-white font-sans text-xs font-semibold text-center py-2 hover:opacity-90">
                  Join WhatsApp →
                </a>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}