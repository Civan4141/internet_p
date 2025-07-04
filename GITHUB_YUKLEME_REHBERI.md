# 🚀 GitHub'a Proje Yükleme Rehberi

Bu rehber, TattooApp projenizi GitHub'a nasıl yükleyeceğinizi adım adım açıklamaktadır.

---

## 📋 Ön Hazırlık

### 1. GitHub Hesabı Oluşturun
- [GitHub.com](https://github.com) adresine gidin
- "Sign up" butonuna tıklayın
- Kullanıcı adı, email ve şifre belirleyin
- Email doğrulamasını tamamlayın

### 2. Git Kurulumu (Eğer Kurulu Değilse)
- [Git resmi sitesi](https://git-scm.com/downloads) üzerinden indirin
- Windows için Git Bash ile birlikte kurulur
- Kurulum sonrası terminalde test edin:
```bash
git --version
```

---

## 🔧 Git Konfigürasyonu

### 1. İlk Kurulum (Sadece Bir Kez Yapılır)
```bash
# Global kullanıcı bilgilerinizi ayarlayın
git config --global user.name "Adınız Soyadınız"
git config --global user.email "email@example.com"

# Varsayılan branch adını ayarlayın
git config --global init.defaultBranch main
```

### 2. SSH Key Oluşturma (Önerilen)
```bash
# SSH key oluşturun
ssh-keygen -t ed25519 -C "email@example.com"

# SSH agent'ı başlatın
eval "$(ssh-agent -s)"

# SSH key'i agent'a ekleyin
ssh-add ~/.ssh/id_ed25519

# Public key'i kopyalayın (Windows)
clip < ~/.ssh/id_ed25519.pub
```

### 3. GitHub'a SSH Key Ekleme
1. GitHub'da Settings > SSH and GPG keys'e gidin
2. "New SSH key" butonuna tıklayın
3. Kopyaladığınız public key'i yapıştırın
4. "Add SSH key" ile kaydedin

---

## 📁 Proje Hazırlığı

### 1. Gereksiz Dosyaları Temizleme
`.gitignore` dosyanızın şu içerikleri içerdiğinden emin olun:

```gitignore
# Dependencies
/node_modules
/.pnp
.pnp.js

# Production
/build
/.next/
/out/

# Runtime data
pids
*.pid
*.seed
*.pid.lock

# Environment variables
.env*
!.env.example

# Database
*.db
*.db-journal
prisma/migrations/

# IDE
.vscode/
.idea/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db

# Logs
npm-debug.log*
yarn-debug.log*
yarn-error.log*
```

### 2. Hassas Bilgileri Kontrol Edin
⚠️ **ÖNEMLİ**: Şu dosyaları asla GitHub'a yüklemeyin:
- `.env` dosyaları (database URL, secret key'ler)
- Gerçek şifreler veya API anahtarları
- Kişisel bilgiler

### 3. Örnek Environment Dosyası Oluşturun
```bash
# .env.example dosyası oluşturun
cp .env .env.example
```

`.env.example` dosyasını düzenleyerek gerçek değerleri örnek değerlerle değiştirin:
```env
# Database
DATABASE_URL="file:./dev.db"

# NextAuth
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"
```

---

## 🌐 GitHub Repository Oluşturma

### 1. GitHub'da Yeni Repository
1. GitHub'da sağ üst köşedeki "+" işaretine tıklayın
2. "New repository" seçin
3. Repository ayarları:
   - **Repository name**: `tattoo-app` (veya istediğiniz isim)
   - **Description**: "Dövme Randevu ve Mesajlaşma Sistemi - Next.js & Prisma"
   - **Visibility**: Public (açık kaynak) veya Private
   - **Initialize**: README, .gitignore ve license seçmeyin (zaten mevcut)

### 2. Repository URL'ini Kopyalayın
Oluşturulan repository sayfasında:
- SSH kullanıyorsanız: `git@github.com:kullaniciadi/tattoo-app.git`
- HTTPS kullanıyorsanız: `https://github.com/kullaniciadi/tattoo-app.git`

---

## 📤 Proje Yükleme

### 1. Proje Klasörüne Gidin
```bash
cd c:\dovmeci_auth\tattoo-app
```

### 2. Git Repository'sini Başlatın
```bash
# Git repository'sini başlat
git init

# Uzak repository'yi ekle (SSH)
git remote add origin git@github.com:kullaniciadi/tattoo-app.git

# VEYA HTTPS kullanıyorsanız:
# git remote add origin https://github.com/kullaniciadi/tattoo-app.git
```

### 3. İlk Commit'i Yapın
```bash
# Tüm dosyaları staging area'ya ekle
git add .

# İlk commit'i oluştur
git commit -m "🎉 İlk commit: Dövme randevu sistemi uygulaması

- Next.js 15 + TypeScript
- Prisma ORM + SQLite
- NextAuth.js kimlik doğrulama
- Tailwind CSS responsive tasarım
- Admin paneli ve kullanıcı yönetimi
- Randevu sistemi ve mesajlaşma
- Tam Türkçe arayüz
- Production ready"

# Ana branch'i main olarak ayarla
git branch -M main

# GitHub'a push et
git push -u origin main
```

---

## ✅ Doğrulama ve Test

### 1. GitHub'da Kontrol Edin
- Repository sayfanızda dosyaların görünür olduğunu kontrol edin
- README.md dosyasının düzgün görüntülendiğini doğrulayın
- `.env` dosyasının yüklenmediğini (gitignore sayesinde) kontrol edin

### 2. Clone Testi
```bash
# Başka bir klasöre clone edip test edin
git clone git@github.com:kullaniciadi/tattoo-app.git test-clone
cd test-clone
npm install
npm run build
```

---

## 🔄 Gelecek Güncellemeler

### Değişiklikleri GitHub'a Gönderme
```bash
# Değişiklikleri kontrol et
git status

# Değişiklikleri ekle
git add .

# Commit mesajı yaz
git commit -m "✨ Yeni özellik: [açıklama]"

# GitHub'a gönder
git push origin main
```

### Branch Oluşturma
```bash
# Yeni özellik için branch oluştur
git checkout -b feature/yeni-ozellik

# Değişiklikleri yap ve commit et
git add .
git commit -m "🚀 Yeni özellik eklendi"

# Branch'i GitHub'a gönder
git push origin feature/yeni-ozellik
```

---

## 📚 Yararlı Git Komutları

```bash
# Repository durumunu kontrol et
git status

# Commit geçmişini görüntüle
git log --oneline

# Değişiklikleri geri al (commit öncesi)
git checkout -- <dosya-adi>

# Son commit'i geri al
git reset --soft HEAD~1

# Remote repository bilgilerini görüntüle
git remote -v

# Branch'leri listele
git branch -a

# Başka branch'e geç
git checkout <branch-adi>
```

---

## 🚨 Güvenlik Uyarıları

### ❌ Asla GitHub'a Yüklemeyin:
- `.env` dosyaları
- API anahtarları ve secret key'ler
- Gerçek kullanıcı şifreleri
- Kişisel bilgiler
- Production veritabanı dosyaları

### ✅ Güvenli Paylaşım:
- `.env.example` dosyası kullanın
- README'de test hesapları belirtin
- Hassas bilgileri environment variables olarak saklayın
- Production için ayrı konfigürasyon kullanın

---

## 📞 Yardım ve Sorun Giderme

### Yaygın Sorunlar:

**1. "Permission denied" hatası:**
```bash
# SSH key'inizi kontrol edin
ssh -T git@github.com
```

**2. "Repository not found" hatası:**
```bash
# Remote URL'yi kontrol edin
git remote -v
git remote set-url origin <doğru-url>
```

**3. "Large file" uyarısı:**
```bash
# Büyük dosyaları .gitignore'a ekleyin
echo "büyük-dosya.zip" >> .gitignore
```

### Ek Kaynaklar:
- [GitHub Docs](https://docs.github.com/)
- [Git Handbook](https://guides.github.com/introduction/git-handbook/)
- [Pro Git Book](https://git-scm.com/book)

---

## 🎯 Sonuç

Bu rehberi takip ederek projenizi güvenli bir şekilde GitHub'a yükleyebilir ve paylaşabilirsiniz. Repository'nizi public yaparak açık kaynak topluluğuna katkıda bulunabilir, private tutarak kişisel portföyünüzde saklayabilirsiniz.

**Başarılar!** 🚀

---

**Not**: Bu rehber Windows PowerShell için hazırlanmıştır. macOS/Linux için terminal komutları benzerdir ancak SSH key konumları farklı olabilir.
