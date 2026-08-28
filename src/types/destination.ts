export type DestinationCategory =
  | 'sejarah'
  | 'religi'
  | 'alam'
  | 'kuliner'
  | 'keluarga'
  | 'edukasi';

export interface Destination {
  id: string;
  name: string;
  category: DestinationCategory;
  categoryLabel: string;
  description: string;
  shortDescription: string;
  price: number; // in IDR (e.g. 10000)
  priceLabel: string;
  rating: number;
  reviewCount: number;
  latitude: number;
  longitude: number;
  distanceKm: number; // from typical start (e.g. Surabaya / Alun-alun Gresik)
  openingHours: string;
  recommendedDurationMinutes: number;
  address: string;
  image: string;
  facilities: string[];
  highlights: string[];
  bestTimeToVisit: string;
  matchReasons?: string[];
  matchScore?: number;
}

export interface CulinarySpot {
  id: string;
  name: string;
  category: string;
  categoryLabel: string;
  description: string;
  priceMin: number;
  priceMax: number;
  priceLabel: string;
  rating: number;
  latitude: number;
  longitude: number;
  distanceFromItinerary?: string;
  nearDestinationId?: string;
  openingHours: string;
  address: string;
  image: string;
  popularMenu: string[];
  recommendedReason?: string;
}
