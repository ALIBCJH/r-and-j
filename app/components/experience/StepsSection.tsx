'use client'

import { motion } from 'framer-motion'

const ease = [0.25, 0.1, 0.25, 1] as const

const STEPS = [
  {
    number:      '01',
    label:       'Step One',
    heading:     'Choose Your Room',
    description: 'Select the room you want to transform. We have built photorealistic environments designed specifically for Kenyan home proportions — your space, faithfully recreated before we touch a thing.',
    bullets:     ['Sitting room, bedroom, dining room', 'Designed for Kenyan home proportions', 'Photorealistic lighting and detail'],
  },
  {
    number:      '02',
    label:       'Step Two',
    heading:     'Set Your Windows',
    description: 'Tell us your window dimensions. The system scales your curtains precisely to fit — floor-to-ceiling bungalow glass or a compact apartment window. No guessing. No approximations.',
    bullets:     ['Standard and custom window sizes', 'Curtains scale to your exact dimensions', 'Floor-to-ceiling or sill-length options'],
  },
  {
    number:      '03',
    label:       'Step Three',
    heading:     'Pick Your Fabric & Colour',
    description: 'Browse our curated fabric catalog — point at any swatch to apply it instantly. Dial any colour from the wheel and watch your curtains update in real time under photorealistic light.',
    bullets:     ['East African and international fabrics', 'Real-time colour dial — any shade', 'Wall colour matching in the same session'],
  },
  {
    number:      '04',
    label:       'Step Four',
    heading:     'Walk Through & Confirm',
    description: 'Step back. Walk to the sofa. Look at the full room — curtains, walls, light, space. When it feels exactly right, confirm your order. What you see is exactly what we make.',
    bullets:     ['Full room-scale VR walkthrough', 'Change anything until it is perfect', 'Confirm with complete confidence'],
  },
]

export default function StepsSection() {
  return (
    <section id="how-it-works" style={{ background: '#111113' }}>

      {/* Section header */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.8, ease }}
        style={{
          padding:      'clamp(80px, 10vw, 120px) clamp(32px, 10vw, 140px) clamp(60px, 7vw, 80px)',
          borderBottom: '1px solid rgba(201,168,76,0.14)',
        }}
      >
        <p style={{
          fontFamily:    'var(--font-inter, sans-serif)',
          fontSize:      '11px',
          color:         '#C9A84C',
          letterSpacing: '4px',
          textTransform: 'uppercase',
          marginBottom:  '20px',
        }}>
          How It Works
        </p>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: '24px' }}>
          <h2 style={{
            fontFamily: 'var(--font-playfair, Georgia, serif)',
            fontSize:   'clamp(40px, 5vw, 64px)',
            color:      '#FFFFFF',
            fontWeight: 400,
            lineHeight: 1.05,
            margin:     0,
          }}>
            The R&amp;J Journey
          </h2>
          <p style={{
            fontFamily: 'var(--font-inter, sans-serif)',
            fontSize:   '16px',
            color:      '#605850',
            lineHeight: 1.7,
            maxWidth:   '360px',
            margin:     0,
          }}>
            Four steps from imagination to reality.
            Every detail considered. Every decision yours.
          </p>
        </div>
      </motion.div>

      {/* Steps */}
      {STEPS.map((step, i) => (
        <StepRow key={step.number} step={step} index={i} />
      ))}

    </section>
  )
}

function StepRow({ step, index }: { step: typeof STEPS[number]; index: number }) {
  const isEven = index % 2 === 1

  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.85, ease, delay: 0.05 * index }}
      style={{
        display:       'grid',
        gridTemplateColumns: '1fr 2fr',
        borderBottom:  '1px solid rgba(201,168,76,0.10)',
        background:    isEven ? 'rgba(255,255,255,0.012)' : 'transparent',
      }}
    >
      {/* Left column — number + label */}
      <div style={{
        padding:       'clamp(48px, 6vw, 80px) clamp(32px, 6vw, 80px)',
        borderRight:   '1px solid rgba(201,168,76,0.10)',
        display:       'flex',
        flexDirection: 'column',
        justifyContent:'space-between',
        position:      'relative',
        overflow:      'hidden',
      }}>
        {/* Ghost number — decorative watermark */}
        <span style={{
          position:      'absolute',
          bottom:        '-24px',
          left:          'clamp(16px, 4vw, 48px)',
          fontFamily:    'var(--font-playfair, Georgia, serif)',
          fontSize:      'clamp(120px, 16vw, 200px)',
          color:         'rgba(201,168,76,0.055)',
          lineHeight:    1,
          userSelect:    'none',
          pointerEvents: 'none',
          fontWeight:    400,
        }}>
          {step.number}
        </span>

        <div>
          {/* Small gold dot */}
          <div style={{
            width:        '6px',
            height:       '6px',
            borderRadius: '50%',
            background:   '#C9A84C',
            marginBottom: '20px',
          }} />

          <p style={{
            fontFamily:    'var(--font-inter, sans-serif)',
            fontSize:      '11px',
            color:         '#C9A84C',
            letterSpacing: '3px',
            textTransform: 'uppercase',
            marginBottom:  '0',
          }}>
            {step.label}
          </p>
        </div>

        {/* Step number — readable small */}
        <p style={{
          fontFamily:    'var(--font-playfair, Georgia, serif)',
          fontSize:      '13px',
          color:         'rgba(201,168,76,0.35)',
          letterSpacing: '2px',
          marginBottom:  '0',
          marginTop:     'auto',
        }}>
          {step.number} / 04
        </p>
      </div>

      {/* Right column — content */}
      <div style={{
        padding: 'clamp(48px, 6vw, 80px) clamp(32px, 6vw, 80px)',
      }}>
        <h3 style={{
          fontFamily:   'var(--font-playfair, Georgia, serif)',
          fontSize:     'clamp(28px, 3.5vw, 48px)',
          color:        '#F0EBE0',
          fontWeight:   400,
          lineHeight:   1.1,
          marginBottom: '24px',
        }}>
          {step.heading}
        </h3>

        {/* Gold rule */}
        <div style={{
          width:        '40px',
          height:       '1px',
          background:   'linear-gradient(to right, #C9A84C, #E8C87A)',
          marginBottom: '24px',
        }} />

        <p style={{
          fontFamily:   'var(--font-inter, sans-serif)',
          fontSize:     'clamp(15px, 1.5vw, 17px)',
          color:        '#8A9BAE',
          lineHeight:   1.85,
          maxWidth:     '540px',
          marginBottom: '36px',
        }}>
          {step.description}
        </p>

        {/* Bullets — horizontal on desktop */}
        <div style={{
          display:   'flex',
          flexWrap:  'wrap',
          gap:       '12px 32px',
        }}>
          {step.bullets.map((bullet) => (
            <div key={bullet} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                width:        '4px',
                height:       '4px',
                borderRadius: '50%',
                background:   'rgba(201,168,76,0.6)',
                flexShrink:   0,
              }} />
              <span style={{
                fontFamily:    'var(--font-inter, sans-serif)',
                fontSize:      '13px',
                color:         '#504840',
                letterSpacing: '0.3px',
              }}>
                {bullet}
              </span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}
