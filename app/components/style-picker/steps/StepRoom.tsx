'use client'

import { motion } from 'framer-motion'

interface Props {
  value:    string | null
  onChange: (v: string) => void
}

const SAGE = '#4A5C44'

const ROOMS = [
  {
    id:    'living-room',
    label: 'Living Room',
    icon:  (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <rect x="3" y="18" width="26" height="10" rx="2" stroke="currentColor" strokeWidth="1.6"/>
        <path d="M7 18V10a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v8" stroke="currentColor" strokeWidth="1.6"/>
        <path d="M3 22h2M27 22h2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
        <rect x="11" y="4" width="10" height="6" rx="1" stroke="currentColor" strokeWidth="1.4"/>
      </svg>
    ),
  },
  {
    id:    'bedroom',
    label: 'Bedroom',
    icon:  (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <rect x="3" y="16" width="26" height="10" rx="2" stroke="currentColor" strokeWidth="1.6"/>
        <path d="M3 20h26" stroke="currentColor" strokeWidth="1.4"/>
        <path d="M3 16V10a2 2 0 0 1 2-2h6v8" stroke="currentColor" strokeWidth="1.6"/>
        <path d="M21 8h6a2 2 0 0 1 2 2v6h-8V8z" stroke="currentColor" strokeWidth="1.6"/>
        <path d="M3 26v2M29 26v2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    id:    'dining',
    label: 'Dining Room',
    icon:  (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <rect x="6" y="14" width="20" height="3" rx="1" stroke="currentColor" strokeWidth="1.6"/>
        <path d="M10 17v8M22 17v8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
        <path d="M8 17v8M14 17v8M18 17v8M24 17v8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
        <path d="M16 4v10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
        <circle cx="16" cy="8" r="3" stroke="currentColor" strokeWidth="1.4"/>
      </svg>
    ),
  },
  {
    id:    'office',
    label: 'Office',
    icon:  (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <rect x="5" y="8" width="22" height="14" rx="2" stroke="currentColor" strokeWidth="1.6"/>
        <path d="M5 16h22" stroke="currentColor" strokeWidth="1.4"/>
        <rect x="10" y="22" width="12" height="3" rx="1" stroke="currentColor" strokeWidth="1.4"/>
        <path d="M9 25h14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
        <path d="M14 12h4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
      </svg>
    ),
  },
]

export function StepRoom({ value, onChange }: Props) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
      {ROOMS.map((room, i) => {
        const selected = value === room.id
        return (
          <motion.button
            key={room.id}
            onClick={() => onChange(room.id)}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.26, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] }}
            style={{
              display:        'flex',
              flexDirection:  'column',
              alignItems:     'center',
              justifyContent: 'center',
              gap:            10,
              padding:        '22px 12px',
              borderRadius:   16,
              border:         `2px solid ${selected ? SAGE : '#E2DDD6'}`,
              background:     selected ? '#EEF0E8' : '#FFFFFF',
              cursor:         'pointer',
              outline:        'none',
              transition:     'border-color 0.2s, background 0.2s',
              minHeight:      44,
              position:       'relative',
            }}
          >
            {selected && (
              <div style={{
                position:       'absolute',
                top:            8,
                right:          8,
                width:          18,
                height:         18,
                borderRadius:   '50%',
                background:     SAGE,
                display:        'flex',
                alignItems:     'center',
                justifyContent: 'center',
              }}>
                <svg width="8" height="8" viewBox="0 0 24 24" fill="none"
                  stroke="#FAFAF8" strokeWidth="3.5" strokeLinecap="round">
                  <path d="M5 12l5 5L20 7"/>
                </svg>
              </div>
            )}

            <div style={{ color: selected ? SAGE : '#8A8278', transition: 'color 0.2s' }}>
              {room.icon}
            </div>

            <span style={{
              fontFamily: 'var(--font-inter, sans-serif)',
              fontSize:   14,
              fontWeight: selected ? 600 : 500,
              color:      selected ? '#2A2520' : '#4A4540',
              transition: 'color 0.2s, font-weight 0.2s',
            }}>
              {room.label}
            </span>
          </motion.button>
        )
      })}
    </div>
  )
}
