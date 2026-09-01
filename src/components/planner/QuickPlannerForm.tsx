'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useTripPlanner } from '../../context/TripPlannerContext';
import { TripDuration, TransportType, TravelStyle } from '../../types/planner';
import { DestinationCategory } from '../../types/destination';

export function QuickPlannerForm() {
  const router = useRouter();
  const { preferences, updatePreferences } = useTripPlanner();

  const startLocations = ['Surabaya', 'Gresik Kota', 'Sidoarjo', 'Lamongan'];
  const budgets = [
    { value: 100000, label: '100K' },
    { value: 150000, label: '150K' },
    { value: 200000, label: '200K' },
    { value: 300000, label: '300K+' },
  ];

  const durations: { value: TripDuration; label: string; icon: string }[] = [
    { value: 'half_day', label: 'Setengah Hari', icon: 'schedule' },
    { value: '1_day', label: '1 Hari', icon: 'calendar_today' },
    { value: '2_days', label: '2 Hari', icon: 'calendar_month' },
  ];

  const interestOptions: { value: DestinationCategory; label: string }[] = [
    { value: 'sejarah', label: 'Sejarah' },
    { value: 'kuliner', label: 'Kuliner' },
    { value: 'alam', label: 'Alam' },
    { value: 'keluarga', label: 'Keluarga' },
    { value: 'religi', label: 'Religi' },
    { value: 'edukasi', label: 'Edukasi' },
  ];

  const transportOptions: { value: TransportType; label: string; icon: string }[] = [
    { value: 'motor', label: 'Motor', icon: 'two_wheeler' },
    { value: 'mobil', label: 'Mobil', icon: 'directions_car' },
    { value: 'umum', label: 'Umum', icon: 'directions_bus' },
  ];

  const travelStyles: { value: TravelStyle; label: string; icon: string; subLabel: string }[] = [
    { value: 'santai', label: 'Santai', icon: 'coffee', subLabel: '2–3 destinasi/hari' },
    { value: 'seimbang', label: 'Seimbang', icon: 'balance', subLabel: '4–5 destinasi/hari' },
    { value: 'padat', label: 'Padat', icon: 'bolt', subLabel: '6+ destinasi/hari' },
  ];

  const handleInterestToggle = (category: DestinationCategory) => {
    const current = preferences.interests;
    if (current.includes(category)) {
      if (current.length > 1) {
        updatePreferences({ interests: current.filter((c) => c !== category) });
      }
    } else {
      updatePreferences({ interests: [...current, category] });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push('/plan/summary');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-12">
      <div className="bg-surface rounded-[2.5rem] shadow-sm border border-border p-6 sm:p-10 md:p-12 w-full max-w-3xl mx-auto space-y-10">
        {/* 1. Lokasi Awal */}
        <section>
          <h2 className="text-section-title font-section-title text-on-surface mb-4 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">location_on</span>
            <span>Titik Berangkat</span>
          </h2>
          <div className="flex flex-wrap gap-3">
            {startLocations.map((loc) => {
              const isSelected = preferences.startLocation === loc;
              return (
                <button
                  key={loc}
                  type="button"
                  onClick={() => updatePreferences({ startLocation: loc })}
                  className={`px-5 py-2.5 rounded-full font-label-sm text-sm transition-all duration-200 active:scale-95 ${
                    isSelected
                      ? 'bg-primary text-on-primary font-bold shadow-xs'
                      : 'border border-border bg-surface text-on-surface-variant hover:bg-surface-container'
                  }`}
                >
                  {loc}
                </button>
              );
            })}
          </div>
        </section>

        {/* 2. Budget */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-section-title font-section-title text-on-surface flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">payments</span>
              <span>Anggaran Perjalanan</span>
            </h2>
            <span className="font-label-sm text-xs font-semibold text-primary bg-primary-container/20 px-3 py-1 rounded-full">
              Rp{preferences.budget.toLocaleString('id-ID')}
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            {budgets.map((b) => {
              const isSelected = preferences.budget === b.value;
              return (
                <button
                  key={b.value}
                  type="button"
                  onClick={() => updatePreferences({ budget: b.value })}
                  className={`h-14 flex items-center justify-center rounded-full font-body-md text-base transition-all duration-200 active:scale-95 ${
                    isSelected
                      ? 'border-2 border-primary bg-primary-container/20 font-bold text-on-primary-container shadow-xs'
                      : 'border border-border bg-surface text-on-surface-variant hover:bg-surface-container'
                  }`}
                >
                  {b.label}
                </button>
              );
            })}
          </div>
        </section>

        {/* 3. Duration */}
        <section>
          <h2 className="text-section-title font-section-title text-on-surface mb-4 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">schedule</span>
            <span>Durasi Wisata</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
            {durations.map((d) => {
              const isSelected = preferences.duration === d.value;
              return (
                <button
                  key={d.value}
                  type="button"
                  onClick={() => updatePreferences({ duration: d.value })}
                  className={`flex flex-col items-center justify-center gap-3 p-5 sm:p-6 rounded-3xl transition-all duration-200 active:scale-95 ${
                    isSelected
                      ? 'border-2 border-primary bg-primary-container/15 shadow-xs'
                      : 'border border-border bg-surface hover:bg-surface-container'
                  }`}
                >
                  <span
                    className={`material-symbols-outlined text-3xl ${
                      isSelected ? 'text-primary' : 'text-on-surface-variant'
                    }`}
                  >
                    {d.icon}
                  </span>
                  <span
                    className={`font-body-md text-sm sm:text-base ${
                      isSelected ? 'font-bold text-on-primary-container' : 'text-on-surface-variant'
                    }`}
                  >
                    {d.label}
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        {/* 4. Interests */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-section-title font-section-title text-on-surface flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">favorite</span>
              <span>Minat Wisata</span>
            </h2>
            <span className="text-xs font-label-sm text-on-surface-variant">
              {preferences.interests.length} dipilih
            </span>
          </div>

          <div className="flex flex-wrap gap-2.5 sm:gap-3">
            {interestOptions.map((opt) => {
              const isSelected = preferences.interests.includes(opt.value);
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => handleInterestToggle(opt.value)}
                  className={`px-6 py-2.5 rounded-full font-button-text text-sm sm:text-base transition-all duration-200 active:scale-95 ${
                    isSelected
                      ? 'bg-primary text-on-primary font-bold shadow-xs'
                      : 'border border-border bg-surface text-on-surface-variant hover:bg-surface-container'
                  }`}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
        </section>

        {/* 5. Transport & Style (2 Columns) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Transport */}
          <section>
            <h2 className="text-section-title font-section-title text-on-surface mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">directions_car</span>
              <span>Kendaraan</span>
            </h2>
            <div className="flex flex-col gap-3">
              {transportOptions.map((t) => {
                const isSelected = preferences.transport === t.value;
                return (
                  <button
                    key={t.value}
                    type="button"
                    onClick={() => updatePreferences({ transport: t.value })}
                    className={`flex items-center gap-4 p-4 rounded-2xl transition-all duration-200 active:scale-98 ${
                      isSelected
                        ? 'border-2 border-primary bg-primary-container/15 font-bold shadow-xs'
                        : 'border border-border bg-surface hover:bg-surface-container'
                    }`}
                  >
                    <span
                      className={`material-symbols-outlined text-2xl ${
                        isSelected ? 'text-primary' : 'text-on-surface-variant'
                      }`}
                    >
                      {t.icon}
                    </span>
                    <span
                      className={`font-body-md text-sm sm:text-base ${
                        isSelected ? 'font-bold text-on-primary-container' : 'text-on-surface-variant'
                      }`}
                    >
                      {t.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </section>

          {/* Tempo Perjalanan */}
          <section>
            <h2 className="text-section-title font-section-title text-on-surface mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">tune</span>
              <span>Tempo Perjalanan</span>
            </h2>
            <div className="flex flex-col gap-3">
              {travelStyles.map((s) => {
                const isSelected = preferences.travelStyle === s.value;
                return (
                  <button
                    key={s.value}
                    type="button"
                    onClick={() => updatePreferences({ travelStyle: s.value })}
                    className={`flex items-center gap-4 p-4 rounded-2xl transition-all duration-200 active:scale-98 ${
                      isSelected
                        ? 'border-2 border-primary bg-primary-container/15 font-bold shadow-xs'
                        : 'border border-border bg-surface hover:bg-surface-container'
                    }`}
                  >
                    <span
                      className={`material-symbols-outlined text-2xl ${
                        isSelected ? 'text-primary' : 'text-on-surface-variant'
                      }`}
                    >
                      {s.icon}
                    </span>
                    <div className="flex flex-col items-start">
                      <span
                        className={`font-body-md text-sm sm:text-base leading-tight ${
                          isSelected ? 'font-bold text-on-primary-container' : 'text-on-surface-variant'
                        }`}
                      >
                        {s.label}
                      </span>
                      <span className="text-xs text-on-surface-variant/70 mt-0.5">
                        {s.subLabel}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </section>
        </div>

        {/* Form Action */}
        <div className="pt-8 border-t border-border flex justify-end">
          <button
            type="submit"
            className="w-full sm:w-auto px-8 py-4 bg-primary text-on-primary rounded-xl font-button-text text-button-text shadow-md hover:bg-[#5e4700] hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-2 group active:scale-95"
          >
            <span>Buat Rencana</span>
            <span className="material-symbols-outlined text-[20px] group-hover:translate-x-1 transition-transform">
              arrow_forward
            </span>
          </button>
        </div>
      </div>
    </form>
  );
}

