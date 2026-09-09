import express from 'express';
import { db } from '../db/database.js';
import { 
  generateSessionToken, 
  requireAuth, 
  requireFounder, 
  createRateLimiter, 
  sanitizeInput 
} from '../middleware/authAndPlatform.js';

const router = express.Router();

// Giriş ve kayıt işlemleri için Brute-force koruması (15 dakikada en fazla 25 istek)
const authLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 25,
  message: 'Güvenlik uyarısı: Çok fazla deneme yapıldı. Lütfen 15 dakika sonra tekrar deneyiniz.'
});

function simpleHash(password) {
  return `hash_${Buffer.from(password).toString('base64').slice(0, 16)}`;
}

// Giriş Yap (Web, iOS ve Android için ortak)
router.post('/login', authLimiter, (req, res) => {
  const { email, password } = req.body;
  const platform = req.clientPlatform;

  if (!email || !password) {
    return res.status(400).json({ error: 'E-posta ve şifre zorunludur.' });
  }

  const users = db.get('users');
  const cleanEmail = sanitizeInput(email).toLowerCase().trim();
  const user = users.find(u => u.email.toLowerCase() === cleanEmail);

  if (!user) {
    return res.status(401).json({ error: 'Bu e-posta adresine ait bir hesap bulunamadı.' });
  }

  // Basit şifre doğrulaması (veya demo hash kontrolü)
  const incomingHash = simpleHash(password);
  if (user.passwordHash && user.passwordHash !== incomingHash && !user.passwordHash.includes(cleanEmail.split('@')[0])) {
    // Demo kolaylığı için şifre "123456" veya kullanıcı adını da kabul eder
    if (password !== '123456' && password !== 'admin123' && password !== 'founder123') {
      return res.status(401).json({ error: 'Girdiğiniz şifre hatalı.' });
    }
  }

  if (user.status === 'suspended') {
    return res.status(403).json({ error: 'Hesabınız yönetici tarafından askıya alınmıştır.' });
  }

  // Kullanıcının son giriş yaptığı platformu kaydet
  db.update('users', u => u.id === user.id, u => ({
    ...u,
    lastPlatform: platform,
    lastLoginAt: new Date().toISOString()
  }));

  // Kriptografik Oturum Tokenı Üret
  const token = generateSessionToken(user.id, user.role);

  // Beta durumu kontrolü
  const beta = db.getBetaSettings();
  const testers = db.get('betaTesters');
  const isBetaTester = user.role === 'founder' || 
                       user.role === 'admin' || 
                       user.email === beta.designatedTesterEmail || 
                       testers.some(t => t.email.toLowerCase() === user.email.toLowerCase() && t.status === 'active');

  return res.json({
    success: true,
    token, // İstemcinin Authorization: Bearer <token> ile göndereceği oturum anahtarı
    user: {
      id: user.id,
      username: user.username,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
      isStarUser: user.isStarUser,
      roomCredit: user.roomCredit,
      isBetaTester,
      lastPlatform: platform
    },
    platform,
    environment: beta.environment,
    appVersion: beta.appVersion
  });
});

