export const INITIAL_USERS = [
  {
    id: 'user-1',
    username: 'ayseyilmaz',
    firstName: 'Ayşe',
    lastName: 'Yılmaz',
    fullName: 'Ayşe Yılmaz',
    age: 28,
    email: 'kurucu@kitapkulubu.com',
    passwordHash: 'hash_sha256_kurucu2026',
    role: 'founder',
    isStarUser: true,
    roomCredit: 5,
    status: 'active',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&h=200&q=80',
    bio: 'Sakin okumalar ve kenar notları. Edebiyat ve felsefe.',
    joinedDate: 'Ocak 2025',
    readingGoal: 47,
    streak: 14,
    totalReadingSeconds: 174960,
    todayReadingSeconds: 1560,
    todayGoalMinutes: 30,
    favoriteBookId: 'book-1',
    favoriteGenre: 'Roman',
    profileTheme: 'dark',
    privacySettings: {
      isPublic: true,
      showReadingTime: true,
      showBooks: true,
      showActivityStatus: true
    },
    weeklyStreak: [
      { day: 'Pzt', name: 'Pazartesi', completed: true, minutes: 45 },
      { day: 'Sal', name: 'Salı', completed: true, minutes: 30 },
      { day: 'Çar', name: 'Çarşamba', completed: true, minutes: 40 },
      { day: 'Per', name: 'Perşembe', completed: true, minutes: 25 },
      { day: 'Cum', name: 'Cuma', completed: true, minutes: 50 },
      { day: 'Cmt', name: 'Cumartesi', completed: true, minutes: 60 },
      { day: 'Paz', name: 'Pazar', completed: true, minutes: 26 }
    ],
    friends: ['user-2', 'user-3'],
    followers: ['user-2', 'user-3', 'user-4'],
    following: ['user-2', 'user-3']
  },
  {
    id: 'user-2',
    username: 'zeynepd',
    firstName: 'Zeynep',
    lastName: 'Demir',
    fullName: 'Zeynep Demir',
    age: 26,
    email: 'zeynep@kitapkulubu.com',
    passwordHash: 'hash_sha256_zeynepd26',
    role: 'admin',
    isStarUser: true,
    roomCredit: 2,
    status: 'active',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&h=200&q=80',
    bio: 'Fantastik edebiyat ve polisiye tutkunu. Tolkien & Agatha Christie okumaları.',
    joinedDate: 'Ocak 2025',
    readingGoal: 40,
    streak: 21,
    totalReadingSeconds: 224400, // ~62.3 hours
    todayReadingSeconds: 2400,   // 40 min
    todayGoalMinutes: 45,
    favoriteBookId: 'book-4',
    favoriteGenre: 'Fantastik',
    profileTheme: 'warm',
    privacySettings: {
      isPublic: true,
      showReadingTime: true,
      showBooks: true,
      showActivityStatus: true
    },
    weeklyStreak: [
      { day: 'Pzt', name: 'Pazartesi', completed: true, minutes: 50 },
      { day: 'Sal', name: 'Salı', completed: true, minutes: 60 },
      { day: 'Çar', name: 'Çarşamba', completed: true, minutes: 45 },
      { day: 'Per', name: 'Perşembe', completed: true, minutes: 40 },
      { day: 'Cum', name: 'Cuma', completed: true, minutes: 55 },
      { day: 'Cmt', name: 'Cumartesi', completed: true, minutes: 80 },
      { day: 'Paz', name: 'Pazar', completed: true, minutes: 40 }
    ],
    friends: ['user-1'],
    followers: ['user-1', 'user-3', 'user-5'],
    following: ['user-1', 'user-4']
  },
  {
    id: 'user-3',
    username: 'cankaya',
    firstName: 'Can',
    lastName: 'Kaya',
    fullName: 'Can Kaya',
    age: 24,
    email: 'can@kitapkulubu.com',
    passwordHash: 'hash_sha256_cankaya24',
    role: 'user',
    isStarUser: false,
    roomCredit: 0,
    status: 'active',
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=200&h=200&q=80',
    bio: 'Felsefe, varoluşçuluk ve psikoloji okuru. Not tutarak okumayı tercih ederim.',
    joinedDate: 'Nisan 2025',
    readingGoal: 24,
    streak: 9,
    totalReadingSeconds: 115200,
    todayReadingSeconds: 1200,
    todayGoalMinutes: 30,
    favoriteBookId: 'book-2',
    favoriteGenre: 'Felsefe',
    profileTheme: 'cool',
    privacySettings: {
      isPublic: true,
      showReadingTime: true,
      showBooks: true,
      showActivityStatus: true
    },
    weeklyStreak: [
      { day: 'Pzt', name: 'Pazartesi', completed: true, minutes: 30 },
      { day: 'Sal', name: 'Salı', completed: true, minutes: 35 },
      { day: 'Çar', name: 'Çarşamba', completed: true, minutes: 20 },
      { day: 'Per', name: 'Perşembe', completed: true, minutes: 40 },
      { day: 'Cum', name: 'Cuma', completed: true, minutes: 45 },
      { day: 'Cmt', name: 'Cumartesi', completed: true, minutes: 30 },
      { day: 'Paz', name: 'Pazar', completed: true, minutes: 20 }
    ],
    friends: ['user-1'],
    followers: ['user-1', 'user-2'],
    following: ['user-1']
  },
  {
    id: 'user-4',
    username: 'elifozkan',
    firstName: 'Elif',
    lastName: 'Özkan',
    fullName: 'Elif Özkan',
    age: 31,
    email: 'elif@kitapkulubu.com',
    passwordHash: 'hash_sha256_elifozkan31',
    role: 'user',
    isStarUser: false,
    roomCredit: 0,
    status: 'active',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&h=200&q=80',
    bio: 'Tarihi romanlar ve biyografi tutkunu. Kitap kulüplerinde tartışmayı severim.',
    joinedDate: 'Şubat 2025',
    readingGoal: 30,
    streak: 5,
    totalReadingSeconds: 98000,
    todayReadingSeconds: 0,
    todayGoalMinutes: 30,
    favoriteBookId: 'book-3',
    favoriteGenre: 'Tarih',
    profileTheme: 'sepia',
    privacySettings: {
      isPublic: true,
      showReadingTime: true,
      showBooks: true,
      showActivityStatus: true
    },
    weeklyStreak: [],
    friends: [],
    followers: ['user-1'],
    following: ['user-2']
  },
  {
    id: 'user-author-yasmin',
    username: 'yasminawad',
    firstName: 'Yasmin',
    lastName: 'Awad',
    fullName: 'Yasmin Awad',
    age: 34,
    email: 'yasmin@kitapkulubu.com',
    role: 'author',
    isStarUser: true,
    roomCredit: 10,
    status: 'active',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&h=200&q=80',
    bio: 'Yazar & Sağlık Araştırmacısı. "The Cholesterol Myth" yazarı.',
    joinedDate: 'Ağustos 2025',
    readingGoal: 45,
    streak: 18,
    totalReadingSeconds: 310000,
    todayReadingSeconds: 1800,
    todayGoalMinutes: 40,
    favoriteBookId: 'book-7',
    favoriteGenre: 'Sağlık & Yaşam',
    profileTheme: 'main',
    privacySettings: { isPublic: true, showReadingTime: true, showBooks: true, showActivityStatus: true },
    weeklyStreak: [],
    friends: ['user-1'],
    followers: ['user-1', 'user-2', 'user-3', 'user-4'],
    following: ['user-1']
  },
  {
    id: 'user-author-saadet',
    username: 'saadetyilmaz',
    firstName: 'Saadet',
    lastName: 'Yılmaz',
    fullName: 'Saadet Yılmaz',
    age: 29,
    email: 'saadet@kitapkulubu.com',
    role: 'author',
    isStarUser: true,
    roomCredit: 10,
    status: 'active',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&h=200&q=80',
    bio: 'Yazar, Tasarımcı & Kitap Kulübü Kurucu Ortağı. Edebi kurgu ve anlatı sanatları.',
    joinedDate: 'Ocak 2025',
    readingGoal: 50,
    streak: 32,
    totalReadingSeconds: 420000,
    todayReadingSeconds: 2400,
    todayGoalMinutes: 45,
    favoriteBookId: 'book-1',
    favoriteGenre: 'Roman & Edebiyat',
    profileTheme: 'main',
    privacySettings: { isPublic: true, showReadingTime: true, showBooks: true, showActivityStatus: true },
    weeklyStreak: [],
    friends: ['user-1', 'user-2'],
    followers: ['user-1', 'user-2', 'user-3', 'user-4', 'user-author-yasmin'],
    following: ['user-1', 'user-2']
  },
  {
    id: 'user-author-frank',
    username: 'frankherbert',
    firstName: 'Frank',
    lastName: 'Herbert',
    fullName: 'Frank Herbert',
    age: 65,
    email: 'frank@dune.org',
    role: 'author',
    isStarUser: true,
    roomCredit: 20,
    status: 'active',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&h=200&q=80',
    bio: 'Dune Evreni Yaratıcısı, Bilim Kurgu Yazarı ve Ekolojist.',
    joinedDate: 'Aralık 2024',
    readingGoal: 60,
    streak: 45,
    totalReadingSeconds: 890000,
    todayReadingSeconds: 3600,
    todayGoalMinutes: 60,
    favoriteBookId: 'book-1',
    favoriteGenre: 'Bilim Kurgu',
    profileTheme: 'palette_sun_coral',
    privacySettings: { isPublic: true, showReadingTime: true, showBooks: true, showActivityStatus: true },
    weeklyStreak: [],
    friends: ['user-1'],
    followers: ['user-1', 'user-2', 'user-3', 'user-4', 'user-author-saadet'],
    following: []
  }
];

