'use client'

import { motion } from 'framer-motion'

const ease = [0.25, 0.1, 0.25, 1] as const

const CHAPTERS = [
  {
    number:  '01',
    eyebrow: 'The Problem',
    heading: 'You Bought the Wrong Fabric.',
    body:    'You fell in love with the swatch — the colour, the way it caught the light. Then it arrived. You hung it. Something was just off. The money was gone.',
  },
  {
    number:  '02',
    eyebrow: 'The Breakthrough',
    heading: 'So We Built a Better Way.',
    body:    'A tool that lets you see your exact curtains in your actual room — your walls, your light — before you spend a single shilling.',
  },
  {
    number:  '03',
    eyebrow: 'Our Roots',
    heading: 'Nyeri-Born. Kenya-Wide.',
    body:    'We understand how Kenyan homes are built, how the afternoon sun moves through your windows, and which fabrics hold their beauty through every season.',
  },
  {
    number:  '04',
    eyebrow: 'The Promise',
    heading: "We Don't Stop Until It's Right.",
    body:    "We pick up the phone. We show up. The job isn't done until you look at your windows and feel exactly what you always imagined.",
  },
]

function Divider() {
  return (
    <div style={{
      width:      '100%',
      height:     '1px',
      background: 'linear-gradient(to right, transparent, rgba(201,168,76,0.18) 20%, rgba(201,168,76,0.18) 80%, transparent)',
    }} />
  )
}

