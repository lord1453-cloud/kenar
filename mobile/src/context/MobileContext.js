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
  }
];

export const MobileProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(INITIAL_LOCAL_USERS[0]);
  const [users, setUsers] = useState(INITIAL_LOCAL_USERS);
  const [activeTab, setActiveTab] = useState('home'); // 'home' | 'thoughts' | 'live' | 'library' | 'profile'
  
  // Modallar
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isRoomsOpen, setIsRoomsOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isProgressOpen, setIsProgressOpen] = useState(false);
  const [selectedBookForProgress, setSelectedBookForProgress] = useState(null);

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
      if (ub.bookId === bookId && ub.userId === currentUser.id) {
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
