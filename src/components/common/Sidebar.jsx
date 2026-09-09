import React from 'react';
import { useApp } from '../../context/AppContext';
import { KenarLogo } from './KenarLogo';
import { FEATURED_COVERS } from '../../data/featuredBooksCovers';
import { BookCover } from './BookCover';

export const Sidebar = () => {
  const { 
    activeTab, 
    setActiveTab, 
    currentUser, 
    setViewingUserId,
    openRoom
  } = useApp();

  const handleNavClick = (tabId) => {
    if (tabId === 'profile') {
      setViewingUserId(null);
    }
    setActiveTab(tabId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const avatarUrl = currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&h=300&q=80';

  return (
    <aside className="sidebar">
      {/* Şık Kenar Vektör Logosu & Başlık */}
      <div 
        className="brand-container" 
        onClick={() => handleNavClick('feed')}
        style={{ padding: '4px 6px 22px 6px', cursor: 'pointer' }}
        title="Kenar Ana Sayfa"
      >
        <KenarLogo size={34} showText={true} />
      </div>

      {/* Navigasyon Listesi */}
      <nav className="navlist">
        <button 
          className={`navitem ${activeTab === 'feed' ? 'active' : ''}`}
          onClick={() => handleNavClick('feed')}
        >
          <svg className="icon" viewBox="0 0 24 24">
            <path d="M4 11l8-7 8 7M6 10v9a1 1 0 0 0 1 1h4v-6h2v6h4a1 1 0 0 0 1-1v-9"/>
          </svg>
          Akış
        </button>
        <button 
          className={`navitem ${activeTab === 'rooms' || activeTab === 'room_detail' ? 'active' : ''}`}
          onClick={() => handleNavClick('rooms')}
        >
          <svg className="icon" viewBox="0 0 24 24">
            <path d="M21 11.5a8.5 8.5 0 0 1-8.5 8.5c-1.3 0-2.5-.28-3.6-.78L4 20l1.02-4.6A8.5 8.5 0 1 1 21 11.5z"/>
          </svg>
          Kitap Odaları
        </button>
        <button 
          className={`navitem ${activeTab === 'research' || activeTab === 'folder_detail' || activeTab === 'book_detail' ? 'active' : ''}`}
          onClick={() => handleNavClick('research')}
        >
          <svg className="icon" viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="7"/>
            <path d="M21 21l-4.3-4.3"/>
          </svg>
          Kitap Ara
        </button>
        <button 
          className={`navitem ${activeTab === 'profiles' ? 'active' : ''}`}
          onClick={() => handleNavClick('profiles')}
        >
          <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
            <circle cx="9" cy="7" r="4"></circle>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
          </svg>
          Okur Profilleri
        </button>
      </nav>

      {/* Popüler Odalar — Geniş, Ferah ve Şık Kitap Kartları */}
      <div className="side-section" style={{ marginTop: '22px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 4px 10px' }}>
          <span className="side-title" style={{ padding: 0 }}>
            Popüler Odalar
          </span>
          <button 
            onClick={() => handleNavClick('rooms')}
            style={{ 
              background: 'none', 
              border: 'none', 
              color: 'var(--color-primary, #C88A58)', 
              fontSize: '0.78rem', 
              fontWeight: 600, 
              cursor: 'pointer',
              padding: '0 2px'
            }}
            title="Tüm Odaları Gör"
          >
            Tümü →
          </button>
        </div>
        
        {/* 1. Kayıp Zamanın İzinde */}
        <button 
          className="sidebar-room-card" 
          onClick={() => openRoom({ 
            title: FEATURED_COVERS.kayip_zaman.title, 
            author: FEATURED_COVERS.kayip_zaman.author, 
            cover: FEATURED_COVERS.kayip_zaman.cover,
            coverImage: FEATURED_COVERS.kayip_zaman.cover,
            members: '412 üye · Eylül seçkisi' 
          })}
        >
          <div className="sidebar-room-cover">
            <BookCover 
              src={FEATURED_COVERS.kayip_zaman.cover} 
              title={FEATURED_COVERS.kayip_zaman.title || "Kayıp Zamanın İzinde"}
              alt="Kayıp Zamanın İzinde"
            />
          </div>
          <div className="sidebar-room-body">
            <div className="sidebar-room-title" title="Kayıp Zamanın İzinde">
              Kayıp Zamanın İzinde
            </div>
            <div className="sidebar-room-author">
              Marcel Proust
            </div>
            <div className="sidebar-room-meta">
              <span className="live-dot" />
              <span>412 okur · Canlı</span>
            </div>
          </div>
        </button>

        {/* 2. Beyaz Gece */}
        <button 
          className="sidebar-room-card" 
          onClick={() => openRoom({ 
            title: FEATURED_COVERS.beyaz_gece.title, 
            author: FEATURED_COVERS.beyaz_gece.author, 
            cover: FEATURED_COVERS.beyaz_gece.cover,
            coverImage: FEATURED_COVERS.beyaz_gece.cover,
            members: '298 üye' 
          })}
        >
          <div className="sidebar-room-cover">
            <BookCover 
              src={FEATURED_COVERS.beyaz_gece.cover} 
              title={FEATURED_COVERS.beyaz_gece.title || "Beyaz Gece"}
              alt="Beyaz Gece"
            />
          </div>
          <div className="sidebar-room-body">
            <div className="sidebar-room-title" title="Beyaz Gece">
              Beyaz Gece
            </div>
            <div className="sidebar-room-author">
              Fyodor Dostoyevski
            </div>
            <div className="sidebar-room-meta">
              <span className="live-dot" />
              <span>298 okur · Canlı</span>
            </div>
          </div>
        </button>

        {/* 3. Sessiz Ev */}
        <button 
          className="sidebar-room-card" 
          onClick={() => openRoom({ 
            title: FEATURED_COVERS.sessiz_ev.title, 
            author: FEATURED_COVERS.sessiz_ev.author, 
            cover: FEATURED_COVERS.sessiz_ev.cover,
            coverImage: FEATURED_COVERS.sessiz_ev.cover,
            members: '175 üye' 
          })}
        >
          <div className="sidebar-room-cover">
            <BookCover 
              src={FEATURED_COVERS.sessiz_ev.cover} 
              title={FEATURED_COVERS.sessiz_ev.title || "Sessiz Ev"}
              alt="Sessiz Ev"
            />
          </div>
          <div className="sidebar-room-body">
            <div className="sidebar-room-title" title="Sessiz Ev">
              Sessiz Ev
            </div>
            <div className="sidebar-room-author">
              Orhan Pamuk
            </div>
            <div className="sidebar-room-meta">
              <span className="live-dot" />
              <span>175 okur · Canlı</span>
            </div>
          </div>
        </button>
      </div>

      {/* Profil Mini Kartı */}
      <div className="sidebar-bottom">
        <button 
          className="profile-mini" 
          onClick={() => handleNavClick('profile')}
          title="Profilime Git"
        >
          <div style={{ position: 'relative' }}>
            <div 
              className="avatar" 
              style={{ 
                backgroundImage: `url(${avatarUrl})`,
                backgroundColor: '#8B4A34',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                boxShadow: '0 2px 6px rgba(0,0,0,0.12)'
              }}
            />
            {/* Çevrimiçi Yeşil Durum Noktası */}
            <span style={{
              position: 'absolute',
              bottom: '0',
              right: '0',
              width: '9px',
              height: '9px',
              borderRadius: '50%',
              backgroundColor: '#34C759',
              border: '2px solid var(--bg-sidebar)'
            }} />
          </div>
          <div>
            <div className="n">{currentUser?.fullName || 'Ayşe Yılmaz'}</div>
            <div className="u">@{currentUser?.username || 'ayseyilmaz'}</div>
          </div>
        </button>
      </div>
    </aside>
  );
};
