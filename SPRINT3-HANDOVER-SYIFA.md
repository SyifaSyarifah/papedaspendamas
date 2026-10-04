# Sprint 3 — Handover Notes
**PIC:** Syifa  
**Tanggal:** 1 Oktober 2026  
**Status:** ✅ SELESAI & VERIFIED (build clean, OSRM routing berfungsi, dataset terverifikasi, AI explanation terintegrasi)

---

## ✅ Ringkasan Apa yang Sudah Dikerjakan

Sprint 3 berfokus pada **Data Layer, Real Routing (OSRM), dan Dynamic AI Explanation**. Pada sprint ini, GATRA tidak lagi menggunakan koordinat atau jarak garis lurus statis (dummy `28.5 km`), melainkan menggunakan rute jaringan jalan raya riil Kabupaten Gresik serta data destinasi/kuliner lokal yang komprehensif dan terverifikasi akurat.

### File Baru yang Dibuat

| File | Fungsi |
|------|--------|
| `src/lib/routingService.ts` | Service pemanggil **OSRM Public Routing API** (`driving`). Menghitung jarak jalan raya riil (km), durasi perjalanan (menit), dan koordinat *polyline* kelokan jalan nyata. Memiliki fallback matematis Haversine + road factor 1.3x jika OSRM timeout. |

### File yang Dimodifikasi

| File | Perubahan |
|------|-----------|
| `src/data/gresikDestinations.ts` | **Perluasan Dataset Destinasi.** Diperluas dari 8 menjadi **16 destinasi wisata riil** di Kabupaten Gresik (Sejarah, Religi, Alam, Rekreasi Keluarga, Geowisata, dan Ekowisata) dengan koordinat GPS (lat/long) nyata, jam buka operasional, harga tiket, dan rekomendasi durasi. |
| `src/data/gresikCulinary.ts` | **Perluasan Dataset Kuliner UMKM.** Diperluas dari 4 menjadi **11 spot kuliner & jajanan khas Gresik** (Nasi Krawu, Pudak, Bandeng Asap, Bonggolan, Kopi Giras, Es Legen Siwalan, Sego Roomo, Martabak Usus, Soto Cak Ri, Bebek Pencit GKB) lengkap dengan koordinat dan radius kedekatan dengan destinasi. |
| `src/types/destination.ts` | Menambahkan properti opsional `aiExplanation?: string` pada interface `Destination` untuk menampung narasi alasan rekomendasi dari AI. |
| `src/lib/itineraryGenerator.ts` | Menghitung jarak rute dan estimasi waktu tempuh antar slot timeline secara dinamis berdasarkan koordinat GPS aktual (menggantikan dummy jarak `18.5 km` dan `28.5 km`). |
| `src/components/map/GoogleMap.tsx` | Mengintegrasikan `fetchOSRMRoute` untuk menggambar garis rute perjalanan (*polyline*) yang mengikuti kontur jalan raya nyata Gresik (bukan garis lurus putus-putus), serta meneruskan jarak dan durasi aktual ke parent component via `onRouteCalculated`. |
| `src/components/map/LeafletMap.tsx` | Mengintegrasikan rute jalan raya OSRM untuk komponen peta alternatif Leaflet. |
| `src/app/plan/map/page.tsx` | Menampilkan indikator status *OSRM Routing*, menyinkronkan jarak kilometer dan waktu berkendara aktual dari hasil hitungan OSRM ke header badge dan kartu floating. |
| `src/components/explore/DestinationCard.tsx` | Menambahkan rendering blok visual khusus **"Analisis AI GATRA"** bergradasi emas lembut jika destinasi memiliki narasi alasan kecocokan dari model AI. |
| `src/app/plan/recommendation/page.tsx` | Memanggil endpoint `POST /api/ai/explain` (buatan Neo pada Sprint 2) secara asinkron untuk 3 destinasi teratas, menyematkan narasi AI ke kartu rekomendasi, serta menambahkan banner info *Explainable AI Aktif*. |
| `ROADMAP-SPRINT-PEMBAGIAN-TUGAS.md` | Memperbarui checklist Task 3.1, 3.2, dan 3.3 menjadi selesai `[x]` atas nama Syifa & Antigravity. |

### Checklist Pembagian Tugas yang Selesai

```text
=== SPRINT 3: DATA & REAL ROUTING (OSRM) ===
[x] 3.1 Verifikasi Data Koordinat & Jam Buka Destinasi Gresik     --> PIC: [ Syifa & Antigravity ]
[x] 3.2 Implementasi OSRM Routing & Polyline Jalan di Leaflet    --> PIC: [ Syifa & Antigravity ]
[x] 3.3 Dynamic AI Explanation di Kartu Rekomendasi              --> PIC: [ Syifa & Antigravity ]
```

---

## 🗺️ Detail Teknis Real Routing (OSRM API)

