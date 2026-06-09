'use client'

import { useState, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence, useScroll, useTransform, useInView } from 'framer-motion'
import { MessageSquare, CalendarDays, CreditCard, Glasses, ClipboardCheck, PackageCheck } from 'lucide-react'
import LandingNavbar     from '@/app/components/landing/Navbar'
import LandingFooter     from '@/app/components/landing/Footer'
import GoldenSeparator   from '@/app/components/shared/GoldenSeparator'

const ease = [0.25, 0.1, 0.25, 1] as const

// ─── Constants ─────────────────────────────────────────────────────────────

const ROOMS  = ['Sitting Room', 'Bedroom', 'Dining Room', 'Home Office']
const COLORS = ['Neutrals', 'Earthy Tones', 'Bold Colors', 'Sheers & Lights']

const ROOM_IMAGES: Record<string, string> = {
  'Sitting Room': '/assets/sittingroom.png',
  'Bedroom':      '/assets/sample2.png',
  'Dining Room':  '/assets/sample3.png',
  'Home Office':  '/assets/sample4.png',
}

// Maps catalog palette → studio curtain hex + atmospheric overlay
const COLOR_STUDIO: Record<string, { hex: string; overlay: string; label: string }> = {
  'Neutrals':      { hex: '#E8DCC8', overlay: 'rgba(232,220,200,0.18)', label: 'Warm Ivory & Cream tones' },
  'Earthy Tones':  { hex: '#C07455', overlay: 'rgba(192,116,85,0.18)',  label: 'Terracotta & Ochre tones' },
  'Bold Colors':   { hex: '#1E3A5F', overlay: 'rgba(30,58,95,0.22)',    label: 'Deep Navy & Forest tones' },
  'Sheers & Lights': { hex: '#F0EBE0', overlay: 'rgba(240,235,224,0.12)', label: 'White & Blush sheer tones' },
}

// ─── Fabric Data ───────────────────────────────────────────────────────────

type Fabric = {
  number:      string
  name:        string
  material:    string
  description: string
  bullets:     string[]
  image:       string
  fallback:    string
}

