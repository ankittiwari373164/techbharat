// components/PillarNav.tsx
// NO hooks — pure static nav, safe for server components and RSC
import Link from 'next/link'

const PILLAR_LINKS = [
  { emoji: '📱', label: 'Best Smartphones',  href: '/best-smartphones-india' },
  { emoji: '💰', label: 'Budget Phones',      href: '/best-budget-phones-india' },
  { emoji: '📸', label: 'Camera Phones',      href: '/best-camera-phones-india' },
  { emoji: '🎮', label: 'Gaming Phones',      href: '/best-gaming-phones-india' },
  { emoji: '🔋', label: 'Battery Phones',     href: '/best-battery-backup-phones-india' },
  { emoji: '5G', label: '5G Phones',          href: '/best-5g-phones-india' },
  { emoji: '🏆', label: 'Flagship',           href: '/best-flagship-phones-india' },
  { emoji: '🎓', label: 'Students',           href: '/best-phones-for-students-india' },
  { emoji: '🛒', label: 'Buying Guide',       href: '/smartphone-buying-guide-india' },
  { emoji: '⚖️', label: 'Compare',           href: '/phone-comparison-guide-india' },
  { emoji: '🔷', label: 'Samsung',            href: '/best-samsung-phones-india' },
  { emoji: '🍎', label: 'iPhone',             href: '/best-apple-iphone-india' },
  { emoji: '⚡', label: 'OnePlus',            href: '/best-oneplus-phones-india' },
]

interface PillarNavProps {
  variant?: 'full' | 'compact'
  currentHref?: string  // pass from server to highlight active
}

export default function PillarNav({ variant = 'full', currentHref }: PillarNavProps) {
  if (variant === 'compact') {
    return (
      <nav className="mb-8 -mx-4 px-4 overflow-x-auto">
        <div className="flex gap-2 pb-2 min-w-max">
          {PILLAR_LINKS.map(link => (
            <Link key={link.href} href={link.href}
              className={`flex items-center gap-1.5 px-3 py-1.5 font-sans text-xs font-semibold whitespace-nowrap border transition-colors flex-shrink-0 ${
                currentHref === link.href
                  ? 'bg-[#d4220a] text-white border-[#d4220a]'
                  : 'bg-white text-ink border-border hover:border-[#d4220a] hover:text-[#d4220a]'
              }`}>
              <span className="text-[11px]">{link.emoji}</span>
              <span>{link.label}</span>
            </Link>
          ))}
        </div>
      </nav>
    )
  }

  return (
    <div className="bg-white border-b border-border shadow-sm">
      <div className="max-w-7xl mx-auto px-4">
        <nav className="flex items-center overflow-x-auto -mb-px">
          {PILLAR_LINKS.map(link => (
            <Link key={link.href} href={link.href}
              className={`flex items-center gap-1.5 px-3 py-3 font-sans text-[11px] font-semibold whitespace-nowrap border-b-2 transition-colors flex-shrink-0 ${
                currentHref === link.href
                  ? 'border-[#d4220a] text-[#d4220a]'
                  : 'border-transparent text-muted hover:text-ink hover:border-gray-300'
              }`}>
              <span>{link.emoji}</span>
              <span>{link.label}</span>
            </Link>
          ))}
        </nav>
      </div>
    </div>
  )
}