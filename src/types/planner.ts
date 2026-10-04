import { DestinationCategory } from './destination';

export type TripDuration = 'half_day' | '1_day' | '2_days';
export type TransportType = 'motor' | 'mobil' | 'umum';
export type TravelStyle = 'santai' | 'seimbang' | 'padat';

export interface UserPreferences {
  startLocation: string; // e.g. "Surabaya", "Gresik Kota", "Sidoarjo"
  budget: number; // e.g. 150000
  duration: TripDuration;
  interests: DestinationCategory[];
  transport: TransportType;
  travelStyle: TravelStyle;
  groupSize: number;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  quickChoices?: string[];
  fieldToUpdate?: keyof UserPreferences;
  isConfirmation?: boolean;
}
