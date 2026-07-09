'use client'

import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Check } from 'lucide-react'
import { whatsappUrl, WHATSAPP_DISPLAY } from '@/app/lib/whatsapp'

const ease = [0.25, 0.1, 0.25, 1] as const

const CLIENT_TYPES = [
  'Homeowner',
  'Office owner',
  'Other',
]

const FIELD_STYLE: React.CSSProperties = {
  width:           '100%',
  background:      'rgba(255,255,255,0.03)',
  border:          '1px solid rgba(201,168,76,0.2)',
  borderRadius:    '6px',
  padding:         '14px 16px',
  color:           '#FFFFFF',
  fontFamily:      'var(--font-inter, sans-serif)',
  fontSize:        '15px',
  outline:         'none',
  boxSizing:       'border-box',
  transition:      'border 0.2s ease, background 0.2s ease, box-shadow 0.2s ease',
}

const LABEL_STYLE: React.CSSProperties = {
  display:       'block',
  fontFamily:    'var(--font-inter, sans-serif)',
  fontSize:      '12px',
  color:         '#A8B2BE',
  letterSpacing: '1px',
  marginBottom:  '8px',
}

function FieldWrap({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: '16px' }}>
      <label style={LABEL_STYLE}>{label}</label>
      {children}
    </div>
  )
}

function applyFocus(el: HTMLElement | null) {
  if (!el) return
  el.style.border      = '1px solid rgba(201,168,76,0.6)'
  el.style.background  = 'rgba(201,168,76,0.04)'
  el.style.boxShadow   = '0 0 0 3px rgba(201,168,76,0.08)'
}
function removeFocus(el: HTMLElement | null) {
  if (!el) return
  el.style.border      = '1px solid rgba(201,168,76,0.2)'
  el.style.background  = 'rgba(255,255,255,0.03)'
  el.style.boxShadow   = ''
}

