import type { Metadata } from 'next'
import { getAllArticles } from '@/lib/store'
import ArticleCard from '@/components/ArticleCard'

export const metadata: Metadata = {
  title: 'Author – TechBharat Editorial Team',
  description: 'Meet the TechBharat editorial team – experienced mobile technology journalists covering the Indian smartphone market.',
}

export default function AuthorPage() {
  const articles = getAllArticles().slice(0, 6)

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="border-b-2 border-[#d4220a] mb-8 pb-4">
        <h1 className="font-playfair text-4xl font-black text-ink mb-2">Our Authors</h1>
        <p className="font-sans text-sm text-muted">The people behind TechBharat's journalism</p>
      </div>

      {/* Main Author Card */}
      <div className="bg-white border border-border p-8 mb-8">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-shrink-0">
            <div className="w-24 h-24 rounded-full bg-[#1a3a5c] text-white font-playfair text-4xl font-bold flex items-center justify-center">
              TB
            </div>
          </div>
          <div className="flex-1">
            <h2 className="font-playfair text-2xl font-bold text-ink mb-1">TechBharat Editorial Team</h2>
            <p className="font-sans text-sm text-[#d4220a] font-semibold mb-3">Senior Mobile Technology Journalists</p>
            <p className="font-body text-base text-[#2a2a2a] leading-relaxed mb-4">
              The TechBharat Editorial Team comprises experienced technology journalists and mobile enthusiasts dedicated to covering the Indian smartphone market. With a combined experience of over a decade in tech journalism, our team provides independent, accurate, and deeply researched coverage of everything from budget devices to flagship smartphones.
            </p>
            <p className="font-body text-base text-[#2a2a2a] leading-relaxed mb-4">
              Our journalists have hands-on experience reviewing hundreds of devices across all price segments, giving us unique insight into what genuinely matters to Indian consumers — from network compatibility and camera performance in Indian lighting conditions, to after-sales service reliability and software support timelines.
            </p>
            <div className="flex flex-wrap gap-4 text-sm">
              <div className="font-sans">
                <span className="text-muted text-xs uppercase tracking-wider block mb-0.5">Speciality</span>
                <span className="font-semibold text-ink">Smartphones & Mobile Technology</span>
              </div>
              <div className="font-sans">
                <span className="text-muted text-xs uppercase tracking-wider block mb-0.5">Market</span>
                <span className="font-semibold text-ink">India</span>
              </div>
              <div className="font-sans">
                <span className="text-muted text-xs uppercase tracking-wider block mb-0.5">Language</span>
                <span className="font-semibold text-ink">English</span>
              </div>
            </div>

            <div className="flex gap-3 mt-4">
              <a href="https://linkedin.com/company/techbharat" target="_blank" rel="noopener noreferrer"
                className="font-sans text-xs font-semibold bg-[#0077B5] text-white px-3 py-1.5 hover:opacity-90">
                LinkedIn
              </a>
              <a href="https://t.me/techbharat" target="_blank" rel="noopener noreferrer"
                className="font-sans text-xs font-semibold bg-[#2AABEE] text-white px-3 py-1.5 hover:opacity-90">
                Telegram
              </a>
              <a href="mailto:editorial@techbharat.com"
                className="font-sans text-xs font-semibold bg-[#d4220a] text-white px-3 py-1.5 hover:opacity-90">
                Email
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-10">
        {[
          { stat: '100+', label: 'Articles Published' },
          { stat: '50K+', label: 'Monthly Readers' },
          { stat: '10+', label: 'Years Experience' },
        ].map(item => (
          <div key={item.stat} className="text-center bg-[#1a3a5c]/5 border border-border p-5">
            <p className="font-playfair text-3xl font-black text-[#d4220a]">{item.stat}</p>
            <p className="font-sans text-xs text-muted mt-1 uppercase tracking-wider">{item.label}</p>
          </div>
        ))}
      </div>

      {/* Recent Articles */}
      {articles.length > 0 && (
        <section>
          <div className="flex items-center gap-3 mb-5">
            <div className="w-6 h-0.5 bg-[#d4220a]" />
            <h2 className="font-playfair text-xl font-bold">Recent Articles</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {articles.map(article => (
              <ArticleCard key={article.id} article={article} variant="card" />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
