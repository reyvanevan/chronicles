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
- [x] Move Firebase config to `src/lib/firebase-config.js`.
- [x] Refactor `firestore-service.js` to modern ESM modules using NPM versions.
- [x] Implement environment variables for Firebase keys (`.env`).
- [x] Migrate `script.js` global logic to appropriate components or a global script.

### Phase 4: Pages Migration 📄
- [x] **Home Page**: Migrate `index.html` to `src/pages/index.astro`.
- [x] **Her Page**: Migrate `her.html` to `src/pages/her.astro`.
- [x] **Him Page**: Migrate `him.html` to `src/pages/him.astro`.
- [x] **Us Page**: Migrate `us.html` to `src/pages/us.astro`.
- [x] **Login**: Migrate `login2.html` and secret login logic (into universe/login).
- [x] **Universe/Sub-pages**: Handle dynamic routing or static files in `universe/` and `core/`.

### Phase 5: Asset Optimization & Polish ✨
- [x] Check for unused local assets from `universe/` & move them to Astro (None found, system uses Base64 via Firestore).
- [x] Remove `.html` extensions from internal `href` and scripted redirects for native Astro paths.
- [x] Final testing of all interactive elements (Love progress, Firebase updates).
- [x] Cleanup unused files (`us-old.html`, leftover flat HTML fragments).

## 📊 Progress Tracking
| Phase | Status | Task |
| :--- | :--- | :--- |
| 1 | ✅ Done | Project Init |
| 2 | ✅ Done | Layouts & Components |
| 3 | ✅ Done | Firebase Integration |
| 4 | ✅ Done | Pages Migration |
| 5 | ✅ Done | Optimization |

---
*Created on: 2026-02-23*
