'use client'

import { useThemeColors } from './ThemeProvider'

export type FabricType = 'sheer' | 'linen' | 'velvet' | 'cotton'

// ─── Room presets ─────────────────────────────────────────────────────────────

export type RoomPreset = {
  label:        string
  curtainColor: string
  wallColor:    string
  floorColor:   string
  fabric:       FabricType
}

export const ROOM_PRESETS: RoomPreset[] = [
  { label: 'Sitting Room', curtainColor: '#D4B896', wallColor: '#F8F4EF', floorColor: '#D4A86A', fabric: 'linen'  },
  { label: 'Bedroom',      curtainColor: '#E0B8B4', wallColor: '#C8D8E4', floorColor: '#B05830', fabric: 'velvet' },
  { label: 'Dining Room',  curtainColor: '#4A7A5C', wallColor: '#D4C0A0', floorColor: '#7A4A24', fabric: 'cotton' },
  { label: 'Home Office',  curtainColor: '#1E3A5F', wallColor: '#B2BAC2', floorColor: '#B8AAA0', fabric: 'linen'  },
]

// ─── Colour data ─────────────────────────────────────────────────────────────

const CURTAIN_COLORS = [
  { name: 'Ivory',      value: '#F0EBE0' },
  { name: 'Cream',      value: '#E8DCC8' },
  { name: 'Warm Beige', value: '#D4B896' },
  { name: 'Honey',      value: '#C8A070' },
  { name: 'Dusty Rose', value: '#C49890' },
  { name: 'Blush',      value: '#E0B8B4' },
  { name: 'Sage',       value: '#8FAF8C' },
  { name: 'Hunter',     value: '#4A7A5C' },
  { name: 'Navy',       value: '#1E3A5F' },
  { name: 'Denim',      value: '#3A5F8A' },
  { name: 'Charcoal',   value: '#3C3C3C' },
  { name: 'Slate',      value: '#6A7A84' },
  { name: 'Terracotta', value: '#C07455' },
  { name: 'Burgundy',   value: '#7A2F3A' },
]

const WALL_COLORS = [
  { name: 'Soft White',  value: '#F8F4EF' },
  { name: 'Warm Gray',   value: '#C4BBB2' },
  { name: 'Cool Gray',   value: '#B2BAC2' },
  { name: 'Pale Blue',   value: '#C8D8E4' },
  { name: 'Sky',         value: '#A4C4D8' },
  { name: 'Sage',        value: '#C4D0BC' },
  { name: 'Moss',        value: '#8FA88C' },
  { name: 'Blush',       value: '#E4CAC0' },
  { name: 'Rose',        value: '#D4A0A0' },
  { name: 'Sand',        value: '#D4C0A0' },
  { name: 'Terracotta',  value: '#C4845C' },
  { name: 'Slate',       value: '#8A9BA8' },
]

const FLOOR_COLORS = [
  { name: 'Oak',       value: '#D4A86A' },
  { name: 'Pine',      value: '#E8D4A0' },
  { name: 'Maple',     value: '#E0C888' },
  { name: 'Cherry',    value: '#B05830' },
  { name: 'Walnut',    value: '#7A4A24' },
  { name: 'Ebony',     value: '#2C1808' },
  { name: 'Ash',       value: '#B8AAA0' },
  { name: 'Whitewash', value: '#EDE8E0' },
]

const FOLD_LABEL: Record<FabricType, string> = {
  linen:  'Wave Fold',
  velvet: 'Pinch Pleat',
  cotton: 'Eyelet',
  sheer:  'Sheer Panel',
}
const FABRIC_ORDER: FabricType[] = ['linen', 'velvet', 'cotton', 'sheer']

// ─── Icons ────────────────────────────────────────────────────────────────────

function FoldIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#C9A84C" strokeWidth="1.5">
      <path d="M3 5c2 2 4 2 6 0s4-2 6 0 4 2 6 0" />
      <path d="M3 12c2 2 4 2 6 0s4-2 6 0 4 2 6 0" />
      <path d="M3 19c2 2 4 2 6 0s4-2 6 0 4 2 6 0" />
    </svg>
  )
}
function RodIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#C9A84C" strokeWidth="1.5">
      <line x1="3" y1="12" x2="21" y2="12" />
      <circle cx="12" cy="12" r="3" />
      <circle cx="5" cy="12" r="2" />
      <circle cx="19" cy="12" r="2" />
    </svg>
  )
}
function CurtainIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#C9A84C" strokeWidth="1.5">
      <rect x="2" y="3" width="20" height="18" rx="1" />
      <path d="M12 3v18" />
    </svg>
  )
}
function SunIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="5" />
      <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
    </svg>
  )
}
function MoonIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  )
}
function ChevronRightIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <path d="m9 18 6-6-6-6" />
    </svg>
  )
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function SectionLabel({ children, count }: { children: React.ReactNode; count?: string }) {
  const c = useThemeColors()
  return (
    <div className="flex items-center justify-between mb-3">
      <h2 className="text-[11px] font-semibold tracking-[0.25em] uppercase" style={{ color: c.panelMuted }}>
        {children}
      </h2>
      {count && <span className="text-[11px]" style={{ color: c.panelSubtle }}>{count}</span>}
    </div>
  )
}

function Divider() {
  const c = useThemeColors()
  return <div className="h-px" style={{ background: c.panelDivider }} />
}

// ─── Props ────────────────────────────────────────────────────────────────────

