export default function SectionDivider({ from, to }: { from?: string; to?: string }) {
  return (
    <div style={{ padding: '0 6vw' }}>
      <div style={{
        maxWidth:   '1400px',
        width:      '100%',
        margin:     '0 auto',
        height:     '1px',
        background: 'linear-gradient(90deg, transparent, rgba(201,168,76,0.1) 20%, rgba(201,168,76,0.18) 50%, rgba(201,168,76,0.1) 80%, transparent)',
      }} />
    </div>
  )
}
