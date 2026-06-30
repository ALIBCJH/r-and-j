/**
 * Premium canvas renderer for the R&J mobile fabric matcher — v2.
 *
 * Improvements over v1 (simple sine-wave colour wash):
 *
 *  Multi-layer fold shading
 *    Primary wave  (5 pleats)  — large shadowed/highlighted bands
 *    Secondary ripple (22 cycles) — fine texture on each pleat
 *    Both combined make the fabric look three-dimensional.
 *
 *  Cool shadow tint
 *    Dark fold areas pick up a bluish-grey cast (ambient room/sky light),
 *    not just a darker version of the fabric colour. Real fabric does this.
 *
 *  Grain texture
 *    A fast lookup-table grain pass after fold drawing simulates
 *    the micro-texture of woven material. Runs via getImageData / putImageData.
 *
 *  Inner edge fade
 *    The leading edge of each panel (closest to the window opening)
 *    fades to transparent so it blends with the photo rather than
 *    cutting hard across the room.
 *
 *  Wall shadow
 *    A soft drop-shadow bleeds outward from each panel edge, making the
 *    curtain appear to hang in front of the wall.
 *
 *  Premium rod + rings
 *    A brushed-gold gradient bar with individual ring circles (radial-gradient
 *    with specular highlight) and spherical end-cap finials.
 *
 *  IMPORTANT: drawScene resets the canvas transform at the top.
 *  All coordinates are in native canvas pixels (canvas.width / canvas.height).
 *  Do NOT call ctx.scale() before drawScene — it will be undone.
 */

// ─── Constants ────────────────────────────────────────────────────────────────

const PANEL_FRACTION   = 0.20   // each panel = 20% of canvas width
const FOLDS_PRIMARY    = 5      // large pleat cycles
const FOLDS_SECONDARY  = 22     // fine ripple cycles on each pleat
const PLEAT_RINGS      = 8      // curtain rings per panel
const ROD_H            = 9      // rod bar height in native canvas px
const HEADER_FRAC      = 0.072  // pleated header = 7.2% of panel height
const EDGE_FADE_PX     = 14     // inner-edge fade width (native px)
const WALL_SHADOW_PX   = 24     // drop-shadow width beside panel (native px)

// ─── Grain lookup table ───────────────────────────────────────────────────────
// Pre-computed at module load so zero trig at render time.
// 512 values, indexed by (x*3 + y*5) & 511 for non-repeating appearance.
const GRAIN = (() => {
  const t: number[] = []
  for (let i = 0; i < 512; i++) {
    const v = Math.sin(i * 127.1 + 311.7) * 43758.5453
    t.push((v - Math.floor(v) - 0.5) * 14)  // centred, ±7 brightness units
  }
  return t
})()

// ─── Helpers ─────────────────────────────────────────────────────────────────

function clamp255(v: number): number {
  return Math.max(0, Math.min(255, Math.round(v)))
}

function parseHex(hex: string): [number, number, number] {
  const h = hex.replace('#', '')
  return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)]
}

function grainAt(x: number, y: number): number {
  return GRAIN[(x * 3 + y * 5) & 511]
}

// ─── Public API ───────────────────────────────────────────────────────────────

export type WindowProfile = 'minimalist' | 'classic' | 'doubleHung'

/**
 * Draw the photo and (optionally) curtain panels onto the display canvas.
 *
 * @param canvas     The canvas shown to the user (native resolution, no DPR scale).
 * @param img        The loaded photo HTMLImageElement.
 * @param fabricHex  Selected fabric colour (#RRGGBB), or null for photo-only.
 * @param profile    Optional window profile — draws an architectural frame over the photo.
 */
