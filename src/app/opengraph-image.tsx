import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const alt = 'Present Perfect - AI-Powered Gift Recommendations';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#ffffff',
          backgroundImage: 'linear-gradient(45deg, #f0f9ff 0%, #e0e7ff 100%)',
        }}
      >
        {/* Main Content */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            padding: '40px',
          }}
        >
          {/* Gift Icon */}
          <div
            style={{
              fontSize: '120px',
              marginBottom: '30px',
            }}
          >
            🎁
          </div>
          
          {/* Title */}
          <h1
            style={{
              fontSize: '72px',
              fontWeight: 'bold',
              color: '#1f2937',
              marginBottom: '20px',
              lineHeight: '1.1',
            }}
          >
            Present Perfect
          </h1>
          
          {/* Subtitle */}
          <p
            style={{
              fontSize: '32px',
              color: '#6b7280',
              marginBottom: '40px',
              maxWidth: '800px',
              lineHeight: '1.3',
            }}
          >
            AI-Powered Gift Recommendations
          </p>
          
          {/* Features */}
          <div
            style={{
              display: 'flex',
              gap: '40px',
              fontSize: '24px',
              color: '#4b5563',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span>🤖</span>
              <span>AI-Powered</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span>💝</span>
              <span>Personalized</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span>✨</span>
              <span>Thoughtful</span>
            </div>
          </div>
        </div>
        
        {/* Bottom Brand */}
        <div
          style={{
            position: 'absolute',
            bottom: '40px',
            right: '40px',
            fontSize: '20px',
            color: '#9ca3af',
          }}
        >
          present-perfect.vercel.app
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}