# Chronicles Implementation Tasklist

Dokumen ini menurunkan `UX_MATRIX.md` dan `fitur-req.md` ke level implementasi teknis per route.

Referensi:
- `UX_MATRIX.md`
- `fitur-req.md`

## 1) Scope Guardrails

- `Public` hanya teaser/agregat (no private detail).
- `Universe` adalah surface utama fitur harian.
- `Core` adalah surface konfigurasi/policy.
- Semua fitur baru wajib lolos cek role dan visibility.

## Status Snapshot

- Phase 1 foundation selesai: config seed, helper/service contract, Universe widgets, Core config panel, dan Public teaser.
- Phase 2 baru mulai lewat module `notes/reminders` di `Universe home`.
- Fokus berikutnya pindah ke `mood journal`, `project tracker`, `letterbox`, dan `shared resources`.
- Guard public vs private sudah mulai diterapkan lewat `config/timeProgress` dan `config/featureVisibility`.

## 2) Route Mapping (Execution Surface)

| Portal | Route | Peran |
| --- | --- | --- |
| Universe | `/universe/home` | Hub utama widget harian + feed context |
| Universe | `/universe/explore` | Eksplor memories + filter terkait fitur jurnal/flashback |
| Universe | `/universe/upload` | Input memory, metadata, mood/tag extension |
| Universe | `/universe/her`, `/universe/him` | Profile-specific modules (progress/journal card opsional) |
| Core | `/core` | Konfigurasi parameter fitur + policy role/visibility |
| Core | `/core/setup` | Seed default config untuk fitur baru |
| Public | `/` | Teaser progress card + curated preview |
| Public | `/us` | Curated timeline/flashback tanpa data sensitif |

## 3) Data Contract Tasks

### 3.1 Firestore Schema Additions

- [x] Tambah dokumen config fitur waktu/progress (misal `config/timeProgress`).
- [x] Tambah dokumen config privacy/visibility (misal `config/featureVisibility`).
- [ ] Tambah koleksi mood journal (misal `moodEntries`).
- [ ] Tambah koleksi notes/reminders (misal `quickNotes`).
- [ ] Tambah koleksi project tracker (misal `projectTracks`).
- [ ] Tambah koleksi virtual letterbox (misal `letterbox`).
- [ ] Tambah koleksi shared resources (finance/link archive).

### 3.2 Service Layer

File target utama:
- `src/lib/firestore-service.js`
- `src/lib/cms/config.ts`
- `src/lib/cms/content.ts`
- `src/lib/cms/dashboard.ts`

Tasks:
- [x] Buat helper read/write untuk time progress config.
- [x] Buat helper CRUD untuk mood journal.
- [x] Buat helper CRUD untuk quick notes/reminders.
- [x] Buat helper CRUD untuk project tracker.
- [x] Buat helper CRUD untuk letterbox.
- [x] Buat helper CRUD untuk finance tracker dan link archive.
- [x] Buat helper visibility check per portal.

## 4) Phase 1 Tasks (Quick Wins)

## 4.1 Universe Primary

File target utama:
- `src/pages/universe/home.astro`
- (opsional shared UI) `src/components/` atau `src/components/core/` bila dipisah komponen

Tasks:
- [x] Tambah widget `Dynamic Age` real-time.
- [x] Tambah widget `Life Progress` (life/year/day).
- [x] Tambah widget `Time Breakdown` (days/hours/breath estimate/milestone).
- [x] Tambah label `Seasons` berdasarkan umur.
- [x] Tambah mini dashboard card (clock + weather).
- [x] Pastikan layout mobile-first tetap nyaman satu tangan.

Acceptance:
- [x] Update realtime berjalan stabil.
- [x] Tidak ada blocking pada feed utama.
- [x] Data fallback aman saat config belum ada.

## 4.2 Core Config

File target utama:
- `src/pages/core/index.astro`
- `src/components/core/SectionSiteConfig.astro`
- `src/lib/cms/config.ts`

Tasks:
- [x] Tambah form config birth date, life expectancy, season labels.
- [x] Tambah toggle visibility `Public Preview` untuk progress card.
- [x] Tambah validasi input + save state (loading/success/error).

Acceptance:
- [x] Perubahan config langsung terbaca oleh Universe.
- [x] Error handling jelas di UI admin.

## 4.3 Public Preview

File target utama:
- `src/pages/index.astro`
- `src/pages/us.astro`

