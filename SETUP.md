# World of Anya — Setup Guide

Panduan setup project untuk fresh install / Firebase project baru.

---

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Setup Firebase Project Baru

#### A. Buat Firebase Project
1. Buka [Firebase Console](https://console.firebase.google.com/)
2. Klik **"Add project"**
3. Masukkan nama project (contoh: `worldofanya`)
4. Enable/disable Google Analytics (optional)
5. Klik **"Create project"**

#### B. Daftarkan Web App
1. Di dashboard project, klik ikon **`</>`** (Web)
2. Kasih nama app (contoh: `worldofanya-web`)
3. Jangan centang Firebase Hosting
4. **Copy** firebaseConfig object yang muncul

#### C. Setup Firestore Database
1. Sidebar kiri → **Build > Firestore Database**
2. Klik **"Create database"**
3. Pilih **"Start in test mode"** (bisa di-lock nanti)
4. Pilih region: **`asia-southeast1`** (Singapore)
5. Klik **"Enable"**

#### D. Setup Authentication
1. Sidebar kiri → **Build > Authentication**
2. Klik **"Get started"**
3. Tab **"Sign-in method"** → **Email/Password** → Enable → Save

#### E. Buat User Accounts
1. Authentication → tab **"Users"**
2. Klik **"Add user"**
3. Buat akun untuk Rey (admin/observer) dan akun untuk Anya (atau sesuaikan)

---

### 3. Konfigurasi `.env`

```bash
cp .env.example .env
```

Buka `.env` dan isi dengan config dari Firebase Console:

```env
PUBLIC_FIREBASE_API_KEY=AIzaSy...
PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
PUBLIC_FIREBASE_PROJECT_ID=your-project-id
PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.firebasestorage.app
PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcdef
PUBLIC_FIREBASE_MEASUREMENT_ID=G-XXXXXXXX
```

> ⚠️ Jangan commit file `.env` ke git! Sudah ada di `.gitignore`.

---

### 4. Jalankan Project

```bash
npm run dev
# Buka http://localhost:4321
```

---

### 5. First-Time Setup di CMS

1. Buka `http://localhost:4321`
2. Klik logo Navbar 5x cepat untuk trigger secret login
3. Login dengan akun admin yang sudah dibuat
4. Akan diredirect ke `/core/setup` — isi semua konfigurasi awal:
   - Nama site & tagline
   - Nama Partner A & B, role, slug halaman
   - Salam pembuka/penutup surat
   - Tanggal mulai bersama
5. Setelah setup selesai, masuk ke `/core` untuk CMS dashboard

---

## 🗄️ Initial Firestore Data

Setelah login pertama kali, Firestore masih kosong. Beberapa collection akan dibuat otomatis saat pertama kali dipakai:

| Collection | Dibuat saat... |
|---|---|
| `config/site` | Setup wizard selesai |
| `landing/stats` | Visitor pertama masuk |
| `loveProgress/current` | Progress pertama di-update dari CMS |
| `landing/profile` | Data profil di-save dari CMS |
| `landing/gallery` | Foto pertama di-upload dari CMS |
| `landing/memories` | Memory pertama di-save dari CMS |
| `landing/letter` | Surat pertama di-publish dari CMS |

---

## 🔒 Firestore Security Rules (Production)

Setelah selesai testing, ganti rules di Firebase Console → Firestore → Rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Public read for landing data
    match /landing/{doc} {
      allow read: if true;
      allow write: if request.auth != null;
    }

    // Public read for love progress
    match /loveProgress/{doc} {
      allow read: if true;
      allow write: if request.auth != null;
    }

    // Auth-only for site config
    match /config/{doc} {
      allow read, write: if request.auth != null;
    }

    // Auth-only for universe posts
    match /posts/{doc} {
      allow read: if request.auth != null;
      allow write: if request.auth != null;
    }
  }
}
```

---

## 🔧 Update EMAIL_TO_AUTHOR Mapping

Di `src/lib/firestore-service.js`, ganti email mapping sesuai akun yang dibuat:

```javascript
export const EMAIL_TO_AUTHOR = {
    'email-kamu@domain.com': 'rey',
    'email-pasangan@domain.com': 'anya'
};
```

---

## 🆘 Troubleshooting

### App loading tapi data kosong
- Normal untuk fresh Firebase. Data akan muncul setelah di-seed via CMS.
- Buka browser console untuk melihat error Firestore.

### Login tidak bisa
- Pastikan email/password sesuai yang dibuat di Firebase Authentication.
- Pastikan Email/Password sign-in method sudah di-enable.

### Firebase config error / `app/no-app`
- Pastikan semua 7 variabel di `.env` sudah diisi benar.
- Restart dev server setelah mengubah `.env`: `npm run dev`.

### Firestore permission denied
- Cek rules — pastikan masih dalam test mode atau sudah dikonfigurasi.

---

Happy coding! 💙💗