interface ConfigPanelProps {
  curtainColor: string
  wallColor: string
  floorColor: string
  fabric: FabricType
  curtainsOpen: boolean
  isNight: boolean
  lightIntensity: number
  activeRoom: string
  onCurtainColor: (c: string) => void
  onWallColor: (c: string) => void
  onFloorColor: (c: string) => void
  onFabric: (f: FabricType) => void
  onToggleCurtains: () => void
  onToggleNight: () => void
  onLightIntensity: (v: number) => void
  onRoomPreset: (preset: RoomPreset) => void
  onViewInRoom: () => void
  onCollapse: () => void
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function ConfigPanel({
  curtainColor, wallColor, floorColor, fabric,
  curtainsOpen, isNight, lightIntensity, activeRoom,
  onCurtainColor, onWallColor, onFloorColor, onFabric,
  onToggleCurtains, onToggleNight, onLightIntensity,
  onRoomPreset, onViewInRoom, onCollapse,
}: ConfigPanelProps) {

  const c = useThemeColors()

  const cycleFabric = () => {
    const i = FABRIC_ORDER.indexOf(fabric)
    onFabric(FABRIC_ORDER[(i + 1) % FABRIC_ORDER.length])
  }

  return (
    <aside
      className="w-80 h-full flex flex-col overflow-hidden shrink-0"
      style={{ background: c.panelBg, borderLeft: `1px solid ${c.panelBorder}` }}
    >
      {/* ── Room preset tabs ── */}
      <div className="px-4 pt-4 pb-3 shrink-0" style={{ borderBottom: `1px solid ${c.panelBorder}` }}>
        <div className="flex items-center justify-between mb-3">
          <p className="text-[11px] font-semibold tracking-[0.25em] uppercase" style={{ color: c.panelMuted }}>
            Room
          </p>
          <button
            onClick={onCollapse}
            title="Collapse panel"
            className="w-6 h-6 flex items-center justify-center rounded transition-colors"
            style={{ color: c.panelSubtle }}
            onMouseEnter={e => (e.currentTarget.style.color = '#C9A84C')}
            onMouseLeave={e => (e.currentTarget.style.color = c.panelSubtle)}
          >
            <ChevronRightIcon />
          </button>
        </div>
        <div className="grid grid-cols-2 gap-1.5">
          {ROOM_PRESETS.map(preset => {
            const active = activeRoom === preset.label
            return (
              <button
                key={preset.label}
                onClick={() => onRoomPreset(preset)}
                className="py-2 px-3 rounded text-xs font-medium tracking-wide transition-all duration-150 text-left"
                style={{
                  background:  active ? 'rgba(201,168,76,0.12)' : c.panelItemBg,
                  color:       active ? '#C9A84C' : c.panelItemSub,
                  border:      `1px solid ${active ? 'rgba(201,168,76,0.45)' : 'transparent'}`,
                }}
                onMouseEnter={e => {
                  if (!active) {
                    e.currentTarget.style.background = c.panelItemHover
                    e.currentTarget.style.color = c.panelItemText
                  }
                }}
                onMouseLeave={e => {
                  if (!active) {
                    e.currentTarget.style.background = c.panelItemBg
                    e.currentTarget.style.color = c.panelItemSub
                  }
                }}
              >
                {preset.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* ── Header ── */}
      <div className="px-6 pt-5 pb-4 shrink-0">
        <h1
          className="text-2xl font-light tracking-wide"
          style={{ color: c.panelText, fontFamily: 'var(--font-cormorant, Georgia, serif)' }}
        >
          Customise
        </h1>
        <p className="text-sm mt-1 leading-relaxed" style={{ color: c.panelSubtle }}>
          Refine your window treatment{activeRoom ? ` for ${activeRoom}` : ''}.
        </p>
        <div className="mt-4"><Divider /></div>
      </div>

      {/* ── Scrollable body ── */}
      <div className="flex-1 overflow-y-auto dark-scroll px-6 pb-4 space-y-5">

        {/* TEXTILE PALETTE */}
        <section>
          <SectionLabel count={`${CURTAIN_COLORS.length} colours`}>
            Textile Palette
          </SectionLabel>
          <div className="grid grid-cols-7 gap-2">
            {CURTAIN_COLORS.map(({ name, value }) => {
              const active = curtainColor === value
              return (
                <button key={value} title={name} onClick={() => onCurtainColor(value)} className="relative group">
                  <div
                    className="w-full aspect-square rounded-md transition-all duration-150 group-hover:scale-105"
                    style={{
                      backgroundColor: value,
                      outline: active ? '2px solid #C9A84C' : '2px solid transparent',
                      outlineOffset: '2px',
                      boxShadow: active ? '0 0 10px rgba(201,168,76,0.35)' : 'none',
                    }}
                  />
                  {active && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="w-1 h-1 rounded-full bg-white/70" />
                    </div>
                  )}
                </button>
              )
            })}
          </div>
        </section>

        <Divider />

        {/* FINISHING DETAILS */}
        <section>
          <SectionLabel>Finishing Details</SectionLabel>
          <div className="space-y-1.5">
            <button
              onClick={cycleFabric}
              className="w-full flex items-center gap-3 px-3 py-3 rounded-md transition-colors"
              style={{ background: c.panelItemBg }}
              onMouseEnter={e => (e.currentTarget.style.background = c.panelItemHover)}
              onMouseLeave={e => (e.currentTarget.style.background = c.panelItemBg)}
            >
              <div className="w-9 h-9 rounded-sm flex items-center justify-center shrink-0" style={{ background: c.panelIconBg }}>
                <FoldIcon />
              </div>
              <div className="flex-1 text-left">
                <div className="text-sm font-medium" style={{ color: c.panelItemText }}>{FOLD_LABEL[fabric]}</div>
                <div className="text-[11px] mt-0.5" style={{ color: c.panelItemSub }}>Draping style · tap to change</div>
              </div>
              <span style={{ color: c.panelSubtle }}><ChevronRightIcon /></span>
            </button>

            <div className="flex items-center gap-3 px-3 py-3 rounded-md" style={{ background: c.panelItemBg }}>
              <div className="w-9 h-9 rounded-sm flex items-center justify-center shrink-0" style={{ background: c.panelIconBg }}>
                <RodIcon />
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium" style={{ color: c.panelItemText }}>Brushed Brass</div>
                <div className="text-[11px] mt-0.5" style={{ color: c.panelItemSub }}>Hardware finish</div>
              </div>
            </div>

            <button
              onClick={onToggleCurtains}
              className="w-full flex items-center gap-3 px-3 py-3 rounded-md transition-colors"
              style={{ background: c.panelItemBg }}
              onMouseEnter={e => (e.currentTarget.style.background = c.panelItemHover)}
              onMouseLeave={e => (e.currentTarget.style.background = c.panelItemBg)}
            >
              <div className="w-9 h-9 rounded-sm flex items-center justify-center shrink-0" style={{ background: c.panelIconBg }}>
                <CurtainIcon />
              </div>
              <div className="flex-1 text-left">
                <div className="text-sm font-medium" style={{ color: c.panelItemText }}>{curtainsOpen ? 'Open' : 'Closed'}</div>
                <div className="text-[11px] mt-0.5" style={{ color: c.panelItemSub }}>Curtain position</div>
              </div>
              <div
                className="w-9 h-5 rounded-full flex items-center px-0.5 transition-colors duration-200 shrink-0"
                style={{ background: curtainsOpen ? '#C9A84C' : c.panelIconBg }}
              >
                <div
                  className="w-4 h-4 rounded-full bg-white shadow-sm transition-transform duration-200"
                  style={{ transform: curtainsOpen ? 'translateX(16px)' : 'translateX(0)' }}
                />
              </div>
            </button>
          </div>
        </section>

        <Divider />

        {/* SCENE AMBIENCE */}
        <section>
          <SectionLabel>Scene Ambience</SectionLabel>
          <div className="space-y-2 mb-4">
            <div className="flex items-center justify-between">
              <span className="text-[11px] tracking-[0.2em] uppercase" style={{ color: c.panelItemSub }}>Light Intensity</span>
              <span className="text-[11px] font-medium tabular-nums" style={{ color: '#C9A84C' }}>{lightIntensity}%</span>
            </div>
            <input type="range" min={10} max={100} value={lightIntensity} onChange={e => onLightIntensity(Number(e.target.value))} className="gold-slider" />
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => isNight && onToggleNight()}
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-md text-[11px] font-semibold tracking-[0.15em] uppercase transition-all duration-200"
              style={{ background: !isNight ? '#C9A84C' : c.panelItemBg, color: !isNight ? '#0E0E10' : c.panelItemSub }}
            >
              <SunIcon />Day
            </button>
            <button
              onClick={() => !isNight && onToggleNight()}
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-md text-[11px] font-semibold tracking-[0.15em] uppercase transition-all duration-200"
              style={{ background: isNight ? '#C9A84C' : c.panelItemBg, color: isNight ? '#0E0E10' : c.panelItemSub }}
            >
              <MoonIcon />Dusk
            </button>
          </div>
        </section>

        <Divider />

        {/* ENVIRONMENT */}
        <section>
          <SectionLabel>Environment</SectionLabel>
          <div className="space-y-4">
            <div>
              <p className="text-[11px] tracking-[0.2em] uppercase mb-2" style={{ color: c.panelSubtle }}>Wall</p>
              <div className="flex flex-wrap gap-2">
                {WALL_COLORS.map(({ name, value }) => (
                  <button
                    key={value} title={name} onClick={() => onWallColor(value)}
                    className="w-7 h-7 rounded-sm transition-all duration-150 hover:scale-110"
                    style={{ backgroundColor: value, outline: wallColor === value ? '2px solid #C9A84C' : '2px solid transparent', outlineOffset: '2px' }}
                  />
                ))}
              </div>
            </div>
            <div>
              <p className="text-[11px] tracking-[0.2em] uppercase mb-2" style={{ color: c.panelSubtle }}>Floor</p>
              <div className="flex flex-wrap gap-2">
                {FLOOR_COLORS.map(({ name, value }) => (
                  <button
                    key={value} title={name} onClick={() => onFloorColor(value)}
                    className="w-7 h-7 rounded-sm transition-all duration-150 hover:scale-110"
                    style={{ backgroundColor: value, outline: floorColor === value ? '2px solid #C9A84C' : '2px solid transparent', outlineOffset: '2px' }}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* ── CTA ── */}
      <div className="px-6 pb-6 pt-4 shrink-0" style={{ borderTop: `1px solid ${c.panelBorder}` }}>
        <button
          onClick={onViewInRoom}
          className="w-full py-3.5 text-xs font-semibold tracking-[0.2em] uppercase transition-all hover:opacity-90 active:opacity-75"
          style={{
            background: 'linear-gradient(135deg, #B8922A 0%, #E8C87A 50%, #C9A84C 100%)',
            color: '#0E0E10',
            borderRadius: '2px',
          }}
        >
          Book Consultation →
        </button>
        <p className="text-[11px] text-center mt-2" style={{ color: '#5A6A78' }}>
          Send your design to our team
        </p>
      </div>
    </aside>
  )
}
