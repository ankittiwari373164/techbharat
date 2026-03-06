import { NextRequest, NextResponse } from 'next/server'
import { getAllStoriesAsync, saveStoriesAsync, addStoryAsync, generateStorySlug, WebStory } from '@/lib/stories-store'

export async function GET() {
  const stories = await getAllStoriesAsync()
  return NextResponse.json({ stories, total: stories.length })
}

export async function POST(request: NextRequest) {
  const body = await request.json()
  if (!body.title || !body.slides?.length) {
    return NextResponse.json({ error: 'Title and at least 1 slide required' }, { status: 400 })
  }
  const now = new Date()
  const story: WebStory = {
    id:             `story-${now.getTime()}`,
    slug:           generateStorySlug(body.title),
    title:          body.title,
    brand:          body.brand        || 'TechBharat',
    category:       body.category     || 'Mobile News',
    coverImage:     body.coverImage   || body.slides[0]?.imageUrl || '',
    slides:         body.slides,
    publishDate:    now.toISOString(),
    isPublished:    body.isPublished  ?? true,
    tags:           body.tags         || [],
    seoTitle:       body.seoTitle     || body.title + ' | TechBharat Web Stories',
    seoDescription: body.seoDescription || body.title,
  }
  await addStoryAsync(story)
  return NextResponse.json({ success: true, story })
}