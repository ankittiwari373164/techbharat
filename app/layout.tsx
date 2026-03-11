import type { Metadata } from 'next'
import './globals.css'
import { headers } from 'next/headers'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

// Fixed — never change
const SITE_TITLE = "The Tech Bharat – India's Mobile Technology News"
const SITE_DESC  = 'The Tech Bharat delivers original mobile technology news, smartphone reviews, comparisons, and in-depth analysis for Indian readers.'

export async function generateMetadata(): Promise<Metadata> {
  // Only keywords are dynamic — updated every 20h with Google Trends
  let dynKeywords: string[] = ['mobile news India', 'smartphone reviews', 'tech news India', 'phone comparison India', 'best smartphones 2026']
  try {
    const { getPageSeo } = await import('@/lib/seo-store')
    const seo = await getPageSeo('home')
    if (seo?.keywords?.length) dynKeywords = seo.keywords
  } catch { /* use defaults */ }

  return {
    metadataBase: new URL('https://thetechbharat.com'),
    title: {
      template: '%s | The Tech Bharat',
      default: SITE_TITLE,
    },
    description: SITE_DESC,
    keywords: dynKeywords,
    authors:   [{ name: 'The Tech Bharat Editorial Team' }],
    creator:   'The Tech Bharat',
    publisher: 'The Tech Bharat',
    openGraph: {
      type:        'website',
      locale:      'en_IN',
      url:         'https://thetechbharat.com',
      siteName:    'The Tech Bharat',
      title:       SITE_TITLE,
      description: SITE_DESC,
      images: [{ url: '/og-image.jpg', width: 1200, height: 630 }],
    },
    twitter: { card: 'summary_large_image', site: '@techbharat' },
    robots: {
      index:  true,
      follow: true,
      googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
    },
    // NOTE: No global canonical here — each page sets its own via alternates.canonical
    // Setting a canonical at root layout level was causing ALL pages (including articles)
    // to report canonical = homepage, which blocked Google from indexing them.
  }
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const headersList = headers()
  const pathname    = headersList.get('x-pathname') ||
                      headersList.get('next-url') ||
                      headersList.get('x-invoke-path') || ''

  const isAdmin = pathname.startsWith('/admin')

  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=Source+Serif+4:ital,opsz,wght@0,8..60,300;0,8..60,400;0,8..60,600;1,8..60,400&family=DM+Sans:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <link rel="icon" href="/favicon.ico" />
        <meta name="google-site-verification" content="YOUR_VERIFICATION_CODE" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify({
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
            "sameAs": [
              "https://t.me/techbharat",
              "https://twitter.com/techbharat"
            ],
            "masthead": "https://thetechbharat.com/about",
            "verificationFactCheckingPolicy": "https://thetechbharat.com/editorial-policy",
            "correctionsPolicy": "https://thetechbharat.com/corrections-policy"
          })}}
        />
      </head>
      <body className={`${isAdmin ? 'bg-gray-50' : 'bg-paper text-ink'} min-h-screen flex flex-col`}>
        {!isAdmin && <div id="reading-progress" style={{ width: '0%' }} />}
        {!isAdmin && <Header />}
        <main className="flex-1">{children}</main>
        {!isAdmin && <Footer />}
        {!isAdmin && (
          <script
            dangerouslySetInnerHTML={{
              __html: `
                window.addEventListener('scroll', () => {
                  const s = window.scrollY, d = document.documentElement.scrollHeight - window.innerHeight;
                  const b = document.getElementById('reading-progress');
                  if (b) b.style.width = (d > 0 ? (s/d)*100 : 0) + '%';
                });
              `,
            }}
          />
        )}
      </body>
    </html>
  )
}