import React from 'react';

export const KenarLogo = ({ size = 32, showText = true, textStyle = {} }) => {
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', userSelect: 'none' }}>
      {/* Kenar İkonu: Katlanmış kitap köşesi (dog-ear / margin) & K harfi soyut geometrisi */}
      <div 
        style={{
          width: `${size}px`,
          height: `${size}px`,
          borderRadius: `${Math.round(size * 0.28)}px`,
          background: 'linear-gradient(135deg, #1C1C1E 0%, #2C2C2E 50%, #0A84FF 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 12px rgba(0, 122, 255, 0.22), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
          position: 'relative',
          overflow: 'hidden',
          flexShrink: 0,
          transition: 'transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
          cursor: 'pointer'
        }}
        className="kenar-brand-icon"
      >
        {/* Arka plan ışık kavisleri */}
        <div style={{
          position: 'absolute',
          top: '-20%',
          right: '-20%',
          width: '70%',
          height: '70%',
          background: 'radial-gradient(circle, rgba(10, 132, 255, 0.45) 0%, transparent 70%)',
          pointerEvents: 'none'
        }} />

        {/* Kenar Geometrik Vektörü: Kitap yaprağı ve katlanmış altın kenar */}
        <svg 
          width={Math.round(size * 0.62)} 
          height={Math.round(size * 0.62)} 
          viewBox="0 0 24 24" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Kitap sol sayfası */}
          <path 
            d="M4 4.5C4 3.67 4.67 3 5.5 3H12V20H5.5C4.67 20 4 19.33 4 18.5V4.5Z" 
            fill="rgba(255, 255, 255, 0.92)" 
          />
          {/* Kitap sağ sayfası */}
          <path 
            d="M12 3H15.5L20 7.5V18.5C20 19.33 19.33 20 18.5 20H12V3Z" 
            fill="rgba(255, 255, 255, 0.75)" 
          />
          {/* Katlanmış altın sayfa kenarı ('Kenar' sembolü) */}
          <path 
            d="M15.5 3V7.5H20L15.5 3Z" 
            fill="url(#goldGradient)" 
            style={{ filter: 'drop-shadow(0 2px 3px rgba(0,0,0,0.3))' }}
          />
          {/* Sayfa dikiş çizgisi */}
          <line x1="12" y1="3" x2="12" y2="20" stroke="rgba(0, 0, 0, 0.25)" strokeWidth="1" strokeDasharray="1.5 1.5" />
          
          <defs>
            <linearGradient id="goldGradient" x1="15.5" y1="3" x2="20" y2="7.5" gradientUnits="userSpaceOnUse">
              <stop stopColor="#FFD60A" />
              <stop offset="1" stopColor="#FF9F0A" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {showText && (
        <div style={{ display: 'flex', flexDirection: 'column', ...textStyle }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ 
              fontSize: '20px', 
              fontWeight: 800, 
              letterSpacing: '-0.5px',
              color: 'var(--label)',
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif'
            }}>
              Kenar
            </span>
            <span style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              background: '#0A84FF',
              boxShadow: '0 0 8px #0A84FF'
            }} />
          </div>
          <span style={{ 
            fontSize: '11px', 
            color: 'var(--label-2)', 
            fontWeight: 500,
            letterSpacing: '0.2px',
            marginTop: '-1px'
          }}>
            Sakin Okuma Kulübü
          </span>
        </div>
      )}
    </div>
  );
};
