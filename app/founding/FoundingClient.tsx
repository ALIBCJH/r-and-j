'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowRight, Star, CheckCircle, ShoppingBag, Phone, Truck } from 'lucide-react'
import LandingNavbar from '@/app/components/landing/Navbar'
import LandingFooter from '@/app/components/landing/Footer'
import { API_URL } from '@/app/lib/api'

type Slots = { reserved: number; total: number; remaining: number }

const DEPOSIT_KSH = 1000
const fmt = (n: number) => 'KSh ' + n.toLocaleString('en-KE')

const STEPS = [
  { icon: ShoppingBag, title: 'Choose your fabric', body: 'Browse the catalog and add the curtains you love to your order — measurements are confirmed later, on a call.' },
  { icon: Phone,       title: `Reserve with ${fmt(DEPOSIT_KSH)}`, body: 'Pay a small, fully-refundable M-Pesa deposit. It locks today’s founding price and is credited in full to your order.' },
  { icon: Truck,       title: 'We measure, make & install', body: 'We call within 24 hours to arrange fitting. Your curtains are made to your windows and installed — the balance is only due then.' },
]

const PERKS = [
  'Founding price locked — before any launch increase.',
  'Fully refundable — cancel any time before production.',
  'Deposit credited in full toward your final order.',
  'Priority fitting slots for the founding cohort.',
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

  return (
    <main style={{ background: '#0D1B2E', minHeight: '100vh' }}>
      <LandingNavbar />

      <div style={{ paddingTop: 'calc(var(--rj-navbar-height) + 64px)', paddingLeft: '6vw', paddingRight: '6vw', maxWidth: '960px', margin: '0 auto', paddingBottom: '100px' }}>

        {/* Hero */}
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '20px', padding: '6px 16px', borderRadius: '20px', background: 'rgba(201,168,76,0.1)', border: '1px solid rgba(201,168,76,0.3)' }}>
            <Star size={13} color="#C9A84C" />
            <span style={{ fontFamily: 'var(--font-inter, sans-serif)', fontSize: '11px', color: '#C9A84C', letterSpacing: '3px', textTransform: 'uppercase' }}>Limited Release</span>
          </div>
          <h1 style={{ fontFamily: 'var(--font-playfair, Georgia, serif)', fontSize: 'clamp(34px, 6vw, 60px)', color: '#FFFFFF', fontWeight: 400, lineHeight: 1.08, marginBottom: '20px' }}>
            Become a{' '}
            <em style={{ color: '#C9A84C' }}>Founding Client.</em>
          </h1>
          <p style={{ fontFamily: 'var(--font-inter, sans-serif)', fontSize: 'clamp(15px, 2vw, 18px)', color: '#8A96A4', lineHeight: 1.75, maxWidth: '640px', margin: '0 auto' }}>
            We’re opening a limited first cohort. Reserve your curtains now with a small,
            fully-refundable {fmt(DEPOSIT_KSH)} deposit — it locks your founding price and is
            credited in full to your order. The balance is only due once your curtains are installed.
          </p>
        </div>

        {/* Live slots counter */}
        <div style={{ background: 'rgba(201,168,76,0.05)', border: '1px solid rgba(201,168,76,0.25)', borderRadius: '10px', padding: 'clamp(20px, 4vw, 32px)', marginBottom: '56px', maxWidth: '620px', marginLeft: 'auto', marginRight: 'auto' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: '14px', flexWrap: 'wrap', gap: '6px' }}>
            <span style={{ fontFamily: 'var(--font-inter, sans-serif)', fontSize: '12px', color: '#C9A84C', letterSpacing: '2px', textTransform: 'uppercase' }}>Founding Cohort</span>
            <span style={{ fontFamily: 'var(--font-inter, sans-serif)', fontSize: '14px', color: '#F0EBE0' }}>
              {slots
                ? <><strong style={{ color: '#C9A84C' }}>{slots.reserved}</strong> of {slots.total} reserved</>
                : 'Loading…'}
            </span>
          </div>
          <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.06)', borderRadius: '3px', overflow: 'hidden' }}>
            <div style={{ width: `${pct}%`, height: '100%', background: 'linear-gradient(90deg, #F0D77A, #C9A84C)', transition: 'width 0.6s ease' }} />
          </div>
          <p style={{ fontFamily: 'var(--font-inter, sans-serif)', fontSize: '13px', color: '#6A7A88', marginTop: '14px', lineHeight: 1.6 }}>
            {slots
              ? (slots.remaining > 0
                  ? `Only ${slots.remaining} founding ${slots.remaining === 1 ? 'slot' : 'slots'} left at this price.`
                  : 'The founding cohort is full — join the waitlist from any product’s checkout.')
              : 'Fetching live availability…'}
          </p>
        </div>

        {/* How it works */}
        <div style={{ marginBottom: '56px' }}>
          <p style={{ textAlign: 'center', fontFamily: 'var(--font-inter, sans-serif)', fontSize: '11px', color: '#C9A84C', letterSpacing: '4px', textTransform: 'uppercase', marginBottom: '36px' }}>
            How It Works
          </p>
          <div className="founding-steps">
            {STEPS.map((s, i) => {
              const Icon = s.icon
              return (
                <div key={i} style={{ flex: 1, textAlign: 'center', padding: '0 8px' }}>
                  <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'rgba(201,168,76,0.08)', border: '1px solid rgba(201,168,76,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 18px' }}>
                    <Icon size={24} color="#C9A84C" />
                  </div>
                  <p style={{ fontFamily: 'var(--font-inter, sans-serif)', fontSize: '11px', color: '#4A5A6A', letterSpacing: '2px', marginBottom: '8px' }}>0{i + 1}</p>
                  <h3 style={{ fontFamily: 'var(--font-playfair, Georgia, serif)', fontSize: '20px', color: '#F0EBE0', fontWeight: 400, marginBottom: '10px' }}>{s.title}</h3>
                  <p style={{ fontFamily: 'var(--font-inter, sans-serif)', fontSize: '14px', color: '#8A96A4', lineHeight: 1.7 }}>{s.body}</p>
                </div>
              )
            })}
          </div>
        </div>

        {/* Perks */}
        <div style={{ border: '1px solid rgba(201,168,76,0.15)', borderRadius: '10px', padding: 'clamp(24px, 4vw, 36px)', marginBottom: '48px', maxWidth: '620px', marginLeft: 'auto', marginRight: 'auto' }}>
          <p style={{ fontFamily: 'var(--font-inter, sans-serif)', fontSize: '11px', color: '#C9A84C', letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '20px' }}>
            What Founding Clients Get
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {PERKS.map(p => (
              <div key={p} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                <CheckCircle size={17} color="#4CAF82" style={{ marginTop: '1px', flexShrink: 0 }} />
                <span style={{ fontFamily: 'var(--font-inter, sans-serif)', fontSize: '15px', color: '#C6CFD8', lineHeight: 1.6 }}>{p}</span>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div style={{ textAlign: 'center' }}>
          <Link
            href="/catalog"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', background: 'linear-gradient(135deg, #F0D77A 0%, #C9A84C 50%, #A67C2E 100%)', color: '#0A0F1C', padding: '18px 40px', borderRadius: '4px', fontFamily: 'var(--font-inter, sans-serif)', fontSize: '14px', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', textDecoration: 'none', boxShadow: '0 0 32px rgba(201,168,76,0.25)' }}
          >
            Browse Fabrics to Reserve <ArrowRight size={16} />
          </Link>
          <p style={{ fontFamily: 'var(--font-inter, sans-serif)', fontSize: '12px', color: '#3A4A58', marginTop: '16px' }}>
            Pick a fabric, then reserve your slot at checkout · fully refundable
          </p>
        </div>
      </div>

      <style>{`
        .founding-steps {
          display: flex;
          gap: 24px;
          align-items: start;
        }
        @media (max-width: 760px) {
          .founding-steps {
            flex-direction: column;
            gap: 40px;
          }
        }
      `}</style>

      <LandingFooter />
    </main>
  )
}
