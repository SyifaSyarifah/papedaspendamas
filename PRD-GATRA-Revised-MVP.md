# PRD — GATRA
## AI-Powered Personalized Travel Planner for Gresik

**Status:** Proposed / Revised MVP  
**Platform:** Web Application  
**Wilayah Fokus:** Kabupaten Gresik  
**Produk:** GATRA — Gresik AI Travel & Recommendation Assistant

---

## 1. Executive Summary

GATRA adalah aplikasi **personal travel planning** yang membantu wisatawan menyusun perjalanan di Gresik berdasarkan kebutuhan dan kondisi personal seperti:

- minat wisata,
- waktu yang tersedia,
- budget,
- lokasi awal,
- moda transportasi,
- jumlah orang,
- dan gaya perjalanan.

GATRA **bukan** portal pariwisata yang menyediakan seluruh layanan pariwisata dalam satu platform dan bukan pengganti SIPATU.

Posisi GATRA adalah sebagai **planning dan personalization layer** yang membantu mengubah informasi destinasi menjadi keputusan perjalanan yang lebih mudah dipahami pengguna.

### Core Value

> **Dari "Saya mau wisata ke mana?" menjadi "Ini perjalanan yang paling sesuai untuk saya."**

---

# 2. Latar Belakang

Informasi mengenai pariwisata semakin mudah ditemukan secara digital. Namun, banyaknya informasi tidak selalu membuat wisatawan lebih mudah mengambil keputusan.

Wisatawan dapat menemukan berbagai destinasi, kuliner, dan informasi perjalanan, tetapi masih harus menentukan sendiri:

- tempat yang sesuai dengan minat,
- tempat yang sesuai dengan budget,
- urutan perjalanan,
- waktu kunjungan,
- rute,
- serta alternatif ketika rencana berubah.

SIPATU memiliki orientasi pada digitalisasi akses informasi dan layanan pariwisata. GATRA mengambil ruang masalah yang lebih spesifik:

> **Bagaimana membantu wisatawan mengambil keputusan dan menyusun perjalanan personal dari berbagai pilihan wisata yang tersedia?**

---

# 3. Problem Statement

Wisatawan yang ingin melakukan perjalanan di Gresik dapat menemukan banyak pilihan tempat, tetapi kesulitan menentukan kombinasi perjalanan yang paling sesuai dengan:

- waktu,
- budget,
- minat,
- lokasi,
- transportasi,
- dan kondisi perjalanan.

### Contoh

Seorang wisatawan mengatakan:

> "Saya punya waktu satu hari, budget Rp150.000, suka sejarah dan kuliner, dan berangkat dari Surabaya."

Masalahnya bukan sekadar mencari:

> "Tempat wisata Gresik."

Tetapi:

> **"Tempat mana yang paling cocok, bagaimana urutannya, berapa perkiraan biayanya, dan bagaimana saya sampai ke sana?"**

Inilah masalah utama yang diselesaikan GATRA.

---

# 4. Product Vision

> **Menjadi asisten perencanaan perjalanan personal yang membantu wisatawan membuat perjalanan yang lebih relevan, efisien, dan mudah dilakukan.**

GATRA dikembangkan bertahap dari:

**Travel Planner → Personal Travel Companion → Smart Travel Platform**

---

# 5. Product Positioning

## SIPATU

Fokus:

> **Digital Tourism Information & Service**

GATRA tidak mencoba menggantikan fungsi tersebut.

## GATRA

Fokus:

> **Personal Travel Planning & Recommendation**

GATRA membantu pengguna:

- memahami kebutuhan perjalanan,
- menemukan destinasi yang relevan,
- menentukan kombinasi destinasi,
- menyusun itinerary,
- menghitung estimasi budget,
- melihat rute,
- dan mengubah rencana secara fleksibel.

### Perbedaan inti

| Aspek | SIPATU | GATRA MVP |
|---|---|---|
| Informasi pariwisata | Fokus utama | Pendukung |
| Layanan pemerintah | Ya | Tidak |
| Transaksi | Ada pada layanan tertentu | Tidak |
| Ticketing | Ada pada layanan tertentu | Tidak |
| Penyewaan fasilitas | Ada | Tidak |
| Personal recommendation | Bukan fokus utama | Fokus |
| AI conversational | Bukan fokus utama | Fokus |
| Itinerary otomatis | Bukan fokus utama | Fokus |
| Budget-aware planning | Bukan fokus utama | Fokus |
| Replanning | Bukan fokus utama | Fokus |
| Personal travel planning | Bukan fokus utama | Fokus |

