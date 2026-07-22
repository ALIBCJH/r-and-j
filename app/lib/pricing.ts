// Customer-facing pricing model.
//
// R&J sells a *finished window*, not a manufacturing unit. A customer chooses:
//
//   1. Window Size     — Small · Medium · Large · (Extra Large, optional)
//   2. Service Package — Essential · Premium
//
// Every (size × package) combination has one fixed, all-in price per product.
// There is no "per panel" / "per pair" / lining line-item anywhere — that
// vocabulary is deliberately gone. See app/lib/pricingStore.ts for the
// admin-editable, KV-backed layer; this file is the pure model + the seed
// defaults that ship before an admin ever saves. It is client-safe (no KV, no
// next/headers), so cards, the pricing modal, and the admin editor all import
// the same helpers and types.

import { PRODUCTS } from './products'

// ─── Types ──────────────────────────────────────────────────────────────────

export type SizeId = string
export type PackageId = string

/** A window size the customer can pick (Small, Medium, …). */
export interface SizeDef {
  id:        SizeId
  label:     string    // 'Medium'
  sublabel:  string    // human hint, e.g. 'Standard window · up to 150cm wide'
  enabled:   boolean   // disabled sizes never appear or count toward "from"
  sortOrder: number
}

/** A service package (Essential, Premium) with its included features. */
export interface PackageDef {
  id:        PackageId
  name:      string    // 'Premium'
  tagline:   string    // one line under the name
  features:  string[]  // bullet list shown in the modal / admin
  enabled:   boolean
  sortOrder: number
}

/** prices[productId][sizeId][packageId] = KES amount. */
export type PriceMatrix = Record<string, Record<SizeId, Record<PackageId, number>>>

export interface PricingConfig {
  version:   number
  sizes:     SizeDef[]
  packages:  PackageDef[]
  prices:    PriceMatrix
  updatedAt: string | null
}

// ─── Seed defaults ────────────────────────────────────────────────────────────
// These are placeholder values, fully editable from /admin/pricing. Nothing
// downstream hardcodes a price — everything reads a PricingConfig.

export const DEFAULT_SIZES: SizeDef[] = [
  { id: 'small',  label: 'Small',       sublabel: 'Compact window · up to ~120cm wide', enabled: true,  sortOrder: 1 },
  { id: 'medium', label: 'Medium',      sublabel: 'Standard window · up to ~180cm wide', enabled: true,  sortOrder: 2 },
  { id: 'large',  label: 'Large',       sublabel: 'Large window · up to ~250cm wide',    enabled: true,  sortOrder: 3 },
  { id: 'xl',     label: 'Extra Large', sublabel: 'Feature wall / bay · 250cm+',         enabled: false, sortOrder: 4 },
]

export const DEFAULT_PACKAGES: PackageDef[] = [
  {
    id:       'essential',
    name:     'Essential',
    tagline:  'Everything you need for a beautiful, finished window.',
    enabled:  true,
    sortOrder: 1,
    features: [
      'Fabric',
      'Professional tailoring',
      'Standard lining',
      'Measurement',
      'Installation',
      'Delivery',
      'Workmanship warranty',
    ],
  },
  {
    id:       'premium',
    name:     'Premium',
    tagline:  'Everything in Essential, elevated end to end.',
    enabled:  true,
    sortOrder: 2,
    features: [
      'Premium fabrics',
      'Premium blackout / thermal lining',
      'Designer consultation',
      'Enhanced finishing',
      'Decorative hardware options',
      'Priority installation',
      'Extended warranty',
    ],
  },
]

// The example matrix from the pricing brief, used as the baseline for a
// mid-range product. Each real product is scaled from its own anchor (below)
// so the flagship velvet and the entry sheer stay honestly differentiated.
const BASE_MATRIX: Record<SizeId, Record<PackageId, number>> = {
  small:  { essential:  8500, premium: 11500 },
  medium: { essential: 13500, premium: 17500 },
  large:  { essential: 18500, premium: 24500 },
  xl:     { essential: 25500, premium: 33500 },
}
const BASE_ANCHOR = 7000

