'use client'

import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import LandingNavbar from '@/app/components/landing/Navbar'
import LandingFooter from '@/app/components/landing/Footer'
import { sendBooking } from '@/app/actions/sendBooking'
import { whatsappUrl } from '@/app/lib/whatsapp'

const GOLD = '#C9A84C'
const ease = [0.22, 1, 0.36, 1] as const

const MONTHS = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December',
]
const DAYS_HEADER = ['Su','Mo','Tu','We','Th','Fr','Sa']

const SLOT_TIMES = [
  { time: '10:00 AM', period: 'Morning'        },
  { time: '12:00 PM', period: 'Midday'         },
  { time: '2:00 PM',  period: 'Afternoon'      },
  { time: '4:00 PM',  period: 'Late afternoon' },
]

type CellStatus = 'empty' | 'past' | 'unavailable' | 'limited' | 'available'
interface Cell { date: Date | null; status: CellStatus }

function buildCalendarCells(year: number, month: number): Cell[] {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const first = new Date(year, month, 1)
  const last  = new Date(year, month + 1, 0)
  const pad   = first.getDay()

  const cells: Cell[] = []
  for (let i = 0; i < pad; i++) cells.push({ date: null, status: 'empty' })
  for (let d = 1; d <= last.getDate(); d++) {
    const date = new Date(year, month, d)
    date.setHours(0, 0, 0, 0)
    if (date < today) {
      cells.push({ date, status: 'past' })
    } else if (date.getDay() === 0) {
      cells.push({ date, status: 'unavailable' })
    } else {
      const seed = (d * 7 + month * 31) % 13
      cells.push({ date, status: seed < 4 ? 'limited' : 'available' })
    }
  }
  return cells
}

function getSlotsForDate(date: Date) {
  const seed = date.getDate() * 3 + date.getMonth() * 17
  return SLOT_TIMES.map((slot, i) => ({ ...slot, booked: (seed + i * 5) % 9 === 0 }))
}

function formatDate(date: Date) {
  return date.toLocaleDateString('en-GB', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  })
}

