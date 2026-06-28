'use client'

import dynamic from 'next/dynamic'

const MobileStudio = dynamic(
  () => import('../components/mobile-studio/MobileStudio'),
  { ssr: false },
)

export default function StudioClient() {
  return <MobileStudio />
}
