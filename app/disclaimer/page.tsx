import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Disclaimer – The Tech Bharat',
  description: 'The Tech Bharat Disclaimer. Important information about the content we publish.',
  alternates: {
    canonical: 'https://thetechbharat.com/disclaimer',
  },
  openGraph: {
    title: 'Disclaimer – The Tech Bharat',
    description: 'Important information about the content published on The Tech Bharat.',
    url: 'https://thetechbharat.com/disclaimer',
    siteName: 'The Tech Bharat',
    type: 'website',
  },
}

export default function DisclaimerPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="border-b-2 border-[#d4220a] mb-8 pb-4">
        <h1 className="font-playfair text-4xl font-black text-ink mb-2">Disclaimer</h1>
        <p className="font-sans text-sm text-muted">Last updated: March 2026</p>
      </div>
      <div className="space-y-6 font-body text-base text-[#2a2a2a] leading-relaxed">
        <section>
          <h2 className="font-playfair text-xl font-bold text-ink mb-3">General Disclaimer</h2>
          <p>The information provided by The Tech Bharat on thetechbharat.com is for general informational purposes only. All information is provided in good faith; however, we make no representation or warranty of any kind regarding the accuracy, adequacy, validity, reliability, or completeness of any information on our website.</p>
        </section>
        <section>
          <h2 className="font-playfair text-xl font-bold text-ink mb-3">Pricing Information</h2>
          <p>Prices mentioned in articles are indicative and may vary. Always verify the latest prices directly with retailers before making a purchase. The Tech Bharat is not responsible for any purchasing decisions made based on pricing information published on this website.</p>
        </section>
        <section>
          <h2 className="font-playfair text-xl font-bold text-ink mb-3">Affiliate Links</h2>
          <p>Some articles may contain affiliate links. When you purchase through these links, we may earn a small commission at no extra cost to you. This does not influence our editorial opinions or recommendations.</p>
        </section>
        <section>
          <h2 className="font-playfair text-xl font-bold text-ink mb-3">External Links</h2>
          <p>The Tech Bharat may contain links to external websites. We have no control over the content of those sites and accept no responsibility for them or for any loss or damage that may arise from your use of them.</p>
        </section>
        <section>
          <h2 className="font-playfair text-xl font-bold text-ink mb-3">Brand Trademarks</h2>
          <p>All brand names, trademarks, and product names mentioned on The Tech Bharat are the property of their respective owners. The Tech Bharat is an independent publication and is not affiliated with, endorsed by, or sponsored by any of the companies or brands mentioned.</p>
        </section>
        <section>
          <h2 className="font-playfair text-xl font-bold text-ink mb-3">Contact</h2>
          <p>For questions about this disclaimer, contact us at <a href="mailto:legal@thetechbharat.com" className="text-[#d4220a] hover:underline">legal@thetechbharat.com</a>.</p>
        </section>
      </div>
    </div>
  )
}
