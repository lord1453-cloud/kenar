import { db } from '../db/database.js';

export const platformMiddleware = (req, res, next) => {
  const platform = req.headers['x-client-platform'] || req.headers['x-platform'] || 'web';
  req.clientPlatform = platform.toLowerCase(); // 'web' | 'ios' | 'android'
  
  // Kullanıcı bilgisi varsa platform logla
  const userId = req.headers['x-user-id'];
  if (userId) {
    db.logPlatformAccess(userId, req.clientPlatform, req.path);
  }
  next();
};

export const authMiddleware = (req, res, next) => {
  const userId = req.headers['x-user-id'];
  if (!userId) {
    req.user = null;
    return next();
  }

  const users = db.get('users');
  const user = users.find(u => u.id === userId);
  req.user = user || null;
  next();
};

export const requireAuth = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Oturum açmanız gerekmektedir.' });
  }
  next();
};

export const requireAdmin = (req, res, next) => {
  if (!req.user || (req.user.role !== 'admin' && req.user.role !== 'founder')) {
    return res.status(403).json({ error: 'Bu işlem için Admin veya Founder yetkisi gereklidir.' });
  }
  next();
};

export const requireFounder = (req, res, next) => {
  if (!req.user || req.user.role !== 'founder') {
    return res.status(403).json({ error: 'Bu işlem yalnızca Kurucu (Founder) yetkisi ile gerçekleştirilebilir.' });
  }
  next();
};

// Özel Beta Test Doğrulama Middleware'i
export const requireBetaAccess = (req, res, next) => {
  const beta = db.getBetaSettings();
  
  // Kısıtlama kapalıysa herkese açık
  if (!beta.restrictedMode || beta.environment === 'production') {
    return next();
  }

  // Kurucu ve Admin her zaman erişebilir
  if (req.user && (req.user.role === 'founder' || req.user.role === 'admin')) {
    return next();
  }

  // Belirlenen tekil test kullanıcısı mı?
  if (req.user && req.user.email === beta.designatedTesterEmail) {
    return next();
  }

  // Beta tester listesinde aktif mi?
  const testers = db.get('betaTesters');
  if (req.user) {
    const isTester = testers.some(t => t.email.toLowerCase() === req.user.email.toLowerCase() && t.status === 'active');
    if (isTester) {
      return next();
    }
  }

  // İstemciden gelen beta kodu kontrolü
  const incomingBetaCode = req.headers['x-beta-invite-code'];
  if (incomingBetaCode && beta.activeInviteCodes.includes(incomingBetaCode.trim().toUpperCase())) {
    return next();
  }

  return res.status(403).json({
    error: 'Özel Beta Test Sürümü: Bu sürüme şu anda yalnızca davet edilen özel test kullanıcısı erişebilir.',
    requiresBetaCode: true,
    platform: req.clientPlatform,
    appVersion: beta.appVersion
  });
};
