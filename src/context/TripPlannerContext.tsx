'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserPreferences } from '../types/planner';
import { Destination, CulinarySpot } from '../types/destination';
import { Itinerary, ReplanningDiff } from '../types/itinerary';
import { rankDestinations } from '../lib/recommendationEngine';
import { generateItinerary } from '../lib/itineraryGenerator';
import { GRESIK_DESTINATIONS } from '../data/gresikDestinations';
import { GRESIK_CULINARY } from '../data/gresikCulinary';

export const DEFAULT_PREFERENCES: UserPreferences = {
  startLocation: 'Surabaya',
  budget: 150000,
  duration: '1_day',
  interests: ['sejarah', 'kuliner'],
  transport: 'motor',
  travelStyle: 'santai',
  groupSize: 1,
};

interface TripPlannerContextType {
  preferences: UserPreferences;
  setPreferences: React.Dispatch<React.SetStateAction<UserPreferences>>;
  updatePreferences: (partial: Partial<UserPreferences>) => void;
  resetPreferences: () => void;
  recommendedDestinations: Destination[];
  selectedDestinations: Destination[];
  setSelectedDestinations: React.Dispatch<React.SetStateAction<Destination[]>>;
  toggleDestinationSelection: (dest: Destination) => void;
  activeItinerary: Itinerary | null;
  setActiveItinerary: React.Dispatch<React.SetStateAction<Itinerary | null>>;
  buildItineraryFromCurrentSelection: () => Itinerary;
  savedTrips: Itinerary[];
  saveTrip: (itinerary: Itinerary) => void;
  deleteSavedTrip: (tripId: string) => void;
  duplicateSavedTrip: (tripId: string) => void;
  replanningDiff: ReplanningDiff | null;
  setReplanningDiff: React.Dispatch<React.SetStateAction<ReplanningDiff | null>>;
  applyReplanning: () => void;
  isGenerating: boolean;
  setIsGenerating: React.Dispatch<React.SetStateAction<boolean>>;
}

const TripPlannerContext = createContext<TripPlannerContextType | undefined>(undefined);

