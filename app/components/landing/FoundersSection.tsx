'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'

const ease = [0.25, 0.1, 0.25, 1] as const

function GoldLine({ width = 48 }: { width?: number }) {
  return (
    <div style={{
      width:      `${width}px`,
      height:     '1px',
      background: 'linear-gradient(90deg, transparent, #C9A84C 30%, #E8C96D 50%, #C9A84C 70%, transparent)',
      margin:     '0 auto',
    }} />
  )
}

interface Founder {
  badge:     string
  name:      string
  role:      string
  story:     string
  signature: string
  img:       string
  alt:       string
  objectPos: string
}

const FOUNDERS: Founder[] = [
  {
    badge:     'The Architect',
    name:      'Simon Juma',
    role:      'Co-Founder & Tech Lead',
    story:
      "Simon is a software engineer who builds solutions for real-world bottlenecks. Frustrated by how difficult " +
      "it is for consumers to buy home furnishings online with confidence, he built R&J's proprietary window " +
      "visualizer from scratch. He manages the platform's development, checkout pipelines, and overall technical " +
      "strategy — turning complex code into a seamless, fast user experience.",
    signature: 'If the current way of doing things is broken, my job is to write the code that fixes it.',
    img:       '/assets/jumafounder.jpeg',
    alt:       'Simon Juma, Co-Founder & Tech Lead of R&J Interiors',
    objectPos: 'center top',
  },
  {
    badge:     'The Designer',
    name:      'Rose Kabathi',
    role:      'Co-Founder & Design Principal',
    story:
      "Rose brings years of expertise in fashion, textile design, and spatial aesthetics to R&J. She understands " +
      "exactly how fabrics behave, catch light, and transform a room. Rose handles product curation and user " +
      "experience, ensuring that what customers see on their screens closely matches the high-quality physical " +
      "product delivered to their door.",
    signature: 'The right fabric does not cover a window. It changes the room.',
    img:       '/assets/rosedesigner.jpeg',
    alt:       'Rose Kabathi, Co-Founder & Design Principal of R&J Interiors',
    objectPos: 'center',
  },
]

function FounderRow({ f, reverse, delay }: { f: Founder; reverse: boolean; delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 44 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.85, ease, delay }}
      className={`flex flex-col gap-8 md:gap-16 md:items-center ${reverse ? 'md:flex-row-reverse' : 'md:flex-row'}`}
    >
      {/* Portrait */}
      <div className="w-full md:w-1/2">
        <div style={{
          position:     'relative',
          width:        '100%',
          aspectRatio:  '4/5',
          borderRadius: '10px',
          overflow:     'hidden',
          border:       '1px solid rgba(201,168,76,0.22)',
          boxShadow:    '0 24px 60px rgba(0,0,0,0.45)',
        }}>
          <Image
            src={f.img}
            alt={f.alt}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            style={{ objectFit: 'cover', objectPosition: f.objectPos }}
          />
          {/* Soft base gradient anchors the portrait into the deep-navy section */}
          <div style={{
            position: 'absolute', inset: 0, pointerEvents: 'none',
            background: 'linear-gradient(to top, rgba(13,27,46,0.55) 0%, transparent 42%)',
          }} />
        </div>
      </div>

      {/* Story */}
      <div className="w-full md:w-1/2">
        <span style={{
          display:       'inline-block',
          background:    'rgba(201,168,76,0.08)',
          border:        '1px solid rgba(201,168,76,0.3)',
          padding:       '5px 16px',
          borderRadius:  '20px',
          fontFamily:    'var(--font-inter, sans-serif)',
          fontSize:      '10px',
          color:         '#C9A84C',
          letterSpacing: '3px',
          textTransform: 'uppercase',
          marginBottom:  '18px',
        }}>
          {f.badge}
        </span>

        <h3 style={{
          fontFamily:   'var(--font-playfair, Georgia, serif)',
          fontSize:     'clamp(30px, 3.4vw, 44px)',
          color:        '#FFFFFF',
          fontWeight:   400,
          lineHeight:   1.1,
          marginBottom: '8px',
        }}>
          {f.name}
        </h3>

        <p style={{
          fontFamily:    'var(--font-inter, sans-serif)',
          fontSize:      '13px',
          color:         '#A8B2BE',
          letterSpacing: '1px',
          marginBottom:  '24px',
        }}>
          {f.role}
        </p>

        <p style={{
          fontFamily: 'var(--font-inter, sans-serif)',
          fontSize:   'clamp(15px, 1.5vw, 17px)',
          color:      '#C6CFD8',
          lineHeight: 1.75,
          maxWidth:   '46ch',
          margin:     '0 0 26px',
        }}>
          {f.story}
        </p>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{
            width:      '34px',
            height:     '1px',
            background: 'linear-gradient(90deg, #C9A84C, transparent)',
            flexShrink: 0,
          }} />
          <p style={{
            fontFamily: 'var(--font-playfair, Georgia, serif)',
            fontSize:   '17px',
            color:      '#C9A84C',
            fontStyle:  'italic',
            lineHeight: 1.45,
            margin:     0,
          }}>
            {f.signature}
          </p>
        </div>
      </div>
    </motion.div>
  )
}

export default function FoundersSection({ firstSection }: { firstSection?: boolean }) {
  return (
    <section style={{
      background:    '#0D1B2E',
      paddingTop:    firstSection ? 'calc(var(--rj-navbar-height) + 24px)' : '120px',
      paddingBottom: '120px',
      paddingLeft:   '6vw',
      paddingRight:  '6vw',
      borderTop:     firstSection ? 'none' : '1px solid rgba(201,168,76,0.12)',
    }}>
      <div style={{ maxWidth: '1180px', margin: '0 auto' }}>

        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8, ease }}
          style={{ textAlign: 'center', marginBottom: '84px' }}
        >
          <p style={{
            fontFamily:    'var(--font-inter, sans-serif)',
            fontSize:      '11px',
            color:         '#C9A84C',
            letterSpacing: '4px',
            textTransform: 'uppercase',
            marginBottom:  '18px',
          }}>
            The People Behind R&J
          </p>
          <h2 style={{
            fontFamily:   'var(--font-playfair, Georgia, serif)',
            fontSize:     'clamp(32px, 5vw, 56px)',
            color:        '#FFFFFF',
            fontWeight:   400,
            lineHeight:   1.15,
            marginBottom: '20px',
          }}>
            Two People.{' '}
            <em style={{ color: '#C9A84C' }}>One Obsession With Your Home.</em>
          </h2>
          <GoldLine width={48} />
        </motion.div>

        {/* Editorial alternating rows */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(72px, 9vw, 120px)' }}>
          {FOUNDERS.map((f, i) => (
            <FounderRow key={f.name} f={f} reverse={i % 2 === 1} delay={0.15} />
          ))}
        </div>

      </div>
    </section>
  )
}
