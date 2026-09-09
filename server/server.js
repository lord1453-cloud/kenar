import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { db } from './db/database.js';
import { platformMiddleware, authMiddleware, createRateLimiter } from './middleware/authAndPlatform.js';
import authRoutes from './routes/auth.js';
import betaRoutes from './routes/beta.js';
import libraryRoutes from './routes/library.js';
import socialRoutes from './routes/social.js';
import adminRoutes from './routes/admin.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Güvenli CORS Yapılandırması
const allowedOrigins = process.env.ALLOWED_ORIGINS 
  ? process.env.ALLOWED_ORIGINS.split(',').map(s => s.trim()) 
  : null;

app.use(cors({
  origin: (origin, callback) => {
    // Mobil istemciler, CLI araçları veya origin başlığı göndermeyen aynı kaynaklı istekler
    if (!origin) return callback(null, true);

    if (allowedOrigins && allowedOrigins.length > 0) {
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error('CORS Güvenlik Engeli: Bu alan adından API erişimi kısıtlanmıştır.'));
    }

    // Yerel geliştirme ve dağıtım alan adları
    const isDev = !process.env.NODE_ENV || process.env.NODE_ENV !== 'production';
    const isLocalhost = origin.startsWith('http://localhost:') || origin.startsWith('http://127.0.0.1:');
    const isVercel = origin.endsWith('.vercel.app');
    const isCustomDomain = origin.includes('kitapkulubu') || origin.includes('kenar');

    if (isDev || isLocalhost || isVercel || isCustomDomain) {
      return callback(null, true);
    }

    return callback(new Error('CORS Güvenlik Engeli: Bu alan adından API erişimi kısıtlanmıştır.'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-client-platform', 'x-auth-token', 'x-beta-invite-code']
}));

app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true, limit: '5mb' }));

// Platform ve Kriptografik Yetkilendirme Middleware'leri
app.use(platformMiddleware);
app.use(authMiddleware);

// Genel API Hız Sınırlayıcı (DoS / Flood Koruması - Dakikada en fazla 180 istek)
const globalApiLimiter = createRateLimiter({
  windowMs: 60 * 1000,
  max: 180,
  message: 'Sistem güvenliği uyarısı: Çok sık istek yapıldı. Lütfen biraz bekleyiniz.'
});
app.use('/api', globalApiLimiter);

// Sağlık Kontrolü (Health check)
app.get('/health', (req, res) => {
  const beta = db.getBetaSettings();
  res.json({
    status: 'ok',
    service: 'Kitap Kulübü Ortak Backend API',
    environment: beta.environment,
    appVersion: beta.appVersion,
    buildNumber: beta.buildNumber,
    detectedPlatform: req.clientPlatform,
    timestamp: new Date().toISOString()
  });
});

// API Rotaları
app.use('/api/auth', authRoutes);
app.use('/api/beta', betaRoutes);
app.use('/api', libraryRoutes);
app.use('/api', socialRoutes);
app.use('/api/admin', adminRoutes);

// Başlatma
async function start() {
  await db.init();
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`
╔═══════════════════════════════════════════════════════════╗
║  KİTAP KULÜBÜ — ORTAK BACKEND API SUNUCUSU               ║
║  Port: ${PORT}                                              ║
║  Platform Desteği: Web, iOS, Android                      ║
║  Sürüm: 0.1.0-beta                                        ║
║  Erişim: http://localhost:${PORT}/health                    ║
╚═══════════════════════════════════════════════════════════╝
    `);
  });
}

start().catch(err => {
  console.error('Sunucu başlatılırken kritik hata:', err);
  process.exit(1);
});
