// components/PillarNav.tsx
// ─────────────────────────────────────────────────────────────────────────────
// Sticky subheader bar shown on all pillar pages.
// Lists all pillar categories so users can jump between guides.
// Also used inside articles as a "Related Guides" strip.
// ─────────────────────────────────────────────────────────────────────────────
'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface PillarLink {
  label: string
  href:  string
  emoji: string
}

const PILLAR_LINKS: PillarLink[] = [
  { emoji: '📱', label: 'Best Smartphones',   href: '/best-smartphones-india' },
  { emoji: '💰', label: 'Budget Phones',       href: '/best-budget-phones-india' },
  { emoji: '📸', label: 'Camera Phones',       href: '/best-camera-phones-india' },
  { emoji: '🎮', label: 'Gaming Phones',       href: '/best-gaming-phones-india' },
  { emoji: '🔋', label: 'Battery Phones',      href: '/best-battery-backup-phones-india' },
  { emoji: '5G', label: '5G Phones',           href: '/best-5g-phones-india' },
  { emoji: '🏆', label: 'Flagship Phones',     href: '/best-flagship-phones-india' },
  { emoji: '🎓', label: 'Student Phones',      href: '/best-phones-for-students-india' },
  { emoji: '🛒', label: 'Buying Guide',        href: '/smartphone-buying-guide-india' },
  { emoji: '⚖️', label: 'Compare',            href: '/phone-comparison-guide-india' },
  // Brand pillars
  { emoji: '🔷', label: 'Samsung',             href: '/best-samsung-phones-india' },
  { emoji: '🍎', label: 'iPhone',              href: '/best-apple-iphone-india' },
  { emoji: '⚡', label: 'OnePlus',             href: '/best-oneplus-phones-india' },
]

interface PillarNavProps {
  variant?: 'full' | 'compact' // full = sticky header, compact = inline strip
}

export default function PillarNav({ variant = 'full' }: PillarNavProps) {
  const pathname = usePathname()

  if (variant === 'compact') {
    return (
      <nav className="mb-8 -mx-4 px-4 overflow-x-auto">
        <div className="flex gap-2 pb-2 min-w-max">
          {PILLAR_LINKS.map(link => {
            const active = pathname === link.href
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`
                  flex items-center gap-1.5 px-3 py-1.5 font-sans text-xs font-semibold
                  whitespace-nowrap border transition-colors flex-shrink-0
                  ${active
                    ? 'bg-[#d4220a] text-white border-[#d4220a]'
                    : 'bg-white text-ink border-border hover:border-[#d4220a] hover:text-[#d4220a]'
                  }
                `}
              >
                <span className="text-[11px]">{link.emoji}</span>
                <span>{link.label}</span>
              </Link>
            )
          })}
        </div>
      </nav>
    )
  }

  // Full sticky subheader
  return (
    <div className="bg-white border-b border-border sticky top-[var(--header-height,56px)] z-30 shadow-sm">
      <div className="max-w-7xl mx-auto px-4">
        <nav className="flex items-center gap-0 overflow-x-auto scrollbar-hide -mb-px">
          {PILLAR_LINKS.map(link => {
            const active = pathname === link.href
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`
                  flex items-center gap-1.5 px-3 py-3 font-sans text-[11px] font-semibold
                  whitespace-nowrap border-b-2 transition-colors flex-shrink-0
                  ${active
                    ? 'border-[#d4220a] text-[#d4220a]'
                    : 'border-transparent text-muted hover:text-ink hover:border-gray-300'
                  }
                `}
              >
                <span>{link.emoji}</span>
                <span>{link.label}</span>
              </Link>
            )
          })}
        </nav>
      </div>
    </div>
  )
}