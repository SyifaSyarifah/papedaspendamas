'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useTripPlanner } from '../../../context/TripPlannerContext';
import { GoogleMap } from '../../../components/map/GoogleMap';
import { RouteFloatingCard } from '../../../components/map/RouteFloatingCard';

export default function MapPage() {
  const { activeItinerary, buildItineraryFromCurrentSelection } = useTripPlanner();
  const itinerary = activeItinerary || buildItineraryFromCurrentSelection();
  const [selectedLocationId, setSelectedLocationId] = useState<string | null>(null);

  // Generate Google Maps Directions link for all waypoints in the trip
  const handleOpenAllInGoogleMaps = () => {
    if (!itinerary.selectedDestinations || itinerary.selectedDestinations.length === 0) return;
    
    const waypoints = itinerary.selectedDestinations
      .map((d) => `${d.latitude},${d.longitude}`)
      .join('/');
    
    const googleMapsUrl = `https://www.google.com/maps/dir/${waypoints}`;
    window.open(googleMapsUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="flex flex-col lg:flex-row h-[calc(100vh-80px)] overflow-hidden bg-background">
      {/* Left Sidebar on Desktop */}
      <div className="w-full lg:w-[420px] border-r border-border bg-surface flex flex-col shrink-0 h-auto lg:h-full z-10 shadow-sm overflow-y-auto">
        {/* Sidebar Header */}
        <div className="p-4 sm:p-6 border-b border-border space-y-3 shrink-0 bg-surface">
          <div className="flex items-center justify-between">
            <Link
              href="/plan/itinerary"
              className="inline-flex items-center gap-1.5 font-label-sm text-xs font-bold text-on-surface-variant hover:text-primary transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">arrow_back</span>
              <span>Kembali ke Jadwal</span>
            </Link>

            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 font-label-sm text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-primary-soft text-on-primary-container border border-primary/20">
                <span className="material-symbols-outlined text-[14px] text-primary">map</span>
                Google Maps API
              </span>
              <span className="font-label-sm text-xs font-bold px-3 py-0.5 rounded-full bg-primary-container text-on-primary-container">
                {itinerary.totalDistanceKm || 28.5} km
              </span>
            </div>
          </div>

          <div>
            <h1 className="font-section-title text-xl font-bold text-on-surface flex items-center gap-2">
              <span>Peta & Timeline Rute</span>
            </h1>
            <p className="font-body-md text-xs text-on-surface-variant mt-0.5">
              Klik lokasi pada list untuk fokus di Google Maps
            </p>
          </div>

          {/* Direct Google Maps Navigation Button */}
          <button
            type="button"
            onClick={handleOpenAllInGoogleMaps}
            className="w-full py-2.5 px-4 bg-[#4285F4] hover:bg-[#3367D6] text-white font-button-text font-bold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 active:scale-95"
          >
            <span className="material-symbols-outlined text-[18px]">open_in_new</span>
            <span>Buka Navigasi Rute di App Google Maps</span>
          </button>
        </div>

        {/* Sidebar Timeline Items */}
        <div className="p-4 sm:p-6 space-y-4 flex-1">
          {itinerary.timeline.map((slot, index) => {
            const isDeparture = slot.type === 'departure';
            const isCulinary = slot.type === 'culinary';
            const isSelected = selectedLocationId === slot.id;

            return (
              <div
                key={slot.id}
                onClick={() => setSelectedLocationId(slot.id)}
                className={`relative pl-7 cursor-pointer group transition-all`}
              >
                {/* Node marker */}
                <div
                  className={`absolute left-0 top-1 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shadow-xs transition-transform group-hover:scale-110 ${
                    isDeparture
                      ? 'bg-tertiary text-on-tertiary'
                      : isCulinary
                      ? 'bg-secondary text-on-secondary'
                      : 'bg-primary text-on-primary'
                  } ${isSelected ? 'ring-4 ring-primary/30 scale-125' : ''}`}
                >
                  {isDeparture ? 'A' : index}
                </div>

                {/* Node connection line */}
                {index < itinerary.timeline.length - 1 && (
                  <div className="absolute left-2.5 top-6 bottom-0 w-0.5 bg-border -mb-4" />
                )}

                <div
                  className={`border rounded-xl p-3 space-y-1 transition-all ${
                    isSelected
                      ? 'bg-primary-soft/40 border-primary shadow-xs'
                      : 'bg-surface-container-low/70 border-border/80 hover:border-primary/50 hover:bg-surface'
                  }`}
                >
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-label-sm font-semibold text-primary">
                      {slot.time}
                    </span>
                    <span className="font-label-sm text-on-surface-variant text-[11px]">
                      {slot.durationMinutes} mnt
                    </span>
                  </div>
                  <h4 className="font-section-title text-sm font-bold text-on-surface line-clamp-1 group-hover:text-primary transition-colors">
                    {slot.title}
                  </h4>
                  <p className="font-body-md text-[11px] text-on-surface-variant line-clamp-1">
                    {slot.description}
                  </p>
                </div>

                {slot.travelTimeToNextMinutes && (
                  <div className="py-2 flex items-center gap-1.5 text-[11px] font-label-sm text-on-surface-variant">
                    <span className="material-symbols-outlined text-[14px] text-primary">directions_car</span>
                    <span>{slot.travelTimeToNextMinutes} menit ({slot.distanceToNextKm} km)</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Sidebar Bottom Actions */}
        <div className="p-4 border-t border-border bg-surface shrink-0 space-y-2">
          <Link href="/plan/itinerary">
            <button
              type="button"
              className="w-full py-3 px-4 bg-primary text-on-primary font-button-text font-bold text-sm rounded-xl shadow-sm hover:bg-[#5e4700] transition-all flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-[18px]">receipt_long</span>
              <span>Lihat Detail Biaya & Jadwal</span>
            </button>
          </Link>
        </div>
      </div>

      {/* Right Google Map Viewport */}
      <div className="flex-1 relative h-[500px] lg:h-full">
        <GoogleMap
          destinations={itinerary.selectedDestinations}
          culinary={itinerary.selectedCulinary}
          height="100%"
          selectedId={selectedLocationId}
          onMarkerClick={(id) => setSelectedLocationId(id)}
        />

        {/* Floating Route Card overlay */}
        <div className="absolute bottom-4 left-4 right-4 lg:bottom-6 lg:left-6 lg:right-6 z-[990] pointer-events-auto">
          <RouteFloatingCard
            destinations={itinerary.selectedDestinations}
            totalDistanceKm={itinerary.totalDistanceKm}
            totalMinutes={52}
          />
        </div>
      </div>
    </div>
  );
}