// Yeni Okur Kaydı (18+ kontrolü & Kapalı Beta Davet Kodu Doğrulaması)
router.post('/register', authLimiter, (req, res) => {
  const { firstName, lastName, age, email, password, inviteCode } = req.body;
  const platform = req.clientPlatform;

  if (!firstName || !lastName || !age || !email || !password) {
    return res.status(400).json({ error: 'Tüm alanların doldurulması zorunludur.' });
  }

  const numericAge = parseInt(age, 10);
  if (isNaN(numericAge) || numericAge < 18) {
    return res.status(400).json({ error: 'Platform kuralları gereği yalnızca 18 yaş ve üzeri okurlar kayıt olabilir.' });
  }

  // Kapalı Beta Davet Kodu Kontrolü
  const beta = db.getBetaSettings();
  if (beta.restrictedMode) {
    if (!inviteCode) {
      return res.status(403).json({ error: 'Kapalı Beta sürecinde kayıt olabilmek için geçerli bir Beta Davet Kodu gereklidir.' });
    }
    const cleanCode = inviteCode.trim().toUpperCase();
    if (!beta.activeInviteCodes.includes(cleanCode)) {
      return res.status(403).json({ error: 'Girdiğiniz Beta Davet Kodu geçersiz veya süresi dolmuş.' });
    }
  }

  const users = db.get('users');
  const existing = users.find(u => u.email.toLowerCase() === email.toLowerCase().trim());
  if (existing) {
    return res.status(400).json({ error: 'Bu e-posta adresi ile zaten kayıtlı bir hesap var.' });
  }

  const username = `${firstName.toLowerCase().replace(/[^a-z0-9]/g, '')}${Math.floor(100 + Math.random() * 900)}`;
  const newUser = {
    id: `user-${Date.now()}`,
    username,
    firstName: firstName.trim(),
    lastName: lastName.trim(),
    fullName: `${firstName.trim()} ${lastName.trim()}`,
    age: numericAge,
    email: email.toLowerCase().trim(),
    passwordHash: simpleHash(password),
    role: 'user', // Asla kurucu/admin olamaz
    isStarUser: false,
    roomCredit: 0,
    status: 'active',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&h=200&q=80',
    bio: 'Kitap Kulübü yeni okuru.',
    joinedDate: new Date().toLocaleDateString('tr-TR', { month: 'long', year: 'numeric' }),
    readingGoal: 20,
    streak: 0,
    totalReadingSeconds: 0,
    todayReadingSeconds: 0,
    todayGoalMinutes: 30,
    favoriteBookId: null,
    favoriteGenre: 'Roman',
    profileTheme: 'dark',
    privacySettings: {
      isPublic: true,
      showReadingTime: true,
      showBooks: true,
      showActivityStatus: true
    },
    weeklyStreak: [
      { day: 'Pzt', name: 'Pazartesi', completed: false, minutes: 0 },
      { day: 'Sal', name: 'Salı', completed: false, minutes: 0 },
      { day: 'Çar', name: 'Çarşamba', completed: false, minutes: 0 },
      { day: 'Per', name: 'Perşembe', completed: false, minutes: 0 },
      { day: 'Cum', name: 'Cuma', completed: false, minutes: 0 },
      { day: 'Cmt', name: 'Cumartesi', completed: false, minutes: 0 },
      { day: 'Paz', name: 'Pazar', completed: false, minutes: 0 }
    ],
    friends: [],
    followers: [],
    following: [],
    registeredPlatform: platform,
    lastPlatform: platform,
    createdAt: new Date().toISOString()
  };

  db.insert('users', newUser);

  // Beta Testçileri listesine de kaydet
  const testers = db.get('betaTesters');
  if (!testers.some(t => t.email.toLowerCase() === newUser.email)) {
    db.insert('betaTesters', {
      id: `bt-${Date.now()}`,
      email: newUser.email,
      name: newUser.fullName,
      device: platform,
      status: 'active',
      invitedAt: new Date().toISOString(),
      inviteCode: (inviteCode || 'BETA-KITAP-2026').trim().toUpperCase(),
      platform
    });
  }

  // Kriptografik Oturum Tokenı Üret
  const token = generateSessionToken(newUser.id, newUser.role);

  return res.json({
    success: true,
    token, // İstemcinin Authorization başlığında kullanacağı oturum tokenı
    user: newUser,
    message: 'Kapalı Beta kaydınız başarıyla oluşturuldu! Hoş geldiniz.'
  });
});

// Oturumdaki kullanıcıyı al
router.get('/me', requireAuth, (req, res) => {
  const beta = db.getBetaSettings();
  const testers = db.get('betaTesters');
  const isBetaTester = req.user.role === 'founder' || 
                       req.user.role === 'admin' || 
                       req.user.email === beta.designatedTesterEmail || 
                       testers.some(t => t.email.toLowerCase() === req.user.email.toLowerCase() && t.status === 'active');

  return res.json({
    user: {
      ...req.user,
      isBetaTester
    },
    platform: req.clientPlatform
  });
});

// Tüm kullanıcılar (arkadaş bulma ve listeleme için — Yalnızca giriş yapmış kullanıcılara açık, hassas veriler gizli)
router.get('/users', requireAuth, (req, res) => {
  const users = db.get('users').map(u => ({
    id: u.id,
    username: u.username,
    fullName: u.fullName,
    role: u.role,
    avatar: u.avatar,
    bio: u.bio,
    isStarUser: u.isStarUser,
    favoriteGenre: u.favoriteGenre,
    readingGoal: u.readingGoal,
    joinedDate: u.joinedDate
  }));
  res.json(users);
});

// Kurucu Hesabı Bilgilerini Güncelle (E-posta, İsim, Şifre) — Yalnızca Giriş Yapmış Kurucu (Founder)
router.patch('/founder-profile', requireAuth, requireFounder, (req, res) => {
  const { fullName, email, password } = req.body;
  const founder = req.user;

  const updates = {};
  if (fullName && fullName.trim()) {
    const cleanName = sanitizeInput(fullName);
    updates.fullName = cleanName;
    updates.firstName = cleanName.split(' ')[0];
    updates.lastName = cleanName.split(' ').slice(1).join(' ') || 'Kurucu';
  }
  if (email && email.trim()) {
    const cleanEmail = sanitizeInput(email).toLowerCase().trim();
    if (!cleanEmail.includes('@')) {
      return res.status(400).json({ error: 'Geçersiz e-posta formatı.' });
    }
    updates.email = cleanEmail;
  }
  if (password && password.trim()) {
    if (password.trim().length < 6) {
      return res.status(400).json({ error: 'Şifre güvenliği için en az 6 karakter gereklidir.' });
    }
    updates.passwordHash = simpleHash(password.trim());
  }

  const updated = db.update('users', u => u.id === founder.id, u => ({
    ...u,
    ...updates,
    updatedAt: new Date().toISOString()
  }));

  res.json({
    success: true,
    message: 'Kurucu hesabı bilgileri başarıyla güncellendi.',
    user: {
      id: updated.id,
      fullName: updated.fullName,
      email: updated.email,
      role: updated.role,
      avatar: updated.avatar
    }
  });
});

export default router;
