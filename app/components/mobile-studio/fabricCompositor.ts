/**
 * Fabric compositor for the R&J realistic window panel — v1.
 *
 * This is the runtime half of the "bake in Blender, recolor in code" pipeline
 * described in BLENDER_ASSETS.md. It never draws curtain folds from math — it
 * takes a *neutral* curtain render (the `_lum` pass) and recolors it to the
 * customer's chosen fabric, then composites it over a procedural wall + window.
 *
 * Layer order (bottom → top):
 *
 *   0  Wall            flat fill in the customer's chosen wall colour
 *   1  Window / Door   procedural, sized to the customer's chosen window size
 *   2  Curtain shadow  optional Blender `_shadow` pass, cast on the wall
 *   3  Curtain panels  the neutral `_lum` render, RECOLORED and scaled to sides
 *
 * THE RECOLOR TRICK (tintPanel):
 *   A neutral render (#CFCFCF fabric) holds only light-and-shadow. We
 *   `multiply` the fabric colour over it → real folds keep their depth while
 *   the hue becomes exactly what the customer picked. One render → every colour.
 *
 * While the real Blender renders are being produced, makePlaceholderPanel()
 * generates a stand-in that obeys the SAME contract (transparent bg, silhouette
 * in alpha, upper-left lighting), so the whole pipeline runs and can be tuned
 * today. When a real `_lum.webp` arrives, it drops straight into tintPanel()
 * with zero code change.
 */

// ─── Types ──────────────────────────────────────────────────────────────────

/** Anything drawable that carries a luminance render + silhouette alpha. */
export type PanelSource = HTMLImageElement | HTMLCanvasElement

/** Window opening size as a fraction of the visible canvas. */
export interface WindowSize {
  wFrac: number   // opening width  as fraction of canvas width   (e.g. 0.60)
  hFrac: number   // opening height as fraction of canvas height  (e.g. 0.82)
}

export const WINDOW_SIZES = {
  small:  { wFrac: 0.46, hFrac: 0.66 },
  medium: { wFrac: 0.58, hFrac: 0.80 },
  large:  { wFrac: 0.70, hFrac: 0.92 },
} as const satisfies Record<string, WindowSize>

export interface ComposeOptions {
  /** Wall colour behind everything (#RRGGBB). */
  wallHex: string
  /** Fabric colour to recolor the neutral panels to (#RRGGBB). */
  fabricHex: string
  /** Neutral luminance render for the LEFT panel (Blender `_lum` or placeholder). */
  leftPanel: PanelSource
  /** Optional distinct right panel; if omitted, the left panel is mirrored. */
  rightPanel?: PanelSource
  /** Optional cast-shadow layer (Blender `_shadow`), drawn under the panels. */
  shadow?: PanelSource
  /** Window opening size. Accepts a preset key or explicit fractions. */
  windowSize?: keyof typeof WINDOW_SIZES | WindowSize
  /** Each panel's width as a fraction of canvas width. Default 0.20. */
  panelWFrac?: number
  /** Rod height in native canvas px (panels hang below this). Default 9. */
  rodH?: number
  /**
   * Brightness gain applied to the fabric colour before multiply, to undo the
   * darkening of a mid-grey neutral base. The placeholder is authored bright,
   * so 1.0 is correct for it; real #CFCFCF renders want ~1.15. Clamped in code.
   */
  tintGain?: number
}

// ─── Small colour helpers (kept local so this module has no dependencies) ─────

function parseHex(hex: string): [number, number, number] {
  const h = hex.replace('#', '')
  return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)]
}

function clamp255(v: number): number {
  return Math.max(0, Math.min(255, Math.round(v)))
}

function makeCanvas(w: number, h: number): HTMLCanvasElement {
  const c = document.createElement('canvas')
  c.width = w
  c.height = h
  return c
}

// ─── Recolor: the heart of the pipeline ───────────────────────────────────────

