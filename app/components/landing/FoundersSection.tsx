'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'

const ease = [0.25, 0.1, 0.25, 1] as const

const SIMON_TAGS = ['Creative Technology', 'VR Experience Design', '3D Visualization', 'Attention to Detail']
const ROSE_TAGS  = ['Fashion & Fabric Design', 'Client Experience', 'Color & Texture Curation', 'Design Alchemy']

function GoldLine({ width = 48 }: { width?: number }) {
  return (
    <div style={{
      width:        `${width}px`,
      height:       '1px',
      background:   'linear-gradient(90deg, transparent, #C9A84C 30%, #E8C96D 50%, #C9A84C 70%, transparent)',
      margin:       '0 auto',
    }} />
  )
}

function SkillTag({ label, delay }: { label: string; delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.4, ease, delay }}
      style={{
        border:        '1px solid rgba(201,168,76,0.25)',
        padding:       '6px 16px',
        borderRadius:  '20px',
        fontFamily:    'var(--font-inter, sans-serif)',
        fontSize:      '12px',
        color:         '#A8B2BE',
        cursor:        'default',
        transition:    'border-color 0.2s ease, color 0.2s ease',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = 'rgba(201,168,76,0.6)'
        e.currentTarget.style.color       = '#C9A84C'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = 'rgba(201,168,76,0.25)'
        e.currentTarget.style.color       = '#A8B2BE'
      }}
    >
      {label}
    </motion.div>
  )
}

