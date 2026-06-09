import type { Metadata } from 'next'
import AboutClient from './AboutClient'

export const metadata: Metadata = {
  title:       'Our Story | R&J Interiors',
  description: 'Meet the architect and the curator behind East Africa\'s first vertically integrated luxury curtain design house.',
}

export default function AboutPage() {
  return <AboutClient />
}