> Catatan: perbandingan di atas menggunakan ruang lingkup SIPATU sebagaimana dijelaskan dalam sumber berita yang menjadi dasar proyek. Tidak dimaksudkan sebagai audit teknis lengkap terhadap implementasi SIPATU.

---

# 6. Target User

## Primary User

### Wisatawan / Calon Wisatawan

Orang yang:

- ingin berwisata di Gresik,
- belum memiliki itinerary,
- memiliki batasan waktu/budget,
- mempunyai preferensi tertentu,
- dan membutuhkan bantuan dalam menentukan perjalanan.

### Contoh Persona

**Nama:** Andi  
**Tujuan:** Wisata satu hari  
**Budget:** Rp150.000  
**Minat:** Sejarah + Kuliner  
**Transportasi:** Motor  
**Masalah:** Tidak tahu destinasi mana yang sebaiknya dikunjungi terlebih dahulu.

---

# 7. Jobs To Be Done

> **When I want to travel in Gresik but don't know how to arrange the trip, I want to tell the system my budget, time, interests and transportation so that it can create a practical itinerary that fits my needs.**

Versi sederhana:

> **"Saya ingin jalan-jalan tanpa harus menghabiskan banyak waktu untuk merencanakannya."**

---

# 8. Scope MVP

## 8.1 In Scope

### Core Features

1. Travel Planner
2. AI Travel Assistant
3. Recommendation Engine
4. Destination Discovery
5. Contextual Food / UMKM Recommendation
6. Itinerary Generator
7. Budget Estimation
8. Map & Route Visualization
9. Itinerary Replanning
10. Saved Trip

### Supporting Features

11. User Profile
12. User Preference
13. Admin Data Management

---

# 9. Out of Scope — MVP

Fitur berikut **sengaja tidak dikerjakan pada MVP**.

### Hotel

- Hotel booking
- Manajemen kamar
- Pembayaran hotel
- Hotel marketplace

### Transportasi

- Booking kendaraan
- Pembelian tiket transportasi
- Rental kendaraan

### Transaksi

- Payment gateway
- Invoice transaksi
- Refund
- Settlement

### Ticketing

- Tiket destinasi
- Tiket bus
- Sistem ticketing umum

### Marketplace

- Marketplace UMKM
- Checkout produk
- Manajemen penjual

### Food Discovery Penuh

Kuliner tidak menjadi aplikasi pencarian makanan mandiri.

Kuliner pada MVP digunakan untuk melengkapi itinerary.

### Event Platform

- Event management
- Ticketing event
- Kalender event sebagai sistem utama

### Custom Machine Learning

Machine Learning khusus belum menjadi bagian MVP.

---

# 10. Core Product Loop

Seluruh sistem berpusat pada:

```text
USER NEED
   ↓
PREFERENCE
   ↓
RECOMMENDATION
   ↓
ITINERARY
   ↓
MAP
   ↓
USER FEEDBACK
   ↓
REPLANNING
   ↓
UPDATED ITINERARY
```

---

# 11. Functional Requirements

## FR-01 — Travel Planner

Pengguna dapat menentukan:

- lokasi awal,
- durasi,
- budget,
- minat,
- transportasi,
- jumlah orang,
- gaya perjalanan.

Output:

> Preference Profile

Contoh:

```text
Location    : Surabaya
Duration    : 1 Day
Budget      : Rp150.000
Interest    : Sejarah
Food        : Lokal
Transport   : Motor
Style       : Santai
```

---

## FR-02 — AI Travel Assistant

AI memahami input bahasa natural.

Contoh:

> "Saya cuma punya Rp200 ribu dan ingin jalan-jalan santai di Gresik. Saya suka tempat bersejarah."

AI mengekstrak:

```text
Budget = 200000
Style = Relaxed
Interest = History
Location = Gresik
```

Jika informasi kurang, AI dapat bertanya:

> "Anda ingin perjalanan satu hari atau lebih?"

---

# 12. AI Boundary

AI berfungsi sebagai lapisan pemahaman dan interaksi.

