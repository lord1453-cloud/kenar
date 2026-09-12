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
  Plus,
  Trash2,
  FolderOpen
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { FEATURED_COVERS } from '../../data/featuredBooksCovers';
import { BookCover } from '../common/BookCover';
import { ReadingGoalCalendar } from './ReadingGoalCalendar';
import { FollowListModal } from './FollowListModal';
import { PostCard } from '../feed/PostCard';
import { APPLE_FOLDER_COLORS } from './ProfileFoldersModal';
import '../../styles/research-folders.css';

export const ProfileView = () => {
  const { 
    users,
    currentUser, 
    currentUserId,
    viewingUserId,
    setViewingUserId,
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
    removeUserBook,
    removeFromWishlist,
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
  const [tabHistory, setTabHistory] = useState(['shelves']);

  const handleTabChange = (newTab) => {
    if (newTab !== activeSubTab) {
      setTabHistory(prev => [...prev, newTab]);
      setActiveSubTab(newTab);
    }
  };

  const handleGoBack = () => {
    if (tabHistory.length > 1) {
      const nextHist = [...tabHistory];
      nextHist.pop();
      const prevTab = nextHist[nextHist.length - 1];
      setTabHistory(nextHist);
      setActiveSubTab(prevTab);
    } else if (!isOwnProfile) {
      setViewingUserId(null);
    } else {
      setActiveSubTab('shelves');
    }
  };

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

  // Hedef kullanıcının klasörleri (Yalnızca kullanıcının eklediği klasörler)
  const targetUserFolders = (userFolders || []).filter(f => f.userId === targetUser?.id);

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

  // İstek Listesi
  const wishlistItems = userReadingRecords
    .filter(ub => ub.status === 'to_read')
    .map(ub => ({
      ...ub,
      book: books.find(b => b.id === ub.bookId)
    }))
    .filter(item => Boolean(item.book));

  // Hedef kullanıcının gönderileri
  const userPosts = (posts || []).filter(p => p.userId === targetUser?.id || p.author?.id === targetUser?.id);

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
          🛡️ Topluluk Yöneticisi
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

  // YÖNETİCİ PROFİLİ GİZLİLİĞİ: Yöneticinin yalnızca kendine açık profili var. Kullanıcılar, onu sadece ana akışta, veya bildirilerde görebilir.
  if ((targetUser?.role === 'admin' || targetUser?.role === 'founder') && !isOwnProfile) {
    return (
      <div className="content wide" style={{ maxWidth: '640px', margin: '40px auto', textAlign: 'center', padding: '50px 24px', background: 'var(--bg-surface)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-subtle)', boxShadow: '0 8px 30px rgba(0,0,0,0.08)' }}>
        <div style={{ width: '68px', height: '68px', borderRadius: '50%', background: 'rgba(245, 158, 11, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
          <Shield size={34} color="#f59e0b" />
        </div>
        <h3 style={{ fontSize: '1.35rem', fontWeight: 800, margin: '0 0 8px', color: 'var(--text-main)' }}>
          Yönetici Profili Gizlidir
        </h3>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', maxWidth: '440px', margin: '0 auto 24px', lineHeight: 1.55 }}>
          Yöneticinin yalnızca kendine açık bir profili bulunmaktadır. Kullanıcılar yöneticileri yalnızca ana akışta ve paylaştıkları resmi bildirilerde görebilir.
        </p>
        <button 
          className="btn btn-primary"
          onClick={() => setViewingUserId(null)}
          style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '9px 20px', borderRadius: 'var(--radius-full)' }}
        >
          <ArrowLeft size={16} />
          <span>Kendi Profilime Dön</span>
        </button>
      </div>
    );
  }

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
                onClick={() => {
                  setViewingUserId(u.id);
                  setTabHistory(['shelves']);
                  setActiveSubTab('shelves');
                }}
                title={`${u.fullName} profilini incele`}
              >
                <img 
                  src={u.avatar} 
                  alt={u.fullName} 
                  style={{ 
                    width: '22px', 
                    height: '22px', 
                    borderRadius: '50%', 
                    objectFit: 'cover',
                    filter: u.isBlurred ? 'blur(4px)' : 'none'
                  }} 
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

      {/* GERİ TUŞU: Herhangi bir alt sekmedeyken veya başka profildeyken daima belirir */}
      {(activeSubTab !== 'shelves' || !isOwnProfile || tabHistory.length > 1) && (
        <div style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
          <button 
            className="btn btn-secondary profile-back-btn" 
            onClick={handleGoBack}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 18px',
              borderRadius: 'var(--radius-full)',
              fontWeight: 700,
              fontSize: '0.88rem',
              background: 'var(--bg-surface-elevated)',
              border: '1px solid var(--border-strong)',
              boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
              cursor: 'pointer'
            }}
          >
            <ArrowLeft size={16} />
            <span>Geri</span>
            {activeSubTab !== 'shelves' && (
              <span style={{ fontSize: '0.78rem', color: 'var(--text-dim)', marginLeft: '4px' }}>
                ({activeSubTab === 'books' ? 'Okuma Durumu' : activeSubTab === 'calendar' ? 'Takvim' : 'Gönderiler'})
              </span>
            )}
          </button>

          {!isOwnProfile && (
            <button 
              className="btn btn-ghost btn-sm"
              onClick={() => {
                setViewingUserId(null);
                setTabHistory(['shelves']);
                setActiveSubTab('shelves');
              }}
              style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}
            >
              Kendi Profilime Dön (<strong>{currentUser?.fullName}</strong>)
            </button>
          )}
        </div>
      )}

      {/* 2. PROFİL BAŞLIĞI (KAPAK FOTOĞRAFI KALDIRILDI, YALNIZCA ZARİF PROFİL FOTOĞRAFI) */}
      <div 
        className="profile-head-clean" 
        style={{
          background: 'var(--bg-surface)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-subtle)',
          padding: '24px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
          marginBottom: '20px'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '20px', flexWrap: 'wrap' }}>
            <div style={{ position: 'relative' }}>
              <div 
                className="avatar" 
                style={{ 
                  width: '96px', 
                  height: '96px',
                  backgroundImage: `url(${avatarUrl})`,
                  backgroundColor: '#8B4A34',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  borderRadius: '50%',
                  border: '3px solid var(--color-primary)',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                  filter: targetUser?.isBlurred ? 'blur(12px)' : 'none',
                  transition: 'filter 0.3s ease'
                }} 
              />
              {targetUser?.isBlurred && (
                <div style={{
                  position: 'absolute',
                  bottom: '-6px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  background: 'rgba(234, 179, 8, 0.95)',
                  color: '#111',
                  fontSize: '0.66rem',
                  fontWeight: 800,
                  padding: '2px 8px',
                  borderRadius: '999px',
                  whiteSpace: 'nowrap',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.2)'
                }}>
                  🛡️ Filtrelendi
                </div>
              )}
            </div>

            <div className="profile-names" style={{ flex: 1, minWidth: '240px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                <span className="pn" style={{ fontSize: '1.45rem', fontWeight: 800 }}>{targetUser?.fullName}</span>
                {getRoleBadge()}
              </div>
              <div className="pu" style={{ fontSize: '0.9rem', color: 'var(--text-dim)', marginTop: '2px' }}>
                @{targetUser?.username} • Katılım: {targetUser?.joinedDate || 'Ocak 2025'}
              </div>
              
              {/* Okur Mottosu / Edebi Alıntı */}
              {targetUser?.motto && (
                <div style={{ margin: '8px 0 4px', fontSize: '0.92rem', fontStyle: 'italic', color: 'var(--label)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ color: 'var(--orange)' }}>“</span>
                  <span>{targetUser.motto}</span>
                  <span style={{ color: 'var(--orange)' }}>”</span>
                </div>
              )}

              {targetUser?.bio && (
                <p style={{ margin: '4px 0 0', fontSize: '0.88rem', color: 'var(--text-muted)', maxWidth: '540px', lineHeight: 1.45 }}>
                  {targetUser.bio}
                </p>
              )}
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '10px', flexWrap: 'wrap' }}>
                {targetUser?.favoriteGenre && (
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-dim)', background: 'var(--bg-surface-elevated)', padding: '3px 10px', borderRadius: '6px', border: '1px solid var(--border-subtle)' }}>
                    📚 Favori Tür: <strong>{targetUser.favoriteGenre}</strong>
                  </span>
                )}
                {targetUser?.readingGoal && (
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-dim)', background: 'var(--bg-surface-elevated)', padding: '3px 10px', borderRadius: '6px', border: '1px solid var(--border-subtle)' }}>
                    🎯 Yıllık Hedef: <strong>{targetUser.readingGoal} Kitap</strong>
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Aksiyon Butonları */}
          <div className="profile-action-group" style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
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
              </>
            )}
          </div>
        </div>

        {/* DİNAMİK İSTATİSTİK SATIRI */}
        <div className="stat-row" style={{ marginTop: '24px', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <button 
            className="profile-stat-interactive"
            onClick={() => handleTabChange('books')} 
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
              {targetUser?.followersCount || (targetUser?.followers || []).length}
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
      </div>

      {/* 3. PROFİL İÇİ SEKME BAR'I (RESPONSIVE SEGMENTED CONTROLLER) */}
      <div className="profile-subtabs-row" style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
        <button 
          className={`profile-subtab-btn ${activeSubTab === 'shelves' ? 'active' : ''}`}
          onClick={() => handleTabChange('shelves')}
        >
          <Folder size={15} />
          <span>Klasörler & Raflar</span>
        </button>

        <button 
          className={`profile-subtab-btn ${activeSubTab === 'books' ? 'active' : ''}`}
          onClick={() => handleTabChange('books')}
        >
          <BookOpen size={15} />
          <span>Okuma Durumu & İstekler</span>
        </button>

        <button 
          className={`profile-subtab-btn ${activeSubTab === 'calendar' ? 'active' : ''}`}
          onClick={() => handleTabChange('calendar')}
        >
          <CalendarIcon size={15} />
          <span>Okuma Hedefi Takvimi</span>
        </button>

        <button 
          className={`profile-subtab-btn ${activeSubTab === 'posts' ? 'active' : ''}`}
          onClick={() => handleTabChange('posts')}
        >
          <MessageSquare size={15} />
          <span>Gönderiler ({userPosts.length})</span>
        </button>
      </div>

      {/* 4. SEKME İÇERİKLERİ */}

      {/* SEKME 1: KLASÖRLER (YALNIZCA GERÇEK KULLANICI KLASÖRLERİ & 3D CEP İÇİ KİTAPLI TASARIM) */}
      {activeSubTab === 'shelves' && (
        <div className="profile-section" style={{ marginTop: '16px' }}>
          <div className="profile-section-title" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800 }}>Kitap Klasörleri & Özel Raflar</h3>
              <span className="hint" style={{ fontSize: '0.82rem', color: 'var(--text-dim)' }}>
                {targetUserFolders.length} / 12 Klasör Tanımlı
              </span>
            </div>

            {isOwnProfile && targetUserFolders.length < 12 && (
              <button 
                className="btn btn-primary btn-sm"
                onClick={() => setIsFoldersModalOpen(true)}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
              >
                <Plus size={14} />
                <span>Yeni Klasör Oluştur</span>
              </button>
            )}
          </div>

          {targetUserFolders.length > 0 ? (
            <div className="folders-grid" style={{ padding: '16px 0', gap: '28px 24px' }}>
              {targetUserFolders.map((folder, idx) => {
                const folderColorObj = APPLE_FOLDER_COLORS.find(c => c.hex.toLowerCase() === (folder.color || '').toLowerCase()) || APPLE_FOLDER_COLORS[idx % APPLE_FOLDER_COLORS.length];
                const folderBooks = (folder.bookIds || []).map(bId => books.find(b => b.id === bId)).filter(Boolean);
                const topCovers = folderBooks.slice(0, 3);

                return (
                  <div
                    key={folder.id}
                    className="folder-card"
                    onClick={() => setIsFoldersModalOpen(true)}
                    style={{
                      '--folder-front-color': folderColorObj.hex,
                      '--folder-back-color': folderColorObj.backHex,
                      cursor: 'pointer'
                    }}
                  >
                    {/* 3D Physical Folder Illustration */}
                    <div className="folder-stage">
                      <div className="folder-back">
                        <div className="folder-tab"></div>
                      </div>

                      <div className="folder-tucked-books">
                        {topCovers.map(b => (
                          <BookCover
                            key={b.id}
                            src={b.cover}
                            title={b.title}
                            alt={b.title}
                            className="tucked-book-cover"
                          />
                        ))}
                        {topCovers.length === 0 && (
                          <div style={{
                            width: '56px',
                            height: '84px',
                            background: 'rgba(255,255,255,0.4)',
                            borderRadius: '4px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#666',
                            fontSize: '0.7rem'
                          }}>
                            Boş
                          </div>
                        )}
                      </div>

                      <div className="folder-front">
                        <span className="folder-front-badge">
                          {folderBooks.length} Kitap
                        </span>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', marginTop: '12px' }}>
                      <span className="folder-label" style={{ margin: 0, fontWeight: 700, fontSize: '0.96rem', color: 'var(--text-main)' }}>
                        {folder.name}
                      </span>
                    </div>

                    <span className="folder-count-text" style={{ fontSize: '0.78rem', color: 'var(--text-dim)', marginTop: '4px' }}>
                      {folderBooks.length} kitap • Düzenlemek için tıkla
                    </span>
                  </div>
                );
              })}
            </div>
          ) : (
            <div style={{
              textAlign: 'center',
              padding: '48px 20px',
              background: 'var(--bg-surface-elevated)',
              borderRadius: 'var(--radius-lg)',
              border: '1px dashed var(--border-strong)',
              marginTop: '16px'
            }}>
              <FolderOpen size={40} color="#007AFF" style={{ marginBottom: '12px' }} />
              <h4 style={{ margin: '0 0 6px', fontSize: '1.1rem', color: 'var(--text-main)' }}>
                Henüz Kitap Klasörü Oluşturulmamış
              </h4>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', maxWidth: '420px', margin: '0 auto 16px' }}>
                {isOwnProfile 
                  ? 'Okuduğunuz veya planladığınız kitapları Apple renk paletiyle cepli 3D klasörlerde organize edin.' 
                  : `${targetUser?.fullName} henüz özel bir kitap klasörü oluşturmadı.`}
              </p>
              {isOwnProfile && (
                <button 
                  className="btn btn-primary btn-sm"
                  onClick={() => setIsFoldersModalOpen(true)}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                >
                  <Plus size={15} />
                  <span>İlk Klasörünüzü Oluşturun</span>
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {/* SEKME 2: OKUMA LİSTESİ & İSTEKLER (SİLME SEÇENEĞİ VE DİNAMİK İSTEK LİSTESİ) */}
      {activeSubTab === 'books' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '28px', marginTop: '16px' }}>
          
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
                      style={{ position: 'relative' }}
                    >
                      <div style={{ width: '64px', height: '94px', flexShrink: 0, borderRadius: '4px', overflow: 'hidden', boxShadow: '0 4px 10px rgba(0,0,0,0.15)' }}>
                        <BookCover 
                          src={item.book.cover} 
                          title={item.book.title} 
                          alt={item.book.title} 
                          style={{ width: '100%', height: '100%' }} 
                        />
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
                          <div style={{ fontWeight: 700, fontSize: '0.94rem', color: 'var(--text-main)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {item.book.title}
                          </div>
                          {isOwnProfile && (
                            <button
                              className="btn-ghost btn-sm"
                              style={{ padding: '2px 6px', color: 'var(--color-danger)' }}
                              title="Okuma listesinden kaldır"
                              onClick={(e) => {
                                e.stopPropagation();
                                if (window.confirm(`"${item.book.title}" kitabını okuma listenizden silmek istiyor musunuz?`)) {
                                  removeUserBook(item.book.id);
                                }
                              }}
                            >
                              <Trash2 size={13} />
                            </button>
                          )}
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
              <div style={{ padding: '24px', textAlign: 'center', background: 'var(--bg-surface-elevated)', borderRadius: 'var(--radius-md)', color: 'var(--text-muted)', fontSize: '0.88rem' }}>
                Şu an aktif okunan kitap bulunmuyor.
              </div>
            )}
          </div>

          {/* Tamamlanan Okunan Kitaplar */}
          <div className="profile-section">
            <div className="profile-section-title">
              <h3>Tamamlanan & Okunmuş Kitaplar</h3>
              <span className="hint">{completedBooksList.length} kitap</span>
            </div>

            {completedBooksList.length > 0 ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
                {completedBooksList.map(item => (
                  <div 
                    key={item.id} 
                    className="reading-book-card-item"
                    onClick={() => openBook(item.book)}
                    style={{ position: 'relative' }}
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
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
                        <div style={{ fontWeight: 700, fontSize: '0.94rem', color: 'var(--text-main)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {item.book.title}
                        </div>
                        {isOwnProfile && (
                          <button
                            className="btn-ghost btn-sm"
                            style={{ padding: '2px 6px', color: 'var(--color-danger)' }}
                            title="Okunanlar listesinden kaldır"
                            onClick={(e) => {
                              e.stopPropagation();
                              if (window.confirm(`"${item.book.title}" kitabını listenizden silmek istiyor musunuz?`)) {
                                removeUserBook(item.book.id);
                              }
                            }}
                          >
                            <Trash2 size={13} />
                          </button>
                        )}
                      </div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        {item.book.author}
                      </div>
                      <div style={{ marginTop: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span className="badge badge-green" style={{ fontSize: '0.72rem', padding: '2px 8px' }}>
                          ✓ Okundu
                        </span>
                        {item.finishDate && (
                          <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>
                            {item.finishDate}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ padding: '24px', textAlign: 'center', background: 'var(--bg-surface-elevated)', borderRadius: 'var(--radius-md)', color: 'var(--text-muted)', fontSize: '0.88rem' }}>
                Henüz tamamlanmış kitap kaydı yok.
              </div>
            )}
          </div>

          {/* İstek Listesi & Tavsiyeler (SİLME SEÇENEĞİ İLE) */}
          <div className="profile-section">
            <div className="profile-section-title">
              <h3>İstek Listesi & Tavsiyeler</h3>
              <span className="hint">{wishlistItems.length} kitap</span>
            </div>

            {wishlistItems.length > 0 ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px' }}>
                {wishlistItems.map(item => (
                  <div 
                    key={item.id}
                    style={{
                      background: 'var(--bg-surface)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: 'var(--radius-md)',
                      padding: '12px',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      textAlign: 'center',
                      position: 'relative',
                      cursor: 'pointer'
                    }}
                    onClick={() => openBook(item.book)}
                  >
                    <div style={{ width: '84px', height: '124px', borderRadius: '4px', overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.15)', marginBottom: '10px' }}>
                      <BookCover 
                        src={item.book.cover} 
                        title={item.book.title} 
                        alt={item.book.title} 
                        style={{ width: '100%', height: '100%' }} 
                      />
                    </div>
                    <div style={{ fontWeight: 700, fontSize: '0.88rem', color: 'var(--text-main)', maxWidth: '100%', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {item.book.title}
                    </div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)', marginBottom: '10px' }}>
                      {item.book.author}
                    </div>

                    {isOwnProfile && (
                      <button
                        className="btn btn-ghost btn-sm"
                        style={{ 
                          width: '100%', 
                          fontSize: '0.76rem', 
                          color: 'var(--color-danger)', 
                          display: 'inline-flex', 
                          alignItems: 'center', 
                          justifyContent: 'center', 
                          gap: '6px',
                          borderTop: '1px solid var(--border-subtle)',
                          paddingTop: '6px'
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          removeFromWishlist(item.book.id);
                        }}
                      >
                        <Trash2 size={13} />
                        <span>İsteklerden Sil</span>
                      </button>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              /* Fallback vitrini */
              <div style={{ padding: '24px', textAlign: 'center', background: 'var(--bg-surface-elevated)', borderRadius: 'var(--radius-md)', color: 'var(--text-muted)', fontSize: '0.88rem' }}>
                İstek sepetinizde henüz kitap bulunmuyor. Keşfet bölümündeki veya gönderilerdeki '+' butonuna basarak kitap ekleyebilirsiniz.
              </div>
            )}
          </div>
        </div>
      )}

      {/* SEKME 3: AYLIK OKUMA HEDEFİ TAKVİMİ */}
      {activeSubTab === 'calendar' && (
        <div style={{ marginTop: '16px' }}>
          <ReadingGoalCalendar user={targetUser} />
        </div>
      )}

      {/* SEKME 4: GÖNDERİLER & NOTLAR */}
      {activeSubTab === 'posts' && (
        <div className="profile-section" style={{ marginTop: '16px' }}>
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

      {/* 5. TAKİPÇİ & TAKİP EDİLENLER MODALI */}
      <FollowListModal
        isOpen={followModal.isOpen}
        onClose={() => setFollowModal(prev => ({ ...prev, isOpen: false }))}
        title={followModal.title}
        userIds={followModal.userIds}
      />
    </div>
  );
};
