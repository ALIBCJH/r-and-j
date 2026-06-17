'use client'

import LandingNavbar from '@/app/components/landing/Navbar'
import LandingFooter from '@/app/components/landing/Footer'
import ContactHero   from '@/app/components/contact/ContactHero'
import ContactForm   from '@/app/components/contact/ContactForm'
import ContactInfo   from '@/app/components/contact/ContactInfo'

export default function ContactClient() {
  return (
    <main style={{ background: '#0D1B2E' }}>
      <LandingNavbar />
      <ContactForm />
      <ContactInfo />
      <LandingFooter />
    </main>
  )
}
