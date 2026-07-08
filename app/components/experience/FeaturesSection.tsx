'use client'

import { motion } from 'framer-motion'

const ease = [0.22, 1, 0.36, 1] as const

function fadeUp(delay = 0) {
  return {
    initial:     { opacity: 0, y: 32 },
    whileInView: { opacity: 1, y: 0 },
    viewport:    { once: true, margin: '-60px' },
    transition:  { duration: 0.9, ease, delay },
  }
}

function LightIcon() {
  return (
    <svg width="52" height="52" viewBox="0 0 52 52" fill="none">
      <circle cx="26" cy="26" r="25" stroke="rgba(201,168,76,0.2)" strokeWidth="1" />
      <circle cx="26" cy="26" r="8" stroke="#C9A84C" strokeWidth="1.5" />
      <line x1="26" y1="6"  x2="26" y2="14" stroke="#C9A84C" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="26" y1="38" x2="26" y2="46" stroke="#C9A84C" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="6"  y1="26" x2="14" y2="26" stroke="#C9A84C" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="38" y1="26" x2="46" y2="26" stroke="#C9A84C" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="12.7" y1="12.7" x2="18.4" y2="18.4" stroke="#C9A84C" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
      <line x1="33.6" y1="33.6" x2="39.3" y2="39.3" stroke="#C9A84C" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
      <line x1="39.3" y1="12.7" x2="33.6" y2="18.4" stroke="#C9A84C" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
      <line x1="18.4" y1="33.6" x2="12.7" y2="39.3" stroke="#C9A84C" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
    </svg>
  )
}

function WalkIcon() {
  return (
    <svg width="52" height="52" viewBox="0 0 52 52" fill="none">
      <circle cx="26" cy="26" r="25" stroke="rgba(201,168,76,0.2)" strokeWidth="1" />
      <path d="M14 28 L26 16 L38 28 L38 40 L14 40 Z" stroke="#C9A84C" strokeWidth="1.5" strokeLinejoin="round" fill="none" />
      <rect x="22" y="32" width="8" height="8" rx="0.5" stroke="#C9A84C" strokeWidth="1.2" fill="none" />
      <rect x="15" y="29" width="5" height="5" rx="0.5" stroke="#C9A84C" strokeWidth="1" fill="none" opacity="0.6" />
      <rect x="32" y="29" width="5" height="5" rx="0.5" stroke="#C9A84C" strokeWidth="1" fill="none" opacity="0.6" />
      <path d="M26 44 L26 49" stroke="#C9A84C" strokeWidth="1.5" strokeLinecap="round" opacity="0.4" />
    </svg>
  )
}

function FabricIcon() {
  return (
    <svg width="52" height="52" viewBox="0 0 52 52" fill="none">
      <circle cx="26" cy="26" r="25" stroke="rgba(201,168,76,0.2)" strokeWidth="1" />
      <path d="M16 12 C18 16 14 20 16 24 C18 28 14 32 16 36 C18 40 16 44 16 44" stroke="#C9A84C" strokeWidth="1.5" strokeLinecap="round" fill="none" />
      <path d="M22 12 C24 16 20 20 22 24 C24 28 20 32 22 36 C24 40 22 44 22 44" stroke="#C9A84C" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.75" />
      <path d="M28 12 C30 16 26 20 28 24 C30 28 26 32 28 36 C30 40 28 44 28 44" stroke="#C9A84C" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.5" />
      <path d="M34 12 C36 16 32 20 34 24 C36 28 32 32 34 36 C36 40 34 44 34 44" stroke="#C9A84C" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.3" />
      <line x1="12" y1="12" x2="40" y2="12" stroke="#C9A84C" strokeWidth="2" strokeLinecap="round" />
      {[16, 22, 28, 34].map(cx => (
        <circle key={cx} cx={cx} cy="12" r="2" stroke="#C9A84C" strokeWidth="1" fill="none" />
      ))}
    </svg>
  )
}

