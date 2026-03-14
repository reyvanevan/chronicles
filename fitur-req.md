# Chronicles Feature Roadmap

Dokumen ini merangkum fitur request dari teman lo jadi roadmap implementasi yang lebih rapi dan bisa langsung dieksekusi bertahap.

Referensi utama pembagian UX per portal ada di `UX_MATRIX.md`.
Task breakdown teknis per route ada di `IMPLEMENTATION_TASKLIST.md`.

## Progress Sekarang

- Foundation portal-aware sudah kebentuk: planning docs, service modularization, config contract, dan visibility guard.
- Phase 1 quick wins sudah terkirim untuk `Universe`, `Core`, dan `Public`.
- Fokus berikutnya pindah ke modul daily utility dan sentimental di `Phase 2`.

## Goals

- Bikin web Chronicles lebih "hidup": praktis dipakai harian, tetap sentimental, dan punya nilai teknis unik.
- Prioritaskan fitur yang cepat terlihat impact-nya dulu, lalu naik ke fitur integrasi/API.
- Jaga scope supaya tetap realistis untuk dikerjain bertahap.
- Jaga batas portal supaya UX tidak campur aduk:
    - `Public`: storytelling/showcase.
    - `Universe`: daily interaction (private).
    - `Core`: konfigurasi/admin.

## Portal Boundary (Wajib)

- `Public` hanya menampilkan konten aman + versi teaser untuk data agregat.
- `Universe` jadi tempat utama pakai fitur harian (mood, notes, progress, tracker).
- `Core` jadi pusat konfigurasi, policy, visibility, dan integrasi.
- Data private tidak boleh tampil detail di `Public`.

## Prioritas

- `P0 (MVP impact cepat)`: Time & life widgets + dashboard dasar + notes/reminder.
- `P1 (Value tinggi)`: Mood journal, on this day, project tracker, shared resources.
- `P2 (Integrasi advanced)`: AI assistant, Spotify mood playlist, Google Calendar full sync.

## Feature Placement (Sinkron UX Matrix)

Keterangan:

- `Primary` = tempat fitur dipakai utama.
- `Config` = tempat fitur dikonfigurasi.
- `Preview` = teaser/versi ringkas.

| Fitur | Public | Universe | Core |
| --- | --- | --- | --- |
| Dynamic Age + Life Progress + Time Breakdown + Seasons | Preview | Primary | Config |
| Daily Dashboard (clock/weather) | No | Primary | Config |
| Sticky Notes / Reminder | No | Primary | Config |
| Thesis/Project Tracker | No | Primary | Config |
| Mood Journal | No | Primary | Config |
| On This Day | Preview | Primary | Config |
| Virtual Letterbox | No | Primary | Config |
| AI Assistant | No | Primary | Config |
| Mood Playlist (Spotify) | No | Primary | Config |
| Finance/Savings Tracker | No | Primary | Config |
| Shared Link Archive | No | Primary | Config |
| Our Story Progress | Preview | Primary | Config |

## Phase Plan

## Phase 1 - Quick Wins (1-2 minggu)

Fokus: fitur yang langsung bikin halaman terasa aktif dan personal.

- [x] `Universe` (Primary): Dynamic Age (real-time) dari tanggal lahir `2002-03-18`.
- [x] `Universe` (Primary): Life Progress Bars:
    - [x] Life progress (asumsi expectancy 80 tahun).
    - [x] Yearly progress (menuju ulang tahun).
    - [x] Day progress.
- [x] `Universe` (Primary): Time Breakdown:
    - [x] Total hari hidup.
    - [x] Total jam hidup.
    - [x] Estimasi total nafas.
    - [x] Next milestone (misal: H-4 menuju usia berikutnya).
- [x] `Universe` (Primary): Psychological label "The Seasons".
- [x] `Universe` (Primary): Daily Dashboard mini:
    - [x] Digital clock estetik.
    - [x] Cuaca (API ringan, cache client-side sederhana).
- [x] `Core` (Config): panel parameter waktu/progress (birth date, expectancy, label musim).
- [x] `Public` (Preview): card ringkas progress tanpa data private detail.

