'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import {
  ArrowLeft, ArrowRight, Loader2, CheckCircle,
  Phone, AlertCircle, Star, Bell, ShieldCheck,
} from 'lucide-react'
import LandingNavbar from '@/app/components/landing/Navbar'
import LandingFooter from '@/app/components/landing/Footer'
import { API_URL } from '@/app/lib/api'
import { CAMPAIGN, TIERS, tierForAmount, DEFAULT_TIER, referralMessage, type Tier } from '@/app/lib/campaign'
import { whatsappShareUrl } from '@/app/lib/whatsapp'
import LaunchCountdown from '@/app/components/founding/LaunchCountdown'

type Stage = 'form' | 'processing' | 'waiting' | 'success' | 'error'
type Slots = { reserved: number; total: number; remaining: number }

const fmt = (n: number) => 'KSh ' + n.toLocaleString('en-KE')

const base: React.CSSProperties = {
  width: '100%',
  background: 'rgba(255,255,255,0.04)',
  border: '1px solid rgba(201,168,76,0.2)',
  borderRadius: '4px',
  padding: '13px 14px',
  fontFamily: 'var(--font-inter, sans-serif)',
  fontSize: '15px',
  color: '#F0EBE0',
  outline: 'none',
  boxSizing: 'border-box',
  transition: 'border-color 0.2s',
}

const lbl: React.CSSProperties = {
  display: 'block',
  fontFamily: 'var(--font-inter, sans-serif)',
  fontSize: '11px',
  color: '#6A7A88',
  letterSpacing: '1.5px',
  textTransform: 'uppercase',
  marginBottom: '7px',
}

function InputField({ label, value, onChange, type = 'text', placeholder, required }: {
  label: string; value: string; onChange: (v: string) => void;
  type?: string; placeholder?: string; required?: boolean
}) {
  return (
    <div style={{ marginBottom: '20px' }}>
      <label style={lbl}>
        {label}
        {required && <span style={{ color: '#C9A84C', marginLeft: '3px' }}>*</span>}
      </label>
      <input
        type={type} value={value} onChange={e => onChange(e.target.value)}
        placeholder={placeholder} required={required} style={base}
        onFocus={e => (e.target.style.borderColor = '#C9A84C')}
        onBlur={e  => (e.target.style.borderColor = 'rgba(201,168,76,0.2)')}
      />
    </div>
  )
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
      <div style={{ flex: 1, height: '1px', background: 'rgba(201,168,76,0.12)' }} />
      <p style={{ fontFamily: 'var(--font-inter, sans-serif)', fontSize: '10px', color: '#C9A84C', letterSpacing: '3px', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
        {children}
      </p>
      <div style={{ flex: 1, height: '1px', background: 'rgba(201,168,76,0.12)' }} />
    </div>
  )
}

// Slim "X of 20 spots taken" progress bar.
function SlotsBar({ slots }: { slots: Slots }) {
  const pct = slots.total > 0 ? Math.min(100, (slots.reserved / slots.total) * 100) : 0
  return (
    <div style={{ background: 'rgba(201,168,76,0.05)', border: '1px solid rgba(201,168,76,0.2)', borderRadius: '8px', padding: '16px 18px', marginBottom: '36px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px', flexWrap: 'wrap', gap: '6px' }}>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '7px', fontFamily: 'var(--font-inter, sans-serif)', fontSize: '12px', color: '#C9A84C', letterSpacing: '1.5px', textTransform: 'uppercase' }}>
          <Star size={13} /> Pre-Launch Release
        </span>
        <span style={{ fontFamily: 'var(--font-inter, sans-serif)', fontSize: '12px', color: '#F0EBE0' }}>
          <strong style={{ color: '#C9A84C' }}>{slots.reserved}</strong> of {slots.total} spots taken
        </span>
      </div>
      <div style={{ width: '100%', height: '5px', background: 'rgba(255,255,255,0.06)', borderRadius: '3px', overflow: 'hidden' }}>
        <div style={{ width: `${pct}%`, height: '100%', background: 'linear-gradient(90deg, #F0D77A, #C9A84C)', transition: 'width 0.5s ease' }} />
      </div>
      <p style={{ fontFamily: 'var(--font-inter, sans-serif)', fontSize: '11px', color: '#6A7A88', marginTop: '10px', lineHeight: 1.6 }}>
        {slots.remaining > 0
          ? `Only ${slots.remaining} ${slots.remaining === 1 ? 'spot' : 'spots'} left at this price.`
          : 'All pre-launch spots are taken — join the waitlist below.'}
      </p>
    </div>
  )
}

