import React, { useState, useEffect } from 'react';
import { 
  Palette, 
  Sparkles, 
  BookOpen, 
  ShieldCheck, 
  Lock, 
  Globe, 
  Check, 
  X, 
  Sliders,
  Image as ImageIcon
} from 'lucide-react';
import { Modal } from '../common/Modal';
import { useApp } from '../../context/AppContext';
import { BookCover } from '../common/BookCover';
import { getRealBookCover } from '../../data/bookCoversMap';
import { FEATURED_COVERS } from '../../data/featuredBooksCovers';

const THEME_PALETTES = [
  { id: 'desert', name: 'Mars & Kum', gradient: 'linear-gradient(135deg, #8B4A34, #5b3527)', accent: '#8B4A34' },
  { id: 'forest', name: 'Gece Ormanı', gradient: 'linear-gradient(135deg, #183327, #0b1a13)', accent: '#183327' },
  { id: 'indigo', name: 'Kozmik Çivit', gradient: 'linear-gradient(135deg, #182848, #4b6cb7)', accent: '#4b6cb7' },
  { id: 'bordeaux', name: 'Bordo Klasik', gradient: 'linear-gradient(135deg, #3f1d24, #200d11)', accent: '#3f1d24' },
  { id: 'library', name: 'Eski Kütüphane', gradient: 'linear-gradient(135deg, #382414, #1f1207)', accent: '#382414' },
  { id: 'amber', name: 'Sıcak Kehribar', gradient: 'linear-gradient(135deg, #B45309, #78350F)', accent: '#B45309' }
];

const EMOJI_OPTIONS = ['📖', '🪐', '🕯️', '☕', '🌲', '⚔️', '🎭', '🧠', '🏛️', '📜', '🛡️', '👑'];

