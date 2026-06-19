/**
 * Colour engine for the R&J mobile fabric matcher.
 *
 * Three responsibilities:
 *  1. Sample a wall colour from a canvas.
 *  2. RGB ↔ HSL conversion (written out explicitly, no external deps).
 *  3. Generate five ordered fabric recommendations from the wall colour.
 *
 * All colour math comments explain the why, not just the what.
 */

// ─── Catalog fabrics ─────────────────────────────────────────────────────────
// The actual fabrics R&J sells. Recommendations try to match to real products
// so the user can immediately ask for a specific fabric by name.
export const CATALOG_FABRICS = [
  { name: 'Ivory Veil',      collection: 'ESSENTIALS · NO. 01', hex: '#F0EBE0', fabric: 'sheer'  },
  { name: 'Pale Linen',      collection: 'ESSENTIALS · NO. 02', hex: '#E8DCC8', fabric: 'linen'  },
  { name: 'Desert Sand',     collection: 'WARMTH · NO. 03',     hex: '#D4B896', fabric: 'linen'  },
  { name: 'Gilded Silk',     collection: 'SUNSTONE · NO. 07',   hex: '#C8A070', fabric: 'velvet' },
  { name: 'Dusty Rose',      collection: 'BLOOM · NO. 04',      hex: '#C49890', fabric: 'cotton' },
  { name: 'Blush Voile',     collection: 'BLOOM · NO. 05',      hex: '#E0B8B4', fabric: 'sheer'  },
  { name: 'Sage Weave',      collection: 'BOTANICA · NO. 08',   hex: '#8FAF8C', fabric: 'linen'  },
  { name: 'Forest Deep',     collection: 'BOTANICA · NO. 09',   hex: '#4A7A5C', fabric: 'velvet' },
  { name: 'Midnight Navy',   collection: 'NOIR · NO. 11',       hex: '#1E3A5F', fabric: 'velvet' },
  { name: 'Denim Dusk',      collection: 'NOIR · NO. 12',       hex: '#3A5F8A', fabric: 'cotton' },
  { name: 'Charcoal Drape',  collection: 'NOIR · NO. 13',       hex: '#3C3C3C', fabric: 'velvet' },
  { name: 'Slate Storm',     collection: 'NOIR · NO. 14',       hex: '#6A7A84', fabric: 'cotton' },
  { name: 'Terracotta Sun',  collection: 'WARMTH · NO. 06',     hex: '#C07455', fabric: 'linen'  },
  { name: 'Burgundy Velour', collection: 'REGAL · NO. 10',      hex: '#7A2F3A', fabric: 'velvet' },
] as const

export type CatalogFabric = (typeof CATALOG_FABRICS)[number]

// ─── Math helpers ─────────────────────────────────────────────────────────────

function clamp(v: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, v))
}

/**
 * RGB (0–255 each) → HSL.
 * H in degrees 0–360, S and L as fractions 0–1.
 *
 * HSL is more intuitive for colour relationships than RGB:
 * - H (hue): the colour wheel position
 * - S (saturation): how vivid vs grey
 * - L (lightness): how light vs dark
 */
export function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
  // Normalise to 0–1
  const rn = r / 255, gn = g / 255, bn = b / 255
  const max = Math.max(rn, gn, bn)
  const min = Math.min(rn, gn, bn)
  // Lightness = midpoint between max and min channel
  const l   = (max + min) / 2

  if (max === min) return [0, 0, l]  // achromatic — no hue

  const d = max - min
  // Saturation formula differs above/below the lightness midpoint
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min)

  // Hue: which channel is dominant and how far around the wheel
  let h: number
  if      (max === rn) h = (gn - bn) / d + (gn < bn ? 6 : 0)
  else if (max === gn) h = (bn - rn) / d + 2
  else                 h = (rn - gn) / d + 4
  h = (h / 6) * 360   // fractions → degrees

  return [h, s, l]
}

/**
 * HSL (H in degrees 0–360, S and L as 0–1 fractions) → RGB (0–255 each).
 */
