import express from 'express';
import { db } from '../db/database.js';
import { requireAdmin, requireFounder } from '../middleware/authAndPlatform.js';

const router = express.Router();

// Beta Durum Bilgisi (Herkes erişebilir)
router.get('/status', (req, res) => {
  const beta = db.getBetaSettings();
  res.json({
    environment: beta.environment, // 'development' | 'beta' | 'production'
    appVersion: beta.appVersion,
    buildNumber: beta.buildNumber,
    restrictedMode: beta.restrictedMode,
    designatedTesterEmail: beta.designatedTesterEmail,
    detectedPlatform: req.clientPlatform
  });
});

// Beta Davet Kodu Doğrulama
router.post('/verify-code', (req, res) => {
  const { inviteCode, email } = req.body;
  const beta = db.getBetaSettings();

  if (!inviteCode && !email) {
    return res.status(400).json({ error: 'Davet kodu veya e-posta adresi gereklidir.' });
  }

  // 1. E-posta tekil beta kullanıcısı mı?
  if (email && email.toLowerCase().trim() === beta.designatedTesterEmail.toLowerCase()) {
    return res.json({
      success: true,
      message: 'Özel Beta Testçi yetkisi doğrulandı.',
      isBetaTester: true,
      email
    });
  }

  // 2. Davet kodu geçerli mi?
  if (inviteCode && beta.activeInviteCodes.includes(inviteCode.trim().toUpperCase())) {
    // Tester listesine ekle veya güncelle
    if (email) {
      const testers = db.get('betaTesters');
      const existing = testers.find(t => t.email.toLowerCase() === email.toLowerCase().trim());
      if (!existing) {
        db.insert('betaTesters', {
          id: `bt-${Date.now()}`,
          email: email.toLowerCase().trim(),
          name: email.split('@')[0],
          device: req.clientPlatform,
          status: 'active',
          invitedAt: new Date().toISOString(),
          inviteCode: inviteCode.trim().toUpperCase(),
          platform: req.clientPlatform
        });
      }
    }

    return res.json({
      success: true,
      message: 'Beta davet kodu başarıyla kabul edildi! Hoş geldiniz.',
      isBetaTester: true,
      inviteCode: inviteCode.trim().toUpperCase()
    });
  }

  return res.status(403).json({
    success: false,
    error: 'Geçersiz veya süresi dolmuş beta davet kodu. Lütfen kurucunuzdan davet isteyin.'
  });
});

// Kapalı Beta Katılım Başvurusu Yap (Herkes başvurabilir)
router.post('/apply', (req, res) => {
  const { email, name, device, note } = req.body;
  const platform = req.clientPlatform || device || 'web';

  if (!email || !email.includes('@')) {
    return res.status(400).json({ error: 'Geçerli bir e-posta adresi gereklidir.' });
  }

  const existingTester = db.get('betaTesters').find(t => t.email.toLowerCase() === email.toLowerCase().trim());
  if (existingTester) {
    return res.json({
      success: true,
      alreadyApproved: true,
      message: 'E-postanız zaten onaylı beta testçi listesinde! Davet kodunuzla veya hesabınızla doğrudan giriş yapabilirsiniz.'
    });
  }

  const application = {
    id: `app-${Date.now()}`,
    type: 'beta_application',
    userId: 'applicant',
    userName: name || email.split('@')[0],
    userEmail: email.toLowerCase().trim(),
    userRole: 'applicant',
    platform: platform.toLowerCase(),
    screen: 'Kapalı Beta Giriş Kapısı',
    description: `[Beta Başvurusu] Cihaz: ${platform.toUpperCase()} — Not: ${note || 'Kapalı beta katılım başvurusu.'}`,
    screenshotUrl: null,
    status: 'yeni',
    createdAt: new Date().toISOString()
  };

  db.insert('betaFeedbacks', application);

  res.status(201).json({
    success: true,
    message: 'Kapalı Beta başvurunuz kurucuya iletildi! Başvurunuz incelendikten sonra bilgilendirileceksiniz.'
  });
});

