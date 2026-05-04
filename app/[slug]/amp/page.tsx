// app/[slug]/amp/page.tsx
// =====================================================================
//  PATCHED — AMP version of article pages
// ---------------------------------------------------------------------
//  KEY FIXES (vs previous version):
//   1. FIXED broken regex replace at line ~46:
//        Previous code used  arguments[1]  inside an arrow function,
//        which doesn't work — arrow functions don't have `arguments`.
//        Result: <img> tags were NOT being converted to <amp-img>,
//        breaking AMP validation entirely.
//      New code uses a proper capture-group replacer.
//   2. Strip <a> tags' onclick / target=_self issues (AMP rules).
//   3. Added rel="canonical" properly pointing to the non-AMP page.
//   4. Removed empty data-ad-slot="auto" — AMP rejects it.
//      Replaced with a real ad slot value (placeholder you must fill).
//   5. Added publisher logo + masthead → Google News compliance.
//   6. Added meta robots index,follow on AMP page.
// =====================================================================
import { getAllArticlesAsync } from '@/lib/store'
import { notFound } from 'next/navigation'

export const dynamic = 'force-dynamic'

const SITE_URL = process.env.SITE_URL || 'https://thetechbharat.com'

export async function generateStaticParams() {
  try {
    const articles = await getAllArticlesAsync() as any[]
    return articles.slice(0, 50).map(a => ({ slug: a.slug }))
  } catch { return [] }
}

// ---------------------------------------------------------------------
//  AMP-safe content sanitiser
// ---------------------------------------------------------------------
function sanitizeForAmp(html: string, altText: string): string {
  if (!html) return ''
  let out = html

  // Remove disallowed AMP elements
  out = out.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
  out = out.replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
  out = out.replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
  out = out.replace(/<noscript\b[^<]*(?:(?!<\/noscript>)<[^<]*)*<\/noscript>/gi, '')
  out = out.replace(/<form\b[^<]*(?:(?!<\/form>)<[^<]*)*<\/form>/gi, '')

  // Strip inline styles + classes (AMP requires its own stylesheet)
  out = out.replace(/\s*style="[^"]*"/gi, '')
  out = out.replace(/\s*class="[^"]*"/gi, '')
  out = out.replace(/\s*onclick="[^"]*"/gi, '')
  out = out.replace(/\s*onerror="[^"]*"/gi, '')

  // ✅ FIXED: Replace <img> with <amp-img> using proper regex callback
  // (Previous code used arguments[1] in arrow func — broken.)
  out = out.replace(
    /<img\b([^>]*?)\s+src="([^"]*)"([^>]*?)\/?>/gi,
    (_match, _pre, src, _post) => {
      const safeAlt = altText.replace(/"/g, '&quot;')
      return `<amp-img src="${src}" width="800" height="450" layout="responsive" alt="${safeAlt}"></amp-img>`
    }
  )
  // Catch <img src="..." with src first
  out = out.replace(
    /<img\s+src="([^"]*)"([^>]*?)\/?>/gi,
    (_match, src, _post) => {
      const safeAlt = altText.replace(/"/g, '&quot;')
      return `<amp-img src="${src}" width="800" height="450" layout="responsive" alt="${safeAlt}"></amp-img>`
    }
  )

  // AMP requires target="_blank" links to have rel="noopener"
  out = out.replace(/<a\s+([^>]*?)target="_blank"([^>]*?)>/gi, (_m, pre, post) => {
    const combined = (pre + post).replace(/rel="[^"]*"/i, '')
    return `<a ${combined} target="_blank" rel="noopener noreferrer">`
  })

  return out
}

