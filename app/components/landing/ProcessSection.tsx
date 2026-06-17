'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { LayoutDashboard, Layers, Glasses, type LucideIcon } from 'lucide-react'
import Image from 'next/image'

const ease = [0.25, 0.1, 0.25, 1] as const

const CARDS = [
  {
    step:          '01',
    Icon:          LayoutDashboard,
    title:         'Choose Your Environment',
    body:          'Select from our library of high-fidelity architectural shells — from Nairobi penthouses to coastal villas — or import your own blueprints for a fully personalised canvas.',
    imageSrc:      '/assets/card-environment.png',
    imagePosition: 'center center',
    imageFallback: 'Luxury architectural interior',
  },
  {
    step:          '02',
    Icon:          Layers,
    title:         'Tailor Your Textiles',
    body:          'Browse hundreds of curated fabrics, textures, and gold-leaf finishes. Every swatch is rendered under real-time lighting so what you see is exactly what you receive.',
    imageSrc:      '/assets/material.png',
    imagePosition: 'center center',
    imageFallback: 'Luxury fabric & textile detail',
  },
  {
    step:          '03',
    Icon:          Glasses,
    title:         'Visualize & Order',
    body:          'Walk through your completed room in immersive 360° VR before a single thread is cut. When the vision is perfect, confirm your order and our craftspeople handle the rest.',
    imageSrc:      '/assets/card-vr.png',
    imagePosition: 'center 20%',
    imageFallback: 'Person wearing a VR headset in a designed room',
  },
]

/* ─── Image area: shows real photo when available, styled placeholder otherwise ─── */
function CardImage({
  src,
  fallbackLabel,
  imagePosition,
  Icon,
  isHovered,
}: {
  src: string
  fallbackLabel: string
  imagePosition: string
  Icon: LucideIcon
  isHovered: boolean
}) {
  const [imgError, setImgError] = useState(false)

  return (
    <div style={{ position: 'relative', height: '260px', overflow: 'hidden', flexShrink: 0 }}>
      {/* Zooming layer */}
      <div style={{
        position:   'absolute',
        inset:      0,
        transform:  isHovered ? 'scale(1.06)' : 'scale(1)',
        transition: 'transform 0.65s cubic-bezier(0.25, 0.1, 0.25, 1)',
      }}>
        {!imgError ? (
          <Image
            src={src}
            alt={fallbackLabel}
            fill
            style={{ objectFit: 'cover', objectPosition: imagePosition }}
            onError={() => setImgError(true)}
            sizes="(max-width: 1300px) 33vw, 420px"
          />
        ) : (
          /* Placeholder shown until real photos are added */
          <>
            {/* Gradient base */}
            <div style={{
              position:   'absolute',
              inset:      0,
              background: 'linear-gradient(160deg, rgba(201,168,76,0.1) 0%, #091524 60%, #0C1A28 100%)',
            }} />
            {/* Subtle grid */}
            <div style={{
              position:        'absolute',
              inset:           0,
              backgroundImage: `
                repeating-linear-gradient(0deg,   rgba(201,168,76,0.04) 0px, rgba(201,168,76,0.04) 1px, transparent 1px, transparent 48px),
                repeating-linear-gradient(90deg,  rgba(201,168,76,0.04) 0px, rgba(201,168,76,0.04) 1px, transparent 1px, transparent 48px)
              `,
            }} />
            {/* Centred icon + label */}
            <div style={{
              position:       'absolute',
              inset:          0,
              display:        'flex',
              flexDirection:  'column',
              alignItems:     'center',
              justifyContent: 'center',
              gap:            '14px',
            }}>
              <Icon size={56} strokeWidth={1.1} style={{ color: 'rgba(201,168,76,0.35)' }} />
              <span style={{
                fontFamily:    'var(--font-inter, sans-serif)',
                fontSize:      '10px',
                color:         'rgba(201,168,76,0.3)',
                letterSpacing: '3px',
                textTransform: 'uppercase',
                textAlign:     'center',
                padding:       '0 24px',
                lineHeight:    1.5,
              }}>
                {fallbackLabel}
              </span>
            </div>
          </>
        )}
      </div>

      {/* Bottom fade — merges image into card content */}
      <div style={{
        position:   'absolute',
        bottom:     0,
        left:       0,
        right:      0,
        height:     '100px',
        background: 'linear-gradient(to bottom, transparent, #13161F)',
        pointerEvents: 'none',
      }} />

      {/* Side vignette */}
      <div style={{
        position:   'absolute',
        inset:      0,
        background: 'linear-gradient(to right, rgba(19,22,31,0.35), transparent 30%, transparent 70%, rgba(19,22,31,0.35))',
        pointerEvents: 'none',
      }} />
    </div>
  )
}

