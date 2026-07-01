'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { drawScene, WindowProfile } from './curtainRenderer'
import { composeScene } from './fabricCompositor'
import { CURTAIN_STYLES, loadPanelSet, type PanelSet } from './assetManifest'
import { getRecommendations, hexToRgb } from '@/app/lib/colorEngine'

// ─── Brand tokens ─────────────────────────────────────────────────────────────
const C = {
  bg:        '#08090D',
  surface:   '#0D0F14',
  border:    'rgba(201,168,76,0.14)',
  borderMid: 'rgba(201,168,76,0.30)',
  borderHi:  'rgba(201,168,76,0.58)',
  gold:      '#C9A84C',
  goldLight: '#E8C87A',
  goldGrad:  'linear-gradient(135deg,#E8C87A,#C9A84C)',
  text:      '#F0EBE0',
  muted:     '#A09080',
  faint:     '#2A2420',
  subtle:    'rgba(255,255,255,0.04)',
} as const

const ease = [0.25, 0.1, 0.25, 1] as const

// ─── Data ─────────────────────────────────────────────────────────────────────

const WALL_COLORS = [
  { id: 'off-white',  name: 'Off White',      hex: '#F5F0E8' },
  { id: 'warm-sand',  name: 'Warm Sand',       hex: '#E2D5BF' },
  { id: 'terracotta', name: 'Soft Terracotta', hex: '#C07455' },
  { id: 'ochre',      name: 'Deep Ochre',      hex: '#B8843A' },
  { id: 'sage',       name: 'Sage Green',      hex: '#8FAF8C' },
  { id: 'charcoal',   name: 'Charcoal',        hex: '#3C3C3C' },
  { id: 'slate',      name: 'Slate Blue',      hex: '#6A7A84' },
  { id: 'dusty-rose', name: 'Dusty Rose',      hex: '#C49890' },
  { id: 'forest',     name: 'Forest',          hex: '#4A7A5C' },
  { id: 'midnight',   name: 'Midnight',        hex: '#1E3A5F' },
]

const WINDOW_PROFILES: { id: WindowProfile; tag: string; name: string; desc: string }[] = [
  {
    id:   'minimalist',
    tag:  'CONTEMPORARY',
    name: 'Modern Minimalist',
    desc: 'Floor-to-ceiling glass with a thick matte black industrial frame',
  },
  {
    id:   'classic',
    tag:  'TRADITIONAL',
    name: 'French Classic',
    desc: 'Elegant multi-pane grid with delicate white frame molding',
  },
  {
    id:   'doubleHung',
    tag:  'HERITAGE',
    name: 'Double-Hung',
    desc: 'Classic recessed wooden frame with heritage proportions',
  },
]

const ROOM_TYPES = [
  { id: 'sitting', label: 'Sitting Room' },
  { id: 'bedroom', label: 'Bedroom' },
]

const PROCESSING_MSGS = [
  'Analyzing architectural scale…',
  'Computing geometric color harmonies…',
  'Weaving custom textile layers…',
]

// ─── Types ────────────────────────────────────────────────────────────────────
type Phase = 'configure' | 'processing' | 'reveal'
type Step  = 1 | 2 | 3
// Reveal render engine: 'photo' = photo-match (drawScene), 'studio' = compositor scene.
type RenderMode = 'photo' | 'studio'

interface WallColor { id: string; name: string; hex: string }
interface FabricOpt { id: string; label: string; hex: string; collection: string }

// Default curtain style for studio mode (until a style picker exists).
const STUDIO_STYLE = CURTAIN_STYLES[0].id
// Map the chosen architectural profile onto the compositor's window-size axis.
const PROFILE_SIZE: Record<WindowProfile, 'small' | 'medium' | 'large'> = {
  minimalist: 'large',
  classic:    'medium',
  doubleHung: 'small',
}

