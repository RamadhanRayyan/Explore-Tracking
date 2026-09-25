<script setup lang="ts">
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useTripStore } from '@/stores/trip.store';
import { useNotificationStore } from '@/stores/notification.store';
import { formatCurrency } from '@/utils/formatCurrency';
import { formatDurationHuman } from '@/utils/time';
import ItineraryTimeline from '@/components/planner/ItineraryTimeline.vue';
import MapPreview from '@/components/map/MapPreview.vue';
import EmptyState from '@/components/common/EmptyState.vue';
import {
  ArrowLeft,
  Share2,
  Printer,
  FileDown,
  Trash2,
  Calendar,
  Clock,
  Coins,
  Route,
} from 'lucide-vue-next';

const route = useRoute();
const router = useRouter();
const tripStore = useTripStore();
const notification = useNotificationStore();

const trip = computed(() => {
  return tripStore.getTripById(String(route.params.id));
});

const handleDelete = () => {
  if (!trip.value) return;
  if (confirm('Apakah kamu yakin ingin menghapus trip ini?')) {
    tripStore.deleteTrip(trip.value.id);
    router.push('/trips');
  }
};

const handleShare = async () => {
  if (!trip.value) return;

  const summary = [
    `Rencana Perjalanan: ${trip.value.title}`,
    `Dibuat: ${trip.value.createdAt}`,
    `Total Estimasi: ${formatCurrency(trip.value.totalCost)} (Sisa: ${formatCurrency(trip.value.remainingBudget)})`,
    `Total Durasi: ${formatDurationHuman(trip.value.totalDurationMinutes)} (${trip.value.totalDistanceKm} km)`,
    ``,
    ...trip.value.items.map(
      (it, idx) => `${idx + 1}. [${it.arrivalTime} - ${it.departureTime}] ${it.place.name} (${it.place.category}) - ${it.estimatedCost === 0 ? 'Gratis' : formatCurrency(it.estimatedCost)}`
    ),
    ``,
    `Disusun melalui Explore Semarang`,
  ].join('\n');

  if (navigator.share && navigator.canShare && navigator.canShare({ text: summary })) {
    try {
      await navigator.share({
        title: trip.value.title,
        text: summary,
      });
    } catch {
      // User cancelled
    }
  } else {
    try {
      await navigator.clipboard.writeText(summary);
      notification.showToast('Ringkasan itinerary berhasil disalin ke clipboard!');
    } catch {
      notification.showToast('Gagal menyalin.', 'error');
    }
  }
};

const handlePrint = () => {
  window.print();
};