export const INITIAL_USER_FOLDERS = [
  {
    id: 'uf-1',
    userId: 'user-1',
    name: 'Dünya Klasikleri Seçkim',
    color: '#007AFF', // Apple iOS Blue
    bookIds: ['book-wc-1', 'book-wc-2', 'book-wc-3', 'book-wc-8'],
    createdAt: '2026-08-15'
  },
  {
    id: 'uf-2',
    userId: 'user-1',
    name: 'Türk Edebiyatı Hazinesi',
    color: '#FF9500', // Apple iOS Amber
    bookIds: ['book-tr-1', 'book-tr-2', 'book-tr-3', 'book-tr-7'],
    createdAt: '2026-08-20'
  },
  {
    id: 'uf-3',
    userId: 'user-1',
    name: 'Bilim Kurgu & Distopya',
    color: '#5856D6', // Apple iOS Indigo
    bookIds: ['book-1', 'book-sf-2', 'book-sf-3', 'book-sf-4'],
    createdAt: '2026-08-25'
  },
  {
    id: 'uf-4',
    userId: 'user-1',
    name: 'Felsefe & Derin Düşünce',
    color: '#34C759', // Apple iOS Green
    bookIds: ['book-ph-1', 'book-ph-2', 'book-ph-3'],
    createdAt: '2026-09-01'
  }
];

