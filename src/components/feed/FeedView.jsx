import React from 'react';
import { useApp } from '../../context/AppContext';
import { PostCard } from './PostCard';
import { Sparkles, Users, ArrowRight, BookOpen } from 'lucide-react';

export const FeedView = () => {
  const { 
    posts, 
    users, 
    currentUser, 
    setViewingUserId, 
    setActiveTab, 
    setIsCreatePostOpen 
  } = useApp();

  const handleOpenProfile = (userId) => {
    setViewingUserId(userId);
    setActiveTab('profile');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Sıralama: Sabitlenenler en başta, sonra tarihe göre
  const sortedPosts = [...(posts || [])].sort((a, b) => {
    if (a.isAnnouncement) return -1;
    if (b.isAnnouncement) return 1;
    return 0;
  });

  return (
    <div className="content" style={{ maxWidth: '680px', margin: '0 auto', paddingBottom: '70px' }}>
      
      {/* 1. AKTİF OKURLAR & YAZARLAR HİKAYE ÇEMBERİ (Profile Stories Bar) */}
      <div 
        className="feed-readers-carousel"
        style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-lg)',
          padding: '14px 16px',
          marginBottom: '20px',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)' }}>
            <Sparkles size={15} color="var(--color-primary, #C88A58)" />
            <span>Okurlar & Yazarlar</span>
          </div>
          <button
            onClick={() => setActiveTab('profiles')}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--color-primary, #C88A58)',
              fontSize: '0.78rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <span>Tümünü Keşfet</span>
            <ArrowRight size={13} />
          </button>
        </div>

        {/* Yatay Kayan Okur Avatarları */}
        <div 
          style={{
            display: 'flex',
            gap: '14px',
            overflowX: 'auto',
            paddingBottom: '4px',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none'
          }}
        >
          {/* Kullanıcının Kendi Profili */}
          <div 
            onClick={() => handleOpenProfile(currentUser?.id)}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '6px',
              cursor: 'pointer',
              flexShrink: 0,
              width: '64px'
            }}
            title="Kendi Profilinize Git"
          >
            <div style={{ position: 'relative' }}>
              <img
                src={currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150&q=80'}
                alt={currentUser?.fullName || 'Siz'}
                style={{
                  width: '52px',
                  height: '52px',
                  borderRadius: '50%',
                  objectFit: 'cover',
                  border: '2px solid var(--color-primary, #C88A58)',
                  padding: '2px'
                }}
              />
              <span 
                style={{
                  position: 'absolute',
                  bottom: '1px',
                  right: '1px',
                  width: '12px',
                  height: '12px',
                  borderRadius: '50%',
                  backgroundColor: '#10b981',
                  border: '2px solid var(--bg-surface)'
                }} 
              />
            </div>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-main)', fontWeight: 600, textAlign: 'center', maxWidth: '64px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              Sen
            </span>
          </div>

          {/* Diğer Tüm Okurlar ve Yazarlar */}
          {(users || [])
            .filter(u => u.id !== currentUser?.id)
            .map(u => {
              const isAuthor = u.role === 'author';
              const isFounder = u.role === 'founder' || u.role === 'admin';
              const ringColor = isFounder ? '#f59e0b' : isAuthor ? '#8b5cf6' : 'var(--border-subtle)';

              return (
                <div
                  key={u.id}
                  onClick={() => handleOpenProfile(u.id)}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '6px',
                    cursor: 'pointer',
                    flexShrink: 0,
                    width: '64px'
                  }}
                  title={`${u.fullName} (${u.role || 'Okur'})`}
                >
                  <div style={{ position: 'relative' }}>
                    <img
                      src={u.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&h=150&q=80'}
                      alt={u.fullName}
                      style={{
                        width: '52px',
                        height: '52px',
                        borderRadius: '50%',
                        objectFit: 'cover',
                        border: `2px solid ${ringColor}`,
                        padding: '2px',
                        transition: 'transform 0.15s ease'
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.08)'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
                      onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150&q=80'; }}
                    />
                    {isFounder && (
                      <span style={{ position: 'absolute', bottom: '-2px', right: '-2px', fontSize: '10px' }}>👑</span>
                    )}
                    {isAuthor && (
                      <span style={{ position: 'absolute', bottom: '-2px', right: '-2px', fontSize: '10px' }}>✍️</span>
                    )}
                  </div>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textAlign: 'center', maxWidth: '64px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {u.firstName || u.fullName.split(' ')[0]}
                  </span>
                </div>
              );
            })}
        </div>
      </div>

      {/* 2. DÜŞÜNCENİ PAYLAŞ HIZLI KUTUSU */}
      <div 
        onClick={() => setIsCreatePostOpen(true)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-lg)',
          padding: '12px 16px',
          marginBottom: '20px',
          cursor: 'pointer',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.03)'
        }}
      >
        <img 
          src={currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150&q=80'} 
          alt={currentUser?.fullName || 'Kullanıcı'} 
          style={{ width: '38px', height: '38px', borderRadius: '50%', objectFit: 'cover' }}
        />
        <div style={{ flex: 1, padding: '9px 14px', borderRadius: 'var(--radius-full)', background: 'var(--bg-surface-elevated)', color: 'var(--text-dim)', fontSize: '0.86rem' }}>
          Şu an hangi kitabı okuyorsun? Kenar notunu paylaş...
        </div>
        <button 
          className="btn btn-primary"
          style={{ padding: '8px 16px', fontSize: '0.82rem', fontWeight: 600, borderRadius: 'var(--radius-full)' }}
        >
          Paylaş
        </button>
      </div>

      {/* 3. DİNAMİK VE ETKİLEŞİMLİ GÖNDERİ LİSTESİ */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {sortedPosts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-muted)' }}>
            <BookOpen size={36} style={{ opacity: 0.4, margin: '0 auto 12px' }} />
            <p style={{ margin: 0, fontWeight: 600 }}>Henüz bir gönderi bulunmuyor.</p>
            <p style={{ fontSize: '0.84rem', margin: '4px 0 0' }}>İlk kenar notunu yukarıdan paylaşabilirsiniz.</p>
          </div>
        ) : (
          sortedPosts.map(post => (
            <PostCard key={post.id} post={post} />
          ))
        )}
      </div>

    </div>
  );
};
