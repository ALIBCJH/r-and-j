/**
 * Studio capability detection for R&J Interiors.
 *
 * Routing hierarchy (evaluated in page.tsx useEffect after mount):
 *
 *  1. Screen width < 768 px  →  mobile tool, always.
 *     Exception: user explicitly tapped "Open 3D Studio anyway" on this device
 *     (setStoredOverride('3d') stores that choice — we respect it).
 *
 *  2. Stored override = 'mobile'  →  mobile tool (user opted in on desktop).
 *
 *  3. canRunStudio() = false  →  mobile tool (no WebGL2, or other hard block).
 *
 *  4. Otherwise  →  3D studio.
 *
 * Override key: 'rj-studio-override'
 * Values:  '3d'  (user explicitly chose 3D on this device — respect even on mobile)
 *          'mobile' (user opted into photo tool on a capable desktop)
 *          absent  (auto-detect each visit)
 */

export type StudioMode     = '3d' | 'mobile'
export type StudioOverride = StudioMode | null

const OVERRIDE_KEY = 'rj-studio-override'

// ─── Override persistence ────────────────────────────────────────────────────

export function getStoredOverride(): StudioOverride {
  try {
    const v = localStorage.getItem(OVERRIDE_KEY)
    if (v === '3d' || v === 'mobile') return v
    return null
  } catch {
    return null
  }
}

export function setStoredOverride(mode: StudioMode | null): void {
  try {
    if (mode === null) localStorage.removeItem(OVERRIDE_KEY)
    else               localStorage.setItem(OVERRIDE_KEY, mode)
  } catch {}
}

// ─── Capability check ─────────────────────────────────────────────────────────
// Only called when there is no stored override and the screen is ≥ 768 px.

export function canRunStudio(): boolean {
  // WebGL2 — required by Three.js r144+
  try {
    const probe = document.createElement('canvas')
    const gl    = probe.getContext('webgl2')
    if (!gl) return false
    gl.getExtension('WEBGL_lose_context')?.loseContext()
  } catch {
    return false
  }
  return true
}

// ─── Routing decision (single call site in page.tsx) ─────────────────────────

/**
 * Resolve which experience to show on this device/visit.
 *
 * Call ONLY after mount (uses window, localStorage, navigator).
 *
 * Returns '3d' or 'mobile'.
 */
export function resolveStudioMode(): StudioMode {
  const isMobileViewport = window.innerWidth < 768
  const override         = getStoredOverride()

  // Mobile viewport — always photo tool UNLESS the user explicitly said
  // "Open 3D Studio anyway" on this very device (override === '3d').
  if (isMobileViewport) {
    return override === '3d' ? '3d' : 'mobile'
  }

  // Desktop viewport — respect stored preference, then auto-detect.
  if (override === 'mobile') return 'mobile'
  if (override === '3d')     return '3d'
  return canRunStudio() ? '3d' : 'mobile'
}
