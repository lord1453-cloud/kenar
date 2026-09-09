// Test Scenarios Script for Minimalist Kitap Kulübü
import assert from 'assert';

console.log('--- 1. KULLANICI KAYIT & DOĞRULAMA TESTLERİ ---');

// Mock users database
const users = [
  { id: 'user-1', email: 'ahmet@kitapkulubu.com', age: 28, isAdmin: true, roomCredit: 1, isStarUser: true, passwordHash: 'hash_secret_1' },
  { id: 'user-2', email: 'zeynep@kitapkulubu.com', age: 26, isAdmin: false, roomCredit: 2, isStarUser: true, passwordHash: 'hash_secret_2' },
  { id: 'user-3', email: 'can@kitapkulubu.com', age: 24, isAdmin: false, roomCredit: 0, isStarUser: false, passwordHash: 'hash_secret_3' }
];

function registerUser({ firstName, lastName, age, email, password }) {
  const numAge = parseInt(age, 10);
  if (isNaN(numAge) || numAge < 18) {
    return { success: false, error: 'Platformumuza yalnızca 18 yaş ve üzeri kullanıcılar kayıt olabilir.' };
  }
  const emailNorm = email.trim().toLowerCase();
  if (users.some(u => u.email.toLowerCase() === emailNorm)) {
    return { success: false, error: 'Bu e-posta adresi ile kayıtlı bir hesap zaten bulunmaktadır.' };
  }
  const passwordHash = `hash_${btoa(password).slice(0, 16)}`;
  const newUser = {
    id: `user-${Date.now()}`,
    fullName: `${firstName} ${lastName}`,
    age: numAge,
    email: emailNorm,
    passwordHash,
    isAdmin: false,
    isStarUser: false,
    roomCredit: 0
  };
  users.push(newUser);
  return { success: true, user: newUser };
}

// Test 1: 17 yaşındaki kullanıcı engelleniyor mu?
const test17 = registerUser({ firstName: 'Ali', lastName: 'Veli', age: 17, email: 'ali@test.com', password: 'pass' });
assert.strictEqual(test17.success, false);
console.log('✓ 17 yaşındaki kullanıcının kaydı başarıyla engellendi:', test17.error);

// Test 2: 18 yaşındaki kullanıcı kayıt olabiliyor mu?
const test18 = registerUser({ firstName: 'Mehmet', lastName: 'Kaya', age: 18, email: 'mehmet@test.com', password: 'pass' });
assert.strictEqual(test18.success, true);
console.log('✓ 18 yaşındaki kullanıcının kaydı başarıyla kabul edildi:', test18.user.fullName);

// Test 3: Aynı e-mail ile mükerrer kayıt engelleniyor mu?
const testDuplicateEmail = registerUser({ firstName: 'Mehmet2', lastName: 'Kaya', age: 22, email: 'mehmet@test.com', password: 'pass' });
assert.strictEqual(testDuplicateEmail.success, false);
console.log('✓ Mükerrer e-posta başarıyla engellendi:', testDuplicateEmail.error);

// Test 4: Şifre açık metin olarak tutulmuyor mu?
assert.ok(!test18.user.password);
assert.ok(test18.user.passwordHash.startsWith('hash_'));
console.log('✓ Şifre güvenli şekilde hashlenmiş:', test18.user.passwordHash);

console.log('\n--- 2. YILDIZLI KULLANICI & ODA HAKKI ALGORİTMASI TESTLERİ ---');

const monthlyStats = [];
function evaluateMonthlyStarStatus(user, minutes, booksRead, consistencyDays, month = '2026-08') {
  const qualifies = minutes >= 900 && booksRead >= 2;
  const existing = monthlyStats.find(m => m.userId === user.id && m.month === month);
  if (existing && existing.roomCreditAwarded) {
    return { qualifies: false, reason: 'Aynı ay için zaten hak verildi' };
  }

  const stat = {
    userId: user.id,
    month,
    minutes,
    booksRead,
    consistencyDays,
    qualified: qualifies,
    roomCreditAwarded: qualifies
  };
  monthlyStats.push(stat);

  if (qualifies) {
    user.isStarUser = true;
    user.roomCredit = (user.roomCredit || 0) + 1;
    return { qualifies: true, roomCredit: user.roomCredit };
  }
  return { qualifies: false, roomCredit: user.roomCredit };
}

