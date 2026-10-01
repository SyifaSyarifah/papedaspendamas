# GATRA — Sprint Roadmap & Panduan Pembagian Tugas Tim (MVP)

> **Proyek:** GATRA (Gresik AI Travel & Recommendation Assistant)  
> **Status:** Pasca-Slicing Frontend → Menuju Fully Functional MVP  
> **Target:** Integrasi AI Model, Engine Rekomendasi Dinamis, Routing Riil, & Dynamic Replanning  
> **Tanggal Pembuatan:** September 2026  

---

## 1. Ringkasan Status Proyek

Saat ini, **fondasi frontend (12 Screen UI & Design System)** sudah terbangun di Next.js App Router. Namun, data masih statis (hardcoded) dan interaksi AI masih berupa simulasi regex lokal di browser.

### Prinsip Utama PRD yang Wajib Dijaga
> **"AI Memahami, Sistem Menghitung."**  
> AI (Qwen/LLM) hanya bertugas memahami bahasa natural, mengekstrak intent/preferensi ke format JSON, dan memberikan penjelasan (*explanation*). Perhitungan skor, filter harga, kalkulasi rute OSRM, dan urutan waktu itinerary **wajib dikerjakan oleh sistem programatis**, bukan halusinasi LLM.

---

## 2. Struktur Role & Rekomendasi Pembagian Tim

Berdasarkan arsitektur GATRA, berikut pemetaan peran tim yang ideal:

| Role Tim | Fokus Tanggung Jawab Utama |
|---|---|
| **Role A: AI & Backend Engineer** | API Route Next.js, Integrasi Model LLM (Qwen/Ollama/Cloud), System Prompt, Structured Output JSON Parser, AI Fallback. |
| **Role B: Fullstack / Frontend Integration** | Menghubungkan UI Chat, Rekomendasi, Itinerary, dan Summary ke API backend, State Management (`TripPlannerContext`), LocalStorage persistence. |
| **Role C: GIS, Routing & Data Engineer** | Integrasi Peta Leaflet/OSRM routing polyline, normalisasi database destinasi & kuliner Gresik, validasi koordinat & jam operasional. |
| **Role D: Core Engine & QA / Product Tester** | Logika Dynamic Replanning diff, pengujian Acceptance Criteria Persona Andi, kalibrasi bobot scoring (30/25/20/15/10), usability testing. |

*(Jika tim terdiri dari 2–3 orang, Role A & C bisa digabung menjadi Backend/Data, dan Role B & D menjadi Frontend/Engine/QA).*

---

## 3. Arsitektur Model AI: Groq Cloud API (Zero Laptop RAM)

Sesuai kesepakatan tim, untuk menghindari beban RAM/GPU laptop dan mempermudah demo bersama, komputasi LLM dialihkan ke **Groq Cloud API** dengan backend terminal tetap berjalan lokal di Next.js:

* **Model Pilihan:** 
  * `qwen-2.5-coder-32b` (Keluarga model Qwen sesuai acuan PRD 02)
  * `llama-3.3-70b-versatile` (Alternatif model 70B super cerdas, sangat fasih bahasa Indonesia)
* **Kebutuhan RAM Laptop:** **0 GB untuk AI** (Hanya menjalankan dev server Next.js `npm run dev`).
* **Environment Variable:** `GROQ_API_KEY=gsk_...` di file `.env.local`.

### 📌 Pemetaan Penerapan Groq Cloud API pada Menu PRD

