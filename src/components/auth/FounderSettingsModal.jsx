import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { Crown, KeyRound, Mail, User, CheckCircle2, AlertCircle } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { api } from '../../services/api';

export const FounderSettingsModal = ({ isOpen, onClose }) => {
  const { currentUser, setUsers, showToast, isFounder } = useApp();

  const [fullName, setFullName] = useState(currentUser?.fullName || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (currentUser) {
      setFullName(currentUser.fullName);
      setEmail(currentUser.email);
    }
  }, [currentUser]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!fullName.trim() || !email.trim()) {
      setError('İsim ve e-posta alanları zorunludur.');
      return;
    }

    setLoading(true);
    try {
      const res = await api.updateFounderProfile({
        fullName: fullName.trim(),
        email: email.trim().toLowerCase(),
        password: password.trim() ? password.trim() : undefined
      });

      if (res.success) {
        // App context users listesini de güncelle
        setUsers(prev => prev.map(u => u.id === currentUser.id ? {
          ...u,
          fullName: fullName.trim(),
          firstName: fullName.trim().split(' ')[0],
          lastName: fullName.trim().split(' ').slice(1).join(' ') || 'Kurucu',
          email: email.trim().toLowerCase()
        } : u));

        setSuccess('Kurucu hesap bilgileri başarıyla güncellendi!');
        showToast('Kurucu hesabı güncellendi', '👑');
        setPassword('');
        setTimeout(() => {
          onClose();
        }, 1200);
      } else {
        setError(res.error || 'Güncelleme başarısız oldu.');
      }
    } catch {
      setError('Sunucu ile bağlantı kurulamadı.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="★ Kurucu (Founder) Hesabı Ayarları"
      maxWidth="460px"
    >
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', margin: 0 }}>
          Sistem kurucusu olarak adınızı, giriş e-postanızı ve güvenli şifrenizi dilediğiniz an buradan güncelleyebilirsiniz.
        </p>

        {error && (
          <div style={{
            padding: '10px 12px',
            borderRadius: 'var(--radius-xs)',
            background: 'var(--color-danger-light)',
            color: 'var(--color-danger)',
            fontSize: '0.82rem',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <AlertCircle size={15} />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div style={{
            padding: '10px 12px',
            borderRadius: 'var(--radius-xs)',
            background: 'var(--color-success-light)',
            color: 'var(--color-success)',
            fontSize: '0.82rem',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <CheckCircle2 size={15} />
            <span>{success}</span>
          </div>
        )}

        <div>
          <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '5px' }}>
            Kurucu Adı & Soyadı *
          </label>
          <div style={{ position: 'relative' }}>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Adınız ve Soyadınız"
              style={{ width: '100%', padding: '9px 12px 9px 34px', fontSize: '0.88rem', borderRadius: 'var(--radius-sm)' }}
              required
            />
            <User size={15} color="var(--text-dim)" style={{ position: 'absolute', left: '10px', top: '12px' }} />
          </div>
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '5px' }}>
            Kurucu E-posta Adresi *
          </label>
          <div style={{ position: 'relative' }}>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="kurucu@kitapkulubu.com"
              style={{ width: '100%', padding: '9px 12px 9px 34px', fontSize: '0.88rem', borderRadius: 'var(--radius-sm)' }}
              required
            />
            <Mail size={15} color="var(--text-dim)" style={{ position: 'absolute', left: '10px', top: '12px' }} />
          </div>
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '5px' }}>
            Yeni Şifre (Değiştirmek istemiyorsanız boş bırakın)
          </label>
          <div style={{ position: 'relative' }}>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Yeni şifreniz"
              style={{ width: '100%', padding: '9px 12px 9px 34px', fontSize: '0.88rem', borderRadius: 'var(--radius-sm)' }}
            />
            <KeyRound size={15} color="var(--text-dim)" style={{ position: 'absolute', left: '10px', top: '12px' }} />
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '10px' }}>
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={onClose}
          >
            Vazgeç
          </button>
          <button
            type="submit"
            className="btn btn-primary btn-sm"
            disabled={loading}
            style={{ background: 'var(--color-star)', color: '#000', border: 'none', fontWeight: 700 }}
          >
            {loading ? 'Kaydediliyor...' : '★ Bilgileri Kaydet'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
