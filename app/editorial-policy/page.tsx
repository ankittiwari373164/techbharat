import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Editorial Policy – The Tech Bharat',
  description: 'The Tech Bharat Editorial Policy and Standards. How we create, verify, and publish content.',
  alternates: {
    canonical: 'https://thetechbharat.com/editorial-policy',
  },
  openGraph: {
    title: 'Editorial Policy – The Tech Bharat',
    description: 'Learn how The Tech Bharat creates, verifies, and publishes content with transparency and editorial independence.',
    url: 'https://thetechbharat.com/editorial-policy',
    siteName: 'The Tech Bharat',
    type: 'website',
  },
}

export default function EditorialPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="border-b-2 border-[#d4220a] mb-8 pb-4">
        <h1 className="font-playfair text-4xl font-black text-ink mb-2">Editorial Policy</h1>
        <p className="font-sans text-sm text-muted">Last updated: March 2026</p>
      </div>

      <div className="space-y-8 font-body text-base text-[#2a2a2a] leading-relaxed">

        <section>
          <h2 className="font-playfair text-xl font-bold text-ink mb-3">Our Editorial Independence</h2>
          <p>The Tech Bharat maintains complete editorial independence. Our coverage and opinions are never influenced by advertising relationships, brand partnerships, or affiliate arrangements. Every editorial decision is made solely in the interest of our readers.</p>
        </section>

        {/* NEW: Content classification — addresses AdSense concern directly */}
        <section className="bg-blue-50 border-l-4 border-blue-500 p-5 rounded-r-lg">
          <h2 className="font-playfair text-xl font-bold text-ink mb-3">How We Classify Content</h2>
          <p className="mb-3">Every article on The Tech Bharat is clearly classified into one of the following types:</p>
          <div className="space-y-3 text-sm">
            <div className="flex gap-3">
              <span className="bg-green-100 text-green-800 font-bold px-2 py-1 rounded text-xs flex-shrink-0 h-fit">REVIEW</span>
              <p>Based on hands-on testing of a device we have physically used. Contains original observations, real-world performance data, and first-person experience. Clearly dated and includes testing duration.</p>
            </div>
            <div className="flex gap-3">
              <span className="bg-blue-100 text-blue-800 font-bold px-2 py-1 rounded text-xs flex-shrink-0 h-fit">NEWS ANALYSIS</span>
              <p>Analysis of confirmed launched products or official announcements. Pricing and specs are sourced from official brand communications or confirmed retail listings. We clearly state "confirmed" vs "expected" figures.</p>
            </div>
            <div className="flex gap-3">
              <span className="bg-amber-100 text-amber-800 font-bold px-2 py-1 rounded text-xs flex-shrink-0 h-fit">PRE-LAUNCH</span>
              <p>Coverage of officially announced but not yet available products. Clearly labelled with estimated pricing. Does not include personal testing claims.</p>
            </div>
            <div className="flex gap-3">
              <span className="bg-red-100 text-red-800 font-bold px-2 py-1 rounded text-xs flex-shrink-0 h-fit">BASED ON LEAKS</span>
              <p>Analysis of unconfirmed products based on leaked specifications or industry reports. Clearly identified with a source note. All specs and pricing are estimates until official announcement.</p>
            </div>
            <div className="flex gap-3">
              <span className="bg-purple-100 text-purple-800 font-bold px-2 py-1 rounded text-xs flex-shrink-0 h-fit">EVERGREEN GUIDE</span>
              <p>Timeless buying guides, how-to articles, and comparison frameworks. Updated periodically to reflect current pricing and availability in India.</p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="font-playfair text-xl font-bold text-ink mb-3">Content Creation Process</h2>
          <p className="mb-3">Every article on The Tech Bharat follows this process:</p>
          <ol className="list-decimal pl-5 space-y-2 text-sm">
            <li><strong>Source identification:</strong> We identify whether information comes from official brand sources, confirmed retail listings, industry analyst reports, or leaked specifications — and label accordingly.</li>
            <li><strong>Fact verification:</strong> Prices, specifications, and availability claims are cross-checked against official sources before publication.</li>
            <li><strong>Original analysis:</strong> We add India-specific context — Flipkart/Amazon pricing, 5G band compatibility, service centre availability, and honest value assessment for Indian buyers.</li>
            <li><strong>Editorial review:</strong> Articles are reviewed for accuracy, appropriate framing, and adherence to our content classification standards.</li>
            <li><strong>Disclosure:</strong> Every article includes a source note identifying what the analysis is based on.</li>
          </ol>
        </section>



        <section>
          <h2 className="font-playfair text-xl font-bold text-ink mb-3">Pricing and Availability Disclosures</h2>
          <p className="mb-2">Indian buyers make real purchasing decisions based on our content. We take this seriously:</p>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li><strong>Confirmed price:</strong> Sourced from official brand announcement or current Flipkart/Amazon listing</li>
            <li><strong>Expected price:</strong> Analyst estimate or pattern-based inference — clearly labelled as estimate</li>
            <li><strong>Rumoured price:</strong> Based on leaks — treated as highly provisional, labelled accordingly</li>
          </ul>
          <p className="mt-2 text-sm">We recommend readers verify current pricing on Flipkart or Amazon India before making any purchase decision, as prices change frequently.</p>
        </section>

        <section>
          <h2 className="font-playfair text-xl font-bold text-ink mb-3">Corrections Policy</h2>
          <p>When we make factual errors, we correct them promptly and transparently. Corrections are noted at the top of the relevant article with the date corrected. We do not silently edit articles to remove errors — changes are disclosed.</p>
        </section>

        <section>
          <h2 className="font-playfair text-xl font-bold text-ink mb-3">Sponsored Content and Advertising</h2>
          <p>Sponsored content, if published, is clearly labelled as "Sponsored" or "Paid Partnership." Our editorial team does not have influence over advertising content, and advertisers have no influence over our editorial content. These are kept strictly separate.</p>
        </section>

        <section>
          <h2 className="font-playfair text-xl font-bold text-ink mb-3">Affiliate Disclosures</h2>
          <p>When articles contain affiliate links to products, this is disclosed at the top of the article. Affiliate relationships never influence our editorial opinions or recommendations.</p>
        </section>

        <section>
          <h2 className="font-playfair text-xl font-bold text-ink mb-3">About Our Author</h2>
          <p>Vijay Yadav is the founder and Senior Mobile Editor of The Tech Bharat, based in New Delhi. He has covered the Indian smartphone market for 11 years, beginning at a print magazine in Mumbai. He has reviewed over 300 devices. All articles are published under his editorial oversight. For author information, visit our <a href="/author" className="text-[#d4220a] hover:underline">Author page</a>.</p>
        </section>

        <section>
          <h2 className="font-playfair text-xl font-bold text-ink mb-3">Contact the Editorial Team</h2>
          <p>For editorial enquiries, corrections, or content concerns: <a href="mailto:editorial@thetechbharat.com" className="text-[#d4220a] hover:underline">editorial@thetechbharat.com</a></p>
          <p className="mt-2">For general enquiries: <a href="/contact" className="text-[#d4220a] hover:underline">Contact Us</a></p>
        </section>

      </div>
    </div>
  )
}