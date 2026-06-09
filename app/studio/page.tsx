'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import ConfigPanel, { type FabricType } from '../components/ConfigPanel'
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
  '#7A2F3A': { name: 'Burgundy Velour', collection: 'REGAL · NO. 10',      desc: 'Deep claret with regal weight. The classic curtain, perfected.' },
}

// ─── Inline SVG helpers ───────────────────────────────────────────────────────

function SearchIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
    </svg>
  )
}
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

  const editorial = EDITORIAL[curtainColor] ?? {
    name: 'Custom Tone',
    collection: 'BESPOKE · NO. 00',
    desc: 'A unique selection from your personal palette. Tailored for your vision.',
  }

  const navLinks = ['Collections', 'Projects', 'Account']

  const sceneToolbarBg = c.isDark ? 'rgba(14,14,16,0.75)' : 'rgba(250,250,248,0.88)'

  return (
    <div className="flex flex-col h-screen overflow-hidden" style={{ background: c.studioBg }}>

      {/* ── Navbar ── */}
      <nav
        className="h-[52px] shrink-0 flex items-center px-5 gap-5"
        style={{ background: c.studioNav, borderBottom: `1px solid ${c.studioNavBorder}` }}
      >
        {/* Logo + Brand */}
        <div className="flex items-center gap-2.5 shrink-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/assets/r_j_interiors_final_premium_logo.png"
            alt="R&J Interiors"
            className="w-8 h-8 rounded-full object-cover"
            style={{ outline: '1px solid rgba(201,168,76,0.4)', outlineOffset: '1px' }}
          />
          <span className="text-sm font-medium tracking-wide" style={{ color: c.studioText }}>
            R&amp;J Interiors
          </span>
        </div>

        {/* Divider */}
        <div className="w-px h-4 shrink-0" style={{ background: c.studioDivider }} />

        {/* Nav links */}
        <div className="flex items-center gap-0.5 text-[10px] font-semibold tracking-[0.18em] uppercase">
          <button
            className="px-3 py-1.5"
            style={{ color: '#C9A84C', borderBottom: '1px solid #C9A84C' }}
          >
            Studio
          </button>
          {navLinks.map(link => (
            <button
              key={link}
              className="px-3 py-1.5 transition-colors"
              style={{ color: c.studioMuted }}
              onMouseEnter={e => (e.currentTarget.style.color = '#A09080')}
              onMouseLeave={e => (e.currentTarget.style.color = c.studioMuted)}
            >
              {link}
            </button>
          ))}
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Actions */}
        <div className="flex items-center gap-2.5">
          <button
            className="w-7 h-7 flex items-center justify-center transition-colors"
            style={{ color: c.studioMuted }}
            onMouseEnter={e => (e.currentTarget.style.color = '#A09080')}
            onMouseLeave={e => (e.currentTarget.style.color = c.studioMuted)}
          >
            <SearchIcon />
          </button>

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
            className="h-7 px-3 text-[9px] font-semibold tracking-[0.18em] uppercase rounded-sm border transition-all"
            style={{ borderColor: c.border, color: c.studioMuted }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = '#C9A84C'
              e.currentTarget.style.color = '#C9A84C'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = c.border
              e.currentTarget.style.color = c.studioMuted
            }}
          >
            Share
          </button>

          <button
            onClick={() => setSaved(s => !s)}
            className="h-7 px-3 text-[9px] font-semibold tracking-[0.18em] uppercase rounded-sm transition-all"
            style={{ background: '#C9A84C', color: '#0E0E10' }}
            onMouseEnter={e => (e.currentTarget.style.background = '#E8C87A')}
            onMouseLeave={e => (e.currentTarget.style.background = '#C9A84C')}
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

          {/* Drag hint */}
          <p
            className="absolute bottom-6 right-16 text-[9px] tracking-[0.28em] uppercase select-none"
            style={{ color: c.border }}
          >
            Drag · Scroll to zoom
          </p>
        </div>

        {/* Config panel */}
        <ConfigPanel
          curtainColor={curtainColor}
          wallColor={wallColor}
          floorColor={floorColor}
          fabric={fabric}
          curtainsOpen={curtainsOpen}
          isNight={isNight}
          lightIntensity={lightIntensity}
          onCurtainColor={setCurtainColor}
          onWallColor={setWallColor}
          onFloorColor={setFloorColor}
          onFabric={setFabric}
          onToggleCurtains={() => setCurtainsOpen(p => !p)}
          onToggleNight={() => setIsNight(p => !p)}
          onLightIntensity={setLightIntensity}
        />
      </div>
    </div>
  )
}
