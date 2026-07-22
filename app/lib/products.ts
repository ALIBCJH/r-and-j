// Product identity only. Pricing is NOT here — a finished window is priced by
// (window size × service package) in app/lib/pricing.ts, editable from the
// admin. Nothing about panels/pairs/lining lives on a product any more.
export type Product = {
  id:          number
  slug:        string
  image:       string
  collection:  string
  name:        string
  material:    string
  description: string
  tags:        string[]
  badge:       string | null
  palette:     string
}

export const PRODUCTS: Product[] = [
  {
    id:          1,
    slug:        'ivory-linen-sheer-duo',
    image:       '/assets/catalog1.png',
    collection:  'The Classic',
    name:        'Ivory Linen & Sheer Duo',
    material:    'Blackout Linen + Voile Sheer Pair',
    description: 'The timeless combination — heavyweight ivory linen blackout paired with a flowing white voile sheer. Independent light and privacy control, floor to ceiling.',
    tags:        ['Dual Layer', 'Neutral', 'Blackout + Sheer'],
    badge:       'Best Seller',
    palette:     'Neutrals',
  },
  {
    id:          2,
    slug:        'mustard-charcoal-weave',
    image:       '/assets/catalog2.png',
    collection:  'The Bold Contrast',
    name:        'Mustard & Charcoal Weave',
    material:    'Woven Cotton — Mustard & Charcoal',
    description: 'Two strong opinions sharing one window. The most requested combination for living rooms and offices that refuse to be forgettable.',
    tags:        ['Bold', 'Contrast Weave', 'Statement'],
    badge:       'New',
    palette:     'Bold Colors',
  },
  {
    id:          3,
    slug:        'teal-ivory-cream-trio',
    image:       '/assets/catalog3.png',
    collection:  'The Coastal',
    name:        'Teal, Ivory & Cream Trio',
    material:    'Teal Linen Blend + Ivory Sheer + Cream',
    description: 'Three tones, one cohesive palette. Teal anchors the room while ivory and cream panels soften and filter. A complete window treatment as a single collection.',
    tags:        ['Teal', 'Tri-tone', 'Coastal'],
    badge:       null,
    palette:     'Bold Colors',
  },
  {
    id:          4,
    slug:        'steel-textured-drape',
    image:       '/assets/catalog4.png',
    collection:  'The Metropolitan',
    name:        'Steel Textured Drape',
    material:    'Textured Steel-Grey Poly Blend',
    description: 'Understated at first glance, increasingly beautiful on closer look. A subtle embossed texture in cool steel grey — quiet sophistication for bedrooms and offices.',
    tags:        ['Textured', 'Steel Grey', 'Premium'],
    badge:       null,
    palette:     'Neutrals',
  },
  {
    id:          5,
    slug:        'nairobi-linen',
    image:       '/assets/curtain1.png',
    collection:  'East African Series',
    name:        'Nairobi Linen',
    material:    'Premium East African Linen',
    description: 'Hand-woven in the highlands of central Kenya. The loose open weave catches afternoon light beautifully — warm, lived-in, deeply rooted in East African tradition.',
    tags:        ['Hand-woven', 'Breathable', 'Natural'],
    badge:       null,
    palette:     'Neutrals',
  },
  {
    id:          6,
    slug:        'rift-valley-linen',
    image:       '/assets/curtain2.png',
    collection:  'East African Series',
    name:        'Rift Valley Linen',
    material:    'Heavyweight Terracotta Linen',
    description: 'Terracotta is the colour of Kenyan earth after rain — warm, alive, full of character. Heavyweight enough to command a full wall of windows.',
    tags:        ['Terracotta', 'Heavyweight', 'Earthy'],
    badge:       null,
    palette:     'Earthy Tones',
  },
  {
    id:          7,
    slug:        'mombasa-mist-sheer',
    image:       '/assets/windowpage.png',
    collection:  'Coastal Collection',
    name:        'Mombasa Mist Sheer',
    material:    'White Coastal Sheer',
    description: 'The morning mist off the Indian Ocean — white without being stark, light without being invisible. Fills a room with the feeling of being somewhere beautiful.',
    tags:        ['Sheer', 'White', 'Light Diffusion'],
    badge:       null,
    palette:     'Sheers & Lights',
  },
  {
    id:          8,
    slug:        'maasai-ember-velvet',
    image:       '/assets/curtain4.png',
    collection:  'Premium Velvet',
    name:        'Maasai Ember Velvet',
    material:    'Ochre Cotton Velvet',
    description: 'Inspired by golden hour across the Maasai Mara — a rich ochre velvet that holds light on its surface. In a dining room or bedroom, this fabric does not decorate. It defines.',
    tags:        ['Velvet', 'Ochre', 'Statement'],
    badge:       'Premium',
    palette:     'Earthy Tones',
  },
]

export function getProductById(id: number): Product | undefined {
  return PRODUCTS.find(p => p.id === id)
}

export function getRelatedProducts(product: Product, count = 3): Product[] {
  return PRODUCTS
    .filter(p => p.id !== product.id && p.palette === product.palette)
    .slice(0, count)
    .concat(
      PRODUCTS.filter(p => p.id !== product.id && p.palette !== product.palette)
    )
    .slice(0, count)
}