### AI BOLEH

- memahami bahasa natural,
- mengekstrak intent,
- memahami preference,
- bertanya,
- menjelaskan rekomendasi,
- mengubah itinerary,
- memberikan alternatif.

### AI TIDAK BOLEH

- mengarang harga,
- mengarang koordinat,
- mengarang jam buka,
- mengarang rating,
- mengarang fasilitas,
- menjadi database destinasi.

AI harus menggunakan data terstruktur dari sistem sebagai sumber fakta.

### Alur

```text
User
 ↓
AI
 ↓
Intent Extraction
 ↓
Structured Preference
 ↓
Recommendation Engine
 ↓
Database
 ↓
Recommendation
 ↓
AI Explanation
 ↓
User
```

Contoh structured preference:

```json
{
  "budget": 150000,
  "duration": "1_day",
  "interests": ["history", "culinary"],
  "transport": "motor",
  "travel_style": "relaxed"
}
```

---

# 13. FR-03 — Recommendation Engine

Recommendation Engine adalah inti intelligence GATRA.

### Input

- Budget
- Duration
- Interest
- Location
- Transport
- Group Size
- Travel Style

### Proses

```text
FILTER
   ↓
SCORING
   ↓
RANKING
```

Contoh bobot awal:

| Faktor | Bobot |
|---|---:|
| Interest Match | 30% |
| Budget | 25% |
| Distance | 20% |
| Travel Time | 15% |
| Rating | 10% |

Bobot merupakan konfigurasi awal dan dapat dikalibrasi melalui pengujian.

---

# 14. FR-04 — Destination Recommendation

Sistem menampilkan:

- nama destinasi,
- kategori,
- harga,
- jarak,
- estimasi waktu,
- match score,
- alasan rekomendasi.

Contoh:

```text
Museum X

94% cocok

✓ Sesuai minat sejarah
✓ Sesuai budget
✓ Jarak sesuai
✓ Durasi kunjungan sesuai
```

---

# 15. FR-05 — Contextual Food / UMKM

Kuliner tetap tersedia dalam MVP dengan batasan.

### Bukan

> "Cari semua makanan di Gresik."

### Tetapi

> "Temukan makanan yang cocok untuk perjalanan saya."

Contoh:

```text
Destinasi A
      ↓
   700 meter
      ↓
Kuliner B
Rp20.000–30.000
      ↓
Destinasi C
```

Kuliner menjadi komponen itinerary, bukan marketplace.

---

# 16. FR-06 — Itinerary Generator

Sistem menyusun:

- urutan destinasi,
- waktu,
- durasi kunjungan,
- waktu perjalanan,
- kuliner,
- estimasi biaya.

Contoh:

```text
09.00
Berangkat

10.00
Destinasi A

12.00
Kuliner B

14.00
Destinasi C

16.00
Pulang
```

---

# 17. FR-07 — Budget Estimation

Sistem menghitung:

```text
Transportasi
+ Tiket
+ Makanan
+ Aktivitas
----------------
Total Estimasi
```

Contoh:

> Total: Rp125.000  
> Budget: Rp150.000  
> Sisa: Rp25.000

---

# 18. FR-08 — Map & Route

Map digunakan untuk:

- posisi destinasi,
- urutan itinerary,
- rute,
- jarak.

Teknologi yang direncanakan:

- Leaflet
- OpenStreetMap
- OSRM

---

# 19. FR-09 — Replanning

Pengguna dapat meminta perubahan seperti:

> "Ganti tempat makan."

> "Budget saya tinggal Rp100 ribu."

> "Saya ingin perjalanan lebih santai."

Sistem melakukan partial replanning:

```text
CURRENT ITINERARY
       ↓
USER CHANGE
       ↓
RECOMMENDATION ENGINE
       ↓
PARTIAL REPLAN
       ↓
UPDATED ITINERARY
```

---

# 20. FR-10 — Saved Trip

Pengguna dapat menyimpan itinerary.

Contoh:

```text
Gresik 1 Hari
Rp125.000
3 Destinasi
```

---

# 21. Struktur Menu UI — MVP

```text
GATRA
│
├── Plan
├── Explore
├── My Trip
└── Profile
```

### Plan

Pusat utama aplikasi untuk membuat perjalanan.

### Explore

Destinasi dan kuliner.

