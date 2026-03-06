import { NextRequest, NextResponse } from 'next/server'
import { getAllArticlesAsync, saveArticlesAsync } from '@/lib/store'

export async function POST(_: NextRequest, { params }: { params: { id: string } }) {
  const all     = await getAllArticlesAsync()
  const updated = all.map(a => ({ ...a, isFeatured: a.id === params.id ? !a.isFeatured : false }))
  await saveArticlesAsync(updated)
  return NextResponse.json({ success: true })
}