'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import GoldenSeparator from '@/app/components/shared/GoldenSeparator'

const ease = [0.25, 0.1, 0.25, 1] as const

function fadeUp(delay: number) {
  return {
    initial:     { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport:    { once: true, margin: '-80px' },
    transition:  { duration: 0.7, ease, delay },
  }
}

function GoldRule() {
  return (
    <div style={{
      width:      '100%',
      height:     '1px',
      background: 'linear-gradient(to right, transparent, #C9A84C, transparent)',
    }} />
  )
}

export default function AboutCTA() {
  return (
    <section style={{
      background: '#0D1B2E',
      position:   'relative',
      overflow:   'hidden',
    }}>
      {/* Shimmer */}
      <div style={{
        position:      'absolute',
        inset:         0,
        background:    'radial-gradient(ellipse 80% 60% at 50% 50%, rgba(201,168,76,0.04) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <GoldenSeparator />

      <div style={{
        position:  'relative',
        zIndex:    10,
        maxWidth:  '700px',
        margin:    '0 auto',
        padding:   'clamp(80px, 10vw, 120px) 40px',
        textAlign: 'center',
      }}>
        <motion.p {...fadeUp(0.1)} style={{
          fontFamily:    'var(--font-inter, sans-serif)',
          fontSize:      '11px',
          color:         '#C9A84C',
          letterSpacing: '4px',
          textTransform: 'uppercase',
          marginBottom:  '24px',
        }}>
          Work With Us
        </motion.p>

        <motion.h2 {...fadeUp(0.2)} style={{
          fontFamily:   'var(--font-playfair, Georgia, serif)',
          fontSize:     'clamp(36px, 5vw, 56px)',
          color:        '#FFFFFF',
          fontWeight:   400,
          lineHeight:   1.1,
          marginBottom: 0,
        }}>
          Let&apos;s Build Something
        </motion.h2>

        <motion.h2 {...fadeUp(0.35)} style={{
          fontFamily:   'var(--font-playfair, Georgia, serif)',
          fontSize:     'clamp(36px, 5vw, 56px)',
          color:        '#C9A84C',
          fontStyle:    'italic',
          fontWeight:   400,
          lineHeight:   1.1,
          marginBottom: '28px',
        }}>
          Beautiful.
        </motion.h2>

        <motion.p {...fadeUp(0.45)} style={{
          fontFamily:  'var(--font-inter, sans-serif)',
          fontSize:    '18px',
          color:       '#A8B2BE',
          lineHeight:  1.7,
          maxWidth:    '480px',
          margin:      '0 auto 40px',
        }}>
          Whether you are a homeowner ready to transform your space or a showroom
          looking to partner — we would love to hear from you.
        </motion.p>

        {/* Button row */}
        <motion.div
          {...fadeUp(0.55)}
          style={{
            display:        'flex',
            alignItems:     'center',
            justifyContent: 'center',
            gap:            '16px',
            flexWrap:       'wrap',
          }}
        >
          <Link
            href="/contact"
            style={{
              display:        'inline-flex',
              alignItems:     'center',
              background:     'linear-gradient(135deg, #E8C96D 0%, #C9A84C 50%, #A67C2E 100%)',
              color:          '#0A0F1C',
              padding:        '16px 40px',
              borderRadius:   '3px',
              fontFamily:     'var(--font-inter, sans-serif)',
              fontSize:       '15px',
              fontWeight:     600,
              textDecoration: 'none',
              transition:     'all 0.3s ease',
              whiteSpace:     'nowrap',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.filter    = 'brightness(1.1)'
              e.currentTarget.style.transform = 'translateY(-2px)'
              e.currentTarget.style.boxShadow = '0 8px 24px rgba(201,168,76,0.3)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.filter    = ''
              e.currentTarget.style.transform = ''
              e.currentTarget.style.boxShadow = ''
            }}
          >
            Book a Consultation
          </Link>

          <Link
            href="/catalog"
            style={{
              display:        'inline-flex',
              alignItems:     'center',
              background:     'transparent',
              border:         '1.5px solid rgba(201,168,76,0.6)',
              color:          '#C9A84C',
              padding:        '16px 40px',
              borderRadius:   '3px',
              fontFamily:     'var(--font-inter, sans-serif)',
              fontSize:       '15px',
              fontWeight:     500,
              textDecoration: 'none',
              transition:     'all 0.3s ease',
              whiteSpace:     'nowrap',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background  = 'rgba(201,168,76,0.08)'
              e.currentTarget.style.borderColor = '#C9A84C'
              e.currentTarget.style.transform   = 'translateY(-2px)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background  = 'transparent'
              e.currentTarget.style.borderColor = 'rgba(201,168,76,0.6)'
              e.currentTarget.style.transform   = ''
            }}
          >
            View the Catalog
          </Link>
        </motion.div>

        <motion.p {...fadeUp(0.65)} style={{
          fontFamily:  'var(--font-inter, sans-serif)',
          fontSize:    '13px',
          color:       '#6B7A8D',
          marginTop:   '28px',
          lineHeight:  1.7,
        }}>
          Based in Nyeri, Kenya.<br />
          We serve clients across the country — in your home, in our studio, or on a call.
        </motion.p>
      </div>

      <GoldRule />
    </section>
  )
}
