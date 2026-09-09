import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useMobile } from '../context/MobileContext';
import { colors } from '../theme/colors';

export const ThoughtsScreen = () => {
  const { currentUser, books, showToast } = useMobile();

  const [newThought, setNewThought] = useState('');
  const [selectedBook, setSelectedBook] = useState(books[0]);
  const [pageNumber, setPageNumber] = useState('345');

  const [quotes, setQuotes] = useState([
    {
      id: 'q-1',
      text: 'İnsan yalnızca anladığı şeyleri evcilleştirebilir. İnsanların artık hiçbir şeyi anlayacak vakitleri yok.',
      author: 'Antoine de Saint-Exupéry',
      book: 'Küçük Prens',
      sharedBy: 'Zeynep Demir',
      likes: 18
    },
    {
      id: 'q-2',
      text: 'Geçmişi denetim altında tutan geleceği de denetim altında tutar. Şimdiyi denetim altında tutan geçmişi de denetim altında tutar.',
      author: 'George Orwell',
      book: '1984',
      sharedBy: 'Kitap Kulübü Kurucusu',
      likes: 24
    },
    {
      id: 'q-3',
      text: 'Gerçek keşif yolculuğu yeni topraklar aramak değil, yeni gözlerle bakmaktır.',
      author: 'Marcel Proust',
      book: 'Kayıp Zamanın İzinde',
      sharedBy: 'Can Kaya',
      likes: 14
    }
  ]);

  const handleShare = () => {
    if (!newThought.trim()) return;
    const item = {
      id: `q-${Date.now()}`,
      text: newThought.trim(),
      author: selectedBook?.author || 'Bilinmeyen Yazar',
      book: `${selectedBook?.title || 'Kitap'} (s. ${pageNumber || '1'})`,
      sharedBy: currentUser?.fullName || 'Okur',
      likes: 1
    };
    setQuotes([item, ...quotes]);
    setNewThought('');
    showToast('Düşünceniz okurlarla paylaşıldı.');
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Yeni Düşünce Paylaşım Alanı */}
      <View style={styles.composerCard}>
        <View style={styles.composerHeader}>
          <Ionicons name="create-outline" size={18} color={colors.primary} />
          <Text style={styles.composerTitle}>Okuma Notu veya Düşünce</Text>
        </View>

        <TextInput
          style={styles.input}
          placeholder="Bu satırlarda zihninizde ne belirdi?.."
          placeholderTextColor={colors.textDim}
          multiline
          numberOfLines={3}
          value={newThought}
          onChangeText={setNewThought}
        />

        <View style={styles.composerFooter}>
          <View style={styles.bookSelector}>
            <Ionicons name="book-outline" size={13} color={colors.textMuted} />
            <Text style={styles.bookSelectorText} numberOfLines={1}>
              {selectedBook?.title || 'Kitap Seçin'} (s. {pageNumber})
            </Text>
          </View>

          <TouchableOpacity
            style={[styles.shareBtn, !newThought.trim() && styles.shareBtnDisabled]}
            onPress={handleShare}
            disabled={!newThought.trim()}
          >
            <Ionicons name="send" size={13} color="#fff" />
            <Text style={styles.shareBtnText}>Paylaş</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Alıntılar Başlığı */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Seçkin Kitap Alıntıları</Text>
      </View>

      {/* Alıntı Kartları */}
      {quotes.map(q => (
        <View key={q.id} style={styles.quoteCard}>
          <View style={styles.quoteIconBadge}>
            <Ionicons name="quote" size={16} color={colors.star} />
          </View>
          <Text style={styles.quoteText}>"{q.text}"</Text>

          <View style={styles.quoteMetaRow}>
            <View>
              <Text style={styles.quoteAuthor}>{q.author}</Text>
              <Text style={styles.quoteBook}>{q.book} • Paylaşan: {q.sharedBy}</Text>
            </View>

            <TouchableOpacity style={styles.likeBadge}>
              <Ionicons name="heart" size={13} color={colors.danger} />
              <Text style={styles.likeCount}>{q.likes}</Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}
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
  composerCard: {
    backgroundColor: colors.bgCard,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    padding: 14,
    marginBottom: 20
  },
  composerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10
  },
  composerTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textMain
  },
  input: {
    backgroundColor: colors.bgInput,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    padding: 10,
    color: colors.textMain,
    fontSize: 13,
    minHeight: 70,
    textAlignVertical: 'top'
  },
  composerFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10
  },
  bookSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.bgElevated,
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 8
  },
  bookSelectorText: {
    fontSize: 11,
    color: colors.textMuted,
    fontWeight: '500'
  },
  shareBtn: {
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8
  },
  shareBtnDisabled: {
    opacity: 0.5
  },
  shareBtnText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700'
  },
  sectionHeader: {
    marginBottom: 12
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textMain
  },
  quoteCard: {
    backgroundColor: colors.bgCard,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    padding: 16,
    marginBottom: 14,
    position: 'relative'
  },
  quoteIconBadge: {
    marginBottom: 8
  },
  quoteText: {
    fontSize: 14,
    lineHeight: 22,
    color: colors.textMain,
    fontStyle: 'italic',
    marginBottom: 12
  },
  quoteMetaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    borderTopWidth: 1,
    borderTopColor: colors.borderSubtle,
    paddingTop: 10
  },
  quoteAuthor: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primary
  },
  quoteBook: {
    fontSize: 11,
    color: colors.textDim,
    marginTop: 2
  },
  likeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.bgElevated,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12
  },
  likeCount: {
    fontSize: 11,
    color: colors.textMain,
    fontWeight: '600'
  }
});
