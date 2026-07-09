import type { Metadata } from 'next'
import StudioClient from './StudioClient'

export const metadata: Metadata = {
  title: 'Photo Match | R&J Interiors',
  description: 'Preview curtain fabrics and colours on a styled room, and see options matched to your chosen wall colour.',
}

export default function StudioPage() {
  return <StudioClient />
}
