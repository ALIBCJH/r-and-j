'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { useTheme, useThemeColors } from './ThemeProvider'

const NAV_LINKS = [
  { label: 'Experience', href: '/the-experience' },
  { label: 'Showrooms',  href: '/for-showrooms' },
  { label: 'Catalog',    href: '/catalog' },
  { label: 'Resources',  href: '/resources' },
  { label: 'About',      href: '/about' },
]

function SunIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="5" />
      <path d="M12 1v2" />
      <path d="M12 21v2" />
      <path d="M4.22 4.22l1.42 1.42" />
      <path d="M18.36 18.36l1.42 1.42" />
      <path d="M1 12h2" />
      <path d="M21 12h2" />
      <path d="M4.22 19.78l1.42-1.42" />
      <path d="M18.36 5.64l1.42-1.42" />
    </svg>
  )
}

function MoonIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  )
}

export default function Navbar() {
  const [scrolled, setScrolled]   = useState(false)
  const [menuOpen, setMenuOpen]   = useState(false)
  const pathname = usePathname()
  const isHome = pathname === '/'
  const { theme, toggle } = useTheme()
  const c = useThemeColors()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // On non-home pages the navbar is always solid
  const solid = scrolled || !isHome

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
      style={{
        background: solid ? c.navSolid : 'transparent',
        backdropFilter: solid ? 'blur(12px)' : 'none',
        borderBottom: solid ? `1px solid ${c.navBorder}` : '1px solid transparent',
      }}
    >
      <nav className="max-w-7xl mx-auto px-6 h-[68px] flex items-center justify-between">

        {/* Logo + wordmark */}
        <Link href="/" className="flex items-center gap-3 shrink-0 group">
          <img
            src="/assets/r_j_interiors_final_premium_logo.png"
            alt="R&J Interiors"
            className="w-9 h-9 rounded-full object-cover transition-transform duration-300 group-hover:scale-105"
            style={{ outline: '1px solid rgba(201,168,76,0.35)', outlineOffset: '2px' }}
          />
          <span
            className="text-sm font-semibold tracking-wide transition-colors duration-300"
            style={{ color: solid ? c.navText : '#FAFAF8' }}
          >
            R&amp;J Interiors
          </span>
        </Link>

        {/* Desktop nav links */}
        <div className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map(({ label, href }) => {
            const active = pathname === href
            return (
              <Link
                key={href}
                href={href}
                className="px-4 py-2 text-[12px] font-medium tracking-wide transition-colors duration-200 relative group"
                style={{ color: active ? '#C9A84C' : solid ? c.navLink : 'rgba(250,250,248,0.75)' }}
              >
                {label}
                <span
                  className="absolute bottom-1 left-4 right-4 h-px transition-all duration-200 origin-left"
                  style={{
                    background: '#C9A84C',
                    transform: active ? 'scaleX(1)' : 'scaleX(0)',
                  }}
                />
              </Link>
            )
          })}
        </div>

        {/* Theme toggle */}
        <button
          onClick={toggle}
          aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          className="hidden md:flex w-8 h-8 items-center justify-center rounded-sm transition-colors"
          style={{ color: solid ? c.navLink : 'rgba(250,250,248,0.65)' }}
          onMouseEnter={e => (e.currentTarget.style.color = '#C9A84C')}
          onMouseLeave={e => (e.currentTarget.style.color = solid ? c.navLink : 'rgba(250,250,248,0.65)')}
        >
          {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
        </button>

        {/* Mobile hamburger */}
        <button
          className="md:hidden flex flex-col gap-1.5 p-2"
          onClick={() => setMenuOpen(o => !o)}
          aria-label="Toggle menu"
        >
          {[0, 1, 2].map(i => (
            <span
              key={i}
              className="block w-5 h-px transition-all duration-300"
              style={{ background: solid ? c.navText : '#FAFAF8' }}
            />
          ))}
        </button>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="md:hidden overflow-hidden"
            style={{ background: c.navSolid, borderTop: `1px solid ${c.navBorder}` }}
          >
            <div className="px-6 py-4 flex flex-col gap-1">
              {NAV_LINKS.map(({ label, href }) => (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setMenuOpen(false)}
                  className="py-3 text-sm font-medium border-b"
                  style={{ color: c.navText, borderColor: c.navBorder }}
                >
                  {label}
                </Link>
              ))}

              {/* Mobile theme toggle */}
              <button
                onClick={() => { toggle(); setMenuOpen(false) }}
                className="flex items-center gap-3 py-3 text-sm font-medium"
                style={{ color: c.navText }}
              >
                {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
                {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
