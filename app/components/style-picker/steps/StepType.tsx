'use client'

import { motion } from 'framer-motion'
import Image      from 'next/image'

interface Props {
  value:    string | null
  onChange: (v: string) => void
}

const SAGE = '#4A5C44'

// ── PLACEHOLDER: replace img paths with styled curtain renders per type ──
const TYPES = [
  {
    id:    'modern',
    label: 'Modern',
    desc:  'Clean lines, minimal folds, architectural presence.',
    img:   '/assets/curtain1.png',
  },
  {
    id:    'minimalist',
    label: 'Minimalist',
    desc:  'Flat panels, no fuss — lets the fabric speak.',
    img:   '/assets/curtain3.png',
  },
  {
    id:    'roman-shades',
    label: 'Roman Shades',
    desc:  'Structured horizontal folds that stack neatly when raised.',
    img:   '/assets/curtain2.png',
  },
  {
    id:    'bohemian',
    label: 'Bohemian',
    desc:  'Loose, relaxed drape with warm layered texture.',
    img:   '/assets/curtain4.png',
  },
]

export function StepType({ value, onChange }: Props) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {TYPES.map((type, i) => {
        const selected = value === type.id
        return (
          <motion.button
            key={type.id}
            onClick={() => onChange(type.id)}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.28, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] }}
            style={{
              display:       'flex',
              alignItems:    'center',
              gap:           14,
              padding:       '10px 14px',
              borderRadius:  14,
              border:        `2px solid ${selected ? SAGE : '#E2DDD6'}`,
              background:    selected ? '#EEF0E8' : '#FFFFFF',
              cursor:        'pointer',
              textAlign:     'left',
              outline:       'none',
              transition:    'border-color 0.2s, background 0.2s',
              overflow:      'hidden',
              minHeight:     44,
            }}
          >
            {/* Thumbnail */}
            <div style={{
              width:        72,
              height:       72,
              borderRadius: 10,
              overflow:     'hidden',
              flexShrink:   0,
              position:     'relative',
              background:   '#F0EDE8',
            }}>
              <Image
                src={type.img}
                alt={type.label}
                fill
                sizes="72px"
                style={{ objectFit: 'cover' }}
              />
              {selected && (
                <div style={{
                  position:       'absolute',
                  inset:          0,
                  background:     'rgba(74,92,68,0.18)',
                  display:        'flex',
                  alignItems:     'center',
                  justifyContent: 'center',
                }}>
                  <div style={{
                    width:          22,
                    height:         22,
                    borderRadius:   '50%',
                    background:     SAGE,
                    display:        'flex',
                    alignItems:     'center',
                    justifyContent: 'center',
                  }}>
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none"
                      stroke="#FAFAF8" strokeWidth="3" strokeLinecap="round">
                      <path d="M5 12l5 5L20 7"/>
                    </svg>
                  </div>
                </div>
              )}
            </div>

            {/* Text */}
            <div style={{ flex: 1 }}>
              <p style={{
                margin:     '0 0 4px',
                fontFamily: 'var(--font-inter, sans-serif)',
                fontSize:   16,
                fontWeight: 600,
                color:      selected ? '#2A2520' : '#3A3530',
              }}>
                {type.label}
              </p>
              <p style={{
                margin:     0,
                fontFamily: 'var(--font-inter, sans-serif)',
                fontSize:   13,
                color:      '#7A7570',
                lineHeight: 1.5,
              }}>
                {type.desc}
              </p>
            </div>
          </motion.button>
        )
      })}
    </div>
  )
}
