# Nurul Waqt - Jadwal Sholat Digital & Inspirasi AI

**Nurul Waqt** adalah aplikasi web modern yang dirancang untuk menampilkan jadwal sholat yang akurat, estetis, dan responsif. Aplikasi ini cocok digunakan sebagai *display* digital di masjid, rumah, atau kantor (layar besar), maupun diakses melalui perangkat seluler.

Aplikasi ini tidak hanya menampilkan waktu, tetapi juga memberikan sentuhan spiritual melalui **Inspirasi Harian** yang digenerate secara otomatis oleh kecerdasan buatan (AI) Google Gemini, disesuaikan dengan konteks waktu sholat.

## ✨ Fitur Utama

1.  **Jadwal Sholat & Imsakiyah Real-time**
    *   Menampilkan waktu Imsak, Subuh, Dzuhur, Ashar, Maghrib, dan Isya.
    *   Highlight otomatis pada jadwal sholat yang sedang berlangsung atau akan datang.
    *   Hitung mundur (countdown) menuju waktu sholat berikutnya.

2.  **Deteksi & Pencarian Lokasi**
    *   **Otomatis:** Mendeteksi lokasi pengguna menggunakan Geolocation API browser untuk akurasi tinggi.
    *   **Manual:** Fitur pencarian kota (Global) menggunakan OpenStreetMap (Nominatim) jika GPS tidak aktif atau ingin melihat jadwal kota lain.

3.  **Inspirasi Harian Bertenaga AI**
    *   Terintegrasi dengan **Google Gemini 2.5 Flash**.
    *   Menyajikan kutipan Al-Qur'an, Hadits, atau kata mutiara Islami beserta refleksi singkat yang relevan dengan waktu saat ini.

4.  **Desain UI/UX Modern (Glassmorphism)**
    *   Tampilan antarmuka yang bersih dengan efek *blur* dan transparansi.
    *   **Responsif:** Tata letak grid menyesuaikan secara otomatis dari layar HP (2 kolom), Tablet (3 kolom), hingga Layar Lebar/TV (6 kolom sejajar).
    *   Animasi halus dan transisi warna yang menenangkan.

## 🛠️ Teknologi yang Digunakan

*   **Frontend:** React 19, TypeScript
*   **Styling:** Tailwind CSS (CDN/Configured)
*   **Icons:** Lucide React
*   **Data API:**
    *   [Aladhan API](https://aladhan.com/prayer-times-api): Sumber data jadwal sholat (Default method: Kemenag/ISNA).
    *   [Nominatim (OpenStreetMap)](https://nominatim.org/): Layanan Geocoding untuk pencarian nama kota.
*   **AI:** [Google Gemini API](https://ai.google.dev/): SDK `@google/genai` untuk konten inspirasi.

## 🚀 Konfigurasi

Untuk menjalankan fitur Inspirasi AI, aplikasi ini membutuhkan **API Key** dari Google AI Studio.

1.  Dapatkan API Key di [Google AI Studio](https://aistudio.google.com/).
2.  Pastikan environment variable `API_KEY` tersedia saat menjalankan aplikasi (jika menggunakan bundler) atau disuntikkan ke dalam process env.

## 📂 Struktur File

*   `index.html`: Entry point aplikasi.
*   `App.tsx`: Komponen utama yang mengatur *state* lokasi, data sholat, dan UI layout.
*   `services/prayerService.ts`: Logic untuk mengambil data jadwal dari API dan menghitung waktu sholat berikutnya.
*   `services/geminiService.ts`: Logic untuk berkomunikasi dengan Google Gemini.
*   `components/`: Folder komponen UI modular (Clock, PrayerList, InspirationCard).

---
*Dibuat dengan ❤️ untuk kemudahan beribadah.*
