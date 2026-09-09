import React, { useState } from 'react';
import { Calendar as CalendarIcon, CheckCircle, ChevronLeft, ChevronRight, Plus, Sparkles, BookOpen, Clock } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const ReadingGoalCalendar = ({ user }) => {
  const { books, userBooks, readingCalendarLogs, logCalendarReading, showToast } = useApp();

  const [selectedDay, setSelectedDay] = useState(null);
  const [logBookId, setLogBookId] = useState(books[0]?.id || '');
  const [logPages, setLogPages] = useState('25');
  const [logNote, setLogNote] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Mevcut ay: Eylül 2026 (30 gün)
  const currentMonthName = 'Eylül 2026';
  const daysInMonth = 30;
  const startDayOffset = 1; // Salı başlangıcı

  // Kullanıcının okuma kitapları
  const userReadingBooks = books;

  // Kitaplara göre tema renk paleti (Doküman Paragraf 25: "kitabın tema renklerine uygun")
  const bookColorMap = {
    'book-1': { bg: '#F6D883', text: '#191919', name: 'Dune (Sarı)' },
    'book-2': { bg: '#97C2EC', text: '#191919', name: '1984 (Mavi)' },
    'book-3': { bg: '#E7C58A', text: '#191919', name: 'Saatleri Ayarlama (Kum)' },
    'book-4': { bg: '#86B05D', text: '#ffffff', name: 'Harry Potter (Yeşil)' },
    'book-5': { bg: '#DF5940', text: '#ffffff', name: 'Yabancı (Mercan)' },
    'book-6': { bg: '#5758A6', text: '#ffffff', name: 'Zweig (Vintage)' },
    'book-7': { bg: '#FCD5D3', text: '#191919', name: 'Cholesterol Myth (Pembe)' },
    'book-8': { bg: '#C77974', text: '#ffffff', name: 'Mapmaker (Gül)' }
  };

  const getLogForDay = (dayNum) => {
    const dateStr = `2026-09-${dayNum.toString().padStart(2, '0')}`;
    return readingCalendarLogs.find(l => l.date === dateStr);
  };

  const handleDayClick = (dayNum) => {
    setSelectedDay(dayNum);
    const existing = getLogForDay(dayNum);
    if (existing) {
      setLogBookId(existing.bookId);
      setLogPages(existing.pagesRead.toString());
      setLogNote(existing.note || '');
    } else {
      setLogPages('30');
      setLogNote('');
    }
    setIsModalOpen(true);
  };

  const handleSaveLog = (e) => {
    e.preventDefault();
    if (!selectedDay) return;
    const dateStr = `2026-09-${selectedDay.toString().padStart(2, '0')}`;
    logCalendarReading({
      date: dateStr,
      bookId: logBookId,
      pagesRead: parseInt(logPages, 10) || 0,
      note: logNote
    });
    setIsModalOpen(false);
  };

  // Ay içindeki toplam okuma yapılan gün sayısı
  const loggedDaysCount = Array.from({ length: daysInMonth }, (_, i) => i + 1)
    .filter(d => getLogForDay(d)).length;

  return (
    <div className="reading-calendar-card glass-panel">
      <div className="reading-calendar-header">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--color-primary)', fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.4px' }}>
            <CalendarIcon size={14} />
            <span>Aylık Okuma Hedefi Takvimi</span>
          </div>
          <h3 style={{ margin: '3px 0 0', fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-main)' }}>
            {currentMonthName}
          </h3>
          <p style={{ margin: '2px 0 0', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
            Hedef: Bu ay 20 gün okuma yap • Tamamlanan: <strong>{loggedDaysCount} / 20 gün</strong>
          </p>
        </div>

        <button 
          className="btn btn-secondary btn-sm"
          onClick={() => handleDayClick(new Date().getDate() || 6)}
          style={{ fontSize: '0.8rem' }}
        >
          <Plus size={14} />
          Bugünü İşaretle
        </button>
      </div>

      {/* Gün İsimleri */}
      <div className="calendar-weekdays-row">
        {['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'].map(w => (
          <div key={w} className="calendar-weekday-lbl">{w}</div>
        ))}
      </div>

      {/* Takvim Günleri */}
      <div className="calendar-days-grid">
        {/* Başlangıç boşluğu */}
        {Array.from({ length: startDayOffset }).map((_, i) => (
          <div key={`empty-${i}`} className="calendar-day-empty" />
        ))}

        {/* Günler 1 - 30 */}
        {Array.from({ length: daysInMonth }, (_, i) => {
          const dayNum = i + 1;
          const log = getLogForDay(dayNum);
          const bookColor = log ? (bookColorMap[log.bookId] || { bg: 'var(--color-sunflower)', text: '#191919' }) : null;
          const isToday = dayNum === 6;

          return (
            <div
              key={dayNum}
              className={`calendar-day-cell ${log ? 'has-read' : ''} ${isToday ? 'is-today' : ''}`}
              onClick={() => handleDayClick(dayNum)}
              title={log ? `${dayNum} Eylül: ${log.pagesRead} sayfa okundu (${log.note || 'Kayıt'})` : `${dayNum} Eylül: Okuma kaydı eklemek için tıkla`}
            >
              <span className="cal-day-num">{dayNum}</span>

              {log && (
                <div 
                  className="cal-book-dot-indicator" 
                  style={{ backgroundColor: bookColor.bg, color: bookColor.text }}
                >
                  <span className="cal-dot-pages">{log.pagesRead}sf</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Renk Lejantı (Doküman Paragraf 25: Kitap renkleriyle uyumlu) */}
      <div className="calendar-legend-bar">
        <span style={{ fontSize: '0.74rem', color: 'var(--text-dim)', fontWeight: 600 }}>Kitap Renkleri:</span>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
          {books.slice(0, 4).map(b => {
            const color = bookColorMap[b.id] || { bg: '#F6D883', text: '#191919' };
            return (
              <div key={b.id} style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: color.bg }} />
                <span style={{ maxWidth: '100px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {b.title}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Günlük Okuma Kaydı Ekleme Modalı */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content" style={{ maxWidth: '440px' }} onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3 style={{ margin: 0, fontSize: '1.1rem' }}>
                {selectedDay} Eylül Okuma Kaydı
              </h3>
              <button className="btn btn-ghost btn-sm" onClick={() => setIsModalOpen(false)}>✕</button>
            </div>
            
            <form onSubmit={handleSaveLog} className="modal-body">
              <div>
                <label style={{ fontSize: '0.84rem', fontWeight: 600, color: 'var(--text-main)', display: 'block', marginBottom: '6px' }}>
                  Okunan Kitap:
                </label>
                <select 
                  value={logBookId} 
                  onChange={e => setLogBookId(e.target.value)}
                  style={{ width: '100%', padding: '10px', borderRadius: 'var(--radius-sm)' }}
                >
                  {userReadingBooks.map(b => (
                    <option key={b.id} value={b.id}>{b.title} ({b.author})</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.84rem', fontWeight: 600, color: 'var(--text-main)', display: 'block', marginBottom: '6px' }}>
                  Okunan Sayfa Sayısı:
                </label>
                <input 
                  type="number" 
                  min="1" 
                  max="999" 
                  value={logPages}
                  onChange={e => setLogPages(e.target.value)}
                  style={{ width: '100%', padding: '10px', borderRadius: 'var(--radius-sm)' }}
                  required
                />
              </div>

              <div>
                <label style={{ fontSize: '0.84rem', fontWeight: 600, color: 'var(--text-main)', display: 'block', marginBottom: '6px' }}>
                  Kısa Okuma Notu / Bölüm:
                </label>
                <input 
                  type="text" 
                  placeholder="örn. 3. Bölüm, Paul'ün çöl yolculuğu..." 
                  value={logNote}
                  onChange={e => setLogNote(e.target.value)}
                  style={{ width: '100%', padding: '10px', borderRadius: 'var(--radius-sm)' }}
                />
              </div>

              <div className="modal-footer" style={{ padding: '12px 0 0', display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                <button type="button" className="btn btn-ghost" onClick={() => setIsModalOpen(false)}>
                  Vazgeç
                </button>
                <button type="submit" className="btn btn-primary">
                  Kaydet & Takvime İşle
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