export default function FoundersSection({ firstSection }: { firstSection?: boolean }) {
  return (
    <section style={{
      background:     '#0D1B2E',
      paddingTop:     firstSection ? 'calc(var(--rj-navbar-height) + 24px)' : '120px',
      paddingBottom:  '120px',
      paddingLeft:    '6vw',
      paddingRight:   '6vw',
      borderTop:      firstSection ? 'none' : '1px solid rgba(201,168,76,0.12)',
    }}>
      <div style={{ maxWidth: '1240px', margin: '0 auto' }}>

        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8, ease }}
          style={{ textAlign: 'center', marginBottom: '40px' }}
        >
          <p style={{
            fontFamily:    'var(--font-inter, sans-serif)',
            fontSize:      '11px',
            color:         '#C9A84C',
            letterSpacing: '4px',
            textTransform: 'uppercase',
            marginBottom:  '12px',
          }}>
            The People Behind R&amp;J
          </p>

          <h2 style={{
            fontFamily:   'var(--font-playfair, Georgia, serif)',
            fontSize:     'clamp(32px, 5vw, 52px)',
            color:        '#FFFFFF',
            fontWeight:   400,
            lineHeight:   1.1,
            marginBottom: '16px',
          }}>
            The Architect &amp; The Curator
          </h2>

          <GoldLine width={48} />
        </motion.div>

        {/* Two-column card grid */}
        <div
          className="grid md:grid-cols-2"
          style={{ gap: '48px', alignItems: 'stretch' }}
        >

          {/* ── Card 1: Simon / The Architect ── */}
          <motion.div
            initial={{ opacity: 0, x: -60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.9, ease, delay: 0.3 }}
            style={{
              background:   'transparent',
              border:       '1px solid rgba(201,168,76,0.2)',
              borderRadius: '8px',
              padding:      'clamp(24px, 4vw, 48px)',
              position:     'relative',
              overflow:     'hidden',
              transition:   'all 0.35s ease',
              cursor:       'default',
            }}
            whileHover={{
              y:          -4,
              boxShadow:  '0 12px 40px rgba(0,0,0,0.4)',
              borderColor:'rgba(201,168,76,0.5)',
            }}
          >
            {/* Image */}
            <div style={{
              width:        '100%',
              aspectRatio:  '3/4',
              borderRadius: '10px',
              overflow:     'hidden',
              border:       '1px solid rgba(201,168,76,0.2)',
              marginBottom: '32px',
              position:     'relative',
              background:   'transparent',
            }}>
              <Image
                src="/assets/jumafounder.jpeg"
                alt="Engineer Juma — Founder, R&J Interiors"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                style={{ objectFit: 'cover', objectPosition: 'center top' }}
              />
            </div>

            {/* Badge */}
            <div style={{ textAlign: 'center', marginBottom: '16px' }}>
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
              }}>
                The Architect
              </span>
            </div>

            {/* Name */}
            <h3 style={{
              fontFamily:   'var(--font-playfair, Georgia, serif)',
              fontSize:     '26px',
              color:        '#FFFFFF',
              fontWeight:   400,
              textAlign:    'center',
              marginBottom: '6px',
            }}>
              Engineer Juma
            </h3>

            {/* Role */}
            <p style={{
              fontFamily:    'var(--font-inter, sans-serif)',
              fontSize:      '13px',
              color:         '#A8B2BE',
              textAlign:     'center',
              letterSpacing: '1px',
              marginBottom:  0,
            }}>
              Founder · Creative Technologist
            </p>

            {/* Tagline */}
            <p style={{
              fontFamily:   'var(--font-inter, sans-serif)',
              fontSize:     '14px',
              color:        '#C9A84C',
              fontStyle:    'italic',
              textAlign:    'center',
              marginTop:    '8px',
            }}>
              Where code meets creativity
            </p>

            {/* Divider */}
            <div style={{ margin: '24px 0' }}>
              <GoldLine width={32} />
            </div>

            {/* Bio */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <p style={{
                fontFamily: 'var(--font-inter, sans-serif)',
                fontSize:   '15px',
                color:      '#A8B2BE',
                lineHeight: 1.8,
              }}>
                Juma builds the world you see. From immersive VR environments to
                real-time fabric rendering, he engineered every layer of the R&amp;J
                experience — obsessing over what&apos;s visible and what holds it together.
              </p>
              <p style={{
                fontFamily: 'var(--font-playfair, Georgia, serif)',
                fontSize:   '17px',
                color:      '#FFFFFF',
                fontStyle:  'italic',
                lineHeight: 1.7,
              }}>
                Detail is not a finishing touch. It is where the work begins.
              </p>
            </div>

            {/* Skill tags */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '28px' }}>
              {SIMON_TAGS.map((tag, i) => (
                <SkillTag key={tag} label={tag} delay={0.3 + i * 0.08} />
              ))}
            </div>
          </motion.div>

          {/* ── Card 2: Rose / The Curator ── */}
          <motion.div
            initial={{ opacity: 0, x: 60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.9, ease, delay: 0.5 }}
            style={{
              background:   'transparent',
              border:       '1px solid rgba(201,168,76,0.2)',
              borderRadius: '8px',
              padding:      'clamp(24px, 4vw, 48px)',
              position:     'relative',
              overflow:     'hidden',
              transition:   'all 0.35s ease',
              cursor:       'default',
            }}
            whileHover={{
              y:          -4,
              boxShadow:  '0 12px 40px rgba(0,0,0,0.4)',
              borderColor:'rgba(201,168,76,0.5)',
            }}
          >
            {/* Image */}
            <div style={{
              width:        '100%',
              aspectRatio:  '3/4',
              borderRadius: '10px',
              overflow:     'hidden',
              border:       '1px solid rgba(201,168,76,0.2)',
              marginBottom: '32px',
              position:     'relative',
              background:   'transparent',
            }}>
              <Image
                src="/assets/rosedesigner.jpeg"
                alt="Rose — Designer, R&J Interiors"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                style={{ objectFit: 'cover', objectPosition: 'center' }}
              />
            </div>

            {/* Badge */}
            <div style={{ textAlign: 'center', marginBottom: '16px' }}>
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
              }}>
                The Curator
              </span>
            </div>

            {/* Name */}
            <h3 style={{
              fontFamily:   'var(--font-playfair, Georgia, serif)',
              fontSize:     '26px',
              color:        '#FFFFFF',
              fontWeight:   400,
              textAlign:    'center',
              marginBottom: '6px',
            }}>
              Designer Rose
            </h3>

            {/* Role */}
            <p style={{
              fontFamily:    'var(--font-inter, sans-serif)',
              fontSize:      '13px',
              color:         '#A8B2BE',
              textAlign:     'center',
              letterSpacing: '1px',
              marginBottom:  0,
            }}>
              Fashion &amp; Interior Designer
            </p>

            {/* Tagline */}
            <p style={{
              fontFamily:   'var(--font-inter, sans-serif)',
              fontSize:     '14px',
              color:        '#C9A84C',
              fontStyle:    'italic',
              textAlign:    'center',
              marginTop:    '8px',
            }}>
              Where intuition becomes elegance
            </p>

            {/* Divider */}
            <div style={{ margin: '24px 0' }}>
              <GoldLine width={32} />
            </div>

            {/* Bio */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <p style={{
                fontFamily: 'var(--font-inter, sans-serif)',
                fontSize:   '15px',
                color:      '#A8B2BE',
                lineHeight: 1.8,
              }}>
                Rose walks into a room and sees what it could be. Her fashion
                background gave her a rare fluency in fabric — how it moves, how it
                catches light, how the right textile transforms a space entirely.
                At R&amp;J she is the instinct behind every curation decision.
              </p>
              <p style={{
                fontFamily: 'var(--font-playfair, Georgia, serif)',
                fontSize:   '17px',
                color:      '#FFFFFF',
                fontStyle:  'italic',
                lineHeight: 1.7,
              }}>
                Her taste is not learned. It is felt.
              </p>
            </div>

            {/* Skill tags */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '28px' }}>
              {ROSE_TAGS.map((tag, i) => (
                <SkillTag key={tag} label={tag} delay={0.5 + i * 0.08} />
              ))}
            </div>
          </motion.div>

        </div>

        {/* Closing statement */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8, ease }}
          style={{ marginTop: '64px', textAlign: 'center' }}
        >
          <GoldLine width={32} />
          <p style={{
            fontFamily:  'var(--font-playfair, Georgia, serif)',
            fontSize:    '20px',
            color:       '#A8B2BE',
            fontStyle:   'italic',
            textAlign:   'center',
            maxWidth:    '640px',
            margin:      '32px auto',
            lineHeight:  1.75,
          }}>
            Every R&amp;J Interiors piece is a direct collaboration between us —
            the technology and the taste, working as one.
          </p>
          <GoldLine width={32} />
        </motion.div>

      </div>
    </section>
  )
}
