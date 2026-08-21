# Product Requirements Document (PRD)
## Gresik AI Travel Planner

**Versi:** 1.0  
**Status:** Draft / Blueprint Implementasi  
**Platform:** Web Responsive  
**Target:** Wisatawan Kabupaten Gresik, UMKM, pengelola wisata, hotel, dan pengelola transportasi  
**Konsep utama:** Personalized AI Travel Planner untuk Kabupaten Gresik

---

# 1. Ringkasan Produk

Gresik AI Travel Planner adalah website yang membantu pengguna merencanakan perjalanan di Kabupaten Gresik berdasarkan:

- budget
- durasi perjalanan
- lokasi awal
- minat wisata
- preferensi makanan
- pilihan transportasi
- jumlah orang
- kebutuhan hotel

Sistem menggunakan **AI sebagai conversational planner**, tetapi rekomendasi faktual berasal dari database sistem.

Hasil rekomendasi tidak hanya berupa teks, tetapi divisualisasikan menjadi:

- itinerary/timeline
- kartu wisata
- kartu UMKM/kuliner
- kartu hotel
- kartu transportasi
- artikel terkait
- rute perjalanan
- interactive map

Konsep utama:

> **User berbicara dengan AI → AI memahami kebutuhan → Recommendation Engine mencari data → sistem membuat itinerary → hasil ditampilkan secara visual di Chat, Timeline, dan Map.**

---

# 2. Masalah yang Ingin Diselesaikan

Pengguna yang ingin berwisata di Gresik biasanya harus mencari informasi dari banyak tempat.

Contohnya:

- mencari destinasi di Google
- mencari makanan di platform lain
- mencari hotel di platform lain
- mencari transportasi secara terpisah
- menghitung budget sendiri
- menentukan urutan perjalanan sendiri

Masalah tersebut menghasilkan pengalaman:

> "Informasinya ada, tetapi saya tidak tahu harus mulai dari mana."

Produk ini menyelesaikan masalah tersebut dengan memberikan:

> **Satu sistem yang membantu pengguna menentukan perjalanan dari awal sampai selesai.**

---

# 3. Tujuan Produk

## Tujuan utama

Membangun sistem rekomendasi perjalanan berbasis AI yang mampu menghasilkan itinerary personal berdasarkan kebutuhan pengguna.

## Tujuan sekunder

1. Membantu wisatawan menemukan destinasi Gresik.
2. Membantu menemukan UMKM dan kuliner lokal.
3. Membantu memilih transportasi berdasarkan budget.
4. Membantu menemukan hotel.
5. Menampilkan rute perjalanan melalui map.
6. Menampilkan artikel/rekomendasi terkait.
7. Memberikan pengalaman chatbot yang interaktif.
8. Mempromosikan potensi pariwisata dan UMKM Kabupaten Gresik.

---

# 4. Target User

## 4.1 Wisatawan

Pengguna utama yang ingin:

- mencari tempat wisata
- membuat itinerary
- mencari makanan
- mencari hotel
- menghitung budget
- mencari transportasi

## 4.2 Wisatawan lokal

Contoh:

> "Weekend saya kosong. Ada rekomendasi jalan-jalan di Gresik?"

## 4.3 Wisatawan dari luar daerah

Contoh:

> "Saya dari Surabaya, mau ke Gresik satu hari."

## 4.4 Admin

Admin bertugas mengelola:

- destinasi
- UMKM
- hotel
- transportasi
- artikel
- kategori
- gambar
- data rekomendasi

---

# 5. Konsep Produk

Produk memiliki tiga cara utama untuk digunakan.

## Mode 1 — PLAN

Pengguna mengisi preferensi.

Contoh:

```text
Budget       : Rp150.000
Durasi       : 1 hari
Lokasi awal  : Terminal Bunder
Wisata       : Sejarah
Makanan      : Asin/Gurih
Transportasi : Umum
```

Sistem membuat itinerary.

---

## Mode 2 — AI CHAT

Pengguna cukup berbicara dengan chatbot.

Contoh:

> Saya punya Rp150 ribu, mau jalan-jalan di Gresik sehari, suka sejarah dan makanan asin.

AI memahami kebutuhan tersebut dan membuat rekomendasi.

---

## Mode 3 — EXPLORE

