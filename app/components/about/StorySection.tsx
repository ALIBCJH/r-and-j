'use client'

import { motion } from 'framer-motion'

const ease = [0.25, 0.1, 0.25, 1] as const

const PARAGRAPHS = [
  'Every year, thousands of Kenyan homeowners make expensive curtain decisions based on a small fabric swatch and their imagination. They guess, commit, and hope. Too often, what arrives looks nothing like what they envisioned.',
  'R&J Interiors started with a conviction that this was wrong. That a client spending KES 50,000 to KES 300,000 on curtains deserved to see exactly what they were getting — before a single thread was cut.',
  'So we built the answer. A VR configurator that puts the client inside their redesigned room at full scale. Where they can dial any color, choose any fabric, and walk around their space before making a single decision.',
  'We are based in Nyeri, Kenya. We serve clients across the country — in their homes, in our studio, or on a call. And we own every step of the process, from the first visualization to the final curtain hung at your window.',
]

export default function StorySection() {
  return (
    <section style={{
      padding:   'clamp(80px, 10vw, 120px) 6vw',
      borderTop: '1px solid rgba(201,168,76,0.12)',
    }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>

        {/* Label */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, ease }}
          style={{
            fontFamily:    'var(--font-inter, sans-serif)',
            fontSize:      '11px',
            color:         '#C9A84C',
            letterSpacing: '4px',
            textTransform: 'uppercase',
            marginBottom:  '20px',
          }}
        >
          How It Started
        </motion.p>

        {/* Heading */}
        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.75, ease, delay: 0.1 }}
          style={{
            fontFamily:   'var(--font-playfair, Georgia, serif)',
            fontSize:     'clamp(32px, 3.5vw, 42px)',
            color:        '#FFFFFF',
            fontWeight:   400,
            lineHeight:   1.2,
            marginBottom: '40px',
          }}
        >
          A Question That<br />Became a Company
        </motion.h2>

        {/* Gold rule */}
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          whileInView={{ scaleX: 1, opacity: 1 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, ease, delay: 0.2 }}
          style={{
            width:           '56px',
            height:          '2px',
            background:      'linear-gradient(to right, #C9A84C, #E8C96D)',
            marginBottom:    '40px',
            transformOrigin: 'left',
          }}
        />

        {/* Paragraphs */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {PARAGRAPHS.map((para, i) => (
            <motion.p
              key={i}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.65, ease, delay: 0.1 + i * 0.1 }}
              style={{
                fontFamily: 'var(--font-inter, sans-serif)',
                fontSize:   '16px',
                color:      '#A8B2BE',
                lineHeight: 1.85,
              }}
            >
              {para}
            </motion.p>
          ))}
        </div>

      </div>
    </section>
  )
}
