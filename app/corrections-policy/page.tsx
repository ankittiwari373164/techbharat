import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Corrections Policy – TechBharat',
}

export default function CorrectionsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="border-b-2 border-[#d4220a] mb-8 pb-4">
        <h1 className="font-playfair text-4xl font-black text-ink mb-2">Corrections Policy</h1>
        <p className="font-sans text-sm text-muted">Our commitment to accuracy and transparency</p>
      </div>
      <div className="space-y-6 font-body text-base text-[#2a2a2a] leading-relaxed">
        <section>
          <h2 className="font-playfair text-xl font-bold text-ink mb-3">Our Commitment to Accuracy</h2>
          <p>TechBharat is committed to publishing accurate, factual content. Despite our best efforts, errors can occasionally occur. When they do, we correct them promptly and transparently.</p>
        </section>
        <section>
          <h2 className="font-playfair text-xl font-bold text-ink mb-3">How We Handle Corrections</h2>
          <ul className="list-disc pl-5 space-y-2 text-sm">
            <li><strong>Minor Errors:</strong> Typographical errors or minor factual inaccuracies are corrected immediately without a formal correction notice.</li>
            <li><strong>Factual Corrections:</strong> Significant factual errors are corrected with a clear "Correction" note at the top of the article, explaining what was changed and why.</li>
            <li><strong>Major Corrections:</strong> If an article contains fundamental factual inaccuracies that cannot be corrected without substantially changing the piece, we may unpublish the article and republish a corrected version.</li>
            <li><strong>Price/Spec Updates:</strong> As phone prices and availability change frequently, we update articles when significant changes occur, noting the update date.</li>
          </ul>
        </section>
        <section>
          <h2 className="font-playfair text-xl font-bold text-ink mb-3">Reporting Errors</h2>
          <p className="mb-2">If you believe you have found an error in any of our articles, we want to hear from you:</p>
          <div className="bg-[#1a3a5c]/5 border border-border p-4">
            <p className="font-sans text-sm font-semibold text-ink mb-1">Email us at:</p>
            <a href="mailto:corrections@techbharat.com" className="font-sans text-sm text-[#d4220a] hover:underline">corrections@techbharat.com</a>
            <p className="font-sans text-xs text-muted mt-2">Please include: the article title or URL, the specific error, and the correct information with a reliable source if possible.</p>
          </div>
        </section>
        <section>
          <h2 className="font-playfair text-xl font-bold text-ink mb-3">Response Time</h2>
          <p>We aim to review and respond to correction requests within 24 hours on business days. Verified corrections are typically published within 2–4 hours of confirmation.</p>
        </section>
      </div>
    </div>
  )
}
