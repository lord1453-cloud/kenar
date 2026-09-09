import React from 'react';
import { useApp } from '../../context/AppContext';

export const Header = () => {
  const { 
    activeTab, 
    setActiveTab, 
    setViewingUserId, 
    currentUser, 
    theme, 
    setAppTheme, 
    setIsCreatePostOpen 
  } = useApp();

  const getScreenTitle = () => {
    switch (activeTab) {
      case 'feed':
        return 'Akış';
      case 'rooms':
        return 'Kitap Odaları';
      case 'room_detail':
        return 'Oda';
      case 'research':
        return 'Kitap Ara';
      case 'folder_detail':
        return 'Klasör';
      case 'book_detail':
        return 'Kitap';
      case 'profile':
        return 'Profilim';
      case 'profiles':
        return 'Okur Profilleri';
      default:
        return 'Kenar';
    }
  };

  const handleToggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setAppTheme(nextTheme);
  };

  return (
    <header className="topbar">
      <div className="screen-title" id="screenTitle">
        {getScreenTitle()}
      </div>

      <div className="topbar-actions">
        {/* Güneş / Ay Tema Değiştirme Butonu */}
        <button 
          className="icon-btn" 
          onClick={handleToggleTheme} 
          title={theme === 'dark' ? 'Aydınlık Mod' : 'Karanlık Mod'}
          aria-label="Tema Değiştir"
        >
          {theme === 'dark' ? (
            <svg className="icon" viewBox="0 0 24 24">
              <path d="M21 12.8A9 9 0 1 1 11.2 3 7 7 0 0 0 21 12.8z"/>
            </svg>
          ) : (
            <svg className="icon" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="4"/>
              <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>
            </svg>
          )}
        </button>

        {/* Mavi Dairesel Plus Butonu (Düşünceni Paylaş) */}
        <button 
          className="icon-btn plus-btn" 
          onClick={() => setIsCreatePostOpen(true)}
          title="Gönderi paylaş (+)"
          aria-label="Gönderi Paylaş"
        >
          <svg className="icon" viewBox="0 0 24 24">
            <path d="M12 5v14M5 12h14"/>
          </svg>
        </button>

        {/* Profil Avatar Butonu */}
        <button 
          className="icon-btn topbar-avatar" 
          onClick={() => { setActiveTab('profile'); setViewingUserId(null); }}
          title="Profilim"
          aria-label="Profilim"
        >
          <div 
            className="avatar" 
            style={{ 
              width: '34px', 
              height: '34px',
              backgroundImage: currentUser?.avatar ? `url(${currentUser.avatar})` : 'none',
              backgroundColor: '#8B4A34'
            }}
          />
        </button>
      </div>
    </header>
  );
};
