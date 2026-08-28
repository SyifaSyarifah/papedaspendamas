'use client';

import React from 'react';
import { Destination } from '../../types/destination';

interface RouteFloatingCardProps {
  destinations: Destination[];
  totalDistanceKm?: number;
  totalMinutes?: number;
}

export function RouteFloatingCard({
  destinations,
  totalDistanceKm = 28.5,
  totalMinutes = 35,
}: RouteFloatingCardProps) {
  const handleOpenGoogleMaps = () => {
    if (destinations.length === 0) return;
    const waypoints = destinations.map((d) => `${d.latitude},${d.longitude}`).join('/');
    const url = `https://www.google.com/maps/dir/${waypoints}`;
    window.open(url, '_blank');
  };

  return (
    <div className="bg-surface/95 backdrop-blur-xl border border-border shadow-2xl rounded-2xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 max-w-2xl mx-auto">
      <div className="flex flex-col gap-2 w-full md:w-auto">
        <div className="flex items-center gap-2">
          <span className="font-label-sm text-xs font-bold px-2.5 py-0.5 rounded-full bg-primary-container text-on-primary-container">
            Rute Terpilih
          </span>
          <span className="font-body-md text-xs text-on-surface-variant">
            {totalDistanceKm} km • {totalMinutes} mnt di jalan
          </span>
        </div>

        {/* Sequential Route Flow */}
        <div className="flex items-center gap-2 overflow-x-auto py-1 no-scrollbar max-w-full">
          {destinations.map((dest, i) => (
            <React.Fragment key={dest.id}>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-surface-container-low border border-border shrink-0 text-xs font-medium text-on-surface">
                <span className="w-4 h-4 rounded-full bg-primary text-on-primary font-bold text-[10px] flex items-center justify-center">
                  {i + 1}
                </span>
                <span className="line-clamp-1 max-w-[110px]">{dest.name.split(' ')[0]}</span>
              </div>
              {i < destinations.length - 1 && (
                <span className="material-symbols-outlined text-[16px] text-on-surface-variant shrink-0">
                  arrow_forward
                </span>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      <button
        type="button"
        onClick={handleOpenGoogleMaps}
        className="w-full md:w-auto px-5 py-3 bg-primary-container hover:bg-primary text-on-primary-container hover:text-on-primary font-button-text font-bold text-xs sm:text-sm rounded-xl transition-all shadow-xs flex items-center justify-center gap-2 shrink-0 active:scale-95"
      >
        <span className="material-symbols-outlined text-[18px]">near_me</span>
        <span>Buka Google Maps</span>
      </button>
    </div>
  );
}
