import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_PATH = path.join(__dirname, 'store.json');

// İlk verileri `src/data/initialData.js` dosyasından okuyarak başlat
async function loadInitialSeed() {
  const initialDataPath = path.resolve(__dirname, '..', '..', 'src', 'data', 'initialData.js');
  try {
    const fileUrl = 'file:///' + initialDataPath.replace(/\\/g, '/');
    const mod = await import(fileUrl);
    return {
      users: mod.INITIAL_USERS || [],
      books: mod.INITIAL_BOOKS || [],
      userBooks: mod.INITIAL_USER_BOOKS || [],
      readingSessions: mod.INITIAL_READING_SESSIONS || [],
      rooms: mod.INITIAL_ROOMS || [],
      messages: mod.INITIAL_MESSAGES || [],
      posts: mod.INITIAL_POSTS || [],
      reviews: mod.INITIAL_REVIEWS || [],
      notifications: mod.INITIAL_NOTIFICATIONS || [],
      friendRequests: mod.INITIAL_FRIEND_REQUESTS || [],
      monthlyUserStats: mod.INITIAL_MONTHLY_USER_STATS || [],
      moderationLogs: mod.INITIAL_MODERATION_LOGS || [],
      adminLogs: mod.INITIAL_ADMIN_LOGS || [],
      // Özel Beta Test Altyapısı Verileri
      betaSettings: {
        environment: 'beta', // 'development' | 'beta' | 'production'
        appVersion: '0.1.0-beta',
        buildNumber: 1,
        restrictedMode: true, // Tek kişiye / belirlenen listeye özel kısıtlama açık
        designatedTesterEmail: 'beta@kitapkulubu.com', // Tek kişiye özel ilk testçi hesabı
        activeInviteCodes: ['BETA-KITAP-2026', 'KK-FOUNDER-BETA']
      },
      betaTesters: [
        {
          id: 'bt-1',
          email: 'beta@kitapkulubu.com',
          name: 'Özel Beta Testçi',
          device: 'iOS & Android',
          status: 'active',
          invitedAt: '2026-09-04T20:00:00.000Z',
          inviteCode: 'BETA-KITAP-2026',
          platform: 'ios'
        }
      ],
      betaFeedbacks: [
        {
          id: 'fb-sample-1',
          userId: 'user-1',
          userName: 'Kitap Kulübü Kurucusu',
          platform: 'ios',
          appVersion: '0.1.0-beta',
          buildNumber: 1,
          screen: 'Canlı Okuma',
          description: 'Sayaç duraklatıldığında arka plan rengi hafif sepia tonunda yumuşak geçiş yapıyor, çok iyi.',
          screenshotUrl: null,
          status: 'inceleniyor', // 'yeni' | 'inceleniyor' | 'cozuldu'
          createdAt: new Date().toISOString()
        }
      ],
      platformLogs: []
    };
  } catch (err) {
    console.warn('initialData.js dinamik yüklenemedi, varsayılan şablonla başlatılıyor:', err.message);
    return {
      users: [],
      books: [],
      userBooks: [],
      readingSessions: [],
      rooms: [],
      messages: [],
      posts: [],
      reviews: [],
      notifications: [],
      friendRequests: [],
      monthlyUserStats: [],
      moderationLogs: [],
      adminLogs: [],
      betaSettings: {
        environment: 'beta',
        appVersion: '0.1.0-beta',
        buildNumber: 1,
        restrictedMode: true,
        designatedTesterEmail: 'beta@kitapkulubu.com',
        activeInviteCodes: ['BETA-KITAP-2026']
      },
      betaTesters: [],
      betaFeedbacks: [],
      platformLogs: []
    };
  }
}

class Database {
  constructor() {
    this.data = null;
  }

  async init() {
    if (fs.existsSync(DB_PATH)) {
      try {
        const raw = fs.readFileSync(DB_PATH, 'utf-8');
        this.data = JSON.parse(raw);
        // Eksik alanları tamamla
        if (!this.data.betaFeedbacks) this.data.betaFeedbacks = [];
        if (!this.data.betaTesters) this.data.betaTesters = [];
        if (!this.data.betaSettings) {
          this.data.betaSettings = {
            environment: 'beta',
            appVersion: '0.1.0-beta',
            buildNumber: 1,
            restrictedMode: true,
            designatedTesterEmail: 'beta@kitapkulubu.com',
            activeInviteCodes: ['BETA-KITAP-2026']
          };
        }
        if (!this.data.platformLogs) this.data.platformLogs = [];
        console.log('✓ Mevcut veritabanı (store.json) yüklendi.');
        return;
      } catch (e) {
        console.error('store.json bozuk, yeniden oluşturuluyor:', e.message);
      }
    }

    this.data = await loadInitialSeed();
    this.persist();
    console.log('✓ Yeni veritabanı initialData ile başlatıldı.');
  }

  persist() {
    try {
      fs.writeFileSync(DB_PATH, JSON.stringify(this.data, null, 2), 'utf-8');
    } catch (e) {
      console.error('Veritabanı diske yazılamadı:', e);
    }
  }

  // Genel veri erişimcileri
  get(collection) {
    return this.data[collection] || [];
  }

  set(collection, items) {
    this.data[collection] = items;
    this.persist();
  }

  update(collection, finderFn, updaterFn) {
    const list = this.data[collection] || [];
    const index = list.findIndex(finderFn);
    if (index !== -1) {
      list[index] = updaterFn(list[index]);
      this.data[collection] = list;
      this.persist();
      return list[index];
    }
    return null;
  }

  insert(collection, item) {
    if (!this.data[collection]) {
      this.data[collection] = [];
    }
    this.data[collection].unshift(item);
    this.persist();
    return item;
  }

  delete(collection, finderFn) {
    const list = this.data[collection] || [];
    this.data[collection] = list.filter(item => !finderFn(item));
    this.persist();
  }

  // Beta Ayarları
  getBetaSettings() {
    return this.data.betaSettings;
  }

  updateBetaSettings(newSettings) {
    this.data.betaSettings = { ...this.data.betaSettings, ...newSettings };
    this.persist();
    return this.data.betaSettings;
  }

  // Platform loglama
  logPlatformAccess(userId, platform, path) {
    if (!this.data.platformLogs) this.data.platformLogs = [];
    this.data.platformLogs.unshift({
      userId,
      platform: platform || 'unknown',
      path,
      timestamp: new Date().toISOString()
    });
    // Son 500 logu tut
    if (this.data.platformLogs.length > 500) {
      this.data.platformLogs = this.data.platformLogs.slice(0, 500);
    }
    this.persist();
  }
}

export const db = new Database();
