import { getStoryBySlugAsync } from '@/lib/stories-store'
import type { Metadata } from 'next'

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const story = await getStoryBySlugAsync(params.slug)
  if (!story) return { title: 'Web Story – The Tech Bharat' }
  return {
    title: `${story.title} – The Tech Bharat`,
    description: story.slides[0]?.headline || story.title,
    openGraph: {
      title: story.title,
      description: story.slides[0]?.headline || story.title,
      images: story.coverImage ? [{ url: story.coverImage, width: 640, height: 853 }] : [],
      type: 'article',
    },
  }
}

export default function StoryLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}