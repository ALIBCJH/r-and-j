'use client'

import { motion } from 'framer-motion'
import { Clock, Calendar, Globe } from 'lucide-react'

const ease = [0.25, 0.1, 0.25, 1] as const

const COLS = [
  { Icon: Clock,    stat: '24 Hours',   label: 'Average response time to every enquiry' },
  { Icon: Calendar, stat: 'KES 2,500',  label: 'Consultation fee, credited to your order' },
  { Icon: Globe,    stat: 'Kenya-Wide', label: 'In-home, studio, or remote call' },
]

export default function ContactInfo() {
  return (
    <section style={{
      background: '#0D1B2E',
      padding:    'clamp(64px, 8vw, 80px) 6vw',
      borderTop:  '1px solid rgba(201,168,76,0.12)',
    }}>
      <div
        className="contact-info-row"
        style={{
          maxWidth:   '1240px',
          margin:     '0 auto',
          display:    'flex',
          alignItems: 'center',
        }}
      >
        {COLS.map((col, i) => {
          const Icon = col.Icon
          return (
            <div key={col.stat} style={{ display: 'contents' }}>
              {i > 0 && (
                <div className="info-divider" style={{
                  width:      '1px',
                  height:     '60px',
                  background: 'rgba(201,168,76,0.2)',
                  flexShrink: 0,
                }} />
              )}
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.6, ease, delay: i * 0.15 }}
                style={{ flex: 1, textAlign: 'center', padding: '0 clamp(20px, 3vw, 40px)' }}
              >
                <Icon size={32} color="#C9A84C" strokeWidth={1.5} style={{ margin: '0 auto 20px', display: 'block' }} />
                <p style={{
                  fontFamily:   'var(--font-playfair, Georgia, serif)',
                  fontSize:     '28px',
                  color:        '#FFFFFF',
                  fontWeight:   400,
                  marginBottom: '8px',
                }}>
                  {col.stat}
                </p>
                <p style={{
                  fontFamily: 'var(--font-inter, sans-serif)',
                  fontSize:   '14px',
                  color:      '#A8B2BE',
                  lineHeight: 1.6,
                }}>
                  {col.label}
                </p>
              </motion.div>
            </div>
          )
        })}
      </div>

      <style>{`
        @media (max-width: 640px) {
          .contact-info-row { flex-direction: column !important; gap: 40px; }
          .info-divider { display: none !important; }
        }
      `}</style>
    </section>
  )
}
