# PRD 02 — AI Model & UI/UX Specification GATRA

> Dokumen ini merupakan pasangan dari `README.md` / PRD Sistem GATRA.
>
> PRD Sistem menjelaskan **apa yang dibangun dan batasan sistem**.
> Dokumen ini menjelaskan **bagaimana model AI bekerja dan bagaimana sistem diterjemahkan menjadi tampilan UI/UX**.

---

# 1. Tujuan Dokumen

Dokumen ini menjadi acuan untuk:

- perancangan model AI,
- arsitektur AI,
- alur interaksi AI,
- recommendation engine,
- struktur halaman,
- komponen UI,
- user flow,
- prinsip UX,
- dan implementasi desain frontend.

Dokumen ini **tidak mengubah scope MVP** yang telah ditetapkan pada PRD Sistem.

---

# 2. Product Experience

GATRA harus terasa seperti:

> **asisten perjalanan personal yang membantu pengguna mengambil keputusan**, bukan sekadar chatbot dan bukan sekadar katalog tempat wisata.

Pengalaman utama:

```text
Ceritakan kebutuhan
       ↓
GATRA memahami
       ↓
Preference dikonfirmasi
       ↓
Destinasi direkomendasikan
       ↓
Itinerary dibuat
       ↓
Map + Budget
       ↓
User dapat mengubah rencana
```

---

# 3. AI Product Architecture

## 3.1 High-Level Architecture

```text
                         USER
                           │
                           ▼
                  ┌─────────────────┐
                  │   GATRA UI      │
                  │ Planner / Chat  │
                  └────────┬────────┘
                           │
                           ▼
                  ┌─────────────────┐
                  │   AI Gateway    │
                  │ / Orchestrator  │
                  └────────┬────────┘
                           │
             ┌─────────────┼──────────────┐
             │             │              │
             ▼             ▼              ▼
      Intent Parser   Preference     Conversation
                       Extractor        Context
             └─────────────┬──────────────┘
                           ▼
                  Structured Preference
                           │
                           ▼
                ┌─────────────────────┐
                │ Recommendation      │
                │ Engine              │
                └──────────┬──────────┘
                           │
              ┌────────────┼────────────┐
              ▼            ▼            ▼
        PostgreSQL      PostGIS       OSRM
        Destinations     Location      Routing
        & UMKM            Data
              │            │            │
              └────────────┼────────────┘
                           ▼
                     Ranked Results
                           │
                           ▼
                 ┌─────────────────┐
                 │ Itinerary       │
                 │ Generator       │
                 └────────┬────────┘
                          │
                 ┌────────┴────────┐
                 ▼                 ▼
              Budget              Map
            Calculator          Routing
                 │                 │
                 └────────┬────────┘
                          ▼
                    Final Itinerary
                          │
                          ▼
                    AI Explanation
                          │
                          ▼
                         USER
```

---

# 4. AI Model Specification

## 4.1 Model Utama

### LLM

**Qwen**

Runtime:

**Ollama**

Peran:

- memahami bahasa natural,
- intent detection,
- preference extraction,
- conversational interaction,
- menghasilkan structured output,
- menjelaskan rekomendasi,
- membantu replanning.

LLM tidak menjadi sumber utama data faktual destinasi.

---

# 5. AI Responsibility Boundary

## AI bertanggung jawab terhadap:

```text
Natural Language
       ↓
Intent
       ↓
Preference
       ↓
Conversation
       ↓
Explanation
```

## System Engine bertanggung jawab terhadap:

```text
Database
   ↓
Filtering
   ↓
Scoring
   ↓
Ranking
   ↓
Route
   ↓
Budget
   ↓
Itinerary Constraint
```

Prinsip:

> **AI memahami, sistem menghitung.**

---

# 6. AI Pipeline

## Step 1 — User Input

Contoh:

> "Saya punya waktu satu hari, budget 150 ribu, suka sejarah dan kuliner."

---

## Step 2 — Intent Extraction

AI mendeteksi:

```json
{
  "intent": "create_trip"
}
```

---

## Step 3 — Preference Extraction

AI menghasilkan:

```json
{
  "destination": "Gresik",
  "duration": "1_day",
  "budget": 150000,
  "interests": [
    "history",
    "culinary"
  ],
  "transport": null,
  "travel_style": null
}
```

---

## Step 4 — Missing Preference

Jika parameter penting belum tersedia, AI bertanya.

