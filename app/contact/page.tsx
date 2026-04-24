import type { Metadata } from 'next'
import ContactClient from './ContactClient'

export const metadata: Metadata = {
  title: 'Contact Us – The Tech Bharat',
  description: 'Contact The Tech Bharat editorial team for news tips, corrections, press enquiries, or partnerships.',
  alternates: {
    canonical: 'https://thetechbharat.com/contact',
  },
  openGraph: {
    title: 'Contact Us – The Tech Bharat',
    description: 'Get in touch with The Tech Bharat team for enquiries, corrections, or partnerships.',
    url: 'https://thetechbharat.com/contact',
    siteName: 'The Tech Bharat',
    type: 'website',
  },
}

export default function ContactPage() {
  return <ContactClient />
}