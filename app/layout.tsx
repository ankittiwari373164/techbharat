import type { Metadata } from 'next'
import './globals.css'
import { headers } from 'next/headers'
import Header from '@/components/Header'
import CookieConsent from '@/components/CookieConsent'
import Footer from '@/components/Footer'

const SITE_TITLE = "The Tech Bharat – India's Mobile Technology News"
const SITE_DESC  = 'The Tech Bharat delivers original mobile technology news, smartphone reviews, comparisons, and in-depth analysis for Indian readers.'

export async function generateMetadata(): Promise<Metadata> {
  let dynKeywords: string[] = ['mobile news India', 'smartphone reviews', 'tech news India', 'phone comparison India', 'best smartphones 2026']
  try {
    const { getPageSeo } = await import('@/lib/seo-store')
    const seo = await getPageSeo('home')
    if (seo?.keywords?.length) dynKeywords = seo.keywords
  } catch { /* use defaults */ }

  return {
    metadataBase: new URL('https://thetechbharat.com'),
    title: { template: '%s | The Tech Bharat', default: SITE_TITLE },
    description: SITE_DESC,
    keywords: dynKeywords,
    authors:   [{ name: 'The Tech Bharat Editorial Team' }],
    creator:   'The Tech Bharat',
    publisher: 'The Tech Bharat',
    openGraph: {
      type: 'website', locale: 'en_IN', url: 'https://thetechbharat.com',
      siteName: 'The Tech Bharat', title: SITE_TITLE, description: SITE_DESC,
      images: [{ url: '/og-image.jpg', width: 1200, height: 630 }],
    },
    twitter: { card: 'summary_large_image', site: '@thetechbharat', creator: '@thetechbharat', title: SITE_TITLE, description: SITE_DESC },
    robots: { index: true, follow: true, googleBot: { index: true, follow: true, 'max-image-preview': 'large' } },
    alternates: { canonical: 'https://thetechbharat.com' },
    icons: {
      icon:     [{ url: '/logo.png', type: 'image/png' }],
      apple:    [{ url: '/logo.png', sizes: '180x180', type: 'image/png' }],
      shortcut: [{ url: '/logo.png' }],
    },
  }
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
  } catch { /* use empty */ }

  return (
    <html lang="en">
      <head>
        {/* GA Consent Mode v2 — default denied until user accepts */}
        <script dangerouslySetInnerHTML={{ __html: `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('consent', 'default', {
            ad_storage: 'denied',
            analytics_storage: 'denied',
            wait_for_update: 500,
          });
        `}} />

        {/* Google Analytics GA4 */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-S7VTT9Z82Q" />
        <script dangerouslySetInnerHTML={{ __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-S7VTT9Z82Q');
          `}} />

        {/* Google AdSense */}
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4463674323364072"
          crossOrigin="anonymous"
        />

        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=Source+Serif+4:ital,opsz,wght@0,8..60,300;0,8..60,400;0,8..60,600;1,8..60,400&family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" />

        <link rel="icon" type="image/png" href="/logo.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/logo.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/logo.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/logo.png" />
        <link rel="shortcut icon" href="/logo.png" />
        <meta name="msapplication-TileImage" content="/logo.png" />
        <meta name="theme-color" content="#d4220a" />
        {/* Add your GSC verification: <meta name="google-site-verification" content="ACTUAL_CODE" /> */}
        <meta name="twitter:site" content="@thetechbharat" />
        <meta name="twitter:creator" content="@thetechbharat" />
        <meta name="twitter:card" content="summary_large_image" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "NewsMediaOrganization",
          "name": "The Tech Bharat",
          "alternateName": "TTB",
          "url": "https://thetechbharat.com",
          "logo": "https://thetechbharat.com/logo.png",
          "description": "India's independent mobile technology news publication covering smartphones, reviews, and comparisons for Indian buyers.",
          "foundingDate": "2025",
          "areaServed": "IN",
          "inLanguage": "en-IN",
          "sameAs": ["https://t.me/the_tech_bharat", "https://twitter.com/thetechbharat", "https://whatsapp.com/channel/0029VbCXZfAJJhzh46IrfI2W"],
          "masthead": "https://thetechbharat.com/about",
          "verificationFactCheckingPolicy": "https://thetechbharat.com/editorial-policy",
          "correctionsPolicy": "https://thetechbharat.com/corrections-policy"
        })}} />
      </head>
      <body suppressHydrationWarning className={`${isAdmin ? 'bg-gray-50' : 'bg-paper text-ink'} min-h-screen flex flex-col`}>
        {!isAdmin && <div id="reading-progress" style={{ width: '0%' }} />}
        {!isAdmin && <Header tickerItems={tickerItems} />}
        <main className="flex-1">{children}</main>
        {!isAdmin && <Footer />}

        {/* Reading progress bar script */}
        {!isAdmin && (
          <script dangerouslySetInnerHTML={{ __html: `
            window.addEventListener('scroll', () => {
              const s = window.scrollY, d = document.documentElement.scrollHeight - window.innerHeight;
              const b = document.getElementById('reading-progress');
              if (b) b.style.width = (d > 0 ? (s/d)*100 : 0) + '%';
            });
          `}} />
        )}

        {/* Cookie Consent Banner — GDPR/DPDP compliance */}
        {!isAdmin && <CookieConsent />}

      </body>
    </html>
  )
}