### My Trip

Perjalanan yang tersimpan.

### Profile

Akun dan preference.

---

# 22. User Screens

Target MVP: **12 layar utama**

## 01 — Home

```text
GATRA

Mau ke mana hari ini?

[Ceritakan rencana perjalananmu...]

[ Buat Perjalanan ]

Inspirasi:
Sejarah | Kuliner | Alam | Keluarga
```

## 02 — Quick Planner

```text
Mulai dari mana?
[ Surabaya ]

Budget
[ Rp100K ][ Rp150K ][ Rp200K ]

Durasi
[ Setengah Hari ][ 1 Hari ]

Minat
[ Sejarah ][ Kuliner ][ Alam ]

Transportasi
[ Motor ][ Mobil ][ Umum ]

[ Buat Rencana ]
```

## 03 — AI Chat

```text
GATRA AI

"Saya punya budget 150 ribu..."

AI:
"Berapa lama Anda ingin berwisata?"

[ Ketik pesan ]
```

## 04 — Recommendation Result

Menampilkan:

- destination card,
- match score,
- alasan rekomendasi,
- harga,
- jarak,
- estimasi waktu.

## 05 — Itinerary

Menampilkan:

- timeline,
- destinasi,
- kuliner,
- waktu,
- biaya.

## 06 — Map

Menampilkan:

- marker,
- route,
- destination sequence.

## 07 — Explore

Tab:

```text
[Destinasi] [Kuliner]
```

Dengan search dan filter sederhana.

## 08 — Destination Detail

Menampilkan:

- foto,
- deskripsi,
- harga,
- jam buka,
- lokasi,
- kategori,
- tombol tambah ke trip.

## 09 — Food / UMKM Detail

Menampilkan:

- nama,
- kategori,
- kisaran harga,
- lokasi,
- jam buka,
- jarak dari itinerary.

## 10 — My Trip

Menampilkan:

- saved trips,
- tanggal,
- budget,
- jumlah destinasi.

## 11 — Replanning

Pilihan:

```text
Ganti Destinasi
Ganti Kuliner
Kurangi Budget
Tambah Aktivitas
Buat Lebih Santai
Chat dengan GATRA
```

## 12 — Profile

Menampilkan:

- akun,
- minat,
- transportasi,
- preference,
- saved trip.

---

# 23. Admin Scope

Admin tidak perlu kompleks.

## Admin Dashboard

```text
Dashboard

Destinations
Food / UMKM
Categories
Data Verification
```

Admin dapat:

- menambahkan destinasi,
- mengubah informasi,
- mengatur harga,
- mengatur jam buka,
- mengatur koordinat,
- memverifikasi data.

Admin berfungsi menjaga **source of truth** data.

---

# 24. System Architecture

```text
                         USER
                           │
              ┌────────────┴────────────┐
              │                         │
           PLANNER                   AI CHAT
              │                         │
              └────────────┬────────────┘
                           ▼
                    USER PREFERENCE
                           │
                           ▼
                  ┌────────────────┐
                  │ AI ORCHESTRATOR│
                  └───────┬────────┘
                          │
                         QWEN
                          │
                          ▼
                RECOMMENDATION ENGINE
                          │
              ┌───────────┼───────────┐
              ▼           ▼           ▼
        DESTINATIONS     UMKM       POSTGIS
              │           │           │
              └───────────┼───────────┘
                          ▼
                    RANKED RESULTS
                          │
                          ▼
                   ITINERARY ENGINE
                          │
                   ┌──────┴──────┐
                   ▼             ▼
                  MAP           BUDGET
                   │             │
                   └──────┬──────┘
                          ▼
                         USER
```

---

# 25. Technology Stack

## Frontend

- Next.js
- React
- TypeScript
- Tailwind CSS
- shadcn/ui

## Backend

- Next.js Route Handlers / API
- Service Layer
- Recommendation Service
- AI Service

## Database

- PostgreSQL
- PostGIS

## AI

- Qwen
- Ollama

## Maps

- Leaflet
- OpenStreetMap

## Routing

- OSRM

---

# 26. Database Architecture

```text
users
  │
  ├── user_preferences
  │
  └── itineraries
          │
          └── itinerary_items


destinations
  │
  └── destination_categories


umkms
  │
  └── categories


chat_sessions
  │
  └── chat_messages
```