Contoh:

> "Anda menggunakan kendaraan pribadi atau transportasi umum?"

UI menyediakan pilihan:

```text
[ Motor ]
[ Mobil ]
[ Transportasi Umum ]
```

---

## Step 5 — Preference Confirmation

Sistem menampilkan:

```text
Gresik
1 Hari
Rp150.000
Sejarah
Kuliner
Motor
```

User memilih:

```text
[ ✓ Sudah Sesuai ]
[ ✎ Ubah ]
```

---

# 7. Recommendation Engine

Recommendation Engine tidak menggunakan LLM untuk menentukan ranking secara langsung.

## Input

```text
Budget
Duration
Interest
Location
Transport
Group Size
Travel Style
```

## Processing

```text
Hard Filter
    ↓
Constraint Filter
    ↓
Scoring
    ↓
Ranking
```

---

# 8. Recommendation Scoring

Bobot awal MVP:

| Faktor | Bobot |
|---|---:|
| Interest Match | 30% |
| Budget | 25% |
| Distance | 20% |
| Travel Time | 15% |
| Rating | 10% |

Formula konseptual:

```text
Final Score =
(Interest × 0.30)
+ (Budget × 0.25)
+ (Distance × 0.20)
+ (Travel Time × 0.15)
+ (Rating × 0.10)
```

Bobot dapat dikalibrasi setelah usability testing dan evaluasi rekomendasi.

---

# 9. AI Explanation

Recommendation Engine menghasilkan:

```json
{
  "destination": "Museum A",
  "score": 94,
  "reasons": [
    "interest_match",
    "within_budget",
    "nearby"
  ]
}
```

AI mengubahnya menjadi:

> "Museum A paling cocok karena sesuai dengan minat sejarah Anda, masih sesuai budget, dan lokasinya cukup dekat dengan tujuan berikutnya."

UI menampilkan:

```text
94% Cocok

✓ Sesuai minat sejarah
✓ Sesuai budget
✓ Dekat dengan tujuan berikutnya
```

---

# 10. Itinerary Engine

Itinerary tidak dibuat hanya berdasarkan output LLM.

Engine mempertimbangkan:

```text
Opening Hours
Visit Duration
Travel Time
Distance
Budget
Sequence
Available Time
```

Contoh:

```text
09:00
Berangkat
    ↓
10:00
Destinasi A
    ↓
12:00
Kuliner B
    ↓
14:00
Destinasi C
    ↓
16:00
Pulang
```

---

# 11. Replanning Model

User dapat memberikan perubahan.

Contoh:

> "Budget saya tinggal Rp100 ribu."

Alur:

```text
User Change
    ↓
AI Intent
    ↓
Updated Preference
    ↓
Recommendation Engine
    ↓
Partial Replanning
    ↓
Updated Itinerary
```

Jenis perubahan MVP:

- ganti destinasi,
- ganti kuliner,
- kurangi budget,
- tambah aktivitas,
- buat perjalanan lebih santai.

---

# 12. AI Fallback

AI tidak boleh menjadi single point of failure.

Jika Qwen/Ollama tidak tersedia:

```text
AI Planner
    X
    ↓
Quick Planner
    ↓
Recommendation Engine
    ↓
Itinerary
```

Pengguna tetap dapat menggunakan:

- budget selection,
- duration,
- interest,
- transport,
- recommendation,
- itinerary.

---

# 13. Machine Learning Roadmap

Machine Learning **bukan requirement MVP**.

Urutan pengembangan:

```text
Rule-Based Recommendation
          ↓
LLM-assisted Planning
          ↓
User Interaction Data
          ↓
Data Collection
          ↓
ML Experiment
          ↓
Personalized Ranking
```

Data yang dapat digunakan di masa depan:

```text
Search
Click
View Detail
Save
Add to Trip
Remove
Replan
Complete Trip
Rating
```

ML baru diterapkan setelah data perilaku pengguna memadai.

---

# 14. RAG Roadmap

RAG tidak diperlukan untuk database destinasi utama pada MVP.

Structured data tetap digunakan untuk:

- harga,
- koordinat,
- jam buka,
- kategori,
- durasi,
- fasilitas.

RAG dapat ditambahkan untuk knowledge tidak terstruktur:

```text
Artikel
Dokumen Sejarah
Panduan Wisata
Konten Editorial
Event Information
```

