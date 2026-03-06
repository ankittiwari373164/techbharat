import { NextResponse } from 'next/server'
import { listPhonesWithImages } from '@/lib/phone-images'

export async function GET() {
  const phones = listPhonesWithImages()
  return NextResponse.json({ phones })
}
