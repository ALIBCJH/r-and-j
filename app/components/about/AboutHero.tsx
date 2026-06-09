'use client'

import { motion } from 'framer-motion'
import GoldenSeparator from '@/app/components/shared/GoldenSeparator'

const ease = [0.25, 0.1, 0.25, 1] as const

export default function AboutHero() {
  return (
    <section style={{
      position:       'relative',
      height:         '62vh',
      minHeight:      '520px',
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

      {/* GoldenSeparator at top */}
      <div style={{ position: 'absolute', top: 'var(--rj-navbar-height)', left: 0, right: 0, zIndex: 2 }}>
        <GoldenSeparator />
      </div>

      {/* Content */}
      <div style={{
        position:   'relative',
        zIndex:     3,
        textAlign:  'center',
        padding:    '0 clamp(24px, 6vw, 80px)',
        maxWidth:   '760px',
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
          Our Story
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
          Built by Two.
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
            marginBottom: '28px',
          }}
        >
          Designed for All.
        </motion.h1>

        {/* Company name */}
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease, delay: 0.5 }}
          style={{
            fontFamily:    'var(--font-playfair, Georgia, serif)',
            fontSize:      '15px',
            color:         '#C9A84C',
            letterSpacing: '6px',
            textTransform: 'uppercase',
            marginBottom:  '20px',
          }}
        >
          R&amp;J Interiors
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease, delay: 0.6 }}
          style={{
            fontFamily:   'var(--font-inter, sans-serif)',
            fontSize:     '17px',
            color:        '#A8B2BE',
            lineHeight:   1.75,
            maxWidth:     '540px',
            margin:       '0 auto 20px',
          }}
        >
          Born from a simple question — why do people have to imagine what their
          home will look like? We decided to answer it.
        </motion.p>

        {/* Motto */}
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease, delay: 0.75 }}
          style={{
            fontFamily:    'var(--font-playfair, Georgia, serif)',
            fontSize:      '15px',
            color:         '#C9A84C',
            fontStyle:     'italic',
            letterSpacing: '0.5px',
          }}
        >
          Bringing imagination into reality.
        </motion.p>
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
