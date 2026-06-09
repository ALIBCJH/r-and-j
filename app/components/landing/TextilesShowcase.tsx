'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'

const ease = [0.25, 0.1, 0.25, 1] as const

const TEXTILES = [
  {
    image:       '/assets/curtain1.png',
    name:        'Charcoal Velvet & Embroidered Sheer',
    category:    'Layered',
    tag:         'Best Seller',
    description: 'Deep charcoal velvet panels backed by a sheer with hand-embroidered gold florals — drama and delicacy in one window.',
    props:       [{ k: 'Weight', v: 'Heavy' }, { k: 'Opacity', v: 'Blackout' }, { k: 'Style', v: 'Layered' }],
  },
  {
    image:       '/assets/curtain2.png',
    name:        'Royal Blue Blackout',
    category:    'Blackout',
    tag:         'Statement',
    description: 'Bold cobalt blue with clean eyelet heading, paired with a leaf-embroidered sheer inner for softness against the light.',
    props:       [{ k: 'Weight', v: 'Medium' }, { k: 'Opacity', v: 'Full Block' }, { k: 'Pattern', v: 'Solid + Sheer' }],
  },
  {
    image:       '/assets/curtain3.png',
    name:        'Natural Linen Sheer',
    category:    'Linen',
    tag:         'Light-Filtering',
    description: 'Warm sand linen drapes with a soft white sheer inner — filters the afternoon sun into a calm, diffused glow.',
    props:       [{ k: 'Weight', v: 'Light-Med' }, { k: 'Opacity', v: 'Semi-sheer' }, { k: 'Feel', v: 'Relaxed' }],
  },
  {
    image:       '/assets/curtain4.png',
    name:        'Champagne Gold Velvet',
    category:    'Velvet',
    tag:         'Premium',
    description: 'Lustrous gold-toned velvet with an ornate floral tieback — a formal statement curtain built for spaces that demand presence.',
    props:       [{ k: 'Weight', v: 'Heavy' }, { k: 'Sheen', v: 'Satin-finish' }, { k: 'Detail', v: 'Tieback incl.' }],
  },
]

export default function TextilesShowcase() {
  return (
    <section
      id="catalog"
      style={{ background: '#0A0C12', padding: '120px 6vw', borderTop: '1px solid rgba(201,168,76,0.12)' }}
    >
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>

        {/* Header */}
        <div
          className="flex flex-col md:flex-row md:items-end md:justify-between"
          style={{ marginBottom: '64px', gap: '24px' }}
        >
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.8, ease }}
          >
            <p style={{
              fontFamily:    'var(--font-inter, sans-serif)',
              fontSize:      '11px',
              color:         '#C9A84C',
              letterSpacing: '5px',
              textTransform: 'uppercase',
              marginBottom:  '14px',
            }}>
              Our Textile Collection
            </p>
            <h2 style={{
              fontFamily: 'var(--font-playfair, Georgia, serif)',
              fontSize:   'clamp(38px, 4vw, 56px)',
              color:      '#FFFFFF',
              lineHeight: 1.08,
            }}>
              Fabrics That Define<br />
              <span style={{ color: '#C9A84C' }}>the Room</span>
            </h2>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.8, ease, delay: 0.15 }}
            style={{
              fontFamily: 'var(--font-inter, sans-serif)',
              fontSize:   '15px',
              color:      '#6A7A8A',
              lineHeight: 1.75,
              maxWidth:   '380px',
            }}
          >
            A curated cross-section of our fabric library.
            Every textile is available for 3D VR preview in the studio
            before you commit to a single metre.
          </motion.p>
        </div>

        {/* Grid — 4 cards, 2×2 on desktop */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4" style={{ gap: '16px' }}>
          {TEXTILES.map((t, i) => (
            <TextileCard key={t.name} textile={t} index={i} />
          ))}
        </div>

        {/* View More CTA */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.7, ease, delay: 0.25 }}
          style={{ marginTop: '48px', display: 'flex', justifyContent: 'center' }}
        >
          <Link
            href="/catalog"
            className="inline-flex items-center gap-2 group"
            style={{
              border:        '1px solid rgba(201,168,76,0.45)',
              color:         '#C9A84C',
              padding:       '14px 36px',
              fontFamily:    'var(--font-inter, sans-serif)',
              fontSize:      '14px',
              fontWeight:    500,
              letterSpacing: '0.5px',
              textDecoration: 'none',
              transition:    'all 0.3s ease',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background   = 'rgba(201,168,76,0.08)'
              e.currentTarget.style.borderColor  = '#C9A84C'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background   = ''
              e.currentTarget.style.borderColor  = 'rgba(201,168,76,0.45)'
            }}
          >
            View More
            <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </motion.div>

      </div>
    </section>
  )
}

