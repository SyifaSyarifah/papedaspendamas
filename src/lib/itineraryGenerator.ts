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
  culinaryList: CulinarySpot[] = [GRESIK_CULINARY[0]]
): Itinerary {
  const chosenDestinations = destinations.slice(0, preferences.duration === 'half_day' ? 2 : 3);
  const chosenCulinary = culinaryList.length > 0 ? culinaryList[0] : GRESIK_CULINARY[0];

  const transportBaseCost =
    preferences.transport === 'motor' ? 25000 : preferences.transport === 'mobil' ? 60000 : 20000;

  const ticketsCost = chosenDestinations.reduce((sum, d) => sum + d.price, 0);
  const culinaryCost = chosenCulinary.priceMin || 25000;
  const activityCost = 15000; // parking, infaq, local guide/tips
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

  // Koordinat titik awal (Surabaya default atau Alun-alun Gresik)
  const startCoord = {
    lat: preferences.startLocation?.toLowerCase().includes('gresik') ? -7.1558 : -7.2575,
    lng: preferences.startLocation?.toLowerCase().includes('gresik') ? 112.6552 : 112.7521,
  };

  const d0 = chosenDestinations[0];
  const leg0Km = d0
    ? getRoadDistanceKm(startCoord.lat, startCoord.lng, d0.latitude, d0.longitude)
    : 15.0;
  const leg0Min = getTravelMinutes(leg0Km, preferences.transport);

  // Slot 1: Departure
  timeline.push({
    id: 'slot-departure',
    time: '08:30',
    type: 'departure',
    title: `Berangkat dari ${preferences.startLocation || 'Surabaya'}`,
    categoryLabel: 'Titik Keberangkatan',
    durationMinutes: 45,
    cost: transportBaseCost / 2,
    costLabel: `Rp${Math.round(transportBaseCost / 2).toLocaleString('id-ID')} (Bahan Bakar/Tiket)`,
    description: `Memulai perjalanan menuju Gresik via rute optimal dengan ${preferences.transport}.`,
    locationName: preferences.startLocation || 'Surabaya',
    travelTimeToNextMinutes: leg0Min,
    distanceToNextKm: leg0Km,
  });

  let runningDistance = leg0Km;

  // Slot 2: First Destination
  if (d0) {
    const legToCulinaryKm = getRoadDistanceKm(d0.latitude, d0.longitude, chosenCulinary.latitude, chosenCulinary.longitude);
    const legToCulinaryMin = getTravelMinutes(legToCulinaryKm, preferences.transport);
    runningDistance += legToCulinaryKm;

    timeline.push({
      id: `slot-dest-0`,
      time: '09:30',
      type: 'destination',
      title: d0.name,
      categoryLabel: d0.categoryLabel,
      durationMinutes: d0.recommendedDurationMinutes,
      cost: d0.price,
      costLabel: d0.price === 0 ? 'Gratis' : d0.priceLabel,
      description: d0.shortDescription,
      locationName: d0.name,
      travelTimeToNextMinutes: legToCulinaryMin,
      distanceToNextKm: legToCulinaryKm,
      destinationData: d0,
    });
  }

  // Slot 3: Lunch / Local Culinary
  const d1 = chosenDestinations[1];
  const legFromCulinaryKm = d1
    ? getRoadDistanceKm(chosenCulinary.latitude, chosenCulinary.longitude, d1.latitude, d1.longitude)
    : 3.5;
  const legFromCulinaryMin = getTravelMinutes(legFromCulinaryKm, preferences.transport);
  runningDistance += legFromCulinaryKm;

  timeline.push({
    id: 'slot-culinary',
    time: '12:00',
    type: 'culinary',
    title: chosenCulinary.name,
    categoryLabel: chosenCulinary.categoryLabel,
    durationMinutes: 60,
    cost: culinaryCost,
    costLabel: `± Rp${culinaryCost.toLocaleString('id-ID')}`,
    description: `${chosenCulinary.description.slice(0, 90)}... Populer: ${chosenCulinary.popularMenu.join(', ')}`,
    locationName: chosenCulinary.name,
    travelTimeToNextMinutes: legFromCulinaryMin,
    distanceToNextKm: legFromCulinaryKm,
    culinaryData: chosenCulinary,
  });

  // Slot 4: Second Destination
  if (d1) {
    const d2 = chosenDestinations[2];
    const legToD2Km = d2
      ? getRoadDistanceKm(d1.latitude, d1.longitude, d2.latitude, d2.longitude)
      : getRoadDistanceKm(d1.latitude, d1.longitude, startCoord.lat, startCoord.lng);
    const legToD2Min = getTravelMinutes(legToD2Km, preferences.transport);
    runningDistance += legToD2Km;

    timeline.push({
      id: `slot-dest-1`,
      time: '13:30',
      type: 'destination',
      title: d1.name,
      categoryLabel: d1.categoryLabel,
      durationMinutes: d1.recommendedDurationMinutes,
      cost: d1.price,
      costLabel: d1.price === 0 ? 'Gratis' : d1.priceLabel,
      description: d1.shortDescription,
      locationName: d1.name,
      travelTimeToNextMinutes: legToD2Min,
      distanceToNextKm: legToD2Km,
      destinationData: d1,
    });
  }

  // Slot 5: Third Destination (jika 1 hari penuh & ada 3 destinasi)
  if (chosenDestinations[2]) {
    const d2 = chosenDestinations[2];
    const returnLegKm = getRoadDistanceKm(d2.latitude, d2.longitude, startCoord.lat, startCoord.lng);
    const returnLegMin = getTravelMinutes(returnLegKm, preferences.transport);
    runningDistance += returnLegKm;

    timeline.push({
      id: `slot-dest-2`,
      time: '15:30',
      type: 'destination',
      title: d2.name,
      categoryLabel: d2.categoryLabel,
      durationMinutes: d2.recommendedDurationMinutes,
      cost: d2.price,
      costLabel: d2.price === 0 ? 'Gratis' : d2.priceLabel,
      description: d2.shortDescription,
      locationName: d2.name,
      travelTimeToNextMinutes: returnLegMin,
      distanceToNextKm: returnLegKm,
      destinationData: d2,
    });
  }

  // Slot 6: Return
  timeline.push({
    id: 'slot-return',
    time: preferences.duration === 'half_day' ? '14:30' : '17:30',
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

  return {
    id: `trip-${Date.now()}`,
    title: `Jelajah Gresik ${durationLabel}`,
    subtitle: `${chosenDestinations.length} Destinasi Wisata + ${chosenCulinary.name}`,
    createdAt: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
    preferences,
    selectedDestinations: chosenDestinations,
    selectedCulinary: [chosenCulinary],
    timeline,
    budget: budgetBreakdown,
    totalDistanceKm: Number(runningDistance.toFixed(1)),
    totalEstimatedTimeMinutes: preferences.duration === 'half_day' ? 360 : 540,
  };
}