Pengguna menjelajah sendiri:

```text
Wisata
Kuliner
UMKM
Hotel
Transportasi
Artikel
```

---

# 6. Arsitektur Produk

```text
                         USER
                           │
                           ▼
                  ┌────────────────┐
                  │    FRONTEND    │
                  │ React +        │
                  │ Next.js        │
                  └───────┬────────┘
                          │
                          ▼
                  ┌────────────────┐
                  │   BACKEND/API  │
                  │ Recommendation │
                  │ AI Orchestrator│
                  └───────┬────────┘
                          │
             ┌────────────┼────────────┐
             │            │            │
             ▼            ▼            ▼
          QWEN          DATABASE      MAP
         /OLLAMA       PostgreSQL    Leaflet
             │          + PostGIS       │
             │            │              │
             └────────────┼──────────────┘
                          ▼
                   STRUCTURED RESULT
                          │
            ┌─────────────┼─────────────┐
            ▼             ▼             ▼
          CHAT        ITINERARY         MAP
```

---

# 7. Teknologi yang Digunakan

## Frontend

### Next.js

Framework utama frontend dan API layer.

### React

Digunakan untuk membuat komponen interaktif.

Contoh:

- ChatBox
- DestinationCard
- FoodCard
- HotelCard
- TransportCard
- Timeline
- Map

### TypeScript

Untuk memastikan struktur data AI dan database konsisten.

### Tailwind CSS

Untuk styling.

### shadcn/ui

Untuk komponen UI seperti:

- Button
- Card
- Dialog
- Tabs
- Dropdown
- Slider
- Badge
- Input

---

# 8. Backend

Backend dapat menggunakan:

### Opsi utama

**Next.js API / Route Handler**

Jika ingin satu project yang sederhana.

### Alternatif

Jika sudah kuat Laravel:

**Laravel + Inertia.js + React**

Untuk PRD ini implementasi utama diasumsikan menggunakan:

> **Next.js + TypeScript**

---

# 9. Database

## PostgreSQL

Database utama.

## PostGIS

Untuk data geografis.

Digunakan untuk:

- mencari tempat terdekat
- menghitung radius
- menentukan lokasi sekitar
- mencari hotel dekat destinasi
- mencari UMKM dekat itinerary

Contoh:

> Cari restoran asin dalam radius 1 km dari Kota Lama.

---

# 10. AI

## Model

**Qwen**

Untuk development lokal:

**Ollama + Qwen**

Arsitektur:

```text
Next.js
   ↓
AI Service
   ↓
Ollama
   ↓
Qwen
```

AI digunakan untuk:

- memahami bahasa pengguna
- mengambil preferensi
- menentukan intent
- membuat respons
- menjelaskan alasan rekomendasi
- membantu menyusun itinerary

AI **tidak menjadi sumber utama fakta wisata**.

---

# 11. Prinsip Penting AI

Sistem harus memisahkan:

### AI

Memahami:

> "Saya mau wisata murah, sejarah, dan makanan asin."

### Database

Mengetahui:

> Kota Lama memiliki kategori sejarah.

### Recommendation Engine

Menghitung:

> Kota Lama cocok 92%.

### Frontend

Menampilkan:

> Destination Card.

Dengan demikian:

**AI ≠ Database ≠ UI**

Ketiganya memiliki fungsi berbeda.

---

# 12. Recommendation Engine

Recommendation Engine merupakan salah satu komponen inti sistem.

Input:

```text
Budget
Durasi
Lokasi
Minat
Makanan
Transportasi
Jumlah orang
```

Kemudian sistem melakukan:

```text
User Preference
       ↓
Filtering
       ↓
Candidate
       ↓
Scoring
       ↓
Ranking
       ↓
Itinerary
```

Contoh scoring:

```text
Kecocokan minat       30%
Budget                 20%
Jarak                  15%
Transportasi           15%
Rating                 10%
Ketersediaan waktu    10%
```

Contoh hasil:

```text
Kota Lama          92
Kampung Kemasan    87
Sunan Giri         84
Telaga Ngipik      71
```

---

# 13. Modul 1 — Homepage

## Tujuan

Menjadi pintu masuk pengguna.

## Tampilan

Hero section:

> **Jelajahi Gresik Sesuai Caramu**

