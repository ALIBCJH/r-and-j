'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import Image from 'next/image'
import { drawScene } from './curtainRenderer'
import { API_URL } from '@/app/lib/api'

// ─── Brand tokens ─────────────────────────────────────────────────────────────
const C = {
  bg:        '#08090D',
  navBg:     '#0A0B10',
  border:    'rgba(201,168,76,0.14)',
  gold:      '#C9A84C',
  goldLight: '#E8C87A',
  text:      '#F0EBE0',
  muted:     '#A09080',
  faint:     '#3A3430',
  subtle:    'rgba(255,255,255,0.04)',
} as const

// ─── Fabric catalogue ─────────────────────────────────────────────────────────
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

// ─── FabricHero ──────────────────────────────────────────────────────────────
// CSS-only curtain close-up: fold lines, header tape, gold rod, center window gap.
// The actual room render (drawScene) is the reveal AFTER payment — makes people
// want to pay to see it.
function FabricHero({ swatch, blurred = false }: { swatch: Swatch; blurred?: boolean }) {
  return (
    <div style={{
      position:   'relative',
      width:      '100%',
      height:     'clamp(220px, 55vw, 300px)',
      background: swatch.hex,
      overflow:   'hidden',
      filter:     blurred ? 'blur(12px) brightness(0.38)' : 'none',
      transition: 'filter 0.4s ease, background 0.5s ease',
      flexShrink: 0,
    }}>
      {/* Woven fold lines */}
      <div style={{
        position:        'absolute',
        inset:           0,
        backgroundImage: `
          repeating-linear-gradient(
            90deg,
            rgba(255,255,255,0.055) 0px, rgba(255,255,255,0.055) 1px,
            transparent 1px, transparent 16px,
            rgba(0,0,0,0.10) 16px, rgba(0,0,0,0.10) 17px,
            transparent 17px, transparent 32px
          )
        `,
      }} />

      {/* Pleated header tape */}
      <div style={{ position: 'absolute', top: 10, left: 0, right: 0, height: '13%', background: 'rgba(0,0,0,0.30)' }} />

      {/* Left panel shadow toward center */}
      <div style={{ position: 'absolute', top: 0, bottom: 0, left: 'calc(50% - 72px)', width: 72, background: 'linear-gradient(to right, transparent, rgba(0,0,0,0.28))' }} />

      {/* Right panel shadow toward center */}
      <div style={{ position: 'absolute', top: 0, bottom: 0, right: 'calc(50% - 72px)', width: 72, background: 'linear-gradient(to left, transparent, rgba(0,0,0,0.28))' }} />

      {/* Center window gap — the light between the two panels */}
      <div style={{
        position:   'absolute',
        top:        10,
        bottom:     0,
        left:       'calc(50% - 1px)',
        width:      2,
        background: 'rgba(255,255,255,0.22)',
        boxShadow:  '0 0 32px 14px rgba(255,255,255,0.09)',
      }} />

      {/* Outer edge shadows */}
      <div style={{
        position:   'absolute',
        inset:      0,
        background: 'linear-gradient(to right, rgba(0,0,0,0.22), transparent 22%, transparent 78%, rgba(0,0,0,0.22))',
      }} />

      {/* Gold rod */}
      <div style={{
        position:   'absolute',
        top:        0,
        left:       0,
        right:      0,
        height:     10,
        background: 'linear-gradient(to bottom, #F8EEB8, #D4A838 30%, #9C7020 68%, #5E3C0A)',
        zIndex:     2,
      }} />

      {/* Diagonal light shimmer */}
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(255,255,255,0.10) 0%, transparent 42%, rgba(0,0,0,0.10) 100%)' }} />

      {/* Bottom hem fade */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '30%', background: 'linear-gradient(to top, rgba(0,0,0,0.45), transparent)' }} />

      {/* Collection + fabric name badge */}
      {!blurred && (
        <div style={{ position: 'absolute', bottom: 14, left: 16, zIndex: 4, pointerEvents: 'none' }}>
          <p style={{ fontSize: 9, color: C.gold, letterSpacing: '0.26em', textTransform: 'uppercase', margin: 0, marginBottom: 3, fontFamily: 'var(--font-inter,sans-serif)' }}>
            {swatch.collection}
          </p>
          <p style={{ fontFamily: 'var(--font-playfair,Georgia,serif)', fontSize: 22, color: 'rgba(255,255,255,0.92)', margin: 0, fontWeight: 400, textShadow: '0 2px 12px rgba(0,0,0,0.6)' }}>
            {swatch.name}
          </p>
        </div>
      )}

      {/* Tap hint badge */}
      {!blurred && (
        <div style={{
          position: 'absolute', top: 14, right: 14,
          background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(6px)',
          borderRadius: 99, padding: '5px 11px', zIndex: 4,
        }}>
          <p style={{ fontFamily: 'var(--font-inter,sans-serif)', fontSize: 9, color: 'rgba(255,255,255,0.60)', margin: 0, letterSpacing: '0.12em' }}>
            ← tap a colour
          </p>
        </div>
      )}
    </div>
  )
}

