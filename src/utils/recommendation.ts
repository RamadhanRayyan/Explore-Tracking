import type {
  ItineraryItem,
  Place,
  PlannerInput,
  TravelStyle,
} from '@/types';
import { calculateHaversineDistance, estimateTravelTimeMinutes } from './distance';
import { addMinutesToTime, isPlaceOpenAtTime, timeStringToMinutes } from './time';

export interface RecommendationResult {
  items: ItineraryItem[];
  totalCost: number;
  remainingBudget: number;
  totalDurationMinutes: number;
  totalDistanceKm: number;
  success: boolean;
  suggestions: string[];
}

/**
 * Adjust average visit duration according to selected travel style.
 */
function getAdjustedVisitMinutes(baseMinutes: number, style: TravelStyle): number {
  switch (style) {
    case 'santai':
      return Math.round(baseMinutes * 1.3);
    case 'padat':
      return Math.max(30, Math.round(baseMinutes * 0.75));
    case 'balanced':
    default:
      return baseMinutes;
  }
}

/**
 * Estimate expected spending at a specific place.
 */
function estimatePlaceCost(place: Place): number {
  if (place.priceMin === 0 && place.priceMax === 0) return 0;
  // Food & Cafe usually averages 50% between min & max, Attractions usually charge min entry
  if (place.category === 'Kuliner' || place.category === 'Cafe' || place.category === 'Night Hangout') {
    return Math.round((place.priceMin + place.priceMax) / 2);
  }
  return place.priceMin;
}

/**
 * Generates an optimized, constraint-respecting itinerary using greedy geographic & scoring heuristics.
 */
