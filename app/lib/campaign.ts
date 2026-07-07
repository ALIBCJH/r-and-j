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