export function drawScene(
  canvas:    HTMLCanvasElement,
  img:       HTMLImageElement,
  fabricHex: string | null,
  profile?:  WindowProfile,
): void {
  const ctx = canvas.getContext('2d')!
  const W   = canvas.width   // native pixels
  const H   = canvas.height  // native pixels

  // Reset any lingering DPR scale — we always draw in native pixel space
  ctx.setTransform(1, 0, 0, 1, 0, 0)

  // Photo first — always the base layer
  ctx.drawImage(img, 0, 0, W, H)

  // Window frame overlay — drawn over photo, beneath curtain panels
  if (profile) drawWindowStructure(ctx, W, H, ROD_H, Math.floor(W * PANEL_FRACTION), profile)

  if (!fabricHex) return

  const [fr, fg, fb] = parseHex(fabricHex)
  const panelW  = Math.floor(W * PANEL_FRACTION)
  const headerH = Math.floor((H - ROD_H) * HEADER_FRAC)

  for (const side of ['left', 'right'] as const) {
    const x0 = side === 'left' ? 0 : W - panelW   // panel left edge (native)
    const x1 = side === 'left' ? panelW : W         // panel right edge

    // ── Step 1: Fold shading — column by column ───────────────────────────
    for (let col = x0; col < x1; col++) {
      const relCol = col - x0   // 0 … panelW-1

      // t: fold position across the panel (0=window-side, 1=wall-side)
      const t = side === 'left'
        ? 1 - relCol / Math.max(1, panelW - 1)
        : relCol / Math.max(1, panelW - 1)

      // Primary fold — 5 large pleat waves
      const pWave   = 0.5 + 0.5 * Math.sin(t * 2 * Math.PI * FOLDS_PRIMARY - Math.PI / 2)
      const pFactor = 0.54 + 0.46 * pWave    // 0.54 (deep shadow) → 1.00 (highlight)

      // Secondary ripple — finer woven texture on each primary pleat
      const sWave   = 0.5 + 0.5 * Math.sin(t * 2 * Math.PI * FOLDS_SECONDARY)
      const sFactor = 0.956 + 0.044 * sWave  // ±4.4%

      const factor    = Math.min(1.0, pFactor * sFactor)
      const shadowDeg = Math.max(0, (0.74 - factor) / 0.74)  // 0=lit, 1=deepest shadow

      // Base fabric colour at this shading level
      let r = fr * factor
      let g = fg * factor
      let b = fb * factor

      // Cool shadow tint — dark folds absorb warm light and reflect cool ambient
      if (shadowDeg > 0) {
        const s = shadowDeg * 0.26
        r = r * (1 - s) + 20 * s
        g = g * (1 - s) + 28 * s
        b = b * (1 - s) + 62 * s
      }

      // Inner-edge alpha fade: panel leading edge blends into the photo
      const innerDist = side === 'left' ? x1 - col : col - x0 + 1
      const edgeAlpha = Math.min(1.0, innerDist / EDGE_FADE_PX)

      // Main panel fill
      ctx.fillStyle = `rgba(${clamp255(r)},${clamp255(g)},${clamp255(b)},${(edgeAlpha * 0.93).toFixed(3)})`
      ctx.fillRect(col, ROD_H, 1, H - ROD_H)

      // Pleated header tape — darker with pleat-fold stripe pattern
      if (headerH > 0) {
        const period    = Math.max(1, Math.floor(panelW / 10))
        const pleatPos  = (relCol % period) / period
        const pleatDark = 0.58 + 0.42 * Math.abs(Math.sin(pleatPos * Math.PI * 10))
        const alpha     = (1 - pleatDark) * 0.78 * edgeAlpha
        if (alpha > 0.008) {
          ctx.fillStyle = `rgba(0,0,0,${alpha.toFixed(3)})`
          ctx.fillRect(col, ROD_H, 1, headerH)
        }
      }
    }

    // ── Step 2: Grain texture (getImageData → add noise → putImageData) ──
    // Reads the panel pixels already drawn, adds per-pixel brightness noise,
    // then writes back. Simulates the micro-texture of woven fabric.
    const gW = Math.min(panelW, W - x0)
    const gH = H - ROD_H
    if (gW > 0 && gH > 0) {
      const imgData = ctx.getImageData(x0, ROD_H, gW, gH)
      const d       = imgData.data
      for (let row = 0; row < gH; row++) {
        for (let col = 0; col < gW; col++) {
          const idx = (row * gW + col) * 4
          if (d[idx + 3] < 18) continue  // skip near-transparent edge area
          const gv = grainAt(x0 + col, row)
          d[idx]     = clamp255(d[idx]     + gv)
          d[idx + 1] = clamp255(d[idx + 1] + gv)
          d[idx + 2] = clamp255(d[idx + 2] + gv)
        }
      }
      ctx.putImageData(imgData, x0, ROD_H)
    }

    // ── Step 3: Wall shadow — soft drop beside the panel ─────────────────
    // Makes the curtain appear to hang in front of the wall.
    const shadowX = side === 'left' ? x1 : x0 - WALL_SHADOW_PX
    const sgStart = side === 'left' ? shadowX + WALL_SHADOW_PX : shadowX
    const sgEnd   = side === 'left' ? shadowX : shadowX + WALL_SHADOW_PX
    const sg      = ctx.createLinearGradient(sgStart, 0, sgEnd, 0)
    sg.addColorStop(0, 'rgba(0,0,0,0)')
    sg.addColorStop(1, 'rgba(0,0,0,0.26)')
    ctx.fillStyle = sg
    ctx.fillRect(shadowX, ROD_H, WALL_SHADOW_PX, H - ROD_H)
  }

  // ── Rod + rings ───────────────────────────────────────────────────────────
  drawRod(ctx, W, panelW)
}

