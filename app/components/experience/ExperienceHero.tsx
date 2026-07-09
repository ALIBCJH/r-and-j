'use client'

import Link from 'next/link'
import { motion, useMotionValue, useSpring } from 'framer-motion'

const ease = [0.22, 1, 0.36, 1] as const

const SWATCHES = [
  { color: '#C8A070', x: 8,   y: 12,  size: 84, dur: 7.2,  delay: 0   },
  { color: '#E0B8B4', x: 52,  y: 6,   size: 52, dur: 9.1,  delay: 1.2 },
  { color: '#4A7A5C', x: 28,  y: 44,  size: 96, dur: 8.4,  delay: 0.6 },
  { color: '#1E3A5F', x: 72,  y: 52,  size: 48, dur: 6.8,  delay: 2.1 },
  { color: '#C07455', x: 14,  y: 74,  size: 66, dur: 10.2, delay: 1.8 },
  { color: '#3C3C3C', x: 64,  y: 78,  size: 58, dur: 7.6,  delay: 0.4 },
  { color: '#8FAF8C', x: 44,  y: 28,  size: 42, dur: 8.8,  delay: 3.0 },
  { color: '#7A2F3A', x: 82,  y: 22,  size: 70, dur: 9.6,  delay: 1.4 },
  { color: '#F0EBE0', x: 36,  y: 68,  size: 36, dur: 7.0,  delay: 2.6 },
  { color: '#6A7A84', x: 88,  y: 68,  size: 44, dur: 11.0, delay: 0.9 },
]

