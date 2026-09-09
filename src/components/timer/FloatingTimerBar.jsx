import React from 'react';
import { Play, Pause, Maximize2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { BookCover } from '../common/BookCover';

export const FloatingTimerBar = () => {
  const { 
    timerState, 
    books, 
    pauseTimer, 
    resumeTimer, 
    setIsTimerModalOpen, 
    isTimerModalOpen, 
    formatClock 
  } = useApp();

  if (!timerState.bookId || isTimerModalOpen) return null;

  const book = books.find(b => b.id === timerState.bookId);
  if (!book) return null;

  return (
    <div 
      className="floating-timer-bar"
      onClick={() => setIsTimerModalOpen(true)}
      title="Kronometreyi büyüt"
    >
      <div className="floating-timer-info">
        <BookCover src={book.cover} title={book.title} alt={book.title} className="floating-timer-cover" />
        <div className="floating-timer-text">
          <span className="floating-timer-title">{book.title}</span>
          <span className="floating-timer-digits">
            {timerState.isRunning ? '⏱️ ' : '⏸ '}
            {formatClock(timerState.seconds)}
          </span>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <button
          className="btn-icon"
          style={{ width: '36px', height: '36px', background: 'var(--bg-surface-elevated)' }}
          onClick={(e) => {
            e.stopPropagation();
            if (timerState.isRunning) {
              pauseTimer();
            } else {
              resumeTimer();
            }
          }}
          title={timerState.isRunning ? 'Duraklat' : 'Devam Et'}
        >
          {timerState.isRunning ? <Pause size={16} /> : <Play size={16} fill="currentColor" />}
        </button>

        <button
          className="btn-icon"
          style={{ width: '36px', height: '36px', background: 'var(--color-primary-light)', color: 'var(--color-primary)' }}
          onClick={(e) => {
            e.stopPropagation();
            setIsTimerModalOpen(true);
          }}
          title="Tam Ekran Aç"
        >
          <Maximize2 size={15} />
        </button>
      </div>
    </div>
  );
};