export function generateItinerary(
  input: PlannerInput,
  places: Place[]
): RecommendationResult {
  const { budget, durationMinutes, startTime, interests, transport, travelStyle } = input;

  const suggestions: string[] = [];

  if (places.length === 0) {
    return {
      items: [],
      totalCost: 0,
      remainingBudget: budget,
      totalDurationMinutes: 0,
      totalDistanceKm: 0,
      success: false,
      suggestions: ['Tidak ada data tempat yang tersedia untuk diproses.'],
    };
  }

  // 1. Initial Candidate Pool filtering
  // Candidate must have minimum entry cost within total budget
  const eligiblePlaces = places.filter(p => p.priceMin <= budget);

  if (eligiblePlaces.length === 0) {
    return {
      items: [],
      totalCost: 0,
      remainingBudget: budget,
      totalDurationMinutes: 0,
      totalDistanceKm: 0,
      success: false,
      suggestions: [
        'Budget kamu terlalu minim untuk tempat yang ada. Coba naikkan budget minimal Rp25.000.',
        'Pilih opsi destinasi gratis seperti Kota Lama atau Simpang Lima.',
      ],
    };
  }

  let currentTimeStr = startTime;
  let remainingBudget = budget;
  let elapsedMinutes = 0;
  let totalDistanceKm = 0;
  let totalCost = 0;
  const visitedPlaceIds = new Set<string>();
  const itineraryItems: ItineraryItem[] = [];

  let currentLat: number | null = null;
  let currentLon: number | null = null;

  // Maximum stops to avoid exhausting travelers
  const maxStops = travelStyle === 'padat' ? 7 : travelStyle === 'santai' ? 4 : 5;

  while (elapsedMinutes < durationMinutes && itineraryItems.length < maxStops) {
    let bestCandidate: Place | null = null;
    let highestScore = -Infinity;
    let bestTravelTime = 0;
    let bestDistance = 0;
    let bestCost = 0;
    let bestVisitDuration = 0;
    let bestReason = '';

    for (const place of eligiblePlaces) {
      if (visitedPlaceIds.has(place.id)) continue;

      const placeCost = estimatePlaceCost(place);
      if (placeCost > remainingBudget) continue;

      // Calculate travel time and distance from current location
      let distKm = 0;
      let travelMinutes = 0;

      if (currentLat !== null && currentLon !== null) {
        distKm = calculateHaversineDistance(currentLat, currentLon, place.latitude, place.longitude);
        travelMinutes = estimateTravelTimeMinutes(distKm, transport);
      } else {
        // First stop: assume 5 minutes initial setup
        distKm = 0;
        travelMinutes = 5;
      }

      const visitDuration = getAdjustedVisitMinutes(place.averageVisitMinutes, travelStyle);
      const totalTimeNeeded = travelMinutes + visitDuration;

      // Hard Constraint: Time boundary check
      if (elapsedMinutes + totalTimeNeeded > durationMinutes) {
        continue;
      }

      // Hard Constraint: Opening Hours check at expected arrival
      const expectedArrivalStr = addMinutesToTime(currentTimeStr, travelMinutes);
      const isOpen = isPlaceOpenAtTime(
        expectedArrivalStr,
        place.openingHours.open,
        place.openingHours.close
      );

      if (!isOpen) {
        continue;
      }

      // SCORING ENGINE (per specification):
      // score = interestMatch * 0.30 + budgetFit * 0.20 + ratingScore * 0.15 + timeFit * 0.15 + distanceScore * 0.10 + popularityScore * 0.10

      // 1. Interest match (0.0 to 1.0)
      const isDirectCategoryMatch = interests.length === 0 || interests.includes(place.category);
      const tagMatchCount = place.tags.filter(tag =>
        interests.some(interest => interest.toLowerCase().includes(tag.toLowerCase()))
      ).length;
      const interestMatch = isDirectCategoryMatch ? 1.0 : tagMatchCount > 0 ? 0.6 : 0.2;

      // 2. Budget fit (higher score if comfortable cost within remaining budget)
      const costRatio = placeCost / Math.max(1, remainingBudget);
      const budgetFit = 1 - Math.min(1, Math.max(0, costRatio * 0.8));

      // 3. Rating score (normalized 3.0-5.0 to 0-1)
      const ratingScore = Math.max(0, (place.rating - 3.0) / 2.0);

      // 4. Time fit (places that fit comfortably into remaining duration)
      const remainingTime = durationMinutes - elapsedMinutes;
      const timeRatio = totalTimeNeeded / Math.max(1, remainingTime);
      const timeFit = timeRatio <= 0.8 ? 1.0 : Math.max(0, 1 - (timeRatio - 0.8) * 3);

      // 5. Distance score (closer places score higher, scale 0 to 15km)
      const distanceScore = currentLat !== null
        ? Math.max(0, 1 - Math.min(distKm, 15) / 15)
        : 1.0;

      // 6. Popularity score (0 to 1)
      const popularityScore = place.popularityScore / 100;

      const score =
        interestMatch * 0.30 +
        budgetFit * 0.20 +
        ratingScore * 0.15 +
        timeFit * 0.15 +
        distanceScore * 0.10 +
        popularityScore * 0.10;

      if (score > highestScore) {
        highestScore = score;
        bestCandidate = place;
        bestTravelTime = travelMinutes;
        bestDistance = distKm;
        bestCost = placeCost;
        bestVisitDuration = visitDuration;

        // Reason generator
        const reasonParts: string[] = [];
        if (isDirectCategoryMatch) {
          reasonParts.push(`Cocok dengan minat ${place.category}`);
        }
        if (place.rating >= 4.7) {
          reasonParts.push(`Rating favorit ${place.rating.toFixed(1)}/5`);
        }
        if (bestCost === 0) {
          reasonParts.push('Akses gratis');
        } else if (bestCost <= 25000) {
          reasonParts.push('Sangat hemat budget');
        }
        if (distKm > 0 && distKm < 3) {
          reasonParts.push('Sangat dekat dari destinasi sebelumnya');
        }

        bestReason = reasonParts.length > 0
          ? `Direkomendasikan karena: ${reasonParts.join(', ')}.`
          : `Pilihan populer dengan suasana khas Semarang.`;
      }
    }

    if (!bestCandidate) {
      // No more suitable places can fit the remaining constraints
      break;
    }

    // Commit best candidate to itinerary
    const arrivalTime = addMinutesToTime(currentTimeStr, bestTravelTime);
    const departureTime = addMinutesToTime(arrivalTime, bestVisitDuration);

    itineraryItems.push({
      order: itineraryItems.length + 1,
      place: bestCandidate,
      arrivalTime,
      departureTime,
      visitDurationMinutes: bestVisitDuration,
      travelTimeFromPreviousMinutes: bestTravelTime,
      distanceFromPreviousKm: bestDistance,
      estimatedCost: bestCost,
      recommendationReason: bestReason,
    });

    visitedPlaceIds.add(bestCandidate.id);
    currentLat = bestCandidate.latitude;
    currentLon = bestCandidate.longitude;
    currentTimeStr = departureTime;
    elapsedMinutes += bestTravelTime + bestVisitDuration;
    totalDistanceKm += bestDistance;
    totalCost += bestCost;
    remainingBudget = Math.max(0, remainingBudget - bestCost);
  }

  // Handle outcome
  if (itineraryItems.length === 0) {
    suggestions.push('Coba tambah budget perjalanan');
    suggestions.push('Tambah durasi waktu perjalanan (misal dari 2 jam ke 4-6 jam)');
    suggestions.push('Pilih variasi kategori yang lebih beragam (Kuliner, Wisata, Photo Spot)');
    suggestions.push('Gunakan transportasi yang lebih lincah seperti Motor atau Mobil');

    return {
      items: [],
      totalCost: 0,
      remainingBudget: budget,
      totalDurationMinutes: 0,
      totalDistanceKm: 0,
      success: false,
      suggestions,
    };
  }

  return {
    items: itineraryItems,
    totalCost,
    remainingBudget,
    totalDurationMinutes: elapsedMinutes,
    totalDistanceKm: Math.round(totalDistanceKm * 10) / 10,
    success: true,
    suggestions: [],
  };
}
