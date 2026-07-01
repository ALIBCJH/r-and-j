'use client'

/**
 * Internal preview playground for the fabric compositor.
 *
 * Drives composeScene() with assets resolved through the manifest: if a style's
 * render exists in /public/curtains it's used, otherwise the code placeholder
 * stands in. So dropping a real `_lum.webp` in and reloading is the whole swap.
 *
 * Route: /studio-preview  (noindex — see page.tsx metadata)
 */

import { useEffect, useRef, useState } from 'react'
import {
  composeScene,
  WINDOW_SIZES,
} from '@/app/components/mobile-studio/fabricCompositor'
import {
  CURTAIN_STYLES,
  loadPanelSet,
  type PanelSet,
} from '@/app/components/mobile-studio/assetManifest'

// Internal canvas resolution (portrait window). CSS scales it to fit.
const CANVAS_W = 1000
const CANVAS_H = 1400

const WALL_COLORS = [
  { name: 'Off White',      hex: '#F5F0E8' },
  { name: 'Warm Sand',      hex: '#E2D5BF' },
  { name: 'Soft Terracotta', hex: '#C07455' },
  { name: 'Sage Green',     hex: '#8FAF8C' },
  { name: 'Slate Blue',     hex: '#6A7A84' },
  { name: 'Charcoal',       hex: '#3C3C3C' },
  { name: 'Midnight',       hex: '#1E3A5F' },
]

const FABRIC_COLORS = [
  { name: 'Ivory',      hex: '#EDE4D3' },
  { name: 'Champagne',  hex: '#D9C7A3' },
  { name: 'Dusty Rose', hex: '#C99A93' },
  { name: 'Sage',       hex: '#9CAD8E' },
  { name: 'Teal',       hex: '#2E6E6A' },
  { name: 'Terracotta', hex: '#B35C3C' },
  { name: 'Navy',       hex: '#22304F' },
  { name: 'Espresso',   hex: '#4A3728' },
]

const SIZE_KEYS = Object.keys(WINDOW_SIZES) as (keyof typeof WINDOW_SIZES)[]

const GOLD = '#C9A84C'
const TEXT = '#F0EBE0'
const MUTED = '#A09080'

// Responsive layout — mobile-first, one breakpoint up to a two-column desktop view.
const RESPONSIVE_CSS = `
.cp-root { padding: 16px 14px 40px; }

/* Mobile default: stack canvas over controls */
.cp-layout { display: flex; flex-direction: column; gap: 20px; }

.cp-stage { width: 100%; display: flex; justify-content: center; }
.cp-canvas {
  display: block;
  margin: 0 auto;
  width: auto;
  height: auto;
  max-width: 100%;
  max-height: 58vh;           /* cap height on phones so controls stay reachable */
  border-radius: 10px;
  border: 1px solid rgba(201,168,76,0.24);
  background: #000;
}
.cp-controls { display: flex; flex-direction: column; gap: 20px; }

/* Custom range slider — thin gold track + large draggable thumb */
.cp-slider {
  -webkit-appearance: none;
  appearance: none;
  width: 100%;
  height: 6px;
  margin: 8px 0;
  border-radius: 999px;
  background: rgba(255,255,255,0.14);
  outline: none;
  cursor: pointer;
}
.cp-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: linear-gradient(135deg,#E8C87A,#C9A84C);
  border: 2px solid #08090D;
  box-shadow: 0 2px 6px rgba(0,0,0,0.55);
}
.cp-slider::-moz-range-thumb {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: linear-gradient(135deg,#E8C87A,#C9A84C);
  border: 2px solid #08090D;
  box-shadow: 0 2px 6px rgba(0,0,0,0.55);
}
.cp-slider::-moz-range-track {
  height: 6px;
  border-radius: 999px;
  background: rgba(255,255,255,0.14);
}
.cp-slider:focus-visible::-webkit-slider-thumb { outline: 2px solid ${GOLD}; outline-offset: 2px; }
.cp-slider:focus-visible::-moz-range-thumb     { outline: 2px solid ${GOLD}; outline-offset: 2px; }

/* Larger touch targets on coarse pointers (phones/tablets) */
@media (pointer: coarse) {
  .cp-swatch { width: 46px !important; height: 46px !important; }
  .cp-pill   { min-height: 44px; }
  .cp-slider { height: 8px; margin: 12px 0; }
  .cp-slider::-webkit-slider-thumb { width: 32px; height: 32px; }
  .cp-slider::-moz-range-thumb     { width: 32px; height: 32px; }
}

/* Desktop: two columns, canvas taller and sticky */
@media (min-width: 760px) {
  .cp-root { padding: 24px 16px 48px; }
  .cp-layout { flex-direction: row; align-items: flex-start; gap: 28px; }
  .cp-stage { flex: 1 1 420px; max-width: 520px; position: sticky; top: 16px; }
  .cp-canvas { max-height: 78vh; }
  .cp-controls { flex: 1 1 320px; max-width: 420px; }
}
`

