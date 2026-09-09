import React from 'react';
import { 
  Play, 
  Pause, 
  Square, 
  BookOpen, 
  Clock, 
  Radio, 
  Users, 
  Eye, 
  EyeOff,
  Sparkles
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { BookCover } from '../common/BookCover';

export const LiveReadingView = () => {
  const { 
    currentUser, 
    users, 
    books, 
    userBooks, 
    timerState, 
    startTimer, 
    pauseTimer, 
    resumeTimer, 
    finishTimer, 
    formatClock, 
    formatDuration,
    setSelectedBookId,
    setViewingUserId,
    setActiveTab
  } = useApp();

  // Active book
  const activeBook = timerState.bookId 
    ? books.find(b => b.id === timerState.bookId) 
    : (userBooks.find(ub => ub.userId === currentUser.id && ub.status === 'reading') 
      ? books.find(b => b.id === userBooks.find(ub => ub.userId === currentUser.id && ub.status === 'reading').bookId)
      : books[0]);

  const activeUserBook = activeBook 
    ? userBooks.find(ub => ub.bookId === activeBook.id && ub.userId === currentUser.id) 
    : null;

  const currentPage = timerState.startPage || activeUserBook?.currentPage || 0;
  const progressPercent = activeBook ? Math.min(100, Math.round((currentPage / activeBook.pages) * 100)) : 0;

  // Friends reading now (with privacy check)
  const myFriendIds = currentUser.friends || [];
  const friendsReading = users
    .filter(u => myFriendIds.includes(u.id) && u.privacySettings?.showActivityStatus !== false)
    .map(friend => {
      const ub = userBooks.find(item => item.userId === friend.id && item.status === 'reading');
      const b = ub ? books.find(book => book.id === ub.bookId) : books[3]; // default book
      return {
        id: friend.id,
        user: friend,
        book: b,
        currentPage: ub?.currentPage || 180,
        activeMinutes: Math.round((friend.todayReadingSeconds || 1800) / 60)
      };
    });

  return (
    <div className="content-layout">
      <div style={{ maxWidth: '820px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        
        {/* Header */}
        <div style={{ borderBottom: '1px solid var(--border-subtle)', paddingBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', background: '#10b981' }} />
            <h1 style={{ fontSize: '1.4rem', fontWeight: 600, color: 'var(--text-main)', margin: 0 }}>
              Canlı Okuma
            </h1>
          </div>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            Okuma seansınızı senkronize takip edin ve arkadaşlarınızın hangi satırlarda olduğunu görün.
          </p>
        </div>

        {/* Current User Active Reading Session Box */}
        <div style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-md)',
          padding: '24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 600, color: 'var(--color-primary)' }}>
              Senkronize Okuma Oturumu
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              <Radio size={14} color="#10b981" />
              <span>{timerState.isRunning ? 'Canlı Yayında' : 'Duraklatıldı'}</span>
            </div>
          </div>

          {activeBook && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', alignItems: 'center' }}>
              <BookCover 
                src={activeBook.cover} 
                title={activeBook.title}
                alt={activeBook.title}
                style={{ width: '80px', height: '115px', borderRadius: 'var(--radius-xs)', border: '1px solid var(--border-subtle)', flexShrink: 0 }}
              />

              <div style={{ flex: 1, minWidth: '240px' }}>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 600, color: 'var(--text-main)' }}>
                  {activeBook.title}
                </h3>
                <span style={{ fontSize: '0.86rem', color: 'var(--text-muted)' }}>
                  {activeBook.author} • {currentPage} / {activeBook.pages} sayfa (%{progressPercent})
                </span>

                <div style={{ width: '100%', height: '6px', background: 'var(--border-subtle)', borderRadius: '999px', overflow: 'hidden', margin: '10px 0' }}>
                  <div style={{ width: `${progressPercent}%`, height: '100%', background: 'var(--color-primary)' }} />
                </div>

                {/* Clock Display */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ fontFamily: 'monospace', fontSize: '1.6rem', fontWeight: 700, color: 'var(--text-main)' }}>
                    {formatClock(timerState.seconds)}
                  </div>

                  <div style={{ display: 'flex', gap: '8px' }}>
                    {timerState.isRunning ? (
                      <button className="btn btn-secondary btn-sm" onClick={pauseTimer}>
                        <Pause size={15} /> Duraklat
                      </button>
                    ) : (
                      <button 
                        className="btn btn-primary btn-sm" 
                        onClick={() => timerState.bookId ? resumeTimer() : startTimer(activeBook.id)}
                      >
                        <Play size={15} fill="currentColor" /> {timerState.seconds > 0 ? 'Devam Et' : 'Başlat'}
                      </button>
                    )}

                    {timerState.seconds > 0 && (
                      <button 
                        className="btn btn-secondary btn-sm" 
                        onClick={() => finishTimer(currentPage)}
                        style={{ color: 'var(--color-danger)' }}
                      >
                        <Square size={14} /> Bitir
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Friends Reading Live Section */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--text-main)', margin: 0 }}>
              Şu Anda Okuyan Arkadaşlarım ({friendsReading.length})
            </h2>
            <button 
              className="btn btn-ghost btn-sm" 
              onClick={() => setActiveTab('friends')}
              style={{ fontSize: '0.8rem' }}
            >
              Arkadaş Listesini Yönet
            </button>
          </div>

          {friendsReading.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {friendsReading.map(item => (
                <div
                  key={item.id}
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
                    onClick={() => { setViewingUserId(item.user.id); setActiveTab('profile'); }}
                  >
                    <div style={{ position: 'relative' }}>
                      <img 
                        src={item.user.avatar} 
                        alt={item.user.fullName}
                        style={{ width: '42px', height: '42px', borderRadius: '50%', objectFit: 'cover' }}
                      />
                      <span style={{ position: 'absolute', bottom: 0, right: 0, width: '10px', height: '10px', borderRadius: '50%', background: '#10b981', border: '2px solid var(--bg-surface)' }} />
                    </div>

                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontWeight: 600, fontSize: '0.92rem', color: 'var(--text-main)' }}>
                        {item.user.fullName}
                        {item.user.isStarUser && (
                          <span style={{ marginLeft: '6px', fontSize: '0.72rem', color: 'var(--color-star)', fontWeight: 700 }}>
                            ★
                          </span>
                        )}
                      </div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        📖 {item.book?.title} • {item.currentPage}. sayfada
                      </div>
                    </div>
                  </div>

                  <div style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
                    <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-dim)' }}>
                      {item.activeMinutes} dakikadır aktif
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '36px', background: 'var(--bg-surface)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', color: 'var(--text-muted)' }}>
              Şu anda canlı kitap okuyan bir arkadaşınız bulunmuyor.
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
