// app/web-stories/[slug]/amp/page.tsx
// AMP version of web stories — required for Google Web Stories carousel
import { getPublishedStoriesAsync } from '@/lib/stories-store'
import { notFound } from 'next/navigation'

const SITE_URL = process.env.SITE_URL || 'https://thetechbharat.com'

export async function generateStaticParams() {
  try {
    const stories = await getPublishedStoriesAsync()
    return stories.map(s => ({ slug: s.slug }))
  } catch { return [] }
}

export default async function WebStoryAmpPage({ params }: { params: { slug: string } }) {
  let story: any = null
  try {
    const stories = await getPublishedStoriesAsync()
    story = stories.find(s => s.slug === params.slug)
  } catch {}

  if (!story) notFound()

  const canonical = `${SITE_URL}/web-stories/${story.slug}`
  const ampUrl    = `${SITE_URL}/web-stories/${story.slug}/amp`

  const schema = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: story.title,
    image: story.coverImage ? [story.coverImage] : [],
    datePublished: story.publishDate,
    author: { '@type': 'Person', name: 'Vijay Yadav' },
    publisher: { '@type': 'Organization', name: 'The Tech Bharat', logo: { '@type': 'ImageObject', url: `${SITE_URL}/logo.png` } },
  })

  return (
    <html amp="amp" lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,minimum-scale=1,initial-scale=1" />
        <title>{story.title} | The Tech Bharat</title>
        <link rel="canonical" href={canonical} />
        <link rel="amphtml" href={ampUrl} />
        <style amp-boilerplate="">{`body{-webkit-animation:-amp-start 8s steps(1,end) 0s 1 normal both;-moz-animation:-amp-start 8s steps(1,end) 0s 1 normal both;-ms-animation:-amp-start 8s steps(1,end) 0s 1 normal both;animation:-amp-start 8s steps(1,end) 0s 1 normal both}@-webkit-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-moz-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-ms-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}`}</style>
        <noscript><style amp-boilerplate="">{`body{-webkit-animation:none;-moz-animation:none;-ms-animation:none;animation:none}`}</style></noscript>
        <script async src="https://cdn.ampproject.org/v0.js"></script>
        <script async custom-element="amp-story" src="https://cdn.ampproject.org/v0/amp-story-1.0.js"></script>
        <script async custom-element="amp-video" src="https://cdn.ampproject.org/v0/amp-video-0.1.js"></script>
        <style amp-custom>{`
          amp-story-page { background: #0d0d0d; }
          .headline { font-family: Georgia, serif; font-size: 28px; font-weight: bold; color: white; line-height: 1.3; }
          .body-text { font-family: sans-serif; font-size: 16px; color: rgba(255,255,255,0.9); line-height: 1.6; }
          .brand { font-family: sans-serif; font-size: 12px; color: rgba(255,255,255,0.7); text-transform: uppercase; letter-spacing: 1px; }
          .cta-btn { background: #d4220a; color: white; font-family: sans-serif; font-weight: bold; padding: 12px 24px; border-radius: 24px; text-decoration: none; display: inline-block; font-size: 15px; }
        `}</style>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: schema }} />
      </head>
      <body>
        <amp-story
          standalone=""
          title={story.title}
          publisher="The Tech Bharat"
          publisher-logo-src={`${SITE_URL}/logo.png`}
          poster-portrait-src={story.coverImage || `${SITE_URL}/og-image.jpg`}
          poster-square-src={story.coverImage || `${SITE_URL}/og-image.jpg`}
          poster-landscape-src={story.coverImage || `${SITE_URL}/og-image.jpg`}
          canonical={canonical}
        >
          {story.slides.map((slide: any, i: number) => (
            <amp-story-page key={slide.id || i} id={`slide-${i}`}>
              <amp-story-grid-layer template="fill">
                {slide.imageUrl ? (
                  <amp-img
                    src={slide.imageUrl}
                    width="720"
                    height="1280"
                    layout="fill"
                    object-fit="cover"
                    alt={slide.headline || story.title}
                  />
                ) : (
                  <div style={{ background: 'linear-gradient(135deg, #1a3a5c 0%, #0d0d0d 100%)', width: '100%', height: '100%' }} />
                )}
              </amp-story-grid-layer>

              {/* Dark overlay */}
              <amp-story-grid-layer template="fill">
                <div style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.3) 60%, rgba(0,0,0,0.5) 100%)', width: '100%', height: '100%' }} />
              </amp-story-grid-layer>

              {/* Progress + Brand header */}
              <amp-story-grid-layer template="vertical" style={{ padding: '60px 20px 0' }}>
                <div className="brand">The Tech Bharat · {story.brand}</div>
              </amp-story-grid-layer>

              {/* Bottom content */}
              <amp-story-grid-layer template="vertical" style={{ justifyContent: 'flex-end', padding: '0 20px 40px' }}>
                {slide.headline && <h2 className="headline">{slide.headline}</h2>}
                {slide.body && <p className="body-text" style={{ marginTop: '12px' }}>{slide.body}</p>}
                {slide.ctaText && slide.ctaLink && (
                  <a href={slide.ctaLink} className="cta-btn" style={{ marginTop: '20px' }}>
                    {slide.ctaText} →
                  </a>
                )}
                <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '11px', marginTop: '16px', fontFamily: 'sans-serif' }}>
                  {i + 1} / {story.slides.length}
                </p>
              </amp-story-grid-layer>
            </amp-story-page>
          ))}

          {/* Bookend — shows related content at story end */}
          <amp-story-bookend src={`${SITE_URL}/api/stories/bookend`} layout="nodisplay" />
        </amp-story>
      </body>
    </html>
  )
}