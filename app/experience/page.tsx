import type { Metadata } from 'next'
import ExperienceClient from './ExperienceClient'

export const metadata: Metadata = {
  title:       'The VR Experience | R&J Interiors',
  description: 'See your curtains at full scale in your actual room before committing to a single fabric or color.',
}

export default function ExperiencePage() {
  return <ExperienceClient />
}
