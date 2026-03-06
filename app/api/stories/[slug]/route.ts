import { NextRequest, NextResponse } from 'next/server'
import { getStoryBySlugAsync } from '@/lib/stories-store'

export async function GET(_: NextRequest, { params }: { params: { slug: string } }) {
  const story = await getStoryBySlugAsync(params.slug)
  if (!story || !story.isPublished) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json({ story })
}