export default function ExperienceHero() {
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const springX = useSpring(mouseX, { stiffness: 22, damping: 18 })
  const springY = useSpring(mouseY, { stiffness: 22, damping: 18 })

  const handleMove = (e: React.MouseEvent<HTMLElement>) => {
    const r = e.currentTarget.getBoundingClientRect()
    mouseX.set(((e.clientX - r.left) / r.width  - 0.5) * 28)
    mouseY.set(((e.clientY - r.top)  / r.height - 0.5) * 18)
  }

  return (
    <section
      onMouseMove={handleMove}
      style={{
        position:       'relative',
        minHeight:      '100vh',
        display:        'flex',
        flexDirection:  'column',
        justifyContent: 'center',
        overflow:       'hidden',
        background:     '#0D1B2E',
      }}
    >
      {/* Ambient gradient orbs */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
        <motion.div
          animate={{ scale: [1, 1.18, 1], opacity: [0.28, 0.42, 0.28] }}
          transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            position: 'absolute', top: '-18%', left: '-12%',
            width: '65vw', height: '65vw', borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(30,58,95,0.55) 0%, transparent 70%)',
          }}
        />
        <motion.div
          animate={{ scale: [1, 1.12, 1], opacity: [0.22, 0.36, 0.22] }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut', delay: 3 }}
          style={{
            position: 'absolute', bottom: '-20%', right: '-8%',
            width: '55vw', height: '55vw', borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(201,168,76,0.18) 0%, transparent 70%)',
          }}
        />
        <motion.div
          animate={{ opacity: [0.08, 0.16, 0.08] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
          style={{
            position: 'absolute', top: '35%', left: '40%',
            width: '40vw', height: '40vw', borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(201,168,76,0.12) 0%, transparent 70%)',
          }}
        />
      </div>

      {/* Fine grid overlay */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none', opacity: 0.025,
        backgroundImage: 'linear-gradient(rgba(201,168,76,1) 1px, transparent 1px), linear-gradient(90deg, rgba(201,168,76,1) 1px, transparent 1px)',
        backgroundSize: '80px 80px',
      }} />

      {/* Main content — two columns */}
      <div style={{
        position: 'relative', zIndex: 2,
        display: 'grid', gridTemplateColumns: '1fr 1fr',
        gap: '0',
        padding: 'calc(var(--rj-navbar-height) + 64px) 0 80px',
        minHeight: '100vh',
        alignItems: 'center',
      }}>

        {/* LEFT: text */}
        <div style={{ padding: 'clamp(32px, 6vw, 100px) clamp(32px, 5vw, 80px)' }}>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease, delay: 0.15 }}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 32 }}
          >
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#C9A84C' }} />
            <span style={{ fontSize: 10, letterSpacing: '0.35em', textTransform: 'uppercase', color: '#C9A84C', fontFamily: 'var(--font-inter, sans-serif)' }}>
              R&amp;J Design Studio · Nairobi
            </span>
          </motion.div>

          <div style={{ overflow: 'hidden', marginBottom: 6 }}>
            <motion.h1
              initial={{ y: '110%' }}
              animate={{ y: 0 }}
              transition={{ duration: 1.1, ease, delay: 0.28 }}
              style={{
                fontFamily: 'var(--font-playfair, Georgia, serif)',
                fontSize: 'clamp(44px, 5.2vw, 80px)',
                color: '#F0EBE0', fontWeight: 400, lineHeight: 1.04, margin: 0,
              }}
            >
              Step Inside
            </motion.h1>
          </div>
          <div style={{ overflow: 'hidden', marginBottom: 6 }}>
            <motion.h1
              initial={{ y: '110%' }}
              animate={{ y: 0 }}
              transition={{ duration: 1.1, ease, delay: 0.40 }}
              style={{
                fontFamily: 'var(--font-playfair, Georgia, serif)',
                fontSize: 'clamp(44px, 5.2vw, 80px)',
                color: '#F0EBE0', fontWeight: 400, lineHeight: 1.04, margin: 0,
              }}
            >
              Your Home.
            </motion.h1>
          </div>
          <div style={{ overflow: 'hidden', marginBottom: 40 }}>
            <motion.h1
              initial={{ y: '110%' }}
              animate={{ y: 0 }}
              transition={{ duration: 1.1, ease, delay: 0.52 }}
              style={{
                fontFamily: 'var(--font-playfair, Georgia, serif)',
                fontSize: 'clamp(44px, 5.2vw, 80px)',
                color: '#C9A84C', fontStyle: 'italic', fontWeight: 400, lineHeight: 1.04, margin: 0,
              }}
            >
              Before It Exists.
            </motion.h1>
          </div>

          <motion.div
            initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
            transition={{ duration: 0.8, ease, delay: 0.72 }}
            style={{ width: 64, height: 2, background: 'linear-gradient(90deg,#C9A84C,#E8C96D)', marginBottom: 32, transformOrigin: 'left' }}
          />

          <motion.p
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease, delay: 0.82 }}
            style={{
              fontFamily: 'var(--font-inter, sans-serif)',
              fontSize: 'clamp(16px, 1.6vw, 19px)', color: '#6A8098',
              lineHeight: 1.9, maxWidth: 420, marginBottom: 48,
            }}
          >
            An immersive home you can walk through, choosing every drape
            before a shilling is spent — the experience we are building toward.
            Available today: our online fabric studio.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease, delay: 0.96 }}
            style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'center' }}
          >
            <Link href="/studio" style={{
              display: 'inline-flex', alignItems: 'center', gap: 10,
              background: 'linear-gradient(135deg,#B8922A 0%,#E8C87A 50%,#C9A84C 100%)',
              color: '#0A0A10', padding: '16px 36px', borderRadius: 3,
              fontFamily: 'var(--font-inter, sans-serif)', fontSize: 14,
              fontWeight: 700, textDecoration: 'none', letterSpacing: '0.06em',
              textTransform: 'uppercase', whiteSpace: 'nowrap',
              transition: 'all 0.3s ease',
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 10px 32px rgba(201,168,76,0.35)' }}
              onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '' }}
            >
              Enter the Studio
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m5 12h14M13 6l6 6-6 6" /></svg>
            </Link>
            <Link href="/book" style={{
              display: 'inline-flex', alignItems: 'center',
              background: 'transparent', border: '1.5px solid rgba(201,168,76,0.4)',
              color: '#C9A84C', padding: '16px 32px', borderRadius: 3,
              fontFamily: 'var(--font-inter, sans-serif)', fontSize: 14,
              fontWeight: 500, textDecoration: 'none', letterSpacing: '0.04em',
              whiteSpace: 'nowrap', transition: 'all 0.25s ease',
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = '#C9A84C'; e.currentTarget.style.background = 'rgba(201,168,76,0.07)' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(201,168,76,0.4)'; e.currentTarget.style.background = 'transparent' }}
            >
              Book a consultation
            </Link>
          </motion.div>
        </div>

        {/* RIGHT: floating colour orbs with mouse parallax */}
        <motion.div
          style={{ position: 'relative', height: '100%', minHeight: 520, x: springX, y: springY }}
        >
          {SWATCHES.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: [0, 0.82, 0.82], scale: 1, y: ['0%', `-${6 + (i % 3) * 4}%`, '0%'] }}
              transition={{
                opacity: { duration: 1.2, delay: 0.3 + i * 0.08, ease },
                scale:   { duration: 1.0, delay: 0.3 + i * 0.08, ease },
                y:       { duration: s.dur, delay: s.delay, repeat: Infinity, ease: 'easeInOut' },
              }}
              style={{
                position: 'absolute',
                left: `${s.x}%`, top: `${s.y}%`,
                width: s.size, height: s.size,
                borderRadius: '50%',
                background: s.color,
                boxShadow: `0 8px 40px ${s.color}44, inset 0 -8px 20px rgba(0,0,0,0.25)`,
                filter: 'blur(0.5px)',
              }}
            />
          ))}
          <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', opacity: 0.08 }}>
            <line x1="8%" y1="12%" x2="28%" y2="44%" stroke="#C9A84C" strokeWidth="0.5" />
            <line x1="28%" y1="44%" x2="52%" y2="6%" stroke="#C9A84C" strokeWidth="0.5" />
            <line x1="52%" y1="6%" x2="82%" y2="22%" stroke="#C9A84C" strokeWidth="0.5" />
            <line x1="14%" y1="74%" x2="44%" y2="28%" stroke="#C9A84C" strokeWidth="0.5" />
            <line x1="64%" y1="78%" x2="88%" y2="68%" stroke="#C9A84C" strokeWidth="0.5" />
          </svg>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.6 }}
        style={{
          position: 'absolute', bottom: 40, left: '50%',
          transform: 'translateX(-50%)', zIndex: 3,
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
        }}
      >
        <span style={{ fontSize: 9, color: 'rgba(201,168,76,0.45)', letterSpacing: '0.35em', textTransform: 'uppercase', fontFamily: 'var(--font-inter, sans-serif)' }}>
          Scroll to explore
        </span>
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          style={{ width: 1, height: 44, background: 'linear-gradient(to bottom, rgba(201,168,76,0.6), transparent)' }}
        />
      </motion.div>
    </section>
  )
}