export default function ContactForm() {
  const [name,       setName]       = useState('')
  const [email,      setEmail]      = useState('')
  const [phone,      setPhone]      = useState('')
  const [clientType, setClientType] = useState('')
  const [message,    setMessage]    = useState('')
  const [dropOpen,   setDropOpen]   = useState(false)
  const [submitted,  setSubmitted]  = useState(false)
  const dropRef = useRef<HTMLDivElement>(null)

  // Close dropdown on outside click
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (dropRef.current && !dropRef.current.contains(e.target as Node)) {
        setDropOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  function handleSubmit() {
    const subject = encodeURIComponent('R&J Interiors Consultation Request')
    const body = encodeURIComponent(
      `Name: ${name}\n\nEmail: ${email}\n\nPhone: ${phone}\n\nI am a: ${clientType}\n\nMessage:\n${message}`
    )
    window.location.href = `mailto:simonjuma465@gmail.com?subject=${subject}&body=${body}`
    setSubmitted(true)
  }

  const cardStyle: React.CSSProperties = {
    background:   '#0D1B2E',
    border:       '1px solid rgba(201,168,76,0.2)',
    borderRadius: '12px',
    padding:      'clamp(32px, 4vw, 48px)',
  }

  if (submitted) {
    return (
      <section style={{ background: '#0D1B2E', padding: 'clamp(64px, 8vw, 100px) 6vw' }}>
        <div style={{ maxWidth: '1240px', margin: '0 auto' }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease }}
            style={{ ...cardStyle, maxWidth: '560px', margin: '0 auto', textAlign: 'center' }}
          >
            <Check size={48} color="#C9A84C" style={{ margin: '0 auto 24px' }} />
            <h2 style={{
              fontFamily:   'var(--font-playfair, Georgia, serif)',
              fontSize:     '28px',
              color:        '#FFFFFF',
              fontWeight:   400,
              marginBottom: '16px',
            }}>
              Message Sent
            </h2>
            <p style={{
              fontFamily:   'var(--font-inter, sans-serif)',
              fontSize:     '16px',
              color:        '#A8B2BE',
              lineHeight:   1.7,
              marginBottom: '28px',
            }}>
              Thank you for reaching out. Simon or Rose will be in touch within 24 hours.
            </p>
            <button
              onClick={() => {
                setSubmitted(false)
                setName(''); setEmail(''); setPhone(''); setClientType(''); setMessage('')
              }}
              style={{
                background:  'none',
                border:      'none',
                cursor:      'pointer',
                fontFamily:  'var(--font-inter, sans-serif)',
                fontSize:    '13px',
                color:       '#C9A84C',
                textDecoration: 'none',
              }}
            >
              Send another message →
            </button>
          </motion.div>
        </div>
      </section>
    )
  }

  return (
    <section style={{ background: '#0D1B2E', paddingTop: 'calc(var(--rj-navbar-height) + clamp(40px, 5vw, 64px))', paddingBottom: 'clamp(64px, 8vw, 100px)', paddingLeft: '6vw', paddingRight: '6vw' }}>
      {/* Page title */}
      <div style={{ maxWidth: '1240px', margin: '0 auto 48px' }}>
        <p style={{
          fontFamily:    'var(--font-inter, sans-serif)',
          fontSize:      '11px',
          color:         '#C9A84C',
          letterSpacing: '4px',
          textTransform: 'uppercase',
          marginBottom:  '16px',
        }}>
          Begin Your Journey
        </p>
        <h1 style={{
          fontFamily:  'var(--font-playfair, Georgia, serif)',
          fontSize:    'clamp(32px, 4vw, 52px)',
          color:       '#FFFFFF',
          fontWeight:  400,
          lineHeight:  1.1,
          marginBottom: 0,
        }}>
          Let&apos;s Build Something{' '}
          <span style={{ color: '#C9A84C', fontStyle: 'italic' }}>Beautiful.</span>
        </h1>
      </div>

      <div
        className="contact-grid"
        style={{
          maxWidth:            '1240px',
          margin:              '0 auto',
          display:             'grid',
          gridTemplateColumns: '1.1fr 0.9fr',
          gap:                 '64px',
          alignItems:          'start',
        }}
      >

        {/* ── LEFT — Form ── */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease, delay: 0.1 }}
          style={cardStyle}
        >
          <p style={{
            fontFamily:    'var(--font-inter, sans-serif)',
            fontSize:      '11px',
            color:         '#C9A84C',
            letterSpacing: '4px',
            textTransform: 'uppercase',
            marginBottom:  '8px',
          }}>
            Send Us a Message
          </p>
          <h2 style={{
            fontFamily:   'var(--font-playfair, Georgia, serif)',
            fontSize:     '28px',
            color:        '#FFFFFF',
            fontWeight:   400,
            marginBottom: '32px',
          }}>
            Start the Conversation
          </h2>
          <div style={{ height: '1px', background: 'rgba(201,168,76,0.15)', marginBottom: '32px' }} />

          {/* Full Name */}
          <FieldWrap label="Full Name">
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Your full name"
              style={FIELD_STYLE}
              onFocus={e => applyFocus(e.currentTarget)}
              onBlur={e => removeFocus(e.currentTarget)}
            />
          </FieldWrap>

          {/* Email */}
          <FieldWrap label="Email Address">
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="your@email.com"
              style={FIELD_STYLE}
              onFocus={e => applyFocus(e.currentTarget)}
              onBlur={e => removeFocus(e.currentTarget)}
            />
          </FieldWrap>

          {/* Phone */}
          <FieldWrap label="Phone Number">
            <input
              type="tel"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              placeholder="e.g. 0712 345 678"
              style={FIELD_STYLE}
              onFocus={e => applyFocus(e.currentTarget)}
              onBlur={e => removeFocus(e.currentTarget)}
            />
          </FieldWrap>

          {/* Custom select */}
          <FieldWrap label="I am a...">
            <div ref={dropRef} style={{ position: 'relative' }}>
              <div
                onClick={() => setDropOpen(p => !p)}
                style={{
                  ...FIELD_STYLE,
                  cursor:         'pointer',
                  display:        'flex',
                  justifyContent: 'space-between',
                  alignItems:     'center',
                  color:          clientType ? '#C9A84C' : '#6B7A8D',
                  userSelect:     'none',
                }}
              >
                <span>{clientType || 'Select your role...'}</span>
                <svg
                  width="12" height="12"
                  viewBox="0 0 12 12"
                  fill="none"
                  style={{
                    transform:  dropOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 0.2s ease',
                    flexShrink: 0,
                  }}
                >
                  <path d="M2 4l4 4 4-4" stroke="#C9A84C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>

              {dropOpen && (
                <div style={{
                  position:     'absolute',
                  top:          'calc(100% + 4px)',
                  left:         0,
                  right:        0,
                  background:   '#0D1B2E',
                  border:       '1px solid rgba(201,168,76,0.4)',
                  borderRadius: '6px',
                  overflow:     'hidden',
                  zIndex:       50,
                  boxShadow:    '0 8px 24px rgba(0,0,0,0.4)',
                }}>
                  {CLIENT_TYPES.map(opt => (
                    <div
                      key={opt}
                      onClick={() => { setClientType(opt); setDropOpen(false) }}
                      style={{
                        padding:    '12px 16px',
                        fontFamily: 'var(--font-inter, sans-serif)',
                        fontSize:   '15px',
                        color:      clientType === opt ? '#C9A84C' : '#A8B2BE',
                        cursor:     'pointer',
                        background: clientType === opt ? 'rgba(201,168,76,0.06)' : 'transparent',
                        transition: 'background 0.15s ease, color 0.15s ease',
                        borderBottom: '1px solid rgba(201,168,76,0.06)',
                      }}
                      onMouseEnter={e => {
                        if (clientType !== opt) {
                          e.currentTarget.style.background = 'rgba(201,168,76,0.04)'
                          e.currentTarget.style.color = '#FFFFFF'
                        }
                      }}
                      onMouseLeave={e => {
                        if (clientType !== opt) {
                          e.currentTarget.style.background = 'transparent'
                          e.currentTarget.style.color = '#A8B2BE'
                        }
                      }}
                    >
                      {opt}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </FieldWrap>

          {/* Message */}
          <FieldWrap label="Tell us about your project">
            <textarea
              value={message}
              onChange={e => setMessage(e.target.value)}
              placeholder="Describe your space, your style preferences, your timeline, or anything else that helps us prepare for your consultation..."
              rows={5}
              style={{
                ...FIELD_STYLE,
                minHeight: '120px',
                resize:    'vertical',
                lineHeight: 1.6,
              }}
              onFocus={e => applyFocus(e.currentTarget)}
              onBlur={e => removeFocus(e.currentTarget)}
            />
          </FieldWrap>

          {/* Submit */}
          <button
            onClick={handleSubmit}
            style={{
              width:          '100%',
              marginTop:      '24px',
              background:     'linear-gradient(135deg, #E8C96D 0%, #C9A84C 50%, #A67C2E 100%)',
              color:          '#0A0F1C',
              fontFamily:     'var(--font-inter, sans-serif)',
              fontSize:       '15px',
              fontWeight:     600,
              padding:        '16px',
              borderRadius:   '6px',
              border:         'none',
              cursor:         'pointer',
              transition:     'all 0.3s ease',
              display:        'flex',
              alignItems:     'center',
              justifyContent: 'center',
              gap:            '8px',
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
            Send Message →
          </button>
        </motion.div>

        {/* ── RIGHT — Info cards ── */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease, delay: 0.25 }}
          style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}
        >
          {/* Card 1 — Direct Contact */}
          <InfoCard label="Direct Contact">
            <a
              href="mailto:simonjuma465@gmail.com"
              style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none', color: '#FFFFFF', transition: 'color 0.2s ease' }}
              onMouseEnter={e => (e.currentTarget.style.color = '#C9A84C')}
              onMouseLeave={e => (e.currentTarget.style.color = '#FFFFFF')}
            >
              <MailIcon />
              <span style={{ fontFamily: 'var(--font-inter, sans-serif)', fontSize: '15px' }}>simonjuma465@gmail.com</span>
            </a>

            <div style={{ height: '1px', background: 'rgba(201,168,76,0.1)', margin: '16px 0' }} />

            <a
              href="tel:+254797942186"
              style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none', color: '#FFFFFF', transition: 'color 0.2s ease' }}
              onMouseEnter={e => (e.currentTarget.style.color = '#C9A84C')}
              onMouseLeave={e => (e.currentTarget.style.color = '#FFFFFF')}
            >
              <PhoneIcon />
              <span style={{ fontFamily: 'var(--font-inter, sans-serif)', fontSize: '15px' }}>0797 942 186</span>
            </a>
            <a
              href={whatsappUrl()}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display:        'inline-block',
                fontFamily:     'var(--font-inter, sans-serif)',
                fontSize:       '12px',
                color:          '#25D366',
                marginTop:      '8px',
                marginLeft:     '32px',
                textDecoration: 'none',
                transition:     'opacity 0.2s ease',
              }}
              onMouseEnter={e => (e.currentTarget.style.opacity = '0.75')}
              onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
            >
              Chat on WhatsApp · {WHATSAPP_DISPLAY}
            </a>
          </InfoCard>

          {/* Card 2 — Location */}
          <InfoCard label="Where We Work">
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
              <MapPinIcon />
              <div>
                <p style={{ fontFamily: 'var(--font-inter, sans-serif)', fontSize: '15px', color: '#FFFFFF', marginBottom: '12px' }}>
                  Based in Nyeri, Kenya
                </p>
                <p style={{
                  fontFamily: 'var(--font-inter, sans-serif)',
                  fontSize:   '14px',
                  color:      '#A8B2BE',
                  lineHeight: 1.7,
                }}>
                  We serve clients across the country — in your home, in our studio, or on a call.
                  Remote consultations available nationwide.
                </p>
              </div>
            </div>
          </InfoCard>

          {/* Card 3 — Consultation details */}
          <InfoCard label="Consultation">
            {[
              { main: 'From KES 2,500',       sub: 'Credited toward your order' },
              { main: '60–90 minute session',  sub: 'In-person or virtual' },
              { main: 'Response within 24 hours', sub: 'We reply to every enquiry' },
            ].map((row, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: i < 2 ? '16px' : 0 }}>
                <div style={{
                  width:        '6px',
                  height:       '6px',
                  borderRadius: '50%',
                  background:   '#C9A84C',
                  marginTop:    '8px',
                  flexShrink:   0,
                }} />
                <div>
                  <p style={{ fontFamily: 'var(--font-inter, sans-serif)', fontSize: '15px', color: '#FFFFFF', marginBottom: '2px' }}>
                    {row.main}
                  </p>
                  <p style={{ fontFamily: 'var(--font-inter, sans-serif)', fontSize: '12px', color: '#6B7A8D' }}>
                    {row.sub}
                  </p>
                </div>
              </div>
            ))}
          </InfoCard>

          {/* Card 4 — How It Works */}
          <div style={{
            background:   'linear-gradient(135deg, rgba(201,168,76,0.04) 0%, transparent 50%), #0D1B2E',
            border:       '1px solid rgba(201,168,76,0.2)',
            borderRadius: '12px',
            padding:      'clamp(24px, 3vw, 32px)',
          }}>
            <p style={{
              fontFamily:    'var(--font-inter, sans-serif)',
              fontSize:      '11px',
              color:         '#C9A84C',
              letterSpacing: '4px',
              textTransform: 'uppercase',
              marginBottom:  '20px',
            }}>
              How It Works
            </p>
            <h3 style={{
              fontFamily:   'var(--font-playfair, Georgia, serif)',
              fontSize:     '20px',
              color:        '#FFFFFF',
              fontWeight:   400,
              marginBottom: '20px',
            }}>
              We Handle Everything
            </h3>
            {[
              { step: '01', label: 'You reach out' },
              { step: '02', label: 'We consult, measure & preview fabrics' },
              { step: '03', label: 'You approve the design' },
              { step: '04', label: 'We manufacture your curtains' },
              { step: '05', label: 'We deliver & install' },
            ].map((item, i, arr) => (
              <div key={item.step} style={{ display: 'flex', alignItems: 'flex-start', gap: '14px', marginBottom: i < arr.length - 1 ? '14px' : 0 }}>
                <span style={{
                  fontFamily:    'var(--font-inter, sans-serif)',
                  fontSize:      '10px',
                  color:         '#C9A84C',
                  letterSpacing: '1px',
                  fontWeight:    600,
                  marginTop:     '2px',
                  flexShrink:    0,
                  width:         '20px',
                }}>
                  {item.step}
                </span>
                <p style={{
                  fontFamily: 'var(--font-inter, sans-serif)',
                  fontSize:   '14px',
                  color:      '#A8B2BE',
                  lineHeight: 1.5,
                }}>
                  {item.label}
                </p>
              </div>
            ))}
            <p style={{
              fontFamily:  'var(--font-playfair, Georgia, serif)',
              fontSize:    '13px',
              color:       '#C9A84C',
              fontStyle:   'italic',
              marginTop:   '20px',
              lineHeight:  1.6,
            }}>
              From your first call to the final curtain — we own every step.
            </p>
          </div>
        </motion.div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .contact-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  )
}

function InfoCard({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{
      background:   '#0D1B2E',
      border:       '1px solid rgba(201,168,76,0.2)',
      borderRadius: '12px',
      padding:      'clamp(24px, 3vw, 32px)',
    }}>
      <p style={{
        fontFamily:    'var(--font-inter, sans-serif)',
        fontSize:      '11px',
        color:         '#C9A84C',
        letterSpacing: '4px',
        textTransform: 'uppercase',
        marginBottom:  '20px',
      }}>
        {label}
      </p>
      {children}
    </div>
  )
}

function MailIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#C9A84C" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
      <rect width="20" height="16" x="2" y="4" rx="2"/>
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
    </svg>
  )
}

function PhoneIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#C9A84C" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.15 12 19.79 19.79 0 0 1 1.08 3.4 2 2 0 0 1 3.06 1h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.09 8.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
    </svg>
  )
}

function MapPinIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#C9A84C" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: '2px' }}>
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
      <circle cx="12" cy="10" r="3"/>
    </svg>
  )
}