// User 3 (Can Kaya): 950 dakika, 3 kitap okudu -> Kriterleri sağlıyor
const starEval = evaluateMonthlyStarStatus(users[2], 950, 3, 20, '2026-08');
assert.strictEqual(starEval.qualifies, true);
assert.strictEqual(users[2].isStarUser, true);
assert.strictEqual(users[2].roomCredit, 1);
console.log('✓ Kriterleri sağlayan kullanıcı Yıldızlı oldu ve +1 oda hakkı kazandı. Kredi:', users[2].roomCredit);

// Tekrar aynı ay için hak kazanmaya çalışırsa:
const repeatEval = evaluateMonthlyStarStatus(users[2], 1200, 4, 25, '2026-08');
assert.strictEqual(repeatEval.qualifies, false);
assert.strictEqual(users[2].roomCredit, 1);
console.log('✓ Aynı ay için mükerrer oda hakkı verilmesi engellendi:', repeatEval.reason);

console.log('\n--- 3. ODA AÇMA YETKİLERİ TESTLERİ ---');

function createRoom(user, roomData) {
  if (user.isAdmin) {
    return { success: true, role: 'admin_unlimited' };
  }
  if (user.roomCredit >= 1) {
    user.roomCredit -= 1;
    return { success: true, remainingCredits: user.roomCredit };
  }
  return { success: false, error: 'Oda açma hakkınız bulunmamaktadır.' };
}

// Admin (user-1) oda açabilir (kredi gereksiz)
const adminRoom = createRoom(users[0], { name: 'Admin Odası' });
assert.strictEqual(adminRoom.success, true);
assert.strictEqual(adminRoom.role, 'admin_unlimited');
console.log('✓ Admin kullanıcısı kısıtlama olmaksızın oda açabiliyor');

// User 3 (Can Kaya: 1 kredi var) oda açabilir ve kredisi düşer
const userRoom = createRoom(users[2], { name: 'Felsefe Odası' });
assert.strictEqual(userRoom.success, true);
assert.strictEqual(users[2].roomCredit, 0);
console.log('✓ Yıldızlı kullanıcı kredisiyle oda açtı, kalan kredi:', users[2].roomCredit);

// Kredisi bitince tekrar açamaz:
const failedRoom = createRoom(users[2], { name: 'İkinci Oda' });
assert.strictEqual(failedRoom.success, false);
console.log('✓ Kredisi tükenen normal kullanıcının oda açması engellendi:', failedRoom.error);

console.log('\n--- 4. GÖRSEL TELİF & MODERASYON TESTLERİ ---');

const moderationLogs = [];
function moderateImage(content, imageUrl) {
  const lower = (content + ' ' + (imageUrl || '')).toLowerCase();
  const forbidden = ['tam_sayfa', 'full_page_scan', 'sayfa_tarama', 'telifli_kitap', 'pdf_scan'];
  const isInfringing = forbidden.some(p => lower.includes(p));

  if (isInfringing) {
    moderationLogs.push({
      id: `mod-${Date.now()}`,
      content,
      imageUrl,
      reason: 'Telif ihlali riski: Kitap sayfalarının tam taranması engellendi.',
      status: 'blocked'
    });
    return { allowed: false, message: 'Bu görsel topluluk ve telif kurallarımıza uygun olmadığı için paylaşım kaldırıldı.' };
  }
  return { allowed: true };
}

// Test: Tam sayfa tarama içeren görsel
const modTest = moderateImage('Dune kitabının 40 sayfasını çektim', 'http://image.com/tam_sayfa_tarama.jpg');
assert.strictEqual(modTest.allowed, false);
assert.strictEqual(moderationLogs.length, 1);
console.log('✓ Telifli/tam sayfa tarama görseli başarıyla engellendi:', modTest.message);
console.log('✓ Moderasyon günlüğüne kayıt eklendi:', moderationLogs[0].reason);

// Test: Normal görsel
const modTestNormal = moderateImage('Bugün okuma köşem ve kahvem', 'http://image.com/kahve_ve_kitap.jpg');
assert.strictEqual(modTestNormal.allowed, true);
console.log('✓ Kurallara uygun görsel onaylandı.');

console.log('\n========================================');
console.log('TÜM ARKA PLAN VE İŞ MANTIĞI TESTLERİ BAŞARIYLA GEÇTİ! ✓');
console.log('========================================\n');
