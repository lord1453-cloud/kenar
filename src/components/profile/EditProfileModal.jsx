import React, { useState, useEffect } from 'react';
import { Camera, Palette, BookOpen, Quote, Target, Check } from 'lucide-react';
import { Modal } from '../common/Modal';
import { useApp } from '../../context/AppContext';

export const BANNER_THEMES = [
  { id: 'terracotta', name: 'Pişmiş Toprak & Adaçayı', gradient: 'linear-gradient(120deg, #455C46 0%, #8B4A34 100%)' },
  { id: 'obsidian', name: 'Obsidian Gece', gradient: 'linear-gradient(135deg, #1C1C1E 0%, #2c2c2e 60%, #3a3a3c 100%)' },
  { id: 'emerald', name: 'Zümrüt Klasik', gradient: 'linear-gradient(135deg, #132a13 0%, #31572c 60%, #4f772d 100%)' },
  { id: 'amber', name: 'Gün Batımı Kehribar', gradient: 'linear-gradient(135deg, #7c3aed 0%, #d97706 100%)' },
  { id: 'lavender', name: 'Kraliyet Lavantası', gradient: 'linear-gradient(135deg, #3c096c 0%, #7b2cbf 100%)' },
  { id: 'navy', name: 'Gece Yarısı Lacivert', gradient: 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%)' }
];

