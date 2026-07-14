'use client'

import { motion, useScroll, useTransform, useInView } from 'framer-motion'
import { useRef } from 'react'

const ease = [0.22, 1, 0.36, 1] as const

const STEPS = [
  {
    number: '01',
    heading: 'Choose who you are.',
    sub: 'Her space or his? We calibrate the eye level to yours — so you\'re looking at the curtains from exactly where you\'d stand in real life. The room scales to your height, your perspective, your home.',
    aside: 'Female · Male · Any height',
    accent: '#C9A84C',
  },
  {
    number: '02',
    heading: 'Walk in from outside.',
    sub: 'The journey starts at the street. You see the house from the front — curtains visible through the windows, exactly as a guest would. Then you step through the door. The sitting room opens up. Turn left — the bedroom waits.',
    aside: 'Exterior → Sitting Room → Bedroom',
    accent: '#A07C38',
  },
  {
    number: '03',
    heading: 'Change every curtain at once.',
    sub: 'Pick a colour from 14 curated shades. Switch fabric — sheer whispers, linen drapes, velvet commands. Every window in the house updates instantly. You\'re designing a home, not a single curtain.',
    aside: '14 colours · 4 fabrics · All rooms in sync',
    accent: '#C9A84C',
  },
  {
    number: '04',
    heading: 'When it feels right — confirm.',
    sub: 'You\'ll know the moment it looks right. Walk back to the sofa. Look at the full room. When the light hits the fabric and the colour feels true, that\'s the one. Confirm it. We make exactly what you saw.',
    aside: 'Zero surprises · Delivered & installed',
    accent: '#E8C87A',
  },
]

function StepPanel({ step, index }: { step: typeof STEPS[number]; index: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })
  const isOdd = index % 2 === 1

  return (
    <div
      ref={ref}
      style={{
        position: 'relative',
        borderBottom: '1px solid rgba(201,168,76,0.08)',
        background: isOdd ? 'rgba(255,255,255,0.012)' : 'transparent',
        overflow: 'hidden',
      }}
    >
      {/* Giant ghost number */}
      <div style={{
        position: 'absolute',
        right: '-0.02em',
        top: '-0.2em',
        fontFamily: 'var(--font-playfair, Georgia, serif)',
        fontSize: 'clamp(180px, 22vw, 300px)',
        color: 'rgba(201,168,76,0.035)',
        lineHeight: 1,
        userSelect: 'none',
        pointerEvents: 'none',
        fontWeight: 400,
        letterSpacing: '-0.04em',
      }}>
        {step.number}
      </div>

      <div className="exp-step-grid" style={{
        position: 'relative', zIndex: 2,
        display: 'grid',
        gridTemplateColumns: '220px 1fr',
        padding: 'clamp(56px, 7vw, 96px) clamp(32px, 8vw, 120px)',
        gap: 'clamp(32px, 6vw, 80px)',
        alignItems: 'center',
      }}>
        {/* LEFT: step indicator */}
        <div>
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, ease, delay: 0.05 }}
          >
            <p style={{
              fontFamily: 'var(--font-inter, sans-serif)', fontSize: 9,
              color: 'rgba(201,168,76,0.5)', letterSpacing: '0.38em', textTransform: 'uppercase',
              marginBottom: 20,
            }}>
              Step {step.number}
            </p>

            <div style={{
              fontFamily: 'var(--font-playfair, Georgia, serif)',
              fontSize: 'clamp(56px, 7vw, 96px)',
              color: 'transparent',
              fontWeight: 400,
              lineHeight: 1,
              WebkitTextStroke: `1px ${step.accent}`,
              letterSpacing: '-0.02em',
              marginBottom: 28,
            }}>
              {step.number}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div style={{ width: 1, height: 48, background: `linear-gradient(to bottom, ${step.accent}, transparent)` }} />
              <p style={{
                fontFamily: 'var(--font-inter, sans-serif)', fontSize: 10,
                color: 'rgba(201,168,76,0.38)', letterSpacing: '0.2em', textTransform: 'uppercase',
                lineHeight: 1.6,
              }}>
                {step.aside}
              </p>
            </div>
          </motion.div>
        </div>

        {/* RIGHT: heading + body */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, ease, delay: 0.15 }}
        >
          <h3 style={{
            fontFamily: 'var(--font-playfair, Georgia, serif)',
            fontSize: 'clamp(30px, 3.8vw, 54px)',
            color: '#F0EBE0', fontWeight: 400, lineHeight: 1.15,
            marginBottom: 24, letterSpacing: '-0.01em',
          }}>
            {step.heading}
          </h3>

          <div style={{ width: 40, height: 1, background: `linear-gradient(90deg, ${step.accent}, transparent)`, marginBottom: 24 }} />

          <p style={{
            fontFamily: 'var(--font-inter, sans-serif)',
            fontSize: 'clamp(15px, 1.5vw, 18px)', color: '#5A7088',
            lineHeight: 1.9, maxWidth: 560,
          }}>
            {step.sub}
          </p>
        </motion.div>
      </div>
    </div>
  )
}

