import React, { useState } from 'react';
import { 
  Users, 
  MessageSquare, 
  Share2, 
  Lock, 
  Globe, 
  ShieldCheck, 
  UserPlus, 
  Sparkles,
  FileText
} from 'lucide-react';
import { Modal } from '../common/Modal';
import { RoomChat } from './RoomChat';
import { PostCard } from '../feed/PostCard';
import { useApp } from '../../context/AppContext';

export const RoomDetailModal = () => {
  const { 
    selectedRoomId, 
    setSelectedRoomId, 
    rooms, 
    users, 
    currentUser, 
    joinRoom, 
    posts, 
    showToast,
    setViewingUserId,
    setActiveTab,
    followUser,
    sendFriendRequest,
    friendRequests
  } = useApp();

  const [activeTab, setLocalActiveTab] = useState('chat'); // 'chat' | 'posts' | 'members'

  const room = selectedRoomId ? rooms.find(r => r.id === selectedRoomId) : null;
  if (!room) return null;

  const admin = users.find(u => u.id === room.adminId) || { fullName: 'Yönetici' };
  const isMember = room.members.includes(currentUser.id);
  const roomMembers = users.filter(u => room.members.includes(u.id));

  // Room posts (posts by room members or mentioning the room)
  const roomPosts = posts.filter(p => room.members.includes(p.userId));

  const copyInviteLink = () => {
    const inviteLink = `${window.location.origin}/#room-invite-${room.inviteCode || room.id}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(inviteLink);
      showToast(`Oda davet bağlantısı kopyalandı! (Kod: ${room.inviteCode})`, '📋');
    }
  };

  const handleMemberClick = (memberId) => {
    setSelectedRoomId(null);
    setViewingUserId(memberId);
    setActiveTab('profile');
  };

  return (
    <Modal
      isOpen={!!selectedRoomId}
      onClose={() => setSelectedRoomId(null)}
      title={room.name}
      maxWidth="720px"
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {/* Room Header Banner */}
        <div style={{ background: 'var(--bg-surface-elevated)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <span style={{ fontSize: '2.5rem' }}>{room.icon}</span>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>{room.name}</h3>
                  {room.isPrivate ? (
                    <span className="badge" style={{ background: 'rgba(239,68,68,0.15)', color: '#ef4444' }}>
                      <Lock size={12} /> Özel
                    </span>
                  ) : (
                    <span className="badge badge-green">
                      <Globe size={12} /> Herkese Açık
                    </span>
                  )}
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)', display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <ShieldCheck size={14} color="var(--color-primary)" />
                    Yönetici: {admin.fullName}
                  </span>
                  <span>•</span>
                  <span>{room.members.length} Üye</span>
                </div>
              </div>
            </div>

            {/* Room Actions */}
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                className="btn btn-secondary btn-sm"
                onClick={copyInviteLink}
                title="Davet Bağlantısını Kopyala"
              >
                <Share2 size={14} />
                Davet Et
              </button>

              <button
                className={`btn btn-sm ${isMember ? 'btn-danger' : 'btn-primary'}`}
                onClick={() => joinRoom(room.id)}
              >
                {isMember ? 'Odadan Ayrıl' : 'Odaya Katıl'}
              </button>
            </div>
          </div>

          <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
            {room.description}
          </p>
        </div>

        {/* Room Tabs */}
        <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '8px' }}>
          <button
            className={`btn btn-sm ${activeTab === 'chat' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setLocalActiveTab('chat')}
          >
            <MessageSquare size={15} />
            Oda Sohbeti
          </button>
          <button
            className={`btn btn-sm ${activeTab === 'posts' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setLocalActiveTab('posts')}
          >
            <FileText size={15} />
            Oda Gönderileri ({roomPosts.length})
          </button>
          <button
            className={`btn btn-sm ${activeTab === 'members' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setLocalActiveTab('members')}
          >
            <Users size={15} />
            Üyeler ({roomMembers.length})
          </button>
        </div>

        {/* Tab 1: Interactive Chat */}
        {activeTab === 'chat' && (
          <div>
            {!isMember && (
              <div style={{ background: 'var(--color-primary-light)', padding: '10px 14px', borderRadius: 'var(--radius-md)', marginBottom: '10px', fontSize: '0.85rem', color: 'var(--color-primary)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>Mesaj yazabilmek için önce odaya katılmalısınız.</span>
                <button className="btn btn-primary btn-sm" onClick={() => joinRoom(room.id)}>
                  Şimdi Katıl
                </button>
              </div>
            )}
            <RoomChat roomId={room.id} />
          </div>
        )}

        {/* Tab 2: Room Posts */}
        {activeTab === 'posts' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', maxHeight: '520px', overflowY: 'auto' }}>
            {roomPosts.length > 0 ? (
              roomPosts.map(p => (
                <PostCard key={p.id} post={p} />
              ))
            ) : (
              <div style={{ textAlign: 'center', padding: '30px', color: 'var(--text-dim)' }}>
                Bu odanın üyeleri tarafından henüz bir gönderi paylaşılmamış.
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Members */}
        {activeTab === 'members' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '450px', overflowY: 'auto' }}>
            {roomMembers.map(m => {
              const isFollowing = currentUser.following.includes(m.id);
              const isFriend = (currentUser.friends || []).includes(m.id);
              const isPending = (friendRequests || []).some(
                r => r.fromUserId === currentUser.id && r.toUserId === m.id && r.status === 'pending'
              );
              const isMe = m.id === currentUser.id;

              return (
                <div
                  key={m.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 14px',
                    borderRadius: 'var(--radius-md)',
                    background: 'var(--bg-surface-elevated)'
                  }}
                >
                  <div 
                    style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}
                    onClick={() => handleMemberClick(m.id)}
                  >
                    <img src={m.avatar} alt={m.fullName} style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }} />
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.92rem' }}>
                        {m.fullName} {m.id === room.adminId && <span style={{ color: 'var(--color-primary)', fontSize: '0.75rem' }}>(Kurucu)</span>}
                      </div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>@{m.username}</div>
                    </div>
                  </div>

                  {!isMe && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      {isFriend ? (
                        <span style={{ fontSize: '0.78rem', color: '#10b981', fontWeight: 600 }}>
                          ✓ Arkadaş
                        </span>
                      ) : isPending ? (
                        <span style={{ fontSize: '0.75rem', color: '#f59e0b' }}>
                          ⏳ İstek İletildi
                        </span>
                      ) : (
                        <button
                          className="btn btn-secondary btn-sm"
                          style={{ fontSize: '0.75rem', padding: '4px 8px' }}
                          onClick={() => sendFriendRequest(m.id)}
                          title="Arkadaşlık İsteği Gönder"
                        >
                          <UserPlus size={13} />
                          Arkadaş Ekle
                        </button>
                      )}

                      <button
                        className={`btn btn-sm ${isFollowing ? 'btn-ghost' : 'btn-primary'}`}
                        style={{ fontSize: '0.75rem', padding: '4px 10px' }}
                        onClick={() => followUser(m.id)}
                      >
                        {isFollowing ? 'Takipte' : 'Takip Et'}
                      </button>
                    </div>
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
