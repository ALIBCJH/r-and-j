'use client'

import { motion } from 'framer-motion'
import { LayoutDashboard, Layers, Glasses } from 'lucide-react'
import Image from 'next/image'

const ease = [0.25, 0.1, 0.25, 1] as const

const STEPS = [
  {
    step:          '01',
    Icon:          LayoutDashboard,
    title:         'Choose Your Environment',
    body:          'Select from our library of high-fidelity architectural shells — from Nairobi penthouses to coastal villas — or import your own blueprints for a fully personalised canvas.',
    imageSrc:      '/assets/card-environment.png',
    imagePosition: 'center center',
  },
  {
    step:          '02',
    Icon:          Layers,
    title:         'Tailor Your Textiles',
    body:          'Browse hundreds of curated fabrics, textures, and gold-leaf finishes. Every swatch is rendered under real-time lighting so what you see is exactly what you receive.',
    imageSrc:      '/assets/material.png',
    imagePosition: 'center center',
  },
  {
    step:          '03',
    Icon:          Glasses,
    title:         'Visualize & Order',
    body:          'Walk through your completed room in immersive 360° VR before a single thread is cut. When the vision is perfect, confirm your order and our craftspeople handle the rest.',
    imageSrc:      '/assets/hero3.png',
    imagePosition: 'center 35%',
  },
]

export default function ProcessSection() {
  return (
    <>
      {/* ── Process Section — connected journey ── */}
      <section style={{
        background: '#0D1B2E',
        padding:    '120px 6vw',
        borderTop:  '1px solid rgba(201,168,76,0.12)',
      }}>
        <div style={{ maxWidth: '1300px', margin: '0 auto' }}>

          {/* Header */}
          <div className="text-center" style={{ marginBottom: '80px' }}>
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
            .journey {
              position: relative;
              display: grid;
              grid-template-columns: repeat(3, 1fr);
              gap: 40px;
              max-width: 1080px;
              margin: 0 auto;
            }
            .rail { position: absolute; z-index: 0; pointer-events: none; }
            .rail-track { position: absolute; inset: 0; background: rgba(201,168,76,0.14); }
            .rail-fill {
              position: absolute; inset: 0;
              background: linear-gradient(90deg, #C9A84C, #E8C96D);
              box-shadow: 0 0 14px rgba(232,201,109,0.55);
            }
            /* horizontal rail (desktop) — runs through the node centres */
            .rail-h { top: 27px; left: 16.66%; right: 16.66%; height: 2px; }
            .rail-fill-h { transform-origin: left center; }
            /* vertical rail (mobile) */
            .rail-v { display: none; }

            .step {
              position: relative;
              z-index: 1;
              display: flex;
              flex-direction: column;
              align-items: center;
              text-align: center;
            }
            .node {
              width: 56px; height: 56px;
              border-radius: 50%;
              display: flex; align-items: center; justify-content: center;
              flex-shrink: 0;
              color: #E8C96D;
              background: #0D1B2E;
              border: 1px solid rgba(201,168,76,0.5);
              box-shadow: 0 0 0 7px #0D1B2E, 0 0 26px rgba(201,168,76,0.28);
              margin-bottom: 30px;
              transition: border-color 0.35s ease, box-shadow 0.35s ease;
            }
            .step:hover .node {
              border-color: rgba(201,168,76,0.85);
              box-shadow: 0 0 0 7px #0D1B2E, 0 0 34px rgba(201,168,76,0.45);
            }
            .step-image {
              position: relative;
              width: 100%; height: 200px;
              overflow: hidden;
              border: 1px solid rgba(201,168,76,0.14);
              margin-bottom: 24px;
            }
            .step-image img { transition: transform 0.65s cubic-bezier(0.25,0.1,0.25,1); }
            .step:hover .step-image img { transform: scale(1.06); }
            .step-num {
              display: block;
              font-family: var(--font-inter, sans-serif);
              font-size: 11px; letter-spacing: 3px; text-transform: uppercase;
              color: #C9A84C; margin-bottom: 12px;
            }
            .step h3 {
              font-family: var(--font-playfair, Georgia, serif);
              font-size: 23px; color: #FFFFFF; line-height: 1.3; margin-bottom: 12px;
            }
            .step p {
              font-family: var(--font-inter, sans-serif);
              font-size: 15px; color: #8294A4; line-height: 1.8; max-width: 320px;
            }

            @media (max-width: 768px) {
              .journey { grid-template-columns: 1fr; gap: 44px; max-width: 460px; }
              .rail-h { display: none; }
              .rail-v { display: block; top: 12px; bottom: 12px; left: 27px; width: 2px; }
              .rail-fill-v { transform-origin: top center; }
              .step { flex-direction: row; align-items: flex-start; text-align: left; gap: 24px; }
              .node { margin-bottom: 0; }
              .step-content { flex: 1; min-width: 0; }
              .step p { max-width: none; }
              .step-image { height: 170px; }
            }
          `}</style>

          {/* Connected journey */}
          <div className="journey">

            {/* Animated rails — draw themselves on scroll */}
            <div className="rail rail-h" aria-hidden>
              <div className="rail-track" />
              <motion.div
                className="rail-fill rail-fill-h"
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 1.6, ease }}
              />
            </div>
            <div className="rail rail-v" aria-hidden>
              <div className="rail-track" />
              <motion.div
                className="rail-fill rail-fill-v"
                initial={{ scaleY: 0 }}
                whileInView={{ scaleY: 1 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 1.6, ease }}
              />
            </div>

            {STEPS.map(({ step, Icon, title, body, imageSrc, imagePosition }, i) => (
              <motion.div
                className="step"
                key={step}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.8, ease, delay: 0.3 + i * 0.45 }}
              >
                <div className="node">
                  <Icon size={24} strokeWidth={1.3} />
                </div>

                <div className="step-content">
                  <div className="step-image">
                    <Image
                      src={imageSrc}
                      alt={title}
                      fill
                      style={{ objectFit: 'cover', objectPosition: imagePosition }}
                      sizes="(max-width: 768px) 90vw, 360px"
                    />
                  </div>
                  <span className="step-num">Step {step}</span>
                  <h3>{title}</h3>
                  <p>{body}</p>
                </div>
              </motion.div>
            ))}
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
