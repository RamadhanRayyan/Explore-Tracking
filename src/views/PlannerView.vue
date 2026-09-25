<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { usePlannerStore } from '@/stores/planner.store';
import { useTripStore } from '@/stores/trip.store';
import { useNotificationStore } from '@/stores/notification.store';
import { formatCurrency } from '@/utils/formatCurrency';
import { formatDurationHuman } from '@/utils/time';
import PlannerForm from '@/components/planner/PlannerForm.vue';
import ItineraryTimeline from '@/components/planner/ItineraryTimeline.vue';
import MapPreview from '@/components/map/MapPreview.vue';
import {
  Route,
  Coins,
  Clock,
  Sparkles,
  BookmarkCheck,
  Share2,
  Printer,
  FileDown,
  RotateCcw,
  AlertTriangle,
  Lightbulb,
} from 'lucide-vue-next';

const router = useRouter();
const plannerStore = usePlannerStore();
const tripStore = useTripStore();
const notification = useNotificationStore();

const customTripTitle = ref('');
const isSaving = ref(false);

const hasResult = computed(() => {
  return plannerStore.result && plannerStore.result.success && plannerStore.result.items.length > 0;
});

const handleSaveTrip = () => {
  isSaving.value = true;
  const saved = tripStore.saveCurrentPlannerTrip(customTripTitle.value);
  isSaving.value = false;
  if (saved) {
    router.push(`/trips/${saved.id}`);
  }
};

