'use client';

import React, { useState, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { GRESIK_DESTINATIONS } from '../../data/gresikDestinations';
import { GRESIK_CULINARY } from '../../data/gresikCulinary';
import { DestinationCard } from '../../components/explore/DestinationCard';
import { FoodCard } from '../../components/explore/FoodCard';
import { useTripPlanner } from '../../context/TripPlannerContext';

function ExploreContent() {
  const searchParams = useSearchParams();
  const initialTab = searchParams.get('tab') === 'culinary' ? 'culinary' : 'destination';
  const [activeTab, setActiveTab] = useState<'destination' | 'culinary'>(initialTab);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const { selectedDestinations, toggleDestinationSelection } = useTripPlanner();

  const categories = [
    { id: 'all', label: 'Semua Kategori' },
    { id: 'sejarah', label: 'Sejarah & Budaya' },
    { id: 'religi', label: 'Wisata Religi' },
    { id: 'alam', label: 'Alam & Pesisir' },
    { id: 'keluarga', label: 'Keluarga & Rekreasi' },
    { id: 'edukasi', label: 'Edukasi' },
  ];

  const filteredDestinations = useMemo(() => {
    return GRESIK_DESTINATIONS.filter((dest) => {
      const matchSearch =
        dest.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dest.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dest.address.toLowerCase().includes(searchQuery.toLowerCase());

      const matchCategory =
        selectedCategory === 'all' || dest.category === selectedCategory;

      return matchSearch && matchCategory;
    });
  }, [searchQuery, selectedCategory]);

  const filteredCulinary = useMemo(() => {
    return GRESIK_CULINARY.filter((food) => {
      const matchSearch =
        food.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        food.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        food.popularMenu.some((m) => m.toLowerCase().includes(searchQuery.toLowerCase()));

      return matchSearch;
    });
  }, [searchQuery]);

  return (
    <div className="max-w-container-max mx-auto px-margin-mobile lg:px-margin-desktop py-8 sm:py-12 space-y-8">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-primary-container/30 text-on-primary-container font-label-sm text-xs font-bold">
          <span className="material-symbols-outlined text-[16px]">explore</span>
          <span>Katalog Pariwisata & Kuliner</span>
        </div>
        <h1 className="font-headline-md text-2xl sm:text-4xl font-bold text-on-surface">
          Jelajahi Wisata Kabupaten Gresik
        </h1>
        <p className="font-body-md text-sm sm:text-base text-on-surface-variant">
          Temukan cagar budaya bersejarah, keindahan alam pesisir utara, dan sajian kuliner legendaris.
        </p>
      </div>

      {/* Search and Tabs */}
      <div className="max-w-2xl mx-auto space-y-4">
        {/* Search Input */}
        <div className="relative flex items-center">
          <span className="material-symbols-outlined text-on-surface-variant absolute left-4 text-[22px]">
            search
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari destinasi, kuliner krawu, bandeng, atau lokasi..."
            className="w-full pl-12 pr-4 py-3.5 rounded-full bg-surface border border-border text-sm sm:text-base text-on-surface shadow-xs focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all font-body-md placeholder:text-text-secondary/60"
          />
        </div>

        {/* Tab Switcher */}
        <div className="flex justify-center">
          <div className="inline-flex p-1.5 rounded-full bg-surface-container-low border border-border shadow-xs">
            <button
              type="button"
              onClick={() => setActiveTab('destination')}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-full font-label-sm text-sm font-semibold transition-all ${
                activeTab === 'destination'
                  ? 'bg-primary-container text-on-primary-container shadow-xs font-bold'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">museum</span>
              <span>Destinasi ({GRESIK_DESTINATIONS.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('culinary')}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-full font-label-sm text-sm font-semibold transition-all ${
                activeTab === 'culinary'
                  ? 'bg-primary-container text-on-primary-container shadow-xs font-bold'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">restaurant</span>
              <span>Kuliner & UMKM ({GRESIK_CULINARY.length})</span>
            </button>
          </div>
        </div>
      </div>

      {/* Category Chips (Visible for Destination tab) */}
      {activeTab === 'destination' && (
        <div className="flex flex-wrap items-center justify-center gap-2.5">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-full font-label-sm text-xs sm:text-sm transition-all active:scale-95 border ${
                  isSelected
                    ? 'bg-primary text-on-primary font-bold border-primary shadow-xs'
                    : 'bg-surface text-on-surface-variant border-border hover:bg-surface-container'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      )}

      {/* Grid Content */}
      {activeTab === 'destination' ? (
        <div>
          {filteredDestinations.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredDestinations.map((dest) => {
                const isSelected = selectedDestinations.some((d) => d.id === dest.id);
                return (
                  <DestinationCard
                    key={dest.id}
                    destination={dest}
                    isSelected={isSelected}
                    onToggleSelect={toggleDestinationSelection}
                  />
                );
              })}
            </div>
          ) : (
            <div className="text-center py-16 bg-surface rounded-3xl border border-border p-8">
              <span className="material-symbols-outlined text-4xl text-on-surface-variant mx-auto mb-2">
                search_off
              </span>
              <h3 className="font-section-title text-lg font-bold text-on-surface mb-1">
                Destinasi tidak ditemukan
              </h3>
              <p className="font-body-md text-sm text-on-surface-variant">
                Coba gunakan kata kunci pencarian yang lain atau pilih semua kategori.
              </p>
            </div>
          )}
        </div>
      ) : (
        <div>
          {filteredCulinary.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCulinary.map((food) => (
                <FoodCard key={food.id} food={food} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-surface rounded-3xl border border-border p-8">
              <span className="material-symbols-outlined text-4xl text-on-surface-variant mx-auto mb-2">
                restaurant
              </span>
              <h3 className="font-section-title text-lg font-bold text-on-surface mb-1">
                Kuliner tidak ditemukan
              </h3>
              <p className="font-body-md text-sm text-on-surface-variant">
                Coba gunakan kata kunci pencarian yang lain.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function ExplorePage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <ExploreContent />
    </Suspense>
  );
}