function drawRod(ctx: CanvasRenderingContext2D, W: number, panelW: number): void {
  // ── Rod body — brushed gold gradient ─────────────────────────────────────
  const rg = ctx.createLinearGradient(0, 0, 0, ROD_H)
  rg.addColorStop(0,    '#F8EEB8')
  rg.addColorStop(0.30, '#D4A838')
  rg.addColorStop(0.68, '#9C7020')
  rg.addColorStop(1,    '#5E3C0A')
  ctx.fillStyle = rg
  ctx.fillRect(0, 0, W, ROD_H)

  // ── End-cap finials — spherical gold balls ────────────────────────────────
  const finialR = ROD_H * 0.92
  for (const capX of [finialR, W - finialR]) {
    const cg = ctx.createRadialGradient(
      capX - finialR * 0.28, ROD_H * 0.28, 0,
      capX, ROD_H * 0.5, finialR,
    )
    cg.addColorStop(0,    '#FFFACC')
    cg.addColorStop(0.45, '#C9A030')
    cg.addColorStop(1,    '#4A2E06')
    ctx.fillStyle = cg
    ctx.beginPath()
    ctx.arc(capX, ROD_H * 0.5, finialR, 0, Math.PI * 2)
    ctx.fill()
  }

  // ── Curtain rings — one per equal division across each panel ─────────────
  const rr          = ROD_H * 0.50   // ring radius
  const ringSpacing = panelW / PLEAT_RINGS

  for (const panelX0 of [0, W - panelW]) {
    for (let i = 0; i < PLEAT_RINGS; i++) {
      const rx = panelX0 + (i + 0.5) * ringSpacing
      const ry = ROD_H * 0.50

      // Drop shadow
      ctx.fillStyle = 'rgba(0,0,0,0.38)'
      ctx.beginPath()
      ctx.arc(rx, ry + rr * 0.32, rr, 0, Math.PI * 2)
      ctx.fill()

      // Ring body — radial gold gradient
      const rg2 = ctx.createRadialGradient(
        rx - rr * 0.22, ry - rr * 0.22, 0,
        rx, ry, rr,
      )
      rg2.addColorStop(0,    '#FFF0A8')
      rg2.addColorStop(0.55, '#C89830')
      rg2.addColorStop(1,    '#6A4410')
      ctx.fillStyle = rg2
      ctx.beginPath()
      ctx.arc(rx, ry, rr, 0, Math.PI * 2)
      ctx.fill()

      // Specular highlight — small bright spot
      ctx.fillStyle = 'rgba(255,255,210,0.82)'
      ctx.beginPath()
      ctx.arc(rx - rr * 0.30, ry - rr * 0.30, rr * 0.26, 0, Math.PI * 2)
      ctx.fill()
    }
  }
}

// ─── Window structure ─────────────────────────────────────────────────────────

// Renders a single glass pane: sky-to-ground gradient + double-pane sheen.
function drawPane(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number): void {
  const rx = Math.round(x), ry = Math.round(y)
  const rw = Math.round(w), rh = Math.round(h)
  if (rw <= 0 || rh <= 0) return

  ctx.save()
  ctx.beginPath()
  ctx.rect(rx, ry, rw, rh)
  ctx.clip()

  // Exterior sky-to-earth gradient — desaturated for a recessed exterior feel
  const sky = ctx.createLinearGradient(rx, ry, rx, ry + rh)
  sky.addColorStop(0.00, '#3A5A8C')
  sky.addColorStop(0.38, '#6EA8D0')
  sky.addColorStop(0.62, '#B8D4E6')
  sky.addColorStop(0.80, '#C8C09A')
  sky.addColorStop(1.00, '#7A6548')
  ctx.fillStyle = sky
  ctx.fillRect(rx, ry, rw, rh)

  // Double-pane refraction — sheen layer 1 (primary)
  const g1 = ctx.createLinearGradient(rx, ry, rx + rw * 0.44, ry + rh * 0.38)
  g1.addColorStop(0, 'rgba(255,255,255,0.18)')
  g1.addColorStop(1, 'rgba(255,255,255,0.00)')
  ctx.fillStyle = g1
  ctx.beginPath()
  ctx.moveTo(rx,              ry)
  ctx.lineTo(rx + rw * 0.62, ry)
  ctx.lineTo(rx,              ry + rh * 0.50)
  ctx.closePath()
  ctx.fill()

  // Double-pane refraction — sheen layer 2 offset 4px (simulates glass thickness)
  const g2 = ctx.createLinearGradient(rx + 4, ry, rx + rw * 0.44 + 4, ry + rh * 0.38)
  g2.addColorStop(0, 'rgba(255,255,255,0.11)')
  g2.addColorStop(1, 'rgba(255,255,255,0.00)')
  ctx.fillStyle = g2
  ctx.beginPath()
  ctx.moveTo(rx + 4,              ry)
  ctx.lineTo(rx + rw * 0.62 + 4, ry)
  ctx.lineTo(rx + 4,              ry + rh * 0.50)
  ctx.closePath()
  ctx.fill()

  ctx.restore()
}

