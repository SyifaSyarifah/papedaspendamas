'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useTripPlanner } from '../context/TripPlannerContext';
import { GRESIK_DESTINATIONS } from '../data/gresikDestinations';
import { GRESIK_CULINARY } from '../data/gresikCulinary';

export default function HomePage() {
  const router = useRouter();
  const { updatePreferences } = useTripPlanner();
  const [promptInput, setPromptInput] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [activeChip, setActiveChip] = useState<string>('Kawasan Kota Tua');

  const inspirationChips = [
    { label: 'Kawasan Kota Tua', interest: 'sejarah' as const, query: 'Saya ingin eksplor sejarah Kawasan Kota Tua Bandar Grisse' },
    { label: 'Kuliner Pesisir', interest: 'kuliner' as const, query: 'Saya mau kulineran khas pesisir Gresik seperti Nasi Krawu' },
    { label: 'Wisata Religi', interest: 'religi' as const, query: 'Saya ingin ziarah ke makam Maulana Malik Ibrahim dan Sunan Giri' },
    { label: 'Liburan Keluarga', interest: 'keluarga' as const, query: 'Saya ingin liburan santai ramah keluarga di Gresik' },
  ];

  const handleChipClick = (chip: typeof inspirationChips[0]) => {
    setActiveChip(chip.label);
    setPromptInput(chip.query);
    updatePreferences({ interests: [chip.interest] });
  };

  const handleHeroSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (promptInput.trim()) {
      router.push(`/plan?mode=ai&q=${encodeURIComponent(promptInput)}`);
    } else {
      router.push('/plan');
    }
  };

  return (
    <div className="flex flex-col w-full relative overflow-hidden">
      {/* 1. Interactive Ambient Gradient Background */}
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-1/4 -right-1/4 w-[60%] h-[60%] bg-gradient-to-br from-primary-container/25 via-primary/10 to-transparent rounded-full blur-[100px] opacity-70" />
        <div className="absolute top-1/3 -left-1/4 w-[50%] h-[50%] bg-gradient-to-tr from-secondary-container/20 via-transparent to-transparent rounded-full blur-[80px] opacity-60" />
      </div>

      {/* 2. Hero & AI Input Section */}
      <section className="w-full relative z-10 max-w-container-max mx-auto px-margin-mobile lg:px-margin-desktop pb-20 pt-12 sm:pt-16 md:pt-20 lg:pt-24">
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto space-y-10 md:space-y-12">
          {/* Title Area */}
          <div className="space-y-4 animate-fade-in-up">
            <h1 className="font-hero-lg text-hero-lg-mobile md:text-hero-lg text-on-background tracking-tight">
              Jalan-jalan ke Gresik, <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-[#b38800]">
                lebih mudah.
              </span>
            </h1>

            <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mx-auto">
              Ceritakan perjalanan yang kamu inginkan, GATRA bantu menyusunnya.
            </p>
          </div>

          {/* Main AI Input Component */}
          <div className="w-full relative animate-fade-in-up pt-1 sm:pt-2" style={{ animationDelay: '0.1s' }}>
            {/* Glowing aura */}
            <div
              className={`absolute inset-0 bg-primary-container/30 rounded-[26px] blur-xl scale-[1.02] transition-opacity duration-300 pointer-events-none ${
                isFocused ? 'opacity-100' : 'opacity-60'
              }`}
            />

            <div
              className={`relative bg-surface rounded-[24px] p-2 sm:p-3 shadow-[0_10px_30px_rgba(37,37,37,0.05)] border transition-all duration-300 ${
                isFocused
                  ? 'border-primary shadow-[0_15px_40px_rgba(119,90,0,0.12)]'
                  : 'border-border hover:border-primary/50 hover:shadow-[0_15px_40px_rgba(37,37,37,0.08)]'
              }`}
            >
              <form onSubmit={handleHeroSubmit} className="flex flex-col md:flex-row gap-2">
                <div className="relative flex-1 flex items-center">
                  <span className="absolute left-4 text-primary text-[24px] select-none pointer-events-none material-symbols-outlined">
                    auto_awesome
                  </span>
                  <input
                    type="text"
                    value={promptInput}
                    onChange={(e) => setPromptInput(e.target.value)}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    placeholder="Contoh: Saya punya budget Rp150 ribu, suka sejarah dan kuliner..."
                    className="w-full h-14 pl-12 pr-4 bg-transparent font-body-md text-body-md text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none transition-all duration-300"
                  />
                </div>

                <div className="flex gap-2 shrink-0 p-1 md:p-0">
                  <button
                    type="submit"
                    className="flex-1 md:flex-none h-14 px-6 bg-primary-container text-on-primary-fixed hover:bg-primary hover:text-on-primary font-button-text text-button-text rounded-[16px] transition-all flex items-center justify-center gap-2 group shadow-sm active:scale-95"
                  >
                    <span className="material-symbols-outlined text-[20px] transition-transform group-hover:rotate-12">
                      auto_awesome
                    </span>
                    <span>Buat Perjalanan</span>
                  </button>

                  <Link href="/plan?mode=quick" className="flex-1 md:flex-none">
                    <button
                      type="button"
                      className="w-full h-14 px-6 bg-surface hover:bg-surface-container text-on-surface-variant font-button-text text-button-text rounded-[16px] border border-border transition-colors flex items-center justify-center whitespace-nowrap active:scale-95"
                    >
                      Atur Sendiri
                    </button>
                  </Link>
                </div>
              </form>
            </div>
          </div>

          {/* Quick Inspiration Chips */}
          <div className="w-full animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <div className="flex flex-wrap items-center justify-center gap-2.5">
              <span className="font-label-sm text-label-sm text-on-surface-variant/70 uppercase tracking-widest mr-1 text-xs">
                Inspirasi:
              </span>
              {inspirationChips.map((chip) => {
                const isActive = activeChip === chip.label;
                return (
                  <button
                    key={chip.label}
                    type="button"
                    onClick={() => handleChipClick(chip)}
                    className={`px-4 py-2 rounded-full font-label-sm text-label-sm transition-all duration-200 active:scale-95 border ${
                      isActive
                        ? 'bg-primary-container/30 border-primary text-on-surface font-semibold shadow-xs'
                        : 'bg-surface border-border hover:border-primary/50 text-on-surface-variant hover:text-on-surface'
                    }`}
                  >
                    {chip.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Visual / Interactive Divider */}
      <div className="w-full flex justify-center py-4">
        <div className="w-[1px] h-20 bg-gradient-to-b from-primary/30 to-transparent" />
      </div>

      {/* 3. Featured Destinations (Bento Grid Style) */}
      <section className="w-full max-w-container-max mx-auto px-margin-mobile lg:px-margin-desktop py-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div className="space-y-1">
            <h2 className="font-headline-md text-headline-md text-on-background">
              Destinasi Populer
            </h2>
            <p className="font-body-md text-body-md text-on-surface-variant">
              Temukan pesona Gresik yang paling banyak direkomendasikan.
            </p>
          </div>

          <Link
            href="/explore"
            className="flex items-center gap-1.5 font-button-text text-button-text text-primary hover:text-[#5a4400] transition-colors group font-semibold"
          >
            <span>Lihat Semua</span>
            <span className="material-symbols-outlined text-[20px] transition-transform group-hover:translate-x-1">
              arrow_forward
            </span>
          </Link>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 h-auto md:h-[540px]">
          {/* Card 1: Large Featured (Spans 8 cols) */}
          <Link
            href="/explore/destination/dest-1"
            className="group block md:col-span-8 relative rounded-[24px] overflow-hidden bg-surface-container-high aspect-video md:aspect-auto shadow-sm hover:shadow-card transition-all duration-300"
          >
            <Image
              src="https://images.unsplash.com/photo-1596401057633-54a8fe8ef647?auto=format&fit=crop&w=1200&q=80"
              alt="Bandar Grisse"
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
            {/* Gradient Scrim */}
            <div className="absolute inset-0 bg-gradient-to-t from-on-surface/90 via-on-surface/30 to-transparent opacity-85" />

            <div className="absolute inset-0 p-6 md:p-8 flex flex-col justify-between">
              <div className="flex justify-end">
                <span className="bg-primary-container text-on-primary-fixed px-3.5 py-1 rounded-full font-label-sm text-xs font-bold flex items-center gap-1 shadow-lg backdrop-blur-md bg-opacity-95">
                  <span className="material-symbols-outlined text-[16px]">local_fire_department</span>
                  Trending
                </span>
              </div>
              <div className="space-y-2">
                <span className="text-primary-fixed font-label-sm text-xs tracking-wider uppercase font-semibold">
                  Sejarah & Budaya
                </span>
                <h3 className="font-headline-md text-2xl md:text-3xl text-surface group-hover:text-primary-fixed transition-colors font-bold">
                  Bandar Grisse & Kota Tua
                </h3>
                <p className="font-body-md text-sm md:text-base text-surface-variant max-w-md line-clamp-2">
                  Kawasan cagar budaya yang memadukan arsitektur Kolonial, Arab, dan Pecinan dalam harmoni kota pelabuhan kuno.
                </p>
              </div>
            </div>
          </Link>

          {/* Right Column for smaller cards (Spans 4 cols) */}
          <div className="md:col-span-4 grid grid-cols-1 gap-6 h-full">
            {/* Card 2: Medium Culinary */}
            <Link
              href="/explore?tab=culinary"
              className="group block relative rounded-[24px] overflow-hidden bg-surface-container-high h-56 md:h-auto shadow-sm hover:shadow-card transition-all duration-300"
            >
              <Image
                src="https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=800&q=80"
                alt="Kuliner Khas Nasi Krawu"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-on-surface/90 via-on-surface/20 to-transparent" />
              <div className="absolute inset-0 p-6 flex flex-col justify-end">
                <span className="text-primary-fixed font-label-sm text-xs font-semibold mb-1 uppercase tracking-wider">
                  Kuliner Legenda
                </span>
                <h3 className="font-section-title text-xl text-surface font-bold group-hover:text-primary-fixed transition-colors">
                  Surga Nasi Krawu & Pudak
                </h3>
              </div>
            </Link>

            {/* Card 3: Medium with AI Context */}
            <Link
              href="/plan"
              className="group block relative rounded-[24px] overflow-hidden bg-surface border border-border p-6 shadow-[0_10px_30px_rgba(37,37,37,0.03)] hover:shadow-[0_15px_40px_rgba(37,37,37,0.08)] transition-all duration-300 hover:border-primary/50"
            >
              <div className="flex flex-col h-full justify-between">
                <div className="space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-secondary-container flex items-center justify-center text-on-secondary-fixed">
                    <span className="material-symbols-outlined text-[24px]">map</span>
                  </div>
                  <div>
                    <h3 className="font-section-title text-lg text-on-surface font-bold mb-1 group-hover:text-primary transition-colors">
                      Jelajah Alam & Pesisir
                    </h3>
                    <p className="font-body-md text-sm text-on-surface-variant line-clamp-2">
                      Mulai dari Bukit Jamur hingga Pantai Dalegan. Dapatkan rute efisien sesuai durasi liburanmu.
                    </p>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-border flex items-center justify-between">
                  <span className="font-label-sm text-xs text-text-secondary flex items-center gap-1.5 font-medium">
                    <span className="material-symbols-outlined text-[16px] text-primary">auto_awesome</span>
                    Rekomendasi AI
                  </span>
                  <span className="material-symbols-outlined text-[20px] text-on-surface-variant group-hover:translate-x-1 transition-transform">
                    arrow_forward
                  </span>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* 4. How GATRA Works (3 Steps) */}
      <section className="w-full max-w-container-max mx-auto px-margin-mobile lg:px-margin-desktop py-12">
        <div className="bg-surface rounded-[2.5rem] border border-border p-8 md:p-12 shadow-sm">
          <div className="text-center max-w-xl mx-auto mb-10">
            <h2 className="font-headline-md text-2xl md:text-3xl font-bold text-on-surface mb-2">
              Perjalanan Personal dalam 3 Langkah
            </h2>
            <p className="font-body-md text-on-surface-variant text-sm md:text-base">
              GATRA menyusun seluruh detail mulai dari pemilihan destinasi, kuliner, hingga rute perjalanan.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-surface-container-low border border-border flex flex-col items-center text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-primary-container text-on-primary-container font-bold text-lg flex items-center justify-center shadow-xs">
                1
              </div>
              <h3 className="font-section-title text-base md:text-lg font-bold text-on-surface">
                Tentukan Preferensi
              </h3>
              <p className="font-body-md text-sm text-on-surface-variant leading-relaxed">
                Pilih budget, durasi waktu, minat wisata, serta moda transportasi yang kamu gunakan.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-surface-container-low border border-border flex flex-col items-center text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-primary-container text-on-primary-container font-bold text-lg flex items-center justify-center shadow-xs">
                2
              </div>
              <h3 className="font-section-title text-base md:text-lg font-bold text-on-surface">
                Rekomendasi AI Akurat
              </h3>
              <p className="font-body-md text-sm text-on-surface-variant leading-relaxed">
                Dapatkan kecocokan skor destinasi dan kuliner terdekat dengan alasan rekomendasi yang transparan.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-surface-container-low border border-border flex flex-col items-center text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-primary-container text-on-primary-container font-bold text-lg flex items-center justify-center shadow-xs">
                3
              </div>
              <h3 className="font-section-title text-base md:text-lg font-bold text-on-surface">
                Itinerary & Peta Rute
              </h3>
              <p className="font-body-md text-sm text-on-surface-variant leading-relaxed">
                Jadwal tersusun otomatis dengan rincian biaya, visual peta rute Leaflet, dan fitur replanning instan.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Bottom Call to Action */}
      <section className="w-full max-w-container-max mx-auto px-margin-mobile lg:px-margin-desktop pb-12">
        <div className="relative rounded-[2.5rem] bg-gradient-to-r from-primary to-[#5a4400] text-on-primary p-8 md:p-14 text-center overflow-hidden shadow-lg">
          <div className="relative z-10 max-w-2xl mx-auto space-y-4">
            <h2 className="font-headline-md text-2xl md:text-4xl font-bold tracking-tight text-white">
              Siap Jelajahi Keindahan Gresik?
            </h2>
            <p className="font-body-lg text-sm md:text-base text-surface-variant max-w-xl mx-auto opacity-95">
              Mulai rencanakan liburanmu bersama asisten AI personal GATRA. Cepat, hemat, dan terstruktur.
            </p>
            <div className="pt-3">
              <Link href="/plan">
                <button className="px-8 py-4 bg-primary-container text-on-primary-fixed hover:bg-white hover:text-on-surface font-button-text text-base font-bold rounded-2xl transition-all shadow-md active:scale-95 inline-flex items-center gap-2">
                  <span className="material-symbols-outlined text-[20px]">auto_awesome</span>
                  <span>Mulai Rencanakan Sekarang</span>
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

