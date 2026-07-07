'use client'

import { useEffect, useState } from 'react'
import { Loader2, Lock, LogOut, RefreshCw, Users, Wallet, Clock } from 'lucide-react'
import { API_URL } from '@/app/lib/api'

type OrderStatus = 'pending_payment' | 'confirmed' | 'in_production' | 'ready' | 'delivered'

type Order = {
  order_number: string
  status: OrderStatus
  name: string
  phone: string
  deposit_ksh: number
  discount_pct: number
  total_ksh: number
  mpesa_receipt: string | null
  created_at: string
  is_founding: boolean
}

type Totals = { backers: number; collected_ksh: number; pending: number }

const FLOW: OrderStatus[] = ['confirmed', 'in_production', 'ready', 'delivered']

const STATUS_LABEL: Record<OrderStatus, string> = {
  pending_payment: 'Pending payment',
  confirmed:       'Confirmed',
  in_production:   'In production',
  ready:           'Ready',
  delivered:       'Delivered',
}
const STATUS_COLOR: Record<OrderStatus, string> = {
  pending_payment: '#E0A050',
  confirmed:       '#4CAF82',
  in_production:   '#C9A84C',
  ready:           '#5AA9E6',
  delivered:       '#8A96A4',
}

const fmt = (n: number) => 'KSh ' + n.toLocaleString('en-KE')
const fmtDate = (iso: string) => {
  try { return new Date(iso).toLocaleString('en-KE', { dateStyle: 'medium', timeStyle: 'short' }) }
  catch { return iso }
}

