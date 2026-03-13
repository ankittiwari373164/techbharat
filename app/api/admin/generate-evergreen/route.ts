// app/api/admin/generate-evergreen/route.ts
// Generates 10 evergreen SEO articles with high organic traffic potential
// POST /api/admin/generate-evergreen
// POST /api/admin/generate-evergreen?topic=best-phones-20k  (single topic)

import { NextRequest, NextResponse } from 'next/server'
import { saveArticlesAsync, getAllArticlesAsync, generateSlug } from '@/lib/store'
import { getArticleImages } from '@/lib/phone-images'

export const dynamic = 'force-dynamic'
export const maxDuration = 300

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY || ''

// ── 10 high-traffic evergreen topics for Indian mobile tech ──────
const EVERGREEN_TOPICS = [
  {
    id: 'best-phones-20k',
    title: 'Best Phones Under ₹20,000 in India (2026) — Ranked by Real Performance',
    brand: 'Mobile',
    type: 'compare' as const,
    prompt: `Write a comprehensive, SEO-optimised 2000-word evergreen article titled "Best Phones Under ₹20,000 in India (2026)".
This is a BUYING GUIDE — not a news article. Structure:
1. Quick answer (top 3 picks with one-line reasons)
2. Full comparison table (8 phones: model, price, chip, battery, camera, 5G yes/no)
3. Each phone: 150-word section with honest pros/cons, who it's for, India-specific note
4. Section: "Which one should YOU buy?" — 4 buyer personas (student, working professional, gaming, camera)
5. Section: "What to avoid under ₹20K" — 3 phones with clear reasons
6. FAQ: 5 questions people actually search (with answers)
Phones to include: Redmi Note 14, Realme P3, Poco M7 Pro, Samsung Galaxy A25, Motorola G85, Nothing Phone 2a, iQOO Z9x, OnePlus Nord CE 4 Lite
Price accuracy: use 2026 Indian market prices. Mark EMI options. Mention Flipkart/Amazon India.
Target keyword: "best phones under 20000 in India 2026"`,
  },
  {
    id: 'best-phones-30k',
    title: 'Best Phones Under ₹30,000 in India (2026) — Mid-Range That Actually Delivers',
    brand: 'Mobile',
    type: 'compare' as const,
    prompt: `Write a comprehensive 2000-word evergreen buying guide: "Best Phones Under ₹30,000 in India (2026)".
Structure:
1. Quick top 3 picks with one-line reasons
2. Full comparison table (8 phones): model, price, chip, RAM, battery, camera, 5G
3. Each phone: 150-word honest assessment — real-world performance, heating, camera quality, software support
4. "Best for gaming under ₹30K" — dedicated section
5. "Best camera phone under ₹30K" — dedicated section  
6. "Which to buy?" — 4 buyer personas
7. FAQ: 5 common questions
Phones: OnePlus Nord 4, Samsung Galaxy A55, Poco F6, Realme GT 6T, iQOO Neo 9, Google Pixel 8a, Motorola Edge 50, Nothing Phone 2
India-specific: 5G bands, heat in Indian summers, Flipkart/Amazon availability, EMI
Target keyword: "best phones under 30000 in India 2026"`,
  },
  {
    id: 'battery-saving-guide-android',
    title: 'Android Battery Saving Guide 2026 — Make Your Phone Last 2 Days',
    brand: 'Mobile',
    type: 'mobile-news' as const,
    prompt: `Write a practical, detailed 2000-word guide: "Android Battery Saving Guide 2026 — Make Your Phone Last 2 Days".
This is a HOW-TO guide, not a news article. Vijay Yadav writing from 11 years of experience.
Structure:
1. Opening: The honest truth about battery life in India (heat, background apps, network switching)
2. Section: "Settings to change TODAY" — 8 specific settings with exact menu paths on Android 14/15
3. Section: "App-level battery management" — which apps drain most, how to restrict them
4. Section: "Charging habits that actually matter" — 20-80% rule, overnight charging myth, fast charging heat
5. Section: "India-specific tips" — 4G/5G switching, dust ports, summer heat impact
6. Section: "Battery health — how to check and preserve it" — code *#*#4636#*#*, third-party apps
7. Section: "When to replace vs repair" — honest advice
8. FAQ: 6 questions
Mention specific phones: Samsung, Xiaomi, OnePlus, Realme settings
Target keyword: "android battery saving tips india 2026"`,
  },
  {
    id: '5g-india-guide',
    title: '5G in India 2026 — Which Bands Work, Which Phones Support Them, What\'s Actually Fast',
    brand: 'Mobile',
    type: 'mobile-news' as const,
    prompt: `Write an authoritative 2000-word guide: "5G in India 2026 — Complete Guide to Bands, Phones and Real Speeds".
Structure:
1. Opening: The honest state of 5G in India — hype vs reality
2. Section: "5G bands in India explained" — n78, n77, n28, mmWave. Which carrier uses which. Simple table.
3. Section: "Jio vs Airtel vs Vi 5G — city coverage comparison" — honest assessment by city tier
4. Section: "Does your phone support real Indian 5G?" — what to check, where to find band info
5. Section: "Phones with best 5G support under ₹20K / ₹30K / ₹50K" — 3 picks per category
6. Section: "5G speed tests in Indian cities" — real-world expectations (not marketing claims)
7. Section: "Is 5G worth upgrading for in 2026?" — honest verdict
8. FAQ: 6 questions
India-specific data. Vijay's personal testing opinion included.
Target keyword: "5g india which phones support 2026"`,
  },
  {
    id: 'best-camera-phones-india',
    title: 'Best Camera Phones in India 2026 — Ranked by Real Photo Quality (Not Megapixels)',
    brand: 'Mobile',
    type: 'compare' as const,
    prompt: `Write a 2000-word camera-focused buying guide: "Best Camera Phones in India 2026 — Ranked by Real Results".
Structure:
1. Opening: Why megapixels mean nothing — what actually matters (sensor size, processing, night mode)
2. Quick picks: Budget (under ₹20K), Mid-range (₹20-40K), Premium (₹40K+) — one winner each
3. Full comparison table: 8 phones, columns: price, main sensor, aperture, video, night mode score
4. Each phone: 150 words — what its camera actually does well and where it fails
5. Section: "For Instagram/Reels creators" — best video stabilisation
6. Section: "For low-light photography" — night mode comparison
7. Section: "Portrait mode reality check" — which phones fake it vs do it right
8. FAQ: 5 questions
Phones: Samsung S25, iPhone 16, Google Pixel 9, OnePlus 13, Vivo X200, Xiaomi 15, Realme GT 7 Pro, Nothing Phone 3
India pricing and Flipkart/Amazon availability
Target keyword: "best camera phone india 2026"`,
  },
  {
    id: 'how-to-choose-smartphone-india',
    title: 'How to Choose a Smartphone in India 2026 — The No-Nonsense Buying Guide',
    brand: 'Mobile',
    type: 'mobile-news' as const,
    prompt: `Write a comprehensive 2000-word beginner-to-intermediate guide: "How to Choose a Smartphone in India 2026".
This is for someone confused by specs, marketing claims and too many options.
Structure:
1. Opening: The smartphone market is designed to confuse you — here's how to cut through it
2. Section: "Step 1 — Set your real budget" — actual cost breakdown (phone + cover + insurance + screen guard)
3. Section: "The specs that ACTUALLY matter in real use" — processor tiers (Snapdragon/MediaTek), RAM reality, storage (always get 128GB minimum)
4. Section: "The specs that are mostly marketing" — megapixels, refresh rate above 120Hz, slim body
5. Section: "Brand reliability in India 2026" — after-sales service, software updates, resale value: Samsung vs OnePlus vs Xiaomi vs Realme vs Motorola
6. Section: "Where to buy — Flipkart vs Amazon vs Offline" — real pros/cons, sale timing
7. Section: "What Vijay actually recommends for each budget"
8. FAQ: 6 questions
Vijay's personal opinions throughout. India-specific advice.
Target keyword: "how to choose smartphone india 2026"`,
  },
  {
    id: 'xiaomi-vs-samsung-india',
    title: 'Xiaomi vs Samsung in India 2026 — Which Brand Is Actually Worth Your Money?',
    brand: 'Xiaomi',
    type: 'compare' as const,
    prompt: `Write a definitive 2000-word brand comparison: "Xiaomi vs Samsung in India 2026 — Full Brand Breakdown".
Structure:
1. Opening: The real battle in Indian smartphones — and why this comparison matters
2. Section: "Value for money — budget segment (under ₹20K)" — 3 head-to-heads with honest verdicts
3. Section: "Mid-range battle (₹20-40K)" — 3 head-to-heads
4. Section: "Premium segment (₹40K+)" — where each brand stands
5. Section: "After-sales service" — service centre count, repair cost, warranty claims reality in India
6. Section: "Software — MIUI/HyperOS vs One UI" — honest pros/cons, bloatware, update track record
7. Section: "Resale value comparison" — 1-year and 2-year depreciation data
8. Section: "Camera quality by price bracket" — which brand wins at each level
9. Section: "Vijay's verdict" — clear winner per use case
10. FAQ: 5 questions
Target keyword: "xiaomi vs samsung india 2026"`,
  },
  {
    id: 'best-gaming-phones-india',
    title: 'Best Gaming Phones Under ₹30,000 in India 2026 — Real FPS, Real Heat Tests',
    brand: 'Mobile',
    type: 'compare' as const,
    prompt: `Write a 2000-word gaming-focused buying guide: "Best Gaming Phones Under ₹30,000 India 2026".
Structure:
1. Opening: Gaming on a budget in India — what's changed in 2026
2. Section: "What makes a phone good for gaming" — chip, cooling, RAM, display refresh, triggers
3. Comparison table: 7 phones — price, chip, AnTuTu score, RAM, cooling type, battery, display
4. Each phone: 150 words — gaming performance, heat management, battery drain during gaming
5. Section: "BGMI / Free Fire / COD performance" — which games run at what settings on each phone
6. Section: "Cooling solutions that work" — cooling fans, cases, throttling reality
7. Section: "Best gaming phone under ₹15K / ₹20K / ₹30K" — one winner each
8. FAQ: 5 questions
Phones: Poco F6, iQOO Z9 Turbo, Realme GT 6T, OnePlus Nord 4, RedMagic 9S, Samsung M55, Motorola Edge 50 Neo
Target keyword: "best gaming phone under 30000 india 2026"`,
  },
  {
    id: 'oneplus-vs-nothing-comparison',
    title: 'OnePlus vs Nothing Phone in India 2026 — The Honest Comparison Nobody Else Will Write',
    brand: 'OnePlus',
    type: 'compare' as const,
    prompt: `Write a sharp, opinionated 2000-word brand comparison: "OnePlus vs Nothing Phone India 2026".
Structure:
1. Opening: Two brands that built their reputation on being "different" — but are they still?
2. Section: "Design philosophy" — OnePlus pragmatism vs Nothing's aesthetic focus. Real trade-offs.
3. Section: "Price comparison table" — matching pairs at ₹20K, ₹30K, ₹40K tiers
4. Section: "Performance — is OxygenOS still fast? Is Nothing OS still clean?" — honest software assessment
5. Section: "Camera battle by tier" — who wins at each price point
6. Section: "Build quality and durability" — India's dust, heat, and drop reality
7. Section: "After-sales in India" — service centres, parts availability, response time
8. Section: "Software updates track record" — who supports longer
9. Section: "Vijay's verdict" — clear recommendation per budget
10. FAQ: 5 questions
Vijay's personal opinions and mild frustrations throughout.
Target keyword: "oneplus vs nothing phone india 2026"`,
  },
  {
    id: 'refurbished-phones-india-guide',
    title: 'Buying Refurbished Phones in India 2026 — Safe or Risky? Complete Guide',
    brand: 'Mobile',
    type: 'mobile-news' as const,
    prompt: `Write a practical 2000-word guide: "Buying Refurbished Phones in India 2026 — The Complete Safety Guide".
Structure:
1. Opening: Refurbished phones saved me ₹15,000 — but I've also been burned. Here's what I learned.
2. Section: "Refurbished vs Used vs Renewed — what's the actual difference in India"
3. Section: "Trusted platforms in India" — Amazon Renewed, Flipkart 2GUD, Cashify, Yaantra — honest pros/cons of each
4. Section: "Grades explained — A, B, C grade phones — what to expect"
5. Section: "Red flags to watch for" — IMEI check, battery health, warranty void stickers, box contents
6. Section: "How to verify a refurbished phone when it arrives" — 10-step checklist
7. Section: "Best brands to buy refurbished" — Samsung vs Apple vs OnePlus resale and repair ecosystem
8. Section: "Is it worth it at each budget?" — under ₹10K, ₹15K, ₹20K honest advice
9. Section: "Vijay's personal experience" — one positive, one negative story
10. FAQ: 6 questions
Target keyword: "buy refurbished phone india 2026 safe"`,
  },
]