| No | Menu / Layar PRD | Endpoint Backend | Fungsi & Perilaku Groq Cloud API |
|---|---|---|---|
| **1** | **Home (`/`)**<br>*(Hero AI Prompt Box)* | `POST /api/ai/chat` | Menerima kalimat pembuka user (*"Mau jalan 1 hari budget 150rb..."*), langsung mengekstrak parameter awal dan mengarahkan ke ringkasan preferensi tanpa mengisi form manual. |
| **2** | **Plan / AI Chat (`/plan`)**<br>*(AI Planner Chat)* | `POST /api/ai/chat` | Menangani percakapan interaktif multi-turn, mendeteksi intent, mengekstrak slot preferensi (`budget`, `interests`, `transport`, `duration`), serta memicu pertanyaan jika ada parameter yang kurang (*missing preferences*). |
| **3** | **Rekomendasi & Itinerary (`/plan/recommendation` & `/plan/itinerary`)**<br>*(Explainable AI)* | `POST /api/ai/explain` | Mengubah kode alasan dari engine sistem (`['interest_match', 'price: 0', 'nearby']`) menjadi narasi kalimat persuasif ramah di kartu rekomendasi: *"94% Cocok karena tiket gratis dan kaya nilai sejarah Islam di Gresik"*, serta menyusun catatan tips perjalanan pintar (*Smart Travel Tips*). |
| **4** | **Replanning (`/plan/replan` & `/plan/replan-result`)**<br>*(Sesuaikan Perjalanan)* | `POST /api/ai/replan` | Menerima instruksi perubahan bebas (*"Budget sisa 100 ribu, ganti makanan yang lebih murah"*), mengekstrak aksi replanning, lalu menyusun narasi ringkasan perbandingan (*diff explanation*) setelah sistem menukar item. |

> **Catatan Kritis PRD:** Menu **Explore (`/explore`)**, **Peta (`/plan/map`)**, dan **My Trip (`/my-trip`)** **TIDAK** menggunakan LLM, melainkan dikerjakan oleh sistem programatis (filter data lokal, OSRM routing jalan raya, dan `localStorage`).

---

## 4. Matriks Sprint & Tahapan Pekerjaan

```mermaid
gantt
    title Roadmap Pengerjaan GATRA Menuju Functional MVP
    dateFormat  X
    axisFormat  Day %d
    
    section Selesai
    Sprint 1: UI Slicing & Design System      :done, s1, 0, 3
    
    section Sprint Berjalan
    Sprint 2: AI Pipeline & Backend API       :active, s2, 3, 6
    Sprint 3: Real Routing (OSRM) & Data Layer :s3, 5, 8
    Sprint 4: Dynamic Replanning & Integration :s4, 7, 10
    Sprint 5: Testing, Hardening & Demo Pitch  :s5, 9, 12
```

---

## 4. Rincian Task Terperinci per Sprint

### 🚀 SPRINT 2: AI Pipeline & Backend Orchestrator
**Target:** Natural Language Chat di `/plan` benar-benar terhubung ke LLM dan menghasilkan parameter terstruktur yang valid.

#### Task 2.1 — Setup AI Gateway / Next.js Route Handler (Groq Cloud API)
* **PIC:** Role A (AI/Backend)
* **File Target:** `src/app/api/ai/chat/route.ts`, `src/app/api/ai/explain/route.ts`, `src/lib/ai/groqClient.ts`
* **Deskripsi:** 
  * Buat adapter API Route yang memanggil **Groq Cloud API** (`https://api.groq.com/openai/v1/chat/completions`) menggunakan model `qwen-2.5-coder-32b` atau `llama-3.3-70b-versatile`.
  * Simpan kredensial di file `.env.local` (`GROQ_API_KEY=gsk_...`).
  * Backend tetap berjalan lokal di terminal Next.js (`npm run dev`), sementara seluruh pemrosesan LLM dieksekusi di server Groq (0 RAM laptop).
  * Siapkan fallback jika Groq offline/timeout.
* **Acceptance Criteria:**
  * [ ] Endpoint merespons dalam waktu super cepat (< 1 detik).
  * [ ] Memiliki error handling timeout jika koneksi internet terputus.

#### Task 2.2 — System Prompt & Structured JSON Extraction
* **PIC:** Role A (AI/Backend)
* **File Target:** `src/lib/ai/prompts.ts` & `src/lib/ai/parser.ts`
* **Deskripsi:**
  * Susun system prompt yang memaksa model menghasilkan JSON strict dengan format:
    ```json
    {
      "intent": "create_trip" | "replan" | "inquire",
      "preferences": {
        "budget": number | null,
        "duration": "half_day" | "1_day" | "2_days" | null,
        "interests": string[],
        "transport": "motor" | "mobil" | "umum" | null,
        "travelStyle": "santai" | "padat" | null,
        "startLocation": string | null
      },
      "missingParameters": string[],
      "conversationalReply": string,
      "quickChoices": string[]
    }
    ```
  * Validasi output LLM menggunakan library schema (misal Zod atau schema validation).
