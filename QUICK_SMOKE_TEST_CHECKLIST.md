# Quick Smoke Test Checklist

Tujuan: verifikasi fitur utama yang sudah existing dalam 10-15 menit.

## 0) Prep (2 menit)

- [ ] Jalankan project lokal (`npm run dev`).
- [ ] Buka 3 route ini:
  - [ ] `http://localhost:4321/`
  - [ ] `http://localhost:4321/core`
  - [ ] `http://localhost:4321/universe/home`
- [ ] Login pakai akun yang biasa dipakai untuk `core` dan `universe`.

## 1) Public Portal (`/`) (2 menit)

- [ ] Hero/section landing render normal (tidak blank).
- [ ] `LoveProgress` tampil normal.
- [ ] Card teaser progress tampil jika `publicPreviewEnabled=true` dan `public.progressPreview=true`.
- [ ] Card teaser hilang jika salah satu toggle dimatikan dari Core.
- [ ] Nilai progress (life/year/day) ter-render (bukan `NaN`/kosong).

## 2) Core Config (`/core`) (3 menit)

### Time Progress
- [ ] Ubah `birthDate`, `lifeExpectancyYears`, `breathingRatePerMinute`.
- [ ] Klik `Save Feature Config` dan dapat feedback sukses.
- [ ] Reload page Core, nilai form tetap persist.

### Feature Visibility
- [ ] Toggle `Public > Progress Preview` ON/OFF tersimpan.
- [ ] Toggle `Universe > Progress Widgets` ON/OFF tersimpan.
- [ ] Toggle `Universe > Notes & Reminders` ON/OFF tersimpan.

## 3) Universe Home (`/universe/home`) (5 menit)

### Life Widgets
- [ ] Bagian `Daily Orbit` muncul saat `progressWidgets/dailyDashboard` ON.
- [ ] Jam digital update realtime.
- [ ] Dynamic age update realtime (angka berubah).
- [ ] Progress bars life/year/day terisi (0-100%).
- [ ] Weather tidak crash (success atau fallback message acceptable).

### Quick Notes / Reminders
- [ ] Bagian `Desk Notes` muncul saat `notesAndReminders` ON.
- [ ] Tambah note baru (title/content optional salah satu terisi) berhasil.
- [ ] Counter `Total/Open/Pinned/Done` ikut berubah.
- [ ] Toggle `Pin` berhasil.
- [ ] Toggle `Done/Open` berhasil.
- [ ] Delete note berhasil.
- [ ] Jika `notesAndReminders` OFF dari Core, section tersembunyi.

## 4) Regression Sanity (2 menit)

- [ ] Feed posts tetap load.
- [ ] Stories strip tetap load.
- [ ] Photo modal bisa dibuka dan ditutup.
- [ ] Story modal bisa dibuka dan ditutup.
- [ ] Edit post modal bisa dibuka dan ditutup.

## 5) Pass Criteria

- [ ] Tidak ada error fatal di UI (blank screen/crash).
- [ ] Tidak ada data private bocor di public route.
- [ ] Semua toggle Core berdampak ke Universe/Public sesuai ekspektasi.

## 6) Optional Fast Debug (kalau ada issue)

- [ ] Cek browser console error di route terkait.
- [ ] Cek Firestore docs:
  - [ ] `config/timeProgress`
  - [ ] `config/featureVisibility`
  - [ ] `quickNotes`
- [ ] Cek repo diagnostics cepat:
  - [ ] `git status --short`
  - [ ] `npm run dev` output terminal
