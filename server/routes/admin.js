import express from 'express';
import { db } from '../db/database.js';
import { requireAdmin, requireFounder } from '../middleware/authAndPlatform.js';

const router = express.Router();

// Sistem İstatistikleri (Admin/Founder)
router.get('/stats', requireAdmin, (req, res) => {
  const users = db.get('users');
  const books = db.get('books');
  const rooms = db.get('rooms');
  const sessions = db.get('readingSessions');
  const platformLogs = db.get('platformLogs');
  const beta = db.getBetaSettings();

  const platformBreakdown = {
    web: platformLogs.filter(l => l.platform === 'web').length,
    ios: platformLogs.filter(l => l.platform === 'ios').length,
    android: platformLogs.filter(l => l.platform === 'android').length
  };

  res.json({
    totalUsers: users.length,
    activeUsers: users.filter(u => u.status !== 'suspended').length,
    suspendedUsers: users.filter(u => u.status === 'suspended').length,
    totalBooks: books.length,
    totalRooms: rooms.length,
    totalReadingSessions: sessions.length,
    totalReadingSeconds: sessions.reduce((acc, s) => acc + (s.durationSeconds || 0), 0),
    platformBreakdown,
    betaSettings: beta
  });
});

// Kullanıcı Durumunu Değiştir (Askıya Al / Aktifleştir)
router.patch('/users/:id/status', requireAdmin, (req, res) => {
  const { id } = req.params;
  const targetUser = db.get('users').find(u => u.id === id);

  if (!targetUser) return res.status(404).json({ error: 'Kullanıcı bulunamadı.' });

  // Founder hesabı asla askıya alınamaz
  if (targetUser.role === 'founder') {
    return res.status(403).json({ error: 'Kurucu (Founder) hesabı askıya alınamaz veya değiştirilemez.' });
  }

  // Admin başka bir admini askıya alamaz (Yalnızca Founder yapabilir)
  if (targetUser.role === 'admin' && req.user.role !== 'founder') {
    return res.status(403).json({ error: 'Admin hesapları yalnızca Kurucu tarafından askıya alınabilir.' });
  }

  const newStatus = targetUser.status === 'active' ? 'suspended' : 'active';
  const updated = db.update('users', u => u.id === id, u => ({ ...u, status: newStatus }));

  // Log kaydet
  db.insert('adminLogs', {
    id: `log-${Date.now()}`,
    action: `Kullanıcı durumu değiştirildi: ${targetUser.username} -> ${newStatus}`,
    adminId: req.user.id,
    adminName: req.user.fullName,
    timestamp: new Date().toISOString()
  });

  res.json({ success: true, user: updated });
});

// Admin Yap / Adminlikten Çıkar (Yalnızca Founder)
router.patch('/users/:id/role', requireFounder, (req, res) => {
  const { id } = req.params;
  const { role } = req.body;

  if (!['admin', 'user'].includes(role)) {
    return res.status(400).json({ error: 'Geçersiz rol.' });
  }

  const targetUser = db.get('users').find(u => u.id === id);
  if (!targetUser) return res.status(404).json({ error: 'Kullanıcı bulunamadı.' });

  if (targetUser.role === 'founder') {
    return res.status(403).json({ error: 'Kurucunun rolü değiştirilemez.' });
  }

  const updated = db.update('users', u => u.id === id, u => ({ ...u, role }));

  db.insert('adminLogs', {
    id: `log-${Date.now()}`,
    action: `Rol güncellendi: ${targetUser.username} -> ${role}`,
    adminId: req.user.id,
    adminName: req.user.fullName,
    timestamp: new Date().toISOString()
  });

  res.json({ success: true, user: updated });
});

export default router;
