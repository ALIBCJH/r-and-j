'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import {
  ArrowLeft, ArrowRight, Loader2, CheckCircle,
  Phone, AlertCircle,
} from 'lucide-react'
import LandingNavbar from '@/app/components/landing/Navbar'
import LandingFooter from '@/app/components/landing/Footer'
import { useCart } from '@/app/lib/cart'
import { API_URL } from '@/app/lib/api'

type Stage = 'form' | 'processing' | 'waiting' | 'success' | 'error'

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

export default function CheckoutClient() {
  const { items, totalKsh, clearCart } = useCart()
  const router = useRouter()

  const [name,         setName]         = useState('')
  const [phone,        setPhone]        = useState('')
  const [stage,        setStage]        = useState<Stage>('form')
  const [errMsg,       setErrMsg]       = useState('')
  const [orderNumber,  setOrderNumber]  = useState('')
  const [checkoutId,   setCheckoutId]   = useState('')

  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    if (items.length === 0 && stage === 'form') router.push('/catalog')
  }, [items, stage, router])

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
      setOrderNumber(data.order_number)
      if (data.ok && data.checkout_request_id) {
        setCheckoutId(data.checkout_request_id)
        setStage('waiting')
      } else {
        clearCart()
        setStage('success')
      }
    } catch {
      setErrMsg('Could not connect to server. Please try again.')
      setStage('error')
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
            We&apos;ve sent an M-Pesa request to <strong style={{ color: '#F0EBE0' }}>{phone}</strong>. Enter your PIN to complete the order.
          </p>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '24px' }}>
            <Loader2 size={18} color="#C9A84C" style={{ animation: 'spin 1s linear infinite' }} />
            <span style={{ fontFamily: 'var(--font-inter, sans-serif)', fontSize: '13px', color: '#4A5A6A' }}>Waiting for payment…</span>
          </div>
          <p style={{ fontFamily: 'var(--font-inter, sans-serif)', fontSize: '12px', color: '#3A4A58' }}>
            Order <strong style={{ color: '#C9A84C' }}>{orderNumber}</strong> · {fmt(totalKsh)}
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
          <CheckCircle size={64} color="#4CAF82" style={{ marginBottom: '24px' }} />
          <h2 style={{ fontFamily: 'var(--font-playfair, Georgia, serif)', fontSize: '32px', color: '#FFFFFF', fontWeight: 400, marginBottom: '12px' }}>
            Order Confirmed
          </h2>
          <p style={{ fontFamily: 'var(--font-inter, sans-serif)', fontSize: '15px', color: '#6A7A88', lineHeight: 1.7, marginBottom: '32px' }}>
            Thank you, {name.split(' ')[0]}. We&apos;ve received your order and will be in touch within 24 hours.
          </p>
          <div style={{ background: 'rgba(201,168,76,0.06)', border: '1px solid rgba(201,168,76,0.2)', borderRadius: '6px', padding: '20px 28px', marginBottom: '32px' }}>
            <p style={{ fontFamily: 'var(--font-inter, sans-serif)', fontSize: '11px', color: '#6A7A88', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '6px' }}>Order Number</p>
            <p style={{ fontFamily: 'var(--font-playfair, Georgia, serif)', fontSize: '28px', color: '#C9A84C', letterSpacing: '3px' }}>{orderNumber}</p>
            <p style={{ fontFamily: 'var(--font-inter, sans-serif)', fontSize: '12px', color: '#3A4A58', marginTop: '6px' }}>Save this — you&apos;ll need it to track your delivery</p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <Link href="/track" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', background: 'linear-gradient(135deg, #F0D77A, #C9A84C)', color: '#0A0F1C', padding: '16px', borderRadius: '4px', fontFamily: 'var(--font-inter, sans-serif)', fontSize: '13px', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', textDecoration: 'none' }}>
              Track My Order <ArrowRight size={14} />
            </Link>
            <Link href="/catalog" style={{ display: 'block', textAlign: 'center', padding: '14px', fontFamily: 'var(--font-inter, sans-serif)', fontSize: '13px', color: '#4A5A6A', textDecoration: 'none' }}>
              Continue Shopping
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
        <div style={{ textAlign: 'center', maxWidth: '400px' }}>
          <AlertCircle size={56} color="#E05555" style={{ marginBottom: '20px' }} />
          <h2 style={{ fontFamily: 'var(--font-playfair, Georgia, serif)', fontSize: '28px', color: '#FFFFFF', fontWeight: 400, marginBottom: '12px' }}>
            Something went wrong
          </h2>
          <p style={{ fontFamily: 'var(--font-inter, sans-serif)', fontSize: '15px', color: '#6A7A88', lineHeight: 1.7, marginBottom: '28px' }}>
            {errMsg || 'An unexpected error occurred.'}
          </p>
          {orderNumber && (
            <p style={{ fontFamily: 'var(--font-inter, sans-serif)', fontSize: '13px', color: '#4A5A6A', marginBottom: '24px' }}>
              Your order <strong style={{ color: '#C9A84C' }}>{orderNumber}</strong> was created. Contact us to complete payment.
            </p>
          )}
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
        <h1 style={{ fontFamily: 'var(--font-playfair, Georgia, serif)', fontSize: '30px', color: '#FFFFFF', fontWeight: 400, marginBottom: '44px' }}>
          Checkout
        </h1>

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
            </div>

            {/* ── Right column: sticky order summary ───────────────────────── */}
            <div style={{ position: 'sticky', top: 'calc(var(--rj-navbar-height, 72px) + 24px)', alignSelf: 'start' }}>
              <SectionLabel>Your Order</SectionLabel>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
                {items.map(item => (
                  <div key={item.productId} style={{ border: '1px solid rgba(201,168,76,0.12)', borderRadius: '4px', overflow: 'hidden' }}>

                    {/* Item header */}
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
                {items.map(item => (
                  <div key={item.productId} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ fontFamily: 'var(--font-inter, sans-serif)', fontSize: '13px', color: '#6A7A88' }}>{item.name} × {item.quantity}</span>
                    <span style={{ fontFamily: 'var(--font-inter, sans-serif)', fontSize: '13px', color: '#F0EBE0' }}>KSh {(item.priceKsh * item.quantity).toLocaleString('en-KE')}</span>
                  </div>
                ))}
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontFamily: 'var(--font-inter, sans-serif)', fontSize: '13px', color: '#6A7A88' }}>Delivery &amp; Installation</span>
                  <span style={{ fontFamily: 'var(--font-inter, sans-serif)', fontSize: '13px', color: '#4CAF82' }}>Included</span>
                </div>
                <div style={{ height: '1px', background: 'rgba(201,168,76,0.1)', margin: '12px 0' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontFamily: 'var(--font-inter, sans-serif)', fontSize: '13px', color: '#F0EBE0', fontWeight: 600 }}>Total</span>
                  <span style={{ fontFamily: 'var(--font-playfair, Georgia, serif)', fontSize: '22px', color: '#F0EBE0' }}>
                    KSh {totalKsh.toLocaleString('en-KE')}
                  </span>
                </div>
              </div>

              {/* Pay */}
              {errMsg && (
                <div style={{ background: 'rgba(224,85,85,0.1)', border: '1px solid rgba(224,85,85,0.3)', borderRadius: '4px', padding: '12px 16px', marginBottom: '14px', fontFamily: 'var(--font-inter, sans-serif)', fontSize: '13px', color: '#E07070' }}>
                  {errMsg}
                </div>
              )}
              <button
                type="submit" disabled={stage === 'processing'}
                style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', background: stage === 'processing' ? 'rgba(201,168,76,0.3)' : 'linear-gradient(135deg, #F0D77A 0%, #C9A84C 50%, #A67C2E 100%)', color: '#0A0F1C', padding: '18px', borderRadius: '4px', fontFamily: 'var(--font-inter, sans-serif)', fontSize: '14px', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', border: 'none', cursor: stage === 'processing' ? 'not-allowed' : 'pointer', boxShadow: '0 0 32px rgba(201,168,76,0.2)', transition: 'all 0.2s' }}
              >
                {stage === 'processing'
                  ? <><Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> Processing…</>
                  : <>Pay {fmt(totalKsh)} with M-Pesa <ArrowRight size={15} /></>
                }
              </button>
              <p style={{ fontFamily: 'var(--font-inter, sans-serif)', fontSize: '11px', color: '#2A3A48', textAlign: 'center', marginTop: '12px', lineHeight: 1.6 }}>
                Custom-made to order · Secure M-Pesa payment · No account needed
              </p>
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
