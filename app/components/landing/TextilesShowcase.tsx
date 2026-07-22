'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { PRODUCTS, type Product } from '@/app/lib/products'
import { API_URL } from '@/app/lib/api'
import PricingModal from '@/app/components/pricing/PricingModal'
import { type PricingConfig, DEFAULT_PRICING_CONFIG, startingFrom, formatKes } from '@/app/lib/pricing'

const ease = [0.25, 0.1, 0.25, 1] as const

// One source of truth — the first four catalog products. No duplicated pricing.
const FEATURED = PRODUCTS.slice(0, 4)

export default function TextilesShowcase() {
  const [modalProduct, setModalProduct] = useState<Product | null>(null)
  // Seed with the ship-time defaults so the section renders instantly (it's
  // below the fold — no LCP cost) and swaps to live admin prices on fetch. The
  // homepage itself stays static; only this client fetch is dynamic.
  const [pricing, setPricing] = useState<PricingConfig>(DEFAULT_PRICING_CONFIG)

  useEffect(() => {
    let alive = true
    fetch(`${API_URL}/pricing`, { cache: 'no-store' })
      .then(r => r.json())
      .then(d => { if (alive && d?.ok && d.config) setPricing(d.config) })
      .catch(() => { /* keep defaults */ })
    return () => { alive = false }
  }, [])

  return (
    <>
    <section
      id="catalog"
      style={{ background: '#0D1B2E', padding: '120px 6vw', borderTop: '1px solid rgba(201,168,76,0.12)' }}
    >
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>

        {/* Header */}
        <div
          className="flex flex-col md:flex-row md:items-end md:justify-between"
          style={{ marginBottom: '64px', gap: '24px' }}
        >
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.8, ease }}
          >
            <p style={{
              fontFamily:    'var(--font-inter, sans-serif)',
              fontSize:      '11px',
              color:         '#C9A84C',
              letterSpacing: '5px',
              textTransform: 'uppercase',
              marginBottom:  '14px',
            }}>
              Our Textile Collection
            </p>
            <h2 style={{
              fontFamily: 'var(--font-playfair, Georgia, serif)',
              fontSize:   'clamp(38px, 4vw, 56px)',
              color:      '#FFFFFF',
              lineHeight: 1.08,
            }}>
              Fabrics That Define<br />
              <span style={{ color: '#C9A84C' }}>the Room</span>
            </h2>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.8, ease, delay: 0.15 }}
            style={{
              fontFamily: 'var(--font-inter, sans-serif)',
              fontSize:   '15px',
              color:      '#6A7A8A',
              lineHeight: 1.75,
              maxWidth:   '380px',
            }}
          >
            A curated cross-section of our fabric library.
            Every textile can be previewed in our online studio
            before you commit to a single metre.
          </motion.p>
        </div>

        {/* Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4" style={{ gap: '28px' }}>
          {FEATURED.map((product, i) => (
            <FeaturedCard
              key={product.id}
              product={product}
              index={i}
              pricing={pricing}
              onViewPricing={setModalProduct}
            />
          ))}
        </div>

        {/* View Full Catalog CTA */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.7, ease, delay: 0.25 }}
          style={{ marginTop: '48px', display: 'flex', justifyContent: 'center' }}
        >
          <Link
            href="/catalog"
            className="inline-flex items-center gap-2 group"
            style={{
              border:         '1px solid rgba(201,168,76,0.45)',
              color:          '#C9A84C',
              padding:        '14px 36px',
              fontFamily:     'var(--font-inter, sans-serif)',
              fontSize:       '14px',
              fontWeight:     500,
              letterSpacing:  '0.5px',
              textDecoration: 'none',
              transition:     'all 0.3s ease',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background  = 'rgba(201,168,76,0.08)'
              e.currentTarget.style.borderColor = '#C9A84C'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background  = ''
              e.currentTarget.style.borderColor = 'rgba(201,168,76,0.45)'
            }}
          >
            View Full Catalog
            <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </motion.div>

      </div>
    </section>

    <PricingModal
      product={modalProduct}
      pricing={pricing}
      onClose={() => setModalProduct(null)}
    />
    </>
  )
}

function FeaturedCard({
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
  const { id, image, collection, name, badge } = product
  const from = startingFrom(pricing, id)

  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.7, ease, delay: index * 0.08 }}
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
          src={image}
          alt={name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          style={{
            objectFit:      'cover',
            objectPosition: 'center',
            transform:      hovered ? 'scale(1.06)' : 'scale(1)',
            transition:     'transform 0.7s ease',
          }}
        />

        {/* Badge */}
        {badge && (
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
            {badge}
          </div>
        )}

        {/* Hover overlay */}
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
          <button
            type="button"
            onClick={() => onViewPricing(product)}
            style={{
              fontFamily:     'var(--font-inter, sans-serif)',
              fontSize:       '11px',
              fontWeight:     600,
              letterSpacing:  '2.5px',
              textTransform:  'uppercase',
              color:          '#0A0F1C',
              background:     'linear-gradient(135deg, #F0D77A 0%, #C9A84C 100%)',
              padding:        '13px 36px',
              border:         'none',
              cursor:         'pointer',
              borderRadius:   '2px',
              whiteSpace:     'nowrap',
            }}
          >
            View Pricing
          </button>
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
          {collection}
        </p>

        <h3 style={{
          fontFamily:   'var(--font-playfair, Georgia, serif)',
          fontSize:     '18px',
          color:        '#F0EBE0',
          fontWeight:   400,
          lineHeight:   1.25,
          marginBottom: '10px',
        }}>
          {name}
        </h3>

        <p style={{
          fontFamily: 'var(--font-playfair, Georgia, serif)',
          fontSize:   '16px',
          color:      '#C9A84C',
          fontWeight: 400,
          fontStyle:  'italic',
        }}>
          {from ? `From ${formatKes(from.amount)}` : 'On request'}
        </p>
      </div>
    </motion.article>
  )
}
