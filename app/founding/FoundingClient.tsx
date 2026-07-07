'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowRight, Star } from 'lucide-react'
import LandingNavbar from '@/app/components/landing/Navbar'
import LandingFooter from '@/app/components/landing/Footer'
import { API_URL } from '@/app/lib/api'
import { CAMPAIGN, TIERS } from '@/app/lib/campaign'

type Slots = { reserved: number; total: number; remaining: number }

const fmt = (n: number) => 'KSh ' + n.toLocaleString('en-KE')

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
  // Flag the biggest-discount package as the standout.
  const topTier = TIERS.reduce((a, b) => (b.discountPct > a.discountPct ? b : a), TIERS[0])

  return (
    <main style={{ background: '#0D1B2E', minHeight: '100vh' }}>
      <LandingNavbar />

      <div style={{ paddingTop: 'calc(var(--rj-navbar-height) + 72px)', paddingLeft: '6vw', paddingRight: '6vw', maxWidth: '860px', margin: '0 auto', paddingBottom: '110px', textAlign: 'center' }}>

        {/* Badge */}
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '24px', padding: '6px 16px', borderRadius: '20px', background: 'rgba(201,168,76,0.1)', border: '1px solid rgba(201,168,76,0.3)' }}>
          <Star size={13} color="#C9A84C" />
          <span style={{ fontFamily: 'var(--font-inter, sans-serif)', fontSize: '11px', color: '#C9A84C', letterSpacing: '3px', textTransform: 'uppercase' }}>Pre-Launch · Limited Spots</span>
        </div>

        {/* Headline */}
        <h1 style={{ fontFamily: 'var(--font-playfair, Georgia, serif)', fontSize: 'clamp(34px, 6.5vw, 62px)', color: '#FFFFFF', fontWeight: 400, lineHeight: 1.07, marginBottom: '24px' }}>
          Back our launch.{' '}
          <em style={{ color: '#C9A84C' }}>Lock a bigger discount.</em>
        </h1>

        {/* Statement */}
        <p style={{ fontFamily: 'var(--font-inter, sans-serif)', fontSize: 'clamp(16px, 2.2vw, 19px)', color: '#9AA6B4', lineHeight: 1.75, maxWidth: '620px', margin: '0 auto 40px' }}>
          We&apos;re about to launch — and before we do, we&apos;re running a {CAMPAIGN.name}-style
          pre-launch. Pick a backing package below: the more you back us with now, the bigger the
          discount you lock in at launch. Every shilling is refundable and credited in full to your
          order.
        </p>

        {/* Live counter */}
        <div style={{ background: 'rgba(201,168,76,0.05)', border: '1px solid rgba(201,168,76,0.25)', borderRadius: '10px', padding: '18px 22px', marginBottom: '44px', maxWidth: '440px', marginLeft: 'auto', marginRight: 'auto' }}>
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

        {/* Backing tiers */}
        <p style={{ fontFamily: 'var(--font-inter, sans-serif)', fontSize: '11px', color: '#C9A84C', letterSpacing: '4px', textTransform: 'uppercase', marginBottom: '24px' }}>
          Choose Your Backing
        </p>
        <div className="tier-grid">
          {TIERS.map(t => {
            const featured = t.amount === topTier.amount
            return (
              <Link
                key={t.amount}
                href={`/checkout?join=1&tier=${t.amount}`}
                style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center', textDecoration: 'none',
                  padding: '24px 16px', borderRadius: '10px',
                  background: featured ? 'rgba(201,168,76,0.08)' : 'rgba(255,255,255,0.02)',
                  border: `1px solid ${featured ? 'rgba(201,168,76,0.5)' : 'rgba(201,168,76,0.18)'}`,
                  transition: 'transform 0.15s ease, border-color 0.2s ease',
                }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.borderColor = '#C9A84C' }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.borderColor = featured ? 'rgba(201,168,76,0.5)' : 'rgba(201,168,76,0.18)' }}
              >
                <span style={{ fontFamily: 'var(--font-inter, sans-serif)', fontSize: '10px', fontWeight: 700, letterSpacing: '2px', color: '#0A0F1C', background: 'linear-gradient(135deg, #F0D77A, #C9A84C)', padding: '4px 12px', borderRadius: '20px', marginBottom: '16px' }}>
                  {t.discountPct}% OFF
                </span>
                <span style={{ fontFamily: 'var(--font-playfair, Georgia, serif)', fontSize: '28px', color: '#FFFFFF', lineHeight: 1, marginBottom: '6px', whiteSpace: 'nowrap' }}>
                  {fmt(t.amount)}
                </span>
                <span style={{ fontFamily: 'var(--font-inter, sans-serif)', fontSize: '12px', color: '#6A7A88', marginBottom: '20px' }}>
                  credited to your order
                </span>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontFamily: 'var(--font-inter, sans-serif)', fontSize: '12px', fontWeight: 700, letterSpacing: '0.5px', color: '#C9A84C', textTransform: 'uppercase' }}>
                  Back this <ArrowRight size={13} />
                </span>
              </Link>
            )
          })}
        </div>

        <p style={{ fontFamily: 'var(--font-inter, sans-serif)', fontSize: '12px', color: '#3A4A58', marginTop: '28px' }}>
          Fully refundable · secure M-Pesa · your discount is applied when we finalize your order
        </p>
      </div>

      <style>{`
        .tier-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
        }
        @media (max-width: 720px) {
          .tier-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 380px) {
          .tier-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      <LandingFooter />
    </main>
  )
}