Arsitektur masa depan:

```text
                  QWEN
                   │
          ┌────────┴────────┐
          ▼                 ▼
 Structured Data           RAG
          │                 │
          ▼                 ▼
 Recommendation       Knowledge Retrieval
          │                 │
          └────────┬────────┘
                   ▼
               AI Response
```

---

# 15. UX Principles

## 15.1 AI Tidak Mengambil Alih

AI memberikan rekomendasi.

User tetap memutuskan.

---

## 15.2 Explainable Recommendation

Jangan hanya:

> "94% cocok"

Tampilkan:

> "94% cocok karena sesuai minat dan budget."

---

## 15.3 Progressive Disclosure

Jangan menampilkan seluruh informasi sekaligus.

Urutan:

```text
Recommendation
      ↓
Why Recommended
      ↓
Detail
      ↓
Map
```

---

## 15.4 Conversational + Visual

Jangan hanya chat.

Gunakan:

- chips,
- cards,
- buttons,
- timeline,
- map,
- progress indicator.

---

## 15.5 Accessible

Target:

- teks mudah dibaca,
- kontras jelas,
- button besar,
- bahasa sederhana,
- tidak terlalu padat,
- navigasi konsisten.

---

# 16. Information Architecture

```text
GATRA
│
├── Home
│
├── Plan
│   ├── Quick Planner
│   ├── AI Planner
│   ├── Preference Summary
│   ├── Recommendation
│   ├── Itinerary
│   ├── Map
│   └── Replanning
│
├── Explore
│   ├── Destinations
│   ├── Destination Detail
│   ├── Kuliner / UMKM
│   └── Food Detail
│
├── My Trip
│   ├── Saved Trip
│   └── Trip Detail
│
└── Profile
    ├── Preference
    └── Account
```

---

# 17. Screen Inventory

Target MVP:

**12 layar utama**

| No | Screen | Tujuan |
|---:|---|---|
| 01 | Home | Entry point |
| 02 | Quick Planner | Input kebutuhan |
| 03 | AI Planner | Percakapan |
| 04 | Recommendation | Hasil rekomendasi |
| 05 | Itinerary | Rencana perjalanan |
| 06 | Map | Rute perjalanan |
| 07 | Explore | Discovery |
| 08 | Destination Detail | Detail destinasi |
| 09 | Food Detail | Detail kuliner |
| 10 | My Trip | Trip tersimpan |
| 11 | Replanning | Mengubah itinerary |
| 12 | Profile | Preferensi & akun |

---

# 18. Screen 01 — Home

## Tujuan

Memberikan entry point paling sederhana.

## Struktur

```text
┌──────────────────────────────────────────────┐
│ GATRA                    Explore  My Trip    │
├──────────────────────────────────────────────┤
│                                              │
│        Mau jalan-jalan ke mana?              │
│                                              │
│  ┌────────────────────────────────────────┐  │
│  │ Ceritakan rencana perjalananmu...      │  │
│  │                                        │  │
│  │ "Saya ingin wisata sejarah..."         │  │
│  └────────────────────────────────────────┘  │
│                                              │
│           [ ✦ Buat Perjalanan ]              │
│                                              │
│  Mulai cepat                                 │
│                                              │
│ [Sejarah] [Kuliner] [Alam] [Keluarga]       │
│                                              │
└──────────────────────────────────────────────┘
```

## Komponen

- Navbar
- AI prompt box
- CTA
- Interest chips
- Featured destination

---

# 19. Screen 02 — Quick Planner

```text
┌──────────────────────────────────────────────┐
│ ← Buat Perjalanan                            │
├──────────────────────────────────────────────┤
│                                              │
│ Dari mana Anda berangkat?                    │
│ [ Surabaya                              ]    │
│                                              │
│ Berapa budget Anda?                          │
│ [ Rp100K ] [ Rp150K ] [ Rp200K ]            │
│                                              │
│ Durasi                                       │
│ [ Setengah Hari ] [ 1 Hari ]                │
│                                              │
│ Minat                                        │
│ [ Sejarah ] [ Kuliner ] [ Alam ]             │
│                                              │
│ Transportasi                                 │
│ [ Motor ] [ Mobil ] [ Umum ]                │
│                                              │
│             [ Buat Rencana ]                 │
└──────────────────────────────────────────────┘
```

---

# 20. Screen 03 — AI Planner

## Tujuan