Subheadline:

> Atur budget, waktu, makanan, dan minatmu. Biarkan AI membuat rencana perjalanan.

Kemudian terdapat planner singkat.

```text
┌─────────────────────────────────────────────┐
│ Mau liburan seperti apa?                    │
│                                             │
│ 📍 Mulai dari                               │
│ [ Lokasi / Terminal / Pilih lokasi ]        │
│                                             │
│ 💰 Budget                                    │
│ [ Rp50K ] [ Rp100K ] [ Rp250K ] [ Custom ] │
│                                             │
│ ⏱ Durasi                                    │
│ [ Setengah Hari ] [ 1 Hari ] [ 2 Hari ]    │
│                                             │
│ 🎯 Minat                                    │
│ [ Sejarah ] [ Alam ] [ Kuliner ] [ Religi ]│
│                                             │
│          [ Buat Itinerary ]                 │
└─────────────────────────────────────────────┘
```

Di bawahnya:

- destinasi populer
- kuliner populer
- artikel
- rekomendasi berdasarkan kategori

---

# 14. Modul 2 — AI Chatbot

Ini adalah fitur utama.

## Tampilan

Menggunakan konsep tiga panel seperti rancangan awal:

```text
┌────────────┬──────────────────────┬──────────────┐
│            │                      │              │
│   CHAT     │     ITINERARY        │     MAP      │
│            │                      │              │
│ AI message │  Destination Card   │      📍      │
│            │                      │     / \      │
│ User       │  Food Card          │    📍─📍     │
│ message    │                      │              │
│            │  Transport Card     │              │
│            │                      │              │
│ [Input...] │                      │              │
└────────────┴──────────────────────┴──────────────┘
```

## Chat tidak menampilkan teks panjang saja.

Contoh:

> Saya menemukan itinerary yang sesuai dengan budget Rp150.000 dan minat sejarahmu.

Kemudian muncul:

### 🏛️ Kota Lama Gresik

⭐ 4.6  
Gratis  
Durasi 1,5 jam

### 🍜 UMKM Kuliner

🧂 Asin/Gurih  
Rp20.000–30.000

### 🚌 Transportasi

Transportasi umum  
Rp5.000

---

# 15. Modul 3 — AI Planner

Pengguna bisa memilih:

### Budget

- < Rp50K
- Rp50–100K
- Rp100–250K
- Rp250K+

### Durasi

- Setengah hari
- 1 hari
- 2 hari
- Custom

### Minat

- Sejarah
- Alam
- Religi
- Kuliner
- Keluarga
- Edukasi
- Hidden Gem

### Makanan

- Manis
- Asin
- Gurih
- Pedas
- Berkuah

### Transportasi

- Transportasi umum
- Motor
- Mobil
- Bebas

---

# 16. Modul 4 — Itinerary

Setelah rekomendasi dibuat, sistem menampilkan timeline.

Contoh:

```text
09.00
│
├── 🚌 Transportasi
│   Terminal Bunder
│
10.00
│
├── 🏛️ Kota Lama Gresik
│   1,5 jam
│
12.00
│
├── 🍜 UMKM Kuliner
│   Asin / Gurih
│
14.00
│
├── 🕌 Destinasi berikutnya
│
16.30
│
└── 🚌 Pulang
```

Setiap item memiliki:

- foto
- nama
- rating
- harga
- waktu
- jarak
- tombol detail
- tombol hapus
- tombol pindah

---

# 17. Modul 5 — Map

Map menggunakan:

**Leaflet + OpenStreetMap**

Map menampilkan:

- titik wisata
- UMKM
- hotel
- halte
- rute perjalanan

Ketika itinerary berubah:

> Map ikut berubah.

Contoh:

```text
Itinerary
    ↓
Destination coordinates
    ↓
Routing engine
    ↓
Route
    ↓
Leaflet
```

---

# 18. Modul 6 — UMKM & Kuliner

Halaman:

> **Kuliner Gresik**

Filter:

```text
Rasa
☐ Manis
☐ Asin
☐ Gurih
☐ Pedas

Harga
○ <20K
○ 20–50K
○ 50K+

Kategori
☐ Makanan berat
☐ Jajanan
☐ Minuman
☐ Oleh-oleh
```

