# 🌸 World of Anya — Couples Website

A private, intimate couples website with a full CMS dashboard. Built with **Astro**, **Firebase Firestore**, and **Tailwind CSS**.

> **Status (Feb 2026):** Fresh Firebase project setup in progress. UI overhauled to compact/clean design. Codebase refactored from monolithic `index.astro` into separate components.

---

## ✨ Features

- 🏠 **Public landing page** — Hero, Love Progress, About, Gallery, Memories, Letter sections
- 🌌 **Universe pages** — Private feed for Her, Him, Home, and Explore
- 🎛️ **CMS Dashboard** — Password-protected admin panel at `/core`
- 🖼️ **Gallery** — Scattered scrapbook-style photos, zig-zag layout (photos left, header sticky right)
- 📊 **Love Progress Tracker** — Real-time progress bar with history timeline & visibility toggle
- 💌 **Love Letter** — Editable letter displayed in a modal overlay
- 👤 **Partner Profiles** — Names, bios, photos loaded dynamically from Firestore
- ⚙️ **Site Config** — Setup wizard at `/core/setup` for first-run configuration
- 🔐 **Auth** — Firebase Authentication (email/password), secret 5-tap logo trigger
- 🌙 **Dark mode** — Automatic system preference + manual toggle via Navbar
- 🎵 **Background music** — Floating music player (fixed bottom-right)
- 📜 **Scroll Progress Bar** — Thin gradient bar fixed at top of page

---

## 🚀 Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/reyvanevan/chronicles.git
cd chronicles
npm install
```

### 2. Set up Firebase

See [SETUP.md](./SETUP.md) for full step-by-step instructions.

Short version:
1. Go to [Firebase Console](https://console.firebase.google.com/) and create a new project
2. Enable **Authentication** → Email/Password
3. Enable **Firestore Database** → Start in test mode → region `asia-southeast1`
4. Register a **Web app** and copy the config

### 3. Configure environment variables

```bash
cp .env.example .env
```

Then fill in your Firebase values in `.env`:

```env
PUBLIC_FIREBASE_API_KEY=your_api_key_here
PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
PUBLIC_FIREBASE_PROJECT_ID=your_project_id
PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.firebasestorage.app
PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
PUBLIC_FIREBASE_APP_ID=your_app_id
PUBLIC_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX
```

### 4. Create admin accounts

Firebase Console → Authentication → Add user (email + password).
Use those credentials to log in at `/core/login`.

### 5. Run locally

```bash
npm run dev
# Open http://localhost:4321
```

### 6. First-time setup

On first login at `/core`, you'll be redirected to `/core/setup` where you configure:
- Site name & tagline
- Partner A & Partner B names, roles, and page slugs
- Default letter greeting/closing
- Start date for the "Days Together" counter

---

## 📁 Project Structure

```text
/
├── .env                      # Firebase credentials (gitignored!)
├── .env.example              # Credential template — copy this
├── astro.config.mjs
├── tsconfig.json
├── src/
│   ├── lib/
│   │   ├── firebase-config.js      # Firebase init (reads from .env)
│   │   └── firestore-service.js    # All Firestore helpers + CRUD
│   ├── layouts/
│   │   └── Layout.astro            # Base HTML, Navbar, Footer, AOS, Lucide
│   ├── components/
│   │   ├── Navbar.astro
│   │   ├── Footer.astro
│   │   │
│   │   │   ── Landing Page Sections ──
│   │   ├── HeroSection.astro       # Hero + CTA buttons
│   │   ├── LoveProgress.astro      # Progress bar + history timeline
│   │   ├── AboutSection.astro      # Who is Anya? (sticky left + cards right)
│   │   ├── GallerySection.astro    # Scrapbook photos left, header sticky right
│   │   ├── MemoriesSection.astro   # 3-column memory cards
│   │   ├── ForeverSection.astro    # Letter modal + "Untuk Selamanya"
│   │   ├── MusicPlayer.astro       # Fixed floating music button
│   │   └── SecretLoginModal.astro  # Hidden admin login modal
│   └── pages/
│       ├── index.astro             # Landing page (imports all components above)
│       ├── her.astro               # Her public profile
│       ├── him.astro               # His public profile
│       ├── us.astro                # Shared memories page
│       ├── universe/               # Private universe (requires auth)
│       │   ├── index.astro
│       │   ├── home.astro
│       │   ├── her.astro
│       │   ├── him.astro
│       │   ├── explore.astro
│       │   ├── upload.astro
│       │   └── login.astro
│       └── core/                   # CMS Admin panel
│           ├── login.astro
│           ├── index.astro         # Dashboard
│           ├── setup.astro         # First-run setup wizard
│           └── seed.astro          # Dev-only data seeder
└── public/
    ├── music/
    │   └── about-you.mp3
    └── js/
        ├── config.js               # Tailwind CDN config
        ├── script.js               # Global helpers (openModal, closeModal, etc.)
        └── firebase-config.example.js
```

---

## 🧞 Commands

| Command             | Action                                     |
| :------------------ | :----------------------------------------- |
| `npm install`       | Install dependencies                       |
| `npm run dev`       | Start local dev server at `localhost:4321` |
| `npm run build`     | Build production site to `./dist/`         |
| `npm run preview`   | Preview production build locally           |

---

## 🔐 Security Notes

- **Never commit `.env`** — it's in `.gitignore` by default
- `src/lib/firebase-config.js` reads exclusively from `PUBLIC_FIREBASE_*` env vars — no hardcoded fallbacks
- Firestore security rules should be locked down before going public (see SETUP.md)

---

## 🗄️ Firestore Data Structure

```
landing/
  profile           # { name, bio, photo, tags[] }
  profileRey        # { photo }  — Rey's avatar for progress bar
  gallery           # { items: [{ url, caption }] }
  memories          # { items: [{ title, description, image }] }
  letter            # { title, content, quote }
  stats             # { totalVisits }
  sasukeImage       # { url }  — 0% side avatar on progress bar

loveProgress/
  current           # { currentProgress, lastUpdate, isVisible, history[] }

config/
  site              # SiteConfig — set via /core/setup wizard

posts/
  {docId}           # Universe feed posts { author, content, images[], timestamp }
```

---

## 🛠️ Tech Stack

| Layer     | Technology                                                  |
| :-------- | :---------------------------------------------------------- |
| Framework | [Astro](https://astro.build)                                |
| Backend   | [Firebase](https://firebase.google.com) (Auth + Firestore) |
| Styling   | [Tailwind CSS](https://tailwindcss.com) (v4 via Vite plugin) |
| Icons     | [Lucide](https://lucide.dev)                                |
| Animation | [AOS](https://michalsnik.github.io/aos/)                    |
