'use client'
// components/CookieConsent.tsx
// GDPR/DPDP compliant cookie consent banner for AdSense approval
import { useState, useEffect } from 'react'

export default function CookieConsent() {
  const [show, setShow] = useState(false)
  const [showDetails, setShowDetails] = useState(false)

  useEffect(() => {
    // Show banner if consent not yet given
    try {
      const consent = localStorage.getItem('ttb_cookie_consent')
      if (!consent) setShow(true)
    } catch { setShow(true) }
  }, [])

  const accept = (all: boolean) => {
    try {
      localStorage.setItem('ttb_cookie_consent', all ? 'all' : 'essential')
      localStorage.setItem('ttb_consent_date', new Date().toISOString())
    } catch {}
    setShow(false)

    // Signal to AdSense/GA if full consent given
    if (all && typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('consent', 'update', {
        ad_storage: 'granted',
        analytics_storage: 'granted',
      })
    }
  }

  if (!show) return null

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-[9999] bg-[#0d0d0d] text-white shadow-2xl"
      style={{ borderTop: '3px solid #d4220a' }}
      role="dialog"
      aria-label="Cookie consent"
    >
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex flex-col md:flex-row md:items-center gap-4">

          {/* Text */}
          <div className="flex-1 min-w-0">
            <p className="font-sans text-sm text-white leading-relaxed">
              <strong className="text-[#d4220a]">The Tech Bharat</strong> uses cookies and similar technologies for analytics, personalised ads (Google AdSense/DART), and to improve your experience.
              By clicking <strong>"Accept All"</strong> you consent to our use of cookies as described in our{' '}
              <a href="/privacy-policy" className="text-[#d4220a] hover:underline underline-offset-2">Privacy Policy</a>.
            </p>

            {showDetails && (
              <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-3 text-xs text-gray-300">
                {[
                  { name: 'Essential', desc: 'Required for the site to work. Cannot be disabled.', locked: true },
                  { name: 'Analytics (GA4)', desc: 'Google Analytics — helps us understand how readers use the site.', locked: false },
                  { name: 'Advertising (AdSense)', desc: 'Google AdSense/DART cookies for personalised ads. Helps keep the site free.', locked: false },
                ].map(({ name, desc, locked }) => (
                  <div key={name} className="bg-white/5 rounded-lg p-3 border border-white/10">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-white">{name}</span>
                      {locked ? (
                        <span className="text-[10px] bg-gray-600 px-2 py-0.5 rounded font-sans">Always On</span>
                      ) : (
                        <span className="text-[10px] bg-[#d4220a] px-2 py-0.5 rounded font-sans">Optional</span>
                      )}
                    </div>
                    <p className="text-gray-400 text-[11px] leading-relaxed">{desc}</p>
                  </div>
                ))}
              </div>
            )}

            <button
              onClick={() => setShowDetails(d => !d)}
              className="mt-2 text-xs text-gray-400 hover:text-white underline font-sans"
            >
              {showDetails ? 'Hide details ↑' : 'Show cookie details ↓'}
            </button>
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-2 flex-shrink-0">
            <button
              onClick={() => accept(false)}
              className="font-sans text-xs font-semibold px-4 py-2.5 border border-gray-600 text-gray-300 hover:border-gray-400 hover:text-white transition-colors rounded"
            >
              Essential Only
            </button>
            <button
              onClick={() => accept(true)}
              className="font-sans text-sm font-bold px-6 py-2.5 bg-[#d4220a] hover:bg-[#b81d09] text-white transition-colors rounded"
            >
              Accept All Cookies
            </button>
          </div>
        </div>

        {/* DPDP India notice */}
        <p className="font-sans text-[10px] text-gray-500 mt-2">
          In accordance with India's Digital Personal Data Protection Act (DPDP) 2023 and GDPR. You can change your preferences anytime in our{' '}
          <a href="/privacy-policy" className="hover:text-gray-400 underline">Privacy Policy</a>.
        </p>
      </div>
    </div>
  )
}