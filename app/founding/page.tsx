import type { Metadata } from 'next'
import FoundingClient from './FoundingClient'

export const metadata: Metadata = {
  title:       'Become a Founding Client | R&J Interiors',
  description: 'Reserve your curtains in our limited founding cohort with a small, fully-refundable M-Pesa deposit that locks your founding price.',
}

export default function FoundingPage() {
  return <FoundingClient />
}
