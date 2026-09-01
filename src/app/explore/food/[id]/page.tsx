'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { GRESIK_CULINARY } from '../../../../data/gresikCulinary';

export default function FoodDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const food = GRESIK_CULINARY.find((f) => f.id === id) || GRESIK_CULINARY[0];

  return (
    <div className="max-w-4xl mx-auto px-margin-mobile lg:px-margin-desktop py-6 sm:py-10 space-y-8">
      {/* Back button */}
      <div>
        <button
          type="button"
          onClick={() => router.back()}
          className="inline-flex items-center gap-1.5 font-label-sm text-sm font-semibold text-on-surface-variant hover:text-primary transition-colors"
        >
          <span className="material-symbols-outlined text-[20px]">arrow_back</span>
          <span>Kembali</span>
        </button>
      </div>

      {/* Hero Banner */}
      <div className="relative w-full aspect-[16/9] sm:h-80 rounded-[24px] overflow-hidden border border-border shadow-sm">
        <Image
          src={food.image}
          alt={food.name}
          fill
          priority
          sizes="(max-width: 768px) 100vw, 896px"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/20" />

        <div className="absolute top-4 left-4">
          <div className="bg-tertiary-container text-on-tertiary-container font-label-sm text-xs px-3.5 py-1 rounded-full shadow-xs font-bold">
            {food.categoryLabel}
          </div>
        </div>

        <div className="absolute bottom-6 left-6 right-6 text-white space-y-1.5">
          <div className="flex items-center gap-3 text-xs sm:text-sm">
            <div className="flex items-center gap-1 text-primary-container font-bold">
              <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                star
              </span>
              <span>{food.rating}</span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-1">
              <span className="material-symbols-outlined text-[16px]">schedule</span>
              <span>{food.openingHours}</span>
            </div>
          </div>

          <h1 className="font-headline-md text-2xl sm:text-4xl font-bold tracking-tight">
            {food.name}
          </h1>

          <div className="flex items-center gap-1.5 text-xs sm:text-sm text-white/90">
            <span className="material-symbols-outlined text-[18px] text-primary-container">location_on</span>
            <span>{food.address}</span>
          </div>
        </div>
      </div>

      {/* Contextual Route Tag */}
      <div className="bg-surface-container-low border border-border rounded-[20px] p-4 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-primary-container text-on-primary-container flex items-center justify-center shrink-0 shadow-xs">
          <span className="material-symbols-outlined text-[20px]">restaurant</span>
        </div>
        <div>
          <div className="font-label-sm text-xs font-bold text-primary uppercase tracking-wider">
            Posisi dalam Rute
          </div>
          <div className="font-body-md text-sm font-semibold text-on-surface">
            {food.distanceFromItinerary || 'Berada di jalur wisata utama kota Gresik'}
          </div>
        </div>
      </div>

      {/* Why Recommended for Trip */}
      <div className="bg-surface rounded-[24px] border border-border p-6 sm:p-8 shadow-xs space-y-6">
        <div>
          <div className="flex items-center gap-1.5 font-label-sm text-xs font-bold text-primary uppercase tracking-wider mb-2">
            <span className="material-symbols-outlined text-[16px]">auto_awesome</span>
            <span>Kesesuaian dengan Perjalananmu</span>
          </div>
          <h2 className="font-section-title text-lg sm:text-xl font-bold text-on-surface mb-2">
            Cocok untuk Perjalananmu karena:
          </h2>
          <p className="font-body-md text-sm sm:text-base text-on-surface-variant leading-relaxed bg-surface-container-low p-4 rounded-2xl border border-border">
            {food.recommendedReason}
          </p>
        </div>

        <div>
          <h3 className="font-section-title text-base font-bold text-on-surface mb-2">
            Deskripsi Kuliner
          </h3>
          <p className="font-body-md text-sm text-on-surface-variant leading-relaxed">
            {food.description}
          </p>
        </div>

        {/* Popular Menu */}
        <div>
          <h3 className="font-section-title text-base font-bold text-on-surface mb-3">
            Menu Paling Direkomendasikan
          </h3>
          <div className="flex flex-wrap gap-2">
            {food.popularMenu.map((item, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-surface-container-low border border-border text-xs sm:text-sm font-semibold text-on-surface"
              >
                <span className="material-symbols-outlined text-[16px] text-primary">restaurant</span>
                <span>{item}</span>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="sticky bottom-20 md:bottom-6 z-30 bg-surface/95 backdrop-blur-md rounded-[24px] border border-border p-4 sm:p-5 shadow-float flex items-center justify-between gap-4">
        <div>
          <div className="font-label-sm text-xs text-on-surface-variant">Kisaran Harga</div>
          <div className="font-headline-md font-bold text-base sm:text-xl text-primary">
            {food.priceLabel}
          </div>
        </div>

        <Link href="/plan">
          <button
            type="button"
            className="px-6 py-3 bg-primary text-on-primary hover:bg-[#5e4700] font-button-text font-bold text-sm sm:text-base rounded-xl transition-all shadow-sm flex items-center gap-2 active:scale-95"
          >
            <span className="material-symbols-outlined text-[18px]">auto_awesome</span>
            <span>Masukkan ke Rencana Trip</span>
          </button>
        </Link>
      </div>
    </div>
  );
}

