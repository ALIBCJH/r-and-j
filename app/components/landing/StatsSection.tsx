'use client'

import { useRef, useEffect, useState } from 'react'
import { motion, useInView } from 'framer-motion'

const ease = [0.25, 0.1, 0.25, 1] as const

const STATS = [
  { value: 14,  suffix: '',  label: 'Curated Colours' },
  { value: 4,   suffix: '',  label: 'Signature Fabrics' },
  { value: 100, suffix: '%', label: 'Made to Measure' },
]

function CountUp({ to, suffix, active }: { to: number; suffix: string; active: boolean }) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!active) return
    const duration  = 2000
    let startTime: number | null = null

    function step(ts: number) {
      if (!startTime) startTime = ts
      const progress = Math.min((ts - startTime) / duration, 1)
      const eased    = 1 - Math.pow(1 - progress, 3)
      setCount(Math.floor(eased * to))
      if (progress < 1) requestAnimationFrame(step)
      else setCount(to)
    }
    requestAnimationFrame(step)
  }, [active, to])

  return <>{count}{suffix}</>
}

export default function StatsSection() {
  const ref    = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.1 })

  return (
    <section
      ref={ref}
      style={{ background: '#0D1B2E', padding: '100px 6vw', borderTop: '1px solid rgba(201,168,76,0.12)' }}
    >
      <style>{`@media (max-width: 640px) { .stats-grid { grid-template-columns: 1fr !important; } }`}</style>
      <div
        className="stats-grid"
        style={{
          maxWidth:       '1400px',
          margin:         '0 auto',
          display:        'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap:            '2px',
          background:     'rgba(201,168,76,0.1)',
        }}
      >
        {STATS.map(({ value, suffix, label }, i) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease, delay: i * 0.12 }}
            style={{
              background: '#0A1525',
              padding:    '60px 40px',
              textAlign:  'center',
            }}
          >
            <div style={{
              fontFamily:          'var(--font-playfair, Georgia, serif)',
              fontSize:            'clamp(64px, 7vw, 96px)',
              fontWeight:          700,
              lineHeight:          1,
              background:          'linear-gradient(135deg, #F0D77A 0%, #C9A84C 60%, #A67C2E 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip:      'text',
              marginBottom:        '16px',
            }}>
              <CountUp to={value} suffix={suffix} active={inView} />
            </div>
            <p style={{
              fontFamily:    'var(--font-inter, sans-serif)',
              fontSize:      '14px',
              letterSpacing: '3px',
              color:         '#7A8899',
              textTransform: 'uppercase',
            }}>
              {label}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
