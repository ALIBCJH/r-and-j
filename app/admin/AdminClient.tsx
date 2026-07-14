'use client'

import { useEffect, useState } from 'react'
import { Loader2, Lock, LogOut, RefreshCw, ClipboardList, Trash2 } from 'lucide-react'
import { API_URL } from '@/app/lib/api'

type Reservation = {
  name: string
  phone: string
  email: string
  product_name: string
  message?: string
  created_at: string
}

const fmtDate = (iso: string) => {
  try { return new Date(iso).toLocaleString('en-KE', { dateStyle: 'medium', timeStyle: 'short' }) }
  catch { return iso }
}

export default function AdminClient() {
  const [authed, setAuthed] = useState<boolean | null>(null) // null = checking
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [loading, setLoading] = useState(false)

  // Login form
  const [pw,        setPw]        = useState('')
  const [logErr,    setLogErr]    = useState('')
  const [loggingIn, setLoggingIn] = useState(false)

  async function load() {
    setLoading(true)
    try {
      const res = await fetch(`${API_URL}/admin/waitlist`, { cache: 'no-store' })
      if (res.status === 401) { setAuthed(false); return }
      const data = await res.json()
      if (data.ok) {
        setReservations(data.reservations)
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
    setAuthed(false); setReservations([])
  }

  // Destructive: wipe every reservation for a clean slate. Double-gated.
  async function resetAll() {
    if (!window.confirm('This permanently deletes ALL reservations. This cannot be undone. Continue?')) return
    if (!window.confirm('Are you absolutely sure? The reservations list will be wiped for a clean slate.')) return
    try {
      const res = await fetch(`${API_URL}/admin/reset`, { method: 'POST' })
      const data = await res.json()
      if (data.ok) await load()
    } catch { /* ignore — a reload will resync */ }
  }

  // One-time cleanup: delete legacy backing/order records. Keeps reservations.
  async function purgeBackings() {
    if (!window.confirm('Delete all legacy backing records? Your reservations are kept. This cannot be undone.')) return
    try {
      const res = await fetch(`${API_URL}/admin/purge-orders`, { method: 'POST' })
      const data = await res.json()
      if (data.ok) {
        window.alert(`Removed ${data.cleared.orders} legacy backing record(s). Reservations kept.`)
        await load()
      }
    } catch { /* ignore */ }
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
            Enter the admin password to view reservations.
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

  // ── Dashboard (reservations only) ──────────────────────────────────────────
  return (
    <Shell>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', marginBottom: '28px' }}>
        <h1 style={{ fontFamily: 'var(--font-playfair, Georgia, serif)', fontSize: '28px', color: '#FFFFFF', fontWeight: 400, margin: 0 }}>Reservations</h1>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={load} style={ghostBtn}>
            <RefreshCw size={14} style={loading ? { animation: 'spin 1s linear infinite' } : undefined} /> Refresh
          </button>
          <button onClick={purgeBackings} style={dangerBtn}><Trash2 size={14} /> Purge backings</button>
          <button onClick={resetAll} style={dangerBtn}><Trash2 size={14} /> Clear data</button>
          <button onClick={logout} style={ghostBtn}><LogOut size={14} /> Sign out</button>
        </div>
      </div>

      {/* Count */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', marginBottom: '32px' }}>
        <StatCard icon={<ClipboardList size={18} color="#5AA9E6" />} label="Founding Customers" value={String(reservations.length)} />
      </div>

      {/* Reservations table */}
      <div style={{ overflowX: 'auto', border: '1px solid rgba(201,168,76,0.12)', borderRadius: '10px' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '820px' }}>
          <thead>
            <tr>
              {['Name', 'Contact', 'Package', 'Why R&J', 'Date'].map(h => (
                <th key={h} style={th}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {reservations.length === 0 && (
              <tr><td colSpan={5} style={{ ...td, textAlign: 'center', color: '#4A5A6A', padding: '32px' }}>No reservations yet.</td></tr>
            )}
            {reservations.map((r, i) => (
              <tr key={i} style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}>
                <td style={{ ...td, color: '#F0EBE0' }}>{r.name}</td>
                <td style={{ ...td, color: '#C6CFD8', fontSize: '13px' }}>{r.email || r.phone || '—'}</td>
                <td style={td}>{r.product_name || '—'}</td>
                <td style={{ ...td, color: '#C6CFD8', fontSize: '13px', maxWidth: '280px', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{r.message || '—'}</td>
                <td style={{ ...td, color: '#6A7A88', fontSize: '12px', whiteSpace: 'nowrap' }}>{fmtDate(r.created_at)}</td>
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
const dangerBtn: React.CSSProperties = {
  display: 'inline-flex', alignItems: 'center', gap: '7px',
  background: 'transparent', border: '1px solid rgba(224,112,112,0.4)', color: '#E07070',
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
