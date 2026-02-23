# 🌸 World of Anya — Couples CMS

A private, customizable couples website with a full CMS dashboard. Built with **Astro**, **Firebase**, and **Tailwind CSS**.

---

## ✨ Features

- 🏠 **Public pages** — Home, Her page, His page, and Us page
- 🎛️ **CMS Dashboard** — Password-protected admin panel at `/core`
- 🖼️ **Gallery management** — Upload, view, and manage photos
- 💌 **Love letter editor** — Write and publish letters
- 📅 **Love progress tracker** — Milestone timeline with visibility toggle
- 👤 **Partner profiles** — Editable names, bios, photos, and roles
- ⚙️ **Site config** — Customize all labels, names, and text via setup wizard
- 🔐 **Auth** — Firebase Authentication (email/password)
- 🌙 **Dark mode** — Automatic system preference detection

---

## 🚀 Getting Started

### 1. Clone the repo

\`\`\`bash
git clone https://github.com/reyvanevan/chronicles.git
cd chronicles
npm install
\`\`\`

### 2. Set up Firebase

1. Go to [Firebase Console](https://console.firebase.google.com/) and create a new project
2. Enable **Authentication** (Email/Password provider)
3. Enable **Firestore Database** (start in production mode)
4. Go to **Project Settings → Your apps → Web app** and copy the config

### 3. Configure environment variables

\`\`\`bash
cp .env.example .env
\`\`\`

Then fill in your Firebase values in `.env`:

\`\`\`env
PUBLIC_FIREBASE_API_KEY=your_api_key_here
PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
PUBLIC_FIREBASE_PROJECT_ID=your_project_id
PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.firebasestorage.app
PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
PUBLIC_FIREBASE_APP_ID=your_app_id
PUBLIC_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX
\`\`\`

### 4. Create your admin account

In Firebase Console → Authentication → Add user. Use that email/password to log in at `/core/login`.

### 5. Run locally

\`\`\`bash
npm run dev
# Open http://localhost:4321
\`\`\`

### 6. First-time setup

On first login at `/core`, you'll be redirected to the **setup wizard** (`/core/setup`) where you configure:
- Site name & tagline
- Partner A & Partner B names, roles, and page slugs
- Default letter greeting/closing
- Start date for the "Days Together" counter

---

## 📁 Project Structure

\`\`\`text
/
├── .env.example              # Environment variable template
├── src/
│   ├── lib/
│   │   ├── firebase-config.js      # Firebase init (reads from .env)
│   │   ├── firestore-service.js    # Shared Firestore helpers
│   │   └── cms/
│   │       ├── auth.ts             # Auth init + logout
│   │       ├── config.ts           # SiteConfig load/save/applyToDOM
│   │       ├── dashboard.ts        # Dashboard data loader
│   │       ├── content.ts          # Love progress + zero marker
│   │       ├── gallery.ts          # Gallery CRUD
│   │       └── profiles.ts         # Partner profile CRUD
│   ├── components/
│   │   └── core/
│   │       ├── Sidebar.astro
│   │       ├── SectionHero.astro
│   │       ├── SectionPrincessProfile.astro
│   │       ├── SectionReyProfile.astro
│   │       ├── SectionGallery.astro
│   │       ├── SectionLetter.astro
│   │       ├── SectionMemories.astro
│   │       ├── SectionSiteConfig.astro
│   │       └── GalleryUploadModal.astro
│   └── pages/
│       ├── index.astro             # Public home
│       ├── her.astro               # Partner A public page
│       ├── him.astro               # Partner B public page
│       ├── us.astro                # Shared memories page
│       ├── universe/               # Alternative public page set
│       └── core/
│           ├── login.astro         # Admin login
│           ├── index.astro         # CMS dashboard
│           ├── setup.astro         # First-run setup wizard
│           └── seed.astro          # Dev-only data seeder
└── public/
    └── js/
        ├── config.js               # Tailwind config (CDN)
        └── script.js               # Public page scripts
\`\`\`

---

## 🧞 Commands

| Command           | Action                                      |
| :---------------- | :------------------------------------------ |
| `npm install`     | Install dependencies                        |
| `npm run dev`     | Start local dev server at `localhost:4321`  |
| `npm run build`   | Build production site to `./dist/`          |
| `npm run preview` | Preview production build locally            |

---

## 🔐 Security Notes

- **Never commit `.env`** — it's gitignored by default
- `src/lib/firebase-config.js` reads exclusively from `PUBLIC_FIREBASE_*` env vars — no hardcoded fallbacks
- Firestore security rules should restrict write access to authenticated users only

---

## 🗄️ Firestore Data Structure

\`\`\`
config/
  site              # SiteConfig — set via setup wizard

profiles/
  partnerA          # Partner A profile data
  partnerB          # Partner B profile data

gallery/
  {docId}           # Photo entries (base64 + metadata)

letters/
  active            # Current published letter

memories/
  {docId}           # Memory/milestone entries

loveProgress/
  entries           # Progress entries
  visibility        # { isVisible: boolean }
\`\`\`

---

## 🛠️ Tech Stack

| Layer     | Technology                                              |
| :-------- | :------------------------------------------------------ |
| Framework | [Astro](https://astro.build)                            |
| Backend   | [Firebase](https://firebase.google.com) (Auth + Firestore) |
| Styling   | [Tailwind CSS](https://tailwindcss.com) (CDN)           |
| Icons     | [Lucide](https://lucide.dev)                            |
| Animation | [AOS](https://michalsnik.github.io/aos/)                |
