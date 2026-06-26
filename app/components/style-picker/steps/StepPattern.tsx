'use client'

import { motion } from 'framer-motion'

interface Props {
  value:    string | null
  onChange: (v: string) => void
}

const SAGE = '#4A5C44'

// ── PLACEHOLDER: replace with real pattern catalogue + preview swatches ──
const PATTERNS = [
  {
    id:    'solid',
    label: 'Solid',
    desc:  'One clean colour, no pattern — timeless.',
    swatch: <div style={{ width: '100%', height: '100%', background: '#D4CFC8', borderRadius: 8 }} />,
  },
  {
    id:    'subtle-stripe',
    label: 'Subtle Stripe',
    desc:  'Thin tonal stripes, visible only up close.',
    swatch: (
      <div style={{ width: '100%', height: '100%', borderRadius: 8, overflow: 'hidden', background: '#D4CFC8' }}>
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} style={{ height: '12.5%', background: i % 2 === 0 ? '#C8C3BC' : '#D4CFC8' }} />
        ))}
      </div>
    ),
  },
  {
    id:    'texture',
    label: 'Textured Weave',
    desc:  'Surface interest from the weave itself — subtle depth.',
    swatch: (
      <div style={{ width: '100%', height: '100%', borderRadius: 8, overflow: 'hidden', background: '#CCC7C0' }}>
        {Array.from({ length: 6 }).map((_, row) => (
          <div key={row} style={{ display: 'flex', height: '16.6%' }}>
            {Array.from({ length: 6 }).map((_, col) => (
              <div key={col} style={{ flex: 1, background: (row + col) % 2 === 0 ? '#D2CEC7' : '#C5C0B9' }} />
            ))}
          </div>
        ))}
      </div>
    ),
  },
  {
    id:    'geometric',
    label: 'Geometric',
    desc:  'Repeating angular motif — bold and contemporary.',
    swatch: (
      <svg viewBox="0 0 60 60" style={{ width: '100%', height: '100%', borderRadius: 8 }}>
        <rect width="60" height="60" fill="#D4CFC8"/>
        <path d="M0 0 L30 30 L60 0 M0 60 L30 30 L60 60" stroke="#B8B3AB" strokeWidth="1.5" fill="none"/>
        <path d="M0 30 L30 0 M0 30 L30 60 M60 30 L30 0 M60 30 L30 60" stroke="#C8C3BC" strokeWidth="1" fill="none"/>
      </svg>
    ),
  },
]

export function StepPattern({ value, onChange }: Props) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
      {PATTERNS.map((pat, i) => {
        const selected = value === pat.id
        return (
          <motion.button
            key={pat.id}
            onClick={() => onChange(pat.id)}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.26, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
            style={{
              display:       'flex',
              flexDirection: 'column',
              gap:           10,
              padding:       12,
              borderRadius:  14,
              border:        `2px solid ${selected ? SAGE : '#E2DDD6'}`,
              background:    selected ? '#EEF0E8' : '#FFFFFF',
              cursor:        'pointer',
              textAlign:     'left',
              outline:       'none',
              transition:    'border-color 0.2s, background 0.2s',
              minHeight:     44,
            }}
          >
            {/* Swatch preview */}
            <div style={{
              width:    '100%',
              aspectRatio: '1',
              position:    'relative',
            }}>
              {pat.swatch}
              {selected && (
                <div style={{
                  position:        'absolute',
                  top:             6,
                  right:           6,
                  width:           20,
                  height:          20,
                  borderRadius:    '50%',
                  background:      SAGE,
                  display:         'flex',
                  alignItems:      'center',
                  justifyContent:  'center',
                }}>
                  <svg width="9" height="9" viewBox="0 0 24 24" fill="none"
                    stroke="#FAFAF8" strokeWidth="3.5" strokeLinecap="round">
                    <path d="M5 12l5 5L20 7"/>
                  </svg>
                </div>
              )}
            </div>

            {/* Label */}
            <div>
              <p style={{
                margin:     '0 0 2px',
                fontFamily: 'var(--font-inter, sans-serif)',
                fontSize:   14,
                fontWeight: 600,
                color:      selected ? '#2A2520' : '#3A3530',
              }}>
                {pat.label}
              </p>
              <p style={{
                margin:     0,
                fontFamily: 'var(--font-inter, sans-serif)',
                fontSize:   11,
                color:      '#8A8278',
                lineHeight: 1.4,
              }}>
                {pat.desc}
              </p>
            </div>
          </motion.button>
        )
      })}
    </div>
  )
}
