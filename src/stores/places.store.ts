import { defineStore } from 'pinia';
import { DEMO_PLACES } from '@/data/places';
import type { Place, PlaceCategory } from '@/types';
import { calculateHaversineDistance } from '@/utils/distance';
import { isPlaceOpenAtTime, minutesToTimeString } from '@/utils/time';

export type BudgetFilterType = 'all' | 'under25' | '25to50' | '50to100' | 'over100';
export type SortOptionType = 'recommended' | 'rating' | 'popular' | 'cheapest' | 'nearest';

export interface PlacesState {
  places: Place[];
  selectedCategory: PlaceCategory | 'All';
  selectedBudget: BudgetFilterType;
  selectedMinRating: number;
  searchQuery: string;
  selectedDistrict: string;
  openNowOnly: boolean;
  sortBy: SortOptionType;
  userLocation: { latitude: number; longitude: number } | null;
  recentSearches: string[];
}

export const usePlacesStore = defineStore('places', {
  state: (): PlacesState => ({
    places: [...DEMO_PLACES],
    selectedCategory: 'All',
    selectedBudget: 'all',
    selectedMinRating: 0,
    searchQuery: '',
    selectedDistrict: 'All',
    openNowOnly: false,
    sortBy: 'recommended',
    userLocation: null,
    recentSearches: ['Kota Lama', 'Lumpia', 'Lawang Sewu', 'Cafe Candi'],
  }),

  getters: {
    allPlaces(state): Place[] {
      return state.places;
    },

    getPlaceBySlug(state): (slug: string) => Place | undefined {
      return (slug: string): Place | undefined => {
        return state.places.find(p => p.slug === slug || p.id === slug);
      };
    },

    districts(state): string[] {
      const set = new Set<string>();
      state.places.forEach(p => {
        if (p.district) set.add(p.district);
      });
      return Array.from(set).sort();
    },

    filteredPlaces(state): Place[] {
      const q = state.searchQuery.trim().toLowerCase();
      const currentNowStr = minutesToTimeString(new Date().getHours() * 60 + new Date().getMinutes());

      return state.places.filter(place => {
        // 1. Search Query filter (name, category, district, tags, address)
        if (q) {
          const matchName = place.name.toLowerCase().includes(q);
          const matchCategory = place.category.toLowerCase().includes(q);
          const matchDistrict = place.district.toLowerCase().includes(q);
          const matchTags = place.tags.some(t => t.toLowerCase().includes(q));
          const matchAddress = place.address.toLowerCase().includes(q);
          if (!matchName && !matchCategory && !matchDistrict && !matchTags && !matchAddress) {
            return false;
          }
        }

        // 2. Category filter
        if (state.selectedCategory !== 'All' && place.category !== state.selectedCategory) {
          return false;
        }

        // 3. District filter
        if (state.selectedDistrict !== 'All' && place.district !== state.selectedDistrict) {
          return false;
        }

        // 4. Budget filter
        if (state.selectedBudget === 'under25' && place.priceMin > 25000) return false;
        if (state.selectedBudget === '25to50' && (place.priceMin > 50000 || place.priceMax < 25000)) return false;
        if (state.selectedBudget === '50to100' && (place.priceMin > 100000 || place.priceMax < 50000)) return false;
        if (state.selectedBudget === 'over100' && place.priceMax < 100000) return false;

        // 5. Rating filter
        if (state.selectedMinRating > 0 && place.rating < state.selectedMinRating) {
          return false;
        }

        // 6. Open Now filter
        if (state.openNowOnly) {
          const isOpen = isPlaceOpenAtTime(currentNowStr, place.openingHours.open, place.openingHours.close);
          if (!isOpen) return false;
        }

        return true;
      }).sort((a, b) => {
        if (state.sortBy === 'rating') {
          return b.rating - a.rating;
        }
        if (state.sortBy === 'popular') {
          return b.popularityScore - a.popularityScore;
        }
        if (state.sortBy === 'cheapest') {
          return a.priceMin - b.priceMin;
        }
        if (state.sortBy === 'nearest') {
          const refLat = state.userLocation?.latitude ?? -6.9904;
          const refLon = state.userLocation?.longitude ?? 110.4229;
          const distA = calculateHaversineDistance(refLat, refLon, a.latitude, a.longitude);
          const distB = calculateHaversineDistance(refLat, refLon, b.latitude, b.longitude);
          return distA - distB;
        }
        // 'recommended' default: blend of popularity and rating
        return (b.popularityScore * 0.6 + b.rating * 8) - (a.popularityScore * 0.6 + a.rating * 8);
      });
    },

    smartRecommendedPlaces(state): Place[] {
      return [...state.places].sort((a, b) => {
        const scoreA = a.popularityScore * 0.6 + a.rating * 8;
        const scoreB = b.popularityScore * 0.6 + b.rating * 8;
        return scoreB - scoreA;
      }).slice(0, 6);
    },

    featuredPlaces(state): Place[] {
      return [...state.places]
        .sort((a, b) => b.popularityScore - a.popularityScore)
        .slice(0, 4);
    },
  },

  actions: {
    setCategory(cat: PlaceCategory | 'All') {
      this.selectedCategory = cat;
    },
    setBudget(budget: BudgetFilterType) {
      this.selectedBudget = budget;
    },
    setMinRating(rating: number) {
      this.selectedMinRating = rating;
    },
    setSearchQuery(q: string) {
      this.searchQuery = q;
    },
    setSortBy(sort: SortOptionType) {
      this.sortBy = sort;
    },
    setUserLocation(lat: number, lon: number) {
      this.userLocation = { latitude: lat, longitude: lon };
    },
    resetFilters() {
      this.selectedCategory = 'All';
      this.selectedBudget = 'all';
      this.selectedMinRating = 0;
      this.searchQuery = '';
      this.selectedDistrict = 'All';
      this.openNowOnly = false;
      this.sortBy = 'recommended';
    },

    addRecentSearch(query: string) {
      const trimmed = query.trim();
      if (!trimmed) return;
      this.recentSearches = [trimmed, ...this.recentSearches.filter(s => s.toLowerCase() !== trimmed.toLowerCase())].slice(0, 8);
    },
    clearRecentSearches() {
      this.recentSearches = [];
    },

    addPlace(newPlace: Place) {
      this.places.unshift(newPlace);
    },
    updatePlace(updatedPlace: Place) {
      const idx = this.places.findIndex(p => p.id === updatedPlace.id);
      if (idx !== -1) {
        this.places[idx] = { ...updatedPlace };
      }
    },
    deletePlace(placeId: string) {
      this.places = this.places.filter(p => p.id !== placeId);
    },
    resetToDemoData() {
      this.places = [...DEMO_PLACES];
    },
  },

  persist: {
    storage: localStorage,
    paths: ['places', 'recentSearches'],
  },
});
