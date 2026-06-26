'use client'

import { motion }          from 'framer-motion'
import type { Selections } from '../config/types'
import { STEPS }           from '../config/steps.config'

interface Props {
  selections: Selections
  onReset:    () => void
}

const SAGE = '#4A5C44'

function formatValue(key: keyof Selections, value: Selections[keyof Selections]): string {
  if (!value) return '—'
  if (key === 'photo') return 'Photo added'
  if (typeof value === 'string') {
    return value
      .split('-')
      .map(w => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ')
  }
  return String(value)
}

// ── COMPLETION SEAM ──────────────────────────────────────────────────────────
// This is the exact point where payment / WhatsApp handoff plugs in later.
// Replace the "Book a Studio Session" button's onClick with the payment flow,
// or pass an onBook callback from StylePickerClient.tsx. No other file changes.

export function SummaryScreen({ selections, onReset }: Props) {
  return (
    <div style={{
      position:   'fixed',
      inset:      0,
      background: '#FAFAF8',
      overflowY:  'auto',
      WebkitOverflowScrolling: 'touch',
    }}>
      <div style={{
        padding:    '48px 20px',
        paddingTop: 'calc(48px + env(safe-area-inset-top, 0px))',
        paddingBottom: 'calc(32px + env(safe-area-inset-bottom, 0px))',
        maxWidth:   480,
        margin:     '0 auto',
      }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          style={{ textAlign: 'center', marginBottom: 36 }}
        >
          <div style={{
            width:          56,
            height:         56,
            borderRadius:   '50%',
            background:     '#EEF0E8',
            border:         `2px solid ${SAGE}`,
            display:        'flex',
            alignItems:     'center',
            justifyContent: 'center',
            margin:         '0 auto 20px',
          }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
              stroke={SAGE} strokeWidth="2.2" strokeLinecap="round">
              <path d="M5 12l5 5L20 7"/>
            </svg>
          </div>
          <h1 style={{
            fontFamily: 'var(--font-playfair, Georgia, serif)',
            fontSize:   'clamp(28px, 7vw, 36px)',
            fontWeight: 400,
            color:      '#2A2520',
            margin:     '0 0 10px',
            lineHeight: 1.15,
          }}>
            Your selection.
          </h1>
          <p style={{
            fontFamily: 'var(--font-inter, sans-serif)',
            fontSize:   14,
            color:      '#7A7570',
            margin:     0,
            lineHeight: 1.6,
          }}>
            Here&apos;s what you chose. Book a studio session and we&apos;ll bring it to life.
          </p>
        </motion.div>

        {/* Selection list */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          style={{
            borderRadius: 16,
            border:       '1.5px solid #E2DDD6',
            overflow:     'hidden',
            marginBottom: 24,
          }}
        >
          {STEPS.map((step, i) => {
            const val = selections[step.id]
            return (
              <div key={step.id} style={{
                display:       'flex',
                alignItems:    'center',
                justifyContent:'space-between',
                padding:       '14px 16px',
                background:    i % 2 === 0 ? '#FFFFFF' : '#F7F4EF',
                borderBottom:  i < STEPS.length - 1 ? '1px solid #EAE6DF' : 'none',
              }}>
                <span style={{
                  fontFamily: 'var(--font-inter, sans-serif)',
                  fontSize:   13,
                  color:      '#8A8278',
                  fontWeight: 500,
                }}>
                  {step.label}
                </span>
                <span style={{
                  fontFamily: 'var(--font-inter, sans-serif)',
                  fontSize:   14,
                  fontWeight: 600,
                  color:      val ? '#2A2520' : '#BDB8B0',
                }}>
                  {formatValue(step.id, val)}
                </span>
              </div>
            )
          })}
        </motion.div>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.22, ease: [0.22, 1, 0.36, 1] }}
          style={{ display: 'flex', flexDirection: 'column', gap: 12 }}
        >
          {/* PRIMARY CTA — PAYMENT/WHATSAPP SLOT: replace this button's onClick */}
          <a
            href="/contact"
            style={{
              display:        'flex',
              alignItems:     'center',
              justifyContent: 'center',
              gap:            8,
              width:          '100%',
              minHeight:      52,
              borderRadius:   12,
              background:     `linear-gradient(135deg, ${SAGE} 0%, #5E7257 100%)`,
              color:          '#FAFAF8',
              fontFamily:     'var(--font-inter, sans-serif)',
              fontSize:       16,
              fontWeight:     600,
              textDecoration: 'none',
              letterSpacing:  '0.02em',
            }}
          >
            Book a Studio Session
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
              <path d="m5 12h14M13 6l6 6-6 6"/>
            </svg>
          </a>

          <button
            onClick={onReset}
            style={{
              width:          '100%',
              minHeight:      44,
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
            Start over
          </button>
        </motion.div>
      </div>
    </div>
  )
}
