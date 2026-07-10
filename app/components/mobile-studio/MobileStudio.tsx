'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { drawScene, WindowProfile } from './curtainRenderer'
import { getRecommendations, hexToRgb } from '@/app/lib/colorEngine'
import { nextImageSrc } from '@/app/lib/nextImageSrc'

// ─── Brand tokens ─────────────────────────────────────────────────────────────
const C = {
  bg:        '#08090D',
  surface:   '#0D0F14',
  border:    'rgba(201,168,76,0.14)',
  borderHi:  'rgba(201,168,76,0.58)',
  gold:      '#C9A84C',
  goldLight: '#E8C87A',
  goldGrad:  'linear-gradient(135deg,#E8C87A,#C9A84C)',
  text:      '#F0EBE0',
  muted:     '#A09080',
  faint:     '#2A2420',
} as const

const ease = [0.25, 0.1, 0.25, 1] as const

// ─── Data ─────────────────────────────────────────────────────────────────────

interface WallColor { id: string; name: string; hex: string }
interface FabricOpt { id: string; label: string; hex: string; collection: string }

const WALL_COLORS: WallColor[] = [
  { id: 'off-white',  name: 'Off White',       hex: '#F5F0E8' },
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

const WINDOW_PROFILES: { id: WindowProfile; name: string }[] = [
  { id: 'minimalist', name: 'Modern' },
  { id: 'classic',    name: 'French'  },
  { id: 'doubleHung', name: 'Heritage' },
]

const TABS = [
  { id: 'fabric', label: 'Fabric' },
  { id: 'window', label: 'Window' },
  { id: 'walls',  label: 'Walls'  },
] as const
type TabId = typeof TABS[number]['id']

// Land on a fully-designed room. Defaults are resolved once at module load so the
// very first paint already shows recoloured curtains — no blank state, no wizard.
const DEFAULT_WALL   = WALL_COLORS[1]           // Warm Sand
const DEFAULT_WINDOW: WindowProfile = 'classic' // French
function fabricsFor(hex: string): FabricOpt[] {
  const [r, g, b] = hexToRgb(hex)
  return getRecommendations(r, g, b).map(rec => ({
    id: rec.id, label: rec.label, hex: rec.hex, collection: rec.collection,
  }))
}
const DEFAULT_FABRICS = fabricsFor(DEFAULT_WALL.hex)

// ─── Window icon ────────────────────────────────────────────────────────────
function WindowSVG({ id, active, w = 60, h = 88 }: { id: WindowProfile; active: boolean; w?: number; h?: number }) {
  const stroke  = active ? C.gold : 'rgba(255,255,255,0.45)'
  const fill    = 'rgba(180,215,245,0.07)'
  const stroke2 = active ? C.goldLight : 'rgba(255,255,255,0.25)'

  if (id === 'minimalist') return (
    <svg width={w} height={h} viewBox="0 0 60 88" fill="none">
      <rect x="3" y="3" width="54" height="82" rx="1" fill={fill} stroke={stroke} strokeWidth="5.5"/>
      <rect x="11" y="11" width="38" height="66" rx="0.5" stroke={stroke2} strokeWidth="1"/>
    </svg>
  )

  if (id === 'classic') return (
    <svg width={w} height={h} viewBox="0 0 60 88" fill="none">
      <rect x="3" y="3" width="54" height="82" rx="1" fill={fill} stroke={stroke} strokeWidth="3"/>
      <line x1="30" y1="3"  x2="30" y2="85"  stroke={stroke} strokeWidth="2.5"/>
      <line x1="3"  y1="33" x2="57" y2="33"  stroke={stroke} strokeWidth="2.5"/>
      <line x1="3"  y1="61" x2="57" y2="61"  stroke={stroke} strokeWidth="2.5"/>
      <rect x="8"  y="8"  width="18" height="21" rx="0.5" stroke={stroke2} strokeWidth="1"/>
      <rect x="34" y="8"  width="18" height="21" rx="0.5" stroke={stroke2} strokeWidth="1"/>
    </svg>
  )

  return (
    <svg width={w} height={h} viewBox="0 0 60 88" fill="none">
      <rect x="4" y="4" width="52" height="80" rx="2" fill={fill} stroke={stroke} strokeWidth="4.5"/>
      <line x1="4" y1="46" x2="56" y2="46" stroke={stroke} strokeWidth="4.5"/>
      <rect x="10" y="9"  width="40" height="32" rx="1" stroke={stroke2} strokeWidth="1.5"/>
      <rect x="10" y="51" width="40" height="28" rx="1" stroke={stroke2} strokeWidth="1.5"/>
    </svg>
  )
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function MobileStudio() {
  const [wallColor,     setWallColor]     = useState<WallColor>(DEFAULT_WALL)
  const [windowProfile, setWindowProfile] = useState<WindowProfile>(DEFAULT_WINDOW)
  const [fabricOpts,    setFabricOpts]    = useState<FabricOpt[]>(DEFAULT_FABRICS)
  const [activeFabric,  setActiveFabric]  = useState<FabricOpt | null>(DEFAULT_FABRICS[0] ?? null)
  const [activeTab,     setActiveTab]     = useState<TabId>('fabric')
  const [imgReady,      setImgReady]      = useState(false)

  const canvasRef    = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement | null>(null)
  const imgRef       = useRef<HTMLImageElement | null>(null)
  const offRef       = useRef<HTMLCanvasElement | null>(null)
  const resizeObs    = useRef<ResizeObserver | null>(null)

  // Preload the room photo once.
  useEffect(() => {
    const img = new Image()
    img.onload = () => { imgRef.current = img; setImgReady(true) }
    // Optimized (AVIF/WebP + resized) source instead of the raw 1.17 MB PNG.
    img.src = nextImageSrc('/assets/sittingroom.png', 1200, 75)
  }, [])

  // A new wall colour re-derives the matched fabric palette (the wall in the photo
  // stays fixed, but it drives which fabrics we recommend) and selects the top pick.
  function selectWall(c: WallColor) {
    setWallColor(c)
    const opts = fabricsFor(c.hex)
    setFabricOpts(opts)
    setActiveFabric(opts[0] ?? null)
  }

  // Paint the live room: cover-crop the photo to fill the (tall) preview, then let
  // drawScene lay the recoloured curtains + the chosen window frame over it.
  const redraw = useCallback(() => {
    const canvas = canvasRef.current
    const cont   = containerRef.current
    const img    = imgRef.current
    // imgReady gates the first paint and keeps it in redraw's deps so the callback
    // ref re-fires once the photo finishes loading.
    if (!canvas || !cont || !img || !imgReady) return

    const W = cont.clientWidth
    const H = cont.clientHeight
    if (!W || !H) return
    const dpr = window.devicePixelRatio || 1
    const nw  = Math.round(W * dpr)
    const nh  = Math.round(H * dpr)
    canvas.width        = nw
    canvas.height       = nh
    canvas.style.width  = `${W}px`
    canvas.style.height = `${H}px`

    const off  = offRef.current ?? (offRef.current = document.createElement('canvas'))
    off.width  = nw
    off.height = nh
    const octx = off.getContext('2d')
    if (!octx) return
    const scale = Math.max(nw / img.naturalWidth, nh / img.naturalHeight)
    const dw = img.naturalWidth  * scale
    const dh = img.naturalHeight * scale
    octx.drawImage(img, (nw - dw) / 2, (nh - dh) / 2, dw, dh)

    drawScene(canvas, off as unknown as HTMLImageElement, activeFabric?.hex ?? null, windowProfile)
  }, [activeFabric, windowProfile, imgReady])

  // Callback ref: draw the moment the canvas container mounts (avoids a null-ref
  // race), and re-observe + repaint whenever a control changes or the photo loads.
  const attachContainer = useCallback((node: HTMLDivElement | null) => {
    containerRef.current = node
    resizeObs.current?.disconnect()
    resizeObs.current = null
    if (node) {
      const ro = new ResizeObserver(() => redraw())
      ro.observe(node)
      resizeObs.current = ro
      redraw()
    }
  }, [redraw])

  // Ambient background hue from the selected wall colour.
  const bgGlow = `radial-gradient(ellipse at 50% -10%, ${wallColor.hex}22 0%, transparent 58%)`

  return (
    <div style={{
      minHeight:  '100svh',
      paddingTop: 'var(--rj-navbar-height,60px)',
      background: C.bg,
      position:   'relative',
      overflowX:  'hidden',
    }}>
      {/* Dynamic wall-colour glow */}
      <div style={{
        position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0,
        background: bgGlow, transition: 'background 0.9s ease',
      }} />

      {/* Mobile-first: cap to a phone-width column, full height, controls docked. */}
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, ease }}
        style={{
          position:      'relative',
          zIndex:        1,
          maxWidth:      480,
          margin:        '0 auto',
          minHeight:     'calc(100svh - var(--rj-navbar-height, 60px))',
          display:       'flex',
          flexDirection: 'column',
          borderLeft:    '1px solid rgba(255,255,255,0.04)',
          borderRight:   '1px solid rgba(255,255,255,0.04)',
        }}
      >
        {/* ── Live preview — grows to fill everything above the dock ───────── */}
        <div ref={attachContainer} style={{ position: 'relative', background: '#0A0B10', flex: 1, minHeight: 0 }}>
          {/* Live badge */}
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
          <div style={{
            position: 'absolute', top: 12, right: 12, zIndex: 10,
            background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(6px)',
            borderRadius: 8, padding: '5px 10px',
            display: 'flex', alignItems: 'center', gap: 7,
            border: '1px solid rgba(255,255,255,0.08)',
          }}>
            <div style={{ width: 11, height: 11, borderRadius: 3, background: wallColor.hex, flexShrink: 0 }} />
            <span style={{
              fontFamily: 'var(--font-inter,sans-serif)', fontSize: 9,
              color: 'rgba(255,255,255,0.6)', letterSpacing: '0.14em', textTransform: 'uppercase',
            }}>
              {wallColor.name}
            </span>
          </div>

          {/* Glass sheen */}
          <div style={{
            position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 9,
            background: 'linear-gradient(135deg,rgba(255,255,255,0.025) 0%,transparent 50%)',
          }} />

          <canvas ref={canvasRef} style={{ display: 'block', width: '100%' }} />

          {/* Loading spinner until the photo is ready */}
          {!imgReady && (
            <div style={{
              position: 'absolute', inset: 0, display: 'flex',
              alignItems: 'center', justifyContent: 'center', background: '#0D0F14',
            }}>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1.4, repeat: Infinity, ease: 'linear' }}
                style={{ width: 26, height: 26, borderRadius: '50%', border: `2px solid ${C.faint}`, borderTop: `2px solid ${C.gold}` }}
              />
            </div>
          )}
        </div>

        {/* ── Control dock — tabs + the active tab's options ───────────────── */}
        <div style={{ background: C.surface, borderTop: `1px solid ${C.border}`, flexShrink: 0 }}>
          {/* Tab row */}
          <div style={{ display: 'flex', borderBottom: `1px solid ${C.border}` }}>
            {TABS.map(t => {
              const on = activeTab === t.id
              return (
                <button key={t.id} onClick={() => setActiveTab(t.id)} aria-pressed={on}
                  style={{
                    flex: 1, padding: '13px 0', background: 'none', cursor: 'pointer',
                    border: 'none', borderBottom: `2px solid ${on ? C.gold : 'transparent'}`,
                    color: on ? C.goldLight : 'rgba(255,255,255,0.45)',
                    fontFamily: 'var(--font-inter,sans-serif)', fontSize: 11,
                    fontWeight: on ? 600 : 500, letterSpacing: '0.14em', textTransform: 'uppercase',
                    transition: 'color 0.2s, border-color 0.2s',
                  }}>
                  {t.label}
                </button>
              )
            })}
          </div>

          {/* Options for the active tab */}
          <div style={{ minHeight: 112, padding: '16px 0 8px', display: 'flex', alignItems: 'center' }}>
            <AnimatePresence mode="wait">
              <motion.div key={activeTab}
                initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.22, ease }}
                style={{ width: '100%' }}>

                {/* Fabric pills */}
                {activeTab === 'fabric' && (
                  <div style={{ display: 'flex', gap: 9, overflowX: 'auto', padding: '0 16px 4px', scrollbarWidth: 'none' }}>
                    {fabricOpts.map(f => {
                      const on = activeFabric?.id === f.id
                      return (
                        <button key={f.id} onClick={() => setActiveFabric(f)}
                          style={{
                            flexShrink: 0, display: 'flex', alignItems: 'center', gap: 8,
                            padding: '10px 16px', borderRadius: 99,
                            background: on ? 'rgba(201,168,76,0.13)' : 'rgba(255,255,255,0.04)',
                            border: `1.5px solid ${on ? C.gold : 'rgba(255,255,255,0.09)'}`,
                            cursor: 'pointer', transition: 'all 0.22s ease',
                            transform: on ? 'scale(1.04)' : 'scale(1)',
                          }}>
                          <span style={{
                            width: 12, height: 12, borderRadius: '50%', background: f.hex, flexShrink: 0,
                            boxShadow: on ? '0 0 0 2px rgba(201,168,76,0.35)' : 'none', transition: 'box-shadow 0.22s',
                          }} />
                          <span style={{
                            fontFamily: 'var(--font-inter,sans-serif)', fontSize: 12,
                            fontWeight: on ? 600 : 400, letterSpacing: '0.04em',
                            color: on ? C.goldLight : 'rgba(255,255,255,0.5)', whiteSpace: 'nowrap',
                          }}>
                            {f.label}
                          </span>
                        </button>
                      )
                    })}
                  </div>
                )}

                {/* Window chips — 3 across, tap to see it framed on the room */}
                {activeTab === 'window' && (
                  <div style={{ display: 'flex', gap: 10, padding: '0 16px' }}>
                    {WINDOW_PROFILES.map(p => {
                      const on = windowProfile === p.id
                      return (
                        <button key={p.id} onClick={() => setWindowProfile(p.id)}
                          style={{
                            flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
                            padding: '12px 6px', borderRadius: 12, cursor: 'pointer',
                            background: on ? 'rgba(201,168,76,0.10)' : 'rgba(255,255,255,0.03)',
                            border: `1.5px solid ${on ? C.borderHi : 'rgba(255,255,255,0.08)'}`,
                            transition: 'all 0.2s ease',
                          }}>
                          <WindowSVG id={p.id} active={on} w={30} h={44} />
                          <span style={{
                            fontFamily: 'var(--font-inter,sans-serif)', fontSize: 11,
                            fontWeight: on ? 600 : 500, letterSpacing: '0.06em',
                            color: on ? C.goldLight : 'rgba(255,255,255,0.55)',
                          }}>
                            {p.name}
                          </span>
                        </button>
                      )
                    })}
                  </div>
                )}

                {/* Wall swatches */}
                {activeTab === 'walls' && (
                  <div style={{ display: 'flex', gap: 12, overflowX: 'auto', padding: '0 16px 4px', scrollbarWidth: 'none' }}>
                    {WALL_COLORS.map(c => {
                      const on = wallColor.id === c.id
                      return (
                        <button key={c.id} onClick={() => selectWall(c)}
                          style={{
                            flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'center',
                            gap: 8, background: 'none', border: 'none', cursor: 'pointer', padding: 0,
                          }}>
                          <span style={{
                            width: 46, height: 62, borderRadius: 8, background: c.hex,
                            border: `2.5px solid ${on ? C.gold : 'transparent'}`,
                            boxShadow: on ? '0 0 0 1px rgba(201,168,76,0.5)' : '0 4px 12px rgba(0,0,0,0.5)',
                            position: 'relative', overflow: 'hidden',
                            transform: on ? 'scale(1.06)' : 'scale(1)', transition: 'all 0.2s ease',
                          }}>
                            <span style={{
                              position: 'absolute', inset: 0, display: 'block',
                              background: 'linear-gradient(135deg,rgba(255,255,255,0.18) 0%,transparent 55%,rgba(0,0,0,0.12) 100%)',
                            }} />
                          </span>
                          <span style={{
                            fontFamily: 'var(--font-inter,sans-serif)', fontSize: 8.5,
                            letterSpacing: '0.08em', textTransform: 'uppercase',
                            color: on ? C.gold : 'rgba(255,255,255,0.35)',
                            maxWidth: 52, textAlign: 'center', lineHeight: 1.3,
                          }}>
                            {c.name}
                          </span>
                        </button>
                      )
                    })}
                  </div>
                )}

              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* ── Pay to Book ──────────────────────────────────────────────────── */}
        <div style={{ padding: '12px 20px 28px', background: C.bg, flexShrink: 0 }}>
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
    </div>
  )
}
