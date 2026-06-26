export interface Colour {
  id:    string
  label: string
  hex:   string
}

// PLACEHOLDER: verify these hex values against the physical fabric swatches
export const COLOURS: Colour[] = [
  { id: 'ivory',      label: 'Ivory',      hex: '#F5F0E8' },
  { id: 'linen',      label: 'Linen',      hex: '#E8DEC8' },
  { id: 'sand',       label: 'Sand',       hex: '#D4C5A0' },
  { id: 'stone',      label: 'Stone',      hex: '#B8AE9C' },
  { id: 'sage',       label: 'Sage',       hex: '#8A9E82' },
  { id: 'eucalyptus', label: 'Eucalyptus', hex: '#6B8570' },
  { id: 'ocean',      label: 'Ocean',      hex: '#7A9EB0' },
  { id: 'slate',      label: 'Slate',      hex: '#7A8A9A' },
  { id: 'dusk',       label: 'Dusk',       hex: '#8A7A9A' },
  { id: 'blush',      label: 'Blush',      hex: '#D4A8A0' },
  { id: 'terracotta', label: 'Terracotta', hex: '#C4805A' },
  { id: 'chocolate',  label: 'Chocolate',  hex: '#6A4E3A' },
  { id: 'charcoal',   label: 'Charcoal',   hex: '#4A4A4A' },
  { id: 'midnight',   label: 'Midnight',   hex: '#2A3848' },
]
