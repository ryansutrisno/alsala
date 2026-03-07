# Alsala - Jadwal Sholat Digital

<p align="center">
  <img src="https://img.shields.io/badge/version-1.0.0-blue.svg?style=for-the-badge" alt="Version">
  <img src="https://img.shields.io/badge/React-19-61DAFB.svg?style=for-the-badge&logo=react&logoColor=white" alt="React">
  <img src="https://img.shields.io/badge/TypeScript-5.8-3178C6.svg?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript">
  <img src="https://img.shields.io/badge/Tailwind-3.4-06B6D4.svg?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind">
  <img src="https://img.shields.io/badge/license-MIT-green.svg?style=for-the-badge" alt="License">
</p>

<p align="center">
  <b>🕌 Aplikasi jadwal sholat modern yang akurat, estetis, dan responsif</b>
</p>

---

**Alsala** adalah aplikasi web modern yang dirancang untuk menampilkan jadwal sholat yang akurat, estetis, dan responsif. Aplikasi ini cocok digunakan sebagai *display* digital di masjid, rumah, atau kantor (layar besar), maupun diakses melalui perangkat seluler.

Aplikasi ini menyajikan **Inspirasi Harian** berupa kumpulan hadits dan ayat Al-Qur'an pilihan yang telah dikurasi, dengan dukungan offline ketika API tidak tersedia.

## ✨ Fitur Utama

### 🕐 Jadwal Sholat & Imsakiyah Real-time
- Menampilkan waktu lengkap: **Imsak, Subuh, Dzuhur, Ashar, Maghrib, dan Isya**
- **Highlight otomatis** pada jadwal sholat yang sedang berlangsung atau akan datang
- **Hitung mundur (countdown)** menuju waktu sholat berikutnya
- **🔊 Auto Adzan:** Memutar suara Adzan secara otomatis ketika waktu sholat tiba
- **🌙 Adzan Subuh Khusus:** Suara Adzan berbeda untuk waktu Subuh (*Assalatu Khairum Minan Naum*)
- **🔄 Auto-refresh:** Data diperbarui otomatis saat pergantian hari

### 📍 Deteksi & Pencarian Lokasi Cerdas
- **🌍 Otomatis:** Mendeteksi lokasi pengguna menggunakan Geolocation API browser untuk akurasi tinggi
- **🔍 Manual:** Fitur pencarian kota (Global) menggunakan OpenStreetMap (Nominatim)
- **💾 Penyimpanan:** Lokasi terakhir disimpan di localStorage untuk pengalaman yang lebih baik

### 📖 Inspirasi Harian (Quotes Islami)
- Menampilkan kutipan **Al-Qur'an dan Hadits** pilihan secara acak
- **28+ fallback quotes** yang tersedia offline saat API bermasalah
- Dilengkapi dengan **refleksi singkat** yang menyejukkan hati
- Update otomatis setiap 30 menit

### 🎨 Desain UI/UX Modern (Glassmorphism)
- Tampilan antarmuka yang bersih dengan efek *blur* dan transparansi
- **📱 Responsif Penuh:** Tata letak grid menyesuaikan secara otomatis:
  - **Mobile (320px+):** 2 kolom, font optimized
  - **Tablet (640px+):** 3 kolom, layout yang lebih luas
  - **Desktop (1024px+):** Layout 2 kolom utama dengan sidebar
  - **Layar Lebar/TV (1280px+):** Grid 6 sejajar, optimal untuk display masjid

### ⚡ Performa & Optimasi
- **Caching cerdas:** Data jadwal sholat di-cache untuk menghemat API calls
- **Lazy loading:** Komponen dimuat secara efisien
- **Offline-ready:** Fallback quotes tersedia tanpa koneksi internet
- **Animasi halus:** Transisi yang smooth untuk pengalaman pengguna premium

## 🛠️ Teknologi yang Digunakan

| Kategori | Teknologi |
|----------|-----------|
| **Frontend** | React 19, TypeScript 5.8 |
| **Styling** | Tailwind CSS (CDN) |
| **Build Tool** | Vite 6 |
| **Icons** | Lucide React |
| **State Management** | React Hooks (useState, useEffect, useCallback) |
| **Data Storage** | LocalStorage, IndexedDB (Dexie) |

### Data API
- **[Aladhan API](https://aladhan.com/prayer-times-api):** Sumber data jadwal sholat (Metode: Kemenag/ISNA)
- **[Nominatim (OpenStreetMap)](https://nominatim.org/):** Layanan Geocoding untuk pencarian nama kota
- **[Muslimify API](https://apimuslimify.vercel.app/):** Sumber quotes Islami (dengan fallback lokal)

## 🚀 Cara Menjalankan

### Development
```bash
# Clone repository
git clone https://github.com/username/alsala.git
cd alsala

# Install dependencies
npm install

# Jalankan development server
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
Cukup buka `index.html` menggunakan live server atau hosting statis apa pun (Netlify, Vercel, GitHub Pages). Tidak diperlukan konfigurasi backend atau API Key.

## 📂 Struktur File

```
alsala/
├── .github/
│   └── workflows/
│       └── release.yml          # GitHub Actions untuk auto versioning
├── components/
│   ├── Clock.tsx               # Komponen jam digital
│   ├── InspirationCard.tsx     # Kartu inspirasi harian
│   └── PrayerList.tsx          # Daftar jadwal sholat
├── services/
│   ├── prayerService.ts        # Logic API jadwal sholat
│   └── quoteService.ts         # Kumpulan 28+ quotes lokal + API
├── public/
│   ├── Adzan_Subuh_Merdu.mp3   # Audio adzan subuh
│   └── Adzan_Mekkah_Versi_Full.mp3 # Audio adzan reguler
├── App.tsx                     # Komponen utama aplikasi
├── index.html                  # Entry point
├── CHANGELOG.md                # Riwayat perubahan
└── README.md                   # Dokumentasi ini
```

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
- Icons by [Lucide](https://lucide.dev/)
- Data API by [Aladhan](https://aladhan.com/) & [OpenStreetMap](https://www.openstreetmap.org/)

---

<p align="center">
  <b>Dibuat dengan ❤️ untuk kemudahan beribadah</b><br>
  <sub>© 2025 Alsala - Jadwal Sholat Digital</sub>
</p>