const SYSTEM_PROMPT = `You are Vijay Yadav, founder of The Tech Bharat. 11 years covering Indian smartphones. Direct, opinionated, India-focused. You write for real Indian buyers — not for press releases.

RULES:
- British English
- Prices always in ₹
- Personal opinions mandatory ("I think", "In my experience", "My honest take")
- India-specific context always (Flipkart/Amazon, 5G bands, heat, EMI, service centres)
- Varied sentence length — mix short punchy sentences with longer analytical ones
- NO banned phrases: "seamless", "robust", "cutting-edge", "revolutionary", "furthermore", "moreover", "in conclusion", "it is worth noting", "in today's world", "plays a crucial role"
- HTML output only: <p>, <h2>, <h3>, <table>, <tr>, <th>, <td>, <strong>, <ul>, <li>
- End with honest verdict — not a balanced summary`

async function generateEvergreenArticle(topic: typeof EVERGREEN_TOPICS[0]): Promise<string> {
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 6000,
      system: SYSTEM_PROMPT,
      messages: [{
        role: 'user',
        content: `${topic.prompt}

Return ONLY valid JSON, no markdown fences:
{
  "title": "exact article title",
  "summary": "3-sentence summary, conversational, India-specific",
  "bullets": ["5 key points, specific with numbers"],
  "fullContent": "full HTML article, 2000 words minimum",
  "tags": ["6 SEO tags including primary keyword"],
  "quickBullets": ["3 bullets max 7 words each"]
}`
      }],
    }),
  })

  if (!res.ok) throw new Error(`Anthropic ${res.status}`)
  const data = await res.json()
  const text = data.content.filter((b: {type:string}) => b.type === 'text').map((b: {text:string}) => b.text).join('')
  const clean = text.replace(/^```json\s*/m, '').replace(/```\s*$/m, '').trim()
  const match = clean.match(/\{[\s\S]*\}/)
  if (!match) throw new Error('No JSON in response')
  return match[0]
}

