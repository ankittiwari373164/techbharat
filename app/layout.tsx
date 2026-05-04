// app/layout.tsx
// =====================================================================
//  PATCHED FOR ADSENSE & GOOGLE INDEXING
// ---------------------------------------------------------------------
//  KEY FIXES (vs previous version):
//   1. ADDED WebSite + SearchAction JSON-LD (sitelinks search box).
//   2. ADDED Organization JSON-LD with full sameAs + contactPoint.
//   3. AdSense script still loads (required for AdSense crawler) BUT
//      we only enable personalized ads after consent. Consent Mode v2
//      handles this — ad_storage is denied by default until user
//      accepts cookies, so ads show but non-personalised.
//   4. Removed orphan twitter:* meta tags that duplicate <Metadata>.
//   5. Tightened the GA Consent Mode default — ads_data_redaction +
//      ad_user_data + ad_personalization for Google's new spec.
//   6. Added preload for the AdSense script so it's discovered early.
//   7. <html lang="en-IN"> for India locale signal.
// =====================================================================
import type { Metadata, Viewport } from 'next'
import './globals.css'
import { headers } from 'next/headers'
import Header from '@/components/Header'
import CookieConsent from '@/components/CookieConsent'
import Footer from '@/components/Footer'

const SITE_TITLE = "The Tech Bharat – India's Mobile Technology News"
const SITE_DESC  = 'The Tech Bharat delivers original mobile technology news, smartphone reviews, comparisons, and in-depth analysis for Indian readers.'
const SITE_URL   = 'https://thetechbharat.com'

export async function generateMetadata(): Promise<Metadata> {
  let dynKeywords: string[] = [
    'mobile news India', 'smartphone reviews', 'tech news India',
    'phone comparison India', 'best smartphones 2026', 'mobile launches India',
  ]
  try {
    const { getPageSeo } = await import('@/lib/seo-store')
    const seo = await getPageSeo('home')
    if (seo?.keywords?.length) dynKeywords = seo.keywords
  } catch { /* defaults */ }

  return {
    metadataBase: new URL(SITE_URL),
    title: { template: '%s | The Tech Bharat', default: SITE_TITLE },
    description: SITE_DESC,
    keywords: dynKeywords,
    authors:   [{ name: 'The Tech Bharat Editorial Team', url: `${SITE_URL}/author` }],
    creator:   'The Tech Bharat',
    publisher: 'The Tech Bharat',
    applicationName: 'The Tech Bharat',
    referrer: 'origin-when-cross-origin',
    formatDetection: { email: false, address: false, telephone: false },

    openGraph: {
      type: 'website',
      locale: 'en_IN',
      url: SITE_URL,
      siteName: 'The Tech Bharat',
      title: SITE_TITLE,
      description: SITE_DESC,
      images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'The Tech Bharat' }],
    },

    twitter: {
      card: 'summary_large_image',
      site: '@thetechbharat',
      creator: '@thetechbharat',
      title: SITE_TITLE,
      description: SITE_DESC,
      images: ['/og-image.jpg'],
    },

    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-image-preview': 'large',
        'max-snippet': -1,
        'max-video-preview': -1,
      },
    },

    alternates: { canonical: SITE_URL },

    icons: {
      icon:     [{ url: '/logo.png', type: 'image/png' }],
      apple:    [{ url: '/logo.png', sizes: '180x180', type: 'image/png' }],
      shortcut: [{ url: '/logo.png' }],
    },

    verification: {
      // ⚠️  Replace this with the real GSC verification code from
      //     Search Console → Settings → Ownership verification.
      //     Leaving an empty string is safer than a placeholder.
      google: process.env.GSC_VERIFICATION || '',
    },
  }
}

