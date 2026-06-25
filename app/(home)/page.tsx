import type { Metadata } from 'next'
import LandingNavbar        from '../components/landing/Navbar'
import HeroSection          from '../components/landing/HeroSection'
import CurtainConfigurator  from '../components/landing/CurtainConfigurator'
import ProcessSection       from '../components/landing/ProcessSection'
import StatsSection       from '../components/landing/StatsSection'
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
  description: "East Africa's first vertically integrated luxury curtain design house. See your space in immersive 3D before you spend a single shilling.",
  url:         'https://rjinteriors.co.ke',
  email:       'info@rjinteriors.co.ke',
  image:       'https://rjinteriors.co.ke/assets/hero3.png',
  logo:        'https://rjinteriors.co.ke/assets/r_j_interiors_final_premium_logo.png',
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
      <LandingNavbar />
      <HeroSection />
      <SectionDivider from="#0D1B2E" to="#0D1B2E" />
      <CurtainConfigurator />
      <SectionDivider from="#0D1B2E" to="#0F1117" />
      <ProcessSection />
      <SectionDivider from="#0F1117" to="#0F1117" />
      <StatsSection />
      <SectionDivider from="#0F1117" to="#0A0C12" />
      <TextilesShowcase />
      <SectionDivider from="#0A0C12" to="#0F1117" />
      <TestimonialSection />
      <SectionDivider from="#0F1117" to="#0F1117" />
      <CTABanner />
      <LandingFooter />
    </div>
  )
}
