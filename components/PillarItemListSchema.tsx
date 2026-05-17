// components/PillarItemListSchema.tsx
// =====================================================================
//  Emits an ItemList JSON-LD schema for a pillar page.
//  Add to any pillar by importing and rendering once at the top of
//  the page's JSX:
//
//    <PillarItemListSchema
//       path="/best-camera-phones-india"
//       title="Best Camera Phones in India"
//       articles={articles}
//    />
//
//  Helps Google understand the page is a curated list, boosting
//  rich-result eligibility (carousels, "Top stories", etc).
// =====================================================================
import { buildPillarItemListSchema, type PillarArticle } from '@/lib/pillar-utils'

interface Props {
  path:     string
  title:    string
  articles: PillarArticle[]
  siteUrl?: string
}

export default function PillarItemListSchema({ path, title, articles, siteUrl = 'https://thetechbharat.com' }: Props) {
  if (!articles || articles.length < 3) return null
  const schema = buildPillarItemListSchema(path, title, articles, siteUrl)
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