export function hslToRgb(h: number, s: number, l: number): [number, number, number] {
  const hn = h / 360  // normalise hue to fraction

  if (s === 0) {
    // Achromatic — all three channels equal the lightness
    const v = Math.round(l * 255)
    return [v, v, v]
  }

  // Resolve a hue fraction to a 0–1 channel value (standard HSL formula)
  function hue2ch(p: number, q: number, t: number): number {
    if (t < 0) t += 1
    if (t > 1) t -= 1
    if (t < 1 / 6) return p + (q - p) * 6 * t
    if (t < 1 / 2) return q
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6
    return p
  }

  // q is the "light" end, p the "dark" end of each channel's range
  const q = l < 0.5 ? l * (1 + s) : l + s - l * s
  const p = 2 * l - q

  return [
    clamp(Math.round(hue2ch(p, q, hn + 1 / 3) * 255), 0, 255),
    clamp(Math.round(hue2ch(p, q, hn        ) * 255), 0, 255),
    clamp(Math.round(hue2ch(p, q, hn - 1 / 3) * 255), 0, 255),
  ]
}

/** #RRGGBB → [r, g, b] */
export function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace('#', '')
  return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)]
}

/** [r, g, b] → #RRGGBB */
export function rgbToHex(r: number, g: number, b: number): string {
  return '#' + [r, g, b]
    .map(v => clamp(Math.round(v), 0, 255).toString(16).padStart(2, '0'))
    .join('')
}

// ─── Canvas sampling ──────────────────────────────────────────────────────────

/**
 * Average the colour in a 5×5 px region centred on (cx, cy) in a canvas.
 * Uses the OFFSCREEN (unmodified) canvas so curtain panels don't corrupt reads.
 */
export function sampleCanvasColor(
  canvas: HTMLCanvasElement,
  cx: number,
  cy: number,
): [number, number, number] {
  const ctx  = canvas.getContext('2d')!
  const half = 2  // makes a 5×5 region
  const x0   = clamp(Math.floor(cx) - half, 0, canvas.width  - 1)
  const y0   = clamp(Math.floor(cy) - half, 0, canvas.height - 1)
  const w    = clamp(half * 2 + 1, 1, canvas.width  - x0)
  const h    = clamp(half * 2 + 1, 1, canvas.height - y0)

  const data = ctx.getImageData(x0, y0, w, h).data
  let sumR = 0, sumG = 0, sumB = 0, count = 0
  for (let i = 0; i < data.length; i += 4) {
    sumR += data[i]; sumG += data[i + 1]; sumB += data[i + 2]; count++
  }
  if (count === 0) return [128, 128, 128]
  return [
    clamp(Math.round(sumR / count), 0, 255),
    clamp(Math.round(sumG / count), 0, 255),
    clamp(Math.round(sumB / count), 0, 255),
  ]
}

// ─── Catalog matching ─────────────────────────────────────────────────────────

/** Euclidean distance in RGB space — used to find closest real product. */
function colorDistance(hexA: string, hexB: string): number {
  const [r1, g1, b1] = hexToRgb(hexA)
  const [r2, g2, b2] = hexToRgb(hexB)
  return Math.sqrt((r1 - r2) ** 2 + (g1 - g2) ** 2 + (b1 - b2) ** 2)
}

/**
 * Find the nearest catalog fabric to a given hex colour.
 * Returns undefined if no fabric is close enough (distance > 60 in RGB space)
 * — we'd rather say nothing than claim a misleading match.
 */
function nearestCatalogFabric(hex: string): CatalogFabric | undefined {
  let best: CatalogFabric | undefined
  let bestDist = Infinity
  for (const fabric of CATALOG_FABRICS) {
    const d = colorDistance(hex, fabric.hex)
    if (d < bestDist) { bestDist = d; best = fabric }
  }
  return bestDist <= 60 ? best : undefined
}

// ─── Recommendation engine ───────────────────────────────────────────────────

export interface Recommendation {
  id:           string
  label:        string       // display name
  collection:   string       // tag shown under the name
  reason:       string       // one-line "why this works with your wall"
  hex:          string       // exact recommended colour
  isBold:       boolean      // ordering hint: safe=false → bold=true
  catalogMatch: CatalogFabric | undefined  // nearest real product, or undefined
}

