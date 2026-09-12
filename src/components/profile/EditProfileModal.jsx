import React, { useState, useEffect, useRef } from 'react';
import { Camera, BookOpen, Quote, Target, Check, Upload, AlertTriangle, ShieldCheck, RefreshCw } from 'lucide-react';
import { Modal } from '../common/Modal';
import { useApp } from '../../context/AppContext';

export const SAMPLE_AVATARS = [
  { id: 'av-1', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&h=200&q=80', label: 'Edebi Portre' },
  { id: 'av-2', url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&h=200&q=80', label: 'Modern Okur' },
  { id: 'av-3', url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&h=200&q=80', label: 'Yazar Portresi' },
  { id: 'av-4', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&h=200&q=80', label: 'Klasik Okur' },
  { id: 'av-5', url: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=200&h=200&q=80', label: 'Genç Okur' },
  { id: 'av-6', url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&h=200&q=80', label: 'Sanatsal Okur' }
];

export const EditProfileModal = () => {
  const { isEditProfileOpen, setIsEditProfileOpen, currentUser, updateProfile, showToast } = useApp();

  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [motto, setMotto] = useState('');
  const [avatar, setAvatar] = useState('');
  const [customAvatarUrl, setCustomAvatarUrl] = useState('');
  const [isBlurred, setIsBlurred] = useState(false);
  const [blurReason, setBlurReason] = useState('');
  const [readingGoal, setReadingGoal] = useState(30);
  const [favoriteGenre, setFavoriteGenre] = useState('Roman');
  const [isScanning, setIsScanning] = useState(false);

  const fileInputRef = useRef(null);

  useEffect(() => {
    if (currentUser) {
      setFullName(currentUser.fullName || '');
      setUsername(currentUser.username || '');
      setBio(currentUser.bio || '');
      setMotto(currentUser.motto || 'Sakin okumalar ve kenar notları.');
      setAvatar(currentUser.avatar || SAMPLE_AVATARS[0].url);
      setCustomAvatarUrl('');
      setIsBlurred(Boolean(currentUser.isBlurred));
      setBlurReason(currentUser.blurReason || '');
      setReadingGoal(currentUser.readingGoal || 30);
      setFavoriteGenre(currentUser.favoriteGenre || 'Roman');
    }
  }, [currentUser, isEditProfileOpen]);

  if (!currentUser) return null;

  // Çıplaklık, argo ve sakıncalı içerik tarama algoritması (Canvas tabanlı ten rengi / orantı ve anahtar kelime heuristiği)
  const analyzeImageContent = (imgElement, fileName = '') => {
    return new Promise((resolve) => {
      try {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const width = Math.min(100, imgElement.width || 100);
        const height = Math.min(100, imgElement.height || 100);
        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(imgElement, 0, 0, width, height);

        const imgData = ctx.getImageData(0, 0, width, height);
        const data = imgData.data;

        let skinPixels = 0;
        const totalPixels = data.length / 4;

        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];

          // Standart açık/koyu ten rengi piksel formülü (Kovac/Chai kuralları)
          const isSkinTone = (
            r > 95 && g > 40 && b > 20 &&
            (Math.max(r, g, b) - Math.min(r, g, b)) > 15 &&
            Math.abs(r - g) > 15 &&
            r > g && r > b
          );

          if (isSkinTone) skinPixels++;
        }

        const skinRatio = skinPixels / totalPixels;

        // Dosya adı veya argo / sakıncalı içerik kelime denetimi
        const forbiddenTerms = [
          'nude', 'ciplak', 'seks', 'porn', 'nsfw', 'adult', 'argo', 'sex', 
          'naked', 'erotic', 'mustehcen', 'meme', 'gogus', 'vajina', 'penis', 
          'anal', 'sakincah', 'sakıncalı', 'bitch', 'fuck', 'ass'
        ];
        const lowerName = (fileName || '').toLowerCase();
        const hasForbiddenTerm = forbiddenTerms.some(term => lowerName.includes(term));

        // Ten rengi oranı portre için aşırı yüksekse (>%30) veya sakıncalı terim varsa sansürle
        if (skinRatio > 0.30 || hasForbiddenTerm) {
          resolve({
            isSafe: false,
            reason: 'Otomatik Moderasyon: Aşırı çıplaklık veya sakıncalı içerik algılandı. Görsel koruma amacıyla otomatik olarak blurlanmıştır.'
          });
        } else {
          resolve({ isSafe: true });
        }
      } catch (err) {
        resolve({ isSafe: true });
      }
    });
  };

  const handleDeviceUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast('Lütfen geçerli bir görsel dosyası seçin.', '⚠️');
      return;
    }

    setIsScanning(true);
    showToast('Fotoğraf taranıyor ve moderasyon filtresinden geçiriliyor...', '🛡️');

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result;
      const img = new Image();
      img.crossOrigin = 'Anonymous';
      img.onload = async () => {
        const result = await analyzeImageContent(img, file.name);
        setAvatar(dataUrl);
        setCustomAvatarUrl('');
        setIsScanning(false);

        if (!result.isSafe) {
          setIsBlurred(true);
          setBlurReason(result.reason);
          showToast('⚠️ Sakıncalı görsel tespit edildi! Otomatik olarak blurlanmıştır.', '🔒');
        } else {
          setIsBlurred(false);
          setBlurReason('');
          showToast('Fotoğraf başarıyla yüklendi ve onaylandı.', '✓');
        }
      };
      img.src = dataUrl;
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const finalAvatar = customAvatarUrl.trim() ? customAvatarUrl.trim() : avatar;

    updateProfile({
      fullName: fullName.trim(),
      username: username.trim().toLowerCase().replace(/\s+/g, ''),
      bio: bio.trim(),
      motto: motto.trim(),
      avatar: finalAvatar,
      isBlurred,
      blurReason: isBlurred ? blurReason : '',
      readingGoal: parseInt(readingGoal, 10) || 30,
      favoriteGenre
    });
  };

  return (
    <Modal
      isOpen={isEditProfileOpen}
      onClose={() => setIsEditProfileOpen(false)}
      title="Profili Düzenle"
      maxWidth="560px"
    >
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        
        {/* 1. Profil Fotoğrafı (Cihazdan Yükleme & Otomatik Blur Desteği) */}
        <div style={{ background: 'var(--bg-surface)', padding: '18px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-subtle)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px', flexWrap: 'wrap', gap: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Camera size={16} color="var(--color-primary)" />
              <label style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-main)', margin: 0 }}>
                Profil Fotoğrafı
              </label>
            </div>

            {/* Cihazdan Görsel Yükle Butonu */}
            <input 
              type="file" 
              ref={fileInputRef} 
              accept="image/*" 
              style={{ display: 'none' }} 
              onChange={handleDeviceUpload} 
            />
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => fileInputRef.current?.click()}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem' }}
              disabled={isScanning}
            >
              {isScanning ? <RefreshCw size={13} className="spin" /> : <Upload size={13} />}
              <span>{isScanning ? 'Taranıyor...' : 'Cihazdan Fotoğraf Seç'}</span>
            </button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '18px', flexWrap: 'wrap' }}>
            {/* Fotoğraf Önizleme */}
            <div style={{ position: 'relative' }}>
              <img 
                src={customAvatarUrl.trim() || avatar} 
                alt={fullName} 
                style={{ 
                  width: '80px', 
                  height: '80px', 
                  borderRadius: '50%', 
                  objectFit: 'cover', 
                  border: isBlurred ? '3px solid #eab308' : '3px solid var(--color-primary)',
                  boxShadow: '0 4px 14px rgba(0,0,0,0.15)',
                  filter: isBlurred ? 'blur(16px)' : 'none',
                  transition: 'filter 0.3s ease'
                }} 
              />
              {isBlurred && (
                <span style={{
                  position: 'absolute',
                  bottom: '-4px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  background: '#eab308',
                  color: '#000',
                  fontSize: '0.62rem',
                  fontWeight: 800,
                  padding: '2px 6px',
                  borderRadius: '999px',
                  whiteSpace: 'nowrap'
                }}>
                  Blurlu
                </span>
              )}
            </div>

            {/* Hazır Avatar Seçenekleri */}
            <div style={{ flex: 1, minWidth: '220px' }}>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-dim)', display: 'block', marginBottom: '8px' }}>
                Veya hazır edebi portrelerden seçin:
              </span>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {SAMPLE_AVATARS.map(av => (
                  <img
                    key={av.id}
                    src={av.url}
                    alt={av.label}
                    title={av.label}
                    onClick={() => { 
                      setAvatar(av.url); 
                      setCustomAvatarUrl(''); 
                      setIsBlurred(false); 
                      setBlurReason(''); 
                    }}
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '50%',
                      cursor: 'pointer',
                      border: (avatar === av.url && !customAvatarUrl) ? '2px solid var(--color-primary)' : '1px solid var(--border-subtle)',
                      opacity: (avatar === av.url && !customAvatarUrl) ? 1 : 0.65,
                      transform: (avatar === av.url && !customAvatarUrl) ? 'scale(1.1)' : 'scale(1)',
                      transition: 'all 0.15s ease'
                    }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Sakıncalı İçerik / Blur Bilgilendirme Uyarısı */}
          {isBlurred && (
            <div style={{
              marginTop: '14px',
              padding: '10px 12px',
              background: 'rgba(234, 179, 8, 0.12)',
              border: '1px solid rgba(234, 179, 8, 0.3)',
              borderRadius: 'var(--radius-md)',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}>
              <AlertTriangle size={18} color="#eab308" style={{ flexShrink: 0 }} />
              <div style={{ fontSize: '0.78rem', color: 'var(--text-main)', lineHeight: 1.4 }}>
                <strong>Yapay Zeka İçerik Moderasyonu:</strong> Görselde çıplaklık veya sakıncalı içerik tespit edildiği için profilinizde otomatik olarak blurlanmış olarak gösterilecektir.
              </div>
            </div>
          )}

          {/* Harici URL Alanı */}
          <div style={{ marginTop: '12px' }}>
            <input
              type="url"
              placeholder="Veya görsel URL bağlantısı yapıştırın (https://...)"
              value={customAvatarUrl}
              onChange={(e) => {
                setCustomAvatarUrl(e.target.value);
                setIsBlurred(false);
              }}
              style={{
                width: '100%',
                padding: '8px 12px',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-subtle)',
                background: 'var(--bg-surface-elevated)',
                fontSize: '0.82rem',
                color: 'var(--text-main)',
                outline: 'none',
                boxSizing: 'border-box'
              }}
            />
          </div>
        </div>

        {/* 2. İsim ve Kullanıcı Adı */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '0.84rem', fontWeight: 600, color: 'var(--text-main)' }}>Ad Soyad</label>
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              style={{
                padding: '9px 12px',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-subtle)',
                background: 'var(--bg-surface)',
                color: 'var(--text-main)',
                fontSize: '0.9rem',
                outline: 'none'
              }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '0.84rem', fontWeight: 600, color: 'var(--text-main)' }}>Kullanıcı Adı</label>
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={{
                padding: '9px 12px',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-subtle)',
                background: 'var(--bg-surface)',
                color: 'var(--text-main)',
                fontSize: '0.9rem',
                outline: 'none'
              }}
            />
          </div>
        </div>

        {/* 3. Okur Mottosu / Favori Edebi Alıntı */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Quote size={13} color="var(--orange)" />
            <label style={{ fontSize: '0.84rem', fontWeight: 600, color: 'var(--text-main)' }}>
              Okur Mottosu / Favori Alıntı (Profil Başlığında Görünür)
            </label>
          </div>
          <input
            type="text"
            placeholder="örn: İnsan ancak anladığı şeyleri evcilleştirebilir..."
            value={motto}
            onChange={(e) => setMotto(e.target.value)}
            style={{
              padding: '9px 12px',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border-subtle)',
              background: 'var(--bg-surface)',
              color: 'var(--text-main)',
              fontSize: '0.9rem',
              fontStyle: 'italic',
              outline: 'none'
            }}
          />
        </div>

        {/* 4. Biyografi */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <label style={{ fontSize: '0.84rem', fontWeight: 600, color: 'var(--text-main)' }}>Biyografi</label>
          <textarea
            rows={2}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Okuma zevklerinizden, kenar notlarınızdan ve sevdiğiniz yazarlardan bahsedin..."
            style={{
              padding: '9px 12px',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border-subtle)',
              background: 'var(--bg-surface)',
              color: 'var(--text-main)',
              fontSize: '0.9rem',
              fontFamily: 'inherit',
              resize: 'vertical',
              outline: 'none'
            }}
          />
        </div>

        {/* 5. Yıllık Okuma Hedefi & Favori Tür */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', alignItems: 'center' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Target size={14} color="var(--color-primary)" />
                <label style={{ fontSize: '0.84rem', fontWeight: 600, color: 'var(--text-main)' }}>
                  Yıllık Okuma Hedefi
                </label>
              </div>
              <span style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--color-primary)' }}>
                {readingGoal} Kitap
              </span>
            </div>
            <input
              type="range"
              min="5"
              max="150"
              step="1"
              value={readingGoal}
              onChange={(e) => setReadingGoal(e.target.value)}
              style={{ width: '100%', accentColor: 'var(--color-primary)' }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <BookOpen size={14} color="var(--color-primary)" />
              <label style={{ fontSize: '0.84rem', fontWeight: 600, color: 'var(--text-main)' }}>
                Favori Tür
              </label>
            </div>
            <select
              value={favoriteGenre}
              onChange={(e) => setFavoriteGenre(e.target.value)}
              style={{
                padding: '9px 12px',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-subtle)',
                background: 'var(--bg-surface)',
                color: 'var(--text-main)',
                fontSize: '0.9rem',
                outline: 'none'
              }}
            >
              <option value="Roman">Roman</option>
              <option value="Felsefe">Felsefe & Düşünce</option>
              <option value="Bilim Kurgu">Bilim Kurgu & Distopya</option>
              <option value="Şiir">Şiir</option>
              <option value="Tarih">Tarih</option>
              <option value="Psikoloji">Psikoloji</option>
              <option value="Biyografi">Biyografi</option>
            </select>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => setIsEditProfileOpen(false)}
          >
            Vazgeç
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
          >
            <Check size={16} />
            <span>Değişiklikleri Kaydet</span>
          </button>
        </div>
      </form>
    </Modal>
  );
};