function formatShortDate(date: Date) {
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

function buildGoogleCalendarUrl(date: Date, timeStr: string) {
  const [timePart, ampm] = timeStr.split(' ')
  const [hourStr, minStr] = timePart.split(':')
  let hour = parseInt(hourStr)
  const min = parseInt(minStr)
  if (ampm === 'PM' && hour !== 12) hour += 12
  if (ampm === 'AM' && hour === 12) hour = 0

  const p  = (n: number) => String(n).padStart(2, '0')
  const y  = date.getFullYear()
  const mo = p(date.getMonth() + 1)
  const d  = p(date.getDate())
  const startStr = `${y}${mo}${d}T${p(hour)}${p(min)}00`
  const endMin   = hour * 60 + min + 90
  const endStr   = `${y}${mo}${d}T${p(Math.floor(endMin / 60))}${p(endMin % 60)}00`

  return `https://calendar.google.com/calendar/r/eventedit?text=R%26J+Interiors+%E2%80%94+Studio+Session&dates=${startStr}/${endStr}&details=Curtain+Design+Consultation.+Deposit%3A+KES+2%2C500+payable+at+arrival.&location=R%26J+Interiors+Studio%2C+Nairobi`
}

function StepIndicator({ step }: { step: number }) {
  const labels = ['Choose date', 'Pick a time', 'Your details']
  return (
    <div style={{
      display: 'flex', alignItems: 'flex-start',
      maxWidth: 380, margin: '0 auto 44px',
    }}>
      {labels.map((label, i) => {
        const n      = i + 1
        const done   = step > n
        const active = step === n
        const lit    = done || active
        return (
          <div key={n} style={{ display: 'flex', alignItems: 'center', flex: i < labels.length - 1 ? '1 1 auto' : '0 0 auto' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
              <motion.div
                animate={{
                  background: done ? GOLD : active ? 'rgba(201,168,76,0.1)' : 'transparent',
                  borderColor: lit ? GOLD : 'rgba(201,168,76,0.35)',
                  scale: active ? 1.12 : 1,
                }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
                style={{
                  width: 32, height: 32, borderRadius: '50%',
                  border: '1.5px solid',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
              >
                <AnimatePresence mode="wait">
                  {done ? (
                    <motion.svg key="chk"
                      initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
                      transition={{ duration: 0.22, ease: 'backOut' }}
                      width="13" height="13" viewBox="0 0 24 24"
                      fill="none" stroke="#0A0A10" strokeWidth="2.8" strokeLinecap="round"
                    >
                      <path d="M5 12l5 5L20 7"/>
                    </motion.svg>
                  ) : (
                    <motion.span key="num"
                      initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                      style={{
                        fontSize: 11, fontFamily: 'var(--font-inter,sans-serif)',
                        fontWeight: 600, color: lit ? GOLD : 'rgba(201,168,76,0.5)',
                      }}
                    >
                      {n}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.div>
              <span style={{
                fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase',
                fontFamily: 'var(--font-inter,sans-serif)',
                color: active ? GOLD : done ? 'rgba(201,168,76,0.65)' : 'rgba(201,168,76,0.4)',
                whiteSpace: 'nowrap', transition: 'color 0.35s ease',
              }}>
                {label}
              </span>
            </div>
            {i < labels.length - 1 && (
              <motion.div
                animate={{ background: done ? GOLD : 'rgba(201,168,76,0.2)' }}
                transition={{ duration: 0.4 }}
                style={{ flex: 1, height: 1, marginBottom: 30, marginLeft: 8, marginRight: 8 }}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}

function CalendarStep({
  selectedDate, onSelect,
}: {
  selectedDate: Date | null
  onSelect: (d: Date) => void
}) {
  const today = new Date()
  const [calYear,  setCalYear]  = useState(today.getFullYear())
  const [calMonth, setCalMonth] = useState(today.getMonth())
  const [monthDir, setMonthDir] = useState(0)

  const cells     = useMemo(() => buildCalendarCells(calYear, calMonth), [calYear, calMonth])
  const canGoPrev = calYear > today.getFullYear() || calMonth > today.getMonth()

  function goPrev() {
    if (!canGoPrev) return
    setMonthDir(-1)
    if (calMonth === 0) { setCalMonth(11); setCalYear(y => y - 1) }
    else setCalMonth(m => m - 1)
  }
  function goNext() {
    setMonthDir(1)
    if (calMonth === 11) { setCalMonth(0); setCalYear(y => y + 1) }
    else setCalMonth(m => m + 1)
  }

  return (
    <div>
      <div style={{ overflow: 'hidden', marginBottom: 6 }}>
        <motion.h2
          initial={{ y: '110%' }} animate={{ y: 0 }}
          transition={{ duration: 0.72, ease }}
          style={{
            fontFamily: 'var(--font-playfair,Georgia,serif)',
            fontSize: 'clamp(26px,3vw,40px)',
            color: '#F0EBE0', fontWeight: 400, lineHeight: 1.1, margin: 0,
          }}
        >
          Choose your date.
        </motion.h2>
      </div>
      <motion.p
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ delay: 0.28, duration: 0.5 }}
        style={{
          fontFamily: 'var(--font-inter,sans-serif)',
          fontSize: 13, color: '#6B8299', lineHeight: 1.75, marginBottom: 28,
        }}
      >
        Sessions run Monday – Saturday, guided by our consultant.
      </motion.p>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <button
          onClick={goPrev}
          disabled={!canGoPrev}
          style={{
            width: 34, height: 34, borderRadius: '50%',
            border: `1px solid ${canGoPrev ? 'rgba(201,168,76,0.5)' : 'rgba(201,168,76,0.12)'}`,
            background: 'transparent', cursor: canGoPrev ? 'pointer' : 'not-allowed',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: canGoPrev ? GOLD : 'rgba(201,168,76,0.18)',
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={e => canGoPrev && (e.currentTarget.style.background = 'rgba(201,168,76,0.08)')}
          onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M15 18l-6-6 6-6"/></svg>
        </button>

        <AnimatePresence mode="wait" custom={monthDir}>
          <motion.span
            key={`${calYear}-${calMonth}`}
            custom={monthDir}
            variants={{
              enter: (d: number) => ({ opacity: 0, x: d * 16 }),
              center: { opacity: 1, x: 0 },
              exit:  (d: number) => ({ opacity: 0, x: d * -16 }),
            }}
            initial="enter" animate="center" exit="exit"
            transition={{ duration: 0.22, ease }}
            style={{
              fontFamily: 'var(--font-playfair,Georgia,serif)',
              fontSize: 18, color: '#F0EBE0', fontWeight: 400,
            }}
          >
            {MONTHS[calMonth]} {calYear}
          </motion.span>
        </AnimatePresence>

        <button
          onClick={goNext}
          style={{
            width: 34, height: 34, borderRadius: '50%',
            border: '1px solid rgba(201,168,76,0.5)',
            background: 'transparent', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: GOLD, transition: 'all 0.2s ease',
          }}
          onMouseEnter={e => (e.currentTarget.style.background = 'rgba(201,168,76,0.08)')}
          onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M9 18l6-6-6-6"/></svg>
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', marginBottom: 4 }}>
        {DAYS_HEADER.map(d => (
          <div key={d} style={{
            textAlign: 'center', padding: '6px 0',
            fontSize: 9, letterSpacing: '0.18em', textTransform: 'uppercase',
            color: d === 'Su' ? 'rgba(201,168,76,0.3)' : 'rgba(201,168,76,0.7)',
            fontFamily: 'var(--font-inter,sans-serif)',
          }}>{d}</div>
        ))}
      </div>

      <motion.div
        key={`grid-${calYear}-${calMonth}`}
        initial="hidden"
        animate="visible"
        variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.012 } } }}
        style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: 2 }}
      >
        {cells.map((cell, i) => {
          if (!cell.date || cell.status === 'empty') return <div key={i} />

          const isSelected  = selectedDate?.toDateString() === cell.date.toDateString()
          const interactive = cell.status === 'available' || cell.status === 'limited'
          const dimmed      = cell.status === 'past' || cell.status === 'unavailable'
          const isLimited   = cell.status === 'limited'

          return (
            <motion.button
              key={i}
              variants={{
                hidden:  { opacity: 0, scale: 0.7 },
                visible: { opacity: 1, scale: 1, transition: { duration: 0.2, ease } },
              }}
              onClick={() => interactive && onSelect(cell.date!)}
              whileHover={interactive && !isSelected ? { scale: 1.08 } : {}}
              whileTap={interactive ? { scale: 0.94 } : {}}
              onMouseEnter={e => {
                if (!interactive || isSelected) return
                const el = e.currentTarget as HTMLButtonElement
                el.style.background = isLimited ? 'rgba(201,168,76,0.22)' : 'rgba(201,168,76,0.14)'
                el.style.borderColor = isLimited ? GOLD : 'rgba(201,168,76,0.65)'
                el.style.boxShadow = isLimited
                  ? '0 0 18px rgba(201,168,76,0.35), inset 0 0 12px rgba(201,168,76,0.08)'
                  : '0 0 14px rgba(201,168,76,0.22)'
              }}
              onMouseLeave={e => {
                if (!interactive || isSelected) return
                const el = e.currentTarget as HTMLButtonElement
                el.style.background = isLimited ? 'rgba(201,168,76,0.1)' : 'rgba(201,168,76,0.05)'
                el.style.borderColor = isLimited ? 'rgba(201,168,76,0.55)' : 'rgba(201,168,76,0.25)'
                el.style.boxShadow = isLimited ? '0 0 10px rgba(201,168,76,0.15)' : 'none'
              }}
              style={{
                position: 'relative',
                aspectRatio: '1',
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center',
                borderRadius: '50%',
                border: isSelected
                  ? `2px solid ${GOLD}`
                  : isLimited
                  ? '1.5px solid rgba(201,168,76,0.55)'
                  : interactive
                  ? '1.5px solid rgba(201,168,76,0.25)'
                  : '1.5px solid transparent',
                background: isSelected
                  ? GOLD
                  : isLimited
                  ? 'rgba(201,168,76,0.1)'
                  : interactive
                  ? 'rgba(201,168,76,0.05)'
                  : 'transparent',
                cursor: interactive ? 'pointer' : 'default',
                outline: 'none', padding: 0,
                boxShadow: isSelected
                  ? '0 0 28px rgba(201,168,76,0.55), 0 0 8px rgba(201,168,76,0.3)'
                  : isLimited
                  ? '0 0 10px rgba(201,168,76,0.15)'
                  : 'none',
                transition: 'background 0.18s ease, border-color 0.18s ease, box-shadow 0.18s ease',
              }}
            >
              <span style={{
                fontFamily: 'var(--font-inter,sans-serif)',
                fontSize: isLimited ? 12 : 13,
                fontWeight: isSelected ? 700 : isLimited ? 600 : 400,
                color: isSelected ? '#0A0A10'
                  : dimmed ? 'rgba(255,255,255,0.18)'
                  : isLimited ? GOLD
                  : '#E8E0D0',
                lineHeight: 1, userSelect: 'none',
              }}>
                {cell.date.getDate()}
              </span>
              {isLimited && !isSelected && (
                <span style={{
                  fontSize: 6, letterSpacing: '0.12em', textTransform: 'uppercase',
                  color: 'rgba(201,168,76,0.75)', fontFamily: 'var(--font-inter,sans-serif)',
                  lineHeight: 1, marginTop: 2, userSelect: 'none',
                }}>
                  few
                </span>
              )}
            </motion.button>
          )
        })}
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 18 }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <div style={{ width: 18, height: 18, borderRadius: '50%', border: '1.5px solid rgba(201,168,76,0.25)', background: 'rgba(201,168,76,0.05)' }} />
          <span style={{ fontSize: 10, color: 'rgba(240,235,224,0.45)', fontFamily: 'var(--font-inter,sans-serif)', letterSpacing: '0.08em' }}>Available</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <div style={{ width: 18, height: 18, borderRadius: '50%', border: '1.5px solid rgba(201,168,76,0.55)', background: 'rgba(201,168,76,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontSize: 7, color: GOLD, fontFamily: 'var(--font-inter,sans-serif)', fontWeight: 600 }}>FEW</span>
          </div>
          <span style={{ fontSize: 10, color: 'rgba(201,168,76,0.65)', fontFamily: 'var(--font-inter,sans-serif)', letterSpacing: '0.08em' }}>Limited slots</span>
        </div>
      </motion.div>
    </div>
  )
}

function TimeStep({
  date, selectedTime, onSelect,
}: {
  date: Date
  selectedTime: string | null
  onSelect: (time: string) => void
}) {
  const slots = useMemo(() => getSlotsForDate(date), [date])

  return (
    <div>
      <div style={{ overflow: 'hidden', marginBottom: 6 }}>
        <motion.h2
          initial={{ y: '110%' }} animate={{ y: 0 }}
          transition={{ duration: 0.72, ease }}
          style={{
            fontFamily: 'var(--font-playfair,Georgia,serif)',
            fontSize: 'clamp(26px,3vw,40px)',
            color: '#F0EBE0', fontWeight: 400, lineHeight: 1.1, margin: 0,
          }}
        >
          Pick your time.
        </motion.h2>
      </div>

      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ delay: 0.22 }}
        style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 32 }}
      >
        <div style={{ width: 4, height: 4, borderRadius: '50%', background: GOLD, opacity: 0.55 }} />
        <span style={{
          fontFamily: 'var(--font-inter,sans-serif)', fontSize: 13,
          color: 'rgba(201,168,76,0.65)', letterSpacing: '0.04em',
        }}>
          {formatDate(date)}
        </span>
      </motion.div>

      <motion.div
        initial="hidden" animate="visible"
        variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.09 } } }}
        style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}
        className="slots-grid"
      >
        {slots.map((slot) => {
          const isSelected = selectedTime === slot.time
          return (
            <motion.button
              key={slot.time}
              variants={{
                hidden:  { opacity: 0, y: 24 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.48, ease } },
              }}
              onClick={() => !slot.booked && onSelect(slot.time)}
              whileHover={!slot.booked ? { y: -3, transition: { duration: 0.2 } } : {}}
              whileTap={!slot.booked ? { scale: 0.98 } : {}}
              style={{
                position: 'relative',
                padding: 'clamp(20px,2.5vw,28px) clamp(16px,2vw,24px)',
                border: `1.5px solid ${
                  isSelected  ? GOLD
                  : slot.booked ? 'rgba(201,168,76,0.08)'
                  : 'rgba(201,168,76,0.28)'
                }`,
                borderRadius: 8,
                background: isSelected
                  ? 'rgba(201,168,76,0.1)'
                  : slot.booked ? 'rgba(255,255,255,0.02)' : 'rgba(201,168,76,0.03)',
                cursor: slot.booked ? 'not-allowed' : 'pointer',
                textAlign: 'left', outline: 'none',
                boxShadow: isSelected ? `0 0 28px rgba(201,168,76,0.25)` : 'none',
                transition: 'border-color 0.22s ease, background 0.22s ease, box-shadow 0.22s ease',
              }}
            >
              {isSelected && (
                <motion.div
                  initial={{ scale: 0 }} animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 440, damping: 20 }}
                  style={{
                    position: 'absolute', top: 10, right: 10,
                    width: 20, height: 20, borderRadius: '50%', background: GOLD,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}
                >
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#0A0A10" strokeWidth="3" strokeLinecap="round"><path d="M5 12l5 5L20 7"/></svg>
                </motion.div>
              )}
              {slot.booked && (
                <div style={{
                  position: 'absolute', top: 10, right: 10,
                  padding: '2px 8px',
                  border: '1px solid rgba(255,255,255,0.06)',
                  borderRadius: 2, background: 'rgba(255,255,255,0.03)',
                  fontSize: 8, letterSpacing: '0.2em', textTransform: 'uppercase',
                  color: 'rgba(255,255,255,0.18)',
                  fontFamily: 'var(--font-inter,sans-serif)',
                }}>
                  Booked
                </div>
              )}
              <div style={{
                fontFamily: 'var(--font-playfair,Georgia,serif)',
                fontSize: 'clamp(22px,2.5vw,30px)', fontWeight: 400,
                color: slot.booked ? 'rgba(255,255,255,0.13)' : isSelected ? GOLD : '#E0D8C8',
                marginBottom: 5, lineHeight: 1,
                textDecoration: slot.booked ? 'line-through' : 'none',
                textDecorationColor: 'rgba(255,255,255,0.15)',
              }}>
                {slot.time}
              </div>
              <div style={{
                fontFamily: 'var(--font-inter,sans-serif)',
                fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase',
                color: slot.booked ? 'rgba(255,255,255,0.1)' : 'rgba(201,168,76,0.45)',
              }}>
                {slot.period}
              </div>
            </motion.button>
          )
        })}
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ delay: 0.55 }}
        style={{
          fontFamily: 'var(--font-inter,sans-serif)',
          fontSize: 12, color: '#2A3848', marginTop: 20, lineHeight: 1.7,
        }}
      >
        Each session is 60–90 minutes. Our consultant will be ready and waiting for you.
      </motion.p>

      <style>{`@media (max-width: 400px) { .slots-grid { grid-template-columns: 1fr !important; } }`}</style>
    </div>
  )
}

