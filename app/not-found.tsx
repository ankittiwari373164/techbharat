// app/not-found.tsx
import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-paper flex flex-col items-center justify-center px-4">
      <div className="max-w-2xl text-center">
        <h1 className="font-playfair text-6xl font-black text-ink mb-4">404</h1>
        <p className="font-playfair text-3xl font-bold text-ink mb-3">Page Not Found</p>
        <p className="font-body text-lg text-muted mb-8 leading-relaxed">
          We couldn't find the page you're looking for. It might have been moved, deleted, or never existed. Let's get you back on track.
        </p>
        
        <div className="space-y-4 mb-8">
          <Link href="/" className="inline-block bg-[#d4220a] text-white font-sans font-semibold px-8 py-3 hover:bg-[#c41a07] transition-colors">
            ← Back to Home
          </Link>
          
          <div className="flex flex-wrap gap-3 justify-center mt-6">
            <Link href="/mobile-news" className="font-sans text-sm text-[#d4220a] border border-[#d4220a] px-4 py-2 hover:bg-[#f8f4ef] transition-colors">
              📱 Latest News
            </Link>
            <Link href="/reviews" className="font-sans text-sm text-[#d4220a] border border-[#d4220a] px-4 py-2 hover:bg-[#f8f4ef] transition-colors">
              ⭐ Reviews
            </Link>
            <Link href="/compare" className="font-sans text-sm text-[#d4220a] border border-[#d4220a] px-4 py-2 hover:bg-[#f8f4ef] transition-colors">
              ⚖️ Compare
            </Link>
          </div>
        </div>

        <div className="bg-white border border-border p-6 rounded">
          <p className="font-sans text-sm text-muted mb-3">Something else on your mind?</p>
          <Link href="/contact" className="font-sans text-sm font-semibold text-[#d4220a] hover:underline">
            Get in touch with us →
          </Link>
        </div>
      </div>
    </div>
  )
}