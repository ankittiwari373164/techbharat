'use client'
import { useState } from 'react'
import type { Metadata } from 'next'

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In production, connect to a form service like Formspree, EmailJS, or your API
    setSubmitted(true)
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="border-b-2 border-[#d4220a] mb-8 pb-4">
        <h1 className="font-playfair text-4xl font-black text-ink mb-2">Contact Us</h1>
        <p className="font-sans text-muted">Get in touch with the TechBharat editorial team</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Contact Info */}
        <div>
          <h2 className="font-playfair text-2xl font-bold mb-5">Get In Touch</h2>
          <p className="font-body text-sm text-[#2a2a2a] leading-relaxed mb-6">
            Have a tip, correction, press enquiry, or partnership proposal? We would love to hear from you. Our editorial team typically responds within 24–48 hours.
          </p>

          <div className="space-y-4">
            {[
              { label: 'Editorial', value: 'editorial@techbharat.com', icon: '✉' },
              { label: 'Press & PR', value: 'press@techbharat.com', icon: '📰' },
              { label: 'Advertising', value: 'ads@techbharat.com', icon: '📊' },
              { label: 'Corrections', value: 'corrections@techbharat.com', icon: '✏️' },
            ].map(item => (
              <div key={item.label} className="flex items-center gap-3 p-3 bg-white border border-border">
                <span className="text-xl">{item.icon}</span>
                <div>
                  <p className="font-sans text-xs font-bold text-muted uppercase tracking-wider">{item.label}</p>
                  <a href={`mailto:${item.value}`} className="font-sans text-sm text-[#d4220a] hover:underline">{item.value}</a>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 p-4 bg-[#1a3a5c]/5 border border-border">
            <h3 className="font-sans text-sm font-bold text-ink mb-2">TechBharat</h3>
            <p className="font-sans text-xs text-muted leading-relaxed">
              India's Mobile Technology Authority<br />
              New Delhi, India<br />
              Follow us on Telegram & WhatsApp for instant news
            </p>
          </div>
        </div>

        {/* Contact Form */}
        <div>
          {submitted ? (
            <div className="bg-green-50 border border-green-200 p-8 text-center">
              <div className="text-5xl mb-4">✓</div>
              <h3 className="font-playfair text-xl font-bold text-green-800 mb-2">Message Received!</h3>
              <p className="font-sans text-sm text-green-700">Thank you for reaching out. We'll respond within 24–48 hours.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="font-sans text-xs font-bold text-muted uppercase tracking-wider block mb-1.5">
                  Your Name *
                </label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  className="w-full font-sans text-sm border border-border px-3 py-2.5 outline-none focus:border-[#1a3a5c]"
                  placeholder="Full name"
                />
              </div>
              <div>
                <label className="font-sans text-xs font-bold text-muted uppercase tracking-wider block mb-1.5">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  className="w-full font-sans text-sm border border-border px-3 py-2.5 outline-none focus:border-[#1a3a5c]"
                  placeholder="your@email.com"
                />
              </div>
              <div>
                <label className="font-sans text-xs font-bold text-muted uppercase tracking-wider block mb-1.5">
                  Subject *
                </label>
                <select
                  required
                  value={form.subject}
                  onChange={e => setForm({ ...form, subject: e.target.value })}
                  className="w-full font-sans text-sm border border-border px-3 py-2.5 outline-none focus:border-[#1a3a5c] bg-white"
                >
                  <option value="">Select subject...</option>
                  <option>News Tip</option>
                  <option>Correction Request</option>
                  <option>Press Enquiry</option>
                  <option>Partnership</option>
                  <option>Advertising</option>
                  <option>General Enquiry</option>
                </select>
              </div>
              <div>
                <label className="font-sans text-xs font-bold text-muted uppercase tracking-wider block mb-1.5">
                  Message *
                </label>
                <textarea
                  required
                  value={form.message}
                  onChange={e => setForm({ ...form, message: e.target.value })}
                  rows={5}
                  className="w-full font-sans text-sm border border-border px-3 py-2.5 outline-none focus:border-[#1a3a5c] resize-none"
                  placeholder="Write your message here..."
                />
              </div>
              <button
                type="submit"
                className="w-full bg-[#d4220a] hover:bg-[#b81d09] text-white font-sans font-bold py-3 text-sm transition-colors"
              >
                Send Message
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
