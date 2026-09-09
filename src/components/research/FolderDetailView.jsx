import React from 'react';
import { useApp } from '../../context/AppContext';
import { FEATURED_COVERS } from '../../data/featuredBooksCovers';
import { BookCover } from '../common/BookCover';

export const FolderDetailView = () => {
  const { activeFolderName, openBook, books, setActiveTab } = useApp();

  // Aktif kategoriye göre kitapları akıllı filtrele ve gerçek kapaklarını ata
  const filteredBooks = React.useMemo(() => {
    const list = books && books.length > 0 ? books : Object.values(FEATURED_COVERS);
    const term = (activeFolderName || '').toLowerCase();

    let res = list.filter(b => {
      const cat = (b.category || '').toLowerCase();
      const genre = (b.genre || '').toLowerCase();
      const title = (b.title || '').toLowerCase();

      if (term.includes('türk') && (cat.includes('türk') || genre.includes('türk'))) return true;
      if (term.includes('dünya') && (cat.includes('dünya') || cat.includes('klasik') || genre.includes('klasik'))) return true;
      if (term.includes('bilim') && (cat.includes('bilim') || genre.includes('bilim') || genre.includes('distopya') || genre.includes('fantastik'))) return true;
      if (term.includes('gelişim') && (cat.includes('gelişim') || genre.includes('gelişim') || genre.includes('psikoloji'))) return true;
      if (term.includes('şiir') && (cat.includes('şiir') || genre.includes('şiir'))) return true;
      if (term.includes('en çok') || term.includes('top')) return cat.includes('bu yıl') || cat.includes('top') || (b.rating && b.rating >= 4.7);
      return cat.includes(term) || genre.includes(term) || title.includes(term);
    });

    if (res.length === 0) {
      res = list.slice(0, 16);
    }
    return res;
  }, [books, activeFolderName]);

  const StarIcon = () => (
    <svg viewBox="0 0 24 24">
      <path d="M12 2l2.9 6.4 7.1.7-5.3 4.8 1.6 6.9L12 17.3 5.7 20.8l1.6-6.9L2 9.1l7.1-.7z"/>
    </svg>
  );

  return (
    <div className="content wide">
      {/* Breadcrumb Kırıntı */}
      <div 
        className="ai-note" 
        style={{ color: 'var(--label-2)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
        onClick={() => setActiveTab('research')}
      >
        <span>Kitap Ara</span>
        <span>/</span>
        <span style={{ color: 'var(--label)', fontWeight: 600 }}>{activeFolderName || 'Dünya Klasikleri'}</span>
      </div>

      {/* 4 Sütunlu Kitap Izgarası: Her Kitap Kendi Orijinal Kapağıyla */}
      <div className="book-grid">
        {filteredBooks.map(b => {
          const coverUrl = b.cover || b.coverImage || FEATURED_COVERS.kayip_zaman.cover;
          const isRealImage = coverUrl && (coverUrl.startsWith('http') || coverUrl.startsWith('data:'));

          return (
            <button 
              key={b.id || b.title} 
              className="book-tile" 
              onClick={() => openBook({
                id: b.id,
                title: b.title,
                author: b.author,
                genre: b.genre || b.category || 'Roman · Edebiyat',
                rating: b.rating || 4.5,
                reviewsCount: b.readersCount ? `${b.readersCount}` : '1.284',
                cover: coverUrl,
                coverImage: coverUrl,
                summary: b.description || 'Hafızanın kırılganlığını ve zamanın akışkanlığını konu alan bu eser, insan ruhunun derinliklerini sabırlı bir anlatımla ele alıyor.'
              })}
            >
              <BookCover 
                src={coverUrl} 
                title={b.title} 
                alt={b.title} 
                className="cv" 
              />
              <div className="bt">{b.title}</div>
              <div className="ba">{b.author}</div>
              <div className="stars">
                <StarIcon />
                <StarIcon />
                <StarIcon />
                <StarIcon />
                <span className="rating-text">{b.rating || '4.5'}</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
