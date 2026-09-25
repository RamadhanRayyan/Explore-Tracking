<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch, computed } from 'vue';
import { useRouter } from 'vue-router';
import L from 'leaflet';
import type { Place, PlaceCategory } from '@/types';
import { usePlacesStore } from '@/stores/places.store';
import { useMapStore, DEFAULT_SEMARANG_COORDS } from '@/stores/map.store';
import { CATEGORIES } from '@/data/categories';
import { formatPriceRange } from '@/utils/formatCurrency';
import { Navigation, Compass, Layers, AlertCircle } from 'lucide-vue-next';

const props = withDefaults(
  defineProps<{
    places?: Place[];
    heightClass?: string;
    showCategoryFilters?: boolean;
    initialCenter?: [number, number];
    initialZoom?: number;
  }>(),
  {
    heightClass: 'h-[calc(100vh-140px)] min-h-[500px]',
    showCategoryFilters: true,
  }
);

const router = useRouter();
const placesStore = usePlacesStore();
const mapStore = useMapStore();

const mapContainer = ref<HTMLDivElement | null>(null);
let mapInstance: L.Map | null = null;
let markerLayerGroup: L.LayerGroup | null = null;
let userLocationMarker: L.Marker | null = null;

const displayPlaces = computed(() => {
  const source = props.places || placesStore.allPlaces;
  if (mapStore.selectedCategory === 'All') return source;
  return source.filter(p => p.category === mapStore.selectedCategory);
});

// Category pin color generator
const getCategoryColor = (cat: PlaceCategory): string => {
  switch (cat) {
    case 'Wisata': return '#059669'; // emerald
    case 'Kuliner': return '#ea580c'; // orange
    case 'Cafe': return '#78350f'; // amber-900
    case 'Photo Spot': return '#0d9488'; // teal
    case 'Night Hangout': return '#4f46e5'; // indigo
    case 'Heritage': return '#e11d48'; // rose
    case 'Nature': return '#16a34a'; // green
    case 'Shopping': return '#2563eb'; // blue
    default: return '#0d9488';
  }
};

const createCustomPinIcon = (place: Place) => {
  const color = getCategoryColor(place.category);
  const html = `
    <div style="transform: translate(-50%, -100%);">
      <div style="background-color: ${color}; width: 34px; height: 34px; border-radius: 50% 50% 50% 0; transform: rotate(-45deg); display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 10px rgba(0,0,0,0.3); border: 2px solid white;">
        <span style="transform: rotate(45deg); font-size: 14px;">📍</span>
      </div>
    </div>
  `;
  return L.divIcon({
    className: 'custom-leaflet-pin',
    html,
    iconSize: [34, 34],
    iconAnchor: [17, 34],
    popupAnchor: [0, -36],
  });
};

const renderMarkers = () => {
  if (!mapInstance || !markerLayerGroup) return;

  markerLayerGroup.clearLayers();

  displayPlaces.value.forEach(place => {
    const icon = createCustomPinIcon(place);
    const marker = L.marker([place.latitude, place.longitude], { icon });

    const formattedPrice = formatPriceRange(place.priceMin, place.priceMax, true);

    const popupHtml = `
      <div style="width: 220px; overflow: hidden; font-family: inherit;">
        <div style="position: relative; height: 110px; background-color: #f4f4f5;">
          <img
            src="${place.image}"
            alt="${place.name}"
            style="width: 100%; height: 100%; object-fit: cover;"
            onerror="this.style.display='none'"
          />
          <div style="position: absolute; top: 6px; left: 6px; background: rgba(0,0,0,0.75); color: white; padding: 2px 6px; border-radius: 4px; font-size: 10px; font-weight: 600;">
            ${place.category}
          </div>
        </div>
        <div style="padding: 10px 12px;">
          <div style="font-weight: 700; font-size: 13px; line-height: 1.2; margin-bottom: 4px; color: #18181b;">
            ${place.name}
          </div>
          <div style="display: flex; align-items: center; justify-content: space-between; font-size: 11px; margin-bottom: 8px; color: #52525b;">
            <span style="color: #f59e0b; font-weight: 600;">⭐ ${place.rating.toFixed(1)} (${place.reviewCount})</span>
            <span style="font-weight: 600; color: #0d9488;">${formattedPrice}</span>
          </div>
          <button
            id="popup-btn-${place.slug}"
            style="display: block; width: 100%; padding: 6px 0; background-color: #0d9488; color: white; border: none; border-radius: 8px; font-size: 11px; font-weight: 600; cursor: pointer; text-align: center;"
          >
            Lihat Detail
          </button>
        </div>
      </div>
    `;

    marker.bindPopup(popupHtml, { maxWidth: 240 });

    marker.on('popupopen', () => {
      setTimeout(() => {
        const btn = document.getElementById(`popup-btn-${place.slug}`);
        if (btn) {
          btn.onclick = () => {
            router.push(`/places/${place.slug}`);
          };
        }
      }, 50);
    });

    markerLayerGroup.addLayer(marker);
  });
};

const initMap = () => {
  if (!mapContainer.value) return;

  const centerCoords = props.initialCenter || mapStore.center;
  const zoomLevel = props.initialZoom || mapStore.zoom;

  mapInstance = L.map(mapContainer.value, {
    zoomControl: false,
    attributionControl: true,
  }).setView(centerCoords, zoomLevel);

  // Add zoom control top-right
  L.control.zoom({ position: 'topright' }).addTo(mapInstance);

  // OpenStreetMap standard tile provider
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a> contributors',
  }).addTo(mapInstance);

  markerLayerGroup = L.layerGroup().addTo(mapInstance);

  renderMarkers();

  // Update map store center on move
  mapInstance.on('moveend', () => {
    if (mapInstance) {
      const c = mapInstance.getCenter();
      mapStore.setMapCenter(c.lat, c.lng, mapInstance.getZoom());
    }
  });
};

