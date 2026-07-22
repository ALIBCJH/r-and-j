// Server-only persistence for the customer-facing pricing model.
//
// One JSON blob under `config:pricing` holds the whole editable config (sizes,
// packages, per-product price matrix). Before an admin ever saves, reads fall
// back to DEFAULT_PRICING_CONFIG, so the store works end to end with no KV
// configured (in-memory dev fallback) and with an empty KV in production.
//
// Mirrors the existing store conventions in app/lib/orders.ts: colon-namespaced
// key, one JSON value via kvGetJson/kvSetJson, no TTL (pricing persists).

import { kvGetJson, kvSetJson } from './store'
import {
  DEFAULT_PRICING_CONFIG,
  type PricingConfig,
  type SizeDef,
  type PackageDef,
  type PriceMatrix,
} from './pricing'

const PRICING_KEY = 'config:pricing'

// ─── Normalisation ────────────────────────────────────────────────────────────
// Never trust a stored / posted blob. Coerce every field to the expected shape
// so a malformed write can't crash a product card or the checkout-independent
// quote UI. Unknown extras are dropped.

function str(v: unknown, fallback = ''): string {
  return typeof v === 'string' ? v : fallback
}

function num(v: unknown, fallback = 0): number {
  const n = typeof v === 'number' ? v : Number(v)
  return Number.isFinite(n) && n >= 0 ? n : fallback
}

function bool(v: unknown, fallback = false): boolean {
  return typeof v === 'boolean' ? v : fallback
}

function normalizeSizes(raw: unknown): SizeDef[] {
  if (!Array.isArray(raw)) return DEFAULT_PRICING_CONFIG.sizes
  const seen = new Set<string>()
  const sizes: SizeDef[] = []
  raw.forEach((r, i) => {
    const o = (r ?? {}) as Record<string, unknown>
    const id = str(o.id).trim()
    if (!id || seen.has(id)) return
    seen.add(id)
    sizes.push({
      id,
      label:     str(o.label, id),
      sublabel:  str(o.sublabel),
      enabled:   bool(o.enabled, true),
      sortOrder: num(o.sortOrder, i + 1),
    })
  })
  return sizes.length ? sizes : DEFAULT_PRICING_CONFIG.sizes
}

function normalizePackages(raw: unknown): PackageDef[] {
  if (!Array.isArray(raw)) return DEFAULT_PRICING_CONFIG.packages
  const seen = new Set<string>()
  const packages: PackageDef[] = []
  raw.forEach((r, i) => {
    const o = (r ?? {}) as Record<string, unknown>
    const id = str(o.id).trim()
    if (!id || seen.has(id)) return
    seen.add(id)
    packages.push({
      id,
      name:      str(o.name, id),
      tagline:   str(o.tagline),
      features:  Array.isArray(o.features)
        ? o.features.map(f => str(f).trim()).filter(Boolean)
        : [],
      enabled:   bool(o.enabled, true),
      sortOrder: num(o.sortOrder, i + 1),
    })
  })
  return packages.length ? packages : DEFAULT_PRICING_CONFIG.packages
}

function normalizePrices(raw: unknown, sizes: SizeDef[], packages: PackageDef[]): PriceMatrix {
  const src = (raw && typeof raw === 'object') ? raw as Record<string, unknown> : {}
  const prices: PriceMatrix = {}
  for (const [productKey, grid] of Object.entries(src)) {
    const g = (grid && typeof grid === 'object') ? grid as Record<string, unknown> : {}
    const out: Record<string, Record<string, number>> = {}
    for (const size of sizes) {
      const row = (g[size.id] && typeof g[size.id] === 'object') ? g[size.id] as Record<string, unknown> : {}
      out[size.id] = {}
      for (const pkg of packages) {
        const seed = DEFAULT_PRICING_CONFIG.prices?.[productKey]?.[size.id]?.[pkg.id] ?? 0
        out[size.id][pkg.id] = num(row[pkg.id], seed)
      }
    }
    prices[productKey] = out
  }
  return prices
}

/** Coerce any raw object into a valid, fully-populated PricingConfig. */
export function normalizePricingConfig(raw: unknown): PricingConfig {
  const o = (raw && typeof raw === 'object') ? raw as Record<string, unknown> : {}
  const sizes    = normalizeSizes(o.sizes)
  const packages = normalizePackages(o.packages)
  // Start from the seed matrix so every product/size/package cell exists, then
  // overlay whatever was stored/posted.
  const merged: PriceMatrix = JSON.parse(JSON.stringify(DEFAULT_PRICING_CONFIG.prices))
  const posted = normalizePrices(o.prices, sizes, packages)
  for (const [productKey, grid] of Object.entries(posted)) {
    merged[productKey] = { ...(merged[productKey] ?? {}), ...grid }
  }
  return {
    version:   num(o.version, DEFAULT_PRICING_CONFIG.version) || 1,
    sizes,
    packages,
    prices:    merged,
    updatedAt: typeof o.updatedAt === 'string' ? o.updatedAt : null,
  }
}

/**
 * True when at least one size AND one package are enabled — otherwise nothing
 * is purchasable and every card would render blank. Save is rejected in that
 * state (see the admin route).
 */
export function pricingIsSellable(config: PricingConfig): boolean {
  return config.sizes.some(s => s.enabled) && config.packages.some(p => p.enabled)
}

// ─── Read / write ─────────────────────────────────────────────────────────────

/** The live pricing config, or the seed defaults when nothing is stored yet. */
export async function getPricingConfig(): Promise<PricingConfig> {
  const stored = await kvGetJson<PricingConfig>(PRICING_KEY)
  if (!stored) return DEFAULT_PRICING_CONFIG
  return normalizePricingConfig(stored)
}

/**
 * Persist a new config. `nowIso` is passed in by the caller (the route handler)
 * because Date is not available in every context; stored verbatim as updatedAt.
 * Returns the normalised config that was written.
 */
export async function savePricingConfig(raw: unknown, nowIso: string): Promise<PricingConfig> {
  const config = normalizePricingConfig({ ...(raw as object), updatedAt: nowIso })
  await kvSetJson(PRICING_KEY, config)
  return config
}