Card:

```text
┌────────────────────────┐
│        FOTO            │
│                        │
│ UMKM Kuliner A         │
│ ⭐ 4.7                 │
│ 🧂 Asin • Gurih        │
│ 💰 Rp20K–35K           │
│ 📍 Gresik Kota         │
│                        │
│ [Lihat Detail]         │
└────────────────────────┘
```

---

# 19. Modul 7 — Wisata

Filter:

- kategori
- harga
- rating
- jarak
- cocok untuk keluarga
- indoor/outdoor
- durasi

Card:

```text
Foto
Nama Wisata
Kategori
Rating
Harga
Lokasi
Jam buka

[Detail]
```

---

# 20. Modul 8 — Hotel

Filter:

- harga
- rating
- lokasi
- fasilitas
- jarak dari itinerary

Contoh rekomendasi:

> **Hotel A**

⭐ 4.5  
Rp250.000/malam  
800 m dari destinasi terakhir.

AI menjelaskan:

> Hotel ini dipilih karena masih berada dalam budget dan dekat dengan rute perjalananmu.

---

# 21. Modul 9 — Transportasi

Sistem menyediakan pilihan:

### Hemat

Transportasi umum.

### Seimbang

Transportasi umum + ojol.

### Nyaman

Mobil/ojol.

Card:

```text
🚌 Transportasi Umum

Terminal
↓
Halte A
↓
Destinasi

Estimasi: 35 menit
Biaya: Rp5.000
```

---

# 22. Modul 10 — Artikel

Kategori:

- Sejarah
- Kuliner
- Wisata
- Budaya
- Tips perjalanan
- Hidden Gem

Artikel juga digunakan AI sebagai sumber informasi tambahan.

Contoh:

> User sedang melihat Kota Lama.

Sistem dapat menampilkan:

> **Artikel terkait: Sejarah Kota Lama Gresik**

---

# 23. Modul 11 — Detail Destinasi

Halaman detail berisi:

```text
[FOTO BESAR]

Kota Lama Gresik

⭐ 4.6
🏛️ Sejarah
📍 Lokasi

Tentang
...

Jam Operasional
...

Harga
...

Fasilitas
...

Map

Kuliner Terdekat

Hotel Terdekat

Artikel Terkait

[Tambahkan ke Itinerary]
```

---

# 24. Modul 12 — User Account

Pengguna dapat:

- login
- menyimpan itinerary
- favorite
- melihat history
- melanjutkan itinerary
- mengubah itinerary

Contoh:

```text
My Trips

├── Gresik 1 Hari
│   Rp125K
│
├── Gresik Weekend
│   Rp300K
│
└── Explore Gresik
    Rp80K
```

---

# 25. Modul 13 — Admin Dashboard

Admin memiliki dashboard:

```text
Dashboard
│
├── Statistik
├── Wisata
├── UMKM
├── Hotel
├── Transportasi
├── Artikel
├── Kategori
├── User
└── AI Recommendation
```

Admin dapat:

- tambah
- edit
- hapus
- verifikasi
- upload foto
- menentukan kategori
- menentukan harga
- menentukan koordinat

---

# 26. Database Utama

Tabel minimal:

```text
users
destinations
destination_categories
umkms
foods
hotels
transport_routes
transport_stops
articles
reviews
images
itineraries
itinerary_items
favorites
chat_sessions
chat_messages
recommendation_logs
```

Relasi penting:

```text
User
 │
 ├── Chat Session
 │
 ├── Favorite
 │
 └── Itinerary
        │
        └── Itinerary Item
                │
                ├── Destination
                ├── UMKM
                ├── Hotel
                └── Transport
```

---

# 27. AI Chat Flow

Contoh lengkap:

### Step 1

User:

> Saya punya Rp150 ribu dan mau wisata sehari di Gresik.

### Step 2

Qwen memahami:

```text
budget = 150000
duration = 1 day
location = Gresik
```

### Step 3

AI bertanya jika informasi kurang:

> Kamu lebih tertarik sejarah, alam, kuliner, atau religi?

### Step 4

User:

> Sejarah dan makanan asin.

### Step 5

Qwen menghasilkan preference:

```json
{
  "budget": 150000,
  "duration": 1,
  "interest": ["sejarah"],
  "food": ["asin"]
}
```

