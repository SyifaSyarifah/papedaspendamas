import { Destination, DestinationCategory, CulinarySpot } from '../types/destination';
import { UserPreferences } from '../types/planner';
import { GRESIK_DESTINATIONS } from '../data/gresikDestinations';
import { GRESIK_CULINARY } from '../data/gresikCulinary';

// Helper to map CulinarySpot to Destination so they can be recommended and selected
export function culinaryToDestination(c: CulinarySpot): Destination {
  return {
    id: c.id,
    name: c.name,
    category: 'kuliner', // Map all to 'kuliner' so it matches the filter tab and AI extraction
    categoryLabel: c.categoryLabel,
    description: c.description,
    shortDescription: c.recommendedReason || c.description.slice(0, 60),
    price: c.priceMin,
    priceLabel: c.priceLabel,
    rating: c.rating,
    reviewCount: 300,
    latitude: c.latitude,
    longitude: c.longitude,
    distanceKm: 2.5, // Default assumption
    openingHours: c.openingHours,
    recommendedDurationMinutes: 60,
    address: c.address,
    image: c.image,
    facilities: ['Tempat Makan', 'Area Parkir'],
    highlights: c.popularMenu,
    bestTimeToVisit: 'Jam Makan (Siang / Malam)',
  };
}

export const mappedCulinary: Destination[] = GRESIK_CULINARY.map(culinaryToDestination);

export const ALL_COMBINED_DESTINATIONS: Destination[] = [...GRESIK_DESTINATIONS, ...mappedCulinary];

export interface ScoredDestination extends Destination {
  matchScore: number;
  matchReasons: string[];
}