// Renders a single muntin or sash rail with beveled catch-light and micro-shadow.
function drawMuntin(
  ctx:   CanvasRenderingContext2D,
  x:     number,
  y:     number,
  w:     number,
  h:     number,
  color: string,
): void {
  const rx = Math.round(x), ry = Math.round(y)
  const rw = Math.round(w), rh = Math.round(h)
  if (rw <= 0 || rh <= 0) return

  ctx.fillStyle = color
  ctx.fillRect(rx, ry, rw, rh)

  // Top / left catch-light — ambient light from upper-left
  ctx.strokeStyle = 'rgba(255,255,255,0.20)'
  ctx.lineWidth   = 1
  ctx.beginPath()
  ctx.moveTo(rx,      ry + rh); ctx.lineTo(rx,      ry)
  ctx.moveTo(rx,      ry);      ctx.lineTo(rx + rw, ry)
  ctx.stroke()

  // Bottom / right micro-shadow — anchors the member in depth
  ctx.strokeStyle = 'rgba(0,0,0,0.50)'
  ctx.lineWidth   = 1
  ctx.beginPath()
  ctx.moveTo(rx,      ry + rh); ctx.lineTo(rx + rw, ry + rh)
  ctx.moveTo(rx + rw, ry);      ctx.lineTo(rx + rw, ry + rh)
  ctx.stroke()
}

