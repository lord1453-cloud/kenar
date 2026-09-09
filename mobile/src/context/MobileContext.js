import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { mobileApi, setStoredUserId } from '../api/client';

const MobileContext = createContext();

const INITIAL_LOCAL_USERS = [
  {
    id: 'user-1',
    username: 'kurucu',
    fullName: 'Kitap Kulübü Kurucusu',
    email: 'kurucu@kitapkulubu.com',
    role: 'founder',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&h=200&q=80',
    bio: 'Kitap Kulübü Kurucusu & Topluluk Yöneticisi. Derin okumalar ve edebiyat sohbetleri.',
    readingGoal: 36,
    streak: 14,
    totalReadingSeconds: 174960,
    todayReadingSeconds: 1560,
    isStarUser: true,
    roomCredit: 5
  },
  {
    id: 'user-2',
    username: 'zeynepd',
    fullName: 'Zeynep Demir',
    email: 'zeynep@kitapkulubu.com',
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&h=200&q=80',
    bio: 'Fantastik edebiyat ve polisiye tutkunu.',
    readingGoal: 40,
    streak: 21,
    totalReadingSeconds: 224400,
    todayReadingSeconds: 2400,
    isStarUser: true,
    roomCredit: 2
  },
  {
    id: 'user-3',
    username: 'cankaya',
    fullName: 'Can Kaya',
    email: 'can@kitapkulubu.com',
    role: 'user',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&h=200&q=80',
    bio: 'Felsefe ve tarih meraklısı.',
    readingGoal: 24,
    streak: 7,
    totalReadingSeconds: 86400,
    todayReadingSeconds: 1200,
    isStarUser: false,
    roomCredit: 0
  }
];

const INITIAL_LOCAL_BOOKS = [
  {
    id: 'book-1',
    title: 'Dune',
    author: 'Frank Herbert',
    pages: 712,
    coverUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=300&h=450&q=80',
    genre: 'Bilim Kurgu'
  },
  {
    id: 'book-2',
    title: '1984',
    author: 'George Orwell',
    pages: 352,
    coverUrl: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=300&h=450&q=80',
    genre: 'Distopya'
  },
  {
    id: 'book-3',
    title: 'Körlük',
    author: 'José Saramago',
    pages: 320,
    coverUrl: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=300&h=450&q=80',
    genre: 'Çağdaş Roman'
  },
  {
    id: 'book-4',
    title: 'Yüzüklerin Efendisi',
    author: 'J.R.R. Tolkien',
    pages: 1024,
    coverUrl: 'https://images.unsplash.com/photo-1476275466078-4007374efbbe?auto=format&fit=crop&w=300&h=450&q=80',
    genre: 'Fantastik'
  },
  {
    id: 'book-5',
    title: 'Kayıp Zamanın İzinde',
    author: 'Elif Demir',
    pages: 480,
    coverUrl: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=300&h=450&q=80',
    genre: 'Klasik'
  },
  {
    id: 'book-6',
    title: 'Beyaz Gece',
    author: 'Fyodor Dostoyevski',
    pages: 112,
    coverUrl: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&w=300&h=450&q=80',
    genre: 'Dünya Klasikleri'
  },
  {
    id: 'book-7',
    title: 'Sessiz Ev',
    author: 'Orhan Pamuk',
    pages: 356,
    coverUrl: 'https://images.unsplash.com/photo-1532012164546-f432f2e3777f?auto=format&fit=crop&w=300&h=450&q=80',
    genre: 'Türk Edebiyatı'
  }
];

