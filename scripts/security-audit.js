/**
 * Kitap Kulübü — Kapsamlı API Güvenlik ve Sızma Testi Senaryoları (Security Audit Test Suite)
 * 
 * Kullanım:
 *   node scripts/security-audit.js
 */

const BASE_URL = 'http://localhost:5000';

async function runSecurityAudit() {
  console.log('╔═════════════════════════════════════════════════════════════════════╗');
  console.log('║   KİTAP KULÜBÜ — KAPSAMLI API GÜVENLİK VE SERTLEŞTİRME TESTİ       ║');
  console.log('╚═════════════════════════════════════════════════════════════════════╝\n');

  let passed = 0;
  let failed = 0;

  async function secTest(code, title, fn) {
    try {
      process.stdout.write(`[SEC-${code}] ${title}... `);
      await fn();
      console.log('✅ GÜVENLİ (ENGELLENDİ / KORUNDU)');
      passed++;
    } catch (e) {
      console.log('❌ AÇIK / HATA:', e.message);
      failed++;
    }
  }

  // 1. Header Spoofing (x-user-id ile Kurucu rolünü taklit etme testi)
  await secTest('01', 'Kimlik Taklidi Testi: Token olmadan x-user-id: user-1 ile admin endpoint çağrısı', async () => {
    const res = await fetch(`${BASE_URL}/api/admin/stats`, {
      headers: { 'x-user-id': 'user-1' }
    });
    if (res.status === 200) {
      throw new Error('KRİTİK AÇIK: Sahte x-user-id kabul edildi ve 200 döndü!');
    }
    if (res.status !== 401) {
      throw new Error(`Beklenen 401, alınan: ${res.status}`);
    }
  });

  // 2. Korumasız Kurucu Profilini Değiştirme Testi (Account Takeover)
  await secTest('02', 'Hesap Ele Geçirme: Yetkisiz PATCH /api/auth/founder-profile çağrısı', async () => {
    const res = await fetch(`${BASE_URL}/api/auth/founder-profile`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'hacker@saldirgan.com', password: 'pwned_password' })
    });
    if (res.status === 200) {
      throw new Error('KRİTİK AÇIK: Kurucu profili şifresiz/yetkisiz değiştirilebildi!');
    }
    if (res.status !== 401 && res.status !== 403) {
      throw new Error(`Beklenen 401/403, alınan: ${res.status}`);
    }
  });

  // 3. Genel Kullanıcı Listesi İfşası (Public Scraping Testi)
  await secTest('03', 'Veri Sızıntısı: Giriş yapmadan GET /api/auth/users çağrısı', async () => {
    const res = await fetch(`${BASE_URL}/api/auth/users`);
    if (res.status === 200) {
      throw new Error('AÇIK: Tüm kullanıcı listesi yetkisiz şekilde çekilebiliyor!');
    }
    if (res.status !== 401) {
      throw new Error(`Beklenen 401, alınan: ${res.status}`);
    }
  });

  // 4. Okuma Seansları Veri Sızıntısı Testi
  await secTest('04', 'Kişisel Veri Korunumu: Giriş yapmadan GET /api/sessions çağrısı', async () => {
    const res = await fetch(`${BASE_URL}/api/sessions`);
    if (res.status === 200) {
      throw new Error('AÇIK: Tüm kullanıcıların okuma seansları yetkisiz ifşa ediliyor!');
    }
    if (res.status !== 401) {
      throw new Error(`Beklenen 401, alınan: ${res.status}`);
    }
  });

  // 5. Özel Oda Mesajlarını Dinleme Testi
  await secTest('05', 'Gizlilik Testi: Giriş yapmadan GET /api/rooms/room-1/messages çağrısı', async () => {
    const res = await fetch(`${BASE_URL}/api/rooms/room-1/messages`);
    if (res.status === 200) {
      throw new Error('AÇIK: Oda mesajları oturumsuz kullanıcılara açık!');
    }
    if (res.status !== 401) {
      throw new Error(`Beklenen 401, alınan: ${res.status}`);
    }
  });

  // 6. Bilgi İfşası Testi: GET /api/beta/status yanıtında gizli e-posta var mı?
  await secTest('06', 'Bilgi İfşası: GET /api/beta/status içinde designatedTesterEmail sızıntısı', async () => {
    const res = await fetch(`${BASE_URL}/api/beta/status`);
    const data = await res.json();
    if (data.designatedTesterEmail) {
      throw new Error(`AÇIK: Özel testçi e-postası genel API'de sızdırılıyor: ${data.designatedTesterEmail}`);
    }
  });

  // 7. Geçerli Kurucu Girişi ve Token Alımı
  let founderToken = null;
  await secTest('07', 'Kimlik Doğrulama: Kurucu girişi ve kriptografik Bearer token alımı', async () => {
    const res = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'kurucu@kitapkulubu.com', password: 'hash_sha256_kurucu2026' })
    });
    const data = await res.json();
    if (!data.success || !data.token) {
      throw new Error('Geçerli token üretilemedi: ' + (data.error || 'Token yok'));
    }
    founderToken = data.token;
  });

  // 8. Doğrulanmış Token ile Yetkili Erişim
  await secTest('08', 'Yetki Doğrulaması: Kriptografik Bearer token ile Admin API çağrısı', async () => {
    const res = await fetch(`${BASE_URL}/api/admin/stats`, {
      headers: { 'Authorization': `Bearer ${founderToken}` }
    });
    if (res.status !== 200) {
      throw new Error(`Geçerli token reddedildi! Durum: ${res.status}`);
    }
  });

  // 9. Güvenli Kullanıcı Listeleme (Maskeleme Testi)
  await secTest('09', 'Hassas Veri Maskeleme: GET /api/auth/users yanıtında passwordHash olmamalı', async () => {
    const res = await fetch(`${BASE_URL}/api/auth/users`, {
      headers: { 'Authorization': `Bearer ${founderToken}` }
    });
    const users = await res.json();
    if (!Array.isArray(users) || users.length === 0) {
      throw new Error('Kullanıcı listesi alınamadı');
    }
    const hasHash = users.some(u => u.passwordHash !== undefined);
    if (hasHash) {
      throw new Error('AÇIK: Kullanıcı listesinde passwordHash alanı sızıyor!');
    }
  });

  // 10. HTTP Güvenlik Başlıkları Testi
  await secTest('10', 'Güvenlik Başlıkları: nosniff, DENY, XSS koruma başlıkları', async () => {
    const res = await fetch(`${BASE_URL}/health`);
    const nosniff = res.headers.get('x-content-type-options');
    const xframe = res.headers.get('x-frame-options');
    if (nosniff !== 'nosniff') throw new Error('X-Content-Type-Options: nosniff başlığı eksik!');
    if (xframe !== 'DENY') throw new Error('X-Frame-Options: DENY başlığı eksik!');
  });

  console.log('\n═════════════════════════════════════════════════════════════════════');
  console.log(`GÜVENLİK TESTİ SONUCU: ${passed} / ${passed + failed} KONTROL BAŞARILI`);
  if (failed === 0) {
    console.log('🛡️  TÜM AÇIK APİ VE GÜVENLİK ZAFİYETLERİ BAŞARIYLA KAPATILDI!');
  } else {
    console.log(`⚠️  ${failed} GÜVENLİK TESTİ BAŞARISIZ OLDU.`);
  }
  console.log('═════════════════════════════════════════════════════════════════════\n');

  if (failed > 0) process.exit(1);
}

runSecurityAudit().catch(err => {
  console.error('Güvenlik denetimi sırasında hata:', err);
  process.exit(1);
});
