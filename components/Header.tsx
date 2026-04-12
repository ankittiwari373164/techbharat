'use client'
import Link from 'next/link'
import { useState, useEffect, useRef } from 'react'

// ── Main nav items ────────────────────────────────────────────────────────────
const NAV_ITEMS = [
  { label: 'Home',        href: '/' },
  { label: 'Mobile News', href: '/mobile-news' },
  { label: 'Reviews',     href: '/reviews' },
  { label: 'Compare',     href: '/compare' },
  { label: 'Web Stories', href: '/web-stories' },
]

// ── Guides mega-menu (all pillar pages) ───────────────────────────────────────
const GUIDE_SECTIONS = [
  {
    title: 'By Category',
    items: [
      { emoji: '📱', label: 'Best Smartphones India',     href: '/best-smartphones-india' },
      { emoji: '💰', label: 'Best Budget Phones',          href: '/best-budget-phones-india' },
      { emoji: '📸', label: 'Best Camera Phones',          href: '/best-camera-phones-india' },
      { emoji: '🎮', label: 'Best Gaming Phones',          href: '/best-gaming-phones-india' },
      { emoji: '🔋', label: 'Best Battery Phones',         href: '/best-battery-backup-phones-india' },
      { emoji: '5G', label: 'Best 5G Phones',              href: '/best-5g-phones-india' },
      { emoji: '🏆', label: 'Best Flagship Phones',        href: '/best-flagship-phones-india' },
      { emoji: '🎓', label: 'Best Phones for Students',    href: '/best-phones-for-students-india' },
    ],
  },
  {
    title: 'By Brand',
    items: [
      { emoji: '🔷', label: 'Best Samsung Phones',   href: '/best-samsung-phones-india' },
      { emoji: '🍎', label: 'Best iPhones in India', href: '/best-apple-iphone-india' },
      { emoji: '⚡', label: 'Best OnePlus Phones',   href: '/best-oneplus-phones-india' },
      { emoji: '📰', label: 'Samsung News',           href: '/mobile-news?brand=Samsung' },
      { emoji: '📰', label: 'Apple News',             href: '/mobile-news?brand=Apple' },
      { emoji: '📰', label: 'Xiaomi News',            href: '/mobile-news?brand=Xiaomi' },
    ],
  },
  {
    title: 'Buying Guides',
    items: [
      { emoji: '🛒', label: 'Smartphone Buying Guide', href: '/smartphone-buying-guide-india' },
      { emoji: '⚖️', label: 'Phone Comparison Guide',  href: '/phone-comparison-guide-india' },
      { emoji: '🔋', label: 'Android Battery Guide',   href: '/android-battery-health-guide' },
    ],
  },
]

interface HeaderProps {
  tickerItems?: string[]
}

