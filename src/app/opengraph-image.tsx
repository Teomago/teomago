import { ImageResponse } from 'next/og'

export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background: '#000000',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'sans-serif',
          border: '1px solid #1f1f1f',
        }}
      >
        <div style={{ color: '#00d4ff', fontSize: 16, letterSpacing: 8, marginBottom: 16 }}>
          ◈ CHARACTER SHEET
        </div>
        <div style={{ color: '#ffffff', fontSize: 72, fontWeight: 900, letterSpacing: -2 }}>
          TEOMAGO
        </div>
        <div style={{ color: '#6b7280', fontSize: 24, marginTop: 16 }}>
          Full-Stack Developer · Musician · Arts Educator
        </div>
      </div>
    ),
    size
  )
}
