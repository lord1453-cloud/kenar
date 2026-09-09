import React, { useState } from 'react';
import { 
  Palette, 
  Shield, 
  Check, 
  Sparkles, 
  Sliders, 
  Moon, 
  Sun 
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const SettingsView = () => {
  const { 
    theme, 
    setAppTheme, 
    customAccent, 
    updateCustomAccent, 
    setIsPrivacyOpen 
  } = useApp();

  const [customColorInput, setCustomColorInput] = useState(customAccent || '#3b82f6');

  // Tasarım ve Doküman Temaları (Image 2, 3, 4, 5 - Doküman Paragraf 15, 17, 19, 21)
  const docThemes = [
    {
      id: 'main',
      name: 'Ana Tema: Ayçiçeği & Pudra',
      badge: 'Görsel 2 (Varsayılan)',
      desc: 'Dengeli odaklanma: Ayçiçeği sarısı, pudra pembesi, mat siyah ve kırık beyaz',
      bg: '#f5f5f0',
      card: '#ffffff',
      text: '#191919',
      accent: '#F6D883',
      border: '#e8e8e2',
      colors: ['#191919', '#F6D883', '#F3F3EE', '#FCD5D3']
    },
    {
      id: 'main_dark',
      name: 'Ana Tema Koyu Gece',
      badge: 'Görsel 2 Koyu',
      desc: 'Gece okuması için mat siyah zemin ve ayçiçeği sarısı vurgular',
      bg: '#141414',
      card: '#222222',
      text: '#F3F3EE',
      accent: '#F6D883',
      border: '#2e2e2e',
      colors: ['#141414', '#F6D883', '#222222', '#FCD5D3']
    },
    {
      id: 'palette_sun_coral',
      name: 'Güneş & Mercan',
      badge: 'Görsel 3',
      desc: 'Enerjik ve sıcak: Güneş sarısı (#F1D007), mat mercan (#DF5940) ve açık krem',
      bg: '#faf5ed',
      card: '#ffffff',
      text: '#363230',
      accent: '#DF5940',
      border: '#e8ddce',
      colors: ['#F1D007', '#DF5940', '#FFECCD', '#363230']
    },
    {
      id: 'palette_sky_sand',
      name: 'Pastel Gökyüzü & Kum',
      badge: 'Görsel 4',
      desc: 'Ferah ve dingin: Açık gök mavisi (#97C2EC), sıcak kum beji (#D6D0C2) ve beyaz',
      bg: '#f4f6f8',
      card: '#ffffff',
      text: '#1F1F1F',
      accent: '#97C2EC',
      border: '#D6D0C2',
      colors: ['#97C2EC', '#D6D0C2', '#1F1F1F', '#FFFFFF']
    },
    {
      id: 'palette_vintage_earth',
      name: 'Vintage Edebiyat & Toprak',
      badge: 'Görsel 5',
      desc: 'Nostaljik klasik: Mürekkep moru (#5758A6), kum sarısı (#E7C58A), yeşil ve gül kurusu',
      bg: '#f9f5ef',
      card: '#ffffff',
      text: '#4B3535',
      accent: '#5758A6',
      border: '#e2d5c5',
      colors: ['#5758A6', '#E7C58A', '#86B05D', '#C77974', '#F7E6D4', '#4B3535']
    }
  ];

  // 12 Minimalist Themes as strictly required
  const themes = [
    {
      id: 'light',
      name: 'Minimal Light',
      desc: 'Temiz beyaz ve ferah açık gri arayüz',
      bg: '#f8f9fa',
      card: '#ffffff',
      text: '#1f2937',
      accent: '#2563eb',
      border: '#e5e7eb'
    },
    {
      id: 'dark',
      name: 'Minimal Dark',
      desc: 'Göz yormayan koyu arduvaz gri',
      bg: '#121417',
      card: '#1a1d21',
      text: '#f1f3f5',
      accent: '#3b82f6',
      border: '#2b3038'
    },
    {
      id: 'sepia',
      name: 'Sepia',
      desc: 'Kitap sayfasını andıran sıcak tonlar',
      bg: '#2c2520',
      card: '#362e28',
      text: '#f2e9e1',
      accent: '#d4a373',
      border: '#4e433b'
    },
    {
      id: 'paper',
      name: 'Paper',
      desc: 'Eski kitap kağıdı ve keten açık tonlar',
      bg: '#f4eee1',
      card: '#faf6ed',
      text: '#332b24',
      accent: '#8a5a36',
      border: '#dbd1be'
    },
    {
      id: 'midnight',
      name: 'Midnight',
      desc: 'Gerçek siyah OLED gece okuma deneyimi',
      bg: '#000000',
      card: '#0a0a0a',
      text: '#e5e5e5',
      accent: '#ffffff',
      border: '#222222'
    },
    {
      id: 'forest',
      name: 'Forest',
      desc: 'Doğadan esinlenen sakin zümrüt ve yosun tonları',
      bg: '#121c17',
      card: '#182620',
      text: '#ecf3ef',
      accent: '#34d399',
      border: '#293d33'
    },
    {
      id: 'ocean',
      name: 'Ocean',
      desc: 'Sakin lacivert ve derin mavi tonları',
      bg: '#0c1421',
      card: '#131e31',
      text: '#edf3fc',
      accent: '#38bdf8',
      border: '#233552'
    },
    {
      id: 'lavender',
      name: 'Lavender',
      desc: 'Yumuşak pastel leylak ve lavanta tonları',
      bg: '#191624',
      card: '#221e31',
      text: '#f3f0fa',
      accent: '#a78bfa',
      border: '#37314d'
    },
    {
      id: 'rose',
      name: 'Rose',
      desc: 'Sakin ve muted pastel gül kurusu tonları',
      bg: '#221619',
      card: '#2c1d21',
      text: '#f9f1f2',
      accent: '#fb7185',
      border: '#452f34'
    },
    {
      id: 'coffee',
      name: 'Coffee',
      desc: 'Kahve, krem ve kavrulmuş ahşap kafe atmosferi',
      bg: '#1d1815',
      card: '#26201c',
      text: '#f5ede6',
      accent: '#d49b6a',
      border: '#3d332d'
    },
    {
      id: 'monochrome',
      name: 'Monochrome',
      desc: 'Tamamen nötr siyah, beyaz ve gri tonlar',
      bg: '#181818',
      card: '#222222',
      text: '#ffffff',
      accent: '#e5e5e5',
      border: '#3a3a3a'
    },
    {
      id: 'high_contrast',
      name: 'High Contrast',
      desc: 'Erişilebilirlik odaklı maksimum okunabilirlik',
      bg: '#000000',
      card: '#0a0a0a',
      text: '#ffffff',
      accent: '#ffff00',
      border: '#ffffff'
    }
  ];

  const handleCustomColorChange = (color) => {
    setCustomColorInput(color);
    updateCustomAccent(color);
  };

  const quickCustomColors = [
    '#3b82f6', '#10b981', '#f59e0b', '#ec4899', 
    '#8b5cf6', '#06b6d4', '#14b8a6', '#f97316'
  ];

  return (
    <div className="content-layout">
      <div style={{ maxWidth: '840px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        
        {/* Header */}
        <div style={{ borderBottom: '1px solid var(--border-subtle)', paddingBottom: '16px' }}>
          <h1 style={{ fontSize: '1.4rem', fontWeight: 600, color: 'var(--text-main)', margin: 0 }}>
            Ayarlar & Görünüm
          </h1>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            Okuma alanınızın temasını ve gizlilik tercihlerinizi kişiselleştirin.
          </p>
        </div>

        {/* DOKÜMAN & TASARIM RENK PALETLERİ (Image 2, 3, 4, 5) */}
        <div style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-md)',
          padding: '24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '18px'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Sparkles size={18} color="var(--color-primary)" />
              <h2 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-main)', margin: 0 }}>
                Doküman ve Tasarım Renk Paletleri (Görsel 2, 3, 4, 5)
              </h2>
            </div>
            <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', marginTop: '4px', margin: 0 }}>
              Kullanıcı dokümanındaki renk rehberine ve tasarım görsellerine göre hazırlanmış özel paletler. Tıklayarak anında geçiş yapabilirsiniz.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
            {docThemes.map(t => {
              const isSelected = theme === t.id;
              return (
                <div
                  key={t.id}
                  onClick={() => setAppTheme(t.id)}
                  style={{
                    borderRadius: 'var(--radius-md)',
                    border: isSelected ? '2px solid var(--color-primary)' : '1px solid var(--border-subtle)',
                    background: 'var(--bg-surface-elevated)',
                    cursor: 'pointer',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    boxShadow: isSelected ? '0 6px 20px rgba(0,0,0,0.08)' : 'var(--shadow-sm)',
                    transition: 'all var(--transition-fast)'
                  }}
                >
                  {/* Color Swatch Bar */}
                  <div style={{ display: 'flex', height: '32px', width: '100%' }}>
                    {t.colors.map((c, i) => (
                      <div
                        key={i}
                        style={{
                          flex: 1,
                          background: c,
                          borderRight: i < t.colors.length - 1 ? '1px solid rgba(0,0,0,0.06)' : 'none'
                        }}
                        title={c}
                      />
                    ))}
                  </div>

                  {/* Theme Live Mini-Preview */}
                  <div style={{
                    background: t.bg,
                    padding: '12px 14px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    borderBottom: '1px solid ' + t.border
                  }}>
                    <div style={{
                      background: t.card,
                      border: '1px solid ' + t.border,
                      borderRadius: 'var(--radius-xs)',
                      padding: '5px 10px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}>
                      <span style={{
                        width: '10px',
                        height: '10px',
                        borderRadius: '50%',
                        background: t.accent,
                        display: 'inline-block'
                      }} />
                      <span style={{ fontSize: '0.74rem', color: t.text, fontWeight: 700 }}>
                        Aa Kitap Örneği
                      </span>
                    </div>

                    {isSelected ? (
                      <span style={{
                        width: '22px',
                        height: '22px',
                        borderRadius: '50%',
                        background: 'var(--color-primary)',
                        color: '#fff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.75rem',
                        fontWeight: 700
                      }}>
                        ✓
                      </span>
                    ) : (
                      <span style={{
                        fontSize: '0.72rem',
                        color: 'var(--text-muted)',
                        padding: '2px 8px',
                        borderRadius: 'var(--radius-full)',
                        background: 'rgba(0,0,0,0.04)'
                      }}>
                        {t.badge}
                      </span>
                    )}
                  </div>

                  {/* Content */}
                  <div style={{ padding: '14px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                      <span style={{ fontWeight: 700, fontSize: '0.92rem', color: 'var(--text-main)' }}>
                        {t.name}
                      </span>
                      <span style={{
                        fontSize: '0.7rem',
                        padding: '2px 6px',
                        borderRadius: '4px',
                        background: 'rgba(246, 216, 131, 0.28)',
                        color: 'var(--text-main)',
                        fontWeight: 600
                      }}>
                        {t.badge}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)', marginTop: '4px', lineHeight: 1.4 }}>
                      {t.desc}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 2. DİĞER MİNİMALİST TEMALAR */}
        <div style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-md)',
          padding: '24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '18px'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Palette size={18} color="var(--color-primary)" />
              <h2 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-main)', margin: 0 }}>
                Diğer Klasik Okuma Temaları ({themes.length})
              </h2>
            </div>
            <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', marginTop: '4px', margin: 0 }}>
              Gözü yormayan sakin okuma paletlerinden birini seçin. Tıkladığınız anda anında uygulanır ve hesabınıza kaydedilir.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '14px' }}>
            {themes.map(t => {
              const isSelected = theme === t.id;
              return (
                <div
                  key={t.id}
                  onClick={() => setAppTheme(t.id)}
                  style={{
                    borderRadius: 'var(--radius-sm)',
                    border: isSelected ? '2px solid var(--color-primary)' : '1px solid var(--border-subtle)',
                    background: 'var(--bg-surface-elevated)',
                    cursor: 'pointer',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'border-color var(--transition-fast)'
                  }}
                >
                  {/* Theme Live Mini-Preview */}
                  <div style={{
                    background: t.bg,
                    padding: '14px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    borderBottom: '1px solid ' + t.border
                  }}>
                    {/* Simulated card box */}
                    <div style={{
                      background: t.card,
                      border: '1px solid ' + t.border,
                      borderRadius: 'var(--radius-xs)',
                      padding: '6px 12px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}>
                      <span style={{
                        width: '10px',
                        height: '10px',
                        borderRadius: '50%',
                        background: t.accent,
                        display: 'inline-block'
                      }} />
                      <span style={{ fontSize: '0.74rem', color: t.text, fontWeight: 600 }}>
                        Aa Kitap
                      </span>
                    </div>

                    {isSelected ? (
                      <span style={{
                        width: '20px',
                        height: '20px',
                        borderRadius: '50%',
                        background: 'var(--color-primary)',
                        color: '#fff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.72rem'
                      }}>
                        ✓
                      </span>
                    ) : (
                      <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: t.accent, opacity: 0.8 }} />
                    )}
                  </div>

                  {/* Theme Title & Description */}
                  <div style={{ padding: '12px 14px' }}>
                    <div style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-main)' }}>
                      {t.name}
                    </div>
                    <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)', marginTop: '2px', lineHeight: 1.4 }}>
                      {t.desc}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 2. CUSTOM THEME (Özelleştirilebilir Tema) */}
        <div style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-md)',
          padding: '24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Sliders size={18} color="var(--color-primary)" />
              <h2 style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--text-main)', margin: 0 }}>
                Özel Tema (Kişisel Vurgu Rengi)
              </h2>
            </div>
            {theme === 'custom' && (
              <span className="badge" style={{ background: 'var(--color-primary-light)', color: 'var(--color-primary)' }}>
                Aktif
              </span>
            )}
          </div>

          <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', margin: 0 }}>
            Minimalist koyu taban üzerine kendi belirleyeceğiniz ana vurgu rengini tanımlayabilirsiniz:
          </p>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
            {/* Color Input */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <input 
                type="color" 
                value={customColorInput}
                onChange={(e) => handleCustomColorChange(e.target.value)}
                style={{ width: '40px', height: '40px', borderRadius: 'var(--radius-xs)', border: '1px solid var(--border-subtle)', cursor: 'pointer', background: 'none' }}
              />
              <span style={{ fontFamily: 'monospace', fontSize: '0.86rem', color: 'var(--text-main)' }}>
                {customColorInput.toUpperCase()}
              </span>
            </div>

            {/* Quick Swatches */}
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              {quickCustomColors.map(color => (
                <button
                  key={color}
                  type="button"
                  onClick={() => handleCustomColorChange(color)}
                  style={{
                    width: '26px',
                    height: '26px',
                    borderRadius: '50%',
                    background: color,
                    border: customColorInput.toLowerCase() === color.toLowerCase() ? '2px solid #ffffff' : '1px solid rgba(0,0,0,0.2)',
                    cursor: 'pointer'
                  }}
                  title={color}
                />
              ))}
            </div>

            <button
              className={`btn btn-sm ${theme === 'custom' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => updateCustomAccent(customColorInput)}
            >
              {theme === 'custom' ? 'Özel Tema Aktif' : 'Özel Temayı Uygula'}
            </button>
          </div>
        </div>

        {/* 3. PRIVACY SETTINGS SHORTCUT */}
        <div style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-md)',
          padding: '20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Shield size={18} color="var(--color-primary)" />
              <h2 style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--text-main)', margin: 0 }}>
                Gizlilik ve Görünürlük
              </h2>
            </div>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '4px', margin: 0 }}>
              Okuma süresi, kütüphane rafları ve canlı aktivite durumunuzun kimlere açık olduğunu yönetin.
            </p>
          </div>

          <button
            className="btn btn-secondary btn-sm"
            onClick={() => setIsPrivacyOpen(true)}
          >
            Gizlilik Ayarlarını Aç
          </button>
        </div>

      </div>
    </div>
  );
};