export default function Header({ tickerItems = [] }: HeaderProps) {
  const [mobileOpen, setMobileOpen]   = useState(false)
  const [guidesOpen, setGuidesOpen]   = useState(false)
  const [currentTime, setCurrentTime] = useState('')
  const [tickerText, setTickerText]   = useState(
    tickerItems.length > 0 ? tickerItems.join('  ●  ') : ''
  )
  const guidesRef = useRef<HTMLDivElement>(null)

  // Close guides dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (guidesRef.current && !guidesRef.current.contains(e.target as Node)) {
        setGuidesOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  useEffect(() => {
    const update = () => {
      setCurrentTime(new Date().toLocaleDateString('en-IN', {
        weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
      }))
    }
    update()
    const interval = setInterval(update, 60000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (tickerItems.length > 0) return
    fetch('/api/ticker')
      .then(r => r.json())
      .then(d => { if (d.titles?.length) setTickerText(d.titles.join('  ●  ')) })
      .catch(() => {})
  }, [tickerItems])

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm" style={{ '--header-height': '56px' } as React.CSSProperties}>

      {/* ── Top bar ─────────────────────────────────────────────────────────── */}
      <div className="bg-[#1a3a5c] text-white">
        <div className="max-w-7xl mx-auto px-4 py-1.5 flex justify-between items-center text-xs font-sans">
          <span className="hidden sm:block opacity-70">{currentTime}</span>
          <Link href="/" className="font-playfair text-base font-black tracking-tight">
            The Tech Bharat
          </Link>
          <div className="flex items-center gap-3">
            <a href="https://t.me/the_tech_bharat" target="_blank" rel="noopener noreferrer"
              className="opacity-70 hover:opacity-100 text-[10px] font-semibold">Telegram</a>
            <a href="https://whatsapp.com/channel/0029VbCXZfAJJhzh46IrfI2W" target="_blank" rel="noopener noreferrer"
              className="opacity-70 hover:opacity-100 text-[10px] font-semibold">WhatsApp</a>
          </div>
        </div>
      </div>

      {/* ── Main nav ────────────────────────────────────────────────────────── */}
      <nav className="bg-[#0d0d0d] hidden md:block">
        <div className="max-w-7xl mx-auto px-4 flex overflow-x-auto items-stretch">

          {NAV_ITEMS.map(item => (
            <Link key={item.href} href={item.href}
              className="text-white font-sans text-[13px] font-medium px-4 py-2.5 whitespace-nowrap hover:bg-[#d4220a] transition-colors">
              {item.label}
            </Link>
          ))}

          {/* ── Guides dropdown ──────────────────────────────────────────── */}
          <div ref={guidesRef} className="relative">
            <button
              onClick={() => setGuidesOpen(v => !v)}
              className={`text-white font-sans text-[13px] font-medium px-4 py-2.5 whitespace-nowrap hover:bg-[#d4220a] transition-colors flex items-center gap-1.5 ${guidesOpen ? 'bg-[#d4220a]' : ''}`}
            >
              📚 Guides
              <svg className={`w-3 h-3 transition-transform ${guidesOpen ? 'rotate-180' : ''}`} fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>

            {guidesOpen && (
              <div className="absolute top-full left-0 z-50 bg-white shadow-2xl border border-border min-w-[680px] p-5"
                style={{ maxHeight: '80vh', overflowY: 'auto' }}>
                <div className="grid grid-cols-3 gap-6">
                  {GUIDE_SECTIONS.map(section => (
                    <div key={section.title}>
                      <p className="font-sans text-[10px] font-bold text-muted uppercase tracking-widest mb-3 pb-1 border-b border-border">
                        {section.title}
                      </p>
                      <div className="space-y-0.5">
                        {section.items.map(item => (
                          <Link key={item.href} href={item.href}
                            onClick={() => setGuidesOpen(false)}
                            className="flex items-center gap-2 px-2 py-1.5 rounded hover:bg-[#f8f4ef] group transition-colors">
                            <span className="text-sm w-5 text-center flex-shrink-0">{item.emoji}</span>
                            <span className="font-sans text-xs text-ink group-hover:text-[#d4220a] transition-colors">{item.label}</span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
                {/* Footer CTA */}
                <div className="mt-4 pt-3 border-t border-border flex justify-between items-center">
                  <span className="font-sans text-xs text-muted">All buying guides for Indian smartphone buyers</span>
                  <Link href="/best-smartphones-india" onClick={() => setGuidesOpen(false)}
                    className="font-sans text-xs font-semibold text-[#d4220a] hover:underline">
                    View All Guides →
                  </Link>
                </div>
              </div>
            )}
          </div>

        </div>
      </nav>

      {/* ── Mobile hamburger ────────────────────────────────────────────────── */}
      <div className="md:hidden bg-[#0d0d0d] flex items-center justify-between px-4 py-2">
        <Link href="/" className="text-white font-playfair text-sm font-black">The Tech Bharat</Link>
        <button onClick={() => setMobileOpen(v => !v)} className="text-white p-1">
          {mobileOpen ? (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {mobileOpen && (
        <nav className="md:hidden bg-[#0d0d0d] border-t border-gray-700 max-h-[70vh] overflow-y-auto">
          {NAV_ITEMS.map(item => (
            <Link key={item.href} href={item.href}
              onClick={() => setMobileOpen(false)}
              className="block text-white font-sans text-sm font-medium px-5 py-3 border-b border-gray-800 hover:bg-[#d4220a] transition-colors">
              {item.label}
            </Link>
          ))}
          {/* Mobile guides section */}
          <div className="px-5 py-2 border-b border-gray-700">
            <p className="font-sans text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">📚 Guides</p>
            {GUIDE_SECTIONS.flatMap(s => s.items).map(item => (
              <Link key={item.href} href={item.href}
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-2 text-white font-sans text-sm py-2.5 border-b border-gray-800 hover:text-[#d4220a] transition-colors">
                <span className="text-sm w-5 text-center">{item.emoji}</span>
                {item.label}
              </Link>
            ))}
          </div>
        </nav>
      )}

      {/* ── Breaking news ticker ─────────────────────────────────────────────── */}
      <div className="bg-[#d4220a] text-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 py-1.5 flex items-center gap-3">
          <span className="font-sans text-xs font-bold bg-white text-[#d4220a] px-2.5 py-0.5 flex-shrink-0 uppercase tracking-wide">
            Breaking
          </span>
          <div className="overflow-hidden flex-1">
            <span className="animate-ticker text-xs font-sans">
              {tickerText || 'Stay tuned for the latest mobile tech news from India'}
            </span>
          </div>
        </div>
      </div>

    </header>
  )
}