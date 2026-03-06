import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy – TechBharat',
  description: 'TechBharat Privacy Policy. Learn how we collect, use, and protect your personal information.',
}

export default function PrivacyPolicyPage() {
  const lastUpdated = 'March 2026'

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="border-b-2 border-[#d4220a] mb-8 pb-4">
        <h1 className="font-playfair text-4xl font-black text-ink mb-2">Privacy Policy</h1>
        <p className="font-sans text-sm text-muted">Last updated: {lastUpdated}</p>
      </div>

      <div className="space-y-8 font-body text-base text-[#2a2a2a] leading-relaxed">
        <section>
          <h2 className="font-playfair text-xl font-bold text-ink mb-3">1. Introduction</h2>
          <p>Welcome to TechBharat ("we," "our," or "us"). We are committed to protecting your personal information and your right to privacy. This Privacy Policy explains how we collect, use, and share information about you when you use our website at techbharat.com (the "Service").</p>
        </section>

        <section>
          <h2 className="font-playfair text-xl font-bold text-ink mb-3">2. Information We Collect</h2>
          <p className="mb-3">We collect information you voluntarily provide, including when you:</p>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li>Submit a contact form or email us</li>
            <li>Leave a comment or review on articles</li>
            <li>Subscribe to our newsletter or notifications</li>
          </ul>
          <p className="mt-3">We also automatically collect certain information when you visit our website, including your IP address, browser type, operating system, referring URLs, and pages viewed.</p>
        </section>

        <section>
          <h2 className="font-playfair text-xl font-bold text-ink mb-3">3. How We Use Your Information</h2>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li>To provide and improve our services</li>
            <li>To respond to your enquiries and comments</li>
            <li>To send newsletters if you have subscribed</li>
            <li>To analyse website traffic and user behaviour</li>
            <li>To comply with legal obligations</li>
          </ul>
        </section>

        <section>
          <h2 className="font-playfair text-xl font-bold text-ink mb-3">4. Cookies</h2>
          <p>We use cookies to enhance your browsing experience. These include essential cookies for site functionality, analytics cookies (Google Analytics), and advertising cookies (Google AdSense). You can control cookies through your browser settings.</p>
        </section>

        <section>
          <h2 className="font-playfair text-xl font-bold text-ink mb-3">5. Google AdSense and Third-Party Advertising</h2>
          <p>We may use Google AdSense to serve advertisements. Google uses cookies to serve ads based on your prior visits to our site or other websites. You may opt out of personalised advertising by visiting Google's Ads Settings at <a href="https://adssettings.google.com" target="_blank" rel="noopener noreferrer" className="text-[#d4220a] hover:underline">adssettings.google.com</a>.</p>
        </section>

        <section>
          <h2 className="font-playfair text-xl font-bold text-ink mb-3">6. Google Analytics</h2>
          <p>We use Google Analytics to understand how visitors interact with our website. Google Analytics collects information such as how often users visit our site, what pages they visit, and what other sites they used prior to coming to our site. We use this information only to improve the website experience.</p>
        </section>

        <section>
          <h2 className="font-playfair text-xl font-bold text-ink mb-3">7. Data Retention</h2>
          <p>We retain your personal data only for as long as necessary to fulfil the purposes for which it was collected, including for the purposes of satisfying any legal, accounting, or reporting requirements.</p>
        </section>

        <section>
          <h2 className="font-playfair text-xl font-bold text-ink mb-3">8. Your Rights</h2>
          <p className="mb-3">You have the right to:</p>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li>Access the personal information we hold about you</li>
            <li>Request correction of inaccurate data</li>
            <li>Request deletion of your personal data</li>
            <li>Object to processing of your data</li>
            <li>Withdraw consent at any time</li>
          </ul>
        </section>

        <section>
          <h2 className="font-playfair text-xl font-bold text-ink mb-3">9. Children's Privacy</h2>
          <p>Our website is not directed to children under 13 years of age. We do not knowingly collect personal information from children under 13.</p>
        </section>

        <section>
          <h2 className="font-playfair text-xl font-bold text-ink mb-3">10. Changes to This Policy</h2>
          <p>We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page with an updated date.</p>
        </section>

        <section>
          <h2 className="font-playfair text-xl font-bold text-ink mb-3">11. Contact Us</h2>
          <p>If you have any questions about this Privacy Policy, please contact us at <a href="mailto:privacy@techbharat.com" className="text-[#d4220a] hover:underline">privacy@techbharat.com</a>.</p>
        </section>
      </div>
    </div>
  )
}
