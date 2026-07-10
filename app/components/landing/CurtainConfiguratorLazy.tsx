'use client'

import dynamic from 'next/dynamic'

/**
 * The configurator is a below-the-fold, client-only widget: a <canvas> recolour
 * engine (drawScene), its own room photo, and a ResizeObserver. None of it is
 * needed for the initial paint. Loading it with `ssr: false` keeps its JavaScript
 * (and the framer-motion it pulls in) out of the boot bundle and off the main
 * thread, so the hero can reach LCP sooner. A fixed-height placeholder holds the
 * space to avoid layout shift when the real component hydrates.
 */
const CurtainConfigurator = dynamic(() => import('./CurtainConfigurator'), {
  ssr: false,
  loading: () => (
    <section
      aria-hidden
      style={{
        background: '#0D1B2E',
        borderTop: '1px solid rgba(201,168,76,0.12)',
        minHeight: '820px',
      }}
    />
  ),
})

export default CurtainConfigurator
