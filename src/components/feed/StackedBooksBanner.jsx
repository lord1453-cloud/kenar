import React, { useState } from 'react';
import { Layers, Star, Plus, Eye, Sparkles } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { BookCover } from '../common/BookCover';

export const StackedBooksBanner = () => {
  const { books, setSelectedBookId, addToWishlist, isInWishlist } = useApp();
  const [isFanned, setIsFanned] = useState(false);

  // O ay en çok okunan/değerlendirilen 4 kitap
  const topBooks = [...books]
    .sort((a, b) => (b.readersCount || 0) - (a.readersCount || 0))
    .slice(0, 4);

  // Üst üste yığılma için dönüş ve öteleme parametreleri
  const stackStyles = [
    { rotate: '-6deg', translateX: '-18px', translateY: '6px', zIndex: 1 },
    { rotate: '-2deg', translateX: '-6px', translateY: '2px', zIndex: 2 },
    { rotate: '3deg', translateX: '8px', translateY: '-2px', zIndex: 3 },
    { rotate: '8deg', translateX: '22px', translateY: '-8px', zIndex: 4 }
  ];

  return (
    <div className="stacked-books-wrapper glass-panel">
      <div className="stacked-books-header">
        <div>
          <div className="stacked-badge">
            <Sparkles size={13} color="#f59e0b" />
            <span>Ayın En Çok Okunanları</span>
          </div>
          <h3 className="stacked-title">Eylül Ayı Edebi Yığını</h3>
          <p className="stacked-subtitle">
            Kulüp üyelerinin bu ay sayfalarını en çok çevirdiği başyapıtlar
          </p>
        </div>

        <button 
          className="btn btn-secondary btn-sm stacked-toggle-btn"
          onClick={() => setIsFanned(prev => !prev)}
        >
          <Layers size={15} />
          <span>{isFanned ? 'Yığına Dönüştür' : 'Kitapları Aç'}</span>
        </button>
      </div>

      {/* 3D Stack / Fan-out Container */}
      <div 
        className={`stacked-stage ${isFanned ? 'fanned' : 'stacked'}`}
        onMouseEnter={() => setIsFanned(true)}
        onMouseLeave={() => setIsFanned(false)}
      >
        {topBooks.map((book, idx) => {
          const style = stackStyles[idx] || stackStyles[0];
          const inWish = isInWishlist(book.id);

          return (
            <div
              key={book.id}
              className="stacked-book-item"
              style={{
                '--rot': isFanned ? '0deg' : style.rotate,
                '--tx': isFanned ? '0px' : style.translateX,
                '--ty': isFanned ? '0px' : style.translateY,
                zIndex: isFanned ? 10 - idx : style.zIndex
              }}
              onClick={() => setSelectedBookId(book.id)}
              title={`${book.title} - Detaylar için tıkla`}
            >
              <div className="stacked-cover-card">
                <BookCover src={book.cover} title={book.title} alt={book.title} className="stacked-cover-img" />
                <div className="stacked-rank-pill">#{idx + 1}</div>
                
                <div className="stacked-overlay">
                  <span className="stacked-book-name">{book.title}</span>
                  <span className="stacked-book-author">{book.author}</span>
                  <div className="stacked-book-stats">
                    <span className="stat-star"><Star size={12} fill="#f59e0b" color="#f59e0b" /> {book.rating}</span>
                    <span className="stat-readers">{book.readersCount.toLocaleString()} okur</span>
                  </div>

                  <div className="stacked-actions" onClick={(e) => e.stopPropagation()}>
                    <button
                      className={`btn-quick-add ${inWish ? 'in-wishlist' : ''}`}
                      title={inWish ? 'İstek sepetinizde' : 'İstek sepetine ekle (+)'}
                      onClick={() => addToWishlist(book.id)}
                    >
                      <Plus size={15} />
                    </button>
                    <button 
                      className="btn-quick-add"
                      title="Kitap detayını incele"
                      onClick={() => setSelectedBookId(book.id)}
                    >
                      <Eye size={14} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
