import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet, ScrollView, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useMobile } from '../context/MobileContext';
import { colors } from '../theme/colors';

export const RoomsModal = () => {
  const { isRoomsOpen, setIsRoomsOpen, currentUser, showToast } = useMobile();

  const [activeRoom, setActiveRoom] = useState(null);
  const [messageText, setMessageText] = useState('');

  const [rooms, setRooms] = useState([
    {
      id: 'r-1',
      name: 'Bilim Kurgu & Distopya Kulübü',
      desc: 'Frank Herbert, Philip K. Dick ve Asimov okumaları.',
      participants: 6,
      ambient: 'Sessiz Rüzgar',
      messages: [
        { id: 'm-1', user: 'Kitap Kulübü Kurucusu', text: 'Dune 3. kısıma başladım, arrakis betimlemeleri muazzam.', time: '20:12' },
        { id: 'm-2', user: 'Zeynep Demir', text: 'Harika bir bölüm, keyifli okumalar!', time: '20:14' }
      ]
    },
    {
      id: 'r-2',
      name: 'Dünya Klasikleri Odası',
      desc: 'Dostoyevski, Tolstoy ve dünya edebiyatı.',
      participants: 4,
      ambient: 'Kütüphane Ambiyansı',
      messages: [
        { id: 'm-3', user: 'Can Kaya', text: 'Suç ve Ceza üzerine notlar alıyorum.', time: '19:40' }
      ]
    },
    {
      id: 'r-3',
      name: 'Sessiz Gece Okurları',
      desc: 'Tamamen sessiz, sadece odaklanmış okuma odası.',
      participants: 9,
      ambient: 'Gece Yağmuru',
      messages: []
    }
  ]);

  const handleSendMessage = () => {
    if (!messageText.trim() || !activeRoom) return;
    const newMsg = {
      id: `m-${Date.now()}`,
      user: currentUser.fullName,
      text: messageText.trim(),
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
  };

  return (
    <Modal
      visible={isRoomsOpen}
      animationType="slide"
      onRequestClose={() => setIsRoomsOpen(false)}
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.titleRow}>
            {activeRoom && (
              <TouchableOpacity onPress={() => setActiveRoom(null)} style={{ marginRight: 8 }}>
                <Ionicons name="arrow-back" size={20} color={colors.textMain} />
              </TouchableOpacity>
            )}
            <Ionicons name="people" size={20} color={colors.primary} />
            <Text style={styles.title}>{activeRoom ? activeRoom.name : 'Okuma Odaları'}</Text>
          </View>
          <TouchableOpacity onPress={() => setIsRoomsOpen(false)}>
            <Ionicons name="close" size={24} color={colors.textMain} />
          </TouchableOpacity>
        </View>

        {!activeRoom ? (
          <ScrollView style={styles.content}>
            <Text style={styles.sectionDesc}>
              Canlı okuma odalarına katılarak diğer okurlarla birlikte sessizce okuyabilir, deneyimlerinizi paylaşabilirsiniz.
            </Text>

            {rooms.map(room => (
              <TouchableOpacity
                key={room.id}
                style={styles.roomCard}
                onPress={() => setActiveRoom(room)}
                activeOpacity={0.8}
              >
                <View style={styles.roomHeader}>
                  <Text style={styles.roomTitle}>{room.name}</Text>
                  <View style={styles.participantBadge}>
                    <Ionicons name="people-outline" size={12} color={colors.primary} />
                    <Text style={styles.participantText}>{room.participants} Okur</Text>
                  </View>
                </View>
                <Text style={styles.roomDesc}>{room.desc}</Text>
                <View style={styles.roomFooter}>
                  <Text style={styles.ambientText}>🎵 {room.ambient}</Text>
                  <Text style={styles.joinText}>Odaya Katıl →</Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        ) : (
          <View style={styles.chatContainer}>
            <ScrollView style={styles.messagesList} contentContainerStyle={{ padding: 16 }}>
              <View style={styles.ambientNotice}>
                <Text style={styles.ambientNoticeText}>
                  Bu oda {activeRoom.ambient} moduyla dinleniyor. Odaklanarak okumak serbesttir.
                </Text>
              </View>

              {activeRoom.messages.map(m => (
                <View key={m.id} style={[styles.messageBubble, m.user === currentUser.fullName && styles.myMessageBubble]}>
                  <View style={styles.msgHeader}>
                    <Text style={styles.msgUser}>{m.user}</Text>
                    <Text style={styles.msgTime}>{m.time}</Text>
                  </View>
                  <Text style={styles.msgText}>{m.text}</Text>
                </View>
              ))}
            </ScrollView>

            <View style={styles.chatInputRow}>
              <TextInput
                style={styles.chatInput}
                placeholder="Odaya sessiz bir not bırakın..."
                placeholderTextColor={colors.textDim}
                value={messageText}
                onChangeText={setMessageText}
              />
              <TouchableOpacity style={styles.sendBtn} onPress={handleSendMessage}>
                <Ionicons name="send" size={16} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgApp
  },
  header: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderSubtle,
    backgroundColor: colors.bgCard
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textMain
  },
  content: {
    flex: 1,
    padding: 16
  },
  sectionDesc: {
    fontSize: 12,
    color: colors.textMuted,
    lineHeight: 18,
    marginBottom: 16
  },
  roomCard: {
    backgroundColor: colors.bgCard,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    padding: 14,
    marginBottom: 12
  },
  roomHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6
  },
  roomTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textMain,
    flex: 1
  },
  participantBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.bgElevated,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8
  },
  participantText: {
    fontSize: 11,
    color: colors.primary,
    fontWeight: '600'
  },
  roomDesc: {
    fontSize: 12,
    color: colors.textMuted,
    lineHeight: 16,
    marginBottom: 10
  },
  roomFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: colors.borderSubtle,
    paddingTop: 8
  },
  ambientText: {
    fontSize: 11,
    color: colors.textDim
  },
  joinText: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: '700'
  },
  chatContainer: {
    flex: 1
  },
  messagesList: {
    flex: 1
  },
  ambientNotice: {
    backgroundColor: colors.bgElevated,
    padding: 10,
    borderRadius: 10,
    marginBottom: 16,
    alignItems: 'center'
  },
  ambientNoticeText: {
    fontSize: 11,
    color: colors.textMuted,
    textAlign: 'center'
  },
  messageBubble: {
    backgroundColor: colors.bgCard,
    borderRadius: 12,
    padding: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    maxWidth: '85%',
    alignSelf: 'flex-start'
  },
  myMessageBubble: {
    backgroundColor: 'rgba(59, 130, 246, 0.15)',
    borderColor: 'rgba(59, 130, 246, 0.3)',
    alignSelf: 'flex-end'
  },
  msgHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
    marginBottom: 4
  },
  msgUser: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.primary
  },
  msgTime: {
    fontSize: 10,
    color: colors.textDim
  },
  msgText: {
    fontSize: 13,
    color: colors.textMain,
    lineHeight: 18
  },
  chatInputRow: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: colors.bgCard,
    borderTopWidth: 1,
    borderTopColor: colors.borderSubtle,
    gap: 8,
    alignItems: 'center'
  },
  chatInput: {
    flex: 1,
    backgroundColor: colors.bgInput,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    color: colors.textMain,
    fontSize: 13,
    borderWidth: 1,
    borderColor: colors.borderSubtle
  },
  sendBtn: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center'
  }
});
