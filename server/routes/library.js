import express from 'express';
import { db } from '../db/database.js';
import { requireAuth } from '../middleware/authAndPlatform.js';

const router = express.Router();

// Tüm kitapları getir
router.get('/books', (req, res) => {
  const books = db.get('books');
  res.json(books);
});

// Belirli bir kitabın detayı
router.get('/books/:id', (req, res) => {
  const book = db.get('books').find(b => b.id === req.params.id);
  if (!book) return res.status(404).json({ error: 'Kitap bulunamadı.' });
  res.json(book);
});

// Kullanıcının kitaplığını getir (veya belirtilen kullanıcının)
router.get('/user-books', (req, res) => {
  const userId = req.query.userId || (req.user ? req.user.id : null);
  const userBooks = db.get('userBooks');
  if (userId) {
    return res.json(userBooks.filter(ub => ub.userId === userId));
  }
  res.json(userBooks);
});

// Kitaplığa kitap ekle veya durumunu güncelle
router.post('/user-books', requireAuth, (req, res) => {
  const { bookId, status, rating, notes } = req.body;
  const userId = req.user.id;
  const book = db.get('books').find(b => b.id === bookId);

  if (!book) {
    return res.status(404).json({ error: 'Kitap bulunamadı.' });
  }

  const existing = db.get('userBooks').find(ub => ub.userId === userId && ub.bookId === bookId);

  if (existing) {
    const updated = db.update('userBooks', ub => ub.id === existing.id, ub => ({
      ...ub,
      status: status || ub.status,
      rating: rating !== undefined ? rating : ub.rating,
      notes: notes !== undefined ? notes : ub.notes,
      updatedAt: new Date().toISOString()
    }));
    return res.json({ success: true, userBook: updated });
  }

  const newEntry = {
    id: `ub-${Date.now()}`,
    userId,
    bookId,
    status: status || 'want_to_read', // 'reading' | 'completed' | 'want_to_read'
    currentPage: 0,
    totalPages: book.pageCount || 200,
    progressPercentage: 0,
    startDate: status === 'reading' ? new Date().toISOString().split('T')[0] : null,
    finishDate: null,
    rating: rating || 0,
    notes: notes || '',
    isPrivate: false,
    addedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  db.insert('userBooks', newEntry);
  res.status(201).json({ success: true, userBook: newEntry });
});

// Sayfa İlerlemesini Güncelle (Web, iOS, Android senkron)
router.patch('/user-books/:id/progress', requireAuth, (req, res) => {
  const { id } = req.params;
  const { currentPage, status } = req.body;

  const entry = db.get('userBooks').find(ub => ub.id === id);
  if (!entry) {
    return res.status(404).json({ error: 'Kitaplık kaydı bulunamadı.' });
  }

  if (entry.userId !== req.user.id) {
    return res.status(403).json({ error: 'Bu kitaplığı düzenleme yetkiniz yok.' });
  }

  const newPage = Math.min(entry.totalPages, Math.max(0, parseInt(currentPage, 10) || 0));
  const newProgress = Math.round((newPage / entry.totalPages) * 100);
  const isFinished = newPage >= entry.totalPages;
  const finalStatus = status || (isFinished ? 'completed' : 'reading');

  const updated = db.update('userBooks', ub => ub.id === id, ub => ({
    ...ub,
    currentPage: newPage,
    progressPercentage: newProgress,
    status: finalStatus,
    finishDate: isFinished && !ub.finishDate ? new Date().toISOString().split('T')[0] : ub.finishDate,
    updatedAt: new Date().toISOString()
  }));

  res.json({ success: true, userBook: updated });
});

// Canlı Okuma Seansı Kaydet
router.post('/sessions', requireAuth, (req, res) => {
  const { bookId, durationSeconds, startPage, endPage, notes } = req.body;
  const platform = req.clientPlatform;

  const duration = parseInt(durationSeconds, 10) || 0;
  if (duration <= 0) {
    return res.status(400).json({ error: 'Süre sıfırdan büyük olmalıdır.' });
  }

  const newSession = {
    id: `session-${Date.now()}`,
    userId: req.user.id,
    bookId: bookId || null,
    durationSeconds: duration,
    pagesRead: Math.max(0, (parseInt(endPage, 10) || 0) - (parseInt(startPage, 10) || 0)),
    date: new Date().toISOString().split('T')[0],
    timestamp: new Date().toISOString(),
    platform: platform, // 'ios' | 'android' | 'web'
    notes: notes || ''
  };

  db.insert('readingSessions', newSession);

  // Kullanıcının toplam okuma süresini ve bugünkü süresini güncelle
  db.update('users', u => u.id === req.user.id, u => ({
    ...u,
    totalReadingSeconds: (u.totalReadingSeconds || 0) + duration,
    todayReadingSeconds: (u.todayReadingSeconds || 0) + duration
  }));

  res.status(201).json({ success: true, session: newSession });
});

// Okuma Seanslarını Getir
router.get('/sessions', (req, res) => {
  const userId = req.query.userId || (req.user ? req.user.id : null);
  const sessions = db.get('readingSessions');
  if (userId) {
    return res.json(sessions.filter(s => s.userId === userId));
  }
  res.json(sessions);
});

export default router;
