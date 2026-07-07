import type { Metadata } from 'next'
import FoundingClient from './FoundingClient'

export const metadata: Metadata = {
  title:       'Pre-Launch Offer | R&J Interiors',
  description: 'Back our launch: book your curtains before we open to the public with a small refundable deposit and lock in a huge founding discount. Limited spots.',
}

export default function FoundingPage() {
  return <FoundingClient />
}
