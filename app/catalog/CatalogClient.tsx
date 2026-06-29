'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import LandingNavbar from '@/app/components/landing/Navbar'
import LandingFooter from '@/app/components/landing/Footer'

const ease = [0.25, 0.1, 0.25, 1] as const

// ─── Product Data ───────────────────────────────────────────────────────────

type Product = {
  id:          number
  image:       string
  collection:  string
  name:        string
  material:    string
  description: string
  price:       string
  priceNote:   string
  tags:        string[]
  badge:       string | null
  palette:     string
}

const PRODUCTS: Product[] = [
  {
    id:          1,
    image:       '/assets/catalog1.png',
    collection:  'The Classic',
    name:        'Ivory Linen & Sheer Duo',
    material:    'Blackout Linen + Voile Sheer Pair',
    description: 'The timeless combination — heavyweight ivory linen blackout paired with a flowing white voile sheer. Independent light and privacy control, floor to ceiling.',
    price:       'From KSh 18,500',
    priceNote:   'per window · pair included',
    tags:        ['Dual Layer', 'Neutral', 'Blackout + Sheer'],
    badge:       'Best Seller',
    palette:     'Neutrals',
  },
  {
    id:          2,
    image:       '/assets/catalog2.png',
    collection:  'The Bold Contrast',
    name:        'Mustard & Charcoal Weave',
    material:    'Woven Cotton — Mustard & Charcoal',
    description: 'Two strong opinions sharing one window. The most requested combination for living rooms and offices that refuse to be forgettable.',
    price:       'From KSh 14,500',
    priceNote:   'per panel · standard lining',
    tags:        ['Bold', 'Contrast Weave', 'Statement'],
    badge:       'New',
    palette:     'Bold Colors',
  },
  {
    id:          3,
    image:       '/assets/catalog3.png',
    collection:  'The Coastal',
    name:        'Teal, Ivory & Cream Trio',
    material:    'Teal Linen Blend + Ivory Sheer + Cream',
    description: 'Three tones, one cohesive palette. Teal anchors the room while ivory and cream panels soften and filter. A complete window treatment as a single collection.',
    price:       'From KSh 16,500',
    priceNote:   'per panel · tri-layer set',
    tags:        ['Teal', 'Tri-tone', 'Coastal'],
    badge:       null,
    palette:     'Bold Colors',
  },
  {
    id:          4,
    image:       '/assets/catalog4.png',
    collection:  'The Metropolitan',
    name:        'Steel Textured Drape',
    material:    'Textured Steel-Grey Poly Blend',
    description: 'Understated at first glance, increasingly beautiful on closer look. A subtle embossed texture in cool steel grey — quiet sophistication for bedrooms and offices.',
    price:       'From KSh 12,000',
    priceNote:   'per panel · blackout lining',
    tags:        ['Textured', 'Steel Grey', 'Premium'],
    badge:       null,
    palette:     'Neutrals',
  },
  {
    id:          5,
    image:       '/assets/curtain1.png',
    collection:  'East African Series',
    name:        'Nairobi Linen',
    material:    'Premium East African Linen',
    description: 'Hand-woven in the highlands of central Kenya. The loose open weave catches afternoon light beautifully — warm, lived-in, deeply rooted in East African tradition.',
    price:       'From KSh 11,000',
    priceNote:   'per panel · natural finish',
    tags:        ['Hand-woven', 'Breathable', 'Natural'],
    badge:       null,
    palette:     'Neutrals',
  },
  {
    id:          6,
    image:       '/assets/curtain2.png',
    collection:  'East African Series',
    name:        'Rift Valley Linen',
    material:    'Heavyweight Terracotta Linen',
    description: 'Terracotta is the colour of Kenyan earth after rain — warm, alive, full of character. Heavyweight enough to command a full wall of windows.',
    price:       'From KSh 13,500',
    priceNote:   'per panel · blackout lining',
    tags:        ['Terracotta', 'Heavyweight', 'Earthy'],
    badge:       null,
    palette:     'Earthy Tones',
  },
  {
    id:          7,
    image:       '/assets/curtain3.png',
    collection:  'Coastal Collection',
    name:        'Mombasa Mist Sheer',
    material:    'White Coastal Sheer',
    description: 'The morning mist off the Indian Ocean — white without being stark, light without being invisible. Fills a room with the feeling of being somewhere beautiful.',
    price:       'From KSh 8,500',
    priceNote:   'per panel · natural drape',
    tags:        ['Sheer', 'White', 'Light Diffusion'],
    badge:       null,
    palette:     'Sheers & Lights',
  },
  {
    id:          8,
    image:       '/assets/curtain4.png',
    collection:  'Premium Velvet',
    name:        'Maasai Ember Velvet',
    material:    'Ochre Cotton Velvet',
    description: 'Inspired by golden hour across the Maasai Mara — a rich ochre velvet that holds light on its surface. In a dining room or bedroom, this fabric does not decorate. It defines.',
    price:       'From KSh 19,000',
    priceNote:   'per panel · premium lining',
    tags:        ['Velvet', 'Ochre', 'Statement'],
    badge:       'Premium',
    palette:     'Earthy Tones',
  },
]

