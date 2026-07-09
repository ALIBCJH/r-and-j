'use client'

import { motion } from 'framer-motion'
import { useIsMobile } from '@/app/components/style-picker/hooks/useIsMobile'

const ease = [0.25, 0.1, 0.25, 1] as const

const CHAPTERS = [
  {
    number:  '01',
    eyebrow: 'The Problem',
    heading: 'You Bought the Wrong Fabric.',
    body:    "It happens in almost every home. The swatch looked perfect in the shop — rich, warm, exactly right. Then it hung against your own walls, under your own light, and it was off. Too heavy. Too cold. Not you. And curtains don't come with a refund. That quiet, expensive disappointment is where R&J began.",
  },
  {
    number:  '02',
    eyebrow: 'The Breakthrough',
    heading: 'So We Built a Better Way.',
    body:    'What if you could see the fabric and colour before a single thread was cut? Our online studio lets you preview curtain colours and fabrics on a styled room, matched to your wall colour — so you choose with a clear eye instead of a guess. Then we measure, make, and install exactly what you approved. A fully immersive walk-through of your own home is the vision we are building toward — see the Experience page.',
  },
  {
    number:  '03',
    eyebrow: 'Our Roots',
    heading: 'Nyeri-Born. Kenya-Wide.',
    body:    'We are proudly from Nyeri — where craft is patient and a handshake still holds. That is the standard we carry into every home we dress, from Nairobi penthouses to coastal villas. Local hands, national reach, no shortcuts.',
  },
  {
    number:  '04',
    eyebrow: 'The Promise',
    heading: "We Don't Stop Until It's Right.",
    body:    'Measured, made, and installed by the two people whose name is on the door — Juma and Rose. If it is not right, it is not finished. That is not a marketing line; it is the entire company.',
  },
]

function Divider() {
  return (
    <div style={{
      width:      '100%',
      height:     '1px',
      background: 'linear-gradient(to right, rgba(201,168,76,0.25), rgba(201,168,76,0.08) 60%, transparent)',
    }} />
  )
}

export default function StorySection() {
  const m = useIsMobile() === true

  return (
    <section style={{
      background: '#0D1B2E',
      padding:    m ? '88px 24px' : '140px 6vw',
      borderTop:  '1px solid rgba(201,168,76,0.12)',
    }}>
      <div style={{ maxWidth: '1240px', margin: '0 auto' }}>

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
            marginBottom:  m ? '56px' : '100px',
          }}
        >
          The Story
        </motion.p>

        <div>
          {CHAPTERS.map((chapter, i) => (
            <div key={chapter.number}>

              <Divider />

              <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.85, ease, delay: 0.08 }}
                style={{
                  display:             'grid',
                  gridTemplateColumns: m ? '1fr' : '120px 1fr',
                  gap:                 m ? '18px' : '56px',
                  alignItems:          'start',
                  padding:             m ? '44px 0' : '72px 0',
                }}
              >
                {/* Chapter numeral — large ghosted serif on desktop, inline gold marker on mobile */}
                <span style={{
                  fontFamily:    'var(--font-playfair, Georgia, serif)',
                  fontSize:      m ? '14px' : 'clamp(40px, 4vw, 64px)',
                  color:         '#C9A84C',
                  opacity:       m ? 0.85 : 0.26,
                  letterSpacing: m ? '3px' : '0',
                  lineHeight:    1,
                }}>
                  {m ? `${chapter.number} —` : chapter.number}
                </span>

                {/* Heading + body */}
                <div>
                  <p style={{
                    fontFamily:    'var(--font-inter, sans-serif)',
                    fontSize:      '10px',
                    color:         'rgba(201,168,76,0.5)',
                    letterSpacing: '4px',
                    textTransform: 'uppercase',
                    marginBottom:  '16px',
                  }}>
                    {chapter.eyebrow}
                  </p>
                  <h2 style={{
                    fontFamily: 'var(--font-playfair, Georgia, serif)',
                    fontSize:   'clamp(30px, 5vw, 68px)',
                    color:      '#FFFFFF',
                    fontWeight: 400,
                    lineHeight: 1.06,
                    margin:     0,
                  }}>
                    {chapter.heading}
                  </h2>
                  <p style={{
                    fontFamily: 'var(--font-inter, sans-serif)',
                    fontSize:   m ? '15px' : '17px',
                    color:      'rgba(202,212,224,0.68)',
                    lineHeight: 1.8,
                    maxWidth:   '640px',
                    marginTop:  m ? '18px' : '28px',
                    marginBottom: 0,
                  }}>
                    {chapter.body}
                  </p>
                </div>
              </motion.div>

              {/* Pull quote after chapter 2 */}
              {i === 1 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-60px' }}
                  transition={{ duration: 0.9, ease }}
                  style={{ padding: m ? '32px 0' : '80px 0 80px 128px' }}
                >
                  <p style={{
                    fontFamily: 'var(--font-playfair, Georgia, serif)',
                    fontSize:   'clamp(23px, 3.2vw, 44px)',
                    color:      '#FFFFFF',
                    fontStyle:  'italic',
                    fontWeight: 400,
                    lineHeight: 1.45,
                    maxWidth:   '700px',
                    margin:     0,
                  }}>
                    &ldquo;The right fabric doesn&apos;t just cover a window.{' '}
                    <span style={{ color: '#C9A84C' }}>It changes the whole room.</span>&rdquo;
                  </p>
                  <p style={{
                    fontFamily:    'var(--font-inter, sans-serif)',
                    fontSize:      '11px',
                    color:         'rgba(201,168,76,0.5)',
                    letterSpacing: '3px',
                    textTransform: 'uppercase',
                    marginTop:     '28px',
                  }}>
                    Designer Rose · Co-Founder
                  </p>
                </motion.div>
              )}

            </div>
          ))}

          <Divider />
        </div>

      </div>
    </section>
  )
}
