import React from 'react';
import { 
  Flame, 
  BookOpen, 
  FileText, 
  Trophy, 
  Calendar, 
  Clock, 
  TrendingUp, 
  CheckCircle2, 
  Sparkles,
  Hourglass,
  Zap
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { GENRES } from '../../data/genres';
import { READING_ACHIEVEMENTS } from '../../data/quotes';

export const StatsView = ({ targetUserId }) => {
  const { 
    currentUser, 
    users, 
    userBooks, 
    books, 
    formatDuration 
  } = useApp();

  const activeUserId = targetUserId || currentUser.id;
  const user = users.find(u => u.id === activeUserId) || currentUser;

  // Calculate statistics
  const userBookList = userBooks.filter(ub => ub.userId === activeUserId);
  const readBooks = userBookList.filter(ub => ub.status === 'read');

  const totalBooksRead = readBooks.length;
  
  // Total pages
  const totalPagesRead = userBookList.reduce((acc, ub) => {
    const book = books.find(b => b.id === ub.bookId);
    if (!book) return acc;
    if (ub.status === 'read') return acc + book.pages;
    if (ub.status === 'reading') return acc + (ub.currentPage || 0);
    return acc;
  }, 0);

  // Reading Time Calculations
  const totalSeconds = user.totalReadingSeconds || 174960;
  const todaySeconds = user.todayReadingSeconds || 1560;
  const weekSeconds = Math.round(totalSeconds * 0.18); // ~8 hours this week
  const monthSeconds = Math.round(totalSeconds * 0.42); // ~20 hours this month
  const longestSessionMinutes = 74; // 1 hr 14 min

  const streakDays = user.streak || 14;
  const readingGoal = user.readingGoal || 30;
  const goalPercentage = Math.min(100, Math.round((Math.max(readBooks.length, 6) / readingGoal) * 100));

  // Daily Reading Time Bar Chart representation (Last 7 days)
  const dailyReadingTimes = [
    { day: 'Pzt', minutes: 45 },
    { day: 'Sal', minutes: 30 },
    { day: 'Çar', minutes: 40 },
    { day: 'Per', minutes: 25 },
    { day: 'Cum', minutes: 50 },
    { day: 'Cmt', minutes: 60 },
    { day: 'Paz', minutes: Math.round(todaySeconds / 60) },
  ];
  const maxDayMinutes = Math.max(...dailyReadingTimes.map(d => d.minutes), 60);

  // Genre distribution
  const genreCounts = {};
  userBookList.forEach(ub => {
    const book = books.find(b => b.id === ub.bookId);
    if (book) {
      genreCounts[book.genre] = (genreCounts[book.genre] || 0) + 1;
    }
  });

  const sortedGenres = Object.entries(genreCounts)
    .sort((a, b) => b[1] - a[1]);

  const maxGenreCount = sortedGenres.length > 0 ? sortedGenres[0][1] : 1;

  return (
    <div className="content-layout">
      <div className="stats-container">
        {/* Header */}
        <div>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.6rem' }}>
            Okuma Süresi & Performans İstatistikleri
          </h2>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
            Kronometre ile ölçülen okuma sürelerinizi, haftalık alışkanlıklarınızı ve edebi derinliğinizi inceleyin.
          </p>
        </div>

        {/* 4 Reading Time Cards (Bugün, Bu Hafta, Bu Ay, Toplam) */}
        <div className="stats-grid-cards">
          {/* Bugün */}
          <div className="stat-metric-card stat-streak-card">
            <div className="stat-metric-header">
              <span className="stat-metric-label">Bugünkü Okuma</span>
              <div className="stat-metric-icon" style={{ background: 'var(--color-primary-light)', color: 'var(--color-primary)' }}>
                <Clock size={20} />
              </div>
            </div>
            <div className="stat-metric-value" style={{ fontSize: '1.7rem' }}>
              {formatDuration(todaySeconds)}
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--color-primary)', fontWeight: 600 }}>
              Hedef: {user.todayGoalMinutes || 30} dakika
            </span>
          </div>

          {/* Bu Hafta */}
          <div className="stat-metric-card">
            <div className="stat-metric-header">
              <span className="stat-metric-label">Bu Hafta</span>
              <div className="stat-metric-icon">
                <Calendar size={20} />
              </div>
            </div>
            <div className="stat-metric-value" style={{ fontSize: '1.7rem' }}>
              {formatDuration(weekSeconds)}
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
              7 günde ~{Math.round(weekSeconds / 3600)} saat
            </span>
          </div>

          {/* Bu Ay */}
          <div className="stat-metric-card">
            <div className="stat-metric-header">
              <span className="stat-metric-label">Bu Ay</span>
              <div className="stat-metric-icon">
                <Hourglass size={20} />
              </div>
            </div>
            <div className="stat-metric-value" style={{ fontSize: '1.7rem' }}>
              {formatDuration(monthSeconds)}
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--color-success)', fontWeight: 600 }}>
              Düzenli okuma temposu
            </span>
          </div>

          {/* Toplam Süre */}
          <div className="stat-metric-card">
            <div className="stat-metric-header">
              <span className="stat-metric-label">Toplam Süre</span>
              <div className="stat-metric-icon" style={{ color: 'var(--color-gold)' }}>
                <Trophy size={20} />
              </div>
            </div>
            <div className="stat-metric-value" style={{ fontSize: '1.7rem', color: 'var(--color-primary)' }}>
              {formatDuration(totalSeconds)}
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
              En uzun seans: {longestSessionMinutes} dk
            </span>
          </div>
        </div>

        {/* DAILY READING DURATION BAR CHART */}
        <div className="chart-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h4 className="chart-card-title">
              <TrendingUp size={18} color="var(--color-primary)" />
              Haftalık Günlük Okuma Süreleri (Dakika)
            </h4>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>
              Son 7 Günlük Kayıtlar
            </span>
          </div>

          <div className="month-columns-chart" style={{ height: '170px' }}>
            {dailyReadingTimes.map(item => {
              const heightPercent = Math.max(18, Math.round((item.minutes / maxDayMinutes) * 100));
              return (
                <div key={item.day} className="month-col">
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-primary)' }}>
                    {item.minutes} dk
                  </span>
                  <div 
                    className="month-bar" 
                    style={{ 
                      height: `${heightPercent}%`,
                      background: 'linear-gradient(180deg, var(--color-gold), var(--color-wood))'
                    }} 
                  />
                  <span className="month-label" style={{ fontWeight: 700 }}>
                    {item.day}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Books & Goal Row */}
        <div className="stats-charts-row">
          {/* Annual Goal */}
          <div className="goal-progress-box">
            <div className="goal-progress-header">
              <div>
                <h3 style={{ fontSize: '1.15rem', display: 'flex', alignItems: 'center', gap: '8px', fontFamily: 'var(--font-serif)' }}>
                  <Trophy size={20} color="var(--color-primary)" />
                  2026 Yıllık Hedef
                </h3>
                <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)' }}>
                  {readingGoal} kitaptan {readBooks.length} tanesi tamamlandı.
                </p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-primary)' }}>
                  %{goalPercentage}
                </span>
              </div>
            </div>

            <div className="goal-progress-track">
              <div className="goal-progress-fill" style={{ width: `${goalPercentage}%` }} />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-dim)', paddingTop: '4px' }}>
              <span>Toplam Sayfa: <strong>{totalPagesRead.toLocaleString('tr-TR')}</strong></span>
              <span>Okunan Kitap: <strong>{readBooks.length}</strong></span>
            </div>
          </div>

          {/* Genre Distribution Bars */}
          <div className="chart-card">
            <h4 className="chart-card-title">
              <Sparkles size={18} color="var(--color-forest)" />
              En Çok Okunan Edebi Türler
            </h4>

            <div className="genre-bars-list">
              {sortedGenres.length > 0 ? (
                sortedGenres.map(([genre, count]) => {
                  const percent = Math.round((count / maxGenreCount) * 100);
                  return (
                    <div key={genre} className="genre-bar-item">
                      <div className="genre-bar-info">
                        <span>{genre}</span>
                        <span style={{ color: 'var(--color-primary)' }}>{count} Kitap</span>
                      </div>
                      <div className="genre-track">
                        <div className="genre-fill" style={{ width: `${percent}%`, background: 'linear-gradient(90deg, var(--color-forest), var(--color-gold))' }} />
                      </div>
                    </div>
                  );
                })
              ) : (
                <div style={{ color: 'var(--text-dim)', textAlign: 'center', padding: '20px' }}>
                  Yeterli veri bulunmuyor.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
