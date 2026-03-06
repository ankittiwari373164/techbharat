import Link from 'next/link'

const BRANDS = ['Samsung', 'Apple', 'Xiaomi', 'OnePlus', 'Realme', 'Vivo', 'OPPO', 'iQOO', 'Poco', 'Motorola', 'Nothing', 'Google Pixel']

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="bg-[#0d0d0d] text-white mt-16">
      {/* Brand Quick Links */}
      <div className="border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <p className="font-sans text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">
            Browse by Brand
          </p>
          <div className="flex flex-wrap gap-2">
            {BRANDS.map(brand => (
              <Link
                key={brand}
                href={`/mobile-news?brand=${brand}`}
                className="font-sans text-xs text-gray-300 hover:text-white border border-gray-700 hover:border-[#d4220a] px-3 py-1.5 transition-colors"
              >
                {brand}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <Link href="/" className="font-playfair text-3xl font-black text-white tracking-tight">
              Tech<span className="text-[#d4220a]">Bharat</span>
            </Link>
            <p className="font-sans text-xs text-gray-400 mt-3 leading-relaxed">
              India's most trusted source for mobile technology news, smartphone reviews, and expert analysis.
            </p>
            <div className="flex gap-3 mt-4">
              <a href="https://t.me/techbharat" target="_blank" rel="noopener noreferrer"
                className="w-8 h-8 bg-gray-800 hover:bg-[#d4220a] flex items-center justify-center transition-colors text-xs font-sans font-bold">
                TG
              </a>
              <a href="https://whatsapp.com/channel/techbharat" target="_blank" rel="noopener noreferrer"
                className="w-8 h-8 bg-gray-800 hover:bg-[#d4220a] flex items-center justify-center transition-colors text-xs font-sans font-bold">
                WA
              </a>
              <a href="https://linkedin.com/company/techbharat" target="_blank" rel="noopener noreferrer"
                className="w-8 h-8 bg-gray-800 hover:bg-[#d4220a] flex items-center justify-center transition-colors text-xs font-sans font-bold">
                LI
              </a>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-sans text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Categories</h4>
            <ul className="space-y-2">
              {[
                { label: 'Mobile News', href: '/mobile-news' },
                { label: 'Reviews', href: '/reviews' },
                { label: 'Compare', href: '/compare' },
                { label: 'Web Stories', href: '/web-stories' },
              ].map(item => (
                <li key={item.href}>
                  <Link href={item.href} className="font-sans text-sm text-gray-300 hover:text-white hover:text-[#d4220a] transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-sans text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Company</h4>
            <ul className="space-y-2">
              {[
                { label: 'About Us', href: '/about' },
                { label: 'Contact Us', href: '/contact' },
                { label: 'Author', href: '/author' },
                { label: 'Editorial Policy', href: '/editorial-policy' },
                { label: 'Corrections Policy', href: '/corrections-policy' },
              ].map(item => (
                <li key={item.href}>
                  <Link href={item.href} className="font-sans text-sm text-gray-300 hover:text-[#d4220a] transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-sans text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Legal</h4>
            <ul className="space-y-2">
              {[
                { label: 'Privacy Policy', href: '/privacy-policy' },
                { label: 'Disclaimer', href: '/disclaimer' },
                { label: 'Terms & Conditions', href: '/terms' },
                { label: 'Sitemap', href: '/sitemap.xml' },
              ].map(item => (
                <li key={item.href}>
                  <Link href={item.href} className="font-sans text-sm text-gray-300 hover:text-[#d4220a] transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col md:flex-row justify-between items-center gap-2">
          <p className="font-sans text-xs text-gray-500">
            © {year} TechBharat. All rights reserved. India's Mobile Technology Authority.
          </p>
          <p className="font-sans text-xs text-gray-600">
            Content is original and independently produced. Not affiliated with any phone brand.
          </p>
        </div>
      </div>
    </footer>
  )
}
