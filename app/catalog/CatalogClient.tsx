'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import LandingNavbar from '@/app/components/landing/Navbar'
import LandingFooter from '@/app/components/landing/Footer'
import { PRODUCTS } from '@/app/lib/products'
import type { Product } from '@/app/lib/products'
import PricingModal from '@/app/components/pricing/PricingModal'
import { type PricingConfig, startingFrom, formatKes } from '@/app/lib/pricing'

const ease = [0.25, 0.1, 0.25, 1] as const

const PALETTES = ['All', 'Neutrals', 'Earthy Tones', 'Bold Colors', 'Sheers & Lights']

// ─── Filter Pill ─────────────────────────────────────────────────────────────

function Pill({ label, selected, onClick }: { label: string; selected: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        fontFamily:   'var(--font-inter, sans-serif)',
        fontSize:     '13px',
        fontWeight:   selected ? 500 : 400,
        padding:      '10px 22px',
        borderRadius: '32px',
        cursor:       'pointer',
        border:       `1px solid ${selected ? '#C9A84C' : 'rgba(201,168,76,0.3)'}`,
        background:   selected ? 'rgba(201,168,76,0.12)' : 'transparent',
        color:        selected ? '#C9A84C' : '#A8B2BE',
        transition:   'all 0.2s ease',
        outline:      'none',
        whiteSpace:   'nowrap',
      }}
      onMouseEnter={e => {
        if (!selected) {
          e.currentTarget.style.borderColor = 'rgba(201,168,76,0.6)'
          e.currentTarget.style.color       = '#E8C96D'
        }
      }}
      onMouseLeave={e => {
        if (!selected) {
          e.currentTarget.style.borderColor = 'rgba(201,168,76,0.3)'
          e.currentTarget.style.color       = '#A8B2BE'
        }
      }}
    >
      {label}
    </button>
  )
}

// ─── Product Card ─────────────────────────────────────────────────────────────

function ProductCard({
  product,
  index,
  pricing,
  onViewPricing,
}: {
  product: Product
  index: number
  pricing: PricingConfig
  onViewPricing: (p: Product) => void
}) {
  const [hovered, setHovered] = useState(false)
  const from = startingFrom(pricing, product.id)

  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 16 }}
      transition={{ duration: 0.5, ease, delay: index * 0.06 }}
    >
      <Link
        href={`/catalog/${product.id}`}
        style={{ textDecoration: 'none', display: 'block' }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <article style={{
          border:      `1px solid ${hovered ? 'rgba(201,168,76,0.4)' : 'rgba(201,168,76,0.12)'}`,
          borderRadius: '4px',
          overflow:    'hidden',
          transition:  'border-color 0.3s ease',
          background:  'transparent',
        }}>

          {/* Image */}
          <div style={{
            position:    'relative',
            aspectRatio: '2/3',
            overflow:    'hidden',
          }}>
            <Image
              src={product.image}
              alt={product.name}
              fill
              sizes="(max-width: 900px) 50vw, 33vw"
              style={{
                objectFit:      'cover',
                objectPosition: 'center',
                transform:      hovered ? 'scale(1.05)' : 'scale(1)',
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
          </div>

          {/* Info */}
          <div style={{ padding: '20px 20px 24px' }}>

            {/* Collection */}
            <p style={{
              fontFamily:    'var(--font-inter, sans-serif)',
              fontSize:      '9px',
              color:         '#C9A84C',
              letterSpacing: '3px',
              textTransform: 'uppercase',
              marginBottom:  '10px',
            }}>
              {product.collection}
            </p>

            {/* Name */}
            <h3 style={{
              fontFamily:   'var(--font-playfair, Georgia, serif)',
              fontSize:     '18px',
              color:        '#F0EBE0',
              fontWeight:   400,
              lineHeight:   1.25,
              marginBottom: '6px',
            }}>
              {product.name}
            </h3>

            {/* Material */}
            <p style={{
              fontFamily:   'var(--font-inter, sans-serif)',
              fontSize:     '12px',
              color:        '#4A5A6A',
              lineHeight:   1.5,
              marginBottom: '16px',
            }}>
              {product.material}
            </p>

            {/* Divider */}
            <div style={{
              width:        '100%',
              height:       '1px',
              background:   'rgba(201,168,76,0.1)',
              marginBottom: '16px',
            }} />

            {/* Starting-from price */}
            <p style={{
              fontFamily:    'var(--font-inter, sans-serif)',
              fontSize:      '10px',
              color:         '#6A7A88',
              letterSpacing: '2px',
              textTransform: 'uppercase',
              marginBottom:  '5px',
            }}>
              Starting From
            </p>
            <p style={{
              fontFamily:   'var(--font-playfair, Georgia, serif)',
              fontSize:     '22px',
              color:        '#F0EBE0',
              fontWeight:   400,
              lineHeight:   1,
              marginBottom: '5px',
            }}>
              {from ? formatKes(from.amount) : 'On request'}
            </p>
            <p style={{
              fontFamily:   'var(--font-inter, sans-serif)',
              fontSize:     '11px',
              color:        '#4A5A6A',
              marginBottom: '18px',
            }}>
              {from ? `${from.sizeLabel} Window · ${from.packageName} Package` : 'Book a consultation'}
            </p>

            {/* View Pricing — opens the modal without following the card link */}
            <button
              type="button"
              onClick={e => { e.preventDefault(); e.stopPropagation(); onViewPricing(product) }}
              style={{
                width:         '100%',
                display:       'flex',
                alignItems:    'center',
                justifyContent:'center',
                gap:           '7px',
                background:    hovered ? 'rgba(201,168,76,0.10)' : 'transparent',
                border:        '1px solid rgba(201,168,76,0.4)',
                color:         hovered ? '#E8C96D' : '#C9A84C',
                padding:       '11px 16px',
                borderRadius:  '4px',
                cursor:        'pointer',
                fontFamily:    'var(--font-inter, sans-serif)',
                fontSize:      '11px',
                fontWeight:    600,
                letterSpacing: '1.5px',
                textTransform: 'uppercase',
                transition:    'all 0.25s ease',
              }}
            >
              View Pricing
              <ArrowRight
                size={12}
                style={{
                  transform:  hovered ? 'translateX(3px)' : 'translateX(0)',
                  transition: 'transform 0.25s ease',
                }}
              />
            </button>

          </div>
        </article>
      </Link>
    </motion.div>
  )
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function CatalogClient({ pricing }: { pricing: PricingConfig }) {
  const [activePalette, setActivePalette] = useState('All')
  const [modalProduct,  setModalProduct]  = useState<Product | null>(null)

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
                  fontFamily:   'var(--font-playfair, Georgia, serif)',
                  fontSize:     'clamp(36px, 4vw, 56px)',
                  fontWeight:   400,
                  lineHeight:   1.1,
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
                <ProductCard
                  key={product.id}
                  product={product}
                  index={i}
                  pricing={pricing}
                  onViewPricing={setModalProduct}
                />
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
            href="/founding"
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

      <PricingModal
        product={modalProduct}
        pricing={pricing}
        onClose={() => setModalProduct(null)}
      />
    </div>
  )
}
