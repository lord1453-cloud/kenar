import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet, ScrollView, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useMobile } from '../context/MobileContext';
import { mobileApi } from '../api/client';
import { colors } from '../theme/colors';

export const MobileAdminScreen = () => {
  const { isAdminOpen, setIsAdminOpen, currentUser, users, showToast } = useMobile();

  const [tab, setTab] = useState('feedback'); // 'feedback' | 'testers' | 'users'
  const [feedbacks, setFeedbacks] = useState([]);
  const [testersData, setTestersData] = useState(null);
  const [newTesterEmail, setNewTesterEmail] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAdminOpen) {
      loadData();
    }
  }, [isAdminOpen]);

  const loadData = async () => {
    setLoading(true);
    const fbList = await mobileApi.getFeedbacks();
    setFeedbacks(fbList);

    const tData = await mobileApi.getBetaTesters();
    setTestersData(tData);
    setLoading(false);
  };

  const handleUpdateStatus = async (id, status) => {
    await mobileApi.updateFeedbackStatus(id, status);
    setFeedbacks(prev => prev.map(f => f.id === id ? { ...f, status } : f));
    showToast(`Durum güncellendi: ${status}`);
  };

  const handleCreateCode = async () => {
    const res = await mobileApi.addBetaTester({ generateCode: true });
    if (res && res.inviteCode) {
      showToast(`Yeni davet kodu üretildi: ${res.inviteCode}`);
      loadData();
    }
  };

  const handleAddTester = async () => {
    if (!newTesterEmail.trim()) return;
    await mobileApi.addBetaTester({ email: newTesterEmail.trim(), generateCode: true });
    setNewTesterEmail('');
    showToast('Testçi listeye eklendi ve kod üretildi');
    loadData();
  };

  const handleToggleUser = async (userId) => {
    const res = await mobileApi.toggleUserStatus(userId);
    if (res && res.user) {
      showToast(`${res.user.username} durumu: ${res.user.status}`);
    }
  };

  return (
    <Modal
      visible={isAdminOpen}
      animationType="slide"
      onRequestClose={() => setIsAdminOpen(false)}
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.titleRow}>
            <Ionicons name="shield-checkmark" size={20} color={colors.star} />
            <Text style={styles.title}>Mobil Yönetici Paneli</Text>
          </View>
          <TouchableOpacity onPress={() => setIsAdminOpen(false)}>
            <Ionicons name="close" size={24} color={colors.textMain} />
          </TouchableOpacity>
        </View>

        {/* Tab Buttons */}
        <View style={styles.tabRow}>
          <TouchableOpacity
            style={[styles.tabBtn, tab === 'feedback' && styles.tabBtnActive]}
            onPress={() => setTab('feedback')}
          >
            <Text style={[styles.tabBtnText, tab === 'feedback' && styles.tabBtnTextActive]}>
              Feedback ({feedbacks.length})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tabBtn, tab === 'testers' && styles.tabBtnActive]}
            onPress={() => setTab('testers')}
          >
            <Text style={[styles.tabBtnText, tab === 'testers' && styles.tabBtnTextActive]}>
              Beta Testçileri
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tabBtn, tab === 'users' && styles.tabBtnActive]}
            onPress={() => setTab('users')}
          >
            <Text style={[styles.tabBtnText, tab === 'users' && styles.tabBtnTextActive]}>
              Kullanıcılar ({users.length})
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content}>
          {/* TAB 1: BETA FEEDBACK */}
          {tab === 'feedback' && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Gelen Hata ve Geri Bildirimler</Text>
              {feedbacks.length > 0 ? (
                feedbacks.map(f => (
                  <View key={f.id} style={styles.card}>
                    <View style={styles.cardHeader}>
                      <View>
                        <Text style={styles.cardUserName}>{f.userName}</Text>
                        <View style={styles.badgeRow}>
                          <View style={[styles.platBadge, f.platform === 'ios' ? styles.platBadgeIos : styles.platBadgeAndroid]}>
                            <Text style={styles.platBadgeText}>
                              {f.platform === 'ios' ? '📱 iOS' : f.platform === 'android' ? '🤖 Android' : '💻 Web'}
                            </Text>
                          </View>
                          <Text style={styles.screenTag}>Ekran: {f.screen}</Text>
                        </View>
                      </View>
                      <View style={[styles.statusBadge, f.status === 'cozuldu' ? styles.statusCozuldu : styles.statusYeni]}>
                        <Text style={styles.statusText}>{f.status.toUpperCase()}</Text>
                      </View>
                    </View>

                    <Text style={styles.descText}>{f.description}</Text>

                    {/* Durum Değiştirme Butonları */}
                    <View style={styles.actionRow}>
                      <TouchableOpacity
                        style={[styles.statusActionBtn, f.status === 'yeni' && styles.statusActionActive]}
                        onPress={() => handleUpdateStatus(f.id, 'yeni')}
                      >
                        <Text style={styles.statusActionText}>Yeni</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[styles.statusActionBtn, f.status === 'inceleniyor' && styles.statusActionActive]}
                        onPress={() => handleUpdateStatus(f.id, 'inceleniyor')}
                      >
                        <Text style={styles.statusActionText}>İnceleniyor</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[styles.statusActionBtn, f.status === 'cozuldu' && styles.statusActionActive]}
                        onPress={() => handleUpdateStatus(f.id, 'cozuldu')}
                      >
                        <Text style={styles.statusActionText}>Çözüldü</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ))
              ) : (
                <Text style={styles.emptyText}>Henüz bildirilmiş bir hata yok.</Text>
              )}
            </View>
          )}

          {/* TAB 2: BETA TESTERS */}
          {tab === 'testers' && (
            <View style={styles.section}>
              <View style={styles.card}>
                <Text style={styles.cardTitle}>Tek Kişiye Özel Beta Kısıtlaması</Text>
                <Text style={styles.cardDesc}>
                  Belirlenen Testçi: <Text style={{ color: colors.star, fontWeight: '700' }}>{testersData?.designatedTesterEmail || 'beta@kitapkulubu.com'}</Text>
                </Text>
                <Text style={styles.cardDesc}>
                  Kısıtlama Modu: <Text style={{ color: colors.success, fontWeight: '700' }}>AKTİF (Backend Korumalı)</Text>
                </Text>

                {/* Hızlı Kod Üret */}
                <TouchableOpacity
                  style={styles.btnPrimary}
                  onPress={handleCreateCode}
                >
                  <Ionicons name="key-outline" size={16} color="#fff" />
                  <Text style={styles.btnPrimaryText}>Yeni Beta Davet Kodu Üret</Text>
                </TouchableOpacity>
              </View>

              {/* Yeni Testçi Ekle */}
              <View style={styles.card}>
                <Text style={styles.cardTitle}>Yeni Testçi E-postası Tanımla</Text>
                <TextInput
                  style={styles.input}
                  placeholder="test@kitapkulubu.com"
                  placeholderTextColor={colors.textDim}
                  value={newTesterEmail}
                  onChangeText={setNewTesterEmail}
                />
                <TouchableOpacity
                  style={[styles.btnPrimary, { backgroundColor: colors.success }]}
                  onPress={handleAddTester}
                >
                  <Ionicons name="person-add-outline" size={16} color="#fff" />
                  <Text style={styles.btnPrimaryText}>Yetkili Testçi Ekle</Text>
                </TouchableOpacity>
              </View>

              {/* Aktif Kodlar */}
              {testersData?.activeInviteCodes && (
                <View style={styles.card}>
                  <Text style={styles.cardTitle}>Aktif Davet Kodları:</Text>
                  <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 8 }}>
                    {testersData.activeInviteCodes.map(code => (
                      <View key={code} style={styles.codeTag}>
                        <Text style={styles.codeTagText}>{code}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              )}
            </View>
          )}

          {/* TAB 3: USERS */}
          {tab === 'users' && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Sistem Kullanıcıları</Text>
              {users.map(u => (
                <View key={u.id} style={styles.card}>
                  <View style={styles.cardHeader}>
                    <View>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                        <Text style={styles.cardUserName}>{u.fullName}</Text>
                        {u.role === 'founder' && <Text style={{ color: colors.star, fontWeight: '800', fontSize: 11 }}>★ Founder</Text>}
                        {u.role === 'admin' && <Text style={{ color: colors.primary, fontWeight: '700', fontSize: 11 }}>Admin</Text>}
                      </View>
                      <Text style={{ color: colors.textDim, fontSize: 11 }}>@{u.username} • {u.email}</Text>
                    </View>

                    {u.role !== 'founder' && (
                      <TouchableOpacity
                        style={styles.toggleUserBtn}
                        onPress={() => handleToggleUser(u.id)}
                      >
                        <Text style={styles.toggleUserText}>Durum Değiştir</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              ))}
            </View>
          )}
        </ScrollView>
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
    gap: 8
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textMain
  },
  tabRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: colors.borderSubtle,
    backgroundColor: colors.bgCard
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center'
  },
  tabBtnActive: {
    borderBottomWidth: 2,
    borderBottomColor: colors.star
  },
  tabBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textDim
  },
  tabBtnTextActive: {
    color: colors.star,
    fontWeight: '700'
  },
  content: {
    flex: 1,
    padding: 16
  },
  section: {
    marginBottom: 30
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textMain,
    marginBottom: 12
  },
  card: {
    backgroundColor: colors.bgCard,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    padding: 14,
    marginBottom: 12
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8
  },
  cardUserName: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textMain
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4
  },
  platBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4
  },
  platBadgeIos: {
    backgroundColor: 'rgba(59, 130, 246, 0.2)'
  },
  platBadgeAndroid: {
    backgroundColor: 'rgba(16, 185, 129, 0.2)'
  },
  platBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.textMain
  },
  screenTag: {
    fontSize: 11,
    color: colors.textDim
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6
  },
  statusYeni: {
    backgroundColor: 'rgba(239, 68, 68, 0.15)'
  },
  statusCozuldu: {
    backgroundColor: 'rgba(16, 185, 129, 0.15)'
  },
  statusText: {
    fontSize: 10,
    fontWeight: '800',
    color: colors.textMain
  },
  descText: {
    fontSize: 13,
    color: colors.textMuted,
    lineHeight: 18,
    marginVertical: 8
  },
  actionRow: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 8,
    borderTopWidth: 1,
    borderTopColor: colors.borderSubtle,
    paddingTop: 8
  },
  statusActionBtn: {
    flex: 1,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: colors.bgElevated,
    alignItems: 'center'
  },
  statusActionActive: {
    backgroundColor: colors.primary
  },
  statusActionText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.textMain
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textMain,
    marginBottom: 6
  },
  cardDesc: {
    fontSize: 12,
    color: colors.textMuted,
    marginBottom: 6
  },
  btnPrimary: {
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 10
  },
  btnPrimaryText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700'
  },
  input: {
    backgroundColor: colors.bgInput,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    padding: 10,
    color: colors.textMain,
    fontSize: 13,
    marginVertical: 8
  },
  codeTag: {
    backgroundColor: colors.bgElevated,
    borderWidth: 1,
    borderColor: colors.primary,
    borderStyle: 'dashed',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6
  },
  codeTagText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.primary,
    fontFamily: 'monospace'
  },
  toggleUserBtn: {
    backgroundColor: colors.bgElevated,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6
  },
  toggleUserText: {
    fontSize: 10,
    fontWeight: '600',
    color: colors.textMuted
  },
  emptyText: {
    color: colors.textDim,
    fontSize: 13,
    textAlign: 'center',
    marginVertical: 20
  }
});
