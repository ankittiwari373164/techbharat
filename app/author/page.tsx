import type { Metadata } from 'next'
import { getAllArticlesAsync } from '@/lib/store'
import ArticleCard from '@/components/ArticleCard'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Our Authors – The Tech Bharat Editorial Team',
  description: 'Meet the journalists and tech writers behind The Tech Bharat — India\'s trusted mobile technology news source.',
}

const AUTHORS = [
  {
    name: 'Vijay Yadav',
    role: 'Senior Mobile Editor',
    initials: 'VY',
    color: '#d4220a',
    bio: 'Vijay has been covering the Indian smartphone market for 11 years, first at a print magazine in Mumbai, now leading mobile coverage at The Tech Bharat in Delhi. He\'s reviewed over 300 devices and has strong opinions on value-for-money flagships.',
    expertise: ['Flagship Smartphones', 'AI', 'Gadgets'],
    location: 'New Delhi',
  },
  // {
  //   name: 'Priya Sharma',
  //   role: 'Budget & Mid-Range Correspondent',
  //   initials: 'PS',
  //   color: '#1a3a5c',
  //   bio: 'Priya focuses on the ₹10,000–₹30,000 segment where most Indian buyers actually shop. Based in Bengaluru, she tests phones in real Indian conditions — crowded metros, heat, dust, and patchy 5G coverage.',
  //   expertise: ['Budget Phones', 'Xiaomi & Realme', '5G Connectivity'],
  //   location: 'Bengaluru',
  // },
  // {
  //   name: 'Rohit Verma',
  //   role: 'Tech News Reporter',
  //   initials: 'RV',
  //   color: '#2a6b3c',
  //   bio: 'Rohit covers breaking news from the smartphone industry — launches, leaks, policy changes and industry trends. Former tech desk reporter at a national daily, he brings journalism rigour to tech coverage.',
  //   expertise: ['Industry News', 'OnePlus & Nothing', 'Leaks & Launches'],
  //   location: 'Mumbai',
  // },
  // {
  //   name: 'Neha Singh',
  //   role: 'Reviews Editor',
  //   initials: 'NS',
  //   color: '#7c3aed',
  //   bio: 'Neha specialises in long-term real-world reviews. She uses devices for 4–6 weeks before writing, focusing on battery life, software updates, and after-sales support — things that matter long after unboxing.',
  //   expertise: ['Long-term Reviews', 'Software & Updates', 'Vivo & OPPO'],
  //   location: 'Hyderabad',
  // },
  // {
  //   name: 'Karan Gupta',
  //   role: 'Comparisons & Value Analyst',
  //   initials: 'KG',
  //   color: '#b45309',
  //   bio: 'Karan is obsessed with value. He runs head-to-head comparisons to help buyers decide between similarly priced phones. His "Should you buy this?" verdicts have become a reader favourite.',
  //   expertise: ['Phone Comparisons', 'Value Analysis', 'Gaming Phones'],
  //   location: 'Pune',
  // },
]

export default async function AuthorPage() {
  const allArticles = await getAllArticlesAsync()
  const recent = allArticles.slice(0, 6)

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="border-b-2 border-[#d4220a] mb-10 pb-4">
        <h1 className="font-playfair text-4xl font-black text-ink mb-2">Our Authors</h1>
        <p className="font-sans text-sm text-muted">Real journalists. Real opinions. No PR fluff.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-14">
        {AUTHORS.map(author => (
          <div key={author.name} className="bg-white border border-border p-6 flex gap-4">
            <div className="flex-shrink-0 w-14 h-14 rounded-full flex items-center justify-center text-white font-playfair text-xl font-bold" style={{ background: author.color }}>
              {author.initials}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2 mb-0.5">
                <h2 className="font-playfair text-lg font-bold text-ink">{author.name}</h2>
                <span className="font-sans text-[10px] text-muted border border-border px-2 py-0.5 whitespace-nowrap">{author.location}</span>
              </div>
              <p className="font-sans text-xs font-semibold mb-2" style={{ color: author.color }}>{author.role}</p>
              <p className="font-body text-sm text-[#3a3a3a] leading-relaxed mb-3">{author.bio}</p>
              <div className="flex flex-wrap gap-1.5">
                {author.expertise.map(e => (
                  <span key={e} className="font-sans text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded-sm">{e}</span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {recent.length > 0 && (
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-6 h-0.5 bg-[#d4220a]" />
            <h2 className="font-playfair text-2xl font-bold">Recent Articles</h2>
            <div className="flex-1 h-px bg-border" />
            <Link href="/mobile-news" className="font-sans text-xs font-semibold text-[#d4220a]">View All →</Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {recent.map(article => (
              <ArticleCard key={article.id} article={article} variant="card" />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}