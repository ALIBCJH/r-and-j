import type { Metadata } from 'next'
import ContactClient from './ContactClient'

export const metadata: Metadata = {
  title:       'Book a Consultation | R&J Interiors',
  description: 'Book a consultation with the R&J Interiors design team. From KES 2,500, credited toward your order. We respond within 24 hours.',
}

export default function ContactPage() {
  return <ContactClient />
}
