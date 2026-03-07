import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About Us – The Tech Bharat',
  description: 'Learn about The Tech Bharat – India\'s trusted mobile technology news portal. Our mission, team, and editorial standards.',
}

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="border-b-2 border-[#d4220a] mb-8 pb-4">
        <h1 className="font-playfair text-4xl font-black text-ink mb-2">About The Tech Bharat</h1>
        <p className="font-sans text-muted">India's Mobile Technology Authority</p>
      </div>

      <div className="prose-content space-y-8">
        <section>
          <h2 className="font-playfair text-2xl font-bold text-ink mb-4">Who We Are</h2>
          <p className="font-body text-base text-[#2a2a2a] leading-relaxed mb-4">
            The Tech Bharat is India's dedicated mobile technology news portal, founded with a single mission: to deliver accurate, timely, and genuinely useful smartphone news and analysis to Indian readers. In a market flooded with recycled press releases and copy-pasted specifications, we believe Indian consumers deserve better.
          </p>
          <p className="font-body text-base text-[#2a2a2a] leading-relaxed mb-4">
            Every article on The Tech Bharat is written with the Indian buyer in mind. We provide India-specific pricing in rupees, availability on Flipkart and Amazon India, 5G band compatibility for Indian networks, and honest assessments of whether a device genuinely offers value for money at its price point.
          </p>
        </section>

        <section>
          <h2 className="font-playfair text-2xl font-bold text-ink mb-4">Our Mission</h2>
          <p className="font-body text-base text-[#2a2a2a] leading-relaxed mb-4">
            The Indian smartphone market is one of the largest and most dynamic in the world, with hundreds of new devices launching every year across every price segment. Our mission is to cut through the noise, separate genuine innovation from marketing hype, and help our readers make informed decisions about their next phone purchase.
          </p>
          <p className="font-body text-base text-[#2a2a2a] leading-relaxed">
            We cover everything from ₹8,000 budget smartphones to flagship devices costing over a lakh, always with the same rigorous standards and honest perspective.
          </p>
        </section>

        <section>
          <h2 className="font-playfair text-2xl font-bold text-ink mb-4">Our Editorial Team</h2>
          <div className="bg-white border border-border p-6 rounded">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-full bg-[#1a3a5c] text-white font-playfair text-2xl font-bold flex items-center justify-center flex-shrink-0">
                TB
              </div>
              <div>
                <h3 className="font-sans text-lg font-bold text-ink">The Tech Bharat Editorial Team</h3>
                <p className="font-sans text-sm text-[#d4220a] mb-2">Mobile Technology Journalists</p>
                <p className="font-body text-sm text-[#2a2a2a] leading-relaxed">
                  Our editorial team consists of experienced technology journalists and mobile enthusiasts with a combined experience of over a decade covering the Indian tech industry. We maintain strict editorial independence and do not accept payment for positive coverage.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section>
          <h2 className="font-playfair text-2xl font-bold text-ink mb-4">What We Cover</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { title: 'Phone Launches', desc: 'Breaking news on new smartphone launches in India, including pricing and availability.' },
              { title: 'Honest Reviews', desc: 'In-depth reviews focused on real-world performance, not benchmark scores.' },
              { title: 'Comparisons', desc: 'Side-by-side comparisons helping you choose between competing devices.' },
              { title: 'Software Updates', desc: 'Coverage of Android, iOS, OneUI and MIUI updates affecting Indian users.' },
              { title: 'Tips & Tricks', desc: 'Practical guides to get the most out of your existing smartphone.' },
              { title: 'Industry Analysis', desc: 'Expert perspective on trends shaping the Indian mobile market.' },
            ].map(item => (
              <div key={item.title} className="bg-[#1a3a5c]/5 border border-border p-4">
                <h3 className="font-sans text-sm font-bold text-ink mb-1">{item.title}</h3>
                <p className="font-sans text-xs text-muted">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="font-playfair text-2xl font-bold text-ink mb-4">Our Standards</h2>
          <ul className="space-y-3">
            {[
              'All content is independently written and fact-checked before publication.',
              'We do not accept payment for coverage or allow brands to influence editorial decisions.',
              'Errors and inaccuracies are corrected promptly with clear correction notices.',
              'We cite multiple credible sources and verify information before reporting.',
              'Our reviews reflect honest assessments based on careful analysis.',
              'We disclose any affiliate relationships transparently.',
            ].map((point, i) => (
              <li key={i} className="flex items-start gap-3 font-body text-sm text-[#2a2a2a]">
                <span className="w-5 h-5 bg-[#d4220a] text-white text-[10px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5 rounded-full">✓</span>
                {point}
              </li>
            ))}
          </ul>
        </section>

        <section className="bg-[#0d0d0d] text-white p-6">
          <h2 className="font-playfair text-2xl font-bold mb-3">Connect With Us</h2>
          <p className="font-sans text-sm text-gray-300 mb-4">
            Follow The Tech Bharat for real-time mobile news and analysis.
          </p>
          <div className="flex flex-wrap gap-3">
            <a href="https://t.me/techbharat" target="_blank" rel="noopener noreferrer"
              className="bg-[#2AABEE] text-white font-sans text-sm font-semibold px-4 py-2 hover:opacity-90">
              Telegram Channel
            </a>
            <a href="https://whatsapp.com/channel/techbharat" target="_blank" rel="noopener noreferrer"
              className="bg-[#25D366] text-white font-sans text-sm font-semibold px-4 py-2 hover:opacity-90">
              WhatsApp Channel
            </a>
            <a href="https://linkedin.com/company/techbharat" target="_blank" rel="noopener noreferrer"
              className="bg-[#0077B5] text-white font-sans text-sm font-semibold px-4 py-2 hover:opacity-90">
              LinkedIn
            </a>
          </div>
        </section>
      </div>
    </div>
  )
}