// ─── Small atoms ──────────────────────────────────────────────────────────────
function GoldRule() {
  return <div style={{ height: 1, background: `linear-gradient(to right,transparent,${C.gold},transparent)` }} />
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p style={{ fontFamily: 'var(--font-inter,sans-serif)', fontSize: 10, letterSpacing: '0.24em', textTransform: 'uppercase', color: C.gold, margin: 0 }}>
      {children}
    </p>
  )
}

function Pill({ label, sub, active, onClick }: { label: string; sub?: string; active: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick} style={{
      padding:       '10px 16px',
      borderRadius:  8,
      border:        active ? `2px solid ${C.gold}` : `1.5px solid rgba(255,255,255,0.09)`,
      background:    active ? 'rgba(201,168,76,0.12)' : C.subtle,
      color:         active ? C.goldLight : 'rgba(255,255,255,0.50)',
      fontFamily:    'var(--font-inter,sans-serif)',
      fontSize:      13,
      fontWeight:    active ? 600 : 400,
      cursor:        'pointer',
      transition:    'all 0.15s',
      whiteSpace:    'nowrap',
      display:       'flex',
      flexDirection: 'column',
      alignItems:    'center',
      gap:           2,
    }}>
      <span>{label}</span>
      {sub && <span style={{ fontSize: 9, opacity: 0.55 }}>{sub}</span>}
    </button>
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
  const [selectedPrice, setSelectedPrice] = useState<100 | 300>(100)
  const [phone,         setPhone]         = useState('')
  const [paying,        setPaying]        = useState(false)
  const [payError,      setPayError]      = useState<string | null>(null)
  const [checkoutId,    setCheckoutId]    = useState<string | null>(null)
  const [canRetry,      setCanRetry]      = useState(false)
  const retryTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  // ── Canvas refs — only active in the revealed phase ─────────────────────────
  const canvasRef    = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const templateRef  = useRef<HTMLImageElement | null>(null)
  const [imgReady, setImgReady] = useState(false)

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

  // ── Preload template image in background ─────────────────────────────────────
  useEffect(() => {
    const img = document.createElement('img')
    img.onload = () => { templateRef.current = img; setImgReady(true) }
    img.src = '/assets/sittingroom.png'
  }, [])

  // ── Draw room canvas (revealed phase only) ───────────────────────────────────
  const redraw = useCallback(() => {
    const canvas = canvasRef.current
    const img    = templateRef.current
    const cont   = containerRef.current
    if (!canvas || !img || !cont) return
    const displayW = cont.clientWidth
    const displayH = Math.min(
      Math.round(displayW * img.naturalHeight / img.naturalWidth),
      Math.round(window.innerHeight * 0.50),
    )
    const dpr           = window.devicePixelRatio || 1
    canvas.width        = Math.round(displayW * dpr)
    canvas.height       = Math.round(displayH * dpr)
    canvas.style.width  = `${displayW}px`
    canvas.style.height = `${displayH}px`
    drawScene(canvas, img, swatch.hex)
  }, [swatch.hex])

  useEffect(() => {
    if (phase === 'revealed' && imgReady) redraw()
  }, [phase, imgReady, redraw])

  useEffect(() => {
    if (phase !== 'revealed') return
    const ro = new ResizeObserver(redraw)
    if (containerRef.current) ro.observe(containerRef.current)
    return () => ro.disconnect()
  }, [phase, redraw])

  // ── Payment retry timer ──────────────────────────────────────────────────────
  useEffect(() => {
    if (!paying) { setCanRetry(false); return }
    retryTimer.current = setTimeout(() => setCanRetry(true), 15_000)
    return () => { if (retryTimer.current) clearTimeout(retryTimer.current) }
  }, [paying])

  // ── Poll for payment status ──────────────────────────────────────────────────
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
          clearInterval(iv); setCheckoutId(null); setPaying(false); setPhase('revealed')
        } else if (data.status === 'failed') {
          clearInterval(iv); setCheckoutId(null); setPaying(false)
          setPayError('Payment declined. Check your M-Pesa balance.')
        }
      } catch { /* keep polling */ }
    }, 3000)
    return () => clearInterval(iv)
  }, [checkoutId, paying])

  // ── Initiate STK push ────────────────────────────────────────────────────────
  async function handlePay() {
    if (!phoneValid || paying) return
    setPaying(true); setPayError(null)
    try {
      const res = await fetch(`${API_URL}/mpesa/stk-push`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: formatPhone(phone), amount: selectedPrice }),
      })
      if (!res.ok) throw new Error()
      const { checkout_request_id } = await res.json()
      setCheckoutId(checkout_request_id)
    } catch {
      setPaying(false)
      setPayError('Could not reach payment service. Please try again.')
    }
  }

  const fadeUp = prefersReduced ? {} : {
    initial: { opacity: 0, y: 14 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] as const },
  }

  // ─────────────────────────────────────────────────────────────────────────────
  return (
    <div style={{ minHeight: '100svh', background: C.bg, display: 'flex', flexDirection: 'column' }}>

      {/* ── Navbar ──────────────────────────────────────────────────────────── */}
      <nav style={{
        height: 52, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 20px', background: C.navBg, borderBottom: `1px solid ${C.border}`,
        flexShrink: 0, position: 'sticky', top: 0, zIndex: 50,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Image src="/assets/r_j_interiors_final_premium_logo.png" alt="R&J Interiors"
            width={28} height={28}
            style={{ borderRadius: '50%', outline: `1px solid rgba(201,168,76,0.4)`, outlineOffset: 1 }}
          />
          <span style={{ fontFamily: 'var(--font-playfair,Georgia,serif)', fontSize: 14, color: C.gold, letterSpacing: '0.06em' }}>R&amp;J</span>
          <span style={{ fontSize: 10, color: C.faint, letterSpacing: '0.18em', textTransform: 'uppercase' }}>Studio</span>
        </div>
        <a href="/contact" style={{
          fontSize: 10, fontWeight: 600, letterSpacing: '0.18em', textTransform: 'uppercase',
          color: C.gold, background: 'rgba(201,168,76,0.08)', border: `1px solid rgba(201,168,76,0.25)`,
          borderRadius: 999, padding: '5px 12px', textDecoration: 'none',
        }}>Book →</a>
      </nav>

      {/* ══ SELECT + GATE — FabricHero (CSS curtain close-up) ════════════════ */}
      {(phase === 'select' || phase === 'gate') && (
        <div style={{ position: 'relative', flexShrink: 0 }}>
          {/* Ambient color glow behind hero */}
          <div style={{
            position: 'absolute', bottom: 0, left: '10%', right: '10%', height: '40%',
            background: `radial-gradient(ellipse at center, ${swatch.hex}26 0%, transparent 72%)`,
            transition: 'background 0.5s ease', pointerEvents: 'none', zIndex: 0,
          }} />

          <FabricHero swatch={swatch} blurred={phase === 'gate'} />

          {/* ── Gate overlay ──────────────────────────────────────────────── */}
          {phase === 'gate' && (
            <div style={{
              position: 'absolute', inset: 0, zIndex: 10,
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              gap: 16, padding: '20px 24px',
            }}>
              {/* Lock icon */}
              <div style={{
                width: 46, height: 46, borderRadius: '50%',
                background: 'rgba(255,255,255,0.10)', backdropFilter: 'blur(8px)',
                border: '1.5px solid rgba(255,255,255,0.20)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round">
                  <rect x="3" y="11" width="18" height="11" rx="2"/>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
              </div>

              <div style={{ textAlign: 'center' }}>
                <p style={{ fontFamily: 'var(--font-playfair,Georgia,serif)', fontSize: 20, color: '#FFF', margin: 0, marginBottom: 4 }}>
                  Ready to see it in your room?
                </p>
                <p style={{ fontFamily: 'var(--font-inter,sans-serif)', fontSize: 12, color: 'rgba(255,255,255,0.5)', margin: 0 }}>
                  Unlock your personalised room preview
                </p>
              </div>

              {/* Price cards */}
              <div style={{ display: 'flex', gap: 10, width: '100%', maxWidth: 290 }}>
                {([100, 300] as const).map(price => {
                  const active = selectedPrice === price
                  return (
                    <button key={price} onClick={() => setSelectedPrice(price)} style={{
                      flex: 1, padding: '10px 8px', borderRadius: 10, cursor: 'pointer',
                      border:     active ? `2px solid ${C.gold}` : '1.5px solid rgba(255,255,255,0.12)',
                      background: active ? 'rgba(201,168,76,0.13)' : 'rgba(255,255,255,0.05)',
                      textAlign:  'center', transition: 'all 0.15s',
                    }}>
                      <div style={{ fontFamily: 'var(--font-playfair,Georgia,serif)', fontSize: 20, color: active ? C.goldLight : '#FFF', marginBottom: 3 }}>
                        KES {price}
                      </div>
                      <div style={{ fontFamily: 'var(--font-inter,sans-serif)', fontSize: 10, color: active ? 'rgba(232,200,122,0.7)' : 'rgba(255,255,255,0.38)', lineHeight: 1.4 }}>
                        {price === 100 ? 'Room preview + fabric name' : 'Room preview + full quote'}
                      </div>
                    </button>
                  )
                })}
              </div>

              {/* Phone + pay */}
              {!paying ? (
                <div style={{ width: '100%', maxWidth: 290, display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <div style={{
                    display: 'flex', borderRadius: 10, overflow: 'hidden',
                    border: '1.5px solid rgba(255,255,255,0.18)', background: 'rgba(255,255,255,0.07)',
                  }}>
                    <div style={{ padding: '0 12px', borderRight: '1px solid rgba(255,255,255,0.12)', display: 'flex', alignItems: 'center', flexShrink: 0 }}>
                      <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.65)' }}>🇰🇪 +254</span>
                    </div>
                    <input
                      type="tel" inputMode="numeric" placeholder="7XX XXX XXX"
                      value={phone}
                      onChange={e => setPhone(e.target.value.replace(/\D/g,'').slice(0,10))}
                      style={{ flex: 1, padding: '12px', border: 'none', outline: 'none', background: 'transparent', color: '#FFF', fontSize: 15, fontFamily: 'var(--font-inter,sans-serif)' }}
                    />
                  </div>
                  {payError && (
                    <p style={{ margin: 0, fontSize: 11, color: '#F87171', textAlign: 'center', fontFamily: 'var(--font-inter,sans-serif)' }}>{payError}</p>
                  )}
                  <button onClick={handlePay} disabled={!phoneValid} style={{
                    padding: '13px', borderRadius: 10, border: 'none', cursor: phoneValid ? 'pointer' : 'default',
                    background: phoneValid ? 'linear-gradient(135deg,#007A39,#00A84F)' : 'rgba(255,255,255,0.08)',
                    color: phoneValid ? '#FFF' : 'rgba(255,255,255,0.28)',
                    fontFamily: 'var(--font-inter,sans-serif)', fontSize: 14, fontWeight: 700,
                  }}>
                    Pay KES {selectedPrice} via M-Pesa
                  </button>
                  <button onClick={() => setPhase('select')} style={{
                    background: 'none', border: 'none', color: 'rgba(255,255,255,0.32)',
                    fontSize: 11, cursor: 'pointer', fontFamily: 'var(--font-inter,sans-serif)',
                  }}>
                    ← Change colour or details
                  </button>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
                    style={{ width: 28, height: 28, borderRadius: '50%', border: '3px solid rgba(255,255,255,0.15)', borderTop: '3px solid #FFF' }}
                  />
                  <p style={{ fontFamily: 'var(--font-inter,sans-serif)', fontSize: 12, color: 'rgba(255,255,255,0.6)', margin: 0 }}>
                    Check your phone for the M-Pesa prompt…
                  </p>
                  {canRetry && (
                    <button onClick={() => { setCanRetry(false); setCheckoutId(null); setPaying(false); handlePay() }}
                      style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.38)', fontSize: 11, cursor: 'pointer', textDecoration: 'underline', fontFamily: 'var(--font-inter,sans-serif)' }}>
                      Didn&apos;t get the prompt? Try again
                    </button>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* ══ REVEALED — actual room render (the reward for paying) ════════════ */}
      {phase === 'revealed' && (
        <div ref={containerRef} style={{ position: 'relative', flexShrink: 0, background: '#0A0B10' }}>
          {/* "Your room" badge */}
          <div style={{
            position: 'absolute', top: 12, left: 12, zIndex: 10,
            background: 'rgba(0,0,0,0.68)', backdropFilter: 'blur(6px)',
            borderRadius: 99, padding: '5px 12px',
            display: 'flex', alignItems: 'center', gap: 6,
            border: '1px solid rgba(255,255,255,0.08)',
          }}>
            <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#4ADE80' }} />
            <span style={{ fontSize: 9, fontFamily: 'var(--font-inter,sans-serif)', color: 'rgba(255,255,255,0.8)', letterSpacing: '0.16em', textTransform: 'uppercase', fontWeight: 600 }}>
              Your room
            </span>
          </div>

          {/* Fabric badge */}
          <div style={{
            position: 'absolute', bottom: 14, left: 14, zIndex: 10,
            background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(8px)',
            borderRadius: 8, padding: '7px 12px', border: '1px solid rgba(255,255,255,0.08)',
          }}>
            <p style={{ fontSize: 8, color: C.gold, letterSpacing: '0.22em', textTransform: 'uppercase', margin: 0, marginBottom: 2 }}>{swatch.collection}</p>
            <p style={{ fontFamily: 'var(--font-playfair,Georgia,serif)', fontSize: 14, color: '#FFF', margin: 0 }}>{swatch.name}</p>
          </div>

          {/* Glass sheen */}
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(255,255,255,0.03) 0%, transparent 50%)', pointerEvents: 'none', zIndex: 9 }} />

          {!imgReady && (
            <div style={{ width: '100%', height: 240, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0D0F14' }}>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1.4, repeat: Infinity, ease: 'linear' }}
                style={{ width: 26, height: 26, borderRadius: '50%', border: `2px solid ${C.faint}`, borderTop: `2px solid ${C.gold}` }}
              />
            </div>
          )}
          <canvas ref={canvasRef} style={{ display: 'block', width: '100%' }} />
        </div>
      )}

      {/* ── Scrollable content ───────────────────────────────────────────────── */}
      <div style={{ flex: 1, overflowY: 'auto', background: C.bg, paddingBottom: 'env(safe-area-inset-bottom,32px)' }}>

        {/* ══ SELECT content ════════════════════════════════════════════════ */}
        {phase === 'select' && (
          <motion.div {...fadeUp}>

            {/* Swatch picker */}
            <div style={{ padding: '22px 20px 0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                <SectionLabel>Choose a fabric</SectionLabel>
                <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.22)', fontFamily: 'var(--font-inter,sans-serif)' }}>{SWATCHES.length} colours</span>
              </div>

              <div style={{ display: 'flex', gap: 10, overflowX: 'auto', paddingBottom: 6, scrollbarWidth: 'none' }}>
                {SWATCHES.map(s => {
                  const active = swatch.hex === s.hex
                  return (
                    <button key={s.hex} onClick={() => setSwatch(s)} style={{
                      flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'center',
                      gap: 7, background: 'none', border: 'none', cursor: 'pointer', padding: 0,
                    }}>
                      {/* Fabric sample card */}
                      <div style={{
                        width: 46, height: 80, borderRadius: 7, background: s.hex,
                        border: active ? `2.5px solid ${C.gold}` : '2.5px solid transparent',
                        boxShadow: active ? `0 0 0 1px rgba(201,168,76,0.38), 0 8px 22px ${s.hex}55` : '0 2px 10px rgba(0,0,0,0.5)',
                        position: 'relative', overflow: 'hidden', transition: 'all 0.18s ease',
                      }}>
                        {/* Woven texture */}
                        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'repeating-linear-gradient(90deg, rgba(255,255,255,0.07) 0px, rgba(255,255,255,0.07) 1px, transparent 1px, transparent 7px, rgba(0,0,0,0.08) 7px, rgba(0,0,0,0.08) 8px, transparent 8px)' }} />
                        {/* Shimmer */}
                        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(255,255,255,0.22) 0%, transparent 50%, rgba(0,0,0,0.12) 100%)' }} />
                        {/* Mini gold rod */}
                        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 5, background: 'linear-gradient(to bottom, #D4A838, #5E3C0A)' }} />
                        {/* Active check */}
                        {active && (
                          <div style={{
                            position: 'absolute', bottom: 6, right: 6,
                            width: 16, height: 16, borderRadius: '50%',
                            background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(4px)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                          }}>
                            <svg width="8" height="8" viewBox="0 0 12 12" fill="none" stroke={C.gold} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M2 6l3 3 5-5" />
                            </svg>
                          </div>
                        )}
                      </div>
                      <span style={{ fontSize: 9, color: active ? C.gold : 'rgba(255,255,255,0.28)', textAlign: 'center', maxWidth: 46, lineHeight: 1.3, fontFamily: 'var(--font-inter,sans-serif)', transition: 'color 0.18s', display: 'block' }}>
                        {s.name.split(' ').slice(0, 2).join(' ')}
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>

            <div style={{ height: 1, background: 'rgba(201,168,76,0.08)', margin: '22px 0 0' }} />

            {/* About your space */}
            <div style={{ padding: '22px 20px 0' }}>
              <div style={{ marginBottom: 22 }}>
                <SectionLabel>About your space</SectionLabel>
                <p style={{ fontFamily: 'var(--font-inter,sans-serif)', fontSize: 12, color: 'rgba(255,255,255,0.28)', margin: '6px 0 0' }}>
                  3 quick questions — helps us get the match right
                </p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <span style={{ fontFamily: 'var(--font-inter,sans-serif)', fontSize: 11, color: 'rgba(255,255,255,0.42)', letterSpacing: '0.1em' }}>Room type</span>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    {([['living','Living Room'],['bedroom','Bedroom'],['dining','Dining'],['kitchen','Kitchen'],['office','Office']] as [RoomType,string][]).map(([v,label]) => (
                      <Pill key={v} label={label} active={roomType === v} onClick={() => setRoomType(v)} />
                    ))}
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <span style={{ fontFamily: 'var(--font-inter,sans-serif)', fontSize: 11, color: 'rgba(255,255,255,0.42)', letterSpacing: '0.1em' }}>Window size</span>
                  <div style={{ display: 'flex', gap: 8 }}>
                    {([['small','Small','< 1 m'],['medium','Medium','1–2 m'],['large','Large','> 2 m']] as [WindowSize,string,string][]).map(([v,label,sub]) => (
                      <Pill key={v} label={label} sub={sub} active={windowSize === v} onClick={() => setWindowSize(v)} />
                    ))}
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <span style={{ fontFamily: 'var(--font-inter,sans-serif)', fontSize: 11, color: 'rgba(255,255,255,0.42)', letterSpacing: '0.1em' }}>Light control</span>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    {([['airy','Open & airy'],['filtered','Some filtering'],['blackout','Full blackout']] as [LightPref,string][]).map(([v,label]) => (
                      <Pill key={v} label={label} active={lightPref === v} onClick={() => setLightPref(v)} />
                    ))}
                  </div>
                </div>

              </div>
            </div>

            {/* Progress + CTA */}
            <div style={{ padding: '28px 20px 28px', display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ display: 'flex', gap: 6, justifyContent: 'center' }}>
                {[!!roomType, !!windowSize, !!lightPref, true].map((done, i) => (
                  <div key={i} style={{ width: done ? 20 : 6, height: 6, borderRadius: 999, background: done ? C.gold : C.faint, transition: 'all 0.25s ease' }} />
                ))}
              </div>

              <button
                onClick={() => formComplete && setPhase('gate')}
                disabled={!formComplete}
                style={{
                  width: '100%', padding: '16px', borderRadius: 10, border: 'none',
                  background:    formComplete ? `linear-gradient(135deg,${C.goldLight},${C.gold})` : 'rgba(255,255,255,0.04)',
                  color:         formComplete ? '#0A0F1C' : C.faint,
                  fontFamily:    'var(--font-inter,sans-serif)',
                  fontSize:      12, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase',
                  cursor:        formComplete ? 'pointer' : 'default',
                  transition:    'background 0.25s',
                  boxShadow:     formComplete ? '0 4px 20px rgba(201,168,76,0.22)' : 'none',
                }}
              >
                {formComplete ? 'See It In My Room →' : `${[!!roomType, !!windowSize, !!lightPref].filter(Boolean).length} / 3 to go`}
              </button>

              <p style={{ fontSize: 10, color: C.faint, textAlign: 'center', lineHeight: 1.8, fontFamily: 'var(--font-inter,sans-serif)' }}>
                Your room preview unlocks after a small payment — KES 100 or 300.
                We confirm the exact fabric with you before making anything.
              </p>
            </div>

          </motion.div>
        )}

        {/* ══ WHY IT WORKS — feature strip (select phase only) ════════════════ */}
        {phase === 'select' && (
          <div style={{ background: 'rgba(255,255,255,0.02)', borderTop: `1px solid rgba(201,168,76,0.08)`, padding: '28px 20px 32px' }}>
            <p style={{ fontFamily: 'var(--font-inter,sans-serif)', fontSize: 10, letterSpacing: '0.26em', textTransform: 'uppercase', color: C.gold, margin: '0 0 22px' }}>
              What you get
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {[
                {
                  icon: '✦',
                  title: 'Every fabric. Real feel.',
                  body:  'Sheer linen that whispers light. Heavy velvet that commands a room. Each colour swatch you see is matched to a real fabric in our collection — not a guess.',
                },
                {
                  icon: '◈',
                  title: 'Your room. Before you pay for it.',
                  body:  'Once you unlock the preview, you see your chosen curtain in an actual room — not a showroom, not a mood board. Something you can picture hanging in your home.',
                },
                {
                  icon: '◇',
                  title: 'Order with certainty.',
                  body:  'No more hoping the swatch matches. What you confirm with us is what we make. Zero surprises. Same-day quote. Delivered and installed.',
                },
              ].map(f => (
                <div key={f.title} style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                  <span style={{ fontSize: 14, color: C.gold, flexShrink: 0, marginTop: 2, fontFamily: 'var(--font-playfair,Georgia,serif)' }}>{f.icon}</span>
                  <div>
                    <p style={{ fontFamily: 'var(--font-inter,sans-serif)', fontSize: 13, fontWeight: 600, color: C.text, margin: '0 0 5px', letterSpacing: '0.01em' }}>{f.title}</p>
                    <p style={{ fontFamily: 'var(--font-inter,sans-serif)', fontSize: 12, color: C.muted, lineHeight: 1.75, margin: 0 }}>{f.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ══ REVEALED content ════════════════════════════════════════════════ */}
        {phase === 'revealed' && (
          <motion.div {...fadeUp} style={{ padding: '22px 20px' }}>
            <GoldRule />

            {/* Fabric detail card */}
            <div style={{
              display: 'flex', alignItems: 'flex-start', gap: 14, padding: '18px',
              background: 'rgba(201,168,76,0.04)', border: `1px solid ${C.border}`,
              borderRadius: 10, margin: '20px 0',
            }}>
              <div style={{
                width: 36, height: 58, borderRadius: 5, background: swatch.hex, flexShrink: 0,
                boxShadow: `0 4px 14px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.05)`,
                position: 'relative', overflow: 'hidden',
              }}>
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(255,255,255,0.18) 0%, transparent 60%)' }} />
              </div>
              <div style={{ minWidth: 0 }}>
                <p style={{ fontSize: 9, color: C.gold, letterSpacing: '0.28em', textTransform: 'uppercase', marginBottom: 4 }}>{swatch.collection}</p>
                <p style={{ fontFamily: 'var(--font-playfair,Georgia,serif)', fontSize: 20, color: C.text, fontWeight: 400, marginBottom: 6 }}>{swatch.name}</p>
                <p style={{ fontSize: 12, color: C.muted, lineHeight: 1.65, fontFamily: 'var(--font-inter,sans-serif)' }}>
                  {roomType === 'living' ? 'Living Room' : roomType === 'dining' ? 'Dining Room' : roomType === 'bedroom' ? 'Bedroom' : roomType === 'kitchen' ? 'Kitchen' : 'Office'} ·{' '}
                  {windowSize === 'small' ? '< 1 m window' : windowSize === 'medium' ? '1–2 m window' : '> 2 m window'} ·{' '}
                  {lightPref === 'airy' ? 'Open & airy' : lightPref === 'filtered' ? 'Filtered light' : 'Full blackout'}
                </p>
              </div>
            </div>

            <GoldRule />

            <div style={{ marginTop: 20, display: 'flex', flexDirection: 'column', gap: 10 }}>
              <a href="/contact" style={{
                display: 'block', width: '100%', padding: '15px',
                background: `linear-gradient(135deg,${C.goldLight},${C.gold})`,
                color: '#0A0F1C', fontFamily: 'var(--font-inter,sans-serif)',
                fontSize: 11, fontWeight: 700, letterSpacing: '0.28em', textTransform: 'uppercase',
                borderRadius: 8, textDecoration: 'none', textAlign: 'center',
                boxShadow: '0 4px 16px rgba(201,168,76,0.22)',
              }}>
                Book a Consultation
              </a>
              <button
                onClick={() => { setPhase('select'); setRoomType(null); setWindowSize(null); setLightPref(null) }}
                style={{
                  display: 'block', width: '100%', padding: '13px',
                  background: 'transparent', border: `1px solid rgba(201,168,76,0.18)`,
                  borderRadius: 8, color: C.muted, fontSize: 12, cursor: 'pointer',
                  fontFamily: 'var(--font-inter,sans-serif)',
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
