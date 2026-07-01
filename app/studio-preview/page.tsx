import type { Metadata } from 'next'
import StudioPreviewClient from './StudioPreviewClient'

export const metadata: Metadata = {
  title: 'Compositor Preview | R&J Interiors',
  description: 'Internal playground for the realistic window-panel compositor.',
  robots: { index: false, follow: false },
}

export default function StudioPreviewPage() {
  return <StudioPreviewClient />
}
