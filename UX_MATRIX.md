# Chronicles UX Matrix

Dokumen ini jadi acuan pembagian UX per portal sebelum implementasi fitur baru.
Fokus utama: bedakan fungsi `publik`, `core`, dan `universe` supaya alur user jelas dan konsisten.

## 1) Portal Identity Matrix

| Portal | Tujuan Utama | Audiens | Auth | Karakter UX | Entry Route Utama |
| --- | --- | --- | --- | --- | --- |
| Public Portal | Storytelling dan showcase hubungan | Pengunjung umum + partner | Tidak wajib | Cinematic, emotional, browsing santai | `/`, `/her`, `/him`, `/us` |
| Core Portal | CMS untuk kelola konten dan konfigurasi | Admin/owner | Wajib login | Utility-first, padat info, cepat edit-save | `/core/login`, `/core`, `/core/setup` |
| Universe Portal | Private daily space untuk interaksi dan memory loop | Partner terautentikasi | Wajib login | Mobile-first, personal, habit-forming | `/universe/login`, `/universe/home` |

## 2) Navigation Model Matrix

| Portal | Header/Nav Pattern | Primary Actions | Secondary Actions | Exit/Back Pattern |
| --- | --- | --- | --- | --- |
| Public Portal | Top navbar klasik + section scroll | Explore story, lihat profil, baca timeline | Theme toggle, music, scroll progress | Kembali via navbar links |
| Core Portal | Sidebar dashboard + section anchors | Edit konten, upload, save config | Theme toggle, stats monitoring | Logout ke `/core/login` |
| Universe Portal | Mobile sticky header + bottom nav | Lihat feed, upload memory, buka profile | Explore/filter/tag/story viewer | Logout ke `/universe/login` |

## 3) Feature Placement Matrix (Portal-Aware)

Keterangan label:
- `Primary`: tempat fitur utama dipakai.
- `Config`: tempat fitur diatur/admin.
- `Preview`: hanya tampilan ringkas/teaser.
- `No`: tidak ditampilkan.

| Fitur | Public | Universe | Core | Owner/Editor | Catatan UX |
| --- | --- | --- | --- | --- | --- |
| Dynamic Age (real-time) | Preview | Primary | Config | Partner A/B | Public tampil agregat, detail di Universe |
| Life Progress Bars | Preview | Primary | Config | Partner A/B | Hindari data terlalu personal di Public |
| Time Breakdown | Preview | Primary | Config | Partner A/B | Universe tampil lengkap + milestone |
| The Seasons Label | Preview | Primary | Config | Partner A/B | Label harus konsisten di semua portal |
| Daily Dashboard (clock/weather) | No | Primary | Config | Partner A/B | Nature-nya personal, bukan publik |
| Sticky Notes / Quick Reminders | No | Primary | Config | Partner A/B | Universe sebagai daily desk |
| Thesis/Project Tracker | No | Primary | Config | Partner A/B | Core hanya untuk pengaturan template |
| Mood Journal | No | Primary | Config | Partner A/B | Data sensitif, private only |
| On This Day | Preview | Primary | Config | Partner A/B | Public hanya curated memory |
| Virtual Letterbox | No | Primary | Config | Partner A/B | Unlock schedule di-set dari Core |
| AI Assistant | No | Primary | Config | Partner A/B | Persona/tone dikontrol dari Core |
| Mood Playlist (Spotify) | No | Primary | Config | Partner A/B | Bergantung mood journal |
| Finance/Savings Tracker | No | Primary | Config | Partner A/B | Private only, no public exposure |
| Shared Link Archive | No | Primary | Config | Partner A/B | Utility internal pasangan |
| Our Story Progress | Preview | Primary | Config | Partner A/B | Public bisa lihat versi clean/non-sensitive |

## 4) Permission Matrix

| Area | Guest (Public Visitor) | Partner A (Princess) | Partner B (Guardian/Admin) |
| --- | --- | --- | --- |
| Public Portal | View only | View | View |
| Universe Feed | No access | View/Create/Edit own content | View/Create/Edit own content |
| Universe Shared Widgets | No access | View + update shared values (sesuai role policy) | View + update shared values (sesuai role policy) |
| Core Dashboard | No access | Limited edit (jika policy mengizinkan) | Full edit |
| Core Setup/Config | No access | No default / limited | Full access |

## 5) UX Rules Per Portal

### Public Portal Rules
- Prioritaskan storytelling flow, bukan form dan kontrol teknis.
- Data yang tampil wajib aman untuk publik.
- CTA arahkan user ke pengalaman private hanya jika login tersedia.

### Core Portal Rules
- Semua aksi edit harus punya state jelas: loading, success, error.
- Struktur form dan section mengikuti mental model konten situs.
- Setiap perubahan penting punya preview atau dampak yang terlihat.

### Universe Portal Rules
- Semua interaksi utama harus nyaman one-hand mobile.
- Fokus ke loop harian: check feed, update mood, catat progress, upload memory.
- Komponen private harus cepat diakses, minim friksi, dan personal.

## 6) Data Sensitivity Matrix

| Data Type | Sensitivity | Allowed Portal | Display Strategy |
| --- | --- | --- | --- |
| Profile basic (nama, foto, bio ringan) | Low | Public, Universe, Core | Bisa full di semua portal |
| Mood entries harian | High | Universe, Core | Private by default |
| Reminder, notes, task pribadi | High | Universe, Core | Jangan expose ke Public |
| Finance/savings bersama | High | Universe, Core | Private only + role aware |
| AI chat history | High | Universe, Core | Private only |
| Progress agregat hubungan | Medium | Public, Universe, Core | Public hanya versi ringkas |

## 7) Content Ownership Matrix

| Domain Konten | Source of Truth | Edit Surface | Render Surface |
| --- | --- | --- | --- |
| Landing content (`/`) | Firestore `landing/*` | Core | Public + Universe partial |
| Profile Her/Him | Firestore `landing/profileHer`, `landing/profileRey` | Core (dan Universe jika role enable) | Public + Universe |
| Feed/Stories | Firestore `posts`, `stories` | Universe | Universe (+ curated teaser di Public opsional) |
| Site settings | Firestore `config/site` | Core | Semua portal (sesuai kebutuhan) |

## 8) MVP UX Scope (Portal-Safe)

Urutan implementasi paling aman agar UX tidak rancu:
1. Universe: Dynamic age + life progress + time breakdown (Primary).
2. Core: panel config untuk parameter fitur waktu/progress.
3. Public: teaser card progress tanpa data sensitif.
4. Universe: notes, mood journal, on-this-day.
5. Core: policy, visibility toggles, integration setup (Google/Spotify/AI).

## 9) Acceptance Checklist

- Setiap fitur baru punya keputusan placement: `Public`, `Universe`, `Core`, atau kombinasi.
- Tidak ada fitur private yang bocor ke Public.
- `Core` tetap jadi pusat konfigurasi, bukan tempat konsumsi harian.
- `Universe` tetap jadi ruang interaksi harian, bukan dashboard admin.
- Navigasi dan tone tiap portal tetap konsisten dengan pola existing.