Output akhir Phase 1:

- Universe punya elemen real-time yang aktif.
- Core bisa ngatur parameter fitur waktu/progress.
- Public dapat teaser aman yang tetap menarik.

## Phase 2 - Productivity + Sentimental Core (2-4 minggu)

Fokus: utility harian + emotional hooks.

- [ ] `Universe` (Primary): Sticky Notes & Quick Reminders.
- [ ] `Universe` (Primary): Thesis/Project Tracker.
- [ ] `Universe` (Primary): Mood Journal + kalender warna.
- [ ] `Universe` (Primary): On This Day (flashback tanggal sama).
- [ ] `Universe` (Primary): Virtual Letterbox (jadwal buka tertentu).
- [ ] `Universe` (Primary): Shared Resources:
    - [ ] Finance/Savings Tracker.
    - [ ] Shared Link Archive.
- [ ] `Core` (Config): rules visibility, template konten, dan policy role fitur private.
- [ ] `Public` (Preview): curated "On This Day"/timeline card (opsional, non-sensitive).

Output akhir Phase 2:

- Universe matang sebagai desk harian + sentimental private space.
- Core punya kontrol policy untuk konten private.

## Phase 3 - Smart Integrations (4+ minggu)

Fokus: diferensiasi teknis (AI + third-party integration).

- [ ] `Universe` (Primary): Google Calendar agenda harian.
- [ ] `Universe` (Primary): Anggia's Personal AI:
    - [ ] Chatbot pengingat/supportive companion.
    - [ ] Persona tone yang disesuaikan.
- [ ] `Universe` (Primary): Automatic Mood Playlist (Spotify API).
- [ ] `Universe` (Primary): Our Story Progress.
- [ ] `Core` (Config): OAuth setup, API keys mapping, persona config, fallback policy.
- [ ] `Public` (Preview): Our Story Progress versi ringkas.

Output akhir Phase 3:

- Chronicles jadi platform personal yang jelas: Public untuk cerita, Universe untuk interaksi, Core untuk kontrol.

## Teknis Implementasi (Ringkas)

- Frontend:
    - [ ] Progress ring pakai SVG/Canvas.
    - [ ] Update angka real-time dengan interval `100ms` (khusus dynamic age).
- Logic waktu:
    - [ ] Hitung selisih `current_date` vs `birth_date`.
    - [ ] Utility date terpusat supaya mudah dites dan dipakai ulang.
- Data layer:
    - [ ] Simpan notes, mood, tracker, letterbox, links di backend yang sudah dipakai project.
- Integrasi eksternal:
    - [ ] Google Calendar API.
    - [ ] Spotify API.
    - [ ] LLM endpoint untuk assistant.

## Delivery Sequence (Portal-Safe)

1. `Universe` implement fitur utama.
2. `Core` tambah panel konfigurasi + policy.
3. `Public` expose teaser aman.
4. Validasi permission dan data privacy lintas portal.

## Backlog / Nice to Have

- [ ] Notifikasi pintar (jam kuliah, deadline tugas, reminder mood check-in).
- [ ] Weekly insight dari mood journal + produktivitas.
- [ ] Theme progress card "Our Story" yang bisa dishare.

## Risks & Catatan

- Integrasi pihak ketiga (Google/Spotify/LLM) butuh setup auth dan rate-limit handling.
- Fitur real-time harus dijaga supaya tidak bikin performa turun di mobile.
- Data sentimental perlu perhatian privasi dan akses control.
- Risiko UX utama: fitur private bocor ke public jika boundary portal tidak ketat.

## Definisi Selesai per Fitur

Sebuah fitur dianggap selesai jika:

- [ ] UI responsive desktop + mobile.
- [ ] State/data tersimpan dan bisa dimuat ulang.
- [ ] Ada handling error dasar.
- [ ] Ada validasi manual untuk edge case tanggal/waktu.
- [ ] Placement fitur sesuai `UX_MATRIX.md`.
- [ ] Permission/visibility sudah lolos cek role (`Guest`, `Partner A`, `Partner B/Admin`).