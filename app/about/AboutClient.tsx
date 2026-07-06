'use client'

import LandingNavbar   from '@/app/components/landing/Navbar'
import LandingFooter   from '@/app/components/landing/Footer'
import AboutHero       from '@/app/components/about/AboutHero'
import StorySection    from '@/app/components/about/StorySection'
import FoundersSection from '@/app/components/landing/FoundersSection'
import ValuesSection   from '@/app/components/about/ValuesSection'
import AboutCTA        from '@/app/components/about/AboutCTA'

export default function AboutClient() {
  return (
    <main style={{ background: '#0D1B2E' }}>
      <LandingNavbar />
      <AboutHero />
      <StorySection />
      <FoundersSection />
      <ValuesSection />
      <AboutCTA />
      <LandingFooter />
    </main>
  )
}
