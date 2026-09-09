import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useMobile } from '../context/MobileContext';
import { colors } from '../theme/colors';

export const HomeScreen = () => {
  const { 
    currentUser, 
    posts,
    setPosts,
    showToast,
    setActiveTab,
    setIsCreateThoughtOpen
  } = useMobile();

  const [revealedSpoilers, setRevealedSpoilers] = useState({});

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

  const toggleSpoiler = (id) => {
    setRevealedSpoilers(prev => ({ ...prev, [id]: true }));
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* GÖNDERİ LİSTESİ */}
      {posts && posts.map(post => {
        const isRevealed = revealedSpoilers[post.id];
        const shouldBlur = post.isSpoiler && !isRevealed;

        return (
          <View 
            key={post.id} 
            style={[
              styles.postCard, 
              post.isPinned && styles.pinnedPostCard
            ]}
          >
            {/* Post Header */}
            <View style={styles.postHeader}>
              <Image source={{ uri: post.avatar }} style={styles.avatar} />
              <View style={styles.postMeta}>
                <View style={styles.nameRow}>
                  <Text style={styles.userName}>{post.userName}</Text>
                  
                  {/* iOS Pill Badges (Prototipteki exact badges) */}
                  {post.userRole === 'founder' && (
                    <View style={styles.badgeOrange}>
                      <Text style={styles.badgeOrangeText}>★ Kurucu</Text>
                    </View>
                  )}
                  {post.userRole === 'admin' && (
                    <View style={styles.badgePurple}>
                      <Text style={styles.badgePurpleText}>Admin</Text>
                    </View>
                  )}
                  {post.userRole === 'user' && (
                    <View style={styles.badgeGreen}>
                      <Text style={styles.badgeGreenText}>Okur</Text>
                    </View>
                  )}
                </View>
                <Text style={styles.timeAgo}>{post.timeAgo}</Text>
              </View>
            </View>

            {/* Pinned Title */}
            {post.isPinned && post.title && (
              <Text style={styles.pinnedTitle}>{post.title}</Text>
            )}

            {/* Post Content */}
            {shouldBlur ? (
              <TouchableOpacity 
                style={styles.spoilerBox} 
                onPress={() => toggleSpoiler(post.id)}
                activeOpacity={0.85}
              >
                <Text style={styles.blurredText} numberOfLines={2}>
                  {post.content}
                </Text>
                <View style={styles.spoilerOverlay}>
                  <Ionicons name="alert-circle" size={18} color="#FF3B30" />
                  <Text style={styles.spoilerOverlayText}>Sürprizbozan Uyarısı — Görmek için dokunun</Text>
                </View>
              </TouchableOpacity>
            ) : (
              <Text style={styles.postContent}>{post.content}</Text>
            )}

            {/* Book Chip (Prototipteki .book-chip ile birebir) */}
            {post.bookTitle && (
              <View style={styles.bookChip}>
                <Image 
                  source={{ uri: post.bookCover || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=300&h=450&q=80' }} 
                  style={styles.bookChipCover} 
                />
                <View style={styles.bookChipInfo}>
                  <Text style={styles.bookChipTitle} numberOfLines={1}>
                    {post.bookTitle} {post.page ? `(s. ${post.page})` : ''}
                  </Text>
                  <Text style={styles.bookChipAuthor} numberOfLines={1}>
                    {post.bookAuthor}
                  </Text>
                </View>
                <TouchableOpacity 
                  style={styles.bookChipAddBtn}
                  onPress={() => showToast(`"${post.bookTitle}" kitaplığınıza eklendi.`)}
                  activeOpacity={0.7}
                >
                  <Ionicons name="add" size={17} color="#007AFF" />
                </TouchableOpacity>
              </View>
            )}

            {/* Post Actions */}
            <View style={styles.postActions}>
              <TouchableOpacity 
                style={styles.actionBtn}
                onPress={() => toggleLike(post.id)}
                activeOpacity={0.7}
              >
                <Ionicons 
                  name={post.isLiked ? "heart" : "heart-outline"} 
                  size={18} 
                  color={post.isLiked ? "#FF3B30" : "rgba(60,60,67,0.6)"} 
                />
                <Text style={[styles.actionText, post.isLiked && { color: "#FF3B30", fontWeight: '700' }]}>
                  {post.likes}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.actionBtn}
                onPress={() => showToast('Yorumlar açılıyor...')}
                activeOpacity={0.7}
              >
                <Ionicons name="chatbubble-outline" size={17} color="rgba(60,60,67,0.6)" />
                <Text style={styles.actionText}>{post.comments}</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.actionBtn, { marginLeft: 'auto' }]}
                onPress={() => showToast('Bağlantı kopyalandı!')}
                activeOpacity={0.7}
              >
                <Ionicons name="share-outline" size={18} color="rgba(60,60,67,0.6)" />
              </TouchableOpacity>
            </View>
          </View>
        );
      })}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7'
  },
  content: {
    padding: 14,
    paddingBottom: 40
  },

  // 1. Üst Sabit Düşünce Paylaşım Kartı
  composerCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(60, 60, 67, 0.16)',
    padding: 14,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2
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
    backgroundColor: '#8B4A34'
  },
  composerMeta: {
    flex: 1
  },
  composerTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#000000'
  },
  composerSubtitle: {
    fontSize: 11.5,
    color: 'rgba(60, 60, 67, 0.6)'
  },
  composerInput: {
    backgroundColor: 'rgba(120, 120, 128, 0.08)',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(60, 60, 67, 0.12)',
    padding: 10,
    fontSize: 13.5,
    color: '#000000',
    textAlignVertical: 'top',
    minHeight: 65,
    lineHeight: 19
  },
  composerFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
    gap: 8
  },
  composerOptions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flex: 1
  },
  composerBookTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(0, 122, 255, 0.1)',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 5,
    maxWidth: 120
  },
  composerBookTagText: {
    fontSize: 11.5,
    fontWeight: '600',
    color: '#007AFF'
  },
  composerPageInput: {
    width: 50,
    backgroundColor: 'rgba(120, 120, 128, 0.08)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(60, 60, 67, 0.12)',
    paddingHorizontal: 6,
    paddingVertical: 4,
    fontSize: 11.5,
    color: '#000000',
    textAlign: 'center'
  },
  spoilerToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: 'rgba(120, 120, 128, 0.08)',
    borderRadius: 8,
    paddingHorizontal: 7,
    paddingVertical: 5
  },
  spoilerToggleActive: {
    backgroundColor: 'rgba(255, 59, 48, 0.12)',
    borderColor: 'rgba(255, 59, 48, 0.3)',
    borderWidth: 1
  },
  spoilerToggleText: {
    fontSize: 11,
    color: 'rgba(60, 60, 67, 0.6)',
    fontWeight: '600'
  },
  spoilerToggleTextActive: {
    color: '#FF3B30'
  },
  composerShareBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#007AFF',
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 7,
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3
  },
  composerShareBtnDisabled: {
    opacity: 0.4
  },
  composerShareBtnText: {
    color: '#FFFFFF',
    fontSize: 12.5,
    fontWeight: '700'
  },

  // 2. Post Kartları
  postCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(60, 60, 67, 0.16)',
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1.5 },
    shadowOpacity: 0.04,
    shadowRadius: 5,
    elevation: 2
  },
  pinnedPostCard: {
    borderLeftWidth: 3.5,
    borderLeftColor: '#FF9500'
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 10
  },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#8B4A34'
  },
  postMeta: {
    flex: 1
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexWrap: 'wrap'
  },
  userName: {
    fontSize: 14.5,
    fontWeight: '700',
    color: '#000000'
  },
  timeAgo: {
    fontSize: 11.5,
    color: 'rgba(60, 60, 67, 0.4)',
    marginTop: 1
  },

  // iOS Pill Badges (Prototipteki tam renkler)
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
  badgeGreen: {
    backgroundColor: 'rgba(52, 199, 89, 0.14)',
    borderColor: 'rgba(52, 199, 89, 0.34)',
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 2
  },
  badgeGreenText: {
    color: '#34C759',
    fontSize: 11,
    fontWeight: '700'
  },

  pinnedTitle: {
    fontSize: 14.5,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 6
  },
  postContent: {
    fontSize: 14,
    color: '#1C1C1E',
    lineHeight: 20
  },

  // Spoiler Box
  spoilerBox: {
    position: 'relative',
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: 'rgba(255, 59, 48, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 59, 48, 0.2)',
    padding: 12
  },
  blurredText: {
    fontSize: 14,
    color: 'rgba(60,60,67,0.4)',
    opacity: 0.2
  },
  spoilerOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.88)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 10
  },
  spoilerOverlayText: {
    color: '#FF3B30',
    fontSize: 12.5,
    fontWeight: '700'
  },

  // Prototip Book Chip (.book-chip)
  bookChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: 'rgba(120, 120, 128, 0.09)',
    borderRadius: 10,
    padding: 8,
    marginTop: 12
  },
  bookChipCover: {
    width: 32,
    height: 46,
    borderRadius: 4,
    backgroundColor: '#8B4A34'
  },
  bookChipInfo: {
    flex: 1
  },
  bookChipTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#000000'
  },
  bookChipAuthor: {
    fontSize: 11.5,
    color: 'rgba(60, 60, 67, 0.6)',
    marginTop: 2
  },
  bookChipAddBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: 'rgba(60, 60, 67, 0.16)',
    alignItems: 'center',
    justifyContent: 'center'
  },

  // Actions
  postActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 22,
    marginTop: 14,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: 'rgba(60, 60, 67, 0.1)'
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6
  },
  actionText: {
    fontSize: 12.5,
    color: 'rgba(60, 60, 67, 0.65)',
    fontWeight: '600'
  }
});