export const SAMPLE_AVATARS = [
  { id: 'av-1', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&h=200&q=80', label: 'Edebi Portre' },
  { id: 'av-2', url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&h=200&q=80', label: 'Modern Okur' },
  { id: 'av-3', url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&h=200&q=80', label: 'Yazar Portresi' },
  { id: 'av-4', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&h=200&q=80', label: 'Klasik Okur' },
  { id: 'av-5', url: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=200&h=200&q=80', label: 'Genç Okur' },
  { id: 'av-6', url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&h=200&q=80', label: 'Sanatsal Okur' }
];

export const EditProfileModal = () => {
  const { isEditProfileOpen, setIsEditProfileOpen, currentUser, updateProfile } = useApp();

  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [motto, setMotto] = useState('');
  const [avatar, setAvatar] = useState('');
  const [customAvatarUrl, setCustomAvatarUrl] = useState('');
  const [coverTheme, setCoverTheme] = useState(BANNER_THEMES[0].gradient);
  const [readingGoal, setReadingGoal] = useState(30);
  const [favoriteGenre, setFavoriteGenre] = useState('Roman');

  useEffect(() => {
    if (currentUser) {
      setFullName(currentUser.fullName || '');
      setUsername(currentUser.username || '');
      setBio(currentUser.bio || '');
      setMotto(currentUser.motto || 'Sakin okumalar ve kenar notları.');
      setAvatar(currentUser.avatar || SAMPLE_AVATARS[0].url);
      setCustomAvatarUrl('');
      setCoverTheme(currentUser.coverTheme || BANNER_THEMES[0].gradient);
      setReadingGoal(currentUser.readingGoal || 30);
      setFavoriteGenre(currentUser.favoriteGenre || 'Roman');
    }
  }, [currentUser, isEditProfileOpen]);

  if (!currentUser) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const finalAvatar = customAvatarUrl.trim() ? customAvatarUrl.trim() : avatar;

    updateProfile({
      fullName: fullName.trim(),
      username: username.trim().toLowerCase().replace(/\s+/g, ''),
      bio: bio.trim(),
      motto: motto.trim(),
      avatar: finalAvatar,
      coverTheme,
      readingGoal: parseInt(readingGoal, 10) || 30,
      favoriteGenre
    });
  };

  return (
    <Modal
      isOpen={isEditProfileOpen}
      onClose={() => setIsEditProfileOpen(false)}
      title="Profili Özelleştir"
      maxWidth="580px"
    >
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        
        {/* 1. Canlı Önizleme & Kapak Teması Seçimi */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
            <Palette size={15} color="var(--accent)" />
            <label style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--label)' }}>
              Kapak Teması & Renk Uyumu
            </label>
          </div>

          {/* Canlı Kapak Önizleme */}
          <div 
            style={{ 
              height: '84px', 
              borderRadius: '12px', 
              background: coverTheme, 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'flex-end',
              padding: '0 16px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.12)',
              marginBottom: '10px'
            }}
          >
            <span style={{ fontSize: '0.78rem', color: '#fff', background: 'rgba(0,0,0,0.3)', padding: '3px 8px', borderRadius: '999px', backdropFilter: 'blur(4px)' }}>
              Canlı Tema Önizleme
            </span>
          </div>

          {/* Tema Seçenekleri */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
            {BANNER_THEMES.map(theme => (
              <button
                type="button"
                key={theme.id}
                onClick={() => setCoverTheme(theme.gradient)}
                style={{
                  padding: '8px 10px',
                  borderRadius: '10px',
                  border: coverTheme === theme.gradient ? '2px solid var(--accent)' : '1px solid var(--separator)',
                  background: 'var(--bg-elevated)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  cursor: 'pointer',
                  textAlign: 'left'
                }}
              >
                <div style={{ width: '18px', height: '18px', borderRadius: '50%', background: theme.gradient, flexShrink: 0 }} />
                <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--label)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {theme.name}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* 2. Avatar Seçimi & Özel URL */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
            <Camera size={15} color="var(--accent)" />
            <label style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--label)' }}>
              Profil Avatarı
            </label>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '10px' }}>
            <img 
              src={customAvatarUrl.trim() || avatar} 
              alt={fullName} 
              style={{ 
                width: '64px', 
                height: '64px', 
                borderRadius: '50%', 
                objectFit: 'cover', 
                border: '3px solid var(--accent)',
                boxShadow: '0 4px 10px rgba(0,0,0,0.15)'
              }} 
            />
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {SAMPLE_AVATARS.map(av => (
                  <img
                    key={av.id}
                    src={av.url}
                    alt={av.label}
                    title={av.label}
                    onClick={() => { setAvatar(av.url); setCustomAvatarUrl(''); }}
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '50%',
                      cursor: 'pointer',
                      border: (avatar === av.url && !customAvatarUrl) ? '2px solid var(--accent)' : '1px solid var(--separator)',
                      opacity: (avatar === av.url && !customAvatarUrl) ? 1 : 0.65,
                      transform: (avatar === av.url && !customAvatarUrl) ? 'scale(1.08)' : 'scale(1)',
                      transition: 'all 0.15s ease'
                    }}
                  />
                ))}
              </div>
            </div>
          </div>

          <input
            type="url"
            placeholder="Veya özel görsel URL bağlantısı yapıştırın (https://...)"
            value={customAvatarUrl}
            onChange={(e) => setCustomAvatarUrl(e.target.value)}
            style={{
              width: '100%',
              padding: '8px 12px',
              borderRadius: '8px',
              border: '1px solid var(--separator)',
              background: 'var(--fill)',
              color: 'var(--label)',
              fontSize: '12.5px',
              outline: 'none',
              boxSizing: 'border-box'
            }}
          />
        </div>

        {/* 3. İsim ve Kullanıcı Adı */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '0.84rem', fontWeight: 600, color: 'var(--label-2)' }}>Ad Soyad</label>
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              style={{
                padding: '9px 12px',
                borderRadius: '8px',
                border: '1px solid var(--separator)',
                background: 'var(--fill)',
                color: 'var(--label)',
                fontSize: '14px',
                outline: 'none'
              }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '0.84rem', fontWeight: 600, color: 'var(--label-2)' }}>Kullanıcı Adı</label>
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={{
                padding: '9px 12px',
                borderRadius: '8px',
                border: '1px solid var(--separator)',
                background: 'var(--fill)',
                color: 'var(--label)',
                fontSize: '14px',
                outline: 'none'
              }}
            />
          </div>
        </div>

        {/* 4. Okur Mottosu / Favori Edebi Alıntı */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Quote size={13} color="var(--orange)" />
            <label style={{ fontSize: '0.84rem', fontWeight: 600, color: 'var(--label-2)' }}>
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
              borderRadius: '8px',
              border: '1px solid var(--separator)',
              background: 'var(--fill)',
              color: 'var(--label)',
              fontSize: '14px',
              fontStyle: 'italic',
              outline: 'none'
            }}
          />
        </div>

        {/* 5. Biyografi */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <label style={{ fontSize: '0.84rem', fontWeight: 600, color: 'var(--label-2)' }}>Biyografi</label>
          <textarea
            rows={2}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Okuma zevklerinizden, kenar notlarınızdan ve sevdiğiniz yazarlardan bahsedin..."
            style={{
              padding: '9px 12px',
              borderRadius: '8px',
              border: '1px solid var(--separator)',
              background: 'var(--fill)',
              color: 'var(--label)',
              fontSize: '14px',
              fontFamily: 'inherit',
              resize: 'vertical',
              outline: 'none'
            }}
          />
        </div>

        {/* 6. Yıllık Okuma Hedefi (İnteraktif Slider) & Favori Tür */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '16px', alignItems: 'center' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Target size={14} color="var(--accent)" />
                <label style={{ fontSize: '0.84rem', fontWeight: 600, color: 'var(--label-2)' }}>
                  Yıllık Okuma Hedefi
                </label>
              </div>
              <span style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--accent)' }}>
                {readingGoal} Kitap
              </span>
            </div>
            <input
              type="range"
              min={5}
              max={100}
              step={1}
              value={readingGoal}
              onChange={(e) => setReadingGoal(Number(e.target.value))}
              style={{ accentColor: 'var(--accent)', cursor: 'pointer', marginTop: '4px' }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <BookOpen size={14} color="var(--green)" />
              <label style={{ fontSize: '0.84rem', fontWeight: 600, color: 'var(--label-2)' }}>Favori Tür</label>
            </div>
            <select
              value={favoriteGenre}
              onChange={(e) => setFavoriteGenre(e.target.value)}
              style={{
                padding: '8px 10px',
                borderRadius: '8px',
                border: '1px solid var(--separator)',
                background: 'var(--fill)',
                color: 'var(--label)',
                fontSize: '13.5px',
                outline: 'none'
              }}
            >
              <option value="Roman">Roman</option>
              <option value="Dünya Klasikleri">Dünya Klasikleri</option>
              <option value="Türk Edebiyatı">Türk Edebiyatı</option>
              <option value="Bilim Kurgu & Fantastik">Bilim Kurgu &amp; Fantastik</option>
              <option value="Felsefe">Felsefe</option>
              <option value="Şiir">Şiir</option>
              <option value="Kişisel Gelişim">Kişisel Gelişim</option>
              <option value="Tarih & Biyografi">Tarih &amp; Biyografi</option>
            </select>
          </div>
        </div>

        {/* Butonlar */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
          <button 
            type="button" 
            className="btn btn-secondary" 
            onClick={() => setIsEditProfileOpen(false)}
            style={{ padding: '9px 18px', borderRadius: '10px' }}
          >
            Vazgeç
          </button>
          <button 
            type="submit" 
            className="btn btn-primary"
            style={{ 
              padding: '9px 22px', 
              borderRadius: '10px', 
              background: 'var(--accent)', 
              color: '#fff', 
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Check size={16} />
            Değişiklikleri Kaydet
          </button>
        </div>
      </form>
    </Modal>
  );
};
