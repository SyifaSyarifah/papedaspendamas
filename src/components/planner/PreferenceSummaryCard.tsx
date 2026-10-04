'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTripPlanner } from '../../context/TripPlannerContext';

export function PreferenceSummaryCard() {
  const router = useRouter();
  const { preferences, setIsGenerating } = useTripPlanner();

  const durationLabels: Record<string, string> = {
    half_day: 'Setengah Hari',
    '1_day': '1 Hari',
    '2_days': '2 Hari',
  };

  const transportLabels: Record<string, string> = {
    motor: 'Sepeda Motor',
    mobil: 'Mobil Pribadi',
    umum: 'Transportasi Umum',
  };

  const travelStyleLabels: Record<string, string> = {
    santai: 'Santai (2–3 destinasi)',
    seimbang: 'Seimbang (4–5 destinasi)',
    padat: 'Padat (6+ destinasi)',
  };

  const handleConfirm = () => {
    setIsGenerating(true);
    router.push('/plan/recommendation');
  };

  return (
    <div className="max-w-xl mx-auto bg-surface rounded-[2.5rem] border border-border shadow-sm p-6 sm:p-10 space-y-6">
      {/* Top Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-2xl bg-primary-container flex items-center justify-center text-on-primary-container font-bold shadow-xs">
          <span className="material-symbols-outlined text-[22px]" style={{ fontVariationSettings: "'FILL' 1" }}>
            auto_awesome
          </span>
        </div>
        <div>
          <h2 className="font-section-title text-xl sm:text-2xl font-bold text-on-surface">
            Ringkasan Rencana
          </h2>
          <p className="font-body-md text-xs sm:text-sm text-on-surface-variant">
            GATRA siap menyusun jadwal perjalananmu berdasarkan preferensi ini
          </p>
        </div>
      </div>

      {/* Grid of preferences */}
      <div className="bg-surface-container-low rounded-2xl p-5 border border-border space-y-4">
        {/* Lokasi */}
        <div className="flex items-center justify-between py-2 border-b border-border/80">
          <div className="flex items-center gap-2 text-on-surface-variant text-sm font-medium">
            <span className="material-symbols-outlined text-[18px] text-primary">location_on</span>
            <span>Titik Berangkat</span>
          </div>
          <span className="font-button-text font-bold text-on-surface text-sm sm:text-base">
            {preferences.startLocation || 'Surabaya'}
          </span>
        </div>

        {/* Budget */}
        <div className="flex items-center justify-between py-2 border-b border-border/80">
          <div className="flex items-center gap-2 text-on-surface-variant text-sm font-medium">
            <span className="material-symbols-outlined text-[18px] text-primary">payments</span>
            <span>Anggaran</span>
          </div>
          <span className="font-label-sm font-bold text-on-primary-container text-xs sm:text-sm px-3 py-1 rounded-full bg-primary-container/20 border border-primary/30">
            Rp{preferences.budget.toLocaleString('id-ID')}
          </span>
        </div>

        {/* Durasi */}
        <div className="flex items-center justify-between py-2 border-b border-border/80">
          <div className="flex items-center gap-2 text-on-surface-variant text-sm font-medium">
            <span className="material-symbols-outlined text-[18px] text-primary">schedule</span>
            <span>Durasi</span>
          </div>
          <span className="font-button-text font-bold text-on-surface text-sm sm:text-base">
            {durationLabels[preferences.duration] || '1 Hari'}
          </span>
        </div>

        {/* Minat */}
        <div className="flex items-start justify-between py-2 border-b border-border/80">
          <div className="flex items-center gap-2 text-on-surface-variant text-sm font-medium">
            <span className="material-symbols-outlined text-[18px] text-primary">favorite</span>
            <span>Minat Wisata</span>
          </div>
          <div className="flex flex-wrap gap-1.5 justify-end max-w-[60%]">
            {preferences.interests.map((interest) => (
              <span
                key={interest}
                className="px-2.5 py-0.5 rounded-full bg-surface border border-border text-xs font-semibold text-on-surface capitalize"
              >
                {interest}
              </span>
            ))}
          </div>
        </div>

        {/* Transportasi */}
        <div className="flex items-center justify-between py-2 border-b border-border/80">
          <div className="flex items-center gap-2 text-on-surface-variant text-sm font-medium">
            <span className="material-symbols-outlined text-[18px] text-primary">directions_car</span>
            <span>Kendaraan</span>
          </div>
          <span className="font-button-text font-bold text-on-surface text-sm sm:text-base capitalize">
            {transportLabels[preferences.transport] || 'Motor'}
          </span>
        </div>

        {/* Gaya Perjalanan */}
        <div className="flex items-center justify-between py-2">
          <div className="flex items-center gap-2 text-on-surface-variant text-sm font-medium">
            <span className="material-symbols-outlined text-[18px] text-primary">tune</span>
            <span>Gaya Perjalanan</span>
          </div>
          <span className="font-button-text font-bold text-on-surface text-sm sm:text-base">
            {travelStyleLabels[preferences.travelStyle] || 'Santai'}
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-2">
        <Link href="/plan" className="sm:w-1/3 order-2 sm:order-1">
          <button
            type="button"
            className="w-full py-3.5 px-4 rounded-xl border border-border hover:border-primary/50 bg-surface text-on-surface-variant font-button-text text-sm font-semibold transition-colors flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined text-[18px]">edit</span>
            <span>Ubah</span>
          </button>
        </Link>

        <button
          type="button"
          onClick={handleConfirm}
          className="sm:w-2/3 order-1 sm:order-2 py-3.5 px-6 rounded-xl bg-primary-container text-on-primary-container hover:bg-primary hover:text-on-primary font-button-text text-base font-bold transition-all shadow-sm flex items-center justify-center gap-2 active:scale-95"
        >
          <span className="material-symbols-outlined text-[20px]">auto_awesome</span>
          <span>Buat Rekomendasi</span>
        </button>
      </div>
    </div>
  );
}

