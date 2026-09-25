import { defineStore } from 'pinia';
import type { Trip } from '@/types';
import { useNotificationStore } from './notification.store';
import { usePlannerStore } from './planner.store';

export const useTripStore = defineStore('trip', {
  state: () => ({
    savedTrips: [] as Trip[],
  }),

  getters: {
    getTripById: (state) => {
      return (id: string): Trip | undefined => {
        return state.savedTrips.find(t => t.id === id);
      };
    },
    count: (state) => state.savedTrips.length,
  },

  actions: {
    saveCurrentPlannerTrip(title?: string): Trip | null {
      const planner = usePlannerStore();
      if (!planner.result || planner.result.items.length === 0) {
        return null;
      }

      const defaultTitle = title?.trim() || `Eksplorasi Semarang (${planner.result.items.length} Tempat)`;
      const dateStr = new Intl.DateTimeFormat('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }).format(new Date());

      const newTrip: Trip = {
        id: 'trip-' + Date.now(),
        title: defaultTitle,
        createdAt: dateStr,
        input: { ...planner.input },
        items: [...planner.result.items],
        totalCost: planner.result.totalCost,
        remainingBudget: planner.result.remainingBudget,
        totalDurationMinutes: planner.result.totalDurationMinutes,
        totalDistanceKm: planner.result.totalDistanceKm,
      };

      this.savedTrips.unshift(newTrip);

      const notification = useNotificationStore();
      notification.showToast('Perjalanan berhasil disimpan ke My Trips!');
      return newTrip;
    },

    deleteTrip(id: string) {
      this.savedTrips = this.savedTrips.filter(t => t.id !== id);
      const notification = useNotificationStore();
      notification.showToast('Trip berhasil dihapus.', 'info');
    },

    clearAllTrips() {
      this.savedTrips = [];
    },
  },

  persist: {
    storage: localStorage,
  },
});
