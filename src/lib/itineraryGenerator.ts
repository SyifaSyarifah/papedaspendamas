import { Destination, CulinarySpot } from '../types/destination';
import { UserPreferences } from '../types/planner';
import { TimelineSlot, BudgetBreakdown, Itinerary } from '../types/itinerary';
import { GRESIK_CULINARY } from '../data/gresikCulinary';

// Helper jarak jalan raya realistis (Haversine + 1.3x faktor jalan Gresik)
function getRoadDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const roadKm = R * c * 1.3;
  return Number(Math.max(1.0, roadKm).toFixed(1));
}

function getTravelMinutes(distKm: number, transport: string): number {
  const avgSpeed = transport === 'motor' ? 32 : transport === 'mobil' ? 28 : 22;
  return Math.max(8, Math.round((distKm / avgSpeed) * 60));
}

export function generateItinerary(
  preferences: UserPreferences,
  destinations: Destination[],
  culinaryList?: CulinarySpot[]
): Itinerary {
  // Gunakan list item yang dipilih secara dinamis (maks 2 untuk half_day, maks 3-4 untuk 1_day)
  const maxItems = preferences.duration === 'half_day' ? 2 : 3;
  const chosenItems = destinations.slice(0, Math.max(1, Math.min(destinations.length, maxItems)));

  const transportBaseCost =
    preferences.transport === 'motor' ? 25000 : preferences.transport === 'mobil' ? 60000 : 20000;

  // Pisahkan destinasi umum dan kuliner
  const nonCulinaryItems = chosenItems.filter((d) => d.category !== 'kuliner');
  const culinaryItems = chosenItems.filter((d) => d.category === 'kuliner');

  const ticketsCost = nonCulinaryItems.reduce((sum, d) => sum + d.price, 0);
  const culinaryCost = culinaryItems.length > 0
    ? culinaryItems.reduce((sum, c) => sum + (c.price || 25000), 0)
    : (culinaryList && culinaryList.length > 0 ? culinaryList[0].priceMin : 25000);

  const activityCost = 15000; // parkir, infaq, tip
  const totalCost = transportBaseCost + ticketsCost + culinaryCost + activityCost;

  const budgetBreakdown: BudgetBreakdown = {
    transport: transportBaseCost,
    tickets: ticketsCost,
    culinary: culinaryCost,
    activity: activityCost,
    total: totalCost,
    budgetCap: preferences.budget,
    remaining: Math.max(0, preferences.budget - totalCost),
  };

  const timeline: TimelineSlot[] = [];

  // Koordinat titik awal
  const startCoord = {
    lat: preferences.startLocation?.toLowerCase().includes('gresik') ? -7.1558 : -7.2575,
    lng: preferences.startLocation?.toLowerCase().includes('gresik') ? 112.6552 : 112.7521,
  };

  let currentLat = startCoord.lat;
  let currentLng = startCoord.lng;
  let runningDistance = 0;

  // Waktu awal (jam keberangkatan)
  let currentHour = 8;
  let currentMinute = 30;

  const formatTime = (h: number, m: number) => {
    const hh = String(Math.floor(h) % 24).padStart(2, '0');
    const mm = String(Math.floor(m) % 60).padStart(2, '0');
    return `${hh}:${mm}`;
  };

  const addMinutes = (m: number) => {
    currentMinute += m;
    while (currentMinute >= 60) {
      currentMinute -= 60;
      currentHour += 1;
    }
  };

  // 1. Slot Keberangkatan
  const firstItem = chosenItems[0];
  const firstLegKm = firstItem
    ? getRoadDistanceKm(currentLat, currentLng, firstItem.latitude, firstItem.longitude)
    : 15.0;
  const firstLegMin = getTravelMinutes(firstLegKm, preferences.transport);
  runningDistance += firstLegKm;

  timeline.push({
    id: 'slot-departure',
    time: formatTime(currentHour, currentMinute),
    type: 'departure',
    title: `Berangkat dari ${preferences.startLocation || 'Surabaya'}`,
    categoryLabel: 'Titik Keberangkatan',
    durationMinutes: 45,
    cost: transportBaseCost / 2,
    costLabel: `Rp${Math.round(transportBaseCost / 2).toLocaleString('id-ID')} (Bahan Bakar)`,
    description: `Memulai perjalanan menuju Gresik via rute optimal dengan ${preferences.transport}.`,
    locationName: preferences.startLocation || 'Surabaya',
    travelTimeToNextMinutes: firstLegMin,
    distanceToNextKm: firstLegKm,
  });

  addMinutes(45 + firstLegMin);

  // 2. Dynamic Slots untuk setiap destinasi/kuliner yang benar-benar dipilih
  chosenItems.forEach((item, index) => {
    const isCulinary = item.category === 'kuliner';
    const isLast = index === chosenItems.length - 1;
    const duration = item.recommendedDurationMinutes || (isCulinary ? 60 : 75);

    // Hitung jarak ke item berikutnya atau ke titik pulang jika terakhir
    const nextItem = !isLast ? chosenItems[index + 1] : null;
    const nextLegKm = nextItem
      ? getRoadDistanceKm(item.latitude, item.longitude, nextItem.latitude, nextItem.longitude)
      : getRoadDistanceKm(item.latitude, item.longitude, startCoord.lat, startCoord.lng);
    const nextLegMin = getTravelMinutes(nextLegKm, preferences.transport);
    runningDistance += nextLegKm;

    timeline.push({
      id: `slot-item-${item.id}`,
      time: formatTime(currentHour, currentMinute),
      type: isCulinary ? 'culinary' : 'destination',
      title: item.name,
      categoryLabel: item.categoryLabel,
      durationMinutes: duration,
      cost: item.price,
      costLabel: item.price === 0 ? 'Gratis' : item.priceLabel,
      description: item.shortDescription || item.description.slice(0, 100),
      locationName: item.name,
      travelTimeToNextMinutes: nextLegMin,
      distanceToNextKm: nextLegKm,
      destinationData: item,
    });

    addMinutes(duration + nextLegMin);
  });

  // 3. Slot Perjalanan Pulang
  timeline.push({
    id: 'slot-return',
    time: formatTime(currentHour, currentMinute),
    type: 'return',
    title: `Perjalanan Pulang ke ${preferences.startLocation || 'Surabaya'}`,
    categoryLabel: 'Selesai Trip',
    durationMinutes: 45,
    cost: transportBaseCost / 2,
    costLabel: `Rp${Math.round(transportBaseCost / 2).toLocaleString('id-ID')}`,
    description: 'Kembali ke tempat asal dengan kenangan dan oleh-oleh khas Gresik.',
    locationName: preferences.startLocation || 'Surabaya',
  });

  const durationLabel =
    preferences.duration === 'half_day'
      ? 'Setengah Hari'
      : preferences.duration === '1_day'
      ? '1 Hari'
      : '2 Hari';

  let subtitle = '';
  if (nonCulinaryItems.length > 0 && culinaryItems.length > 0) {
    subtitle = `${nonCulinaryItems.length} Destinasi Wisata + ${culinaryItems.length} Spot Kuliner`;
  } else if (culinaryItems.length > 0) {
    subtitle = `${culinaryItems.length} Spot Kuliner Pilihan Gresik`;
  } else {
    subtitle = `${nonCulinaryItems.length} Destinasi Wisata Pilihan`;
  }

  // Siapkan culinary data untuk peta
  const selectedCulinaryList: CulinarySpot[] = culinaryItems.length > 0
    ? culinaryItems.map((c) => ({
        id: c.id,
        name: c.name,
        category: c.category,
        categoryLabel: c.categoryLabel,
        description: c.description,
        priceMin: c.price,
        priceMax: c.price * 1.5,
        priceLabel: c.priceLabel,
        rating: c.rating,
        latitude: c.latitude,
        longitude: c.longitude,
        openingHours: c.openingHours,
        address: c.address,
        image: c.image,
        popularMenu: c.highlights || [],
        recommendedReason: c.shortDescription,
      }))
    : (culinaryList && culinaryList.length > 0 ? culinaryList : [GRESIK_CULINARY[0]]);

  return {
    id: `trip-${Date.now()}`,
    title: `Jelajah Gresik ${durationLabel}`,
    subtitle,
    createdAt: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
    preferences,
    selectedDestinations: nonCulinaryItems.length > 0 ? nonCulinaryItems : chosenItems,
    selectedCulinary: selectedCulinaryList,
    timeline,
    budget: budgetBreakdown,
    totalDistanceKm: Number(runningDistance.toFixed(1)),
    totalEstimatedTimeMinutes: preferences.duration === 'half_day' ? 360 : 540,
  };
}
