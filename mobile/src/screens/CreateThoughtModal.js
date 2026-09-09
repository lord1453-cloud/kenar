import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  Modal, 
  StyleSheet, 
  ScrollView, 
  Image, 
  Switch, 
  KeyboardAvoidingView, 
  Platform 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useMobile } from '../context/MobileContext';
import { colors } from '../theme/colors';

export const CreateThoughtModal = () => {
  const { 
    isCreateThoughtOpen, 
    setIsCreateThoughtOpen, 
    currentUser, 
    books, 
    addPost,
    setActiveTab 
  } = useMobile();

  const [content, setContent] = useState('');
  const [selectedBook, setSelectedBook] = useState(books && books.length > 0 ? books[0] : null);
  const [page, setPage] = useState('');
  const [isSpoiler, setIsSpoiler] = useState(false);

  const handleClose = () => {
    setIsCreateThoughtOpen(false);
  };

  const handleSubmit = () => {
    if (!content.trim()) return;

    addPost({
      content: content.trim(),
      bookTitle: selectedBook?.title || 'Okuma Notu',
      bookAuthor: selectedBook?.author || '',
      bookCover: selectedBook?.coverUrl || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=300&h=450&q=80',
      page: page ? parseInt(page, 10) : null,
      isSpoiler
    });

    // Temizle ve Ana Sayfadaki Akışa Yönlendir
    setContent('');
    setPage('');
    setIsSpoiler(false);
    setIsCreateThoughtOpen(false);
    setActiveTab('home');
  };

  const isValid = content.trim().length > 0;

  return (
    <Modal
      visible={isCreateThoughtOpen}
      transparent
      animationType="slide"
      onRequestClose={handleClose}
    >
      <KeyboardAvoidingView 
        style={styles.overlay}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.container}>
          {/* Header Bar */}
          <View style={styles.header}>
            <TouchableOpacity 
              onPress={handleClose} 
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              style={styles.cancelBtn}
            >
              <Text style={styles.cancelBtnText}>Vazgeç</Text>
            </TouchableOpacity>

            <View style={styles.titleWrapper}>
              <Text style={styles.title}>Düşünce Paylaş</Text>
              <Text style={styles.subTitle}>Kenar Notu</Text>
            </View>

            <TouchableOpacity 
              onPress={handleSubmit} 
              disabled={!isValid}
              style={[styles.submitBtn, !isValid && styles.submitBtnDisabled]}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Text style={[styles.submitBtnText, !isValid && styles.submitBtnTextDisabled]}>
                Paylaş
              </Text>
            </TouchableOpacity>
          </View>

          <ScrollView 
            style={styles.body} 
            contentContainerStyle={styles.bodyContent}
            keyboardShouldPersistTaps="handled"
          >
            {/* Kullanıcı Bilgisi */}
            <View style={styles.userRow}>
              <Image 
                source={{ uri: currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&h=200&q=80' }} 
                style={styles.avatar} 
              />
              <View style={styles.userMeta}>
                <Text style={styles.userName}>{currentUser?.fullName || 'Kitap Kulübü Okuru'}</Text>
                <View style={styles.privacyBadge}>
                  <Ionicons name="globe-outline" size={11} color="rgba(60,60,67,0.6)" />
                  <Text style={styles.privacyText}>Topluluk Akışında Paylaşılır</Text>
                </View>
              </View>
            </View>

            {/* Düşünce / Alıntı Metin Alanı */}
            <TextInput
              style={styles.contentInput}
              placeholder="Bu satırlarda zihninizde ne belirdi? Okuma notunuzu, alıntınızı veya düşüncenizi paylaşın..."
              placeholderTextColor="rgba(60,60,67,0.4)"
              value={content}
              onChangeText={setContent}
              multiline
              autoFocus
              textAlignVertical="top"
            />

            {/* Kitap Seçimi */}
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>İlgili Kitap</Text>
              <Text style={styles.sectionHint}>İsteğe bağlı</Text>
            </View>

            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false} 
              contentContainerStyle={styles.booksRow}
            >
              {books && books.map(book => {
                const isSelected = selectedBook?.id === book.id;
                return (
                  <TouchableOpacity
                    key={book.id}
                    style={[styles.bookPill, isSelected && styles.bookPillSelected]}
                    onPress={() => setSelectedBook(isSelected ? null : book)}
                    activeOpacity={0.7}
                  >
                    <Image 
                      source={{ uri: book.coverUrl }} 
                      style={styles.bookPillCover} 
                    />
                    <View style={styles.bookPillMeta}>
                      <Text 
                        style={[styles.bookPillTitle, isSelected && styles.bookPillTitleSelected]} 
                        numberOfLines={1}
                      >
                        {book.title}
                      </Text>
                      <Text style={styles.bookPillAuthor} numberOfLines={1}>
                        {book.author}
                      </Text>
                    </View>
                    {isSelected && (
                      <Ionicons name="checkmark-circle" size={16} color="#007AFF" style={styles.checkIcon} />
                    )}
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            {/* Sayfa No ve Spoiler Koruma Ayarları */}
            <View style={styles.metaRow}>
              {/* Sayfa Numarası */}
              <View style={styles.pageInputContainer}>
                <Ionicons name="bookmark-outline" size={16} color="#007AFF" />
                <TextInput
                  style={styles.pageInput}
                  placeholder="Sayfa (örn. 142)"
                  placeholderTextColor="rgba(60,60,67,0.4)"
                  value={page}
                  onChangeText={setPage}
                  keyboardType="number-pad"
                />
              </View>

              {/* Spoiler Switch */}
              <View style={styles.spoilerRow}>
                <View>
                  <Text style={styles.spoilerLabel}>Spoiler İçerir</Text>
                  <Text style={styles.spoilerSub}>İçerik bulanıklaşır</Text>
                </View>
                <Switch
                  value={isSpoiler}
                  onValueChange={setIsSpoiler}
                  trackColor={{ false: 'rgba(120,120,128,0.2)', true: '#FF9500' }}
                  thumbColor="#FFFFFF"
                />
              </View>
            </View>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    justifyContent: 'flex-end'
  },
  container: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '90%',
    minHeight: 480,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 8
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(60, 60, 67, 0.12)'
  },
  cancelBtn: {
    paddingVertical: 4,
    paddingHorizontal: 4
  },
  cancelBtnText: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '500'
  },
  titleWrapper: {
    alignItems: 'center'
  },
  title: {
    fontSize: 17,
    fontWeight: '700',
    color: '#000000'
  },
  subTitle: {
    fontSize: 11,
    color: 'rgba(60, 60, 67, 0.6)',
    marginTop: 1
  },
  submitBtn: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: 18
  },
  submitBtnDisabled: {
    backgroundColor: 'rgba(0, 122, 255, 0.2)'
  },
  submitBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700'
  },
  submitBtnTextDisabled: {
    color: 'rgba(255, 255, 255, 0.6)'
  },
  body: {
    flex: 1
  },
  bodyContent: {
    padding: 16,
    paddingBottom: 36
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 14
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#8B4A34'
  },
  userMeta: {
    flex: 1
  },
  userName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#000000'
  },
  privacyBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2
  },
  privacyText: {
    fontSize: 11.5,
    color: 'rgba(60, 60, 67, 0.6)'
  },
  contentInput: {
    backgroundColor: '#F2F2F7',
    borderRadius: 14,
    padding: 14,
    fontSize: 15,
    color: '#000000',
    minHeight: 120,
    lineHeight: 22,
    borderWidth: 1,
    borderColor: 'rgba(60, 60, 67, 0.08)',
    marginBottom: 18
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10
  },
  sectionTitle: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#000000'
  },
  sectionHint: {
    fontSize: 12,
    color: 'rgba(60, 60, 67, 0.5)'
  },
  booksRow: {
    gap: 10,
    paddingBottom: 16
  },
  bookPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#F2F2F7',
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: 'transparent',
    maxWidth: 210
  },
  bookPillSelected: {
    backgroundColor: 'rgba(0, 122, 255, 0.08)',
    borderColor: '#007AFF'
  },
  bookPillCover: {
    width: 26,
    height: 38,
    borderRadius: 4
  },
  bookPillMeta: {
    flex: 1
  },
  bookPillTitle: {
    fontSize: 12.5,
    fontWeight: '600',
    color: '#000000'
  },
  bookPillTitleSelected: {
    color: '#007AFF'
  },
  bookPillAuthor: {
    fontSize: 10.5,
    color: 'rgba(60, 60, 67, 0.6)',
    marginTop: 1
  },
  checkIcon: {
    marginLeft: 2
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 14,
    marginTop: 6
  },
  pageInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#F2F2F7',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderWidth: 1,
    borderColor: 'rgba(60, 60, 67, 0.08)'
  },
  pageInput: {
    flex: 1,
    fontSize: 13,
    color: '#000000'
  },
  spoilerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#F2F2F7',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: 'rgba(60, 60, 67, 0.08)'
  },
  spoilerLabel: {
    fontSize: 12.5,
    fontWeight: '600',
    color: '#000000'
  },
  spoilerSub: {
    fontSize: 10,
    color: 'rgba(60, 60, 67, 0.5)'
  }
});
