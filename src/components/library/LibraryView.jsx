import React, { useState } from 'react';
import { 
  BookOpen, 
  CheckCircle2, 
  Bookmark, 
  Search, 
  Filter, 
  SlidersHorizontal, 
  Plus, 
  Star 
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { GENRES } from '../../data/genres';
import { BookCover } from '../common/BookCover';

export const LibraryView = ({ targetUserId }) => {
  const { 
    books, 
    userBooks, 
    currentUser, 
    users, 
    setSelectedBookId, 
    setUpdatingProgressBook,
    updateBookStatus,
    startTimer,
    showToast
  } = useApp();

  const [activeShelf, setActiveShelf] = useState('reading'); // 'reading' | 'read' | 'to_read'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('all');
  const [sortBy, setSortBy] = useState('date'); // 'date' | 'title' | 'pages' | 'rating'

  const activeUserId = targetUserId || currentUser.id;
  const isSelf = activeUserId === currentUser.id;
  const targetUser = users.find(u => u.id === activeUserId);

  // User's books in this shelf
  const myUserBooks = userBooks.filter(ub => ub.userId === activeUserId);

  // Filter books according to shelf and criteria
  const shelfBooksWithProgress = books
    .map(book => {
      const ub = myUserBooks.find(u => u.bookId === book.id);
      return { ...book, userBook: ub };
    })
    .filter(item => {
      if (!item.userBook) return false;
      return item.userBook.status === activeShelf;
    })
    .filter(item => {
      if (searchQuery && !item.title.toLowerCase().includes(searchQuery.toLowerCase()) && !item.author.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }
      if (selectedGenre !== 'all' && item.genre !== selectedGenre) {
        return false;
      }
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'title') return a.title.localeCompare(b.title);
      if (sortBy === 'pages') return b.pages - a.pages;
      if (sortBy === 'rating') return b.rating - a.rating;
      return 0; // Default
    });

  const countByShelf = {
    reading: myUserBooks.filter(ub => ub.status === 'reading').length,
    read: myUserBooks.filter(ub => ub.status === 'read').length,
    to_read: myUserBooks.filter(ub => ub.status === 'to_read').length
  };

  return (
    <div className="content-layout">
      <div className="library-container">
        {/* Top Header & Shelves */}
        <div className="library-header">
          <div>
            <h2 style={{ fontSize: '1.6rem' }}>
              {isSelf ? 'Kişisel Kitaplığım' : `${targetUser?.fullName} Kitaplığı`}
            </h2>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
              Okuma yolculuğunu, bitirdiğin kitapları ve okuma listenizi takip edin.
            </p>
          </div>

          {/* Shelves Switcher */}
          <div className="library-tabs">
            <button
              className={`library-tab-btn ${activeShelf === 'reading' ? 'active' : ''}`}
              onClick={() => setActiveShelf('reading')}
            >
              <BookOpen size={16} />
              <span>Okuyorum</span>
              <span className="library-count-pill">{countByShelf.reading}</span>
            </button>

            <button
              className={`library-tab-btn ${activeShelf === 'read' ? 'active' : ''}`}
              onClick={() => setActiveShelf('read')}
            >
              <CheckCircle2 size={16} />
              <span>Okudum</span>
              <span className="library-count-pill">{countByShelf.read}</span>
            </button>

            <button
              className={`library-tab-btn ${activeShelf === 'to_read' ? 'active' : ''}`}
              onClick={() => setActiveShelf('to_read')}
            >
              <Bookmark size={16} />
              <span>Okuyacağım</span>
              <span className="library-count-pill">{countByShelf.to_read}</span>
            </button>
          </div>
        </div>

        {/* Toolbar: Search, Genre Filter, Sort */}
        <div className="library-toolbar">
          <div style={{ position: 'relative', flex: '1', minWidth: '200px' }}>
            <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }} />
            <input
              type="text"
              placeholder="Kitaplığında ara..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="library-search-input"
              style={{ width: '100%', paddingLeft: '36px' }}
            />
          </div>

          <select
            value={selectedGenre}
            onChange={(e) => setSelectedGenre(e.target.value)}
            style={{ padding: '8px 12px', fontSize: '0.85rem' }}
          >
            <option value="all">Tüm Türler</option>
            {GENRES.map(g => (
              <option key={g.id} value={g.name}>{g.name}</option>
            ))}
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            style={{ padding: '8px 12px', fontSize: '0.85rem' }}
          >
            <option value="date">Sırala: Varsayılan</option>
            <option value="title">İsme Göre (A-Z)</option>
            <option value="pages">Sayfa Sayısına Göre</option>
            <option value="rating">Puana Göre</option>
          </select>
        </div>

        {/* Books Grid */}
        {shelfBooksWithProgress.length > 0 ? (
          <div className="books-grid">
            {shelfBooksWithProgress.map(book => {
              const ub = book.userBook;
              const currentPage = ub?.currentPage || 0;
              const percent = Math.min(100, Math.round((currentPage / book.pages) * 100));

              return (
                <div key={book.id} className="library-book-card">
                  {/* Cover */}
                  <div 
                    className="book-card-cover-wrap" 
                    onClick={() => setSelectedBookId(book.id)}
                    title="Kitap detayını görüntüle"
                  >
                    <BookCover src={book.cover} title={book.title} alt={book.title} className="book-card-cover" />
                  </div>

                  {/* Info */}
                  <div className="book-card-info">
                    <div className="book-card-meta">
                      <span className="book-card-genre">{book.genre}</span>
                      <h4 
                        className="book-card-title" 
                        onClick={() => setSelectedBookId(book.id)}
                      >
                        {book.title}
                      </h4>
                      <span className="book-card-author">{book.author}</span>
                    </div>

                    {/* Progress Bar for Currently Reading */}
                    {activeShelf === 'reading' && (
                      <div className="book-card-progress">
                        <div className="progress-header">
                          <span className="progress-pages">{currentPage} / {book.pages} sf.</span>
                          <span className="progress-percent">%{percent}</span>
                        </div>
                        <div className="progress-track">
                          <div className="progress-bar" style={{ width: `${percent}%` }} />
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', color: 'var(--color-primary)', marginTop: '4px', fontWeight: 600 }}>
                          ⏱️ Okuma Süresi: {ub?.totalReadingSeconds ? Math.round(ub.totalReadingSeconds / 60) + ' dk' : 'Henüz ölçülmedi'}
                        </div>
                      </div>
                    )}

                    {/* Finished details for Read */}
                    {activeShelf === 'read' && (
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '4px', display: 'flex', flexDirection: 'column', gap: '2px' }}>
                        {ub.finishDate && <span>Bitiş: {ub.finishDate}</span>}
                        {ub.totalReadingSeconds > 0 && (
                          <span style={{ color: 'var(--color-primary)', fontWeight: 600 }}>
                            ⏱️ Toplam: {Math.round(ub.totalReadingSeconds / 3600)} saat {Math.round((ub.totalReadingSeconds % 3600) / 60)} dk
                          </span>
                        )}
                      </div>
                    )}

                    {/* Rating if available */}
                    {activeShelf === 'read' && ub.userRating && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '3px', marginTop: '2px' }}>
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            size={13} 
                            fill={i < ub.userRating ? '#c8963e' : 'transparent'} 
                            color={i < ub.userRating ? '#c8963e' : 'var(--text-dim)'} 
                          />
                        ))}
                      </div>
                    )}

                    {/* Action buttons */}
                    {isSelf && (
                      <div className="book-card-actions">
                        {activeShelf === 'reading' && (
                          <>
                            <button
                              className="btn btn-primary btn-sm"
                              style={{ flex: 1, fontSize: '0.8rem', padding: '6px 10px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', cursor: 'pointer', fontWeight: 600 }}
                              onClick={(e) => {
                                e.stopPropagation();
                                setUpdatingProgressBook(book.id);
                              }}
                              title="Okunan sayfa sayısını güncelle"
                            >
                              <span>Sayfa</span>
                            </button>
                            <button
                              className="btn btn-timer-primary btn-sm"
                              style={{ flex: 1.2, fontSize: '0.8rem', padding: '6px 10px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', cursor: 'pointer', fontWeight: 600 }}
                              onClick={(e) => {
                                e.stopPropagation();
                                startTimer(book.id);
                              }}
                              title="Okuma kronometresini başlat"
                            >
                              <span>⏱️ Oku</span>
                            </button>
                          </>
                        )}

                        {activeShelf === 'to_read' && (
                          <button
                            className="btn btn-primary btn-sm"
                            style={{ width: '100%', fontSize: '0.78rem', padding: '5px 8px' }}
                            onClick={() => {
                              updateBookStatus(book.id, 'reading');
                              startTimer(book.id);
                            }}
                          >
                            Okumaya Başla
                          </button>
                        )}

                        {activeShelf === 'read' && (
                          <button
                            className="btn btn-secondary btn-sm"
                            style={{ width: '100%', fontSize: '0.78rem', padding: '5px 8px' }}
                            onClick={() => setSelectedBookId(book.id)}
                          >
                            İnceleme Yaz
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '60px 20px', background: 'var(--bg-surface)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-subtle)' }}>
            <BookOpen size={40} style={{ color: 'var(--text-dim)', marginBottom: '14px' }} />
            <h3 style={{ fontSize: '1.2rem', marginBottom: '6px' }}>Bu Rafta Kitap Yok</h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', maxWidth: '380px', margin: '0 auto 16px' }}>
              {activeShelf === 'reading' && 'Şu anda okuduğun bir kitap görünmüyor. Keşfet bölümünden yeni bir kitaba başlayabilirsin.'}
              {activeShelf === 'read' && 'Henüz bitirdiğin bir kitap kayıtlı değil.'}
              {activeShelf === 'to_read' && 'Okuma listen şu anda boş.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
