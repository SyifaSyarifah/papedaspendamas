'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTripPlanner } from '../../../context/TripPlannerContext';
import { StepProgressBar } from '../../../components/planner/StepProgressBar';
import { DestinationCard } from '../../../components/explore/DestinationCard';
import { LoadingState } from '../../../components/common/LoadingState';

export default function RecommendationPage() {
  const router = useRouter();
  const {
    preferences,
    recommendedDestinations,
    selectedDestinations,
    toggleDestinationSelection,
    buildItineraryFromCurrentSelection,
    isGenerating,
    setIsGenerating,
  } = useTripPlanner();

  const [loadingComplete, setLoadingComplete] = useState(!isGenerating);
  const [activeFilter, setActiveFilter] = useState<string>('all');

  const filterTabs = [
    { id: 'all', label: 'Semua Cocok' },
    { id: 'sejarah', label: 'Sejarah & Budaya' },
    { id: 'kuliner', label: 'Kuliner' },
    { id: 'alam', label: 'Alam & Pesisir' },
    { id: 'religi', label: 'Religi' },
  ];

  useEffect(() => {
    if (isGenerating) {
      const timer = setTimeout(() => {
        setIsGenerating(false);
        setLoadingComplete(true);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [isGenerating, setIsGenerating]);

  const handleBuildItinerary = () => {
    buildItineraryFromCurrentSelection();
    router.push('/plan/itinerary');
  };

  const filteredList =
    activeFilter === 'all'
      ? recommendedDestinations
      : recommendedDestinations.filter((d) => d.category === activeFilter);

  if (!loadingComplete) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16">
        <LoadingState onComplete={() => setLoadingComplete(true)} />
      </div>
    );
  }

  return (
    <div className="max-w-container-max mx-auto px-margin-mobile lg:px-margin-desktop py-8 sm:py-12 space-y-8">
      {/* Step 2 Progress */}
      <StepProgressBar currentStep={2} />

      {/* Header Section */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2 text-primary font-bold">
          <span className="material-symbols-outlined text-[24px]">auto_awesome</span>
          <h1 className="font-headline-md text-2xl sm:text-3xl text-on-background">
            Rekomendasi untukmu
          </h1>
        </div>
        <p className="font-body-md text-text-secondary text-sm sm:text-base">
          {recommendedDestinations.length} tempat yang paling sesuai dengan budget Rp{preferences.budget.toLocaleString('id-ID')} dan minatmu.
        </p>
      </div>

      {/* Filter Chips */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
        {filterTabs.map((tab) => {
          const isActive = activeFilter === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveFilter(tab.id)}
              className={`flex-shrink-0 px-4 py-2 rounded-full font-label-sm text-xs sm:text-sm transition-all active:scale-95 border ${
                isActive
                  ? 'bg-secondary-container text-on-secondary-container font-bold border-primary-container shadow-xs'
                  : 'bg-surface text-on-surface-variant border-border hover:bg-surface-container'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Destination Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredList.map((dest) => {
          const isSelected = selectedDestinations.some((d) => d.id === dest.id);

          return (
            <DestinationCard
              key={dest.id}
              destination={dest}
              showMatchScore={true}
              isSelected={isSelected}
              onToggleSelect={toggleDestinationSelection}
            />
          );
        })}
      </div>

      {/* Bottom Sticky Action Bar */}
      <div className="sticky bottom-20 md:bottom-8 z-30 bg-surface/95 backdrop-blur-xl rounded-[24px] border border-border p-4 sm:p-5 shadow-float flex flex-col sm:flex-row items-center justify-between gap-4 max-w-2xl mx-auto">
        <div className="text-center sm:text-left">
          <div className="text-xs font-label-sm text-text-secondary">Pilihan Destinasi</div>
          <div className="font-headline-md text-base sm:text-lg font-bold text-on-surface">
            {selectedDestinations.length} tempat terpilih untuk jadwal
          </div>
        </div>

        <button
          type="button"
          onClick={handleBuildItinerary}
          className="w-full sm:w-auto px-8 py-3.5 bg-primary-container text-on-primary-container hover:bg-primary hover:text-on-primary font-button-text font-bold text-sm sm:text-base rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 active:scale-95"
        >
          <span className="material-symbols-outlined text-[20px]">auto_awesome</span>
          <span>Buat Itinerary Otomatis</span>
        </button>
      </div>
    </div>
  );
}

