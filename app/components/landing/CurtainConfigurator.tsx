'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { drawScene } from '@/app/components/mobile-studio/curtainRenderer'
import { nextImageSrc } from '@/app/lib/nextImageSrc'

const ease = [0.25, 0.1, 0.25, 1] as const

/* Live fabric COLOURS. The preview is a real canvas render: picking a colour
   re-tints the curtains over the room photo in real time via drawScene() — the
   same engine the Studio uses. No per-colour images needed. */
const FABRICS = [
  { id: 'cream',      name: 'Warm Cream',      desc: 'Soft natural weave, warm daylight diffusion', hex: '#D9C7A3' },
  { id: 'terracotta', name: 'Soft Terracotta', desc: 'Earthy warmth with a sunlit glow',            hex: '#C07455' },
  { id: 'sage',       name: 'Sage Green',      desc: 'Calm, botanical, gently muted',               hex: '#8FAF8C' },
  { id: 'charcoal',   name: 'Charcoal',        desc: 'Dramatic depth and quiet luxury',             hex: '#3C3C3C' },
]

// Pull the room photo through the Next optimizer (AVIF/WebP + resize) rather than
// the raw 1.17 MB PNG — this is a <canvas> source, so we can't use <Image>, but we
// can still request the optimized asset. Same-origin output keeps the canvas clean.
const ROOM_SRC = nextImageSrc('/assets/sittingroom.png', 1200, 75)

