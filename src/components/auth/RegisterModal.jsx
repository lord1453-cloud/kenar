import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { useApp } from '../../context/AppContext';
import { UserCheck, AlertCircle } from 'lucide-react';

export const RegisterModal = () => {
  const { isRegisterOpen, setIsRegisterOpen, registerUser } = useApp();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    age: '',
    email: '',
    password: ''
  });

  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.firstName || !formData.lastName || !formData.age || !formData.email || !formData.password) {
      setError('Lütfen tüm zorunlu alanları doldurunuz.');
      return;
    }

    const res = registerUser(formData);
    if (!res.success) {
      setError(res.error);
    } else {
      setFormData({ firstName: '', lastName: '', age: '', email: '', password: '' });
      setError('');
    }
  };

  return (
    <Modal
      isOpen={isRegisterOpen}
      onClose={() => {
        setIsRegisterOpen(false);
        setError('');
      }}
      title="Yeni Okur Kaydı"
      maxWidth="440px"
    >
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)', margin: 0 }}>
          Luku topluluğuna katılmak için lütfen bilgilerinizi eksiksiz doldurunuz.
        </p>

        {error && (
          <div style={{
            background: 'var(--color-danger-light)',
            border: '1px solid var(--color-danger)',
            borderRadius: 'var(--radius-xs)',
            padding: '10px 12px',
            color: 'var(--color-danger)',
            fontSize: '0.84rem',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '4px' }}>
              Ad *
            </label>
            <input
              type="text"
              name="firstName"
              placeholder="Adınız"
              value={formData.firstName}
              onChange={handleChange}
              style={{ width: '100%', padding: '8px 10px', fontSize: '0.88rem' }}
              required
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '4px' }}>
              Soyad *
            </label>
            <input
              type="text"
              name="lastName"
              placeholder="Soyadınız"
              value={formData.lastName}
              onChange={handleChange}
              style={{ width: '100%', padding: '8px 10px', fontSize: '0.88rem' }}
              required
            />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '10px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '4px' }}>
              Yaş (18+) *
            </label>
            <input
              type="number"
              name="age"
              placeholder="24"
              min="1"
              value={formData.age}
              onChange={handleChange}
              style={{ width: '100%', padding: '8px 10px', fontSize: '0.88rem' }}
              required
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '4px' }}>
              E-posta *
            </label>
            <input
              type="email"
              name="email"
              placeholder="ornek@kitapkulubu.com"
              value={formData.email}
              onChange={handleChange}
              style={{ width: '100%', padding: '8px 10px', fontSize: '0.88rem' }}
              required
            />
          </div>
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '4px' }}>
            Şifre *
          </label>
          <input
            type="password"
            name="password"
            placeholder="En az 6 karakter"
            value={formData.password}
            onChange={handleChange}
            style={{ width: '100%', padding: '8px 10px', fontSize: '0.88rem' }}
            required
          />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-primary)', marginBottom: '4px' }}>
            🔑 Beta Davet Kodu (Zorunlu) *
          </label>
          <input
            type="text"
            name="inviteCode"
            placeholder="Örn: BETA-KITAP-2026"
            value={formData.inviteCode || ''}
            onChange={handleChange}
            style={{ width: '100%', padding: '8px 10px', fontSize: '0.9rem', fontFamily: 'monospace', letterSpacing: '1px' }}
            required
          />
        </div>

        <span style={{ fontSize: '0.74rem', color: 'var(--text-dim)' }}>
          * Platform kuralları gereği Kapalı Beta'ya yalnızca 18 yaş ve üzeri okurlar davet kodu ile kayıt olabilir.
        </span>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '6px' }}>
          <button 
            type="button" 
            className="btn btn-secondary btn-sm" 
            onClick={() => setIsRegisterOpen(false)}
          >
            Vazgeç
          </button>
          <button 
            type="submit" 
            className="btn btn-primary btn-sm"
          >
            <UserCheck size={14} /> Kaydı Tamamla
          </button>
        </div>
      </form>
    </Modal>
  );
};