* **Acceptance Criteria:**
  * [ ] Kalimat: *"Budget 150rb seharian naik motor suka tempat sejarah"* diekstrak 100% akurat menjadi JSON.
  * [ ] Kalimat ambigu memicu AI bertanya balik secara sopan melalui `conversationalReply` dan `quickChoices`.

#### Task 2.3 — Integrasi Frontend AIChatInterface ke API
* **PIC:** Role B (Frontend Integration)
* **File Target:** `src/components/planner/AIChatInterface.tsx`
* **Deskripsi:**
  * Ganti fungsi client-side regex mock (`processUserQuery`) dengan pemanggilan `fetch('/api/ai/chat', ...)`.
  * Saat preference terisi lengkap, perbarui state `TripPlannerContext` secara otomatis.
  * Tampilkan loading progress kontekstual (PRD 02 Bab 38): *"Memahami preferensi... Mencari destinasi..."*.
* **Acceptance Criteria:**
  * [ ] User mengetik bahasa bebas, AI merespons dinamis.
  * [ ] Preference summary ter-update otomatis di halaman `/plan/summary`.

#### Task 2.4 — Implementasi AI Fallback (PRD 02 Bab 12)
* **PIC:** Role A & Role B
* **Deskripsi:**
  * Jika API LLM offline / kuota habis / error 500:
  * Tampilkan banner informasi friendly: *"GATRA AI sedang offline, kamu tetap bisa menyusun itinerary lewat Quick Planner"*.
  * Arahkan user ke form tab Quick Planner tanpa error layar putih.
* **Acceptance Criteria:**
  * [ ] Matikan koneksi LLM, aplikasi tetap berjalan 100% menggunakan form manual.

---

### 🗺️ SPRINT 3: Data Persistence & Real Routing (OSRM / Maps)
**Target:** Data destinasi tersimpan rapi dan rute perjalanan di `/plan/map` menggunakan koordinat & jarak tempuh nyata.

#### Task 3.1 — Audit & Normalisasi Dataset Destinasi & Kuliner
* **PIC:** Role C (Data/GIS)
* **File Target:** `src/data/gresikDestinations.ts` & `src/data/gresikCulinary.ts`
* **Deskripsi:**
  * Validasi akurasi latitude/longitude destinasi nyata di Kabupaten Gresik (misal: Makam Sunan Giri, Bandar Grisse, Bukit Jamur, dsb.).
  * Lengkapi field harga tiket, jam buka/tutup, perkiraan durasi berkunjung, dan kategori UMKM.
  * Buat script helper untuk query data terfilter (bisa via SQLite lokal / API / Supabase).
* **Acceptance Criteria:**
  * [ ] Minimal 15 destinasi Gresik dan 10 spot kuliner lokal terverifikasi akurat.
  * [ ] Tidak ada destinasi dengan koordinat salah (misal terlempar ke laut atau luar Jawa Timur).

#### Task 3.2 — Integrasi OSRM / Real Routing Engine
* **PIC:** Role C & Role B
* **File Target:** `src/lib/routingService.ts` & `src/app/plan/map/page.tsx`
* **Deskripsi:**
  * Buat fungsi untuk memanggil OSRM Public Routing API:
    `https://router.project-osrm.org/route/v1/driving/{lon1},{lat1};{lon2},{lat2}?overview=full&geometries=geojson`
  * Dapatkan jarak nyata (meter/km) dan waktu tempuh (menit) berdasarkan jalan raya, bukan garis lurus Euclidean.
  * Render Polyline rute perjalanan di komponen Peta (Leaflet).
* **Acceptance Criteria:**
  * [ ] Total jarak tempuh dan waktu perjalanan di halaman `/plan/itinerary` dan `/plan/map` mencerminkan kondisi jalan Gresik.
  * [ ] Garis rute berwarna mengikuti jalur jalan raya di peta.

#### Task 3.3 — Dynamic AI Explanation Generator
* **PIC:** Role A & Role B
* **File Target:** `src/lib/recommendationEngine.ts` & kartu rekomendasi di `/plan/recommendation`
* **Deskripsi:**
  * Engine rekomendasi menghasilkan array kode alasan: `['interest_match', 'within_budget', 'nearby']`.
  * AI / Template engine menyusun penjelasan ramah: *"Museum A paling cocok karena sesuai minat sejarah Anda, harga tiket hemat (Rp10.000), dan hanya 15 menit dari lokasi awal."* (Sesuai PRD 02 Bab 9 & 36).
