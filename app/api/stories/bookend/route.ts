// app/api/stories/bookend/route.ts
// AMP Story bookend — shows related content at end of web story
import { NextResponse } from 'next/server'
import { getPublishedStoriesAsync } from '@/lib/stories-store'

const SITE_URL = process.env.SITE_URL || 'https://thetechbharat.com'

export async function GET() {
  let stories: any[] = []
  try {
    stories = await getPublishedStoriesAsync()
  } catch {}

  const related = stories.slice(0, 4).map(s => ({
    type: 'small',
    title: s.title,
    url: `${SITE_URL}/web-stories/${s.slug}`,
    image: s.coverImage || `${SITE_URL}/og-image.jpg`,
  }))

  const bookend = {
    bookendVersion: 'v1.0',
    shareProviders: ['twitter', 'email'],
    components: [
      {
        type: 'heading',
        text: 'More from The Tech Bharat',
      },
      ...related,
      {
        type: 'cta-link',
        links: [
          { text: 'All Web Stories', url: `${SITE_URL}/web-stories` },
          { text: 'Latest Phone News', url: `${SITE_URL}/mobile-news` },
        ],
      },
    ],
  }

  return NextResponse.json(bookend, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'public, max-age=3600',
    },
  })
}