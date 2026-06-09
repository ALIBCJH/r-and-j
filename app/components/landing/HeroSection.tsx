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

      {/* SVG filter — makes white pixels transparent, gold/dark stay opaque */}
      <svg width="0" height="0" style={{ position: 'absolute' }}>
        <defs>
          <filter id="remove-white" colorInterpolationFilters="sRGB">
            <feColorMatrix
              type="matrix"
              values="1 0 0 0 0
                      0 1 0 0 0
                      0 0 1 0 0
                      -1 -1 -1 3 0"
            />
          </filter>
        </defs>
      </svg>

      {/* Full-width two-column layout — grows to fill remaining space above scroll indicator */}
      <div
        className="relative w-full flex items-center"
        style={{
          flex:       '1 1 auto',
          padding:    '0 6vw',
          paddingTop: 'calc(var(--rj-navbar-height) + 24px)',
          gap:        '4vw',
          zIndex:     10,
        }}
      >

        {/* ── Left: text — 50% of viewport ── */}
        <div style={{ flex: '0 0 50%', minWidth: 0 }}>

          <motion.h1 {...fadeUp(0.25)} style={{
            fontFamily:   'var(--font-playfair, Georgia, serif)',
            fontSize:     'clamp(52px, 6vw, 92px)',
            color:        '#FFFFFF',
            lineHeight:   1.1,
            marginBottom: 0,
          }}>
            See It.
          </motion.h1>

          <motion.h1 {...fadeUp(0.4)} style={{
            fontFamily:   'var(--font-playfair, Georgia, serif)',
            fontSize:     'clamp(52px, 6vw, 92px)',
            lineHeight:   1.1,
            marginBottom: 0,
          }}>
            <em style={{
              color:      '#E8C96D',
              fontStyle:  'italic',
              textShadow: '0 0 48px rgba(232,201,109,0.3)',
            }}>
              Love It.
            </em>
          </motion.h1>

          <motion.h1 {...fadeUp(0.55)} style={{
            fontFamily:   'var(--font-playfair, Georgia, serif)',
            fontSize:     'clamp(52px, 6vw, 92px)',
            color:        '#FFFFFF',
            lineHeight:   1.1,
            marginBottom: '36px',
          }}>
            Then Buy It.
          </motion.h1>

          <motion.p {...fadeUp(0.7)} style={{
            fontFamily:   'var(--font-inter, sans-serif)',
            fontSize:     'clamp(14px, 1.1vw, 17px)',
            color:        '#9BAAB8',
            lineHeight:   1.85,
            marginBottom: '44px',
            maxWidth:     '380px',
          }}>
            Experience your curtains at full scale in your actual room —
            before a single thread is cut.
          </motion.p>

          <motion.div
            {...fadeUp(0.8)}
            style={{ display: 'flex', justifyContent: 'center' }}
          >
            <Link
              href="/studio"
              className="inline-flex items-center rounded-sm font-semibold"
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

        {/* ── Right: logo — 44% of viewport ── */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease, delay: 0.25 }}
          style={{
            flex:     '0 0 44%',
            minWidth: 0,
            aspectRatio: '1 / 1',
            position: 'relative',
            filter:   'drop-shadow(0 0 60px rgba(201,168,76,0.15))',
          }}
        >
          <Image
            src="/assets/r_j_interiors_final_premium_logo.png"
            alt="R&J Interiors"
            fill
            style={{
              objectFit: 'contain',
              filter:    'url(#remove-white) brightness(1.05) contrast(1.15) saturate(1.2)',
            }}
            priority
          />
        </motion.div>
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
