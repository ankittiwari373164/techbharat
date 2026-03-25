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
    twitter: { card: 'summary_large_image', site: '@thetechbharat', creator: '@thetechbharat', title: SITE_TITLE, description: SITE_DESC },
    robots: {
      index:  true,
      follow: true,
      googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
    },
    alternates: { canonical: 'https://thetechbharat.com' },
    icons: {
      icon:        [{ url: '/logo.png', type: 'image/png' }],
      apple:       [{ url: '/logo.png', sizes: '180x180', type: 'image/png' }],
      shortcut:    [{ url: '/logo.png' }],
    },
  }
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const headersList = headers()
  const pathname    = headersList.get('x-pathname') ||
                      headersList.get('next-url') ||
                      headersList.get('x-invoke-path') || ''

  const isAdmin = pathname.startsWith('/admin')

  // Fetch latest article titles server-side for ticker — Googlebot sees real headlines
  let tickerItems: string[] = []
  try {
    const { getAllArticlesAsync } = await import('@/lib/store')
    const articles = await getAllArticlesAsync() as { title: string; brand: string }[]
    tickerItems = articles
      .slice(0, 8)
      .map(a => `${a.brand}: ${a.title}`)
  } catch { /* use empty */ }

  return (
    <html lang="en">
      <head>
      {/* Google Analytics GA4 */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-S7VTT9Z82Q" />
        <script
          dangerouslySetInnerHTML={{ __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-S7VTT9Z82Q');
          `}}
        />

        {/* Google AdSense */}
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4463674323364072"
          crossOrigin="anonymous"
        />
                <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=Source+Serif+4:ital,opsz,wght@0,8..60,300;0,8..60,400;0,8..60,600;1,8..60,400&family=DM+Sans:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        {/* Favicon — using logo.png for all sizes */}
        <link rel="icon" type="image/png" href="/logo.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/logo.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/logo.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/logo.png" />
        <link rel="shortcut icon" href="/logo.png" />
        <meta name="msapplication-TileImage" content="/logo.png" />
        <meta name="theme-color" content="#d4220a" />
        <meta name="google-site-verification" content="YOUR_VERIFICATION_CODE" />
        {/* Fix: max-image-preview:large for Google Discover large image cards */}
        <meta name="robots" content="max-image-preview:large" />
        {/* Fix: Twitter card complete */}
        <meta name="twitter:site" content="@thetechbharat" />
        <meta name="twitter:creator" content="@thetechbharat" />
        <meta name="twitter:card" content="summary_large_image" />
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
      <body suppressHydrationWarning className={`${isAdmin ? 'bg-gray-50' : 'bg-paper text-ink'} min-h-screen flex flex-col`}>
        {!isAdmin && <div id="reading-progress" style={{ width: '0%' }} />}
        {!isAdmin && <Header tickerItems={tickerItems} />}
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
        {!isAdmin && (
          <script
            dangerouslySetInnerHTML={{ __html: `
(function(){
  "use strict";

  // 1. Disable right-click
  document.addEventListener("contextmenu",function(e){e.preventDefault();return false;});

  // 2. Disable text selection + image drag via CSS (handled via static <style> in <head>)

  // 3. Block copy / cut
  document.addEventListener("copy",function(e){e.preventDefault();return false;});
  document.addEventListener("cut",function(e){e.preventDefault();return false;});

  // 4. Block image drag
  document.addEventListener("dragstart",function(e){if(e.target.tagName==="IMG"){e.preventDefault();return false;}});

  // 5. Block keyboard shortcuts (F12, Ctrl+U/S/C/A/P/I/J, Ctrl+Shift+I/J/C)
  document.addEventListener("keydown",function(e){
    if(e.key==="F12"||e.keyCode===123){e.preventDefault();return false;}
    if(e.ctrlKey||e.metaKey){
      if(["u","U","s","S","c","C","a","A","p","P","i","I","j","J"].includes(e.key)){e.preventDefault();return false;}
      if(e.shiftKey&&["i","I","j","J","c","C"].includes(e.key)){e.preventDefault();return false;}
    }
  });

  // 6. DevTools size-change detection
  var _open=false,_thr=160;
  function _chk(){
    var w=window.outerWidth-window.innerWidth,h=window.outerHeight-window.innerHeight;
    if(w>_thr||h>_thr){if(!_open){_open=true;_show();}}else{_open=false;}
  }
  setInterval(_chk,1000);

  // 7. Debugger trap
  setInterval(function(){(function(){return false;}["constructor"]("debugger")["call"]());},4000);

  // 8. Warning overlay
  function _show(){
    if(document.getElementById("__po")) return;
    var o=document.createElement("div");
    o.id="__po";
    o.style.cssText="position:fixed;top:0;left:0;width:100vw;height:100vh;background:rgba(0,0,0,0.92);color:#fff;display:flex;flex-direction:column;align-items:center;justify-content:center;z-index:999999;font-family:sans-serif;text-align:center;padding:20px;";
    o.innerHTML='<h2 style="margin:0 0 10px;font-size:22px;">Access Restricted</h2><p style="color:#ccc;max-width:400px;line-height:1.6;">Developer tools are not permitted on this page.<br>Please close DevTools to continue reading.</p>';
    document.body.appendChild(o);
    var c=setInterval(function(){
      if(window.outerWidth-window.innerWidth<=_thr&&window.outerHeight-window.innerHeight<=_thr){
        var el=document.getElementById("__po");if(el)el.remove();_open=false;clearInterval(c);
      }
    },800);
  }

  // 9. Block print
  window.addEventListener("beforeprint",function(e){
    e.preventDefault();
    document.body.style.visibility="hidden";
    setTimeout(function(){document.body.style.visibility="visible";},100);
  });

})();
            `}}
          />
        )}
      </body>
    </html>
  )
}