export const MobileProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(INITIAL_LOCAL_USERS[0]);
  const [users, setUsers] = useState(INITIAL_LOCAL_USERS);
  const [activeTab, setActiveTab] = useState('home'); // 'home' | 'thoughts' | 'live' | 'library' | 'profile'
  
  // Modallar
  const [isCreateThoughtOpen, setIsCreateThoughtOpen] = useState(false);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isRoomsOpen, setIsRoomsOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isProgressOpen, setIsProgressOpen] = useState(false);
  const [selectedBookForProgress, setSelectedBookForProgress] = useState(null);

  // Akış Gönderileri (Üstteki Düşünce Paylaş Modalı ve HomeScreen ortak verisi)
  const [posts, setPosts] = useState([
    {
      id: 'post-pinned',
      isPinned: true,
      userName: 'Ayşe Yılmaz',
      userRole: 'founder',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&h=200&q=80',
      timeAgo: 'Dün',
      title: 'Topluluk Kuralları ve Canlı Okuma Saatleri',
      content: 'Kulübümüzde her akşam 21:00-22:00 arası Canlı Okuma Odasında sessiz odaklanma seansı düzenlenmektedir. Alıntı ve kenar notu paylaşırken lütfen sürprizbozan (spoiler) etiketini kullanınız.',
      bookTitle: 'Kenar Okur Rehberi',
      bookAuthor: 'Kitap Kulübü',
      bookCover: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=300&h=450&q=80',
      likes: 42,
      isLiked: false,
      comments: 7
    },
    {
      id: 'post-1',
      userName: currentUser?.fullName || 'Kitap Kulübü Kurucusu',
      userRole: currentUser?.role || 'founder',
      avatar: currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&h=200&q=80',
      timeAgo: '15 dk önce',
      content: 'Korku akıl katilidir. Korku, mutlak yok oluşu getiren küçük ölümdür. Herbert\'ın bu cümlesi her okumada daha da derinleşiyor.',
      bookTitle: 'Dune',
      bookAuthor: 'Frank Herbert',
      bookCover: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=300&h=450&q=80',
      page: 342,
      likes: 12,
      isLiked: false,
      comments: 3
    },
    {
      id: 'post-2',
      userName: 'Zeynep Demir',
      userRole: 'admin',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&h=200&q=80',
      timeAgo: '1 saat önce',
      content: 'Bilinçleninceye kadar asla başkaldıramayacaklar, başkaldırmadıkça da bilinçlenemezler.',
      bookTitle: '1984',
      bookAuthor: 'George Orwell',
      bookCover: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=300&h=450&q=80',
      page: 120,
      likes: 238,
      isLiked: false,
      comments: 18
    },
    {
      id: 'post-3',
      userName: 'Can Kaya',
      userRole: 'user',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&h=200&q=80',
      timeAgo: '3 saat önce',
      content: 'Noktalama işaretlerinin olmaması ilk 30 sayfada zorluyor ama sonra akış müthiş bir ritim kazanıyor. José Saramago\'nun dili insanı adeta büyülüyor.',
      bookTitle: 'Körlük',
      bookAuthor: 'José Saramago',
      bookCover: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=300&h=450&q=80',
      page: 85,
      likes: 512,
      isLiked: false,
      comments: 42,
      isSpoiler: true
    }
  ]);

  const addPost = ({ content, bookTitle, bookAuthor, bookCover, page, isSpoiler }) => {
    if (!content || !content.trim()) return;
    const newPost = {
      id: `p-${Date.now()}`,
      userName: currentUser?.fullName || 'Kitap Kulübü Okuru',
      userRole: currentUser?.role || 'user',
      avatar: currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&h=200&q=80',
      bookTitle: bookTitle || 'Okuma Notu',
      bookAuthor: bookAuthor || '',
      bookCover: bookCover || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=300&h=450&q=80',
      content: content.trim(),
      likes: 0,
      isLiked: false,
      comments: 0,
      page: page ? parseInt(page, 10) : null,
      isSpoiler: !!isSpoiler,
      timeAgo: 'Az önce'
    };
    setPosts(prev => [newPost, ...prev]);
    showToast('Kenar notunuz akışta paylaşıldı!');
  };

  // Beta Durumu & Yetkilendirme (Varsayılan olarak açık başlar, kullanıcıyı kilitlemez)
  const [betaAuthorized, setBetaAuthorized] = useState(true);
  const [isBetaUnlocked, setIsBetaUnlocked] = useState(true);
  const [betaInfo, setBetaInfo] = useState({
    version: '0.1.0-beta',
    buildNumber: 1,
    environment: 'beta',
    platform: mobileApi.getPlatform()
  });

  // Oturum ve Kullanıcı Kalıcılığı (Kullanıcı tekrar tekrar giriş yapmak zorunda kalmaz)
  useEffect(() => {
    const loadSession = async () => {
      try {
        const saved = await AsyncStorage.getItem('kk_mobile_user');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed && parsed.id) {
            setCurrentUser(parsed);
            setStoredUserId(parsed.id);
          }
        }
      } catch {
        // Oturum hatası durumunda varsayılan yerel kullanıcıyla devam edilir
      }
    };
    loadSession();
  }, []);

  useEffect(() => {
    if (currentUser) {
      AsyncStorage.setItem('kk_mobile_user', JSON.stringify(currentUser)).catch(() => {});
      setStoredUserId(currentUser.id);
    }
  }, [currentUser]);

  // Kitaplık Verisi
  const [userBooks, setUserBooks] = useState([
    {
      id: 'ub-1',
      userId: 'user-1',
      bookId: 'book-1',
      status: 'reading',
      currentPage: 342,
      totalPages: 712
    },
    {
      id: 'ub-2',
      userId: 'user-1',
      bookId: 'book-2',
      status: 'read',
      currentPage: 352,
      totalPages: 352
    },
    {
      id: 'ub-3',
      userId: 'user-1',
      bookId: 'book-3',
      status: 'want_to_read',
      currentPage: 0,
      totalPages: 320
    }
  ]);

  // Canlı Okuma Kronometresi (Stopwatch Engine)
  const [timerRunning, setTimerRunning] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [activeTimerBook, setActiveTimerBook] = useState(INITIAL_LOCAL_BOOKS[0]);
  const [timerStartPage, setTimerStartPage] = useState(342);

  // Timer Tick
  useEffect(() => {
    let interval = null;
    if (timerRunning) {
      interval = setInterval(() => {
        setTimerSeconds(s => s + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timerRunning]);

  // Toast Bildirim Durumu
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (message) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 2500);
  };

  // Sayfa İlerlemesi Güncelleme (Backend Senkron)
  const updateBookProgress = (bookId, newPage) => {
    const pageNum = parseInt(newPage, 10) || 0;
    setUserBooks(prev => prev.map(ub => {
      if (ub.bookId === bookId && ub.userId === currentUser?.id) {
        const isFinished = pageNum >= ub.totalPages;
        const updated = {
          ...ub,
          currentPage: Math.min(pageNum, ub.totalPages),
          status: isFinished ? 'read' : 'reading'
        };
        // Backend'e yaz
        mobileApi.updateProgress(ub.id, updated.currentPage, updated.status);
        return updated;
      }
      return ub;
    }));
    showToast(`Okuma ilerlemesi kaydedildi: Sayfa ${pageNum}`);
  };

  // Seansı Bitir
  const finishReadingSession = (endPageInput) => {
    const finalPage = parseInt(endPageInput, 10) || timerStartPage;
    const duration = timerSeconds;

    setTimerRunning(false);
    setTimerSeconds(0);

    // Kullanıcı okuma süresi güncelle
    setCurrentUser(prev => ({
      ...prev,
      totalReadingSeconds: prev.totalReadingSeconds + duration,
      todayReadingSeconds: prev.todayReadingSeconds + duration
    }));

    updateBookProgress(activeTimerBook.id, finalPage);

    // Backend'e seans yaz
    mobileApi.saveSession({
      bookId: activeTimerBook.id,
      durationSeconds: duration,
      startPage: timerStartPage,
      endPage: finalPage,
      notes: 'Mobil okuma seansı'
    });

    showToast(`Tebrikler! ${Math.floor(duration / 60)} dakika okuma kaydedildi.`);
  };

  // Profil Güncelleme ve Kalıcı Kayıt
  const updateProfile = (profileData) => {
    setCurrentUser(prev => {
      const updated = { ...prev, ...profileData };
      setUsers(allUsers => allUsers.map(u => u.id === updated.id ? updated : u));
      AsyncStorage.setItem('kk_mobile_user', JSON.stringify(updated)).catch(() => {});
      return updated;
    });
    showToast('Profiliniz başarıyla kaydedildi.');
  };

  // Oturumu Kapat (Tek Hesap Modeli)
  const logout = () => {
    setCurrentUser(null);
    setStoredUserId(null);
    setBetaAuthorized(false);
    setIsBetaUnlocked(false);
    AsyncStorage.removeItem('kk_mobile_user').catch(() => {});
    showToast('Oturum kapatıldı.');
  };

  return (
    <MobileContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        updateProfile,
        users,
        logout,
        activeTab,
        setActiveTab,
        books: INITIAL_LOCAL_BOOKS,
        userBooks,
        updateBookProgress,
        // Akış Gönderileri & Düşünce Paylaş
        posts,
        setPosts,
        addPost,
        isCreateThoughtOpen,
        setIsCreateThoughtOpen,
        // Modallar
        isFeedbackOpen,
        setIsFeedbackOpen,
        isAdminOpen,
        setIsAdminOpen,
        isRoomsOpen,
        setIsRoomsOpen,
        isLoginOpen,
        setIsLoginOpen,
        isProgressOpen,
        setIsProgressOpen,
        selectedBookForProgress,
        setSelectedBookForProgress,
        // Kronometre
        timerRunning,
        setTimerRunning,
        timerSeconds,
        activeTimerBook,
        setActiveTimerBook,
        timerStartPage,
        setTimerStartPage,
        finishReadingSession,
        // Beta & Toast
        betaAuthorized,
        setBetaAuthorized,
        isBetaUnlocked,
        setIsBetaUnlocked,
        betaInfo,
        toastMessage,
        showToast
      }}
    >
      {children}
    </MobileContext.Provider>
  );
};

export const useMobile = () => {
  const context = useContext(MobileContext);
  if (!context) {
    throw new Error('useMobile must be used within MobileProvider');
  }
  return context;
};