export const INITIAL_FRIEND_REQUESTS = [
  {
    id: 'freq-1',
    fromUserId: 'user-4',
    toUserId: 'user-1',
    status: 'pending',
    date: '2026-09-03 18:20'
  }
];

export const INITIAL_MONTHLY_USER_STATS = [
  {
    id: 'mus-1',
    userId: 'user-1',
    month: '2026-08',
    readingMinutes: 1020,
    booksCompleted: 3,
    consistencyDays: 24,
    qualified: true,
    roomCreditAwarded: true
  },
  {
    id: 'mus-2',
    userId: 'user-2',
    month: '2026-08',
    readingMinutes: 1450,
    booksCompleted: 4,
    consistencyDays: 28,
    qualified: true,
    roomCreditAwarded: true
  },
  {
    id: 'mus-3',
    userId: 'user-3',
    month: '2026-08',
    readingMinutes: 420,
    booksCompleted: 1,
    consistencyDays: 11,
    qualified: false,
    roomCreditAwarded: false
  }
];

export const INITIAL_MODERATION_LOGS = [
  {
    id: 'mod-1',
    userId: 'user-3',
    userName: 'Can Kaya',
    postContent: 'Kitabın 120-135. sayfalarının tamamını fotoğrafladım.',
    imageUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c',
    reason: 'Telif ihlali riski: Kitap sayfalarının tam taranması engellendi.',
    status: 'blocked',
    timestamp: '2026-09-02 14:15',
    adminReviewed: false
  }
];

