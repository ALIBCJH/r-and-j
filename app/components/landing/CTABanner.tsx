'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'

const ease = [0.25, 0.1, 0.25, 1] as const

export default function CTABanner() {
  return (
    <section
      className="relative overflow-hidden"
      style={{ background: '#0D1B2E', padding: '140px 6vw', borderTop: '1px solid rgba(201,168,76,0.12)' }}
    >
      {/* Centered gold glow */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: 'radial-gradient(ellipse 55% 65% at 50% 50%, rgba(201,168,76,0.05) 0%, transparent 70%)',
      }} />

      <div className="relative text-center" style={{ maxWidth: '680px', margin: '0 auto' }}>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease }}
          style={{
            fontFamily:    'var(--font-inter, sans-serif)',
            fontSize:      '11px',
            color:         '#C9A84C',
            letterSpacing: '5px',
            textTransform: 'uppercase',
            marginBottom:  '24px',
          }}
        >
          Begin Your Journey
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease, delay: 0.1 }}
          style={{
            fontFamily:   'var(--font-playfair, Georgia, serif)',
            fontSize:     'clamp(40px, 4.5vw, 58px)',
            color:        '#FFFFFF',
            lineHeight:   1.1,
            marginBottom: '24px',
          }}
        >
          Your Home Deserves<br />
          to Be{' '}
          <em style={{ color: '#C9A84C', fontStyle: 'italic' }}>Seen.</em>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease, delay: 0.2 }}
          style={{
            fontFamily:   'var(--font-inter, sans-serif)',
            fontSize:     '18px',
            color:        '#A8B2BE',
            textAlign:    'center',
            maxWidth:     '480px',
            margin:       '0 auto 40px',
            lineHeight:   1.7,
          }}
        >
          Book a consultation with our design team and experience your space
          transformed before a single thread is cut.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease, delay: 0.3 }}
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
        >
          <Link
            href="/contact"
            className="inline-flex items-center"
            style={{
              fontFamily:    'var(--font-inter, sans-serif)',
              fontSize:      '15px',
              fontWeight:    600,
              color:         '#0A0F1C',
              background:    'linear-gradient(135deg, #E8C96D 0%, #C9A84C 50%, #A67C2E 100%)',
              padding:       '18px 48px',
              borderRadius:  '3px',
              textDecoration:'none',
              transition:    'all 0.3s ease',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.filter    = 'brightness(1.1)'
              e.currentTarget.style.transform = 'translateY(-2px)'
              e.currentTarget.style.boxShadow = '0 8px 24px rgba(201,168,76,0.3)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.filter    = ''
              e.currentTarget.style.transform = ''
              e.currentTarget.style.boxShadow = ''
            }}
          >
            Book a Consultation
          </Link>

          <div style={{ marginTop: '24px', textAlign: 'center' }}>
            <p style={{
              fontFamily:   'var(--font-inter, sans-serif)',
              fontSize:     '13px',
              color:        '#A8B2BE',
              fontWeight:   500,
              marginBottom: '4px',
            }}>
              Based in Nyeri, Kenya.
            </p>
            <p style={{
              fontFamily: 'var(--font-inter, sans-serif)',
              fontSize:   '13px',
              color:      '#6B7A8D',
              lineHeight: 1.8,
            }}>
              We serve clients across the country — in your home, in our studio, or on a call.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
