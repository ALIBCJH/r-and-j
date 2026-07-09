import type { Metadata } from 'next'
import CatalogClient from './CatalogClient'

export const metadata: Metadata = {
  title:       'The Collection | R&J Interiors',
  description: 'Browse our curated East African fabric collection. Choose your palette and find the fabric that suits your room.',
}

export default function CatalogPage() {
  return <CatalogClient />
}
