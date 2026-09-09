import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';
import { 
  INITIAL_USERS, 
  INITIAL_BOOKS, 
  INITIAL_USER_BOOKS, 
  INITIAL_USER_FOLDERS,
  INITIAL_ROOMS, 
  INITIAL_MESSAGES, 
  INITIAL_POSTS, 
  INITIAL_REVIEWS, 
  INITIAL_NOTIFICATIONS,
  INITIAL_READING_SESSIONS,
  INITIAL_FRIEND_REQUESTS,
  INITIAL_MONTHLY_USER_STATS,
  INITIAL_MODERATION_LOGS,
  INITIAL_ADMIN_LOGS
} from '../data/initialData';
import { BOOKS_CATALOG_100 } from '../data/booksCatalog100';
import { getRealBookCover } from '../data/bookCoversMap';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // Theme state: 'light' | 'dark'
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('kk_theme');
    if (!saved || saved === 'main' || saved === 'main_dark') return 'light';
    return saved;
  });

  const [customAccent, setCustomAccent] = useState(() => {
    return localStorage.getItem('kk_custom_accent') || '#F6D883';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('kk_theme', theme);
    document.documentElement.style.setProperty('--custom-accent', customAccent);
    document.documentElement.style.setProperty('--custom-accent-hover', customAccent);
  }, [theme, customAccent]);

  const setAppTheme = (themeName) => {
    setTheme(themeName);
    localStorage.setItem('kk_theme', themeName);
    // Also sync to currentUser profile
    setUsers(prev => prev.map(u => u.id === currentUserId ? { ...u, profileTheme: themeName } : u));
    showToast(`Tema uygulandı: ${themeName}`, '🎨');
  };

  const updateCustomAccent = (hexColor) => {
    setCustomAccent(hexColor);
    localStorage.setItem('kk_custom_accent', hexColor);
    setTheme('custom');
    localStorage.setItem('kk_theme', 'custom');
    showToast('Özel tema rengi güncellendi', '🎨');
  };

  // State initialization with localStorage fallback & sync
  const [users, setUsers] = useState(() => {
    const saved = localStorage.getItem('kk_users');
    let list = saved ? JSON.parse(saved) : INITIAL_USERS;
    
    // Ensure all INITIAL_USERS (especially authors and founder) exist
    INITIAL_USERS.forEach(initU => {
      const idx = list.findIndex(u => u.id === initU.id);
      if (idx === -1) {
        list.push(initU);
      } else {
        // preserve role, isStarUser and avatar
        list[idx] = { ...initU, ...list[idx], role: initU.role, isStarUser: initU.isStarUser };
      }
    });

    list = list.map(u => {
      if (u.id === 'user-1') {
        return {
          ...u,
          username: 'ayseyilmaz',
          firstName: 'Ayşe',
          lastName: 'Yılmaz',
          fullName: 'Ayşe Yılmaz',
          email: 'kurucu@kitapkulubu.com',
          role: 'founder',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&h=300&q=80'
        };
      }
      return u;
    });
    return list;
  });

  const [currentUserId, setCurrentUserId] = useState(() => {
    return localStorage.getItem('kk_current_user_id') || 'user-1';
  });

  // Kullanıcı ve oturum bilgilerini kalıcı olarak sakla (Sayfa yenilendiğinde asla kaybolmaz)
  useEffect(() => {
    if (users && users.length > 0) {
      localStorage.setItem('kk_users', JSON.stringify(users));
    }
  }, [users]);

  useEffect(() => {
    if (currentUserId) {
      localStorage.setItem('kk_current_user_id', currentUserId);
    }
  }, [currentUserId]);

  const [books, setBooks] = useState(() => {
    const saved = localStorage.getItem('kk_books');
    let list = saved ? JSON.parse(saved) : INITIAL_BOOKS;
    INITIAL_BOOKS.forEach(ib => {
      if (!list.some(b => b.id === ib.id)) {
        list.push(ib);
      }
    });
    // 100+ Kitaplık Luku Zengin Kataloğunu Otomatik Yükle
    BOOKS_CATALOG_100.forEach(cb => {
      if (!list.some(b => b.id === cb.id)) {
        list.push(cb);
      }
    });
    // Kitap kapaklarını 1:1 orijinal gerçek kapaklarla senkronize et
    list = list.map(b => {
      const realCover = getRealBookCover(b.title);
      if (realCover) {
        return { ...b, cover: realCover };
      }
      return b;
    });
    return list;
  });

  useEffect(() => {
    localStorage.setItem('kk_books', JSON.stringify(books));
  }, [books]);

  const [userBooks, setUserBooks] = useState(() => {
    const saved = localStorage.getItem('kk_user_books');
    return saved ? JSON.parse(saved) : INITIAL_USER_BOOKS;
  });

  // Kullanıcı Özel Kitap Klasörleri (Maksimum 12 Adet)
  const [userFolders, setUserFolders] = useState(() => {
    const saved = localStorage.getItem('luku_user_folders');
    let list = saved ? JSON.parse(saved) : INITIAL_USER_FOLDERS;
    INITIAL_USER_FOLDERS.forEach(iuf => {
      if (!list.some(f => f.id === iuf.id)) {
        list.push(iuf);
      }
    });
    return list;
  });

  useEffect(() => {
    localStorage.setItem('luku_user_folders', JSON.stringify(userFolders));
  }, [userFolders]);

  const [readingSessions, setReadingSessions] = useState(() => {
    const saved = localStorage.getItem('kk_reading_sessions');
    return saved ? JSON.parse(saved) : INITIAL_READING_SESSIONS;
  });

  const [rooms, setRooms] = useState(() => {
    const saved = localStorage.getItem('kk_rooms');
    let list = saved ? JSON.parse(saved) : INITIAL_ROOMS;
    INITIAL_ROOMS.forEach(ir => {
      if (!list.some(r => r.id === ir.id)) {
        list.unshift(ir);
      }
    });
    return list;
  });

  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem('kk_messages');
    return saved ? JSON.parse(saved) : INITIAL_MESSAGES;
  });

  const [posts, setPosts] = useState(() => {
    const saved = localStorage.getItem('kk_posts');
    let list = saved ? JSON.parse(saved) : INITIAL_POSTS;
    INITIAL_POSTS.forEach(ip => {
      if (!list.some(p => p.id === ip.id)) {
        list.unshift(ip);
      }
    });
    return list;
  });

  const [reviews, setReviews] = useState(() => {
    const saved = localStorage.getItem('kk_reviews');
    let list = saved ? JSON.parse(saved) : INITIAL_REVIEWS;
    INITIAL_REVIEWS.forEach(ir => {
      if (!list.some(r => r.id === ir.id)) {
        list.unshift(ir);
      }
    });
    return list;
  });

  const [notifications, setNotifications] = useState(() => {
    const saved = localStorage.getItem('kk_notifications');
    let list = saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
    INITIAL_NOTIFICATIONS.forEach(in_ => {
      if (!list.some(n => n.id === in_.id)) {
        list.unshift(in_);
      }
    });
    return list;
  });

  const [friendRequests, setFriendRequests] = useState(() => {
    const saved = localStorage.getItem('kk_friend_requests');
    return saved ? JSON.parse(saved) : INITIAL_FRIEND_REQUESTS;
  });

  const [monthlyUserStats, setMonthlyUserStats] = useState(() => {
    const saved = localStorage.getItem('kk_monthly_user_stats');
    return saved ? JSON.parse(saved) : INITIAL_MONTHLY_USER_STATS;
  });

  const [moderationLogs, setModerationLogs] = useState(() => {
    const saved = localStorage.getItem('kk_moderation_logs');
    return saved ? JSON.parse(saved) : INITIAL_MODERATION_LOGS;
  });

  // Reading Goal Calendar Logs (Doküman Paragraf 25)
  const [readingCalendarLogs, setReadingCalendarLogs] = useState(() => {
    const saved = localStorage.getItem('kk_calendar_logs');
    return saved ? JSON.parse(saved) : [
      { date: '2026-09-01', bookId: 'book-1', pagesRead: 35, note: 'Giriş ve gezegen tasvirleri' },
      { date: '2026-09-02', bookId: 'book-1', pagesRead: 40, note: 'Fremen kültürü' },
      { date: '2026-09-03', bookId: 'book-4', pagesRead: 25, note: 'Hogwarts mektupları' },
      { date: '2026-09-04', bookId: 'book-7', pagesRead: 30, note: 'Bölüm 1 ve 2' },
      { date: '2026-09-05', bookId: 'book-1', pagesRead: 36, note: 'Kum solucanları ve felsefe' }
    ];
  });

  // Navigation and active UI tabs
  // 'feed' | 'thoughts' | 'live_reading' | 'friends' | 'library' | 'rooms' | 'profile' | 'settings' | 'admin' | 'room_detail' | 'folder_detail' | 'book_detail'
  const [activeTab, setActiveTab] = useState('feed');
  const [viewingUserId, setViewingUserId] = useState(null);

  // Prototype Screen States
  const [activeRoomData, setActiveRoomData] = useState({
    title: 'Kayıp Zamanın İzinde',
    author: 'Elif Demir',
    cover: 'linear-gradient(155deg,#8B4A34,#5b3527)',
    members: '412 üye · Eylül seçkisi'
  });

  const [activeFolderName, setActiveFolderName] = useState('Dünya Klasikleri');

  const [activeBookData, setActiveBookData] = useState({
    id: 'book-1',
    title: 'Kayıp Zamanın İzinde',
    author: 'Elif Demir',
    genre: 'Roman · Edebiyat',
    rating: 4.4,
    reviewsCount: '1.284',
    cover: 'linear-gradient(155deg,#8B4A34,#5b3527)',
    summary: 'Hafızanın kırılganlığını ve zamanın akışkanlığını konu alan bu roman, bir ailenin üç kuşak boyunca taşıdığı sessiz sırları yavaş, sabırlı bir anlatımla ele alıyor.'
  });

  const openRoom = (room) => {
    if (typeof room === 'string') {
      setActiveRoomData(prev => ({ ...prev, title: room }));
    } else if (room && typeof room === 'object') {
      setActiveRoomData(prev => ({ ...prev, ...room }));
    }
    setActiveTab('room_detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // --- ODA PROFİLİ ÖZELLEŞTİRME SİSTEMİ ---
  const [isCustomizeRoomOpen, setIsCustomizeRoomOpen] = useState(false);
  const [customizingRoom, setCustomizingRoom] = useState(null);

  const openCustomizeRoom = (room) => {
    setCustomizingRoom(room || activeRoomData);
    setIsCustomizeRoomOpen(true);
  };

  const closeCustomizeRoom = () => {
    setIsCustomizeRoomOpen(false);
    setCustomizingRoom(null);
  };

  const updateRoomProfile = (roomIdOrTitle, updatedData) => {
    setActiveRoomData(prev => {
      const match = !roomIdOrTitle || prev.id === roomIdOrTitle || prev.title === roomIdOrTitle || prev.name === roomIdOrTitle;
      if (match) {
        const next = { ...prev, ...updatedData };
        localStorage.setItem('kk_active_room', JSON.stringify(next));
        return next;
      }
      return prev;
    });

    setRooms(prev => {
      const exists = prev.some(r => r.id === roomIdOrTitle || r.name === roomIdOrTitle || r.title === roomIdOrTitle);
      if (exists) {
        return prev.map(r => {
          if (r.id === roomIdOrTitle || r.name === roomIdOrTitle || r.title === roomIdOrTitle) {
            return { ...r, ...updatedData };
          }
          return r;
        });
      } else {
        const newRoom = {
          id: `room-${Date.now()}`,
          name: updatedData.title || updatedData.name || 'Yeni Kitap Odası',
          title: updatedData.title || updatedData.name || 'Yeni Kitap Odası',
          author: updatedData.author || 'Edebi Topluluk',
          description: updatedData.description || 'Kitap değerlendirme ve sakin okuma odası.',
          icon: updatedData.icon || '📖',
          cover: updatedData.cover || 'linear-gradient(135deg,#8B4A34,#5b3527)',
          coverImage: updatedData.coverImage || updatedData.cover,
          members: [currentUserId || 'user-1'],
          isPrivate: false,
          rules: updatedData.rules || 'Otomatik filtre aktif.',
          ...updatedData
        };
        return [newRoom, ...prev];
      }
    });

    setIsCustomizeRoomOpen(false);
    setCustomizingRoom(null);
    showToast(`"${updatedData.title || updatedData.name || 'Oda'}" profili güncellendi!`, '🎨');
  };

  const openFolder = (folderName) => {
    setActiveFolderName(folderName || 'Bu Yılın En Çok Okunanları');
    setActiveTab('folder_detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openBook = (book) => {
    if (typeof book === 'string') {
      setActiveBookData(prev => ({ ...prev, title: book }));
    } else if (book && typeof book === 'object') {
      setActiveBookData(prev => ({ ...prev, ...book }));
    }
    setActiveTab('book_detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Modals
  const [selectedBookId, setSelectedBookId] = useState(null);
  const [selectedRoomId, setSelectedRoomId] = useState(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);
  const [isCreateRoomOpen, setIsCreateRoomOpen] = useState(false);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isFoldersModalOpen, setIsFoldersModalOpen] = useState(false);
  const [updatingProgressBook, setUpdatingProgressBook] = useState(null);
  const [toasts, setToasts] = useState([]);

  // --- KULLANICI PROFİLİ KİTAP KLASÖRLERİ YÖNETİMİ (MAKSİMUM 12 ADET) ---
  const getUserFolders = (userId = currentUserId) => {
    return userFolders.filter(f => f.userId === userId);
  };

  const createUserFolder = ({ name, color }) => {
    const existing = userFolders.filter(f => f.userId === currentUserId);
    if (existing.length >= 12) {
      showToast('En fazla 12 adet özel klasör oluşturabilirsiniz!', '⚠️');
      return { success: false, error: 'Maksimum 12 klasör sınırına ulaşıldı.' };
    }
    const newFolder = {
      id: `uf-${Date.now()}`,
      userId: currentUserId,
      name: (name || 'Yeni Klasör').trim(),
      color: color || '#007AFF',
      bookIds: [],
      createdAt: new Date().toISOString().split('T')[0]
    };
    setUserFolders(prev => [...prev, newFolder]);
    showToast(`"${newFolder.name}" klasörü oluşturuldu!`, '📁');
    return { success: true, folder: newFolder };
  };

  const updateUserFolder = (folderId, { name, color }) => {
    setUserFolders(prev => prev.map(f => {
      if (f.id === folderId) {
        return {
          ...f,
          name: name !== undefined ? name.trim() : f.name,
          color: color || f.color
        };
      }
      return f;
    }));
    showToast('Klasör güncellendi.', '✓');
    return { success: true };
  };

  const deleteUserFolder = (folderId) => {
    setUserFolders(prev => prev.filter(f => f.id !== folderId));
    showToast('Klasör silindi.', '🗑️');
    return { success: true };
  };

  const addBookToUserFolder = (folderId, bookId) => {
    setUserFolders(prev => prev.map(f => {
      if (f.id === folderId) {
        if (f.bookIds.includes(bookId)) return f;
        return { ...f, bookIds: [...f.bookIds, bookId] };
      }
      return f;
    }));
    showToast('Kitap klasöre eklendi!', '📖');
  };

  const removeBookFromUserFolder = (folderId, bookId) => {
    setUserFolders(prev => prev.map(f => {
      if (f.id === folderId) {
        return { ...f, bookIds: f.bookIds.filter(id => id !== bookId) };
      }
      return f;
    }));
    showToast('Kitap klasörden çıkarıldı.', '🗑️');
  };

  // --- ÖZEL BETA TEST SİSTEMİ STATE'LERİ ---
  const [isBetaFeedbackOpen, setIsBetaFeedbackOpen] = useState(false);
  const [isFounderSettingsOpen, setIsFounderSettingsOpen] = useState(false);
  const [betaFeedbacks, setBetaFeedbacks] = useState([]);
  const [betaTestersData, setBetaTestersData] = useState(null);
  const [betaStatus, setBetaStatus] = useState({
    environment: 'beta',
    appVersion: '0.1.0-beta',
    buildNumber: 1,
    restrictedMode: true,
    detectedPlatform: 'web'
  });
  const [isBetaUnlocked, setIsBetaUnlocked] = useState(() => {
    const saved = localStorage.getItem('kk_beta_unlocked');
    if (saved === 'false') return false;
    // Varsayılan olarak açık: kullanıcılar sayfayı yenilediklerinde veya girdiklerinde hesap açmaya zorlanmaz
    return true;
  });

  useEffect(() => {
    localStorage.setItem('kk_beta_unlocked', isBetaUnlocked ? 'true' : 'false');
  }, [isBetaUnlocked]);

  // Beta Durumunu Sunucudan Çek
  useEffect(() => {
    api.getBetaStatus().then(status => {
      if (status) setBetaStatus(status);
    });
  }, []);

  // --- OKUMA KRONOMETRESİ MOTORU (Reading Stopwatch Engine) ---
  const [timerEngine, setTimerEngine] = useState(() => {
    const saved = localStorage.getItem('kk_timer_engine');
    if (saved) {
      try {
        const p = JSON.parse(saved);
        if (p.isRunning && p.sessionStartTime) {
          const now = Date.now();
          const paused = p.pausedDuration || 0;
          const actualElapsed = Math.max(0, Math.floor((now - p.sessionStartTime - paused) / 1000));
          return {
            ...p,
            seconds: actualElapsed,
            lastTick: now
          };
        }
        return p;
      } catch (e) {
        console.error(e);
      }
    }
    return {
      bookId: null,
      isRunning: false,
      seconds: 0,
      startPage: 0,
      sessionStartTime: null,
      pausedDuration: 0,
      lastPausedAt: null,
      lastTick: null
    };
  });

  const [isTimerModalOpen, setIsTimerModalOpen] = useState(false);
  const [completedSession, setCompletedSession] = useState(null);

  // Timer Tick Interval with Precision
  useEffect(() => {
    let interval = null;
    if (timerEngine.isRunning && timerEngine.sessionStartTime) {
      interval = setInterval(() => {
        const now = Date.now();
        const paused = timerEngine.pausedDuration || 0;
        const actualElapsed = Math.max(0, Math.floor((now - timerEngine.sessionStartTime - paused) / 1000));

        setTimerEngine(prev => {
          const updated = {
            ...prev,
            seconds: actualElapsed,
            lastTick: now
          };
          localStorage.setItem('kk_timer_engine', JSON.stringify(updated));
          return updated;
        });
      }, 1000);
    } else {
      localStorage.setItem('kk_timer_engine', JSON.stringify(timerEngine));
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timerEngine.isRunning, timerEngine.sessionStartTime, timerEngine.pausedDuration]);

  // Sync state to LocalStorage
  useEffect(() => {
    localStorage.setItem('kk_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    if (currentUserId) {
      localStorage.setItem('kk_current_user_id', currentUserId);
    } else {
      localStorage.removeItem('kk_current_user_id');
    }
  }, [currentUserId]);

  useEffect(() => {
    localStorage.setItem('kk_books', JSON.stringify(books));
  }, [books]);

  useEffect(() => {
    localStorage.setItem('kk_user_books', JSON.stringify(userBooks));
  }, [userBooks]);

  useEffect(() => {
    localStorage.setItem('kk_reading_sessions', JSON.stringify(readingSessions));
  }, [readingSessions]);

  useEffect(() => {
    localStorage.setItem('kk_rooms', JSON.stringify(rooms));
  }, [rooms]);

  useEffect(() => {
    localStorage.setItem('kk_messages', JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    localStorage.setItem('kk_posts', JSON.stringify(posts));
  }, [posts]);

  useEffect(() => {
    localStorage.setItem('kk_reviews', JSON.stringify(reviews));
  }, [reviews]);

  useEffect(() => {
    localStorage.setItem('kk_notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('kk_friend_requests', JSON.stringify(friendRequests));
  }, [friendRequests]);

  useEffect(() => {
    localStorage.setItem('kk_monthly_user_stats', JSON.stringify(monthlyUserStats));
  }, [monthlyUserStats]);

  useEffect(() => {
    localStorage.setItem('kk_moderation_logs', JSON.stringify(moderationLogs));
  }, [moderationLogs]);

  // Helper: Toast alerts
  const showToast = (message, icon = '•') => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, message, icon }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3200);
  };

  // Helper: Current User object (Tek hesap modeli: oturum açılmamışsa null)
  const currentUser = currentUserId ? (users.find(u => u.id === currentUserId) || null) : null;

  // --- ROL TABANLI YETKİLENDİRME SİSTEMİ (Founder > Admin > User) ---
  const getUserRole = (user) => user?.role || 'user';
  const isFounder = (user = currentUser) => getUserRole(user) === 'founder';
  const isAdminUser = (user = currentUser) => getUserRole(user) === 'admin' || getUserRole(user) === 'founder';
  const isRegularUser = (user = currentUser) => getUserRole(user) === 'user';

  // Authorization middleware simulations
  const requireAdmin = (caller = currentUser) => {
    if (!isAdminUser(caller)) {
      return { authorized: false, error: '403 Forbidden: Bu işlem yalnızca yöneticiler tarafından gerçekleştirilebilir.' };
    }
    return { authorized: true };
  };

  const requireFounder = (caller = currentUser) => {
    if (!isFounder(caller)) {
      return { authorized: false, error: '403 Forbidden: Bu işlem yalnızca Kurucu (Founder) tarafından gerçekleştirilebilir.' };
    }
    return { authorized: true };
  };

  // --- ADMIN LOG SİSTEMİ ---
  const [adminLogs, setAdminLogs] = useState(() => {
    const saved = localStorage.getItem('kk_admin_logs');
    return saved ? JSON.parse(saved) : INITIAL_ADMIN_LOGS;
  });

  useEffect(() => {
    localStorage.setItem('kk_admin_logs', JSON.stringify(adminLogs));
  }, [adminLogs]);

  const addAdminLog = (action, targetUserId, details) => {
    const logEntry = {
      id: `alog-${Date.now()}`,
      actorId: currentUserId,
      actorRole: getUserRole(currentUser),
      action,
      targetUserId,
      details,
      timestamp: new Date().toLocaleString('tr-TR')
    };
    setAdminLogs(prev => [logEntry, ...prev]);
  };

  // --- FOUNDER: ADMIN YÖNETİMİ ---
  const promoteToAdmin = (userId) => {
    const auth = requireFounder();
    if (!auth.authorized) {
      showToast(auth.error, '🚫');
      return { success: false, error: auth.error };
    }
    const target = users.find(u => u.id === userId);
    if (!target) return { success: false, error: 'Kullanıcı bulunamadı.' };
    if (target.role === 'founder') {
      showToast('Kurucu hesabının rolü değiştirilemez.', '🚫');
      return { success: false, error: 'Kurucu hesabının rolü değiştirilemez.' };
    }
    if (target.role === 'admin') {
      showToast('Bu kullanıcı zaten admin.', 'ℹ️');
      return { success: false, error: 'Bu kullanıcı zaten admin.' };
    }

    setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: 'admin' } : u));
    addAdminLog('promote_to_admin', userId, `${target.fullName} hesabı admin olarak yetkilendirildi.`);
    showToast(`${target.fullName} admin olarak yetkilendirildi.`, '🛡️');
    return { success: true };
  };

  const demoteFromAdmin = (userId) => {
    const auth = requireFounder();
    if (!auth.authorized) {
      showToast(auth.error, '🚫');
      return { success: false, error: auth.error };
    }
    const target = users.find(u => u.id === userId);
    if (!target) return { success: false, error: 'Kullanıcı bulunamadı.' };
    if (target.role === 'founder') {
      showToast('Kurucu hesabının rolü değiştirilemez.', '🚫');
      return { success: false, error: 'Kurucu hesabının rolü değiştirilemez.' };
    }
    if (target.role === 'user') {
      showToast('Bu kullanıcı zaten normal kullanıcı.', 'ℹ️');
      return { success: false, error: 'Bu kullanıcı zaten normal kullanıcı.' };
    }

    setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: 'user' } : u));
    addAdminLog('demote_from_admin', userId, `${target.fullName} hesabından admin yetkisi kaldırıldı.`);
    showToast(`${target.fullName} admin yetkisi kaldırıldı.`, '🛡️');
    return { success: true };
  };

  // Helper: Format seconds to duration
  const formatDuration = (totalSeconds) => {
    if (!totalSeconds || totalSeconds <= 0) return '0 dk';
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    if (hours > 0) {
      return `${hours} sa ${minutes > 0 ? `${minutes} dk` : ''}`;
    }
    if (minutes > 0) {
      return `${minutes} dk ${seconds > 0 ? `${seconds} sn` : ''}`;
    }
    return `${seconds} sn`;
  };

  const formatClock = (totalSeconds) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return [
      hours.toString().padStart(2, '0'),
      minutes.toString().padStart(2, '0'),
      seconds.toString().padStart(2, '0')
    ].join(':');
  };

  // Tek hesap geçişi (geriye dönük uyumluluk için, doğrudan oturum atar)
  const switchUser = (userId) => {
    setCurrentUserId(userId);
    setViewingUserId(null);
  };

  // --- TEK HESAP: BİRLEŞİK GİRİŞ (Kurucu ve Beta Okurları Ortak Giriş) ---
  const loginUser = async (email, password) => {
    const emailNorm = email.trim().toLowerCase();

    // 1. Sunucu API üzerinden login dene
    try {
      const serverRes = await api.login(emailNorm, password);
      if (serverRes.success && serverRes.user) {
        let matched = users.find(u => u.email.toLowerCase() === emailNorm || u.id === serverRes.user.id);
        if (!matched) {
          matched = serverRes.user;
          setUsers(prev => [matched, ...prev]);
        }
        setCurrentUserId(matched.id);
        setIsBetaUnlocked(true);
        localStorage.setItem('kk_current_user_id', matched.id);
        localStorage.setItem('kk_beta_unlocked', 'true');
        showToast(`Hoş geldiniz, ${matched.fullName}!`, matched.role === 'founder' ? '👑' : '👋');
        return { success: true, user: matched };
      }
    } catch (e) {
      console.warn('API login offline fallback', e);
    }

    // 2. Yerel kullanıcı listesinden kontrol et
    const matched = users.find(u => u.email.toLowerCase() === emailNorm);
    if (!matched) {
      return { success: false, error: 'Bu e-posta adresine ait kayıtlı bir hesap bulunamadı.' };
    }

    // Kurucu şifresi veya standart test şifresi (123456) kontrolü
    const isValidPass = password === '123456' || password === 'founder123' || password === 'admin123' || (matched.passwordHash && matched.passwordHash.includes(btoa(password).slice(0, 8)));
    if (!isValidPass) {
      return { success: false, error: 'Girdiğiniz şifre hatalı.' };
    }

    setCurrentUserId(matched.id);
    setIsBetaUnlocked(true);
    localStorage.setItem('kk_current_user_id', matched.id);
    localStorage.setItem('kk_beta_unlocked', 'true');
    showToast(`Hoş geldiniz, ${matched.fullName}!`, matched.role === 'founder' ? '👑' : '👋');
    return { success: true, user: matched };
  };

  // --- TEK HESAP: ÇIKIŞ YAP (Oturumu Kapat & Beta Kapısını Kilitle) ---
  const logoutUser = () => {
    setCurrentUserId(null);
    setIsBetaUnlocked(false);
    localStorage.removeItem('kk_current_user_id');
    localStorage.removeItem('kk_beta_unlocked');
    localStorage.removeItem('kk_beta_code');
    showToast('Oturum kapatıldı. Kapalı Beta kapısına dönüldü.', '🔒');
  };

  // --- KAYIT SİSTEMİ (18+ YAŞ & DAVET KODU İLE ZORUNLU KAYIT) ---
  const registerUser = async ({ firstName, lastName, age, email, password, inviteCode }) => {
    const numAge = parseInt(age, 10);
    
    // 1. 18 yaş kontrolü
    if (isNaN(numAge) || numAge < 18) {
      return { 
        success: false, 
        error: 'Platform kuralları gereği Kapalı Beta\'ya yalnızca 18 yaş ve üzeri okurlar katılabilir.' 
      };
    }

    // 2. Kapalı Beta Davet Kodu Doğrulaması (Kayıtsız giriş kesinlikle yasak)
    const codeClean = (inviteCode || '').trim().toUpperCase();
    if (!codeClean) {
      return {
        success: false,
        error: 'Kapalı Beta testine katılabilmek için geçerli bir Davet Kodu girmelisiniz.'
      };
    }
    const validCodes = ['BETA-KITAP-2026', 'KK-FOUNDER-BETA'];
    if (!validCodes.includes(codeClean)) {
      try {
        const verifyRes = await api.verifyBetaCode(codeClean, email.trim());
        if (!verifyRes.success) {
          return {
            success: false,
            error: verifyRes.error || 'Geçersiz veya süresi dolmuş Beta Davet Kodu.'
          };
        }
      } catch {
        return {
          success: false,
          error: 'Geçersiz Beta Davet Kodu.'
        };
      }
    }

    // 3. Benzersiz e-posta kontrolü
    const emailNormalized = email.trim().toLowerCase();
    const existing = users.find(u => u.email.toLowerCase() === emailNormalized);
    if (existing) {
      return { 
        success: false, 
        error: 'Bu e-posta adresi ile kayıtlı bir hesap zaten bulunmaktadır. Lütfen Giriş Yap sekmesini kullanınız.' 
      };
    }

    // 4. Backend'e kaydet
    try {
      await api.register({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        age: numAge,
        email: emailNormalized,
        password,
        inviteCode: codeClean
      });
    } catch (e) {
      console.warn('Backend register sync warning', e);
    }

    const passwordHash = `hash_${btoa(password).slice(0, 16)}`;
    const username = `${firstName.toLowerCase().replace(/[^a-z0-9]/g, '')}${Math.floor(100 + Math.random() * 900)}`;

    const newUser = {
      id: `user-${Date.now()}`,
      username,
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      fullName: `${firstName.trim()} ${lastName.trim()}`,
      age: numAge,
      email: emailNormalized,
      passwordHash,
      role: 'user',
      isStarUser: false,
      roomCredit: 0,
      status: 'active',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&h=200&q=80',
      bio: 'Kitap Kulübü Kapalı Beta Okuru.',
      joinedDate: 'Eylül 2026',
      readingGoal: 20,
      streak: 1,
      totalReadingSeconds: 0,
      todayReadingSeconds: 0,
      todayGoalMinutes: 30,
      favoriteBookId: null,
      favoriteGenre: 'Genel Edebiyat',
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
    };

    setUsers(prev => [newUser, ...prev]);
    setCurrentUserId(newUser.id);
    setIsBetaUnlocked(true);
    localStorage.setItem('kk_current_user_id', newUser.id);
    localStorage.setItem('kk_beta_unlocked', 'true');
    localStorage.setItem('kk_beta_code', codeClean);
    setIsRegisterOpen(false);
    showToast(`🎉 Hoş geldiniz, ${newUser.fullName}! Beta hesabınız oluşturuldu.`, '✨');
    return { success: true, user: newUser };
  };

  // --- ARKADAŞLIK SİSTEMİ ---
  const sendFriendRequest = (targetUserId) => {
    if (targetUserId === currentUserId) return;
    if ((currentUser.friends || []).includes(targetUserId)) {
      showToast('Zaten arkadaşsınız.', 'ℹ️');
      return;
    }

    const existingReq = friendRequests.find(
      r => r.fromUserId === currentUserId && r.toUserId === targetUserId && r.status === 'pending'
    );
    if (existingReq) {
      showToast('Arkadaşlık isteği zaten gönderilmiş.', 'ℹ️');
      return;
    }

    const newReq = {
      id: `freq-${Date.now()}`,
      fromUserId: currentUserId,
      toUserId: targetUserId,
      status: 'pending',
      date: new Date().toLocaleDateString('tr-TR')
    };

    const target = users.find(u => u.id === targetUserId);
    const newNotif = {
      id: `notif-${Date.now()}`,
      userId: targetUserId,
      type: 'friend_request',
      title: 'Yeni Arkadaşlık İsteği',
      message: `${currentUser?.fullName || 'Bir okur'} size arkadaşlık isteği gönderdi.`,
      fromUserId: currentUserId,
      time: 'Az önce',
      read: false
    };

    setFriendRequests(prev => [newReq, ...prev]);
    setNotifications(prev => [newNotif, ...prev]);
    showToast(`${target?.fullName || 'Okura'} arkadaşlık isteği iletildi.`, '✉️');
  };

  const acceptFriendRequest = (requestId) => {
    const req = friendRequests.find(r => r.id === requestId);
    if (!req) return;

    setFriendRequests(prev => prev.map(r => r.id === requestId ? { ...r, status: 'accepted' } : r));

    setUsers(prev => prev.map(u => {
      if (u.id === req.toUserId) {
        const friends = u.friends || [];
        return { ...u, friends: friends.includes(req.fromUserId) ? friends : [...friends, req.fromUserId] };
      }
      if (u.id === req.fromUserId) {
        const friends = u.friends || [];
        return { ...u, friends: friends.includes(req.toUserId) ? friends : [...friends, req.toUserId] };
      }
      return u;
    }));

    const sender = users.find(u => u.id === req.fromUserId);
    const acceptNotif = {
      id: `notif-${Date.now()}`,
      userId: req.fromUserId,
      type: 'friend_accept',
      title: 'Arkadaşlık İsteği Kabul Edildi',
      message: `${currentUser?.fullName || 'Bir okur'} arkadaşlık isteğinizi kabul etti! Artık arkadaşsınız.`,
      fromUserId: currentUserId,
      time: 'Az önce',
      read: false
    };
    setNotifications(prev => [acceptNotif, ...prev]);

    showToast(`${sender?.fullName || 'Okur'} ile artık arkadaşsınız!`, '🤝');
  };

  const rejectFriendRequest = (requestId) => {
    setFriendRequests(prev => prev.map(r => r.id === requestId ? { ...r, status: 'rejected' } : r));
    showToast('Arkadaşlık isteği reddedildi.', '✕');
  };

  const removeFriend = (friendUserId) => {
    setUsers(prev => prev.map(u => {
      if (u.id === currentUserId) {
        return { ...u, friends: (u.friends || []).filter(id => id !== friendUserId) };
      }
      if (u.id === friendUserId) {
        return { ...u, friends: (u.friends || []).filter(id => id !== currentUserId) };
      }
      return u;
    }));
    showToast('Arkadaşlıktan çıkarıldı.', 'ℹ️');
  };

  // --- TAKİP ET / BIRAK SİSTEMİ ---
  const followUser = (targetUserId) => {
    if (!currentUser || targetUserId === currentUserId) return;
    const targetUser = users.find(u => u.id === targetUserId);
    if (!targetUser) return;

    const myFollowing = currentUser.following || [];
    const isCurrentlyFollowing = myFollowing.includes(targetUserId);

    setUsers(prev => prev.map(u => {
      if (u.id === currentUserId) {
        const following = u.following || [];
        const nextFollowing = isCurrentlyFollowing 
          ? following.filter(id => id !== targetUserId)
          : [...following, targetUserId];
        return { ...u, following: nextFollowing };
      }
      if (u.id === targetUserId) {
        const followers = u.followers || [];
        const nextFollowers = isCurrentlyFollowing
          ? followers.filter(id => id !== currentUserId)
          : [...followers, currentUserId];
        return { ...u, followers: nextFollowers };
      }
      return u;
    }));

    if (isCurrentlyFollowing) {
      showToast(`${targetUser.fullName} takipten çıkarıldı.`, 'ℹ️');
    } else {
      const followNotif = {
        id: `notif-${Date.now()}`,
        userId: targetUserId,
        type: 'follow',
        title: 'Yeni Takipçi',
        message: `${currentUser?.fullName || 'Bir okur'} sizi takip etmeye başladı.`,
        fromUserId: currentUserId,
        time: 'Az önce',
        read: false
      };
      setNotifications(prev => [followNotif, ...prev]);
      showToast(`${targetUser.fullName} takip ediliyor!`, '👥');
    }
  };

  // --- PROFİL GÜNCELLEME SİSTEMİ ---
  const updateProfile = (updatedData) => {
    if (!currentUser) return;
    setUsers(prev => {
      const updatedList = prev.map(u => {
        if (u.id === currentUserId) {
          return {
            ...u,
            ...updatedData,
            readingGoal: updatedData.readingGoal !== undefined 
              ? (parseInt(updatedData.readingGoal, 10) || u.readingGoal) 
              : u.readingGoal,
            id: u.id,
            role: u.role,
            email: updatedData.email || u.email
          };
        }
        return u;
      });
      localStorage.setItem('kk_users', JSON.stringify(updatedList));
      return updatedList;
    });

    if (currentUser?.role === 'founder') {
      api.updateFounderProfile(updatedData).catch(() => {});
    }

    setIsEditProfileOpen(false);
    showToast('Profil bilgileriniz başarıyla güncellendi.', '✓');
  };

  // --- GİZLİLİK AYARLARI SİSTEMİ ---
  const updatePrivacySettings = (newSettings) => {
    if (!currentUser) return;
    setUsers(prev => prev.map(u => {
      if (u.id === currentUserId) {
        return {
          ...u,
          privacySettings: {
            ...(u.privacySettings || {}),
            ...newSettings
          }
        };
      }
      return u;
    }));
    setIsPrivacyOpen(false);
    showToast('Gizlilik tercihleriniz kaydedildi.', '🛡️');
  };

  // --- YILDIZLI KULLANICI & AYLIK DEĞERLENDİRME ALGORİTMASI ---
  const evaluateMonthlyStarStatus = (userId, targetMonth = '2026-08') => {
    const user = users.find(u => u.id === userId);
    if (!user) return false;

    // Kullanıcının mevcut istatistikleri
    const userSessions = readingSessions.filter(s => s.userId === userId);
    const totalMinutes = Math.round(userSessions.reduce((acc, s) => acc + s.durationSeconds, 0) / 60) + Math.round((user.totalReadingSeconds || 0) / 60);
    const readBooksCount = userBooks.filter(ub => ub.userId === userId && ub.status === 'read').length;
    const consistencyDays = (user.weeklyStreak || []).filter(d => d.completed).length * 4;

    // Kriterler: En az 900 dakika (15 saat) okuma ve en az 2 kitap tamamlama
    const qualifies = totalMinutes >= 900 && readBooksCount >= 2;

    const existingRecord = monthlyUserStats.find(m => m.userId === userId && m.month === targetMonth);
    if (existingRecord && existingRecord.roomCreditAwarded) {
      return false; // Aynı ay için mükerrer hak verilmez
    }

    const newStatsRecord = {
      id: `mus-${Date.now()}`,
      userId,
      month: targetMonth,
      readingMinutes: totalMinutes,
      booksCompleted: readBooksCount,
      consistencyDays,
      qualified: qualifies,
      roomCreditAwarded: qualifies
    };

    setMonthlyUserStats(prev => [newStatsRecord, ...prev.filter(m => !(m.userId === userId && m.month === targetMonth))]);

    if (qualifies) {
      setUsers(prev => prev.map(u => {
        if (u.id === userId) {
          return {
            ...u,
            isStarUser: true,
            roomCredit: (u.roomCredit || 0) + 1
          };
        }
        return u;
      }));
      showToast(`Tebrikler! ${user.fullName} Yıldızlı Kullanıcı (★) oldu ve +1 Oda Açma Hakkı kazandı!`, '★');
      return true;
    }
    return false;
  };

  // --- ODA OLUŞTURMA & YÖNETİMİ ---
  const createRoom = ({ name, description, icon = '📖', rules = '' }) => {
    const hasAdminPrivilege = isAdminUser();
    const roomCredit = currentUser.roomCredit || 0;

    if (!hasAdminPrivilege && roomCredit < 1) {
      showToast('Oda açma hakkınız bulunmamaktadır. Yıldızlı Kullanıcı olarak hak kazanabilirsiniz.', '⚠️');
      return { success: false, error: 'Oda açabilmek için aylık okuma hedeflerini tamamlayarak Yıldızlı Kullanıcı (★) olmalısınız.' };
    }

    // Normal kullanıcıdan kredi düşülür, admin/founder'dan düşülmez
    if (!hasAdminPrivilege) {
      setUsers(prev => prev.map(u => u.id === currentUserId ? { ...u, roomCredit: Math.max(0, (u.roomCredit || 1) - 1) } : u));
    }

    const newRoom = {
      id: `room-${Date.now()}`,
      name: name.trim(),
      description: description.trim(),
      icon,
      rules: rules.trim() || 'Sakin ve saygılı okuma tartışmaları.',
      adminId: currentUserId,
      members: [currentUserId],
      isPrivate: false
    };

    setRooms(prev => [newRoom, ...prev]);
    showToast(`"${newRoom.name}" odası oluşturuldu.`, '🏛️');
    setIsCreateRoomOpen(false);
    return { success: true };
  };

  const closeRoom = (roomId) => {
    const targetRoom = rooms.find(r => r.id === roomId);
    if (!targetRoom) return;
    if (currentUser.id !== targetRoom.adminId && !isAdminUser()) {
      showToast('Bu odayı kapatma yetkiniz yok.', '✕');
      return;
    }

    setRooms(prev => prev.filter(r => r.id !== roomId));
    addAdminLog('close_room', null, `"${targetRoom.name}" odası kapatıldı.`);
    showToast(`"${targetRoom.name}" odası kapatıldı.`, 'ℹ️');
  };

  const unlockRoom = (roomId) => {
    const targetRoom = rooms.find(r => r.id === roomId);
    if (!targetRoom) return;
    if (!isAdminUser()) {
      showToast('Bu odayı açma yetkiniz yok.', '✕');
      return;
    }
    setRooms(prev => {
      const updated = prev.map(r => r.id === roomId ? { ...r, isLocked: false, countdownDays: 0 } : r);
      localStorage.setItem('kk_rooms', JSON.stringify(updated));
      return updated;
    });
    addAdminLog('unlock_room', null, `"${targetRoom.name}" kilitli kulüp odası erken erişime açıldı.`);
    showToast(`"${targetRoom.name}" odası tartışmaya açıldı! 🔓`, '🎉');
  };

  // --- GÖRSEL VE GÖNDERİ MODERASYON FİLTRESİ (Telif & Sayfa Taraması Kontrolü) ---
  const moderateAndCreatePost = ({ content, bookId = null, pageProgress = null, rating = null, isSpoiler = false, spoilerText = '', imageUrl = null }) => {
    // Görsel telif ve tam sayfa tarama kontrolü simülasyonu
    if (imageUrl) {
      const lowerText = (content + ' ' + imageUrl).toLowerCase();
      const forbiddenPatterns = ['tam_sayfa', 'full_page_scan', 'sayfa_tarama', 'telifli_kitap', 'korsan', 'pdf_scan'];
      const isInfringing = forbiddenPatterns.some(p => lowerText.includes(p));

      if (isInfringing) {
        const log = {
          id: `mod-${Date.now()}`,
          userId: currentUserId,
          userName: currentUser.fullName,
          postContent: content,
          imageUrl,
          reason: 'Telif ihlali riski: Kitap sayfalarının tam taranması veya yetkisiz içerik şüphesi.',
          status: 'blocked',
          timestamp: new Date().toLocaleString('tr-TR'),
          adminReviewed: false
        };
        setModerationLogs(prev => [log, ...prev]);
        showToast('Bu görsel topluluk ve telif kurallarımıza uygun olmadığı için paylaşım kaldırıldı.', '⚠️');
        return { success: false, error: 'Bu görsel topluluk ve telif kurallarımıza uygun olmadığı için paylaşım kaldırıldı.' };
      }
    }

    // Gönderiyi oluştur (Yeni gönderiler en üste gelir)
    const newPost = {
      id: `post-${Date.now()}`,
      userId: currentUserId,
      content,
      bookId,
      pageProgress,
      rating,
      isSpoiler,
      spoilerText,
      imageUrl: imageUrl || null,
      timestamp: 'Az önce',
      likes: [],
      comments: []
    };

    setPosts(prev => [newPost, ...prev]);
    showToast('Düşünceniz paylaşıldı.', '✓');
    setIsCreatePostOpen(false);
    return { success: true };
  };

  const createPost = (data) => {
    return moderateAndCreatePost(data);
  };

  const reviewModerationLog = (logId, action) => {
    setModerationLogs(prev => prev.map(log => {
      if (log.id === logId) {
        return {
          ...log,
          adminReviewed: true,
          status: action === 'restore' ? 'restored' : 'confirmed_blocked'
        };
      }
      return log;
    }));
    showToast(action === 'restore' ? 'İçerik onaylandı ve geri yüklendi.' : 'Engelleme teyit edildi.', '🛡️');
  };

  // Kullanıcı hesap durumunu değiştirme (Admin/Founder)
  const toggleUserStatus = (userId) => {
    const auth = requireAdmin();
    if (!auth.authorized) return;

    const target = users.find(u => u.id === userId);
    if (!target) return;

    // Founder koruma: Admin, founder hesabını askıya alamaz
    if (target.role === 'founder' && !isFounder()) {
      showToast('Kurucu hesabı üzerinde işlem yapma yetkiniz yok.', '🚫');
      return;
    }

    setUsers(prev => prev.map(u => {
      if (u.id === userId) {
        const nextStatus = u.status === 'suspended' ? 'active' : 'suspended';
        showToast(`${u.fullName} hesabı ${nextStatus === 'suspended' ? 'askıya alındı' : 'aktifleştirildi'}.`, '🛡️');
        return { ...u, status: nextStatus };
      }
      return u;
    }));
    addAdminLog('toggle_user_status', userId, `${target.fullName} hesabı ${target.status === 'suspended' ? 'aktifleştirildi' : 'askıya alındı'}.`);
  };

  // Sosyal Beğeni / Yorum
  const toggleLikePost = (postId) => {
    setPosts(prev => prev.map(p => {
      if (p.id === postId) {
        const isLiked = p.likes.includes(currentUserId);
        const newLikes = isLiked
          ? p.likes.filter(id => id !== currentUserId)
          : [...p.likes, currentUserId];
        return { ...p, likes: newLikes };
      }
      return p;
    }));
  };

  const addComment = (postId, text) => {
    if (!text.trim()) return;
    const newComment = {
      id: `c-${Date.now()}`,
      userId: currentUserId,
      text: text.trim(),
      timestamp: 'Az önce'
    };

    setPosts(prev => prev.map(p => {
      if (p.id === postId) {
        return { ...p, comments: [...p.comments, newComment] };
      }
      return p;
    }));
    showToast('Yorum eklendi.', '💬');
  };

  // --- KRONOMETRE AKSİYONLARI ---
  const startTimer = (bookId) => {
    const book = books.find(b => b.id === bookId) || books[0];
    const existingUB = userBooks.find(ub => ub.bookId === book.id && ub.userId === currentUserId);
    if (!existingUB) {
      updateBookStatus(book.id, 'reading');
    }

    const currentBookPage = existingUB?.currentPage || 0;
    const now = Date.now();

    setTimerEngine({
      bookId: book.id,
      isRunning: true,
      seconds: timerEngine.bookId === book.id ? timerEngine.seconds : 0,
      startPage: currentBookPage,
      sessionStartTime: now,
      pausedDuration: 0,
      lastPausedAt: null,
      lastTick: now
    });

    setIsTimerModalOpen(true);
    showToast(`"${book.title}" için okuma süresi ölçülüyor.`, '⏱️');
  };

  const pauseTimer = () => {
    setTimerEngine(prev => ({
      ...prev,
      isRunning: false,
      lastPausedAt: Date.now(),
      lastTick: Date.now()
    }));
  };

  const resumeTimer = () => {
    setTimerEngine(prev => {
      const additionalPaused = prev.lastPausedAt ? Date.now() - prev.lastPausedAt : 0;
      return {
        ...prev,
        isRunning: true,
        pausedDuration: (prev.pausedDuration || 0) + additionalPaused,
        lastPausedAt: null,
        lastTick: Date.now()
      };
    });
  };

  const finishTimer = (endPageInput = null, sessionNotes = '') => {
    const { bookId, seconds, startPage, sessionStartTime } = timerEngine;
    if (!bookId || seconds <= 0) {
      setTimerEngine({ bookId: null, isRunning: false, seconds: 0, startPage: 0, sessionStartTime: null, pausedDuration: 0, lastPausedAt: null, lastTick: null });
      localStorage.removeItem('kk_timer_engine');
      setIsTimerModalOpen(false);
      return;
    }

    const book = books.find(b => b.id === bookId);
    const existingUB = userBooks.find(ub => ub.bookId === bookId && ub.userId === currentUserId);
    const prevPage = startPage || existingUB?.currentPage || 0;
    const finalPage = endPageInput !== null ? Math.min(book?.pages || 999, Math.max(0, parseInt(endPageInput, 10) || prevPage)) : prevPage;
    const pagesRead = Math.max(0, finalPage - prevPage);

    const nowObj = new Date();
    const endTimeStr = `${nowObj.getHours().toString().padStart(2, '0')}:${nowObj.getMinutes().toString().padStart(2, '0')}`;
    const startObj = sessionStartTime ? new Date(sessionStartTime) : new Date(Date.now() - seconds * 1000);
    const startTimeStr = `${startObj.getHours().toString().padStart(2, '0')}:${startObj.getMinutes().toString().padStart(2, '0')}`;
    const todayDateStr = nowObj.toISOString().split('T')[0];

    // 1. ReadingSession kaydı
    const newSession = {
      id: `rs-${Date.now()}`,
      userId: currentUserId,
      bookId,
      date: todayDateStr,
      startTime: startTimeStr,
      endTime: endTimeStr,
      durationSeconds: seconds,
      startPage: prevPage,
      endPage: finalPage,
      pagesRead,
      notes: sessionNotes
    };

    setReadingSessions(prev => [newSession, ...prev]);

    // 2. Kullanıcı istatistik güncellemesi
    setUsers(prev => prev.map(u => {
      if (u.id === currentUserId) {
        const newTotalSeconds = (u.totalReadingSeconds || 0) + seconds;
        const newTodaySeconds = (u.todayReadingSeconds || 0) + seconds;
        return {
          ...u,
          totalReadingSeconds: newTotalSeconds,
          todayReadingSeconds: newTodaySeconds
        };
      }
      return u;
    }));

    // 3. Kullanıcı Kitabı güncellemesi
    setUserBooks(prev => prev.map(ub => {
      if (ub.bookId === bookId && ub.userId === currentUserId) {
        return {
          ...ub,
          totalReadingSeconds: (ub.totalReadingSeconds || 0) + seconds,
          currentPage: finalPage,
          status: (finalPage >= (book?.pages || 999)) ? 'read' : 'reading'
        };
      }
      return ub;
    }));

    // Backend API'ye otomatik eşzamanla (Çapraz platform senkronizasyonu)
    api.saveSession({
      bookId,
      durationSeconds: seconds,
      startPage: prevPage,
      endPage: finalPage,
      notes: sessionNotes
    }, currentUserId);

    setCompletedSession({
      book,
      seconds,
      previousPage: prevPage,
      newPage: finalPage,
      pagesRead
    });

    setTimerEngine({
      bookId: null,
      isRunning: false,
      seconds: 0,
      startPage: 0,
      sessionStartTime: null,
      pausedDuration: 0,
      lastPausedAt: null,
      lastTick: null
    });
    localStorage.removeItem('kk_timer_engine');
    setIsTimerModalOpen(false);
  };

  // Kitaplık Durum Değiştirme
  const updateBookStatus = (bookId, status) => {
    const book = books.find(b => b.id === bookId);
    const today = new Date().toISOString().split('T')[0];

    setUserBooks(prev => {
      const existing = prev.find(ub => ub.bookId === bookId && ub.userId === currentUserId);
      if (existing) {
        return prev.map(ub => {
          if (ub.id === existing.id) {
            return {
              ...ub,
              status,
              currentPage: status === 'read' ? (book?.pages || ub.currentPage) : (status === 'to_read' ? 0 : ub.currentPage),
              finishDate: status === 'read' ? today : null,
              startDate: status === 'reading' && !ub.startDate ? today : ub.startDate
            };
          }
          return ub;
        });
      } else {
        return [...prev, {
          id: `ub-${Date.now()}`,
          userId: currentUserId,
          bookId,
          status,
          currentPage: status === 'read' ? (book?.pages || 0) : 0,
          totalReadingSeconds: 0,
          startDate: status === 'reading' ? today : null,
          finishDate: status === 'read' ? today : null,
          userRating: null,
          notes: ''
        }];
      }
    });

    const statusLabels = { reading: 'Okunuyor', read: 'Okundu', to_read: 'Okunacak' };
    showToast(`"${book?.title}" ${statusLabels[status]} listesine alındı.`, '📚');
  };

  // --- İSTEK SEPETİ (WİSHLİST) FONKSİYONLARI (Doküman Paragraf 9) ---
  const addToWishlist = (bookId) => {
    const book = books.find(b => b.id === bookId);
    if (!book) return;
    const existing = userBooks.find(ub => ub.bookId === bookId && ub.userId === currentUserId);
    if (existing && existing.status === 'to_read') {
      showToast(`"${book.title}" zaten istek sepetinizde.`, 'ℹ️');
      return;
    }
    updateBookStatus(bookId, 'to_read');
    showToast(`"${book.title}" istek sepetinize eklendi! ✨`, '🛒');
  };

  const removeFromWishlist = (bookId) => {
    setUserBooks(prev => {
      const updated = prev.filter(ub => !(ub.userId === currentUserId && ub.bookId === bookId && ub.status === 'to_read'));
      localStorage.setItem('kk_user_books', JSON.stringify(updated));
      return updated;
    });
    showToast('Kitap istek sepetinden çıkarıldı.', '🗑️');
  };

  const isInWishlist = (bookId) => {
    return userBooks.some(ub => ub.userId === currentUserId && ub.bookId === bookId && ub.status === 'to_read');
  };

  // --- AYLIK KİTAP KULÜBÜ BAŞLATMA (Doküman Paragraf 23) ---
  const launchMonthlyBookClub = ({ bookId, description, unlockDays = 30 }) => {
    const book = books.find(b => b.id === bookId);
    if (!book) return;

    const unlockDate = new Date();
    unlockDate.setDate(unlockDate.getDate() + unlockDays);
    const unlockDateStr = unlockDate.toISOString().split('T')[0];

    const newRoom = {
      id: `room-monthly-${Date.now()}`,
      name: `Aylık Kitap Kulübü: ${book.title}`,
      description: description || `Admin tarafından seçilen bu ayın kulüp kitabı: ${book.title}. 1 ay boyunca okuyoruz, ay sonunda erişime açılacak ve derinlemesine tartışacağız.`,
      icon: '🌟',
      adminId: currentUserId,
      members: [currentUserId],
      isPrivate: false,
      isMonthlyClub: true,
      isLocked: true,
      countdownDays: unlockDays,
      unlockDate: unlockDateStr,
      bookId: book.id,
      isPopular: true,
      rules: 'Kulüp okuması süresince oda kilitlidir; ay sonunda tüm üyelerin katılımına açılacaktır.'
    };

    setRooms(prev => {
      const updated = [newRoom, ...prev];
      localStorage.setItem('kk_rooms', JSON.stringify(updated));
      return updated;
    });

    const newNotif = {
      id: `notif-monthly-${Date.now()}`,
      userId: currentUserId,
      actorId: currentUserId,
      type: 'monthly_book_club',
      bookId: book.id,
      text: `Yönetici yeni ayın kulüp kitabını seçti: "${book.title}" (${book.author}). Tartışma odası 1 ay sonra açılacaktır. Hemen istek sepetinize ekleyin!`,
      time: 'Az önce',
      read: false
    };

    setNotifications(prev => {
      const updated = [newNotif, ...prev];
      localStorage.setItem('kk_notifications', JSON.stringify(updated));
      return updated;
    });

    showToast(`"${book.title}" ayı için kulüp odası kilitli olarak açıldı ve bildirim iletildi! 🌟`, '📢');
  };

  // --- AYLIK OKUMA HEDEFİ TAKVİMİ (Doküman Paragraf 25) ---
  const logCalendarReading = ({ date, bookId, pagesRead, note = '' }) => {
    setReadingCalendarLogs(prev => {
      const filtered = prev.filter(item => !(item.date === date && item.bookId === bookId));
      const updated = [...filtered, { date, bookId, pagesRead: Number(pagesRead) || 0, note }];
      localStorage.setItem('kk_calendar_logs', JSON.stringify(updated));
      return updated;
    });
    showToast('Okuma günlüğü takviminize işlendi! 📅', '✨');
  };

  // --- YAPAY ZEKA İLE KAPAK BULUCU (Doküman Paragraf 13) ---
  const aiSearchBookCover = (bookId) => {
    const book = books.find(b => b.id === bookId);
    if (!book) return;
    showToast(`Yapay zeka "${book.title}" için Google Books ve görsel veritabanını tarıyor...`, '🤖');
    setTimeout(() => {
      const sampleCovers = [
        'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=400&h=600&q=80',
        'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&w=400&h=600&q=80',
        'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=400&h=600&q=80',
        'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=400&h=600&q=80',
        'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=400&h=600&q=80'
      ];
      const randomCover = sampleCovers[Math.floor(Math.random() * sampleCovers.length)];
      setBooks(prev => {
        const updated = prev.map(b => b.id === bookId ? { ...b, cover: randomCover } : b);
        localStorage.setItem('kk_books', JSON.stringify(updated));
        return updated;
      });
      showToast(`"${book.title}" için yapay zeka tarafından kapak görseli güncellendi!`, '🖼️');
    }, 1000);
  };

  // Otomatik Takipçi Ekleme (Yazarlar & Adminler - Doküman Paragraf 5)
  useEffect(() => {
    const boostedKey = 'kk_followers_boosted_v2';
    if (!localStorage.getItem(boostedKey)) {
      setUsers(prev => prev.map(u => {
        if (u.role === 'author' || u.role === 'founder' || u.role === 'admin') {
          const currentFollowers = u.followers || [];
          const simulatedIds = ['user-1', 'user-2', 'user-3', 'user-4', 'sim-user-1', 'sim-user-2', 'sim-user-3'];
          const merged = Array.from(new Set([...currentFollowers, ...simulatedIds]));
          return { ...u, followers: merged };
        }
        return u;
      }));
      localStorage.setItem(boostedKey, 'true');
    }
  }, []);

  const getUserBook = (bookId, userId = currentUserId) => {
    return userBooks.find(ub => ub.bookId === bookId && ub.userId === userId) || null;
  };

  const updatePageProgress = (bookId, newPage, shouldShare = false) => {
    const book = books.find(b => b.id === bookId);
    if (!book) return;

    const clampedPage = Math.min(Math.max(0, parseInt(newPage, 10) || 0), book.pages);
    const isCompleted = clampedPage >= book.pages;

    setUserBooks(prev => prev.map(ub => {
      if (ub.bookId === bookId && ub.userId === currentUserId) {
        return {
          ...ub,
          currentPage: clampedPage,
          status: isCompleted ? 'read' : 'reading',
          finishDate: isCompleted ? new Date().toLocaleDateString('tr-TR') : ub.finishDate
        };
      }
      return ub;
    }));

    if (shouldShare) {
      const postContent = isCompleted
        ? `"${book.title}" (${book.author}) kitabını tamamladım! 📖🎉`
        : `"${book.title}" kitabında ${clampedPage}. sayfaya ulaştım. (Toplam ${book.pages} sf.)`;
      moderateAndCreatePost({
        bookId: book.id,
        content: postContent,
        page: clampedPage
      });
    }

    showToast(`Sayfa güncellendi: ${clampedPage} / ${book.pages}`, '📖');
    setUpdatingProgressBook(null);

    // Ortak veritabanına arka planda yaz (iOS & Android anında görsün)
    const targetUB = userBooks.find(ub => ub.bookId === bookId && ub.userId === currentUserId);
    if (targetUB) {
      api.updateProgress(targetUB.id, clampedPage, isCompleted ? 'completed' : 'reading', currentUserId);
    }
  };

  // --- BETA FEEDBACK VE TESTÇİ YÖNETİM METODLARI ---
  const submitBetaFeedback = async (feedbackData) => {
    const res = await api.sendBetaFeedback(feedbackData, currentUserId);
    if (res && res.feedback) {
      setBetaFeedbacks(prev => [res.feedback, ...prev]);
    }
    return res;
  };

  const refreshBetaFeedbacks = async () => {
    const list = await api.getBetaFeedbacks(currentUserId);
    if (Array.isArray(list)) setBetaFeedbacks(list);
    return list;
  };

  const updateFeedbackStatus = async (id, status) => {
    const res = await api.updateFeedbackStatus(id, status, currentUserId);
    if (res && res.feedback) {
      setBetaFeedbacks(prev => prev.map(f => f.id === id ? res.feedback : f));
      showToast('Geri bildirim durumu güncellendi.', '✓');
    }
    return res;
  };

  const refreshBetaTesters = async () => {
    const data = await api.getBetaTesters(currentUserId);
    if (data) setBetaTestersData(data);
    return data;
  };

  const addBetaTesterOrCode = async (testerData) => {
    const res = await api.addBetaTesterOrCode(testerData, currentUserId);
    if (res) {
      await refreshBetaTesters();
      showToast(testerData.generateCode ? `Yeni davet kodu üretildi: ${res.inviteCode}` : 'Beta testçisi tanımlandı.', '🎟️');
    }
    return res;
  };

  const toggleRestrictedMode = async () => {
    const nextMode = !betaStatus.restrictedMode;
    const res = await api.updateBetaSettings({ restrictedMode: nextMode }, currentUserId);
    if (res && res.settings) {
      setBetaStatus(res.settings);
      showToast(nextMode ? 'Kapalı Beta Modu Aktif (Özel İzinli)' : 'Genel Erişim Açıldı (Kısıtlama Kapalı)', '🔒');
    } else {
      setBetaStatus(prev => ({ ...prev, restrictedMode: nextMode }));
      showToast(nextMode ? 'Kapalı Beta Modu Aktif (Yerel)' : 'Genel Erişim Açık (Yerel)', '🔒');
    }
  };

  // Oda İçi Mesajlaşma
  const sendRoomMessage = (roomId, { text, isSpoiler = false, spoilerText = '' }) => {
    if (!text.trim() && !spoilerText.trim()) return;
    const now = new Date();
    const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

    const newMsg = {
      id: `msg-${Date.now()}`,
      roomId,
      userId: currentUserId,
      text: text.trim(),
      isSpoiler,
      spoilerText,
      timestamp: timeStr
    };

    setMessages(prev => [...prev, newMsg]);

    // Odaya otomatik üye yap (henüz üye değilse)
    setRooms(prev => prev.map(r => {
      if (r.id === roomId && !r.members.includes(currentUserId)) {
        return { ...r, members: [...r.members, currentUserId] };
      }
      return r;
    }));
  };

  const joinRoom = (roomId) => {
    setRooms(prev => prev.map(r => {
      if (r.id === roomId) {
        const isMember = r.members.includes(currentUserId);
        const newMembers = isMember
          ? r.members.filter(id => id !== currentUserId)
          : [...r.members, currentUserId];
        showToast(isMember ? 'Odadan ayrıldınız.' : `"${r.name}" odasına katıldınız.`, isMember ? '👋' : '🚪');
        return { ...r, members: newMembers };
      }
      return r;
    }));
  };

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    showToast('Tüm bildirimler okundu.', '✓');
  };

  return (
    <AppContext.Provider
      value={{
        theme,
        setAppTheme,
        customAccent,
        updateCustomAccent,
        users,
        currentUser,
        currentUserId,
        switchUser,
        loginUser,
        logoutUser,
        registerUser,
        isRegisterOpen,
        setIsRegisterOpen,
        friendRequests,
        sendFriendRequest,
        acceptFriendRequest,
        rejectFriendRequest,
        removeFriend,
        followUser,
        monthlyUserStats,
        evaluateMonthlyStarStatus,
        moderationLogs,
        reviewModerationLog,
        toggleUserStatus,
        // Rol tabanlı yetkilendirme
        getUserRole,
        isFounder,
        isAdminUser,
        isRegularUser,
        requireAdmin,
        requireFounder,
        // Founder: Admin yönetimi
        promoteToAdmin,
        demoteFromAdmin,
        // Admin işlem logları
        adminLogs,
        addAdminLog,
        books,
        userBooks,
        getUserBook,
        updateBookStatus,
        updatePageProgress,
        // İstek Sepeti (Wishlist - Doküman Paragraf 9)
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        // Aylık Kulüp & Kilitli Oda (Doküman Paragraf 23)
        launchMonthlyBookClub,
        // Aylık Okuma Takvimi (Doküman Paragraf 25)
        readingCalendarLogs,
        logCalendarReading,
        // Yapay Zeka Kapak Bulucu (Doküman Paragraf 13)
        aiSearchBookCover,
        rooms,
        createRoom,
        closeRoom,
        unlockRoom,
        joinRoom,
        messages,
        sendRoomMessage,
        posts,
        createPost,
        moderateAndCreatePost,
        toggleLikePost,
        addComment,
        reviews,
        notifications,
        markAllNotificationsRead,
        activeTab,
        setActiveTab,
        activeRoomData,
        setActiveRoomData,
        activeFolderName,
        setActiveFolderName,
        activeBookData,
        setActiveBookData,
        openRoom,
        openFolder,
        openBook,
        viewingUserId,
        setViewingUserId,
        selectedBookId,
        setSelectedBookId,
        selectedRoomId,
        setSelectedRoomId,
        isSearchOpen,
        setIsSearchOpen,
        isNotifOpen,
        setIsNotifOpen,
        isCreatePostOpen,
        setIsCreatePostOpen,
        isCreateRoomOpen,
        setIsCreateRoomOpen,
        isCustomizeRoomOpen,
        setIsCustomizeRoomOpen,
        customizingRoom,
        openCustomizeRoom,
        closeCustomizeRoom,
        updateRoomProfile,
        isEditProfileOpen,
        setIsEditProfileOpen,
        updateProfile,
        isPrivacyOpen,
        setIsPrivacyOpen,
        updatePrivacySettings,
        // Profil Kitap Klasörleri (Maksimum 12 Adet)
        isFoldersModalOpen,
        setIsFoldersModalOpen,
        userFolders,
        setUserFolders,
        getUserFolders,
        createUserFolder,
        updateUserFolder,
        deleteUserFolder,
        addBookToUserFolder,
        removeBookFromUserFolder,
        updatingProgressBook,
        setUpdatingProgressBook,
        toasts,
        showToast,
        // Kronometre & Seanslar
        timerState: timerEngine,
        isTimerModalOpen,
        setIsTimerModalOpen,
        startTimer,
        pauseTimer,
        resumeTimer,
        finishTimer,
        completedSession,
        setCompletedSession,
        readingSessions,
        formatDuration,
        formatClock,
        // Özel Beta Test & Feedback Sistemi
        isBetaFeedbackOpen,
        setIsBetaFeedbackOpen,
        isBetaUnlocked,
        setIsBetaUnlocked,
        isFounderSettingsOpen,
        setIsFounderSettingsOpen,
        submitBetaFeedback,
        betaFeedbacks,
        refreshBetaFeedbacks,
        updateFeedbackStatus,
        betaTestersData,
        refreshBetaTesters,
        addBetaTesterOrCode,
        betaStatus,
        setBetaStatus,
        toggleRestrictedMode,
        setUsers
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
