'use client';

import React from 'react';
import Link from 'next/link';
import { useTripPlanner } from '../../context/TripPlannerContext';

export default function ProfilePage() {
  const { preferences, savedTrips } = useTripPlanner();

  return (
    <div className="max-w-2xl mx-auto px-margin-mobile lg:px-margin-desktop py-8 sm:py-12 space-y-8">
      {/* Profile Card */}
      <div className="bg-surface rounded-[24px] border border-border p-6 sm:p-8 shadow-xs flex items-center gap-4 sm:gap-6">
        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-primary-container flex items-center justify-center text-on-primary-container font-bold text-2xl shadow-xs">
          <span className="material-symbols-outlined text-[36px]">person</span>
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-headline-md text-xl sm:text-2xl font-bold text-on-surface">
              Wisatawan Gresik
            </h1>
            <span className="font-label-sm text-[11px] font-bold px-3 py-0.5 rounded-full bg-primary-container/20 text-on-primary-container border border-primary/20">
              Personal Akun
            </span>
          </div>
          <p className="font-body-md text-xs sm:text-sm text-on-surface-variant mt-1">
            Menikmati wisata sejarah, religi, dan kuliner di Kabupaten Gresik.
          </p>
        </div>
      </div>

      {/* Preferences Section */}
      <div className="bg-surface rounded-[24px] border border-border p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-border">
          <h2 className="font-section-title text-base sm:text-lg font-bold text-on-surface flex items-center gap-2">
            <span className="material-symbols-outlined text-[20px] text-primary">tune</span>
            <span>Preferensi Perjalanan Default</span>
          </h2>
          <Link href="/plan">
            <span className="font-label-sm text-xs font-bold text-primary hover:underline flex items-center gap-0.5">
              <span>Ubah</span>
              <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
            </span>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
          <div className="bg-surface-container-low p-4 rounded-2xl border border-border">
            <div className="font-label-sm text-xs text-on-surface-variant mb-1 flex items-center gap-1.5 font-medium">
              <span className="material-symbols-outlined text-[16px] text-primary">favorite</span>
              <span>Minat Utama</span>
            </div>
            <div className="font-button-text font-bold text-on-surface capitalize">
              {preferences.interests.join(', ')}
            </div>
          </div>

          <div className="bg-surface-container-low p-4 rounded-2xl border border-border">
            <div className="font-label-sm text-xs text-on-surface-variant mb-1 flex items-center gap-1.5 font-medium">
              <span className="material-symbols-outlined text-[16px] text-primary">payments</span>
              <span>Budget Rata-rata</span>
            </div>
            <div className="font-button-text font-bold text-on-surface">
              Rp{preferences.budget.toLocaleString('id-ID')}
            </div>
          </div>

          <div className="bg-surface-container-low p-4 rounded-2xl border border-border">
            <div className="font-label-sm text-xs text-on-surface-variant mb-1 flex items-center gap-1.5 font-medium">
              <span className="material-symbols-outlined text-[16px] text-primary">directions_car</span>
              <span>Moda Kendaraan</span>
            </div>
            <div className="font-button-text font-bold text-on-surface capitalize">
              {preferences.transport}
            </div>
          </div>

          <div className="bg-surface-container-low p-4 rounded-2xl border border-border">
            <div className="font-label-sm text-xs text-on-surface-variant mb-1 flex items-center gap-1.5 font-medium">
              <span className="material-symbols-outlined text-[16px] text-primary">speed</span>
              <span>Gaya Perjalanan</span>
            </div>
            <div className="font-button-text font-bold text-on-surface capitalize">
              {preferences.travelStyle}
            </div>
          </div>
        </div>
      </div>

      {/* Settings & Info Links */}
      <div className="bg-surface rounded-[24px] border border-border overflow-hidden shadow-xs divide-y divide-border">
        <Link
          href="/my-trip"
          className="p-4 sm:p-5 flex items-center justify-between hover:bg-surface-container transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary-container/30 text-on-primary-container flex items-center justify-center">
              <span className="material-symbols-outlined text-[20px]">travel</span>
            </div>
            <div>
              <div className="font-section-title font-bold text-sm text-on-surface">Perjalanan Tersimpan</div>
              <div className="font-body-md text-xs text-on-surface-variant">{savedTrips.length} jadwal tersimpan</div>
            </div>
          </div>
          <span className="material-symbols-outlined text-on-surface-variant text-[20px]">chevron_right</span>
        </Link>

        <Link
          href="/admin"
          className="p-4 sm:p-5 flex items-center justify-between hover:bg-surface-container transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-secondary-container text-on-secondary-container flex items-center justify-center">
              <span className="material-symbols-outlined text-[20px]">verified</span>
            </div>
            <div>
              <div className="font-section-title font-bold text-sm text-on-surface">Verifikasi Data Destinasi (Admin)</div>
              <div className="font-body-md text-xs text-on-surface-variant">Kelola basis data faktual destinasi & UMKM</div>
            </div>
          </div>
          <span className="material-symbols-outlined text-on-surface-variant text-[20px]">chevron_right</span>
        </Link>

        <div className="p-4 sm:p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-surface-container-high text-on-surface-variant flex items-center justify-center">
              <span className="material-symbols-outlined text-[20px]">auto_awesome</span>
            </div>
            <div>
              <div className="font-section-title font-bold text-sm text-on-surface">Versi GATRA</div>
              <div className="font-body-md text-xs text-on-surface-variant">v1.0.0 (AI Travel Planner Modern UI)</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

