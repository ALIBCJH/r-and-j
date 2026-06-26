import type { Metadata } from 'next'
import StylePickerClient  from './StylePickerClient'

export const metadata: Metadata = {
  title:       'Style Picker | R&J Interiors',
  description: 'Choose your curtain style in 6 simple steps. Tailored to your room, your light, your home.',
}

export default function StylePage() {
  return <StylePickerClient />
}
