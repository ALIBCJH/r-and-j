'use client'

import { useState } from 'react'
import { motion }   from 'framer-motion'

interface Props {
  name:     string
  phone:    string
  email:    string
  onName:   (v: string) => void
  onPhone:  (v: string) => void
  onEmail:  (v: string) => void
}

const SAGE = '#4A5C44'

function Field({
  label, type = 'text', value, onChange, placeholder, hint,
}: {
  label:       string
  type?:       string
  value:       string
  onChange:    (v: string) => void
  placeholder: string
  hint?:       string
}) {
  const [focused, setFocused] = useState(false)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <label style={{
        fontFamily:    'var(--font-inter, sans-serif)',
        fontSize:      11,
        fontWeight:    600,
        letterSpacing: '0.12em',
        textTransform: 'uppercase',
        color:         focused ? SAGE : '#6B6560',
        transition:    'color 0.2s',
      }}>
        {label}
      </label>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={e => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          padding:      '14px 16px',
          borderRadius: 12,
          border:       `1.5px solid ${focused ? SAGE : '#D4CFC8'}`,
          background:   '#FFFFFF',
          fontFamily:   'var(--font-inter, sans-serif)',
          fontSize:     16,
          color:        '#2A2520',
          outline:      'none',
          transition:   'border-color 0.2s',
          width:        '100%',
          boxSizing:    'border-box',
        }}
      />
      {hint && (
        <p style={{
          fontFamily: 'var(--font-inter, sans-serif)',
          fontSize:   11,
          color:      '#A09890',
          margin:     0,
        }}>
          {hint}
        </p>
      )}
    </div>
  )
}

export function BookingContactStep({ name, phone, email, onName, onPhone, onEmail }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      style={{ display: 'flex', flexDirection: 'column', gap: 20 }}
    >
      <p style={{
        fontFamily: 'var(--font-inter, sans-serif)',
        fontSize:   14,
        color:      '#6B6560',
        lineHeight: 1.65,
        margin:     0,
      }}>
        So we know who to expect. Your details stay with us.
      </p>

      <Field
        label="Your name"
        value={name}
        onChange={onName}
        placeholder="Full name"
      />
      <Field
        label="Phone number"
        type="tel"
        value={phone}
        onChange={onPhone}
        placeholder="+254 7XX XXX XXX"
        hint="We'll send your booking confirmation here"
      />
      <Field
        label="Email (optional)"
        type="email"
        value={email}
        onChange={onEmail}
        placeholder="you@example.com"
      />
    </motion.div>
  )
}
