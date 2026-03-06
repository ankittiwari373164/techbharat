import { NextResponse } from 'next/server'

// This route is disabled - use /api/scheduler instead
export const dynamic = 'force-dynamic'

export async function GET() {
  return NextResponse.json({ message: 'Use /api/scheduler for automated publishing' })
}