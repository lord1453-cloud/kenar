import React, { useState } from 'react';
import { Shield, Sparkles, AlertCircle, Check } from 'lucide-react';
import { Modal } from '../common/Modal';
import { useApp } from '../../context/AppContext';

export const CreateRoomModal = () => {
  const { 
    isCreateRoomOpen, 
    setIsCreateRoomOpen, 
    createRoom, 
    currentUser,
    isAdminUser,
    setActiveTab 
  } = useApp();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [rules, setRules] = useState('');
  const [icon, setIcon] = useState('📖');
  const [error, setError] = useState('');

  const hasAdminPrivilege = isAdminUser();
  const roomCredit = currentUser?.roomCredit || 0;
  const canCreate = hasAdminPrivilege || roomCredit >= 1;

  const availableIcons = ['📖', '🪐', '🏛️', '🧙', '☕', '🧠', '🌿', '🌙'];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!canCreate) {
      setError('Oda açabilmek için aylık okuma hedeflerini tamamlayarak Yıldızlı Kullanıcı (★) olmalısınız.');
      return;
    }

    if (!name.trim()) return;

    const res = createRoom({
      name,
      description,
      rules,
      icon
    });

    if (res.success) {
      setName('');
      setDescription('');
      setRules('');
      setIcon('📖');
      setError('');
    } else {
      setError(res.error);
    }
  };

  return (
    <Modal
      isOpen={isCreateRoomOpen}
      onClose={() => {
        setIsCreateRoomOpen(false);
        setError('');
      }}
      title="Yeni Okuma Odası Oluştur"
      maxWidth="480px"
    >
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        
        {/* Privilege Status Box */}
        <div style={{
          background: canCreate ? 'var(--bg-surface-elevated)' : 'var(--color-danger-light)',
          border: `1px solid ${canCreate ? 'var(--border-subtle)' : 'var(--color-danger)'}`,
          borderRadius: 'var(--radius-xs)',
          padding: '12px 14px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          {hasAdminPrivilege ? (
            <>
              <Shield size={18} color="var(--color-primary)" />
              <div style={{ fontSize: '0.84rem', color: 'var(--text-main)' }}>
                <strong>Yönetici Yetkisi:</strong> Herhangi bir kredi kısıtlaması olmaksızın oda açabilirsiniz.
              </div>
            </>
          ) : roomCredit >= 1 ? (
            <>
              <span style={{ fontSize: '1.2rem', color: 'var(--color-star)' }}>★</span>
              <div style={{ fontSize: '0.84rem', color: 'var(--text-main)' }}>
                <strong>Yıldızlı Kullanıcı:</strong> {roomCredit} adet oda açma hakkınız bulunuyor.
              </div>
            </>
          ) : (
            <>
              <AlertCircle size={18} color="var(--color-danger)" />
              <div style={{ fontSize: '0.82rem', color: 'var(--color-danger)' }}>
                <strong>Oda Açma Hakkınız Yok:</strong> Oda oluşturma ayrıcalığı yalnızca aylık okuma hedeflerini tamamlayan Yıldızlı Kullanıcılara (★) ve Adminlere aittir.
              </div>
            </>
          )}
        </div>

        {error && (
          <div style={{ color: 'var(--color-danger)', fontSize: '0.84rem' }}>
            {error}
          </div>
        )}

        {/* Icon Picker */}
        <div>
          <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '6px', display: 'block' }}>
            Oda Simgesi
          </label>
          <div style={{ display: 'flex', gap: '8px' }}>
            {availableIcons.map(ic => (
              <button
                type="button"
                key={ic}
                onClick={() => setIcon(ic)}
                style={{
                  width: '38px',
                  height: '38px',
                  fontSize: '1.2rem',
                  borderRadius: 'var(--radius-xs)',
                  background: icon === ic ? 'var(--color-primary-light)' : 'var(--bg-surface-elevated)',
                  border: icon === ic ? '1px solid var(--color-primary)' : '1px solid var(--border-subtle)',
                  cursor: 'pointer'
                }}
              >
                {ic}
              </button>
            ))}
          </div>
        </div>

        {/* Name */}
        <div>
          <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-main)', display: 'block', marginBottom: '4px' }}>
            Oda Adı *
          </label>
          <input
            type="text"
            required
            disabled={!canCreate}
            placeholder="Örn: 20. Yüzyıl Klasikleri Kulübü"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{ width: '100%', padding: '8px 10px', fontSize: '0.88rem' }}
          />
        </div>

        {/* Description */}
        <div>
          <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-main)', display: 'block', marginBottom: '4px' }}>
            Açıklama & Odak Noktası
          </label>
          <textarea
            rows={2}
            disabled={!canCreate}
            placeholder="Bu odada hangi yazarları ve eserleri konuşacağız?"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            style={{ width: '100%', padding: '8px 10px', fontSize: '0.88rem', resize: 'none' }}
          />
        </div>

        {/* Rules */}
        <div>
          <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-main)', display: 'block', marginBottom: '4px' }}>
            Oda Kuralları
          </label>
          <input
            type="text"
            disabled={!canCreate}
            placeholder="Örn: Spoiler uyarısı zorunludur, saygılı tartışma."
            value={rules}
            onChange={(e) => setRules(e.target.value)}
            style={{ width: '100%', padding: '8px 10px', fontSize: '0.88rem' }}
          />
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '6px' }}>
          <button 
            type="button" 
            className="btn btn-secondary btn-sm" 
            onClick={() => setIsCreateRoomOpen(false)}
          >
            Kapat
          </button>
          
          {canCreate ? (
            <button 
              type="submit" 
              className="btn btn-primary btn-sm"
            >
              Odayı Başlat
            </button>
          ) : (
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => {
                setIsCreateRoomOpen(false);
                setActiveTab('live_reading');
              }}
            >
              Okumaya Başla & Yıldız Kazan
            </button>
          )}
        </div>
      </form>
    </Modal>
  );
};
