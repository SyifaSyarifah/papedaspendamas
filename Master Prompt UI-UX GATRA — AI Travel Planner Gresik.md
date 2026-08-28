# MASTER PROMPT UI/UX — GATRA

Design a complete modern UI/UX system for **GATRA — Gresik AI Travel & Recommendation Assistant**, an AI-powered personalized travel planning web application focused on Kabupaten Gresik, Indonesia.

## 1. PRODUCT CONCEPT

GATRA is not a tourism catalog and not merely a chatbot.

GATRA is a **personal travel planning assistant** that helps users turn their travel needs into a practical itinerary.

The core experience is:

User tells their needs  
→ GATRA understands  
→ User confirms preferences  
→ GATRA recommends destinations  
→ GATRA creates itinerary  
→ User sees map and estimated budget  
→ User can modify the itinerary  
→ User saves the trip.

The interface must communicate:

**"Tell GATRA what kind of trip you want, and GATRA helps organize it."**

The AI must feel like an assistant, while important travel information must be presented visually through cards, chips, timeline, map, budget summary, and recommendations.

---

# 2. TARGET USERS

Design for a broad Indonesian audience.

The interface must be comfortable for:

- teenagers
- university students
- young adults
- families
- parents
- older users who are comfortable using smartphones/web applications

Do not make the interface feel overly technical.

Use:

- simple Indonesian language
- large readable typography
- clear hierarchy
- large clickable buttons
- familiar icons
- generous spacing
- obvious primary actions
- minimal cognitive load

The user should understand what to do without reading a long instruction.

---

# 3. VISUAL DIRECTION

Create a contemporary Indonesian travel product aesthetic.

## Color Theme

Primary color:

**Soft Warm Yellow / Golden Yellow**

Suggested direction:

- Primary: #F4C95D
- Primary Soft: #FFF3C4
- Background: #FFFDF8
- Surface: #FFFFFF
- Text Primary: #252525
- Text Secondary: #6B6B6B
- Border: #EDE8DA
- Success: soft green
- Warning: soft orange
- Error: soft red

Do not make the interface overly bright yellow.

Yellow should be used mainly for:

- primary CTA
- selected state
- important highlights
- AI accent
- badges
- active navigation
- important visual details

The overall appearance should remain:

**soft + warm + clean + premium + friendly.**

Use plenty of white space.

---

# 4. DESIGN STYLE

Use:

- modern minimalism
- rounded cards
- soft shadows
- subtle borders
- large travel photography
- clean iconography
- soft yellow accents
- generous whitespace
- responsive layouts
- clear visual hierarchy

Avoid:

- excessive gradients
- neon colors
- dark heavy interfaces
- overly complicated dashboards
- excessive animations
- tiny text
- excessive cards inside cards
- overly technical AI appearance

The product should feel similar to a modern travel startup rather than a government information portal.

---

# 5. TYPOGRAPHY

Use a highly readable modern sans-serif font.

Recommended:

**Plus Jakarta Sans**

Alternative:

**Inter**

Typography:

- Hero heading: 40–56 px desktop
- Page heading: 28–40 px
- Section heading: 20–24 px
- Body: 16 px
- Secondary text: 14–16 px
- Small metadata: minimum 14 px

Use strong hierarchy.

Do not use excessively small text.

---

# 6. BRAND CHARACTER

GATRA should feel:

- friendly
- intelligent
- helpful
- local
- trustworthy
- calm
- modern
- practical

The AI should not look robotic.

Use a subtle sparkle/star icon to represent GATRA AI.

Example:

"✦ GATRA"

The AI identity should be friendly but not childish.

---

# 7. RESPONSIVE DESIGN

Design both:

## Desktop

Primary target:

1440 × 1024

Also ensure:

1280 × 800

## Mobile

Primary target:

390 × 844

Also support:

360 × 800

The mobile layout must not simply shrink the desktop design.

Reorganize content specifically for mobile.

Desktop:

Top navigation.

Mobile:

Bottom navigation.

Mobile navigation:

Home  
Plan  
Explore  
My Trip  
Profile

Desktop navigation:

GATRA  
Plan  
Explore  
My Trip  
Profile

---

# 8. CORE COMPONENTS

Create a consistent design system containing:

- Navbar
- Bottom navigation
- Button
- Secondary button
- Ghost button
- Input
- Search input
- Dropdown
- Select
- Chip
- Filter chip
- Badge
- Card
- Destination Card
- Food / UMKM Card
- Recommendation Card
- AI Message
- AI Quick Choice
- Preference Summary
- Budget Summary
- Timeline
- Map container
- Route indicator
- Modal
- Toast
- Loading state
- Empty state
- Error state
- Skeleton loading
- Bottom sheet