Memungkinkan user merencanakan dengan bahasa natural.

```text
┌──────────────────────────────────────────────┐
│ ← GATRA AI                         ● Online   │
├──────────────────────────────────────────────┤
│                                              │
│ GATRA                                        │
│ "Saya bantu buat perjalanan yang sesuai      │
│ dengan kebutuhan Anda."                      │
│                                              │
│                    ┌───────────────────────┐ │
│                    │ Budget saya 150 ribu │ │
│                    │ dan suka sejarah.    │ │
│                    └───────────────────────┘ │
│                                              │
│ Anda ingin perjalanan berapa lama?           │
│                                              │
│ [Setengah Hari] [1 Hari] [2 Hari]            │
│                                              │
│ ┌──────────────────────────────────────────┐ │
│ │ Ketik pesan...                      🎤   │ │
│ └──────────────────────────────────────────┘ │
└──────────────────────────────────────────────┘
```

---

# 21. Screen 04 — Preference Summary

## Tujuan

Memastikan pemahaman AI benar.

```text
┌──────────────────────────────────────────────┐
│ Rencana Anda                                 │
├──────────────────────────────────────────────┤
│ 📍 Gresik                                    │
│ 💰 Rp150.000                                 │
│ 🕐 1 Hari                                    │
│ 🏛 Sejarah                                   │
│ 🍜 Kuliner                                   │
│ 🛵 Motor                                     │
│                                              │
│ Gaya                                         │
│ [ Santai ]                                   │
│                                              │
│ [ ✓ Buat Rencana ]     [ ✎ Ubah ]            │
└──────────────────────────────────────────────┘
```

---

# 22. Screen 05 — Recommendation

## Tujuan

Menampilkan hasil personalisasi.

```text
┌──────────────────────────────────────────────┐
│ Rekomendasi Untuk Anda                       │
├──────────────────────────────────────────────┤
│                                              │
│ ┌──────────────────────────────────────────┐ │
│ │ FOTO                                     │ │
│ │                                          │ │
│ │ Museum A                    94% cocok     │ │
│ │ 🏛 Sejarah • Rp10.000                    │ │
│ │ 📍 5.2 km                                │ │
│ │                                          │ │
│ │ ✓ Sesuai minat                           │ │
│ │ ✓ Sesuai budget                          │ │
│ │ ✓ Rute efisien                           │ │
│ │                                          │ │
│ │ [ Tambahkan ke Trip ]                    │ │
│ └──────────────────────────────────────────┘ │
│                                              │
│ [ Buat Itinerary ]                           │
└──────────────────────────────────────────────┘
```

---

# 23. Screen 06 — Itinerary

```text
┌──────────────────────────────────────────────┐
│ ← Gresik 1 Hari                              │
├──────────────────────────────────────────────┤
│ Rp125.000 • 3 Destinasi                     │
│                                              │
│ 09:00  ● Berangkat                           │
│          │                                   │
│ 10:00  ● Museum A                            │
│          🏛 Sejarah                           │
│          Rp10.000                            │
│          │                                   │
│ 12:00  ● Kuliner B                           │
│          🍜 Rp25.000                         │
│          │                                   │
│ 14:00  ● Destinasi C                         │
│                                              │
│ [ 🗺 Lihat Map ] [ ✦ Ubah Rencana ]          │
└──────────────────────────────────────────────┘
```

---

# 24. Screen 07 — Map

```text
┌──────────────────────────────────────────────┐
│ ← Peta Perjalanan                            │
├──────────────────────────────────────────────┤
│                                              │
│                    MAP                       │
│                                              │
│             ● A                              │
│              ╲                               │
│               ╲                              │
│                ● B                           │
│                 ╲                            │
│                  ● C                         │
│                                              │
│ ┌──────────────────────────────────────────┐ │
│ │ ✦ GATRA                                  │ │
│ │ Rute disusun berdasarkan urutan yang     │ │
│ │ paling sesuai dengan itinerary Anda.     │ │
│ └──────────────────────────────────────────┘ │
└──────────────────────────────────────────────┘
```

---

# 25. Screen 08 — Explore

