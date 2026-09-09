import React from 'react';
import { Check, ArrowRight, BookOpen, Clock } from 'lucide-react';
import { Modal } from '../common/Modal';
import { useApp } from '../../context/AppContext';

export const SessionSummaryModal = () => {
  const { 
    completedSession, 
    setCompletedSession, 
    formatDuration,
    currentUser 
  } = useApp();

  if (!completedSession) return null;

  const { book, seconds, previousPage, newPage, pagesRead } = completedSession;
  const progressPercent = book ? Math.min(100, Math.round((newPage / book.pages) * 100)) : 0;

  return (
    <Modal
      isOpen={!!completedSession}
      onClose={() => setCompletedSession(null)}
      title="Okuma Oturumu Tamamlandı"
      maxWidth="460px"
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '18px', textAlign: 'center' }}>
        
        <div style={{
          width: '52px',
          height: '52px',
          borderRadius: '50%',
          background: 'var(--color-success-light)',
          color: 'var(--color-success)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto'
        }}>
          <Check size={28} />
        </div>

        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-main)', margin: 0 }}>
            Tebrikler, seans kaydedildi.
          </h2>
          <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            Bugünkü okuma verileriniz hesabınıza işlendi.
          </p>
        </div>

        {/* Details Card */}
        <div style={{
          background: 'var(--bg-surface-elevated)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-sm)',
          padding: '16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          textAlign: 'left'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Kitap</span>
            <span style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-main)' }}>{book?.title}</span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Okunan Süre</span>
            <span style={{ fontSize: '0.96rem', fontWeight: 700, color: 'var(--color-primary)' }}>{formatDuration(seconds)}</span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>İlerleme</span>
            <span style={{ fontSize: '0.86rem', color: 'var(--text-main)' }}>
              {previousPage} <ArrowRight size={12} style={{ display: 'inline', margin: '0 2px' }} /> {newPage}. sayfa 
              <span style={{ color: 'var(--color-success)', fontWeight: 600, marginLeft: '6px' }}>
                (+{pagesRead} sf)
              </span>
            </span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Bugünkü Toplam Okuma</span>
            <span style={{ fontSize: '0.86rem', fontWeight: 600, color: 'var(--text-main)' }}>
              {formatDuration(currentUser.todayReadingSeconds)}
            </span>
          </div>
        </div>

        <button 
          className="btn btn-primary"
          style={{ width: '100%' }}
          onClick={() => setCompletedSession(null)}
        >
          Tamam
        </button>

      </div>
    </Modal>
  );
};
