import type { Metadata } from 'next'
import LandingNavbar        from '../components/landing/Navbar'
import HeroSection          from '../components/landing/HeroSection'
import CurtainConfigurator  from '../components/landing/CurtainConfiguratorLazy'
import TextilesShowcase   from '../components/landing/TextilesShowcase'
import TestimonialSection from '../components/landing/TestimonialSection'
import CTABanner          from '../components/landing/CTABanner'
import LandingFooter      from '../components/landing/Footer'
import SectionDivider     from '../components/landing/SectionDivider'

// Title, description, Open Graph & Twitter are inherited from the root layout.
// Here we only declare this page's canonical URL.
export const metadata: Metadata = {
  alternates: { canonical: '/' },
}

// LocalBusiness structured data — helps Google show R&J as a local result
// (maps, knowledge panel) for searches around Nyeri / Kenya.
const jsonLd = {
  '@context': 'https://schema.org',
  '@type':    'LocalBusiness',
  '@id':      'https://rjinteriors.co.ke/#business',
  name:        'R&J Interiors',
  description: "East Africa's first vertically integrated luxury curtain house. Preview fabrics and colours online, then we measure, make, and install — so you commit with confidence.",
  url:         'https://rjinteriors.co.ke',
  email:       'info@rjinteriors.co.ke',
  image:       'https://rjinteriors.co.ke/assets/hero3.png',
  logo:        'https://rjinteriors.co.ke/logo24.png',
  priceRange:  '$$$',
  address: {
    '@type':         'PostalAddress',
    addressLocality: 'Nyeri',
    addressCountry:  'KE',
  },
  areaServed: {
    '@type': 'Country',
    name:    'Kenya',
  },
}

export default function LandingPage() {
  return (
    <div style={{ background: '#0D1B2E' }}>
      {/* JSON-LD structured data (sanitised per Next.js guidance) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }}
      />
      {/* A cinematic five-act homepage — each section answers one question:
          Hero (what is this?) → Design Without Guesswork (why different?) →
          Portfolio (can I trust them?) → Testimonials (did it work?) →
          CTA (how do I begin?). */}
      <LandingNavbar />
      <HeroSection />
      <SectionDivider />
      <CurtainConfigurator />
      <SectionDivider />
      <TextilesShowcase />
      <SectionDivider />
      <TestimonialSection />
      <SectionDivider />
      <CTABanner />
      <LandingFooter />
    </div>
  )
}