const FABRIC_DATA: Record<string, Fabric[]> = {
  'Neutrals': [
    {
      number:      '01 / 03',
      name:        'Nairobi Linen',
      material:    'Premium East African Linen',
      description: 'Our signature Nairobi Linen is hand-woven by master craftspeople in the highlands of central Kenya. The loose open weave catches afternoon light beautifully — creating a warm, lived-in atmosphere that feels both contemporary and deeply rooted in East African textile tradition.',
      bullets:     ['Hand-woven in central Kenya', 'Breathable open weave construction', 'Available in 12 tone variations'],
      image:       '/assets/curtain1.png',
      fallback:    'linear-gradient(135deg, #2a1f0a, #1a150a)',
    },
    {
      number:      '02 / 03',
      name:        'Savanna Weave',
      material:    'Natural Cotton Blend',
      description: 'The Savanna Weave draws its texture from the grasslands of the Rift Valley — a tight, structured cotton blend that hangs with quiet authority. Where the Nairobi Linen breathes, the Savanna Weave commands. It is the fabric that transforms a sitting room into a statement.',
      bullets:     ['Heavyweight structured drape', 'Fade-resistant natural dyes', 'Exceptional light blocking'],
      image:       '/assets/curtain2.png',
      fallback:    'linear-gradient(135deg, #1e1a10, #2a2410)',
    },
    {
      number:      '03 / 03',
      name:        'Ivory Coast',
      material:    'Lightweight Linen Sheer',
      description: 'For spaces that want to dance with light rather than control it — the Ivory Coast sheer filters afternoon sun into something golden and gentle. Sheer but not transparent. Soft but not weak. The fabric that makes a room feel like a Sunday morning.',
      bullets:     ['70% light diffusion', 'Naturally anti-static weave', 'Pairs beautifully with blackout lining'],
      image:       '/assets/curtain3.png',
      fallback:    'linear-gradient(135deg, #1e1c14, #28241a)',
    },
  ],
  'Earthy Tones': [
    {
      number:      '01 / 03',
      name:        'Rift Valley',
      material:    'Heavyweight Terracotta Linen',
      description: 'Terracotta is the color of the Kenyan earth after rain — warm, alive, and full of character. The Rift Valley linen captures that exact warmth in fabric form. Heavyweight enough to command a full wall of windows, earthy enough to feel completely at home.',
      bullets:     ['Heavyweight 280gsm construction', 'Warm terracotta earth tones', 'Floor-to-ceiling drape specialist'],
      image:       '/assets/curtain2.png',
      fallback:    'linear-gradient(135deg, #2e1008, #1e0c06)',
    },
    {
      number:      '02 / 03',
      name:        'Maasai Ember',
      material:    'Ochre Cotton Velvet',
      description: 'Inspired by the golden hour light that falls across the Maasai Mara every evening — a rich ochre velvet that holds light on its surface like it was born to. In a dining room or bedroom this fabric does not decorate the space. It defines it.',
      bullets:     ['Plush 400gsm velvet pile', 'Rich ochre with gold undertones', 'Statement fabric for premium rooms'],
      image:       '/assets/curtain4.png',
      fallback:    'linear-gradient(135deg, #2a1a04, #1e1204)',
    },
    {
      number:      '03 / 03',
      name:        'Sunset Kiondo',
      material:    'Rust Textured Weave',
      description: 'The kiondo basket weave pattern is one of Kenya\'s most recognizable textile traditions. Sunset Kiondo translates that geometric beauty into a curtain fabric — rust-toned, textured, and proudly East African. A fabric with a story woven into every thread.',
      bullets:     ['Traditional kiondo weave pattern', 'Deep rust with amber highlights', 'Heritage craft, contemporary finish'],
      image:       '/assets/curtain1.png',
      fallback:    'linear-gradient(135deg, #2a0e06, #1a0a04)',
    },
  ],
  'Bold Colors': [
    {
      number:      '01 / 03',
      name:        'Naivasha Deep',
      material:    'Navy Premium Linen',
      description: 'Named for the deep waters of Lake Naivasha at dusk — a navy so rich it seems to absorb the light around it. Naivasha Deep is for rooms that want to feel serious, considered, and completely in command. The choice of someone who knows exactly what they want.',
      bullets:     ['Deep navy with subtle blue depth', 'Premium heavyweight linen', 'Exceptional light control'],
      image:       '/assets/curtain3.png',
      fallback:    'linear-gradient(135deg, #08101e, #06101a)',
    },
    {
      number:      '02 / 03',
      name:        'Karura Forest',
      material:    'Forest Green Velvet',
      description: 'The Karura Forest on Nairobi\'s edge is one of the city\'s most treasured spaces — dense, alive, and unexpectedly serene. This forest green velvet carries that same quality. Luxurious without trying to be. Rich without being loud. The fabric that makes a room feel like a sanctuary.',
      bullets:     ['Deep forest green velvet', 'Plush texture with natural depth', 'Thermal and acoustic properties'],
      image:       '/assets/curtain4.png',
      fallback:    'linear-gradient(135deg, #061a0c, #041006)',
    },
    {
      number:      '03 / 03',
      name:        'Diani Wine',
      material:    'Burgundy Heavyweight Cotton',
      description: 'Diani Beach at sunset turns the sky a deep wine-red that stays with you long after you have left. The Diani Wine curtain brings that color indoors — a heavyweight cotton in deep burgundy that commands every room it enters. For dining rooms that want drama. For bedrooms that want depth.',
      bullets:     ['Deep burgundy heavyweight cotton', 'Rich wine tones with red depth', 'Premium drape and structure'],
      image:       '/assets/curtain2.png',
      fallback:    'linear-gradient(135deg, #1a0810, #100408)',
    },
  ],
  'Sheers & Lights': [
    {
      number:      '01 / 03',
      name:        'Mombasa Mist',
      material:    'White Coastal Sheer',
      description: 'The morning mist that rolls in off the Indian Ocean before the Mombasa sun burns it away — that is the quality this sheer captures. White without being stark. Light without being invisible. The fabric that fills a room with the feeling of being somewhere beautiful.',
      bullets:     ['Pure white coastal weave', 'Maximum light diffusion', 'Saltwater and humidity resistant'],
      image:       '/assets/curtain3.png',
      fallback:    'linear-gradient(135deg, #1a1a18, #141412)',
    },
    {
      number:      '02 / 03',
      name:        'Lamu Ivory',
      material:    'Ivory Lightweight Cotton',
      description: 'Lamu\'s ancient Swahili architecture has been filtering tropical light through white fabric for over a thousand years. The Lamu Ivory is our interpretation of that timeless tradition — a lightweight cotton in warm ivory that softens every room it touches without apologizing for its presence.',
      bullets:     ['Warm ivory natural cotton', 'Lightweight graceful drape', 'Pairs with any interior palette'],
      image:       '/assets/curtain4.png',
      fallback:    'linear-gradient(135deg, #1c1a12, #16140e)',
    },
    {
      number:      '03 / 03',
      name:        'Zanzibar Blush',
      material:    'Dusty Rose Semi-Sheer',
      description: 'Zanzibar\'s spice markets and coral-pink sunsets have inspired artists and designers for centuries. Zanzibar Blush is a dusty rose semi-sheer that brings that warmth indoors — not pink enough to dominate, not neutral enough to disappear. The fabric that makes a bedroom feel like it was designed just for you.',
      bullets:     ['Dusty rose semi-sheer weave', 'Warm blush tones', 'Perfect for bedroom and dressing rooms'],
      image:       '/assets/curtain2.png',
      fallback:    'linear-gradient(135deg, #1e1018, #16080e)',
    },
  ],
}

// ─── Catalog Listings Data ─────────────────────────────────────────────────

