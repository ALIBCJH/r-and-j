import type { Metadata } from 'next'
import CatalogClient from './CatalogClient'
import { getPricingConfig } from '@/app/lib/pricingStore'

export const metadata: Metadata = {
  title:       'The Collection | R&J Interiors',
  description: 'Browse our curated East African fabric collection. Choose your palette and find the fabric that suits your room.',
}

// Render at request time so live admin pricing is always reflected.
export const dynamic = 'force-dynamic'

export default async function CatalogPage() {
  const pricing = await getPricingConfig()
  return <CatalogClient pricing={pricing} />
}
