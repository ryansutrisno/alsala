# Changelog

Semua perubahan yang signifikan pada proyek ini akan didokumentasikan dalam file ini.

## [2.3.0](https://github.com/ryansutrisno/alsala/compare/v2.2.1...v2.3.0) (2026-09-20)

### ✨ Features

* **alarm:** differentiate manual-adzan and iqomah tones ([8bc70f8](https://github.com/ryansutrisno/alsala/commit/8bc70f87fc4140bad221291c557e18ef48e4d7e7))
* **alarm:** use repeating beeps instead of siren for iqomah ([8b7f47d](https://github.com/ryansutrisno/alsala/commit/8b7f47d9e4eed9dbbb765559f04878bccb0f85c3))
* **footage:** add rotating Makkah video panel by prayer range ([fbd8751](https://github.com/ryansutrisno/alsala/commit/fbd87518cab0a2997479ba67f2746ead80ddc8b3))
* **iqomah:** add iqomah service with web audio alarm ([ec5c281](https://github.com/ryansutrisno/alsala/commit/ec5c28146feb775aacff6426ba12551138d2d1a1))
* **iqomah:** wire countdown and alarms into the app ([ac35700](https://github.com/ryansutrisno/alsala/commit/ac35700ba62a952b9c30559254bf6f903e2351b3))
* **ui:** add fullscreen toggle and simplify header labels ([6089dcc](https://github.com/ryansutrisno/alsala/commit/6089dcc97a483c314140ade26623cf1a4d57f7c1))
* **ui:** add iqomah countdown card ([2910430](https://github.com/ryansutrisno/alsala/commit/291043031a9f8515ae92f5325a95b0a79ba06e09))
* **ui:** responsive layout for landscape and smart TV ([8f6441e](https://github.com/ryansutrisno/alsala/commit/8f6441e1b52060020b3d92cf48f7e73ad4c8d2f8))

### 🐛 Bug Fixes

* **inspiration:** strip footnote markup from quote text ([198f864](https://github.com/ryansutrisno/alsala/commit/198f8644ecf34e359e4bec9c39bd187dfe8ee500))
* **iqomah:** stop alarms firing before their target time ([f0240fd](https://github.com/ryansutrisno/alsala/commit/f0240fd42f27243efb3c6a0dba91757f68431820))
* **ui:** compact mobile portrait header layout ([55ed96d](https://github.com/ryansutrisno/alsala/commit/55ed96d00101576c1bb4c8d4d0f1275887bbe22e))
* **ui:** drop manual-adzan hint from iqomah countdown ([7cca527](https://github.com/ryansutrisno/alsala/commit/7cca527c7ef98d75fb872cd7cf453073fbddd2e9))
* **ui:** use Ahad spelling for the day name ([2cfb738](https://github.com/ryansutrisno/alsala/commit/2cfb738958017d01443e806ceb41980bebce0eb3))

### 📚 Documentation

* rewrite README with current features ([149bd69](https://github.com/ryansutrisno/alsala/commit/149bd69f5a727e916f9a8143ea15fb38fa3ba332))

### 📦 Code Refactoring

* **inspiration:** fixed-height marquee card for daily quote ([5e55d9c](https://github.com/ryansutrisno/alsala/commit/5e55d9c1b0490519184f4681c6f2c35abf1152ce))
* **ui:** move iqomah duration to a modal and restore single-column layout ([3f2c258](https://github.com/ryansutrisno/alsala/commit/3f2c258fcadb3b713c782ccc5c9a9ec1cba2c5ac))
* **ui:** remove stop-alarm button from iqomah countdown ([3674512](https://github.com/ryansutrisno/alsala/commit/3674512c1aaaf40975d996714edb737daadb5a29))

### ⚙️ Chores

* **gitignore:** ignore vite-plugin-pwa dev-dist output ([9878b2b](https://github.com/ryansutrisno/alsala/commit/9878b2ba83bea0dabe91afbbae1c3249529d61e9))

## [2.2.1](https://github.com/ryansutrisno/alsala/compare/v2.2.0...v2.2.1) (2026-09-20)

### 🐛 Bug Fixes

* **inspiration:** correct quote attributions ([a602763](https://github.com/ryansutrisno/alsala/commit/a602763fb888d745d9c7bbfb57a2dcff0adf1942))

## [2.2.0](https://github.com/ryansutrisno/alsala/compare/v2.1.2...v2.2.0) (2026-09-19)

### ✨ Features

* **inspiration:** add multi-source quote fallback chain ([b5c0566](https://github.com/ryansutrisno/alsala/commit/b5c0566905000bdf0d99c4d3b6089afa275c728d))

### 🐛 Bug Fixes

* **inspiration:** crossfade quote updates without layout shift ([c79aae0](https://github.com/ryansutrisno/alsala/commit/c79aae0175966cd18fb08a2c1dd3e5dab5b1a3b2))

## [2.1.2](https://github.com/ryansutrisno/alsala/compare/v2.1.1...v2.1.2) (2026-09-19)

### 🐛 Bug Fixes

* **adzan:** stop stale adzan playback when disabled or reopened ([e2e3f2b](https://github.com/ryansutrisno/alsala/commit/e2e3f2b0a22745a59e4bc268067674ec5f2a65e8))

## [2.1.1](https://github.com/ryansutrisno/alsala/compare/v2.1.0...v2.1.1) (2026-04-04)

### 🐛 Bug Fixes

* prevent double adzan sound playback with cooldown deduplication ([c49ab40](https://github.com/ryansutrisno/alsala/commit/c49ab406c031e5aa444908ce89658c83168cad4d))

## [2.1.0](https://github.com/ryansutrisno/alsala/compare/v2.0.1...v2.1.0) (2026-03-07)

### ✨ Features

* add local notification support for Adzan in PWA ([c4ab414](https://github.com/ryansutrisno/alsala/commit/c4ab41441e0a307775fd192699804b2447a36509))

## [2.0.1](https://github.com/ryansutrisno/alsala/compare/v2.0.0...v2.0.1) (2026-03-07)

### 🐛 Bug Fixes

* **pwa:** regenerate icons using correct logo source ([6d56b7b](https://github.com/ryansutrisno/alsala/commit/6d56b7be952fd233a91b10cf3da3fdd0b259d5e1))

## [2.0.0](https://github.com/ryansutrisno/alsala/compare/v1.0.0...v2.0.0) (2026-03-07)

### ⚠ BREAKING CHANGES

* None

Closes: pwa-support, offline-functionality

### ✨ Features

* implement Progressive Web App (PWA) support ([fbb8b09](https://github.com/ryansutrisno/alsala/commit/fbb8b09a9d9ab72bf65dbbd0ddfc0ac46ffa0ed3))

## 1.0.0 (2026-03-07)

### ⚠ BREAKING CHANGES

* None

Closes: responsive-design, fallback-quotes, semantic-versioning

### ✨ Features

* Add automatic Adzan playback and mute functionality ([860e0ad](https://github.com/ryansutrisno/alsala/commit/860e0ad8821a2e0e11144e15a29561959dbfb900))
* add localStorage persistence and audio hint toast ([3459da7](https://github.com/ryansutrisno/alsala/commit/3459da7ad4f78d2e73f09df386096bc1475a16c5))
* **audio:** improve adhan playback handling and use local files ([6ee1c46](https://github.com/ryansutrisno/alsala/commit/6ee1c460bef0e3cc1661aebe113eb07579ab8032))
* implement responsive design and add semantic versioning setup ([20f2313](https://github.com/ryansutrisno/alsala/commit/20f2313e681056b9f8326c021224fbeee3495936))
* Initialize Nurul Waqt project structure ([d533900](https://github.com/ryansutrisno/alsala/commit/d533900728b0994dd0a14fe4a59707854940c76a))
* **inspiration:** implement auto-refresh and external API integration ([6719005](https://github.com/ryansutrisno/alsala/commit/671900564da423888fc58c9f3afc8544418ae0e1))
* **prayer:** implement indexeddb caching for prayer times ([8f2867f](https://github.com/ryansutrisno/alsala/commit/8f2867fba2e974c23042dfec1948b371e5128f2d))
* Remove AI-generated inspiration, use local data ([c530ea1](https://github.com/ryansutrisno/alsala/commit/c530ea11fc06db0d13a4d20272d21c30e19fe662))
* Update app name to Alsala ([9d46878](https://github.com/ryansutrisno/alsala/commit/9d46878c30a6a41792b30d7da569fab6f18730fc))
* Update app title and metadata for Nurul Waqt ([e849456](https://github.com/ryansutrisno/alsala/commit/e84945681c23cf34b598373b6309be4025ae2caa))
* Update OG image path ([587caa9](https://github.com/ryansutrisno/alsala/commit/587caa9cedcd218f45d390ee86ace7b59380aa57))
* Update social media image URL ([8f04b81](https://github.com/ryansutrisno/alsala/commit/8f04b8172f4b98fadc05a4b613a7b16cfcffc237))
* Use relative path for Open Graph image ([5731417](https://github.com/ryansutrisno/alsala/commit/573141733a1eb870424de141776516ffbf50d6ba))

### 🐛 Bug Fixes

* **audio:** improve audio interaction handling and UI text ([2f9d4cc](https://github.com/ryansutrisno/alsala/commit/2f9d4cc8d19186cb051b990bddad507d3b5582fa))
* **config:** fix invalid JSON in .releaserc.json ([d59298e](https://github.com/ryansutrisno/alsala/commit/d59298e367d322f99a92f67dd5d912473eadfb08))
* **config:** update repository URL in package.json ([6ffc412](https://github.com/ryansutrisno/alsala/commit/6ffc4124e89f9391720fd00f3152b75d7868182d))
* **prayerService:** clean time strings by removing timezone suffixes ([61f2408](https://github.com/ryansutrisno/alsala/commit/61f2408aaa85228f20a350231b4e04369c440394))
* prevent adhan trigger race condition by checking seconds ([f1cedc3](https://github.com/ryansutrisno/alsala/commit/f1cedc3c60b81e4ba5039a612b7d5e515f02160c))
* **seo:** update og and twitter image URLs to use full domain path ([d409be6](https://github.com/ryansutrisno/alsala/commit/d409be6ff26519183ef3711d7de2ce9b563fab2f))
* skip adhan for non-obligatory prayers ([052be70](https://github.com/ryansutrisno/alsala/commit/052be700fc72a9b815423f99a889eeb9ec35faf1))
* update image references and improve type safety ([e046a07](https://github.com/ryansutrisno/alsala/commit/e046a0743968ecc7631d50bd3f6ebd8454842f26))
* Update OG and Twitter image paths ([b11e14b](https://github.com/ryansutrisno/alsala/commit/b11e14b8296dd67b7f99c64322e12b0ea61fe462))
* update og and twitter image paths to local file ([4c05106](https://github.com/ryansutrisno/alsala/commit/4c05106d417476bc394dff2ffb28f1ee7c6973e4))
* update time formatting and debug logging in prayer timer ([16bb366](https://github.com/ryansutrisno/alsala/commit/16bb3666ed00f9aef3975f643214c60e2d2bbd4c))
* Use absolute URL for social media images ([894419a](https://github.com/ryansutrisno/alsala/commit/894419aa6d3e6582dd15306d252bbd1fc432ae79))

### 📚 Documentation

* update og image path comment in index.html ([cf0801a](https://github.com/ryansutrisno/alsala/commit/cf0801a4a128ee6529e4c2e662b63f792dc6a943))

### 💎 Styles

* add hover effect to footer link ([fc508d5](https://github.com/ryansutrisno/alsala/commit/fc508d594fb56e8ef2610b044aafc335d749cde4))
* **layout:** improve responsive layout and spacing consistency ([9cdc96c](https://github.com/ryansutrisno/alsala/commit/9cdc96c95ec192891618aa5c7bbf0aaecd99c485))

### 📦 Code Refactoring

* **layout:** improve responsive grid layout for prayer list and main content ([97b1758](https://github.com/ryansutrisno/alsala/commit/97b175850dbc27bed20bdd0346efddd885ee7c76))
* Rename application to Alsala ([10447ab](https://github.com/ryansutrisno/alsala/commit/10447ab7c393aa54fd252105aa4866858067b6df))
* Update app name to Alsala ([197ac1a](https://github.com/ryansutrisno/alsala/commit/197ac1a0c7c5cd30da84a198822e38ff1a3bb2f1))
* Update application name and fix console warning ([b6c3f24](https://github.com/ryansutrisno/alsala/commit/b6c3f24b533514b6a3fbc7f9bcd7715edb53d5e5))

### ⚙️ Chores

* **deps:** update package-lock.json for semantic-release ([bd096f8](https://github.com/ryansutrisno/alsala/commit/bd096f8476beabd2246da37d0e78e7c04237d308))
* update alsala-image.png binary file ([e615cc0](https://github.com/ryansutrisno/alsala/commit/e615cc0cdf5a2bdaa4009d12721c6af9ae1744d1))

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
