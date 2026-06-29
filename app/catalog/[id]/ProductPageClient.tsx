'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import LandingNavbar from '@/app/components/landing/Navbar'
import LandingFooter from '@/app/components/landing/Footer'
import { PRODUCTS, getRelatedProducts } from '@/app/lib/products'
import type { Product } from '@/app/lib/products'

const ease = [0.25, 0.1, 0.25, 1] as const

export default function ProductPageClient({ product }: { product: Product }) {
  const related = getRelatedProducts(product, 3)

  return (
    <div style={{ background: '#0D1B2E', minHeight: '100vh' }}>
      <LandingNavbar />

      <div style={{
        paddingTop:   'calc(var(--rj-navbar-height) + 48px)',
        paddingLeft:  '6vw',
        paddingRight: '6vw',
        maxWidth:     '1320px',
        margin:       '0 auto',
      }}>

        {/* Back link */}
        <motion.div
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease }}
          style={{ marginBottom: '40px' }}
        >
          <Link
            href="/catalog"
            style={{
              display:        'inline-flex',
              alignItems:     'center',
              gap:            '8px',
              fontFamily:     'var(--font-inter, sans-serif)',
              fontSize:       '13px',
              color:          '#6A7A88',
              textDecoration: 'none',
              transition:     'color 0.2s ease',
            }}
            onMouseEnter={e => (e.currentTarget.style.color = '#C9A84C')}
            onMouseLeave={e => (e.currentTarget.style.color = '#6A7A88')}
          >
            <ArrowLeft size={14} />
            Back to Catalog
          </Link>
        </motion.div>

        {/* ── Main product layout ── */}
        <div className="product-layout">

          {/* Left — image */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease }}
            style={{ position: 'sticky', top: 'calc(var(--rj-navbar-height) + 24px)' }}
          >
            <div style={{
              position:     'relative',
              aspectRatio:  '2/3',
              overflow:     'hidden',
              borderRadius: '4px',
              border:       '1px solid rgba(201,168,76,0.15)',
            }}>
              <Image
                src={product.image}
                alt={product.name}
                fill
                priority
                sizes="(max-width: 900px) 100vw, 50vw"
                style={{ objectFit: 'cover', objectPosition: 'center' }}
              />
              {product.badge && (
                <div style={{
                  position:      'absolute',
                  top:           '16px',
                  left:          '16px',
                  background:    'linear-gradient(135deg, #F0D77A 0%, #C9A84C 100%)',
                  color:         '#0A0F1C',
                  fontFamily:    'var(--font-inter, sans-serif)',
                  fontSize:      '9px',
                  fontWeight:    700,
                  letterSpacing: '2px',
                  textTransform: 'uppercase',
                  padding:       '6px 14px',
                  borderRadius:  '2px',
                  zIndex:        2,
                }}>
                  {product.badge}
                </div>
              )}
            </div>
          </motion.div>

          {/* Right — details */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease, delay: 0.1 }}
          >
            {/* Collection */}
            <p style={{
              fontFamily:    'var(--font-inter, sans-serif)',
              fontSize:      '10px',
              color:         '#C9A84C',
              letterSpacing: '4px',
              textTransform: 'uppercase',
              marginBottom:  '16px',
            }}>
              {product.collection}
            </p>

            {/* Name */}
            <h1 style={{
              fontFamily:   'var(--font-playfair, Georgia, serif)',
              fontSize:     'clamp(32px, 3.5vw, 48px)',
              color:        '#FFFFFF',
              fontWeight:   400,
              lineHeight:   1.1,
              marginBottom: '16px',
            }}>
              {product.name}
            </h1>

            {/* Material */}
            <p style={{
              fontFamily:   'var(--font-inter, sans-serif)',
              fontSize:     '13px',
              color:        '#5A6A7A',
              marginBottom: '32px',
              letterSpacing: '0.3px',
            }}>
              {product.material}
            </p>

            {/* Gold rule */}
            <div style={{
              width:        '48px',
              height:       '2px',
              background:   'linear-gradient(to right, #C9A84C, #E8C96D)',
              marginBottom: '32px',
            }} />

            {/* Description */}
            <p style={{
              fontFamily:   'var(--font-inter, sans-serif)',
              fontSize:     '16px',
              color:        '#A8B2BE',
              lineHeight:   1.85,
              marginBottom: '32px',
            }}>
              {product.description}
            </p>

            {/* Tags */}
            <div style={{
              display:      'flex',
              flexWrap:     'wrap',
              gap:          '8px',
              marginBottom: '40px',
            }}>
              {product.tags.map(tag => (
                <span
                  key={tag}
                  style={{
                    border:        '1px solid rgba(201,168,76,0.25)',
                    padding:       '6px 14px',
                    fontFamily:    'var(--font-inter, sans-serif)',
                    fontSize:      '11px',
                    color:         '#8A9AA8',
                    letterSpacing: '0.5px',
                    borderRadius:  '2px',
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Price block */}
            <div style={{
              background:   'rgba(201,168,76,0.04)',
              border:       '1px solid rgba(201,168,76,0.15)',
              borderRadius: '6px',
              padding:      '24px 28px',
              marginBottom: '32px',
            }}>
              <p style={{
                fontFamily:   'var(--font-playfair, Georgia, serif)',
                fontSize:     '32px',
                color:        '#F0EBE0',
                fontWeight:   400,
                lineHeight:   1,
                marginBottom: '6px',
              }}>
                {product.price}
              </p>
              <p style={{
                fontFamily: 'var(--font-inter, sans-serif)',
                fontSize:   '12px',
                color:      '#5A6A7A',
              }}>
                {product.priceNote}
              </p>
            </div>

            {/* CTAs */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <Link
                href="/contact"
                style={{
                  display:        'flex',
                  alignItems:     'center',
                  justifyContent: 'center',
                  gap:            '10px',
                  background:     'linear-gradient(135deg, #F0D77A 0%, #C9A84C 50%, #A67C2E 100%)',
                  color:          '#0A0F1C',
                  padding:        '18px 32px',
                  borderRadius:   '4px',
                  fontFamily:     'var(--font-inter, sans-serif)',
                  fontSize:       '13px',
                  fontWeight:     700,
                  letterSpacing:  '1.5px',
                  textTransform:  'uppercase',
                  textDecoration: 'none',
                  boxShadow:      '0 0 32px rgba(201,168,76,0.25)',
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
                Enquire About This Piece
                <ArrowRight size={14} />
              </Link>

              <Link
                href="/studio"
                style={{
                  display:        'flex',
                  alignItems:     'center',
                  justifyContent: 'center',
                  gap:            '10px',
                  background:     'transparent',
                  border:         '1px solid rgba(201,168,76,0.4)',
                  color:          '#C9A84C',
                  padding:        '17px 32px',
                  borderRadius:   '4px',
                  fontFamily:     'var(--font-inter, sans-serif)',
                  fontSize:       '13px',
                  fontWeight:     500,
                  letterSpacing:  '1.5px',
                  textTransform:  'uppercase',
                  textDecoration: 'none',
                  transition:     'all 0.25s ease',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background   = 'rgba(201,168,76,0.08)'
                  e.currentTarget.style.borderColor  = '#C9A84C'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background   = 'transparent'
                  e.currentTarget.style.borderColor  = 'rgba(201,168,76,0.4)'
                }}
              >
                Preview in Studio
              </Link>
            </div>

            {/* Trust line */}
            <p style={{
              fontFamily:  'var(--font-inter, sans-serif)',
              fontSize:    '12px',
              color:       '#3A4A58',
              marginTop:   '20px',
              lineHeight:  1.7,
              textAlign:   'center',
            }}>
              Custom-made to order · Free consultation · Delivered &amp; installed
            </p>
          </motion.div>
        </div>

      </div>

      {/* ── Related Products ── */}
      {related.length > 0 && (
        <section style={{
          padding:   '80px 6vw',
          marginTop: '80px',
          borderTop: '1px solid rgba(201,168,76,0.1)',
        }}>
          <div style={{ maxWidth: '1320px', margin: '0 auto' }}>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.7, ease }}
              style={{ marginBottom: '40px' }}
            >
              <p style={{
                fontFamily:    'var(--font-inter, sans-serif)',
                fontSize:      '11px',
                color:         '#C9A84C',
                letterSpacing: '4px',
                textTransform: 'uppercase',
                marginBottom:  '12px',
              }}>
                You May Also Like
              </p>
              <h2 style={{
                fontFamily: 'var(--font-playfair, Georgia, serif)',
                fontSize:   'clamp(28px, 3vw, 40px)',
                color:      '#FFFFFF',
                fontWeight: 400,
                lineHeight: 1.1,
              }}>
                More from the Collection
              </h2>
            </motion.div>

            <div className="related-grid">
              {related.map((p, i) => (
                <RelatedCard key={p.id} product={p} index={i} />
              ))}
            </div>

          </div>
        </section>
      )}

      <style>{`
        .product-layout {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 80px;
          align-items: start;
          padding-bottom: 80px;
        }
        .related-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 28px;
        }
        @media (max-width: 900px) {
          .product-layout {
            grid-template-columns: 1fr;
            gap: 40px;
          }
          .related-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        @media (max-width: 520px) {
          .related-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      <LandingFooter />
    </div>
  )
}

function RelatedCard({ product, index }: { product: Product; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.6, ease, delay: index * 0.08 }}
    >
      <Link href={`/catalog/${product.id}`} style={{ textDecoration: 'none', display: 'block' }}>
        <div style={{
          border:       '1px solid rgba(201,168,76,0.12)',
          borderRadius: '4px',
          overflow:     'hidden',
          transition:   'border-color 0.3s ease',
        }}
          onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(201,168,76,0.4)')}
          onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(201,168,76,0.12)')}
        >
          <div style={{ position: 'relative', aspectRatio: '2/3', overflow: 'hidden' }}>
            <Image
              src={product.image}
              alt={product.name}
              fill
              sizes="(max-width: 900px) 50vw, 33vw"
              style={{ objectFit: 'cover', objectPosition: 'center' }}
            />
          </div>
          <div style={{ padding: '16px 18px 20px' }}>
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
              fontSize:     '17px',
              color:        '#F0EBE0',
              fontWeight:   400,
              lineHeight:   1.25,
              marginBottom: '8px',
            }}>
              {product.name}
            </h3>
            <p style={{
              fontFamily: 'var(--font-playfair, Georgia, serif)',
              fontSize:   '15px',
              color:      '#F0EBE0',
              fontWeight: 400,
            }}>
              {product.price}
            </p>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