### 1. Prinsip: "AI Memahami, Sistem Menghitung"
Sesuai PRD Bab 02, rute jalan dan kalkulasi kilometer tidak dihalusinasi oleh LLM, melainkan dihitung secara matematis menggunakan OSRM:
```typescript
// Panggilan OSRM Driving API
const osrmUrl = `https://router.project-osrm.org/route/v1/driving/${coordsParam}?overview=full&geometries=geojson`;
```

### 2. Algoritma Polyline Jalan Raya
- Koordinat dari OSRM bertipe GeoJSON `[lon, lat]` secara otomatis dikonversi menjadi format Leaflet `[lat, lon]`.
- Garis rute di peta digambar dengan gaya Google Maps dua lapis:
  1. Lapisan bawah: garis biru tebal (`#1a73e8`, tebal 6px) sebagai badan jalan.
  2. Lapisan atas: garis putih putus-putus (`#ffffff`, tebal 2px) sebagai penunjuk arah lajur.

### 3. Ketahanan Sistem (High Availability Fallback)
Jika koneksi internet lambat / OSRM publik mengalami timeout (>6 detik):
- Sistem otomatis mengaktifkan **Formula Haversine + Koefisien Jalan Gresik (1.3x)**.
- Estimasi waktu perjalanan dihitung berdasarkan rata-rata kecepatan kendaraan motor (30–35 km/jam).
- Aplikasi **tidak akan pernah freeze / crash / layar putih**.

---

## 🤖 Integrasi Dynamic Explainable AI

Di halaman `/plan/recommendation`, sistem kini menyatukan engine skoring matematis dan kecerdasan generatif:
1. `recommendationEngine.ts` menghitung skor kecocokan matematis (bobot 30% minat, 25% budget, 20% jarak, 15% gaya liburan, 10% rating).
2. Tiga destinasi teratas otomatis dikirim ke endpoint `POST /api/ai/explain`.
3. Model Groq Cloud (`qwen/qwen3.8-27b`) mengubah kode alasan (`interest_match`, `within_budget`) menjadi kalimat persuasif ramah di kartu rekomendasi:
   > *"94% cocok untukmu! Kawasan Bandar Grisse menawarkan pengalaman sejarah akulturasi yang kaya, tiket masuk gratis, dan terletak di pusat kota Gresik sehingga mudah dijangkau dengan motor."*

---

## 🧪 Panduan Cara Mengetes Hasil Sprint 3

Pastikan development server Next.js aktif (`npm run dev`):

### 1. Uji Validitas Data & AI Explanation di Kartu Rekomendasi
1. Buka browser: [http://localhost:3000/plan/recommendation](http://localhost:3000/plan/recommendation)
2. **Periksa:**
   - [x] Terdapat 16 kartu destinasi wisata Gresik yang beragam saat filter diubah-ubah (Sejarah, Kuliner, Alam, Religi).
   - [x] Banner atas menampilkan informasi: *"Explainable AI Aktif"*.
   - [x] Kartu destinasi teratas memiliki kotak **"Analisis AI GATRA"** dengan narasi personal dari AI.

### 2. Uji Rute Nyata OSRM di Halaman Peta
1. Klik tombol **"Buat Jadwal Otomatis"** di bawah halaman rekomendasi.
2. Pada halaman Itinerary, klik **"Buka di Peta"** ([http://localhost:3000/plan/map](http://localhost:3000/plan/map)).
3. **Periksa:**
   - [x] Badge di atas sidebar kiri tertulis: `OSRM Routing` dengan jarak aktual.
   - [x] Garis biru di peta mengikuti belokan jalan raya di Kabupaten Gresik (bukan garis lurus menembus gedung/laut).
   - [x] Kartu mengambang (*floating card*) di bagian bawah peta menampilkan jarak dan durasi waktu riil di jalan.
   - [x] Tombol *"Buka Navigasi Rute di App Google Maps"* mengarahkan koordinat waypoints yang valid ke Google Maps.

---

## 📋 Step Selanjutnya untuk Tim: Sprint 4 (Dynamic Replanning)

Dengan data dan rute yang sudah riil, tim siap melanjutkan ke **Sprint 4: Replanning & Persistence**:
1. **Task 4.1 & 4.2:** Mengimplementasikan mesin penukaran item di [src/app/plan/replan/page.tsx](file:///c:/Users/syifa/Gresik-Lomba/Gatra-project/papedaspendamas/src/app/plan/replan/page.tsx) (Opsi: Kurangi Budget, Ganti Kuliner, Ganti Destinasi, Buat Lebih Santai, atau input natural language via `/api/ai/replan`) dan menampilkan kartu perbandingan biaya (*diff*) di `/plan/replan-result`.
2. **Task 4.3:** Mengaktifkan penyimpanan itinerary ke `localStorage` agar perjalanan tersimpan di `/my-trip`.
