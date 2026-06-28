'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence }      from 'framer-motion'
import Image                            from 'next/image'
import { COLOURS }                      from '../config/colors'
import { API_URL }                      from '@/app/lib/api'
import { drawScene }                    from '@/app/components/mobile-studio/curtainRenderer'

interface Props {
  photo:      File | null
  colorId:    string | null
  onSuccess:  (ref: string) => void
  onPayStart: () => void
  onPayError: (msg: string) => void
  pending:    boolean
  error:      string | null
}

const POLL_INTERVAL_MS = 3000
const POLL_MAX_ATTEMPTS = 40   // 40 × 3s = 2 minutes

function formatKenyanPhone(raw: string): string {
  const digits = raw.replace(/\D/g, '')
  if (digits.startsWith('254')) return `+${digits}`
  if (digits.startsWith('0'))   return `+254${digits.slice(1)}`
  return `+254${digits}`
}

function isValidPhone(raw: string): boolean {
  const digits = raw.replace(/\D/g, '')
  return digits.length >= 9 && digits.length <= 12
}

const SAGE = '#4A5C44'

export function GateScreen({ photo, colorId, onSuccess, onPayStart, onPayError, pending, error }: Props) {
  const [phone,          setPhone]          = useState('')
  const [photoUrl,       setPhotoUrl]       = useState<string | null>(null)
  const [renderedDataUrl,setRenderedDataUrl] = useState<string | null>(null)
  const [canRetry,       setCanRetry]       = useState(false)
  const [checkoutId,     setCheckoutId]     = useState<string | null>(null)
  const retryTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const colour     = COLOURS.find(c => c.id === colorId)
  const colourHex  = colour?.hex ?? '#8A9E82'
  const colourName = colour?.label ?? 'your colour'
  const valid      = isValidPhone(phone)

  useEffect(() => {
    if (!photo) return
    const url = URL.createObjectURL(photo)
    setPhotoUrl(url)
    return () => URL.revokeObjectURL(url)
  }, [photo])

  // Render the actual curtain onto the photo so the blurred preview is real
  useEffect(() => {
    if (!photo || !colourHex) { setRenderedDataUrl(null); return }
    const objectUrl = URL.createObjectURL(photo)
    const img = document.createElement('img')
    img.onload = () => {
      const maxW    = 640
      const scale   = Math.min(1, maxW / img.naturalWidth)
      const canvas  = document.createElement('canvas')
      canvas.width  = Math.round(img.naturalWidth  * scale)
      canvas.height = Math.round(img.naturalHeight * scale)
      drawScene(canvas, img, colourHex)
      setRenderedDataUrl(canvas.toDataURL('image/jpeg', 0.85))
      URL.revokeObjectURL(objectUrl)
    }
    img.onerror = () => URL.revokeObjectURL(objectUrl)
    img.src = objectUrl
  }, [photo, colourHex])

  useEffect(() => {
    if (!pending) { setCanRetry(false); return }
    retryTimer.current = setTimeout(() => setCanRetry(true), 15000)
    return () => { if (retryTimer.current) clearTimeout(retryTimer.current) }
  }, [pending])

  // Poll the backend every 3s until payment is confirmed or fails
  useEffect(() => {
    if (!checkoutId || !pending) return
    let attempts = 0

    const interval = setInterval(async () => {
      attempts++
      if (attempts > POLL_MAX_ATTEMPTS) {
        clearInterval(interval)
        setCheckoutId(null)
        onPayError('Payment timed out. Please try again.')
        return
      }
      try {
        const res  = await fetch(`${API_URL}/mpesa/status/${checkoutId}`)
        const data = await res.json()
        if (data.status === 'complete') {
          clearInterval(interval)
          setCheckoutId(null)
          onSuccess(data.ref)
        } else if (data.status === 'failed') {
          clearInterval(interval)
          setCheckoutId(null)
          onPayError('Payment declined. Please check your M-Pesa balance and try again.')
        }
      } catch {
        // network hiccup — keep polling
      }
    }, POLL_INTERVAL_MS)

    return () => clearInterval(interval)
  }, [checkoutId, pending, onSuccess, onPayError])

  async function handlePay() {
    if (!valid || pending) return
    onPayStart()
    const formatted = formatKenyanPhone(phone)
    try {
      const res = await fetch(`${API_URL}/mpesa/stk-push`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ phone: formatted }),
      })
      if (!res.ok) throw new Error('STK push failed')
      const { checkout_request_id } = await res.json()
      setCheckoutId(checkout_request_id)
    } catch {
      onPayError('Could not reach payment service. Please try again.')
    }
  }

  return (
    <div style={{
      position:   'fixed',
      inset:      0,
      display:    'flex',
      flexDirection: 'column',
      background: '#0D1B2E',
      overflow:   'hidden',
    }}>
      {/* ── Blurred curtain preview (top 55%) ── */}
      <div style={{ flex: '0 0 55%', position: 'relative', overflow: 'hidden' }}>

        {/* Blurred curtain render — actual drawScene output, not fake color panels */}
        <div style={{
          position:  'absolute',
          inset:     0,
          filter:    'blur(10px) brightness(0.65)',
          transform: 'scale(1.12)',
        }}>
          {renderedDataUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={renderedDataUrl}
              alt=""
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          ) : photoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={photoUrl}
              alt=""
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          ) : (
            <Image
              src="/assets/curtain1.png"
              alt=""
              fill
              sizes="100vw"
              style={{ objectFit: 'cover' }}
            />
          )}
        </div>

        {/* Lock overlay */}
        <div style={{
          position:       'absolute',
          inset:          0,
          display:        'flex',
          flexDirection:  'column',
          alignItems:     'center',
          justifyContent: 'center',
          gap:            12,
          background:     'rgba(10,18,32,0.35)',
        }}>
          <motion.div
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
            style={{
              width:          56,
              height:         56,
              borderRadius:   '50%',
              background:     'rgba(255,255,255,0.12)',
              backdropFilter: 'blur(8px)',
              border:         '1.5px solid rgba(255,255,255,0.22)',
              display:        'flex',
              alignItems:     'center',
              justifyContent: 'center',
            }}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
              stroke="white" strokeWidth="2" strokeLinecap="round">
              <rect x="3" y="11" width="18" height="11" rx="2"/>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
          </motion.div>

          <div style={{ textAlign: 'center', padding: '0 24px' }}>
            <p style={{
              fontFamily:    'var(--font-playfair, Georgia, serif)',
              fontSize:      22,
              color:         '#FFFFFF',
              fontWeight:    400,
              margin:        '0 0 6px',
              lineHeight:    1.2,
            }}>
              Your room is ready.
            </p>
            <p style={{
              fontFamily: 'var(--font-inter, sans-serif)',
              fontSize:   13,
              color:      'rgba(255,255,255,0.6)',
              margin:     0,
            }}>
              Pay to unlock your {colourName} preview
            </p>
          </div>
        </div>

        {/* Colour swatch pill */}
        <div style={{
          position:      'absolute',
          bottom:        16,
          left:          '50%',
          transform:     'translateX(-50%)',
          display:       'flex',
          alignItems:    'center',
          gap:           8,
          padding:       '6px 14px',
          borderRadius:  20,
          background:    'rgba(0,0,0,0.45)',
          backdropFilter:'blur(8px)',
          border:        '1px solid rgba(255,255,255,0.12)',
        }}>
          <div style={{
            width:        14,
            height:       14,
            borderRadius: '50%',
            background:   colourHex,
            border:       '1.5px solid rgba(255,255,255,0.3)',
            flexShrink:   0,
          }} />
          <span style={{
            fontFamily: 'var(--font-inter, sans-serif)',
            fontSize:   12,
            color:      'rgba(255,255,255,0.85)',
          }}>
            {colourName}
          </span>
        </div>
      </div>

      {/* ── Payment card (bottom 45%) ── */}
      <motion.div
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0,  opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        style={{
          flex:          '1 1 auto',
          background:    '#FAFAF8',
          borderRadius:  '24px 24px 0 0',
          padding:       '24px 24px',
          paddingBottom: 'calc(24px + env(safe-area-inset-bottom, 0px))',
          overflowY:     'auto',
          display:       'flex',
          flexDirection: 'column',
          gap:           16,
        }}
      >
        <AnimatePresence mode="wait">
          {pending ? (
            <motion.div
              key="waiting"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              style={{
                flex:           '1 1 auto',
                display:        'flex',
                flexDirection:  'column',
                alignItems:     'center',
                justifyContent: 'center',
                gap:            16,
                textAlign:      'center',
              }}
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
                style={{
                  width:        40,
                  height:       40,
                  borderRadius: '50%',
                  border:       '3px solid #E8E4DC',
                  borderTop:    `3px solid ${SAGE}`,
                }}
              />
              <div>
                <p style={{
                  fontFamily: 'var(--font-playfair, Georgia, serif)',
                  fontSize:   20,
                  color:      '#2A2520',
                  margin:     '0 0 6px',
                  fontWeight: 400,
                }}>
                  Check your phone.
                </p>
                <p style={{
                  fontFamily: 'var(--font-inter, sans-serif)',
                  fontSize:   13,
                  color:      '#8A8278',
                  margin:     0,
                  lineHeight: 1.6,
                }}>
                  An M-Pesa prompt has been sent to{' '}
                  <strong style={{ color: '#3A3530' }}>{formatKenyanPhone(phone)}</strong>.
                  <br/>Enter your PIN to confirm.
                </p>
              </div>
              {canRetry && (
                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  onClick={() => { setCanRetry(false); setCheckoutId(null); handlePay() }}
                  style={{
                    background:  'transparent',
                    border:      'none',
                    color:       SAGE,
                    fontFamily:  'var(--font-inter, sans-serif)',
                    fontSize:    13,
                    fontWeight:  500,
                    cursor:      'pointer',
                    textDecoration: 'underline',
                    textUnderlineOffset: 3,
                  }}
                >
                  Didn&apos;t receive the prompt? Send again
                </motion.button>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{ display: 'flex', flexDirection: 'column', gap: 16 }}
            >
              {/* Header */}
              <div>
                <p style={{
                  fontFamily:    'var(--font-inter, sans-serif)',
                  fontSize:      11,
                  fontWeight:    600,
                  letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                  color:         SAGE,
                  margin:        '0 0 6px',
                }}>
                  Unlock preview + book session
                </p>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                  <span style={{
                    fontFamily: 'var(--font-playfair, Georgia, serif)',
                    fontSize:   28,
                    color:      '#2A2520',
                    fontWeight: 400,
                  }}>
                    KES 2,500
                  </span>
                  <span style={{
                    fontFamily: 'var(--font-inter, sans-serif)',
                    fontSize:   12,
                    color:      '#8A8278',
                  }}>
                    deposit · credited toward your order
                  </span>
                </div>
              </div>

              {/* What you get */}
              <div style={{
                display:       'flex',
                flexDirection: 'column',
                gap:           8,
                padding:       '12px 14px',
                borderRadius:  12,
                background:    '#F3F0EB',
                border:        '1px solid #E2DDD6',
              }}>
                {[
                  'Full-resolution curtain preview on your room photo',
                  'Guided studio session with our consultant',
                  'Zero pressure — change your mind before ordering',
                ].map((item, i) => (
                  <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0, marginTop: 2 }}
                      stroke={SAGE} strokeWidth="2.5" strokeLinecap="round">
                      <path d="M5 12l5 5L20 7"/>
                    </svg>
                    <span style={{
                      fontFamily: 'var(--font-inter, sans-serif)',
                      fontSize:   13,
                      color:      '#4A4540',
                      lineHeight: 1.5,
                    }}>
                      {item}
                    </span>
                  </div>
                ))}
              </div>

              {/* Phone input */}
              <div>
                <label style={{
                  display:       'block',
                  fontFamily:    'var(--font-inter, sans-serif)',
                  fontSize:      11,
                  fontWeight:    600,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color:         '#6B6560',
                  marginBottom:  8,
                }}>
                  M-Pesa phone number
                </label>
                <div style={{
                  display:      'flex',
                  alignItems:   'center',
                  borderRadius: 12,
                  border:       `1.5px solid ${phone.length > 0 && !valid ? '#D4786A' : '#D4CFC8'}`,
                  overflow:     'hidden',
                  background:   '#FFFFFF',
                  transition:   'border-color 0.2s',
                }}>
                  <div style={{
                    padding:     '0 12px',
                    borderRight: '1px solid #E8E4DC',
                    height:      '100%',
                    display:     'flex',
                    alignItems:  'center',
                    flexShrink:  0,
                  }}>
                    <span style={{
                      fontFamily: 'var(--font-inter, sans-serif)',
                      fontSize:   15,
                      color:      '#6B6560',
                    }}>
                      🇰🇪 +254
                    </span>
                  </div>
                  <input
                    type="tel"
                    inputMode="numeric"
                    placeholder="7XX XXX XXX"
                    value={phone}
                    onChange={e => setPhone(e.target.value.replace(/[^\d]/g, '').slice(0, 10))}
                    style={{
                      flex:       1,
                      padding:    '14px 14px',
                      border:     'none',
                      outline:    'none',
                      background: 'transparent',
                      fontFamily: 'var(--font-inter, sans-serif)',
                      fontSize:   16,
                      color:      '#2A2520',
                    }}
                  />
                </div>
                {phone.length > 0 && !valid && (
                  <p style={{
                    fontFamily: 'var(--font-inter, sans-serif)',
                    fontSize:   11,
                    color:      '#D4786A',
                    margin:     '6px 0 0',
                  }}>
                    Enter a valid Safaricom number
                  </p>
                )}
              </div>

              {/* Error */}
              {error && (
                <div style={{
                  padding:      '10px 14px',
                  borderRadius: 10,
                  background:   '#FDF2F0',
                  border:       '1px solid #E8C4BC',
                }}>
                  <p style={{
                    fontFamily: 'var(--font-inter, sans-serif)',
                    fontSize:   13,
                    color:      '#C0503A',
                    margin:     0,
                  }}>
                    {error}
                  </p>
                </div>
              )}

              {/* Pay button */}
              <button
                onClick={handlePay}
                disabled={!valid}
                style={{
                  width:          '100%',
                  minHeight:      52,
                  borderRadius:   12,
                  border:         'none',
                  background:     valid
                    ? 'linear-gradient(135deg, #007A39 0%, #00A84F 100%)'
                    : '#E8E4DC',
                  color:          valid ? '#FFFFFF' : '#B8B2A8',
                  fontFamily:     'var(--font-inter, sans-serif)',
                  fontSize:       16,
                  fontWeight:     700,
                  letterSpacing:  '0.02em',
                  cursor:         valid ? 'pointer' : 'default',
                  display:        'flex',
                  alignItems:     'center',
                  justifyContent: 'center',
                  gap:            10,
                  transition:     'background 0.2s, color 0.2s',
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <rect x="1" y="4" width="22" height="16" rx="2"/>
                  <line x1="1" y1="10" x2="23" y2="10"/>
                </svg>
                Pay KES 2,500 with M-Pesa
              </button>

              <p style={{
                fontFamily: 'var(--font-inter, sans-serif)',
                fontSize:   11,
                color:      '#A09890',
                textAlign:  'center',
                margin:     0,
                lineHeight: 1.5,
              }}>
                You will receive an M-Pesa STK push. Enter your PIN to confirm.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}
