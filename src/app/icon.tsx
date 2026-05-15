import { ImageResponse } from 'next/og'

export const size = { width: 32, height: 32 }
export const contentType = 'image/png'

export default function Icon() {
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
          borderRadius: 7,
          padding: '5px 6px',
          gap: 3,
        }}
      >
        <div style={{ background: 'white', width: 5, height: 9, borderRadius: 2 }} />
        <div style={{ background: 'white', width: 5, height: 15, borderRadius: 2 }} />
        <div style={{ background: 'white', width: 5, height: 11, borderRadius: 2 }} />
      </div>
    ),
    size,
  )
}
