'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTripPlanner } from '../../../context/TripPlannerContext';
import { StepProgressBar } from '../../../components/planner/StepProgressBar';
import { TimelineView } from '../../../components/itinerary/TimelineView';
import { BudgetSummaryCard } from '../../../components/itinerary/BudgetSummaryCard';

export default function ItineraryPage() {
  const router = useRouter();
  const {
    activeItinerary,
    buildItineraryFromCurrentSelection,
    saveTrip,
  } = useTripPlanner();

  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    if (!activeItinerary) {
      buildItineraryFromCurrentSelection();
    }
  }, [activeItinerary]);

  const itinerary = activeItinerary || buildItineraryFromCurrentSelection();

  const handleSave = () => {
    saveTrip(itinerary);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      router.push('/my-trip');
    }, 1000);
  };

  return (
    <div className="max-w-container-max mx-auto px-margin-mobile lg:px-margin-desktop py-8 sm:py-12 space-y-8">
      {/* Step 3 Progress */}
      <StepProgressBar currentStep={3} />

      {/* Header Banner */}
      <div className="bg-surface rounded-[24px] border border-border p-6 sm:p-8 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-container text-on-primary-container font-label-sm text-xs font-bold mb-2">
            <span className="material-symbols-outlined text-[16px]">verified</span>
            <span>Rekomendasi AI Terpilih</span>
          </div>
          <h1 className="font-headline-md text-2xl sm:text-4xl font-bold text-on-surface">
            {itinerary.title}
          </h1>
          <p className="font-body-md text-sm sm:text-base text-on-surface-variant mt-1">
            {itinerary.timeline.length} Titik Agenda • Estimasi Total Rp{itinerary.budget.total.toLocaleString('id-ID')}
          </p>
        </div>

        {/* Quick action buttons */}
        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
          <Link href="/plan/map" className="flex-1 md:flex-none">
            <button
              type="button"
              className="w-full md:w-auto px-4 py-3 rounded-xl border border-border hover:border-primary/50 bg-surface text-on-surface font-button-text text-sm font-semibold flex items-center justify-center gap-1.5 transition-colors"
            >
              <span className="material-symbols-outlined text-[18px] text-primary">map</span>
              <span>Peta Rute</span>
            </button>
          </Link>

          <Link href="/plan/replan" className="flex-1 md:flex-none">
            <button
              type="button"
              className="w-full md:w-auto px-4 py-3 rounded-xl border border-border hover:border-primary/50 bg-surface text-on-surface font-button-text text-sm font-semibold flex items-center justify-center gap-1.5 transition-colors"
            >
              <span className="material-symbols-outlined text-[18px] text-primary">tune</span>
              <span>Sesuaikan</span>
            </button>
          </Link>

          <button
            type="button"
            onClick={handleSave}
            className="w-full md:w-auto px-6 py-3 rounded-xl bg-primary-container text-on-primary-container hover:bg-primary hover:text-on-primary font-button-text font-bold text-sm transition-all shadow-sm flex items-center justify-center gap-2 active:scale-95"
          >
            <span className="material-symbols-outlined text-[18px]">
              {savedSuccess ? 'check_circle' : 'bookmark'}
            </span>
            <span>{savedSuccess ? 'Tersimpan!' : 'Simpan Trip'}</span>
          </button>
        </div>
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Timeline (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-border">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-[22px]">event_note</span>
              <h2 className="font-section-title text-xl font-bold text-on-surface">
                Timeline Agenda
              </h2>
            </div>
            <span className="font-label-sm text-xs text-on-surface-variant bg-surface-container px-3 py-1 rounded-full font-medium">
              {itinerary.timeline.length} Kegiatan
            </span>
          </div>

          <TimelineView timeline={itinerary.timeline} />
        </div>

        {/* Right Column: Budget Breakdown & Tips (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <BudgetSummaryCard budget={itinerary.budget} />

          {/* Quick AI Tip card */}
          <div className="bg-surface rounded-[24px] p-6 border border-border shadow-sm space-y-3">
            <div className="flex items-center gap-2 text-primary font-bold">
              <span className="material-symbols-outlined text-[20px]">lightbulb</span>
              <h3 className="font-section-title text-base font-bold text-on-surface">
                Tips Perjalanan Lokal
              </h3>
            </div>
            <p className="font-body-md text-xs sm:text-sm text-on-surface-variant leading-relaxed">
              Mulai perjalanan tepat waktu di pagi hari untuk menghindari terik matahari pesisir. Jangan lupa siapkan uang receh tunai untuk infaq dan parkir di area Kota Tua dan Makam.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