function drawWindowStructure(
  ctx:    CanvasRenderingContext2D,
  W:      number,
  H:      number,
  rodH:   number,
  panelW: number,
  style:  WindowProfile,
): void {
  const wx = Math.round(panelW)
  const wy = Math.round(rodH)
  const ww = Math.round(W - panelW * 2)
  const wh = Math.round(H - rodH)

  ctx.save()

  let frameColor: string
  let frameW: number

  switch (style) {
    case 'minimalist':
      frameColor = '#1A1A1A'
      frameW     = Math.max(8, Math.round(ww * 0.030))
      break
    case 'classic':
      frameColor = '#D4CCBA'
      frameW     = Math.max(7, Math.round(ww * 0.024))
      break
    default: // doubleHung
      frameColor = '#C8C0AC'
      frameW     = Math.max(7, Math.round(ww * 0.026))
  }

  // Glass aperture — inset from the casing on all sides
  const gx = wx + frameW
  const gy = wy + frameW
  const gw = ww - frameW * 2
  const gh = wh - frameW * 2

  if (gw <= 0 || gh <= 0) { ctx.restore(); return }

  // ── 1. Recessed AO: casing cast with shadow that spills into the glass ────
  ctx.shadowColor   = 'rgba(0,0,0,0.40)'
  ctx.shadowBlur    = 12
  ctx.shadowOffsetX = 0
  ctx.shadowOffsetY = 4

  ctx.beginPath()
  ctx.rect(wx, wy, ww, wh)  // outer casing bound
  ctx.rect(gx, gy, gw, gh)  // glass aperture cutout
  ctx.fillStyle = frameColor
  ctx.fill('evenodd')

  // Disable shadow before bevels — crisp lines must not blur
  ctx.shadowColor   = 'rgba(0,0,0,0)'
  ctx.shadowBlur    = 0
  ctx.shadowOffsetY = 0

  // ── 2. Structural bevel — four-edge catch-lights and micro-shadows ────────
  ctx.lineWidth = 1

  // Outer face: top + left catch ambient light
  ctx.strokeStyle = 'rgba(255,255,255,0.12)'
  ctx.beginPath()
  ctx.moveTo(wx,      wy + wh); ctx.lineTo(wx,      wy)
  ctx.moveTo(wx,      wy);      ctx.lineTo(wx + ww, wy)
  ctx.stroke()

  // Outer face: bottom + right sit in shadow
  ctx.strokeStyle = 'rgba(0,0,0,0.30)'
  ctx.beginPath()
  ctx.moveTo(wx,      wy + wh); ctx.lineTo(wx + ww, wy + wh)
  ctx.moveTo(wx + ww, wy);      ctx.lineTo(wx + ww, wy + wh)
  ctx.stroke()

  // Inner aperture: top + left pick up wall ambient bounce
  ctx.strokeStyle = 'rgba(255,255,255,0.20)'
  ctx.beginPath()
  ctx.moveTo(gx,      gy + gh); ctx.lineTo(gx,      gy)
  ctx.moveTo(gx,      gy);      ctx.lineTo(gx + gw, gy)
  ctx.stroke()

  // Inner aperture: bottom + right sit in the recess shadow
  ctx.strokeStyle = 'rgba(0,0,0,0.50)'
  ctx.beginPath()
  ctx.moveTo(gx,      gy + gh); ctx.lineTo(gx + gw, gy + gh)
  ctx.moveTo(gx + gw, gy);      ctx.lineTo(gx + gw, gy + gh)
  ctx.stroke()

  // ── 3. Glass panes + beveled muntins per architectural style ──────────────
  if (style === 'minimalist') {
    drawPane(ctx, gx, gy, gw, gh)

  } else if (style === 'classic') {
    const COLS = 3, ROWS = 2
    const mw   = Math.max(4, Math.round(ww * 0.012))
    const pw   = Math.round((gw - mw * (COLS - 1)) / COLS)
    const ph   = Math.round((gh - mw * (ROWS - 1)) / ROWS)

    for (let row = 0; row < ROWS; row++) {
      for (let col = 0; col < COLS; col++) {
        drawPane(ctx, gx + col * (pw + mw), gy + row * (ph + mw), pw, ph)
      }
    }
    for (let col = 1; col < COLS; col++) {
      drawMuntin(ctx, gx + col * pw + (col - 1) * mw, gy, mw, gh, frameColor)
    }
    for (let row = 1; row < ROWS; row++) {
      drawMuntin(ctx, gx, gy + row * ph + (row - 1) * mw, gw, mw, frameColor)
    }
    // Outer molding accent — delicate secondary line outside the casing
    ctx.strokeStyle = 'rgba(200,192,172,0.40)'
    ctx.lineWidth   = 1.5
    ctx.strokeRect(wx - 2.5, wy - 2.5, ww + 5, wh + 5)

  } else {
    // doubleHung — two sashes meeting at mid-height with overlap rail illusion
    const midH  = Math.round(gh * 0.5)
    const railW = Math.max(5, Math.round(gh * 0.025))
    const mw    = Math.max(3, Math.round(ww * 0.010))
    const halfW = Math.round((gw - mw) / 2)

    const topH = midH - Math.round(railW / 2)
    const botY = gy + midH + Math.round(railW / 2)
    const botH = gh - midH - Math.round(railW / 2)

    // Four panes (2 upper, 2 lower)
    drawPane(ctx, gx,              gy,   halfW, topH)
    drawPane(ctx, gx + halfW + mw, gy,   halfW, topH)
    drawPane(ctx, gx,              botY, halfW, botH)
    drawPane(ctx, gx + halfW + mw, botY, halfW, botH)

    // Center vertical muntin spans full glass height
    drawMuntin(ctx, gx + halfW, gy, mw, gh, frameColor)

    // Horizontal meeting rail (thicker — sash overlap illusion)
    drawMuntin(ctx, gx, gy + midH - Math.round(railW / 2), gw, railW, frameColor)

    // Thin depth line at the bottom of the rail — lower sash sits proud
    ctx.strokeStyle = 'rgba(0,0,0,0.28)'
    ctx.lineWidth   = 1
    ctx.beginPath()
    ctx.moveTo(Math.round(gx),      Math.round(botY))
    ctx.lineTo(Math.round(gx + gw), Math.round(botY))
    ctx.stroke()
  }

  ctx.restore()
}

// ─── Offscreen copy ───────────────────────────────────────────────────────────

/**
 * Copy the photo to an offscreen canvas at its native resolution.
 * This canvas is NEVER drawn to again — colour sampling always reads
 * original wall pixels even after curtains are drawn on the display canvas.
 */
export function initOffscreen(
  offscreen: HTMLCanvasElement,
  img:       HTMLImageElement,
): void {
  offscreen.width  = img.naturalWidth
  offscreen.height = img.naturalHeight
  offscreen.getContext('2d')!.drawImage(img, 0, 0)
}
