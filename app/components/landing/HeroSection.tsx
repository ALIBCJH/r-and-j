'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ChevronDown } from 'lucide-react'

const ease = [0.25, 0.1, 0.25, 1] as const

function fadeUp(delay: number) {
  return {
    initial:    { opacity: 0, y: 40 },
    animate:    { opacity: 1, y: 0 },
    transition: { duration: 0.9, ease, delay },
  }
}

export default function HeroSection() {
  return (
    <section className="hero-section" style={{ flexDirection: 'column', alignItems: 'stretch', justifyContent: 'flex-start' }}>
      <style>{`
        .hero-bg-mobile { display: none; }
        @media (max-width: 768px) {
          .hero-bg-desktop { display: none; }
          .hero-bg-mobile  { display: block; }
          /* hero4 image carries the visual messaging on mobile, but keep the
             heading in the DOM (visually hidden) so it stays available to
             search engines and screen readers — never display:none the only h1. */
          .hero-mantra {
            position: absolute !important;
            width: 1px !important; height: 1px !important;
            margin: -1px !important; padding: 0 !important;
            overflow: hidden !important;
            clip: rect(0, 0, 0, 0) !important;
            white-space: nowrap !important;
            border: 0 !important;
          }
          .hero-scrim {
            background: linear-gradient(180deg,
              rgba(8,12,22,0.45) 0%,
              transparent 24%,
              transparent 52%,
              rgba(8,12,22,0.88) 100%) !important;
          }
          .hero-cols {
            padding-top: calc(var(--rj-navbar-height) + 24px) !important;
            padding-bottom: 3vh !important;
            text-align: center;
          }
          .hero-text-col { flex: 0 0 auto !important; width: 100% !important; max-width: 100% !important; }
          .hero-text-col p { max-width: 100% !important; margin-left: auto !important; margin-right: auto !important; }
          .hero-text-col > div { justify-content: center !important; }
          .hero-cta-link {
            padding: 13px 30px !important;
            font-size: 11px !important;
            letter-spacing: 2px !important;
            box-shadow: 0 0 16px rgba(232,201,109,0.28) !important;
          }
          /* Keep the mobile hero image-led — the baked-in messaging carries it,
             so the supporting line only shows on larger screens. */
          .hero-support { display: none !important; }
        }
      `}</style>

      {/* ── Background image — VR curtain styling experience ──
           Desktop gets the wide scene (hero3); phones get the portrait
           composition (hero4) so the VR person stays in frame. ── */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
        <Image
          className="hero-bg-desktop"
          src="/assets/hero3.png"
          alt="A client previewing curtain styles in immersive VR inside a luxury living room"
          fill
          priority
          quality={90}
          sizes="100vw"
          style={{ objectFit: 'cover', objectPosition: 'center right' }}
        />
        <Image
          className="hero-bg-mobile"
          src="/assets/hero4.png"
          alt="A client previewing curtain styles in immersive VR inside a luxury living room"
          fill
          priority
          quality={90}
          sizes="100vw"
          style={{ objectFit: 'cover', objectPosition: 'center top' }}
        />
      </div>

      {/* ── Scrim — desktop darkens the left for text legibility; mobile darkens the bottom for the button ── */}
      <div
        aria-hidden
        className="hero-scrim"
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 1,
          background:
            'linear-gradient(90deg, rgba(8,12,22,0.94) 0%, rgba(8,12,22,0.82) 30%, rgba(8,12,22,0.40) 52%, rgba(8,12,22,0.12) 70%, rgba(8,12,22,0.35) 100%), ' +
            'linear-gradient(180deg, rgba(8,12,22,0.55) 0%, transparent 22%, transparent 60%, rgba(8,12,22,0.70) 100%)',
          pointerEvents: 'none',
        }}
      />

      {/* Full-width layout — text overlaid on the left, grows to fill space above scroll indicator */}
      <div
        className="relative w-full flex items-end hero-cols"
        style={{
          flex:          '1 1 auto',
          padding:       '0 6vw',
          paddingTop:    'calc(var(--rj-navbar-height) + 24px)',
          paddingBottom: '12vh',
          zIndex:        10,
        }}
      >

        {/* ── Text + CTA ── */}
        <div className="hero-text-col" style={{ flex: '0 0 auto', maxWidth: '620px', minWidth: 0 }}>

          {/* Single page H1 — three monumental lines as spans so the document keeps
              exactly one heading (better for SEO & accessibility). */}
          <h1 className="hero-mantra" style={{
            fontFamily:    'var(--font-playfair, Georgia, serif)',
            fontSize:      'clamp(44px, 5.4vw, 94px)',
            fontWeight:    400,
            lineHeight:    1.02,
            letterSpacing: '-0.015em',
            margin:        '0 0 30px',
          }}>
            <motion.span {...fadeUp(0.3)} style={{
              display: 'block', color: '#FFFFFF', textShadow: '0 2px 24px rgba(0,0,0,0.55)',
            }}>
              See It.
            </motion.span>
            <motion.span {...fadeUp(0.45)} style={{
              display: 'block', color: '#FFFFFF', textShadow: '0 2px 24px rgba(0,0,0,0.55)',
            }}>
              Perfect It.
            </motion.span>
            <motion.span {...fadeUp(0.6)} style={{ display: 'block' }}>
              <em style={{
                color:      '#E8C96D',
                fontStyle:  'italic',
                textShadow: '0 0 48px rgba(232,201,109,0.35), 0 2px 24px rgba(0,0,0,0.55)',
              }}>
                We&rsquo;ll Build It.
              </em>
            </motion.span>
          </h1>

          {/* One quiet supporting line — luxury breathes, no paragraphs. */}
          <motion.p {...fadeUp(0.75)} className="hero-support" style={{
            fontFamily: 'var(--font-inter, sans-serif)',
            fontSize:   'clamp(15px, 1.3vw, 18px)',
            color:      'rgba(240,235,224,0.72)',
            lineHeight: 1.7,
            maxWidth:   '440px',
            margin:     '0 0 44px',
          }}>
            Step into your finished home before a single curtain is cut.
          </motion.p>

          <motion.div
            {...fadeUp(0.9)}
            style={{ display: 'flex' }}
          >
            <Link
              href="/studio"
              className="inline-flex items-center rounded-sm font-semibold hero-cta-link"
              style={{
                background:    'linear-gradient(135deg, #F0D77A 0%, #C9A84C 50%, #A67C2E 100%)',
                color:         '#0A0F1C',
                padding:       '22px 64px',
                fontSize:      '15px',
                letterSpacing: '3px',
                textTransform: 'uppercase',
                boxShadow:     '0 0 18px rgba(232,201,109,0.28), 0 0 44px rgba(201,168,76,0.12)',
                transition:    'box-shadow 0.3s ease, filter 0.3s ease',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.filter    = 'brightness(1.08)'
                e.currentTarget.style.boxShadow = '0 0 26px rgba(232,201,109,0.40), 0 0 60px rgba(201,168,76,0.16)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.filter    = ''
                e.currentTarget.style.boxShadow = '0 0 18px rgba(232,201,109,0.28), 0 0 44px rgba(201,168,76,0.12)'
              }}
            >
              Explore Your Space
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator — sits naturally below content, no dead space */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 0.6 }}
        className="flex flex-col items-center gap-2"
        style={{ zIndex: 10, paddingBottom: '40px', alignSelf: 'center' }}
      >
        <motion.div
          style={{ width: '1px', height: '48px', background: 'rgba(201,168,76,0.4)' }}
          animate={{ opacity: [0.4, 0.9, 0.4] }}
          transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
        />
        <motion.div
          style={{ color: 'rgba(201,168,76,0.6)' }}
          animate={{ opacity: [0.6, 1, 0.6] }}
          transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
        >
          <ChevronDown size={18} />
        </motion.div>
      </motion.div>
    </section>
  )
}
