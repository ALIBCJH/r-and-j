'use client'

import { motion } from 'framer-motion'
import LandingNavbar from '@/app/components/landing/Navbar'
import LandingFooter from '@/app/components/landing/Footer'
import ContactHero   from '@/app/components/contact/ContactHero'
import ContactForm   from '@/app/components/contact/ContactForm'
import ContactInfo   from '@/app/components/contact/ContactInfo'

export default function ContactClient() {
  return (
    <motion.main
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
      style={{ background: '#0A0F1C' }}
    >
      <LandingNavbar />
      <ContactHero />
      <ContactForm />
      <ContactInfo />
      <LandingFooter />
    </motion.main>
  )
}
