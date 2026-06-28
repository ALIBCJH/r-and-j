'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import Image from 'next/image'
import { drawScene } from './curtainRenderer'
import { API_URL } from '@/app/lib/api'

// ─── Brand tokens ─────────────────────────────────────────────────────────────
const C = {
  bg:        '#111113',
  navBg:     '#0E0E10',
  border:    'rgba(201,168,76,0.14)',
  gold:      '#C9A84C',
  goldLight: '#E8C87A',
  text:      '#F0EBE0',
  muted:     '#A09080',
  faint:     '#504840',
  panel:     'rgba(17,17,19,0.96)',
} as const

// ─── Fabric colour catalogue ───────────────────────────────────────────────────
const SWATCHES = [
  { hex: '#F5F0E8', name: 'Ivory Linen',    collection: 'ESSENTIALS' },
  { hex: '#E8DCC8', name: 'Pale Linen',      collection: 'ESSENTIALS' },
  { hex: '#D4B896', name: 'Desert Sand',     collection: 'WARMTH'    },
  { hex: '#C8A070', name: 'Gilded Silk',     collection: 'SUNSTONE'  },
  { hex: '#E0B8B4', name: 'Blush Voile',     collection: 'BLOOM'     },
  { hex: '#C49890', name: 'Dusty Rose',      collection: 'BLOOM'     },
  { hex: '#8FAF8C', name: 'Sage Weave',      collection: 'BOTANICA'  },
  { hex: '#4A7A5C', name: 'Forest Deep',     collection: 'BOTANICA'  },
  { hex: '#3A5F8A', name: 'Denim Dusk',      collection: 'NOIR'      },
  { hex: '#1E3A5F', name: 'Midnight Navy',   collection: 'NOIR'      },
  { hex: '#3C3C3C', name: 'Charcoal Drape',  collection: 'NOIR'      },
  { hex: '#C07455', name: 'Terracotta',      collection: 'WARMTH'    },
  { hex: '#7A2F3A', name: 'Burgundy Velour', collection: 'REGAL'     },
]

type Swatch = typeof SWATCHES[number]

// ─── Form option types ────────────────────────────────────────────────────────
type RoomType   = 'living' | 'bedroom' | 'dining' | 'kitchen' | 'office'
type WindowSize = 'small'  | 'medium'  | 'large'
type LightPref  = 'airy'   | 'filtered' | 'blackout'

type Phase = 'select' | 'gate' | 'revealed'

// ─── Small atoms ──────────────────────────────────────────────────────────────
function GoldRule() {
  return <div style={{ height: 1, background: `linear-gradient(to right,transparent,${C.gold},transparent)` }} />
}

