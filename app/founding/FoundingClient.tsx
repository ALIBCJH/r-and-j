'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Star } from 'lucide-react'
import LandingNavbar from '@/app/components/landing/Navbar'
import LandingFooter from '@/app/components/landing/Footer'
import { API_URL } from '@/app/lib/api'
import { CAMPAIGN, TIERS, DEFAULT_TIER } from '@/app/lib/campaign'

type Slots = { reserved: number; total: number; remaining: number }

const fmt = (n: number) => 'KSh ' + n.toLocaleString('en-KE')

// Who a backer is actually trusting with their money. Faces + a one-line "why"
// do more to convert a hesitant backer than any amount of feature copy.
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
    why: 'We built the visualizer so you can see it on your own window before you spend a shilling.',
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

      {/* ── Who you're backing ─────────────────────────────────────────────── */}
      <section className="fnd-block">
        <div className="fnd-inner">
          <p className="fnd-eyebrow">Who You&apos;re Backing</p>
          <h2 className="fnd-h2">Two founders from Nyeri. <em>One promise.</em></h2>
          <p className="fnd-lead">
            R&amp;J is Rose &amp; Juma — a designer and an engineer betting everything on one idea:
            that buying beautiful curtains online should feel certain, not risky. Backing us today is
            what turns that bet into a launch. You&apos;re not funding strangers — you&apos;re backing us.
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
            Real fabric, real rooms, real craft. And with our window visualizer you can preview curtains
            on your own window <em>before</em> you back us — so you know exactly what you&apos;re getting.
          </p>

          <div className="fnd-proof-grid">
            {PROOF.map(p => (
              <div key={p.src} className="fnd-proof-item">
                <Image src={p.src} alt={p.alt} fill sizes="(max-width: 720px) 50vw, 260px" style={{ objectFit: 'cover' }} />
              </div>
            ))}
          </div>

          <Link href="/studio" className="fnd-ghost-cta">
            Preview your window <ArrowRight size={15} />
          </Link>
        </div>
      </section>

      {/* ── Final CTA ──────────────────────────────────────────────────────── */}
      <section className="fnd-final">
        <h2 className="fnd-h2">Ready to lock your discount?</h2>
        <Link href={`/checkout?tier=${DEFAULT_TIER.amount}`} className="fnd-final-cta">
          Back our launch <ArrowRight size={16} />
        </Link>
        <p style={{ fontFamily: 'var(--font-inter, sans-serif)', fontSize: '12px', color: '#3A4A58', marginTop: '18px' }}>
          From KSh 100 · Fully refundable · Credited to your order
        </p>
      </section>

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
