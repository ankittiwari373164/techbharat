import { NextRequest, NextResponse } from 'next/server'
import { getAllArticlesAsync, saveArticlesAsync } from '@/lib/store'

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  const all = await getAllArticlesAsync()
  await saveArticlesAsync(all.filter(a => a.id !== params.id))
  return NextResponse.json({ success: true })
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const body = await request.json()
  const all  = await getAllArticlesAsync()
  const idx  = all.findIndex(a => a.id === params.id)
  if (idx >= 0) { all[idx] = { ...all[idx], ...body }; await saveArticlesAsync(all) }
  return NextResponse.json({ success: true })
}