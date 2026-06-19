/**
 * Canvas renderer — draws a user's room photo with curtain panels overlaid.
 *
 * Design decision: curtains frame a window from the SIDES, so we draw two
 * vertical fabric panels at the left and right edges of the photo.
 * We do NOT try to detect the window — no computer vision needed.
 *
 * Fold shading (per spec):
 *   Each curtain panel is drawn one pixel column at a time.
 *   For column at position t (0→1 across the panel width):
 *
 *     factor = 0.70 + 0.32 × (0.5 + 0.5 × sin(t × 2π × FOLDS − π/2))
 *
 *   The sin term oscillates 0→1, so factor oscillates 0.70 → 1.02.
 *   Clamped to [0, 255] at the channel level.
 *   This creates a realistic pleating effect: shadowed troughs at 0.70 brightness,
 *   highlighted crests near 1.0. FOLDS=5 gives 5 repeating pleats per panel.
 */

const PANEL_FRACTION = 0.20  // each panel occupies 20% of the photo width
const FOLDS          = 5     // number of fold cycles across each panel
const ROD_HEIGHT_PX  = 6     // curtain rod bar drawn at very top of canvas

function clamp255(v: number): number {
  return Math.max(0, Math.min(255, Math.round(v)))
}

function parseHex(hex: string): [number, number, number] {
  const h = hex.replace('#', '')
  return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)]
}

/**
 * Draw the photo and (optionally) curtain panels to a display canvas.
 *
 * @param canvas     The canvas shown to the user.
 * @param img        The loaded photo <img> element.
 * @param fabricHex  Selected fabric colour (#RRGGBB), or null for photo-only.
 */
export function drawScene(
  canvas: HTMLCanvasElement,
  img:    HTMLImageElement,
  fabricHex: string | null,
): void {
  const ctx = canvas.getContext('2d')!
  const W   = canvas.width
  const H   = canvas.height

  // Always start by drawing the clean photo
  ctx.drawImage(img, 0, 0, W, H)

  if (!fabricHex) return

  const [fr, fg, fb] = parseHex(fabricHex)
  const panelW       = Math.floor(W * PANEL_FRACTION)

  for (const side of ['left', 'right'] as const) {
    const panelStartX = side === 'left' ? 0 : W - panelW
    const panelEndX   = side === 'left' ? panelW : W

    // ── Fold-shaded fabric fill ───────────────────────────────────────────
    // Draw column by column so shading can vary per pixel column
    for (let px = panelStartX; px < panelEndX; px++) {
      // t: position across the panel, 0→1
      // Left panel:  t=1 at the left wall, t=0 at the inner edge (window side)
      // Right panel: t=0 at the inner edge, t=1 at the right wall
      // This makes shadows appear consistently at the wall edge of each panel
      const t = side === 'left'
        ? 1 - (px - panelStartX) / panelW
        :     (px - panelStartX) / panelW

      // Fold shading factor (see module comment)
      const sinTerm = 0.5 + 0.5 * Math.sin(t * 2 * Math.PI * FOLDS - Math.PI / 2)
      const factor  = 0.70 + 0.32 * sinTerm  // 0.70 → 1.02

      ctx.fillStyle = `rgb(${clamp255(fr * factor)},${clamp255(fg * factor)},${clamp255(fb * factor)})`
      ctx.fillRect(px, ROD_HEIGHT_PX, 1, H - ROD_HEIGHT_PX)
    }

    // ── Header band — pleated top, ~6% height ────────────────────────────
    // The fabric gathers into a denser, slightly darker band at the top
    // where it connects to the rings. Adds realism and definition.
    const headerH = Math.floor(H * 0.06)
    ctx.fillStyle = 'rgba(0,0,0,0.22)'
    ctx.fillRect(panelStartX, ROD_HEIGHT_PX, panelW, headerH)

    // ── Inner shadow — where panel meets open space ───────────────────────
    // A gradient from transparent to semi-black along the inner 14px edge.
    // Separates the curtain from the room visually.
    const shadowW = Math.min(14, panelW)
    const shadowX = side === 'left' ? panelEndX - shadowW : panelStartX
    const grad = ctx.createLinearGradient(
      side === 'left' ? shadowX + shadowW : shadowX, 0,
      side === 'left' ? shadowX           : shadowX + shadowW, 0,
    )
    grad.addColorStop(0, 'rgba(0,0,0,0)')
    grad.addColorStop(1, 'rgba(0,0,0,0.30)')
    ctx.fillStyle = grad
    ctx.fillRect(shadowX, ROD_HEIGHT_PX, shadowW, H - ROD_HEIGHT_PX)
  }

  // ── Curtain rod — thin gold bar across full width at the very top ─────
  const rodGrad = ctx.createLinearGradient(0, 0, 0, ROD_HEIGHT_PX)
  rodGrad.addColorStop(0,   '#F0D88A')
  rodGrad.addColorStop(0.5, '#C9A84C')
  rodGrad.addColorStop(1,   '#7A5C18')
  ctx.fillStyle = rodGrad
  ctx.fillRect(0, 0, W, ROD_HEIGHT_PX)
}

/**
 * Copy the photo to an offscreen canvas at its native resolution.
 * This canvas is NEVER drawn to again — it stays clean so that
 * colour sampling always reads original wall/room pixels even after
 * curtain panels have been drawn on the display canvas.
 */
export function initOffscreen(
  offscreen: HTMLCanvasElement,
  img:       HTMLImageElement,
): void {
  offscreen.width  = img.naturalWidth
  offscreen.height = img.naturalHeight
  offscreen.getContext('2d')!.drawImage(img, 0, 0)
}
