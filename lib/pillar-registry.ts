// lib/pillar-registry.ts
// =====================================================================
//  PILLAR REGISTRY — single source of truth for hub pages
// ---------------------------------------------------------------------
//  Each pillar is a high-authority page that:
//    1. Aggregates related articles (rendered by ranking, not random).
//    2. Has trigger phrases that, when found in any article body, get
//       auto-linked to this pillar (article → pillar SPOKE link).
//    3. Has matchers (brand / type / tags / keywords) so we know which
//       articles BELONG to this pillar (pillar → article HUB link).
//
//  The internal-linking engine reads this file to build links in both
//  directions, giving Google a clean topic-cluster structure.
// =====================================================================

export interface PillarMeta {
  id:        string             // stable identifier
  path:      string             // /best-camera-phones-india
  title:     string             // human title for "Read also" UI
  keywords:  string[]           // for article-ranking on the pillar page
  triggers:  string[]           // phrases in article bodies that should link here
  brand?:    string             // if pillar is brand-specific
  matchBrands?: string[]        // articles from these brands belong here
  matchTypes?: string[]         // 'review' | 'compare' | 'mobile-news'
  priority:  number             // 1-10; higher = featured more prominently
}

export const PILLAR_REGISTRY: PillarMeta[] = [
  // ─── Tier 1: All-up + comparison hubs (highest priority) ────────
  {
    id:       'best-smartphones',
    path:     '/best-smartphones-india',
    title:    'Best Smartphones in India',
    keywords: ['best smartphone india', 'best phone india', 'top mobile india', 'smartphone 2026'],
    triggers: [
      'best smartphone in India',
      'best phone in India',
      'best smartphones',
      'top smartphones',
    ],
    priority: 10,
  },
  {
    id:       'smartphone-buying-guide',
    path:     '/smartphone-buying-guide-india',
    title:    'Smartphone Buying Guide India',
    keywords: ['how to buy phone', 'smartphone buying guide', 'choose a phone', 'phone buying tips'],
    triggers: [
      'smartphone buying guide',
      'how to choose a smartphone',
      'how to buy a phone',
    ],
    priority: 10,
  },
  {
    id:       'phone-comparison',
    path:     '/phone-comparison-guide-india',
    title:    'Phone Comparison Guide',
    keywords: ['phone comparison', 'compare smartphones', 'vs comparison'],
    triggers: [
      'phone comparison',
      'compare smartphones',
      'side-by-side comparison',
    ],
    matchTypes: ['compare'],
    priority: 9,
  },

  // ─── Tier 2: Budget tier hubs ──────────────────────────────────
  {
    id:       'best-budget',
    path:     '/best-budget-phones-india',
    title:    'Best Budget Phones India',
    keywords: ['budget phone', 'phone under 15000', 'phone under 20000', 'cheap phone', 'affordable smartphone'],
    triggers: [
      'best budget phone',
      'budget smartphone',
      'phones under ₹20,000',
      'phone under 20000',
      'phone under ₹15,000',
      'affordable smartphones',
    ],
    priority: 9,
  },
  {
    id:       'best-flagship',
    path:     '/best-flagship-phones-india',
    title:    'Best Flagship Phones India',
    keywords: ['flagship phone', 'premium smartphone', 'phone above 50000', 'phone under 100000'],
    triggers: [
      'best flagship phone',
      'flagship smartphone',
      'premium phone',
      'phones above ₹50,000',
    ],
    priority: 8,
  },

  // ─── Tier 3: Use-case hubs ─────────────────────────────────────
  {
    id:       'best-camera',
    path:     '/best-camera-phones-india',
    title:    'Best Camera Phones India',
    keywords: ['camera phone', 'best camera', 'phone photography', 'phone camera', 'phone camera quality'],
    triggers: [
      'best camera phone',
      'camera phone',
      'phone for photography',
      'best phone camera',
    ],
    priority: 8,
  },
  {
    id:       'best-gaming',
    path:     '/best-gaming-phones-india',
    title:    'Best Gaming Phones India',
    keywords: ['gaming phone', 'bgmi phone', 'phone for gaming', 'gaming performance'],
    triggers: [
      'best gaming phone',
      'gaming phone',
      'phone for BGMI',
      'phone for gaming',
    ],
    priority: 8,
  },
  {
    id:       'best-battery',
    path:     '/best-battery-backup-phones-india',
    title:    'Best Battery Backup Phones',
    keywords: ['battery life', 'long battery phone', 'best battery phone', '6000mah', '7000mah'],
    triggers: [
      'best battery phone',
      'phones with biggest battery',
      'longest battery life phone',
      'long battery backup',
    ],
    priority: 7,
  },
  {
    id:       'best-5g',
    path:     '/best-5g-phones-india',
    title:    'Best 5G Phones India',
    keywords: ['5g phone', '5g india', 'best 5g phone', 'jio 5g', 'airtel 5g'],
    triggers: [
      'best 5G phone',
      '5G phones in India',
      '5G smartphone',
      'phone with 5G',
    ],
    priority: 7,
  },
  {
    id:       'best-students',
    path:     '/best-phones-for-students-india',
    title:    'Best Phones for Students',
    keywords: ['phone for students', 'student phone', 'phone for college', 'phone for online classes'],
    triggers: [
      'best phone for students',
      'phone for college students',
      'student smartphone',
    ],
    priority: 6,
  },

  // ─── Tier 4: Brand hubs ────────────────────────────────────────
  {
    id:       'best-samsung',
    path:     '/best-samsung-phones-india',
    title:    'Best Samsung Phones India',
    keywords: ['samsung phone', 'galaxy phone', 'best samsung'],
    triggers: ['best Samsung phone', 'top Samsung Galaxy', 'best Samsung smartphone'],
    brand:    'Samsung',
    matchBrands: ['Samsung'],
    priority: 7,
  },
  {
    id:       'best-iphone',
    path:     '/best-apple-iphone-india',
    title:    'Best Apple iPhone India',
    keywords: ['iphone', 'apple iphone', 'best iphone india'],
    triggers: ['best iPhone', 'top Apple iPhone', 'best iPhone in India'],
    brand:    'Apple',
    matchBrands: ['Apple', 'iPhone'],
    priority: 7,
  },
  {
    id:       'best-oneplus',
    path:     '/best-oneplus-phones-india',
    title:    'Best OnePlus Phones India',
    keywords: ['oneplus phone', 'best oneplus', 'oneplus nord'],
    triggers: ['best OnePlus phone', 'top OnePlus', 'OnePlus Nord series'],
    brand:    'OnePlus',
    matchBrands: ['OnePlus'],
    priority: 6,
  },
]

