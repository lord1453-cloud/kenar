import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useMobile } from '../context/MobileContext';
import { colors } from '../theme/colors';

export const LiveReadingScreen = () => {
  const { 
    books, 
    timerRunning, 
    setTimerRunning, 
    timerSeconds, 
    activeTimerBook, 
    setActiveTimerBook, 
    timerStartPage, 
    setTimerStartPage,
    finishReadingSession 
  } = useMobile();

  const [isFinishModalOpen, setIsFinishModalOpen] = useState(false);
  const [endPageInput, setEndPageInput] = useState(String(timerStartPage + 10));

  // Saat:Dakika:Saniye biçimlendirici
  const formatTime = (secs) => {
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    if (h > 0) {
      return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    }
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleFinish = () => {
    setIsFinishModalOpen(false);
    finishReadingSession(endPageInput);
  };

  return (
    <View style={styles.container}>
      {/* Dikkat Dağıtmayan Üst Bilgi */}
      <View style={styles.ambientHeader}>
        <View style={styles.liveIndicator}>
          <View style={styles.livePulseDot} />
          <Text style={styles.liveText}>Canlı Okuma Odası • 4 Okur Şu An Okuyor</Text>
        </View>
      </View>

      {/* Kitap Bilgisi */}
      <View style={styles.bookInfoCard}>
        <Text style={styles.bookTitle}>{activeTimerBook.title}</Text>
        <Text style={styles.bookAuthor}>{activeTimerBook.author}</Text>
        <View style={styles.startPageBadge}>
          <Text style={styles.startPageText}>Başlangıç Sayfası: {timerStartPage}</Text>
        </View>
      </View>

      {/* Büyük Kronometre Kadranı */}
      <View style={styles.timerCircleOuter}>
        <View style={[styles.timerCircleInner, timerRunning && styles.timerCircleActive]}>
          <Text style={styles.timerDigits}>{formatTime(timerSeconds)}</Text>
          <Text style={styles.timerStatusText}>
            {timerRunning ? 'Odaklanıldı • Süre akıyor' : timerSeconds > 0 ? 'Duraklatıldı' : 'Başlamaya Hazır'}
          </Text>
        </View>
      </View>

      {/* Kontrol Düğmeleri */}
      <View style={styles.controlsRow}>
        {/* Başlat / Duraklat Butonu */}
        <TouchableOpacity
          style={[styles.mainBtn, timerRunning ? styles.pauseBtn : styles.playBtn]}
          onPress={() => setTimerRunning(!timerRunning)}
          activeOpacity={0.8}
        >
          <Ionicons
            name={timerRunning ? 'pause' : 'play'}
            size={28}
            color="#fff"
          />
          <Text style={styles.mainBtnText}>
            {timerRunning ? 'Duraklat' : timerSeconds > 0 ? 'Devam Et' : 'Okumaya Başla'}
          </Text>
        </TouchableOpacity>

        {/* Bitir Butonu (Süre akmışsa) */}
        {timerSeconds > 0 && (
          <TouchableOpacity
            style={styles.finishBtn}
            onPress={() => setIsFinishModalOpen(true)}
            activeOpacity={0.8}
          >
            <Ionicons name="checkmark-circle-outline" size={22} color={colors.success} />
            <Text style={styles.finishBtnText}>Seansı Bitir</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Seans Bitirme Modalı */}
      <Modal
        visible={isFinishModalOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setIsFinishModalOpen(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Okuma Seansını Kaydet</Text>
            <Text style={styles.modalDesc}>
              Okunan süre: <strong>{Math.floor(timerSeconds / 60)} dakika</strong>
            </Text>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Kaçıncı sayfada kaldınız?</Text>
              <TextInput
                style={styles.pageInput}
                keyboardType="numeric"
                value={endPageInput}
                onChangeText={setEndPageInput}
                placeholder="Örn: 355"
                placeholderTextColor={colors.textDim}
              />
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => setIsFinishModalOpen(false)}
              >
                <Text style={styles.cancelBtnText}>Vazgeç</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.saveBtn}
                onPress={handleFinish}
              >
                <Text style={styles.saveBtnText}>Kaydet & Bitir</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgApp,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 24,
    paddingHorizontal: 20
  },
  ambientHeader: {
    alignItems: 'center'
  },
  liveIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.bgCard,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.borderSubtle
  },
  livePulseDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.success
  },
  liveText: {
    fontSize: 11,
    color: colors.textMuted,
    fontWeight: '600'
  },
  bookInfoCard: {
    alignItems: 'center',
    marginTop: 10
  },
  bookTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.textMain,
    textAlign: 'center'
  },
  bookAuthor: {
    fontSize: 14,
    color: colors.textMuted,
    marginTop: 4
  },
  startPageBadge: {
    backgroundColor: colors.bgElevated,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    marginTop: 8
  },
  startPageText: {
    fontSize: 11,
    color: colors.textDim
  },
  timerCircleOuter: {
    width: 240,
    height: 240,
    borderRadius: 120,
    backgroundColor: colors.bgCard,
    borderWidth: 2,
    borderColor: colors.borderSubtle,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 8
  },
  timerCircleInner: {
    width: 216,
    height: 216,
    borderRadius: 108,
    backgroundColor: colors.bgElevated,
    alignItems: 'center',
    justifyContent: 'center'
  },
  timerCircleActive: {
    borderColor: colors.primary,
    borderWidth: 2
  },
  timerDigits: {
    fontSize: 44,
    fontWeight: '800',
    color: colors.textMain,
    letterSpacing: 2
  },
  timerStatusText: {
    fontSize: 11,
    color: colors.textDim,
    marginTop: 6
  },
  controlsRow: {
    width: '100%',
    alignItems: 'center',
    gap: 12
  },
  mainBtn: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 15,
    borderRadius: 14
  },
  playBtn: {
    backgroundColor: colors.primary
  },
  pauseBtn: {
    backgroundColor: '#d97706'
  },
  mainBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700'
  },
  finishBtn: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    backgroundColor: colors.bgCard,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    borderRadius: 12
  },
  finishBtnText: {
    color: colors.success,
    fontSize: 14,
    fontWeight: '600'
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20
  },
  modalContent: {
    width: '100%',
    maxWidth: 340,
    backgroundColor: colors.bgCard,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.borderSubtle
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.textMain,
    marginBottom: 6
  },
  modalDesc: {
    fontSize: 13,
    color: colors.textMuted,
    marginBottom: 16
  },
  inputGroup: {
    marginBottom: 16
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textMain,
    marginBottom: 6
  },
  pageInput: {
    backgroundColor: colors.bgInput,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    padding: 10,
    color: colors.textMain,
    fontSize: 16
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10
  },
  cancelBtn: {
    paddingVertical: 8,
    paddingHorizontal: 14
  },
  cancelBtnText: {
    color: colors.textMuted,
    fontSize: 13
  },
  saveBtn: {
    backgroundColor: colors.primary,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8
  },
  saveBtnText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '700'
  }
});
