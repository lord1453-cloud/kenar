import React, { useState, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  Square, 
  BookOpen, 
  ArrowRight 
} from 'lucide-react';
import { Modal } from '../common/Modal';
import { useApp } from '../../context/AppContext';
import { BookCover } from '../common/BookCover';

export const ReadingTimerModal = () => {
  const { 
    isTimerModalOpen, 
    setIsTimerModalOpen, 
    timerState, 
    startTimer,
    pauseTimer, 
    resumeTimer, 
    finishTimer, 
    books, 
    userBooks, 
    currentUser, 
    formatClock 
  } = useApp();

  const [endPage, setEndPage] = useState('');
  const [sessionNotes, setSessionNotes] = useState('');

  const book = timerState.bookId ? books.find(b => b.id === timerState.bookId) : books[0];
  const userBook = book ? userBooks.find(ub => ub.bookId === book.id && ub.userId === currentUser.id) : null;
  const startPage = timerState.startPage || userBook?.currentPage || 0;

  useEffect(() => {
    if (userBook && !endPage) {
      setEndPage(userBook.currentPage || 0);
    }
  }, [userBook]);

  if (!isTimerModalOpen || !book) return null;

  const handleFinish = () => {
    finishTimer(endPage ? parseInt(endPage, 10) : startPage, sessionNotes);
    setSessionNotes('');
  };

  const handleBookSelect = (newBookId) => {
    if (newBookId !== book.id) {
      startTimer(newBookId);
    }
  };

  return (
    <Modal
      isOpen={isTimerModalOpen}
      onClose={() => setIsTimerModalOpen(false)}
      title="Okuma Kronometresi"
      maxWidth="460px"
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', alignItems: 'center', textAlign: 'center' }}>
        
        {/* Book Selector */}
        <div style={{ width: '100%', textAlign: 'left' }}>
          <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
            Okunan Kitap
          </label>
          <select
            value={book.id}
            onChange={(e) => handleBookSelect(e.target.value)}
            style={{ width: '100%', padding: '8px 10px', fontSize: '0.88rem' }}
          >
            {books.map(b => (
              <option key={b.id} value={b.id}>
                {b.title} — {b.author} ({b.pages} sayfa)
              </option>
            ))}
          </select>
        </div>

        {/* Book Mini Info */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '14px',
          width: '100%',
          background: 'var(--bg-surface-elevated)',
          padding: '12px 16px',
          borderRadius: 'var(--radius-sm)',
          border: '1px solid var(--border-subtle)',
          textAlign: 'left'
        }}>
          <BookCover 
            src={book.cover} 
            title={book.title} 
            alt={book.title}
            style={{ width: '48px', height: '70px', borderRadius: '2px', flexShrink: 0 }}
          />
          <div>
            <div style={{ fontWeight: 600, fontSize: '0.94rem', color: 'var(--text-main)' }}>
              {book.title}
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              {book.author}
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--color-primary)', marginTop: '4px', fontWeight: 600 }}>
              Başlangıç Sayfası: {startPage} / {book.pages}
            </div>
          </div>
        </div>

        {/* Minimal Clean Digital Clock */}
        <div style={{ padding: '16px 0' }}>
          <div style={{
            fontFamily: 'monospace',
            fontSize: '3rem',
            fontWeight: 700,
            letterSpacing: '2px',
            color: 'var(--text-main)'
          }}>
            {formatClock(timerState.seconds)}
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            {timerState.isRunning ? '● Canlı Ölçülüyor' : '⏸ Duraklatıldı'}
          </div>
        </div>

        {/* End Page & Session Notes Inputs */}
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '10px', textAlign: 'left' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--bg-surface-elevated)', padding: '10px 14px', borderRadius: 'var(--radius-xs)', border: '1px solid var(--border-subtle)' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-main)' }}>
              Ulaşılan Sayfa Numarası:
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <input
                type="number"
                min={startPage}
                max={book.pages}
                value={endPage}
                onChange={(e) => setEndPage(e.target.value)}
                style={{ width: '70px', textAlign: 'center', padding: '6px', fontWeight: 600 }}
              />
              <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>
                / {book.pages}
              </span>
            </div>
          </div>

          <input
            type="text"
            placeholder="İsteğe bağlı seans notu (örn: 3. Bölüm bitti)"
            value={sessionNotes}
            onChange={(e) => setSessionNotes(e.target.value)}
            style={{ width: '100%', fontSize: '0.82rem', padding: '7px 10px' }}
          />
        </div>

        {/* Controls */}
        <div style={{ display: 'flex', gap: '10px', width: '100%', justifyContent: 'center' }}>
          {timerState.isRunning ? (
            <button className="btn btn-secondary" onClick={pauseTimer} style={{ flex: 1 }}>
              <Pause size={16} /> Duraklat
            </button>
          ) : (
            <button className="btn btn-primary" onClick={resumeTimer} style={{ flex: 1 }}>
              <Play size={16} fill="currentColor" /> Devam Et
            </button>
          )}

          <button 
            className="btn btn-secondary"
            style={{ flex: 1, color: 'var(--color-danger)' }}
            onClick={handleFinish}
          >
            <Square size={16} /> Okumayı Bitir
          </button>
        </div>

        <span style={{ fontSize: '0.74rem', color: 'var(--text-dim)' }}>
          Sayfa kapansa veya sekme değişse dahi gerçek süre arka planda korunur.
        </span>
      </div>
    </Modal>
  );
};
