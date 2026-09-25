<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch } from 'vue';
import L from 'leaflet';
import type { ItineraryItem } from '@/types';
import { formatCurrency } from '@/utils/formatCurrency';
import { formatDurationHuman } from '@/utils/time';
import { Route, Clock, Coins, MapPin } from 'lucide-vue-next';

const props = defineProps<{
  items: ItineraryItem[];
  totalDistanceKm: number;
  totalDurationMinutes: number;
  totalCost: number;
}>();

const previewContainer = ref<HTMLDivElement | null>(null);
let mapInstance: L.Map | null = null;
let layerGroup: L.LayerGroup | null = null;
let polyline: L.Polyline | null = null;

const createNumberedPin = (num: number, title: string) => {
  const html = `
    <div style="transform: translate(-50%, -100%);">
      <div style="background-color: #0d9488; color: white; width: 30px; height: 30px; border-radius: 50% 50% 50% 0; transform: rotate(-45deg); display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 8px rgba(0,0,0,0.3); border: 2px solid white; font-weight: bold;">
        <span style="transform: rotate(45deg); font-size: 13px;">${num}</span>
      </div>
    </div>
  `;
  return L.divIcon({
    className: 'numbered-pin',
    html,
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -32],
  });
};

const renderRoute = () => {
  if (!mapInstance || !layerGroup) return;

  layerGroup.clearLayers();
  if (polyline) {
    polyline.remove();
    polyline = null;
  }

  if (props.items.length === 0) return;

  const latlngs: [number, number][] = [];

  props.items.forEach((item, index) => {
    const lat = item.place.latitude;
    const lng = item.place.longitude;
    latlngs.push([lat, lng]);

    const icon = createNumberedPin(index + 1, item.place.name);
    const marker = L.marker([lat, lng], { icon });

    marker.bindPopup(`
      <div style="padding: 6px 8px; font-family: inherit;">
        <div style="font-size: 11px; color: #0d9488; font-weight: 700;">Stop ${index + 1} (${item.arrivalTime})</div>
        <div style="font-size: 13px; font-weight: bold; color: #18181b;">${item.place.name}</div>
        <div style="font-size: 11px; color: #71717a;">${item.place.category} · ${formatCurrency(item.estimatedCost)}</div>
      </div>
    `);

    layerGroup!.addLayer(marker);
  });

  if (latlngs.length > 1) {
    polyline = L.polyline(latlngs, {
      color: '#0d9488',
      weight: 4,
      opacity: 0.85,
      dashArray: '8, 8',
    }).addTo(mapInstance);

    const bounds = L.latLngBounds(latlngs);
    mapInstance.fitBounds(bounds, { padding: [40, 40] });
  } else if (latlngs.length === 1) {
    mapInstance.setView(latlngs[0], 14);
  }
};

onMounted(() => {
  if (!previewContainer.value) return;

  mapInstance = L.map(previewContainer.value, {
    zoomControl: false,
    attributionControl: false,
  }).setView([-6.9904, 110.4229], 13);

  L.control.zoom({ position: 'bottomright' }).addTo(mapInstance);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 18,
  }).addTo(mapInstance);

  layerGroup = L.layerGroup().addTo(mapInstance);

  renderRoute();
});

watch(() => props.items, () => {
  renderRoute();
}, { deep: true });

onBeforeUnmount(() => {
  if (mapInstance) {
    mapInstance.remove();
    mapInstance = null;
  }
});
</script>

<template>
  <div class="bg-white dark:bg-zinc-900 border border-stone-200/80 dark:border-zinc-800 rounded-3xl overflow-hidden shadow-xs space-y-4 p-5">
    <div class="flex items-center justify-between">
      <h4 class="font-display font-bold text-base text-stone-900 dark:text-zinc-100 flex items-center gap-2">
        <Route class="w-4 h-4 text-teal-600 dark:text-teal-400" />
        Visualisasi Rute Perjalanan
      </h4>
      <span class="text-xs text-stone-500 dark:text-zinc-400">
        {{ items.length }} Destinasi Terhubung
      </span>
    </div>

    <!-- Mini Map Leaflet Container -->
    <div ref="previewContainer" class="w-full h-64 sm:h-72 rounded-2xl overflow-hidden border border-stone-100 dark:border-zinc-800 z-10" />

    <!-- Route Metrics Bar -->
    <div class="grid grid-cols-3 gap-2 pt-2 text-center">
      <div class="p-3 bg-stone-50 dark:bg-zinc-850 rounded-2xl border border-stone-100 dark:border-zinc-800">
        <div class="flex items-center justify-center gap-1 text-[11px] font-semibold text-stone-500 dark:text-zinc-400 mb-0.5">
          <Route class="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
          <span>Jarak Rute</span>
        </div>
        <span class="text-xs sm:text-sm font-bold text-stone-900 dark:text-zinc-100 tabular-nums">
          {{ totalDistanceKm }} km
        </span>
      </div>

      <div class="p-3 bg-stone-50 dark:bg-zinc-850 rounded-2xl border border-stone-100 dark:border-zinc-800">
        <div class="flex items-center justify-center gap-1 text-[11px] font-semibold text-stone-500 dark:text-zinc-400 mb-0.5">
          <Clock class="w-3.5 h-3.5 text-amber-500" />
          <span>Total Durasi</span>
        </div>
        <span class="text-xs sm:text-sm font-bold text-stone-900 dark:text-zinc-100 tabular-nums">
          {{ formatDurationHuman(totalDurationMinutes) }}
        </span>
      </div>

      <div class="p-3 bg-stone-50 dark:bg-zinc-850 rounded-2xl border border-stone-100 dark:border-zinc-800">
        <div class="flex items-center justify-center gap-1 text-[11px] font-semibold text-stone-500 dark:text-zinc-400 mb-0.5">
          <Coins class="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
          <span>Biaya Rute</span>
        </div>
        <span class="text-xs sm:text-sm font-bold text-stone-900 dark:text-zinc-100 tabular-nums">
          {{ formatCurrency(totalCost) }}
        </span>
      </div>
    </div>

    <p class="text-[11px] text-stone-400 dark:text-zinc-500 text-center leading-relaxed">
      Estimasi rute & waktu perjalanan menggunakan Haversine distance, bukan navigasi jalan real-time.
    </p>
  </div>
</template>
