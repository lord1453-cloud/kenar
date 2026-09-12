import React, { useState } from 'react';
import { 
  Heart, 
  MessageCircle, 
  Share2, 
  Eye, 
  EyeOff, 
  Send, 
  Star, 
  Bookmark, 
  AlertTriangle,
  Plus,
  Check,
  Pin,
  Flame,
  Sparkles
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { BookCover } from '../common/BookCover';

export const PostCard = ({ post }) => {
  const { 
    users, 
    books, 
    currentUser, 
    toggleLikePost, 
    addComment, 
    setSelectedBookId, 
    setViewingUserId, 
    setActiveTab, 
    showToast,
    addToWishlist,
    isInWishlist
  } = useApp();

  const [showSpoiler, setShowSpoiler] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');

  const author = users.find(u => u.id === post.userId) || {
    fullName: 'Anonim Okur',
    username: 'anonim',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&h=100&q=80'
  };

  const attachedBook = post.bookId ? books.find(b => b.id === post.bookId) : null;
  const isLiked = post.likes.includes(currentUser.id);
  const inWishlist = attachedBook ? isInWishlist(attachedBook.id) : false;

  const isAdminAuthor = author.role === 'admin' || author.role === 'founder';
  const isAdminPost = isAdminAuthor || post.isAdminNotice || post.isAnnouncement;

  const handleAuthorClick = () => {
    if (isAdminAuthor && (!currentUser || currentUser.id !== author.id)) {
      showToast('Yönetici profili gizlidir. Yöneticiler yalnızca ana akışta ve bildirilerde görünür.', '🛡️');
      return;
    }
    setViewingUserId(author.id);
    setActiveTab('profile');
  };

  const handleBookClick = () => {
    if (attachedBook) {
      setSelectedBookId(attachedBook.id);
    }
  };

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    addComment(post.id, commentText);
    setCommentText('');
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(`${window.location.origin}/#post-${post.id}`);
      showToast('Gönderi bağlantısı panoya kopyalandı!', '🔗');
    }
  };

  return (
    <article className={`post-card ${post.isAnnouncement ? 'post-card-announcement' : ''}`}>
      {/* Sabitlenmiş Uyarı / Duyuru Başlığı (Doküman Paragraf 5) */}
      {post.isAnnouncement && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '8px 14px',
          background: 'rgba(245, 158, 11, 0.1)',
          borderRadius: 'var(--radius-md) var(--radius-md) 0 0',
          borderBottom: '1px solid rgba(245, 158, 11, 0.2)',
          marginBottom: '10px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#d97706', fontSize: '0.82rem', fontWeight: 700 }}>
            <Pin size={14} />
            <span>Kulüp Duyurusu & Uyarı</span>
          </div>
          <span className="badge-announcement">Önemli</span>
        </div>
      )}

      {/* Header: Author info & Badges */}
      <div className="post-header">
        <div className="post-author-info" onClick={handleAuthorClick}>
          <img 
            src={author.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&h=200&q=80'} 
            alt={author.fullName} 
            className="post-avatar" 
            style={{ filter: author.isBlurred ? 'blur(6px)' : 'none' }}
            onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&h=200&q=80'; }}
          />
          <div className="post-author-names">
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
              <span className="post-author-name">{author.fullName}</span>

              {/* Yazarlara özel mor/ametist yıldız rozeti (Doküman Paragraf 5) */}
              {author.role === 'author' && (
                <span className="badge-author" title="Doğrulanmış Yazar">
                  ★ Yazar
                </span>
              )}

              {/* Adminlere özel altın/amber yıldız rozeti (Doküman Paragraf 5) */}
              {(author.role === 'admin' || author.role === 'founder') && (
                <span className="badge-admin" title={author.role === 'founder' ? 'Kurucu' : 'Yönetici'}>
                  ★ {author.role === 'founder' ? 'Kurucu' : 'Yönetici'}
                </span>
              )}
            </div>
            <span className="post-time">@{author.username} • {post.timestamp}</span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {/* Trend Rozeti (Doküman Paragraf 7) */}
          {(post.isTrending || (post.likes && post.likes.length >= 4)) && (
            <span className="badge-trending" title="Çok etkileşim alan gönderi">
              <Flame size={12} />
              Öne Çıkan
            </span>
          )}

          {post.isSpoiler && (
            <span className="badge badge-spoiler">
              <AlertTriangle size={12} />
              Spoiler
            </span>
          )}
        </div>
      </div>

      {/* Attached Book with Quick '+' Wishlist Button (Doküman Paragraf 9) */}
      {attachedBook && (
        <div className="post-book-attachment" onClick={handleBookClick} title="Kitap detayını görüntüle">
          <BookCover src={attachedBook.cover} title={attachedBook.title} alt={attachedBook.title} className="post-book-cover" />
          <div className="post-book-details">
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px' }}>
              <div>
                <span className="post-book-title">{attachedBook.title}</span>
                <span className="post-book-author">{attachedBook.author}</span>
              </div>

              {/* Hızlı İstek Sepetine Ekle (+) Butonu */}
              <button
                className={`btn-quick-add ${inWishlist ? 'in-wishlist' : ''}`}
                title={inWishlist ? 'İstek sepetinizde bulunuyor' : 'İstek sepetine ekle (+)'}
                onClick={(e) => {
                  e.stopPropagation();
                  addToWishlist(attachedBook.id);
                }}
              >
                {inWishlist ? <Check size={14} /> : <Plus size={16} />}
              </button>
            </div>

            {post.pageProgress && (
              <div style={{ marginTop: '2px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span className="post-progress-text">
                    {post.pageProgress.current} / {post.pageProgress.total} sayfa
                  </span>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-primary)' }}>
                    %{Math.round((post.pageProgress.current / post.pageProgress.total) * 100)}
                  </span>
                </div>
                <div className="post-progress-bar-wrap">
                  <div 
                    className="post-progress-bar-fill" 
                    style={{ width: `${Math.min(100, Math.round((post.pageProgress.current / post.pageProgress.total) * 100))}%` }} 
                  />
                </div>
              </div>
            )}

            {post.rating && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}>
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    size={14} 
                    fill={i < post.rating ? '#f59e0b' : 'transparent'} 
                    color={i < post.rating ? '#f59e0b' : 'var(--text-dim)'} 
                  />
                ))}
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#f59e0b', marginLeft: '4px' }}>
                  {post.rating} / 5
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Post Text Content */}
      <div className="post-content-text">
        {post.content}
      </div>

      {/* Spoiler Content (if present) */}
      {post.isSpoiler && (
        <div className="spoiler-container">
          <div className={!showSpoiler ? 'spoiler-blurred' : ''} style={{ padding: '8px 0' }}>
            {post.spoilerText || 'Kitabın sonu ve dönüm noktaları hakkında kritik detaylar içerir.'}
          </div>

          {!showSpoiler && (
            <div className="spoiler-overlay-card">
              <span className="spoiler-warning-title">
                <AlertTriangle size={18} />
                Bu kısım kitap hakkında spoiler barındırıyor!
              </span>
              <button 
                className="btn btn-secondary btn-sm"
                onClick={() => setShowSpoiler(true)}
              >
                <Eye size={15} />
                Spoileri Göster
              </button>
            </div>
          )}

          {showSpoiler && (
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '6px' }}>
              <button 
                className="btn btn-ghost btn-sm" 
                style={{ fontSize: '0.76rem', color: 'var(--text-dim)' }}
                onClick={() => setShowSpoiler(false)}
              >
                <EyeOff size={13} />
                Spoileri Gizle
              </button>
            </div>
          )}
        </div>
      )}

      {/* Footer Actions (Like, Comment, Share) */}
      <div className="post-footer">
        {isAdminPost ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', fontSize: '0.82rem', padding: '4px 0' }}>
            <span className="badge-admin" style={{ fontSize: '0.74rem', padding: '3px 8px' }}>Resmi Bildiri</span>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-dim)', fontStyle: 'italic' }}>
              Bu bildiri yoruma ve beğeniye kapalıdır.
            </span>
          </div>
        ) : (
          <div className="post-footer-actions">
            {/* Like Button */}
            <button 
              className={`post-stat-btn ${isLiked ? 'liked' : ''}`}
              onClick={() => toggleLikePost(post.id)}
            >
              <Heart size={18} />
              <span>{post.likes.length}</span>
            </button>

            {/* Comments Toggle */}
            <button 
              className="post-stat-btn"
              onClick={() => setShowComments(prev => !prev)}
            >
              <MessageCircle size={18} />
              <span>{post.comments.length}</span>
            </button>
          </div>
        )}

        {/* Share Button */}
        <button className="post-stat-btn" onClick={handleShare} title="Paylaş">
          <Share2 size={17} />
        </button>
      </div>

      {/* Comments Section (Only for regular interactive posts) */}
      {!isAdminPost && showComments && (
        <div className="post-comments-container">
          {/* Comment Form */}
          <form className="comment-input-row" onSubmit={handleCommentSubmit}>
            <img src={currentUser.avatar} alt={currentUser.fullName} className="comment-avatar" />
            <input 
              type="text" 
              placeholder="Düşünceni paylaş veya soru sor..." 
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              className="comment-input"
            />
            <button type="submit" className="btn btn-primary btn-sm" disabled={!commentText.trim()}>
              <Send size={14} />
            </button>
          </form>

          {/* Comments List */}
          {post.comments.length > 0 ? (
            <div className="comment-list">
              {post.comments.map(comment => {
                const commentUser = users.find(u => u.id === comment.userId) || {
                  fullName: 'Kullanıcı',
                  username: 'kullanici',
                  avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&h=100&q=80'
                };
                return (
                  <div key={comment.id} className="comment-item">
                    <img 
                      src={commentUser.avatar} 
                      alt="" 
                      className="comment-avatar" 
                      onClick={() => {
                        setViewingUserId(commentUser.id);
                        setActiveTab('profile');
                      }}
                      style={{ cursor: 'pointer' }}
                    />
                    <div className="comment-bubble">
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span 
                          className="comment-user-name"
                          onClick={() => {
                            setViewingUserId(commentUser.id);
                            setActiveTab('profile');
                          }}
                          style={{ cursor: 'pointer' }}
                        >
                          {commentUser.fullName}
                        </span>
                        <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>
                          {comment.timestamp}
                        </span>
                      </div>
                      <p className="comment-text">{comment.text}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div style={{ fontSize: '0.82rem', color: 'var(--text-dim)', textAlign: 'center', padding: '6px' }}>
              İlk yorumu sen yaz!
            </div>
          )}
        </div>
      )}
    </article>
  );
};