### Destinations

```text
id
name
description
category
latitude
longitude
price
opening_time
closing_time
duration
rating
status
```

### UMKM

```text
id
name
description
category
price_min
price_max
latitude
longitude
opening_time
closing_time
status
```

### Itinerary

```text
id
user_id
title
date
budget
duration
status
```

### Itinerary Items

```text
id
itinerary_id
destination_id
sequence
start_time
end_time
estimated_cost
```

---

# 27. Recommendation Architecture

```text
USER PREFERENCE
      ↓
Hard Filter
      ↓
Budget Filter
      ↓
Distance Filter
      ↓
Opening Hours Filter
      ↓
Interest Scoring
      ↓
Travel Time Scoring
      ↓
Final Ranking
```

Output:

```text
Destination A 94%
Destination B 88%
Destination C 79%
```

---

# 28. Non-Functional Requirements

## Performance

- Halaman utama cepat dibuka.
- Recommendation response harus berada pada waktu yang dapat diterima pengguna.
- Map tidak boleh menghambat tampilan itinerary.

## Reliability

Jika AI gagal:

> Planner dasar tetap dapat digunakan.

GATRA tidak boleh bergantung 100% pada AI.

## Data Accuracy

Informasi berikut harus berasal dari database yang dikelola:

- harga,
- lokasi,
- jam buka,
- fasilitas.

## Accessibility

UI harus:

- mudah dibaca,
- memiliki kontras yang baik,
- memiliki tombol yang cukup besar,
- menggunakan bahasa sederhana,
- tidak menampilkan terlalu banyak informasi sekaligus.

---

# 29. User Flow MVP

```text
HOME
 │
 ├── Quick Planner
 │       │
 │       ▼
 │   Preference
 │       │
 │       ▼
 │ Recommendation
 │       │
 │       ▼
 │   Itinerary
 │       │
 │       ├── Map
 │       ├── Budget
 │       └── Replanning
 │
 └── AI Chat
         │
         ▼
      Preference
         │
         ▼
   Recommendation
```

---

# 30. Development Plan — MVP

## Phase 0 — Foundation

Tujuan:

- desain database,
- design system,
- setup Next.js,
- PostgreSQL,
- PostGIS,
- data destinasi,
- API structure.

Output:

> Sistem dasar siap dikembangkan.

---

## Phase 1 — Explore

Fitur:

- Explore,
- Destination List,
- Destination Detail,
- Food/UMKM Detail,
- Search,
- Filter.

Output:

> User dapat menemukan dan memahami data destinasi.

---

## Phase 2 — Recommendation Engine

Pekerjaan:

- preference model,
- filtering,
- scoring,
- ranking.

Output:

> User memasukkan kebutuhan → sistem memberikan rekomendasi.

---

## Phase 3 — Itinerary

Tambahkan:

- itinerary generator,
- budget estimation,
- timeline,
- route,
- map.

Output:

> Sistem bukan hanya merekomendasikan tempat, tetapi menghasilkan perjalanan.

---

## Phase 4 — AI

Tambahkan:

- Qwen,
- Ollama,
- intent extraction,
- natural language preference,
- conversational planning.

Output:

> User dapat merencanakan perjalanan menggunakan bahasa natural.

---

## Phase 5 — Replanning

Tambahkan:

- change destination,
- change food,
- reduce budget,
- change travel style,
- regenerate partial itinerary.

Output:

> GATRA dapat beradaptasi terhadap perubahan pengguna.

---

## Phase 6 — Testing

Uji:

- Functional Testing
- Recommendation Testing
- AI Testing
- UX Testing
- Accessibility Testing

---

# 31. MVP Acceptance Criteria

GATRA dianggap berhasil apabila pengguna dapat:

### Scenario 1

Mengisi:

> Budget + waktu + minat + transportasi

dan mendapatkan rekomendasi.

### Scenario 2

Menggunakan:

> Bahasa natural

dan AI dapat menghasilkan preference yang benar.

### Scenario 3

Mendapatkan:

> Itinerary lengkap.

### Scenario 4

Melihat:

> Rute pada map.

### Scenario 5

Mengatakan:

> "Saya ingin mengganti tempat makan."

dan itinerary diperbarui.

---

# 32. Future Development Roadmap

