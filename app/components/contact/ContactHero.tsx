'use client'

import { motion } from 'framer-motion'
import GoldenSeparator from '@/app/components/shared/GoldenSeparator'

const ease = [0.25, 0.1, 0.25, 1] as const

export default function ContactHero() {
  return (
    <section style={{
      position:       'relative',
      minHeight:      '50vh',
      paddingTop:     'calc(var(--rj-navbar-height) + 60px)',
      paddingBottom:  '80px',
      display:        'flex',
      flexDirection:  'column',
      justifyContent: 'center',
      alignItems:     'center',
      overflow:       'hidden',
      background:     '#0A0F1C',
    }}>
      {/* Radial gold glow */}
      <div style={{
        position:      'absolute',
        inset:         0,
        background:    'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(201,168,76,0.05) 0%, transparent 70%)',
        pointerEvents: 'none',
        zIndex:        1,
      }} />

      {/* GoldenSeparator below navbar */}
      <div style={{ position: 'absolute', top: 'var(--rj-navbar-height)', left: 0, right: 0, zIndex: 2 }}>
        <GoldenSeparator />
      </div>

      {/* Content */}
      <div style={{
        position:  'relative',
        zIndex:    3,
        textAlign: 'center',
        padding:   '0 clamp(24px, 6vw, 80px)',
        maxWidth:  '760px',
      }}>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease, delay: 0.1 }}
          style={{
            fontFamily:    'var(--font-inter, sans-serif)',
            fontSize:      '11px',
            color:         '#C9A84C',
            letterSpacing: '4px',
            textTransform: 'uppercase',
            marginBottom:  '24px',
          }}
        >
          Begin Your Journey
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, ease, delay: 0.25 }}
          style={{
            fontFamily:   'var(--font-playfair, Georgia, serif)',
            fontSize:     'clamp(40px, 5.5vw, 64px)',
            color:        '#FFFFFF',
            fontWeight:   400,
            lineHeight:   1.1,
            marginBottom: 0,
          }}
        >
          Let&apos;s Build Something
        </motion.h1>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, ease, delay: 0.4 }}
          style={{
            fontFamily:   'var(--font-playfair, Georgia, serif)',
            fontSize:     'clamp(40px, 5.5vw, 64px)',
            color:        '#C9A84C',
            fontStyle:    'italic',
            fontWeight:   400,
            lineHeight:   1.1,
            marginBottom: '32px',
          }}
        >
          Beautiful.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease, delay: 0.55 }}
          style={{
            fontFamily:  'var(--font-inter, sans-serif)',
            fontSize:    '18px',
            color:       '#A8B2BE',
            lineHeight:  1.75,
            maxWidth:    '520px',
            margin:      '0 auto',
          }}
        >
          Whether it is your home or your office — tell us about your space
          and we will take it from there. Design, manufacture, delivery,
          and installation. All handled by us. We respond within 24 hours.
        </motion.p>
      </div>

      {/* Bottom rule */}
      <div style={{
        position:   'absolute',
        bottom:     0,
        left:       0,
        right:      0,
        height:     '1px',
        background: 'rgba(201,168,76,0.12)',
        zIndex:     2,
      }} />
    </section>
  )
}
