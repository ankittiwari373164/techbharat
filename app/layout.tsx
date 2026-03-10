import type { Metadata } from 'next'
import './globals.css'
import { headers } from 'next/headers'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export async function generateMetadata(): Promise<Metadata> {
  let dynamicSeo = null
  try {
    const { getPageSeo } = await import('@/lib/seo-store')
    dynamicSeo = await getPageSeo('home')
  } catch { /* fallback */ }

  const dynTitle = dynamicSeo?.title || "The Tech Bharat – India's Mobile Technology News"
  const dynDesc  = dynamicSeo?.description || 'The Tech Bharat delivers original mobile technology news, smartphone reviews, comparisons, and in-depth analysis for Indian readers.'
  const dynKw    = dynamicSeo?.keywords || ['mobile news India', 'smartphone reviews', 'tech news India', 'phone comparison']

  return {
    metadataBase: new URL('https://thetechbharat.com'),
    title: {
      template: '%s | The Tech Bharat',
      default: dynTitle,
    },
    description: dynDesc,
    keywords: dynKw,
  authors: [{ name: 'The Tech Bharat Editorial Team' }],
  creator: 'The Tech Bharat',
  publisher: 'The Tech Bharat',
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://thetechbharat.com',
    siteName: 'The Tech Bharat',
    title: "The Tech Bharat – India's Mobile Technology News",
    description: 'Latest mobile news, phone reviews, and smartphone comparisons for Indian readers.',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630 }],
  },
  twitter: { card: 'summary_large_image', site: '@techbharat' },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
  },
  alternates: { canonical: 'https://thetechbharat.com' },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // Detect admin routes server-side — hide site Header/Footer for admin
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
            "description": "India\'s independent mobile technology news publication covering smartphones, reviews, and comparisons for Indian buyers.",
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