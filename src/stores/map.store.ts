import { defineStore } from 'pinia';
import type { PlaceCategory } from '@/types';

// Default center: Semarang City Center (Simpang Lima area)
export const DEFAULT_SEMARANG_COORDS = {
  lat: -6.9904,
  lng: 110.4229,
  zoom: 13,
};

export const useMapStore = defineStore('map', {
  state: () => ({
    selectedCategory: 'All' as PlaceCategory | 'All',
    selectedPlaceId: null as string | null,
    center: [DEFAULT_SEMARANG_COORDS.lat, DEFAULT_SEMARANG_COORDS.lng] as [number, number],
    zoom: DEFAULT_SEMARANG_COORDS.zoom,
    userLocation: null as [number, number] | null,
    isLocating: false,
    locationPermissionError: null as string | null,
  }),

  actions: {
    setSelectedCategory(cat: PlaceCategory | 'All') {
      this.selectedCategory = cat;
    },
    setSelectedPlaceId(id: string | null) {
      this.selectedPlaceId = id;
    },
    setMapCenter(lat: number, lng: number, zoom?: number) {
      this.center = [lat, lng];
      if (zoom !== undefined) {
        this.zoom = zoom;
      }
    },
    resetToSemarangCenter() {
      this.center = [DEFAULT_SEMARANG_COORDS.lat, DEFAULT_SEMARANG_COORDS.lng];
      this.zoom = DEFAULT_SEMARANG_COORDS.zoom;
    },
    requestUserLocation(): Promise<[number, number] | null> {
      return new Promise((resolve) => {
        if (!navigator.geolocation) {
          this.locationPermissionError = 'Browser tidak mendukung geolokasi.';
          resolve(null);
          return;
        }

        this.isLocating = true;
        this.locationPermissionError = null;

        navigator.geolocation.getCurrentPosition(
          (pos) => {
            this.isLocating = false;
            const coords: [number, number] = [pos.coords.latitude, pos.coords.longitude];
            this.userLocation = coords;
            this.center = coords;
            this.zoom = 14;
            resolve(coords);
          },
          (err) => {
            this.isLocating = false;
            this.locationPermissionError =
              err.code === 1
                ? 'Izin lokasi tidak diberikan. Menampilkan pusat Kota Semarang.'
                : 'Tidak dapat mendeteksi lokasi saat ini.';
            resolve(null);
          },
          { timeout: 8000, enableHighAccuracy: true }
        );
      });
    },
  },

  persist: {
    storage: sessionStorage,
  },
});