const handleShareTrip = async () => {
  if (!plannerStore.result) return;

  const summary = [
    `Rencana Perjalanan Explore Semarang:`,
    `Budget: ${formatCurrency(plannerStore.input.budget)}`,
    `Durasi: ${formatDurationHuman(plannerStore.result.totalDurationMinutes)}`,
    `Total Biaya: ${formatCurrency(plannerStore.result.totalCost)} (Sisa: ${formatCurrency(plannerStore.result.remainingBudget)})`,
    ``,
    ...plannerStore.result.items.map(
      (it, idx) => `${idx + 1}. [${it.arrivalTime} - ${it.departureTime}] ${it.place.name} (${it.place.category}) - ${it.estimatedCost === 0 ? 'Gratis' : formatCurrency(it.estimatedCost)}`
    ),
    ``,
    `Disusun di Explore Semarang`,
  ].join('\n');

  if (navigator.share && navigator.canShare && navigator.canShare({ text: summary })) {
    try {
      await navigator.share({
        title: 'Rencana Perjalanan Semarang',
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
      notification.showToast('Gagal menyalin ringkasan perjalanan.', 'error');
    }
  }
};

const handlePrintTrip = () => {
  window.print();
};

const handleExportJson = () => {
  if (!plannerStore.result) return;
  const exportPayload = {
    tripTitle: customTripTitle.value || 'Itinerary Explore Semarang',
    exportedAt: new Date().toISOString(),
    input: plannerStore.input,
    metrics: {
      totalCost: plannerStore.result.totalCost,
      remainingBudget: plannerStore.result.remainingBudget,
      totalDurationMinutes: plannerStore.result.totalDurationMinutes,
      totalDistanceKm: plannerStore.result.totalDistanceKm,
    },
    itinerary: plannerStore.result.items.map(it => ({
      order: it.order,
      placeName: it.place.name,
      category: it.place.category,
      address: it.place.address,
      arrivalTime: it.arrivalTime,
      departureTime: it.departureTime,
      estimatedCost: it.estimatedCost,
      reason: it.recommendationReason,
    })),
  };

  const blob = new Blob([JSON.stringify(exportPayload, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `semarang-itinerary-${Date.now()}.json`;
  a.click();
  URL.revokeObjectURL(url);
  notification.showToast('File itinerary JSON berhasil diunduh.');
};
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
    <!-- Header -->
    <div class="space-y-2">
      <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 dark:bg-teal-950/60 border border-teal-200/80 dark:border-teal-900/60 text-teal-800 dark:text-teal-300 text-xs font-semibold">
        <Sparkles class="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
        <span>Rekomendasi Berdasarkan Budget & Waktu</span>
      </div>

      <h1 class="font-display font-extrabold text-3xl sm:text-4xl text-stone-900 dark:text-zinc-50 tracking-tight">
        Plan My Trip Semarang
      </h1>
      <p class="text-sm text-stone-500 dark:text-zinc-400 max-w-2xl leading-relaxed">
        Masukkan dana yang kamu siapkan, durasi liburan, dan minat aktivitasmu. Sistem pintar kami akan memilihkan rute paling efisien dan ramah kantong.
      </p>
    </div>

    <!-- Planner Input Form (Hide when printing) -->
    <div class="no-print">
      <PlannerForm />
    </div>

    <!-- If Generation Failed with Error Suggestions -->
    <div
      v-if="plannerStore.result && !plannerStore.result.success"
      class="p-6 sm:p-8 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 rounded-3xl space-y-4"
    >
      <div class="flex items-center gap-3 text-amber-800 dark:text-amber-300">
        <AlertTriangle class="w-6 h-6 shrink-0" />
        <h3 class="font-display font-bold text-lg">
          Belum menemukan itinerary yang cocok.
        </h3>
      </div>

      <p class="text-xs sm:text-sm text-amber-900/80 dark:text-amber-200 leading-relaxed">
        Kombinasi budget, waktu, atau pilihan kategori kamu saat ini terlalu ketat. Coba beberapa saran berikut untuk mendapatkan rute terbaik:
      </p>

      <ul class="space-y-2 pt-2">
        <li
          v-for="(sug, idx) in plannerStore.result.suggestions"
          :key="idx"
          class="flex items-start gap-2.5 text-xs text-amber-950 dark:text-amber-100"
        >
          <Lightbulb class="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
          <span>{{ sug }}</span>
        </li>
      </ul>
    </div>

    <!-- Generated Itinerary Result Section -->
    <section v-if="hasResult && plannerStore.result" class="space-y-8 pt-4">
      <!-- Result Top Summary Banner -->
      <div
        class="p-6 sm:p-8 bg-gradient-to-br from-teal-900 via-stone-900 to-zinc-950 rounded-3xl text-white shadow-xl space-y-6"
      >
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span class="text-xs font-semibold uppercase tracking-wider text-teal-300">
              Hasil Rekomendasi Siap
            </span>
            <h2 class="font-display font-extrabold text-2xl sm:text-3xl text-white tracking-tight mt-0.5">
              Your Semarang Trip
            </h2>
          </div>

          <!-- Actions: Save, Share, Print, Export (no-print) -->
          <div class="flex flex-wrap items-center gap-2 no-print">
            <button
              type="button"
              @click="handleSaveTrip"
              :disabled="isSaving"
              class="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-zinc-950 font-bold text-xs shadow-md transition-all active:scale-95"
            >
              <BookmarkCheck class="w-4 h-4" />
              <span>Simpan Trip</span>
            </button>

            <button
              type="button"
              @click="handleShareTrip"
              class="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium text-xs backdrop-blur-md transition-colors"
              title="Bagikan ringkasan trip"
            >
              <Share2 class="w-4 h-4" />
              <span class="hidden sm:inline">Bagikan</span>
            </button>

            <button
              type="button"
              @click="handlePrintTrip"
              class="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium text-xs backdrop-blur-md transition-colors"
              title="Cetak itinerary"
            >
              <Printer class="w-4 h-4" />
              <span class="hidden sm:inline">Cetak</span>
            </button>

            <button
              type="button"
              @click="handleExportJson"
              class="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium text-xs backdrop-blur-md transition-colors"
              title="Export file JSON"
            >
              <FileDown class="w-4 h-4" />
              <span class="hidden sm:inline">JSON</span>
            </button>
          </div>
        </div>

        <!-- 4 Metric Cards -->
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
          <div class="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs">
            <span class="text-[11px] uppercase tracking-wider text-stone-400 block mb-1">
              Budget Awal
            </span>
            <span class="font-display font-bold text-lg sm:text-xl text-white tabular-nums">
              {{ formatCurrency(plannerStore.input.budget) }}
            </span>
          </div>

          <div class="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs">
            <span class="text-[11px] uppercase tracking-wider text-stone-400 block mb-1">
              Estimasi Pengeluaran
            </span>
            <span class="font-display font-bold text-lg sm:text-xl text-teal-300 tabular-nums">
              {{ formatCurrency(plannerStore.result.totalCost) }}
            </span>
          </div>

          <div class="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs">
            <span class="text-[11px] uppercase tracking-wider text-stone-400 block mb-1">
              Sisa Budget
            </span>
            <span class="font-display font-bold text-lg sm:text-xl text-emerald-400 tabular-nums">
              {{ formatCurrency(plannerStore.result.remainingBudget) }}
            </span>
          </div>

          <div class="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs">
            <span class="text-[11px] uppercase tracking-wider text-stone-400 block mb-1">
              Total Waktu
            </span>
            <span class="font-display font-bold text-lg sm:text-xl text-amber-300 tabular-nums">
              {{ formatDurationHuman(plannerStore.result.totalDurationMinutes) }}
            </span>
          </div>
        </div>
      </div>

      <!-- Main Columns: Timeline & Mini Map Route -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <!-- Timeline column (7 cols) -->
        <div class="lg:col-span-7 space-y-6">
          <div class="flex items-center justify-between">
            <h3 class="font-display font-bold text-xl text-stone-900 dark:text-zinc-100 flex items-center gap-2">
              <Clock class="w-5 h-5 text-teal-600 dark:text-teal-400" />
              <span>Jadwal Perjalanan Rinci</span>
            </h3>
            <span class="text-xs text-stone-500 dark:text-zinc-400">
              {{ plannerStore.result.items.length }} Destinasi Terpilih
            </span>
          </div>

          <ItineraryTimeline
            :items="plannerStore.result.items"
            :transport-mode="plannerStore.input.transport"
          />
        </div>

        <!-- Mini Map & Route Visualization column (5 cols) -->
        <aside class="lg:col-span-5 space-y-6 sticky top-24">
          <MapPreview
            :items="plannerStore.result.items"
            :total-distance-km="plannerStore.result.totalDistanceKm"
            :total-duration-minutes="plannerStore.result.totalDurationMinutes"
            :total-cost="plannerStore.result.totalCost"
          />

          <!-- Quick reset action -->
          <div class="no-print">
            <button
              type="button"
              @click="plannerStore.clearPlanner"
              class="w-full py-3 rounded-2xl border border-stone-200 dark:border-zinc-800 text-xs font-semibold text-stone-600 dark:text-zinc-400 hover:text-stone-900 dark:hover:text-zinc-100 hover:bg-stone-100 dark:hover:bg-zinc-850 flex items-center justify-center gap-2 transition-colors"
            >
              <RotateCcw class="w-4 h-4" />
              <span>Rencanakan Ulang dari Awal</span>
            </button>
          </div>
        </aside>
      </div>
    </section>
  </div>
</template>
