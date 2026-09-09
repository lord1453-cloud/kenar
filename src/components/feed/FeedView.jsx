import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { FEATURED_COVERS } from '../../data/featuredBooksCovers';
import { BookCover } from '../common/BookCover';

export const FeedView = () => {
  const { posts, openBook, currentUser, books, createPost, showToast } = useApp();
  
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

  return (
    <div className="content">
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