export const INITIAL_BOOKS = [
  {
    id: 'book-1',
    title: 'Dune',
    author: 'Frank Herbert',
    cover: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1555447414i/44767458.jpg',
    pages: 712,
    genre: 'Bilim Kurgu',
    rating: 4.8,
    readersCount: 1420,
    description: 'Modern bilim kurgunun zirve noktası kabul edilen Dune, çöl gezegeni Arrakis ve Paul Atreides\'in destansı yolculuğunu anlatır.'
  },
  {
    id: 'book-2',
    title: '1984',
    author: 'George Orwell',
    cover: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1657781256i/61439040.jpg',
    pages: 352,
    genre: 'Distopya',
    rating: 4.9,
    readersCount: 2840,
    description: 'Büyük Birader\'in gözetimindeki Okyanusya\'da hakikati arayan Winston Smith\'in unutulmaz hikayesi.'
  },
  {
    id: 'book-3',
    title: 'Saatleri Ayarlama Enstitüsü',
    author: 'Ahmet Hamdi Tanpınar',
    cover: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1359885834i/2487405.jpg',
    pages: 400,
    genre: 'Klasik',
    rating: 4.7,
    readersCount: 890,
    description: 'Doğu ile Batı arasında bocalayan modernleşme maceramızın en derin ve incelikli hicvi.'
  },
  {
    id: 'book-4',
    title: 'Harry Potter ve Felsefe Taşı',
    author: 'J.K. Rowling',
    cover: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1474154022i/3.jpg',
    pages: 276,
    genre: 'Fantastik',
    rating: 4.8,
    readersCount: 3410,
    description: 'Hogwarts Cadılık ve Büyücülük Okulu\'na adım atan Harry Potter\'ın büyülü dünyadaki ilk yılı.'
  },
  {
    id: 'book-5',
    title: 'Yabancı',
    author: 'Albert Camus',
    cover: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1590930002i/49552.jpg',
    pages: 110,
    genre: 'Felsefe',
    rating: 4.6,
    readersCount: 1650,
    description: 'Meursault\'un cezayir güneşinde işlediği bir cinayet ve ardından gelen absürt yabancılaşma.'
  },
  {
    id: 'book-6',
    title: 'Bilinmeyen Bir Kadının Mektubu',
    author: 'Stefan Zweig',
    cover: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1476275466i/83921.jpg',
    pages: 64,
    genre: 'Klasik',
    rating: 4.7,
    readersCount: 2190,
    description: 'Bütün bir ömrü tek bir insana adanmış tutkulu ve karşılıksız bir aşkın mektuplarda yankılanışı.'
  },
  {
    id: 'book-7',
    title: 'The Cholesterol Myth',
    author: 'Yasmin Awad',
    cover: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=400&h=600&q=80',
    pages: 320,
    genre: 'Health | Low Carb',
    rating: 4.55,
    readersCount: 426321,
    description: "You've been told that cholesterol is the villain behind heart disease, stroke, and early death but what if you've been lied to all along? Eat the Damn Butter. End the War on Fat. Remember What Healing Feels Like."
  },
  {
    id: 'book-8',
    title: "The Mapmaker's Lament",
    author: 'Celeste Anwar',
    cover: 'https://images.unsplash.com/photo-1532012164546-f432f2e3777f?auto=format&fit=crop&w=400&h=600&q=80',
    pages: 384,
    genre: 'Fantastik & Macera',
    rating: 4.75,
    readersCount: 84200,
    description: 'Bilinmeyen coğrafyaların büyülü haritalarını çizen yalnız bir kartografın, kadim bir imparatorluğun silinen sınırlarını arayış destanı.'
  }
];