* **Acceptance Criteria:**
  * [ ] Kartu rekomendasi menampilkan persentase kecocokan (e.g. 94%) dan 2–3 poin alasan konkret.

---

### 🔄 SPRINT 4: Dynamic Replanning & State Persistence
**Target:** Pengguna dapat mengubah rencana di `/plan/replan` dan sistem memperbarui itinerary serta menampilkan perbandingan biaya (diff).

#### Task 4.1 — Backend / Client Logic Partial Replanning
* **PIC:** Role D (Core Engine) & Role B
* **File Target:** `src/lib/replanningEngine.ts`
* **Deskripsi:**
  * Implementasikan 5 aksi perubahan sesuai PRD Bab 11:
    1. **Kurangi Budget:** Ganti destinasi/kuliner berbayar dengan opsi yang lebih murah/gratis.
    2. **Ganti Kuliner:** Ambil alternatif kuliner lain yang berada dalam radius 1–2 km dari rute itinerary.
    3. **Ganti Destinasi:** Tukar salah satu destinasi dengan kandidat peringkat berikutnya dari hasil ranking.
    4. **Buat Lebih Santai:** Kurangi 1 destinasi dan perpanjang waktu istirahat di spot kuliner.
    5. **Input Natural Language:** Input instruksi bebas via AI.
* **Acceptance Criteria:**
  * [ ] Fungsi mengembalikan objek `ReplanningDiff`:
    ```typescript
    interface ReplanningDiff {
      reason: string;
      originalItem: { name: string; cost: number };
      newItem: { name: string; cost: number };
      costBefore: number;
      costAfter: number;
      budgetSaved: number;
    }
    ```

#### Task 4.2 — Integrasi Layar Replanning Result (`/plan/replan-result`)
* **PIC:** Role B (Frontend Integration)
* **Deskripsi:**
  * Hubungkan aksi tombol di `/plan/replan` agar mengirim state ke `/plan/replan-result`.
  * Tampilkan kartu komparasi visual "Sebelumnya" vs "Diganti" dengan badge hemat biaya.
  * Tombol **"Terapkan Perubahan"** wajib meng-update `activeItinerary` di context dan redirect kembali ke itinerary yang sudah terbarukan.
* **Acceptance Criteria:**
  * [ ] Perubahan langsung tercermin di total budget dan timeline perjalanan tanpa me-reset seluruh preferensi.

#### Task 4.3 — Fitur Simpan & Kelola Perjalanan (`/my-trip`)
* **PIC:** Role B
* **Deskripsi:**
  * Pastikan fungsi `saveTrip`, `deleteSavedTrip`, dan `duplicateSavedTrip` di `TripPlannerContext` berjalan stabil dengan `localStorage`.
  * Tombol "Simpan Perjalanan" di `/plan/itinerary` memberikan feedback toast sukses dan trip muncul di `/my-trip`.
* **Acceptance Criteria:**
  * [ ] Refresh browser tidak menghilangkan trip yang sudah disimpan.

---

### 🧪 SPRINT 5: Testing, Hardening & Final Demo Readiness
**Target:** Aplikasi tahan banting, bebas bug kritis, dan lolos seluruh Acceptance Criteria pada PRD MVP Bab 31.

#### Task 5.1 — Validasi Skenario Uji Persona Utama (PRD Bab 6 & 31)
* **PIC:** Role D (QA/Product Tester)
* **Skenario Uji:**
  * **Input Persona Andi:** Berangkat dari Surabaya, Budget Rp150.000, 1 Hari, Minat Sejarah + Kuliner, Kendaraan Motor.
  * **Hasil yang Diharapkan:**
    * Sistem merekomendasikan destinasi sejarah Gresik (misal: Kawasan Bandar Grisse, Museum Sunan Giri).
    * Kuliner lokal yang disarankan sesuai rute (misal: Nasi Krawu terdekat).
    * Total estimasi biaya tidak melebihi Rp150.000 (misal: Rp125.000 dengan sisa Rp25.000).
    * Rute perjalanan logis dan tidak bolak-balik arah.
* **Acceptance Criteria:**
  * [ ] Seluruh skenario berhasil dieksekusi tanpa error.