const PALETTES = ['All', 'Neutrals', 'Earthy Tones', 'Bold Colors', 'Sheers & Lights']

// ─── Filter Pill ────────────────────────────────────────────────────────────

function Pill({ label, selected, onClick }: { label: string; selected: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        fontFamily:    'var(--font-inter, sans-serif)',
        fontSize:      '13px',
        fontWeight:    selected ? 500 : 400,
        padding:       '10px 22px',
        borderRadius:  '32px',
        cursor:        'pointer',
        border:        `1px solid ${selected ? '#C9A84C' : 'rgba(201,168,76,0.3)'}`,
        background:    selected ? 'rgba(201,168,76,0.12)' : 'transparent',
        color:         selected ? '#C9A84C' : '#A8B2BE',
        transition:    'all 0.2s ease',
        outline:       'none',
        whiteSpace:    'nowrap',
      }}
      onMouseEnter={e => {
        if (!selected) {
          e.currentTarget.style.borderColor = 'rgba(201,168,76,0.6)'
          e.currentTarget.style.color = '#E8C96D'
        }
      }}
      onMouseLeave={e => {
        if (!selected) {
          e.currentTarget.style.borderColor = 'rgba(201,168,76,0.3)'
          e.currentTarget.style.color = '#A8B2BE'
        }
      }}
    >
      {label}
    </button>
  )
}

// ─── Product Card ───────────────────────────────────────────────────────────