export const INITIAL_USER_BOOKS = [
  {
    id: 'ub-1',
    userId: 'user-1',
    bookId: 'book-1', // Dune
    status: 'reading',
    currentPage: 248,
    totalReadingSeconds: 31200,
    startDate: '2026-08-20',
    finishDate: null,
    userRating: null,
    notes: 'Arrakis ekolojisi ve baharat mistisizmi.'
  },
  {
    id: 'ub-2',
    userId: 'user-1',
    bookId: 'book-2', // 1984
    status: 'read',
    currentPage: 352,
    totalReadingSeconds: 43200,
    startDate: '2026-08-01',
    finishDate: '2026-08-14',
    userRating: 5,
    notes: 'Distopya edebiyatının başyapıtı.'
  },
  {
    id: 'ub-wc-2',
    userId: 'user-1',
    bookId: 'book-wc-2', // Suç ve Ceza
    status: 'read',
    currentPage: 688,
    totalReadingSeconds: 68800,
    startDate: '2026-07-10',
    finishDate: '2026-07-28',
    userRating: 5,
    notes: 'Raskolnikov ve vicdan muhasebesi.'
  },
  {
    id: 'ub-wc-3',
    userId: 'user-1',
    bookId: 'book-wc-3', // Dönüşüm
    status: 'read',
    currentPage: 80,
    totalReadingSeconds: 9800,
    startDate: '2026-08-10',
    finishDate: '2026-08-12',
    userRating: 5,
    notes: 'Kafkaesk başyapıt.'
  },
  {
    id: 'ub-tr-1',
    userId: 'user-1',
    bookId: 'book-tr-1', // Saatleri Ayarlama Enstitüsü
    status: 'read',
    currentPage: 400,
    totalReadingSeconds: 45000,
    startDate: '2026-06-01',
    finishDate: '2026-06-20',
    userRating: 5,
    notes: 'Tanpınar’ın eşsiz hicvi.'
  },
  {
    id: 'ub-tr-2',
    userId: 'user-1',
    bookId: 'book-tr-2', // Tutunamayanlar
    status: 'read',
    currentPage: 724,
    totalReadingSeconds: 82000,
    startDate: '2026-05-01',
    finishDate: '2026-05-30',
    userRating: 5,
    notes: 'Oğuz Atay ve Selim Işık.'
  },
  {
    id: 'ub-tr-3',
    userId: 'user-1',
    bookId: 'book-tr-3', // Kürk Mantolu Madonna
    status: 'read',
    currentPage: 160,
    totalReadingSeconds: 18000,
    startDate: '2026-08-15',
    finishDate: '2026-08-18',
    userRating: 5,
    notes: 'Raif Efendi ve Maria Puder.'
  },
  {
    id: 'ub-ph-1',
    userId: 'user-1',
    bookId: 'book-ph-1', // Böyle Söyledi Zerdüşt
    status: 'read',
    currentPage: 384,
    totalReadingSeconds: 42000,
    startDate: '2026-07-01',
    finishDate: '2026-07-15',
    userRating: 5,
    notes: 'Nietzsche ve üstinsan felsefesi.'
  },
  {
    id: 'ub-pop-1',
    userId: 'user-1',
    bookId: 'book-pop-1', // Gece Yarısı Kütüphanesi
    status: 'read',
    currentPage: 296,
    totalReadingSeconds: 29600,
    startDate: '2026-08-22',
    finishDate: '2026-08-28',
    userRating: 5,
    notes: 'Paralel hayatlar ve pişmanlıklar.'
  },
  {
    id: 'ub-3',
    userId: 'user-1',
    bookId: 'book-3', // Saatleri Ayarlama Enstitüsü
    status: 'to_read',
    currentPage: 0,
    totalReadingSeconds: 0,
    startDate: null,
    finishDate: null,
    userRating: null,
    notes: ''
  },
  {
    id: 'ub-4',
    userId: 'user-2',
    bookId: 'book-4', // Harry Potter
    status: 'reading',
    currentPage: 195,
    totalReadingSeconds: 26400,
    startDate: '2026-08-25',
    finishDate: null,
    userRating: null,
    notes: ''
  }
];

