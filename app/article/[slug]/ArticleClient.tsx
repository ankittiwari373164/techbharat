'use client'
import { useState } from 'react'
import Link from 'next/link'
import type { Article } from '@/lib/store'
import ArticleCard from '@/components/ArticleCard'

// ── AUTO INTERNAL LINKER ──────────────────────────────────────────
const INTERNAL_LINK_MAP: [RegExp, string, string][] = [
  [/\bSamsung\b/g, '/mobile-news?brand=Samsung', 'Latest Samsung news'],
  [/\b(Apple|iPhone)\b/g, '/mobile-news?brand=Apple', 'Latest Apple iPhone news'],
  [/\bXiaomi\b/g, '/mobile-news?brand=Xiaomi', 'Latest Xiaomi news'],
  [/\bOnePlus\b/g, '/mobile-news?brand=OnePlus', 'Latest OnePlus news'],
  [/\bNothing\b/g, '/mobile-news?brand=Nothing', 'Latest Nothing Phone news'],
  [/\bMotorola\b/g, '/mobile-news?brand=Motorola', 'Latest Motorola news'],
  [/\bRealme\b/g, '/mobile-news?brand=Realme', 'Latest Realme news'],
  [/\bVivo\b/g, '/mobile-news?brand=Vivo', 'Latest Vivo news'],
  [/\bOPPO\b/g, '/mobile-news?brand=OPPO', 'Latest OPPO news'],
  [/\biQOO\b/g, '/mobile-news?brand=iQOO', 'Latest iQOO news'],
  [/\bPoco\b/g, '/mobile-news?brand=Poco', 'Latest Poco news'],
  [/\bRedmi\b/g, '/mobile-news?brand=Xiaomi', 'Latest Xiaomi Redmi news'],
  [/\bGoogle Pixel\b/g, '/mobile-news', 'Latest mobile news'],
  [/\bHonor\b/g, '/mobile-news', 'Latest mobile news'],
  [/\bInfinix\b/g, '/mobile-news', 'Latest mobile news'],
  [/\bTecno\b/g, '/mobile-news', 'Latest mobile news'],
  [/\bLava\b/g, '/mobile-news', 'Latest mobile news'],
  [/\b(action camera|action cam)s?\b/gi, '/mobile-news', 'Latest tech news'],
  [/\b(smartphone|mobile phone|android phone)s?\b/gi, '/mobile-news', 'Latest mobile phone news'],
  [/\b(phone review|hands-on|first look|specs breakdown)s?\b/gi, '/reviews', 'Phone reviews India'],
  [/\b(compare|head-to-head|versus|vs\.)\b/gi, '/compare', 'Compare phones India'],
  [/\b(best phone|best smartphone|top phone|worth buying)s?\b/gi, '/compare', 'Best phones India'],
  [/\b5G (phone|smartphone|band|support|network)s?\b/gi, '/mobile-news', 'Latest 5G phones India'],
  [/\b(budget phone|budget smartphone|affordable phone|mid-range phone)s?\b/gi, '/mobile-news', 'Budget phones India'],
  [/\b(flagship phone|premium smartphone|flagship smartphone)s?\b/gi, '/mobile-news', 'Flagship phones India'],
  [/\b(foldable phone|foldable smartphone)s?\b/gi, '/mobile-news', 'Foldable phones India'],
  [/\b(tablet|smartwatch|TWS earbuds|wireless earbuds|earphones)s?\b/gi, '/mobile-news', 'Latest tech news'],
  [/\b(Flipkart|Amazon India)\b/g, '/mobile-news', 'Best phone deals India'],
  [/\b(Jio|Airtel|Vi Vodafone)\b/g, '/mobile-news', 'Latest 5G news India'],
  [/\b(web stor(?:y|ies))\b/gi, '/web-stories', 'Web Stories'],
]

