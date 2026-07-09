'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
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

// Who a founding customer is trusting. Faces + a one-line "why" convert a
// hesitant visitor better than any amount of feature copy.
const FOUNDERS = [
  {
    name: 'Rose Kabathi',
    role: 'Co-Founder & Design Principal',
    why: 'Every home deserves fabric that changes the room — not just covers a window.',
    img: '/assets/rosedesigner.jpeg',
    alt: 'Rose Kabathi, Co-Founder & Design Principal of R&J Interiors',
    objectPos: 'center',
  },
  {
    name: 'Simon Juma',
    role: 'Co-Founder & Tech Lead',
    why: 'We built the studio so you can preview fabrics and colours before you spend a shilling.',
    img: '/assets/jumafounder.jpeg',
    alt: 'Simon Juma, Co-Founder & Tech Lead of R&J Interiors',
    objectPos: 'center top',
  },
]

// Proof we can deliver something beautiful — real Kenyan homes, everyday spaces.
const PROOF = [
  { src: '/assets/image4.png', alt: 'Neutral linen curtains and sheers in a bright living room' },
  { src: '/assets/image2.png', alt: 'Sage-green curtains framing a sunlit bedroom window' },
  { src: '/assets/image8.png', alt: 'Warm terracotta curtains in a living room with African decor' },
  { src: '/assets/image5.png', alt: 'Rust curtains and sheers in a cozy dining corner at dusk' },
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

      <div style={{ paddingTop: 'calc(var(--rj-navbar-height) + 72px)', paddingLeft: '6vw', paddingRight: '6vw', maxWidth: '860px', margin: '0 auto', paddingBottom: '110px', textAlign: 'center' }}>

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

      {/* ── Who you're joining ─────────────────────────────────────────────── */}
      <section className="fnd-block">
        <div className="fnd-inner">
          <p className="fnd-eyebrow">Who You&apos;re Joining</p>
          <h2 className="fnd-h2">Two founders from Nyeri. <em>One promise.</em></h2>
          <p className="fnd-lead">
            R&amp;J is Rose &amp; Juma — a designer and an engineer betting everything on one idea:
            that buying beautiful curtains should feel certain, not risky. Join our founding customers
            today and you&apos;re first in line when we open — measured, made, and installed by the two
            people whose name is on the door.
          </p>

          <div className="fnd-founders">
            {FOUNDERS.map(f => (
              <div key={f.name} className="fnd-founder">
                <div className="fnd-portrait">
                  <Image
                    src={f.img} alt={f.alt} fill
                    sizes="(max-width: 720px) 100vw, 320px"
                    style={{ objectFit: 'cover', objectPosition: f.objectPos }}
                  />
                </div>
                <p className="fnd-founder-name">{f.name}</p>
                <p className="fnd-founder-role">{f.role}</p>
                <p className="fnd-founder-why">&ldquo;{f.why}&rdquo;</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Proof we can make this ─────────────────────────────────────────── */}
      <section className="fnd-block fnd-block-alt">
        <div className="fnd-inner">
          <p className="fnd-eyebrow">Our Work</p>
          <h2 className="fnd-h2">See it before you spend a shilling.</h2>
          <p className="fnd-lead">
            Real fabric, real rooms, real craft. And with our online studio you can preview curtain
            fabrics and colours <em>before</em> we launch — so you know the kind of work you&apos;re
            reserving.
          </p>

          <div className="fnd-proof-grid">
            {PROOF.map(p => (
              <div key={p.src} className="fnd-proof-item">
                <Image src={p.src} alt={p.alt} fill sizes="(max-width: 720px) 50vw, 260px" style={{ objectFit: 'cover' }} />
              </div>
            ))}
          </div>

          <Link href="/studio" className="fnd-ghost-cta">
            Open the studio <ArrowRight size={15} />
          </Link>
        </div>
      </section>

      {/* ── Final CTA ──────────────────────────────────────────────────────── */}
      <section className="fnd-final">
        <h2 className="fnd-h2">Ready to reserve your place?</h2>
        <a href="#reserve" className="fnd-final-cta">
          Reserve my spot <ArrowRight size={16} />
        </a>
        <p style={{ fontFamily: 'var(--font-inter, sans-serif)', fontSize: '12px', color: '#3A4A58', marginTop: '18px' }}>
          Free to join · No payment required · We&apos;ll notify you when booking opens
        </p>
      </section>

      <style>{`
        /* ── Reserve-your-place form ─────────────────────────────────────── */
        .rsv-wrap {
          max-width: 520px; margin: 0 auto; text-align: left;
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(201,168,76,0.22);
          border-radius: 14px; padding: 32px 28px;
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

        /* ── Trust / proof / final-CTA sections ─────────────────────────── */
        .fnd-block {
          padding: 84px 6vw;
          border-top: 1px solid rgba(201,168,76,0.12);
        }
        .fnd-block-alt { background: rgba(255,255,255,0.015); }
        .fnd-inner { max-width: 1080px; margin: 0 auto; text-align: center; }
        .fnd-eyebrow {
          font-family: var(--font-inter, sans-serif);
          font-size: 11px; color: #C9A84C; letter-spacing: 4px;
          text-transform: uppercase; margin-bottom: 16px;
        }
        .fnd-h2 {
          font-family: var(--font-playfair, Georgia, serif);
          font-size: clamp(28px, 4.4vw, 44px); color: #FFFFFF;
          font-weight: 400; line-height: 1.14; margin-bottom: 20px;
        }
        .fnd-h2 em { color: #C9A84C; font-style: italic; }
        .fnd-lead {
          font-family: var(--font-inter, sans-serif);
          font-size: clamp(15px, 1.9vw, 17px); color: #9AA6B4;
          line-height: 1.75; max-width: 620px; margin: 0 auto 52px;
        }
        .fnd-founders {
          display: grid; grid-template-columns: repeat(2, 1fr);
          gap: 40px; max-width: 720px; margin: 0 auto;
        }
        .fnd-founder { display: flex; flex-direction: column; align-items: center; }
        .fnd-portrait {
          position: relative; width: 100%; aspect-ratio: 4/5;
          max-width: 320px; border-radius: 12px; overflow: hidden;
          border: 1px solid rgba(201,168,76,0.22);
          box-shadow: 0 22px 54px rgba(0,0,0,0.45); margin-bottom: 22px;
        }
        .fnd-founder-name {
          font-family: var(--font-playfair, Georgia, serif);
          font-size: 24px; color: #FFFFFF; font-weight: 400; margin-bottom: 4px;
        }
        .fnd-founder-role {
          font-family: var(--font-inter, sans-serif);
          font-size: 12px; color: #8A96A4; letter-spacing: 1px; margin-bottom: 16px;
        }
        .fnd-founder-why {
          font-family: var(--font-playfair, Georgia, serif);
          font-size: 17px; color: #C9A84C; font-style: italic;
          line-height: 1.5; max-width: 30ch;
        }
        .fnd-proof-grid {
          display: grid; grid-template-columns: repeat(4, 1fr);
          gap: 14px; max-width: 940px; margin: 0 auto 40px;
        }
        .fnd-proof-item {
          position: relative; width: 100%; aspect-ratio: 3/4;
          border-radius: 10px; overflow: hidden;
          border: 1px solid rgba(201,168,76,0.18);
        }
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
        .fnd-final {
          padding: 96px 6vw; text-align: center;
          border-top: 1px solid rgba(201,168,76,0.12);
        }
        .fnd-final-cta {
          display: inline-flex; align-items: center; gap: 10px;
          font-family: var(--font-inter, sans-serif);
          font-size: 14px; font-weight: 700; letter-spacing: 1px;
          text-transform: uppercase; color: #0A0F1C; text-decoration: none;
          background: linear-gradient(135deg, #F0D77A 0%, #C9A84C 50%, #A67C2E 100%);
          border-radius: 5px; padding: 18px 34px; margin-top: 12px;
          box-shadow: 0 0 32px rgba(201,168,76,0.22);
          transition: transform 0.18s ease, box-shadow 0.2s ease;
        }
        .fnd-final-cta:hover {
          transform: translateY(-2px);
          box-shadow: 0 14px 34px rgba(201,168,76,0.3);
        }
        @media (max-width: 720px) {
          .fnd-proof-grid { grid-template-columns: repeat(2, 1fr); }
          .fnd-founders { gap: 32px; }
        }
        @media (max-width: 440px) {
          .fnd-founders { grid-template-columns: 1fr; max-width: 300px; }
        }
      `}</style>

      <LandingFooter />
    </main>
  )
}
