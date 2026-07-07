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
                href={`/checkout?tier=${t.amount}`}
                className={`tier-card${featured ? ' tier-card-featured' : ''}`}
              >
                {featured && <span className="tier-flag">Best value</span>}
                <span style={{ fontFamily: 'var(--font-inter, sans-serif)', fontSize: '10px', fontWeight: 700, letterSpacing: '2px', color: '#0A0F1C', background: 'linear-gradient(135deg, #F0D77A, #C9A84C)', padding: '4px 12px', borderRadius: '20px', marginBottom: '16px' }}>
                  {t.discountPct}% OFF
                </span>
                <span style={{ fontFamily: 'var(--font-playfair, Georgia, serif)', fontSize: '28px', color: '#FFFFFF', lineHeight: 1, marginBottom: '6px', whiteSpace: 'nowrap' }}>
                  {fmt(t.amount)}
                </span>
                <span style={{ fontFamily: 'var(--font-inter, sans-serif)', fontSize: '12px', color: '#6A7A88', marginBottom: '20px' }}>
                  credited to your order
                </span>
                <span className="tier-back">
                  Back This <ArrowRight size={14} />
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
        .tier-card {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-decoration: none;
          cursor: pointer;
          padding: 26px 16px;
          border-radius: 12px;
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(201,168,76,0.18);
          transition: transform 0.18s ease, border-color 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;
        }
        .tier-card-featured {
          background: rgba(201,168,76,0.08);
          border-color: rgba(201,168,76,0.5);
        }
        .tier-card:hover {
          transform: translateY(-4px);
          border-color: #C9A84C;
          background: rgba(201,168,76,0.06);
          box-shadow: 0 14px 32px rgba(0,0,0,0.38), 0 0 0 1px rgba(201,168,76,0.35);
        }
        .tier-card:active { transform: translateY(-1px); }
        /* The CTA reads as a real button and fills gold when the card is hovered */
        .tier-back {
          width: 100%;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 7px;
          font-family: var(--font-inter, sans-serif);
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 1px;
          text-transform: uppercase;
          color: #C9A84C;
          border: 1px solid rgba(201,168,76,0.5);
          border-radius: 5px;
          padding: 10px 16px;
          transition: background 0.2s ease, color 0.2s ease, border-color 0.2s ease;
        }
        .tier-card:hover .tier-back {
          background: linear-gradient(135deg, #F0D77A, #C9A84C);
          color: #0A0F1C;
          border-color: transparent;
        }
        .tier-flag {
          position: absolute;
          top: -10px;
          left: 50%;
          transform: translateX(-50%);
          white-space: nowrap;
          font-family: var(--font-inter, sans-serif);
          font-size: 9px;
          font-weight: 700;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          color: #0A0F1C;
          background: linear-gradient(135deg, #F0D77A, #C9A84C);
          padding: 3px 10px;
          border-radius: 20px;
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
