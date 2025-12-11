# Nurul Waqt - Jadwal Sholat Digital

**Nurul Waqt** adalah aplikasi web modern yang dirancang untuk menampilkan jadwal sholat yang akurat, estetis, dan responsif. Aplikasi ini cocok digunakan sebagai *display* digital di masjid, rumah, atau kantor (layar besar), maupun diakses melalui perangkat seluler.

Aplikasi ini menyajikan **Inspirasi Harian** berupa kumpulan hadits dan ayat Al-Qur'an pilihan yang telah dikurasi, tanpa memerlukan koneksi AI eksternal.

## ✨ Fitur Utama

1.  **Jadwal Sholat & Imsakiyah Real-time**
    *   Menampilkan waktu Imsak, Subuh, Dzuhur, Ashar, Maghrib, dan Isya.
    *   Highlight otomatis pada jadwal sholat yang sedang berlangsung atau akan datang.
    *   Hitung mundur (countdown) menuju waktu sholat berikutnya.
    *   **Auto Adzan:** Memutar suara Adzan secara otomatis ketika waktu sholat tiba (kecuali Imsak).
    *   **Adzan Subuh Khusus:** Suara Adzan berbeda untuk waktu Subuh (*Assalatu Khairum Minan Naum*).

2.  **Deteksi & Pencarian Lokasi**
    *   **Otomatis:** Mendeteksi lokasi pengguna menggunakan Geolocation API browser untuk akurasi tinggi.
    *   **Manual:** Fitur pencarian kota (Global) menggunakan OpenStreetMap (Nominatim).

3.  **Inspirasi Harian**
    *   Menampilkan kutipan Al-Qur'an dan Hadits pilihan secara acak.
    *   Dilengkapi dengan refleksi singkat yang menyejukkan hati.
    *   Bekerja **Offline** tanpa biaya API.

4.  **Desain UI/UX Modern (Glassmorphism)**
    *   Tampilan antarmuka yang bersih dengan efek *blur* dan transparansi.
    *   **Responsif:** Tata letak grid menyesuaikan secara otomatis dari layar HP (2 kolom), Tablet (3 kolom), hingga Layar Lebar/TV (6 kolom sejajar).

## 🛠️ Teknologi yang Digunakan

*   **Frontend:** React 19, TypeScript
*   **Styling:** Tailwind CSS (CDN/Configured)
*   **Icons:** Lucide React
*   **Data API:**
    *   [Aladhan API](https://aladhan.com/prayer-times-api): Sumber data jadwal sholat (Default method: Kemenag/ISNA).
    *   [Nominatim (OpenStreetMap)](https://nominatim.org/): Layanan Geocoding untuk pencarian nama kota.

## 🚀 Cara Menjalankan

Cukup buka `index.html` menggunakan live server atau hosting statis apa pun. Tidak diperlukan konfigurasi backend atau API Key.

## 📂 Struktur File

*   `App.tsx`: Komponen utama.
*   `services/prayerService.ts`: Logic API jadwal sholat.
*   `services/quoteService.ts`: Kumpulan data inspirasi lokal (Pengganti AI).
*   `components/`: Folder komponen UI modular (Clock, PrayerList, InspirationCard).

---
*Dibuat dengan ❤️ untuk kemudahan beribadah.*