Tasks:
- [x] Tambah card teaser progress agregat (no sensitive detail).
- [x] Tambah fallback bila visibility dimatikan dari Core.
- [x] Pastikan copywriting tetap storytelling, bukan dashboard-like.

Acceptance:
- [x] Tidak ada data private ter-render di public source.
- [x] UI tetap menyatu dengan landing experience.

## 5) Phase 2 Tasks (Productivity + Sentimental)

## 5.1 Universe Primary

File target utama:
- `src/pages/universe/home.astro`
- `src/pages/universe/explore.astro`
- `src/pages/universe/upload.astro`
- `src/pages/universe/her.astro`
- `src/pages/universe/him.astro`

Tasks:
 - [x] Sticky notes + quick reminders module.
- [ ] Thesis/project tracker module.
- [ ] Mood journal module + calendar heatmap sederhana.
- [ ] On This Day module (tanggal sama tahun sebelumnya).
- [ ] Virtual letterbox module (time-gated open).
- [ ] Shared resources module (finance + links).

Acceptance:
- [ ] Semua modul persist dan reload aman.
- [ ] Role ownership jelas untuk edit/delete.

## 5.2 Core Config

File target utama:
- `src/pages/core/index.astro`
- `src/components/core/SectionSiteConfig.astro`
- `src/lib/cms/config.ts`

Tasks:
- [ ] Tambah policy role-based access per fitur private.
- [ ] Tambah template/default content (letterbox, notes tags, tracker labels).
- [ ] Tambah visibility toggle untuk curated public preview.

## 5.3 Public Curated Preview

File target utama:
- `src/pages/us.astro`
- `src/pages/index.astro`

Tasks:
- [ ] Curated On This Day card (opsional, non-sensitive).
- [ ] Curated Our Story snippets.

## 6) Phase 3 Tasks (Smart Integrations)

## 6.1 Universe Primary

File target utama:
- `src/pages/universe/home.astro`
- `src/pages/universe/explore.astro`

Tasks:
- [ ] Integrasi Google Calendar block (agenda harian).
- [ ] Integrasi AI companion chat entry.
- [ ] Integrasi Spotify mood playlist.
- [ ] Our Story Progress full module.

## 6.2 Core Config

File target utama:
- `src/pages/core/index.astro`
- `src/components/core/SectionSiteConfig.astro`
- `src/lib/cms/config.ts`

Tasks:
- [ ] OAuth/API settings panel (Google/Spotify/AI).
- [ ] Persona/tone settings untuk AI assistant.
- [ ] Fallback strategy jika API gagal.

## 6.3 Public Preview

File target utama:
- `src/pages/index.astro`
- `src/pages/us.astro`

Tasks:
- [ ] Our Story Progress versi ringkas.
- [ ] Pastikan tidak expose credentials/data private.

## 7) Permission & Security Tasks

File target utama:
- `src/lib/cms/auth.ts`
- `src/lib/cms/dashboard.ts`
- `src/lib/firestore-service.js`
- (rules) Firebase security rules project

Tasks:
- [ ] Audit role check untuk Partner A/B dan guest.
- [ ] Tambah guard helper agar route public tidak fetch private docs.
- [ ] Tambah rule docs untuk koleksi private baru.
- [ ] Tambah sanitasi output public-preview.

## 8) QA Checklist by Portal

## 8.1 Universe QA

- [ ] Mobile layout aman di viewport kecil.
- [ ] Real-time widget tidak menurunkan performa signifikan.
- [ ] Semua module private hanya muncul untuk user authenticated.

## 8.2 Core QA

- [ ] Semua form config punya loading/success/error states.
- [ ] Save config langsung tercermin ke Universe/Public sesuai visibility.
- [ ] Role-based edit permissions tervalidasi.

## 8.3 Public QA

- [ ] Tidak ada data sensitif tampil di HTML/source/public API path.
- [ ] Teaser cards tetap naratif, bukan admin panel.
- [ ] Theme/style tetap konsisten dengan landing yang ada.

## 9) Suggested Build Order (Sprint-Friendly)

1. `Data contract + service helper`.
2. `Universe Phase 1 widgets`.
3. `Core config panel Phase 1`.
4. `Public teaser Phase 1`.
5. `Universe Phase 2 modules`.
6. `Core policy + template controls`.
7. `Public curated previews`.
8. `Integrations Phase 3`.
9. `Permission audit + QA hardening`.
