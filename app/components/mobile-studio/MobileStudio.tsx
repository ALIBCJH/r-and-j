'use client'

/**
 * MobileStudio — "See it in your room"
 *
 * A photo-based fabric matcher for phones.
 * The user takes (or chooses) a photo of their window wall, taps a point
 * to sample the wall colour, and gets ordered fabric recommendations.
 * Tapping a swatch draws curtain panels onto the photo in that colour.
 *
 * Phase 2 handoff points (NOT built here):
 *  - Live AR via getUserMedia (phase 2)
 *  - KES 100 deposit / STK push via Daraja (phase 2) — see "PAYMENT_SLOT" comment
 */

import { useState, useRef, useCallback, useEffect } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import Image from 'next/image'
import {
  rgbToHsl, rgbToHex, sampleCanvasColor, getRecommendations,
  type Recommendation,
} from '@/app/lib/colorEngine'
import { drawScene, initOffscreen } from './curtainRenderer'
import { API_URL } from '@/app/lib/api'

// ─── Types ────────────────────────────────────────────────────────────────────

type Phase = 'idle' | 'loaded' | 'form' | 'gate' | 'rendered'

type RoomType    = 'living' | 'bedroom' | 'dining' | 'kitchen' | 'office'
type WindowSize  = 'small' | 'medium' | 'large'
type LightPref   = 'airy' | 'filtered' | 'blackout'
type DecorStyle  = 'modern' | 'classic' | 'bold'
type ColourPref  = 'any' | 'warm' | 'cool' | 'neutral' | 'rich'

interface RoomDetails {
  roomType:   RoomType
  windowSize: WindowSize
  lightPref:  LightPref
  decorStyle: DecorStyle
  colourPref: ColourPref
}

interface WallSample {
  r: number; g: number; b: number
  hex: string
}

interface TapMarker {
  // CSS pixel coords relative to the canvas display element
  x: number; y: number
}

// ─── Brand tokens (mirrors globals.css / the rest of the site) ───────────────

const C = {
  bg:         '#111113',
  navBg:      '#0E0E10',
  border:     'rgba(201,168,76,0.14)',
  gold:       '#C9A84C',
  goldLight:  '#E8C87A',
  text:       '#F0EBE0',
  muted:      '#A09080',
  veryMuted:  '#504840',
  panelBg:    'rgba(17,17,19,0.96)',
} as const

// ─── Small shared atoms ───────────────────────────────────────────────────────

function GoldRule() {
  return <div style={{ width: '100%', height: '1px', background: `linear-gradient(to right, transparent, ${C.gold}, transparent)` }} />
}

// ─── Form helper atoms ────────────────────────────────────────────────────────

function FormSection({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
      <p style={{ fontFamily: 'var(--font-inter, sans-serif)', fontSize: 10, letterSpacing: '0.22em', textTransform: 'uppercase', color: C.gold, margin: 0 }}>
        {label}
      </p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
        {children}
      </div>
    </div>
  )
}