export default function AdminClient() {
  const [authed,  setAuthed]  = useState<boolean | null>(null) // null = checking
  const [orders,  setOrders]  = useState<Order[]>([])
  const [totals,  setTotals]  = useState<Totals | null>(null)
  const [loading, setLoading] = useState(false)

  // Login form
  const [pw,      setPw]      = useState('')
  const [logErr,  setLogErr]  = useState('')
  const [loggingIn, setLoggingIn] = useState(false)

  async function load() {
    setLoading(true)
    try {
      const res = await fetch(`${API_URL}/admin/orders`, { cache: 'no-store' })
      if (res.status === 401) { setAuthed(false); return }
      const data = await res.json()
      if (data.ok) {
        setOrders(data.orders)
        setTotals(data.totals)
        setAuthed(true)
      } else setAuthed(false)
    } catch {
      setAuthed(false)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  async function login(e: React.FormEvent) {
    e.preventDefault()
    setLogErr('')
    setLoggingIn(true)
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
    setAuthed(false); setOrders([]); setTotals(null)
  }

  async function setStatus(orderNumber: string, status: OrderStatus) {
    // Optimistic update
    setOrders(prev => prev.map(o => o.order_number === orderNumber ? { ...o, status } : o))
    try {
      await fetch(`${API_URL}/admin/orders/${orderNumber}/status`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      })
    } catch {
      load() // reload on failure to resync
    }
  }

  // ── Checking ──────────────────────────────────────────────────────────────
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

  // ── Login ─────────────────────────────────────────────────────────────────
  if (!authed) {
    return (
      <Shell>
        <div style={{ maxWidth: '360px', margin: '10vh auto 0', width: '100%' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
            <Lock size={20} color="#C9A84C" />
            <h1 style={{ fontFamily: 'var(--font-playfair, Georgia, serif)', fontSize: '26px', color: '#FFFFFF', fontWeight: 400, margin: 0 }}>Admin</h1>
          </div>
          <p style={{ fontFamily: 'var(--font-inter, sans-serif)', fontSize: '13px', color: '#6A7A88', marginBottom: '24px' }}>
            Enter the admin password to view backings.
          </p>
          <form onSubmit={login}>
            <input
              type="password" value={pw} onChange={e => setPw(e.target.value)}
              placeholder="Password" autoFocus
              style={{ width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(201,168,76,0.25)', borderRadius: '6px', padding: '13px 15px', fontFamily: 'var(--font-inter, sans-serif)', fontSize: '15px', color: '#F0EBE0', outline: 'none', boxSizing: 'border-box', marginBottom: '12px' }}
            />
            {logErr && <p style={{ fontFamily: 'var(--font-inter, sans-serif)', fontSize: '13px', color: '#E07070', marginBottom: '12px' }}>{logErr}</p>}
            <button
              type="submit" disabled={loggingIn}
              style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', background: 'linear-gradient(135deg, #F0D77A, #C9A84C)', color: '#0A0F1C', padding: '14px', borderRadius: '6px', border: 'none', cursor: loggingIn ? 'not-allowed' : 'pointer', fontFamily: 'var(--font-inter, sans-serif)', fontSize: '13px', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase' }}
            >
              {loggingIn ? <Loader2 size={15} style={{ animation: 'spin 1s linear infinite' }} /> : 'Sign In'}
            </button>
          </form>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </Shell>
    )
  }

  // ── Dashboard ─────────────────────────────────────────────────────────────
  return (
    <Shell>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', marginBottom: '28px' }}>
        <h1 style={{ fontFamily: 'var(--font-playfair, Georgia, serif)', fontSize: '28px', color: '#FFFFFF', fontWeight: 400, margin: 0 }}>Backings</h1>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={load} style={ghostBtn}>
            <RefreshCw size={14} style={loading ? { animation: 'spin 1s linear infinite' } : undefined} /> Refresh
          </button>
          <button onClick={logout} style={ghostBtn}><LogOut size={14} /> Sign out</button>
        </div>
      </div>

      {/* Totals */}
      {totals && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', marginBottom: '32px' }}>
          <StatCard icon={<Users size={18} color="#4CAF82" />} label="Backers" value={String(totals.backers)} />
          <StatCard icon={<Wallet size={18} color="#C9A84C" />} label="Collected" value={fmt(totals.collected_ksh)} />
          <StatCard icon={<Clock size={18} color="#E0A050" />} label="Pending" value={String(totals.pending)} />
        </div>
      )}

      {/* Table */}
      <div style={{ overflowX: 'auto', border: '1px solid rgba(201,168,76,0.12)', borderRadius: '10px' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '860px' }}>
          <thead>
            <tr>
              {['Order', 'Customer', 'Package', 'Paid', 'Receipt', 'Date', 'Status'].map(h => (
                <th key={h} style={th}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 && (
              <tr><td colSpan={7} style={{ ...td, textAlign: 'center', color: '#4A5A6A', padding: '32px' }}>No backings yet.</td></tr>
            )}
            {orders.map(o => (
              <tr key={o.order_number} style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}>
                <td style={{ ...td, fontFamily: 'var(--font-playfair, Georgia, serif)', color: '#C9A84C', letterSpacing: '1px' }}>{o.order_number}</td>
                <td style={td}>
                  <div style={{ color: '#F0EBE0' }}>{o.name}</div>
                  <div style={{ color: '#6A7A88', fontSize: '12px' }}>{o.phone}</div>
                </td>
                <td style={td}>{fmt(o.deposit_ksh)} · <span style={{ color: '#C9A84C' }}>{o.discount_pct}% off</span></td>
                <td style={{ ...td, color: '#F0EBE0' }}>{fmt(o.deposit_ksh)}</td>
                <td style={{ ...td, color: '#6A7A88', fontSize: '12px' }}>{o.mpesa_receipt || '—'}</td>
                <td style={{ ...td, color: '#6A7A88', fontSize: '12px', whiteSpace: 'nowrap' }}>{fmtDate(o.created_at)}</td>
                <td style={td}>
                  {o.status === 'pending_payment' ? (
                    <span style={{ display: 'inline-block', padding: '4px 10px', borderRadius: '20px', fontSize: '11px', fontFamily: 'var(--font-inter, sans-serif)', color: STATUS_COLOR.pending_payment, background: 'rgba(224,160,80,0.12)', border: '1px solid rgba(224,160,80,0.3)' }}>
                      {STATUS_LABEL.pending_payment}
                    </span>
                  ) : (
                    <select
                      value={o.status}
                      onChange={e => setStatus(o.order_number, e.target.value as OrderStatus)}
                      style={{ background: 'rgba(255,255,255,0.04)', border: `1px solid ${STATUS_COLOR[o.status]}55`, borderRadius: '6px', padding: '6px 10px', color: STATUS_COLOR[o.status], fontFamily: 'var(--font-inter, sans-serif)', fontSize: '12px', cursor: 'pointer', outline: 'none' }}
                    >
                      {FLOW.map(s => <option key={s} value={s} style={{ background: '#0D1B2E', color: '#F0EBE0' }}>{STATUS_LABEL[s]}</option>)}
                    </select>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </Shell>
  )
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <main style={{ background: '#0D1B2E', minHeight: '100vh', padding: '48px 5vw', maxWidth: '1200px', margin: '0 auto' }}>
      {children}
    </main>
  )
}

function StatCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div style={{ border: '1px solid rgba(201,168,76,0.15)', borderRadius: '10px', padding: '18px 20px', background: 'rgba(255,255,255,0.02)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
        {icon}
        <span style={{ fontFamily: 'var(--font-inter, sans-serif)', fontSize: '11px', color: '#6A7A88', letterSpacing: '1.5px', textTransform: 'uppercase' }}>{label}</span>
      </div>
      <div style={{ fontFamily: 'var(--font-playfair, Georgia, serif)', fontSize: '28px', color: '#FFFFFF' }}>{value}</div>
    </div>
  )
}

const ghostBtn: React.CSSProperties = {
  display: 'inline-flex', alignItems: 'center', gap: '7px',
  background: 'transparent', border: '1px solid rgba(201,168,76,0.3)', color: '#C9A84C',
  padding: '9px 14px', borderRadius: '6px', cursor: 'pointer',
  fontFamily: 'var(--font-inter, sans-serif)', fontSize: '12px', fontWeight: 600,
}
const th: React.CSSProperties = {
  textAlign: 'left', padding: '14px 16px', fontFamily: 'var(--font-inter, sans-serif)',
  fontSize: '10px', letterSpacing: '1.5px', textTransform: 'uppercase', color: '#6A7A88',
  background: 'rgba(255,255,255,0.02)', whiteSpace: 'nowrap',
}
const td: React.CSSProperties = {
  padding: '14px 16px', fontFamily: 'var(--font-inter, sans-serif)', fontSize: '14px',
  color: '#C6CFD8', verticalAlign: 'top',
}
