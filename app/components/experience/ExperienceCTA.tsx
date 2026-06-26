'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'

const ease = [0.22, 1, 0.36, 1] as const

function fadeUp(delay = 0) {
  return {
    initial:     { opacity: 0, y: 28 },
    whileInView: { opacity: 1, y: 0 },
    viewport:    { once: true, margin: '-60px' },
    transition:  { duration: 0.9, ease, delay },
  }
}

const PARTICLES = Array.from({ length: 22 }, (_, i) => ({
  x:    (i * 37 + 11) % 100,
  y:    (i * 53 + 7)  % 100,
  size: 1.5 + (i % 3) * 1.2,
  dur:  4 + (i % 5) * 1.4,
  del:  (i * 0.18) % 3,
}))

export default function ExperienceCTA() {
  return (
    <section style={{
      background: '#0D1B2E',
      position:   'relative',
      overflow:   'hidden',
    }}>
      {/* Background orb */}
      <motion.div
        animate={{ scale: [1, 1.15, 1], opacity: [0.12, 0.22, 0.12] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          position: 'absolute', top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '70vw', height: '70vw', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(201,168,76,0.18) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      {/* Particle field */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
        {PARTICLES.map((p, i) => (
          <motion.div
            key={i}
            animate={{ opacity: [0.15, 0.6, 0.15], scale: [0.9, 1.3, 0.9] }}
            transition={{ duration: p.dur, delay: p.del, repeat: Infinity, ease: 'easeInOut' }}
            style={{
              position: 'absolute',
              left: `${p.x}%`, top: `${p.y}%`,
              width: p.size, height: p.size,
              borderRadius: '50%',
              background: '#C9A84C',
            }}
          />
        ))}
      </div>

      <div style={{ width: '100%', height: 1, background: 'linear-gradient(90deg, transparent, #C9A84C, transparent)' }} />

      <div style={{
        position:  'relative',
        zIndex:    10,
        maxWidth:  '760px',
        margin:    '0 auto',
        padding:   'clamp(100px, 14vw, 160px) 40px clamp(80px, 10vw, 120px)',
        textAlign: 'center',
      }}>
        <motion.div {...fadeUp(0)} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 12, marginBottom: 40 }}>
          <div style={{ flex: 1, maxWidth: 80, height: 1, background: 'linear-gradient(to right, transparent, rgba(201,168,76,0.5))' }} />
          <p style={{
            fontFamily: 'var(--font-inter, sans-serif)', fontSize: 10,
            color: '#C9A84C', letterSpacing: '0.4em', textTransform: 'uppercase',
          }}>
            Begin Your Journey
          </p>
          <div style={{ flex: 1, maxWidth: 80, height: 1, background: 'linear-gradient(to left, transparent, rgba(201,168,76,0.5))' }} />
        </motion.div>

        <div style={{ overflow: 'hidden', marginBottom: 8 }}>
          <motion.h2
            initial={{ y: '110%' }} whileInView={{ y: 0 }}
            viewport={{ once: true }} transition={{ duration: 1.1, ease, delay: 0.1 }}
            style={{
              fontFamily: 'var(--font-playfair, Georgia, serif)',
              fontSize: 'clamp(40px, 5.5vw, 76px)', color: '#F0EBE0',
              fontWeight: 400, lineHeight: 1.05, margin: 0,
            }}
          >
            Your dream home
          </motion.h2>
        </div>
        <div style={{ overflow: 'hidden', marginBottom: 8 }}>
          <motion.h2
            initial={{ y: '110%' }} whileInView={{ y: 0 }}
            viewport={{ once: true }} transition={{ duration: 1.1, ease, delay: 0.22 }}
            style={{
              fontFamily: 'var(--font-playfair, Georgia, serif)',
              fontSize: 'clamp(40px, 5.5vw, 76px)', color: '#F0EBE0',
              fontWeight: 400, lineHeight: 1.05, margin: 0,
            }}
          >
            already exists
          </motion.h2>
        </div>
        <div style={{ overflow: 'hidden', marginBottom: 48 }}>
          <motion.h2
            initial={{ y: '110%' }} whileInView={{ y: 0 }}
            viewport={{ once: true }} transition={{ duration: 1.1, ease, delay: 0.34 }}
            style={{
              fontFamily: 'var(--font-playfair, Georgia, serif)',
              fontSize: 'clamp(40px, 5.5vw, 76px)', color: '#C9A84C',
              fontStyle: 'italic', fontWeight: 400, lineHeight: 1.05, margin: 0,
            }}
          >
            in the studio.
          </motion.h2>
        </div>

        <motion.p {...fadeUp(0.45)} style={{
          fontFamily: 'var(--font-inter, sans-serif)',
          fontSize: 'clamp(16px, 1.6vw, 19px)', color: '#4A6078',
          lineHeight: 1.9, maxWidth: 500, margin: '0 auto 14px',
        }}>
          Walk in. See it in the light of your own windows.
          Change your mind as many times as you need.
          Order only when you are certain.
        </motion.p>

        <motion.p {...fadeUp(0.52)} style={{
          fontFamily: 'var(--font-inter, sans-serif)', fontSize: 14,
          color: 'rgba(201,168,76,0.7)', marginBottom: 52,
        }}>
          Consultation from <strong style={{ color: '#C9A84C' }}>KES 2,500</strong> — credited in full toward your order.
        </motion.p>

        <motion.div
          {...fadeUp(0.62)}
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, flexWrap: 'wrap' }}
        >
          <Link href="/contact" style={{
            display: 'inline-flex', alignItems: 'center', gap: 10,
            background: 'linear-gradient(135deg, #B8922A 0%, #E8C87A 50%, #C9A84C 100%)',
            color: '#0A0A10', padding: '18px 52px', borderRadius: 3,
            fontFamily: 'var(--font-inter, sans-serif)', fontSize: 15,
            fontWeight: 700, textDecoration: 'none', letterSpacing: '0.05em',
            textTransform: 'uppercase', whiteSpace: 'nowrap', transition: 'all 0.3s ease',
          }}
            onMouseEnter={e => { e.currentTarget.style.filter = 'brightness(1.08)'; e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 12px 40px rgba(201,168,76,0.40)' }}
            onMouseLeave={e => { e.currentTarget.style.filter = ''; e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '' }}
          >
            Book a Session
          </Link>

          <Link href="/catalog" style={{
            display: 'inline-flex', alignItems: 'center',
            background: 'transparent', border: '1.5px solid rgba(201,168,76,0.5)',
            color: '#C9A84C', padding: '18px 44px', borderRadius: 3,
            fontFamily: 'var(--font-inter, sans-serif)', fontSize: 15,
            fontWeight: 500, textDecoration: 'none', letterSpacing: '0.04em',
            whiteSpace: 'nowrap', transition: 'all 0.25s ease',
          }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(201,168,76,0.07)'; e.currentTarget.style.borderColor = '#C9A84C'; e.currentTarget.style.transform = 'translateY(-2px)' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'rgba(201,168,76,0.5)'; e.currentTarget.style.transform = '' }}
          >
            Explore the Catalog
          </Link>
        </motion.div>

        <motion.p {...fadeUp(0.72)} style={{
          fontFamily: 'var(--font-inter, sans-serif)', fontSize: 12,
          color: '#2A3848', marginTop: 28,
          letterSpacing: '0.04em',
        }}>
          Serving Nairobi, Nyeri &amp; surroundings · Remote consultations available
        </motion.p>
      </div>

      <div style={{ width: '100%', height: 1, background: 'linear-gradient(90deg, transparent, rgba(201,168,76,0.3), transparent)' }} />
    </section>
  )
}
