'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useIsMobile } from '@/app/components/style-picker/hooks/useIsMobile'

const ease = [0.25, 0.1, 0.25, 1] as const

const VALUES = [
  {
    number: '01',
    name:   'We Listen First.',
    desc:   'Before we talk fabric, we learn your home — your light, your layout, and how you actually live in the room. The curtain is the last decision, not the first.',
  },
  {
    number: '02',
    name:   'We Make It Last.',
    desc:   'Full linings, reinforced headers, hardware that holds. We build curtains to outlive the trend that inspired them — and the season you bought them in.',
  },
  {
    number: '03',
    name:   'Proudly Nyeri.',
    desc:   'Made by Kenyan hands for Kenyan homes, with the patience that only comes from where we are from. When we say a slot, we keep it.',
  },
]

export default function ValuesSection() {
  const isMobile = useIsMobile() === true

  return (
    <section style={{
      background: '#0D1B2E',
      padding:    isMobile ? '88px 24px' : '120px 6vw',
      borderTop:  '1px solid rgba(201,168,76,0.12)',
    }}>
      <div style={{ maxWidth: '1240px', margin: '0 auto' }}>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7, ease }}
          style={{ marginBottom: isMobile ? '48px' : '80px' }}
        >
          <p style={{
            fontFamily:    'var(--font-inter, sans-serif)',
            fontSize:      '11px',
            color:         '#C9A84C',
            letterSpacing: '5px',
            textTransform: 'uppercase',
            marginBottom:  '16px',
          }}>
            What We Stand For
          </p>
          <h2 style={{
            fontFamily: 'var(--font-playfair, Georgia, serif)',
            fontSize:   'clamp(32px, 4vw, 54px)',
            color:      '#FFFFFF',
            fontWeight: 400,
            lineHeight: 1.1,
            margin:     0,
          }}>
            Three things we{' '}
            <em style={{ color: '#C9A84C' }}>never compromise on.</em>
          </h2>
        </motion.div>

        <div>
          {VALUES.map((value, i) => (
            <ValueRow key={value.number} value={value} index={i} isMobile={isMobile} />
          ))}
        </div>

      </div>
    </section>
  )
}

function ValueRow({
  value,
  index,
  isMobile,
}: {
  value: typeof VALUES[number]
  index: number
  isMobile: boolean
}) {
  const [hovered, setHovered] = useState(false)
  // On touch devices there is no hover — show the "active" treatment by default.
  const active = hovered || isMobile

  const rule = (on: boolean) => ({
    width:      '100%',
    height:     '1px',
    background: on
      ? 'linear-gradient(to right, transparent, rgba(201,168,76,0.5) 20%, rgba(201,168,76,0.5) 80%, transparent)'
      : 'linear-gradient(to right, transparent, rgba(201,168,76,0.15) 20%, rgba(201,168,76,0.15) 80%, transparent)',
    transition: 'background 0.4s ease',
  })

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.75, ease, delay: index * 0.12 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ cursor: 'default' }}
    >
      <div style={rule(active)} />

      <div style={{
        display:             'grid',
        gridTemplateColumns: isMobile ? '1fr' : '64px 1fr',
        gap:                 isMobile ? '14px' : '48px',
        alignItems:          'start',
        padding:             isMobile ? '36px 0' : '52px 0',
      }}>
        <p style={{
          fontFamily:    'var(--font-inter, sans-serif)',
          fontSize:      '11px',
          color:         active ? '#C9A84C' : 'rgba(201,168,76,0.4)',
          letterSpacing: '3px',
          transition:    'color 0.3s ease',
          margin:        0,
        }}>
          {value.number}
        </p>

        <div>
          <h3 style={{
            fontFamily:    'var(--font-playfair, Georgia, serif)',
            fontSize:      'clamp(30px, 5.5vw, 68px)',
            fontWeight:    400,
            lineHeight:    1.05,
            color:         active ? '#FFFFFF' : 'rgba(255,255,255,0.7)',
            transition:    'color 0.35s ease',
            letterSpacing: '-0.01em',
            margin:        0,
          }}>
            {value.name}
          </h3>
          <p style={{
            fontFamily: 'var(--font-inter, sans-serif)',
            fontSize:   isMobile ? '15px' : '16px',
            color:      'rgba(202,212,224,0.6)',
            lineHeight: 1.75,
            maxWidth:   '560px',
            marginTop:  isMobile ? '14px' : '20px',
            marginBottom: 0,
          }}>
            {value.desc}
          </p>
        </div>
      </div>

      {index === VALUES.length - 1 && <div style={rule(active)} />}
    </motion.div>
  )
}
