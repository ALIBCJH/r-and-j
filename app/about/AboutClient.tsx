'use client'

import { motion } from 'framer-motion'
import LandingNavbar   from '@/app/components/landing/Navbar'
import LandingFooter   from '@/app/components/landing/Footer'
import AboutHero       from '@/app/components/about/AboutHero'
import StorySection    from '@/app/components/about/StorySection'
import FoundersSection from '@/app/components/landing/FoundersSection'
import ValuesSection   from '@/app/components/about/ValuesSection'
import AboutCTA        from '@/app/components/about/AboutCTA'

export default function AboutClient() {
  return (
    <motion.main
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
      style={{ background: '#0A0F1C' }}
    >
      <LandingNavbar />
      <AboutHero />
      <FoundersSection />
      <StorySection />
      <ValuesSection />
      <AboutCTA />
      <LandingFooter />
    </motion.main>
  )
}
