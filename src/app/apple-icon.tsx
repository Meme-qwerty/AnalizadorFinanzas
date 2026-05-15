import { ImageResponse } from 'next/og'

export const size = { width: 180, height: 180 }
export const contentType = 'image/png'

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          background: '#2563eb',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'center',
          borderRadius: 38,
          padding: '28px 32px',
          gap: 14,
        }}
      >
        <div style={{ background: 'white', width: 28, height: 50, borderRadius: 6 }} />
        <div style={{ background: 'white', width: 28, height: 84, borderRadius: 6 }} />
        <div style={{ background: 'white', width: 28, height: 64, borderRadius: 6 }} />
      </div>
    ),
    size,
  )
}
