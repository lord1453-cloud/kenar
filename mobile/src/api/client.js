import { Platform } from 'react-native';

// Geliştirme ortamında Android Emülatör 10.0.2.2, iOS Simulator ise localhost kullanır.
// Gerçek cihaz testi için bilgisayarın yerel ağ IP adresi (örn: 192.168.1.x:5000) kullanılır.
const getBaseUrl = () => {
  if (Platform.OS === 'android') {
    return 'http://10.0.2.2:5000/api';
  }
  return 'http://localhost:5000/api';
};

export const API_BASE = getBaseUrl();
const CURRENT_PLATFORM = Platform.OS === 'ios' ? 'ios' : 'android';

let storedUserId = 'user-1'; // Varsayılan hesap
let storedAuthToken = null;
let storedBetaInviteCode = 'BETA-KITAP-2026';

export const setStoredUserId = (id) => {
  storedUserId = id;
};

export const setStoredAuthToken = (token) => {
  storedAuthToken = token;
};

export const setStoredBetaInviteCode = (code) => {
  storedBetaInviteCode = code;
};

const getHeaders = () => {
  const headers = {
    'Content-Type': 'application/json',
    'x-client-platform': CURRENT_PLATFORM
  };
  if (storedAuthToken) {
    headers['Authorization'] = `Bearer ${storedAuthToken}`;
  }
  if (storedBetaInviteCode) {
    headers['x-beta-invite-code'] = storedBetaInviteCode;
  }
  return headers;
};

export const mobileApi = {
  getPlatform() {
    return CURRENT_PLATFORM;
  },

  // 1. Beta Durumu
  async getBetaStatus() {
    try {
      const res = await fetch(`${API_BASE}/beta/status`, { headers: getHeaders() });
      return await res.json();
    } catch {
      return {
        environment: 'beta',
        appVersion: '0.1.0-beta',
        buildNumber: 1,
        restrictedMode: true,
        detectedPlatform: CURRENT_PLATFORM
      };
    }
  },

  // 2. Beta Davet Kodu Doğrulama (Tek kişiye özel kontrol)
  async verifyBetaCode(inviteCode, email) {
    try {
      const res = await fetch(`${API_BASE}/beta/verify-code`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ inviteCode, email })
      });
      return await res.json();
    } catch {
      return { success: false, error: 'Sunucuya erişilemedi. Lütfen bağlantınızı kontrol edin.' };
    }
  },

  // 2b. Kapalı Beta Katılım Başvurusu
  async applyBeta(formData) {
    try {
      const res = await fetch(`${API_BASE}/beta/apply`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ ...formData, device: CURRENT_PLATFORM })
      });
      return await res.json();
    } catch {
      return { success: false, error: 'Sunucuya ulaşılamadı. Lütfen bağlantınızı kontrol edin.' };
    }
  },

  // 3. Ortak Giriş Yap
  async login(email, password) {
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (data.success && data.user) {
        storedUserId = data.user.id;
        if (data.token) {
          storedAuthToken = data.token;
        }
      }
      return data;
    } catch (err) {
      return { success: false, error: 'Giriş yapılamadı: ' + err.message };
    }
  },

  // 4. Yeni Okur Kaydı (18+)
  async register(userData) {
    try {
      const res = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(userData)
      });
      const data = await res.json();
      if (data.success && data.user) {
        storedUserId = data.user.id;
        if (data.token) {
          storedAuthToken = data.token;
        }
      }
      return data;
    } catch (err) {
      return { success: false, error: 'Kayıt yapılamadı: ' + err.message };
    }
  },

  // 5. Beta Hata Bildirimi (Feedback)
  async sendFeedback(feedbackData) {
    try {
      const res = await fetch(`${API_BASE}/beta/feedback`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({
          ...feedbackData,
          platform: CURRENT_PLATFORM,
          appVersion: '0.1.0-beta',
          buildNumber: 1
        })
      });
      return await res.json();
    } catch {
      return { success: true, offline: true, message: 'Geri bildirim yerel olarak alındı.' };
    }
  },

  // 6. Beta Geri Bildirimlerini Listele (Founder/Admin)
  async getFeedbacks() {
    try {
      const res = await fetch(`${API_BASE}/beta/feedback`, { headers: getHeaders() });
      if (!res.ok) return [];
      return await res.json();
    } catch {
      return [];
    }
  },

  // 7. Geri Bildirim Durumu Güncelle
  async updateFeedbackStatus(id, status) {
    try {
      const res = await fetch(`${API_BASE}/beta/feedback/${id}`, {
        method: 'PATCH',
        headers: getHeaders(),
        body: JSON.stringify({ status })
      });
      return await res.json();
    } catch {
      return null;
    }
  },

  // 8. Beta Testçileri
  async getBetaTesters() {
    try {
      const res = await fetch(`${API_BASE}/beta/testers`, { headers: getHeaders() });
      if (!res.ok) return null;
      return await res.json();
    } catch {
      return null;
    }
  },

  // 9. Yeni Testçi Ekle
  async addBetaTester(data) {
    try {
      const res = await fetch(`${API_BASE}/beta/testers`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(data)
      });
      return await res.json();
    } catch {
      return null;
    }
  },

  // 10. Kitaplık & Sayfa İlerlemesi
  async updateProgress(userBookId, currentPage, status) {
    try {
      const res = await fetch(`${API_BASE}/user-books/${userBookId}/progress`, {
        method: 'PATCH',
        headers: getHeaders(),
        body: JSON.stringify({ currentPage, status })
      });
      return await res.json();
    } catch {
      return null;
    }
  },

  // 11. Canlı Okuma Seansı Kaydet
  async saveSession(sessionData) {
    try {
      const res = await fetch(`${API_BASE}/sessions`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(sessionData)
      });
      return await res.json();
    } catch {
      return null;
    }
  },

  // 12. Düşünce Gönder
  async createPost(postData) {
    try {
      const res = await fetch(`${API_BASE}/posts`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(postData)
      });
      return await res.json();
    } catch {
      return null;
    }
  },

  // 13. Gönderi Beğen
  async toggleLikePost(postId) {
    try {
      const res = await fetch(`${API_BASE}/posts/${postId}/like`, {
        method: 'POST',
        headers: getHeaders()
      });
      return await res.json();
    } catch {
      return null;
    }
  },

  // 14. Tüm Kullanıcılar
  async getUsers() {
    try {
      const res = await fetch(`${API_BASE}/auth/users`, { headers: getHeaders() });
      if (!res.ok) return [];
      return await res.json();
    } catch {
      return [];
    }
  },

  // 15. Kullanıcı Durumu (Admin)
  async toggleUserStatus(userId) {
    try {
      const res = await fetch(`${API_BASE}/admin/users/${userId}/status`, {
        method: 'PATCH',
        headers: getHeaders()
      });
      return await res.json();
    } catch {
      return null;
    }
  }
};
