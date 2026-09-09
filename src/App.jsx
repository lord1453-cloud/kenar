import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/common/Header';
import { Sidebar } from './components/common/Sidebar';
import { BottomNav } from './components/common/BottomNav';
import { SearchModal } from './components/common/SearchModal';
import { NotificationDrawer } from './components/common/NotificationDrawer';
import { ToastContainer } from './components/common/ToastContainer';

import { FeedView } from './components/feed/FeedView';
import { CreatePostModal } from './components/feed/CreatePostModal';

import { ThoughtsView } from './components/thoughts/ThoughtsView';
import { ShareThoughtView } from './components/thoughts/ShareThoughtView';
import { LiveReadingView } from './components/live/LiveReadingView';
import { FriendsView } from './components/friends/FriendsView';
import { ResearchView } from './components/research/ResearchView';
import { FolderDetailView } from './components/research/FolderDetailView';

import { LibraryView } from './components/library/LibraryView';
import { ProgressUpdaterModal } from './components/library/ProgressUpdaterModal';

import { BookDetailModal } from './components/books/BookDetailModal';
import { BookDetailView } from './components/books/BookDetailView';

import { RoomsView } from './components/rooms/RoomsView';
import { RoomChatView } from './components/rooms/RoomChatView';
import { RoomDetailModal } from './components/rooms/RoomDetailModal';
import { CreateRoomModal } from './components/rooms/CreateRoomModal';
import { CustomizeRoomModal } from './components/rooms/CustomizeRoomModal';

import { ProfileView } from './components/profile/ProfileView';
import { ProfilesDirectoryView } from './components/profile/ProfilesDirectoryView';
import { EditProfileModal } from './components/profile/EditProfileModal';
import { PrivacySettingsModal } from './components/profile/PrivacySettingsModal';
import { ProfileFoldersModal } from './components/profile/ProfileFoldersModal';
import { SettingsView } from './components/settings/SettingsView';
import { AdminView } from './components/admin/AdminView';
import { RegisterModal } from './components/auth/RegisterModal';
import { ClosedBetaGateModal } from './components/auth/ClosedBetaGateModal';
import { FounderSettingsModal } from './components/auth/FounderSettingsModal';
import { BetaFeedbackModal } from './components/common/BetaFeedbackModal';

import { ReadingTimerModal } from './components/timer/ReadingTimerModal';
import { FloatingTimerBar } from './components/timer/FloatingTimerBar';
import { SessionSummaryModal } from './components/timer/SessionSummaryModal';

const AppContent = () => {
  const { 
    activeTab, 
    isBetaUnlocked,
    currentUser, 
    isBetaFeedbackOpen, 
    setIsBetaFeedbackOpen,
    isFounderSettingsOpen,
    setIsFounderSettingsOpen
  } = useApp();

  // Tek Hesap & Kapalı Beta Kapısı: Kayıt veya Giriş yapılmadan içerik render edilmez
  if (!isBetaUnlocked || !currentUser) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <ClosedBetaGateModal />
        <ToastContainer />
      </div>
    );
  }

  return (
    <div className="app">
      {/* Sol Panel Navigasyonu */}
      <Sidebar />

      {/* Ana İçerik Alanı */}
      <div className="main">
        <Header />

        <main style={{ minHeight: 'calc(100vh - 70px)' }}>
          {activeTab === 'feed' && <FeedView />}
          {activeTab === 'rooms' && <RoomsView />}
          {activeTab === 'room_detail' && <RoomChatView />}
          {activeTab === 'research' && <ResearchView />}
          {activeTab === 'folder_detail' && <FolderDetailView />}
          {activeTab === 'book_detail' && <BookDetailView />}
          {activeTab === 'profile' && <ProfileView />}
          {activeTab === 'profiles' && <ProfilesDirectoryView />}

          {/* Diğer Desteklenen Ekranlar */}
          {activeTab === 'share_thought' && <ShareThoughtView />}
          {activeTab === 'thoughts' && <ThoughtsView />}
          {activeTab === 'live_reading' && <LiveReadingView />}
          {activeTab === 'friends' && <FriendsView />}
          {activeTab === 'library' && <LibraryView />}
          {activeTab === 'settings' && <SettingsView />}
          {activeTab === 'admin' && <AdminView />}
        </main>
      </div>

      {/* Floating Mini Timer */}
      <FloatingTimerBar />

      {/* Mobil Alt Navigasyon */}
      <BottomNav />

      {/* Modallar */}
      <SearchModal />
      <NotificationDrawer />
      <CreatePostModal />
      <CreateRoomModal />
      <CustomizeRoomModal />
      <BookDetailModal />
      <RoomDetailModal />
      <ProgressUpdaterModal />
      <EditProfileModal />
      <PrivacySettingsModal />
      <ProfileFoldersModal />
      <RegisterModal />
      <ClosedBetaGateModal />
      <FounderSettingsModal 
        isOpen={isFounderSettingsOpen} 
        onClose={() => setIsFounderSettingsOpen(false)} 
      />
      <BetaFeedbackModal 
        isOpen={isBetaFeedbackOpen} 
        onClose={() => setIsBetaFeedbackOpen(false)} 
      />

      {/* Kronometre & Seans Tamamlama */}
      <ReadingTimerModal />
      <SessionSummaryModal />

      {/* Bildirim Kutusu (Toast) */}
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
