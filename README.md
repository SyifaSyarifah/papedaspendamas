# GATRA — AI Travel Planner Gresik

> **Asisten Perjalanan Wisata Cerdas Berbasis AI untuk Menjelajahi Sejarah, Religi, Pesisir, dan Kuliner Otentik di Kabupaten Gresik.**

---

## 📌 Tentang Proyek

**GATRA** (*Gresik AI Travel Assistant*) adalah platform perencana perjalanan personal berbasis kecerdasan buatan (AI) yang dirancang khusus untuk memajukan sektor pariwisata Kabupaten Gresik. 

Platform ini membantu wisatawan menyusun rencana perjalanan (*itinerary*) yang terstruktur, hemat, dan efisien—mulai dari rekomendasi destinasi cagar budaya Bandar Grissee, ziarah Makam Wali Songo (Sunan Giri & Syekh Maulana Malik Ibrahim), eksplorasi wisata alam pesisir, hingga kuliner legendaris khas seperti Nasi Krawu, Pudak, dan Olahan Bandeng UMKM.

---

## 🚀 Fitur Utama

- 🤖 **AI Conversational Concierge**: Input bahasa natural untuk merangkum preferensi budget, minat, dan waktu secara cerdas.
- ⚡ **Quick Form Planner**: Perencanaan cepat 3 langkah untuk menyusun jadwal sesuai waktu (setengah hari, 1 hari, 2 hari) dan kendaraan (motor/mobil).
- 🗺️ **Peta Rute Interaktif (Leaflet.js)**: Visualisasi titik rute, jarak tempuh (km), estimasi durasi perjalanan, serta integrasi langsung ke Google Maps.
- 🔄 **Smart Instant Replanning**: Penyesuaian jadwal fleksibel secara real-time dengan perbandingan perubahan alokasi waktu dan biaya (*diff card*).
- ⛽ **Budget Fuel Gauge**: Pelacak alokasi anggaran transparan (transportasi, tiket, kuliner, aktivitas/parkir).
- 🍲 **Katalog Wisata & Kuliner Otentik**: Informasi lengkap destinasi, jam operasional, tiket masuk, koordinat GPS, dan ulasan.
- 📱 **Mobile-First & Responsive Experience**: Antarmuka modern yang nyaman diakses dari smartphone maupun desktop dengan *smart hide/show navbar on scroll*.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Map & Geolocation**: [Leaflet](https://leafletjs.com/) & React-Leaflet
- **Icons**: Material Symbols Outlined & Lucide Icons
- **State Management**: React Context API (`TripPlannerContext`)

---

## 💻 Panduan Menjalankan Project (Untuk Rekan Tim)

Semua kode antarmuka (UI/UX) dan fungsionalitas sistem terbaru berada di branch **`update`**. Ikuti langkah-langkah di bawah ini untuk menjalankan sistem di device masing-masing:

### 1. Clone Repository & Masuk ke Branch `update`

Buka terminal pada komputer/laptop kamu, lalu jalankan salah satu opsi berikut:

**Opsi A — Langsung clone branch `update`:**
```bash
git clone -b update https://github.com/SyifaSyarifah/papedaspendamas.git
cd papedaspendamas
```

**Opsi B — Clone biasa lalu switch ke branch `update`:**
```bash
git clone https://github.com/SyifaSyarifah/papedaspendamas.git
cd papedaspendamas
git checkout update
```

---

### 2. Install Dependencies / Modul

Pastikan kamu sudah menginstal [Node.js](https://nodejs.org/) (versi 18.x atau lebih baru). Jalankan perintah berikut untuk mengunduh modul:

```bash
npm install
```

---

### 3. Jalankan Development Server

Setelah proses install selesai, jalankan server pengembangan lokal:

```bash
npm run dev
```

Server akan aktif pada:
```
http://localhost:3000
```
Buka URL di atas melalui browser (Google Chrome / Edge / Firefox).

---

### 4. Build Production (Opsional / Pengujian)

Untuk memastikan tidak ada error pada kode produksi:

```bash
npm run build
npm run start
```

---

## 📁 Struktur Direktori Utama

```
gatra/
├── src/
│   ├── app/                    # Routing & Halaman (Next.js App Router)
│   │   ├── explore/            # Katalog Destinasi & Kuliner
│   │   ├── plan/               # AI Planner, Form, Rekomendasi, Itinerary, & Peta Rute
│   │   ├── my-trip/            # Jadwal Perjalanan Tersimpan
│   │   ├── profile/            # Pengaturan Profil & Preferensi
│   │   ├── layout.tsx          # Root Layout dengan Navbar & Footer Global
│   │   └── page.tsx            # Landing Page / Beranda
│   ├── components/             # Komponen UI Modular
│   │   ├── common/             # Navbar, Footer, Button, Badge, Loading
│   │   ├── explore/            # DestinationCard, FoodCard
│   │   ├── itinerary/          # TimelineView, BudgetSummaryCard, ReplanningDiff
│   │   ├── map/                # LeafletMap, RouteFloatingCard
│   │   └── planner/            # AIChatInterface, QuickPlannerForm, StepProgressBar
│   ├── context/                # TripPlannerContext (Global State)
│   ├── data/                   # Dataset Destinasi & Kuliner Gresik
│   ├── image/                  # Logo & Asset Gambar Resmi GATRA
│   └── lib/                    # Generator Itinerary & Recommendation Engine
├── package.json
└── tailwind.config.ts
```

---

## 👥 Tim Pengembang

- **GATRA Team** — Universitas & Inisiatif Pariwisata Cerdas Gresik
