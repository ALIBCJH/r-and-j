'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence, useInView, useReducedMotion } from 'framer-motion'
import { ChevronRight } from 'lucide-react'

const ease = [0.25, 0.1, 0.25, 1] as const

/* The R&J journey, distilled to three movements. Each word glows in turn while
   its description cross-fades in below — the three original steps, compressed. */
const STAGES = [
  {
    word: 'Imagine',
    desc: 'Step into a high-fidelity 3D shell of your space — a Nairobi penthouse, a coastal villa, or your own blueprint.',
  },
  {
    word: 'Experience',
    desc: 'Drape it in hundreds of curated fabrics and gold-leaf finishes, rendered live under real lighting — then walk through it in immersive 360° VR.',
  },
  {
    word: 'Create',
    desc: 'When the vision is perfect, confirm — and our craftspeople bring it to life, thread by thread, exactly as you saw it.',
  },
]

const HOLD_MS = 2800

export default function ProcessSection() {
  const reduce = useReducedMotion()
  const ref    = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { amount: 0.4 })

  const [active,  setActive]  = useState(0)
  const [paused,  setPaused]  = useState(false)

  // Auto-advance the glow — paused on hover/focus, off-screen, or reduced motion.
  useEffect(() => {
    if (reduce || !inView || paused) return
    const id = window.setInterval(
      () => setActive(a => (a + 1) % STAGES.length),
      HOLD_MS,
    )
    return () => window.clearInterval(id)
  }, [reduce, inView, paused])

  return (
    <>
      {/* ── The R&J Journey — Imagine · Experience · Create ── */}
      <section style={{
        background: '#0D1B2E',
        padding:    '130px 6vw',
        borderTop:  '1px solid rgba(201,168,76,0.12)',
        position:   'relative',
        overflow:   'hidden',
      }}>
        {/* Ambient gold glow */}
        <div aria-hidden style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background: 'radial-gradient(ellipse 50% 55% at 50% 42%, rgba(201,168,76,0.12) 0%, transparent 70%)',
        }} />

        <style>{`
          .journey {
            position: relative;
            max-width: 1100px;
            margin: 0 auto;
            text-align: center;
          }
          .journey-eyebrow {
            font-family: var(--font-inter, sans-serif);
            font-size: var(--rj-font-label);
            color: #C9A84C;
            letter-spacing: 5px;
            text-transform: uppercase;
            margin-bottom: 40px;
          }
          .journey-words {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: clamp(14px, 3vw, 44px);
            flex-wrap: wrap;
          }
          .journey-cell {
            display: flex;
            align-items: center;
            gap: clamp(14px, 3vw, 44px);
          }
          .journey-word {
            font-family: var(--font-playfair, Georgia, serif);
            font-style: italic;
            font-size: clamp(40px, 6.4vw, 92px);
            line-height: 1.04;
            color: #E8C96D;
            background: none;
            border: none;
            padding: 0 4px;
            margin: 0;
            cursor: pointer;
            -webkit-tap-highlight-color: transparent;
          }
          .journey-word:focus-visible {
            outline: 2px solid rgba(232,201,109,0.7);
            outline-offset: 8px;
            border-radius: 4px;
          }
          .journey-sep {
            color: rgba(201,168,76,0.45);
            display: flex;
            align-items: center;
            flex-shrink: 0;
          }
          .journey-desc-wrap {
            position: relative;
            min-height: 110px;
            max-width: 620px;
            margin: 36px auto 0;
            display: flex;
            align-items: flex-start;
            justify-content: center;
          }
          .journey-desc {
            font-family: var(--font-inter, sans-serif);
            font-size: clamp(15px, 1.35vw, 18px);
            line-height: 1.85;
            color: #9FB0BF;
            margin: 0;
          }
          .journey-dots {
            display: flex;
            gap: 10px;
            justify-content: center;
            margin-top: 28px;
          }
          .journey-dot {
            width: 8px; height: 8px;
            border-radius: 999px;
            border: none; padding: 0;
            cursor: pointer;
            background: rgba(201,168,76,0.25);
            transition: width 0.45s ease, background 0.45s ease, box-shadow 0.45s ease;
          }
          .journey-dot:focus-visible {
            outline: 2px solid rgba(232,201,109,0.7);
            outline-offset: 4px;
          }
          .journey-dot.is-active {
            width: 28px;
            background: linear-gradient(90deg, #C9A84C, #E8C96D);
            box-shadow: 0 0 10px rgba(232,201,109,0.6);
          }
          .sr-only {
            position: absolute;
            width: 1px; height: 1px;
            margin: -1px; padding: 0;
            overflow: hidden;
            clip: rect(0,0,0,0);
            white-space: nowrap;
            border: 0;
          }
          @media (max-width: 768px) {
            .journey-words { flex-direction: column; gap: 6px; }
            .journey-cell { flex-direction: column; gap: 6px; }
            .journey-sep { transform: rotate(90deg); }
            .journey-desc-wrap { min-height: 150px; }
          }
        `}</style>

        <motion.div
          ref={ref}
          className="journey"
          initial={{ opacity: 0, y: 36 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.9, ease }}
        >
          <p className="journey-eyebrow">How It Works</p>

          {/* Hidden heading keeps the section's semantics & SEO intact */}
          <h2 className="sr-only">
            Imagine, Experience, Create — the R&amp;J journey from idea to installation.
          </h2>

          {/* The three movements */}
          <div className="journey-words">
            {STAGES.map(({ word }, i) => {
              const isActive = active === i
              return (
                <div key={word} className="journey-cell">
                  {i > 0 && (
                    <span className="journey-sep" aria-hidden>
                      <ChevronRight size={26} strokeWidth={1.4} />
                    </span>
                  )}
                  <motion.button
                    type="button"
                    className="journey-word"
                    onClick={() => setActive(i)}
                    onMouseEnter={() => { setActive(i); setPaused(true) }}
                    onMouseLeave={() => setPaused(false)}
                    onFocus={() => { setActive(i); setPaused(true) }}
                    onBlur={() => setPaused(false)}
                    animate={{
                      opacity:    isActive ? 1 : 0.22,
                      scale:      isActive ? 1.05 : 1,
                      textShadow: isActive
                        ? '0 0 90px rgba(232,201,109,0.9), 0 0 42px rgba(232,201,109,0.7), 0 0 14px rgba(255,243,206,0.6)'
                        : '0 0 0px rgba(232,201,109,0), 0 0 0px rgba(232,201,109,0), 0 0 0px rgba(255,243,206,0)',
                    }}
                    transition={{ duration: reduce ? 0 : 0.85, ease }}
                  >
                    {word}
                  </motion.button>
                </div>
              )
            })}
          </div>

          {/* Synced description */}
          <div className="journey-desc-wrap" aria-live="polite">
            <AnimatePresence mode="wait">
              <motion.p
                key={active}
                className="journey-desc"
                initial={reduce ? false : { opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduce ? { opacity: 0 } : { opacity: 0, y: -12 }}
                transition={{ duration: reduce ? 0 : 0.6, ease }}
              >
                {STAGES[active].desc}
              </motion.p>
            </AnimatePresence>
          </div>

          {/* Progress / navigation */}
          <div className="journey-dots">
            {STAGES.map(({ word }, i) => (
              <button
                key={word}
                type="button"
                aria-label={`Show ${word}`}
                aria-current={active === i}
                className={`journey-dot${active === i ? ' is-active' : ''}`}
                onClick={() => setActive(i)}
              />
            ))}
          </div>
        </motion.div>
      </section>

      {/* ── Bridge Quote ── */}
      <section style={{
        background: '#0D1B2E',
        padding:    '72px 6vw',
        borderTop:  '1px solid rgba(201,168,76,0.08)',
      }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 1, ease }}
          style={{ maxWidth: '640px', margin: '0 auto', textAlign: 'center' }}
        >
          <div style={{ width: '48px', height: '1px', background: '#C9A84C', margin: '0 auto 36px', opacity: 0.45 }} />
          <p style={{
            fontFamily: 'var(--font-playfair, Georgia, serif)',
            fontSize:   'clamp(20px, 2vw, 26px)',
            color:      '#FFFFFF',
            fontStyle:  'italic',
            lineHeight: 1.7,
            opacity:    0.85,
          }}>
            &ldquo;Every number represents a client who saw their space before they transformed it.&rdquo;
          </p>
          <div style={{ width: '48px', height: '1px', background: '#C9A84C', margin: '36px auto 0', opacity: 0.45 }} />
        </motion.div>
      </section>
    </>
  )
}
