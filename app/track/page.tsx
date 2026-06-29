'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Search, Package, Wrench, Truck, CheckCircle, Clock, ArrowLeft } from 'lucide-react'
import LandingNavbar from '@/app/components/landing/Navbar'
import LandingFooter from '@/app/components/landing/Footer'
import { API_URL } from '@/app/lib/api'

type OrderStatus = 'pending_payment' | 'confirmed' | 'in_production' | 'ready' | 'delivered'

type TrackResult = {
  order_number: string
  status:       OrderStatus
  name:         string
  total_ksh:    number
  created_at:   string
  items: {
    product_name: string
    collection:   string
    quantity:     number
    width_cm:     number
    height_cm:    number
    price_ksh:    number
  }[]
}

const STEPS: { key: OrderStatus; label: string; icon: React.ElementType }[] = [
  { key: 'confirmed',     label: 'Order Confirmed',    icon: CheckCircle },
  { key: 'in_production', label: 'In Production',       icon: Wrench      },
  { key: 'ready',         label: 'Ready for Delivery',  icon: Package     },
  { key: 'delivered',     label: 'Delivered',           icon: Truck       },
]

const STATUS_ORDER: OrderStatus[] = ['pending_payment', 'confirmed', 'in_production', 'ready', 'delivered']

export default function TrackPage() {
  const [orderNumber, setOrderNumber] = useState('')
  const [phone,       setPhone]       = useState('')
  const [loading,     setLoading]     = useState(false)
  const [result,      setResult]      = useState<TrackResult | null>(null)
  const [error,       setError]       = useState('')

  async function handleTrack(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    setResult(null)

    try {
      const params = new URLSearchParams({ order_number: orderNumber.trim().toUpperCase(), phone: phone.trim() })
      const res    = await fetch(`${API_URL}/orders/track?${params}`)
      if (res.ok) {
        setResult(await res.json())
      } else {
        const data = await res.json().catch(() => ({}))
        setError(data.detail ?? 'Order not found. Check your order number and phone number.')
      }
    } catch {
      setError('Could not connect to server. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const statusIndex   = (s: OrderStatus) => STATUS_ORDER.indexOf(s)
  const currentIndex  = result ? statusIndex(result.status) : -1
  const fmt           = (n: number) => 'KSh ' + n.toLocaleString('en-KE')

  return (
    <div style={{ background: '#0D1B2E', minHeight: '100vh' }}>
      <LandingNavbar />

      <div style={{ paddingTop: 'calc(var(--rj-navbar-height) + 60px)', paddingLeft: '6vw', paddingRight: '6vw', maxWidth: '680px', margin: '0 auto', paddingBottom: '100px' }}>

        <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontFamily: 'var(--font-inter, sans-serif)', fontSize: '13px', color: '#6A7A88', textDecoration: 'none', marginBottom: '40px', transition: 'color 0.2s' }}
          onMouseEnter={e => (e.currentTarget.style.color = '#C9A84C')}
          onMouseLeave={e => (e.currentTarget.style.color = '#6A7A88')}
        >
          <ArrowLeft size={14} /> Home
        </Link>

        <p style={{ fontFamily: 'var(--font-inter, sans-serif)', fontSize: '11px', color: '#C9A84C', letterSpacing: '4px', textTransform: 'uppercase', marginBottom: '12px' }}>
          Delivery Tracking
        </p>
        <h1 style={{ fontFamily: 'var(--font-playfair, Georgia, serif)', fontSize: 'clamp(28px, 4vw, 42px)', color: '#FFFFFF', fontWeight: 400, marginBottom: '12px' }}>
          Track Your Order
        </h1>
        <p style={{ fontFamily: 'var(--font-inter, sans-serif)', fontSize: '15px', color: '#4A5A6A', lineHeight: 1.7, marginBottom: '48px' }}>
          Enter the order number from your confirmation and the phone number you used at checkout.
        </p>

        {/* Search form */}
        <form onSubmit={handleTrack} style={{ marginBottom: '48px' }}>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontFamily: 'var(--font-inter, sans-serif)', fontSize: '11px', color: '#6A7A88', letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: '8px' }}>
              Order Number
            </label>
            <input
              value={orderNumber}
              onChange={e => setOrderNumber(e.target.value)}
              placeholder="e.g. RJ-X4K2M9"
              required
              style={{
                width: '100%', background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(201,168,76,0.2)', borderRadius: '4px',
                padding: '13px 16px', fontFamily: 'var(--font-inter, sans-serif)',
                fontSize: '16px', color: '#F0EBE0', outline: 'none',
                letterSpacing: '2px', boxSizing: 'border-box' as const,
              }}
              onFocus={e  => (e.target.style.borderColor = '#C9A84C')}
              onBlur={e   => (e.target.style.borderColor = 'rgba(201,168,76,0.2)')}
            />
          </div>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontFamily: 'var(--font-inter, sans-serif)', fontSize: '11px', color: '#6A7A88', letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: '8px' }}>
              Phone Number
            </label>
            <input
              value={phone}
              onChange={e => setPhone(e.target.value)}
              placeholder="0712 345 678"
              type="tel"
              required
              style={{
                width: '100%', background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(201,168,76,0.2)', borderRadius: '4px',
                padding: '13px 16px', fontFamily: 'var(--font-inter, sans-serif)',
                fontSize: '16px', color: '#F0EBE0', outline: 'none',
                boxSizing: 'border-box' as const,
              }}
              onFocus={e  => (e.target.style.borderColor = '#C9A84C')}
              onBlur={e   => (e.target.style.borderColor = 'rgba(201,168,76,0.2)')}
            />
          </div>

          {error && (
            <div style={{ background: 'rgba(224,85,85,0.1)', border: '1px solid rgba(224,85,85,0.3)', borderRadius: '4px', padding: '12px 16px', marginBottom: '16px', fontFamily: 'var(--font-inter, sans-serif)', fontSize: '13px', color: '#E07070' }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              background: loading ? 'rgba(201,168,76,0.3)' : 'linear-gradient(135deg, #F0D77A, #C9A84C)',
              color: '#0A0F1C', padding: '16px', borderRadius: '4px',
              fontFamily: 'var(--font-inter, sans-serif)', fontSize: '13px', fontWeight: 700,
              letterSpacing: '1.5px', textTransform: 'uppercase', border: 'none',
              cursor: loading ? 'not-allowed' : 'pointer',
            }}
          >
            <Search size={15} />
            {loading ? 'Searching…' : 'Track Order'}
          </button>
        </form>

        {/* Result */}
        {result && (
          <div>
            {/* Status timeline */}
            <div style={{ marginBottom: '40px' }}>
              {result.status === 'pending_payment' ? (
                <div style={{ background: 'rgba(224,85,85,0.08)', border: '1px solid rgba(224,85,85,0.2)', borderRadius: '6px', padding: '20px 24px', display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <Clock size={24} color="#E07070" />
                  <div>
                    <p style={{ fontFamily: 'var(--font-inter, sans-serif)', fontSize: '14px', color: '#E07070', fontWeight: 600, marginBottom: '4px' }}>Awaiting Payment</p>
                    <p style={{ fontFamily: 'var(--font-inter, sans-serif)', fontSize: '13px', color: '#4A5A6A' }}>Payment not yet confirmed. Contact us if you believe this is an error.</p>
                  </div>
                </div>
              ) : (
                <div>
                  {STEPS.map((step, i) => {
                    const stepIndex  = statusIndex(step.key)
                    const completed  = stepIndex < currentIndex
                    const active     = step.key === result.status
                    const Icon       = step.icon
                    return (
                      <div key={step.key} style={{ display: 'flex', gap: '16px', marginBottom: i < STEPS.length - 1 ? '0' : '0' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                          <div style={{
                            width: '40px', height: '40px', borderRadius: '50%', flexShrink: 0,
                            background: completed || active ? (active ? 'rgba(201,168,76,0.15)' : 'rgba(76,175,130,0.12)') : 'rgba(255,255,255,0.04)',
                            border: `2px solid ${completed ? '#4CAF82' : active ? '#C9A84C' : 'rgba(255,255,255,0.1)'}`,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                          }}>
                            <Icon size={18} color={completed ? '#4CAF82' : active ? '#C9A84C' : '#2A3A48'} />
                          </div>
                          {i < STEPS.length - 1 && (
                            <div style={{ width: '2px', flex: 1, minHeight: '24px', background: completed ? 'rgba(76,175,130,0.4)' : 'rgba(255,255,255,0.06)', margin: '4px 0' }} />
                          )}
                        </div>
                        <div style={{ paddingTop: '8px', paddingBottom: i < STEPS.length - 1 ? '20px' : '0' }}>
                          <p style={{ fontFamily: 'var(--font-inter, sans-serif)', fontSize: '14px', fontWeight: active ? 600 : 400, color: completed ? '#4CAF82' : active ? '#F0EBE0' : '#2A3A48', marginBottom: '2px' }}>
                            {step.label}
                          </p>
                          {active && (
                            <p style={{ fontFamily: 'var(--font-inter, sans-serif)', fontSize: '12px', color: '#C9A84C' }}>Current status</p>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Order details */}
            <div style={{ border: '1px solid rgba(201,168,76,0.12)', borderRadius: '6px', padding: '24px', marginBottom: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px', flexWrap: 'wrap', gap: '8px' }}>
                <div>
                  <p style={{ fontFamily: 'var(--font-inter, sans-serif)', fontSize: '11px', color: '#4A5A6A', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '4px' }}>Order</p>
                  <p style={{ fontFamily: 'var(--font-playfair, Georgia, serif)', fontSize: '22px', color: '#C9A84C', letterSpacing: '2px' }}>{result.order_number}</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ fontFamily: 'var(--font-inter, sans-serif)', fontSize: '11px', color: '#4A5A6A', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '4px' }}>Total</p>
                  <p style={{ fontFamily: 'var(--font-playfair, Georgia, serif)', fontSize: '22px', color: '#F0EBE0' }}>{fmt(result.total_ksh)}</p>
                </div>
              </div>

              <div style={{ height: '1px', background: 'rgba(201,168,76,0.08)', marginBottom: '16px' }} />

              {result.items.map((item, i) => (
                <div key={i} style={{ marginBottom: i < result.items.length - 1 ? '12px' : '0', paddingBottom: i < result.items.length - 1 ? '12px' : '0', borderBottom: i < result.items.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}>
                  <p style={{ fontFamily: 'var(--font-inter, sans-serif)', fontSize: '9px', color: '#C9A84C', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '3px' }}>{item.collection}</p>
                  <p style={{ fontFamily: 'var(--font-playfair, Georgia, serif)', fontSize: '15px', color: '#F0EBE0', marginBottom: '4px' }}>{item.product_name}</p>
                  <p style={{ fontFamily: 'var(--font-inter, sans-serif)', fontSize: '12px', color: '#4A5A6A' }}>
                    {item.quantity} panel{item.quantity > 1 ? 's' : ''} · {item.width_cm} × {item.height_cm} cm · {fmt(item.price_ksh * item.quantity)}
                  </p>
                </div>
              ))}
            </div>

            <p style={{ fontFamily: 'var(--font-inter, sans-serif)', fontSize: '12px', color: '#2A3A48', textAlign: 'center' }}>
              Questions? <Link href="/contact" style={{ color: '#C9A84C', textDecoration: 'none' }}>Contact us</Link> with your order number.
            </p>
          </div>
        )}
      </div>

      <LandingFooter />
    </div>
  )
}