function Pill({
  label, sub, active, onClick,
}: { label: string; sub?: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding:     '10px 18px',
        borderRadius: 8,
        border:       active ? `2px solid ${C.gold}` : `1.5px solid rgba(255,255,255,0.10)`,
        background:   active ? 'rgba(201,168,76,0.13)' : 'rgba(255,255,255,0.03)',
        color:        active ? C.goldLight : 'rgba(255,255,255,0.58)',
        fontFamily:   'var(--font-inter,sans-serif)',
        fontSize:     14,
        fontWeight:   active ? 600 : 400,
        cursor:       'pointer',
        transition:   'all 0.18s',
        whiteSpace:   'nowrap',
        display:      'flex',
        flexDirection:'column',
        alignItems:   'center',
        gap:           2,
      }}
    >
      <span>{label}</span>
      {sub && <span style={{ fontSize: 10, opacity: 0.6 }}>{sub}</span>}
    </button>
  )
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p style={{
      fontFamily:    'var(--font-inter,sans-serif)',
      fontSize:      10,
      letterSpacing: '0.24em',
      textTransform: 'uppercase',
      color:         C.gold,
      margin:        0,
    }}>
      {children}
    </p>
  )
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function MobileStudio() {
  const prefersReduced = useReducedMotion()

  // ── Selector state ──────────────────────────────────────────────────────────
  const [swatch,     setSwatch]     = useState<Swatch>(SWATCHES[0])
  const [roomType,   setRoomType]   = useState<RoomType   | null>(null)
  const [windowSize, setWindowSize] = useState<WindowSize | null>(null)
  const [lightPref,  setLightPref]  = useState<LightPref  | null>(null)
  const [phase,      setPhase]      = useState<Phase>('select')

  // ── Payment state ───────────────────────────────────────────────────────────
  const [selectedPrice,  setSelectedPrice]  = useState<100 | 300>(100)
  const [phone,          setPhone]          = useState('')
  const [paying,         setPaying]         = useState(false)
  const [payError,       setPayError]       = useState<string | null>(null)
  const [checkoutId,     setCheckoutId]     = useState<string | null>(null)
  const [canRetry,       setCanRetry]       = useState(false)
  const retryTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  // ── Canvas / template refs ──────────────────────────────────────────────────
  const canvasRef     = useRef<HTMLCanvasElement>(null)
  const containerRef  = useRef<HTMLDivElement>(null)
  const templateRef   = useRef<HTMLImageElement | null>(null)
  const [imgReady,  setImgReady]  = useState(false)

  // ── Computed ────────────────────────────────────────────────────────────────
  const formComplete = !!(roomType && windowSize && lightPref)
  const phoneDigits  = phone.replace(/\D/g, '')
  const phoneValid   = phoneDigits.length >= 9

  function formatPhone(raw: string) {
    const d = raw.replace(/\D/g, '')
    if (d.startsWith('254')) return `+${d}`
    if (d.startsWith('0'))   return `+254${d.slice(1)}`
    return `+254${d}`
  }

  // ── Load template image once ────────────────────────────────────────────────
  useEffect(() => {
    const img = document.createElement('img')
    img.onload = () => { templateRef.current = img; setImgReady(true) }
    img.src = '/assets/sittingroom.png'
  }, [])

  // ── Draw / redraw canvas ────────────────────────────────────────────────────
  const redraw = useCallback(() => {
    const canvas = canvasRef.current
    const img    = templateRef.current
    const cont   = containerRef.current
    if (!canvas || !img || !cont) return

    const displayW = cont.clientWidth
    const displayH = Math.min(
      Math.round(displayW * img.naturalHeight / img.naturalWidth),
      Math.round(window.innerHeight * 0.42),
    )
    const dpr = window.devicePixelRatio || 1
    canvas.width        = Math.round(displayW * dpr)
    canvas.height       = Math.round(displayH * dpr)
    canvas.style.width  = `${displayW}px`
    canvas.style.height = `${displayH}px`
    drawScene(canvas, img, swatch.hex)
  }, [swatch.hex])

  // Redraw when image loads or swatch changes
  useEffect(() => { if (imgReady) redraw() }, [imgReady, redraw])

  // Redraw on resize
  useEffect(() => {
    const ro = new ResizeObserver(redraw)
    if (containerRef.current) ro.observe(containerRef.current)
    return () => ro.disconnect()
  }, [redraw])

  // ── Payment retry timer ─────────────────────────────────────────────────────
  useEffect(() => {
    if (!paying) { setCanRetry(false); return }
    retryTimer.current = setTimeout(() => setCanRetry(true), 15_000)
    return () => { if (retryTimer.current) clearTimeout(retryTimer.current) }
  }, [paying])

  // ── Poll for payment status ─────────────────────────────────────────────────
  useEffect(() => {
    if (!checkoutId || !paying) return
    let attempts = 0
    const iv = setInterval(async () => {
      if (++attempts > 40) {
        clearInterval(iv)
        setCheckoutId(null); setPaying(false)
        setPayError('Payment timed out. Please try again.')
        return
      }
      try {
        const data = await fetch(`${API_URL}/mpesa/status/${checkoutId}`).then(r => r.json())
        if (data.status === 'complete') {
          clearInterval(iv)
          setCheckoutId(null); setPaying(false)
          setPhase('revealed')
        } else if (data.status === 'failed') {
          clearInterval(iv)
          setCheckoutId(null); setPaying(false)
          setPayError('Payment declined. Please check your M-Pesa balance.')
        }
      } catch { /* keep polling */ }
    }, 3000)
    return () => clearInterval(iv)
  }, [checkoutId, paying])

  // ── Initiate STK push ───────────────────────────────────────────────────────
  async function handlePay() {
    if (!phoneValid || paying) return
    setPaying(true); setPayError(null)
    try {
      const res = await fetch(`${API_URL}/mpesa/stk-push`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ phone: formatPhone(phone), amount: selectedPrice }),
      })
      if (!res.ok) throw new Error()
      const { checkout_request_id } = await res.json()
      setCheckoutId(checkout_request_id)
    } catch {
      setPaying(false)
      setPayError('Could not reach payment service. Please try again.')
    }
  }

  // ── Motion preset ───────────────────────────────────────────────────────────
  const fadeUp = prefersReduced ? {} : {
    initial: { opacity: 0, y: 12 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] as const },
  }

  // ─────────────────────────────────────────────────────────────────────────────
  return (
    <div ref={containerRef} style={{ minHeight: '100svh', background: C.bg, display: 'flex', flexDirection: 'column' }}>

      {/* ── Navbar ──────────────────────────────────────────────────────────── */}
      <nav style={{
        height:         52,
        display:        'flex',
        alignItems:     'center',
        justifyContent: 'space-between',
        padding:        '0 20px',
        background:     C.navBg,
        borderBottom:   `1px solid ${C.border}`,
        flexShrink:     0,
        position:       'sticky',
        top:            0,
        zIndex:         50,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Image
            src="/assets/r_j_interiors_final_premium_logo.png"
            alt="R&J Interiors"
            width={28} height={28}
            style={{ borderRadius: '50%', outline: `1px solid rgba(201,168,76,0.4)`, outlineOffset: 1 }}
          />
          <span style={{ fontFamily: 'var(--font-playfair,Georgia,serif)', fontSize: 14, color: C.gold, letterSpacing: '0.06em' }}>
            R&amp;J
          </span>
          <span style={{ fontSize: 10, color: C.faint, letterSpacing: '0.18em', textTransform: 'uppercase' }}>
            Studio
          </span>
        </div>
        <a href="/contact" style={{
          fontSize: 10, fontWeight: 600, letterSpacing: '0.18em', textTransform: 'uppercase',
          color: C.gold, background: 'rgba(201,168,76,0.08)', border: `1px solid rgba(201,168,76,0.25)`,
          borderRadius: 999, padding: '5px 12px', textDecoration: 'none',
        }}>
          Book →
        </a>
      </nav>

      {/* ── Canvas preview ──────────────────────────────────────────────────── */}
      <div style={{ position: 'relative', width: '100%', flexShrink: 0, background: '#0A0C10' }}>
        <canvas
          ref={canvasRef}
          style={{
            display:    'block',
            width:      '100%',
            filter:     phase === 'gate' ? 'blur(10px) brightness(0.5)' : 'none',
            transition: 'filter 0.35s ease',
          }}
        />

        {/* Skeleton while template loads */}
        {!imgReady && (
          <div style={{
            position: 'absolute', inset: 0, minHeight: 180,
            background: 'linear-gradient(135deg,#16181C,#1E2026)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1.4, repeat: Infinity, ease: 'linear' }}
              style={{ width: 24, height: 24, borderRadius: '50%', border: `2px solid ${C.faint}`, borderTop: `2px solid ${C.gold}` }}
            />
          </div>
        )}

        {/* Selected colour badge */}
        {phase === 'select' && imgReady && (
          <div style={{
            position:  'absolute',
            bottom:    12,
            left:      12,
            display:   'flex',
            alignItems:'center',
            gap:       8,
            background:'rgba(10,12,16,0.72)',
            backdropFilter: 'blur(6px)',
            border:    `1px solid rgba(255,255,255,0.08)`,
            borderRadius: 8,
            padding:   '6px 10px',
          }}>
            <div style={{ width: 16, height: 16, borderRadius: 3, background: swatch.hex, flexShrink: 0 }} />
            <div>
              <p style={{ fontFamily: 'var(--font-inter,sans-serif)', fontSize: 11, color: C.text, margin: 0 }}>{swatch.name}</p>
              <p style={{ fontFamily: 'var(--font-inter,sans-serif)', fontSize: 9, color: C.faint, margin: 0, letterSpacing: '0.14em', textTransform: 'uppercase' }}>{swatch.collection}</p>
            </div>
          </div>
        )}

        {/* Payment gate overlay */}
        {phase === 'gate' && (
          <div style={{
            position:       'absolute',
            inset:          0,
            overflowY:      'auto',
            display:        'flex',
            flexDirection:  'column',
            alignItems:     'center',
            justifyContent: 'center',
            gap:            14,
            padding:        '24px',
            background:     'rgba(10,14,20,0.50)',
          }}>
            {/* Lock */}
            <div style={{
              width: 48, height: 48, borderRadius: '50%',
              background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(8px)',
              border: '1.5px solid rgba(255,255,255,0.18)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round">
                <rect x="3" y="11" width="18" height="11" rx="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
            </div>

            <div style={{ textAlign: 'center' }}>
              <p style={{ fontFamily: 'var(--font-playfair,Georgia,serif)', fontSize: 19, color: '#FFF', margin: 0, marginBottom: 4 }}>
                Your preview is ready.
              </p>
              <p style={{ fontFamily: 'var(--font-inter,sans-serif)', fontSize: 12, color: 'rgba(255,255,255,0.5)', margin: 0 }}>
                Unlock to see the full render
              </p>
            </div>

            {/* Price cards */}
            <div style={{ display: 'flex', gap: 10, width: '100%', maxWidth: 280 }}>
              {([100, 300] as const).map(price => {
                const active = selectedPrice === price
                return (
                  <button key={price} onClick={() => setSelectedPrice(price)} style={{
                    flex: 1, padding: '10px 8px', borderRadius: 10, cursor: 'pointer',
                    border:     active ? `2px solid ${C.gold}` : '1.5px solid rgba(255,255,255,0.12)',
                    background: active ? 'rgba(201,168,76,0.12)' : 'rgba(255,255,255,0.04)',
                    textAlign:  'center', transition: 'all 0.15s',
                  }}>
                    <div style={{ fontFamily: 'var(--font-playfair,Georgia,serif)', fontSize: 18, color: active ? C.goldLight : '#FFF', marginBottom: 3 }}>
                      KES {price}
                    </div>
                    <div style={{ fontFamily: 'var(--font-inter,sans-serif)', fontSize: 10, color: active ? 'rgba(232,200,122,0.7)' : 'rgba(255,255,255,0.38)', lineHeight: 1.4 }}>
                      {price === 100 ? 'Preview\n+ Fabric name' : 'Preview\n+ Full quote'}
                    </div>
                  </button>
                )
              })}
            </div>

            {/* Phone input + pay button */}
            {!paying ? (
              <div style={{ width: '100%', maxWidth: 280, display: 'flex', flexDirection: 'column', gap: 8 }}>
                <div style={{
                  display: 'flex', borderRadius: 10, overflow: 'hidden',
                  border: '1.5px solid rgba(255,255,255,0.18)',
                  background: 'rgba(255,255,255,0.06)',
                }}>
                  <div style={{ padding: '0 12px', borderRight: '1px solid rgba(255,255,255,0.12)', display: 'flex', alignItems: 'center', flexShrink: 0 }}>
                    <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.65)' }}>🇰🇪 +254</span>
                  </div>
                  <input
                    type="tel" inputMode="numeric" placeholder="7XX XXX XXX"
                    value={phone}
                    onChange={e => setPhone(e.target.value.replace(/\D/g,'').slice(0,10))}
                    style={{
                      flex: 1, padding: '12px', border: 'none', outline: 'none',
                      background: 'transparent', color: '#FFF', fontSize: 15,
                      fontFamily: 'var(--font-inter,sans-serif)',
                    }}
                  />
                </div>
                {payError && (
                  <p style={{ margin: 0, fontSize: 11, color: '#F87171', textAlign: 'center', fontFamily: 'var(--font-inter,sans-serif)' }}>
                    {payError}
                  </p>
                )}
                <button onClick={handlePay} disabled={!phoneValid} style={{
                  padding: '13px', borderRadius: 10, border: 'none', cursor: phoneValid ? 'pointer' : 'default',
                  background: phoneValid ? 'linear-gradient(135deg,#007A39,#00A84F)' : 'rgba(255,255,255,0.10)',
                  color:      phoneValid ? '#FFF' : 'rgba(255,255,255,0.30)',
                  fontFamily: 'var(--font-inter,sans-serif)', fontSize: 14, fontWeight: 700,
                }}>
                  Pay KES {selectedPrice} via M-Pesa
                </button>
                <button onClick={() => setPhase('select')} style={{
                  background: 'none', border: 'none', color: 'rgba(255,255,255,0.35)',
                  fontSize: 11, cursor: 'pointer', fontFamily: 'var(--font-inter,sans-serif)',
                }}>
                  ← Go back
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
                  style={{ width: 30, height: 30, borderRadius: '50%', border: '3px solid rgba(255,255,255,0.15)', borderTop: '3px solid #FFF' }}
                />
                <p style={{ fontFamily: 'var(--font-inter,sans-serif)', fontSize: 12, color: 'rgba(255,255,255,0.6)', margin: 0 }}>
                  Check your phone for the M-Pesa prompt…
                </p>
                {canRetry && (
                  <button onClick={() => { setCanRetry(false); setCheckoutId(null); setPaying(false); handlePay() }}
                    style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', fontSize: 11, cursor: 'pointer', textDecoration: 'underline', fontFamily: 'var(--font-inter,sans-serif)' }}>
                    Didn&apos;t get the prompt? Try again
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── Scrollable content below canvas ─────────────────────────────────── */}
      <div style={{ flex: 1, overflowY: 'auto', background: C.bg, paddingBottom: 'env(safe-area-inset-bottom,32px)' }}>

        {/* ── SELECT phase ──────────────────────────────────────────────────── */}
        {phase === 'select' && (
          <motion.div {...fadeUp}>

            {/* Colour picker */}
            <div style={{ padding: '22px 20px 0' }}>
              <SectionLabel>Choose a colour</SectionLabel>
            </div>
            <div style={{
              display:    'flex',
              gap:        10,
              overflowX:  'auto',
              padding:    '14px 20px 4px',
              scrollbarWidth: 'none',
            }}>
              {SWATCHES.map(s => {
                const active = swatch.hex === s.hex
                return (
                  <button
                    key={s.hex}
                    onClick={() => setSwatch(s)}
                    title={s.name}
                    style={{
                      flexShrink:  0,
                      width:       52,
                      height:      76,
                      borderRadius: 6,
                      background:  s.hex,
                      border:      active ? `3px solid ${C.gold}` : '3px solid transparent',
                      boxShadow:   active ? `0 0 0 1px ${C.gold}55, 0 4px 14px rgba(0,0,0,0.5)` : '0 2px 8px rgba(0,0,0,0.4)',
                      cursor:      'pointer',
                      transition:  'border-color 0.15s, box-shadow 0.15s',
                    }}
                  />
                )
              })}
            </div>

            <GoldRule />

            {/* Form */}
            <div style={{ padding: '22px 20px 0', display: 'flex', flexDirection: 'column', gap: 26 }}>

              {/* Room type */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <SectionLabel>Room type</SectionLabel>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {([
                    ['living',  'Living Room'],
                    ['bedroom', 'Bedroom'],
                    ['dining',  'Dining Room'],
                    ['kitchen', 'Kitchen'],
                    ['office',  'Office'],
                  ] as [RoomType, string][]).map(([v, label]) => (
                    <Pill key={v} label={label} active={roomType === v} onClick={() => setRoomType(v)} />
                  ))}
                </div>
              </div>

              {/* Window size */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <SectionLabel>Window size</SectionLabel>
                <div style={{ display: 'flex', gap: 8 }}>
                  {([
                    ['small',  'Small',  '< 1 m'],
                    ['medium', 'Medium', '1–2 m'],
                    ['large',  'Large',  '> 2 m'],
                  ] as [WindowSize, string, string][]).map(([v, label, sub]) => (
                    <Pill key={v} label={label} sub={sub} active={windowSize === v} onClick={() => setWindowSize(v)} />
                  ))}
                </div>
              </div>

              {/* Light preference */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <SectionLabel>Light control</SectionLabel>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {([
                    ['airy',     'Open & airy'],
                    ['filtered', 'Some filtering'],
                    ['blackout', 'Full blackout'],
                  ] as [LightPref, string][]).map(([v, label]) => (
                    <Pill key={v} label={label} active={lightPref === v} onClick={() => setLightPref(v)} />
                  ))}
                </div>
              </div>

            </div>

            {/* Progress + CTA */}
            <div style={{ padding: '28px 20px 24px', display: 'flex', flexDirection: 'column', gap: 14 }}>

              {/* Progress dots */}
              <div style={{ display: 'flex', gap: 6, justifyContent: 'center' }}>
                {[!!roomType, !!windowSize, !!lightPref, true /* colour always chosen */].map((done, i) => (
                  <div key={i} style={{
                    width: done ? 22 : 6, height: 6, borderRadius: 999,
                    background: done ? C.gold : C.faint,
                    transition: 'all 0.25s ease',
                  }} />
                ))}
              </div>

              <button
                onClick={() => formComplete && setPhase('gate')}
                disabled={!formComplete}
                style={{
                  width:         '100%',
                  padding:       '16px',
                  borderRadius:  10,
                  border:        'none',
                  background:    formComplete
                    ? `linear-gradient(135deg,${C.goldLight},${C.gold})`
                    : 'rgba(255,255,255,0.05)',
                  color:         formComplete ? '#0A0F1C' : C.faint,
                  fontFamily:    'var(--font-inter,sans-serif)',
                  fontSize:      13,
                  fontWeight:    700,
                  letterSpacing: '0.16em',
                  textTransform: 'uppercase',
                  cursor:        formComplete ? 'pointer' : 'default',
                  transition:    'background 0.25s',
                  boxShadow:     formComplete ? '0 4px 20px rgba(201,168,76,0.25)' : 'none',
                }}
              >
                {formComplete
                  ? 'See My Preview →'
                  : `${[!!roomType, !!windowSize, !!lightPref].filter(Boolean).length} / 3 fields to go`}
              </button>

              <p style={{ fontSize: 10, color: C.faint, textAlign: 'center', lineHeight: 1.7 }}>
                On-screen colour is a guide. We confirm the exact fabric with you before making anything.
              </p>
            </div>

          </motion.div>
        )}

        {/* ── REVEALED phase ────────────────────────────────────────────────── */}
        {phase === 'revealed' && (
          <motion.div {...fadeUp} style={{ padding: '22px 20px' }}>

            {/* Fabric card */}
            <div style={{
              display:      'flex',
              alignItems:   'flex-start',
              gap:          14,
              padding:      '18px',
              background:   'rgba(201,168,76,0.05)',
              border:       `1px solid ${C.border}`,
              borderRadius: 10,
              marginBottom: 20,
            }}>
              <div style={{
                width: 40, height: 60, borderRadius: 5,
                background: swatch.hex, flexShrink: 0,
                boxShadow: '0 2px 10px rgba(0,0,0,0.4)',
              }} />
              <div style={{ minWidth: 0 }}>
                <p style={{ fontSize: 9, color: C.gold, letterSpacing: '0.28em', textTransform: 'uppercase', marginBottom: 4 }}>
                  {swatch.collection}
                </p>
                <p style={{ fontFamily: 'var(--font-playfair,Georgia,serif)', fontSize: 18, color: C.text, fontWeight: 400, marginBottom: 6 }}>
                  {swatch.name}
                </p>
                <p style={{ fontSize: 12, color: C.muted, lineHeight: 1.6 }}>
                  {roomType ? roomType.charAt(0).toUpperCase() + roomType.slice(1).replace('living','Living Room').replace('dining','Dining Room') : ''} ·{' '}
                  {windowSize === 'small' ? '< 1 m window' : windowSize === 'medium' ? '1–2 m window' : '> 2 m window'} ·{' '}
                  {lightPref === 'airy' ? 'Open & airy' : lightPref === 'filtered' ? 'Filtered light' : 'Full blackout'}
                </p>
              </div>
            </div>

            <GoldRule />

            {/* CTA */}
            <div style={{ marginTop: 20, display: 'flex', flexDirection: 'column', gap: 12 }}>
              <a href="/contact"
                style={{
                  display:        'block',
                  width:          '100%',
                  padding:        '15px',
                  background:     `linear-gradient(135deg,${C.goldLight},${C.gold})`,
                  color:          '#0A0F1C',
                  fontFamily:     'var(--font-inter,sans-serif)',
                  fontSize:       11,
                  fontWeight:     700,
                  letterSpacing:  '0.28em',
                  textTransform:  'uppercase',
                  borderRadius:   8,
                  textDecoration: 'none',
                  textAlign:      'center',
                  boxShadow:      '0 4px 16px rgba(201,168,76,0.22)',
                }}
              >
                Book a Consultation
              </a>
              <button
                onClick={() => { setPhase('select'); setRoomType(null); setWindowSize(null); setLightPref(null) }}
                style={{
                  display:     'block', width: '100%', padding: '13px',
                  background:  'transparent', border: `1px solid rgba(201,168,76,0.2)`,
                  borderRadius: 8, color: C.muted, fontSize: 12,
                  cursor: 'pointer', fontFamily: 'var(--font-inter,sans-serif)',
                }}
              >
                Try a different colour
              </button>
            </div>

          </motion.div>
        )}

      </div>
    </div>
  )
}
