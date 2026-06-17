'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import ConfigPanel, { type FabricType, type RoomPreset } from '../components/ConfigPanel'
import { useTheme, useThemeColors } from '../components/ThemeProvider'

// ─── Loading fallback — standalone component so hooks are legal ───────────────

function StudioLoadingFallback() {
  const c = useThemeColors()
  return (
    <div className="flex-1 flex items-center justify-center" style={{ background: c.studioBg }}>
      <div className="flex flex-col items-center gap-5">
        <div className="relative w-10 h-10">
          <div className="absolute inset-0 rounded-full border border-[#C9A84C]/20" />
          <div className="absolute inset-0 rounded-full border-t border-[#C9A84C] animate-spin" />
        </div>
        <span className="text-[9px] tracking-[0.4em] uppercase" style={{ color: '#C9A84C' }}>
          Loading Studio
        </span>
      </div>
    </div>
  )
}

const RoomScene = dynamic(() => import('../components/RoomScene'), {
  ssr: false,
  loading: () => <StudioLoadingFallback />,
})

// ─── Editorial data per curtain colour ───────────────────────────────────────

const EDITORIAL: Record<string, { name: string; collection: string; desc: string }> = {
  '#F0EBE0': { name: 'Ivory Veil',      collection: 'ESSENTIALS · NO. 01', desc: 'Pure architectural simplicity with luminous drape. Woven for rooms that breathe freely.' },
  '#E8DCC8': { name: 'Pale Linen',      collection: 'ESSENTIALS · NO. 02', desc: 'Timeless neutral with natural light diffusion. A foundation for every interior story.' },
  '#D4B896': { name: 'Desert Sand',     collection: 'WARMTH · NO. 03',     desc: 'Sun-baked tones with rich tactile presence. Earthy depth with graceful flow.' },
  '#C8A070': { name: 'Gilded Silk',     collection: 'SUNSTONE · NO. 07',   desc: 'Gold-woven architectural textile. Designed for dramatic floor-to-ceiling draping with superior light attenuation.' },
  '#C49890': { name: 'Dusty Rose',      collection: 'BLOOM · NO. 04',      desc: 'Soft petal hues with vintage warmth. Romantic and refined in equal measure.' },
  '#E0B8B4': { name: 'Blush Voile',     collection: 'BLOOM · NO. 05',      desc: 'Translucent blush with ethereal lightness. Filters morning sun into rose gold.' },
  '#8FAF8C': { name: 'Sage Weave',      collection: 'BOTANICA · NO. 08',   desc: 'Botanical sage with organic texture. Brings the calm of nature indoors.' },
  '#4A7A5C': { name: 'Forest Deep',     collection: 'BOTANICA · NO. 09',   desc: 'Rich woodland green with architectural authority. Bold yet serene.' },
  '#1E3A5F': { name: 'Midnight Navy',   collection: 'NOIR · NO. 11',       desc: 'Deep ocean depths in structured drape. Drama distilled to its essence.' },
  '#3A5F8A': { name: 'Denim Dusk',      collection: 'NOIR · NO. 12',       desc: 'Twilight blue with casual sophistication. The modern room\'s anchor.' },
  '#3C3C3C': { name: 'Charcoal Drape',  collection: 'NOIR · NO. 13',       desc: 'Pure architectural charcoal. Absorbs light, commands space.' },
  '#6A7A84': { name: 'Slate Storm',     collection: 'NOIR · NO. 14',       desc: 'Industrial slate with soft hand. Urban refinement, residential comfort.' },
  '#C07455': { name: 'Terracotta Sun',  collection: 'WARMTH · NO. 06',     desc: 'Mediterranean terracotta warmth. Earthy, bold, unmistakably luxurious.' },
  '#7A2F3A': { name: 'Burgundy Velour', collection: 'REGAL · NO. 10',      desc: 'The classic curtain, perfected. Deep claret with regal weight.' },
}

const FABRIC_LABEL: Record<FabricType, string> = {
  linen:  'Wave Fold Linen',
  velvet: 'Pinch Pleat Velvet',
  cotton: 'Eyelet Cotton',
  sheer:  'Sheer Panel',
}

// ─── Inline SVG helpers ───────────────────────────────────────────────────────

function HeartIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  )
}
function ZoomInIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" /><path d="M11 8v6M8 11h6" />
    </svg>
  )
}
function ZoomOutIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" /><path d="M8 11h6" />
    </svg>
  )
}
function RotateIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" /><path d="M3 3v5h5" />
    </svg>
  )
}
function SunToggleIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="5" />
      <path d="M12 2v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2M20 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
    </svg>
  )
}
function MoonToggleIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  )
}
function CloseIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  )
}
function CheckCircleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#C9A84C" strokeWidth="1.5">
      <circle cx="12" cy="12" r="10" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  )
}

// ─── Consultation Modal ───────────────────────────────────────────────────────

interface ModalProps {
  curtainColor: string
  fabric: FabricType
  activeRoom: string
  onClose: () => void
}

function ConsultationModal({ curtainColor, fabric, activeRoom, onClose }: ModalProps) {
  const [name,  setName]  = useState('')
  const [phone, setPhone] = useState('')
  const [sent,  setSent]  = useState(false)

  const editorial = EDITORIAL[curtainColor] ?? { name: 'Custom Tone', collection: 'BESPOKE · NO. 00', desc: '' }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const subject = encodeURIComponent('Studio Design Consultation — R&J Interiors')
    const body = encodeURIComponent(
      `Hello R&J Interiors,\n\nI would like to book a consultation for my curtain design.\n\n` +
      `— My Design Configuration —\n` +
      `Room:    ${activeRoom || 'Not specified'}\n` +
      `Curtain: ${editorial.name} (${curtainColor})\n` +
      `Fabric:  ${FABRIC_LABEL[fabric]}\n\n` +
      `— My Details —\n` +
      `Name:    ${name}\n` +
      `Phone:   ${phone}\n\n` +
      `Please get in touch at your earliest convenience.\n\nThank you.`
    )
    window.location.href = `mailto:info@rjinteriors.co.ke?subject=${subject}&body=${body}`
    setSent(true)
  }

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '10px 14px',
    fontSize: '12px',
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(201,168,76,0.2)',
    borderRadius: '2px',
    color: '#E8E0D0',
    outline: 'none',
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(4px)' }}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div
        className="w-full max-w-[480px] relative"
        style={{
          background: '#0A1525',
          border: '1px solid rgba(201,168,76,0.25)',
          borderRadius: '4px',
          boxShadow: '0 32px 80px rgba(0,0,0,0.6)',
        }}
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center transition-opacity opacity-50 hover:opacity-100"
          style={{ color: '#A09080' }}
        >
          <CloseIcon />
        </button>

        {sent ? (
          /* ── Success state ── */
          <div className="p-10 flex flex-col items-center text-center gap-5">
            <div
              className="w-14 h-14 rounded-full flex items-center justify-center"
              style={{ background: 'rgba(201,168,76,0.1)', border: '1px solid rgba(201,168,76,0.3)' }}
            >
              <CheckCircleIcon />
            </div>
            <div>
              <h2 className="text-2xl font-light mb-2" style={{ color: '#E8E0D0', fontFamily: 'Georgia, serif' }}>
                Email Prepared
              </h2>
              <p className="text-xs leading-relaxed" style={{ color: '#7A8A98' }}>
                Your design configuration has been added to the email. Complete sending it in your email client and our team will be in touch shortly.
              </p>
            </div>
            <button
              onClick={onClose}
              className="h-9 px-8 text-[9px] font-semibold tracking-[0.2em] uppercase"
              style={{ background: 'rgba(201,168,76,0.12)', color: '#C9A84C', border: '1px solid rgba(201,168,76,0.3)', borderRadius: '2px' }}
            >
              Back to Studio
            </button>
          </div>
        ) : (
          /* ── Form state ── */
          <div className="p-8">
            {/* Header */}
            <div className="mb-6">
              <p className="text-[8px] font-semibold tracking-[0.32em] uppercase mb-2" style={{ color: '#C9A84C' }}>
                R&amp;J Interiors · Book a Consultation
              </p>
              <h2 className="text-2xl font-light leading-tight" style={{ color: '#E8E0D0', fontFamily: 'Georgia, serif' }}>
                Let's bring your{' '}
                <span style={{ color: '#C9A84C', fontStyle: 'italic' }}>vision to life.</span>
              </h2>
            </div>

            {/* Config summary */}
            <div
              className="flex items-center gap-4 p-4 mb-6 rounded"
              style={{ background: 'rgba(201,168,76,0.05)', border: '1px solid rgba(201,168,76,0.12)' }}
            >
              <div
                className="w-10 h-14 rounded shrink-0"
                style={{ background: curtainColor, boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.15)' }}
              />
              <div className="min-w-0">
                <p className="text-[8px] tracking-[0.25em] uppercase mb-1" style={{ color: '#C9A84C' }}>
                  {editorial.collection}
                </p>
                <p className="text-sm font-medium mb-1 truncate" style={{ color: '#E8E0D0' }}>
                  {editorial.name}
                </p>
                <p className="text-[10px]" style={{ color: '#7A8A98' }}>
                  {FABRIC_LABEL[fabric]} · {activeRoom || 'Custom Room'}
                </p>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-[9px] tracking-[0.22em] uppercase mb-1.5" style={{ color: '#7A8A98' }}>
                  Your Name
                </label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Sarah Okonkwo"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  style={inputStyle}
                  onFocus={e => (e.target.style.borderColor = 'rgba(201,168,76,0.55)')}
                  onBlur={e => (e.target.style.borderColor = 'rgba(201,168,76,0.2)')}
                />
              </div>
              <div>
                <label className="block text-[9px] tracking-[0.22em] uppercase mb-1.5" style={{ color: '#7A8A98' }}>
                  Phone Number
                </label>
                <input
                  required
                  type="tel"
                  placeholder="e.g. +254 700 000 000"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  style={inputStyle}
                  onFocus={e => (e.target.style.borderColor = 'rgba(201,168,76,0.55)')}
                  onBlur={e => (e.target.style.borderColor = 'rgba(201,168,76,0.2)')}
                />
              </div>
              <button
                type="submit"
                className="w-full py-3 text-[10px] font-semibold tracking-[0.22em] uppercase mt-1 transition-opacity hover:opacity-90 active:opacity-75"
                style={{
                  background: 'linear-gradient(135deg, #B8922A 0%, #E8C87A 50%, #C9A84C 100%)',
                  color: '#0E0E10',
                  borderRadius: '2px',
                }}
              >
                Send Enquiry →
              </button>
            </form>

            <p className="text-[9px] text-center mt-3" style={{ color: '#4A5A68' }}>
              We'll reply within 24 hours · No obligation
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function Home() {
  const { theme, toggle } = useTheme()
  const c = useThemeColors()

  const [curtainColor, setCurtainColor] = useState('#C8A070')
  const [wallColor, setWallColor]       = useState('#F8F4EF')
  const [floorColor, setFloorColor]     = useState('#D4A86A')
  const [fabric, setFabric]             = useState<FabricType>('linen')
  const [curtainsOpen, setCurtainsOpen] = useState(true)
  const [isNight, setIsNight]           = useState(false)
  const [lightIntensity, setLightIntensity] = useState(60)
  const [saved, setSaved]               = useState(false)
  const [activeRoom, setActiveRoom]     = useState('')
  const [showModal, setShowModal]       = useState(false)
  const [panelOpen, setPanelOpen]       = useState(true)

  const handleRoomPreset = (preset: RoomPreset) => {
    setCurtainColor(preset.curtainColor)
    setWallColor(preset.wallColor)
    setFloorColor(preset.floorColor)
    setFabric(preset.fabric)
    setActiveRoom(preset.label)
  }

  const editorial = EDITORIAL[curtainColor] ?? {
    name: 'Custom Tone',
    collection: 'BESPOKE · NO. 00',
    desc: 'A unique selection from your personal palette. Tailored for your vision.',
  }

  const sceneToolbarBg = c.isDark ? 'rgba(14,14,16,0.75)' : 'rgba(250,250,248,0.88)'

  return (
    <div className="flex flex-col h-screen overflow-hidden" style={{ background: c.studioBg }}>

      {/* ── Mobile notice — only shows below md breakpoint ── */}
      <div className="md:hidden fixed inset-0 z-[200] flex flex-col items-center justify-center text-center px-8 py-12" style={{ background: '#0D1B2E' }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/assets/r_j_interiors_final_premium_logo.png" alt="" style={{ width: 72, height: 72, borderRadius: '50%', marginBottom: 28, outline: '1px solid rgba(201,168,76,0.4)', outlineOffset: 2 }} />
        <p style={{ fontFamily: 'Georgia, serif', fontSize: 28, color: '#E8E0D0', fontWeight: 400, lineHeight: 1.2, marginBottom: 12 }}>
          Best on Desktop
        </p>
        <p style={{ fontFamily: 'sans-serif', fontSize: 14, color: '#5A7088', lineHeight: 1.75, maxWidth: 300, marginBottom: 36 }}>
          The 3D Design Studio is built for larger screens. Open it on a laptop or desktop for the full experience.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: '100%', maxWidth: 280 }}>
          <a href="/catalog" style={{ display: 'block', padding: '14px 24px', background: 'linear-gradient(135deg, #B8922A, #E8C87A, #C9A84C)', color: '#0E0E10', fontFamily: 'sans-serif', fontSize: 13, fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', borderRadius: 2, textDecoration: 'none', textAlign: 'center' }}>
            Browse Catalog
          </a>
          <a href="/contact" style={{ display: 'block', padding: '14px 24px', background: 'transparent', color: '#C9A84C', fontFamily: 'sans-serif', fontSize: 13, fontWeight: 500, letterSpacing: '0.15em', textTransform: 'uppercase', border: '1px solid rgba(201,168,76,0.35)', borderRadius: 2, textDecoration: 'none', textAlign: 'center' }}>
            Book Consultation
          </a>
          <a href="/" style={{ display: 'block', padding: '10px', color: '#3A5068', fontFamily: 'sans-serif', fontSize: 12, textDecoration: 'none', textAlign: 'center' }}>
            ← Back to Home
          </a>
        </div>
      </div>

      {/* ── Navbar ── */}
      <nav
        className="h-[52px] shrink-0 flex items-center px-5 gap-4"
        style={{ background: c.studioNav, borderBottom: `1px solid ${c.studioNavBorder}` }}
      >
        {/* Back link */}
        <a
          href="/"
          className="flex items-center gap-1.5 transition-opacity opacity-60 hover:opacity-100 shrink-0"
          style={{ color: c.studioMuted, textDecoration: 'none' }}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="m15 18-6-6 6-6" />
          </svg>
          <span className="text-[9px] font-semibold tracking-[0.2em] uppercase">Home</span>
        </a>

        {/* Divider */}
        <div className="w-px h-4 shrink-0" style={{ background: c.studioDivider }} />

        {/* Logo + Studio label */}
        <div className="flex items-center gap-2.5 shrink-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/assets/r_j_interiors_final_premium_logo.png"
            alt=""
            className="w-7 h-7 rounded-full object-cover"
            style={{ outline: '1px solid rgba(201,168,76,0.35)', outlineOffset: '1px' }}
          />
          <div>
            <span className="text-[10px] font-semibold tracking-[0.22em] uppercase" style={{ color: '#C9A84C' }}>
              R&amp;J
            </span>
            <span className="text-[10px] font-medium tracking-widest uppercase ml-1.5" style={{ color: c.studioText }}>
              Design Studio
            </span>
          </div>
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Actions */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={toggle}
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            className="w-7 h-7 flex items-center justify-center transition-colors"
            style={{ color: c.studioMuted }}
            onMouseEnter={e => (e.currentTarget.style.color = '#C9A84C')}
            onMouseLeave={e => (e.currentTarget.style.color = c.studioMuted)}
          >
            {theme === 'dark' ? <SunToggleIcon /> : <MoonToggleIcon />}
          </button>

          <button
            onClick={() => setSaved(s => !s)}
            className="h-7 px-4 text-[9px] font-semibold tracking-[0.18em] uppercase rounded-sm transition-all"
            style={{ background: saved ? 'rgba(201,168,76,0.15)' : '#C9A84C', color: saved ? '#C9A84C' : '#0E0E10', border: saved ? '1px solid rgba(201,168,76,0.4)' : 'none' }}
          >
            {saved ? 'Saved ✓' : 'Save Design'}
          </button>
        </div>
      </nav>

      {/* ── Main content ── */}
      <div className="flex flex-1 min-h-0">

        {/* 3D Scene */}
        <div className="flex-1 relative min-w-0">
          <RoomScene
            curtainColor={curtainColor}
            wallColor={wallColor}
            floorColor={floorColor}
            fabric={fabric}
            curtainsOpen={curtainsOpen}
            isNight={isNight}
            lightIntensity={lightIntensity}
          />

          {/* Scene toolbar — right edge */}
          <div className="absolute right-4 top-1/2 -translate-y-1/2 flex flex-col gap-2">
            {([<ZoomInIcon key="zi" />, <ZoomOutIcon key="zo" />, <RotateIcon key="ro" />] as React.ReactNode[]).map((icon, i) => (
              <div
                key={i}
                className="w-8 h-8 rounded-full flex items-center justify-center transition-colors cursor-pointer"
                style={{ background: sceneToolbarBg, color: c.studioMuted, border: `1px solid ${c.border}` }}
                onMouseEnter={e => {
                  ;(e.currentTarget as HTMLDivElement).style.color = '#C9A84C'
                  ;(e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(201,168,76,0.4)'
                }}
                onMouseLeave={e => {
                  ;(e.currentTarget as HTMLDivElement).style.color = c.studioMuted
                  ;(e.currentTarget as HTMLDivElement).style.borderColor = c.border
                }}
              >
                {icon}
              </div>
            ))}
          </div>

          {/* Editorial overlay — bottom left */}
          <div className="absolute bottom-8 left-8 flex flex-col gap-3">
            <div>
              <p
                className="text-[9px] font-semibold tracking-[0.32em] uppercase mb-1.5"
                style={{ color: '#C9A84C' }}
              >
                {editorial.collection}
              </p>
              <h2
                className="text-4xl font-light tracking-tight leading-none"
                style={{ color: c.studioText, fontFamily: 'var(--font-cormorant, Georgia, serif)' }}
              >
                {editorial.name}
              </h2>
              <p
                className="text-[11px] leading-relaxed mt-2 max-w-[240px]"
                style={{ color: c.studioMuted }}
              >
                {editorial.desc}
              </p>
            </div>

            <div className="flex items-center gap-2.5">
              <button
                className="h-8 px-5 text-[9px] font-semibold tracking-[0.22em] uppercase border transition-all"
                style={{ borderColor: 'rgba(201,168,76,0.45)', color: '#C9A84C', background: 'rgba(14,14,16,0.65)' }}
                onMouseEnter={e => (e.currentTarget.style.background = 'rgba(201,168,76,0.1)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'rgba(14,14,16,0.65)')}
              >
                View Specs
              </button>
              <button
                className="w-8 h-8 flex items-center justify-center border transition-all"
                style={{ borderColor: c.border, color: c.studioMuted, background: 'rgba(14,14,16,0.65)' }}
                onMouseEnter={e => {
                  e.currentTarget.style.color = '#C9A84C'
                  e.currentTarget.style.borderColor = 'rgba(201,168,76,0.4)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.color = c.studioMuted
                  e.currentTarget.style.borderColor = c.border
                }}
              >
                <HeartIcon />
              </button>
            </div>
          </div>

          {/* Navigation controls bar — bottom center */}
          <div
            className="absolute bottom-5 left-1/2 -translate-x-1/2 flex items-center gap-0 select-none"
            style={{
              background: 'rgba(9,18,32,0.82)',
              border: '1px solid rgba(201,168,76,0.15)',
              borderRadius: '999px',
              backdropFilter: 'blur(8px)',
              padding: '8px 20px',
            }}
          >
            {/* Left drag → Rotate */}
            <div className="flex items-center gap-2">
              <svg width="14" height="18" viewBox="0 0 14 18" fill="none">
                <rect x="1" y="1" width="12" height="16" rx="6" stroke="rgba(201,168,76,0.6)" strokeWidth="1.2" />
                <line x1="7" y1="1" x2="7" y2="9" stroke="rgba(201,168,76,0.6)" strokeWidth="1.2" />
                <circle cx="4.5" cy="5" r="1.5" fill="rgba(201,168,76,0.8)" />
              </svg>
              <span className="text-[11px] font-medium tracking-wide" style={{ color: 'rgba(220,210,195,0.75)' }}>
                Drag to rotate
              </span>
            </div>

            <div className="w-px h-4 mx-4" style={{ background: 'rgba(201,168,76,0.15)' }} />

            {/* Scroll → Zoom */}
            <div className="flex items-center gap-2">
              <svg width="14" height="18" viewBox="0 0 14 18" fill="none">
                <rect x="1" y="1" width="12" height="16" rx="6" stroke="rgba(201,168,76,0.6)" strokeWidth="1.2" />
                <path d="M7 5v3M7 5l-1.5 2M7 5l1.5 2" stroke="rgba(201,168,76,0.8)" strokeWidth="1.1" strokeLinecap="round" />
              </svg>
              <span className="text-[11px] font-medium tracking-wide" style={{ color: 'rgba(220,210,195,0.75)' }}>
                Scroll to zoom
              </span>
            </div>

            <div className="w-px h-4 mx-4" style={{ background: 'rgba(201,168,76,0.15)' }} />

            {/* Right drag → Pan */}
            <div className="flex items-center gap-2">
              <svg width="14" height="18" viewBox="0 0 14 18" fill="none">
                <rect x="1" y="1" width="12" height="16" rx="6" stroke="rgba(201,168,76,0.6)" strokeWidth="1.2" />
                <line x1="7" y1="1" x2="7" y2="9" stroke="rgba(201,168,76,0.6)" strokeWidth="1.2" />
                <circle cx="9.5" cy="5" r="1.5" fill="rgba(201,168,76,0.8)" />
              </svg>
              <span className="text-[11px] font-medium tracking-wide" style={{ color: 'rgba(220,210,195,0.75)' }}>
                Right-drag to pan
              </span>
            </div>
          </div>

          {/* Expand tab — only visible when panel is collapsed */}
          {!panelOpen && (
            <button
              onClick={() => setPanelOpen(true)}
              title="Open configuration panel"
              className="absolute right-0 top-1/2 -translate-y-1/2 flex flex-col items-center justify-center gap-1.5 transition-all hover:opacity-100 opacity-70"
              style={{
                width: '28px',
                height: '80px',
                background: c.panelBg,
                border: `1px solid ${c.panelBorder}`,
                borderRight: 'none',
                borderRadius: '6px 0 0 6px',
              }}
            >
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#C9A84C" strokeWidth="2.5">
                <path d="m15 18-6-6 6-6" />
              </svg>
              <div
                className="text-[8px] font-semibold tracking-[0.2em] uppercase"
                style={{ color: '#C9A84C', writingMode: 'vertical-lr', transform: 'rotate(180deg)', letterSpacing: '0.15em' }}
              >
                Config
              </div>
            </button>
          )}
        </div>

        {/* Collapsible config panel */}
        <div
          className="shrink-0 overflow-hidden transition-all duration-300 ease-in-out"
          style={{ width: panelOpen ? '320px' : '0px' }}
        >
          <div style={{ width: '320px', height: '100%' }}>
            <ConfigPanel
              curtainColor={curtainColor}
              wallColor={wallColor}
              floorColor={floorColor}
              fabric={fabric}
              curtainsOpen={curtainsOpen}
              isNight={isNight}
              lightIntensity={lightIntensity}
              activeRoom={activeRoom}
              onCurtainColor={setCurtainColor}
              onWallColor={setWallColor}
              onFloorColor={setFloorColor}
              onFabric={setFabric}
              onToggleCurtains={() => setCurtainsOpen(p => !p)}
              onToggleNight={() => setIsNight(p => !p)}
              onLightIntensity={setLightIntensity}
              onRoomPreset={handleRoomPreset}
              onViewInRoom={() => setShowModal(true)}
              onCollapse={() => setPanelOpen(false)}
            />
          </div>
        </div>
      </div>

      {/* Consultation modal */}
      {showModal && (
        <ConsultationModal
          curtainColor={curtainColor}
          fabric={fabric}
          activeRoom={activeRoom}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  )
}
