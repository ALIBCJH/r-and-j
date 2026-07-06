'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from 'framer-motion'
import { Menu, X, ShoppingBag } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { useCart } from '@/app/lib/cart'
import { whatsappUrl } from '@/app/lib/whatsapp'

const LINKS = [
  { label: 'Home',       href: '/'           },
  { label: 'Experience', href: '/experience' },
  { label: 'Studio',     href: '/studio'     },
  { label: 'Catalog',    href: '/catalog'    },
  { label: 'About',      href: '/about'      },
  { label: 'Contact',    href: '/contact'    },
]

export default function LandingNavbar() {
  const [scrolled,    setScrolled]    = useState(false)
  const [menuOpen,    setMenuOpen]    = useState(false)
  const [hoveredLink, setHoveredLink] = useState<string | null>(null)
  const { scrollY } = useScroll()
  const pathname    = usePathname()
  const { totalItems, openDrawer } = useCart()

  useMotionValueEvent(scrollY, 'change', (v) => setScrolled(v > 80))

  return (
    <>
      <nav
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-10"
        style={{
          height:         'var(--rj-navbar-height)',
          borderBottom:   scrolled ? '1px solid rgba(201,168,76,0.18)' : '1px solid rgba(201,168,76,0.15)',
          background:     scrolled ? 'rgba(10,18,36,0.6)' : 'transparent',
          backdropFilter: 'blur(18px)',
          WebkitBackdropFilter: 'blur(18px)',
          transition:     'background 0.4s ease, border-color 0.4s ease',
        }}
      >
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 shrink-0">
          <Image
            src="/assets/r_j_interiors_final_premium_logo.png"
            alt="R&J Interiors"
            width={40}
            height={40}
            className="object-contain"
          />
          <span style={{
            fontFamily:    'var(--font-playfair, Georgia, serif)',
            fontSize:      '20px',
            color:         '#E8C96D',
            letterSpacing: '0.07em',
          }}>
            R&amp;J INTERIORS
          </span>
        </Link>

        {/* Center nav */}
        <div
          className="hidden md:flex items-center gap-12"
          onMouseLeave={() => setHoveredLink(null)}
        >
          {LINKS.map(l => {
            const isActive = l.href === '/' ? pathname === '/' : pathname.startsWith(l.href)
            return (
              <NavLink
                key={l.label}
                href={l.href}
                isHovered={hoveredLink === l.label}
                anyHovered={hoveredLink !== null}
                isActive={isActive}
                onHover={() => setHoveredLink(l.label)}
              >
                {l.label}
              </NavLink>
            )
          })}
        </div>

        {/* Right side: whatsapp + cart + CTA + mobile hamburger */}
        <div className="flex items-center gap-4">

          {/* WhatsApp quick-chat */}
          <a
            href={whatsappUrl()}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Chat with us on WhatsApp"
            style={{
              display:    'flex',
              alignItems: 'center',
              padding:    '4px',
              color:      'rgba(255,255,255,0.6)',
              transition: 'color 0.2s',
            }}
            onMouseEnter={e => (e.currentTarget.style.color = '#25D366')}
            onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.6)')}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741 1.14.734-3.719-.235-.374A9.86 9.86 0 012 12c0-5.514 4.486-10 10-10s10 4.486 10 10-4.486 10-10 10"/>
            </svg>
          </a>

          {/* Cart icon */}
          <button
            onClick={openDrawer}
            aria-label="Open cart"
            style={{
              position:   'relative',
              background: 'none',
              border:     'none',
              cursor:     'pointer',
              color:      totalItems > 0 ? '#C9A84C' : 'rgba(255,255,255,0.6)',
              padding:    '4px',
              display:    'flex',
              alignItems: 'center',
              transition: 'color 0.2s',
            }}
            onMouseEnter={e => (e.currentTarget.style.color = '#E8C96D')}
            onMouseLeave={e => (e.currentTarget.style.color = totalItems > 0 ? '#C9A84C' : 'rgba(255,255,255,0.6)')}
          >
            <ShoppingBag size={22} />
            {totalItems > 0 && (
              <span style={{
                position:      'absolute',
                top:           '-4px',
                right:         '-4px',
                background:    'linear-gradient(135deg, #F0D77A, #C9A84C)',
                color:         '#0A0F1C',
                fontFamily:    'var(--font-inter, sans-serif)',
                fontSize:      '10px',
                fontWeight:    700,
                width:         '18px',
                height:        '18px',
                borderRadius:  '50%',
                display:       'flex',
                alignItems:    'center',
                justifyContent:'center',
                lineHeight:    1,
              }}>
                {totalItems > 9 ? '9+' : totalItems}
              </span>
            )}
          </button>

          <Link
            href="/contact"
            className="hidden md:inline-flex items-center rounded-sm font-semibold transition-all duration-300"
            style={{
              background:    'linear-gradient(135deg, #F0D77A 0%, #C9A84C 50%, #A67C2E 100%)',
              color:         '#0A0F1C',
              padding:       '14px 28px',
              fontSize:      '15px',
              letterSpacing: '0.3px',
              boxShadow:     '0 0 28px rgba(201,168,76,0.28)',
              whiteSpace:    'nowrap',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.filter    = 'brightness(1.12)'
              e.currentTarget.style.boxShadow = '0 0 40px rgba(201,168,76,0.45)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.filter    = ''
              e.currentTarget.style.boxShadow = '0 0 28px rgba(201,168,76,0.28)'
            }}
          >
            Book a Consultation
          </Link>
          <button
            className="md:hidden"
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
            style={{ color: '#E8C96D' }}
          >
            <Menu size={26} />
          </button>
        </div>
      </nav>

      {/* Mobile overlay */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ duration: 0.32, ease: [0.25, 0.1, 0.25, 1] }}
            className="fixed inset-0 z-50 flex flex-col"
            style={{ background: '#0D1120', padding: '0 24px 32px' }}
          >
            {/* Header row */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: 60, flexShrink: 0 }}>
              <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }} onClick={() => setMenuOpen(false)}>
                <Image src="/assets/r_j_interiors_final_premium_logo.png" alt="" width={28} height={28} style={{ borderRadius: '50%' }} />
                <span style={{ fontFamily: 'var(--font-playfair)', color: '#E8C96D', fontSize: 15, letterSpacing: '0.06em' }}>
                  R&amp;J INTERIORS
                </span>
              </Link>
              <button onClick={() => setMenuOpen(false)} style={{ color: '#E8C96D', background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}>
                <X size={22} />
              </button>
            </div>

            {/* Divider */}
            <div style={{ height: 1, background: 'rgba(201,168,76,0.12)', marginBottom: 20 }} />

            {/* Nav links */}
            <nav style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {LINKS.map((l, i) => {
                const isActive = l.href === '/' ? pathname === '/' : pathname.startsWith(l.href)
                return (
                  <motion.div
                    key={l.label}
                    initial={{ opacity: 0, x: 24 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05, ease: [0.25, 0.1, 0.25, 1] }}
                  >
                    <Link
                      href={l.href}
                      onClick={() => setMenuOpen(false)}
                      style={{
                        display:       'block',
                        padding:       '12px 0',
                        fontFamily:    'var(--font-inter, sans-serif)',
                        fontSize:      17,
                        fontWeight:    isActive ? 600 : 400,
                        color:         isActive ? '#E8C96D' : 'rgba(255,255,255,0.82)',
                        textDecoration:'none',
                        borderBottom:  '1px solid rgba(255,255,255,0.05)',
                        letterSpacing: '0.01em',
                      }}
                    >
                      {l.label}
                    </Link>
                  </motion.div>
                )
              })}
            </nav>

            {/* Utility row — cart + order tracking (both hidden behind the navbar while the menu is open) */}
            <div style={{ display: 'flex', gap: 10, marginTop: 24 }}>
              <button
                onClick={() => { setMenuOpen(false); openDrawer() }}
                style={{
                  flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                  padding: '12px', background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.10)', borderRadius: 6,
                  color: 'rgba(255,255,255,0.82)', cursor: 'pointer',
                  fontFamily: 'var(--font-inter, sans-serif)', fontSize: 13, letterSpacing: '0.04em',
                }}
              >
                <ShoppingBag size={16} />
                Cart{totalItems > 0 ? ` (${totalItems})` : ''}
              </button>
              <Link
                href="/track"
                onClick={() => setMenuOpen(false)}
                style={{
                  flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                  padding: '12px', background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.10)', borderRadius: 6,
                  color: 'rgba(255,255,255,0.82)', textDecoration: 'none',
                  fontFamily: 'var(--font-inter, sans-serif)', fontSize: 13, letterSpacing: '0.04em',
                }}
              >
                Track Order
              </Link>
            </div>

            {/* Bottom CTAs */}
            <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: 10 }}>
              <Link
                href="/studio"
                onClick={() => setMenuOpen(false)}
                style={{
                  display:       'block',
                  padding:       '13px',
                  textAlign:     'center',
                  fontFamily:    'var(--font-inter, sans-serif)',
                  fontSize:      13,
                  fontWeight:    600,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  background:    'rgba(201,168,76,0.08)',
                  border:        '1px solid rgba(201,168,76,0.25)',
                  borderRadius:  6,
                  color:         '#E8C96D',
                  textDecoration:'none',
                }}
              >
                Fabric Studio
              </Link>
              <Link
                href="/contact"
                onClick={() => setMenuOpen(false)}
                style={{
                  display:       'block',
                  padding:       '14px',
                  textAlign:     'center',
                  fontFamily:    'var(--font-inter, sans-serif)',
                  fontSize:      13,
                  fontWeight:    700,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  background:    'linear-gradient(135deg,#F0D77A,#C9A84C)',
                  color:         '#0A0F1C',
                  borderRadius:  6,
                  textDecoration:'none',
                }}
              >
                Book a Consultation
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