// Beta Hata Bildirimi (Feedback) Gönder
router.post('/feedback', (req, res) => {
  const { description, screen, screenshotUrl, appVersion, buildNumber } = req.body;
  const platform = req.clientPlatform || 'unknown';
  const beta = db.getBetaSettings();

  if (!description || description.trim().length === 0) {
    return res.status(400).json({ error: 'Hata veya geri bildirim açıklaması zorunludur.' });
  }

  const user = req.user;
  const feedbackItem = {
    id: `fb-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    userId: user ? user.id : 'anonymous-beta-user',
    userName: user ? user.fullName : 'Misafir Testçi',
    userEmail: user ? user.email : (req.body.userEmail || 'belirtilmedi'),
    userRole: user ? user.role : 'beta_tester',
    platform: platform, // 'ios' | 'android' | 'web'
    appVersion: appVersion || beta.appVersion,
    buildNumber: buildNumber || beta.buildNumber,
    screen: screen || 'Bilinmeyen Ekran',
    description: description.trim(),
    screenshotUrl: screenshotUrl || null,
    status: 'yeni', // 'yeni' | 'inceleniyor' | 'cozuldu'
    createdAt: new Date().toISOString()
  };

  db.insert('betaFeedbacks', feedbackItem);

  res.status(201).json({
    success: true,
    message: 'Geri bildiriminiz başarıyla iletildi. Katkınız için teşekkür ederiz!',
    feedback: feedbackItem
  });
});

// Admin/Founder: Tüm Beta Geri Bildirimlerini Listele
router.get('/feedback', requireAdmin, (req, res) => {
  const feedbacks = db.get('betaFeedbacks');
  res.json(feedbacks);
});

// Admin/Founder: Geri Bildirim Durumunu Güncelle
router.patch('/feedback/:id', requireAdmin, (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!['yeni', 'inceleniyor', 'cozuldu'].includes(status)) {
    return res.status(400).json({ error: 'Geçersiz durum. (yeni, inceleniyor, cozuldu) olmalıdır.' });
  }

  const updated = db.update('betaFeedbacks', f => f.id === id, f => ({
    ...f,
    status,
    updatedAt: new Date().toISOString(),
    reviewedBy: req.user.fullName
  }));

  if (!updated) {
    return res.status(404).json({ error: 'Geri bildirim kaydı bulunamadı.' });
  }

  res.json({ success: true, feedback: updated });
});

// Admin/Founder: Beta Testçilerini Listele
router.get('/testers', requireAdmin, (req, res) => {
  const testers = db.get('betaTesters');
  const beta = db.getBetaSettings();
  res.json({
    designatedTesterEmail: beta.designatedTesterEmail,
    restrictedMode: beta.restrictedMode,
    activeInviteCodes: beta.activeInviteCodes,
    testers
  });
});

// Admin/Founder: Yeni Beta Davetiyesi veya Testçi Tanımla
router.post('/testers', requireAdmin, (req, res) => {
  const { email, name, platform, generateCode } = req.body;
  const beta = db.getBetaSettings();

  let inviteCode = null;
  if (generateCode) {
    inviteCode = `BETA-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
    const activeCodes = [...(beta.activeInviteCodes || []), inviteCode];
    db.updateBetaSettings({ activeInviteCodes: activeCodes });
  }

  if (email) {
    const existing = db.get('betaTesters').find(t => t.email.toLowerCase() === email.toLowerCase().trim());
    if (existing) {
      return res.status(400).json({ error: 'Bu e-posta adresi zaten beta listesinde bulunuyor.' });
    }

    const newTester = {
      id: `bt-${Date.now()}`,
      email: email.toLowerCase().trim(),
      name: name || email.split('@')[0],
      device: platform || 'Tüm Cihazlar',
      status: 'active',
      invitedAt: new Date().toISOString(),
      inviteCode: inviteCode || 'DOĞRUDAN-DAVET',
      platform: platform || 'ios'
    };

    db.insert('betaTesters', newTester);

    return res.status(201).json({
      success: true,
      tester: newTester,
      inviteCode
    });
  }

  res.status(201).json({
    success: true,
    inviteCode
  });
});

// Admin/Founder: Beta Testçisini Kaldır
router.delete('/testers/:id', requireAdmin, (req, res) => {
  const { id } = req.params;
  db.delete('betaTesters', t => t.id === id);
  res.json({ success: true, message: 'Beta testçisi listeden çıkarıldı.' });
});

// Founder: Beta Ayarlarını Güncelle (Ortam ve Kısıtlama Ayarları)
router.patch('/settings', requireFounder, (req, res) => {
  const { environment, restrictedMode, designatedTesterEmail, appVersion } = req.body;
  const updates = {};
  if (environment) updates.environment = environment;
  if (typeof restrictedMode === 'boolean') updates.restrictedMode = restrictedMode;
  if (designatedTesterEmail) updates.designatedTesterEmail = designatedTesterEmail.trim();
  if (appVersion) updates.appVersion = appVersion.trim();

  const newSettings = db.updateBetaSettings(updates);
  res.json({ success: true, settings: newSettings });
});

export default router;
