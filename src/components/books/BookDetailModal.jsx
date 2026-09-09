import React, { useState } from 'react';
import { 
  Star, 
  BookOpen, 
  CheckCircle2, 
  Bookmark, 
  Users, 
  FileText, 
  MessageSquarePlus, 
  Share2,
  Plus,
  Check,
  Sparkles,
  Search,
  Eye,
  AlertTriangle,
  Flame,
  ArrowLeft
} from 'lucide-react';
import { Modal } from '../common/Modal';
import { AddReviewModal } from './AddReviewModal';
import { useApp } from '../../context/AppContext';
import { BookCover } from '../common/BookCover';

export const BookDetailModal = () => {
  const { 
    selectedBookId, 
    setSelectedBookId, 
    books, 
    userBooks, 
    currentUser, 
    updateBookStatus, 
    setUpdatingProgressBook, 
    reviews, 
    users, 
    showToast,
    startTimer,
    formatDuration,
    setHistoryBookId,
    setIsSessionsHistoryOpen,
    readingSessions,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    aiSearchBookCover
  } = useApp();

  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'reviews'
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [revealedSpoilers, setRevealedSpoilers] = useState({});

  const book = selectedBookId ? books.find(b => b.id === selectedBookId) : null;
  const userBook = book ? userBooks.find(ub => ub.bookId === book.id && ub.userId === currentUser.id) : null;

  if (!book) return null;

  const currentStatus = userBook?.status || null;
  const bookReviews = reviews.filter(r => r.bookId === book.id);
  const inWishlist = isInWishlist(book.id);

  // Doküman Paragraf 5: Yazarların geri dönüşleri yıldızlı bir şekilde en üstte olacak
  const sortedReviews = [...bookReviews].sort((a, b) => {
    const userA = users.find(u => u.id === a.userId);
    const userB = users.find(u => u.id === b.userId);
    const aIsAuthor = userA?.role === 'author';
    const bIsAuthor = userB?.role === 'author';
    if (aIsAuthor && !bIsAuthor) return -1;
    if (!aIsAuthor && bIsAuthor) return 1;
    return b.id.localeCompare(a.id);
  });

  const handleShareBook = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(`${window.location.origin}/#book-${book.id}`);
      showToast(`"${book.title}" bağlantısı kopyalandı!`, '🔗');
    }
  };

  const toggleSpoiler = (reviewId) => {
    setRevealedSpoilers(prev => ({
      ...prev,
      [reviewId]: !prev[reviewId]
    }));
  };

  return (
    <>
      <Modal
        isOpen={!!selectedBookId}
        onClose={() => setSelectedBookId(null)}
        title="Kitap Değerlendirme & İnceleme"
        maxWidth="640px"
      >
        <div className="book-detail-container">
          
          {/* Top Actions Bar */}
          <div className="book-detail-topbar">
            <button 
              className="btn-detail-icon"
              onClick={() => setSelectedBookId(null)}
              title="Kapat"
            >
              <ArrowLeft size={18} />
            </button>

            <div style={{ display: 'flex', gap: '8px' }}>
              <button 
                className="btn-detail-icon"
                onClick={() => aiSearchBookCover(book.id)}
                title="Yapay Zeka ile Kapak Bul / Güncelle"
              >
                <Sparkles size={16} color="#f59e0b" />
              </button>
              <button 
                className="btn-detail-icon"
                onClick={handleShareBook}
                title="Paylaş"
              >
                <Share2 size={16} />
              </button>
            </div>
          </div>

          {/* Centered Showcase Hero (Image 1 Orta Ekran Referansı) */}
          <div className="book-detail-showcase">
            <div className="book-cover-stage">
              <div className="book-backdrop-glow"></div>
              <BookCover src={book.cover} title={book.title} alt={book.title} className="book-showcase-cover" />
            </div>

            {/* Düşük opaklıkta tür, büyük kitap adı, yazar */}
            <span className="book-genre-subtle">{book.genre}</span>
            <h2 className="book-title-large">{book.title}</h2>
            <span className="book-author-text">yazar: {book.author}</span>

            {/* Yıldız ortalaması ve değerlendirme sayısı */}
            <div className="book-rating-row">
              <div className="book-stars">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    size={18} 
                    fill={i < Math.round(book.rating) ? '#f59e0b' : 'transparent'} 
                    color={i < Math.round(book.rating) ? '#f59e0b' : 'var(--text-dim)'} 
                  />
                ))}
              </div>
              <span className="book-rating-num">{book.rating}</span>
              <span className="book-rating-count">
                ({(book.readersCount || 426321).toLocaleString()} değerlendirme)
              </span>
            </div>

            {/* Yan Yana İki Buton: [İstek Listene Ekle] & [Kitabı Puanla] (Image 1 Orta Ekran) */}
            <div className="book-primary-actions-row">
              <button
                className={`btn-pill-action ${inWishlist ? 'active' : ''}`}
                onClick={() => inWishlist ? removeFromWishlist(book.id) : addToWishlist(book.id)}
              >
                {inWishlist ? <Check size={16} /> : <Plus size={16} />}
                <span>{inWishlist ? 'İstek Sepetinde ✓' : 'İstek Listene Ekle'}</span>
              </button>

              <button
                className="btn-pill-action btn-rate-action"
                onClick={() => setIsReviewOpen(true)}
              >
                <Star size={16} fill="#f59e0b" color="#f59e0b" />
                <span>Kitabı Puanla</span>
              </button>
            </div>
          </div>

          {/* Sekmeler: Genel Bakış & Özet / Değerlendirmeler & Yorumlar (Doküman Paragraf 5 & 13) */}
          <div className="book-detail-tabs">
            <button
              className={`book-detail-tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
              onClick={() => setActiveTab('overview')}
            >
              Genel Bakış & Özet
            </button>
            <button
              className={`book-detail-tab-btn ${activeTab === 'reviews' ? 'active' : ''}`}
              onClick={() => setActiveTab('reviews')}
            >
              Değerlendirmeler & Yorumlar ({bookReviews.length})
            </button>
          </div>

          {/* TAB 1: GENEL BAKIŞ & ÖZET */}
          {activeTab === 'overview' && (
            <div className="book-tab-content">
              {/* Spoilersız AI Kitap Özeti (Doküman Paragraf 13) */}
              <div className="book-summary-box glass-panel">
                <div className="summary-badge-header">
                  <div className="ai-summary-pill">
                    <Sparkles size={13} color="#f59e0b" />
                    <span>Yapay Zeka Destekli Spoilersız Özet</span>
                  </div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                    {book.pages} Sayfa • {book.genre}
                  </span>
                </div>
                <p className="book-description-p">
                  {book.description || "Bu eserin içeriği okuyucuyu derin düşüncelere sevk eden eşsiz bir edebi kurguya sahiptir."}
                </p>

                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
                  <button 
                    className="btn btn-ghost btn-sm"
                    style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}
                    onClick={() => aiSearchBookCover(book.id)}
                  >
                    <Search size={13} />
                    Google'dan Resmi Otomatik Yenile
                  </button>
                </div>
              </div>

              {/* Kitaplık Durumu ve Okuma Kronometresi */}
              <div className="book-library-status-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.86rem', fontWeight: 700, color: 'var(--text-main)' }}>
                    Kitaplığındaki Durumu
                  </span>
                  {currentStatus && (
                    <span className="badge badge-amber">
                      {currentStatus === 'reading' ? 'Okunuyor' : (currentStatus === 'read' ? 'Okundu' : 'İstek Sepeti')}
                    </span>
                  )}
                </div>

                <div className="book-status-action-row">
                  <button
                    className={`status-choice-btn ${currentStatus === 'reading' ? 'selected' : ''}`}
                    onClick={() => updateBookStatus(book.id, 'reading')}
                  >
                    <BookOpen size={16} />
                    Okuyorum
                  </button>

                  <button
                    className={`status-choice-btn ${currentStatus === 'read' ? 'selected' : ''}`}
                    onClick={() => updateBookStatus(book.id, 'read')}
                  >
                    <CheckCircle2 size={16} />
                    Okudum
                  </button>

                  <button
                    className={`status-choice-btn ${currentStatus === 'to_read' ? 'selected' : ''}`}
                    onClick={() => updateBookStatus(book.id, 'to_read')}
                  >
                    <Bookmark size={16} />
                    İstek Sepetine At
                  </button>
                </div>

                {/* Eğer Okunuyorsa Sayfa İlerlemesi ve Kronometre Butonu */}
                {currentStatus === 'reading' && (
                  <div style={{ marginTop: '14px', background: 'var(--bg-surface-elevated)', padding: '12px 14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.84rem', fontWeight: 700, marginBottom: '6px' }}>
                      <span>İlerlemeniz: {userBook?.currentPage || 0} / {book.pages} sf.</span>
                      <span style={{ color: 'var(--color-primary)' }}>
                        %{Math.round(((userBook?.currentPage || 0) / book.pages) * 100)}
                      </span>
                    </div>
                    <div className="progress-track">
                      <div 
                        className="progress-bar" 
                        style={{ width: `${Math.round(((userBook?.currentPage || 0) / book.pages) * 100)}%` }} 
                      />
                    </div>
                    <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                      <button 
                        className="btn btn-secondary btn-sm" 
                        style={{ flex: 1 }}
                        onClick={() => {
                          setSelectedBookId(null);
                          setUpdatingProgressBook(book.id);
                        }}
                      >
                        Sayfa Güncelle
                      </button>
                      <button 
                        className="btn btn-primary btn-sm" 
                        style={{ flex: 1.2 }}
                        onClick={() => {
                          setSelectedBookId(null);
                          startTimer(book.id);
                        }}
                      >
                        ⏱️ Okumayı Başlat
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: DEĞERLENDİRMELER & YORUMLAR (Doküman Paragraf 5: Ayrı sekme & Yazarlar üstte yıldızlı & Spoiler blur) */}
          {activeTab === 'reviews' && (
            <div className="book-tab-content">
              <div className="reviews-top-action">
                <div>
                  <h4 style={{ fontSize: '1.05rem', margin: 0 }}>
                    Okur & Yazar Değerlendirmeleri
                  </h4>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>
                    Yazar geri dönüşleri yıldızlı olarak üstte listelenir
                  </span>
                </div>

                <button 
                  className="btn btn-primary btn-sm"
                  onClick={() => setIsReviewOpen(true)}
                >
                  <MessageSquarePlus size={15} />
                  Puanla & Yorum Yaz
                </button>
              </div>

              {sortedReviews.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {sortedReviews.map(rev => {
                    const revUser = users.find(u => u.id === rev.userId) || {
                      fullName: 'Okur',
                      username: 'okur',
                      role: 'user',
                      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&h=100&q=80'
                    };

                    const isAuthor = revUser.role === 'author';
                    const isRevealed = revealedSpoilers[rev.id];

                    return (
                      <div 
                        key={rev.id} 
                        className={`review-item-card ${isAuthor ? 'author-review-card' : ''}`}
                      >
                        {/* Yazar Üst Başlığı (Doküman Paragraf 5) */}
                        {isAuthor && (
                          <div className="author-review-badge-strip">
                            <span className="badge-author">
                              ★ Yazar Geri Dönüşü
                            </span>
                            <span style={{ fontSize: '0.72rem', color: 'var(--color-author-star)', fontWeight: 600 }}>
                              Öne Çıkarılan Yorum
                            </span>
                          </div>
                        )}

                        <div className="review-author-row">
                          <div className="review-author-user">
                            <img src={revUser.avatar} alt={revUser.fullName} className="review-author-avatar" />
                            <div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <span style={{ fontWeight: 700, fontSize: '0.88rem' }}>{revUser.fullName}</span>
                                {isAuthor && (
                                  <span style={{ color: 'var(--color-author-star)', fontSize: '0.8rem', fontWeight: 800 }}>
                                    ★
                                  </span>
                                )}
                              </div>
                              <span style={{ fontSize: '0.74rem', color: 'var(--text-dim)' }}>
                                @{revUser.username} • {rev.date}
                              </span>
                            </div>
                          </div>

                          <div className="star-rating-display">
                            {[...Array(5)].map((_, i) => (
                              <Star 
                                key={i} 
                                size={14} 
                                fill={i < rev.rating ? '#f59e0b' : 'transparent'} 
                                color={i < rev.rating ? '#f59e0b' : 'var(--text-dim)'} 
                              />
                            ))}
                          </div>
                        </div>

                        {/* Spoiler Blurlama (Doküman Paragraf 5: Spoiler içeren yorumlar blurlanacak) */}
                        {rev.isSpoiler ? (
                          <div className="spoiler-review-container">
                            <div className={`spoiler-review-content ${!isRevealed ? 'blurred' : ''}`}>
                              {rev.content}
                            </div>
                            {!isRevealed && (
                              <div className="spoiler-click-overlay" onClick={() => toggleSpoiler(rev.id)}>
                                <AlertTriangle size={15} color="#f59e0b" />
                                <span>Spoiler içeriyor • Okumak için tıklayın</span>
                              </div>
                            )}
                          </div>
                        ) : (
                          <p className="review-comment-text">{rev.content}</p>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '36px 20px', color: 'var(--text-muted)', background: 'var(--bg-surface-elevated)', borderRadius: 'var(--radius-md)' }}>
                  <p>Bu kitap hakkında henüz bir okur veya yazar değerlendirmesi yapılmamış.</p>
                  <p style={{ fontSize: '0.8rem', marginTop: '4px' }}>İlk değerlendirmeyi paylaşan sen ol!</p>
                </div>
              )}
            </div>
          )}

        </div>
      </Modal>

      {/* Review Modal Trigger */}
      <AddReviewModal
        bookId={book.id}
        isOpen={isReviewOpen}
        onClose={() => setIsReviewOpen(false)}
      />
    </>
  );
};
