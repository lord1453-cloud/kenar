import React, { useState } from 'react';
import { Lock, Eye, EyeOff, Shield, Check } from 'lucide-react';
import { Modal } from '../common/Modal';
import { useApp } from '../../context/AppContext';

export const PrivacySettingsModal = () => {
  const { isPrivacyOpen, setIsPrivacyOpen, currentUser, updatePrivacySettings } = useApp();

  const currentSettings = currentUser?.privacySettings || {
    isPublic: true,
    showReadingTime: true,
    showBooks: true,
    showActivityStatus: true
  };

  const [settings, setSettings] = useState(currentSettings);

  React.useEffect(() => {
    if (currentUser?.privacySettings) {
      setSettings(currentUser.privacySettings);
    }
  }, [currentUser, isPrivacyOpen]);

  if (!currentUser) return null;

  const toggle = (key) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = () => {
    updatePrivacySettings(settings);
  };

  return (
    <Modal
      isOpen={isPrivacyOpen}
      onClose={() => setIsPrivacyOpen(false)}
      title="Gizlilik ve Görünürlük Ayarları"
      maxWidth="480px"
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          Hangi verilerinizin diğer okuyucular ve arkadaşlarınız tarafından görüntülenebileceğini seçin.
        </p>

        {/* 1. Profil Açık / Özel */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px', background: 'var(--bg-surface-elevated)', borderRadius: 'var(--radius-md)' }}>
          <div>
            <div style={{ fontWeight: 700, fontSize: '0.92rem', color: 'var(--text-main)' }}>
              Herkese Açık Profil
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>
              Kapalıysa yalnızca takipçileriniz profilinizi inceleyebilir.
            </div>
          </div>
          <input
            type="checkbox"
            checked={settings.isPublic}
            onChange={() => toggle('isPublic')}
            style={{ width: '18px', height: '18px', accentColor: 'var(--color-primary)' }}
          />
        </div>

        {/* 2. Okuma Süresi Görünürlüğü */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px', background: 'var(--bg-surface-elevated)', borderRadius: 'var(--radius-md)' }}>
          <div>
            <div style={{ fontWeight: 700, fontSize: '0.92rem', color: 'var(--text-main)' }}>
              Okuma Süremi Göster
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>
              Kronometre ve toplam okuma süresi istatistiklerinizi profilinizde paylaşır.
            </div>
          </div>
          <input
            type="checkbox"
            checked={settings.showReadingTime}
            onChange={() => toggle('showReadingTime')}
            style={{ width: '18px', height: '18px', accentColor: 'var(--color-primary)' }}
          />
        </div>

        {/* 3. Okuduğum Kitaplar Görünürlüğü */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px', background: 'var(--bg-surface-elevated)', borderRadius: 'var(--radius-md)' }}>
          <div>
            <div style={{ fontWeight: 700, fontSize: '0.92rem', color: 'var(--text-main)' }}>
              Kütüphane Raflarımı Paylaş
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>
              Okuduğunuz ve okumayı planladığınız kitapları profil ziyaretçilerine gösterir.
            </div>
          </div>
          <input
            type="checkbox"
            checked={settings.showBooks}
            onChange={() => toggle('showBooks')}
            style={{ width: '18px', height: '18px', accentColor: 'var(--color-primary)' }}
          />
        </div>

        {/* 4. Canlı Okuma Aktivitesi Durumu */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px', background: 'var(--bg-surface-elevated)', borderRadius: 'var(--radius-md)' }}>
          <div>
            <div style={{ fontWeight: 700, fontSize: '0.92rem', color: 'var(--text-main)' }}>
              Canlı Okuma Durumu
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>
              Kitap okurken arkadaşlarınıza “Şu anda kitap okuyor 📖” rozeti gösterilir.
            </div>
          </div>
          <input
            type="checkbox"
            checked={settings.showActivityStatus}
            onChange={() => toggle('showActivityStatus')}
            style={{ width: '18px', height: '18px', accentColor: 'var(--color-primary)' }}
          />
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '8px' }}>
          <button className="btn btn-secondary" onClick={() => setIsPrivacyOpen(false)}>
            Vazgeç
          </button>
          <button className="btn btn-primary" onClick={handleSave}>
            Ayarları Kaydet
          </button>
        </div>
      </div>
    </Modal>
  );
};
