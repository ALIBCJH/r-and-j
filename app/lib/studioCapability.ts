/**
 * Studio capability detection for R&J Interiors.
 *
 * Decides whether this device can run the WebGL 3D studio well.
 * Call canRunStudio() ONLY after mount — it uses browser APIs unavailable in SSR.
 *
 * Decision criteria (in order):
 *  1. WebGL2 absent → false (hard block; Three.js r9+ requires it)
 *  2. Coarse pointer + multi-touch → phone-like device → false
 *     (Even if the phone has WebGL2, it's better served by the photo tool.
 *      The escape hatch lets power users opt into 3D anyway.)
 *  3. Very low memory (≤2 GB) AND very few cores (≤2) on a non-touch device → false
 *  4. Otherwise → true (desktop / capable tablet)
 *
 * The override persists in localStorage so a user who explicitly chose
 * one experience is not re-routed on their next visit.
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
    // Private browsing / storage blocked
    return null
  }
}

export function setStoredOverride(mode: StudioMode | null): void {
  try {
    if (mode === null) localStorage.removeItem(OVERRIDE_KEY)
    else               localStorage.setItem(OVERRIDE_KEY, mode)
  } catch {
    // Silently ignore storage errors
  }
}

// ─── Capability check ────────────────────────────────────────────────────────

export function canRunStudio(): boolean {
  // 1. WebGL2 — hard requirement for Three.js r144+
  try {
    const probe = document.createElement('canvas')
    const gl    = probe.getContext('webgl2')
    if (!gl) return false
    // Immediately release the context so the browser doesn't warn
    gl.getExtension('WEBGL_lose_context')?.loseContext()
  } catch {
    return false
  }

  // 2. Coarse pointer + multi-touch = phone-like device
  //    maxTouchPoints > 1 to exclude Mac trackpads (they report 1)
  const coarsePointer = window.matchMedia('(pointer: coarse)').matches
  const hasTouch      = navigator.maxTouchPoints > 1
  if (coarsePointer && hasTouch) return false

  // 3. Low-resource non-touch device (e.g. old netbook)
  //    navigator.deviceMemory is in GB; hardwareConcurrency is logical cores
  const mem   = (navigator as { deviceMemory?: number }).deviceMemory
  const cores = navigator.hardwareConcurrency
  const lowMem   = typeof mem   === 'number' && mem   <= 2
  const lowCores = typeof cores === 'number' && cores <= 2
  if (lowMem && lowCores) return false

  return true
}