export default function StorySection() {
  return (
    <section style={{
      background: '#07101E',
      padding:    '120px 6vw',
      borderTop:  '1px solid rgba(201,168,76,0.12)',
    }}>
      <div style={{ maxWidth: '1240px', margin: '0 auto' }}>

        {/* Section label */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, ease }}
          style={{
            fontFamily:    'var(--font-inter, sans-serif)',
            fontSize:      '11px',
            color:         '#C9A84C',
            letterSpacing: '5px',
            textTransform: 'uppercase',
            marginBottom:  '80px',
          }}
        >
          The Story
        </motion.p>

        {/* Chapters */}
        {CHAPTERS.map((chapter, i) => {
          const isEven = i % 2 === 0

          return (
            <div key={chapter.number}>

              {/* Chapter row */}
              <motion.div
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.85, ease, delay: 0.1 }}
                className="chapter-grid"
              >
                {isEven ? (
                  <>
                    {/* Content LEFT */}
                    <div className="chapter-content">
                      <p style={{
                        fontFamily:    'var(--font-inter, sans-serif)',
                        fontSize:      '10px',
                        color:         '#C9A84C',
                        letterSpacing: '4px',
                        textTransform: 'uppercase',
                        marginBottom:  '20px',
                      }}>
                        {chapter.eyebrow}
                      </p>
                      <h2 style={{
                        fontFamily:   'var(--font-playfair, Georgia, serif)',
                        fontSize:     'clamp(28px, 3.2vw, 46px)',
                        color:        '#FFFFFF',
                        fontWeight:   400,
                        lineHeight:   1.15,
                        marginBottom: '24px',
                      }}>
                        {chapter.heading}
                      </h2>
                      <p style={{
                        fontFamily: 'var(--font-inter, sans-serif)',
                        fontSize:   '15px',
                        color:      '#7A8A9A',
                        lineHeight: 1.85,
                        maxWidth:   '420px',
                      }}>
                        {chapter.body}
                      </p>
                    </div>

                    {/* Number RIGHT (watermark) */}
                    <div className="chapter-number-col" style={{ textAlign: 'right', overflow: 'hidden' }}>
                      <span className="chapter-number" style={{
                        fontFamily:  'var(--font-playfair, Georgia, serif)',
                        fontWeight:  700,
                        color:       'rgba(201,168,76,0.06)',
                        lineHeight:  0.85,
                        display:     'block',
                        userSelect:  'none',
                      }}>
                        {chapter.number}
                      </span>
                    </div>
                  </>
                ) : (
                  <>
                    {/* Number LEFT (watermark) */}
                    <div className="chapter-number-col" style={{ textAlign: 'left', overflow: 'hidden' }}>
                      <span className="chapter-number" style={{
                        fontFamily:  'var(--font-playfair, Georgia, serif)',
                        fontWeight:  700,
                        color:       'rgba(201,168,76,0.06)',
                        lineHeight:  0.85,
                        display:     'block',
                        userSelect:  'none',
                      }}>
                        {chapter.number}
                      </span>
                    </div>

                    {/* Content RIGHT */}
                    <div className="chapter-content">
                      <p style={{
                        fontFamily:    'var(--font-inter, sans-serif)',
                        fontSize:      '10px',
                        color:         '#C9A84C',
                        letterSpacing: '4px',
                        textTransform: 'uppercase',
                        marginBottom:  '20px',
                      }}>
                        {chapter.eyebrow}
                      </p>
                      <h2 style={{
                        fontFamily:   'var(--font-playfair, Georgia, serif)',
                        fontSize:     'clamp(28px, 3.2vw, 46px)',
                        color:        '#FFFFFF',
                        fontWeight:   400,
                        lineHeight:   1.15,
                        marginBottom: '24px',
                      }}>
                        {chapter.heading}
                      </h2>
                      <p style={{
                        fontFamily: 'var(--font-inter, sans-serif)',
                        fontSize:   '15px',
                        color:      '#7A8A9A',
                        lineHeight: 1.85,
                        maxWidth:   '420px',
                      }}>
                        {chapter.body}
                      </p>
                    </div>
                  </>
                )}
              </motion.div>

              {/* Pull quote between chapter 2 and 3 */}
              {i === 1 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-60px' }}
                  transition={{ duration: 0.9, ease }}
                  style={{ padding: '80px 0', textAlign: 'center' }}
                >
                  {/* Vertical line top */}
                  <div style={{
                    width:      '1px',
                    height:     '56px',
                    background: 'linear-gradient(to bottom, transparent, rgba(201,168,76,0.55))',
                    margin:     '0 auto 44px',
                  }} />

                  <p style={{
                    fontFamily: 'var(--font-playfair, Georgia, serif)',
                    fontSize:   'clamp(22px, 2.8vw, 36px)',
                    color:      '#FFFFFF',
                    fontStyle:  'italic',
                    fontWeight: 400,
                    lineHeight: 1.5,
                    maxWidth:   '720px',
                    margin:     '0 auto',
                  }}>
                    &ldquo;The right fabric doesn&apos;t just cover a window.{' '}
                    <span style={{ color: '#C9A84C' }}>It changes the whole room.</span>&rdquo;
                  </p>

                  <p style={{
                    fontFamily:    'var(--font-inter, sans-serif)',
                    fontSize:      '11px',
                    color:         'rgba(201,168,76,0.55)',
                    letterSpacing: '3px',
                    textTransform: 'uppercase',
                    marginTop:     '24px',
                  }}>
                    Designer Rose · Co-Founder
                  </p>

                  {/* Vertical line bottom */}
                  <div style={{
                    width:      '1px',
                    height:     '56px',
                    background: 'linear-gradient(to bottom, rgba(201,168,76,0.55), transparent)',
                    margin:     '44px auto 0',
                  }} />
                </motion.div>
              )}

              {/* Horizontal rule between chapters */}
              {i < CHAPTERS.length - 1 && i !== 1 && (
                <div style={{ padding: '8px 0' }}>
                  <Divider />
                </div>
              )}

            </div>
          )
        })}

      </div>

      <style>{`
        .chapter-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 80px;
          align-items: center;
          padding: 72px 0;
        }
        .chapter-number { font-size: clamp(120px, 16vw, 200px); }

        @media (max-width: 768px) {
          .chapter-grid {
            grid-template-columns: 1fr !important;
            gap: 0 !important;
            padding: 48px 0;
          }
          .chapter-number-col { display: none; }
        }
      `}</style>
    </section>
  )
}