const CATALOG_ITEMS = [
  {
    id:          1,
    image:       '/assets/catalog1.png',
    collection:  'The Classic',
    name:        'Ivory Linen & Sheer Duo',
    material:    'Blackout Linen + Voile Sheer Pair',
    description: 'The timeless combination — a heavyweight ivory linen blackout paired with a flowing white voile sheer. Installed floor-to-ceiling, this duo gives you independent control of light and privacy across any room.',
    price:       'From KSh 18,500',
    priceNote:   'per window · pair included',
    tags:        ['Dual Layer', 'Neutral', 'Blackout + Sheer'],
    badge:       'Best Seller',
  },
  {
    id:          2,
    image:       '/assets/catalog2.png',
    collection:  'The Bold Contrast',
    name:        'Mustard & Charcoal Weave',
    material:    'Woven Cotton — Mustard & Charcoal',
    description: 'Two strong opinions sharing one window. The mustard-gold and deep charcoal pair is our most requested combination for living rooms and offices that refuse to be forgettable.',
    price:       'From KSh 14,500',
    priceNote:   'per panel · standard lining',
    tags:        ['Bold', 'Contrast Weave', 'Statement'],
    badge:       'New',
  },
  {
    id:          3,
    image:       '/assets/catalog3.png',
    collection:  'The Coastal',
    name:        'Teal, Ivory & Cream Trio',
    material:    'Teal Linen Blend + Ivory Sheer + Cream',
    description: 'Three tones, one cohesive palette. The teal panel anchors the room while ivory sheer and warm cream panels soften and filter. A complete window treatment designed as a single collection.',
    price:       'From KSh 16,500',
    priceNote:   'per panel · tri-layer set',
    tags:        ['Teal', 'Tri-tone', 'Coastal'],
    badge:       null,
  },
  {
    id:          4,
    image:       '/assets/catalog4.png',
    collection:  'The Metropolitan',
    name:        'Steel Textured Drape',
    material:    'Textured Steel-Grey Poly Blend',
    description: 'Understated at first glance, increasingly beautiful on closer look. A subtle embossed texture in cool steel grey — the fabric that gives bedrooms and offices a quiet sophistication that needs no explanation.',
    price:       'From KSh 12,000',
    priceNote:   'per panel · blackout lining',
    tags:        ['Textured', 'Steel Grey', 'Premium'],
    badge:       null,
  },
]

// ─── Process Steps Data ────────────────────────────────────────────────────

const PROCESS_STEPS = [
  {
    number: '01',
    Icon:   MessageSquare,
    title:  'Reach Out',
    sub:    'Start the conversation',
    desc:   'Contact us through our form, WhatsApp, or a direct call. Tell us about your space, your vision, or simply your uncertainty — we work equally well with both.',
  },
  {
    number: '02',
    Icon:   CalendarDays,
    title:  'Discovery Session',
    sub:    'Virtual, physical, or studio visit',
    desc:   'We schedule a free discovery meeting — a video call, a visit to your home, or an invitation to our Nairobi studio. We look at your walls, your light, your existing palette.',
  },
  {
    number: '03',
    Icon:   CreditCard,
    title:  'Consultation',
    sub:    'Invest in the vision',
    desc:   'A consultation fee unlocks our full design process. We measure every window, map your wall colors, and prepare a bespoke selection of fabrics and combinations tailored to your space.',
  },
  {
    number: '04',
    Icon:   Glasses,
    title:  'Visualize in 3D',
    sub:    'See it before you commit',
    desc:   'Using our VR studio, you see exactly how each curtain looks in your room — with your wall colors, your furniture, your light. Swap fabrics, change tones, adjust lengths. Until it is perfect.',
  },
  {
    number: '05',
    Icon:   ClipboardCheck,
    title:  'Place Your Order',
    sub:    'Only when you are satisfied',
    desc:   'Pleased with the visualization? Place your order. We confirm every measurement, finalize your fabric selection, and begin production. No pressure. No rush. Only when it feels right.',
  },
  {
    number: '06',
    Icon:   PackageCheck,
    title:  'Knit, Deliver & Install',
    sub:    'The full white-glove service',
    desc:   'Our craftspeople custom-knit every panel to your exact measurements. We deliver to your door and install everything — so the first time you see the final result, it is already hanging perfectly.',
  },
]

// ─── Pill ──────────────────────────────────────────────────────────────────

function Pill({ label, selected, onClick }: { label: string; selected: boolean; onClick: () => void }) {
  const [hovered, setHovered] = useState(false)

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        fontFamily:    'var(--font-inter, sans-serif)',
        fontSize:      '14px',
        fontWeight:    selected ? 500 : 400,
        padding:       '14px 28px',
        borderRadius:  '32px',
        cursor:        'pointer',
        backdropFilter:'blur(8px)',
        transition:    'all 0.25s ease',
        marginRight:   '12px',
        marginBottom:  '12px',
        outline:       'none',
        letterSpacing: '0.3px',
        background:    selected
          ? 'rgba(201,168,76,0.12)'
          : hovered
            ? 'rgba(201,168,76,0.06)'
            : 'rgba(10,15,28,0.6)',
        border:        `1px solid ${selected ? '#C9A84C' : hovered ? 'rgba(201,168,76,0.6)' : 'rgba(201,168,76,0.35)'}`,
        color:         selected ? '#C9A84C' : hovered ? '#E8C96D' : '#A8B2BE',
        boxShadow:     selected ? '0 0 12px rgba(201,168,76,0.15)' : 'none',
      }}
    >
      {label}
    </button>
  )
}