export const INITIAL_READING_SESSIONS = [
  {
    id: 'rs-1',
    userId: 'user-1',
    bookId: 'book-1', // Dune
    date: '2026-09-03',
    startTime: '16:45',
    endTime: '17:20',
    durationSeconds: 2100, // 35 min
    startPage: 212,
    endPage: 248,
    pagesRead: 36,
    notes: 'Paul\'ün baharat vizyonları.'
  },
  {
    id: 'rs-2',
    userId: 'user-1',
    bookId: 'book-1', // Dune
    date: '2026-09-02',
    startTime: '21:10',
    endTime: '21:55',
    durationSeconds: 2700, // 45 min
    startPage: 175,
    endPage: 212,
    pagesRead: 37,
    notes: 'Kum solucanları ve Fremen sırları.'
  }
];

export const INITIAL_ROOMS = [
  {
    id: 'room-monthly-club',
    name: 'Aylık Kitap Kulübü: The Cholesterol Myth',
    description: 'Admin tarafından seçilen bu ayın kulüp kitabı. 1 ay boyunca okuyoruz, ay sonunda erişime açılacak ve derinlemesine tartışacağız.',
    icon: '🌟',
    adminId: 'user-1',
    members: ['user-1', 'user-2', 'user-author-yasmin'],
    isPrivate: false,
    isMonthlyClub: true,
    isLocked: true,
    countdownDays: 24,
    unlockDate: '2026-10-01',
    bookId: 'book-7',
    isPopular: true,
    rules: 'Kulüp okuması süresince oda kilitlidir; ay sonunda tüm üyelerin katılımına açılacaktır.'
  },
  {
    id: 'room-1',
    name: 'Bilim Kurgu ve Gelecek',
    description: 'Dune, Vakıf, Üç Cisim Problemi gibi eserleri derinlemesine tartıştığımız sakin okuma odası.',
    icon: '🪐',
    adminId: 'user-1',
    members: ['user-1', 'user-2', 'user-3'],
    isPrivate: false,
    rules: 'Saygı çerçevesinde tartışalım. Spoiler içeren mesajlara spoiler etiketi ekleyelim.'
  },
  {
    id: 'room-2',
    name: 'Dünya Klasikleri ve Felsefe',
    description: 'Camus, Kafka, Dostoyevski ve Tanpınar satırlarında düşünce yolculukları.',
    icon: '🏛️',
    adminId: 'user-1',
    members: ['user-1', 'user-3', 'user-4'],
    isPrivate: false,
    rules: 'Metin analizi ve düşünce paylaşımı ön plandadır.'
  },
  {
    id: 'room-3',
    name: 'Fantastik Edebiyat Kulübü',
    description: 'Orta Dünya\'dan Büyücülük Dünyası\'na uzanan fantastik okuma topluluğu.',
    icon: '🧙',
    adminId: 'user-2',
    members: ['user-2', 'user-1'],
    isPrivate: false,
    rules: 'Kitap ve evren lore tartışmaları serbesttir.'
  }
];

