import React, { useState } from 'react';
import { Modal } from './Modal';
import { useApp } from '../../context/AppContext';
import { Bug, Send, Image, CheckCircle, AlertCircle } from 'lucide-react';

export const BetaFeedbackModal = ({ isOpen, onClose }) => {
  const { activeTab, currentUser, submitBetaFeedback, showToast } = useApp();
  
  const [description, setDescription] = useState('');
  const [selectedScreen, setSelectedScreen] = useState(activeTab || 'feed');
  const [screenshotPreview, setScreenshotPreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const screens = [
    { id: 'feed', label: 'Ana Sayfa / Akış' },
    { id: 'thoughts', label: 'Düşünceler' },
    { id: 'live_reading', label: 'Canlı Okuma' },
    { id: 'library', label: 'Kitaplığım' },
    { id: 'rooms', label: 'Odalar' },
    { id: 'friends', label: 'Arkadaşlar' },
    { id: 'profile', label: 'Profil' },
    { id: 'settings', label: 'Ayarlar' },
    { id: 'admin', label: 'Admin Paneli' }
  ];

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setScreenshotPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!description.trim()) return;

    setIsSubmitting(true);
    try {
      await submitBetaFeedback({
        description: description.trim(),
        screen: screens.find(s => s.id === selectedScreen)?.label || selectedScreen,
        screenshotUrl: screenshotPreview,
        appVersion: '0.1.0-beta',
        buildNumber: 1
      });
      setSuccess(true);
      showToast('Hata bildiriminiz kurucuya iletildi. Teşekkürler!', '🐞');
      setTimeout(() => {
        setSuccess(false);
        setDescription('');
        setScreenshotPreview(null);
        onClose();
      }, 1500);
    } catch {
      showToast('Geri bildirim gönderilirken bir hata oluştu.', '⚠️');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Beta Hata & Geri Bildirim"
      maxWidth="480px"
    >
      {success ? (
        <div style={{ textAlign: 'center', padding: '30px 10px' }}>
          <CheckCircle size={44} color="var(--color-success, #10b981)" style={{ marginBottom: '12px' }} />
          <h3 style={{ fontSize: '1.1rem', margin: '0 0 6px 0', color: 'var(--text-main)' }}>
            Geri Bildiriminiz Alındı!
          </h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Beta test sürecine sağladığınız değerli katkı için teşekkür ederiz.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{
            background: 'var(--bg-surface-elevated, #252836)',
            padding: '10px 12px',
            borderRadius: 'var(--radius-xs, 6px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            border: '1px solid var(--border-subtle, #32374a)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Bug size={16} color="var(--color-star, #f59e0b)" />
              <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-main)' }}>
                Luku Beta v0.1.0-beta
              </span>
            </div>
            <span style={{
              background: 'var(--color-primary-light, #1e3a8a)',
              color: 'var(--color-primary, #60a5fa)',
              fontSize: '0.72rem',
              padding: '2px 8px',
              borderRadius: '12px',
              fontWeight: 700
            }}>
              Platform: Web
            </span>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '6px', color: 'var(--text-main)' }}>
              Bulunulan Ekran / Bölüm
            </label>
            <select
              value={selectedScreen}
              onChange={(e) => setSelectedScreen(e.target.value)}
              style={{
                width: '100%',
                padding: '8px 10px',
                borderRadius: 'var(--radius-xs, 6px)',
                background: 'var(--bg-surface-elevated, #1f222e)',
                color: 'var(--text-main)',
                border: '1px solid var(--border-subtle, #32374a)',
                fontSize: '0.88rem'
              }}
            >
              {screens.map(s => (
                <option key={s.id} value={s.id}>{s.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '6px', color: 'var(--text-main)' }}>
              Hata Açıklaması veya Öneri *
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Karşılaştığınız hatayı, beklenen davranışı veya önerinizi kısaca açıklayınız..."
              rows={4}
              required
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: 'var(--radius-xs, 6px)',
                background: 'var(--bg-surface-elevated, #1f222e)',
                color: 'var(--text-main)',
                border: '1px solid var(--border-subtle, #32374a)',
                fontSize: '0.88rem',
                resize: 'vertical'
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '6px', color: 'var(--text-main)' }}>
              İsteğe Bağlı Ekran Görüntüsü
            </label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <label style={{
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '7px 12px',
                borderRadius: 'var(--radius-xs, 6px)',
                background: 'var(--bg-surface-elevated, #252836)',
                border: '1px dashed var(--border-subtle, #3b82f6)',
                color: 'var(--text-main)',
                fontSize: '0.82rem'
              }}>
                <Image size={15} />
                <span>Fotoğraf Seç</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  style={{ display: 'none' }}
                />
              </label>
              {screenshotPreview && (
                <span style={{ fontSize: '0.78rem', color: 'var(--color-success, #10b981)' }}>
                  ✓ Ekran görüntüsü eklendi
                </span>
              )}
            </div>
            {screenshotPreview && (
              <div style={{ marginTop: '8px', position: 'relative' }}>
                <img
                  src={screenshotPreview}
                  alt="Önizleme"
                  style={{
                    maxHeight: '120px',
                    borderRadius: 'var(--radius-xs, 6px)',
                    border: '1px solid var(--border-subtle, #32374a)',
                    objectFit: 'contain'
                  }}
                />
                <button
                  type="button"
                  onClick={() => setScreenshotPreview(null)}
                  style={{
                    position: 'absolute',
                    top: '4px',
                    left: '100px',
                    background: 'rgba(0,0,0,0.7)',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '4px',
                    padding: '2px 6px',
                    fontSize: '0.7rem',
                    cursor: 'pointer'
                  }}
                >
                  Kaldır
                </button>
              </div>
            )}
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '10px' }}>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Vazgeç
            </button>
            <button
              type="submit"
              className="btn btn-primary btn-sm"
              disabled={isSubmitting || !description.trim()}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
            >
              <Send size={14} />
              <span>{isSubmitting ? 'Gönderiliyor...' : 'Hata Bildir'}</span>
            </button>
          </div>
        </form>
      )}
    </Modal>
  );
};
