'use client'

import Image from 'next/image'
import Link from 'next/link'

function IgIcon() { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect width="20" height="20" x="2" y="2" rx="5"/><circle cx="12" cy="12" r="4.5"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg> }
function LiIcon() { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg> }
function XIcon()  { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M4 4l16 16M4 20 20 4"/></svg> }

export default function LandingFooter() {
  return (
    <footer style={{ background: '#0D1B2E', borderTop: '1px solid rgba(201,168,76,0.15)' }}>
      <style>{`
        @media (max-width: 768px) {
          .footer-grid { grid-template-columns: 1fr !important; }
          .footer-lower { flex-direction: column; gap: 16px; text-align: center; }
        }
      `}</style>

      {/* Upper */}
      <div
        className="footer-grid"
        style={{
          maxWidth:            '1400px',
          margin:              '0 auto',
          padding:             '80px 6vw 60px',
          display:             'grid',
          gridTemplateColumns: '2fr 1fr 1fr',
          gap:                 '48px',
        }}
      >
        {/* Brand */}
        <div>
          <Link href="/" className="flex items-center gap-3" style={{ marginBottom: '16px' }}>
            <Image src="/logo24.png" alt="R&J Interiors" width={38} height={38} className="object-contain" />
            <span style={{ fontFamily: 'var(--font-playfair, Georgia, serif)', fontSize: '17px', color: '#C9A84C', letterSpacing: '0.05em' }}>
              R&amp;J INTERIORS
            </span>
          </Link>
          <p style={{ fontFamily: 'var(--font-playfair, Georgia, serif)', fontSize: '14px', color: '#C9A84C', fontStyle: 'italic', marginBottom: '16px' }}>
            Visualize. Design. Transform.
          </p>
          <p style={{ fontFamily: 'var(--font-inter, sans-serif)', fontSize: '14px', color: '#506070', lineHeight: 1.75, maxWidth: '280px' }}>
            Crafting cinematic atmospheres through the fusion of traditional craftsmanship
            and bleeding-edge virtual technology.
          </p>
        </div>

        {/* Navigation */}
        <FooterCol heading="Navigation">
          <FLink href="/experience">The Experience</FLink>
          <FLink href="/catalog">Catalog</FLink>
          <FLink href="/about">About</FLink>
          <FLink href="/contact">Contact</FLink>
          <FLink href="/track">Track Order</FLink>
        </FooterCol>

        {/* Studio */}
        <FooterCol heading="Studio">
          <FLink href="/contact">Book Consultation</FLink>
          <FLink href="/studio">Try Studio</FLink>
          <FLink href="#">Privacy Policy</FLink>
        </FooterCol>

      </div>

      {/* Lower */}
      <div style={{ borderTop: '1px solid rgba(201,168,76,0.08)' }}>
        <div className="footer-lower" style={{
          maxWidth:       '1400px',
          margin:         '0 auto',
          padding:        '16px 6vw',
          minHeight:      '64px',
          display:        'flex',
          alignItems:     'center',
          justifyContent: 'space-between',
        }}>
          <p style={{ fontFamily: 'var(--font-inter, sans-serif)', fontSize: '12px', color: '#3A4A58' }}>
            © 2026 R&amp;J Interiors. Crafting Cinematic Atmospheres.
          </p>

          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            {([['Instagram', IgIcon], ['LinkedIn', LiIcon], ['X / Twitter', XIcon]] as const).map(([label, Icon]) => (
              <a
                key={label}
                href="#"
                aria-label={label}
                style={{ color: '#3A4A58', transition: 'color 0.2s ease' }}
                onMouseEnter={e => (e.currentTarget.style.color = '#C9A84C')}
                onMouseLeave={e => (e.currentTarget.style.color = '#3A4A58')}
              >
                <Icon />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}

function FooterCol({ heading, children }: { heading: string; children: React.ReactNode }) {
  return (
    <div>
      <p style={{
        fontFamily:    'var(--font-inter, sans-serif)',
        fontSize:      '11px',
        letterSpacing: '3px',
        textTransform: 'uppercase',
        color:         '#506070',
        marginBottom:  '20px',
      }}>
        {heading}
      </p>
      <div style={{ display: 'flex', flexDirection: 'column' }}>{children}</div>
    </div>
  )
}

function FLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      style={{
        fontFamily:  'var(--font-inter, sans-serif)',
        fontSize:    '14px',
        color:       '#506070',
        textDecoration: 'none',
        lineHeight:  2.4,
        transition:  'color 0.2s ease',
      }}
      onMouseEnter={e => (e.currentTarget.style.color = '#C9A84C')}
      onMouseLeave={e => (e.currentTarget.style.color = '#506070')}
    >
      {children}
    </Link>
  )
}
