'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'

const ease = [0.25, 0.1, 0.25, 1] as const

const VALUES = [
  {
    number:      '01',
    name:        'We Listen First.',
    description: "We won't push a fabric on you. We ask about your room, your family, how you actually live in your space.",
  },
  {
    number:      '02',
    name:        'We Make It Last.',
    description: 'We choose fabrics built to hold their colour, drape, and shape through years of Kenyan sunlight and weather.',
  },
  {
    number:      '03',
    name:        'Proudly Nyeri.',
    description: "We know Kenyan homes — how the light moves through your windows, how the seasons differ. That understanding doesn't come from a catalog.",
  },
]

export default function ValuesSection() {
  return (
    <section style={{
      background: '#0D1B2E',
      padding:    '120px 6vw',
      borderTop:  '1px solid rgba(201,168,76,0.12)',
    }}>
      <div style={{ maxWidth: '1240px', margin: '0 auto' }}>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7, ease }}
          style={{ marginBottom: '80px' }}
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
            fontSize:   'clamp(36px, 4vw, 54px)',
            color:      '#FFFFFF',
            fontWeight: 400,
            lineHeight: 1.1,
          }}>
            Three things we<br />
            <em style={{ color: '#C9A84C' }}>never compromise on.</em>
          </h2>
        </motion.div>

        {/* Value rows */}
        <div>
          {VALUES.map((value, i) => (
            <ValueRow key={value.number} value={value} index={i} />
          ))}
        </div>

      </div>

      <style>{`
        .value-row-inner {
          display: grid;
          grid-template-columns: 64px 1fr 1fr;
          gap: 48px;
          align-items: start;
        }
        @media (max-width: 768px) {
          .value-row-inner {
            grid-template-columns: 40px 1fr;
            gap: 24px;
          }
          .value-row-inner p:last-child {
            grid-column: 1 / -1;
            padding-top: 0 !important;
            max-width: 100% !important;
          }
        }
      `}</style>
    </section>
  )
}

function ValueRow({ value, index }: { value: typeof VALUES[number]; index: number }) {
  const [hovered, setHovered] = useState(false)

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
      {/* Top rule */}
      <div style={{
        width:      '100%',
        height:     '1px',
        background: hovered
          ? 'linear-gradient(to right, transparent, rgba(201,168,76,0.5) 20%, rgba(201,168,76,0.5) 80%, transparent)'
          : 'linear-gradient(to right, transparent, rgba(201,168,76,0.15) 20%, rgba(201,168,76,0.15) 80%, transparent)',
        transition: 'background 0.4s ease',
      }} />

      <div
        className="value-row-inner"
        style={{ padding: '48px 0', alignItems: 'flex-start' }}
      >
        {/* Number tag */}
        <p style={{
          fontFamily:    'var(--font-inter, sans-serif)',
          fontSize:      '11px',
          color:         hovered ? '#C9A84C' : 'rgba(201,168,76,0.4)',
          letterSpacing: '3px',
          paddingTop:    '10px',
          transition:    'color 0.3s ease',
          flexShrink:    0,
        }}>
          {value.number}
        </p>

        {/* Value name */}
        <h3 style={{
          fontFamily:  'var(--font-playfair, Georgia, serif)',
          fontSize:    'clamp(36px, 4.5vw, 62px)',
          fontWeight:  400,
          lineHeight:  1.05,
          color:       hovered ? '#FFFFFF' : 'rgba(255,255,255,0.75)',
          transition:  'color 0.35s ease',
          letterSpacing: '-0.01em',
        }}>
          {value.name}
        </h3>

        {/* Description */}
        <p style={{
          fontFamily: 'var(--font-inter, sans-serif)',
          fontSize:   '15px',
          color:      hovered ? '#A8B2BE' : '#5A6A7A',
          lineHeight: 1.8,
          maxWidth:   '340px',
          paddingTop: '8px',
          transition: 'color 0.3s ease',
        }}>
          {value.description}
        </p>
      </div>

      {/* Bottom rule only on last item */}
      {index === VALUES.length - 1 && (
        <div style={{
          width:      '100%',
          height:     '1px',
          background: hovered
            ? 'linear-gradient(to right, transparent, rgba(201,168,76,0.5) 20%, rgba(201,168,76,0.5) 80%, transparent)'
            : 'linear-gradient(to right, transparent, rgba(201,168,76,0.15) 20%, rgba(201,168,76,0.15) 80%, transparent)',
          transition: 'background 0.4s ease',
        }} />
      )}
    </motion.div>
  )
}
