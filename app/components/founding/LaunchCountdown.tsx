'use client'

import { useState, useEffect } from 'react'
import { LAUNCH_DATE, msUntilLaunch } from '@/app/lib/campaign'

/**
 * Honest urgency: a live countdown to the public launch, when booking opens.
 * `full` renders a row of glass cells; `compact` renders one inline line.
 * Nothing is shown until mounted (avoids a hydration mismatch on the ticking
 * value) and, once the date passes, it states plainly that we're open.
 */
export default function LaunchCountdown({ variant = 'full' }: { variant?: 'full' | 'compact' }) {
  const [ms, setMs] = useState<number | null>(null)

  useEffect(() => {
    const tick = () => setMs(msUntilLaunch(Date.now()))
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])

  if (ms === null) return null

  const ended = ms <= 0
  const totalSec = Math.floor(ms / 1000)
  const d = Math.floor(totalSec / 86400)
  const h = Math.floor((totalSec % 86400) / 3600)
  const m = Math.floor((totalSec % 3600) / 60)
  const s = totalSec % 60
  const pad = (n: number) => String(n).padStart(2, '0')

  if (variant === 'compact') {
    return (
      <p style={{
        fontFamily: 'var(--font-inter, sans-serif)',
        fontSize: '12.5px', color: '#C9A84C', letterSpacing: '0.04em',
      }}>
        {ended
          ? "We're now open."
          : <>Booking opens in <strong style={{ color: '#F0D77A' }}>{d}d {pad(h)}h {pad(m)}m {pad(s)}s</strong></>}
      </p>
    )
  }

  if (ended) {
    return (
      <div style={{
        maxWidth: '440px', margin: '0 auto',
        background: 'rgba(201,168,76,0.05)', border: '1px solid rgba(201,168,76,0.2)',
        borderRadius: '10px', padding: '16px 20px', textAlign: 'center',
        fontFamily: 'var(--font-inter, sans-serif)', fontSize: '13px', color: '#9AA6B4',
      }}>
        We&apos;re now open — booking is live.
      </div>
    )
  }

  const cells: [string, number][] = [['Days', d], ['Hours', h], ['Mins', m], ['Secs', s]]

  return (
    <div style={{ maxWidth: '440px', margin: '0 auto', textAlign: 'center' }}>
      <p style={{
        fontFamily: 'var(--font-inter, sans-serif)', fontSize: '11px',
        color: '#C9A84C', letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '14px',
      }}>
        Booking opens in
      </p>
      <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
        {cells.map(([label, val]) => (
          <div key={label} style={{
            flex: 1, maxWidth: '96px',
            background: 'rgba(18,26,42,0.55)',
            border: '1px solid rgba(201,168,76,0.25)',
            borderRadius: '12px',
            padding: '14px 8px',
            boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.08)',
          }}>
            <div style={{
              fontFamily: 'var(--font-playfair, Georgia, serif)',
              fontSize: 'clamp(24px, 6vw, 32px)', color: '#F0D77A', lineHeight: 1,
              fontVariantNumeric: 'tabular-nums',
            }}>
              {pad(val)}
            </div>
            <div style={{
              fontFamily: 'var(--font-inter, sans-serif)', fontSize: '9px',
              color: '#6A7A88', letterSpacing: '2px', textTransform: 'uppercase', marginTop: '7px',
            }}>
              {label}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
