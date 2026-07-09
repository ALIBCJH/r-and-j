'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowRight, Star, Check } from 'lucide-react'
import LandingNavbar from '@/app/components/landing/Navbar'
import LandingFooter from '@/app/components/landing/Footer'
import { API_URL } from '@/app/lib/api'
import LaunchCountdown from '@/app/components/founding/LaunchCountdown'

// The curtain packages a founding customer can register interest in.
// Widths, priced from — final quote is confirmed at consultation.
const PACKAGES = [
  '1.2 Metre Curtain — From KES 6,000',
  '1.6 Metre Curtain — From KES 7,500',
  '2.0 Metre Curtain — From KES 8,500',
]

// ── Reserve-your-place form ───────────────────────────────────────────────────
// Free Founding-Customers registration. Captures name, one reachable contact,
// and which package they want, and posts to the waitlist endpoint. No payment.
function ReserveForm() {
  const [name,    setName]    = useState('')
  const [contact, setContact] = useState('')
  const [pkg,     setPkg]     = useState('')
  const [status,  setStatus]  = useState<'idle' | 'sending' | 'done' | 'error'>('idle')
  const [error,   setError]   = useState('')

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (!name.trim() || !contact.trim() || !pkg) {
      setError('Please add your name, a contact, and a curtain package.')
      return
    }
    // One field accepts either — route the value by whether it looks like an email.
    const isEmail = contact.includes('@')
    setStatus('sending')
    try {
      const res = await fetch(`${API_URL}/waitlist`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name:         name.trim(),
          email:        isEmail ? contact.trim() : '',
          phone:        isEmail ? '' : contact.trim(),
          product_name: pkg,
        }),
      })
      const data = await res.json()
      if (res.ok && data.ok) setStatus('done')
      else { setStatus('error'); setError(data.error || 'Something went wrong. Please try again.') }
    } catch {
      setStatus('error'); setError('Network error. Please try again.')
    }
  }

  if (status === 'done') {
    return (
      <div className="rsv-done">
        <div className="rsv-done-icon"><Check size={22} /></div>
        <h3 className="rsv-done-title">You&apos;re on the list.</h3>
        <p className="rsv-done-sub">
          Thank you for joining our Founding Customers. We&apos;ll be in touch the moment booking opens.
        </p>
      </div>
    )
  }

  return (
    <form className="rsv-form" onSubmit={submit} noValidate>
      <label className="rsv-label" htmlFor="rsv-name">Full Name *</label>
      <input
        id="rsv-name" className="rsv-input" type="text" value={name}
        onChange={e => setName(e.target.value)} placeholder="Your full name" autoComplete="name"
      />

      <label className="rsv-label" htmlFor="rsv-contact">Email Address or Phone Number *</label>
      <input
        id="rsv-contact" className="rsv-input" type="text" value={contact}
        onChange={e => setContact(e.target.value)}
        placeholder="you@email.com  or  07XX XXX XXX" autoComplete="email"
      />

      <label className="rsv-label">Which curtain package are you interested in? *</label>
      <div className="rsv-radios">
        {PACKAGES.map(p => (
          <label key={p} className={`rsv-radio${pkg === p ? ' rsv-radio-on' : ''}`}>
            <input type="radio" name="package" value={p} checked={pkg === p} onChange={() => setPkg(p)} />
            <span className="rsv-dot" />
            <span className="rsv-radio-text">{p}</span>
          </label>
        ))}
      </div>

      {error && <p className="rsv-error">{error}</p>}

      <button type="submit" className="rsv-submit" disabled={status === 'sending'}>
        {status === 'sending' ? 'Reserving…' : 'Reserve My Spot'}
      </button>

      <p className="rsv-fineprint">
        Free to join · No payment required · We&apos;ll notify you when booking opens
      </p>
    </form>
  )
}