// ─── Studio Reveal ─────────────────────────────────────────────────────────

function StudioReveal({ room, color }: { room: string; color: string }) {
  const roomImage  = ROOM_IMAGES[room]  ?? '/assets/sittingroom.png'
  const studioMeta = COLOR_STUDIO[color]
  const studioUrl  = studioMeta ? `/studio?color=${encodeURIComponent(studioMeta.hex)}` : '/studio'

  return (
    <motion.section
      key={`${room}-${color}`}
      initial={{ opacity: 0, y: 60 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 30 }}
      transition={{ duration: 0.75, ease }}
      style={{ position: 'relative', overflow: 'hidden', minHeight: '90vh', display: 'flex', alignItems: 'center' }}
    >
      {/* Room image — full bleed */}
      <div style={{ position: 'absolute', inset: 0 }}>
        <Image
          key={roomImage}
          src={roomImage}
          alt={room}
          fill
          style={{ objectFit: 'cover', objectPosition: 'center' }}
        />
      </div>

      {/* Dark base overlay */}
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(10,15,28,0.92) 0%, rgba(10,15,28,0.5) 55%, rgba(10,15,28,0.2) 100%)' }} />
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(10,15,28,0.85) 0%, transparent 50%)' }} />

      {/* Color palette tint overlay */}
      {studioMeta && (
        <motion.div
          key={color}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, ease }}
          style={{ position: 'absolute', inset: 0, background: studioMeta.overlay, mixBlendMode: 'screen', pointerEvents: 'none' }}
        />
      )}

      {/* Content */}
      <div style={{ position: 'relative', zIndex: 2, padding: '80px 8vw', maxWidth: '640px' }}>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease, delay: 0.2 }}
          style={{ fontFamily: 'var(--font-inter)', fontSize: '10px', color: '#C9A84C', letterSpacing: '5px', textTransform: 'uppercase', marginBottom: '20px' }}
        >
          Your Selection
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease, delay: 0.3 }}
          style={{ fontFamily: 'var(--font-playfair, Georgia, serif)', fontSize: 'clamp(36px, 4.5vw, 62px)', color: '#FFFFFF', fontWeight: 400, lineHeight: 1.1, marginBottom: '8px' }}
        >
          {room}
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease, delay: 0.4 }}
          style={{ fontFamily: 'var(--font-playfair, Georgia, serif)', fontSize: '20px', color: '#E8C96D', fontStyle: 'italic', marginBottom: '28px' }}
        >
          {studioMeta?.label ?? color}
        </motion.p>

        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.7, ease, delay: 0.45 }}
          style={{ width: '40px', height: '1px', background: 'linear-gradient(to right, #C9A84C, #E8C96D)', transformOrigin: 'left', marginBottom: '28px' }}
        />

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease, delay: 0.5 }}
          style={{ fontFamily: 'var(--font-inter)', fontSize: '16px', color: '#8A9AAA', lineHeight: 1.8, marginBottom: '44px' }}
        >
          This is how your space could look. Step inside the 3D studio and see it
          draped, lit, and scaled in real time — before you commit to a single thread.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease, delay: 0.65 }}
          style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}
        >
          <Link
            href={studioUrl}
            style={{
              fontFamily:     'var(--font-inter)',
              fontSize:       '14px',
              fontWeight:     600,
              letterSpacing:  '1.5px',
              textTransform:  'uppercase',
              color:          '#0A0F1C',
              background:     'linear-gradient(135deg, #E8C96D 0%, #C9A84C 50%, #A67C2E 100%)',
              padding:        '18px 44px',
              borderRadius:   '3px',
              textDecoration: 'none',
              boxShadow:      '0 0 40px rgba(201,168,76,0.4)',
              transition:     'all 0.3s ease',
              display:        'inline-block',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.filter    = 'brightness(1.12)'
              e.currentTarget.style.transform = 'translateY(-2px)'
              e.currentTarget.style.boxShadow = '0 8px 48px rgba(201,168,76,0.6)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.filter    = ''
              e.currentTarget.style.transform = ''
              e.currentTarget.style.boxShadow = '0 0 40px rgba(201,168,76,0.4)'
            }}
          >
            See It in 3D Studio →
          </Link>

          <Link
            href="/contact"
            style={{
              fontFamily:     'var(--font-inter)',
              fontSize:       '13px',
              color:          'rgba(255,255,255,0.6)',
              textDecoration: 'none',
              borderBottom:   '1px solid rgba(255,255,255,0.25)',
              paddingBottom:  '2px',
              transition:     'color 0.2s ease, border-color 0.2s ease',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.color       = '#E8C96D'
              e.currentTarget.style.borderColor = 'rgba(232,201,109,0.5)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.color       = 'rgba(255,255,255,0.6)'
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.25)'
            }}
          >
            Book a Consultation instead
          </Link>
        </motion.div>
      </div>

      {/* Gold bottom rule */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '1px', background: 'linear-gradient(to right, transparent, rgba(201,168,76,0.4) 30%, rgba(201,168,76,0.4) 70%, transparent)' }} />
    </motion.section>
  )
}

