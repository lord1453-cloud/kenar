import React, { useState } from 'react';
import { 
  UserPlus, 
  UserCheck, 
  Edit3, 
  Shield, 
  Lock, 
  FolderPlus, 
  Calendar as CalendarIcon, 
  BookOpen, 
  MessageSquare, 
  Folder, 
  ArrowLeft, 
  Sparkles, 
  Star, 
  Flame, 
  Clock, 
  Check, 
  Heart,
  ExternalLink,
  Plus
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { FEATURED_COVERS } from '../../data/featuredBooksCovers';
import { BookCover } from '../common/BookCover';
import { ReadingGoalCalendar } from './ReadingGoalCalendar';
import { FollowListModal } from './FollowListModal';
import { PostCard } from '../feed/PostCard';

export const ProfileView = () => {
  const { 
    users,
    currentUser, 
    currentUserId,
    viewingUserId,
    setViewingUserId,
    switchUser,
    followUser,
    sendFriendRequest,
    setIsFoldersModalOpen, 
    openFolder, 
    openBook,
    userFolders, 
    books,
    userBooks,
    posts,
    setIsEditProfileOpen,
    setIsPrivacyOpen,
    setIsCreatePostOpen,
    showToast 
  } = useApp();

  // Aktif incelenen kullanıcı çözümlemesi
  const targetUser = viewingUserId ? (users.find(u => u.id === viewingUserId) || currentUser) : currentUser;
  const isOwnProfile = !viewingUserId || viewingUserId === currentUser?.id;

  // Takip ve Arkadaşlık Durumu
  const isFollowing = (currentUser?.following || []).includes(targetUser?.id);
  const isFriend = (currentUser?.friends || []).includes(targetUser?.id);

  // Profil Alt Sekmeleri: 'shelves' | 'books' | 'calendar' | 'posts'
  const [activeSubTab, setActiveSubTab] = useState('shelves');
  const [activeColorDot, setActiveColorDot] = useState('var(--accent)');

  // Takipçi / Takip Edilen Modalı Durumu
  const [followModal, setFollowModal] = useState({
    isOpen: false,
    title: '',
    userIds: []
  });

  // Saat / Dakika formatlayıcı
  const formatReadingDuration = (totalSeconds) => {
    if (!totalSeconds || totalSeconds <= 0) return '0 dk';
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    if (hours > 0) {
      return `${hours} sa ${minutes > 0 ? `${minutes} dk` : ''}`;
    }
    return `${minutes} dk`;
  };

  // Hedef kullanıcının klasörleri
  const targetUserFolders = (userFolders || []).filter(f => f.userId === targetUser?.id);
  
  // Varsayılan klasör çipleri (kullanıcının özel klasörleri yoksa veya demo için)
  const defaultChips = [
    { id: 'fc-1', name: 'Favorilerim', count: '14 kitap', bg: '#F6D3D9' },
    { id: 'fc-2', name: 'Yeniden Okunacaklar', count: '6 kitap', bg: '#F5DEC0' },
    { id: 'fc-3', name: 'Yaz Okumaları', count: '9 kitap', bg: '#F5E7B8' },
    { id: 'fc-4', name: 'Şiir Köşem', count: '5 kitap', bg: '#E7D6F2' }
  ];

  const customUserChips = targetUserFolders.map(uf => ({
    id: uf.id,
    name: uf.name,
    count: `${uf.bookIds ? uf.bookIds.length : 0} kitap`,
    bg: uf.color || '#CFE3F2'
  }));

  const allChips = customUserChips.length > 0 
    ? [...customUserChips, ...defaultChips].slice(0, 12)
    : defaultChips;
  const totalCount = allChips.length;

  // Hedef kullanıcının okuduğu / okumakta olduğu kitaplar
  const userReadingRecords = (userBooks || []).filter(ub => ub.userId === targetUser?.id);
  
  const currentlyReadingList = userReadingRecords
    .filter(ub => ub.status === 'reading')
    .map(ub => ({
      ...ub,
      book: books.find(b => b.id === ub.bookId)
    }))
    .filter(item => Boolean(item.book));

  const completedBooksList = userReadingRecords
    .filter(ub => ub.status === 'read' || ub.status === 'completed')
    .map(ub => ({
      ...ub,
      book: books.find(b => b.id === ub.bookId)
    }))
    .filter(item => Boolean(item.book));

  // Hedef kullanıcının gönderileri
  const userPosts = (posts || []).filter(p => p.userId === targetUser?.id || p.author?.id === targetUser?.id);

  const colorPalette = [
    'var(--accent)',
    'var(--green)',
    'var(--orange)',
    'var(--purple)',
    'var(--red)',
    '#32ADE6',
    '#5856D6'
  ];

  const avatarUrl = targetUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&h=300&q=80';

  // Rozet belirleme
  const getRoleBadge = () => {
    if (targetUser?.role === 'founder') {
      return (
        <span className="badge badge-orange" style={{ padding: '4px 10px', fontSize: '12px' }}>
          👑 Kurucu Okur
        </span>
      );
    }
    if (targetUser?.role === 'author') {
      return (
        <span className="badge" style={{ background: '#5856D6', color: '#fff', padding: '4px 10px', fontSize: '12px' }}>
          ✍️ Onaylı Yazar
        </span>
      );
    }
    if (targetUser?.role === 'admin') {
      return (
        <span className="badge badge-purple" style={{ padding: '4px 10px', fontSize: '12px' }}>
          🛡️ Topluluk Moderatörü
        </span>
      );
    }
    if (targetUser?.isStarUser) {
      return (
        <span className="badge badge-green" style={{ padding: '4px 10px', fontSize: '12px' }}>
          ⭐ Yıldızlı Okur
        </span>
      );
    }
    return (
      <span className="badge" style={{ background: 'var(--bg-surface-elevated)', color: 'var(--text-muted)', padding: '4px 10px', fontSize: '12px' }}>
        📖 Aktif Okur
      </span>
    );
  };

  return (
    <div className="content wide" style={{ maxWidth: '980px', margin: '0 auto', paddingBottom: '60px' }}>
      
      {/* 1. BETA TEST: HIZLI PROFİL GEZİCİ VE HESAP GEÇİŞ ÇUBUĞU */}
      <div className="profile-beta-switcher-box">
        <div className="profile-beta-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="profile-beta-tag">
              <Sparkles size={13} />
              Beta Test Profil Kiti
            </span>
            <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              Test etmek istediğiniz okur/yazar profilini seçin:
            </span>
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>
            Aktif Oturum: <strong>{currentUser?.fullName}</strong> ({currentUser?.role})
          </div>
        </div>

        <div className="profile-beta-scroll-row">
          {(users || []).map(u => {
            const isCurrentView = targetUser?.id === u.id;
            const isMe = currentUser?.id === u.id;

            return (
              <button
                key={u.id}
                className={`profile-beta-user-pill ${isCurrentView ? 'active' : ''}`}
                onClick={() => setViewingUserId(u.id)}
                title={`${u.fullName} profilini incele`}
              >
                <img 
                  src={u.avatar} 
                  alt={u.fullName} 
                  style={{ width: '22px', height: '22px', borderRadius: '50%', objectFit: 'cover' }} 
                />
                <span>{u.fullName}</span>
                {u.role === 'founder' && <span style={{ fontSize: '0.7rem' }}>👑</span>}
                {u.role === 'author' && <span style={{ fontSize: '0.7rem' }}>✍️</span>}
                {isMe && <span style={{ fontSize: '0.68rem', opacity: 0.8, color: '#007AFF' }}>(Siz)</span>}
              </button>
            );
          })}
        </div>
      </div>

      {/* Başka bir kullanıcının profili inceleniyorsa: Geri Dön Butonu */}
      {!isOwnProfile && (
        <button 
          className="profile-return-banner" 
          onClick={() => setViewingUserId(null)}
        >
          <ArrowLeft size={15} />
          <span>Kendi Profilime Dön (<strong>{currentUser?.fullName}</strong>)</span>
        </button>
      )}

      {/* 2. PROFİL KAPAK BANNERI */}
      <div 
        className="cover-banner" 
        style={{
          background: targetUser?.role === 'founder'
            ? 'linear-gradient(135deg, #1C1C1E 0%, #3A2E2B 60%, #8B4A34 100%)'
            : targetUser?.role === 'author'
            ? 'linear-gradient(135deg, #182848 0%, #4b6cb7 100%)'
            : 'linear-gradient(120deg, #2D3748 0%, #455C46 50%, #8B4A34 100%)',
          position: 'relative'
        }}
      >
        <div style={{ position: 'absolute', right: '16px', bottom: '12px', fontSize: '0.78rem', color: 'rgba(255,255,255,0.75)', background: 'rgba(0,0,0,0.3)', padding: '4px 10px', borderRadius: 'var(--radius-full)', backdropFilter: 'blur(4px)' }}>
          Katılım: {targetUser?.joinedDate || 'Ocak 2025'}
        </div>
      </div>

      {/* 3. PROFİL BAŞLIĞI, AVATAR VE İSİM */}
      <div className="profile-head" style={{ justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '18px' }}>
          <div 
            className="avatar" 
            style={{ 
              width: '92px', 
              height: '92px',
              backgroundImage: `url(${avatarUrl})`,
              backgroundColor: '#8B4A34',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              border: '4px solid var(--bg)',
              boxShadow: '0 8px 24px rgba(0,0,0,0.18)'
            }} 
          />
          <div className="profile-names">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <span className="pn" style={{ fontSize: '1.45rem', fontWeight: 800 }}>{targetUser?.fullName}</span>
              {getRoleBadge()}
            </div>
            <div className="pu" style={{ fontSize: '0.9rem', color: 'var(--text-dim)' }}>
              @{targetUser?.username}
            </div>
            {targetUser?.bio && (
              <p style={{ margin: '6px 0 0', fontSize: '0.88rem', color: 'var(--text-muted)', maxWidth: '540px', lineHeight: 1.45 }}>
                {targetUser.bio}
              </p>
            )}
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '8px', flexWrap: 'wrap' }}>
              {targetUser?.favoriteGenre && (
                <span style={{ fontSize: '0.78rem', color: 'var(--text-dim)', background: 'var(--bg-surface-elevated)', padding: '2px 8px', borderRadius: '4px', border: '1px solid var(--border-subtle)' }}>
                  📚 Favori Tür: <strong>{targetUser.favoriteGenre}</strong>
                </span>
              )}
              {targetUser?.readingGoal && (
                <span style={{ fontSize: '0.78rem', color: 'var(--text-dim)', background: 'var(--bg-surface-elevated)', padding: '2px 8px', borderRadius: '4px', border: '1px solid var(--border-subtle)' }}>
                  🎯 Yıllık Hedef: <strong>{targetUser.readingGoal} Kitap</strong>
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Aksiyon Butonları */}
        <div className="profile-action-group">
          {isOwnProfile ? (
            <>
              <button 
                className="profile-action-btn primary"
                onClick={() => setIsEditProfileOpen(true)}
              >
                <Edit3 size={14} />
                Profili Düzenle
              </button>
              <button 
                className="profile-action-btn"
                onClick={() => setIsPrivacyOpen(true)}
                title="Gizlilik ve Görünürlük"
              >
                <Lock size={14} />
                Gizlilik
              </button>
              <button 
                className="profile-action-btn"
                onClick={() => setIsFoldersModalOpen(true)}
                title="Klasörleri Yönet"
              >
                <FolderPlus size={14} />
                Klasörler
              </button>
            </>
          ) : (
            <>
              <button 
                className={`profile-action-btn ${isFollowing ? '' : 'primary'}`}
                onClick={() => followUser(targetUser.id)}
              >
                {isFollowing ? (
                  <>
                    <UserCheck size={14} />
                    Takip Ediliyor
                  </>
                ) : (
                  <>
                    <UserPlus size={14} />
                    Takip Et
                  </>
                )}
              </button>

              <button 
                className="profile-action-btn"
                onClick={() => sendFriendRequest(targetUser.id)}
                disabled={isFriend}
              >
                {isFriend ? '🤝 Arkadaşsınız' : 'Arkadaş Ekle'}
              </button>

              <button
                className="profile-action-btn"
                style={{ fontSize: '0.78rem', opacity: 0.85 }}
                onClick={() => {
                  switchUser(targetUser.id);
                  showToast(`${targetUser.fullName} hesabına geçildi!`, '👤');
                }}
                title="Beta Testi: Bu kullanıcı olarak giriş yapıp arayüzü onun gözünden deneyimleyin"
              >
                Hesaba Geç (Giriş)
              </button>
            </>
          )}
        </div>
      </div>

      {/* 4. DİNAMİK İSTATİSTİK SATIRI */}
      <div className="stat-row" style={{ marginTop: '20px', display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
        <button 
          className="profile-stat-interactive"
          onClick={() => setActiveSubTab('books')} 
          title="Okunan Kitapları Gör"
        >
          <div className="sv" style={{ fontSize: '1.25rem', fontWeight: 800 }}>
            {completedBooksList.length > 0 ? completedBooksList.length : (targetUser?.readingGoal || 47)}
          </div>
          <div className="sl" style={{ fontSize: '0.78rem' }}>okuduğu kitap</div>
        </button>

        <button 
          className="profile-stat-interactive"
          onClick={() => setFollowModal({
            isOpen: true,
            title: `${targetUser?.fullName} — Takipçiler`,
            userIds: targetUser?.followers || []
          })}
          title="Takipçileri İncele"
        >
          <div className="sv" style={{ fontSize: '1.25rem', fontWeight: 800, color: '#007AFF' }}>
            {(targetUser?.followers || []).length}
          </div>
          <div className="sl" style={{ fontSize: '0.78rem' }}>takipçi</div>
        </button>

        <button 
          className="profile-stat-interactive"
          onClick={() => setFollowModal({
            isOpen: true,
            title: `${targetUser?.fullName} — Takip Edilenler`,
            userIds: targetUser?.following || []
          })}
          title="Takip Edilenleri İncele"
        >
          <div className="sv" style={{ fontSize: '1.25rem', fontWeight: 800, color: '#007AFF' }}>
            {(targetUser?.following || []).length}
          </div>
          <div className="sl" style={{ fontSize: '0.78rem' }}>takip edilen</div>
        </button>

        <div className="profile-stat-interactive" style={{ cursor: 'default' }}>
          <div className="sv" style={{ fontSize: '1.25rem', fontWeight: 800, color: '#FF9500' }}>
            {targetUser?.streak || 14} gün 🔥
          </div>
          <div className="sl" style={{ fontSize: '0.78rem' }}>okuma serisi</div>
        </div>

        <div className="profile-stat-interactive" style={{ cursor: 'default' }}>
          <div className="sv" style={{ fontSize: '1.25rem', fontWeight: 800, color: '#34C759' }}>
            {formatReadingDuration(targetUser?.totalReadingSeconds || 174960)}
          </div>
          <div className="sl" style={{ fontSize: '0.78rem' }}>toplam süre</div>
        </div>
      </div>

      {/* 5. PROFİL İÇİ SEKME BAR'I (APPLE SEGMENTED CONTROLLER) */}
      <div className="profile-subtabs-row">
        <button 
          className={`profile-subtab-btn ${activeSubTab === 'shelves' ? 'active' : ''}`}
          onClick={() => setActiveSubTab('shelves')}
        >
          <Folder size={15} />
          <span>Klasörler & Raflar</span>
        </button>

        <button 
          className={`profile-subtab-btn ${activeSubTab === 'books' ? 'active' : ''}`}
          onClick={() => setActiveSubTab('books')}
        >
          <BookOpen size={15} />
          <span>Okuma Durumu & İstekler</span>
        </button>

        <button 
          className={`profile-subtab-btn ${activeSubTab === 'calendar' ? 'active' : ''}`}
          onClick={() => setActiveSubTab('calendar')}
        >
          <CalendarIcon size={15} />
          <span>Okuma Hedefi Takvimi</span>
        </button>

        <button 
          className={`profile-subtab-btn ${activeSubTab === 'posts' ? 'active' : ''}`}
          onClick={() => setActiveSubTab('posts')}
        >
          <MessageSquare size={15} />
          <span>Gönderiler ({userPosts.length})</span>
        </button>
      </div>

      {/* 6. SEKME İÇERİKLERİ */}

      {/* SEKME 1: KLASÖRLER */}
      {activeSubTab === 'shelves' && (
        <div className="profile-section" style={{ marginTop: '10px' }}>
          <div className="profile-section-title">
            <h3>Kitap Klasörleri & Özel Raflar</h3>
            <span className="hint">{totalCount} / 12 klasör</span>
          </div>

          <div className="folder-chip-grid" style={{ gap: '16px' }}>
            {allChips.map(chip => (
              <button 
                key={chip.id}
                className="folder-chip" 
                style={{ background: chip.bg }}
                onClick={() => openFolder(chip.name)}
              >
                <div className="fn">{chip.name}</div>
                <div className="fc2">{chip.count}</div>
              </button>
            ))}

            {isOwnProfile && totalCount < 12 && (
              <button 
                className="add-folder"
                onClick={() => setIsFoldersModalOpen(true)}
              >
                + Klasör ekle
              </button>
            )}
          </div>

          {isOwnProfile && (
            <div className="color-picker-hint" style={{ marginTop: '20px' }}>
              <span className="hint" style={{ marginRight: '6px' }}>Klasör tema rengi:</span>
              {colorPalette.map((col, idx) => (
                <div 
                  key={idx}
                  className="color-dot" 
                  style={{ 
                    background: col,
                    outline: activeColorDot === col ? '2px solid var(--label)' : 'none',
                    outlineOffset: '2px'
                  }}
                  onClick={() => {
                    setActiveColorDot(col);
                    showToast(`Renk seçildi: ${col}`, '🎨');
                  }}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* SEKME 2: OKUMA LİSTESİ & İSTEKLER */}
      {activeSubTab === 'books' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '28px', marginTop: '10px' }}>
          {/* Şu Anda Okunan Kitaplar */}
          <div className="profile-section">
            <div className="profile-section-title">
              <h3>Şu Anda Okunan Kitaplar</h3>
              <span className="hint">{currentlyReadingList.length > 0 ? `${currentlyReadingList.length} kitap` : 'Devam eden okuma'}</span>
            </div>

            {currentlyReadingList.length > 0 ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
                {currentlyReadingList.map(item => {
                  const percent = Math.min(100, Math.round((item.currentPage / (item.book.pages || 300)) * 100));
                  return (
                    <div 
                      key={item.id} 
                      className="reading-book-card-item"
                      onClick={() => openBook(item.book)}
                    >
                      <div style={{ width: '60px', height: '88px', flexShrink: 0, borderRadius: '4px', overflow: 'hidden', boxShadow: '0 4px 10px rgba(0,0,0,0.15)' }}>
                        <BookCover 
                          src={item.book.cover} 
                          title={item.book.title} 
                          alt={item.book.title} 
                          style={{ width: '100%', height: '100%' }} 
                        />
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontWeight: 700, fontSize: '0.94rem', color: 'var(--text-main)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {item.book.title}
                        </div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                          {item.book.author}
                        </div>
                        <div style={{ marginTop: '10px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.74rem', color: 'var(--text-dim)', marginBottom: '4px' }}>
                            <span>%{percent}</span>
                            <span>{item.currentPage} / {item.book.pages || 300} sayfa</span>
                          </div>
                          <div style={{ width: '100%', height: '5px', background: 'rgba(0,0,0,0.08)', borderRadius: '10px', overflow: 'hidden' }}>
                            <div style={{ width: `${percent}%`, height: '100%', background: '#007AFF', borderRadius: '10px' }} />
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              /* Fallback: Dune Okuması */
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
                <div 
                  className="reading-book-card-item"
                  onClick={() => openBook(FEATURED_COVERS.dune)}
                >
                  <div style={{ width: '60px', height: '88px', flexShrink: 0, borderRadius: '4px', overflow: 'hidden', boxShadow: '0 4px 10px rgba(0,0,0,0.15)' }}>
                    <BookCover 
                      src={FEATURED_COVERS.dune.cover} 
                      title={FEATURED_COVERS.dune.title || "Dune"} 
                      alt="Dune" 
                      style={{ width: '100%', height: '100%' }} 
                    />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 700, fontSize: '0.94rem', color: 'var(--text-main)' }}>
                      Dune
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      Frank Herbert
                    </div>
                    <div style={{ marginTop: '10px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.74rem', color: 'var(--text-dim)', marginBottom: '4px' }}>
                        <span>%35</span>
                        <span>248 / 712 sayfa</span>
                      </div>
                      <div style={{ width: '100%', height: '5px', background: 'rgba(0,0,0,0.08)', borderRadius: '10px', overflow: 'hidden' }}>
                        <div style={{ width: '35%', height: '100%', background: '#007AFF', borderRadius: '10px' }} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* İstek Listem (Orijinal Gerçek Kitap Kapakları) */}
          <div className="profile-section">
            <div className="profile-section-title">
              <h3>İstek Listesi & Tavsiyeler</h3>
              <span className="hint">1:1 Orijinal Kapaklar</span>
            </div>
            <div className="wishlist-row">
              {/* Körlük */}
              <div 
                className="cv" 
                onClick={() => openBook(FEATURED_COVERS.korluk)}
                style={{ cursor: 'pointer', overflow: 'hidden', padding: 0 }} 
                title="Körlük — José Saramago"
              >
                <BookCover 
                  src={FEATURED_COVERS.korluk.cover} 
                  title={FEATURED_COVERS.korluk.title || "Körlük"} 
                  alt="Körlük" 
                  style={{ width: '100%', height: '100%' }} 
                />
              </div>

              {/* Dune */}
              <div 
                className="cv" 
                onClick={() => openBook(FEATURED_COVERS.dune)}
                style={{ cursor: 'pointer', overflow: 'hidden', padding: 0 }} 
                title="Dune — Frank Herbert"
              >
                <BookCover 
                  src={FEATURED_COVERS.dune.cover} 
                  title={FEATURED_COVERS.dune.title || "Dune"} 
                  alt="Dune" 
                  style={{ width: '100%', height: '100%' }} 
                />
              </div>

              {/* Dönüşüm */}
              <div 
                className="cv" 
                onClick={() => openBook(FEATURED_COVERS.donusum)}
                style={{ cursor: 'pointer', overflow: 'hidden', padding: 0 }} 
                title="Dönüşüm — Franz Kafka"
              >
                <BookCover 
                  src={FEATURED_COVERS.donusum.cover} 
                  title={FEATURED_COVERS.donusum.title || "Dönüşüm"} 
                  alt="Dönüşüm" 
                  style={{ width: '100%', height: '100%' }} 
                />
              </div>

              {/* 1984 */}
              <div 
                className="cv" 
                onClick={() => openBook(FEATURED_COVERS.george_1984)}
                style={{ cursor: 'pointer', overflow: 'hidden', padding: 0 }} 
                title="1984 — George Orwell"
              >
                <BookCover 
                  src={FEATURED_COVERS.george_1984.cover} 
                  title={FEATURED_COVERS.george_1984.title || "1984"} 
                  alt="1984" 
                  style={{ width: '100%', height: '100%' }} 
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SEKME 3: AYLIK OKUMA HEDEFİ TAKVİMİ */}
      {activeSubTab === 'calendar' && (
        <div style={{ marginTop: '10px' }}>
          <ReadingGoalCalendar user={targetUser} />
        </div>
      )}

      {/* SEKME 4: GÖNDERİLER & NOTLAR */}
      {activeSubTab === 'posts' && (
        <div className="profile-section" style={{ marginTop: '10px' }}>
          <div className="profile-section-title">
            <h3>{targetUser?.fullName} tarafından paylaşılan gönderiler</h3>
            {isOwnProfile && (
              <button 
                className="btn btn-sm btn-primary"
                onClick={() => setIsCreatePostOpen(true)}
              >
                <Plus size={13} />
                Yeni Gönderi
              </button>
            )}
          </div>

          {userPosts.length > 0 ? (
            <div className="profile-posts-section">
              {userPosts.map(p => (
                <PostCard key={p.id} post={p} />
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '40px 20px', background: 'var(--bg-surface-elevated)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>📖</div>
              <h4 style={{ margin: '0 0 6px', color: 'var(--text-main)', fontSize: '1.1rem' }}>
                Henüz Paylaşılmış Gönderi Yok
              </h4>
              <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)', maxWidth: '400px', margin: '0 auto 16px' }}>
                {isOwnProfile 
                  ? 'Okuduğunuz kitaplardan kenar notları alabilir ve topluluk akışında düşüncelerinizi paylaşabilirsiniz.' 
                  : `${targetUser?.fullName} henüz bir kenar notu veya kitap incelemesi paylaşmadı.`}
              </p>
              {isOwnProfile && (
                <button 
                  className="btn btn-primary btn-sm"
                  onClick={() => setIsCreatePostOpen(true)}
                >
                  <Plus size={14} />
                  İlk Notunuzu Paylaşın
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {/* 7. TAKİPÇİ & TAKİP EDİLENLER MODALI */}
      <FollowListModal
        isOpen={followModal.isOpen}
        onClose={() => setFollowModal(prev => ({ ...prev, isOpen: false }))}
        title={followModal.title}
        userIds={followModal.userIds}
      />
    </div>
  );
};
