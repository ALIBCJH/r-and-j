'use client'

import { motion } from 'framer-motion'
import GoldenSeparator from '@/app/components/shared/GoldenSeparator'

const ease = [0.25, 0.1, 0.25, 1] as const

export default function AboutHero() {
  return (
    <section style={{
      position:       'relative',
      height:         '85vh',
      minHeight:      '580px',
      display:        'flex',
      flexDirection:  'column',
      justifyContent: 'center',
      alignItems:     'center',
      overflow:       'hidden',
      background:     '#0D1B2E',
    }}>
      {/* Radial gold glow */}
      <div style={{
        position:      'absolute',
        inset:         0,
        background:    'radial-gradient(ellipse 50% 40% at 50% 55%, rgba(201,168,76,0.06) 0%, transparent 70%)',
        pointerEvents: 'none',
        zIndex:        1,
      }} />

      {/* GoldenSeparator at top */}
      <div style={{ position: 'absolute', top: 'var(--rj-navbar-height)', left: 0, right: 0, zIndex: 2 }}>
        <GoldenSeparator />
      </div>

      {/* Content */}
      <div style={{
        position:  'relative',
        zIndex:    3,
        textAlign: 'center',
        padding:   '0 clamp(24px, 6vw, 80px)',
      }}>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease, delay: 0.1 }}
          style={{
            fontFamily:    'var(--font-inter, sans-serif)',
            fontSize:      '11px',
            color:         '#C9A84C',
            letterSpacing: '5px',
            textTransform: 'uppercase',
            marginBottom:  '36px',
          }}
        >
          Our Story
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.85, ease, delay: 0.25 }}
          style={{
            fontFamily: 'var(--font-playfair, Georgia, serif)',
            fontSize:   'clamp(56px, 8vw, 110px)',
            color:      '#FFFFFF',
            fontWeight: 400,
            lineHeight: 1.0,
            margin:     0,
          }}
        >
          Built by Two.
        </motion.h1>

        <motion.h1
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.85, ease, delay: 0.45 }}
          style={{
            fontFamily: 'var(--font-playfair, Georgia, serif)',
            fontSize:   'clamp(56px, 8vw, 110px)',
            color:      '#C9A84C',
            fontStyle:  'italic',
            fontWeight: 400,
            lineHeight: 1.0,
            margin:     0,
          }}
        >
          Designed for All.
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ duration: 0.9, ease, delay: 0.7 }}
          style={{
            width:      'clamp(40px, 6vw, 80px)',
            height:     '1px',
            background: 'rgba(201,168,76,0.5)',
            margin:     '40px auto 0',
          }}
        />
      </div>

      {/* Bottom gold rule */}
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
