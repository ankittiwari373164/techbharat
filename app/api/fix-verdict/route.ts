import { NextResponse } from 'next/server'
import { getAllArticlesAsync, saveArticlesAsync } from '@/lib/store'

function generateStoredVerdict(article: any) {
  const title = article.title.toLowerCase()

  let buy = ''
  let notBuy = ''
  let final = ''

  if (title.includes('camera')) {
    buy = 'Best for users who want strong camera performance and photography features.'
    notBuy = 'Not ideal if you need top gaming performance.'
  } else if (title.includes('gaming')) {
    buy = 'Good choice for users focused on gaming and performance.'
    notBuy = 'Not suitable if camera is your main priority.'
  } else if (title.includes('under') || title.includes('budget')) {
    buy = 'Perfect for users looking for value-for-money in this price range.'
    notBuy = 'Not ideal if you want flagship-level features.'
  } else {
    buy = 'Suitable for users who want a balanced smartphone experience.'
    notBuy = 'Not ideal for users expecting top-tier flagship performance.'
  }

  final = `${article.brand || 'This device'} offers a decent overall experience.`

  return { buy, notBuy, final }
}

export async function GET() {
  const articles = await getAllArticlesAsync()

  const updated = articles.map(a => {
    if (!a.verdict) {
      a.verdict = generateStoredVerdict(a)
    }
    return a
  })

  await saveArticlesAsync(updated)

  return NextResponse.json({
    success: true,
    updated: updated.length
  })
}