export function rankDestinations(
  preferences: UserPreferences,
  allDestinations: Destination[] = ALL_COMBINED_DESTINATIONS
): ScoredDestination[] {
  const { budget = 150000, interests = [], duration, transport, travelStyle } = preferences;

  const validDestinations = allDestinations;
  const hasInterests = interests && interests.length > 0;
  const isExclusiveInterest = hasInterests && interests.length === 1;

  const scored = validDestinations.map((dest) => {
    let interestScore = 0;
    const reasons: string[] = [];

    // 1. Interest Match (Strict Filtering for specific requests)
    const isDirectInterest = hasInterests && (
      interests.includes(dest.category) ||
      (interests.includes('alam') && (dest.id === 'pantai-delegan' || dest.id === 'mangrove-ujungpangkah'))
    );

    let keywordBonus = 0;
    if (preferences.queryHint) {
      const q = preferences.queryHint.toLowerCase();
      // Prioritaskan pantai jika user menyebut pantai / laut / bahari / pesisir
      if (
        (q.includes('pantai') || q.includes('laut') || q.includes('bahari') || q.includes('pesisir')) &&
        (dest.id === 'pantai-delegan' || dest.name.toLowerCase().includes('pantai') || dest.categoryLabel.toLowerCase().includes('pantai'))
      ) {
        keywordBonus += 35;
        reasons.unshift('Wisata pantai pasir putih utama pilihanmu di pesisir Gresik');
      }
      // Prioritaskan bukit jika user menyebut bukit / jamur / geowisata
      if (
        (q.includes('bukit') || q.includes('jamur') || q.includes('geowisata')) &&
        (dest.id === 'bukit-jamur' || dest.name.toLowerCase().includes('bukit'))
      ) {
        keywordBonus += 25;
        reasons.unshift('Formasi batuan geologi jamur unik di kawasan perbukitan');
      }
      // Prioritaskan mangrove jika user menyebut mangrove / bakau
      if ((q.includes('mangrove') || q.includes('bakau')) && dest.id === 'mangrove-ujungpangkah') {
        keywordBonus += 30;
        reasons.unshift('Ekowisata hutan mangrove pesisir muara Bengawan Solo');
      }
      // Prioritaskan kuliner spesifik
      if (
        (q.includes('krawu') || q.includes('pudak') || q.includes('otak') || q.includes('kelan')) &&
        dest.category === 'kuliner'
      ) {
        keywordBonus += 25;
      }
    }

    if (isDirectInterest) {
      interestScore = 45 + keywordBonus;
      reasons.push(`Sesuai minat utama: ${dest.categoryLabel}`);
    } else if (hasInterests && interests.includes('sejarah') && dest.category === 'religi') {
      interestScore = 25 + keywordBonus;
      reasons.push('Nilai sejarah & heritage selaras');
    } else if (hasInterests && interests.includes('religi') && dest.category === 'sejarah') {
      interestScore = 25 + keywordBonus;
      reasons.push('Nilai heritage & sejarah spiritual');
    } else if (hasInterests && interests.includes('keluarga') && (dest.category === 'alam' || dest.category === 'edukasi' || dest.id === 'pantai-delegan')) {
      interestScore = 25 + keywordBonus;
      reasons.push('Ramah untuk rekreasi keluarga');
    } else if (hasInterests) {
      // Jika user spesifik memilih minat (misal: "kuliner saja"), kategori lain dikenakan penalti
      interestScore = isExclusiveInterest ? -35 : -15;
      reasons.push(`Kategori ${dest.categoryLabel} (opsional di luar minat utama)`);
    } else {
      interestScore = 20 + keywordBonus;
    }

    // 2. Budget Score (25% weight -> max 25 pts)
    let budgetScore = 0;
    const userBudget = budget || 150000;
    const priceRatio = dest.price / userBudget;

    if (dest.price > userBudget) {
      budgetScore = -20;
      reasons.push(`Melebihi anggaran (Rp${dest.price.toLocaleString('id-ID')})`);
    } else if (dest.price === 0) {
      budgetScore = 25;
      reasons.push('Tiket masuk gratis & sangat hemat');
    } else if (priceRatio <= 0.25) {
      budgetScore = 25;
      reasons.push(`Sangat hemat & sesuai budget (${dest.priceLabel})`);
    } else if (priceRatio <= 0.5) {
      budgetScore = 20;
      reasons.push(`Pas dalam anggaran Rp${userBudget.toLocaleString('id-ID')}`);
    } else {
      budgetScore = 12;
    }

    // 3. Distance Score (20% weight -> max 20 pts)
    let distanceScore = 0;
    if (dest.distanceKm <= 5) {
      distanceScore = 20;
      reasons.push('Dekat & mudah dijangkau di pusat Gresik');
    } else if (dest.distanceKm <= 20) {
      distanceScore = 16;
      reasons.push('Rute strategis & akses mudah');
    } else {
      distanceScore = (duration === '2_days' || transport === 'mobil') ? 14 : 10;
      if (duration === '1_day' && transport === 'motor' && dest.distanceKm > 30) {
        distanceScore = 8;
      }
    }

    // 4. Travel Time / Style match (15% weight -> max 15 pts)
    let timeScore = 0;
    if (travelStyle === 'santai' && dest.recommendedDurationMinutes <= 90) {
      timeScore = 15;
      reasons.push('Durasi pas untuk perjalanan santai');
    } else if (travelStyle === 'padat') {
      timeScore = 14;
    } else {
      timeScore = 13;
    }

    // 5. Rating Score (10% weight -> max 10 pts)
    const ratingScore = Math.min(10, Math.round((dest.rating / 5.0) * 10));
    if (dest.rating >= 4.7) {
      reasons.push(`Rating favorit pengunjung (${dest.rating}/5.0)`);
    }

    const totalRaw = interestScore + budgetScore + distanceScore + timeScore + ratingScore;

    // Normalisasi skor:
    // Jika sesuai minat langsung: 82% - 99%
    // Jika tidak sesuai minat eksplisit: 45% - 68%
    let matchScore = 70;
    if (isDirectInterest) {
      const maxScore = keywordBonus > 0 ? 99 : 98;
      matchScore = Math.min(maxScore, Math.max(82, 60 + totalRaw * 0.4));
    } else if (hasInterests && isExclusiveInterest) {
      matchScore = Math.min(68, Math.max(45, 50 + totalRaw * 0.3));
    } else {
      matchScore = Math.min(92, Math.max(65, 55 + totalRaw * 0.4));
    }

    const distinctReasons = Array.from(new Set(reasons))
      .filter((r) => !r.includes('opsional di luar minat'))
      .slice(0, 3);

    return {
      ...dest,
      matchScore: Math.round(matchScore),
      matchReasons: distinctReasons.length > 0 ? distinctReasons : ['Pilihan populer di Gresik', 'Akses mudah'],
    };
  });

  // Sort: Destinasi yang cocok dengan minat langsung HARUS selalu di atas
  return scored.sort((a, b) => {
    if (hasInterests) {
      const aMatch = interests.includes(a.category);
      const bMatch = interests.includes(b.category);
      if (aMatch && !bMatch) return -1;
      if (!aMatch && bMatch) return 1;
    }
    if (b.matchScore !== a.matchScore) {
      return b.matchScore - a.matchScore;
    }
    // Tie-breaker: Destinasi dengan kepopuleran dan ulasan pengunjung tertinggi diutamakan
    return (b.reviewCount * b.rating) - (a.reviewCount * a.rating);
  });
}
