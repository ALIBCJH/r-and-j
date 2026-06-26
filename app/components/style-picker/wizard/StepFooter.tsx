'use client'

const SAGE = '#4A5C44'

interface Props {
  canContinue: boolean
  skippable:   boolean
  isLast:      boolean
  onNext:      () => void
  onSkip:      () => void
  nextLabel?:  string
}

export function StepFooter({ canContinue, skippable, isLast, onNext, onSkip, nextLabel }: Props) {
  const label = nextLabel ?? (isLast ? 'See my selection' : 'Continue')

  return (
    <div style={{
      padding:          '12px 20px',
      paddingBottom:    'calc(12px + env(safe-area-inset-bottom, 0px))',
      background:       '#FAFAF8',
      borderTop:        '1px solid #EAE6DF',
      display:          'flex',
      flexDirection:    'column',
      gap:              8,
    }}>
      <button
        onClick={onNext}
        disabled={!canContinue}
        style={{
          width:         '100%',
          minHeight:     52,
          borderRadius:  12,
          border:        'none',
          background:    canContinue
            ? `linear-gradient(135deg, ${SAGE} 0%, #5E7257 100%)`
            : '#E8E4DC',
          color:         canContinue ? '#FAFAF8' : '#B8B2A8',
          fontFamily:    'var(--font-inter, sans-serif)',
          fontSize:      16,
          fontWeight:    600,
          letterSpacing: '0.02em',
          cursor:        canContinue ? 'pointer' : 'default',
          transition:    'background 0.2s, color 0.2s',
          display:       'flex',
          alignItems:    'center',
          justifyContent:'center',
          gap:           8,
        }}
      >
        {label}
        {canContinue && !isLast && (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
            <path d="m5 12h14M13 6l6 6-6 6"/>
          </svg>
        )}
      </button>

      {skippable && !canContinue && (
        <button
          onClick={onSkip}
          style={{
            width:         '100%',
            minHeight:     40,
            border:        'none',
            background:    'transparent',
            color:         '#8A8278',
            fontFamily:    'var(--font-inter, sans-serif)',
            fontSize:      14,
            cursor:        'pointer',
            textDecoration:'underline',
            textUnderlineOffset: 3,
          }}
        >
          Skip this step
        </button>
      )}

      {!canContinue && !skippable && (
        <p style={{
          margin:        0,
          textAlign:     'center',
          fontFamily:    'var(--font-inter, sans-serif)',
          fontSize:      12,
          color:         '#A09890',
        }}>
          Make a selection to continue
        </p>
      )}
    </div>
  )
}