// ─── Window SVG icons ─────────────────────────────────────────────────────────
function WindowSVG({ id, active }: { id: WindowProfile; active: boolean }) {
  const stroke  = active ? C.gold : 'rgba(255,255,255,0.22)'
  const fill    = 'rgba(180,215,245,0.07)'
  const stroke2 = active ? C.goldLight : 'rgba(255,255,255,0.12)'

  if (id === 'minimalist') return (
    <svg width="60" height="88" viewBox="0 0 60 88" fill="none">
      <rect x="3" y="3" width="54" height="82" rx="1" fill={fill} stroke={stroke} strokeWidth="5.5"/>
      <rect x="11" y="11" width="38" height="66" rx="0.5" stroke={stroke2} strokeWidth="1"/>
    </svg>
  )

  if (id === 'classic') return (
    <svg width="60" height="88" viewBox="0 0 60 88" fill="none">
      <rect x="3" y="3" width="54" height="82" rx="1" fill={fill} stroke={stroke} strokeWidth="3"/>
      <line x1="30" y1="3"  x2="30" y2="85"  stroke={stroke} strokeWidth="2.5"/>
      <line x1="3"  y1="33" x2="57" y2="33"  stroke={stroke} strokeWidth="2.5"/>
      <line x1="3"  y1="61" x2="57" y2="61"  stroke={stroke} strokeWidth="2.5"/>
      <rect x="8"  y="8"  width="18" height="21" rx="0.5" stroke={stroke2} strokeWidth="1"/>
      <rect x="34" y="8"  width="18" height="21" rx="0.5" stroke={stroke2} strokeWidth="1"/>
    </svg>
  )

  return (
    <svg width="60" height="88" viewBox="0 0 60 88" fill="none">
      <rect x="4" y="4" width="52" height="80" rx="2" fill={fill} stroke={stroke} strokeWidth="4.5"/>
      <line x1="4" y1="46" x2="56" y2="46" stroke={stroke} strokeWidth="4.5"/>
      <rect x="10" y="9"  width="40" height="32" rx="1" stroke={stroke2} strokeWidth="1.5"/>
      <rect x="10" y="51" width="40" height="28" rx="1" stroke={stroke2} strokeWidth="1.5"/>
    </svg>
  )
}

// ─── Step progress bar ────────────────────────────────────────────────────────
function StepBar({ current }: { current: Step }) {
  return (
    <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
      {([1, 2, 3] as Step[]).map(s => (
        <div key={s} style={{
          height:       5,
          width:        s === current ? 28 : s < current ? 16 : 16,
          borderRadius: 999,
          background:   s < current ? C.gold : s === current ? C.goldLight : 'rgba(255,255,255,0.13)',
          transition:   'all 0.4s ease',
          opacity:      s > current ? 0.5 : 1,
        }} />
      ))}
      <span style={{
        fontFamily: 'var(--font-inter,sans-serif)', fontSize: 10,
        color: C.muted, letterSpacing: '0.14em', marginLeft: 6,
      }}>
        {current} / 3
      </span>
    </div>
  )
}

// ─── Shared motion variants ───────────────────────────────────────────────────
const pageIn  = { opacity: 0, y: 22 }
const pageOut  = { opacity: 0, y: -14 }
const pageAnim = { opacity: 1, y: 0, transition: { duration: 0.5, ease } }
const stepIn   = { opacity: 0, x: 32 }
const stepOut  = { opacity: 0, x: -24 }
const stepAnim = { opacity: 1, x: 0, transition: { duration: 0.38, ease } }