export const INITIAL_MESSAGES = [
  {
    id: 'msg-1',
    roomId: 'room-1',
    userId: 'user-1',
    text: 'Dune\'un ilk 200 sayfasındaki ekolojik tasvirler sizce de muazzam değil mi?',
    isSpoiler: false,
    spoilerText: '',
    timestamp: '16:30'
  },
  {
    id: 'msg-2',
    roomId: 'room-1',
    userId: 'user-2',
    text: 'Kesinlikle! Özellikle su tüccarları ve çölün kutsallığı çok etkileyici.',
    isSpoiler: false,
    spoilerText: '',
    timestamp: '16:34'
  },
  {
    id: 'msg-3',
    roomId: 'room-1',
    userId: 'user-3',
    text: '300. sayfadan sonra Paul\'ün iç monologları çok derinleşiyor.',
    isSpoiler: true,
    spoilerText: 'Paul geleceği gördüğünde kaderin kaçınılmazlığını kabulleniyor.',
    timestamp: '16:40'
  }
];

export const INITIAL_POSTS = [
  {
    id: 'post-announcement-1',
    userId: 'user-1',
    content: '📢 Topluluk Kuralları & Uyarı: Saygılı ve sakin bir okuma atmosferi için lütfen kitap değerlendirmelerinizdeki sürprizbozan kısımlara "Spoiler" etiketini ekleyiniz. Yazarlarımızın ve kulüp üyelerimizin değerlendirmelerini koruyalım.',
    bookId: null,
    isAnnouncement: true,
    pageProgress: null,
    rating: null,
    isSpoiler: false,
    spoilerText: '',
    imageUrl: null,
    timestamp: 'Sabitlendi 📌',
    likes: ['user-2', 'user-3', 'user-author-saadet', 'user-author-yasmin'],
    comments: []
  },
  {
    id: 'post-trending-1',
    userId: 'user-author-saadet',
    content: 'Celeste Anwar\'ın "The Mapmaker\'s Lament" eserini inceledim. Harita çizimlerinin insanın iç haritasıyla bu denli lirik bir paralellikte buluşması hayranlık uyandırıcı. Bu ayın en güçlü edebi deneyimi.',
    bookId: 'book-8',
    isTrending: true,
    pageProgress: { current: 384, total: 384 },
    rating: 5,
    isSpoiler: false,
    spoilerText: '',
    imageUrl: null,
    timestamp: '5 saat önce',
    likes: ['user-1', 'user-2', 'user-3', 'user-4', 'user-author-yasmin', 'user-author-frank'],
    comments: [
      {
        id: 'c-tr-1',
        userId: 'user-author-yasmin',
        text: 'Kesinlikle katılıyorum, üslubu ve atmosferi çok etkileyici.',
        timestamp: '3 saat önce'
      }
    ]
  },
  {
    id: 'post-1',
    userId: 'user-1',
    content: '“İnsan, zihninin kapılarını bir kez kitaba açtı mı, bir daha asla eski sınırlarına geri dönemez.” Dune okuması her sayfada felsefi derinliğini hissettiriyor.',
    bookId: 'book-1',
    pageProgress: { current: 248, total: 712 },
    rating: 5,
    isSpoiler: false,
    spoilerText: '',
    imageUrl: null,
    timestamp: '1 saat önce',
    likes: ['user-2', 'user-3'],
    comments: [
      {
        id: 'c-1',
        userId: 'user-2',
        text: 'Frank Herbert dili gerçekten çok sakin ama güçlü kullanıyor.',
        timestamp: '45 dk önce'
      }
    ]
  },
  {
    id: 'post-2',
    userId: 'user-2',
    content: 'Harry Potter serisini yeniden okumak çocukluğumun sakin pazar günlerine dönmek gibi. Sayfaları çevirdikçe huzur buluyorum.',
    bookId: 'book-4',
    pageProgress: { current: 195, total: 276 },
    rating: 5,
    isSpoiler: false,
    spoilerText: '',
    imageUrl: null,
    timestamp: '3 saat önce',
    likes: ['user-1'],
    comments: []
  },
  {
    id: 'post-3',
    userId: 'user-3',
    content: 'Camus\'nün Yabancı romanında Meursault karakteri modern insanın kayıtsızlığını çok çıplak yansıtıyor. Kısa ama çok katmanlı bir eser.',
    bookId: 'book-5',
    pageProgress: { current: 110, total: 110 },
    rating: 4,
    isSpoiler: false,
    spoilerText: '',
    imageUrl: null,
    timestamp: 'Dün',
    likes: ['user-1', 'user-4'],
    comments: []
  }
];

