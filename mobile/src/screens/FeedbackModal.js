import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useMobile } from '../context/MobileContext';
import { mobileApi } from '../api/client';
import { colors } from '../theme/colors';

export const FeedbackModal = () => {
  const { isFeedbackOpen, setIsFeedbackOpen, activeTab, betaInfo, showToast } = useMobile();

  const [description, setDescription] = useState('');
  const [selectedScreen, setSelectedScreen] = useState('Canlı Okuma');
  const [hasAttachedImage, setHasAttachedImage] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const screens = ['Ana Sayfa', 'Düşünceler', 'Canlı Okuma', 'Kitaplığım', 'Profil', 'Odalar'];

  const handleSubmit = async () => {
    if (!description.trim()) return;

    setSubmitting(true);
    const res = await mobileApi.sendFeedback({
      description: description.trim(),
      screen: selectedScreen,
      screenshotUrl: hasAttachedImage ? 'mock_mobile_screenshot.png' : null
    });

    setSubmitting(false);
    setIsFeedbackOpen(false);
    setDescription('');
    setHasAttachedImage(false);

    showToast('Hata bildiriminiz kurucuya iletildi. Teşekkür ederiz! 🐞');
  };

  return (
    <Modal
      visible={isFeedbackOpen}
      transparent
      animationType="slide"
      onRequestClose={() => setIsFeedbackOpen(false)}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.titleRow}>
              <Ionicons name="bug" size={20} color={colors.star} />
              <Text style={styles.title}>Beta Hata & Geri Bildirim</Text>
            </View>
            <TouchableOpacity onPress={() => setIsFeedbackOpen(false)}>
              <Ionicons name="close" size={22} color={colors.textDim} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.body}>
            {/* Platform & Sürüm Bilgisi Rozeti */}
            <View style={styles.metaRow}>
              <View style={styles.metaBadge}>
                <Ionicons
                  name={betaInfo.platform === 'ios' ? 'logo-apple' : 'logo-android'}
                  size={14}
                  color="#fff"
                />
                <Text style={styles.metaBadgeText}>
                  {betaInfo.platform === 'ios' ? 'iOS TestFlight' : 'Android Internal'}
                </Text>
              </View>
              <Text style={styles.versionText}>v{betaInfo.version}</Text>
            </View>

            {/* Bulunulan Ekran Seçici */}
            <Text style={styles.label}>Hata hangi ekranda gerçekleşti?</Text>
            <View style={styles.screenSelectorRow}>
              {screens.map(s => {
                const isSelected = selectedScreen === s;
                return (
                  <TouchableOpacity
                    key={s}
                    style={[styles.screenChip, isSelected && styles.screenChipSelected]}
                    onPress={() => setSelectedScreen(s)}
                  >
                    <Text style={[styles.screenChipText, isSelected && styles.screenChipTextSelected]}>
                      {s}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Hata Açıklaması */}
            <Text style={styles.label}>Hata Açıklaması *</Text>
            <TextInput
              style={styles.textArea}
              multiline
              numberOfLines={4}
              placeholder="Karşılaştığınız sorunu veya önerinizi kısaca anlatınız..."
              placeholderTextColor={colors.textDim}
              value={description}
              onChangeText={setDescription}
            />

            {/* Ekran Görüntüsü İliştirme */}
            <TouchableOpacity
              style={[styles.attachBtn, hasAttachedImage && styles.attachBtnActive]}
              onPress={() => setHasAttachedImage(!hasAttachedImage)}
            >
              <Ionicons
                name={hasAttachedImage ? 'checkmark-circle' : 'image-outline'}
                size={18}
                color={hasAttachedImage ? colors.success : colors.textMuted}
              />
              <Text style={[styles.attachBtnText, hasAttachedImage && { color: colors.success }]}>
                {hasAttachedImage ? '✓ Ekran Görüntüsü Eklendi' : '+ Ekran Görüntüsü İliştir'}
              </Text>
            </TouchableOpacity>

            <Text style={styles.noticeText}>
              * Bu rapor otomatik olarak cihaz bilgisi, platform ve sürümünüzle birlikte backend'e iletilecektir.
            </Text>
          </ScrollView>

          {/* Footer Buttons */}
          <View style={styles.footer}>
            <TouchableOpacity
              style={styles.cancelBtn}
              onPress={() => setIsFeedbackOpen(false)}
            >
              <Text style={styles.cancelBtnText}>Vazgeç</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.submitBtn, (!description.trim() || submitting) && styles.submitBtnDisabled]}
              onPress={handleSubmit}
              disabled={!description.trim() || submitting}
            >
              <Text style={styles.submitBtnText}>
                {submitting ? 'Gönderiliyor...' : 'Raporu Gönder'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'flex-end'
  },
  container: {
    backgroundColor: colors.bgCard,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '85%',
    borderWidth: 1,
    borderColor: colors.borderSubtle
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderSubtle
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textMain
  },
  body: {
    padding: 16
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.bgElevated,
    padding: 10,
    borderRadius: 10,
    marginBottom: 16
  },
  metaBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6
  },
  metaBadgeText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '700'
  },
  versionText: {
    color: colors.textDim,
    fontSize: 12,
    fontWeight: '600'
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textMain,
    marginBottom: 8
  },
  screenSelectorRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 16
  },
  screenChip: {
    backgroundColor: colors.bgElevated,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.borderSubtle
  },
  screenChipSelected: {
    backgroundColor: colors.primaryLight,
    borderColor: colors.primary
  },
  screenChipText: {
    fontSize: 11,
    color: colors.textDim,
    fontWeight: '500'
  },
  screenChipTextSelected: {
    color: colors.primary,
    fontWeight: '700'
  },
  textArea: {
    backgroundColor: colors.bgInput,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    padding: 12,
    color: colors.textMain,
    fontSize: 13,
    minHeight: 90,
    textAlignVertical: 'top',
    marginBottom: 14
  },
  attachBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: colors.bgElevated,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    borderStyle: 'dashed',
    paddingVertical: 10,
    borderRadius: 10,
    marginBottom: 14
  },
  attachBtnActive: {
    borderColor: colors.success,
    backgroundColor: colors.successLight
  },
  attachBtnText: {
    fontSize: 12,
    color: colors.textMuted,
    fontWeight: '600'
  },
  noticeText: {
    fontSize: 10,
    color: colors.textDim,
    lineHeight: 14,
    marginBottom: 20
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: colors.borderSubtle
  },
  cancelBtn: {
    paddingVertical: 10,
    paddingHorizontal: 14
  },
  cancelBtnText: {
    color: colors.textMuted,
    fontSize: 13
  },
  submitBtn: {
    backgroundColor: colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 10
  },
  submitBtnDisabled: {
    opacity: 0.5
  },
  submitBtnText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '700'
  }
});