// ---------------------------------------------------------------------
//  PAGE
// ---------------------------------------------------------------------
export default async function ArticleAmpPage({ params }: { params: { slug: string } }) {
  let article: any = null
  try {
    const articles = await getAllArticlesAsync() as any[]
    article = articles.find(a => a.slug === params.slug)
  } catch {}

  if (!article) notFound()

  const title       = (article.seoTitle || article.title || '').replace(/\s*\|\s*The Tech Bharat\s*$/i, '').trim()
  const description = article.seoDescription || article.summary || ''
  const image       = article.featuredImage || `${SITE_URL}/og-image.jpg`
  const canonical   = `${SITE_URL}/${article.slug}`
  const ampUrl      = `${SITE_URL}/${article.slug}/amp`
  const published   = article.publishDate || new Date().toISOString()
  const modified    = article.updatedDate || published

  const ampContent  = sanitizeForAmp(article.content || article.summary || '', title)

  const schema = JSON.stringify({
    '@context': 'https://schema.org',
    '@type':    'NewsArticle',
    headline:    title.slice(0, 110),
    description,
    image:       [image],
    datePublished: published,
    dateModified:  modified,
    author: {
      '@type': 'Person',
      name:    article.author || 'Vijay Yadav',
      url:     `${SITE_URL}/author`,
    },
    publisher: {
      '@type': 'NewsMediaOrganization',
      name:    'The Tech Bharat',
      url:     SITE_URL,
      logo: {
        '@type': 'ImageObject',
        url:     `${SITE_URL}/logo.png`,
        width:   600,
        height:  60,
      },
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': canonical },
    inLanguage:       'en-IN',
    isAccessibleForFree: true,
  })

  return (
    <html amp="" lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,minimum-scale=1,initial-scale=1" />
        <title>{title} | The Tech Bharat</title>
        <meta name="description" content={description} />
        <meta name="robots" content="index, follow, max-image-preview:large" />
        <link rel="canonical" href={canonical} />

        {/* AMP boilerplate */}
        <style amp-boilerplate="">{`body{-webkit-animation:-amp-start 8s steps(1,end) 0s 1 normal both;-moz-animation:-amp-start 8s steps(1,end) 0s 1 normal both;-ms-animation:-amp-start 8s steps(1,end) 0s 1 normal both;animation:-amp-start 8s steps(1,end) 0s 1 normal both}@-webkit-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-moz-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-ms-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}`}</style>
        <noscript><style amp-boilerplate="">{`body{-webkit-animation:none;-moz-animation:none;-ms-animation:none;animation:none}`}</style></noscript>

        <script async src="https://cdn.ampproject.org/v0.js"></script>
        <script async custom-element="amp-ad" src="https://cdn.ampproject.org/v0/amp-ad-0.1.js"></script>
        <script async custom-element="amp-analytics" src="https://cdn.ampproject.org/v0/amp-analytics-0.1.js"></script>

        <style amp-custom>{`
          body { font-family: Georgia, serif; margin: 0; padding: 0; color: #1a1a1a; background: #faf9f7; }
          .container { max-width: 720px; margin: 0 auto; padding: 16px; }
          .brand-bar { background: #d4220a; color: white; padding: 10px 16px; font-family: sans-serif; font-size: 13px; font-weight: bold; }
          .brand-bar a { color: white; text-decoration: none; }
          h1 { font-size: 28px; line-height: 1.3; margin: 16px 0; font-family: Georgia, serif; }
          .meta { font-size: 12px; color: #666; font-family: sans-serif; margin-bottom: 16px; }
          .summary { font-size: 16px; line-height: 1.7; color: #333; background: #f0f4f8; padding: 14px; border-left: 4px solid #1a3a5c; margin-bottom: 20px; }
          .content { font-size: 16px; line-height: 1.8; }
          .content h2 { font-size: 22px; margin: 24px 0 12px; border-bottom: 2px solid #d4220a; padding-bottom: 6px; }
          .content h3 { font-size: 18px; margin: 20px 0 10px; }
          .content p { margin: 0 0 16px; }
          .content a { color: #d4220a; text-decoration: underline; }
          .content table { width: 100%; border-collapse: collapse; margin: 16px 0; font-family: sans-serif; font-size: 13px; }
          .content th { background: #1a3a5c; color: white; padding: 8px; text-align: left; }
          .content td { border: 1px solid #ddd; padding: 8px; }
          .content tr:nth-child(even) td { background: #f9f9f9; }
          .read-more { display: block; background: #d4220a; color: white; text-align: center; padding: 14px; font-family: sans-serif; font-weight: bold; text-decoration: none; margin: 20px 0; border-radius: 4px; }
          .ad-wrapper { margin: 20px 0; text-align: center; }
          .author-box { background: #fff; border: 1px solid #ddd; padding: 14px; margin: 24px 0; font-family: sans-serif; font-size: 13px; border-radius: 6px; }
          .author-box strong { color: #d4220a; }
        `}</style>

        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: schema }} />
      </head>
      <body>
        <div className="brand-bar">
          <a href={SITE_URL}>The Tech Bharat — India&rsquo;s Mobile Authority</a>
        </div>

        <div className="container">
          <h1>{title}</h1>

          <div className="meta">
            By {article.author || 'Vijay Yadav'} · The Tech Bharat ·{' '}
            {new Date(published).toLocaleDateString('en-IN', {
              day: 'numeric', month: 'long', year: 'numeric',
            })}
          </div>

          {/* Featured image */}
          {image && (
            // @ts-ignore — amp-img is a custom element
            <amp-img
              src={image}
              width="800"
              height="450"
              layout="responsive"
              alt={title}
            />
          )}

          {/* Summary */}
          {article.summary && (
            <div className="summary">{article.summary}</div>
          )}

          {/* Top AdSense ad */}
          <div className="ad-wrapper">
            {/* @ts-ignore */}
            <amp-ad
              width="300"
              height="250"
              type="adsense"
              data-ad-client="ca-pub-4463674323364072"
              data-ad-slot="REPLACE_WITH_REAL_AD_SLOT_ID"
            />
          </div>

          {/* Article content */}
          <div
            className="content"
            dangerouslySetInnerHTML={{ __html: ampContent }}
          />

          {/* Author box */}
          <div className="author-box">
            <strong>About the Author:</strong> {article.author || 'Vijay Yadav'} is a Senior Mobile Technology Editor at The Tech Bharat with 11+ years covering the Indian smartphone market. Based in New Delhi.
          </div>

          {/* Bottom AdSense ad */}
          <div className="ad-wrapper">
            {/* @ts-ignore */}
            <amp-ad
              width="300"
              height="250"
              type="adsense"
              data-ad-client="ca-pub-4463674323364072"
              data-ad-slot="REPLACE_WITH_REAL_AD_SLOT_ID"
            />
          </div>

          <a href={canonical} className="read-more">
            Read Full Article on The Tech Bharat &rarr;
          </a>
        </div>
      </body>
    </html>
  )
}
