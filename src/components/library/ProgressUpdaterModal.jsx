import React, { useState, useEffect } from 'react';
import { BookOpen, Plus, CheckCircle2, Share2 } from 'lucide-react';
import { Modal } from '../common/Modal';
import { useApp } from '../../context/AppContext';
import { BookCover } from '../common/BookCover';

export const ProgressUpdaterModal = () => {
  const { 
    updatingProgressBook, 
    setUpdatingProgressBook, 
    updatePageProgress, 
    books, 
    userBooks,
    getUserBook, 
    currentUser 
  } = useApp();

  const [page, setPage] = useState(0);
  const [shouldShare, setShouldShare] = useState(true);

  const book = updatingProgressBook ? books.find(b => b.id === updatingProgressBook) : null;
  const userBook = book ? (getUserBook ? getUserBook(book.id, currentUser.id) : (userBooks || []).find(ub => ub.bookId === book.id && ub.userId === currentUser.id)) : null;

  useEffect(() => {
    if (userBook) {
      setPage(userBook.currentPage || 0);
    } else {
      setPage(0);
    }
  }, [userBook]);

  if (!book) return null;

  const totalPages = book.pages;
  const percentage = Math.min(100, Math.round(((page || 0) / totalPages) * 100 * 10) / 10);

  const handleQuickAdd = (amount) => {
    setPage(prev => Math.min(totalPages, Math.max(0, (parseInt(prev, 10) || 0) + amount)));
  };

  const handleSave = (e) => {
    e.preventDefault();
    updatePageProgress(book.id, page, shouldShare);
  };

  const handleComplete = () => {
    updatePageProgress(book.id, totalPages, shouldShare);
  };

  return (
    <Modal
      isOpen={!!updatingProgressBook}
      onClose={() => setUpdatingProgressBook(null)}
      title="Okuma İlerlemesini Güncelle"
      maxWidth="480px"
    >
      <form onSubmit={handleSave} className="progress-updater-box">
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', width: '100%' }}>
          <BookCover 
            src={book.cover} 
            title={book.title} 
            alt={book.title} 
            style={{ width: '56px', height: '80px', borderRadius: 'var(--radius-xs)', boxShadow: 'var(--shadow-sm)', flexShrink: 0 }} 
          />
          <div style={{ textAlign: 'left', flex: 1 }}>
            <h4 style={{ fontSize: '1.1rem' }}>{book.title}</h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{book.author}</p>
            {userBook?.startDate && (
              <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '4px', display: 'block' }}>
                Başlama Tarihi: {userBook.startDate}
              </span>
            )}
          </div>
        </div>

        {/* Large Percentage & Progress */}
        <div style={{ margin: '10px 0', width: '100%' }}>
          <div className="progress-big-number">
            %{percentage}
          </div>
          <div style={{ fontSize: '1rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            {page} / {totalPages} sayfa okundu
          </div>

          <div className="progress-track" style={{ height: '10px', marginTop: '12px' }}>
            <div className="progress-bar" style={{ width: `${percentage}%` }} />
          </div>
        </div>

        {/* Number Input & Slider */}
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <input
            type="range"
            min={0}
            max={totalPages}
            value={page}
            onChange={(e) => setPage(parseInt(e.target.value, 10))}
            style={{ width: '100%', accentColor: 'var(--color-primary)' }}
          />

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
            <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Sayfa Sayısı:</span>
            <input
              type="number"
              min={0}
              max={totalPages}
              value={page}
              onChange={(e) => setPage(Math.min(totalPages, Math.max(0, parseInt(e.target.value, 10) || 0)))}
              style={{ width: '100px', textAlign: 'center', fontSize: '1.1rem', fontWeight: 700 }}
            />
          </div>
        </div>

        {/* Quick Add Buttons */}
        <div className="quick-add-buttons">
          <button type="button" className="btn btn-secondary btn-sm" onClick={() => handleQuickAdd(10)}>
            +10 Sayfa
          </button>
          <button type="button" className="btn btn-secondary btn-sm" onClick={() => handleQuickAdd(25)}>
            +25 Sayfa
          </button>
          <button type="button" className="btn btn-secondary btn-sm" onClick={() => handleQuickAdd(50)}>
            +50 Sayfa
          </button>
          <button 
            type="button" 
            className="btn btn-secondary btn-sm" 
            style={{ color: 'var(--color-success)', borderColor: 'var(--color-success)' }}
            onClick={handleComplete}
          >
            <CheckCircle2 size={14} />
            Kitabı Bitirdim!
          </button>
        </div>

        {/* Share to feed toggle */}
        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.85rem', color: 'var(--text-muted)', margin: '6px 0' }}>
          <input
            type="checkbox"
            checked={shouldShare}
            onChange={(e) => setShouldShare(e.target.checked)}
            style={{ accentColor: 'var(--color-primary)' }}
          />
          <Share2 size={14} />
          Bu ilerlemeyi Ana Akış'ta arkadaşlarımla paylaş
        </label>

        {/* Actions */}
        <div style={{ display: 'flex', gap: '10px', width: '100%', justifyContent: 'flex-end', borderTop: '1px solid var(--border-subtle)', paddingTop: '14px' }}>
          <button type="button" className="btn btn-secondary" onClick={() => setUpdatingProgressBook(null)}>
            Vazgeç
          </button>
          <button type="submit" className="btn btn-primary">
            Kaydet ve Güncelle
          </button>
        </div>
      </form>
    </Modal>
  );
};
