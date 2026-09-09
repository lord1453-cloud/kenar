import React, { useState } from 'react';
import { 
  Compass, 
  Flame, 
  Star, 
  Users, 
  Sparkles, 
  Search, 
  BookOpen, 
  Check, 
  Plus 
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { GENRES } from '../../data/genres';
import { BookCover } from '../common/BookCover';

export const DiscoverView = () => {
  const { 
    books, 
    rooms, 
    users, 
    setSelectedBookId, 
    setSelectedRoomId, 
    setViewingUserId, 
    setActiveTab, 
    joinRoom, 
    currentUser 
  } = useApp();

  const [selectedGenre, setSelectedGenre] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredBooks = books
    .filter(b => {
      if (selectedGenre !== 'all' && b.genre !== selectedGenre) return false;
      if (searchQuery && !b.title.toLowerCase().includes(searchQuery.toLowerCase()) && !b.author.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }
      return true;
    });

  const featuredRooms = rooms.slice(0, 4);

  return (
    <div className="content-layout">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '26px' }}>
        {/* Header */}
        <div>
          <h2 style={{ fontSize: '1.6rem' }}>Keşfet & Edebi Yolculuk</h2>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
            Yeni dünyalar keşfedin, popüler kitapları inceleyin ve tutkulu okuma topluluklarına katılın.
          </p>
        </div>

        {/* Featured Communities Carousel / Row */}
        <div>
          <h3 style={{ fontSize: '1.15rem', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sparkles size={18} color="var(--color-primary)" />
            Öne Çıkan Kitap Kulüpleri
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '16px' }}>
            {featuredRooms.map(room => {
              const isMember = room.members.includes(currentUser.id);
              return (
                <div
                  key={room.id}
                  style={{
                    background: 'var(--bg-surface)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-lg)',
                    padding: '16px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ fontSize: '2rem' }}>{room.icon}</span>
                    <div style={{ minWidth: 0, flex: 1 }}>
                      <h4 
                        style={{ fontSize: '1rem', fontWeight: 700, cursor: 'pointer' }}
                        onClick={() => setSelectedRoomId(room.id)}
                      >
                        {room.name}
                      </h4>
                      <span style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>
                        {room.members.length} okur üye
                      </span>
                    </div>
                  </div>

                  <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineClamp: 2, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {room.description}
                  </p>

                  <div style={{ display: 'flex', gap: '8px', marginTop: 'auto' }}>
                    <button
                      className="btn btn-secondary btn-sm"
                      style={{ flex: 1 }}
                      onClick={() => setSelectedRoomId(room.id)}
                    >
                      İncele
                    </button>
                    <button
                      className={`btn btn-sm ${isMember ? 'btn-ghost' : 'btn-primary'}`}
                      onClick={() => joinRoom(room.id)}
                    >
                      {isMember ? 'Katıldın' : 'Katıl'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Explore Books Section */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
            <h3 style={{ fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <BookOpen size={18} color="var(--color-primary)" />
              Kitap Koleksiyonu
            </h3>

            {/* Genre Filter Pills */}
            <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px', maxWidth: '100%' }}>
              <button
                className={`btn btn-sm ${selectedGenre === 'all' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setSelectedGenre('all')}
              >
                Tümü
              </button>
              {GENRES.map(g => (
                <button
                  key={g.id}
                  className={`btn btn-sm ${selectedGenre === g.name ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => setSelectedGenre(g.name)}
                >
                  <span>{g.icon}</span>
                  <span>{g.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Search Input for books */}
          <div style={{ position: 'relative' }}>
            <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }} />
            <input
              type="text"
              placeholder="Kitap başlığı veya yazar ara..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ width: '100%', paddingLeft: '38px' }}
            />
          </div>

          {/* Books Grid */}
          <div className="books-grid">
            {filteredBooks.map(book => (
              <div 
                key={book.id} 
                className="library-book-card" 
                onClick={() => setSelectedBookId(book.id)}
                style={{ cursor: 'pointer' }}
              >
                <div className="book-card-cover-wrap">
                  <BookCover src={book.cover} title={book.title} alt={book.title} className="book-card-cover" />
                </div>

                <div className="book-card-info">
                  <div className="book-card-meta">
                    <span className="book-card-genre">{book.genre}</span>
                    <h4 className="book-card-title">{book.title}</h4>
                    <span className="book-card-author">{book.author}</span>
                  </div>

                  <div style={{ marginTop: 'auto', paddingTop: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.82rem' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#f59e0b', fontWeight: 700 }}>
                        <Star size={14} fill="#f59e0b" />
                        {book.rating}
                      </span>
                      <span style={{ color: 'var(--text-dim)' }}>
                        {book.readersCount} okur
                      </span>
                    </div>

                    <button 
                      className="btn btn-secondary btn-sm"
                      style={{ width: '100%', marginTop: '8px', fontSize: '0.78rem' }}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedBookId(book.id);
                      }}
                    >
                      Kitap Detayı
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
