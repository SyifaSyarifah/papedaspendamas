import { Destination, DestinationCategory } from '../types/destination';
import { UserPreferences } from '../types/planner';
import { GRESIK_DESTINATIONS } from '../data/gresikDestinations';

export interface ScoredDestination extends Destination {
  matchScore: number;
  matchReasons: string[];
}

export function rankDestinations(
  preferences: UserPreferences,
  allDestinations: Destination[] = GRESIK_DESTINATIONS
): ScoredDestination[] {
  const { budget, interests, duration, transport, travelStyle } = preferences;

  const scored = allDestinations.map((dest) => {
    let interestScore = 0;
    const reasons: string[] = [];

    // 1. Interest Match (30% weight -> max 30 pts)
    const isDirectInterest = interests.includes(dest.category);
    if (isDirectInterest) {
      interestScore = 30;
      reasons.push(`Sesuai minat ${dest.categoryLabel.toLowerCase()}`);
    } else if (interests.includes('sejarah') && dest.category === 'religi') {
      interestScore = 24;
      reasons.push('Memiliki nilai sejarah & heritage tinggi');
    } else if (interests.includes('keluarga') && (dest.category === 'alam' || dest.category === 'edukasi')) {
      interestScore = 22;
      reasons.push('Ramah untuk kunjungan santai keluarga');
    } else {
      interestScore = 12;
    }

    // 2. Budget Score (25% weight -> max 25 pts)
    let budgetScore = 0;
    const priceRatio = dest.price / (budget || 150000);
    if (dest.price === 0) {
      budgetScore = 25;
      reasons.push('Tiket masuk gratis & hemat');
    } else if (priceRatio <= 0.1) {
      budgetScore = 24;
      reasons.push(`Sangat terjangkau (${dest.priceLabel})`);
    } else if (priceRatio <= 0.25) {
      budgetScore = 20;
      reasons.push(`Sesuai budget Rp${budget.toLocaleString('id-ID')}`);
    } else {
      budgetScore = 12;
    }

    // 3. Distance Score (20% weight -> max 20 pts)
    let distanceScore = 0;
    if (dest.distanceKm <= 5) {
      distanceScore = 20;
      reasons.push('Lokasi dekat di pusat kota Gresik');
    } else if (dest.distanceKm <= 20) {
      distanceScore = 16;
      reasons.push('Rute efisien dan mudah diakses');
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
      reasons.push('Waktu kunjungan pas untuk gaya santai');
    } else if (travelStyle === 'padat') {
      timeScore = 14;
    } else {
      timeScore = 13;
    }

    // 5. Rating Score (10% weight -> max 10 pts)
    const ratingScore = Math.min(10, Math.round((dest.rating / 5.0) * 10));
    if (dest.rating >= 4.7) {
      reasons.push(`Rating pengunjung tinggi (${dest.rating}/5.0)`);
    }

    const totalRaw = interestScore + budgetScore + distanceScore + timeScore + ratingScore;
    // Normalize into 75-96% range for authentic feel
    const matchScore = Math.min(97, Math.max(72, totalRaw));

    // Ensure we keep up to 3 most relevant reasons
    const distinctReasons = Array.from(new Set(reasons)).slice(0, 3);

    return {
      ...dest,
      matchScore,
      matchReasons: distinctReasons.length > 0 ? distinctReasons : ['Pilihan wisata favorit di Gresik', 'Akses mudah'],
    };
  });

  // Sort descending by score
  return scored.sort((a, b) => b.matchScore - a.matchScore);
}
