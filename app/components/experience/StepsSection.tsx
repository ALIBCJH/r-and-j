'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'

const ease = [0.25, 0.1, 0.25, 1] as const

const STEPS = [
  {
    number:      '01',
    label:       'Step One',
    heading:     'Choose Your Room',
    description: 'Select the room you want to transform. We have built photorealistic environments designed specifically for Kenyan home proportions — your space, faithfully recreated before we touch a thing.',
    bullets:     ['Sitting room, bedroom, dining room', 'Designed for Kenyan home proportions', 'Photorealistic lighting and detail'],
    image:       '/assets/sittingroom.png',
    imageAlt:    'Warm African-style sitting room interior',
    imagePos:    'center center',
    bg:          '#0A0F1C',
    imageLeft:   true,
  },
  {
    number:      '02',
    label:       'Step Two',
    heading:     'Set Your Windows',
    description: 'Tell us your window dimensions. The system scales your curtains precisely to fit — floor-to-ceiling bungalow glass or a compact apartment window. No guessing. No approximations.',
    bullets:     ['Standard and custom window sizes', 'Curtains scale to your exact dimensions', 'Floor-to-ceiling or sill-length options'],
    image:       '/assets/windowpage.png',
    imageAlt:    'Elegant window with golden sheer curtains',
    imagePos:    'center center',
    bg:          '#0D1B2E',
    imageLeft:   false,
  },
  {
    number:      '03',
    label:       'Step Three',
    heading:     'Pick Your Fabric & Colour',
    description: 'Browse our curated fabric catalog — point at any swatch to apply it instantly. Dial any colour from the wheel and watch your curtains update in real time under photorealistic light.',
    bullets:     ['East African and international fabrics', 'Real-time colour dial — any shade', 'Wall colour matching in the same session'],
    image:       '/assets/fabrics.png',
    imageAlt:    'Curtain fabric swatches in many colours',
    imagePos:    'center center',
    bg:          '#080D18',
    imageLeft:   true,
  },
  {
    number:      '04',
    label:       'Step Four',
    heading:     'Walk Through & Confirm',
    description: 'Step back. Walk to the sofa. Look at the full room — curtains, walls, light, space. When it feels exactly right, confirm your order. What you see is exactly what we make.',
    bullets:     ['Full room-scale VR walkthrough', 'Change anything until it is perfect', 'Confirm with complete confidence'],
    image:       '/assets/metaquest3.png',
    imageAlt:    'Man wearing Meta Quest 3 VR headset',
    imagePos:    'center top',
    bg:          '#0D1B2E',
    imageLeft:   false,
  },
]

export default function StepsSection() {
  return (
    <section id="how-it-works" style={{ background: '#0D1B2E' }}>

      {/* Section header */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.8, ease }}
        style={{ textAlign: 'center', padding: '100px 6vw 80px' }}
      >
        <p style={{
          fontFamily:    'var(--font-inter, sans-serif)',
          fontSize:      '11px',
          color:         '#C9A84C',
          letterSpacing: '4px',
          textTransform: 'uppercase',
          marginBottom:  '16px',
        }}>
          How It Works
        </p>
        <h2 style={{
          fontFamily:   'var(--font-playfair, Georgia, serif)',
          fontSize:     'clamp(36px, 4vw, 52px)',
          color:        '#FFFFFF',
          fontWeight:   400,
          marginBottom: '16px',
        }}>
          The R&amp;J Journey
        </h2>
        <div style={{
          width:      '48px',
          height:     '2px',
          background: 'linear-gradient(to right, #E8C96D, #A67C2E)',
          margin:     '0 auto 24px',
        }} />
        <p style={{
          fontFamily: 'var(--font-inter, sans-serif)',
          fontSize:   '17px',
          color:      '#A8B2BE',
          maxWidth:   '480px',
          margin:     '0 auto',
          lineHeight: 1.7,
        }}>
          Four steps from imagination to reality.
          Every detail considered. Every decision yours.
        </p>
      </motion.div>

      {/* Step panels */}
      {STEPS.map((step) => (
        <StepPanel key={step.number} step={step} />
      ))}
    </section>
  )
}

function StepPanel({ step }: { step: typeof STEPS[number] }) {
  const textCol = (
    <motion.div
      initial={{ opacity: 0, x: step.imageLeft ? 40 : -40 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: '-120px' }}
      transition={{ duration: 0.9, ease }}
      style={{
        display:        'flex',
        flexDirection:  'column',
        justifyContent: 'center',
        padding:        'clamp(48px, 6vw, 96px) clamp(32px, 6vw, 72px)',
        background:     step.bg,
        borderTop:      '1px solid rgba(201,168,76,0.08)',
      }}
    >
      {/* Step number — decorative, not dominant */}
      <p style={{
        fontFamily:    'var(--font-playfair, Georgia, serif)',
        fontSize:      '80px',
        color:         'rgba(201,168,76,0.12)',
        lineHeight:    1,
        marginBottom:  '8px',
        userSelect:    'none',
      }}>
        {step.number}
      </p>

      <p style={{
        fontFamily:    'var(--font-inter, sans-serif)',
        fontSize:      '11px',
        color:         '#C9A84C',
        letterSpacing: '4px',
        textTransform: 'uppercase',
        marginBottom:  '16px',
      }}>
        {step.label}
      </p>

      <h3 style={{
        fontFamily:   'var(--font-playfair, Georgia, serif)',
        fontSize:     'clamp(30px, 3vw, 44px)',
        color:        '#FFFFFF',
        fontWeight:   400,
        lineHeight:   1.1,
        marginBottom: '20px',
      }}>
        {step.heading}
      </h3>

      <div style={{
        width:        '36px',
        height:       '1px',
        background:   'linear-gradient(to right, #E8C96D, #A67C2E)',
        marginBottom: '20px',
      }} />

      <p style={{
        fontFamily:   'var(--font-inter, sans-serif)',
        fontSize:     '16px',
        color:        '#A8B2BE',
        lineHeight:   1.85,
        marginBottom: '28px',
        maxWidth:     '420px',
      }}>
        {step.description}
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {step.bullets.map((bullet, i) => (
          <motion.div
            key={bullet}
            initial={{ opacity: 0, x: -16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.45, ease, delay: 0.35 + i * 0.1 }}
            style={{ display: 'flex', alignItems: 'center', gap: '12px' }}
          >
            <div style={{
              width:      '5px',
              height:     '5px',
              borderRadius:'50%',
              background: '#C9A84C',
              flexShrink: 0,
            }} />
            <span style={{
              fontFamily: 'var(--font-inter, sans-serif)',
              fontSize:   '14px',
              color:      '#6B7A8D',
            }}>
              {bullet}
            </span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )

  const imageCol = (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: '-120px' }}
      transition={{ duration: 1, ease }}
      style={{
        position:   'relative',
        minHeight:  'clamp(320px, 50vw, 600px)',
        overflow:   'hidden',
        borderTop:  '1px solid rgba(201,168,76,0.08)',
      }}
    >
      <Image
        src={step.image}
        alt={step.imageAlt}
        fill
        sizes="(max-width: 768px) 100vw, 50vw"
        style={{ objectFit: 'cover', objectPosition: step.imagePos }}
      />
    </motion.div>
  )

  return (
    <div className="grid md:grid-cols-2" style={{ borderTop: '1px solid rgba(201,168,76,0.08)' }}>
      {step.imageLeft ? <>{imageCol}{textCol}</> : <>{textCol}{imageCol}</>}
    </div>
  )
}