// Per-product anchor (roughly the old catalog price). Only used to seed sensible
// starting defaults; the admin overrides any of these per cell.
const SEED_ANCHOR: Record<number, number> = {
  1: 8500, 2: 7000, 3: 9500, 4: 6500, 5: 5500, 6: 6000, 7: 4500, 8: 10000,
}

const round500 = (n: number): number => Math.round(n / 500) * 500

function seedMatrix(): PriceMatrix {
  const prices: PriceMatrix = {}
  for (const p of PRODUCTS) {
    const anchor = SEED_ANCHOR[p.id] ?? BASE_ANCHOR
    const factor = anchor / BASE_ANCHOR
    const grid: Record<SizeId, Record<PackageId, number>> = {}
    for (const size of DEFAULT_SIZES) {
      grid[size.id] = {}
      for (const pkg of DEFAULT_PACKAGES) {
        grid[size.id][pkg.id] = round500(BASE_MATRIX[size.id][pkg.id] * factor)
      }
    }
    prices[String(p.id)] = grid
  }
  return prices
}

export const DEFAULT_PRICING_CONFIG: PricingConfig = {
  version:   1,
  sizes:     DEFAULT_SIZES,
  packages:  DEFAULT_PACKAGES,
  prices:    seedMatrix(),
  updatedAt: null,
}

// ─── Pure helpers (client + server safe) ──────────────────────────────────────

/** 'KES 13,500' — deterministic, locale-independent grouping. */
export function formatKes(amount: number): string {
  const n = Number.isFinite(amount) ? Math.round(amount) : 0
  return `KES ${n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`
}

/** Enabled sizes, in display order. */
export function activeSizes(config: PricingConfig): SizeDef[] {
  return config.sizes.filter(s => s.enabled).sort((a, b) => a.sortOrder - b.sortOrder)
}

/** Enabled packages, in display order. */
export function activePackages(config: PricingConfig): PackageDef[] {
  return config.packages.filter(p => p.enabled).sort((a, b) => a.sortOrder - b.sortOrder)
}

/**
 * Price for one (product, size, package). Falls back to the seed defaults when
 * the stored config is missing a cell (e.g. a product added after the last
 * admin save), so a card never renders a blank price. Returns null only when no
 * price exists anywhere.
 */
export function priceFor(
  config:    PricingConfig,
  productId: number | string,
  sizeId:    SizeId,
  packageId: PackageId,
): number | null {
  const key = String(productId)
  const stored = config.prices?.[key]?.[sizeId]?.[packageId]
  if (typeof stored === 'number' && Number.isFinite(stored)) return stored
  const seed = DEFAULT_PRICING_CONFIG.prices?.[key]?.[sizeId]?.[packageId]
  return typeof seed === 'number' && Number.isFinite(seed) ? seed : null
}

export interface StartingFrom {
  amount:       number
  sizeId:       SizeId
  sizeLabel:    string
  packageId:    PackageId
  packageName:  string
}

/**
 * The lowest active (size × package) price for a product — the honest "Starting
 * From" figure. Recomputes automatically as sizes/packages/prices change, so
 * disabling the smallest size updates every card with no other edit.
 */
export function startingFrom(config: PricingConfig, productId: number | string): StartingFrom | null {
  let best: StartingFrom | null = null
  for (const size of activeSizes(config)) {
    for (const pkg of activePackages(config)) {
      const amount = priceFor(config, productId, size.id, pkg.id)
      // A 0 (or missing) cell isn't a real starting price — skip so a card never
      // reads "From KES 0" because one combination was left unpriced.
      if (amount == null || amount <= 0) continue
      if (!best || amount < best.amount) {
        best = {
          amount,
          sizeId:      size.id,
          sizeLabel:   size.label,
          packageId:   pkg.id,
          packageName: pkg.name,
        }
      }
    }
  }
  return best
}
