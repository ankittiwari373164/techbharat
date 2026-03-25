// app/ads.txt/route.ts
// Backup ads.txt route — serves if public/ads.txt has caching issues
import { NextResponse } from 'next/server'

export async function GET() {
  return new NextResponse(
    'google.com, pub-4463674323364072, DIRECT, f08c47fec0942fa0',
    {
      headers: {
        'Content-Type': 'text/plain',
        'Cache-Control': 'public, max-age=86400',
      },
    }
  )
}