// Quick path lookup
const PILLAR_BY_PATH = new Map(PILLAR_REGISTRY.map(p => [p.path, p]))
export function getPillarByPath(path: string): PillarMeta | undefined {
  return PILLAR_BY_PATH.get(path)
}

/**
 * Given an article, return the pillars that are most relevant to it.
 * Order: brand-matched pillars first, then use-case matches, then
 * the always-relevant generic hubs (best-smartphones, buying-guide).
 */
export function getPillarsForArticle(article: {
  brand?: string
  type?: string
  tags?: string[]
  title?: string
  summary?: string
}): PillarMeta[] {
  const tags  = (article.tags || []).map(t => t.toLowerCase())
  const text  = `${article.title || ''} ${article.summary || ''}`.toLowerCase()
  const brand = (article.brand || '').toLowerCase()
  const type  = article.type || ''

  const scored = PILLAR_REGISTRY.map(p => {
    let score = 0

    // Brand match
    if (p.matchBrands?.some(b => b.toLowerCase() === brand)) score += 10

    // Type match
    if (p.matchTypes?.includes(type)) score += 5

    // Keyword overlap with article text/tags
    for (const kw of p.keywords) {
      const k = kw.toLowerCase()
      if (text.includes(k))                     score += 2
      if (tags.some(t => t.includes(k)))        score += 1
    }

    // Generic hubs are always at least somewhat relevant
    if (p.id === 'best-smartphones' || p.id === 'smartphone-buying-guide') {
      score += 0.5
    }

    return { pillar: p, score }
  })

  return scored
    .filter(x => x.score > 0)
    .sort((a, b) => b.score - a.score || b.pillar.priority - a.pillar.priority)
    .slice(0, 4) // at most 4 pillars per article
    .map(x => x.pillar)
}
