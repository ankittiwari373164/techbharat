// app/api/ping-sitemap/route.ts
// Lightweight sitemap ping — no auth needed, no quota
// Call this after every publish: fetch('/api/ping-sitemap')
// Also pings Bing for bonus coverage

import { NextResponse } from 'next/server'

const SITE_URL = process.env.SITE_URL || 'https://thetechbharat.com'

export async function GET() {
  const sitemapUrl = encodeURIComponent(`${SITE_URL}/sitemap.xml`)
  const results: Record<string, string> = {}

  // Ping Google
  try {
    const gRes = await fetch(`https://www.google.com/ping?sitemap=${sitemapUrl}`)
    results.google = gRes.ok ? 'ok' : `status ${gRes.status}`
  } catch {
    results.google = 'error'
  }

  // Ping Bing
  try {
    const bRes = await fetch(`https://www.bing.com/ping?sitemap=${sitemapUrl}`)
    results.bing = bRes.ok ? 'ok' : `status ${bRes.status}`
  } catch {
    results.bing = 'error'
  }

  return NextResponse.json({
    pinged: results,
    sitemap: `${SITE_URL}/sitemap.xml`,
    ts: new Date().toISOString(),
  })
}