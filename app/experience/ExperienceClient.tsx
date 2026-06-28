'use client'

import LandingNavbar   from '@/app/components/landing/Navbar'
import LandingFooter   from '@/app/components/landing/Footer'
import ExperienceHero  from '@/app/components/experience/ExperienceHero'
import FeaturesSection from '@/app/components/experience/FeaturesSection'
import StepsSection    from '@/app/components/experience/StepsSection'
import ExperienceCTA   from '@/app/components/experience/ExperienceCTA'

export default function ExperienceClient() {
  return (
    <main style={{ background: '#0D1B2E' }}>
      <LandingNavbar />
      <ExperienceHero />
      <FeaturesSection />
      <StepsSection />
      <ExperienceCTA />
      <LandingFooter />
    </main>
  )
}