export async function POST(request: NextRequest) {
  const cookie = request.cookies.get('__tb_admin')?.value
  if (!cookie) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const { searchParams } = new URL(request.url)
  const singleTopic = searchParams.get('topic') // optional: generate just one topic

  const topicsToGenerate = singleTopic
    ? EVERGREEN_TOPICS.filter(t => t.id === singleTopic)
    : EVERGREEN_TOPICS

  if (topicsToGenerate.length === 0) {
    return NextResponse.json({ error: `Topic "${singleTopic}" not found` }, { status: 400 })
  }

  const existingArticles = await getAllArticlesAsync()
  const existingSlugs = new Set(existingArticles.map((a: any) => a.slug))

  const generated: string[] = []
  const skipped: string[] = []
  const errors: string[] = []
  const newArticles: any[] = []

  for (const topic of topicsToGenerate) {
    const slug = generateSlug(topic.title)

    // Skip if already exists
    if (existingSlugs.has(slug)) {
      skipped.push(topic.id)
      console.log(`[Evergreen] Skipping existing: ${topic.id}`)
      continue
    }

    try {
      console.log(`[Evergreen] Generating: ${topic.id}`)
      const jsonStr = await generateEvergreenArticle(topic)
      const parsed = JSON.parse(jsonStr)

      const images = await getArticleImages(topic.brand + ' smartphone', 5)
      const wc = (parsed.fullContent || '').replace(/<[^>]*>/g, '').split(/\s+/).length
      const rt = Math.max(7, Math.ceil(wc / 220))

      const article = {
        id: `evergreen-${topic.id}-${Date.now()}`,
        slug,
        title: parsed.title || topic.title,
        type: topic.type,
        category: topic.type === 'compare' ? 'Compare' : 'Mobile News',
        brand: topic.brand,
        publishDate: new Date().toISOString(),
        author: 'Vijay Yadav',
        readTime: rt,
        featuredImage: images[0] || '',
        images,
        summary: parsed.summary || '',
        bullets: parsed.bullets || [],
        content: parsed.fullContent || '',
        tags: parsed.tags || [],
        relatedSlugs: [],
        reviews: [],
        quickSummary: {
          brand: topic.brand,
          date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
          bullets: parsed.quickBullets || [],
        },
        seoTitle: (parsed.title || topic.title) + ' | The Tech Bharat',
        seoDescription: (parsed.summary || '').slice(0, 155),
        isFeatured: false,
        isEvergreen: true, // flag for future reference
      }

      newArticles.push(article)
      generated.push(topic.id)
      console.log(`[Evergreen] Done: ${topic.id}`)

      // Delay between API calls to avoid rate limiting
      if (topicsToGenerate.indexOf(topic) < topicsToGenerate.length - 1) {
        await new Promise(r => setTimeout(r, 3000))
      }
    } catch (err) {
      const msg = (err as Error).message
      errors.push(`${topic.id}: ${msg}`)
      console.error(`[Evergreen] Failed ${topic.id}: ${msg}`)
    }
  }

  // Save all new articles at once
  if (newArticles.length > 0) {
    const allArticles = [...existingArticles, ...newArticles]
    // Update relatedSlugs across all articles
    allArticles.forEach((a: any, idx: number) => {
      if (!a.relatedSlugs?.length) {
        a.relatedSlugs = allArticles.filter((_: any, j: number) => j !== idx).slice(0, 4).map((b: any) => b.slug)
      }
    })
    await saveArticlesAsync(allArticles)
  }

  return NextResponse.json({
    success: true,
    generated,
    skipped,
    errors,
    total_new: newArticles.length,
    available_topics: EVERGREEN_TOPICS.map(t => t.id),
  })
}