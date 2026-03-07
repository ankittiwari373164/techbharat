import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Editorial Policy – The Tech Bharat',
  description: 'The Tech Bharat Editorial Policy and Standards. How we create, verify, and publish content.',
}

export default function EditorialPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="border-b-2 border-[#d4220a] mb-8 pb-4">
        <h1 className="font-playfair text-4xl font-black text-ink mb-2">Editorial Policy</h1>
        <p className="font-sans text-sm text-muted">How The Tech Bharat creates and publishes content</p>
      </div>
      <div className="space-y-6 font-body text-base text-[#2a2a2a] leading-relaxed">
        <section>
          <h2 className="font-playfair text-xl font-bold text-ink mb-3">Our Editorial Independence</h2>
          <p>The Tech Bharat maintains complete editorial independence. Our coverage and opinions are never influenced by advertising relationships, brand partnerships, or affiliate arrangements. Every editorial decision is made solely in the interest of our readers.</p>
        </section>
        <section>
          <h2 className="font-playfair text-xl font-bold text-ink mb-3">Content Creation Process</h2>
          <p className="mb-3">Every article on The Tech Bharat follows a rigorous process:</p>
          <ol className="list-decimal pl-5 space-y-2 text-sm">
            <li><strong>Research:</strong> We gather information from multiple credible industry sources.</li>
            <li><strong>Verification:</strong> Facts, prices, and specifications are cross-checked before publication.</li>
            <li><strong>Original Writing:</strong> Content is written fresh with original analysis, India-specific context, and genuine editorial perspective.</li>
            <li><strong>Editorial Review:</strong> Articles are reviewed for accuracy, clarity, and adherence to our standards before publishing.</li>
            <li><strong>Publication:</strong> Articles include author attribution, publication date, and source acknowledgements where applicable.</li>
          </ol>
        </section>
        <section>
          <h2 className="font-playfair text-xl font-bold text-ink mb-3">Technology-Assisted Journalism</h2>
          <p>The Tech Bharat uses AI-assisted tools to help with research and drafting. However, all published content is reviewed, edited, and verified by our editorial team before publication. We add original analysis, India-specific insights, and human editorial judgement to every article. We do not publish AI-generated content without substantial human editing and fact-checking.</p>
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
          <h2 className="font-playfair text-xl font-bold text-ink mb-3">Commenting and Community Standards</h2>
          <p>We welcome reader engagement. Comments should be respectful and on-topic. We moderate comments to remove spam, offensive content, misinformation, and personal attacks. We do not censor legitimate dissenting opinions.</p>
        </section>
        <section>
          <h2 className="font-playfair text-xl font-bold text-ink mb-3">Contact the Editorial Team</h2>
          <p>For editorial enquiries: <a href="mailto:editorial@techbharat.com" className="text-[#d4220a] hover:underline">editorial@techbharat.com</a></p>
        </section>
      </div>
    </div>
  )
}
