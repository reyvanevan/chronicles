# Steins;Gate Theming Tracker

Okabe Rintaro (cowok/him) × Kurisu Makise (cewek/her)

**Referensi lore:**
- Okabe = "Hououin Kyouma" (alias mad scientist), memanggil Kurisu = "Christina" / "The Zombie"
- Kurisu = neuroscientist genius, tsundere, suka bilang "You'd better take responsibility"
- Lab = Future Gadget Laboratory (FGL)
- SERN = villain organization
- Reading Steiner = kemampuan Okabe mengingat lintas worldline
- El Psy Kongroo = sign-off phrase Okabe
- D-Mail = pesan ke masa lalu
- Worldline = timeline/semesta paralel
- 1.048596% = worldline di mana Kurisu selamat (Steins;Gate worldline)

---

## BATCH 1 — Login Pages ✅

### `src/pages/core/login.astro` (Okabe's POV — akses Lab/CMS)
| Sebelum | Sesudah | Status |
|---|---|---|
| `Chronicles - System Access` (title) | `Future Gadget Lab — Restricted Access` | ✅ |
| `System Operational` (badge) | `Worldline Stable` | ✅ |
| feather icon | `flask-conical` | ✅ |
| `Chronicles Access` (h1) | `Lab Member Access` | ✅ |
| `Masuk untuk mengelola cerita` | `Hanya untuk anggota Future Gadget Lab` | ✅ |
| `admin@chronicles.com` (placeholder) | `hououin@fgl.lab` | ✅ |
| `Masuk Dashboard` (button) | `El Psy Kongroo` | ✅ |
| `Memverifikasi...` (loading) | `Membaca Worldline...` | ✅ |
| `Akses Diterima` (success) | `Reading Steiner Active` | ✅ |
| `Kembali ke Utama` | `Kembali ke Utama` | ✅ |
| `Akses Terproteksi` | `SERN-Proof` | ✅ |
| `Chronicles © 2026 • Control Center v2.0` | `FGL © 2025 • Divergence: 1.048596%` | ✅ |
| `Email atau password salah...` | `Akses ditolak. Worldline tidak dikenali.` | ✅ |
| `Akun tidak ditemukan.` | `Lab Member tidak ditemukan.` | ✅ |
| `Password salah.` | `Kode akses salah, Kyouma.` | ✅ |

### `src/pages/universe/login.astro` (Kurisu's POV — akses private universe)
| Sebelum | Sesudah | Status |
|---|---|---|
| `Chronicles - Universe Access` (title) | `The Steins;Gate Worldline` | ✅ |
| `Gerbang Semesta` (badge) | `Divergence Meter Online` | ✅ |
| sparkles icon | `atom` | ✅ |
| `Universe Access` (h1) | `Steins;Gate Worldline` | ✅ |
| `Masuk untuk menjelajahi semesta kami` | `Hanya orang terpilih yang bisa masuk lintas worldline` | ✅ |
| `us@chronicles.com` (placeholder) | `christina@fgl.lab` | ✅ |
| `Masuk Semesta` (button) | `Melintas Worldline` | ✅ |
| `Mengkalibrasi Divergence...` (loading) | `Mengkalibrasi Divergence...` | ✅ |
| `Akses Diterima` (success) | `Worldline Reached: 1.048596%` | ✅ |
| `Kembali ke Utama` | `Kembali ke Utama` | ✅ |
| `Akses Privat` | `Divergence: 1.048596%` | ✅ |
| `Chronicles © 2026 • Private Universe v2.0` | `FGL © 2025 • Steins;Gate Worldline` | ✅ |
| `Memuat Semesta...` (loading screen) | `Mengkalibrasi Divergence Meter...` | ✅ |
| `Sedang memeriksa sesi Anda` | `Membaca data lintas worldline` | ✅ |

---

## BATCH 2 — Config Defaults & Seed ⬜

### `src/lib/cms/config.ts`
| Field | Sebelum | Sesudah | Status |
|---|---|---|---|
| `partnerA.nickname` | `'Anya'` | `'Kurisu'` | ⬜ |
| `partnerA.displayName` | `'Partner Name'` | `'Makise Kurisu'` | ⬜ |
| `partnerA.roleLabel` | `'Princess'` | `'Christina'` | ⬜ |
| `partnerA.defaultTitle` | `'The Main Character'` | `'The Zombie'` | ⬜ |
| `partnerA.defaultBio` | `'She is the poem...'` | `'Neuroscientist, tsundere, dan satu-satunya yang bisa menghentikan Hououin Kyouma.'` | ⬜ |
| `partnerB.nickname` | `'Rey'` | `'Okabe'` | ⬜ |
| `partnerB.displayName` | `'Your Name'` | `'Okabe Rintaro'` | ⬜ |
| `partnerB.roleLabel` | `'Guardian'` | `'Mad Scientist'` | ⬜ |
| `partnerB.defaultTitle` | `'The Observer'` | `'Hououin Kyouma'` | ⬜ |
| `partnerB.defaultBio` | `'I see the universe...'` | `'Penemu Time Leap Machine. Melintas ribuan worldline hanya untuk satu orang.'` | ⬜ |
| `zeroMarker.name` | `'Sasuke Uchiha'` | `'SERN Agent'` | ⬜ |
| `zeroMarker.description` | `'0% - Stranger/Friendzone marker'` | `'0% - Divergence awal sebelum bertemu Christina'` | ⬜ |
| `letter.defaultGreeting` | `'Hai Anya...'` | `'Hai, Christina...'` | ⬜ |
| `letter.defaultClosing` | `'I love you, today and forever.'` | `'El Psy Kongroo. — Hououin Kyouma'` | ⬜ |

