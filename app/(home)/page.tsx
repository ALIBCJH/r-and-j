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

export const metadata: Metadata = {
  title:       'R&J Interiors — Visualize Before You Buy',
  description: 'East Africa\'s first vertically integrated luxury curtain design house. See your space in immersive 3D before you spend a single shilling.',
}

export default function LandingPage() {
  return (
    <div style={{ background: '#0D1B2E' }}>
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
