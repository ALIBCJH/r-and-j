import type { Metadata } from 'next'
import CatalogClient from './CatalogClient'

export const metadata: Metadata = {
  title:       'The Collection | R&J Interiors',
  description: 'Browse our curated East African fabric collection. Select your room, choose your palette, find your perfect fabric.',
}

export default function CatalogPage() {
  return <CatalogClient />
}
