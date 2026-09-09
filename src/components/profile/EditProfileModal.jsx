import React, { useState } from 'react';
import { Camera, Sparkles } from 'lucide-react';
import { Modal } from '../common/Modal';
import { useApp } from '../../context/AppContext';

export const EditProfileModal = () => {
  const { isEditProfileOpen, setIsEditProfileOpen, currentUser, updateProfile } = useApp();

  const [fullName, setFullName] = useState(currentUser?.fullName || '');
  const [username, setUsername] = useState(currentUser?.username || '');
  const [bio, setBio] = useState(currentUser?.bio || '');
  const [avatar, setAvatar] = useState(currentUser?.avatar || '');
  const [readingGoal, setReadingGoal] = useState(currentUser?.readingGoal || 30);

  React.useEffect(() => {
    if (currentUser) {
      setFullName(currentUser.fullName || '');
      setUsername(currentUser.username || '');
      setBio(currentUser.bio || '');
      setAvatar(currentUser.avatar || '');
      setReadingGoal(currentUser.readingGoal || 30);
    }
  }, [currentUser, isEditProfileOpen]);

  if (!currentUser) return null;

  const sampleAvatars = [
    'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&h=200&q=80',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&h=200&q=80',
    'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=200&h=200&q=80',
    'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&h=200&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&h=200&q=80'
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    updateProfile({
      fullName,
      username,
      bio,
      avatar,
      readingGoal: parseInt(readingGoal, 10) || 30
    });
  };

  return (
    <Modal
      isOpen={isEditProfileOpen}
      onClose={() => setIsEditProfileOpen(false)}
      title="Profili Düzenle"
      maxWidth="520px"
    >
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {/* Avatar Selection */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
          <img 
            src={avatar} 
            alt={fullName} 
            style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover', border: '3px solid var(--color-primary)' }} 
          />
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Hazır avatarlardan seçin veya URL girin:</span>
          <div style={{ display: 'flex', gap: '8px' }}>
            {sampleAvatars.map((url, i) => (
              <img
                key={i}
                src={url}
                alt=""
                onClick={() => setAvatar(url)}
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  cursor: 'pointer',
                  border: avatar === url ? '2px solid var(--color-primary)' : '1px solid var(--border-subtle)',
                  opacity: avatar === url ? 1 : 0.6
                }}
              />
            ))}
          </div>
        </div>

        {/* Full Name */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>Ad Soyad</label>
          <input
            type="text"
            required
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
        </div>

        {/* Username */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>Kullanıcı Adı</label>
          <input
            type="text"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        {/* Bio */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>Biyografi</label>
          <textarea
            rows={3}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Okuma zevklerinizden ve favori türlerinizden bahsedin..."
          />
        </div>

        {/* Reading Goal */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>
            2026 Yıllık Okuma Hedefi (Kitap Sayısı)
          </label>
          <input
            type="number"
            min={1}
            max={365}
            value={readingGoal}
            onChange={(e) => setReadingGoal(e.target.value)}
          />
        </div>

        {/* Buttons */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '8px' }}>
          <button type="button" className="btn btn-secondary" onClick={() => setIsEditProfileOpen(false)}>
            Vazgeç
          </button>
          <button type="submit" className="btn btn-primary">
            Değişiklikleri Kaydet
          </button>
        </div>
      </form>
    </Modal>
  );
};
