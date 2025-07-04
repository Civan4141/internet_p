# 🎨 TattooApp - Dövme Randevu ve Mesajlaşma Sistemi

Modern, kullanıcı dostu dövme sanatçıları ile müşterileri buluşturan web uygulaması.

![Next.js](https://img.shields.io/badge/Next.js-15.3.4-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![Prisma](https://img.shields.io/badge/Prisma-6.11.1-green)
![Tailwind](https://img.shields.io/badge/TailwindCSS-3.4-blue)

## 📋 Proje Tanımı

TattooApp, dövme sanatçıları ve müşteriler arasında köprü görevi gören kapsamlı bir platform sunar. Kullanıcılar kolayca sanatçı bulabilir, randevu oluşturabilir ve mesajlaşabilir. Sanatçılar profillerini yönetebilir, randevularını takip edebilir. Adminler ise tüm sistemi merkezi olarak kontrol edebilir.

### ✨ Temel Özellikler:
- � **Güvenli Kimlik Doğrulama** - NextAuth.js ile çok rollü giriş sistemi
- 👥 **Kullanıcı Yönetimi** - User, Artist, Admin rolleri
- 📅 **Randevu Sistemi** - Kolay randevu oluşturma ve takip
- 💬 **Mesajlaşma** - Anlık iletişim sistemi
- 🎨 **Sanatçı Profilleri** - Portfolyo ve uzmanlık alanları
- 📊 **Admin Paneli** - Kapsamlı yönetim arayüzü
- 📱 **Responsive Tasarım** - Tüm cihazlarda mükemmel deneyim

## 🛠️ Kullanılan Teknolojiler

### Frontend:
- **Next.js 15** - React framework (App Router)
- **TypeScript** - Tip güvenliği
- **Tailwind CSS** - Utility-first CSS framework
- **React Hooks** - State management

### Backend:
- **Next.js API Routes** - Serverless API
- **Prisma ORM** - Type-safe database client
- **NextAuth.js** - Authentication solution
- **SQLite** - Development database

### Diğer Kütüphaneler:
- **bcrypt** - Password hashing
- **React Hook Form** - Form handling
- **Date-fns** - Date utilities

## 🚀 Kurulum Talimatları

### Gereksinimler:
- Node.js 18.0 veya üzeri
- npm veya yarn package manager

### 1. Projeyi Klonlayın:
```bash
git clone https://github.com/[username]/tattoo-app.git
cd tattoo-app
```

### 2. Bağımlılıkları Yükleyin:
```bash
npm install
```

### 3. Ortam Değişkenlerini Ayarlayın:
`.env` dosyası oluşturun ve aşağıdaki değişkenleri ekleyin:
```env
# Database
DATABASE_URL="file:./dev.db"

# NextAuth
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"
```

### 4. Veritabanını Hazırlayın:
```bash
# Prisma client oluştur
npx prisma generate

# Veritabanı migration'larını çalıştır
npx prisma migrate dev

# Test verilerini yükle
npm run db:seed
```

### 5. Geliştirme Sunucusunu Başlatın:
```bash
npm run dev
```

Uygulama http://localhost:3000 adresinde çalışacaktır.

## 👤 Admin Giriş Bilgileri

Test için hazır kullanıcı hesapları:

### Admin Hesabı:
- **Email:** admin@tattooapp.com
- **Şifre:** admin123
- **Yetki:** Tam admin erişimi

### Test Kullanıcı:
- **Email:** user@tattooapp.com
- **Şifre:** user123
- **Yetki:** Normal kullanıcı

### Sanatçı Hesapları:
Tüm sanatçı hesapları için şifre: **artist123**
- mehmet.demir@tattooapp.com
- ayse.kaya@tattooapp.com
- emre.sen@tattooapp.com
- selin.ozkan@tattooapp.com
- **Sanatçı Yönetimi**: Sanatçı profilleri ekleme/düzenleme
- **Randevu Yönetimi**: Tüm randevuları görüntüle ve yönet
- **Mesaj Yönetimi**: Kullanıcı mesajlarını görüntüle
- **İstatistikler**: Sistem analizi ve raporlar

## 🚀 Teknolojiler

- **Framework**: Next.js 15 (App Router)
- **Veritabanı**: SQLite + Prisma ORM
- **Kimlik Doğrulama**: NextAuth.js
- **Stil**: Tailwind CSS
- **Dil**: TypeScript

## 🛠️ Kurulum

1. **Projeyi klonlayın**:
```bash
git clone <repository-url>
cd tattoo-app
```

2. **Bağımlılıkları yükleyin**:
```bash
npm install
```

3. **Veritabanını kurun**:
```bash
npx prisma migrate dev --name init
```

4. **Seed verilerini yükleyin**:
```bash
npm run db:seed
```

5. **Geliştirme sunucusunu başlatın**:
```bash
npm run dev
```

## 📱 Kullanım

### Test Hesapları
- **Admin**: admin@tattooapp.com / admin123
- **Kullanıcı**: user@tattooapp.com / user123

### Temel Kullanım
1. Hesap oluşturun veya giriş yapın
2. Sanatçıları keşfedin
3. Randevu oluşturun
4. Mesajlaşın
5. Profil sayfanızda randevularınızı takip edin

### Admin Panel
- `/admin` adresinden admin paneline erişin
- Kullanıcıları, sanatçıları ve randevuları yönetin
- Sistem istatistiklerini görüntüleyin

## 🗄️ Veritabanı Yapısı

### Tablolar
- **User**: Kullanıcı hesapları ve roller
- **Profile**: Kullanıcı profil bilgileri
- **TattooArtist**: Dövme sanatçı profilleri
- **Appointment**: Randevu kayıtları
- **Message**: Kullanıcı mesajları

### İlişkiler
- User → Profile (1:1)
- User → Appointment (1:N)
- TattooArtist → Appointment (1:N)
- User → Message (1:N sender/receiver)

## 🔐 Güvenlik

- **Şifre Güvenliği**: bcrypt ile hash'leme
- **Oturum Yönetimi**: NextAuth.js JWT tokenları
- **Rol Tabanlı Erişim**: Middleware ile yetkilendirme
- **Veri Doğrulama**: Sunucu tarafında doğrulama

## 📊 API Endpoints

### Kimlik Doğrulama
- `POST /api/auth/register` - Yeni kullanıcı kaydı
- `POST /api/auth/[...nextauth]` - Giriş/çıkış işlemleri

### Randevular
- `GET /api/appointments` - Kullanıcının randevuları
- `POST /api/appointments` - Yeni randevu oluştur

### Sanatçılar
- `GET /api/artists` - Aktif sanatçıları listele

## 🎨 Sayfa Yapısı

```
/                    # Ana sayfa
/auth/signin         # Giriş sayfası
/auth/signup         # Kayıt sayfası
/profile             # Kullanıcı profili
/artists             # Sanatçılar listesi
/artists/[id]        # Sanatçı detay sayfası
/appointments        # Randevular
/appointments/create # Yeni randevu
/admin               # Admin paneli
/admin/users         # Kullanıcı yönetimi
/admin/artists       # Sanatçı yönetimi
/admin/appointments  # Randevu yönetimi
```

## 🔧 Geliştirme

### Yeni Özellik Ekleme
1. Prisma şemasını güncelleyin
2. Migration oluşturun
3. API endpoint'lerini ekleyin
4. Frontend bileşenlerini oluşturun
5. Yetkilendirme kontrollerini ekleyin

### Veri Modeli Değişiklikleri
```bash
# Şema değişikliklerinden sonra
npx prisma migrate dev --name <migration-name>
npx prisma generate
```

## 📈 Gelecek Özellikler

- [ ] Gerçek zamanlı mesajlaşma
- [ ] Dosya yükleme (portfolyo görselleri)
- [ ] Email bildirimleri
- [ ] Ödeme sistemi entegrasyonu
- [ ] Mobil uygulama
- [ ] Çok dil desteği
- [ ] Sosyal medya paylaşımı

## 🤝 Katkıda Bulunma

1. Fork edin
2. Feature branch oluşturun
3. Değişikliklerinizi commit edin
4. Pull request gönderin

## 📄 Lisans

Bu proje [MIT Lisansı](LICENSE) altında lisanslanmıştır.

---

**TattooApp** - Tarzını yansıtmanın en kolay yolu! 🎨
