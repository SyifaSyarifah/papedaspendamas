# Sprint 2 — Handover Notes
**PIC:** Neo  
**Tanggal:** 1 Oktober 2026  
**Status:** ✅ SELESAI & VERIFIED (build clean, AI Chat berfungsi)

---

## ✅ Ringkasan Apa yang Sudah Dikerjakan

Sprint 2 mengubah GATRA dari simulasi regex lokal menjadi AI pipeline nyata yang terhubung ke **Groq Cloud API** (gratis, 0 RAM laptop).

### File Baru yang Dibuat

| File | Fungsi |
|------|--------|
| `src/lib/ai/groqClient.ts` | Adapter HTTP ke Groq Cloud API. Handle timeout (AbortController 10 detik), error mapping, dan request body. |
| `src/lib/ai/prompts.ts` | System prompt untuk 3 endpoint AI: `chat`, `explain`, `replan`. Prompt dirancang memaksa output JSON strict sesuai prinsip PRD *"AI Memahami, Sistem Menghitung."* |
| `src/lib/ai/parser.ts` | Validator & parser output JSON dari LLM. Handle edge case: markdown code block, Qwen3 `<think>...</think>` tags, field yang hilang/invalid. |
| `src/app/api/ai/chat/route.ts` | **Endpoint utama.** Menerima riwayat percakapan multi-turn, meneruskan ke Groq, mengembalikan preferensi terstruktur + balasan percakapan. |
| `src/app/api/ai/explain/route.ts` | Mengubah kode alasan mesin rekomendasi (`['interest_match', 'price: 0']`) menjadi narasi kalimat ramah di kartu rekomendasi. |
| `src/app/api/ai/replan/route.ts` | Mengekstrak aksi replanning dari instruksi bahasa natural user. |
| `.env.local` | Template variabel lingkungan. **Sudah diisi API key oleh Neo.** |

### File yang Dimodifikasi

| File | Perubahan |
|------|-----------|
| `src/components/planner/AIChatInterface.tsx` | **Besar.** Fungsi `processUserQuery()` (regex mock) diganti total dengan `fetch('/api/ai/chat', ...)`. Tambahan: loading stages kontekstual, fallback banner offline, auto-sync preferensi ke `TripPlannerContext`, auto-redirect ke `/plan/summary` saat preferensi lengkap. |

### Checklist Pembagian Tugas

Sudah diperbarui di [`ROADMAP-SPRINT-PEMBAGIAN-TUGAS.md`](./ROADMAP-SPRINT-PEMBAGIAN-TUGAS.md):

```
[x] 2.1 Buat API Route /api/ai/chat  --> PIC: [ Neo ]
[x] 2.2 System Prompt & JSON Parser  --> PIC: [ Neo ]
[x] 2.3 Sambungkan AIChatInterface   --> PIC: [ Neo ]
[x] 2.4 Mekanisme AI Fallback        --> PIC: [ Neo ]
```

---

## 🆓 Konfirmasi: Apakah Gratis?

**Ya, 100% gratis.** Tidak ada biaya tersembunyi selama di Free Tier.

### Detail Free Tier Groq

| Aspek | Detail |
|-------|--------|
| **Kartu Kredit** | ❌ Tidak diperlukan sama sekali |
| **Masa berlaku** | ♾️ Tidak ada expiry, bukan trial |
| **Model yang dipakai** | `qwen/qwen3.8-27b` — gratis |
| **RAM laptop** | **0 GB** untuk AI (komputasi di server Groq) |
| **Batas harian** | ~1.000 requests/hari (cukup untuk demo & pengembangan) |
| **Batas per menit** | 30 requests/menit |

> **Aman untuk kelompok.** Untuk konteks pengembangan dan demo, 1.000 request/hari lebih dari cukup. Jika tiba-tiba kena rate limit saat demo, fallback Quick Planner otomatis aktif — aplikasi tidak crash.

### Yang Perlu Dijaga

