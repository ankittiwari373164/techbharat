'use client'
import Link from 'next/link'

interface BreadcrumbItem {
  label: string
  href: string
}

interface BreadcrumbNavProps {
  items: BreadcrumbItem[]
  className?: string
}

export default function BreadcrumbNav({ items, className = '' }: BreadcrumbNavProps) {
  return (
    <nav 
      className={`font-sans text-xs text-muted mb-4 flex items-center gap-2 flex-wrap ${className}`}
      aria-label="Breadcrumb"
    >
      {items.map((item, index) => (
        <div key={item.href} className="flex items-center gap-2">
          <Link 
            href={item.href}
            className="hover:text-[#d4220a] transition-colors"
          >
            {item.label}
          </Link>
          {index < items.length - 1 && (
            <span className="text-muted">/</span>
          )}
        </div>
      ))}
    </nav>
  )
}