function BookingField({
  label, type = 'text', placeholder, required = true, value, onChange, multiline = false,
}: {
  label: string
  type?: string
  placeholder?: string
  required?: boolean
  value: string
  onChange: (v: string) => void
  multiline?: boolean
}) {
  const [focused, setFocused] = useState(false)
  const lit = focused || value.length > 0

  const commonStyle: React.CSSProperties = {
    width: '100%', background: 'transparent', border: 'none',
    borderBottom: `1px solid ${focused ? GOLD : 'rgba(201,168,76,0.18)'}`,
    color: '#F0EBE0', fontSize: 15, fontFamily: 'var(--font-inter,sans-serif)',
    padding: '16px 0 8px', outline: 'none',
    transition: 'border-color 0.2s ease',
  }

  return (
    <div style={{ position: 'relative', marginBottom: 36 }}>
      <label style={{
        position: 'absolute', top: lit ? -18 : 16, left: 0,
        fontSize: lit ? 9 : 14,
        color: focused ? GOLD : lit ? 'rgba(201,168,76,0.45)' : 'rgba(201,168,76,0.35)',
        letterSpacing: lit ? '0.22em' : '0.04em',
        textTransform: lit ? 'uppercase' : 'none',
        fontFamily: 'var(--font-inter,sans-serif)',
        pointerEvents: 'none',
        transition: 'all 0.22s ease',
      }}>
        {label}{required && ' *'}
      </label>
      {multiline ? (
        <textarea
          value={value}
          onChange={e => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          rows={3}
          placeholder={lit ? placeholder : ''}
          style={{ ...commonStyle, resize: 'none', lineHeight: 1.6 }}
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={e => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={lit ? placeholder : ''}
          style={commonStyle}
        />
      )}
      <motion.div
        initial={false}
        animate={{ scaleX: focused ? 1 : 0, opacity: focused ? 1 : 0 }}
        transition={{ duration: 0.28 }}
        style={{
          position: 'absolute', bottom: 0, left: 0, right: 0,
          height: 1.5, background: GOLD, transformOrigin: 'left',
        }}
      />
    </div>
  )
}

interface FormData { name: string; phone: string; email: string; note: string }

function DetailsStep({
  date, time, form, onChange, onSubmit, submitting,
}: {
  date: Date; time: string
  form: FormData
  onChange: (k: keyof FormData, v: string) => void
  onSubmit: () => void
  submitting: boolean
}) {
  const isValid = form.name.trim() && form.phone.trim() && form.email.trim()

  return (
    <div>
      <div style={{ overflow: 'hidden', marginBottom: 6 }}>
        <motion.h2
          initial={{ y: '110%' }} animate={{ y: 0 }}
          transition={{ duration: 0.72, ease }}
          style={{
            fontFamily: 'var(--font-playfair,Georgia,serif)',
            fontSize: 'clamp(26px,3vw,40px)',
            color: '#F0EBE0', fontWeight: 400, lineHeight: 1.1, margin: 0,
          }}
        >
          Almost there.
        </motion.h2>
      </div>
      <motion.p
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ delay: 0.22 }}
        style={{ fontFamily: 'var(--font-inter,sans-serif)', fontSize: 13, color: '#6B8299', lineHeight: 1.75, marginBottom: 28 }}
      >
        Just a few details to hold your slot.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.32 }}
        style={{
          display: 'inline-flex', alignItems: 'center', gap: 10,
          padding: '9px 16px', borderRadius: 40,
          border: '1px solid rgba(201,168,76,0.22)',
          background: 'rgba(201,168,76,0.04)', marginBottom: 40,
          flexWrap: 'wrap',
        }}
      >
        <div style={{ width: 5, height: 5, borderRadius: '50%', background: GOLD, flexShrink: 0 }} />
        <span style={{ fontFamily: 'var(--font-inter,sans-serif)', fontSize: 12, color: 'rgba(201,168,76,0.75)', letterSpacing: '0.04em' }}>
          {formatShortDate(date)} · {time}
        </span>
        <span style={{ fontSize: 12, color: '#2A3848', fontFamily: 'var(--font-inter,sans-serif)' }}>
          · 60–90 min guided session
        </span>
      </motion.div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.42 }} style={{ paddingTop: 8 }}>
        <BookingField label="Full name"     value={form.name}  onChange={v => onChange('name', v)} />
        <BookingField label="Phone number"  value={form.phone} onChange={v => onChange('phone', v)} type="tel" placeholder="+254…" />
        <BookingField label="Email address" value={form.email} onChange={v => onChange('email', v)} type="email" />
        <BookingField label="Anything you'd like us to know" value={form.note} onChange={v => onChange('note', v)} required={false} multiline />

        <div style={{
          padding: '14px 18px', borderRadius: 4, marginBottom: 32,
          border: '1px solid rgba(201,168,76,0.1)',
          background: 'rgba(201,168,76,0.03)',
        }}>
          <p style={{
            fontFamily: 'var(--font-inter,sans-serif)', fontSize: 12,
            color: 'rgba(201,168,76,0.55)', lineHeight: 1.75, margin: 0,
          }}>
            A <strong style={{ color: GOLD }}>KES 2,500</strong> deposit is payable at arrival — credited in full toward your curtain order. No payment required today.
          </p>
        </div>

        <motion.button
          onClick={onSubmit}
          disabled={!isValid || submitting}
          whileHover={isValid && !submitting ? { y: -2 } : {}}
          whileTap={isValid && !submitting ? { scale: 0.99 } : {}}
          style={{
            width: '100%', padding: '18px 32px',
            background: isValid && !submitting
              ? 'linear-gradient(135deg,#B8922A 0%,#E8C87A 50%,#C9A84C 100%)'
              : 'rgba(201,168,76,0.1)',
            color: isValid && !submitting ? '#0A0A10' : 'rgba(201,168,76,0.28)',
            border: 'none', borderRadius: 3,
            cursor: isValid && !submitting ? 'pointer' : 'not-allowed',
            fontFamily: 'var(--font-inter,sans-serif)', fontSize: 13,
            fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12,
            transition: 'all 0.3s ease',
            boxShadow: isValid && !submitting ? '0 8px 32px rgba(201,168,76,0.28)' : 'none',
          }}
        >
          {submitting ? (
            <>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                style={{
                  width: 16, height: 16, borderRadius: '50%',
                  border: '2px solid rgba(201,168,76,0.25)',
                  borderTop: `2px solid ${GOLD}`,
                }}
              />
              Confirming your session…
            </>
          ) : (
            <>
              Confirm My Session
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="m5 12h14M13 6l6 6-6 6"/></svg>
            </>
          )}
        </motion.button>
      </motion.div>
    </div>
  )
}