- Jangan commit file `.env.local` ke Git (sudah masuk `.gitignore` default Next.js ✅)
- Jika rate limit kena, tunggu 1 menit atau pakai fallback Quick Planner

---

## 🔧 Catatan Teknis Penting untuk Tim

### Model yang Dipakai: `qwen/qwen3.8-27b`

Model ini adalah Qwen3 generasi terbaru dari Alibaba yang tersedia gratis di Groq. Ada satu perilaku unik:

- **Thinking mode:** Qwen3 kadang menambahkan blok `<think>...</think>` sebelum output JSON saat berpikir. Parser di `src/lib/ai/parser.ts` sudah handle ini secara otomatis (di-strip sebelum JSON di-parse).

### Fallback Otomatis

Jika Groq offline / rate limit / API key salah:
1. Banner kuning muncul di AI Chat: *"GATRA AI Sedang Offline"*
2. Tombol "Quick Planner" muncul untuk arahkan user ke form manual
3. Tidak ada error layar putih — aplikasi tetap 100% bisa dipakai

---

## 📋 Step Selanjutnya untuk Tim

### Sprint 3 — Data & Real Routing (belum dikerjakan)

**Yang perlu dikerjakan berikutnya (urutan disarankan):**

#### 🔴 Prioritas Tinggi: Task 3.1 — Verifikasi Data Destinasi
- **File:** `src/data/gresikDestinations.ts` & `src/data/gresikCulinary.ts`
- **Apa yang dilakukan:** Cek akurasi koordinat (lat/lng), harga tiket, jam buka, estimasi durasi semua destinasi.
- **Target AC:** Min. 15 destinasi & 10 kuliner terverifikasi, tidak ada koordinat yang salah (jatuh di laut / luar Jawa Timur).
- **Cara cek koordinat:** Copy lat/lng ke Google Maps dan pastikan pinnya jatuh di lokasi yang benar.

#### 🔴 Prioritas Tinggi: Task 3.2 — Integrasi OSRM Routing
- **File baru:** `src/lib/routingService.ts`
- **File edit:** `src/app/plan/map/page.tsx`
- **Apa yang dilakukan:** Ganti kalkulasi jarak garis lurus dengan routing OSRM (jalan raya nyata).
- **API yang digunakan (gratis):**
  ```
  https://router.project-osrm.org/route/v1/driving/{lon1},{lat1};{lon2},{lat2}?overview=full&geometries=geojson
  ```
- **Output yang diharapkan:** Polyline berwarna mengikuti jalur jalan di peta Leaflet.

#### 🟡 Prioritas Sedang: Task 3.3 — Dynamic AI Explanation di Kartu Rekomendasi
- **File:** `src/lib/recommendationEngine.ts` & halaman `/plan/recommendation`
- **Apa yang dilakukan:** Hubungkan kartu rekomendasi ke endpoint `/api/ai/explain` yang sudah dibuat Sprint 2, agar penjelasan *"94% cocok karena..."* dihasilkan oleh AI (bukan hardcoded).
- **Catatan:** Endpoint sudah siap, tinggal dipanggil dari frontend.

### Sprint 4 & 5

Lihat detail di [`ROADMAP-SPRINT-PEMBAGIAN-TUGAS.md`](./ROADMAP-SPRINT-PEMBAGIAN-TUGAS.md). Sprint 4 (Replanning) dan Sprint 5 (QA) sebaiknya dikerjakan setelah Sprint 3 selesai karena memerlukan data destinasi yang akurat.

---

## 🚀 Cara Jalankan Proyek

```bash
# Pastikan .env.local sudah diisi GROQ_API_KEY
npm run dev

# Buka di browser
http://localhost:3000/plan?mode=ai
```

Coba ketik di AI Chat:
> *"Saya mau wisata seharian di Gresik, budget 150 ribu, naik motor, suka sejarah dan kuliner"*

AI akan merespons, mengekstrak preferensi, dan otomatis mengarahkan ke halaman rekomendasi saat semua parameter terpenuhi.
