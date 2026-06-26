'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface Props {
  dateValue: string | null
  timeValue: string | null
  onDate:    (d: string) => void
  onTime:    (t: string) => void
}

const SAGE   = '#4A5C44'
const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December']
const DAY_H  = ['Su','Mo','Tu','We','Th','Fr','Sa']

const SLOTS = [
  { time: '10:00 AM', period: 'Morning'        },
  { time: '12:00 PM', period: 'Midday'         },
  { time: '2:00 PM',  period: 'Afternoon'      },
  { time: '4:00 PM',  period: 'Late afternoon' },
]

function buildCells(year: number, month: number) {
  const today = new Date(); today.setHours(0,0,0,0)
  const first  = new Date(year, month, 1)
  const last   = new Date(year, month + 1, 0)
  const cells: { date: Date | null; disabled: boolean }[] = []
  for (let i = 0; i < first.getDay(); i++) cells.push({ date: null, disabled: true })
  for (let d = 1; d <= last.getDate(); d++) {
    const date = new Date(year, month, d); date.setHours(0,0,0,0)
    cells.push({ date, disabled: date < today || date.getDay() === 0 })
  }
  return cells
}

function toISO(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`
}

function fromISO(iso: string): Date {
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(y, m - 1, d)
}

export function BookingDateStep({ dateValue, timeValue, onDate, onTime }: Props) {
  const today = new Date()
  const [year,  setYear]  = useState(today.getFullYear())
  const [month, setMonth] = useState(today.getMonth())
  const [dir,   setDir]   = useState(0)

  const cells      = useMemo(() => buildCells(year, month), [year, month])
  const canGoPrev  = year > today.getFullYear() || month > today.getMonth()
  const selectedDate = dateValue ? fromISO(dateValue) : null

  function prevMonth() {
    if (!canGoPrev) return
    setDir(-1)
    if (month === 0) { setMonth(11); setYear(y => y - 1) }
    else setMonth(m => m - 1)
  }
  function nextMonth() {
    setDir(1)
    if (month === 11) { setMonth(0); setYear(y => y + 1) }
    else setMonth(m => m + 1)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Calendar */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <button onClick={prevMonth} disabled={!canGoPrev} style={{
            width: 36, height: 36, borderRadius: '50%', border: '1.5px solid #E2DDD6',
            background: 'transparent', cursor: canGoPrev ? 'pointer' : 'default',
            opacity: canGoPrev ? 1 : 0.3, display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={SAGE} strokeWidth="2.2" strokeLinecap="round"><path d="M15 18l-6-6 6-6"/></svg>
          </button>

          <AnimatePresence mode="wait" custom={dir}>
            <motion.span key={`${year}-${month}`} custom={dir}
              variants={{ enter: (d:number) => ({ opacity:0, x: d*12 }), center: { opacity:1, x:0 }, exit: (d:number) => ({ opacity:0, x: d*-12 }) }}
              initial="enter" animate="center" exit="exit"
              transition={{ duration: 0.2 }}
              style={{ fontFamily: 'var(--font-playfair, Georgia, serif)', fontSize: 17, color: '#2A2520' }}
            >
              {MONTHS[month]} {year}
            </motion.span>
          </AnimatePresence>

          <button onClick={nextMonth} style={{
            width: 36, height: 36, borderRadius: '50%', border: '1.5px solid #E2DDD6',
            background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={SAGE} strokeWidth="2.2" strokeLinecap="round"><path d="M9 18l6-6-6-6"/></svg>
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', marginBottom: 4 }}>
          {DAY_H.map(d => (
            <div key={d} style={{ textAlign: 'center', padding: '4px 0', fontSize: 10, fontFamily: 'var(--font-inter, sans-serif)', color: '#A09890', letterSpacing: '0.1em' }}>{d}</div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: 2 }}>
          {cells.map((cell, i) => {
            if (!cell.date) return <div key={i} />
            const isSelected = selectedDate && cell.date.toDateString() === selectedDate.toDateString()
            return (
              <button key={i} onClick={() => !cell.disabled && onDate(toISO(cell.date!))}
                style={{
                  aspectRatio: '1', borderRadius: '50%', border: `1.5px solid ${isSelected ? SAGE : 'transparent'}`,
                  background:  isSelected ? SAGE : 'transparent',
                  cursor:      cell.disabled ? 'default' : 'pointer',
                  display:     'flex', alignItems: 'center', justifyContent: 'center',
                  outline:     'none',
                }}
              >
                <span style={{
                  fontFamily: 'var(--font-inter, sans-serif)', fontSize: 13,
                  color: isSelected ? '#FAFAF8' : cell.disabled ? '#C8C4BC' : '#2A2520',
                  userSelect: 'none',
                }}>
                  {cell.date.getDate()}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Time slots — only shown once a date is picked */}
      {dateValue && (
        <motion.div initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }} transition={{ duration: 0.3 }}>
          <p style={{ fontFamily: 'var(--font-inter, sans-serif)', fontSize: 11, fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', color: SAGE, margin: '0 0 12px' }}>
            Pick a time
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {SLOTS.map(slot => {
              const sel = timeValue === slot.time
              return (
                <button key={slot.time} onClick={() => onTime(slot.time)} style={{
                  padding:       '14px 12px',
                  borderRadius:  12,
                  border:        `1.5px solid ${sel ? SAGE : '#E2DDD6'}`,
                  background:    sel ? '#EEF0E8' : '#FFFFFF',
                  cursor:        'pointer',
                  textAlign:     'left',
                  outline:       'none',
                  transition:    'border-color 0.18s, background 0.18s',
                }}>
                  <p style={{ margin: '0 0 2px', fontFamily: 'var(--font-playfair, Georgia, serif)', fontSize: 18, color: sel ? '#2A2520' : '#3A3530', fontWeight: 400 }}>{slot.time}</p>
                  <p style={{ margin: 0, fontFamily: 'var(--font-inter, sans-serif)', fontSize: 11, color: '#8A8278', letterSpacing: '0.08em', textTransform: 'uppercase' }}>{slot.period}</p>
                </button>
              )
            })}
          </div>
        </motion.div>
      )}
    </div>
  )
}