Cards should use approximately:

12–20 px border radius.

Buttons should have comfortable touch areas.

---

# 9. SCREEN 01 — HOME

Create the main GATRA landing/home screen.

Goal:

Make the user immediately understand that GATRA helps plan a trip.

Hero section:

"Jalan-jalan ke Gresik, lebih mudah."

Alternative supporting text:

"Ceritakan perjalanan yang kamu inginkan, GATRA bantu menyusunnya."

Large AI input box:

"Contoh: Saya punya budget Rp150 ribu, suka sejarah dan kuliner, ingin jalan-jalan satu hari."

Primary CTA:

"✦ Buat Perjalanan"

Secondary option:

"Atur sendiri"

Quick inspiration:

- Sejarah
- Kuliner
- Alam
- Keluarga

Add a beautiful Gresik travel image section.

Show several featured destination cards below.

Do not overload the homepage.

The primary action must clearly be:

**Buat Perjalanan**

---

# 10. SCREEN 02 — QUICK PLANNER

Create a friendly step-by-step travel planner.

Title:

"Yuk, buat perjalananmu"

Show progress:

1 Preferensi
2 Rekomendasi
3 Itinerary

Input sections:

### Lokasi awal

"Berangkat dari mana?"

Example:

Surabaya

### Budget

"Berapa budget perjalananmu?"

Chips:

Rp100K  
Rp150K  
Rp200K  
Rp300K+

### Durasi

Setengah Hari  
1 Hari  
2 Hari

### Minat

Sejarah  
Kuliner  
Alam  
Keluarga  
Religi  
Edukasi

### Transportasi

Motor  
Mobil  
Transportasi Umum

### Gaya perjalanan

Santai  
Seimbang  
Padat

Primary CTA:

"✦ Buat Rencana"

Use large selectable chips rather than complicated forms.

---

# 11. SCREEN 03 — AI PLANNER

Create a conversational AI planning interface.

Header:

"✦ GATRA AI"

Status:

"Online"

Opening message:

"Halo! Saya GATRA. Ceritakan perjalanan yang kamu inginkan, nanti saya bantu susunkan."

User message:

"Saya punya budget 150 ribu dan suka sejarah."

AI response:

"Siap. Kamu ingin perjalanan berapa lama?"

Show quick choices:

Setengah Hari  
1 Hari  
2 Hari

Input field:

"Ketik pesan..."

Microphone icon.

The AI interface must not consist of long text paragraphs.

Whenever possible, convert AI questions into quick choice buttons.

The conversation should feel natural and easy.

---

# 12. SCREEN 04 — PREFERENCE SUMMARY

Create a confirmation screen after AI understands the user's needs.

Title:

"Rencana perjalananmu"

Show a clean summary card:

📍 Gresik  
💰 Rp150.000  
🕐 1 Hari  
🏛 Sejarah  
🍜 Kuliner  
🛵 Motor  
🌿 Santai

Add:

"Sudah sesuai dengan yang kamu inginkan?"

Primary CTA:

"✓ Buat Rencana"

Secondary CTA:

"✎ Ubah"

The screen should give confidence before recommendation generation.

---

# 13. SCREEN 05 — RECOMMENDATION

This is one of the most important GATRA screens.

Title:

"Rekomendasi untukmu"

Subtitle:

"3 tempat yang paling sesuai dengan rencana perjalananmu."

Create large destination recommendation cards.

Each card contains:

- destination photo
- destination name
- category
- match score
- price
- distance
- estimated visit duration
- why recommended
- CTA

Example:

"94% cocok"

Reasons:

✓ Sesuai minat sejarah  
✓ Masuk budget  
✓ Rute efisien

CTA:

"Tambah ke Trip"

Secondary:

"Lihat Detail"

Match score should be visually noticeable but not overpower the actual destination.

Use progressive disclosure.

Show the most important information first.

---

# 14. SCREEN 06 — ITINERARY

Create a beautiful visual travel timeline.

Header:

"Gresik 1 Hari"

Summary:

Rp125.000  
3 Destinasi

Timeline:

09:00 — Berangkat

10:00 — Museum / Destination A

12:00 — Kuliner / UMKM B

14:00 — Destination C

16:00 — Pulang

Every timeline item contains:

- time
- destination
- category
- estimated duration
- estimated cost
- travel time

Show budget summary:

Transportasi  
Rp40.000

Tiket  
Rp10.000

Kuliner  
Rp25.000

Aktivitas  
Rp50.000

Total  
Rp125.000

Budget  
Rp150.000

Sisa  
Rp25.000

Bottom actions:

"Lihat Map"

"Ubah Rencana"

"Save Trip"

---

# 15. SCREEN 07 — MAP & ROUTE

