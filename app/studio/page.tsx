'use client'

import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import ConfigPanel, { type FabricType, type RoomPreset, ROOM_PRESETS } from '../components/ConfigPanel'
import { resolveStudioMode, setStoredOverride } from '@/app/lib/studioCapability'

// ─── Loading fallback — standalone component so hooks are legal ───────────────

function StudioLoadingFallback() {
  return (
    <div className="flex-1 flex items-center justify-center" style={{ background: '#111113' }}>
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

const MobileStudio = dynamic(() => import('../components/mobile-studio/MobileStudio'), {
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
          background: '#181818',
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

// ─── Entry Gate ──────────────────────────────────────────────────────────────

type StudioIntent = 'windows' | 'doors' | 'rooms'

function WindowIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="5" y="5" width="30" height="30" rx="2" />
      <line x1="20" y1="5" x2="20" y2="35" />
      <line x1="5" y1="20" x2="35" y2="20" />
      <line x1="8" y1="5" x2="8" y2="35" strokeDasharray="2 3" strokeWidth="0.8" stroke="currentColor" opacity="0.5" />
      <line x1="32" y1="5" x2="32" y2="35" strokeDasharray="2 3" strokeWidth="0.8" stroke="currentColor" opacity="0.5" />
    </svg>
  )
}

function DoorIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="8" y="3" width="24" height="34" rx="1.5" />
      <circle cx="26" cy="20" r="1.5" fill="currentColor" stroke="none" />
      <line x1="14" y1="3" x2="14" y2="37" strokeDasharray="2 3" strokeWidth="0.9" opacity="0.5" />
      <line x1="26" y1="3" x2="26" y2="37" strokeDasharray="2 3" strokeWidth="0.9" opacity="0.5" />
    </svg>
  )
}

function RoomsIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4"  y="4"  width="14" height="14" rx="1.5" />
      <rect x="22" y="4"  width="14" height="14" rx="1.5" />
      <rect x="4"  y="22" width="14" height="14" rx="1.5" />
      <rect x="22" y="22" width="14" height="14" rx="1.5" />
    </svg>
  )
}

const INTENT_CARDS: Array<{
  id: StudioIntent
  icon: React.ReactNode
  title: string
  sub: string
  desc: string
}> = [
  {
    id: 'windows',
    icon: <WindowIcon />,
    title: 'Windows',
    sub: 'Curtains & Draping',
    desc: 'Visualise floor-to-ceiling curtains, sheers, and drapes on your windows in full 3D.',
  },
  {
    id: 'doors',
    icon: <DoorIcon />,
    title: 'Doors',
    sub: 'Door Treatments',
    desc: 'Design elegant door panels and passage curtains — a fixture in every well-dressed room.',
  },
  {
    id: 'rooms',
    icon: <RoomsIcon />,
    title: 'Full Room',
    sub: 'Room by Room',
    desc: 'Take a complete design journey — style each room of your home with its own palette.',
  },
]

