import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Image, Modal, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useMobile } from '../context/MobileContext';
import { colors } from '../theme/colors';

const BANNER_THEMES = [
  { id: 'terracotta', name: 'Terracotta & Adaçayı', color: '#8B4A34', secondary: '#455C46' },
  { id: 'obsidian', name: 'Obsidiyen Gece', color: '#1A1A24', secondary: '#2D3748' },
  { id: 'emerald', name: 'Zümrüt Arşiv', color: '#064E3B', secondary: '#047857' },
  { id: 'sunset', name: 'Günbatımı Kehribar', color: '#7C2D12', secondary: '#B45309' },
  { id: 'lavender', name: 'Kraliyet Lavanta', color: '#4C1D95', secondary: '#6D28D9' },
  { id: 'navy', name: 'Gece Mavisi', color: '#0F172A', secondary: '#1E3A8A' }
];

const PRESET_AVATARS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&h=300&q=80',
  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&h=300&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&h=300&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&h=300&q=80',
  'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=300&h=300&q=80',
  'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=300&h=300&q=80'
];

const GENRES = [
  'Bilim Kurgu & Distopya',
  'Dünya Klasikleri',
  'Felsefe & Düşünce',
  'Şiir & Edebi Notlar',
  'Polisiye & Gizem',
  'Tarih & Biyografi'
];

