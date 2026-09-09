import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  UserPlus, 
  UserCheck, 
  Sparkles, 
  Star, 
  Flame, 
  Clock, 
  BookOpen, 
  ArrowRight,
  Shield,
  Filter
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const ProfilesDirectoryView = () => {
  const { 
    users, 
    currentUser, 
    setViewingUserId, 
    setActiveTab, 
    followUser, 
    switchUser,
    userBooks,
    showToast 
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState('all'); // 'all' | 'author' | 'founder' | 'user'

  // Kullanıcıları filtrele
  const filteredUsers = (users || []).filter(u => {
    const matchesSearch = 
      (u.fullName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (u.username || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (u.bio || '').toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (filterRole === 'all') return true;
    if (filterRole === 'author') return u.role === 'author';
    if (filterRole === 'founder') return u.role === 'founder' || u.role === 'admin';
    if (filterRole === 'user') return u.role === 'user' || !u.role;
    return true;
  });

  const getRoleBadge = (user) => {
    if (user.role === 'founder') {
      return (
        <span className="badge badge-orange" style={{ padding: '3px 8px', fontSize: '11px' }}>
          👑 Kurucu Okur
        </span>
      );
    }
    if (user.role === 'author') {
      return (
        <span className="badge" style={{ background: '#5856D6', color: '#fff', padding: '3px 8px', fontSize: '11px' }}>
          ✍️ Onaylı Yazar
        </span>
      );
    }
    if (user.role === 'admin') {
      return (
        <span className="badge badge-purple" style={{ padding: '3px 8px', fontSize: '11px' }}>
          🛡️ Moderatör
        </span>
      );
    }
    if (user.isStarUser) {
      return (
        <span className="badge badge-green" style={{ padding: '3px 8px', fontSize: '11px' }}>
          ⭐ Yıldızlı Okur
        </span>
      );
    }
    return (
      <span className="badge" style={{ background: 'var(--bg-surface-elevated)', color: 'var(--text-muted)', padding: '3px 8px', fontSize: '11px' }}>
        📖 Aktif Okur
      </span>
    );
  };

  const handleProfileClick = (userId) => {
    setViewingUserId(userId);
    setActiveTab('profile');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="content wide" style={{ maxWidth: '1080px', margin: '0 auto', paddingBottom: '60px' }}>
      
      {/* 1. ÜST BAŞLIK & AÇIKLAMA */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h1 style={{ margin: 0, fontSize: '1.65rem', fontWeight: 800, color: 'var(--text-main)' }}>
              Okur & Yazar Profilleri
            </h1>
            <p style={{ margin: '4px 0 0', fontSize: '0.92rem', color: 'var(--text-muted)' }}>
              Kenar topluluğundaki tüm kurucuları, yazarları, moderatörleri ve aktif okurları keşfedin.
            </p>
          </div>
          <div style={{ fontSize: '0.82rem', color: 'var(--text-dim)', background: 'var(--bg-surface-elevated)', border: '1px solid var(--border-subtle)', padding: '6px 14px', borderRadius: 'var(--radius-full)' }}>
            Toplam <strong>{(users || []).length}</strong> Kayıtlı Profil
          </div>
        </div>

        {/* Arama ve Filtre Çubuğu */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap', marginTop: '12px' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: '260px' }}>
            <Search size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }} />
            <input 
              type="text" 
              placeholder="İsim, kullanıcı adı veya biyografi ile profil ara..." 
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 14px 10px 40px',
                borderRadius: 'var(--radius-full)',
                border: '1px solid var(--border-subtle)',
                background: 'var(--bg-surface)',
                color: 'var(--text-main)',
                fontSize: '0.88rem'
              }}
            />
          </div>

          {/* Filtre Butonları */}
          <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '2px' }}>
            {[
              { id: 'all', label: 'Tüm Profiller' },
              { id: 'author', label: '✍️ Yazarlar' },
              { id: 'founder', label: '👑 Kurucular & Adminler' },
              { id: 'user', label: '📖 Okurlar' }
            ].map(tab => (
              <button
                key={tab.id}
                className={`btn btn-sm ${filterRole === tab.id ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setFilterRole(tab.id)}
                style={{ fontSize: '0.82rem', whiteSpace: 'nowrap', borderRadius: 'var(--radius-full)', padding: '6px 14px' }}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 2. PROFİL KARTLARI IZGARASI (GRID) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '18px' }}>
        {filteredUsers.map(user => {
          const isMe = user.id === currentUser?.id;
          const isFollowing = (currentUser?.following || []).includes(user.id);
          const userReadCount = (userBooks || []).filter(ub => ub.userId === user.id && (ub.status === 'read' || ub.status === 'completed')).length || user.readingGoal || 12;

          return (
            <div 
              key={user.id}
              style={{
                background: 'var(--bg-surface)',
                border: isMe ? '2px solid var(--color-primary)' : '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-xl, 16px)',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                boxShadow: 'var(--shadow-sm)',
                transition: 'all 0.2s ease'
              }}
              className="profile-directory-card"
            >
              {/* Kart Kapak Şeridi */}
              <div 
                style={{
                  height: '70px',
                  background: user.role === 'founder'
                    ? 'linear-gradient(135deg, #1C1C1E 0%, #8B4A34 100%)'
                    : user.role === 'author'
                    ? 'linear-gradient(135deg, #182848 0%, #4b6cb7 100%)'
                    : 'linear-gradient(120deg, #2D3748 0%, #455C46 100%)',
                  position: 'relative'
                }}
              >
                {isMe && (
                  <span style={{ position: 'absolute', right: '12px', top: '10px', background: 'rgba(0,0,0,0.5)', color: '#fff', fontSize: '0.72rem', padding: '2px 8px', borderRadius: 'var(--radius-full)', backdropFilter: 'blur(4px)' }}>
                    Aktif Profiliniz
                  </span>
                )}
              </div>

              {/* Kart Gövdesi */}
              <div style={{ padding: '0 18px 18px', display: 'flex', flexDirection: 'column', flex: 1, position: 'relative' }}>
                
                {/* Avatar ve Rozet Satırı */}
                <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginTop: '-36px', marginBottom: '10px' }}>
                  <img 
                    src={user.avatar} 
                    alt={user.fullName} 
                    style={{
                      width: '68px',
                      height: '68px',
                      borderRadius: '50%',
                      objectFit: 'cover',
                      border: '3px solid var(--bg-surface)',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.18)',
                      background: 'var(--bg-surface-elevated)'
                    }}
                  />
                  {getRoleBadge(user)}
                </div>

                {/* İsim ve Kullanıcı Adı */}
                <div 
                  onClick={() => handleProfileClick(user.id)}
                  style={{ cursor: 'pointer' }}
                >
                  <h3 style={{ margin: '0', fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    {user.fullName}
                  </h3>
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-dim)', marginTop: '2px' }}>
                    @{user.username}
                  </div>
                </div>

                {/* Biyografi */}
                <p style={{ margin: '8px 0 12px', fontSize: '0.84rem', color: 'var(--text-muted)', lineHeight: 1.45, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', minHeight: '36px' }}>
                  {user.bio || 'Sakin okumalar ve kenar notları.'}
                </p>

                {/* İstatistik Çipleri */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '14px', fontSize: '0.78rem', color: 'var(--text-dim)' }}>
                  <span style={{ background: 'var(--bg-surface-elevated)', padding: '3px 8px', borderRadius: '6px', border: '1px solid var(--border-subtle)' }}>
                    📚 <strong>{userReadCount}</strong> kitap
                  </span>
                  <span style={{ background: 'var(--bg-surface-elevated)', padding: '3px 8px', borderRadius: '6px', border: '1px solid var(--border-subtle)' }}>
                    👥 <strong>{(user.followers || []).length}</strong> takipçi
                  </span>
                  {user.streak && (
                    <span style={{ background: 'var(--bg-surface-elevated)', padding: '3px 8px', borderRadius: '6px', border: '1px solid var(--border-subtle)', color: '#FF9500' }}>
                      🔥 <strong>{user.streak}</strong> gün
                    </span>
                  )}
                </div>

                {/* Alt Aksiyon Butonları */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: 'auto', paddingTop: '10px', borderTop: '1px solid var(--border-subtle)' }}>
                  <button 
                    className="btn btn-primary btn-sm"
                    style={{ flex: 1, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '0.82rem' }}
                    onClick={() => handleProfileClick(user.id)}
                  >
                    Profili İncele
                    <ArrowRight size={13} />
                  </button>

                  {!isMe && (
                    <button 
                      className={`btn btn-sm ${isFollowing ? 'btn-secondary' : 'btn-secondary'}`}
                      style={{ fontSize: '0.82rem', padding: '6px 12px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                      onClick={() => followUser(user.id)}
                    >
                      {isFollowing ? (
                        <>
                          <UserCheck size={13} color="#34C759" />
                          Takipte
                        </>
                      ) : (
                        <>
                          <UserPlus size={13} />
                          Takip Et
                        </>
                      )}
                    </button>
                  )}

                  {!isMe && (
                    <button
                      className="btn btn-secondary btn-sm"
                      style={{ fontSize: '0.75rem', opacity: 0.85, padding: '6px 10px' }}
                      onClick={() => {
                        switchUser(user.id);
                        showToast(`${user.fullName} hesabına geçildi!`, '👤');
                      }}
                      title="Beta Test: Bu hesap olarak giriş yap"
                    >
                      Giriş
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
