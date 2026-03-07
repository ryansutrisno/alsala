# Contributing to Alsala

Terima kasih atas minat Anda untuk berkontribusi pada proyek Alsala! 🎉

## Cara Berkontribusi

### 1. Fork dan Clone Repository

```bash
# Fork repository di GitHub, kemudian clone
git clone https://github.com/username/alsala.git
cd alsala

# Install dependencies
npm install
```

### 2. Buat Branch Baru

```bash
# Buat branch untuk fitur/perbaikan Anda
git checkout -b feat/nama-fitur-baru
# atau
git checkout -b fix/nama-bug-yang-diperbaiki
```

### 3. Development

```bash
# Jalankan development server
npm run dev

# Build untuk memastikan tidak ada error
npm run build
```

### 4. Commit Perubahan

**PENTING:** Kami menggunakan [Conventional Commits](https://www.conventionalcommits.org/) dan [Semantic Versioning](https://semver.org/). Pastikan pesan commit Anda mengikuti format:

#### Format Commit

```
<type>(<scope>): <description>

[optional body]

[optional footer(s)]
```

#### Tipe Commit

| Tipe | Deskripsi | Versi |
|------|-----------|-------|
| `feat` | Fitur baru | MINOR |
| `fix` | Perbaikan bug | PATCH |
| `docs` | Perubahan dokumentasi | PATCH |
| `style` | Formatting, missing semi colons, etc | PATCH |
| `refactor` | Refactoring kode | PATCH |
| `perf` | Perbaikan performa | PATCH |
| `test` | Menambah/mengubah tests | PATCH |
| `chore` | Perubahan build/process, dependencies | PATCH |
| `revert` | Revert commit sebelumnya | PATCH |

#### Contoh Commit Messages

✅ **Benar:**
```bash
feat(prayer): add auto-refresh on midnight

Automatically fetch new prayer data when day changes.
This ensures users always see today's schedule.

fix(audio): resolve adhan not playing on mobile browsers

docs(readme): update installation instructions

style(app): fix indentation in header component

refactor(clock): simplify time formatting logic
```

❌ **Salah:**
```bash
tambah fitur baru
update code
fix bug
```

### 5. Push dan Buat Pull Request

```bash
# Push branch ke GitHub
git push origin feat/nama-fitur-baru

# Buat Pull Request di GitHub
```

## Semantic Versioning

Proyek ini menggunakan semantic versioning yang diotomatisasi:

- **MAJOR** (`v2.0.0`) - Breaking changes (contoh: hapus fitur, ubah API)
- **MINOR** (`v1.1.0`) - Fitur baru, backward compatible
- **PATCH** (`v1.0.1`) - Bug fixes

### Breaking Changes

Jika perubahan Anda adalah breaking change, tambahkan `BREAKING CHANGE:` di footer commit:

```
feat(api): change prayer time format from 12h to 24h

BREAKING CHANGE: Prayer times now use 24-hour format instead of 12-hour
```

## Struktur Proyek

```
alsala/
├── components/          # React components
│   ├── Clock.tsx
│   ├── InspirationCard.tsx
│   └── PrayerList.tsx
├── services/           # Business logic & API
│   ├── prayerService.ts
│   └── quoteService.ts
├── public/             # Static assets
├── App.tsx            # Main component
└── index.html         # Entry point
```

## Code Style

- Gunakan **TypeScript** untuk type safety
- Gunakan **functional components** dengan React Hooks
- Gunakan **Tailwind CSS** untuk styling
- Pastikan komponen **responsive** (mobile-first)
- Tambahkan **prop types** untuk TypeScript

## Testing

```bash
# Build project untuk memastikan tidak ada error
npm run build

# Preview build
npm run preview
```

## Checklist Sebelum PR

- [ ] Kode berjalan tanpa error
- [ ] Build berhasil (`npm run build`)
- [ ] Tidak ada console errors
- [ ] Responsive di mobile dan desktop
- [ ] Commit messages mengikuti conventional commits
- [ ] CHANGELOG.md diupdate jika diperlukan
- [ ] README.md diupdate jika ada fitur baru

## Butuh Bantuan?

Jika Anda memiliki pertanyaan, silakan:
1. Buka [Issue](https://github.com/username/alsala/issues) baru
2. Diskusikan di komentar issue yang relevan

## Kode Etik

- Hormati kontributor lain
- Terima kritik dengan positif
- Fokus pada apa yang terbaik untuk komunitas
- Tunjukkan empati kepada anggota komunitas lain

---

Terima kasih telah berkontribusi! 🙏
