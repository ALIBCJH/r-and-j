// Tiny key–value store used by the checkout / M-Pesa flow.
//
// Dependency-free by design (same ethos as security.ts): when Vercel KV /
// Upstash Redis is provisioned, we talk to it over its REST API with plain
// `fetch` — no client package to install. When it isn't (local dev, or before
// you add the integration on Vercel), we transparently fall back to an
// in-process Map so the whole flow still runs end to end.
//
// The REST credentials are injected automatically by Vercel when you add the
// KV / Upstash integration from the dashboard's Storage tab. We accept both the
// `KV_REST_API_*` names (Vercel KV) and the `UPSTASH_REDIS_REST_*` names
// (Upstash Marketplace), so it works whichever way the store is provisioned.

const REST_URL =
  process.env.KV_REST_API_URL ?? process.env.UPSTASH_REDIS_REST_URL ?? ''
const REST_TOKEN =
  process.env.KV_REST_API_TOKEN ?? process.env.UPSTASH_REDIS_REST_TOKEN ?? ''

/** True when a real KV/Redis backend is configured. */
export function hasKv(): boolean {
  return Boolean(REST_URL && REST_TOKEN)
}

// ── In-memory fallback ──────────────────────────────────────────────────────
// Note: not shared across serverless instances or restarts — fine for local
// dev and demos, but production MUST have KV configured so the async M-Pesa
// callback and the browser's status poll can see the same record.
type Entry = { value: string; expiresAt: number | null }
const mem = new Map<string, Entry>()
const memLists = new Map<string, string[]>()

function memGet(key: string): string | null {
  const hit = mem.get(key)
  if (!hit) return null
  if (hit.expiresAt !== null && Date.now() > hit.expiresAt) {
    mem.delete(key)
    return null
  }
  return hit.value
}

function memSet(key: string, value: string, ttlSeconds?: number): void {
  mem.set(key, {
    value,
    expiresAt: ttlSeconds ? Date.now() + ttlSeconds * 1000 : null,
  })
}

// ── Upstash/Vercel-KV REST transport ────────────────────────────────────────
// Runs a single Redis command via the REST API, e.g. ['SET', key, value].
async function kvCommand(command: (string | number)[]): Promise<unknown> {
  const res = await fetch(REST_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${REST_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(command),
    cache: 'no-store',
  })
  if (!res.ok) {
    throw new Error(`KV command failed: ${res.status} ${await res.text()}`)
  }
  const data = (await res.json()) as { result?: unknown; error?: string }
  if (data.error) throw new Error(`KV error: ${data.error}`)
  return data.result
}

// ── Public JSON helpers ─────────────────────────────────────────────────────

/** Read and parse a JSON value. Returns null if the key is absent. */
export async function kvGetJson<T>(key: string): Promise<T | null> {
  const raw = hasKv()
    ? ((await kvCommand(['GET', key])) as string | null)
    : memGet(key)
  if (raw == null) return null
  try {
    return JSON.parse(raw) as T
  } catch {
    return null
  }
}

/** Serialize and store a JSON value, with an optional TTL in seconds. */
export async function kvSetJson(
  key: string,
  value: unknown,
  ttlSeconds?: number,
): Promise<void> {
  const raw = JSON.stringify(value)
  if (hasKv()) {
    await kvCommand(
      ttlSeconds ? ['SET', key, raw, 'EX', ttlSeconds] : ['SET', key, raw],
    )
  } else {
    memSet(key, raw, ttlSeconds)
  }
}

/** Delete a key (Redis DEL). No-op if the key is absent. */
export async function kvDel(key: string): Promise<void> {
  if (hasKv()) {
    await kvCommand(['DEL', key])
  } else {
    mem.delete(key)
    memLists.delete(key)
  }
}

/**
 * Atomically increment an integer counter and return the new value. Uses Redis
 * INCR on real KV (race-free across instances); on the in-memory fallback it's
 * a plain increment. The stored value is an integer string, which is also valid
 * JSON — so kvGetJson<number> reads it back correctly.
 */
export async function kvIncr(key: string): Promise<number> {
  if (hasKv()) {
    return Number(await kvCommand(['INCR', key]))
  }
  const next = Number(memGet(key) ?? '0') + 1
  memSet(key, String(next))
  return next
}

/** Append a value to the end of a list (Redis RPUSH). */
export async function kvListPush(key: string, value: string): Promise<void> {
  if (hasKv()) {
    await kvCommand(['RPUSH', key, value])
  } else {
    const list = memLists.get(key) ?? []
    list.push(value)
    memLists.set(key, list)
  }
}

/** Read a whole list, in insertion order (Redis LRANGE key 0 -1). */
export async function kvListRange(key: string): Promise<string[]> {
  if (hasKv()) {
    return ((await kvCommand(['LRANGE', key, 0, -1])) as string[]) ?? []
  }
  return memLists.get(key) ?? []
}
