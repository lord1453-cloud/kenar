import React from 'react';
import { UserPlus, Check, X } from 'lucide-react';
import { Modal } from '../common/Modal';
import { useApp } from '../../context/AppContext';

export const FollowListModal = ({ isOpen, onClose, title, userIds = [] }) => {
  const { users, currentUser, followUser, setViewingUserId, setActiveTab } = useApp();

  const safeUserIds = Array.isArray(userIds) ? userIds : [];
  const userList = users.filter(u => safeUserIds.includes(u.id));

  const handleUserClick = (userId) => {
    onClose();
    setViewingUserId(userId);
    setActiveTab('profile');
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      maxWidth="460px"
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '400px', overflowY: 'auto' }}>
        {userList.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '24px', color: 'var(--text-dim)' }}>
            Henüz kimse listelenmiyor.
          </div>
        ) : (
          userList.map(user => {
            const isFollowing = (currentUser?.following || []).includes(user.id);
            const isMe = user.id === currentUser?.id;

            return (
              <div
                key={user.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '8px 12px',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--bg-surface-elevated)'
                }}
              >
                <div 
                  style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', minWidth: 0 }}
                  onClick={() => handleUserClick(user.id)}
                >
                  <img src={user.avatar} alt={user.fullName} style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }} />
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontWeight: 700, fontSize: '0.9rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {user.fullName}
                    </div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                      @{user.username}
                    </div>
                  </div>
                </div>

                {!isMe && (
                  <button
                    className={`btn btn-sm ${isFollowing ? 'btn-secondary' : 'btn-primary'}`}
                    style={{ fontSize: '0.75rem', padding: '4px 10px' }}
                    onClick={() => followUser(user.id)}
                  >
                    {isFollowing ? 'Takip Ediliyor' : 'Takip Et'}
                  </button>
                )}
              </div>
            );
          })
        )}
      </div>
    </Modal>
  );
};
