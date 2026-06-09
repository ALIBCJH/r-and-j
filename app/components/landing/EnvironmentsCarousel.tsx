'use client'

import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useState } from 'react'

const ease = [0.25, 0.1, 0.25, 1] as const

const ROOMS = [
  { name: 'Nairobi Penthouse',    series: 'Nairobi Series',        accent: 'rgba(201,168,76,0.12)' },
  { name: 'Rift Valley Estate',   series: 'Rift Valley Collection', accent: 'rgba(196,120,50,0.12)' },
  { name: 'Mombasa Coastal Villa',series: 'Swahili Coast Series',   accent: 'rgba(74,154,156,0.12)' },
]

export default function EnvironmentsCarousel() {
  const [active, setActive] = useState(0)
  const prev = () => setActive(a => (a - 1 + ROOMS.length) % ROOMS.length)
  const next = () => setActive(a => (a + 1) % ROOMS.length)

  return (
    <section style={{ background: '#0F1117', padding: '120px 6vw', borderTop: '1px solid rgba(201,168,76,0.12)' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>

        {/* Header */}
        <div className="flex items-end justify-between" style={{ marginBottom: '56px' }}>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.7, ease }}
          >
            <p style={{
              fontFamily:    'var(--font-inter, sans-serif)',
              fontSize:      '11px',
              color:         '#C9A84C',
              letterSpacing: '5px',
              textTransform: 'uppercase',
              marginBottom:  '12px',
            }}>
              Curated Worlds
            </p>
            <h2 style={{
              fontFamily: 'var(--font-playfair, Georgia, serif)',
              fontSize:   'clamp(40px, 4.5vw, 58px)',
              color:      '#FFFFFF',
              lineHeight: 1.1,
            }}>
              Residential Environments
            </h2>
          </motion.div>

          <div className="flex gap-3">
            {([['prev', prev, ChevronLeft], ['next', next, ChevronRight]] as const).map(([key, fn, Icon]) => (
              <button
                key={key}
                onClick={fn}
                style={{
                  width:      '44px',
                  height:     '44px',
                  border:     '1px solid rgba(201,168,76,0.35)',
                  background: 'transparent',
                  color:      '#C9A84C',
                  cursor:     'pointer',
                  display:    'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.25s ease',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background   = '#C9A84C'
                  e.currentTarget.style.borderColor  = '#C9A84C'
                  e.currentTarget.style.color        = '#0F1117'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background   = 'transparent'
                  e.currentTarget.style.borderColor  = 'rgba(201,168,76,0.35)'
                  e.currentTarget.style.color        = '#C9A84C'
                }}
              >
                <Icon size={18} />
              </button>
            ))}
          </div>
        </div>

        {/* Cards */}
        <div className="grid md:grid-cols-3" style={{ gap: '24px' }}>
          {ROOMS.map(({ name, series, accent }, i) => (
            <motion.div
              key={name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.7, ease, delay: i * 0.1 }}
              whileHover={{ y: -4 }}
              style={{
                height:     '420px',
                border:     '1px solid rgba(201,168,76,0.18)',
                position:   'relative',
                overflow:   'hidden',
                cursor:     'pointer',
                background: '#13161F',
                transition: 'border-color 0.3s ease',
              }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(201,168,76,0.5)')}
              onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(201,168,76,0.18)')}
            >
              {/* Accent glow */}
              <div style={{
                position:   'absolute',
                inset:      0,
                background: `radial-gradient(ellipse 70% 60% at 50% 30%, ${accent} 0%, transparent 70%)`,
              }} />

              {/* Grid texture */}
              <div style={{
                position:         'absolute',
                inset:            0,
                backgroundImage:  'linear-gradient(rgba(201,168,76,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(201,168,76,0.04) 1px, transparent 1px)',
                backgroundSize:   '48px 48px',
              }} />

              {/* Bottom fade + text */}
              <div style={{
                position:   'absolute',
                bottom:     0,
                left:       0,
                right:      0,
                height:     '50%',
                background: 'linear-gradient(transparent, #13161F)',
              }} />
              <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '28px' }}>
                <h3 style={{
                  fontFamily:   'var(--font-playfair, Georgia, serif)',
                  fontSize:     '22px',
                  color:        '#FFFFFF',
                  marginBottom: '6px',
                }}>
                  {name}
                </h3>
                <p style={{
                  fontFamily:    'var(--font-inter, sans-serif)',
                  fontSize:      '11px',
                  color:         '#C9A84C',
                  letterSpacing: '3px',
                  textTransform: 'uppercase',
                }}>
                  {series}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
