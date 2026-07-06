'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { whatsappUrl } from '@/app/lib/whatsapp'

const WA_GREEN = '#25D366'

/**
 * Persistent floating WhatsApp button, bottom-right on every page.
 * Rendered once from the root layout. One tap opens a chat with a
 * pre-filled greeting so the customer just hits send.
 */
export default function WhatsAppFab() {
  const [hovered, setHovered] = useState(false)
  const [mounted, setMounted] = useState(false)

  // Delay entrance slightly so it doesn't fight the page's first paint.
  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 900)
    return () => clearTimeout(t)
  }, [])

  return (
    <AnimatePresence>
      {mounted && (
        <motion.a
          href={whatsappUrl()}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Chat with R&J Interiors on WhatsApp"
          initial={{ opacity: 0, scale: 0.6, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.6 }}
          transition={{ type: 'spring', stiffness: 260, damping: 20 }}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          style={{
            position:       'fixed',
            bottom:         'clamp(18px, 4vw, 28px)',
            right:          'clamp(18px, 4vw, 28px)',
            zIndex:         40,
            display:        'flex',
            alignItems:     'center',
            gap:            hovered ? 12 : 0,
            padding:        hovered ? '0 20px 0 0' : 0,
            height:         56,
            width:          hovered ? 'auto' : 56,
            borderRadius:   28,
            background:     WA_GREEN,
            color:          '#FFFFFF',
            textDecoration: 'none',
            boxShadow:      '0 8px 28px rgba(37,211,102,0.4), 0 2px 8px rgba(0,0,0,0.25)',
            overflow:       'hidden',
            transition:     'gap 0.25s ease, padding 0.25s ease',
          }}
        >
          {/* Icon puck — keeps the circle perfectly round whether label is shown or not */}
          <span style={{
            width:          56,
            height:         56,
            flexShrink:     0,
            display:        'flex',
            alignItems:     'center',
            justifyContent: 'center',
          }}>
            {/* Subtle ping ring */}
            <motion.span
              animate={{ scale: [1, 1.6], opacity: [0.35, 0] }}
              transition={{ duration: 2.4, repeat: Infinity, ease: 'easeOut' }}
              style={{
                position:     'absolute',
                width:        56,
                height:       56,
                borderRadius: '50%',
                border:       `2px solid ${WA_GREEN}`,
              }}
            />
            <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741 1.14.734-3.719-.235-.374A9.86 9.86 0 012 12c0-5.514 4.486-10 10-10s10 4.486 10 10-4.486 10-10 10"/>
            </svg>
          </span>

          {/* Expanding label on hover (desktop) */}
          <AnimatePresence>
            {hovered && (
              <motion.span
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.2 }}
                style={{
                  fontFamily:    'var(--font-inter, sans-serif)',
                  fontSize:      15,
                  fontWeight:    600,
                  whiteSpace:    'nowrap',
                  letterSpacing: '0.01em',
                }}
              >
                Chat with us
              </motion.span>
            )}
          </AnimatePresence>
        </motion.a>
      )}
    </AnimatePresence>
  )
}
