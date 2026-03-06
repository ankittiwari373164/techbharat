// app/api/fetch-news/route.ts
// Browser-accessible trigger — also used by Vercel cron
import { NextRequest, NextResponse } from 'next/server'
import { fetchAndRewriteNews, buildArticles } from '@/lib/news-fetcher'
import { getAllArticles, addArticle } from '@/lib/store'

export const maxDuration = 300

let isFetching  = false
let lastFetchAt = 0

function missingKeys(): string[] {
  const m: string[] = []
  if (!process.env.NEWSAPI_KEY && !process.env.GNEWS_API_KEY) m.push('NEWSAPI_KEY or GNEWS_API_KEY')
  if (!process.env.ANTHROPIC_API_KEY && !process.env.GROQ_API_KEY) m.push('ANTHROPIC_API_KEY or GROQ_API_KEY')
  return m
}

function html(body: string, status = 200) {
  return new NextResponse(
    `<html><body style="font-family:sans-serif;max-width:640px;margin:40px auto;padding:24px;background:#faf9f7">${body}</body></html>`,
    { status, headers: { 'Content-Type': 'text/html' } }
  )
}

export async function GET(request: NextRequest) {
  const missing = missingKeys()
  if (missing.length > 0) {
    return html(`<h2 style="color:#d4220a">⚠️ Missing API Keys</h2>
      <p>Add to <code>.env.local</code>: ${missing.join(', ')}</p>
      <a href="/admin" style="color:#d4220a">← Go to Admin Panel</a>`, 400)
  }

  if (isFetching) return html(`<h2>⏳ Already Running</h2>
    <p>A fetch is in progress. Check the <a href="/admin" style="color:#d4220a">Admin Panel</a>.</p>`)

  const now = Date.now()
  if (now - lastFetchAt < 60000) {
    return html(`<h2>⏳ Too Soon</h2>
      <p>Wait ${Math.ceil((60000-(now-lastFetchAt))/1000)}s before next fetch.</p>
      <a href="/">← Home</a>`, 429)
  }

  isFetching = true
  try {
    const rawItems   = await fetchAndRewriteNews()
    const newArticles = await buildArticles(rawItems)
    const existing   = getAllArticles()
    let added = 0
    for (const a of newArticles) {
      if (!existing.some(e => e.title.toLowerCase().trim() === a.title.toLowerCase().trim())) {
        addArticle(a); added++
      }
    }
    lastFetchAt = Date.now()
    isFetching  = false
    return new NextResponse(
      `<html><head><meta http-equiv="refresh" content="3;url=/"></head>
       <body style="font-family:sans-serif;max-width:600px;margin:60px auto;padding:20px;text-align:center;background:#faf9f7">
         <div style="font-size:60px;margin-bottom:12px">✅</div>
         <h2>${added} articles published!</h2>
         <p style="color:#6b6460">Redirecting to homepage…</p>
         <a href="/" style="color:#d4220a;font-weight:bold">← Go Now</a>
       </body></html>`,
      { headers: { 'Content-Type': 'text/html' } }
    )
  } catch (err: unknown) {
    isFetching = false
    const e = err as Error
    const isRate = e.message?.includes('429') || e.message?.includes('rate_limit')
    return html(`<h2 style="color:#d4220a">⚠️ ${isRate ? 'Rate Limited' : 'Error'}</h2>
      <p>${isRate ? 'Wait 60s and try again.' : e.message}</p>
      <p><a href="/api/fetch-news" style="color:#d4220a;font-weight:bold">Try Again</a> &nbsp;
      <a href="/admin" style="color:#1a3a5c">Admin Panel</a></p>`, 500)
  }
}