import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Image, Modal, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useMobile } from '../context/MobileContext';
import { colors } from '../theme/colors';

export const LibraryScreen = () => {
  const { books, userBooks, updateBookProgress, setActiveTab, setActiveTimerBook, setTimerStartPage } = useMobile();

  const [activeShelf, setActiveShelf] = useState('reading'); // 'reading' | 'read' | 'want_to_read'
  const [selectedBook, setSelectedBook] = useState(null);
  const [editPage, setEditPage] = useState('');

  const shelves = [
    { id: 'reading', label: 'Okunuyor' },
    { id: 'read', label: 'Okundu' },
    { id: 'want_to_read', label: 'Okunacak' }
  ];

  // Filtrelenen kitaplar
  const filteredUserBooks = userBooks.filter(ub => ub.status === activeShelf);

  const openProgressModal = (ub, book) => {
    setSelectedBook({ ub, book });
    setEditPage(String(ub.currentPage));
  };

  const handleSaveProgress = () => {
    if (selectedBook) {
      updateBookProgress(selectedBook.book.id, editPage);
      setSelectedBook(null);
    }
  };

  const startReadingThisBook = (book, ub) => {
    setActiveTimerBook(book);
    setTimerStartPage(ub.currentPage);
    setActiveTab('live');
  };

  return (
    <View style={styles.container}>
      {/* Raf Seçici Sekmeler */}
      <View style={styles.shelfTabsRow}>
        {shelves.map(shelf => {
          const count = userBooks.filter(ub => ub.status === shelf.id).length;
          const isActive = activeShelf === shelf.id;
          return (
            <TouchableOpacity
              key={shelf.id}
              style={[styles.shelfTab, isActive && styles.shelfTabActive]}
              onPress={() => setActiveShelf(shelf.id)}
            >
              <Text style={[styles.shelfTabText, isActive && styles.shelfTabTextActive]}>
                {shelf.label} ({count})
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Kitap Listesi */}
      <ScrollView contentContainerStyle={styles.listContent}>
        {filteredUserBooks.length > 0 ? (
          filteredUserBooks.map(ub => {
            const book = books.find(b => b.id === ub.bookId) || {
              title: 'Bilinmeyen Kitap',
              author: 'Bilinmeyen Yazar',
              pages: ub.totalPages,
              coverUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=300&h=450&q=80'
            };

            const progressPct = Math.min(100, Math.round((ub.currentPage / ub.totalPages) * 100));

            return (
              <View key={ub.id} style={styles.bookCard}>
                <Image source={{ uri: book.coverUrl }} style={styles.coverImage} />

                <View style={styles.bookMeta}>
                  <Text style={styles.bookTitle}>{book.title}</Text>
                  <Text style={styles.bookAuthor}>{book.author}</Text>

                  {/* İlerleme Çubuğu */}
                  <View style={styles.progressSection}>
                    <View style={styles.progressTrack}>
                      <View style={[styles.progressFill, { width: `${progressPct}%` }]} />
                    </View>
                    <View style={styles.progressInfoRow}>
                      <Text style={styles.progressText}>
                        {ub.currentPage} / {ub.totalPages} sayfa
                      </Text>
                      <Text style={styles.progressPctText}>%{progressPct}</Text>
                    </View>
                  </View>

                  {/* Butonlar */}
                  <View style={styles.bookActions}>
                    <TouchableOpacity
                      style={styles.updateProgressBtn}
                      onPress={() => openProgressModal(ub, book)}
                    >
                      <Ionicons name="pencil" size={12} color={colors.textMain} />
                      <Text style={styles.updateProgressText}>İlerleme</Text>
                    </TouchableOpacity>

                    {activeShelf === 'reading' && (
                      <TouchableOpacity
                        style={styles.readNowBtn}
                        onPress={() => startReadingThisBook(book, ub)}
                      >
                        <Ionicons name="play" size={11} color="#fff" />
                        <Text style={styles.readNowText}>Oku</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              </View>
            );
          })
        ) : (
          <View style={styles.emptyContainer}>
            <Ionicons name="library-outline" size={44} color={colors.textDim} style={{ marginBottom: 10 }} />
            <Text style={styles.emptyTitle}>Bu rafta henüz kitap yok</Text>
            <Text style={styles.emptyDesc}>Web veya mobilde eklediğiniz tüm kitaplar burada ortak olarak listelenir.</Text>
          </View>
        )}
      </ScrollView>

      {/* Sayfa İlerlemesi Güncelleme Modalı */}
      <Modal
        visible={!!selectedBook}
        transparent
        animationType="fade"
        onRequestClose={() => setSelectedBook(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Sayfa İlerlemesini Güncelle</Text>
            <Text style={styles.modalSub}>{selectedBook?.book.title}</Text>

            <View style={styles.pageInputRow}>
              <Text style={styles.inputLabel}>Okunan Sayfa:</Text>
              <TextInput
                style={styles.textInput}
                keyboardType="numeric"
                value={editPage}
                onChangeText={setEditPage}
                placeholder="Örn: 240"
                placeholderTextColor={colors.textDim}
              />
              <Text style={styles.maxPagesText}>/ {selectedBook?.ub.totalPages}</Text>
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => setSelectedBook(null)}
              >
                <Text style={styles.cancelBtnText}>Vazgeç</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.saveBtn}
                onPress={handleSaveProgress}
              >
                <Text style={styles.saveBtnText}>Kaydet</Text>
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
    backgroundColor: colors.bgApp
  },
  shelfTabsRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderSubtle
  },
  shelfTab: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: colors.bgCard,
    borderWidth: 1,
    borderColor: colors.borderSubtle
  },
  shelfTabActive: {
    backgroundColor: colors.primaryLight,
    borderColor: colors.primary
  },
  shelfTabText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textDim
  },
  shelfTabTextActive: {
    color: colors.primary,
    fontWeight: '700'
  },
  listContent: {
    padding: 16,
    paddingBottom: 40
  },
  bookCard: {
    backgroundColor: colors.bgCard,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    padding: 12,
    flexDirection: 'row',
    marginBottom: 12,
    gap: 12
  },
  coverImage: {
    width: 65,
    height: 95,
    borderRadius: 8,
    backgroundColor: colors.bgElevated
  },
  bookMeta: {
    flex: 1,
    justifyContent: 'space-between'
  },
  bookTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textMain
  },
  bookAuthor: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 2
  },
  progressSection: {
    marginVertical: 6
  },
  progressTrack: {
    height: 5,
    backgroundColor: colors.bgElevated,
    borderRadius: 3,
    overflow: 'hidden'
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary
  },
  progressInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4
  },
  progressText: {
    fontSize: 10,
    color: colors.textDim
  },
  progressPctText: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.primary
  },
  bookActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  updateProgressBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.bgElevated,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6
  },
  updateProgressText: {
    fontSize: 11,
    color: colors.textMain,
    fontWeight: '600'
  },
  readNowBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.primary,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6
  },
  readNowText: {
    fontSize: 11,
    color: '#fff',
    fontWeight: '700'
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 30
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textMain,
    marginBottom: 4
  },
  emptyDesc: {
    fontSize: 12,
    color: colors.textDim,
    textAlign: 'center',
    lineHeight: 18
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
    fontSize: 16,
    fontWeight: '700',
    color: colors.textMain
  },
  modalSub: {
    fontSize: 12,
    color: colors.primary,
    marginBottom: 14
  },
  pageInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 18
  },
  inputLabel: {
    fontSize: 12,
    color: colors.textMain,
    fontWeight: '600'
  },
  textInput: {
    backgroundColor: colors.bgInput,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    paddingHorizontal: 10,
    paddingVertical: 6,
    color: colors.textMain,
    fontSize: 15,
    width: 80,
    textAlign: 'center'
  },
  maxPagesText: {
    fontSize: 12,
    color: colors.textDim
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10
  },
  cancelBtn: {
    paddingVertical: 8,
    paddingHorizontal: 12
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