export default function StepsSection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start end', 'end start'] })
  useTransform(scrollYProgress, [0, 1], ['0%', '100%'])

  return (
    <section ref={sectionRef} id="how-it-works" style={{ background: '#0D1B2E', position: 'relative' }}>

      {/* On mobile the fixed "220px 1fr" step layout starves the text column and
          spills the heading/body off-screen — stack it into one column instead. */}
      <style>{`
        @media (max-width: 768px) {
          .exp-step-grid {
            grid-template-columns: 1fr !important;
            gap: 20px !important;
            align-items: start !important;
          }
        }
      `}</style>

      {/* Section header */}
      <div style={{
        padding: 'clamp(80px, 10vw, 120px) clamp(32px, 8vw, 120px) clamp(56px, 7vw, 80px)',
        borderBottom: '1px solid rgba(201,168,76,0.1)',
        display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end',
        flexWrap: 'wrap', gap: 32,
        position: 'relative',
      }}>
        <div>
          <motion.p
            initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.7, ease }}
            style={{
              fontFamily: 'var(--font-inter, sans-serif)', fontSize: 10,
              color: '#C9A84C', letterSpacing: '0.38em', textTransform: 'uppercase', marginBottom: 20,
            }}
          >
            The Journey · Our Vision
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.9, ease, delay: 0.1 }}
            style={{
              fontFamily: 'var(--font-playfair, Georgia, serif)',
              fontSize: 'clamp(38px, 5vw, 68px)', color: '#F0EBE0',
              fontWeight: 400, lineHeight: 1.05, margin: 0,
            }}
          >
            Four steps.
            <br />
            <span style={{ color: '#C9A84C', fontStyle: 'italic' }}>One perfect room.</span>
          </motion.h2>
        </div>

        <motion.p
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
          viewport={{ once: true }} transition={{ duration: 0.8, ease, delay: 0.25 }}
          style={{
            fontFamily: 'var(--font-inter, sans-serif)', fontSize: 15,
            color: '#3A4E62', lineHeight: 1.8, maxWidth: 340, margin: 0,
          }}
        >
          From your front door to your bedroom window —
          the whole home, at full scale, in a single session.
          This is the immersive experience we are building toward.
        </motion.p>

        {/* Animated progress line */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0,
          height: 1, width: '100%',
          background: 'rgba(201,168,76,0.1)',
          overflow: 'hidden',
        }}>
          <motion.div
            initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }}
            viewport={{ once: true }} transition={{ duration: 1.2, ease, delay: 0.3 }}
            style={{ height: '100%', background: 'linear-gradient(90deg,#C9A84C,#E8C87A,transparent)', transformOrigin: 'left' }}
          />
        </div>
      </div>

      {STEPS.map((step, i) => (
        <StepPanel key={step.number} step={step} index={i} />
      ))}

      {/* Bottom — "Next: book" strip */}
      <motion.div
        initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }} transition={{ duration: 0.9, ease }}
        style={{
          padding: 'clamp(40px, 5vw, 64px) clamp(32px, 8vw, 120px)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          flexWrap: 'wrap', gap: 24,
          borderTop: '1px solid rgba(201,168,76,0.1)',
        }}
      >
        <p style={{
          fontFamily: 'var(--font-playfair, Georgia, serif)',
          fontSize: 'clamp(22px, 2.5vw, 32px)', color: '#F0EBE0',
          fontWeight: 400, margin: 0,
        }}>
          Ready to start your four steps?
        </p>
        <a href="/founding" style={{
          display: 'inline-flex', alignItems: 'center', gap: 10,
          background: 'linear-gradient(135deg,#B8922A,#E8C87A,#C9A84C)',
          color: '#0A0A10', padding: '14px 32px', borderRadius: 3,
          fontFamily: 'var(--font-inter, sans-serif)', fontSize: 13,
          fontWeight: 700, textDecoration: 'none', letterSpacing: '0.06em', textTransform: 'uppercase',
          transition: 'all 0.25s ease', whiteSpace: 'nowrap',
        }}
          onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(201,168,76,0.35)' }}
          onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '' }}
        >
          Book a Session
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m5 12h14M13 6l6 6-6 6" /></svg>
        </a>
      </motion.div>
    </section>
  )
}
