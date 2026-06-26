'use client'

import { useIsMobile }    from '@/app/components/style-picker/hooks/useIsMobile'
import { WizardProvider } from '@/app/components/style-picker/wizard/WizardProvider'
import { WizardShell }    from '@/app/components/style-picker/wizard/WizardShell'

const SAGE = '#4A5C44'

// Desktop fallback — shown when viewport is wider than 768px
function DesktopFallback() {
  return (
    <div style={{
      minHeight:      '100dvh',
      background:     '#FAFAF8',
      display:        'flex',
      alignItems:     'center',
      justifyContent: 'center',
      padding:        40,
    }}>
      <div style={{ textAlign: 'center', maxWidth: 380 }}>
        {/* QR placeholder */}
        <div style={{
          width:          180,
          height:         180,
          borderRadius:   16,
          border:         `2px dashed ${SAGE}`,
          margin:         '0 auto 28px',
          display:        'flex',
          alignItems:     'center',
          justifyContent: 'center',
          background:     '#EEF0E8',
        }}>
          {/* PLACEHOLDER: swap for a real QR code pointing at /style */}
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none"
            stroke={SAGE} strokeWidth="1.4" strokeLinecap="round">
            <rect x="3"  y="3"  width="7" height="7" rx="1"/>
            <rect x="14" y="3"  width="7" height="7" rx="1"/>
            <rect x="3"  y="14" width="7" height="7" rx="1"/>
            <path d="M14 14h.01M14 17h3M17 14v3M20 17h.01M20 14h.01"/>
          </svg>
        </div>

        <h1 style={{
          fontFamily: 'var(--font-playfair, Georgia, serif)',
          fontSize:   28,
          fontWeight: 400,
          color:      '#2A2520',
          margin:     '0 0 12px',
          lineHeight: 1.2,
        }}>
          Open this on your phone.
        </h1>
        <p style={{
          fontFamily: 'var(--font-inter, sans-serif)',
          fontSize:   15,
          color:      '#7A7570',
          lineHeight: 1.65,
          margin:     '0 0 28px',
        }}>
          The Style Picker is designed for a phone screen. Scan the code above or visit{' '}
          <strong style={{ color: SAGE }}>rjinteriors.co.ke/style</strong> from your mobile browser.
        </p>

        <a href="/" style={{
          display:        'inline-flex',
          alignItems:     'center',
          gap:            6,
          fontFamily:     'var(--font-inter, sans-serif)',
          fontSize:       14,
          color:          SAGE,
          textDecoration: 'none',
          fontWeight:     500,
        }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M19 12H5M11 6l-6 6 6 6"/>
          </svg>
          Back to the homepage
        </a>
      </div>
    </div>
  )
}

export default function StylePickerClient() {
  const isMobile = useIsMobile()

  // null = not yet measured (SSR + first paint). Render nothing so server and
  // client outputs match exactly — no hydration mismatch, no flash.
  if (isMobile === null) return null

  if (!isMobile) return <DesktopFallback />

  return (
    <WizardProvider>
      <WizardShell />
    </WizardProvider>
  )
}
