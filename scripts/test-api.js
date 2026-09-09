/**
 * Kitap Kulübü — Çapraz Platform ve Özel Beta Test Doğrulama Testi
 * 
 * Kullanım:
 *   node scripts/test-api.js
 */

const BASE_URL = 'http://localhost:5000';

async function runTests() {
  console.log('╔═════════════════════════════════════════════════════════════╗');
  console.log('║   KİTAP KULÜBÜ — SİSTEM VE BETA TEST ENTEGRASYON TESTİ      ║');
  console.log('╚═════════════════════════════════════════════════════════════╝\n');

  let passed = 0;
  let failed = 0;

  async function test(name, fn) {
    try {
      process.stdout.write(`• ${name}... `);
      await fn();
      console.log('✓ BAŞARILI');
      passed++;
    } catch (e) {
      console.log('✗ BAŞARISIZ:', e.message);
      failed++;
    }
  }

  // 1. Sağlık ve Ortam Kontrolü
  await test('1. Backend Sağlık ve Sürüm Kontrolü', async () => {
    const res = await fetch(`${BASE_URL}/health`);
    const data = await res.json();
    if (data.status !== 'ok') throw new Error('Status ok değil');
    if (data.environment !== 'beta') throw new Error('Environment beta değil: ' + data.environment);
    if (data.appVersion !== '0.1.0-beta') throw new Error('Sürüm 0.1.0-beta değil: ' + data.appVersion);
  });

  // 2. Platform Başlığı Takibi
  await test('2. Platform Başlığı Takibi (iOS & Android)', async () => {
    const resIos = await fetch(`${BASE_URL}/health`, { headers: { 'x-client-platform': 'ios' } });
    const dataIos = await resIos.json();
    if (dataIos.detectedPlatform !== 'ios') throw new Error('iOS tespit edilemedi: ' + dataIos.detectedPlatform);

    const resAndroid = await fetch(`${BASE_URL}/health`, { headers: { 'x-client-platform': 'android' } });
    const dataAndroid = await resAndroid.json();
    if (dataAndroid.detectedPlatform !== 'android') throw new Error('Android tespit edilemedi: ' + dataAndroid.detectedPlatform);
  });

  // 3. Tek Hesap Girişi (Founder & Admin)
  let founderUser = null;
  await test('3. Kurucu (Founder) Girişi ve Yetki Doğrulaması', async () => {
    const res = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-client-platform': 'ios' },
      body: JSON.stringify({ email: 'kurucu@kitapkulubu.com', password: 'hash_sha256_kurucu2026' })
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.error);
    if (data.user.role !== 'founder') throw new Error('Founder rolü tanınmadı');
    founderUser = data.user;
  });

  // 4. Tek Kişiye Özel Beta Doğrulaması
  await test('4. Tek Kişiye Özel Beta Test Doğrulaması', async () => {
    // A) Belirlenen testçi e-postası ile doğrulama
    const res1 = await fetch(`${BASE_URL}/api/beta/verify-code`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'beta@kitapkulubu.com' })
    });
    const data1 = await res1.json();
    if (!data1.isBetaTester) throw new Error('Belirlenen testçi doğrulanamadı');

    // B) Geçerli davet kodu ile doğrulama
    const res2 = await fetch(`${BASE_URL}/api/beta/verify-code`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ inviteCode: 'BETA-KITAP-2026' })
    });
    const data2 = await res2.json();
    if (!data2.success) throw new Error('Geçerli beta kodu reddedildi');

    // C) Geçersiz kodun reddedilmesi
    const res3 = await fetch(`${BASE_URL}/api/beta/verify-code`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ inviteCode: 'GECERSIZ-KOD-999' })
    });
    if (res3.status !== 403) throw new Error('Geçersiz koda 403 verilmedi: ' + res3.status);
  });

  // 5. Beta Hata Bildirimi (Feedback)
  let createdFeedbackId = null;
  await test('5. Beta Hata Bildirimi (Feedback) Gönderme & Listeleme', async () => {
    // iOS'tan hata bildir
    const resPost = await fetch(`${BASE_URL}/api/beta/feedback`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-client-platform': 'ios',
        'x-user-id': founderUser.id
      },
      body: JSON.stringify({
        description: 'TestFlight beta testi: Kitaplık filtreleme sorunsuz çalışıyor.',
        screen: 'Kitaplığım',
        appVersion: '0.1.0-beta'
      })
    });
    const postData = await resPost.json();
    if (!postData.success) throw new Error('Feedback kaydedilemedi: ' + postData.error);
    if (postData.feedback.platform !== 'ios') throw new Error('Platform ios olarak kaydedilmedi: ' + postData.feedback.platform);
    createdFeedbackId = postData.feedback.id;

    // Admin/Founder ile listele
    const resList = await fetch(`${BASE_URL}/api/beta/feedback`, {
      headers: { 'x-user-id': founderUser.id }
    });
    const list = await resList.json();
    if (!Array.isArray(list) || list.length === 0) throw new Error('Feedback listesi boş');

    // Durum güncelle: cozuldu
    const resPatch = await fetch(`${BASE_URL}/api/beta/feedback/${createdFeedbackId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', 'x-user-id': founderUser.id },
      body: JSON.stringify({ status: 'cozuldu' })
    });
    const patchData = await resPatch.json();
    if (patchData.feedback.status !== 'cozuldu') throw new Error('Durum cozuldu olarak güncellenemedi');
  });

  // 6. Çapraz Platform Okuma İlerlemesi ve Seans Senkronizasyonu
  await test('6. Çapraz Platform Okuma ve Seans Senkronizasyonu', async () => {
    // Web'den okuma seansı kaydet
    const resSession = await fetch(`${BASE_URL}/api/sessions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-client-platform': 'web',
        'x-user-id': founderUser.id
      },
      body: JSON.stringify({
        bookId: 'book-1',
        durationSeconds: 1800,
        startPage: 340,
        endPage: 370,
        notes: 'Çapraz platform senkronizasyon testi'
      })
    });
    const sessionData = await resSession.json();
    if (!sessionData.success) throw new Error('Seans kaydedilemedi: ' + sessionData.error);

    // iOS veya Android'den kontrol et
    const resGetSessions = await fetch(`${BASE_URL}/api/sessions?userId=${founderUser.id}`, {
      headers: { 'x-client-platform': 'ios' }
    });
    const userSessions = await resGetSessions.json();
    const found = userSessions.find(s => s.id === sessionData.session.id);
    if (!found) throw new Error('Web seansı iOS istemcisinde bulunamadı');
  });

  console.log('\n═════════════════════════════════════════════════════════════');
  console.log(`Sonuç: ${passed} Test Başarılı, ${failed} Test Başarısız`);
  console.log('═════════════════════════════════════════════════════════════\n');

  if (failed > 0) process.exit(1);
}

runTests().catch(err => {
  console.error('Kritik test hatası:', err);
  process.exit(1);
});
