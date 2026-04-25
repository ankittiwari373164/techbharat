// app/error.tsx
'use client'

import { useEffect } from 'react'
import Link from 'next/link'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log error to external service in production
    console.error('[TB Error Boundary]', error.message)
    if (typeof window !== 'undefined' && window.location) {
      const isProduction = process.env.NODE_ENV === 'production'
      if (isProduction) {
        // Send to error tracking service (Sentry, LogRocket, etc.)
        // Example: captureException(error)
      }
    }
  }, [error])

  return (
    <div className="min-h-screen bg-paper flex flex-col items-center justify-center px-4">
      <div className="max-w-2xl text-center">
        <h1 className="font-playfair text-6xl font-black text-ink mb-4">500</h1>
        <p className="font-playfair text-3xl font-bold text-ink mb-3">Something Went Wrong</p>
        <p className="font-body text-lg text-muted mb-8 leading-relaxed">
          We encountered an unexpected error. Our team has been notified and is looking into it.
          Please try again or return home.
        </p>

        {process.env.NODE_ENV === 'development' && (
          <div className="bg-red-50 border border-red-200 p-4 mb-6 text-left rounded">
            <p className="font-sans text-xs font-bold text-red-700 mb-2">Error Details (Development Only):</p>
            <pre className="font-mono text-xs text-red-600 overflow-auto max-h-32">
              {error.message}
              {error.digest && `\nDigest: ${error.digest}`}
            </pre>
          </div>
        )}

        <div className="space-y-4">
          <button
            onClick={() => reset()}
            className="inline-block bg-[#1a3a5c] text-white font-sans font-semibold px-8 py-3 hover:bg-[#0f2d4a] transition-colors"
          >
            Try Again
          </button>

          <br />

          <Link href="/" className="inline-block bg-[#d4220a] text-white font-sans font-semibold px-8 py-3 hover:bg-[#c41a07] transition-colors">
            ← Return Home
          </Link>

          <div className="flex flex-wrap gap-3 justify-center mt-6">
            <Link href="/mobile-news" className="font-sans text-sm text-[#d4220a] border border-[#d4220a] px-4 py-2 hover:bg-[#f8f4ef]">
              📱 News
            </Link>
            <Link href="/reviews" className="font-sans text-sm text-[#d4220a] border border-[#d4220a] px-4 py-2 hover:bg-[#f8f4ef]">
              ⭐ Reviews
            </Link>
            <Link href="/contact" className="font-sans text-sm text-[#d4220a] border border-[#d4220a] px-4 py-2 hover:bg-[#f8f4ef]">
              📧 Contact
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}