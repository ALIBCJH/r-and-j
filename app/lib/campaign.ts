// Central place for the pre-launch campaign wording. Change these once and it
// updates the navbar, the /founding landing page, and the checkout copy.
// (Prefer a generic term like "Early Access" or "Pre-Launch" if you'd rather
// not use "Kickstarter", which is a trademarked brand name.)

export const CAMPAIGN = {
  /** Short nav-link label. */
  navLabel: 'Kickstarter',
  /** Primary call-to-action button text. */
  cta: 'Join the Kickstarter',
  /** How we refer to the offer in prose. */
  name: 'Kickstarter',
} as const

// ⚠️ SET THIS to your real public-launch date. The founding discounts and the
// countdown timer both expire here, so it must be honest — a fake deadline that
// keeps resetting erodes exactly the trust we're trying to build.
// ISO 8601, with the +03:00 offset for East Africa Time.
export const LAUNCH_DATE = '2026-08-31T23:59:59+03:00'

/** Milliseconds remaining until launch, never negative. Pass Date.now(). */
export function msUntilLaunch(now: number): number {
  return Math.max(0, new Date(LAUNCH_DATE).getTime() - now)
}

/** Pre-filled message a backer sends a friend when sharing the pre-launch. */
export function referralMessage(url: string): string {
  return (
    "I'm backing R&J Interiors' launch — you get to see your curtains in your " +
    'actual room before you pay a shilling, and founding backers lock a launch ' +
    'discount. Spots are limited and pricing ends soon 👉 ' + url
  )
}

// Backing packages: how much a customer pledges now, and the launch discount it
// unlocks. The pledge is credited in full to their eventual order. This list is
// the single source of truth — the server validates the chosen amount against
// it, so only these amounts can ever be charged.
export type Tier = { amount: number; discountPct: number }

export const TIERS: Tier[] = [
  { amount: 100,  discountPct: 5  },
  { amount: 200,  discountPct: 7  },
  { amount: 500,  discountPct: 10 },
  { amount: 1000, discountPct: 12 },
]

/** Return the tier for an amount, or null if it isn't a valid package. */
export function tierForAmount(amount: number): Tier | null {
  return TIERS.find(t => t.amount === amount) ?? null
}

/** Sensible default selection (the middle-weight package). */
export const DEFAULT_TIER: Tier = TIERS[1]
