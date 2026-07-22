'use client'

// Admin · Pricing Management.
//
// Edits the single KV-backed PricingConfig: window sizes, service packages
// (names, descriptions, features), and each product's (size × package) price
// grid. No value on this screen is hardcoded downstream — Save writes the whole
// config to /api/admin/pricing, which every card and the pricing modal read.
//
// Auth mirrors AdminClient: GET the config; a 401 drops to the shared password
// login. Same rj_admin cookie, same /api/admin/login endpoint.

import { useEffect, useState } from 'react'
import Link from 'next/link'
import {
  Loader2, Lock, LogOut, ArrowLeft, Save, Plus, Trash2, RotateCcw, Check,
} from 'lucide-react'
import { API_URL } from '@/app/lib/api'
import { PRODUCTS } from '@/app/lib/products'
import {
  DEFAULT_PRICING_CONFIG,
  type PricingConfig,
  type SizeDef,
  type PackageDef,
  startingFrom,
  formatKes,
} from '@/app/lib/pricing'

const clone = (c: PricingConfig): PricingConfig => JSON.parse(JSON.stringify(c))
const newId = (prefix: string): string =>
  `${prefix}_${(typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : String(Math.random())).slice(0, 6)}`

export default function PricingAdminClient() {
  const [authed, setAuthed] = useState<boolean | null>(null)
  const [config, setConfig] = useState<PricingConfig | null>(null)

  const [pw, setPw]               = useState('')
  const [logErr, setLogErr]       = useState('')
  const [loggingIn, setLoggingIn] = useState(false)

  const [saving, setSaving]   = useState(false)
  const [saveMsg, setSaveMsg] = useState('')
  const [saveErr, setSaveErr] = useState('')

  const [selectedProduct, setSelectedProduct] = useState<number>(PRODUCTS[0]?.id ?? 1)

  async function load() {
    try {
      const res = await fetch(`${API_URL}/admin/pricing`, { cache: 'no-store' })
      if (res.status === 401) { setAuthed(false); return }
      const data = await res.json()
      if (data.ok) { setConfig(data.config); setAuthed(true) }
      else setAuthed(false)
    } catch {
      setAuthed(false)
    }
  }

  useEffect(() => { load() }, [])

  async function login(e: React.FormEvent) {
    e.preventDefault()
    setLogErr(''); setLoggingIn(true)
    try {
      const res = await fetch(`${API_URL}/admin/login`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: pw }),
      })
      const data = await res.json()
      if (data.ok) { setPw(''); await load() }
      else setLogErr(data.error || 'Login failed.')
    } catch {
      setLogErr('Could not connect. Try again.')
    } finally {
      setLoggingIn(false)
    }
  }

  async function logout() {
    await fetch(`${API_URL}/admin/logout`, { method: 'POST' }).catch(() => {})
    setAuthed(false); setConfig(null)
  }

  async function save() {
    if (!config) return
    setSaving(true); setSaveMsg(''); setSaveErr('')
    try {
      const res = await fetch(`${API_URL}/admin/pricing`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ config }),
      })
      if (res.status === 401) { setAuthed(false); return }
      const data = await res.json()
      if (data.ok) { setConfig(data.config); setSaveMsg('Saved. Live on the site now.') }
      else setSaveErr(data.error || 'Could not save.')
    } catch {
      setSaveErr('Could not connect. Try again.')
    } finally {
      setSaving(false)
    }
  }

  // ── Immutable config editing ───────────────────────────────────────────────
  function patch(fn: (c: PricingConfig) => void) {
    setConfig(prev => {
      if (!prev) return prev
      const next = clone(prev)
      fn(next)
      return next
    })
    setSaveMsg(''); setSaveErr('')
  }

  // ── Loading / login gates ──────────────────────────────────────────────────
  if (authed === null) {
    return (
      <Shell>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#6A7A88', fontFamily: 'var(--font-inter, sans-serif)' }}>
          <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} /> Loading…
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </Shell>
    )
  }

  if (!authed) {
    return (
      <Shell>
        <div style={{ maxWidth: '360px', margin: '10vh auto 0', width: '100%' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
            <Lock size={20} color="#C9A84C" />
            <h1 style={{ fontFamily: 'var(--font-playfair, Georgia, serif)', fontSize: '26px', color: '#FFFFFF', fontWeight: 400, margin: 0 }}>Admin</h1>
          </div>
          <p style={{ fontFamily: 'var(--font-inter, sans-serif)', fontSize: '13px', color: '#6A7A88', marginBottom: '24px' }}>
            Enter the admin password to manage pricing.
          </p>
          <form onSubmit={login}>
            <input
              type="password" value={pw} onChange={e => setPw(e.target.value)}
              placeholder="Password" autoFocus
              style={{ width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(201,168,76,0.25)', borderRadius: '6px', padding: '13px 15px', fontFamily: 'var(--font-inter, sans-serif)', fontSize: '15px', color: '#F0EBE0', outline: 'none', boxSizing: 'border-box', marginBottom: '12px' }}
            />
            {logErr && <p style={{ fontFamily: 'var(--font-inter, sans-serif)', fontSize: '13px', color: '#E07070', marginBottom: '12px' }}>{logErr}</p>}
            <button type="submit" disabled={loggingIn} style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', background: 'linear-gradient(135deg, #F0D77A, #C9A84C)', color: '#0A0F1C', padding: '14px', borderRadius: '6px', border: 'none', cursor: loggingIn ? 'not-allowed' : 'pointer', fontFamily: 'var(--font-inter, sans-serif)', fontSize: '13px', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase' }}>
              {loggingIn ? <Loader2 size={15} style={{ animation: 'spin 1s linear infinite' }} /> : 'Sign In'}
            </button>
          </form>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </Shell>
    )
  }

  if (!config) return null

  const product = PRODUCTS.find(p => p.id === selectedProduct) ?? PRODUCTS[0]
  const from    = startingFrom(config, product.id)

  return (
    <Shell>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', marginBottom: '10px' }}>
        <div>
          <Link href="/admin" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontFamily: 'var(--font-inter, sans-serif)', fontSize: '12px', color: '#6A7A88', textDecoration: 'none', marginBottom: '8px' }}>
            <ArrowLeft size={13} /> Dashboard
          </Link>
          <h1 style={{ fontFamily: 'var(--font-playfair, Georgia, serif)', fontSize: '28px', color: '#FFFFFF', fontWeight: 400, margin: 0 }}>Pricing Management</h1>
        </div>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button onClick={() => patch(c => {
            const d = clone(DEFAULT_PRICING_CONFIG)
            c.sizes = d.sizes; c.packages = d.packages; c.prices = d.prices
          })} style={ghostBtn}><RotateCcw size={14} /> Reset to defaults</button>
          <button onClick={logout} style={ghostBtn}><LogOut size={14} /> Sign out</button>
          <button onClick={save} disabled={saving} style={{ ...primaryBtn, opacity: saving ? 0.7 : 1 }}>
            {saving ? <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} /> : <Save size={14} />} Save changes
          </button>
        </div>
      </div>

      {(saveMsg || saveErr) && (
        <p style={{ fontFamily: 'var(--font-inter, sans-serif)', fontSize: '13px', color: saveErr ? '#E07070' : '#4ADE80', display: 'flex', alignItems: 'center', gap: '7px', marginBottom: '24px' }}>
          {saveErr ? null : <Check size={14} />}{saveErr || saveMsg}
        </p>
      )}
      <p style={{ fontFamily: 'var(--font-inter, sans-serif)', fontSize: '12px', color: '#5A6A7A', marginTop: '4px', marginBottom: '32px' }}>
        Changes are live the moment you save — every product card and pricing modal reads these values.
      </p>

      {/* ── Window Sizes ── */}
      <Section title="Window Sizes" subtitle="What a customer picks first. Disable a size to hide it everywhere and drop it from every price grid.">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {config.sizes.slice().sort((a, b) => a.sortOrder - b.sortOrder).map(size => (
            <SizeRow
              key={size.id}
              size={size}
              onChange={(field, value) => patch(c => {
                const s = c.sizes.find(x => x.id === size.id); if (s) Object.assign(s, { [field]: value })
              })}
              onRemove={() => patch(c => { c.sizes = c.sizes.filter(x => x.id !== size.id) })}
            />
          ))}
        </div>
        <button onClick={() => patch(c => {
          const id = newId('size')
          c.sizes.push({ id, label: 'New Size', sublabel: '', enabled: true, sortOrder: c.sizes.length + 1 })
        })} style={{ ...ghostBtn, marginTop: '14px' }}><Plus size={14} /> Add size</button>
      </Section>

      {/* ── Service Packages ── */}
      <Section title="Service Packages" subtitle="Names, descriptions and included features. One feature per line.">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '18px' }}>
          {config.packages.slice().sort((a, b) => a.sortOrder - b.sortOrder).map(pkg => (
            <PackageCard
              key={pkg.id}
              pkg={pkg}
              onChange={(field, value) => patch(c => {
                const p = c.packages.find(x => x.id === pkg.id); if (p) Object.assign(p, { [field]: value })
              })}
              onRemove={() => patch(c => { c.packages = c.packages.filter(x => x.id !== pkg.id) })}
            />
          ))}
        </div>
        <button onClick={() => patch(c => {
          const id = newId('pkg')
          c.packages.push({ id, name: 'New Package', tagline: '', features: [], enabled: true, sortOrder: c.packages.length + 1 })
        })} style={{ ...ghostBtn, marginTop: '16px' }}><Plus size={14} /> Add package</button>
      </Section>

      {/* ── Product Prices ── */}
      <Section title="Product Prices" subtitle="Each product has its own grid. “Starting From” on the site is the lowest active cell — it updates automatically.">
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap', marginBottom: '20px' }}>
          <label style={{ fontFamily: 'var(--font-inter, sans-serif)', fontSize: '12px', color: '#8A9AA8' }}>Product</label>
          <select value={selectedProduct} onChange={e => setSelectedProduct(Number(e.target.value))} style={{ ...inputStyle, width: 'auto', minWidth: '260px', cursor: 'pointer' }}>
            {PRODUCTS.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
          {from && (
            <span style={{ fontFamily: 'var(--font-inter, sans-serif)', fontSize: '12px', color: '#8A9AA8' }}>
              Starting from <span style={{ color: '#E8C96D' }}>{formatKes(from.amount)}</span> · {from.sizeLabel} · {from.packageName}
            </span>
          )}
        </div>

        <div style={{ overflowX: 'auto', border: '1px solid rgba(201,168,76,0.12)', borderRadius: '10px' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: `${180 + config.packages.length * 150}px` }}>
            <thead>
              <tr>
                <th style={th}>Size \ Package</th>
                {config.packages.slice().sort((a, b) => a.sortOrder - b.sortOrder).map(pkg => (
                  <th key={pkg.id} style={{ ...th, textAlign: 'right', color: pkg.enabled ? '#E8C96D' : '#5A6A7A' }}>
                    {pkg.name}{!pkg.enabled && ' (off)'}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {config.sizes.slice().sort((a, b) => a.sortOrder - b.sortOrder).map(size => (
                <tr key={size.id} style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}>
                  <td style={{ ...td, color: size.enabled ? '#F0EBE0' : '#5A6A7A' }}>{size.label}{!size.enabled && ' (off)'}</td>
                  {config.packages.slice().sort((a, b) => a.sortOrder - b.sortOrder).map(pkg => (
                    <td key={pkg.id} style={{ ...td, textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                        <span style={{ color: '#5A6A7A', fontSize: '12px' }}>KES</span>
                        <input
                          type="number" min={0} step={500}
                          value={config.prices[String(product.id)]?.[size.id]?.[pkg.id] ?? ''}
                          onChange={e => {
                            const v = e.target.value === '' ? 0 : Math.max(0, Number(e.target.value))
                            patch(c => {
                              const key = String(product.id)
                              c.prices[key] = c.prices[key] ?? {}
                              c.prices[key][size.id] = c.prices[key][size.id] ?? {}
                              c.prices[key][size.id][pkg.id] = v
                            })
                          }}
                          style={{ ...inputStyle, width: '110px', textAlign: 'right', padding: '9px 10px' }}
                        />
                      </div>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </Shell>
  )
}

// ─── Sub-components ────────────────────────────────────────────────────────────

function SizeRow({ size, onChange, onRemove }: {
  size: SizeDef
  onChange: (field: keyof SizeDef, value: string | number | boolean) => void
  onRemove: () => void
}) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '150px 1fr 90px auto auto', gap: '10px', alignItems: 'center', padding: '12px', borderRadius: '8px', border: '1px solid rgba(201,168,76,0.12)', background: 'rgba(255,255,255,0.015)' }}>
      <input value={size.label} onChange={e => onChange('label', e.target.value)} placeholder="Label" style={inputStyle} />
      <input value={size.sublabel} onChange={e => onChange('sublabel', e.target.value)} placeholder="Hint (e.g. up to 180cm)" style={inputStyle} />
      <input type="number" value={size.sortOrder} onChange={e => onChange('sortOrder', Number(e.target.value))} title="Order" style={inputStyle} />
      <Toggle on={size.enabled} onClick={() => onChange('enabled', !size.enabled)} />
      <button onClick={onRemove} title="Remove size" style={iconDanger}><Trash2 size={14} /></button>
    </div>
  )
}

function PackageCard({ pkg, onChange, onRemove }: {
  pkg: PackageDef
  onChange: (field: keyof PackageDef, value: string | number | boolean | string[]) => void
  onRemove: () => void
}) {
  return (
    <div style={{ padding: '18px', borderRadius: '10px', border: '1px solid rgba(201,168,76,0.14)', background: 'rgba(255,255,255,0.015)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
        <input value={pkg.name} onChange={e => onChange('name', e.target.value)} placeholder="Package name" style={{ ...inputStyle, fontFamily: 'var(--font-playfair, Georgia, serif)', fontSize: '16px' }} />
        <Toggle on={pkg.enabled} onClick={() => onChange('enabled', !pkg.enabled)} />
        <button onClick={onRemove} title="Remove package" style={iconDanger}><Trash2 size={14} /></button>
      </div>
      <input value={pkg.tagline} onChange={e => onChange('tagline', e.target.value)} placeholder="One-line description" style={{ ...inputStyle, marginBottom: '10px' }} />
      <label style={{ display: 'block', fontFamily: 'var(--font-inter, sans-serif)', fontSize: '11px', color: '#8A9AA8', marginBottom: '6px' }}>Included features (one per line)</label>
      <textarea
        value={pkg.features.join('\n')}
        onChange={e => onChange('features', e.target.value.split('\n'))}
        rows={7}
        style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.6, fontFamily: 'var(--font-inter, sans-serif)' }}
      />
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '10px' }}>
        <label style={{ fontFamily: 'var(--font-inter, sans-serif)', fontSize: '11px', color: '#8A9AA8' }}>Order</label>
        <input type="number" value={pkg.sortOrder} onChange={e => onChange('sortOrder', Number(e.target.value))} style={{ ...inputStyle, width: '70px' }} />
      </div>
    </div>
  )
}

function Toggle({ on, onClick }: { on: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick} title={on ? 'Enabled' : 'Disabled'} style={{
      display: 'inline-flex', alignItems: 'center', gap: '6px', flexShrink: 0,
      background: on ? 'rgba(74,222,128,0.12)' : 'rgba(255,255,255,0.04)',
      border: `1px solid ${on ? 'rgba(74,222,128,0.4)' : 'rgba(255,255,255,0.12)'}`,
      color: on ? '#4ADE80' : '#6A7A88', padding: '8px 12px', borderRadius: '6px', cursor: 'pointer',
      fontFamily: 'var(--font-inter, sans-serif)', fontSize: '11px', fontWeight: 600, whiteSpace: 'nowrap',
    }}>
      <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: on ? '#4ADE80' : '#6A7A88' }} />
      {on ? 'On' : 'Off'}
    </button>
  )
}

function Section({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <section style={{ marginBottom: '44px' }}>
      <h2 style={{ fontFamily: 'var(--font-playfair, Georgia, serif)', fontSize: '20px', color: '#FFFFFF', fontWeight: 400, margin: '0 0 4px' }}>{title}</h2>
      <p style={{ fontFamily: 'var(--font-inter, sans-serif)', fontSize: '12.5px', color: '#5A6A7A', margin: '0 0 18px', maxWidth: '640px', lineHeight: 1.6 }}>{subtitle}</p>
      {children}
    </section>
  )
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <main style={{ background: '#0D1B2E', minHeight: '100vh', padding: '48px 5vw', maxWidth: '1200px', margin: '0 auto' }}>
      {children}
    </main>
  )
}