#### Task 5.2 — Uji Ketahanan Prompt & Edge Cases
* **PIC:** Role A & Role D
* **Deskripsi:**
  * Uji input bahasa natural yang tidak lazim, misalnya:
    * Budget ekstrem: *"Saya punya budget 5 juta"* atau *"Budget saya cuma 10 ribu"*.
    * Destinasi di luar Gresik: *"Saya mau ke Malioboro"*.
    * Minat kontradiktif: *"Pengen naik gunung tapi budget nol dan waktu cuma 1 jam"*.
  * Pastikan AI memberikan respons guardrail yang sopan dan mengarahkan kembali ke wisata Gresik.
* **Acceptance Criteria:**
  * [ ] Aplikasi tidak crash atau menghasilkan NaN pada perhitungan biaya.

#### Task 5.3 — Polishing UI, Responsive & Accessibility Check
* **PIC:** Role B & Role D
* **Deskripsi:**
  * Uji tampilan di mobile viewport (360px - 414px) dan desktop (1440px).
  * Pastikan bottom navigation dan sticky budget card nyaman digunakan di layar HP.
  * Optimasi kecepatan loading image destinasi.
* **Acceptance Criteria:**
  * [ ] Skor Google Lighthouse Performance & Accessibility > 85.

---

## 5. Lembar Pembagian Tugas (Action Checklist Tim)

Silakan centang dan cantumkan nama anggota tim yang bertugas:

```text
=== SPRINT 2: AI BACKEND & ORCHESTRATOR ===
[x] 2.1 Buat API Route `/api/ai/chat` (Ollama/Cloud LLM Adapter)  --> PIC: [ Neo ]
[x] 2.2 System Prompt & JSON Structured Preference Extractor     --> PIC: [ Neo ]
[x] 2.3 Sambungkan AIChatInterface.tsx ke API Route               --> PIC: [ Neo ]
[x] 2.4 Mekanisme AI Fallback jika LLM Offline                   --> PIC: [ Neo ]

=== SPRINT 3: DATA & REAL ROUTING (OSRM) ===
[ ] 3.1 Verifikasi Data Koordinat & Jam Buka Destinasi Gresik     --> PIC: [ ____________ ]
[ ] 3.2 Implementasi OSRM Routing & Polyline Jalan di Leaflet    --> PIC: [ ____________ ]
[ ] 3.3 Dynamic AI Explanation di Kartu Rekomendasi              --> PIC: [ ____________ ]

=== SPRINT 4: REPLANNING & PERSISTENCE ===
[ ] 4.1 Buat Logika Parsial Replanning (Kurangi Budget / Ganti)  --> PIC: [ ____________ ]
[ ] 4.2 Tampilan Diff Hasil Perubahan di `/plan/replan-result`   --> PIC: [ ____________ ]
[ ] 4.3 Fitur Simpan & Hapus Perjalanan di `/my-trip`            --> PIC: [ ____________ ]

=== SPRINT 5: QA & DEMO READINESS ===
[ ] 5.1 Uji Coba Skenario Persona Andi (Rp150k, Sejarah, Motor)  --> PIC: [ ____________ ]
[ ] 5.2 Pengujian Edge Case Input & Guardrail AI                 --> PIC: [ ____________ ]
[ ] 5.3 Uji Responsivitas Mobile & Performa                      --> PIC: [ ____________ ]
```

---

## 6. Contoh Kontrak API (Spesifikasi Teknis Cepat)

### Request: `POST /api/ai/chat`
```json
{
  "messages": [
    { "sender": "user", "text": "Saya punya waktu satu hari, budget 150 ribu, suka sejarah dan kuliner." }
  ],
  "currentPreferences": {}
}
```

### Response Sukses: `200 OK`
```json
{
  "extractedPreferences": {
    "budget": 150000,
    "duration": "1_day",
    "interests": ["sejarah", "kuliner"],
    "transport": null,
    "travelStyle": "santai"
  },
  "isComplete": false,
  "reply": "Pilihan yang menarik! Untuk perjalanan 1 hari sejarah & kuliner dengan budget Rp150.000, Anda berencana menggunakan kendaraan apa?",
  "quickChoices": ["Motor", "Mobil", "Transportasi Umum"]
}
```

---

*Dokumen ini merupakan panduan teknis resmi tim GATRA. Silakan update status task seiring berjalannya sprint.*
