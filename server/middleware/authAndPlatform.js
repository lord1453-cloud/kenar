import crypto from 'crypto';
import { db } from '../db/database.js';

const JWT_SECRET = process.env.JWT_SECRET || 'kk-secret-session-key-production-secure-2026';

/**
 * Kriptografik HMAC SHA-256 Oturum Belirteci (Session Token) Oluşturucu
 */
export function generateSessionToken(userId, role) {
  const payload = {
    userId,
    role,
    iat: Date.now(),
    exp: Date.now() + 30 * 24 * 60 * 60 * 1000 // 30 gün geçerli
  };
  const payloadB64 = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = crypto.createHmac('sha256', JWT_SECRET).update(payloadB64).digest('base64url');
  return `${payloadB64}.${signature}`;
}

/**
 * Oturum Belirtecini Doğrulayıcı (Zamanlama saldırılarına karşı güvenli)
 */
export function verifySessionToken(token) {
  if (!token || typeof token !== 'string') return null;
  const parts = token.split('.');
  if (parts.length !== 2) return null;
  const [payloadB64, signature] = parts;
  const expectedSignature = crypto.createHmac('sha256', JWT_SECRET).update(payloadB64).digest('base64url');
  
  const sigBuffer = Buffer.from(signature);
  const expBuffer = Buffer.from(expectedSignature);
  if (sigBuffer.length !== expBuffer.length || !crypto.timingSafeEqual(sigBuffer, expBuffer)) {
    return null;
  }
  
  try {
    const payload = JSON.parse(Buffer.from(payloadB64, 'base64url').toString('utf8'));
    if (payload.exp && Date.now() > payload.exp) {
      return null;
    }
    return payload;
  } catch {
    return null;
  }
}

/**
 * Platform Middleware: İstemcinin platformunu tespit eder ve güvenli başlıkları yönetir.
 */
export const platformMiddleware = (req, res, next) => {
  const platform = req.headers['x-client-platform'] || req.headers['x-platform'] || 'web';
  const cleanPlatform = String(platform).toLowerCase().trim();
  req.clientPlatform = ['web', 'ios', 'android'].includes(cleanPlatform) ? cleanPlatform : 'web';
  
  // Güvenlik Başlıkları (Security Headers)
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  
  next();
};

/**
 * Güvenli Kimlik Doğrulama Middleware'i:
 * SADECE geçerli, kriptografik olarak imzalanmış Bearer Token'ı doğrular.
 * Sahte `x-user-id` başlıklarıyla kimlik taklidi (spoofing) kesinlikle engellenmiştir.
 */
export const authMiddleware = (req, res, next) => {
  let token = null;
  const authHeader = req.headers['authorization'];
  
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.slice(7).trim();
  } else if (req.headers['x-auth-token']) {
    token = String(req.headers['x-auth-token']).trim();
  }

  if (!token) {
    req.user = null;
    return next();
  }

  const payload = verifySessionToken(token);
  if (!payload || !payload.userId) {
    req.user = null;
    return next();
  }

  const users = db.get('users');
  const user = users.find(u => u.id === payload.userId);

  // Kullanıcı askıya alınmışsa oturumu geçersiz kıl
  if (!user || user.status === 'suspended') {
    req.user = null;
    return next();
  }

  // Erişim kaydı logla
  db.logPlatformAccess(user.id, req.clientPlatform, req.path);

  req.user = user;
  next();
};

/**
 * Giriş Zorunluluğu Kontrolü
 */
export const requireAuth = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Bu işlem için geçerli bir oturum açmanız gerekmektedir.' });
  }
  next();
};

/**
 * Admin veya Founder Yetki Kontrolü
 */
export const requireAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Oturum açmanız gerekmektedir.' });
  }
  if (req.user.role !== 'admin' && req.user.role !== 'founder') {
    return res.status(403).json({ error: 'Bu işlem için Admin veya Founder yetkisi gereklidir.' });
  }
  next();
};

/**
 * Yalnızca Kurucu (Founder) Yetki Kontrolü
 */
export const requireFounder = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Oturum açmanız gerekmektedir.' });
  }
  if (req.user.role !== 'founder') {
    return res.status(403).json({ error: 'Bu işlem yalnızca Kurucu (Founder) yetkisi ile gerçekleştirilebilir.' });
  }
  next();
};

/**
 * Özel Beta Test Doğrulama Middleware'i
 */
export const requireBetaAccess = (req, res, next) => {
  const beta = db.getBetaSettings();
  
  if (!beta.restrictedMode || beta.environment === 'production') {
    return next();
  }

  if (req.user && (req.user.role === 'founder' || req.user.role === 'admin')) {
    return next();
  }

  if (req.user && req.user.email === beta.designatedTesterEmail) {
    return next();
  }

  const testers = db.get('betaTesters');
  if (req.user) {
    const isTester = testers.some(t => t.email.toLowerCase() === req.user.email.toLowerCase() && t.status === 'active');
    if (isTester) {
      return next();
    }
  }

  const incomingBetaCode = req.headers['x-beta-invite-code'];
  if (incomingBetaCode && beta.activeInviteCodes.includes(incomingBetaCode.trim().toUpperCase())) {
    return next();
  }

  return res.status(403).json({
    error: 'Özel Beta Test Sürümü: Bu alana şu anda yalnızca davet edilen özel test kullanıcıları erişebilir.',
    requiresBetaCode: true,
    platform: req.clientPlatform,
    appVersion: beta.appVersion
  });
};

/**
 * Hafıza İçi Kademeli Hız Sınırlayıcı (In-Memory Sliding-Window Rate Limiter)
 * Brute-force ve DoS saldırılarını engeller.
 */
const rateLimitStore = new Map();

// Bellek temizliği (10 dakikada bir eski kayıtları siler)
setInterval(() => {
  const now = Date.now();
  for (const [key, timestamps] of rateLimitStore.entries()) {
    const fresh = timestamps.filter(t => t > now - 15 * 60 * 1000);
    if (fresh.length === 0) {
      rateLimitStore.delete(key);
    } else {
      rateLimitStore.set(key, fresh);
    }
  }
}, 10 * 60 * 1000);

export const createRateLimiter = ({ 
  windowMs = 60 * 1000, 
  max = 60, 
  message = 'Çok fazla istek gönderildi. Lütfen biraz sonra tekrar deneyin.' 
} = {}) => {
  return (req, res, next) => {
    const ip = req.ip || req.headers['x-forwarded-for'] || req.socket?.remoteAddress || '127.0.0.1';
    const key = `${ip}_${req.baseUrl || ''}${req.path}`;
    const now = Date.now();

    const record = rateLimitStore.get(key) || [];
    const windowStart = now - windowMs;
    const validTimestamps = record.filter(timestamp => timestamp > windowStart);

    if (validTimestamps.length >= max) {
      res.setHeader('Retry-After', Math.ceil(windowMs / 1000));
      return res.status(429).json({ 
        error: message, 
        retryAfterSeconds: Math.ceil(windowMs / 1000) 
      });
    }

    validTimestamps.push(now);
    rateLimitStore.set(key, validTimestamps);
    next();
  };
};

/**
 * Girdi Temizleyici (XSS & HTML Injection Koruması)
 */
export const sanitizeInput = (text) => {
  if (typeof text !== 'string') return text;
  return text
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/[<>]/g, (tag) => ({ '<': '&lt;', '>': '&gt;' }[tag] || tag))
    .trim();
};
