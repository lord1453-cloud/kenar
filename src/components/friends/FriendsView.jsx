import React, { useState } from 'react';
import { 
  Users, 
  UserPlus, 
  UserMinus, 
  Check, 
  X, 
  Search, 
  Clock, 
  Radio 
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const FriendsView = () => {
  const { 
    currentUser, 
    users, 
    friendRequests, 
    sendFriendRequest, 
    acceptFriendRequest, 
    rejectFriendRequest, 
    removeFriend,
    setViewingUserId,
    setActiveTab,
    userBooks,
    books
  } = useApp();

  const [activeTab, setActiveTabLocal] = useState('list'); // 'list' | 'requests' | 'search'
  const [searchQuery, setSearchQuery] = useState('');

  const myFriends = (currentUser.friends || []).map(id => users.find(u => u.id === id)).filter(Boolean);

  const incomingRequests = friendRequests.filter(
    r => r.toUserId === currentUser.id && r.status === 'pending'
  ).map(r => ({
    ...r,
    user: users.find(u => u.id === r.fromUserId)
  })).filter(r => Boolean(r.user));

  const allOtherUsers = (users || []).filter(u => u.id !== currentUser.id);
  const searchResults = searchQuery.trim()
    ? allOtherUsers.filter(u => 
        (u.fullName || '').toLowerCase().includes(searchQuery.toLowerCase()) || 
        (u.username || '').toLowerCase().includes(searchQuery.toLowerCase())
      )
    : allOtherUsers;

  return (
    <div className="content-layout">
      <div style={{ maxWidth: '820px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        
        {/* Header */}
        <div style={{ borderBottom: '1px solid var(--border-subtle)', paddingBottom: '16px' }}>
          <h1 style={{ fontSize: '1.4rem', fontWeight: 600, color: 'var(--text-main)', margin: 0 }}>
            Arkadaşlar
          </h1>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            Okuma arkadaşlarınızı yönetin, yeni okurlar keşfedin ve canlı okuma durumlarını takip edin.
          </p>
        </div>

        {/* Apple iOS Bilgi Rozeti & Topluluk Kuralı (Birebir Mesajlaşma Yok - Sadece Odalarda Sohbet) */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
          background: 'var(--bg-surface-elevated)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-md)',
          padding: '12px 18px',
          borderLeft: '4px solid #007AFF'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1, minWidth: '240px' }}>
            <span style={{ fontSize: '1.3rem' }}>🔒</span>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-main)', lineHeight: 1.45 }}>
              <strong style={{ color: '#007AFF' }}>Özel Mesajlaşma Bulunmaz:</strong> Luku'da dikkat dağıtan birebir DM mesajlaşması kapalıdır. Edebi sohbetler ve kitap değerlendirmeleri yalnızca <strong>Kitap Odaları</strong> içinde toplulukla paylaşılır.
            </div>
          </div>
          <button
            className="btn-apple-primary"
            onClick={() => setActiveTab('rooms')}
            style={{ fontSize: '0.82rem', padding: '7px 15px' }}
          >
            <span>Kitap Odalarına Katıl</span>
          </button>
        </div>

        {/* Sub Navigation Tabs */}
        <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '10px' }}>
          <button
            className={`btn btn-sm ${activeTab === 'list' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTabLocal('list')}
          >
            Arkadaşlarım ({myFriends.length})
          </button>
          <button
            className={`btn btn-sm ${activeTab === 'requests' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTabLocal('requests')}
            style={{ position: 'relative' }}
          >
            Gelen İstekler ({incomingRequests.length})
            {incomingRequests.length > 0 && (
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--color-danger)', display: 'inline-block', marginLeft: '6px' }} />
            )}
          </button>
          <button
            className={`btn btn-sm ${activeTab === 'search' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTabLocal('search')}
          >
            <UserPlus size={14} /> Arkadaş Bul
          </button>
        </div>

        {/* 1. Friends List */}
        {activeTab === 'list' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {myFriends.length > 0 ? (
              myFriends.map(friend => {
                const readingUB = userBooks.find(ub => ub.userId === friend.id && ub.status === 'reading');
                const readingBook = readingUB ? books.find(b => b.id === readingUB.bookId) : null;

                return (
                  <div
                    key={friend.id}
                    style={{
                      background: 'var(--bg-surface)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: 'var(--radius-md)',
                      padding: '14px 18px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '16px'
                    }}
                  >
                    <div 
                      style={{ display: 'flex', alignItems: 'center', gap: '14px', cursor: 'pointer', minWidth: 0 }}
                      onClick={() => { setViewingUserId(friend.id); setActiveTab('profile'); }}
                    >
                      <img 
                        src={friend.avatar} 
                        alt={friend.fullName}
                        style={{ width: '44px', height: '44px', borderRadius: '50%', objectFit: 'cover' }}
                      />
                      <div style={{ minWidth: 0 }}>
                        <div style={{ fontWeight: 600, fontSize: '0.94rem', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          {friend.fullName}
                          {friend.isStarUser && (
                            <span style={{ fontSize: '0.72rem', color: 'var(--color-star)', fontWeight: 700 }} title="Yıldızlı Kullanıcı">
                              ★
                            </span>
                          )}
                        </div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                          @{friend.username} • {friend.readingGoal} kitap hedefi
                        </div>
                        {readingBook && friend.privacySettings?.showActivityStatus !== false && (
                          <div style={{ fontSize: '0.75rem', color: '#10b981', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                            <Radio size={12} /> Şu anda <em>{readingBook.title}</em> okuyor ({readingUB.currentPage}. sf)
                          </div>
                        )}
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        className="btn btn-secondary btn-sm"
                        style={{ fontSize: '0.78rem' }}
                        onClick={() => { setViewingUserId(friend.id); setActiveTab('profile'); }}
                      >
                        Profil
                      </button>
                      <button
                        className="btn btn-ghost btn-sm"
                        style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}
                        onClick={() => removeFriend(friend.id)}
                        title="Arkadaşlıktan Çıkar"
                      >
                        <UserMinus size={15} />
                      </button>
                    </div>
                  </div>
                );
              })
            ) : (
              <div style={{ textAlign: 'center', padding: '40px', background: 'var(--bg-surface)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', color: 'var(--text-muted)' }}>
                Henüz arkadaş listenizde kimse yok. 'Arkadaş Bul' sekmesinden yeni okurlarla bağlantı kurabilirsiniz.
              </div>
            )}
          </div>
        )}

        {/* 2. Incoming Requests */}
        {activeTab === 'requests' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {incomingRequests.length > 0 ? (
              incomingRequests.map(req => (
                <div
                  key={req.id}
                  style={{
                    background: 'var(--bg-surface)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-md)',
                    padding: '14px 18px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '16px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <img 
                      src={req.user.avatar} 
                      alt={req.user.fullName}
                      style={{ width: '42px', height: '42px', borderRadius: '50%', objectFit: 'cover' }}
                    />
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '0.92rem', color: 'var(--text-main)' }}>
                        {req.user.fullName}
                      </div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                        @{req.user.username} • {req.date}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => acceptFriendRequest(req.id)}
                    >
                      <Check size={14} /> Kabul Et
                    </button>
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => rejectFriendRequest(req.id)}
                    >
                      <X size={14} /> Reddet
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div style={{ textAlign: 'center', padding: '40px', background: 'var(--bg-surface)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', color: 'var(--text-muted)' }}>
                Bekleyen arkadaşlık isteği bulunmuyor.
              </div>
            )}
          </div>
        )}

        {/* 3. Search & Add Friends */}
        {activeTab === 'search' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                placeholder="İsim veya kullanıcı adı ile ara..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ width: '100%', padding: '10px 14px 10px 38px', fontSize: '0.92rem' }}
              />
              <Search size={16} style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--text-dim)' }} />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '4px' }}>
                {searchQuery.trim() ? `Arama Sonuçları (${searchResults.length})` : `Topluluktaki Beta Okurları (${searchResults.length})`}
              </div>

              {searchResults.length > 0 ? (
                searchResults.map(user => {
                  const isFriend = (currentUser.friends || []).includes(user.id);
                  const isPending = friendRequests.some(
                    r => r.fromUserId === currentUser.id && r.toUserId === user.id && r.status === 'pending'
                  );

                  return (
                    <div
                      key={user.id}
                      style={{
                        background: 'var(--bg-surface)',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: 'var(--radius-md)',
                        padding: '12px 16px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '14px'
                      }}
                    >
                      <div 
                        style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}
                        onClick={() => { setViewingUserId(user.id); setActiveTab('profile'); }}
                        title="Profili Görüntüle"
                      >
                        <img 
                          src={user.avatar} 
                          alt={user.fullName}
                          style={{ width: '42px', height: '42px', borderRadius: '50%', objectFit: 'cover', border: '1px solid var(--border-subtle)' }}
                        />
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ fontWeight: 600, fontSize: '0.92rem', color: 'var(--text-main)' }}>
                              {user.fullName}
                            </span>
                            {user.role === 'founder' ? (
                              <span className="badge" style={{ background: 'rgba(234, 179, 8, 0.15)', color: 'var(--color-star)', fontSize: '0.68rem', padding: '1px 6px' }}>
                                ★ Kurucu
                              </span>
                            ) : user.role === 'admin' ? (
                              <span className="badge badge-primary" style={{ fontSize: '0.68rem', padding: '1px 6px' }}>
                                Admin
                              </span>
                            ) : (
                              <span className="badge" style={{ background: 'rgba(59, 130, 246, 0.1)', color: 'var(--color-primary)', fontSize: '0.68rem', padding: '1px 6px' }}>
                                Beta Okuru
                              </span>
                            )}
                          </div>
                          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                            @{user.username} {user.bio ? `• ${user.bio.slice(0, 38)}...` : ''}
                          </div>
                        </div>
                      </div>

                      {isFriend ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontSize: '0.8rem', color: '#10b981', fontWeight: 600 }}>
                            ✓ Arkadaşsınız
                          </span>
                          <button
                            className="btn btn-ghost btn-sm"
                            style={{ fontSize: '0.75rem', color: 'var(--color-danger)', padding: '2px 6px' }}
                            onClick={() => removeFriend(user.id)}
                            title="Arkadaşlıktan Çıkar"
                          >
                            Çıkar
                          </button>
                        </div>
                      ) : isPending ? (
                        <span style={{ fontSize: '0.8rem', color: '#f59e0b', display: 'flex', alignItems: 'center', gap: '4px', background: 'rgba(245, 158, 11, 0.1)', padding: '4px 10px', borderRadius: '12px' }}>
                          <Clock size={13} /> İstek Gönderildi
                        </span>
                      ) : (
                        <button
                          className="btn btn-primary btn-sm"
                          style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem' }}
                          onClick={() => sendFriendRequest(user.id)}
                        >
                          <UserPlus size={14} /> Arkadaş Ekle
                        </button>
                      )}
                    </div>
                  );
                })
              ) : (
                <div style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)' }}>
                  Aramanızla eşleşen okuyucu bulunamadı.
                </div>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