export const viewport: Viewport = {
  themeColor: '#d4220a',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const headersList = headers()
  const pathname    = headersList.get('x-pathname') ||
                      headersList.get('next-url') ||
                      headersList.get('x-invoke-path') || ''

  const isAdmin = pathname.startsWith('/admin')

  let tickerItems: string[] = []
  try {
    const { getAllArticlesAsync } = await import('@/lib/store')
    const articles = await getAllArticlesAsync() as { title: string; brand: string }[]
    tickerItems = articles.slice(0, 8).map(a => `${a.brand}: ${a.title}`)
  } catch { /* empty */ }

  // ─── Site-wide schemas (server-rendered) ─────────────────────────
  const orgSchema = {
    '@context': 'https://schema.org',
    '@type': 'NewsMediaOrganization',
    '@id': `${SITE_URL}/#organization`,
    name: 'The Tech Bharat',
    alternateName: 'TTB',
    url: SITE_URL,
    logo: {
      '@type': 'ImageObject',
      url: `${SITE_URL}/logo.png`,
      width: 600,
      height: 60,
    },
    description: "India's independent mobile technology news publication covering smartphones, reviews, and comparisons for Indian buyers.",
    foundingDate: '2025',
    areaServed: { '@type': 'Country', name: 'India' },
    inLanguage: 'en-IN',
    sameAs: [
      'https://t.me/the_tech_bharat',
      'https://twitter.com/thetechbharat',
      'https://whatsapp.com/channel/0029VbCXZfAJJhzh46IrfI2W',
      'https://www.linkedin.com/company/the-tech-bharat',
    ],
    masthead: `${SITE_URL}/about`,
    diversityPolicy: `${SITE_URL}/editorial-policy`,
    ethicsPolicy: `${SITE_URL}/editorial-policy`,
    correctionsPolicy: `${SITE_URL}/corrections-policy`,
    verificationFactCheckingPolicy: `${SITE_URL}/editorial-policy`,
    contactPoint: [{
      '@type': 'ContactPoint',
      contactType: 'editorial',
      email: 'editorial@thetechbharat.com',
      availableLanguage: ['English', 'Hindi'],
    }],
  }

  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE_URL}/#website`,
    url: SITE_URL,
    name: 'The Tech Bharat',
    description: SITE_DESC,
    publisher: { '@id': `${SITE_URL}/#organization` },
    inLanguage: 'en-IN',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SITE_URL}/mobile-news?brand={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  }

  return (
    <html lang="en-IN">
      <head>
        {/* ─── GA Consent Mode v2 — denied by default ──────────── */}
        <script dangerouslySetInnerHTML={{ __html: `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('consent', 'default', {
            ad_storage: 'denied',
            ad_user_data: 'denied',
            ad_personalization: 'denied',
            analytics_storage: 'denied',
            functionality_storage: 'granted',
            security_storage: 'granted',
            wait_for_update: 500
          });
          gtag('set', 'ads_data_redaction', true);
          gtag('set', 'url_passthrough', true);
        `}} />

        {/* ─── Google Analytics GA4 ────────────────────────────── */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-S7VTT9Z82Q" />
        <script dangerouslySetInnerHTML={{ __html: `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-S7VTT9Z82Q', { anonymize_ip: true });
        `}} />

        {/* ─── Google AdSense (preloaded + async) ──────────────── */}
        <link
          rel="preconnect"
          href="https://pagead2.googlesyndication.com"
          crossOrigin="anonymous"
        />
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4463674323364072"
          crossOrigin="anonymous"
        />

        {/* ─── Fonts ───────────────────────────────────────────── */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=Source+Serif+4:ital,opsz,wght@0,8..60,300;0,8..60,400;0,8..60,600;1,8..60,400&family=DM+Sans:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />

        {/* ─── Favicons ────────────────────────────────────────── */}
        <link rel="icon" type="image/png" href="/logo.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/logo.png" />
        <meta name="msapplication-TileImage" content="/logo.png" />

        {/* ─── Site-wide JSON-LD ───────────────────────────────── */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
      </head>

      <body
        suppressHydrationWarning
        className={`${isAdmin ? 'bg-gray-50' : 'bg-paper text-ink'} min-h-screen flex flex-col`}
      >
        {!isAdmin && <div id="reading-progress" style={{ width: '0%' }} />}
        {!isAdmin && <Header tickerItems={tickerItems} />}

        <main className="flex-1">{children}</main>

        {!isAdmin && <Footer />}

        {/* Reading progress bar */}
        {!isAdmin && (
          <script dangerouslySetInnerHTML={{ __html: `
            window.addEventListener('scroll', () => {
              const s = window.scrollY, d = document.documentElement.scrollHeight - window.innerHeight;
              const b = document.getElementById('reading-progress');
              if (b) b.style.width = (d > 0 ? (s/d)*100 : 0) + '%';
            }, { passive: true });
          `}} />
        )}

        {/* DPDP / GDPR cookie consent */}
        {!isAdmin && <CookieConsent />}
      </body>
    </html>
  )
}
