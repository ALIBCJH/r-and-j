'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

const ease = [0.25, 0.1, 0.25, 1] as const

/* Fabric options.
   NOTE: `img` currently points at existing curtain photos as PLACEHOLDERS.
   For the real "live preview" feel, replace these with renders of the SAME
   room shot with each fabric, e.g. /assets/room-linen.png, room-sheer.png,
   room-blackout.png — then just swap the `img` paths below. */
const FABRICS = [
  {
    id:   'linen',
    name: 'Linen',
    desc: 'Soft natural weave, warm daylight diffusion',
    img:  '/assets/curtain1.png',
  },
  {
    id:   'sheer',
    name: 'Sheer',
    desc: 'Light, airy, gently veiled views',
    img:  '/assets/curtain3.png',
  },
  {
    id:   'blackout',
    name: 'Blackout',
    desc: 'Full light control, cinema-grade privacy',
    img:  '/assets/curtain2.png',
  },
]

export default function CurtainConfigurator() {
  const [active, setActive] = useState(0)

  return (
    <section style={{
      background: '#0D1B2E',
      padding:    '120px 6vw',
      borderTop:  '1px solid rgba(201,168,76,0.12)',
    }}>
      <div style={{ maxWidth: '1300px', margin: '0 auto' }}>

        {/* Header */}
        <div className="text-center" style={{ marginBottom: '64px' }}>
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
            Real-Time Configurator
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
            Change the fabric. Watch the room respond.
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
          .config-stage {
            position: relative;
            border: 1px solid rgba(201,168,76,0.18);
            box-shadow: 0 40px 120px rgba(0,0,0,0.5);
            overflow: hidden;
          }
          .config-preview {
            position: relative;
            width: 100%;
            height: clamp(380px, 58vh, 580px);
            overflow: hidden;
            background: #0a1019;
          }
          .config-preview img { transition: opacity 0.6s cubic-bezier(0.25,0.1,0.25,1); }
          .config-scrim {
            position: absolute; inset: 0; z-index: 2; pointer-events: none;
            background:
              linear-gradient(90deg, rgba(8,12,22,0.10) 0%, rgba(8,12,22,0.20) 55%, rgba(8,12,22,0.78) 100%),
              linear-gradient(180deg, rgba(8,12,22,0.45) 0%, transparent 25%, transparent 65%, rgba(8,12,22,0.55) 100%);
          }
          .config-badge {
            position: absolute; top: 22px; left: 22px; z-index: 3;
            display: inline-flex; align-items: center; gap: 8px;
            padding: 7px 14px;
            background: rgba(8,12,22,0.55);
            border: 1px solid rgba(201,168,76,0.35);
            backdrop-filter: blur(6px);
            font-family: var(--font-inter, sans-serif);
            font-size: 10px; letter-spacing: 3px; text-transform: uppercase;
            color: #E8C96D;
          }
          .config-dot {
            width: 7px; height: 7px; border-radius: 50%;
            background: #E8C96D; box-shadow: 0 0 8px rgba(232,201,109,0.9);
          }

          /* Control panel — floats over the preview on desktop */
          .config-panel {
            position: absolute; z-index: 4;
            top: 50%; right: 28px; transform: translateY(-50%);
            width: 340px;
            padding: 28px;
            background: rgba(13,20,34,0.74);
            border: 1px solid rgba(201,168,76,0.35);
            backdrop-filter: blur(16px);
            box-shadow: 0 24px 70px rgba(0,0,0,0.5);
          }
          .config-panel-label {
            font-family: var(--font-inter, sans-serif);
            font-size: 11px; letter-spacing: 3px; text-transform: uppercase;
            color: #C9A84C; margin-bottom: 4px;
          }
          .config-panel-title {
            font-family: var(--font-playfair, Georgia, serif);
            font-size: 20px; color: #FFFFFF; margin-bottom: 22px;
          }
          .fabric-opt {
            display: flex; align-items: flex-start; gap: 14px;
            width: 100%; text-align: left;
            padding: 14px 14px;
            background: transparent;
            border: 1px solid transparent;
            border-left: 2px solid transparent;
            cursor: pointer;
            transition: background 0.3s ease, border-color 0.3s ease;
          }
          .fabric-opt:hover { background: rgba(201,168,76,0.05); }
          .fabric-opt.is-active {
            background: rgba(201,168,76,0.08);
            border-color: rgba(201,168,76,0.25);
            border-left-color: #E8C96D;
          }
          .fabric-radio {
            margin-top: 3px; flex-shrink: 0;
            width: 16px; height: 16px; border-radius: 50%;
            border: 1px solid rgba(201,168,76,0.55);
            display: flex; align-items: center; justify-content: center;
            transition: border-color 0.3s ease;
          }
          .fabric-opt.is-active .fabric-radio { border-color: #E8C96D; }
          .fabric-radio-fill {
            width: 8px; height: 8px; border-radius: 50%;
            background: #E8C96D; box-shadow: 0 0 8px rgba(232,201,109,0.9);
            transform: scale(0); transition: transform 0.3s cubic-bezier(0.34,1.56,0.64,1);
          }
          .fabric-opt.is-active .fabric-radio-fill { transform: scale(1); }
          .fabric-name {
            font-family: var(--font-inter, sans-serif);
            font-size: 15px; font-weight: 600; color: #FFFFFF; line-height: 1.3;
          }
          .fabric-desc {
            font-family: var(--font-inter, sans-serif);
            font-size: 12px; color: #8294A4; line-height: 1.5; margin-top: 3px;
          }
          .config-cta {
            display: inline-flex; align-items: center; gap: 10px;
            width: 100%; justify-content: center;
            margin-top: 24px; padding: 15px 24px;
            background: linear-gradient(135deg, #F0D77A 0%, #C9A84C 50%, #A67C2E 100%);
            color: #0A0F1C;
            font-family: var(--font-inter, sans-serif);
            font-size: 12px; font-weight: 600; letter-spacing: 2px; text-transform: uppercase;
            box-shadow: 0 0 18px rgba(232,201,109,0.25);
            transition: filter 0.3s ease, box-shadow 0.3s ease;
          }
          .config-cta:hover {
            filter: brightness(1.08);
            box-shadow: 0 0 26px rgba(232,201,109,0.4);
          }

          /* Mobile — panel drops below the preview */
          @media (max-width: 768px) {
            .config-preview { height: 320px; }
            .config-panel {
              position: static; transform: none;
              width: 100%; border-top: none;
              backdrop-filter: none;
              background: rgba(13,20,34,0.96);
            }
          }
        `}</style>

        {/* Configurator */}
        <motion.div
          className="config-stage"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.9, ease }}
        >
          {/* Room preview — all fabrics stacked, crossfade by opacity */}
          <div className="config-preview">
            {FABRICS.map((f, i) => (
              <Image
                key={f.id}
                src={f.img}
                alt={`Room with ${f.name} curtains`}
                fill
                sizes="(max-width: 768px) 100vw, 1300px"
                style={{
                  objectFit:      'cover',
                  objectPosition: 'center',
                  opacity:        active === i ? 1 : 0,
                  zIndex:         active === i ? 1 : 0,
                }}
              />
            ))}

            <div className="config-scrim" />

            <div className="config-badge">
              <span className="config-dot" />
              Live Preview
            </div>
          </div>

          {/* Control panel */}
          <div className="config-panel">
            <p className="config-panel-label">Curtain Visualizer</p>
            <p className="config-panel-title">Choose your fabric</p>

            {FABRICS.map((f, i) => (
              <button
                key={f.id}
                type="button"
                className={`fabric-opt${active === i ? ' is-active' : ''}`}
                onClick={() => setActive(i)}
                aria-pressed={active === i}
              >
                <span className="fabric-radio">
                  <span className="fabric-radio-fill" />
                </span>
                <span>
                  <span className="fabric-name">{f.name}</span>
                  <span className="fabric-desc">{f.desc}</span>
                </span>
              </button>
            ))}

            <Link href="/studio" className="config-cta">
              Open VR Studio
              <ArrowRight size={15} />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
