'use client'

import LandingNavbar      from '@/app/components/landing/Navbar'
import LandingFooter      from '@/app/components/landing/Footer'
import ExperienceHero     from '@/app/components/experience/ExperienceHero'
import StepsSection       from '@/app/components/experience/StepsSection'
import ExperienceCTA      from '@/app/components/experience/ExperienceCTA'

export default function ExperienceClient() {
  return (
    <main style={{ background: '#111113' }}>
      <LandingNavbar />
      <ExperienceHero />
      <StepsSection />
      <ExperienceCTA />
      <LandingFooter />
    </main>
  )
}