export default function ProcessSection() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  return (
    <>
      {/* ── Process Section ── */}
      <section style={{
        background: '#0D1B2E',
        padding:    '120px 6vw',
        borderTop:  '1px solid rgba(201,168,76,0.12)',
      }}>
        <div style={{ maxWidth: '1300px', margin: '0 auto' }}>

          {/* Header */}
          <div className="text-center" style={{ marginBottom: '72px' }}>
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.8, ease }}
              style={{
                fontFamily:    'var(--font-inter, sans-serif)',
                fontSize:      'var(--rj-font-label)',
                color:         '#C9A84C',
                letterSpacing: '5px',
                textTransform: 'uppercase',
                marginBottom:  '20px',
              }}
            >
              How It Works
            </motion.p>

            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.8, ease, delay: 0.1 }}
              style={{
                fontFamily: 'var(--font-playfair, Georgia, serif)',
                fontSize:   'var(--rj-font-h2)',
                color:      '#FFFFFF',
                lineHeight: 1.1,
              }}
            >
              The R&amp;J Experience
            </motion.h2>

            <motion.div
              initial={{ opacity: 0, scaleX: 0 }}
              whileInView={{ opacity: 1, scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease, delay: 0.3 }}
              style={{
                width:           '48px',
                height:          '2px',
                background:      'linear-gradient(90deg, #C9A84C, #E8C96D)',
                margin:          '20px auto 0',
                transformOrigin: 'center',
              }}
            />
          </div>

          <style>{`
            @media (max-width: 900px) { .process-grid { grid-template-columns: 1fr 1fr !important; } }
            @media (max-width: 560px) { .process-grid { grid-template-columns: 1fr !important; } }
            @media (max-width: 560px) { .process-card-body { padding: 28px 24px 32px !important; } }
          `}</style>

          {/* Cards */}
          <div
            className="process-grid"
            onMouseLeave={() => setHoveredIndex(null)}
            style={{
              display:             'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap:                 '24px',
            }}
          >
            {CARDS.map(({ step, Icon, title, body, imageSrc, imagePosition, imageFallback }, i) => {
              const isHovered = hoveredIndex === i
              const isDimmed  = hoveredIndex !== null && !isHovered

              return (
                /* Outer — scroll entry animation */
                <motion.div
                  key={step}
                  initial={{ opacity: 0, y: 60 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-80px' }}
                  transition={{ duration: 0.9, ease, delay: i * 0.15 }}
                >
                  {/* Inner — hover via CSS transitions */}
                  <div
                    onMouseEnter={() => setHoveredIndex(i)}
                    style={{
                      position:      'relative',
                      display:       'flex',
                      flexDirection: 'column',
                      overflow:      'hidden',
                      background:    isHovered
                        ? 'linear-gradient(180deg, #13161F 0%, rgba(201,168,76,0.03) 100%)'
                        : '#13161F',
                      border:        `1px solid ${isHovered ? 'rgba(201,168,76,0.55)' : 'rgba(201,168,76,0.12)'}`,
                      boxShadow:     isHovered
                        ? '0 40px 100px rgba(0,0,0,0.55), 0 0 50px rgba(201,168,76,0.08), inset 0 1px 0 rgba(201,168,76,0.12)'
                        : '0 4px 24px rgba(0,0,0,0.3)',
                      transform:     isHovered ? 'translateY(-10px)' : 'translateY(0)',
                      opacity:       isDimmed ? 0.38 : 1,
                      transition: [
                        'background 0.4s ease',
                        'border-color 0.4s ease',
                        'box-shadow 0.45s ease',
                        'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
                        'opacity 0.35s ease',
                      ].join(', '),
                    }}
                  >
                    {/* Top accent line — sweeps outward on hover */}
                    <div style={{
                      position:   'absolute',
                      top:        0,
                      left:       isHovered ? 0 : '42%',
                      right:      isHovered ? 0 : '42%',
                      height:     '2px',
                      zIndex:     10,
                      background: 'linear-gradient(90deg, transparent, #E8C96D 35%, #E8C96D 65%, transparent)',
                      boxShadow:  isHovered ? '0 0 14px rgba(232,201,109,0.6)' : 'none',
                      opacity:    isHovered ? 1 : 0,
                      transition: 'left 0.45s ease, right 0.45s ease, opacity 0.3s ease',
                    }} />

                    {/* Shimmer sweep */}
                    <AnimatePresence>
                      {isHovered && (
                        <motion.div
                          key={`shimmer-${step}`}
                          initial={{ x: '-110%' }}
                          animate={{ x: '210%' }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.7, ease: 'easeOut' }}
                          style={{
                            position:      'absolute',
                            top:           0,
                            bottom:        0,
                            width:         '50%',
                            zIndex:        5,
                            background:    'linear-gradient(105deg, transparent 20%, rgba(201,168,76,0.06) 50%, transparent 80%)',
                            pointerEvents: 'none',
                          }}
                        />
                      )}
                    </AnimatePresence>

                    {/* Image zone */}
                    <CardImage
                      src={imageSrc}
                      fallbackLabel={imageFallback}
                      imagePosition={imagePosition}
                      Icon={Icon}
                      isHovered={isHovered}
                    />

                    {/* Content zone */}
                    <div className="process-card-body" style={{ padding: '40px 44px 48px', position: 'relative', flex: 1 }}>

                      {/* Step badge */}
                      <div style={{
                        display:        'inline-flex',
                        alignItems:     'center',
                        justifyContent: 'center',
                        width:          '38px',
                        height:         '38px',
                        border:         `1px solid ${isHovered ? 'rgba(201,168,76,0.65)' : 'rgba(201,168,76,0.22)'}`,
                        marginBottom:   '28px',
                        background:     isHovered ? 'rgba(201,168,76,0.08)' : 'transparent',
                        transition:     'border-color 0.35s ease, background 0.35s ease',
                      }}>
                        <span style={{
                          fontFamily:    'var(--font-inter, sans-serif)',
                          fontSize:      '11px',
                          letterSpacing: '1px',
                          color:         '#C9A84C',
                        }}>
                          {step}
                        </span>
                      </div>

                      {/* Title */}
                      <h3 style={{
                        fontFamily:   'var(--font-playfair, Georgia, serif)',
                        fontSize:     '26px',
                        color:        isHovered ? '#FFFFFF' : 'rgba(255,255,255,0.88)',
                        lineHeight:   1.3,
                        marginBottom: '16px',
                        transition:   'color 0.3s ease',
                      }}>
                        {title}
                      </h3>

                      {/* Body */}
                      <p style={{
                        fontFamily: 'var(--font-inter, sans-serif)',
                        fontSize:   '16px',
                        color:      isHovered ? '#9BAAB8' : '#6D7E8F',
                        lineHeight: 1.85,
                        transition: 'color 0.3s ease',
                      }}>
                        {body}
                      </p>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
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
            "Every number represents a client who saw their space before they transformed it."
          </p>
          <div style={{ width: '48px', height: '1px', background: '#C9A84C', margin: '36px auto 0', opacity: 0.45 }} />
        </motion.div>
      </section>
    </>
  )
}