### Step 6

Recommendation Engine mencari database.

### Step 7

Sistem menghitung ranking.

### Step 8

Sistem mencari rute.

### Step 9

Backend menghasilkan structured JSON.

### Step 10

React menampilkan:

- AI message
- destination cards
- food cards
- transport cards
- timeline
- map

---

# 28. Structured Response AI

Format output harus terstruktur.

Contoh:

```json
{
  "type": "travel_plan",
  "summary": "Itinerary Gresik 1 hari",
  "budget": 150000,
  "estimated_cost": 120000,
  "items": [
    {
      "type": "destination",
      "id": "W001",
      "time": "09:00"
    },
    {
      "type": "food",
      "id": "U001",
      "time": "12:00"
    },
    {
      "type": "transport",
      "id": "T001",
      "time": "14:00"
    }
  ]
}
```

Frontend kemudian menentukan komponen yang sesuai.

---

# 29. API Utama

Endpoint yang direncanakan:

```text
POST /api/chat

POST /api/ai/parse-preference

POST /api/recommendations

POST /api/itinerary/generate

PUT /api/itinerary/{id}

GET /api/destinations

GET /api/destinations/{id}

GET /api/umkms

GET /api/hotels

GET /api/transport

GET /api/articles

POST /api/route

POST /api/favorites
```

---

# 30. Integrasi AI

Flow:

```text
POST /api/chat
       ↓
Conversation Manager
       ↓
Qwen
       ↓
Intent + Preference
       ↓
Recommendation Engine
       ↓
PostgreSQL/PostGIS
       ↓
Route Engine
       ↓
Structured JSON
       ↓
Frontend
```

---

# 31. Map & Routing

### Map

Leaflet + OpenStreetMap.

### Routing

Untuk tahap awal:

**OSRM**

Kemudian bisa dikembangkan ke:

**OpenRouteService**

Data lokasi:

```text
latitude
longitude
geometry
```

disimpan di PostGIS.

---

# 32. Authentication

Untuk versi awal dapat menggunakan:

**Supabase Auth**

Login:

- email/password
- Google OAuth jika dibutuhkan

User ID digunakan untuk:

- itinerary
- favorite
- history
- chat session

---

# 33. Storage

Foto:

**Supabase Storage**

Digunakan untuk:

- foto wisata
- foto UMKM
- foto hotel
- foto artikel

---

# 34. Tahapan Implementasi

## PHASE 0 — Perencanaan

Buat:

- user flow
- sitemap
- wireframe
- ERD
- architecture diagram
- design system

**Output:**

Blueprint sistem.

---

# PHASE 1 — Database

Buat:

- PostgreSQL
- PostGIS
- tabel wisata
- tabel UMKM
- tabel hotel
- tabel transport
- tabel artikel
- seed data

**Output:**

Database Gresik siap digunakan.

---

# PHASE 2 — Admin

Buat dashboard untuk memasukkan data.

Implementasi:

- CRUD wisata
- CRUD UMKM
- CRUD hotel
- CRUD transport
- CRUD artikel
- upload gambar

**Output:**

Admin dapat mengelola seluruh data.

---

# PHASE 3 — Explore

Buat:

- halaman wisata
- halaman kuliner
- halaman UMKM
- halaman hotel
- halaman artikel
- detail page
- filter

**Output:**

Website sudah bisa digunakan tanpa AI.

---

# PHASE 4 — Map

Implementasi:

- Leaflet
- marker
- detail lokasi
- routing
- distance
- duration

**Output:**

User dapat melihat lokasi dan rute.

---

# PHASE 5 — Recommendation Engine

Implementasi:

```text
Preference
↓
Filter
↓
Scoring
↓
Ranking
```

Mulai tanpa AI terlebih dahulu.

**Output:**

Sistem sudah bisa merekomendasikan destinasi berdasarkan parameter.

---

# PHASE 6 — AI

Implementasi:

- Ollama
- Qwen
- prompt
- structured output
- intent extraction
- preference extraction

**Output:**

AI dapat memahami bahasa natural pengguna.

---

# PHASE 7 — Integrasi AI + Recommendation

Gabungkan:

```text
Chat
↓
Qwen
↓
Preference
↓
Recommendation
↓
Database
↓
Itinerary
```