export default function FoundingClient() {
  return (
    <main style={{ background: '#0D1B2E', minHeight: '100vh' }}>
      <LandingNavbar />

      <div style={{ paddingTop: 'calc(var(--rj-navbar-height) + 72px)', paddingLeft: '6vw', paddingRight: '6vw', maxWidth: '860px', margin: '0 auto', paddingBottom: '120px', textAlign: 'center' }}>

        {/* Badge */}
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '24px', padding: '6px 16px', borderRadius: '20px', background: 'rgba(201,168,76,0.1)', border: '1px solid rgba(201,168,76,0.3)' }}>
          <Star size={13} color="#C9A84C" />
          <span style={{ fontFamily: 'var(--font-inter, sans-serif)', fontSize: '11px', color: '#C9A84C', letterSpacing: '3px', textTransform: 'uppercase' }}>Pre-Launch · Founding Customers</span>
        </div>

        {/* Headline */}
        <h1 style={{ fontFamily: 'var(--font-playfair, Georgia, serif)', fontSize: 'clamp(34px, 6.5vw, 62px)', color: '#FFFFFF', fontWeight: 400, lineHeight: 1.07, marginBottom: '24px' }}>
          Reserve your place.{' '}
          <em style={{ color: '#C9A84C' }}>Be among the first.</em>
        </h1>

        {/* Statement */}
        <p style={{ fontFamily: 'var(--font-inter, sans-serif)', fontSize: 'clamp(16px, 2.2vw, 19px)', color: '#9AA6B4', lineHeight: 1.75, maxWidth: '620px', margin: '0 auto 40px' }}>
          We&apos;re about to launch. Join our Founding Customers list and we&apos;ll notify you the
          moment booking opens — so you&apos;re among the first to dress your windows with R&amp;J.
        </p>

        {/* Desire before the ask — let them try the studio first, free. */}
        <div style={{ marginBottom: '44px' }}>
          <Link href="/studio" className="fnd-ghost-cta">
            Preview fabrics and colours — free <ArrowRight size={15} />
          </Link>
        </div>

        {/* Countdown to launch (honest — a real, fixed date). */}
        <div style={{ marginBottom: '44px' }}>
          <LaunchCountdown />
        </div>

        {/* Reserve-your-place form */}
        <section id="reserve" className="rsv-wrap">
          <p className="rsv-eyebrow">Reserve Your Place</p>
          <p className="rsv-intro">
            Be among the first to experience R&amp;J Interiors. Join our Founding Customers list and
            we&apos;ll notify you when booking opens.
          </p>
          <ReserveForm />
        </section>

      </div>

      <style>{`
        /* ── Reserve-your-place card (glows to draw the eye) ─────────────── */
        .rsv-wrap {
          position: relative;
          max-width: 520px; margin: 0 auto; text-align: left;
          background: linear-gradient(180deg, rgba(201,168,76,0.07) 0%, rgba(255,255,255,0.02) 42%);
          border: 1px solid rgba(201,168,76,0.45);
          border-radius: 16px; padding: 34px 30px;
          box-shadow:
            0 0 0 1px rgba(201,168,76,0.12),
            0 0 34px rgba(201,168,76,0.20),
            0 24px 60px rgba(0,0,0,0.5);
          animation: rsvGlow 3.4s ease-in-out infinite;
        }
        @keyframes rsvGlow {
          0%, 100% {
            box-shadow:
              0 0 0 1px rgba(201,168,76,0.12),
              0 0 28px rgba(201,168,76,0.16),
              0 24px 60px rgba(0,0,0,0.5);
            border-color: rgba(201,168,76,0.38);
          }
          50% {
            box-shadow:
              0 0 0 1px rgba(201,168,76,0.22),
              0 0 48px rgba(201,168,76,0.36),
              0 24px 60px rgba(0,0,0,0.5);
            border-color: rgba(201,168,76,0.68);
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .rsv-wrap { animation: none; }
        }
        .rsv-eyebrow {
          font-family: var(--font-inter, sans-serif);
          font-size: 11px; color: #C9A84C; letter-spacing: 4px;
          text-transform: uppercase; margin-bottom: 12px; text-align: center;
        }
        .rsv-intro {
          font-family: var(--font-inter, sans-serif);
          font-size: 14px; color: #9AA6B4; line-height: 1.7;
          margin: 0 auto 26px; text-align: center; max-width: 420px;
        }
        .rsv-form { display: flex; flex-direction: column; }
        .rsv-label {
          font-family: var(--font-inter, sans-serif);
          font-size: 12px; color: #C9A84C; letter-spacing: 1px; margin-bottom: 8px;
        }
        .rsv-input {
          font-family: var(--font-inter, sans-serif); font-size: 15px; color: #F0EBE0;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(201,168,76,0.25); border-radius: 8px;
          padding: 13px 14px; margin-bottom: 20px; outline: none;
          transition: border-color 0.2s ease;
        }
        .rsv-input::placeholder { color: #5A6A78; }
        .rsv-input:focus { border-color: #C9A84C; }
        .rsv-radios { display: flex; flex-direction: column; gap: 10px; margin-bottom: 24px; }
        .rsv-radio {
          display: flex; align-items: center; gap: 12px; cursor: pointer;
          padding: 14px 16px; border-radius: 8px;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(201,168,76,0.2);
          transition: border-color 0.2s ease, background 0.2s ease;
        }
        .rsv-radio-on { border-color: #C9A84C; background: rgba(201,168,76,0.08); }
        .rsv-radio input { position: absolute; opacity: 0; width: 0; height: 0; }
        .rsv-dot {
          width: 18px; height: 18px; border-radius: 50%;
          border: 2px solid rgba(201,168,76,0.5); flex-shrink: 0;
          position: relative; transition: border-color 0.2s ease;
        }
        .rsv-radio-on .rsv-dot { border-color: #C9A84C; }
        .rsv-radio-on .rsv-dot::after {
          content: ''; position: absolute; inset: 3px;
          border-radius: 50%; background: #C9A84C;
        }
        .rsv-radio-text {
          font-family: var(--font-inter, sans-serif); font-size: 14px; color: #E4E9EE;
        }
        .rsv-error {
          font-family: var(--font-inter, sans-serif); font-size: 13px;
          color: #E0857A; margin: 0 0 16px;
        }
        .rsv-submit {
          font-family: var(--font-inter, sans-serif); font-size: 14px;
          font-weight: 700; letter-spacing: 1px; text-transform: uppercase;
          color: #0A0F1C;
          background: linear-gradient(135deg, #F0D77A 0%, #C9A84C 50%, #A67C2E 100%);
          border: none; border-radius: 6px; padding: 16px; cursor: pointer;
          transition: transform 0.15s ease, box-shadow 0.2s ease;
        }
        .rsv-submit:hover:not(:disabled) {
          transform: translateY(-2px); box-shadow: 0 12px 30px rgba(201,168,76,0.28);
        }
        .rsv-submit:disabled { opacity: 0.7; cursor: default; }
        .rsv-fineprint {
          font-family: var(--font-inter, sans-serif); font-size: 12px;
          color: #3A4A58; text-align: center; margin: 16px 0 0;
        }
        .rsv-done { text-align: center; padding: 20px 8px; }
        .rsv-done-icon {
          width: 48px; height: 48px; border-radius: 50%;
          background: rgba(201,168,76,0.14); color: #C9A84C;
          display: flex; align-items: center; justify-content: center; margin: 0 auto 18px;
        }
        .rsv-done-title {
          font-family: var(--font-playfair, Georgia, serif);
          font-size: 24px; color: #FFFFFF; font-weight: 400; margin-bottom: 10px;
        }
        .rsv-done-sub {
          font-family: var(--font-inter, sans-serif); font-size: 14px;
          color: #9AA6B4; line-height: 1.7; max-width: 360px; margin: 0 auto;
        }

        /* ── Ghost CTA (used by the hero "preview — free" link) ─────────── */
        .fnd-ghost-cta {
          display: inline-flex; align-items: center; gap: 8px;
          font-family: var(--font-inter, sans-serif);
          font-size: 12px; font-weight: 700; letter-spacing: 1px;
          text-transform: uppercase; color: #C9A84C; text-decoration: none;
          border: 1px solid rgba(201,168,76,0.5); border-radius: 5px;
          padding: 13px 24px; transition: background 0.2s ease, color 0.2s ease, border-color 0.2s ease;
        }
        .fnd-ghost-cta:hover {
          background: linear-gradient(135deg, #F0D77A, #C9A84C);
          color: #0A0F1C; border-color: transparent;
        }
      `}</style>

      <LandingFooter />
    </main>
  )
}
