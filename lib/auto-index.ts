// lib/auto-index.ts
// Call this after every article publish to trigger Google Indexing API + sitemap ping
// Works even without GOOGLE_INDEXING_SA_KEY (falls back to sitemap ping only)

const SITE_URL = process.env.SITE_URL || 'https://thetechbharat.com'
const CRON_SECRET = process.env.CRON_SECRET || ''

/**
 * Push a freshly published article to Google Indexing API.
 * Call this right after addArticleAsync() in your scheduler/fetch routes.
 *
 * @param slug - article slug (e.g. "samsung-galaxy-s25-review")
 */
export async function autoIndexArticle(slug: string): Promise<void> {
  // Clean slug — ensure no /article/ prefix
  const cleanSlug = slug.replace(/^\/article\//, '').replace(/^\//, '')
  const canonicalUrl = `${SITE_URL}/${cleanSlug}`

  try {
    const secret = CRON_SECRET ? `?secret=${encodeURIComponent(CRON_SECRET)}` : ''
    await fetch(`${SITE_URL}/api/index-url${secret}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ urls: [canonicalUrl] }),
    })
    console.log(`[AutoIndex] Pushed: ${canonicalUrl}`)
  } catch (e) {
    // Non-fatal — article is published regardless
    console.warn('[AutoIndex] Failed to push to indexing API:', e)
  }

  // Also ping sitemap (free, no quota)
  try {
    await fetch(`${SITE_URL}/api/ping-sitemap`)
  } catch { /* non-fatal */ }
}

/**
 * Push multiple slugs at once (e.g. after bulk publish)
 */
export async function autoIndexArticles(slugs: string[]): Promise<void> {
  const urls = slugs.map(s => {
    const clean = s.replace(/^\/article\//, '').replace(/^\//, '')
    return `${SITE_URL}/${clean}`
  })

  try {
    const secret = CRON_SECRET ? `?secret=${encodeURIComponent(CRON_SECRET)}` : ''
    await fetch(`${SITE_URL}/api/index-url${secret}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ urls }),
    })
    console.log(`[AutoIndex] Pushed ${urls.length} URLs`)
  } catch (e) {
    console.warn('[AutoIndex] Bulk push failed:', e)
  }

  try {
    await fetch(`${SITE_URL}/api/ping-sitemap`)
  } catch { /* non-fatal */ }
}