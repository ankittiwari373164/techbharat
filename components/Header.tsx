'use client'
import Link from 'next/link'
import { useState, useEffect, useRef } from 'react'

const NAV_ITEMS = [
  { label: 'Home', href: '/' },
  { label: 'Mobile News', href: '/mobile-news' },
  { label: 'Reviews', href: '/reviews' },
  { label: 'Compare', href: '/compare' },
  { label: 'Web Stories', href: '/web-stories' },
  { label: 'Samsung', href: '/mobile-news?brand=Samsung' },
  { label: 'Apple', href: '/mobile-news?brand=Apple' },
  { label: 'Xiaomi', href: '/mobile-news?brand=Xiaomi' },
  { label: 'OnePlus', href: '/mobile-news?brand=OnePlus' },
]

const PILLAR_LINKS = [
  { label: 'Best Smartphones',    href: '/best-smartphones-india' },
  { label: 'Budget Phones',       href: '/best-budget-phones-india' },
  { label: 'Camera Phones',       href: '/best-camera-phones-india' },
  { label: 'Gaming Phones',       href: '/best-gaming-phones-india' },
  { label: 'Battery Phones',      href: '/best-battery-backup-phones-india' },
  { label: 'Best 5G Phones',      href: '/best-5g-phones-india' },
  { label: 'Flagship Phones',     href: '/best-flagship-phones-india' },
  { label: 'Student Phones',      href: '/best-phones-for-students-india' },
  { label: 'Best Samsung',        href: '/best-samsung-phones-india' },
  { label: 'Best iPhone',         href: '/best-apple-iphone-india' },
  { label: 'Best OnePlus',        href: '/best-oneplus-phones-india' },
  { label: 'Buying Guide',        href: '/smartphone-buying-guide-india' },
  { label: 'Compare Guide',       href: '/phone-comparison-guide-india' },
]

// tickerItems passed from server layout — Googlebot sees real headlines on first byte
interface HeaderProps {
  tickerItems?: string[]
}

export default function Header({ tickerItems = [] }: HeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [guidesOpen, setGuidesOpen] = useState(false)
  const [currentTime, setCurrentTime] = useState('')
  // Initialise with SSR data immediately — no "Loading latest news..." flash
  const [tickerText, setTickerText] = useState(
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
      setCurrentTime(
        new Date().toLocaleDateString('en-IN', {
          weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
        })
      )
    }
    update()
    const interval = setInterval(update, 60000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    // Only fetch client-side if server didn't provide items
    if (tickerItems.length > 0) return
    fetch('/api/ticker')
      .then(r => r.json())
      .then(d => {
        if (d.titles?.length) {
          setTickerText(d.titles.join('  ●  '))
        }
      })
      .catch(() => {})
  }, [tickerItems])

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      {/* Top Bar */}
      <div className="bg-[#1a3a5c] text-white">
        <div className="max-w-7xl mx-auto px-4 py-1.5 flex justify-between items-center text-xs font-sans">
          <span className="opacity-80">{currentTime}</span>
          <div className="flex items-center gap-4">
            <a href="https://t.me/the_tech_bharat" target="_blank" rel="noopener noreferrer"
              className="opacity-80 hover:opacity-100 flex items-center gap-1">
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.248l-2.04 9.607c-.154.68-.555.846-1.123.527l-3.1-2.285-1.496 1.44c-.165.164-.303.302-.622.302l.222-3.154 5.737-5.182c.25-.221-.054-.344-.386-.123L6.84 14.278l-3.04-.95c-.66-.207-.673-.66.14-.978l11.876-4.578c.549-.2 1.03.134.746.476z"/>
              </svg>
              Telegram
            </a>
            <a href="https://whatsapp.com/channel/0029VbCXZfAJJhzh46IrfI2W" target="_blank" rel="noopener noreferrer"
              className="opacity-80 hover:opacity-100 flex items-center gap-1">
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              WhatsApp
            </a>
            <Link href="/about" className="opacity-80 hover:opacity-100">About</Link>
            <Link href="/contact" className="opacity-80 hover:opacity-100">Contact</Link>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="border-b-4 border-[#d4220a]">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 leading-none">
            <img src="/logo.png" alt="The Tech Bharat" className="h-12 w-12 rounded-full object-cover flex-shrink-0" />
            <div className="flex flex-col">
              <span className="font-playfair text-2xl md:text-3xl font-black text-ink tracking-tight">
                The Tech<span className="text-[#d4220a]"> Bharat</span>
              </span>
              <span className="font-sans text-[10px] uppercase tracking-[3px] text-[#6b6460] mt-0.5">
                India&apos;s Mobile Authority
              </span>
            </div>
          </Link>

          {/* Live Badge */}
          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2 bg-[#d4220a] text-white px-3 py-1.5 text-xs font-sans font-bold rounded-sm tracking-wider">
              <span className="w-2 h-2 bg-white rounded-full pulse-dot" />
              LIVE
            </div>
            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden text-ink"
              aria-label="Toggle menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                {mobileOpen
                  ? <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  : <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                }
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="bg-[#0d0d0d] hidden md:block">
        <div className="max-w-7xl mx-auto px-4 flex overflow-x-auto items-stretch">
          {NAV_ITEMS.map(item => (
            <Link
              key={item.href}
              href={item.href}
              className="text-white font-sans text-[13px] font-medium px-4 py-2.5 whitespace-nowrap hover:bg-[#d4220a] transition-colors"
            >
              {item.label}
            </Link>
          ))}

          {/* Guides dropdown — same style as existing nav items */}
          <div ref={guidesRef} className="relative flex items-stretch">
            <button
              onClick={() => setGuidesOpen(v => !v)}
              className={`text-white font-sans text-[13px] font-medium px-4 py-2.5 whitespace-nowrap hover:bg-[#d4220a] transition-colors flex items-center gap-1 ${guidesOpen ? 'bg-[#d4220a]' : ''}`}
            >
              Guides
              <svg className={`w-3 h-3 transition-transform ${guidesOpen ? 'rotate-180' : ''}`} fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>

            {guidesOpen && (
              <div className="absolute top-full left-0 z-50 bg-[#0d0d0d] border border-gray-700 min-w-[220px] py-1">
                {PILLAR_LINKS.map(link => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setGuidesOpen(false)}
                    className="block text-white font-sans text-[13px] font-medium px-4 py-2 whitespace-nowrap hover:bg-[#d4220a] transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Mobile Nav */}
      {mobileOpen && (
        <nav className="md:hidden bg-[#0d0d0d] border-t border-gray-700">
          {NAV_ITEMS.map(item => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className="block text-white font-sans text-sm font-medium px-5 py-3 border-b border-gray-800 hover:bg-[#d4220a] transition-colors"
            >
              {item.label}
            </Link>
          ))}
          {/* Guides section in mobile nav */}
          <div className="border-b border-gray-700">
            <p className="text-gray-400 font-sans text-[11px] font-bold uppercase tracking-widest px-5 pt-3 pb-1">
              Buying Guides
            </p>
            {PILLAR_LINKS.map(link => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="block text-white font-sans text-sm font-medium px-5 py-2.5 border-b border-gray-800 hover:bg-[#d4220a] transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </nav>
      )}

      {/* Ticker — SSR content on first load, no "Loading latest news..." */}
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