const PARTICLES = Array.from({ length: 20 }, (_, i) => ({
  x:    (i * 41 + 17) % 100,
  y:    (i * 53 + 11) % 100,
  size: 2 + (i % 3),
  dur:  3.5 + (i % 5) * 1.1,
  del:  i * 0.14,
}))

function ConfirmationStep({ date, time, name }: { date: Date; time: string; name: string }) {
  const [curtainsOpen,   setCurtainsOpen]   = useState(false)
  const [contentVisible, setContentVisible] = useState(false)

  useEffect(() => {
    const t1 = setTimeout(() => setCurtainsOpen(true),   420)
    const t2 = setTimeout(() => setContentVisible(true), 1700)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [])

  const calUrl = buildGoogleCalendarUrl(date, time)
  const waUrl  = whatsappUrl(`Hi R&J Interiors! I just booked a studio session for ${formatShortDate(date)} at ${time}. My name is ${name}.`)
  const curtainTransition = { duration: 1.5, ease: [0.25, 0.46, 0.45, 0.94] as const }

  return (
    <div style={{ position: 'relative', overflow: 'hidden', minHeight: 540 }}>
      <motion.div
        animate={{ x: curtainsOpen ? '-100%' : '0%' }}
        transition={curtainTransition}
        style={{
          position: 'absolute', top: 0, left: 0,
          width: '50%', height: '100%', zIndex: 20,
          background: 'linear-gradient(to right, #060A14 0%, #0A1020 75%, rgba(201,168,76,0.06) 100%)',
        }}
      >
        {[16, 30, 44, 58, 72].map(x => (
          <div key={x} style={{ position: 'absolute', top: 0, bottom: 0, left: `${x}%`, width: 1, background: 'rgba(201,168,76,0.035)' }} />
        ))}
        <div style={{ position: 'absolute', top: 0, bottom: 0, right: 0, width: 32, background: 'linear-gradient(to right, transparent, rgba(0,0,0,0.35))' }} />
      </motion.div>

      <motion.div
        animate={{ x: curtainsOpen ? '100%' : '0%' }}
        transition={curtainTransition}
        style={{
          position: 'absolute', top: 0, right: 0,
          width: '50%', height: '100%', zIndex: 20,
          background: 'linear-gradient(to left, #060A14 0%, #0A1020 75%, rgba(201,168,76,0.06) 100%)',
        }}
      >
        {[16, 30, 44, 58, 72].map(x => (
          <div key={x} style={{ position: 'absolute', top: 0, bottom: 0, right: `${x}%`, width: 1, background: 'rgba(201,168,76,0.035)' }} />
        ))}
        <div style={{ position: 'absolute', top: 0, bottom: 0, left: 0, width: 32, background: 'linear-gradient(to left, transparent, rgba(0,0,0,0.35))' }} />
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: contentVisible ? 1 : 0 }}
        transition={{ duration: 0.7 }}
        style={{ position: 'relative', zIndex: 5, padding: 'clamp(36px,5vw,56px) clamp(24px,4vw,44px)', textAlign: 'center' }}
      >
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
          {PARTICLES.map((p, i) => (
            <motion.div
              key={i}
              animate={{ opacity: [0, 0.55, 0], scale: [0.8, 1.5, 0.8], y: [-6, 6, -6] }}
              transition={{ duration: p.dur, delay: p.del + 0.3, repeat: Infinity, ease: 'easeInOut' }}
              style={{
                position: 'absolute', left: `${p.x}%`, top: `${p.y}%`,
                width: p.size, height: p.size, borderRadius: '50%', background: GOLD,
              }}
            />
          ))}
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 28 }}>
          <div style={{ position: 'relative', width: 76, height: 76 }}>
            <svg viewBox="0 0 76 76" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
              <motion.circle cx="38" cy="38" r="34" fill="none" stroke={GOLD} strokeWidth="1.5"
                initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 0.38 }}
                transition={{ duration: 1.1, ease: 'easeOut', delay: 0.1 }} />
            </svg>
            <motion.div
              animate={{ scale: [1, 1.5, 1], opacity: [0.25, 0, 0.25] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: 'easeOut', delay: 1 }}
              style={{ position: 'absolute', inset: -8, borderRadius: '50%', border: `1px solid rgba(201,168,76,0.3)` }}
            />
            <svg viewBox="0 0 76 76" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
              <motion.path d="M 22 38 L 33 50 L 54 26" fill="none" stroke={GOLD} strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round"
                initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 0.75, ease: 'easeOut', delay: 0.55 }} />
            </svg>
          </div>
        </div>

        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
          <p style={{ fontFamily: 'var(--font-inter,sans-serif)', fontSize: 9, color: GOLD, letterSpacing: '0.4em', textTransform: 'uppercase', marginBottom: 14 }}>
            Session Confirmed
          </p>
          <h2 style={{ fontFamily: 'var(--font-playfair,Georgia,serif)', fontSize: 'clamp(26px,3.5vw,42px)', color: '#F0EBE0', fontWeight: 400, lineHeight: 1.1, margin: '0 0 4px' }}>
            We&apos;ll see you then,
          </h2>
          <h2 style={{ fontFamily: 'var(--font-playfair,Georgia,serif)', fontSize: 'clamp(26px,3.5vw,42px)', color: GOLD, fontStyle: 'italic', fontWeight: 400, lineHeight: 1.1, margin: '0 0 36px' }}>
            {name.split(' ')[0]}.
          </h2>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
          style={{ border: '1px solid rgba(201,168,76,0.18)', borderRadius: 8, padding: 'clamp(20px,3vw,28px)', background: 'rgba(201,168,76,0.025)', textAlign: 'left', marginBottom: 28 }}
        >
          {[
            { label: 'Date',     value: formatDate(date) },
            { label: 'Time',     value: `${time} — up to 90 min` },
            { label: 'Location', value: 'R&J Interiors Studio, Nairobi' },
            { label: 'Deposit',  value: 'KES 2,500 — payable at arrival' },
          ].map(({ label, value }) => (
            <div key={label} style={{ display: 'flex', alignItems: 'flex-start', gap: 16, padding: '11px 0', borderBottom: '1px solid rgba(201,168,76,0.06)' }}>
              <span style={{ fontFamily: 'var(--font-inter,sans-serif)', fontSize: 9, color: 'rgba(201,168,76,0.42)', letterSpacing: '0.22em', textTransform: 'uppercase', minWidth: 68, paddingTop: 2, flexShrink: 0 }}>
                {label}
              </span>
              <span style={{ fontFamily: 'var(--font-inter,sans-serif)', fontSize: 14, color: '#B8B0A0', lineHeight: 1.55 }}>
                {value}
              </span>
            </div>
          ))}
        </motion.div>

        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.55 }}
          style={{ fontFamily: 'var(--font-inter,sans-serif)', fontSize: 13, color: '#6B8299', lineHeight: 1.7, marginBottom: 32 }}
        >
          Our consultant will contact you within 24 hours to confirm your slot.
          Check your email for a copy of this booking.
        </motion.p>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.68 }}
          style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}
        >
          <a href={calUrl} target="_blank" rel="noopener noreferrer"
            style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '13px 22px', borderRadius: 3, border: '1.5px solid rgba(201,168,76,0.38)', color: GOLD, textDecoration: 'none', fontFamily: 'var(--font-inter,sans-serif)', fontSize: 12, letterSpacing: '0.08em', transition: 'all 0.2s ease' }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(201,168,76,0.07)'; e.currentTarget.style.borderColor = GOLD }}
            onMouseLeave={e => { e.currentTarget.style.background = ''; e.currentTarget.style.borderColor = 'rgba(201,168,76,0.38)' }}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
            Add to Calendar
          </a>
          <a href={waUrl} target="_blank" rel="noopener noreferrer"
            style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '13px 22px', borderRadius: 3, background: 'rgba(37,211,102,0.07)', border: '1.5px solid rgba(37,211,102,0.22)', color: '#25D166', textDecoration: 'none', fontFamily: 'var(--font-inter,sans-serif)', fontSize: 12, letterSpacing: '0.08em', transition: 'background 0.2s ease' }}
            onMouseEnter={e => (e.currentTarget.style.background = 'rgba(37,211,102,0.14)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'rgba(37,211,102,0.07)')}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741 1.14.734-3.719-.235-.374A9.86 9.86 0 012 12c0-5.514 4.486-10 10-10s10 4.486 10 10-4.486 10-10 10"/></svg>
            WhatsApp Us
          </a>
        </motion.div>
      </motion.div>
    </div>
  )
}