function NavLink({
  href,
  children,
  isHovered,
  anyHovered,
  isActive,
  onHover,
}: {
  href:       string
  children:   React.ReactNode
  isHovered:  boolean
  anyHovered: boolean
  isActive:   boolean
  onHover:    () => void
}) {
  const lit = isHovered || isActive

  return (
    <Link
      href={href}
      className="relative py-1 group"
      style={{ textDecoration: 'none' }}
      onMouseEnter={onHover}
    >
      {/* Label */}
      <motion.span
        animate={{
          color: lit
            ? '#E8C96D'
            : anyHovered
              ? 'rgba(255,255,255,0.38)'
              : 'rgba(255,255,255,0.82)',
          y: isHovered ? -1 : 0,
        }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
        style={{
          fontFamily:    'var(--font-inter, sans-serif)',
          fontSize:      '16px',
          letterSpacing: '0.04em',
          display:       'block',
          fontWeight:    lit ? 500 : 400,
        }}
      >
        {children}
      </motion.span>

      {/* Underline — slides on hover, pulses when active */}
      {(isHovered || isActive) && (
        <motion.div
          layoutId={isHovered && !isActive ? 'nav-indicator' : undefined}
          className="absolute left-0 right-0"
          style={{
            bottom:     '-3px',
            height:     '1.5px',
            background: 'linear-gradient(90deg, transparent, #E8C96D 30%, #F0D77A 50%, #E8C96D 70%, transparent)',
            boxShadow:  '0 0 10px rgba(232,201,109,0.7)',
          }}
          animate={isActive ? { opacity: [0.5, 1, 0.5] } : { opacity: 1 }}
          transition={
            isActive
              ? { duration: 2, repeat: Infinity, ease: 'easeInOut' }
              : { type: 'spring', stiffness: 420, damping: 32 }
          }
        />
      )}

      {/* Dot — persistent + pulsing when active */}
      {(isHovered || isActive) && (
        <motion.div
          layoutId={isHovered && !isActive ? 'nav-dot' : undefined}
          style={{
            position:     'absolute',
            bottom:       '-8px',
            left:         '50%',
            transform:    'translateX(-50%)',
            width:        '3px',
            height:       '3px',
            borderRadius: '50%',
            background:   '#E8C96D',
            boxShadow:    '0 0 6px rgba(232,201,109,0.9)',
          }}
          animate={isActive ? { opacity: [0.4, 1, 0.4], scale: [1, 1.4, 1] } : { opacity: 1, scale: 1 }}
          transition={
            isActive
              ? { duration: 2, repeat: Infinity, ease: 'easeInOut' }
              : { type: 'spring', stiffness: 420, damping: 32 }
          }
        />
      )}
    </Link>
  )
}