```text
┌──────────────────────────────────────────────┐
│ Explore                                      │
├──────────────────────────────────────────────┤
│ [ 🔍 Cari destinasi... ]                     │
│                                              │
│ [Destinasi] [Kuliner]                        │
│                                              │
│ Filter                                       │
│ [ Sejarah ] [ Alam ] [ Keluarga ]            │
│                                              │
│ ┌──────────────────────────────────────────┐ │
│ │ FOTO                                     │ │
│ │ Museum A                                 │ │
│ │ 🏛 Sejarah                               │ │
│ │ Rp10.000 • 4.7 km                        │ │
│ └──────────────────────────────────────────┘ │
│                                              │
│ ┌──────────────────────────────────────────┐ │
│ │ FOTO                                     │ │
│ │ Destinasi B                              │ │
│ └──────────────────────────────────────────┘ │
└──────────────────────────────────────────────┘
```

---

# 26. Screen 09 — Destination Detail

```text
┌──────────────────────────────────────────────┐
│ ← Detail Destinasi                           │
├──────────────────────────────────────────────┤
│                                              │
│              [ FOTO ]                        │
│                                              │
│ Museum A                                     │
│ 🏛 Sejarah                                   │
│                                              │
│ ★ 4.7                                        │
│                                              │
│ Rp10.000                                     │
│ 09:00 – 17:00                                │
│                                              │
│ Museum dengan koleksi sejarah lokal...       │
│                                              │
│ 📍 Lokasi                                    │
│                                              │
│ [ Tambahkan ke Trip ]                        │
└──────────────────────────────────────────────┘
```

---

# 27. Screen 10 — Food / UMKM Detail

```text
┌──────────────────────────────────────────────┐
│ ← Kuliner                                    │
├──────────────────────────────────────────────┤
│                                              │
│              [ FOTO ]                        │
│                                              │
│ Kuliner B                                    │
│ 🍜 Lokal                                     │
│                                              │
│ Rp20.000 – Rp30.000                          │
│ 10:00 – 20:00                                │
│                                              │
│ 📍 700 meter dari Museum A                   │
│                                              │
│ [ Tambahkan ke Trip ]                        │
└──────────────────────────────────────────────┘
```

---

# 28. Screen 11 — Replanning

```text
┌──────────────────────────────────────────────┐
│ ✦ Sesuaikan Perjalanan                       │
├──────────────────────────────────────────────┤
│ Apa yang ingin Anda ubah?                    │
│                                              │
│ [ 💰 Kurangi Budget ]                        │
│ [ 🏛 Ganti Destinasi ]                       │
│ [ 🍜 Ganti Kuliner ]                         │
│ [ 🕐 Buat Lebih Santai ]                     │
│                                              │
│ Atau katakan langsung:                       │
│                                              │
│ "Saya ingin lebih banyak kuliner."           │
│                                              │
│ [ Kirim ]                                    │
└──────────────────────────────────────────────┘
```

---

# 29. Screen 12 — Replanning Result

```text
┌──────────────────────────────────────────────┐
│ Perubahan Rencana                            │
├──────────────────────────────────────────────┤
│                                              │
│ ✦ Saya menemukan alternatif yang lebih      │
│   sesuai dengan budget Anda.                 │
│                                              │
│ SEBELUMNYA                                   │
│ Kuliner A — Rp45.000                         │
│                                              │
│ ↓ DIGANTI                                    │
│                                              │
│ Kuliner B — Rp25.000                         │
│                                              │
│ Total sebelumnya    Rp145.000                │
│ Total sekarang      Rp125.000                │
│ Budget tersisa      Rp25.000                 │
│                                              │
│ [ Terapkan Perubahan ]                       │
└──────────────────────────────────────────────┘
```

---

# 30. Screen 13 — My Trip

```text
┌──────────────────────────────────────────────┐
│ My Trip                                      │
├──────────────────────────────────────────────┤
│                                              │
│ Perjalanan Tersimpan                         │
│                                              │
│ ┌──────────────────────────────────────────┐ │
│ │ Gresik 1 Hari                            │ │
│ │ Rp125.000 • 3 Destinasi                  │ │
│ │ 23 Agustus 2026                          │ │
│ │ [ Buka ]                                 │ │
│ └──────────────────────────────────────────┘ │
│                                              │
└──────────────────────────────────────────────┘
```

---

# 31. Screen 14 — Profile

