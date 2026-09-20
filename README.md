# Alsala - Jadwal Sholat Digital

<p align="center">
  <img src="https://img.shields.io/badge/version-2.2.1-blue.svg?style=for-the-badge" alt="Version">
  <img src="https://img.shields.io/badge/React-19-61DAFB.svg?style=for-the-badge&logo=react&logoColor=white" alt="React">
  <img src="https://img.shields.io/badge/TypeScript-5.8-3178C6.svg?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript">
  <img src="https://img.shields.io/badge/Tailwind-CDN-06B6D4.svg?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind">
  <img src="https://img.shields.io/badge/PWA-ready-5A0FC8.svg?style=for-the-badge" alt="PWA">
  <img src="https://img.shields.io/badge/license-MIT-green.svg?style=for-the-badge" alt="License">
</p>

<p align="center">
  <b>🕌 Aplikasi jadwal sholat modern yang akurat, estetis, dan responsif</b>
</p>

---

**Alsala** adalah aplikasi web (PWA) yang dirancang untuk menampilkan jadwal sholat yang akurat, estetis, dan responsif. Aplikasi ini cocok digunakan sebagai *display* digital di masjid, rumah, atau kantor (layar besar), maupun diakses melalui perangkat seluler.

Selain jadwal sholat, aplikasi ini juga menyediakan **pengingat adzan & iqomah**, **Inspirasi Harian** (ayat Al-Qur'an dan hadits pilihan), serta **footage video Makkah** yang berganti mengikuti rentang waktu sholat — semuanya tetap berfungsi tanpa koneksi internet (offline-ready).

---

## ✨ Fitur Utama

### 🕐 Jadwal Sholat & Imsakiyah Real-time
- Menampilkan waktu lengkap: **Imsak, Subuh, Dzuhur, Ashar, Maghrib, dan Isya**
- **Highlight otomatis** pada jadwal sholat yang sedang berlangsung / berikutnya
- **Hitung mundur (countdown)** menuju waktu sholat berikutnya (`Menuju Waktu` + `Xj Ym lagi`)
- **Label waktu konsisten berbahasa Indonesia** (Subuh, Dzuhur, Ashar, Maghrib, Isya)
- **Tanggal Hijriah** di header dan **tanggal Masehi** lengkap dengan nama hari (Ahad–Sabtu) di bawah jam
- **🔄 Auto-refresh:** data diperbarui otomatis saat pergantian hari

### 🔊 Adzan Otomatis & Notifikasi
- Tombol **Adzan Otomatis On/Off** di header
- Memutar **suara Adzan** secara otomatis saat waktu sholat tiba, dilengkapi **notifikasi PWA**
- **🌙 Adzan Subuh khusus:** audio berbeda untuk waktu Subuh
- **Anti dobel-bunyi:** cooldown 30 detik untuk mencegah adzan berbunyi dua kali
- **Anti adzan basi:** adzan divalidasi terhadap jam sholat (±2 menit) dan status tombol, sehingga tidak berbunyi saat aplikasi dibuka kembali di luar waktu sholat atau saat adzan sedang dimatikan

### 🕌 Pengingat Iqomah & Alarm Muadzin
- **Durasi iqomah dapat diatur** (5, 10, 15, 20, 25, 30 menit — kelipatan 5) melalui modal di header
- **Countdown iqomah** (MM:SS) menggantikan tampilan jam begitu masuk waktu sholat, lalu **kembali ke jam** setelah selesai
- **Alarm muadzin** berbunyi di **10 detik terakhir** countdown (beep berulang), dengan tombol **Matikan Alarm**
- **Pengingat adzan manual:** saat Adzan Otomatis sedang **Off**, alarm berbunyi tepat pada waktu sholat sebagai isyarat untuk mengumandangkan adzan manual
- Pengaturan durasi disimpan di `localStorage` sehingga tetap tersimpan setelah aplikasi ditutup

### 📍 Deteksi & Pencarian Lokasi Cerdas
- **🌍 Otomatis:** mendeteksi lokasi pengguna via Geolocation API browser
- **🔍 Manual:** pencarian kota (global) menggunakan **OpenStreetMap (Nominatim)**
- **💾 Penyimpanan:** lokasi terakhir disimpan di `localStorage`

### 📖 Inspirasi Harian (Quotes Islami)
- Kutipan **Al-Qur'an dan Hadits** pilihan yang berganti otomatis **setiap 30 menit**
- **Rantai 3 sumber API keyless** dengan fallback otomatis:
  1. `api.islamic.app` (ayat acak + terjemahan Kemenag)
  2. `api.quran.com` v4 (terjemahan Kemenag, `resource_id=33`)
  3. `api.alquran.cloud` (edisi `id.indonesian`)
  4. **100 kutipan lokal** (ayat & hadits) saat seluruh API gagal / offline
- Setiap sumber punya **timeout 4 detik**, jadi UI tidak pernah menggantung
- **Atribusi jelas** pada setiap kutipan (contoh: `QS. Al-Burooj: 2 — Terjemahan Kemenag`); 87 entri ayat dan 13 entri hadits telah diverifikasi atribusinya
- Teks dibersihkan otomatis dari markup footnote (`<sup foot_note=...>`) bawaan API terjemahan
- **Marquee vertikal gaya teleprompter:** kutipan panjang berjalan pelan di kartu **tinggi tetap** (tidak pernah mendorong layout), dengan sumber tetap di kanan bawah dan crossfade halus saat kutipan berganti

### 🎥 Footage Video Makkah
- **3 klip video Makkah** yang berganti otomatis mengikuti rentang waktu sholat:
  | Rentang | Klip |
  |---|---|
  | Setelah **Isya** → Subuh (termasuk Imsak & lewat tengah malam) | `makkah-isya-subuh.mp4` |
  | Setelah **Subuh** → Ashar | `makkah-dhuhur-ashar.mp4` |
  | Setelah **Ashar** → Isya | `makkah-maghrib-isya.mp4` |
- Video **muted, loop, autoplay**, tanpa kontrol (murni dekoratif) dengan **poster** agar tidak ada frame kosong
- **Crossfade** halus saat pergantian rentang; hanya klip aktif yang dimuat (hemat kuota)
- **Mobile/tablet:** rasio 16:9 selebar kolom — **Desktop/TV:** mengisi tinggi kolom kiri dan rata dengan kartu Inspirasi Harian
- Video **tidak** ikut di-*precache*; di-cache saat diputar pertama kali (`CacheFirst`, 30 hari)

### 🎨 Desain UI/UX Modern (Glassmorphism)
- Tampilan bersih dengan efek *blur*, transparansi, dan gradien halus
- **📱 Responsif penuh:**
  - **Mobile (320px+):** satu kolom terpusat (Jam → Waktu Shalat → Iqomah → Inspirasi → Video)
  - **Tablet (640px+):** kolom lebih lebar dengan daftar waktu sholat 3 kolom
  - **Desktop/Laptop (1024px+):** dua kolom — kiri (jam, countdown iqomah, footage video), kanan (waktu sholat & inspirasi)
  - **Layar lebar / Smart TV (1280px+):** tipografi membesar otomatis (`clamp()`), grid waktu sholat 3×2 tetap besar agar terbaca dari jarak jauh
- **Navigasi remote/TV:** semua tombol penting memiliki `focus-visible` ring
- **Menghormati `prefers-reduced-motion`:** marquee inspirasi dan video berhenti beranimasi (menjadi poster statis)

### ⚡ Performa & Optimasi (PWA)
- **Installable:** dapat dipasang sebagai aplikasi (Add to Home Screen) dengan mode `standalone`
- **Service Worker (`generateSW`) dengan auto-update**
- **Precache** untuk aset inti (JS, CSS, HTML, ikon, audio adzan)
- **Runtime caching** terpisah per kebutuhan:
  | Resource | Strategi | Masa simpan |
  |---|---|---|
  | API jadwal sholat (Aladhan) | CacheFirst | 24 jam |
  | Pencarian lokasi (Nominatim) | CacheFirst | 7 hari |
  | Tailwind CDN | StaleWhileRevalidate | 30 hari |
  | Audio adzan (`.mp3`) | CacheFirst | 30 hari |
  | Video & poster Makkah | CacheFirst | 30 hari |
- **Offline-ready:** jadwal & inspirasi terakhir tetap tampil tanpa koneksi
- **IndexedDB (Dexie)** menyimpan jadwal notifikasi yang sudah diprogram

---

## 🛠️ Teknologi yang Digunakan

| Kategori | Teknologi |
|----------|-----------|
| **Frontend** | React 19, TypeScript 5.8 |
| **Styling** | Tailwind CSS (Play CDN) |
| **Build Tool** | Vite 6 |
| **PWA** | vite-plugin-pwa (Workbox, mode `generateSW`) |
| **Icons** | Lucide React |
| **Audio Alarm** | Web Audio API (oscillator, tanpa file audio tambahan) |
| **State Management** | React Hooks (`useState`, `useEffect`, `useCallback`, `useRef`) |
| **Data Storage** | LocalStorage, IndexedDB (Dexie) |
| **Release** | semantic-release via GitHub Actions |

### Data & Sumber Eksternal
- **[Aladhan API](https://aladhan.com/prayer-times-api):** jadwal sholat (metode Kemenag/ISNA) + tanggal Hijriah
- **[Nominatim (OpenStreetMap)](https://nominatim.org/):** geocoding pencarian nama kota
- **[api.islamic.app](https://api.islamic.app):** ayat acak + terjemahan Kemenag
- **[api.quran.com](https://api.quran.com):** ayat + terjemahan Kemenag (`resource_id=33`)
- **[api.alquran.cloud](https://alquran.cloud):** ayat + terjemahan `id.indonesian`

> Semua sumber kutipan bersifat **keyless** (tanpa API key) dan CORS-open. Bila seluruh API gagal, aplikasi otomatis memakai 100 kutipan lokal.

---

## 🚀 Cara Menjalankan

### Development
```bash
# Clone repository
git clone https://github.com/ryansutrisno/alsala.git
cd alsala

# Install dependencies
npm install

# Jalankan development server (default: http://localhost:3000)
npm run dev
```

### Production Build
```bash
# Build untuk production
npm run build

# Preview build
npm run preview
```

### Static Hosting
Deploy folder `dist/` ke hosting statis apa pun (Netlify, Vercel, GitHub Pages). **Tidak diperlukan backend, database, maupun API Key.**

Contoh: aplikasi ini otomatis ter-deploy ke **https://alsala.netlify.app** dari branch `main`.

---

## 📂 Struktur File

```
alsala/
├── .github/
│   └── workflows/
│       └── release.yml              # GitHub Actions untuk auto versioning
├── components/
│   ├── Clock.tsx                    # Jam digital + tanggal Masehi & nama hari
│   ├── PrayerList.tsx               # Grid daftar jadwal sholat
│   ├── InspirationCard.tsx          # Kartu Inspirasi Harian (marquee vertikal)
│   ├── IqomahCountdownDisplay.tsx   # Tampilan countdown iqomah (menggantikan jam)
│   ├── IqomahDurationModal.tsx      # Modal pengaturan durasi iqomah
│   └── PrayerFootage.tsx            # Panel video Makkah sesuai rentang sholat
├── services/
│   ├── prayerService.ts             # API jadwal sholat, lokasi, waktu sholat berikutnya
│   ├── notificationService.ts       # Notifikasi & pemutaran audio adzan
│   ├── iqomahService.ts             # Durasi iqomah, countdown, alarm Web Audio
│   ├── quoteService.ts              # 100 kutipan lokal + rantai fallback 3 API
│   ├── db.ts                        # Skema Dexie (IndexedDB)
│   └── geminiService.ts             # (opsional) inspirasi generatif — tidak dipakai di UI
├── public/
│   ├── Adzan_Mekkah_Versi_Full.mp3  # Audio adzan reguler
│   ├── Adzan_Subuh_Merdu.mp3        # Audio adzan Subuh
│   ├── makkah-isya-subuh.mp4        # Footage Makkah (Isya → Subuh)
│   ├── makkah-dhuhur-ashar.mp4      # Footage Makkah (Subuh → Ashar)
│   ├── makkah-maghrib-isya.mp4      # Footage Makkah (Ashar → Isya)
│   ├── makkah-*-poster.jpg          # Poster tiap klip video
│   └── icon-*.png, favicon.*        # Ikon PWA
├── App.tsx                          # Komponen utama (state, layout, trigger alarm)
├── index.tsx                        # Entry point React
├── types.ts                         # Tipe bersama (PrayerTimes, Location, dll.)
├── index.html                       # HTML shell + konfigurasi Tailwind CDN
├── vite.config.ts                   # Konfigurasi Vite + PWA (manifest, caching)
├── CHANGELOG.md                     # Riwayat perubahan (auto-generated)
└── README.md                        # Dokumentasi ini
```

---

## 🔐 Penyimpanan Lokal

| Key | Isi |
|---|---|
| `waqt_location` | Koordinat & nama lokasi terakhir |
| `waqt_notifications_enabled` | Status Adzan Otomatis (`true`/`false`) |
| `waqt_notification_permission` | Status izin notifikasi browser |
| `waqt_iqomah_minutes` | Durasi iqomah terpilih (5–30 menit) |

---

## ⚠️ Catatan Penting

- **Izin notifikasi** dibutuhkan untuk Adzan Otomatis (notifikasi PWA). Tanpa izin tersebut, adzan otomatis tidak dijadwalkan.
- **Alarm & autoplay video** memerlukan **minimal satu interaksi pengguna** (klik/sentuh) di halaman — ini kebijakan *autoplay policy* browser, bukan bug.
- **Alarm hanya berbunyi saat aplikasi terbuka.** Aplikasi ini tidak memakai push notification dari server, jadi bila tab/tab PWA benar-benar dibekukan sistem, alarm bisa tertunda dan akan dilewati bila sudah lewat jendela waktunya (lebih baik senyap daripada berbunyi basi).
- **Video di-mute permanen** karena autoplay hanya diizinkan untuk media tanpa suara.

---

## 📝 Changelog

Lihat [CHANGELOG.md](./CHANGELOG.md) untuk riwayat perubahan lengkap.

## 🤝 Contributing

Kami menyambut kontribusi! Silakan ikuti [Conventional Commits](https://www.conventionalcommits.org/) untuk pesan commit:

- `feat:` - Fitur baru
- `fix:` - Perbaikan bug
- `docs:` - Perubahan dokumentasi
- `style:` - Perubahan formatting (tidak mempengaruhi kode)
- `refactor:` - Refactoring kode
- `perf:` - Perbaikan performa
- `test:` - Menambah/mengubah tests
- `chore:` - Perubahan build/proses

### Semantic Versioning
Proyek ini menggunakan semantic versioning yang diotomatisasi via GitHub Actions:
- **MAJOR** (v2.0.0) - Breaking changes
- **MINOR** (v1.1.0) - Fitur baru (backward compatible)
- **PATCH** (v1.0.1) - Bug fixes

## 📄 License

Proyek ini dilisensikan di bawah [MIT License](./LICENSE).

## 🙏 Credits

- Audio Adzan oleh [various sources]
- Footage video Makkah oleh [various sources]
- Icons by [Lucide](https://lucide.dev/)
- Data API by [Aladhan](https://aladhan.com/), [OpenStreetMap](https://www.openstreetmap.org/), [api.islamic.app](https://api.islamic.app), [Quran.com](https://quran.com), dan [AlQuran Cloud](https://alquran.cloud)
- Terjemahan Al-Qur'an: **Kementerian Agama Republik Indonesia (Kemenag)**

---

<p align="center">
  <b>Dibuat dengan ❤️ untuk kemudahan beribadah</b><br>
  <sub>© 2025 Alsala - Jadwal Sholat Digital</sub>
</p>
