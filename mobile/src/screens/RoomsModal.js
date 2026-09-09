import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet, ScrollView, TextInput, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useMobile } from '../context/MobileContext';
import { colors } from '../theme/colors';

export const RoomsModal = () => {
  const { isRoomsOpen, setIsRoomsOpen, currentUser, showToast } = useMobile();

  const [activeRoom, setActiveRoom] = useState(null);
  const [messageText, setMessageText] = useState('');
  const [isSpoilerMsg, setIsSpoilerMsg] = useState(false);
  const [revealedSpoilers, setRevealedSpoilers] = useState({});

  // 4 Temel Prototip Odası (Screen 4)
  const [rooms, setRooms] = useState([
    {
      id: 'r-1',
      name: 'Bilim Kurgu & Distopya',
      bookTitle: 'Dune — Frank Herbert',
      coverBg: '#8B4A34',
      coverSecondary: '#455C46',
      desc: 'Frank Herbert, Philip K. Dick ve Asimov okumaları.',
      participants: 6,
      ambient: 'Sessiz Rüzgar',
      coverImg: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=300&h=450&q=80',
      messages: [
        { id: 'm-1', user: 'Ayşe Yılmaz', role: 'founder', text: 'Dune 3. kısıma başladım, arrakis betimlemeleri muazzam.', time: '20:12' },
        { id: 'm-2', user: 'Zeynep Demir', role: 'admin', text: 'Harika bir bölüm, çöl gezegeninin ekolojisi harika kurgulanmış!', time: '20:14' },
        { id: 'm-3', user: 'Can Kaya', role: 'user', text: 'Paul Atreides\'in iç monologları özellikle 140. sayfadan sonra çok derinleşiyor.', time: '20:18', isSpoiler: true }
      ]
    },
    {
      id: 'r-2',
      name: 'Dünya Klasikleri',
      bookTitle: 'Suç ve Ceza — Dostoyevski',
      coverBg: '#455C46',
      coverSecondary: '#2C3E2D',
      desc: 'Dostoyevski, Tolstoy ve dünya edebiyatı tahlilleri.',
      participants: 4,
      ambient: 'Kütüphane Ambiyansı',
      coverImg: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=300&h=450&q=80',
      messages: [
        { id: 'm-4', user: 'Can Kaya', role: 'user', text: 'Raskolnikov\'un vicdan çatışmaları üzerine notlar alıyorum.', time: '19:40' }
      ]
    },
    {
      id: 'r-3',
      name: 'Sessiz Gece Okurları',
      bookTitle: 'Serbest Okuma & Odaklanma',
      coverBg: '#6B705C',
      coverSecondary: '#3F4238',
      desc: 'Tamamen sessiz, sadece odaklanmış okuma seansı.',
      participants: 9,
      ambient: 'Gece Yağmuru',
      coverImg: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=300&h=450&q=80',
      messages: []
    },
    {
      id: 'r-4',
      name: 'Felsefe & Düşünce Atölyesi',
      bookTitle: 'Devlet — Platon',
      coverBg: '#4A5568',
      coverSecondary: '#1A202C',
      desc: 'Antik çağdan modern felsefeye derin metin okumaları.',
      participants: 5,
      ambient: 'Şömine Çatırtısı',
      coverImg: 'https://images.unsplash.com/photo-1476275466078-4007374efbbe?auto=format&fit=crop&w=300&h=450&q=80',
      messages: []
    }
  ]);

  const toggleSpoiler = (id) => {
    setRevealedSpoilers(prev => ({ ...prev, [id]: true }));
  };

  const handleSendMessage = () => {
    if (!messageText.trim() || !activeRoom) return;
    const newMsg = {
      id: `m-${Date.now()}`,
      user: currentUser?.fullName || 'Kitap Kulübü Okuru',
      role: currentUser?.role || 'user',
      text: messageText.trim(),
      isSpoiler: isSpoilerMsg,
      time: 'Şimdi'
    };

    setRooms(prev => prev.map(r => r.id === activeRoom.id ? {
      ...r,
      messages: [...r.messages, newMsg]
    } : r));

    setActiveRoom(prev => ({
      ...prev,
      messages: [...prev.messages, newMsg]
    }));

    setMessageText('');
    setIsSpoilerMsg(false);
  };

  return (
    <Modal
      visible={isRoomsOpen}
      animationType="slide"
      onRequestClose={() => {
        if (activeRoom) {
          setActiveRoom(null);
        } else {
          setIsRoomsOpen(false);
        }
      }}
    >
      <View style={styles.container}>
        {/* ================= 1. ODA DETAYI / CHAT (Screen 3) ================= */}
        {activeRoom ? (
          <View style={styles.chatContainer}>
            {/* Header */}
            <View style={styles.chatHeader}>
              <TouchableOpacity 
                style={styles.backBtn}
                onPress={() => setActiveRoom(null)}
                activeOpacity={0.7}
              >
                <Ionicons name="chevron-back" size={22} color="#007AFF" />
                <Text style={styles.backBtnText}>Odalar</Text>
              </TouchableOpacity>

              <Image 
                source={{ uri: activeRoom.coverImg }} 
                style={styles.headerBookThumb} 
              />

              <View style={styles.chatHeaderMeta}>
                <Text style={styles.chatHeaderTitle} numberOfLines={1}>
                  {activeRoom.name}
                </Text>
                <View style={styles.chatFilterBadge}>
                  <Ionicons name="shield-checkmark" size={12} color="#34C759" />
                  <Text style={styles.chatFilterBadgeText}>Sürprizbozan Koruması Aktif</Text>
                </View>
              </View>

              <TouchableOpacity 
                style={styles.closeBtn}
                onPress={() => { setActiveRoom(null); setIsRoomsOpen(false); }}
              >
                <Ionicons name="close" size={20} color="rgba(60,60,67,0.6)" />
              </TouchableOpacity>
            </View>

            {/* Ambient Banner */}
            <View style={styles.ambientBanner}>
              <Ionicons name="volume-medium-outline" size={14} color="#007AFF" />
              <Text style={styles.ambientBannerText}>
                {activeRoom.ambient} • {activeRoom.participants} okur bu odada dinliyor
              </Text>
            </View>

            {/* Message List */}
            <ScrollView style={styles.messagesList} contentContainerStyle={styles.messagesListContent}>
              {activeRoom.messages.length === 0 ? (
                <View style={styles.emptyChatBox}>
                  <Ionicons name="chatbubbles-outline" size={36} color="rgba(60,60,67,0.3)" />
                  <Text style={styles.emptyChatText}>Henüz mesaj yok. İlk notu siz bırakın!</Text>
                </View>
              ) : (
                activeRoom.messages.map(m => {
                  const isMe = currentUser?.fullName && m.user === currentUser.fullName;
                  const isRevealed = revealedSpoilers[m.id];
                  const shouldBlur = m.isSpoiler && !isRevealed && !isMe;

                  return (
                    <View key={m.id} style={[styles.messageWrap, isMe && styles.myMessageWrap]}>
                      <View style={styles.msgMetaRow}>
                        <Text style={styles.msgUser}>{m.user}</Text>
                        {m.role === 'founder' && (
                          <View style={styles.miniBadgeOrange}>
                            <Text style={styles.miniBadgeText}>Kurucu</Text>
                          </View>
                        )}
                        <Text style={styles.msgTime}>{m.time}</Text>
                      </View>

                      {shouldBlur ? (
                        <TouchableOpacity 
                          style={styles.spoilerMsgCard}
                          onPress={() => toggleSpoiler(m.id)}
                          activeOpacity={0.8}
                        >
                          <Ionicons name="alert-circle" size={15} color="#FF3B30" />
                          <Text style={styles.spoilerMsgText}>
                            Sürprizbozan — Görmek için dokunun
                          </Text>
                        </TouchableOpacity>
                      ) : (
                        <View style={[styles.msgBubble, isMe ? styles.myMsgBubble : styles.otherMsgBubble]}>
                          <Text style={[styles.msgText, isMe && styles.myMsgText]}>{m.text}</Text>
                        </View>
                      )}
                    </View>
                  );
                })
              )}
            </ScrollView>

            {/* Bottom Input */}
            <View style={styles.chatInputBar}>
              <TouchableOpacity 
                style={[styles.spoilerInputBtn, isSpoilerMsg && styles.spoilerInputBtnActive]}
                onPress={() => setIsSpoilerMsg(!isSpoilerMsg)}
                activeOpacity={0.7}
              >
                <Ionicons name={isSpoilerMsg ? "alert-circle" : "eye-outline"} size={16} color={isSpoilerMsg ? "#FF3B30" : "rgba(60,60,67,0.6)"} />
              </TouchableOpacity>

              <TextInput
                style={styles.chatTextInput}
                placeholder="Odaya mesaj veya alıntı yazın..."
                placeholderTextColor="rgba(60,60,67,0.4)"
                value={messageText}
                onChangeText={setMessageText}
              />

              <TouchableOpacity 
                style={[styles.sendBtn, (!messageText || !messageText.trim()) && styles.sendBtnDisabled]}
                onPress={handleSendMessage}
                disabled={!messageText || !messageText.trim()}
                activeOpacity={0.8}
              >
                <Ionicons name="arrow-up" size={16} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          /* ================= 2. ODALAR LİSTESİ (Screen 4) ================= */
          <View style={styles.roomsListContainer}>
            <View style={styles.roomsHeader}>
              <View>
                <Text style={styles.roomsTitle}>Kulüp Odaları</Text>
                <Text style={styles.roomsSub}>Birlikte okuyun, canlı tartışın</Text>
              </View>
              <TouchableOpacity 
                style={styles.closeRoomsBtn}
                onPress={() => setIsRoomsOpen(false)}
              >
                <Ionicons name="close" size={20} color="rgba(60,60,67,0.6)" />
              </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.roomsGrid}>
              {rooms.map(room => (
                <TouchableOpacity
                  key={room.id}
                  style={styles.roomCard}
                  onPress={() => setActiveRoom(room)}
                  activeOpacity={0.85}
                >
                  {/* Renkli Kapak Alanı (Prototip .rc-cover) */}
                  <View style={[styles.roomCardCover, { backgroundColor: room.coverBg }]}>
                    <View style={[styles.roomCardCoverOverlay, { backgroundColor: room.coverSecondary, opacity: 0.6 }]} />
                    <View style={styles.ambientPill}>
                      <Ionicons name="volume-medium" size={11} color="#fff" />
                      <Text style={styles.ambientPillText}>{room.ambient}</Text>
                    </View>
                  </View>

                  <View style={styles.roomCardBody}>
                    <Text style={styles.roomCardTitle} numberOfLines={2}>
                      {room.name}
                    </Text>
                    <Text style={styles.roomCardBook} numberOfLines={1}>
                      {room.bookTitle}
                    </Text>

                    <View style={styles.roomCardFooter}>
                      <View style={styles.participantRow}>
                        <View style={styles.greenPulseDot} />
                        <Text style={styles.participantCount}>{room.participants} okur aktif</Text>
                      </View>
                      <Ionicons name="chevron-forward" size={16} color="rgba(60,60,67,0.3)" />
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7'
  },

  // Odalar Listesi (Screen 4)
  roomsListContainer: {
    flex: 1
  },
  roomsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(60,60,67,0.12)'
  },
  roomsTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#000000'
  },
  roomsSub: {
    fontSize: 12,
    color: 'rgba(60,60,67,0.6)',
    marginTop: 2
  },
  closeRoomsBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(120,120,128,0.1)',
    alignItems: 'center',
    justifyContent: 'center'
  },
  roomsGrid: {
    padding: 14,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12
  },
  roomCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(60,60,67,0.16)',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1.5 },
    shadowOpacity: 0.04,
    shadowRadius: 5,
    elevation: 2
  },
  roomCardCover: {
    height: 100,
    position: 'relative'
  },
  roomCardCoverOverlay: {
    ...StyleSheet.absoluteFillObject
  },
  ambientPill: {
    position: 'absolute',
    top: 8,
    left: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(0,0,0,0.35)',
    borderRadius: 999,
    paddingHorizontal: 7,
    paddingVertical: 3
  },
  ambientPillText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '600'
  },
  roomCardBody: {
    padding: 10
  },
  roomCardTitle: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#000000',
    lineHeight: 17
  },
  roomCardBook: {
    fontSize: 11,
    color: 'rgba(60,60,67,0.6)',
    marginTop: 3
  },
  roomCardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: 'rgba(60,60,67,0.08)'
  },
  participantRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5
  },
  greenPulseDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#34C759'
  },
  participantCount: {
    fontSize: 11,
    fontWeight: '600',
    color: '#34C759'
  },

  // Chat Ekranı (Screen 3)
  chatContainer: {
    flex: 1
  },
  chatHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(60,60,67,0.12)',
    gap: 8
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 4
  },
  backBtnText: {
    color: '#007AFF',
    fontSize: 14,
    fontWeight: '600'
  },
  headerBookThumb: {
    width: 26,
    height: 38,
    borderRadius: 3,
    backgroundColor: '#8B4A34'
  },
  chatHeaderMeta: {
    flex: 1
  },
  chatHeaderTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#000000'
  },
  chatFilterBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2
  },
  chatFilterBadgeText: {
    fontSize: 10.5,
    color: '#34C759',
    fontWeight: '600'
  },
  closeBtn: {
    padding: 4
  },

  ambientBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: 'rgba(0, 122, 255, 0.08)',
    paddingVertical: 6
  },
  ambientBannerText: {
    fontSize: 11.5,
    color: '#007AFF',
    fontWeight: '600'
  },

  messagesList: {
    flex: 1,
    paddingHorizontal: 14
  },
  messagesListContent: {
    paddingVertical: 14,
    gap: 12
  },
  emptyChatBox: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60
  },
  emptyChatText: {
    fontSize: 13,
    color: 'rgba(60,60,67,0.5)',
    marginTop: 8
  },
  messageWrap: {
    maxWidth: '82%',
    alignSelf: 'flex-start'
  },
  myMessageWrap: {
    alignSelf: 'flex-end'
  },
  msgMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4
  },
  msgUser: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#000000'
  },
  miniBadgeOrange: {
    backgroundColor: 'rgba(255,149,0,0.15)',
    borderRadius: 4,
    paddingHorizontal: 4,
    paddingVertical: 1
  },
  miniBadgeText: {
    color: '#FF9500',
    fontSize: 9.5,
    fontWeight: '700'
  },
  msgTime: {
    fontSize: 10.5,
    color: 'rgba(60,60,67,0.4)'
  },
  msgBubble: {
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 9
  },
  otherMsgBubble: {
    backgroundColor: 'rgba(120, 120, 128, 0.12)',
    borderTopLeftRadius: 3
  },
  myMsgBubble: {
    backgroundColor: '#007AFF',
    borderTopRightRadius: 3
  },
  msgText: {
    fontSize: 13.5,
    color: '#000000',
    lineHeight: 18
  },
  myMsgText: {
    color: '#FFFFFF'
  },

  spoilerMsgCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255, 59, 48, 0.1)',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 59, 48, 0.25)'
  },
  spoilerMsgText: {
    fontSize: 12,
    color: '#FF3B30',
    fontWeight: '700'
  },

  chatInputBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: 'rgba(60,60,67,0.12)'
  },
  spoilerInputBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(120,120,128,0.1)',
    alignItems: 'center',
    justifyContent: 'center'
  },
  spoilerInputBtnActive: {
    backgroundColor: 'rgba(255,59,48,0.15)',
    borderWidth: 1,
    borderColor: '#FF3B30'
  },
  chatTextInput: {
    flex: 1,
    backgroundColor: 'rgba(120,120,128,0.09)',
    borderRadius: 18,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 13.5,
    color: '#000000'
  },
  sendBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#007AFF',
    alignItems: 'center',
    justifyContent: 'center'
  },
  sendBtnDisabled: {
    opacity: 0.4
  }
});