function EntryGate({ onSelect }: { onSelect: (intent: StudioIntent) => void }) {
  const [leaving, setLeaving] = useState(false)
  const [hovered, setHovered] = useState<StudioIntent | null>(null)

  const pick = (intent: StudioIntent) => {
    setLeaving(true)
    setTimeout(() => onSelect(intent), 380)
  }

  return (
    <div
      className="fixed inset-0 z-[300] flex flex-col items-center justify-center px-6"
      style={{
        background: 'radial-gradient(ellipse at 50% 30%, #0D1F38 0%, #030B18 60%)',
        opacity: leaving ? 0 : 1,
        transform: leaving ? 'scale(1.015)' : 'scale(1)',
        transition: 'opacity 0.38s ease, transform 0.38s ease',
      }}
    >
      {/* Subtle grid lines */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(rgba(201,168,76,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(201,168,76,0.04) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      {/* Logo */}
      <div className="flex flex-col items-center mb-12 relative">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/assets/r_j_interiors_final_premium_logo.png"
          alt=""
          style={{ width: 56, height: 56, borderRadius: '50%', outline: '1px solid rgba(201,168,76,0.35)', outlineOffset: 3, marginBottom: 18 }}
        />
        <p style={{ fontFamily: 'Georgia, serif', fontSize: 26, color: '#E8E0D0', fontWeight: 400, marginBottom: 8, letterSpacing: '-0.01em' }}>
          What would you like to design?
        </p>
        <p style={{ fontSize: 13, color: '#4A6078', letterSpacing: '0.04em', textAlign: 'center', maxWidth: 340 }}>
          Choose your focus — you can switch at any time inside the studio.
        </p>
      </div>

      {/* Cards */}
      <div
        className="relative flex gap-5 w-full"
        style={{ maxWidth: 860, flexWrap: 'wrap', justifyContent: 'center' }}
      >
        {INTENT_CARDS.map((card) => {
          const isHov = hovered === card.id
          return (
            <button
              key={card.id}
              onClick={() => pick(card.id)}
              onMouseEnter={() => setHovered(card.id)}
              onMouseLeave={() => setHovered(null)}
              style={{
                flex: '1 1 240px',
                maxWidth: 260,
                minWidth: 220,
                padding: '36px 28px 32px',
                background: isHov ? 'rgba(201,168,76,0.07)' : 'rgba(255,255,255,0.025)',
                border: `1px solid ${isHov ? 'rgba(201,168,76,0.45)' : 'rgba(201,168,76,0.12)'}`,
                borderRadius: 6,
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'background 0.2s, border-color 0.2s, transform 0.2s',
                transform: isHov ? 'translateY(-4px)' : 'translateY(0)',
                boxShadow: isHov ? '0 16px 48px rgba(0,0,0,0.45)' : '0 4px 16px rgba(0,0,0,0.25)',
              }}
            >
              {/* Icon */}
              <div
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: 4,
                  background: isHov ? 'rgba(201,168,76,0.12)' : 'rgba(201,168,76,0.06)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: isHov ? '#C9A84C' : '#5A7088',
                  marginBottom: 22,
                  transition: 'background 0.2s, color 0.2s',
                }}
              >
                {card.icon}
              </div>

              {/* Label */}
              <p style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.3em', textTransform: 'uppercase', color: '#C9A84C', marginBottom: 8 }}>
                {card.sub}
              </p>

              {/* Title */}
              <h3
                style={{
                  fontFamily: 'Georgia, serif',
                  fontSize: 22,
                  color: '#E8E0D0',
                  fontWeight: 400,
                  marginBottom: 12,
                  lineHeight: 1.15,
                }}
              >
                {card.title}
              </h3>

              {/* Desc */}
              <p style={{ fontSize: 12, color: '#4A6078', lineHeight: 1.7, marginBottom: 24 }}>
                {card.desc}
              </p>

              {/* CTA */}
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 600,
                  letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                  color: isHov ? '#C9A84C' : '#3A5068',
                  transition: 'color 0.2s',
                }}
              >
                Begin →
              </span>
            </button>
          )
        })}
      </div>

      {/* Footer hint */}
      <p style={{ fontSize: 10, color: '#243040', marginTop: 40, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
        R&amp;J Interiors · Design Studio
      </p>
    </div>
  )
}

// ─── Room Picker (second step for "rooms" intent) ─────────────────────────────

function RoomPicker({ onSelect, onBack }: { onSelect: (preset: RoomPreset) => void; onBack: () => void }) {
  const [leaving, setLeaving] = useState(false)
  const [hovered, setHovered] = useState<string | null>(null)

  const pick = (preset: RoomPreset) => {
    setLeaving(true)
    setTimeout(() => onSelect(preset), 350)
  }

  const ROOM_ICONS: Record<string, React.ReactNode> = {
    'Sitting Room': (
      <svg width="28" height="28" viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
        <rect x="4" y="16" width="32" height="16" rx="3" />
        <rect x="8" y="12" width="24" height="6" rx="2" />
        <line x1="10" y1="32" x2="10" y2="37" />
        <line x1="30" y1="32" x2="30" y2="37" />
      </svg>
    ),
    'Bedroom': (
      <svg width="28" height="28" viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
        <rect x="4" y="18" width="32" height="14" rx="2" />
        <rect x="4" y="14" width="32" height="5" rx="1" />
        <rect x="6" y="18" width="10" height="6" rx="1" opacity="0.6" />
        <rect x="24" y="18" width="10" height="6" rx="1" opacity="0.6" />
        <line x1="6" y1="32" x2="6" y2="37" />
        <line x1="34" y1="32" x2="34" y2="37" />
      </svg>
    ),
    'Dining Room': (
      <svg width="28" height="28" viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
        <ellipse cx="20" cy="20" rx="14" ry="8" />
        <line x1="20" y1="12" x2="20" y2="6" />
        <line x1="12" y1="16" x2="8" y2="11" />
        <line x1="28" y1="16" x2="32" y2="11" />
        <line x1="20" y1="28" x2="20" y2="34" />
        <line x1="12" y1="24" x2="8" y2="29" />
        <line x1="28" y1="24" x2="32" y2="29" />
      </svg>
    ),
    'Home Office': (
      <svg width="28" height="28" viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
        <rect x="6" y="10" width="28" height="20" rx="2" />
        <rect x="10" y="14" width="20" height="12" rx="1" opacity="0.6" />
        <line x1="14" y1="30" x2="14" y2="36" />
        <line x1="26" y1="30" x2="26" y2="36" />
        <line x1="10" y1="36" x2="30" y2="36" />
      </svg>
    ),
  }

  const ROOM_COLORS: Record<string, string> = {
    'Sitting Room': '#D4B896',
    'Bedroom': '#E0B8B4',
    'Dining Room': '#4A7A5C',
    'Home Office': '#1E3A5F',
  }

  return (
    <div
      className="fixed inset-0 z-[300] flex flex-col items-center justify-center px-6"
      style={{
        background: 'radial-gradient(ellipse at 50% 30%, #0D1F38 0%, #030B18 60%)',
        opacity: leaving ? 0 : 1,
        transform: leaving ? 'scale(1.015)' : 'scale(1)',
        transition: 'opacity 0.35s ease, transform 0.35s ease',
      }}
    >
      {/* Subtle grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(rgba(201,168,76,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(201,168,76,0.04) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      {/* Back */}
      <button
        onClick={onBack}
        className="absolute top-6 left-6 flex items-center gap-1.5 transition-opacity opacity-50 hover:opacity-100"
        style={{ color: '#A09080', fontSize: 10, fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase', background: 'none', border: 'none', cursor: 'pointer' }}
      >
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="m15 18-6-6 6-6" />
        </svg>
        Back
      </button>

      {/* Heading */}
      <div className="flex flex-col items-center mb-12 relative">
        <p style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.35em', textTransform: 'uppercase', color: '#C9A84C', marginBottom: 14 }}>
          Full Room Design
        </p>
        <p style={{ fontFamily: 'Georgia, serif', fontSize: 26, color: '#E8E0D0', fontWeight: 400, marginBottom: 8 }}>
          Choose a room to begin
        </p>
        <p style={{ fontSize: 13, color: '#4A6078', letterSpacing: '0.04em' }}>
          Each room loads its signature palette and fabric.
        </p>
      </div>

      {/* Room cards */}
      <div className="relative flex gap-4 flex-wrap justify-center" style={{ maxWidth: 780 }}>
        {ROOM_PRESETS.map((preset) => {
          const isHov = hovered === preset.label
          const accentColor = ROOM_COLORS[preset.label] ?? '#C9A84C'
          return (
            <button
              key={preset.label}
              onClick={() => pick(preset)}
              onMouseEnter={() => setHovered(preset.label)}
              onMouseLeave={() => setHovered(null)}
              style={{
                flex: '1 1 160px',
                maxWidth: 180,
                minWidth: 150,
                padding: '28px 20px 24px',
                background: isHov ? 'rgba(201,168,76,0.06)' : 'rgba(255,255,255,0.02)',
                border: `1px solid ${isHov ? 'rgba(201,168,76,0.4)' : 'rgba(201,168,76,0.1)'}`,
                borderTop: `2px solid ${isHov ? accentColor : 'transparent'}`,
                borderRadius: 4,
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.2s',
                transform: isHov ? 'translateY(-3px)' : 'translateY(0)',
              }}
            >
              {/* Colour swatch */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
                <div
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: 3,
                    background: accentColor,
                    boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.12)',
                    flexShrink: 0,
                  }}
                />
                <div style={{ color: isHov ? '#C9A84C' : '#4A6078', transition: 'color 0.2s' }}>
                  {ROOM_ICONS[preset.label]}
                </div>
              </div>

              <p style={{ fontFamily: 'Georgia, serif', fontSize: 17, color: '#E8E0D0', fontWeight: 400, marginBottom: 6 }}>
                {preset.label}
              </p>
              <p style={{ fontSize: 10, color: '#3A5068', textTransform: 'capitalize', letterSpacing: '0.05em' }}>
                {preset.fabric} · {preset.wallColor === '#C8D8E4' ? 'Cool Blue' : preset.wallColor === '#B2BAC2' ? 'Cool Gray' : preset.wallColor === '#D4C0A0' ? 'Sandy Beige' : 'Soft White'}
              </p>
            </button>
          )
        })}
      </div>
    </div>
  )
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function Home() {
  const c = {
    studioMuted:   '#5A7088',
    studioText:    '#E8E0D0',
    studioDivider: 'rgba(201,168,76,0.1)',
    border:        'rgba(255,255,255,0.07)',
    panelBg:       '#181818',
    panelBorder:   'rgba(201,168,76,0.1)',
  }

  // ── Capability routing — runs client-side after mount only ──────────────
  // 'detecting' is the initial SSR-safe state; we resolve it in the effect.
  const [studioMode, setStudioMode] = useState<'detecting' | 'mobile' | '3d'>('detecting')
  useEffect(() => {
    setStudioMode(resolveStudioMode())
  }, [])

  const [intent, setIntent]             = useState<StudioIntent | null>(null)
  const [showRoomPicker, setShowRoomPicker] = useState(false)

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

  const handleIntentSelect = (chosen: StudioIntent) => {
    if (chosen === 'rooms') {
      setShowRoomPicker(true)
    } else if (chosen === 'doors') {
      setActiveRoom('Door Treatment')
      setIntent(chosen)
    } else {
      setIntent(chosen)
    }
  }

  const handleRoomPickerSelect = (preset: RoomPreset) => {
    setCurtainColor(preset.curtainColor)
    setWallColor(preset.wallColor)
    setFloorColor(preset.floorColor)
    setFabric(preset.fabric)
    setActiveRoom(preset.label)
    setShowRoomPicker(false)
    setIntent('rooms')
  }

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

  const sceneToolbarBg = 'rgba(14,14,16,0.75)'

  // Route based on detected capability (or stored override)
  if (studioMode === 'detecting') return <StudioLoadingFallback />
  if (studioMode === 'mobile') return (
    <MobileStudio
      onSwitchTo3D={() => { setStoredOverride('3d'); setStudioMode('3d') }}
    />
  )

  if (intent === null && !showRoomPicker) {
    return <EntryGate onSelect={handleIntentSelect} />
  }

  if (showRoomPicker) {
    return (
      <RoomPicker
        onSelect={handleRoomPickerSelect}
        onBack={() => setShowRoomPicker(false)}
      />
    )
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden" style={{ background: '#111113' }}>

      {/* ── Navbar ── */}
      <nav
        className="h-[52px] shrink-0 flex items-center px-5 gap-4"
        style={{ background: '#111113', borderBottom: '1px solid rgba(201,168,76,0.18)' }}
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
          {/* Intent badge — click to return to entry gate */}
          <button
            onClick={() => setIntent(null)}
            className="h-6 px-3 flex items-center gap-1.5 transition-opacity opacity-60 hover:opacity-100"
            style={{
              background: 'rgba(201,168,76,0.08)',
              border: '1px solid rgba(201,168,76,0.2)',
              borderRadius: 999,
              color: '#C9A84C',
              fontSize: 9,
              fontWeight: 600,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              cursor: 'pointer',
            }}
          >
            {intent === 'windows' ? 'Windows' : intent === 'doors' ? 'Doors' : activeRoom || 'Room'}
            <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" />
            </svg>
          </button>

          <button
            onClick={() => setSaved(s => !s)}
            className="h-7 px-4 text-[9px] font-semibold tracking-[0.18em] uppercase rounded-sm transition-all"
            style={{ background: saved ? 'rgba(201,168,76,0.15)' : '#C9A84C', color: saved ? '#C9A84C' : '#0E0E10', border: saved ? '1px solid rgba(201,168,76,0.4)' : 'none' }}
          >
            {saved ? 'Saved ✓' : 'Save Design'}
          </button>

          {/* Escape hatch → mobile photo tool */}
          <button
            onClick={() => { setStoredOverride('mobile'); setStudioMode('mobile') }}
            className="h-7 px-3 text-[9px] font-medium tracking-[0.15em] uppercase rounded-sm opacity-50 hover:opacity-80 transition-opacity"
            style={{ background: 'transparent', border: '1px solid rgba(201,168,76,0.25)', color: '#C9A84C', cursor: 'pointer' }}
            title="Switch to the photo matching tool"
          >
            Photo tool
          </button>
        </div>
      </nav>

      {/* ── Main content ── */}
      <div className="flex flex-1 min-h-0">

        {/* 3D Scene */}
        <div className="flex-1 relative min-w-0">
          {/* Vignette overlay */}
          <div className="absolute inset-0 z-10 pointer-events-none" style={{ background: 'radial-gradient(ellipse at 50% 50%, transparent 55%, rgba(0,0,0,0.45) 100%)' }} />
          <RoomScene
            curtainColor={curtainColor}
            wallColor={wallColor}
            floorColor={floorColor}
            fabric={fabric}
            curtainsOpen={curtainsOpen}
            isNight={isNight}
            lightIntensity={lightIntensity}
            mode={intent === 'doors' ? 'doors' : 'windows'}
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