function Chip({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding:      '7px 12px',
        borderRadius: 6,
        border:       active ? `1.5px solid ${C.gold}` : '1.5px solid rgba(255,255,255,0.12)',
        background:   active ? 'rgba(201,168,76,0.14)' : 'rgba(255,255,255,0.04)',
        color:        active ? C.goldLight : 'rgba(255,255,255,0.55)',
        fontFamily:   'var(--font-inter, sans-serif)',
        fontSize:     12,
        cursor:       'pointer',
        transition:   'all 0.15s',
        whiteSpace:   'nowrap',
      }}
    >
      {label}
    </button>
  )
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function MobileStudio() {
  const prefersReduced = useReducedMotion()

  // ── Core state ─────────────────────────────────────────────────────────────
  const [phase,        setPhase]        = useState<Phase>('idle')
  const [photoUrl,     setPhotoUrl]     = useState<string | null>(null)
  const [wall,         setWall]         = useState<WallSample | null>(null)
  const [recs,         setRecs]         = useState<Recommendation[] | null>(null)
  const [selectedRec,  setSelectedRec]  = useState<Recommendation | null>(null)
  const [tapMarker,    setTapMarker]    = useState<TapMarker | null>(null)
  const [samplingHint, setSamplingHint] = useState(false)
  const [sliderPct,    setSliderPct]    = useState(50)

  // Room details form
  const [roomType,   setRoomType]   = useState<RoomType | null>(null)
  const [windowSize, setWindowSize] = useState<WindowSize | null>(null)
  const [lightPref,  setLightPref]  = useState<LightPref | null>(null)
  const [decorStyle, setDecorStyle] = useState<DecorStyle | null>(null)
  const [colourPref, setColourPref] = useState<ColourPref>('any')

  // Payment gate
  const [selectedPrice,  setSelectedPrice]  = useState<100 | 300>(100)
  const [gatePhone,      setGatePhone]      = useState('')
  const [gatePending,    setGatePending]    = useState(false)
  const [gateError,      setGateError]      = useState<string | null>(null)
  const [gateCheckoutId, setGateCheckoutId] = useState<string | null>(null)
  const [gateCanRetry,   setGateCanRetry]   = useState(false)
  const retryTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  // ── Refs ────────────────────────────────────────────────────────────────────
  const fileInputRef    = useRef<HTMLInputElement>(null)
  const imgRef          = useRef<HTMLImageElement | null>(null)
  const canvasRef       = useRef<HTMLCanvasElement>(null)
  const canvasDivRef    = useRef<HTMLDivElement>(null)  // canvas container, used for slider drag
  const offscreenRef    = useRef<HTMLCanvasElement | null>(null)
  const containerRef    = useRef<HTMLDivElement>(null)
  const isDraggingSlider = useRef(false)

  // ── Resize canvas when container changes ────────────────────────────────────
  const resizeAndRedraw = useCallback(() => {
    const canvas = canvasRef.current
    const img    = imgRef.current
    const cont   = containerRef.current
    if (!canvas || !img || !cont) return

    const displayW = cont.clientWidth
    const nativeAR = img.naturalWidth / img.naturalHeight
    const displayH = Math.min(
      Math.round(displayW / nativeAR),
      Math.round(window.innerHeight * 0.54),
    )

    // Scale to device pixel ratio for crisp rendering on retina screens
    const dpr = window.devicePixelRatio || 1
    canvas.width        = Math.round(displayW * dpr)
    canvas.height       = Math.round(displayH * dpr)
    canvas.style.width  = `${displayW}px`
    canvas.style.height = `${displayH}px`

    // drawScene resets the transform internally — no ctx.scale needed here.
    // canvas.width = displayW * dpr already gives retina sharpness.
    drawScene(canvas, img, selectedRec?.hex ?? null)
  }, [selectedRec])

  useEffect(() => {
    if (phase === 'idle') return
    const ro = new ResizeObserver(resizeAndRedraw)
    if (containerRef.current) ro.observe(containerRef.current)
    return () => ro.disconnect()
  }, [phase, resizeAndRedraw])

  // ── Photo file handling ──────────────────────────────────────────────────────
  const handleFile = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) return
    const url = URL.createObjectURL(file)
    setPhotoUrl(url)

    const img = document.createElement('img')
    img.onload = () => {
      imgRef.current = img

      // Init the offscreen canvas (clean copy — never drawn on again)
      if (!offscreenRef.current) offscreenRef.current = document.createElement('canvas')
      initOffscreen(offscreenRef.current, img)

      // Reset state
      setWall(null)
      setRecs(null)
      setSelectedRec(null)
      setTapMarker(null)
      setPhase('loaded')

      // Draw photo onto display canvas on next tick (after state settles)
      requestAnimationFrame(() => {
        const canvas = canvasRef.current
        const cont   = containerRef.current
        if (!canvas || !cont) return

        const displayW = cont.clientWidth
        const nativeAR = img.naturalWidth / img.naturalHeight
        const displayH = Math.min(
          Math.round(displayW / nativeAR),
          Math.round(window.innerHeight * 0.54),
        )
        const dpr = window.devicePixelRatio || 1
        canvas.width        = Math.round(displayW * dpr)
        canvas.height       = Math.round(displayH * dpr)
        canvas.style.width  = `${displayW}px`
        canvas.style.height = `${displayH}px`

        drawScene(canvas, img, null)
        setSamplingHint(true)
      })
    }
    img.src = url
  }, [])

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleFile(file)
    e.target.value = ''  // allow re-selecting the same file
  }

  // ── Canvas tap → sample wall colour ─────────────────────────────────────────
  const handleCanvasTap = useCallback((e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    // Only sample colour in 'loaded' phase. In 'rendered' phase the slider handles touch.
    if (phase !== 'loaded') return
    const canvas    = canvasRef.current
    const offscreen = offscreenRef.current
    const img       = imgRef.current
    if (!canvas || !offscreen || !img) return

    const rect = canvas.getBoundingClientRect()

    // Resolve click/touch coords in CSS px relative to canvas element
    let clientX: number, clientY: number
    if ('touches' in e) {
      clientX = e.touches[0]?.clientX ?? e.changedTouches[0].clientX
      clientY = e.touches[0]?.clientY ?? e.changedTouches[0].clientY
    } else {
      clientX = e.clientX
      clientY = e.clientY
    }

    const cssX = clientX - rect.left
    const cssY = clientY - rect.top

    // Map CSS coords → offscreen (native image resolution) coords
    const offscreenX = (cssX / rect.width)  * offscreen.width
    const offscreenY = (cssY / rect.height) * offscreen.height

    const [r, g, b] = sampleCanvasColor(offscreen, offscreenX, offscreenY)
    const hex = rgbToHex(r, g, b)

    setWall({ r, g, b, hex })
    setTapMarker({ x: cssX, y: cssY })
    setSamplingHint(false)

    const newRecs = getRecommendations(r, g, b)
    setRecs(newRecs)
    setSelectedRec(newRecs[0])

    // Go to form — curtain renders only after user submits room details
    setPhase('form')
  }, [phase])

  // ── Room-details form submit ────────────────────────────────────────────────
  const formComplete = !!(roomType && windowSize && lightPref && decorStyle)

  function hexLightness(hex: string): number {
    const n = parseInt(hex.replace('#', ''), 16)
    const r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255
    return (Math.max(r, g, b) + Math.min(r, g, b)) / 510  // 0–1
  }
  function hexHue(hex: string): number {
    const n = parseInt(hex.replace('#', ''), 16)
    const r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255
    const [h] = rgbToHsl(r, g, b)
    return h  // 0–360
  }

  function selectByPreferences(all: Recommendation[]): Recommendation {
    if (all.length === 0) return all[0]
    const scored = all.map(rec => {
      let s = 0
      const l = hexLightness(rec.hex)
      const h = hexHue(rec.hex)
      if (lightPref === 'airy'     && l > 0.55) s += 3
      if (lightPref === 'filtered' && l >= 0.35 && l <= 0.65) s += 3
      if (lightPref === 'blackout' && l < 0.45) s += 3
      if (colourPref === 'warm'    && (h < 60 || h > 300)) s += 2
      if (colourPref === 'cool'    && h > 160 && h < 280) s += 2
      if (colourPref === 'neutral' && l > 0.3 && l < 0.75) s += 2
      if (colourPref === 'rich'    && rec.isBold) s += 2
      if (decorStyle === 'bold'    && rec.isBold) s += 1
      if (decorStyle === 'modern'  && !rec.isBold && l > 0.4) s += 1
      if (decorStyle === 'classic' && (h > 20 && h < 55)) s += 1  // warm earthy tones
      return { rec, s }
    })
    scored.sort((a, b) => b.s - a.s)
    return scored[0].rec
  }

  const handleFormSubmit = () => {
    if (!formComplete || !recs || !canvasRef.current || !imgRef.current) return
    const best = selectByPreferences(recs)
    setSelectedRec(best)
    requestAnimationFrame(() => {
      if (canvasRef.current && imgRef.current) {
        drawScene(canvasRef.current, imgRef.current, best.hex)
        setPhase('gate')
      }
    })
  }

  // ── Before/after slider drag ─────────────────────────────────────────────────
  const handleSliderDown = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation()
    isDraggingSlider.current = true

    const onMove = (ev: MouseEvent | TouchEvent) => {
      if (!isDraggingSlider.current) return
      const div = canvasDivRef.current
      if (!div) return
      const rect    = div.getBoundingClientRect()
      const clientX = 'touches' in ev ? ev.touches[0].clientX : (ev as MouseEvent).clientX
      const raw     = ((clientX - rect.left) / rect.width) * 100
      setSliderPct(Math.min(96, Math.max(4, raw)))
    }

    const onUp = () => {
      isDraggingSlider.current = false
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('touchmove', onMove)
      window.removeEventListener('mouseup', onUp)
      window.removeEventListener('touchend', onUp)
    }

    window.addEventListener('mousemove', onMove)
    window.addEventListener('touchmove', onMove, { passive: true })
    window.addEventListener('mouseup', onUp)
    window.addEventListener('touchend', onUp)
  }, [])

  // ── Swatch selection ─────────────────────────────────────────────────────────
  const selectRec = useCallback((rec: Recommendation) => {
    setSelectedRec(rec)
    requestAnimationFrame(() => {
      if (canvasRef.current && imgRef.current) {
        drawScene(canvasRef.current, imgRef.current, rec.hex)
      }
    })
  }, [])

  // ── Payment gate helpers ─────────────────────────────────────────────────────
  function formatPhone(raw: string) {
    const d = raw.replace(/\D/g, '')
    if (d.startsWith('254')) return `+${d}`
    if (d.startsWith('0'))   return `+254${d.slice(1)}`
    return `+254${d}`
  }
  const gatePhoneValid = gatePhone.replace(/\D/g, '').length >= 9

  useEffect(() => {
    if (!gatePending) { setGateCanRetry(false); return }
    retryTimer.current = setTimeout(() => setGateCanRetry(true), 15000)
    return () => { if (retryTimer.current) clearTimeout(retryTimer.current) }
  }, [gatePending])

  useEffect(() => {
    if (!gateCheckoutId || !gatePending) return
    let attempts = 0
    const interval = setInterval(async () => {
      attempts++
      if (attempts > 40) {
        clearInterval(interval)
        setGateCheckoutId(null)
        setGatePending(false)
        setGateError('Payment timed out. Please try again.')
        return
      }
      try {
        const res  = await fetch(`${API_URL}/mpesa/status/${gateCheckoutId}`)
        const data = await res.json()
        if (data.status === 'complete') {
          clearInterval(interval)
          setGateCheckoutId(null)
          setGatePending(false)
          setPhase('rendered')
        } else if (data.status === 'failed') {
          clearInterval(interval)
          setGateCheckoutId(null)
          setGatePending(false)
          setGateError('Payment declined. Please check your M-Pesa balance and try again.')
        }
      } catch { /* keep polling */ }
    }, 3000)
    return () => clearInterval(interval)
  }, [gateCheckoutId, gatePending])

  async function handleGatePay() {
    if (!gatePhoneValid || gatePending) return
    setGatePending(true)
    setGateError(null)
    try {
      const res = await fetch(`${API_URL}/mpesa/stk-push`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ phone: formatPhone(gatePhone), amount: selectedPrice }),
      })
      if (!res.ok) throw new Error()
      const { checkout_request_id } = await res.json()
      setGateCheckoutId(checkout_request_id)
    } catch {
      setGatePending(false)
      setGateError('Could not reach payment service. Please try again.')
    }
  }

  // ── Reset ────────────────────────────────────────────────────────────────────
  const reset = () => {
    setPhase('idle')
    setPhotoUrl(null)
    setWall(null)
    setRecs(null)
    setSelectedRec(null)
    setTapMarker(null)
    setSamplingHint(false)
    setSliderPct(50)
    setRoomType(null)
    setWindowSize(null)
    setLightPref(null)
    setDecorStyle(null)
    setColourPref('any')
    setSelectedPrice(100)
    setGatePhone('')
    setGatePending(false)
    setGateError(null)
    setGateCheckoutId(null)
    imgRef.current = null
    if (photoUrl) URL.revokeObjectURL(photoUrl)
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Render
  // ─────────────────────────────────────────────────────────────────────────────

  const ease = [0.25, 0.1, 0.25, 1] as const
  const fadeUp = prefersReduced
    ? {}
    : { initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.55, ease } }

  return (
    <div style={{ minHeight: '100svh', background: C.bg, display: 'flex', flexDirection: 'column' }}>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        style={{ display: 'none' }}
        onChange={handleFileInput}
        aria-label="Take a photo with your camera"
      />

      {/* ── Navbar ─────────────────────────────────────────────────────────── */}
      <nav style={{
        height:       '52px',
        display:      'flex',
        alignItems:   'center',
        justifyContent: 'space-between',
        padding:      '0 20px',
        background:   C.navBg,
        borderBottom: `1px solid ${C.border}`,
        flexShrink:   0,
        position:     'sticky',
        top:          0,
        zIndex:       50,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Image
            src="/assets/r_j_interiors_final_premium_logo.png"
            alt="R&J Interiors"
            width={28} height={28}
            style={{ borderRadius: '50%', outline: `1px solid rgba(201,168,76,0.4)`, outlineOffset: 1 }}
          />
          <span style={{ fontFamily: 'var(--font-playfair, Georgia, serif)', fontSize: '14px', color: C.gold, letterSpacing: '0.06em' }}>
            R&amp;J
          </span>
          <span style={{ fontSize: '10px', color: C.veryMuted, letterSpacing: '0.18em', textTransform: 'uppercase' }}>
            Photo Match
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {phase !== 'idle' && (
            <button
              onClick={reset}
              style={{ fontSize: '11px', color: C.muted, background: 'none', border: 'none', cursor: 'pointer', letterSpacing: '0.1em' }}
            >
              New photo
            </button>
          )}
          <a
            href="/style"
            style={{
              fontSize: '10px', fontWeight: 600, letterSpacing: '0.18em', textTransform: 'uppercase',
              color: C.gold, background: 'rgba(201,168,76,0.08)', border: `1px solid rgba(201,168,76,0.25)`,
              borderRadius: '999px', padding: '5px 12px', textDecoration: 'none',
            }}
          >
            Book →
          </a>
        </div>
      </nav>

      {/* ── Phase: idle ──────────────────────────────────────────────────────── */}
      {phase === 'idle' && (
        <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>

          {/* Background — same morning light illustration used on the experience page */}
          <Image
            src="/assets/morning_light_sheer.png"
            alt=""
            fill
            sizes="100vw"
            style={{ objectFit: 'cover', objectPosition: 'center 20%', opacity: 0.22 }}
            priority
          />
          {/* Dark gradient that fades to the app's solid background at the bottom */}
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(to bottom, rgba(14,14,16,0.50) 0%, rgba(17,17,19,0.82) 55%, #111113 100%)',
          }} />
          {/* Subtle gold bloom from the window area */}
          <div style={{
            position: 'absolute', top: '-80px', left: '50%', transform: 'translateX(-50%)',
            width: '320px', height: '320px',
            background: 'radial-gradient(ellipse, rgba(201,168,76,0.07) 0%, transparent 68%)',
            pointerEvents: 'none',
          }} />

          {/* Content — sits above the background layers */}
          <div style={{
            position: 'relative', zIndex: 1,
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            minHeight: '100%', padding: '52px 28px 68px',
          }}>
            <motion.div {...fadeUp} style={{ textAlign: 'center', maxWidth: '340px', width: '100%' }}>

              {/* Eyebrow label */}
              <p style={{
                fontSize: '9px', letterSpacing: '0.42em', textTransform: 'uppercase',
                color: C.gold, marginBottom: '32px',
                fontFamily: 'var(--font-inter, sans-serif)',
              }}>
                R&amp;J Interiors &nbsp;·&nbsp; Photo Match
              </p>

              <h1 style={{
                fontFamily:   'var(--font-playfair, Georgia, serif)',
                fontSize:     'clamp(34px, 9vw, 46px)',
                color:        C.text,
                fontWeight:   400,
                lineHeight:   1.08,
                marginBottom: '20px',
              }}>
                See it in<br />
                <em style={{ color: C.gold }}>your room.</em>
              </h1>

              <div style={{
                width: '32px', height: '1px',
                background: `linear-gradient(to right, ${C.gold}, ${C.goldLight})`,
                margin: '0 auto 22px',
              }} />

              <p style={{
                fontFamily: 'var(--font-inter, sans-serif)',
                fontSize: '14px', color: C.muted, lineHeight: 1.78, marginBottom: '40px',
              }}>
                Point your camera at your window wall.
                We&apos;ll show you how curtains look draped in your actual space — then name the exact fabric.
              </p>

              {/* Primary CTA — sized to match the rest of the app */}
              <button
                onClick={() => fileInputRef.current?.click()}
                style={{
                  display:       'block',
                  width:         '100%',
                  padding:       '13px 24px',
                  background:    `linear-gradient(135deg, ${C.goldLight} 0%, ${C.gold} 50%, #A67C2E 100%)`,
                  color:         '#0A0F1C',
                  fontFamily:    'var(--font-inter, sans-serif)',
                  fontSize:      '11px',
                  fontWeight:    700,
                  letterSpacing: '0.28em',
                  textTransform: 'uppercase',
                  border:        'none',
                  borderRadius:  '2px',
                  cursor:        'pointer',
                  boxShadow:     '0 4px 24px rgba(201,168,76,0.20)',
                }}
              >
                Take a Photo
              </button>

              <p style={{
                fontSize: '10px', color: C.veryMuted, lineHeight: 1.7, marginTop: '28px',
              }}>
                On-screen colour is a guide only. We confirm the exact fabric
                with you in your space before we make anything.
              </p>
            </motion.div>
          </div>
        </div>
      )}

      {/* ── Phase: loaded / rendered ─────────────────────────────────────────── */}
      {phase !== 'idle' && (
        <div ref={containerRef} style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>

          {/* Canvas area */}
          <div ref={canvasDivRef} style={{ position: 'relative', width: '100%', flexShrink: 0 }}>
            <canvas
              ref={canvasRef}
              onClick={handleCanvasTap}
              onTouchEnd={handleCanvasTap}
              style={{
                display:    'block',
                width:      '100%',
                cursor:     phase === 'loaded' ? 'crosshair' : 'default',
                pointerEvents: phase === 'form' || phase === 'gate' ? 'none' : 'auto',
                touchAction:'none',
                filter:     phase === 'gate' ? 'blur(8px) brightness(0.55)' : phase === 'form' ? 'brightness(0.45)' : 'none',
                transition: 'filter 0.3s ease',
              }}
              aria-label={phase === 'loaded' ? 'Tap your wall to sample its colour' : 'Room with curtains overlaid'}
            />

            {/* Room details form overlay */}
            {phase === 'form' && (
              <div style={{
                position:      'absolute',
                inset:         0,
                overflowY:     'auto',
                background:    'rgba(10,12,16,0.88)',
                backdropFilter:'blur(2px)',
                padding:       '20px 20px 28px',
                display:       'flex',
                flexDirection: 'column',
                gap:           16,
              }}>
                <p style={{ fontFamily: 'var(--font-playfair, Georgia, serif)', fontSize: 17, color: '#F0EBE0', margin: 0 }}>
                  Tell us about your room
                </p>
                <p style={{ fontFamily: 'var(--font-inter, sans-serif)', fontSize: 12, color: 'rgba(255,255,255,0.45)', margin: 0, marginTop: -10 }}>
                  We&apos;ll use this to match the right curtain for your space.
                </p>

                {/* Room type */}
                <FormSection label="Room type">
                  {([
                    ['living',  'Living Room'],
                    ['bedroom', 'Bedroom'],
                    ['dining',  'Dining Room'],
                    ['kitchen', 'Kitchen'],
                    ['office',  'Office'],
                  ] as [RoomType, string][]).map(([v, label]) => (
                    <Chip key={v} label={label} active={roomType === v} onClick={() => setRoomType(v)} />
                  ))}
                </FormSection>

                {/* Window size */}
                <FormSection label="Window size">
                  {([
                    ['small',  'Small  < 1 m'],
                    ['medium', 'Medium 1–2 m'],
                    ['large',  'Large  > 2 m'],
                  ] as [WindowSize, string][]).map(([v, label]) => (
                    <Chip key={v} label={label} active={windowSize === v} onClick={() => setWindowSize(v)} />
                  ))}
                </FormSection>

                {/* Light preference */}
                <FormSection label="How much light do you want?">
                  {([
                    ['airy',     'Open & airy'],
                    ['filtered', 'Some filtering'],
                    ['blackout', 'Full blackout'],
                  ] as [LightPref, string][]).map(([v, label]) => (
                    <Chip key={v} label={label} active={lightPref === v} onClick={() => setLightPref(v)} />
                  ))}
                </FormSection>

                {/* Decor style */}
                <FormSection label="Decor style">
                  {([
                    ['modern',  'Modern / Minimal'],
                    ['classic', 'Classic / Warm'],
                    ['bold',    'Bold / Statement'],
                  ] as [DecorStyle, string][]).map(([v, label]) => (
                    <Chip key={v} label={label} active={decorStyle === v} onClick={() => setDecorStyle(v)} />
                  ))}
                </FormSection>

                {/* Colour preference */}
                <FormSection label="Colour preference (optional)">
                  {([
                    ['any',     'No preference'],
                    ['warm',    'Warm tones'],
                    ['cool',    'Cool tones'],
                    ['neutral', 'Neutral / Earthy'],
                    ['rich',    'Bold & rich'],
                  ] as [ColourPref, string][]).map(([v, label]) => (
                    <Chip key={v} label={label} active={colourPref === v} onClick={() => setColourPref(v)} />
                  ))}
                </FormSection>

                <button
                  onClick={handleFormSubmit}
                  disabled={!formComplete}
                  style={{
                    marginTop:  4,
                    padding:    '14px',
                    borderRadius: 8,
                    border:     'none',
                    background: formComplete
                      ? `linear-gradient(135deg, ${C.goldLight}, ${C.gold})`
                      : 'rgba(255,255,255,0.1)',
                    color:      formComplete ? '#0A0F1C' : 'rgba(255,255,255,0.3)',
                    fontFamily: 'var(--font-inter, sans-serif)',
                    fontSize:   13,
                    fontWeight: 700,
                    letterSpacing: '0.14em',
                    textTransform: 'uppercase',
                    cursor:     formComplete ? 'pointer' : 'default',
                    transition: 'background 0.2s',
                  }}
                >
                  Generate My Preview
                </button>
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
                gap:            12,
                padding:        '24px 24px',
                background:     'rgba(10,14,20,0.45)',
              }}>
                {/* Lock icon */}
                <div style={{
                  width:          52,
                  height:         52,
                  borderRadius:   '50%',
                  background:     'rgba(255,255,255,0.1)',
                  backdropFilter: 'blur(8px)',
                  border:         '1.5px solid rgba(255,255,255,0.2)',
                  display:        'flex',
                  alignItems:     'center',
                  justifyContent: 'center',
                }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                    stroke="white" strokeWidth="2" strokeLinecap="round">
                    <rect x="3" y="11" width="18" height="11" rx="2"/>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                  </svg>
                </div>

                <p style={{ fontFamily: 'var(--font-playfair, Georgia, serif)', fontSize: 20, color: '#FFFFFF', margin: 0, textAlign: 'center', lineHeight: 1.2 }}>
                  Your room is ready.
                </p>
                <p style={{ fontFamily: 'var(--font-inter, sans-serif)', fontSize: 12, color: 'rgba(255,255,255,0.5)', margin: 0, textAlign: 'center' }}>
                  Choose a plan to unlock your preview
                </p>

                {/* Price picker */}
                <div style={{ display: 'flex', gap: 10, width: '100%', maxWidth: 280 }}>
                  {([100, 300] as const).map(price => {
                    const active = selectedPrice === price
                    return (
                      <button
                        key={price}
                        onClick={() => setSelectedPrice(price)}
                        style={{
                          flex:          1,
                          padding:       '10px 8px',
                          borderRadius:  10,
                          border:        active ? `2px solid ${C.gold}` : '1.5px solid rgba(255,255,255,0.15)',
                          background:    active ? 'rgba(201,168,76,0.12)' : 'rgba(255,255,255,0.05)',
                          cursor:        'pointer',
                          textAlign:     'center',
                          transition:    'all 0.15s',
                        }}
                      >
                        <div style={{ fontFamily: 'var(--font-playfair, Georgia, serif)', fontSize: 18, color: active ? C.goldLight : '#FFFFFF', marginBottom: 3 }}>
                          KES {price}
                        </div>
                        <div style={{ fontFamily: 'var(--font-inter, sans-serif)', fontSize: 10, color: active ? 'rgba(232,200,122,0.75)' : 'rgba(255,255,255,0.4)', lineHeight: 1.4 }}>
                          {price === 100 ? 'Preview\n+ Fabric match' : 'Preview\n+ Full quote'}
                        </div>
                      </button>
                    )
                  })}
                </div>

                {/* Phone input */}
                {!gatePending ? (
                  <div style={{ width: '100%', maxWidth: 280, display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <div style={{ display: 'flex', borderRadius: 10, border: '1.5px solid rgba(255,255,255,0.2)', overflow: 'hidden', background: 'rgba(255,255,255,0.08)' }}>
                      <div style={{ padding: '0 12px', borderRight: '1px solid rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', flexShrink: 0 }}>
                        <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.7)' }}>🇰🇪 +254</span>
                      </div>
                      <input
                        type="tel"
                        inputMode="numeric"
                        placeholder="7XX XXX XXX"
                        value={gatePhone}
                        onChange={e => setGatePhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                        style={{ flex: 1, padding: '12px', border: 'none', outline: 'none', background: 'transparent', color: '#FFFFFF', fontSize: 15, fontFamily: 'var(--font-inter, sans-serif)' }}
                      />
                    </div>

                    {gateError && (
                      <p style={{ margin: 0, fontSize: 12, color: '#F87171', fontFamily: 'var(--font-inter, sans-serif)', textAlign: 'center' }}>
                        {gateError}
                      </p>
                    )}

                    <button
                      onClick={handleGatePay}
                      disabled={!gatePhoneValid}
                      style={{
                        padding:       '13px',
                        borderRadius:  10,
                        border:        'none',
                        background:    gatePhoneValid ? 'linear-gradient(135deg,#007A39,#00A84F)' : 'rgba(255,255,255,0.12)',
                        color:         gatePhoneValid ? '#FFFFFF' : 'rgba(255,255,255,0.35)',
                        fontFamily:    'var(--font-inter, sans-serif)',
                        fontSize:      15,
                        fontWeight:    700,
                        cursor:        gatePhoneValid ? 'pointer' : 'default',
                      }}
                    >
                      Pay KES {selectedPrice} with M-Pesa
                    </button>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
                      style={{ width: 32, height: 32, borderRadius: '50%', border: '3px solid rgba(255,255,255,0.2)', borderTop: '3px solid #FFFFFF' }}
                    />
                    <p style={{ fontFamily: 'var(--font-inter, sans-serif)', fontSize: 13, color: 'rgba(255,255,255,0.7)', margin: 0 }}>
                      Check your phone for the M-Pesa prompt…
                    </p>
                    {gateCanRetry && (
                      <button
                        onClick={() => { setGateCanRetry(false); setGateCheckoutId(null); setGatePending(false); handleGatePay() }}
                        style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', fontSize: 12, cursor: 'pointer', textDecoration: 'underline', fontFamily: 'var(--font-inter, sans-serif)' }}
                      >
                        Didn&apos;t get the prompt? Try again
                      </button>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Tap marker — shows where user sampled */}
            {tapMarker && (
              <div style={{
                position:     'absolute',
                left:         tapMarker.x,
                top:          tapMarker.y,
                width:        '18px',
                height:       '18px',
                borderRadius: '50%',
                border:       `2px solid ${C.gold}`,
                background:   wall ? `${wall.hex}` : 'transparent',
                transform:    'translate(-50%, -50%)',
                boxShadow:    `0 0 0 3px rgba(0,0,0,0.4), 0 0 0 4px ${C.gold}40`,
                pointerEvents: 'none',
                zIndex:        5,
              }} />
            )}

            {/* Sampling hint overlay — shown after photo loads, before first tap */}
            <AnimatePresence>
              {samplingHint && phase === 'loaded' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
                  style={{
                    position:   'absolute',
                    inset:      0,
                    display:    'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                    paddingBottom: '20px',
                    background: 'linear-gradient(to top, rgba(17,17,19,0.72) 0%, transparent 50%)',
                    pointerEvents: 'none',
                  }}
                >
                  <motion.div
                    animate={prefersReduced ? {} : { y: [0, -6, 0] }}
                    transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
                    style={{ textAlign: 'center' }}
                  >
                    <div style={{ fontSize: '22px', marginBottom: '6px' }}>👆</div>
                    <p style={{ fontSize: '13px', color: C.text, letterSpacing: '0.06em', fontFamily: 'var(--font-inter, sans-serif)' }}>
                      Tap your wall to match colours
                    </p>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* ── Before / After comparison slider (revealed phase only) ── */}
            {phase === 'rendered' && photoUrl && (
              <>
                {/* "Before" overlay — original photo, clipped to left of slider */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={photoUrl}
                  alt=""
                  draggable={false}
                  style={{
                    position:    'absolute',
                    inset:       0,
                    width:       '100%',
                    height:      '100%',
                    objectFit:   'fill',
                    clipPath:    `inset(0 ${Math.max(20, 100 - sliderPct).toFixed(1)}% 0 20%)`,
                    pointerEvents: 'none',
                    userSelect:  'none',
                    zIndex:      3,
                  }}
                />

                {/* Divider line + draggable handle */}
                <div
                  role="slider"
                  aria-label="Compare before and after"
                  aria-valuenow={Math.round(sliderPct)}
                  style={{
                    position:  'absolute',
                    left:      `${sliderPct}%`,
                    top:       0,
                    bottom:    0,
                    width:     '2px',
                    background: 'rgba(255,255,255,0.88)',
                    boxShadow: '0 0 6px rgba(0,0,0,0.5)',
                    zIndex:    5,
                    cursor:    'col-resize',
                    transform: 'translateX(-1px)',
                    touchAction: 'none',
                  }}
                  onMouseDown={handleSliderDown}
                  onTouchStart={handleSliderDown}
                >
                  {/* Grip circle */}
                  <div style={{
                    position:  'absolute',
                    top:       '50%',
                    left:      '50%',
                    transform: 'translate(-50%, -50%)',
                    width:     '38px',
                    height:    '38px',
                    borderRadius: '50%',
                    background: '#0E0E10',
                    border:    '2px solid rgba(255,255,255,0.88)',
                    display:   'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 2px 14px rgba(0,0,0,0.65)',
                    pointerEvents: 'none',
                  }}>
                    <svg width="15" height="15" viewBox="0 0 20 20" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round">
                      <path d="M6 4 2 10l4 6" />
                      <path d="M14 4l4 6-4 6" />
                    </svg>
                  </div>
                </div>

                {/* BEFORE / AFTER corner labels */}
                <div style={{
                  position:   'absolute', left: '10px', top: '10px', zIndex: 6,
                  padding:    '3px 8px',
                  background: 'rgba(0,0,0,0.52)',
                  borderRadius: '2px',
                  fontSize:   '8px', letterSpacing: '0.22em', textTransform: 'uppercase',
                  color:      'rgba(255,255,255,0.75)',
                  fontFamily: 'var(--font-inter, sans-serif)',
                  pointerEvents: 'none',
                }}>Before</div>

                <div style={{
                  position:   'absolute', right: '10px', top: '10px', zIndex: 6,
                  padding:    '3px 8px',
                  background: 'rgba(0,0,0,0.52)',
                  borderRadius: '2px',
                  fontSize:   '8px', letterSpacing: '0.22em', textTransform: 'uppercase',
                  color:      C.gold,
                  fontFamily: 'var(--font-inter, sans-serif)',
                  pointerEvents: 'none',
                }}>After</div>
              </>
            )}
          </div>

          {/* ── Bottom panel ─────────────────────────────────────────────────── */}
          <div style={{
            flex:       1,
            overflowY:  'auto',
            background: C.bg,
            paddingBottom: 'env(safe-area-inset-bottom, 24px)',
          }}>
            {phase === 'loaded' && !wall && (
              <div style={{ padding: '20px 20px 0', textAlign: 'center' }}>
                <p style={{ fontSize: '13px', color: C.muted }}>Tap anywhere on your wall to pick a colour</p>
              </div>
            )}

            {phase === 'rendered' && recs && wall && (
              <motion.div {...fadeUp}>

                {/* Wall colour row */}
                <div style={{ padding: '16px 20px 0', display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    width: '28px', height: '28px', borderRadius: '4px',
                    background: wall.hex,
                    border:     '1px solid rgba(255,255,255,0.12)',
                    flexShrink: 0,
                  }} />
                  <div>
                    <p style={{ fontSize: '10px', color: C.gold, letterSpacing: '0.28em', textTransform: 'uppercase', marginBottom: '2px' }}>
                      Wall colour sampled
                    </p>
                    <p style={{ fontSize: '13px', color: C.text, fontFamily: 'var(--font-inter, sans-serif)' }}>
                      {wall.hex.toUpperCase()} &nbsp;
                      <span style={{ color: C.veryMuted, fontSize: '11px' }}>
                        {(() => { const [h,,] = rgbToHsl(wall.r, wall.g, wall.b); return h < 100 || h > 330 ? 'warm undertone' : 'cool undertone' })()}
                      </span>
                    </p>
                  </div>
                  <button
                    onClick={reset}
                    style={{ marginLeft: 'auto', fontSize: '11px', color: C.veryMuted, background: 'none', border: 'none', cursor: 'pointer' }}
                  >
                    Retake
                  </button>
                </div>

                <GoldRule />
                <div style={{ padding: '14px 20px 8px' }}>
                  <p style={{ fontSize: '10px', color: C.gold, letterSpacing: '0.3em', textTransform: 'uppercase', marginBottom: '12px' }}>
                    Fabrics that work
                  </p>

                  {/* Swatch row — each swatch has the fabric name below it */}
                  <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '6px' }}>
                    {recs.map(rec => {
                      const isSelected = selectedRec?.id === rec.id
                      // First two words of catalog name, or the rec label
                      const shortName = (rec.catalogMatch?.name ?? rec.label)
                        .split(' ').slice(0, 2).join(' ')
                      return (
                        <button
                          key={rec.id}
                          onClick={() => selectRec(rec)}
                          style={{
                            flexShrink:  0,
                            display:     'flex',
                            flexDirection: 'column',
                            alignItems:  'center',
                            gap:         '6px',
                            background:  'none',
                            border:      'none',
                            padding:     '0',
                            cursor:      'pointer',
                          }}
                          aria-pressed={isSelected}
                          aria-label={`${rec.label} — ${rec.reason}`}
                        >
                          {/* Colour chip */}
                          <div style={{
                            width:        '52px',
                            height:       '76px',
                            borderRadius: '3px',
                            background:   rec.hex,
                            border:       isSelected
                              ? `2.5px solid ${C.gold}`
                              : '2.5px solid rgba(255,255,255,0.08)',
                            boxShadow:    isSelected
                              ? `0 0 0 1px ${C.gold}55, 0 4px 14px rgba(0,0,0,0.45)`
                              : '0 2px 8px rgba(0,0,0,0.35)',
                            position:     'relative',
                            transition:   'border-color 0.18s, box-shadow 0.18s',
                            flexShrink:   0,
                          }}>
                            {rec.isBold && (
                              <span style={{
                                position: 'absolute', top: '4px', right: '4px',
                                width: '5px', height: '5px',
                                borderRadius: '50%', background: C.gold,
                              }} />
                            )}
                          </div>

                          {/* Fabric name label */}
                          <span style={{
                            fontSize:   '8px',
                            letterSpacing: '0.04em',
                            textTransform: 'none',
                            color:      isSelected ? C.gold : C.veryMuted,
                            textAlign:  'center',
                            maxWidth:   '52px',
                            lineHeight: 1.25,
                            fontFamily: 'var(--font-inter, sans-serif)',
                            whiteSpace: 'nowrap',
                            overflow:   'hidden',
                            textOverflow: 'ellipsis',
                            transition: 'color 0.18s',
                          }}>
                            {shortName}
                          </span>
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* Selected rec card */}
                <AnimatePresence mode="wait">
                  {selectedRec && (
                    <motion.div
                      key={selectedRec.id}
                      initial={prefersReduced ? {} : { opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={prefersReduced ? {} : { opacity: 0, y: -4 }}
                      transition={{ duration: 0.3, ease }}
                      style={{
                        margin:       '0 20px 16px',
                        padding:      '16px',
                        background:   'rgba(201,168,76,0.05)',
                        border:       `1px solid ${C.border}`,
                        borderRadius: '4px',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '10px' }}>
                        <div style={{
                          width: '36px', height: '52px', borderRadius: '3px',
                          background: selectedRec.hex, flexShrink: 0,
                          boxShadow: '0 2px 8px rgba(0,0,0,0.35)',
                        }} />
                        <div style={{ minWidth: 0 }}>
                          <p style={{ fontSize: '9px', color: C.gold, letterSpacing: '0.28em', textTransform: 'uppercase', marginBottom: '4px' }}>
                            {selectedRec.catalogMatch?.collection ?? selectedRec.collection}
                          </p>
                          <p style={{ fontSize: '17px', color: C.text, fontFamily: 'var(--font-playfair, Georgia, serif)', fontWeight: 400, lineHeight: 1.15, marginBottom: '4px' }}>
                            {selectedRec.catalogMatch?.name ?? selectedRec.label}
                          </p>
                          <p style={{ fontSize: '12px', color: C.muted, lineHeight: 1.55 }}>
                            {selectedRec.reason}
                          </p>
                        </div>
                      </div>

                      {selectedRec.catalogMatch && (
                        <p style={{ fontSize: '11px', color: C.veryMuted, paddingTop: '10px', borderTop: `1px solid rgba(201,168,76,0.08)` }}>
                          Closest fabric in our range:{' '}
                          <strong style={{ color: C.muted }}>
                            {selectedRec.catalogMatch.name}
                          </strong>{' '}
                          in {selectedRec.catalogMatch.fabric}
                        </p>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>

                <GoldRule />

                {/* CTA */}
                <div style={{ padding: '20px' }}>
                  <a
                    href={`/contact?fabric=${encodeURIComponent(selectedRec?.catalogMatch?.name ?? selectedRec?.label ?? '')}&color=${encodeURIComponent(selectedRec?.hex ?? '')}`}
                    style={{
                      display:        'block',
                      width:          '100%',
                      padding:        '13px 24px',
                      background:     `linear-gradient(135deg, ${C.goldLight} 0%, ${C.gold} 50%, #A67C2E 100%)`,
                      color:          '#0A0F1C',
                      fontFamily:     'var(--font-inter, sans-serif)',
                      fontSize:       '11px',
                      fontWeight:     700,
                      letterSpacing:  '0.28em',
                      textTransform:  'uppercase',
                      borderRadius:   '2px',
                      textDecoration: 'none',
                      textAlign:      'center',
                      boxShadow:      '0 4px 16px rgba(201,168,76,0.22)',
                      marginBottom:   '12px',
                    }}
                  >
                    Design yours — Book a consultation
                  </a>

                  {/*
                   * PAYMENT_SLOT (Phase 2):
                   * A KES 100 deposit via M-Pesa STK push (Daraja API) will go here.
                   * The button above routes to the free consultation flow for now.
                   * When payment is ready, replace the <a> above with:
                   *   <PaymentButton amount={100} currency="KES" onSuccess={...} />
                   * and wire up the Daraja initiateSTKPush() call.
                   */}

                  <p style={{ fontSize: '11px', color: C.veryMuted, textAlign: 'center', lineHeight: 1.65 }}>
                    On-screen colour is a guide only. We confirm the exact
                    fabric in your space before we make a single cut.
                  </p>

                  {/* Tap again to re-sample */}
                  <button
                    onClick={() => {
                      setPhase('loaded')
                      setWall(null)
                      setRecs(null)
                      setSelectedRec(null)
                      setTapMarker(null)
                      setSamplingHint(true)
                      setSliderPct(50)
                      if (canvasRef.current && imgRef.current)
                        drawScene(canvasRef.current, imgRef.current, null)
                    }}
                    style={{
                      display: 'block', width: '100%', marginTop: '14px',
                      padding: '12px',
                      background: 'transparent',
                      border: `1px solid rgba(201,168,76,0.22)`,
                      borderRadius: '3px',
                      color: C.muted, fontSize: '12px', cursor: 'pointer',
                      fontFamily: 'var(--font-inter, sans-serif)',
                    }}
                  >
                    Tap a different spot on the wall
                  </button>
                </div>

              </motion.div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
