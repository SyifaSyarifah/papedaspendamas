import { Itinerary, ReplanningDiff } from '../types/itinerary';
import { generateItinerary } from './itineraryGenerator';
import { GRESIK_DESTINATIONS } from '../data/gresikDestinations';
import { GRESIK_CULINARY } from '../data/gresikCulinary';

export function handleReplan(
  currentItinerary: Itinerary,
  action: 'reduce_budget' | 'change_culinary' | 'change_destination' | 'make_relaxed' | 'custom',
  targetId?: string | null
): { updatedItinerary: Itinerary; diff: ReplanningDiff } {
  let newDestinations = [...currentItinerary.selectedDestinations];
  let newCulinary = [...currentItinerary.selectedCulinary];
  let newPreferences = { ...currentItinerary.preferences };

  let changeType: ReplanningDiff['changeType'] = 'style'; // fallback
  let explanation = 'Perubahan diterapkan sesuai permintaan.';
  let beforeTitle = '';
  let beforeCost = 0;
  let beforeDesc = '';
  let afterTitle = '';
  let afterCost = 0;
  let afterDesc = '';

  switch (action) {
    case 'reduce_budget':
      changeType = 'budget';
      let maxCostIdx = -1;
      let maxCost = -1;
      newDestinations.forEach((d, i) => {
        if (d.price > maxCost) {
          maxCost = d.price;
          maxCostIdx = i;
        }
      });
      if (maxCostIdx !== -1 && maxCost > 0) {
        const original = newDestinations[maxCostIdx];
        beforeTitle = original.name;
        beforeCost = original.price;
        beforeDesc = 'Destinasi berbayar';

        const freeDests = GRESIK_DESTINATIONS.filter(
          (d) => d.price === 0 && !newDestinations.some((nd) => nd.id === d.id)
        );
        if (freeDests.length > 0) {
          const replacement = freeDests[0];
          newDestinations[maxCostIdx] = replacement;
          afterTitle = replacement.name;
          afterCost = replacement.price;
          afterDesc = 'Destinasi gratis alternatif';
          explanation = `Mengganti ${original.name} dengan ${replacement.name} untuk menghemat budget.`;
        }
      }
      break;

    case 'change_culinary':
      changeType = 'culinary';
      if (newCulinary.length > 0) {
        const original = newCulinary[0];
        beforeTitle = original.name;
        beforeCost = original.priceMin;
        beforeDesc = 'Pilihan kuliner sebelumnya';

        const otherCulinary = GRESIK_CULINARY.filter(
          (c) => c.id !== original.id && (!targetId || c.id === targetId)
        );
        if (otherCulinary.length > 0) {
          const replacement = otherCulinary[0];
          newCulinary[0] = replacement;
          afterTitle = replacement.name;
          afterCost = replacement.priceMin;
          afterDesc = 'Alternatif kuliner baru';
          explanation = `Mengganti kuliner ke ${replacement.name}.`;
        }
      }
      break;

    case 'change_destination':
      changeType = 'destination';
      const targetIdx = targetId ? newDestinations.findIndex((d) => d.id === targetId) : 0;
      if (targetIdx !== -1 && newDestinations.length > 0) {
        const original = newDestinations[targetIdx];
        beforeTitle = original.name;
        beforeCost = original.price;
        beforeDesc = 'Destinasi sebelumnya';

        const otherDests = GRESIK_DESTINATIONS.filter(
          (d) => !newDestinations.some((nd) => nd.id === d.id) && (!targetId || d.id !== targetId)
        );
        if (otherDests.length > 0) {
          const replacement = otherDests[0];
          newDestinations[targetIdx] = replacement;
          afterTitle = replacement.name;
          afterCost = replacement.price;
          afterDesc = 'Destinasi alternatif';
          explanation = `Menukar ${original.name} dengan ${replacement.name}.`;
        }
      }
      break;

    case 'make_relaxed':
      changeType = 'style';
      if (newDestinations.length > 1) {
        const original = newDestinations[newDestinations.length - 1];
        beforeTitle = original.name;
        beforeCost = original.price;
        beforeDesc = 'Destinasi yang dihapus';

        newDestinations.pop(); // remove last
        newPreferences.travelStyle = 'santai';

        afterTitle = 'Waktu Ekstra';
        afterCost = 0;
        afterDesc = 'Waktu dialokasikan untuk istirahat';
        explanation = `Menghapus ${original.name} agar perjalanan lebih santai dan tidak terburu-buru.`;
      }
      break;

    case 'custom':
      changeType = 'style';
      explanation = 'Penyesuaian manual sesuai permintaan.';
      beforeTitle = 'Rencana Lama';
      afterTitle = 'Rencana Baru';
      break;
  }

  // Generate updated itinerary
  const updatedItinerary = generateItinerary(newPreferences, newDestinations, newCulinary);
  updatedItinerary.id = currentItinerary.id; // Keep same ID so we can update it in-place if needed

  const diff: ReplanningDiff = {
    changeType,
    explanation,
    beforeItem: {
      title: beforeTitle || '-',
      cost: beforeCost || 0,
      description: beforeDesc || '-',
    },
    afterItem: {
      title: afterTitle || '-',
      cost: afterCost || 0,
      description: afterDesc || '-',
    },
    budgetBefore: currentItinerary.budget.total,
    budgetAfter: updatedItinerary.budget.total,
    remainingBudget: updatedItinerary.budget.remaining,
  };

  return { updatedItinerary, diff };
}
