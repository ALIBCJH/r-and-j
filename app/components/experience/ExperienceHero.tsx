'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import GoldenSeparator from '@/app/components/shared/GoldenSeparator'

const ease = [0.25, 0.1, 0.25, 1] as const

export default function ExperienceHero() {
  return (
    <section
      style={{
        position:       'relative',
        minHeight:      '100vh',
        display:        'flex',
        flexDirection:  'column',
        justifyContent: 'center',
        overflow:       'hidden',
        background:     '#111113',
      }}
    >
      {/* ── Morning light hero image — full-bleed background ── */}
      <motion.div
        initial={{ opacity: 0, scale: 1.04 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 2.2, ease }}
        style={{
          position:      'absolute',
          inset:         0,
          zIndex:        0,
          pointerEvents: 'none',
        }}
      >
        <Image
          src="/assets/morning_light_sheer.png"
          alt=""
          fill
          sizes="100vw"
          style={{ objectFit: 'cover', objectPosition: 'center center' }}
          priority
        />
        {/* Dark overlay so text stays legible */}
        <div style={{
          position:   'absolute',
          inset:      0,
          background: 'linear-gradient(to right, rgba(17,17,19,0.90) 40%, rgba(17,17,19,0.50) 75%, rgba(17,17,19,0.20) 100%)',
        }} />
        {/* Bottom fade into next section */}
        <div style={{
          position:   'absolute',
          bottom:     0,
          left:       0,
          right:      0,
          height:     '220px',
          background: 'linear-gradient(to bottom, transparent, #111113)',
        }} />
      </motion.div>

      {/* ── GoldenSeparator below navbar ── */}
      <div style={{ position: 'absolute', top: 'var(--rj-navbar-height)', left: 0, right: 0, zIndex: 2 }}>
        <GoldenSeparator />
      </div>

      {/* ── Main content ── */}
      <div
        style={{
          position:  'relative',
          zIndex:    3,
          padding:   'calc(var(--rj-navbar-height) + 72px) clamp(48px, 10vw, 140px) 80px',
          maxWidth:  '780px',
        }}
      >
        <motion.h1
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.85, ease, delay: 0.45 }}
          style={{
            fontFamily:   'var(--font-playfair, Georgia, serif)',
            fontSize:     'clamp(44px, 5.5vw, 82px)',
            color:        '#FFFFFF',
            fontWeight:   400,
            lineHeight:   1.06,
            marginBottom: '0',
          }}
        >
          Step Inside Your Home.
        </motion.h1>

        <motion.h1
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.85, ease, delay: 0.6 }}
          style={{
            fontFamily:   'var(--font-playfair, Georgia, serif)',
            fontSize:     'clamp(44px, 5.5vw, 82px)',
            color:        '#E8C96D',
            fontStyle:    'italic',
            fontWeight:   400,
            lineHeight:   1.06,
            marginBottom: '36px',
          }}
        >
          Before It Exists.
        </motion.h1>

        {/* Gold rule */}
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ duration: 0.7, ease, delay: 0.7 }}
          style={{
            width:           '56px',
            height:          '2px',
            background:      'linear-gradient(to right, #C9A84C, #E8C96D)',
            marginBottom:    '28px',
            transformOrigin: 'left',
          }}
        />

        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease, delay: 0.78 }}
          style={{
            fontFamily:   'var(--font-inter, sans-serif)',
            fontSize:     'clamp(15px, 1.6vw, 18px)',
            color:        '#A8B2BE',
            lineHeight:   1.85,
            maxWidth:     '480px',
            marginBottom: '0',
          }}
        >
          Your fabrics. Your room. Every drape seen at full scale — before the first cut.
        </motion.p>
      </div>

      {/* ── Bottom scroll cue ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, ease, delay: 1.4 }}
        style={{
          position:      'absolute',
          bottom:        '40px',
          left:          '50%',
          transform:     'translateX(-50%)',
          zIndex:        3,
          display:       'flex',
          flexDirection: 'column',
          alignItems:    'center',
          gap:           '8px',
        }}
      >
        <span style={{
          fontFamily:    'var(--font-inter, sans-serif)',
          fontSize:      '10px',
          color:         'rgba(201,168,76,0.5)',
          letterSpacing: '3px',
          textTransform: 'uppercase',
        }}>
          Scroll
        </span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            width:      '1px',
            height:     '40px',
            background: 'linear-gradient(to bottom, rgba(201,168,76,0.6), transparent)',
          }}
        />
      </motion.div>
    </section>
  )
}
