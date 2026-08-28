import { Destination, CulinarySpot } from './destination';
import { UserPreferences } from './planner';

export interface TimelineSlot {
  id: string;
  time: string; // e.g. "09:00"
  type: 'departure' | 'destination' | 'culinary' | 'return';
  title: string;
  categoryLabel?: string;
  durationMinutes: number;
  cost: number;
  costLabel: string;
  description: string;
  locationName: string;
  travelTimeToNextMinutes?: number;
  distanceToNextKm?: number;
  destinationData?: Destination;
  culinaryData?: CulinarySpot;
}

export interface BudgetBreakdown {
  transport: number;
  tickets: number;
  culinary: number;
  activity: number;
  total: number;
  budgetCap: number;
  remaining: number;
}

export interface Itinerary {
  id: string;
  title: string;
  subtitle: string;
  createdAt: string;
  preferences: UserPreferences;
  selectedDestinations: Destination[];
  selectedCulinary: CulinarySpot[];
  timeline: TimelineSlot[];
  budget: BudgetBreakdown;
  totalDistanceKm: number;
  totalEstimatedTimeMinutes: number;
}

export interface ReplanningDiff {
  changeType: 'budget' | 'destination' | 'culinary' | 'style';
  explanation: string;
  beforeItem: {
    title: string;
    cost: number;
    description: string;
  };
  afterItem: {
    title: string;
    cost: number;
    description: string;
  };
  budgetBefore: number;
  budgetAfter: number;
  remainingBudget: number;
}
