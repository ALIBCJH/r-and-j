'use client'

import { motion } from 'framer-motion'
import LandingNavbar      from '@/app/components/landing/Navbar'
import LandingFooter      from '@/app/components/landing/Footer'
import ExperienceHero     from '@/app/components/experience/ExperienceHero'
import StepsSection       from '@/app/components/experience/StepsSection'
import ExperienceCTA      from '@/app/components/experience/ExperienceCTA'

export default function ExperienceClient() {
  return (
    <motion.main
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
      style={{ background: '#0A0F1C' }}
    >
      <LandingNavbar />
      <ExperienceHero />
      <StepsSection />
      <ExperienceCTA />
      <LandingFooter />
    </motion.main>
  )
}
