import { ImageResponse } from 'next/og';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
export function generateImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          background: 'linear-gradient(135deg,#0ea5e9,#22c55e)',
          color: 'white',
          fontSize: 64,
          fontWeight: 700
        }}
      >
        QuickGig
      </div>
    ),
    { ...size }
  );
}
export default generateImage;
