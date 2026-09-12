import React, { useState, useRef, useEffect } from 'react';
import { Calendar as CalendarIcon, CheckCircle, ChevronLeft, ChevronRight, Plus, Sparkles, BookOpen, Clock, Trash2, Search, Check } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { BookCover } from '../common/BookCover';

export const ReadingGoalCalendar = ({ user }) => {
  const { books, userBooks, readingCalendarLogs, logCalendarReading, deleteCalendarReading, showToast } = useApp();

  const [selectedDay, setSelectedDay] = useState(null);
  const [logBookId, setLogBookId] = useState(books[0]?.id || '');
  const [bookInputText, setBookInputText] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [logPages, setLogPages] = useState('25');
  const [logNote, setLogNote] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const suggestionRef = useRef(null);

  // Mevcut ay: Eylül 2026 (30 gün)
  const currentMonthName = 'Eylül 2026';
  const daysInMonth = 30;
  const startDayOffset = 1; // Salı başlangıcı

  // Kitaplara göre tema renk paleti (Doküman Paragraf 25)
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
    return (readingCalendarLogs || []).find(l => l.date === dateStr);
  };

  const handleDayClick = (dayNum) => {
    setSelectedDay(dayNum);
    const existing = getLogForDay(dayNum);
    if (existing) {
      setLogBookId(existing.bookId || '');
      const existingBook = books.find(b => b.id === existing.bookId);
      setBookInputText(existing.customBookTitle || existingBook?.title || existing.bookTitle || '');
      setLogPages((existing.pagesRead || 30).toString());
      setLogNote(existing.note || '');
    } else {
      const defaultBook = books[0];
      setLogBookId(defaultBook ? defaultBook.id : '');
      setBookInputText(defaultBook ? defaultBook.title : '');
      setLogPages('30');
      setLogNote('');
    }
    setShowSuggestions(false);
    setIsModalOpen(true);
  };

  // Kullanıcı yazdıkça önerilen kitaplar algoritması
  const suggestedBooks = bookInputText.trim() ? (books || []).filter(b => {
    const q = bookInputText.toLowerCase();
    return (b.title || '').toLowerCase().includes(q) || (b.author || '').toLowerCase().includes(q);
  }).slice(0, 6) : [];

  const handleSelectSuggestedBook = (book) => {
    setLogBookId(book.id);
    setBookInputText(book.title);
    setShowSuggestions(false);
  };

  const handleSaveLog = (e) => {
    e.preventDefault();
    if (!selectedDay) return;
    const dateStr = `2026-09-${selectedDay.toString().padStart(2, '0')}`;

    // Eğer yazılan isim mevcut bir kitapla eşleşiyorsa id'sini al
    const matchedBook = (books || []).find(b => b.title.toLowerCase() === bookInputText.trim().toLowerCase());
    const finalBookId = matchedBook ? matchedBook.id : (logBookId || null);

    logCalendarReading({
      date: dateStr,
      bookId: finalBookId,
      customBookTitle: bookInputText.trim(),
      pagesRead: parseInt(logPages, 10) || 0,
      note: logNote
    });
    setIsModalOpen(false);
  };

  const handleDeleteLog = () => {
    if (!selectedDay) return;
    const dateStr = `2026-09-${selectedDay.toString().padStart(2, '0')}`;
    if (window.confirm(`${selectedDay} Eylül tarihindeki okuma kaydını silmek istiyor musunuz?`)) {
      deleteCalendarReading(dateStr);
      setIsModalOpen(false);
    }
  };

  // Ay içindeki toplam okuma yapılan gün sayısı
  const loggedDaysCount = Array.from({ length: daysInMonth }, (_, i) => i + 1)
    .filter(d => getLogForDay(d)).length;

  return (
    <div className="reading-calendar-card glass-panel" style={{ padding: '24px', borderRadius: 'var(--radius-lg)', background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)' }}>
      <div className="reading-calendar-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '14px', marginBottom: '20px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--color-primary)', fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.4px' }}>
            <CalendarIcon size={14} />
            <span>Aylık Okuma Hedefi Takvimi</span>
          </div>
          <h3 style={{ margin: '3px 0 0', fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)' }}>
            {currentMonthName}
          </h3>
          <p style={{ margin: '2px 0 0', fontSize: '0.84rem', color: 'var(--text-muted)' }}>
            Hedef: Bu ay 20 gün okuma yap • Tamamlanan: <strong>{loggedDaysCount} / 20 gün</strong>
          </p>
        </div>

        <button 
          className="btn btn-secondary btn-sm"
          onClick={() => handleDayClick(new Date().getDate() || 6)}
          style={{ fontSize: '0.82rem', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
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
          const matchedBook = log?.bookId ? books.find(b => b.id === log.bookId) : null;
          const bookColor = log?.bookId && bookColorMap[log.bookId] ? bookColorMap[log.bookId] : { bg: '#F6D883', text: '#191919' };
          const isToday = dayNum === 6;

          return (
            <div
              key={dayNum}
              className={`calendar-day-cell ${log ? 'has-read' : ''} ${isToday ? 'is-today' : ''}`}
              onClick={() => handleDayClick(dayNum)}
              title={log ? `${dayNum} Eylül: ${log.pagesRead} sayfa okundu (${log.customBookTitle || matchedBook?.title || 'Kayıt'})` : `${dayNum} Eylül: Okuma kaydı eklemek için tıkla`}
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

      {/* Renk Lejantı */}
      <div className="calendar-legend-bar" style={{ marginTop: '16px', display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
        <span style={{ fontSize: '0.76rem', color: 'var(--text-dim)', fontWeight: 600 }}>Kitap Renkleri:</span>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
          {books.slice(0, 4).map(b => {
            const color = bookColorMap[b.id] || { bg: '#F6D883', text: '#191919' };
            return (
              <div key={b.id} style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: color.bg }} />
                <span style={{ maxWidth: '110px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {b.title}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Günlük Okuma Kaydı Ekleme / Düzenleme & Silme Modalı */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content" style={{ maxWidth: '460px' }} onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3 style={{ margin: 0, fontSize: '1.15rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CalendarIcon size={18} color="var(--color-primary)" />
                {selectedDay} Eylül Okuma Kaydı
              </h3>
              <button className="btn btn-ghost btn-sm" onClick={() => setIsModalOpen(false)}>✕</button>
            </div>
            
            <form onSubmit={handleSaveLog} className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              
              {/* KİTAP ADI YAZMA VE ALTINDA OTOMATİK ÖNERİ ALGORİTMASI */}
              <div style={{ position: 'relative' }}>
                <label style={{ fontSize: '0.84rem', fontWeight: 600, color: 'var(--text-main)', display: 'block', marginBottom: '6px' }}>
                  Okunan Kitap Adı (Yazarak Arayın veya Kendiniz Girin):
                </label>
                <div style={{ position: 'relative' }}>
                  <input 
                    type="text"
                    required
                    placeholder="Kitap adını yazmaya başlayın..."
                    value={bookInputText}
                    onChange={(e) => {
                      setBookInputText(e.target.value);
                      setShowSuggestions(true);
                    }}
                    onFocus={() => setShowSuggestions(true)}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)', background: 'var(--bg-surface-elevated)', color: 'var(--text-main)', fontSize: '0.9rem' }}
                  />
                  <Search size={16} color="var(--text-dim)" style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                </div>

                {/* Öneri Algoritması Açılır Listesi */}
                {showSuggestions && suggestedBooks.length > 0 && (
                  <div 
                    ref={suggestionRef}
                    style={{
                      position: 'absolute',
                      top: '100%',
                      left: 0,
                      right: 0,
                      background: 'var(--bg-surface)',
                      border: '1px solid var(--border-strong)',
                      borderRadius: 'var(--radius-md)',
                      boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
                      zIndex: 100,
                      marginTop: '4px',
                      maxHeight: '220px',
                      overflowY: 'auto'
                    }}
                  >
                    <div style={{ padding: '6px 10px', fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-dim)', borderBottom: '1px solid var(--border-subtle)', textTransform: 'uppercase' }}>
                      Kütüphane Önerileri ({suggestedBooks.length})
                    </div>
                    {suggestedBooks.map(b => (
                      <div
                        key={b.id}
                        onClick={() => handleSelectSuggestedBook(b)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                          padding: '8px 12px',
                          cursor: 'pointer',
                          borderBottom: '1px solid var(--border-subtle)',
                          transition: 'background 0.15s ease'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-surface-elevated)'}
                        onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                      >
                        <div style={{ width: '28px', height: '40px', borderRadius: '3px', overflow: 'hidden', flexShrink: 0 }}>
                          <BookCover src={b.cover} title={b.title} alt={b.title} style={{ width: '100%', height: '100%' }} />
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: '0.86rem', fontWeight: 600, color: 'var(--text-main)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {b.title}
                          </div>
                          <div style={{ fontSize: '0.74rem', color: 'var(--text-dim)' }}>
                            {b.author}
                          </div>
                        </div>
                        {logBookId === b.id && <Check size={14} color="var(--color-primary)" />}
                      </div>
                    ))}
                  </div>
                )}
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
                  style={{ width: '100%', padding: '10px 14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)', background: 'var(--bg-surface-elevated)', color: 'var(--text-main)', fontSize: '0.9rem' }}
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
                  style={{ width: '100%', padding: '10px 14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)', background: 'var(--bg-surface-elevated)', color: 'var(--text-main)', fontSize: '0.9rem' }}
                />
              </div>

              <div className="modal-footer" style={{ padding: '12px 0 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
                {/* SİLME BUTONU: Eğer gün için zaten bir kayıt varsa silme seçeneği */}
                {getLogForDay(selectedDay) ? (
                  <button 
                    type="button" 
                    className="btn btn-secondary"
                    onClick={handleDeleteLog}
                    style={{ color: 'var(--color-danger)', borderColor: 'rgba(239, 68, 68, 0.4)', display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem' }}
                  >
                    <Trash2 size={14} />
                    <span>Kaydı Sil</span>
                  </button>
                ) : <div />}

                <div style={{ display: 'flex', gap: '8px' }}>
                  <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>
                    Vazgeç
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Kaydet & Takvime İşle
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