**Output:**

AI Travel Planner mulai berjalan.

---

# PHASE 8 — Rich Chat UI

Implementasi:

- Destination Card
- Food Card
- Hotel Card
- Transport Card
- Itinerary Card
- Map synchronization

**Output:**

Chatbot tidak lagi sekadar teks.

---

# PHASE 9 — Personalization

Tambahkan:

- history
- favorite
- saved itinerary
- conversation memory
- replanning

Contoh:

> "Ganti tempat makan."

Sistem membuat itinerary baru tanpa mengulang semuanya.

---

# PHASE 10 — Testing

Test:

### Functional testing

Apakah fitur berjalan?

### AI testing

Apakah AI memahami preference?

### Recommendation testing

Apakah rekomendasi sesuai?

### Map testing

Apakah rute benar?

### UI/UX testing

Apakah pengguna memahami hasil?

### Performance testing

Apakah response terlalu lama?

---

# 35. MVP

Jangan langsung membuat semua fitur.

MVP yang disarankan:

```text
✓ Homepage
✓ Database wisata
✓ Database UMKM
✓ Database transport
✓ Explore
✓ Filter
✓ Map
✓ AI Chat
✓ Recommendation Engine
✓ Itinerary
```

Hotel dan artikel dapat masuk setelah MVP stabil.

---

# 36. Prioritas Fitur

## P0 — Wajib

- Authentication
- Database
- Wisata
- UMKM
- Transportasi
- AI chatbot
- Recommendation Engine
- Itinerary
- Map

## P1 — Penting

- Hotel
- Artikel
- Favorite
- History
- Replanning
- Admin dashboard

## P2 — Pengembangan

- Review
- Rating
- Share itinerary
- Export PDF
- Event
- notifikasi
- personal travel profile

---

# 37. Struktur Folder

Jika menggunakan Next.js:

```text
src/
│
├── app/
│   ├── page.tsx
│   ├── planner/
│   ├── explore/
│   ├── destinations/
│   ├── umkm/
│   ├── hotels/
│   ├── transport/
│   ├── articles/
│   │
│   └── api/
│       ├── chat/
│       ├── recommendations/
│       ├── itinerary/
│       └── route/
│
├── components/
│   ├── chat/
│   ├── itinerary/
│   ├── map/
│   ├── destination/
│   ├── food/
│   ├── hotel/
│   └── transport/
│
├── lib/
│   ├── ai/
│   ├── recommendation/
│   ├── database/
│   ├── routing/
│   └── utils/
│
├── types/
│
└── prisma/
```

---

# 38. Design System

Karakter visual:

**Modern + Tourism + Local + Clean**

Warna dapat menggunakan:

- warna utama dari identitas Gresik
- putih
- neutral gray
- warna aksen untuk kategori

Kategori dapat memiliki visual berbeda:

```text
🏛️ Wisata Sejarah
🍜 Kuliner
🏨 Hotel
🚌 Transportasi
📰 Artikel
```

Namun jangan membuat setiap kategori memiliki terlalu banyak warna agar UI tetap konsisten.

---

# 39. Tampilan Desktop

Struktur utama AI Planner:

```text
┌───────────────────────────────────────────────────────────┐
│ LOGO       Explore  Plan  Articles       Profile          │
├──────────────┬──────────────────────────┬─────────────────┤
│              │                          │                 │
│   AI CHAT    │       ITINERARY          │      MAP        │
│              │                          │                 │
│  AI message  │  🏛️ Destination         │                 │
│              │                          │       📍        │
│  User msg    │  🚌 Transport            │    📍───📍      │
│              │                          │        \        │
│  AI message  │  🍜 UMKM                 │         📍      │
│              │                          │                 │
│              │  Total Rp120K            │                 │
│ [ Type... ]  │                          │                 │
└──────────────┴──────────────────────────┴─────────────────┘
```

---

# 40. Tampilan Mobile

Karena mobile kemungkinan besar menjadi perangkat utama wisatawan, layout desktop tidak boleh dipaksakan ke mobile.

Gunakan tab:

```text
┌─────────────────────────────┐
│ Gresik AI                   │
├─────────────────────────────┤
│                             │
│ AI Chat                     │
│                             │
│ "Saya menemukan itinerary   │
│  yang cocok..."             │
│                             │
│ ┌─────────────────────────┐ │
│ │ 🏛️ Kota Lama             │ │
│ │ ⭐ 4.6                  │ │
│ │ Rp0                     │ │
│ └─────────────────────────┘ │
│                             │
├─────────────────────────────┤
│ Chat | Itinerary | Map      │
└─────────────────────────────┘
```

---

# 41. Indikator Keberhasilan

MVP dianggap berhasil jika:

### User dapat:

1. memasukkan preferensi
2. berbicara dengan AI
3. mendapatkan rekomendasi
4. melihat alasan rekomendasi
5. melihat itinerary
6. melihat lokasi di map
7. melihat estimasi biaya
8. mengganti destinasi
9. menyimpan itinerary

### Sistem harus:

- memberikan output terstruktur
- tidak mengarang data lokasi
- menggunakan data database
- menghitung budget
- mempertimbangkan jarak
- mempertimbangkan transportasi
- dapat melakukan replanning

---

# 42. Prinsip Arsitektur yang Harus Dipertahankan

Ini bagian paling penting dari keseluruhan PRD.

```text
             QWEN
              │
       Memahami user
              │
              ▼
      RECOMMENDATION ENGINE
              │
       Mengambil keputusan
              │
              ▼
          DATABASE
              │
       Sumber data/fakta
              │
              ▼
           FRONTEND
              │
       Menampilkan hasil
              │
       ┌──────┼───────┐
       ▼      ▼       ▼
      CHAT  ITINERARY MAP
```

**Jangan membalik arsitektur ini.**

AI jangan dijadikan database.

AI jangan menentukan koordinat sendiri.

AI jangan mengarang harga.

AI jangan mengarang jam buka.

AI jangan menghasilkan HTML.

AI menghasilkan **intent, preference, reasoning, dan structured response**.

Database menghasilkan **fakta**.

Recommendation Engine menghasilkan **ranking**.

Frontend menghasilkan **pengalaman visual**.

---

# 43. Roadmap Implementasi Praktis

Urutan coding yang saya rekomendasikan:

```text
01. Setup Next.js + TypeScript
        ↓
02. Setup Tailwind + shadcn/ui
        ↓
03. Setup Supabase/PostgreSQL
        ↓
04. Buat ERD
        ↓
05. Buat database + seed data
        ↓
06. Buat Admin CRUD
        ↓
07. Buat Explore
        ↓
08. Buat Detail Wisata/UMKM
        ↓
09. Integrasi Leaflet
        ↓
10. Buat Recommendation Engine
        ↓
11. Buat Itinerary Generator
        ↓
12. Install Ollama + Qwen
        ↓
13. Buat /api/chat
        ↓
14. Integrasikan Qwen
        ↓
15. Structured Output
        ↓
16. Hubungkan AI → Recommendation Engine
        ↓
17. Hubungkan Recommendation → Itinerary
        ↓
18. Hubungkan Itinerary → Map
        ↓
19. Buat Rich Chat Cards
        ↓
20. Favorite + History
        ↓
21. Testing
        ↓
22. Deployment
```

---

# 44. Kesimpulan Teknologi

Untuk versi yang saya rekomendasikan:

```text
FRONTEND
Next.js
React
TypeScript
Tailwind CSS
shadcn/ui

BACKEND
Next.js API
Recommendation Engine

DATABASE
PostgreSQL
PostGIS
Supabase

AI
Qwen
Ollama

MAP
Leaflet
OpenStreetMap

ROUTING
OSRM / OpenRouteService

AUTH
Supabase Auth

STORAGE
Supabase Storage

DEPLOYMENT
Vercel
+
Supabase
+
VPS jika Ollama digunakan secara online
```

**Strategi implementasi terbaik adalah jangan langsung mengerjakan AI.** Bangun dulu **database Gresik → Explore → Map → Recommendation Engine → Itinerary**, baru masukkan **Qwen sebagai conversational layer**. Dengan urutan tersebut, walaupun AI belum selesai, website-mu sudah mempunyai sistem yang berjalan; setelah AI ditambahkan, AI tinggal menjadi cara yang lebih natural untuk mengakses sistem rekomendasi tersebut.