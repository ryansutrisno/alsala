# Changelog

Semua perubahan yang signifikan pada proyek ini akan didokumentasikan dalam file ini.

Format changelog ini mengikuti [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), dan proyek ini menggunakan [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Menambahkan 28 fallback quotes Islami untuk handling API error
- Implementasi responsive design yang lebih baik untuk mobile devices
- GitHub workflow untuk auto semantic versioning

### Changed
- Improved responsive layout di App.tsx untuk berbagai ukuran layar
- Optimized font sizes dan spacing di komponen Clock, PrayerList, dan InspirationCard

## [1.0.0] - 2025-03-07

### Added
- ✨ **Jadwal Sholat & Imsakiyah Real-time**
  - Menampilkan waktu Imsak, Subuh, Dzuhur, Ashar, Maghrib, dan Isya
  - Highlight otomatis pada jadwal sholat yang sedang berlangsung
  - Hitung mundur menuju waktu sholat berikutnya
  - Auto Adzan dengan suara otomatis ketika waktu sholat tiba
  - Adzan Subuh khusus dengan suara berbeda

- 📍 **Deteksi & Pencarian Lokasi**
  - Deteksi lokasi otomatis menggunakan Geolocation API
  - Pencarian kota manual global menggunakan OpenStreetMap (Nominatim)
  - Penyimpanan lokasi terakhir di localStorage

- 📖 **Inspirasi Harian**
  - Menampilkan kutipan Al-Qur'an dan Hadits pilihan secara acak
  - Integrasi dengan API Muslimify untuk quotes dinamis
  - Fallback quotes lokal saat API tidak tersedia
  - Refleksi singkat untuk setiap quote

- 🎨 **Desain Modern Glassmorphism**
  - UI dengan efek blur dan transparansi
  - Responsive layout untuk HP, Tablet, dan Layar Lebar/TV
  - Tema gelap yang nyaman di mata
  - Animasi halus untuk pengalaman pengguna yang lebih baik

- 🔊 **Sistem Audio**
  - Pemutaran Adzan otomatis
  - Kontrol volume on/off
  - Dukungan untuk audio HTML5

- ⚡ **Optimasi Performa**
  - Caching data jadwal sholat
  - Auto-refresh data saat pergantian hari
  - Pengecekan lokasi yang efisien

### Teknologi
- React 19 dengan TypeScript
- Tailwind CSS untuk styling
- Vite sebagai build tool
- Lucide React untuk icons
- Aladhan API untuk data jadwal sholat
- Nominatim API untuk geocoding

[Unreleased]: https://github.com/username/alsala/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/username/alsala/releases/tag/v1.0.0
