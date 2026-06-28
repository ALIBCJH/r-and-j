'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { usePathname } from 'next/navigation'

const LINKS = [
  { label: 'Home',        href: '/' },
  { label: 'Photo Match', href: '/studio' },
  { label: 'Catalog',     href: '/catalog' },
  { label: 'About',       href: '/about' },
  { label: 'Contact',     href: '/contact' },
]

// Only shown in the mobile overlay menu
const MOBILE_ONLY_LINKS = [
  { label: 'Book a Consultation', href: '/style' },
]

export default function LandingNavbar() {
  const [scrolled,    setScrolled]    = useState(false)
  const [menuOpen,    setMenuOpen]    = useState(false)
  const [hoveredLink, setHoveredLink] = useState<string | null>(null)
  const { scrollY } = useScroll()
  const pathname = usePathname()

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

        {/* Book a Consultation CTA */}
        <div className="flex items-center gap-4">
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
            transition={{ duration: 0.38, ease: [0.25, 0.1, 0.25, 1] }}
            className="fixed inset-0 z-50 flex flex-col p-8"
            style={{ background: '#0D1120' }}
          >
            <div className="flex justify-between items-center mb-16">
              <Link href="/" className="flex items-center gap-3" onClick={() => setMenuOpen(false)}>
                <Image src="/assets/r_j_interiors_final_premium_logo.png" alt="" width={34} height={34} />
                <span style={{ fontFamily: 'var(--font-playfair)', color: '#E8C96D', fontSize: '18px' }}>
                  R&amp;J INTERIORS
                </span>
              </Link>
              <button onClick={() => setMenuOpen(false)} style={{ color: '#E8C96D' }}>
                <X size={26} />
              </button>
            </div>

            <nav className="flex flex-col gap-8">
              {LINKS.map((l, i) => {
                const isActive = l.href === '/' ? pathname === '/' : pathname.startsWith(l.href)
                return (
                  <motion.div
                    key={l.label}
                    initial={{ opacity: 0, x: 40 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.07, ease: [0.25, 0.1, 0.25, 1] }}
                  >
                    <Link
                      href={l.href}
                      onClick={() => setMenuOpen(false)}
                      style={{
                        fontFamily: 'var(--font-playfair)',
                        fontSize:   '40px',
                        color:      isActive ? '#E8C96D' : '#FFFFFF',
                      }}
                    >
                      {l.label}
                    </Link>
                  </motion.div>
                )
              })}
            </nav>

            <div className="mt-auto flex flex-col gap-3">
              <Link
                href="/style"
                onClick={() => setMenuOpen(false)}
                className="py-4 text-center font-semibold rounded-sm"
                style={{
                  background:  'rgba(74,92,68,0.15)',
                  border:      '1.5px solid rgba(74,92,68,0.5)',
                  color:       '#8FBF84',
                  fontSize:    '14px',
                  letterSpacing: '0.1em',
                }}
              >
                ✦ Style Picker — Mobile
              </Link>
              <Link
                href="/contact"
                onClick={() => setMenuOpen(false)}
                className="py-4 text-center font-semibold rounded-sm"
                style={{ background: 'var(--rj-gold-gradient)', color: '#0A0F1C', fontSize: '16px' }}
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
