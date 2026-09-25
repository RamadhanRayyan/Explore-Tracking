import { defineStore } from 'pinia';
import type { PlaceCategory, PlannerInput, TransportMode, TravelStyle } from '@/types';
import { generateItinerary, type RecommendationResult } from '@/utils/recommendation';
import { useNotificationStore } from './notification.store';
import { usePlacesStore } from './places.store';

export const usePlannerStore = defineStore('planner', {
  state: () => ({
    input: {
      budget: 100000,
      durationMinutes: 360, // 6 jam
      startTime: '09:00',
      interests: ['Kuliner', 'Photo Spot', 'Heritage'] as PlaceCategory[],
      transport: 'motor' as TransportMode,
      travelStyle: 'balanced' as TravelStyle,
    } as PlannerInput,

    result: null as RecommendationResult | null,
    isGenerating: false,
    error: null as string | null,
  }),

  actions: {
    setBudget(amount: number) {
      this.input.budget = amount;
    },
    setDuration(minutes: number) {
      this.input.durationMinutes = minutes;
    },
    setStartTime(time: string) {
      this.input.startTime = time;
    },
    toggleInterest(category: PlaceCategory) {
      const idx = this.input.interests.indexOf(category);
      if (idx !== -1) {
        if (this.input.interests.length > 1) {
          this.input.interests.splice(idx, 1);
        }
      } else {
        this.input.interests.push(category);
      }
    },
    setTransport(transport: TransportMode) {
      this.input.transport = transport;
    },
    setTravelStyle(style: TravelStyle) {
      this.input.travelStyle = style;
    },

    generateTrip(): RecommendationResult {
      this.isGenerating = true;
      this.error = null;

      try {
        const placesStore = usePlacesStore();
        const output = generateItinerary(this.input, placesStore.allPlaces);

        this.result = output;
        const notification = useNotificationStore();

        if (output.success && output.items.length > 0) {
          notification.showToast(`Itinerary siap! ${output.items.length} destinasi disusun.`);
        } else {
          this.error = 'Belum menemukan itinerary yang cocok.';
          notification.showToast('Belum menemukan rute yang pas. Silakan sesuaikan budget atau waktu.', 'warning');
        }

        return output;
      } catch (err: any) {
        this.error = 'Terjadi kendala saat menyusun itinerary.';
        return {
          items: [],
          totalCost: 0,
          remainingBudget: this.input.budget,
          totalDurationMinutes: 0,
          totalDistanceKm: 0,
          success: false,
          suggestions: ['Silakan coba kembali atau gunakan preset yang tersedia.'],
        };
      } finally {
        this.isGenerating = false;
      }
    },

    clearPlanner() {
      this.result = null;
      this.error = null;
      this.input = {
        budget: 100000,
        durationMinutes: 360,
        startTime: '09:00',
        interests: ['Kuliner', 'Photo Spot', 'Heritage'],
        transport: 'motor',
        travelStyle: 'balanced',
      };
    },
  },

  persist: {
    storage: sessionStorage, // as specified in architecture requirement
  },
});