Create a map-focused interface.

Use a clean map layout.

Show:

- starting point
- destination A
- destination B
- destination C
- route line
- numbered markers
- estimated travel distance
- estimated travel time

Use a floating bottom card containing:

"Rute perjalanan"

A → B → C

"Total perjalanan 18 km"

"Estimasi waktu 52 menit"

The map must visually support the itinerary, not replace it.

---

# 16. SCREEN 08 — EXPLORE

Create an exploration page.

Header:

"Explore Gresik"

Search:

"Cari destinasi atau kuliner..."

Tabs:

Destinasi  
Kuliner

Filter chips:

Sejarah  
Alam  
Keluarga  
Kuliner  
Budget  
Terdekat

Show destination cards in a clean grid on desktop.

Use a single-column or two-column layout on mobile.

Each card:

Image  
Name  
Category  
Price  
Distance  
Rating

The Explore screen should remain simple.

It is not a full marketplace.

---

# 17. SCREEN 09 — DESTINATION DETAIL

Create a rich destination detail page.

Large hero image.

Information:

Destination name

Category

Rating

Price

Opening hours

Description

Location

Facilities

Add a small map preview.

Primary CTA:

"Tambah ke Trip"

Secondary:

"Lihat Rute"

Show related recommendations below.

Do not put every piece of information above the fold.

Use progressive disclosure.

---

# 18. SCREEN 10 — FOOD / UMKM DETAIL

Create a contextual culinary detail page.

Large food / UMKM image.

Information:

Name

Category

Price range

Opening hours

Location

Distance from current itinerary

Example:

"700 meter dari Museum A"

Primary CTA:

"Tambah ke Trip"

Show:

"Cocok untuk perjalananmu karena..."

This screen should communicate that food is part of the travel itinerary, not a marketplace.

Do not add checkout or shopping functionality.

---

# 19. SCREEN 11 — REPLANNING

Create a screen for changing an existing itinerary.

Title:

"Sesuaikan perjalanan"

Subtitle:

"Ada yang ingin kamu ubah?"

Large action cards:

💰 Kurangi Budget

🏛 Ganti Destinasi

🍜 Ganti Kuliner

🕐 Buat Lebih Santai

➕ Tambah Aktivitas

✦ Chat dengan GATRA

Also provide free-text input:

"Atau ceritakan perubahan yang kamu inginkan..."

Example:

"Saya ingin lebih banyak kuliner."

Primary CTA:

"Kirim"

The design should feel easy and non-destructive.

---

# 20. SCREEN 12 — REPLANNING RESULT

Show a clear before/after comparison.

Title:

"Rencana berhasil disesuaikan"

AI explanation:

"Saya menemukan alternatif yang lebih sesuai dengan budgetmu."

BEFORE:

Kuliner A  
Rp45.000

AFTER:

Kuliner B  
Rp25.000

Show:

Budget sebelumnya: Rp145.000

Budget sekarang: Rp125.000

Sisa budget: Rp25.000

Use a visual diff pattern.

Primary CTA:

"Terapkan Perubahan"

Secondary:

"Kembali"

The user must clearly understand what changed before applying it.

---

# 21. SCREEN 13 — MY TRIP

Create a saved-trip management page.

Title:

"Perjalanan Saya"

Show saved trip cards.

Example:

"Gresik 1 Hari"

Rp125.000

3 Destinasi

23 Agustus 2026

CTA:

"Buka Perjalanan"

Also allow:

- delete
- duplicate
- continue planning

Keep the page clean.

---

# 22. SCREEN 14 — PROFILE

Create a simple profile page.

Header:

"Profil"

Show user information.

Preference section:

Minat:

Sejarah  
Kuliner

Transportasi:

Motor

Gaya perjalanan:

Santai

Budget preference:

Rp150.000

CTA:

"Edit Preference"

Other options:

Trip tersimpan

Pengaturan

Bantuan

Do not make the profile screen overly complex.

---

# 23. AI INTERACTION DESIGN

GATRA AI must use four interaction patterns.

### ASK

AI asks a question.

Immediately provide quick choices.

### RECOMMEND

AI gives a short explanation.

Then show recommendation cards.

### CONFIRM

AI summarizes the user's preferences.

User confirms or edits.

### REPLAN

User requests a change.

AI shows what will change.

Then show before/after result.

Never use long AI paragraphs when a visual component can communicate the information better.

---

# 24. AI VISUAL LANGUAGE

AI messages should have a subtle visual identity.

Use:

✦ GATRA

Use soft yellow accent around AI components.

AI cards can have:

- very light yellow background
- yellow sparkle icon
- rounded corners
- short text

Do not make AI bubbles look like generic ChatGPT clones.

The AI should feel integrated into the travel planner.