Pengembangan dilakukan setelah core MVP tervalidasi.

## Phase 7 — Food Discovery

Tambahan:

- food search,
- kategori,
- price filter,
- location filter,
- personalized food recommendation.

Kuliner tetap terhubung dengan itinerary.

---

## Phase 8 — Accommodation

Tambahan:

- hotel search,
- hotel recommendation,
- harga,
- fasilitas,
- lokasi,
- jarak dari itinerary.

Tujuannya bukan sekadar daftar hotel, tetapi:

> **Hotel yang paling cocok dengan itinerary pengguna.**

---

## Phase 9 — Transportation

Tambahan:

- public transport,
- private transport,
- rental,
- transport recommendation,
- estimated cost,
- travel time.

Kemudian dapat dikembangkan menjadi integrasi dengan penyedia layanan eksternal.

---

## Phase 10 — Booking & Transaction

Jika ekosistem sudah siap:

```text
Recommendation
     ↓
Selection
     ↓
Booking
     ↓
Payment
     ↓
Confirmation
```

Baru pada tahap ini:

- payment gateway,
- booking,
- invoice,
- transaction history

menjadi relevan.

---

## Phase 11 — Machine Learning

Setelah terdapat data interaksi yang memadai:

```text
Search
Click
Save
Add to Trip
Remove
Replan
Complete Trip
Rating
```

Data tersebut dapat digunakan untuk:

> **Personalized Recommendation Model**

Tahap pengembangan:

```text
Rule / Multi-Criteria Recommendation
              ↓
AI-assisted Recommendation
              ↓
Machine Learning Personalization
```

ML tidak dipaksakan pada MVP karena membutuhkan data interaksi yang cukup.

---

## Phase 12 — Smart Tourism Ecosystem

Jangka panjang GATRA dapat menghubungkan:

```text
              GATRA
                │
     ┌──────────┼──────────┐
     ▼          ▼          ▼
 Destinasi    UMKM       Hotel
     │          │          │
     └──────────┼──────────┘
                ▼
           Transportasi
                │
                ▼
             Booking
                │
                ▼
             Payment
```

Seluruh ekspansi tetap menggunakan:

> **Personalized Recommendation + Itinerary**

sebagai inti produk.

---

# 33. Roadmap Keseluruhan

| Tahap | Fokus | Status |
|---|---|---|
| Phase 0 | Foundation | MVP |
| Phase 1 | Explore & Destination | MVP |
| Phase 2 | Recommendation Engine | MVP |
| Phase 3 | Itinerary + Map + Budget | MVP |
| Phase 4 | AI Travel Assistant | MVP |
| Phase 5 | Replanning | MVP |
| Phase 6 | Testing | MVP |
| Phase 7 | Food Discovery | Future |
| Phase 8 | Hotel Recommendation | Future |
| Phase 9 | Transport Recommendation | Future |
| Phase 10 | Booking & Payment | Future |
| Phase 11 | Machine Learning | Future |
| Phase 12 | Smart Tourism Ecosystem | Long Term |

---

# 34. Potensi Pengembangan

## 34.1 Skalabilitas Fitur

Arsitektur modular memungkinkan penambahan:

- food,
- hotel,
- transport,
- booking,
- payment

tanpa mengubah core recommendation system.

## 34.2 Skalabilitas Wilayah

Awalnya:

> Gresik

Kemudian dapat diperluas:

> Gresik → Jawa Timur → Indonesia

Data wisata menjadi semakin luas, sementara sistem personalisasi tetap dapat dipertahankan.

## 34.3 Pengembangan Data

Data dapat diperbarui melalui:

- admin,
- pengelola destinasi,
- mitra,
- integrasi data.

Semakin berkualitas data:

> semakin relevan rekomendasi.

## 34.4 Pengembangan AI

AI tidak menjadi satu-satunya sumber keputusan.

Arsitektur:

> **Structured Data → Recommendation Engine → AI Explanation**

membuat sistem lebih mudah dikontrol dan dikembangkan.

## 34.5 Pengembangan Machine Learning

Ketika interaksi pengguna bertambah:

> lebih banyak data → model lebih baik → rekomendasi lebih personal.

Pengembangan ML dilakukan setelah tersedia data dan mekanisme pengelolaan data yang memadai.

## 34.6 Pengembangan Ekonomi Lokal