export default function CurtainConfigurator() {
  const [active,   setActive]   = useState(0)
  const [imgReady, setImgReady] = useState(false)

  const canvasRef    = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement | null>(null)
  const imgRef       = useRef<HTMLImageElement | null>(null)
  const offRef       = useRef<HTMLCanvasElement | null>(null)
  const resizeObs    = useRef<ResizeObserver | null>(null)

  // Preload the room photo once.
  useEffect(() => {
    const img = new Image()
    img.onload = () => { imgRef.current = img; setImgReady(true) }
    img.src = ROOM_SRC
  }, [])

  // Paint: cover-crop the photo into an offscreen canvas (no stretch), then let
  // drawScene lay the recoloured curtains over it.
  const redraw = useCallback(() => {
    const canvas = canvasRef.current
    const cont   = containerRef.current
    const img    = imgRef.current
    if (!canvas || !cont || !img) return

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

    // Cover-crop the source photo to the canvas box so it never distorts.
    const off  = offRef.current ?? (offRef.current = document.createElement('canvas'))
    off.width  = nw
    off.height = nh
    const octx = off.getContext('2d')
    if (!octx) return
    const scale = Math.max(nw / img.naturalWidth, nh / img.naturalHeight)
    const dw = img.naturalWidth  * scale
    const dh = img.naturalHeight * scale
    octx.drawImage(img, (nw - dw) / 2, (nh - dh) / 2, dw, dh)

    // drawScene only calls ctx.drawImage(src) — an offscreen canvas is a valid source.
    drawScene(canvas, off as unknown as HTMLImageElement, FABRICS[active].hex)
    // imgReady is a dep so the first paint lands once the photo loads.
  }, [active, imgReady])

  // Callback ref: draw exactly when the container mounts, and re-observe /
  // repaint whenever `redraw` changes (colour switch, photo load, resize).
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

  return (
    <section style={{
      background: '#0D1B2E',
      padding:    '150px 6vw',
      borderTop:  '1px solid rgba(201,168,76,0.12)',
    }}>
      <div style={{ maxWidth: '1300px', margin: '0 auto' }}>

        {/* Header — one idea: why this is different. Title + a single quiet line. */}
        <div className="text-center" style={{ marginBottom: '84px' }}>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.9, ease }}
            style={{
              fontFamily:    'var(--font-playfair, Georgia, serif)',
              fontSize:      'clamp(40px, 5vw, 68px)',
              color:         '#FFFFFF',
              lineHeight:    1.08,
              letterSpacing: '-0.01em',
            }}
          >
            Design Without Guesswork
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.9, ease, delay: 0.12 }}
            style={{
              fontFamily: 'var(--font-inter, sans-serif)',
              fontSize:   'clamp(16px, 1.5vw, 19px)',
              color:      'rgba(240,235,224,0.66)',
              lineHeight: 1.7,
              maxWidth:   '460px',
              margin:     '24px auto 0',
            }}
          >
            Experience every curtain, fabric and finish before production begins.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scaleX: 0 }}
            whileInView={{ opacity: 1, scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease, delay: 0.3 }}
            style={{
              width:           '48px',
              height:          '2px',
              background:      'linear-gradient(90deg, #C9A84C, #E8C96D)',
              margin:          '32px auto 0',
              transformOrigin: 'center',
            }}
          />
        </div>

        <style>{`
          .config-stage {
            position: relative;
            border: 1px solid rgba(255,255,255,0.06);
            border-radius: 24px;
            box-shadow: 0 50px 140px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.06);
            overflow: hidden;
          }
          .config-preview {
            position: relative;
            width: 100%;
            height: clamp(400px, 60vh, 600px);
            overflow: hidden;
            background: #0a1019;
          }
          .config-preview canvas { display: block; width: 100%; height: 100%; }
          .config-scrim {
            position: absolute; inset: 0; z-index: 2; pointer-events: none;
            background:
              linear-gradient(90deg, rgba(8,12,22,0.10) 0%, rgba(8,12,22,0.20) 55%, rgba(8,12,22,0.78) 100%),
              linear-gradient(180deg, rgba(8,12,22,0.45) 0%, transparent 25%, transparent 65%, rgba(8,12,22,0.55) 100%);
          }
          .config-badge {
            position: absolute; top: 24px; left: 24px; z-index: 3;
            display: inline-flex; align-items: center; gap: 8px;
            padding: 8px 16px;
            border-radius: 100px;
            background: rgba(18,26,42,0.42);
            border: 1px solid rgba(255,255,255,0.14);
            backdrop-filter: blur(18px) saturate(130%);
            -webkit-backdrop-filter: blur(18px) saturate(130%);
            box-shadow: inset 0 1px 0 rgba(255,255,255,0.14);
            font-family: var(--font-inter, sans-serif);
            font-size: 10px; letter-spacing: 3px; text-transform: uppercase;
            color: #E8C96D;
          }
          .config-dot {
            width: 7px; height: 7px; border-radius: 50%;
            background: #E8C96D; box-shadow: 0 0 8px rgba(232,201,109,0.9);
          }

          /* Control panel — a frosted glass slab floating over the room,
             Apple Vision Pro style: deep blur, soft shadow, a bright top edge
             and a faint gold rim for depth. */
          .config-panel {
            position: absolute; z-index: 4;
            top: 50%; right: 32px; transform: translateY(-50%);
            width: 348px;
            padding: 30px;
            border-radius: 20px;
            background: rgba(18,26,42,0.42);
            border: 1px solid rgba(255,255,255,0.12);
            backdrop-filter: blur(30px) saturate(135%);
            -webkit-backdrop-filter: blur(30px) saturate(135%);
            box-shadow:
              0 30px 80px rgba(0,0,0,0.55),
              inset 0 1px 0 rgba(255,255,255,0.16),
              inset 0 0 0 1px rgba(201,168,76,0.08);
          }
          .config-panel-label {
            font-family: var(--font-inter, sans-serif);
            font-size: 11px; letter-spacing: 3px; text-transform: uppercase;
            color: #C9A84C; margin-bottom: 4px;
          }
          .config-panel-title {
            font-family: var(--font-playfair, Georgia, serif);
            font-size: 20px; color: #FFFFFF; margin-bottom: 22px;
          }
          .fabric-opt {
            display: flex; align-items: flex-start; gap: 14px;
            width: 100%; text-align: left;
            padding: 14px 14px;
            border-radius: 12px;
            background: transparent;
            border: 1px solid transparent;
            border-left: 2px solid transparent;
            cursor: pointer;
            transition: background 0.3s ease, border-color 0.3s ease;
          }
          .fabric-opt:hover { background: rgba(201,168,76,0.05); }
          .fabric-opt.is-active {
            background: rgba(201,168,76,0.08);
            border-color: rgba(201,168,76,0.25);
            border-left-color: #E8C96D;
          }
          /* Fabric colour chip — shows the actual swatch that will be applied */
          .fabric-swatch {
            margin-top: 2px; flex-shrink: 0;
            width: 18px; height: 18px; border-radius: 50%;
            border: 1px solid rgba(255,255,255,0.25);
            box-shadow: inset 0 1px 2px rgba(255,255,255,0.25), 0 2px 6px rgba(0,0,0,0.4);
            transition: box-shadow 0.3s ease, transform 0.3s ease;
          }
          .fabric-opt.is-active .fabric-swatch {
            box-shadow: 0 0 0 2px rgba(232,201,109,0.9), 0 2px 8px rgba(0,0,0,0.5);
            transform: scale(1.06);
          }
          .fabric-text { display: flex; flex-direction: column; gap: 3px; }
          .fabric-name {
            display: block;
            font-family: var(--font-inter, sans-serif);
            font-size: 15px; font-weight: 600; color: #FFFFFF; line-height: 1.3;
          }
          .fabric-desc {
            display: block;
            font-family: var(--font-inter, sans-serif);
            font-size: 12px; color: #8294A4; line-height: 1.5;
          }
          .config-cta {
            display: inline-flex; align-items: center; gap: 10px;
            width: 100%; justify-content: center;
            margin-top: 26px; padding: 16px 24px;
            border-radius: 10px;
            background: linear-gradient(135deg, #F0D77A 0%, #C9A84C 50%, #A67C2E 100%);
            color: #0A0F1C;
            font-family: var(--font-inter, sans-serif);
            font-size: 12px; font-weight: 600; letter-spacing: 2px; text-transform: uppercase;
            box-shadow: 0 8px 28px rgba(0,0,0,0.35), 0 0 18px rgba(232,201,109,0.25);
            transition: filter 0.3s ease, box-shadow 0.3s ease, transform 0.3s ease;
          }
          .config-cta:hover {
            filter: brightness(1.08);
            transform: translateY(-1px);
            box-shadow: 0 12px 32px rgba(0,0,0,0.4), 0 0 26px rgba(232,201,109,0.4);
          }

          /* Mobile — panel drops below the preview */
          @media (max-width: 768px) {
            .config-preview { height: 340px; }
            .config-panel {
              position: static; transform: none;
              width: 100%; border-top: none;
              border-radius: 0;
              border-left: none; border-right: none; border-bottom: none;
              backdrop-filter: none; -webkit-backdrop-filter: none;
              box-shadow: none;
              background: rgba(13,20,34,0.96);
            }
          }
        `}</style>

        {/* Configurator */}
        <motion.div
          className="config-stage"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.9, ease }}
        >
          {/* Room preview — live canvas render */}
          <div ref={attachContainer} className="config-preview">
            <canvas ref={canvasRef} />

            <div className="config-scrim" />

            <div className="config-badge">
              <span className="config-dot" />
              Live Preview
            </div>
          </div>

          {/* Control panel */}
          <div className="config-panel">
            <p className="config-panel-label">Live Preview</p>
            <p className="config-panel-title">Choose your fabric</p>

            {FABRICS.map((f, i) => (
              <button
                key={f.id}
                type="button"
                className={`fabric-opt${active === i ? ' is-active' : ''}`}
                onClick={() => setActive(i)}
                aria-pressed={active === i}
              >
                <span className="fabric-swatch" style={{ background: f.hex }} />
                <span className="fabric-text">
                  <span className="fabric-name">{f.name}</span>
                  <span className="fabric-desc">{f.desc}</span>
                </span>
              </button>
            ))}

            <Link href="/studio" className="config-cta">
              Start Your Design
              <ArrowRight size={15} />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
