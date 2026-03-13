// lib/evergreen-topics.ts
// Shared evergreen topic definitions — imported by route + admin page

export const EVERGREEN_TOPICS = [
  {
    id: 'best-phones-20k',
    title: 'Best Phones Under ₹20,000 in India (2026) — Ranked by Real Performance',
    brand: 'Mobile', type: 'compare' as const,
    keywords: ['budget phone','best phone under 20000','xiaomi','realme','poco'],
    prompt: `Write a comprehensive, SEO-optimised 2000-word evergreen article titled "Best Phones Under ₹20,000 in India (2026)".
This is a BUYING GUIDE. Structure:
1. Quick answer (top 3 picks, one-line reason each)
2. Full comparison table (8 phones: model, price, chip, battery, camera, 5G yes/no)
3. Each phone: 150-word section with honest pros/cons, who it's for, India note
4. "Which one should YOU buy?" — 4 buyer personas (student, professional, gaming, camera)
5. "What to avoid under ₹20K" — 3 phones with clear reasons
6. FAQ: 5 questions people actually search
Phones: Redmi Note 14, Realme P3, Poco M7 Pro, Samsung Galaxy A25, Motorola G85, Nothing Phone 2a, iQOO Z9x, OnePlus Nord CE 4 Lite
Target keyword: "best phones under 20000 in India 2026"`,
  },
  {
    id: 'best-phones-30k',
    title: 'Best Phones Under ₹30,000 in India (2026) — Mid-Range That Actually Delivers',
    brand: 'Mobile', type: 'compare' as const,
    keywords: ['mid range phone','best phone under 30000','oneplus','samsung'],
    prompt: `Write a 2000-word evergreen buying guide: "Best Phones Under ₹30,000 in India (2026)".
Structure: Quick top 3 · comparison table (8 phones) · each phone 150-word honest assessment · best for gaming section · best camera section · buyer personas · FAQ.
Phones: OnePlus Nord 4, Samsung Galaxy A55, Poco F6, Realme GT 6T, iQOO Neo 9, Google Pixel 8a, Motorola Edge 50, Nothing Phone 2.
Target keyword: "best phones under 30000 in India 2026"`,
  },
  {
    id: 'battery-saving-guide-android',
    title: 'Android Battery Saving Guide 2026 — Make Your Phone Last 2 Days',
    brand: 'Mobile', type: 'mobile-news' as const,
    keywords: ['battery life','android tips','battery saving','phone battery'],
    prompt: `Write a practical 2000-word guide: "Android Battery Saving Guide 2026".
Structure: Settings to change TODAY (8 specific settings with exact menu paths on Android 14/15) · App-level battery management · Charging habits · India-specific tips (4G/5G switching, heat) · Battery health check (code *#*#4636#*#*) · When to replace · FAQ (6 questions).
Target keyword: "android battery saving tips india 2026"`,
  },
  {
    id: '5g-india-guide',
    title: '5G in India 2026 — Which Bands Work, Which Phones Support Them',
    brand: 'Mobile', type: 'mobile-news' as const,
    keywords: ['5g india','5g bands','jio 5g','airtel 5g','5g phone'],
    prompt: `Write a 2000-word guide: "5G in India 2026 — Complete Guide".
Structure: State of 5G in India honest · 5G bands explained (n78,n77,n28,mmWave) table · Jio vs Airtel vs Vi coverage · How to check your phone's band support · Best 5G phones under ₹20K/₹30K/₹50K · Real speed expectations · Is 5G worth upgrading in 2026 · FAQ.
Target keyword: "5g india which phones support 2026"`,
  },
  {
    id: 'best-camera-phones-india',
    title: 'Best Camera Phones in India 2026 — Ranked by Real Photo Quality',
    brand: 'Mobile', type: 'compare' as const,
    keywords: ['best camera phone','camera phone india','phone photography'],
    prompt: `Write a 2000-word camera buying guide: "Best Camera Phones in India 2026".
Structure: Why megapixels mean nothing · Quick picks (budget/mid/premium) · Comparison table (8 phones) · Each phone 150 words · For Instagram/Reels section · Low-light comparison · Portrait mode reality check · FAQ.
Phones: Samsung S25, iPhone 16, Pixel 9, OnePlus 13, Vivo X200, Xiaomi 15, Realme GT 7 Pro, Nothing Phone 3.
Target keyword: "best camera phone india 2026"`,
  },
  {
    id: 'how-to-choose-smartphone-india',
    title: 'How to Choose a Smartphone in India 2026 — The No-Nonsense Buying Guide',
    brand: 'Mobile', type: 'mobile-news' as const,
    keywords: ['how to buy phone','smartphone buying guide','which phone to buy india'],
    prompt: `Write a 2000-word beginner guide: "How to Choose a Smartphone in India 2026".
Structure: Set your real budget · Specs that ACTUALLY matter (processor, RAM, storage) · Specs that are mostly marketing · Brand reliability in India 2026 (after-sales, updates, resale) · Where to buy Flipkart vs Amazon vs offline · Vijay's recommendations per budget · FAQ.
Target keyword: "how to choose smartphone india 2026"`,
  },
  {
    id: 'xiaomi-vs-samsung-india',
    title: 'Xiaomi vs Samsung in India 2026 — Which Brand Is Actually Worth Your Money?',
    brand: 'Xiaomi', type: 'compare' as const,
    keywords: ['xiaomi vs samsung','redmi vs samsung','best brand india'],
    prompt: `Write a 2000-word brand comparison: "Xiaomi vs Samsung in India 2026".
Structure: Value under ₹20K (3 head-to-heads) · Mid-range ₹20-40K · Premium ₹40K+ · After-sales service · Software HyperOS vs One UI · Resale value · Camera by price bracket · Vijay's verdict · FAQ.
Target keyword: "xiaomi vs samsung india 2026"`,
  },
  {
    id: 'best-gaming-phones-india',
    title: 'Best Gaming Phones Under ₹30,000 in India 2026 — Real FPS, Real Heat Tests',
    brand: 'Mobile', type: 'compare' as const,
    keywords: ['gaming phone india','best gaming phone','bgmi phone','poco gaming'],
    prompt: `Write a 2000-word gaming guide: "Best Gaming Phones Under ₹30,000 India 2026".
Structure: What makes a phone good for gaming · Comparison table (7 phones: AnTuTu, RAM, cooling, battery) · Each phone 150 words · BGMI/Free Fire/COD performance · Cooling solutions · Best under ₹15K/₹20K/₹30K · FAQ.
Phones: Poco F6, iQOO Z9 Turbo, Realme GT 6T, OnePlus Nord 4, RedMagic 9S, Samsung M55, Motorola Edge 50 Neo.
Target keyword: "best gaming phone under 30000 india 2026"`,
  },
  {
    id: 'oneplus-vs-nothing-comparison',
    title: 'OnePlus vs Nothing Phone in India 2026 — The Honest Comparison',
    brand: 'OnePlus', type: 'compare' as const,
    keywords: ['oneplus vs nothing','nothing phone','oneplus nord','which phone'],
    prompt: `Write a 2000-word brand comparison: "OnePlus vs Nothing Phone India 2026".
Structure: Design philosophy real trade-offs · Price comparison table (₹20K/₹30K/₹40K) · OxygenOS vs Nothing OS honest · Camera battle by tier · Build quality India context · After-sales · Software update track record · Vijay's verdict per budget · FAQ.
Target keyword: "oneplus vs nothing phone india 2026"`,
  },
  {
    id: 'refurbished-phones-india-guide',
    title: 'Buying Refurbished Phones in India 2026 — Safe or Risky? Complete Guide',
    brand: 'Mobile', type: 'mobile-news' as const,
    keywords: ['refurbished phone india','second hand phone','cashify','amazon renewed'],
    prompt: `Write a 2000-word guide: "Buying Refurbished Phones in India 2026".
Structure: Refurbished vs Used vs Renewed · Trusted platforms India (Amazon Renewed, Flipkart 2GUD, Cashify, Yaantra) · Grades A/B/C · Red flags checklist · 10-step verify on arrival · Best brands refurbished · Worth it under ₹10K/₹15K/₹20K · Vijay's personal experience · FAQ.
Target keyword: "buy refurbished phone india 2026 safe"`,
  },
]