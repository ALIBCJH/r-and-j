'use client'

import { STEPS } from '../config/steps.config'

interface Props {
  currentIndex: number
  onBack:       () => void
}

const SAGE  = '#4A5C44'
const OLIVE = '#6B7A5A'

export function StepIndicator({ currentIndex, onBack }: Props) {
  return (
    <div style={{
      display:         'flex',
      alignItems:      'center',
      gap:             0,
      padding:         '0 16px',
      height:          '100%',
    }}>
      {/* Back arrow */}
      <button
        onClick={onBack}
        disabled={currentIndex === 0}
        aria-label="Go back"
        style={{
          width:           40,
          height:          44,
          display:         'flex',
          alignItems:      'center',
          justifyContent:  'center',
          background:      'transparent',
          border:          'none',
          cursor:          currentIndex === 0 ? 'default' : 'pointer',
          opacity:         currentIndex === 0 ? 0 : 1,
          transition:      'opacity 0.2s',
          flexShrink:      0,
          padding:         0,
        }}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
          stroke={SAGE} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 12H5M11 6l-6 6 6 6"/>
        </svg>
      </button>

      {/* Step dots */}
      <div style={{
        flex:            1,
        display:         'flex',
        alignItems:      'flex-start',
        justifyContent:  'center',
        gap:             0,
      }}>
        {STEPS.map((step, i) => {
          const done   = i < currentIndex
          const active = i === currentIndex

          return (
            <div key={step.id} style={{
              display:        'flex',
              alignItems:     'center',
              flexDirection:  'column',
              gap:            4,
              flex:           '1 1 0',
              maxWidth:       52,
            }}>
              {/* Connector line + circle row */}
              <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                {/* Left connector */}
                <div style={{
                  flex:       1,
                  height:     1.5,
                  background: i === 0 ? 'transparent' : done || active ? SAGE : '#D4CFC8',
                  transition: 'background 0.3s',
                }} />

                {/* Circle */}
                <div style={{
                  width:        active ? 24 : 18,
                  height:       active ? 24 : 18,
                  borderRadius: '50%',
                  background:   done ? SAGE : active ? SAGE : 'transparent',
                  border:       done || active ? `2px solid ${SAGE}` : '1.5px solid #BDB8B0',
                  display:      'flex',
                  alignItems:   'center',
                  justifyContent: 'center',
                  flexShrink:   0,
                  transition:   'all 0.25s ease',
                }}>
                  {done ? (
                    <svg width="9" height="9" viewBox="0 0 24 24" fill="none"
                      stroke="#FAFAF8" strokeWidth="3" strokeLinecap="round">
                      <path d="M5 12l5 5L20 7"/>
                    </svg>
                  ) : (
                    <span style={{
                      fontSize:      active ? 11 : 9,
                      fontFamily:    'var(--font-inter, sans-serif)',
                      fontWeight:    600,
                      color:         active ? '#FAFAF8' : '#A09890',
                      lineHeight:    1,
                      userSelect:    'none',
                    }}>
                      {i + 1}
                    </span>
                  )}
                </div>

                {/* Right connector */}
                <div style={{
                  flex:       1,
                  height:     1.5,
                  background: i === STEPS.length - 1 ? 'transparent' : done ? SAGE : '#D4CFC8',
                  transition: 'background 0.3s',
                }} />
              </div>

              {/* Label */}
              <span style={{
                fontFamily:    'var(--font-inter, sans-serif)',
                fontSize:      9,
                fontWeight:    active ? 600 : 400,
                color:         active ? SAGE : done ? OLIVE : '#A09890',
                letterSpacing: '0.04em',
                textAlign:     'center',
                lineHeight:    1,
                transition:    'color 0.25s',
                whiteSpace:    'nowrap',
              }}>
                {step.label}
              </span>
            </div>
          )
        })}
      </div>

      {/* Spacer to balance the back arrow */}
      <div style={{ width: 40, flexShrink: 0 }} />
    </div>
  )
}
