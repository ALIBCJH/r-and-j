// Server-side input safety helpers for the email actions.
// Kept dependency-free and pure so they're trivial to reason about.

/** Escape user input before interpolating it into an HTML email body. */
export function escapeHtml(input: string): string {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

/** Strip CR/LF so user values can't inject extra email headers (subject/from). */
export function stripNewlines(input: string): string {
  return input.replace(/[\r\n]+/g, ' ').trim()
}

/** Pragmatic email format check — rejects garbage and injection attempts. */
export function isValidEmail(email: string): boolean {
  const e = email.trim()
  if (e.length === 0 || e.length > 254) return false
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)
}

/**
 * In-memory sliding-window rate limiter (per server instance).
 * Returns true if the call is allowed, false if the limit is exceeded.
 * Note: not shared across instances — fine for a single-server deploy;
 * swap for a Redis/Upstash store if you scale horizontally.
 */
const hits = new Map<string, number[]>()

export function rateLimit(key: string, max: number, windowMs: number): boolean {
  const now = Date.now()
  const recent = (hits.get(key) ?? []).filter((t) => now - t < windowMs)
  if (recent.length >= max) {
    hits.set(key, recent)
    return false
  }
  recent.push(now)
  hits.set(key, recent)
  return true
}
