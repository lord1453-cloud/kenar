import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Image, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useMobile } from '../context/MobileContext';
import { colors } from '../theme/colors';

export const HomeScreen = () => {
  const { 
    currentUser, 
    setActiveTab, 
    showToast, 
    setIsRoomsOpen, 
    setIsFeedbackOpen, 
    setIsAdminOpen 
  } = useMobile();

  const isPrivileged = currentUser?.role === 'founder' || currentUser?.role === 'admin';

  const [newThought, setNewThought] = useState('');
  const [thoughtBookTitle, setThoughtBookTitle] = useState('Dune');
  const [thoughtPage, setThoughtPage] = useState('');

  const [posts, setPosts] = useState([
    {
      id: 'p-1',
      userName: currentUser?.fullName || 'Kitap Kulübü Kurucusu',
      userRole: currentUser?.role || 'founder',
      avatar: currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&h=200&q=80',
      bookTitle: 'Dune',
      bookAuthor: 'Frank Herbert',
      content: 'Korku akıl katilidir. Korku, mutlak yok oluşu getiren küçük ölümdür. Herbert\'ın bu cümlesi her okumada daha da derinleşiyor.',
      likes: 12,
      isLiked: false,
      comments: 3,
      page: 342,
      timeAgo: '15 dk önce'
    },
    {
      id: 'p-2',
      userName: 'Zeynep Demir',
      userRole: 'admin',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&h=200&q=80',
      bookTitle: '1984',
      bookAuthor: 'George Orwell',
      content: 'Bilinçleninceye kadar asla başkaldıramayacaklar, başkaldırmadıkça da bilinçlenemezler.',
      likes: 8,
      isLiked: true,
      comments: 1,
      page: 120,
      timeAgo: '1 saat önce'
    },
    {
      id: 'p-3',
      userName: 'Can Kaya',
      userRole: 'user',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&h=200&q=80',
      bookTitle: 'Körlük',
      bookAuthor: 'José Saramago',
      content: 'Noktalama işaretlerinin olmaması ilk 30 sayfada zorluyor ama sonra akış müthiş bir ritim kazanıyor.',
      likes: 5,
      isLiked: false,
      comments: 2,
      page: 85,
      timeAgo: '3 saat önce'
    }
  ]);

  const toggleLike = (id) => {
    setPosts(prev => prev.map(p => {
      if (p.id === id) {
        const nextLiked = !p.isLiked;
        return {
          ...p,
          isLiked: nextLiked,
          likes: nextLiked ? p.likes + 1 : p.likes - 1
        };
      }
      return p;
    }));
  };

  const handleShareThought = () => {
    if (!newThought || !newThought.trim()) return;
    const newPost = {
      id: `p-${Date.now()}`,
      userName: currentUser?.fullName || 'Kitap Kulübü Okuru',
      userRole: currentUser?.role || 'user',
      avatar: currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&h=200&q=80',
      bookTitle: thoughtBookTitle || 'Okuma Notu',
      bookAuthor: '',
      content: newThought.trim(),
      likes: 0,
      isLiked: false,
      comments: 0,
      page: thoughtPage ? parseInt(thoughtPage, 10) : 1,
      timeAgo: 'Az önce'
    };
    setPosts(prev => [newPost, ...prev]);
    setNewThought('');
    setThoughtPage('');
    showToast('Kenar notunuz okur akışında paylaşıldı!');
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Günlük Okuma & Seri Kartı */}
      <View style={styles.streakCard}>
        <View style={styles.streakLeft}>
          <View style={styles.flameIcon}>
            <Ionicons name="flame" size={24} color={colors.star} />
          </View>
          <View>
            <Text style={styles.streakTitle}>{currentUser?.streak || 0} Günlük Okuma Serisi</Text>
            <Text style={styles.streakSubtitle}>Bugün 26 dk okundu • Hedef: 30 dk</Text>
          </View>
        </View>
        <TouchableOpacity
          style={styles.startReadingBtn}
          onPress={() => setActiveTab('live')}
          activeOpacity={0.8}
        >
          <Ionicons name="play" size={14} color="#fff" />
          <Text style={styles.startReadingText}>Oku</Text>
        </TouchableOpacity>
      </View>

      {/* Başparmakla Ulaşılabilir Hızlı Erişim Paneli */}
      <View style={styles.quickHubCard}>
        <Text style={styles.quickHubHeaderTitle}>HIZLI ERİŞİM</Text>
        <View style={styles.quickHubGrid}>
          <TouchableOpacity 
            style={styles.quickHubBtn}
            onPress={() => setIsRoomsOpen(true)}
            activeOpacity={0.7}
          >
            <View style={[styles.quickHubIconBox, { backgroundColor: 'rgba(59, 130, 246, 0.15)' }]}>
              <Ionicons name="chatbubbles" size={20} color="#60a5fa" />
            </View>
            <Text style={styles.quickHubBtnTitle}>Sohbet Odaları</Text>
            <Text style={styles.quickHubBtnDesc}>Kitap kulüpleri</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.quickHubBtn}
            onPress={() => setActiveTab('thoughts')}
            activeOpacity={0.7}
          >
            <View style={[styles.quickHubIconBox, { backgroundColor: 'rgba(236, 72, 153, 0.15)' }]}>
              <Ionicons name="chatbubble-ellipses" size={20} color="#f472b6" />
            </View>
            <Text style={styles.quickHubBtnTitle}>Alıntılar</Text>
            <Text style={styles.quickHubBtnDesc}>Düşünce paylaş</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.quickHubBtn}
            onPress={() => setIsFeedbackOpen(true)}
            activeOpacity={0.7}
          >
            <View style={[styles.quickHubIconBox, { backgroundColor: 'rgba(245, 158, 11, 0.15)' }]}>
              <Ionicons name="bug" size={20} color="#f59e0b" />
            </View>
            <Text style={styles.quickHubBtnTitle}>Hata Bildir</Text>
            <Text style={styles.quickHubBtnDesc}>Beta desteği</Text>
          </TouchableOpacity>

          {isPrivileged && (
            <TouchableOpacity 
              style={styles.quickHubBtn}
              onPress={() => setIsAdminOpen(true)}
              activeOpacity={0.7}
            >
              <View style={[styles.quickHubIconBox, { backgroundColor: 'rgba(239, 68, 68, 0.15)' }]}>
                <Ionicons name="shield-checkmark" size={20} color="#ef4444" />
              </View>
              <Text style={styles.quickHubBtnTitle}>Yönetim</Text>
              <Text style={styles.quickHubBtnDesc}>Kurucu paneli</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* ÜSTTE DÜŞÜNCE / KENAR NOTU PAYLAŞMA KARTI */}
      <View style={styles.composerCard}>
        <View style={styles.composerHeader}>
          <Image 
            source={{ uri: currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&h=200&q=80' }} 
            style={styles.composerAvatar} 
          />
          <View style={styles.composerMeta}>
            <Text style={styles.composerTitle}>Kenar Notu veya Düşünce Paylaş</Text>
            <Text style={styles.composerSubtitle}>{currentUser?.fullName || 'Kitap Kulübü Okuru'}</Text>
          </View>
        </View>

        <TextInput
          style={styles.composerInput}
          placeholder="Bu satırlarda zihninizde ne belirdi? Okuma notunuzu paylaşın..."
          placeholderTextColor={colors.textDim}
          value={newThought}
          onChangeText={setNewThought}
          multiline
          numberOfLines={3}
        />

        <View style={styles.composerFooter}>
          <View style={styles.composerMetaInputs}>
            <TextInput
              style={styles.composerBookInput}
              placeholder="Kitap Adı"
              placeholderTextColor={colors.textDim}
              value={thoughtBookTitle}
              onChangeText={setThoughtBookTitle}
            />
            <TextInput
              style={styles.composerPageInput}
              placeholder="s. no"
              placeholderTextColor={colors.textDim}
              value={thoughtPage}
              onChangeText={setThoughtPage}
              keyboardType="number-pad"
            />
          </View>

          <TouchableOpacity
            style={[styles.composerShareBtn, !newThought.trim() && { opacity: 0.5 }]}
            onPress={handleShareThought}
            disabled={!newThought.trim()}
            activeOpacity={0.8}
          >
            <Ionicons name="send" size={13} color="#fff" />
            <Text style={styles.composerShareBtnText}>Paylaş</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Akış Başlığı */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Okur Akışı</Text>
        <Text style={styles.sectionBadge}>Canlı Paylaşımlar</Text>
      </View>

      {/* Gönderiler */}
      {posts.map(post => (
        <View key={post.id} style={styles.postCard}>
          {/* Post Header */}
          <View style={styles.postHeader}>
            <Image source={{ uri: post.avatar }} style={styles.avatar} />
            <View style={styles.postUserMeta}>
              <View style={styles.userNameRow}>
                <Text style={styles.userName}>{post.userName}</Text>
                {post.userRole === 'founder' && (
                  <Text style={styles.founderTag}>★ Founder</Text>
                )}
                {post.userRole === 'admin' && (
                  <Text style={styles.adminTag}>Admin</Text>
                )}
              </View>
              <Text style={styles.postTime}>{post.timeAgo}</Text>
            </View>

            {/* Book Pill */}
            <View style={styles.bookTag}>
              <Ionicons name="bookmark" size={11} color={colors.primary} />
              <Text style={styles.bookTagText} numberOfLines={1}>
                {post.bookTitle} (s. {post.page})
              </Text>
            </View>
          </View>

          {/* Post Content */}
          <Text style={styles.postBody}>{post.content}</Text>

          {/* Actions */}
          <View style={styles.postActions}>
            <TouchableOpacity
              style={styles.actionBtn}
              onPress={() => toggleLike(post.id)}
            >
              <Ionicons
                name={post.isLiked ? 'heart' : 'heart-outline'}
                size={18}
                color={post.isLiked ? colors.danger : colors.textDim}
              />
              <Text style={[styles.actionText, post.isLiked && { color: colors.danger }]}>
                {post.likes}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionBtn}
              onPress={() => showToast('Yorumlar açılıyor...')}
            >
              <Ionicons name="chatbubble-outline" size={16} color={colors.textDim} />
              <Text style={styles.actionText}>{post.comments}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionBtn}
              onPress={() => showToast('Düşünce kaydedildi')}
            >
              <Ionicons name="share-outline" size={17} color={colors.textDim} />
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
  streakCard: {
    backgroundColor: colors.bgCard,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20
  },
  streakLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12
  },
  flameIcon: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: colors.starLight,
    alignItems: 'center',
    justifyContent: 'center'
  },
  streakTitle: {
    color: colors.textMain,
    fontSize: 14,
    fontWeight: '700'
  },
  streakSubtitle: {
    color: colors.textDim,
    fontSize: 11,
    marginTop: 2
  },
  startReadingBtn: {
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10
  },
  startReadingText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '700'
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textMain
  },
  sectionBadge: {
    fontSize: 11,
    color: colors.primary,
    fontWeight: '600'
  },
  postCard: {
    backgroundColor: colors.bgCard,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    padding: 14,
    marginBottom: 14
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 10
  },
  postUserMeta: {
    flex: 1
  },
  userNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6
  },
  userName: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textMain
  },
  founderTag: {
    fontSize: 10,
    fontWeight: '800',
    color: colors.star,
    backgroundColor: colors.starLight,
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 4
  },
  adminTag: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.primary,
    backgroundColor: colors.primaryLight,
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 4
  },
  postTime: {
    fontSize: 11,
    color: colors.textDim,
    marginTop: 1
  },
  bookTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.bgElevated,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    maxWidth: 130
  },
  bookTagText: {
    fontSize: 11,
    color: colors.textMuted,
    fontWeight: '500'
  },
  postBody: {
    fontSize: 14,
    color: colors.textMain,
    lineHeight: 21,
    marginBottom: 12
  },
  postActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: colors.borderSubtle
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6
  },
  actionText: {
    fontSize: 12,
    color: colors.textDim,
    fontWeight: '500'
  },
  quickHubCard: {
    backgroundColor: colors.bgCard,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    padding: 14,
    marginBottom: 16
  },
  quickHubHeaderTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textDim,
    letterSpacing: 0.5,
    marginBottom: 10
  },
  quickHubGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10
  },
  quickHubBtn: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: colors.bgElevated,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    padding: 12,
    alignItems: 'center'
  },
  quickHubIconBox: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8
  },
  quickHubBtnTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textMain,
    textAlign: 'center'
  },
  quickHubBtnDesc: {
    fontSize: 10,
    color: colors.textDim,
    marginTop: 2,
    textAlign: 'center'
  },
  composerCard: {
    backgroundColor: colors.bgCard,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    padding: 14,
    marginBottom: 16
  },
  composerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 10
  },
  composerAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primary
  },
  composerMeta: {
    flex: 1
  },
  composerTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textMain
  },
  composerSubtitle: {
    fontSize: 11,
    color: colors.textDim
  },
  composerInput: {
    backgroundColor: colors.bgElevated,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    padding: 10,
    fontSize: 13,
    color: colors.textMain,
    textAlignVertical: 'top',
    minHeight: 65,
    marginBottom: 10
  },
  composerFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8
  },
  composerMetaInputs: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flex: 1
  },
  composerBookInput: {
    flex: 2,
    backgroundColor: colors.bgElevated,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    paddingHorizontal: 8,
    paddingVertical: 5,
    fontSize: 12,
    color: colors.textMain
  },
  composerPageInput: {
    flex: 1,
    backgroundColor: colors.bgElevated,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    paddingHorizontal: 8,
    paddingVertical: 5,
    fontSize: 12,
    color: colors.textMain,
    textAlign: 'center'
  },
  composerShareBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: colors.primary,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 7
  },
  composerShareBtnText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700'
  }
});
