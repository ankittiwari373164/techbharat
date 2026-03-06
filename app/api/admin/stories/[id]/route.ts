import { NextRequest, NextResponse } from 'next/server'
import { getAllStoriesAsync, saveStoriesAsync } from '@/lib/stories-store'

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const body = await request.json()
  const all  = await getAllStoriesAsync()
  const idx  = all.findIndex(s => s.id === params.id)
  if (idx >= 0) { all[idx] = { ...all[idx], ...body }; await saveStoriesAsync(all) }
  return NextResponse.json({ success: true })
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  const all = await getAllStoriesAsync()
  await saveStoriesAsync(all.filter(s => s.id !== params.id))
  return NextResponse.json({ success: true })
}

export async function PATCH(_: NextRequest, { params }: { params: { id: string } }) {
  const all = await getAllStoriesAsync()
  const idx = all.findIndex(s => s.id === params.id)
  if (idx >= 0) { all[idx].isPublished = !all[idx].isPublished; await saveStoriesAsync(all) }
  return NextResponse.json({ success: true })
}