// ─── Component ────────────────────────────────────────────────────────────────
export default function MobileStudio() {
  const [phase,          setPhase]          = useState<Phase>('configure')
  const [step,           setStep]           = useState<Step>(1)
  const [wallColor,      setWallColor]      = useState<WallColor | null>(null)
  const [windowProfile,  setWindowProfile]  = useState<WindowProfile | null>(null)
  const [roomType,       setRoomType]       = useState<string | null>(null)
  const [msgIdx,         setMsgIdx]         = useState(0)
  const [fabricOpts,     setFabricOpts]     = useState<FabricOpt[]>([])
  const [activeFabric,   setActiveFabric]   = useState<FabricOpt | null>(null)
  const [showWindow,     setShowWindow]     = useState(true)
  const [renderMode,     setRenderMode]     = useState<RenderMode>('photo')
  const [studioPanels,   setStudioPanels]   = useState<PanelSet | null>(null)

  const canvasRef    = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const imgRef       = useRef<HTMLImageElement | null>(null)
  const [imgReady,   setImgReady]   = useState(false)

  // Preload room image once
  useEffect(() => {
    const img = new Image()
    img.onload = () => { imgRef.current = img; setImgReady(true) }
    img.src = '/assets/sittingroom.png'
  }, [])

  // Lazily resolve compositor panels the first time Studio mode is used.
  // Falls back to the code placeholder until a Blender render lands in /public/curtains.
  useEffect(() => {
    if (renderMode !== 'studio' || studioPanels) return
    let cancelled = false
    loadPanelSet(STUDIO_STYLE, 'open').then(ps => { if (!cancelled) setStudioPanels(ps) })
    return () => { cancelled = true }
  }, [renderMode, studioPanels])

  // Auto-advance step handlers
  function selectWallColor(c: WallColor) {
    setWallColor(c)
    setTimeout(() => setStep(2), 480)
  }

  function selectWindowProfile(id: WindowProfile) {
    setWindowProfile(id)
    setTimeout(() => setStep(3), 480)
  }

  function selectRoomType(id: string) {
    setRoomType(id)
    setTimeout(() => setPhase('processing'), 580)
  }

  // Processing phase — cycles through messages twice then auto-reveals
  useEffect(() => {
    if (phase !== 'processing') return
    setMsgIdx(0)
    let count = 0
    const LOOPS = 2
    const TOTAL = PROCESSING_MSGS.length * LOOPS

    const iv = setInterval(() => {
      count++
      if (count >= TOTAL) {
        clearInterval(iv)
        // Compute fabric recommendations from wall colour
        if (wallColor) {
          const [r, g, b] = hexToRgb(wallColor.hex)
          const recs = getRecommendations(r, g, b)
          const opts: FabricOpt[] = recs.map(rec => ({
            id:         rec.id,
            label:      rec.label,
            hex:        rec.hex,
            collection: rec.collection,
          }))
          setFabricOpts(opts)
          setActiveFabric(opts[0] ?? null)
        }
        setTimeout(() => setPhase('reveal'), 380)
        return
      }
      setMsgIdx(count % PROCESSING_MSGS.length)
    }, 860)

    return () => clearInterval(iv)
  }, [phase, wallColor])

  // Canvas draw
  const redraw = useCallback(() => {
    const canvas = canvasRef.current
    const cont   = containerRef.current
    if (!canvas || !cont) return
    const img = imgRef.current

    // Canvas box keeps the photo's aspect ratio for a consistent frame in both modes.
    const W = cont.clientWidth
    const aspectH = img
      ? Math.round(W * img.naturalHeight / img.naturalWidth)
      : Math.round(W * 1.3)
    const H = Math.min(aspectH, Math.round(window.innerHeight * 0.72))
    const dpr           = window.devicePixelRatio || 1
    canvas.width        = Math.round(W * dpr)
    canvas.height       = Math.round(H * dpr)
    canvas.style.width  = `${W}px`
    canvas.style.height = `${H}px`

    if (renderMode === 'studio') {
      if (!studioPanels) return   // panels still loading — draw effect re-runs when ready
      composeScene(canvas, {
        wallHex:    wallColor?.hex   ?? '#E2D5BF',
        fabricHex:  activeFabric?.hex ?? '#D9C7A3',
        leftPanel:  studioPanels.left,
        rightPanel: studioPanels.right,
        shadow:     studioPanels.shadow,
        windowSize: windowProfile ? PROFILE_SIZE[windowProfile] : 'medium',
        tintGain:   studioPanels.tintGain,
      })
      return
    }

    // Photo Match (default)
    if (!img) return
    drawScene(canvas, img, activeFabric?.hex ?? null, (showWindow && windowProfile) ? windowProfile : undefined)
  }, [renderMode, studioPanels, wallColor, activeFabric, windowProfile, showWindow])

  useEffect(() => {
    if (phase === 'reveal' && imgReady) redraw()
  }, [phase, imgReady, redraw])

  useEffect(() => {
    if (phase !== 'reveal') return
    const ro = new ResizeObserver(redraw)
    if (containerRef.current) ro.observe(containerRef.current)
    return () => ro.disconnect()
  }, [phase, redraw])

  // Ambient background hue from selected wall colour
  const bgGlow = wallColor
    ? `radial-gradient(ellipse at 50% -10%, ${wallColor.hex}22 0%, transparent 58%)`
    : undefined

  // ─── Render ─────────────────────────────────────────────────────────────────
  return (
    <div style={{
      minHeight:   '100svh',
      paddingTop:  'var(--rj-navbar-height,60px)',
      background:  C.bg,
      position:    'relative',
      overflowX:   'hidden',
    }}>
      {/* Dynamic wall-colour glow */}
      <div style={{
        position:   'fixed', inset: 0, pointerEvents: 'none', zIndex: 0,
        background: bgGlow,
        transition: 'background 0.9s ease',
      }} />

      <div style={{ position: 'relative', zIndex: 1 }}>
        <AnimatePresence mode="wait">

          {/* ══ PHASE 1 — CONFIGURE ══════════════════════════════════════════ */}
          {phase === 'configure' && (
            <motion.div key="configure"
              initial={pageIn} animate={pageAnim} exit={pageOut}>

              {/* Page header */}
              <div style={{ padding: '20px 20px 0' }}>
                <p style={{
                  fontFamily: 'var(--font-inter,sans-serif)', fontSize: 10,
                  letterSpacing: '0.30em', color: C.gold, textTransform: 'uppercase', margin: '0 0 12px',
                }}>
                  Design Studio
                </p>
                <AnimatePresence mode="wait">
                  <motion.h1
                    key={step}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0, transition: { duration: 0.32, ease } }}
                    exit={{ opacity: 0, y: -6, transition: { duration: 0.2 } }}
                    style={{
                      fontFamily: 'var(--font-playfair,Georgia,serif)', fontSize: 24,
                      color: C.text, fontWeight: 400, margin: '0 0 20px', lineHeight: 1.25,
                    }}
                  >
                    {step === 1 && 'What colour are your walls?'}
                    {step === 2 && 'Choose your window profile.'}
                    {step === 3 && 'Which room is this for?'}
                  </motion.h1>
                </AnimatePresence>
                <StepBar current={step} />
              </div>

              <div style={{ height: 12 }} />

              {/* ── Step content ─────────────────────────────────────────── */}
              <AnimatePresence mode="wait">

                {/* Step 1 — Wall colour swatches */}
                {step === 1 && (
                  <motion.div key="step1"
                    initial={stepIn} animate={stepAnim} exit={stepOut}>
                    <div style={{
                      display: 'flex', gap: 12, overflowX: 'auto',
                      padding: '4px 24px 28px', scrollbarWidth: 'none',
                      WebkitOverflowScrolling: 'touch',
                    }}>
                      {WALL_COLORS.map(c => {
                        const active = wallColor?.id === c.id
                        return (
                          <button key={c.id} onClick={() => selectWallColor(c)}
                            style={{
                              flexShrink: 0, display: 'flex', flexDirection: 'column',
                              alignItems: 'center', gap: 10, background: 'none',
                              border: 'none', cursor: 'pointer', padding: 0,
                            }}>
                            <div style={{
                              width: 58, height: 82, borderRadius: 10, background: c.hex,
                              border:     `2.5px solid ${active ? C.gold : 'transparent'}`,
                              boxShadow:  active
                                ? `0 0 0 1px rgba(201,168,76,0.5), 0 14px 30px ${c.hex}55`
                                : '0 4px 16px rgba(0,0,0,0.55)',
                              position: 'relative', overflow: 'hidden',
                              transform:  active ? 'scale(1.07)' : 'scale(1)',
                              transition: 'all 0.25s ease',
                            }}>
                              {/* Woven texture */}
                              <div style={{
                                position: 'absolute', inset: 0,
                                backgroundImage: 'repeating-linear-gradient(90deg,rgba(255,255,255,0.07) 0px,rgba(255,255,255,0.07) 1px,transparent 1px,transparent 8px)',
                              }} />
                              {/* Sheen */}
                              <div style={{
                                position: 'absolute', inset: 0,
                                background: 'linear-gradient(135deg,rgba(255,255,255,0.20) 0%,transparent 55%,rgba(0,0,0,0.14) 100%)',
                              }} />
                              {active && (
                                <div style={{
                                  position: 'absolute', bottom: 6, right: 6,
                                  width: 18, height: 18, borderRadius: '50%',
                                  background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(4px)',
                                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                                }}>
                                  <svg width="9" height="9" viewBox="0 0 12 12" fill="none"
                                    stroke={C.gold} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M2 6l3 3 5-5"/>
                                  </svg>
                                </div>
                              )}
                            </div>
                            <span style={{
                              fontFamily:  'var(--font-inter,sans-serif)', fontSize: 9,
                              letterSpacing: '0.12em', textTransform: 'uppercase',
                              color:       active ? C.gold : 'rgba(255,255,255,0.28)',
                              textAlign:   'center', maxWidth: 58, lineHeight: 1.35,
                              transition:  'color 0.22s',
                            }}>
                              {c.name}
                            </span>
                          </button>
                        )
                      })}
                    </div>
                  </motion.div>
                )}

                {/* Step 2 — Window profile cards */}
                {step === 2 && (
                  <motion.div key="step2"
                    initial={stepIn} animate={stepAnim} exit={stepOut}
                    style={{ padding: '0 20px 32px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                      {WINDOW_PROFILES.map(p => {
                        const active = windowProfile === p.id
                        return (
                          <button key={p.id} onClick={() => selectWindowProfile(p.id)}
                            style={{
                              display: 'flex', alignItems: 'center', gap: 18,
                              padding: '18px 20px', borderRadius: 14, cursor: 'pointer',
                              background:  active ? 'rgba(201,168,76,0.07)' : C.subtle,
                              border:      `1.5px solid ${active ? C.borderHi : C.border}`,
                              textAlign:   'left',
                              transform:   active ? 'scale(1.015)' : 'scale(1)',
                              boxShadow:   active ? '0 10px 36px rgba(201,168,76,0.13)' : 'none',
                              transition:  'all 0.25s ease',
                            }}>
                            <WindowSVG id={p.id} active={active} />
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <p style={{
                                fontFamily: 'var(--font-inter,sans-serif)', fontSize: 9,
                                letterSpacing: '0.24em', textTransform: 'uppercase',
                                color: active ? C.gold : C.muted, margin: '0 0 5px',
                              }}>
                                {p.tag}
                              </p>
                              <p style={{
                                fontFamily: 'var(--font-playfair,Georgia,serif)', fontSize: 17,
                                color: C.text, margin: '0 0 5px', fontWeight: 400,
                              }}>
                                {p.name}
                              </p>
                              <p style={{
                                fontFamily: 'var(--font-inter,sans-serif)', fontSize: 11,
                                color: C.muted, margin: 0, lineHeight: 1.62,
                              }}>
                                {p.desc}
                              </p>
                            </div>
                            {/* Radio circle */}
                            <div style={{
                              width: 20, height: 20, borderRadius: '50%', flexShrink: 0,
                              border: `1.5px solid ${active ? C.gold : 'rgba(255,255,255,0.2)'}`,
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              transition: 'all 0.25s ease',
                            }}>
                              {active && (
                                <div style={{ width: 9, height: 9, borderRadius: '50%', background: C.gold }} />
                              )}
                            </div>
                          </button>
                        )
                      })}
                    </div>
                  </motion.div>
                )}

                {/* Step 3 — Room type */}
                {step === 3 && (
                  <motion.div key="step3"
                    initial={stepIn} animate={stepAnim} exit={stepOut}
                    style={{ padding: '0 20px 32px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                      {ROOM_TYPES.map(r => {
                        const active = roomType === r.id
                        return (
                          <button key={r.id} onClick={() => selectRoomType(r.id)}
                            style={{
                              padding: '34px 16px', borderRadius: 16,
                              background: active ? 'rgba(201,168,76,0.09)' : C.subtle,
                              border:     `1.5px solid ${active ? C.borderHi : C.border}`,
                              cursor:     'pointer',
                              display:    'flex', flexDirection: 'column', alignItems: 'center', gap: 16,
                              transform:  active ? 'scale(1.03)' : 'scale(1)',
                              boxShadow:  active ? '0 14px 44px rgba(201,168,76,0.16)' : 'none',
                              transition: 'all 0.26s ease',
                            }}>
                            {r.id === 'sitting' ? (
                              <svg width="44" height="36" viewBox="0 0 44 36" fill="none">
                                <rect x="2" y="18" width="40" height="16" rx="3"
                                  fill={active ? 'rgba(201,168,76,0.18)' : 'rgba(255,255,255,0.04)'}
                                  stroke={active ? C.gold : 'rgba(255,255,255,0.2)'} strokeWidth="1.5"/>
                                <path d="M9 18V10a2 2 0 0 1 2-2h22a2 2 0 0 1 2 2v8"
                                  stroke={active ? C.gold : 'rgba(255,255,255,0.2)'} strokeWidth="1.5"/>
                                <rect x="0" y="24" width="8" height="12" rx="2"
                                  fill={active ? 'rgba(201,168,76,0.12)' : 'rgba(255,255,255,0.03)'}
                                  stroke={active ? C.gold : 'rgba(255,255,255,0.15)'} strokeWidth="1.5"/>
                                <rect x="36" y="24" width="8" height="12" rx="2"
                                  fill={active ? 'rgba(201,168,76,0.12)' : 'rgba(255,255,255,0.03)'}
                                  stroke={active ? C.gold : 'rgba(255,255,255,0.15)'} strokeWidth="1.5"/>
                              </svg>
                            ) : (
                              <svg width="44" height="30" viewBox="0 0 44 30" fill="none">
                                <rect x="2" y="14" width="40" height="14" rx="3"
                                  fill={active ? 'rgba(201,168,76,0.18)' : 'rgba(255,255,255,0.04)'}
                                  stroke={active ? C.gold : 'rgba(255,255,255,0.2)'} strokeWidth="1.5"/>
                                <path d="M7 14V7a2 2 0 0 1 2-2h26a2 2 0 0 1 2 2v7"
                                  stroke={active ? C.gold : 'rgba(255,255,255,0.2)'} strokeWidth="1.5"/>
                                <rect x="9" y="17" width="26" height="7" rx="1"
                                  fill={active ? 'rgba(201,168,76,0.09)' : 'rgba(255,255,255,0.03)'}
                                  stroke={active ? C.goldLight : 'rgba(255,255,255,0.1)'} strokeWidth="1"/>
                                <line x1="2" y1="14" x2="42" y2="14"
                                  stroke={active ? C.gold : 'rgba(255,255,255,0.18)'} strokeWidth="2"/>
                              </svg>
                            )}
                            <p style={{
                              fontFamily: 'var(--font-playfair,Georgia,serif)', fontSize: 16,
                              color: active ? C.goldLight : C.text, margin: 0, fontWeight: 400,
                            }}>
                              {r.label}
                            </p>
                          </button>
                        )
                      })}
                    </div>
                  </motion.div>
                )}

              </AnimatePresence>

              {/* Back navigation */}
              {step > 1 && (
                <div style={{ padding: '0 24px 36px', display: 'flex', justifyContent: 'center' }}>
                  <button
                    onClick={() => setStep((step - 1) as Step)}
                    style={{
                      background: 'none', border: 'none', cursor: 'pointer',
                      fontFamily: 'var(--font-inter,sans-serif)', fontSize: 12,
                      color: C.muted, letterSpacing: '0.1em',
                      display: 'flex', alignItems: 'center', gap: 7,
                      transition: 'color 0.2s',
                    }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                      stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <path d="M19 12H5M12 5l-7 7 7 7"/>
                    </svg>
                    Back
                  </button>
                </div>
              )}

            </motion.div>
          )}

          {/* ══ PHASE 2 — CINEMATIC PROCESSING ══════════════════════════════ */}
          {phase === 'processing' && (
            <motion.div key="processing"
              initial={pageIn} animate={pageAnim} exit={pageOut}
              style={{
                height:         '100svh',
                display:        'flex',
                flexDirection:  'column',
                alignItems:     'center',
                justifyContent: 'center',
                padding:        '0 36px',
                pointerEvents:  'none', // prevent any tap-through
              }}>

              {/* Counter-rotating ring spinner */}
              <div style={{ position: 'relative', width: 76, height: 76, marginBottom: 44 }}>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 3.2, repeat: Infinity, ease: 'linear' }}
                  style={{
                    position: 'absolute', inset: 0, borderRadius: '50%',
                    border: `2px solid rgba(201,168,76,0.14)`,
                    borderTop: `2px solid ${C.gold}`,
                  }}
                />
                <motion.div
                  animate={{ rotate: -360 }}
                  transition={{ duration: 2.1, repeat: Infinity, ease: 'linear' }}
                  style={{
                    position: 'absolute', inset: 12, borderRadius: '50%',
                    border: `1.5px solid rgba(201,168,76,0.08)`,
                    borderBottom: `1.5px solid ${C.goldLight}`,
                  }}
                />
                {/* Centre dot */}
                <div style={{
                  position: 'absolute', inset: 0, display: 'flex',
                  alignItems: 'center', justifyContent: 'center',
                }}>
                  <div style={{
                    width: 6, height: 6, borderRadius: '50%', background: C.gold,
                    boxShadow: `0 0 10px ${C.gold}`,
                  }} />
                </div>
              </div>

              {/* Cycling status text */}
              <AnimatePresence mode="wait">
                <motion.p
                  key={msgIdx}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0, transition: { duration: 0.38, ease } }}
                  exit={{ opacity: 0, y: -10, transition: { duration: 0.26 } }}
                  style={{
                    fontFamily: 'var(--font-playfair,Georgia,serif)', fontSize: 21,
                    color: C.text, textAlign: 'center', margin: 0, lineHeight: 1.4,
                  }}>
                  {PROCESSING_MSGS[msgIdx]}
                </motion.p>
              </AnimatePresence>

              <p style={{
                fontFamily: 'var(--font-inter,sans-serif)', fontSize: 10,
                color: C.muted, textAlign: 'center', marginTop: 14,
                letterSpacing: '0.20em', textTransform: 'uppercase',
              }}>
                Building your personalised canvas
              </p>

              {/* Message progress dots */}
              <div style={{ display: 'flex', gap: 7, marginTop: 44 }}>
                {PROCESSING_MSGS.map((_, i) => (
                  <div key={i} style={{
                    width:      i === msgIdx ? 22 : 6,
                    height:     6,
                    borderRadius: 999,
                    background: i === msgIdx ? C.gold : 'rgba(255,255,255,0.11)',
                    transition: 'all 0.38s ease',
                  }} />
                ))}
              </div>

            </motion.div>
          )}

          {/* ══ PHASE 3 — INTERACTIVE REVEAL ═════════════════════════════════ */}
          {phase === 'reveal' && (
            <motion.div key="reveal" initial={pageIn} animate={pageAnim} exit={pageOut}>

              {/* Canvas viewport */}
              <div ref={containerRef} style={{ position: 'relative', background: '#0A0B10' }}>

                {/* Live preview badge */}
                <div style={{
                  position: 'absolute', top: 12, left: 12, zIndex: 10,
                  background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(6px)',
                  borderRadius: 99, padding: '5px 12px',
                  display: 'flex', alignItems: 'center', gap: 6,
                  border: '1px solid rgba(255,255,255,0.08)',
                }}>
                  <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#4ADE80' }} />
                  <span style={{
                    fontFamily: 'var(--font-inter,sans-serif)', fontSize: 9,
                    color: 'rgba(255,255,255,0.8)', letterSpacing: '0.16em',
                    textTransform: 'uppercase', fontWeight: 600,
                  }}>
                    Live Preview
                  </span>
                </div>

                {/* Wall colour badge */}
                {wallColor && (
                  <div style={{
                    position: 'absolute', top: 12, right: 12, zIndex: 10,
                    background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(6px)',
                    borderRadius: 8, padding: '5px 10px',
                    display: 'flex', alignItems: 'center', gap: 7,
                    border: '1px solid rgba(255,255,255,0.08)',
                  }}>
                    <div style={{
                      width: 11, height: 11, borderRadius: 3,
                      background: wallColor.hex, flexShrink: 0,
                    }} />
                    <span style={{
                      fontFamily: 'var(--font-inter,sans-serif)', fontSize: 9,
                      color: 'rgba(255,255,255,0.6)', letterSpacing: '0.14em', textTransform: 'uppercase',
                    }}>
                      {wallColor.name}
                    </span>
                  </div>
                )}

                {/* Window toggle — Photo mode only (Studio always frames a window) */}
                {windowProfile && renderMode === 'photo' && (
                  <button
                    onClick={() => setShowWindow(s => !s)}
                    style={{
                      position: 'absolute', bottom: 12, left: 12, zIndex: 10,
                      background: showWindow ? 'rgba(0,0,0,0.70)' : 'rgba(0,0,0,0.82)',
                      backdropFilter: 'blur(6px)',
                      borderRadius: 99, padding: '5px 10px 5px 8px',
                      display: 'flex', alignItems: 'center', gap: 7,
                      border: `1px solid ${showWindow ? 'rgba(201,168,76,0.35)' : 'rgba(255,255,255,0.10)'}`,
                      cursor: 'pointer',
                      transition: 'border-color 0.22s, background 0.22s',
                    }}>
                    {/* Mini toggle track */}
                    <div style={{
                      width: 22, height: 12, borderRadius: 6, position: 'relative', flexShrink: 0,
                      background: showWindow ? C.gold : 'rgba(255,255,255,0.15)',
                      transition: 'background 0.22s',
                    }}>
                      <div style={{
                        position: 'absolute', top: 2,
                        left: showWindow ? 12 : 2,
                        width: 8, height: 8, borderRadius: '50%', background: '#fff',
                        transition: 'left 0.22s',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.4)',
                      }} />
                    </div>
                    <span style={{
                      fontFamily: 'var(--font-inter,sans-serif)', fontSize: 9,
                      color: showWindow ? C.goldLight : 'rgba(255,255,255,0.35)',
                      letterSpacing: '0.14em', textTransform: 'uppercase',
                      transition: 'color 0.22s',
                    }}>
                      {showWindow
                        ? WINDOW_PROFILES.find(p => p.id === windowProfile)?.name
                        : 'Window Off'}
                    </span>
                  </button>
                )}

                {!imgReady && (
                  <div style={{
                    width: '100%', height: 240,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: '#0D0F14',
                  }}>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1.4, repeat: Infinity, ease: 'linear' }}
                      style={{
                        width: 24, height: 24, borderRadius: '50%',
                        border: `2px solid ${C.faint}`,
                        borderTop: `2px solid ${C.gold}`,
                      }}
                    />
                  </div>
                )}

                {/* Render-mode toggle — Photo Match ↔ Studio Room (compositor) */}
                <div style={{
                  position: 'absolute', bottom: 12, right: 12, zIndex: 10,
                  display: 'flex', gap: 3, padding: 3,
                  background: 'rgba(0,0,0,0.72)', backdropFilter: 'blur(6px)',
                  borderRadius: 99, border: '1px solid rgba(255,255,255,0.10)',
                }}>
                  {([['photo', 'Photo'], ['studio', 'Studio']] as [RenderMode, string][]).map(([m, label]) => {
                    const on = renderMode === m
                    return (
                      <button key={m}
                        onClick={() => setRenderMode(m)}
                        style={{
                          padding: '5px 12px', borderRadius: 99, cursor: 'pointer',
                          border: 'none',
                          background: on ? C.gold : 'transparent',
                          color: on ? '#0A0F1C' : 'rgba(255,255,255,0.5)',
                          fontFamily: 'var(--font-inter,sans-serif)', fontSize: 9,
                          fontWeight: on ? 700 : 500, letterSpacing: '0.14em',
                          textTransform: 'uppercase', transition: 'all 0.2s ease',
                        }}>
                        {label}
                      </button>
                    )
                  })}
                </div>

                {/* Glass sheen overlay */}
                <div style={{
                  position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 9,
                  background: 'linear-gradient(135deg,rgba(255,255,255,0.025) 0%,transparent 50%)',
                }} />

                <canvas ref={canvasRef} style={{ display: 'block', width: '100%' }} />
              </div>

              {/* ── Fabric control bar ──────────────────────────────────── */}
              <div style={{
                background:  C.surface,
                borderTop:   `1px solid ${C.border}`,
                padding:     '14px 0 16px',
              }}>
                {/* Pill buttons — horizontal scroll */}
                <div style={{
                  display: 'flex', gap: 9, overflowX: 'auto',
                  padding: '0 20px 2px', scrollbarWidth: 'none',
                }}>
                  {fabricOpts.map(f => {
                    const active = activeFabric?.id === f.id
                    return (
                      <button key={f.id}
                        onClick={() => setActiveFabric(f)}
                        style={{
                          flexShrink: 0, display: 'flex', alignItems: 'center', gap: 8,
                          padding: '9px 16px', borderRadius: 99,
                          background:  active ? 'rgba(201,168,76,0.13)' : 'rgba(255,255,255,0.04)',
                          border:      `1.5px solid ${active ? C.gold : 'rgba(255,255,255,0.09)'}`,
                          cursor:      'pointer',
                          transition:  'all 0.22s ease',
                          transform:   active ? 'scale(1.04)' : 'scale(1)',
                          boxShadow:   active ? '0 4px 16px rgba(201,168,76,0.15)' : 'none',
                        }}>
                        {/* Colour dot */}
                        <div style={{
                          width: 11, height: 11, borderRadius: '50%',
                          background: f.hex, flexShrink: 0,
                          boxShadow: active ? `0 0 0 2px rgba(201,168,76,0.3)` : 'none',
                          transition: 'box-shadow 0.22s',
                        }} />
                        <span style={{
                          fontFamily: 'var(--font-inter,sans-serif)', fontSize: 11,
                          fontWeight: active ? 600 : 400, letterSpacing: '0.08em',
                          color:      active ? C.goldLight : 'rgba(255,255,255,0.42)',
                          whiteSpace: 'nowrap',
                          transition: 'all 0.22s',
                        }}>
                          {f.label}
                        </span>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Pay to Book CTA */}
              <div style={{ padding: '12px 20px 44px', background: C.bg }}>
                <a href="/checkout" style={{
                  display: 'block', padding: '17px', borderRadius: 12,
                  background: C.goldGrad, color: '#0A0F1C',
                  fontFamily: 'var(--font-inter,sans-serif)', fontSize: 12,
                  fontWeight: 700, letterSpacing: '0.28em', textTransform: 'uppercase',
                  textDecoration: 'none', textAlign: 'center',
                  boxShadow: '0 6px 28px rgba(201,168,76,0.32)',
                }}>
                  Pay to Book
                </a>
              </div>

            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  )
}
