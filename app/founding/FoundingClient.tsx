'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowRight, Star, CheckCircle } from 'lucide-react'
import LandingNavbar from '@/app/components/landing/Navbar'
import LandingFooter from '@/app/components/landing/Footer'
import { API_URL } from '@/app/lib/api'
import { CAMPAIGN } from '@/app/lib/campaign'

type Slots = { reserved: number; total: number; remaining: number }

const DEPOSIT_KSH = 1000
const fmt = (n: number) => 'KSh ' + n.toLocaleString('en-KE')

const BENEFITS = [
  'A huge founding discount — locked in before we launch to the public.',
  'Fully refundable — cancel any time before production.',
  `Just ${fmt(DEPOSIT_KSH)} secures your spot, credited in full to your order.`,
]

export default function FoundingClient() {
  const [slots, setSlots] = useState<Slots | null>(null)

  useEffect(() => {
    fetch(`${API_URL}/founding/slots`)
      .then(r => r.json())
      .then((d: Slots) => setSlots(d))
      .catch(() => {})
  }, [])

  const pct = slots && slots.total > 0 ? Math.min(100, (slots.reserved / slots.total) * 100) : 0
  const soldOut = slots ? slots.remaining <= 0 : false

  return (
    <main style={{ background: '#0D1B2E', minHeight: '100vh' }}>
      <LandingNavbar />

      <div style={{ paddingTop: 'calc(var(--rj-navbar-height) + 72px)', paddingLeft: '6vw', paddingRight: '6vw', maxWidth: '720px', margin: '0 auto', paddingBottom: '110px', textAlign: 'center' }}>

        {/* Badge */}
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '24px', padding: '6px 16px', borderRadius: '20px', background: 'rgba(201,168,76,0.1)', border: '1px solid rgba(201,168,76,0.3)' }}>
          <Star size={13} color="#C9A84C" />
          <span style={{ fontFamily: 'var(--font-inter, sans-serif)', fontSize: '11px', color: '#C9A84C', letterSpacing: '3px', textTransform: 'uppercase' }}>Pre-Launch · Limited Spots</span>
        </div>

        {/* Headline */}
        <h1 style={{ fontFamily: 'var(--font-playfair, Georgia, serif)', fontSize: 'clamp(34px, 6.5vw, 62px)', color: '#FFFFFF', fontWeight: 400, lineHeight: 1.07, marginBottom: '24px' }}>
          Back our launch.{' '}
          <em style={{ color: '#C9A84C' }}>Lock a huge discount.</em>
        </h1>

        {/* Statement */}
        <p style={{ fontFamily: 'var(--font-inter, sans-serif)', fontSize: 'clamp(16px, 2.2vw, 19px)', color: '#9AA6B4', lineHeight: 1.75, maxWidth: '600px', margin: '0 auto 40px' }}>
          We&apos;re about to launch — and before we do, we&apos;re running a {CAMPAIGN.name}-style
          pre-launch. Book your curtains now, ahead of the public opening, with a small
          refundable deposit and lock in a founding discount you won&apos;t see again.
        </p>

        {/* Live counter */}
        <div style={{ background: 'rgba(201,168,76,0.05)', border: '1px solid rgba(201,168,76,0.25)', borderRadius: '10px', padding: '18px 22px', marginBottom: '36px', maxWidth: '440px', marginLeft: 'auto', marginRight: 'auto' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: '12px' }}>
            <span style={{ fontFamily: 'var(--font-inter, sans-serif)', fontSize: '11px', color: '#C9A84C', letterSpacing: '2px', textTransform: 'uppercase' }}>Spots Taken</span>
            <span style={{ fontFamily: 'var(--font-inter, sans-serif)', fontSize: '13px', color: '#F0EBE0' }}>
              {slots ? <><strong style={{ color: '#C9A84C' }}>{slots.reserved}</strong> of {slots.total}</> : '…'}
            </span>
          </div>
          <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.06)', borderRadius: '3px', overflow: 'hidden' }}>
            <div style={{ width: `${pct}%`, height: '100%', background: 'linear-gradient(90deg, #F0D77A, #C9A84C)', transition: 'width 0.6s ease' }} />
          </div>
          {slots && (
            <p style={{ fontFamily: 'var(--font-inter, sans-serif)', fontSize: '12px', color: '#6A7A88', marginTop: '10px' }}>
              {soldOut ? 'All pre-launch spots are taken.' : `Only ${slots.remaining} ${slots.remaining === 1 ? 'spot' : 'spots'} left at this price.`}
            </p>
          )}
        </div>

        {/* Benefits */}
        <div style={{ display: 'inline-flex', flexDirection: 'column', gap: '14px', textAlign: 'left', marginBottom: '44px' }}>
          {BENEFITS.map(b => (
            <div key={b} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', maxWidth: '480px' }}>
              <CheckCircle size={18} color="#4CAF82" style={{ marginTop: '1px', flexShrink: 0 }} />
              <span style={{ fontFamily: 'var(--font-inter, sans-serif)', fontSize: '15px', color: '#C6CFD8', lineHeight: 1.6 }}>{b}</span>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div>
          <Link
            href="/checkout?join=1"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', background: 'linear-gradient(135deg, #F0D77A 0%, #C9A84C 50%, #A67C2E 100%)', color: '#0A0F1C', padding: '17px 38px', borderRadius: '4px', fontFamily: 'var(--font-inter, sans-serif)', fontSize: '14px', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', textDecoration: 'none', boxShadow: '0 0 32px rgba(201,168,76,0.25)' }}
          >
            {CAMPAIGN.cta} <ArrowRight size={16} />
          </Link>
          <p style={{ fontFamily: 'var(--font-inter, sans-serif)', fontSize: '12px', color: '#3A4A58', marginTop: '16px' }}>
            {fmt(DEPOSIT_KSH)} refundable deposit · secure M-Pesa · takes a minute
          </p>
        </div>
      </div>

      <LandingFooter />
    </main>
  )
}
