import type { Metadata } from 'next'
import StudioClient from './StudioClient'

export const metadata: Metadata = {
  title: 'Photo Match | R&J Interiors',
  description: 'Point your camera at your window wall. We match the perfect curtain to your space.',
}

export default function StudioPage() {
  return <StudioClient />
}
