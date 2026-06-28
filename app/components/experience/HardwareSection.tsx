'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Check } from 'lucide-react'

const ease = [0.25, 0.1, 0.25, 1] as const

const SPECS = [
  'Crystal clear display — see every fabric thread in perfect detail',
  'Full hand tracking — point and pick naturally, no controllers needed',
  'Mixed reality passthrough — anchor virtual curtains to your real windows',
  'No install required — loads instantly, no app store needed',
]

export default function HardwareSection() {
  return (
    <section style={{
      background: '#111113',
      padding:    '120px 6vw',
      borderTop:  '1px solid rgba(201,168,76,0.12)',
    }}>
      <div
        className="grid md:grid-cols-2"
        style={{ maxWidth: '1240px', margin: '0 auto', gap: '48px', alignItems: 'center' }}
      >

        {/* Left — hardware image placeholder */}
        <motion.div
          initial={{ opacity: 0, x: -60 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.9, ease }}
        >
          <div style={{
            width:        '100%',
            aspectRatio:  '4/3',
            borderRadius: '12px',
            overflow:     'hidden',
            border:       '1px solid rgba(201,168,76,0.2)',
            boxShadow:    '0 8px 40px rgba(0,0,0,0.5)',
            position:     'relative',
            background:   'linear-gradient(135deg, #111113 0%, #1a1a1d 100%)',
          }}>
            <Image
              src="/assets/metaquest3.png"
              alt="Meta Quest 3 VR headset experience"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              style={{ objectFit: 'cover', objectPosition: 'center top' }}
            />
            {/* Subtle gold overlay */}
            <div style={{
              position:      'absolute',
              inset:         0,
              background:    'linear-gradient(135deg, rgba(201,168,76,0.05) 0%, transparent 50%)',
              pointerEvents: 'none',
              zIndex:        1,
            }} />
          </div>
        </motion.div>

        {/* Right — content */}
        <motion.div
          initial={{ opacity: 0, x: 60 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.9, ease, delay: 0.2 }}
        >
          <p style={{
            fontFamily:    'var(--font-inter, sans-serif)',
            fontSize:      '11px',
            color:         '#C9A84C',
            letterSpacing: '4px',
            textTransform: 'uppercase',
            marginBottom:  '20px',
          }}>
            The Hardware
          </p>

          <h2 style={{
            fontFamily:   'var(--font-playfair, Georgia, serif)',
            fontSize:     'clamp(36px, 3.5vw, 48px)',
            color:        '#FFFFFF',
            fontWeight:   400,
            lineHeight:   1.1,
            marginBottom: '8px',
          }}>
            Powered by Meta Quest 3
          </h2>

          <p style={{
            fontFamily:   'var(--font-playfair, Georgia, serif)',
            fontSize:     '20px',
            color:        '#C9A84C',
            fontStyle:    'italic',
            marginBottom: '32px',
          }}>
            The headset that makes it real.
          </p>

          <div style={{
            width:      '40px',
            height:     '1px',
            background: 'linear-gradient(to right, #E8C96D, #A67C2E)',
            marginBottom:'32px',
          }} />

          <p style={{
            fontFamily:   'var(--font-inter, sans-serif)',
            fontSize:     '16px',
            color:        '#A8B2BE',
            lineHeight:   1.8,
            marginBottom: '40px',
          }}>
            The Meta Quest 3 delivers the most advanced standalone VR experience
            available — pancake lenses for crystal-clear color accuracy, full hand
            tracking for natural interaction, and mixed reality passthrough that
            anchors virtual curtains to your real windows. No wires. No complexity.
            Just put it on and step inside.
          </p>

          {/* Spec bullets */}
          <div style={{ marginBottom: '32px' }}>
            {SPECS.map(spec => (
              <div key={spec} style={{
                display:      'flex',
                alignItems:   'flex-start',
                gap:          '12px',
                marginBottom: '16px',
              }}>
                <Check size={15} style={{ color: '#C9A84C', flexShrink: 0, marginTop: '3px' }} />
                <span style={{
                  fontFamily: 'var(--font-inter, sans-serif)',
                  fontSize:   '15px',
                  color:      '#FFFFFF',
                  lineHeight: 1.6,
                }}>
                  {spec}
                </span>
              </div>
            ))}
          </div>

          <Link
            href="/catalog"
            style={{
              fontFamily:     'var(--font-inter, sans-serif)',
              fontSize:       '14px',
              color:          '#C9A84C',
              textDecoration: 'none',
              display:        'inline-flex',
              alignItems:     'center',
              gap:            '6px',
              borderBottom:   '1px solid transparent',
              paddingBottom:  '2px',
              transition:     'border-color 0.25s ease',
            }}
            onMouseEnter={e => (e.currentTarget.style.borderColor = '#C9A84C')}
            onMouseLeave={e => (e.currentTarget.style.borderColor = 'transparent')}
          >
            View the full collection →
          </Link>
        </motion.div>

      </div>
    </section>
  )
}
