'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { GRESIK_DESTINATIONS } from '../../../../data/gresikDestinations';
import { useTripPlanner } from '../../../../context/TripPlannerContext';
import { LeafletMap } from '../../../../components/map/LeafletMap';

export default function DestinationDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const { selectedDestinations, toggleDestinationSelection } = useTripPlanner();

  const destination = GRESIK_DESTINATIONS.find((d) => d.id === id) || GRESIK_DESTINATIONS[0];
  const isSelected = selectedDestinations.some((d) => d.id === destination.id);

  return (
    <div className="max-w-4xl mx-auto px-margin-mobile lg:px-margin-desktop py-6 sm:py-10 space-y-8">
      {/* Back navigation */}
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

      {/* Hero Image & Overlay */}
      <div className="relative w-full aspect-[16/9] sm:h-96 rounded-[24px] overflow-hidden border border-border shadow-sm">
        <Image
          src={destination.image}
          alt={destination.name}
          fill
          priority
          sizes="(max-width: 768px) 100vw, 896px"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/20" />

        <div className="absolute top-4 left-4">
          <div className="bg-surface-container-low/90 backdrop-blur-md text-on-surface-variant font-label-sm text-xs px-3.5 py-1 rounded-full border border-border/50 font-bold">
            {destination.categoryLabel}
          </div>
        </div>

        <div className="absolute bottom-6 left-6 right-6 text-white space-y-2">
          <div className="flex items-center gap-3 text-xs sm:text-sm">
            <div className="flex items-center gap-1 text-primary-container font-bold">
              <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                star
              </span>
              <span>{destination.rating}</span>
              <span className="text-white/80 font-normal">({destination.reviewCount} ulasan)</span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-1">
              <span className="material-symbols-outlined text-[16px]">schedule</span>
              <span>{destination.openingHours}</span>
            </div>
          </div>

          <h1 className="font-headline-md text-2xl sm:text-4xl font-bold tracking-tight">
            {destination.name}
          </h1>

          <div className="flex items-center gap-1.5 text-xs sm:text-sm text-white/90">
            <span className="material-symbols-outlined text-[18px] text-primary-container">location_on</span>
            <span>{destination.address}</span>
          </div>
        </div>
      </div>

      {/* Quick Specs Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-surface p-4 rounded-[20px] border border-border shadow-xs text-center">
        <div className="p-2">
          <div className="font-label-sm text-xs text-on-surface-variant mb-0.5">Tiket Masuk</div>
          <div className="font-section-title font-bold text-sm sm:text-base text-primary">
            {destination.priceLabel}
          </div>
        </div>
        <div className="p-2 border-l border-border/60">
          <div className="font-label-sm text-xs text-on-surface-variant mb-0.5">Waktu Kunjungan</div>
          <div className="font-section-title font-bold text-sm sm:text-base text-on-surface">
            ± {destination.recommendedDurationMinutes} Menit
          </div>
        </div>
        <div className="p-2 border-l border-border/60">
          <div className="font-label-sm text-xs text-on-surface-variant mb-0.5">Waktu Terbaik</div>
          <div className="font-section-title font-bold text-xs sm:text-sm text-on-surface">
            {destination.bestTimeToVisit.split('(')[0]}
          </div>
        </div>
        <div className="p-2 border-l border-border/60">
          <div className="font-label-sm text-xs text-on-surface-variant mb-0.5">Jarak Pusat Kota</div>
          <div className="font-section-title font-bold text-sm sm:text-base text-on-surface">
            {destination.distanceKm} km
          </div>
        </div>
      </div>

      {/* Description & Details */}
      <div className="bg-surface rounded-[24px] border border-border p-6 sm:p-8 shadow-xs space-y-6">
        <div>
          <h2 className="font-section-title text-lg sm:text-xl font-bold text-on-surface mb-2">
            Tentang Destinasi
          </h2>
          <p className="font-body-md text-sm sm:text-base text-on-surface-variant leading-relaxed">
            {destination.description}
          </p>
        </div>

        {/* Highlights */}
        <div>
          <h3 className="font-label-sm text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-3">
            Daya Tarik Utama
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {destination.highlights.map((h, idx) => (
              <div key={idx} className="flex items-center gap-2 text-xs sm:text-sm text-on-surface bg-surface-container-low p-3 rounded-xl border border-border">
                <span className="material-symbols-outlined text-[18px] text-[#2e7d32] bg-success-soft rounded-full p-[2px]">
                  check
                </span>
                <span className="font-medium">{h}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Facilities */}
        <div>
          <h3 className="font-label-sm text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-3">
            Fasilitas Tersedia
          </h3>
          <div className="flex flex-wrap gap-2">
            {destination.facilities.map((f, idx) => (
              <span
                key={idx}
                className="px-3 py-1 rounded-full bg-surface-container text-xs font-semibold text-on-surface-variant border border-border"
              >
                {f}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Mini Map Location */}
      <div className="bg-surface rounded-[24px] border border-border p-6 shadow-xs space-y-4">
        <h2 className="font-section-title text-lg font-bold text-on-surface flex items-center gap-2">
          <span className="material-symbols-outlined text-[22px] text-primary">location_on</span>
          <span>Lokasi & Peta Sekitar</span>
        </h2>
        <LeafletMap destinations={[destination]} height="280px" zoom={14} />
      </div>

      {/* Bottom Sticky Actions */}
      <div className="sticky bottom-20 md:bottom-6 z-30 bg-surface/95 backdrop-blur-md rounded-[24px] border border-border p-4 sm:p-5 shadow-float flex items-center justify-between gap-4">
        <div>
          <div className="font-label-sm text-xs text-on-surface-variant">Tiket Masuk</div>
          <div className="font-headline-md font-bold text-base sm:text-xl text-primary">
            {destination.priceLabel}
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={() => toggleDestinationSelection(destination)}
            className={`font-button-text font-bold text-xs sm:text-sm px-6 py-3 rounded-xl transition-all shadow-xs flex items-center gap-2 active:scale-95 ${
              isSelected
                ? 'bg-primary text-on-primary'
                : 'bg-primary-container text-on-primary-container hover:bg-primary hover:text-on-primary'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">
              {isSelected ? 'check' : 'add'}
            </span>
            <span>{isSelected ? 'Sudah Ada di Trip' : 'Tambah ke Trip'}</span>
          </button>

          <Link href="/plan">
            <button
              type="button"
              className="hidden sm:inline-flex items-center gap-1.5 px-4 py-3 rounded-xl border border-border hover:border-primary/50 font-button-text text-sm font-semibold text-on-surface-variant transition-colors"
            >
              <span className="material-symbols-outlined text-[18px] text-primary">auto_awesome</span>
              <span>Rangkai Itinerary</span>
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}

