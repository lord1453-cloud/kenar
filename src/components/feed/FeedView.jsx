import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { FEATURED_COVERS } from '../../data/featuredBooksCovers';
import { BookCover } from '../common/BookCover';

export const FeedView = () => {
  const { posts, openBook, currentUser, books, createPost, showToast } = useApp();
  
  // Düşünce Paylaşma Formu State'leri
  const [thoughtText, setThoughtText] = useState('');
  const [selectedBookId, setSelectedBookId] = useState('');
  const [pageNo, setPageNo] = useState('');
  const [isSpoiler, setIsSpoiler] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Beğeni ve Spoiler Açma Durumları
  const [likes, setLikes] = useState({ post2: 238, post3: 512 });
  const [liked, setLiked] = useState({ post2: false, post3: false });
  const [revealedSpoilers, setRevealedSpoilers] = useState({});

  const toggleLike = (key) => {
    setLiked(prev => ({ ...prev, [key]: !prev[key] }));
    setLikes(prev => ({ ...prev, [key]: prev[key] + (liked[key] ? -1 : 1) }));
  };

  const toggleSpoiler = (id) => {
    setRevealedSpoilers(prev => ({ ...prev, [id]: true }));
  };

  const handleShareThought = (e) => {
    e.preventDefault();
    if (!thoughtText.trim()) return;

    setIsSubmitting(true);
    createPost({
      content: thoughtText.trim(),
      bookId: selectedBookId || null,
      pageProgress: pageNo ? parseInt(pageNo, 10) : null,
      isSpoiler
    });

    setThoughtText('');
    setSelectedBookId('');
    setPageNo('');
    setIsSpoiler(false);
    setIsSubmitting(false);
  };

  return (
    <div className="content">
      {/* 0. ÜSTTE SABİT DÜŞÜNCE PAYLAŞMA ALANI (Kullanıcı İsteği) */}
      <div 
        className="post" 
        style={{ 
          marginBottom: '20px', 
          border: '1px solid var(--separator)',
          boxShadow: 'var(--shadow)',
          background: 'var(--bg-elevated)',
          borderRadius: '14px'
        }}
      >
        <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
          <div 
            className="avatar" 
            style={{ 
              width: '40px', 
              height: '40px', 
              backgroundImage: currentUser?.avatar ? `url(${currentUser.avatar})` : 'none',
              backgroundColor: '#8B4A34',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              flexShrink: 0
            }} 
          />
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--label)' }}>
                Kenar Notu veya Düşünce Paylaş
              </span>
              <span style={{ fontSize: '12px', color: 'var(--label-2)' }}>
                {currentUser?.fullName}
              </span>
            </div>

            <textarea
              placeholder="Bu satırlarda zihninizde ne belirdi? Okuma notunuzu paylaşın..."
              value={thoughtText}
              onChange={(e) => setThoughtText(e.target.value)}
              rows={3}
              style={{
                width: '100%',
                border: '1px solid var(--separator)',
                borderRadius: '10px',
                padding: '10px 12px',
                fontSize: '14px',
                fontFamily: 'inherit',
                background: 'var(--fill)',
                color: 'var(--label)',
                resize: 'vertical',
                outline: 'none',
                boxSizing: 'border-box',
                lineHeight: 1.45
              }}
            />

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px', marginTop: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                {/* Kitap Seçimi */}
                <select
                  value={selectedBookId}
                  onChange={(e) => setSelectedBookId(e.target.value)}
                  style={{
                    padding: '6px 10px',
                    borderRadius: '8px',
                    border: '1px solid var(--separator)',
                    background: 'var(--bg-elevated)',
                    color: 'var(--label)',
                    fontSize: '12.5px',
                    outline: 'none',
                    cursor: 'pointer'
                  }}
                >
                  <option value="">📚 Kitap Seçin (İsteğe bağlı)</option>
                  {(books || []).slice(0, 30).map(b => (
                    <option key={b.id} value={b.id}>{b.title} — {b.author}</option>
                  ))}
                </select>

                {/* Sayfa Numarası */}
                {selectedBookId && (
                  <input
                    type="number"
                    placeholder="Sayfa no (örn: 142)"
                    value={pageNo}
                    onChange={(e) => setPageNo(e.target.value)}
                    style={{
                      width: '130px',
                      padding: '6px 10px',
                      borderRadius: '8px',
                      border: '1px solid var(--separator)',
                      background: 'var(--bg-elevated)',
                      color: 'var(--label)',
                      fontSize: '12.5px',
                      outline: 'none'
                    }}
                  />
                )}

                {/* Spoiler Uyarısı */}
                <label style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '12.5px', color: 'var(--label-2)', cursor: 'pointer', userSelect: 'none' }}>
                  <input
                    type="checkbox"
                    checked={isSpoiler}
                    onChange={(e) => setIsSpoiler(e.target.checked)}
                    style={{ accentColor: 'var(--orange)' }}
                  />
                  <span>Spoiler içeriyor</span>
                </label>
              </div>

              <button
                className="btn btn-accent"
                onClick={handleShareThought}
                disabled={!thoughtText.trim() || isSubmitting}
                style={{
                  padding: '7px 18px',
                  borderRadius: '999px',
                  fontSize: '13px',
                  fontWeight: 600,
                  opacity: thoughtText.trim() ? 1 : 0.5,
                  cursor: thoughtText.trim() ? 'pointer' : 'default',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <svg className="icon icon-sm" viewBox="0 0 24 24" style={{ strokeWidth: 2 }}>
                  <line x1="22" y1="2" x2="11" y2="13"></line>
                  <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                </svg>
                Paylaş
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 1. Sabitlenmiş Gönderi (Yönetici) */}
      <div className="post pinned">
        <div className="badge badge-orange" style={{ marginBottom: '12px' }}>
          <svg viewBox="0 0 24 24">
            <path d="M12 2v11M8 6l4-4 4 4M6 22l6-4 6 4v-8H6v8z"/>
          </svg>
          Sabitlendi
        </div>
        <div className="post-head">
          <div 
            className="avatar" 
            style={{ width: '40px', height: '40px', background: 'linear-gradient(155deg,#FF9500,#c96e00)' }}
          />
          <div style={{ flex: 1 }}>
            <div className="post-name-row">
              <span className="post-name">Kenar Ekibi</span>
              <span className="badge badge-orange">
                <svg className="fill" viewBox="0 0 24 24">
                  <path d="M12 2l2.9 6.4 7.1.7-5.3 4.8 1.6 6.9L12 17.3 5.7 20.8l1.6-6.9L2 9.1l7.1-.7z"/>
                </svg>
                Yönetici
              </span>
              <span className="post-time">2 sa</span>
            </div>
            <div className="post-username">@kenar</div>
            <p className="post-text">
              Ekim ayının kitabı yarın açıklanıyor. Oylamaya katılmak için Kitap Odaları'na göz atın.
            </p>
          </div>
        </div>
      </div>

      {/* 2. Yazar Gönderisi (Elif Demir) */}
      <div className="post">
        <div className="post-head">
          <div 
            className="avatar" 
            style={{ width: '40px', height: '40px', background: 'linear-gradient(155deg,#AF52DE,#6d2f8f)' }}
          />
          <div style={{ flex: 1 }}>
            <div className="post-name-row">
              <span className="post-name">Elif Demir</span>
              <span className="badge badge-purple">
                <svg className="fill" viewBox="0 0 24 24">
                  <path d="M12 2l2.9 6.4 7.1.7-5.3 4.8 1.6 6.9L12 17.3 5.7 20.8l1.6-6.9L2 9.1l7.1-.7z"/>
                </svg>
                Yazar
              </span>
              <span className="post-time">5 sa</span>
            </div>
            <div className="post-username">@elifdemir</div>
            <p className="post-text">
              Kitabın üçüncü bölümü hakkında bu kadar çok konuşulmasını beklemiyordum. Kenar notlarınızı okumak çok kıymetliydi, teşekkürler.
            </p>
            <div 
              className="book-chip"
              onClick={() => openBook(FEATURED_COVERS.kayip_zaman)}
            >
              <BookCover 
                src={FEATURED_COVERS.kayip_zaman.cover} 
                title={FEATURED_COVERS.kayip_zaman.title || "Kayıp Zamanın İzinde"} 
                alt="Kayıp Zamanın İzinde" 
                className="cv" 
                style={{ borderRadius: '4px', boxShadow: '0 2px 5px rgba(0,0,0,0.18)' }} 
              />
              <div>
                <div className="bt">Kayıp Zamanın İzinde</div>
                <div className="ba">Marcel Proust</div>
              </div>
              <button 
                className="chip-add"
                title="İstek listeme ekle"
                onClick={(e) => {
                  e.stopPropagation();
                  showToast('Kayıp Zamanın İzinde istek listenize eklendi.', '❤️');
                }}
              >
                <svg className="icon icon-sm" viewBox="0 0 24 24">
                  <path d="M12 5v14M5 12h14"/>
                </svg>
              </button>
            </div>
            <div className="post-actions">
              <button 
                onClick={() => toggleLike('post2')}
                style={{ color: liked.post2 ? 'var(--red)' : 'var(--label-2)' }}
              >
                <svg className="icon icon-sm" viewBox="0 0 24 24" style={{ fill: liked.post2 ? 'currentColor' : 'none' }}>
                  <path d="M20.8 8.6c0 4.4-8.8 10-8.8 10s-8.8-5.6-8.8-10a4.6 4.6 0 0 1 8.8-2 4.6 4.6 0 0 1 8.8 2z"/>
                </svg>
                {likes.post2}
              </button>
              <button>
                <svg className="icon icon-sm" viewBox="0 0 24 24">
                  <path d="M21 11.5a8.5 8.5 0 0 1-8.5 8.5c-1.3 0-2.5-.28-3.6-.78L4 20l1.02-4.6A8.5 8.5 0 1 1 21 11.5z"/>
                </svg>
                44
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Çok Konuşuluyor Gönderisi (Mert Kaya) */}
      <div className="post">
        <div className="badge badge-red" style={{ marginBottom: '12px' }}>
          <svg viewBox="0 0 24 24">
            <path d="M3 17l6-6 4 4 8-8M21 7v6M21 7h-6"/>
          </svg>
          Çok konuşuluyor
        </div>
        <div className="post-head">
          <div className="avatar" style={{ width: '40px', height: '40px', background: 'linear-gradient(155deg,#5C6151,#2f3229)' }} />
          <div style={{ flex: 1 }}>
            <div className="post-name-row">
              <span className="post-name">Mert Kaya</span>
              <span className="post-time">1 gün</span>
            </div>
            <div className="post-username">@mertkaya</div>
            <p className="post-text">
              "Beyaz Gece"deki final beni hâlâ etkisi altında bırakıyor. Bu kitabı okumayanlara bile önerdim.
            </p>
            <div className="post-actions">
              <button 
                onClick={() => toggleLike('post3')}
                style={{ color: liked.post3 ? 'var(--red)' : 'var(--label-2)' }}
              >
                <svg className="icon icon-sm" viewBox="0 0 24 24" style={{ fill: liked.post3 ? 'currentColor' : 'none' }}>
                  <path d="M20.8 8.6c0 4.4-8.8 10-8.8 10s-8.8-5.6-8.8-10a4.6 4.6 0 0 1 8.8-2 4.6 4.6 0 0 1 8.8 2z"/>
                </svg>
                {likes.post3}
              </button>
              <button>
                <svg className="icon icon-sm" viewBox="0 0 24 24">
                  <path d="M21 11.5a8.5 8.5 0 0 1-8.5 8.5c-1.3 0-2.5-.28-3.6-.78L4 20l1.02-4.6A8.5 8.5 0 1 1 21 11.5z"/>
                </svg>
                96
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Cem Aydın Gönderisi */}
      <div className="post">
        <div className="post-head">
          <div className="avatar" style={{ width: '40px', height: '40px', background: 'linear-gradient(155deg,#8B4A34,#455C46)' }} />
          <div style={{ flex: 1 }}>
            <div className="post-name-row">
              <span className="post-name">Cem Aydın</span>
              <span className="post-time">1 gün</span>
            </div>
            <div className="post-username">@cemaydin</div>
            <p className="post-text">
              Ekim ayı için önerim: kısa ama yoğun bir novella olsun, uzun kitaplardan sonra biraz nefes alalım.
            </p>
          </div>
        </div>
      </div>

      {/* Dinamik Kullanıcı Gönderileri (Paylaşılan Yeni Düşünceler) */}
      {(posts || []).filter(p => !['post-1', 'post-2', 'post-3'].includes(p.id)).map(p => {
        const bookObj = p.bookId ? (books || []).find(b => b.id === p.bookId) : null;
        const isSpoilerPost = p.isSpoiler;
        const isRevealed = revealedSpoilers[p.id];

        return (
          <div key={p.id} className="post">
            <div className="post-head">
              <div 
                className="avatar" 
                style={{ 
                  width: '40px', 
                  height: '40px', 
                  backgroundImage: p.authorAvatar ? `url(${p.authorAvatar})` : currentUser?.avatar ? `url(${currentUser.avatar})` : 'none',
                  backgroundColor: '#8B4A34',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  flexShrink: 0
                }} 
              />
              <div style={{ flex: 1 }}>
                <div className="post-name-row">
                  <span className="post-name">{p.authorName || currentUser?.fullName || 'Okur'}</span>
                  <span className="post-time">{p.timestamp || p.createdAt || 'Az önce'}</span>
                </div>
                <div className="post-username">@{p.authorHandle || currentUser?.username || 'okur'}</div>

                {/* Spoiler Korumalı Metin */}
                {isSpoilerPost && !isRevealed ? (
                  <div 
                    className="spoiler-wrap" 
                    onClick={() => toggleSpoiler(p.id)}
                    style={{ position: 'relative', marginTop: '10px', cursor: 'pointer' }}
                  >
                    <p className="post-text blurred" style={{ filter: 'blur(6px)', userSelect: 'none', margin: 0 }}>
                      {p.content}
                    </p>
                    <div className="spoiler-overlay" style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                      <span className="badge badge-orange">
                        <svg viewBox="0 0 24 24">
                          <path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7z"/>
                          <line x1="3" y1="3" x2="21" y2="21"/>
                        </svg>
                        Spoiler içeriyor
                      </span>
                      <span style={{ fontSize: '11px', color: 'var(--label-2)', marginTop: '3px' }}>
                        Görmek için dokun
                      </span>
                    </div>
                  </div>
                ) : (
                  <p className="post-text">{p.content}</p>
                )}

                {/* Eklenen Kitap Çipi */}
                {bookObj && (
                  <div 
                    className="book-chip"
                    onClick={() => openBook(bookObj)}
                    style={{ cursor: 'pointer' }}
                  >
                    <BookCover 
                      src={bookObj.cover} 
                      title={bookObj.title} 
                      alt={bookObj.title} 
                      className="cv" 
                      style={{ borderRadius: '4px', boxShadow: '0 2px 5px rgba(0,0,0,0.18)' }} 
                    />
                    <div>
                      <div className="bt">{bookObj.title}</div>
                      <div className="ba">
                        {bookObj.author} {p.pageProgress ? `• s. ${p.pageProgress}` : ''}
                      </div>
                    </div>
                  </div>
                )}

                <div className="post-actions" style={{ marginTop: '12px' }}>
                  <button onClick={() => showToast('Beğenildi!', '❤️')}>
                    <svg className="icon icon-sm" viewBox="0 0 24 24">
                      <path d="M20.8 8.6c0 4.4-8.8 10-8.8 10s-8.8-5.6-8.8-10a4.6 4.6 0 0 1 8.8-2 4.6 4.6 0 0 1 8.8 2z"/>
                    </svg>
                    {p.likes ? p.likes.length : 0}
                  </button>
                  <button onClick={() => showToast('Yorumlar yakında açılacak.', '💬')}>
                    <svg className="icon icon-sm" viewBox="0 0 24 24">
                      <path d="M21 11.5a8.5 8.5 0 0 1-8.5 8.5c-1.3 0-2.5-.28-3.6-.78L4 20l1.02-4.6A8.5 8.5 0 1 1 21 11.5z"/>
                    </svg>
                    {p.comments ? p.comments.length : 0}
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
