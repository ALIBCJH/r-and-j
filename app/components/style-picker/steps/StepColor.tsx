'use client'

import { motion }  from 'framer-motion'
import { COLOURS } from '../config/colors'

interface Props {
  value:    string | null
  onChange: (v: string) => void
}

const SAGE = '#4A5C44'

// Colours are defined in config/colors.ts — edit them there.

export function StepColor({ value, onChange }: Props) {
  const selected = COLOURS.find(c => c.id === value)

  return (
    <div>
      {selected && (
        <motion.div
          key={selected.id}
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            display:      'flex',
            alignItems:   'center',
            gap:          10,
            padding:      '10px 14px',
            borderRadius: 10,
            background:   '#F3F0EB',
            border:       `1.5px solid ${SAGE}`,
            marginBottom: 16,
          }}
        >
          <div style={{
            width:        20,
            height:       20,
            borderRadius: '50%',
            background:   selected.hex,
            border:       '1.5px solid rgba(0,0,0,0.08)',
            flexShrink:   0,
          }} />
          <span style={{
            fontFamily: 'var(--font-inter, sans-serif)',
            fontSize:   14,
            fontWeight: 500,
            color:      '#3A3530',
          }}>
            {selected.label}
          </span>
          <svg style={{ marginLeft: 'auto' }} width="14" height="14" viewBox="0 0 24 24"
            fill="none" stroke={SAGE} strokeWidth="2.5" strokeLinecap="round">
            <path d="M5 12l5 5L20 7"/>
          </svg>
        </motion.div>
      )}

      <div style={{
        display:             'grid',
        gridTemplateColumns: 'repeat(5, 1fr)',
        gap:                 10,
      }}>
        {COLOURS.map((colour, i) => {
          const isSelected = value === colour.id
          const isDark     = parseInt(colour.hex.slice(1, 3), 16) < 100

          return (
            <motion.button
              key={colour.id}
              onClick={() => onChange(colour.id)}
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.22, delay: i * 0.03, ease: [0.22, 1, 0.36, 1] }}
              title={colour.label}
              aria-label={colour.label}
              style={{
                display:        'flex',
                flexDirection:  'column',
                alignItems:     'center',
                gap:            6,
                padding:        '8px 4px',
                borderRadius:   12,
                border:         `2px solid ${isSelected ? SAGE : 'transparent'}`,
                background:     isSelected ? '#EEF0E8' : 'transparent',
                cursor:         'pointer',
                outline:        'none',
                transition:     'border-color 0.18s, background 0.18s',
                minHeight:      44,
              }}
            >
              <div style={{ position: 'relative' }}>
                <div style={{
                  width:        36,
                  height:       36,
                  borderRadius: '50%',
                  background:   colour.hex,
                  border:       '1.5px solid rgba(0,0,0,0.08)',
                  boxShadow:    isSelected ? `0 0 0 3px ${SAGE}` : 'none',
                  transition:   'box-shadow 0.18s',
                }} />
                {isSelected && (
                  <div style={{
                    position:       'absolute',
                    inset:          0,
                    borderRadius:   '50%',
                    display:        'flex',
                    alignItems:     'center',
                    justifyContent: 'center',
                  }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                      stroke={isDark ? '#FAFAF8' : '#2A2520'} strokeWidth="3" strokeLinecap="round">
                      <path d="M5 12l5 5L20 7"/>
                    </svg>
                  </div>
                )}
              </div>
              <span style={{
                fontFamily:  'var(--font-inter, sans-serif)',
                fontSize:    9,
                fontWeight:  isSelected ? 600 : 400,
                color:       isSelected ? SAGE : '#8A8278',
                textAlign:   'center',
                lineHeight:  1.2,
                whiteSpace:  'nowrap',
                overflow:    'hidden',
                textOverflow:'ellipsis',
                maxWidth:    '100%',
              }}>
                {colour.label}
              </span>
            </motion.button>
          )
        })}
      </div>
    </div>
  )
}