const handleLocateMe = async () => {
  const coords = await mapStore.requestUserLocation();
  if (coords && mapInstance) {
    mapInstance.flyTo(coords, 15, { duration: 1.5 });

    if (userLocationMarker) {
      userLocationMarker.setLatLng(coords);
    } else {
      const userHtml = `
        <div style="width: 20px; height: 20px; border-radius: 50%; background-color: #0284c7; border: 3px solid white; box-shadow: 0 0 10px rgba(2, 132, 199, 0.8);"></div>
      `;
      userLocationMarker = L.marker(coords, {
        icon: L.divIcon({ html: userHtml, className: 'user-pulse', iconSize: [20, 20], iconAnchor: [10, 10] }),
      }).addTo(mapInstance);
      userLocationMarker.bindPopup('<b>Lokasi Kamu Saat Ini</b>');
    }
  }
};

const handleCenterSemarang = () => {
  if (mapInstance) {
    mapInstance.flyTo([DEFAULT_SEMARANG_COORDS.lat, DEFAULT_SEMARANG_COORDS.lng], DEFAULT_SEMARANG_COORDS.zoom, {
      duration: 1.2,
    });
    mapStore.resetToSemarangCenter();
  }
};

watch(displayPlaces, () => {
  renderMarkers();
});

onMounted(() => {
  initMap();
});

onBeforeUnmount(() => {
  if (mapInstance) {
    mapInstance.remove();
    mapInstance = null;
  }
});
</script>

<template>
  <div class="relative w-full rounded-2xl overflow-hidden border border-stone-200 dark:border-zinc-800 shadow-xs bg-stone-100 dark:bg-zinc-900">
    <!-- Category Chips Floating on Top of Map -->
    <div
      v-if="showCategoryFilters"
      class="absolute top-4 left-4 z-20 flex flex-wrap gap-1.5 max-w-[85%] sm:max-w-xl pointer-events-auto bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md p-2 rounded-2xl border border-stone-200/80 dark:border-zinc-800 shadow-md overflow-x-auto"
    >
      <button
        type="button"
        @click="mapStore.setSelectedCategory('All')"
        :class="[
          'px-2.5 py-1 text-xs font-semibold rounded-xl transition-colors whitespace-nowrap',
          mapStore.selectedCategory === 'All'
            ? 'bg-teal-600 text-white shadow-xs'
            : 'text-stone-700 dark:text-zinc-300 hover:bg-stone-100 dark:hover:bg-zinc-800'
        ]"
      >
        Semua ({{ (places || placesStore.allPlaces).length }})
      </button>

      <button
        v-for="cat in CATEGORIES"
        :key="cat.id"
        type="button"
        @click="mapStore.setSelectedCategory(cat.name)"
        :class="[
          'inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-xl transition-colors whitespace-nowrap',
          mapStore.selectedCategory === cat.name
            ? 'bg-teal-600 text-white shadow-xs'
            : 'text-stone-700 dark:text-zinc-300 hover:bg-stone-100 dark:hover:bg-zinc-800'
        ]"
      >
        <span>{{ cat.emoji }}</span>
        <span>{{ cat.name }}</span>
      </button>
    </div>

    <!-- Map Controls Floating on Bottom Left -->
    <div class="absolute bottom-6 left-4 z-20 flex flex-col gap-2 pointer-events-auto">
      <!-- Center Semarang Button -->
      <button
        type="button"
        @click="handleCenterSemarang"
        title="Pusat Kota Semarang"
        class="flex items-center gap-1.5 px-3 py-2 bg-white dark:bg-zinc-900 border border-stone-200 dark:border-zinc-800 text-stone-800 dark:text-zinc-200 hover:text-teal-600 dark:hover:text-teal-400 rounded-xl shadow-md text-xs font-semibold backdrop-blur-md transition-all active:scale-95"
      >
        <Compass class="w-4 h-4 text-teal-600 dark:text-teal-400" />
        <span class="hidden sm:inline">Pusat Semarang</span>
      </button>

      <!-- Locate User Button -->
      <button
        type="button"
        @click="handleLocateMe"
        :disabled="mapStore.isLocating"
        title="Temukan Lokasi Saya"
        class="flex items-center gap-1.5 px-3 py-2 bg-white dark:bg-zinc-900 border border-stone-200 dark:border-zinc-800 text-stone-800 dark:text-zinc-200 hover:text-teal-600 dark:hover:text-teal-400 rounded-xl shadow-md text-xs font-semibold backdrop-blur-md transition-all active:scale-95 disabled:opacity-50"
      >
        <Navigation :class="['w-4 h-4 text-blue-600', mapStore.isLocating ? 'animate-spin' : '']" />
        <span class="hidden sm:inline">Lokasi Saya</span>
      </button>
    </div>

    <!-- Location Permission Error Warning -->
    <div
      v-if="mapStore.locationPermissionError"
      class="absolute bottom-6 right-4 z-20 max-w-xs p-3 bg-stone-900/90 text-stone-100 rounded-xl text-xs backdrop-blur-md flex items-center gap-2"
    >
      <AlertCircle class="w-4 h-4 text-amber-400 shrink-0" />
      <span>{{ mapStore.locationPermissionError }}</span>
    </div>

    <!-- Leaflet DOM element -->
    <div ref="mapContainer" :class="['w-full', heightClass]" />
  </div>
</template>
