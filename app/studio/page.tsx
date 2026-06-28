import type { Metadata } from 'next'
import dynamic from 'next/dynamic'

export const metadata: Metadata = {
  title: 'Photo Match | R&J Interiors',
  description: 'Point your camera at your window wall. We match the perfect curtain to your space.',
}

const MobileStudio = dynamic(
  () => import('../components/mobile-studio/MobileStudio'),
  { ssr: false },
)

export default function StudioPage() {
  return <MobileStudio />
}
