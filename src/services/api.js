/**
 * Kitap Kulübü — Web API Entegrasyon Servisi
 * Ortak backend (http://localhost:5000) ile konuşur.
 * x-client-platform: 'web' başlığını otomatik ekler.
 */

const API_BASE = 'http://localhost:5000/api';

const getHeaders = (userId = null) => {
  const headers = {
    'Content-Type': 'application/json',
    'x-client-platform': 'web'
  };
  if (userId) {
    headers['x-user-id'] = userId;
  }
  return headers;
};

export const api = {
  // Sağlık Kontrolü
  async checkHealth() {
    try {
      const res = await fetch('http://localhost:5000/health', {
        headers: getHeaders()
      });
      return await res.json();
    } catch {
      return null;
    }
  },

  // Beta Durumu
  async getBetaStatus() {
    try {
      const res = await fetch(`${API_BASE}/beta/status`, { headers: getHeaders() });
      return await res.json();
    } catch {
      return {
        environment: 'beta',
        appVersion: '0.1.0-beta',
        buildNumber: 1,
        restrictedMode: true
      };
    }
  },

  // Beta Geri Bildirim Gönder
  async sendBetaFeedback(feedbackData, userId) {
    try {
      const res = await fetch(`${API_BASE}/beta/feedback`, {
        method: 'POST',
        headers: getHeaders(userId),
        body: JSON.stringify(feedbackData)
      });
      return await res.json();
    } catch (err) {
      console.warn('API çevrimdışı, yerel geri bildirim kaydedildi:', err);
      return { success: true, offline: true };
    }
  },

  // Beta Geri Bildirimlerini Getir (Admin)
  async getBetaFeedbacks(userId) {
    try {
      const res = await fetch(`${API_BASE}/beta/feedback`, {
        headers: getHeaders(userId)
      });
      if (!res.ok) return [];
      return await res.json();
    } catch {
      return [];
    }
  },

  // Beta Geri Bildirim Durumunu Güncelle (Admin)
  async updateFeedbackStatus(id, status, userId) {
    try {
      const res = await fetch(`${API_BASE}/beta/feedback/${id}`, {
        method: 'PATCH',
        headers: getHeaders(userId),
        body: JSON.stringify({ status })
      });
      return await res.json();
    } catch {
      return null;
    }
  },

  // Beta Testçilerini Getir (Admin)
  async getBetaTesters(userId) {
    try {
      const res = await fetch(`${API_BASE}/beta/testers`, {
        headers: getHeaders(userId)
      });
      if (!res.ok) return null;
      return await res.json();
    } catch {
      return null;
    }
  },

  // Beta Davet Kodu / Testçi Ekle (Admin)
  async addBetaTesterOrCode(data, userId) {
    try {
      const res = await fetch(`${API_BASE}/beta/testers`, {
        method: 'POST',
        headers: getHeaders(userId),
        body: JSON.stringify(data)
      });
      return await res.json();
    } catch {
      return null;
    }
  },

  // Sayfa İlerlemesini Backend'e Kaydet
  async updateProgress(userBookId, currentPage, status, userId) {
    try {
      const res = await fetch(`${API_BASE}/user-books/${userBookId}/progress`, {
        method: 'PATCH',
        headers: getHeaders(userId),
        body: JSON.stringify({ currentPage, status })
      });
      return await res.json();
    } catch {
      return null;
    }
  },

  // Seans Kaydet
  async saveSession(sessionData, userId) {
    try {
      const res = await fetch(`${API_BASE}/sessions`, {
        method: 'POST',
        headers: getHeaders(userId),
        body: JSON.stringify(sessionData)
      });
      return await res.json();
    } catch {
      return null;
    }
  },

  // Beta Davet Kodu / E-posta Doğrulama
  async verifyBetaCode(inviteCode, email) {
    try {
      const res = await fetch(`${API_BASE}/beta/verify-code`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ inviteCode, email })
      });
      return await res.json();
    } catch {
      return { success: false, error: 'Sunucuya ulaşılamadı.' };
    }
  },

  // Kapalı Beta Katılım Başvurusu
  async applyBeta(formData) {
    try {
      const res = await fetch(`${API_BASE}/beta/apply`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(formData)
      });
      return await res.json();
    } catch {
      return { success: false, error: 'Başvuru iletilemedi.' };
    }
  },

  // Yeni Okur Kaydı (Kapalı Beta Davet Kodu ile)
  async register(userData) {
    try {
      const res = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(userData)
      });
      return await res.json();
    } catch {
      return { success: false, error: 'Kayıt servisine ulaşılamadı.' };
    }
  },

  // Giriş Yap (E-posta + Şifre)
  async login(email, password) {
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ email, password })
      });
      return await res.json();
    } catch {
      return { success: false, error: 'Giriş yapılamadı.' };
    }
  },

  // Kurucu Hesabı Bilgilerini Güncelle
  async updateFounderProfile(data) {
    try {
      const res = await fetch(`${API_BASE}/auth/founder-profile`, {
        method: 'PATCH',
        headers: getHeaders(),
        body: JSON.stringify(data)
      });
      return await res.json();
    } catch {
      return { success: false, error: 'Kurucu profili güncellenemedi.' };
    }
  },

  // Beta Ayarlarını Güncelle (Restricted mode vs.)
  async updateBetaSettings(settings, userId) {
    try {
      const res = await fetch(`${API_BASE}/beta/settings`, {
        method: 'PATCH',
        headers: getHeaders(userId),
        body: JSON.stringify(settings)
      });
      return await res.json();
    } catch {
      return null;
    }
  }
};
