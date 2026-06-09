export default function SectionDivider({ from = '#0F1117', to = '#0F1117' }: { from?: string; to?: string }) {
  return (
    <div style={{
      background: `linear-gradient(180deg, ${from} 0%, ${to} 100%)`,
      padding:    '0 6vw',
      height:     '64px',
      display:    'flex',
      alignItems: 'center',
    }}>
      <div style={{
        maxWidth: '1400px',
        width:    '100%',
        margin:   '0 auto',
        display:  'flex',
        alignItems: 'center',
        gap:      '16px',
      }}>

        {/* Left dashed line — fades in from the left */}
        <div style={{
          flex:            1,
          height:          '1px',
          backgroundImage: 'repeating-linear-gradient(90deg, #C9A84C 0px, #C9A84C 8px, transparent 8px, transparent 18px)',
          WebkitMaskImage: 'linear-gradient(90deg, transparent 0%, rgba(0,0,0,0.9) 55%, rgba(0,0,0,1) 100%)',
          maskImage:       'linear-gradient(90deg, transparent 0%, rgba(0,0,0,0.9) 55%, rgba(0,0,0,1) 100%)',
        }} />

        {/* Central diamond */}
        <div style={{
          width:        '8px',
          height:       '8px',
          background:   '#C9A84C',
          transform:    'rotate(45deg)',
          flexShrink:   0,
          boxShadow:    '0 0 10px rgba(201,168,76,0.7), 0 0 20px rgba(201,168,76,0.3)',
        }} />

        {/* Right dashed line — fades out to the right */}
        <div style={{
          flex:            1,
          height:          '1px',
          backgroundImage: 'repeating-linear-gradient(90deg, #C9A84C 0px, #C9A84C 8px, transparent 8px, transparent 18px)',
          WebkitMaskImage: 'linear-gradient(270deg, transparent 0%, rgba(0,0,0,0.9) 55%, rgba(0,0,0,1) 100%)',
          maskImage:       'linear-gradient(270deg, transparent 0%, rgba(0,0,0,0.9) 55%, rgba(0,0,0,1) 100%)',
        }} />

      </div>
    </div>
  )
}