export const INITIAL_REVIEWS = [
  {
    id: 'rev-author-yasmin',
    bookId: 'book-7',
    userId: 'user-author-yasmin',
    rating: 5,
    content: 'Bu eseri kaleme alırken yerleşik sağlık tabularını bilimsel veriler ışığında sorgulamayı hedefledim. Kulüp üyelerimizin geri dönüşleri ve tartışmaları son derece kıymetli.',
    date: '2026-09-01'
  },
  {
    id: 'rev-author-frank',
    bookId: 'book-1',
    userId: 'user-author-frank',
    rating: 5,
    content: 'Arrakis çöllerinde sadece kumları değil, insan iradesinin sınırlarını arayan tüm okurlara selam olsun. Analizleriniz harika.',
    date: '2026-08-30'
  },
  {
    id: 'rev-spoiler-1',
    bookId: 'book-2',
    userId: 'user-3',
    rating: 5,
    isSpoiler: true,
    content: 'Romanın sonundaki 101 Numaralı Oda sorgusu ve Winston\'ın Julia\'ya ihanet ederek sisteme teslim oluşu beni derinden sarstı. Büyük Birader\'i sevmeye başlaması en trajik andı.',
    date: '2026-09-02'
  },
  {
    id: 'rev-1',
    bookId: 'book-1',
    userId: 'user-1',
    rating: 5,
    content: 'Herbert sadece bir roman değil, dilbilimsel ve ekolojik bir evren inşa etmiş. Mutlaka okunmalı.',
    date: '2026-08-25'
  },
  {
    id: 'rev-2',
    bookId: 'book-2',
    userId: 'user-1',
    rating: 5,
    content: 'Hakikatin gücünü ve manipülasyonun dehşetini anlatan eşsiz bir klasik.',
    date: '2026-08-14'
  }
];

export const INITIAL_NOTIFICATIONS = [
  {
    id: 'notif-monthly-club',
    userId: 'user-1',
    actorId: 'user-1',
    type: 'monthly_book_club',
    bookId: 'book-7',
    text: 'Yönetici Eylül ayı kulüp kitabını belirledi: "The Cholesterol Myth" (Yasmin Awad). Tartışma odası 1 ay sonra açılacaktır. Hemen istek sepetinize ekleyin!',
    time: 'Yeni',
    read: false
  },
  {
    id: 'notif-1',
    userId: 'user-1',
    actorId: 'user-2',
    type: 'friend_accept',
    text: 'Zeynep Demir arkadaşlık isteğinizi kabul etti.',
    time: '15 dk önce',
    read: false
  },
  {
    id: 'notif-2',
    userId: 'user-1',
    actorId: 'user-3',
    type: 'like',
    text: 'Can Kaya "Dune" hakkındaki düşüncenizi beğendi.',
    time: '1 saat önce',
    read: false
  }
];

export const INITIAL_ADMIN_LOGS = [
  {
    id: 'alog-1',
    actorId: 'user-1',
    actorRole: 'founder',
    action: 'promote_to_admin',
    targetUserId: 'user-2',
    details: 'Zeynep Demir hesabı admin olarak yetkilendirildi.',
    timestamp: '2026-08-01 10:30'
  }
];

