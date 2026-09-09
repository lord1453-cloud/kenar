import React, { useState } from 'react';
import { 
  ShieldCheck, 
  KeyRound, 
  UserPlus, 
  LogIn, 
  Send, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle,
  Crown,
  Lock,
  UserCheck
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { api } from '../../services/api';

export const ClosedBetaGateModal = () => {
  const { 
    isBetaUnlocked, 
    currentUser, 
    registerUser, 
    loginUser, 
    showToast,
    betaStatus
  } = useApp();

  const [tab, setTab] = useState('register'); // 'register' | 'login' | 'apply'
  
  // 1. Kayıt Formu State'leri (Davet Kodu Zorunlu)
  const [registerData, setRegisterData] = useState({
    firstName: '',
    lastName: '',
    age: '',
    email: '',
    password: '',
    inviteCode: ''
  });
  const [registerError, setRegisterError] = useState('');
  const [registerLoading, setRegisterLoading] = useState(false);

  // 2. Birleşik Giriş Formu State'leri (Kurucu & Kayıtlı Beta Okurları)
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  // 3. Davet İsteği Başvuru Formu State'leri
  const [applyName, setApplyName] = useState('');
  const [applyEmail, setApplyEmail] = useState('');
  const [applyDevice, setApplyDevice] = useState('web');
  const [applyNote, setApplyNote] = useState('');
  const [applyStatus, setApplyStatus] = useState(null);
  const [applyLoading, setApplyLoading] = useState(false);

  // Eğer zaten oturum açılmış ve beta kilidi açılmışsa modalı gösterme
  if (isBetaUnlocked && currentUser) {
    return null;
  }

  // 1. Davet Kodu ile Kayıt Ol
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setRegisterError('');

    if (!registerData.firstName.trim() || !registerData.lastName.trim()) {
      setRegisterError('Lütfen ad ve soyadınızı giriniz.');
      return;
    }

    const ageNum = parseInt(registerData.age, 10);
    if (isNaN(ageNum) || ageNum < 18) {
      setRegisterError('Platform kuralları gereği Kapalı Beta\'ya yalnızca 18 yaş ve üzeri okurlar katılabilir.');
      return;
    }

    if (!registerData.email.trim() || !registerData.email.includes('@')) {
      setRegisterError('Lütfen geçerli bir e-posta adresi giriniz.');
      return;
    }

    if (!registerData.password || registerData.password.length < 6) {
      setRegisterError('Şifreniz en az 6 karakter olmalıdır.');
      return;
    }

    if (!registerData.inviteCode.trim()) {
      setRegisterError('Kapalı Beta testine katılabilmek için geçerli bir Beta Davet Kodu gereklidir.');
      return;
    }

    setRegisterLoading(true);

    try {
      const res = await registerUser({
        firstName: registerData.firstName.trim(),
        lastName: registerData.lastName.trim(),
        age: ageNum,
        email: registerData.email.trim(),
        password: registerData.password,
        inviteCode: registerData.inviteCode.trim().toUpperCase()
      });

      if (!res.success) {
        setRegisterError(res.error || 'Kayıt işlemi gerçekleştirilemedi.');
      }
    } catch {
      setRegisterError('Kayıt sırasında bağlantı hatası oluştu.');
    } finally {
      setRegisterLoading(false);
    }
  };

  // 2. Birleşik Giriş (Kurucu ve Önceden Kayıtlı Beta Okurları Ortak Giriş)
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoginError('');

    if (!loginEmail.trim() || !loginPassword.trim()) {
      setLoginError('Lütfen e-posta adresinizi ve şifrenizi giriniz.');
      return;
    }

    setLoginLoading(true);

    try {
      const res = await loginUser(loginEmail.trim(), loginPassword.trim());
      if (!res.success) {
        setLoginError(res.error || 'Giriş başarısız. Lütfen bilgilerinizi kontrol ediniz.');
      }
    } catch {
      setLoginError('Giriş yapılırken sunucu bağlantı hatası oluştu.');
    } finally {
      setLoginLoading(false);
    }
  };

  // 3. Beta Katılım Başvurusu
  const handleApplySubmit = async (e) => {
    e.preventDefault();
    setApplyStatus(null);

    if (!applyEmail.trim() || !applyEmail.includes('@')) {
      setApplyStatus({ type: 'error', message: 'Lütfen geçerli bir e-posta adresi giriniz.' });
      return;
    }

    setApplyLoading(true);

    try {
      const res = await api.applyBeta({
        name: applyName.trim(),
        email: applyEmail.trim(),
        device: applyDevice,
        note: applyNote.trim()
      });

      if (res.success) {
        setApplyStatus({ type: 'success', message: res.message || 'Başvurunuz başarıyla iletildi! Davet kodunuz e-posta ile gönderilecektir.' });
        setApplyName('');
        setApplyEmail('');
        setApplyNote('');
      } else {
        setApplyStatus({ type: 'error', message: res.error || 'Başvuru gönderilemedi.' });
      }
    } catch {
      setApplyStatus({ type: 'error', message: 'Başvuru gönderilirken bir hata oluştu.' });
    } finally {
      setApplyLoading(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 99999,
      backgroundColor: 'rgba(9, 11, 17, 0.94)',
      backdropFilter: 'blur(20px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      overflowY: 'auto'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '520px',
        backgroundColor: 'var(--bg-surface)',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border-subtle)',
        boxShadow: '0 24px 70px rgba(0,0,0,0.65)',
        overflow: 'hidden',
        margin: 'auto'
      }}>
        
        {/* Üst Başlık & Rozet */}
        <div style={{
          padding: '26px 24px 18px',
          textAlign: 'center',
          borderBottom: '1px solid var(--border-subtle)',
          background: 'radial-gradient(ellipse at top, rgba(245, 158, 11, 0.14) 0%, transparent 70%)'
        }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '52px',
            height: '52px',
            borderRadius: '16px',
            background: 'rgba(245, 158, 11, 0.15)',
            border: '1px solid rgba(245, 158, 11, 0.3)',
            marginBottom: '12px',
            color: '#f59e0b'
          }}>
            <ShieldCheck size={28} />
          </div>

          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '3px 10px',
            borderRadius: '20px',
            background: 'rgba(245, 158, 11, 0.15)',
            color: '#f59e0b',
            fontSize: '0.74rem',
            fontWeight: 700,
            marginBottom: '8px'
          }}>
            <Sparkles size={13} />
            <span>KAPALI BETA • TEK HESAP SİSTEMİ</span>
          </div>

          <h2 style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--text-main)', margin: '0 0 6px', letterSpacing: '-0.3px' }}>
            Luku Kapalı Beta
          </h2>
          <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1.5 }}>
            Kapalı Beta testine katılabilmek için davet kodunuzla tekil okur hesabınızı oluşturmanız gerekmektedir. Kayıt olmadan içeri girilemez.
          </p>
        </div>

        {/* Sekme Seçici */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1.2fr 1fr 1fr',
          borderBottom: '1px solid var(--border-subtle)',
          backgroundColor: 'var(--bg-surface-elevated)'
        }}>
          <button
            onClick={() => setTab('register')}
            style={{
              padding: '13px 8px',
              fontSize: '0.8rem',
              fontWeight: tab === 'register' ? 700 : 500,
              background: 'transparent',
              border: 'none',
              borderBottom: tab === 'register' ? '2px solid var(--color-primary)' : '2px solid transparent',
              color: tab === 'register' ? 'var(--color-primary)' : 'var(--text-dim)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              transition: 'all 0.15s ease'
            }}
          >
            <UserPlus size={15} /> Davetle Kayıt Ol
          </button>
          <button
            onClick={() => setTab('login')}
            style={{
              padding: '13px 8px',
              fontSize: '0.8rem',
              fontWeight: tab === 'login' ? 700 : 500,
              background: 'transparent',
              border: 'none',
              borderBottom: tab === 'login' ? '2px solid var(--color-primary)' : '2px solid transparent',
              color: tab === 'login' ? 'var(--color-primary)' : 'var(--text-dim)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              transition: 'all 0.15s ease'
            }}
          >
            <LogIn size={15} /> Giriş Yap
          </button>
          <button
            onClick={() => setTab('apply')}
            style={{
              padding: '13px 8px',
              fontSize: '0.8rem',
              fontWeight: tab === 'apply' ? 700 : 500,
              background: 'transparent',
              border: 'none',
              borderBottom: tab === 'apply' ? '2px solid var(--color-primary)' : '2px solid transparent',
              color: tab === 'apply' ? 'var(--color-primary)' : 'var(--text-dim)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              transition: 'all 0.15s ease'
            }}
          >
            <Send size={15} /> Davet İste
          </button>
        </div>

        {/* Tab İçerikleri */}
        <div style={{ padding: '22px 24px 26px' }}>
          
          {/* 1. DAVET KODU İLE KAYIT OL (Ana Akış) */}
          {tab === 'register' && (
            <form onSubmit={handleRegisterSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '13px' }}>
              
              {registerError && (
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
                  <span>{registerError}</span>
                </div>
              )}

              {/* Ad & Soyad */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, marginBottom: '5px', color: 'var(--text-main)' }}>
                    Adınız *
                  </label>
                  <input
                    type="text"
                    placeholder="Ad"
                    value={registerData.firstName}
                    onChange={(e) => setRegisterData(prev => ({ ...prev, firstName: e.target.value }))}
                    style={{ width: '100%', padding: '9px 12px', fontSize: '0.88rem', borderRadius: 'var(--radius-sm)' }}
                    required
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, marginBottom: '5px', color: 'var(--text-main)' }}>
                    Soyadınız *
                  </label>
                  <input
                    type="text"
                    placeholder="Soyad"
                    value={registerData.lastName}
                    onChange={(e) => setRegisterData(prev => ({ ...prev, lastName: e.target.value }))}
                    style={{ width: '100%', padding: '9px 12px', fontSize: '0.88rem', borderRadius: 'var(--radius-sm)' }}
                    required
                  />
                </div>
              </div>

              {/* Yaş & E-posta */}
              <div style={{ display: 'grid', gridTemplateColumns: '100px 1fr', gap: '10px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, marginBottom: '5px', color: 'var(--text-main)' }}>
                    Yaş (18+) *
                  </label>
                  <input
                    type="number"
                    min="18"
                    max="110"
                    placeholder="18"
                    value={registerData.age}
                    onChange={(e) => setRegisterData(prev => ({ ...prev, age: e.target.value }))}
                    style={{ width: '100%', padding: '9px 12px', fontSize: '0.88rem', borderRadius: 'var(--radius-sm)' }}
                    required
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, marginBottom: '5px', color: 'var(--text-main)' }}>
                    E-posta Adresi *
                  </label>
                  <input
                    type="email"
                    placeholder="okur@kitapkulubu.com"
                    value={registerData.email}
                    onChange={(e) => setRegisterData(prev => ({ ...prev, email: e.target.value }))}
                    style={{ width: '100%', padding: '9px 12px', fontSize: '0.88rem', borderRadius: 'var(--radius-sm)' }}
                    required
                  />
                </div>
              </div>

              {/* Şifre */}
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, marginBottom: '5px', color: 'var(--text-main)' }}>
                  Şifre Belirleyin *
                </label>
                <input
                  type="password"
                  placeholder="En az 6 karakter"
                  value={registerData.password}
                  onChange={(e) => setRegisterData(prev => ({ ...prev, password: e.target.value }))}
                  style={{ width: '100%', padding: '9px 12px', fontSize: '0.88rem', borderRadius: 'var(--radius-sm)' }}
                  required
                />
              </div>

              {/* Beta Davet Kodu */}
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, marginBottom: '5px', color: 'var(--color-primary)' }}>
                  🔑 Beta Davet Kodu (Zorunlu) *
                </label>
                <input
                  type="text"
                  placeholder="Örn: BETA-KITAP-2026"
                  value={registerData.inviteCode}
                  onChange={(e) => setRegisterData(prev => ({ ...prev, inviteCode: e.target.value.toUpperCase() }))}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    fontSize: '0.95rem',
                    fontFamily: 'monospace',
                    letterSpacing: '1px',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--color-primary)'
                  }}
                  required
                />
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                  Kurucu tarafından sağlanan davet kodunuzu giriniz.
                </div>
              </div>

              {/* Bilgilendirme Kutusu */}
              <div style={{
                padding: '9px 12px',
                borderRadius: 'var(--radius-xs)',
                background: 'rgba(59, 130, 246, 0.08)',
                border: '1px solid rgba(59, 130, 246, 0.2)',
                fontSize: '0.76rem',
                color: 'var(--text-muted)',
                lineHeight: 1.4
              }}>
                ℹ️ Kapalı Beta sürecinde her kullanıcının tek bir kişisel hesabı bulunur. Kayıt olduktan sonra tekil hesabınızla giriş yaparsınız.
              </div>

              <button
                type="submit"
                disabled={registerLoading}
                className="btn btn-primary"
                style={{
                  width: '100%',
                  padding: '12px',
                  fontWeight: 700,
                  fontSize: '0.92rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  marginTop: '4px'
                }}
              >
                {registerLoading ? (
                  <span>Hesap Oluşturuluyor...</span>
                ) : (
                  <>
                    <UserCheck size={17} />
                    <span>Beta Hesabımı Aç ve Giriş Yap</span>
                  </>
                )}
              </button>

              <div style={{ textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                Zaten kayıtlı bir hesabınız var mı?{' '}
                <button
                  type="button"
                  onClick={() => setTab('login')}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--color-primary)',
                    fontWeight: 600,
                    cursor: 'pointer',
                    textDecoration: 'underline',
                    padding: 0
                  }}
                >
                  Giriş Yap
                </button>
              </div>
            </form>
          )}

          {/* 2. STANDART GİRİŞ YAP */}
          {tab === 'login' && (
            <form onSubmit={handleLoginSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1.5 }}>
                Kayıtlı e-posta adresiniz ve şifreniz ile oturum açınız:
              </p>

              {loginError && (
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
                  <span>{loginError}</span>
                </div>
              )}

              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, marginBottom: '6px', color: 'var(--text-main)' }}>
                  E-posta Adresi
                </label>
                <input
                  type="email"
                  placeholder="ornek@kitapkulubu.com"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    fontSize: '0.9rem',
                    borderRadius: 'var(--radius-sm)'
                  }}
                  required
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, marginBottom: '6px', color: 'var(--text-main)' }}>
                  Şifre
                </label>
                <input
                  type="password"
                  placeholder="Şifreniz"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    fontSize: '0.9rem',
                    borderRadius: 'var(--radius-sm)'
                  }}
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loginLoading}
                className="btn btn-primary"
                style={{
                  width: '100%',
                  padding: '12px',
                  fontWeight: 700,
                  fontSize: '0.92rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  marginTop: '6px'
                }}
              >
                {loginLoading ? (
                  <span>Doğrulanıyor...</span>
                ) : (
                  <>
                    <LogIn size={17} />
                    <span>Oturum Aç</span>
                  </>
                )}
              </button>

              {/* Hızlı Test & Demo Girişi Butonları */}
              <div style={{
                marginTop: '10px',
                padding: '10px',
                borderRadius: 'var(--radius-sm)',
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px dashed var(--border-subtle)',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '0.74rem', color: 'var(--text-dim)', marginBottom: '8px', fontWeight: 600 }}>
                  ⚡ HIZLI TEST / DEMO GİRİŞİ:
                </div>
                <div style={{ display: 'flex', gap: '6px', justifyContent: 'center', flexWrap: 'wrap' }}>
                  <button
                    type="button"
                    onClick={() => { setLoginEmail('kurucu@kitapkulubu.com'); setLoginPassword('123456'); }}
                    className="badge badge-orange"
                    style={{ cursor: 'pointer', border: 'none', padding: '5px 9px', fontSize: '0.74rem' }}
                  >
                    👑 Kurucu (Ayşe)
                  </button>
                  <button
                    type="button"
                    onClick={() => { setLoginEmail('yasmin@kitapkulubu.com'); setLoginPassword('123456'); }}
                    className="badge badge-purple"
                    style={{ cursor: 'pointer', border: 'none', padding: '5px 9px', fontSize: '0.74rem' }}
                  >
                    ✍️ Yazar (Yasmin)
                  </button>
                  <button
                    type="button"
                    onClick={() => { setLoginEmail('can@kitapkulubu.com'); setLoginPassword('123456'); }}
                    className="badge badge-green"
                    style={{ cursor: 'pointer', border: 'none', padding: '5px 9px', fontSize: '0.74rem' }}
                  >
                    📖 Okur (Can)
                  </button>
                </div>
              </div>

              <div style={{ textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                Henüz beta hesabınız yok mu?{' '}
                <button
                  type="button"
                  onClick={() => setTab('register')}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--color-primary)',
                    fontWeight: 600,
                    cursor: 'pointer',
                    textDecoration: 'underline',
                    padding: 0
                  }}
                >
                  Davet Kodu ile Kayıt Ol
                </button>
              </div>
            </form>
          )}

          {/* 3. DAVET İSTE (Başvuru Formu) */}
          {tab === 'apply' && (
            <form onSubmit={handleApplySubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1.4 }}>
                Henüz bir davet kodunuz yoksa, geliştirici ekibine kapalı beta katılım başvurusu iletebilirsiniz:
              </p>

              {applyStatus && (
                <div style={{
                  padding: '10px 12px',
                  borderRadius: 'var(--radius-xs)',
                  background: applyStatus.type === 'success' ? 'var(--color-success-light)' : 'var(--color-danger-light)',
                  color: applyStatus.type === 'success' ? 'var(--color-success)' : 'var(--color-danger)',
                  fontSize: '0.82rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  {applyStatus.type === 'success' ? <CheckCircle2 size={15} /> : <AlertCircle size={15} />}
                  <span>{applyStatus.message}</span>
                </div>
              )}

              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, marginBottom: '6px', color: 'var(--text-main)' }}>
                  Adınız ve Soyadınız
                </label>
                <input
                  type="text"
                  placeholder="Ad Soyad"
                  value={applyName}
                  onChange={(e) => setApplyName(e.target.value)}
                  style={{ width: '100%', padding: '9px 12px', fontSize: '0.88rem', borderRadius: 'var(--radius-sm)' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, marginBottom: '6px', color: 'var(--text-main)' }}>
                  E-posta Adresiniz *
                </label>
                <input
                  type="email"
                  placeholder="davetiye@kitapkulubu.com"
                  value={applyEmail}
                  onChange={(e) => setApplyEmail(e.target.value)}
                  style={{ width: '100%', padding: '9px 12px', fontSize: '0.88rem', borderRadius: 'var(--radius-sm)' }}
                  required
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, marginBottom: '6px', color: 'var(--text-main)' }}>
                  Test Edeceğiniz Cihaz
                </label>
                <select
                  value={applyDevice}
                  onChange={(e) => setApplyDevice(e.target.value)}
                  style={{ width: '100%', padding: '9px 12px', fontSize: '0.88rem', borderRadius: 'var(--radius-sm)' }}
                >
                  <option value="web">Web Tarayıcısı (Masaüstü)</option>
                  <option value="ios">Apple iPhone (iOS / TestFlight)</option>
                  <option value="android">Android Cihaz (APK / Play Internal)</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, marginBottom: '6px', color: 'var(--text-main)' }}>
                  Okuma Alışkanlıklarınız ve Notunuz (İsteğe bağlı)
                </label>
                <textarea
                  rows={2}
                  placeholder="Hangi türleri okursunuz, test sürecinde neyi denemek istersiniz?"
                  value={applyNote}
                  onChange={(e) => setApplyNote(e.target.value)}
                  style={{ width: '100%', padding: '9px 12px', fontSize: '0.84rem', borderRadius: 'var(--radius-sm)', resize: 'vertical' }}
                />
              </div>

              <button
                type="submit"
                disabled={applyLoading}
                className="btn btn-secondary"
                style={{
                  width: '100%',
                  padding: '11px',
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  marginTop: '4px'
                }}
              >
                {applyLoading ? (
                  <span>Gönderiliyor...</span>
                ) : (
                  <>
                    <Send size={15} />
                    <span>Davet Talebini Gönder</span>
                  </>
                )}
              </button>
            </form>
          )}

        </div>
      </div>
    </div>
  );
};
