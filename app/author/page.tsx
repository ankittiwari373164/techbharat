import type { Metadata } from 'next'
import { getAllArticlesAsync } from '@/lib/store'
import ArticleCard from '@/components/ArticleCard'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Vijay Yadav – Senior Mobile Editor | The Tech Bharat',
  description: 'Vijay Yadav is a Senior Mobile Editor at The Tech Bharat with 11 years covering the Indian smartphone market. 300+ device reviews, India-first analysis.',
}

export default async function AuthorPage() {
  const allArticles = await getAllArticlesAsync()
  const recent = allArticles.slice(0, 6)

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="border-b-2 border-[#d4220a] mb-10 pb-4">
        <h1 className="font-playfair text-4xl font-black text-ink mb-2">Our Authors</h1>
        <p className="font-sans text-sm text-muted">Real journalists. Real opinions. No PR fluff.</p>
      </div>

      {/* Single Author Card */}
      <div className="bg-white border border-border p-8 mb-14">
        <div className="flex gap-6 items-start">
          <div className="flex-shrink-0 w-20 h-20 rounded-full bg-[#d4220a] flex items-center justify-center text-white font-playfair text-2xl font-bold">
            VY
          </div>
          <div className="flex-1">
            <div className="flex items-start justify-between gap-4 mb-1">
              <h2 className="font-playfair text-2xl font-bold text-ink">Vijay Yadav</h2>
              <span className="font-sans text-xs text-muted border border-border px-2 py-1">New Delhi</span>
            </div>
            <p className="font-sans text-sm font-semibold text-[#d4220a] mb-3">Senior Mobile Editor & Founder</p>

            {/* E-E-A-T Stats */}
            <div className="flex gap-6 mb-4 p-3 bg-gray-50 border border-border">
              <div className="text-center">
                <p className="font-playfair text-2xl font-black text-ink">11</p>
                <p className="font-sans text-[10px] text-muted uppercase tracking-wide">Years Experience</p>
              </div>
              <div className="text-center">
                <p className="font-playfair text-2xl font-black text-ink">300+</p>
                <p className="font-sans text-[10px] text-muted uppercase tracking-wide">Devices Reviewed</p>
              </div>
              <div className="text-center">
                <p className="font-playfair text-2xl font-black text-ink">500+</p>
                <p className="font-sans text-[10px] text-muted uppercase tracking-wide">Articles Written</p>
              </div>
            </div>

            <p className="font-body text-base text-[#3a3a3a] leading-relaxed mb-4">
              Vijay has been covering the Indian smartphone market for 11 years — starting at a print technology magazine in Mumbai before launching The Tech Bharat. He has tested over 300 devices and has an encyclopaedic knowledge of the Indian mobile market across every price segment.
            </p>
            <p className="font-body text-base text-[#3a3a3a] leading-relaxed mb-4">
              He focuses on what actually matters for Indian buyers: real-world battery in Indian heat, 5G band compatibility on Jio and Airtel, value at every rupee tier, and after-sales service quality. He's direct, occasionally blunt, and allergic to marketing fluff.
            </p>

            <div className="flex flex-wrap gap-2 mb-4">
              {['Flagship Smartphones', 'Samsung & Apple', 'Camera Reviews', '5G India', 'Value Analysis', 'Gadgets & AI'].map(tag => (
                <span key={tag} className="font-sans text-xs bg-gray-100 text-gray-600 px-2 py-1">{tag}</span>
              ))}
            </div>

            <div className="flex items-center gap-4 text-xs font-sans text-muted">
              <span>📍 New Delhi, India</span>
              <span>✉️ vijay@thetechbharat.com</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Articles */}
      {recent.length > 0 && (
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-6 h-0.5 bg-[#d4220a]" />
            <h2 className="font-playfair text-2xl font-bold">Latest by Vijay Yadav</h2>
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