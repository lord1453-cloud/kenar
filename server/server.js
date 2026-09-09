import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { db } from './db/database.js';
import { platformMiddleware, authMiddleware } from './middleware/authAndPlatform.js';
import authRoutes from './routes/auth.js';
import betaRoutes from './routes/beta.js';
import libraryRoutes from './routes/library.js';
import socialRoutes from './routes/social.js';
import adminRoutes from './routes/admin.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// CORS ve Body Parser
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-client-platform', 'x-user-id', 'x-beta-invite-code']
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Platform ve Yetkilendirme Middleware'leri
app.use(platformMiddleware);
app.use(authMiddleware);

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
