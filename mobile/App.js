import React from 'react';
import { View, StyleSheet, StatusBar, Text, Platform } from 'react-native';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import { MobileProvider, useMobile } from './src/context/MobileContext';
import { Header } from './src/components/common/Header';
import { BottomNav } from './src/components/navigation/BottomNav';
import { HomeScreen } from './src/screens/HomeScreen';
import { ThoughtsScreen } from './src/screens/ThoughtsScreen';
import { LiveReadingScreen } from './src/screens/LiveReadingScreen';
import { LibraryScreen } from './src/screens/LibraryScreen';
import { ProfileScreen } from './src/screens/ProfileScreen';
import { FeedbackModal } from './src/screens/FeedbackModal';
import { MobileAdminScreen } from './src/screens/MobileAdminScreen';
import { RoomsModal } from './src/screens/RoomsModal';
import { LoginModal } from './src/screens/LoginModal';
import { BetaGateScreen } from './src/screens/BetaGateScreen';
import { colors } from './src/theme/colors';

const MainNavigator = () => {
  const insets = useSafeAreaInsets();
  const { activeTab, toastMessage, isBetaUnlocked, betaAuthorized } = useMobile();

  // Android ve iOS çentik / durum çubuğu güvenli boşluğu
  const topInset = Math.max(insets.top, Platform.OS === 'android' ? (StatusBar.currentHeight || 28) : 20);
  const bottomInset = Math.max(insets.bottom, 12);

  // Kapalı Beta Kapısı (Özel İzinli Kilit)
  if (!isBetaUnlocked && !betaAuthorized) {
    return (
      <View style={[styles.rootContainer, { paddingTop: topInset, paddingBottom: bottomInset }]}>
        <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
        {toastMessage && (
          <View style={[styles.toastContainer, { top: topInset + 10 }]}>
            <Text style={styles.toastText}>{toastMessage}</Text>
          </View>
        )}
        <BetaGateScreen />
      </View>
    );
  }

  return (
    <View style={styles.rootContainer}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      
      {/* Toast Notification Banner */}
      {toastMessage && (
        <View style={[styles.toastContainer, { top: topInset + 60 }]}>
          <Text style={styles.toastText}>{toastMessage}</Text>
        </View>
      )}

      {/* Üst Başlık & Beta Rozeti */}
      <Header topInset={topInset} />

      {/* Ana İçerik Ekranları */}
      <View style={styles.screenContainer}>
        {activeTab === 'home' && <HomeScreen />}
        {activeTab === 'thoughts' && <ThoughtsScreen />}
        {activeTab === 'live' && <LiveReadingScreen />}
        {activeTab === 'library' && <LibraryScreen />}
        {activeTab === 'profile' && <ProfileScreen />}
      </View>

      {/* Alt Navigasyon Çubuğu */}
      <BottomNav bottomInset={bottomInset} />

      {/* Modallar */}
      <FeedbackModal />
      <MobileAdminScreen />
      <RoomsModal />
      <LoginModal />
    </View>
  );
};

export default function App() {
  return (
    <SafeAreaProvider>
      <MobileProvider>
        <MainNavigator />
      </MobileProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    backgroundColor: colors.bgApp
  },
  safeArea: {
    flex: 1,
    backgroundColor: colors.bgApp
  },
  screenContainer: {
    flex: 1
  },
  toastContainer: {
    position: 'absolute',
    top: 50,
    left: 20,
    right: 20,
    backgroundColor: colors.bgElevated,
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 16,
    zIndex: 9999,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
    alignItems: 'center'
  },
  toastText: {
    color: colors.textMain,
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center'
  }
});