/**
 * Generate five fabric recommendations from a sampled wall colour.
 * Ordered safe → bold so the default suggestion is always low-risk.
 *
 * Undertone: warm if hue < 100 (orange/red/yellow) or hue > 330 (deep red/magenta).
 *            cool otherwise (blue/green/purple range).
 *
 *  1. Neutral      — a cream or grey that goes with almost anything
 *  2. Soft neutral — slightly more pigmented, still very safe
 *  3. Tonal        — same hue family, shifted deeper
 *  4. Value anchor — same hue, desaturated and very dark; frames the window
 *  5. Complementary— opposite hue; personality, warmth, bold intent
 */
export function getRecommendations(wr: number, wg: number, wb: number): Recommendation[] {
  const [hw, sw, lw] = rgbToHsl(wr, wg, wb)

  // Undertone: warm hues cluster around reds/yellows (< 100°) and deep reds (> 330°)
  const isWarm = hw < 100 || hw > 330

  // 1. Neutral — essentially a white-adjacent that complements any wall
  const neutralHex = isWarm ? '#ECE3CE' : '#CDD2D6'
  const neutral: Recommendation = {
    id:           'neutral',
    label:        isWarm ? 'Warm Cream' : 'Cool White',
    collection:   isWarm ? 'ESSENTIALS · NO. 01' : 'ESSENTIALS COOL',
    reason:       'Goes with almost anything. Calm, airy default.',
    hex:          neutralHex,
    isBold:       false,
    catalogMatch: nearestCatalogFabric(neutralHex),
  }

  // 2. Soft neutral — a step more character without risk
  const softHex = isWarm ? '#C9BBA3' : '#B7B4AC'
  const softNeutral: Recommendation = {
    id:           'soft-neutral',
    label:        isWarm ? 'Warm Taupe' : 'Cool Greige',
    collection:   'ESSENTIALS',
    reason:       'Soft and expensive-looking. Low risk, high reward.',
    hex:          softHex,
    isBold:       false,
    catalogMatch: nearestCatalogFabric(softHex),
  }

  // 3. Tonal — same hue as the wall, shifted to a deeper, richer value.
  //    Clamp saturation so it stays fabric-like (not neon), clamp lightness
  //    so it's noticeably darker than the wall without turning black.
  const tonalS       = clamp(sw, 0.15, 0.50)
  const tonalL       = clamp(lw - 0.32, 0.18, 0.80)
  const [tr, tg, tb] = hslToRgb(hw, tonalS, tonalL)
  const tonalHex     = rgbToHex(tr, tg, tb)
  const tonal: Recommendation = {
    id:           'tonal',
    label:        'Tonal Depth',
    collection:   'COLOUR MATCH',
    reason:       'Same family as your wall, but deeper. Cohesive and serene.',
    hex:          tonalHex,
    isBold:       false,
    catalogMatch: nearestCatalogFabric(tonalHex),
  }

  // 4. Value anchor — same hue, nearly desaturated, very dark.
  //    The curtain frames the window without competing with the wall.
  const [vr, vg, vb] = hslToRgb(hw, 0.18, 0.20)
  const anchorHex     = rgbToHex(vr, vg, vb)
  const valueAnchor: Recommendation = {
    id:           'value-anchor',
    label:        'Deep Anchor',
    collection:   'SIGNATURE DARK',
    reason:       'Anchors the room and frames the window. Dramatic but grounded.',
    hex:          anchorHex,
    isBold:       true,
    catalogMatch: nearestCatalogFabric(anchorHex),
  }

  // 5. Complementary — opposite side of the colour wheel (hue + 180°).
  //    Saturation clamped into a range that reads as fabric, not paint.
  //    Lightness fixed at 0.45 — perceptually mid-value, not too light or dark.
  const compH        = (hw + 180) % 360
  const compS        = clamp(sw, 0.30, 0.45)
  const [cr, cg, cb] = hslToRgb(compH, compS, 0.45)
  const compHex      = rgbToHex(cr, cg, cb)
  const complementary: Recommendation = {
    id:           'complementary',
    label:        'Bold Contrast',
    collection:   'STATEMENT',
    reason:       'Opposite tone to your wall. Personality and warmth in one move.',
    hex:          compHex,
    isBold:       true,
    catalogMatch: nearestCatalogFabric(compHex),
  }

  // Ordered safe → bold
  return [neutral, softNeutral, tonal, valueAnchor, complementary]
}
