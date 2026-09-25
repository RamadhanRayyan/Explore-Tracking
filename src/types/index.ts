export type PlaceCategory = 
  | 'Wisata' 
  | 'Kuliner' 
  | 'Cafe' 
  | 'Photo Spot' 
  | 'Night Hangout' 
  | 'Heritage' 
  | 'Nature' 
  | 'Shopping';

export type TransportMode = 'motor' | 'mobil' | 'jalan' | 'public';
export type TravelStyle = 'santai' | 'balanced' | 'padat';

export interface Place {
  id: string;
  name: string;
  slug: string;
  category: PlaceCategory;
  description: string;
  shortDescription: string;
  image: string;
  gallery: string[];
  latitude: number;
  longitude: number;
  address: string;
  district: string;
  priceMin: number;
  priceMax: number;
  rating: number;
  reviewCount: number;
  averageVisitMinutes: number;
  tags: string[];
  openingHours: {
    open: string;  // e.g. "08:00"
    close: string; // e.g. "21:00"
    days: string;  // e.g. "Setiap Hari"
  };
  facilities: string[];
  popularityScore: number; // 0 - 100
  whyPeopleLikeIt: string[];
  isDemoVerified?: boolean;
}

export interface CategoryInfo {
  id: string;
  name: PlaceCategory;
  emoji: string;
  iconName: string;
  slug: string;
  description: string;
  accentColor: string;
}

export interface Review {
  id: string;
  placeId: string;
  userName: string;
  userAvatar?: string;
  rating: number; // 1-5
  comment: string;
  date: string;
  userId?: string;
  isLocalUser?: boolean;
}

export interface UserPreferences {
  defaultTransport: TransportMode;
  preferredCategories: PlaceCategory[];
  budgetPreference: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  preferences: UserPreferences;
}

export interface PlannerInput {
  budget: number;
  durationMinutes: number;
  startTime: string; // "09:00"
  interests: PlaceCategory[];
  transport: TransportMode;
  travelStyle: TravelStyle;
}

export interface ItineraryItem {
  order: number;
  place: Place;
  arrivalTime: string;
  departureTime: string;
  visitDurationMinutes: number;
  travelTimeFromPreviousMinutes: number;
  distanceFromPreviousKm: number;
  estimatedCost: number;
  recommendationReason: string;
}

export interface Trip {
  id: string;
  title: string;
  createdAt: string;
  input: PlannerInput;
  items: ItineraryItem[];
  totalCost: number;
  remainingBudget: number;
  totalDurationMinutes: number;
  totalDistanceKm: number;
  notes?: string;
}

export interface ToastNotification {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  message: string;
}
