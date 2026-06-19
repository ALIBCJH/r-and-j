'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'

const ease = [0.25, 0.1, 0.25, 1] as const

function fadeUp(delay: number) {
  return {
    initial:    { opacity: 0, y: 20 },
    whileInView:{ opacity: 1, y: 0 },
    viewport:   { once: true, margin: '-80px' },
    transition: { duration: 0.7, ease, delay },
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

export default function ExperienceCTA() {
  return (
    <section style={{
      background: '#111113',
      position:   'relative',
      overflow:   'hidden',
    }}>
      {/* Shimmer overlay */}
      <div style={{
        position:      'absolute',
        inset:         0,
        background:    'radial-gradient(ellipse 80% 60% at 50% 50%, rgba(201,168,76,0.04) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <GoldRule />

      <div style={{
        position:   'relative',
        zIndex:     10,
        maxWidth:   '700px',
        margin:     '0 auto',
        padding:    '140px 40px',
        textAlign:  'center',
      }}>

        <motion.p {...fadeUp(0.1)} style={{
          fontFamily:    'var(--font-inter, sans-serif)',
          fontSize:      '11px',
          color:         '#C9A84C',
          letterSpacing: '4px',
          textTransform: 'uppercase',
          marginBottom:  '24px',
        }}>
          Begin Your Journey
        </motion.p>

        <motion.h2 {...fadeUp(0.2)} style={{
          fontFamily: 'var(--font-playfair, Georgia, serif)',
          fontSize:   'clamp(40px, 5vw, 64px)',
          color:      '#FFFFFF',
          fontWeight: 400,
          lineHeight: 1.1,
          marginBottom: 0,
        }}>
          Ready to See Your Space
        </motion.h2>

        <motion.h2 {...fadeUp(0.35)} style={{
          fontFamily:   'var(--font-playfair, Georgia, serif)',
          fontSize:     'clamp(40px, 5vw, 64px)',
          color:        '#C9A84C',
          fontStyle:    'italic',
          fontWeight:   400,
          lineHeight:   1.1,
          marginBottom: '28px',
        }}>
          Differently?
        </motion.h2>

        <motion.p {...fadeUp(0.45)} style={{
          fontFamily:   'var(--font-inter, sans-serif)',
          fontSize:     '18px',
          color:        '#A8B2BE',
          lineHeight:   1.7,
          maxWidth:     '500px',
          margin:       '0 auto 16px',
        }}>
          Book a consultation with our design team. We will walk you through
          the configurator, help you explore our fabric collection, and deliver
          a space you have already fallen in love with.
        </motion.p>

        <motion.p {...fadeUp(0.5)} style={{
          fontFamily:   'var(--font-inter, sans-serif)',
          fontSize:     '14px',
          color:        '#C9A84C',
          marginBottom: '40px',
        }}>
          Consultation from KES 2,500 — credited toward your order.
        </motion.p>

        {/* Button row with decorative side lines */}
        <motion.div
          {...fadeUp(0.6)}
          style={{
            display:    'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap:        '16px',
            flexWrap:   'wrap',
          }}
        >
          {/* Left line */}
          <div className="hidden sm:block" style={{
            width:      '80px',
            height:     '1px',
            background: 'rgba(201,168,76,0.3)',
          }} />

          {/* Filled button */}
          <Link
            href="/contact"
            style={{
              display:       'inline-flex',
              alignItems:    'center',
              background:    'linear-gradient(135deg, #E8C96D 0%, #C9A84C 50%, #A67C2E 100%)',
              color:         '#0A0F1C',
              padding:       '18px 48px',
              borderRadius:  '3px',
              fontFamily:    'var(--font-inter, sans-serif)',
              fontSize:      '15px',
              fontWeight:    600,
              textDecoration:'none',
              transition:    'all 0.3s ease',
              whiteSpace:    'nowrap',
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

          {/* Outlined button */}
          <Link
            href="/catalog"
            style={{
              display:       'inline-flex',
              alignItems:    'center',
              background:    'transparent',
              border:        '1.5px solid rgba(201,168,76,0.6)',
              color:         '#C9A84C',
              padding:       '18px 48px',
              borderRadius:  '3px',
              fontFamily:    'var(--font-inter, sans-serif)',
              fontSize:      '15px',
              fontWeight:    500,
              textDecoration:'none',
              transition:    'all 0.3s ease',
              whiteSpace:    'nowrap',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background   = 'rgba(201,168,76,0.06)'
              e.currentTarget.style.borderColor  = '#C9A84C'
              e.currentTarget.style.transform    = 'translateY(-2px)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background   = 'transparent'
              e.currentTarget.style.borderColor  = 'rgba(201,168,76,0.6)'
              e.currentTarget.style.transform    = ''
            }}
          >
            Explore the Catalog
          </Link>

          {/* Right line */}
          <div className="hidden sm:block" style={{
            width:      '80px',
            height:     '1px',
            background: 'rgba(201,168,76,0.3)',
          }} />
        </motion.div>

        <motion.p {...fadeUp(0.7)} style={{
          fontFamily: 'var(--font-inter, sans-serif)',
          fontSize:   '12px',
          color:      '#6B7A8D',
          marginTop:  '20px',
        }}>
          Currently serving Nairobi, Nyeri, and surroundings. Remote consultations available.
        </motion.p>

      </div>

      <GoldRule />
    </section>
  )
}
