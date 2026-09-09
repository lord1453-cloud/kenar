import React, { useState } from 'react';
import { Book, Star, AlertTriangle, Check, BookOpen } from 'lucide-react';
import { Modal } from '../common/Modal';
import { useApp } from '../../context/AppContext';

export const CreatePostModal = () => {
  const { 
    isCreatePostOpen, 
    setIsCreatePostOpen, 
    createPost, 
    books, 
    userBooks, 
    currentUser 
  } = useApp();

  const [content, setContent] = useState('');
  const [selectedBookId, setSelectedBookId] = useState('');
  const [includeProgress, setIncludeProgress] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [rating, setRating] = useState(0);
  const [isSpoiler, setIsSpoiler] = useState(false);
  const [spoilerText, setSpoilerText] = useState('');

  const selectedBook = books.find(b => b.id === selectedBookId);

  // When book is selected, check if user already has progress for it
  const handleBookChange = (bookId) => {
    setSelectedBookId(bookId);
    if (bookId) {
      const ub = userBooks.find(u => u.bookId === bookId && u.userId === currentUser.id);
      if (ub && ub.currentPage) {
        setCurrentPage(ub.currentPage);
        setIncludeProgress(true);
      }
    } else {
      setIncludeProgress(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!content.trim() && !spoilerText.trim()) return;

    createPost({
      content,
      bookId: selectedBookId || null,
      pageProgress: (selectedBookId && includeProgress && selectedBook) ? {
        current: Math.min(currentPage, selectedBook.pages),
        total: selectedBook.pages
      } : null,
      rating: rating > 0 ? rating : null,
      isSpoiler,
      spoilerText: isSpoiler ? spoilerText : ''
    });

    // Reset fields
    setContent('');
    setSelectedBookId('');
    setIncludeProgress(false);
    setRating(0);
    setIsSpoiler(false);
    setSpoilerText('');
  };

  return (
    <Modal
      isOpen={isCreatePostOpen}
      onClose={() => setIsCreatePostOpen(false)}
      title="Yeni Gönderi Paylaş"
      maxWidth="560px"
    >
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {/* Author preview */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <img 
            src={currentUser.avatar} 
            alt={currentUser.fullName} 
            style={{ width: '42px', height: '42px', borderRadius: '50%', objectFit: 'cover' }} 
          />
          <div>
            <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{currentUser.fullName}</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>Herkese açık paylaşım</div>
          </div>
        </div>

        {/* Text Area */}
        <textarea
          rows={4}
          placeholder="Bugün ne okuyorsun? Düşüncelerini, alıntılarını ve kitap heyecanını paylaş..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          style={{ width: '100%', resize: 'vertical', minHeight: '90px' }}
        />

        {/* Book Attachment Picker */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Book size={16} color="var(--color-primary)" />
            Kitap Bağla (İsteğe Bağlı)
          </label>
          <select
            value={selectedBookId}
            onChange={(e) => handleBookChange(e.target.value)}
            style={{ width: '100%' }}
          >
            <option value="">-- Bir kitap seçin --</option>
            {books.map(b => (
              <option key={b.id} value={b.id}>
                {b.title} — {b.author}
              </option>
            ))}
          </select>
        </div>

        {/* Page progress options if book selected */}
        {selectedBook && (
          <div style={{ background: 'var(--bg-surface-elevated)', padding: '12px 14px', borderRadius: 'var(--radius-md)', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.88rem' }}>
              <input 
                type="checkbox" 
                checked={includeProgress} 
                onChange={(e) => setIncludeProgress(e.target.checked)}
                style={{ width: '16px', height: '16px', accentColor: 'var(--color-primary)' }}
              />
              Okuma ilerlememi bu gönderide göster
            </label>

            {includeProgress && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Mevcut Sayfa:</span>
                <input
                  type="number"
                  min={1}
                  max={selectedBook.pages}
                  value={currentPage}
                  onChange={(e) => setCurrentPage(parseInt(e.target.value) || 0)}
                  style={{ width: '90px', padding: '6px 10px' }}
                />
                <span style={{ fontSize: '0.85rem', color: 'var(--text-dim)' }}>
                  / {selectedBook.pages} sayfa ({Math.round((currentPage / selectedBook.pages) * 100)}%)
                </span>
              </div>
            )}

            {/* Rating selector */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', borderTop: '1px solid var(--border-subtle)', paddingTop: '8px' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Puan ver:</span>
              <div style={{ display: 'flex', gap: '4px', cursor: 'pointer' }}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={20}
                    fill={star <= rating ? '#f59e0b' : 'transparent'}
                    color={star <= rating ? '#f59e0b' : 'var(--text-dim)'}
                    onClick={() => setRating(star === rating ? 0 : star)}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Spoiler Toggle & Content */}
        <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '12px' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.88rem', color: isSpoiler ? 'var(--color-danger)' : 'var(--text-muted)' }}>
            <input 
              type="checkbox" 
              checked={isSpoiler} 
              onChange={(e) => setIsSpoiler(e.target.checked)}
              style={{ width: '16px', height: '16px', accentColor: 'var(--color-danger)' }}
            />
            <AlertTriangle size={16} />
            Bu gönderi kitap hakkında spoiler (sürprizbozan) içeriyor
          </label>

          {isSpoiler && (
            <textarea
              rows={2}
              placeholder="Gizlenmesini istediğiniz spoiler detayını buraya yazın..."
              value={spoilerText}
              onChange={(e) => setSpoilerText(e.target.value)}
              style={{ width: '100%', marginTop: '10px', borderColor: 'var(--color-danger)' }}
            />
          )}
        </div>

        {/* Modal Footer Buttons */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
          <button 
            type="button" 
            className="btn btn-secondary" 
            onClick={() => setIsCreatePostOpen(false)}
          >
            İptal
          </button>
          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={!content.trim() && !spoilerText.trim()}
          >
            Paylaş
          </button>
        </div>
      </form>
    </Modal>
  );
};
