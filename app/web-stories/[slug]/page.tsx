'use client'
import { useState, useEffect, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'

interface StorySlide { id:string; headline:string; body:string; imageUrl:string; ctaText?:string; ctaLink?:string }
interface WebStory { id:string; slug:string; title:string; brand:string; category:string; coverImage:string; slides:StorySlide[]; publishDate:string; isPublished:boolean; tags:string[] }

export default function StoryViewer() {
  const params             = useParams()
  const router             = useRouter()
  const [story,setStory]   = useState<WebStory|null>(null)
  const [current,setCurrent] = useState(0)
  const [loading,setLoading] = useState(true)
  const [paused,setPaused]   = useState(false)

  useEffect(()=>{
    fetch(`/api/stories/${params.slug}`)
      .then(r=>r.json())
      .then(d=>{ setStory(d.story||null); setLoading(false) })
      .catch(()=>setLoading(false))
  },[params.slug])

  // Auto-advance slides every 5s
  useEffect(()=>{
    if (!story||paused) return
    const t = setTimeout(()=>{
      if (current < story.slides.length-1) setCurrent(c=>c+1)
    }, 5000)
    return ()=>clearTimeout(t)
  },[current,story,paused])

  const prev = useCallback(()=>{ if(current>0) setCurrent(c=>c-1) },[current])
  const next = useCallback(()=>{ if(story && current<story.slides.length-1) setCurrent(c=>c+1) },[current,story])

  const handleTap = (e: React.MouseEvent) => {
    const x = e.clientX / window.innerWidth
    if (x < 0.35) prev()
    else if (x > 0.65) next()
    else setPaused(p=>!p)
  }

  if (loading) return (
    <div className="fixed inset-0 bg-black flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin"/>
    </div>
  )

  if (!story) return (
    <div className="fixed inset-0 bg-black flex flex-col items-center justify-center text-white">
      <p className="text-xl font-bold mb-4">Story not found</p>
      <Link href="/web-stories" className="text-[#d4220a] hover:underline">← Back to stories</Link>
    </div>
  )

  const slide = story.slides[current]

  return (
    <div className="fixed inset-0 bg-black select-none" onClick={handleTap} style={{touchAction:'none'}}>
      {/* Background image */}
      {slide.imageUrl ? (
        <img src={slide.imageUrl} alt={slide.headline} className="absolute inset-0 w-full h-full object-cover"/>
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-[#1a3a5c] to-[#0d0d0d]"/>
      )}

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/15 to-black/40"/>

      {/* Progress bars */}
      <div className="absolute top-3 left-3 right-3 flex gap-1 z-10">
        {story.slides.map((_,i)=>(
          <div key={i} className="flex-1 h-0.5 bg-white/30 rounded-full overflow-hidden">
            <div className={`h-full bg-white rounded-full transition-all duration-300 ${i<current?'w-full':i===current?'w-full':'w-0'}`}
              style={i===current&&!paused?{animation:'progress 5s linear forwards'}:{}}/>
          </div>
        ))}
      </div>

      {/* Header */}
      <div className="absolute top-8 left-3 right-12 flex items-center gap-2 z-10">
        <div className="w-8 h-8 rounded-full bg-white/20 border border-white/50 flex items-center justify-center">
          <span className="text-white text-[9px] font-bold">TB</span>
        </div>
        <div>
          <p className="text-white text-xs font-bold font-sans">{story.brand}</p>
          <p className="text-white/60 text-[10px] font-sans">{story.category}</p>
        </div>
      </div>

      {/* Close button */}
      <Link href="/web-stories" onClick={e=>e.stopPropagation()}
        className="absolute top-8 right-3 z-10 w-8 h-8 bg-black/40 rounded-full flex items-center justify-center text-white text-lg hover:bg-black/60">
        ✕
      </Link>

      {/* Pause indicator */}
      {paused && (
        <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
          <div className="w-16 h-16 bg-black/50 rounded-full flex items-center justify-center">
            <span className="text-white text-2xl">⏸</span>
          </div>
        </div>
      )}

      {/* Slide content */}
      <div className="absolute bottom-0 left-0 right-0 p-6 z-10">
        {slide.headline && (
          <h2 className="font-playfair text-xl font-bold text-white leading-tight mb-2">{slide.headline}</h2>
        )}
        {slide.body && (
          <p className="font-sans text-sm text-white/80 leading-relaxed mb-4">{slide.body}</p>
        )}
        {slide.ctaText && slide.ctaLink && (
          <a href={slide.ctaLink} onClick={e=>e.stopPropagation()}
            className="inline-block bg-[#d4220a] text-white font-sans font-bold text-sm px-5 py-2.5 rounded-full hover:bg-[#b81d09]">
            {slide.ctaText} →
          </a>
        )}
        {/* Slide counter */}
        <p className="text-white/40 text-xs font-sans mt-3">{current+1} / {story.slides.length}</p>
      </div>

      {/* Tap zones hint on first view */}
      <style>{`
        @keyframes progress { from { width: 0% } to { width: 100% } }
      `}</style>
    </div>
  )
}