function ConfidenceIcon() {
  return (
    <svg width="52" height="52" viewBox="0 0 52 52" fill="none">
      <circle cx="26" cy="26" r="25" stroke="rgba(201,168,76,0.2)" strokeWidth="1" />
      <circle cx="26" cy="26" r="14" stroke="rgba(201,168,76,0.35)" strokeWidth="1" strokeDasharray="3 3" />
      <path d="M18 26 L23 31 L34 20" stroke="#C9A84C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

const FEATURES = [
  {
    icon: <LightIcon />,
    kicker: 'Lighting',
    title: 'Daylight. Dusk. Yours.',
    body: 'Our renderer simulates actual Nairobi morning light — the angle, the warmth, the way it bleeds through sheer fabric. Toggle to dusk and watch the room shift. See your curtains in the exact conditions of your home.',
    detail: 'HDRI environment · Soft shadows · Real window glow',
  },
  {
    icon: <WalkIcon />,
    kicker: 'Space',
    title: 'Walk the Whole Home.',
    body: 'From the street, through the front door, into the sitting room and on to the bedroom. The curtains follow you — the same colour and fabric on every window, updating everywhere when you choose.',
    detail: 'Exterior · Sitting room · Bedroom',
  },
  {
    icon: <FabricIcon />,
    kicker: 'Material',
    title: 'Every Fabric. Real Scale.',
    body: 'Sheer linen that whispers light. Heavy velvet that commands a room. Each fabric has its own drape, its own sheen, its own character. See how the wave catches when sunlight hits.',
    detail: 'Sheer · Wave-fold linen · Pinch-pleat velvet · Eyelet cotton',
  },
  {
    icon: <ConfidenceIcon />,
    kicker: 'Decision',
    title: 'Order With Certainty.',
    body: 'No more guessing from a swatch. What you see in the studio is what we make. When you confirm your design, you are not hoping — you are choosing something you have already lived in.',
    detail: 'Zero surprises · Same-day quote · Delivered and installed',
  },
]

export default function FeaturesSection() {
  return (
    <section style={{
      background:   '#091628',
      borderTop:    '1px solid rgba(201,168,76,0.1)',
      borderBottom: '1px solid rgba(201,168,76,0.1)',
      position:     'relative',
      overflow:     'hidden',
    }}>
      {/* Subtle diagonal rule */}
      <div style={{
        position:        'absolute',
        inset:           0,
        pointerEvents:   'none',
        background:      'linear-gradient(135deg, rgba(201,168,76,0.02) 25%, transparent 25%, transparent 50%, rgba(201,168,76,0.02) 50%, rgba(201,168,76,0.02) 75%, transparent 75%)',
        backgroundSize:  '80px 80px',
        opacity:         0.5,
      }} />

      {/* Section header */}
      <div style={{ padding: 'clamp(60px, 8vw, 100px) clamp(32px, 8vw, 120px) clamp(48px, 6vw, 72px)', position: 'relative' }}>
        <motion.p {...fadeUp(0)} style={{
          fontFamily:    'var(--font-inter, sans-serif)',
          fontSize:      10,
          color:         '#C9A84C',
          letterSpacing: '0.38em',
          textTransform: 'uppercase',
          marginBottom:  18,
        }}>
          What Makes It Different
        </motion.p>
        <motion.h2 {...fadeUp(0.1)} style={{
          fontFamily: 'var(--font-playfair, Georgia, serif)',
          fontSize:   'clamp(34px, 4vw, 58px)',
          color:      '#F0EBE0',
          fontWeight: 400,
          lineHeight: 1.08,
          margin:     0,
          maxWidth:   560,
        }}>
          Not a mood board.
          <span style={{ color: '#C9A84C', fontStyle: 'italic' }}> A room.</span>
        </motion.h2>
      </div>

      {/* On mobile the cards stack to one column — drop the right-edge divider. */}
      <style>{`
        @media (max-width: 768px) {
          .exp-feature-card { border-right: none !important; }
        }
      `}</style>

      {/* Feature grid */}
      <div style={{
        display:             'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
        borderTop:           '1px solid rgba(201,168,76,0.08)',
        position:            'relative',
      }}>
        {FEATURES.map((f, i) => (
          <motion.div
            key={f.kicker}
            className="exp-feature-card"
            {...fadeUp(0.08 * i)}
            style={{
              padding:      'clamp(40px, 5vw, 64px) clamp(28px, 4vw, 48px)',
              borderRight:  i < FEATURES.length - 1 ? '1px solid rgba(201,168,76,0.08)' : 'none',
              borderBottom: '1px solid rgba(201,168,76,0.08)',
              cursor:       'default',
              transition:   'background 0.35s ease',
            }}
            whileHover={{ backgroundColor: 'rgba(201,168,76,0.025)' } as any}
          >
            <div style={{ marginBottom: 28 }}>{f.icon}</div>

            <p style={{
              fontFamily:    'var(--font-inter, sans-serif)',
              fontSize:      9,
              color:         '#C9A84C',
              letterSpacing: '0.35em',
              textTransform: 'uppercase',
              marginBottom:  14,
            }}>
              {f.kicker}
            </p>

            <h3 style={{
              fontFamily:   'var(--font-playfair, Georgia, serif)',
              fontSize:     'clamp(22px, 2.4vw, 30px)',
              color:        '#F0EBE0',
              fontWeight:   400,
              lineHeight:   1.2,
              marginBottom: 18,
            }}>
              {f.title}
            </h3>

            <div style={{ width: 32, height: 1, background: 'linear-gradient(90deg,#C9A84C,transparent)', marginBottom: 20 }} />

            <p style={{
              fontFamily:   'var(--font-inter, sans-serif)',
              fontSize:     'clamp(14px, 1.3vw, 15px)',
              color:        '#5A7088',
              lineHeight:   1.85,
              marginBottom: 28,
            }}>
              {f.body}
            </p>

            <p style={{
              fontFamily:    'var(--font-inter, sans-serif)',
              fontSize:      10,
              color:         'rgba(201,168,76,0.5)',
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              lineHeight:    1.8,
              borderTop:     '1px solid rgba(201,168,76,0.1)',
              paddingTop:    16,
            }}>
              {f.detail}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