---

# 25. RECOMMENDATION CARD DESIGN

Every recommendation card should contain:

Image

Name

Category

Match Score

Price

Distance

Why Recommended

CTA

Example:

Museum X

94% cocok

🏛 Sejarah

Rp10.000

5.2 km

✓ Sesuai minat sejarah

✓ Sesuai budget

✓ Rute efisien

[Tambah ke Trip]

The recommendation must be explainable.

Do not display only:

"94% cocok"

Always show why.

---

# 26. BUDGET UI

Budget should be visually understandable.

Use a simple summary component.

Example:

Budget kamu

Rp150.000

Estimated cost

Rp125.000

Remaining

Rp25.000

Use a progress indicator.

The user should immediately understand whether the itinerary is:

- within budget
- near budget
- over budget

Do not require the user to calculate manually.

---

# 27. LOADING STATE

When GATRA generates a trip, show a contextual progress state.

Example:

"✦ GATRA sedang menyusun perjalanan..."

✓ Memahami preferensi

✓ Mencari destinasi

● Menyusun itinerary

○ Menghitung rute

Do not use an unexplained generic spinner.

---

# 28. EMPTY STATE

If no suitable recommendation exists:

"Belum menemukan perjalanan yang cocok."

Then:

"Coba salah satu opsi berikut:"

Tambah budget

Tambah waktu

Pilih minat lain

CTA:

"Sesuaikan Rencana"

---

# 29. ERROR STATE

If AI fails:

"GATRA sedang mengalami kendala."

But do not block the entire application.

Show:

"Gunakan Quick Planner"

The user must still be able to create a trip without AI.

---

# 30. ACCESSIBILITY

Design for broad usability.

Requirements:

- minimum body text 16 px where practical
- minimum secondary text 14 px
- strong text/background contrast
- large buttons
- clear focus states
- clear selected states
- icons paired with text where necessary
- do not rely on color alone
- avoid dense information
- simple Indonesian wording
- consistent navigation

All primary buttons must be visually obvious.

---

# 31. RESPONSIVE BEHAVIOR

Desktop:

Use spacious layouts.

Home:

large centered hero.

Recommendation:

2–3 cards per row.

Itinerary:

timeline with optional map panel.

Explore:

3–4 cards per row.

Mobile:

single-column content.

Cards become horizontal or vertical depending on content.

Map becomes full-screen with bottom sheet.

Timeline becomes vertical.

Buttons should remain easy to tap.

Navigation becomes bottom navigation.

---

# 32. MICROINTERACTIONS

Use subtle modern interactions:

- card hover
- button hover
- selected chip animation
- progress transition
- map marker selection
- card expansion
- smooth itinerary update
- AI typing indicator

Animations should be subtle.

Avoid excessive motion.

---

# 33. DESIGN CONSISTENCY

All screens must feel like one product.

Use the same:

- color tokens
- border radius
- typography
- spacing
- button style
- icon style
- card style
- navigation
- AI identity
- photo treatment

Create a reusable design system before designing individual screens.

---

# 34. FIGMA / DESIGN FILE STRUCTURE

Organize the design file into:

01 — Design System

02 — Components

03 — Desktop Screens

04 — Mobile Screens

05 — User Flow

06 — Prototype

07 — Empty & Error States

08 — Admin

---

# 35. PROTOTYPE FLOW

Create the following clickable prototype:

HOME

↓

QUICK PLANNER

↓

PREFERENCE SUMMARY

↓

RECOMMENDATION

↓

ITINERARY

↓

MAP

↓

REPLANNING

↓

REPLANNING RESULT

↓

UPDATED ITINERARY

↓

SAVE TRIP

Also create:

HOME

↓

AI PLANNER

↓

PREFERENCE SUMMARY

↓

RECOMMENDATION

---

# 36. IMPORTANT PRODUCT CONSTRAINTS

Do NOT add:

- hotel booking
- hotel marketplace
- transport booking
- payment gateway
- checkout
- ticketing
- marketplace
- event management
- machine learning dashboard
- complex social features

These are outside the MVP scope.

Food / UMKM must remain contextual to the itinerary.

The product should focus on:

**Planning → Recommendation → Itinerary → Map → Budget → Replanning.**

---

# 37. FINAL DESIGN GOAL

The final UI should make users feel:

"I don't need to know Gresik very well. I just need to tell GATRA what kind of trip I want."

Visual personality:

**Warm yellow + white + modern + friendly + intelligent + accessible + local travel.**

The final product should look like a polished modern travel startup designed for Indonesian users, not a generic AI dashboard.

Generate a complete consistent UI/UX system with all 14 artboards, responsive desktop and mobile layouts, reusable components, states, interactions, and prototype flow.