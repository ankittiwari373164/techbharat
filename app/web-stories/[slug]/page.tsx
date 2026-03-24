'use client'
import { useState, useEffect, useCallback } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'

interface StorySlide { id:string; headline:string; body:string; imageUrl:string; ctaText?:string; ctaLink?:string }
interface WebStory { id:string; slug:string; title:string; brand:string; category:string; coverImage:string; slides:StorySlide[]; publishDate:string; isPublished:boolean; tags:string[] }

export default function StoryViewer() {
  const params               = useParams()
  const [story,setStory]     = useState<WebStory|null>(null)
  const [current,setCurrent] = useState(0)
  const [loading,setLoading] = useState(true)
  const [paused,setPaused]   = useState(false)
  const [progressKey,setProgressKey] = useState(0)

  useEffect(()=>{
    fetch(`/api/stories/${params.slug}`)
      .then(r=>r.json())
      .then(d=>{ setStory(d.story||null); setLoading(false) })
      .catch(()=>setLoading(false))
  },[params.slug])

  useEffect(()=>{
    if (!story) return
    const toPreload = [current+1, current+2, current-1]
      .filter(i => i >= 0 && i < story.slides.length)
    toPreload.forEach(i => {
      if (story.slides[i]?.imageUrl) {
        const img = new window.Image()
        img.src = story.slides[i].imageUrl
      }
    })
  },[current, story])

  useEffect(()=>{
    if (!story||paused) return
    const t = setTimeout(()=>{
      if (current < story.slides.length-1) {
        setCurrent(c=>c+1)
        setProgressKey(k=>k+1)
      }
    }, 5000)
    return ()=>clearTimeout(t)
  },[current,story,paused])

  const prev = useCallback(()=>{
    if (current>0) { setCurrent(c=>c-1); setProgressKey(k=>k+1) }
  },[current])

  const next = useCallback(()=>{
    if (story && current<story.slides.length-1) { setCurrent(c=>c+1); setProgressKey(k=>k+1) }
  },[current,story])

  const handleTap = (e: React.MouseEvent) => {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width
    if (x < 0.35) prev()
    else if (x > 0.65) next()
    else setPaused(p=>!p)
  }

  if (loading) return (
    <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin"/>
    </div>
  )

  if (!story) return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col items-center justify-center text-white">
      <p className="text-xl font-bold mb-4">Story not found</p>
      <Link href="/web-stories" className="text-[#d4220a] hover:underline">← Back to stories</Link>
    </div>
  )

  const slide = story.slides[current]

  return (
    <div className="fixed inset-0 bg-black z-50 select-none overflow-hidden" onClick={handleTap} style={{touchAction:'none'}}>
      {/* Background image */}
      {slide.imageUrl ? (
        <img
          key={slide.id}
          src={slide.imageUrl}
          alt={slide.headline}
          className="absolute inset-0 w-full h-full object-cover"
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-[#1a3a5c] to-[#0d0d0d]"/>
      )}

      {/* Dark overlay gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/30 to-black/40 z-5"/>

      {/* Progress bars */}
      <div className="absolute top-4 left-4 right-4 flex gap-1.5 z-20">
        {story.slides.map((_,i)=>(
          <div key={i} className="flex-1 h-1 bg-white/40 rounded-full overflow-hidden">
            <div
              className="h-full bg-white rounded-full"
              style={
                i < current
                  ? { width: '100%' }
                  : i === current
                  ? (!paused
                      ? { width: '0%', animation: 'progress 5s linear forwards' }
                      : { width: 'var(--paused-width, 0%)', animationPlayState: 'paused' })
                  : { width: '0%' }
              }
              key={i === current ? `bar-${progressKey}` : i}
            />
          </div>
        ))}
      </div>

      {/* Header with Brand Logo and Info */}
      <div className="absolute top-6 left-5 right-14 flex items-center gap-3 z-20">
        <div className="w-11 h-11 relative flex-shrink-0">
          <Image
            src="/logo.png"
            alt="Logo"
            fill
            className="object-contain"
            priority
          />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-white text-sm font-bold font-sans truncate">{story.brand}</p>
          <p className="text-white/70 text-xs font-sans truncate">{story.category}</p>
        </div>
      </div>

      {/* Close button */}
      <Link href="/web-stories" onClick={e=>e.stopPropagation()}
        className="absolute top-6 right-5 z-20 w-10 h-10 bg-black/50 rounded-full flex items-center justify-center text-white text-2xl hover:bg-black/70 transition-colors">
        ✕
      </Link>

      {/* Pause indicator */}
      {paused && (
        <div className="absolute inset-0 flex items-center justify-center z-30 pointer-events-none">
          <div className="w-16 h-16 bg-black/60 rounded-full flex items-center justify-center backdrop-blur-sm">
            <span className="text-white text-3xl">⏸</span>
          </div>
        </div>
      )}

      {/* Bottom content - Slide information */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/95 to-transparent pt-20 pb-8 px-6 z-20">
        {slide.headline && (
          <h2 className="font-playfair text-4xl md:text-5xl font-bold text-white leading-tight mb-4">
            {slide.headline}
          </h2>
        )}
        {slide.body && (
          <p className="font-sans text-base md:text-lg text-white/90 leading-relaxed mb-6">
            {slide.body}
          </p>
        )}
        {slide.ctaText && slide.ctaLink && (
          <a href={slide.ctaLink} onClick={e=>e.stopPropagation()}
            className="inline-block bg-[#d4220a] text-white font-sans font-bold text-base md:text-lg px-7 py-3 rounded-full hover:bg-[#b81d09] transition-colors w-fit mb-6">
            {slide.ctaText} →
          </a>
        )}
        <p className="text-white/50 text-xs font-sans font-medium tracking-wide">{current+1} / {story.slides.length}</p>
      </div>

      <style>{`
        @keyframes progress { from { width: 0% } to { width: 100% } }
      `}</style>
    </div>
  )
}