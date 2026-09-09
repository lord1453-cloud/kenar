#!/usr/bin/env node
/**
 * Kitap Kulübü — Kurucu (Founder) Hesabı Oluşturma Seed Komutu
 * 
 * Kullanım:
 *   npm run create-founder
 *   veya
 *   node scripts/create-founder.js
 * 
 * Bu komut yalnızca ilk kurulum sırasında kullanılmalıdır.
 * Sistemde zaten bir Founder hesabı varsa yeni Founder oluşturulamaz.
 * 
 * Güvenlik Kuralları:
 * - Normal kayıt ekranında "founder" rolü seçilemez.
 * - Hiçbir Admin, Founder oluşturamaz, silemez veya rolünü değiştiremez.
 * - Yalnızca bu seed komutu veya doğrudan veritabanı müdahalesi ile oluşturulabilir.
 */

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { createInterface } from 'readline';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const DATA_FILE = resolve(__dirname, '..', 'src', 'data', 'initialData.js');

const rl = createInterface({
  input: process.stdin,
  output: process.stdout,
});

function ask(question) {
  return new Promise((resolve) => rl.question(question, resolve));
}

function simpleHash(password) {
  // Basit hash simülasyonu (üretimde bcrypt/argon2 kullanılmalıdır)
  return `hash_${Buffer.from(password).toString('base64').slice(0, 16)}`;
}

async function main() {
  console.log('');
  console.log('╔══════════════════════════════════════════════╗');
  console.log('║   KİTAP KULÜBÜ — KURUCU HESABI OLUŞTURMA    ║');
  console.log('║   Bu işlem yalnızca ilk kurulumda yapılır.   ║');
  console.log('╚══════════════════════════════════════════════╝');
  console.log('');

  // Mevcut veritabanını kontrol et
  if (!existsSync(DATA_FILE)) {
    console.error('HATA: initialData.js dosyası bulunamadı.');
    console.error('Beklenen konum:', DATA_FILE);
    process.exit(1);
  }

  const content = readFileSync(DATA_FILE, 'utf8');

  // Zaten bir founder var mı kontrol et
  if (content.includes("role: 'founder'")) {
    console.log('⚠️  Sistemde zaten bir Kurucu (Founder) hesabı bulunmaktadır.');
    console.log('   Güvenlik gereği birden fazla Founder oluşturulamaz.');
    console.log('   Mevcut Founder hesabını değiştirmek için doğrudan veritabanını düzenleyin.');
    rl.close();
    process.exit(0);
  }

  console.log('Kurucu hesabı için bilgileri girin:\n');

  const firstName = await ask('Ad: ');
  const lastName = await ask('Soyad: ');
  const email = await ask('E-posta: ');
  const password = await ask('Şifre: ');
  const age = await ask('Yaş: ');

  if (parseInt(age) < 18) {
    console.error('HATA: Kurucu hesabı 18 yaşından küçük olamaz.');
    rl.close();
    process.exit(1);
  }

  if (!firstName || !lastName || !email || !password) {
    console.error('HATA: Tüm alanlar zorunludur.');
    rl.close();
    process.exit(1);
  }

  const passwordHash = simpleHash(password);
  const username = `${firstName.toLowerCase().replace(/\s+/g, '')}${Math.floor(100 + Math.random() * 900)}`;

  console.log('');
  console.log('Oluşturulacak Kurucu hesabı:');
  console.log(`  Ad Soyad   : ${firstName} ${lastName}`);
  console.log(`  Kullanıcı  : @${username}`);
  console.log(`  E-posta    : ${email}`);
  console.log(`  Yaş        : ${age}`);
  console.log(`  Rol        : founder (en üst yetki)`);
  console.log(`  Parola Hash: ${passwordHash}`);
  console.log('');

  const confirm = await ask('Onaylıyor musunuz? (evet/hayır): ');

  if (confirm.toLowerCase() !== 'evet' && confirm.toLowerCase() !== 'e') {
    console.log('İşlem iptal edildi.');
    rl.close();
    process.exit(0);
  }

  // initialData.js içindeki ilk kullanıcının rolünü founder yap
  // veya yeni bir founder kaydı ekle
  const founderEntry = `
  // --- KURUCU (FOUNDER) HESABI ---
  // Bu hesap seed komutu ile oluşturulmuştur.
  // Rolü hiçbir admin tarafından değiştirilemez.
  {
    id: 'user-founder-${Date.now()}',
    username: '${username}',
    firstName: '${firstName}',
    lastName: '${lastName}',
    fullName: '${firstName} ${lastName}',
    age: ${parseInt(age)},
    email: '${email.toLowerCase()}',
    passwordHash: '${passwordHash}',
    role: 'founder',
    isStarUser: true,
    roomCredit: 99,
    status: 'active',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&h=200&q=80',
    bio: 'Kitap Kulübü Kurucusu.',
    joinedDate: '${new Date().toLocaleDateString('tr-TR', { month: 'long', year: 'numeric' })}',
    readingGoal: 50,
    streak: 1,
    totalReadingSeconds: 0,
    todayReadingSeconds: 0,
    todayGoalMinutes: 30,
    favoriteBookId: null,
    favoriteGenre: 'Edebiyat',
    profileTheme: 'dark',
    privacySettings: {
      isPublic: true,
      showReadingTime: true,
      showBooks: true,
      showActivityStatus: true
    },
    weeklyStreak: [],
    friends: [],
    followers: [],
    following: []
  },`;

  // İlk INITIAL_USERS dizisinin başına ekle
  const updatedContent = content.replace(
    'export const INITIAL_USERS = [',
    `export const INITIAL_USERS = [${founderEntry}`
  );

  writeFileSync(DATA_FILE, updatedContent, 'utf8');

  console.log('');
  console.log('════════════════════════════════════════════');
  console.log('✓ Kurucu (Founder) hesabı başarıyla oluşturuldu!');
  console.log('');
  console.log('Güvenlik Hatırlatmaları:');
  console.log('  • Bu hesap sistemdeki en üst yetki seviyesine sahiptir.');
  console.log('  • Hiçbir Admin bu hesabı değiştiremez veya silemez.');
  console.log('  • Rolü yalnızca veritabanı düzeyinde değiştirilebilir.');
  console.log('  • Bu seed komutunu tekrar çalıştırmak yeni bir founder oluşturmayacaktır.');
  console.log('════════════════════════════════════════════');

  rl.close();
}

main().catch((err) => {
  console.error('Beklenmeyen hata:', err.message);
  rl.close();
  process.exit(1);
});
