# Audit Tracker

Dokumen ini dipakai untuk tracking audit logic, UI, UX, accessibility, dan fitur yang masih kurang.

Status:
- `todo` = belum dikerjakan
- `doing` = sedang dikerjakan
- `done` = sudah selesai
- `skip` = sengaja tidak dikerjakan

Severity:
- `critical` = security / access / alur inti rusak
- `high` = UX inti terganggu atau rawan bug nyata
- `medium` = polish penting, accessibility, feedback state
- `low` = improvement nice-to-have

## Current Verdict

- Build production: `pass`
- Editor diagnostics: `pass`
- Overall product state: `usable`, dan untuk model app privat 1 pasangan setup akses sekarang sudah masuk akal. Gap utama yang tersisa ada di UX form, accessibility modal, flow clarity, dan beberapa fitur dasar universe/feed.

## Active Sprint Suggestion

### Sprint 1 — UX Core + Accessibility Basics

- [x] Rapikan login state button agar konsisten dan tidak campur SVG manual + Lucide
- [x] Ganti validasi setup wizard dari `alert()` ke inline error
- [x] Tambah accessibility dasar untuk modal letter dan password toggle
- [x] Tambah `for` pada label-label setup form

### Backlog Opsional — Pair-Only Hardening

- [ ] Tambah allowlist 2 email pasangan untuk `/core` dan `/universe` bila nanti ingin hard lock di level app

## Audit Items

| ID | Status | Severity | Area | Issue | Primary Files | Notes |
|---|---|---|---|---|---|---|
| A01 | todo | low | Access Hardening | Akses `/core` dan `/universe` belum di-hard-lock ke 2 email pasangan; untuk current requirement ini masih opsional | `src/lib/cms/auth.ts`, `src/pages/core/login.astro`, `src/pages/universe/login.astro` | Bukan blocker, hanya hardening tambahan |
| A02 | done | high | Login UX | State tombol login pakai spinner SVG manual lalu reset ke icon Lucide; rawan inkonsistensi state visual | `src/pages/core/login.astro` | Sudah dirapikan dengan helper state tombol yang konsisten |
| A03 | done | high | Setup UX | Validasi setup wizard masih pakai `alert()` | `src/pages/core/setup.astro` | Sudah diganti ke inline validation + error banner |
| A04 | done | medium | Accessibility | Modal letter belum punya `role="dialog"`, `aria-modal`, close via `Escape`, dan focus handling | `src/components/ForeverSection.astro`, `public/js/script.js` | ARIA, keyboard trigger, Escape, dan focus restore sudah ditambahkan |
| A05 | done | medium | Accessibility | Label form setup belum terkait ke input via atribut `for` | `src/pages/core/setup.astro` | Sudah ditambahkan ke semua field setup form |
| A06 | done | medium | Accessibility | Tombol show/hide password belum punya `aria-label` | `src/pages/core/login.astro` | Sudah pakai `aria-label` dan `aria-pressed` dinamis |
| A07 | todo | medium | Media UX | Music player tidak punya feedback kalau audio gagal load / autoplay diblok | `src/components/MusicPlayer.astro`, `public/js/script.js` | Tambah fallback ringan |
| A08 | todo | medium | Flow clarity | Secret login modal masih dirender di landing page, tapi trigger 5x klik sekarang redirect ke universe login | `src/pages/index.astro`, `src/components/SecretLoginModal.astro` | Putuskan: hapus modal atau pakai lagi |
| A09 | todo | medium | Feed UX | Belum ada UI edit/hapus post walau service delete sudah ada | `src/pages/universe/*.astro`, `src/lib/firestore-service.js` | Fitur penting untuk maintenance |
| A10 | todo | medium | Feed UX | Belum ada search/filter timeline di halaman `us` | `src/pages/us.astro` | Berguna saat post makin banyak |
| A11 | todo | medium | Upload UX | Belum ada indikator progress upload media | `src/pages/universe/upload.astro`, `src/lib/firestore-service.js` | Biar user tidak bingung saat upload lama |
| A12 | todo | low | Theme UX | Toggle dark mode belum memberi indikator visual state yang kuat | `src/layouts/Layout.astro`, `src/components/Navbar.astro` | Nice-to-have |

## Change Log

### 2026-03-13

- Initial audit tracker dibuat dari hasil audit logic/UI/UX seluruh app.
- A03 selesai: setup wizard sekarang pakai inline validation untuk field wajib dan error banner untuk kegagalan submit.
- A05 selesai: semua label di setup wizard sekarang terhubung ke input via atribut `for`.
- A04 selesai: modal letter sekarang punya semantic dialog dasar, keyboard trigger, Escape close, dan focus restore.
- A06 selesai: password toggle sekarang punya `aria-label` dan `aria-pressed` yang update sesuai state.
- A02 selesai: state tombol login sekarang konsisten untuk idle, loading, dan success tanpa campur render SVG manual.
- Dokumentasi yang sudah dirapikan sebelumnya:
  - `README.md`
  - `SETUP.md`
  - `MIGRATION_PLAN.md`

## Execution Notes

- Kerjakan berdasarkan ID agar gampang ditrack di commit dan review.
- Rekomendasi format commit per item: `fix(audit): resolve A03 setup inline validation`
- Setelah 1 item selesai, update status di dokumen ini sebelum pindah ke item berikutnya.