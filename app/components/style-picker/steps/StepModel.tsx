'use client'

import { motion } from 'framer-motion'

interface Props {
  value:    string | null
  onChange: (v: string) => void
}

const SAGE = '#4A5C44'

// ── PLACEHOLDER: replace with real model options if the catalogue changes ──
const OPTIONS = [
  {
    id:    'single-panel',
    label: 'Single Panel',
    desc:  'One panel drawn to one side — clean and asymmetric.',
    icon:  (
      <svg viewBox="0 0 48 56" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: 48, height: 56 }}>
        <rect x="6" y="2" width="20" height="52" rx="2" stroke="currentColor" strokeWidth="1.8" fill="rgba(74,92,68,0.08)"/>
        <line x1="26" y1="8" x2="42" y2="8" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 3"/>
        <path d="M6 8 C10 14 10 42 6 48" stroke="currentColor" strokeWidth="1.2" strokeDasharray="2 2"/>
      </svg>
    ),
  },
  {
    id:    'pair',
    label: 'Pair',
    desc:  'Two matching panels, one on each side — balanced and classic.',
    icon:  (
      <svg viewBox="0 0 48 56" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: 48, height: 56 }}>
        <rect x="2"  y="2" width="18" height="52" rx="2" stroke="currentColor" strokeWidth="1.8" fill="rgba(74,92,68,0.08)"/>
        <rect x="28" y="2" width="18" height="52" rx="2" stroke="currentColor" strokeWidth="1.8" fill="rgba(74,92,68,0.08)"/>
        <line x1="20" y1="8" x2="28" y2="8" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 3"/>
      </svg>
    ),
  },
  {
    id:    'layered',
    label: 'Layered',
    desc:  'Sheer underneath, drape on top — maximum light control and depth.',
    icon:  (
      <svg viewBox="0 0 48 56" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: 48, height: 56 }}>
        <rect x="6"  y="6" width="36" height="50" rx="2" stroke="currentColor" strokeWidth="1.2" strokeDasharray="3 2" fill="rgba(74,92,68,0.04)"/>
        <rect x="2"  y="2" width="16" height="52" rx="2" stroke="currentColor" strokeWidth="1.8" fill="rgba(74,92,68,0.12)"/>
        <rect x="30" y="2" width="16" height="52" rx="2" stroke="currentColor" strokeWidth="1.8" fill="rgba(74,92,68,0.12)"/>
      </svg>
    ),
  },
]

export function StepModel({ value, onChange }: Props) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {OPTIONS.map((opt, i) => {
        const selected = value === opt.id
        return (
          <motion.button
            key={opt.id}
            onClick={() => onChange(opt.id)}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.28, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] }}
            style={{
              display:       'flex',
              alignItems:    'center',
              gap:           16,
              padding:       '18px 16px',
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
            {/* Icon */}
            <div style={{
              color:       selected ? SAGE : '#A09890',
              flexShrink:  0,
              transition:  'color 0.2s',
            }}>
              {opt.icon}
            </div>

            {/* Text */}
            <div style={{ flex: 1 }}>
              <p style={{
                margin:      '0 0 4px',
                fontFamily:  'var(--font-inter, sans-serif)',
                fontSize:    16,
                fontWeight:  600,
                color:       selected ? '#2A2520' : '#3A3530',
              }}>
                {opt.label}
              </p>
              <p style={{
                margin:     0,
                fontFamily: 'var(--font-inter, sans-serif)',
                fontSize:   13,
                color:      '#7A7570',
                lineHeight: 1.5,
              }}>
                {opt.desc}
              </p>
            </div>

            {/* Check */}
            <div style={{
              width:         22,
              height:        22,
              borderRadius:  '50%',
              border:        `2px solid ${selected ? SAGE : '#D4CFC8'}`,
              background:    selected ? SAGE : 'transparent',
              display:       'flex',
              alignItems:    'center',
              justifyContent:'center',
              flexShrink:    0,
              transition:    'all 0.2s',
            }}>
              {selected && (
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none"
                  stroke="#FAFAF8" strokeWidth="3" strokeLinecap="round">
                  <path d="M5 12l5 5L20 7"/>
                </svg>
              )}
            </div>
          </motion.button>
        )
      })}
    </div>
  )
}