Pada fase lanjutan, GATRA dapat memberikan exposure kepada:

- UMKM,
- kuliner lokal,
- penginapan,
- transportasi lokal,
- aktivitas wisata.

Tetap dengan prinsip:

> **relevansi terhadap perjalanan pengguna**, bukan sekadar menampilkan sebanyak mungkin bisnis.

---

# 35. Keberlanjutan Inovasi

## 35.1 Teknologi

Sistem modular memungkinkan fitur baru ditambahkan tanpa mengubah fondasi utama.

## 35.2 Data

Informasi destinasi dan layanan dapat terus diperbarui sehingga kualitas rekomendasi dapat dipertahankan.

## 35.3 AI

AI digunakan sebagai lapisan pemahaman dan interaksi, sedangkan fakta berasal dari data terstruktur.

## 35.4 Ekosistem

GATRA dapat berkembang dengan melibatkan:

- pengelola destinasi,
- pelaku UMKM,
- penyedia akomodasi,
- penyedia transportasi,
- mitra layanan pariwisata.

## 35.5 Skalabilitas Wilayah

Model sistem dapat diterapkan pada wilayah lain setelah model data dan recommendation engine tervalidasi di Gresik.

---

# 36. Sustainable Product Loop

```text
                 USER
                  │
                  ▼
              PLANNING
                  │
                  ▼
          RECOMMENDATION
                  │
                  ▼
              TRAVEL
                  │
                  ▼
             INTERACTION
                  │
                  ▼
                 DATA
                  │
                  ▼
       BETTER PERSONALIZATION
                  │
                  └───────────► USER
```

---

# 37. Prinsip Pengembangan

GATRA menggunakan:

> **Build Small → Validate → Expand**

Bukan:

> **Build Everything → Hope Users Need It**

Tahapan:

```text
MVP
 ↓
Validasi masalah
 ↓
Validasi recommendation
 ↓
Validasi AI
 ↓
Validasi itinerary
 ↓
Tambah Food
 ↓
Tambah Hotel
 ↓
Tambah Transport
 ↓
Tambah Booking
 ↓
Tambah ML
```

---

# 38. Batasan Masalah Final

> GATRA pada tahap MVP difokuskan pada membantu wisatawan merencanakan perjalanan wisata di Kabupaten Gresik berdasarkan preferensi, waktu, budget, lokasi, dan moda transportasi. Sistem menyediakan rekomendasi destinasi, rekomendasi kuliner yang relevan dengan itinerary, penyusunan itinerary, estimasi anggaran, visualisasi rute, dan kemampuan melakukan perubahan itinerary.
>
> GATRA pada tahap MVP tidak mencakup transaksi, payment gateway, booking hotel, booking transportasi, ticketing, marketplace, pengelolaan event, maupun sistem Machine Learning khusus. Fitur-fitur tersebut ditempatkan sebagai pengembangan lanjutan setelah core travel planning tervalidasi.

---

# 39. Kesimpulan Produk

### Core GATRA

```text
              GATRA
                │
        ┌───────┴───────┐
        ▼               ▼
      AI CHAT         PLANNER
        │               │
        └───────┬───────┘
                ▼
       RECOMMENDATION ENGINE
                │
                ▼
            ITINERARY
          ┌─────┴─────┐
          ▼           ▼
        BUDGET        MAP
          │           │
          └─────┬─────┘
                ▼
            REPLANNING
```

### MVP

> **Plan → Recommend → Itinerary → Map → Replan**

### Development

> **Food → Hotel → Transport → Booking → Payment → ML**

### Visi Jangka Panjang

> **Personalized Smart Tourism Platform**

---

# 40. One-Liner Proposal

> **GATRA adalah aplikasi AI-powered personal travel planner yang membantu wisatawan menentukan destinasi dan menyusun itinerary berdasarkan budget, waktu, minat, lokasi, dan transportasi. Berbeda dengan portal pariwisata yang berfokus pada penyediaan informasi dan layanan, GATRA berfokus pada proses pengambilan keputusan perjalanan. Pengembangan selanjutnya dapat memperluas sistem ke rekomendasi kuliner, akomodasi, transportasi, booking, hingga personalisasi berbasis Machine Learning tanpa mengubah inti sistem sebagai mesin perencanaan perjalanan personal.**
