import type { Metadata } from 'next'
import PricingAdminClient from './PricingAdminClient'

export const metadata: Metadata = {
  title:  'Pricing Management | R&J Admin',
  robots: { index: false, follow: false },
}

export default function AdminPricingPage() {
  return <PricingAdminClient />
}