/**
 * Recolor a neutral luminance panel to a fabric colour, preserving folds.
 *
 * The classic 3-step canvas tint:
 *   1. draw the neutral render        → RGB luminance + silhouette alpha
 *   2. multiply the fabric colour     → folds keep depth, hue becomes fabric
 *   3. destination-in redraw          → restore the clean silhouette alpha
 *      (multiply with an opaque fill would otherwise fill the transparent bg)
 *
 * @param src       neutral `_lum` render (image or canvas)
 * @param fabricHex fabric colour #RRGGBB
 * @param gain      brightness gain on the colour before multiply (see ComposeOptions.tintGain)
 * @returns an offscreen canvas holding the recoloured panel
 */
export function tintPanel(src: PanelSource, fabricHex: string, gain = 1): HTMLCanvasElement {
  const w = src.width
  const h = src.height
  const out = makeCanvas(w, h)
  const ctx = out.getContext('2d')!

  const [r, g, b] = parseHex(fabricHex)
  const gr = clamp255(r * gain)
  const gg = clamp255(g * gain)
  const gb = clamp255(b * gain)

  // 1. neutral luminance + alpha silhouette
  ctx.globalCompositeOperation = 'source-over'
  ctx.drawImage(src, 0, 0)

  // 2. tint: fabric colour × luminance
  ctx.globalCompositeOperation = 'multiply'
  ctx.fillStyle = `rgb(${gr},${gg},${gb})`
  ctx.fillRect(0, 0, w, h)

  // 3. restore the silhouette (multiply above made the whole rect opaque)
  ctx.globalCompositeOperation = 'destination-in'
  ctx.drawImage(src, 0, 0)

  ctx.globalCompositeOperation = 'source-over'
  return out
}

// ─── Scene composition ─────────────────────────────────────────────────────────

function resolveWindowSize(s: ComposeOptions['windowSize']): WindowSize {
  if (!s) return WINDOW_SIZES.medium
  return typeof s === 'string' ? WINDOW_SIZES[s] : s
}

/**
 * Compose the full scene onto the display canvas.
 * All drawing is in native canvas pixels — reset any DPR scale before calling.
 */
export function composeScene(canvas: HTMLCanvasElement, opts: ComposeOptions): void {
  const ctx = canvas.getContext('2d')!
  const W = canvas.width
  const H = canvas.height

  const rodH       = opts.rodH ?? 9
  const panelWFrac = opts.panelWFrac ?? 0.20
  const gain       = Math.max(1, Math.min(1.4, opts.tintGain ?? 1))
  const size       = resolveWindowSize(opts.windowSize)

  ctx.setTransform(1, 0, 0, 1, 0, 0)
  ctx.clearRect(0, 0, W, H)

  // ── Layer 0: wall ──────────────────────────────────────────────────────────
  ctx.fillStyle = opts.wallHex
  ctx.fillRect(0, 0, W, H)
  applyWallLighting(ctx, W, H)

  // ── Layer 1: window / door ──────────────────────────────────────────────────
  const winW = Math.round(W * size.wFrac)
  const winH = Math.round(H * size.hFrac)
  const winX = Math.round((W - winW) / 2)
  const winY = Math.round(rodH + (H - rodH - winH) * 0.42)   // sit slightly high
  drawWindow(ctx, winX, winY, winW, winH)

  // ── Panel geometry ───────────────────────────────────────────────────────────
  const panelW = Math.round(W * panelWFrac)
  const panelH = H - rodH

  // ── Layer 2: cast shadow (optional) ─────────────────────────────────────────
  if (opts.shadow) {
    drawPanelLayer(ctx, opts.shadow, 'left',  0,          rodH, panelW, panelH, 0.9)
    drawPanelLayer(ctx, opts.shadow, 'right', W - panelW, rodH, panelW, panelH, 0.9)
  }

  // ── Layer 3: recoloured curtain panels ──────────────────────────────────────
  const leftTinted  = tintPanel(opts.leftPanel, opts.fabricHex, gain)
  const rightSource = opts.rightPanel ?? opts.leftPanel
  const rightTinted = opts.rightPanel
    ? tintPanel(rightSource, opts.fabricHex, gain)
    : leftTinted   // reuse: mirroring is handled at draw time

  drawPanelLayer(ctx, leftTinted,  'left',  0,          rodH, panelW, panelH, 1)
  drawPanelLayer(ctx, rightTinted, 'right', W - panelW, rodH, panelW, panelH, 1)

  // ── Rod on top ───────────────────────────────────────────────────────────────
  drawRod(ctx, W, panelW, rodH)
}