function TextileCard({ textile, index }: { textile: typeof TEXTILES[number]; index: number }) {
  const { image, name, category, tag, description, props } = textile

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.7, ease, delay: index * 0.08 }}
      className="group"
      style={{
        background:  '#111318',
        border:      '1px solid rgba(201,168,76,0.1)',
        overflow:    'hidden',
        cursor:      'pointer',
        transition:  'border-color 0.3s ease',
      }}
      onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(201,168,76,0.45)')}
      onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(201,168,76,0.1)')}
    >
      {/* Image */}
      <div style={{ position: 'relative', height: '280px', overflow: 'hidden' }}>
        <Image
          src={image}
          alt={name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          style={{ objectFit: 'cover', transition: 'transform 0.6s ease' }}
          className="group-hover:scale-105"
        />
        {/* Dark overlay — lifts on hover to reveal the image */}
        <div
          className="transition-opacity duration-500 group-hover:opacity-0"
          style={{
            position:   'absolute',
            inset:      0,
            background: 'linear-gradient(180deg, rgba(0,0,0,0.25) 0%, rgba(0,0,0,0.05) 40%, rgba(0,0,0,0.55) 100%)',
            zIndex:     1,
          }}
        />
        {/* Tag */}
        <div style={{
          position:       'absolute',
          top:            '14px',
          left:           '14px',
          background:     'rgba(10,12,20,0.82)',
          border:         '1px solid rgba(201,168,76,0.3)',
          padding:        '4px 10px',
          fontFamily:     'var(--font-inter, sans-serif)',
          fontSize:       '10px',
          color:          '#C9A84C',
          letterSpacing:  '2.5px',
          textTransform:  'uppercase',
          backdropFilter: 'blur(6px)',
          zIndex:         2,
        }}>
          {tag}
        </div>
        {/* Category */}
        <div style={{
          position:      'absolute',
          bottom:        '14px',
          right:         '14px',
          fontFamily:    'var(--font-inter, sans-serif)',
          fontSize:      '10px',
          color:         'rgba(255,255,255,0.5)',
          letterSpacing: '2px',
          textTransform: 'uppercase',
          zIndex:        2,
        }}>
          {category}
        </div>
      </div>

      {/* Info */}
      <div style={{ padding: '20px 20px 24px' }}>
        <h3 style={{
          fontFamily:   'var(--font-playfair, Georgia, serif)',
          fontSize:     '17px',
          color:        '#FFFFFF',
          marginBottom: '8px',
          lineHeight:   1.3,
        }}>
          {name}
        </h3>

        <p style={{
          fontFamily:   'var(--font-inter, sans-serif)',
          fontSize:     '13px',
          color:        '#6A7A8A',
          lineHeight:   1.7,
          marginBottom: '16px',
        }}>
          {description}
        </p>

        {/* Props chips */}
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          {props.map(({ k, v }) => (
            <div
              key={k}
              style={{
                border:        '1px solid rgba(201,168,76,0.18)',
                padding:       '3px 8px',
                fontFamily:    'var(--font-inter, sans-serif)',
                fontSize:      '10px',
                color:         '#8A9AA8',
                letterSpacing: '0.3px',
              }}
            >
              <span style={{ color: 'rgba(201,168,76,0.55)', marginRight: '4px' }}>{k}</span>
              {v}
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}
