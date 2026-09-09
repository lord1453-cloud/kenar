import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  ScrollView, 
  Platform, 
  ActivityIndicator,
  KeyboardAvoidingView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useMobile } from '../context/MobileContext';
import { mobileApi, setStoredBetaInviteCode, setStoredUserId } from '../api/client';
import { colors } from '../theme/colors';

export const BetaGateScreen = () => {
  const { setBetaAuthorized, setIsBetaUnlocked, setCurrentUser, showToast, users } = useMobile();

  const isIOS = Platform.OS === 'ios';
  const [tab, setTab] = useState('register'); // 'register' | 'login' | 'apply'

  // Kayıt Formu State'leri
  const [regFirstName, setRegFirstName] = useState('');
  const [regLastName, setRegLastName] = useState('');
  const [regAge, setRegAge] = useState('18');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regInviteCode, setRegInviteCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Kurucu & Kullanıcı Giriş Formu
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState('');

  // Başvuru Formu
  const [applyName, setApplyName] = useState('');
  const [applyEmail, setApplyEmail] = useState('');
  const [applyNote, setApplyNote] = useState('');
  const [applyLoading, setApplyLoading] = useState(false);
  const [applySuccess, setApplySuccess] = useState('');

  // 1. Davet Kodu ile Kayıt Ol (Zorunlu Kayıt Akışı)
  const handleRegister = async () => {
    if (!regFirstName.trim() || !regLastName.trim() || !regEmail.trim() || !regPassword.trim() || !regInviteCode.trim()) {
      setErrorMsg('Lütfen tüm zorunlu alanları doldurunuz.');
      return;
    }
    const ageNum = parseInt(regAge, 10);
    if (isNaN(ageNum) || ageNum < 18) {
      setErrorMsg('Platform kuralları gereği Kapalı Beta\'ya yalnızca 18 yaş ve üzeri okurlar katılabilir.');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    const res = await mobileApi.register({
      firstName: regFirstName.trim(),
      lastName: regLastName.trim(),
      age: ageNum,
      email: regEmail.trim(),
      password: regPassword,
      inviteCode: regInviteCode.trim().toUpperCase()
    });
    setLoading(false);

    if (res.success && res.user) {
      setStoredBetaInviteCode(regInviteCode.trim().toUpperCase());
      setStoredUserId(res.user.id);
      setCurrentUser(res.user);
      setBetaAuthorized(true);
      setIsBetaUnlocked(true);
      showToast(`🎉 Hoş geldiniz, ${res.user.fullName}! Beta hesabınız açıldı.`);
    } else {
      setErrorMsg(res.error || 'Kayıt gerçekleştirilemedi. Davet kodunuzu ve bilgilerinizi kontrol ediniz.');
    }
  };

  // 2. Kurucu / Ekip Girişi
  const handleFounderLogin = async () => {
    if (!loginEmail.trim() || !loginPassword.trim()) {
      setLoginError('E-posta ve şifre zorunludur.');
      return;
    }

    setLoginLoading(true);
    setLoginError('');

    const res = await mobileApi.login(loginEmail.trim(), loginPassword.trim());
    setLoginLoading(false);

    if (res.success && res.user) {
      setCurrentUser(res.user);
      setStoredUserId(res.user.id);
      setBetaAuthorized(true);
      setIsBetaUnlocked(true);
      showToast(`Giriş yapıldı: ${res.user.fullName} (${res.user.role.toUpperCase()})`);
    } else {
      // Local fallback check
      const local = users.find(u => u.email.toLowerCase() === loginEmail.trim().toLowerCase());
      if (local && (local.role === 'founder' || local.role === 'admin')) {
        setCurrentUser(local);
        setStoredUserId(local.id);
        setBetaAuthorized(true);
        setIsBetaUnlocked(true);
        showToast(`Giriş yapıldı: ${local.fullName}`);
      } else {
        setLoginError(res.error || 'Giriş başarısız oldu.');
      }
    }
  };

  // 3. Kapalı Beta Başvurusu
  const handleApply = async () => {
    if (!applyEmail.trim()) {
      showToast('Lütfen e-posta adresinizi giriniz.');
      return;
    }

    setApplyLoading(true);
    setApplySuccess('');

    const res = await mobileApi.applyBeta({
      name: applyName.trim(),
      email: applyEmail.trim(),
      note: applyNote.trim()
    });
    setApplyLoading(false);

    if (res.success) {
      setApplySuccess(res.message || 'Başvurunuz kurucuya iletildi!');
      setApplyName('');
      setApplyEmail('');
      setApplyNote('');
      showToast('Başvurunuz alındı! Teşekkür ederiz.');
    } else {
      showToast(res.error || 'Başvuru iletilemedi.');
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {/* Üst Kart / Logo & Rozet */}
        <View style={styles.headerBox}>
          <View style={styles.iconCircle}>
            <Ionicons name="shield-checkmark" size={36} color={colors.star} />
          </View>

          <View style={styles.platformBadge}>
            <Ionicons name={isIOS ? "logo-apple" : "logo-android"} size={14} color="#fff" />
            <Text style={styles.platformText}>
              {isIOS ? 'iPhone • Apple TestFlight Beta' : 'Android • Kapalı Beta'}
            </Text>
          </View>

          <Text style={styles.title}>Kitap Kulübü</Text>
          <Text style={styles.subtitle}>
            Bu sürüme yalnızca özel izin verilen okurlarımız ve test ekibimiz erişebilir.
          </Text>
        </View>

        {/* Tab Geçiş Çubuğu */}
        <View style={styles.tabBar}>
          <TouchableOpacity
            style={[styles.tabBtn, tab === 'register' && styles.tabBtnActive]}
            onPress={() => setTab('register')}
          >
            <Ionicons name="person-add-outline" size={14} color={tab === 'register' ? colors.primary : colors.textDim} />
            <Text style={[styles.tabText, tab === 'register' && styles.tabTextActive]}>Davetle Kayıt</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tabBtn, tab === 'login' && styles.tabBtnActive]}
            onPress={() => setTab('login')}
          >
            <Ionicons name="log-in-outline" size={14} color={tab === 'login' ? colors.primary : colors.textDim} />
            <Text style={[styles.tabText, tab === 'login' && styles.tabTextActive]}>Giriş Yap</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tabBtn, tab === 'apply' && styles.tabBtnActive]}
            onPress={() => setTab('apply')}
          >
            <Ionicons name="paper-plane-outline" size={14} color={tab === 'apply' ? colors.primary : colors.textDim} />
            <Text style={[styles.tabText, tab === 'apply' && styles.tabTextActive]}>Davet İste</Text>
          </TouchableOpacity>
        </View>

        {/* 1. DAVET KODU İLE KAYIT OL */}
        {tab === 'register' && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Tekil Beta Hesabı Aç</Text>
            <Text style={styles.cardDesc}>
              Kapalı Beta'ya katılmak için davet kodunuzla hesabınızı oluşturmanız gerekmektedir. Kayıt olmadan beta testine girilemez:
            </Text>

            {errorMsg ? (
              <View style={styles.errorBox}>
                <Ionicons name="alert-circle" size={16} color={colors.danger} />
                <Text style={styles.errorText}>{errorMsg}</Text>
              </View>
            ) : null}

            <View style={{ flexDirection: 'row', gap: 10 }}>
              <View style={{ flex: 1 }}>
                <Text style={styles.inputLabel}>Ad *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Adınız"
                  placeholderTextColor={colors.textDim}
                  value={regFirstName}
                  onChangeText={setRegFirstName}
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.inputLabel}>Soyad *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Soyadınız"
                  placeholderTextColor={colors.textDim}
                  value={regLastName}
                  onChangeText={setRegLastName}
                />
              </View>
            </View>

            <View style={{ flexDirection: 'row', gap: 10 }}>
              <View style={{ width: 80 }}>
                <Text style={styles.inputLabel}>Yaş (18+) *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="18"
                  placeholderTextColor={colors.textDim}
                  value={regAge}
                  onChangeText={setRegAge}
                  keyboardType="numeric"
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.inputLabel}>E-posta *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="okur@kitapkulubu.com"
                  placeholderTextColor={colors.textDim}
                  value={regEmail}
                  onChangeText={setRegEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>
            </View>

            <Text style={styles.inputLabel}>Şifre *</Text>
            <TextInput
              style={styles.input}
              placeholder="En az 6 karakter"
              placeholderTextColor={colors.textDim}
              value={regPassword}
              onChangeText={setRegPassword}
              secureTextEntry
            />

            <Text style={[styles.inputLabel, { color: colors.primary, fontWeight: '700' }]}>
              🔑 Beta Davet Kodu (Zorunlu) *
            </Text>
            <TextInput
              style={[styles.input, styles.codeInput]}
              placeholder="ÖRN: BETA-KITAP-2026"
              placeholderTextColor={colors.textDim}
              value={regInviteCode}
              onChangeText={setRegInviteCode}
              autoCapitalize="characters"
              autoCorrect={false}
            />

            <TouchableOpacity 
              style={styles.submitBtn} 
              onPress={handleRegister} 
              disabled={loading}
              activeOpacity={0.8}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <>
                  <Ionicons name="checkmark-circle-outline" size={18} color="#fff" />
                  <Text style={styles.submitBtnText}>Beta Hesabı Aç ve Giriş Yap</Text>
                </>
              )}
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setTab('login')} style={styles.switchLink}>
              <Text style={styles.switchLinkText}>
                Zaten kayıtlı hesabınız var mı? <Text style={{ color: colors.primary, fontWeight: '700' }}>Giriş Yapın</Text>
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* 2. STANDART GİRİŞ */}
        {tab === 'login' && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Oturum Aç</Text>
            <Text style={styles.cardDesc}>
              Kayıtlı e-posta adresiniz ve şifreniz ile oturum açınız:
            </Text>

            {loginError ? (
              <View style={styles.errorBox}>
                <Ionicons name="alert-circle" size={16} color={colors.danger} />
                <Text style={styles.errorText}>{loginError}</Text>
              </View>
            ) : null}

            <Text style={styles.inputLabel}>E-posta Adresi</Text>
            <TextInput
              style={styles.input}
              placeholder="ornek@kitapkulubu.com"
              placeholderTextColor={colors.textDim}
              value={loginEmail}
              onChangeText={setLoginEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <Text style={styles.inputLabel}>Şifre</Text>
            <TextInput
              style={styles.input}
              placeholder="••••••••"
              placeholderTextColor={colors.textDim}
              value={loginPassword}
              onChangeText={setLoginPassword}
              secureTextEntry
            />

            <TouchableOpacity 
              style={[styles.submitBtn, { backgroundColor: colors.primary }]} 
              onPress={handleFounderLogin} 
              disabled={loginLoading}
              activeOpacity={0.8}
            >
              {loginLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <>
                  <Ionicons name="log-in-outline" size={18} color="#fff" />
                  <Text style={[styles.submitBtnText, { color: '#fff' }]}>Oturum Aç</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        )}

        {/* 3. BAŞVURU FORMU */}
        {tab === 'apply' && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Kapalı Beta Katılım Talebi</Text>
            <Text style={styles.cardDesc}>
              {isIOS ? 'Apple TestFlight' : 'Android'} kapalı beta test grubumuza katılmak için bilgilerinizi bırakın:
            </Text>

            {applySuccess ? (
              <View style={styles.successBox}>
                <Ionicons name="checkmark-circle" size={18} color={colors.success} />
                <Text style={styles.successText}>{applySuccess}</Text>
              </View>
            ) : null}

            <Text style={styles.inputLabel}>Adınız & Soyadınız</Text>
            <TextInput
              style={styles.input}
              placeholder="Okur Adı"
              placeholderTextColor={colors.textDim}
              value={applyName}
              onChangeText={setApplyName}
            />

            <Text style={styles.inputLabel}>E-posta Adresi *</Text>
            <TextInput
              style={styles.input}
              placeholder="ornek@domain.com"
              placeholderTextColor={colors.textDim}
              value={applyEmail}
              onChangeText={setApplyEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <Text style={styles.inputLabel}>Okuma İlgi Alanı / Not</Text>
            <TextInput
              style={[styles.input, { height: 60, textAlignVertical: 'top' }]}
              placeholder="Hangi tür kitapları seversiniz?"
              placeholderTextColor={colors.textDim}
              value={applyNote}
              onChangeText={setApplyNote}
              multiline
            />

            <TouchableOpacity 
              style={styles.submitBtn} 
              onPress={handleApply} 
              disabled={applyLoading}
              activeOpacity={0.8}
            >
              {applyLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <>
                  <Ionicons name="send" size={16} color="#fff" />
                  <Text style={styles.submitBtnText}>Başvuru Gönder</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        )}

        {/* Alt Telif / Sürüm Bilgisi */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Kitap Kulübü Mobile v0.1.0 (Build 1)</Text>
          <Text style={styles.footerSub}>Özel İzinli Kapalı Beta Sistemi</Text>
        </View>

      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgApp
  },
  scrollContent: {
    padding: 24,
    justifyContent: 'center',
    minHeight: '100%'
  },
  headerBox: {
    alignItems: 'center',
    marginBottom: 24
  },
  iconCircle: {
    width: 68,
    height: 68,
    borderRadius: 22,
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 14
  },
  platformBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 16,
    backgroundColor: colors.primaryLight,
    borderWidth: 1,
    borderColor: colors.primary,
    marginBottom: 10
  },
  platformText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primary
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.textMain,
    marginBottom: 6
  },
  subtitle: {
    fontSize: 13,
    color: colors.textMuted,
    textAlign: 'center',
    lineHeight: 18,
    maxWidth: 320
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: colors.bgCard,
    borderRadius: 12,
    padding: 4,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    marginBottom: 16
  },
  tabBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    paddingVertical: 10,
    borderRadius: 8
  },
  tabBtnActive: {
    backgroundColor: colors.bgElevated
  },
  tabText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textDim
  },
  tabTextActive: {
    color: colors.primary,
    fontWeight: '700'
  },
  card: {
    backgroundColor: colors.bgCard,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.borderSubtle
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textMain,
    marginBottom: 4
  },
  cardDesc: {
    fontSize: 12,
    color: colors.textMuted,
    lineHeight: 16,
    marginBottom: 16
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textMain,
    marginBottom: 6
  },
  input: {
    backgroundColor: colors.bgInput,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 11,
    color: colors.textMain,
    fontSize: 14,
    marginBottom: 14
  },
  codeInput: {
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    fontWeight: '700',
    letterSpacing: 1.5,
    color: colors.primary
  },
  submitBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: colors.primary,
    paddingVertical: 14,
    borderRadius: 10,
    marginTop: 4
  },
  submitBtnText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700'
  },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.dangerLight,
    borderWidth: 1,
    borderColor: colors.danger,
    borderRadius: 8,
    padding: 10,
    marginBottom: 14
  },
  errorText: {
    color: colors.danger,
    fontSize: 12,
    flex: 1
  },
  successBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.successLight,
    borderWidth: 1,
    borderColor: colors.success,
    borderRadius: 8,
    padding: 10,
    marginBottom: 14
  },
  successText: {
    color: colors.success,
    fontSize: 12,
    flex: 1
  },
  switchLink: {
    marginTop: 14,
    alignItems: 'center'
  },
  switchLinkText: {
    fontSize: 12,
    color: colors.textDim
  },
  footer: {
    marginTop: 24,
    alignItems: 'center'
  },
  footerText: {
    fontSize: 12,
    color: colors.textDim,
    fontWeight: '600'
  },
  footerSub: {
    fontSize: 11,
    color: colors.textDim,
    marginTop: 2
  }
});
