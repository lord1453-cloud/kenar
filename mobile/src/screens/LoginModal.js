import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useMobile } from '../context/MobileContext';
import { mobileApi } from '../api/client';
import { colors } from '../theme/colors';

export const LoginModal = () => {
  const { isLoginOpen, setIsLoginOpen, users, switchUser, setCurrentUser, showToast } = useMobile();

  const [mode, setMode] = useState('switch'); // 'switch' | 'login'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleOnlineLogin = async () => {
    if (!email.trim() || !password.trim()) return;

    setLoading(true);
    const res = await mobileApi.login(email.trim(), password.trim());
    setLoading(false);

    if (res.success && res.user) {
      setCurrentUser(res.user);
      setIsLoginOpen(false);
      showToast(`Giriş yapıldı: ${res.user.fullName} (${res.user.role.toUpperCase()})`);
    } else {
      showToast(res.error || 'Giriş başarısız oldu.');
    }
  };

  return (
    <Modal
      visible={isLoginOpen}
      transparent
      animationType="slide"
      onRequestClose={() => setIsLoginOpen(false)}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>Tek Hesap — Kimlik Doğrulama</Text>
            <TouchableOpacity onPress={() => setIsLoginOpen(false)}>
              <Ionicons name="close" size={22} color={colors.textDim} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.body}>
            <View>
              <Text style={styles.infoText}>
                Kayıtlı e-posta adresiniz ve şifreniz ile oturum açınız:
              </Text>
              <TextInput
                style={styles.input}
                placeholder="ornek@kitapkulubu.com"
                placeholderTextColor={colors.textDim}
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
              />
              <TextInput
                style={styles.input}
                placeholder="Şifre"
                placeholderTextColor={colors.textDim}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />

              <TouchableOpacity
                style={styles.loginBtn}
                onPress={handleOnlineLogin}
                disabled={loading}
              >
                <Text style={styles.loginBtnText}>
                  {loading ? 'Giriş Yapılıyor...' : 'Oturum Aç'}
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'flex-end'
  },
  container: {
    backgroundColor: colors.bgCard,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
    borderWidth: 1,
    borderColor: colors.borderSubtle
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderSubtle
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textMain
  },
  tabToggle: {
    flexDirection: 'row',
    margin: 14,
    backgroundColor: colors.bgElevated,
    borderRadius: 10,
    padding: 3
  },
  toggleBtn: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 8
  },
  toggleBtnActive: {
    backgroundColor: colors.primary
  },
  toggleText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textDim
  },
  toggleTextActive: {
    color: '#fff',
    fontWeight: '700'
  },
  body: {
    paddingHorizontal: 16,
    paddingBottom: 30
  },
  infoText: {
    fontSize: 12,
    color: colors.textMuted,
    lineHeight: 17,
    marginBottom: 14
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.bgElevated,
    padding: 12,
    borderRadius: 12,
    marginBottom: 10
  },
  userLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10
  },
  avatarCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center'
  },
  avatarText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 15
  },
  userNameText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textMain
  },
  founderText: {
    fontSize: 10,
    color: colors.star,
    fontWeight: '800',
    backgroundColor: colors.starLight,
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 4
  },
  adminText: {
    fontSize: 10,
    color: colors.primary,
    fontWeight: '700',
    backgroundColor: colors.primaryLight,
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 4
  },
  userEmailText: {
    fontSize: 11,
    color: colors.textDim,
    marginTop: 2
  },
  input: {
    backgroundColor: colors.bgInput,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    padding: 12,
    color: colors.textMain,
    fontSize: 13,
    marginBottom: 12
  },
  loginBtn: {
    backgroundColor: colors.primary,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 6
  },
  loginBtnText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700'
  }
});
