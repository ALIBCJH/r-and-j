/**
 * Curtain asset manifest — maps registered styles to files in /public/curtains
 * and loads them for the compositor, falling back to the code placeholder when
 * a render isn't present yet.
 *
 * Because the compositor recolors a NEUTRAL render at runtime (see
 * BLENDER_ASSETS.md), assets are keyed by **style + state**, never by colour —
 * one `_lum` render serves every fabric colour.
 *
 * "Auto-wiring": the loader builds the expected URL from the naming convention
 * and tries to load it. If the file exists it's used; if it 404s, the loader
 * returns a placeholder panel so the scene always renders. Dropping a file into
 * /public/curtains and reloading is all it takes to switch a style to the real
 * render. Adding a brand-new style also needs one entry in CURTAIN_STYLES below.
 */

import { makePlaceholderPanel, type PanelSource } from './fabricCompositor'

// ─── Vocabulary (matches the {tokens} in filenames) ───────────────────────────

export type CurtainState = 'open' | 'closed' | 'tieback'
export type PanelSide    = 'left' | 'right'
export type PanelPass    = 'lum' | 'shadow' | 'spec'

export interface CurtainStyle {
  /** Filename `{style}` token, e.g. 'pinchPleat'. */
  id: string
  /** Human label for the UI. */
  label: string
  /** States that have assets. v1 = ['open']. */
  states: CurtainState[]
  /**
   * Recommended tint gain for this render. Neutral #CFCFCF renders darken under
   * multiply, so ~1.15 restores true colour. Tune per fabric in the preview.
   */
  tintGain: number
  /** A distinct right-panel render exists (otherwise the left panel is mirrored). */
  hasRightPanel?: boolean
  /** A `_shadow` cast-shadow pass exists. */
  hasShadow?: boolean
}

/**
 * Registered styles. Add a line here + drop the matching files in
 * /public/curtains to expose a new style. Files that aren't there yet simply
 * fall back to the placeholder — safe to register ahead of the render landing.
 */
export const CURTAIN_STYLES: CurtainStyle[] = [
  { id: 'pinchPleat', label: 'Pinch Pleat', states: ['open'], tintGain: 1.15 },
  { id: 'wave',       label: 'Wave',        states: ['open'], tintGain: 1.15 },
  { id: 'eyelet',     label: 'Eyelet',      states: ['open'], tintGain: 1.15 },
]

const CURTAINS_DIR = '/curtains'

export function getStyle(styleId: string): CurtainStyle | undefined {
  return CURTAIN_STYLES.find(s => s.id === styleId)
}

/** Build the public URL for one asset following the naming convention. */
export function panelAssetUrl(
  styleId: string,
  state:   CurtainState,
  side:    PanelSide,
  pass:    PanelPass,
): string {
  return `${CURTAINS_DIR}/curtain_${styleId}_${state}_${side}_${pass}.webp`
}

// ─── Cached image loader ───────────────────────────────────────────────────────
// Resolves to the loaded image, or null if the file is missing (404 / decode
// error). Promises are cached so repeated selections don't re-request.

const imageCache = new Map<string, Promise<HTMLImageElement | null>>()

function loadImage(url: string): Promise<HTMLImageElement | null> {
  const cached = imageCache.get(url)
  if (cached) return cached

  const p = new Promise<HTMLImageElement | null>(resolve => {
    const img = new Image()
    img.decoding = 'async'
    img.onload  = () => resolve(img)
    img.onerror = () => resolve(null)   // missing → caller falls back to placeholder
    img.src = url
  })
  imageCache.set(url, p)
  return p
}

// ─── Resolved panel set for the compositor ─────────────────────────────────────

export interface PanelSet {
  left:          PanelSource
  right?:        PanelSource
  shadow?:       PanelSource
  /** Tint gain to use with this set (1 for the placeholder, style value for real). */
  tintGain:      number
  /** True when no real render was found and the placeholder is standing in. */
  isPlaceholder: boolean
  /** The `_lum` URL that was attempted — handy for a "showing X" status line. */
  lumUrl:        string
}

export interface LoadOptions {
  /** Folds passed to the placeholder when a real render is absent. */
  placeholderFolds?: number
}

/**
 * Load everything the compositor needs for a style+state. Never rejects: a
 * missing render yields a placeholder set so the scene always draws.
 */
export async function loadPanelSet(
  styleId: string,
  state:   CurtainState = 'open',
  opts:    LoadOptions = {},
): Promise<PanelSet> {
  const style  = getStyle(styleId)
  const lumUrl = panelAssetUrl(styleId, state, 'left', 'lum')

  const left = await loadImage(lumUrl)

  // No real render → placeholder (authored bright, so tintGain = 1).
  if (!left) {
    return {
      left:          makePlaceholderPanel(512, 1024, { folds: opts.placeholderFolds ?? 5 }),
      tintGain:      1,
      isPlaceholder: true,
      lumUrl,
    }
  }

  // Optional extra passes, only fetched when the style declares them.
  const [right, shadow] = await Promise.all([
    style?.hasRightPanel
      ? loadImage(panelAssetUrl(styleId, state, 'right', 'lum'))
      : Promise.resolve(null),
    style?.hasShadow
      ? loadImage(panelAssetUrl(styleId, state, 'left', 'shadow'))
      : Promise.resolve(null),
  ])

  return {
    left,
    right:         right  ?? undefined,
    shadow:        shadow ?? undefined,
    tintGain:      style?.tintGain ?? 1.15,
    isPlaceholder: false,
    lumUrl,
  }
}