// ─── Hero ──────────────────────────────────────────────────────────────────

function CatalogHero({
  selectedRoom, selectedColor,
  onRoomSelect, onColorSelect,
}: {
  selectedRoom:  string
  selectedColor: string
  onRoomSelect:  (r: string) => void
  onColorSelect: (c: string) => void
}) {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const imageY = useTransform(scrollYProgress, [0, 1], ['0%', '18%'])

  return (
    <section ref={ref} style={{ position: 'relative', height: '100vh', overflow: 'hidden', display: 'flex', alignItems: 'flex-end' }}>

      {/* GoldenSeparator below navbar */}
      <div style={{ position: 'absolute', top: 'var(--rj-navbar-height)', left: 0, right: 0, zIndex: 10 }}>
        <GoldenSeparator />
      </div>

      {/* Parallax background */}
      <motion.div style={{ position: 'absolute', inset: '-10%', y: imageY }}>
        <Image src="/assets/sittingroom.png" alt="" fill style={{ objectFit: 'cover', objectPosition: 'center' }} priority />
      </motion.div>

      {/* Overlays */}
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(10,15,28,0.98) 0%, rgba(10,15,28,0.6) 45%, rgba(10,15,28,0.3) 100%)' }} />
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(10,15,28,0.65) 0%, transparent 65%)' }} />

      {/* Gold top rule */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '1px', background: 'linear-gradient(to right, transparent, rgba(201,168,76,0.5) 30%, rgba(232,201,109,0.8) 50%, rgba(201,168,76,0.5) 70%, transparent)' }} />

      {/* Two-column layout — text left, pills right */}
      <div style={{
        position:       'relative',
        zIndex:         2,
        width:          '100%',
        padding:        '0 8vw 8vh',
        display:        'flex',
        alignItems:     'flex-end',
        justifyContent: 'space-between',
        gap:            '6vw',
      }}>

        {/* ── Left: headline + subtext ── */}
        <div style={{ flex: '0 0 auto', maxWidth: '520px' }}>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease, delay: 0.3 }}
            style={{ fontFamily: 'var(--font-inter)', fontSize: '10px', color: '#C9A84C', letterSpacing: '6px', textTransform: 'uppercase', marginBottom: '28px' }}
          >
            The Collection
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease, delay: 0.45 }}
            style={{ fontFamily: 'var(--font-playfair, Georgia, serif)', fontSize: 'clamp(44px, 5.5vw, 80px)', color: '#FFFFFF', fontWeight: 400, lineHeight: 1.05, marginBottom: '8px' }}
          >
            Find Your Perfect
          </motion.h1>

          <motion.h1
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease, delay: 0.6 }}
            style={{ fontFamily: 'var(--font-playfair, Georgia, serif)', fontSize: 'clamp(44px, 5.5vw, 80px)', fontWeight: 400, lineHeight: 1.05, marginBottom: '28px' }}
          >
            <em style={{ color: '#E8C96D', fontStyle: 'italic', textShadow: '0 0 60px rgba(232,201,109,0.35)' }}>Fabric.</em>
          </motion.h1>

          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.8, ease, delay: 0.72 }}
            style={{ width: '48px', height: '1.5px', background: 'linear-gradient(to right, #C9A84C, #E8C96D)', transformOrigin: 'left', marginBottom: '20px' }}
          />

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease, delay: 0.85 }}
            style={{ fontFamily: 'var(--font-inter)', fontSize: 'clamp(13px, 1vw, 15px)', color: '#8A9AAA', lineHeight: 1.85 }}
          >
            Browse our curated collection of East African and international fabrics.
            Select your room, choose your color family, and discover the combination
            that transforms your space.
          </motion.p>
        </div>

        {/* ── Right: pills ── */}
        <div style={{ flex: '0 0 auto', minWidth: '320px', maxWidth: '400px', paddingBottom: '4px' }}>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease, delay: 1.0 }}
            style={{ marginBottom: '28px' }}
          >
            <p style={{ fontFamily: 'var(--font-inter)', fontSize: '10px', color: '#C9A84C', letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '12px' }}>
              Select Your Room
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap' }}>
              {ROOMS.map(r => (
                <Pill key={r} label={r} selected={selectedRoom === r} onClick={() => onRoomSelect(r)} />
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease, delay: 1.15 }}
          >
            <p style={{ fontFamily: 'var(--font-inter)', fontSize: '10px', color: '#C9A84C', letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '12px' }}>
              Choose Your Palette
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap' }}>
              {COLORS.map(c => (
                <Pill key={c} label={c} selected={selectedColor === c} onClick={() => onColorSelect(c)} />
              ))}
            </div>
          </motion.div>

        </div>
      </div>

      {/* Scroll cue — right side */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6, duration: 0.8 }}
        style={{ position: 'absolute', bottom: '40px', right: '6vw', zIndex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}
      >
        <span style={{ fontFamily: 'var(--font-inter)', fontSize: '9px', color: 'rgba(201,168,76,0.5)', letterSpacing: '4px', textTransform: 'uppercase', writingMode: 'vertical-rl' }}>
          Scroll to Browse
        </span>
        <motion.div
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          style={{ width: '1px', height: '56px', background: 'linear-gradient(to bottom, #C9A84C, transparent)' }}
        />
      </motion.div>
    </section>
  )
}



