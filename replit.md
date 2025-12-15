# Kuis Ketenagakerjaan

Aplikasi kuis berbasis web untuk menguji pengetahuan siswa tentang ketenagakerjaan, angkatan kerja, pengangguran, dan hak-hak tenaga kerja.

## Overview

- **Tujuan**: Aplikasi edukasi untuk tugas sekolah
- **Bahasa**: Indonesia
- **Status**: Siap digunakan

## Fitur

1. **Halaman Input Nama** - Siswa memasukkan nama sebelum memulai kuis
2. **Kuis Pilihan Ganda** - 10 soal dengan 4 pilihan jawaban
3. **Sistem Skor** - +10 poin per jawaban benar (maksimal 100)
4. **Hasil Akhir** - Menampilkan nama dan total skor
5. **Daftar Skor** - Papan peringkat semua siswa

## Tech Stack

- **Frontend**: React + TypeScript + Tailwind CSS
- **Backend**: Node.js + Express
- **Storage**: In-memory (MemStorage)
- **Routing**: Wouter
- **Data Fetching**: TanStack Query

## API Endpoints

| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| GET | /api/questions | Ambil semua soal |
| POST | /api/score | Simpan skor siswa |
| GET | /api/scores | Lihat daftar skor |

## Struktur Folder

```
├── client/src/
│   ├── pages/
│   │   ├── home.tsx      # Input nama siswa
│   │   ├── quiz.tsx      # Halaman kuis
│   │   ├── result.tsx    # Hasil akhir
│   │   └── scores.tsx    # Daftar skor
│   └── components/ui/    # Shadcn components
├── server/
│   ├── routes.ts         # API endpoints
│   └── storage.ts        # In-memory storage & data soal
└── shared/
    └── schema.ts         # TypeScript types
```

## Menjalankan Project

```bash
npm run dev
```

Aplikasi akan berjalan di port 5000.

## Tema Soal

Soal-soal kuis mencakup:
- Pengertian angkatan kerja
- Batas usia kerja di Indonesia
- Jenis-jenis pengangguran
- Upah Minimum Regional (UMR)
- Hak dan kewajiban pekerja
- BPJS Ketenagakerjaan
- Tingkat Partisipasi Angkatan Kerja (TPAK)
