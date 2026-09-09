import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useMobile } from '../context/MobileContext';
import { colors } from '../theme/colors';

export const ProfileScreen = () => {
  const { 
    currentUser, 
    betaInfo, 
    setIsFeedbackOpen, 
    setIsAdminOpen, 
    logout 
  } = useMobile();

  const isFounderOrAdmin = currentUser?.role === 'founder' || currentUser?.role === 'admin';

  const totalHours = Math.floor(((currentUser?.totalReadingSeconds || 0)) / 3600);
  const totalMins = Math.floor(((currentUser?.totalReadingSeconds || 0) % 3600) / 60);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Profil Başlığı */}
      <View style={styles.profileHeader}>
        <Image source={{ uri: currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150' }} style={styles.avatar} />
        <View style={styles.profileMeta}>
          <View style={styles.nameRow}>
            <Text style={styles.fullName}>{currentUser?.fullName || 'Okur'}</Text>
            {currentUser?.role === 'founder' && (
              <View style={styles.founderBadge}>
                <Text style={styles.founderBadgeText}>★ Kurucu</Text>
              </View>
            )}
            {currentUser?.role === 'admin' && (
              <View style={styles.adminBadge}>
                <Text style={styles.adminBadgeText}>Admin</Text>
              </View>
            )}
          </View>
          <Text style={styles.username}>@{currentUser?.username || 'okur'}</Text>
          <Text style={styles.bio}>{currentUser?.bio || 'Kitap kurdu'}</Text>
        </View>
      </View>

      {/* Okuma İstatistikleri */}
      <View style={styles.statsRow}>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>{totalHours}s {totalMins}d</Text>
          <Text style={styles.statLabel}>Toplam Okuma</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>{currentUser?.streak || 0} Gün</Text>
          <Text style={styles.statLabel}>Okuma Serisi</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>{currentUser?.readingGoal || 20}</Text>
          <Text style={styles.statLabel}>Yıllık Hedef</Text>
        </View>
      </View>

      {/* Beta Sürüm & Hata Bildirimi Bölümü */}
      <View style={styles.betaCard}>
        <View style={styles.betaCardHeader}>
          <View style={styles.betaTitleRow}>
            <Ionicons name="shield-outline" size={16} color={colors.star} />
            <Text style={styles.betaCardTitle}>Özel Beta Test Sürümü</Text>
          </View>
          <View style={styles.versionBadge}>
            <Text style={styles.versionText}>{betaInfo?.appVersion || 'v0.1.0'}</Text>
          </View>
        </View>
        <Text style={styles.betaCardDesc}>
          Kitap Kulübü kapalı beta testindesiniz. Karşılaştığınız hata veya önerileri doğrudan iletebilirsiniz.
        </Text>
        <TouchableOpacity 
          style={styles.feedbackActionBtn}
          onPress={() => setIsFeedbackOpen(true)}
        >
          <Ionicons name="bug-outline" size={16} color="#fff" />
          <Text style={styles.feedbackBtnText}>Geri Bildirim / Hata Bildir</Text>
        </TouchableOpacity>
      </View>

      {/* Menü Öğeleri */}
      <Text style={styles.sectionHeading}>HESAP VE AYARLAR</Text>

      {/* Beta Geri Bildirim */}
      <TouchableOpacity
        style={styles.menuItem}
        onPress={() => setIsFeedbackOpen(true)}
      >
        <View style={styles.menuLeft}>
          <View style={[styles.menuIconCircle, { backgroundColor: 'rgba(245, 158, 11, 0.15)' }]}>
            <Ionicons name="bug" size={18} color="#f59e0b" />
          </View>
          <View>
            <Text style={styles.menuTitle}>Beta Hata Bildir & Öneri</Text>
            <Text style={styles.menuSubtitle}>Kurucuya anlık log ve geri bildirim ilet</Text>
          </View>
        </View>
        <Ionicons name="chevron-forward" size={18} color={colors.textDim} />
      </TouchableOpacity>

      {/* Yönetim Paneli (Kurucu ve Admin'e özel) */}
      {isFounderOrAdmin && (
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => setIsAdminOpen(true)}
        >
          <View style={styles.menuLeft}>
            <View style={[styles.menuIconCircle, { backgroundColor: colors.dangerLight }]}>
              <Ionicons name="shield-half" size={18} color={colors.danger} />
            </View>
            <View>
              <Text style={styles.menuTitle}>Kapalı Beta Yönetim Paneli</Text>
              <Text style={styles.menuSubtitle}>Kullanıcılar, bildirimler ve yetkiler</Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={18} color={colors.textDim} />
        </TouchableOpacity>
      )}

      {/* Tek Hesap: Çıkış Yap */}
      <TouchableOpacity
        style={styles.menuItem}
        onPress={logout}
      >
        <View style={styles.menuLeft}>
          <View style={[styles.menuIconCircle, { backgroundColor: 'rgba(239, 68, 68, 0.12)' }]}>
            <Ionicons name="log-out-outline" size={18} color={colors.danger} />
          </View>
          <View>
            <Text style={[styles.menuTitle, { color: colors.danger }]}>Oturumu Kapat (Çıkış Yap)</Text>
            <Text style={styles.menuSubtitle}>Hesaptan çıkış yaparak beta kapısına dön</Text>
          </View>
        </View>
        <Ionicons name="chevron-forward" size={18} color={colors.textDim} />
      </TouchableOpacity>

      {/* Platform & Ortam Dipnotu */}
      <View style={styles.footerNote}>
        <Text style={styles.footerText}>
          Platform: {betaInfo.platform.toUpperCase()} • Ortam: {betaInfo.environment.toUpperCase()}
        </Text>
        <Text style={styles.footerTextSub}>Kitap Kulübü Cross-Platform İstemcisi</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgApp
  },
  content: {
    padding: 16,
    paddingBottom: 40
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    gap: 14
  },
  avatar: {
    width: 68,
    height: 68,
    borderRadius: 34,
    borderWidth: 2,
    borderColor: colors.border
  },
  profileMeta: {
    flex: 1
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  fullName: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.textMain
  },
  founderBadge: {
    backgroundColor: colors.starLight,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6
  },
  founderBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: colors.star
  },
  adminBadge: {
    backgroundColor: colors.primaryLight,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6
  },
  adminBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.primary
  },
  username: {
    fontSize: 12,
    color: colors.textDim,
    marginTop: 2
  },
  bio: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 6,
    lineHeight: 16
  },
  statsRow: {
    flexDirection: 'row',
    backgroundColor: colors.bgCard,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    paddingVertical: 14,
    marginBottom: 20
  },
  statBox: {
    flex: 1,
    alignItems: 'center'
  },
  statNumber: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.textMain
  },
  statLabel: {
    fontSize: 11,
    color: colors.textDim,
    marginTop: 2
  },
  betaCard: {
    backgroundColor: colors.bgCard,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.25)',
    padding: 16,
    marginBottom: 16
  },
  betaCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8
  },
  betaTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6
  },
  betaCardTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textMain
  },
  versionBadge: {
    backgroundColor: colors.starLight,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8
  },
  versionText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.star
  },
  betaCardDesc: {
    fontSize: 12,
    color: colors.textMuted,
    lineHeight: 17,
    marginBottom: 14
  },
  feedbackActionBtn: {
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 10,
    borderRadius: 10
  },
  feedbackBtnText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '700'
  },
  menuItem: {
    backgroundColor: colors.bgCard,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10
  },
  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12
  },
  menuIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center'
  },
  menuTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textMain
  },
  menuSubtitle: {
    fontSize: 11,
    color: colors.textDim,
    marginTop: 2
  },
  footerNote: {
    alignItems: 'center',
    marginTop: 20
  },
  footerText: {
    fontSize: 11,
    color: colors.textDim,
    fontWeight: '600'
  },
  footerTextSub: {
    fontSize: 10,
    color: colors.textDim,
    marginTop: 2
  }
});