// ─── Catalog Listings ──────────────────────────────────────────────────────

function CatalogListings() {
  const [hoveredId, setHoveredId] = useState<number | null>(null)
  const ref    = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.08 })

  return (
    <section
      ref={ref}
      style={{ background: '#0A0F1C', padding: '100px 8vw 80px', borderTop: '1px solid rgba(201,168,76,0.12)' }}
    >
      <style>{`
        @media (max-width: 860px) { .catalog-grid { grid-template-columns: 1fr !important; } }
        @media (min-width: 861px) and (max-width: 1200px) { .catalog-grid { grid-template-columns: 1fr 1fr !important; } }
      `}</style>

      {/* Section header */}
      <motion.div
        initial={{ opacity: 0, y: 28 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, ease }}
        style={{ marginBottom: '64px' }}
      >
        <p style={{ fontFamily: 'var(--font-inter)', fontSize: '10px', color: '#C9A84C', letterSpacing: '5px', textTransform: 'uppercase', marginBottom: '16px' }}>
          Signature Collections
        </p>
        <h2 style={{ fontFamily: 'var(--font-playfair, Georgia, serif)', fontSize: 'clamp(34px, 3.8vw, 54px)', color: '#FFFFFF', fontWeight: 400, lineHeight: 1.1, marginBottom: '16px' }}>
          Crafted for Your Space
        </h2>
        <p style={{ fontFamily: 'var(--font-inter)', fontSize: '15px', color: '#506070', lineHeight: 1.8, maxWidth: '520px' }}>
          Every panel is custom-knit to order. Pricing covers consultation, production, delivery, and installation within Nairobi.
        </p>
      </motion.div>

      {/* Grid */}
      <div
        className="catalog-grid"
        style={{
          display:             'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap:                 '2px',
          background:          'rgba(201,168,76,0.06)',
        }}
      >
        {CATALOG_ITEMS.map((item, i) => (
          <motion.article
            key={item.id}
            initial={{ opacity: 0, y: 40 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease, delay: i * 0.13 }}
            onMouseEnter={() => setHoveredId(item.id)}
            onMouseLeave={() => setHoveredId(null)}
            style={{ background: '#0D1220', overflow: 'hidden', cursor: 'default' }}
          >
            {/* Image */}
            <div style={{ position: 'relative', height: '300px', overflow: 'hidden' }}>
              <Image
                src={item.image}
                alt={item.name}
                fill
                style={{
                  objectFit:  'cover',
                  objectPosition: 'center',
                  transform:  hoveredId === item.id ? 'scale(1.06)' : 'scale(1)',
                  transition: 'transform 0.7s ease',
                }}
              />
              <div style={{
                position:   'absolute', inset: 0,
                background: 'linear-gradient(to top, rgba(13,18,32,0.88) 0%, rgba(13,18,32,0.15) 55%, transparent 100%)',
              }} />
              {item.badge && (
                <div style={{
                  position:      'absolute', top: '18px', left: '18px',
                  background:    'linear-gradient(135deg, #F0D77A 0%, #C9A84C 100%)',
                  color:         '#0A0F1C',
                  fontFamily:    'var(--font-inter)',
                  fontSize:      '9px',
                  fontWeight:    700,
                  letterSpacing: '2px',
                  textTransform: 'uppercase',
                  padding:       '5px 12px',
                  borderRadius:  '2px',
                }}>
                  {item.badge}
                </div>
              )}
            </div>

            {/* Content */}
            <div style={{ padding: '26px 26px 30px' }}>
              <p style={{ fontFamily: 'var(--font-inter)', fontSize: '10px', color: '#C9A84C', letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '6px' }}>
                {item.collection}
              </p>
              <h3 style={{ fontFamily: 'var(--font-playfair, Georgia, serif)', fontSize: '20px', color: '#FFFFFF', fontWeight: 400, marginBottom: '6px', lineHeight: 1.2 }}>
                {item.name}
              </h3>
              <p style={{ fontFamily: 'var(--font-inter)', fontSize: '12px', color: '#3A4A58', marginBottom: '14px', fontStyle: 'italic' }}>
                {item.material}
              </p>
              <p style={{ fontFamily: 'var(--font-inter)', fontSize: '13.5px', color: '#6A7A88', lineHeight: 1.78, marginBottom: '20px' }}>
                {item.description}
              </p>

              {/* Tags */}
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '22px' }}>
                {item.tags.map(tag => (
                  <span key={tag} style={{
                    fontFamily:    'var(--font-inter)',
                    fontSize:      '10px',
                    color:         '#506070',
                    border:        '1px solid rgba(201,168,76,0.18)',
                    padding:       '4px 10px',
                    borderRadius:  '20px',
                    letterSpacing: '0.4px',
                  }}>
                    {tag}
                  </span>
                ))}
              </div>

              {/* Price + CTA */}
              <div style={{
                display:        'flex',
                alignItems:     'flex-end',
                justifyContent: 'space-between',
                borderTop:      '1px solid rgba(201,168,76,0.1)',
                paddingTop:     '18px',
                flexWrap:       'wrap',
                gap:            '12px',
              }}>
                <div>
                  <p style={{ fontFamily: 'var(--font-playfair, Georgia, serif)', fontSize: '18px', color: '#C9A84C', fontWeight: 400, lineHeight: 1 }}>
                    {item.price}
                  </p>
                  <p style={{ fontFamily: 'var(--font-inter)', fontSize: '11px', color: '#2E3E4E', marginTop: '4px' }}>
                    {item.priceNote}
                  </p>
                </div>
                <Link
                  href="/contact"
                  style={{
                    fontFamily:     'var(--font-inter)',
                    fontSize:       '11px',
                    fontWeight:     600,
                    letterSpacing:  '1.5px',
                    textTransform:  'uppercase',
                    color:          hoveredId === item.id ? '#0A0F1C' : '#C9A84C',
                    background:     hoveredId === item.id
                      ? 'linear-gradient(135deg, #F0D77A 0%, #C9A84C 100%)'
                      : 'transparent',
                    border:         '1px solid rgba(201,168,76,0.5)',
                    padding:        '11px 20px',
                    borderRadius:   '2px',
                    textDecoration: 'none',
                    transition:     'all 0.3s ease',
                    whiteSpace:     'nowrap',
                  }}
                >
                  Enquire
                </Link>
              </div>
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  )
}

