import type { CSSProperties } from 'react'

export default function GoldenSeparator({ style }: { style?: CSSProperties }) {
  return (
    <div style={{
      display:       'flex',
      alignItems:    'center',
      height:        '40px',
      padding:       '0 40px',
      marginBottom:  '40px',
      ...style,
    }}>
      <div style={{
        flex:       1,
        height:     '1px',
        background: 'linear-gradient(to right, transparent, rgba(201,168,76,0.6))',
        marginRight:'16px',
      }} />
      <div style={{
        width:      '8px',
        height:     '8px',
        background: '#C9A84C',
        transform:  'rotate(45deg)',
        flexShrink: 0,
        boxShadow:  '0 0 10px rgba(201,168,76,0.6)',
      }} />
      <div style={{
        flex:      1,
        height:    '1px',
        background:'linear-gradient(to left, transparent, rgba(201,168,76,0.6))',
        marginLeft:'16px',
      }} />
    </div>
  )
}
