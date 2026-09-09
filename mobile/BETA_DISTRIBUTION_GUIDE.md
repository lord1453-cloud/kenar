# Kitap Kulübü — Android & iPhone (iOS) Kapalı Beta Dağıtım Kılavuzu

Bu kılavuz, Kitap Kulübü mobil uygulamasını **Apple TestFlight (iPhone)** ve **Google Play Console / Doğrudan APK (Android)** üzerinden özel izinli kapalı beta testçilerinize nasıl dağıtacağınızı adım adım açıklamaktadır.

---

## 1. Genel Mimari ve Özel İzin Mekanizması

Kitap Kulübü Kapalı Beta mimarisi 3 katmanlı özel izin ile korunmaktadır:

1. **Uygulama İçi Karşılama Kapısı (Beta Gatekeeper):**
   - Uygulama iPhone veya Android cihazda açıldığında, geçerli bir **Beta Davet Kodu** (`BETA-KITAP-2026`, vb.) girilmeden veya onaylı testçi e-postasıyla giriş yapılmadan ana ekranlar açılmaz.
2. **Kurucu & Yönetici Girişi:**
   - Kurucu hesabı (`kurucu@kitapkulubu.com` veya belirlediğiniz e-posta/şifre) ile doğrudan oturum açıldığında tüm kısıtlamalar kalkar ve Yönetim Paneli aktif olur.
3. **Backend Middleware Doğrulaması (`requireBetaAccess`):**
   - Mobil istemci tüm API isteklerine `x-client-platform` (`ios` veya `android`) ve `x-beta-invite-code` başlıklarını ekler.

---

## 2. iPhone (iOS) İçin Apple TestFlight Dağıtımı

### Adım 1: EAS CLI ile iOS Beta Paketini Derleme
`mobile` klasöründe Terminal veya komut istemcisinde:
```bash
cd mobile
npx eas build --platform ios --profile beta
```
*Bu komut Expo EAS bulutunda bir `.ipa` (iOS App Store paketi) oluşturur.*

### Adım 2: App Store Connect TestFlight Yayını
1. [App Store Connect](https://appstoreconnect.apple.com) paneline giriş yapın.
2. **Uygulamalarım > Kitap Kulübü > TestFlight** sekmesine gidin.
3. Derlenen sürüm (v0.1.0 Build 1) TestFlight listesinde göründüğünde:
   - **Dahili Test (Internal Testing):** Ekibinizdeki 100 kişiye kadar kullanıcıyı anında ekleyebilirsiniz (Apple incelemesi gerekmez).
   - **Harici Test (External Testing):** 10.000 kişiye kadar okuru e-posta ile davet edebilirsiniz.
4. Testçilere Apple tarafından "TestFlight Davetiyesi" gider. Testçi iPhone'una TestFlight uygulamasını indirip Kitap Kulübü'nü yükler.
5. Uygulamayı ilk açtığında sizin panelden ürettiğiniz **Özel Beta Davet Kodunu** girerek erişim sağlar.

---

## 3. Android İçin Kapalı Beta Dağıtımı

### Yöntem A: Doğrudan APK Dağıtımı (En Hızlı Yöntem)
Google Play incelemesini beklemeden testçilerinize anında APK vermek için:
```bash
cd mobile
npx eas build --platform android --profile preview
```
- Bu komut birkaç dakika içinde doğrudan indirilebilir bir `.apk` linki üretir.
- Testçileriniz bu linke tıklayarak Android cihazlarına uygulamayı saniyeler içinde kurabilirler.
- Açılışta davet kodunu girerek onaylanırlar.

### Yöntem B: Google Play Console "Kapalı Test" (Closed Testing)
1. [Google Play Console](https://play.google.com/console) hesabınıza girin.
2. **Sürüm > Test Etme > Kapalı Test** bölümüne gidin.
3. Bir test grubu oluşturun (örn: "Kitap Kulübü Beta Okurları").
4. E-posta listesine testçilerin Gmail adreslerini ekleyin.
5. `eas build --platform android --profile beta` ile üretilen `.aab` dosyasını yükleyip onaylayın.
6. Testçilere verilen gizli Google Play davet linkini iletin.

---

## 4. Yönetim Paneli Üzerinden Beta Yönetimi

Web Yönetim Paneli'nde (**Yönetim & Moderasyon Paneli > Beta Testçileri & Davet**):
- **Kapalı Beta Modu:** Tek tıkla "Özel İzinli Kilit Aktif" veya "Genel Erişime Açık" olarak değiştirilebilir.
- **Yeni Testçi Ekle & Kod Üret:** Testçinin e-postasını girip tek tıkla `BETA-XXXXX` şeklinde özel kod üretebilirsiniz.
- **Kod Kopyalama:** Aktif kodların yanındaki kopyalama butonuna basarak WhatsApp, Telegram veya E-posta ile testçinize iletebilirsiniz.
- **Gelen Başvurular:** Uygulama açılış ekranındaki "Davet İste" formundan başvuran kişileri **Beta Feedback** sekmesinde görebilir ve tek tıkla "Testçi Yap & Kod Üret" butonuna basarak onaylayabilirsiniz.
