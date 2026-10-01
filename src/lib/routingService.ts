/**
 * routingService.ts
 * Integrasi OSRM (Open Source Routing Machine) Public API
 * Menghitung jarak jalan raya nyata (km), durasi perjalanan (menit), dan koordinat polyline jalan.
 */

export interface LatLngPoint {
  latitude: number;
  longitude: number;
}

export interface RouteLeg {
  distanceKm: number;
  durationMinutes: number;
}

export interface RouteResult {
  totalDistanceKm: number;
  totalDurationMinutes: number;
  polyline: [number, number][]; // [latitude, longitude] untuk Leaflet / Map
  legs: RouteLeg[];
  isFallback: boolean;
}

/**
 * Menghitung rute perjalanan nyata melintasi beberapa waypoint menggunakan OSRM API.
 * Format waypoint: Array of { latitude, longitude }
 */
export async function fetchOSRMRoute(
  waypoints: LatLngPoint[],
  timeoutMs = 6000
): Promise<RouteResult> {
  if (!waypoints || waypoints.length < 2) {
    return {
      totalDistanceKm: 0,
      totalDurationMinutes: 0,
      polyline: waypoints.map((w) => [w.latitude, w.longitude]),
      legs: [],
      isFallback: false,
    };
  }

  // Format OSRM: lon,lat;lon,lat;...
  const coordsParam = waypoints
    .map((p) => `${p.longitude.toFixed(6)},${p.latitude.toFixed(6)}`)
    .join(';');

  const osrmUrl = `https://router.project-osrm.org/route/v1/driving/${coordsParam}?overview=full&geometries=geojson`;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(osrmUrl, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (!res.ok) {
      throw new Error(`OSRM HTTP status ${res.status}`);
    }

    const data = await res.json();

    if (data.code !== 'Ok' || !data.routes || data.routes.length === 0) {
      throw new Error('OSRM tidak menemukan rute');
    }

    const primaryRoute = data.routes[0];
    const totalDistanceKm = Number((primaryRoute.distance / 1000).toFixed(1));
    const totalDurationMinutes = Math.round(primaryRoute.duration / 60);

    // GeoJSON mengembalikan [lon, lat], konversi ke [lat, lon] untuk Leaflet
    const polyline: [number, number][] = (primaryRoute.geometry.coordinates || []).map(
      (coord: [number, number]) => [coord[1], coord[0]]
    );

    const legs: RouteLeg[] = (primaryRoute.legs || []).map((leg: any) => ({
      distanceKm: Number((leg.distance / 1000).toFixed(1)),
      durationMinutes: Math.max(1, Math.round(leg.duration / 60)),
    }));

    return {
      totalDistanceKm,
      totalDurationMinutes,
      polyline,
      legs,
      isFallback: false,
    };
  } catch (error) {
    // Jika koneksi OSRM timeout / offline, gunakan estimasi Haversine + road factor 1.3
    return calculateFallbackRoute(waypoints);
  }
}

/**
 * Formula Haversine dengan faktor kelokan jalan Gresik (1.3x) sebagai fallback aman
 */
function calculateFallbackRoute(waypoints: LatLngPoint[]): RouteResult {
  let totalKm = 0;
  const legs: RouteLeg[] = [];

  for (let i = 0; i < waypoints.length - 1; i++) {
    const p1 = waypoints[i];
    const p2 = waypoints[i + 1];
    const straightKm = haversineDistanceKm(p1.latitude, p1.longitude, p2.latitude, p2.longitude);
    // Faktor jalan raya di wilayah padat/pesisir Gresik ~ 1.3x jarak lurus
    const roadKm = Number((straightKm * 1.3).toFixed(1));
    totalKm += roadKm;

    // Rata-rata kecepatan motor di Gresik ~30 km/jam (0.5 km per menit)
    const durationMin = Math.max(5, Math.round((roadKm / 30) * 60));
    legs.push({
      distanceKm: roadKm,
      durationMinutes: durationMin,
    });
  }

  const roundedTotalKm = Number(totalKm.toFixed(1));
  const totalDurationMin = legs.reduce((acc, leg) => acc + leg.durationMinutes, 0);

  return {
    totalDistanceKm: roundedTotalKm,
    totalDurationMinutes: totalDurationMin,
    polyline: waypoints.map((w) => [w.latitude, w.longitude]),
    legs,
    isFallback: true,
  };
}

function haversineDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Radius Bumi dalam km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function deg2rad(deg: number): number {
  return deg * (Math.PI / 180);
}
