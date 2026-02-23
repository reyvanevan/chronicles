# Astro Migration Plan - World of Anya

This document outlines the systematic plan to refactor the "World of Anya" project from static HTML/JS to the Astro framework.

## 🎯 Goals
- **Improve Performance**: Remove Tailwind CDN and optimize assets.
- **Maintainability**: Use components for reusable elements (Navbar, Footer, Cards).
- **Better DX**: Centralized configuration and better project structure.
- **SEO & Optimization**: Better metadata handling and image optimization.

## 🛠 Tech Stack
- **Framework**: [Astro](https://astro.build/)
- **Styling**: Tailwind CSS (Native Integration)
- **Icons**: Lucide (via `@lucide/astro` or scripts)
- **Animations**: AOS (Animate On Scroll)
- **Database/Auth**: Firebase Firestore & Auth
- **Environment Variables**: Managed via `.env` files

## 📅 Roadmap & TODOs

### Phase 1: Project Initialization 🏗️
- [x] Initialize Astro project in a temporary subdirectory or directly.
- [x] Install dependencies:
    - `astro`
    - `@astrojs/tailwind` blending to `@tailwindcss/vite`
    - `firebase`
    - `@lucide/astro`
- [x] Configure Tailwind (Moved custom logic to `src/styles/global.css`).
- [x] Set up project structure (`src/components`, `src/layouts`, `src/pages`, `src/styles`, `src/lib`).

### Phase 2: Core Components & Layouts 🧩
- [x] Create `MainLayout.astro`:
    - Move head metadata (fonts, meta tags).
    - Implement AOS initialization.
    - Implement Theme Toggle logic (Dark/Light mode).
- [x] Create `Navbar.astro`:
    - Extract from `index.html`.
    - Make links dynamic/active.
- [x] Create `Footer.astro`.
- [ ] Create `AnyaCard.astro` or similar reusable UI components (Will do as part of pages).

### Phase 3: Data & Logic Migration 🔐
- [ ] Move Firebase config to `src/lib/firebase.js`.
- [ ] Refactor `firestore-service.js` to modern ESM modules compatible with Astro.
- [ ] Implement environment variables for Firebase keys (`.env`).
- [ ] Migrate `script.js` global logic to appropriate components or a global script.

### Phase 4: Pages Migration 📄
- [ ] **Home Page**: Migrate `index.html` to `src/pages/index.astro`.
- [ ] **Her Page**: Migrate `her.html` to `src/pages/her.astro`.
- [ ] **Him Page**: Migrate `him.html` to `src/pages/him.astro`.
- [ ] **Us Page**: Migrate `us.html` to `src/pages/us.astro`.
- [ ] **Login**: Migrate `login2.html` and secret login logic.
- [ ] **Universe/Sub-pages**: Handle dynamic routing or static files in `universe/`.

### Phase 5: Asset Optimization & Polish ✨
- [ ] Move images from `universe/` to `public/` or `src/assets/`.
- [ ] Use `<Image />` component from `astro:assets` for automatic optimization.
- [ ] Final testing of all interactive elements (Love progress, Firebase updates).
- [ ] Cleanup unused files (`us-old.html`, etc).

## 📊 Progress Tracking
| Phase | Status | Task |
| :--- | :--- | :--- |
| 1 | ✅ Done | Project Init |
| 2 | ✅ Done | Layouts & Components |
| 3 | ⏳ Pending | Firebase Integration |
| 4 | ⏳ Pending | Pages Migration |
| 5 | ⏳ Pending | Optimization |

---
*Created on: 2026-02-23*
