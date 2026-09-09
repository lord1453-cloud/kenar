// Süreye göre kademeli edebi özlü söz sistemi ve Söz Koleksiyonu Veritabanı
export const READING_QUOTES = {
  // 0 - 10 dakika: Başlangıç Sözleri (Kademe 1)
  tier1: [
    {
      id: 'quote-1',
      text: 'Bir sayfa bile olsa okumaya devam et. Küçük bir kıvılcım büyük bir ateşi başlatır.',
      author: 'Virginia Woolf',
      source: 'Kendine Ait Bir Oda',
      tier: 'Başlangıç Sözü',
      tierLevel: 1,
      durationLabel: '0 - 10 Dakika',
      badge: '🌱 İlk Adım'
    },
    {
      id: 'quote-2',
      text: 'Kitaplar soğuk ama en emin ve sadık dostlardır.',
      author: 'Victor Hugo',
      source: 'Sefiller',
      tier: 'Başlangıç Sözü',
      tierLevel: 1,
      durationLabel: '0 - 10 Dakika',
      badge: '🌱 İlk Adım'
    },
    {
      id: 'quote-3',
      text: 'Okumak, iki uzak ruhun sessizce ve hürmetle el sıkışmasıdır.',
      author: 'Ahmet Hamdi Tanpınar',
      source: 'Huzur',
      tier: 'Başlangıç Sözü',
      tierLevel: 1,
      durationLabel: '0 - 10 Dakika',
      badge: '🌱 İlk Adım'
    }
  ],

  // 10 - 20 dakika: Motivasyon Sözleri (Kademe 2)
  tier2: [
    {
      id: 'quote-4',
      text: 'Her kitap yeni bir yolculuktur. Zihniniz yavaşça sayfaların arasına süzülür.',
      author: 'Umberto Eco',
      source: 'Gülün Adı',
      tier: 'Motivasyon Sözü',
      tierLevel: 2,
      durationLabel: '10 - 20 Dakika',
      badge: '✨ Isınma Turu'
    },
    {
      id: 'quote-5',
      text: 'Dünyada hiçbir şey kitap okurken duyulan o derin ve dingin huzurun yerini tutamaz.',
      author: 'Stefan Zweig',
      source: 'Bilinmeyen Bir Kadının Mektubu',
      tier: 'Motivasyon Sözü',
      tierLevel: 2,
      durationLabel: '10 - 20 Dakika',
      badge: '✨ Isınma Turu'
    },
    {
      id: 'quote-6',
      text: 'İçinde bir parça aydınlık arıyorsan bir kitap aç ve sayfaları derince kokla.',
      author: 'Sabahattin Ali',
      source: 'Kürk Mantolu Madonna',
      tier: 'Motivasyon Sözü',
      tierLevel: 2,
      durationLabel: '10 - 20 Dakika',
      badge: '✨ Isınma Turu'
    }
  ],

  // 20 - 30 dakika: Derinleşme Sözleri (Kademe 3)
  tier3: [
    {
      id: 'quote-7',
      text: 'Bugün kendine yeni bir dünya açtın. Kelimeler artık zihninde soluk alıp veriyor.',
      author: 'Jorge Luis Borges',
      source: 'Fikirler ve Aynalar',
      tier: 'Derin Okuma Sözü',
      tierLevel: 3,
      durationLabel: '20 - 30 Dakika',
      badge: '📖 Derin Odak'
    },
    {
      id: 'quote-8',
      text: 'Kitap okumak, başka bir insanın beyniyle düşünmeye cüret etmektir.',
      author: 'Arthur Schopenhauer',
      source: 'Okumak, Yazmak ve Yaşamak Üzerine',
      tier: 'Derin Okuma Sözü',
      tierLevel: 3,
      durationLabel: '20 - 30 Dakika',
      badge: '📖 Derin Odak'
    },
    {
      id: 'quote-9',
      text: 'Kelimelerle kurulmuş bir şehirde dolaşmak kadar büyüleyici bir sığınak yoktur.',
      author: 'Oğuz Atay',
      source: 'Tutunamayanlar',
      tier: 'Derin Okuma Sözü',
      tierLevel: 3,
      durationLabel: '20 - 30 Dakika',
      badge: '📖 Derin Odak'
    }
  ],

  // 30 - 60 dakika: Özel Sözler (Kademe 4)
  tier4: [
    {
      id: 'quote-10',
      text: 'Bir saat boyunca bambaşka bir dünyanın içindeydin. Zaman dışarıda aktı, sen içerde büyüdün.',
      author: 'Marcel Proust',
      source: 'Kayıp Zamanın İzinde',
      tier: 'Özel Seans Sözü',
      tierLevel: 4,
      durationLabel: '30 - 60 Dakika',
      badge: '⭐ Usta Seans'
    },
    {
      id: 'quote-11',
      text: 'Okumak yalnızlığın en asil kalesidir. Sayfalar sana fısıldarken dünya sustu.',
      author: 'Cemil Meriç',
      source: 'Bu Ülke',
      tier: 'Özel Seans Sözü',
      tierLevel: 4,
      durationLabel: '30 - 60 Dakika',
      badge: '⭐ Usta Seans'
    },
    {
      id: 'quote-12',
      text: 'İnsan sadece yaşadığı bir ömrü değil, okuduğu binlerce hayatı da kalbine katar.',
      author: 'George R.R. Martin',
      source: 'Ejderhaların Dansı',
      tier: 'Özel Seans Sözü',
      tierLevel: 4,
      durationLabel: '30 - 60 Dakika',
      badge: '⭐ Usta Seans'
    }
  ],

  // 60+ dakika: Nadir / Efsanevi Sözler (Kademe 5)
  tier5: [
    {
      id: 'quote-13',
      text: 'Zamanın ötesine geçtin. Kelimeler artık yalnızca birer harf değil, seninle atan bir nabız oldu.',
      author: 'Italo Calvino',
      source: 'Bir Kış Gecesi Eğer Bir Yolcu',
      tier: 'Efsanevi Edebi Alıntı',
      tierLevel: 5,
      durationLabel: '60+ Dakika',
      badge: '👑 Efsanevi Okur'
    },
    {
      id: 'quote-14',
      text: 'Bir kitap bir balta olmalıdır, içimizdeki donmuş denizi parçalayacak bir balta.',
      author: 'Franz Kafka',
      source: 'Oskar Pollak\'a Mektuplar',
      tier: 'Efsanevi Edebi Alıntı',
      tierLevel: 5,
      durationLabel: '60+ Dakika',
      badge: '👑 Efsanevi Okur'
    },
    {
      id: 'quote-15',
      text: 'Edebiyat, var olmanın katlanılmaz ağırlığını hafifleten kutsal ve zarif bir mırıltıdır.',
      author: 'Fernando Pessoa',
      source: 'Huzursuzluğun Kitabı',
      tier: 'Efsanevi Edebi Alıntı',
      tierLevel: 5,
      durationLabel: '60+ Dakika',
      badge: '👑 Efsanevi Okur'
    }
  ]
};