const handleExportJson = () => {
  if (!trip.value) return;
  const blob = new Blob([JSON.stringify(trip.value, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `trip-${trip.value.id}.json`;
  a.click();
  URL.revokeObjectURL(url);
  notification.showToast('File JSON berhasil diunduh.');
};
</script>

<template>
  <div v-if="trip" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
    <!-- Back button & Actions (no-print) -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 no-print">
      <button
        type="button"
        @click="router.push('/trips')"
        class="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-500 dark:text-zinc-400 hover:text-stone-900 dark:hover:text-zinc-100 transition-colors"
      >
        <ArrowLeft class="w-4 h-4" />
        <span>Kembali ke My Trips</span>
      </button>

      <div class="flex flex-wrap items-center gap-2">
        <button
          type="button"
          @click="handleShare"
          class="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-stone-100 dark:bg-zinc-800 text-stone-700 dark:text-zinc-300 hover:bg-stone-200 text-xs font-semibold transition-colors"
        >
          <Share2 class="w-4 h-4" />
          <span>Bagikan</span>
        </button>

        <button
          type="button"
          @click="handlePrint"
          class="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-stone-100 dark:bg-zinc-800 text-stone-700 dark:text-zinc-300 hover:bg-stone-200 text-xs font-semibold transition-colors"
        >
          <Printer class="w-4 h-4" />
          <span>Cetak</span>
        </button>

        <button
          type="button"
          @click="handleExportJson"
          class="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-stone-100 dark:bg-zinc-800 text-stone-700 dark:text-zinc-300 hover:bg-stone-200 text-xs font-semibold transition-colors"
        >
          <FileDown class="w-4 h-4" />
          <span>JSON</span>
        </button>

        <button
          type="button"
          @click="handleDelete"
          class="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 hover:bg-rose-100 text-xs font-semibold transition-colors"
        >
          <Trash2 class="w-4 h-4" />
          <span>Hapus</span>
        </button>
      </div>
    </div>

    <!-- Trip Header Info -->
    <div
      class="p-6 sm:p-8 bg-gradient-to-br from-teal-900 via-stone-900 to-zinc-950 rounded-3xl text-white shadow-xl space-y-6"
    >
      <div>
        <span class="text-xs font-semibold uppercase tracking-wider text-teal-300 block mb-1">
          Tersimpan pada {{ trip.createdAt }}
        </span>
        <h1 class="font-display font-extrabold text-2xl sm:text-3xl text-white tracking-tight">
          {{ trip.title }}
        </h1>
        <p class="text-xs sm:text-sm text-stone-300 mt-1">
          Moda: {{ trip.input.transport.toUpperCase() }} · Gaya: {{ trip.input.travelStyle }} · {{ trip.items.length }} Destinasi
        </p>
      </div>

      <!-- Metrics -->
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
        <div class="p-3.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs">
          <span class="text-[10px] text-stone-400 uppercase tracking-wider block">Budget Awal</span>
          <span class="font-display font-bold text-base sm:text-lg text-white tabular-nums">
            {{ formatCurrency(trip.input.budget) }}
          </span>
        </div>

        <div class="p-3.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs">
          <span class="text-[10px] text-stone-400 uppercase tracking-wider block">Estimasi Biaya</span>
          <span class="font-display font-bold text-base sm:text-lg text-teal-300 tabular-nums">
            {{ formatCurrency(trip.totalCost) }}
          </span>
        </div>

        <div class="p-3.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs">
          <span class="text-[10px] text-stone-400 uppercase tracking-wider block">Sisa Dana</span>
          <span class="font-display font-bold text-base sm:text-lg text-emerald-400 tabular-nums">
            {{ formatCurrency(trip.remainingBudget) }}
          </span>
        </div>

        <div class="p-3.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs">
          <span class="text-[10px] text-stone-400 uppercase tracking-wider block">Total Waktu</span>
          <span class="font-display font-bold text-base sm:text-lg text-amber-300 tabular-nums">
            {{ formatDurationHuman(trip.totalDurationMinutes) }}
          </span>
        </div>
      </div>
    </div>

    <!-- Main Itinerary Details Layout -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      <!-- Timeline (7 cols) -->
      <div class="lg:col-span-7 space-y-6">
        <h3 class="font-display font-bold text-xl text-stone-900 dark:text-zinc-100 flex items-center gap-2">
          <Clock class="w-5 h-5 text-teal-600 dark:text-teal-400" />
          <span>Timeline Perjalanan</span>
        </h3>

        <ItineraryTimeline
          :items="trip.items"
          :transport-mode="trip.input.transport"
        />
      </div>

      <!-- Map Route Preview (5 cols) -->
      <aside class="lg:col-span-5 space-y-6 sticky top-24">
        <MapPreview
          :items="trip.items"
          :total-distance-km="trip.totalDistanceKm"
          :total-duration-minutes="trip.totalDurationMinutes"
          :total-cost="trip.totalCost"
        />
      </aside>
    </div>
  </div>

  <div v-else class="max-w-md mx-auto py-20 px-4">
    <EmptyState
      title="Rencana perjalanan tidak ditemukan."
      description="Trip ini mungkin sudah dihapus dari penyimpanan peramban."
      action-label="Kembali ke My Trips"
      action-route="/trips"
    />
  </div>
</template>
