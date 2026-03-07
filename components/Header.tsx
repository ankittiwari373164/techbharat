'use client'
import Link from 'next/link'
import { useState, useEffect } from 'react'

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

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [currentTime, setCurrentTime] = useState('')
  const [tickerText, setTickerText] = useState('Loading latest news...')

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
    // Fetch latest article titles for ticker
    fetch('/api/ticker')
      .then(r => r.json())
      .then(d => {
        if (d.titles?.length) {
          setTickerText(d.titles.join('  ●  '))
        }
      })
      .catch(() => {})
  }, [])

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      {/* Top Bar */}
      <div className="bg-[#1a3a5c] text-white">
        <div className="max-w-7xl mx-auto px-4 py-1.5 flex justify-between items-center text-xs font-sans">
          <span className="opacity-80">{currentTime}</span>
          <div className="flex items-center gap-4">
            <a href="https://t.me/techbharat" target="_blank" rel="noopener noreferrer"
              className="opacity-80 hover:opacity-100 flex items-center gap-1">
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.248l-2.04 9.607c-.154.68-.555.846-1.123.527l-3.1-2.285-1.496 1.44c-.165.164-.303.302-.622.302l.222-3.154 5.737-5.182c.25-.221-.054-.344-.386-.123L6.84 14.278l-3.04-.95c-.66-.207-.673-.66.14-.978l11.876-4.578c.549-.2 1.03.134.746.476z"/>
              </svg>
              Telegram
            </a>
            <a href="https://whatsapp.com/channel/techbharat" target="_blank" rel="noopener noreferrer"
              className="opacity-80 hover:opacity-100 flex items-center gap-1">
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              WhatsApp
            </a>
            <Link href="/about" className="opacity-80 hover:opacity-100">About</Link>
            <Link href="/contact" className="opacity-80 hover:opacity-100">Contact</Link>
            <Link href="/admin" className="opacity-80 hover:opacity-100 border border-white/30 px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase">⚙ Admin</Link>
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
                India's Mobile Authority
              </span>
            </div>
          </Link>

          {/* Live Badge + Fetch Button */}
          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2 bg-[#d4220a] text-white px-3 py-1.5 text-xs font-sans font-bold rounded-sm tracking-wider">
              <span className="w-2 h-2 bg-white rounded-full pulse-dot" />
              LIVE
            </div>
            <button
              onClick={() => {
                if (typeof window !== 'undefined') {
                  window.location.href = '/api/fetch-news'
                }
              }}
              className="hidden md:block bg-[#1a3a5c] hover:bg-[#0f2d4a] text-white px-4 py-2 text-xs font-sans font-semibold rounded transition-colors"
            >
              Fetch Latest News
            </button>
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
        <div className="max-w-7xl mx-auto px-4 flex overflow-x-auto">
          {NAV_ITEMS.map(item => (
            <Link
              key={item.href}
              href={item.href}
              className="text-white font-sans text-[13px] font-medium px-4 py-2.5 whitespace-nowrap hover:bg-[#d4220a] transition-colors"
            >
              {item.label}
            </Link>
          ))}
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
          <button
            onClick={() => { window.location.href = '/api/fetch-news'; setMobileOpen(false) }}
            className="w-full text-left text-[#d4220a] font-sans text-sm font-semibold px-5 py-3"
          >
            🔄 Fetch Latest News
          </button>
        </nav>
      )}

      {/* Ticker */}
      <div className="bg-[#d4220a] text-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 py-1.5 flex items-center gap-3">
          <span className="font-sans text-xs font-bold bg-white text-[#d4220a] px-2.5 py-0.5 flex-shrink-0 uppercase tracking-wide">
            Breaking
          </span>
          <div className="overflow-hidden flex-1">
            <span className="animate-ticker text-xs font-sans">{tickerText}</span>
          </div>
        </div>
      </div>
    </header>
  )
}