```text
┌──────────────────────────────────────────────┐
│ Profile                                      │
├──────────────────────────────────────────────┤
│                                              │
│ 👤 Pengguna                                  │
│                                              │
│ Preferensi                                   │
│                                              │
│ Minat                                        │
│ [ Sejarah ] [ Kuliner ]                      │
│                                              │
│ Transportasi                                 │
│ Motor                                        │
│                                              │
│ Gaya perjalanan                              │
│ Santai                                       │
│                                              │
│ [ Edit Preference ]                          │
└──────────────────────────────────────────────┘
```

---

# 32. AI Interaction Pattern

AI menggunakan empat pola utama.

## Pattern A — Ask

```text
AI bertanya
    ↓
Quick Choice
```

## Pattern B — Recommend

```text
AI menjelaskan
    ↓
Recommendation Card
```

## Pattern C — Confirm

```text
AI memahami
    ↓
Preference Summary
    ↓
User Confirm
```

## Pattern D — Replan

```text
User Request
    ↓
AI Change
    ↓
Diff Result
    ↓
Apply
```

---

# 33. Navigation

Desktop:

```text
┌──────────────────────────────────────────────────────────┐
│ GATRA        Plan       Explore       My Trip     Profile│
└──────────────────────────────────────────────────────────┘
```

Mobile:

```text
┌──────────────────────────┐
│ GATRA                    │
├──────────────────────────┤
│                          │
│       CONTENT            │
│                          │
├──────────────────────────┤
│ Home Plan Explore Trip   │
└──────────────────────────┘
```

---

# 34. Design System

## Typography

Prioritas:

1. readability,
2. hierarchy,
3. accessibility.

Rekomendasi:

- Heading: 28–40px
- Section heading: 20–24px
- Body: 16px
- Caption: minimal 14px

---

# 35. Components

Komponen utama:

```text
Button
Card
Chip
Badge
Input
Search
Dropdown
Slider
Timeline
Map
Modal
Toast
AI Message
Recommendation Card
Destination Card
Budget Summary
Preference Summary
```

---

# 36. Recommendation Card

Setiap recommendation card minimal mempunyai:

```text
Image
Name
Category
Match Score
Price
Distance
Why Recommended
CTA
```

Contoh:

```text
┌─────────────────────────────┐
│          IMAGE              │
├─────────────────────────────┤
│ Museum A                    │
│ 94% cocok                   │
│                             │
│ 🏛 Sejarah                  │
│ Rp10.000                    │
│                             │
│ ✓ Sesuai minat              │
│ ✓ Sesuai budget             │
│                             │
│ [ Tambahkan ]               │
└─────────────────────────────┘
```

---

# 37. AI Message Component

AI message harus dibedakan secara visual dari system data.

```text
✦ GATRA

Saya menemukan 3 destinasi yang
paling sesuai dengan rencana Anda.
```

Kemudian data disajikan dalam card.

Jangan membuat:

```text
✦ GATRA

Museum A memiliki...
Museum B memiliki...
Museum C memiliki...
```

dalam paragraf panjang.

---

# 38. Loading State

Saat AI memproses:

```text
✦ GATRA sedang menyusun perjalanan...

✓ Memahami preferensi
✓ Mencari destinasi
● Menyusun itinerary
○ Menghitung rute
```

Gunakan progress yang memberi konteks.

---

# 39. Empty State

Jika tidak ada rekomendasi:

```text
Belum menemukan perjalanan yang cocok.

Coba:
• tambah budget
• tambah waktu
• pilih minat lain

[ Sesuaikan Rencana ]
```

---

# 40. Error State

Jika AI gagal:

```text
GATRA sedang mengalami kendala.

Anda tetap dapat membuat perjalanan
menggunakan Planner biasa.

[ Gunakan Quick Planner ]
```

---

# 41. Accessibility

UI harus mendukung pengguna dengan tingkat kemampuan digital yang berbeda.

Prinsip:

- tombol jelas,
- label tidak ambigu,
- icon memiliki text,
- warna bukan satu-satunya penanda,
- font mudah dibaca,
- form bertahap,
- error message mudah dipahami.

---

# 42. Responsive Design

## Desktop

Layout:

```text
Sidebar / Navbar
       +
Main Content
       +
Optional Map / Assistant
```

## Tablet

```text
Navbar
   ↓
Main Content
```

## Mobile

```text
Header
   ↓
Content
   ↓
Bottom Navigation
```

---

# 43. Visual Direction

GATRA harus mempunyai karakter:

### Modern

Tidak terasa seperti portal pemerintahan lama.

### Friendly

Tidak terasa seperti software enterprise.

### Trustworthy

