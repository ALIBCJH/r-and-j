'use client'

import { motion } from 'framer-motion'
import { MessageCircle, Sun, MapPin } from 'lucide-react'

const ease = [0.25, 0.1, 0.25, 1] as const

const VALUES = [
  {
    icon:        MessageCircle,
    name:        'We listen first',
    description: "We won't push a fabric on you. We'll ask about your room, your family, how you live in your space. The best curtain isn't the most expensive one — it's the one that actually fits your life.",
  },
  {
    icon:        Sun,
    name:        'We make it last',
    description: 'We choose fabrics that hold their colour, drape, and shape through years of Kenyan sunlight and weather. Because when you spend on something for your home, it should still feel just as right five years later.',
  },
  {
    icon:        MapPin,
    name:        'Proudly Nyeri',
    description: "We're a Nyeri business, and that means something to us. We know Kenyan homes — how the light moves through your windows, how different regions have different seasons. That understanding doesn't come from a catalog.",
  },
]

function GoldLine({ width = 48 }: { width?: number }) {
  return (
    <div style={{
      width:      `${width}px`,
      height:     '2px',
      background: 'linear-gradient(135deg, #E8C96D 0%, #C9A84C 50%, #A67C2E 100%)',
      margin:     '12px auto 0',
    }} />
  )
}

export default function ValuesSection() {
  return (
    <section style={{
      padding: 'clamp(80px, 10vw, 120px) 6vw',
    }}>
      <div style={{ maxWidth: '1240px', margin: '0 auto' }}>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7, ease }}
          style={{ textAlign: 'center', marginBottom: '64px' }}
        >
          <p style={{
            fontFamily:    'var(--font-inter, sans-serif)',
            fontSize:      '11px',
            color:         '#C9A84C',
            letterSpacing: '4px',
            textTransform: 'uppercase',
            marginBottom:  '20px',
          }}>
            What we stand for
          </p>
          <h2 style={{
            fontFamily:   'var(--font-playfair, Georgia, serif)',
            fontSize:     'clamp(36px, 4.5vw, 52px)',
            color:        '#FFFFFF',
            fontWeight:   400,
            lineHeight:   1.1,
            marginBottom: 0,
          }}>
            Three things we<br />believe in.
          </h2>
          <GoldLine width={48} />
        </motion.div>

        {/* Cards */}
        <div
          className="values-grid"
          style={{
            display:             'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap:                 '32px',
          }}
        >
          {VALUES.map((v, i) => {
            const Icon = v.icon
            return (
              <motion.div
                key={v.name}
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.65, ease, delay: i * 0.15 }}
                style={{
                  background:   'transparent',
                  border:       '1px solid rgba(201,168,76,0.2)',
                  borderRadius: '8px',
                  padding:      'clamp(32px, 4vw, 48px) clamp(24px, 3vw, 40px)',
                  textAlign:    'center',
                  transition:   'all 0.35s ease',
                  cursor:       'default',
                }}
                whileHover={{
                  y:           -4,
                  boxShadow:   '0 12px 32px rgba(0,0,0,0.4)',
                  borderColor: 'rgba(201,168,76,0.5)',
                }}
              >
                <Icon size={36} color="#C9A84C" strokeWidth={1.5} />

                <h3 style={{
                  fontFamily:   'var(--font-playfair, Georgia, serif)',
                  fontSize:     '24px',
                  color:        '#FFFFFF',
                  fontWeight:   400,
                  marginTop:    '24px',
                  marginBottom: '16px',
                }}>
                  {v.name}
                </h3>

                <p style={{
                  fontFamily: 'var(--font-inter, sans-serif)',
                  fontSize:   '15px',
                  color:      '#A8B2BE',
                  lineHeight: 1.7,
                }}>
                  {v.description}
                </p>
              </motion.div>
            )
          })}
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .values-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  )
}