export const ProfileScreen = () => {
  const { 
    currentUser, 
    updateProfile,
    userBooks,
    showToast
  } = useMobile();

  // Profil Özelleştirme Modal State'i
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editFullName, setEditFullName] = useState(currentUser?.fullName || '');
  const [editMotto, setEditMotto] = useState(currentUser?.motto || 'Kitaplar, zihnin sonsuz pencereleridir.');
  const [editBio, setEditBio] = useState(currentUser?.bio || 'Kitap kurdu ve edebiyat tutkunu.');
  const [editAvatar, setEditAvatar] = useState(currentUser?.avatar || PRESET_AVATARS[0]);
  const [editTheme, setEditTheme] = useState(currentUser?.coverTheme || 'terracotta');
  const [editGoal, setEditGoal] = useState(currentUser?.readingGoal || 36);
  const [editGenre, setEditGenre] = useState(currentUser?.favoriteGenre || 'Bilim Kurgu & Distopya');

  // Süre formatlayıcı
  const totalHours = Math.floor(((currentUser?.totalReadingSeconds || 0)) / 3600);
  const totalMins = Math.floor(((currentUser?.totalReadingSeconds || 0) % 3600) / 60);

  // Aktif Banner Rengi
  const activeThemeObj = BANNER_THEMES.find(t => t.id === (currentUser?.coverTheme || 'terracotta')) || BANNER_THEMES[0];

  const handleOpenEdit = () => {
    setEditFullName(currentUser?.fullName || '');
    setEditMotto(currentUser?.motto || 'Kitaplar, zihnin sonsuz pencereleridir.');
    setEditBio(currentUser?.bio || '');
    setEditAvatar(currentUser?.avatar || PRESET_AVATARS[0]);
    setEditTheme(currentUser?.coverTheme || 'terracotta');
    setEditGoal(currentUser?.readingGoal || 36);
    setEditGenre(currentUser?.favoriteGenre || 'Bilim Kurgu & Distopya');
    setIsEditModalOpen(true);
  };

  const handleSaveProfile = () => {
    updateProfile({
      fullName: editFullName.trim() || currentUser?.fullName,
      motto: editMotto.trim(),
      bio: editBio.trim(),
      avatar: editAvatar,
      coverTheme: editTheme,
      readingGoal: parseInt(editGoal, 10) || 36,
      favoriteGenre: editGenre
    });
    setIsEditModalOpen(false);
  };

  const completedCount = (userBooks || []).filter(b => b.status === 'read').length;
  const goalProgressPercent = Math.min(100, Math.round((completedCount / (currentUser?.readingGoal || 36)) * 100));

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* 1. ÖZELLEŞTİRİLEBİLİR LÜKS BANNER */}
      <View style={[styles.coverBanner, { backgroundColor: activeThemeObj.color }]}>
        <View style={[styles.coverBannerOverlay, { backgroundColor: activeThemeObj.secondary, opacity: 0.6 }]} />
        <View style={styles.coverGenreBadge}>
          <Ionicons name="sparkles" size={11} color="#fff" />
          <Text style={styles.coverGenreText}>{currentUser?.favoriteGenre || 'Edebiyat Tutkunu'}</Text>
        </View>
      </View>

      {/* 2. PROFİL KİMLİK ALANI */}
      <View style={styles.profileCard}>
        <View style={styles.avatarRow}>
          <View style={styles.avatarContainer}>
            <Image 
              source={{ uri: currentUser?.avatar || PRESET_AVATARS[0] }} 
              style={styles.avatar} 
            />
            {currentUser?.role === 'founder' && (
              <View style={styles.founderStar}>
                <Text style={styles.founderStarText}>★</Text>
              </View>
            )}
          </View>

          <TouchableOpacity 
            style={styles.editProfileBtn}
            onPress={handleOpenEdit}
            activeOpacity={0.8}
          >
            <Ionicons name="color-palette-outline" size={15} color="#007AFF" />
            <Text style={styles.editProfileBtnText}>Profili Özelleştir</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.nameSection}>
          <View style={styles.nameRow}>
            <Text style={styles.fullName}>{currentUser?.fullName || 'Okur'}</Text>
            {currentUser?.role === 'founder' && (
              <View style={styles.badgeOrange}>
                <Text style={styles.badgeOrangeText}>★ Kurucu</Text>
              </View>
            )}
            {currentUser?.role === 'admin' && (
              <View style={styles.badgePurple}>
                <Text style={styles.badgePurpleText}>Admin</Text>
              </View>
            )}
          </View>
          <Text style={styles.username}>@{currentUser?.username || 'okur'}</Text>
        </View>

        {/* Okur Mottosu / Alıntı (Kullanıcı İsteği) */}
        <View style={styles.mottoBox}>
          <Text style={styles.mottoQuote}>“</Text>
          <Text style={styles.mottoText}>
            {currentUser?.motto || 'Kitaplar, zihnin sonsuz pencereleridir.'}
          </Text>
        </View>

        <Text style={styles.bioText}>
          {currentUser?.bio || 'Derin okumalar ve edebiyat sohbetleri.'}
        </Text>
      </View>

      {/* 3. İSTATİSTİK KARTLARI */}
      <View style={styles.statsGrid}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{completedCount}</Text>
          <Text style={styles.statLabel}>Okunan Kitap</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{currentUser?.streak || 0} Gün</Text>
          <Text style={styles.statLabel}>Okuma Serisi</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{totalHours}s {totalMins}d</Text>
          <Text style={styles.statLabel}>Toplam Süre</Text>
        </View>
      </View>

      {/* 4. YILLIK OKUMA HEDEFİ İLERLEME ÇUBUĞU */}
      <View style={styles.goalCard}>
        <View style={styles.goalHeader}>
          <View style={styles.goalTitleRow}>
            <Ionicons name="trophy" size={17} color="#FF9500" />
            <Text style={styles.goalTitle}>Yıllık Okuma Hedefi</Text>
          </View>
          <Text style={styles.goalPercent}>%{goalProgressPercent}</Text>
        </View>

        <View style={styles.progressBarTrack}>
          <View style={[styles.progressBarFill, { width: `${Math.max(5, goalProgressPercent)}%` }]} />
        </View>

        <View style={styles.goalFooter}>
          <Text style={styles.goalSubText}>
            {completedCount} / {currentUser?.readingGoal || 36} kitap tamamlandı
          </Text>
          <TouchableOpacity onPress={handleOpenEdit}>
            <Text style={styles.goalEditLink}>Hedefi Değiştir</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* 5. ÖZELLEŞTİRİLMİŞ OKUMA KÖŞELERİ / RAFLAR */}
      <View style={styles.shelvesCard}>
        <Text style={styles.shelvesTitle}>KİTAPLIK RAFLARI</Text>
        <View style={styles.shelvesList}>
          <View style={[styles.shelfChip, { backgroundColor: '#F6D3D9' }]}>
            <Text style={styles.shelfChipName}>Favorilerim</Text>
            <Text style={styles.shelfChipCount}>14 kitap</Text>
          </View>
          <View style={[styles.shelfChip, { backgroundColor: '#F5DEC0' }]}>
            <Text style={styles.shelfChipName}>Yeniden Okunacaklar</Text>
            <Text style={styles.shelfChipCount}>6 kitap</Text>
          </View>
          <View style={[styles.shelfChip, { backgroundColor: '#F5E7B8' }]}>
            <Text style={styles.shelfChipName}>Yaz Okumaları</Text>
            <Text style={styles.shelfChipCount}>9 kitap</Text>
          </View>
          <View style={[styles.shelfChip, { backgroundColor: '#E7D6F2' }]}>
            <Text style={styles.shelfChipName}>Şiir Köşem</Text>
            <Text style={styles.shelfChipCount}>5 kitap</Text>
          </View>
        </View>
      </View>

      {/* ================= PROFİL DÜZENLEME MODALI ================= */}
      <Modal
        visible={isEditModalOpen}
        animationType="slide"
        transparent
        onRequestClose={() => setIsEditModalOpen(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {/* Header */}
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Profili Özelleştir</Text>
              <TouchableOpacity onPress={() => setIsEditModalOpen(false)}>
                <Ionicons name="close" size={22} color="rgba(60,60,67,0.6)" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody}>
              {/* 1. Kapak Banner Teması Seçimi */}
              <Text style={styles.modalSectionLabel}>KAPAK BANNER TEMASI</Text>
              <View style={styles.themeGrid}>
                {BANNER_THEMES.map(theme => {
                  const isSelected = editTheme === theme.id;
                  return (
                    <TouchableOpacity
                      key={theme.id}
                      style={[
                        styles.themeItem,
                        { backgroundColor: theme.color },
                        isSelected && styles.themeItemSelected
                      ]}
                      onPress={() => setEditTheme(theme.id)}
                      activeOpacity={0.8}
                    >
                      {isSelected && (
                        <Ionicons name="checkmark" size={16} color="#fff" />
                      )}
                    </TouchableOpacity>
                  );
                })}
              </View>

              {/* 2. Avatar Seçimi */}
              <Text style={styles.modalSectionLabel}>OKUR AVATARI</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.avatarRowScroll}>
                {PRESET_AVATARS.map((av, idx) => {
                  const isSelected = editAvatar === av;
                  return (
                    <TouchableOpacity
                      key={idx}
                      style={[styles.avatarPickBtn, isSelected && styles.avatarPickBtnSelected]}
                      onPress={() => setEditAvatar(av)}
                      activeOpacity={0.8}
                    >
                      <Image source={{ uri: av }} style={styles.avatarThumb} />
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>

              {/* 3. İsim ve Soyisim */}
              <Text style={styles.modalSectionLabel}>AD SOYAD</Text>
              <TextInput
                style={styles.modalInput}
                value={editFullName}
                onChangeText={setEditFullName}
                placeholder="Adınız Soyadınız"
                placeholderTextColor="rgba(60,60,67,0.4)"
              />

              {/* 4. Okur Mottosu / Alıntı */}
              <Text style={styles.modalSectionLabel}>OKUR MOTTOSU (ALINTI)</Text>
              <TextInput
                style={styles.modalInput}
                value={editMotto}
                onChangeText={setEditMotto}
                placeholder="Örn: Kitaplar, zihnin sonsuz pencereleridir."
                placeholderTextColor="rgba(60,60,67,0.4)"
              />

              {/* 5. Biyografi */}
              <Text style={styles.modalSectionLabel}>BİYOGRAFİ</Text>
              <TextInput
                style={[styles.modalInput, { minHeight: 60, textAlignVertical: 'top' }]}
                value={editBio}
                onChangeText={setEditBio}
                placeholder="Kendinizden ve okuma zevklerinizden bahsedin..."
                placeholderTextColor="rgba(60,60,67,0.4)"
                multiline
                numberOfLines={3}
              />

              {/* 6. Yıllık Okuma Hedefi (Artı - Eksi Butonları) */}
              <Text style={styles.modalSectionLabel}>YILLIK OKUMA HEDEFİ</Text>
              <View style={styles.stepperRow}>
                <TouchableOpacity 
                  style={styles.stepperBtn}
                  onPress={() => setEditGoal(prev => Math.max(5, prev - 5))}
                  activeOpacity={0.7}
                >
                  <Ionicons name="remove" size={20} color="#007AFF" />
                </TouchableOpacity>
                <View style={styles.stepperValueBox}>
                  <Text style={styles.stepperValueText}>{editGoal} Kitap</Text>
                </View>
                <TouchableOpacity 
                  style={styles.stepperBtn}
                  onPress={() => setEditGoal(prev => Math.min(100, prev + 5))}
                  activeOpacity={0.7}
                >
                  <Ionicons name="add" size={20} color="#007AFF" />
                </TouchableOpacity>
              </View>

              {/* 7. Favori Tür Seçimi */}
              <Text style={styles.modalSectionLabel}>FAVORİ EDEBİYAT TÜRÜ</Text>
              <View style={styles.genreTagsWrap}>
                {GENRES.map(g => {
                  const isSelected = editGenre === g;
                  return (
                    <TouchableOpacity
                      key={g}
                      style={[styles.genreTag, isSelected && styles.genreTagSelected]}
                      onPress={() => setEditGenre(g)}
                      activeOpacity={0.7}
                    >
                      <Text style={[styles.genreTagText, isSelected && styles.genreTagTextSelected]}>
                        {g}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              <View style={{ height: 20 }} />
            </ScrollView>

            {/* Modal Footer */}
            <View style={styles.modalFooter}>
              <TouchableOpacity 
                style={styles.cancelBtn}
                onPress={() => setIsEditModalOpen(false)}
                activeOpacity={0.8}
              >
                <Text style={styles.cancelBtnText}>Vazgeç</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.saveBtn}
                onPress={handleSaveProfile}
                activeOpacity={0.8}
              >
                <Text style={styles.saveBtnText}>Değişiklikleri Kaydet</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7'
  },
  content: {
    paddingBottom: 40
  },

  // Banner
  coverBanner: {
    height: 140,
    width: '100%',
    position: 'relative'
  },
  coverBannerOverlay: {
    ...StyleSheet.absoluteFillObject
  },
  coverGenreBadge: {
    position: 'absolute',
    top: 14,
    right: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4
  },
  coverGenreText: {
    color: '#fff',
    fontSize: 11.5,
    fontWeight: '600'
  },

  // Profil Kimlik Kartı
  profileCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 14,
    marginTop: -40,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(60,60,67,0.16)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3
  },
  avatarRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginBottom: 10
  },
  avatarContainer: {
    position: 'relative',
    marginTop: -36
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 3,
    borderColor: '#FFFFFF',
    backgroundColor: '#8B4A34'
  },
  founderStar: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#111',
    borderRadius: 10,
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#FF9500'
  },
  founderStarText: {
    color: '#FF9500',
    fontSize: 11,
    fontWeight: '900'
  },
  editProfileBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(0, 122, 255, 0.1)',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: 'rgba(0, 122, 255, 0.25)'
  },
  editProfileBtnText: {
    color: '#007AFF',
    fontSize: 12,
    fontWeight: '700'
  },
  nameSection: {
    marginBottom: 10
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap'
  },
  fullName: {
    fontSize: 18,
    fontWeight: '800',
    color: '#000000'
  },
  username: {
    fontSize: 12.5,
    color: 'rgba(60, 60, 67, 0.5)',
    marginTop: 2
  },

  badgeOrange: {
    backgroundColor: 'rgba(255, 149, 0, 0.14)',
    borderColor: 'rgba(255, 149, 0, 0.34)',
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 2
  },
  badgeOrangeText: {
    color: '#FF9500',
    fontSize: 11,
    fontWeight: '700'
  },
  badgePurple: {
    backgroundColor: 'rgba(175, 82, 222, 0.14)',
    borderColor: 'rgba(175, 82, 222, 0.34)',
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 2
  },
  badgePurpleText: {
    color: '#AF52DE',
    fontSize: 11,
    fontWeight: '700'
  },

  mottoBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: 'rgba(120, 120, 128, 0.08)',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10
  },
  mottoQuote: {
    fontSize: 20,
    lineHeight: 20,
    color: '#007AFF',
    fontWeight: '800',
    marginRight: 6
  },
  mottoText: {
    flex: 1,
    fontSize: 13,
    fontStyle: 'italic',
    color: '#1C1C1E',
    lineHeight: 18
  },
  bioText: {
    fontSize: 13,
    color: 'rgba(60,60,67,0.7)',
    lineHeight: 18
  },

  // İstatistikler Grid
  statsGrid: {
    flexDirection: 'row',
    gap: 10,
    marginHorizontal: 14,
    marginTop: 12
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(60,60,67,0.16)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1.5 },
    shadowOpacity: 0.04,
    shadowRadius: 5,
    elevation: 2
  },
  statValue: {
    fontSize: 18,
    fontWeight: '800',
    color: '#000000'
  },
  statLabel: {
    fontSize: 11,
    color: 'rgba(60,60,67,0.5)',
    marginTop: 4,
    fontWeight: '600'
  },

  // Yıllık Hedef
  goalCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 14,
    marginTop: 12,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(60,60,67,0.16)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1.5 },
    shadowOpacity: 0.04,
    shadowRadius: 5,
    elevation: 2
  },
  goalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10
  },
  goalTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6
  },
  goalTitle: {
    fontSize: 14.5,
    fontWeight: '700',
    color: '#000000'
  },
  goalPercent: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FF9500'
  },
  progressBarTrack: {
    height: 8,
    backgroundColor: 'rgba(120, 120, 128, 0.12)',
    borderRadius: 4,
    overflow: 'hidden'
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#FF9500',
    borderRadius: 4
  },
  goalFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8
  },
  goalSubText: {
    fontSize: 11.5,
    color: 'rgba(60, 60, 67, 0.6)'
  },
  goalEditLink: {
    fontSize: 11.5,
    color: '#007AFF',
    fontWeight: '700'
  },

  // Raflar
  shelvesCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 14,
    marginTop: 12,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(60,60,67,0.16)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1.5 },
    shadowOpacity: 0.04,
    shadowRadius: 5,
    elevation: 2
  },
  shelvesTitle: {
    fontSize: 11.5,
    fontWeight: '700',
    color: 'rgba(60, 60, 67, 0.5)',
    letterSpacing: 0.5,
    marginBottom: 12
  },
  shelvesList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8
  },
  shelfChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10
  },
  shelfChipName: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#2C1810'
  },
  shelfChipCount: {
    fontSize: 10.5,
    color: 'rgba(44, 24, 16, 0.6)',
    marginTop: 2
  },

  // Modal Stilleri
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'flex-end'
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '85%',
    paddingBottom: 24
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(60,60,67,0.12)'
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#000000'
  },
  modalBody: {
    padding: 16
  },
  modalSectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: 'rgba(60,60,67,0.5)',
    letterSpacing: 0.5,
    marginTop: 12,
    marginBottom: 8
  },
  themeGrid: {
    flexDirection: 'row',
    gap: 10,
    flexWrap: 'wrap'
  },
  themeItem: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center'
  },
  themeItemSelected: {
    borderWidth: 3,
    borderColor: '#007AFF'
  },
  avatarRowScroll: {
    flexDirection: 'row',
    marginBottom: 4
  },
  avatarPickBtn: {
    padding: 3,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: 'transparent',
    marginRight: 8
  },
  avatarPickBtnSelected: {
    borderColor: '#007AFF'
  },
  avatarThumb: {
    width: 44,
    height: 44,
    borderRadius: 22
  },
  modalInput: {
    backgroundColor: 'rgba(120, 120, 128, 0.08)',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(60, 60, 67, 0.12)',
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 13.5,
    color: '#000000'
  },
  stepperRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12
  },
  stepperBtn: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: 'rgba(0, 122, 255, 0.12)',
    alignItems: 'center',
    justifyContent: 'center'
  },
  stepperValueBox: {
    flex: 1,
    backgroundColor: 'rgba(120, 120, 128, 0.08)',
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center'
  },
  stepperValueText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#000000'
  },
  genreTagsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8
  },
  genreTag: {
    backgroundColor: 'rgba(120, 120, 128, 0.08)',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6
  },
  genreTagSelected: {
    backgroundColor: '#007AFF'
  },
  genreTagText: {
    fontSize: 12,
    color: 'rgba(60, 60, 67, 0.8)',
    fontWeight: '600'
  },
  genreTagTextSelected: {
    color: '#FFFFFF'
  },
  modalFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(60,60,67,0.12)'
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: 'rgba(120, 120, 128, 0.1)',
    alignItems: 'center'
  },
  cancelBtnText: {
    fontSize: 13.5,
    fontWeight: '600',
    color: '#000000'
  },
  saveBtn: {
    flex: 2,
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: '#007AFF',
    alignItems: 'center'
  },
  saveBtnText: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#FFFFFF'
  }
});
