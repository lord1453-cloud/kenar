import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Image, Modal, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useMobile } from '../context/MobileContext';
import { colors } from '../theme/colors';

export const LibraryScreen = () => {
  const { 
    books, 
    userBooks, 
    updateBookProgress, 
    setActiveTab, 
    setActiveTimerBook, 
    setTimerStartPage,
    showToast
  } = useMobile();

  const [searchQuery, setSearchQuery] = useState('');
  const [activeShelf, setActiveShelf] = useState('all'); // 'all' | 'reading' | 'read' | 'want_to_read'
  const [selectedBook, setSelectedBook] = useState(null);
  const [editPage, setEditPage] = useState('');

  const shelves = [
    { id: 'all', label: 'Tümü' },
    { id: 'reading', label: 'Okunuyor' },
    { id: 'read', label: 'Okundu' },
    { id: 'want_to_read', label: 'İstek Listesi' }
  ];

  // Kitap filtreleme
  const filteredBooks = (books || []).filter(book => {
    const matchesSearch = !searchQuery.trim() || 
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (book.genre && book.genre.toLowerCase().includes(searchQuery.toLowerCase()));

    if (!matchesSearch) return false;
    if (activeShelf === 'all') return true;

    const ub = (userBooks || []).find(u => u.bookId === book.id);
    if (activeShelf === 'reading') return ub && ub.status === 'reading';
    if (activeShelf === 'read') return ub && ub.status === 'read';
    if (activeShelf === 'want_to_read') return ub && ub.status === 'want_to_read';
    return true;
  });

  const openProgressModal = (ub, book) => {
    setSelectedBook({ ub, book });
    setEditPage(String(ub?.currentPage || 0));
  };

  const handleSaveProgress = () => {
    if (selectedBook) {
      updateBookProgress(selectedBook.book.id, editPage);
      setSelectedBook(null);
    }
  };

  const startReadingThisBook = (book, ub) => {
    setActiveTimerBook(book);
    setTimerStartPage(ub?.currentPage || 0);
    setActiveTab('live');
  };

  return (
    <View style={styles.container}>
      {/* 1. ARAMA VE BAŞLIK ALANI (Prototip Ekran 2) */}
      <View style={styles.searchHeader}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={17} color="rgba(60, 60, 67, 0.45)" />
          <TextInput
            style={styles.searchInput}
            placeholder="Kitap, yazar veya edebiyat türü ara..."
            placeholderTextColor="rgba(60, 60, 67, 0.4)"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={17} color="rgba(60, 60, 67, 0.4)" />
            </TouchableOpacity>
          )}
        </View>

        {/* Segment Tabs (Pills) */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.segmentRow}>
          {shelves.map(shelf => {
            const isActive = activeShelf === shelf.id;
            return (
              <TouchableOpacity
                key={shelf.id}
                style={[styles.segmentBtn, isActive && styles.segmentBtnActive]}
                onPress={() => setActiveShelf(shelf.id)}
                activeOpacity={0.7}
              >
                <Text style={[styles.segmentBtnText, isActive && styles.segmentBtnTextActive]}>
                  {shelf.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* 2. KİTAP LİSTESİ */}
      <ScrollView contentContainerStyle={styles.listContent}>
        {filteredBooks.length > 0 ? (
          filteredBooks.map(book => {
            const ub = (userBooks || []).find(u => u.bookId === book.id) || {
              currentPage: 0,
              totalPages: book.pages || 350,
              status: 'want_to_read'
            };

            const progressPct = Math.min(100, Math.round(((ub.currentPage || 0) / (ub.totalPages || book.pages || 350)) * 100));

            return (
              <View key={book.id} style={styles.bookCard}>
                <Image 
                  source={{ uri: book.coverUrl || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=300&h=450&q=80' }} 
                  style={styles.coverImage} 
                />

                <View style={styles.bookMeta}>
                  <View style={styles.bookTitleRow}>
                    <Text style={styles.bookTitle} numberOfLines={1}>{book.title}</Text>
                    
                    {/* iOS Status Badge */}
                    {ub.status === 'reading' && (
                      <View style={styles.badgeBlue}>
                        <Text style={styles.badgeBlueText}>Okunuyor</Text>
                      </View>
                    )}
                    {ub.status === 'read' && (
                      <View style={styles.badgeGreen}>
                        <Text style={styles.badgeGreenText}>Okundu</Text>
                      </View>
                    )}
                    {ub.status === 'want_to_read' && (
                      <View style={styles.badgePurple}>
                        <Text style={styles.badgePurpleText}>İstek</Text>
                      </View>
                    )}
                  </View>

                  <Text style={styles.bookAuthor}>{book.author} • {book.pages || 350} sayfa</Text>

                  {/* İlerleme Çubuğu */}
                  <View style={styles.progressSection}>
                    <View style={styles.progressTrack}>
                      <View style={[styles.progressFill, { width: `${Math.max(4, progressPct)}%` }]} />
                    </View>
                    <View style={styles.progressInfoRow}>
                      <Text style={styles.progressText}>
                        {ub.currentPage || 0} / {ub.totalPages || book.pages || 350} sayfa
                      </Text>
                      <Text style={styles.progressPctText}>%{progressPct}</Text>
                    </View>
                  </View>

                  {/* Butonlar */}
                  <View style={styles.bookCardActions}>
                    <TouchableOpacity
                      style={styles.actionBtnPrimary}
                      onPress={() => startReadingThisBook(book, ub)}
                      activeOpacity={0.8}
                    >
                      <Ionicons name="play" size={13} color="#fff" />
                      <Text style={styles.actionBtnPrimaryText}>Okumaya Başla</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.actionBtnSecondary}
                      onPress={() => openProgressModal(ub, book)}
                      activeOpacity={0.8}
                    >
                      <Ionicons name="bookmark-outline" size={13} color="#007AFF" />
                      <Text style={styles.actionBtnSecondaryText}>Sayfa Güncelle</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            );
          })
        ) : (
          <View style={styles.emptyBox}>
            <Ionicons name="book-outline" size={44} color="rgba(60,60,67,0.3)" />
            <Text style={styles.emptyTitle}>Kitap Bulunamadı</Text>
            <Text style={styles.emptySub}>Arama filtrenizi değiştirerek tekrar deneyebilirsiniz.</Text>
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
        <View style={styles.progressModalOverlay}>
          <View style={styles.progressModalCard}>
            <Text style={styles.progressModalTitle}>İlerlemeyi Güncelle</Text>
            <Text style={styles.progressModalSub}>
              {selectedBook?.book.title} kitabında kaçıncı sayfadasınız?
            </Text>

            <TextInput
              style={styles.progressInput}
              keyboardType="number-pad"
              value={editPage}
              onChangeText={setEditPage}
              placeholder="Sayfa numarası"
              autoFocus
            />

            <View style={styles.progressModalActions}>
              <TouchableOpacity 
                style={styles.cancelModalBtn}
                onPress={() => setSelectedBook(null)}
              >
                <Text style={styles.cancelModalBtnText}>Vazgeç</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.saveModalBtn}
                onPress={handleSaveProgress}
              >
                <Text style={styles.saveModalBtnText}>Kaydet</Text>
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
    backgroundColor: '#F2F2F7'
  },
  searchHeader: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 14,
    paddingTop: 10,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(60, 60, 67, 0.12)'
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(120, 120, 128, 0.1)',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginBottom: 10
  },
  searchInput: {
    flex: 1,
    fontSize: 13.5,
    color: '#000000',
    padding: 0
  },
  segmentRow: {
    flexDirection: 'row'
  },
  segmentBtn: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: 'rgba(120, 120, 128, 0.08)',
    marginRight: 8
  },
  segmentBtnActive: {
    backgroundColor: '#007AFF'
  },
  segmentBtnText: {
    fontSize: 12.5,
    fontWeight: '600',
    color: 'rgba(60, 60, 67, 0.7)'
  },
  segmentBtnTextActive: {
    color: '#FFFFFF'
  },

  listContent: {
    padding: 14,
    paddingBottom: 40
  },
  bookCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(60, 60, 67, 0.16)',
    padding: 12,
    marginBottom: 12,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1.5 },
    shadowOpacity: 0.04,
    shadowRadius: 5,
    elevation: 2
  },
  coverImage: {
    width: 60,
    height: 88,
    borderRadius: 6,
    backgroundColor: '#8B4A34'
  },
  bookMeta: {
    flex: 1,
    justifyContent: 'space-between'
  },
  bookTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 6
  },
  bookTitle: {
    fontSize: 14.5,
    fontWeight: '700',
    color: '#000000',
    flex: 1
  },
  bookAuthor: {
    fontSize: 12,
    color: 'rgba(60, 60, 67, 0.6)',
    marginTop: 2
  },

  badgeBlue: {
    backgroundColor: 'rgba(0, 122, 255, 0.12)',
    borderColor: 'rgba(0, 122, 255, 0.3)',
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 2
  },
  badgeBlueText: {
    color: '#007AFF',
    fontSize: 10.5,
    fontWeight: '700'
  },
  badgeGreen: {
    backgroundColor: 'rgba(52, 199, 89, 0.14)',
    borderColor: 'rgba(52, 199, 89, 0.3)',
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 2
  },
  badgeGreenText: {
    color: '#34C759',
    fontSize: 10.5,
    fontWeight: '700'
  },
  badgePurple: {
    backgroundColor: 'rgba(175, 82, 222, 0.14)',
    borderColor: 'rgba(175, 82, 222, 0.3)',
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 2
  },
  badgePurpleText: {
    color: '#AF52DE',
    fontSize: 10.5,
    fontWeight: '700'
  },

  progressSection: {
    marginVertical: 6
  },
  progressTrack: {
    height: 5,
    backgroundColor: 'rgba(120, 120, 128, 0.12)',
    borderRadius: 3,
    overflow: 'hidden'
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#007AFF',
    borderRadius: 3
  },
  progressInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 3
  },
  progressText: {
    fontSize: 10.5,
    color: 'rgba(60, 60, 67, 0.5)'
  },
  progressPctText: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#007AFF'
  },

  bookCardActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 4
  },
  actionBtnPrimary: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#007AFF',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 5
  },
  actionBtnPrimaryText: {
    color: '#FFFFFF',
    fontSize: 11.5,
    fontWeight: '700'
  },
  actionBtnSecondary: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(0, 122, 255, 0.1)',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 5
  },
  actionBtnSecondaryText: {
    color: '#007AFF',
    fontSize: 11.5,
    fontWeight: '700'
  },

  emptyBox: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000000',
    marginTop: 10
  },
  emptySub: {
    fontSize: 12.5,
    color: 'rgba(60, 60, 67, 0.6)',
    marginTop: 4,
    textAlign: 'center',
    maxWidth: 260
  },

  // Modal
  progressModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20
  },
  progressModalCard: {
    width: '100%',
    maxWidth: 320,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20
  },
  progressModalTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#000000',
    textAlign: 'center'
  },
  progressModalSub: {
    fontSize: 12.5,
    color: 'rgba(60, 60, 67, 0.6)',
    textAlign: 'center',
    marginTop: 6,
    marginBottom: 16
  },
  progressInput: {
    backgroundColor: 'rgba(120, 120, 128, 0.08)',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(60, 60, 67, 0.15)',
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    fontWeight: '700',
    color: '#000000',
    textAlign: 'center',
    marginBottom: 16
  },
  progressModalActions: {
    flexDirection: 'row',
    gap: 10
  },
  cancelModalBtn: {
    flex: 1,
    backgroundColor: 'rgba(120, 120, 128, 0.1)',
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center'
  },
  cancelModalBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#000000'
  },
  saveModalBtn: {
    flex: 1,
    backgroundColor: '#007AFF',
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center'
  },
  saveModalBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF'
  }
});
