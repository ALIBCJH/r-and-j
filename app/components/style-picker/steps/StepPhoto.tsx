'use client'

import { useRef, useState } from 'react'
import { motion }           from 'framer-motion'

interface Props {
  value:    File | null
  onChange: (v: File | null) => void
}

const SAGE = '#4A5C44'

export function StepPhoto({ value, onChange }: Props) {
  const inputRef  = useRef<HTMLInputElement>(null)
  const [preview, setPreview] = useState<string | null>(null)

  function handleFile(file: File) {
    onChange(file)
    const url = URL.createObjectURL(file)
    setPreview(url)
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) handleFile(file)
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    const file = e.dataTransfer.files?.[0]
    if (file?.type.startsWith('image/')) handleFile(file)
  }

  function handleRetake() {
    onChange(null)
    setPreview(null)
    if (inputRef.current) inputRef.current.value = ''
  }

  return (
    <div>
      <p style={{
        fontFamily: 'var(--font-inter, sans-serif)',
        fontSize:   14,
        color:      '#6B6560',
        lineHeight: 1.65,
        margin:     '0 0 20px',
      }}>
        A photo helps us show you curtains in your actual light. You can skip if you prefer.
      </p>

      {preview ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={preview}
            alt="Your room preview"
            style={{
              width:        '100%',
              borderRadius: 16,
              objectFit:    'cover',
              maxHeight:    320,
              display:      'block',
            }}
          />
          <button
            onClick={handleRetake}
            style={{
              marginTop:     12,
              width:         '100%',
              minHeight:     44,
              borderRadius:  10,
              border:        `1.5px solid ${SAGE}`,
              background:    'transparent',
              color:         SAGE,
              fontFamily:    'var(--font-inter, sans-serif)',
              fontSize:      14,
              fontWeight:    500,
              cursor:        'pointer',
              display:       'flex',
              alignItems:    'center',
              justifyContent:'center',
              gap:           8,
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M1 4v6h6M23 20v-6h-6"/>
              <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10M23 14l-4.64 4.36A9 9 0 0 1 3.51 15"/>
            </svg>
            Retake photo
          </button>
        </motion.div>
      ) : (
        <div
          onDrop={handleDrop}
          onDragOver={e => e.preventDefault()}
          onClick={() => inputRef.current?.click()}
          style={{
            border:         '2px dashed #D4CFC8',
            borderRadius:   16,
            padding:        '40px 20px',
            textAlign:      'center',
            cursor:         'pointer',
            background:     '#F3F0EB',
            transition:     'border-color 0.2s, background 0.2s',
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLDivElement).style.borderColor = SAGE
            ;(e.currentTarget as HTMLDivElement).style.background = '#EEF0E8'
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLDivElement).style.borderColor = '#D4CFC8'
            ;(e.currentTarget as HTMLDivElement).style.background = '#F3F0EB'
          }}
        >
          <div style={{
            width:          56,
            height:         56,
            borderRadius:   14,
            background:     '#E8E4DC',
            margin:         '0 auto 16px',
            display:        'flex',
            alignItems:     'center',
            justifyContent: 'center',
          }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
              stroke={SAGE} strokeWidth="1.8" strokeLinecap="round">
              <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
              <circle cx="12" cy="13" r="4"/>
            </svg>
          </div>
          <p style={{
            fontFamily: 'var(--font-inter, sans-serif)',
            fontSize:   15,
            fontWeight: 500,
            color:      '#4A4540',
            margin:     '0 0 6px',
          }}>
            Take or upload a photo
          </p>
          <p style={{
            fontFamily: 'var(--font-inter, sans-serif)',
            fontSize:   13,
            color:      '#8A8278',
            margin:     0,
          }}>
            Tap to use your camera or choose from gallery
          </p>
        </div>
      )}

      {/* Hidden file input — capture=environment opens rear camera on mobile */}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleChange}
        style={{ display: 'none' }}
        aria-label="Upload room photo"
      />
    </div>
  )
}
