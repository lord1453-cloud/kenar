import React from 'react';
import { Clock, BookOpen, Calendar, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Modal } from '../common/Modal';
import { useApp } from '../../context/AppContext';

export const ReadingSessionsHistoryModal = () => {
  const { 
    isSessionsHistoryOpen, 
    setIsSessionsHistoryOpen, 
    historyBookId, 
    setHistoryBookId, 
    readingSessions, 
    books, 
    currentUser, 
    formatDuration 
  } = useApp();

  // Filter sessions: if historyBookId provided, only for that book, otherwise for current user
  const sessions = readingSessions
    .filter(s => s.userId === currentUser.id && (!historyBookId || s.bookId === historyBookId))
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  const targetBook = historyBookId ? books.find(b => b.id === historyBookId) : null;

  return (
    <Modal
      isOpen={isSessionsHistoryOpen}
      onClose={() => {
        setIsSessionsHistoryOpen(false);
        setHistoryBookId(null);
      }}
      title={targetBook ? `"${targetBook.title}" Okuma Oturumları` : "Okuma Oturumları Geçmişi"}
      maxWidth="620px"
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Toplam {sessions.length} okuma oturumu kaydedildi.
          </span>
          {historyBookId && (
            <button 
              className="btn btn-ghost btn-sm" 
              style={{ fontSize: '0.78rem' }}
              onClick={() => setHistoryBookId(null)}
            >
              Tüm Kitapları Göster
            </button>
          )}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '450px', overflowY: 'auto' }}>
          {sessions.length > 0 ? (
            sessions.map(session => {
              const book = books.find(b => b.id === session.bookId) || { title: 'Kitap', cover: '' };
              return (
                <div
                  key={session.id}
                  style={{
                    background: 'var(--bg-surface-elevated)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-md)',
                    padding: '14px 16px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ fontSize: '1.2rem' }}>📖</span>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '0.94rem', color: 'var(--text-main)' }}>
                          {book.title}
                        </div>
                        <div style={{ fontSize: '0.76rem', color: 'var(--text-dim)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <Calendar size={12} />
                          {session.date} • {session.startTime} - {session.endTime}
                        </div>
                      </div>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <span style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--color-primary)' }}>
                        {formatDuration(session.durationSeconds)}
                      </span>
                      <div style={{ fontSize: '0.75rem', color: 'var(--color-success)', fontWeight: 600 }}>
                        +{session.pagesRead || (session.endPage - session.startPage)} sayfa
                      </div>
                    </div>
                  </div>

                  {/* Page range banner */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '6px 12px',
                    background: 'var(--bg-surface)',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.8rem',
                    color: 'var(--text-muted)'
                  }}>
                    <span>Başlangıç Sayfası: <strong>{session.startPage}</strong></span>
                    <ArrowRight size={14} color="var(--color-primary)" />
                    <span>Bitiş Sayfası: <strong>{session.endPage}</strong></span>
                  </div>

                  {session.notes && (
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)', fontStyle: 'italic' }}>
                      “{session.notes}”
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-dim)' }}>
              Henüz kaydedilmiş bir okuma oturumu bulunmuyor. Kronometreyle ilk okumanızı başlatın!
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};
