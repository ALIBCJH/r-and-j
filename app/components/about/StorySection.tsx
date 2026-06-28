'use client'

import { motion } from 'framer-motion'

const ease = [0.25, 0.1, 0.25, 1] as const

const PARAGRAPHS = [
  "You've probably been there. You fall in love with a fabric swatch at the shop — the colour, the way it catches the light — so you order it. Then it arrives, you hang it, and something is just off. The room doesn't feel right. The money is gone. And you're stuck living with a decision you can't easily undo.",
  "That moment is exactly why R&J Interiors exists. We were tired of watching good people make expensive guesses. So we built a simple way for you to see your curtains in your actual room, with your actual light, before you commit to anything.",
  "We are based in Nyeri and we serve families across Kenya — in living rooms, bedrooms, offices, and dining spaces. We understand how Kenyan homes are built, how the afternoon sun moves through your windows, and what fabrics hold up through our seasons.",
  "Every order is handled by us from start to finish. We pick up the phone. We ask the right questions. We show up. And we don't consider the job done until you look at your windows and feel like your home finally looks the way you always imagined it could.",
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
          We Were Tired of<br />Watching People Guess
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