// ─── How We Work ───────────────────────────────────────────────────────────

function HowWeWork() {
  const ref    = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.06 })

  return (
    <section
      ref={ref}
      style={{ background: '#080C16', padding: '110px 8vw 120px', borderTop: '1px solid rgba(201,168,76,0.1)' }}
    >
      <style>{`
        @media (max-width: 760px) {
          .process-row { flex-direction: column !important; gap: 28px !important; }
          .process-connector { display: none !important; }
          .process-step-num { font-size: 64px !important; }
        }
      `}</style>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 28 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, ease }}
        style={{ marginBottom: '80px', maxWidth: '600px' }}
      >
        <p style={{ fontFamily: 'var(--font-inter)', fontSize: '10px', color: '#C9A84C', letterSpacing: '5px', textTransform: 'uppercase', marginBottom: '16px' }}>
          The Process
        </p>
        <h2 style={{ fontFamily: 'var(--font-playfair, Georgia, serif)', fontSize: 'clamp(34px, 3.8vw, 54px)', color: '#FFFFFF', fontWeight: 400, lineHeight: 1.08, marginBottom: '18px' }}>
          How We Work<br />
          <em style={{ color: '#E8C96D', fontStyle: 'italic' }}>With You.</em>
        </h2>
        <p style={{ fontFamily: 'var(--font-inter)', fontSize: '15px', color: '#506070', lineHeight: 1.8 }}>
          From the first message to the final install — six steps, one seamless journey.
        </p>
      </motion.div>

      {/* Timeline */}
      <div style={{ position: 'relative' }}>

        {/* Vertical spine line that draws downward */}
        <motion.div
          initial={{ scaleY: 0 }}
          animate={inView ? { scaleY: 1 } : {}}
          transition={{ duration: 3.2, ease: [0.25, 0.1, 0.25, 1], delay: 0.3 }}
          style={{
            position:        'absolute',
            left:            '36px',
            top:             '36px',
            bottom:          '36px',
            width:           '1px',
            background:      'linear-gradient(to bottom, #C9A84C 0%, rgba(201,168,76,0.4) 70%, transparent 100%)',
            transformOrigin: 'top',
            zIndex:          1,
          }}
        />

        {/* Steps */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0px' }}>
          {PROCESS_STEPS.map((step, i) => {
            const isLast = i === PROCESS_STEPS.length - 1
            return (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, x: -32 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.7, ease, delay: 0.4 + i * 0.18 }}
                style={{
                  display:        'flex',
                  alignItems:     'flex-start',
                  gap:            '0px',
                  paddingBottom:  isLast ? '0' : '56px',
                  position:       'relative',
                  zIndex:         2,
                }}
              >
                {/* Node on the spine */}
                <div style={{ flexShrink: 0, width: '72px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={inView ? { scale: 1, opacity: 1 } : {}}
                    transition={{ duration: 0.45, ease: [0.34, 1.56, 0.64, 1], delay: 0.5 + i * 0.18 }}
                    style={{
                      width:           '14px',
                      height:          '14px',
                      borderRadius:    '50%',
                      background:      i % 2 === 0
                        ? 'linear-gradient(135deg, #F0D77A, #C9A84C)'
                        : 'rgba(201,168,76,0.15)',
                      border:          '1px solid rgba(201,168,76,0.6)',
                      boxShadow:       i % 2 === 0 ? '0 0 16px rgba(201,168,76,0.5)' : 'none',
                    }}
                  />
                </div>

                {/* Card */}
                <motion.div
                  whileHover={{ x: 6 }}
                  transition={{ duration: 0.25, ease }}
                  style={{
                    flex:         1,
                    background:   'rgba(255,255,255,0.02)',
                    border:       '1px solid rgba(201,168,76,0.08)',
                    borderRadius: '4px',
                    padding:      '32px 36px 32px 32px',
                    display:      'flex',
                    gap:          '28px',
                    alignItems:   'flex-start',
                    cursor:       'default',
                    maxWidth:     '780px',
                  }}
                >
                  {/* Large step number */}
                  <div
                    className="process-step-num"
                    style={{
                      fontFamily:          'var(--font-playfair, Georgia, serif)',
                      fontSize:            '80px',
                      fontWeight:          700,
                      lineHeight:          0.85,
                      background:          i % 2 === 0
                        ? 'linear-gradient(135deg, rgba(240,215,122,0.25) 0%, rgba(201,168,76,0.08) 100%)'
                        : 'linear-gradient(135deg, rgba(201,168,76,0.08) 0%, rgba(201,168,76,0.03) 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor:  'transparent',
                      backgroundClip:       'text',
                      flexShrink:           0,
                      userSelect:           'none',
                      marginTop:            '-8px',
                    }}
                  >
                    {step.number}
                  </div>

                  {/* Text */}
                  <div style={{ flex: 1, paddingTop: '4px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                      <step.Icon
                        size={18}
                        style={{ color: '#C9A84C', flexShrink: 0, strokeWidth: 1.5 }}
                      />
                      <h3 style={{
                        fontFamily: 'var(--font-playfair, Georgia, serif)',
                        fontSize:   '22px',
                        color:      '#FFFFFF',
                        fontWeight: 400,
                        lineHeight: 1,
                        margin:     0,
                      }}>
                        {step.title}
                      </h3>
                    </div>
                    <p style={{
                      fontFamily:    'var(--font-inter)',
                      fontSize:      '11px',
                      color:         '#C9A84C',
                      letterSpacing: '2px',
                      textTransform: 'uppercase',
                      marginBottom:  '14px',
                      paddingLeft:   '30px',
                    }}>
                      {step.sub}
                    </p>
                    <p style={{
                      fontFamily:  'var(--font-inter)',
                      fontSize:    '14px',
                      color:       '#6A7A88',
                      lineHeight:  1.8,
                      paddingLeft: '30px',
                    }}>
                      {step.desc}
                    </p>
                  </div>
                </motion.div>
              </motion.div>
            )
          })}
        </div>
      </div>

      {/* CTA at bottom */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, ease, delay: 1.6 }}
        style={{ marginTop: '72px', paddingLeft: '72px', display: 'flex', alignItems: 'center', gap: '32px', flexWrap: 'wrap' }}
      >
        <Link
          href="/contact"
          style={{
            fontFamily:     'var(--font-inter)',
            fontSize:       '14px',
            fontWeight:     600,
            letterSpacing:  '2px',
            textTransform:  'uppercase',
            color:          '#0A0F1C',
            background:     'linear-gradient(135deg, #F0D77A 0%, #C9A84C 50%, #A67C2E 100%)',
            padding:        '18px 48px',
            borderRadius:   '3px',
            textDecoration: 'none',
            boxShadow:      '0 0 40px rgba(201,168,76,0.35)',
            display:        'inline-block',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.filter    = 'brightness(1.1)'
            e.currentTarget.style.transform = 'translateY(-2px)'
            e.currentTarget.style.boxShadow = '0 8px 48px rgba(201,168,76,0.55)'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.filter    = ''
            e.currentTarget.style.transform = ''
            e.currentTarget.style.boxShadow = '0 0 40px rgba(201,168,76,0.35)'
          }}
        >
          Start Step One →
        </Link>
        <p style={{ fontFamily: 'var(--font-inter)', fontSize: '13px', color: '#3A4A58' }}>
          No commitment. No pressure. Just a conversation.
        </p>
      </motion.div>
    </section>
  )
}

// ─── Main ──────────────────────────────────────────────────────────────────

export default function CatalogClient() {
  const [selectedRoom,  setSelectedRoom]  = useState('Sitting Room')
  const [selectedColor, setSelectedColor] = useState<string | null>(null)

  return (
    <div style={{ background: '#0A0F1C', minHeight: '100vh' }}>
      <LandingNavbar />

      <CatalogHero
        selectedRoom={selectedRoom}
        selectedColor={selectedColor ?? ''}
        onRoomSelect={(r) => { setSelectedRoom(r); setSelectedColor(null) }}
        onColorSelect={setSelectedColor}
      />

      <AnimatePresence mode="wait">
        {selectedRoom && selectedColor && (
          <StudioReveal
            key={`${selectedRoom}-${selectedColor}`}
            room={selectedRoom}
            color={selectedColor}
          />
        )}
      </AnimatePresence>

      <CatalogListings />
      <HowWeWork />

      <LandingFooter />
    </div>
  )
}