export const CustomizeRoomModal = () => {
  const { 
    isCustomizeRoomOpen, 
    setIsCustomizeRoomOpen, 
    customizingRoom, 
    updateRoomProfile,
    books
  } = useApp();

  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [icon, setIcon] = useState('📖');
  const [themeGradient, setThemeGradient] = useState(THEME_PALETTES[0].gradient);
  const [description, setDescription] = useState('');
  const [rules, setRules] = useState('Otomatik filtre aktif (Spoiler korumalı)');
  const [isPrivate, setIsPrivate] = useState(false);

  // Modal her açıldığında mevcut oda bilgilerini doldur
  useEffect(() => {
    if (customizingRoom) {
      setTitle(customizingRoom.title || customizingRoom.name || 'Kitap Odası');
      setAuthor(customizingRoom.author || 'Edebi Topluluk');
      setCoverImage(customizingRoom.coverImage || customizingRoom.cover || '');
      setIcon(customizingRoom.icon || '📖');
      setThemeGradient(customizingRoom.themeGradient || THEME_PALETTES[0].gradient);
      setDescription(customizingRoom.description || 'Kitap tartışma ve sakin okuma odası.');
      setRules(customizingRoom.rules || 'Otomatik filtre aktif (Spoiler korumalı)');
      setIsPrivate(Boolean(customizingRoom.isPrivate));
    }
  }, [customizingRoom, isCustomizeRoomOpen]);

  if (!isCustomizeRoomOpen) return null;

  // Popüler kitap seçildiğinde otomatik başlık, yazar ve 1:1 orijinal kapak yükle
  const handleQuickBookSelect = (bookTitle) => {
    const matchedBook = books?.find(b => b.title.toLowerCase() === bookTitle.toLowerCase());
    const realCover = getRealBookCover(bookTitle);

    setTitle(bookTitle);
    if (matchedBook) {
      setAuthor(matchedBook.author || '');
      setCoverImage(matchedBook.cover || realCover || '');
    } else {
      setCoverImage(realCover || '');
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    updateRoomProfile(customizingRoom?.id || customizingRoom?.title || customizingRoom?.name, {
      title: title.trim(),
      name: title.trim(),
      author: author.trim(),
      cover: coverImage || themeGradient,
      coverImage: coverImage || themeGradient,
      themeGradient,
      icon,
      description: description.trim(),
      rules: rules.trim(),
      isPrivate
    });
  };

  return (
    <Modal
      isOpen={isCustomizeRoomOpen}
      onClose={() => setIsCustomizeRoomOpen(false)}
      title="Oda Profilini Özelleştir"
      maxWidth="680px"
    >
      <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        
        {/* 1. CANLI ODA KARTI ÖNİZLEMESİ */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.4px' }}>
            Canlı Önizleme:
          </span>
          <div 
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '18px', 
              padding: '16px', 
              borderRadius: '14px', 
              background: 'var(--bg-surface-elevated)', 
              border: '1.5px solid var(--border-subtle)',
              boxShadow: '0 8px 24px rgba(0,0,0,0.1)'
            }}
          >
            {/* Dik ve Orantılı 2:3 Kitap Kapağı (84px × 124px) */}
            <div 
              style={{ 
                width: '84px', 
                height: '124px', 
                borderRadius: '6px', 
                overflow: 'hidden', 
                flexShrink: 0, 
                boxShadow: '0 4px 14px rgba(0,0,0,0.25)' 
              }}
            >
              <BookCover 
                src={coverImage} 
                title={title || 'Kitap Odası'} 
                alt={title}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>

            {/* Oda Bilgileri */}
            <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '1.4rem' }}>{icon}</span>
                <h4 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-main)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {title || 'Oda Başlığı'}
                </h4>
              </div>
              <div style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
                {author || 'Yazar Belirtilmedi'}
              </div>
              <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--text-dim)', lineHeight: 1.4, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                {description || 'Sakin okumalar ve bölüm değerlendirmeleri.'}
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '4px' }}>
                <span className="badge badge-green" style={{ fontSize: '0.72rem', padding: '2px 8px' }}>
                  ✓ {rules}
                </span>
                {isPrivate && (
                  <span className="badge" style={{ fontSize: '0.72rem', background: 'rgba(239,68,68,0.15)', color: '#ef4444' }}>
                    <Lock size={10} /> Özel Oda
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* 2. HAZIR KİTAP SEÇİCİ */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)' }}>
            Hızlı Kitap Seçimi (Kapağı otomatik yükler):
          </label>
          <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
            {['Kayıp Zamanın İzinde', 'Dune', 'Beyaz Gece', 'Sessiz Ev', 'Körlük', '1984', 'Dönüşüm'].map(bookName => (
              <button
                key={bookName}
                type="button"
                className={`btn btn-sm ${title === bookName ? 'btn-primary' : 'btn-secondary'}`}
                style={{ fontSize: '0.78rem', whiteSpace: 'nowrap', padding: '5px 10px' }}
                onClick={() => handleQuickBookSelect(bookName)}
              >
                {bookName}
              </button>
            ))}
          </div>
        </div>

        {/* 3. ODA BAŞLIĞI VE YAZAR */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)' }}>
              Oda Başlığı *
            </label>
            <input 
              type="text" 
              required 
              value={title} 
              onChange={e => setTitle(e.target.value)} 
              placeholder="Örn: Dune Tartışma Grubu"
              style={{ width: '100%', padding: '9px 12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', background: 'var(--bg-surface)' }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)' }}>
              Yazar Adı
            </label>
            <input 
              type="text" 
              value={author} 
              onChange={e => setAuthor(e.target.value)} 
              placeholder="Örn: Frank Herbert"
              style={{ width: '100%', padding: '9px 12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', background: 'var(--bg-surface)' }}
            />
          </div>
        </div>

        {/* 4. KAPAK GÖRSELİ URL'Sİ VEYA PALET */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)' }}>
            Özel Kapak Görseli URL'si (İsteğe Bağlı)
          </label>
          <div style={{ display: 'flex', gap: '8px' }}>
            <input 
              type="url" 
              value={coverImage} 
              onChange={e => setCoverImage(e.target.value)} 
              placeholder="https://... (boş bırakılırsa başlığa göre orijinal kapak seçilir)"
              style={{ flex: 1, padding: '9px 12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', background: 'var(--bg-surface)' }}
            />
            {coverImage && (
              <button 
                type="button" 
                className="btn btn-secondary btn-sm"
                onClick={() => setCoverImage('')}
              >
                Temizle
              </button>
            )}
          </div>
        </div>

        {/* 5. ODA İKONU (EMOJİ) SEÇİCİ */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)' }}>
            Oda İkonu:
          </label>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {EMOJI_OPTIONS.map(em => (
              <button
                key={em}
                type="button"
                onClick={() => setIcon(em)}
                style={{
                  width: '38px',
                  height: '38px',
                  fontSize: '1.2rem',
                  borderRadius: 'var(--radius-md)',
                  border: icon === em ? '2px solid var(--color-primary)' : '1px solid var(--border-subtle)',
                  background: icon === em ? 'rgba(0, 122, 255, 0.15)' : 'var(--bg-surface-elevated)',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                {em}
              </button>
            ))}
          </div>
        </div>

        {/* 6. ATMOSFER / TEMA RENK PALETİ */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)' }}>
            Oda Atmosfer Rengi:
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '8px' }}>
            {THEME_PALETTES.map(pal => (
              <button
                key={pal.id}
                type="button"
                onClick={() => setThemeGradient(pal.gradient)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px',
                  borderRadius: 'var(--radius-md)',
                  border: themeGradient === pal.gradient ? '2px solid var(--color-primary)' : '1px solid var(--border-subtle)',
                  background: 'var(--bg-surface-elevated)',
                  cursor: 'pointer',
                  textAlign: 'left'
                }}
              >
                <div style={{ width: '18px', height: '18px', borderRadius: '50%', background: pal.gradient }} />
                <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-main)' }}>{pal.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* 7. AÇIKLAMA VE KURALLAR */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)' }}>
            Oda Açıklaması & Tartışma Hedefi
          </label>
          <textarea 
            rows={2}
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="Bu odada hangi bölümleri okuyoruz, ne zaman toplanıyoruz?"
            style={{ width: '100%', padding: '9px 12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', background: 'var(--bg-surface)', resize: 'vertical' }}
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)' }}>
            Spoiler & Filtre Politikası
          </label>
          <select
            value={rules}
            onChange={e => setRules(e.target.value)}
            style={{ width: '100%', padding: '9px 12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', background: 'var(--bg-surface)' }}
          >
            <option value="Otomatik filtre aktif (Spoiler korumalı)">Otomatik filtre aktif (Spoiler korumalı)</option>
            <option value="Serbest tartışma (Spoiler etiketi zorunlu)">Serbest tartışma (Spoiler etiketi zorunlu)</option>
            <option value="Yalnızca kenar notları ve alıntılar">Yalnızca kenar notları ve alıntılar</option>
            <option value="Haftalık bölüm değerlendirmesi">Haftalık bölüm değerlendirmesi</option>
          </select>
        </div>

        {/* Kaydet Butonları */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
          <button 
            type="button" 
            className="btn btn-secondary"
            onClick={() => setIsCustomizeRoomOpen(false)}
          >
            İptal
          </button>
          <button 
            type="submit" 
            className="btn btn-primary"
            style={{ minWidth: '140px' }}
          >
            <Check size={16} />
            Profili Kaydet
          </button>
        </div>
      </form>
    </Modal>
  );
};