Informasi faktual harus jelas sumber dan statusnya.

### Local

Memiliki karakter Gresik melalui:

- imagery lokal,
- konten destinasi lokal,
- kuliner lokal,
- bahasa yang familiar.

### Simple

Satu layar memiliki satu tujuan utama.

---

# 44. Visual Hierarchy

Prioritas visual:

```text
1. What should I do?
2. What is recommended?
3. Why is it recommended?
4. How much does it cost?
5. Where is it?
6. What can I change?
```

Bukan:

```text
Foto besar
↓
Deskripsi panjang
↓
Data
↓
Button
```

---

# 45. Main User Journey

```text
HOME
  │
  ▼
AI / QUICK PLANNER
  │
  ▼
PREFERENCE
  │
  ▼
RECOMMENDATION
  │
  ▼
ITINERARY
  │
  ├──────────► MAP
  │
  ├──────────► BUDGET
  │
  ▼
REPLAN
  │
  ▼
UPDATED ITINERARY
  │
  ▼
SAVE TRIP
```

---

# 46. AI UX Success Criteria

AI dianggap berhasil apabila:

### Understanding

AI dapat mengambil parameter penting dari bahasa natural.

### Relevance

Rekomendasi sesuai preference.

### Explainability

User memahami alasan rekomendasi.

### Control

User dapat mengubah hasil.

### Recovery

User tetap dapat menggunakan aplikasi jika AI gagal.

---

# 47. MVP Design Scope

Yang wajib dibuat:

```text
✓ Home
✓ Quick Planner
✓ AI Planner
✓ Preference Summary
✓ Recommendation
✓ Itinerary
✓ Map
✓ Destination Detail
✓ Food Detail
✓ Replanning
✓ My Trip
✓ Profile
```

Yang belum dibuat:

```text
✗ Hotel Booking
✗ Transport Booking
✗ Payment
✗ Marketplace
✗ Ticketing
✗ Event Management
✗ ML Personalization
```

---

# 48. Future UI Expansion

Ketika scope dikembangkan:

```text
MVP
 │
 ├── Food Discovery
 │
 ├── Hotel
 │
 ├── Transport
 │
 ├── Booking
 │
 └── Payment
```

UI tetap menggunakan core pattern:

```text
Search
   ↓
Recommendation
   ↓
Selection
   ↓
Itinerary
   ↓
Booking
```

---

# 49. Future AI Architecture

Tahap lanjutan:

```text
                    USER
                      │
                      ▼
                  GATRA AI
                      │
          ┌───────────┼───────────┐
          ▼           ▼           ▼
      LLM/Qwen       RAG         ML
          │           │           │
          └───────────┼───────────┘
                      ▼
            Recommendation Layer
                      │
       ┌──────────────┼──────────────┐
       ▼              ▼              ▼
   Destination       Food          Hotel
       │              │              │
       └──────────────┼──────────────┘
                      ▼
                 Transport
                      │
                      ▼
                  Booking
```

---

# 50. Final Design Principle

GATRA bukan:

> **"Chatbot wisata."**

GATRA adalah:

> **"Travel planning system dengan AI sebagai interaction layer."**

Arsitektur utamanya:

```text
USER
 ↓
AI
 ↓
STRUCTURED PREFERENCE
 ↓
RECOMMENDATION ENGINE
 ↓
ITINERARY ENGINE
 ↓
MAP + BUDGET
 ↓
AI EXPLANATION
 ↓
USER
```

Dengan pemisahan ini, sistem dapat dikembangkan bertahap tanpa membuat MVP terlalu besar.

---

# 51. Hubungan dengan PRD Sistem

Dokumen:

### `README.md`

Menjawab:

> **Apa sistem GATRA?**

Sedangkan dokumen ini:

### `PRD-02-AI-MODEL-UI.md`

Menjawab:

> **Bagaimana AI bekerja dan bagaimana GATRA ditampilkan kepada pengguna?**

Keduanya menjadi satu paket dokumentasi:

```text
PRD SYSTEM
README.md
     │
     ├── Scope
     ├── Requirement
     ├── Architecture
     └── Roadmap
             │
             ▼
PRD MODEL & UI
PRD-02-AI-MODEL-UI.md
             │
             ├── AI Architecture
             ├── AI Model
             ├── Recommendation
             ├── AI Flow
             ├── UX Flow
             ├── Screen
             └── UI Components
```