// The single loudest promise on the page: pay nothing you can't get back.
// This is the #1 lever pre-launch — the fear is "what if I pay and they vanish".
function GuaranteeBanner() {
  return (
    <div style={{ display: 'flex', gap: '16px', alignItems: 'center', background: 'rgba(76,175,130,0.08)', border: '1px solid rgba(76,175,130,0.4)', borderRadius: '10px', padding: '18px 22px', marginBottom: '36px' }}>
      <div style={{ width: '46px', height: '46px', flexShrink: 0, borderRadius: '50%', background: 'rgba(76,175,130,0.14)', border: '1px solid rgba(76,175,130,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <ShieldCheck size={24} color="#4CAF82" />
      </div>
      <div>
        <p style={{ fontFamily: 'var(--font-playfair, Georgia, serif)', fontSize: '19px', color: '#FFFFFF', fontWeight: 400, marginBottom: '4px' }}>
          You risk nothing — 100% money-back guarantee
        </p>
        <p style={{ fontFamily: 'var(--font-inter, sans-serif)', fontSize: '13.5px', color: '#A8C4B4', lineHeight: 1.6 }}>
          Back us from <strong style={{ color: '#F0EBE0' }}>KSh 100</strong>. It&apos;s <strong style={{ color: '#F0EBE0' }}>fully refundable</strong> — cancel any time before production — and every shilling comes off your final order.
        </p>
      </div>
    </div>
  )
}

export default function CheckoutClient() {
  const [name,         setName]         = useState('')
  const [phone,        setPhone]        = useState('')
  const [stage,        setStage]        = useState<Stage>('form')
  const [errMsg,       setErrMsg]       = useState('')
  const [orderNumber,  setOrderNumber]  = useState('')
  const [checkoutId,   setCheckoutId]   = useState('')
  const [slots,        setSlots]        = useState<Slots | null>(null)
  const [selectedTier, setSelectedTier] = useState<Tier>(DEFAULT_TIER)

  // Waitlist (free "notify me") state
  const [showWaitlist, setShowWaitlist] = useState(false)
  const [wlStage,      setWlStage]      = useState<'idle' | 'sending' | 'done' | 'error'>('idle')
  const [wlEmail,      setWlEmail]      = useState('')
  const [wlErr,        setWlErr]        = useState('')

  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const depositAmount = selectedTier.amount

  // Preselect a backing tier from the URL (?tier=200).
  useEffect(() => {
    const t = tierForAmount(Number(new URLSearchParams(window.location.search).get('tier')))
    if (t) setSelectedTier(t)
  }, [])

  // Live spots counter.
  useEffect(() => {
    fetch(`${API_URL}/founding/slots`)
      .then(r => r.json())
      .then((d: Slots) => setSlots(d))
      .catch(() => {})
  }, [])

  useEffect(() => {
    if (stage !== 'waiting' || !checkoutId) return
    pollRef.current = setInterval(async () => {
      try {
        const res  = await fetch(`${API_URL}/mpesa/status/${checkoutId}`)
        const data = await res.json()
        if (data.status === 'complete') {
          clearInterval(pollRef.current!)
          setStage('success')
        } else if (data.status === 'failed') {
          clearInterval(pollRef.current!)
          setErrMsg('Payment was cancelled or failed. Please try again.')
          setStage('error')
        }
      } catch {}
    }, 3000)
    return () => clearInterval(pollRef.current!)
  }, [stage, checkoutId])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setErrMsg('')
    setStage('processing')
    try {
      const res = await fetch(`${API_URL}/orders`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name, phone,
          email: '', county: '', town: '', building: '', instructions: null,
          kickstarter: true,
          amount: selectedTier.amount,
          items: [],
        }),
      })
      const data = await res.json()
      if (data.ok && data.checkout_request_id) {
        setOrderNumber(data.order_number)
        setCheckoutId(data.checkout_request_id)
        setStage('waiting')
      } else {
        // Sold out, or any server-side rejection — surface the reason and, if the
        // cohort is full, nudge toward the waitlist.
        setErrMsg(data.error || 'Could not start your backing. Please try again.')
        if (data.soldOut) setShowWaitlist(true)
        setStage('error')
      }
    } catch {
      setErrMsg('Could not connect to server. Please try again.')
      setStage('error')
    }
  }

  async function submitWaitlist(e: React.FormEvent) {
    e.preventDefault()
    setWlErr('')
    setWlStage('sending')
    try {
      const res = await fetch(`${API_URL}/waitlist`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, phone, email: wlEmail, product_name: '' }),
      })
      const data = await res.json()
      if (data.ok) setWlStage('done')
      else { setWlErr(data.error || 'Could not join the waitlist.'); setWlStage('error') }
    } catch {
      setWlErr('Could not connect. Please try again.')
      setWlStage('error')
    }
  }

  // ── Waiting ───────────────────────────────────────────────────────────────
  if (stage === 'waiting') {
    return (
      <div style={{ background: '#0D1B2E', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 6vw' }}>
        <div style={{ textAlign: 'center', maxWidth: '400px' }}>
          <div style={{ width: '72px', height: '72px', borderRadius: '50%', background: 'rgba(201,168,76,0.1)', border: '2px solid #C9A84C', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
            <Phone size={32} color="#C9A84C" />
          </div>
          <h2 style={{ fontFamily: 'var(--font-playfair, Georgia, serif)', fontSize: '28px', color: '#FFFFFF', fontWeight: 400, marginBottom: '12px' }}>
            Check Your Phone
          </h2>
          <p style={{ fontFamily: 'var(--font-inter, sans-serif)', fontSize: '15px', color: '#6A7A88', lineHeight: 1.7, marginBottom: '32px' }}>
            We&apos;ve sent an M-Pesa request to <strong style={{ color: '#F0EBE0' }}>{phone}</strong> for your <strong style={{ color: '#F0EBE0' }}>{fmt(depositAmount)}</strong> backing. Enter your PIN to secure your spot.
          </p>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '24px' }}>
            <Loader2 size={18} color="#C9A84C" style={{ animation: 'spin 1s linear infinite' }} />
            <span style={{ fontFamily: 'var(--font-inter, sans-serif)', fontSize: '13px', color: '#4A5A6A' }}>Waiting for payment…</span>
          </div>
          <p style={{ fontFamily: 'var(--font-inter, sans-serif)', fontSize: '12px', color: '#3A4A58' }}>
            Order <strong style={{ color: '#C9A84C' }}>{orderNumber}</strong> · {fmt(depositAmount)}
          </p>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      </div>
    )
  }

  // ── Success ───────────────────────────────────────────────────────────────
  if (stage === 'success') {
    return (
      <div style={{ background: '#0D1B2E', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 6vw' }}>
        <div style={{ textAlign: 'center', maxWidth: '480px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '20px', padding: '6px 16px', borderRadius: '20px', background: 'rgba(201,168,76,0.1)', border: '1px solid rgba(201,168,76,0.3)' }}>
            <Star size={13} color="#C9A84C" />
            <span style={{ fontFamily: 'var(--font-inter, sans-serif)', fontSize: '11px', color: '#C9A84C', letterSpacing: '2px', textTransform: 'uppercase' }}>{CAMPAIGN.name} Backer</span>
          </div>
          <CheckCircle size={64} color="#4CAF82" style={{ marginBottom: '20px' }} />
          <h2 style={{ fontFamily: 'var(--font-playfair, Georgia, serif)', fontSize: '32px', color: '#FFFFFF', fontWeight: 400, marginBottom: '12px' }}>
            You&apos;re In. Thank You.
          </h2>
          <p style={{ fontFamily: 'var(--font-inter, sans-serif)', fontSize: '15px', color: '#6A7A88', lineHeight: 1.7, marginBottom: '32px' }}>
            Thank you, {name.split(' ')[0]}. Your {fmt(depositAmount)} backing is credited in full to your order and locks <strong style={{ color: '#C9A84C' }}>{selectedTier.discountPct}% off</strong> at launch. We&apos;ll call within 24 hours to help you choose your fabric and confirm the details.
          </p>
          <div style={{ background: 'rgba(201,168,76,0.06)', border: '1px solid rgba(201,168,76,0.2)', borderRadius: '6px', padding: '20px 28px', marginBottom: '32px' }}>
            <p style={{ fontFamily: 'var(--font-inter, sans-serif)', fontSize: '11px', color: '#6A7A88', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '6px' }}>Order Number</p>
            <p style={{ fontFamily: 'var(--font-playfair, Georgia, serif)', fontSize: '28px', color: '#C9A84C', letterSpacing: '3px' }}>{orderNumber}</p>
            <p style={{ fontFamily: 'var(--font-inter, sans-serif)', fontSize: '12px', color: '#3A4A58', marginTop: '6px' }}>Save this — you&apos;ll need it to track your order</p>
          </div>
          {/* Word-of-mouth is the highest-converting channel pre-launch — make it
              one tap to bring a friend right at the moment of highest excitement. */}
          <div style={{ background: 'rgba(76,175,130,0.06)', border: '1px solid rgba(76,175,130,0.25)', borderRadius: '8px', padding: '18px 20px', marginBottom: '24px' }}>
            <p style={{ fontFamily: 'var(--font-inter, sans-serif)', fontSize: '13.5px', color: '#A8C4B4', lineHeight: 1.6, marginBottom: '14px' }}>
              Know someone who&apos;d love this? Founding spots are limited — bring a friend before they&apos;re gone.
            </p>
            <a
              href={whatsappShareUrl(referralMessage(typeof window !== 'undefined' ? `${window.location.origin}/founding` : 'https://www.rjinteriors.studio/founding'))}
              target="_blank"
              rel="noopener noreferrer"
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '9px', background: '#25D366', color: '#0A2A18', padding: '14px', borderRadius: '6px', fontFamily: 'var(--font-inter, sans-serif)', fontSize: '13px', fontWeight: 700, letterSpacing: '0.04em', textDecoration: 'none' }}
            >
              <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.47 14.38c-.29-.15-1.72-.85-1.98-.94-.27-.1-.46-.15-.65.14-.19.29-.75.94-.92 1.13-.17.19-.34.22-.63.07-.29-.15-1.23-.45-2.34-1.44-.86-.77-1.45-1.72-1.62-2.01-.17-.29-.02-.45.13-.6.13-.13.29-.34.44-.51.15-.17.19-.29.29-.48.1-.19.05-.36-.02-.51-.07-.15-.65-1.57-.89-2.15-.24-.56-.48-.48-.65-.49-.17-.01-.36-.01-.56-.01-.19 0-.51.07-.77.36-.27.29-1.01.99-1.01 2.42 0 1.43 1.04 2.81 1.18 3-.14.19-2.03 3.1-4.92 4.35-.69.3-1.22.47-1.64.6-.69.22-1.32.19-1.81.12-.55-.08-1.72-.7-1.96-1.38-.24-.68-.24-1.26-.17-1.38.07-.12.26-.19.55-.34z"/><path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.9 9.9 0 0 0 4.79 1.22h.004c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.85 9.85 0 0 0 12.04 2m0 1.67c2.2 0 4.27.86 5.83 2.42a8.2 8.2 0 0 1 2.42 5.82c0 4.54-3.7 8.24-8.25 8.24a8.2 8.2 0 0 1-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.2 8.2 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.25-8.24"/></svg>
              Share on WhatsApp
            </a>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <Link href="/track" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', background: 'linear-gradient(135deg, #F0D77A, #C9A84C)', color: '#0A0F1C', padding: '16px', borderRadius: '4px', fontFamily: 'var(--font-inter, sans-serif)', fontSize: '13px', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', textDecoration: 'none' }}>
              Track My Order <ArrowRight size={14} />
            </Link>
            <Link href="/catalog" style={{ display: 'block', textAlign: 'center', padding: '14px', fontFamily: 'var(--font-inter, sans-serif)', fontSize: '13px', color: '#4A5A6A', textDecoration: 'none' }}>
              Browse the Catalog
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // ── Error ─────────────────────────────────────────────────────────────────
  if (stage === 'error') {
    return (
      <div style={{ background: '#0D1B2E', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 6vw' }}>
        <div style={{ textAlign: 'center', maxWidth: '420px' }}>
          <AlertCircle size={56} color="#E05555" style={{ marginBottom: '20px' }} />
          <h2 style={{ fontFamily: 'var(--font-playfair, Georgia, serif)', fontSize: '28px', color: '#FFFFFF', fontWeight: 400, marginBottom: '12px' }}>
            {showWaitlist ? 'Pre-launch spots are full' : 'Something went wrong'}
          </h2>
          <p style={{ fontFamily: 'var(--font-inter, sans-serif)', fontSize: '15px', color: '#6A7A88', lineHeight: 1.7, marginBottom: '28px' }}>
            {errMsg || 'An unexpected error occurred.'}
          </p>

          {showWaitlist ? (
            <WaitlistForm
              stage={wlStage} err={wlErr} email={wlEmail} setEmail={setWlEmail}
              onSubmit={submitWaitlist} name={name}
            />
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <button
                onClick={() => setStage('form')}
                style={{ background: 'linear-gradient(135deg, #F0D77A, #C9A84C)', color: '#0A0F1C', padding: '16px', borderRadius: '4px', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-inter, sans-serif)', fontSize: '13px', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase' }}
              >
                Try Again
              </button>
              <Link href="/contact" style={{ display: 'block', textAlign: 'center', padding: '14px', fontFamily: 'var(--font-inter, sans-serif)', fontSize: '13px', color: '#4A5A6A', textDecoration: 'none' }}>
                Contact Us Instead
              </Link>
            </div>
          )}
        </div>
      </div>
    )
  }

  // ── Main Form ─────────────────────────────────────────────────────────────
  return (
    <div style={{ background: '#0D1B2E', minHeight: '100vh' }}>
      <LandingNavbar />
      <div style={{ paddingTop: 'calc(var(--rj-navbar-height) + 40px)', paddingLeft: '6vw', paddingRight: '6vw', maxWidth: '1200px', margin: '0 auto', paddingBottom: '80px' }}>

        {/* Back */}
        <Link
          href="/founding"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontFamily: 'var(--font-inter, sans-serif)', fontSize: '13px', color: '#6A7A88', textDecoration: 'none', marginBottom: '36px', transition: 'color 0.2s' }}
          onMouseEnter={e => (e.currentTarget.style.color = '#C9A84C')}
          onMouseLeave={e => (e.currentTarget.style.color = '#6A7A88')}
        >
          <ArrowLeft size={14} /> Back
        </Link>

        {/* Heading */}
        <p style={{ fontFamily: 'var(--font-inter, sans-serif)', fontSize: '11px', color: '#C9A84C', letterSpacing: '4px', textTransform: 'uppercase', marginBottom: '12px' }}>
          {CAMPAIGN.name} · Pre-Launch
        </p>
        <h1 style={{ fontFamily: 'var(--font-playfair, Georgia, serif)', fontSize: '30px', color: '#FFFFFF', fontWeight: 400, marginBottom: '16px' }}>
          Secure Your Spot
        </h1>
        <p style={{ fontFamily: 'var(--font-inter, sans-serif)', fontSize: '15px', color: '#6A7A88', lineHeight: 1.7, maxWidth: '620px', marginBottom: '40px' }}>
          Choose your backing package — the more you back us with now, the bigger the discount you
          lock in at launch. Every shilling is fully refundable and credited in full to your order.
        </p>

        <div style={{ marginBottom: '32px' }}>
          <LaunchCountdown variant="compact" />
        </div>

        <GuaranteeBanner />

        {slots && <SlotsBar slots={slots} />}

        <form onSubmit={handleSubmit}>
          <div className="checkout-layout">

            {/* ── Left column ─────────────────────────────────────────────── */}
            <div>
              <SectionLabel>Contact Details</SectionLabel>
              <InputField label="M-Pesa Phone Number" value={phone} onChange={setPhone} type="tel" placeholder="0712 345 678" required />
              <InputField label="Full Name" value={name} onChange={setName} placeholder="Jane Mwangi" required />

              <p style={{ fontFamily: 'var(--font-inter, sans-serif)', fontSize: '12px', color: '#3A4A58', lineHeight: 1.6, marginTop: '4px' }}>
                We&apos;ll call to help you choose your fabric and arrange fitting.
              </p>

              {/* Reassurance */}
              <div style={{ marginTop: '28px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {[
                  'Fully refundable — cancel any time before production.',
                  'Credited in full toward your final order.',
                  'Locks your launch discount, applied when we finalize your order.',
                ].map(t => (
                  <div key={t} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                    <CheckCircle size={15} color="#4CAF82" style={{ marginTop: '2px', flexShrink: 0 }} />
                    <span style={{ fontFamily: 'var(--font-inter, sans-serif)', fontSize: '13px', color: '#8A96A4', lineHeight: 1.6 }}>{t}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* ── Right column: backing package ────────────────────────────── */}
            <div style={{ position: 'sticky', top: 'calc(var(--rj-navbar-height, 72px) + 24px)', alignSelf: 'start' }}>
              <SectionLabel>Your Backing Package</SectionLabel>

              <div style={{ border: '1px solid rgba(201,168,76,0.12)', borderRadius: '4px', padding: '20px', marginBottom: '20px' }}>
                {/* Tier selector */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
                  {TIERS.map(t => {
                    const on = t.amount === selectedTier.amount
                    return (
                      <button
                        key={t.amount}
                        type="button"
                        onClick={() => setSelectedTier(t)}
                        style={{
                          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                          padding: '12px 14px', borderRadius: '6px', cursor: 'pointer',
                          background: on ? 'rgba(201,168,76,0.12)' : 'transparent',
                          border: `1px solid ${on ? '#C9A84C' : 'rgba(201,168,76,0.2)'}`,
                          transition: 'all 0.15s ease',
                        }}
                      >
                        <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <span style={{ width: '16px', height: '16px', borderRadius: '50%', flexShrink: 0, border: `2px solid ${on ? '#C9A84C' : 'rgba(201,168,76,0.4)'}`, background: on ? '#C9A84C' : 'transparent' }} />
                          <span style={{ fontFamily: 'var(--font-inter, sans-serif)', fontSize: '15px', color: on ? '#F0EBE0' : '#8A96A4', fontWeight: on ? 600 : 400 }}>{fmt(t.amount)}</span>
                        </span>
                        <span style={{ fontFamily: 'var(--font-inter, sans-serif)', fontSize: '12px', fontWeight: 700, letterSpacing: '0.5px', color: on ? '#C9A84C' : '#6A7A88' }}>{t.discountPct}% OFF</span>
                      </button>
                    )
                  })}
                </div>

                <p style={{ fontFamily: 'var(--font-inter, sans-serif)', fontSize: '12px', color: '#6A7A88', lineHeight: 1.6, marginBottom: '14px' }}>
                  Locks <strong style={{ color: '#C9A84C' }}>{selectedTier.discountPct}% off</strong> your launch order. We&apos;ll help you choose fabric &amp; confirm the price on our call — your backing is credited in full.
                </p>
                <div style={{ height: '1px', background: 'rgba(201,168,76,0.1)', margin: '4px 0 14px' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontFamily: 'var(--font-inter, sans-serif)', fontSize: '13px', color: '#F0EBE0', fontWeight: 600 }}>Due today</span>
                  <span style={{ fontFamily: 'var(--font-playfair, Georgia, serif)', fontSize: '24px', color: '#C9A84C' }}>{fmt(depositAmount)}</span>
                </div>
              </div>

              {errMsg && (
                <div style={{ background: 'rgba(224,85,85,0.1)', border: '1px solid rgba(224,85,85,0.3)', borderRadius: '4px', padding: '12px 16px', marginBottom: '14px', fontFamily: 'var(--font-inter, sans-serif)', fontSize: '13px', color: '#E07070' }}>
                  {errMsg}
                </div>
              )}

              <button
                type="submit" disabled={stage === 'processing'}
                style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', background: stage === 'processing' ? 'rgba(201,168,76,0.3)' : 'linear-gradient(135deg, #F0D77A 0%, #C9A84C 50%, #A67C2E 100%)', color: '#0A0F1C', padding: '18px', borderRadius: '4px', fontFamily: 'var(--font-inter, sans-serif)', fontSize: '14px', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', border: 'none', cursor: stage === 'processing' ? 'not-allowed' : 'pointer', boxShadow: '0 0 32px rgba(201,168,76,0.2)', transition: 'all 0.2s' }}
              >
                {stage === 'processing'
                  ? <><Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> Processing…</>
                  : <>{CAMPAIGN.cta} · Pay {fmt(depositAmount)} <ArrowRight size={15} /></>
                }
              </button>

              <p style={{ fontFamily: 'var(--font-inter, sans-serif)', fontSize: '11px', color: '#2A3A48', textAlign: 'center', marginTop: '12px', lineHeight: 1.6 }}>
                Secure M-Pesa · Fully refundable · No account needed
              </p>

              {/* Free waitlist alternative */}
              <button
                type="button"
                onClick={() => setShowWaitlist(v => !v)}
                style={{ width: '100%', marginTop: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', background: 'transparent', border: '1px solid rgba(201,168,76,0.25)', color: '#C9A84C', padding: '13px', borderRadius: '4px', cursor: 'pointer', fontFamily: 'var(--font-inter, sans-serif)', fontSize: '12px', fontWeight: 600, letterSpacing: '0.05em' }}
              >
                <Bell size={14} /> Not ready? Get notified at launch (free)
              </button>

              {showWaitlist && (
                <div style={{ marginTop: '14px' }}>
                  <WaitlistForm
                    stage={wlStage} err={wlErr} email={wlEmail} setEmail={setWlEmail}
                    onSubmit={submitWaitlist} name={name} compact
                  />
                </div>
              )}
            </div>

          </div>
        </form>
      </div>

      <style>{`
        .checkout-layout {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 64px;
          align-items: start;
        }
        @media (max-width: 860px) {
          .checkout-layout {
            grid-template-columns: 1fr;
            gap: 40px;
          }
        }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>

      <LandingFooter />
    </div>
  )
}

// ── Waitlist form (free notify-me) ──────────────────────────────────────────
function WaitlistForm({
  stage, err, email, setEmail, onSubmit, name, compact,
}: {
  stage: 'idle' | 'sending' | 'done' | 'error'
  err: string
  email: string
  setEmail: (v: string) => void
  onSubmit: (e: React.FormEvent) => void
  name: string
  compact?: boolean
}) {
  if (stage === 'done') {
    return (
      <div style={{ background: 'rgba(76,175,130,0.08)', border: '1px solid rgba(76,175,130,0.3)', borderRadius: '6px', padding: '18px 20px', textAlign: 'center' }}>
        <CheckCircle size={28} color="#4CAF82" style={{ marginBottom: '8px' }} />
        <p style={{ fontFamily: 'var(--font-inter, sans-serif)', fontSize: '14px', color: '#F0EBE0', marginBottom: '4px' }}>You&apos;re on the list</p>
        <p style={{ fontFamily: 'var(--font-inter, sans-serif)', fontSize: '12px', color: '#6A7A88' }}>We&apos;ll be in touch the moment we launch.</p>
      </div>
    )
  }
  return (
    <form onSubmit={onSubmit} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(201,168,76,0.18)', borderRadius: '6px', padding: compact ? '16px' : '20px' }}>
      {!compact && (
        <p style={{ fontFamily: 'var(--font-inter, sans-serif)', fontSize: '13px', color: '#8A96A4', lineHeight: 1.6, marginBottom: '14px' }}>
          Leave your email and we&apos;ll notify you the moment a spot opens or we launch.
        </p>
      )}
      <input
        type="email" value={email} onChange={e => setEmail(e.target.value)}
        placeholder="you@email.com" required
        style={{ ...base, marginBottom: '10px' }}
        onFocus={e => (e.target.style.borderColor = '#C9A84C')}
        onBlur={e  => (e.target.style.borderColor = 'rgba(201,168,76,0.2)')}
      />
      {err && (
        <p style={{ fontFamily: 'var(--font-inter, sans-serif)', fontSize: '12px', color: '#E07070', marginBottom: '10px' }}>{err}</p>
      )}
      <button
        type="submit" disabled={stage === 'sending' || !name.trim()}
        style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', background: 'rgba(201,168,76,0.12)', border: '1px solid rgba(201,168,76,0.35)', color: '#E8C96D', padding: '13px', borderRadius: '4px', cursor: stage === 'sending' || !name.trim() ? 'not-allowed' : 'pointer', fontFamily: 'var(--font-inter, sans-serif)', fontSize: '12px', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase' }}
      >
        {stage === 'sending'
          ? <><Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} /> Joining…</>
          : <><Bell size={14} /> Join the Waitlist</>}
      </button>
      {!name.trim() && (
        <p style={{ fontFamily: 'var(--font-inter, sans-serif)', fontSize: '11px', color: '#4A5A6A', textAlign: 'center', marginTop: '8px' }}>
          Add your name above first.
        </p>
      )}
    </form>
  )
}
