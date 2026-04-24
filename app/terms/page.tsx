import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms & Conditions – The Tech Bharat',
  description: 'Terms and Conditions for using The Tech Bharat website.',
}

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="border-b-2 border-[#d4220a] mb-8 pb-4">
        <h1 className="font-playfair text-4xl font-black text-ink mb-2">Terms & Conditions</h1>
        <p className="font-sans text-sm text-muted">Last updated: March 2026</p>
      </div>
      <div className="space-y-6 font-body text-base text-[#2a2a2a] leading-relaxed">
        <section>
          <h2 className="font-playfair text-xl font-bold text-ink mb-3">1. Acceptance of Terms</h2>
          <p>By accessing and using The Tech Bharat (thetechbharat.com), you agree to be bound by these Terms and Conditions. If you do not agree to these terms, please do not use our website.</p>
        </section>
        <section>
          <h2 className="font-playfair text-xl font-bold text-ink mb-3">2. Use of Content</h2>
          <p>All content published on The Tech Bharat, including articles, reviews, images, and analysis, is the intellectual property of The Tech Bharat unless otherwise stated. You may share our content with proper attribution and a link back to the original article. Reproduction, redistribution, or commercial use without written permission is prohibited.</p>
        </section>
        <section>
          <h2 className="font-playfair text-xl font-bold text-ink mb-3">3. User Comments and Reviews</h2>
          <p>By submitting comments or reviews on The Tech Bharat, you grant us a non-exclusive licence to publish your submission. You are responsible for the accuracy of your submissions. We reserve the right to moderate, edit, or remove any user-submitted content that violates our community guidelines or applicable laws.</p>
        </section>
        <section>
          <h2 className="font-playfair text-xl font-bold text-ink mb-3">4. Prohibited Conduct</h2>
          <p className="mb-2">You agree not to:</p>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li>Post false, misleading, or defamatory content</li>
            <li>Infringe any intellectual property rights</li>
            <li>Attempt to hack, disrupt, or damage our systems</li>
            <li>Use automated tools to scrape or crawl our website without permission</li>
            <li>Post spam or unsolicited commercial content</li>
          </ul>
        </section>
        <section>
          <h2 className="font-playfair text-xl font-bold text-ink mb-3">5. Limitation of Liability</h2>
          <p>The Tech Bharat shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising out of your use of or inability to use our website or content.</p>
        </section>
        <section>
          <h2 className="font-playfair text-xl font-bold text-ink mb-3">6. Governing Law</h2>
          <p>These Terms shall be governed by and construed in accordance with the laws of India. Any disputes shall be subject to the exclusive jurisdiction of the courts of New Delhi, India.</p>
        </section>
        <section>
          <h2 className="font-playfair text-xl font-bold text-ink mb-3">7. Changes to Terms</h2>
          <p>We reserve the right to modify these Terms at any time. Continued use of the website after changes constitutes acceptance of the new terms.</p>
        </section>
        <section>
          <h2 className="font-playfair text-xl font-bold text-ink mb-3">8. Contact</h2>
          <p>Questions about these Terms? Contact us at <a href="mailto:legal@thetechbharat.com" className="text-[#d4220a] hover:underline">legal@thetechbharat.com</a>.</p>
        </section>
      </div>
    </div>
  )
}
