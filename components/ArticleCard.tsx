'use client'
import Link from 'next/link'

import { useState } from 'react'
import type { Article } from '@/lib/store'

interface Props {
  article: Article
  variant?: 'hero' | 'featured' | 'card' | 'list' | 'side'
}

const TYPE_LABELS: Record<string, { label: string; color: string }> = {
  'mobile-news': { label: 'Mobile News', color: 'bg-[#1a3a5c]' },
  'review': { label: 'Review', color: 'bg-[#d4220a]' },
  'compare': { label: 'Compare', color: 'bg-[#2a6b3c]' },
}

export default function ArticleCard({ article, variant = 'card' }: Props) {
  const [expanded, setExpanded] = useState(false)
  const typeInfo = TYPE_LABELS[article.type] || TYPE_LABELS['mobile-news']
  const pubDate = new Date(article.publishDate).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric',
  })

  if (variant === 'hero') {
    return (
      <div className="relative group cursor-pointer">
        <Link href={`/article/${article.slug}`} className="block">
          <div className="relative overflow-hidden" style={{ paddingBottom: '56.25%' }}>
            <img src={article.featuredImage || "https://picsum.photos/seed/tb/1200/675"} style={{position:"absolute",inset:0,width:"100%",height:"100%"}} onError={(e)=>{(e.target as HTMLImageElement).src="https://picsum.photos/seed/tb/1200/675"}}
              alt={article.title}
              className="object-cover group-hover:scale-105 transition-transform duration-500"
             loading="lazy" />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
            <span className={`${typeInfo.color} text-white font-sans text-[10px] font-bold px-2.5 py-1 uppercase tracking-widest mr-2`}>
              {typeInfo.label}
            </span>
            <span className="font-sans text-[10px] text-white/60 uppercase tracking-widest">
              {article.brand}
            </span>
            <h2 className="font-playfair text-2xl md:text-3xl font-bold text-white mt-3 leading-tight">
              {article.title}
            </h2>
            <div className="flex items-center gap-3 mt-3">
              <span className="font-sans text-xs text-white/60">{pubDate}</span>
              <span className="font-sans text-xs text-white/60">·</span>
              <span className="font-sans text-xs text-white/60">{article.readTime} min read</span>
            </div>
          </div>
        </Link>
      </div>
    )
  }

  if (variant === 'side') {
    return (
      <Link href={`/article/${article.slug}`} className="flex gap-3 group">
        <div className="flex-shrink-0 w-24 h-16 relative overflow-hidden">
          <img src={article.featuredImage || "https://picsum.photos/seed/tb/1200/675"} style={{position:"absolute",inset:0,width:"100%",height:"100%"}} onError={(e)=>{(e.target as HTMLImageElement).src="https://picsum.photos/seed/tb/1200/675"}}
            alt={article.title}
            className="object-cover group-hover:scale-105 transition-transform duration-300"
           loading="lazy" />
        </div>
        <div className="flex-1 min-w-0">
          <span className={`${typeInfo.color} text-white font-sans text-[9px] font-bold px-1.5 py-0.5 uppercase tracking-wider`}>
            {article.brand}
          </span>
          <h4 className="font-sans text-xs font-semibold text-ink leading-snug mt-1 line-clamp-2 group-hover:text-[#d4220a] transition-colors">
            {article.title}
          </h4>
          <span className="font-sans text-[10px] text-muted">{pubDate}</span>
        </div>
      </Link>
    )
  }

  if (variant === 'list') {
    return (
      <div className="border-b border-border py-5 animate-fade-in-up">
        {/* Quick Summary - collapsible */}
        <div className="flex gap-4">
          <div className="flex-shrink-0 w-36 h-24 relative overflow-hidden">
            <Link href={`/article/${article.slug}`}>
              <img src={article.featuredImage || "https://picsum.photos/seed/tb/1200/675"} style={{position:"absolute",inset:0,width:"100%",height:"100%"}} onError={(e)=>{(e.target as HTMLImageElement).src="https://picsum.photos/seed/tb/1200/675"}}
                alt={article.title}
                className="object-cover hover:scale-105 transition-transform duration-300"
               loading="lazy" />
            </Link>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1.5">
              <span className={`${typeInfo.color} text-white font-sans text-[9px] font-bold px-2 py-0.5 uppercase tracking-wider`}>
                {typeInfo.label}
              </span>
              <span className="font-sans text-[10px] font-semibold text-[#d4220a]">{article.brand}</span>
              <span className="font-sans text-[10px] text-muted ml-auto">{pubDate}</span>
            </div>
            <Link href={`/article/${article.slug}`}>
              <h3 className="font-playfair text-base md:text-lg font-bold text-ink leading-snug hover:text-[#d4220a] transition-colors line-clamp-2">
                {article.title}
              </h3>
            </Link>
            <p className="font-sans text-sm text-muted mt-1 line-clamp-2">{article.summary}</p>
          </div>
        </div>

        {/* Quick Summary dropdown */}
        <details className="mt-3 group">
          <summary className="font-sans text-xs font-semibold text-[#1a3a5c] cursor-pointer flex items-center gap-1.5 list-none hover:text-[#d4220a] transition-colors w-fit">
            <span className="w-4 h-4 border border-current rounded-full flex items-center justify-center text-[8px] group-open:rotate-90 transition-transform">▶</span>
            Quick Summary
          </summary>
          <div className="mt-2 bg-gray-50 border border-border p-3 rounded">
            <div className="grid grid-cols-2 gap-1 mb-2 font-sans text-xs text-muted">
              <span><strong className="text-ink">Brand:</strong> {article.quickSummary.brand}</span>
              <span><strong className="text-ink">Date:</strong> {article.quickSummary.date}</span>
            </div>
            <ul className="space-y-1">
              {article.quickSummary.bullets.map((b, i) => (
                <li key={i} className="font-sans text-xs text-ink flex items-start gap-1.5">
                  <span className="text-[#d4220a] mt-0.5 flex-shrink-0">●</span>
                  {b}
                </li>
              ))}
            </ul>
          </div>
        </details>

        {/* Read More link */}
        <Link
          href={`/article/${article.slug}`}
          className="inline-block mt-2 font-sans text-xs font-semibold text-[#d4220a] hover:underline"
        >
          Read More →
        </Link>
      </div>
    )
  }

  // Default: card
  return (
    <div className="bg-white border border-border hover:border-[#d4220a] transition-colors group animate-fade-in-up">
      <Link href={`/article/${article.slug}`} className="block relative overflow-hidden" style={{ paddingBottom: '60%' }}>
        <img src={article.featuredImage || "https://picsum.photos/seed/tb/1200/675"} style={{position:"absolute",inset:0,width:"100%",height:"100%"}} onError={(e)=>{(e.target as HTMLImageElement).src="https://picsum.photos/seed/tb/1200/675"}}
          alt={article.title}
          className="object-cover group-hover:scale-105 transition-transform duration-500"
         loading="lazy" />
        <span className={`absolute top-3 left-3 ${typeInfo.color} text-white font-sans text-[9px] font-bold px-2 py-1 uppercase tracking-wider z-10`}>
          {typeInfo.label}
        </span>
      </Link>
      <div className="p-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="font-sans text-[10px] font-bold text-[#d4220a] uppercase tracking-wide">{article.brand}</span>
          <span className="font-sans text-[10px] text-muted ml-auto">{pubDate}</span>
        </div>
        <Link href={`/article/${article.slug}`}>
          <h3 className="font-playfair text-base font-bold text-ink leading-snug group-hover:text-[#d4220a] transition-colors line-clamp-2">
            {article.title}
          </h3>
        </Link>
        <p className="font-sans text-xs text-muted mt-2 line-clamp-2">{article.summary}</p>

        {/* Bullet highlights */}
        <ul className="mt-3 space-y-1">
          {article.bullets.slice(0, 3).map((b, i) => (
            <li key={i} className="font-sans text-xs text-ink flex items-start gap-1.5">
              <span className="text-[#d4220a] flex-shrink-0 mt-0.5">●</span>
              <span className="line-clamp-1">{b}</span>
            </li>
          ))}
        </ul>

        <div className="mt-3 flex items-center justify-between">
          <span className="font-sans text-[10px] text-muted">{article.readTime} min read</span>
          <Link
            href={`/article/${article.slug}`}
            className="font-sans text-xs font-semibold text-[#d4220a] hover:underline"
          >
            Read More →
          </Link>
        </div>
      </div>
    </div>
  )
}