function addInternalLinks(html: string, _currentSlug: string): string {
  if (!html || typeof html !== 'string') return ''
  const parts = html.split(/(<[^>]+>)/g)
  const linked = new Set<string>()
  let insideAnchor = false

  return parts.map((part) => {
    if (part.startsWith('<a ') || part.startsWith('<a>')) { insideAnchor = true; return part }
    if (part.startsWith('</a>')) { insideAnchor = false; return part }
    if (part.startsWith('<')) return part
    if (insideAnchor) return part

    let text = part
    for (const [regex, url, title] of INTERNAL_LINK_MAP) {
      if (linked.has(url)) continue
      regex.lastIndex = 0
      const newText = text.replace(regex, (match) => {
        if (linked.has(url)) return match
        linked.add(url)
        return `<a href="${url}" title="${title}" class="internal-link">${match}</a>`
      })
      if (newText !== text) text = newText
    }
    return text
  }).join('')
}

interface ArticleClientProps {
  article: Article
  similar: unknown[]
  slug: string
}

export default function ArticleClient({ article, similar, slug }: ArticleClientProps) {
  const [reviewName, setReviewName] = useState('')
  const [reviewText, setReviewText] = useState('')
  const [reviewRating, setReviewRating] = useState(5)
  const [reviewLocation, setReviewLocation] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [liveArticle, setLiveArticle] = useState<Article>(article)

  const similarArticles = similar as Article[]

  // ── Defensive data normalisation (Redis may return nulls) ──────────────
  const safeImages    = Array.isArray(liveArticle.images)                ? liveArticle.images                : []
  const safeBullets   = Array.isArray(liveArticle.bullets)               ? liveArticle.bullets               : []
  const safeTags      = Array.isArray(liveArticle.tags)                  ? liveArticle.tags                  : []
  const safeReviews   = Array.isArray(liveArticle.reviews)               ? liveArticle.reviews               : []
  const safeQSBullets = Array.isArray(liveArticle.quickSummary?.bullets) ? liveArticle.quickSummary!.bullets : []
  const safeQSBrand   = liveArticle.quickSummary?.brand || liveArticle.brand || ''
  const safeQSDate    = liveArticle.quickSummary?.date  || ''

  const pubDate = new Date(liveArticle.publishDate).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit',
  })

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
              <Link href={`/${liveArticle.type}`} className="hover:text-[#d4220a] capitalize">{liveArticle.type === 'review' ? 'Hands-On' : liveArticle.category}</Link>
              <span>/</span>
              <span className="text-ink line-clamp-1">{liveArticle.title}</span>
            </nav>

            {/* Category + Brand */}
            <div className="flex items-center gap-2 mb-3">
              <span className={`${TYPE_COLORS[liveArticle.type]} text-white font-sans text-[10px] font-bold px-2.5 py-1 uppercase tracking-widest`}>
                {liveArticle.category}
              </span>
              <span className="font-sans text-xs font-bold text-[#d4220a] uppercase">{liveArticle.brand}</span>
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
              <span className="font-sans text-xs text-muted">{pubDate}</span>
              <span className="font-sans text-[10px] text-muted">·</span>
              <span className="font-sans text-xs text-muted">{liveArticle.readTime} min read</span>
              {/* Share */}
              <div className="ml-auto flex items-center gap-2">
                <a
                  href={`https://wa.me/?text=${encodeURIComponent(liveArticle.title + ' ' + (process.env.NEXT_PUBLIC_SITE_URL || 'https://thetechbharat.com') + '/' + liveArticle.slug)}`}
                  target="_blank" rel="noopener noreferrer"
                  className="font-sans text-xs bg-[#25D366] text-white px-2.5 py-1 hover:opacity-80"
                >Share</a>
                <a
                  href={`https://t.me/share/url?url=${encodeURIComponent((process.env.NEXT_PUBLIC_SITE_URL || 'https://thetechbharat.com') + '/' + liveArticle.slug)}&text=${encodeURIComponent(liveArticle.title)}`}
                  target="_blank" rel="noopener noreferrer"
                  className="font-sans text-xs bg-[#2AABEE] text-white px-2.5 py-1 hover:opacity-80"
                >Telegram</a>
              </div>
            </div>

            {/* Featured Image */}
            <div className="relative mb-5 overflow-hidden" style={{ paddingBottom: '56.25%' }}>
              <img
                src={liveArticle.featuredImage || 'https://picsum.photos/seed/tb/1200/675'}
                alt={liveArticle.title}
                width={1200}
                height={675}
                style={{position:'absolute',inset:0,width:'100%',height:'100%',objectFit:'cover'}}
                loading="eager"
                fetchPriority="high"
                onError={(e)=>{(e.target as HTMLImageElement).src='https://picsum.photos/seed/tb/1200/675'}}
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
            <p className="font-body text-lg text-[#2a2a2a] leading-relaxed mb-5">{liveArticle.summary}</p>

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

            {/* Full article content — always visible for crawlers, AdSense, and users */}
            <div className="article-body-full">
              {/* Inline image after intro */}
              {safeImages[1] && (
                <div className="relative my-6 overflow-hidden" style={{ paddingBottom: '50%' }}>
                  <img src={safeImages[1]} alt={`${liveArticle.title} — detailed view`} width={800} height={450} style={{position:"absolute",inset:0,width:"100%",height:"100%",objectFit:"cover"}} loading="lazy" onError={(e)=>{(e.target as HTMLImageElement).src="https://picsum.photos/seed/tb2/800/600"}} />
                </div>
              )}

              {/* Full Content — always in HTML, Googlebot + AdSense see everything */}
              <div
                className="article-content"
                dangerouslySetInnerHTML={{ __html: addInternalLinks(liveArticle.content, slug) }}
              />

              {/* Mid-article image */}
              {safeImages[2] && (
                <div className="relative my-6 overflow-hidden" style={{ paddingBottom: '50%' }}>
                  <img src={safeImages[2]} alt={`${liveArticle.title} — additional image`} width={800} height={450} style={{position:"absolute",inset:0,width:"100%",height:"100%",objectFit:"cover"}} loading="lazy" onError={(e)=>{(e.target as HTMLImageElement).src="https://picsum.photos/seed/tb3/800/600"}} />
                </div>
              )}

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

            {/* Internal Navigation Links */}
            <div className="mt-8 p-4 bg-[#f8f4ef] border-l-4 border-[#d4220a]">
              <p className="font-sans text-xs font-bold text-[#d4220a] uppercase tracking-wider mb-3">Explore More on The Tech Bharat</p>
              <div className="flex flex-wrap gap-2">
                <a href="/mobile-news" className="font-sans text-xs text-ink border border-border bg-white px-3 py-1.5 hover:border-[#d4220a] hover:text-[#d4220a] transition-colors">📱 Mobile News</a>
                <a href="/reviews" className="font-sans text-xs text-ink border border-border bg-white px-3 py-1.5 hover:border-[#d4220a] hover:text-[#d4220a] transition-colors">⭐ Phone Reviews</a>
                <a href="/compare" className="font-sans text-xs text-ink border border-border bg-white px-3 py-1.5 hover:border-[#d4220a] hover:text-[#d4220a] transition-colors">⚖️ Compare Phones</a>
                {liveArticle.brand && <a href={`/mobile-news?brand=${liveArticle.brand}`} className="font-sans text-xs text-ink border border-border bg-white px-3 py-1.5 hover:border-[#d4220a] hover:text-[#d4220a] transition-colors">🔍 More {liveArticle.brand} News</a>}
              </div>
            </div>

            {/* Similar Articles Section */}
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
                <p className="font-sans text-sm text-muted mb-6 italic">Be the first to share your experience with this device.</p>
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
                    placeholder="Share your thoughts about this phone / news... *"
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
            {/* About Author */}
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
                View Author Profile →
              </Link>
            </div>

            {/* Similar Articles Sidebar */}
            {similarArticles.slice(0, 4).length > 0 && (
              <div className="bg-white border border-border p-5">
                <h3 className="font-sans text-xs font-bold uppercase tracking-widest text-muted mb-4">You May Also Like</h3>
                <div className="space-y-4">
                  {similarArticles.slice(0, 4).map(a => (
                    <ArticleCard key={a.id} article={a} variant="side" />
                  ))}
                </div>
              </div>
            )}

            {/* Channels CTA */}
            <div className="bg-[#1a3a5c] p-5 text-white">
              <p className="font-playfair text-lg font-bold mb-2">Never Miss a Launch</p>
              <p className="font-sans text-xs opacity-80 mb-3">Get instant phone news on your phone.</p>
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