// Tüm alıntıların düz listesi
export const ALL_QUOTES = [
  ...READING_QUOTES.tier1,
  ...READING_QUOTES.tier2,
  ...READING_QUOTES.tier3,
  ...READING_QUOTES.tier4,
  ...READING_QUOTES.tier5
];

// Süreye (saniye cinsinden) göre alıntı getirme
export const getQuoteForDuration = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  let list;
  if (minutes < 10) list = READING_QUOTES.tier1;
  else if (minutes < 20) list = READING_QUOTES.tier2;
  else if (minutes < 30) list = READING_QUOTES.tier3;
  else if (minutes < 60) list = READING_QUOTES.tier4;
  else list = READING_QUOTES.tier5;

  const randomIndex = Math.floor(Math.random() * list.length);
  return list[randomIndex];
};

// Okuma süresi başarımları tanımları
export const READING_ACHIEVEMENTS = [
  {
    id: 'ach-1',
    title: 'İlk Sayfa',
    description: 'İlk 10 dakikalık okuma seansını tamamla',
    icon: '📖',
    targetSeconds: 600, // 10 min
    color: '#8b5cf6'
  },
  {
    id: 'ach-2',
    title: 'Isınmaya Başladın',
    description: 'Toplam 1 saatlik okuma süresine ulaş',
    icon: '⏱️',
    targetSeconds: 3600, // 1 hour
    color: '#3b82f6'
  },
  {
    id: 'ach-3',
    title: 'Kitap Kurdu',
    description: 'Toplam 5 saatlik kitap okuma süresi kaydet',
    icon: '🐛',
    targetSeconds: 18000, // 5 hours
    color: '#10b981'
  },
  {
    id: 'ach-4',
    title: 'Sayfaların Efendisi',
    description: 'Toplam 10 saat boyunca kitapların dünyasında kaybol',
    icon: '🔥',
    targetSeconds: 36000, // 10 hours
    color: '#f59e0b'
  },
  {
    id: 'ach-5',
    title: 'Kütüphane Sakini',
    description: 'Toplam 50 saatlik derin okuma tecrübesi edin',
    icon: '🏛️',
    targetSeconds: 180000, // 50 hours
    color: '#ec4899'
  },
  {
    id: 'ach-6',
    title: 'Usta Okur',
    description: '100 saatlik muhteşem bir okuma mirası inşa et',
    icon: '👑',
    targetSeconds: 360000, // 100 hours
    color: '#d97706'
  }
];

// 6 Otantik Kütüphane Profil Teması (Eski Kütüphane eklendi)
export const PROFILE_THEMES = [
  {
    id: 'theme-classic',
    name: 'Klasik Kütüphane',
    icon: '📖',
    accent: '#7a2530',
    subAccent: '#c8963e',
    description: 'Bordo deri ciltler, altın varaklar ve meşe raflar.'
  },
  {
    id: 'theme-coffee',
    name: 'Kahve & Kitap',
    icon: '☕',
    accent: '#543927',
    subAccent: '#c9884a',
    description: 'Taze espresso kokusu, ahşap masa ve sıcak karamel.'
  },
  {
    id: 'theme-botanical',
    name: 'Doğal Kitaplık',
    icon: '🌿',
    accent: '#264733',
    subAccent: '#6b8e6b',
    description: 'Sarmaşıklar, adaçayı yeşili ve kraft kağıt huzuru.'
  },
  {
    id: 'theme-midnight',
    name: 'Gece Okuru',
    icon: '🌙',
    accent: '#1e243d',
    subAccent: '#dfaf4f',
    description: 'Gece yarısı mumu, lacivert gökyüzü ve yıldız tozu.'
  },
  {
    id: 'theme-autumn',
    name: 'Sonbahar Kitaplığı',
    icon: '🍂',
    accent: '#943d24',
    subAccent: '#d97706',
    description: 'Kızıl akçaağaç yaprakları, tarçın ve ılık esinti.'
  },
  {
    id: 'theme-antique',
    name: 'Eski Kütüphane',
    icon: '🕯️',
    accent: '#483424',
    subAccent: '#bfa068',
    description: 'Sepya parşömenler, antik ciltler, balmumu mumu ve tütsü.'
  }
];
