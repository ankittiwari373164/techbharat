import { NextResponse } from 'next/server'
import { getPublishedStoriesAsync } from '@/lib/stories-store'

export async function GET() {
  const stories = await getPublishedStoriesAsync()
  return NextResponse.json({ stories })
}