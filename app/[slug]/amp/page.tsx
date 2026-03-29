// app/[slug]/amp/page.tsx
// AMP version of article pages — required for Google News/Discover eligibility
import { getAllArticlesAsync } from '@/lib/store'
import { notFound } from 'next/navigation'

const SITE_URL = process.env.SITE_URL || 'https://thetechbharat.com'

export async function generateStaticParams() {
  try {
    const articles = await getAllArticlesAsync() as any[]
    return articles.slice(0, 50).map(a => ({ slug: a.slug }))
  } catch { return [] }
}

export default async function ArticleAmpPage({ params }: { params: { slug: string } }) {
  let article: any = null
  try {
    const articles = await getAllArticlesAsync() as any[]
    article = articles.find(a => a.slug === params.slug)
  } catch {}

  if (!article) notFound()

  const title       = article.seoTitle || article.title || ''
  const description = article.seoDescription || article.summary || ''
  const image       = article.featuredImage || `${SITE_URL}/og-image.jpg`
  const canonical   = `${SITE_URL}/${article.slug}`
  const ampUrl      = `${SITE_URL}/${article.slug}/amp`
  const published   = article.publishDate || new Date().toISOString()
  const modified    = article.updatedDate || published

  // Strip non-AMP HTML from content
  const ampContent = (article.content || article.summary || '')
    .replace(/<script[^>]*>.*?<\/script>/gis, '')
    .replace(/<iframe[^>]*>.*?<\/iframe>/gis, '')
    .replace(/<style[^>]*>.*?<\/style>/gis, '')
    .replace(/style="[^"]*"/gi, '')
    .replace(/class="[^"]*"/gi, '')
    .replace(/<(img)[^>]*src="([^"]*)"[^>]*>/gi, (_: string, _tag: string, src: string) =>
      `<amp-img src="${src}" width="800" height="450" layout="responsive" alt="${title}"></amp-img>`)

  const schema = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: title,
    description,
    image: [image],
    datePublished: published,
    dateModified: modified,
    author: { '@type': 'Person', name: 'Vijay Yadav', url: `${SITE_URL}/author` },
    publisher: {
      '@type': 'Organization',
      name: 'The Tech Bharat',
      logo: { '@type': 'ImageObject', url: `${SITE_URL}/logo.png` }
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': canonical },
  })

  return (
    <html amp="" lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,minimum-scale=1,initial-scale=1" />
        <title>{title} | The Tech Bharat</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={canonical} />
        <link rel="amphtml" href={ampUrl} />
        {/* AMP boilerplate */}
        <style amp-boilerplate="">{`body{-webkit-animation:-amp-start 8s steps(1,end) 0s 1 normal both;-moz-animation:-amp-start 8s steps(1,end) 0s 1 normal both;-ms-animation:-amp-start 8s steps(1,end) 0s 1 normal both;animation:-amp-start 8s steps(1,end) 0s 1 normal both}@-webkit-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-moz-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-ms-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}`}</style>
        <noscript><style amp-boilerplate="">{`body{-webkit-animation:none;-moz-animation:none;-ms-animation:none;animation:none}`}</style></noscript>
        <script async src="https://cdn.ampproject.org/v0.js"></script>
        {/* AMP AdSense */}
        <script async custom-element="amp-ad" src="https://cdn.ampproject.org/v0/amp-ad-0.1.js"></script>
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
          .content table { width: 100%; border-collapse: collapse; margin: 16px 0; font-family: sans-serif; font-size: 13px; }
          .content th { background: #1a3a5c; color: white; padding: 8px; text-align: left; }
          .content td { border: 1px solid #ddd; padding: 8px; }
          .content tr:nth-child(even) td { background: #f9f9f9; }
          .source-note { background: #f8f4ef; border-left: 3px solid #d4220a; padding: 10px 14px; margin: 16px 0; font-size: 13px; color: #555; font-family: sans-serif; }
          .read-more { display: block; background: #d4220a; color: white; text-align: center; padding: 14px; font-family: sans-serif; font-weight: bold; text-decoration: none; margin: 20px 0; border-radius: 4px; }
          .ad-wrapper { margin: 20px 0; }
        `}</style>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: schema }} />
      </head>
      <body>
        <div className="brand-bar">
          <a href={SITE_URL}>The Tech Bharat — India's Mobile Authority</a>
        </div>
        <div className="container">
          <h1>{title}</h1>
          <div className="meta">
            By Vijay Yadav · The Tech Bharat · {new Date(published).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
          </div>

          {/* Featured image */}
          {image && (
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
            <amp-ad
              width="100vw"
              height="320"
              type="adsense"
              data-ad-client="ca-pub-4463674323364072"
              data-ad-slot="auto"
              data-auto-format="rspv"
              data-full-width="">
              <div overflow=""></div>
            </amp-ad>
          </div>

          {/* Article content */}
          <div
            className="content"
            dangerouslySetInnerHTML={{ __html: ampContent }}
          />

          {/* Bottom AdSense ad */}
          <div className="ad-wrapper">
            <amp-ad
              width="100vw"
              height="320"
              type="adsense"
              data-ad-client="ca-pub-4463674323364072"
              data-ad-slot="auto"
              data-auto-format="rspv"
              data-full-width="">
              <div overflow=""></div>
            </amp-ad>
          </div>

          <a href={canonical} className="read-more">Read Full Article on The Tech Bharat →</a>
        </div>
      </body>
    </html>
  )
}