### `src/pages/core/seed.astro`
| Sebelum | Sesudah | Status |
|---|---|---|
| `Core Universe System` (title) | `Future Gadget Lab — Seed Data` | ⬜ |
| `partner@example.com` | `hououin@fgl.lab` | ⬜ |
| `Welcome home, Guardian.` | `El Psy Kongroo.` | ⬜ |
| `her@example.com` | `christina@fgl.lab` | ⬜ |

---

## BATCH 3 — CMS Placeholders ⬜

### `src/components/core/SectionSiteConfig.astro`
| Field | Sebelum | Sesudah | Status |
|---|---|---|---|
| `config-siteName` placeholder | `Chronicles` | `Chronicles` (biarkan) | ✅ |
| `config-siteTagline` placeholder | `Control Center` | `Future Gadget Lab` | ⬜ |
| `config-pA-nickname` | `Anya` | `Kurisu` | ⬜ |
| `config-pA-displayName` | `Partner Name` | `Makise Kurisu` | ⬜ |
| `config-pA-roleLabel` | `Princess` | `Christina` | ⬜ |
| `config-pA-defaultTitle` | `The Main Character` | `The Zombie` | ⬜ |
| `config-pA-defaultBio` | `She is the poem...` | `Neuroscientist, tsundere, dan satu-satunya yang bisa menghentikan Hououin Kyouma.` | ⬜ |
| `config-pB-nickname` | `Rey` | `Okabe` | ⬜ |
| `config-pB-displayName` | `Your Name` | `Okabe Rintaro` | ⬜ |
| `config-pB-roleLabel` | `Guardian` | `Mad Scientist` | ⬜ |
| `config-pB-defaultTitle` | `The Observer` | `Hououin Kyouma` | ⬜ |
| `config-pB-defaultBio` | `I see the universe...` | `Penemu Time Leap Machine. Melintas ribuan worldline hanya untuk satu orang.` | ⬜ |
| `config-zeroMarker-name` | `Sasuke Uchiha` | `SERN Agent` | ⬜ |
| `config-zeroMarker-desc` | `0% - Stranger/Friendzone marker` | `0% - Divergence awal sebelum bertemu Christina` | ⬜ |
| `config-letter-greeting` | `Hai Anya...` | `Hai, Christina...` | ⬜ |
| `config-letter-closing` | `I love you, today and forever.` | `El Psy Kongroo. — Hououin Kyouma` | ⬜ |

---

## BATCH 4 — Public Pages Copy ⬜

### `src/components/AboutSection.astro`
| Sebelum | Sesudah | Status |
|---|---|---|
| `Setiap orang punya cerita. Tapi cerita tentang dia adalah favoritku...` | `Ada ribuan worldline di semesta ini. Tapi hanya satu yang membawaku padanya.` | ⬜ |
| `"She is the poem I never knew how to write..."` | `"Semua pengorbanan itu worth it, asalkan di worldline ini, kamu ada."` | ⬜ |
| `Main Character` label | `The Zombie` | ⬜ |
| `The Observer` label | `Hououin Kyouma` | ⬜ |

### `src/pages/her.astro`
| Sebelum | Sesudah | Status |
|---|---|---|
| `The Main Character` (default title) | `The Zombie` | ⬜ |
| `"She is the poem..."` (default bio) | `"Neuroscientist, tsundere, dan satu-satunya yang bisa menghentikan Hououin Kyouma."` | ⬜ |

### `src/pages/him.astro`
| Sebelum | Sesudah | Status |
|---|---|---|
| `The Observer` (default title) | `Hououin Kyouma` | ⬜ |
| `"I see the universe in your eyes..."` (default bio) | `"Penemu Time Leap Machine. Melintas ribuan worldline hanya untuk satu orang."` | ⬜ |
| `Guardian` (stat default) | `Mad Scientist` | ⬜ |

---

## Progress
- **Batch 1** — Login pages: 29/29 ✅
- **Batch 2** — Config & Seed: 0/14 ⬜
- **Batch 3** — CMS Placeholders: 0/16 ⬜
- **Batch 4** — Public pages: 0/8 ⬜
