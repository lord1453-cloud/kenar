import React, { useState } from 'react';
import { Search, Book, User, MessagesSquare, ArrowRight } from 'lucide-react';
import { Modal } from './Modal';
import { useApp } from '../../context/AppContext';
import { BookCover } from './BookCover';

export const SearchModal = () => {
  const { 
    isSearchOpen, 
    setIsSearchOpen, 
    books, 
    users, 
    rooms, 
    setSelectedBookId, 
    setSelectedRoomId, 
    setViewingUserId, 
    setActiveTab 
  } = useApp();

  const [query, setQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all'); // 'all' | 'books' | 'authors' | 'users' | 'rooms'

  const cleanQ = query.trim().toLowerCase();

  const matchingBooks = cleanQ ? books.filter(b => b.title.toLowerCase().includes(cleanQ)) : [];
  const matchingAuthors = cleanQ ? books.filter(b => b.author.toLowerCase().includes(cleanQ)) : [];
  const matchingUsers = cleanQ ? users.filter(u => u.fullName.toLowerCase().includes(cleanQ) || u.username.toLowerCase().includes(cleanQ)) : [];
  const matchingRooms = cleanQ ? rooms.filter(r => r.name.toLowerCase().includes(cleanQ) || r.description.toLowerCase().includes(cleanQ)) : [];

  const handleSelectBook = (bookId) => {
    setSelectedBookId(bookId);
    setIsSearchOpen(false);
  };

  const handleSelectUser = (userId) => {
    setViewingUserId(userId);
    setActiveTab('profile');
    setIsSearchOpen(false);
  };

  const handleSelectRoom = (roomId) => {
    setSelectedRoomId(roomId);
    setIsSearchOpen(false);
  };

  return (
    <Modal
      isOpen={isSearchOpen}
      onClose={() => setIsSearchOpen(false)}
      title="Luku'da Ara"
      maxWidth="620px"
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {/* Search Input */}
        <div style={{ position: 'relative' }}>
          <Search 
            size={18} 
            style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }} 
          />
          <input
            type="text"
            autoFocus
            placeholder="Kitap başlığı, yazar adı, kullanıcı veya kulüp odası..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{ width: '100%', paddingLeft: '42px', fontSize: '1rem' }}
          />
        </div>

        {/* Category Filter Pills */}
        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
          {[
            { id: 'all', label: 'Tümü' },
            { id: 'books', label: `Kitaplar (${matchingBooks.length})` },
            { id: 'authors', label: `Yazarlar (${matchingAuthors.length})` },
            { id: 'users', label: `Kullanıcılar (${matchingUsers.length})` },
            { id: 'rooms', label: `Odalar (${matchingRooms.length})` }
          ].map(cat => (
            <button
              key={cat.id}
              className={`btn btn-sm ${filterCategory === cat.id ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setFilterCategory(cat.id)}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Search Results Display */}
        <div style={{ maxHeight: '380px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '18px' }}>
          {!cleanQ && (
            <div style={{ textAlign: 'center', padding: '30px 20px', color: 'var(--text-dim)' }}>
              <Search size={32} style={{ margin: '0 auto 12px', opacity: 0.5 }} />
              <p>Aramak istediğiniz terimi yazmaya başlayın.</p>
              <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginTop: '12px', flexWrap: 'wrap' }}>
                <span className="badge badge-amber" style={{ cursor: 'pointer' }} onClick={() => setQuery('Dune')}>Dune</span>
                <span className="badge badge-indigo" style={{ cursor: 'pointer' }} onClick={() => setQuery('Harry')}>Harry Potter</span>
                <span className="badge badge-green" style={{ cursor: 'pointer' }} onClick={() => setQuery('Fantastik')}>Fantastik</span>
                <span className="badge badge-amber" style={{ cursor: 'pointer' }} onClick={() => setQuery('Zeynep')}>Zeynep Demir</span>
              </div>
            </div>
          )}

          {cleanQ && matchingBooks.length === 0 && matchingAuthors.length === 0 && matchingUsers.length === 0 && matchingRooms.length === 0 && (
            <div style={{ textAlign: 'center', padding: '30px 20px', color: 'var(--text-muted)' }}>
              <p>"{query}" için herhangi bir sonuç bulunamadı.</p>
            </div>
          )}

          {/* Books */}
          {(filterCategory === 'all' || filterCategory === 'books') && matchingBooks.length > 0 && (
            <div>
              <h4 style={{ fontSize: '0.85rem', color: 'var(--text-dim)', marginBottom: '8px', textTransform: 'uppercase' }}>
                📚 Kitaplar
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {matchingBooks.map(b => (
                  <div
                    key={b.id}
                    onClick={() => handleSelectBook(b.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '8px 12px',
                      borderRadius: 'var(--radius-md)',
                      background: 'var(--bg-surface-elevated)',
                      cursor: 'pointer'
                    }}
                  >
                    <BookCover src={b.cover} title={b.title} alt={b.title} style={{ width: '34px', height: '48px', borderRadius: '4px', flexShrink: 0 }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>{b.title}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{b.author} • {b.pages} sayfa</div>
                    </div>
                    <ArrowRight size={16} color="var(--text-dim)" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Authors */}
          {(filterCategory === 'all' || filterCategory === 'authors') && matchingAuthors.length > 0 && (
            <div>
              <h4 style={{ fontSize: '0.85rem', color: 'var(--text-dim)', marginBottom: '8px', textTransform: 'uppercase' }}>
                ✍️ Yazarlar ve Kitapları
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {matchingAuthors.map(b => (
                  <div
                    key={`author-${b.id}`}
                    onClick={() => handleSelectBook(b.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '8px 12px',
                      borderRadius: 'var(--radius-md)',
                      background: 'var(--bg-surface-elevated)',
                      cursor: 'pointer'
                    }}
                  >
                    <div className="btn-icon" style={{ background: 'var(--color-primary-light)', color: 'var(--color-primary)' }}>
                      <Book size={18} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>{b.author}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Eseri: {b.title}</div>
                    </div>
                    <ArrowRight size={16} color="var(--text-dim)" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Users */}
          {(filterCategory === 'all' || filterCategory === 'users') && matchingUsers.length > 0 && (
            <div>
              <h4 style={{ fontSize: '0.85rem', color: 'var(--text-dim)', marginBottom: '8px', textTransform: 'uppercase' }}>
                👥 Kullanıcılar
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {matchingUsers.map(u => (
                  <div
                    key={u.id}
                    onClick={() => handleSelectUser(u.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '8px 12px',
                      borderRadius: 'var(--radius-md)',
                      background: 'var(--bg-surface-elevated)',
                      cursor: 'pointer'
                    }}
                  >
                    <img src={u.avatar} alt={u.fullName} style={{ width: '38px', height: '38px', borderRadius: '50%', objectFit: 'cover' }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>{u.fullName}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>@{u.username} • {u.bio.slice(0, 45)}...</div>
                    </div>
                    <ArrowRight size={16} color="var(--text-dim)" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Rooms */}
          {(filterCategory === 'all' || filterCategory === 'rooms') && matchingRooms.length > 0 && (
            <div>
              <h4 style={{ fontSize: '0.85rem', color: 'var(--text-dim)', marginBottom: '8px', textTransform: 'uppercase' }}>
                🚪 Kitap Odaları
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {matchingRooms.map(r => (
                  <div
                    key={r.id}
                    onClick={() => handleSelectRoom(r.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '8px 12px',
                      borderRadius: 'var(--radius-md)',
                      background: 'var(--bg-surface-elevated)',
                      cursor: 'pointer'
                    }}
                  >
                    <div style={{ fontSize: '1.5rem', width: '38px', textAlign: 'center' }}>{r.icon}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>{r.name}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{r.members.length} üye • {r.isPrivate ? 'Özel Oda' : 'Herkese Açık'}</div>
                    </div>
                    <ArrowRight size={16} color="var(--text-dim)" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};
