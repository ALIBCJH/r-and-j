'use client'

import { motion } from 'framer-motion'

const ease = [0.25, 0.1, 0.25, 1] as const

export default function VisionVideo() {
  return (
    <section style={{
      padding:     'clamp(64px, 8vw, 100px) 6vw',
      background:  '#0D1B2E',
      borderTop:   '1px solid rgba(201,168,76,0.12)',
      borderBottom:'1px solid rgba(201,168,76,0.12)',
    }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>

        {/* Label */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, ease }}
          style={{
            fontFamily:    'var(--font-inter, sans-serif)',
            fontSize:      '11px',
            color:         '#C9A84C',
            letterSpacing: '4px',
            textTransform: 'uppercase',
            textAlign:     'center',
            marginBottom:  '16px',
          }}
        >
          Where We Are Headed
        </motion.p>

        {/* Heading */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7, ease, delay: 0.08 }}
          style={{
            fontFamily:   'var(--font-playfair, Georgia, serif)',
            fontSize:     'clamp(28px, 4vw, 44px)',
            color:        '#FFFFFF',
            fontWeight:   400,
            lineHeight:   1.15,
            textAlign:    'center',
            marginBottom: '12px',
          }}
        >
          A home you can walk through<br />
          <span style={{ color: '#C9A84C', fontStyle: 'italic' }}>before a single curtain is made.</span>
        </motion.h2>

        {/* Subtext */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.65, ease, delay: 0.16 }}
          style={{
            fontFamily:  'var(--font-inter, sans-serif)',
            fontSize:    'clamp(14px, 1.6vw, 17px)',
            color:       '#6B7A8D',
            textAlign:   'center',
            lineHeight:  1.75,
            maxWidth:    '620px',
            margin:      '0 auto 48px',
          }}
        >
          This is the vision driving everything we build at R&amp;J — a fully immersive
          virtual home where you choose every fabric, every drape, every fold of light
          before committing to anything. We are building toward it one step at a time.
        </motion.p>

        {/* Video frame */}
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.98 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.75, ease, delay: 0.2 }}
          style={{
            position:     'relative',
            borderRadius: '12px',
            overflow:     'hidden',
            border:       '1px solid rgba(201,168,76,0.25)',
            boxShadow:    '0 0 0 1px rgba(201,168,76,0.08), 0 32px 80px rgba(0,0,0,0.55)',
            aspectRatio:  '16/9',
            background:   '#0A0F1C',
          }}
        >
          {/* Gold corner accents */}
          {['top-left','top-right','bottom-left','bottom-right'].map(pos => {
            const [v, h] = pos.split('-') as ['top'|'bottom', 'left'|'right']
            return (
              <div key={pos} style={{
                position:    'absolute',
                [v]:         0,
                [h]:         0,
                width:       24,
                height:      24,
                borderTop:   v === 'top'    ? '2px solid rgba(201,168,76,0.7)' : 'none',
                borderBottom:v === 'bottom' ? '2px solid rgba(201,168,76,0.7)' : 'none',
                borderLeft:  h === 'left'   ? '2px solid rgba(201,168,76,0.7)' : 'none',
                borderRight: h === 'right'  ? '2px solid rgba(201,168,76,0.7)' : 'none',
                zIndex:      2,
                pointerEvents:'none',
              }} />
            )
          })}

          <iframe
            src="https://www.youtube.com/embed/otYbvFPA5MI?start=11&rel=0&modestbranding=1&color=white"
            title="Virtual home experience — the R&J vision"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            style={{
              position: 'absolute',
              inset:    0,
              width:    '100%',
              height:   '100%',
              border:   'none',
            }}
          />
        </motion.div>

        {/* Caption */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          style={{
            fontFamily:    'var(--font-inter, sans-serif)',
            fontSize:      '12px',
            color:         '#3A4A5C',
            textAlign:     'center',
            marginTop:     '16px',
            letterSpacing: '0.04em',
          }}
        >
          This is the direction. Our studio is already the first step.
        </motion.p>

      </div>
    </section>
  )
}