/**
 * Draw one panel source into a target rect, scaled to fit, optionally mirrored.
 * The left render is authored "gathering toward the right (window) edge"; the
 * right side reuses it flipped horizontally.
 */
function drawPanelLayer(
  ctx:    CanvasRenderingContext2D,
  src:    PanelSource,
  side:   'left' | 'right',
  x:      number,
  y:      number,
  w:      number,
  h:      number,
  alpha:  number,
): void {
  ctx.save()
  ctx.globalAlpha = alpha
  if (side === 'right') {
    ctx.translate(x + w, y)
    ctx.scale(-1, 1)
    ctx.drawImage(src, 0, 0, w, h)
  } else {
    ctx.drawImage(src, x, y, w, h)
  }
  ctx.restore()
}

// ─── Placeholder curtain (stand-in for the Blender `_lum` render) ─────────────

export interface PlaceholderOpts {
  folds?:   number   // number of primary pleats across the panel
  baseLum?: number   // lit-midtone brightness 0..1 (authored high so multiply reads true)
}

/**
 * Generate a neutral grayscale curtain panel that obeys the Blender `_lum`
 * contract: transparent background, silhouette in alpha, upper-left lighting,
 * folds baked into luminance. Purely a stand-in until real renders land.
 *
 * Authored as a LEFT panel (folds gather toward the right/window edge).
 */
export function makePlaceholderPanel(w = 512, h = 1024, opts: PlaceholderOpts = {}): HTMLCanvasElement {
  const folds   = opts.folds   ?? 5
  const baseLum = opts.baseLum ?? 0.90

  const c   = makeCanvas(w, h)
  const ctx = c.getContext('2d')!
  const img = ctx.createImageData(w, h)
  const d   = img.data

  const headerH = Math.floor(h * 0.072)
  const edgeFade = Math.max(6, Math.floor(w * 0.05))

  for (let x = 0; x < w; x++) {
    // t: fold position across panel (0 = window/right edge, 1 = wall/left edge)
    const t = 1 - x / Math.max(1, w - 1)

    // Primary pleats + fine secondary ripple → fold factor
    const pWave = 0.5 + 0.5 * Math.sin(t * 2 * Math.PI * folds - Math.PI / 2)
    const sWave = 0.5 + 0.5 * Math.sin(t * 2 * Math.PI * folds * 4.4)
    const fold  = (0.55 + 0.45 * pWave) * (0.965 + 0.035 * sWave)

    // Inner (window-side) edge fades to transparent so it blends with the scene
    const innerDist = w - x
    const edgeAlpha = Math.min(1, innerDist / edgeFade)

    for (let y = 0; y < h; y++) {
      const idx = (y * w + x) * 4

      // Vertical light falloff — brighter up top (upper-left key), softer at hem
      const vy = 1 - 0.16 * (y / h)

      // Header tape reads darker with a fine pleat stripe
      let lum = baseLum * fold * vy
      if (y < headerH) {
        const period   = Math.max(1, Math.floor(w / 10))
        const pleatPos = (x % period) / period
        lum *= 0.62 + 0.30 * Math.abs(Math.sin(pleatPos * Math.PI * 10))
      }

      // Micro grain so the tinted result isn't glassy-flat
      const grain = ((Math.sin(x * 12.9898 + y * 78.233) * 43758.5453) % 1) * 0.04 - 0.02

      const v = clamp255((lum + grain) * 255)
      d[idx]     = v
      d[idx + 1] = v
      d[idx + 2] = v
      d[idx + 3] = clamp255(edgeAlpha * 255)
    }
  }

  ctx.putImageData(img, 0, 0)
  return c
}

// ─── Procedural wall + window + rod (kept lightweight for v1) ──────────────────

/** Soft radial vignette + upper-left key so the flat wall fill reads as a room. */
function applyWallLighting(ctx: CanvasRenderingContext2D, W: number, H: number): void {
  const key = ctx.createRadialGradient(W * 0.3, H * 0.22, 0, W * 0.3, H * 0.22, Math.max(W, H) * 0.95)
  key.addColorStop(0, 'rgba(255,255,255,0.10)')
  key.addColorStop(0.5, 'rgba(255,255,255,0.0)')
  key.addColorStop(1, 'rgba(0,0,0,0.16)')
  ctx.fillStyle = key
  ctx.fillRect(0, 0, W, H)
}