export function TripPlannerProvider({ children }: { children: React.ReactNode }) {
  const [preferences, setPreferences] = useState<UserPreferences>(DEFAULT_PREFERENCES);
  const [recommendedDestinations, setRecommendedDestinations] = useState<Destination[]>([]);
  const [selectedDestinations, setSelectedDestinations] = useState<Destination[]>([]);
  const [activeItinerary, setActiveItinerary] = useState<Itinerary | null>(null);
  const [savedTrips, setSavedTrips] = useState<Itinerary[]>([]);
  const [replanningDiff, setReplanningDiff] = useState<ReplanningDiff | null>(null);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  // Load initial saved trips or compute recommendations when preferences change
  useEffect(() => {
    const scored = rankDestinations(preferences);
    setRecommendedDestinations(scored);
    
    // Setiap kali preferensi berubah (termasuk dari AI Chat), 
    // reset pilihan destinasi agar mengambil top 3 dari rekomendasi yang baru,
    // jangan biarkan sisa pilihan dari preferensi lama (default) tertinggal.
    setSelectedDestinations(scored.slice(0, 3));
  }, [preferences]);

  // Load saved trips from localStorage if available
  useEffect(() => {
    try {
      const stored = localStorage.getItem('gatra_saved_trips');
      if (stored) {
        setSavedTrips(JSON.parse(stored));
      } else {
        // Initial sample saved trip
        const sampleTrip = generateItinerary(
          DEFAULT_PREFERENCES,
          [GRESIK_DESTINATIONS[0], GRESIK_DESTINATIONS[1], GRESIK_DESTINATIONS[4]],
          [GRESIK_CULINARY[0]]
        );
        sampleTrip.id = 'sample-trip-1';
        sampleTrip.title = 'Wisata Heritage Gresik 1 Hari';
        sampleTrip.createdAt = '23 Agustus 2026';
        setSavedTrips([sampleTrip]);
      }
    } catch (e) {
      console.error('Error loading saved trips', e);
    }
  }, []);

  const updatePreferences = (partial: Partial<UserPreferences>) => {
    setPreferences((prev) => {
      const updated = { ...prev, ...partial };
      return updated;
    });
  };

  const resetPreferences = () => {
    setPreferences(DEFAULT_PREFERENCES);
    const scored = rankDestinations(DEFAULT_PREFERENCES);
    setSelectedDestinations(scored.slice(0, 3));
    setActiveItinerary(null);
  };

  const toggleDestinationSelection = (dest: Destination) => {
    setSelectedDestinations((prev) => {
      const exists = prev.some((d) => d.id === dest.id);
      if (exists) {
        return prev.filter((d) => d.id !== dest.id);
      } else {
        return [...prev, dest];
      }
    });
  };

  const buildItineraryFromCurrentSelection = (): Itinerary => {
    let list = selectedDestinations.length > 0 ? selectedDestinations : recommendedDestinations.slice(0, 3);
    
    // Cek apakah ada spot kuliner yang terpilih/direkomendasikan
    const culinaryIndex = list.findIndex((d) => d.category === 'kuliner');
    let chosenCulinary = GRESIK_CULINARY[0]; // fallback

    if (culinaryIndex !== -1) {
      const match = GRESIK_CULINARY.find((c) => c.id === list[culinaryIndex].id);
      if (match) {
        chosenCulinary = match;
        // Hapus dari list destinasi agar tidak dobel (karena sudah masuk slot makan siang/kuliner khusus)
        // Namun jika ini satu-satunya destinasi, biarkan saja agar jadwal tidak kosong
        if (list.length > 1) {
          list = list.filter((_, idx) => idx !== culinaryIndex);
        }
      }
    }

    const itinerary = generateItinerary(
      preferences,
      list,
      [chosenCulinary]
    );
    setActiveItinerary(itinerary);
    return itinerary;
  };

  const saveTrip = (itinerary: Itinerary) => {
    const updated = [itinerary, ...savedTrips.filter((t) => t.id !== itinerary.id)];
    setSavedTrips(updated);
    try {
      localStorage.setItem('gatra_saved_trips', JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to save trip to storage', e);
    }
  };

  const deleteSavedTrip = (tripId: string) => {
    const updated = savedTrips.filter((t) => t.id !== tripId);
    setSavedTrips(updated);
    try {
      localStorage.setItem('gatra_saved_trips', JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to delete trip from storage', e);
    }
  };

  const duplicateSavedTrip = (tripId: string) => {
    const target = savedTrips.find((t) => t.id === tripId);
    if (!target) return;
    const duplicated: Itinerary = {
      ...target,
      id: `trip-${Date.now()}`,
      title: `${target.title} (Salinan)`,
      createdAt: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
    };
    saveTrip(duplicated);
  };

  const applyReplanning = () => {
    if (!replanningDiff || !activeItinerary) return;

    if (replanningDiff.updatedItinerary) {
      setActiveItinerary(replanningDiff.updatedItinerary);
      // Jika ini adalah trip yang sudah tersimpan sebelumnya, otomatis update penyimpanannya
      const exists = savedTrips.some((t) => t.id === activeItinerary.id);
      if (exists) {
        saveTrip(replanningDiff.updatedItinerary);
      }
    }
    setReplanningDiff(null);
  };

  return (
    <TripPlannerContext.Provider
      value={{
        preferences,
        setPreferences,
        updatePreferences,
        resetPreferences,
        recommendedDestinations,
        selectedDestinations,
        setSelectedDestinations,
        toggleDestinationSelection,
        activeItinerary,
        setActiveItinerary,
        buildItineraryFromCurrentSelection,
        savedTrips,
        saveTrip,
        deleteSavedTrip,
        duplicateSavedTrip,
        replanningDiff,
        setReplanningDiff,
        applyReplanning,
        isGenerating,
        setIsGenerating,
      }}
    >
      {children}
    </TripPlannerContext.Provider>
  );
}

export function useTripPlanner() {
  const context = useContext(TripPlannerContext);
  if (!context) {
    throw new Error('useTripPlanner must be used within a TripPlannerProvider');
  }
  return context;
}
