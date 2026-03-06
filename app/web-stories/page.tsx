import { getPublishedStoriesAsync } from '@/lib/stories-store'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Web Stories – Mobile Tech Stories India',
  description: 'Tap through visual web stories about the latest mobile technology, phone launches, and smartphone news.',
}

export const revalidate = 60

export default async function WebStoriesPage() {
  const stories = await getPublishedStoriesAsync()

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="border-b-2 border-[#d4220a] mb-8 pb-4">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-8 h-8 bg-[#d4220a] flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"/>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
          </div>
          <h1 className="font-playfair text-3xl font-bold text-ink">Web Stories</h1>
        </div>
        <p className="font-sans text-sm text-muted">Tap through visual stories about the latest mobile tech</p>
      </div>

      {stories.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-6xl mb-4">📖</p>
          <p className="font-playfair text-2xl font-bold mb-3">Stories Coming Soon</p>
          <p className="font-sans text-muted">Check back soon for visual stories about the latest phones.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          {stories.map(story => (
            <Link key={story.id} href={`/web-stories/${story.slug}`}
              className="group block relative overflow-hidden rounded-xl shadow-md hover:shadow-xl transition-all cursor-pointer"
              style={{ paddingBottom: '177%' }}>
              {story.coverImage ? (
                <img src={story.coverImage} alt={story.title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"/>
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-[#1a3a5c] to-[#0d0d0d] flex items-center justify-center">
                  <span className="text-4xl">📱</span>
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"/>
              <div className="absolute top-3 left-3 right-3 flex gap-1">
                {story.slides.slice(0,5).map((_,i) => <div key={i} className={`flex-1 h-0.5 rounded-full ${i===0?'bg-white':'bg-white/40'}`}/>)}
              </div>
              <div className="absolute top-7 left-3 flex items-center gap-1.5">
                <div className="w-6 h-6 rounded-full bg-white/20 border border-white/50 flex items-center justify-center">
                  <span className="text-white text-[7px] font-bold leading-none">TB</span>
                </div>
                <span className="text-white text-[10px] font-semibold font-sans">{story.brand}</span>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-3">
                <span className="font-sans text-[8px] font-bold text-[#d4220a] uppercase tracking-wider bg-black/40 px-1.5 py-0.5">{story.category}</span>
                <p className="font-sans text-xs font-bold text-white mt-1.5 leading-tight line-clamp-3">{story.title}</p>
                <p className="text-white/60 text-[9px] font-sans mt-1">{story.slides.length} slides · Tap to view</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}