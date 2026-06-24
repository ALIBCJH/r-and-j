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
        @media (max-width: 768px) {
          .hero-cols {
            padding-top: calc(var(--rj-navbar-height) + 24px) !important;
            text-align: center;
          }
          .hero-text-col { flex: 0 0 auto !important; width: 100% !important; max-width: 100% !important; }
          .hero-text-col p { max-width: 100% !important; margin-left: auto !important; margin-right: auto !important; }
          .hero-text-col > div { justify-content: center !important; }
          .hero-cta-link { padding: 16px 36px !important; font-size: 13px !important; letter-spacing: 2px !important; }
        }
      `}</style>

      {/* ── Background image — hero3 (VR curtain styling experience) ── */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
        <Image
          src="/assets/hero3.png"
          alt="A client previewing curtain styles in immersive VR inside a luxury living room"
          fill
          priority
          quality={90}
          sizes="100vw"
          style={{ objectFit: 'cover', objectPosition: 'center right' }}
        />
      </div>

      {/* ── Scrim — darkens the left for text legibility, keeps the VR panel on the right visible ── */}
      <div
        aria-hidden
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
        className="relative w-full flex items-center hero-cols"
        style={{
          flex:       '1 1 auto',
          padding:    '0 6vw',
          paddingTop: 'calc(var(--rj-navbar-height) + 24px)',
          zIndex:     10,
        }}
      >

        {/* ── Text + CTA ── */}
        <div className="hero-text-col" style={{ flex: '0 0 auto', maxWidth: '560px', minWidth: 0 }}>

          <motion.span {...fadeUp(0.2)} style={{
            display:       'block',
            fontFamily:    'var(--font-inter, sans-serif)',
            fontSize:      'clamp(11px, 0.9vw, 13px)',
            color:         '#E8C96D',
            letterSpacing: '4px',
            textTransform: 'uppercase',
            marginBottom:  '22px',
            textShadow:    '0 1px 16px rgba(0,0,0,0.6)',
          }}>
            Immersive Interior Design
          </motion.span>

          <motion.h1 {...fadeUp(0.35)} style={{
            fontFamily:   'var(--font-playfair, Georgia, serif)',
            fontSize:     'clamp(38px, 4.4vw, 76px)',
            color:        '#FFFFFF',
            lineHeight:   1.05,
            marginBottom: 0,
            textShadow:   '0 2px 24px rgba(0,0,0,0.55)',
          }}>
            See it
          </motion.h1>

          <motion.h1 {...fadeUp(0.5)} style={{
            fontFamily:   'var(--font-playfair, Georgia, serif)',
            fontSize:     'clamp(38px, 4.4vw, 76px)',
            lineHeight:   1.05,
            marginBottom: '40px',
          }}>
            <em style={{
              color:      '#E8C96D',
              fontStyle:  'italic',
              textShadow: '0 0 48px rgba(232,201,109,0.35), 0 2px 24px rgba(0,0,0,0.55)',
            }}>
              before it&rsquo;s real.
            </em>
          </motion.h1>

          <motion.div
            {...fadeUp(0.65)}
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
                boxShadow:     '0 0 40px rgba(232,201,109,0.5), 0 0 100px rgba(201,168,76,0.22)',
                transition:    'box-shadow 0.3s ease, filter 0.3s ease',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.filter    = 'brightness(1.12)'
                e.currentTarget.style.boxShadow = '0 0 56px rgba(232,201,109,0.70), 0 0 120px rgba(201,168,76,0.30)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.filter    = ''
                e.currentTarget.style.boxShadow = '0 0 32px rgba(232,201,109,0.45), 0 0 80px rgba(201,168,76,0.18)'
              }}
            >
              Experience VR Studio
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