export default function StudioPreviewClient() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const [styleId, setStyleId]       = useState(CURTAIN_STYLES[0].id)
  const [wallHex, setWallHex]       = useState(WALL_COLORS[1].hex)
  const [fabricHex, setFabricHex]   = useState(FABRIC_COLORS[1].hex)
  const [windowSize, setWindowSize] = useState<keyof typeof WINDOW_SIZES>('medium')
  const [tintGain, setTintGain]     = useState(1)
  const [folds, setFolds]           = useState(5)
  const [panelSet, setPanelSet]     = useState<PanelSet | null>(null)

  // Resolve assets through the manifest: real render if present, else placeholder.
  useEffect(() => {
    let cancelled = false
    loadPanelSet(styleId, 'open', { placeholderFolds: folds }).then(ps => {
      if (cancelled) return
      setPanelSet(ps)
      // Adopt the render's recommended gain the first time a real asset loads.
      if (!ps.isPlaceholder) setTintGain(ps.tintGain)
    })
    return () => { cancelled = true }
  }, [styleId, folds])

  // Redraw whenever the resolved panels or any styling control changes.
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || !panelSet) return
    canvas.width = CANVAS_W
    canvas.height = CANVAS_H

    composeScene(canvas, {
      wallHex,
      fabricHex,
      leftPanel:  panelSet.left,
      rightPanel: panelSet.right,
      shadow:     panelSet.shadow,
      windowSize,
      tintGain,
    })
  }, [panelSet, wallHex, fabricHex, windowSize, tintGain])

  return (
    <div className="cp-root" style={{ minHeight: '100vh', background: '#08090D', color: TEXT }}>
      <style>{RESPONSIVE_CSS}</style>
      <div style={{ maxWidth: 1180, margin: '0 auto' }}>
        <header style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 12, letterSpacing: 2, color: GOLD, textTransform: 'uppercase' }}>
            Internal · Compositor Preview
          </div>
          <h1 style={{ fontSize: 'clamp(20px, 5vw, 26px)', fontWeight: 600, margin: '6px 0 4px' }}>
            Realistic Window Panel
          </h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', marginTop: 8 }}>
            <span style={{
              fontSize: 11, fontWeight: 600, letterSpacing: 0.5,
              padding: '4px 10px', borderRadius: 999,
              color: panelSet?.isPlaceholder ? '#08090D' : '#0A140A',
              background: panelSet?.isPlaceholder ? GOLD : '#7FCf8A',
            }}>
              {panelSet == null ? 'Loading…' : panelSet.isPlaceholder ? 'PLACEHOLDER' : 'REAL RENDER'}
            </span>
            <code style={{ fontSize: 11, color: MUTED, wordBreak: 'break-all' }}>
              {panelSet?.lumUrl ?? '/curtains/…'}
            </code>
          </div>
        </header>

        <div className="cp-layout">
          {/* Canvas — sticky on desktop, height-capped on mobile so controls stay reachable */}
          <div className="cp-stage">
            <canvas ref={canvasRef} className="cp-canvas" />
          </div>

          {/* Controls */}
          <div className="cp-controls">
            <Field label="Curtain style">
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {CURTAIN_STYLES.map(s => (
                  <button
                    key={s.id}
                    className="cp-pill"
                    onClick={() => setStyleId(s.id)}
                    style={pillStyle(styleId === s.id)}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </Field>

            <Swatches label="Wall colour"   items={WALL_COLORS}   value={wallHex}   onPick={setWallHex} />
            <Swatches label="Fabric colour" items={FABRIC_COLORS} value={fabricHex} onPick={setFabricHex} />

            <Field label="Window size">
              <div style={{ display: 'flex', gap: 8 }}>
                {SIZE_KEYS.map(k => (
                  <button
                    key={k}
                    className="cp-pill"
                    onClick={() => setWindowSize(k)}
                    style={pillStyle(windowSize === k)}
                  >
                    {k}
                  </button>
                ))}
              </div>
            </Field>

            <Field label={`Tint gain — ${tintGain.toFixed(2)}`}>
              <input
                className="cp-slider"
                type="range" min={1} max={1.4} step={0.01}
                value={tintGain}
                onChange={e => setTintGain(parseFloat(e.target.value))}
                style={{ width: '100%', accentColor: GOLD }}
              />
              <p style={{ fontSize: 11, color: MUTED, margin: '4px 0 0' }}>
                1.00 for the bright placeholder; ~1.15 for a real #CFCFCF render.
              </p>
            </Field>

            {panelSet?.isPlaceholder && (
              <Field label={`Placeholder folds — ${folds}`}>
                <input
                  className="cp-slider"
                  type="range" min={3} max={9} step={1}
                  value={folds}
                  onChange={e => setFolds(parseInt(e.target.value))}
                  style={{ width: '100%', accentColor: GOLD }}
                />
                <p style={{ fontSize: 11, color: MUTED, margin: '4px 0 0' }}>
                  Tuning knob for the stand-in only — hidden once a real render loads.
                </p>
              </Field>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Small presentational helpers ──────────────────────────────────────────────

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div style={{ fontSize: 12, letterSpacing: 1, color: MUTED, textTransform: 'uppercase', marginBottom: 8 }}>
        {label}
      </div>
      {children}
    </div>
  )
}

function Swatches({
  label, items, value, onPick,
}: {
  label: string
  items: { name: string; hex: string }[]
  value: string
  onPick: (hex: string) => void
}) {
  return (
    <Field label={label}>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        {items.map(c => {
          const active = c.hex.toLowerCase() === value.toLowerCase()
          return (
            <button
              key={c.hex}
              className="cp-swatch"
              title={c.name}
              onClick={() => onPick(c.hex)}
              style={{
                width: 40, height: 40, borderRadius: 8, cursor: 'pointer',
                background: c.hex,
                border: active ? `2px solid ${GOLD}` : '2px solid rgba(255,255,255,0.12)',
                outline: active ? `2px solid rgba(201,168,76,0.4)` : 'none',
                outlineOffset: 2,
              }}
            />
          )
        })}
      </div>
    </Field>
  )
}

function pillStyle(active: boolean): React.CSSProperties {
  return {
    flex: 1,
    padding: '9px 4px',
    fontSize: 13,
    textTransform: 'capitalize',
    borderRadius: 8,
    cursor: 'pointer',
    color: active ? '#08090D' : TEXT,
    background: active ? GOLD : 'rgba(255,255,255,0.04)',
    border: active ? `1px solid ${GOLD}` : '1px solid rgba(255,255,255,0.12)',
    fontWeight: active ? 600 : 400,
  }
}