/**
 * Minimal procedural window (frame + glass) for the demo. Production will
 * delegate to the richer drawWindowStructure() in curtainRenderer.ts, sized
 * from WindowSize instead of the fixed 20% panel assumption.
 */
function drawWindow(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number): void {
  const frameW = Math.max(7, Math.round(w * 0.028))

  // Recess shadow so the frame sits in the wall
  ctx.save()
  ctx.shadowColor = 'rgba(0,0,0,0.35)'
  ctx.shadowBlur = 14
  ctx.shadowOffsetY = 5
  ctx.fillStyle = '#C8C0AC'
  ctx.fillRect(x, y, w, h)
  ctx.restore()

  // Glass aperture — recessed sky-to-earth gradient
  const gx = x + frameW, gy = y + frameW
  const gw = w - frameW * 2, gh = h - frameW * 2
  if (gw <= 0 || gh <= 0) return

  const sky = ctx.createLinearGradient(gx, gy, gx, gy + gh)
  sky.addColorStop(0.0, '#3A5A8C')
  sky.addColorStop(0.4, '#6EA8D0')
  sky.addColorStop(0.62, '#B8D4E6')
  sky.addColorStop(0.8, '#C8C09A')
  sky.addColorStop(1.0, '#7A6548')
  ctx.fillStyle = sky
  ctx.fillRect(gx, gy, gw, gh)

  // Glass sheen
  ctx.fillStyle = 'rgba(255,255,255,0.14)'
  ctx.beginPath()
  ctx.moveTo(gx, gy)
  ctx.lineTo(gx + gw * 0.6, gy)
  ctx.lineTo(gx, gy + gh * 0.5)
  ctx.closePath()
  ctx.fill()

  // Inner recess bevel
  ctx.strokeStyle = 'rgba(0,0,0,0.45)'
  ctx.lineWidth = 1
  ctx.strokeRect(gx + 0.5, gy + 0.5, gw - 1, gh - 1)
}

/** Brushed-gold rod across the top. */
function drawRod(ctx: CanvasRenderingContext2D, W: number, panelW: number, rodH: number): void {
  const rg = ctx.createLinearGradient(0, 0, 0, rodH)
  rg.addColorStop(0, '#F8EEB8')
  rg.addColorStop(0.3, '#D4A838')
  rg.addColorStop(0.68, '#9C7020')
  rg.addColorStop(1, '#5E3C0A')
  ctx.fillStyle = rg
  ctx.fillRect(0, 0, W, rodH)

  const finialR = rodH * 0.92
  for (const capX of [finialR, W - finialR]) {
    const cg = ctx.createRadialGradient(capX - finialR * 0.28, rodH * 0.28, 0, capX, rodH * 0.5, finialR)
    cg.addColorStop(0, '#FFFACC')
    cg.addColorStop(0.45, '#C9A030')
    cg.addColorStop(1, '#4A2E06')
    ctx.fillStyle = cg
    ctx.beginPath()
    ctx.arc(capX, rodH * 0.5, finialR, 0, Math.PI * 2)
    ctx.fill()
  }

  void panelW  // reserved: per-panel ring placement will return with real assets
}

// ─── Convenience: compose using an internally-generated placeholder ────────────

/**
 * One-call demo helper: builds a placeholder panel and composes the scene.
 * Lets a preview surface show the full pipeline before any Blender asset exists.
 */
export function composeWithPlaceholder(
  canvas: HTMLCanvasElement,
  opts: { wallHex: string; fabricHex: string; windowSize?: ComposeOptions['windowSize'] },
): void {
  const panel = makePlaceholderPanel(512, 1024)
  composeScene(canvas, {
    wallHex:    opts.wallHex,
    fabricHex:  opts.fabricHex,
    leftPanel:  panel,
    windowSize: opts.windowSize,
    tintGain:   1,   // placeholder is authored bright → no compensation needed
  })
}
