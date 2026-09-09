import React, { useState } from 'react';
import { getRealBookCover } from '../../data/bookCoversMap';

// Zengin klasik cilt renkleri (kitap adına göre dinamik seçilir)
const COVER_PALETTES = [
  { bg: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)', border: 'rgba(255, 255, 255, 0.18)', spine: '#090d16' },
  { bg: 'linear-gradient(135deg, #3f1d24 0%, #200d11 100%)', border: 'rgba(255, 220, 225, 0.22)', spine: '#16080b' },
  { bg: 'linear-gradient(135deg, #183327 0%, #0b1a13 100%)', border: 'rgba(215, 255, 230, 0.20)', spine: '#060f0b' },
  { bg: 'linear-gradient(135deg, #382414 0%, #1f1207 100%)', border: 'rgba(255, 235, 205, 0.22)', spine: '#120a04' },
  { bg: 'linear-gradient(135deg, #271c38 0%, #130c1d 100%)', border: 'rgba(235, 215, 255, 0.20)', spine: '#0c0713' },
  { bg: 'linear-gradient(135deg, #1a2f3b 0%, #0c181f 100%)', border: 'rgba(210, 240, 255, 0.20)', spine: '#060e13' },
  { bg: 'linear-gradient(135deg, #36291a 0%, #1d150b 100%)', border: 'rgba(255, 240, 215, 0.22)', spine: '#100b05' }
];

const getPaletteForTitle = (title = '') => {
  let hash = 0;
  for (let i = 0; i < title.length; i++) {
    hash = (hash << 5) - hash + title.charCodeAt(i);
    hash |= 0;
  }
  const index = Math.abs(hash) % COVER_PALETTES.length;
  return COVER_PALETTES[index];
};

/**
 * BookCover:
 * 1. Orijinal 1:1 kitap kapağını görüntüler.
 * 2. Görsel yüklenemezse veya hata verirse zarif bir kitap mockup'ı üzerinde
 *    SADECE kitap ismini gösteren fallback görselini sunar.
 */
export const BookCover = ({
  src,
  title = '',
  alt,
  className = '',
  style = {},
  onClick,
  loading = 'lazy'
}) => {
  const [hasError, setHasError] = useState(false);
  const [triedFallback, setTriedFallback] = useState(false);
  const [activeUrl, setActiveUrl] = useState('');

  // En iyi görsel kaynağını belirle
  React.useEffect(() => {
    setHasError(false);
    setTriedFallback(false);

    // 1. Önce doğrudan gelen src geçerliyse ve bozuk goodreads linki değilse
    if (src && !src.includes('compressed.photo.goodreads.com')) {
      setActiveUrl(src);
      return;
    }

    // 2. Real cover tablosunda doğrulanmış görsel ara
    const real = getRealBookCover(title);
    if (real && !real.includes('compressed.photo.goodreads.com')) {
      setActiveUrl(real);
      return;
    }

    // 3. Varsa orijinal src'yi dene
    if (src) {
      setActiveUrl(src);
    } else {
      setHasError(true);
    }
  }, [src, title]);

  const palette = React.useMemo(() => getPaletteForTitle(title), [title]);

  const handleImgError = () => {
    if (!triedFallback) {
      setTriedFallback(true);
      const real = getRealBookCover(title);
      if (real && real !== activeUrl && !real.includes('compressed.photo.goodreads.com')) {
        setActiveUrl(real);
        return;
      }
    }
    setHasError(true);
  };

  // Görsel yoksa veya hata verdiyse: Lüks Kitap Mockup'ı + Sadece Kitap İsmi
  if (!activeUrl || hasError) {
    return (
      <div
        className={`book-fallback-cover ${className}`}
        style={{
          background: palette.bg,
          ...style
        }}
        onClick={onClick}
        title={title}
        role="img"
        aria-label={title || 'Kitap Kapağı'}
      >
        {/* Kitap Sırtı Efekti */}
        <div 
          className="book-fallback-spine" 
          style={{ background: `linear-gradient(to right, ${palette.spine}, rgba(255,255,255,0.12) 60%, rgba(0,0,0,0.3) 100%)` }} 
        />

        {/* İç Çerçeve */}
        <div 
          className="book-fallback-frame" 
          style={{ borderColor: palette.border }} 
        />

        {/* Üst Kitap İkonu / Amblem */}
        <div className="book-fallback-emblem">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
          </svg>
        </div>

        {/* SADECE KİTAP İSMİ */}
        <span className="book-fallback-title">
          {title || 'Kitap'}
        </span>
      </div>
    );
  }

  return (
    <img
      src={activeUrl}
      alt={alt || title || 'Kitap Kapağı'}
      className={className}
      style={{ objectFit: 'cover', ...style }}
      onError={handleImgError}
      onClick={onClick}
      loading={loading}
      referrerPolicy="no-referrer"
    />
  );
};

export default BookCover;