function ProductCard({ product, index }: { product: Product; index: number }) {
  const [hovered, setHovered] = useState(false)

  return (
    <motion.article
      initial={{ opacity: 0, y: 32 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 16 }}
      transition={{ duration: 0.5, ease, delay: index * 0.07 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ background: 'transparent', cursor: 'pointer' }}
    >
      {/* Image */}
      <div style={{
        position:     'relative',
        aspectRatio:  '2/3',
        overflow:     'hidden',
        borderRadius: '4px',
        marginBottom: '18px',
      }}>
        <Image
          src={product.image}
          alt={product.name}
          fill
          style={{
            objectFit:      'cover',
            objectPosition: 'center',
            transform:      hovered ? 'scale(1.06)' : 'scale(1)',
            transition:     'transform 0.7s ease',
          }}
        />

        {/* Badge */}
        {product.badge && (
          <div style={{
            position:      'absolute',
            top:           '14px',
            left:          '14px',
            background:    'linear-gradient(135deg, #F0D77A 0%, #C9A84C 100%)',
            color:         '#0A0F1C',
            fontFamily:    'var(--font-inter, sans-serif)',
            fontSize:      '9px',
            fontWeight:    700,
            letterSpacing: '2px',
            textTransform: 'uppercase',
            padding:       '5px 12px',
            borderRadius:  '2px',
            zIndex:        2,
          }}>
            {product.badge}
          </div>
        )}

        {/* Hover overlay — enquire CTA */}
        <div style={{
          position:       'absolute',
          inset:          0,
          background:     'rgba(8,16,30,0.52)',
          display:        'flex',
          flexDirection:  'column',
          alignItems:     'center',
          justifyContent: 'center',
          gap:            '12px',
          opacity:        hovered ? 1 : 0,
          transition:     'opacity 0.35s ease',
          zIndex:         1,
        }}>
          <Link
            href="/contact"
            style={{
              fontFamily:     'var(--font-inter, sans-serif)',
              fontSize:       '11px',
              fontWeight:     600,
              letterSpacing:  '2.5px',
              textTransform:  'uppercase',
              color:          '#0A0F1C',
              background:     'linear-gradient(135deg, #F0D77A 0%, #C9A84C 100%)',
              padding:        '13px 36px',
              textDecoration: 'none',
              borderRadius:   '2px',
              whiteSpace:     'nowrap',
            }}
          >
            Enquire
          </Link>
          <Link
            href="/studio"
            style={{
              fontFamily:     'var(--font-inter, sans-serif)',
              fontSize:       '10px',
              letterSpacing:  '1.5px',
              textTransform:  'uppercase',
              color:          'rgba(232,201,109,0.85)',
              border:         '1px solid rgba(232,201,109,0.4)',
              padding:        '10px 28px',
              textDecoration: 'none',
              borderRadius:   '2px',
              whiteSpace:     'nowrap',
            }}
          >
            View in Studio
          </Link>
        </div>
      </div>

      {/* Info */}
      <div>
        <p style={{
          fontFamily:    'var(--font-inter, sans-serif)',
          fontSize:      '9px',
          color:         '#C9A84C',
          letterSpacing: '3px',
          textTransform: 'uppercase',
          marginBottom:  '8px',
        }}>
          {product.collection}
        </p>

        <h3 style={{
          fontFamily:   'var(--font-playfair, Georgia, serif)',
          fontSize:     '18px',
          color:        '#F0EBE0',
          fontWeight:   400,
          lineHeight:   1.25,
          marginBottom: '10px',
        }}>
          {product.name}
        </h3>

        <p style={{
          fontFamily: 'var(--font-playfair, Georgia, serif)',
          fontSize:   '16px',
          color:      '#C9A84C',
          fontWeight: 400,
          fontStyle:  'italic',
        }}>
          {product.price}
        </p>
      </div>
    </motion.article>
  )
}

// ─── Main ───────────────────────────────────────────────────────────────────

