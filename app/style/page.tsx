import type { Metadata } from 'next'
import StylePickerClient  from './StylePickerClient'

export const metadata: Metadata = {
  title:       'Style Picker | R&J Interiors',
  description: 'Choose your curtain style step by step, and tell us about your room and light so we can prepare for your consultation.',
}

export default function StylePage() {
  return <StylePickerClient />
}