// ─── Styles ────────────────────────────────────────────────────────────────────

const inputStyle: React.CSSProperties = {
  width: '100%', boxSizing: 'border-box', background: 'rgba(255,255,255,0.04)',
  border: '1px solid rgba(201,168,76,0.22)', borderRadius: '6px', padding: '10px 12px',
  fontFamily: 'var(--font-inter, sans-serif)', fontSize: '14px', color: '#F0EBE0', outline: 'none',
}
const ghostBtn: React.CSSProperties = {
  display: 'inline-flex', alignItems: 'center', gap: '7px', background: 'transparent',
  border: '1px solid rgba(201,168,76,0.3)', color: '#C9A84C', padding: '9px 14px',
  borderRadius: '6px', cursor: 'pointer', fontFamily: 'var(--font-inter, sans-serif)',
  fontSize: '12px', fontWeight: 600,
}
const primaryBtn: React.CSSProperties = {
  display: 'inline-flex', alignItems: 'center', gap: '7px',
  background: 'linear-gradient(135deg, #F0D77A, #C9A84C)', border: 'none', color: '#0A0F1C',
  padding: '9px 18px', borderRadius: '6px', cursor: 'pointer',
  fontFamily: 'var(--font-inter, sans-serif)', fontSize: '12px', fontWeight: 700,
}
const iconDanger: React.CSSProperties = {
  display: 'grid', placeItems: 'center', width: '34px', height: '34px', flexShrink: 0,
  background: 'transparent', border: '1px solid rgba(224,112,112,0.35)', color: '#E07070',
  borderRadius: '6px', cursor: 'pointer',
}
const th: React.CSSProperties = {
  textAlign: 'left', padding: '13px 16px', fontFamily: 'var(--font-inter, sans-serif)',
  fontSize: '10px', letterSpacing: '1.5px', textTransform: 'uppercase', color: '#8A9AA8',
  background: 'rgba(255,255,255,0.02)', whiteSpace: 'nowrap',
}
const td: React.CSSProperties = {
  padding: '12px 16px', fontFamily: 'var(--font-inter, sans-serif)', fontSize: '14px',
  color: '#C6CFD8', verticalAlign: 'middle', whiteSpace: 'nowrap',
}
