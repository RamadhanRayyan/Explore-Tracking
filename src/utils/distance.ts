import type { TransportMode } from '@/types';

/**
 * Average speeds in km/h according to specification:
 * - Walking: 4 km/h
 * - Motor: 25 km/h
 * - Car: 20 km/h
 * - Public transport: 15 km/h
 */
export const TRAVEL_SPEEDS: Record<TransportMode, number> = {
  jalan: 4,
  motor: 25,
  mobil: 20,
  public: 15,
};

/**
 * Calculates Haversine distance between two coordinates in kilometers.
 */
export function calculateHaversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth's radius in kilometers
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  // Add a slight road tortuosity factor (~1.25) to approximate actual street network distance
  return Math.round(distance * 1.25 * 10) / 10;
}

/**
 * Estimates travel time in minutes based on distance and transport mode.
 * Minimum buffer of 5 minutes for traffic/parking/boarding.
 */
export function estimateTravelTimeMinutes(
  distanceKm: number,
  transport: TransportMode
): number {
  const speed = TRAVEL_SPEEDS[transport] || 20;
  const rawMinutes = (distanceKm / speed) * 60;
  const buffer = transport === 'jalan' ? 2 : 5;
  return Math.max(5, Math.round(rawMinutes + buffer));
}

/**
 * Format distance in km or meters
 */
export function formatDistance(km: number): string {
  if (km < 1) {
    return `${Math.round(km * 1000)} m`;
  }
  return `${km.toFixed(1)} km`;
}
