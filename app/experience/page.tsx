import type { Metadata } from 'next'
import ExperienceClient from './ExperienceClient'

export const metadata: Metadata = {
  title:       'The Experience — Our Vision | R&J Interiors',
  description: 'The immersive home visualization we are building toward — our long-term vision. Available today: our online fabric studio to preview colours and fabrics before you commit.',
}

export default function ExperiencePage() {
  return <ExperienceClient />
}
