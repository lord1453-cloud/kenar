import React, { useState } from 'react';
import { Sparkles, BookOpen, Target, Check, ArrowRight } from 'lucide-react';
import { Modal } from '../common/Modal';
import { useApp } from '../../context/AppContext';
import { GENRES } from '../../data/genres';

export const OnboardingModal = () => {
  const { isOnboardingOpen, completeOnboarding } = useApp();

  const [step, setStep] = useState(1);
  const [selectedGenres, setSelectedGenres] = useState(['sci-fi', 'classics']);
  const [readingGoal, setReadingGoal] = useState(30);

  const toggleGenre = (genreId) => {
    setSelectedGenres(prev =>
      prev.includes(genreId) ? prev.filter(id => id !== genreId) : [...prev, genreId]
    );
  };

  const handleFinish = () => {
    completeOnboarding({
      genres: selectedGenres,
      readingGoal
    });
  };

  return (
    <Modal
      isOpen={isOnboardingOpen}
      onClose={handleFinish}
      title="Kitap Kulübü'ne Hoş Geldiniz! 📚"
      maxWidth="540px"
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', textAlign: 'center' }}>
        {step === 1 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ fontSize: '3rem' }}>✨</div>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 800 }}>Okuma Tercihlerinizi Belirleyin</h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
              Size en uygun kitap odalarını, akış gönderilerini ve edebi arkadaşları önerebilmemiz için en sevdiğiniz türleri seçin:
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px', marginTop: '10px' }}>
              {GENRES.map(g => {
                const isSelected = selectedGenres.includes(g.id);
                return (
                  <div
                    key={g.id}
                    onClick={() => toggleGenre(g.id)}
                    style={{
                      padding: '12px',
                      borderRadius: 'var(--radius-md)',
                      background: isSelected ? 'var(--color-primary-light)' : 'var(--bg-surface-elevated)',
                      border: isSelected ? '2px solid var(--color-primary)' : '1px solid var(--border-subtle)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      cursor: 'pointer',
                      transition: 'all 0.15s'
                    }}
                  >
                    <span style={{ fontSize: '1.4rem' }}>{g.icon}</span>
                    <span style={{ fontWeight: 600, fontSize: '0.9rem', textAlign: 'left', flex: 1 }}>{g.name}</span>
                    {isSelected && <Check size={16} color="var(--color-primary)" />}
                  </div>
                );
              })}
            </div>

            <button 
              className="btn btn-primary"
              style={{ marginTop: '12px' }}
              onClick={() => setStep(2)}
            >
              Devam Et
              <ArrowRight size={16} />
            </button>
          </div>
        )}

        {step === 2 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <div style={{ fontSize: '3rem' }}>🎯</div>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 800 }}>Yıllık Okuma Hedefiniz</h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
              Bu yıl kaç kitap okumak istersiniz? Okuma serinizi ve ilerlemenizi sizin için takip edeceğiz.
            </p>

            <div style={{ margin: '14px 0' }}>
              <div style={{ fontSize: '3.5rem', fontFamily: 'var(--font-heading)', fontWeight: 800, color: 'var(--color-primary)' }}>
                {readingGoal}
              </div>
              <span style={{ fontSize: '1rem', color: 'var(--text-muted)', fontWeight: 600 }}>Kitap / Yıl</span>

              <input
                type="range"
                min={5}
                max={100}
                step={1}
                value={readingGoal}
                onChange={(e) => setReadingGoal(parseInt(e.target.value, 10))}
                style={{ width: '100%', marginTop: '16px', accentColor: 'var(--color-primary)' }}
              />
            </div>

            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
              <button className="btn btn-secondary" onClick={() => setStep(1)}>
                Geri
              </button>
              <button className="btn btn-primary" onClick={handleFinish}>
                Kitap Kulübünü Başlat!
              </button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};
