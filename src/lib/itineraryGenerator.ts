import { Destination, CulinarySpot } from '../types/destination';
import { UserPreferences } from '../types/planner';
import { TimelineSlot, BudgetBreakdown, Itinerary } from '../types/itinerary';
import { GRESIK_CULINARY } from '../data/gresikCulinary';

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
    travelTimeToNextMinutes: 40,
    distanceToNextKm: 18.5,
  });

  // Slot 2: First Destination
  if (chosenDestinations[0]) {
    timeline.push({
      id: `slot-dest-0`,
      time: '09:30',
      type: 'destination',
      title: chosenDestinations[0].name,
      categoryLabel: chosenDestinations[0].categoryLabel,
      durationMinutes: chosenDestinations[0].recommendedDurationMinutes,
      cost: chosenDestinations[0].price,
      costLabel: chosenDestinations[0].price === 0 ? 'Gratis' : chosenDestinations[0].priceLabel,
      description: chosenDestinations[0].shortDescription,
      locationName: chosenDestinations[0].name,
      travelTimeToNextMinutes: 20,
      distanceToNextKm: 3.2,
      destinationData: chosenDestinations[0],
    });
  }

  // Slot 3: Lunch / Local Culinary
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
    travelTimeToNextMinutes: 15,
    distanceToNextKm: 2.1,
    culinaryData: chosenCulinary,
  });

  // Slot 4: Second Destination
  if (chosenDestinations[1]) {
    timeline.push({
      id: `slot-dest-1`,
      time: '13:30',
      type: 'destination',
      title: chosenDestinations[1].name,
      categoryLabel: chosenDestinations[1].categoryLabel,
      durationMinutes: chosenDestinations[1].recommendedDurationMinutes,
      cost: chosenDestinations[1].price,
      costLabel: chosenDestinations[1].price === 0 ? 'Gratis' : chosenDestinations[1].priceLabel,
      description: chosenDestinations[1].shortDescription,
      locationName: chosenDestinations[1].name,
      travelTimeToNextMinutes: 25,
      distanceToNextKm: 4.8,
      destinationData: chosenDestinations[1],
    });
  }

  // Slot 5: Third Destination (if 1_day or 2_days)
  if (chosenDestinations[2] && preferences.duration !== 'half_day') {
    timeline.push({
      id: `slot-dest-2`,
      time: '15:45',
      type: 'destination',
      title: chosenDestinations[2].name,
      categoryLabel: chosenDestinations[2].categoryLabel,
      durationMinutes: chosenDestinations[2].recommendedDurationMinutes,
      cost: chosenDestinations[2].price,
      costLabel: chosenDestinations[2].price === 0 ? 'Gratis' : chosenDestinations[2].priceLabel,
      description: chosenDestinations[2].shortDescription,
      locationName: chosenDestinations[2].name,
      travelTimeToNextMinutes: 30,
      distanceToNextKm: 5.0,
      destinationData: chosenDestinations[2],
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
    totalDistanceKm: 28.5,
    totalEstimatedTimeMinutes: preferences.duration === 'half_day' ? 360 : 540,
  };
}
