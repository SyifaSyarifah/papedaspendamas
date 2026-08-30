'use client';

import React, { useEffect, useState, useRef } from 'react';
import { Destination, CulinarySpot } from '../../types/destination';

export type MapType = 'roadmap' | 'satellite' | 'terrain';

interface GoogleMapProps {
  destinations?: Destination[];
  culinary?: CulinarySpot[];
  center?: [number, number];
  zoom?: number;
  height?: string;
  selectedId?: string | null;
  onMarkerClick?: (id: string) => void;
  initialMapType?: MapType;
}

export function GoogleMap({
  destinations = [],
  culinary = [],
  center = [-7.1600, 112.6450], // Gresik City Center
  zoom = 13,
  height = '100%',
  selectedId,
  onMarkerClick,
  initialMapType = 'roadmap',
}: GoogleMapProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [mapType, setMapType] = useState<MapType>(initialMapType);
  const mapRef = useRef<any>(null);
  const tileLayerRef = useRef<any>(null);
  const markersRef = useRef<{ [key: string]: any }>({});
  const mapContainerId = 'gatra-google-map-container';

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Get tile layer URL based on Google Maps type
  const getGoogleTileUrl = (type: MapType) => {
    switch (type) {
      case 'satellite':
        return 'https://mt{s}.google.com/vt/lyrs=y&x={x}&y={y}&z={z}';
      case 'terrain':
        return 'https://mt{s}.google.com/vt/lyrs=p&x={x}&y={y}&z={z}';
      case 'roadmap':
      default:
        return 'https://mt{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}';
    }
  };

  useEffect(() => {
    if (!isMounted) return;

    // Dynamically import Leaflet client-side
    import('leaflet').then((L) => {
      const container = document.getElementById(mapContainerId);
      if (!container) return;

      // Clean up existing container if previously initialized
      if ((container as any)._leaflet_id) {
        container.innerHTML = '';
        (container as any)._leaflet_id = null;
      }

      const initialCenter =
        destinations.length > 0
          ? [destinations[0].latitude, destinations[0].longitude]
          : center;

      const map = L.map(mapContainerId, {
        center: initialCenter as [number, number],
        zoom: zoom,
        zoomControl: false, // We'll add custom control or clean UI
      });

      L.control.zoom({ position: 'bottomright' }).addTo(map);
      mapRef.current = map;

      // Google Maps Tile Layer with subdomains 0, 1, 2, 3
      const googleTileLayer = L.tileLayer(getGoogleTileUrl(mapType), {
        subdomains: ['0', '1', '2', '3'],
        attribution:
          '&copy; <a href="https://maps.google.com" target="_blank" rel="noopener noreferrer">Google Maps</a> | Gatra Gresik',
        maxZoom: 20,
      }).addTo(map);

      tileLayerRef.current = googleTileLayer;

      const latLngs: [number, number][] = [];
      const newMarkers: { [key: string]: any } = {};

      // 1. Destination Markers (Numbered A, B, C...)
      destinations.forEach((dest, index) => {
        const markerPos: [number, number] = [dest.latitude, dest.longitude];
        latLngs.push(markerPos);

        const markerLetter = String.fromCharCode(65 + index);
        const isSelected = selectedId === dest.id;

        const customIcon = L.divIcon({
          className: 'custom-google-marker-wrapper',
          html: `
            <div class="google-pin-container ${isSelected ? 'is-active' : ''}">
              <div class="google-pin-head bg-[#775a00]">
                <span>${markerLetter}</span>
              </div>
              <div class="google-pin-pointer bg-[#775a00]"></div>
              <div class="google-pin-label">${dest.name}</div>
            </div>
          `,
          iconSize: [40, 48],
          iconAnchor: [20, 48],
          popupAnchor: [0, -48],
        });

        const marker = L.marker(markerPos, { icon: customIcon }).addTo(map);

        const googleMapsNavUrl = `https://www.google.com/maps/dir/?api=1&destination=${dest.latitude},${dest.longitude}`;

        const popupContent = `
          <div style="font-family: 'Plus Jakarta Sans', sans-serif; min-width: 220px; padding: 4px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
              <span style="font-size: 10px; font-weight: 800; color: #775a00; background: #FFF3C4; padding: 2px 8px; border-radius: 12px; text-transform: uppercase;">
                Destinasi ${markerLetter}
              </span>
              <span style="font-size: 11px; font-weight: 700; color: #2e7d32; display: flex; align-items: center; gap: 2px;">
                ★ ${dest.rating} (${dest.reviewCount})
              </span>
            </div>
            <div style="font-size: 15px; font-weight: 800; color: #1b1c1c; margin-bottom: 4px; line-height: 1.3;">
              ${dest.name}
            </div>
            <div style="font-size: 12px; color: #6B6B6B; margin-bottom: 8px;">
              ${dest.categoryLabel} • ${dest.priceLabel}
            </div>
            <div style="font-size: 11px; color: #4e4636; background: #f0eded; padding: 6px 8px; border-radius: 8px; margin-bottom: 10px; line-height: 1.4;">
              📍 ${dest.address}
            </div>
            <a href="${googleMapsNavUrl}" target="_blank" rel="noopener noreferrer" 
               style="display: flex; align-items: center; justify-content: center; gap: 6px; background: #4285F4; color: #FFFFFF; font-size: 12px; font-weight: 700; padding: 8px 12px; border-radius: 8px; text-decoration: none; box-shadow: 0 2px 6px rgba(66,133,244,0.3);">
              <span>Buka di Google Maps</span>
              <span style="font-size: 14px;">↗</span>
            </a>
          </div>
        `;

        marker.bindPopup(popupContent);

        marker.on('click', () => {
          if (onMarkerClick) onMarkerClick(dest.id);
        });

        newMarkers[dest.id] = marker;
      });

      // 2. Culinary Markers
      culinary.forEach((food) => {
        const foodPos: [number, number] = [food.latitude, food.longitude];
        latLngs.push(foodPos);
        const isSelected = selectedId === food.id;

        const foodIcon = L.divIcon({
          className: 'custom-google-marker-wrapper',
          html: `
            <div class="google-pin-container is-food ${isSelected ? 'is-active' : ''}">
              <div class="google-pin-head bg-[#006687]">
                <span class="material-symbols-outlined" style="font-size:18px;">restaurant</span>
              </div>
              <div class="google-pin-pointer bg-[#006687]"></div>
              <div class="google-pin-label">${food.name}</div>
            </div>
          `,
          iconSize: [40, 48],
          iconAnchor: [20, 48],
          popupAnchor: [0, -48],
        });

        const marker = L.marker(foodPos, { icon: foodIcon }).addTo(map);

        const googleMapsNavUrl = `https://www.google.com/maps/dir/?api=1&destination=${food.latitude},${food.longitude}`;

        const popupContent = `
          <div style="font-family: 'Plus Jakarta Sans', sans-serif; min-width: 220px; padding: 4px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
              <span style="font-size: 10px; font-weight: 800; color: #006687; background: #c1e8ff; padding: 2px 8px; border-radius: 12px; text-transform: uppercase;">
                Kuliner Gresik
              </span>
              <span style="font-size: 11px; font-weight: 700; color: #2e7d32;">
                ★ ${food.rating}
              </span>
            </div>
            <div style="font-size: 15px; font-weight: 800; color: #1b1c1c; margin-bottom: 4px; line-height: 1.3;">
              ${food.name}
            </div>
            <div style="font-size: 12px; color: #6B6B6B; margin-bottom: 8px;">
              ${food.priceLabel} • ${food.distanceFromItinerary || 'Sekitar Rute'}
            </div>
            <a href="${googleMapsNavUrl}" target="_blank" rel="noopener noreferrer" 
               style="display: flex; align-items: center; justify-content: center; gap: 6px; background: #4285F4; color: #FFFFFF; font-size: 12px; font-weight: 700; padding: 8px 12px; border-radius: 8px; text-decoration: none; box-shadow: 0 2px 6px rgba(66,133,244,0.3);">
              <span>Buka di Google Maps</span>
              <span style="font-size: 14px;">↗</span>
            </a>
          </div>
        `;

        marker.bindPopup(popupContent);

        marker.on('click', () => {
          if (onMarkerClick) onMarkerClick(food.id);
        });

        newMarkers[food.id] = marker;
      });

      markersRef.current = newMarkers;

      // 3. Draw Connecting Route Polyline
      if (latLngs.length > 1) {
        // Shadow line for Google Maps styling
        L.polyline(latLngs, {
          color: '#1a73e8',
          weight: 6,
          opacity: 0.85,
          lineJoin: 'round',
        }).addTo(map);

        // Dashed inner core for direction indicator
        L.polyline(latLngs, {
          color: '#ffffff',
          weight: 2,
          opacity: 0.9,
          dashArray: '6, 6',
          lineJoin: 'round',
        }).addTo(map);

        // Fit map bounds neatly around all points
        const bounds = L.latLngBounds(latLngs);
        map.fitBounds(bounds, { padding: [60, 60] });
      }
    });

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [isMounted, destinations, culinary, center, zoom]);

  // Handle Dynamic Map Layer Switch (Roadmap, Satellite, Terrain)
  useEffect(() => {
    if (!mapRef.current || !tileLayerRef.current) return;
    import('leaflet').then((L) => {
      if (tileLayerRef.current && mapRef.current) {
        mapRef.current.removeLayer(tileLayerRef.current);
      }
      const newLayer = L.tileLayer(getGoogleTileUrl(mapType), {
        subdomains: ['0', '1', '2', '3'],
        attribution:
          '&copy; <a href="https://maps.google.com" target="_blank" rel="noopener noreferrer">Google Maps</a> | Gatra Gresik',
        maxZoom: 20,
      }).addTo(mapRef.current);

      tileLayerRef.current = newLayer;
    });
  }, [mapType]);

  // Handle selected item focus pan & open popup
  useEffect(() => {
    if (!selectedId || !markersRef.current[selectedId] || !mapRef.current) return;
    const targetMarker = markersRef.current[selectedId];
    const latLng = targetMarker.getLatLng();
    mapRef.current.flyTo(latLng, 15, { duration: 1.2 });
    targetMarker.openPopup();
  }, [selectedId]);

  const handleResetBounds = () => {
    if (!mapRef.current) return;
    import('leaflet').then((L) => {
      const latLngs: [number, number][] = [
        ...destinations.map((d) => [d.latitude, d.longitude] as [number, number]),
        ...culinary.map((c) => [c.latitude, c.longitude] as [number, number]),
      ];
      if (latLngs.length > 0) {
        const bounds = L.latLngBounds(latLngs);
        mapRef.current.flyToBounds(bounds, { padding: [60, 60] });
      }
    });
  };

  if (!isMounted) {
    return (
      <div
        className="w-full bg-[#f6f3f2] rounded-3xl animate-pulse flex flex-col items-center justify-center text-on-surface-variant gap-3 border border-border"
        style={{ height }}
      >
        <div className="flex items-center gap-2 text-primary font-bold text-base">
          <span className="material-symbols-outlined animate-spin text-[24px]">sync</span>
          <span>Memuat Google Maps API...</span>
        </div>
        <p className="text-xs text-on-surface-variant/80">Menyiapkan peta rute interaktif Gresik</p>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full overflow-hidden z-0 group">
      {/* Map Container */}
      <div id={mapContainerId} style={{ height, width: '100%' }} />

      {/* Google Maps Layer & Control Bar Floating Overlay */}
      <div className="absolute top-4 left-4 right-4 sm:left-6 sm:right-auto z-[999] flex flex-wrap items-center gap-2 bg-surface/90 backdrop-blur-md p-1.5 rounded-2xl border border-border/80 shadow-md">
        <div className="flex items-center gap-1 bg-surface-container/60 p-1 rounded-xl">
          <button
            type="button"
            onClick={() => setMapType('roadmap')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              mapType === 'roadmap'
                ? 'bg-white text-primary shadow-xs'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            Peta Google
          </button>
          <button
            type="button"
            onClick={() => setMapType('satellite')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              mapType === 'satellite'
                ? 'bg-white text-primary shadow-xs'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            Satelit
          </button>
          <button
            type="button"
            onClick={() => setMapType('terrain')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              mapType === 'terrain'
                ? 'bg-white text-primary shadow-xs'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            Medan
          </button>
        </div>

        <button
          type="button"
          onClick={handleResetBounds}
          className="px-3 py-1.5 bg-surface hover:bg-surface-container-low text-on-surface text-xs font-bold rounded-xl border border-border transition-colors flex items-center gap-1.5 shadow-xs"
          title="Fokus Ulang Semua Rute"
        >
          <span className="material-symbols-outlined text-[16px] text-primary">filter_center_focus</span>
          <span className="hidden sm:inline">Reset Zoom</span>
        </button>
      </div>

      {/* Marker CSS Styles */}
      <style jsx global>{`
        .custom-google-marker-wrapper {
          background: transparent !important;
          border: none !important;
        }

        .google-pin-container {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          cursor: pointer;
        }

        .google-pin-head {
          width: 34px;
          height: 34px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #ffffff;
          font-weight: 800;
          font-size: 14px;
          border: 2.5px solid #ffffff;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
          transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .google-pin-container:hover .google-pin-head,
        .google-pin-container.is-active .google-pin-head {
          transform: scale(1.25);
          box-shadow: 0 6px 18px rgba(0, 0, 0, 0.4);
        }

        .google-pin-pointer {
          width: 8px;
          height: 8px;
          transform: rotate(45deg);
          margin-top: -5px;
          border-right: 2px solid #ffffff;
          border-bottom: 2px solid #ffffff;
          box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
        }

        .google-pin-label {
          position: absolute;
          top: 38px;
          white-space: nowrap;
          background: rgba(27, 28, 28, 0.9);
          color: #ffffff;
          font-size: 10px;
          font-weight: 700;
          padding: 2px 8px;
          border-radius: 6px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.25);
          pointer-events: none;
          opacity: 0.9;
        }

        .google-pin-container:hover .google-pin-label {
          opacity: 1;
          z-index: 10;
        }
      `}</style>
    </div>
  );
}
