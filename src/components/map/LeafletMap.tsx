'use client';

import React, { useEffect, useState } from 'react';
import { Destination, CulinarySpot } from '../../types/destination';

interface LeafletMapProps {
  destinations?: Destination[];
  culinary?: CulinarySpot[];
  center?: [number, number];
  zoom?: number;
  height?: string;
}

export function LeafletMap({
  destinations = [],
  culinary = [],
  center = [-7.1600, 112.6450], // Gresik city center default
  zoom = 13,
  height = '480px',
}: LeafletMapProps) {
  const [isMounted, setIsMounted] = useState(false);
  const mapContainerId = 'gatra-leaflet-map-container';

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    let mapInstance: any = null;

    // Dynamically import Leaflet only on client
    import('leaflet').then((L) => {
      const container = document.getElementById(mapContainerId);
      if (!container) return;

      // Clear previous map if container already initialized
      if ((container as any)._leaflet_id) {
        container.innerHTML = '';
        (container as any)._leaflet_id = null;
      }

      const initialCenter =
        destinations.length > 0
          ? [destinations[0].latitude, destinations[0].longitude]
          : center;

      mapInstance = L.map(mapContainerId, {
        center: initialCenter as [number, number],
        zoom: zoom,
        zoomControl: true,
      });

      // Add OpenStreetMap tile layer
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 18,
      }).addTo(mapInstance);

      const latLngs: [number, number][] = [];

      // 1. Add Destination Markers
      destinations.forEach((dest, index) => {
        const markerPos: [number, number] = [dest.latitude, dest.longitude];
        latLngs.push(markerPos);

        const customIcon = L.divIcon({
          className: 'custom-leaflet-marker',
          html: `<span>${String.fromCharCode(65 + index)}</span>`,
          iconSize: [34, 34],
          iconAnchor: [17, 17],
          popupAnchor: [0, -18],
        });

        const marker = L.marker(markerPos, { icon: customIcon }).addTo(mapInstance);

        const popupContent = `
          <div style="font-family: 'Plus Jakarta Sans', sans-serif; min-width: 180px; padding: 4px;">
            <div style="font-size: 11px; font-weight: 700; color: #B8870A; text-transform: uppercase; margin-bottom: 2px;">
              Destinasi ${String.fromCharCode(65 + index)}
            </div>
            <div style="font-size: 14px; font-weight: 700; color: #252525; margin-bottom: 4px;">
              ${dest.name}
            </div>
            <div style="font-size: 12px; color: #6B6B6B; margin-bottom: 6px;">
              ${dest.categoryLabel} • ${dest.priceLabel}
            </div>
            <div style="font-size: 11px; background: #FFF3C4; color: #7A5B0B; padding: 3px 6px; border-radius: 6px; font-weight: 600;">
              Durasi: ±${dest.recommendedDurationMinutes} mnt
            </div>
          </div>
        `;

        marker.bindPopup(popupContent);
      });

      // 2. Add Culinary Markers
      culinary.forEach((food) => {
        const foodPos: [number, number] = [food.latitude, food.longitude];
        latLngs.push(foodPos);

        const foodIcon = L.divIcon({
          className: 'custom-leaflet-marker custom-leaflet-marker-food',
          html: `<span class="material-symbols-outlined" style="font-size: 18px; line-height: 1; display: flex; align-items: center; justify-content: center;">restaurant</span>`,
          iconSize: [34, 34],
          iconAnchor: [17, 17],
          popupAnchor: [0, -18],
        });

        const marker = L.marker(foodPos, { icon: foodIcon }).addTo(mapInstance);

        const popupContent = `
          <div style="font-family: 'Plus Jakarta Sans', sans-serif; min-width: 180px; padding: 4px;">
            <div style="font-size: 11px; font-weight: 700; color: #C2410C; text-transform: uppercase; margin-bottom: 2px;">
              Kuliner & UMKM
            </div>
            <div style="font-size: 14px; font-weight: 700; color: #252525; margin-bottom: 4px;">
              ${food.name}
            </div>
            <div style="font-size: 12px; color: #6B6B6B; margin-bottom: 6px;">
              ${food.priceLabel}
            </div>
            <div style="font-size: 11px; background: #FFEDD5; color: #9A3412; padding: 3px 6px; border-radius: 6px; font-weight: 600;">
              ${food.distanceFromItinerary || 'Pusat Kota'}
            </div>
          </div>
        `;

        marker.bindPopup(popupContent);
      });

      // 3. Draw Polyline Route
      if (latLngs.length > 1) {
        L.polyline(latLngs, {
          color: '#E8B845',
          weight: 4,
          opacity: 0.85,
          dashArray: '8, 8',
          lineJoin: 'round',
        }).addTo(mapInstance);

        // Fit map to bounds
        const bounds = L.latLngBounds(latLngs);
        mapInstance.fitBounds(bounds, { padding: [50, 50] });
      }
    });

    return () => {
      if (mapInstance) {
        mapInstance.remove();
      }
    };
  }, [isMounted, destinations, culinary, center, zoom]);

  if (!isMounted) {
    return (
      <div
        className="w-full bg-[#EAE5D9] rounded-3xl animate-pulse flex items-center justify-center text-text-muted text-sm"
        style={{ height }}
      >
        Memuat Peta Gresik...
      </div>
    );
  }

  return (
    <div className="relative w-full rounded-3xl overflow-hidden border border-border shadow-soft z-0">
      <div id={mapContainerId} style={{ height, width: '100%' }} />
    </div>
  );
}
