import React, { useState } from 'react';
import { MessageSquare, BookOpen, Star, Filter } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { PostCard } from '../feed/PostCard';

export const ThoughtsView = () => {
  const { posts, books, reviews, setSelectedBookId } = useApp();
  const [selectedGenre, setSelectedGenre] = useState('all');

  // Filter posts that are discussion / review oriented
  const thoughtPosts = posts.filter(post => {
    if (selectedGenre === 'all') return true;
    const book = books.find(b => b.id === post.bookId);
    return book?.genre === selectedGenre;
  });

  const genres = ['all', ...new Set(books.map(b => b.genre))];

  return (
    <div className="content-layout">
      <div style={{ maxWidth: '780px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        
        {/* Header */}
        <div style={{ borderBottom: '1px solid var(--border-subtle)', paddingBottom: '16px' }}>
          <h1 style={{ fontSize: '1.4rem', fontWeight: 600, color: 'var(--text-main)', margin: 0 }}>
            Düşünceler & Değerlendirmeler
          </h1>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            Kitaplar hakkında yazılan derin analizler, okuma notları ve okurların paylaştığı düşünceler.
          </p>
        </div>

        {/* Genre Filter Pills */}
        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
          {genres.map(genre => (
            <button
              key={genre}
              className={`btn btn-sm ${selectedGenre === genre ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setSelectedGenre(genre)}
            >
              {genre === 'all' ? 'Tüm Düşünceler' : genre}
            </button>
          ))}
        </div>

        {/* Posts Stream */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {thoughtPosts.length > 0 ? (
            thoughtPosts.map(post => (
              <PostCard key={post.id} post={post} />
            ))
          ) : (
            <div style={{ textAlign: 'center', padding: '40px', background: 'var(--bg-surface)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', color: 'var(--text-muted)' }}>
              Bu kategoride henüz bir düşünce paylaşılmamış.
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
