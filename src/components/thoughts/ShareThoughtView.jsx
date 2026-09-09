import React, { useState } from 'react';
import { 
  PenLine, 
  Image as ImageIcon, 
  BookOpen, 
  Send, 
  AlertCircle, 
  X, 
  EyeOff, 
  ArrowLeft 
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const ShareThoughtView = () => {
  const { 
    currentUser, 
    books, 
    moderateAndCreatePost, 
    setActiveTab 
  } = useApp();

  const [thoughtText, setThoughtText] = useState('');
  const [selectedBookId, setSelectedBookId] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [showImageInput, setShowImageInput] = useState(false);
  const [isSpoiler, setIsSpoiler] = useState(false);
  const [spoilerText, setSpoilerText] = useState('');
  const [moderationError, setModerationError] = useState('');

  const handleShare = (e) => {
    e.preventDefault();
    if (!thoughtText.trim() && !imageUrl.trim()) return;

    const res = moderateAndCreatePost({
      content: thoughtText.trim(),
      bookId: selectedBookId || null,
      imageUrl: imageUrl.trim() || null,
      isSpoiler,
      spoilerText: isSpoiler ? spoilerText.trim() : ''
    });

    if (!res.success) {
      setModerationError(res.error);
    } else {
      // Successfully published: navigate back to Home feed
      setActiveTab('feed');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="content-layout">
      <div style={{ maxWidth: '680px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        
        {/* Header with back button */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button 
              className="btn-icon" 
              onClick={() => setActiveTab('feed')} 
              title="Akışa Dön"
              style={{ width: '36px', height: '36px' }}
            >
              <ArrowLeft size={18} />
            </button>
            <div>
              <h1 style={{ fontSize: '1.35rem', fontWeight: 600, color: 'var(--text-main)', margin: 0 }}>
                Düşünce Paylaş
              </h1>
              <span style={{ fontSize: '0.84rem', color: 'var(--text-muted)' }}>
                Okuduğunuz satırlar, kitap analizleri veya edebi düşünceleriniz
              </span>
            </div>
          </div>
        </div>

        {/* Composer Card */}
        <div style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-md)',
          padding: '24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '18px'
        }}>
          {/* Author mini profile */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <img 
              src={currentUser.avatar} 
              alt={currentUser.fullName}
              style={{ width: '42px', height: '42px', borderRadius: '50%', objectFit: 'cover' }}
            />
            <div>
              <div style={{ fontWeight: 600, fontSize: '0.94rem', color: 'var(--text-main)' }}>
                {currentUser.fullName}
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                @{currentUser.username}
              </div>
            </div>
          </div>

          {/* Moderation Error Alert */}
          {moderationError && (
            <div style={{
              background: 'var(--color-danger-light)',
              border: '1px solid var(--color-danger)',
              borderRadius: 'var(--radius-xs)',
              padding: '12px 14px',
              color: 'var(--color-danger)',
              fontSize: '0.86rem',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}>
              <AlertCircle size={18} />
              <span>{moderationError}</span>
            </div>
          )}

          {/* Thought Text Input */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)' }}>
              Düşünceniz *
            </label>
            <textarea
              placeholder="Bir kitap, bir pasaj ya da bugün aklınızı kurcalayan bir fikir hakkında yazın..."
              value={thoughtText}
              onChange={(e) => {
                setThoughtText(e.target.value);
                setModerationError('');
              }}
              rows={6}
              style={{
                width: '100%',
                resize: 'vertical',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-xs)',
                padding: '12px 14px',
                fontSize: '0.94rem',
                lineHeight: 1.6,
                background: 'var(--bg-input)',
                color: 'var(--text-main)',
                fontFamily: 'var(--font-body)'
              }}
            />
          </div>

          {/* Optional Book Tagging */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)' }}>
              İlgili Kitap (İsteğe Bağlı)
            </label>
            <select
              value={selectedBookId}
              onChange={(e) => setSelectedBookId(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 12px',
                fontSize: '0.88rem',
                borderRadius: 'var(--radius-xs)',
                border: '1px solid var(--border-subtle)',
                background: 'var(--bg-surface-elevated)',
                color: 'var(--text-main)'
              }}
            >
              <option value="">Kitap Seçilmedi</option>
              {books.map(b => (
                <option key={b.id} value={b.id}>
                  {b.title} — {b.author}
                </option>
              ))}
            </select>
          </div>

          {/* Optional Image URL Input (with moderation notice) */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)' }}>
                Görsel Ekle (İsteğe Bağlı)
              </label>
              <button
                type="button"
                className="btn btn-ghost btn-sm"
                onClick={() => setShowImageInput(!showImageInput)}
                style={{ fontSize: '0.8rem', padding: '2px 8px' }}
              >
                {showImageInput ? 'Görsel Alanını Gizle' : '+ Görsel URL Ekle'}
              </button>
            </div>

            {showImageInput && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input
                    type="text"
                    placeholder="https://... (Doğal okuma köşeleri, kitap kapakları)"
                    value={imageUrl}
                    onChange={(e) => {
                      setImageUrl(e.target.value);
                      setModerationError('');
                    }}
                    style={{ flex: 1, padding: '9px 12px', fontSize: '0.88rem' }}
                  />
                  {imageUrl && (
                    <button
                      type="button"
                      className="btn-icon"
                      onClick={() => setImageUrl('')}
                      style={{ width: '38px', height: '38px' }}
                    >
                      <X size={16} />
                    </button>
                  )}
                </div>
                <span style={{ fontSize: '0.74rem', color: 'var(--text-dim)' }}>
                  * Telif hakkı kuralları gereğince kitabın tam sayfalarının taranması veya yetkisiz içerikler moderasyon sistemi tarafından engellenir.
                </span>
              </div>
            )}
          </div>

          {/* Spoiler Protection Toggle */}
          <div style={{ background: 'var(--bg-surface-elevated)', padding: '12px 14px', borderRadius: 'var(--radius-xs)', border: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.86rem', fontWeight: 600, color: 'var(--text-main)', userSelect: 'none' }}>
              <input
                type="checkbox"
                checked={isSpoiler}
                onChange={(e) => setIsSpoiler(e.target.checked)}
                style={{ width: '16px', height: '16px', cursor: 'pointer' }}
              />
              <EyeOff size={15} color="var(--text-muted)" />
              <span>Bu paylaşım kitap hakkında sürpriz bozan (spoiler) içerir</span>
            </label>

            {isSpoiler && (
              <input
                type="text"
                placeholder="Örn: 4. Bölüm sonundaki olay hakkında..."
                value={spoilerText}
                onChange={(e) => setSpoilerText(e.target.value)}
                style={{ fontSize: '0.84rem', padding: '8px 10px' }}
              />
            )}
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', paddingTop: '8px' }}>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setActiveTab('feed')}
            >
              Vazgeç
            </button>

            <button
              type="button"
              className="btn btn-primary"
              disabled={!thoughtText.trim() && !imageUrl.trim()}
              onClick={handleShare}
              style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '10px 20px' }}
            >
              <Send size={15} />
              <span>Düşünceyi Paylaş</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
