import React, { useState } from 'react';
import { Star, MessageSquare } from 'lucide-react';
import { Modal } from '../common/Modal';
import { useApp } from '../../context/AppContext';
import { BookCover } from '../common/BookCover';

export const AddReviewModal = ({ bookId, isOpen, onClose }) => {
  const { books, addReview, currentUser } = useApp();
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');

  const book = books.find(b => b.id === bookId);
  if (!book) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!comment.trim()) return;
    addReview(bookId, rating, comment);
    setComment('');
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Kitap İncelemesi Yaz"
      maxWidth="500px"
    >
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <BookCover 
            src={book.cover} 
            title={book.title} 
            alt={book.title} 
            style={{ width: '48px', height: '70px', borderRadius: 'var(--radius-xs)', flexShrink: 0 }} 
          />
          <div>
            <h4 style={{ fontSize: '1rem', fontWeight: 700 }}>{book.title}</h4>
            <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>{book.author}</span>
          </div>
        </div>

        {/* Star Selector */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', padding: '14px 0', background: 'var(--bg-surface-elevated)', borderRadius: 'var(--radius-md)' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Puanınız:</span>
          <div style={{ display: 'flex', gap: '8px' }}>
            {[1, 2, 3, 4, 5].map(star => (
              <Star
                key={star}
                size={28}
                style={{ cursor: 'pointer', transition: 'transform 0.15s' }}
                fill={(hoverRating || rating) >= star ? '#f59e0b' : 'transparent'}
                color={(hoverRating || rating) >= star ? '#f59e0b' : 'var(--text-dim)'}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                onClick={() => setRating(star)}
              />
            ))}
          </div>
          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#f59e0b' }}>
            {rating} / 5 Yıldız
          </span>
        </div>

        {/* Comment Textarea */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>
            Düşünceleriniz ve Değerlendirmeniz:
          </label>
          <textarea
            rows={4}
            required
            placeholder="Kitabın anlatımı, karakterleri ve sizde bıraktığı izler nasıldı?"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            style={{ width: '100%', resize: 'vertical' }}
          />
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Vazgeç
          </button>
          <button type="submit" className="btn btn-primary" disabled={!comment.trim()}>
            İncelemeyi Yayınla
          </button>
        </div>
      </form>
    </Modal>
  );
};