export default function CatalogClient() {
  const [activePalette, setActivePalette] = useState('All')

  const filtered = activePalette === 'All'
    ? PRODUCTS
    : PRODUCTS.filter(p => p.palette === activePalette)

  return (
    <div style={{ background: '#0D1B2E', minHeight: '100vh' }}>
      <LandingNavbar />

      {/* ── Page Header ── */}
      <section style={{
        paddingTop:    'calc(var(--rj-navbar-height) + 48px)',
        paddingBottom: '48px',
        paddingLeft:   '6vw',
        paddingRight:  '6vw',
        borderBottom:  '1px solid rgba(201,168,76,0.1)',
      }}>
        <div style={{ maxWidth: '1320px', margin: '0 auto' }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease }}
          >
            <p style={{
              fontFamily:    'var(--font-inter, sans-serif)',
              fontSize:      '11px',
              color:         '#C9A84C',
              letterSpacing: '4px',
              textTransform: 'uppercase',
              marginBottom:  '12px',
            }}>
              The Collection
            </p>
            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: '24px' }}>
              <div>
                <h1 style={{
                  fontFamily:   'var(--font-playfair, Georgia, serif)',
                  fontSize:     'clamp(36px, 4vw, 56px)',
                  color:        '#FFFFFF',
                  fontWeight:   400,
                  lineHeight:   1.1,
                  marginBottom: 0,
                }}>
                  Curtains &amp; Fabrics
                </h1>
                <h1 style={{
                  fontFamily:  'var(--font-playfair, Georgia, serif)',
                  fontSize:    'clamp(36px, 4vw, 56px)',
                  fontWeight:  400,
                  lineHeight:  1.1,
                  marginBottom: 0,
                }}>
                  <em style={{ color: '#C9A84C', fontStyle: 'italic' }}>Made for Your Space.</em>
                </h1>
              </div>
              <p style={{
                fontFamily: 'var(--font-inter, sans-serif)',
                fontSize:   '15px',
                color:      '#6A7A88',
                lineHeight: 1.75,
                maxWidth:   '380px',
              }}>
                Every panel custom-knit to order. Consultation, production,
                delivery, and installation — all included.
              </p>
            </div>
          </motion.div>

          {/* Filter Bar */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease, delay: 0.2 }}
            style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '36px' }}
          >
            {PALETTES.map(p => (
              <Pill key={p} label={p} selected={activePalette === p} onClick={() => setActivePalette(p)} />
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Product Grid ── */}
      <section style={{ padding: '64px 6vw 100px' }}>
        <div style={{ maxWidth: '1320px', margin: '0 auto' }}>

          {/* Count */}
          <motion.p
            key={activePalette}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            style={{
              fontFamily:    'var(--font-inter, sans-serif)',
              fontSize:      '12px',
              color:         '#3A4A58',
              letterSpacing: '1px',
              marginBottom:  '32px',
            }}
          >
            {filtered.length} {filtered.length === 1 ? 'product' : 'products'}
            {activePalette !== 'All' ? ` in ${activePalette}` : ''}
          </motion.p>

          {/* Grid */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activePalette}
              style={{
                display:             'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap:                 '36px 28px',
              }}
              className="catalog-product-grid"
            >
              {filtered.map((product, i) => (
                <ProductCard key={product.id} product={product} index={i} />
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* ── Bottom CTA ── */}
      <section style={{
        padding:   '80px 6vw',
        borderTop: '1px solid rgba(201,168,76,0.1)',
        textAlign: 'center',
      }}>
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <p style={{
            fontFamily:    'var(--font-inter, sans-serif)',
            fontSize:      '11px',
            color:         '#C9A84C',
            letterSpacing: '4px',
            textTransform: 'uppercase',
            marginBottom:  '16px',
          }}>
            Not Sure Where to Start?
          </p>
          <h2 style={{
            fontFamily:   'var(--font-playfair, Georgia, serif)',
            fontSize:     'clamp(28px, 3vw, 42px)',
            color:        '#FFFFFF',
            fontWeight:   400,
            lineHeight:   1.2,
            marginBottom: '20px',
          }}>
            Book a Free Discovery Session
          </h2>
          <p style={{
            fontFamily:   'var(--font-inter, sans-serif)',
            fontSize:     '15px',
            color:        '#6A7A88',
            lineHeight:   1.75,
            marginBottom: '40px',
          }}>
            We come to your space, look at your walls and light, and recommend
            the exact fabrics and combinations that will work. No commitment required.
          </p>
          <Link
            href="/contact"
            style={{
              fontFamily:     'var(--font-inter, sans-serif)',
              fontSize:       '14px',
              fontWeight:     600,
              letterSpacing:  '2px',
              textTransform:  'uppercase',
              color:          '#0A0F1C',
              background:     'linear-gradient(135deg, #F0D77A 0%, #C9A84C 50%, #A67C2E 100%)',
              padding:        '18px 52px',
              borderRadius:   '4px',
              textDecoration: 'none',
              display:        'inline-block',
              boxShadow:      '0 0 40px rgba(201,168,76,0.3)',
              transition:     'filter 0.2s ease, transform 0.2s ease',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.filter    = 'brightness(1.1)'
              e.currentTarget.style.transform = 'translateY(-2px)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.filter    = ''
              e.currentTarget.style.transform = ''
            }}
          >
            Book a Consultation →
          </Link>
        </div>
      </section>

      <style>{`
        @media (max-width: 900px)  { .catalog-product-grid { grid-template-columns: repeat(2, 1fr) !important; } }
        @media (max-width: 520px)  { .catalog-product-grid { grid-template-columns: 1fr !important; } }
      `}</style>

      <LandingFooter />
    </div>
  )
}
