'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import {
  ArrowLeft, ArrowRight, Loader2, CheckCircle,
  Phone, AlertCircle, Star, Bell,
} from 'lucide-react'
import LandingNavbar from '@/app/components/landing/Navbar'
import LandingFooter from '@/app/components/landing/Footer'
import { useCart } from '@/app/lib/cart'
import { API_URL } from '@/app/lib/api'
import { CAMPAIGN } from '@/app/lib/campaign'

type Stage = 'form' | 'processing' | 'waiting' | 'success' | 'error'
type Slots = { reserved: number; total: number; remaining: number }

// Flat, fully-creditable founding deposit (mirrors FOUNDING_DEPOSIT_KSH on the
// server, which is the source of truth for what's actually charged).
const DEPOSIT_KSH = 1000

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

function InputField({ label, value, onChange, type = 'text', placeholder, required, optional }: {
  label: string; value: string; onChange: (v: string) => void;
  type?: string; placeholder?: string; required?: boolean; optional?: boolean
}) {
  return (
    <div style={{ marginBottom: '20px' }}>
      <label style={lbl}>
        {label}
        {optional
          ? <span style={{ color: '#3A4A58', marginLeft: '5px', textTransform: 'none', letterSpacing: 0 }}>optional</span>
          : required && <span style={{ color: '#C9A84C', marginLeft: '3px' }}>*</span>
        }
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

// Slim "X of 20 founding slots reserved" progress bar.
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

export default function CheckoutClient() {
  const { items, totalKsh, clearCart, hydrated } = useCart()
  const router = useRouter()

  const [name,         setName]         = useState('')
  const [phone,        setPhone]        = useState('')
  const [stage,        setStage]        = useState<Stage>('form')
  const [errMsg,       setErrMsg]       = useState('')
  const [orderNumber,  setOrderNumber]  = useState('')
  const [checkoutId,   setCheckoutId]   = useState('')
  const [slots,        setSlots]        = useState<Slots | null>(null)

  // Waitlist (free "notify me") state
  const [showWaitlist, setShowWaitlist] = useState(false)
  const [wlStage,      setWlStage]      = useState<'idle' | 'sending' | 'done' | 'error'>('idle')
  const [wlEmail,      setWlEmail]      = useState('')
  const [wlErr,        setWlErr]        = useState('')

  // "Join the Kickstarter" entry (/checkout?join=1): a pre-launch booking that
  // secures the founding discount without picking a fabric first.
  const [joinMode,    setJoinMode]    = useState(false)
  const [joinChecked, setJoinChecked] = useState(false)

  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const balanceKsh = Math.max(0, totalKsh - DEPOSIT_KSH)
  // Kickstarter booking = arrived via the join CTA with an empty cart.
  const kickstarterBooking = joinMode && items.length === 0

  // Detect join mode from the URL (read directly to avoid a Suspense boundary).
  useEffect(() => {
    setJoinMode(new URLSearchParams(window.location.search).get('join') === '1')
    setJoinChecked(true)
  }, [])

  // Live founding-slots counter.
  useEffect(() => {
    fetch(`${API_URL}/founding/slots`)
      .then(r => r.json())
      .then((d: Slots) => setSlots(d))
      .catch(() => {})
  }, [])

  // Wait for the cart to hydrate before deciding it's empty — otherwise a direct
  // load / refresh of /checkout redirects away before the saved cart loads. Skip
  // the redirect entirely in join mode, where an empty cart is expected.
  useEffect(() => {
    if (joinChecked && !joinMode && hydrated && items.length === 0 && stage === 'form') {
      router.push('/catalog')
    }
  }, [joinChecked, joinMode, hydrated, items, stage, router])

  useEffect(() => {
    if (stage !== 'waiting' || !checkoutId) return
    pollRef.current = setInterval(async () => {
      try {
        const res  = await fetch(`${API_URL}/mpesa/status/${checkoutId}`)
        const data = await res.json()
        if (data.status === 'complete') {
          clearInterval(pollRef.current!)
          clearCart()
          setStage('success')
        } else if (data.status === 'failed') {
          clearInterval(pollRef.current!)
          setErrMsg('Payment was cancelled or failed. Please try again.')
          setStage('error')
        }
      } catch {}
    }, 3000)
    return () => clearInterval(pollRef.current!)
  }, [stage, checkoutId, clearCart])

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
          kickstarter: joinMode,
          items: items.map(i => ({
            product_id:   i.productId,
            product_name: i.name,
            collection:   i.collection,
            price_ksh:    i.priceKsh,
            quantity:     i.quantity,
          })),
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
        setErrMsg(data.error || 'Could not start your reservation. Please try again.')
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
        body: JSON.stringify({
          name, phone, email: wlEmail,
          product_name: items.map(i => i.name).join(', '),
        }),
      })
      const data = await res.json()
      if (data.ok) setWlStage('done')
      else { setWlErr(data.error || 'Could not join the waitlist.'); setWlStage('error') }
    } catch {
      setWlErr('Could not connect. Please try again.')
      setWlStage('error')
    }
  }

  const fmt = (n: number) => 'KSh ' + n.toLocaleString('en-KE')

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
            We&apos;ve sent an M-Pesa request to <strong style={{ color: '#F0EBE0' }}>{phone}</strong> for your <strong style={{ color: '#F0EBE0' }}>{fmt(DEPOSIT_KSH)}</strong> founding deposit. Enter your PIN to reserve your slot.
          </p>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '24px' }}>
            <Loader2 size={18} color="#C9A84C" style={{ animation: 'spin 1s linear infinite' }} />
            <span style={{ fontFamily: 'var(--font-inter, sans-serif)', fontSize: '13px', color: '#4A5A6A' }}>Waiting for payment…</span>
          </div>
          <p style={{ fontFamily: 'var(--font-inter, sans-serif)', fontSize: '12px', color: '#3A4A58' }}>
            Order <strong style={{ color: '#C9A84C' }}>{orderNumber}</strong> · Deposit {fmt(DEPOSIT_KSH)}
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
            <span style={{ fontFamily: 'var(--font-inter, sans-serif)', fontSize: '11px', color: '#C9A84C', letterSpacing: '2px', textTransform: 'uppercase' }}>Founding Client</span>
          </div>
          <CheckCircle size={64} color="#4CAF82" style={{ marginBottom: '20px' }} />
          <h2 style={{ fontFamily: 'var(--font-playfair, Georgia, serif)', fontSize: '32px', color: '#FFFFFF', fontWeight: 400, marginBottom: '12px' }}>
            Your Slot Is Reserved
          </h2>
          <p style={{ fontFamily: 'var(--font-inter, sans-serif)', fontSize: '15px', color: '#6A7A88', lineHeight: 1.7, marginBottom: '32px' }}>
            Thank you, {name.split(' ')[0]}. Your {fmt(DEPOSIT_KSH)} deposit is credited in full to your order and locks your founding price. We&apos;ll call within 24 hours to confirm measurements and your fitting slot.
          </p>
          <div style={{ background: 'rgba(201,168,76,0.06)', border: '1px solid rgba(201,168,76,0.2)', borderRadius: '6px', padding: '20px 28px', marginBottom: '32px' }}>
            <p style={{ fontFamily: 'var(--font-inter, sans-serif)', fontSize: '11px', color: '#6A7A88', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '6px' }}>Order Number</p>
            <p style={{ fontFamily: 'var(--font-playfair, Georgia, serif)', fontSize: '28px', color: '#C9A84C', letterSpacing: '3px' }}>{orderNumber}</p>
            <p style={{ fontFamily: 'var(--font-inter, sans-serif)', fontSize: '12px', color: '#3A4A58', marginTop: '6px' }}>Save this — you&apos;ll need it to track your order</p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <Link href="/track" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', background: 'linear-gradient(135deg, #F0D77A, #C9A84C)', color: '#0A0F1C', padding: '16px', borderRadius: '4px', fontFamily: 'var(--font-inter, sans-serif)', fontSize: '13px', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', textDecoration: 'none' }}>
              Track My Order <ArrowRight size={14} />
            </Link>
            <Link href="/catalog" style={{ display: 'block', textAlign: 'center', padding: '14px', fontFamily: 'var(--font-inter, sans-serif)', fontSize: '13px', color: '#4A5A6A', textDecoration: 'none' }}>
              Continue Browsing
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
            {showWaitlist ? 'Founding slots are full' : 'Something went wrong'}
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
          href="/catalog"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontFamily: 'var(--font-inter, sans-serif)', fontSize: '13px', color: '#6A7A88', textDecoration: 'none', marginBottom: '36px', transition: 'color 0.2s' }}
          onMouseEnter={e => (e.currentTarget.style.color = '#C9A84C')}
          onMouseLeave={e => (e.currentTarget.style.color = '#6A7A88')}
        >
          <ArrowLeft size={14} /> Back to Catalog
        </Link>

        {/* Heading */}
        <p style={{ fontFamily: 'var(--font-inter, sans-serif)', fontSize: '11px', color: '#C9A84C', letterSpacing: '4px', textTransform: 'uppercase', marginBottom: '12px' }}>
          {joinMode ? `${CAMPAIGN.name} · Pre-Launch` : 'Become a Founding Client'}
        </p>
        <h1 style={{ fontFamily: 'var(--font-playfair, Georgia, serif)', fontSize: '30px', color: '#FFFFFF', fontWeight: 400, marginBottom: '16px' }}>
          {joinMode ? 'Secure Your Spot' : 'Reserve Your Slot'}
        </h1>
        <p style={{ fontFamily: 'var(--font-inter, sans-serif)', fontSize: '15px', color: '#6A7A88', lineHeight: 1.7, maxWidth: '620px', marginBottom: '40px' }}>
          {kickstarterBooking
            ? <>Lock in your founding discount with a fully-refundable {fmt(DEPOSIT_KSH)}{' '}deposit. We&apos;ll call to choose your fabric and confirm measurements — the deposit is credited in full to your order.</>
            : <>Secure a founding slot with a fully-refundable {fmt(DEPOSIT_KSH)}{' '}deposit. It&apos;s credited in full to your order, locks today&apos;s founding price, and the balance is only due once your curtains are installed.</>}
        </p>

        {slots && <SlotsBar slots={slots} />}

        <form onSubmit={handleSubmit}>
          <div className="checkout-layout">

            {/* ── Left column ─────────────────────────────────────────────── */}
            <div>
              <SectionLabel>Contact Details</SectionLabel>
              <InputField label="M-Pesa Phone Number" value={phone} onChange={setPhone} type="tel" placeholder="0712 345 678" required />
              <InputField label="Full Name" value={name} onChange={setName} placeholder="Jane Mwangi" required />

              <p style={{ fontFamily: 'var(--font-inter, sans-serif)', fontSize: '12px', color: '#3A4A58', lineHeight: 1.6, marginTop: '4px' }}>
                We&apos;ll confirm your delivery address and window measurements when we call to arrange fitting.
              </p>

              {/* Reassurance / defensibility */}
              <div style={{ marginTop: '28px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {[
                  'Fully refundable — cancel any time before production.',
                  'Credited in full toward your final order.',
                  'Locks your founding price. Balance due on installation.',
                ].map(t => (
                  <div key={t} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                    <CheckCircle size={15} color="#4CAF82" style={{ marginTop: '2px', flexShrink: 0 }} />
                    <span style={{ fontFamily: 'var(--font-inter, sans-serif)', fontSize: '13px', color: '#8A96A4', lineHeight: 1.6 }}>{t}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* ── Right column: sticky order summary ───────────────────────── */}
            <div style={{ position: 'sticky', top: 'calc(var(--rj-navbar-height, 72px) + 24px)', alignSelf: 'start' }}>
              <SectionLabel>{kickstarterBooking ? 'Your Pre-Launch Spot' : 'Your Reservation'}</SectionLabel>

              {kickstarterBooking ? (
                // Simplified pre-launch booking — no fabric picked yet.
                <div style={{ border: '1px solid rgba(201,168,76,0.12)', borderRadius: '4px', padding: '20px', marginBottom: '20px' }}>
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', marginBottom: '16px' }}>
                    <Star size={16} color="#C9A84C" style={{ marginTop: '2px', flexShrink: 0 }} />
                    <div>
                      <p style={{ fontFamily: 'var(--font-playfair, Georgia, serif)', fontSize: '16px', color: '#F0EBE0', marginBottom: '4px' }}>{CAMPAIGN.name} Pre-Launch Spot</p>
                      <p style={{ fontFamily: 'var(--font-inter, sans-serif)', fontSize: '12px', color: '#6A7A88', lineHeight: 1.6 }}>
                        Locks your founding discount. We&apos;ll help you choose fabric &amp; confirm the price on our call.
                      </p>
                    </div>
                  </div>
                  <div style={{ height: '1px', background: 'rgba(201,168,76,0.1)', margin: '4px 0 14px' }} />
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontFamily: 'var(--font-inter, sans-serif)', fontSize: '13px', color: '#F0EBE0', fontWeight: 600 }}>Deposit due today</span>
                    <span style={{ fontFamily: 'var(--font-playfair, Georgia, serif)', fontSize: '24px', color: '#C9A84C' }}>{fmt(DEPOSIT_KSH)}</span>
                  </div>
                </div>
              ) : (
                <>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
                    {items.map(item => (
                      <div key={item.productId} style={{ border: '1px solid rgba(201,168,76,0.12)', borderRadius: '4px', overflow: 'hidden' }}>
                        <div style={{ display: 'flex', gap: '14px', padding: '14px' }}>
                          <div style={{ position: 'relative', width: '56px', aspectRatio: '2/3', flexShrink: 0, borderRadius: '2px', overflow: 'hidden' }}>
                            <Image src={item.image} alt={item.name} fill sizes="56px" style={{ objectFit: 'cover' }} />
                          </div>
                          <div style={{ flex: 1 }}>
                            <p style={{ fontFamily: 'var(--font-inter, sans-serif)', fontSize: '9px', color: '#C9A84C', letterSpacing: '2.5px', textTransform: 'uppercase', marginBottom: '4px' }}>{item.collection}</p>
                            <p style={{ fontFamily: 'var(--font-playfair, Georgia, serif)', fontSize: '15px', color: '#F0EBE0', marginBottom: '4px' }}>{item.name}</p>
                            <p style={{ fontFamily: 'var(--font-inter, sans-serif)', fontSize: '12px', color: '#4A5A6A' }}>
                              {item.quantity} panel{item.quantity > 1 ? 's' : ''} ·{' '}
                              <span style={{ color: '#F0EBE0' }}>KSh {(item.priceKsh * item.quantity).toLocaleString('en-KE')}</span>
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Price breakdown */}
                  <div style={{ border: '1px solid rgba(201,168,76,0.12)', borderRadius: '4px', padding: '20px', marginBottom: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <span style={{ fontFamily: 'var(--font-inter, sans-serif)', fontSize: '13px', color: '#6A7A88' }}>Order value (founding price)</span>
                      <span style={{ fontFamily: 'var(--font-inter, sans-serif)', fontSize: '13px', color: '#F0EBE0' }}>{fmt(totalKsh)}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <span style={{ fontFamily: 'var(--font-inter, sans-serif)', fontSize: '13px', color: '#6A7A88' }}>Delivery &amp; Installation</span>
                      <span style={{ fontFamily: 'var(--font-inter, sans-serif)', fontSize: '13px', color: '#4CAF82' }}>Included</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <span style={{ fontFamily: 'var(--font-inter, sans-serif)', fontSize: '13px', color: '#6A7A88' }}>Balance (due on installation)</span>
                      <span style={{ fontFamily: 'var(--font-inter, sans-serif)', fontSize: '13px', color: '#8A96A4' }}>{fmt(balanceKsh)}</span>
                    </div>
                    <div style={{ height: '1px', background: 'rgba(201,168,76,0.1)', margin: '12px 0' }} />
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontFamily: 'var(--font-inter, sans-serif)', fontSize: '13px', color: '#F0EBE0', fontWeight: 600 }}>Deposit due today</span>
                      <span style={{ fontFamily: 'var(--font-playfair, Georgia, serif)', fontSize: '24px', color: '#C9A84C' }}>
                        {fmt(DEPOSIT_KSH)}
                      </span>
                    </div>
                  </div>
                </>
              )}

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
                  : <>{joinMode ? CAMPAIGN.cta : 'Reserve My Slot'} · Pay {fmt(DEPOSIT_KSH)} <ArrowRight size={15} /></>
                }
              </button>

              <p style={{ fontFamily: 'var(--font-inter, sans-serif)', fontSize: '11px', color: '#2A3A48', textAlign: 'center', marginTop: '12px', lineHeight: 1.6 }}>
                Secure M-Pesa deposit · Fully refundable · No account needed
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
          Leave your email and we&apos;ll notify you the moment a slot opens or we launch.
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
