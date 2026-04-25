import { NextResponse } from 'next/server'
import { getAllArticlesAsync, saveArticlesAsync } from '@/lib/store'

// 🔥 NEW: deterministic unique generator (NO repetition)
function generateStoredVerdict(article: any) {
  const base = (article.slug || '') + (article.title || '') + (article.brand || '')
  
  // simple hash
  let hash = 0
  for (let i = 0; i < base.length; i++) {
    hash = (hash << 5) - hash + base.charCodeAt(i)
    hash |= 0
  }
  const seed = Math.abs(hash)

  const pick = (arr: string[], offset: number) =>
    arr[(seed + offset) % arr.length]

  const brand = article.brand || 'This device'

  // ✅ MUCH BIGGER POOLS (key fix)
  const buyPool = [
    `${brand} is a practical choice for users who want reliable daily performance.`,
    `A good fit for users looking for balanced features without overpaying.`,
    `Suitable for users upgrading from older devices in this segment.`,
    `Works well for users who want a stable and simple smartphone experience.`,
    `Best for users who prefer usability over extreme performance.`,
    `Ideal for users who want consistent day-to-day performance.`,
    `Makes sense for buyers who want value without complexity.`,
    `A sensible pick for users who don’t need flagship-level specs.`,
  ]

  const notBuyPool = [
    `Not ideal for users expecting flagship-level performance.`,
    `Power users may find this limiting over time.`,
    `Not suitable if gaming or heavy performance is your priority.`,
    `Skip this if you want top-tier camera or premium features.`,
    `Not the best choice for users who demand high-end specs.`,
    `Avoid if you want the absolute best performance in this category.`,
    `May not satisfy users looking for cutting-edge features.`,
    `Not recommended for users who push devices to the limit.`,
  ]

  const verdictPool = [
    `${brand} delivers a stable experience but doesn’t lead its segment.`,
    `Overall, this is a practical option, though not the most exciting.`,
    `It gets the basics right but faces strong competition.`,
    `A balanced device, but not a standout performer.`,
    `Offers decent value, but alternatives may be stronger.`,
    `A safe choice, though not the most powerful option available.`,
    `Good overall, but not class-leading in any one area.`,
    `Reliable, but not designed for high-end users.`,
  ]

  return {
    buy: pick(buyPool, 1),
    notBuy: pick(notBuyPool, 2),
    final: pick(verdictPool, 3),
  }
}

export async function GET() {
  const articles = await getAllArticlesAsync()

  const updated = articles.map(a => {
    // ✅ FORCE REGENERATE (IMPORTANT FIX)
    a.verdict = generateStoredVerdict(a)
    return a
  })

  await saveArticlesAsync(updated)

  return NextResponse.json({
    success: true,
    updated: updated.length
  })
}