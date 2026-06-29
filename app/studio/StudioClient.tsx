'use client'

import dynamic from 'next/dynamic'
import LandingNavbar from '@/app/components/landing/Navbar'

const MobileStudio = dynamic(
  () => import('../components/mobile-studio/MobileStudio'),
  { ssr: false },
)

export default function StudioClient() {
  return (
    <>
      <LandingNavbar />
      <MobileStudio />
    </>
  )
}
