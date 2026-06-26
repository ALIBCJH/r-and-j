'use client'

import { motion } from 'framer-motion'
import { COLOURS } from '../config/colors'

interface Props {
  colorId:     string | null
  bookingDate: string | null
  bookingTime: string | null
  name:        string
  paymentRef:  string | null
  onDone:      () => void
}

const SAGE = '#4A5C44'

function formatDisplayDate(iso: string): string {
  const [y, m, d] = iso.split('-').map(Number)
  const date = new Date(y, m - 1, d)
  return date.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
}

export function WizardConfirmation({ colorId, bookingDate, bookingTime, name, paymentRef, onDone }: Props) {
  const colour = COLOURS.find(c => c.id === colorId)

  const rows = [
    bookingDate && { label: 'Date',      value: formatDisplayDate(bookingDate)  },
    bookingTime && { label: 'Time',      value: `${bookingTime} — up to 90 min` },
    colour      && { label: 'Colour',    value: colour.label                    },
    paymentRef  && { label: 'Reference', value: paymentRef                      },
  ].filter(Boolean) as { label: string; value: string }[]

  return (
    <div style={{
      position:   'fixed',
      inset:      0,
      background: '#FAFAF8',
      overflowY:  'auto',
      WebkitOverflowScrolling: 'touch',
    }}>
      <div style={{
        padding:       '52px 24px',
        paddingTop:    'calc(52px + env(safe-area-inset-top, 0px))',
        paddingBottom: 'calc(40px + env(safe-area-inset-bottom, 0px))',
        maxWidth:      480,
        margin:        '0 auto',
      }}>
        {/* Check mark */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 360, damping: 24, delay: 0.1 }}
          style={{
            width:          64,
            height:         64,
            borderRadius:   '50%',
            background:     '#EEF0E8',
            border:         `2px solid ${SAGE}`,
            display:        'flex',
            alignItems:     'center',
            justifyContent: 'center',
            margin:         '0 0 24px',
          }}
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none"
            stroke={SAGE} strokeWidth="2.2" strokeLinecap="round">
            <path d="M5 12l5 5L20 7"/>
          </svg>
        </motion.div>

        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          style={{ marginBottom: 32 }}
        >
          <p style={{
            fontFamily:    'var(--font-inter, sans-serif)',
            fontSize:      11,
            fontWeight:    600,
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color:         SAGE,
            margin:        '0 0 8px',
          }}>
            You&apos;re booked
          </p>
          <h1 style={{
            fontFamily: 'var(--font-playfair, Georgia, serif)',
            fontSize:   'clamp(28px, 7vw, 36px)',
            fontWeight: 400,
            color:      '#2A2520',
            margin:     '0 0 10px',
            lineHeight: 1.15,
          }}>
            {name ? `See you soon, ${name.split(' ')[0]}.` : 'See you soon.'}
          </h1>
          <p style={{
            fontFamily: 'var(--font-inter, sans-serif)',
            fontSize:   14,
            color:      '#7A7570',
            margin:     0,
            lineHeight: 1.65,
          }}>
            Our consultant will have your {colour?.label.toLowerCase() ?? 'colour'} selection ready when you arrive.
          </p>
        </motion.div>

        {/* Details card */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.32, ease: [0.22, 1, 0.36, 1] }}
          style={{
            borderRadius: 16,
            border:       '1.5px solid #E2DDD6',
            overflow:     'hidden',
            marginBottom: 24,
          }}
        >
          {rows.map((row, i) => (
            <div key={row.label} style={{
              display:        'flex',
              alignItems:     'center',
              justifyContent: 'space-between',
              gap:            16,
              padding:        '13px 16px',
              background:     i % 2 === 0 ? '#FFFFFF' : '#F7F4EF',
              borderBottom:   i < rows.length - 1 ? '1px solid #EAE6DF' : 'none',
            }}>
              <span style={{ fontFamily: 'var(--font-inter, sans-serif)', fontSize: 12, color: '#8A8278', fontWeight: 500 }}>
                {row.label}
              </span>
              <span style={{ fontFamily: 'var(--font-inter, sans-serif)', fontSize: 14, fontWeight: 600, color: '#2A2520', textAlign: 'right' }}>
                {row.value}
              </span>
            </div>
          ))}

          {/* Colour swatch row */}
          {colour && (
            <div style={{
              display:     'flex',
              alignItems:  'center',
              justifyContent: 'space-between',
              gap:         16,
              padding:     '13px 16px',
              background:  rows.length % 2 === 0 ? '#FFFFFF' : '#F7F4EF',
            }}>
              <span style={{ fontFamily: 'var(--font-inter, sans-serif)', fontSize: 12, color: '#8A8278', fontWeight: 500 }}>
                Swatch
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{
                  width:        20,
                  height:       20,
                  borderRadius: '50%',
                  background:   colour.hex,
                  border:       '1.5px solid rgba(0,0,0,0.1)',
                }} />
                <span style={{ fontFamily: 'var(--font-inter, sans-serif)', fontSize: 14, fontWeight: 600, color: '#2A2520' }}>
                  {colour.label}
                </span>
              </div>
            </div>
          )}
        </motion.div>

        {/* Location */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.44 }}
          style={{
            padding:      '12px 14px',
            borderRadius: 12,
            background:   '#EEF0E8',
            border:       `1px solid rgba(74,92,68,0.2)`,
            marginBottom: 28,
            display:      'flex',
            gap:          10,
            alignItems:   'flex-start',
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0, marginTop: 2 }}
            stroke={SAGE} strokeWidth="2" strokeLinecap="round">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
            <circle cx="12" cy="10" r="3"/>
          </svg>
          <p style={{ fontFamily: 'var(--font-inter, sans-serif)', fontSize: 13, color: '#4A4540', margin: 0, lineHeight: 1.55 }}>
            R&amp;J Interiors Studio, Nairobi.<br/>
            <span style={{ color: '#7A7570' }}>We&apos;ll send the exact address to your phone.</span>
          </p>
        </motion.div>

        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.52 }}
          onClick={onDone}
          style={{
            width:          '100%',
            minHeight:      48,
            borderRadius:   12,
            border:         '1.5px solid #D4CFC8',
            background:     'transparent',
            color:          '#6B6560',
            fontFamily:     'var(--font-inter, sans-serif)',
            fontSize:       14,
            fontWeight:     500,
            cursor:         'pointer',
          }}
        >
          Back to home
        </motion.button>
      </div>
    </div>
  )
}
