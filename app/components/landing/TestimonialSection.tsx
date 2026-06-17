'use client'

import { motion } from 'framer-motion'

const ease = [0.25, 0.1, 0.25, 1] as const

export default function TestimonialSection() {
  return (
    <section style={{ background: '#0D1B2E', padding: '120px 6vw', borderTop: '1px solid rgba(201,168,76,0.12)' }}>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 1, ease }}
        style={{ maxWidth: '760px', margin: '0 auto', textAlign: 'center' }}
      >
        {/* Quote mark */}
        <div style={{
          fontFamily:   'Georgia, serif',
          fontSize:     '80px',
          color:        '#C9A84C',
          opacity:      0.35,
          lineHeight:   0.8,
          marginBottom: '8px',
          userSelect:   'none',
        }}>
          ❝
        </div>

        <blockquote style={{
          fontFamily:   'var(--font-playfair, Georgia, serif)',
          fontSize:     'clamp(22px, 2.5vw, 32px)',
          color:        '#FFFFFF',
          fontStyle:    'italic',
          lineHeight:   1.7,
          marginBottom: '48px',
        }}>
          Our goal is simple — every client should see their space before they
          transform it. No guessing. No regrets. Just certainty.
        </blockquote>

        <div style={{ width: '40px', height: '1px', background: 'linear-gradient(90deg, transparent, #C9A84C, transparent)', margin: '0 auto 32px' }} />

        <p style={{
          fontFamily:    'var(--font-inter, sans-serif)',
          fontSize:      '12px',
          color:         '#C9A84C',
          letterSpacing: '3px',
          textTransform: 'uppercase',
        }}>
          — R&amp;J Interiors Design Philosophy
        </p>
      </motion.div>
    </section>
  )
}