interface FormDataState { name: string; phone: string; email: string; note: string }

export default function ContactClient() {
  const [step,         setStep]         = useState(1)
  const [direction,    setDirection]    = useState(1)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const [submitting,   setSubmitting]   = useState(false)
  const [form, setForm] = useState<FormDataState>({ name: '', phone: '', email: '', note: '' })

  function goTo(n: number) {
    setDirection(n > step ? 1 : -1)
    setStep(n)
  }

  function handleDateSelect(date: Date) {
    setSelectedDate(date)
    setTimeout(() => goTo(2), 280)
  }

  function handleTimeSelect(time: string) {
    setSelectedTime(time)
    setTimeout(() => goTo(3), 280)
  }

  async function handleSubmit() {
    if (!selectedDate || !selectedTime || !form.name || !form.phone || !form.email) return
    setSubmitting(true)
    await sendBooking({
      name:  form.name,
      phone: form.phone,
      email: form.email,
      note:  form.note,
      date:  formatDate(selectedDate),
      time:  selectedTime,
    })
    setSubmitting(false)
    goTo(4)
  }

  const stepVariants = {
    enter:  (d: number) => ({ opacity: 0, x: d * 28 }),
    center: { opacity: 1, x: 0 },
    exit:   (d: number) => ({ opacity: 0, x: d * -28 }),
  }

  return (
    <main style={{ background: '#0D1B2E', minHeight: '100dvh' }}>
      <LandingNavbar />

      <section style={{
        padding: 'clamp(88px,10vw,110px) clamp(24px,6vw,100px) 0',
        textAlign: 'center', position: 'relative', overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', top: '55%', left: '50%',
          transform: 'translate(-50%,-50%)',
          width: '70vw', height: '50vw', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(201,168,76,0.09) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        <div style={{ overflow: 'hidden', marginBottom: 6 }}>
          <motion.h1
            initial={{ y: '110%' }} animate={{ y: 0 }}
            transition={{ duration: 0.88, ease, delay: 0.14 }}
            style={{
              fontFamily: 'var(--font-playfair,Georgia,serif)',
              fontSize: 'clamp(36px,5.5vw,72px)',
              color: '#F0EBE0', fontWeight: 400, lineHeight: 1.05, margin: 0,
            }}
          >
            Reserve your session.
          </motion.h1>
        </div>
        <div style={{ overflow: 'hidden', marginBottom: 28 }}>
          <motion.h1
            initial={{ y: '110%' }} animate={{ y: 0 }}
            transition={{ duration: 0.88, ease, delay: 0.26 }}
            style={{
              fontFamily: 'var(--font-playfair,Georgia,serif)',
              fontSize: 'clamp(36px,5.5vw,72px)',
              color: GOLD, fontStyle: 'italic', fontWeight: 400, lineHeight: 1.05, margin: 0,
            }}
          >
            Step inside first.
          </motion.h1>
        </div>
      </section>

      <section style={{ padding: 'clamp(16px,2vw,24px) clamp(24px,6vw,100px) clamp(80px,10vw,120px)' }}>
        <div style={{ maxWidth: 620, margin: '0 auto' }}>
          {step < 4 && <StepIndicator step={step} />}

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease, delay: 0.35 }}
            style={{
              border: '1px solid rgba(201,168,76,0.2)',
              borderRadius: 12, background: '#091628',
              overflow: 'hidden', boxShadow: '0 32px 80px rgba(0,0,0,0.35)',
            }}
          >
            {step > 1 && step < 4 && (
              <div style={{ padding: '14px 28px', borderBottom: '1px solid rgba(201,168,76,0.055)' }}>
                <button
                  onClick={() => goTo(step - 1)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 7,
                    background: 'transparent', border: 'none',
                    color: 'rgba(201,168,76,0.42)', cursor: 'pointer',
                    fontFamily: 'var(--font-inter,sans-serif)', fontSize: 12,
                    letterSpacing: '0.08em', padding: 0, transition: 'color 0.2s',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.color = GOLD)}
                  onMouseLeave={e => (e.currentTarget.style.color = 'rgba(201,168,76,0.42)')}
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M15 18l-6-6 6-6"/></svg>
                  Back
                </button>
              </div>
            )}

            <div style={{ padding: step === 4 ? 0 : 'clamp(28px,4vw,48px)' }}>
              <AnimatePresence mode="wait" custom={direction}>
                {step === 1 && (
                  <motion.div key="s1" custom={direction} variants={stepVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.34, ease }}>
                    <CalendarStep selectedDate={selectedDate} onSelect={handleDateSelect} />
                  </motion.div>
                )}
                {step === 2 && selectedDate && (
                  <motion.div key="s2" custom={direction} variants={stepVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.34, ease }}>
                    <TimeStep date={selectedDate} selectedTime={selectedTime} onSelect={handleTimeSelect} />
                  </motion.div>
                )}
                {step === 3 && selectedDate && selectedTime && (
                  <motion.div key="s3" custom={direction} variants={stepVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.34, ease }}>
                    <DetailsStep
                      date={selectedDate} time={selectedTime}
                      form={form}
                      onChange={(k, v) => setForm(f => ({ ...f, [k]: v }))}
                      onSubmit={handleSubmit}
                      submitting={submitting}
                    />
                  </motion.div>
                )}
                {step === 4 && selectedDate && selectedTime && (
                  <motion.div key="s4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.45 }}>
                    <ConfirmationStep date={selectedDate} time={selectedTime} name={form.name} />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          {step < 4 && (
            <motion.p
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              style={{
                fontFamily: 'var(--font-inter,sans-serif)',
                fontSize: 11, color: '#1A2430',
                marginTop: 22, textAlign: 'center', letterSpacing: '0.06em',
              }}
            >
              No payment required today · KES 2,500 deposit at arrival · Guided consultation
            </motion.p>
          )}
        </div>
      </section>

      <LandingFooter />
    </main>
  )
}
