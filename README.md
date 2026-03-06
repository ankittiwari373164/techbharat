# TechBharat – India's Mobile Technology News Portal

A professional Next.js news website that automatically fetches, rewrites, and publishes trending mobile tech news using the Anthropic API.

## Features

- 🤖 **Auto News Fetching** – Uses Anthropic API with web search to fetch real-time mobile news
- ✍️ **Human-sounding Rewrite** – All content rewritten to be original, 800-1000 words, India-focused
- 📸 **Smart Images** – Uses your local phone images folder, falls back to Unsplash/Picsum
- 📱 **Professional Design** – Editorial news website design optimised for Google Discover
- 📰 **Google News Ready** – NewsArticle schema, news sitemap, proper structure
- 💰 **AdSense Ready** – All required pages: Privacy Policy, About, Contact, Disclaimer, Terms, Editorial Policy, Corrections Policy, Author
- 🔍 **SEO Optimised** – Dynamic sitemap, robots.txt, meta tags, structured data
- ⭐ **Reader Reviews** – Users can submit reviews on any article
- 🔄 **Similar Articles** – Automatic related content section
- 📖 **Read More Expand** – Articles show intro + bullets then expand on click

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
```bash
cp .env.local.example .env.local
```

Edit `.env.local`:
```env
ANTHROPIC_API_KEY=your_anthropic_api_key_here
UNSPLASH_ACCESS_KEY=your_unsplash_key_here  # optional but recommended
SITE_URL=https://techbharat.com
CRON_SECRET=your_random_secret_here
```

### 3. Add Phone Images (Optional but Recommended)
```bash
public/phone-images/
├── samsung-galaxy-s25/
│   ├── 1.jpg
│   ├── 2.jpg
│   └── 3.jpg
├── apple-iphone-17/
│   └── 1.jpg
```
See `public/phone-images/README.md` for details.

### 4. Start Development Server
```bash
npm run dev
```

Visit `http://localhost:3000`

### 5. Fetch Your First News Articles
Click **"Fetch Latest News"** button in the header, or visit:
```
http://localhost:3000/api/fetch-news
```

This will:
1. Use Anthropic API to search for today's 6-10 trending mobile stories
2. Rewrite them as original 800-1000 word articles
3. Assign images from your phone-images folder or Unsplash
4. Publish them on your homepage

## Pages

| Page | URL | Purpose |
|------|-----|---------|
| Home | `/` | Professional news homepage |
| Mobile News | `/mobile-news` | All mobile news articles |
| Reviews | `/reviews` | Phone reviews |
| Compare | `/compare` | Phone comparisons |
| Web Stories | `/web-stories` | Visual stories for Discover |
| Article | `/article/[slug]` | Individual article with expand, reviews, similar |
| About Us | `/about` | AdSense required page |
| Contact | `/contact` | AdSense required page |
| Privacy Policy | `/privacy-policy` | AdSense required page |
| Disclaimer | `/disclaimer` | AdSense required page |
| Terms | `/terms` | AdSense required page |
| Editorial Policy | `/editorial-policy` | Google News required |
| Corrections Policy | `/corrections-policy` | Google News required |
| Author | `/author` | E-E-A-T signals |
| Sitemap | `/sitemap.xml` | Auto-generated |
| Robots | `/robots.txt` | Search engine guidance |

## API Routes

| Route | Method | Description |
|-------|--------|-------------|
| `/api/fetch-news` | GET | Trigger news fetch (open in browser) |
| `/api/article/[slug]` | GET | Get article data + similar articles |
| `/api/review/[slug]` | POST | Submit reader review |
| `/api/ticker` | GET | Get headline ticker text |
| `/api/phone-images` | GET | List local phone images |

## Automated News Schedule

To run automatically, set up a cron job or use a service like:

**Vercel Cron (vercel.json):**
```json
{
  "crons": [
    {
      "path": "/api/fetch-news",
      "schedule": "0 */4 * * *"
    }
  ]
}
```

This fetches fresh news every 4 hours automatically.

## Deployment (Vercel – Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variables in Vercel dashboard
# then redeploy
vercel --prod
```

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Styling:** Tailwind CSS
- **AI:** Anthropic claude-sonnet-4 with web_search tool
- **Images:** Local phone images → Unsplash API → Picsum fallback
- **Storage:** File-based JSON (replace with PostgreSQL in production)
- **Fonts:** Playfair Display + Source Serif 4 + DM Sans

## AdSense Approval Checklist

Before applying for AdSense:
- [ ] 20-25 quality articles published
- [ ] Site is 10+ days old
- [ ] All required pages created ✓
- [ ] Clean navigation ✓
- [ ] Mobile responsive ✓
- [ ] No copied or thin content ✓
- [ ] Author page with bio ✓
- [ ] Contact form working ✓

## Google News Publisher Center

1. Go to [publishercenter.google.com](https://publishercenter.google.com)
2. Add your publication
3. Verify ownership via Google Search Console
4. Submit news sitemap: `https://techbharat.com/sitemap.xml`
5. Set category to Technology
