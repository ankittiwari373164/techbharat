import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Privacy Policy – The Tech Bharat',
  description: 'Privacy Policy for The Tech Bharat. Learn how we collect, use, and protect your personal information.',
  alternates: { canonical: 'https://thetechbharat.com/privacy-policy' },
  openGraph: {
    title: 'Privacy Policy – The Tech Bharat',
    description: 'Learn how The Tech Bharat collects, uses, and protects your personal information.',
    url: 'https://thetechbharat.com/privacy-policy',
    siteName: 'The Tech Bharat',
    type: 'website',
  },
}

export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="border-b-2 border-[#d4220a] mb-8 pb-4">
        <h1 className="font-playfair text-4xl font-black text-ink mb-2">Privacy Policy</h1>
        <p className="font-sans text-sm text-muted">Last Updated: March 2026</p>
        <p className="font-sans text-xs text-muted mt-1">Applicable to: <a href="https://thetechbharat.com" className="text-[#d4220a] hover:underline">thetechbharat.com</a></p>
      </div>

      <div className="space-y-8 font-body text-base text-[#2a2a2a] leading-relaxed">

        <p>At The Tech Bharat, protecting the privacy of our visitors is one of our top priorities. This Privacy Policy document explains what information we collect, how we use it, and how users can control their data while using our website.</p>

        <section>
          <h2 className="font-playfair text-xl font-bold text-ink mb-3">1. Information We Collect</h2>
          <p className="mb-3">When you visit The Tech Bharat, certain information may be collected automatically to help us improve the website and provide a better user experience. This may include:</p>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li>Internet Protocol (IP) address</li>
            <li>Browser type and device information</li>
            <li>Internet Service Provider (ISP)</li>
            <li>Date and time of visit</li>
            <li>Pages visited on our website</li>
            <li>Referring/exit pages</li>
          </ul>
          <p className="mt-3">This information is used for analysing trends, improving website performance, and understanding user behaviour. It is not used to personally identify visitors.</p>
        </section>

        <section>
          <h2 className="font-playfair text-xl font-bold text-ink mb-3">2. Cookies and Web Beacons</h2>
          <p className="mb-3">The Tech Bharat uses cookies to store information about visitors' preferences and the pages they access on the website. Cookies help us optimise the user experience by customising web page content based on visitors' browser type and other information.</p>
          <p>Users can choose to disable cookies through their individual browser settings. More detailed information about cookie management can be found on the respective browser's website.</p>
        </section>

        <section>
          <h2 className="font-playfair text-xl font-bold text-ink mb-3">3. Google AdSense and Third-Party Advertising</h2>
          <p className="mb-3">We may use Google AdSense or other advertising partners to display advertisements on our website. Google uses technologies such as cookies, including the DART cookie, to serve ads to users based on their visits to this and other websites on the internet. These cookies help show ads that may be more relevant to users.</p>
          <p className="mb-3">Users may choose to opt out of personalised advertising by visiting the <a href="https://adssettings.google.com" target="_blank" rel="noopener noreferrer" className="text-[#d4220a] hover:underline">Google Ads Settings page</a>.</p>
          <p>Third-party advertisers or ad networks may also use cookies, JavaScript, or web beacons in their advertisements and links that appear on The Tech Bharat. These technologies are used to measure advertising effectiveness and personalise the advertising content you see. The Tech Bharat does not have control over these cookies that are used by third-party advertisers.</p>
        </section>

        <section>
          <h2 className="font-playfair text-xl font-bold text-ink mb-3">4. Google Analytics</h2>
          <p>We use Google Analytics to understand how visitors interact with our website. Google Analytics collects information such as how often users visit our site, what pages they visit, and what other sites they used prior to coming to our site. We use this information only to improve the website experience. You can learn more about how Google uses data at <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-[#d4220a] hover:underline">Google's Privacy Policy</a>.</p>
        </section>

        <section>
          <h2 className="font-playfair text-xl font-bold text-ink mb-3">5. Third-Party Privacy Policies</h2>
          <p>The Tech Bharat's Privacy Policy does not apply to other websites or advertisers. We encourage users to review the privacy policies of third-party ad servers or websites for more detailed information about their practices and instructions about how to opt out of certain options.</p>
        </section>

        <section>
          <h2 className="font-playfair text-xl font-bold text-ink mb-3">6. External Links</h2>
          <p>Our website may contain links to external websites for additional information or references. We are not responsible for the privacy practices or content of those external sites.</p>
        </section>

        <section>
          <h2 className="font-playfair text-xl font-bold text-ink mb-3">7. Children's Information</h2>
          <p>Protecting children while using the internet is very important to us. The Tech Bharat does not knowingly collect any personally identifiable information from children under the age of 13. If you believe that your child has provided personal information on our website, please contact us and we will promptly remove such information from our records.</p>
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
          <h2 className="font-playfair text-xl font-bold text-ink mb-3">9. Consent</h2>
          <p>By using our website, you hereby consent to our Privacy Policy and agree to its terms.</p>
        </section>

        <section>
          <h2 className="font-playfair text-xl font-bold text-ink mb-3">10. Updates to This Policy</h2>
          <p>We may update this Privacy Policy from time to time to reflect changes in our practices or legal requirements. Any updates will be posted on this page with a revised "Last Updated" date.</p>
        </section>

        <section>
          <h2 className="font-playfair text-xl font-bold text-ink mb-3">11. Contact Us</h2>
          <p className="mb-4">If you have any questions about this Privacy Policy or our data practices, you can contact us through our website's contact page.</p>
          <Link
            href="/contact"
            className="inline-block bg-[#1a3a5c] hover:bg-[#0f2d4a] text-white font-sans font-semibold px-6 py-3 text-sm transition-colors"
          >
            Contact Us →
          </Link>
        </section>

      </div>
    </div>
  )
}