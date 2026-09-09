import React from 'react';
import { Heart, MessageSquare, UserPlus, Users, Check, X, Bell, Sparkles, Plus, BookOpen } from 'lucide-react';
import { Modal } from './Modal';
import { useApp } from '../../context/AppContext';

export const NotificationDrawer = () => {
  const { 
    isNotifOpen, 
    setIsNotifOpen, 
    notifications, 
    markAllNotificationsRead, 
    users, 
    setViewingUserId, 
    setActiveTab,
    setSelectedBookId,
    addToWishlist,
    isInWishlist
  } = useApp();

  const getActor = (actorId) => users.find(u => u.id === actorId);

  const getIcon = (type) => {
    switch (type) {
      case 'monthly_book_club':
        return <Sparkles size={16} color="#f59e0b" />;
      case 'follow':
        return <UserPlus size={16} color="#6366f1" />;
      case 'like':
        return <Heart size={16} color="#f43f5e" fill="#f43f5e" />;
      case 'comment':
        return <MessageSquare size={16} color="#f59e0b" />;
      case 'room_invite':
        return <Users size={16} color="#10b981" />;
      default:
        return <Bell size={16} color="#94a3b8" />;
    }
  };

  const handleNotificationClick = (notif) => {
    if (notif.bookId) {
      setSelectedBookId(notif.bookId);
      setIsNotifOpen(false);
      return;
    }
    if (notif.actorId) {
      setViewingUserId(notif.actorId);
      setActiveTab('profile');
      setIsNotifOpen(false);
    }
  };

  return (
    <Modal
      isOpen={isNotifOpen}
      onClose={() => setIsNotifOpen(false)}
      title="Bildirimler"
      maxWidth="480px"
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-dim)' }}>
            Son bildirimlerin ({notifications.length})
          </span>
          <button
            className="btn btn-ghost btn-sm"
            onClick={markAllNotificationsRead}
            style={{ fontSize: '0.78rem', color: 'var(--color-primary)' }}
          >
            <Check size={14} />
            Tümünü Okundu Say
          </button>
        </div>

        {notifications.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '30px 20px', color: 'var(--text-muted)' }}>
            <Bell size={32} style={{ margin: '0 auto 10px', opacity: 0.4 }} />
            <p>Henüz okunacak bir bildiriminiz bulunmuyor.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '400px', overflowY: 'auto' }}>
            {notifications.map(notif => {
              const actor = getActor(notif.actorId);
              return (
                <div
                  key={notif.id}
                  onClick={() => handleNotificationClick(notif)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '12px',
                    borderRadius: 'var(--radius-md)',
                    background: notif.read ? 'var(--bg-surface-elevated)' : 'var(--color-primary-light)',
                    border: '1px solid var(--border-subtle)',
                    cursor: 'pointer',
                    transition: 'background var(--transition-fast)'
                  }}
                >
                  <div style={{ position: 'relative' }}>
                    <img
                      src={actor?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&h=100&q=80'}
                      alt=""
                      style={{ width: '38px', height: '38px', borderRadius: '50%', objectFit: 'cover' }}
                    />
                    <div
                      style={{
                        position: 'absolute',
                        bottom: '-2px',
                        right: '-2px',
                        background: 'var(--bg-surface)',
                        borderRadius: '50%',
                        padding: '2px',
                        display: 'flex',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.3)'
                      }}
                    >
                      {getIcon(notif.type)}
                    </div>
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: '0.88rem', color: 'var(--text-main)', lineHeight: 1.4 }}>
                      {notif.text}
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '6px' }}>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                        {notif.time}
                      </span>

                      {notif.bookId && (
                        <button
                          className={`btn btn-sm ${isInWishlist(notif.bookId) ? 'btn-secondary' : 'btn-primary'}`}
                          style={{ fontSize: '0.75rem', padding: '4px 10px', height: 'auto' }}
                          onClick={(e) => {
                            e.stopPropagation();
                            addToWishlist(notif.bookId);
                          }}
                        >
                          {isInWishlist(notif.bookId) ? <Check size={13} /> : <Plus size={13} />}
                          <span>{isInWishlist(notif.bookId) ? 'Sepette ✓' : 'İstek Listene Ekle'}</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {!notif.read && (
                    <div
                      style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        background: 'var(--color-primary)'
                      }}
                    />
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </Modal>
  );
};
